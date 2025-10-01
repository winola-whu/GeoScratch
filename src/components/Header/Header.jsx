import { useState, useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { loadWorkspace, saveWorkspace } from '../../utils/serialization'
import GuidePopup from '../GuidePopup' 
import useWorkspaceStore from '../../store/useWorkspaceStore'
import Title from '@/components/Title'
import * as Blockly from 'blockly/core'

// Example XMLs (Blockly)
const tutorialExamples = [
  {
    label: 'Example: draw a vector',
    xml: `
      <xml xmlns="https://developers.google.com/blockly/xml">
        <variables>
          <variable obj3D="true" id="vec">v1</variable>
        </variables>
        <block type="variables_set_obj3D" x="24" y="24">
          <field name="VAR">v1</field>
          <value name="VALUE">
            <block type="geo_vector">
              <value name="pos">
                <block type="linalg_vec3">
                  <field name="X">0</field>
                  <field name="Y">0</field>
                  <field name="Z">0</field>
                </block>
              </value>
              <value name="dir">
                <block type="linalg_vec3">
                  <field name="X">1</field>
                  <field name="Y">2</field>
                  <field name="Z">0</field>
                </block>
              </value>
              <value name="scale">
                <block type="scalar">
                  <field name="VAL">3</field>
                </block>
              </value>
            </block>
          </value>
        </block>
      </xml>
    `,
  },
  {
    label: 'Example: random points',
    xml: `
      <xml xmlns="https://developers.google.com/blockly/xml">
        <variables>
          <variable obj3D="true" id="p1">point1</variable>
          <variable obj3D="true" id="p2">point2</variable>
          <variable obj3D="true" id="p3">point3</variable>
        </variables>
        <block type="variables_set_obj3D" x="24" y="24">
          <field name="VAR">point1</field>
          <value name="VALUE">
            <block type="geo_point">
              <value name="pos">
                <block type="linalg_vec3">
                  <field name="X">2</field>
                  <field name="Y">1</field>
                  <field name="Z">0</field>
                </block>
              </value>
            </block>
          </value>
        </block>
        <block type="variables_set_obj3D" x="24" y="80">
          <field name="VAR">point2</field>
          <value name="VALUE">
            <block type="geo_point">
              <value name="pos">
                <block type="linalg_vec3">
                  <field name="X">-1</field>
                  <field name="Y">3</field>
                  <field name="Z">2</field>
                </block>
              </value>
            </block>
          </value>
        </block>
        <block type="variables_set_obj3D" x="24" y="136">
          <field name="VAR">point3</field>
          <value name="VALUE">
            <block type="geo_point">
              <value name="pos">
                <block type="linalg_vec3">
                  <field name="X">1</field>
                  <field name="Y">-2</field>
                  <field name="Z">1</field>
                </block>
              </value>
            </block>
          </value>
        </block>
      </xml>
    `,
  },
  {
    label: 'Example: random spheres',
    xml: `
      <xml xmlns="https://developers.google.com/blockly/xml">
        <variables>
          <variable obj3D="true" id="s1">sphere1</variable>
          <variable obj3D="true" id="s2">sphere2</variable>
        </variables>
        <block type="variables_set_obj3D" x="24" y="24">
          <field name="VAR">sphere1</field>
          <value name="VALUE">
            <block type="geo_sphere">
              <value name="center">
                <block type="linalg_vec3">
                  <field name="X">0</field>
                  <field name="Y">0</field>
                  <field name="Z">0</field>
                </block>
              </value>
              <value name="radius">
                <block type="scalar">
                  <field name="VAL">1.5</field>
                </block>
              </value>
            </block>
          </value>
        </block>
        <block type="variables_set_obj3D" x="24" y="80">
          <field name="VAR">sphere2</field>
          <value name="VALUE">
            <block type="geo_sphere">
              <value name="center">
                <block type="linalg_vec3">
                  <field name="X">3</field>
                  <field name="Y">2</field>
                  <field name="Z">1</field>
                </block>
              </value>
              <value name="radius">
                <block type="scalar">
                  <field name="VAL">0.8</field>
                </block>
              </value>
            </block>
          </value>
        </block>
      </xml>
    `,
  },
  {
    label: 'Example: mixed objects',
    xml: `
      <xml xmlns="https://developers.google.com/blockly/xml">
        <variables>
          <variable obj3D="true" id="obj1">point</variable>
          <variable obj3D="true" id="obj2">sphere</variable>
          <variable obj3D="true" id="obj3">vector</variable>
        </variables>
        <block type="variables_set_obj3D" x="24" y="24">
          <field name="VAR">point</field>
          <value name="VALUE">
            <block type="geo_point">
              <value name="pos">
                <block type="linalg_vec3">
                  <field name="X">1</field>
                  <field name="Y">1</field>
                  <field name="Z">1</field>
                </block>
              </value>
            </block>
          </value>
        </block>
        <block type="variables_set_obj3D" x="24" y="80">
          <field name="VAR">sphere</field>
          <value name="VALUE">
            <block type="geo_sphere">
              <value name="center">
                <block type="linalg_vec3">
                  <field name="X">-2</field>
                  <field name="Y">0</field>
                  <field name="Z">0</field>
                </block>
              </value>
              <value name="radius">
                <block type="scalar">
                  <field name="VAL">1.2</field>
                </block>
              </value>
            </block>
          </value>
        </block>
        <block type="variables_set_obj3D" x="24" y="136">
          <field name="VAR">vector</field>
          <value name="VALUE">
            <block type="geo_vector">
              <value name="pos">
                <block type="linalg_vec3">
                  <field name="X">0</field>
                  <field name="Y">0</field>
                  <field name="Z">0</field>
                </block>
              </value>
              <value name="dir">
                <block type="linalg_vec3">
                  <field name="X">2</field>
                  <field name="Y">-1</field>
                  <field name="Z">1</field>
                </block>
              </value>
              <value name="scale">
                <block type="scalar">
                  <field name="VAL">2.5</field>
                </block>
              </value>
            </block>
          </value>
        </block>
      </xml>
    `,
  },
]

// Default guides (used if JSON not found)
const fallbackGuides = [
  {
    label: 'Point',
    content: 'A point represents a position in 3D space, defined by (x, y, z).',
    link: 'https://mathworld.wolfram.com/Point.html',
  },
  {
    label: 'Vector',
    content: 'A vector has both direction and magnitude.',
    link: 'https://mathinsight.org/vector_introduction',
  },
]

export default function Header({ onRun, onLoadExample, autoRender, onAutoRenderChange }) {
  const [showMenu, setShowMenu] = useState(false)
  const [showCalculator, setShowCalculator] = useState(false)
  const [calculatorPosition, setCalculatorPosition] = useState({ x: 320, y: 80 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [display, setDisplay] = useState('0')
  const [previousValue, setPreviousValue] = useState(null)
  const [operation, setOperation] = useState(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)
  const [guides, setGuides] = useState(fallbackGuides)
  const [selectedGuide, setSelectedGuide] = useState(null)
  const [currentChapter, setCurrentChapter] = useState("Chapter 1 - Basic Geometry")
  const [learningProgress, setLearningProgress] = useState(25)
  const popupRef = useRef(null)

  //grab workspace from zustand store for use with save/load calls
  const ws = useWorkspaceStore((state) => state.workspace)

  // Load external guides.json if available
  useEffect(() => {
    fetch('/math-guides.json')
      .then((res) => res.json())
      .then((data) => setGuides(data))
      .catch(() => {
        console.warn('Using fallback guides')
      })
  }, [])

  // Close popup when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setSelectedGuide(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Drag functionality for calculator
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        setCalculatorPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        })
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, dragOffset])

  const handlePickExample = (xml) => {
    onLoadExample?.(xml)
    setShowMenu(false)
  }

  const handleShowSimpleExample = (exampleType) => {
    console.log('Clicked example:', exampleType)
    console.log('onLoadExample function:', onLoadExample)
    // Simple Blockly XML examples
    const simpleBlockExamples = {
      vector: `
        <xml xmlns="https://developers.google.com/blockly/xml">
          <block type="geo_vector" x="24" y="24">
            <value name="pos">
              <block type="linalg_vec3">
                <field name="X">0</field>
                <field name="Y">0</field>
                <field name="Z">0</field>
              </block>
            </value>
            <value name="dir">
              <block type="linalg_vec3">
                <field name="X">1</field>
                <field name="Y">2</field>
                <field name="Z">0</field>
              </block>
            </value>
            <value name="scale">
              <block type="scalar">
                <field name="VAL">3</field>
              </block>
            </value>
          </block>
        </xml>
      `,
      points: `
        <xml xmlns="https://developers.google.com/blockly/xml">
          <block type="geo_point" x="24" y="24">
            <value name="pos">
              <block type="linalg_vec3">
                <field name="X">1</field>
                <field name="Y">1</field>
                <field name="Z">1</field>
              </block>
            </value>
          </block>
        </xml>
      `,
      spheres: `
        <xml xmlns="https://developers.google.com/blockly/xml">
          <block type="geo_sphere" x="24" y="24">
            <value name="center">
              <block type="linalg_vec3">
                <field name="X">0</field>
                <field name="Y">0</field>
                <field name="Z">0</field>
              </block>
            </value>
            <value name="radius">
              <block type="scalar">
                <field name="VAL">1.5</field>
              </block>
            </value>
          </block>
        </xml>
      `,
      plane: `
        <xml xmlns="https://developers.google.com/blockly/xml">
          <block type="geo_plane" x="24" y="24">
            <value name="normal">
              <block type="linalg_vec3">
                <field name="X">0</field>
                <field name="Y">1</field>
                <field name="Z">0</field>
              </block>
            </value>
            <value name="distance">
              <block type="scalar">
                <field name="VAL">2</field>
              </block>
            </value>
          </block>
        </xml>
      `
    }

    const xml = simpleBlockExamples[exampleType]
    console.log('XML content:', xml)
    if (xml) {
      // Load Blockly XML to workspace
      console.log('About to call onLoadExample')
      onLoadExample?.(xml)
      console.log('Called onLoadExample')
    } else {
      console.log('No corresponding XML found')
    }
    setShowMenu(false)
  }

  const handlePickGuide = (guide) => {
    setSelectedGuide(guide)
    setShowMenu(false)
  }


  const handleCalculatorMouseDown = (e) => {
    if (e.target.closest('button') && !e.target.closest('button[onClick]')) {
      return // Don't drag if clicking on calculator buttons
    }
    setIsDragging(true)
    setDragOffset({
      x: e.clientX - calculatorPosition.x,
      y: e.clientY - calculatorPosition.y
    })
  }

  // Calculator functions
  const inputNumber = (num) => {
    if (waitingForOperand) {
      setDisplay(String(num))
      setWaitingForOperand(false)
    } else {
      setDisplay(display === '0' ? String(num) : display + num)
    }
  }

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.')
      setWaitingForOperand(false)
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.')
    }
  }

  const clear = () => {
    setDisplay('0')
    setPreviousValue(null)
    setOperation(null)
    setWaitingForOperand(false)
  }

  const performOperation = (nextOperation) => {
    const inputValue = parseFloat(display)

    if (previousValue === null) {
      setPreviousValue(inputValue)
    } else if (operation) {
      const currentValue = previousValue || 0
      const newValue = calculate(currentValue, inputValue, operation)

      setDisplay(String(newValue))
      setPreviousValue(newValue)
    }

    setWaitingForOperand(true)
    setOperation(nextOperation)
  }

  const calculate = (firstValue, secondValue, operation) => {
    switch (operation) {
      case '+':
        return firstValue + secondValue
      case '-':
        return firstValue - secondValue
      case '×':
        return firstValue * secondValue
      case '÷':
        return secondValue !== 0 ? firstValue / secondValue : 0
      default:
        return secondValue
    }
  }

  const handleMathFunction = (func) => {
    const value = parseFloat(display)
    let result

    switch (func) {
      case '√':
        result = Math.sqrt(value)
        break
      case 'x²':
        result = value * value
        break
      case 'x³':
        result = value * value * value
        break
      case 'sin':
        result = Math.sin(value * Math.PI / 180)
        break
      case 'cos':
        result = Math.cos(value * Math.PI / 180)
        break
      case 'tan':
        result = Math.tan(value * Math.PI / 180)
        break
      default:
        return
    }

    setDisplay(String(result))
    setWaitingForOperand(true)
  }

  return (
    <div className="grid grid-cols-3 gap-4 px-16 h-full items-center">
      {/* Left controls */}
      <div className="flex gap-8 items-center relative">
        {/* Main Menu */}

        {/* Navigation */}
        <FontAwesomeIcon 
          icon="fa-solid fa-angle-left" 
          className="text-2xl cursor-pointer hover:text-sky-700" 
          title="Previous Lesson"
        />
        <FontAwesomeIcon 
          icon="fa-solid fa-angle-right" 
          className="text-2xl cursor-pointer hover:text-sky-700" 
          title="Next Lesson"
        />
        
      </div>

      {/* Title */}
      <div className="text-center">
        <Title />
      </div>

      {/* Right controls */}
      <div className="flex gap-6 justify-end items-center relative">
      
      <GuidePopup guide={selectedGuide} onClose={() => setSelectedGuide(null)} />
        {/* Auto Render toggle */}
        <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
          <input
            type="checkbox"
            checked={autoRender}
            onChange={(e) => onAutoRenderChange?.(e.target.checked)}
            className="cursor-pointer"
          />
          Auto Render
        </label>

        {/* Lightbulb Menu */}
        <div className="relative">
          <FontAwesomeIcon
            icon="fa-solid fa-lightbulb"
            className="text-2xl cursor-pointer hover:text-sky-700"
            onClick={() => {
              setShowMenu((open) => !open)
              setSelectedGuide(null) // reset guide when reopening menu
            }}
          />
          {showMenu && (
            <div className="absolute right-0 mt-2 w-72 rounded bg-white text-slate-900 shadow-lg z-10">
              {/* Simple Examples */}
              <div className="border-b px-3 py-2 font-semibold text-sm">Simple Examples</div>
              <button
                className="flex w-full px-4 py-2 text-left text-sm hover:bg-slate-100"
                onClick={() => handleShowSimpleExample('vector')}
              >
                🔵 Vector Example
              </button>
              <button
                className="flex w-full px-4 py-2 text-left text-sm hover:bg-slate-100"
                onClick={() => handleShowSimpleExample('points')}
              >
                🔴 Points Example
              </button>
              <button
                className="flex w-full px-4 py-2 text-left text-sm hover:bg-slate-100"
                onClick={() => handleShowSimpleExample('spheres')}
              >
                🟢 Spheres Example
              </button>
                <button
                  className="flex w-full px-4 py-2 text-left text-sm hover:bg-slate-100"
                onClick={() => handleShowSimpleExample('plane')}
                >
                🟦 Plane Example
                </button>

              {/* Guides */}
              <div className="border-t border-b px-3 py-2 font-semibold text-sm">Math Guides</div>
              {guides.map((g) => (
                <button
                  key={g.label}
                  className="flex w-full px-4 py-2 text-left text-sm hover:bg-slate-100"
                  onClick={() => handlePickGuide(g)}
                >
                  {g.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Run Button */}
        {/* <FontAwesomeIcon
          icon="fa-solid fa-play"
          className="text-2xl cursor-pointer hover:text-sky-700"
          onClick={() => onRun?.()}
        /> */}

        
        <FontAwesomeIcon icon="fa-solid fa-file-import" className="text-2xl cursor-pointer hover:text-sky-700" onClick={() => loadWorkspace(ws)} title="Import code"/>
        <FontAwesomeIcon icon="fa-solid fa-file-export" className="text-2xl cursor-pointer hover:text-sky-700" onClick={() => saveWorkspace(ws)} title="Export code"/>
        
        {/* Calculator */}
        <div className="relative">
          <FontAwesomeIcon 
            icon="fa-solid fa-calculator" 
            className="text-2xl cursor-pointer hover:text-sky-700" 
            onClick={() => setShowCalculator(!showCalculator)}
            title="Calculator"
          />
          {showCalculator && (
            <div 
              className="fixed w-80 rounded bg-white text-slate-900 shadow-lg z-50 border cursor-move"
              style={{
                left: `${calculatorPosition.x}px`,
                top: `${calculatorPosition.y}px`
              }}
              onMouseDown={handleCalculatorMouseDown}
            >
              <div className="border-b px-3 py-2 font-semibold text-sm flex justify-between items-center">
                🧮 Calculator
                <button 
                  onClick={() => setShowCalculator(false)}
                  className="text-slate-500 hover:text-slate-700"
                >
                  ✖
                </button>
              </div>
              
              {/* Calculator Display */}
              <div className="p-4">
                <div className="bg-gray-100 p-3 rounded text-right text-lg font-mono mb-3">
                  {display}
                </div>
                
                {/* Calculator Buttons */}
                <div className="grid grid-cols-4 gap-2">
                  <button onClick={clear} className="p-2 bg-gray-200 hover:bg-gray-300 rounded text-sm">C</button>
                  <button className="p-2 bg-gray-200 hover:bg-gray-300 rounded text-sm">±</button>
                  <button className="p-2 bg-gray-200 hover:bg-gray-300 rounded text-sm">%</button>
                  <button onClick={() => performOperation('÷')} className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm">÷</button>
                  
                  <button onClick={() => inputNumber(7)} className="p-2 bg-gray-200 hover:bg-gray-300 rounded text-sm">7</button>
                  <button onClick={() => inputNumber(8)} className="p-2 bg-gray-200 hover:bg-gray-300 rounded text-sm">8</button>
                  <button onClick={() => inputNumber(9)} className="p-2 bg-gray-200 hover:bg-gray-300 rounded text-sm">9</button>
                  <button onClick={() => performOperation('×')} className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm">×</button>
                  
                  <button onClick={() => inputNumber(4)} className="p-2 bg-gray-200 hover:bg-gray-300 rounded text-sm">4</button>
                  <button onClick={() => inputNumber(5)} className="p-2 bg-gray-200 hover:bg-gray-300 rounded text-sm">5</button>
                  <button onClick={() => inputNumber(6)} className="p-2 bg-gray-200 hover:bg-gray-300 rounded text-sm">6</button>
                  <button onClick={() => performOperation('-')} className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm">-</button>
                  
                  <button onClick={() => inputNumber(1)} className="p-2 bg-gray-200 hover:bg-gray-300 rounded text-sm">1</button>
                  <button onClick={() => inputNumber(2)} className="p-2 bg-gray-200 hover:bg-gray-300 rounded text-sm">2</button>
                  <button onClick={() => inputNumber(3)} className="p-2 bg-gray-200 hover:bg-gray-300 rounded text-sm">3</button>
                  <button onClick={() => performOperation('+')} className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm">+</button>
                  
                  <button onClick={() => inputNumber(0)} className="p-2 bg-gray-200 hover:bg-gray-300 rounded text-sm col-span-2">0</button>
                  <button onClick={inputDecimal} className="p-2 bg-gray-200 hover:bg-gray-300 rounded text-sm">.</button>
                  <button onClick={() => performOperation('=')} className="p-2 bg-green-500 hover:bg-green-600 text-white rounded text-sm">=</button>
                </div>
                
                {/* Math Functions */}
                <div className="mt-3 pt-3 border-t">
                  <div className="text-xs text-gray-600 mb-2">Math Functions</div>
                  <div className="grid grid-cols-3 gap-1">
                    <button onClick={() => handleMathFunction('√')} className="p-1 bg-purple-100 hover:bg-purple-200 rounded text-xs">√</button>
                    <button onClick={() => handleMathFunction('x²')} className="p-1 bg-purple-100 hover:bg-purple-200 rounded text-xs">x²</button>
                    <button onClick={() => handleMathFunction('x³')} className="p-1 bg-purple-100 hover:bg-purple-200 rounded text-xs">x³</button>
                    <button onClick={() => handleMathFunction('sin')} className="p-1 bg-purple-100 hover:bg-purple-200 rounded text-xs">sin</button>
                    <button onClick={() => handleMathFunction('cos')} className="p-1 bg-purple-100 hover:bg-purple-200 rounded text-xs">cos</button>
                    <button onClick={() => handleMathFunction('tan')} className="p-1 bg-purple-100 hover:bg-purple-200 rounded text-xs">tan</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
