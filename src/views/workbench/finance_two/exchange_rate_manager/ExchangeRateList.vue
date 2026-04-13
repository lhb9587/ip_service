<template>
  <div style="margin: 0">
    <div style="display: flex;position: relative">
      <TitleTotal :total="total" :currentPageSize="currentPageSize"/>
    </div>
    <div class="w-table">
      <el-button class="brush_right" :class="brushRightHasFilter?'red':''" @click="brushRight" type="text"
                 icon="el-icon-brush"></el-button>
      <AgGridVue :style="{width:'100%',height: clientHeight+'px'}"
                 class="ag-theme-balham"
                 :columnDefs="columnDefs"
                 :rowData="rateList"
                 rowSelection="multiple"
                 @grid-ready="onGridReady"
                 :gridOptions="gridOptions"
                 @dragStopped="dragStopped"
                 :getContextMenuItems="getContextMenuItems"
                 suppressAutoSize

                 animateRows
                 @rowDoubleClicked="rowDoubleClicked"
                 @sortChanged="refreshEvenRowsCurrencyData"
                 @filterChanged="refreshEvenRowsCurrencyData"
                 :localeText="$store.state.caseInformation.localeText"
                 :suppressDragLeaveHidesColumns="true"
                 :suppressMakeColumnVisibleAfterUnGroup="true"
                 rowGroupPanelShow="always"
                 :groupSelectsChildren="true"
                 :suppressAggFuncInHeader="true"
                 :autoGroupColumnDef="autoGroupColumnDef"
                 :rowHeight="$commonUtils.getRowHeight()"

      >
      </AgGridVue>
    </div>
    <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.pageNo"
        :limit.sync="listQuery.pageSize"
        @pagination="queryList"
        :pageSizes="pageSizesList"
    />

    <el-dialog
      :title="title"
      append-to-body
      :close-on-click-modal="false"
      :visible.sync="dialogView"
      width="45%"
      height="80%"
      class="abow_dialog"
      :before-close="(done) => {done();closeDialog(false)}"
    >
      <rate-detail v-if="dialogView" :curHisId="curHisId" :dialogType="dialogType" @close="closeDialog"></rate-detail>
<!--      <business-dialog v-if="businessDialogView" :sjId="sjId" :type="title" @close="closeDialog"></business-dialog>-->
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import {
  delCurrencyHistoryById,
  queryCurrencyHistoryList
} from '@/api/billApi.js'
import {formatAmount} from '@/utils/filters'
import RateDetail from "@/views/workbench/finance_two/exchange_rate_manager/RateDetail.vue";

