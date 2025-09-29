import { useState, useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import GuidePopup from '../GuidePopup' 

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

export default function Header({ onRun, onLoadExample, autoRender, onToggleAutoRender }) {
  const [showMenu, setShowMenu] = useState(false)
  const [guides, setGuides] = useState(fallbackGuides)
  const [selectedGuide, setSelectedGuide] = useState(null)
  const popupRef = useRef(null)

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

  const handlePickExample = (xml) => {
    onLoadExample?.(xml)
    setShowMenu(false)
  }

  const handlePickGuide = (guide) => {
    setSelectedGuide(guide)
    setShowMenu(false)
  }

  return (
    <div className="grid grid-cols-3 gap-4 px-16 h-full items-center">
      {/* Left controls */}
      <div className="flex gap-8 items-center">
        <FontAwesomeIcon icon="fa-solid fa-bars" className="text-2xl cursor-pointer hover:text-sky-700" />
        <FontAwesomeIcon icon="fa-solid fa-angle-left" className="text-2xl cursor-pointer hover:text-sky-700" />
        <FontAwesomeIcon icon="fa-solid fa-angle-right" className="text-2xl cursor-pointer hover:text-sky-700" />
        <p className="text-1xl">Home/Entities</p>
      </div>

      {/* Title */}
      <div className="text-center">
        <p className="font-bold text-3xl">Untitled</p>
      </div>

      {/* Right controls */}
      <div className="flex gap-6 justify-end items-center relative">
      
      <GuidePopup guide={selectedGuide} onClose={() => setSelectedGuide(null)} />
        {/* Auto Render toggle */}
        <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
          <input
            type="checkbox"
            checked={autoRender}
            onChange={(e) => onToggleAutoRender?.(e.target.checked)}
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
              {/* Examples */}
              <div className="border-b px-3 py-2 font-semibold text-sm">Examples</div>
              {tutorialExamples.map((item) => (
                <button
                  key={item.label}
                  className="flex w-full px-4 py-2 text-left text-sm hover:bg-slate-100"
                  onClick={() => handlePickExample(item.xml)}
                >
                  {item.label}
                </button>
              ))}

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

        <FontAwesomeIcon icon="fa-solid fa-gear" className="text-2xl cursor-pointer hover:text-sky-700" />
        <FontAwesomeIcon icon="fa-solid fa-circle-info" className="text-2xl cursor-pointer hover:text-sky-700" />
        <FontAwesomeIcon icon="fa-solid fa-folder-open" className="text-2xl cursor-pointer hover:text-sky-700" />
      </div>

      
    </div>
  )
}
