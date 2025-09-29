import InitLocale from "./Locale"
import * as en from 'blockly/msg/en'
import * as Blockly from 'blockly/core'
import TOOLBOX_XML from '@/components/BlocksCanvas/toolbox/BlocksToolboxDefinition'


const Workspace = (hostElement) => {
  InitLocale(en)

  return Blockly.inject(hostElement, {
    toolbox: TOOLBOX_XML,
    renderer: 'geras',
    grid: { spacing: 20, length: 3, colour: '#eee', snap: false },
    zoom: { controls: true, wheel: true, startScale: 0.9 },
    trashcan: true,
    theme: Blockly.Themes.Classic,
    move: { scrollbars: true, drag: true, wheel: true },
    scrollbars: true,
  })
}

export default Workspace