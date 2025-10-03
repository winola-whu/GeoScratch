import initPointBlock from './geoPoint.js'
import { initVector3Block } from './geoVectorLine.js'
import initGeoPlaneBlock from './geoPlane'
import initParametricPlaneBlock from './parametricPlane'
import { initGeoSphereBlock } from './geoSphere'

export function initGeometricBlocks() {
  initPointBlock()
  initVector3Block()
  initGeoPlaneBlock()
  initParametricPlaneBlock()
  initGeoSphereBlock()
}
