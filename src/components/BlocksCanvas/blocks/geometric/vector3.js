import * as Blockly from 'blockly/core'
import { javascriptGenerator, Order } from 'blockly/javascript'

let REGISTERED = false

export function initVector3Block() {
  if (REGISTERED) return
  REGISTERED = true

  // 
  Blockly.Blocks['geo_vector'] = {
    init() {
      this.appendDummyInput().appendField('Vector')
      this.appendValueInput('pos').appendField('Position:').setCheck('vector3')
      this.appendValueInput('dir').appendField('Direction:').setCheck('vector3')
      this.appendValueInput('scale').appendField('Scale:').setCheck('scalar')
      this.setStyle('math_blocks')
      this.setTooltip('Vector with position pos and direction dir.')
      this.setDeletable(true)
      this.setMovable(true)
      this.setOutput(true, 'obj3D')
    },
  }

  // 
  javascriptGenerator.forBlock['geo_vector'] = function (block, generator) {
    const vecPos =
      generator.valueToCode(block, 'pos', Order.FUNCTION_CALL) ||
      'new THREE.Vector3()'
    const vecDir =
      generator.valueToCode(block, 'dir', Order.FUNCTION_CALL) ||
      'new THREE.Vector3(1,0,0)'
    const vecScale =
      generator.valueToCode(block, 'scale', Order.FUNCTION_CALL) || '1'
    const code = `(function(){
    const origin = (${vecPos}).clone();
    let dir = (${vecDir}).clone();
    let len = Number(${vecScale});
    if (!isFinite(len) || len <= 0) len = 1;      // default length

    if (!isFinite(dir.length()) || dir.length() === 0) {
      dir = new THREE.Vector3(1,0,0);            // default direction
    }
    const norm = dir.clone().normalize();

    // head sizes proportional to length
    const headLenRatio   = 0.25;
    const headWidthRatio = 0.10;
    const arrow = new THREE.ArrowHelper(
      norm, origin, len, 0x7c3aed,
      headLenRatio * len, headWidthRatio * len
    );
    arrow.userData.geoType         = 'geo_vector';
    arrow.userData.length          = len;
    arrow.userData.headLenRatio    = headLenRatio;
    arrow.userData.headWidthRatio  = headWidthRatio;
    arrow.userData.srcBlockId = ${JSON.stringify(block.id)}
    threeObjStore[${JSON.stringify(block.id)}] = arrow 
    return arrow;
  })()`
    return [code, Order.ATOMIC]
  }
}
