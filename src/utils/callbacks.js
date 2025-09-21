// Callback
import * as Blockly from "blockly/core";

// define the button callback function
const createObj3DButtonHandler = (button) => {
  Blockly.Variables.createVariableButtonHandler(
    button.getTargetWorkspace(),
    null,
    "obj3D"
  );
}


const obj3DFlyoutCallback = (workspace) => {
  var blockList = []
  const objs = workspace.getVariableMap().getVariablesOfType('obj3D')

  const createObj3DButton = document.createElement('button')
  createObj3DButton.setAttribute('text', 'Create 3D Object...')
  createObj3DButton.setAttribute('callbackKey', 'createObj3DButtonCallback')
  blockList.push(createObj3DButton)

  if (objs.length !== 0) {
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
      const blockGet = Blockly.utils.xml.createElement('block')
      const fieldGet = Blockly.utils.xml.createElement('field')
      blockGet.setAttribute('type', 'variables_get_obj3D')
      fieldGet.setAttribute('name', 'VAR')
      fieldGet.textContent = obj.name
      blockGet.appendChild(fieldGet)
      blockList.push(blockGet)
    }
  }

  return blockList
}

export { createObj3DButtonHandler, obj3DFlyoutCallback }

