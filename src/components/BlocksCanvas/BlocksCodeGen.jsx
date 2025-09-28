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