<template>
  <div style="padding: 5px 10px 5px 10px">
    <div>
      <div>
        <div>
          <div class="main">
            <div class="main-list">
              <div class="hrm-search search-box">
                <el-select v-model="topUserName" @change="handleSearch" style="width: 120px" size="small" filterable
                           clearable placeholder="人员">
                  <el-option
                    v-for="item in list"
                    :key="item.userId"
                    :label="item.fullname"
                    :value="item.fullname">
                  </el-option>
                </el-select>
                <DateRange v-model="createDateArray" style="float: left" @change="handleWeekChange"></DateRange>
                <span style="margin-left: 10px">详情：</span>
                <el-button size="mini" @click="handleAllDetails(true)">全部展开</el-button>
                <el-button size="mini" @click="handleAllDetails(false)">全部收起</el-button>
                <div style="float: right">
                </div>
              </div>
              <section>
                <div class="w-table">
                  <el-button class="brush_right" :class="brushRightHasFilter?'red':''" @click="brushRight" type="text"
                             icon="el-icon-brush"></el-button>
                  <AgGridVue :style="{width:'100%',height: fullScreenHeight+'px'}"
                             class="ag-theme-balham"
                             :columnDefs="columnDefs"
                             :rowData="list"
                             rowSelection="multiple"
                             @grid-ready="onGridReady"
                             @rowClicked="rowClicked"
                             :gridOptions="gridOptions"
                             @dragStopped="dragStopped"
                             :getContextMenuItems="getContextMenuItems"
                             suppressAutoSize
                             animateRows
                             @sortChanged="refreshEvenRowsCurrencyData"
                             @filterChanged="refreshEvenRowsCurrencyData"
                             :localeText="$store.state.caseInformation.localeText"
                             :suppressDragLeaveHidesColumns="true"
                             :suppressMakeColumnVisibleAfterUnGroup="true"
                             :groupSelectsChildren="true"
                             :suppressAggFuncInHeader="true"
                             :frameworkComponents="frameworkComponents"
                             :rowHeight="34"
                             :masterDetail="true"
                             :isRowMaster="isRowMaster"
                             :detailRowAutoHeight="true"
                             :getRowHeight="getRowHeight"
                             :detailCellRendererParams="detailCellRendererParams"
                             keepDetailRows
                  >
                  </AgGridVue>

                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Summary from "@/components/Summary/index.js";
  import {formatDate} from '@/utils'
  import dateRangUtil from '@/utils/dateRangUtil'
  import {queryPerformanceDetailByUserId, queryUserPerformance} from "../../../../api/customerList";

  export default {
    name: 'weekly_report',
    data() {
      var tableHeader = []
      if (localStorage.getItem('tableHeader') && JSON.parse(localStorage.getItem('tableHeader')).find(item => item.name == this.$options.name)) {
        tableHeader = JSON.parse(localStorage.getItem('tableHeader')).find(item => item.name == this.$options.name).tableHeader
      }
      return {
        detailList: [],
        queryDateArray: ['', ''],
        topUserName: '',
        exportQueryModel: {},
        exportType: 0,
        selectionOptionState: false,
        reportUserId: '',
        wpId: '',
        fraction: '',
        fractionName: '',
        userList: [], // 用户列表
        createDateArray: [formatDate(new Date(new Date().getFullYear(),0,1)),formatDate(new Date())],
        hoverState: false,
        curFile: [],
        list: [], //表格数据
        brushRightHasFilter: false,
        frameworkComponents: {
          CountStatusBarComponent: Summary
        },
        tableTitleList: [
          {'title': '客户', 'value': 'name', 'cellClass': 'detailStyle'},
          {'title': '账单收入', 'value': 'income', 'cellClass': 'detailStyle'},
          {'title': '案量', 'value': 'caseCount', 'cellClass': 'detailStyle'},
          {'title': '关联客户活动', 'value': 'activityCount', 'cellClass': 'detailStyle'},
          {'title': '商标领域收入', 'value': 'shangbiao', 'cellClass': 'detailStyle'},
          {'title': '诉讼领域收入', 'value': 'susong', 'cellClass': 'detailStyle'},
          {'title': '保护领域收入', 'value': 'baohu', 'cellClass': 'detailStyle'},
          {'title': '专利领域收入', 'value': 'zhuanli', 'cellClass': 'detailStyle'},
          {'title': '著作权领域收入', 'value': 'banquan', 'cellClass': 'detailStyle'},
          {'title': '域名领域收入', 'value': 'yuming', 'cellClass': 'detailStyle'},
          {'title': '非诉领域收入', 'value': 'feisu', 'cellClass': 'detailStyle'},
        ],
        tableTitleList2: [],
        gridApi: {},
        columnDefs: [], //定义列
        selectedColumn: {},
        gridOptions: {
          statusBar: {
            statusPanels: [
              {statusPanel: 'agTotalAndFilteredRowCountComponent', align: 'left'},
              {statusPanel: 'agSelectedRowCountComponent', align: 'left'} // 总和过滤的行数组件
            ]
          },
        },
        detailCellRendererParams: {
          detailGridOptions: {
            rowSelection: 'multiple',
            columnDefs: [],
            resizable: true,
            getContextMenuItems: this.getContextMenuItemsChild,
          },
          getDetailRowData: params => {
            // 数据插入
            this.queryDataInfo(params)
          },
        },
        listLoading: false,
        queryModuleData: {}, //搜索条件
        total: 0, //全部数
        multipleSelection: [],
        dialogVisible: false,
        scoringVisible: false, // 评分
        companyNewsVisible: false, // 公司快讯
        newsVisible: false, // 快讯发布
        manualScoringVisible: false, // 手动评分
        operationState: 1,
        examineState: false,
        checkboxState: false, //复选框状态
        userId: this.$store.getters.userId,
        bussId: 82,
        preferenceList: [
          {'title': '人员', 'value': 'fullname', 'width': '', 'cellClass': ''},
          {'title': '协调客户数', 'value': 'manageCount', 'width': '', 'cellClass': ''},
          {'title': '协调客户账单额', 'value': 'manageBillSum', 'cellClass': ''},
          {'title': '负责客户数', 'value': 'custCount', 'cellClass': ''},
          {'title': '负责客户账单额', 'value': 'billSum', 'cellClass': ''},
          {'title': '开账单客户数', 'value': 'billCustCount', 'cellClass': ''},
          {'title': '关联客户活动', 'value': 'activityCount', 'cellClass': ''},
          {'title': '主要负责领域', 'value': 'userDomain', 'cellClass': ''},
          {'title': '主要负责领域账单额', 'value': 'domainBillSum', 'cellClass': ''},
          {'title': '开拓客户数', 'value': 'introduceCount', 'cellClass': ''},
        ], //内容展示列
        selectColumnList: [], //选择列列表
        checkCaseList: [], //循环列表数据
        tableHeader: tableHeader,
        tableHeaderLabelList: [],
        dragState: {
          start: -1, // 起始元素的 index
          end: -1, // 结束元素的 index
          move: -1, // 移动鼠标时所覆盖的元素 index
          dragging: false, // 是否正在拖动
          direction: undefined // 拖动方向
        },
        drawerState: false,
        filterText: '',
        filterDataSum: {},
        fullscreen: false,
        defaultHeight: document.documentElement.clientHeight - 150,
        fullScreenHeight: document.documentElement.clientHeight - 150, // 全屏高度
      }
    },
    created() {
      this.handleSearch()
      this.getAllWfs()
    },
    methods: {
      getContextMenuItemsChild(params) {
        console.log('getContextMenuItemsChild', params)
      },
      getFirstWeekStartDate(year) {
        const date = new Date(year, 0, 1);
        const dayOfWeek = date.getDay();
        return new Date(year, 0, 1 + (dayOfWeek <= 4 ? 1 - dayOfWeek : 8 - dayOfWeek));
      },
      getWeekNumber(date) {
        const onejan = new Date(date.getFullYear(), 0, 1)
        return Math.floor(((date - onejan) / 86400000 + onejan.getDay() + 1) / 7)
      },
      handleWeekChange() {
        this.handleSearch()
      },
      // 全部展开,收起
      handleAllDetails(status) {
        const list = status ? this.gridApi.rowModel.rootNode.childrenAfterFilter : this.gridApi.rowModel.rootNode.childrenAfterFilter.reverse()
        this.gridApi.rowModel.rootNode.childrenAfterFilter.forEach(item => {
          setTimeout(() => {
            item.setExpanded(status)
          }, 10)
        })
      },
      getRowHeight(params) {
        if (params.node && params.node.detail) {
          var allDetailRowHeight = (params.data.custCount * 28 + 66) > 500 ? 500 : (params.data.custCount * 28 + 66)
          return allDetailRowHeight
        }
      },
      // 获取详细数据
      queryDataInfo(params) {
        queryPerformanceDetailByUserId({
          userId: params.data.userId,
          queryDateArray: this.createDateArray,
          pageSize: 999999
        }).then(res => {
          this.$nextTick(() =>{
            params.successCallback(res.data || [])
          })
        })
      }
      ,
      brushRight() {
        let data = this.$commonUtils.getFilterModel(this.$options.name + this.$route.name, 'FilterModel')
        let arr = Object.keys(data)
        arr.forEach(item => {
          this.gridApi.destroyFilter(item)
        })
        this.$commonUtils.saveFilterModel(this.$options.name + this.$route.name, 'FilterModel', {})
      }
      ,
      getFilterModel() {
        this.$nextTick(() => {
          let data = this.$commonUtils.getFilterModel(this.$options.name + this.$route.name, 'FilterModel')
          let arr = Object.keys(data)
          let arrInstance = arr.map(item => this.gridApi.getFilterInstance(item))
          arrInstance.forEach((item, index) => {
            item.selectNothing()
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
      }
      ,
      // 创建完成后执行的事件
      onGridReady(params) {
        this.gridparams = params
        this.gridApi = params.api;
        this.columnApi = params.columnApi;
        params.api.sizeColumnsToFit()
      }
      ,
      // 拖动列记录
      dragStopped(params) {
        let tableHeader = params.columnApi.columnController.gridColumns.map(item => ({
          label: item.colDef.headerName,
          width: item.actualWidth,
          prop: item.colDef.field,
        })).filter(item => item.prop != 'sid' && item.prop != "group")
        this.tableHeader = tableHeader
        this.saveLocation()
      }
      ,
      getSidDiv(params) {
        const h = this.$createElement;
        let vnode = h('div', {
            on: {
              // click: () => this.rowClicked(params)
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
      }
      ,
      rowClicked(params) {
        if (params.node.expanded) {
          params.node.setExpanded(false);
        } else {
          params.node.setExpanded(true);
        }
        this.columnDefs.push({})
        this.columnDefs.pop()
      }
      ,
      // 单元(列)渲染器
      cellRenderer(params) {
        // 是否显示展开事件
        if (params.colDef.field == 'fullname') {
          return this.getSidDiv(params)
        }
        return `<span title="${params.value}">${params.value || params.value === 0 ? params.value : ''}</span>`
      }
      ,
      // 指定该详细行是否展开
      isRowMaster(dataItem) {
        return true
      }
      ,
      // 设置右键菜单项
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
      }
      ,
      // 获取数量
      getSum(list, type) {
        return list.map(item => item[type]).filter(item => !!item).reduce((x, y) => x + y, 0)
      }
      ,
      // 排序/过滤器
      refreshEvenRowsCurrencyData(params) {
        this.currentPageSize = params.api.rowModel.rootNode.allChildrenCount
        this.gridApi.rowModel.rootNode.childrenAfterFilter && this.gridApi.rowModel.rootNode.childrenAfterFilter.length && this.gridApi.rowModel.rootNode.childrenAfterFilter.forEach(rowNode => {
          setTimeout(() => {
            rowNode.setDataValue(
              'sid',
              rowNode.rowIndex + 1)
          }, 1)
        });
        // if(!params.columnApi.columnController.groupAutoColumns) {
        //   this.gridApi.forEachNode(rowNode => {
        //     rowNode.setDataValue(
        //       'sid',
        //       rowNode.rowIndex + 1)
        //   });
        // }
        if (this.list.length) {
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
        }
      }
      ,
      // 获取菜单项列表
      getRowContextmenuList(row) {
        let list = []
        list = [
          {name: '复制', action: 'copy'},
          // { name: '打分', action: 'grade' }
        ]
        return list.filter(item => {
          if (item.permissions) {
            return this.$store.getters.permissions.includes(item.permissions)
          } else if (item.permissionsData) {
            return item.permissionsData.some(itm => this.$store.getters.permissions.includes(itm.premission) && row.taskNo == itm.taskNo)
          } else {
            return true
          }
        })
      }
      ,
      copy(row, value) {
        if (value) {
          this.$copyText(value).then(
            res => {
            })
        }
      }
      ,
      rowContextmenu(row, column, event) {
        const that = this
        this.$ContextMenu({
          event, // 传入鼠标事件
          menu: this.getRowContextmenuList(row)
        }).then(rs => {
          if (rs) {
            this[rs](row, column, event);
          }
        });
      }
      ,
      // 获取select行数
      getSelectedRows() {
        if (this.gridApi) {
          const selectedNodes = this.gridApi.getSelectedNodes();
          const selectedData = selectedNodes.map(node => node.data);
          return selectedData
        }

      }
      ,
      // // 点击单元格选择,获取详情展示列表和数据
      // onCellClicked(params) {
      //   if (params.column) {
      //     this.rowClicked(params)
      //     this.selectedColumn = params.column.colDef;
      //   }
      //   this.multipleSelection = this.getSelectedRows()
      // },
      // 搜索
      handleSearch(val) {
        queryUserPerformance({
          pageSize: 999999,
          queryDateArray: this.createDateArray,
          keyword: this.topUserName
        }).then(res => {
          this.list = res.data
          this.total = res.total
          this.getFilterModel()
        })
      }
      ,
      getAllWfs() {
        // 详细数据
        this.detailCellRendererParams.detailGridOptions.columnDefs = [...this.tableTitleList.map(item => ({
          headerName: item.title,
          field: item.value,
          width: item.width,
          cellClass: item.cellClass,
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
        this.tableHeader = this.preferenceList.map(item => ({
          label: item.title,
          prop: item.value,
          width: this.getLoactionWidth(item.title)
        }))
        this.saveLocation()
        this.checkCaseList = this.preferenceList.map(item => item.value)
        this.columnDefs = [...this.preferenceList.map(item => ({
          headerName: item.title,
          field: item.value,
          width: this.getLoactionWidth(item.title) == 'auto' ? 125 : this.getLoactionWidth(item.title),
          resizable: true,
          sortable: true,
          filter: 'agSetColumnFilter',
          menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
          cellRenderer: this.cellRenderer,
          enableRowGroup: true,
          filterParams: {
            newRowsAction: 'keep',
            comparator: (a, b) => {
              return this.$commonUtils.sort(a, b, item.value)
            }
          }
        }))]
        this.$nextTick(() => {
          this.columnDefs.forEach(item => {
            this.columnApi && this.columnApi.getColumn(item.field) && this.columnApi.getColumn(item.field).addEventListener('menuVisibleChanged', () => {
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
      }
      ,
      saveLocation() {
        if (!localStorage.getItem('tableHeader')) {
          let arr = []
          arr.push({name: this.$options.name, tableHeader: this.tableHeader})
          localStorage.setItem('tableHeader', JSON.stringify(arr))
        } else {
          let arr = JSON.parse(localStorage.getItem('tableHeader'))
          if (arr.find(item => item.name == this.$options.name)) {
            arr.find(item => item.name == this.$options.name).tableHeader = this.tableHeader
            localStorage.setItem('tableHeader', JSON.stringify(arr))
          } else {
            arr.push({name: this.$options.name, tableHeader: this.tableHeader})
            localStorage.setItem('tableHeader', JSON.stringify(arr))
          }
        }
      }
      ,
      getLoactionWidth(label) {
        if (!localStorage.getItem('tableHeader')) {
          return 'auto'
        } else {
          var arr = JSON.parse(localStorage.getItem('tableHeader'))
          if (arr.find(item => item.name == this.$options.name)) {
            var header = arr.find(item => item.name == this.$options.name).tableHeader
            if (header.find(item => item.label == label)) {
              return header.find(item => item.label == label).width
            } else {
              return 'auto'//String(label).replace(/[\u4E00-\u9FA5]/gi,'aa').length*12+30
            }
          } else {
            return 'auto'
          }
        }
      }
      ,
    },
    watch: {},
    computed: {
      // 设置表格高度
      clientHeight() {
        let height = 0;
        if (this.$store.state.settings.toolPosTop == 'top') {
          height = 150
        } else if (this.$store.state.settings.toolPosTop == 'right') {
          height = 140
        }
        return document.documentElement.clientHeight - height
      },
    },
    components: {}
  }
</script>

<style lang="scss" scoped>
/deep/ .mx-input{
  border: 0;
}
  .el-date-editor {
    border: 0;
    font-weight: bold;
  }

  /deep/ .el-input--prefix .el-input__inner {
    border: 0;
  }

  /deep/ .ag-theme-balham .ag-cell {
    line-height: 34px;
  }

  /deep/ .huodong-color {
    background: #acddee;
  }

  /deep/ .shangji-color {
    background: #fad7de;
  }

  /deep/ .newCust-color {
    background: #c5e5e2;
  }

  .container {
    width: 100%;
    background-color: #F2F2F2;
  }

  .header {
    width: 100%;
    height: 50px;
    line-height: 50px;
    background-color: #FFFFFF;
    color: #333;

    .header-left {
      float: left;

      span {
        font-size: 18px;
        font-weight: bold;
        float: left;
      }

      img {
        height: 27px;
        margin-left: 10px;
        margin-top: 10px;
        float: right;
      }
    }

    .header-right {
      float: right;
      font-size: 14px;

      .right-desc {
        float: left;
        margin-left: 15px;
      }
    }

    button {
      font-size: 16px;

      i {
        width: 20px;
        border-radius: 3px;
        background: #409eff;
        color: #fff
      }
    }

    .notice {
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

  .main {
    width: 100%;
    /*padding: 15px;*/

    .main-list {
      width: 100%;
      /*padding: 0 10px 10px 10px;*/
      background-color: #FFFFFF;
    }
  }

  .hrm-search {
    font-size: 14px;
    height: 46px;
    line-height: 46px;
    width: 100%;

    a {
      color: #52A0F5;
    }

    i {
      padding-right: 5px;
    }

    .el-select /deep/ .el-input input {
      //width: 90px;
      font-weight: bold;
      border: 0px !important;
    }

    .el-cascader {
      /deep/ .el-cascader__label {
        font-weight: bold;
      }

      /deep/ .el-input input {
        width: 300px;
        font-weight: bold;
        border: 0px !important;
      }
    }
  }

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
    text-align: center;
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

  .dots {
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

  /deep/ .button-group-search {
    position: relative;

    .searchWrap {
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
      box-shadow: 0 3px 6px rgba(111, 111, 111, 0.2);

      /deep/ .el-form {
        .el-form-item__label {
          text-align: left;
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
        }
      }

      .clearWrap {
        display: block;
      }
    }
  }

  .DataPicker /deep/ {
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
    margin-left: 10px;
  }

  .searchRight {
    border-top-right-radius: 3px !important;
    border-bottom-right-radius: 3px !important;
    padding: 0 5px;
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

  .brush_right {
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

  /deep/ .ag-theme-balham .ag-details-row {
    padding: 10px !important;
    background-color: #edf6ff;
  }

  /deep/ .el-dialog__body {
    padding: 0 20px 20px 20px
  }

  .search-box {
    display: flex;
    height: 50px;
    align-items: center;
    width: 100%;
    margin-top: 15px;
    border: 2px solid #F2F2F2;
    border-bottom: 2px solid #52A0F5;
    border-radius: 5px 5px 0 0;
    margin-bottom: 15px;

    .search-left {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-left: 15px;
    }
  }

  > > > .detailStyle {
    background-color: #fff !important;
    color: #000000;
  }
</style>
