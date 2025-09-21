import { generateAndRun, threeObjStore } from '@/components/BlocksCanvas/BlocksCodeGen'

/**
 * Unified "Run code + Synchronize 3D objects to upper-level callbacks"
 * Make only one function in the component, the logic is more intuitive
 * @param {Blockly.WorkspaceSvg} ws
 * @param {(objs: any[]) => void} onObjectsChange
 */
const runAndSync = (ws, onObjectsChange) => {
  generateAndRun(ws)
  onObjectsChange?.(Object.values(threeObjStore))
}

export default runAndSync
