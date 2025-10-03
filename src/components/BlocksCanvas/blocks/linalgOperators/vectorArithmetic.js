import * as Blockly from 'blockly/core'
import { javascriptGenerator, Order } from 'blockly/javascript'

let REGISTERED = false

export function initVectorArithmeticBlock() {
  if (REGISTERED) return
  REGISTERED = true

  Blockly.Blocks['vector_arithmetic'] = {
    init() {
      this.appendDummyInput().appendField('Vector Arithmetic')
      this.appendValueInput('U').setCheck('vector3')
      this.appendValueInput('V')
        .setCheck('vector3')
        .appendField(
          new Blockly.FieldDropdown([
            ['a + b', 'add'],
            ['a - b', 'subtract'],
          ]),
          'OP'
        )

      // Value block output (like cross product), not a statement block
      this.setOutput(true, 'obj3D')
      this.setInputsInline(true)
      this.setStyle('math_blocks')
      this.setTooltip('Compute u ± v and return a group with arrows for u, v, and the result (registered).')
      this.setDeletable(true)
      this.setMovable(true)
      this.setColour(155)
    },
  }

  javascriptGenerator.forBlock['vector_arithmetic'] = function (block, g) {
    const op = block.getFieldValue('OP') || 'add';
    const u = g.valueToCode(block, 'U', Order.FUNCTION_CALL) || 'null';
    const v = g.valueToCode(block, 'V', Order.FUNCTION_CALL) || 'null';

    const code = `(function(){
    const uVal = ${u};
    const vVal = ${v};

    if (!uVal || !vVal || !uVal.isVector3 || !vVal.isVector3) return null;

    const origin = new THREE.Vector3();
    const headLenRatio = 0.25, headWidthRatio = 0.10;
    const safeLen = (x) => (isFinite(x) && x > 0 ? x : 1);
    const fmt = (vec) => '[' + [vec.x, vec.y, vec.z].map(n => Number(n.toFixed(3))).join(', ') + ']';

    // Build input arrows
    const lenU = uVal.length();
    const lenV = vVal.length();

    const arrowU = new THREE.ArrowHelper(
      (lenU > 0 ? uVal.clone().normalize() : new THREE.Vector3(1,0,0)),
      origin.clone(),
      safeLen(lenU),
      0x1d4ed8, headLenRatio, headWidthRatio
    );

    const arrowV = new THREE.ArrowHelper(
      (lenV > 0 ? vVal.clone().normalize() : new THREE.Vector3(1,0,0)),
      origin.clone(),
      safeLen(lenV),
      0xdc2626, headLenRatio, headWidthRatio
    );

    // Compute result
    const res = uVal.clone()[${op === 'add' ? `'add'` : `'sub'`}](vVal);
    const lenR = res.length();

    let resObj;
    if (lenR > 1e-8) {
      resObj = new THREE.ArrowHelper(
        res.clone().normalize(), origin.clone(), safeLen(lenR),
        0x7c3aed, headLenRatio, headWidthRatio
      );
    } else {
      resObj = new THREE.Mesh(
        new THREE.SphereGeometry(0.08, 8, 8),
        new THREE.MeshStandardMaterial({ color: 0xffff00, roughness: 0.4, metalness: 0.1 })
      );
    }

    // Tag metadata on part objects
    const tag = (obj, len) => {
      obj.userData.geoType='geo_vector';
      obj.userData.length=safeLen(len);
      obj.userData.headLenRatio=headLenRatio;
      obj.userData.headWidthRatio=headWidthRatio;
      obj.userData.srcBlockId=${JSON.stringify(block.id)};
      return obj;
    };
    tag(arrowU, lenU); tag(arrowV, lenV); tag(resObj, lenR);

    // Group return
    const group = new THREE.Group();
    group.add(arrowU, arrowV, resObj);
    group.userData.geoType='geo_vector_group';
    group.userData.srcBlockId=${JSON.stringify(block.id)};

    // ---- Labels (tips) ----
    group.userData.labelAnchors = {
      uTip:   { type:'world', position:[uVal.x, uVal.y, uVal.z] },
      vTip:   { type:'world', position:[vVal.x, vVal.y, vVal.z] },
      rTip:   { type:'world', position:[res.x,  res.y,  res.z ] },
    };
    group.userData.labels = [
      { anchor:'uTip', text:'a = ' + fmt(uVal), distanceFactor:8, offset:[0.12,0.12,0] },
      { anchor:'vTip', text:'b = ' + fmt(vVal), distanceFactor:8, offset:[0.12,0.12,0] },
      { anchor:'rTip', text:'result = ' + fmt(res), distanceFactor:8, offset:[0.12,0.12,0] },
    ];

    // Register
    if (typeof threeObjStore==='object' && threeObjStore) {
      const base = ${JSON.stringify(block.id)};
      threeObjStore[base + '_u'] = arrowU;
      threeObjStore[base + '_v'] = arrowV;
      threeObjStore[base + '_r'] = resObj;
      threeObjStore[base]        = group;
    }
    return group;
  })()`;

    return [code, Order.FUNCTION_CALL];
  };

}
