import { Outlet } from 'react-router-dom'
import Header from '@/components/Header/Header'
import Scene3D from '@/components/Scene3D/Scene3D'
import BlocksCanvas from '@/components/BlocksCanvas/BlocksCanvas'
import { useState } from 'react'
import { threeObjStore } from '@/components/BlocksCanvas/BlocksCodeGen'

const Layout = () => {
  const [objects, setObjects] = useState([]) // [{type, params}, ...]
  const [pendingObjects, setPendingObjects] = useState([]) // Store objects awaiting rendering

  const handleRun = () => {
    const currentObjects = Object.values(threeObjStore)
    setPendingObjects(currentObjects)
    setObjects(currentObjects)
  }

  return (
    <>
      <div className="h-full w-full">
        <div className="h-[10%] w-full">
          <Header onRun={handleRun} />
        </div>

        {/* width >= 1536px : 2xl  */}
        {/* width >= 1280px : xl  */}
        {/* width >= 1024px : lg  */}
        <div className="grid 2xl:grid-cols-[40%_60%] xl:grid-cols-[40%_60%] lg:grid-cols-[50%_50%]  h-[90%]">
          {/* <BlocksCanvas onObjectsChange={setObjects} /> */}
          <BlocksCanvas onObjectsChange={setPendingObjects} />
          <Scene3D objects={objects} />
        </div>

        {/* <div>
          <Outlet></Outlet>
        </div> */}
      </div>
    </>
  )
}

export default Layout
