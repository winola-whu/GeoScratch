/**
 * Listen to workspace change events and use requestAnimationFrame to merge high-frequency triggers 
 * Avoid generatingAndRun too frequently (lots of events when dragging/connecting)
 * @param {Blockly.WorkspaceSvg} ws
 * @param {(ws: Blockly.WorkspaceSvg) => void} onRun Things to do after the change (run/sync)
 * @returns {() => void} Cleaning functions
 */

const setupChangeListener = (ws, onRun) => {
  let raf = 0

  const listener = (e) => {
    // Filter UI events (open toolbox, zoom, etc.), only respond to code structure changes
    if (e.isUiEvent) return

    cancelAnimationFrame(raf)
    raf = requestAnimationFrame(() => onRun(ws))
  }

  ws.addChangeListener(listener)

  return () => {
    cancelAnimationFrame(raf)
    ws.removeChangeListener(listener)
  }
}

export default setupChangeListener