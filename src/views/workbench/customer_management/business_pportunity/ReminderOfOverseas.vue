<template>
  <div>
    <el-form label-width="136px">
      <el-form-item label="客户">
        <el-select
          v-model="queryModuleData['custId']"
          ref="custSelect"
          filterable
          clearable
          remote
          reserve-keyword
          placeholder="请输入客户姓名"
          :remote-method="queryCustomerList">
          <el-option
            v-for="item in customerNameIdList"
            :key="item.custId"
            :label="item.name"
            :value="item.custId"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="申请人" >
        <el-select
          v-model="queryModuleData['applicantName']"
          ref="custSelect"
          filterable
          clearable
          remote
          reserve-keyword
          placeholder="请输入申请人姓名"
          :remote-method="queryAllUrl">
          <el-option
            v-for="item in queryAppLicantList"
            :key="item.appId"
            :label="item.applicantName"
            :value="item.applicantName"
          >
          </el-option>
        </el-select>
      </el-form-item>
<!--      <el-form-item label="有效起始日:" class="twoInputWarp">-->
<!--        <DataPicker v-model="validStartDate"></DataPicker>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="有效截止日:">-->
<!--        <DataPicker v-model="validEndDate"></DataPicker>-->
<!--      </el-form-item>-->
      <el-form-item label="送达工作组:">
        <el-select  default-first-option v-model="queryModuleData.wkgId" clearable filterable placeholder="请选择">
          <el-option
            v-for="item in queryWorkgroupNamesList"
            :key="item.wkgId"
            :label="item.groupName"
            :value="item.wkgId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="注册国家:">
        <el-select default-first-option :clearable='true' placeholder="请选择"
                   v-model="queryModuleData.appState" filterable>
          <el-option v-for="(item,key)  in countryList" :key="key"
                     :label="item.countryCn" :value="item.countryCn">
          </el-option>
        </el-select>
        <!--        <el-input clearable  placeholder="请输入" v-model="queryModuleData.appState"></el-input>-->
      </el-form-item>
      <el-button type="primary" class="clearButton" size="mini"  @click="clearSearch"><img src="@/assets/清除@2x.png" alt=""><span>重置</span></el-button>
      <div class="buttonWrap">
        <el-button type="primary" size="mini"  @click="handleSearch">搜索</el-button>
        <!--        <el-dropdown @command="xzSelect">-->
        <!--          <el-button type="primary" size="mini">-->
        <!--            商标是否续展<i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>-->
        <!--          </el-button>-->
        <!--          <el-dropdown-menu slot="dropdown">-->
        <!--            <el-dropdown-item command="1">是</el-dropdown-item>-->
        <!--            <el-dropdown-item command="0">否</el-dropdown-item>-->
        <!--          </el-dropdown-menu>-->
        <!--        </el-dropdown>-->
        <!--        <el-button type="primary" size="mini" @click="takeDialog(0)" >提醒设置</el-button>-->
        <!--        <el-button type="primary" size="mini" @click="takeDialog(1)">邮件发送记录</el-button>-->
      </div>
    </el-form>
    <div class="content_wrap">
      <div style="position: relative" class="left_wrap" :style="{width:visiable?'100%':'100%' }">
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
                   @rowDoubleClicked="doubleClick"
                   @rowClicked="rowClicked"
                   @sortChanged="refreshEvenRowsCurrencyData"
                   @filterChanged="refreshEvenRowsCurrencyData"
                   :localeText="$store.state.caseInformation.localeText"
                   :groupSelectsChildren="true"
                   :suppressAggFuncInHeader="true"
                   :masterDetail="true"
                   keepDetailRows
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
      <!--      <div class="right_wrap" :style="{position:'relative','margin-left':visiable?'10px' :'0','margin-right':visiable?'10px' :'0',height:clientHeight+'px'}">-->
      <!--        <div style="height: 30px;">-->
      <!--          <div style="cursor:pointer;float: right">-->
      <!--      <el-button type="text" style="padding-bottom: 0"  @click="exportList(1)"><i class="el-icon-download">导出</i></el-button>-->
      <!--          <img @click="exportList(2)" src="@/assets/moon.png" width="16" alt=""></div>-->
      <!--        </div>-->
      <!--        <right-table ref="rightTable" v-if="visiable" type="可续展" :childDataList="childDataList"></right-table>-->
      <!--      </div>-->
    </div>

    <el-dialog
      class="custDialog"
      append-to-body
      :close-on-click-modal="false"
      title="提示"
      :visible.sync="visiable"
      width="80%"
    >
      <div style="height: 70vh;">
        <!--        <div style="height: 30px;">-->
        <!--          <div style="cursor:pointer;float: right">-->
        <!--            <el-button type="text" style="padding-bottom: 0"  @click="exportList(1)"><i class="el-icon-download">导出</i></el-button>-->
        <!--            <img @click="exportList(2)" src="@/assets/moon.png" width="16" alt=""></div>-->
        <!--        </div>-->
        <right-table ref="rightTable" v-if="visiable" type="境外使用证据提醒" :childDataList="childDataList"></right-table>
      </div>
    </el-dialog>

    <el-dialog
      :close-on-click-modal="false"
      :title="remindRecordState?'邮件历史记录':'提醒设置'"
      :visible.sync="dialogVisible"
      width="80%"
      :top="remindRecordState?'7vh':'15vh'">
      <component v-if="dialogVisible" :is="remindRecordState?'remindRecord':'reminderSettings'" @changeFalse="dialogVisible=false"></component>
    </el-dialog>
    <SelectOption
      :buss-id="bussId"
      v-if="selectionOptionState"
      :dialog-visible="selectionOptionState"
      @cancel="closeDialogSelectOption"
      :idArray="RightGetSelectedRows().map(item=>item['tmId'])"
      :defaultMultipleSelect="exportTableList.map(i=>i.title)"
      :exportType="exportType"
      :exportQueryModel="JSON.stringify({custId: childDataList.map(item=>item['custId'])[0]})"></SelectOption>
  </div>
