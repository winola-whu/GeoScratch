import { useEffect, useRef } from 'react'
// import { defineBlocks } from './BlocksDefinition'
import defineBlocks from '@/components/BlocksCanvas/blocks/index'
// import { generateAndRun, threeObjStore } from './BlocksCodeGen'

import 'blockly/blocks'

import { createObj3DButtonHandler, obj3DFlyoutCallback } from "@/utils/callbacks"
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

  // Register Callbacks
  const registerCallbacks = (ws) => {
    ws.registerButtonCallback('createObj3DButtonCallback', createObj3DButtonHandler)
    ws.registerToolboxCategoryCallback('OBJS_3D', obj3DFlyoutCallback)
  }

  useEffect(() => {
    defineBlocks()

    const ws = initWorkSpace(hostRef.current)
    workspaceRef.current = ws


    // Register Callbacks
    registerCallbacks(ws)

    // Merge high-frequency events and then trigger run and sync
    const cleanupListener = setupChangeListener(ws, (w) => runAndSync(w, onObjectsChange))

    // Synchronize once for the first time (let the upper layer get the initial object)
    runAndSync(ws, onObjectsChange)

    // Adaptive size
    const cleanupResize = attachResizeObserver(hostRef.current, ws)

    return () => {
      cleanupListener()
      cleanupResize()
      ws.dispose()
    }
  }, [onObjectsChange])

  // Sample XML mount (initialization independent)
  useEffect(() => {
    const ws = workspaceRef.current
    if (!ws || !exampleXml) return

    const ok = applyExampleXml(ws, exampleXml)
    if (ok) runAndSync(ws, onObjectsChange)
    
    onExampleConsumed?.()
    // try {
    //   const dom = Blockly.utils.xml.textToDom(exampleXml)
    //   ws.clear()
    //   Blockly.Xml.domToWorkspace(dom, ws)
    //   generateAndRun(ws)
    //   onObjectsChange?.(Object.values(threeObjStore))
    // } catch (err) {
    //   console.error('[GeoScratch] failed to load example', err)
    // } finally {
    //   onExampleConsumed?.()
    // }
  }, [exampleXml, onObjectsChange, onExampleConsumed])

  return (
    <div className="panel panel-left" id="blocks-canvas">
      <div className="blocks-toolbar">
        <span style={{ opacity: 0.8 }}>Blocks</span>
      </div>
      <div className="blocks-content" ref={hostRef} />
    </div>
  )
}
