export class BlockRegistry {
  constructor() {
    this.nextId = 1
    this.byId = new Map()     // id -> { id, obj, srcBlockId }
    this.idBySrc = new Map()  // srcBlockId -> id
    this.order = []           // render order (ids)
  }

  upsertFromSource(srcBlockId, obj3d) {
    let id = this.idBySrc.get(srcBlockId)
    if (!id) {
      id = this.nextId++
      this.idBySrc.set(srcBlockId, id)
      this.order.push(id)
    }
    this.byId.set(id, { id, obj: obj3d, srcBlockId })
    return id
  }

  reconcile(objs) {
    const seen = new Set()
    for (const o of objs) {
      const src = o?.userData?.srcBlockId
      if (!src) continue
      const id = this.upsertFromSource(src, o)
      seen.add(id)
    }
    // remove entries not seen in this run
    const gone = []
    for (const id of this.byId.keys()) if (!seen.has(id)) gone.push(id)
    for (const id of gone) {
      const rec = this.byId.get(id)
      if (rec) this.idBySrc.delete(rec.srcBlockId)
      this.byId.delete(id)
      this.order = this.order.filter(x => x !== id)
    }
  }

  list() {
    return this.order
      .map(id => this.byId.get(id))
      .filter(Boolean)
      .map(({ id, obj, srcBlockId }) => ({ id, obj, srcBlockId }))
  }

  getById(id) { return this.byId.get(id)?.obj || null }
}
