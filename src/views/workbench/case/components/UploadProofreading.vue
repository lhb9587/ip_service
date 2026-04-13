<template>
  <div>
    <el-form label-width="206px" v-if="multipleTypeText!='文件上传' && !this.upType">
      <el-form-item label="文件/事件类型:">
        <el-select default-first-option v-model="submitData.materialTypeId" placeholder="请选择" filterable clearable >
          <el-option v-for="item in materialTypeByDocIdList" :key="item.materialTypeId" :label="item.typeName" :value="item.materialTypeId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="文件/事件名称:">
        <el-input  v-model="submitData.eventName" placeholder="请输入内容"></el-input>
      </el-form-item>
    </el-form>
    <AgGridVue :style="{width:'100%',height: 650+'px'}"
               class="ag-theme-balham"
               :columnDefs="columnDefs"
               :rowData="caseList"
               rowSelection="multiple"
               :gridOptions="gridOptions"
               suppressAutoSize
               animateRows
               @grid-ready="onGridReady"
               :localeText="$store.state.caseInformation.localeText"
               :suppressDragLeaveHidesColumns="true"
               :suppressMakeColumnVisibleAfterUnGroup="true"
               @drop.native.stop.prevent="enentDrop($event)"
               @dragover.native.stop.prevent="hoverState=true"
               @dragleave.native.stop.prevent="hoverState=false"
               @dragenter.native.stop.prevent="hoverState=true"
    >
    </AgGridVue>
    <div class="button_wrap">
      <el-button  @click="$emit('cancel')">取 消</el-button>
      <el-button type="primary" :disabled="percentage" @click="confirm">确 定</el-button>
    </div>

  </div>
</template>

<script>
  import {uploadDocFile,queryMaterialDocType,queryMaterialTypeByDocId,creatematerial,uploadBatchFile} from "@/api/caseList.js";
  import {
    addCaseEventUrl,
    updateCaseEventUrl,
  } from "@/api/caseDetail";

