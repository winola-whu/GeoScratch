
import * as Blockly from 'blockly/core'
import { javascriptGenerator, Order } from 'blockly/javascript'

let REGISTERED = false

const initParametricPlaneBlock = () => {
    if (REGISTERED) return
    REGISTERED = true

  // Describes a plane in 3D space using the plane's equation in Hessian form
    Blockly.Blocks['parametric_plane'] = {
      init() {
          this.appendDummyInput().appendField('Plane (Parametric)')
      this.appendValueInput('norm').appendField('norm:').setCheck('vector3')
      this.appendValueInput('dist').appendField('dist:').setCheck('scalar')
          this.setStyle('math_blocks')
          this.setTooltip('Plane with normal n, at distance d from the origin.')
          this.setDeletable(true)
          this.setMovable(true)
          this.setOutput(true, 'obj3D')
          this.setColour(205)
      }
  }

  javascriptGenerator.forBlock['parametric_plane'] = function (
    block,
    generator
  ) {
    const norm =
      generator.valueToCode(block, 'norm', Order.FUNCTION_CALL) ||
      'new THREE.Vector3(0,1,0)'
    const dist =
      generator.valueToCode(block, 'dist', Order.FUNCTION_CALL) || '0'

    const code = `(function(){
    const normal = (${norm}).clone().normalize();
    const distance = Number(${dist});
    
    // Generate geometry
    const geom = new THREE.PlaneGeometry(5, 5);
    const mat = new THREE.MeshStandardMaterial({
      color: 0x00ff00,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.5
    });
    const mesh = new THREE.Mesh(geom, mat);

    // Align according to normal
    const plane = new THREE.Plane(normal, distance);
    const coplanarPoint = plane.coplanarPoint(new THREE.Vector3());
    mesh.position.copy(coplanarPoint);

    // Set orientation
    const quat = new THREE.Quaternion();
    quat.setFromUnitVectors(new THREE.Vector3(0,0,1), plane.normal);
    mesh.setRotationFromQuaternion(quat);

    mesh.userData.geoType = 'parametric_plane';
    mesh.userData.srcBlockId = ${JSON.stringify(block.id)};
    threeObjStore[${JSON.stringify(block.id)}] = mesh;

    return mesh;
  })()`

    return [code, Order.ATOMIC]
  }
}

export default initParametricPlaneBlock