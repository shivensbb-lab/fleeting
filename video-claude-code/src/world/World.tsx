import React, { useMemo } from "react";
import { useThree } from "@react-three/fiber";
import { ThreeCanvas } from "@remotion/three";
import { useCurrentFrame } from "remotion";
import * as THREE from "three";
import { basis, cameraPose, Pose } from "../lib/camera";
import { CY, FOCAL, H, W } from "../lib/format";
import { lightLevel } from "../lib/light";
import { rnd } from "../lib/noise";

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

const Backdrop: React.FC<{ lv: number }> = ({ lv }) => {
  const tex = useMemo(
    () =>
      canvasTexture(512, 1024, (c) => {
        const g = c.createLinearGradient(0, 0, 0, 1024);
        g.addColorStop(0, "#2e221c");
        g.addColorStop(0.55, "#1a1411");
        g.addColorStop(1, "#0d0a09");
        c.fillStyle = g;
        c.fillRect(0, 0, 512, 1024);
        // the warm window the key light comes from
        const r = c.createRadialGradient(150, 420, 10, 150, 420, 440);
        r.addColorStop(0, "rgba(255,196,150,0.42)");
        r.addColorStop(0.4, "rgba(217,119,87,0.12)");
        r.addColorStop(1, "rgba(0,0,0,0)");
        c.fillStyle = r;
        c.fillRect(0, 0, 512, 1024);
      }),
    [],
  );
  return (
    <mesh position={[0, 10, -150]}>
      <planeGeometry args={[260, 420]} />
      <meshBasicMaterial map={tex} color={new THREE.Color(lv, lv, lv)} fog={false} />
    </mesh>
  );
};

const Beam: React.FC<{ lv: number }> = ({ lv }) => {
  const tex = useMemo(
    () =>
      canvasTexture(256, 512, (c) => {
        const g = c.createLinearGradient(0, 0, 256, 0);
        g.addColorStop(0, "rgba(255,214,170,0)");
        g.addColorStop(0.5, "rgba(255,214,170,1)");
        g.addColorStop(1, "rgba(255,214,170,0)");
        c.fillStyle = g;
        c.fillRect(0, 0, 256, 512);
        c.globalCompositeOperation = "destination-in";
        const v = c.createLinearGradient(0, 0, 0, 512);
        v.addColorStop(0, "rgba(0,0,0,1)");
        v.addColorStop(1, "rgba(0,0,0,0)");
        c.fillStyle = v;
        c.fillRect(0, 0, 256, 512);
      }),
    [],
  );
  return (
    <mesh position={[-14, 16, -30]} rotation={[0, 0, -0.62]}>
      <planeGeometry args={[18, 90]} />
      <meshBasicMaterial map={tex} transparent opacity={0.14 * lv} blending={THREE.AdditiveBlending} depthWrite={false} fog={false} />
    </mesh>
  );
};

const DUST = 420;
const Dust: React.FC<{ frame: number; lv: number }> = ({ frame, lv }) => {
  const dot = useMemo(
    () =>
      canvasTexture(64, 64, (c) => {
        const g = c.createRadialGradient(32, 32, 0, 32, 32, 32);
        g.addColorStop(0, "rgba(255,240,225,1)");
        g.addColorStop(1, "rgba(255,240,225,0)");
        c.fillStyle = g;
        c.fillRect(0, 0, 64, 64);
      }),
    [],
  );
  const positions = useMemo(() => {
    const a = new Float32Array(DUST * 3);
    for (let i = 0; i < DUST; i++) {
      const rise = (rnd(i * 5 + 3, 0.004, 0.012) * frame) % 50;
      a[i * 3] = rnd(i * 5, -34, 34) + Math.sin(frame / 80 + i) * 0.3;
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
      <pointsMaterial map={dot} size={0.22} sizeAttenuation transparent opacity={0.55 * lv} depthWrite={false} blending={THREE.AdditiveBlending} color="#ffe9d6" />
    </points>
  );
};

const BLOCKS = 46;
const Blocks: React.FC<{ frame: number }> = ({ frame }) => {
  const items = useMemo(
    () =>
      Array.from({ length: BLOCKS }, (_, i) => {
        const side = i % 2 === 0 ? -1 : 1;
        return {
          pos: [side * rnd(i * 11, 16, 64) + (side > 0 ? 6 : 0), rnd(i * 11 + 1, -40, 44), rnd(i * 11 + 2, -125, -55)] as [number, number, number],
          size: [rnd(i * 11 + 3, 1.5, 5), rnd(i * 11 + 4, 1.5, 7), rnd(i * 11 + 5, 1.2, 4)] as [number, number, number],
          rot: [rnd(i * 11 + 6, -0.7, 0.7), rnd(i * 11 + 7, -0.9, 0.9), rnd(i * 11 + 8, -0.5, 0.5)] as [number, number, number],
          spin: rnd(i * 11 + 9, -1, 1),
          tone: rnd(i * 11 + 10, 0.75, 1.15),
        };
      }),
    [],
  );
  return (
    <group>
      {items.map((b, i) => (
        <mesh
          key={i}
          position={[b.pos[0], b.pos[1] + Math.sin(frame / 150 + i) * 0.4, b.pos[2]]}
          rotation={[b.rot[0], b.rot[1] + (frame / 1200) * b.spin, b.rot[2]]}
        >
          <boxGeometry args={b.size} />
          <meshStandardMaterial color={new THREE.Color(0.15 * b.tone, 0.11 * b.tone, 0.09 * b.tone)} roughness={0.55} metalness={0.15} />
        </mesh>
      ))}
    </group>
  );
};

export const World: React.FC = () => {
  const frame = useCurrentFrame();
  const pose = cameraPose(frame);
  const lv = lightLevel(frame);
  return (
    <ThreeCanvas width={W} height={H} style={{ position: "absolute", inset: 0 }} gl={{ antialias: true }}>
      <CameraRig pose={pose} />
      <color attach="background" args={["#0d0a09"]} />
      <fog attach="fog" args={["#17110e", 45, 150]} />
      <hemisphereLight args={["#f4e3d0", "#1a120e", 0.55 * lv]} />
      <directionalLight position={[-30, 40, 30]} intensity={3.2 * lv} color="#ffd8b0" />
      <Backdrop lv={lv} />
      <Beam lv={lv} />
      <Blocks frame={frame} />
      <Dust frame={frame} lv={lv} />
    </ThreeCanvas>
  );
};
