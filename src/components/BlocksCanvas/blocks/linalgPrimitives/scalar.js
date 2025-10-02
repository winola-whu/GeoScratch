import * as Blockly from 'blockly/core'
import { javascriptGenerator, Order } from 'blockly/javascript'

let REGISTERED = false

export function initScalarBlock() {
  if (REGISTERED) return
  REGISTERED = true

  Blockly.Blocks['scalar'] = {
    init() {
      this.appendDummyInput()
        .appendField('Scalar')
        .appendField(new Blockly.FieldNumber(1), 'scalar')
      this.setStyle('math_blocks')
      this.setTooltip('Vector Scalar')
      this.setDeletable(true)
      this.setMovable(true)
      this.setOutput(true, 'scalar')
      this.setColour(85)
    },
  }

  javascriptGenerator.forBlock['scalar'] = function (block, generator) {
    const v = Number(block.getFieldValue('scalar'))
    return [String(isFinite(v) ? v : 1), Order.ATOMIC]
  }
}
