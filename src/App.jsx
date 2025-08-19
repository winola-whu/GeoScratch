import { useState, useRef, useMemo, useCallback } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, TransformControls } from '@react-three/drei'
import './App.css'

function Point({ id, position, onSelect, selected }) {
  const ref = useRef()
  return (
    <mesh
      ref={ref}
      position={position}
      userData={{ type: 'point', id }}
      onPointerDown={(e) => {
        e.stopPropagation()
        onSelect(ref.current, id)
      }}
      castShadow
    >
      <sphereGeometry args={[0.12, 16, 16]} />
      <meshStandardMaterial color={'#7aa2ff'} roughness={0.4} metalness={0.1} />
    </mesh>
  )
}

function SelectionOutline({ target }) {
  const ref = useRef()
  useFrame(() => {
    if (target && ref.current) {
      ref.current.position.copy(target.position)
    }
  })
  if (!target) return null
  return (
    <mesh ref={ref} scale={1.5}>
      <sphereGeometry args={[0.12, 16, 16]} />
      <meshBasicMaterial color="white" wireframe />
    </mesh>
  )
}

function Scene({ setStatus, onBindDelete, onBindAdd }) {
  const [points, setPoints] = useState(() => [
    { id: crypto.randomUUID(), pos: new THREE.Vector3(0, 0.5, 0) },
  ])
  const [selectedId, setSelectedId] = useState(null)
  const [selectedObj, setSelectedObj] = useState(null) // THREE.Mesh
  const [orbitEnabled, setOrbitEnabled] = useState(true)

  const planeArgs = useMemo(() => [2000, 2000], [])

  const select = useCallback(
    (mesh, id) => {
      setSelectedObj(mesh)
      setSelectedId(id)
      setStatus('Selected point')
    },
    [setStatus]
  )

  const addAt = useCallback(
    (p) => {
      const pos = p.clone()
      pos.y = Math.max(0, pos.y)
      const id = crypto.randomUUID()
      setPoints((prev) => [...prev, { id, pos }])
      setStatus(
        `Added point @ ${pos.x.toFixed(2)}, ${pos.y.toFixed(
          2
        )}, ${pos.z.toFixed(2)}`
      )
    },
    [setStatus]
  )

  const addRandom = useCallback(() => {
    const rand = (min, max) => Math.random() * (max - min) + min
    addAt(new THREE.Vector3(rand(-3, 3), rand(0, 3), rand(-3, 3)))
  }, [addAt])

  const delSelected = useCallback(() => {
    if (!selectedId) return
    setPoints((prev) => prev.filter((p) => p.id !== selectedId))
    setSelectedId(null)
    setSelectedObj(null)
    setStatus('Deleted point')
  }, [selectedId, setStatus])

  // 把 add/delete 绑定给顶部按钮
  onBindAdd.current = addRandom
  onBindDelete.current = delSelected

  const onPlaneClick = (e) => {
    if (!orbitEnabled) return
    addAt(e.point)
  }

  const onMiss = () => {
    setSelectedId(null)
    setSelectedObj(null)
    setStatus('No selection')
  }

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 5, 2]} intensity={1} />
      <gridHelper args={[20, 20, 0x444444, 0x222222]} />
      <axesHelper args={[1.5]} position={[-9.5, 0.01, -9.5]} />

      <OrbitControls enabled={orbitEnabled} makeDefault />
      <mesh rotation-x={-Math.PI / 2} onClick={onPlaneClick}>
        <planeGeometry args={planeArgs} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {points.map((p) => (
        <Point
          key={p.id}
          id={p.id}
          position={p.pos}
          onSelect={select}
          selected={p.id === selectedId}
        />
      ))}

      <SelectionOutline target={selectedObj} />

      {selectedObj && (
        <TransformControls
          object={selectedObj}
          size={0.9}
          onMouseDown={() => setOrbitEnabled(false)}
          onMouseUp={() => setOrbitEnabled(true)}
          onChange={() => {
          }}
        />
      )}

      <group onPointerMissed={onMiss} />
    </>
  )
}

function App() {
  const [status, setStatus] = useState('No selection')
  const addRef = useRef(null)
  const delRef = useRef(null)

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <div
        id="ui"
        style={{
          position: 'absolute',
          top: 12,
          left: 12,
          display: 'flex',
          gap: 8,
          padding: '8px 10px',
          background: 'rgba(20,20,22,.6)',
          borderRadius: 10,
          backdropFilter: 'blur(6px)',
          zIndex: 10,
        }}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <button id="add-point" type="button" onClick={() => addRef.current?.()}>
          Add point
        </button>
        <button
          id="delete-point"
          type="button"
          onClick={() => delRef.current?.()}
        >
          Delete selected
        </button>
        <span id="status" style={{ opacity: 0.85, marginLeft: 6 }}>
          {status}
        </span>
      </div>

      <Canvas
        camera={{ position: [6, 5, 8], fov: 60, near: 0.1, far: 5000 }}
        dpr={[1, 2]}
        style={{ background: '#0e0e12', width: '100%', height: '100%' }}
      >
        <Scene setStatus={setStatus} onBindAdd={addRef} onBindDelete={delRef} />
      </Canvas>
    </div>
  )
}

export default App
