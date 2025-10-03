import * as Blockly from 'blockly/core'
import { javascriptGenerator, Order } from 'blockly/javascript'

let REGISTERED = false

export function initNormInplaceBlock() {
  if (REGISTERED) return
  REGISTERED = true

  Blockly.Blocks['vector_normalise'] = {
    init() {
      this.appendDummyInput().appendField('Normalize')
      this.appendValueInput('V').setCheck('vector3').appendField('w:')
      this.setInputsInline(true)
      this.setOutput(true, 'obj3D')
      this.setStyle('math_blocks')
      this.setTooltip('Render v and its normalized version as a single group.')
      this.setDeletable(true)
      this.setMovable(true)
      this.setColour(155)
    },
  }

  javascriptGenerator.forBlock['vector_normalise'] = function (block, g) {
    const v = g.valueToCode(block, 'V', Order.FUNCTION_CALL) || 'null';

    const code = `(function(){
    const vVal = ${v};
    if (!vVal || !vVal.isVector3) return null;

    const headLenRatio = 0.25, headWidthRatio = 0.10;
    const safeLen = (x) => (isFinite(x) && x > 0 ? x : 1);
    const lenV = vVal.length();
    const fmt = (vec) => '[' + [vec.x, vec.y, vec.z].map(n => Number(n.toFixed(3))).join(', ') + ']';

    // Original arrow
    const arrowIn = new THREE.ArrowHelper(
      (lenV>0?vVal.clone().normalize():new THREE.Vector3(1,0,0)),
      new THREE.Vector3(0,0,0), safeLen(lenV), 0x1d4ed8, headLenRatio, headWidthRatio
    );

    // Normalized object
    let normObj, normVec=new THREE.Vector3();
    if (lenV>1e-8) {
      normVec.copy(vVal).normalize(); // unit vector components
      normObj = new THREE.ArrowHelper(
        normVec.clone(), new THREE.Vector3(0,0,0), 1, 0x22c55e, headLenRatio, headWidthRatio
      );
    } else {
      normVec.set(0,0,0);
      normObj = new THREE.Mesh(
        new THREE.SphereGeometry(0.08, 8, 8),
        new THREE.MeshStandardMaterial({ color: 0xffff00, roughness: 0.4, metalness: 0.1 })
      );
    }

    const tag=(o,l)=>{o.userData.geoType='geo_vector';o.userData.length=safeLen(l);o.userData.headLenRatio=headLenRatio;o.userData.headWidthRatio=headWidthRatio;o.userData.srcBlockId=${JSON.stringify(block.id)};return o;};
    tag(arrowIn,lenV); tag(normObj,1);

    const group=new THREE.Group();
    group.add(arrowIn,normObj);
    group.userData.geoType='geo_vector_group';
    group.userData.srcBlockId=${JSON.stringify(block.id)};

    // Labels
    group.userData.labelAnchors = {
      vTip:   { type:'world', position:[vVal.x,    vVal.y,    vVal.z   ] },
      normTip:{ type:'world', position:[normVec.x, normVec.y, normVec.z] },
    };
    group.userData.labels = [
      { anchor:'vTip',    text:'w = ' + fmt(vVal),   distanceFactor:8, offset:[0.12,0.12,0] },
      { anchor:'normTip', text:'result = ' + fmt(normVec), distanceFactor:8, offset:[0.12,0.12,0] },
    ];

    if (typeof threeObjStore==='object' && threeObjStore){
      const base=${JSON.stringify(block.id)};
      threeObjStore[base + '_in']   = arrowIn;
      threeObjStore[base + '_norm'] = normObj;
      threeObjStore[base]           = group;
    }
    return group;
  })()`;

    return [code, Order.FUNCTION_CALL];
  };

}
