import * as Blockly from 'blockly/core'
import { javascriptGenerator, Order } from 'blockly/javascript'

let REGISTERED = false

export function initCrossProductBlock() {
  if (REGISTERED) return
  REGISTERED = true

  Blockly.Blocks['vector_cross_product'] = {
    init() {
      this.appendDummyInput().appendField('Cross Product')
      this.appendValueInput('U').setCheck('vector3').appendField('u:')
      this.appendValueInput('V').setCheck('vector3').appendField('x').appendField('v:')
      this.setInputsInline(true)

      this.setOutput(true, 'obj3D')
      this.setStyle('math_blocks')
      this.setTooltip('Compute u × v and return a new geo_vector (registered to render).')
      this.setDeletable(true)
      this.setMovable(true)
    },
  }

  javascriptGenerator.forBlock['vector_cross_product'] = function (block, g) {
    const u = g.valueToCode(block, 'U', Order.FUNCTION_CALL) || 'null';
    const v = g.valueToCode(block, 'V', Order.FUNCTION_CALL) || 'null';

    const code = `(function(){
    const uVal = ${u};
    const vVal = ${v};

    if (!uVal || !vVal || !uVal.isVector3 || !vVal.isVector3) return null;

    const cross = new THREE.Vector3().crossVectors(uVal, vVal);
    const lenU = uVal.length(), lenV = vVal.length(), lenC = cross.length();
    const safeLen = (x) => (isFinite(x) && x > 0 ? x : 1);
    const headLenRatio = 0.25, headWidthRatio = 0.10;

    const arrowU = new THREE.ArrowHelper(
      uVal.clone().normalize(), new THREE.Vector3(0,0,0),
      safeLen(lenU), 0x1d4ed8, headLenRatio, headWidthRatio
    );
    const arrowV = new THREE.ArrowHelper(
      vVal.clone().normalize(), new THREE.Vector3(0,0,0),
      safeLen(lenV), 0xdc2626, headLenRatio, headWidthRatio
    );

    // Cross product: arrow if nonzero, sphere/point if zero
    let crossObj;
    if (lenC > 1e-8) {
      crossObj = new THREE.ArrowHelper(
        cross.clone().normalize(), new THREE.Vector3(0,0,0),
        safeLen(lenC), 0x22c55e,
        headLenRatio, headWidthRatio
      );
    } else {
      crossObj = new THREE.Mesh(
        new THREE.SphereGeometry(0.08, 8, 8),
        new THREE.MeshStandardMaterial({ color: 0xffff00, roughness: 0.4, metalness: 0.1 })
      );
    }

    const tag = (obj, len) => {
      obj.userData.geoType        = 'geo_vector';
      obj.userData.length         = safeLen(len);
      obj.userData.headLenRatio   = headLenRatio;
      obj.userData.headWidthRatio = headWidthRatio;
      obj.userData.srcBlockId     = ${JSON.stringify(block.id)};
      return obj;
    };
    tag(arrowU, lenU);
    tag(arrowV, lenV);
    tag(crossObj, lenC);

    // Group so the block output is one Object3D
    const group = new THREE.Group();
    group.add(arrowU, arrowV, crossObj);
    group.userData.geoType    = 'geo_vector_group';
    group.userData.srcBlockId = ${JSON.stringify(block.id)};

    // Register separately and group
    if (typeof threeObjStore === 'object' && threeObjStore) {
      const base = ${JSON.stringify(block.id)};
      threeObjStore[base + '_u'] = arrowU;
      threeObjStore[base + '_v'] = arrowV;
      threeObjStore[base + '_c'] = crossObj;
      threeObjStore[base]        = group;
    }

    return group;
  })()`;

    return [code, Order.FUNCTION_CALL];
  };
}
