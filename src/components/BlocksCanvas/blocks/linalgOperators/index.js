import { initObjectTransformBlock } from "./objectTransform"
import { initVectorTransformBlock } from "./vectorTransform"
import { initVectorArithmeticBlock } from "./vectorArithmetic"
import { initDotProductBlock } from "./dotProduct"
import { initCrossProductBlock } from "./crossProductInplace"
import { initMultiplyInplaceBlock } from "./multiplyInplace"
import { initInverseInplaceBlock } from "./inverseInplace"
import { initDeterminantBlock } from "./determinant"
import { initNormInplaceBlock } from "./normInplace"

export function initLinalgOperatorsBlocks() {
  initObjectTransformBlock()
  initVectorTransformBlock()
  initVectorArithmeticBlock()
  initDotProductBlock()
  initCrossProductBlock()
  initMultiplyInplaceBlock()
  initInverseInplaceBlock()
  initDeterminantBlock()
  initNormInplaceBlock()
}
