import * as Blockly from 'blockly/core'

export function defineBlocks() {

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

    Blockly.Blocks['vars_get'] = {
        init: function () {
            this.appendDummyInput()
                .appendField(new Blockly.FieldVariable("variable_name"), "field_name");
            this.setOutput(true, null);
        }
    }

    Blockly.Blocks['vars_set'] = {
        init: function () {
            this.appendValueInput("name")
                .setCheck(null)
                .appendField("set")
                .appendField(new Blockly.FieldVariable("variable_name"), "field_name")
                .appendField("to");
            this.setOutput(true, null);
        }
    }

    Blockly.Blocks['geo_point'] = {
        init() {
            this.appendDummyInput().appendField('Point')
            this.appendDummyInput()
                .appendField('x').appendField(new Blockly.FieldNumber(0, -1e6, 1e6, 0.1), 'X')
                .appendField(' y').appendField(new Blockly.FieldNumber(0, -1e6, 1e6, 0.1), 'Y')
                .appendField(' z').appendField(new Blockly.FieldNumber(0, -1e6, 1e6, 0.1), 'Z')
            this.setStyle('math_blocks')
            this.setTooltip('3D Point (x,y,z)')
            this.setDeletable(true)
            this.setMovable(true)
        }
    }

    Blockly.Blocks['geo_line'] = {
        init() {
            this.appendDummyInput().appendField('Line')
            this.appendDummyInput()
                .appendField('P1 x').appendField(new Blockly.FieldNumber(0), 'X1')
                .appendField(' y').appendField(new Blockly.FieldNumber(0), 'Y1')
                .appendField(' z').appendField(new Blockly.FieldNumber(0), 'Z1')
            this.appendDummyInput()
                .appendField('P2 x').appendField(new Blockly.FieldNumber(1), 'X2')
                .appendField(' y').appendField(new Blockly.FieldNumber(0), 'Y2')
                .appendField(' z').appendField(new Blockly.FieldNumber(0), 'Z2')
            this.setStyle('math_blocks')
            this.setTooltip('Line from P1 to P2')
            this.setDeletable(true)
            this.setMovable(true)
        }
    }

    Blockly.Blocks['geo_plane'] = {
        init() {
            this.appendDummyInput().appendField('Plane (n·x = d)')
            this.appendDummyInput()
                .appendField('n.x').appendField(new Blockly.FieldNumber(0), 'NX')
                .appendField(' n.y').appendField(new Blockly.FieldNumber(1), 'NY')
                .appendField(' n.z').appendField(new Blockly.FieldNumber(0), 'NZ')
            this.appendDummyInput()
                .appendField('d').appendField(new Blockly.FieldNumber(0), 'D')
            this.setStyle('math_blocks')
            this.setTooltip('Plane with normal n and offset d')
            this.setDeletable(true)
            this.setMovable(true)
        }
    }

    Blockly.Blocks['geo_vector'] = {
        init() {
            this.appendDummyInput().appendField('Vector (from origin)')
            this.appendDummyInput()
                .appendField('vx').appendField(new Blockly.FieldNumber(1), 'VX')
                .appendField(' vy').appendField(new Blockly.FieldNumber(0), 'VY')
                .appendField(' vz').appendField(new Blockly.FieldNumber(0), 'VZ')
            this.setStyle('math_blocks')
            this.setTooltip('Vector from origin')
            this.setDeletable(true)
            this.setMovable(true)
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

    Blockly.Blocks['dot_product'] = {
        init() {
            this.appendDummyInput()
            this.appendValueInput('lhs')
            this.appendValueInput('rhs').appendField('·')
            this.setStyle('math_blocks')
            this.setTooltip('Take the dot (inner) product of two matrices.')
            this.setInputsInline(true)
            this.setDeletable(true)
            this.setMovable(true)
            this.setOutput(true)
        }
    }

    Blockly.Blocks['cross_product'] = {
        init() {
            this.appendDummyInput()
            this.appendValueInput('lhs')
            this.appendValueInput('rhs').appendField('×')
            this.setStyle('math_blocks')
            this.setTooltip('Take the cross product of two matrices.')
            this.setInputsInline(true)
            this.setDeletable(true)
            this.setMovable(true)
            this.setOutput(true)
        }
    }

    Blockly.Blocks['multiply'] = {
        init() {
            this.appendDummyInput()
            this.appendValueInput('lhs')
            this.appendValueInput('rhs').appendField('*')
            this.setStyle('math_blocks')
            this.setTooltip('Multiply two matrices.')
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

    Blockly.Blocks['inverse'] = {
        init() {
            this.appendDummyInput().appendField('inv(')
            this.appendValueInput('mat')
            this.appendDummyInput('').appendField(')')
            this.setStyle('math_blocks')
            this.setTooltip('Calculate the inverse of this matrix.')
            this.setInputsInline(true)
            this.setDeletable(true)
            this.setMovable(true)
            this.setOutput(true)
        }
    }

    Blockly.Blocks['norm'] = {
        init() {
            this.appendDummyInput().appendField('norm(')
            this.appendValueInput('mat')
            this.appendDummyInput('').appendField(')')
            this.setStyle('math_blocks')
            this.setTooltip('Calculate the euclidean norm (length) of this vector.')
            this.setInputsInline(true)
            this.setDeletable(true)
            this.setMovable(true)
            this.setOutput(true)
        }
    }

    //TODO:
        //Eigenvalues/eigenvectors
        //Diag
}
