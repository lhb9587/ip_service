<template>
  <div class="main-list">
    <div class="hrm-search">
      <div class="header-search">
        <headerSearch ref="headersearch" :name="$options.name" @search="queryRecordList" :bussId="bussId"></headerSearch>
      </div>
      <div style="display: inline;margin-right: 10px;float: right;">
        <el-button type="danger" size="small" plain @click="handleDelete">批量删除</el-button>
      </div>
    </div>
    <section>
      <div class="w-table">
        <!-- <div  class="dots" @click="handleCheckboxState">
          <span class="dot">.</span>
          <span class="dot">.</span>
          <span class="dot">.</span>
        </div> -->
        <el-button class="brush_right" :class="brushRightHasFilter?'red':''" @click="brushRight" type="text" icon="el-icon-brush" ></el-button>
        <AgGridVue :style="{width:'100%',height: clientHeight+'px'}"
                   class="ag-theme-balham"
                   :columnDefs="columnDefs"
                   :rowData="list"
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
                   :groupSelectsChildren="true"
                   :suppressAggFuncInHeader="true"
                   :frameworkComponents="frameworkComponents"
                   @drop.native.stop.prevent="enentDrop($event)"
                   @dragover.native.stop.prevent="hoverState=true"
                   @dragleave.native.stop.prevent="hoverState=false"
                   @dragenter.native.stop.prevent="hoverState=true"
                   :rowHeight="34"
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

    <el-dialog title="年中奖信息" :visible.sync="saveVisible" :close-on-click-modal="false" width="30%">
      <MidYearBonusSave v-if="saveVisible" :data-info="dataInfo" @closeDialog="saveDialog"></MidYearBonusSave>
    </el-dialog>
  </div>
</template>

