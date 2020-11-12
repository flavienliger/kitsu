import client from './client'

export default {
  getFile (fileId, callback) {
    return client.getModel('files', fileId)
  },
  getOutputFiles (entity, lastRevision, callback) {
    let path = `/api/data/entities/${entity.id}/output-files`
    if (lastRevision) {
      path += '/last-revisions'
    }
    client.get(path, callback)
  }
}
