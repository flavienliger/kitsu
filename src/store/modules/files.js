import Vue from 'vue'
import filesApi from '../api/files'

import {
  LOAD_OUTPUT_FILES_END
} from '../mutation-types'

const initialState = {
  outputFiles: [],
  lastRevision: false
}

const state = {
  ...initialState
}

const getters = {
  outputFiles: state => state.outputFiles,
  lastRevision: state => state.lastRevision
}

const actions = {
  loadOutputFiles ({ commit, state }, entity) {
    filesApi.getOutputFiles(entity, this.lastRevision, (err, outputFiles) => {
      if (err) console.error(err)
      commit(LOAD_OUTPUT_FILES_END, { entity, outputFiles })
    })
  }
}

const mutations = {
  [LOAD_OUTPUT_FILES_END] (state, { entity, outputFiles }) {
    Vue.set(entity, 'outputFiles', outputFiles)
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
