"use client";
import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Environment,
  Lightformer,
  MeshReflectorMaterial,
  RoundedBox,
} from "@react-three/drei";
import * as THREE from "three";
import { cameraPositions, createCameraPaths } from "@/lib/camera-path";

type Vec = [number, number, number];
const GOLD = "#c6a36e";
const DARK = "#3b2b26";
const IVORY = "#f2e9dd";

function Box({
  position = [0, 0, 0],
  scale = [1, 1, 1],
  color = DARK,
  metalness = 0,
  roughness = 0.65,
  radius = 0.06,
  rotation = [0, 0, 0],
}: {
  position?: Vec;
  scale?: Vec;
  color?: string;
  metalness?: number;
  roughness?: number;
  radius?: number;
  rotation?: Vec;
}) {
  return (
    <RoundedBox
      args={scale}
      radius={radius}
      smoothness={2}
      position={position}
      rotation={rotation}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial
        color={color}
        metalness={metalness}
        roughness={roughness}
      />
    </RoundedBox>
  );
}
function Cylinder({
  position,
  args,
  color = GOLD,
  metalness = 0.8,
  roughness = 0.25,
}: {
  position: Vec;
  args: [number, number, number, number?];
  color?: string;
  metalness?: number;
  roughness?: number;
}) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <cylinderGeometry args={args} />
      <meshStandardMaterial
        color={color}
        metalness={metalness}
        roughness={roughness}
      />
    </mesh>
  );
}
function makeStone() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 512;
  const ctx = canvas.getContext("2d")!;
  const pixels = ctx.createImageData(512, 512);
  let seed = 32;
  const random = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  for (let y = 0; y < 512; y++)
    for (let x = 0; x < 512; x++) {
      const wave =
        Math.sin(x * 0.017 + Math.sin(y * 0.009) * 3.3) * 5 +
        Math.sin(x * 0.09 + y * 0.014) * 2.5;
      const v = 218 + wave + random() * 5;
      const i = (y * 512 + x) * 4;
      pixels.data[i] = Math.min(255, v + 10);
      pixels.data[i + 1] = Math.min(255, v + 4);
      pixels.data[i + 2] = v - 4;
      pixels.data[i + 3] = 255;
    }
  ctx.putImageData(pixels, 0, 0);
  const t = new THREE.CanvasTexture(canvas);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(5, 9);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
function Wordmark() {
  const texture = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 1024;
    c.height = 256;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = "#c6a36e";
    ctx.font = "300 130px Georgia";
    ctx.textAlign = "center";
    ctx.fillText("M A S S I", 512, 151);
    ctx.font = "18px sans-serif";
    ctx.fillText("H A I R   &   B E A U T Y", 512, 212);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);
  useEffect(() => () => texture.dispose(), [texture]);
  return (
    <mesh position={[0.5, 3.25, -10.68]}>
      <planeGeometry args={[3.5, 0.875]} />
      <meshBasicMaterial map={texture} transparent toneMapped={false} />
    </mesh>
  );
}
function Arch({
  x = 0,
  z = 0,
  width = 1.9,
  height = 3.5,
  mirror = false,
  quality = "high",
}: {
  x?: number;
  z?: number;
  width?: number;
  height?: number;
  mirror?: boolean;
  quality?: string;
}) {
  const { shape, rim } = useMemo(() => {
    const r = width / 2;
    const bottom = 0.62;
    const top = bottom + height - r;
    const s = new THREE.Shape();
    s.moveTo(-r, bottom);
    s.lineTo(r, bottom);
    s.lineTo(r, top);
    s.absarc(0, top, r, 0, Math.PI, false);
    s.lineTo(-r, bottom);
    const pts = [
      new THREE.Vector3(-r, bottom, 0),
      new THREE.Vector3(r, bottom, 0),
      new THREE.Vector3(r, top, 0),
    ];
    for (let i = 1; i <= 40; i++) {
      const a = (Math.PI * i) / 40;
      pts.push(new THREE.Vector3(Math.cos(a) * r, top + Math.sin(a) * r, 0));
    }
    pts.push(new THREE.Vector3(-r, bottom, 0));
    return {
      shape: s,
      rim: new THREE.CatmullRomCurve3(pts, false, "centripetal"),
    };
  }, [width, height]);
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 0, -0.025]}>
        <shapeGeometry args={[shape, 36]} />
        {mirror ? (
          <MeshReflectorMaterial
            resolution={quality === "high" ? 512 : 256}
            mirror={0.93}
            mixBlur={0}
            mixStrength={1}
            color="#e7dfd4"
            metalness={0.35}
            roughness={0.2}
            depthScale={0}
            minDepthThreshold={0.9}
            maxDepthThreshold={1}
          />
        ) : (
          <meshStandardMaterial
            color="#e4d9ca"
            metalness={0.28}
            roughness={0.24}
          />
        )}
      </mesh>
      <mesh>
        <tubeGeometry args={[rim, 100, 0.024, 6, false]} />
        <meshStandardMaterial color={GOLD} metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}
