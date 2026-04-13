<template>
  <div>
    <el-form label-width="136px">
<!--      <el-form-item label="客户">-->
<!--        <el-select-->
<!--          v-model="queryModuleData['custId']"-->
<!--          ref="custSelect"-->
<!--          filterable-->
<!--          clearable-->
<!--          remote-->
<!--          reserve-keyword-->
<!--          placeholder="请输入客户姓名"-->
<!--          :remote-method="queryCustomerList">-->
<!--          <el-option-->
<!--            v-for="item in customerNameIdList"-->
<!--            :key="item.custId"-->
<!--            :label="item.name"-->
<!--            :value="item.custId"-->
<!--          >-->
<!--          </el-option>-->
<!--        </el-select>-->
<!--      </el-form-item>-->
      <el-form-item label="监控对方:" class="twoInputWarp">
        <el-input v-model="queryModuleData.monitorReq"></el-input>
      </el-form-item>

      <el-form-item label="监控期号范围:" class="twoInputWarp">
        <InputList v-model="queryModuleData.qihaoArray" startPlaceholder='开始期号' endPlaceholder='结束期号'></InputList>
      </el-form-item>
      <el-form-item label="工作组:">
        <el-select size="mini" default-first-option v-model="queryModuleData.ymWkgIdArray" multiple clearable filterable placeholder="请选择">
          <el-option
            v-for="item in queryWorkgroupNamesList"
            :key="item.wkgId"
            :label="item.groupName"
            :value="item.wkgId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="最近期号为：">
        <el-radio-group v-model="queryModuleData.qihao" size="small" @change="qihaoChange">
          <el-radio-button :label="item" v-for="item in qihaoList"></el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-button type="primary" class="clearButton" size="mini"  @click="clearSearch"><img src="@/assets/清除@2x.png" alt=""><span>重置</span></el-button>
      <div class="buttonWrap">
        <el-button type="primary" size="mini"  @click="creat">新建</el-button>
        <el-button type="primary" size="mini"  @click="handleSearch">搜索</el-button>
        <el-button type="primary" size="mini" v-allow="269" @click="clickUpload=true">上传</el-button>
        <uploadFile :clickUpload="clickUpload" @getUploadFile="getUploadFile" @changeClick="clickUpload=false"></uploadFile>

      </div>
    </el-form>
    <div class="content_wrap">
      <div class="left_wrap" :style="{width:currentId?leftWrapWidth:'100%' }">
        <el-button class="brush_right" :class="brushRightHasFilter?'red':''" @click="brushRight" type="text" icon="el-icon-brush" ></el-button>
        <AgGridVue :style="{width:'100%',height:clientHeight+'px'}"
                   class="ag-theme-balham"
                   :columnDefs="columnDefs"
                   :rowData="businessList"
                   rowSelection="multiple"
                   @grid-ready="onGridReady"
                   :gridOptions="gridOptions"
                   :getContextMenuItems="getContextMenuItemsFather"
                   suppressAutoSize
                   animateRows
                   @rowClicked="rowClicked"
                   @rowDoubleClicked="rowDoubleClicked"
                   @sortChanged="refreshEvenRowsCurrencyData"
                   @filterChanged="refreshEvenRowsCurrencyData"
                   :localeText="$store.state.caseInformation.localeText"
                   :groupSelectsChildren="true"
                   :suppressAggFuncInHeader="true"
        >
        </AgGridVue>
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="listQuery.pageNo"
          :limit.sync="listQuery.pageSize"
          @pagination="getBusinessList"
          :pageSizes="pageSizesList"
        />
      </div>
      <div class="right_wrap" :style="{position:'relative','margin-left':currentId?'10px' :'0','margin-right':currentId?'10px' :'0',height:clientHeight+'px'}">
        <MonitoringDetail v-if="currentId" :qihao="queryModuleData.qihao" :id="currentId"></MonitoringDetail>
      </div>
    </div>
    <CommonDialog ref="CommonDialog" :view="title=='查看'" width="60%" v-model="visible" :title="title" :formData="formData" :FORM_ITEMS="FORM_ITEMS">
      <div v-if="title!='查看'" style="display: flex;justify-content: center">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确定</el-button>
      </div>
      <div v-else style="display: flex;justify-content: center">
        <el-button @click="visible = false">关闭</el-button>
      </div>
    </CommonDialog>
  </div>
