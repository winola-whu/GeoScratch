import * as Blockly from 'blockly/core'
import { javascriptGenerator, Order } from 'blockly/javascript'

let REGISTERED = false

export function initDotProductBlock() {
  if (REGISTERED) return
  REGISTERED = true

  Blockly.Blocks['dot_product'] = {
    init() {
      this.appendDummyInput()
      this.appendValueInput('lhs').setCheck('vector3')
      this.appendValueInput('rhs').setCheck('vector3').appendField('·')
      this.setStyle('math_blocks')
      this.setTooltip('Take the dot (inner) product of two vectors.')
      this.setInputsInline(true)
      this.setDeletable(true)
      this.setMovable(true)
      this.setOutput(true)
    },
  }

  javascriptGenerator.forBlock['dot_product'] = function (block, generator) {
    const dotString = `(${generator.valueToCode(
      block,
      'lhs',
      Order.FUNCTION_CALL
    )}).dot(${generator.valueToCode(block, 'rhs', Order.FUNCTION_CALL)})`
    return [dotString, Order.FUNCTION_CALL]
  }
}