function Chair({
  position,
  rotation = 0,
}: {
  position: Vec;
  rotation?: number;
}) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <Cylinder
        position={[0, 0.08, 0]}
        args={[0.57, 0.62, 0.12, 40]}
        color="#49362f"
      />
      <Cylinder position={[0, 0.38, 0]} args={[0.105, 0.14, 0.55, 24]} />
      <Box
        position={[0, 0.79, 0]}
        scale={[1.25, 0.25, 1.12]}
        color="#bd9183"
        radius={0.12}
        roughness={0.38}
      />
      <Box
        position={[0, 1.22, -0.47]}
        scale={[1.28, 0.86, 0.22]}
        rotation={[-0.11, 0, 0]}
        color="#aa7e72"
        radius={0.1}
        roughness={0.44}
      />
      {[-1, 1].map((s) => (
        <group key={s}>
          <Box
            position={[s * 0.57, 1.04, 0.05]}
            scale={[0.18, 0.45, 0.96]}
            color="#b88a7c"
            radius={0.085}
            roughness={0.42}
          />
          <Box
            position={[s * 0.59, 0.83, 0.03]}
            scale={[0.03, 0.12, 0.78]}
            color={GOLD}
            radius={0.014}
            metalness={0.85}
            roughness={0.23}
          />
          <Box
            position={[s * 0.39, 0.42, 0.77]}
            scale={[0.04, 0.43, 0.04]}
            color={GOLD}
            radius={0.015}
            metalness={0.9}
          />
        </group>
      ))}
      <Box
        position={[0, 0.22, 0.91]}
        scale={[0.89, 0.06, 0.3]}
        color="#a79c84"
        radius={0.025}
        metalness={0.85}
        roughness={0.25}
      />
      {Array.from({ length: 7 }, (_, i) => (
        <Box
          key={i}
          position={[(i - 3) * 0.145, 1.22, -0.342]}
          scale={[0.009, 0.62, 0.009]}
          color="#8c6a59"
          radius={0.003}
        />
      ))}
    </group>
  );
}
function Bottle({
  position,
  color = "#54372c",
  height = 0.36,
}: {
  position: Vec;
  color?: string;
  height?: number;
}) {
  return (
    <group position={position}>
      <Cylinder
        position={[0, height / 2, 0]}
        args={[0.07, 0.075, height, 14]}
        color={color}
        metalness={0.15}
        roughness={0.22}
      />
      <Cylinder
        position={[0, height + 0.03, 0]}
        args={[0.045, 0.045, 0.07, 14]}
        color="#b5a181"
      />
      <Box
        position={[0, height * 0.52, 0.071]}
        scale={[0.088, 0.12, 0.005]}
        color="#d1c2a3"
        radius={0.002}
      />
    </group>
  );
}
function Station({
  z,
  index,
  quality,
}: {
  z: number;
  index: number;
  quality: string;
}) {
  return (
    <group position={[-5.76, 0, z]} rotation={[0, Math.PI / 2, 0]}>
      <Arch width={2} height={3.4} mirror={index === 1} quality={quality} />
      <Box
        position={[0, 1.01, 0.45]}
        scale={[2.7, 0.14, 0.74]}
        color="#eee3d5"
        radius={0.045}
        roughness={0.4}
      />
      <Box
        position={[0, 0.72, 0.16]}
        scale={[1.9, 0.47, 0.45]}
        color="#5a4035"
        radius={0.025}
      />
      <Bottle position={[-0.84, 1.1, 0.44]} />
      <Bottle position={[-0.62, 1.1, 0.4]} height={0.26} color="#a58b62" />
      <Box
        position={[0.78, 1.12, 0.48]}
        scale={[0.35, 0.04, 0.25]}
        color="#b5aa95"
        radius={0.016}
      />
      <Chair position={[0, 0, 1.83]} rotation={Math.PI} />
      {[-1.29, 1.29].map((x) => (
        <group key={x}>
          <mesh position={[x, 2.3, 0.05]}>
            <cylinderGeometry args={[0.027, 0.027, 2.8, 8]} />
            <meshStandardMaterial
              color="#ead3a8"
              emissive="#f8c88b"
              emissiveIntensity={1.5}
            />
          </mesh>
          <pointLight
            position={[x, 2.5, 0.38]}
            intensity={4}
            distance={3}
            color="#ffddaa"
          />
        </group>
      ))}
    </group>
  );
}
function DownLight({
  position,
  intensity = 25,
  angle = 0.65,
}: {
  position: Vec;
  intensity?: number;
  angle?: number;
}) {
  const target = useMemo(() => new THREE.Object3D(), []);
  return (
    <group position={position}>
      <primitive object={target} position={[0, -6, 0]} />
      <spotLight
        target={target}
        angle={angle}
        penumbra={0.7}
        intensity={intensity}
        color="#ffdeac"
        distance={10}
      />
    </group>
  );
}
function Pendant({ position }: { position: Vec }) {
  return (
    <group position={position}>
      <Cylinder
        position={[0, 1.15, 0]}
        args={[0.014, 0.014, 1.8, 8]}
        color="#77664e"
      />
      <mesh rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.47, 0.28, 40, 1, true]} />
        <meshStandardMaterial
          color="#c6a36e"
          side={THREE.DoubleSide}
          metalness={0.85}
          roughness={0.27}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
        <circleGeometry args={[0.33, 32]} />
        <meshBasicMaterial color="#ffdda4" toneMapped={false} />
      </mesh>
      <DownLight position={[0, -0.05, 0]} intensity={14} />
    </group>
  );
}
function Flutes() {
  const ref = useRef<THREE.InstancedMesh>(null);
  useEffect(() => {
    const matrix = new THREE.Matrix4();
    for (let i = 0; i < 100; i++) {
      matrix.makeTranslation(-5.8 + i * 0.117, 2.9, -10.86);
      ref.current!.setMatrixAt(i, matrix);
    }
    ref.current!.instanceMatrix.needsUpdate = true;
  }, []);
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, 100]} receiveShadow>
      <boxGeometry args={[0.045, 5.8, 0.12]} />
      <meshStandardMaterial color="#d7c8b5" roughness={0.75} />
    </instancedMesh>
  );
}
function Sculpture() {
  const curves = useMemo(
    () =>
      Array.from({ length: 13 }, (_, i) => {
        const points = Array.from({ length: 65 }, (_, j) => {
          const t = j / 64;
          const a = t * Math.PI * 2.1 + i * 0.18;
          const r = 0.2 + Math.sin(t * Math.PI) * 0.57;
          return new THREE.Vector3(
            Math.cos(a) * r,
            1.1 + t * 2.3,
            Math.sin(a) * r,
          );
        });
        return new THREE.CatmullRomCurve3(points);
      }),
    [],
  );
  return (
    <group position={[3.3, 0, -6.3]}>
      <Cylinder
        position={[0, 0.47, 0]}
        args={[0.83, 0.83, 0.94, 56]}
        color="#d6c5ae"
        metalness={0.05}
        roughness={0.4}
      />
      <Cylinder position={[0, 0.96, 0]} args={[0.85, 0.85, 0.05, 56]} />
      {curves.map((curve, i) => (
        <mesh key={i} castShadow>
          <tubeGeometry args={[curve, 80, 0.022 + (i % 3) * 0.008, 6, false]} />
          <meshStandardMaterial
            color={i % 3 === 0 ? "#d5b77f" : "#ad795d"}
            metalness={0.86}
            roughness={0.23}
          />
        </mesh>
      ))}
      <DownLight position={[0, 4.8, 0]} intensity={45} angle={0.4} />
    </group>
  );
}
function Plant({ position }: { position: Vec }) {
  const leaves = useMemo(
    () =>
      Array.from({ length: 15 }, (_, i) => ({
        a: i * 2.4,
        y: 1.1 + (i % 5) * 0.32,
        r: 0.25 + (i % 3) * 0.14,
      })),
    [],
  );
  return (
    <group position={position}>
      <Cylinder
        position={[0, 0.38, 0]}
        args={[0.39, 0.29, 0.76, 24]}
        color="#bca88e"
        metalness={0.12}
      />
      {leaves.map((l, i) => (
        <group key={i} rotation={[0, l.a, 0]}>
          <mesh position={[0, l.y * 0.65, 0]} rotation={[0, 0, -0.12]}>
            <cylinderGeometry args={[0.012, 0.018, l.y, 5]} />
            <meshStandardMaterial color="#59664a" />
          </mesh>
          <mesh
            position={[l.r, l.y, 0]}
            rotation={[0, 0, -0.65]}
            scale={[0.19, 0.6, 0.045]}
          >
            <sphereGeometry args={[1, 10, 8]} />
            <meshStandardMaterial
              color={i % 2 ? "#687450" : "#7a865d"}
              roughness={0.6}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}
function Room({ quality }: { quality: string }) {
  const stone = useMemo(makeStone, []);
  useEffect(() => () => stone.dispose(), [stone]);
  return (
    <>
      <color attach="background" args={["#eee6dc"]} />
      <fog attach="fog" args={["#eee6dc", 32, 58]} />
      <ambientLight intensity={0.55} color="#fff3e4" />
      <hemisphereLight args={["#fff7eb", "#b29b7d", 0.95]} />
      <directionalLight
        position={[4, 5, 7]}
        intensity={2}
        color="#fff0d7"
        castShadow
        shadow-mapSize={quality === "high" ? [1536, 1536] : [1024, 1024]}
        shadow-radius={quality === "high" ? 7 : 4}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
        shadow-bias={-0.001}
      />
      <pointLight
        position={[-1, 4, -5]}
        intensity={16}
        color="#ffe0b4"
        distance={15}
      />
      <pointLight
        position={[4, 3, 1]}
        intensity={11}
        color="#fff2df"
        distance={12}
      />
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
        position={[0, -0.015, 0]}
      >
        <planeGeometry args={[12, 23]} />
        <meshStandardMaterial map={stone} roughness={0.4} metalness={0.08} />
      </mesh>
      {/* Deliberate architectural expansion joints. */}
      {Array.from({ length: 12 }, (_, i) => (
        <mesh
          key={i}
          position={[0, 0.002, -11 + i * 2]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[12, 0.012]} />
          <meshStandardMaterial color="#c9bcae" roughness={1} />
        </mesh>
      ))}
      {[-4, -2, 0, 2, 4].map((x) => (
        <mesh key={x} position={[x, 0.003, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.01, 22]} />
          <meshStandardMaterial color="#c9bcae" />
        </mesh>
      ))}
      <Box
        position={[-6, 2.9, 0]}
        scale={[0.3, 5.8, 22]}
        color={IVORY}
        radius={0.01}
      />
      <Box
        position={[6, 2.9, -3]}
        scale={[0.3, 5.8, 16]}
        color="#e9dfd3"
        radius={0.01}
      />
      <Box
        position={[0, 2.9, -11]}
        scale={[12, 5.8, 0.3]}
        color="#e6dbce"
        radius={0.01}
      />
      <Flutes />
      <Box
        position={[0, 5.8, 0]}
        scale={[12, 0.14, 22]}
        color="#e0d4c6"
        radius={0.01}
      />
      {[-5.75, 5.75].map((x) => (
        <mesh key={x} position={[x, 5.56, 0]}>
          <boxGeometry args={[0.045, 0.045, 21]} />
          <meshStandardMaterial
            color="#f8d7a0"
            emissive="#ffd28c"
            emissiveIntensity={2}
          />
        </mesh>
      ))}
      {[-5.2, -0.4, 4.4].map((z, i) => (
        <Station key={z} z={z} index={i} quality={quality} />
      ))}
      {[-4, 2, 7].map((z) => (
        <Pendant key={z} position={[0.4, 4.6, z]} />
      ))}
      <Wordmark />
      <Box
        position={[0.5, 0.72, -9.25]}
        scale={[3.5, 1.44, 1.15]}
        color="#d4c0a5"
        radius={0.18}
        roughness={0.38}
      />
      <Box
        position={[0.5, 1.46, -9.25]}
        scale={[3.58, 0.1, 1.21]}
        color="#eee4d7"
        radius={0.045}
        roughness={0.25}
      />
      <Bottle position={[1.4, 1.52, -9.2]} color="#745342" />
      <Box
        position={[-0.2, 1.59, -9.35]}
        scale={[0.6, 0.06, 0.42]}
        color="#684c3e"
        radius={0.02}
      />
      <Sculpture />
      <Plant position={[4.6, 0, -9.5]} />
      <Plant position={[-4.9, 0, 9]} />
      <group position={[4.1, 0, 1.4]} rotation={[0, -Math.PI / 2, 0]}>
        <Box
          position={[0, 0.48, 0]}
          scale={[3.4, 0.72, 1.12]}
          color="#c9ad98"
          radius={0.22}
          roughness={0.95}
        />
        <Box
          position={[0, 0.95, -0.4]}
          scale={[3.4, 0.9, 0.25]}
          color="#c9ad98"
          radius={0.12}
        />
        {[-1.58, 1.58].map((x) => (
          <Box
            key={x}
            position={[x, 0.87, 0]}
            scale={[0.28, 0.65, 1.12]}
            color="#bd9e88"
            radius={0.12}
          />
        ))}
      </group>
      <Cylinder
        position={[2.6, 0.5, 1.4]}
        args={[0.58, 0.51, 0.08, 40]}
        color="#49362f"
        roughness={0.23}
      />
      <Cylinder position={[2.6, 0.24, 1.4]} args={[0.11, 0.23, 0.48, 20]} />
      <Box
        position={[2.6, 0.56, 1.4]}
        scale={[0.4, 0.025, 0.27]}
        color="#d9cbb1"
        radius={0.007}
      />
      {/* Editorial wall panel. Geometric relief, wholly original. */}
      <group position={[5.8, 2.9, -2.5]} rotation={[0, -Math.PI / 2, 0]}>
        <Box scale={[2.4, 3.1, 0.06]} color="#d7c6ae" radius={0.015} />
        {Array.from({ length: 9 }, (_, i) => (
          <mesh
            key={i}
            position={[0, -0.8 + i * 0.17, 0.06]}
            rotation={[0, 0, 0.35 + i * 0.05]}
          >
            <torusGeometry
              args={[0.7 + i * 0.022, 0.012, 6, 64, Math.PI * 1.4]}
            />
            <meshStandardMaterial
              color="#bd9965"
              metalness={0.72}
              roughness={0.32}
            />
          </mesh>
        ))}
      </group>
      <Environment resolution={128} frames={1}>
        <Lightformer
          form="rect"
          intensity={3}
          color="#fff7e9"
          position={[0, 5, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[12, 12, 1]}
        />
        <Lightformer
          form="rect"
          intensity={2.5}
          color="#ffe5c2"
          position={[-5, 2, 0]}
          rotation={[0, Math.PI / 2, 0]}
          scale={[3, 7, 1]}
        />
        <Lightformer
          form="rect"
          intensity={2}
          color="#fff1e3"
          position={[6, 3, 3]}
          rotation={[0, -Math.PI / 2, 0]}
          scale={[5, 4, 1]}
        />
      </Environment>
    </>
  );
}
function CameraRig({
  progress,
  reduced,
  quality,
}: {
  progress: React.RefObject<number>;
  reduced: boolean;
  quality: string;
}) {
  const { camera, gl, size } = useThree();
  const current = useRef(reduced ? 0.12 : 0);
  const clock = useRef({ time: 0, frames: 0 });
  const { path, look } = useMemo(createCameraPaths, []);
  const pos = useMemo(() => new THREE.Vector3(), []);
  const target = useMemo(() => new THREE.Vector3(), []);
  useFrame((_, delta) => {
    const p = reduced ? current.current : progress.current;
    current.current = THREE.MathUtils.damp(
      current.current,
      p,
      5,
      Math.min(delta, 0.05),
    );
    path.getPoint(current.current, pos);
    look.getPoint(current.current, target);
    if (size.width < 700) {
      pos.z += 2;
      pos.y += 0.4;
      target.x += 0.4;
      const sculptureFraming = THREE.MathUtils.smoothstep(
        1 - Math.abs(current.current - 0.72) / 0.12,
        0,
        1,
      );
      target.x -= sculptureFraming * 1.1;
    }
    camera.position.copy(pos);
    camera.lookAt(target);
    if (camera instanceof THREE.PerspectiveCamera) {
      const fov = size.width < 700 ? 66 : 53;
      if (camera.fov !== fov) {
        camera.fov = fov;
        camera.updateProjectionMatrix();
      }
    }
    clock.current.time += delta;
    clock.current.frames++;
    if (clock.current.time > 1) {
      const el = document.getElementById("scene-status");
      if (el) {
        el.dataset.fps = String(
          Math.round(clock.current.frames / clock.current.time),
        );
        el.dataset.drawCalls = String(gl.info.render.calls);
        el.dataset.triangles = String(gl.info.render.triangles);
        el.dataset.camera = camera.position
          .toArray()
          .map((n) => n.toFixed(2))
          .join(",");
        el.dataset.progress = current.current.toFixed(3);
        el.dataset.quality = quality;
      }
      clock.current = { time: 0, frames: 0 };
    }
  });
  return null;
}
export default function SalonScene({
  progress,
  reduced,
  quality,
  onReady,
  onFailure,
}: {
  progress: React.RefObject<number>;
  reduced: boolean;
  quality: string;
  onReady: () => void;
  onFailure: () => void;
}) {
  return (
    <Canvas
      shadows
      dpr={quality === "high" ? [1, 1.5] : 1}
      frameloop={reduced ? "demand" : "always"}
      camera={{ position: cameraPositions[0], fov: 53, near: 0.1, far: 65 }}
      gl={{
        antialias: quality === "high",
        alpha: false,
        powerPreference: quality === "high" ? "high-performance" : "low-power",
      }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1;
        gl.domElement.addEventListener("webglcontextlost", onFailure, {
          once: true,
        });
        onReady();
      }}
      fallback={<span>3D ist hier nicht verfügbar.</span>}
    >
      <Suspense fallback={null}>
        <Room quality={quality} />
        <CameraRig progress={progress} reduced={reduced} quality={quality} />
      </Suspense>
    </Canvas>
  );
}
