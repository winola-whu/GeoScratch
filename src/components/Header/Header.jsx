import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// NOTE: we keep your existing example list structure for the lightbulb menu.
// You can add back other examples as needed.
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

/**
 * Props:
 *  - onRun: () => void
 *  - onLoadExample: (xml: string) => void
 *  - autoRender: boolean
 *  - onToggleAutoRender: () => void
 */
export default function Header({ onRun, onLoadExample, autoRender, onToggleAutoRender }) {
  const [showMenu, setShowMenu] = useState(false)

  const handlePickExample = (xml) => {
    onLoadExample?.(xml)
    setShowMenu(false)
  }

  return (
    <div className="grid grid-cols-3 gap-4 px-16 h-full items-center">
      {/* Left controls */}
      <div className="flex gap-8 items-center">
        <div>
          <FontAwesomeIcon icon="fa-solid fa-bars" className="text-2xl cursor-pointer hover:text-sky-700" />
        </div>
        <div>
          <FontAwesomeIcon icon="fa-solid fa-angle-left" className="text-2xl cursor-pointer hover:text-sky-700" />
        </div>
        <div>
          <FontAwesomeIcon icon="fa-solid fa-angle-right" className="text-2xl cursor-pointer hover:text-sky-700" />
        </div>
        <div>
          <p className="text-1xl">Home/Entities</p>
        </div>
      </div>

      {/* Title */}
      <div className="text-center">
        <p className="font-bold text-3xl">Untitled</p>
      </div>

      {/* Right controls */}
      <div className="flex gap-6 justify-end items-center relative">
        {/* Auto Render toggle */}
        <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
          <input
            type="checkbox"
            checked={autoRender}
            onChange={onToggleAutoRender}
          />
          Auto Render
        </label>

        {/* Examples menu */}
        <div className="relative">
          <FontAwesomeIcon
            icon="fa-solid fa-lightbulb"
            className="text-2xl cursor-pointer hover:text-sky-700"
            onClick={() => setShowMenu((open) => !open)}
          />
          {showMenu && (
            <div className="absolute right-0 mt-2 w-60 rounded bg-white text-slate-900 shadow-lg z-10">
              {tutorialExamples.map((item) => (
                <button
                  key={item.label}
                  className="flex w-full px-4 py-2 text-left text-sm hover:bg-slate-100"
                  onClick={() => handlePickExample(item.xml)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Run */}
        <div>
          <FontAwesomeIcon
            icon="fa-solid fa-play"
            className="text-2xl cursor-pointer hover:text-sky-700"
            onClick={() => onRun?.()}
          />
        </div>

        <div>
          <FontAwesomeIcon icon="fa-solid fa-gear" className="text-2xl cursor-pointer hover:text-sky-700" />
        </div>
        <div>
          <FontAwesomeIcon icon="fa-solid fa-circle-info" className="text-2xl cursor-pointer hover:text-sky-700" />
        </div>
        <div>
          <FontAwesomeIcon icon="fa-solid fa-folder-open" className="text-2xl cursor-pointer hover:text-sky-700" />
        </div>
      </div>
    </div>
  )
}
