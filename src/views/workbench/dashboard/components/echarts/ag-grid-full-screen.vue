<template>
  <div>
    <AgGridVue
      style="width:99%;height:700px"
      class="ag-theme-balham"
      :columnDefs="columnDefs"
      :rowData="tableData"
      rowSelection="single"
      @grid-ready="onGridReady"
      :gridOptions="gridOptions"
      :getContextMenuItems="getContextMenuItems"
      @sortChanged="refreshEvenRowsCurrencyData"
      @filterChanged="refreshEvenRowsCurrencyData"
      suppressAutoSize
      animateRows
      :localeText="$store.state.caseInformation.localeText"
      :getRowStyle="getRowStyle"
    >
    </AgGridVue>
  </div>
</template>

<script>
export default {
  name: 'AgGridFullScreen',
  props: ['tableData','preferenceList'],
  data() {
    return {
      gridApi: {}, // ag-grid图表
      columnDefs: [],
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
      defaultcolumnDefs: [],
    }
  },
  created() {
    this.agInit()
  },
  mounted() {

  },
  methods: {
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
    },
    // 排序/过滤器
    getContextMenuItems(params) {
      if (!params.node || !params.node.data) {
        return []
      }
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
      return `<span title="${params.value}">${params.value !== undefined && params.value !== null ? params.value : 0}</span>`
    },
  },
  watch: {
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
