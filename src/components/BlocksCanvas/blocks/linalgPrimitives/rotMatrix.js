import * as Blockly from 'blockly/core'
import { javascriptGenerator, Order } from 'blockly/javascript'

let REGISTERED = false

/**
 * Register linalg_vec3 (3-dimensional vector) building blocks + code generator
 * Output type: 'vector3'
 * Field: X/Y/Z (number)
 */
export function initRotMatrixBlock() {
  if (REGISTERED) return
  REGISTERED = true

  Blockly.Blocks['rot_matrix'] = {
    init() {
      this.appendDummyInput().appendField('Rotation Matrix')
      this.appendDummyInput()
        .appendField(new Blockly.FieldNumber(1), 'r1c1')
        .appendField(new Blockly.FieldNumber(0), 'r1c2')
        .appendField(new Blockly.FieldNumber(0), 'r1c3')
        .appendField('0')
      this.appendDummyInput()
        .appendField(new Blockly.FieldNumber(0), 'r2c1')
        .appendField(new Blockly.FieldNumber(1), 'r2c2')
        .appendField(new Blockly.FieldNumber(0), 'r2c3')
        .appendField('0')
      this.appendDummyInput()
        .appendField(new Blockly.FieldNumber(0), 'r3c1')
        .appendField(new Blockly.FieldNumber(0), 'r3c2')
        .appendField(new Blockly.FieldNumber(1), 'r3c3')
        .appendField('0')
      this.appendDummyInput()
        .appendField('0')
        .appendField('0')
        .appendField('0')
        .appendField('1')
      this.setStyle('math_blocks')
      this.setTooltip('Homogeneous Rotation Matrix')
      this.setDeletable(true)
      this.setMovable(true)
      this.setOutput(true, 'rotMat')
    },
  }

  javascriptGenerator.forBlock['rot_matrix'] = function (block, generator) {
    const vals = [
      block.getFieldValue('r1c1'),
      block.getFieldValue('r1c2'),
      block.getFieldValue('r1c3'),
      0,
      block.getFieldValue('r2c1'),
      block.getFieldValue('r2c2'),
      block.getFieldValue('r2c3'),
      0,
      block.getFieldValue('r3c1'),
      block.getFieldValue('r3c2'),
      block.getFieldValue('r3c3'),
      0,
      0,
      0,
      0,
      1,
    ]
    const code = `(function(){
  const M = new THREE.Matrix4();
  M.set(${vals.join(',')});
  return M;
})()`
    return [code, Order.ATOMIC]
  }
}
