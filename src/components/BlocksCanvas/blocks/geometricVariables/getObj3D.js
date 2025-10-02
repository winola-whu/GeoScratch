import * as Blockly from 'blockly/core'
import { javascriptGenerator, Order } from 'blockly/javascript'

let REGISTERED = false

/**
 * Register variables_get_obj3D building blocks + generator
 */
export function initGetObj3DBlock() {
  if (REGISTERED) return
  REGISTERED = true

  // === Block Defination ===
  Blockly.Blocks['variables_get_obj3D'] = {
    init() {
      this.appendDummyInput()
        .appendField(
          new Blockly.FieldVariable('item', null, ['obj3D'], 'obj3D')
        )
        .appendField(' (3D Object)')
      this.setOutput(true, 'obj3D')
      this.setStyle('variable_blocks')
      this.setTooltip('Get a 3D object variable')
      this.setColour(255)
    },
  }

  // === Generator ===
  javascriptGenerator.forBlock['variables_get_obj3D'] = function (
    block,
    generator
  ) {
    const code = generator.getVariableName(block.getFieldValue('VAR'))
    return [code, Order.ATOMIC]
  }
}
