
import * as Blockly from 'blockly/core'
import { javascriptGenerator, Order } from 'blockly/javascript'

let REGISTERED = false


export function initParametricPlaneBlock() {
  if (REGISTERED) return
  REGISTERED = true

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

javascriptGenerator.forBlock['parametric_plane'] = function (block, generator) {
  const planeDec = `new THREE.Plane(${generator.valueToCode(block, 'norm', Order.FUNCTION_CALL)}, ${generator.valueToCode(block, 'dist', Order.FUNCTION_CALL)})`
  return [planeDec, Order.ATOMIC]
}
}
