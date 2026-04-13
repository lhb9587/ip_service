/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'
const workRouter = {
  path: '/workbench',
  component: Layout,
  redirect: '/workbench/homePage',
  // redirect: '/workbench/timeLimit',
  name: 'workbench',
  meta: {
    // title: '工作台',
    // icon: 'nested',
    // permissions: ['工作台', '系统管理员'],
  },
  children: [
    {
      path: 'userCenter',
      name: 'userCenter',
      component: () => import('@/views/login/userCenter'),
      meta: {
        title: '个人中心',
        icon: 'dashboard'
      },
      hidden: true
    },
    {
      path: 'homePage',
      component: () => import('@/views/homePage/index'), // Parent router-view
      name: 'homePage',
      meta: {
        title: '首页',
         icon: '首页',
        // keepAlive: true
      },
    },
    {
      path: 'trademark',
      component: () => import('@/views/workbench/trademark/index'), // Parent router-view
      name: 'trademark',
      redirect: '/workbench/trademark/trademark_list',
      meta: {
        title: '商标'
        // icon: 'icon/待办@2x.png',
        // permissions: ['待办任务']
      },
      hidden: true,
      children: [{
          path: 'trademark_list/:custId/:custname',
          component: () => import('@/views/workbench/trademark/trademark_list'), // Parent router-view
          name: 'trademark_list',
          meta: {
            title: '商标列表'
            // icon: 'icon/待办@2x.png',
            //  permissions: ['待办任务']
          },
          hidden: true
        },
        {
          path: 'trademark_detail/:tmId',
          component: () => import('@/views/workbench/trademark/trademark_detail'), // Parent router-view
          name: 'trademark_detail',
          meta: {
            title: '商标详情'
            // icon: 'icon/待办@2x.png',
            //  permissions: ['待办任务']
          },
          hidden: true
        }
      ]
    },
    // {
    //   path: 'finance_bill',
    //   component: () => import('@/views/workbench/finance_two/finance_bill'),
    //   name: 'finance_bill',
    //   meta: {
    //     title: '账单',
    //     icon: 'icon/账单.png',
    //     keepAlive: true,
    //     path: 'finance_bill',
    //     permissions: [22]
    //   },
    //   topHidden: true,
    //   finance: true,
    // },
    // {
    //   path: 'finance_inside_bill',
    //   component: () => import('@/views/workbench/finance_two/finance_inside_bill'),
    //   name: 'finance_inside_bill',
    //   meta: {
    //     title: '内部账单',
    //     icon: 'icon/内部账单.png',
    //     keepAlive: true,
    //     path: 'finance_inside_bill',
    //     permissions: [22]
    //   },
    //   topHidden: true,
    //   finance: true,
    // },
    // {
    //   path: 'finance_traw_sheet',
    //   component: () => import('@/views/workbench/finance_two/finance_traw_sheet'),
    //   name: 'finance_traw_sheet',
    //   meta: {
    //     title: '草单',
    //     icon: 'icon/草单.png',
    //     keepAlive: true,
    //     path: 'finance_traw_sheet',
    //     permissions: [22]
    //   },
    //   topHidden: true,
    //   finance: true,
    // },
    {
      path: 'finance_bill_manager',
      component: () => import('@/views/workbench/finance_two/finance_bill_manager'),
      redirect: 'finance_invoice_opener',
      name: 'finance_bill',
      meta: {
        title: '账单管理',
        icon: 'icon/账单管理.png',
        keepAlive: true,
         path: 'finance_bill_manager',
        permissions: [22]
      },
      topHidden: true,
      finance: true,
      children: [
        {
          path: 'finance_bill',
          component: () => import('@/views/workbench/finance_two/finance_bill'),
          name: 'finance_bill',
          meta: {
            title: '账单',
            icon: 'icon/账单.png',
            keepAlive: true,
            path: 'finance_bill',
            permissions: [84]
          },
          topHidden: true,
          finance: true,
        },
        {
          path: 'finance_inside_bill',
          component: () => import('@/views/workbench/finance_two/finance_inside_bill'),
          name: 'finance_inside_bill',
          meta: {
            title: '内部账单',
            icon: 'icon/内部账单.png',
            keepAlive: true,
            path: 'finance_inside_bill',
            permissions: [85]
          },
          topHidden: true,
          finance: true,
        },
        {
          path: 'finance_traw_sheet',
          component: () => import('@/views/workbench/finance_two/finance_traw_sheet'),
          name: 'finance_traw_sheet',
          meta: {
            title: '草单',
            icon: 'icon/草单.png',
            keepAlive: true,
            path: 'finance_traw_sheet',
            permissions: [86]
          },
          topHidden: true,
          finance: true,
        },
      ]
    },
    {
      path: 'finance_fee',
      component: () => import('@/views/workbench/finance_two/finance_fee'),
      name: 'finance_fee',
      meta: {
        title: '费用',
        icon: 'icon/费用.png',
        keepAlive: true,
        path: 'finance_fee',
        permissions: [23]
      },
      topHidden: true,
      finance: true,
    },
    {
      path: 'finance_fee_detail',
      component: () => import('@/views/workbench/finance_two/finance_fee_detail'),
      name: 'finance_fee_detail',
      meta: {
        title: '费用明细',
        icon: 'icon/费用明细.png',
        keepAlive: true,
        path: 'finance_fee_detail',
        permissions: [333]
      },
      topHidden: true,
      finance: true,
    },
    {
      path: 'finance_collect',
      component: () => import('@/views/workbench/finance_two/finance_collect'),
      name: 'finance_collect',
      meta: {
        title: '收款管理',
        icon: 'icon/收款.png',
        keepAlive: true,
        path: 'finance_collect',
        permissions: [302]
      },
      topHidden: true,
      finance: true,
    },
    {
      path: 'finance_statement',
      component: () => import('@/views/workbench/finance_two/finance_statement'),
      name: 'finance_statement',
      meta: {
        title: '财务对账',
        icon: 'icon/财务.png',
        keepAlive: true,
        path: 'finance_statement',
        permissions: [326]
      },
      topHidden: true,
      finance: true,
    },
    {
      path: 'finance_invoice',
      component: () => import('@/views/workbench/finance_two/finance_invoice'),
      redirect: 'finance_invoice_opener',
      name: 'finance_invoice',
      meta: {
        title: '发票管理',
        icon: 'icon/发票.png',
        keepAlive: true,
         path: 'finance_invoice',
        // permissions: [8]
      },
      topHidden: true,
      finance: true,
      children: [
        {
          path: 'finance_invoice_opener',
          component: () => import('@/views/workbench/finance_two/finance_invoice/finance_invoice_opener'),
          name: 'finance_invoice_opener',
          meta: {
            title: '开具发票',
            icon: 'icon/开具发票.png',
            keepAlive: true,
            path: 'finance_invoice_opener',
            permissions: [213]
          },
          topHidden: true,
          finance: true,
        },
        {
          path: 'finance_invoice_borrow',
          component: () => import('@/views/workbench/finance_two/finance_invoice/finance_invoice_borrow'),
          name: 'finance_invoice_borrow',
          meta: {
            title: '入账发票外借',
            icon: 'icon/发票外借.png',
            keepAlive: true,
            path: 'finance_invoice_borrow',
            // permissions: [306] // IPSERVICE-4248 任务关闭
          },
          topHidden: true,
          finance: true,
        },
        {
          path: 'finance_invoice_library',
          component: () => import('@/views/workbench/finance_two/finance_invoice/finance_invoice_library'),
          name: 'finance_invoice_library',
          meta: {
            title: '发票库',
            icon: 'icon/发票库.png',
            keepAlive: true,
            path: 'finance_invoice_library',
          },
          topHidden: true,
          finance: true,
        }
      ]
    },
    {
      path: 'finance_borrow',
      component: () => import('@/views/workbench/finance_two/finance_borrow'),
      name: 'finance_borrow',
      meta: {
        title: '借款管理',
        icon: 'icon/借款.png',
        keepAlive: true,
        path: 'finance_borrow',
        permissions: [309]
      },
      topHidden: true,
      finance: true,
    },
    {
      path: 'finance_report',
      component: () => import('@/views/workbench/finance_two/finance_report'),
      redirect: 'finance_report_form',
      name: 'finance_report',
      meta: {
        title: '报表中心',
        icon: 'icon/报表.png',
        keepAlive: true,
        path: 'finance_report',
        permissions: [313]
      },
      topHidden: true,
      finance: true,
      children: [
        {
          path: 'finance_report_form',
          component: () => import('@/views/workbench/finance_two/finance_report/finance_report_form'),
          name: 'finance_report_form',
          meta: {
            title: '报表',
            icon: 'icon/财务报表.png',
            keepAlive: true,
            path: 'finance_report_form',
            permissions: [313]
          },
          topHidden: true,
          finance: true,
        },
        {
          path: 'finance_report_manage',
          component: () => import('@/views/workbench/finance_two/finance_report/finance_report_manage'),
          name: 'finance_report_manage',
          meta: {
            title: '报表管理',
            icon: 'icon/报表管理.png',
            keepAlive: true,
            path: 'finance_report_manage',
            permissions: [323]
          },
          topHidden: true,
          finance: true,
        },
        {
          path: 'finance_report_company',
          component: () => import('@/views/workbench/finance_two/finance_report/finance_report_company'),
          name: 'finance_report_company',
          meta: {
            title: '主体管理',
            icon: 'icon/公司管理.png',
            keepAlive: true,
            path: 'finance_report_company',
            permissions: [324]
          },
          topHidden: true,
          finance: true,
        },
        {
          path: 'finance_report_account',
          component: () => import('@/views/workbench/finance_two/finance_report/finance_report_account'),
          name: 'finance_report_account',
          meta: {
            title: '账户管理',
            icon: 'icon/账户管理.png',
            keepAlive: true,
            path: 'finance_report_account',
            permissions: [322]
          },
          topHidden: true,
          finance: true,
        }
      ]
    },
    {
      path: 'finance_patent_fee',
      component: () => import('@/views/workbench/finance_two/finance_patent_fee'),
      name: 'finance_patent_fee',
      meta: {
        title: '官费缴纳',
        keepAlive: true,
        path: 'finance_patent_fee',
        permissions: [346],
        icon:'icon/官费.png',
      },
      topHidden: true,
      finance: true,
    },
    {
      path: 'finance_outside_price',
      component: () => import('@/views/workbench/finance_two/finance_outside_price'),
      name: 'finance_outside_price',
      meta: {
        title: '境外报价',
        permissions: [291],
        keepAlive: true,
        path: 'finance_outside_price',
        icon:'icon/境外报价.png',
      },
      topHidden: true,
      finance: true,
    },
    {
      path: 'finance_outside_bill',
      component: () => import('@/views/workbench/finance_two/finance_outside_bill'),
      name: 'finance_outside_bill',
      meta: {
        title: '境外账单',
        permissions: [228],
        path: 'finance_outside_bill',
        keepAlive: true,
        icon:'icon/境外账单.png'
      },
      topHidden: true,
      finance: true,
    },
    {
      path: 'finance_exchange_rate',
      component: () => import('@/views/workbench/finance_two/exchange_rate_manager'),
      name: 'finance_exchange_rate',
      meta: {
        title: '汇率设置',
        permissions: [422],
        path: 'finance_exchange_rate',
        keepAlive: false,
        icon:'icon/汇率设置.png'
      },
      topHidden: true,
      finance: true,
    },
    // {
    //   path: 'finance_panel',
    //   component: () => import('@/views/workbench/finance_two/finance_panel'),
    //   name: 'finance_panel',
    //   meta: {
    //     title: '数据仪表盘',
    //     icon: 'icon/仪表盘.png',
    //     keepAlive: true,
    //     path: 'finance_panel',
    //     // permissions: [8]
    //   },
    //   topHidden: true,
    //   finance: true,
    // },
    // {
    //   path: 'finance_ledger',
    //   component: () => import('@/views/workbench/finance_two/finance_ledger'),
    //   name: 'finance_ledger',
    //   meta: {
    //     title: '总账',
    //     icon: 'icon/总账.png',
    //     keepAlive: true,
    //     path: 'finance_ledger',
    //     // permissions: [8]
    //   },
    //   topHidden: true,
    //   finance: true,
    // },
    // {
    //   path: 'finance_settle',
    //   component: () => import('@/views/workbench/finance_two/finance_settle'),
    //   name: 'finance_settle',
    //   meta: {
    //     title: '结账',
    //     icon: 'icon/结账.png',
    //     keepAlive: true,
    //     path: 'finance_settle',
    //     // permissions: [8]
    //   },
    //   topHidden: true,
    //   finance: true,
    // },
    // {
    //   path: 'finance_capital',
    //   component: () => import('@/views/workbench/finance_two/finance_capital'),
    //   name: 'finance_capital',
    //   meta: {
    //     title: '资金管理',
    //     icon: 'icon/资金管理.png',
    //     keepAlive: true,
    //     path: 'finance_capital'
    //     // permissions: [8]
    //   },
    //   topHidden: true,
    //   finance: true,
    // },
    {
      path: 'timeLimit',
      component: () => import('@/views/workbench/toDoTasks/timeLimit'), // Parent router-view
      name: 'timeLimit',
      meta: {
        keepAlive: true,
        title: '时限',
        icon: 'icon/配置管理2@2x.png',
        permissions: [9]
      },
      topHidden: true,
    },
    {
        path: 'toDoTask',
        component: () => import('@/views/workbench/toDoTasks/toDoTasks'), // Parent router-view
        name: 'toDoTasksChildren',
        meta: {
          title: '待办',
          icon: 'icon/待办@2x.png',
           keepAlive: true,
          permissions: [8]
        },
        topHidden: true,
      },
        {
          path: 'business_opportunity',
          component: () =>
            import('@/views/workbench/customer_management/business_pportunity'),
          name: 'business_pportunity',
          meta: {
            title: '商机',
            icon: 'icon/数据1@2x.png',
            permissions: [259],
            keepAlive: true,
          },
          topHidden: true,
        },
        {
          path: 'monitor_management',
          component: () =>
            import('@/views/workbench/customer_management/monitor_management'),
          name: 'monitor_management',
          meta: {
            title: '商标监控',
            icon: 'icon/商标监控.png',
            permissions: [421],
            keepAlive: false,
          },
          topHidden: true,
        },
        {
          path: 'autoWrite',
          component: () =>
            import('@/views/workbench/customer_management/autoWrite'),
          name: 'autoWrite',
          meta: {
            title: '自动撰写',
            icon: 'icon/自动撰写.png',
            permissions: [511],
            keepAlive: false,
          },
          topHidden: true,
        },
        {
          path: 'createTimeLimit',
          component: () => import('@/views/workbench/toDoTasks/createTimeLimit'),
          name: 'createTimeLimit',
          meta: {
            title: '新建时限',
          },
          hidden: true
        },
        {
          path: 'modifyTimeLimit/:tltId',
          component: () => import('@/views/workbench/toDoTasks/modifyTimeLimit'),
          name: 'modifyTimeLimit',
          meta: {
            title: '修改时限'
          },
          hidden: true
        },
        {
          path: 'seeTimeLimit/:tltId',
          component: () => import('@/views/workbench/toDoTasks/seeTimeLimit'),
          name: 'seeTimeLimit',
          meta: {
            title: '查看时限'
          },
          hidden: true
        }
    ,
    {
      path: 'homePageAdd/type',
      component: () => import('@/views/homePage/homePageAdd'), // Parent router-view
      name: 'homePage',
      meta: {
        title: '内容添加',
        icon: '首页',
        // keepAlive: true
      },
      hidden:true
    },
    {
      path: 'historyDetail',
      component: () => import('@/views/homePage/historyDetail'), // Parent router-view
      name: 'historyDetail',
      meta: {
        title: '更新记录',
        icon: '首页',
        // keepAlive: true
      },
      hidden: true
    },
    {
      path: 'case',
      component: () => import('@/views/workbench/case/index'), // Parent router-view
      name: 'case',
      meta: {
        title: '案件',
        // icon: 'icon/案件21@2x.png',
        icon: 'case_icon',
        permissions: [3],
        // keepAlive: true
      },
      redirect: '/workbench/case/case_management',
      children: [{
          path: 'registration',
          component: () =>
            import('@/views/workbench/case/case_management/registration'),
          name: 'registration',
          meta: {
            title: '立卷',
            permissions: [18],
            icon: '立案'
          }
        },
        {
          path: 'divisionCase',
          component: () =>
            import('@/views/workbench/case/case_management/divisionCase'),
          name: 'divisionCase',
          meta: {
            title: '分案',
            //  permissions: [20],
            // keepAlive: true,
            //  icon: 'tree'

          },
          hidden: true
        },
        {
          path: 'transferCase/:draftNumber',
          component: () =>
            import('@/views/workbench/case/case_management/transferCase'),
          name: 'transferCase',
          meta: {
            title: '立卷'
            // icon: 'tree'
          },
          hidden: true
        },
        {
          path: 'massfiling',
          component: () =>
            import('@/views/workbench/case/case_management/massfiling'),
          name: 'massfiling',
          meta: {
            title: '批量立卷'
            //  icon: 'tree'
          },
          hidden: true
        },
        {
          path: 'case_detail/:id/:caseType*',
          component: () => import('@/views/workbench/case/case_detail'),
          name: 'case_detail',
          meta: {
            title: '案件详情'
            //  icon: 'tree'
          },
          hidden: true
        },
        {
          path: 'preFilingPush/:type',
          component: () =>
            import(
              '@/views/workbench/case/preFiling/components/preFilingPush.vue'
            ),
          name: 'preFilingPush',
          meta: {
            title: '预立卷审批提交',
            icon: 'tree'
          },
          hidden: true
        },
        {
          path: 'officialSubmission',
          component: () => import('@/views/workbench/case/officialSubmission'),
          name: 'officialSubmission',
          meta: {
            title: '递交官方',
            permissions: [19],
            // keepAlive: true,
              icon: '递交'
          },
          hidden: true
        },
        // {
        //   path: 'detailSubmission',
        //   component: () =>
        //     import(
        //       '@/views/workbench/case/officialSubmission/officialSubmission'
        //     ),
        //   name: 'detailSubmission',
        //   meta: {
        //     title: '递交官方详情',
        //     icon: 'tree'
        //   },
        //   hidden: true
        // },
        {
          path: 'officialCommunication',
          component: () =>
            import('@/views/workbench/case/officialCommunication'),
          name: 'officialCommunication',
          meta: {
            title: '官方通知',
            permissions: [20],
            // keepAlive: true,
            icon: '官方'
          },
          hidden: true
        },
        {
          path: 'officialDocuments',
          component: () =>
            import('@/views/workbench/case/components/OfficialDocuments'),
          name: 'officialDocuments',
          meta: {
            title: '官文录入',
          },
          hidden: true
        },
        {
          path: 'case_management',
          component: () => import('@/views/workbench/case/case_management'),
          name: 'case_management',
          meta: {
            title: '商标案件',
            keepAlive: true,
            icon: 'case_icon',
            bussId: 5
          }
        },
        {
          path: 'civilSuit',
          component: () => import('@/views/workbench/case/case_management/components/civilSuit'),
          name: 'civilSuit',
          meta: {
            title: '诉讼案件',
            // keepAlive: true,
            icon: 'case_icon',
            taskType:2,
            business: 11,
            bussId: 11,
          }
        },
        {
          path: 'protectList',
          component: () => import('@/views/workbench/case/case_management/components/civilSuit.vue'),
          name: 'protectList',
          meta: {
            title: '保护案件',
            // keepAlive: true,
            icon: 'case_icon',
            taskType:3,
            business: 23,
            bussId: 23,
          }
        },
        {
          path: 'patentList',
          component: () => import('@/views/workbench/case/case_management/components/civilSuit.vue'),
          name: 'patentList',
          meta: {
            title: '专利案件',
            // keepAlive: true,
            icon: 'case_icon',
            taskType:4,
            business: 3,
            bussId: 3,
          }
        },
        {
          path: 'domainName',
          component: () => import('@/views/workbench/case/case_management/components/civilSuit.vue'),
          name: 'domainName',
          meta: {
            business:5,
            taskType:5,
            bussId: 29,
            title: '域名案件',
            // keepAlive: true,
            icon: 'case_icon'
          }
        },
        {
          path: 'copyright',
          component: () => import('@/views/workbench/case/case_management/components/civilSuit.vue'),
          name: 'copyright',
          meta: {
            business:4,
            taskType:6,
            bussId: 27,
            title: '著作权案件',
            // keepAlive: true,
            icon: 'case_icon'
          }
        },
        {
          path: 'non_litigation',
          component: () => import('@/views/workbench/case/case_management/components/civilSuit.vue'),
          name: 'non_litigation',
          meta: {
            business:6,
            taskType:7,
            bussId: 28,
            title: '非诉案件',
            // keepAlive: true,
            icon: 'case_icon'
          }

        },
        {
          path: 'case_search',
          component: () => import('@/views/workbench/case/case_search'),
          name: 'case_search',
          meta: {
            title: '全部案件',
            // keepAlive: true,
            permissions: [248],
            icon: 'case_icon'
          }
        },
        {
          path: 'us_cases',
          component: () => import('@/views/workbench/case/case_management'),
          name: 'us_cases',
          meta: {
            title: '美国案件',
            keepAlive: false,
            icon: 'case_icon',
            bussId: 60,
            permissions: [356]
          }
        },

        {
          path: 'seeCaseDetail/:caseId',
          component: () => import('@/views/workbench/case/components/ManualIdentification/seeCaseDetail.vue'),
          name: 'seeCaseDetail',
          meta: {
            title: '案件详情'
          },
          hidden: true
        }
      ]
    },
    {
      path: 'work_time',
      component: () => import('@/views/workbench/workTime/index'), // Parent router-view
      name: 'workTime',
      meta: {
        title: '工时',
        icon: '工时',
        permissions: [267]
      }
    },
    {
      path: 'ResourceView',
      component: () =>
        import('@/views/workbench/project_management'),
      redirect: '/workbench/ResourceView/ResourceView1',
      name: 'ResourceView',
      meta: {
        title: '项目',
        icon:'项目',
        permissions: [267]
        // permissions: [17],
        // keepAlive: true,
      },
      children: [{
        path: 'ResourceView1',
        component: () =>
          import('@/views/homePage/components/ResourceView'),
        name: 'ResourceView1',
        meta: {
          title: '任务',
          permissions: [267],
          icon: '任务'
        }
      },
        {
          path: 'project',
          component: () =>
            import('@/views/workbench/project_management/project.vue'),
          name: 'project',
          meta: {
            title: '项目',
            permissions: [267],
            icon: '项目'
          },
          hidden:true
        },
        {
          path: 'allProject',
          component: () =>
            import('@/views/workbench/project_management/components/allProject.vue'),
          name: 'allProject',
          meta: {
            title: '项目',
            permissions: [267],
            icon: '项目',
          },
        },
        {
          path: 'taskDetail',
          component: () =>
            import('@/views/workbench/project_management/components/taskDetail.vue'),
          name: 'taskDetail',
          meta: {
            title: '任务详情',
            permissions: [267],

          },
          hidden:true
        }]
    },
    {
      path: 'technological_process',
      component: () => import('@/views/workbench/technological_process/index'), // Parent router-view
      name: 'technological_process',
      meta: {
        title: '流程',
        // icon: 'icon/案件21@2x.png',
        icon:'tree',
        permissions: [19, 20],
        // keepAlive: true
      },
      redirect: '/workbench/technological_process/officialSubmission',
      children: [{
          path: 'registration',
          component: () =>
            import('@/views/workbench/case/case_management/registration'),
          name: 'registration',
          meta: {
            title: '立卷',
            permissions: [18],
             icon: '立案'
          },
          hidden: true
        },
        {
          path: 'transferCase/:draftNumber',
          component: () =>
            import('@/views/workbench/case/case_management/transferCase'),
          name: 'transferCase',
          meta: {
            title: '立卷'
            // icon: 'tree'
          },
          hidden: true
        },
        {
          path: 'massfiling',
          component: () =>
            import('@/views/workbench/case/case_management/massfiling'),
          name: 'massfiling',
          meta: {
            title: '批量立卷'
            //  icon: 'tree'
          },
          hidden: true
        },
        {
          path: 'case_detail/:id/:caseType*',
          component: () => import('@/views/workbench/case/case_detail'),
          name: 'case_detail',
          meta: {
            title: '案件详情'
            //  icon: 'tree'
          },
          hidden: true
        },
        {
          path: 'preFilingPush/:type',
          component: () =>
            import(
              '@/views/workbench/case/preFiling/components/preFilingPush.vue'
            ),
          name: 'preFilingPush',
          meta: {
            title: '预立卷审批提交',
            icon: 'tree'
          },
          hidden: true
        },
        {
          path: 'officialSubmission',
          component: () => import('@/views/workbench/case/officialSubmission'),
          name: 'officialSubmission',
          meta: {
            title: '递交官方',
            permissions: [19],
            // keepAlive: true,
              icon: '递交'
          }
        },
        // {
        //   path: 'detailSubmission',
        //   component: () =>
        //     import(
        //       '@/views/workbench/case/officialSubmission/officialSubmission'
        //     ),
        //   name: 'detailSubmission',
        //   meta: {
        //     title: '递交官方详情',
        //     icon: 'tree'
        //   },
        //   hidden: true
        // },
        {
          path: 'officialCommunication',
          component: () =>
            import('@/views/workbench/case/officialCommunication'),
          name: 'officialCommunication',
          meta: {
            title: '官方通知',
            permissions: [20],
            // keepAlive: true,
              icon: '官方'
          }
        },
        {
          path: 'trademarkWriting',
          component: () =>
            import('@/views/workbench/case/trademarkWriting'),
          name: 'trademarkWriting',
          meta: {
            title: '商标撰写',
            // permissions: [20],
            // keepAlive: true,
              icon: '任务'
          }
        },

        {
          path: 'officialDocuments',
          component: () =>
            import('@/views/workbench/case/components/OfficialDocuments'),
          name: 'officialDocuments',
          meta: {
            title: '官文录入',
          },
          hidden: true
        },
        {
          path: 'case_management',
          component: () => import('@/views/workbench/case/case_management'),
          name: 'case_management',
          meta: {
            title: '案件管理',
            permissions: [21],
            keepAlive: true,
             icon: 'case_icon'
          },
          hidden: true
        },
        {
          path: 'seeCaseDetail/:caseId',
          component: () => import('@/views/workbench/case/components/ManualIdentification/seeCaseDetail.vue'),
          name: 'seeCaseDetail',
          meta: {
            title: '案件详情'
          },
          hidden: true
        }
      ]
    },
    {
      path: 'finance',
      component: () => import('@/views/workbench/finance/index'), // Parent router-view
      name: 'finance',
      meta: {
        title: '财务',
        // icon:'bill_icon',
        icon: '财务',
        permissions: [4]
      },
      hidden: true,
      redirect: '/workbench/finance/bill',
      children: [
        {
          path: 'patentFee',
          component: () => import('@/views/workbench/finance/patentFee'),
          name: 'patentFee',
          meta: {
            title: '官费缴纳',
            permissions: [22],
            icon:'patentFee',
            // keepAlive: true
          }
          // hidden: true
        },
        {
          path: 'create_patentFee',
          component: () =>
            import('@/views/workbench/finance/patentFee/component/create_patentFee.vue'),
          name: 'create_patentFee',
          meta: {
            title: '新建清单',
            // noCache: true,
            // activeMenu: '/billviews/bill'
          },

          hidden: true
        },
        {
          path: 'bill',
          component: () => import('@/views/workbench/finance/billviews/bill'),
          name: 'bill',
          meta: {
            title: '账单',
            permissions: [22],
            icon:'bill_icon',
            keepAlive: true
          }
          // hidden: true
        },
        {
          path: 'cost_list',
          component: () => import('@/views/workbench/finance/cost/cost_list'),
          name: 'cost_list',
          meta: {
            title: '费用',
            permissions: [23],
            keepAlive: true,
            icon:'费用',
          },
        },
        {
          path: 'invocieList',
          component: () => import('@/views/workbench/finance/invoice/invocieList.vue'),
          name: 'invocieList',
          meta: {
            title: '发票',
            keepAlive: true,
            permissions: [213],
            icon:'发票'
          },
        },
        {
          path: 'addFeeDetail/:pageType',
          component: () => import('@/views/workbench/finance/cost/addFeeDetail.vue'),
          name: 'addFeeDetail',
          meta: {
            title: '新建费用',

          },
          hidden: true
        },
        {
          path: 'seeFeeDetail',
          component: () => import('@/views/workbench/finance/cost/seeFeeDetail.vue'),
          name: 'seeFeeDetail',
          meta: {
            title: '费用查看',

          },
          hidden: true
        },
        {
          path: 'off_bill/:type',
          component: () =>
            import('@/views/workbench/finance/billviews/off_bill'),
          name: 'off_bill',
          meta: {
            title: '核销草单',
            // noCache: true,
            activeMenu: '/billviews/bill'
          },

          hidden: true
        },
        {
          path: 'creatBill/:id/:type',
          component: () =>
            import('@/views/workbench/finance/billviews/creatBill'),
          name: 'creatBill',
          meta: {
            title: '',
            noCache: true,
            activeMenu: '/billviews/bill'
          },

          hidden: true
        },
        {
          path: 'cinBill/:id/:type',
          component: () =>
            import('@/views/workbench/finance/billviews/cinBill'),
          name: 'cinBill',
          meta: {
            title: '',
            noCache: true,
            activeMenu: '/billviews/bill'
          },

          hidden: true
        },
        {
          path: 'trawSheet/:id/:type',
          component: () =>
            import('@/views/workbench/finance/billviews/trawSheet'),
          name: 'trawSheet',
          meta: {
            title: '',
            noCache: true,
            activeMenu: '/billviews/bill'
          },

          hidden: true
        },
        {
          path: 'financialBudget',
          component: () => import('@/views/workbench/finance/financialBudget'),
          name: 'financialBudget',
          meta: {
            title: '预算',
            permissions: [207],
            icon:'预算'
          },
        },
        {
          path: 'AppendBudget',
          component: () => import('@/views/workbench/finance/financialBudget/AppendBudget.vue'),
          name: 'AppendBudget',
          meta: {
            title: '增加/追加、调整预算—',
          },
          hidden: true
        },
        {
          path: 'reportDetail',
          component: () => import('@/views/workbench/finance/financialBudget/reportDetail'),
          name: 'reportDetail',
          meta: {
            title: '预算申报',
          },
          hidden: true
        },
        {
          path: 'declare',
          component: () => import('@/views/workbench/finance/financialBudget/declare.vue'),
          name: 'declare',
          meta: {
            title: '预算申报',
          },
          hidden: true
        },
        {
          path: 'overseasBill',
          component: () => import('@/views/workbench/finance/overseasBill'),
          name: 'overseasBill',
          meta: {
            title: '境外账单',
            permissions: [228],
            keepAlive: true,
            icon:'境外'
          },
        },
        {
          path: 'overseasPrice',
          component: () => import('@/views/workbench/finance/overseasPrice'),
          name: 'overseasPrice',
          meta: {
            title: '境外报价',
            keepAlive: true,
            icon:'境外报价'
          },
        },
        {
          path: 'collections',
          component: () => import('@/views/workbench/finance/collections'),
          name: 'collections',
          meta: {
            title: '收款',
            permissions: [302],
            keepAlive: false,
            icon:'收款'
          },
        },
        {
          path: 'collectionCreate',
          component: () => import('@/views/workbench/finance/collections/CollectionCreate.vue'),
          name: 'collectionCreate',
          meta: {
            title: '新建收款',
          },
          hidden: true
        },
        {
          path: 'collectionView/:payId',
          component: () => import('@/views/workbench/finance/collections/CollectionView.vue'),
          name: 'collectionView',
          meta: {
            title: '查看收款',
          },
          hidden: true
        },
        {
          path: 'collectionEdit/:payId',
          component: () => import('@/views/workbench/finance/collections/CollectionEdit.vue'),
          name: 'collectionEdit',
          meta: {
            title: '修改收款',
          },
          hidden: true
        },
        {
          path: 'addOverseasBill/:pageType',
          component: () => import('@/views/workbench/finance/overseasBill/addOverseasBill'),
          name: 'addOverseasBill',
          meta: {
            title: '新建境外账单',
          },
          hidden: true
        },
        {
          path: 'seeOverseasBill',
          component: () => import('@/views/workbench/finance/overseasBill/seeOverseasBill'),
          name: 'seeOverseasBill',
          meta: {
            title: '境外账单查看',
          },
          hidden: true
        },
      ]
    },

    {
      path: 'knowledgeBase',
      component: () => import('@/views/workbench/knowledgeBase'), // Parent router-view
      name: 'knowledgeBase',
      meta: {
        title: '知识库',
        keepAlive: true,
        // icon:'bill_icon',
        icon: '知识',
        permissions: [251]
      },
      redirect: '/workbench/knowledgeBase/search',
      children: [{
        path: 'search',
        component: () => import('@/views/workbench/knowledgeBase/search'),
        name: 'search',
        meta: {
          title: '知识检索',
          // keepAlive: true,
           permissions: [252],
          icon:'查询'
        }
        // hidden: true
      },
      {
        path: 'statistics',
        component: () => import('@/views/workbench/knowledgeBase/statistics/index.vue'),
        name: 'statistics',
        redirect: '/workbench/knowledgeBase/statistics/caseTypeModel',
        meta: {
          title: '数据统计',
           permissions: [253],
          icon:'统计'
        },
        children: [{
          path: 'caseTypeModel',
          component: () => import('@/views/workbench/knowledgeBase/statistics/caseTypeModel'),
          name: 'caseTypeModel',
          meta: {
            // title: '案件类型',
            // permissions: [24],
            // icon:'查询'
          },
           hidden: true
        },
        {
          path: 'caseTypeModelDetail',
          component: () => import('@/views/workbench/knowledgeBase/statistics/caseTypeModelDetail.vue'),
          name: 'caseTypeModelDetail',
          meta: {
            // title: '案件类型',
            // permissions: [24],
            // icon:'查询'
          },
          hidden: true
        },
        ],
    },
      {
        path: 'knowledge_management',
        component: () => import('@/views/workbench/knowledgeBase/knowledge_management'),
        name: 'knowledge_management',
        meta: {
          title: '知识管理',
           permissions: [254],
          icon:'管理'
        }
        // hidden: true
      },
        {
          path: 'personal_articles',
          component: () => import('@/views/workbench/knowledgeBase/personal_articles'),
          name: 'personal_articles',
          meta: {
            title: '个人文章',
            permissions: [255],
            icon:'文章'
          }
          // hidden: true
        },
        {
          path: 'articleDetail/:type/:id*',
          component: () => import('@/views/workbench/knowledgeBase/personal_articles/articleDetail.vue'),
          name: 'articleDetail',
          meta: {
            title: '写文章',
            permissions: [0],
            icon:'文章'
          },
           hidden: true
        },
        {
          path: 'ai_knowledge_base',
          component: () => import('@/views/workbench/knowledgeBase/ai_knowledge_base'),
          name: 'ai_knowledge_base',
          meta: {
            title: 'AI知识库管理',
            permissions: [440],
            icon:'文章'
          }
          // hidden: true
        },
      ]
    },
    {
      path: 'material_management',
      component: () => import('@/views/workbench/material_management/index'), // Parent router-view
      name: 'material_management',
      meta: {
        title: '资料',
        icon:'资料',
        // icon: 'icon/资料icon@2x.png',
        permissions: [5]
      },
      redirect: '/workbench/material_management/material',
      children: [{
        path: 'material',
        component: () => import('@/views/workbench/material_management/material'),
        name: 'material',
        meta: {
          title: '资料管理',
          permissions: [24],
          icon:'资料'
        }
        // hidden: true
      },
        {
        path: 'agencyMaterial',
        component: () => import('@/views/workbench/agency_material_management_new'),
        name: 'agencyMaterial',
        meta: {
          title: '内外资料管理',
          permissions: [358],
          icon:'资料'
        }
        // hidden: true
      },
      {
        path: 'caseMaterial',
        component: () => import('@/views/workbench/material_management/caseMaterial'),
        name: 'caseMaterial',
        meta: {
          title: '案件文档',
          permissions: [239],
          icon:'资料'
        },
        //  hidden: true
      },
        {
          path: 'archiveMaterial',
          component: () => import('@/views/workbench/material_management/archiveMaterial'),
          name: 'archiveMaterial',
          meta: {
            title: '档案管理',
            // permissions: [370],
            icon:'资料'
          },
          //  hidden: true
        }]
    },
    {
      path: 'platformData',
      component: () => import('@/views/workbench/platformData/index'), // Parent router-view
      name: 'platformData',
      meta: {
        title: '数据',
        icon: '数据',
        permissions: [6],

      },
      // hidden: true,
      redirect: '/workbench/platformData/dashboard',
      children: [{
        path: 'retrieval',
        component: () => import('@/views/workbench/platformData/trademarkRetrieval/retrieval'),
        name: 'retrieval',
        meta: {
          permissions: [26],
          title: '商标查询',
          keepAlive: true
        },
        hidden: true
      },
      //   {
      //   path: 'dashboard',
      //   component: () => import('@/views/workbench/platformData/companyDashboard/dashboard'),
      //   name: 'dashboard',
      //   meta: {
      //     title: '公司仪表盘',
      //     permissions: [25],
      //     keepAlive: true,
      //     icon:'dashboard'
      //   },
      //   // hidden: true
      // },
      {
        path: 'new_dashboard_index',
        component: () => import('@/views/workbench/dashboard/index'),
        name: 'new_dashboard_index',
        meta: {
          title: '经营数据',
          permissions: [361],
          keepAlive: true,
          icon:'dashboard'
        },
        // hidden: true
      },
      {
        path: 'new_dashboard_hrm',
        component: () => import('@/views/workbench/dashboard/hrm'),
        name: 'new_dashboard_hrm',
        meta: {
          title: '人力资源',
          permissions: [299],
          keepAlive: true,
          icon:'dashboard'
        },
        // hidden: true
      },
      {
        path: 'partner_weekly_report',
        component: () => import('@/views/workbench/dashboard/weekly_report'),
        name: 'partner_weekly_report',
        meta: {
          title: '合伙人周报',
          permissions: [372],
          keepAlive: true,
          icon:'dashboard'
        },
        // hidden: true
      },
      {
        path: 'lawyer_performance',
        component: () => import('@/views/workbench/dashboard/lawyer_performance'),
        name: 'lawyer_performance',
        meta: {
          title: '律所绩效',
          permissions: [384],
          keepAlive: true,
          icon:'dashboard'
        },
        // hidden: true
      },
      {
        path: 'company_news',
        component: () => import('@/views/workbench/dashboard/company_news'),
        name: 'company_news',
        meta: {
          title: '公司快讯',
          permissions: [393],
          keepAlive: true,
          icon:'dashboard'
        },
        // hidden: true
      },
      {
        path: 'auto_tool_stats',
        component: () => import('@/views/workbench/dashboard/autoToolStats'),
        name: 'auto_tool_stats',
        meta: {
          title: '工具使用统计',
          permissions: [515],
          keepAlive: true,
          icon:'dashboard'
        },
        // hidden: true
      },
      {
        path: 'itinerary',
        component: () => import('@/views/workbench/itinerary'),
        name: 'itinerary',
        meta: {
          title: '日程管理',
          permissions: [405],
          keepAlive: false,
          icon:'dashboard'
        },
        // hidden: true
      },
        {
        path: 'itinerary_detail',
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
        path: 'itinerary_list',
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
        path: 'business_trip',
        component: () => import('@/views/workbench/itinerary/TripDetailH5.vue'),
        name: 'business_trip',
        meta: {
          title: '出差详情',
          keepAlive: false,
          icon:'dashboard'
        },
        hidden: true
      },
        {
        path: 'trademark_detail/:tmId',
        component: () => import('@/views/workbench/platformData/trademarkRetrieval/trademark_detail'),
        name: 'trademark_detail1',
        meta: {
          title: '商标详情'
        },
        hidden: true
      }]
    },
    {
      path: 'customer_management',
      component: () => import('@/views/workbench/customer_management/index'), // Parent router-view
      name: 'customer_management',
      meta: {
        title: '客户',
        icon: 'Customer_icon',
        permissions: [2],
      },
      topHidden: true,
      hidden: true,
      redirect: '/workbench/customer_management/customer_list',
      children: [{
          path: 'cust_creat',
          component: () =>
            import(
              '@/views/workbench/customer_management/customer_list/cust_creat'
            ),
          name: 'cust_creat',
          meta: {
            title: '新建客户',
            noCache: true,
            activeMenu: '/customer_list/cust_list'
          },
          hidden: true
        },
        {
          path: 'cust_edit/:id(\\d+)/:type',
          component: () =>
            import(
              '@/views/workbench/customer_management/customer_list/cust_edit'
            ),
          name: 'cust_edit',
          meta: {
            title: '编辑客户',
            noCache: true,
            activeMenu: '/customer_list/cust_list'
          },
          hidden: true
        },
        {
          path: 'cust_view/:id',
          component: () =>
            import(
              '@/views/workbench/customer_management/customer_list/cust_view'
              ),
          name: 'cust_view',
          meta: {
            title: '客户查看',
            noCache: true,
          },
          hidden: true
        },
        {
          path: 'customer_list',
          component: () =>
            import(
              '@/views/workbench/customer_management/customer_list/cust_list'
            ),
          name: 'customer_list',
          meta: {
            title: '客户',
            icon: 'Customer_icon',
            permissions: [10],
            keepAlive: true
          }
        },
        {
          path: 'contact_df_creat',
          component: () =>
            import(
              '@/views/workbench/customer_management/contact_df_management/contact_df_creat'
            ),
          name: 'contact_df_creat',
          meta: {
            title: '新建对方联系人',

            // noCache: true,
            activeMenu: '/contact_df_management/contact_df_list'
          },
          hidden: true
        },
        {
          path: 'contact_df_edit/:id(\\d+)',
          component: () =>
            import(
              '@/views/workbench/customer_management/contact_df_management/contact_df_edit'
            ),
          name: 'contact_df_edit',
          meta: {
            title: '编辑对方联系人',
            noCache: true,
            activeMenu: '/contact_df_management/contact_df_list'
          },
          hidden: true
        },
        {
          path: 'contact_df_management',
          component: () =>
            import(
              '@/views/workbench/customer_management/contact_df_management/contact_df_list'
            ),
          name: 'contact_df_management',
          meta: {
            title: '对方联系人',
            permissions: [15],
            keepAlive: true,
              icon: 'Contact person_icon'
          }
        },
        {
          path: 'activity_creat',
          component: () =>
            import(
              '@/views/workbench/customer_management/activity_management/activity_creat'
            ),
          name: 'activity_creat',
          meta: {
            title: '新建活动',
            noCache: true,
            activeMenu: '/activity_management/activity_list'
          },
          hidden: true
        },
        {
          path: 'activity_edit/:id(\\d+)',
          component: () =>
            import(
              '@/views/workbench/customer_management/activity_management/activity_edit'
            ),
          name: 'activity_edit',
          meta: {
            title: '编辑活动',
            noCache: true,
            activeMenu: '/activity_management/activity_list'
          },
          hidden: true
        },
        {
          path: 'activity_management',
          component: () =>
            import(
              '@/views/workbench/customer_management/activity_management/activity_list'
            ),
          name: 'activity_management',
          meta: {
            title: '活动',
            permissions: [16],
            keepAlive: true,
            icon: 'activity_icon'
          }
        },
        {
          path: 'official_creat',
          component: () =>
            import(
              '@/views/workbench/customer_management/official_bodies/official_creat'
            ),
          name: 'official_creat',
          meta: {
            title: '新建官方机构',
            noCache: true,
            activeMenu: '/official_bodies/official_list'
          },
          hidden: true
        },
        {
          path: 'official_edit/:id(\\d+)',
          component: () =>
            import(
              '@/views/workbench/customer_management/official_bodies/official_edit'
            ),
          name: 'official_edit',
          meta: {
            title: '编辑官方机构',
            noCache: true,
            activeMenu: '/official_bodies/official_list'
          },
          hidden: true
        },
        {
          path: 'official_view/:id(\\d+)',
          component: () =>
            import(
              '@/views/workbench/customer_management/official_bodies/components/OfficialView'
              ),
          name: 'official_view',
          meta: {
            title: '查看官方机构',
            noCache: true,
            activeMenu: '/official_bodies/official_list'
          },
          hidden: true
        },
        {
          path: 'official_list',
          component: () =>
            import(
              '@/views/workbench/customer_management/official_bodies/official_list'
            ), // Parent router-view
          name: 'official_bodies',
          meta: {
            title: '官方机构',
            permissions: [13],
            keepAlive: true,
              icon: '机构'
          }
        },
        {
          path: 'cooperative_creat',
          component: () =>
            import(
              '@/views/workbench/customer_management/cooperative_resources/cooperative_creat'
            ),
          name: 'cooperative_creat',
          meta: {
            title: '新建合作资源',
            noCache: true,
            activeMenu: '/cooperative_resources/cooperative_list'
          },
          hidden: true
        },
        {
          path: 'cooperative_edit/:id(\\d+)',
          component: () =>
            import(
              '@/views/workbench/customer_management/cooperative_resources/cooperative_edit'
            ),
          name: 'cooperative_edit',
          meta: {
            title: '编辑合作资源',
            noCache: true,
            activeMenu: '/cooperative_resources/cooperative_list'
          },
          hidden: true
        },
        {
          path: 'cooperative_view/:id(\\d+)',
          component: () =>
            import(
              '@/views/workbench/customer_management/cooperative_resources/components/cooperative_view'
              ),
          name: 'cooperative_edit',
          meta: {
            title: '查看合作资源',
            noCache: true,
            activeMenu: '/cooperative_resources/cooperative_list'
          },
          hidden: true
        },
        {
          path: 'cooperative_list',
          component: () =>
            import(
              '@/views/workbench/customer_management/cooperative_resources/cooperative_list'
            ), // Parent router-view
          name: 'cooperative_resources',
          meta: {
            title: '合作资源',
              icon: '合作',
            permissions: [12],
            keepAlive: true
          }
        },
        {
          path: 'conflict_of_creat',
          component: () =>
            import(
              '@/views/workbench/customer_management/conflict_of_interest/conflict_of_creat'
            ),
          name: 'conflict_of_creat',
          meta: {
            title: '新建利益冲突者',
            noCache: true,
            activeMenu: '/conflict_of_interest/conflict_of_list'
          },
          hidden: true
        },
        {
          path: 'conflict_of_edit/:id(\\d+)',
          component: () =>
            import(
              '@/views/workbench/customer_management/conflict_of_interest/conflict_of_edit'
            ),
          name: 'conflict_of_edit',
          meta: {
            title: '编辑利益冲突者',
            noCache: true,
            activeMenu: '/conflict_of_interest/conflict_of_list'
          },
          hidden: true
        },
        {
          path: 'conflict_view/:id(\\d+)',
          component: () =>
            import(
              '@/views/workbench/customer_management/conflict_of_interest/components/conflict_view'
              ),
          name: 'conflict_view',
          meta: {
            title: '查看利益冲突者',
            noCache: true,
            activeMenu: '/conflict_of_interest/conflict_of_list'
          },
          hidden: true
        },
        {
          path: 'conflict_of_list',
          component: () =>
            import(
              '@/views/workbench/customer_management/conflict_of_interest/conflict_of_list'
            ), // Parent router-view
          name: 'conflict_of_interest',
          meta: {
            title: '利益冲突者',
            permissions: [14],
            keepAlive: true,
            icon: '冲突分析'
          }
        },
        {
          path: 'applicant_creat',
          component: () =>
            import(
              '@/views/workbench/customer_management/applicant/applicant_creat'
            ),
          name: 'applicant_creat',
          meta: {
            title: '新建申请人',
            noCache: true,
            activeMenu: '/applicant/applicant_list'
          },
          hidden: true
        },
        {
          path: 'applicant_edit/:id(\\d+)',
          component: () =>
            import(
              '@/views/workbench/customer_management/applicant/applicant_edit'
            ),
          name: 'applicant_edit',
          meta: {
            title: '编辑申请人',
            noCache: true,
            activeMenu: '/applicant/applicant_list'
          },
          hidden: true
        },
        {
          path: 'applicant_view/:id(\\d+)',
          component: () =>
            import(
              '@/views/workbench/customer_management/applicant/components/ApplicantView'
              ),
          name: 'applicant_view',
          meta: {
            title: '查看申请人',
            noCache: true,
            activeMenu: '/applicant/applicant_list'
          },
          hidden: true
        },
        {
          path: 'applicant_list',
          component: () =>
            import(
              '@/views/workbench/customer_management/applicant/applicant_list'
            ), // Parent router-view
          name: 'applicant',
          meta: {
            title: '申请人',
            icon: '申请',
            permissions: [11],
            keepAlive: true

          }
        },
        {
          path: 'business_opportunity',
          component: () =>
            import('@/views/workbench/customer_management/business_pportunity'),
          name: 'business_pportunity',
          meta: {
            title: '商机',
            permissions: [259],
            keepAlive: true
          },
          hidden: true,
        }
      ]
    },
    {
      path: 'system_management',
      component: () => import('@/views/workbench/system_management/index'), // Parent router-view
      name: 'system_management',
      meta: {
        title: '配置',
         icon: '配置',
        permissions: [7]
      },
      redirect: '/workbench/system_management/marked_management',
      children: [
        {
          path: 'marked_management',
          component: () => import('@/views/workbench/system_management/marked_management/index'),
          name: 'marked_management',
          meta: {
            title: '国内价目表',
            permissions:[27],
            keepAlive: true,
            icon:'价格表'
          },
        },
        {
          path: 'marked_detail',
          component: () => import('@/views/workbench/system_management/marked_management/marked_detail'),
          name: 'marked_detail',
          meta: {
            title: '价目表新增',
          },
          hidden: true
        },
        {
          path: 'marked_details',
          component: () => import('@/views/workbench/system_management/marked_management/marked_details'),
          name: 'marked_details',
          meta: {
            title: '价目表详情',
          },
          hidden: true
        },
        {
          path: 'department_management',
          component: () =>
            import(
              '@/views/workbench/system_management/department_management/department'
            ),
          name: 'department_management',
          meta: {
            title: '部门管理（地域）',
             icon: '部门',
            permissions: [29]
          }
        },
        {
          path: 'department_detail/:type',
          component: () =>
            import(
              '@/views/workbench/system_management/department_management/department_detail'
            ),
          name: 'department_detail',
          meta: {
            title: '部门新增'
          },
          hidden: true
        },
        {
          path: 'domain_management',
          component: () =>
            import('@/views/workbench/system_management/domain_management'),
          name: 'domain_management',
          meta: {
            title: '领域管理',
              icon: '应用领域',
            permissions: [196]
          }
        },
        {
          path: 'domain_management_detail/:type',
          component: () =>
            import(
              '@/views/workbench/system_management/domain_management/domain_management_detail'
            ),
          name: 'domain_management_detail',
          meta: {
            title: '领域新增'
            //  icon: 'table',
            // permissions: ['系统管理员', '部门管理']
          },
          hidden: true
        },
        {
          path: 'workingGroup_management',
          component: () =>
            import(
              '@/views/workbench/system_management/workingGroup_management/workingGroup_management'
            ),
          name: 'workingGroup_management',
          meta: {
            keepAlive: true,
            title: '工作组管理',
            permissions: [30],
            icon: '工作组1'
          }
        },
        {
          path: 'workingGroup_management_add/:type',
          component: () =>
            import(
              '@/views/workbench/system_management/workingGroup_management/workingGroup_management_add'
            ),
          name: 'workingGroup_management_add',
          meta: {
            title: '工作组添加'
            //  icon: 'example'
          },
          hidden: true
        },
        {
          path: 'staff_management',
          component: () =>
            import('@/views/workbench/system_management/staff_management'),
          name: 'staff_management',
          meta: {
            title: '员工管理',
             icon: '员工管理',
            permissions: [31],
            keepAlive: true
          }
        },
        {
          path: 'staff_management_detail/:title',
          component: () =>
            import(
              '@/views/workbench/system_management/staff_management/staff_management_detail'
            ),
          name: 'staff_management_detail',
          meta: {
            title: '员工新增'
            //  icon: 'form'
          },
          hidden: true
        },
        {
          path: 'see_staff_management_detail',
          component: () =>
            import(
              '@/views/workbench/system_management/staff_management/see_staff_management_detail'
            ),
          name: 'staff_management_detail',
          meta: {
            title: '查看员工'
            //  icon: 'form'
          },
          hidden: true
        },

        {
          path: 'role_management',
          component: () =>
            import('@/views/workbench/system_management/role_management'),
          name: 'role_management',
          meta: {
            title: '角色管理',
             icon: 'user',
            permissions: [32]
          }
        },
        {
          path: 'role_management_detail/:type',
          component: () =>
            import(
              '@/views/workbench/system_management/role_management/role_management_detail'
            ),
          name: 'role_management_detail',
          meta: {
            title: '角色新增'
            //  icon: 'user'
          },
          hidden: true
        },
        {
          path: 'permission_management',
          component: () =>
            import('@/views/workbench/system_management/permission_management'),
          name: 'permission_management',
          meta: {
            title: '权限管理',
              icon: '角色权限',
            permissions: [33]
          },
          redirect: 'permission_management/permission_Modular',
          children: [{
              path: 'permission_Modular',
              component: () =>
                import(
                  '@/views/workbench/system_management/permission_management/components/permission_Modular'
                ),
              name: 'permission_Modular',
              meta: {
                // title: '模块操作权设置',
                // icon: 'nested',
                permissions: [108]
              },
              hidden: true
            },
            {
              path: 'permission_user',
              component: () =>
                import(
                  '@/views/workbench/system_management/permission_management/components/permission_user'
                ),
              name: 'permission_user',
              meta: {
                // title: '按用户设置权限',
                // icon: 'nested'
                permissions: [109]
              },
              hidden: true
            }
          ]
        },
        {
          path: 'ModuleSettingsWorkbench/:id',
          component: () =>
            import(
              '@/views/workbench/system_management/permission_management/ModuleSettingsWorkbench.vue'
            ),
          name: 'ModuleSettingsWorkbench',
          meta: {
            title: '模块操作权设置--工作台'
            //  icon: 'nested'
          },
          hidden: true
        },
        {
          path: 'SetpermissionsbyUser/:userId/:name',
          component: () =>
            import(
              '@/views/workbench/system_management/permission_management/SetpermissionsbyUser.vue'
            ),
          name: 'SetpermissionsbyUser',
          meta: {
            title: '按用户设置权限'
            //  icon: 'nested'
          },
          hidden: true
        },
        {
          path: 'webLog',
          component: () =>
            import(
              '@/views/workbench/system_management/webLog'
              ),
          name: 'role_management_detail',
          meta: {
            title: '报错日志',
            permissions: [0]
            //  icon: 'user'
          },
        },
        {
          path: 'templateManagement',
          component: () =>
            import(
              '@/views/workbench/system_management/templateManagement'
              ),
          name: 'templateManagement',
          meta: {
            keepAlive: true,
            title: '模板管理',
            permissions: [266],
             icon: 'templateManagement'
          }
        },
        {
          path: 'feeRules',
          component: () =>
            import(
              '@/views/workbench/feeRules'
              ),
          name: 'feeRules',
          meta: {
            // keepAlive: true,
            title: '费用加批规则',
            permissions: [369],
             icon: 'templateManagement'
          }
        },
        {
          path: 'account_management',
          component: () => import('@/views/workbench/account_management'),
          name: 'account_management',
          meta: {
            title: '翻译软件管理',
            keepAlive: false,
            icon:'dashboard',
            permissions: [522,523,524],
          },
        },
        {
          path: 'template_management_view/:id',
          component: () =>
            import(
              '@/views/workbench/system_management/templateManagement/components/template_management_view.vue'
              ),
          beforeEnter: (to, from, next) => {
            to.query.type == 1 ? to.meta.title = '查看万慧达模板' : to.meta.title = '查看内部共享模板'
            next()
          },
          meta: {
            title: '查看模板'
          },
          name: 'template_management_view',
          hidden: true
        },
        {
          path: 'template_management_create/:id',
          component: () =>
            import(
              '@/views/workbench/system_management/templateManagement/template_management_create.vue'
              ),
          beforeEnter: (to, from, next) => {
            to.params.id == 1 ? to.meta.title = '创建万慧达模板' : to.meta.title = '创建内部共享模板'
            next()
          },
          meta: {
            title: '创建模板'
          },
          name: 'template_management_create',
          hidden: true
        },
        {
          path: 'template_management_edit/:id',
          component: () =>
            import(
              '@/views/workbench/system_management/templateManagement/template_management_edit.vue'
              ),
          beforeEnter: (to, from, next) => {
            to.query.type == 1 ? to.meta.title = '修改万慧达模板' : to.meta.title = '修改内部共享模板'
            next()
          },
          meta: {
            title: '修改模板'
          },
          name: 'template_management_edit',
          hidden: true
        }
      ]
    },
    // {
    //   path: 'talent_pool',
    //   component: () => import('@/views/workbench/talent_pool'), // Parent router-view
    //   name: 'talent_pool',
    //   redirect: '/workbench/talent_pool/talent_review',
    //   meta: {
    //     title: '人才库',
    //     icon: '人才库',
    //     permissions: [298]
    //   },
    //   children: [
    //     {
    //       path: 'talent_review',
    //       component: () => import('@/views/workbench/talent_pool/talent_review'),
    //       name: 'talent_review',
    //       meta: {
    //         title: '人员信息',
    //         keepAlive: true,
    //         icon: '关键人才',
    //         permissions: [299]
    //       }
    //     },
    //     {
    //       path: 'permission_management',
    //       component: () => import('@/views/workbench/talent_pool/permission_management'),
    //       name: 'permission_management',
    //       meta: {
    //         title: '权限管理',
    //         keepAlive: true,
    //         icon: '角色权限',
    //         permissions: [300]
    //       },
    //       redirect: 'permission_management/permission_user',
    //       children: [
    //         {
    //           path: 'permission_user',
    //           component: () =>
    //           import('@/views/workbench/talent_pool/permission_management/components/permission_user'),
    //           name: 'permission_user',
    //           hidden: true
    //         }
    //       ]
    //     },
    //     {
    //       path: 'dashboard',
    //       component: () => import('@/views/workbench/talent_pool/dash_board'),
    //       name: 'dashboard',
    //       meta: {
    //         title: '数据统计',
    //         keepAlive: true,
    //         icon: 'dashboard',
    //         permissions: [301]
    //       }
    //     },
    //     {
    //       path: 'SetpermissionsbyUser/:userId/:talentCode/:name',
    //       component: () =>
    //         import(
    //           '@/views/workbench/talent_pool/permission_management/SetpermissionsbyUser.vue'
    //           ),
    //       name: 'talent_pool/SetpermissionsbyUser',
    //       meta: {
    //         title: '设置成长档案查看权限'
    //       },
    //       hidden: true
    //     },
    //     {
    //       path: 'SetpermissionsbyList/:userId/:talentCode/:name',
    //       component: () =>
    //         import(
    //           '@/views/workbench/talent_pool/permission_management/SetpermissionsbyList.vue'
    //           ),
    //       name: 'talent_pool/SetpermissionsbyList',
    //       meta: {
    //         title: '设置列表查看权限'
    //         //  icon: 'nested'
    //       },
    //       hidden: true
    //     },
    //     {
    //       path: 'talent_review_detail/:id',
    //       component: () =>
    //         import('@/views/workbench/talent_pool/talent_review/talent_review_detail.vue'),
    //       name: 'talent_review_detail',
    //       meta: {
    //         title: '修改成长档案'
    //       },
    //       hidden: true
    //     },
    //   ]
    // },
    {
      path: 'hrm',
      component: () => import('@/views/workbench/hrm'), // Parent router-view
      name: 'hrm',
      redirect: '/workbench/hrm/my_profile',
      meta: {
        title: '人力资源',
        icon: '人才库'
      },
      children: [
        {
          path: 'my_profile',
          component: () => import('@/views/workbench/hrm/my_profile'),
          name: 'my_profile',
          meta: {
            title: '我的档案',
            keepAlive: true,
            icon: 'user'
          }
        },
        {
          path: 'staff_management',
          component: () => import('@/views/workbench/hrm/staff_management'),
          name: 'staff_management',
          meta: {
            title: '人员管理',
            keepAlive: true,
            icon: '关键人才',
            permissions: [299]
          }
        },
        {
          path: 'payroll_management',
          component: () => import('@/views/workbench/hrm/payroll_management'),
          name: 'payroll_management',
          meta: {
            title: '工资管理',
            keepAlive: true,
            icon: '官方',
            permissions: [427]
          }
        },
        {
          path: 'bonus_management',
          component: () => import('@/views/workbench/hrm/bonus_management'),
          name: 'bonus_management',
          meta: {
            title: '奖金管理',
            keepAlive: true,
            icon: '财务',
            permissions: [430]
          }
        },
        {
          path: 'salary_management',
          component: () => import('@/views/workbench/hrm/salary_management'),
          name: 'salary_management',
          meta: {
            title: '薪酬统计',
            keepAlive: true,
            icon: '统计',
            permissions: [429]
          }
        },
        {
          path: 'approval_management',
          component: () => import('@/views/workbench/hrm/approval_management'),
          name: 'approval_management',
          meta: {
            title: '审批管理',
            keepAlive: true,
            icon: '申请',
            permissions: [418]
          }
        },
        {
          path: 'staff_management_detail/:id',
          component: () => import('@/views/workbench/hrm/staff_management/detail'),
          name: 'staff_management_detail',
          meta: {
            title: '人员信息',
            permissions: [299]
          },
          hidden: true
        },
      ]
    },
    {
      path: 'finance_two',
      component: () => import('@/views/workbench/finance_two/index'),
      name: 'financeTwo',
      // redirect: '/workbench/finance_bill_manager/finance_bill',
      meta: {
        title: '财务',
        icon: '财务',
        permissions: [4]
      }
    },
    {
      path: 'new_customer_center',
      name: 'new_customer_center',
      component: () => import('@/views/workbench/customer_center/index'),
      redirect: '/workbench/customer_info',
      meta: {
        newCustomer: true,
        title: '客户',
        icon: 'Customer_icon',
        permissions: [2]
      }
    },
    {
      path: 'customer_info',
      component: () => import('@/views/workbench/customer_center/customer_list/cust_list'), // Parent router-view
      name: 'customer_info',
      meta: {
        permissions: [10],
        parentPermissions: [408],
        newCustomer: true,
        path: 'customer_info',
        title: '客户信息',
        icon: 'icon/客户.png',
      },
      topHidden: true,
      customer: true,
    },
    {
      path: 'customer_business_opportunities',
      component: () => import('@/views/workbench/customer_center/business_opportunities/index'), // Parent router-view
      name: 'customer_business_opportunities',
      meta: {
        permissions: [17],
        parentPermissions: [408],
        newCustomer: true,
        path: 'customer_business_opportunities',
        title: '商机列表',
        icon: 'icon/商机列表.png',
      },
      topHidden: true,
      customer: true,
    },
    {
      path: 'customer_commander',
      component: () => import('@/views/workbench/customer_center/commander/index'), // Parent router-view
      name: 'customer_commander',
      meta: {
        permissions: [409],
        parentPermissions: [408],
        newCustomer: true,
        path: 'customer_commander',
        title: '负责人',
        icon: 'icon/负责人.png',
      },
      topHidden: true,
      customer: true,
    },
    {
      path: 'customer_statistics',
      component: () => import('@/views/workbench/customer_center/statistics/index'),
      redirect: 'common_solutions',
      name: 'customer_statistics',
      meta: {
        permissions: [411],
        parentPermissions: [408],
        newCustomer: true,
        path: 'customer_statistics',
        title: '数据统计',
        icon: 'icon/数据统计.png',
        keepAlive: true,
      },
      topHidden: true,
      customer: true,
      children: [
        {
          path: 'common_solutions',
          component: () => import('@/views/workbench/customer_center/statistics/common_solutions/index'),
          name: 'common_solutions',
          meta: {
            newCustomer: true,
            path: 'common_solutions',
            title: '数据统计',
            icon: 'icon/常用方案.png',
            keepAlive: true,
          },
          topHidden: true,
          customer: true,
        },
        // {
        //   path: 'cust_statistics',
        //   component: () => import('@/views/workbench/customer_center/statistics/cust_statistics/index'),
        //   name: 'cust_statistics',
        //   meta: {
        //     path: 'cust_statistics',
        //     title: '客户统计',
        //     icon: 'icon/客户统计.png',
        //     keepAlive: true,
        //   },
        //   topHidden: true,
        //   customer: true,
        // }
      ]
    },
    // {
    //   path: 'customer_allocation',
    //   component: () => import('@/views/workbench/customer_center/customer_allocation/index'),
    //   name: 'customer_allocation',
    //   meta: {
    //     permissions: [410],
    //     parentPermissions: [408],
    //     newCustomer: true,
    //     path: 'customer_allocation',
    //     title: '客户分配',
    //     icon: 'icon/客户分配.png',
    //   },
    //   topHidden: true,
    //   customer: true,
    // },
    {
      path: 'customer_activity',
      component: () => import('@/views/workbench/customer_center/customer_activity/index'),
      name: 'customer_activity',
      meta: {
        permissions: [16],
        parentPermissions: [408],
        newCustomer: true,
        path: 'customer_activity',
        title: '客户活动',
        icon: 'icon/客户活动.png',
      },
      topHidden: true,
      customer: true,
    },
    {
      path: 'market_activity',
      component: () => import('@/views/workbench/customer_center/market_activity/index'),
      name: 'market_activity',
      meta: {
        permissions: [414],
        parentPermissions: [408],
        newCustomer: true,
        path: 'market_activity',
        title: '市场效率',
        icon: 'icon/财务报表.png',
      },
      topHidden: true,
      customer: true,
    },
    {
      path: 'customer_other_contacts',
      component: () => import('@/views/workbench/customer_center/customer_other_contacts/index'),
      name: 'customer_other_contacts',
      meta: {
        permissions: [15],
        parentPermissions: [408],
        newCustomer: true,
        path: 'customer_other_contacts',
        title: '客户联系人',
        icon: 'icon/对方联系人.png',
      },
      topHidden: true,
      customer: true,
    },
    {
      path: 'customer_official_list',
      component: () => import('@/views/workbench/customer_center/official_list/index'),
      name: 'customer_official_list',
      meta: {
        permissions: [13],
        parentPermissions: [408],
        newCustomer: true,
        path: 'customer_official_list',
        title: '官方机构',
        icon: 'icon/官方机构.png',
      },
      topHidden: true,
      customer: true,
    },
    {
      path: 'customer_cooperative_list',
      component: () => import('@/views/workbench/customer_center/cooperative_list/index'),
      name: 'customer_cooperative_list',
      meta: {
        permissions: [12],
        parentPermissions: [408],
        newCustomer: true,
        path: 'customer_cooperative_list',
        title: '合作资源',
        icon: 'icon/合作资源.png',
      },
      topHidden: true,
      customer: true,
    },
    {
      path: 'customer_conflict_of_list',
      component: () => import('@/views/workbench/customer_center/conflict_of_list/index'),
      name: 'customer_conflict_of_list',
      meta: {
        permissions: [14],
        parentPermissions: [408],
        newCustomer: true,
        path: 'customer_conflict_of_list',
        title: '利益冲突者',
        icon: 'icon/利益冲突.png',
      },
      topHidden: true,
      customer: true,
    },
    {
      path: 'customer_applicant_list',
      component: () => import('@/views/workbench/customer_center/applicant_list/index'),
      name: 'customer_applicant_list',
      meta: {
        permissions: [11],
        parentPermissions: [408],
        newCustomer: true,
        path: 'customer_applicant_list',
        title: '申请人',
        icon: 'icon/申请人.png',
      },
      topHidden: true,
      customer: true,
    },
    {
      path: 'customer_groupcust_list',
      component: () => import('@/views/workbench/customer_center/groupcust_list/index'),
      name: 'customer_groupcust_list',
      meta: {
        permissions: [412],
        parentPermissions: [408],
        newCustomer: true,
        path: 'customer_groupcust_list',
        title: '集团客户',
        icon: 'icon/集团客户.png',
      },
      topHidden: true,
      customer: true,
    },
    {
      path: 'customer_doormanage_list',
      component: () => import('@/views/workbench/customer_center/doormanage_list/index'),
      name: 'customer_doormanage_list',
      meta: {
        permissions: [438],
        parentPermissions: [408],
        newCustomer: true,
        path: 'customer_doormanage_list',
        title: '客户门户',
        icon: 'icon/集团客户.png',
      },
      topHidden: true,
      customer: true,
    },
    {
      path: 'contract_management',
      name: 'contract_management',
      component: () => import('@/views/workbench/contract_management/index'),
      meta: {
        title: '合同管理',
        icon: '合同',
      }
    },
    {
      path: 'contract_detail/:contractId',
      name: 'contract_detail',
      component: () => import('@/views/workbench/contract_management/contract_detail'),
      meta: {
        title: '合同详情',
        icon: '合同',
      },
      hidden: true
    },
    // {
    //   path: 'customer_brand_list',
    //   component: () => import('@/views/workbench/customer_center/brand_list/index'),
    //   name: 'customer_brand_list',
    //   meta: {
    //     // permissions: [412],
    //     parentPermissions: [408],
    //     newCustomer: true,
    //     path: 'customer_brand_list',
    //     title: '品牌管理',
    //     icon: 'icon/品牌管理.png',
    //   },
    //   topHidden: true,
    //   customer: true,
    // },
    {
      path: 'travel_management',
      name: 'travel_management',
      component: () => import('@/views/workbench/travel_management/index'),
      meta: {
        title: '出差管理',
        icon: '出差',
		permissions: [490]
      }
    },
  ]
}

export default workRouter
