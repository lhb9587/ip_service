<template>
  <div>
    <section class="app-main">
      <div style="display: flex;position: relative">
<!--        <TitleTotal :total="total" />-->
        <div style="cursor:pointer;position: absolute;display:flex;align-items:center;right: 0;bottom:-6px;font-size: 14px;padding-right: 6px">
          <el-button type="text" @click="exportList(2)" >导出</el-button>
          <span style="color: #52A2F4;margin: 0 5px"> / </span>
          <el-button type="text" @click="exportList(1)">全局导出</el-button>
<!--          <el-button type="text"  @click="exportList(1)"><i class="el-icon-download">导出</i></el-button>-->
<!--          <img @click="exportList(2)" src="@/assets/moon.png"  width="16" alt="">-->
        </div>
      </div>
      <div class="w-table">
        <div  class="dots" @click="handleCheckboxState">
          <span class="dot">.</span>
          <span class="dot">.</span>
          <span class="dot">.</span>
        </div>
        <el-button class="brush_right" :class="brushRightHasFilter?'red':''" @click="brushRight" type="text" icon="el-icon-brush" ></el-button>
        <AgGridVue :style="{width:'100%',height: clientHeight+'px'}"
                   class="ag-theme-balham"
                   :columnDefs="columnDefs"
                   :rowData="invocieList"
                   rowSelection="multiple"
                   @grid-ready="onGridReady"
                   :gridOptions="gridOptions"
                   @dragStopped="dragStopped"
                   :getContextMenuItems="getContextMenuItems"
                   suppressAutoSize

                   animateRows
                   @rowClicked="rowClick"
                   @rowDoubleClicked="rowDoubleClicked"
                   @sortChanged="refreshEvenRowsCurrencyData"
                   @filterChanged="refreshEvenRowsCurrencyData"
                   :localeText="$store.state.caseInformation.localeText"
                   :suppressDragLeaveHidesColumns="true"
                   :suppressMakeColumnVisibleAfterUnGroup="true"
                   rowGroupPanelShow="always"
                   :groupSelectsChildren="true"
                   :suppressAggFuncInHeader="true"
                   :autoGroupColumnDef="autoGroupColumnDef"
                   :frameworkComponents="frameworkComponents"
                   @drop.native.stop.prevent="enentDrop($event)"
                   @dragover.native.stop.prevent="hoverState=true"
                   @dragleave.native.stop.prevent="hoverState=false"
                   @dragenter.native.stop.prevent="hoverState=true"
                   :rowHeight="$commonUtils.getRowHeight()"
                   :pinnedBottomRowData="pinnedBottomRowData"
        >
        </AgGridVue>

        <div class="checkbox" v-if="checkboxState">
          <el-select v-model="checkCaseList" multiple   reserve-keyword filterable  placeholder="请选择"  collapse-tags @visible-change="handleChange"  :filter-method="filterCheck">
            <template slot="">
              <div class="checkbox_bottom" >
                <el-button size="mini" round @click.stop="delPreference(1)">恢复默认</el-button>
                <el-button style="margin-right: 3px" size="mini" round @click.stop="savePreference(1)">保存设置</el-button>
              </div>
            </template>
            <el-option
              v-for="item in selectColumnList.filter(item =>item.COLUMN_COMMENT.includes(filterText))"
              :key="item.COLUMN_NAME"
              :label="item.COLUMN_COMMENT"
              :value="item.COLUMN_NAME">
            </el-option>
          </el-select>
        </div>
      </div>
      <pagination
        :total="total"
        :page.sync="listQuery.pageNo"
        :limit.sync="listQuery.pageSize"
        @pagination="queryReceiptList"
        :pageSizes="pageSizesList"
      />
    </section>
    <SelectOption :buss-id="bussId" v-if="selectionOptionState" :dialog-visible="selectionOptionState" @cancel="closeSelect" :idArray="getCurrentRowsData('receiptId')" :defaultMultipleSelect="preferenceList.map(i=>i.title)" :exportType="exportType" :exportQueryModel="exportQueryModel"></SelectOption>
    <createInvoice v-if="createInvoiceState" :createInvoiceState="createInvoiceState" @close="closeCreateInvoice" :pageState="pageState" :receiptId="receiptId" :isAudit="isAudit"></createInvoice>
    <!--    文件上传-->
    <el-dialog
      v-dialogDrag
      center
      top="0"
      height="852"
      :visible.sync="uploadProofreadingState"
      width="50%"
      :close-on-click-modal="false"
      :show-close="false"
      :close-on-press-escape="false"
    >
      <UploadProofreading v-if="uploadProofreadingState" upType="invoice" :isInvoice="true"  @cancel="()=>{this.uploadProofreadingState = false}" :defaultCaseList="getSelectedSortRows()" :filelist="curFile"></UploadProofreading>
    </el-dialog>

<!--  修改开具日期  -->
    <el-dialog
      v-if="plEditView"
      class="no-top"
      title="修改开具日期"
      :visible.sync="plEditView"
      width="30%"
    >
      <div class="topBox">
        <span class="iconfont icon-warning-circle-fill" style="color: #E6A23C;font-size: 20px;"></span>
        <span>确认要修改所选 [发票] 吗？</span>
      </div>
      <el-form class="form-container" size="small" label-position="right" label-width="120px" :model="plForm">
        <el-row style="width: 100%" class="first-row">
          <el-form-item label="开具日期" class="postInfo-container-item">
            <template>
              <el-date-picker v-model="plForm.optDate" format='yyyy-MM-dd' value-format="yyyy-MM-dd"
                              align="right" type="date" placeholder="选择日期">
              </el-date-picker>
            </template>

          </el-form-item>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
      <el-button
        @click="()=>{this.plEditView = false, this.plForm.optDate = ''}">取 消</el-button>
      <el-button type="primary" @click="plEditSubmit">确 定</el-button>
    </span>
    </el-dialog>

    <!--  统计组税额  -->
    <el-dialog
      v-if="taxAmountView"
      class="no-top"
      title="统计组税额"
      :visible.sync="taxAmountView"
      width="50%"
    >
      <el-form class="form-container" size="small" label-position="right" label-width="120px" :model="taxAmountForm">
        <el-row style="width: 100%" class="first-row">
          <el-col :span="24">
            <el-form-item label="所属公司:" class="postInfo-container-item">
              <el-select v-model="taxAmountForm.companyId" placeholder="请选择" filterable
                         clearable>
                <el-option
                  v-for="item in receiptCompanyList"
                  :key="item.repCompId"
                  :label="item.fullname"
                  :value="item.repCompId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="开票日期起:" class="postInfo-container-item">
              <template>
                <el-date-picker v-model="taxAmountForm.optDateStart" format='yyyy-MM-dd' value-format="yyyy-MM-dd"
                                align="right" type="date" placeholder="选择日期">
                </el-date-picker>
              </template>

            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开票日期止:" class="postInfo-container-item">
              <template>
                <el-date-picker v-model="taxAmountForm.optDateEnd" format='yyyy-MM-dd' value-format="yyyy-MM-dd"
                                align="right" type="date" placeholder="选择日期">
                </el-date-picker>
              </template>

            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          @click="()=>{this.taxAmountView = false, this.taxAmountForm.companyId = '', this.taxAmountForm.optDateStart = '', this.taxAmountForm.optDateEnd = ''}">取 消</el-button>
        <el-button type="primary" @click="taxAmountSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {formatAmount} from '@/utils/filters'
