import * as Blockly from 'blockly/core'
import { javascriptGenerator, Order } from 'blockly/javascript'

let REGISTERED = false

export function initScaleMatrixBlock() {
  if (REGISTERED) return
  REGISTERED = true

  Blockly.Blocks['scale_matrix'] = {
    init() {
      this.appendDummyInput().appendField('Scaling Matrix')
      this.appendDummyInput()
        .appendField(new Blockly.FieldNumber(1), 'r1c1')
        .appendField('0')
        .appendField('0')
        .appendField('0')
      this.appendDummyInput()
        .appendField('0')
        .appendField(new Blockly.FieldNumber(1), 'r2c2')
        .appendField('0')
        .appendField('0')
      this.appendDummyInput()
        .appendField('0')
        .appendField('0')
        .appendField(new Blockly.FieldNumber(1), 'r3c3')
        .appendField('0')
      this.appendDummyInput()
        .appendField('0')
        .appendField('0')
        .appendField('0')
        .appendField('1')
      this.setStyle('math_blocks')
      this.setTooltip('Homogeneous Scaling Matrix')
      this.setDeletable(true)
      this.setMovable(true)
      this.setOutput(true, 'scaleMat')
      this.setColour(85)
    },
  }

  javascriptGenerator.forBlock['scale_matrix'] = function (block, generator) {
    const vals = [
      block.getFieldValue('r1c1'),
      0,
      0,
      0,
      0,
      block.getFieldValue('r2c2'),
      0,
      0,
      0,
      0,
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

  javascriptGenerator.forBlock['scalar'] = function (block, generator) {
    const v = Number(block.getFieldValue('scalar'))
    return [String(isFinite(v) ? v : 1), Order.ATOMIC]
  }
}
