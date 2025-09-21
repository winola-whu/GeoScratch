import { javascriptGenerator, Order } from 'blockly/javascript'
import * as THREE from 'three'

//TODO (8/23/2025)
    //Set up rendering for all geometric objects in variable list
    //Typing on variable declarations so we can restrict block inputs to particular types
        //Also allows us to more intelligently retrieve variables that should be "drawn" (i.e. variables that represent meshes)
    //Add blocks to allow direct modification of existing object transforms
    //Add parametric/geometric toggle to blocks that create geometry
        //These should maybe be in separate sections in the flyout menu?
    //Compile generated code before running it to give users access to compile-time feedback?

//for storing persistent THREE objects declared only in eval scope, so our scene can access them
//we cross-reference this with the variableMap each time our code runs and garbage collect objects that are no longer referenced
export const threeObjStore = {}


//Dev utility
javascriptGenerator.forBlock['debug'] = function (block, generator) {
    const debugString = `console.log(${generator.valueToCode(block, 'exp', Order.FUNCTION_CALL)});`
    return [debugString, Order.FUNCTION_CALL]
}


//Anything that outputs an obj3D type
// javascriptGenerator.forBlock['geo_point'] = function (block, generator) {
//     const pos = generator.valueToCode(block, 'pos', Order.FUNCTION_CALL) || 'new THREE.Vector3()';
//     const pointDec = `(function(){
//     const m = new THREE.Mesh(
//       new THREE.SphereGeometry(0.08, 8, 8),
//       new THREE.MeshStandardMaterial({color:0xffff00, roughness:0.4, metalness:0.1})
//     );
//     m.position.copy(${pos});
//     return m;
//   })()`;
//     return [pointDec, Order.ATOMIC];
// }

// javascriptGenerator.forBlock['geo_plane'] = function (block, generator) {
//     const planeDec = `(new THREE.Mesh(new THREE.PlaneGeometry(
//                 ${generator.valueToCode(block, 'side', Order.FUNCTION_CALL)}, ${generator.valueToCode(block, 'side', Order.FUNCTION_CALL)}), 
//                 new THREE.MeshStandardMaterial({color: 0xffff00, roughness: 0.4, metalness:0.1})))`
//             //.position.copy(${generator.valueToCode(block, 'pos', Order.FUNCTION_CALL)})`
//     return [planeDec, Order.ATOMIC]
// }

// javascriptGenerator.forBlock['parametric_plane'] = function (block, generator) {
//     const planeDec = `new THREE.Plane(${generator.valueToCode(block, 'norm', Order.FUNCTION_CALL)}, ${generator.valueToCode(block, 'dist', Order.FUNCTION_CALL)})`
//     return [planeDec, Order.ATOMIC]
// }

// javascriptGenerator.forBlock['geo_vector'] = function (block, generator) {
//     const vecPos = generator.valueToCode(block, 'pos', Order.FUNCTION_CALL) || 'new THREE.Vector3()'
//     const vecDir = generator.valueToCode(block, 'dir', Order.FUNCTION_CALL) || 'new THREE.Vector3(1,0,0)'
//     const vecScale = generator.valueToCode(block, 'scale', Order.FUNCTION_CALL) || '1'
//     const code = `(function(){
//     const origin = (${vecPos}).clone();
//     let dir = (${vecDir}).clone();
//     let len = Number(${vecScale});
//     if (!isFinite(len) || len <= 0) len = 1;      // default length

//     if (!isFinite(dir.length()) || dir.length() === 0) {
//       dir = new THREE.Vector3(1,0,0);            // default direction
//     }
//     const norm = dir.clone().normalize();

//     // head sizes proportional to length
//     const headLenRatio   = 0.25;
//     const headWidthRatio = 0.10;
//     const arrow = new THREE.ArrowHelper(
//       norm, origin, len, 0x7c3aed,
//       headLenRatio * len, headWidthRatio * len
//     );
//     arrow.userData.geoType         = 'geo_vector';
//     arrow.userData.length          = len;
//     arrow.userData.headLenRatio    = headLenRatio;
//     arrow.userData.headWidthRatio  = headWidthRatio;
//     return arrow;
//   })()`;
//     return [code, Order.ATOMIC];
// }

