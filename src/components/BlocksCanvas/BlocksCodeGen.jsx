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

javascriptGenerator.forBlock['debug'] = function (block, generator) {
    const debugString = `console.log(${generator.valueToCode(block, 'exp', Order.FUNCTION_CALL)});`
    return [debugString, Order.FUNCTION_CALL]
}

javascriptGenerator.forBlock['geo_point'] = function (block, generator) {
    const pointDec = `(new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), new THREE.MeshStandardMaterial({color:0xffff00, roughness:0.4, metalness:0.1})))
            .position.copy(${generator.valueToCode(block, 'pos', Order.FUNCTION_CALL)})`

    return [pointDec, Order.ATOMIC]
}

javascriptGenerator.forBlock['geo_plane'] = function (block, generator) {
    const planeDec = `(new THREE.Mesh(new THREE.PlaneGeometry(
                ${generator.valueToCode(block, 'side', Order.FUNCTION_CALL)}, ${generator.valueToCode(block, 'side', Order.FUNCTION_CALL)}), 
                new THREE.MeshStandardMaterial({color: 0xffff00, roughness: 0.4, metalness:0.1})))
            .position.copy(${generator.valueToCode(block, 'pos', Order.FUNCTION_CALL)})`
    return [planeDec, Order.ATOMIC]
}

javascriptGenerator.forBlock['parametric_plane'] = function (block, generator) {
    const planeDec = `new THREE.Plane(${generator.valueToCode(block, 'norm', Order.FUNCTION_CALL)}, ${generator.valueToCode(block, 'dist', Order.FUNCTION_CALL)})`
    return [planeDec, Order.ATOMIC]
}

javascriptGenerator.forBlock['geo_vector'] = function (block, generator) {
    const planeDec = `new THREE.Line3(${generator.valueToCode(block, 'pos', Order.FUNCTION_CALL)}, 
        ${generator.valueToCode(block, 'pos', Order.FUNCTION_CALL)}.add(${generator.valueToCode(block, 'dir', Order.FUNCTION_CALL)}))`
    return [planeDec, Order.ATOMIC]
}


javascriptGenerator.forBlock['linalg_vec3'] = function (block, generator) {
    const vecString = `new THREE.Vector3(${block.getFieldValue('X')}, ${block.getFieldValue('Y')}, ${block.getFieldValue('Z')})`
    return [vecString, Order.ATOMIC]
}

javascriptGenerator.forBlock['linalg_vec4'] = function (block, generator) {
    const vecString = `new THREE.Vector4(${block.getFieldValue('W')}, ${block.getFieldValue('X')}, ${block.getFieldValue('Y')}, ${block.getFieldValue('Z')})`
    return [vecString, Order.ATOMIC]
}

javascriptGenerator.forBlock['linalg_mat3x3'] = function (block, generator) {
    const matString = `new THREE.Matrix3(${block.getFieldValue('r1c1')}, ${block.getFieldValue('r1c2')}, ${block.getFieldValue('r1c3')}, ` 
                    +  `${block.getFieldValue('r2c1')}, ${block.getFieldValue('r2c2')}, ${block.getFieldValue('r2c3')}, `
                    +  `${block.getFieldValue('r3c1')}, ${block.getFieldValue('r3c2')}, ${block.getFieldValue('r3c3')})`
    return [matString, Order.ATOMIC]
}

javascriptGenerator.forBlock['linalg_mat4x4'] = function (block, generator) {
    const matString = `new THREE.Matrix4(${block.getFieldValue('r1c1')}, ${block.getFieldValue('r1c2')}, ${block.getFieldValue('r1c3')}, ${block.getFieldValue('r1c4')},`
                    +  `${block.getFieldValue('r2c1')}, ${block.getFieldValue('r2c2')}, ${block.getFieldValue('r2c3')}, ${block.getFieldValue('r2c4')}, `
                    +  `${block.getFieldValue('r3c1')}, ${block.getFieldValue('r3c2')}, ${block.getFieldValue('r3c3')}, ${block.getFieldValue('r3c4')}, `
                    +  `${block.getFieldValue('r4c1')}, ${block.getFieldValue('r4c2')}, ${block.getFieldValue('r4c3')}, ${block.getFieldValue('r4c4')})`
    return [matString, Order.ATOMIC]
}

//LHS must be a variable input, cross operates in place
javascriptGenerator.forBlock['cross_product_inplace'] = function (block, generator) {
    var varName = generator.getVariableName(block.getFieldValue('VAR'));
    const crossString = varName + `.cross(${generator.valueToCode(block, 'rhs', Order.FUNCTION_CALL)});`
    return [crossString, Order.FUNCTION_CALL]
}

//LHS must be a variable input, multiply operates in place
javascriptGenerator.forBlock['multiply_inplace'] = function (block, generator) {
    var varName = generator.getVariableName(block.getFieldValue('VAR'));
    const multString = varName + `.multiply(${generator.valueToCode(block, 'rhs', Order.FUNCTION_CALL)});`
    return [multString, Order.FUNCTION_CALL]
}

//mat must be a variable input, inverse operates in place
javascriptGenerator.forBlock['inverse_inplace'] = function (block, generator) {
    var varName = generator.getVariableName(block.getFieldValue('VAR'));
    const invString = varName + `.invert();`
    return [invString, Order.FUNCTION_CALL]
}

//vec must be a variable input, normalize operates in place
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

export function generateAndRun(workspace){
    javascriptGenerator.addReservedWords('generatedUserCode')
    const generatedUserCode = javascriptGenerator.workspaceToCode(workspace)

    try {
        //Create eval scope containing Threejs, so generated code can access it
        //Do we need to do this?
        (function(THREE){
            eval(generatedUserCode)
        })(THREE);
    } catch (exception) {
        //
        console.log(exception);
        //alert(exception)
    }
}