import * as Blockly from 'blockly/core'
import { javascriptGenerator, Order } from 'blockly/javascript'

let REGISTERED = false

export function initNormInplaceBlock() {
  if (REGISTERED) return
  REGISTERED = true

  Blockly.Blocks['vector_normalise'] = {
    init() {
      this.appendDummyInput().appendField('Normalize')
      this.appendValueInput('V').setCheck('vector3').appendField('v:')
      this.setInputsInline(true)
      this.setOutput(true, 'obj3D')
      this.setStyle('math_blocks')
      this.setTooltip('Render v and its normalized version as a single group.')
      this.setDeletable(true)
      this.setMovable(true)
    },
  }

  javascriptGenerator.forBlock['vector_normalise'] = function (block, g) {
    const v = g.valueToCode(block, 'V', Order.FUNCTION_CALL) || 'null'

    const code = `(function(){
      const vVal = ${v};
      if (!vVal || !vVal.isVector3) return null;

      const headLenRatio = 0.25, headWidthRatio = 0.10;
      const safeLen = (x) => (isFinite(x) && x > 0 ? x : 1);
      const lenV = vVal.length();

      // Original arrow (blue)
      const arrowIn = new THREE.ArrowHelper(
        (lenV > 0 ? vVal.clone().normalize() : new THREE.Vector3(1,0,0)),
        new THREE.Vector3(0,0,0),
        safeLen(lenV),
        0x1d4ed8,
        headLenRatio,
        headWidthRatio
      );

      // Normalized: arrow if non-zero, yellow sphere if zero
      let normObj;
      if (lenV > 1e-8) {
        normObj = new THREE.ArrowHelper(
          vVal.clone().normalize(),
          new THREE.Vector3(0,0,0),
          1, // unit length
          0x22c55e,
          headLenRatio * 1,
          headWidthRatio * 1
        );
      } else {
        normObj = new THREE.Mesh(
          new THREE.SphereGeometry(0.08, 8, 8),
          new THREE.MeshStandardMaterial({ color: 0xffff00, roughness: 0.4, metalness: 0.1 })
        );
      }

      // Tag like geo_vector
      const tag = (obj, len) => {
        obj.userData.geoType        = 'geo_vector';
        obj.userData.length         = safeLen(len);
        obj.userData.headLenRatio   = headLenRatio;
        obj.userData.headWidthRatio = headWidthRatio;
        obj.userData.srcBlockId     = ${JSON.stringify(block.id)};
        return obj;
      };
      tag(arrowIn, lenV);
      tag(normObj, 1);

      // Group so the block returns a single Object3D
      const group = new THREE.Group();
      group.add(arrowIn, normObj);
      group.userData.geoType    = 'geo_vector_group';
      group.userData.srcBlockId = ${JSON.stringify(block.id)};

      // Register: each separately + group under base id
      if (typeof threeObjStore === 'object' && threeObjStore) {
        const base = ${JSON.stringify(block.id)};
        threeObjStore[base + '_in']   = arrowIn;
        threeObjStore[base + '_norm'] = normObj;
        threeObjStore[base]           = group;
      }

      return group;
    })()`

    return [code, Order.FUNCTION_CALL]
  }
}
