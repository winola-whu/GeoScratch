import { useEffect, useRef } from 'react'
import * as Blockly from 'blockly/core'
import { javascriptGenerator, Order } from 'blockly/javascript'
import * as mjs from 'mathjs'
import 'blockly/blocks' // built-ins (math/logic/etc.)
import 'blockly/msg/en'
import './BlocksCanvas.css'

if (!Blockly.Msg["MATH_ADDITION_SYMBOL"]) {
  Blockly.Msg["MATH_ADDITION_SYMBOL"] = "+";
  Blockly.Msg["MATH_SUBTRACTION_SYMBOL"] = "-";
  Blockly.Msg["MATH_MULTIPLICATION_SYMBOL"] = "×";
  Blockly.Msg["MATH_DIVISION_SYMBOL"] = "÷";
  Blockly.Msg["MATH_POWER_SYMBOL"] = "^";
} //fixed symbol

const TOOLBOX_XML = `
<xml id="toolbox" style="display: none">
  <category name="Geometric Objects" categorystyle="math_category">
    <block type="geo_point"></block>
    <block type="geo_line"></block>
    <block type="geo_plane"></block>
    <block type="geo_vector"></block>
  </category>
  <category name="Linear Algebra Primitives" categorystyle="text_category">
    <block type="linalg_mat3x3"></block>
    <block type="linalg_mat4x4"></block>
  </category>
  <category name="Linear Algebra Operators" categorystyle="logic_category">
    <block type="dot_product"></block>
    <block type="cross_product"></block>
    <block type="multiply"></block>
    <block type="inverse"></block>
    <block type="determinant"></block>
  </category>
  <category name="Measurements" categorystyle="list_category">
    <!-- placeholder -->
  </category>
</xml>
`

function defineBlocks() {

    Blockly.Blocks['vars_get'] = {
        init: function () {
            this.appendDummyInput()
                .appendField(new Blockly.FieldVariable("variable_name"), "field_name");
            this.setOutput(true, null);
        }
    }

    Blockly.Blocks['vars_set'] = {
        init: function () {
            this.appendValueInput("NAME")
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
            this.appendDummyInput().appendField('Dot product')
            this.appendDummyInput().appendField(' ').appendField(new Blockly.FieldVariable(null), 'lhs')
                .appendField(' · ').appendField(new Blockly.FieldVariable(null), 'rhs')
            this.setStyle('math_blocks')
            this.setTooltip('Take the dot (inner) product of two matrices.')
            this.setDeletable(true)
            this.setMovable(true)
            this.setOutput(true)
        }
    }

    Blockly.Blocks['cross_product'] = {
        init() {
            this.appendDummyInput().appendField('Cross product')
            this.appendDummyInput().appendField(' ').appendField(new Blockly.FieldVariable(null), 'lhs')
                .appendField(' × ').appendField(new Blockly.FieldVariable(null), 'rhs')
            this.setStyle('math_blocks')
            this.setTooltip('Take the cross product of two matrices.')
            this.setDeletable(true)
            this.setMovable(true)
            this.setOutput(true)
        }
    }

    Blockly.Blocks['multiply'] = {
        init() {
            this.appendDummyInput().appendField('Multiply')
            this.appendDummyInput().appendField(' ').appendField(new Blockly.FieldVariable(null), 'lhs')
                .appendField(' × ').appendField(new Blockly.FieldVariable(null), 'rhs')
            this.setStyle('math_blocks')
            this.setTooltip('Multiply two matrices.')
            this.setDeletable(true)
            this.setMovable(true)
            this.setOutput(true)
        }
    }


    Blockly.Blocks['determinant'] = {
        init() {
            this.appendDummyInput().appendField('Determinant')
            this.appendDummyInput().appendField(' ').appendField(new Blockly.FieldVariable(null), 'mat')
            this.setStyle('math_blocks')
            this.setTooltip('Calculate the determinant of this matrix.')
            this.setDeletable(true)
            this.setMovable(true)
            this.setOutput(true)
        }
    }

    Blockly.Blocks['inverse'] = {
        init() {
            this.appendDummyInput().appendField('Inverse')
            this.appendDummyInput().appendField(' ').appendField(new Blockly.FieldVariable(null), 'mat')
            this.setStyle('math_blocks')
            this.setTooltip('Calculate the inverse of this matrix.')
            this.setDeletable(true)
            this.setMovable(true)
            this.setOutput(true)
        }
    }

    //TODO:
        //Eigenvalues/eigenvectors
        //Diag
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
    const dotString = `mjs.dot(${generator.valueToCode(block, 'lhs', Order.FUNCTION_CALL)}, ${generator.valueToCode(block, 'rhs', Order.FUNCTION_CALL)})`
    return [dotString, Order.FUNCTION_CALL]
}

javascriptGenerator.forBlock['cross_product'] = function (block, generator) {
    const crossString = `mjs.cross(${generator.valueToCode(block, 'lhs', Order.FUNCTION_CALL)}, ${generator.valueToCode(block, 'rhs', Order.FUNCTION_CALL)})`
    return [crossString, Order.FUNCTION_CALL]
}

