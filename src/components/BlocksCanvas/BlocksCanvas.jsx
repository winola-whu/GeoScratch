import { useEffect, useRef } from 'react'
import defineBlocks from '@/components/BlocksCanvas/blocks/index'
import { BlockRegistry } from '@/components/BlocksCanvas/state/BlockRegistry'
import useWorkspaceStore from '@/store/useWorkspaceStore'
import useThreeStore from '@/store/useThreeStore'
import 'blockly/blocks'
import { createObj3DButtonHandler, obj3DFlyoutCallback } from '@/utils/callbacks'
import Obj3DDialog from '../CreateObj3DDiaglog'
import runAndSync from '../../utils/runAndSync'
import attachResizeObserver from '@/utils/attachResizeOberver'
import setupChangeListener from '@/utils/setupChangeListener'
import initWorkSpace from '@/components/BlocksCanvas/core/Workspace'

import './BlocksCanvas.css'

export default function BlocksCanvas({ onObjectsChange }) {
  const hostRef = useRef(null)
  const workspaceRef = useRef(null)
  const registryRef = useRef(null)

  const {
    workspace,
    dialogOpen,
    setWorkspace,
    setDialogOpen,
    exampleXml,
    clearExampleXml,
  } = useWorkspaceStore()

  const { clearObjects } = useThreeStore()

  // Register Callbacks
  const registerCallbacks = (ws) => {
    // ws.registerButtonCallback(
    //   'createObj3DButtonCallback',
    //   createObj3DButtonHandler
    // )
    // Replace native prompt pop-up
    ws.registerButtonCallback('createObj3DButtonCallback', () => {
      setWorkspace(ws)
      setDialogOpen(true)
    })
    ws.registerToolboxCategoryCallback('OBJS_3D', obj3DFlyoutCallback)
  }

  // Initialize Blockly once
  useEffect(() => {
    defineBlocks()
    if (!registryRef.current) registryRef.current = new BlockRegistry()

    const ws = initWorkSpace(hostRef.current)
    setWorkspace(ws)

    // Register Callbacks
    registerCallbacks(ws)

    // Change listener -> run + sync
    const cleanupListener = setupChangeListener(ws, (w) => {
      clearObjects() // 清理旧对象
      runAndSync(w, onObjectsChange, registryRef.current)
    })

    // Initial run
    runAndSync(ws, onObjectsChange, registryRef.current)

    // Adaptive size
    const cleanupResize = attachResizeObserver(hostRef.current, ws)

    return () => {
      cleanupListener()
      cleanupResize()
      ws.dispose()
    }
  }, [])

  // Load example XML
  useEffect(() => {
    if (!workspace || !exampleXml) return

    const ok = applyExampleXml(workspace, exampleXml)
    if (ok) {
      runAndSync(workspace, onObjectsChange, registryRef.current)
    }
    clearExampleXml()
  }, [exampleXml, workspace])

  return (
    <div className="panel panel-left" id="blocks-canvas">
      <div className="blocks-toolbar">
        <span style={{ opacity: 0.8 }}>Blocks</span>
      </div>
      <div className="blocks-content" ref={hostRef} />

      <Obj3DDialog
        open={dialogOpen}
        onOpenChange={(open) => setDialogOpen(open)}
        workspace={workspace}
      />
    </div>
  )
}

