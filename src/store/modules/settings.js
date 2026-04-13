import defaultSettings from '@/settings'

const { showSettings, fixedHeader, sidebarLogo } = defaultSettings

const state = {
  showSettings: showSettings,
  fixedHeader: fixedHeader,
  sidebarLogo: sidebarLogo,
  defaultOpeneds: ['/workbench'],
  toolPosTop: 'top'
}

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
  },
  CHANGE_DEFAULTOPENEDS(state, data){

  },
  CHANG_TOOL_POS(state, data){
    state.toolPosTop = data
    localStorage.setItem('toolPosTop', data)
  }
}

const actions = {
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  },
  changeToolsPos({ commit }, data){
    commit('CHANG_TOOL_POS', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

