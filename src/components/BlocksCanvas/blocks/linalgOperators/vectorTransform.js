import * as Blockly from 'blockly/core'
import { javascriptGenerator, Order } from 'blockly/javascript'

let REGISTERED = false

export function initVectorTransformBlock() {
  if (REGISTERED) return
  REGISTERED = true

  Blockly.Blocks['vector_transform'] = {
    init() {
      this.appendDummyInput().appendField('Vector Transform')
      this.appendValueInput('TARGET')
        .setCheck('obj3D')
        .appendField('Target Vector:')
      this.appendValueInput('rot').appendField('Rotate:').setCheck('rotMat')
      this.appendValueInput('trans')
        .appendField('Translate:')
        .setCheck('transMat')
      this.appendValueInput('scale').appendField('Scaling:').setCheck('scalar')
      this.setStyle('math_blocks')
      this.setTooltip('Translate / rotate vector in R3')
      this.setDeletable(true)
      this.setMovable(true)
      this.setInputsInline(false)
      this.setOutput(true, 'obj3D')
    },
  }

  javascriptGenerator.forBlock['vector_transform'] = function (
    block,
    generator
  ) {
    const tgt = generator.valueToCode(block, 'TARGET', Order.FUNCTION_CALL) || 'null'
    const rot =
      generator.valueToCode(block, 'rot', Order.FUNCTION_CALL) || 'null'
    const trans =
      generator.valueToCode(block, 'trans', Order.FUNCTION_CALL) || 'null'
    const scale =
      generator.valueToCode(block, 'scale', Order.FUNCTION_CALL) || 'null'

    const code = `(function(){
      const obj = ${tgt};
      if (!obj || !obj.isObject3D) return obj;

      // Allow obj to be the ArrowHelper itself or a group containing it
      const arrow = obj.isArrowHelper ? obj
                   : (obj.children || []).find(c => c.isArrowHelper);

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

      const s = ${scale};
      if (typeof s === 'number' && isFinite(s)) {
        if (arrow && arrow.isArrowHelper) {
          const currLen = arrow.userData.length ?? arrow.length ?? 1;
          const newLen = Math.max(0, currLen * s);
          arrow.userData.length = newLen;
          const hlr = arrow.userData.headLenRatio ?? 0.25;
          const hwr = arrow.userData.headWidthRatio ?? 0.10;
          arrow.setLength(newLen, hlr * newLen, hwr * newLen);
        } else {
          obj.scale.multiplyScalar(s);
        }
      }

      obj.updateMatrixWorld(true);
      return obj;
    })()`
    return [code, Order.FUNCTION_CALL]
  }
}
