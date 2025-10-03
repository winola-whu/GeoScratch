import React, { useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Text, Billboard, Html } from '@react-three/drei'
import * as THREE from 'three'
import './Scene3D.css'

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
      <gridHelper args={[20, 20, 0x444444, 0x222222]} />
      <Axes length={10} />

      {objects.map((o, i) => {
        if (!o) return null;
        return (
          <group key={i}>
            <primitive object={o} />
            <LabelLayer object3D={o} />
          </group>
        );
      })}

      <OrbitControls makeDefault />
    </>
  );
}

export default function Scene3D({ objects = [] }) {
  return (
    <div className="panel panel-right">
      <Canvas
        camera={{ position: [20, 20, 8], fov: 50, near: 0.1, far: 5000 }}
        dpr={[1, 2]}
        style={{ width: '100%', height: '100%' }}
      >
        <Scene objects={objects} />
        <color attach="background" args={['#0e0e12']} />
      </Canvas>
    </div>
  );
}