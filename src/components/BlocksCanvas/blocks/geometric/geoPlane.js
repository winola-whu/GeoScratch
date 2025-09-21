import * as Blockly from 'blockly/core'
import { javascriptGenerator, Order } from 'blockly/javascript'

let REGISTERED = false


export function initGeoPlaneBlock() {
  if (REGISTERED) return
  REGISTERED = true

  // ===== Block 定义 =====
  Blockly.Blocks['geo_plane'] = {
    init() {
      this.appendDummyInput().appendField('Plane (Geometric)')
      this.appendValueInput('pos').appendField('pos:')
      this.appendValueInput('side').appendField('side length:')
      this.setStyle('math_blocks')
      this.setTooltip('Plane at position p, with side length s.')
      this.setDeletable(true)
      this.setMovable(true)
      this.setOutput(true, 'obj3D')
    },
  }

  javascriptGenerator.forBlock['geo_plane'] = function (block, generator) {
    const planeDec = `(new THREE.Mesh(new THREE.PlaneGeometry(
              ${generator.valueToCode(
                block,
                'side',
                Order.FUNCTION_CALL
              )}, ${generator.valueToCode(
      block,
      'side',
      Order.FUNCTION_CALL
    )}), 
              new THREE.MeshStandardMaterial({color: 0xffff00, roughness: 0.4, metalness:0.1})))`
    //.position.copy(${generator.valueToCode(block, 'pos', Order.FUNCTION_CALL)})`
    return [planeDec, Order.ATOMIC]
  }
}
