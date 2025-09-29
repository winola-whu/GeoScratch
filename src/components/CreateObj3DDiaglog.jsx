// src/components/CreateObj3DDialog.jsx
import { useEffect, useRef, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

/**
 * @param {object} props
 * @param {boolean} props.open
 * @param {(open:boolean)=>void} props.onOpenChange
 * @param {import('blockly/core').WorkspaceSvg|null} props.workspace
 */
const CreateObj3DDialog = ({ open, onOpenChange, workspace }) => {
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    if (open) {
      setError('')
      const base = 'obj3D'
      let i = 1
      let candidate = `${base}_${i}`
      try {
        const vm = workspace?.getVariableMap()
        while (vm?.getVariable(candidate, 'obj3D')) {
          i += 1
          candidate = `${base}_${i}`
        }
      } catch {}
      setName(candidate)
      setTimeout(() => inputRef.current?.focus(), 0)
    }
  }, [open, workspace])

  const handleSubmit = () => {
    if (!workspace) return
    const trimmed = (name || '').trim()
    if (!trimmed) {
      setError('Name cannot be empty.')
      return
    }
    const vm = workspace.getVariableMap()
    const exists = vm.getVariable(trimmed, 'obj3D')
    if (exists) {
      setError('A variable with this name already exists.')
      return
    }
    workspace.createVariable(trimmed, 'obj3D')
    onOpenChange(false)
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create 3D Object Variable</DialogTitle>
          <DialogDescription>
            Enter a variable name for an <code>obj3D</code> instance.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 py-2">
          <Label htmlFor="obj3d-name">Variable name</Label>
          <Input
            id="obj3d-name"
            ref={inputRef}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="e.g. obj3D_1"
          />
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CreateObj3DDialog