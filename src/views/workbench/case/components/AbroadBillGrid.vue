<template>
  <div>
    <div class="grid-table" :style="{width:'100%'}">
      <el-button class="brush_right" :class="brushRightHasFilter?'red':''" @click="brushRight" type="text"
                 icon="el-icon-brush"></el-button>
      <AgGridVue :style="{width:'100%',height: height + 'px'}"
                 class="ag-theme-balham"
                 :columnDefs="columnDefs"
                 :rowData="list"
                 rowSelection="multiple"
                 @grid-ready="onGridReady"
                 @dragStopped="dragStopped"
                 :gridOptions="gridOptions"
                 :getContextMenuItems="getContextMenuItems"
                 suppressAutoSize
                 animateRows
                 @rowDoubleClicked="rowDoubleClicked"
                 @sortChanged="refreshEvenRowsCurrencyData"
                 @filterChanged="refreshEvenRowsCurrencyData"
                 :localeText="$store.state.caseInformation.localeText"
      >
      </AgGridVue>
    </div>
  </div>
</template>

<script>
  // import Pagination from '@/components/Pagination'

  import {queryCaseAbroadBillInfo} from "../../../../api/caseList";
  import {formatAmount} from "../../../../utils/filters";
  import {getProgID} from "../../../../utils/editInOffice";

  export default {
    name: "AbroadBillGrid",
    components: {
      // Pagination
    },
    computed: {},
    props: {
      caseAbroadBillList: {
        type: Array,
        default: () => []
      },
      caseId: {
        type: [Number, String],
        default: ''
      },
      height: {
        type: Number,
        default: 0
      }
    },
    data() {
      var tableHeader = []
      if (localStorage.getItem('tableHeader') && JSON.parse(localStorage.getItem('tableHeader')).find(item => item.name == this.$options.name + this.$route.name)) {
        tableHeader = JSON.parse(localStorage.getItem('tableHeader')).find(item => item.name == this.$options.name + this.$route.name).tableHeader
      }
      return {
        total: 0,
        pageSizesList: [10, 50, 200, 500, 1000, 5000, 10000],
        editData: {},
        memoType: '',
        memoDialogVisible: false,
        autoGroupColumnDef: {
          headerName: '组',
          field: 'group',
          headerCheckboxSelection: true,
          cellRenderer: 'agGroupCellRenderer',
          cellRendererParams: {checkbox: true}
        },
        currentPageSize: 0,
        brushRightHasFilter: false,
        gridOptions: {
          ...this.$store.state.caseInformation.gridOptions, ...{
          }
        },
        defaultcolumnDefs: [
          {
            headerName: '序号',
            field: 'sid',
            width: 60,
            resizable: true,
            enableRowGroup: true,
            // enablePivot: true,
            'pinned': 'left',
            floatingFilter: true,
            filter: false,
            cellClass: 'vAlign',
            cellRenderer: this.cellRenderer,
            suppressMenu: true
          }
        ],
        preferenceList: [
          {'title': '境外账单号', 'value': 'abroadBillNo'},
          {'title': '境外账单日', 'value': 'abroadBillDate'},
          {'title': '我方账单收款情况', 'value': 'paymentStatusStr'},
          {'title': '境外账单电子版', 'value': 'materialList'},
          {'title': '境外代理所', 'value': 'agencyCustName'},
          {'title': '境外账单费用概要', 'value': 'abroadContent'},
          {'title': '境外账单币种', 'value': 'curIdString'},
          {'title': '境外账单总金额', 'value': 'abroadBillSum'},
          {'title': '流程状态', 'value': 'processName'},
        ],
        selectColumnList: [],
        checkCaseList: [],
        bussId: 8,
        tableHeader,
        list: [],
        columnDefs: [],
        checkboxState: false,
        filterText: '',
        gridparams: {},
        gridApi: {},
        columnApi: {},
        listQuery: {
          pageNo: 1,
          pageSize: JSON.parse(localStorage.getItem('pageSize')) ? JSON.parse(localStorage.getItem('pageSize')).find(item => item.name == this.$options.name) ? JSON.parse(localStorage.getItem('pageSize')).find(item => item.name == this.$options.name).pageSize : 10 : 10
        }
      }
    },
    watch: {
      caseAbroadBillList(n) {
        this.list = n
      }
    },
    created() {
      this.queryTitle()
      // this.queryList()
    },
    methods: {
      brushRight() {
        let data = this.$commonUtils.getFilterModel(this.$options.name + this.$route.name, 'FilterModel')
        let arr = Object.keys(data)
        arr.forEach(item => {
          this.gridApi.destroyFilter(item)
        })
      },
      getSelectedRows() {
        if (this.gridApi) {
          const selectedNodes = this.gridApi.getSelectedNodes();
          const selectedData = selectedNodes.map(node => node.data);
          return selectedData
        } else {
          return []
        }
      },
      refreshEvenRowsCurrencyData(params) {
        this.currentPageSize = params.api.rowModel.rootNode.allChildrenCount
        if (!params.columnApi.columnController.groupAutoColumns) {
          this.gridApi.forEachNode(rowNode => {
            rowNode.setDataValue(
              'sid',
              rowNode.rowIndex + 1)
          })
        }
        if (this.list.length) {
          if (params.type == 'filterChanged') {
            this.$commonUtils.saveFilterModel(this.$options.name + this.$route.name, 'FilterModel', this.gridApi.getFilterModel())
            var data = this.$commonUtils.getFilterModel(this.$options.name + this.$route.name, 'FilterModel')
            var arr = Object.keys(data)
            if (arr.length) {
              this.brushRightHasFilter = true
            } else {
              this.brushRightHasFilter = false
            }
          }
        }
      },
      rowDoubleClicked(params) {
        this.seeMemo(params.data)
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
      getRowContextmenuList(row) {
        return [
          {name: '复制', action: 'copy'},
          // {name: '修改', action: 'editMemo'},
          // {name: '删除', action: 'delMemo'},
        ].filter(item => {
          if (item.flag) {
            // return row.flag === item.flag
          } else {
            return true
          }
        })
      },
      formatAmount(value){
        if (value) return formatAmount(value)
        return '0.00'
      },
      preView(data) {
        let url = data.address
        if (getProgID(url) || ['eml', 'msg'].includes(url.replace(/.+\./, '').toLocaleLowerCase())) {
          if (['doc', 'docx'].includes(url.replace(/.+\./, "").toLocaleLowerCase())) {
            this.$commonUtils.viewPdf(`${url}`)
          } else {
            let flag = ''
            if (data.mailId) {
              flag = 'mailId'
            } else if (data.materialId) {
              flag = 'materialId'
            }
            url = url.replace(/&/g, '%26')
            window.open(`#/preView?address=ipdoc${url}&${flag}=${data[flag]}`.replace(/[+]/g,'%2B'))
          }
        } else if (['pdf', 'jpg', 'png'].some(item => url.replace(/.+\./, "").toLocaleLowerCase() == item)) {
          window.open(`/ipdoc${url}`.replace(/[+]/g, '%2B'))
        } else {
          this.$commonUtils.downLoadAll({ url: `ipdoc${url}` })
        }
      },
      cellRenderer(params) {
        if (params.colDef.field === 'sid') {
          return params.rowIndex + 1
        }
        if (params.colDef.field === 'abroadBillSum') {
          return `<span title="${params.value}">${this.formatAmount(params.value)}</span>`
        }
        if (params.colDef.field === 'materialList') {
          const h = this.$createElement
          const vnode = h('div', {}, params.value.map(item => h('p', {
            'class': {
              'pointer': true
            },
            on: {
              click: () => this.preView(item)
            }
          }, item.materialName)))
          const div = document.createElement('div');
          this.__patch__(div, vnode, true, false)
          return div
        }
        return `<span title="${params.value}">${(params.value || params.value === 0) ? params.value : ''}</span>`
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
      queryList() {
        // queryCaseAbroadBillInfo({
        //   caseId: this.caseId,
        //   pageSize: 9999
        // }).then(res => {
        //   this.list = res.data
        // })
      },
      queryTitle() {
        this.tableHeader = this.preferenceList.map(item => ({
          label: item.title,
          prop: item.value,
          width: this.getLoactionWidth(item.title)
        }))
        this.columnDefs = [...this.defaultcolumnDefs, ...this.preferenceList.map(item => ({
          headerName: item.title,
          field: item.value,
          width: this.getLoactionWidth(item.title) == 'auto' ? 200 : this.getLoactionWidth(item.title),
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
        // this.$nextTick(() => {
        //   this.columnDefs.forEach(item => {
        //     this.columnApi && this.columnApi.getColumn(item.field) && this.columnApi.getColumn(item.field).addEventListener('menuVisibleChanged', () => {
        //       if (document.querySelector('.ag-tabs')) {
        //         new this.$DraginResize(document.querySelector('.ag-set-filter-list'), {
        //           clone: true,
        //           end(info) {
        //             if (info.dir == 'ver') {
        //               this.elem.style.height = info.height + 'px'
        //             } else if (info.dir == 'hor') {
        //               this.elem.style.width = info.width + 'px'
        //             }
        //           }
        //         })
        //       }
        //     })
        //   })
        // })
      },
      dragStopped(params) {
        let tableHeader = params.columnApi.columnController.gridColumns.map(item => ({
          label: item.colDef.headerName,
          width: item.actualWidth,
          prop: item.colDef.field
        })).filter(item => item.prop != 'sid' && item.prop != 'group')
        this.tableHeader = tableHeader
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
      onGridReady(params) {
        this.gridparams = params
        this.gridApi = params.api
        this.columnApi = params.columnApi
        // params.api.sizeColumnsToFit()
      }
    }
  }
</script>

<style lang="scss" scoped>
  .grid-table {
    position: relative;
  }
  .brush_right {
    position: absolute;
    right: 6px;
    z-index: 1;
    top: 0px;
  }

</style>
