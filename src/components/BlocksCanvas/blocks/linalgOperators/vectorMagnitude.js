import * as Blockly from 'blockly/core'
import { javascriptGenerator, Order } from 'blockly/javascript'

let REGISTERED = false

export function initVectorMagnitude() {
  if (REGISTERED) return
  REGISTERED = true

  Blockly.Blocks['vector_magnitude'] = {
    init() {
      this.appendDummyInput().appendField('Vector Magnitude')
      this.appendValueInput('V').setCheck('vector3').appendField('j:')
      this.setInputsInline(true)
      this.setOutput(true, 'obj3D')
      this.setStyle('math_blocks')
      this.setTooltip('Render j and show its vector magnitude / length')
      this.setDeletable(true)
      this.setMovable(true)
      this.setColour(155)
    },
  }

  javascriptGenerator.forBlock['vector_magnitude'] = function (block, g) {
    // Optional name field on the block; fallback to 'v'
    const name = 'j';
    const v = g.valueToCode(block, 'V', Order.FUNCTION_CALL) || 'null';

    const code = `(function () {
    const vVal = ${v};
    if (!vVal || !vVal.isVector3) return null;

    const len = vVal.length();
    const safeLen = (x) => (Number.isFinite(x) && x > 0 ? x : 1);
    const headLenRatio = 0.25, headWidthRatio = 0.10;

    // Render vector as arrow, or sphere if zero-length
    let obj;
    if (len > 1e-8) {
      obj = new THREE.ArrowHelper(
        vVal.clone().normalize(),
        new THREE.Vector3(0,0,0),
        safeLen(len),
        0x0ea5e9, // teal-ish
        headLenRatio,
        headWidthRatio
      );
    } else {
      obj = new THREE.Mesh(
        new THREE.SphereGeometry(0.08, 8, 8),
        new THREE.MeshStandardMaterial({ color: 0xffff00, roughness: 0.4, metalness: 0.1 })
      );
    }

    // Group wrapper
    const group = new THREE.Group();
    group.add(obj);

    // Metadata
    group.userData.geoType = 'geo_vector_magnitude';
    group.userData.srcBlockId = ${JSON.stringify(block.id)};
    group.userData.input = vVal.clone();
    group.userData.length = len;

    // Label: only one line -> "length of <name> = <len>"
    const tip = (len > 1e-8) ? vVal.clone() : new THREE.Vector3(0,0,0);
    const fmtLen = Number(len.toFixed(3));
    group.userData.labelAnchors = {
      tip: { type: 'world', position: [tip.x, tip.y, tip.z] },
    };
    group.userData.labels = [
      { anchor: 'tip', text: 'length of ${name} = ' + fmtLen, distanceFactor: 8, offset: [0.12, 0.12, 0] },
    ];

    if (typeof threeObjStore === 'object' && threeObjStore) {
      threeObjStore[${JSON.stringify(block.id)}] = group;
    }
    return group;
  })()`;

    return [code, Order.FUNCTION_CALL];
  };

}