import * as Blockly from 'blockly/core'
import { javascriptGenerator, Order } from 'blockly/javascript'

let REGISTERED = false

export function initTransMatrixBlock() {
  if (REGISTERED) return
  REGISTERED = true

  Blockly.Blocks['trans_matrix'] = {
    init() {
      this.appendDummyInput().appendField('Translate (x, y, z)')
      this.appendDummyInput()
        .appendField('x')
        .appendField(new Blockly.FieldNumber(0), 'TX')
        .appendField('y')
        .appendField(new Blockly.FieldNumber(0), 'TY')
        .appendField('z')
        .appendField(new Blockly.FieldNumber(0), 'TZ')
      this.setStyle('math_blocks')
      this.setTooltip('Homogeneous translation by (x,y,z).')
      this.setOutput(true, 'transMat')
      this.setColour(85)
    },
  }

  javascriptGenerator.forBlock['trans_matrix'] = function (block) {
    const tx = Number(block.getFieldValue('TX')) || 0
    const ty = Number(block.getFieldValue('TY')) || 0
    const tz = Number(block.getFieldValue('TZ')) || 0
    const code = `(function(){
      return new THREE.Matrix4().makeTranslation(${tx}, ${ty}, ${tz});
    })()`
    return [code, Order.ATOMIC]
  }
}
