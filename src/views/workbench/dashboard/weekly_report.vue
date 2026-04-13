<template>
  <div class="container">
    <div class="header">
      <div class="header-left">
        <span>合伙人周报</span>
        <img src="@/assets/工作周报.svg" alt="工作周报">
      </div>

      <div class="header-right" style="cursor:pointer;">
        <div class="right-desc">
          <el-popover
            placement="left-start"
            title="界面说明"
            width="300"
            trigger="hover"
            content="界面支持对合伙人进行周数据统计，可点击查看详细数据">
            <div slot="reference">
              <i class="el-icon-question"></i>
              <span>界面说明</span>
            </div>
          </el-popover>
        </div>
        <div class="right-desc" @click="handleFullScreen">
          <svg-icon class="chart-icon chart-enlarge" icon-class="全屏"/>
          <span>{{ fullscreen ? '退出全屏':'全屏查看'}}</span>
        </div>
      </div>
    </div>
    <div class="main">
      <div class="main-list">
        <div class="hrm-search">
          <el-select v-model="reportUserId" @change="handleSearch" style="width: 120px" size="small" filterable clearable placeholder="合伙人">
            <el-option
              v-for="item in userList"
              :key="item.userId"
              :label="item.userFullName"
              :value="item.userId">
            </el-option>
          </el-select>
<!--          <DateWeekRange-->
<!--            v-model="createDateArray"-->
<!--            start-placeholder="开始日期"-->
<!--            end-placeholder="结束日期"-->
<!--            :picker-options="{ firstDayOfWeek: 1 }"-->
<!--            format="yyyy-MM-dd/WW周"-->
<!--            value-format="yyyy-MM-dd"-->
<!--            @change="handleSearch"-->
<!--          ></DateWeekRange>-->
          <DateRange v-model="createDateArray" style="margin-right: 10px;" @change="handleWeekChange"></DateRange>
          <!-- <el-date-picker
            style="width: 300px;"
            v-model="weekDate"
            type="week"
            :format="weekFormat + ' / WW 周'"
            value-format="yyyy-MM-dd"
            placeholder="选择周"
            :picker-options="pickerOptions"
            @change="handleWeekChange">
          </el-date-picker> -->
          <span>详情：</span>
          <el-button size="mini" @click="handleAllDetails(true)">全部展开</el-button>
          <el-button size="mini" @click="handleAllDetails(false)">全部收起</el-button>
          <el-button size="mini" @click="scoringVisible = true">打分规则</el-button>
<!--          <el-button size="mini" @click="companyNewsVisible = true">公司快讯</el-button>-->
<!--          <el-button v-if="this.$store.getters.permissions.includes(393)" size="mini" @click="newsVisible = true">快讯发布</el-button>-->
          <div style="float: right">
<!--            <el-button v-if="this.$store.getters.permissions.includes(393)" type="text" @click="weekNews()" >导出快讯</el-button>-->
            <el-button v-if="this.$store.getters.permissions.includes(373)" type="text" @click="deriveList()" >导出周报</el-button>
            <!--            <el-button type="text" @click="exportList(2)" >导出简表</el-button>-->
            <!--            <span style="color: #52A2F4;margin: 0 5px"> / </span>-->
            <!--            <el-button type="text" @click="exportList(1)">导出详情</el-button>-->
          </div>
        </div>
        <section>
          <div class="w-table">
            <div class="dots" @click="handleCheckboxState">
              <span class="dot">.</span>
              <span class="dot">.</span>
              <span class="dot">.</span>
            </div>
<!--            <el-button class="brush_right" :class="brushRightHasFilter?'red':''" @click="brushRight" type="text" icon="el-icon-brush" ></el-button>-->
            <AgGridVue :style="{width:'100%',height: fullScreenHeight+'px'}"
                       class="ag-theme-balham"
                       :columnDefs="columnDefs"
                       :rowData="list"
                       rowSelection="multiple"
                       @grid-ready="onGridReady"
                       :gridOptions="gridOptions"
                       @dragStopped="dragStopped"
                       :getContextMenuItems="getContextMenuItems"
                       suppressAutoSize
                       animateRows
                       @cellClicked="onCellClicked"
                       @sortChanged="refreshEvenRowsCurrencyData"
                       @filterChanged="refreshEvenRowsCurrencyData"
                       :localeText="$store.state.caseInformation.localeText"
                       :suppressDragLeaveHidesColumns="true"
                       :suppressMakeColumnVisibleAfterUnGroup="true"
                       :groupSelectsChildren="true"
                       :suppressAggFuncInHeader="true"
                       :frameworkComponents="frameworkComponents"
                       @drop.native.stop.prevent="enentDrop($event)"
                       @dragover.native.stop.prevent="hoverState=true"
                       @dragleave.native.stop.prevent="hoverState=false"
                       @dragenter.native.stop.prevent="hoverState=true"
                       :rowHeight="34"
                       :masterDetail="true"
                       :isRowMaster="isRowMaster"
                       :detailRowAutoHeight="true"
                       :detailCellRendererParams="detailCellRendererParams"
                       keepDetailRows
                       :getRowHeight="getRowHeight"

            >
            </AgGridVue>

            <div class="checkbox" v-if="checkboxState">
              <el-select v-model="checkCaseList" multiple  reserve-keyword filterable  placeholder="请选择"  collapse-tags @visible-change="handleChange"  :filter-method="filterCheck">
                <template slot="">
                  <div class="checkbox_bottom" >
                    <el-button size="mini" round @click.stop="delPreference(1)">恢复默认</el-button>
                    <el-button style="margin-right: 3px" size="mini" round @click.stop="savePreference(1)">保存设置</el-button>
                  </div>
                </template>
                <el-option
                  v-for="item in selectColumnList.filter(item =>item.COLUMN_COMMENT.includes(filterText))"
                  :key="item.COLUMN_NAME"
                  :label="item.COLUMN_COMMENT"
                  :value="item.COLUMN_NAME">
                </el-option>
              </el-select>
            </div>
          </div>
        </section>

        <!--    导出-->
        <SelectOption
          :buss-id="bussId"
          v-if="selectionOptionState"
          :dialog-visible="selectionOptionState"
          @cancel="closeSelect"
          :idArray="getCurrentRowsData('userId')"
          :defaultMultipleSelect="preferenceList.map(i=>i.title)"
          :exportType="exportType"
          :exportQueryModel="exportQueryModel"></SelectOption>
      </div>
    </div>
    <el-dialog title="周报打分规则" :visible.sync="scoringVisible" width="50%">
      <scoringRules @closeDialog="scoringVisible = false"></scoringRules>
    </el-dialog>

    <el-dialog title="公司快讯" :visible.sync="companyNewsVisible" width="35%">
      <companyNewsList v-if="companyNewsVisible" @closeNewsDialog="companyNewsVisible = false"></companyNewsList>
    </el-dialog>

    <el-dialog :title="'快讯发布 '+ weekFormat" :visible.sync="newsVisible" width="70%">
      <newsList v-if="newsVisible" :date-array="createDateArray" @closeNewsDialog="newsVisible = false"></newsList>
    </el-dialog>

    <el-dialog :title="fractionName+' - 周报打分'" :visible.sync="manualScoringVisible" width="25%">
      <el-form ref="form" label-width="80px">
        <el-form-item label="打分日期">
          <span>{{createDateArray[0]}} - {{createDateArray[1]}}</span>
        </el-form-item>
        <el-form-item label="分数">
          <el-input v-model="fraction" type="number"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="manualScoringVisible=false">取消</el-button>
          <el-button type="primary" @click="manualScoring">打分</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import SelectOption from '@/views/workbench/case/components/SelectOption'
