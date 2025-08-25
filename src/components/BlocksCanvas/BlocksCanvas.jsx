import { useEffect, useRef } from 'react'
import { defineBlocks } from './BlocksDefinition'
import { generateAndRun, threeObjStore } from './BlocksCodeGen'
import { TOOLBOX_XML } from './BlocksToolboxDefinition'
import * as Blockly from 'blockly/core'
import * as en from 'blockly/msg/en';
import 'blockly/blocks' // built-ins (math/logic/etc.)
import './BlocksCanvas.css'

Blockly.setLocale(en); //fixes string formatting

var obj3DFlyoutCallback = function (workspace) {
    var blockList = []
    const objs = workspace.getVariableMap().getVariablesOfType('obj3D')

    //create button to declare obj3Ds   
    const createObj3DButton = document.createElement('button')
    createObj3DButton.setAttribute('text', 'Create 3D Object...')
    createObj3DButton.setAttribute('callbackKey', 'createObj3DButtonCallback')
    blockList.push(createObj3DButton)

    if(objs.length != 0){

        //add setter for obj3D variables
        const blockSet = Blockly.utils.xml.createElement('block')
        const fieldSetVal = Blockly.utils.xml.createElement('field')
        const fieldSetVar = Blockly.utils.xml.createElement('field')
        blockSet.setAttribute('type', 'variables_set_obj3D')
        fieldSetVal.setAttribute('name', 'VALUE')
        fieldSetVar.setAttribute('name', 'VAR')
        blockSet.appendChild(fieldSetVal)
        blockSet.appendChild(fieldSetVar)
        blockList.push(blockSet)

        for (const obj of objs) {
            //add getters for each variable declared
            const blockGet = Blockly.utils.xml.createElement('block')
            const fieldGet = Blockly.utils.xml.createElement('field')
            blockGet.setAttribute('type', 'variables_get_obj3D')
            fieldGet.setAttribute('name', 'VAR');
            fieldGet.textContent = obj.name

            blockGet.appendChild(fieldGet);
            blockList.push(blockGet);
        }
    }

    return blockList;
};

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
            move: { scrollbars: false, drag: true, wheel: true },
        })

        workspaceRef.current = ws

        ws.registerButtonCallback('createObj3DButtonCallback', (b) => {
            Blockly.Variables.createVariableButtonHandler(b.getTargetWorkspace(), null, 'obj3D');
        })
        ws.registerToolboxCategoryCallback('OBJS_3D', obj3DFlyoutCallback)

        // Compute objects from top-level blocks
        // const syncObjects = () => {
        //     const blocks = ws.getTopBlocks(false)
        //     const objs = []

        //     for (const b of blocks) {
        //         switch (b.type) {
        //             case 'geo_point': {
        //                 const X = +b.getFieldValue('X') || 0
        //                 const Y = +b.getFieldValue('Y') || 0
        //                 const Z = +b.getFieldValue('Z') || 0
        //                 objs.push({ type: 'point', params: { x: X, y: Y, z: Z } })
        //                 break
        //             }
        //             case 'geo_line': {
        //                 const X1 = +b.getFieldValue('X1') || 0
        //                 const Y1 = +b.getFieldValue('Y1') || 0
        //                 const Z1 = +b.getFieldValue('Z1') || 0
        //                 const X2 = +b.getFieldValue('X2') || 0
        //                 const Y2 = +b.getFieldValue('Y2') || 0
        //                 const Z2 = +b.getFieldValue('Z2') || 0
        //                 objs.push({ type: 'line', params: { x1:X1,y1:Y1,z1:Z1,x2:X2,y2:Y2,z2:Z2 } })
        //                 break
        //             }
        //             case 'geo_plane': {
        //                 const NX = +b.getFieldValue('NX') || 0
        //                 const NY = +b.getFieldValue('NY') || 1
        //                 const NZ = +b.getFieldValue('NZ') || 0
        //                 const D  = +b.getFieldValue('D')  || 0
        //                 objs.push({ type: 'plane', params: { nx:NX, ny:NY, nz:NZ, d:D } })
        //                 break
        //             }
        //             case 'geo_vector': {
        //                 const VX = +b.getFieldValue('VX') || 1
        //                 const VY = +b.getFieldValue('VY') || 0
        //                 const VZ = +b.getFieldValue('VZ') || 0
        //                 objs.push({ type: 'vector', params: { vx:VX, vy:VY, vz:VZ } })
        //                 break
        //             }
        //             default:
        //                 break
        //         }
        //     }

        //     onObjectsChange?.(objs)
        // }

        const syncObjects = () => {
            const varMap = ws.getVariableMap().getVariablesOfType('obj3D')
            for(const o of Object.keys(threeObjStore)){
                if(!varMap.some(v => v.name == o)){ //if our obj store contains THREE objects no longer referenced in code,

                    //then they are garbage and we remove them
                    //in practice this never happens, because there is no functionality right now to delete declared obj3D variables
                    delete threeObjStore[o]
                }
            }
            onObjectsChange?.(Object.values(threeObjStore))
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

            generateAndRun(ws)
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