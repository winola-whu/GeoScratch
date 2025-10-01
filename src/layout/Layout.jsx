import { useCallback } from 'react'
import Header from '@/components/Header/Header'
import BlocksCanvas from '@/components/BlocksCanvas/BlocksCanvas'
import Scene3D from '@/components/Scene3D/Scene3D'
import useSceneStore from '@/store/useSceneStore'
import useWorkspaceStore from '@/store/useWorkspaceStore'

const Layout = () => {
  const { 
    objects,
    autoRender, 
    pendingObjects, 
    setPendingObjects, 
    setObjects, 
    toggleAutoRender 
  } = useSceneStore()

  // Stable callback so BlocksCanvas doesn't remount the workspace
  const handleObjectsChange = useCallback((objs) => {
    setPendingObjects(objs)
    if (autoRender) setObjects(objs)
  }, [autoRender, setPendingObjects, setObjects])

  // Run commits the last pending scene only when autoRender is OFF
  const handleRun = useCallback(() => {
    if (!autoRender) setObjects(pendingObjects)
  }, [autoRender, pendingObjects, setObjects])

  return (
    <div className="h-full w-full">
      <div className="h-[10%] w-full">
        <Header
          autoRender={autoRender}
          onAutoRenderChange={toggleAutoRender}
          onRun={handleRun}
          onLoadExample={(xml) => {
            console.log('Layout received XML:', xml)
            // Use workspace store to load example
            const { setExampleXml } = useWorkspaceStore.getState()
            console.log('Calling setExampleXml')
            setExampleXml(xml)
            console.log('Set exampleXml')
          }}
        />
      </div>
      <div className="h-[90%] w-full flex">
        <div className="w-1/2 h-full">
          <BlocksCanvas onObjectsChange={handleObjectsChange} />
        </div>
        <div className="w-1/2 h-full">
          <Scene3D objects={objects} />
        </div>
      </div>
    </div>
  )
}

export default Layout