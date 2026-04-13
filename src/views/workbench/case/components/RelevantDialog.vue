<template>
  <div>
    <el-dialog
      title="相关案件"
      append-to-body
      :modal="true"
      class="out-dialog"
      :visible.sync="viewState"
      width="60%"
      :close-on-click-modal="false"
      :before-close="closeDialog"
    >
      <div>
        <el-button class="exactButton" type="primary" size="mini"
                   @click="()=>{this.gridApi.deselectAll();this.gridApi.selectAllFiltered()}">全选
        </el-button>
        <el-button class="exactButton" size="mini" @click="this.gridApi.deselectAll()">清除所选</el-button>
        <el-button class="exactButton" size="mini" @click="addRelCase" type="primary">增加</el-button>
        <el-button class="exactButton" size="mini" @click="delCases" type="primary">删除</el-button>
        <AgGridVue
          style="width:100%;height: 500px"
          class="ag-theme-balham"
          :columnDefs="columnDefs"
          :rowData="caseList"
          rowSelection="multiple"
          @grid-ready="onGridReady"
          :gridOptions="gridOptions"
          :getContextMenuItems="getContextMenuItems"
          @sortChanged="refreshEvenRowsCurrencyData"
          @filterChanged="refreshEvenRowsCurrencyData"
          suppressAutoSize
          animateRows
          :localeText="$store.state.caseInformation.localeText"
          :frameworkComponents="frameworkComponents"
          :stopEditingWhenCellsLoseFocus="true"
        >
        </AgGridVue>
        <div class="fl-ac-jc" style="margin-top: 10px">
          <el-button size="small" @click="closeDialog">取 消</el-button>
          <el-button size="small" type="primary" @click="saveCaseList">保 存</el-button>
        </div>

        <!--    <pagination v-show="total>0" :total="total" :page-sizes="[10,50,100,500,1000,5000]" :page.sync="listQuery.pageNo"-->
        <!--                :limit.sync="listQuery.pageSize" @pagination="getList"/>-->
      </div>

    </el-dialog>
  </div>
</template>

