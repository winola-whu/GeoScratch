import * as Blockly from 'blockly/core'
import { javascriptGenerator, Order } from 'blockly/javascript'

let REGISTERED = false

const initPointBlock = () => {
  if (REGISTERED) return
  REGISTERED = true

  // Block Definition
  Blockly.Blocks['geo_point'] = {
    init() {
      this.appendDummyInput().appendField('Point')
      this.appendValueInput('pos').appendField('pos:').setCheck('vector3')
      this.setStyle('math_blocks')
      this.setTooltip('Point with position p.')
      this.setOutput(true, 'obj3D')
    },
  }

  // Block Code Generation
  javascriptGenerator.forBlock['geo_point'] = function (block, generator) {
    const pos =
      generator.valueToCode(block, 'pos', Order.FUNCTION_CALL) ||
      'new THREE.Vector3()'
    const code = `(function(){
      const m = new THREE.Mesh(
        new THREE.SphereGeometry(0.08, 8, 8),
        new THREE.MeshStandardMaterial({ color: 0xffff00, roughness: 0.4, metalness: 0.1 })
      );
      m.position.copy(${pos});
      m.userData.geoType = 'geo_point';
      return m;
    })()`
    return [code, Order.ATOMIC]
  }
}

export default initPointBlock