<template>
  <div>
    <el-button class="exactButton" type="primary" size="mini"
               @click="()=>{this.gridApi.deselectAll();this.gridApi.selectAllFiltered()}">全选
    </el-button>
    <el-button class="exactButton" size="mini" @click="this.gridApi.deselectAll()">清除所选</el-button>
    <el-button class="exactButton" size="mini" @click="downLoadCpc" type="primary">批量下载</el-button>
    <el-button class="exactButton" size="mini" @click="exportCpc" type="primary">导出</el-button>
    <AgGridVue
      style="width:100%;height: 500px"
      class="ag-theme-balham"
      :columnDefs="columnDefs"
      :rowData="cpcData"
      rowSelection="multiple"
      @grid-ready="onGridReady"
      :gridOptions="gridOptions"
      :getContextMenuItems="getContextMenuItems"
      @sortChanged="refreshEvenRowsCurrencyData"
      @filterChanged="refreshEvenRowsCurrencyData"
      suppressAutoSize
      animateRows
      :localeText="$store.state.caseInformation.localeText"
    >
    </AgGridVue>
    <div class="fl-ac-jc">
      <el-button @click="$emit('close')">取 消</el-button>
      <el-button type="primary" @click="createPatentMultMaterial">确 定</el-button>
    </div>

    <!--    <pagination v-show="total>0" :total="total" :page-sizes="[10,50,100,500,1000,5000]" :page.sync="listQuery.pageNo"-->
    <!--                :limit.sync="listQuery.pageSize" @pagination="getList"/>-->
  </div>
</template>

<script>
  import {doEditInOffice, getProgID} from '@/utils/editInOffice.js'
  import {
    queryUnloadedDocFromCPC,
    createPatentMultMaterial,
    batchDownloadCPCDocs,
    batchDownloadCPCExcel
  } from "@/api/caseList";
  import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
  export default {
    name: "cpcGrid",
    components: {
      Pagination
    },
    data() {
      return {
        total: 0,
        cpcData: [],
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
        preferenceList: [
          {'label': '案件文号', prop: 'neibubh'},
          {'label': '通知书编号', prop: 'tongzhisbh'},
          {'label': '通知书代码', prop: 'tongzhisdm'},
          {"label": "发明名称", prop: "famingmc"},
          {"label": "发文序列号", prop: "fawenxlh"},
          {"label": "通知书名称", prop: "tongzhismc"},
          {"label": "申请号", prop: "shenqingh"},
          {"label": "申请日", prop: "SHENQINGR"},
          {"label": "国际申请号", prop: "guojisqh"},
          {"label": "委内编号", prop: "weineibh"},
          {"label": "发文日期", prop: "FAWENRQ"}
        ],
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
      // this.queryUnloadedDocFromCPC()
    },
    methods: {
      previewFile(data) {
        let url = data.address
        if (getProgID(url)||url.replace(/.+\./,"").toLocaleLowerCase()=='msg') {
          if(['doc','docx'].includes(url.replace(/.+\./,"").toLocaleLowerCase())){
            this.$commonUtils.viewPdf(`${url}`)
          }else {
            let flag = ''
            if(data.mailId){
              flag = 'mailId'
            }else if (data.materialId) {
              flag = 'materialId'
            }
            url = url.replace(/&/g, '%26')
            window.open(`#/preView?address=ipdoc${url}&${flag}=${data[flag]}`.replace(/[+]/g,'%2B'))
          }
          // doEditInOffice(url, getProgID(url))
        } else if(['pdf','jpg','png'].some(item=>url.replace(/.+\./,"").toLocaleLowerCase()==item)){
          window.open(`/ipdoc${url}`.replace(/[+]/g,'%2B'))
        } else {
         this.downLoad(data)
        }
      },
      downLoad(data) {
        const url = data.address
        const downData = {
          url: `ipdoc${url}`,
          success() {
            // notify.close()
          }
        }
        if (data.mailId) {
          downData.downLoad = data.materialName
        }
        this.$commonUtils.downLoadAll(downData)
      },
      exportCpc(){
        if(!this.getSelectedRows().length){
          this.$message.error('请选择数据!')
          return
        }
        batchDownloadCPCExcel({idArray: this.getSelectedRows().map(item => item.id)}).then(res=>{
          this.$commonUtils.downLoadAll({url: "ipdoc" + res.data})
        }).catch(()=>{
          this.$message.error('导出失败!')
        })
      },
      downLoadCpc(){
        if(!this.getSelectedRows().length){
          this.$message.error('请选择数据!')
          return
        }
        batchDownloadCPCDocs({idArray: this.getSelectedRows().map(item => item.id)}).then(res=>{
          this.$commonUtils.downLoadAll({url: "ipdoc" + res.data})
        }).catch(()=>{
          this.$message.error('下载失败!')
        })
      },
      getSelectedRows() {
        if (this.gridApi) {
          const selectedNodes = this.gridApi.getSelectedNodes();
          const selectedData = selectedNodes.map(node => node.data);
          return selectedData
        }
      },
      createPatentMultMaterial() {
        createPatentMultMaterial(
          {
            idArray: this.getSelectedRows().map(item => item.id)
          }
        ).then(res => {
          this.$message.success(res.message)
          this.$emit('close', 'update')
        })
      },
      queryUnloadedDocFromCPC() {
        this.columnDefs = [...this.defaultcolumnDefs, ...this.preferenceList.map(item => ({
          headerName: item.label,
          field: item.prop,
          resizable: true,
          sortable: true,
          width: item.width,
          filter: 'agSetColumnFilter',
          cellRenderer: this.cellRenderer,
          menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
          enableRowGroup: true,
          filterParams: {
            defaultToNothingSelected: true,
            newRowsAction: 'keep',
            comparator: (a, b) => {
              return this.$commonUtils.sort(a, b, item.value)
            }
          }
        }))]
        queryUnloadedDocFromCPC().then(res => {
          this.cpcData = res.data
        })
      },
      cellRenderer(params) {
        if (params.colDef.field === 'sid') {
          return params.rowIndex + 1
        }
        if (params.colDef.field == 'tongzhismc') {
          var eDiv = document.createElement('div');
          eDiv.innerHTML = `<span class="btn-simple" style="cursor: pointer;color: #00b0ff" title="${params.value}">${params.value ? params.value : ''}</span>`
          var eButton = eDiv.querySelectorAll('.btn-simple')[0];

          eButton.addEventListener('click', () => {
            if (params.data) {
              params.data.address = params.data.beizhu
              this.previewFile(params.data)
            }
          });

          return eDiv;
        }
        return `<span title="${params.value}">${params.value ? params.value : ''}</span>`
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
        console.log(params)
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
          {name: '复制', action: 'copy'},
          // { name: '商标导入', action: 'installtmmessage', permissions: 185 },
          // {name: '修改', action: 'editFun', permissions: 73},
          // {name: '删除', action: 'handledeleElement', permissions: 74}
        ]
      },
      copy(row, value) {
        this.$copyText(value).then(
          res => {
          })
      },
    }
  }
</script>

<style scoped>

</style>
