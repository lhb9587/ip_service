<template>
  <div>
    <el-button class="brush_right" :class="brushRightHasFilter?'red':''" @click="brushRight" type="text"
               icon="el-icon-brush"></el-button>
    <AgGridVue :style="{width:'100%',height: '70vh'}"
               id="right-grid"
               class="ag-theme-balham"
               :columnDefs="columnDefs"
               :rowData="tableData"
               @grid-ready="onGridReady"
               rowSelection="multiple"
               :gridOptions="gridOptions"
               suppressAutoSize
               animateRows
               :getContextMenuItems="getContextMenuItems"
               @sortChanged="refreshEvenRowsCurrencyData"
               @filterChanged="refreshEvenRowsCurrencyData"
               :localeText="$store.state.caseInformation.localeText"
               :pinnedBottomRowData="pinnedBottomRowData"
               :groupSelectsChildren="true"
               :suppressAggFuncInHeader="true"
               rowHeight="28"
    >
    </AgGridVue>
  </div>
</template>

<script>
  import {formatAmount, fomatFloat} from '@/utils/filters'

  export default {
    name: 'DetailGrid',
    props: {
      tableData: {
        type: Array,
        default: () => []
      },
      tableTitleList: {
        type: Array
      }
    },
    computed: {
      pinnedBottomRowData(){
        if(this.gridApi.rowModel){
          const columnDisplay = ['officialCost','billSum','incomeSum','otherCost']
          return this.$commonUtils.pinnedBottomRowData(this.gridApi.rowModel.rootNode.childrenAfterFilter.map(item=>item.data), this.columnDefs, columnDisplay)
        }
        return ''
      },
    },
    data() {
      return {
        gridOptions: {
          ...this.$store.state.caseInformation.gridOptions,
          singleClickEdit: true,
          onCellEditingStarted() {
            // console.log('##############')
          },
          onCellValueChanged(event) {

            event.api.refreshCells()
          },
          onCellEditingStopped: (event) => {
            event.api.refreshCells()
          }
        },
        defaultcolumnDefs: [
          {
            headerName: '序号',
            field: 'sid',
            width: 70,
            'pinned': 'left', //固定再左边
            resizable: true,
            filter: false,
            cellClass: 'vAlign',
            suppressMenu: true,
            checkboxSelection: false,
            headerCheckboxSelection: false,
            headerCheckboxSelectionFilteredOnly: true,
            cellRenderer: this.cellRenderer

          }
        ],
        columnDefs: [],
        gridparams: {},
        gridApi: {},
        columnApi: {},
        brushRightHasFilter: false,
      }
    },
    created() {
      this.getColumDefs()
    },
    methods: {
      cellRenderer(params) {
        if (params.colDef.field == 'sid' && params.value !== '') {
          return params.rowIndex + 1
        }
        if (Object.prototype.toString.call(params.value).includes('Number')) {
          if (params.colDef.field == 'foreignSum') {
            return `<span title="${params.value}" style="float: right">${fomatFloat(+params.value, 1)}</span>`
          } else {
            return `<span title="${params.value}" style="float: right">${formatAmount(params.value)}</span>`
          }
        }
        if (params.colDef.field == 'material') {
          const h = this.$createElement
          const vnode = h('div', {
            'class': {
              'href': true
            },
            attrs: {
              title: params.value && params.value.materialName
            },
            on: {
              click: () => this.preView(params.value || {})
            }
          }, params.value && params.value.materialName)
          const div = document.createElement('div')
          this.__patch__(div, vnode, true, false)
          return div
        }
        return `<span title="${params.value}">${(params.value || params.value === 0) ? params.value : ''}</span>`
      },
      onGridReady(params) {
        this.gridparams = params
        this.gridApi = params.api
        this.columnApi = params.columnApi
        params.api.sizeColumnsToFit()
      },
      brushRight() {
        let data = this.$commonUtils.getFilterModel(this.$options.name + this.$route.name, 'FilterModel')
        let arr = Object.keys(data)
        arr.forEach(item => {
          this.gridApi.destroyFilter(item)
        })
        this.$commonUtils.saveFilterModel(this.$options.name + this.$route.name, 'FilterModel', {})
      },
      getColumDefs() {
        this.columnDefs = [...this.defaultcolumnDefs, ...this.tableTitleList.map(item => ({
          headerName: item.title,
          field: item.value,
          width: item.width || 200,
          resizable: true,
          sortable: true,
          filter: 'agSetColumnFilter',
          cellRenderer: this.cellRenderer,
          menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
          // enableRowGroup: true,
          filterParams: {
            refreshValuesOnOpen: true,
            comparator: (a, b) => {
              return this.$commonUtils.sort(a, b, item.value)
            }
          }
        }))]
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
        // if(!params.columnApi.columnController.groupAutoColumns) {
        //   this.gridApi.forEachNode(rowNode => {
        //     rowNode.setDataValue(
        //       'sid',
        //       rowNode.rowIndex + 1)
        //   });
        // }
        if (this.tableData.length) {
          // this.$commonUtils.saveFilterModel(this.$options.name+this.$route.name,'FilterModel',this.gridApi.getFilterModel())
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
      },
      getContextMenuItems(params) {
        if (!params.node || !params.node.data) {
          return []
        }
        return this.getRowContextmenuList(params.node.data).map(item => ({
          name: item.name,
          action: () => {
            this[item.action](params.node.data, params.node.rowIndex, params.value, params.node)
          }
        }))
      },
      getRowContextmenuList(row) {
        return [
          {name: '复制', action: 'copy'},
        ]
      },
      copy(row, value) {
        this.$copyText(value).then(
          res => {
          })
      },
      getSelectedRows() {
        if (this.gridApi) {
          const selectedNodes = this.gridApi.getSelectedNodes()
          const selectedData = selectedNodes.map(node => node.data)
          return selectedData
        } else {
          return false
        }

      }
    }
  }
</script>

<style lang="scss" scoped>
  .brush_right {
    position: absolute;
    right: 16px;
    z-index: 1;
    top: 50px;
  }

  /deep/ .ag-cell-inline-editing {
    background: #fff;
    color: #333;
  }

  > > > .href {
    cursor: pointer;
    color: #409eff;
  }

  > > > .ag-row-selected {
    .href {
      cursor: pointer;
      color: #fff;
    }
  }
</style>
