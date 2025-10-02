import * as Blockly from 'blockly/core'
import { javascriptGenerator, Order } from 'blockly/javascript'

let REGISTERED = false

/**
 * Register linalg_vec3 (3-dimensional vector) building blocks + code generator
 * Output type: 'vector3'
 * Field: X/Y/Z (number)
 */
export function initMat3x3Block() {
  if (REGISTERED) return
  REGISTERED = true

  Blockly.Blocks['linalg_mat3x3'] = {
    init() {
      this.appendDummyInput().appendField('3x3 Matrix')
      this.appendDummyInput()
        .appendField(new Blockly.FieldNumber(1), 'r1c1')
        .appendField(new Blockly.FieldNumber(1), 'r1c2')
        .appendField(new Blockly.FieldNumber(1), 'r1c3')
      this.appendDummyInput()
        .appendField(new Blockly.FieldNumber(1), 'r2c1')
        .appendField(new Blockly.FieldNumber(1), 'r2c2')
        .appendField(new Blockly.FieldNumber(1), 'r2c3')
      this.appendDummyInput()
        .appendField(new Blockly.FieldNumber(1), 'r3c1')
        .appendField(new Blockly.FieldNumber(1), 'r3c2')
        .appendField(new Blockly.FieldNumber(1), 'r3c3')
      this.setStyle('math_blocks')
      this.setTooltip('3x3 Matrix')
      this.setDeletable(true)
      this.setMovable(true)
      this.setOutput(true, 'matrix3')
      this.setColour(85)
    },
  }

  //Linalg primitives
  javascriptGenerator.forBlock['linalg_mat3x3'] = function (block, generator) {
    const matString =
      `new THREE.Matrix3(${block.getFieldValue('r1c1')}, ${block.getFieldValue(
        'r1c2'
      )}, ${block.getFieldValue('r1c3')}, ` +
      `${block.getFieldValue('r2c1')}, ${block.getFieldValue(
        'r2c2'
      )}, ${block.getFieldValue('r2c3')}, ` +
      `${block.getFieldValue('r3c1')}, ${block.getFieldValue(
        'r3c2'
      )}, ${block.getFieldValue('r3c3')})`
    return [matString, Order.ATOMIC]
  }
}
