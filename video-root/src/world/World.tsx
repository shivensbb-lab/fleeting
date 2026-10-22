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

const Sky: React.FC<{ lv: number }> = ({ lv }) => {
  const tex = useMemo(
    () =>
      canvasTexture(512, 1024, (c) => {
        const g = c.createLinearGradient(0, 0, 0, 1024);
        g.addColorStop(0, "#0c2a26");
        g.addColorStop(0.5, "#081816");
        g.addColorStop(1, "#040b0a");
        c.fillStyle = g;
        c.fillRect(0, 0, 512, 1024);
        // a faint aurora band across the upper sky
        for (let i = 0; i < 3; i++) {
          const r = c.createRadialGradient(140 + i * 130, 300 + i * 40, 10, 140 + i * 130, 300 + i * 40, 260);
          r.addColorStop(0, `rgba(76,242,164,${0.22 - i * 0.05})`);
          r.addColorStop(1, "rgba(76,242,164,0)");
          c.fillStyle = r;
          c.fillRect(0, 0, 512, 1024);
        }
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

const SPORES = 480;
const Spores: React.FC<{ frame: number; lv: number }> = ({ frame, lv }) => {
  const dot = useMemo(
    () =>
      canvasTexture(64, 64, (c) => {
        const g = c.createRadialGradient(32, 32, 0, 32, 32, 32);
        g.addColorStop(0, "rgba(200,255,228,1)");
        g.addColorStop(1, "rgba(200,255,228,0)");
        c.fillStyle = g;
        c.fillRect(0, 0, 64, 64);
      }),
    [],
  );
  const positions = useMemo(() => {
    const a = new Float32Array(SPORES * 3);
    for (let i = 0; i < SPORES; i++) {
      const rise = (rnd(i * 5 + 3, 0.004, 0.014) * frame) % 50;
      a[i * 3] = rnd(i * 5, -32, 32) + Math.sin(frame / 90 + i) * 0.4;
      a[i * 3 + 1] = ((rnd(i * 5 + 1, -25, 25) + rise + 25) % 50) - 25;
      a[i * 3 + 2] = rnd(i * 5 + 2, -60, 10);
    }
    return a;
  }, [frame]);
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial map={dot} size={0.24} sizeAttenuation transparent opacity={0.6 * lv} depthWrite={false} blending={THREE.AdditiveBlending} color="#9dffd0" />
    </points>
  );
};

const STONES = 34;
const Stones: React.FC<{ frame: number }> = ({ frame }) => {
  const items = useMemo(
    () =>
      Array.from({ length: STONES }, (_, i) => {
        const side = i % 2 === 0 ? -1 : 1;
        return {
          pos: [side * rnd(i * 13, 10, 40) + (side > 0 ? 3 : 0), rnd(i * 13 + 1, -30, 34), rnd(i * 13 + 2, -85, -24)] as [number, number, number],
          r: rnd(i * 13 + 3, 0.8, 3.2),
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
          <icosahedronGeometry args={[b.r, 0]} />
          <meshStandardMaterial color="#132b27" roughness={0.6} metalness={0.2} flatShading />
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
      <color attach="background" args={["#040b0a"]} />
      <fog attach="fog" args={["#06110f", 30, 120]} />
      <hemisphereLight args={["#bfffe2", "#05100e", 0.35 * lv]} />
      <directionalLight position={[-30, 40, 20]} intensity={1.2 * lv} color="#d8fff0" />
      <directionalLight position={[30, -10, -20]} intensity={2.4 * lv} color="#4cf2a4" />
      <Sky lv={lv} />
      <Stones frame={frame} />
      <Spores frame={frame} lv={lv} />
    </ThreeCanvas>
  );
};
