import * as Blockly from 'blockly/core'
import { javascriptGenerator, Order } from 'blockly/javascript'

let REGISTERED = false

/**
 * Register linalg_vec3 (3-dimensional vector) building blocks + code generator
 * Output type: 'vector3'
 * Field: X/Y/Z (number)
 */
export function initMat4x4Block() {
  if (REGISTERED) return
  REGISTERED = true

  Blockly.Blocks['linalg_mat4x4'] = {
    init() {
      this.appendDummyInput().appendField('4x4 Matrix')
      this.appendDummyInput().appendField(new Blockly.FieldNumber(1), 'r1c1')
        .appendField(new Blockly.FieldNumber(1), 'r1c2')
        .appendField(new Blockly.FieldNumber(1), 'r1c3')
        .appendField(new Blockly.FieldNumber(1), 'r1c4')
      this.appendDummyInput().appendField(new Blockly.FieldNumber(1), 'r2c1')
        .appendField(new Blockly.FieldNumber(1), 'r2c2')
        .appendField(new Blockly.FieldNumber(1), 'r2c3')
        .appendField(new Blockly.FieldNumber(1), 'r2c4')
      this.appendDummyInput().appendField(new Blockly.FieldNumber(1), 'r3c1')
        .appendField(new Blockly.FieldNumber(1), 'r3c2')
        .appendField(new Blockly.FieldNumber(1), 'r3c3')
        .appendField(new Blockly.FieldNumber(1), 'r3c4')
      this.appendDummyInput().appendField(new Blockly.FieldNumber(1), 'r4c1')
        .appendField(new Blockly.FieldNumber(1), 'r4c2')
        .appendField(new Blockly.FieldNumber(1), 'r4c3')
        .appendField(new Blockly.FieldNumber(1), 'r4c4')
      this.setStyle('math_blocks')
      this.setTooltip('4x4 Matrix')
      this.setDeletable(true)
      this.setMovable(true)
      this.setOutput(true, 'matrix4')
    }
  }

  //Linalg primitives
  javascriptGenerator.forBlock['linalg_mat4x4'] = function (block, generator) {
    const matString = `new THREE.Matrix4(${block.getFieldValue('r1c1')}, ${block.getFieldValue('r1c2')}, ${block.getFieldValue('r1c3')}, ${block.getFieldValue('r1c4')},`
      + `${block.getFieldValue('r2c1')}, ${block.getFieldValue('r2c2')}, ${block.getFieldValue('r2c3')}, ${block.getFieldValue('r2c4')}, `
      + `${block.getFieldValue('r3c1')}, ${block.getFieldValue('r3c2')}, ${block.getFieldValue('r3c3')}, ${block.getFieldValue('r3c4')}, `
      + `${block.getFieldValue('r4c1')}, ${block.getFieldValue('r4c2')}, ${block.getFieldValue('r4c3')}, ${block.getFieldValue('r4c4')})`
    return [matString, Order.ATOMIC]
  }
}
