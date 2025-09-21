import * as Blockly from 'blockly/core'
import { javascriptGenerator, Order } from 'blockly/javascript'
// import { threeObjStore } from '@/utils/store' // 持久化 THREE 对象的全局 store

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

    // 确保变量只声明一次
    generator.definitions_[varName] = `let ${varName};`

    // 在 eval 作用域赋值，同时更新 threeObjStore
    const setLocal = `${varName} = ${argument0};\n`
    const persist = `threeObjStore["${varName}"] = ${argument0};\n`

    return setLocal + persist
  }
}
