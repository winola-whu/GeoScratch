import BlocksCanvas from './BlocksCanvas.jsx'
import Scene3D from './Scene3D.jsx'
import './App.css'
import { useState } from 'react'

export default function App() {
    const [objects, setObjects] = useState([]) // [{type, params}, ...]
    return (
        <div className="root-split">
            <BlocksCanvas onObjectsChange={setObjects} />
            <Scene3D objects={objects} />
        </div>
    )
}