import { queryReportList, queryReportDetail, manualScoring, createWeekReportDoc } from '@/api/dashboard.js'
import { queryHehuoren } from '@/api/customerList.js'
import { selectColumn, queryPreference, delPreference, savePreference, deriveList} from '@/api/caseList.js'
import Summary from "@/components/Summary/index.js";
import DateWeekRange from 'date-week-range';
import {formatDate} from '@/utils'
import {doEditInOffice, getProgID} from '@/utils/editInOffice.js'
import dateRangUtil from '@/utils/dateRangUtil'
import scoringRules from './components/weeklyReport/scoringRules'
import newsList from './components/weeklyReport/newsList'
import companyNewsList from './components/weeklyReport/companyNewsList'
export default {
  name: 'weekly_report',
  data() {
    var tableHeader=[]
    if(localStorage.getItem('tableHeader')&&JSON.parse(localStorage.getItem('tableHeader')).find(item=>item.name==this.$options.name)){
      tableHeader = JSON.parse(localStorage.getItem('tableHeader')).find(item => item.name == this.$options.name).tableHeader
    }
    return {
      exportQueryModel: {},
      exportType: 0,
      selectionOptionState: false,
      reportUserId: '',
      wpId: '',
      fraction: '',
      fractionName: '',
      userList: [], // 用户列表
      createDateArray: [],
      weekDate: '',
      weekFormat: '',
      pickerOptions: {
        firstDayOfWeek: 1,
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6
        },
        shortcuts: [
          // 获取本年已过周数的数组，倒序排列
          ...Array(this.getWeekNumber(new Date())).fill().map((_, i) => i + 1).reverse()
            .map(week => ({
              text: `第${week}周`,
              onClick: picker => {
                picker.$emit('pick', this.getWeekRange(week))
              }
            }))
        ]
      },
      hoverState:false,
      curFile:[],
      list:[], //表格数据
      brushRightHasFilter:false,
      frameworkComponents:{
        CountStatusBarComponent:Summary
      },
      tableTitleList: [
        {'title': '活动', 'value': 'huodong', 'width': 500, 'flex': 3, 'cellClass': 'huodong-color'},
        {'title': '商机', 'value': 'shangji', 'width': 400, 'flex': 2,'cellClass': 'shangji-color'},
        {'title': '新开拓客户', 'value': 'newCust', 'flex': 1, 'cellClass': 'newCust-color'}
      ],
      tableTitleList2: [],
      gridApi:{},
      columnDefs: [], //定义列
      selectedColumn: {},
      gridOptions:{
        statusBar: {
          statusPanels: [
            { statusPanel: 'agTotalAndFilteredRowCountComponent', align: 'left' },
            { statusPanel: 'agSelectedRowCountComponent', align: 'left' } // 总和过滤的行数组件
          ]
        },
        // 列选择效果代码（暂不用）
        // defaultColDef: {
        //   cellStyle: params => {
        //     if (params.colDef === this.selectedColumn) {
        //       return { 'background-color': '#b7e4ff' };
        //     }
        //   },
        // },
        // onCellFocused: params => {
        //   // 初始值
        //   if (params.column) {
        //     this.selectedColumn = params.column.colDef;
        //     params.api.redrawRows();
        //   }
        // },
      },
      detailCellRendererParams: {
        detailGridOptions: {
          rowSelection: 'multiple',
          columnDefs: [],
          rowHeight: 28,
          resizable: true,
          getContextMenuItems: this.getContextMenuItemsChild,
        },
        getDetailRowData: params => {
          // 数据插入
          this.queryDataInfo(params)
        },
      },
      listLoading:false,
      queryModuleData: {}, //搜索条件
      total:0, //全部数
      multipleSelection:[],
      dialogVisible: false,
      scoringVisible: false, // 评分
      companyNewsVisible: false, // 公司快讯
      newsVisible: false, // 快讯发布
      manualScoringVisible: false, // 手动评分
      operationState:1,
      examineState:false,
      checkboxState:false, //复选框状态
      userId: this.$store.getters.userId,
      bussId: 82,
      advanced: true, // 是否高级合伙人
      preferenceList: [], //内容展示列
      selectColumnList: [], //选择列列表
      checkCaseList: [], //循环列表数据
      tableHeader: tableHeader,
      tableHeaderLabelList:[],
      dragState: {
        start: -1, // 起始元素的 index
        end: -1, // 结束元素的 index
        move: -1, // 移动鼠标时所覆盖的元素 index
        dragging: false, // 是否正在拖动
        direction: undefined // 拖动方向
      },
      drawerState: false,
      filterText:'',
      filterDataSum:{},
      fullscreen: false,
      defaultHeight: document.documentElement.clientHeight - 150,
      fullScreenHeight: document.documentElement.clientHeight - 150, // 全屏高度
    }
  },
  created() {
    if (this.userId !== 2) {
      this.advanced = this.$store.getters.roles.some(item => item.roleId === 1);  // 判断是否高级合伙人
    }
    this.getLastWeek()
    this.queryHehuoren()
    this.handleSearch()
    this.getAllWfs()
  },
  methods: {
    getFirstWeekStartDate(year) {
      const date = new Date(year, 0, 1);
      const dayOfWeek = date.getDay();
      return new Date(year, 0, 1 + (dayOfWeek <= 4 ? 1 - dayOfWeek : 8 - dayOfWeek));
    },
    getWeekRange(week) {
      const now = new Date();
      const year = now.getFullYear();
      const firstWeekStartDate = this.getFirstWeekStartDate(year);
      const startOffset = firstWeekStartDate.getDay();
      const startDate = new Date(year, 0, firstWeekStartDate.getDate() + (week - 1) * 7 - startOffset+1);
      const endDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + 6);
      if (firstWeekStartDate.getFullYear() < year) {
        return null;
      }
      this.createDateArray = [formatDate(startDate),formatDate(endDate)]
      this.weekFormat = formatDate(startDate) + ' - ' + formatDate(endDate)
      const weekDate = formatDate(new Date(startDate.getTime() + (24 * 60 * 60 * 1000)));
      this.weekDate = weekDate
      return weekDate
    },
    getWeekNumber(date) {
      const onejan = new Date(date.getFullYear(), 0, 1)
      return Math.floor(((date - onejan) / 86400000 + onejan.getDay() + 1) / 7)
    },
    handleWeekChange(e) {
      if (e) {
        // let start = new Date(e).setDate((new Date(e).getDate() - 1));
        // let end = new Date(start).setDate((new Date(start).getDate() + 6));
        // this.createDateArray = [formatDate(start),formatDate(end)]
        // this.weekFormat = formatDate(start) + ' - ' + formatDate(end)
        this.createDateArray = e
        this.handleSearch()
      }
    },
    getRowHeight(params) {
      const isDetailRow = params.node.detail;
      // for all rows that are not detail rows, return nothing
      if (!isDetailRow) { return undefined; }
      const detailPanelHeight = (params.data.maxCount * 28) + 56;
      return detailPanelHeight;
    },
    // 日期处理，获取上周时间
    getLastWeek(){
      var now=new Date();
      var start=new Date();
      start.setDate(now.getDate()-7);
      var lastWeek = new dateRangUtil(start).getCurrentWeek()
      this.weekDate = formatDate(lastWeek[0])
      this.createDateArray = [formatDate(lastWeek[0]),formatDate(lastWeek[1])]
      this.weekFormat = formatDate(lastWeek[0]) + ' - ' + formatDate(lastWeek[1])
    },
    // 全部展开,收起
    handleAllDetails(status) {
      this.gridApi.rowModel.rootNode.childrenAfterFilter.forEach(item => {
        setTimeout(() => {
          item.setExpanded(status)
        }, 0)
      })
    },
    // 获取详细数据
    queryDataInfo(params){
      queryReportDetail({
        userId: params.data.userId,
        createDateArray: this.createDateArray
      }).then(res => {
        if (res.data.second){
          const reportData = res.data.second[0]
          const data = Object.values(res.data.second[0])
          let listLength = 0
          const dataList = []
          data.forEach(item=>{
            listLength = item.length > listLength ? item.length : listLength
          })
          for (let i = 0; i < listLength; i++) {
            var list = {huodong: '',shangji: '',newCust: ''}
            if (reportData.huodongList[i]) {
              var huodongList = reportData.huodongList[i]
              list.huodong = huodongList.workTypeName + ( huodongList.time ? '; '+ huodongList.time :'') + (huodongList.custName ? '; '+huodongList.custName : '') +(huodongList.workContent ? '; '+ huodongList.workContent : '')
            }
            if (reportData.shangjiList[i]) {
              var shangjiList = reportData.shangjiList[i]
              list.shangji = '来源：'+ (shangjiList.laiyuan ? shangjiList.laiyuan : '') +'; 客户: '+ (shangjiList.custName ? shangjiList.custName : '') +'; 描述: '+ (shangjiList.sjdesc ? shangjiList.sjdesc : '')
            }
            if (reportData.newCustList[i]) {
              var newCustList = reportData.newCustList[i]
              list.newCust = newCustList.custName ? newCustList.custName : ''
            }
            dataList.push(list)
          }
          console.log('dataList',dataList)
          dataList && params.successCallback(dataList);
        }
        // res.data.first && params.successCallback(res.data.first);
      })
    },
    // 获取合伙人列表
    queryHehuoren(){
      queryHehuoren().then(res=>{
        this.userList = res.data
      })
    },
    // 全屏事件
    handleFullScreen(){
      let element = document.documentElement;
      // 判断是否已经是全屏
      // 如果是全屏，退出
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
        this.fullScreenHeight = this.defaultHeight
      } else {    // 否则，进入全屏
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen();
        }
        this.fullScreenHeight = 927
      }
      // 改变当前全屏状态
      this.fullscreen = !this.fullscreen;
    },
    closeSelect() {
      this.selectionOptionState = false
    },
    getCurrentRowsData(key){
      if (this.gridApi && this.gridApi.rowModel) {
        return this.gridApi.rowModel.rootNode.childrenAfterSort.map(item => item.data).map(item => item[key])
      }
      return []
    },
    // 导出快讯
    weekNews() {
      createWeekReportDoc({createDateArray:this.createDateArray}).then(res=>{
        if (res.data){
          if (getProgID(`${res.data.address}`)) {
            doEditInOffice(`${res.data.address}`, getProgID(`${res.data.address}`))
          }
        }else{
          this.$message('导出快讯失败！');
        }
      })
    },
    // 导出周报
    deriveList() {
      deriveList({createDateArray:this.createDateArray,bussId:84}).then(res=>{
        this.downLoad(res.data)
      })
    },
    // 附件下载
    downLoad(data) {
      const url = data
      const downData = {
        url: `${url}`,
        success() {
          // notify.close()
        }
      }
      this.$commonUtils.downLoadAll(downData)
    },
    exportList(flag) {
      this.exportType = flag
      this.selectionOptionState = true
    },
    queryRecordList() {
      this.queryModuleData = JSON.parse(localStorage.getItem('queryModuleData')) ? JSON.parse(localStorage.getItem('queryModuleData')).find(item => item.name == this.$options.name) ? JSON.parse(localStorage.getItem('queryModuleData')).find(item => item.name == this.$options.name).queryModuleData : {} : {}
      this.queryModuleData.userId = this.reportUserId
      this.queryModuleData.createDateArray = this.createDateArray
      this.queryList()
    },
    enentDrop(e){
      e.stopPropagation();
      e.preventDefault();
      this.hoverState=false
      this.curFile = e.dataTransfer.files
    },
    // 右侧清理列过滤器
    brushRight(){
      let data = this.$commonUtils.getFilterModel(this.$options.name+this.$route.name,'FilterModel')
      let arr =  Object.keys(data)
      arr.forEach(item=>{
        this.gridApi.destroyFilter(item)
      })
    },
    getFilterModel(){
      this.$nextTick(()=>{
        let data =   this.$commonUtils.getFilterModel(this.$options.name+this.$route.name,'FilterModel')
        let arr =  Object.keys(data)
        let arrInstance=arr.map(item=>this.gridApi.getFilterInstance(item))
        arrInstance.forEach((item,index)=>{
          item.selectNothing()
          item.setModel(data[arr[index]])
          item.applyModel()
        })
        this.gridApi.onFilterChanged()
        let sortData =   this.$commonUtils.getFilterModel(this.$options.name+this.$route.name,'SortModel')
        if(sortData&&sortData.length){
          this.gridApi.setSortModel(sortData)
          this.gridApi.onSortChanged()
        }
      })
    },
    // 创建完成后执行的事件
    onGridReady(params) {
      this.gridparams=params
      this.gridApi = params.api;
      this.columnApi = params.columnApi;
    },
    // 拖动列记录
    dragStopped(params){
      let tableHeader=params.columnApi.columnController.gridColumns.map(item=>({
        label:item.colDef.headerName,
        width:item.actualWidth,
        prop:item.colDef.field,
      })).filter(item=>item.prop!='sid'&&item.prop!="group")
      this.tableHeader=tableHeader
      this.changeHeader(tableHeader)
      this.saveLocation()
    },
    getSidDiv(params) {
      const h = this.$createElement;
      let vnode = h('div', {
          on: {
            click: () => this.rowClicked(params)
          },
        }, [

          h('i', {
            'class': {
              'el-icon-caret-right': true,
              'rotateClass': params.node.expanded
            },

          }),
          h('span', {
            attrs: {
              title: `${params.value}`
            }
          }, [`${params.value}`])
        ]
      )
      const div = document.createElement('div');
      this.__patch__(div, vnode, true, false)
      return div
    },
    rowClicked(params) {
      // console.log('rowClicked',params)
      if (params.node.expanded) {
        params.node.setExpanded(false);
      } else {
        params.node.setExpanded(true);
      }
      this.columnDefs.push({})
      this.columnDefs.pop()
    },
    // 单元(列)渲染器
    cellRenderer(params) {
      // 是否显示展开事件
      if (params.colDef.field == 'userFullName' && params.node.data.hasDetail > 0) {
        return this.getSidDiv(params)
      }
      return `<span title="${params.value}">${params.value ? params.value : ''}</span>`
    },
    // 指定该详细行是否展开
    isRowMaster(dataItem) {
      return dataItem ? dataItem.hasDetail > 0 : false;
    },
    // 设置右键菜单项
    getContextMenuItems(params){
      if(!params.node.data){
        return []
      }
      return this.getRowContextmenuList(params.node.data).map(item=>({
        name: item.name,
        action: () =>{
          this[item.action](params.node.data,params.value)
        }
      }))
    },
    // 获取数量
    getSum(list,type){
      return list.map(item=>item[type]).filter(item=>!!item).reduce((x,y)=>x+y,0)
    },
    // 过滤器功能
    getSummary(list){
      let data={
        total: this.getSum(list,'total'),
      }
      this.$store.commit('caseInformation/SET_SUMMARYDATA',{name:'borrow_list',count:data})
    },
    // 排序/过滤器
    refreshEvenRowsCurrencyData(params) {
      this.getSummary(this.gridApi.rowModel.rootNode.childrenAfterFilter.map(item=>item.data))
      this.currentPageSize = params.api.rowModel.rootNode.allChildrenCount
      if(!params.columnApi.columnController.groupAutoColumns) {
        this.gridApi.forEachNode(rowNode => {
          rowNode.setDataValue(
            'sid',
            rowNode.rowIndex + 1)
        });
      }
      // 过滤器筛选检索判断，扫帚加红
      if(this.list.length){
        // this.$commonUtils.saveFilterModel(this.$options.name+this.$route.name,'FilterModel',this.gridApi.getFilterModel())
        if(params.type=="filterChanged"){
          this.$commonUtils.saveFilterModel(this.$options.name+this.$route.name,'FilterModel',this.gridApi.getFilterModel())
          var data = this.$commonUtils.getFilterModel(this.$options.name + this.$route.name, 'FilterModel');
          var arr = Object.keys(data);
          if(arr.length){
            this.brushRightHasFilter=true
          }else {
            this.brushRightHasFilter=false
          }
        }
        if(params.type=="sortChanged"){
          this.$commonUtils.saveFilterModel(this.$options.name+this.$route.name,'SortModel',this.gridApi.getSortModel())
        }
      }
    },
    // 搜索内容
    filterCheck(val) {
      this.filterText = val;
    },
    // 获取菜单项列表
    getRowContextmenuList(row){
      let list = []
      list = [
        { name: '复制', action: 'copy' },
        // { name: '打分', action: 'grade' }
      ]
      return list.filter(item=> {
        if (item.permissions) {
          return this.$store.getters.permissions.includes(item.permissions)
        }else if(item.permissionsData){
          return item.permissionsData.some(itm=> this.$store.getters.permissions.includes(itm.premission)&&row.taskNo==itm.taskNo)
        }else {
          return true
        }
      })
    },
    copy(row, value) {
      if(value){
        this.$copyText(value).then(
          res => {
          })
      }
    },
    grade(row) {
      if (!this.compareDate(this.createDateArray[0],this.createDateArray[1])){
        this.$message('请选择一周范围查询数据进行打分！');
        return
      }
      this.manualScoringVisible = true
      this.wpId = row.wpId
      this.fraction = row.fenshu
      this.fractionName = row.userFullName
    },
    // 打分提交
    manualScoring() {
      manualScoring({wpId:this.wpId,fenshu:this.fraction}).then(res=>{
        if (res.success){
          this.list.find(item => item.wpId == this.wpId).fenshu = this.fraction
          this.gridApi.refreshCells();
          this.manualScoringVisible = false
          this.$message.success(this.fractionName+'周报打分成功！');
        }
      })
    },
    compareDate(date1, date2) {
      // 1.转为时间戳
      var data1 = Date.parse(new Date(date1.replace(/-/g, "/")));
      var data2 = Date.parse(new Date(date2.replace(/-/g, "/")));
      // 2.时间戳间隔 再加上一天
      var datadiff = data2 - data1 + 86400000;
      // 3.七天间隔
      var time = 7 * 24 * 60 * 60 * 1000;
      // 4.比较两个日期的远近，date2为最近的日期
      // 当间隔日期大于 规定的7天
      if (datadiff > time) {
        return false;
      } else {
        return true
      }
    },
    rowContextmenu(row, column, event) {
      const that=this
      this.$ContextMenu({
        event, // 传入鼠标事件
        menu:this.getRowContextmenuList(row)
      }).then(rs => {
        if(rs){
          this[rs](row, column, event);
        }
      });
    },
    // 获取select行数
    getSelectedRows() {
      if (this.gridApi) {
        const selectedNodes = this.gridApi.getSelectedNodes();
        const selectedData = selectedNodes.map(node => node.data);
        return selectedData
      }

    },
    getContextMenuItemsChild(params) {
      console.log('getContextMenuItemsChild',params)
    },
    // 点击单元格选择,获取详情展示列表和数据
    onCellClicked(params){
      if (params.column) {
        this.rowClicked(params)
        this.selectedColumn = params.column.colDef;
      }
      this.multipleSelection = this.getSelectedRows()
    },
    clickoutside(){
      this.drawerState=false
    },
    // 搜索
    handleSearch(val){
      this.multipleSelection=[]
      this.queryRecordList()
      this.saveQueryModel()
    },
    // 保存查询条件
    saveQueryModel(){
      if(JSON.parse(localStorage.getItem('queryModuleData'))){
        var arr = JSON.parse(localStorage.getItem('queryModuleData'))
      }else {
        var arr = []
      }
      if(arr.find(item=>item.name==this.$route.name)){
        arr.find(item=>item.name==this.$route.name).queryModuleData=this.queryModuleData
      }else {
        arr.push({name:this.$route.name,queryModuleData:this.queryModuleData})
      }
      localStorage.setItem('queryModuleData',JSON.stringify(arr))
    },
    // 清空搜索
    clearSearch(that) {
      for (var key in that.queryModuleData) {
        let list = ['wfStatus']
        if (!list.includes(key)) {
          if (key.includes('Date')) {
            that.$set(that.queryModuleData, key, ['', ''])
          } else if (key.includes('Array') || key.includes('List')) {
            that.$set(that.queryModuleData, key, [])
          } else {
            that.$set(that.queryModuleData, key, null)
          }
        }
      }
    },
    /*左侧展示列设置功能*/
    handleCheckboxState() {
      this.checkboxState = !this.checkboxState
      if (this.checkboxState) {
        this.setWidth()
      }
    },
    setWidth() {
      let timer = setInterval(() => {
        if (this.$el.getElementsByClassName('el-select-dropdown')[0]){
          const els = this.$el.getElementsByClassName('el-select-dropdown')[0]
          const els1 = this.$el.getElementsByClassName('checkbox')[0]
          els1.children[0].click()
          //els.style.width = '100px';
          clearInterval(timer)
        }
      }, 60)
    },
    // 下拉框出现/隐藏式触发
    handleChange(boolean) {
      if (!boolean) {
        this.checkboxState=false
        const els1 = this.$el.getElementsByClassName('checkbox')[0]
        els1.children[0].click()
      }
    },
    // 保存偏好设置
    savePreference(){
      let list2 = this.checkCaseList.map(item => ({ title: this.selectColumnList.find(i => i.COLUMN_NAME === item).COLUMN_COMMENT, value: item }))
      const data={
        userId: this.userId,
        bussId: this.bussId,
        list2
      }
      savePreference(data).then(res => {
        if (res.success) {
          this.checkboxState = false
          this.filterText=''
          this.queryList()
          this.getAllWfs()
        }
      })
    },
    getAllWfs() {
      const data = {
        userId: this.userId,
        bussId: this.bussId
      }
      // 详细数据
      this.detailCellRendererParams.detailGridOptions.columnDefs = [...this.tableTitleList.map(item => ({
        headerName: item.title,
        field: item.value,
        width: item.width,
        cellClass: item.cellClass,
        flex: item.flex,
        sortable: true,
        filter: 'agSetColumnFilter',
        cellRenderer: this.cellRenderer,
        menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
        enableRowGroup: true,
        filterParams: {
          newRowsAction: 'keep',
          comparator: (a, b) => {
            return this.$commonUtils.sort(a, b, item.value)
          }
        }
      }))]

      Promise.all([selectColumn(data), queryPreference(data)]).then(res=>{
        // 判断是否高级合伙人
        if(!this.advanced){
          const excludedColumns = ['custFuze', 'custAmount', 'billAmount', 'feeAmount', 'groupAmount'];
          this.selectColumnList = res[0].data.filter(column => !excludedColumns.includes(column.COLUMN_NAME));
          this.preferenceList = res[1].data.filter(column => !excludedColumns.includes(column.value));
        }else{
          this.selectColumnList = res[0].data
          this.preferenceList = res[1].data
        }
        this.tableHeader = this.preferenceList.map(item=>({ label:item.title, prop:item.value,width: this.getLoactionWidth(item.title)}))
        this.saveLocation()
        this.checkCaseList = this.preferenceList.map(item => item.value)
        this.columnDefs=[...this.preferenceList.map(item=>({
          headerName: item.title,
          field: item.value,
          width:this.getLoactionWidth(item.title)=='auto'?125:this.getLoactionWidth(item.title),
          resizable: true,
          sortable: true,
          filter: 'agSetColumnFilter',
          menuTabs: ['filterMenuTab','generalMenuTab','columnsMenuTab'],
          cellRenderer: this.cellRenderer,
          enableRowGroup: true,
          filterParams: {
            newRowsAction: 'keep',
            comparator: (a, b)=>{
              return this.$commonUtils.sort(a,b,item.value)
            }
          }
        }))]
        this.columnDefs.forEach(item=>{
          if(item.field=='billTime' || item.field=='hdTime' || item.field=='whTime'){
            item.comparator=function (a,b) {
              if (!a && !b) {
                return 0;
              }
              if (!a) {
                return -1;
              }
              if (!b) {
                return 1;
              }

              if (!/^\d+$/.test(a.split(':')[0])&&!/^\d+$/.test(b.split(':')[0])){
                return 0;
              }
              if (!/^\d+$/.test(a.split(':')[0])){
                return -1;
              }
              if (!/^\d+$/.test(b.split(':')[0])){
                return 1;
              }
              return a.split(':')[0] - b.split(':')[0];
            }
          }
        })
        this.$nextTick(() => {
          this.columnDefs.forEach(item => {
            this.columnApi.getColumn(item.field) && this.columnApi.getColumn(item.field).addEventListener('menuVisibleChanged', () => {
              if (document.querySelector(".ag-tabs")) {
                new this.$DraginResize(document.querySelector(".ag-set-filter-list"), {
                  clone: true,
                  end(info) {
                    if (info.dir == 'ver') {
                      this.elem.style.height = info.height + 'px';
                    } else if (info.dir == 'hor') {
                      this.elem.style.width = info.width + 'px';
                    }
                  }
                })
              }
            });
          })
        })
      })
    },
    saveLocation(){
      if(!localStorage.getItem('tableHeader')){
        let arr=[]
        arr.push({name:this.$options.name,tableHeader:this.tableHeader})
        localStorage.setItem('tableHeader',JSON.stringify(arr))
      }else {
        let arr=JSON.parse(localStorage.getItem('tableHeader'))
        if(arr.find(item=>item.name==this.$options.name)){
          arr.find(item=>item.name==this.$options.name).tableHeader= this.tableHeader
          localStorage.setItem('tableHeader',JSON.stringify(arr))
        } else {
          arr.push({name:this.$options.name,tableHeader:this.tableHeader})
          localStorage.setItem('tableHeader',JSON.stringify(arr))
        }
      }
    },
    // 删除偏好设置
    delPreference() {
      const data = {
        userId: this.userId,
        bussId: this.bussId,
      }
      delPreference(data).then(res=>{
        if(res.success){
          this.checkboxState=false
          this.queryList()
          this.getAllWfs()
        }
      })
    },
    unique(data, key) {
      const hash = {};
      const data2 = data.reduce((preVal, curVal) => {
        hash[curVal[key]] ? '' : hash[curVal[key]] = true && preVal.push(curVal);
        return preVal
      }, [])
      return data2
    },
    // 获取人员数据列表
    queryList(){
      const data = {}
      this.listLoading = true
      const querData = Object.assign(data, this.queryModuleData)

      this.exportQueryModel = JSON.stringify(querData)

      queryReportList(querData).then(res=>{
        this.total=res.total
        this.listLoading = false
        this.list= res.data
      })
    },
    confirmExactButton(){
      if(!this.multipleSelection.length){
        return
      }
      if(this.operationState===1){
        this.examineState=false
        this.dialogVisible=true
      } else if (this.operationState === 2){
        this.dialogVisible=true
        this.examineState=true
      }
    },
    confirmExact(row){
      this.multipleSelection=[row]
      this.examineState=false
      this.dialogVisible=true
    },
    headerDragend(newWidth, oldWidth, column, event){
      var arr=JSON.parse(localStorage.getItem('tableHeader'))
      var header=arr.find(item=>item.name==this.$options.name).tableHeader
      if (header.find(item=>item.label==column.label)){
        header.find(item=>item.label==column.label).width=newWidth
      }
      localStorage.setItem('tableHeader',JSON.stringify(arr))
    },
    getMinWidth(data){
      return String(data.label).replace(/[\u4E00-\u9FA5]/gi,'aa').length*12+30
    },
    getLoactionWidth(label){
      if(!localStorage.getItem('tableHeader')){
        return 'auto'
      } else {
        var arr= JSON.parse(localStorage.getItem('tableHeader'))
        if(arr.find(item=>item.name==this.$options.name)){
          var header=arr.find(item=>item.name==this.$options.name).tableHeader
          if(header.find(item=>item.label==label)){
            return header.find(item=>item.label==label).width
          } else {
            return 'auto'//String(label).replace(/[\u4E00-\u9FA5]/gi,'aa').length*12+30
          }
        } else {
          return 'auto'
        }
      }
    },
    renderHeader (createElement, {column}) {
      return createElement(
        'div', {
          'class': ['thead-cell'],
          on: {
            mousedown: ($event) => { this.handleMouseDown($event, column) },
            mouseup: ($event) => { this.handleMouseUp($event, column) },
            mousemove: ($event) => { this.handleMouseMove($event, column) }
          }
        }, [
          // 添加 <a> 用于显示表头 label
          createElement('a', column.label),
          // 添加一个空标签用于显示拖动动画
          createElement('span', {
            'class': ['virtual']
          })
        ])
    },
    // 按下鼠标开始拖动
    handleMouseDown (e, column) {
      if(e.target.parentNode.parentNode.childNodes[1]){
        e.target.parentNode.parentNode.childNodes[1].click()
      }
      this.dragState.dragging = true
      this.dragState.start = parseInt(column.columnKey)
      // 给拖动时的虚拟容器添加宽高
      let table = document.getElementsByClassName('w-table')[0]
      let virtual = document.getElementsByClassName('virtual')
      for (let item of virtual) {
        item.style.height = item.parentElement.clientHeight - 1 + 'px'
        item.style.width = item.parentElement.clientWidth  + 'px'
        item.style.left='10px'
        // item.innerText=item.parentElement.parentElement.innerText
      }
    },

    // 鼠标放开结束拖动
    handleMouseUp (e, column) {
      this.dragState.end = parseInt(column.columnKey) // 记录起始列
      this.dragColumn(this.dragState)
      // 初始化拖动状态
      this.dragState = {
        start: -1,
        end: -1,
        move: -1,
        dragging: false,
        direction: undefined
      }
    },

    // 拖动中
    handleMouseMove (e, column) {
      if (this.dragState.dragging) {
        let index = parseInt(column.columnKey) // 记录起始列
        if (index - this.dragState.start !== 0) {
          this.dragState.direction = index - this.dragState.start < 0 ? 'left' : 'right' // 判断拖动方向
          this.dragState.move = parseInt(column.columnKey)
        } else {
          this.dragState.direction = undefined
        }
      } else {
        return false
      }
    },
    // 拖动易位
    dragColumn ({start, end, direction}) {
      if(start==-1){
        return
      }
      let tempData = []
      let left = direction === 'left'
      let min = left ? end : start - 1
      let max = left ? start + 1 : end
      for (let i = 0; i < this.tableHeader.length; i++) {
        if (i === end) {
          tempData.push(this.tableHeader[start])
        } else if (i > min && i < max) {
          tempData.push(this.tableHeader[ left ? i - 1 : i + 1 ])
        } else {
          tempData.push(this.tableHeader[i])
        }
      }
      if(start==end){
        return
      }
      this.tableHeader = tempData
      this.$refs.todoTaskMultiple.store.states.filters={}
      let arr=Array.from(this.$refs.todoTaskMultiple.$el.querySelectorAll('.is-sortable'))
      let classList = arr.map(item=>Array.from(item.classList).find(itm=>itm.includes('column')))
      this.$refs.todoTaskMultiple.store.states.columns.forEach(ii=>{
        ii.filteredValue=[]
      })
      this.tableHeader.forEach((item,index)=>{
        classList.forEach((itm,idx)=>{
          if(index==idx){
            this.$refs.todoTaskMultiple.store.states.filters[itm]=this.filterDataSum[item.label]
            this.$refs.todoTaskMultiple.store.states.columns.forEach(ii=>{
              if(ii.id==itm){
                ii.filteredValue=this.filterDataSum[item.label]
              }
            })
          }
        })
      })
    },
    filterChange(a){
      this.total=this.$refs.todoTaskMultiple.tableData.length
      for (var key in a){
        this.tableHeader.forEach((item,index)=>{
          if(index==key){
            this.$set(this.filterDataSum,item.label,a[key])
            // this.filterDataSum[item.label]=a[key]
          }
        })
      }
    },
    changeHeader(n){
      if(n&&n.length){
        this.checkCaseList=n.map(item => item.prop)
        let list2 = this.checkCaseList.map(item => ({
          title: this.selectColumnList.find(i => i.COLUMN_NAME === item)
            .COLUMN_COMMENT,
          value: item
        }));
        const data = {
          userId: this.userId,
          bussId: this.bussId,
          list2
        };
        savePreference(data).then(res => {
          // this.tableState=false
          this.$nextTick(()=>{
            //  this.tableState=true
            this.list.push({})
            this.list.pop()
          })
        });
      }
    },
    cancel() {
      this.multipleSelection = []
      this.queryList()
    },
  },
  watch:{
    drawerState(n){
      console.log(n)
      if(n){
        this.$nextTick(()=>{
          document.getElementById('clearWrap').style.top =document.getElementById('searchWrap').scrollTop+ document.getElementById('searchWrap').offsetHeight - 40 + 'px'
        })
      }
    },
    tableHeader(n){
      this.tableHeaderLabelList=n.map(item=>item.label)
    },
    tableHeaderLabelList(n,o){
      if(o.length){
        if(localStorage.getItem('tableHeader')){
          let header=JSON.parse(localStorage.getItem('tableHeader')).find(item=>item.name==this.$options.name).tableHeader
          this.tableHeader.forEach(item=>{
            header.forEach(itm=>{
              if(itm.label==item.label){
                this.$set(item,'width',itm.width)
              }
            })
          })
        }
        this.changeHeader(this.tableHeader)
      }
    },
  },
  computed:{
    // 设置表格高度
    clientHeight(){
      console.log(1231313)
      let height = 0;
      if (this.$store.state.settings.toolPosTop == 'top') {
        height = 150
      } else if (this.$store.state.settings.toolPosTop == 'right') {
        height = 140
      }
      return document.documentElement.clientHeight - height
    },
    inputWid() {
      return function (value) {
        if (!value) {
          return '100px'
        } else {
          // 有内容，字符串长度*字体大小
          return (String(value).length * 13 + 50) + 'px'
        }
      }
    }
  },
  components:{
    SelectOption,
    DateWeekRange,
    scoringRules,
    newsList,
    companyNewsList
  }
}
</script>