<script>
  import agInput from './relevantAgInput'
  import { relevantCase, queryRelevantCase } from '@/api/caseList'

  export default {
    name: 'RelevantDialog',
    props: {
      viewState: {
        type: Boolean,
        default: false
      },
      business: {
        type: [Number, String],
        default: 19
      },
      relCaseId: {
        type: [Number, String],
        default: ''
      }
    },
    data() {
      return {
        gridOptions: {
          ...this.$store.state.caseInformation.gridOptions,
          singleClickEdit: true,
          onCellEditingStarted(event) {

          },
          onCellValueChanged(event) {

          },
          onCellEditingStopped: (event) => {
            if(!event.data.relevantCaseId){
              event.data['relevantAgent'] = ''
            }
            event.api.refreshCells()
          }
        },
        caseList: [],
        defaultcolumnDefs: [
          {
            headerName: '序号',
            field: 'sid',
            width: 60,
            'pinned': 'left', // 固定再左边
            enableRowGroup: true,
            // enablePivot: true,
            floatingFilter: true,
            filter: false,
            cellClass: 'vAlign',
            suppressMenu: true,
            checkboxSelection: false,
            headerCheckboxSelection: false,
            headerCheckboxSelectionFilteredOnly: true,
            cellRenderer: this.cellRenderer
          }
        ],
        frameworkComponents: {
          agInput
        },
        preferenceList: [
          { 'label': '案件文号', prop: 'relevantAgent', 'editable': true, 'cellEditor': 'agInput' },
          { 'label': '相关理由', prop: 'relevantReason', 'editable': true }
        ],
        columnDefs: [],
        gridApi: {}

      }
    },
    created() {
      this.init()
    },
    methods: {
      init() {
        this.queryRelevantCase()
        this.getColumDefs()
      },
      getSelectedRows() {
        if (this.gridApi) {
          const selectedNodes = this.gridApi.getSelectedNodes()
          const selectedData = selectedNodes.map(node => node.data)
          return selectedData
        } else {
          return []
        }
      },
      getColumDefs() {
        this.columnDefs = [...this.defaultcolumnDefs, ...this.preferenceList.map(item => ({
          headerName: item.label,
          field: item.prop,
          width: item.width,
          resizable: true,
          editable: (params) => {
            return params.data.edit
          },
          cellEditor: item.cellEditor,
          // sortable: true,
          filter: 'agSetColumnFilter',
          cellRenderer: this.cellRenderer,
          menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
          // enableRowGroup: true,
          filterParams: {
            refreshValuesOnOpen: true,
            comparator: (a, b) => {
              return this.$commonUtils.sort(a, b, item.prop)
            }
          }
        }))]
      },
      queryRelevantCase() {
        queryRelevantCase({
          caseId: this.relCaseId,
          business: this.business
        }).then(res => {
          this.caseList = res.data.relevantCaseArray || []
        })
      },
      addRelCase() {
        const data = {
          relevantAgent: '',
          relevantReason: '',
          isUpdate:1,
          edit: true,
          business: this.business

        }
        this.caseList.push(data)
        this.gridApi.refreshCells()
        this.$commonUtils.scrollToBottom(document.getElementsByClassName('ag-body-viewport')[0])
      },
      saveCaseList() {
        this.gridApi.stopEditing()
        relevantCase({
          caseId: this.relCaseId,
          business: this.business,
          relevantCaseArray: this.caseList.filter(item => item.relevantCaseId).map(item => ({
            isUpdate: item.isUpdate,
            relevantCaseId: item.relevantCaseId,
            relevantAgent: item.relevantAgent,
            relevantReason: item.relevantReason
          }))
        }).then(res => {
          this.$message.success('保存成功！')
          this.closeDialog()
        }).catch(err => {
          this.$message.error('保存失败！')
        })
      },
      delCases() {
        if (this.getSelectedRows().length) {
          if(this.getSelectedRows().filter(item=>!item.isUpdate).length){
            let agentNumStr = this.getSelectedRows().filter(item=>!item.isUpdate).map(item=>item.relevantAgent).join(',')
            this.$message.error(`案号${agentNumStr}无法删除！`)
            return
          }
          this.getSelectedRows().map(i => {
            let index = this.caseList.indexOf(i)
            this.caseList.splice(index, 1)
          })

        }
      },
      closeDialog() {
        this.$emit('closeRelevantDialog')
      },
      cellRenderer(params) {
        if (params.colDef.field === 'sid') {
          return params.rowIndex + 1
        }
        return `<span title='${params.value}'>${params.value ? params.value : ''}</span>`
      },
      refreshEvenRowsCurrencyData(params) {
        // this.currentPageSize = params.api.rowModel.rootNode.allChildrenCount
        if (!params.columnApi.columnController.groupAutoColumns) {
          this.gridApi.forEachNode(rowNode => {
            rowNode.setDataValue(
              'sid',
              rowNode.rowIndex + 1)
          })
        }
      },
      onGridReady(params) {
        this.gridparams = params
        this.gridApi = params.api
        this.columnApi = params.columnApi
        params.api.sizeColumnsToFit()
      },
      getContextMenuItems(params) {
        if (!params.node || !params.node.data) {
          return []
        }
        return this.getRowContextmenuList(params.node.data).map(item => ({
          name: item.name,
          action: () => {
            this[item.action](params.node.data, params.value, params.node)
          }
        }))
      },
      getRowContextmenuList(row) {
        return [
          { name: '复制', action: 'copy' }
          // { name: '商标导入', action: 'installtmmessage', permissions: 185 },
          // {name: '修改', action: 'editFun', permissions: 73},
          // {name: '删除', action: 'handledeleElement', permissions: 74}
        ]
      },
      copy(row, value) {
        this.$copyText(value).then(
          res => {
          })
      }
    }
  }
</script>

<style lang="scss" scoped>
  > > > .ag-theme-balham {
    input {
      color: #000 !important;
    }
  }
</style>
