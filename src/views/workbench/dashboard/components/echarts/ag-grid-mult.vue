<template>
  <div>
    <AgGridVue
      :style="'width:99%;height:'+tableMaxHeight+'px'"
      class="ag-theme-balham"
      :columnDefs="columnDefs"
      :rowData="tableData"
      rowSelection="single"
      @grid-ready="onGridReady"
      :gridOptions="gridOptions"
      :getContextMenuItems="getContextMenuItems"
      @sortChanged="refreshEvenRowsCurrencyData"
      @filterChanged="refreshEvenRowsCurrencyData"
      @rowClicked="rowClick"
      suppressAutoSize
      animateRows
      :localeText="$store.state.caseInformation.localeText"
      :getRowStyle="getRowStyle"
      :rowHeight="24.2"
    >
    </AgGridVue>
    <!--全屏显示的容器-->
    <el-dialog append-to-body :visible.sync="dialog" fullscreen :show-close="false">
      <el-button size="mini" @click="dialog = false">关闭全屏</el-button>
      <AgGridFullScreen v-if="dialog" :table-data="tableData" :preference-list="preferenceList"></AgGridFullScreen>
    </el-dialog>
  </div>
</template>

<script>
import AgGridFullScreen from './ag-grid-full-screen'
export default {
  name: 'AgGridMult',
  props: ['chartData', 'chartSelectName', 'chartWidth','tableHeight'],
  data() {
    return {
      dialog: false,
      tableWidth: 'auto',
      tableMaxHeight: this.tableHeight ? this.tableHeight : '250',
      tableData: [],
      popstate: false,
      drillName: '',
      gridApi: {}, // ag-grid图表
      columnDefs: [],
      preferenceList: [],
      gridOptions: {
        ...this.$store.state.caseInformation.gridOptions, ...{
          statusBar: {
            statusPanels: [
              // { statusPanel: 'agTotalAndFilteredRowCountComponent', align: 'left' },
              // { statusPanel: 'agSelectedRowCountComponent', align: 'left' }
            ]
          }
        }
      },
      defaultcolumnDefs: [
        //   {
        //   headerName: '序号',
        //   field: 'sid',
        //   width: 60,
        //   resizable: true,
        //   'pinned': 'left', //固定再左边
        //   enableRowGroup: true,
        //   floatingFilter: true,
        //   filter: false,
        //   autoHeight: true,
        //   cellClass: 'vAlign',
        //   suppressMenu: true,
        //   checkboxSelection: false,
        //   headerCheckboxSelection: false,
        //   headerCheckboxSelectionFilteredOnly: true,
        //   cellRenderer: this.cellRenderer
        // }
      ],
    }
  },
  created() {
    this.chartData.headers && this.initOption()
    this.agInit()
  },
  mounted() {
    if (window.history && window.history.pushState) {
      this.popstate = true
    }
  },
  methods: {
    initOption() {
      this.preferenceList = this.chartData.headers
      this.tableData = this.chartData.list

      // 默认下级钻取条件, 设置选中数据
      this.drillName = this.chartSelectName ? this.chartSelectName : (this.tableData[0] ? this.tableData[0].name : '')
      this.drillName && this.$emit('saveDrillPanels', this.drillName, 1)

      // 高亮选中
      this.$nextTick(()=>{
        if (this.chartData.headers.find(item => item.field == 'name') !== undefined && this.drillName && this.gridApi && this.gridApi.rowModel) {
          this.gridApi.forEachNode(node => {
            node.setSelected(node.data.name === this.drillName);
          })
        }
      })
    },

    // 单元格整行点击事件
    getDrillPanels(row) {
      this.$emit('drillPanels', row.name)
    },
    goBack() {
      // 在这里写自己的业务逻辑
      this.dialog = false;
    },
    // ag-grid 图表相关方法
    agInit() {
      this.columnDefs = [...this.defaultcolumnDefs, ...this.preferenceList.map(item => ({
        headerName: item.name,
        field: item.field,
        resizable: true,
        sortable: true,
        width: item.width,
        filter: 'agSetColumnFilter',
        cellRenderer: this.cellRenderer,
        menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
        filterParams: {
          defaultToNothingSelected: true,
          newRowsAction: 'keep',
          comparator: (a, b) => {
            return this.$commonUtils.sort(a, b, item.value)
          }
        }
      }))]
    },
    // 数据点击
    rowClick(row, column, event){
      row.data.name && this.$emit('drillPanels', row.data.name)
    },
    // 设置列背景颜色
    getRowStyle(params){
      return { background: '#fff' };
      // if (params.node.rowIndex % 2 === 0) {
      //  return { background: '#fff' };
      // }
    },
    // 创建完成后执行的事件
    onGridReady(params) {
      this.gridparams = params
      this.gridApi = params.api
      this.columnApi = params.columnApi

      // 初始加载，默认高亮选中
      if (this.chartData.headers.find(item => item.field == 'name') !== undefined && this.drillName) {
        this.gridApi.forEachNode(node => {
          node.setSelected(node.data.name === this.drillName);
        })
      }
    },
    // 排序/过滤器
    getContextMenuItems(params) {
      if (!params.node || !params.node.data) {
        return []
      }
      // return this.getRowContextmenuList(params.node.data).map(item => ({
      //   name: item.name,
      //   action: () => {
      //     this[item.action](params.node.data, params.value, params.node)
      //   }
      // }))
    },
    // 排序/过滤器
    refreshEvenRowsCurrencyData(params) {
      // if(!params.columnApi.columnController.groupAutoColumns) {
      //   this.gridApi.forEachNode(rowNode => {
      //     rowNode.setDataValue(
      //       'sid',
      //       rowNode.rowIndex + 1)
      //   });
      // }
    },
    cellRenderer(params) {
      if (params.colDef.field === 'sid') {
        return params.rowIndex + 1
      }
      return `<span style="${isNaN(parseFloat(params.value)) ? '' : 'float:right' }" title="${params.value}">${params.value !== undefined && params.value !== null ? params.value : ''}</span>`
    },
  },
  watch: {
    chartData() {
      this.chartData.headers && this.initOption()
    },
    dialog() {
      if (this.popstate){
        if (this.dialog){
          history.pushState(null, null, document.URL);
          window.addEventListener('popstate', this.goBack, false);
        }else {
          window.removeEventListener('popstate', this.goBack, false);
        }
      }
    }
  },
  components: {
    AgGridFullScreen
  }
}
</script>

<style lang="scss" scoped>
.el-table{
  /deep/ th{
    padding: 0;
    color: rgba(51, 51, 51, 1);
    background: #f5f7fa;
  }
  /deep/ td {
    padding: 0;
  }
  /deep/ .el-table__body tr.current-row>td{
    background-color: #81bdff;
  }
  /deep/ .cell {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
  }
}
.el-dialog .el-button{
  margin-bottom: 10px;
}

/deep/ .ag-theme-balham .ag-cell {
  line-height: 24px;
}
</style>
