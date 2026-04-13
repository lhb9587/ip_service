<template>
  <div class="container">
    <div class="header">
      <div class="header-left">
        <span>市场效率及数据分析</span>
        <img src="@/assets/绩效管理.svg" alt="律所绩效">
      </div>

      <div class="header-right" style="cursor:pointer;">
        <div class="right-desc">
          <el-popover
            placement="left-start"
            title="界面说明"
            width="300"
            trigger="hover"
            content="展示作为负责人、介绍人、或即作为负责人介绍人的新客户数量，新客户账单收入，活动数量统计，支持右键“查看明细”，查看指定人员明细信息。">
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
          <!--          <el-select v-model="reportUserId" @change="handleSearch" style="width: 120px;float: left" size="small" filterable clearable placeholder="员工姓名">-->
          <!--            <el-option-->
          <!--              v-for="item in userList"-->
          <!--              :key="item.userId"-->
          <!--              :label="item.userFullName"-->
          <!--              :value="item.userId">-->
          <!--            </el-option>-->
          <!--          </el-select>-->
          <el-date-picker
            v-model="yearStart"
            type="year"
            format="yyyy"
            value-format="yyyy"
            placeholder="起始"
            :clearable="false"
            :editable="false"
            @change="handleWeekChange"
          ></el-date-picker>
          至
          <el-date-picker
            v-model="yearEnd"
            type="year"
            format="yyyy"
            value-format="yyyy"
            placeholder="结束"
            :clearable="false"
            :editable="false"
            @change="handleWeekChange"
          ></el-date-picker>
          <span><b>新客户定义：</b></span>
          <el-button size="mini" :type="custRule==1 ? 'primary': '' " @click="handleCustRule(1)">新创建客户</el-button>
          <el-button size="mini" :type="custRule==2 ? 'primary': '' " @click="handleCustRule(2)">新来案客户</el-button>
          <span style="margin-left: 10px"><b>客户划分：</b></span>
          <el-select v-model="dataRule" @change="handleSearch" size="small" filterable>
            <el-option label="有账单客户" :value="1"></el-option>
            <el-option label="全部客户" :value="2"></el-option>
          </el-select>
        </div>
        <section>
          <div class="w-table">
            <el-button class="brush_right" :class="brushRightHasFilter?'red':''" @click="brushRight" type="text" icon="el-icon-brush" ></el-button>
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
                       keepDetailRows
                       :getRowHeight="getRowHeight"
                       :pinnedBottomRowData="pinnedBottomRowData"

            >
            </AgGridVue>
          </div>
        </section>
        <div class="info-details" ref="newComponent" v-if="detailUsers.length>0">
          <div class="module-top">
            <div class="module-style"></div> <div class="module-name">市场活动明细</div>
          </div>
          <div v-for="item in detailUsers" :key="item.userId" style="margin-bottom: 10px">
            <dataDetail :info="item" @closeDetail="closeUserDetail"></dataDetail>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { queryNewCustYeji } from '@/api/customerList.js'
