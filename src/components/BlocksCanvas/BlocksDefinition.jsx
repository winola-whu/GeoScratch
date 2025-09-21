import * as Blockly from 'blockly/core'

export function defineBlocks() {

    //Debugs the output yielded by the evaluation of the input field
    // Blockly.Blocks['debug'] = {
    //     init() {
    //         this.appendDummyInput().appendField('debug(')
    //         this.appendValueInput('exp')
    //         this.appendDummyInput('').appendField(')')
    //         this.setStyle('math_blocks')
    //         this.setTooltip('Prints the output of this expression to the web console.')
    //         this.setInputsInline(true)
    //         this.setDeletable(true)
    //         this.setMovable(true)
    //         this.setOutput(true)
    //     }
    // }

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
    // Blockly.Blocks['geo_point'] = {
    //     init() {
    //         this.appendDummyInput().appendField('Point')
    //         this.appendValueInput('pos').appendField('pos: ').setCheck('vector3')
    //         this.setStyle('math_blocks')
    //         this.setTooltip('Point with position p.')
    //         this.setDeletable(true)
    //         this.setMovable(true)
    //         this.setOutput(true, 'obj3D')
    //     }
    // }

    //Represents a vector in 3d space as an arrow
    // Blockly.Blocks['geo_vector'] = {
    //     init() {
    //         this.appendDummyInput().appendField('Vector')
    //         this.appendValueInput('pos').appendField('Position:')
    //         this.appendValueInput('dir').appendField('Direction:')
    //         this.appendValueInput('scale').appendField('Scale:')
    //         this.setStyle('math_blocks')
    //         this.setTooltip('Vector with position pos and direction dir.')
    //         this.setDeletable(true)
    //         this.setMovable(true)
    //         this.setOutput(true, 'obj3D')
    //     }
    // }

    // Blockly.Blocks['geo_sphere'] = {
    //     init() {
    //         this.appendDummyInput().appendField('Sphere')
    //         this.setStyle('math_blocks')
    //         this.setTooltip('Geometric Sphere Object')
    //         this.setDeletable(true)
    //         this.setMovable(true)
    //         this.setOutput(true, 'obj3D')
    //         this.appendDummyInput()
    //             .appendField('Radius:')
    //             .appendField(new Blockly.FieldNumber(1, 0.01, Infinity, 0.1), 'R');
    //         this.appendValueInput('pos').appendField('Centre:').setCheck('vector3')
    //     }
    // }

    //Describes a plane in 3D space using the plane's equation in Hessian form
    // Blockly.Blocks['parametric_plane'] = {
    //     init() {
    //         this.appendDummyInput().appendField('Plane (Parametric)')
    //         this.appendValueInput('norm').appendField('norm:')
    //         this.appendValueInput('dist').appendField('dist:')
    //         this.setStyle('math_blocks')
    //         this.setTooltip('Plane with normal n, at distance d from the origin.')
    //         this.setDeletable(true)
    //         this.setMovable(true)
    //         this.setOutput(true, 'obj3D')
    //     }
    // }

    //Describes a plane in 3D space using a mesh representation
    // Blockly.Blocks['geo_plane'] = {
    //     init() {
    //         this.appendDummyInput().appendField('Plane (Geometric)')
    //         this.appendValueInput('pos').appendField('pos:')
    //         this.appendValueInput('side').appendField('side length:')
    //         this.setStyle('math_blocks')
    //         this.setTooltip('Plane at position p, with side length s.')
    //         this.setDeletable(true)
    //         this.setMovable(true)
    //         this.setOutput(true, 'obj3D')
    //     }
    // }

    // Blockly.Blocks['linalg_vec3'] = {
    //     init() {
    //         this.appendDummyInput().appendField('Vector3: (')
    //             .appendField(new Blockly.FieldNumber(1), 'X').appendField(',')
    //             .appendField(new Blockly.FieldNumber(1), 'Y').appendField(',')
    //             .appendField(new Blockly.FieldNumber(1), 'Z').appendField(')')
    //         this.setStyle('math_blocks')
    //         this.setTooltip('3D Vector')
    //         this.setDeletable(true)
    //         this.setMovable(true)
    //         this.setOutput(true, 'vector3')
    //     }
    // }

    // Blockly.Blocks['linalg_vec4'] = {
    //     init() {
    //         this.appendDummyInput().appendField('Vector4: (')
    //             .appendField(new Blockly.FieldNumber(1), 'W').appendField(',')
    //             .appendField(new Blockly.FieldNumber(1), 'X').appendField(',')
    //             .appendField(new Blockly.FieldNumber(1), 'Y').appendField(',')
    //             .appendField(new Blockly.FieldNumber(1), 'Z').appendField(')')
    //         this.setStyle('math_blocks')
    //         this.setTooltip('4D Vector')
    //         this.setDeletable(true)
    //         this.setMovable(true)
    //         this.setOutput(true, 'vector4')
    //     }
    // }

    // Blockly.Blocks['linalg_mat3x3'] = {
    //     init() {
    //         this.appendDummyInput().appendField('3x3 Matrix')
    //         this.appendDummyInput().appendField(new Blockly.FieldNumber(1), 'r1c1')
    //             .appendField(new Blockly.FieldNumber(1), 'r1c2')
    //             .appendField(new Blockly.FieldNumber(1), 'r1c3')
    //         this.appendDummyInput().appendField(new Blockly.FieldNumber(1), 'r2c1')
    //             .appendField(new Blockly.FieldNumber(1), 'r2c2')
    //             .appendField(new Blockly.FieldNumber(1), 'r2c3')
    //         this.appendDummyInput().appendField(new Blockly.FieldNumber(1), 'r3c1')
    //             .appendField(new Blockly.FieldNumber(1), 'r3c2')
    //             .appendField(new Blockly.FieldNumber(1), 'r3c3')
    //         this.setStyle('math_blocks')
    //         this.setTooltip('3x3 Matrix')
    //         this.setDeletable(true)
    //         this.setMovable(true)
    //         this.setOutput(true, 'matrix3')
    //     }
    // }

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
            this.setOutput(true, 'matrix4')
        }
    }

    // Blockly.Blocks['scalar'] = {
    //     init() {
    //         this.appendDummyInput().appendField('Scalar').appendField(new Blockly.FieldNumber(1), 'scalar')
    //         this.setStyle('math_blocks')
    //         this.setTooltip('Vector Scalar')
    //         this.setDeletable(true)
    //         this.setMovable(true)
    //         this.setOutput(true, 'scalar')
    //     }
    // }

    // Blockly.Blocks['cross_product_inplace'] = {
    //     init() {
    //         this.appendDummyInput()
    //             .appendField(new Blockly.FieldVariable("Vector"), "VAR")
    //         this.appendValueInput('rhs').appendField('×')
    //         this.setStyle('math_blocks')
    //         this.setTooltip('Take the cross product of two matrices.')
    //         this.setInputsInline(true)
    //         this.setDeletable(true)
    //         this.setMovable(true)
    //         this.setOutput(true)
    //     }
    // }

    // Blockly.Blocks['multiply_inplace'] = {
    //     init() {
    //         this.appendDummyInput()
    //             .appendField(new Blockly.FieldVariable("Matrix"), "VAR")
    //         this.appendValueInput('rhs').appendField('*')
    //         this.setStyle('math_blocks')
    //         this.setTooltip('Multiply two matrices.')
    //         this.setInputsInline(true)
    //         this.setDeletable(true)
    //         this.setMovable(true)
    //         this.setOutput(true)
    //     }
    // }

    // Blockly.Blocks['inverse_inplace'] = {
    //     init() {
    //         this.appendDummyInput().appendField('inv(')
    //             .appendField(new Blockly.FieldVariable("Matrix"), "VAR")
    //         this.appendDummyInput('').appendField(')')
    //         this.setStyle('math_blocks')
    //         this.setTooltip('Calculate the inverse of this matrix.')
    //         this.setInputsInline(true)
    //         this.setDeletable(true)
    //         this.setMovable(true)
    //         this.setOutput(true)
    //     }
    // }

    // Blockly.Blocks['norm_inplace'] = {
    //     init() {
    //         this.appendDummyInput().appendField('norm(')
    //             .appendField(new Blockly.FieldVariable("Vector"), "VAR")
    //         this.appendDummyInput('').appendField(')')
    //         this.setStyle('math_blocks')
    //         this.setTooltip('Normalize this vector in place.')
    //         this.setInputsInline(true)
    //         this.setDeletable(true)
    //         this.setMovable(true)
    //         this.setOutput(true)
    //     }
    // }

    // Blockly.Blocks['dot_product'] = {
    //     init() {
    //         this.appendDummyInput()
    //         this.appendValueInput('lhs')
    //         this.appendValueInput('rhs').appendField('·')
    //         this.setStyle('math_blocks')
    //         this.setTooltip('Take the dot (inner) product of two vectors.')
    //         this.setInputsInline(true)
    //         this.setDeletable(true)
    //         this.setMovable(true)
    //         this.setOutput(true)
    //     }
    // }

    // Blockly.Blocks['determinant'] = {
    //     init() {
    //         this.appendDummyInput().appendField('det(')
    //         this.appendValueInput('mat')
    //         this.appendDummyInput('').appendField(')')
    //         this.setStyle('math_blocks')
    //         this.setTooltip('Calculate the determinant of this matrix.')
    //         this.setInputsInline(true)
    //         this.setDeletable(true)
    //         this.setMovable(true)
    //         this.setOutput(true)
    //     }
    // }

    Blockly.Blocks['rot_matrix'] = {
        init() {
            this.appendDummyInput().appendField('Rotation Matrix')
            this.appendDummyInput().appendField(new Blockly.FieldNumber(1), 'r1c1')
                .appendField(new Blockly.FieldNumber(0), 'r1c2')
                .appendField(new Blockly.FieldNumber(0), 'r1c3')
                .appendField('0')
            this.appendDummyInput().appendField(new Blockly.FieldNumber(0), 'r2c1')
                .appendField(new Blockly.FieldNumber(1), 'r2c2')
                .appendField(new Blockly.FieldNumber(0), 'r2c3')
                .appendField('0')
            this.appendDummyInput().appendField(new Blockly.FieldNumber(0), 'r3c1')
                .appendField(new Blockly.FieldNumber(0), 'r3c2')
                .appendField(new Blockly.FieldNumber(1), 'r3c3')
                .appendField('0')
            this.appendDummyInput().appendField('0').appendField('0').appendField('0').appendField('1')
            this.setStyle('math_blocks')
            this.setTooltip('Homogeneous Rotation Matrix')
            this.setDeletable(true)
            this.setMovable(true)
            this.setOutput(true, 'rotMat')
        }
    }

    // Blockly.Blocks['trans_matrix'] = {
    //     init() {
    //         this.appendDummyInput().appendField('Translation Matrix')
    //         this.appendDummyInput().appendField('1').appendField('0').appendField('0')
    //                 .appendField(new Blockly.FieldNumber(0), 'r1c4')
    //             this.appendDummyInput().appendField('0').appendField('1').appendField('0')
    //                 .appendField(new Blockly.FieldNumber(0), 'r2c4')
    //             this.appendDummyInput().appendField('0').appendField('0').appendField('1')
    //                 .appendField(new Blockly.FieldNumber(0), 'r3c4')
    //             this.appendDummyInput().appendField('0').appendField('0')
    //                 .appendField('0').appendField('1')
    //         this.setStyle('math_blocks')
    //         this.setTooltip('Homogeneous Translation Matrix')
    //         this.setDeletable(true)
    //         this.setMovable(true)
    //         this.setOutput(true, 'transMat')
    //     }
    // }

    // Blockly.Blocks['scale_matrix'] = {
    //     init() {
    //     this.appendDummyInput().appendField('Scaling Matrix')
    //         this.appendDummyInput().appendField(new Blockly.FieldNumber(1), 'r1c1')
    //             .appendField('0')
    //             .appendField('0')
    //             .appendField('0')
    //         this.appendDummyInput().appendField('0')
    //             .appendField(new Blockly.FieldNumber(1), 'r2c2')
    //             .appendField('0')
    //             .appendField('0')
    //         this.appendDummyInput().appendField('0')
    //             .appendField('0')
    //             .appendField(new Blockly.FieldNumber(1), 'r3c3')
    //             .appendField('0')
    //         this.appendDummyInput().appendField('0').appendField('0')
    //             .appendField('0').appendField('1')
    //     this.setStyle('math_blocks')
    //     this.setTooltip('Homogeneous Scaling Matrix')
    //     this.setDeletable(true)
    //     this.setMovable(true)
    //     this.setOutput(true, 'scaleMat')
    //     }
    // }

    // Blockly.Blocks['object_transform'] = {
    //     init() {
    //         this.appendDummyInput().appendField('Object Transform')
    //         this.setPreviousStatement(true)
    //         this.setNextStatement(true)
    //         this.appendValueInput('rot').appendField('Rotate:').setCheck('rotMat')
    //         this.appendValueInput('trans').appendField('Translate:').setCheck('transMat')
    //         this.appendValueInput('scale').appendField('Scaling:').setCheck('scaleMat')
    //         this.setStyle('math_blocks')
    //         this.setTooltip('Translate / rotate object in R3')
    //         this.setDeletable(true)
    //         this.setMovable(true)
    //     }
    // }

    // Blockly.Blocks['vector_transform'] = {
    //     init() {
    //         this.appendDummyInput().appendField('Vector Transform')
    //         this.setPreviousStatement(true)
    //         this.setNextStatement(true)
    //         this.appendValueInput('rot').appendField('Rotate:').setCheck('rotMat')
    //         this.appendValueInput('trans').appendField('Translate:').setCheck('transMat')
    //         this.appendValueInput('scale').appendField('Scaling:').setCheck('scalar')
    //         this.setStyle('math_blocks')
    //         this.setTooltip('Translate / rotate vector in R3')
    //         this.setDeletable(true)
    //         this.setMovable(true)
    //     }
    // }

    // Blockly.Blocks['vector_arithmetic'] = {
    //     init() {
    //         this.appendValueInput('u').setCheck('vector3')
    //         this.appendValueInput('v').setCheck('vector3').appendField(new Blockly.FieldDropdown([['u + v', 'add'], ['u - v', 'subtract']]), 'OP')
    //         this.setPreviousStatement(true);
    //         this.setNextStatement(true);
    //         this.setStyle('math_blocks');
    //         this.setTooltip('Computes u ± v and renders the result');
    //         this.setDeletable(true);
    //         this.setMovable(true);
    //         this.setInputsInline(true)
    //     }
    // }

    Blockly.Blocks['math_sin'] = {
        init: function() {
            this.appendValueInput("ANGLE")
                .setCheck("Number")
                .appendField("sin");
            this.setOutput(true, "Number");
            this.setColour(230);
            this.setTooltip("Returns the sine of an angle (in degrees).");
            this.setHelpUrl("");
        }
    };

    Blockly.Blocks['math_cos'] = {
        init: function() {
            this.appendValueInput("ANGLE")
                .setCheck("Number")
                .appendField("cos");
            this.setOutput(true, "Number");
            this.setColour(230);
            this.setTooltip("Returns the cosine of an angle (in degrees).");
            this.setHelpUrl("");
        }
    };

    Blockly.Blocks['math_tan'] = {
        init: function() {
            this.appendValueInput("ANGLE")
                .setCheck("Number")
                .appendField("tan");
            this.setOutput(true, "Number");
            this.setColour(230);
            this.setTooltip("Returns the tangent of an angle (in degrees).");
            this.setHelpUrl("");
        }
    };

}