export default {
  name: 'ExchangeRateList',
  props: {
    isFinance: {
      type: Boolean,
      default: true
    },
    ctx: {}
  },
  data() {
    var tableHeader = []
    if (localStorage.getItem('tableHeader') && JSON.parse(localStorage.getItem('tableHeader')).find(item => item.name == this.$options.name + this.$route.name)) {
      tableHeader = JSON.parse(localStorage.getItem('tableHeader')).find(item => item.name == this.$options.name + this.$route.name).tableHeader
    }
    return {
      curHisId: '',
      title: '',
      dialogView: false,
      dialogType: '',
      rateList: [],
      abroadBillIds: [],
      copyForm: {
        abroadBillId: '',
        addAbroadBillView: false,
        copyNum: 1
      },
      exportType: 1,
      showTable: false,
      gridApi: {},
      operationState: 0,
      myTabsActivity: false,
      pageTitle: this.$route.meta.title,
      identification: 'indexoverseasBill',
      drawerState: false,
      selectionState: false, // 筛选递交复选框
      total: 0,
      loading: false,
      listLoading: false,
      feeList: [],
      feetList: [],
      queryModuleData: { // 查询条件

      },
      tableHeader,
      selectionOptionState: false,
      multipleTypeText: '确定',
      defaultParams: {
        value: 'feetId',
        label: 'feeName',
        checkStrictly: true,
        children: 'feeTypes'
      },
      listQuery: {
        pageNo: 1,
        pageSize: JSON.parse(localStorage.getItem('pageSize')) ? JSON.parse(localStorage.getItem('pageSize')).find(item => item.name == this.$route.name) ? JSON.parse(localStorage.getItem('pageSize')).find(item => item.name == this.$route.name).pageSize : 10 : 10
      },
      pageSizesList: [10, 50, 200, 500, 1000, 5000, 10000],
      tableDefaultList: [{'label': '费用类型', 'prop': 'feeName'}, {
        'label': '总金额',
        'prop': 'total'
      }, {'label': '案件文号', 'prop': 'showRefno'}, {'label': '客户', 'prop': 'name'}, {
        'label': '报销人',
        'prop': 'bxfullname'
      }, {'label': '报销人所属工作组', 'prop': 'bxgroupname'}, {
        'label': '费用承担工作组',
        'prop': 'groupName'
      }, {'label': '填报人', 'prop': 'fullname'}, {'label': '任务人', 'prop': 'tasker'}, {
        'label': '费用状态',
        'prop': 'wfStatus'
      }],
      customerNameIdList: [],
      feeTypeList: [],
      userList: [],
      deptByConditionList: [],
      workgroupNamesList: [],
      feeWfstatusList: ['待提交', '待财务初审', '待支付', '待费用复审'],
      endorseTaskerList: [],
      endorseTaskerState: false,
      endorseTasker: '',
      exportQueryModel: '',
      filterText: '',
      userId: this.$store.getters.userId,
      bussId: 16,
      conditionsModuleList: [],
      schemeName: '',
      addFilterState: false,
      checkCaseList: [],
      checkboxState: false,
      selectColumnList: [],
      transferVisible: false, // 配置筛选条件框
      transferData: [], // 筛选条件数据
      transferValue: [], // 当前筛选条件id
      multipleSelection: [],
      currentPageSize: 0,
      defaultcolumnDefs: [
        {
          headerName: '序号',
          field: 'sid',
          width: 80,
          enableRowGroup: true,
          // enablePivot: true,
          cellRenderer: this.cellRenderer,
          floatingFilter: true,
          filter: false,
          cellClass: 'vAlign',
          suppressMenu: true,
          checkboxSelection: false,
          headerCheckboxSelection: false,
          headerCheckboxSelectionFilteredOnly: true
        }
      ],
      columnDefs: [],
      brushRightHasFilter: false,
      gridOptions: {
        ...this.$store.state.caseInformation.gridOptions, ...{
          statusBar: {
            statusPanels: [
              {statusPanel: 'agTotalAndFilteredRowCountComponent', align: 'left'},
              {statusPanel: 'agSelectedRowCountComponent', align: 'left'}
            ]
          }
          //floatingFilter: true,
        }
      },
      preferenceList: [
        {title: '货币名称', value: 'curName'},
        {title: '货币符号', value: 'charSign'},
        {title: '货币英文简写', value: 'signEn'},
        {title: '汇率', value: 'exchangeRate'},
        {title: '是否本币', value: 'local'},
        {title: '所属月', value: 'month'},
        // {title: '备注', value: 'memo', flex: true}
      ],
      autoGroupColumnDef: {
        headerName: '组',
        field: 'group',
        headerCheckboxSelection: true,
        cellRenderer: 'agGroupCellRenderer',
        cellRendererParams: {checkbox: true}
      }
    }
  },
  created() {
    this.getAllWfs()
  },
  methods: {
    closeDialog(isSearch) {
      isSearch === true && this.queryList()
      this.dialogView = false
      this.dialogType = ""
      this.title = ''
    },
    createRate() {
      this.title = "新建汇率"
      this.dialogType = "create"
      this.dialogView = true
    },
    getAllWfs() {
      this.columnDefs = [...this.defaultcolumnDefs, ...this.preferenceList.map(item => ({
        headerName: item.title,
        field: item.value,
        width: this.getLoactionWidth(item.title) == 'auto' ? 200 : this.getLoactionWidth(item.title),
        resizable: true,
        sortable: true,
        flex: item.flex,
        filter: 'agSetColumnFilter',
        menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
        cellRenderer: this.cellRenderer,
        enableRowGroup: true,
        filterParams: {
          comparator: (a, b) => {
            return this.$commonUtils.sort(a, b, item.value)
          }
        }
      }))]
      this.$nextTick(() => {
        this.columnDefs.forEach(item => {
          this.columnApi && this.columnApi.getColumn && this.columnApi.getColumn(item.field).addEventListener('menuVisibleChanged', () => {
            if (document.querySelector('.ag-tabs')) {
              new this.$DraginResize(document.querySelector('.ag-set-filter-list'), {
                clone: true,
                end(info) {
                  if (info.dir == 'ver') {
                    this.elem.style.height = info.height + 'px'
                  } else if (info.dir == 'hor') {
                    this.elem.style.width = info.width + 'px'
                  }
                }
              })
            }
            let data = this.$commonUtils.getFilterModel(this.$options.name + this.$route.name, 'FilterModel')
            let arr = Object.keys(data)
            if (this.columnDefs.map(itm => itm.field).diff(arr).includes(item.field)) {
              this.gridApi.getFilterInstance(item.field).selectNothing()
            }
          })
        })
      })
      this.saveLocation()
      // this.queryList()
    },
    queryList(flag) {
      if (typeof flag == 'object') {
        const {searchType, searchData} = flag
        this.queryModuleData = Object.assign(this.queryModuleData, searchData)
        if (searchType !== undefined) {
          this.operationState = searchType
        }
      } else {
        this.operationState = flag || 0
      }
      // this.operationState=flag
      this.drawerState = false
      this.selectionState = false
      this.multipleSelection = []
      this.listQuery.pageNo = 1
      queryCurrencyHistoryList({
        ...this.queryModuleData,
        ...this.listQuery

      }).then(res => {
        this.rateList = res.data
        this.total = res.total
      })
      if (JSON.parse(localStorage.getItem('queryModuleData'))) {
        var arr = JSON.parse(localStorage.getItem('queryModuleData'))
      } else {
        var arr = []
      }
      if (arr.find(item => item.name == this.$route.name)) {
        arr.find(item => item.name == this.$route.name).queryModuleData = this.queryModuleData
      } else {
        arr.push({name: this.$route.name, queryModuleData: this.queryModuleData})
      }
      localStorage.setItem('queryModuleData', JSON.stringify(arr))
    },
    brushRight() {
      let data = this.$commonUtils.getFilterModel(this.$options.name + this.$route.name, 'FilterModel')
      let arr = Object.keys(data)
      arr.forEach(item => {
        this.gridApi.destroyFilter(item)
      })
      this.$commonUtils.saveFilterModel(this.$options.name + this.$route.name, 'FilterModel', {})
    },
    getFilterModel() {
      this.$nextTick(() => {
        let data = this.$commonUtils.getFilterModel(this.$options.name + this.$route.name, 'FilterModel')
        let arr = Object.keys(data)
        let arrInstance = arr.map(item => this.gridApi.getFilterInstance(item))
        arrInstance.forEach((item, index) => {
          // item.selectNothing()
          item.setModel(data[arr[index]])
          item.applyModel()
        })
        this.gridApi.onFilterChanged()
        let sortData = this.$commonUtils.getFilterModel(this.$options.name + this.$route.name, 'SortModel')
        if (sortData && sortData.length) {
          this.gridApi.setSortModel(sortData)
          this.gridApi.onSortChanged()
        }
      })
    },
    cellRenderer(params) {
      if (params.node.rowPinned == 'bottom') {
        return `<span title="${params.value}" style="float: right">${(params.value || params.value === 0) ? params.value : ''}</span>`
      }
      if (params.colDef.field == 'sid') {
        return params.rowIndex + 1
      }
      if (Object.prototype.toString.call(params.value).includes('Number')) {
        return `<span title="${params.value}" style="float: right">${formatAmount(params.value)}</span>`
      }
      if (params.colDef.field == 'local') {
        return `<span title="${params.value ? '是' : '否'}">${params.value ? '是' : '否'}</span>`
      }
      return `<span title="${params.value}">${params.value ? params.value : ''}</span>`
    },
    getLoactionWidth(label) {
      if (!localStorage.getItem('tableHeader')) {
        return 'auto'
      } else {
        var arr = JSON.parse(localStorage.getItem('tableHeader'))
        if (arr.find(item => item.name == this.$options.name + this.$route.name)) {
          var header = arr.find(item => item.name == this.$options.name + this.$route.name).tableHeader
          if (header.find(item => item.label == label)) {
            return header.find(item => item.label == label).width
          } else {
            return 'auto'
          }
        } else {
          return 'auto'
        }
      }
    },
    rowDoubleClicked(params) {
      var row = params.data
      this.title = "查看汇率"
      this.curHisId = row.curHisId
      this.dialogType = "view"
      this.dialogView = true
    },
    getSelectedRows() {
      if (this.gridApi.getSelectedNodes) {
        const selectedNodes = this.gridApi.getSelectedNodes()
        const selectedData = selectedNodes.map(node => node.data)
        return selectedData
      }
      return []
    },
    onGridReady(params) {
      this.gridparams = params
      this.gridApi = params.api
      this.columnApi = params.columnApi
      params.api.sizeColumnsToFit()
    },
    dragStopped(params) {
      let tableHeader = params.columnApi.columnController.gridColumns.map(item => ({
        label: item.colDef.headerName,
        width: item.actualWidth,
        prop: item.colDef.field
      })).filter(item => item.prop != 'sid' && item.prop != 'group')
      this.tableHeader = tableHeader
      // this.changeHeader(tableHeader)
      this.saveLocation()
    },
    saveLocation() {
      if (!localStorage.getItem('tableHeader')) {
        let arr = []
        arr.push({name: this.$options.name + this.$route.name, tableHeader: this.tableHeader})
        localStorage.setItem('tableHeader', JSON.stringify(arr))
      } else {
        let arr = JSON.parse(localStorage.getItem('tableHeader'))
        if (arr.find(item => item.name == this.$options.name + this.$route.name)) {
          arr.find(item => item.name == this.$options.name + this.$route.name).tableHeader = this.tableHeader
          localStorage.setItem('tableHeader', JSON.stringify(arr))
        } else {
          arr.push({name: this.$options.name + this.$route.name, tableHeader: this.tableHeader})
          localStorage.setItem('tableHeader', JSON.stringify(arr))
        }
      }
    },
    refreshEvenRowsCurrencyData(params) {
      this.currentPageSize = params.api.rowModel.rootNode.allChildrenCount
      this.gridApi.rowModel.rootNode.childrenAfterFilter && this.gridApi.rowModel.rootNode.childrenAfterFilter.length && this.gridApi.rowModel.rootNode.childrenAfterFilter.forEach(rowNode => {
        setTimeout(() => {
          rowNode.setDataValue(
              'sid',
              rowNode.rowIndex + 1)
        }, 0)
      });
      // if (!params.columnApi.columnController.groupAutoColumns) {
      // setTimeout(() =>{
      //   this.gridApi.forEachNode(rowNode => {
      //     rowNode.setDataValue(
      //       'sid',
      //       rowNode.rowIndex + 1)
      //   });
      // }, 0)
      // }
      if (this.rateList.length) {
        if (params.type == "filterChanged") {
          let obj = this.gridApi.getFilterModel()
          for (let k in obj) {
            if (obj.hasOwnProperty(k)) {
              if (obj[k].values && !obj[k].values.length) {
                delete obj[k]
              }
            }
          }
          Object.keys(obj).length && this.$commonUtils.saveFilterModel(this.$options.name + this.$route.name, 'FilterModel', this.gridApi.getFilterModel())
          var data = this.$commonUtils.getFilterModel(this.$options.name + this.$route.name, 'FilterModel');
          var arr = Object.keys(data);
          if (arr.length) {
            this.brushRightHasFilter = true
          } else {
            this.brushRightHasFilter = false
          }
        }
        if (params.type == "sortChanged") {
          this.$commonUtils.saveFilterModel(this.$options.name + this.$route.name, 'SortModel', this.gridApi.getSortModel())
        }
      } else {
        this.brushRightHasFilter = false
      }
    },
    getContextMenuItems(params) {
      if (!params.node.data) {
        return []
      }
      return this.getRowContextmenuList(params.node.data).map(item => ({
        name: item.name,
        action: () => {
          this[item.action](params.node.data, params.value)
        }
      }))
    },
    copyAbroadBill(row) {
      this.copyForm.addAbroadBillView = true;
      this.copyForm.abroadBillId = row.abroadBillId
    },
    getRowContextmenuList(row) {
      const list = [
        {name: '复制', action: 'copy'},
        {name: '修改', action: 'edit'},
        {name: '删除', action: 'deleteRate'}
      ]
      return list.filter(item => {
        if (item.permissions) {
          return this.$store.getters.permissions.includes(item.permissions)
        } else {
          return true
        }
      })
    },
    defaultQuerySearch() {
      // alert(1)
      this.queryModuleData = JSON.parse(localStorage.getItem('queryModuleData')) ? JSON.parse(localStorage.getItem('queryModuleData')).find(item => item.name == this.$route.name) ? JSON.parse(localStorage.getItem('queryModuleData')).find(item => item.name == this.$route.name).queryModuleData : {} : {}
      if (this.queryModuleData.wfStatus) {
        this.operationState = 1
      }
    },
    copy(row, value, event) {
      if (value) {
        this.$copyText(value).then(
            res => {
            })
      } else {
        this.$copyText(event.target.innerText).then(
            res => {
            })
      }
    },
    edit(row) {
      this.title = "修改汇率"
      this.curHisId = row.curHisId
      this.dialogType = "edit"
      this.dialogView = true
    },
    deleteRate(row) {
      this.$confirm('此操作将永久改汇率, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delCurrencyHistoryById({
          curHisId: row.curHisId
        }).then(res => {
          this.$message.success(res.message)
          this.closeDialog(true)
        })
      })
    },
  },
  mounted() {

  },
  watch: {},
  components: {
    RateDetail,
    Pagination
  },
  computed: {
    clientHeight() {
      let height = 0
      if (this.$store.state.settings.toolPosTop == 'top') {
        height = 260
      } else if (this.$store.state.settings.toolPosTop == 'right') {
        height = 180
      }
      return (document.documentElement.clientHeight - 250)
    }
  }
}

