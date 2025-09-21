import * as Blockly from 'blockly/core'
import { javascriptGenerator, Order } from 'blockly/javascript'

let REGISTERED = false

export function initVectorArithmeticBlock() {
  if (REGISTERED) return
  REGISTERED = true

  Blockly.Blocks['vector_arithmetic'] = {
    init() {
      this.appendValueInput('u').setCheck('vector3')
      this.appendValueInput('v')
        .setCheck('vector3')
        .appendField(
          new Blockly.FieldDropdown([
            ['u + v', 'add'],
            ['u - v', 'subtract'],
          ]),
          'OP'
        )
      this.setPreviousStatement(true)
      this.setNextStatement(true)
      this.setStyle('math_blocks')
      this.setTooltip('Computes u ± v and renders the result')
      this.setDeletable(true)
      this.setMovable(true)
      this.setInputsInline(true)
    },
  }

  javascriptGenerator.forBlock['vector_arithmetic'] = function (
    block,
    generator
  ) {
    const op = block.getFieldValue('OP') || 'add'
    const u =
      generator.valueToCode(block, 'u', Order.FUNCTION_CALL) ||
      'new THREE.Vector3()'
    const v =
      generator.valueToCode(block, 'v', Order.FUNCTION_CALL) ||
      'new THREE.Vector3()'

    return `
  (function(){
    const a = (${u}).clone();
    const b = (${v}).clone();
    const origin = new THREE.Vector3();

    const dir = (('${op}'==='add') ? a.add(b) : a.sub(b));
    let len = dir.length();

    if (!isFinite(len) || len <= 0) return;               // nothing to render
    if (!isFinite(dir.length()) || dir.length() === 0) return;

    const norm = dir.clone().normalize();
    const headLenRatio = 0.25, headWidthRatio = 0.10;

    const arrow = new THREE.ArrowHelper(
      norm, origin, len, 0x7c3aed,
      headLenRatio * len, headWidthRatio * len
    );
    const _id = 'vec_tmp_' + Date.now().toString(36) + '_' + Math.floor(Math.random()*1e6).toString(36);
    threeObjStore[_id] = arrow;
  })();\n`
  }
}
