import { create } from 'zustand'

const useThreeStore = create((set, get) => ({
  // Storing THREE.js objects
  objects: {},
  
  // Add object
  setObject: (key, object) => {
    set((state) => ({
      objects: { ...state.objects, [key]: object }
    }))
  },
  
  // Clean all objects
  clearObjects: () => set({ objects: {} }),
  
  // Get all object arrays
  getObjectsArray: () => Object.values(get().objects)
}))

export default useThreeStore