<style lang="scss" scoped>
.el-date-editor{
  border: 0;
  font-weight: bold;
}
/deep/ .el-input--prefix .el-input__inner{
  border: 0;
}
/deep/ .ag-theme-balham .ag-cell{
  line-height: 34px;
}
/deep/ .huodong-color{
  background: #acddee;
}
/deep/ .shangji-color{
  background: #fad7de;
}
/deep/ .newCust-color{
  background: #c5e5e2;
}
.container {
  width: 100%;
  background-color: #F2F2F2;
}
.header{
  width: 100%;
  height: 50px;
  line-height: 50px;
  background-color: #FFFFFF;
  color: #333;
  .header-left{
    float: left;
    span{
      font-size: 18px;
      font-weight: bold;
      float: left;
    }
    img{
      height: 27px;
      margin-left: 10px;
      margin-top: 10px;
      float: right;
    }
  }
  .header-right{
    float: right;
    font-size: 14px;
    .right-desc{
      float: left;
      margin-left: 15px;
    }
  }
  button{
    font-size: 16px;
    i{
      width: 20px;
      border-radius: 3px;
      background: #409eff;
      color: #fff
    }
  }
  .notice{
    font-size: 12px;
    display: initial;
    border-radius: 18px;
    background-color: #52A0F5;
    width: 50px;
    height: 22px;
    text-align: center;
    vertical-align: middle;
    color: #FFFFFF;
  }
}
.main{
  width:100%;
  padding: 15px;
  .main-list{
    width: 100%;
    padding: 0 10px 10px 10px;
    background-color: #FFFFFF;
  }
}
.hrm-search{
  display: flex;
  font-size: 14px;
  align-items: center;
  height: 46px;
  //line-height: 46px;
  width: 100%;
  a{
    color: #52A0F5;
  }
  i{
    padding-right: 5px;
  }
  .el-select /deep/ .el-input input{
    //width: 90px;
    font-weight: bold;
    border: 0px !important;
  }
  .el-cascader {
    /deep/ .el-cascader__label{
      font-weight: bold;
    }
    /deep/ .el-input input {
      width: 300px;
      font-weight: bold;
      border: 0px !important;
    }
  }
}
.el-table{
  /deep/ th{
    padding:5px 0;
    color: rgba(51, 51, 51, 1);
    background: rgba(187, 187, 187, 0.5);
  }
  /deep/ td {
    padding: 0 ;
  }
}
/deep/ .pass-row{
  background: #c9c9c9!important;
}
.clearButton{
  position: absolute;
  right: 18px;
  top:20px;
  background: #fff;
  color: RGBA(254, 153, 23, 1);
  border: 0;
  /deep/ span{
    display: flex;
    justify-content: center;
    align-items: center;
  }
  img{
    width: 20px;
    margin-right: 8px;
    vertical-align: middle;
  }
}
.buttonWrap{
  width: 100%;
  text-align: center;
}
.buttonWrap2{
  width: 100%;
  text-align: right;
  margin-bottom: 10px;
  margin-top: 10px;
}
.limitDayNum{
  height:30px;
  display: flex;
  position:relative;
  align-items: center;
  margin-bottom:10px;
  img {
    width: 30px;
    height: 30px
  }
  span{
    font-family: 'Nunito Sans';
    font-weight: 400;
    font-style: normal;
    font-size: 14px;
    margin-left: 2px;
    margin-right: 10px;
    color: rgb(121, 121, 121);
  }
  .el-select{
    width: 174px;
    height: 32px;
    line-height: 32px;
    margin-right: 20px;
    /deep/ .el-input__icon{
      line-height:25px
    }
    /deep/ input{
      height: 32px;
      line-height: 32px;
    }
  }
}
section{
  position: relative;
  clear: both;
  flex: 1;
}
.checkbox{
  position:absolute;
  left: 14px;
  top: 48px;
  width: 222px;
  height: 324px;
  border: 1px solid #99a9bf;
  background: #fff;
  z-index: 100;
  padding-top: 6px;
  padding-left: 6px;
}
.checkbox_bottom {
  position: absolute;
  display: flex;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 29px;
  background: #fff;
  z-index: 2;
  justify-content: flex-end;
}
.checkbox_bottom ~ li:last-of-type {
  margin-bottom: 30px;
}
.dots{
  cursor: pointer;
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  .dot{
    color:transparent;
    padding: 1px;
    margin: 1px;
    width: 5px;
    background: RGBA(113, 123, 140, 1);
    height: 5px;
    display: block;
  }
  &~span{
    margin-left: 5px;
  }
}
.checkboxChangeRadio{
  /deep/.el-checkbox__inner{
    border-radius: 50%;
  }
  /deep/ .el-checkbox__inner:after{
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background-color: #FFF;
    position: absolute;
    left: 50%;
    top: 50%;
    -webkit-transition: -webkit-transform .01s ease-in;
    transition: -webkit-transform .01s ease-in;
    transition: transform .01s ease-in;
    transition: transform .01s ease-in, -webkit-transform .01s ease-in;
    transition: transform .01s ease-in,-webkit-transform .01s ease-in;
    transform: translate(-50%,-50%) scale(1);
  }
}
/deep/ .selectRow{
  background:  #C9C8D0
}
.timeLimitTable /deep/ .cell{
  white-space: nowrap;
  text-overflow: clip;
}
.w-table {
  /deep/ .caret-wrapper{
    position: relative;
  }
  /deep/ .el-table__column-filter-trigger{
    position: relative;
  }
  /deep/ .el-table th {
    padding: 0;
    .virtual{
      position: absolute;
      display: block;
      width: 0;
      height: 0;
      top: 0;
      background: none;
      border: none;
      box-sizing: border-box;
    }

  }
  /deep/ .thead-cell {
    vertical-align: middle;
    padding: 0;
    display: inline-flex;
    flex-direction: column;
    align-items: left;
    cursor: pointer;
    overflow: initial;
    /*&:before {*/
    /*content: "";*/
    /*position: absolute;*/
    /*top: 0;*/
    /*left: 0;*/
    /*bottom: 0;*/
    /*right: 0;*/
    /*}*/
  }
  &.w-table_moving {
    .el-table th .thead-cell{
      cursor: move !important;
    }
    .el-table__fixed {
      cursor: not-allowed;
    }
  }
}
/deep/ .moveIng{
  .virtual {
    border: 2px dotted #666 !important;
  }

}
.DataPicker /deep/ {
  .el-input__prefix{
    display: none;
  }
  .el-input{
    width: 100%;
  }
  .el-input__inner{

    text-align: center;

    padding: 0;
    padding-right: 18px;
    // padding-left: 10px;
  }
}
.el-form {
  position: relative;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  .el-cascader {
    width: 100%;
  }
  .postInfo-container-item {
    /deep/ .el-form-item__content {
      width: 330px;
      display: flex;
      height: 28px;
      align-items: center;
      .el-select {
        width: 100%;
      }
      .el-input {
        width: 100%;
      }
    }
  }
}
/deep/ .button-group-search{
  position: relative;
  .searchWrap{
    border-radius: 5px;
    top: 34px;
    left: 0;
    width: 550px;
    max-height: 500px;
    position: absolute;
    background: #ffffff;
    border: 1px solid #d4d5d5;
    z-index: 1;
    overflow: auto;
    padding: 20px 0;
    box-shadow: 0 3px 6px rgba(111,111,111,0.2);
    /deep/  .el-form{
      .el-form-item__label{
        text-align: left;
        padding-left: 32px;
        font-weight: normal;
      }
      .el-form-item__content{
        display: flex;
        input{
          border-top: 0;
          border-left: 0;
          border-radius: 0;
          border-right: 0
        }
      }
    }
    .clearWrap{
      display: block;
    }
  }
}

