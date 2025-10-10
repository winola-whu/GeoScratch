import * as Blockly from 'blockly/core'
import { javascriptGenerator, Order } from 'blockly/javascript'

let REGISTERED = false

export default function initGeoCubeBlock () {
  if (REGISTERED) return
  REGISTERED = true

  Blockly.Blocks['geo_cube'] = {
    init() {
      this.appendDummyInput().appendField('Cube')
      this.setStyle('math_blocks')
      this.setTooltip('Axis-aligned cube defined by centre and side length.')
      this.setDeletable(true)
      this.setMovable(true)
      this.setOutput(true, 'obj3D')
      this.setColour(205)

      // Side length: inline numeric field (like Sphere's Radius)
      this.appendDummyInput('SIDE_ROW')
        .appendField('Side length:')
        .appendField(new Blockly.FieldNumber(1, 0.0001, Infinity, 0.1), 'SIDE')

      // Centre: value input (vector3), on its own row
      this.appendValueInput('center').appendField('Centre:').setCheck('vector3')
    }
  }

  javascriptGenerator.forBlock['geo_cube'] = function (block, g) {
    const centerCode = g.valueToCode(block, 'center', Order.FUNCTION_CALL) || 'new THREE.Vector3(0,0,0)'
    let s = Number(block.getFieldValue('SIDE'))
    if (!isFinite(s) || s <= 0) s = 1

    const code = `(function(){
    const cIn = (${centerCode});
    const c   = (cIn && cIn.isVector3) ? cIn.clone() : new THREE.Vector3(0,0,0);
    const s   = ${s};

    const geom = new THREE.BoxGeometry(s, s, s);
    const mat  = new THREE.MeshStandardMaterial({
      color: 0x8b5cf6, roughness: 0.5, metalness: 0.1,
      transparent: true, opacity: 0.7
    });
    const mesh = new THREE.Mesh(geom, mat);
    mesh.position.copy(c);

    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(geom),
      new THREE.LineBasicMaterial({ transparent: true, opacity: 0.25 })
    );
    mesh.add(edges);

    const fmt = (v) => '[' + [v.x, v.y, v.z].map(n => Number(n.toFixed(3))).join(', ') + ']';
    const labelPoint = c.clone().add(new THREE.Vector3(s/2, s/2, s/2));

    mesh.userData.geoType    = 'geo_cube';
    mesh.userData.center     = c.clone();
    mesh.userData.side       = s;
    mesh.userData.srcBlockId = ${JSON.stringify(block.id)};
    
    if (typeof threeObjStore === 'object' && threeObjStore) {
      threeObjStore[${JSON.stringify(block.id)}] = mesh;
    }
    return mesh;
  })()`

    return [code, Order.ATOMIC]
  }

}
