import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
import workRouter from './modules/workbench'
export const constantRoutes = [{
  path: '/login',
  component: () => import('@/views/login/index'),
  hidden: true
},
  {
    path: '/workbench/itinerary_detail',
    component: () => import('@/views/workbench/itinerary/DetailH5.vue'),
    name: 'itinerary_detail',
    meta: {
      title: '日程安排',
      keepAlive: false,
      icon:'dashboard'
    },
    hidden: true
  },
  {
    path: '/workbench/itinerary_list',
    component: () => import('@/views/workbench/itinerary/ListH5.vue'),
    name: 'itinerary_list',
    meta: {
      title: '日程安排',
      keepAlive: false,
      icon:'dashboard'
    },
    hidden: true
  },
{
  path: '/meeting',
  component: () => import('@/views/workbench/meeting'), // Parent router-view
  name: 'meeting',
  meta: {
    keepAlive: true,
    title: '会议',
    icon: 'icon/配置管理2@2x.png',
  },
  hidden: true,
},
{
  path: '/preView',
  component: () => import('@/components/PreView'),
  hidden: true
},
{
  path: '/404',
  component: () => import('@/views/404'),
  hidden: true
},
{
  path: '/',
  component: Layout,
  redirect: '/workbench',
  children: [{
    path: 'dashboard',
    name: 'Dashboard',
    component: () => import('@/views/workbench/toDoTasks/index'),
    meta: {
      title: '首页',
      icon: 'dashboard'
    },
    hidden: true

  }]
},
{
  path: '/userCenter',
  component: Layout,
  redirect: '/workbench/userCenter',
  // meta: {
  //   title: '个人中心',
  //   icon: 'dashboard'
  // },
  hidden: true,
  children: [{
    path: 'userCenter',
    name: 'userCenter',
    component: () => import('@/views/login/userCenter'),
    meta: {
      title: '个人中心',
      icon: 'dashboard'
    },
    hidden: true

  }]
},
{
  path: '*',
  component: () => import('@/views/404'),
  hidden: true
},
{
  path: '/workbench/exmaine_apply',
  component: () => import('@/views/workbench/hrm/approval_management/ExamineH5.vue'),
  name: 'exmaine_apply',
  meta: {
    title: '审批申请',
    keepAlive: true,
    icon: '申请',
  }
},

]

export const asyncRoutes = [workRouter]

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({
      y: 0
    }),
    routes: constantRoutes
  })

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