javascriptGenerator.forBlock['multiply'] = function (block, generator) {
    const multString = `mjs.multiply(${generator.valueToCode(block, 'lhs', Order.FUNCTION_CALL)}, ${generator.valueToCode(block, 'rhs', Order.FUNCTION_CALL)})`
    return [multString, Order.FUNCTION_CALL]
}
javascriptGenerator.forBlock['determinant'] = function (block, generator) {
    const detString = `mjs.det(${generator.valueToCode(block, 'mat', Order.FUNCTION_CALL)})`
    return [detString, Order.FUNCTION_CALL]
}

javascriptGenerator.forBlock['inverse'] = function (block, generator) {
    const invString = `mjs.inverse(${generator.valueToCode(block, 'mat', Order.FUNCTION_CALL)})`
    return [invString, Order.FUNCTION_CALL]
}

export default function BlocksCanvas({ onObjectsChange }) {
    const hostRef = useRef(null)
    const workspaceRef = useRef(null)

    useEffect(() => {
        defineBlocks()

        // Create workspace
        const ws = Blockly.inject(hostRef.current, {
            toolbox: TOOLBOX_XML,
            renderer: 'geras',
            grid: { spacing: 20, length: 3, colour: '#eee', snap: false },
            zoom: { controls: true, wheel: true, startScale: 0.9 },
            trashcan: true,
            theme: Blockly.Themes.Classic,
            move: { scrollbars: true, drag: true, wheel: true },
        })
        workspaceRef.current = ws

        // Compute objects from top-level blocks
        const syncObjects = () => {
            const blocks = ws.getTopBlocks(false)
            const objs = []

            for (const b of blocks) {
                switch (b.type) {
                    case 'geo_point': {
                        const X = +b.getFieldValue('X') || 0
                        const Y = +b.getFieldValue('Y') || 0
                        const Z = +b.getFieldValue('Z') || 0
                        objs.push({ type: 'point', params: { x: X, y: Y, z: Z } })
                        break
                    }
                    case 'geo_line': {
                        const X1 = +b.getFieldValue('X1') || 0
                        const Y1 = +b.getFieldValue('Y1') || 0
                        const Z1 = +b.getFieldValue('Z1') || 0
                        const X2 = +b.getFieldValue('X2') || 0
                        const Y2 = +b.getFieldValue('Y2') || 0
                        const Z2 = +b.getFieldValue('Z2') || 0
                        objs.push({ type: 'line', params: { x1:X1,y1:Y1,z1:Z1,x2:X2,y2:Y2,z2:Z2 } })
                        break
                    }
                    case 'geo_plane': {
                        const NX = +b.getFieldValue('NX') || 0
                        const NY = +b.getFieldValue('NY') || 1
                        const NZ = +b.getFieldValue('NZ') || 0
                        const D  = +b.getFieldValue('D')  || 0
                        objs.push({ type: 'plane', params: { nx:NX, ny:NY, nz:NZ, d:D } })
                        break
                    }
                    case 'geo_vector': {
                        const VX = +b.getFieldValue('VX') || 1
                        const VY = +b.getFieldValue('VY') || 0
                        const VZ = +b.getFieldValue('VZ') || 0
                        objs.push({ type: 'vector', params: { vx:VX, vy:VY, vz:VZ } })
                        break
                    }
                    default:
                        break
                }
            }

            onObjectsChange?.(objs)
        }

        // Sync on ANY change (create, delete, move, field edit)
        const listener = (e) => {
            if (e.isUiEvent) return // ignore pure UI (zoom/scroll) for perf
            // Log minimal debugging on block creates
            if (e.type === Blockly.Events.BLOCK_CREATE) {
                const created = e.ids?.length ? ws.getBlockById(e.ids[0]) : null
                if (created && created.type.startsWith('geo_')) {
                    console.log('[GeoScratch] Created', created.type)
                }
            }
            //GENERATE AND RUN THE CODE
            javascriptGenerator.addReservedWords('generatedUserCode')
            const generatedUserCode = javascriptGenerator.workspaceToCode(workspace)

            try {
                (function(mjs){
                    eval(generatedUserCode)
                })(mjs);
            } catch (exception) {
                alert(exception)
            }

            syncObjects()
        }

        ws.addChangeListener(listener)
        syncObjects() // initial

        // Resize Blockly when panel resizes
        const ro = new ResizeObserver(() => Blockly.svgResize(ws))
        ro.observe(hostRef.current)

        return () => {
            ws.removeChangeListener(listener)
            ro.disconnect()
            ws.dispose()
        }
    }, [onObjectsChange])

    return (
        <div className="panel panel-left" id="blocks-canvas">
            <div className="blocks-toolbar">
                <span style={{ opacity: 0.8 }}>Blocks</span>
            </div>
            <div className="blocks-content" ref={hostRef} />
        </div>
    )
}