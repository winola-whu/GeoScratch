import { useEffect, useRef } from 'react'
// import { defineBlocks } from './BlocksDefinition'
import defineBlocks from '@/components/BlocksCanvas/blocks/index'
// import { generateAndRun, threeObjStore } from './BlocksCodeGen'
import { BlockRegistry } from '@/components/BlocksCanvas/state/BlockRegistry' // NOTE: use the shared state path
import 'blockly/blocks'

import { createObj3DButtonHandler, obj3DFlyoutCallback } from '@/utils/callbacks'
import setupChangeListener from '@/utils/setupChangeListener'
import initWorkSpace from '@/components/BlocksCanvas/core/Workspace'
import attachResizeObserver from '@/utils/attachResizeOberver'
import applyExampleXml from '@/utils/applyExampleXml'

import runAndSync from '@/utils/runAndSync'
import './BlocksCanvas.css'

/**
 * BlocksCanvas: Only responsible for "assembly"
 * - Initialize workspace
 * - Register a callback
 * - Listen to changes and run
 * - Loading example XML
 * - Adaptive
 */
export default function BlocksCanvas({
                                       onObjectsChange,
                                       exampleXml,
                                       onExampleConsumed,
                                     }) {
  const hostRef = useRef(null)
  const workspaceRef = useRef(null)
  const registryRef = useRef(null)

  // Keep the latest onObjectsChange without causing re-init
  const onChangeRef = useRef(onObjectsChange)
  useEffect(() => { onChangeRef.current = onObjectsChange }, [onObjectsChange])

  // Register Callbacks
  const registerCallbacks = (ws) => {
    ws.registerButtonCallback('createObj3DButtonCallback', createObj3DButtonHandler)
    ws.registerToolboxCategoryCallback('OBJS_3D', obj3DFlyoutCallback)
  }

  // Initialize Blockly once
  useEffect(() => {
    defineBlocks()
    if (!registryRef.current) registryRef.current = new BlockRegistry()

    const ws = initWorkSpace(hostRef.current)
    workspaceRef.current = ws

    // Register Callbacks
    registerCallbacks(ws)

    // Change listener -> run + sync (use ref to avoid re-init on parent renders)
    const cleanupListener = setupChangeListener(ws, (w) =>
      runAndSync(w, (objs) => onChangeRef.current?.(objs), registryRef.current)
    )

    // Initial run
    runAndSync(ws, (objs) => onChangeRef.current?.(objs), registryRef.current)

    // Adaptive size
    const cleanupResize = attachResizeObserver(hostRef.current, ws)

    return () => {
      cleanupListener()
      cleanupResize()
      ws.dispose()
    }
    // IMPORTANT: empty deps => init once; onObjectsChange updates via ref
  }, [])

  // Load example XML without re-initializing workspace
  useEffect(() => {
    const ws = workspaceRef.current
    if (!ws || !exampleXml) return

    const ok = applyExampleXml(ws, exampleXml)
    if (ok) {
      runAndSync(ws, (objs) => onChangeRef.current?.(objs), registryRef.current)
    }
    onExampleConsumed?.()
  }, [exampleXml, onExampleConsumed])

  return (
    <div className="panel panel-left" id="blocks-canvas">
      <div className="blocks-toolbar">
        <span style={{ opacity: 0.8 }}>Blocks</span>
      </div>
      <div className="blocks-content" ref={hostRef} />
    </div>
  )
}