</template>

<script>
  import uploadFile from '../../../workbench/material_management/components/uploadFile'
  import pagination from '@/components/Pagination'
  import MonitoringDetail from "./components/MonitoringDetail";
  import { queryCustomerNameId ,queryTmFirstCheck,queryTmEdition,tmFirstCheck,updateTmFirstCheckInfo,deleteTmFirstCheckInfo,addTmFirstCheckInfo } from '@/api/caseList'
  import {queryAllUrl} from '@/api/applicant'
  import {queryWorkgroupNames} from '@/api/systemList'
  export default {
    name: "MonitoringSubject",
    data(){
      return {

        pageSizesList:[10, 50, 200,500,1000,5000,10000],
        listQuery: {
          pageNo: 0,
          pageSize: JSON.parse(localStorage.getItem('pageSize'))?JSON.parse(localStorage.getItem('pageSize')).find(item=>item.name==this.$route.name)?JSON.parse(localStorage.getItem('pageSize')).find(item=>item.name==this.$route.name).pageSize:10:10

        },
        leftWrapWidth:localStorage.getItem('leftWrapWidth')?localStorage.getItem('leftWrapWidth'):'60%',
        total:0,
        dialogVisible:false,
        queryModuleData:{
          ymWkgIdArray:[],
          qihaoArray:[]
        },
        visible:false,
        currentId:'',
        businessList:[],
        customerNameIdList:[],
        queryAppLicantList:[],
        queryWorkgroupNamesList:[],
        validEndDate:[],
        validStartDate:[],
        remindRecordState:false,
        tableTitleList: [
          {"title":"部门","value":"deptName" }, { 'title': '客户', 'value': 'custName',width:'100' },{"title":"监控对方","value":"dsName" },
          {"title":"监控要求","value":"monitorReq" },{"title":"起始期号","value":"beginQh" },{title:'结束期号',value: 'endQh'},{title:'备注',value: 'memo'},{title:'工作组',value: 'groupName'}],
        selectData:[],
        gridOptions:{...this.$store.state.caseInformation.gridOptions,...{}},
        defaultcolumnDefs:[
          {
            headerName: '序号',
            field: 'sid',
            width: 60,
            'pinned': 'left', //固定再左边
            filter: false,
            cellClass: 'vAlign',
            suppressMenu: true,
            checkboxSelection: false,
            headerCheckboxSelection: false,
            headerCheckboxSelectionFilteredOnly: true,
            cellRenderer:this.cellRenderer,

          },
        ],
        columnDefs: [

        ],
        formData:{
        },
       title:'新建',
        FORM_ITEMS:[
          { prop: "deptName", label: "部门", el: "select",options:[{label:'国内',value:'国内'},{label:'国际',value:'国际'}] },
          { prop: "custOrAppId", required: true, trigger: 'change',label: "客户", render:(h, params)=>{return (
            <div>
              {params.view? <span >{this.$commonUtils.transformation(this.customerNameIdList,params.custOrAppId,'custId','fullname')}</span>:  <el-select

              v-model={params.custOrAppId}
              filterable
              clearable
              remote
              reserve-keyword
              placeholder="请输入客户姓名"
              remote-method={this.queryCustomerList}
              v-on:change={this.custChange}
                >
                {this.customerNameIdList.map(item=>(
                    <el-option
                  key={item.custId}
                  label={item.fullname}
                  value={item.custId}
                  >
                  </el-option>
            ))}
            </el-select>}


              </div>
              // <span>{this.$commonUtils.transformation(item.options,formLabelAlign[item.prop],'custId','fullname')}</span>
            )}},
          { prop: "dsName",required: true, label: "监控对方", el: "input", trigger: 'change' },
          { prop: "monitorReq", label: "监控要求", el: "input" },
          { prop: "beginQh", label: "起始期号", el: "input" },
          { prop: "endQh", label: "结束期号", el: "input" },
          { prop: "wkgId",required: true, label: "工作组", el: "select",options:[] ,props:{label:'groupName',value:'wkgId'},change:this.wkgIdChange, trigger: 'change'},
          { prop: "memo", label: "备注", el: "textarea" }
          ],
        qihaoList:[],
        brushRightHasFilter:false,
        clickUpload:false
      }
    },
    created(){
      this.getColumDefs()
      // this.handleSearch()
      this.queryWorkgroupNames()
      this.queryTmEdition()
    },
    mounted(){
      // let that=this
      // new this.$DraginResize(document.querySelector(".left_wrap"), {
      //   clone: true,
      //   end(info) {
      //     if (info.dir == 'ver') {
      //       this.elem.style.height = info.height + 'px';
      //     }
      //     else if (info.dir == 'hor') {
      //       this.elem.style.width = info.width + 'px';
      //       localStorage.setItem('leftWrapWidth', info.width + 'px')
      //       that.leftWrapWidth = info.width + 'px'
      //     }
      //   }
      // })
    },
    methods:{

      getUploadFile(e){

        let formData = new FormData()
        for(let i = 0; i < e.target.files.length; i++){
          formData.append("file", e.target.files[i]);
        }
        formData.append("tokenID", this.$store.getters.token);

        tmFirstCheck(formData).then(res=>{
          this.message.success('文件上传成功!')
          this.queryTmEdition()
        })
      },
      queryTmEdition(){
        queryTmEdition({type: 3}).then((res)=>{
          this.qihaoList = res.data
          if(res.data.length){
            this.queryModuleData.qihao=this.qihaoList[0]
          }
          this.handleSearch()
        })
      },
      getColumDefs(){
        this.columnDefs = [...this.defaultcolumnDefs, ...this.tableTitleList.map(item=>({
          headerName: item.title,
          field: item.value,
          width:item.width,
          resizable: true,
          sortable: true,
          filter: 'agSetColumnFilter',
          cellRenderer:this.cellRenderer,
          menuTabs: ['filterMenuTab','generalMenuTab','columnsMenuTab'],
          enableRowGroup: true,
          filterParams: {
            newRowsAction: 'keep',
            comparator: (a, b)=>{
              return this.$commonUtils.sort(a,b,item.value)
            }
          }
        }))]
      },

      brushRight(){
        // let data =   this.$commonUtils.getFilterModel(this.$options.name+this.$route.name,'FilterModel')
        let arr = this.columnDefs.map(item=>item.field)// Object.keys(data)
        arr.forEach(item=>{
          this.gridApi.destroyFilter(item)
        })
      },
      onGridReady(params) {
        this.gridparams=params
        this.gridApi = params.api;
        this.columnApi = params.columnApi;
        params.api.sizeColumnsToFit();
      },
      cellRenderer(params){
        if(params.colDef.field == 'sid'){
          return params.rowIndex+1
        }
        return `<span title="${params.value}">${params.value?params.value:''}</span>`
      },
      getContextMenuItemsFather(params){
        if(!params.node||!params.node.data){
          return []
        }
        return this.getRowContextmenuListFather(params.node.data).map(item=>({
          name: item.name,
          action: () =>{
            this[item.action](params.node.data,params.value,params)
          },
        }))
      },
      getContextMenuItemsChild(params){
        if(!params.node||!params.node.data){
          return []
        }
        return this.getRowContextmenuListChild(params.node.data).map(item=>({
          name: item.name,
          action: () =>{
            this[item.action](params.node.data,params.value,params)
          },
        }))
      },
      getRowContextmenuListFather(row){
        return [{ name:'复制',action: 'copy' },
          { name:'修改',action: 'modify' },
          { name:'删除',action: 'deleteTmFirstCheckInfo' }, ]
      },
      copy(row, value) {
        if(value){
          this.$copyText(value).then(
            res => {
            })
        }
      },

      creat(){

        this.title='新建'
        this.formData={}
        this.formData.view=false
        this.visible=true
      },
      modify(row){
        this.title='修改'
        this.formData=row
        this.formData.view=false
        this.customerNameIdList=[{fullname:row.custName,custId:row.custOrAppId}]
        this.visible=true
      },
      rowClicked(param){
        if(param.node.selected&&this.currentId!=param.data['dsId']){
          this.currentId=''
          this.$nextTick(()=>{
            this.currentId=param.data['dsId']
          })
        }
        let that=this
        new this.$DraginResize(document.querySelector(".left_wrap"), {
          clone: true,
          end(info) {
            if (info.dir == 'ver') {
              this.elem.style.height = info.height + 'px';
            }
            else if (info.dir == 'hor') {
              this.elem.style.width = info.width + 'px';
              localStorage.setItem('leftWrapWidth', info.width + 'px')
              that.leftWrapWidth = info.width + 'px'
            }
          }
        })
      },
      rowDoubleClicked(params){
        var row=params.data
        this.title='查看'

        this.customerNameIdList=[{fullname:row.custName,custId:row.custOrAppId}]
        this.formData=row
        this.formData.view=true
        this.visible=true
      },
     async confirm(){
       const [ err, success] = await this.$commonUtils.awaitWrap(this.$refs.CommonDialog.checkValidate())
       if(!success){
         return
       }
        if( this.title=='新建'){

          addTmFirstCheckInfo(this.formData).then(res=>{
            this.visible=false
            this.handleSearch()
          })

        }
        if(this.title=='修改'){
          updateTmFirstCheckInfo(this.formData).then(res=>{
            this.visible=false
            this.handleSearch()
          })

        }
      },
      deleteTmFirstCheckInfo(row){
        this.$confirm('确定要删除该监控吗, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteTmFirstCheckInfo(row).then(res=>{
            this.handleSearch()
          })
        })
      },
      custChange(e){
        this.$set(this.formData,'custOrAppId',e)
        if(e){
         var name= this.customerNameIdList.find(item=>item.custId===e).fullname
          this.$set(this.formData,'custName',name)
        }
      },
      wkgIdChange(e){
        this.$set(this.formData,'wkgId',e)
        if(e){

          var name= this.queryWorkgroupNamesList.find(item=>item.wkgId===e).groupName
          this.$set(this.formData,'groupName',name)
        }
      },
      refreshEvenRowsCurrencyData(params) {
        this.currentPageSize = params.api.rowModel.rootNode.allChildrenCount
        if(!params.columnApi.columnController.groupAutoColumns) {
          this.gridApi.forEachNode(rowNode => {
            rowNode.setDataValue(
              'sid',
              rowNode.rowIndex + 1)
          });
        }
        if(params.type=="filterChanged"){
          // this.$commonUtils.saveFilterModel(this.$options.name+this.$route.name,'FilterModel',this.gridApi.getFilterModel())
          // var data = this.$commonUtils.getFilterModel(this.$options.name + this.$route.name, 'FilterModel');
          var arr = Object.keys(this.gridApi.getFilterModel());
          if(arr.length){
            this.brushRightHasFilter=true
          }else {
            this.brushRightHasFilter=false
          }
        }
      },
      handleSearch() {
        this.listQuery.pageNo = 1

        this.getBusinessList()
      },
      qihaoChange(item){
        var str=this.currentId
        this.currentId=''
        this.$nextTick(()=>{
         this.currentId=str
        })
        this.handleSearch()
      },
      clearSearch(){
        this.queryModuleData={
          ymWkgIdArray:[],
            qihaoArray:[]
        }
      },
      getBusinessList(){
        queryTmFirstCheck(Object.assign(this.queryModuleData,this.listQuery)).then(res=>{
          this.businessList=res.data
          this.total=res.total
        })
      },
      queryAllUrl(query){
        if(query !== ''){
          queryAllUrl({ pageNo: 1, pageSize: 100,applicantName:query ,orderBy:1}).then(res=>{
            this.queryAppLicantList=res.data
          })
        }
      },
      queryWorkgroupNames(){
        queryWorkgroupNames().then(res => {
          this.queryWorkgroupNamesList = res.data
          this.FORM_ITEMS.find(item=>item.prop=='wkgId').options=this.queryWorkgroupNamesList
        })
      },
      queryCustomerList(query){
        // console.log(query);
        if(query !== ''){
          queryCustomerNameId({ pageNo: 1, pageSize: 100,keyword:query }).then(res=>{
            this.customerNameIdList=res.data
          })
        }
      },
    },
    computed:{
      clientHeight(){
        return document.documentElement.clientHeight-400
      },
    },
    watch:{
      validEndDate(n,o){
        this.queryModuleData.validEndDateStart=n[0]
        this.queryModuleData.validEndDateEnd=n[1]
      },
      validStartDate(n,o){
        this.queryModuleData.validStartDateStart=n[0]
        this.queryModuleData.validStartDateEnd=n[1]
      }
    },
    components:{
      pagination,MonitoringDetail,uploadFile
    }
  }
