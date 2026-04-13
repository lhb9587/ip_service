import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
var  utils = require('./utils/index.js')
const querystring = require("querystring");

NProgress.configure({ showSpinner: false }) // NProgress Configuration
const whiteList = ['/login','/meeting'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      let path = []
      if(Object.keys(to.query).length){
        for (let k in to.query) {
          path.push(k + '=' + to.query[k])
        }
        path = '?' + path.join('&')
      }else{
        path = ''
      }
      to.path != '/workbench/homePage' && localStorage.setItem('historyPath', to.path + path)
      // determine whether the user has obtained his permission roles through getInfo
      // const hasRoles = store.getters.roles && store.getters.roles.length > 0
      const hasPermissions = store.getters.permissions && store.getters.permissions.length > 0
      if(hasPermissions) {
        if(to.matched.length==3){
          const extendpath =await store.dispatch('permission/getNoHiddenRoutes')
          let pathList=to.matched[2].path.split('/')
          if(extendpath.includes(pathList[pathList.length-1])){
            utils.saveFilterModel(to.matched[1].path,'routeHistory',to.path)
          }
        }
        next()
      } else {
        try {
          // get user info
          // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
          await store.dispatch('user/getInfo')//获取用户信息
          const { permissions,domainList } = store.getters
          // generate accessible routes map based on roles
          const accessRoutes = await store.dispatch('permission/generateRoutes', {permissions,domainList})//根据权限生成动态路由
          store.dispatch('user/getTodoTaskNotice');//查询当前全局提醒数量
          // // dynamically add accessible routes
          router.addRoutes(accessRoutes)//将路由合并到路由表中
          // hack method to ensure that addRoutes is complete
          // set the replace: true, so the navigation will not leave a history record
          next({ ...to, replace: true })
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          to.query.redirect = to.path
          next({ path: '/login', query: to.query,replace: true })
          // next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      to.query.redirect = to.path
      next({path: '/login', query: to.query,replace: true })
      NProgress.done()
    }
  }
})

router.afterEach((to, from) => {
  // finish progress bar
  NProgress.done()
})
router.onError((error) => {
  const pattern = /Loading.*?chunk.*?failed/g
  const isChunkLoadFailed = error.message.match(pattern)
  const targetPath = router.history.pending.fullPath
  console.log(error.message)
  console.log(targetPath)
  const errorMsg = 'Failed to fetch dynamically imported module'
  if(error.message.includes(errorMsg)){
    window.location.reload()
  }
  if (isChunkLoadFailed) {
    let reloadUrl = window.location.origin+'/#'+targetPath
    localStorage.setItem('reloadUrl',reloadUrl)
    location.reload(true)
    // window.location.replace(window.location.href)
    //  router.replace(targetPath);
  }
})