</script>
<style lang="scss" scoped>
.el-table {
  /deep/ th {
    padding: 5px 0;
    color: rgba(51, 51, 51, 1);
    background: rgba(187, 187, 187, 0.5);
  }

  /deep/ td {
    padding: 0;
  }
}

/deep/ .pass-row {
  background: #c9c9c9 !important;
}

.clearButton {
  position: absolute;
  right: 18px;
  top: 20px;
  background: #fff;
  color: RGBA(254, 153, 23, 1);
  border: 0;

  /deep/ span {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  img {
    width: 20px;
    margin-right: 8px;
    vertical-align: middle;
  }
}

.buttonWrap {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .el-button {
    margin-right: 10px;
  }
}

.buttonWrap2 {
  width: 100%;
  text-align: right;
  margin-bottom: 10px;
  margin-top: 10px;
}

.limitDayNum {
  height: 30px;
  display: flex;
  position: relative;
  align-items: center;
  margin-bottom: 10px;

  img {
    width: 30px;
    height: 30px
  }

  span {
    font-family: 'Nunito Sans';
    font-weight: 400;
    font-style: normal;
    font-size: 14px;
    margin-left: 2px;
    margin-right: 10px;
    color: rgb(121, 121, 121);
  }

  .el-select {
    width: 174px;
    height: 32px;
    line-height: 32px;
    margin-right: 20px;

    /deep/ .el-input__icon {
      line-height: 25px
    }

    /deep/ input {
      height: 32px;
      line-height: 32px;
    }
  }
}

section {
  position: relative;
  clear: both;
  flex: 1;
}

.checkbox {
  position: absolute;
  left: 0px;
  top: 33px;
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

.checkboxChangeRadio {
  /deep/ .el-checkbox__inner {
    border-radius: 50%;
  }

  /deep/ .el-checkbox__inner:after {
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
    transition: transform .01s ease-in, -webkit-transform .01s ease-in;
    transform: translate(-50%, -50%) scale(1);
  }
}

/deep/ .selectRow {
  background: #C9C8D0
}

.timeLimitTable /deep/ .cell {
  white-space: nowrap;
  text-overflow: clip;
}

.w-table {
  position: relative;

  /deep/ .caret-wrapper {
    position: relative;
  }

  /deep/ .el-table__column-filter-trigger {
    position: relative;
  }

  /deep/ .el-table th {
    padding: 0;

    .virtual {
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
    .el-table th .thead-cell {
      cursor: move !important;
    }

    .el-table__fixed {
      cursor: not-allowed;
    }
  }
}

/deep/ .moveIng {
  .virtual {
    border: 2px dotted #666 !important;
  }

}

/deep/ .pagination-container {
  padding: 0;
}

.DataPicker /deep/ {
  .el-input__prefix {
    display: none;
  }

  .el-input {
    width: 100%;
  }

  .el-input__inner {

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

.button-group-search {
  position: relative;
  display: flex;

  .searchWrap {
    border-radius: 5px;
    top: 34px;
    left: 10px;
    width: 550px;
    max-height: 500px;
    min-height: 200px;
    position: absolute;
    background: #ffffff;
    border: 1px solid #d4d5d5;
    z-index: 1;
    overflow: auto;
    padding: 20px 0;
    box-shadow: 0 3px 6px rgba(111, 111, 111, 0.2);

    /deep/ .el-form {
      padding-bottom: 10px;

      .multi-cascader /deep/ {
        .el-cascader__label {
          max-height: 40px;
          overflow-y: auto
        }
      }

      .el-form-item__label {
        text-align: left;
        padding-left: 32px;
        font-weight: normal;
        float: left;
      }

      .el-form-item__content {
        input {
          border-top: 0;
          border-left: 0;
          border-radius: 0;
          border-right: 0
        }
      }
    }

    .clearWrap {
      display: flex;
      justify-content: flex-end;
      width: 100%;
      background: #fff;
      right: 10px;
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

.button_wrap {
  margin-left: 10px
}

.searchRight {
  margin-left: 0;
  height: 32px;
  border-top-right-radius: 3px !important;
  border-bottom-right-radius: 3px !important;
  padding: 0 5px
}

.dots {
  cursor: pointer;
  position: absolute;
  left: 0;
  z-index: 1;
  top: 6px;
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

.brush_right {
  position: absolute;
  right: 6px;
  z-index: 1;
  top: -4px;
}

.MyTabs {
  width: 100%;
  position: absolute;

  /deep/ .el-tabs {
    .el-tabs__header {
      margin: 0;
    }

    .el-tabs__content {
      background: #fff;
    }
  }
}

.MyTabs.activity {
  background: #fff;
  z-index: 8;

  /deep/ .el-tabs {
    .el-tabs__header {
      margin: 0;
      background: #fff;
    }

    .el-tabs__content {
      background: #fff;
    }
  }
}

.el-menu-demo {
  display: inline-block;
  color: #fff;
  background-color: #409eff;
  border-color: #409eff;
  width: 92px;
  height: 32px;
  font-size: 12px;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 10px;
  margin-right: 20px;

  &:hover {
    opacity: 0.8;
  }

  /deep/ li {
    height: 100%;
    width: 100%;

    .el-submenu__title {
      border-radius: 3px;
      background: #409eff;
      color: #fff !important;
      line-height: 32px;
      height: 100%;
      text-align: center;
      border-bottom: 0;
      padding: 0;

      i {
        color: #fff;
      }

      &:hover {
        color: #fff;
        background: #409eff;
      }
    }
  }

  //padding: 9px 15px;
}
</style>
