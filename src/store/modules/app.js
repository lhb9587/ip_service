import Cookies from 'js-cookie'
var ua = navigator.userAgent;

var ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
  isIphone =!ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
  isAndroid = ua.match(/(Android)\s+([\d.]+)/),
  isMobile = isIphone || isAndroid;
  if(isMobile){
    if(window.location.pathname=='/'){
   //   window.location.replace('/mobileTerminal')
    }
  }
const state = {
  sidebar: {
    opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
    withoutAnimation: true,
    hovered: false
  },
  device: 'desktop',
  isMobile: isMobile,
  isFullScreen: false,
  hideChartId: [],
  panelsData: {
    chartList: [],
    chartCheckList: []
  },
  panelsRefresh: false,
  highLightValue: '',
  highLightFlag: 0,
  highLightList: []
}

const mutations = {
    SET_HIGH_LIGHT: (state, value) => {
      state.highLightValue = value
      state.highLightFlag++
    },
    SET_HIGHT_LIST: (state, value) => {
      if (value) {
        state.highLightList = [...new Set([...state.highLightList, value])]
      } else {
        state.highLightList = []
      }
    },
    SET_FULLSCREEN_STATE: (state, value) => {
      state.isFullScreen = value
    },
    SET_HIDE_CHART: (state, data) => {
      state.hideChartId.push(data)
      // state.panelsData.chartList = state.panelsData.chartList.filter(item => item.configId != data)
      // state.panelsData.chartCheckList = state.panelsData.chartCheckList.filter(item => item != data)
    },
  SET_PANELS_REFRESH: (state, data) => {
    state.panelsRefresh = data
  },
  SET_PANELS_DATA: (state, data) => {
    state.panelsData.chartList = data.chartList
    state.panelsData.chartCheckList = data.chartCheckList
  },
  HOVER_SIDEBAR: state => {
    state.sidebar.hovered = true
  },
  UNHOVER_SIDEBAR: state => {
    state.sidebar.hovered = false
  },
  TOGGLE_SIDEBAR: (state, flag) => {
    if (flag === true || flag === false) {
      state.sidebar.opened = flag
    } else {
      state.sidebar.opened = !state.sidebar.opened
    }

    state.sidebar.withoutAnimation = true
    if (state.sidebar.opened) {
      Cookies.set('sidebarStatus', 1)
    } else {
      Cookies.set('sidebarStatus', 0)
    }
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set('sidebarStatus', 0)
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  },
  CLOSE_SIDEBAR1:() => {
    state.sidebar.opened = false
  }
}

const actions = {
  hoverSideBar({
    commit
  }) {
    commit('HOVER_SIDEBAR')
  },
  unhoverSideBar({
    commit
  }) {
    commit('UNHOVER_SIDEBAR')
  },
  toggleSideBar({
    commit
  }) {
    commit('TOGGLE_SIDEBAR')
  },
  closeSideBar({
    commit
  }, {
    withoutAnimation
  }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
  },
  toggleDevice({
    commit
  }, device) {
    commit('TOGGLE_DEVICE', device)
  },
  closeSideBar1({
    commit
  }) {
    commit('CLOSE_SIDEBAR1')
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
