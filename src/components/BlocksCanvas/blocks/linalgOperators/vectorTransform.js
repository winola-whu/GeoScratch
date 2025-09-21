import * as Blockly from 'blockly/core'
import { javascriptGenerator, Order } from 'blockly/javascript'

let REGISTERED = false

export function initVectorTransformBlock() {
  if (REGISTERED) return
  REGISTERED = true

  Blockly.Blocks['vector_transform'] = {
    init() {
      this.appendDummyInput().appendField('Vector Transform')
      this.setPreviousStatement(true)
      this.setNextStatement(true)
      this.appendValueInput('rot').appendField('Rotate:').setCheck('rotMat')
      this.appendValueInput('trans')
        .appendField('Translate:')
        .setCheck('transMat')
      this.appendValueInput('scale').appendField('Scaling:').setCheck('scalar')
      this.setStyle('math_blocks')
      this.setTooltip('Translate / rotate vector in R3')
      this.setDeletable(true)
      this.setMovable(true)
    },
  }

  javascriptGenerator.forBlock['vector_transform'] = function (
    block,
    generator
  ) {
    const rot =
      generator.valueToCode(block, 'rot', Order.FUNCTION_CALL) || 'null'
    const trans =
      generator.valueToCode(block, 'trans', Order.FUNCTION_CALL) || 'null'
    const scale =
      generator.valueToCode(block, 'scale', Order.FUNCTION_CALL) || 'null'

    let prev = block.getPreviousBlock()
    let varName = null
    while (prev) {
      if (prev.type === 'variables_set_obj3D') {
        const varId = prev.getFieldValue('VAR')
        varName = generator.getVariableName(varId)
        break
      }
      prev = prev.getPreviousBlock()
    }

    if (!varName) {
      return `/* transform: no previous geo_vector setter found — skipping */\n`
    }

    return `
  (function(){
    const obj = ${varName};
    if(!obj || !obj.isObject3D){ return; }

    const _rot = ${rot};
    if (_rot && _rot.isMatrix4) {
      const _q = new THREE.Quaternion().setFromRotationMatrix(_rot);
      obj.quaternion.premultiply(_q);
    }

    const _t = ${trans};
    if (_t && _t.isMatrix4) {
      const _p = new THREE.Vector3().setFromMatrixPosition(_t);
      obj.position.add(_p);
    }
    
    const _s = ${scale};
    if (typeof _s === 'number' && isFinite(_s)) {
      const curr = obj.userData.length ?? 1;
      const newLen = Math.max(0, curr * _s);
      obj.userData.length = newLen;
      const hlr = obj.userData.headLenRatio ?? 0.25;
      const hwr = obj.userData.headWidthRatio ?? 0.10;
      obj.setLength(newLen, hlr * newLen, hwr * newLen);
    }
    
    obj.updateMatrixWorld(true);
    threeObjStore["${varName}"] = obj;
  })();\n`
  }
}
