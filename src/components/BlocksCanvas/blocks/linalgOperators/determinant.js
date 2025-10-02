import * as Blockly from 'blockly/core'
import { javascriptGenerator, Order } from 'blockly/javascript'

let REGISTERED = false

export function initDeterminantBlock() {
  if (REGISTERED) return
  REGISTERED = true

  Blockly.Blocks['determinant'] = {
    init() {
      this.appendDummyInput().appendField('det(')
      this.appendValueInput('mat')
      this.appendDummyInput('').appendField(')')
      this.setStyle('math_blocks')
      this.setTooltip('Calculate the determinant of this matrix.')
      this.setInputsInline(true)
      this.setDeletable(true)
      this.setMovable(true)
      this.setOutput(true)
      this.setColour(155)
    },
  }

  javascriptGenerator.forBlock['determinant'] = function (block, generator) {
    const detString = `(${generator.valueToCode(
      block,
      'mat',
      Order.FUNCTION_CALL
    )}).determinant()`
    return [detString, Order.FUNCTION_CALL]
  }
}
