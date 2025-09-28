import { generateAndRun, threeObjStore } from '@/components/BlocksCanvas/BlocksCodeGen'

/**
 * Unified "Run code + Synchronize 3D objects to upper-level callbacks"
 * Make only one function in the component, the logic is more intuitive
 * @param {Blockly.WorkspaceSvg} ws
 * @param {(objects: THREE.Object3D[]) => void} onObjectsChange
 * @param {import('@/state/BlockRegistry').BlockRegistry} registry
 */
const runAndSync = (ws, onObjectsChange, registry) => {
  if (threeObjStore && typeof threeObjStore === 'object') {
    for (const k of Object.keys(threeObjStore)) delete threeObjStore[k]
  }

  generateAndRun(ws)
  const objs = Object.values(threeObjStore)
  registry.reconcile(objs)
  const objectsForScene = registry.list().map(e => e.obj)
  onObjectsChange?.(objectsForScene)
}

export default runAndSync
