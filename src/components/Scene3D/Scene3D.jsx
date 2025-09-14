import React, { useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Text, Billboard } from '@react-three/drei'
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

function Scene({ objects = [] }) {
    return (
        <>
            {/* Lights & helpers */}
            <ambientLight intensity={0.6} />
            <directionalLight position={[3, 5, 2]} intensity={1} />
            <gridHelper args={[20, 20, 0x444444, 0x222222]} />
            <Axes length={10} />

            {/* Render objects from Blockly */}
            {objects.map((o, i) => {
                if(o){
                    return <primitive key={i} object={o}/>
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
                camera={{ position: [20, 20, 8], fov: 50, near: 0.1, far: 5000 }}
                dpr={[1, 2]}
                style={{ width: '100%', height: '100%' }}
            >
                <Scene objects={objects} />
                <color attach="background" args={['#0e0e12']} />
            </Canvas>
        </div>
    )
}