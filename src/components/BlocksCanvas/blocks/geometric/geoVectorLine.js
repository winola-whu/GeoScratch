import * as Blockly from 'blockly/core'
import { javascriptGenerator, Order } from 'blockly/javascript'

let REGISTERED = false

export function initVector3Block() {
  if (REGISTERED) return
  REGISTERED = true

  // 
  Blockly.Blocks['geo_vector'] = {
    init() {
      this.appendDummyInput().appendField('Vector Equation of Line')
      this.appendValueInput('pos').appendField('Position:').setCheck('vector3')
      this.appendValueInput('dir').appendField('Direction:').setCheck('vector3')
      this.appendValueInput('scale').appendField('t:').setCheck('scalar')
      this.setStyle('math_blocks')
      this.setTooltip('A line in R3 that passes through a specific point and runs parallel to the direction vector')
      this.setDeletable(true)
      this.setMovable(true)
      this.setOutput(true, 'obj3D')
      this.setColour(205)
    },
  }

  //
  javascriptGenerator.forBlock['geo_vector'] = function (block, generator) {
    // Inputs
    const vecPos =
      generator.valueToCode(block, 'pos', Order.FUNCTION_CALL) ||
      'new THREE.Vector3()';
    const vecDir =
      generator.valueToCode(block, 'dir', Order.FUNCTION_CALL) ||
      'new THREE.Vector3(1,0,0)';

    // Detect if "scale" (t) input is connected; only render t-point when connected
    const scaleInput = block.getInput('scale');
    const hasScaleInput =
      !!(scaleInput && scaleInput.connection && scaleInput.connection.targetConnection);

    // Only emit code when connected; otherwise becomes undefined
    const vecScaleCode = hasScaleInput
      ? (generator.valueToCode(block, 'scale', Order.FUNCTION_CALL) || '0')
      : 'undefined';

    const code = `(function(){
    const origin = (${vecPos}).clone();
    let v = (${vecDir}).clone();

    // Fallback if direction invalid/zero
    if (!isFinite(v.length()) || v.length() === 0) {
      v = new THREE.Vector3(1,0,0);
    }

    // Build the "infinite" line using normalized direction for stable rendering
    const n = v.clone().normalize();

    // Allow a global or scene-level extent override; default to 1000
    let LINE_EXTENT = 1000;
    if (typeof SCENE_EXTENT !== 'undefined' && isFinite(SCENE_EXTENT)) {
      LINE_EXTENT = Math.abs(SCENE_EXTENT);
    } else if (typeof scene !== 'undefined' && scene && scene.userData && isFinite(scene.userData.extent)) {
      LINE_EXTENT = Math.abs(scene.userData.extent);
    }

    const p1 = origin.clone().addScaledVector(n, -LINE_EXTENT);
    const p2 = origin.clone().addScaledVector(n,  LINE_EXTENT);

    const lineGeom = new THREE.BufferGeometry().setFromPoints([p1, p2]);
    const lineMat  = new THREE.LineBasicMaterial({ linewidth: 1 });
    const line     = new THREE.Line(lineGeom, lineMat);

    // Small sphere geometry reused for markers
    const r = 0.08;
    const sphereGeom = new THREE.SphereGeometry(r, 16, 12);

    // Position marker (always): cyan
    const posMat = new THREE.MeshStandardMaterial({ color: 0x22d3ee, roughness: 0.4, metalness: 0.1 });
    const posSphere = new THREE.Mesh(sphereGeom, posMat);
    posSphere.position.copy(origin);

    const group = new THREE.Group();
    group.add(line, posSphere);

    // t marker (only if "scale" socket is connected): r = r0 + t * v (use RAW v, not normalized)
    const tRaw = (${vecScaleCode});
    if (typeof tRaw !== 'undefined' && isFinite(Number(tRaw))) {
      const tVal = Number(tRaw);
      const rPoint = origin.clone().addScaledVector(v, tVal);

      const tMat = new THREE.MeshStandardMaterial({ color: 0xffff00, roughness: 0.4, metalness: 0.1 });
      const tSphere = new THREE.Mesh(sphereGeom, tMat);
      tSphere.position.copy(rPoint);
      group.add(tSphere);

      group.userData.t = tVal;
      group.userData.rPoint = rPoint.clone();
    } else {
      group.userData.t = undefined;
      group.userData.rPoint = undefined;
    }

    // Metadata for downstream tools
    group.userData.geoType    = 'geo_vector_line';
    group.userData.origin     = origin.clone(); // r0
    group.userData.direction  = v.clone();      // raw v
    group.userData.lineExtent = LINE_EXTENT;
    group.userData.srcBlockId = ${JSON.stringify(block.id)};

    // Optional registry
    if (typeof threeObjStore === 'object' && threeObjStore) {
      threeObjStore[${JSON.stringify(block.id)}] = group;
    }

    return group;
  })()`;

    return [code, Order.ATOMIC];
  };
}
