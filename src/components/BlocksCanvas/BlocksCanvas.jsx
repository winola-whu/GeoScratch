 import { useEffect, useRef } from 'react'                                                                                                             
  import { defineBlocks } from './BlocksDefinition'                                                                                                     
  import { generateAndRun, threeObjStore } from './BlocksCodeGen'                                                                                       
  import { TOOLBOX_XML } from './BlocksToolboxDefinition'                                                                                               
  import * as Blockly from 'blockly/core'                                                                                                               
  import * as en from 'blockly/msg/en'                                                                                                                  
  import 'blockly/blocks'                                                                                                                               
  import './BlocksCanvas.css'                                                                                                                           
                                                                                                                                                        
  Blockly.setLocale(en)                                                                                                                                 
                                                                                                                                                        
  var obj3DFlyoutCallback = function (workspace) {                                                                                                      
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
                                                                                                                                                        
  export default function BlocksCanvas({ onObjectsChange, exampleXml, onExampleConsumed }) {                                                            
    const hostRef = useRef(null)                                                                                                                        
    const workspaceRef = useRef(null)                                                                                                                   
                                                                                                                                                        
    useEffect(() => {                                                                                                                                   
      defineBlocks()                                                                                                                                    
                                                                                                                                                        
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
                                                                                                                                                        
      ws.registerButtonCallback('createObj3DButtonCallback', (b) => {                                                                                   
        Blockly.Variables.createVariableButtonHandler(b.getTargetWorkspace(), null, 'obj3D')                                                            
      })                                                                                                                                                
      ws.registerToolboxCategoryCallback('OBJS_3D', obj3DFlyoutCallback)                                                                                
                                                                                                                                                        
      const listener = (e) => {                                                                                                                         
        if (e.isUiEvent) return                                                                                                                         
        generateAndRun(ws)                                                                                                                              
      }                                                                                                                                                 
                                                                                                                                                        
      ws.addChangeListener(listener)                                                                                                                    
      onObjectsChange?.(Object.values(threeObjStore))                                                                                                   
                                                                                                                                                        
      const ro = new ResizeObserver(() => Blockly.svgResize(ws))                                                                                        
      ro.observe(hostRef.current)                                                                                                                       
                                                                                                                                                        
      return () => {                                                                                                                                    
        ws.removeChangeListener(listener)                                                                                                               
        ro.disconnect()                                                                                                                                 
        ws.dispose()                                                                                                                                    
      }                                                                                                                                                 
    }, [onObjectsChange])                                                                                                                               
                                                                                                                                                        
    useEffect(() => {                                                                                                                                   
      const ws = workspaceRef.current                                                                                                                   
      if (!ws || !exampleXml) return                                                                                                                    
                                                                                                                                                        
      try {                                                                                                                                             
        const dom = Blockly.utils.xml.textToDom(exampleXml)                                                                                             
        ws.clear()                                                                                                                                      
        Blockly.Xml.domToWorkspace(dom, ws)                                                                                                             
        generateAndRun(ws)                                                                                                                              
        onObjectsChange?.(Object.values(threeObjStore))                                                                                                 
      } catch (err) {                                                                                                                                   
        console.error('[GeoScratch] failed to load example', err)                                                                                       
      } finally {                                                                                                                                       
        onExampleConsumed?.()                                                                                                                           
      }                                                                                                                                                 
    }, [exampleXml, onObjectsChange, onExampleConsumed])                                                                                                
                                                                                                                                                        
    return (                                                                                                                                            
      <div className="panel panel-left" id="blocks-canvas">                                                                                             
        <div className="blocks-toolbar">                                                                                                                
          <span style={{ opacity: 0.8 }}>Blocks</span>                                                                                                  
        </div>                                                                                                                                          
        <div className="blocks-content" ref={hostRef} />                                                                                                
      </div>                                                                                                                                            
    )                                                                                                                                                   
  }               