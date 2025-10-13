import * as Blockly from 'blockly/core'
import { javascriptGenerator, Order } from 'blockly/javascript'

let REGISTERED = false

export function initScaleMatrixBlock() {
  if (REGISTERED) return
  REGISTERED = true

  Blockly.Blocks['scale_matrix'] = {
    init() {
      this.appendDummyInput().appendField('Scale (sx, sy, sz)')
      this.appendDummyInput()
        .appendField('sx')
        .appendField(new Blockly.FieldNumber(1, -Infinity, Infinity, 0.1), 'SX')
        .appendField('sy')
        .appendField(new Blockly.FieldNumber(1, -Infinity, Infinity, 0.1), 'SY')
        .appendField('sz')
        .appendField(new Blockly.FieldNumber(1, -Infinity, Infinity, 0.1), 'SZ')
      this.setStyle('math_blocks')
      this.setTooltip('Homogeneous scaling by (sx, sy, sz).')
      this.setOutput(true, 'scaleMat')
      this.setColour(85)
    },
  }

  javascriptGenerator.forBlock['scale_matrix'] = function (block) {
    const sx = Number(block.getFieldValue('SX')); const sy = Number(block.getFieldValue('SY')); const sz = Number(block.getFieldValue('SZ'));
    const code = `(function(){
      return new THREE.Matrix4().makeScale(${sx}, ${sy}, ${sz});
    })()`
    return [code, Order.ATOMIC]
  }
}
