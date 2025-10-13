import * as Blockly from 'blockly/core'
import { javascriptGenerator, Order } from 'blockly/javascript'

let REGISTERED = false

/**
 * Register linalg_vec3 (3-dimensional vector) building blocks + code generator
 * Output type: 'vector3'
 * Field: X/Y/Z (number)
 */
export function initRotMatrixBlock() {
  if (REGISTERED) return
  REGISTERED = true

  Blockly.Blocks['rot_matrix'] = {
    init() {
      this.appendDummyInput().appendField('Rotation (degrees)')
      this.appendDummyInput().appendField('Around Axis:')
      this.appendDummyInput()
        .appendField('x')
        .appendField(new Blockly.FieldNumber(0, -360, 360, 1), 'RX')
        .appendField('y')
        .appendField(new Blockly.FieldNumber(0, -360, 360, 1), 'RY')
        .appendField('z')
        .appendField(new Blockly.FieldNumber(0, -360, 360, 1), 'RZ')
      this.setStyle('math_blocks')
      this.setTooltip('Homogeneous rotation about X, then Y, then Z (degrees).')
      this.setOutput(true, 'rotMat')
      this.setColour(85)
    },
  }

  javascriptGenerator.forBlock['rot_matrix'] = function (block) {
    const rx = Number(block.getFieldValue('RX')) || 0
    const ry = Number(block.getFieldValue('RY')) || 0
    const rz = Number(block.getFieldValue('RZ')) || 0

    const code = `(function(){
      const Rx = new THREE.Matrix4().makeRotationX(THREE.MathUtils.degToRad(${rx}));
      const Ry = new THREE.Matrix4().makeRotationY(THREE.MathUtils.degToRad(${ry}));
      const Rz = new THREE.Matrix4().makeRotationZ(THREE.MathUtils.degToRad(${rz}));
      // Apply X, then Y, then Z: R = Rz * Ry * Rx
      const R = new THREE.Matrix4().multiplyMatrices(
        new THREE.Matrix4().multiplyMatrices(Rz, Ry),
        Rx
      );
      return R;
    })()`
    return [code, Order.ATOMIC]
  }
}