</script>

<style lang="scss" scoped>
  .el-table{
    /deep/ tr{
      th.el-table-column--selection{
        border-right: 0;
        overflow: visible;
        .cell{
          position: relative;
          right: -14px;
          z-index: 1;
          text-overflow: clip;
        }
      }
      td.el-table-column--selection{
        border-right: 0;
        overflow: visible;
        .cell{
          position: relative;
          right: -14px;
          z-index: 1;
          text-overflow: clip;
        }
      }
    }
  }
  .el-form{
    position: relative;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    padding: 20px 120px 20px  0;
    /*padding-right: 120px;*/
    margin: 10px 0 40px 0;
    box-shadow:0px 2px 5px 0px rgba(163, 163, 163, 0.35);
    .el-form-item{
      width: 33%;
      height: 28px;
      /deep/ .el-form-item__label{
        line-height: 28px;
      }
      /deep/  .el-form-item__content{
        display: flex;
        align-items: center;
        height: 100%;
        .el-cascader{
          width: 100%;
        }
        .el-select /deep/{
          .el-select__tags{
            max-height: 40px;
            overflow-y: auto;
          }
        }
        .el-select{
          width: 100%;
          /*height: 28px;*/
        }
        .el-input__inner{
          /*height: 28px;*/
          /*line-height: 28px;*/
        }
      }
    }
  }
  .button_wrap {
    width: 100%;
    display: flex;
    height: 85px;
    align-items: center;
    justify-content: flex-end;
    .el-button{
      margin-right: 30px;
    }
  }
  .el-table{
    /deep/ th{
      padding:5px 0;
      color: rgba(51, 51, 51, 1);
      background: rgba(187, 187, 187, 0.5);
    }
    /deep/ td {
      padding: 0 ;
    }
  }
  .clearButton{
    position: absolute;
    right: 18px;
    top:20px;
    background: #fff;
    color: RGBA(254, 153, 23, 1);
    border: 0;
    /deep/ span{
      display: flex;
      justify-content: center;
      align-items: center;
    }
    img{
      width: 20px;
      margin-right: 8px;
      vertical-align: middle;
    }
  }
  .buttonWrap{
    width: 100%;
    text-align: center;
  }
  /deep/ .el-table__expand-column{
    border-right: 0;
    .cell{
      overflow: visible;
      padding-left: 10px;
      position: relative;
      z-index: 1;
    }
    &+td{
      .cell{
        padding: 0 20px;
      }
    }
  }
  /deep/ .expanded+tr{
    opacity: 0;
    animation: myfirst .5s linear forwards;
  }
  @keyframes myfirst{
    from{opacity:0}
    to{opacity:1}
  }
  .brush_right{
    position: absolute;
    right: 6px;
    top: -4px;
    z-index: 4;
  }
  .ag-theme-balham /deep/ .ag-details-row{
    padding: 0;
  }
  /deep/ .rotateClass{
    transform: rotate(90deg);
    transition: transform 5s ease-in-out
  }
  .content_wrap{
    width: 100%;
    display: flex;
    .left_wrap{
      position: relative;
      transition:all 0.5s;
      //   width: 40%;
    }
    .right_wrap{
      box-shadow: 0px 0px 18px 0px rgba(64, 158, 255,0.5);
      height: 598px;
      overflow: auto;
      transition:all 0.5s;
      flex: 1;
      /deep/ *{
        font-size: 12px !important;
      }
      // width: 60%;
      /deep/.sectionWrap{
        padding: 0 !important;
        padding-left: 10px !important;
        // padding-bottom: 350px!important;
        .ElectronWrap{
          padding: 0!important;
        }
      }
    }
  }
</style>
