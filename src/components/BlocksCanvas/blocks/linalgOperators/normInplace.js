import * as Blockly from 'blockly/core'
import { javascriptGenerator, Order } from 'blockly/javascript'

let REGISTERED = false

export function initNormInplaceBlock() {
  if (REGISTERED) return
  REGISTERED = true

  Blockly.Blocks['norm_inplace'] = {
    init() {
      this.appendDummyInput()
        .appendField('norm(')
        .appendField(new Blockly.FieldVariable('Vector'), 'VAR')
      this.appendDummyInput('').appendField(')')
      this.setStyle('math_blocks')
      this.setTooltip('Normalize this vector in place.')
      this.setInputsInline(true)
      this.setDeletable(true)
      this.setMovable(true)
      this.setOutput(true)
    },
  }

  javascriptGenerator.forBlock['norm_inplace'] = function (block, generator) {
    var varName = generator.getVariableName(block.getFieldValue('VAR'))
    const normString = varName + `.normalize();`
    return [normString, Order.FUNCTION_CALL]
  }
}
