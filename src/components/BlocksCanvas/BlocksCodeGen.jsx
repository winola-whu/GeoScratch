import { javascriptGenerator, Order } from 'blockly/javascript'
import * as mjs from 'mathjs'

javascriptGenerator.forBlock['debug'] = function (block, generator) {
    const debugString = `console.log(${generator.valueToCode(block, 'exp', Order.FUNCTION_CALL)})`
    return [debugString, Order.FUNCTION_CALL]
}

javascriptGenerator.forBlock['linalg_vec3'] = function (block, generator) {
    const vecString = `mjs.matrix([${block.getFieldValue('X')}, ${block.getFieldValue('Y')}, ${block.getFieldValue('Z')}])`
    return [vecString, Order.ATOMIC]
}

javascriptGenerator.forBlock['linalg_vec4'] = function (block, generator) {
    const vecString = `mjs.matrix([${block.getFieldValue('W')}, ${block.getFieldValue('X')}, ${block.getFieldValue('Y')}, ${block.getFieldValue('Z')}])`
    return [vecString, Order.ATOMIC]
}

javascriptGenerator.forBlock['linalg_mat3x3'] = function (block, generator) {
    const matString = `mjs.matrix([[${block.getFieldValue('r1c1')}, ${block.getFieldValue('r1c2')}, ${block.getFieldValue('r1c3')}], ` 
                    +  `[${block.getFieldValue('r2c1')}, ${block.getFieldValue('r2c2')}, ${block.getFieldValue('r2c3')}], `
                    +  `[${block.getFieldValue('r3c1')}, ${block.getFieldValue('r3c2')}, ${block.getFieldValue('r3c3')}]])`
    return [matString, Order.ATOMIC]
}

javascriptGenerator.forBlock['linalg_mat4x4'] = function (block, generator) {
    const matString = `mjs.matrix([[${block.getFieldValue('r1c1')}, ${block.getFieldValue('r1c2')}, ${block.getFieldValue('r1c3')}, ${block.getFieldValue('r1c4')}], `
                    +  `[${block.getFieldValue('r2c1')}, ${block.getFieldValue('r2c2')}, ${block.getFieldValue('r2c3')}, ${block.getFieldValue('r2c4')}], `
                    +  `[${block.getFieldValue('r3c1')}, ${block.getFieldValue('r3c2')}, ${block.getFieldValue('r3c3')}, ${block.getFieldValue('r3c4')}], `
                    +  `[${block.getFieldValue('r4c1')}, ${block.getFieldValue('r4c2')}, ${block.getFieldValue('r4c3')}, ${block.getFieldValue('r4c4')}]])`
    return [matString, Order.ATOMIC]
}

javascriptGenerator.forBlock['dot_product'] = function(block, generator){
    const left = generator.valueToCode(block, 'lhs', Order.FUNCTION_CALL)
    const right = generator.valueToCode(block, 'rhs', Order.FUNCTION_CALL)
    const dotString = `mjs.dot(${left}, ${right})`
    return [dotString, Order.FUNCTION_CALL]
}

javascriptGenerator.forBlock['cross_product'] = function (block, generator) {
    const left = generator.valueToCode(block, 'lhs', Order.FUNCTION_CALL)
    const right = generator.valueToCode(block, 'rhs', Order.FUNCTION_CALL)
    const crossString = `mjs.cross(${lhs}, ${rhs})`
    return [crossString, Order.FUNCTION_CALL]
}

javascriptGenerator.forBlock['multiply'] = function (block, generator) {
    const left = generator.valueToCode(block, 'lhs', Order.FUNCTION_CALL)
    const right = generator.valueToCode(block, 'rhs', Order.FUNCTION_CALL)
    const multString = `mjs.multiply(${lhs}, ${rhs})`
    return [multString, Order.FUNCTION_CALL]
}
javascriptGenerator.forBlock['determinant'] = function (block, generator) {
    const detString = `mjs.det(${generator.valueToCode(block, 'mat', Order.FUNCTION_CALL)})`
    return [detString, Order.FUNCTION_CALL]
}

javascriptGenerator.forBlock['inverse'] = function (block, generator) {
    const invString = `mjs.inv(${generator.valueToCode(block, 'mat', Order.FUNCTION_CALL)})`
    return [invString, Order.FUNCTION_CALL]
}

javascriptGenerator.forBlock['norm'] = function (block, generator) {
    const normString = `mjs.norm(${generator.valueToCode(block, 'mat', Order.FUNCTION_CALL)})`
    return [normString, Order.FUNCTION_CALL]
}

export function generateAndRun(workspace){
    javascriptGenerator.addReservedWords('generatedUserCode')
    const generatedUserCode = javascriptGenerator.workspaceToCode(workspace)

    try {
        (function(mjs){
            eval(generatedUserCode)
        })(mjs);
    } catch (exception) {
        console.log(exception);
        //alert(exception)
    }
}