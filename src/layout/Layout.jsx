import { Outlet } from 'react-router-dom'
import Header from '@/components/Header/Header'
import Scene3D from '@/components/Scene3D/Scene3D'
import BlocksCanvas from '@/components/BlocksCanvas/BlocksCanvas'
import { useState } from 'react'

const Layout = () => {
  const [objects, setObjects] = useState([]) // [{type, params}, ...]
  return (
    <>
      <div className="h-full w-full">
        <div className="h-[10%] w-full">
          <Header />
        </div>

        <div className="flex h-[90%]">
          <BlocksCanvas onObjectsChange={setObjects} />
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
