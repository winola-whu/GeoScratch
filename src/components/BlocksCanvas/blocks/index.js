import { initGeometricBlocks } from './geometric'
import { initGeometricVariablesBlocks } from './geometricVariables'
import { initLinalgPrimitivesBlocks } from './linalgPrimitives'

const defineBlocks = () => {
  initGeometricBlocks()
  initGeometricVariablesBlocks()
  initLinalgPrimitivesBlocks()
}

export default defineBlocks
