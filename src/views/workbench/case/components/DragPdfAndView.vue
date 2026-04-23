<template>
  <div>
    <el-form label-width="80px">
      <el-form-item label="名称:" style="margin-bottom: 10px">
        <el-input size="small" v-model="mergeName" placeholder="请输入合并后文件名称"></el-input>
      </el-form-item>
    </el-form>
    <div style="display: flex;height: calc(100vh - 300px);">
      <AgGridVue :style="{width: '215px', maxHeight:'100%',overflow: 'auto',border:'1px'}"
                 class="ag-theme-balham"
                 ref="gridApibillDetailsfwf"
                 :columnDefs="columnDefs"
                 @grid-ready="onGridReady"
                 :getContextMenuItems="getContextMenuItems"
                 @sortChanged="refreshEvenRowsCurrencyData"
                 @filterChanged="refreshEvenRowsCurrencyData"
                 :gridOptions="gridOptions"
                 :rowData="dragDataList"
                 rowSelection="multiple"
                 :localeText="$store.state.caseInformation.localeText"
                 animateRows
                 suppressAutoSize
                 :suppressRowDrag="false"
                 :rowDragManaged="true"
                 :suppressMoveWhenRowDragging="true"
                 @rowDragEnd="(params)=>rowDragEnd(params)"
      >
      </AgGridVue>
      <iframe :src="pdfSrc" frameborder="1" style="flex: 1"></iframe>
    </div>

    <div class="fl-ac-jc" style="margin-top: 15px">
      <el-button size="small" type="primary" @click="mergeDragFile" v-if="type !=='view' && type !=='audit'">合 并</el-button>
      <el-button size="small" type="primary" @click="mergeDragFile2" v-if="type =='audit'">合 并</el-button>
      <el-button size="small" @click="$emit('closeMergeDialog')">取 消</el-button>
    </div>
  </div>
</template>

<script>
  import {mergePdf,mergePdf2} from "../../../../api/caseDetail";

  export default {
    name: "DragPdfAndView",
    props: {
      mergeFileList: {},
      caseId: {},
      type:""
    },
    data() {
      return {
        mergeName: '',
        rowContextmenuList: [],
        pdfSrc: '',
        dragDataList: [],
        gridApi: {},
        columnDefs: [],
        gridOptions: {
          ...this.$store.state.caseInformation.gridOptions, ...{
            statusBar: {
              statusPanels: [
                {statusPanel: 'agTotalAndFilteredRowCountComponent', align: 'left'},
                {statusPanel: 'agSelectedRowCountComponent', align: 'left'}
              ]
            }
          }
        },
      }
    },
    created() {
      this.dragDataList = JSON.parse(JSON.stringify(this.mergeFileList))
      if (this.dragDataList&&this.dragDataList.length > 0) {
        this.pdfSrc = '/ipdoc' + this.dragDataList[0].address
      }
      this.columnDefs = [
        {
          headerName: '序号',
          field: 'sid',
          width: 60,
          resizable: true,
          enableRowGroup: true,
          'pinned': 'left',
          floatingFilter: true,
          filter: false,
          cellClass: 'vAlign',
          cellRenderer: this.cellRenderer,
          suppressMenu: true,
          rowDrag: true
        },
        {
          headerName: '文件名',
          width: 150,
          field: 'name',
          resizable: true,
          enableRowGroup: true,
          // enablePivot: true,
          floatingFilter: true,
          filter: false,
          cellClass: 'vAlign',
          cellRenderer: this.cellRenderer,
          suppressMenu: true
        }
      ]
    },
    methods: {
      getRowContextmenuList(row) {
        return this.rowContextmenuList.concat([
          {name: '复制', action: 'copy'},
          {name: '删除', action: 'delPdf'}
        ])
      },
      copy(row, value) {
        if (value) {
          this.$copyText(value).then(
            res => {
            })
        }
      },
      delPdf(row) {
        this.dragDataList.splice(this.dragDataList.findIndex(item => row.id === item.id), 1)
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
      mergeDragFile() {
        mergePdf({
          name: this.mergeName,
          caseId: this.caseId,
          idList: this.dragDataList.map(item => item.id)
        }).then(res => {
          this.$message.success('合并成功!')
          this.$emit('closeMergeDialog', true)
        })
      },
      mergeDragFile2() {
        mergePdf2({
          name: this.mergeName,
          caseId: this.caseId[0],
          idList: this.dragDataList.map(item => item.id)
        }).then(res => {
          if(res.success && res.data){
            window.open(`/ipdoc${res.data}`.replace(/[+]/g, '%2B'))
          }
        })
      },
      rowDragEnd(event) {
        var movingData = event.node.data
        var fromIndex = this.dragDataList.indexOf(movingData);
        var toIndex = event.overIndex
        if (fromIndex !== toIndex) {
          var newStore = this.dragDataList.slice();
          moveInArray(newStore, fromIndex, toIndex);
          this.dragDataList = newStore;
          this.gridApi.setRowData(newStore);
          this.gridApi.clearFocusedCell();
        }

        function moveInArray(arr, fromIndex, toIndex) {
          var element = arr[fromIndex];
          arr.splice(fromIndex, 1);
          arr.splice(toIndex, 0, element);
        }
      },
      onGridReady(params) {
        this.gridApi = params.api
        if (this.gridApi.rowModel.rootNode.childrenAfterFilter.length) {
          this.gridApi.rowModel.rootNode.childrenAfterFilter[0].setSelected(true)
        }
        // this.gridApi.sizeColumnsToFit()
      },
      refreshEvenRowsCurrencyData(params) {
        this.gridApi.rowModel.rootNode.childrenAfterFilter && this.gridApi.rowModel.rootNode.childrenAfterFilter.length && this.gridApi.rowModel.rootNode.childrenAfterFilter.forEach(rowNode => {
          setTimeout(() => {
            rowNode.setDataValue(
              'sid',
              rowNode.rowIndex + 1)
          }, 0)
        })
      },
      preView(params) {
        this.pdfSrc = '/ipdoc' + params.data.address
      },
      cellRenderer(params) {
        if (params.colDef.field == 'sid') {
          return params.rowIndex + 1
        }
        if (params.colDef.field === 'name') {
          const h = this.$createElement
          const vnode = h('div', {}, [h('p', {
            'class': {
              'pointer': true
            },
            on: {
              click: () => this.preView(params)
            }
          }, params.value)])
          const div = document.createElement('div');
          this.__patch__(div, vnode, true, false)
          return div
        }
        return `<span title="${params.value}">${params.value}</span>`
      }
    }
  }
</script>

<style scoped>

</style>