</template>

<script>
import vm from '@/main.js'
import RemindRecordDetail from './components/RemindRecordDetail'
import pagination from '@/components/Pagination'
import {
  queryCustomerNameId,
  sendBusiness,
  getBusinessUseRemindList,
  setBusiness,
  getBusinessUseRemindDetail
} from '@/api/caseList'
import {queryAllUrl} from '@/api/applicant'
import { createCode, createTask} from '@/api/caseList.js'
import { queryCountry, saveCaseInfoUrl } from '@/api/caseDetail'
import remindRecord from './components/remindRecord'
import reminderSettings from './components/reminderSettings.vue'
import {queryWorkgroupNames} from '@/api/systemList'
import RightTable from "./components/rightTable";
import SelectOption from '../../case/components/SelectOption'
export default {
  name: "ReminderOfOverseas",
  data(){
    return {
      countryList: [],
      exportType: '',
      bussId: 48,
      selectionOptionState:false,
      leftWrapWidth:localStorage.getItem('leftWrapWidth')?localStorage.getItem('leftWrapWidth'):'60%',
      visiable: false,
      childDataList: [],
      pageSizesList:[10, 50, 200,500,1000,5000,10000],
      listQuery: {
        pageNo: 0,
        pageSize: JSON.parse(localStorage.getItem('pageSize'))?JSON.parse(localStorage.getItem('pageSize')).find(item=>item.name==this.$route.name)?JSON.parse(localStorage.getItem('pageSize')).find(item=>item.name==this.$route.name).pageSize:10:10

      },
      total:0,
      dialogVisible:false,
      queryModuleData:{},
      businessList:[],
      customerNameIdList:[],
      queryAppLicantList:[],
      queryWorkgroupNamesList:[],
      validEndDate:[],
      validStartDate:[],
      remindRecordState:false,
      exportTableList: [
        {'title': '商标号', 'value': 'regNumber'},
        {'title': '商标名称', 'value': 'tmName'},
        {"title": "商标图样", "value": "imgFilePath"},
        {"title": "商标类别", "value": "tmGroup"},
        {"title": "客户", "value": "custName"},
        {"title": "申请人", "value": "applicantName"},
        {"title": "有效期起始日", "value": "validStartDate"},
        {"title": "有效期截至日", "value": "validEndDate"},
        {"title": "是否处于宽展期", "value": "isGrace"},
        {"title": "处理结果", "value": "disposeResult"},
        {"title": "发送记录", "value": "RemindRecordDetail"}
      ],
      tableTitleList: [
        {"title":"客户名称","value":"custName" },
        { 'title': '客户信用等级', 'value': 'custLevel' },
        {"title":"邮件主题","value":"mailSubject" },
        {"title":"送达客户组名称","value":"groupName" },
        // {"title":"送达客户组名称","value":"extensionTmNum" },
        {"title":"最近提醒日期","value":"remindDate" },
      ],
      tableTitleList2:[
        {'title':'客户名称','value':'custName'},
        {'title':'案件文号','value':'agentNum'},
        {"title":"案件名称","value":"caseName" },
        {"title":"绝限日期","value":"absLimitDate" },
        {"title":"商标注册号","value":"regNumber" },
        {"title":"注册国家","value":"appState" },
        {"title":"商标图片","value":"imageFile" },
        {"title":"商标类别","value":"goodClasses" },
        {"title":"申请日","value":"appDate" },
        {"title":"注册日","value":"regDate" },
        {"title":"提醒日","value":"remindDate" },
        {"title":"邮件主题","value":"mailSubject" },
        {"title":"申请人姓名","value":"applicantName" },
      ],
      selectData:[],
      gridOptions:{...this.$store.state.caseInformation.gridOptions,...{}},
      // detailCellRendererParams:{
      //   detailGridOptions: {
      //     rowSelection:'multiple',
      //     columnDefs: [
      //     ],
      //     rowHeight:67,
      //     defaultColDef: { flex: 1 },
      //     getContextMenuItems: this.getContextMenuItemsChild,
      //   },
      //   getDetailRowData: params => {
      //     params.successCallback(params.data.trademarkArray);
      //   },
      // },
      defaultcolumnDefs:[
        {
          headerName: '序号',
          field: 'sid',
          width: 60,
          'pinned': 'left', //固定再左边
          filter: false,
          cellClass: 'vAlign',
          // suppressMenu: true,
          checkboxSelection: false,
          headerCheckboxSelection: false,
          headerCheckboxSelectionFilteredOnly: true,
          cellRenderer:this.cellRenderer,

        },
      ],
      defaultcolumnDefs2:[
        {
          headerName: '序号',
          field: 'sid',
          width: 60,
          'pinned': 'left', //固定再左边
          filter: false,
          cellClass: 'vAlign',
          suppressMenu: true,
          headerCheckboxSelectionFilteredOnly: true,
          cellRenderer:this.cellRenderer,
          checkboxSelection:function(params) {
            return params.columnApi.getRowGroupColumns().length === 0;
          },
          headerCheckboxSelection:(params)=>{
            return params.columnApi.getRowGroupColumns().length === 0;
          }
        },
      ],
      columnDefs: [

      ],
      brushRightHasFilter:false
    }
  },
  computed: {
    clientHeight() {
      return document.documentElement.clientHeight - 410
    }
  },
  created(){
    this.getColumDefs()
    this.handleSearch()
    this.queryWorkgroupNames()
    this.getCountryList()
  },
  mounted(){
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
  methods:{
    getCountryList() {
      queryCountry()
        .then(response => {
          this.countryList = response.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    xzSelect(value) {
      if (!this.getSelectedRows().length) {
        this.$message.error('请先选择续展提醒！')
        return
      }
      setBusiness({
        del: value,
      }).then(res => {

      })
    },
    doubleClick(params){
      getBusinessUseRemindDetail({
        ...this.queryModuleData,
        custId: params.data.custId,
        mailType: params.data.mailType,
        remindDate: params.data.remindDate,
      }).then(res => {
        this.childDataList = res.data
        this.visiable = true
      })
    },
    closeDialogSelectOption(){
      this.selectionOptionState=false
      this.selectionState=false
    },
    getSelectedRows(){
      if (this.gridApi.getSelectedNodes) {
        const selectedNodes = this.gridApi.getSelectedNodes();
        const selectedData = selectedNodes.map(node => node.data);
        return selectedData
      }
      return  []
    },
    RightGetSelectedRows() {
      return this.$refs.rightTable.getSelectedRows()
    },
    exportList(flag){
      this.exportType=flag
      this.selectionOptionState=true
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
      // this.detailCellRendererParams.detailGridOptions.columnDefs=[...this.defaultcolumnDefs2,...this.tableTitleList2.map(item=>({
      //   headerName: item.title,
      //   field: item.value,
      //   // width:this.getLoactionWidth(item.title)=='auto'?200:this.getLoactionWidth(item.title),
      //   resizable: true,
      //   sortable: true,
      //   filter: 'agSetColumnFilter',
      //   cellRenderer:this.cellRenderer,
      //   menuTabs: ['filterMenuTab','generalMenuTab','columnsMenuTab'],
      //   enableRowGroup: true,
      //   filterParams: {
      //     newRowsAction: 'keep',
      //     comparator: (a, b)=>{
      //       return this.$commonUtils.sort(a,b,item.value)
      //     }
      //   }
      // }))]
    },
    rowClicked(params){
      // this.childDataList = params.data.trademarkArray
      // this.visiable = true
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
      // if(params.colDef.headerName=='客户名称'){

      // var eDiv = document.createElement('div');
      // eDiv.innerHTML = `<span class="btn-simple" title="${params.value}">${params.value?params.value:''}</span>`
      // var eButton = eDiv.querySelectorAll('.btn-simple')[0];
      //
      // eButton.addEventListener('click', ()=> {
      //   if(!this.pattern&&!this.selectionState){
      //     this.takeCaseDetail(params.data)
      //   }
      // });
      //
      // return `<i class="el-icon-caret-right ${params.node.expanded?'rotateClass':''}"></i>${params.value}`

      // }
      if(params.colDef.field=='imgFilePath'){
        return `<img style="width: 67px;height: auto" src="ipdoc/downloadimage${params.value}" alt="">`
      }

      if(params.colDef.field=='RemindRecordDetail'){
        // console.log(RemindRecordDetail);
        const h = vm.$createElement;
        let vnode=h(RemindRecordDetail,{
          props: {
            regNumber:params.data.regNumber,
          },
        })
        const div = document.createElement('div');
        vm.__patch__(div,vnode,true,false)
        // console.log(div);
        return div
        // return  `<div  style="display: flex;align-items: center;flex-wrap:wrap">
        //     <p style="color: green;font-size: 12px;display:${params.node.data.sendSucceedNum!=0?'block':'none'}">已发送 (${params.value})</p>
        //     <p style="color: red;font-size: 12px;display:${params.node.data.sendDefeatedNum!=0?'block':'none'}">发送失败 (${params.value})</p>
        //     <p style="color: rgb(106, 167, 255);font-size: 12px;display:${params.node.data.sendDefeatedNum==0&&params.node.data.sendSucceedNum==0?'block':'none'}" >未发送</p>
        //   </div>`
      }
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
      return [{ name:'复制',action: 'copy' }]
    },
    getRowContextmenuListChild(row){
      return [{ name:'复制',action: 'copy' },{ name:'立案',action: 'createCaseChild' },{ name:'发送',action: 'sendChild' },]
    },
    createCaseChild(row, value,params){
      let formList=params.api.getSelectedRows()
      const data={
        isBatch: '1',
        isDeliver:'0',
        custId:row.custId,
        custfullname: row.custFullname,
        userId: this.$store.getters.userId,
        level: row.custLevel,
      }
      data.batchInfos=[{
        caseTypeId:33,
        caseNumber:formList.length,
        caseTypeName:'续展'
      }]
      createCode().then(res=>{
        data.draftNumber=res.data
        createTask(data).then(res=>{
          let taskId=res.data[0].taskId
          const data2={
            regNumberList:formList.map(item=>item.regNumber),
            caseIds:res.data[0].cases.map(item=>item.caseId),
            caseType:res.data[0].cases[0].caseType,
            caseTypeIdList:res.data[0].cases[0].caseTypeId
          }
          saveCaseInfoUrl(data2).then(res=>{
            this.$router.push({path:'/workbench/case/massfiling',query:{taskId}})
          })
        })
      })
    },
    createCaseFather(row, value,params){
      let formList = row.trademarkArray
      const data={
        isBatch: '1',
        isDeliver:'0',
        custId:row.custId,
        custfullname: row.custFullname,
        userId: this.$store.getters.userId,
        level: row.custLevel,
      }
      data.batchInfos=[{
        caseTypeId:33,
        caseNumber:formList.length,
        caseTypeName:'续展'
      }]
      createCode().then(res=>{
        data.draftNumber=res.data
        createTask(data).then(res=>{
          let taskId=res.data[0].taskId
          const data2={
            regNumberList:formList.map(item=>item.regNumber),
            caseIds:res.data[0].cases.map(item=>item.caseId),
            caseType:res.data[0].cases[0].caseType,
            caseTypeIdList:res.data[0].cases[0].caseTypeId
          }
          saveCaseInfoUrl(data2).then(res=>{
            this.$router.push({path:'/workbench/case/massfiling',query:{taskId}})
          })
        })
      })
    },
    sendFather(row,value,params){
      let formList = row.trademarkArray
      sendBusiness({
        custId:row.custId,
        tmIdArray:formList.map(item=>item.tmId)
      }).then(res=>{
        this.handleSearch()
      })
    },
    sendChild(row, value,params){
      let formList=params.api.getSelectedRows()
      sendBusiness({
        custId:row.custId,
        tmIdArray:formList.map(item=>item.tmId)
      }).then(res=>{
        this.handleSearch()
      })
    },
    copy(row, value) {
      if(value){
        this.$copyText(value).then(
          res => {
          })
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
    },
    takeDialog(num){
      this.dialogVisible=true
      num ? this.remindRecordState=true: this.remindRecordState=false
    },
    handleSearch() {
      // this.validEndDate = []
      // this.validStartDate = []
      this.listQuery.pageNo = 1
      this.getBusinessList()
    },
    clearSearch(){
      this.queryModuleData={}
      //this.handleSearch()
    },
    getBusinessList(){
      getBusinessUseRemindList(this.$commonUtils.cleanNullAttr(Object.assign(this.queryModuleData,this.listQuery))).then(res=>{
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
        if (res.success) {
          this.queryWorkgroupNamesList = res.data
        }
      })
    },
    queryCustomerList(query){
      if(query !== ''){
        queryCustomerNameId({ pageNo: 1, pageSize: 100,keyword:query }).then(res=>{
          this.customerNameIdList=res.data
        })
      }
    },
    handleSelectionAll(val, father) {
      val = val.filter(item => item !== undefined)
      if(!this.selectData.find(item=>item.custId===father.custId)){
        this.selectData.push({ custId:father.custId ,list:val})
      } else {
        this.selectData.find(item=>item.custId===father.custId).list=val
      }
    },
    handleSelectionChange(val, row, father) {
      val = val.filter(item => item != undefined)
      if(!this.selectData.find(item=>item.custId===father.custId)){
        this.selectData.push({ custId:father.custId ,list:val})
      } else {
        this.selectData.find(item=>item.custId===father.custId).list=val
      }
    },
    sendBusiness(row,custId){
      let formList=[]
      if(custId){
        if(this.selectData.find(item=>item.custId===custId)){
          formList = this.selectData.find(item=>item.custId===custId).list
        } else {
          return
        }
        if(!formList.find(item=>item.tmId===row.tmId)){
          return
        }
      }else {
        formList=row.trademarkArray
      }
      sendBusiness({
        custId:row.custId,
        tmIdArray:formList.map(item=>item.tmId)
      }).then(res=>{
        this.handleSearch()
      })
    },
    createCase(row,custId){
      let formList=[]
      if(custId){
        if(this.selectData.find(item=>item.custId===custId)){
          formList = this.selectData.find(item=>item.custId===custId).list
        } else {
          return
        }
        if(!formList.find(item=>item.tmId===row.tmId)){
          return
        }
      }else {
        formList=row.trademarkArray
      }
      const data={
        isBatch: '1',
        isDeliver:'0',
        custId:row.custId,
        custfullname: row.custFullname,
        userId: this.$store.getters.userId,
        level: row.custLevel,
      }
      data.batchInfos=[{
        caseTypeId:33,
        caseNumber:formList.length,
        caseTypeName:'续展'
      }]
      createCode().then(res=>{
        data.draftNumber=res.data
        createTask(data).then(res=>{
          let taskId=res.data[0].taskId
          const data2={
            regNumberList:formList.map(item=>item.regNumber),
            caseIds:res.data[0].cases.map(item=>item.caseId),
            caseType:res.data[0].cases[0].caseType,
            caseTypeIdList:res.data[0].cases[0].caseTypeId
          }
          saveCaseInfoUrl(data2).then(res=>{
            this.$router.push({path:'/workbench/case/massfiling',query:{taskId}})
          })
        })
      })
    }
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
    RightTable,
    pagination,remindRecord, reminderSettings,
    SelectOption
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
  margin: 10px 0 0 0;
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
      .el-select{
        width: 100%;
      }
      .el-input__inner{
        height: 28px;
        line-height: 28px;
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
.custDialog {
  >>>.el-dialog__body {
    padding-top: 0!important;
  }
}
>>>.el-dialog__body {
  padding-top: 0!important;
}
/*/deep/.el-icon-caret-right{*/
/*  transition: transform 5s ease-in-out//,-webkit-transform .2s ease-in-out;*/
/*}*/
</style>
