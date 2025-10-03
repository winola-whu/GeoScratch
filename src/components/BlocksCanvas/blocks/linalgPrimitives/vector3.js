import * as Blockly from 'blockly/core'
import { javascriptGenerator, Order } from 'blockly/javascript'

let REGISTERED = false

/**
 * Register linalg_vec3 (3-dimensional vector) building blocks + code generator
 * Output type: 'vector3'
 * Field: X/Y/Z (number)
 */
export function initVec3Block() {
  if (REGISTERED) return
  REGISTERED = true

  Blockly.Blocks['linalg_vec3'] = {
    init() {
      this.appendDummyInput()
        .appendField('R³: (')
        .appendField(new Blockly.FieldNumber(1), 'X')
        .appendField(',')
        .appendField(new Blockly.FieldNumber(1), 'Y')
        .appendField(',')
        .appendField(new Blockly.FieldNumber(1), 'Z')
        .appendField(')')
      this.setStyle('math_blocks')
      this.setTooltip('3D coordinate')
      this.setDeletable(true)
      this.setMovable(true)
      this.setOutput(true, 'vector3')
      this.setColour(85)
    },
  }

  //Linalg primitives
  javascriptGenerator.forBlock['linalg_vec3'] = function (block, generator) {
    const vecString = `new THREE.Vector3(${block.getFieldValue(
      'X'
    )}, ${block.getFieldValue('Y')}, ${block.getFieldValue('Z')})`
    return [vecString, Order.ATOMIC]
  }
}
