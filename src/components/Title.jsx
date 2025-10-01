import React, { useState, useEffect, useRef } from 'react'
import useWorkspaceStore from '@/store/useWorkspaceStore'

const Title = () => {
  const { title, setTitle } = useWorkspaceStore()
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(title)
  const inputRef = useRef(null)

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [isEditing])

  const handleSubmit = () => {
    const newTitle = editValue.trim()
    if (newTitle) {
      setTitle(newTitle)
    } else {
      setEditValue(title)
    }
    setIsEditing(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit()
    } else if (e.key === 'Escape') {
      setEditValue(title)
      setIsEditing(false)
    }
  }

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        className="bg-transparent border-b border-gray-300 focus:border-primary outline-none px-2 py-1 text-lg font-medium"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleSubmit}
        onKeyDown={handleKeyDown}
      />
    )
  }

  return (
    <p
      className="font-bold text-3xl"
      onClick={() => setIsEditing(true)}
    >
      {title}
    </p>
  )
}

export default Title