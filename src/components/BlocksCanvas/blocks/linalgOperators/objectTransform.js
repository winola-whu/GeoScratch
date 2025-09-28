import * as Blockly from 'blockly/core'
import { javascriptGenerator, Order } from 'blockly/javascript'

let REGISTERED = false

export function initObjectTransformBlock() {
  if (REGISTERED) return
  REGISTERED = true

  Blockly.Blocks['object_transform'] = {
    init() {
      this.appendDummyInput().appendField('Object Transform')
      this.appendValueInput('TARGET')
        .setCheck('obj3D')
        .appendField('Target Object:')

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
      this.setInputsInline(false)
      this.setOutput(true, 'obj3D')
    },
  }
  
  javascriptGenerator.forBlock['object_transform'] = function (
    block,
    generator
  ) {
    const tgt   = generator.valueToCode(block, 'TARGET', Order.FUNCTION_CALL) || 'null'
    const rot =
      generator.valueToCode(block, 'rot', Order.FUNCTION_CALL) || 'null'
    const trans =
      generator.valueToCode(block, 'trans', Order.FUNCTION_CALL) || 'null'
    const scale =
      generator.valueToCode(block, 'scale', Order.FUNCTION_CALL) || 'null'

    const code = `(function(){
      const obj = ${tgt};
      if (!obj || !obj.isObject3D) return obj;

      const R = ${rot};
      if (R && R.isMatrix4) {
        const q = new THREE.Quaternion().setFromRotationMatrix(R);
        obj.quaternion.premultiply(q);
      }

      const T = ${trans};
      if (T && T.isMatrix4) {
        const p = new THREE.Vector3().setFromMatrixPosition(T);
        obj.position.add(p);
      }

      const S = ${scale};
      if (S && S.isMatrix4) {
        const e = S.elements;
        const sx = (isFinite(e[0])  && e[0]  !== 0) ? e[0]  : 1;
        const sy = (isFinite(e[5])  && e[5]  !== 0) ? e[5]  : 1;
        const sz = (isFinite(e[10]) && e[10] !== 0) ? e[10] : 1;
        obj.scale.multiply(new THREE.Vector3(sx, sy, sz));
      }

      obj.updateMatrixWorld(true);
      return obj;
    })()`
    return [code, Order.FUNCTION_CALL]
  }
}