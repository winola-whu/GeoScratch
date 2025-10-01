import * as Blockly from 'blockly/core'
import { javascriptGenerator, Order } from 'blockly/javascript'
// import { threeObjStore } from '@/utils/store' // Global store for persisting THREE objects

let REGISTERED = false

/**
 * Register variables_set_obj3D building blocks + generator
 */
export function initSetObj3DBlock() {
  if (REGISTERED) return
  REGISTERED = true

  // === Block Defination ===
  Blockly.Blocks['variables_set_obj3D'] = {
    init: function () {
      this.appendValueInput('VALUE')
        .setCheck('obj3D')
        .appendField('set')
        .appendField(
          new Blockly.FieldDropdown(() => {
            const variables = this.workspace.getVariablesOfType('obj3D')
            return variables.map((v) => [v.name, v.name])
          }),
          'VAR'
        )
        .appendField('to')
      this.setPreviousStatement(true, null)
      this.setNextStatement(true, null)
      this.setStyle('variable_blocks')
      this.setTooltip('Set a 3D object variable')
    },
  }

  // === Generator ===
  javascriptGenerator.forBlock['variables_set_obj3D'] = function (
    block,
    generator
  ) {
    const varName = generator.getVariableName(block.getFieldValue('VAR'))
    const argument0 =
      generator.valueToCode(block, 'VALUE', Order.NONE) || 'null'

    // Ensure variable is declared only once
    generator.definitions_[varName] = `let ${varName};`

    // Assign in eval scope, also update threeObjStore
    const setLocal = `${varName} = ${argument0};\n`
    const persist = `threeObjStore["${varName}"] = ${argument0};\n`

    return setLocal + persist
  }
}
