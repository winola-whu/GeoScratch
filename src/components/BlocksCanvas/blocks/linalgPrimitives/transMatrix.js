import * as Blockly from 'blockly/core'
import { javascriptGenerator, Order } from 'blockly/javascript'

let REGISTERED = false

export function initTransMatrixBlock() {
  if (REGISTERED) return
  REGISTERED = true

  Blockly.Blocks['trans_matrix'] = {
    init() {
      this.appendDummyInput().appendField('Translation Matrix')
      this.appendDummyInput()
        .appendField('1')
        .appendField('0')
        .appendField('0')
        .appendField(new Blockly.FieldNumber(0), 'r1c4')
      this.appendDummyInput()
        .appendField('0')
        .appendField('1')
        .appendField('0')
        .appendField(new Blockly.FieldNumber(0), 'r2c4')
      this.appendDummyInput()
        .appendField('0')
        .appendField('0')
        .appendField('1')
        .appendField(new Blockly.FieldNumber(0), 'r3c4')
      this.appendDummyInput()
        .appendField('0')
        .appendField('0')
        .appendField('0')
        .appendField('1')
      this.setStyle('math_blocks')
      this.setTooltip('Homogeneous Translation Matrix')
      this.setDeletable(true)
      this.setMovable(true)
      this.setOutput(true, 'transMat')
      this.setColour(85)
    },
  }

  javascriptGenerator.forBlock['trans_matrix'] = function (block, generator) {
    const vals = [
      1,
      0,
      0,
      block.getFieldValue('r1c4'),
      0,
      1,
      0,
      block.getFieldValue('r2c4'),
      0,
      0,
      1,
      block.getFieldValue('r3c4'),
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
