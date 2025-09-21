import initPointBlock  from './points'
import { initVector3Block } from './vector3'
import { initGeoPlaneBlock } from './geoPlane'
import { initParametricPlaneBlock } from './parametricPlane'
import { initGeoSphereBlock } from './geoSphere'

export function initGeometricBlocks() {
  initPointBlock()
  initVector3Block()
  initGeoPlaneBlock()
  initParametricPlaneBlock()
  initGeoSphereBlock()
}
