import * as Blockly from 'blockly/core'

/**
 * Load XML text into workspace (for example loading/playback)
 * @param {Blockly.WorkspaceSvg} ws
 * @param {string} xmlText
 * @returns {boolean} Success
 */
const applyExampleXml = (ws, xmlText) => {
  try {
    const dom = Blockly.utils.xml.textToDom(xmlText)
    ws.clear()
    Blockly.Xml.domToWorkspace(dom, ws)
    return true
  } catch (err) {
    console.error('[GeoScratch] applyExampleXml error:', err)
    return false
  }
}

export default applyExampleXml
