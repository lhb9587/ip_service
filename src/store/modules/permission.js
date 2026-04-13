import { asyncRoutes, constantRoutes  } from '@/router'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(permissions, route,domainList) {
  if (route.meta && route.meta.domainList){
    return domainList.some(item => route.meta.domainList.includes(item))
  }else if (route.meta && route.meta.permissions) {
    return permissions.some(item => route.meta.permissions.includes(item))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, permissions,domainList) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(permissions, tmp,domainList)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, permissions,domainList)
      }
      res.push(tmp)
    }
  })
  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, {permissions,domainList}) {
    return new Promise(resolve => {
      let accessedRoutes
      if (permissions.includes('系统管理员')) {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, permissions,domainList)// asyncRoutes || []
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes,permissions,domainList)
      }
      let extendpath = []
      var findHasFirstRouter=function(datas){
        for(let item of datas){
          extendpath.push(item.path)
          if(item.children&&item.children.filter(item=>!item.hidden).length){
            findHasFirstRouter(item.children.filter(item=>!item.hidden));
          }
        }
      }
      findHasFirstRouter(accessedRoutes)
      function findIndexArray (data, path, indexArray) {
        let arr = Array.from(indexArray)
        for (let i = 0, len = data.length; i < len; i++) {
          arr.push(data[i].path)
          if (data[i].path === path) {
            return arr
          }
          let children = data[i].children//.filter(item=>!item.hidden)
          if (children && children.length) {
            let result = findIndexArray(children, path, arr)
            if (result) return result
          }
          arr.pop()
        }
        return false
      }
      var str1=''
      extendpath.forEach(itm=>{
        if(findIndexArray(accessedRoutes, itm, []).length==2){
          if(!str1){
            str1= findIndexArray(accessedRoutes, itm, []).join('/')
          }
        }
      })

      var str=''
      extendpath.forEach(itm=>{
        if(findIndexArray(accessedRoutes, itm, []).length==3){
          if(!str){
            str= findIndexArray(accessedRoutes, itm, []).join('/')
          }
        }
      })
      if(str1){
        accessedRoutes[0].redirect=str1
      }else {
        accessedRoutes[0].redirect=str
      }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  },
  getNoHiddenRoutes({ commit,state }) {
    let extendpath = []
    var findHasFirstRouter=function(datas){
      for(let item of datas){
        extendpath.push(item.path)
        if(item.children&&item.children.filter(item=>!item.hidden).length){
          findHasFirstRouter(item.children.filter(item=>!item.hidden));
        }
      }
    }
    findHasFirstRouter(state.addRoutes)
   return  new Promise(resolve => {
      resolve(extendpath)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
