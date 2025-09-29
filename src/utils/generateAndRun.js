import { javascriptGenerator } from 'blockly/javascript'
import * as THREE from 'three'
import useThreeStore from '@/store/useThreeStore'

//Actual code gen
export function generateAndRun(workspace){
    javascriptGenerator.addReservedWords('generatedUserCode')
    const generatedUserCode = javascriptGenerator.workspaceToCode(workspace)

    try {
        //may need to pass in threeObjStore
        const threeObjStore = useThreeStore.getState().objects
        const evalContext = { THREE, threeObjStore }
        const evalFunction = new Function('THREE', 'threeObjStore', generatedUserCode)
        evalFunction(THREE, threeObjStore)
    } catch (exception) {
        //
        console.log(exception);
        //alert(exception)
    }
}