// javascriptGenerator.forBlock['geo_sphere'] = function (block, generator) {
//     const pos = generator.valueToCode(block, 'pos', Order.FUNCTION_CALL) || 'new THREE.Vector3()';
//     const r   = Number(block.getFieldValue('R')) || 1;

//     const code = `(function(){
//     const centre = (${pos}).clone();
//     const radius = Math.max(0.01, ${r});
//     const geom = new THREE.SphereGeometry(radius, 32, 16);
//     const mat  = new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.5, metalness: 0.1, opacity:0.8, transparent:true });
//     const mesh = new THREE.Mesh(geom, mat);
//     mesh.position.copy(centre);

//     mesh.userData.geoType = 'geo_sphere';
//     mesh.userData.radius  = radius;

//     return mesh;
//   })()`;

//     return [code, Order.ATOMIC];
// };

//Linalg primitives
// javascriptGenerator.forBlock['linalg_vec3'] = function (block, generator) {
//     const vecString = `new THREE.Vector3(${block.getFieldValue('X')}, ${block.getFieldValue('Y')}, ${block.getFieldValue('Z')})`
//     return [vecString, Order.ATOMIC]
// }

// javascriptGenerator.forBlock['linalg_vec4'] = function (block, generator) {
//     const vecString = `new THREE.Vector4(${block.getFieldValue('W')}, ${block.getFieldValue('X')}, ${block.getFieldValue('Y')}, ${block.getFieldValue('Z')})`
//     return [vecString, Order.ATOMIC]
// }

// javascriptGenerator.forBlock['linalg_mat3x3'] = function (block, generator) {
//     const matString = `new THREE.Matrix3(${block.getFieldValue('r1c1')}, ${block.getFieldValue('r1c2')}, ${block.getFieldValue('r1c3')}, ` 
//                     +  `${block.getFieldValue('r2c1')}, ${block.getFieldValue('r2c2')}, ${block.getFieldValue('r2c3')}, `
//                     +  `${block.getFieldValue('r3c1')}, ${block.getFieldValue('r3c2')}, ${block.getFieldValue('r3c3')})`
//     return [matString, Order.ATOMIC]
// }

// javascriptGenerator.forBlock['linalg_mat4x4'] = function (block, generator) {
//     const matString = `new THREE.Matrix4(${block.getFieldValue('r1c1')}, ${block.getFieldValue('r1c2')}, ${block.getFieldValue('r1c3')}, ${block.getFieldValue('r1c4')},`
//                     +  `${block.getFieldValue('r2c1')}, ${block.getFieldValue('r2c2')}, ${block.getFieldValue('r2c3')}, ${block.getFieldValue('r2c4')}, `
//                     +  `${block.getFieldValue('r3c1')}, ${block.getFieldValue('r3c2')}, ${block.getFieldValue('r3c3')}, ${block.getFieldValue('r3c4')}, `
//                     +  `${block.getFieldValue('r4c1')}, ${block.getFieldValue('r4c2')}, ${block.getFieldValue('r4c3')}, ${block.getFieldValue('r4c4')})`
//     return [matString, Order.ATOMIC]
// }


//Linalg methods
javascriptGenerator.forBlock['cross_product_inplace'] = function (block, generator) {
    var varName = generator.getVariableName(block.getFieldValue('VAR'));
    const crossString = varName + `.cross(${generator.valueToCode(block, 'rhs', Order.FUNCTION_CALL)});`
    return [crossString, Order.FUNCTION_CALL]
}

javascriptGenerator.forBlock['multiply_inplace'] = function (block, generator) {
    var varName = generator.getVariableName(block.getFieldValue('VAR'));
    const multString = varName + `.multiply(${generator.valueToCode(block, 'rhs', Order.FUNCTION_CALL)});`
    return [multString, Order.FUNCTION_CALL]
}

