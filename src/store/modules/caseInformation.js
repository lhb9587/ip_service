import { queryServerIp ,createTask ,queryCaseType,queryMailList,getCaseWorkgroupChangeMessage,upCaseWorkgroupChangeMessage,queryToDoTask,modifyTaskMessage} from '@/api/caseList.js'
import { getUser, getInfo } from '@/api/user'
import { queryUsers} from '@/api/systemList'
import Vue from 'vue'
import Vue1 from '@/main'
import {getToken,removeToken} from "../../utils/auth";
import socketio from 'socket.io-client';
import {getMenuName, unique} from '@/utils'
import { Message,Notification  } from 'element-ui'
import WebSocketClass from '@/utils/socket.js'
import router from "../../router";

const state = {
  jyList: [],
  rightDrawerWidth: 801,
  hoursId: '',
  positionInfoList: [],
  progressList: [],
  isUpdateList: false,
  caseTypeList:[],
  toDoTaskCaseId: 0,
  toDoTaskName: '',
  toDoTaskId: '',
  preOnlyId:'',
  contactLanguage:'',
  reportedTemporarily:[],
  caseWorkgroupChangeList:[],
  queryToDoTaskList: [],
  flag: false,
  workTimeStatus: '',
  total: 0,
  pageSize:5,
  pageNo:1,
  reportedTemporarilyTotal:0,
  bussId:'2',
  filterValue:'',
  closeFlag:false,
  summaryData:{
    bill:{
      billIn: 0,
      billSum: 0,
      foreignSum: 0,
      officialCost:0,
      otherCost: 0,
      serviceCost: 0,
      serviceCostTotal:0
    },
    workTime:{
        time:0,
        approvedTime:0,
        amount:0,
        approvedAmountCust:0,
     },
    cost_list:{
      total: 0
    },
    insidebill:{
      total: 0
    },
    patentFee:{
      payAmountSum: 0
    }
  },
  tmCaseTypeList:[],
  workerNo:0,
  // billFwfDescisionIndex
  roleList:[],
  gridOptions:{
    rowDeselection: true,
    enableRangeSelection: true,
    suppressCopyRowsToClipboard: true
  },
  localeText : {
    selectAll: '全选',
    searchOoo: '搜索',
    blanks: '空',
    pinColumn: '放置',
    pinLeft: '置左',
    pinRight: '置右',
    noPin: '归位',
    autosizeThiscolumn: '自动调整此列',
    autosizeAllColumns: '自动调整所有列',
    groupBy: '分组',
    ungroupBy: 'laUnGroup by',
    resetColumns: '重置列',
    noRowsToShow: '暂无数据',
    // valueAggregation: 'laValue Agg',
    // page: 'daPage',
    // more: 'daMore',
    // to: 'daTo',
    // of: 'daOf',
    // next: 'daNexten',
    // last: 'daLasten',
    // first: 'daFirsten',
    // previous: 'daPreviousen',
    // loadingOoo: 'daLoading...',
    //
    // filterOoo: 'daFilter...',
     equals: '等于',
     notEqual: '不等于',
     //dateFormatOoo: 'daYyyy-mm-dd',
     lessThan: '小于',
     greaterThan: '大于',
    // lessThanOrEqual: 'daLessThanOrEqual',
    // greaterThanOrEqual: 'daGreaterThanOrEqual',
     inRange: '范围',
     inRangeStart: '开始时间',
     inRangeEnd: '结束时间',
    // contains: 'daContains',
    // notContains: 'daNotContains',
    // startsWith: 'daStarts dawith',
    // endsWith: 'daEnds dawith',
     andCondition: '和',
     orCondition: '或',
     // applyFilter: '确定',
    // resetFilter: 'daReset',
    // clearFilter: 'daClear',
    // group: 'laGroup',
    // columns: 'laColumns',
    // filters: 'laFilters',
    // rowGroupColumns: 'laPivot Cols',
     rowGroupColumnsEmptyMessage: '把列拖到这分组',
    // valueColumns: 'laValue Cols',
    // pivotMode: 'laPivot-Mode',
    groups: '组',
    // values: 'laValues',
    // pivots: 'laPivots',
    // valueColumnsEmptyMessage: 'la drag cols to aggregate',
    // pivotColumnsEmptyMessage: 'la drag here to pivot',
    // toolPanelButton: 'la tool panel',
    //
    // enabled: 'laEnabled',
    //
    //
     expandAll: '展开',
     collapseAll: '收起',
    // toolPanel: 'laTool Panelo',
    // export: 'laExporto',
    // csvExport: 'laCSV Exportp',
    // excelExport: 'laExcel Exporto (.xlsx)',
    // excelXmlExport: 'laExcel Exporto (.xml)',
    // pivotChartAndPivotMode: 'laPivot Chart & Pivot Mode',
    // pivotChart: 'laPivot Chart',
    // chartRange: 'laChart Range',
    // columnChart: 'laColumn',
    // groupedColumn: 'laGrouped',
    // stackedColumn: 'laStacked',
    // normalizedColumn: 'la100% Stacked',
    // barChart: 'laBar',
    // groupedBar: 'laGrouped',
    // stackedBar: 'laStacked',
    // normalizedBar: 'la100% Stacked',
    // pieChart: 'laPie',
    // pie: 'laPie',
    // doughnut: 'laDoughnut',
    // line: 'laLine',
    // xyChart: 'laX Y (Scatter)',
    // scatter: 'laScatter',
    // bubble: 'laBubble',
    // areaChart: 'laArea',
    // area: 'laArea',
    // stackedArea: 'laStacked',
    // normalizedArea: 'la100% Stacked',
    //
    // sum: 'laSum',
    // min: 'laMin',
    // max: 'laMax',
    // none: 'laNone',
    // count: 'laCount',
    // average: 'laAverage',
    // filteredRows: 'laFiltered',
     selectedRows: '当前选中',
    // totalRows: 'laTotal Rows',
     totalAndFilteredRows: '本页',
     copy: '复制',
    // copyWithHeaders: 'laCopy With Headers',
    // ctrlC: 'laCtrl n C',
     paste: '粘贴',
    // ctrlV: 'laCtrl n V',
    // pivotChartTitle: 'laPivot Chart',
    // rangeChartTitle: 'laRange Chart',
    // settings: 'laSettings',
    // data: 'laData',
    // format: 'laFormat',
    // categories: 'laCategories',
    // defaultCategory: '(laNone)',
    // series: 'laSeries',
    // xyValues: 'laX Y Values',
    // paired: 'laPaired Mode',
    // axis: 'laAxis',
    // color: 'laColor',
    // thickness: 'laThickness',
    // xType: 'laX Type',
    // automatic: 'laAutomatic',
    // category: 'laCategory',
    // number: 'laNumber',
    // time: 'laTime',
    // xRotation: 'laX Rotation',
    // yRotation: 'laY Rotation',
    // ticks: 'laTicks',
    // width: 'laWidth',
    // length: 'laLength',
    // padding: 'laPadding',
    // chart: 'laChart',
    // title: 'laTitle',
    // background: 'laBackground',
    // font: 'laFont',
    // top: 'laTop',
    // right: 'laRight',
    // bottom: 'laBottom',
    // left: 'laLeft',
    // labels: 'laLabels',
    // size: 'laSize',
    // minSize: 'laMinimum Size',
    // maxSize: 'laMaximum Size',
    // legend: 'laLegend',
    // position: 'laPosition',
    // markerSize: 'laMarker Size',
    // markerStroke: 'laMarker Stroke',
    // markerPadding: 'laMarker Padding',
    // itemPaddingX: 'laItem Padding X',
    // itemPaddingY: 'laItem Padding Y',
    // strokeWidth: 'laStroke Width',
    // offset: 'laOffset',
    // offsets: 'laOffsets',
    // tooltips: 'laTooltips',
    // callout: 'laCallout',
    // markers: 'laMarkers',
    // shadow: 'laShadow',
    // blur: 'laBlur',
    // xOffset: 'laX Offset',
    // yOffset: 'laY Offset',
    // lineWidth: 'laLine Width',
    // normal: 'laNormal',
    // bold: 'laBold',
    // italic: 'laItalic',
    // boldItalic: 'laBold Italic',
    // predefined: 'laPredefined',
    // fillOpacity: 'laFill Opacity',
    // strokeOpacity: 'laLine Opacity',
    // columnGroup: 'laColumn',
    // barGroup: 'laBar',
    // pieGroup: 'laPie',
    // lineGroup: 'laLine',
    // scatterGroup: 'laScatter',
    // areaGroup: 'laArea',
    // groupedColumnTooltip: 'laGrouped',
    // stackedColumnTooltip: 'laStacked',
    // normalizedColumnTooltip: 'la100% Stacked',
    // groupedBarTooltip: 'laGrouped',
    // stackedBarTooltip: 'laStacked',
    // normalizedBarTooltip: 'la100% Stacked',
    // pieTooltip: 'laPie',
    // doughnutTooltip: 'laDoughnut',
    // lineTooltip: 'laLine',
    // groupedAreaTooltip: 'laGrouped',
    // stackedAreaTooltip: 'laStacked',
    // normalizedAreaTooltip: 'la100% Stacked',
    // scatterTooltip: 'laScatter',
    // bubbleTooltip: 'laBubble',
    // noDataToChart: 'laNo data available to be charted.',
    // pivotChartRequiresPivotMode: 'laPivot Chart requires Pivot Mode enabled.',
  },
  downLoadList:[],
  caseIdList:[],
  tmCaseTypeIdList:[],
  userList:[],
  allUserList:[],
  mailFlag:false,
  patentCaseTypeList: [],
  patentCaseTypeIdList: []
}

