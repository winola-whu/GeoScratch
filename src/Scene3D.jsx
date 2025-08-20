import React, { useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

function Point({ x, y, z }) {
    return (
        <mesh position={[x, y, z]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial roughness={0.4} metalness={0.1} />
        </mesh>
    )
}

function Line({ x1, y1, z1, x2, y2, z2 }) {
    const geom = useMemo(() => {
        const pts = [new THREE.Vector3(x1, y1, z1), new THREE.Vector3(x2, y2, z2)]
        return new THREE.BufferGeometry().setFromPoints(pts)
    }, [x1, y1, z1, x2, y2, z2])

    return (
        <line geometry={geom}>
            <lineBasicMaterial />
        </line>
    )
}

function Vector({ vx, vy, vz }) {
    const { dir, len } = useMemo(() => {
        const d = new THREE.Vector3(vx, vy, vz)
        const L = d.length() || 1
        if (L === 0) d.set(1, 0, 0)
        d.normalize()
        return { dir: d, len: L }
    }, [vx, vy, vz])

    return <arrowHelper args={[dir, new THREE.Vector3(0, 0, 0), len, 0x8888ff]} />
}

function Plane({ nx, ny, nz, d }) {
    // Render a finite square patch of the plane (size S x S) whose normal is n and offset is d, i.e., n·x = d
    const { center, quat } = useMemo(() => {
        const n = new THREE.Vector3(nx, ny, nz)
        if (n.lengthSq() < 1e-8) n.set(0, 1, 0) // fallback
        n.normalize()
        const center = n.clone().multiplyScalar(d)
        // planeGeometry's normal is +Z; rotate +Z to n
        const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), n)
        return { center, quat }
    }, [nx, ny, nz, d])

    const S = 4 // plane patch size

    return (
        <group position={center.toArray()} quaternion={quat}>
            <mesh>
                <planeGeometry args={[S, S]} />
                <meshStandardMaterial transparent opacity={0.15} />
            </mesh>
            {/* Optional outline */}
            <line>
                <bufferGeometry
                    attach="geometry"
                    {...(() => {
                        const hw = S / 2
                        const positions = new Float32Array([
                            -hw, -hw, 0,
                            hw, -hw, 0,
                            hw,  hw, 0,
                            -hw,  hw, 0,
                            -hw, -hw, 0,
                        ])
                        const geom = new THREE.BufferGeometry()
                        geom.setAttribute('position', new THREE.BufferAttribute(positions, 3))
                        return { }
                    })()}
                />
                <lineBasicMaterial />
            </line>
        </group>
    )
}

function Scene({ objects = [] }) {
    return (
        <>
            {/* Lights & helpers */}
            <ambientLight intensity={0.6} />
            <directionalLight position={[3, 5, 2]} intensity={1} />
            <gridHelper args={[20, 20, 0x444444, 0x222222]} />
            <axesHelper args={[1.5]} position={[-9.5, 0.01, -9.5]} />

            {/* Render objects from Blockly */}
            {objects.map((o, i) => {
                switch (o.type) {
                    case 'point':  return <Point key={i} {...o.params} />
                    case 'line':   return <Line key={i} {...o.params} />
                    case 'plane':  return <Plane key={i} {...o.params} />
                    case 'vector': return <Vector key={i} {...o.params} />
                    default:       return null
                }
            })}

            <OrbitControls makeDefault />
        </>
    )
}

export default function Scene3D({ objects = [] }) {
    return (
        <div className="panel panel-right">
            <Canvas
                camera={{ position: [6, 5, 8], fov: 60, near: 0.1, far: 5000 }}
                dpr={[1, 2]}
                style={{ width: '100%', height: '100%' }}
            >
                <Scene objects={objects} />
            </Canvas>
        </div>
    )
}