<script>
import SelectOption from '@/views/workbench/case/components/SelectOption'
import Pagination from '@/components/Pagination'; // secondary package based on el-pagination
import { selectColumn, queryPreference, delPreference, savePreference} from '@/api/caseList.js'
import { queryTalentWinningBonusInfo, deleteTalentWinningBonusInfo } from '@/api/hrmList.js'
import Summary from "@/components/Summary/index.js";
import headerSearch from '@/components/HeaderSearch';
import MidYearBonusSave from './components/MidYearBonusSave';
import {formatAmount} from '@/utils/filters'
export default {
  name: 'midYearList',
  data() {
    var tableHeader=[]
    if(localStorage.getItem('tableHeader')&&JSON.parse(localStorage.getItem('tableHeader')).find(item=>item.name==this.$options.name)){
      tableHeader = JSON.parse(localStorage.getItem('tableHeader')).find(item => item.name == this.$options.name).tableHeader
    }
    return {
      hoverState:false,
      curFile:[],
      list:[], //表格数据
      brushRightHasFilter:false,
      frameworkComponents:{
        CountStatusBarComponent:Summary
      },
      defaultcolumnDefs:[
        {
          headerName: '序号',
          field: 'sid',
          width: 80,
          enableRowGroup: false, // 设置为false，可隐藏顶部行组面板
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
      gridOptions:{
        statusBar: {
          statusPanels: [
            { statusPanel: 'agTotalAndFilteredRowCountComponent', align: 'left' },
            { statusPanel: 'agSelectedRowCountComponent', align: 'left' } // 总和过滤的行数组件
          ]
        },
      },
      pageSizesList: [20, 50, 200, 500, 1000, 5000, 10000],
      listLoading:false,
      // activeNames:[],
      listQuery: {
        pageNo: 0,
        pageSize:  JSON.parse(localStorage.getItem('pageSize'))?JSON.parse(localStorage.getItem('pageSize')).find(item=>item.name==this.$route.name)?JSON.parse(localStorage.getItem('pageSize')).find(item=>item.name==this.$route.name).pageSize:100:100
      },
      queryModuleData: {}, //搜索条件
      total:0, //全部数
      multipleSelection:[],
      dialogVisible: false,
      operationState:1,
      examineState:false,
      checkboxState:false, //复选框状态
      userId: this.$store.getters.userId,
      bussId: 202,
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
      filterText:'',
      filterDataSum:{},
      defaultParams:{
        value: 'deptCode',
        label: 'kingDeeGroupName',
        checkStrictly: true,
        children: 'children'
      },
      dataInfo: [],
      saveVisible: false
    }
  },
  created() {
    this.getAllWfs()
  },
  methods: {
    saveDialog() {
      this.saveVisible = false
      this.handleSearch()
    },
    // 附件下载
    downLoad(data) {
      const url = data
      const downData = {
        url: `ipdoc/${url}`,
        success() {
          // notify.close()
        }
      }
      this.$commonUtils.downLoadAll(downData)
    },
    queryRecordList() {
      this.queryModuleData = JSON.parse(localStorage.getItem('queryModuleData')) ? JSON.parse(localStorage.getItem('queryModuleData')).find(item => item.name == this.$options.name) ? JSON.parse(localStorage.getItem('queryModuleData')).find(item => item.name == this.$options.name).queryModuleData : {} : {}
      this.queryList()
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
      if (params.colDef.field === 'sid') {
        return params.rowIndex + 1
      }else if(params.colDef.field === 'bonusAmount'){
        return `<span title="${params.value ? formatAmount(params.value) : 0}" style="float: right">${params.value ? formatAmount(params.value) : 0}</span>`
      }
      return `<span title="${params.value}">${params.value ? params.value : ''}</span>`
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
      // this.$router.push('/workbench/hrm/staff_management_detail/'+params.data.talentCode)
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
      this.$store.commit('caseInformation/SET_SUMMARYDATA',{name:'borrow_list',count:data})
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
      if(this.list.length){
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
    // 获取菜单项列表
    getRowContextmenuList(row){
      let list = []
      list = [
        { name: '复制', action: 'copy' },
        { name: '修改', action: 'edit' },
        { name: '删除', action: 'handleDelete' },
      ]
      return list.filter(item=> {
        if (item.permissions) {
          return this.$store.getters.permissions.includes(item.permissions)
        }else if(item.permissionsData){
          return item.permissionsData.some(itm=> this.$store.getters.permissions.includes(itm.premission)&&row.taskNo==itm.taskNo)
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
    // 修改
    edit(row) {
      this.saveVisible = true
      this.dataInfo = row
    },
    // 删除
    handleDelete(row) {
      var ids = ''
      if (row && row.id){
        ids = row.id
      }else{
        var list = this.getSelectedRows()
        ids = list.map(item => item.id).join(',')
      }
      this.$confirm('此操作删除年中奖信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteTalentWinningBonusInfo({ idList: ids }).then(res=>{
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.handleSearch()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
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
    handleSearch(val){
      this.multipleSelection=[]
      this.listQuery.pageNo=1
      this.queryRecordList()
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
        this.$nextTick(() => {
          this.columnDefs.forEach(item => {
            this.columnApi.getColumn(item.field) && this.columnApi.getColumn(item.field).addEventListener('menuVisibleChanged', () => {
              if (document.querySelector(".ag-tabs")) {
                new this.$DraginResize(document.querySelector(".ag-set-filter-list"), {
                  clone: true,
                  end(info) {
                    if (info.dir == 'ver') {
                      this.elem.style.height = info.height + 'px';
                    } else if (info.dir == 'hor') {
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
    // 获取人员数据列表
    queryList(){
      const data = {
        pageNo: this.listQuery.pageNo,
        pageSize: this.listQuery.pageSize
      }
      this.listLoading = true
      const querData = Object.assign(data, this.queryModuleData)

      this.exportQueryModel = JSON.stringify(querData)

      queryTalentWinningBonusInfo(this.$commonUtils.cleanNullAttr(querData)).then(res=>{
        this.total=res.total
        this.listLoading = false
        this.list= res.data
      })
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
            this.list.push({})
            this.list.pop()
          })
        });
      }
    },
    cancel() {
      this.multipleSelection = []
      this.listQuery.pageNo=1
      this.queryList()
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
    inputWid() {
      return function (value) {
        if (!value) {
          return '110px'
        } else {
          // 有内容，字符串长度*字体大小
          return (String(value).length * 13 + 50) + 'px'
        }
      }
    },
    // 设置计算列表统计总计
    pinnedBottomRowData() {
      if (this.gridApi.rowModel) {
        const columnDisplay = ['bonusAmount'] //计算字段
        return this.$commonUtils.pinnedBottomRowData(this.gridApi.rowModel.rootNode.childrenAfterFilter.map(item=>item.data), this.columnDefs, columnDisplay)
      }
      return ''
    },
  },
  components:{
    Pagination,
    SelectOption,
    headerSearch,
    MidYearBonusSave
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-dialog__body{
  padding: 0 20px 20px 20px
}
/deep/ .ag-theme-balham .ag-cell{
  line-height: 34px;
}
.hrm-container {
  width: 100%;
  background-color: #F2F2F2;
}
.hrm-header{
  width: 100%;
  height: 50px;
  background-color: #FFFFFF;
  color: #333;
  span{
    font-size: 18px;
    line-height: 50px;
    font-weight: bold;
  }
  .right-button{
    margin-top: 6px;
    float: right;
  }
  button{
    font-size: 16px;
    i{
      width: 20px;
      border-radius: 3px;
      background: #409eff;
      color: #fff
    }
  }
  .notice{
    font-size: 12px;
    display: initial;
    border-radius: 18px;
    background-color: #52A0F5;
    width: 50px;
    height: 22px;
    text-align: center;
    vertical-align: middle;
    color: #FFFFFF;
  }
}
.hrm-main{
  width:100%;
  padding: 15px;
  .main-list{
    width: 100%;
    padding: 0 10px 10px 10px;
    background-color: #FFFFFF;
  }
}
.hrm-search{
  font-size: 14px;
  height: 46px;
  line-height: 46px;
  width: 100%;
  a{
    color: #52A0F5;
  }
  i{
    padding-right: 5px;
  }
  .header-search{
    float: left;
    padding-top: 7px;
    margin-left: -10px;
  }
  .el-select /deep/ .el-input input{
    //width: 90px;
    font-weight: bold;
    border: 0px !important;
  }
  .el-cascader {
    /deep/ .el-cascader__label{
      font-weight: bold;
    }
    /deep/ .el-input input {
      width: 300px;
      font-weight: bold;
      border: 0px !important;
    }
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
/deep/ .button-group-search{
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
      display: block;
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
  top: 17px;
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
</style>
