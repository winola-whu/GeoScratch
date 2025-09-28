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
    },
  }

  javascriptGenerator.forBlock['vector_project'] = function (block, g) {
    const u = g.valueToCode(block, 'U', Order.FUNCTION_CALL) || 'null'
    const v = g.valueToCode(block, 'V', Order.FUNCTION_CALL) || 'null'

    const code = `(function(){
    const uVal = ${u};
    const vVal = ${v};
    if (!uVal || !vVal || !uVal.isVector3 || !vVal.isVector3) return null;

    const headLenRatio = 0.25, headWidthRatio = 0.10;
    const safeLen = (x) => (isFinite(x) && x > 0 ? x : 1);

    // Input arrows (origin)
    const lenU = uVal.length();
    const lenV = vVal.length();

    const arrowU = new THREE.ArrowHelper(
      (lenU > 0 ? uVal.clone().normalize() : new THREE.Vector3(1,0,0)),
      new THREE.Vector3(0,0,0),
      safeLen(lenU),
      0x1d4ed8,
      headLenRatio,
      headWidthRatio
    );

    const arrowV = new THREE.ArrowHelper(
      (lenV > 0 ? vVal.clone().normalize() : new THREE.Vector3(1,0,0)),
      new THREE.Vector3(0,0,0),
      safeLen(lenV),
      0xdc2626,
      headLenRatio,
      headWidthRatio
    );

    // Projection of u onto v: proj = (u·v / ||v||^2) * v
    let projObj, projVec = new THREE.Vector3(), projLen = 0;
    const denom = vVal.lengthSq();

    if (denom > 1e-12) {
      const scale = uVal.dot(vVal) / denom;
      projVec = vVal.clone().multiplyScalar(scale); // tip position of projection
      projLen = projVec.length();

      if (projLen > 1e-8) {
        projObj = new THREE.ArrowHelper(
          projVec.clone().normalize(),
          new THREE.Vector3(0,0,0),
          safeLen(projLen),
          0x7c3aed,
          headLenRatio,
          headWidthRatio
        );
      } else {
        // projection ~ zero → point at origin
        projVec.set(0,0,0);
        projObj = new THREE.Mesh(
          new THREE.SphereGeometry(0.08, 8, 8),
          new THREE.MeshStandardMaterial({ color: 0xffff00, roughness: 0.4, metalness: 0.1 })
        );
      }
    } else {
      // v is zero → undefined projection → point at origin
      projVec.set(0,0,0);
      projObj = new THREE.Mesh(
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
    tag(projObj, projLen);

    // ---- Guide line: tip(u) → tip(projection) ----
    const uTip = uVal.clone();            // since origin + dir*len == original vector
    const pTip = projVec.clone();         // computed above (origin if zero/undefined)
    const guideGeom = new THREE.BufferGeometry().setFromPoints([uTip, pTip]);
    const guideMat  = new THREE.LineBasicMaterial({ color: 0xffff00, transparent: true, opacity: 1 });
    const guideLine = new THREE.Line(guideGeom, guideMat);
    guideLine.userData.geoType    = 'geo_helper';
    guideLine.userData.srcBlockId = ${JSON.stringify(block.id)};

    // Group return
    const group = new THREE.Group();
    group.add(arrowU, arrowV, projObj, guideLine);
    group.userData.geoType    = 'geo_vector_group';
    group.userData.srcBlockId = ${JSON.stringify(block.id)};

    // Register: separately + group
    if (typeof threeObjStore === 'object' && threeObjStore) {
      const base = ${JSON.stringify(block.id)};
      threeObjStore[base + '_u']     = arrowU;
      threeObjStore[base + '_v']     = arrowV;
      threeObjStore[base + '_proj']  = projObj;
      threeObjStore[base + '_guide'] = guideLine;
      threeObjStore[base]            = group;
    }

    return group;
  })()`

    return [code, Order.FUNCTION_CALL]
  }
}