import BlocksCanvas from './BlocksCanvas.jsx'
import Scene3D from './Scene3D.jsx'
import './App.css'

export default function App() {
    return (
        <div className="root-split">
            {/* Left: blocks canvas (blank for now) */}
            <BlocksCanvas />

            {/* Right: 3D scene */}
            <Scene3D />
        </div>
    )
}