export default {
  props:{
    bussId:{},
    // isInvoice:{
    //   type: Boolean,
    //   default: false
    // },
    uploadType:{
      default:''
    },
    multipleTypeText:{
      default:''
    },
    defaultCaseList:{
      default:()=>([])
    },
    filelist: {
      default:()=>([])
    },
    upType:{
      default:''
    }
  },
  name: "UploadProofreading",
  data() {
    return {
      submitData:{materialTypeId:null,eventName:null},
      defaultcolumnDefs: [ {
        headerName: '序号',
        field: 'sid',
        width: 100,
        'pinned': 'left', //固定再左边
        enableRowGroup: true,
        // enablePivot: true,
        floatingFilter:true,
        filter: false,
        cellClass: 'vAlign',
        suppressMenu: true,
        checkboxSelection: function(params) {
          // we put checkbox on the name if we are not doing grouping
          return params.columnApi.getRowGroupColumns().length === 0;
        },
        headerCheckboxSelection: function(params) {
          // we put checkbox on the name if we are not doing grouping
          return params.columnApi.getRowGroupColumns().length === 0;
        },
        // headerCheckboxSelectionFilteredOnly: true,
        cellRenderer: this.cellRenderer,
      }],
      columnDefs:[],
      gridOptions: this.$store.state.caseInformation.gridOptions,
      caseList:[],
      curFileList:[],
      gridApi:null,
      percentage:0,
      materialDocTypeList:[],
      materialTypeByDocIdList:[]
    }
  },
  created() {
    this.caseList = this.defaultCaseList
    this.curFileList = Array.from(this.filelist)
    if(this.multipleTypeText!='文件上传' && !this.upType){
      this.queryMaterialDocType()
    }
    this.init();
    let tableHeader = this.switchTableHeader()
    this.columnDefs=[...this.defaultcolumnDefs,...tableHeader.map(item=>({
      headerName: item.title,
      field: item.value,
      resizable: true,
      sortable: false,
      filter: false,
    }))]
  },
  methods:{
    switchTableHeader(){
      if (this.upType== 'overseasBill') {
        return [
          {title:'境外账单号',value:'abroadBillNo'},
          {title:'境外代理所',value:'agencyCustName'},
          {title:'文件名称',value:'fileName'},
        ]
      }else if(this.upType== 'invoice'){
        return [
          {title:'账单号',value:'billNos'},
          {title:'国税票号',value:'stateTaxNo'},
          {title:'发票金额',value:'receiptTotal'},
          {title:'发票文件',value:'fileName'}
        ]
      }else{
        let tmValue = this.bussId == 6 ? 'approvalNo' : 'regNumber';
        return [
          {title:'案件文号',value:'agentNum'},
          {title:'案件类型',value:'caseType'},
          {title:'商标号',value:tmValue},
          {title:'官文类型',value:'gfTypeName'},
          {title:'将匹配的文件名称',value:'fileName'}
        ]
      }
    },
    init(flag){
      this.caseList.forEach((item, index) => {
        this.curFileList.forEach((itm,idx)=>{
          if(index==idx){
            item.fileName=itm.name
          }
        })
      })
      if(flag){
        this['gridApi'].refreshCells()
      }

    },
    queryMaterialDocType() {
      queryMaterialDocType().then(res => {
        this.materialDocTypeList = res.data;
      let doctId =  this.materialDocTypeList.find(
          item => item.typeName === this.uploadType
        ).doctId;
        this.submitData.doctId=doctId
        this.submitData.docTypeName=this.uploadType
        queryMaterialTypeByDocId({ doctId,caseIds: this.caseList.map(item=>item.caseId) }).then(res => {
          this.materialTypeByDocIdList = res.data;
          if(this.uploadType=='递交官方'){
            this.submitData.materialTypeId=this.materialTypeByDocIdList.find(item=>item.typeName==='整套交官材料扫描件').materialTypeId
            // this.submitData.materialTypeId=this.materialTypeByDocIdList.find(item=>)
          }
        });
      });
    },
    onGridReady(params) {
      this.gridparams = params
      this.gridApi = params.api;
      this.columnApi = params.columnApi;
    },
    uploadBatchFile(file){
      if (this.upType == "overseasBill") {
        this.submitData.materialTypeId = 359
        this.submitData.doctId = 13
        this.submitData.abroadBillIdList = this.getSelectedRows().map(item=>item.abroadBillId)
      } else if (this.upType == "invoice") {
        this.submitData.receiptIdList = this.getSelectedRows().map(item=>item.receiptId)
        this.submitData.materialTypeId = 1074
        this.submitData.doctId = 13
      } else {
        this.submitData.caseIds = this.getSelectedRows().map(item=>item.caseId)
      }
      if(!this.submitData.materialTypeId) {
        this.$message.error('请选择上传的文件类型')
        return
      }
      let formData = new FormData()
      for (let item of file){
        formData.append("attachFile", item);
      }
      formData.append("tokenID", this.$store.getters.token);

      for (let key in this.submitData){
        formData.append(key,  this.submitData[key]);
      }
      uploadBatchFile(formData,(e)=>{
        this.percentage = parseInt(e.loaded/e.total*100)
      }).then(res => {
        this.percentage = 0
        this.$message.success(res.message)
        if(this.getSelectedRows().length==this.caseList.length){
          this.$emit('cancel',true)
          return
        }
        this.caseList=this.caseList.filter(item=>!this.getSelectedRows().includes(item))
        // this.caseList.forEach(item=>{
        //   item.fileName=null
        // })
        
      }).catch(()=>{
        this.percentage = 0
      })
    },
    uploadCaseEventFile(file){
      if(!this.submitData.materialTypeId) {
        this.$message.error('请选择上传的文件类型')
        return
      }
      let formData = new FormData()
      for (let item of file){
        formData.append("attachFile", item);
      }
      formData.append("tokenID", this.$store.getters.token);
      // formData.append("caseIds",this.caseList.map(item=>item.caseId));
      formData.append('materialTypeId',this.submitData.materialTypeId)
      creatematerial(formData,(e)=>{
        this.percentage = parseInt(e.loaded/e.total*100)
      }).then(res => {
       let materialIdList = res.data.map(item=>item.materialId)
        Promise.all(this.getSelectedRows().map(item=>item.caseId).map(item=>addCaseEventUrl({caseId:item}))).then(res=>{
          Promise.all(res.map((item,index)=>updateCaseEventUrl(Object.assign(item.data,this.submitData,{materialIdList:materialIdList[index]})))).then(res=>{
            this.$message.success('上传成功')
            this.percentage = 0
            // this.$message.success(res.message)
            if(this.getSelectedRows().length==this.caseList.length){
              this.$emit('cancel',true)
              return
            }
            this.caseList=this.caseList.filter(item=>!this.getSelectedRows().includes(item))
            this.caseList.forEach(item=>{
              item.fileName=null
            })
          })
        })
      }).catch(()=>{
        this.percentage = 0
      })
    },
    uploadDocFile(file){
      let formData = new FormData()
      for (let item of file){
        formData.append("attachFile", item);
      }
      formData.append("tokenID", this.$store.getters.token);
      formData.append("insIdList",this.getSelectedRows().map(item=>item.tmFileId));
      formData.append("lastModify",  Array.from(file).map(item=>item.name+'_'+item.lastModified).join(','));
      uploadDocFile(formData,(e)=>{
        this.percentage = parseInt(e.loaded/e.total*100)
      }).then(res => {
        this.percentage = 0
        this.$message.success(res.message)
        if(this.getSelectedRows().length==this.caseList.length){
          this.$emit('cancel',true)
          return
        }
        this.caseList=this.caseList.filter(item=>!this.getSelectedRows().includes(item))
        this.caseList.forEach(item=>{
          item.fileName=null
        })
      }).catch(()=>{
        this.percentage = 0
      })
    },
    enentDrop(e){
      e.stopPropagation();
      e.preventDefault();
      this.hoverState=false
      this.curFileList = Array.from(e.dataTransfer.files)
      if(!this.getSelectedRows().length){
        this.$message.error('请选择需要匹配的案件')
        return;
      }
      if(this.curFileList.length!=this.getSelectedRows().length){
        this.$message.error('文件和案件数量需要相同')
        return
      }
      this.init(1)
    },
    getSelectedRows() {
      const selectedNodes = this.gridApi.getSelectedNodes();
      const selectedData = selectedNodes.map(node => node.data);
      return selectedData
    },
    cellRenderer(params){
      if(params.colDef.field == 'sid'){
        return params.rowIndex+1
      }
      return `<span title="${params.value}">${params.value?params.value:''}</span>`
    },
    confirm() {
      const nameList=this.getSelectedRows().map(item=>item.fileName)
      if(!nameList.length){
        this.$message.error('请选择上传的案件')
        return
      }
      const list= this.curFileList.filter(item => nameList.includes(item.name))
      if(this.multipleTypeText=='文件上传'){
        this.uploadDocFile(list)
      }else {
        this.uploadBatchFile(list)
      }
    }
  },
  watch:{
    // isInvoice:{
    //   handler(n){
    //     n&&(this.submitData.materialTypeId = 1074,this.submitData.doctId = 13)
    //   },
    //   immediate:true
    // },
    'submitData.materialTypeId'(n,o){
      if(n && this.materialTypeByDocIdList.length){
        this.submitData.typeName = this.materialTypeByDocIdList.find(
          item => item.materialTypeId === n
        ).typeName;
      }else {
        this.submitData.typeName=''
      }
      this.submitData.eventName = this.submitData.typeName
    }
  }
}
</script>

<style lang="scss" scoped>
  .button_wrap{
    display: flex;
    justify-content: flex-end;
  }
  .el-input{
    width: 200px;
  }
</style>
