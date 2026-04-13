import {
  login,
  logout,
  getInfo, checkUserPassWord
} from '@/api/user'
import {
  getToken,
  setToken,
  removeToken
} from '@/utils/auth'
import {
  browserRedirect
} from '@/utils'
import {
  resetRouter
} from '@/router'
import { getSum } from '@/api/caseList'
import {MessageBox} from "element-ui";
import store from "@/store";
import Vue from "@/main";
import {queryMonitorResultSum} from "@/api/monitor";
const state = {
  token: getToken(),
  name: '',
  avatar: '',
  roles: [],
  userId: '',
  permissions: '',
  todoTaskNotice: {
    tmBusinessSum: 0
  },
  remindNotice: {
    firstResultSum: 0,
    subjectResultSum: 0,
    deliveryResultSum: 0
  },
  permissionFlag: true,
  hostName: '',
  pattern: localStorage.getItem('pattern')=='true'?true:false,
  corporationName:'',
  domainList:[]
}
const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_USERID: (state, userId) => {
    state.userId = userId
  },
  SET_DOMAINLIST: (state, domainList) => {
    state.domainList = domainList
  },
  SET_PERMISSIONFLAG: (state, flag) => {
    state.permissionFlag = flag
  },
  SET_PERMISSIONS: (state, permissions) => {
    if(state.permissionFlag){
      state.permissions = permissions
    } else {
      state.permissions = Array.from(new Array(300).keys()).slice(0)
    }
  },
  SET_CORPORATIONNAME(state, corporationName){
    state.corporationName=corporationName
  },
  SET_TODOTASKNOTICE: (state, todoTaskNotice) => {
    // let obj={}
    // todoTaskNotice.map(item=>item.data).forEach(item=>{
    //   Object.assign(obj,item)
    // })
    state.todoTaskNotice = {...state.todoTaskNotice, ...todoTaskNotice}
  },
  SET_HOSTNAME(state, hostName){
    state.hostName = hostName
  },
  SET_PATTERN: (state, pattern) => {
    if(pattern===true || pattern === false){
      state.pattern=pattern
      localStorage.setItem('pattern',pattern)
    }else{
      state.pattern = !state.pattern
      localStorage.setItem('pattern',state.pattern )
    }
  },
}

const actions = {
  getMonitorNumData({state}) {
    queryMonitorResultSum().then(res => {
      state.remindNotice = res.data
      const {deliveryResultSum, firstResultSum, subjectResultSum} = res.data
      state.remindNotice.allMonitorResultSum = (deliveryResultSum || 0) + (firstResultSum || 0) + (subjectResultSum || 0)
    })
  },
  // user login
  login({
    commit, dispatch
  }, userInfo) {
    const {
      username,
      password
    } = userInfo
    return new Promise((resolve, reject) => {
      login({
        username: username.trim(),
        password: password,
        mobile: +browserRedirect()
      }).then(response => {
        setToken(response.tokenID)
        commit('knowledgeBase/SET_TOKEN', response.tokenID, { root: true })//16028364027629350
        commit('SET_TOKEN', response.tokenID)
        checkUserPassWord({
          password
        }).then(res => {
          if (res.messageType == -1) {
            const confirmText = res.message.split('\n')
            const newDatas = []
            const h = Vue.$createElement
            for (const i in confirmText) {
              newDatas.push(h('p', null, confirmText[i]))
            }
            MessageBox.confirm(h('div', null, newDatas), '提示', {
              confirmButtonText: '已知晓',
              showCancelButton: false,
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              resolve()
              // store.dispatch('user/resetToken').then(() => {
              //   location.reload()
              // })
            }).catch(() => {
              resolve()
            })
            return
          }
          if (res.messageType == -2) {
            const confirmText = res.message.split('\n')
            const newDatas = []
            const h = Vue.$createElement
            for (const i in confirmText) {
              newDatas.push(h('p', null, confirmText[i]))
            }
            MessageBox.confirm(h('div', null, newDatas), '提示', {
              confirmButtonText: '确定',
              showCancelButton: false,
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              commit('SET_TOKEN', '')
              commit('SET_ROLES', [])
              commit('knowledgeBase/SET_TOKEN', '', { root: true })
              commit('SET_PERMISSIONFLAG', true)
              commit('SET_PERMISSIONS', [])
              removeToken()
              resetRouter()
              reject()
              // store.dispatch('user/resetToken').then(() => {
              //   location.reload()
              // })
            }).catch(() => {
              commit('SET_TOKEN', '')
              commit('SET_ROLES', [])
              commit('knowledgeBase/SET_TOKEN', '', { root: true })
              commit('SET_PERMISSIONFLAG', true)
              commit('SET_PERMISSIONS', [])
              removeToken()
              resetRouter()
              reject()
            })
            return;
          }
          resolve()
        }).catch(err => {
          reject(err)
        })
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({
    commit,
    state,
    dispatch
  }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(async response => {
        const {
          data
        } = response
        console.log(data,111111111);
        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const {
          roles,
          name,
          avatar,
          userId,
          permissions,
          corporationName,
          domainList
        } = data

        // roles must be a non-empty array
        if (permissions.filter(item => item.id !== 0).length <= 0 ) {
          commit('SET_PERMISSIONS', [...permissions.map(item => item.id)])
          commit('SET_TOKEN', '')
          commit('knowledgeBase/SET_TOKEN', '', { root: true })
          removeToken()
          reject('您没有角色和权限 请联系管理员')
          return
        }
        commit('SET_PERMISSIONS', [...permissions.map(item => item.id)])
        commit('SET_ROLES', roles)
        commit('SET_NAME', name)
        commit('SET_CORPORATIONNAME',corporationName)
        commit('SET_AVATAR', avatar)
        commit('SET_USERID', userId)
        commit('SET_DOMAINLIST', domainList)

        commit('SET_HOSTNAME',window.location.hostname)
        !browserRedirect() && dispatch('caseInformation/createSocket', '', { root: true })
        // dispatch('caseInformation/createSocket', '', { root: true })
        // dispatch('talentPool/queryPersonPermissions', userId, { root: true }) // 原人才库权限
        await dispatch('caseInformation/getUser', '', { root: true })
        if(window.location.href.includes('case_detail')){
          dispatch('caseInformation/queryCaseType', '', { root: true }).then(res=>{
            resolve(data)
          })
        } else {
          dispatch('caseInformation/queryCaseType', '', { root: true })
          resolve(data)
        }



      }).catch(error => {
        reject(error)
      })
    })
  },

  browserRedirect() {
    const sUserAgent = window.navigator.userAgent.toLowerCase();
    const bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
    const bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
    const bIsMidp = sUserAgent.match(/midp/i) == "midp";
    const bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
    const bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
    const bIsAndroid = sUserAgent.match(/android/i) == "android";
    const bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
    const bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
    if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
      return true
    } else {
      return false
    }
   },

  // user logout
  logout({
    commit,
    state
  }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        commit('knowledgeBase/SET_TOKEN', '', { root: true })
        commit('SET_PERMISSIONFLAG', true)
        commit('SET_PERMISSIONS', [])
        removeToken()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({
    commit
  }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('knowledgeBase/SET_TOKEN', '', { root: true })
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },
  getTodoTaskNotice({ commit,state, dispatch }) {
    return new Promise((resolve, reject) => {
      dispatch('getMonitorNumData')
      getSum().then((res) => {
        commit('SET_TODOTASKNOTICE', res.data)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
