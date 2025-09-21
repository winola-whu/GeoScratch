import { useState } from 'react'
import Header from '@/components/Header/Header'
import BlocksCanvas from '@/components/BlocksCanvas/BlocksCanvas'
import Scene3D from '@/components/Scene3D/Scene3D'
import { threeObjStore } from '@/components/BlocksCanvas/BlocksCodeGen'

const Layout = () => {
  const [objects, setObjects] = useState([])
  const [pendingObjects, setPendingObjects] = useState([])
  const [exampleXml, setExampleXml] = useState(null)

  const handleRun = () => {
    const currentObjects = Object.values(threeObjStore)
    setPendingObjects(currentObjects)
    setObjects(currentObjects)
  }

  return (
    <div className="h-full w-full">
      <div className="h-[10%] w-full">
        <Header onRun={handleRun} onLoadExample={setExampleXml} />
      </div>

      <div className="grid 2xl:grid-cols-[40%_60%] xl:grid-cols-[40%_60%] lg:grid-cols-[50%_50%] h-[90%]">
        <BlocksCanvas
          onObjectsChange={setPendingObjects}
          exampleXml={exampleXml}
          onExampleConsumed={() => setExampleXml(null)}
        />
        <Scene3D objects={objects} />                                                                                                                 
      </div>
    </div>
  )
}

export default Layout
