import React, { useMemo } from "react";
import { useThree } from "@react-three/fiber";
import { ThreeCanvas } from "@remotion/three";
import { useCurrentFrame } from "remotion";
import * as THREE from "three";
import { basis, cameraPose, ISLAND, Pose } from "../lib/camera";
import { arrive, leave, ramp } from "../lib/ease";
import { CY, FOCAL, H, W } from "../lib/format";
import { lightLevel } from "../lib/light";
import { noise1, rnd } from "../lib/noise";
import { LF } from "../lib/time";

// The principal point sits at y = CY: render a taller virtual frame and show the window of it.
const FULL_H = 2 * (H - CY);
const FULL_FOV = (2 * Math.atan(FULL_H / 2 / FOCAL) * 180) / Math.PI;

const CameraRig: React.FC<{ pose: Pose }> = ({ pose }) => {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera & { manual?: boolean };
  const { u } = basis(pose);
  camera.manual = true;
  camera.fov = FULL_FOV;
  camera.aspect = W / FULL_H;
  camera.near = 0.5;
  camera.far = 400;
  camera.setViewOffset(W, FULL_H, 0, FULL_H / 2 - CY, W, H);
  camera.position.set(...pose.pos);
  camera.up.set(...u);
  camera.lookAt(...pose.target);
  camera.updateProjectionMatrix();
  return null;
};

const canvasTexture = (w: number, h: number, draw: (c: CanvasRenderingContext2D) => void) => {
  const el = document.createElement("canvas");
  el.width = w;
  el.height = h;
  const ctx = el.getContext("2d");
  if (!ctx) throw new Error("2D canvas unavailable");
  draw(ctx);
  const tex = new THREE.CanvasTexture(el);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
};

const Sky: React.FC<{ lv: number }> = ({ lv }) => {
  const tex = useMemo(
    () =>
      canvasTexture(512, 1024, (c) => {
        const g = c.createLinearGradient(0, 0, 0, 1024);
        g.addColorStop(0, "#1a1650");
        g.addColorStop(0.5, "#0c0d2a");
        g.addColorStop(1, "#05060f");
        c.fillStyle = g;
        c.fillRect(0, 0, 512, 1024);
        const glows: [number, number, string][] = [[120, 300, "139,92,255"], [330, 360, "61,224,255"], [250, 250, "139,92,255"]];
        glows.forEach(([x, y, rgb], i) => {
          const r = c.createRadialGradient(x, y, 10, x, y, 260);
          r.addColorStop(0, `rgba(${rgb},${0.24 - i * 0.05})`);
          r.addColorStop(1, `rgba(${rgb},0)`);
          c.fillStyle = r;
          c.fillRect(0, 0, 512, 1024);
        });
      }),
    [],
  );
  return (
    <mesh position={[0, 10, -150]}>
      <planeGeometry args={[300, 440]} />
      <meshBasicMaterial map={tex} color={new THREE.Color(lv, lv, lv)} fog={false} />
    </mesh>
  );
};

const SPARKS = 460;
const Sparks: React.FC<{ frame: number; lv: number }> = ({ frame, lv }) => {
  const dot = useMemo(
    () =>
      canvasTexture(64, 64, (c) => {
        const g = c.createRadialGradient(32, 32, 0, 32, 32, 32);
        g.addColorStop(0, "rgba(210,245,255,1)");
        g.addColorStop(1, "rgba(210,245,255,0)");
        c.fillStyle = g;
        c.fillRect(0, 0, 64, 64);
      }),
    [],
  );
  const positions = useMemo(() => {
    const a = new Float32Array(SPARKS * 3);
    for (let i = 0; i < SPARKS; i++) {
      const rise = (rnd(i * 5 + 3, 0.004, 0.014) * frame) % 50;
      a[i * 3] = rnd(i * 5, -34, 34) + Math.sin(frame / 90 + i) * 0.4;
      a[i * 3 + 1] = ((rnd(i * 5 + 1, -25, 25) + rise + 25) % 50) - 25;
      a[i * 3 + 2] = rnd(i * 5 + 2, -60, 12);
    }
    return a;
  }, [frame]);
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial map={dot} size={0.24} sizeAttenuation transparent opacity={0.6 * lv} depthWrite={false} blending={THREE.AdditiveBlending} color="#9feeff" />
    </points>
  );
};

const DRIFT = 30;
const Drift: React.FC<{ frame: number }> = ({ frame }) => {
  const items = useMemo(
    () =>
      Array.from({ length: DRIFT }, (_, i) => {
        const side = i % 2 === 0 ? -1 : 1;
        return {
          pos: [side * rnd(i * 13, 12, 42) + (side > 0 ? 3 : 0), rnd(i * 13 + 1, -30, 34), rnd(i * 13 + 2, -90, -28)] as [number, number, number],
          s: rnd(i * 13 + 3, 1, 3),
          rot: [rnd(i * 13 + 6, 0, 6), rnd(i * 13 + 7, 0, 6), 0] as [number, number, number],
          spin: rnd(i * 13 + 9, -1, 1),
        };
      }),
    [],
  );
  return (
    <group>
      {items.map((b, i) => (
        <mesh key={i} position={[b.pos[0], b.pos[1] + Math.sin(frame / 150 + i) * 0.5, b.pos[2]]}
          rotation={[b.rot[0] + (frame / 1400) * b.spin, b.rot[1] + (frame / 1000) * b.spin, 0]}>
          <boxGeometry args={[b.s, b.s, b.s]} />
          <meshStandardMaterial color="#1b1c48" roughness={0.55} metalness={0.25} />
        </mesh>
      ))}
    </group>
  );
};

