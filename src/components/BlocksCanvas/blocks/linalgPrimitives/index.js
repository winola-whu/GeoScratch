import { initVec3Block } from './vector3'
import { initVec4Block } from './vector4'
import { initMat3x3Block } from './mat3x3'
import { initMat4x4Block } from './mat4x4'
import { initRotMatrixBlock } from './rotMatrix'
import { initTransMatrixBlock } from './transMatrix'
import { initScaleMatrixBlock } from './scaleMatrix'
import { initScalarBlock } from './scalar'

export function initLinalgPrimitivesBlocks() {
  initVec3Block()
  initVec4Block()
  initMat3x3Block()
  initMat4x4Block()
  initRotMatrixBlock()
  initTransMatrixBlock()
  initScaleMatrixBlock()
  initScalarBlock()
}
