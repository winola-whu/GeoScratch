import { initGeometricBlocks } from './geometric'
import { initGeometricVariablesBlocks } from './geometricVariables'
import { initLinalgPrimitivesBlocks } from './linalgPrimitives'
import { initLinalgOperatorsBlocks } from './linalgOperators'
import { initMeasurementBlocks } from './measurements'

const defineBlocks = () => {
  initGeometricBlocks()
  initGeometricVariablesBlocks()
  initLinalgPrimitivesBlocks()
  initLinalgOperatorsBlocks()
  initMeasurementBlocks()
}

export default defineBlocks
