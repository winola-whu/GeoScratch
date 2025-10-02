
import * as Blockly from 'blockly/core'
import { javascriptGenerator, Order } from 'blockly/javascript'

let REGISTERED = false


export function initGeoSphereBlock() {
  if (REGISTERED) return
  REGISTERED = true

  //Describes a plane in 3D space using the plane's equation in Hessian form
  Blockly.Blocks['geo_sphere'] = {
    init() {
      this.appendDummyInput().appendField('Sphere')
      this.setStyle('math_blocks')
      this.setTooltip('Geometric Sphere Object')
      this.setDeletable(true)
      this.setMovable(true)
      this.setOutput(true, 'obj3D')
      this.appendDummyInput()
        .appendField('Radius:')
        .appendField(new Blockly.FieldNumber(1, 0.01, Infinity, 0.1), 'R')
      this.appendValueInput('pos').appendField('Centre:').setCheck('vector3')
      this.setColour(205)
    },
  }

  javascriptGenerator.forBlock['geo_sphere'] = function (block, generator) {
    const pos =
      generator.valueToCode(block, 'pos', Order.FUNCTION_CALL) ||
      'new THREE.Vector3()'
    const r = Number(block.getFieldValue('R')) || 1

    const code = `(function(){
  const centre = (${pos}).clone();
  const radius = Math.max(0.01, ${r});
  const geom = new THREE.SphereGeometry(radius, 32, 16);
  const mat  = new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.5, metalness: 0.1, opacity:0.8, transparent:true });
  const mesh = new THREE.Mesh(geom, mat);
  mesh.position.copy(centre);

  mesh.userData.geoType = 'geo_sphere';
  mesh.userData.radius  = radius;
  mesh.userData.srcBlockId = ${JSON.stringify(block.id)}
  threeObjStore[${JSON.stringify(block.id)}] = mesh   
  return mesh;
})()`

    return [code, Order.ATOMIC]
  }
}
