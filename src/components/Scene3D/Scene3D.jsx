import React, { useMemo, useRef, useEffect } from 'react'
import { useThree } from "@react-three/fiber"
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Text, Billboard, Html } from '@react-three/drei'
import * as THREE from 'three'
import './Scene3D.css'


function CameraHandle({ onReady }) {
  const { camera } = useThree();
  useEffect(() => { onReady?.(camera); }, [camera, onReady]);
  return null;
}

const AxisLabels = ({ size = 40, step = 1, y = 0.01, fontSize = 0.25, color = '#9aa0a6', showZero = true }) => {
  const ticks = useMemo(() => Array.from({ length: Math.floor(size / step) + 1 }, (_, i) => i * step - size / 2), [size, step]);
  return (
    <group>
      {ticks.map(t => (showZero || t !== 0) && (
        <Billboard key={`x-${t}`} position={[t, y, 0]}>
          <Text fontSize={fontSize} color={color} anchorX="center" anchorY="middle">{t}</Text>
        </Billboard>
      ))}
      {ticks.map(t => (showZero || t !== 0) && (
        <Billboard key={`z-${t}`} position={[0, y, t]}>
          <Text fontSize={fontSize} color={color} anchorX="center" anchorY="middle">{t}</Text>
        </Billboard>
      ))}
    </group>
  );
};

function AxisArrow({ dir = [1,0,0], color = 'red', length = 3 }) {
    // Build a THREE.ArrowHelper once
    const arrow = useMemo(() => {
        const direction = new THREE.Vector3(...dir).normalize()
        const origin = new THREE.Vector3(0, 0, 0)
        const helper = new THREE.ArrowHelper(direction, origin, length, new THREE.Color(color), 0.1, 0.1)
        return helper
    }, [dir, color, length])

    const tip = useMemo(() => {
        const d = new THREE.Vector3(...dir).normalize()
        return d.multiplyScalar(length + 0.25)
    }, [dir, length])

    return (
        <group>
            <primitive object={arrow} />
            <Billboard position={[tip.x, tip.y, tip.z]}>
                <Text fontSize={0.35} color={color} anchorX="center" anchorY="middle">
                    {dir[0] ? 'X' : dir[1] ? 'Y' : 'Z'}
                </Text>
            </Billboard>
        </group>
    )
}

function Axes({ length = 3 }) {
    return (
        <group>
            <AxisArrow dir={[1,0,0]} color="#ef4444" length={length} /> {/* X - red */}
            <AxisArrow dir={[0,1,0]} color="#22c55e" length={length} /> {/* Y - green */}
            <AxisArrow dir={[0,0,1]} color="#3b82f6" length={length} /> {/* Z - blue */}
        </group>
    )
}

function fmtVec(v) {
  if (!v) return '[?, ?, ?]';
  const n = (x) => (Number.isFinite(x) ? +x.toFixed(3) : x);
  return `[${n(v.x)}, ${n(v.y)}, ${n(v.z)}]`;
}

// Resolve a label "anchor" name to a world-space position
function resolveAnchor(object3D, anchorName) {
  const ud = object3D.userData || {};

  // Built-ins for geo_vector_line
  if (anchorName === 'origin' && ud.origin) {
    const { x, y, z } = ud.origin;
    return [x, y, z];
  }
  if (anchorName === 'rPoint' && ud.rPoint) {
    const { x, y, z } = ud.rPoint;
    return [x, y, z];
  }

  // Custom anchors
  const dict = ud.labelAnchors || {};
  const entry = dict[anchorName];
  if (!entry || !entry.position || entry.position.length !== 3) return null;

  const v = new THREE.Vector3(entry.position[0], entry.position[1], entry.position[2]);
  if (entry.type === 'local') {
    object3D.localToWorld(v);
  }
  return [v.x, v.y, v.z];
}

