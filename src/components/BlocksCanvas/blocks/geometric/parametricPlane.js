import * as Blockly from 'blockly/core'
import { javascriptGenerator, Order } from 'blockly/javascript'

let REGISTERED = false

const initParametricPlaneBlock = () => {
  if (REGISTERED) return
  REGISTERED = true

  // Plane in point–normal form: {point p ∈ R^3, unit normal n ∈ R^3}
  Blockly.Blocks['parametric_plane'] = {
    init() {
      this.appendDummyInput().appendField('Plane (Point–Normal)')
      this.appendValueInput('point').appendField('Point:').setCheck('vector3')
      this.appendValueInput('norm').appendField('Normal:').setCheck('vector3')
      this.setStyle('math_blocks')
      this.setTooltip('Plane defined by a point p and a normal n (normalized internally).')
      this.setDeletable(true)
      this.setMovable(true)
      this.setOutput(true, 'obj3D')
      this.setColour(205)
    },
  }

  javascriptGenerator.forBlock['parametric_plane'] = function (block, g) {
    const point = g.valueToCode(block, 'point', Order.FUNCTION_CALL) || 'new THREE.Vector3()';
    const norm  = g.valueToCode(block, 'norm',  Order.FUNCTION_CALL) || 'new THREE.Vector3(0,1,0)';

    // Try to infer label for the normal input (fallback to 'n')
    const getNormLabel = (() => {
      try {
        const tgt = block.getInputTargetBlock && block.getInputTargetBlock('norm');
        if (!tgt || typeof tgt.getFieldValue !== 'function') return 'n';
        const fields = ['NAME','Label','LABEL','VAR','Var','ID','TITLE','TEXT'];
        for (const f of fields) {
          const v = tgt.getFieldValue(f);
          if (v) return String(v);
        }
        return tgt.type || 'n';
      } catch { return 'n'; }
    })();

    const code = `(function(){
    const pIn = (${point});
    const nIn = (${norm});

    const p     = (pIn && pIn.isVector3) ? pIn.clone()   : new THREE.Vector3();
    let nRaw    = (nIn && nIn.isVector3) ? nIn.clone()   : new THREE.Vector3(0,1,0);
    let normLen = nRaw.length();
    if (!isFinite(normLen) || normLen === 0) { nRaw.set(0,1,0); normLen = 1; }
    const nUnit = nRaw.clone().normalize(); // for plane orientation

    // Plane (light pink)
    const geom = new THREE.PlaneGeometry(40, 40, 1, 1);
    const mat  = new THREE.MeshStandardMaterial({
      color: 0xffb6c1,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35
    });
    const plane = new THREE.Mesh(geom, mat);
    const quat  = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,0,1), nUnit);
    plane.setRotationFromQuaternion(quat);
    plane.position.copy(p);

    // Point marker (same style as before)
    const pointMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.08, 16, 12),
      new THREE.MeshStandardMaterial({ color: 0x22d3ee, roughness: 0.4, metalness: 0.1 })
    );
    pointMesh.position.copy(p);

    // Normal arrow === uses *input length*
    const headLenRatio = 0.25, headWidthRatio = 0.10;   // ratios
    const headLen   = Math.max(0.001, normLen * headLenRatio);
    const headWidth = Math.max(0.001, normLen * headWidthRatio);
    const arrow     = new THREE.ArrowHelper(nUnit.clone(), p.clone(), normLen, 0x1d4ed8, headLen, headWidth);

    // Labels — arrow shows the *raw input*; plane uses nUnit internally
    const fmt  = (vec) => '[' + [vec.x, vec.y, vec.z].map(v => Number(v.toFixed(3))).join(', ') + ']';
    const nTip = p.clone().add(nRaw); // tip at p + nRaw (matches input length)

    const group = new THREE.Group();
    group.add(plane, pointMesh, arrow);

    group.userData.geoType     = 'point_normal_plane_group';
    group.userData.srcBlockId  = ${JSON.stringify(block.id)};
    group.userData.point       = p.clone();
    group.userData.normalRaw   = nRaw.clone();  // input
    group.userData.normalUnit  = nUnit.clone(); // used for orientation
    group.userData.planeSize   = 20;

    group.userData.labelAnchors = {
      pAnchor: { type:'world', position:[p.x,    p.y,    p.z   ] },
      nTip:    { type:'world', position:[nTip.x, nTip.y, nTip.z] },
    };
    group.userData.labels = [
      { anchor:'pAnchor', text:'point = ' + fmt(p),                        distanceFactor:8, offset:[0.12,0.12,0] },
      { anchor:'nTip',    text:'normal = ' + fmt(nRaw), distanceFactor:8, offset:[0.12,0.12,0] },
    ];

    // Tag children
    plane.userData     = Object.assign(plane.userData||{},     { geoType:'plane_mesh',   srcBlockId:${JSON.stringify(block.id)} });
    pointMesh.userData = Object.assign(pointMesh.userData||{}, { geoType:'point_marker', srcBlockId:${JSON.stringify(block.id)} });
    arrow.userData     = Object.assign(arrow.userData||{},     {
      geoType:'normal_arrow',
      name:${JSON.stringify(getNormLabel)},
      headLenRatio, headWidthRatio,
      srcBlockId:${JSON.stringify(block.id)}
    });

    // Registry
    if (typeof threeObjStore==='object' && threeObjStore){
      const base=${JSON.stringify(block.id)};
      threeObjStore[base + '_plane']  = plane;
      threeObjStore[base + '_point']  = pointMesh;
      threeObjStore[base + '_normal'] = arrow;
      threeObjStore[base]             = group;
    }

    return group;
  })()`;
    return [code, Order.ATOMIC];
  };
}

export default initParametricPlaneBlock