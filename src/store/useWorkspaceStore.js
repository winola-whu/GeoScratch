import { create } from 'zustand'

const useWorkspaceStore = create((set) => ({
  // Blockly workspace instance
  workspace: null,
  // Create Object Dialog Status
  dialogOpen: false,
  // Example XML
  exampleXml: null,
  
  setWorkspace: (ws) => set({ workspace: ws }),
  setDialogOpen: (open) => set({ dialogOpen: open }),
  setExampleXml: (xml) => set({ exampleXml: xml }),
  
  // Cleanup Example XML
  clearExampleXml: () => set({ exampleXml: null })
}))

export default useWorkspaceStore