// Generic label renderer for any object carrying userData.labels
// userData.labels: Array<{
//   anchor: 'origin' | 'rPoint' | string,     // where to stick the label
//   text?: string,                             // explicit text; overrides formatting
//   format?: 'vec' | 'raw' | 'none',           // how to show value if no text
//   distanceFactor?: number,                   // Html distanceFactor
//   offset?: [dx, dy, dz],                     // small 3D offset from anchor
// }>
function LabelLayer({ object3D }) {
  const ud = object3D.userData || {};
  const labels = Array.isArray(ud.labels) ? ud.labels : [];

  // Defaults for geo_vector_line if no explicit labels provided
  const needsDefault = labels.length === 0 && ud.geoType === 'geo_vector_line';
  const derived = needsDefault
    ? [
      { anchor: 'origin', text: `Pos ${fmtVec(ud.origin)}`, distanceFactor: 8, offset: [0.12, 0.12, 0] },
      ...(ud.rPoint != null && Number.isFinite(ud.t)
        ? [{ anchor: 'rPoint', text: `r(t=${ud.t}) ${fmtVec(ud.rPoint)}`, distanceFactor: 8, offset: [0.12, 0.12, 0] }]
        : []),
    ]
    : labels;

  return (
    <>
      {derived.map((lbl, i) => {
        const pos = resolveAnchor(object3D, lbl.anchor);
        if (!pos) return null;

        const df = Number.isFinite(lbl.distanceFactor) ? lbl.distanceFactor : 8;
        const off = Array.isArray(lbl.offset) && lbl.offset.length === 3 ? lbl.offset : [0, 0, 0];

        // If no text provided, try formatting the anchor value
        let text = lbl.text;
        if (!text) {
          const val =
            lbl.anchor === 'origin' ? ud.origin :
              lbl.anchor === 'rPoint' ? ud.rPoint :
                null;
          const fmt = lbl.format || 'vec';
          if (fmt === 'vec' && val) text = fmtVec(val);
          else if (fmt === 'raw' && val) text = String(val);
          else text = '';
        }

        return (
          <group key={`lbl-${i}`} position={[pos[0] + off[0], pos[1] + off[1], pos[2] + off[2]]}>
            <Html distanceFactor={df}>
              <div className="label">{text}</div>
            </Html>
          </group>
        );
      })}
    </>
  );
}

function Scene({ objects = [] }) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 5, 2]} intensity={1} />
      <gridHelper args={[40, 40, 0x444444, 0x222222]} position={[0, -0.01, 0]} />
      <AxisLabels size={40} step={1} />
      <Axes length={20} position={[0, 0, 0]}/>

      {objects.map((o, i) => {
        if (!o) return null;
        return (
          <group key={i}>
            <primitive object={o} />
            <LabelLayer object3D={o} />
          </group>
        );
      })}

    </>
  );
}

export default function Scene3D({ objects = [] }) {

  const controlsRef = useRef(null);
  const cameraRef = useRef(null);

  const initialCamPos = useMemo(() => new THREE.Vector3(45, 45, 8), []);
  const initialTarget = useMemo(() => new THREE.Vector3(0, 0, 0), []);

  const recenter = () => {
    if (!cameraRef.current || !controlsRef.current) return;
    cameraRef.current.position.copy(initialCamPos);
    controlsRef.current.target.copy(initialTarget);
    controlsRef.current.update();
  };
  return (
    <div className="panel panel-right">
      <Canvas
        camera={{ position: [45, 45, 8], fov: 45, near: 0.1, far: 5000 }}
        dpr={[1, 2]}
        style={{ width: '100%', height: '100%' }}
      >
        <OrbitControls ref={controlsRef}/>
        <CameraHandle onReady={(cam) => (cameraRef.current = cam)} />
        <Scene objects={objects} />
        <color attach="background" args={['#0e0e12']} />
      </Canvas>
      <button className="recenter-btn" onClick={recenter} aria-label="Recenter camera" title="Recenter">
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3M12 7a5 5 0 1 1 0 10a5 5 0 0 1 0-10Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
        </svg>
      </button>
    </div>
  );
}