const mutations = {
  SET_JYLIST: (state, list) => {
    state.jyList = list
  },
  SET_RIGHT_DRAWER_WIDTH: (state, width) => {
    state.rightDrawerWidth = width
  },
  SET_POSITIONINFO: (state, posObj) => {
    if(state.positionInfoList.find(item => item.name === posObj.name)){
      state.positionInfoList.find(item => item.name === posObj.name).scrollDistance = posObj.scrollDistance;
      state.positionInfoList.find(item => item.name === posObj.name).currentRowIndex = posObj.currentRowIndex;
    }else{
      state.positionInfoList.push(posObj)
    }

  },
  SET_CLEAR_SCROLL_ROWINDEX: (state, name) => { // 同一路由不同表格之间的切换(如：官方通知不同案件tab页面)，可以调此方法重置定位
    if(state.positionInfoList.find(item => item.name === name)){
      state.positionInfoList.find(item => item.name === name).scrollDistance = 0
      state.positionInfoList.find(item => item.name === name).currentRowIndex = 0
    }
  },
  SET_PROGRESS: (state, progressObj)=>{
    if(state.progressList.length){
      if(state.progressList.find(item=>item.path == progressObj.path)){
        state.progressList.find(item=>item.path == progressObj.path).progress = progressObj.progress
      }
    }else{
      state.progressList.push(progressObj)
    }
  },
  DEL_PROGRESS: (state, props) => {
    state.progressList.splice(state.progressList.findIndex(item=>item.path == props), 1)
  },
  UPDATE_LIST:(state, flag)=>{
    state.isUpdateList = flag
  },
  SET_MAILFLAG:(state,flag)=>{
    state.mailFlag=flag
  },
  SET_TODOTASKCASEID:(state,toDoTaskCaseId)=>{
    state.toDoTaskCaseId = toDoTaskCaseId
  },
  SET_TMCASETYPELIST:(state,tmCaseTypeList)=>{
    state.tmCaseTypeList = tmCaseTypeList
  },
  SET_TODOTASKID:(state,toDoTaskId)=>{
    state.toDoTaskId = toDoTaskId
  },
  SET_TODOTASKNAME:(state,toDoTaskName)=>{
    state.toDoTaskName = toDoTaskName
  },
  SET_CASETYOELIST: (state, caseTypeList) => {
    state.caseTypeList = caseTypeList
    let arr = JSON.parse(JSON.stringify(caseTypeList))
    let tmTypeList= arr.splice(arr.findIndex(item=>item.caseType=='商标'),1)
    state.tmCaseTypeList =[...getMenuName(tmTypeList).map(item=>item.caseType),'商标行政诉讼']
    state.tmCaseTypeIdList =[...getMenuName(tmTypeList).map(item=>item.caseTypeId),94]

    let patentTypeList = arr.splice(arr.findIndex(item=>item.caseType=='专利'),1)
    state.patentCaseTypeList =[...getMenuName(patentTypeList).map(item=>item.caseType)]
    state.patentCaseTypeIdList =[...getMenuName(patentTypeList).map(item=>item.caseTypeId)]
    // let arr = caseTypeList
    //  arr[2] = []
    // let typeList = []
    // let recursiveFunction = (a)=>{
    //     const getObj = (arr)=>{
    //       arr.forEach(function(row){
    //       if(row.childrens){
    //         // console.log('++++++++rowchild+++++++')
    //         // console.log(row)
    //         typeList.push(row.caseType)
    //         getObj(row.childrens)
    //       }else {
    //         // console.log('++++++roe')
    //         console.log(row)
    //         typeList.push(row.caseType)
    //       }
    //     })
    //     }
    //     getObj(a)
    //   return typeList
    // //     console.log('+++++3333333++++++++++')
    // // console.log(recursiveFunction(typeList))
    // // console.log('+++++++++++++++')
    // }
    // localStorage.setItem('litigationCaseTypeList', JSON.stringify(recursiveFunction(arr).filter(i=>i!='商标行政诉讼')))
  },
  SET_CASEIDLIST:(state,caseIdList)=>{
    state.caseIdList = caseIdList
  },
  PUSH_DOWNLOADLIST:(state,item)=>{
    state.downLoadList.unshift(item)
  },
  SET_BUSSID: (state, bussId) => {
    state.bussId = bussId
  },
  SET_FILTERVALUE:(state, filterValue)=>{
    state.filterValue=filterValue
  },
  SET_PREONLYID: (state, preOnlyId) => {
    state.preOnlyId = preOnlyId
  },
  CONTACT_LANGUAGE: (state, contactLanguage) => {
    state.contactLanguage = contactLanguage
  },
  SET_REPORTEDTEMPORARILY: (state, reportedTemporarily) => {
    state.reportedTemporarily = reportedTemporarily
  },
  SET_REPORTEDTEMPORARILYTOTAL:(state, total)=>{
    state.reportedTemporarilyTotal=total
  },
  SET_REPORTEDTEMPORARILYPAGESIZE:(state, size)=>{
    state.pageSize = size
  },
  SET_REPORTEDTEMPORARILYPAGENO:(state, pageNo)=>{
    state.pageNo = pageNo
  },
  SET_SUMMARYDATA:(state, data)=>{
    state.summaryData[data.name] = data.count
  },
  SET_CASEWORKGROUPCHANGELIST:(state, list)=>{
    state.caseWorkgroupChangeList = list
  },
  SET_QUERYTODOTASKLIST:(state, list)=>{
    state.queryToDoTaskList = list
  },
  SET_FLAG:(state, flag)=>{
    state.flag = flag
  },
  SET_HOURS_ID:(state, f) => {
    state.hoursId = f
  },
  SET_WORKTIMESTATUS:(state, f)=>{
    state.workTimeStatus = f
  },
  SET_TOTAL:(state, total)=>{
    state.total = total
  },
  SET_CLOSEFLAG: (state, flag) => {
    state.closeFlag = flag
  },
  SET_ROLELIST: (state, list) => {
    state.roleList = list
  },
  SET_WOKERNO: (state, no) => {
    state.workerNo = no
  },
  SET_USERLIST:(state, userList)=>{
    userList.forEach(item=>{
      item.label=item.fullname

      item.id=item.userId
        item.name=item.fullname
        item.value=item.userId
    })
    state.userList = userList
  },
  SET_ALLUSERLIST:(state, userList)=>{
    userList.forEach(item=>{
      item.label=item.fullname

      item.id=item.userId
      item.name=item.fullname
      item.value=item.userId
    })
    state.allUserList = userList
  },

}

