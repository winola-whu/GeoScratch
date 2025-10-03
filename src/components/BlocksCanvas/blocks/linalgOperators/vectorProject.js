import * as Blockly from 'blockly/core'
import { javascriptGenerator, Order } from 'blockly/javascript'

let REGISTERED = false

export function initVectorProjectBlock() {
  if (REGISTERED) return
  REGISTERED = true

  Blockly.Blocks['vector_project'] = {
    init() {
      this.appendDummyInput().appendField('Vector Project')
      this.appendValueInput('U').setCheck('vector3').appendField('u:')
      this.appendValueInput('V').setCheck('vector3').appendField('onto ').appendField('v:')
      this.setInputsInline(true)

      this.setOutput(true, 'obj3D')
      this.setStyle('math_blocks')
      this.setTooltip('Compute projection of U onto V')
      this.setDeletable(true)
      this.setMovable(true)
      this.setColour(155)
    },
  }

  javascriptGenerator.forBlock['vector_project'] = function (block, g) {
    const u = g.valueToCode(block, 'U', Order.FUNCTION_CALL) || 'null';
    const v = g.valueToCode(block, 'V', Order.FUNCTION_CALL) || 'null';

    const code = `(function(){
    const uVal = ${u};
    const vVal = ${v};
    if (!uVal || !vVal || !uVal.isVector3 || !vVal.isVector3) return null;

    const headLenRatio = 0.25, headWidthRatio = 0.10;
    const safeLen = (x) => (isFinite(x) && x > 0 ? x : 1);
    const fmt = (vec) => '[' + [vec.x, vec.y, vec.z].map(n => Number(n.toFixed(3))).join(', ') + ']';

    // Inputs
    const lenU = uVal.length();
    const lenV = vVal.length();

    const arrowU = new THREE.ArrowHelper(
      (lenU>0?uVal.clone().normalize():new THREE.Vector3(1,0,0)),
      new THREE.Vector3(0,0,0), safeLen(lenU), 0x1d4ed8, headLenRatio, headWidthRatio
    );

    const arrowV = new THREE.ArrowHelper(
      (lenV>0?vVal.clone().normalize():new THREE.Vector3(1,0,0)),
      new THREE.Vector3(0,0,0), safeLen(lenV), 0xdc2626, headLenRatio, headWidthRatio
    );

    // Projection u onto v
    let projObj, projVec=new THREE.Vector3(), projLen=0;
    const denom = vVal.lengthSq();
    if (denom>1e-12) {
      const scale = uVal.dot(vVal) / denom;
      projVec = vVal.clone().multiplyScalar(scale);
      projLen = projVec.length();
      if (projLen>1e-8) {
        projObj = new THREE.ArrowHelper(
          projVec.clone().normalize(), new THREE.Vector3(0,0,0),
          safeLen(projLen), 0x7c3aed, headLenRatio, headWidthRatio
        );
      } else {
        projVec.set(0,0,0);
        projObj = new THREE.Mesh(
          new THREE.SphereGeometry(0.08, 8, 8),
          new THREE.MeshStandardMaterial({ color: 0xffff00, roughness: 0.4, metalness: 0.1 })
        );
      }
    } else {
      projVec.set(0,0,0);
      projObj = new THREE.Mesh(
        new THREE.SphereGeometry(0.08, 8, 8),
        new THREE.MeshStandardMaterial({ color: 0xffff00, roughness: 0.4, metalness: 0.1 })
      );
    }

    const tag=(o,l)=>{o.userData.geoType='geo_vector';o.userData.length=safeLen(l);o.userData.headLenRatio=headLenRatio;o.userData.headWidthRatio=headWidthRatio;o.userData.srcBlockId=${JSON.stringify(block.id)};return o;};
    tag(arrowU,lenU); tag(arrowV,lenV); tag(projObj,projLen);

    // Guide: tip(u) -> tip(proj)
    const uTip = uVal.clone();
    const pTip = projVec.clone();
    const guideGeom = new THREE.BufferGeometry().setFromPoints([uTip, pTip]);
    const guideMat  = new THREE.LineBasicMaterial({ color: 0xffff00, transparent:true, opacity:1 });
    const guideLine = new THREE.Line(guideGeom, guideMat);
    guideLine.userData.geoType='geo_helper';
    guideLine.userData.srcBlockId=${JSON.stringify(block.id)};

    const group = new THREE.Group();
    group.add(arrowU, arrowV, projObj, guideLine);
    group.userData.geoType='geo_vector_group';
    group.userData.srcBlockId=${JSON.stringify(block.id)};

    // Labels at tips
    group.userData.labelAnchors = {
      uTip:{type:'world', position:[uVal.x,     uVal.y,     uVal.z    ]},
      vTip:{type:'world', position:[vVal.x,     vVal.y,     vVal.z    ]},
      pTip:{type:'world', position:[projVec.x,  projVec.y,  projVec.z ]},
    };
    group.userData.labels = [
      { anchor:'uTip', text:'u = ' + fmt(uVal),      distanceFactor:8, offset:[0.12,0.12,0] },
      { anchor:'vTip', text:'v = ' + fmt(vVal),      distanceFactor:8, offset:[0.12,0.12,0] },
      { anchor:'pTip', text:'result = ' + fmt(projVec), distanceFactor:8, offset:[0.12,0.12,0] },
    ];

    if (typeof threeObjStore==='object' && threeObjStore){
      const base=${JSON.stringify(block.id)};
      threeObjStore[base + '_u']     = arrowU;
      threeObjStore[base + '_v']     = arrowV;
      threeObjStore[base + '_proj']  = projObj;
      threeObjStore[base + '_guide'] = guideLine;
      threeObjStore[base]            = group;
    }
    return group;
  })()`;

    return [code, Order.FUNCTION_CALL];
  };
}