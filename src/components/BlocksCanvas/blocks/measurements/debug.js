import * as Blockly from 'blockly/core'
import { javascriptGenerator, Order } from 'blockly/javascript'

let REGISTERED = false

export function initDebugBlock() {
  if (REGISTERED) return
  REGISTERED = true

  Blockly.Blocks['debug'] = {
    init() {
      this.appendDummyInput().appendField('debug(')
      this.appendValueInput('exp')
      this.appendDummyInput('').appendField(')')
      this.setStyle('math_blocks')
      this.setTooltip(
        'Prints the output of this expression to the web console.'
      )
      this.setInputsInline(true)
      this.setDeletable(true)
      this.setMovable(true)
      this.setOutput(true)
    },
  }

  //Linalg primitives
  javascriptGenerator.forBlock['debug'] = function (block, generator) {
    const debugString = `console.log(${generator.valueToCode(
      block,
      'exp',
      Order.FUNCTION_CALL
    )});`
    return [debugString, Order.FUNCTION_CALL]
  }
}