const actions = {
  queryCaseType({commit}) {
    return new Promise((resolve, reject) => {
      queryCaseType().then(response => {
        commit('SET_CASETYOELIST', response.data)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  getUser({commit}){
    return new Promise((resolve, reject) => {
      Promise.all([getUser(),queryUsers()]).then(res=>{
        commit('SET_USERLIST', res[0].data)
        commit('SET_ALLUSERLIST', res[1].data.users)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
 async createSocket({commit,state,dispatch}){
   var flatten = arr => {
     return arr.reduce((result, item) => {
       return result.concat(Array.isArray(item) ? flatten(item) : item)
     }, [])
   }
   let  Socket;
    let no;
   var work = new SharedWorker('worker.js', 'work'),
   worker = work.port;
   worker.start();
   worker.addEventListener('message',async function (res) {
     if(res.data.type=='socket'){
       if(!Socket&&Math.min(...flatten([...res.data.ports]).filter(item=>typeof item=='object').map(item=>Number(item.data)))==no){
         // let list=[ '{"popFlag":0,"msgType":-6,"data":"连接成功, userId=2","success":true,"event":"upWorkMemberEvent","message":"连接成功, userId=2","userId":"2"}',
         //   '{"popFlag":0,"msgType":-6,"data":"连接成功, userId=2","success":true,"event":"messageEvent","message":"连接成功, userId=2","userId":"2"}']

         console.log('该我重启了')
         const tokenID = getToken()
         let { data } = await queryServerIp()
         // Socket=setInterval(()=>{
         //   list.forEach(item=>{
         //     let e = JSON.parse(item)
         //     worker.postMessage({
         //       data: {
         //         value: e
         //       }
         //     });
         //   })
         // },120000)
           // for(var i=0;i<256;i++) {
         commit('SET_WOKERNO',no)
             Socket = new WebSocketClass(`${data.ServerIP}:9643/websocket/${tokenID}`, (SocketData) => {
               if (SocketData != 'ping') {
                 let e = JSON.parse(SocketData)
                 worker.postMessage({
                   data: {
                     value: e
                   }
                 });

               }
             }, 60000)
           // }
         Vue.prototype.$Socket=Socket;
       }
       return
     }
     if(res.data.includes('我是新用户编号')){
       no=res.data.replace('我是新用户编号','')
       worker.postMessage({
         status: 1,
         no,
       });
       //向workers.js发送消息
       worker.postMessage({data:{
           value:{
             message: "连接成功, userId=2",
             msgType: -6,
             popFlag: 0,
             success: true,
             event:'messageEvent',
             }
         }})
       worker.postMessage({data:{
           value: {
             event: "upWorkMemberEvent",
             message: "连接成功, userId=2",
             msgType: -6,
             popFlag: 0,
             success: true
           }
         }})
       worker.postMessage({data:{
           value: {
             event: "taskEvent",
             message: "连接成功, userId=2",
             msgType: -6,
             popFlag: 0,
             success: true
           }
         }})


       return
     }
     let e=res.data[res.data.length-1]
     if(e.event== "workTime"){
       commit('SET_WORKTIMESTATUS', e.status)
     }
     if(e.event== "taskEvent"){
       console.log('新任务',e)
       if(e.success && !e.message.includes('连接成功')){
         dispatch('user/getTodoTaskNotice',null, { root: true });
         if(e.popFlag==1){ //popFlag==1为更新成功
           // dispatch('user/getTodoTaskNotice',null, { root: true });
           let a = Notification({
             title: '提示',
             message: e.message,
             duration: 0,
             onClick:()=>{
                closeA(e)
             }
           });
           const closeA = (e)=>{
             // console.log('router',window.location)
             modifyTaskMessage({taskIdList: [e.taskId]}).then(()=>{
               commit('SET_FLAG', true)
               // const tokenID = getToken()

               // queryToDoTask({tokenID: tokenID,pageSize: 10000000}).then(res=>{
               //   commit('SET_QUERYTODOTASKLIST', res.data.filter(item=>item.nextOperation!=1))
               //   commit('SET_FLAG', true)
               // })
             })
             a.close()
             if(window.location.href.includes('/workbench/toDoTask')){return}
             localStorage.setItem('toDoTasksChildren',6)
             window.open('/#/workbench/toDoTask')
           }
           // Message.success(`${e.message}`)
         }
         const tokenID = getToken()

         queryToDoTask({tokenID: tokenID,pageSize: 10000000}).then(res=>{
           commit('SET_QUERYTODOTASKLIST', res.data.filter(item=>item.nextOperation!=1))
           commit('SET_FLAG', true)
         })
       } else if(!e.message.includes('连接成功')) {
         Message.error(`${e.message}`)
       }

     }
     if (e.event === 'emailEvent') {
       queryMailList({msg:1000,pageSize: state.pageSize, pageNo: state.pageNo}).then(res=>{
         commit('SET_MAILFLAG', true)
         commit('SET_REPORTEDTEMPORARILY', res.data)
         commit('SET_REPORTEDTEMPORARILYTOTAL', res.total)
       })
     }
     if(e.event=='messageEvent'){
       console.log('messageEvent',e)
       if(e.success){
         if(e.popFlag==1){ //total==1为更新成功
           Message.success(`${e.message}`)
         }
       }
       // queryMailList({msg:1000,pageSize: state.pageSize, pageNo: state.pageNo}).then(res=>{
       //   commit('SET_MAILFLAG', true)
       //   commit('SET_REPORTEDTEMPORARILY', res.data)
       //   commit('SET_REPORTEDTEMPORARILYTOTAL', res.total)
       //   // flashTitlePlayer.start(`${res.total}`)
       // })
       // if(e.mailInfoList){
       //  // commit('SET_REPORTEDTEMPORARILY',e.mailInfoList)
       // }
     }
     if(e.event=='custCaseEvent'){
       const h = Vue1.$createElement
       const clickMessage = () => {
         Notification.closeAll()
         router.push('/workbench/toDoTask?name=11')
       }
       Notification({
         title: '通知',
         message: h('div', {
           style: {
             cursor: 'pointer'
           },
           on: {
             click: clickMessage
           }
         }, e.message),
         type: 'success',
         duration: 0
       });
     }
     if(e.event=='upWorkMemberEvent'){
       if(e.success){
         if(e.total==1){ //total==1为更新成功
           Message.success(`${e.message}`)
         }
       } else {
         Message.error(`${e.message}`)
       }
       e.updateFlag && getCaseWorkgroupChangeMessage().then(res=>{
         commit('SET_CASEWORKGROUPCHANGELIST', res.data)
       })
     }
     if(e.event=='docEvent'){
       let confirmText = e.message.split('$')
       const newDatas = []
       const h = Vue1.$createElement
       for (const i in confirmText) {
         newDatas.push(h('p', null, confirmText[i]))
       }
       if(e.success){
         Notification({
           title: '通知',
           message: h('div', null, newDatas),
           type: 'success',
           duration: 0
         });
       } else {
         Notification({
           title: '通知',
           message: h('div', null, newDatas),
           duration: 0,
           type: 'error'
         });
       }
     //  通知列表刷新
       commit('UPDATE_LIST', true)
     }
     //更新权限
     if(e.event=='upPermissionEvent'){
       getInfo().then(res => {
         const {
            permissions,
          } = res.data
         commit('user/SET_PERMISSIONS', [...permissions.map(item => item.id)], {root: true})

       })
     }

   });
   worker.postMessage({
     status: 0,
   });
   setInterval(()=>{
     worker.postMessage({
       status: 2,
       no,
     });
   },5000)
   // console.log(Socket);
   // Vue.prototype.$Socket=Socket;
   function heartbeat() {
     worker.postMessage({
       'status': 'heartbeat',
       'data': no
     })
   }
   heartbeat()
   setInterval(() => {
     heartbeat()
   }, 3000)
   // if(!localStorage.getItem('portId')){
   //
   //   localStorage.setItem('portId','1')
   //
   // } else {
   //   localStorage.setItem('portId',(Number(localStorage.getItem('portId'))+1)+'')
   // }

   Vue.prototype.$worker = worker
   // console.log(Socket);
   // const WSS_URL = `ws://${data.ServerIP}:9643/websocket/${tokenID}`
   // let Socket = ''
   // Socket = socketio.connect(WSS_URL,(e)=>{
   //   console.log('链接成功',e)
   //   console.log(Socket);
   // });
   // Socket.on('messageEvent',(e)=>{
   //   if(e.success){
   //     if(e.popFlag==1){ //total==1为更新成功
   //       Message.success(`${e.message}`)
   //     }
   //   } else {
   //     Message.error(`${e.message}`)
   //   }
   //   queryMailList({msg:1000,pageSize: state.pageSize, pageNo: state.pageNo}).then(res=>{
   //     commit('SET_REPORTEDTEMPORARILY', res.data)
   //     commit('SET_REPORTEDTEMPORARILYTOTAL', res.total)
   //   })
   //   // if(e.mailInfoList){
   //   //  // commit('SET_REPORTEDTEMPORARILY',e.mailInfoList)
   //   // }
   // })
   // Socket.on('upWorkMemberEvent',(e)=>{
   //   if(e.success){
   //     if(e.total==1){ //total==1为更新成功
   //       Message.success(`${e.message}`)
   //     }
   //   } else {
   //     Message.error(`${e.message}`)
   //   }
   //   getCaseWorkgroupChangeMessage().then(res=>{
   //     commit('SET_CASEWORKGROUPCHANGELIST', res.data)
   //   })
   // })
   // Socket.on('docEvent',(e)=>{
   //   if(e.success){
   //     Notification({
   //       title: '通知',
   //       message: e.message,
   //       type: 'success',
   //       duration: 0
   //     });
   //   } else {
   //     Notification({
   //       title: '通知',
   //       message: e.message,
   //       duration: 0,
   //       type: 'error'
   //     });
   //   }
   // })

   // const WSS_URL = `http://210.12.116.124:9643?tokenID=${tokenID}`

  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
