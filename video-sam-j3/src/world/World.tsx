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
        g.addColorStop(0, "#f6d2c2");
        g.addColorStop(0.45, "#fbeadb");
        g.addColorStop(1, "#fff8f0");
        c.fillStyle = g;
        c.fillRect(0, 0, 512, 1024);
        // the sun, upper left
        const r = c.createRadialGradient(140, 380, 10, 140, 380, 420);
        r.addColorStop(0, "rgba(255,250,240,1)");
        r.addColorStop(0.3, "rgba(255,236,214,0.6)");
        r.addColorStop(1, "rgba(255,236,214,0)");
        c.fillStyle = r;
        c.fillRect(0, 0, 512, 1024);
      }),
    [],
  );
  // dusk: the sky cools and darkens toward ink
  const tint = new THREE.Color().lerpColors(new THREE.Color("#3a3550"), new THREE.Color("#ffffff"), (lv - 0.42) / 0.58);
  return (
    <mesh position={[0, 10, -150]}>
      <planeGeometry args={[300, 440]} />
      <meshBasicMaterial map={tex} color={tint} fog={false} />
    </mesh>
  );
};

const BOKEH = 26;
const Bokeh: React.FC<{ frame: number; lv: number }> = ({ frame, lv }) => {
  const disc = useMemo(
    () =>
      canvasTexture(128, 128, (c) => {
        const g = c.createRadialGradient(64, 64, 0, 64, 64, 64);
        g.addColorStop(0, "rgba(255,255,255,0.9)");
        g.addColorStop(0.7, "rgba(255,255,255,0.5)");
        g.addColorStop(1, "rgba(255,255,255,0)");
        c.fillStyle = g;
        c.fillRect(0, 0, 128, 128);
      }),
    [],
  );
  return (
    <group>
      {Array.from({ length: BOKEH }, (_, i) => {
        const s = rnd(i * 7 + 4, 1.5, 4.5);
        const crimson = i % 5 === 0;
        return (
          <mesh key={i} position={[rnd(i * 7, -26, 26) + Math.sin(frame / 160 + i) * 0.6, rnd(i * 7 + 1, -22, 26) + ((frame * rnd(i * 7 + 2, 0.004, 0.01)) % 6), rnd(i * 7 + 3, -40, -14)]}>
            <planeGeometry args={[s, s]} />
            <meshBasicMaterial map={disc} transparent depthWrite={false} opacity={(crimson ? 0.12 : 0.35) * lv} color={crimson ? "#c7406f" : "#ffffff"} />
          </mesh>
        );
      })}
    </group>
  );
};

const BLOCKS = 40;
const Blocks: React.FC<{ frame: number }> = ({ frame }) => {
  const items = useMemo(
    () =>
      Array.from({ length: BLOCKS }, (_, i) => {
        const side = i % 2 === 0 ? -1 : 1;
        const kind = i % 4; // 0,1 unit cubes; 2 a ten-rod; 3 a flat
        const u = rnd(i * 13 + 3, 1.2, 2.4);
        const size: [number, number, number] = kind === 2 ? [u, u * 5, u] : kind === 3 ? [u * 3, u * 0.5, u * 3] : [u, u, u];
        return {
          pos: [side * rnd(i * 13, 9, 34) + (side > 0 ? 3 : 0), rnd(i * 13 + 1, -26, 30), rnd(i * 13 + 2, -70, -18)] as [number, number, number],
          size,
          rot: [rnd(i * 13 + 6, -0.8, 0.8), rnd(i * 13 + 7, -0.9, 0.9), rnd(i * 13 + 8, -0.6, 0.6)] as [number, number, number],
          spin: rnd(i * 13 + 9, -1, 1),
          crimson: i % 6 === 0,
        };
      }),
    [],
  );
  return (
    <group>
      {items.map((b, i) => (
        <mesh key={i} position={[b.pos[0], b.pos[1] + Math.sin(frame / 140 + i) * 0.5, b.pos[2]]}
          rotation={[b.rot[0] + (frame / 1500) * b.spin, b.rot[1] + (frame / 1100) * b.spin, b.rot[2]]}>
          <boxGeometry args={b.size} />
          <meshStandardMaterial color={b.crimson ? "#b3245a" : "#fbf3ea"} roughness={0.5} metalness={0.02} />
        </mesh>
      ))}
    </group>
  );
};

export const World: React.FC = () => {
  const frame = useCurrentFrame();
  const pose = cameraPose(frame);
  const lv = lightLevel(frame);
  const fog = new THREE.Color().lerpColors(new THREE.Color("#4a4560"), new THREE.Color("#f6ece2"), (lv - 0.42) / 0.58);
  return (
    <ThreeCanvas width={W} height={H} style={{ position: "absolute", inset: 0 }} gl={{ antialias: true }}>
      <CameraRig pose={pose} />
      <color attach="background" args={["#fbf6ef"]} />
      <fog attach="fog" args={[fog, 40, 130]} />
      <hemisphereLight args={["#fff6ec", "#d9c7b6", 1.1 * lv]} />
      <directionalLight position={[-30, 40, 30]} intensity={2.4 * lv} color="#fff1e0" />
      <Sky lv={lv} />
      <Bokeh frame={frame} lv={lv} />
      <Blocks frame={frame} />
    </ThreeCanvas>
  );
};
