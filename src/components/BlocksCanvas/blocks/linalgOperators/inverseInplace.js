import * as Blockly from 'blockly/core'
import { javascriptGenerator, Order } from 'blockly/javascript'

let REGISTERED = false

export function initInverseInplaceBlock() {
  if (REGISTERED) return
  REGISTERED = true

  Blockly.Blocks['inverse_inplace'] = {
    init() {
      this.appendDummyInput()
        .appendField('inv(')
        .appendField(new Blockly.FieldVariable('Matrix'), 'VAR')
      this.appendDummyInput('').appendField(')')
      this.setStyle('math_blocks')
      this.setTooltip('Calculate the inverse of this matrix.')
      this.setInputsInline(true)
      this.setDeletable(true)
      this.setMovable(true)
      this.setOutput(true)
    },
  }

  javascriptGenerator.forBlock['inverse_inplace'] = function (
    block,
    generator
  ) {
    var varName = generator.getVariableName(block.getFieldValue('VAR'))
    const invString = varName + `.invert();`
    return [invString, Order.FUNCTION_CALL]
  }
}
