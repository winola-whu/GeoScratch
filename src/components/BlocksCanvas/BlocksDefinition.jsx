import * as Blockly from 'blockly/core'

export function defineBlocks() {

    //Debugs the output yielded by the evaluation of the input field
    Blockly.Blocks['debug'] = {
        init() {
            this.appendDummyInput().appendField('debug(')
            this.appendValueInput('exp')
            this.appendDummyInput('').appendField(')')
            this.setStyle('math_blocks')
            this.setTooltip('Prints the output of this expression to the web console.')
            this.setInputsInline(true)
            this.setDeletable(true)
            this.setMovable(true)
            this.setOutput(true)
        }
    }

    //Gets the value of a variable
    Blockly.Blocks['variables_get'] = {
        init: function () {
            this.appendDummyInput()
                .appendField(new Blockly.FieldVariable("VALUE"), "VAR");
            this.setOutput(true, null);
        }
    }

    //Sets the value of a variable
    Blockly.Blocks['variables_set'] = {
        init: function () {
            this.appendValueInput("VALUE")
                .setCheck(null)
                .appendField("set")
                .appendField(new Blockly.FieldVariable("VALUE"), "VAR")
                .appendField("to");
            this.setOutput(true, null);
        }
    }

    Blockly.Blocks['variables_get_obj3D'] = {
        init: function () {
            this.appendDummyInput()
                .appendField(new Blockly.FieldDropdown(() => {
                    const variables = this.workspace.getVariablesOfType('obj3D')
                    return variables.map(v => [v.name, v.name])
                }), "VAR");
            this.setOutput(true, 'obj3D');
            this.setColour(330);
        },
    }

    Blockly.Blocks['variables_set_obj3D'] = {
        init: function () {
            this.appendValueInput("VALUE")
                .setCheck('obj3D')
                .appendField("set")
                .appendField(new Blockly.FieldDropdown(() => {
                    const variables = this.workspace.getVariablesOfType('obj3D')
                    return variables.map(v => [v.name, v.name])
                }), "VAR")
                .appendField("to");
            this.setPreviousStatement(true, null)
            this.setNextStatement(true, null)
            this.setColour(330)
        },
    }

    //Represents a point in 3d space as a small fixed-size sphere
    Blockly.Blocks['geo_point'] = {
        init() {
            this.appendDummyInput().appendField('Point')
            this.appendValueInput('pos').appendField('pos: ')
            this.setStyle('math_blocks')
            this.setTooltip('Point with position p.')
            this.setDeletable(true)
            this.setMovable(true)
            this.setOutput(true, 'obj3D')
        }
    }

    //Represents a vector in 3d space as an arrow
    Blockly.Blocks['geo_vector'] = {
        init() {
            this.appendDummyInput().appendField('Vector3')
            this.appendValueInput('pos').appendField('pos:')
            this.appendValueInput('dir').appendField('dir:')
            this.setStyle('math_blocks')
            this.setTooltip('Vector with position pos and direction dir.')
            this.setDeletable(true)
            this.setMovable(true)
            this.setOutput(true, 'obj3D')
        }
    }

    //Describes a plane in 3D space using the plane's equation in Hessian form
    Blockly.Blocks['parametric_plane'] = {
        init() {
            this.appendDummyInput().appendField('Plane (Parametric)')
            this.appendValueInput('norm').appendField('norm:')
            this.appendValueInput('dist').appendField('dist:')
            this.setStyle('math_blocks')
            this.setTooltip('Plane with normal n, at distance d from the origin.')
            this.setDeletable(true)
            this.setMovable(true)
            this.setOutput(true, 'obj3D')
        }
    }

    //Describes a plane in 3D space using a mesh representation
    Blockly.Blocks['geo_plane'] = {
        init() {
            this.appendDummyInput().appendField('Plane (Geometric)')
            this.appendValueInput('pos').appendField('pos:')
            this.appendValueInput('side').appendField('side length:')
            this.setStyle('math_blocks')
            this.setTooltip('Plane at position p, with side length s.')
            this.setDeletable(true)
            this.setMovable(true)
            this.setOutput(true, 'obj3D')
        }
    }

    Blockly.Blocks['linalg_vec3'] = {
        init() {
            this.appendDummyInput().appendField('Vector3: (')
                .appendField(new Blockly.FieldNumber(1), 'X').appendField(',')
                .appendField(new Blockly.FieldNumber(1), 'Y').appendField(',')
                .appendField(new Blockly.FieldNumber(1), 'Z').appendField(')')
            this.setStyle('math_blocks')
            this.setTooltip('3D Vector')
            this.setDeletable(true)
            this.setMovable(true)
            this.setOutput(true)
        }
    }

    Blockly.Blocks['linalg_vec4'] = {
        init() {
            this.appendDummyInput().appendField('Vector4: (')
                .appendField(new Blockly.FieldNumber(1), 'W').appendField(',')
                .appendField(new Blockly.FieldNumber(1), 'X').appendField(',')
                .appendField(new Blockly.FieldNumber(1), 'Y').appendField(',')
                .appendField(new Blockly.FieldNumber(1), 'Z').appendField(')')
            this.setStyle('math_blocks')
            this.setTooltip('4D Vector')
            this.setDeletable(true)
            this.setMovable(true)
            this.setOutput(true)
        }
    }

    Blockly.Blocks['linalg_mat3x3'] = {
        init() {
            this.appendDummyInput().appendField('3x3 Matrix')
            this.appendDummyInput().appendField(new Blockly.FieldNumber(1), 'r1c1')
                .appendField(new Blockly.FieldNumber(1), 'r1c2')
                .appendField(new Blockly.FieldNumber(1), 'r1c3')
            this.appendDummyInput().appendField(new Blockly.FieldNumber(1), 'r2c1')
                .appendField(new Blockly.FieldNumber(1), 'r2c2')
                .appendField(new Blockly.FieldNumber(1), 'r2c3')
            this.appendDummyInput().appendField(new Blockly.FieldNumber(1), 'r3c1')
                .appendField(new Blockly.FieldNumber(1), 'r3c2')
                .appendField(new Blockly.FieldNumber(1), 'r3c3')
            this.setStyle('math_blocks')
            this.setTooltip('3x3 Matrix')
            this.setDeletable(true)
            this.setMovable(true)
            this.setOutput(true)
        }
    }

    Blockly.Blocks['linalg_mat4x4'] = {
        init() {
            this.appendDummyInput().appendField('4x4 Matrix')
            this.appendDummyInput().appendField(new Blockly.FieldNumber(1), 'r1c1')
                .appendField(new Blockly.FieldNumber(1), 'r1c2')
                .appendField(new Blockly.FieldNumber(1), 'r1c3')
                .appendField(new Blockly.FieldNumber(1), 'r1c4')
            this.appendDummyInput().appendField(new Blockly.FieldNumber(1), 'r2c1')
                .appendField(new Blockly.FieldNumber(1), 'r2c2')
                .appendField(new Blockly.FieldNumber(1), 'r2c3')
                .appendField(new Blockly.FieldNumber(1), 'r2c4')
            this.appendDummyInput().appendField(new Blockly.FieldNumber(1), 'r3c1')
                .appendField(new Blockly.FieldNumber(1), 'r3c2')
                .appendField(new Blockly.FieldNumber(1), 'r3c3')
                .appendField(new Blockly.FieldNumber(1), 'r3c4')
            this.appendDummyInput().appendField(new Blockly.FieldNumber(1), 'r4c1')
                .appendField(new Blockly.FieldNumber(1), 'r4c2')
                .appendField(new Blockly.FieldNumber(1), 'r4c3')
                .appendField(new Blockly.FieldNumber(1), 'r4c4')
            this.setStyle('math_blocks')
            this.setTooltip('4x4 Matrix')
            this.setDeletable(true)
            this.setMovable(true)
            this.setOutput(true)
        }
    }

    Blockly.Blocks['cross_product_inplace'] = {
        init() {
            this.appendDummyInput()
                .appendField(new Blockly.FieldVariable("Vector"), "VAR")
            this.appendValueInput('rhs').appendField('×')
            this.setStyle('math_blocks')
            this.setTooltip('Take the cross product of two matrices.')
            this.setInputsInline(true)
            this.setDeletable(true)
            this.setMovable(true)
            this.setOutput(true)
        }
    }

    Blockly.Blocks['multiply_inplace'] = {
        init() {
            this.appendDummyInput()
                .appendField(new Blockly.FieldVariable("Matrix"), "VAR")
            this.appendValueInput('rhs').appendField('*')
            this.setStyle('math_blocks')
            this.setTooltip('Multiply two matrices.')
            this.setInputsInline(true)
            this.setDeletable(true)
            this.setMovable(true)
            this.setOutput(true)
        }
    }

    Blockly.Blocks['inverse_inplace'] = {
        init() {
            this.appendDummyInput().appendField('inv(')
                .appendField(new Blockly.FieldVariable("Matrix"), "VAR")
            this.appendDummyInput('').appendField(')')
            this.setStyle('math_blocks')
            this.setTooltip('Calculate the inverse of this matrix.')
            this.setInputsInline(true)
            this.setDeletable(true)
            this.setMovable(true)
            this.setOutput(true)
        }
    }

    Blockly.Blocks['norm_inplace'] = {
        init() {
            this.appendDummyInput().appendField('norm(')
                .appendField(new Blockly.FieldVariable("Vector"), "VAR")
            this.appendDummyInput('').appendField(')')
            this.setStyle('math_blocks')
            this.setTooltip('Normalize this vector in place.')
            this.setInputsInline(true)
            this.setDeletable(true)
            this.setMovable(true)
            this.setOutput(true)
        }
    }

    Blockly.Blocks['dot_product'] = {
        init() {
            this.appendDummyInput()
            this.appendValueInput('lhs')
            this.appendValueInput('rhs').appendField('·')
            this.setStyle('math_blocks')
            this.setTooltip('Take the dot (inner) product of two vectors.')
            this.setInputsInline(true)
            this.setDeletable(true)
            this.setMovable(true)
            this.setOutput(true)
        }
    }

    Blockly.Blocks['determinant'] = {
        init() {
            this.appendDummyInput().appendField('det(')
            this.appendValueInput('mat')
            this.appendDummyInput('').appendField(')')
            this.setStyle('math_blocks')
            this.setTooltip('Calculate the determinant of this matrix.')
            this.setInputsInline(true)
            this.setDeletable(true)
            this.setMovable(true)
            this.setOutput(true)
        }
    }
}
