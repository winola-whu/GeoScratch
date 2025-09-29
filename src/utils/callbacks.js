// Callback
import * as Blockly from 'blockly/core'

// define the button callback function
const createObj3DButtonHandler = (button) => {
  Blockly.Variables.createVariableButtonHandler(
    button.getTargetWorkspace(),
    null,
    'obj3D'
  )
}

/**
 * Pass in an openDialog(ws) function to return a button callback that can be registered to Blockly
 * @param {(ws: Blockly.WorkspaceSvg) => void} openDialogFn
 */
const createObj3DButtonHandlerFactory = (openDialogFn) => {
  return function createObj3DButtonHandler(button) {
    const ws = button.getTargetWorkspace()
    // Open your custom dialog box
    openDialogFn(ws)
  }
}

const obj3DFlyoutCallback = (workspace) => {
  var blockList = []
  const objs = workspace.getVariableMap().getVariablesOfType('obj3D')

  // 1) “Create 3D Object…” Button
  const createObj3DButton = document.createElement('button')
  createObj3DButton.setAttribute('text', 'Create 3D Object...')
  createObj3DButton.setAttribute('callbackKey', 'createObj3DButtonCallback')
  blockList.push(createObj3DButton)

  // 2) When there are variables, stuff the set/get block
  if (objs.length !== 0) {
    const blockSet = Blockly.utils.xml.createElement('block')
    blockSet.setAttribute('type', 'variables_set_obj3D')

    const fieldSetVal = Blockly.utils.xml.createElement('field')
    fieldSetVal.setAttribute('name', 'VALUE')

    const fieldSetVar = Blockly.utils.xml.createElement('field')
    fieldSetVar.setAttribute('name', 'VAR')

    blockSet.appendChild(fieldSetVal)
    blockSet.appendChild(fieldSetVar)
    blockList.push(blockSet)

    for (const obj of objs) {
      const blockGet = Blockly.utils.xml.createElement('block')
      blockGet.setAttribute('type', 'variables_get_obj3D')

      const fieldGet = Blockly.utils.xml.createElement('field')
      fieldGet.setAttribute('name', 'VAR')
      fieldGet.textContent = obj.name

      blockGet.appendChild(fieldGet)
      blockList.push(blockGet)
    }
  }

  return blockList
}

export { createObj3DButtonHandler, obj3DFlyoutCallback, createObj3DButtonHandlerFactory }