javascriptGenerator.forBlock['inverse_inplace'] = function (block, generator) {
    var varName = generator.getVariableName(block.getFieldValue('VAR'));
    const invString = varName + `.invert();`
    return [invString, Order.FUNCTION_CALL]
}

javascriptGenerator.forBlock['norm_inplace'] = function (block, generator) {
    var varName = generator.getVariableName(block.getFieldValue('VAR'));
    const normString = varName + `.normalize();`
    return [normString, Order.FUNCTION_CALL]
}

javascriptGenerator.forBlock['cross_product'] = function (block, generator) {
    const crossString = `(${generator.valueToCode(block, 'lhs', Order.FUNCTION_CALL)}).clone().cross(${generator.valueToCode(block, 'rhs', Order.FUNCTION_CALL)})`
    return [crossString, Order.FUNCTION_CALL]
}

javascriptGenerator.forBlock['multiply'] = function (block, generator) {
    const multString = `(${generator.valueToCode(block, 'lhs', Order.FUNCTION_CALL)}).clone().multiply(${generator.valueToCode(block, 'rhs', Order.FUNCTION_CALL)})`
    return [multString, Order.FUNCTION_CALL]
}

javascriptGenerator.forBlock['inverse'] = function (block, generator) {
    const multString = `(${generator.valueToCode(block, 'mat', Order.FUNCTION_CALL)}).clone().invert()`
    return [multString, Order.FUNCTION_CALL]
}

javascriptGenerator.forBlock['norm'] = function (block, generator) {
    const normString = `(${generator.valueToCode(block, 'mat', Order.FUNCTION_CALL)}).clone().normalize()`
    return [normString, Order.FUNCTION_CALL]
}

javascriptGenerator.forBlock['dot_product'] = function (block, generator) {
    const dotString = `(${generator.valueToCode(block, 'lhs', Order.FUNCTION_CALL)}).dot(${generator.valueToCode(block, 'rhs', Order.FUNCTION_CALL)})`
    return [dotString, Order.FUNCTION_CALL]
}

javascriptGenerator.forBlock['determinant'] = function (block, generator) {
    const detString = `(${generator.valueToCode(block, 'mat', Order.FUNCTION_CALL)}).determinant()`
    return [detString, Order.FUNCTION_CALL]
}


//get/set pulled directly from Google's implementation, the block ensures that renderable objects are typed as "obj3D" on creation.
//this allows us to get all renderable objects via tag later and add them to the scene.
javascriptGenerator.forBlock['variables_get_obj3D'] = function (block, generator) {
    const code = generator.getVariableName(block.getFieldValue('VAR'))
    return [code, Order.ATOMIC]
}

javascriptGenerator.forBlock['variables_set_obj3D'] = function(block, generator) {
    const varName = generator.getVariableName(block.getFieldValue('VAR'))
    const argument0 = generator.valueToCode(block, 'VALUE', Order.NONE) || 'null'

    //persist places the actual THREE object into a global store that we can use to directly render objects
    //also lets us modify existing objects later 
    const persist = `threeObjStore["${varName}"] = ${argument0};\n`

    //declare the actual variable so we can modify it in eval scope
    //all changes must propagate to the referenced object in threeObjStore
    const let_var = `let ${varName};`

    //set the variable in local scope once it is declared
    const set_var = `${varName} = ${argument0};\n`

    generator.definitions_[varName] = let_var
    return set_var + persist
}

javascriptGenerator.forBlock['rot_matrix'] = function (block, generator) {
    const vals = [
        block.getFieldValue('r1c1'), block.getFieldValue('r1c2'), block.getFieldValue('r1c3'), 0,
        block.getFieldValue('r2c1'), block.getFieldValue('r2c2'), block.getFieldValue('r2c3'), 0,
        block.getFieldValue('r3c1'), block.getFieldValue('r3c2'), block.getFieldValue('r3c3'), 0,
        0, 0, 0, 1
    ];
    const code = `(function(){
    const M = new THREE.Matrix4();
    M.set(${vals.join(',')});
    return M;
  })()`;
    return [code, Order.ATOMIC];
}