import Summary from "@/components/Summary/index.js";
import {formatDate} from '@/utils'
import {formatAmount} from '@/utils/filters'
import dataDetail from './dataDetail'
export default {
  name: 'market_activity',
  data() {
    var tableHeader=[]
    if(localStorage.getItem('tableHeader')&&JSON.parse(localStorage.getItem('tableHeader')).find(item=>item.name==this.$options.name)){
      tableHeader = JSON.parse(localStorage.getItem('tableHeader')).find(item => item.name == this.$options.name).tableHeader
    }
    return {
      reportUserId: '',
      userList: [], // 用户列表
      // yearStart: '2022',
      // yearEnd: '2022',
      yearStart: new Date(formatDate(new Date())).getFullYear()+'',
      yearEnd: new Date(formatDate(new Date())).getFullYear()+'',
      hoverState:false,
      custRule: 1,
      dataRule: 1,
      curFile:[],
      list:[], //表格数据
      brushRightHasFilter:false,
      frameworkComponents:{
        CountStatusBarComponent:Summary
      },
      gridApi:{},
      columnDefs: [
        {
          headerName: '序号',
          field: 'sid',
          width: '55',
          suppressSizeToFit: true,
          // resizable: true,
          enableRowGroup: true,
          // enablePivot: true,
          cellRenderer:this.cellRenderer,
          floatingFilter:true,
          filter: false,
          cellClass: 'vAlign',
          suppressMenu: true,
          checkboxSelection: false,
          headerCheckboxSelection: false,
          headerCheckboxSelectionFilteredOnly: true
        },
        {
          headerName: '员工姓名',
          field: 'userFullName',
          resizable: true,
          sortable: true,
          autoHeight: true,
          filter: 'agSetColumnFilter',
          cellRenderer: this.cellRenderer,
          menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
          enableRowGroup: true,
          filterParams: {
            defaultToNothingSelected: true,
            newRowsAction: 'keep',
            comparator: (a, b) => {
              return this.$commonUtils.sort(a, b, 'userFullName')
            }
          }
        },
        {
          headerName: '年份',
          field: 'year',
          resizable: true,
          sortable: true,
          autoHeight: true,
          filter: 'agSetColumnFilter',
          cellRenderer: this.cellRenderer,
          menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
          enableRowGroup: true,
          filterParams: {
            defaultToNothingSelected: true,
            newRowsAction: 'keep',
            comparator: (a, b) => {
              return this.$commonUtils.sort(a, b, 'year')
            }
          }
        },
        {
          headerName: '负责客户',
          field: 'fzCustCount',
          resizable: true,
          sortable: true,
          autoHeight: true,
          filter: 'agSetColumnFilter',
          cellRenderer: this.cellRenderer,
          menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
          enableRowGroup: true,
          filterParams: {
            defaultToNothingSelected: true,
            newRowsAction: 'keep',
            comparator: (a, b) => {
              return this.$commonUtils.sort(a, b, 'fzCustCount')
            }
          }
        },
        {
          headerName: '负责客户账单',
          field: 'fzCustAmount',
          resizable: true,
          sortable: true,
          autoHeight: true,
          filter: 'agSetColumnFilter',
          cellRenderer: this.cellRenderer,
          menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
          enableRowGroup: true,
          filterParams: {
            defaultToNothingSelected: true,
            newRowsAction: 'keep',
            comparator: (a, b) => {
              return this.$commonUtils.sort(a, b, 'fzCustAmount')
            }
          }
        },
        {
          headerName: '负责客户活动',
          field: 'fzHdCount',
          resizable: true,
          sortable: true,
          autoHeight: true,
          filter: 'agSetColumnFilter',
          cellRenderer: this.cellRenderer,
          menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
          enableRowGroup: true,
          filterParams: {
            defaultToNothingSelected: true,
            newRowsAction: 'keep',
            comparator: (a, b) => {
              return this.$commonUtils.sort(a, b, 'fzHdCount')
            }
          }
        },
        {
          headerName: '介绍客户',
          field: 'jsCustCount',
          resizable: true,
          sortable: true,
          autoHeight: true,
          filter: 'agSetColumnFilter',
          cellRenderer: this.cellRenderer,
          menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
          enableRowGroup: true,
          filterParams: {
            defaultToNothingSelected: true,
            newRowsAction: 'keep',
            comparator: (a, b) => {
              return this.$commonUtils.sort(a, b, 'jsCustCount')
            }
          }
        },
        {
          headerName: '介绍客户账单',
          field: 'jsCustAmount',
          resizable: true,
          sortable: true,
          autoHeight: true,
          filter: 'agSetColumnFilter',
          cellRenderer: this.cellRenderer,
          menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
          enableRowGroup: true,
          filterParams: {
            defaultToNothingSelected: true,
            newRowsAction: 'keep',
            comparator: (a, b) => {
              return this.$commonUtils.sort(a, b, 'jsCustAmount')
            }
          }
        },
        {
          headerName: '介绍客户活动',
          field: 'jsHdCount',
          resizable: true,
          sortable: true,
          autoHeight: true,
          filter: 'agSetColumnFilter',
          cellRenderer: this.cellRenderer,
          menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
          enableRowGroup: true,
          filterParams: {
            defaultToNothingSelected: true,
            newRowsAction: 'keep',
            comparator: (a, b) => {
              return this.$commonUtils.sort(a, b, 'jsHdCount')
            }
          }
        },
        {
          headerName: '负责及介绍客户',
          field: 'custCount',
          resizable: true,
          sortable: true,
          autoHeight: true,
          filter: 'agSetColumnFilter',
          cellRenderer: this.cellRenderer,
          menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
          enableRowGroup: true,
          filterParams: {
            defaultToNothingSelected: true,
            newRowsAction: 'keep',
            comparator: (a, b) => {
              return this.$commonUtils.sort(a, b, 'custCount')
            }
          }
        },
        {
          headerName: '负责及介绍客户账单',
          field: 'custAmount',
          resizable: true,
          sortable: true,
          autoHeight: true,
          filter: 'agSetColumnFilter',
          cellRenderer: this.cellRenderer,
          menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
          enableRowGroup: true,
          filterParams: {
            defaultToNothingSelected: true,
            newRowsAction: 'keep',
            comparator: (a, b) => {
              return this.$commonUtils.sort(a, b, 'custAmount')
            }
          }
        },
        {
          headerName: '负责及介绍客户活动',
          field: 'hdCount',
          resizable: true,
          sortable: true,
          autoHeight: true,
          filter: 'agSetColumnFilter',
          cellRenderer: this.cellRenderer,
          menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
          enableRowGroup: true,
          filterParams: {
            defaultToNothingSelected: true,
            newRowsAction: 'keep',
            comparator: (a, b) => {
              return this.$commonUtils.sort(a, b, 'hdCount')
            }
          }
        },
      ], //定义列
      gridOptions:{
        statusBar: {
          statusPanels: [
            { statusPanel: 'agTotalAndFilteredRowCountComponent', align: 'left' },
            { statusPanel: 'agSelectedRowCountComponent', align: 'left' } // 总和过滤的行数组件
          ]
        },
      },
      listLoading:false,
      queryModuleData: {}, //搜索条件
      total:0, //全部数
      multipleSelection:[],
      dialogVisible: false,
      operationState:1,
      examineState:false,
      userId: this.$store.getters.userId,
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
      filterDataSum:{},
      fullscreen: false,
      defaultHeight: document.documentElement.clientHeight - 150,
      fullScreenHeight: document.documentElement.clientHeight - 150, // 全屏高度
      detailUsers: [], // 明细选择人员
    }
  },
  created() {
    this.handleSearch()
    // this.getAllWfs()
  },
  methods: {
    // 关闭人员活动明细
    closeUserDetail(data) {
      const index = this.detailUsers.findIndex(item => item.userId === data.userId);
      if (index !== -1) {
        this.detailUsers.splice(index, 1);
      }
    },
    handleCustRule(type) {
      if (type != this.custRule) {
        this.custRule = type
        this.handleSearch()
      }
    },
    handleWeekChange(e) {
      this.handleSearch()
    },
    getRowHeight(params) {
      const isDetailRow = params.node.detail;
      // for all rows that are not detail rows, return nothing
      if (!isDetailRow) { return undefined; }
      const detailPanelHeight = (params.data.maxCount * 28) + 56;
      return detailPanelHeight;
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
    queryRecordList() {
      this.queryModuleData = JSON.parse(localStorage.getItem('queryModuleData')) ? JSON.parse(localStorage.getItem('queryModuleData')).find(item => item.name == this.$options.name) ? JSON.parse(localStorage.getItem('queryModuleData')).find(item => item.name == this.$options.name).queryModuleData : {} : {}
      // this.queryModuleData.userId = this.reportUserId
      this.queryModuleData.startYear = this.yearStart
      this.queryModuleData.endYear = this.yearEnd
      this.queryModuleData.custRule = this.custRule
      this.queryModuleData.dataRule = this.dataRule
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
      params.api.sizeColumnsToFit()
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
      if (['fzCustAmount','jsCustAmount','custAmount'].includes(params.colDef.field)){
        return `<span title="${(params.value != undefined && params.value != 0 ) ? formatAmount(params.value) : ''}">${(params.value != undefined && params.value != 0 ) ? formatAmount(params.value) : ''}</span>`
      }else{
        return `<span title="${(params.value != undefined && params.value != 0 ) ? params.value : ''}">${(params.value != undefined && params.value != 0 ) ? params.value : ''}</span>`
      }
    },
    // 设置右键菜单项
    getContextMenuItems(params){
      if(!params.node.data || ['其它','总计'].includes(params.node.data.userFullName)){
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
    // 获取菜单项列表
    getRowContextmenuList(row){
      let list = []
      list = [
        { name: '查看明细', action: 'addDetails' },
      ]
      return list.filter(item=> {
        if (item.permissions) {
          return this.$store.getters.permissions.includes(item.permissions)
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
    // 加入详细说明
    addDetails(row) {
      if (this.detailUsers.length <= 0 || !this.detailUsers.some(item => item.userId === row.userId)) {
        const filteredList = this.list.filter(item => item.userId === row.userId);
        filteredList.sort((a, b) => b.year - a.year);

        this.detailUsers.push({
          userId: row.userId,
          userFullName: row.userFullName,
          list: filteredList,
          year: row.year
        });
        this.scrollToNewComponent()
      }
    },
    // 定位到详细说明
    scrollToNewComponent() {
      this.$nextTick(() => {
        const element = this.$refs.newComponent;
        if (element) {
          const offset = 200; // 设置额外的偏移量
          const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
          const scrollToPosition = elementTop - offset;
          window.scrollTo({ top: scrollToPosition, behavior: 'smooth' });
        }
      });
    },
    rowContextmenu(row, column, event) {
      console.log('row',row)
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
    // 点击单元格
    onCellClicked(params){

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
    saveLocation(){
      if(!localStorage.getItem('tableHeader ')){
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
    unique(data, key) {
      const hash = {};
      const data2 = data.reduce((preVal, curVal) => {
        hash[curVal[key]] ? '' : hash[curVal[key]] = true && preVal.push(curVal);
        return preVal
      }, [])
      return data2
    },
    // 获取数据列表
    queryList(){
      const data = {}
      this.listLoading = true
      const querData = Object.assign(data, this.queryModuleData)

      queryNewCustYeji(querData).then(res=>{
        if (res.data){
          this.total=res.total
          this.listLoading = false
          this.list = res.data.map((item,index) => ({
            sid: index + 1,
            ...item
          }));
          this.detailUsers = []
        }
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
    },
    // 设置计算列表统计总计
    pinnedBottomRowData() {
      if (this.gridApi.rowModel) {
        const columnDisplay = ['fzCustCount','fzCustAmount','fzHdCount','jsCustCount','jsCustAmount','jsHdCount','custCount','custAmount','hdCount'] //计算字段
        const columnInt = ['fzCustCount','fzHdCount','jsCustCount','jsHdCount','custCount','hdCount'] // 转int
        // 获取原始数据
        const data = this.gridApi.rowModel.rootNode.childrenAfterFilter.map(item => item.data);
        // 根据年份划分数据
        const yearWiseData = {};
        data.forEach(item => {
          const year = item.year;
          if (!yearWiseData[year]) {
            yearWiseData[year] = [];
          }
          yearWiseData[year].push(item);
        });
        // 统计每个年份的数据
        const yearWiseStats = {};
        for (const year in yearWiseData) {
          const yearData = yearWiseData[year];
          const stats = this.$commonUtils.pinnedBottomRowData(yearData, this.columnDefs, columnDisplay)
          // 对对象的属性值进行转换
          const obj = stats[0];
          for (const prop of columnInt) {
            if (typeof obj[prop] === 'string' && !isNaN(obj[prop])) {
              obj[prop] = parseInt(obj[prop], 10);
            }
          }
          yearWiseStats[year] = {
            ...obj,
            year: year,
            'userFullName': '总计'
          };
        }
        const pinnedBottomRowData = Object.values(yearWiseStats).sort((a, b) => a.year.localeCompare(b.year))
        console.log('data',pinnedBottomRowData)
        return pinnedBottomRowData
      }
      return ''
    },
  },
  components:{
    dataDetail
  }
}
</script>

<style lang="scss" scoped>
/deep/ .mx-input{
  border: 0;
}
/deep/ .el-input--prefix .el-input__inner{
  border: 0;
}
/deep/ .ag-theme-balham .ag-cell{
  line-height: 34px;
}
/deep/ .bill-color{
  background: #acddee;
}
/deep/ .huodong-color{
  background: #fad7de;
}
/deep/ .cost-color{
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
  font-size: 14px;
  height: 46px;
  line-height: 46px;
  width: 100%;
  a{
    color: #52A0F5;
  }
  i{
    padding-right: 5px;
  }
  .el-select /deep/ .el-input input{
    width: 120px;
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
  /deep/ .el-date-editor {
    width: 100px;
    input {
      text-align: center;
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

.info-details {
  .module-top{
    height: 55px;
    display: flex;
    .module-style{
      width: 8px;
      height: 25px;
      margin: 15px 15px 15px 0;
      background: #409EFF;
    }
    .module-name{
      height: 21px;
      font-size: 16px;
      font-weight: bold;
      margin-top: 15px;
    }
  }
}
</style>
