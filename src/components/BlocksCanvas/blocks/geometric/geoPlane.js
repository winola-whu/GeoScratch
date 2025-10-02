import * as Blockly from 'blockly/core'
import { javascriptGenerator, Order } from 'blockly/javascript'

let REGISTERED = false

const initGeoPlaneBlock = () => {
  if (REGISTERED) return
  REGISTERED = true

  Blockly.Blocks['geo_plane'] = {
    init() {
      this.appendDummyInput().appendField('Plane (Geometric)')
      this.appendValueInput('pos').appendField('pos:').setCheck('vector3')
      this.appendValueInput('side').appendField('side length:').setCheck('scalar')
      this.setStyle('math_blocks')
      this.setTooltip('Plane at position p, with side length s.')
      this.setDeletable(true)
      this.setMovable(true)
      this.setOutput(true, 'obj3D')
      this.setColour(205)
    }
  }

  javascriptGenerator.forBlock['geo_plane'] = function (block, generator) {
    const pos = generator.valueToCode(block, 'pos', Order.FUNCTION_CALL) || 'new THREE.Vector3()'
    const side = generator.valueToCode(block, 'side', Order.FUNCTION_CALL) || '1'

    const code = `(function(){
      const position = (${pos}).clone();
      const sideLength = Math.max(0.1, Number(${side}));
      const geom = new THREE.PlaneGeometry(sideLength, sideLength);
      const mat = new THREE.MeshStandardMaterial({
        color: 0xffff00, 
        roughness: 0.4, 
        metalness: 0.1,
        side: THREE.DoubleSide
      });
      const mesh = new THREE.Mesh(geom, mat);
      mesh.position.copy(position);
      
      mesh.userData.geoType = 'geo_plane';
      mesh.userData.sideLength = sideLength;
      mesh.userData.srcBlockId = ${JSON.stringify(block.id)};
      threeObjStore[${JSON.stringify(block.id)}] = mesh;
      
      return mesh;
    })()`

    return [code, Order.ATOMIC]
  }
}

export default initGeoPlaneBlock