javascriptGenerator.forBlock['trans_matrix'] = function (block, generator) {
    const vals = [
        1, 0, 0, block.getFieldValue('r1c4'),
        0, 1, 0, block.getFieldValue('r2c4'),
        0, 0, 1, block.getFieldValue('r3c4'),
        0, 0, 0, 1
    ];
    const code = `(function(){
    const M = new THREE.Matrix4();
    M.set(${vals.join(',')});
    return M;
  })()`;
    return [code, Order.ATOMIC];
}

javascriptGenerator.forBlock['scale_matrix'] = function (block, generator) {
    const vals = [
        block.getFieldValue('r1c1'), 0, 0, 0,
        0, block.getFieldValue('r2c2'), 0, 0,
        0, 0, block.getFieldValue('r3c3'), 0,
        0, 0, 0, 1
    ];
    const code = `(function(){
    const M = new THREE.Matrix4();
    M.set(${vals.join(',')});
    return M;
  })()`;
    return [code, Order.ATOMIC];
}

javascriptGenerator.forBlock['scalar'] = function (block, generator) {
    const v = Number(block.getFieldValue('scalar'));
    return [String(isFinite(v) ? v : 1), Order.ATOMIC];
}

javascriptGenerator.forBlock['object_transform'] = function (block, generator) {
    const rot   = generator.valueToCode(block, 'rot',   Order.FUNCTION_CALL) || 'null';
    const trans = generator.valueToCode(block, 'trans', Order.FUNCTION_CALL) || 'null';
    const scale = generator.valueToCode(block, 'scale', Order.FUNCTION_CALL) || 'null';

    // Find the nearest previous 'variables_set_obj3D' in the chain
    let prev = block.getPreviousBlock();
    let varName = null;
    while (prev) {
        if (prev.type === 'variables_set_obj3D') {
            const varId = prev.getFieldValue('VAR');
            varName = generator.getVariableName(varId);
            break;
        }
        prev = prev.getPreviousBlock();
    }

    if (!varName) {
        return `/* transform: no previous obj3D setter found — skipping */\n`;
    }

    return `
  (function(){
    const obj = ${varName};
    if(!obj || !obj.isObject3D){ return; }

    const _rot = ${rot};
    if (_rot && _rot.isMatrix4) {
      const _q = new THREE.Quaternion().setFromRotationMatrix(_rot);
      obj.quaternion.premultiply(_q);
    }

    const _t = ${trans};
    if (_t && _t.isMatrix4) {
      const _p = new THREE.Vector3().setFromMatrixPosition(_t);
      obj.position.add(_p);
    }
    
    const _s = ${scale};
    if (_s && _s.isMatrix4) {
      const e = _s.elements
      obj.scale.multiply(new THREE.Vector3(
        isFinite(e[0])  && e[0]  !== 0 ? e[0]  : 1,
        isFinite(e[5])  && e[5]  !== 0 ? e[5]  : 1,
        isFinite(e[10]) && e[10] !== 0 ? e[10] : 1
        ))
    }
    
    obj.updateMatrixWorld(true);
    threeObjStore["${varName}"] = obj;
  })();\n`;
}

