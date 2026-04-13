<template>
  <div>
    <section>
<!--      <div style="display: flex;position: relative">-->
<!--        <div style="cursor:pointer;position: absolute;display:flex;align-items:center;right: 0;bottom:-6px;font-size: 14px;padding-right: 6px">-->
<!--          <el-button type="text" @click="exportList(2)" >导出</el-button>-->
<!--          <span style="color: #52A2F4;margin: 0 5px"> / </span>-->
<!--          <el-button type="text" @click="exportList(1)">全局导出</el-button>-->
<!--        </div>-->
<!--      </div>-->
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
        @pagination="queryList"
        :pageSizes="pageSizesList"
      />
    </section>
    <SelectOption :buss-id="bussId" v-if="selectionOptionState" :dialog-visible="selectionOptionState" @cancel="closeSelect" :idArray="getCurrentRowsData('invBorId')" :defaultMultipleSelect="preferenceList.map(i=>i.title)" :exportType="exportType" :exportQueryModel="exportQueryModel"></SelectOption>
    <InvoiceLibraryDetail ref="invoiceLibraryDetail" @cancel="cancel"/>
    <!--  修改发票所属人  -->
    <el-dialog
      v-if="plEditView"
      class="no-top"
      title="修改发票所属人"
      :visible.sync="plEditView"
      width="30%"
    >
      <div class="topBox">
        <span class="iconfont icon-warning-circle-fill" style="color: #E6A23C;font-size: 20px;"></span>
        <span>确认要修改所选发票所属人吗？</span>
      </div>
      <el-form class="form-container" size="small" label-position="right" label-width="120px">
        <el-row style="width: 100%" class="first-row">
          <el-form-item label="发票所属人:" class="postInfo-container-item">
            <el-select v-model="invoiceOwnership.invUserId" @change="queryWorkByUserId" filterable clearable reserve-keyword>
              <el-option
                v-for="item in $store.getters.userList"
                :key="item.userId"
                :label="item.fullname"
                :value="item.userId"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row style="width: 100%" class="first-row">
          <el-form-item label="发票所属工作组:" class="postInfo-container-item">
            <el-select v-model="invoiceOwnership.wkgId" @change="changeCostWkg" size="small" no-match-text="暂无数据" filterable>
              <el-option
                v-for="item in selectGroupData"
                :key="item.wkgId"
                :label="item.groupName"
                :value="item.wkgId"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row  style="width: 100%" class="first-row">
          <el-form-item label="发票所属部门:" class="postInfo-container-item">
            <span>{{invoiceOwnership.domainIdStr}}</span>
          </el-form-item>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
      <el-button
        @click="()=>{this.plEditView = false, this.invoiceOwnership = {}}">取 消</el-button>
      <el-button type="primary" @click="invoiceOwnershipSubmit">确 定</el-button>
    </span>
    </el-dialog>
  </div>
</template>

