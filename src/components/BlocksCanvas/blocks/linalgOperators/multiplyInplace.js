import * as Blockly from 'blockly/core'
import { javascriptGenerator, Order } from 'blockly/javascript'

let REGISTERED = false

export function initMultiplyInplaceBlock() {
  if (REGISTERED) return
  REGISTERED = true

  Blockly.Blocks['multiply_inplace'] = {
    init() {
      this.appendDummyInput().appendField(
        new Blockly.FieldVariable('Matrix'),
        'VAR'
      )
      this.appendValueInput('rhs').appendField('*')
      this.setStyle('math_blocks')
      this.setTooltip('Multiply two matrices.')
      this.setInputsInline(true)
      this.setDeletable(true)
      this.setMovable(true)
      this.setOutput(true)
    },
  }

  javascriptGenerator.forBlock['multiply_inplace'] = function (
    block,
    generator
  ) {
    var varName = generator.getVariableName(block.getFieldValue('VAR'))
    const multString =
      varName +
      `.multiply(${generator.valueToCode(block, 'rhs', Order.FUNCTION_CALL)});`
    return [multString, Order.FUNCTION_CALL]
  }
}