import UploadProofreading from '@/views/workbench/case/components/UploadProofreading'
import SelectOption from '@/views/workbench/case/components/SelectOption'
import createInvoice from "./createInvoice";
import MyTabs from '@/views/workbench/case/components/MyTabs'
import Pagination from '@/components/Pagination'; // secondary package based on el-pagination
import {updateReceiptBatch,queryReceiptList,queryCustomerNameId, queryReceiptCompany, receiptToTask, queryBankaccountListBycustId ,getTimelimitTypeAll, getWriteoffState,delTimelimit,selectColumn,queryPreference,savePreference,delPreference,getCaseTimelimitList,deleteReceipt,receiptCreateReceipt} from '@/api/caseList.js'
import { queryWorkgroupNames} from '@/api/systemList'
import { getUser } from '@/api/user'
import Summary from "@/components/Summary/index.js";
import {formatDate} from '@/utils'
import {checkPermission} from '@/api/caseList.js'
import {createReceiptTemplate} from "../../../../../../api/caseList";
export default {
  name: 'invocieOpenerList',
  props:{
    caseDetail: {
      default:false
    },
    caseDetailCaseId:{

    },
    agentNum:{

    }
  },
  data() {
    var tableHeader=[]
    if(localStorage.getItem('tableHeader')&&JSON.parse(localStorage.getItem('tableHeader')).find(item=>item.name==this.$options.name)){
      tableHeader = JSON.parse(localStorage.getItem('tableHeader')).find(item => item.name == this.$options.name).tableHeader
    }
    return {
      receiptCompanyList: [],
      taxAmountForm: {
        companyId: '',
        optDateStart: '',
        optDateEnd: ''
      },
      taxAmountView: false,
      plEditView: false,
      plForm: {
        optDate: ''
      },
      uploadProofreadingState: false,
      hoverState:false,
      curFile:[],
      invocieList:[],
      myTabsActivity: false,
      pageTitle: this.$route.meta.title,
      identification: 'invocieList',
      brushRightHasFilter:false,
      autoGroupColumnDef:{
        headerName: '组',
        field: 'group',
        headerCheckboxSelection: true,
        cellRenderer: 'agGroupCellRenderer',
        cellRendererParams: { checkbox: true },
      },
      frameworkComponents:{
        CountStatusBarComponent:Summary
      },
      defaultcolumnDefs:[
        {
          headerName: '序号',
          field: 'sid',
          width: 80,
          enableRowGroup: true,
          // enablePivot: true,
          cellRenderer:this.cellRenderer,
          floatingFilter:true,
          filter: false,
          cellClass: 'vAlign',
          suppressMenu: true,
          checkboxSelection: false,
          headerCheckboxSelection: false,
          headerCheckboxSelectionFilteredOnly: true
        },
      ],
      columnDefs: [

      ],
      gridApi:{},
      gridOptions:{
        ...this.$store.state.caseInformation.gridOptions,
        statusBar: {
          statusPanels: [
            { statusPanel: 'agSelectedRowCountComponent', align: 'left' },
            { statusPanel: 'CountStatusBarComponent' }
          ]
        },
        //floatingFilter: true,
      },
      createInvoiceState:false,
      pageSizesList: [10, 50, 200, 500, 1000, 5000, 10000],
      // selectionState:false,
      listLoading:false,
      activeNames:[],
      listQuery: {
        pageNo: 0,
        pageSize:  JSON.parse(localStorage.getItem('pageSize'))?JSON.parse(localStorage.getItem('pageSize')).find(item=>item.name==this.$route.name)?JSON.parse(localStorage.getItem('pageSize')).find(item=>item.name==this.$route.name).pageSize:10:10
      },
      pageState:'create',
      isAudit: false,
      currentMonth: '',
      currentYear: '',
      queryModuleData: {},
      receiptId:'',
      total:0,
      tableTitleList:[
        {'label':'案件文号','prop':'showRefno'},{'label':'账单号','prop':'billNos'},{"label":"客户","prop":"custFullName" },
        {"label":"申请日期","prop":"appDate" },{"label":"申请开票人","prop":"appUserId" },{"label":"发票领取人","prop":"receiverUserId" },{"label":"开票日期","prop":"optDate" },{"label":"发票抬头","prop":"custBankId" },{"label":"税号","prop":"taxNo" }],
      multipleSelection:[],
      customerNameIdList:[],
      queryWorkgroupNamesList:[],
      queryGetUserList:[],
      timelimitState: [],
      writeoffStateList: [],
      getTimelimitTypeAllList: [],
      dialogVisible: false,
      operationState:1,
      examineState:false,
      checkboxState:false,
      userId: this.$store.getters.userId,
      bussId: 15,
      preferenceList: [],
      selectColumnList: [],
      checkCaseList: [],
      tableHeader: tableHeader,
      tableHeaderLabelList:[],
      dragState: {
        start: -1, // 起始元素的 index
        end: -1, // 结束元素的 index
        move: -1, // 移动鼠标时所覆盖的元素 index
        dragging: false, // 是否正在拖动
        direction: undefined // 拖动方向
      },
      drawerState: false,
      clearWrapTop: 0,
      onlyOneSign:'receiptId',
      filterText:'',
      filterDataSum:{},
      receiverUserList:[],
      queryReceiptCompanyList:[],
      exportType:2,
      selectionOptionState: false,
      exportQueryModel:''
    }
  },

  created() {
    this.getAllWfs()
    // this.queryReceiptList()
    this.defaultQuerySearch()
    this.queryReceiptCompany()
  },
  mounted(){
    if(document.getElementById('searchWrap')){
      document.getElementById('searchWrap').onscroll = function(e) {
        this.clearWrapTop = e.target.scrollTop + e.target.offsetHeight
        document.getElementById('clearWrap').style.top = this.clearWrapTop - 40 + 'px'
      }
    }


    // new CopyTable.getInstance(this.$refs.todoTaskMultiple.$el)

    if (!this.caseDetail) {
      setTimeout(()=>{
        if(this.queryModuleData.custIdList&&this.queryModuleData.custIdList.length>0){
          queryCustomerNameId({ custIdArray:this.queryModuleData.custIdList }).then(res=>{
            this.customerNameIdList=res.data
          })
        }
        this.queryWorkgroupNames()
        this.getTimelimitTypeAll()
        this.getWriteoffState()
        this.getUser()
      },300)
    }
  },
  methods: {
    taxAmountSubmit() {
      createReceiptTemplate(this.taxAmountForm).then(res => {
        this.$message.success('统计成功!')
        this.taxAmountView = false
        this.taxAmountForm.companyId = ''
        this.taxAmountForm.optDateStart = ''
        this.taxAmountForm.optDateEnd = ''
        if (res.data && res.data.address) {
          const downData = {
            url: `ipdoc${res.data.address}`,
            success() {
              // notify.close()
            }
          }
          this.$commonUtils.downLoadAll(downData)
        }
      })
    },
    queryReceiptCompanyFunc(){
      this.taxAmountView = true
      queryReceiptCompany().then(res=>{
        this.receiptCompanyList = res.data
      })
    },
    editDate(){
      this.plEditView = true
    },
    plEditSubmit() {
      const receiptIdList = this.getSelectedRows().map(item => item.receiptId)
      updateReceiptBatch({
        receiptIdList: receiptIdList,
        optDate: this.plForm.optDate
      }).then(res => {
        this.invocieList.forEach(item => {
          if (receiptIdList.includes(item.receiptId)) {
            this.$set(item, 'optDate', this.plForm.optDate)
          }
        })
        this.gridApi.refreshCells()
        this.$message.success('修改成功!')
        this.plEditView = false
        this.plForm.optDate = ''
      })
    },
    getCurrentRowsData(key){
      if (this.gridApi && this.gridApi.rowModel) {
        return this.gridApi.rowModel.rootNode.childrenAfterSort.map(item => item.data).map(item => item[key])
      }
      return []
    },
    enentDrop(e){
      e.stopPropagation();
      e.preventDefault();
      this.hoverState=false
      this.curFile = e.dataTransfer.files
    },
    defaultQuerySearch(){
      this.queryModuleData = JSON.parse(localStorage.getItem('queryModuleData'))?JSON.parse(localStorage.getItem('queryModuleData')).find(item=>item.name==this.$options.name+this.$route.name)?JSON.parse(localStorage.getItem('queryModuleData')).find(item=>item.name==this.$options.name+this.$route.name).queryModuleData:{}:{}
      if(this.queryModuleData.belongtoDateBeginOut){
        this.currentYear = this.queryModuleData.belongtoDateBeginOut.slice(0,4)
        this.currentMonth = this.queryModuleData.belongtoDateBeginOut.slice(5)
      }
    },
    handleSelect(key, requireList, multipleTypeTextDisabled){

      if (!this.getSelectedSortRows().length) {
        this.$message.error('请选择需要匹配的发票')
        return;
      }
      if(!this.curFile.length){
        this.$message.error('请上传发票')
        return
      }
      if (this.curFile.length != this.getSelectedSortRows().length) {
        this.$message.error('文件与发票数量不同')
        return
      }
      this.uploadProofreadingState = true
      return;
    },
    getSelectedSortRows() {
      if (this.gridApi) {
        const selectedNodes = this.gridApi.getSelectedNodes();
        // const selectedData = selectedNodes.map(node => node.data);
        return this.gridApi.rowModel.rootNode.childrenAfterSort.filter(item=>selectedNodes.includes(item)).map(node=>node.data)
      } else {
        return []
      }
    },
    brushRight(){
      let data = this.$commonUtils.getFilterModel(this.$options.name+this.$route.name,'FilterModel')
      let arr =  Object.keys(data)
      arr.forEach(item=>{
        this.gridApi.destroyFilter(item)
      })
    },
    getFilterModel(){
      this.$nextTick(()=>{
        let data =   this.$commonUtils.getFilterModel(this.$options.name+this.$route.name,'FilterModel')
        let arr =  Object.keys(data)
        let arrInstance=arr.map(item=>this.gridApi.getFilterInstance(item))
        arrInstance.forEach((item,index)=>{
          item.selectNothing()
          item.setModel(data[arr[index]])
          item.applyModel()
        })
        this.gridApi.onFilterChanged()
        let sortData =   this.$commonUtils.getFilterModel(this.$options.name+this.$route.name,'SortModel')
        if(sortData&&sortData.length){
          this.gridApi.setSortModel(sortData)
          this.gridApi.onSortChanged()
        }
      })
    },
    changeStatus(){
      // this.$set(this.queryModuleData, 'wfStatusOut', null)
      this.$set(this.queryModuleData, 'repCompIdOut', null)
      this.$set(this.queryModuleData, 'execDateOut', null)
      this.$set(this.queryModuleData, 'belongtoDateBeginOut', null)
    },
    changeBelongDate({repCompId}) {
      this.$set(this.queryModuleData, 'execDateOut', null)
      this.$set(this.queryModuleData, 'wfStatusOut', null)
      this.$set(this.queryModuleData, 'repCompIdOut', repCompId)
      this.$set(this.queryModuleData, 'belongtoDateBeginOut', this.currentYear + '-' + this.currentMonth)
      this.handleSearch(1, false)
    },
    changeCompany({repCompId, shortname}) {
      if (this.queryModuleData.repCompIdOut == repCompId) return
      this.currentMonth = this.$wUtil.getDate('', 'month').slice(5)
      this.currentYear = this.$wUtil.getDate('', 'year')
      this.$set(this.queryModuleData, 'execDateOut', null)
      this.$set(this.queryModuleData, 'wfStatusOut', null)
      this.$set(this.queryModuleData, 'repCompIdOut', repCompId)
      this.$set(this.queryModuleData, 'belongtoDateBeginOut', this.currentYear + '-' + this.currentMonth)
      this.handleSearch(1, false)
    },
    closeCreateInvoice(e){
      this.createInvoiceState=false
      this.isAudit = false
      if(e){
        this.queryReceiptList()
      }
    },
    copyInvocie(row){
      if(row.receiptType==0){
        this.$confirm('该操作会创建一条相同账单的发票, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          receiptCreateReceipt({receiptId:row.receiptId,copyReceipt:1}).then(res=>{
            this.editInvocie(res.data[0])
            this.queryReceiptList()
          })
        }).catch(() => {

        });
      }else {
        receiptCreateReceipt({receiptId:row.receiptId,copyReceipt:1}).then(res=>{
          this.editInvocie(res.data[0])
          this.queryReceiptList()
        })
      }

    },
    copyInvo(data) {
      this.copyInvocie(data)
    },
    exportList(flag){
      this.exportType=flag
      if(flag==2){
        this.selectionState = true;
        this.multipleTypeText = '列表导出';
      } else if(flag == 1) {
        this.selectionOptionState=true
      }
      this.jumpDetailSubmisson()
    },
    closeSelect(){
      this.selectionOptionState=false
    },
    queryReceiptCompany(){
      queryReceiptCompany().then(res=>{
        this.queryReceiptCompanyList=res.data
      })
    },
    create(){
      this.pageState = 'create'
      this.createInvoiceState=true
    },
    async editInvocie(row){
      let res =await checkPermission({receiptId: row.receiptId})
      let isModify = (row.appUserId == this.$store.getters.userId || row.receiverUserId == this.$store.getters.userId) && (row.taskNo < 3 && row.taskNo != null)
      if(res.data.modify || isModify){
        this.pageState = 'edit'
        this.receiptId=row.receiptId
        this.createInvoiceState=false
        this.$nextTick(()=>{
          this.createInvoiceState = true
        })
      }else{
        this.$message.error('该发票您无法修改!')
      }
    },
    // 鼠标右键删除
    deleteInvocie(row){
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async()=>{
        let res =await checkPermission({receiptId: row.receiptId})
        let isDelete = (row.appUserId == this.$store.getters.userId || row.receiverUserId == this.$store.getters.userId) && (row.taskNo < 3 && row.taskNo != null)
        if(res.data.delete || isDelete){
          deleteReceipt({receiptIdList:row.receiptId}).then(()=>{
            this.$message.success('刪除成功')
            this.queryReceiptList()
          })
        }else{
          this.$message.error('该发票您无法删除!')
        }
      }).catch(() => {

      });
    },
    // 顶部快捷删除
    deleteInvocies(rows){
      checkPermission({receiptIdList: rows.map(item => item.receiptId)}).then(res => {
        let isDelList = res.data.filter(item => item.delete) || []
        let notDelList = res.data.filter(item => !item.delete) || []
        if (notDelList.length) {
          let notice = ''
          if (isDelList.length) {
            notice = `已选发票中:  ${isDelList.length}条发票可删除; ${notDelList.length}条发票无法删除, 是否继续?`
          } else {
            notice = '所选发票都无法删除！'
          }
          this.$confirm(notice, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            if (isDelList.length) {
              deleteReceipt({receiptIdList: isDelList.map(item => item.receiptId)}).then(()=>{
                this.$message.success('刪除成功')
                this.queryReceiptList()
              })
            }
          }).catch()
        }else{
          this.$confirm("此操作将永久删除, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(async()=>{
            deleteReceipt({receiptIdList: isDelList.map(item => item.receiptId)}).then(()=>{
              this.$message.success('刪除成功')
              this.queryReceiptList()
            })
          }).catch(() => {

          });
        }
      })
    },
    onGridReady(params) {
      this.gridparams=params
      this.gridApi = params.api;
      this.columnApi = params.columnApi;
    },
    dragStopped(params){
      let tableHeader=params.columnApi.columnController.gridColumns.map(item=>({
        label:item.colDef.headerName,
        width:item.actualWidth,
        prop:item.colDef.field,
      })).filter(item=>item.prop!='sid'&&item.prop!="group")
      this.tableHeader=tableHeader
      this.changeHeader(tableHeader)
      this.saveLocation()
    },
    cellRenderer(params) {
      if (params.colDef.field === 'sid') {
        return params.rowIndex + 1
      }
      if (params.node.rowPinned == 'bottom') {
        return `<span title="${params.value}" style="float: right">${(params.value || params.value === 0) ? params.value : ''}</span>`
      }
      if(['serviceCost', 'serviceCostDiscount', 'officialCost', 'otherCost', 'billTotal', 'receiptTotal', 'taxExcept', 'taxAmount', 'priceTaxTotal'].includes(params.colDef.field)){
        return `<span style="float: right" title="${formatAmount(params.value)}">${params.value ? formatAmount(params.value) : ''}</span>`
      }
      if(params.colDef.field === 'taxRate'){
        return `<span title="${params.value}">${params.value ? params.value : '0'}</span>`
      }
      return `<span title="${params.value}">${params.value ? params.value : ''}</span>`
    },
    getContextMenuItems(params){
      if(!params.node.data){
        return []
      }
      return this.getRowContextmenuList(params.node.data).map(item=>({
        name: item.name,
        action: () =>{
          this[item.action](params.node.data,params.value)
        }
      }))
    },
    rowDoubleClicked(params){
      if(params.rowPinned == 'bottom')return;
      var row=params.data
      // 当前任务人 + 审核权限 + 流程状态 = 编辑审核
      // 不符合上面操作 = 查看
      var isTaskPerson = row.tasker ? row.tasker.includes(this.$store.getters.name) : false
      if(
        isTaskPerson && this.$store.getters.permissions.includes(314) && row.taskNo == 2
        ||
        isTaskPerson && this.$store.getters.permissions.includes(315) && row.taskNo == 3
      ){
        this.pageState = 'edit'
        this.isAudit = true
      } else {
        this.pageState = 'view'
      }
      this.createInvoiceState = true
      this.receiptId=row.receiptId
    },
    invocie(data) {
      this.pageState = data.pageState
      this.createInvoiceState = data.createInvoiceState
      this.receiptId = data.receiptId
    },
    edit(data) {
      this.pageState = data.pageState
      this.receiptId=data.receiptId
      this.createInvoiceState=data.createInvoiceState
    },
    getSum(list,type){
      return list.map(item=>item[type]).filter(item=>!!item).reduce((x,y)=>x+y,0)
    },
    getSummary(list){
      let data={
        total: this.getSum(list,'total'),
      }
      this.$store.commit('caseInformation/SET_SUMMARYDATA',{name:'invocie_list',count:data})
    },
    refreshEvenRowsCurrencyData(params) {
      this.getSummary(this.gridApi.rowModel.rootNode.childrenAfterFilter.map(item=>item.data))
      this.currentPageSize = params.api.rowModel.rootNode.allChildrenCount
      if(!params.columnApi.columnController.groupAutoColumns) {
        this.gridApi.forEachNode(rowNode => {
          rowNode.setDataValue(
            'sid',
            rowNode.rowIndex + 1)
        });
      }
      if(this.invocieList.length){
        // this.$commonUtils.saveFilterModel(this.$options.name+this.$route.name,'FilterModel',this.gridApi.getFilterModel())
        if(params.type=="filterChanged"){
          this.$commonUtils.saveFilterModel(this.$options.name+this.$route.name,'FilterModel',this.gridApi.getFilterModel())
          var data = this.$commonUtils.getFilterModel(this.$options.name + this.$route.name, 'FilterModel');
          var arr = Object.keys(data);
          if(arr.length){
            this.brushRightHasFilter=true
          }else {
            this.brushRightHasFilter=false
          }
        }
        if(params.type=="sortChanged"){
          this.$commonUtils.saveFilterModel(this.$options.name+this.$route.name,'SortModel',this.gridApi.getSortModel())
        }
      }
    },
    takeCaseDetail(row, type) {
      if (type=='agentNum') {
        this.$router.push('/workbench/case/seeCaseDetail/'+row.caseId)
      }
    },
    filterCheck(val) {
      this.filterText = val;
    },
    rowDblclick(row){
      this.pageState = 'view'
      this.createInvoiceState = true
      this.receiptId=row.receiptId
    },
    copy(row, value) {
      if(value){
        this.$copyText(value).then(
          res => {
          })
      }
    },
    getRowContextmenuList(row){
      return [
        { name:'复制',action: 'copy' },
        { name:'复制发票',action: 'copyInvocie'},
        { name: '修改', action: 'editInvocie',permissions:216,},
        { name: '删除', action: 'deleteInvocie',permissions:217, }].filter(item=> {
        if (item.permissions) {
          if(item.permissions==216){
            return this.$store.getters.permissions.includes(item.permissions)
            // &&((row.appUserId == this.$store.getters.userId || row.receiverUserId == this.$store.getters.userId) && (row.taskNo < 3 && row.taskNo != null))

          }else {
            return this.$store.getters.permissions.includes(item.permissions)
          }
        }else {
          return true
        }
      })
    },
    getCurFilterId(title) {
      switch (title) {
        case "案件管理":
          return "caseId";
        case "递交官方":
          return "insId";
        case "官方通知":
          return "tmFileId";
        case "境外账单":
          return "abroadBillId";
        case "账单":
          return "billId";
        case "费用":
          return "feeId";
        case "发票":
          return "receiptId";
      }
    },
    editableTab(data){
      if(data&&data!=0){
        this.myTabsActivity=true
      }else {
        this.myTabsActivity=false
      }
    },
    rowContextmenu(row, column, event) {
      const that=this
      this.$ContextMenu({
        event, // 传入鼠标事件
        menu:this.getRowContextmenuList(row)
      }).then(rs => {
        if(rs){
          this[rs](row, column, event);
        }
      });
    },
    getSelectedRows() {
      if (this.gridApi) {
        const selectedNodes = this.gridApi.getSelectedNodes();
        const selectedData = selectedNodes.map(node => node.data);
        return selectedData
      }

    },
    rowClick(row, column, event){
      this.multipleSelection = this.getSelectedRows()
    },
    clickoutside(){
      this.drawerState=false
    },
    changeDate(n,start,end){
      this.queryModuleData[start]=n[0]
      this.queryModuleData[end]=n[1]
    },
    filterHandler(value, row, column) {
      const property = column['property'];
      return row[property] === value;
    },
    handleSearch(flag){
      if (typeof flag == 'object'){
        const { searchType, searchData } = flag
        this.queryModuleData = Object.assign(this.queryModuleData, searchData)
        if (searchType !== undefined){
          this.operationState = searchType
        }
      if(searchData.wfStatus && searchData.wfStatus != '已完成'){
        this.queryModuleData.execDateOut = ''
      }
      if(searchData.execDateOut){
        this.queryModuleData.wfStatus = '已完成'
      }
      }else{
        this.queryModuleData.execDateOut = ''
        this.operationState = flag
      }
      this.multipleSelection=[]
      this.selectionState=false
      this.listQuery.pageNo=1
      this.queryReceiptList()
      this.saveQueryModel()
      this.drawerState=false
    },
    saveQueryModel(){
      if(JSON.parse(localStorage.getItem('queryModuleData'))){
        var arr = JSON.parse(localStorage.getItem('queryModuleData'))
      }else {
        var arr = []
      }
      if(arr.find(item=>item.name==this.$route.name)){
        arr.find(item=>item.name==this.$route.name).queryModuleData=this.queryModuleData
      }else {
        arr.push({name:this.$route.name,queryModuleData:this.queryModuleData})
      }
      localStorage.setItem('queryModuleData',JSON.stringify(arr))
    },
    // 清空搜索
    clearSearch(that) {
      for (var key in that.queryModuleData) {
        let list = ['wfStatus']
        if (!list.includes(key)) {
          if (key.includes('Date')) {
            that.$set(that.queryModuleData, key, ['', ''])
          } else if (key.includes('Array') || key.includes('List')) {
            that.$set(that.queryModuleData, key, [])
          } else {
            that.$set(that.queryModuleData, key, null)
          }
        }
      }
    },
    handleCheckboxState() {
      this.checkboxState = !this.checkboxState
      if (this.checkboxState) {
        this.setWidth()
      }
    },
    setWidth() {
      let timer = setInterval(() => {
        if (this.$el.getElementsByClassName('el-select-dropdown')[0]){
          const els = this.$el.getElementsByClassName('el-select-dropdown')[0]
          const els1 = this.$el.getElementsByClassName('checkbox')[0]
          els1.children[0].click()
          //els.style.width = '100px';
          clearInterval(timer)
        }
      }, 60)
    },
    handleChange(boolean) {
      if (!boolean) {
        this.checkboxState=false
        const els1 = this.$el.getElementsByClassName('checkbox')[0]
        els1.children[0].click()
      }
    },
    savePreference(){
      let list2 = this.checkCaseList.map(item => ({ title: this.selectColumnList.find(i => i.COLUMN_NAME === item).COLUMN_COMMENT, value: item }))
      const data={
        userId: this.userId,
        bussId: this.bussId,
        list2
      }
      savePreference(data).then(res => {
        if (res.success) {
          this.checkboxState = false
          this.filterText=''
          this.queryReceiptList()
          this.getAllWfs()
        }
      })
    },
    getAllWfs() {
      const data = {
        userId: this.userId,
        bussId: this.bussId
      }
      Promise.all([selectColumn(data), queryPreference(data)]).then(res=>{
        this.selectColumnList = res[0].data
        this.preferenceList = res[1].data
        this.tableHeader = this.preferenceList.map(item=>({ label:item.title, prop:item.value,width: this.getLoactionWidth(item.title)}))
        this.saveLocation()
        this.checkCaseList = this.preferenceList.map(item => item.value)
        this.columnDefs=[...this.defaultcolumnDefs,...this.preferenceList.map(item=>({
          headerName: item.title,
          field: item.value,
          width:this.getLoactionWidth(item.title)=='auto'?200:this.getLoactionWidth(item.title),
          resizable: true,
          sortable: true,
          filter: 'agSetColumnFilter',
          menuTabs: ['filterMenuTab','generalMenuTab','columnsMenuTab'],
          cellRenderer: this.cellRenderer,
          enableRowGroup: true,
          filterParams: {
            newRowsAction: 'keep',
            comparator: (a, b)=>{
              return this.$commonUtils.sort(a,b,item.value)
            }
          }
        }))]
        this.$nextTick(()=>{
          this.columnDefs.forEach(item=>{
            this.columnApi.getColumn(item.field)&&this.columnApi.getColumn(item.field).addEventListener('menuVisibleChanged', ()=>{
              if(document.querySelector(".ag-tabs")){
                new this.$DraginResize(document.querySelector(".ag-set-filter-list"), {
                  clone: true,
                  end(info) {
                    if (info.dir == 'ver') {
                      this.elem.style.height = info.height + 'px';
                    }
                    else if (info.dir == 'hor') {
                      this.elem.style.width = info.width + 'px';
                    }
                  }
                })
              }
            });
          })
        })
      })
    },
    saveLocation(){
      if(!localStorage.getItem('tableHeader')){
        let arr=[]
        arr.push({name:this.$options.name,tableHeader:this.tableHeader})
        localStorage.setItem('tableHeader',JSON.stringify(arr))
      }else {
        let arr=JSON.parse(localStorage.getItem('tableHeader'))
        if(arr.find(item=>item.name==this.$options.name)){
          arr.find(item=>item.name==this.$options.name).tableHeader= this.tableHeader
          localStorage.setItem('tableHeader',JSON.stringify(arr))
        } else {
          arr.push({name:this.$options.name,tableHeader:this.tableHeader})
          localStorage.setItem('tableHeader',JSON.stringify(arr))
        }
      }
    },
    delPreference() {
      const data = {
        userId: this.userId,
        bussId: this.bussId,
      }
      delPreference(data).then(res=>{
        if(res.success){
          this.checkboxState=false
          this.queryReceiptList()
          this.getAllWfs()
        }
      })
    },
    handleSelectionAll(val) {
      val = val.filter(item => item !== undefined)
      this.multipleSelection = this.unique(this.multipleSelection.concat(val), 'receiptId')
      if (!val.length) {
        this.invocieList.forEach(row => {
          this.multipleSelection = this.multipleSelection.filter(item => item.receiptId !== row.receiptId)
        })
      }
    },
    handleSelectionChange(val, row) {
      val = val.filter(item => item != undefined)
      this.multipleSelection = this.unique(this.multipleSelection.concat(val), 'receiptId')
      if (!val.find(item => item.receiptId === row.receiptId)) {
        this.multipleSelection = this.multipleSelection.filter(item => item.receiptId !== row.receiptId)
        this.startRow=''
      }
    },
    unique(data, key) {
      const hash = {};
      const data2 = data.reduce((preVal, curVal) => {
        hash[curVal[key]] ? '' : hash[curVal[key]] = true && preVal.push(curVal);
        return preVal
      }, [])
      return data2
    },
    queryReceiptList(){
      // this.queryModuleData = JSON.parse(localStorage.getItem('queryModuleData'))?JSON.parse(localStorage.getItem('queryModuleData')).find(item=>item.name==this.$route.name)?JSON.parse(localStorage.getItem('queryModuleData')).find(item=>item.name==this.$route.name).queryModuleData:{}:{}
      const data = {
        pageNo: this.listQuery.pageNo,
        pageSize: this.listQuery.pageSize
      }

      // 当日开具
      if(this.queryModuleData.execDateOut){
        this.$set(this.queryModuleData, 'repCompIdOut', '')
        this.$set(this.queryModuleData, 'belongtoDateBeginOut', '')
        this.$set(this.queryModuleData, 'currentYear', '')
        this.$set(this.queryModuleData, 'currentMonth', '')
      }
      // 地区检索
      if(this.queryModuleData.repCompIdOut){
        this.$set(this.queryModuleData, 'execDateOut', '')
      }

      for (var key in this.queryModuleData) {
        if (Object.prototype.toString.call(this.queryModuleData[key]).includes("Date")) {
          this.queryModuleData[key] = this.formatDate(this.queryModuleData[key]);
        }
        if (this.queryModuleData[key] === null || this.queryModuleData[key] === '') {
          delete this.queryModuleData[key]
        }
      }
      this.listLoading = true
      const querData = Object.assign(data, this.queryModuleData)
      if (this.operationState) {
        for (var key in querData) {
          if (!['pageNo', 'pageSize'].includes(key)) {
            if (!['wfStatus', 'execDateOut','repCompIdOut','belongtoDateBeginOut'].includes(key)) {
              delete querData[key]
            }
            if(key == 'execDateOut' && querData[key]){
              querData.execDate = this.$wUtil.getDate('', 'day')
            }

            if (key == 'repCompIdOut' && querData[key]) {
              querData['companyId'] = this.queryModuleData.repCompIdOut
              querData['wfStatus'] = '已完成'
            }

            if (key == 'belongtoDateBeginOut' && querData[key]) {
              querData['wfStatus'] = '已完成'
              querData['optDateArray'] = [this.queryModuleData.belongtoDateBeginOut + '-01', this.$commonUtils.getEndDate( this.$commonUtils.getEndDate( this.queryModuleData.belongtoDateBeginOut + '-01', 1, '月'), -1, '天')]
            }
          }
        }
      } else {
        // 搜索项
        for (var key in querData) {
          if (!['pageNo', 'pageSize'].includes(key)) {
            if (['wfStatus', 'execDateOut','repCompIdOut','belongtoDateBeginOut'].includes(key)) {
              delete this.queryModuleData[key]
              delete querData[key]
            }
          }
        }
      }

      this.exportQueryModel = JSON.stringify(querData) //导出查询条件
      queryReceiptList(querData).then(res=>{
        this.total=res.total
        this.listLoading = false
        this.invocieList= res.data
      })
    },

    changeTextRange(e,type) {
      this.$set(this.queryModuleData, type, e)
    },
    queryCustomerList(query){
      if(query !== ''){
        queryCustomerNameId({ pageNo: 1, pageSize: 100,keyword:query }).then(res=>{
          this.customerNameIdList=res.data
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
    getUser(){
      this.queryGetUserList =this.$store.getters.userList
    },
    getTimelimitTypeAll(){
      getTimelimitTypeAll().then(res=>{
        this.getTimelimitTypeAllList=res.data
      })
    },
    timelimitState1(e){
      this.queryModuleData.timelimitStateList=[e[e.length-1]]
      if(this.queryModuleData.timelimitStateList&&this.queryModuleData.timelimitStateList[0]==='未核销'){
        this.queryModuleData.timelimitState=1
      }
      if(this.queryModuleData.timelimitStateList[0]&&this.queryModuleData.timelimitStateList[0]==='已核销'){
        this.queryModuleData.timelimitState=2
      }
      if(this.queryModuleData.timelimitStateList[0]&&this.queryModuleData.timelimitStateList[0]==='全部'){
        this.queryModuleData.timelimitState=0
      }
      if(!this.queryModuleData.timelimitStateList[0]){
        this.queryModuleData.timelimitState=''
      }
    },
    getWriteoffState() {
      getWriteoffState().then(res => {
        this.writeoffStateList = res.data
      })
    },
    jumpDetailSubmisson(){
      if(this.multipleTypeText=='列表导出'){
        this.selectionOptionState=true
      }
    },
    takemodify(row) {
    },
    takeSee(row) {
    },
    confirmExactButton(){
      if(!this.multipleSelection.length){
        return
      }
      if(this.operationState===1){
        this.examineState=false
        this.dialogVisible=true
      } else if (this.operationState === 2){
        this.dialogVisible=true
        this.examineState=true
      }
    },
    confirmExact(row){
      this.multipleSelection=[row]
      this.examineState=false
      this.dialogVisible=true
    },
    headerDragend(newWidth, oldWidth, column, event){
      var arr=JSON.parse(localStorage.getItem('tableHeader'))
      var header=arr.find(item=>item.name==this.$options.name).tableHeader
      if (header.find(item=>item.label==column.label)){
        header.find(item=>item.label==column.label).width=newWidth
      }
      localStorage.setItem('tableHeader',JSON.stringify(arr))
    },
    getMinWidth(data){
      return String(data.label).replace(/[\u4E00-\u9FA5]/gi,'aa').length*12+30
    },
    getLoactionWidth(label){
      if(!localStorage.getItem('tableHeader')){
        return 'auto'
      } else {
        var arr= JSON.parse(localStorage.getItem('tableHeader'))
        if(arr.find(item=>item.name==this.$options.name)){
          var header=arr.find(item=>item.name==this.$options.name).tableHeader
          if(header.find(item=>item.label==label)){
            return header.find(item=>item.label==label).width
          } else {
            return 'auto'//String(label).replace(/[\u4E00-\u9FA5]/gi,'aa').length*12+30
          }
        } else {
          return 'auto'
        }
      }
    },
    getWidth(data){
      let arr=[...[String(data.label).replace(/[\u4E00-\u9FA5]/gi,'aa').length],...this.invocieList.map(item => item[data.prop]).filter(item=>item).map(item=>String(item).replace(/[\u4E00-\u9FA5]/gi,'aa').length)]
      if(data.label.includes('日')||data.label.includes('号')) {
        return 150
      }
      // } else if (data.label.includes('号')||data.label.includes('客户')) {
      //   return Math.max(...arr)*11+20
      // }
      return 'auto'
    },
    getState(val){
      if(val==0||val==1){
        return '未核销'
      }else if(val==2){
        return '已核销'
      }
    },
    validTime(startTime,isSign){
      // if(isSign === 1) {
      //   return '#1AB55A'
      // }
      // if(isSign === 2) {
      //   return '#c9c9c9'
      // }
      // startTime=new Date(startTime).getTime()
      // var endTime = new Date().getTime()
      // var nextDay=new Date(formatDate(new Date(new Date().getTime() + 24*60*60*1000).toLocaleDateString())).getTime()
      // if(startTime<=nextDay&&startTime>endTime){
      //   return '#409EFF'
      // }
      // if(startTime<endTime) {
      //   return '#FB1E1E'
      // }
      // return '#333'
    },
    rowStyle({row, rowIndex}){
      // var startTime=row.abslimitDate
      // if(row.isSign === 1) {
      //   return {color:'#1AB55A'}
      // }
      // if(row.isSign === 2) {
      //   return {color:'#c9c9c9'}
      // }
      // startTime=new Date(startTime).getTime()
      // var endTime = new Date().getTime()
      // var nextDay=new Date(formatDate(new Date(new Date().getTime() + 24*60*60*1000).toLocaleDateString())).getTime()
      // if(startTime<=nextDay&&startTime>endTime){
      //   return {color:'#409EFF'}
      // }
      // if(startTime<endTime) {
      //   return {color:'#FB1E1E'}
      // }
      // return {color:'#333'}
    },
    renderHeader (createElement, {column}) {
      return createElement(
        'div', {
          'class': ['thead-cell'],
          on: {
            mousedown: ($event) => { this.handleMouseDown($event, column) },
            mouseup: ($event) => { this.handleMouseUp($event, column) },
            mousemove: ($event) => { this.handleMouseMove($event, column) }
          }
        }, [
          // 添加 <a> 用于显示表头 label
          createElement('a', column.label),
          // 添加一个空标签用于显示拖动动画
          createElement('span', {
            'class': ['virtual']
          })
        ])
    },
    // 按下鼠标开始拖动
    handleMouseDown (e, column) {
      if(e.target.parentNode.parentNode.childNodes[1]){
        e.target.parentNode.parentNode.childNodes[1].click()
      }
      this.dragState.dragging = true
      this.dragState.start = parseInt(column.columnKey)
      // 给拖动时的虚拟容器添加宽高
      let table = document.getElementsByClassName('w-table')[0]
      let virtual = document.getElementsByClassName('virtual')
      for (let item of virtual) {
        item.style.height = item.parentElement.clientHeight - 1 + 'px'
        item.style.width = item.parentElement.clientWidth  + 'px'
        item.style.left='10px'
        // item.innerText=item.parentElement.parentElement.innerText
      }
    },

// 鼠标放开结束拖动
    handleMouseUp (e, column) {
      this.dragState.end = parseInt(column.columnKey) // 记录起始列
      this.dragColumn(this.dragState)
      // 初始化拖动状态
      this.dragState = {
        start: -1,
        end: -1,
        move: -1,
        dragging: false,
        direction: undefined
      }
    },

// 拖动中
    handleMouseMove (e, column) {
      if (this.dragState.dragging) {
        let index = parseInt(column.columnKey) // 记录起始列
        if (index - this.dragState.start !== 0) {
          this.dragState.direction = index - this.dragState.start < 0 ? 'left' : 'right' // 判断拖动方向
          this.dragState.move = parseInt(column.columnKey)
        } else {
          this.dragState.direction = undefined
        }
      } else {
        return false
      }
    },
    // 拖动易位
    dragColumn ({start, end, direction}) {
      if(start==-1){
        return
      }
      let tempData = []
      let left = direction === 'left'
      let min = left ? end : start - 1
      let max = left ? start + 1 : end
      for (let i = 0; i < this.tableHeader.length; i++) {
        if (i === end) {
          tempData.push(this.tableHeader[start])
        } else if (i > min && i < max) {
          tempData.push(this.tableHeader[ left ? i - 1 : i + 1 ])
        } else {
          tempData.push(this.tableHeader[i])
        }
      }
      if(start==end){
        return
      }
      this.tableHeader = tempData
      this.$refs.todoTaskMultiple.store.states.filters={}
      let arr=Array.from(this.$refs.todoTaskMultiple.$el.querySelectorAll('.is-sortable'))
      let classList = arr.map(item=>Array.from(item.classList).find(itm=>itm.includes('column')))
      this.$refs.todoTaskMultiple.store.states.columns.forEach(ii=>{
        ii.filteredValue=[]
      })
      this.tableHeader.forEach((item,index)=>{
        classList.forEach((itm,idx)=>{
          if(index==idx){
            this.$refs.todoTaskMultiple.store.states.filters[itm]=this.filterDataSum[item.label]
            this.$refs.todoTaskMultiple.store.states.columns.forEach(ii=>{
              if(ii.id==itm){
                ii.filteredValue=this.filterDataSum[item.label]
              }
            })
          }
        })
      })
    },
    filterChange(a){
      this.total=this.$refs.todoTaskMultiple.tableData.length
      for (var key in a){
        this.tableHeader.forEach((item,index)=>{
          if(index==key){
            this.$set(this.filterDataSum,item.label,a[key])
            // this.filterDataSum[item.label]=a[key]
          }
        })
      }
    },
    headerCellClassName ({column, columnIndex}) {
      // if(this.dragState.dragging){
      //   console.log(this.dragState.move,columnIndex);
      //   return (columnIndex - 1 === this.dragState.move ? `moveIng` : '')
      // }
      if(!this.selectionState){
        return (columnIndex - 1 === this.dragState.move ? `moveIng` : '')
      }else {
        return (columnIndex -2=== this.dragState.move ? `moveIng` : '')
      }

      //  return (columnIndex - 1 === this.dragState.move ? `darg_active_${this.dragState.direction}` : '')
    },
    changeHeader(n){
      if(n&&n.length){
        this.checkCaseList=n.map(item => item.prop)
        let list2 = this.checkCaseList.map(item => ({
          title: this.selectColumnList.find(i => i.COLUMN_NAME === item)
            .COLUMN_COMMENT,
          value: item
        }));
        const data = {
          userId: this.userId,
          bussId: this.bussId,
          list2
        };
        savePreference(data).then(res => {
          // this.tableState=false
          this.$nextTick(()=>{
            //  this.tableState=true
            this.invocieList.push({})
            this.invocieList.pop()
          })
        });
      }
    },
    getCellClassName({row, column, rowIndex, columnIndex}){
      if(column.label==='绝限日期'){
        return 'red'
      }
    },
    // 发票状态更改(做任务)
    doTask(taskNo, result) {
      var list = this.getSelectedRows().filter(item=>item.taskNo!==taskNo)
      if (list.length){
        this.$message.error(`有${list.length}条发票流程状态不符合当前操作！`)
        return false
      }
      var data = { taskIdList: this.getSelectedRows().map(i=>i.taskId) }
      if (taskNo == 2 || taskNo == 3){
        data = Object.assign(data, { result: result });
      }
      if(this.getSelectedRows().length > 1){
        this.receiptToTask(data,0)
      }else{
        var checkReceipt = result != undefined ? result : 1 //退回不判断发票问题， checkReceipt = result
        this.receiptToTask(data,checkReceipt)
      }
    },
    receiptToTask(data,checkReceipt) {
      var data = Object.assign(data, { checkReceipt : checkReceipt });
      receiptToTask(data).then(res => {
        if (res.messageType == -6) {
          let confirmText = res.message.split('$$');
          const newDatas = []
          const h = this.$createElement
          for (const i in confirmText) {
            newDatas.push(h('p', null, confirmText[i]))
          }
          newDatas.push(h('p', null, '是否继续 ？'))
          this.$confirm(
            '提示',
            {
              title: '提示',
              message: h('div', null, newDatas),
              showCancelButton: true,
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }
          ).then(() => {
            this.receiptToTask(data,0)
          }).catch(()=>{});
        }else{
          this.$message.success('操作成功！')
          this.queryReceiptList()
        }
      })
    },
  },
  watch:{
    drawerState(n){
      console.log(n)
      if(n){
        this.$nextTick(()=>{
          document.getElementById('clearWrap').style.top =document.getElementById('searchWrap').scrollTop+ document.getElementById('searchWrap').offsetHeight - 40 + 'px'
        })
      }
    },
    tableHeader(n){
      this.tableHeaderLabelList=n.map(item=>item.label)
    },
    tableHeaderLabelList(n,o){
      if(o.length){
        if(localStorage.getItem('tableHeader')){
          let header=JSON.parse(localStorage.getItem('tableHeader')).find(item=>item.name==this.$options.name).tableHeader
          this.tableHeader.forEach(item=>{
            header.forEach(itm=>{
              if(itm.label==item.label){
                this.$set(item,'width',itm.width)
              }
            })
          })
        }
        this.changeHeader(this.tableHeader)
      }
    },
  },
  computed:{
    clientHeight(){
      let height = 0;
      if(this.$store.state.settings.toolPosTop == 'top'){
        height = 235
      }else if(this.$store.state.settings.toolPosTop == 'right'){
        height = 140
      }
      return  document.documentElement.clientHeight - height
    },
    // 设置计算列表统计总计
    pinnedBottomRowData() {
      if (this.gridApi.rowModel) {
        const columnDisplay = ['billTotal', 'serviceCost', 'serviceCostDiscount', 'officialCost', 'otherCost', 'receiptTotal', 'taxAmount', 'taxExcept', 'priceTaxTotal']
        return this.$commonUtils.pinnedBottomRowData(this.gridApi.rowModel.rootNode.childrenAfterFilter.map(item=>item.data), this.columnDefs, columnDisplay)
      }
      return ''
    },
  },
  components:{
    Pagination,createInvoice,
    SelectOption,MyTabs,
    UploadProofreading
  }
}
</script>

<style lang="scss" scoped>
.app-main {
  //margin: 0 10px 0 0px;
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
/deep/ .pass-row{
  background: #c9c9c9!important;
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
.buttonWrap2{
  width: 100%;
  text-align: right;
  margin-bottom: 10px;
  margin-top: 10px;
}
.limitDayNum{
  height:30px;
  display: flex;
  position:relative;
  align-items: center;
  margin-bottom:10px;
  img {
    width: 30px;
    height: 30px
  }
  span{
    font-family: 'Nunito Sans';
    font-weight: 400;
    font-style: normal;
    font-size: 14px;
    margin-left: 2px;
    margin-right: 10px;
    color: rgb(121, 121, 121);
  }
  .el-select{
    width: 174px;
    height: 32px;
    line-height: 32px;
    margin-right: 20px;
    /deep/ .el-input__icon{
      line-height:25px
    }
    /deep/ input{
      height: 32px;
      line-height: 32px;
    }
  }
}
section{
  position: relative;
  clear: both;
  flex: 1;
}
.checkbox{
  position:absolute;
  left: 14px;
  top: 48px;
  width: 222px;
  height: 324px;
  border: 1px solid #99a9bf;
  background: #fff;
  z-index: 100;
  padding-top: 6px;
  padding-left: 6px;
}
.checkbox_bottom {
  position: absolute;
  display: flex;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 29px;
  background: #fff;
  z-index: 2;
  justify-content: flex-end;
}
.checkbox_bottom ~ li:last-of-type {
  margin-bottom: 30px;
}
.dots{
  cursor: pointer;
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  .dot{
    color:transparent;
    padding: 1px;
    margin: 1px;
    width: 5px;
    background: RGBA(113, 123, 140, 1);
    height: 5px;
    display: block;
  }
  &~span{
    margin-left: 5px;
  }
}
.checkboxChangeRadio{
  /deep/.el-checkbox__inner{
    border-radius: 50%;
  }
  /deep/ .el-checkbox__inner:after{
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background-color: #FFF;
    position: absolute;
    left: 50%;
    top: 50%;
    -webkit-transition: -webkit-transform .01s ease-in;
    transition: -webkit-transform .01s ease-in;
    transition: transform .01s ease-in;
    transition: transform .01s ease-in, -webkit-transform .01s ease-in;
    transition: transform .01s ease-in,-webkit-transform .01s ease-in;
    transform: translate(-50%,-50%) scale(1);
  }
}
/deep/ .selectRow{
  background:  #C9C8D0
}
.timeLimitTable /deep/ .cell{
  white-space: nowrap;
  text-overflow: clip;
}
.w-table {
  /deep/ .caret-wrapper{
    position: relative;
  }
  /deep/ .el-table__column-filter-trigger{
    position: relative;
  }
  /deep/ .el-table th {
    padding: 0;
    .virtual{
      position: absolute;
      display: block;
      width: 0;
      height: 0;
      top: 0;
      background: none;
      border: none;
      box-sizing: border-box;
    }

  }
  /deep/ .thead-cell {
    vertical-align: middle;
    padding: 0;
    display: inline-flex;
    flex-direction: column;
    align-items: left;
    cursor: pointer;
    overflow: initial;
    /*&:before {*/
    /*content: "";*/
    /*position: absolute;*/
    /*top: 0;*/
    /*left: 0;*/
    /*bottom: 0;*/
    /*right: 0;*/
    /*}*/
  }
  &.w-table_moving {
    .el-table th .thead-cell{
      cursor: move !important;
    }
    .el-table__fixed {
      cursor: not-allowed;
    }
  }
}
/deep/ .moveIng{
  .virtual {
    border: 2px dotted #666 !important;
  }

}
/deep/.pagination-container{
  padding: 0;
}
.DataPicker /deep/ {
  .el-input__prefix{
    display: none;
  }
  .el-input{
    width: 100%;
  }
  .el-input__inner{

    text-align: center;

    padding: 0;
    padding-right: 18px;
    // padding-left: 10px;
  }
}
.el-form {
  position: relative;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  .el-cascader {
    width: 100%;
  }
  .postInfo-container-item {
    /deep/ .el-form-item__content {
      width: 330px;
      display: flex;
      height: 28px;
      align-items: center;
      .el-select {
        width: 100%;
      }
      .el-input {
        width: 100%;
      }
    }
  }
}
.button-group-search{
  position: relative;
  .searchWrap{
    border-radius: 5px;
    top: 34px;
    left: 0;
    width: 550px;
    max-height: 500px;
    position: absolute;
    background: #ffffff;
    border: 1px solid #d4d5d5;
    z-index: 1;
    overflow: auto;
    padding: 20px 0;
    box-shadow: 0 3px 6px rgba(111,111,111,0.2);
    /deep/  .el-form{
      .el-form-item__label{
        text-align: left;
        padding-left: 32px;
        font-weight: normal;
      }
      .el-form-item__content{
        display: flex;
        input{
          border-top: 0;
          border-left: 0;
          border-radius: 0;
          border-right: 0
        }
      }
    }
    .clearWrap{
      display: flex;
      justify-content: flex-end;
      width: 100%;
      background: #fff;
      right: 10px;
      padding-bottom: 10px;
      position: absolute;
      z-index: 1;
    }
  }
}
.DataPicker /deep/ {
  .el-input__prefix {
    display: none!important;
  }
  .el-input__inner {
    text-align: left;
    padding-left: 15px;
    padding-right: 18px;
  }
}
@keyframes show {
  0% {

    opacity: 0;
    //transform: translateX(100%);

  }
  100% {
    // transform: translateX(0);
    opacity: 1;

  }
}
@keyframes hide {
  0% {
    opacity: 1;
    // transform: translateX(0);
  }
  100% {

    opacity: 0;
    //  transform: translateX(100%);
  }
}
.show-enter-active {
  animation: show 0.5s;
}
.show-leave-active {
  animation: hide 0.5s;
}
.show-enter, .show-leave-to {
  opacity: 0;
}
.button_wrap{
  margin-left:10px;
}
.searchRight{
  border-top-right-radius:3px !important;
  border-bottom-right-radius:3px !important;
  padding:0 5px;
  height: 32px
}
.dots {
  cursor: pointer;
  position: absolute;
  left: 0;
  z-index: 1;
  top: 16px;
  width: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  .dot {
    color: transparent;
    padding: 1px;
    margin: 1px;
    width: 5px;
    background: RGBA(113, 123, 140, 1);
    height: 5px;
    display: block;
  }
  & ~ span {
    margin-left: 5px;
  }
}
.brush_right{
  position: absolute;
  right: 6px;
  z-index: 1;
  top: -5px;
}
.MyTabs{
  width: 100%;
  position: absolute;

  /deep/ .el-tabs{
    .el-tabs__header{
      margin: 0;
    }
    .el-tabs__content{
      background: #fff;
    }
  }
}
.MyTabs.activity{
  background: #fff;
  z-index: 8;
  /deep/ .el-tabs{
    .el-tabs__header{
      margin: 0;
      background: #fff;
    }
    .el-tabs__content{
      background: #fff;
    }
  }
}
.topBox {
    background-color: #F2F2F2;
    padding-left: 20px;
    display: flex;
    height: 40px;
    /*justify-content: center;*/
    align-items: center;
    margin-bottom: 10px;

    .iconfont {
      margin-right: 10px;
    }
  }
  > > > .no-top {
    .el-dialog__body {
      padding-top: 0;
    }
  }
  .form-container {
    .el-form-item__error {
      position: relative !important;
      top: 0;
    }

    /deep/ .el-row {
      width: 100%;
      margin: 0px;
      display: flex; /*解决账单查看表单样式被撑开*/
    }

    /deep/ .postInfo-container-item {
      height: 100%;
      width: 100%;
    }

    /deep/ .el-form-item__label {
      background-color: #f9f9f9;
      /*width: 36.7%;*/
      text-align: right;
    }

    /deep/ .el-form-item {
      border-right: 1px solid #d7d7d7;
      margin: 0px !important;
    }

    .first-row {
      border-top: 1px solid #d7d7d7;
    }

    /deep/ .el-row {
      border-bottom: 1px solid #d7d7d7;
      border-left: 1px solid #d7d7d7;
    }

    /deep/ .el-input,
    /deep/ .el-select {
      /*width: 77%;*/
    }

    /deep/ td .el-input,
    /deep/ td .el-select {
      width: 100%;
    }

    /deep/ .el-form-item__content {
      text-align: left;
      word-break: break-word;
      // height: 30px;
    }

    .fullRow {
      /deep/ .el-form-item__label {
        /*width: 15%;*/
      }

      /deep/ .el-input,
      /deep/ .el-select {
        /*width: 30%;*/
      }
    }

    /deep/ .el-input__inner {
      // border: none;
    }

    /deep/ .el-select .el-input {
      width: 100%;
    }

    /deep/ td .el-select,
    /deep/ td .el-input,
    /deep/ td .el-input__inner {
      // border: 0px !important;
    }

    .postInfo-container-item {
      display: flex;
      width: 100%;

      /deep/ .el-form-item__content {
        text-align: left;
        display: inline-table;
        flex: 1;
        padding: 5px 15px;
        margin-left: 0 !important;
      }

      /deep/ .el-form-item__label {
        /*line-height: 28px;*/
      }
    }
  }
</style>
