import * as Blockly from 'blockly/core'
import { javascriptGenerator, Order } from 'blockly/javascript'

let REGISTERED = false

export function initCrossProductBlock() {
  if (REGISTERED) return
  REGISTERED = true

  Blockly.Blocks['cross_product_inplace'] = {
    init() {
      this.appendDummyInput().appendField(
        new Blockly.FieldVariable('Vector'),
        'VAR'
      )
      this.appendValueInput('rhs').appendField('×')
      this.setStyle('math_blocks')
      this.setTooltip('Take the cross product of two matrices.')
      this.setInputsInline(true)
      this.setDeletable(true)
      this.setMovable(true)
      this.setOutput(true)
    },
  }

  javascriptGenerator.forBlock['cross_product_inplace'] = function (
    block,
    generator
  ) {
    var varName = generator.getVariableName(block.getFieldValue('VAR'))
    const crossString =
      varName +
      `.cross(${generator.valueToCode(block, 'rhs', Order.FUNCTION_CALL)});`
    return [crossString, Order.FUNCTION_CALL]
  }
}
