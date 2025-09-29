import { create } from 'zustand'

const useSceneStore = create((set) => ({
  // The currently rendered object
  objects: [],
  // Object to be rendered
  pendingObjects: [],
  // Automatic rendering switch
  autoRender: true,
  
  // Update the object
  setObjects: (objects) => set({ objects }),
  setPendingObjects: (objects) => set({ pendingObjects: objects }),
  
  // Switch to automatic rendering
  toggleAutoRender: () => set((state) => ({ autoRender: !state.autoRender })),
  
  // Submit rendering
  commitRender: () => set((state) => ({ 
    objects: state.pendingObjects 
  }))
}))

export default useSceneStore