.DataPicker /deep/ {
  .el-input__prefix {
    display: none!important;
  }
  .el-input__inner {
    text-align: left;
    padding-left: 15px;
    padding-right: 18px;
  }
}
@keyframes show {
  0% {

    opacity: 0;
    //transform: translateX(100%);

  }
  100% {
    // transform: translateX(0);
    opacity: 1;

  }
}
@keyframes hide {
  0% {
    opacity: 1;
    // transform: translateX(0);
  }
  100% {

    opacity: 0;
    //  transform: translateX(100%);
  }
}
.show-enter-active {
  animation: show 0.5s;
}
.show-leave-active {
  animation: hide 0.5s;
}
.show-enter, .show-leave-to {
  opacity: 0;
}
.button_wrap{
  margin-left:10px;
}
.searchRight{
  border-top-right-radius:3px !important;
  border-bottom-right-radius:3px !important;
  padding:0 5px;
  height: 32px
}
.dots {
  cursor: pointer;
  position: absolute;
  left: 0;
  z-index: 1;
  top: 17px;
  width: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  .dot {
    color: transparent;
    padding: 1px;
    margin: 1px;
    width: 5px;
    background: RGBA(113, 123, 140, 1);
    height: 5px;
    display: block;
  }
  & ~ span {
    margin-left: 5px;
  }
}
.brush_right{
  position: absolute;
  right: 6px;
  z-index: 1;
}

/deep/ .rotateClass {
  transform: rotate(90deg);
  transition: transform 5s ease-in-out
}

.isActive {
  background-color: #409EFF;
  color: #fff;
}
/deep/ .ag-theme-balham .ag-details-row{
  padding: 10px !important;
  background-color: #edf6ff;
}

/deep/ .el-dialog__body{
  padding: 0 20px 20px 20px
}
</style>
