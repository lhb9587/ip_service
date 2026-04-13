<template>
  <div>
    <div style="overflow: hidden">
      <el-button style="float: right" size="mini" type="primary" v-allow="0" @click="handleAdd('systemUpdateRecordList')">添加</el-button>

      <TitleTotal :total="list.length" :currentPageSize="currentPageSize"/>
     </div>
    <AgGridVue :style="{width:'100%',height: 800+'px'}"
               class="ag-theme-balham"
               :columnDefs="columnDefs"
               :rowData="list"
               @sortChanged="refreshEvenRowsCurrencyData"
               @filterChanged="refreshEvenRowsCurrencyData"
               @cellEditingStopped="cellEditingStopped"
               rowSelection="multiple"
               @gridReady="onGridReady"
               :gridOptions="gridOptions"
               :rowHeight="28"
               animateRows
               suppressAutoSize
               :getContextMenuItems="getContextMenuItems"
    >
    </AgGridVue>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <el-form ref="form" :model="updateData" label-width="80px" size="mini">
        <el-form-item label="内容">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="updateData.message">
          </el-input>
        </el-form-item>
        <el-form-item label="版本号">
          <el-input v-model="updateData.version"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { querySystemUpdateRecordList,insertSystemUpdateRecord, deleteSystemUpdateRecord, updateSystemUpdateRecord, querySystemUpdateRecord } from '@/api/systemList'
  import axios from 'axios'
  export default {
    name: "historyDetail",
    data(){
      return {
        dialogVisible:false,
        updateData:{
          createDate: "",
          createUserId: this.$store.getters.userId,
          id: null,
          message: "",
          modifyDate: "",
          version: "",},
        systemUpdateRecordList: [],
        addType:'',
        operateType:'',
        data:'',
        list:[],
        currentPageSize:0,
        columnDefs:[{

        }],
        gridOptions:{
          onColumnResized(params) {

            params.api.resetRowHeights();
          },
        },
        preferenceList:[ {title: '序号', value: 'sid',width:100},{title:'描述',value:'message',width:500,editable:true,cellEditor:'agLargeTextCellEditor'},{title:'时间',value:'modifyDate',cellEditor:'agLargeTextCellEditor',width:500,editable:true}]
      }
    },
    created() {
      this.columnDefs = this.preferenceList.map(item=>({
        headerName: item.title,
        field: item.value,
        resizable: true,
        sortable: true,
        filter: 'agSetColumnFilter',
        cellRenderer:this.cellRenderer,
        menuTabs: ['filterMenuTab','generalMenuTab','columnsMenuTab'],
        enableRowGroup: true,
        editable:item.editable? true:'',
        cellEditor: item.cellEditor,
        autoHeight: true,
        cellStyle: { 'white-space': 'normal' },
        width:item.width,
        filterParams: {
          newRowsAction: 'keep',
          comparator: (a, b)=>{
            return this.$commonUtils.sort(a,b,item.value)
          }
        }
      }))
      this.init()

    },
    methods:{
      init(){

        this.querySystemUpdateRecordList()
      },
      refreshEvenRowsCurrencyData(params) {
        // this.currentPageSize = params.api.rowModel.rootNode.allChildrenCount
        if (!params.columnApi.columnController.groupAutoColumns) {
          this.gridApi.forEachNode(rowNode => {
            rowNode.setDataValue(
              'sid',
              rowNode.rowIndex + 1)
          });
        }
      },
      cellRenderer(params){
        if(params.colDef.field == 'sid'){
          return params.rowIndex+1// params.data.no//params.rowIndex+1
        }
        if(params.colDef.field=='message'){
          return  this.getSpecialInfo(params.value)
        }
        return  `<span title="${params.value}">${params.value?params.value:''}</span>`
      },
      cellEditingStopped(event){
       let {id,message,modifyDate}=event.data
        let  data = { id, message,modifyDate}
        if(event.colDef.field!=='modifyDate'){
         delete data.modifyDate
        }
        updateSystemUpdateRecord(data).then(res=>{
          this.init()
        })
      },
      getContextMenuItems(params){
        if(!params.node||!params.node.data){
          return []
        }
        return this.getRowContextmenuList(params.node.data).map(item=>({
          name: item.name,
          action: () =>{
            this[item.action](params.node.data,params.value,params.node)
          },
        }))
      },
      getRowContextmenuList(item) {
        return [
          // {name: '复制', action: 'copy'},
          // {name: '修改', action: 'editMessage', permissions: 0},
          {name: '删除', action: 'delMessage', permissions: 0}].filter(item => {
          if (item.permissions) {
            return this.$store.getters.permissions.includes(item.permissions)
          } else {
            return  true
          }
        })
      },
      handleAdd(type){
        this.addType=type
        this.operateType='add'
        this.updateData={
          createDate: "",
          createUserId: this.$store.getters.userId,
          id: null,
          message: "",
          modifyDate: "",
          version: ""}
        this.dialogVisible=true
      },
      delMessage(item,type){
        deleteSystemUpdateRecord({id:item.id}).then(res=>{
          this.dialogVisible=false
          this.init()
        })
      },
      handleConfirm(){
        if(this.operateType=='add'){
          insertSystemUpdateRecord(this.updateData).then(res=>{
            this.dialogVisible=false
            this.init()
          })
        }else {
          updateSystemUpdateRecord(this.updateData).then(res=>{
            this.dialogVisible=false
            this.init()
          })
        }

      },
      onGridReady(params) {
        this.gridparams=params
        this.gridApi = params.api;
        this.columnApi = params.columnApi;
      },
      getSpecialInfo(string){
        if(string){
          return string.split('\n').map(item=>`<p style="word-wrap: break-word;
                 word-break: break-word;">${item}</p>`).join('')
        }else {
          return ''
        }
      },
      querySystemUpdateRecordList(){
        querySystemUpdateRecordList({pageNo:1, pageSize:100000}).then(res=>{
          // this.data[2020-05-29 11:33:07]
          // console.log(res.data.match(/\[.*?\][{]"billId":.*?[}]/g));
          // console.log(res.data.match(/[{].*?[}]/g))
           this.list = res.data

          setTimeout(()=>{
            // this.currentPageSize = this.gridApi.rowModel.rootNode.allChildrenCount
            // this.columnDefs.forEach(item=>{
            //   this.columnApi.getColumn(item.field).addEventListener('menuVisibleChanged', ()=>{
            //     if(document.querySelector(".ag-tabs")){
            //       new this.$DraginResize(document.querySelector(".ag-set-filter-list"), {
            //         clone: true,
            //         end(info) {
            //           if (info.dir == 'ver') {
            //             this.elem.style.height = info.height + 'px';
            //           }
            //           else if (info.dir == 'hor') {
            //             this.elem.style.width = info.width + 'px';
            //           }
            //         }
            //       })
            //     }
            //
            //   });
            // })

          })
          console.log(this.list);
        })
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