/* ---------- DAworld: a floating block island that builds itself ---------- */
const U = 0.5;
type Block = { x: number; y: number; z: number; color: string; glow: boolean; order: number };
const buildIsland = (): Block[] => {
  const out: Block[] = [];
  const R = 7;
  for (let x = -R; x <= R; x++) {
    for (let z = -R; z <= R; z++) {
      const d = Math.hypot(x, z) + noise1(x * 0.7 + z * 0.3, 5) * 1.2;
      if (d > R) continue;
      const top = Math.round(1 + (1 - d / R) * 2 + noise1(x * 0.5 - z * 0.4, 9) * 1.2);
      const bottom = -Math.round((1 - d / R) * 5 + 1);
      for (let y = bottom; y <= top; y++) {
        const isTop = y === top;
        const glow = !isTop && y < 0 && rnd(x * 31 + z * 17 + y * 7, 0, 1) < 0.05;
        const color = isTop ? "#2fd3c4" : y >= top - 1 ? "#4a3a8c" : y > bottom + 1 ? "#2c2563" : "#1d1847";
        out.push({ x, y, z, color, glow, order: 0 });
      }
    }
  }
  // two trees
  const tree = (tx: number, tz: number) => {
    const base = Math.max(...out.filter((b) => b.x === tx && b.z === tz).map((b) => b.y));
    for (let h = 1; h <= 3; h++) out.push({ x: tx, y: base + h, z: tz, color: "#5a3f86", glow: false, order: 0 });
    for (let lx = -1; lx <= 1; lx++) for (let lz = -1; lz <= 1; lz++) for (let ly = 0; ly <= 1; ly++) {
      if (ly === 1 && Math.abs(lx) + Math.abs(lz) === 2) continue;
      out.push({ x: tx + lx, y: base + 4 + ly, z: tz + lz, color: "#7cf1ff", glow: false, order: 0 });
    }
  };
  tree(-3, 1);
  tree(2, -3);
  // build order: bottom up, with a little scatter
  out.forEach((b, i) => { b.order = b.y + rnd(i * 3 + 1, 0, 1.6); });
  const sorted = [...out].sort((a, b) => a.order - b.order);
  sorted.forEach((b, i) => { b.order = i / (sorted.length - 1); });
  return out;
};
const ISLAND_BLOCKS = buildIsland();

const Island: React.FC<{ frame: number; lv: number }> = ({ frame, lv }) => {
  const mesh = useMemo(() => {
    const geo = new THREE.BoxGeometry(U * 0.96, U * 0.96, U * 0.96);
    const mat = new THREE.MeshStandardMaterial({ roughness: 0.55, metalness: 0.1, vertexColors: false });
    const m = new THREE.InstancedMesh(geo, mat, ISLAND_BLOCKS.length);
    ISLAND_BLOCKS.forEach((b, i) => m.setColorAt(i, new THREE.Color(b.color).multiplyScalar(b.glow ? 2.2 : 1)));
    m.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    return m;
  }, []);
  const mc = LF("mc");
  const mcbest = LF("mcbest");
  const crew = LF("crew");
  const a0 = mc.start - 30;
  const span = mc.accent - a0 - 14;
  const sink = ramp(frame, mcbest.end - 6, crew.start + 30, leave);
  const m4 = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const p = new THREE.Vector3();
  const s = new THREE.Vector3();
  ISLAND_BLOCKS.forEach((b, i) => {
    const t = ramp(frame, a0 + b.order * span, a0 + b.order * span + 14, arrive);
    p.set(ISLAND[0] + b.x * U, ISLAND[1] + b.y * U + (1 - t) * 2.5 - sink * 7, ISLAND[2] + b.z * U);
    s.setScalar(Math.max(0.0001, t));
    m4.compose(p, q, s);
    mesh.setMatrixAt(i, m4);
  });
  mesh.instanceMatrix.needsUpdate = true;
  (mesh.material as THREE.MeshStandardMaterial).color.setScalar(lv);
  mesh.visible = frame >= a0 && sink < 1;
  return <primitive object={mesh} />;
};

export const World: React.FC = () => {
  const frame = useCurrentFrame();
  const pose = cameraPose(frame);
  const lv = lightLevel(frame);
  return (
    <ThreeCanvas width={W} height={H} style={{ position: "absolute", inset: 0 }} gl={{ antialias: true }}>
      <CameraRig pose={pose} />
      <color attach="background" args={["#05060f"]} />
      <fog attach="fog" args={["#080a1e", 30, 120]} />
      <hemisphereLight args={["#d8e6ff", "#0b0820", 0.55 * lv]} />
      <directionalLight position={[-20, 40, 25]} intensity={1.8 * lv} color="#eaf6ff" />
      <directionalLight position={[30, -10, -20]} intensity={2.2 * lv} color="#8b5cff" />
      <directionalLight position={[20, 10, 30]} intensity={1.2 * lv} color="#3de0ff" />
      <Sky lv={lv} />
      <Drift frame={frame} />
      <Island frame={frame} lv={lv} />
      <Sparks frame={frame} lv={lv} />
    </ThreeCanvas>
  );
};
