import * as Blockly from 'blockly/core'

export function defineBlocks() {

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
