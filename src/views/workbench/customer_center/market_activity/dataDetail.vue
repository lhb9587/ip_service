<template>
  <div class="detail-container" :class="{ fullscreen: fullscreen }">
    <div class="header">
      <span><b>{{info.userFullName}}</b></span>
      <div v-for="item in info.list" class="header-year">
        <el-button :type="item.year == year ? 'primary' : ''" size="mini" @click="checkYear(item.year)">{{item.year}}</el-button>
      </div>
      <div class="header-button">
        <el-button icon="el-icon-close" @click="closeDetail" size="mini">关闭明细</el-button>
        <el-button icon="el-icon-rank" size="mini" @click="toggleFullscreen">{{ fullscreen ? '退出全屏' : '全屏查看'}}</el-button>
      </div>
    </div>
    <div class="main">
      <section>
        <div class="w-table">
<!--          <el-button class="brush_right" :class="brushRightHasFilter?'red':''" @click="brushRight" type="text" icon="el-icon-brush" ></el-button>-->
          <AgGridVue
            style="width:100%;"
            :style="{height: fullscreen ? '90vh' :'290px'}"
            class="ag-theme-balham"
            :columnDefs="columnDefs"
            :rowData="list"
            rowSelection="multiple"
            @grid-ready="onGridReady"
            :gridOptions="gridOptions"
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
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { queryDataForOneUser, queryCustDetail } from '@/api/customerList.js'
import {formatAmount} from '@/utils/filters'
export default {
  name: 'dataDetail',
  props: ['info'],
  computed: {
    clientHeight() {
      return document.documentElement.clientHeight - 190
    }
  },
  data() {
    return {
      year: '',
      queryModuleData: '',
      list: [],
      listAll: [],
      hoverState:false,
      brushRightHasFilter:false,
      fullscreen: false, // 全屏操作
      columnDefs: [
        {
          headerName: '客户名称',
          field: 'custName',
          width: '550',
          suppressSizeToFit: true,
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
              return this.$commonUtils.sort(a, b, 'custName')
            }
          }
        },
        {
          headerName: '案件类型',
          field: 'custType',
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
              return this.$commonUtils.sort(a, b, 'custType')
            }
          }
        },
        {
          headerName: '客户账单',
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
          headerName: '客户活动',
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
        // {
        //   headerName: '客户成本',
        //   field: 'hdCosts',
        //   resizable: true,
        //   sortable: true,
        //   autoHeight: true,
        //   filter: 'agSetColumnFilter',
        //   cellRenderer: this.cellRenderer,
        //   menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
        //   enableRowGroup: true,
        //   filterParams: {
        //     defaultToNothingSelected: true,
        //     newRowsAction: 'keep',
        //     comparator: (a, b) => {
        //       return this.$commonUtils.sort(a, b, 'hdCosts')
        //     }
        //   }
        // }
      ], //定义列
      gridOptions:{
        statusBar: {
          statusPanels: [
            { statusPanel: 'agTotalAndFilteredRowCountComponent', align: 'left' },
            { statusPanel: 'agSelectedRowCountComponent', align: 'left' } // 总和过滤的行数组件
          ]
        },
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
      preferenceList: [],
      tableTitleList: [
        {'title': '账单', 'value': 'bill', 'width': 500, 'flex': 3, 'cellClass': 'bill-color'},
        {'title': '活动', 'value': 'huodong', 'width': 400, 'flex': 2,'cellClass': 'huodong-color'},
        // {'title': '成本', 'value': 'cost', 'flex': 1, 'cellClass': 'cost-color'}
      ],
    }
  },
  created() {
    this.year = this.info.year
    this.dataInit()
    this.getallSelectData();
    console.log('info',this.info)
  },
  methods: {
    dataInit() {
      this.queryModuleData = JSON.parse(localStorage.getItem('queryModuleData')) ? JSON.parse(localStorage.getItem('queryModuleData')).find(item => item.name == 'market_activity') ? JSON.parse(localStorage.getItem('queryModuleData')).find(item => item.name == 'market_activity').queryModuleData : {} : {}
      console.log('queryModuleData',this.queryModuleData)
      var queryData = {
        userId: this.info.userId,
        ...this.queryModuleData
      }
      queryDataForOneUser(queryData).then(res=>{
        if (res.data){
          this.listAll = res.data
          this.list = res.data.filter(item => item.year == this.year)
        }
      })
    },
    toggleFullscreen() {
      this.fullscreen = !this.fullscreen
    },
    // 切换年份
    checkYear(year) {
      console.log(year)
      if (year != this.year) {
        this.year = year
        this.$set(this,'list',this.listAll.filter(item => item.year == year))
      }
    },
    // 关闭明细
    closeDetail() {
      this.$emit('closeDetail', {userId: this.info.userId})
    },
    // 右侧清理列过滤器
    brushRight(){
      let data = this.$commonUtils.getFilterModel(this.$options.name+this.$route.name,'FilterModel')
      let arr =  Object.keys(data)
      arr.forEach(item=>{
        this.gridApi.destroyFilter(item)
      })
    },
    // 创建完成后执行的事件
    onGridReady(params) {
      this.gridparams=params
      this.gridApi = params.api;
      this.columnApi = params.columnApi;
      params.api.sizeColumnsToFit()
    },
    // 点击单元格选择,获取详情展示列表和数据
    onCellClicked(params){
      console.log('点击单元格',params)
      if (params.column) {
        this.rowClicked(params)
      }
    },
    rowClicked(params) {
      console.log('params',params)
      if (params.node.expanded) {
        params.node.setExpanded(false);
      } else {
        params.node.setExpanded(true);
      }
      this.columnDefs.push({})
      this.columnDefs.pop()
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
    // 过滤器功能
    getSummary(list){
      let data={
        total: this.getSum(list,'total'),
      }
      this.$store.commit('caseInformation/SET_SUMMARYDATA',{name:'borrow_list',count:data})
    },
    enentDrop(e){
      e.stopPropagation();
      e.preventDefault();
      this.hoverState=false
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
    getContextMenuItemsChild(params) {
      console.log('getContextMenuItemsChild',params)
    },
    // 指定该详细行是否展开
    isRowMaster(dataItem) {
      var count = ((dataItem.billCount + dataItem.hdCount) > 0)
      return count
    },
    // 获取详细数据
    queryDataInfo(params){
      console.log(params,'获取详细数据')
      var queryData = {
        userId: this.info.userId,
        custId: params.data.custId,
        ...this.queryModuleData,
        startYear: this.year,
        endYear: this.year,
      }
      queryCustDetail(queryData).then(res => {
        if (res.data){
          const reportData = res.data
          const data = Object.values(res.data)
          let listLength = 0
          const dataList = []
          data.forEach(item=>{
            listLength = item.length > listLength ? item.length : listLength
          })
          for (let i = 0; i < listLength; i++) {
            var list = {bill: '',huodong: '',cost: ''}
            if (reportData.billDetail[i]) {
              var billList = reportData.billDetail[i]
              list.bill = '账单号：'+ (billList.billNo ? billList.billNo : '') +'; 账单收入: '+ formatAmount(billList.custAmount) +'; 案件文号: '+ (billList.showRefno ? billList.showRefno : '')
            }
            if (reportData.huodongDetail[i]) {
              var huodongList = reportData.huodongDetail[i]
              list.huodong = (huodongList.workTypeName ? ('活动类型：'+huodongList.workTypeName+'; ') : '') + (huodongList.huodongDate ? ('活动时间: '+huodongList.huodongDate+'; ') : '') + (huodongList.workContent ? '活动内容: '+huodongList.workContent+'; ' : '')
            }
            // if (reportData.costDetail[i]) {
            //   var costList = reportData.costDetail[i]
            //   list.cost = newCustList.custName ? newCustList.custName : ''
            // }
            dataList.push(list)
          }
          dataList && params.successCallback(dataList);
        }
      })
    },
    // 单元(列)渲染器
    cellRenderer(params) {
      // 是否显示展开事件
      if (params.colDef.field == 'custName') {
        return this.getSidDiv(params)
      }
      return `<span title="${params.value}">${params.value ? params.value : ''}</span>`
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
    getallSelectData() {
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
    },
    getRowHeight(params) {
      console.log('getRowHeight',params)
      const isDetailRow = params.node.detail;
      // for all rows that are not detail rows, return nothing
      if (!isDetailRow) { return undefined; }
      var count = params.data.billCount > params.data.hdCount ? params.data.billCount : params.data.hdCount;
      const detailPanelHeight = (count * 28) + 56;
      // const detailPanelHeight = 200;
      return detailPanelHeight;
    },
  }
}
</script>

<style lang="scss" scoped>
.detail-container {
  padding: 10px;
  border: 1px solid #BDC3C7;
}
.header {
  display: flex;
  .header-year {
    button {
      margin-left:10px;
    }
  }
  .header-button {
    button {
      margin-left:10px;
    }
  }
}
.main {
  width: 100%;
  height: 290px;
  margin-top: 10px;
}

.el-table /deep/ th {
  background-color: #7199d5;
  color: #ffffff;
}

.el-row {
  margin-bottom: 5px;
}

.el-row:last-child {
  margin-bottom: 0;
}

.search-box {
  display: flex;
  justify-content: space-between;
  height: 70px;
  width: 100%;
  margin-top: 15px;
  border: 2px solid #F2F2F2;
  border-bottom: 2px solid #52A0F5;
  border-radius: 5px 5px 0 0;

  .search-left {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 15px;
  }
}

.search-right-btn {
  display: flex;
  align-items: center;
  margin-right: 15px;
}

.button-group-search {
  position: relative;
  display: flex;
  margin-right: 10px;

  .searchWrap {
    border-radius: 5px;
    top: 34px;
    left: 0;
    width: 550px;
    max-height: 500px;
    position: absolute;
    background: #ffffff;
    border: 1px solid #d4d5d5;
    z-index: 4;
    overflow: hidden;
    /*padding: 20px 0;*/
    box-shadow: 0 3px 6px rgba(111, 111, 111, 0.2);

    /deep/ .el-form {
      padding: 20px 20px 50px 0;

      .el-form-item__label {
        text-align: right;
        padding-left: 32px;
        font-weight: normal;
      }

      .el-form-item__content {
        display: flex;

        input {
          border-top: 0;
          border-left: 0;
          border-radius: 0;
          border-right: 0
        }

        .el-radio {
          line-height: 28px;
        }
      }
    }

    .clearWrap {
      display: flex;
      justify-content: flex-end;
      /*width: 100%;*/
      background: #fff;
      right: 10px;
      bottom: 0;
      padding-bottom: 10px;
      position: absolute;
      z-index: 1;
    }
  }
}

.DataPicker /deep/ {
  line-height: 28px;

  .el-input__prefix {
    display: none !important;
  }

  .el-input__inner {
    text-align: left;
    padding-left: 15px;
    padding-right: 18px;
  }
}

.searchRight {
  border-top-right-radius: 3px !important;
  border-bottom-right-radius: 3px !important;
  padding: 0 5px;
  height: 33px;
}

.abow_dialog {
  > > > .el-dialog {
    position: absolute;
    top: 50%;
    left: 50%;
    margin: 0 !important;
    transform: translate(-50%, -50%);
    min-height: calc(60%);
    max-height: calc(100% - 30px);
    max-width: calc(100% - 30px);
    display: flex;
    flex-direction: column;
  }

  > > > .el-dialog__body {
    overflow: auto;
    padding: 0 10px 10px 10px;
  }
}
.brush_right {
  position: absolute;
  right: 45px;
  z-index: 1;
}
.fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  background-color: #FFFFFF;
}
</style>