javascriptGenerator.forBlock['vector_transform'] = function (block, generator) {
    const rot   = generator.valueToCode(block, 'rot',   Order.FUNCTION_CALL) || 'null';
    const trans = generator.valueToCode(block, 'trans', Order.FUNCTION_CALL) || 'null';
    const scale = generator.valueToCode(block, 'scale', Order.FUNCTION_CALL) || 'null';

    let prev = block.getPreviousBlock();
    let varName = null;
    while (prev) {
        if (prev.type === 'variables_set_obj3D') {
            const varId = prev.getFieldValue('VAR');
            varName = generator.getVariableName(varId);
            break;
        }
        prev = prev.getPreviousBlock();
    }

    if (!varName) {
        return `/* transform: no previous geo_vector setter found — skipping */\n`;
    }

    return `
  (function(){
    const obj = ${varName};
    if(!obj || !obj.isObject3D){ return; }

    const _rot = ${rot};
    if (_rot && _rot.isMatrix4) {
      const _q = new THREE.Quaternion().setFromRotationMatrix(_rot);
      obj.quaternion.premultiply(_q);
    }

    const _t = ${trans};
    if (_t && _t.isMatrix4) {
      const _p = new THREE.Vector3().setFromMatrixPosition(_t);
      obj.position.add(_p);
    }
    
    const _s = ${scale};
    if (typeof _s === 'number' && isFinite(_s)) {
      const curr = obj.userData.length ?? 1;
      const newLen = Math.max(0, curr * _s);
      obj.userData.length = newLen;
      const hlr = obj.userData.headLenRatio ?? 0.25;
      const hwr = obj.userData.headWidthRatio ?? 0.10;
      obj.setLength(newLen, hlr * newLen, hwr * newLen);
    }
    
    obj.updateMatrixWorld(true);
    threeObjStore["${varName}"] = obj;
  })();\n`;
}

javascriptGenerator.forBlock['vector_arithmetic'] = function (block, generator) {
    const op     = block.getFieldValue('OP') || 'add';
    const u      = generator.valueToCode(block, 'u', Order.FUNCTION_CALL) || 'new THREE.Vector3()';
    const v      = generator.valueToCode(block, 'v', Order.FUNCTION_CALL) || 'new THREE.Vector3()';

    return `
  (function(){
    const a = (${u}).clone();
    const b = (${v}).clone();
    const origin = new THREE.Vector3();

    const dir = (('${op}'==='add') ? a.add(b) : a.sub(b));
    let len = dir.length();

    if (!isFinite(len) || len <= 0) return;               // nothing to render
    if (!isFinite(dir.length()) || dir.length() === 0) return;

    const norm = dir.clone().normalize();
    const headLenRatio = 0.25, headWidthRatio = 0.10;

    const arrow = new THREE.ArrowHelper(
      norm, origin, len, 0x7c3aed,
      headLenRatio * len, headWidthRatio * len
    );
    const _id = 'vec_tmp_' + Date.now().toString(36) + '_' + Math.floor(Math.random()*1e6).toString(36);
    threeObjStore[_id] = arrow;
  })();\n`;
};


//Math functions
javascriptGenerator.forBlock['math_sin'] = function(block, generator) {
    const value_angle = generator.valueToCode(block, 'ANGLE', Order.FUNCTION_CALL) || '0';
    // Converts degrees to radians
    const code = `Math.sin((${value_angle}) * Math.PI / 180)`;
    return [code, Order.FUNCTION_CALL];
};

javascriptGenerator.forBlock['math_cos'] = function(block, generator) {
    const value_angle = generator.valueToCode(block, 'ANGLE', Order.FUNCTION_CALL) || '0';
    const code = `Math.cos((${value_angle}) * Math.PI / 180)`;
    return [code, Order.FUNCTION_CALL];
};

javascriptGenerator.forBlock['math_tan'] = function(block, generator) {
    const value_angle = generator.valueToCode(block, 'ANGLE', Order.FUNCTION_CALL) || '0';
    const code = `Math.tan((${value_angle}) * Math.PI / 180)`;
    return [code, Order.FUNCTION_CALL];
};


//Actual code gen
export function generateAndRun(workspace){
    javascriptGenerator.addReservedWords('generatedUserCode')
    const generatedUserCode = javascriptGenerator.workspaceToCode(workspace)

    try {
        //may need to pass in threeObjStore
        eval(generatedUserCode)
    } catch (exception) {
        //
        console.log(exception);
        //alert(exception)
    }
}