import * as Blockly from 'blockly/core'
import { javascriptGenerator, Order } from 'blockly/javascript'

let REGISTERED = false

export function initVec4Block() {
  if (REGISTERED) return
  REGISTERED = true

  Blockly.Blocks['linalg_vec4'] = {
    init() {
      this.appendDummyInput().appendField('Vector4: (')
        .appendField(new Blockly.FieldNumber(1), 'W').appendField(',')
        .appendField(new Blockly.FieldNumber(1), 'X').appendField(',')
        .appendField(new Blockly.FieldNumber(1), 'Y').appendField(',')
        .appendField(new Blockly.FieldNumber(1), 'Z').appendField(')')
      this.setStyle('math_blocks')
      this.setTooltip('4D Vector')
      this.setDeletable(true)
      this.setMovable(true)
      this.setOutput(true, 'vector4')
      this.setColour(85)
    }
  }

  javascriptGenerator.forBlock['linalg_vec4'] = function (block, generator) {
    const vecString = `new THREE.Vector4(${block.getFieldValue('W')}, ${block.getFieldValue('X')}, ${block.getFieldValue('Y')}, ${block.getFieldValue('Z')})`
    return [vecString, Order.ATOMIC]
  }
}
