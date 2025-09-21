import * as Blockly from 'blockly/core'

/**
 * Use ResizeObserver to trigger svgResize when container size changes
 * @param {HTMLElement} hostEl container element
 * @param {Blockly.WorkspaceSvg} ws
 * @returns {() => void} Cleaning function
 */
const attachResizeObserver = (hostEl, ws) => {
  const ro = new ResizeObserver(() => Blockly.svgResize(ws))
  ro.observe(hostEl)
  return () => ro.disconnect()
}

export default attachResizeObserver