<script>
import { queryWorkByUserId } from '@/api/systemList'
import { queryZZWorkGroupUrl } from "@/api/billApi";
import {formatAmount} from '@/utils/filters'
import SelectOption from '@/views/workbench/case/components/SelectOption'
import Pagination from '@/components/Pagination'; // secondary package based on el-pagination
import {
  queryInvoiceLibrary,
  checkInvoice,
  batchProcess,
  deleteInvoice,
  modifyInvoiceStatus,
  modifyVeriCode,
  batchModifyInvoice,
  selectColumn,
  queryPreference,
  delPreference,
  savePreference,
  rollbackBatchProcess
} from '@/api/caseList.js'
import Summary from "@/components/Summary/index.js";
import InvoiceLibraryDetail from './InvoiceLibraryDetail'
export default {
  name: 'invoiceLibraryList',
  data() {
    var tableHeader=[]
    if(localStorage.getItem('tableHeader')&&JSON.parse(localStorage.getItem('tableHeader')).find(item=>item.name==this.$options.name)){
      tableHeader = JSON.parse(localStorage.getItem('tableHeader')).find(item => item.name == this.$options.name).tableHeader
    }
    return {
      plForm: [],
      plEditView: false,
      invoiceOwnership: {
        invUserId: '',
        wkgId: '',
        domainId: '',
        domainIdStr: ''
      },
      groupList: [],
      userGroupList: [],
      selectGroupData: [],
      hoverState:false,
      curFile:[],
      invocieList:[], //表格数据
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
      gridApi:{},
      columnDefs: [], //定义列
      gridOptions: {
        statusBar: {
          statusPanels: [
            { statusPanel: 'agSelectedRowCountComponent', align: 'left' },
            { statusPanel: 'CountStatusBarComponent' }
          ]
        },
      },
      pageSizesList: [10, 50, 200, 500, 1000, 5000, 10000],
      listLoading:false,
      activeNames:[],
      listQuery: {
        pageNo: 0,
        pageSize:  JSON.parse(localStorage.getItem('pageSize'))?JSON.parse(localStorage.getItem('pageSize')).find(item=>item.name==this.$route.name)?JSON.parse(localStorage.getItem('pageSize')).find(item=>item.name==this.$route.name).pageSize:10:10
      },
      pageState:'create',
      currentMonth: '',
      currentYear: '',
      queryModuleData: {}, //搜索条件
      total:0, //全部数
      multipleSelection:[],
      customerNameIdList:[],
      timelimitState: [],
      dialogVisible: false,
      operationState:1,
      examineState:false,
      checkboxState:false, //复选框状态
      userId: this.$store.getters.userId,
      bussId: 56,
      preferenceList: [], //内容展示列
      selectColumnList: [], //选择列列表
      checkCaseList: [], //循环列表数据
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
      filterText:'',
      filterDataSum:{},
      receiverUserList:[],
      exportType:2, //导出状态
      selectionOptionState: false, //导出页面状态
      exportQueryModel:'',
      searchType:'',
      invoiceDebtor:'' // 欠发票人
    }
  },

  created() {
    this.getAllWfs()
    this.getallSelectdata()
  },
  methods: {
    libraryWithdraw() {
      if (!this.getSelectedRows().length) {
        this.$message.error('请选择发票！')
        return
      }
      this.$confirm('是否确认撤回处理？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        rollbackBatchProcess({invId: this.getSelectedRows().map(item => item.invId)[0]}).then(res => {
          this.$message.success('操作成功！')
          this.queryPartData(this.getSelectedRows().map(item => item.invId))
        })
      }).catch(() => {})
    },
    async getallSelectdata() {
      queryZZWorkGroupUrl().then(res => {
        this.groupList = res.data
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
    // 右侧清理列过滤器
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
    /*右侧导出*/
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
    // 关闭导出选项
    closeSelect(){
      this.selectionOptionState=false
    },
    // 创建完成后执行的事件
    onGridReady(params) {
      this.gridparams=params
      this.gridApi = params.api;
      this.columnApi = params.columnApi;
    },
    // 拖动列记录
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
    // 单元(列)渲染器
    cellRenderer(params) {
      if (params.node.rowPinned == 'bottom') {
        return `<span title="${params.value}" style="float: right">${(params.value || params.value === 0) ? params.value : ''}</span>`
      }
      if (params.colDef.field === 'sid') {
        return params.rowIndex + 1
      }
      // 展示小数点后两位
      if(['amount'].includes(params.colDef.field)){
        return `<span style="float: right" title="${formatAmount(params.value)}">${params.value ? formatAmount(params.value) : ''}</span>`
      }
      return `<span title="${params.value}">${(params.value || params.value === 0) ? params.value : ''}</span>`
    },
    // 设置右键菜单项
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
    // 双击查看
    rowDoubleClicked(params){
      if(params.rowPinned == 'bottom')return;
      var row=params.data
      this.$refs.invoiceLibraryDetail.invoiceView(row);
    },
    // 获取数量
    getSum(list,type){
      return list.map(item=>item[type]).filter(item=>!!item).reduce((x,y)=>x+y,0)
    },
    // 过滤器功能
    getSummary(list){
      let data={
        total: this.getSum(list,'total'),
      }
      this.$store.commit('caseInformation/SET_SUMMARYDATA',{name:'invocie_list',count:data})
    },
    // 排序/过滤器
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
      // 过滤器筛选检索判断，扫帚加红
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
    // 搜索内容
    filterCheck(val) {
      this.filterText = val;
    },
    rowDblclick(row){

    },
    // 获取菜单项列表
    getRowContextmenuList(row){
      let list = []
      list = [
        { name: '复制', action: 'copy' },
        { name: '修改', action: 'libraryEdit' },
        { name: '删除', action: 'libraryDelete' },
        { name: '设为不可用', action: 'changeInvoiceStatus', permissionsData: [{premission: 397, invStatus:  -1 }]},
        { name: '设为可用', action: 'changeInvoiceStatus', permissionsData: [{premission: 397, invStatus:  0 }] },
        { name: '设发票为真', action: 'modifyVeriCode', permissionsData: [{premission: 397, veriCode:  false }]},
        { name: '设发票为假', action: 'modifyVeriCode', permissionsData: [{premission: 397, veriCode:  0 }] },
        { name: '重验', action: 'verifyAgain', permissionsData: [{ veriCode:  0 }] },
      ]
      return list.filter(item=> {
        if (item.permissions) {
          return this.$store.getters.permissions.includes(item.permissions)
        }else if(item.permissionsData){
          // 针对不同状态不同情况
          if (item.action == 'changeInvoiceStatus') {
            return item.permissionsData.some(itm=> this.$store.getters.permissions.includes(itm.premission)&&row.invStatus==itm.invStatus)
          }else if(item.action == 'modifyVeriCode') {
            if (item.permissionsData[0].veriCode === false){
              return item.permissionsData.some(itm=> this.$store.getters.permissions.includes(itm.premission)&&row.veriCode!=0)
            }else{
              return item.permissionsData.some(itm=> this.$store.getters.permissions.includes(itm.premission)&&row.veriCode==itm.veriCode)
            }
          }else if(item.action == 'verifyAgain') {
            return item.permissionsData.some(itm=> row.veriCode!=itm.veriCode)
          }
        }else {
          return true
        }
      })
    },
    copy(row, value) {
      if(value){
        this.$copyText(value).then(
          res => {
          })
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
    // 获取select行数
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
    // 搜索
    handleSearch(flag){
      if(typeof flag == 'object'){
        const { searchType, searchData } = flag
        this.queryModuleData = Object.assign(this.queryModuleData, searchData)
        if(searchType !== undefined){
          this.operationState = searchType
        }
        if(this.operationState && searchData.cxFlag){
          delete this.queryModuleData.purchaserName
        }
      }else {
          this.operationState = flag
      }
      this.multipleSelection=[]
      this.selectionState=false
      this.listQuery.pageNo=1
      this.queryList()
      this.saveQueryModel()
    },
    // 保存查询条件
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
    /*左侧展示列设置功能*/
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
    // 下拉框出现/隐藏式触发
    handleChange(boolean) {
      if (!boolean) {
        this.checkboxState=false
        const els1 = this.$el.getElementsByClassName('checkbox')[0]
        els1.children[0].click()
      }
    },
    // 保存偏好设置
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
          this.queryList()
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
    // 删除偏好设置
    delPreference() {
      const data = {
        userId: this.userId,
        bussId: this.bussId,
      }
      delPreference(data).then(res=>{
        if(res.success){
          this.checkboxState=false
          this.queryList()
          this.getAllWfs()
        }
      })
    },
    unique(data, key) {
      const hash = {};
      const data2 = data.reduce((preVal, curVal) => {
        hash[curVal[key]] ? '' : hash[curVal[key]] = true && preVal.push(curVal);
        return preVal
      }, [])
      return data2
    },
    // 获取发票数据列表
    queryList(){
      // this.queryModuleData = JSON.parse(localStorage.getItem('queryModuleData'))?JSON.parse(localStorage.getItem('queryModuleData')).find(item=>item.name==this.$route.name)?JSON.parse(localStorage.getItem('queryModuleData')).find(item=>item.name==this.$route.name).queryModuleData:{}:{}
      const data = {
        pageNo: this.listQuery.pageNo,
        pageSize: this.listQuery.pageSize
      }
      this.listLoading = true
      const querData = Object.assign(data, this.queryModuleData)
      if (this.operationState) {
        for (var key in querData) {
          if (!['pageNo', 'pageSize'].includes(key)) {
            if (!['cxFlag','purchaserName'].includes(key)) {
              delete this.queryModuleData[key]
              delete querData[key]
            }
          }
        }
      } else {
        // 搜索项
        for (var key in querData) {
          if (!['pageNo', 'pageSize'].includes(key)) {
            if (['cxFlag'].includes(key)) {
              delete this.queryModuleData[key]
              delete querData[key]
            }
          }
        }
      }
      this.exportQueryModel = JSON.stringify(querData) //导出查询条件
      queryInvoiceLibrary(querData).then(res=>{
        this.total=res.total
        this.listLoading = false
        this.invocieList= res.data
      })
    },
    jumpDetailSubmisson(){
      if(this.multipleTypeText=='列表导出'){
        this.selectionOptionState=true
      }
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
    changeStatus(){
      this.$set(this.queryModuleData, 'cxFlag', null)
      this.$set(this.queryModuleData, 'purchaserName', null)
    },
    changeCompany({repCompId, fullname}) {
      if (this.queryModuleData.purchaserName == fullname) return
      this.$set(this.queryModuleData, 'cxFlag', null)
      this.$set(this.queryModuleData, 'purchaserName', fullname)
      this.handleSearch(1, false)
    },
    // 发票创建
    libraryCreate() {
      var deliveryType = this.queryModuleData.deliveryType ? this.queryModuleData.deliveryType : 0
      this.$refs.invoiceLibraryDetail.libraryCreate(deliveryType);
    },
    // 局部更新
    queryPartData(invIds){
      this.$commonUtils.partUpdate(
        this.invocieList,
        queryInvoiceLibrary,
        {
          argSearch:{
            pageSize: 1000
          },
          searchKey: 'invIds',
          key: 'invId',
          value: invIds.join(',')
        },
        (list) => {
          this.gridApi.refreshCells();
        }
      )
    },
    // 分批处理
    libraryBatchProcess() {
      let invIds = this.getSelectedRows().map(item => item.invId)
      if (invIds.length > 0) {
        this.$confirm('是否将选中项进行同批编号并合计金额？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          batchProcess({ invIds: invIds.join(',') }).then(res => {
            if (res.success){
              this.$message.success(res.message);
              this.queryPartData(invIds)
            }else{
              this.$message.error('错误');
            }
          })
        }).catch(() => {
          this.$message.info('已取消分批处理');
        });
      } else {
        this.$message.info('请选择分批处理发票！')
      }
    },
    // 批量修改发票所属
    libraryBatchPeople() {
      const invIds = this.getSelectedRows().map(item => item.invId)
      if (invIds){
        this.plEditView = true
      }
    },
    // 发票所属提交
    invoiceOwnershipSubmit() {
      const invIds = this.getSelectedRows().map(item => item.invId)
      batchModifyInvoice({
        invIds: invIds.join(','),
        ...this.invoiceOwnership
      }).then(res => {
        this.$message.success('修改成功!')
        this.queryPartData(invIds)
        this.plEditView = false
        this.invoiceOwnership = {}
      })
    },
    // 批量余额清零
    libraryBatchZeroing() {
      const invIds = this.getSelectedRows().map(item => item.invId)
      if (invIds.length > 0){
        this.$confirm('此操作将发票剩余可报销额清零, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          modifyInvoiceStatus({invIds: invIds.join(','), type: 2 }).then(res => {
            if (res.success){
              this.$message({
                type: 'success',
                message: res.message
              });
              this.queryPartData(invIds)
            }
          })
        }).catch(() => {
          this.$message.info('已取消报销额清零');
        });
      }else{
        this.$message.info('请选择发票！')
      }
    },
    // 发票编辑
    libraryEdit(row) {

      this.$nextTick(() => {
        this.$refs.invoiceLibraryDetail.libraryEdit(JSON.parse(JSON.stringify(row)));
      })
    },
    // 发票删除
    libraryDelete(row) {
      var invIds = ''
      if (row.invId){
        invIds = row.invId
      }else{
        var list = this.getSelectedRows()
        invIds = list.map(item => item.invId).join(',')
      }
      this.$confirm('此操作发票将被删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteInvoice({ invIds: invIds }).then(res=>{
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.handleSearch(1,false)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    // 发票状态更改
    changeInvoiceStatus(row) {
      var invStatus = (row.invStatus == 0) ? -1 : 0
      modifyInvoiceStatus({invId: row.invId, invStatus: invStatus }).then(res => {
        if (res.success){
          this.$message({
            type: 'success',
            message: res.message
          });
          this.queryList()
        }
      })
    },
    // 发票真伪更改
    modifyVeriCode(row) {
      var veriCode = (row.veriCode == 0) ? 2002 : 0
      modifyVeriCode({invId: row.invId, veriCode: veriCode }).then(res => {
        if (res.success){
          this.$message({
            type: 'success',
            message: res.message
          });
          this.queryList()
        }
      })
    },
    // 再次验真
    verifyAgain(row) {
      checkInvoice({invId: row.invId}).then(res => {
        if (res.success) {
          if (res.data.veriCode != -1 && res.data.veriCode != 0 && res.data.veriCode != -11) {
            this.$message.warning({
              message: res.data.veriMessge,
              duration: 8000
            })
          }else{
            this.$message({
              type: 'success',
              message: res.message
            });
          }
        }
        this.queryPartData([row.invId])
      })
    },
    changeCostWkg(){
      if (this.userGroupList.find(item=> item.wkgId == this.invoiceOwnership.wkgId)){
        var group = this.userGroupList.find(item=> item.wkgId == this.invoiceOwnership.wkgId)
        this.$set(this.invoiceOwnership,'domainId',group.domainId)
        this.$set(this.invoiceOwnership,'domainIdStr',group.domainName)
      }
    },
    queryWorkByUserId(state) {
      queryWorkByUserId({userId: this.invoiceOwnership.invUserId}).then(res => {
        if (res.data.groups && res.data.groups.length) {
          this.userGroupList = res.data.groups
          const uniqueGroups = Array.from(new Set(res.data.groups.map(item => item.wkgId)));
          this.selectGroupData = this.groupList.filter(ite => uniqueGroups.includes(ite.wkgId));
          if (state!='true') {
            this.$set(this.invoiceOwnership,'domainId',res.data.groups[0].domainId)
            this.$set(this.invoiceOwnership,'domainIdStr',res.data.groups[0].domainName)
            this.$set(this.invoiceOwnership,'wkgId',res.data.groups[0].wkgId)
          }
        }
      })
    },
    cancel(invId) {
      if (invId){
        this.multipleSelection = []
        this.listQuery.pageNo=1
        if (this.invocieList.find(item => item.invId == invId)){
          this.queryPartData([invId])
        }else{
          this.queryList()
        }
      }
    },
  },
  watch:{
    drawerState(n){
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
    // 设置表格高度
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
        const columnDisplay = ['totalAmount','totalTax','amountInFiguers'] //计算字段
        return this.$commonUtils.pinnedBottomRowData(this.gridApi.rowModel.rootNode.childrenAfterFilter.map(item=>item.data), this.columnDefs, columnDisplay)
      }
      return ''
    },
  },
  components:{
    Pagination,
    SelectOption,
    InvoiceLibraryDetail
  }
}
</script>

<style lang="scss" scoped>
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
    margin: 0px;
    display: flex; /*解决账单查看表单样式被撑开*/
  }

  /deep/ .postInfo-container-item {
    height: 100%;
    width: 100%;
  }

  /deep/ .el-form-item__label {
    /*background-color: #f9f9f9;*/
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
.first-row {
  border-top: 1px solid #d7d7d7;
}
</style>
