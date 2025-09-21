import * as Blockly from 'blockly/core'
import { javascriptGenerator, Order } from 'blockly/javascript'

let REGISTERED = false

export function initObjectTransformBlock() {
  if (REGISTERED) return
  REGISTERED = true

  Blockly.Blocks['object_transform'] = {
    init() {
      this.appendDummyInput().appendField('Object Transform')
      this.setPreviousStatement(true)
      this.setNextStatement(true)
      this.appendValueInput('rot').appendField('Rotate:').setCheck('rotMat')
      this.appendValueInput('trans')
        .appendField('Translate:')
        .setCheck('transMat')
      this.appendValueInput('scale')
        .appendField('Scaling:')
        .setCheck('scaleMat')
      this.setStyle('math_blocks')
      this.setTooltip('Translate / rotate object in R3')
      this.setDeletable(true)
      this.setMovable(true)
    },
  }
  
  javascriptGenerator.forBlock['object_transform'] = function (
    block,
    generator
  ) {
    const rot =
      generator.valueToCode(block, 'rot', Order.FUNCTION_CALL) || 'null'
    const trans =
      generator.valueToCode(block, 'trans', Order.FUNCTION_CALL) || 'null'
    const scale =
      generator.valueToCode(block, 'scale', Order.FUNCTION_CALL) || 'null'

    // Find the nearest previous 'variables_set_obj3D' in the chain
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
      return `/* transform: no previous obj3D setter found — skipping */\n`
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
    if (_s && _s.isMatrix4) {
      const e = _s.elements
      obj.scale.multiply(new THREE.Vector3(
        isFinite(e[0])  && e[0]  !== 0 ? e[0]  : 1,
        isFinite(e[5])  && e[5]  !== 0 ? e[5]  : 1,
        isFinite(e[10]) && e[10] !== 0 ? e[10] : 1
        ))
    }
    
    obj.updateMatrixWorld(true);
    threeObjStore["${varName}"] = obj;
  })();\n`
  }
}
