import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

function Scene() {
    return (
        <>
            <ambientLight intensity={0.6} />
            <directionalLight position={[3, 5, 2]} intensity={1} />
            <gridHelper args={[20, 20, 0x444444, 0x222222]} />
            <axesHelper args={[1.5]} position={[-9.5, 0.01, -9.5]} />
            <mesh rotation-x={-Math.PI / 2}>
                <planeGeometry args={[2000, 2000]} />
                <meshBasicMaterial transparent opacity={0} depthWrite={false} />
            </mesh>
            <OrbitControls makeDefault />
        </>
    )
}

export default function Scene3D() {
    return (
        <div className="panel panel-right">
            <Canvas
                camera={{ position: [6, 5, 8], fov: 60, near: 0.1, far: 5000 }}
                dpr={[1, 2]}
                style={{ width: '100%', height: '100%' }}
            >
                <Scene />
            </Canvas>
        </div>
    )
}
