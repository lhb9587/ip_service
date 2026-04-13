<template>
  <div>
    <ViewsSwitching class="ViewsSwitching" @changePattern="changePattern"></ViewsSwitching>
    <el-form size="small" label-width="136px">
      <el-row>
        <el-form-item label="案件文号:" class="twoInputWarp">
          <el-input v-model="query.agentNumStart " placeholder="请输入内容" @change="changeTextRange" clearable></el-input>
          <span>至</span>
          <el-input v-model="query.agentNumEnd" placeholder="请输入内容" clearable></el-input>
        </el-form-item>
        <el-form-item label="客户">
          <el-select
            v-model="query.custIdArray"
            ref="custSelect"
            filterable
            multiple
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
        <el-form-item label="工时日期:" class="twoInputWarp">
          <DataPicker v-model="query.workDateArray"></DataPicker>
        </el-form-item>
        <div class="buttonWrap">
          <el-button size="small" @click="handleSearch" type="primary" style="margin-top: 3px;">查询</el-button>
<!--          <el-button size="small" @click="selectionState = true" type="primary">审核</el-button>-->
          <el-button size="small" type="primary" style="margin-right: 100px;" @click="writeOffBill">核销进账单</el-button>
        </div>
      </el-row>
    </el-form>
    <div>
      <div style="display: flex; margin-bottom: 10px;">
        <TitleTotal :total="total"/>
        <div style="margin-left: 15px">
          <el-button  type="primary" class="exactButton" size="mini" @click="gridApi.deselectAll()">清除所选</el-button>
        </div>
        <div style="margin-left: 15px" v-if="selectionState">
          <el-button size="mini" type="primary" @click="auditMore">批量审核
          </el-button>
          <el-button size="mini" type="primary" @click="selectionState=false">取消</el-button>
        </div>
      </div>
      <!-- <el-table
        ref="todoTaskMultiple"
        :data="hourList"
        fit
        empty-text="暂无数据"
        highlight-current-row
        current-row-key
        style="width: 100%;"
        :height="clientHeight"
        @select="handleSelectionChange"
        @select-all="handleSelectionAll"
      >
        <el-table-column
          type="selection"
          width="30"
          class="selection"
          v-if="selectionState"
        >
        </el-table-column>
        <el-table-column
          type="index"
          width="50"
          align="left"
          label="序号"
        >
        </el-table-column>
        <el-table-column v-for="(item,index) in tableDefaultList" :key="index" :width="item.value==='index'?50:'auto'"
                         :label="item.title" align="left" :prop="item.value"
                         :filters="unique(hourList.map(i=>({text:i[item.value],value:i[item.value]})),'value').filter(ii=>ii.value)"
                         :filter-method="filterHandler"
                         sortable
                         filter-placement="bottom-start">
          <template slot-scope="scope">
            <span :title="scope.row[item.value]">{{scope.row[item.value]}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="left" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="handleTask(scope.row)">处理
            </el-button>
          </template>
        </el-table-column>
      </el-table> -->



      <div class="work-table content_wrap">
        <div class="left_wrap" :style="{width: seeCaseOff&&pattern ? leftWrapWidth:'100%'}" style="position: relative;">
          <el-button class="brush_right" :class="brushRightHasFilter?'red':''" @click="brushRight" type="text" icon="el-icon-brush" ></el-button>
          <div>
            <!-- 待审工时列表重构 -->
            <AgGridVue
              class="ag-theme-balham"
              suppressAutoSize
              rowGroupPanelShow="always"
              @grid-ready="onGridReady"
              :style="{width:'100%',height: clientHeight+'px'}"
              :columnDefs="tableTitleList"
              :rowData="hourList"
              :localeText="$store.state.caseInformation.localeText"
              :frameworkComponents="frameworkComponents"
              :gridOptions="gridOptions"
              @cellClicked="onCellClicked"
              @filterChanged="refreshEvenRowsCurrencyData"
              :getContextMenuItems="getContextMenuItems"
              :autoGroupColumnDef="autoGroupColumnDef"
              :defaultColDef="defaultColDef"
              :rowSelection='rowSelection'
              :suppressDragLeaveHidesColumns="true"
              :groupDefaultExpanded='-1'
              :animateRows="true"
            >
            </AgGridVue>
          </div>
        </div>
        <div v-if="seeCaseOff && pattern" class="right_wrap" :style="{position:'relative','margin-left':currentCaseId&&pattern?'10px' :'0',height:clientHeight+'px', 'margin-top': '-'+clientHeight+'px'}">
          <seeCaseDetail v-if="currentCaseId&&pattern" :style="cssVar" :taskType="taskType"  :case-id="currentCaseId" :sign="1" :backsign="0"></seeCaseDetail>
        </div>
      </div>

      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.pageNo"
        :limit.sync="listQuery.pageSize"
        @pagination="queryList"
        :pageSizes="pageSizesList"
      />
    </div>

    <el-dialog
      title="工时审核"
      append-to-body
      :close-on-click-modal="false"
      :visible.sync="workHourView"
      width="45%"
      height="80%"
      class="abow_dialog"
    >
      <create-work-hour :hoursId="hoursId" type="audit" @refreshList="queryList" v-if="workHourView" @closeDialog="workHourView = false"></create-work-hour>
    </el-dialog>

    <!--   工时改签   -->
    <el-dialog :close-on-click-modal="false" :show-close="false" :visible.sync="rebookView" title="改签" width="50%">
      <div class="rebookDiv">
        <div class="rebookTitle">确认要改签这些工时吗？请指定您要改签的人</div>
        <div class="rebookBody">
          <div class="bodyRight">
            <div class="rightTitle">设置改签人员</div>
            <div class="rightSearch">
              <el-input style="margin-top: 5px;margin-bottom:5px" v-model="name" v-debounce:searchName="'input',300" size="small" placeholder="搜索部门名称或人员姓名">
                <template slot="prepend"><span class="el-icon-search"></span></template>
              </el-input>
            </div>
            <div class="rightTable">
              <el-table @row-click="rowClick" size="mini" :data="list" border fit empty-text="暂无数据" :row-class-name="rowClassName"
                        current-row-key
                        style="width: 100%;">
                <el-table-column label="部门" prop="deptName"></el-table-column>
                <el-table-column label="姓名" prop="fullname"></el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </div>
      <div class="fl-ac-jc" style="padding: 20px 0">
        <el-button size="small" @click="closeRebookDialog()">取 消</el-button>
        <el-button size="small" type="primary" @click="submitRebook">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog v-if="billDetailState" :before-close="beforeBillClose" top title="账单详情" :close-on-click-modal="false" :visible.sync="billDetailState" width="80%">
      <billDetail ref="billdetail" v-if="billDetailState" :type="type" :billData="billData" @cancel="cancelMethod"></billDetail>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" :before-close="closeWriteOffBill" :show-close="true" :visible.sync="writeOffView" title="核销进账单" width="60%">
      <div style="width: 100%">
        <el-table
          ref="writeTable"
          :data="writeOffHourList"
          tooltip-effect="dark"
          style="width: 100%"
          class="writeTable"
          @select="handleWriteOffBillSelection"
        >
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            type="index"
            width="50">
          </el-table-column>
          <el-table-column
            label="账单号"
            width="120">
            <template slot-scope="scope"><span class="pointer" @click="openBillView(scope.row)">{{ scope.row.billNo }}</span></template>
          </el-table-column>
          <el-table-column
            prop="belongToDate"
            label="账单所属月"
            width="120">
          </el-table-column>
          <el-table-column
            prop="caseDesc"
            label="账单描述"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="billSum"
            label="总金额"
            width="120">
          </el-table-column>
          <el-table-column
            prop="wfStatus"
            label="状态"
            width="120">
          </el-table-column>
          <el-table-column
            prop="billUserIdString"
            label="开单人"
            width="120">
          </el-table-column>
        </el-table>
      </div>
      <div class="fl-ac-jc" style="padding: 20px 0">
        <el-button size="small" @click="closeWriteOffBill()">取 消</el-button>
        <el-button size="small" type="primary" @click="writeOffHourBill">核 销</el-button>
      </div>
    </el-dialog>
    <el-dialog
    :title="title"
    append-to-body
    :close-on-click-modal="false"
    :visible.sync="workHourView"
    width="45%"
    height="80%"
    class="abow_dialog"
    >
      <create-work-hour :hoursId="hoursId" :type="dialogType" @refreshList="queryList" v-if="workHourView && dialogType != 'view'" @closeDialog="workHourView = false"></create-work-hour>
    </el-dialog>
  </div>
</template>

<script>
import CreateWorkHour from "../../workTime/components/CreateWorkHour";
import Pagination from '@/components/Pagination'
import {
  auditWorkHours, checkPermission,
  queryCustomerNameId,
  queryWorkHours,
  queryWorkHourTask, queryWorkHourToBillTask,
  updateWorkHourTasker
} from '../../../../api/caseList'
import Summary from "@/components/Summary/index.js";
import WorkTimeBtn from "./WorkTimeBtn.vue";
import ViewsSwitching from '@/views/workbench/case/components/ViewsSwitching'
import {mapState} from "vuex";
import seeCaseDetail from '@/views/workbench/case/components/ManualIdentification/seeCaseDetail'
import { hxWorkHoursToBill, queryCaseBillList } from '@/api/billApi'
import BillDetail from '@/views/workbench/finance/billviews/components/billDetail.vue'

export default {
  name: "WaitAuditWorkTime",
  components: {
    BillDetail,
    Pagination,
    CreateWorkHour,
    ViewsSwitching,
    WorkTimeBtn,
    seeCaseDetail,
  },
  computed: {
    cssVar() {
      return {
        '--height': document.documentElement.clientHeight-300 + 'px'
      }
    },
    ...mapState({
      'pattern': state => state.user.pattern
    }),
    clientHeight() {
      return document.documentElement.clientHeight-300
    },
  },
  data() {
    return {
      title: '',
      dialogType: '',
      customerNameIdList: [],
      taskUserId: '',
      name: '',
      list: [],
      rebookUserIdList: [],
      rebookView: false,
      tablehoursId: null,// 工时id
      brushRightHasFilter: false,
      columnDefs: [],
      rowData: [],
      leftWrapWidth: '60%',
      seeCaseOffcount: 0,
      seeCaseOff: false,
      checkboxState:false,
      columnApi: null,
      gridApi: null,
      showDialog: false,
      selectedRowData: null,
      rowSelection: null,
      selectionState: false,
      workHourView: false,
      hoursId: '',
      hoursIdList: [],
      editStatus: false,
      isSubmit: false,
      isExamine: false,
      customerData: {},
      custTaskView: false,
      data: {id: "-1", value: "简称", value1: "国籍", value2: "全称"},
      query: {
        agentNumStart: '',
        agentNumEnd: '',
        custIdArray: [],
        workDateArray: ['', '']
      },
      customerList: [],
      total: 0,
      hourList: [],
      listQuery: {
        pageNo: 1,
        pageSize: JSON.parse(localStorage.getItem('pageSize')) ? JSON.parse(localStorage.getItem('pageSize')).find(item => item.name == this.$route.name) ? JSON.parse(localStorage.getItem('pageSize')).find(item => item.name == this.$route.name).pageSize : 10 : 10
      },
      pageSizesList: [10, 50, 100, 200, 300, 400, 500],
      tableDefaultList: [
        { title: '案件文号', value: 'agentNum' },
        { title: '案件名称', value: 'caseName'},
        { title: '案件类型', value: 'caseType'},
        { title: '客户', value: 'custName'},
        { title: '员工', value: 'whUserName'},
        { title: '工时日期', value: 'hourDate'},
        { title: '工时内容', value: 'workContent'},
        { title: '核定金额', value: 'approvedAmountCust'},
        { title: '职位', value: 'positionName'},
        { title: '状态', value: 'wfStatus'},
        { title: '核定工时', value: 'approvedTime'},
        { title: '核定费率', value: 'billRate'},
      ],
      taskType: null,
      currentId: '',
      currentCaseId: '',
      autoGroupColumnDef: null,
      defaultColDef: {
        flex: 1,
        filter: true,
        minWidth: 100,
        sortable: true,
        resizable: true,
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        hide: false
      },
      tableTitleList:[
        {
          headerName: '客户',
          rowGroup: true,
          enableRowGroup: true,
          field: 'custName',
          cellRenderer:this.cellRenderer,
          resizable: true,
          autoHeight: true,
          hide: false,
          menuTabs: ['filterMenuTab','generalMenuTab','columnsMenuTab'],
        },
        {
          headerName: '案件文号',
          rowGroup: true,
          enableRowGroup: true,
          field: 'agentNum',
          cellRenderer:this.cellRenderer,
          resizable: true,
          autoHeight: true,
          hide: false,
          sort: 'asc',
          menuTabs: ['filterMenuTab','generalMenuTab','columnsMenuTab'],
        },
        {
          headerName: '案件名称',
          field: 'caseName',
          cellRenderer:this.cellRenderer,
          resizable: true,
          autoHeight: true,
          menuTabs: ['filterMenuTab','generalMenuTab','columnsMenuTab'],
          hide: false
        },
        {
          headerName: '案件类型',
          field: 'caseType',
          cellRenderer:this.cellRenderer,
          resizable: true,
          autoHeight: true,
          menuTabs: ['filterMenuTab','generalMenuTab','columnsMenuTab'],
          hide: false
        },
        {
          headerName: '员工',
          field: 'whUserName',
          cellRenderer:this.cellRenderer,
          resizable: true,
          autoHeight: true,
          menuTabs: ['filterMenuTab','generalMenuTab','columnsMenuTab'],
          hide: false
        },
        {
          headerName: '工时日期',
          field: 'hourDate',
          cellRenderer:this.cellRenderer,
          resizable: true,
          autoHeight: true,
          menuTabs: ['filterMenuTab','generalMenuTab','columnsMenuTab'],
          hide: false
        },
        {
          headerName: '工时内容',
          field: 'workContent',
          tooltipField: 'workContent',
          cellRenderer:this.cellRenderer,
          resizable: true,
          autoHeight: true,
          menuTabs: ['filterMenuTab','generalMenuTab','columnsMenuTab'],
        },
        {
          headerName: '核定金额',
          field: 'approvedAmountCust',
          cellRenderer:this.cellRenderer,
          resizable: true,
          autoHeight: true,
          menuTabs: ['filterMenuTab','generalMenuTab','columnsMenuTab'],
        },
        {
          headerName: '职位',
          field: 'positionName',
          cellRenderer:this.cellRenderer,
          resizable: true,
          autoHeight: true,
          menuTabs: ['filterMenuTab','generalMenuTab','columnsMenuTab'],
        },
        {
          headerName: '状态',
          field: 'wfStatus',
          cellRenderer:this.cellRenderer,
          resizable: true,
          autoHeight: true,
          menuTabs: ['filterMenuTab','generalMenuTab','columnsMenuTab'],
        },
        {
          headerName: '核定工时',
          field: 'approvedTime',
          cellRenderer:this.cellRenderer,
          resizable: true,
          autoHeight: true,
          menuTabs: ['filterMenuTab','generalMenuTab','columnsMenuTab'],
        },
        {
          headerName: '核定费率',
          field: 'billRate',
          cellRenderer:this.cellRenderer,
          resizable: true,
          autoHeight: true,
          menuTabs: ['filterMenuTab','generalMenuTab','columnsMenuTab'],
        },
        {
          headerName: '账单总金额',
          field: 'billSum',
          cellRenderer:this.cellRenderer,
          resizable: true,
          autoHeight: true,
          menuTabs: ['filterMenuTab','generalMenuTab','columnsMenuTab'],
        },
        {
          headerName: '案件阶段',
          field: 'stageName',
          cellRenderer:this.cellRenderer,
          resizable: true,
          autoHeight: true,
          menuTabs: ['filterMenuTab','generalMenuTab','columnsMenuTab'],
        },
        {
          headerName: '案件报价',
          field: 'caseOffer',
          cellRenderer:this.cellRenderer,
          resizable: true,
          autoHeight: true,
          menuTabs: ['filterMenuTab','generalMenuTab','columnsMenuTab'],
        },
        // {
        //   headerName:'操作',
        //   field:'operation',
        //   autoHeight: true,
        //   resizable: true,
        //   pinned: 'right',
        //   width: 100,
        //   cellRenderer:this.cellRenderer,
        // }
      ],
      gridOptions:{
        statusBar: {
          statusPanels: [
            { statusPanel: 'agSelectedRowCountComponent', align: 'left' },
            { statusPanel: 'CountStatusBarComponent' },
          ]
        },
        //floatingFilter: true,
      },
      frameworkComponents:{
        CountStatusBarComponent:Summary
      },
      writeOffHourIdList: [],
      writeOffHourList: [],
      writeOffView: false,
      hxBillData: {},
      type: 'view',
      billDetailState: false,
      billData: {},

    }
  },
  created() {
    this.queryList()
    this.rowSelection = 'multiple'
    this.autoGroupColumnDef = {
      minWidth: 200,
    };
  },
  methods: {
    modifyTaskHours(data) {
      let hoursId = data.hoursId
      checkPermission({hoursId}).then(res=> {
        if (res.data.modify == 0) {
          this.$message.error('该工时您无法修改')
        }else{
          // this.sign = '修改'
          // this.flag = data.wfStatus
          // this.rowDataForm = JSON.parse(JSON.stringify(data))
          // this.editWorkTime = true
          // this.editLook = true
          this.hoursId = data.hoursId
          this.workHourView = true
          this.title = '修改工时'
          this.dialogType = 'edit'
        }
      })
      // this.onlyLook = false

    },
    cancelMethod() {
      this.billDetailState = false
    },
    beforeBillClose(done) {
      this.$refs.billdetail.cancel(1)
      done();
    },
    writeOffHourBill() {
      if (Object.keys(this.hxBillData).length === 0) {
        return this.$message.error('请选择账单')
      }
      hxWorkHoursToBill({
        billId: this.hxBillData.billId,
        hoursIdList: this.writeOffHourIdList
      }).then(res => {
        this.$message.success('核销成功！')
        this.closeWriteOffBill()
        this.queryList()
      })
    },
    closeWriteOffBill() {
      this.writeOffView = false
      this.writeOffHourIdList = []
      this.writeOffHourList = []
      this.hxBillData = {}
    },
    openBillView(row) {
      this.billData = {
        billId: row.billId
      }
      this.type = 'view'
      this.billDetailState = true
    },
    handleWriteOffBillSelection(selection, row) {
      this.$refs.writeTable.clearSelection()
      this.$refs.writeTable.toggleRowSelection(row, true)
      this.hxBillData = JSON.parse(JSON.stringify(row))
    },
    writeOffBill() { // 核销进账单
      if (!this.getSelectedRows().length) {
        this.$message.error('请选择工时!')
        return
      }
      if (this.getSelectedRows().filter(item => !item.caseId).length) {
        this.$message.error('请选择案件工时!')
        return
      }
      if ([...new Set(this.getSelectedRows().filter(item => item.caseId).map(item => item.caseId))].length > 1) {
        this.$message.error('只能选择同一案件下的工时！!')
        return
      }
      if (this.getSelectedRows().filter(item => item.wfStatus !== '未核销').length) {
        this.$message.error('只能选择未核销的工时!')
        return
      }
      if(this.getSelectedRows().find(item => item.auditUserName != this.$store.getters.name)){
        this.$message.error(`您不是所选工时的审核任务人`)
        return
      }
      this.writeOffHourIdList = this.getSelectedRows().map(item => item.hoursId)
      queryCaseBillList({
        caseId: this.getSelectedRows()[0].caseId
      }).then(res => {
        this.writeOffHourList = res.data || []
        this.writeOffView = true
      })
    },
    onCellClicked(params) {
      if (params.colDef.headerName === "Group" && params.node.field === 'agentNum') {
        const agentNum = params.value
        this.gridApi.forEachNode(node => {
          node.setSelected(node.data && node.data.agentNum === agentNum);
        })
      }
    },
    queryCustomerList(query){
      if(query !== ''){
        queryCustomerNameId({ pageNo: 1, pageSize: 100,keyword:query }).then(res=>{
          this.customerNameIdList=res.data
        })
      }
    },
    getSelectedRows() {
      if(this.gridApi){
        const selectedNodes = this.gridApi.getSelectedNodes();
        const selectedData = selectedNodes.map(node => node.data);
        return selectedData
      }else {
        return []
      }
    },
    submitRebook() {
      if (!this.taskUserId) {
        this.$message.error('请选择员工！')
        return
      }
      updateWorkHourTasker({
        hoursIdList: this.getSelectedRows().map(item => item.hoursId),
        taskUserId: this.taskUserId
      }).then(res => {
        this.$message.success('改签成功！')
        this.closeRebookDialog()
        this.queryList()
      })
    },
    closeRebookDialog() {
      this.rebookView = false
      this.taskUserId = ''
      this.list = []
      this.name = ''
    },
    rebook() {
      if(this.getSelectedRows().length < 1){
        this.$message.error('请选择需要改签的工时！')
        return
      }
      if (this.getSelectedRows().find(item => !item.taskUserName || item.taskUserName && !item.taskUserName.includes(this.$store.getters.name))) {
        this.$message.error('您不是审核任务人，不能改签')
        return
      }
      this.rebookView = true
    },
    searchName(value) {
      if (!value.target.value) return
      this.taskUserId = ''
      this.list = this.$store.getters.userList.filter(item => (item.deptName + '~' + item.fullname).includes(value.target.value))
      if (this.list.length === 1) {
        this.name = this.list[0].fullname
        this.taskUserId = this.list[0].userId || ''
      }
    },
    rowClick(row) {
      this.name = row.fullname
      this.taskUserId = row.userId || ''
    },
    rowClassName({row, rowIndex}){
      if(row.userId == this.taskUserId){
        return 'currentClick'
      }
      return ''
    },
    //ag-grid
    brushRight(){
      let data =   this.$commonUtils.getFilterModel(this.$options.name+this.$route.name,'FilterModel')
      let arr =  Object.keys(data)
      arr.forEach(item=>{
        this.gridApi.destroyFilter(item)
      })
    },
    // getSummary(list){
    //   let data={
    //     time: this.getSum(list,'time','工时'),
    //     approvedTime: this.getSum(list,'approvedTime','工时'),
    //     amount:this.getSum(list,'amount'),
    //     approvedAmountCust: this.getSum(list,'approvedAmountCust'),
    //   }
    //   this.$store.commit('caseInformation/SET_SUMMARYDATA',{name:'workTime',count:data})
    // },
    refreshEvenRowsCurrencyData(params) {
      //  this.getSummary(this.gridApi.rowModel.rootNode.childrenAfterFilter.map(item=>item.data))
      this.currentPageSize = params.api.rowModel.rootNode.allChildrenCount
      if(!params.columnApi.columnController.groupAutoColumns) {
        this.gridApi.forEachNode(rowNode => {
          rowNode.setDataValue(
            'sid',
            rowNode.rowIndex + 1)
        });
      }
      if(this.hourList.length){
        // this.$commonUtils.saveFilterModel(this.$options.name+this.$route.name,'FilterModel',this.gridApi.getFilterModel())
        if(params.type=="filterChanged"){
          if (this.gridApi.getSelectedNodes().length) {
            this.gridApi.getSelectedNodes().forEach(rowNode => {
              if (!this.gridApi.rowModel.rootNode.childrenAfterFilter.find(item => item.id === rowNode.id)) {
                rowNode.setSelected(false)
              }
            })
          }
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
    getContextMenuItems(params){
      return this.getRowContextmenuList(params.node.data).map(item=>({
        name: item.name,
        action: () =>{
          this[item.action](params.node.data,params.value)
        }
      }))
      if(!params.node.data){
        return []
      }
    },
    onGridReady(params) {
      this.gridparams=params
      this.gridApi = params.api;
      this.columnApi = params.columnApi;
    },
    getRowContextmenuList(row,){
      return [
        { name:'复制',action: 'copy' },
        { name: '修改', action: 'modifyTaskHours'},
      ].filter(item=> {
        if (item.auditFlag) {
          return item.auditFlag == row.auditFlag
        }else if(item.permission){
          return true
        }else{
          return true
        }
      })
    },
    copy(row,value){
      if(value){
        this.$copyText(value).then(
          res => {
          })
      }else {
        this.$copyText(event.target.innerText).then(
          res => {
          })
      }
    },
    changePattern(e) {
      if (e === 1) {
        this.$store.commit('user/SET_PATTERN', false)
      } else {
        this.$store.commit('user/SET_PATTERN', true)
      }
    },
    cellRenderer(params){
      if(params.colDef.field != 'agentNum') {
        const h = this.$createElement;
        let vnode = h(WorkTimeBtn,{
          props: {
            paramsData: params,
          },
          on: {
            'handleTask': val => {
              this.handleTask(val)
            },
            'jumpDetails': data =>{
              const routeUrl = this.$router.resolve({ path: '/workbench/case/seeCaseDetail/' + data.val.caseId, query:data.query})
              window.open(routeUrl.href, "_blank");
            }
          }
        })
        const div = document.createElement('div');
        this.__patch__(div,vnode,true,false)
        return  div
      }
      if (params.colDef.field == 'agentNum') {
        var eDiv1 = document.createElement('div');
        eDiv1.innerHTML = `<span class="btn-simple1" style="cursor: pointer;color: #00b0ff" title="${params.value}">${params.value ? params.value : ''}</span>`
        var eButton1 = eDiv1.querySelectorAll('.btn-simple1')[0];
        eButton1.addEventListener('click', () => {
          if (params.data) {
            this.clickAgentNum(params)
            if(params.data.hoursId==this.tablehoursId){
              this.seeCaseOff = !this.seeCaseOff
            }else{
              this.tablehoursId  = params.data.hoursId
              this.seeCaseOff = true
            }

          }
        });
        return eDiv1;
      }
    },
    clickAgentNum(params) {
      if (params.data['hoursId'] != this.currentId) {
        this.currentId = ''
        this.currentCaseId = ''
        this.$nextTick(() => {
          if (params.data['caseId']) {
            switch (params.data['domain']) {
              case '商标':
                this.taskType = 1
                break
              case '诉讼':
                this.taskType = 2
                break
              case '保护':
                this.taskType = 3
                break
              case '专利':
                this.taskType = 4
                break
              case '域名':
                this.taskType = 5
                break
              case '著作权':
                this.taskType = 6
                break
              case '非诉':
                this.taskType = 7
                break
              default:
                this.taskType = 1
            }
            this.currentId = params.data['hoursId']
            this.currentCaseId = params.data['caseId']
          }
        })
      }
    },


    //原始表格
    handleSelectionAll(val) {
      val = val.filter(item => item !== undefined)
      this.hoursIdList = val.map(item => ({
        approvedTime: item.approvedTime || item.time,
        hoursId: item.hoursId,
        time: item.time,
        approvedDesc: item.workContent,
        billRate: item.criterionRate,
        approvedAmountCust: item.amount
      }))
    },
    handleSelectionChange(list) {
      list = list.filter(item => item != undefined)
      this.hoursIdList = list.map(item => ({
        approvedTime: item.approvedTime || item.time,
        hoursId: item.hoursId,
        time: item.time,
        approvedDesc: item.workContent,
        billRate: item.criterionRate,
        approvedAmountCust: item.amount
      }))
    },
    auditMore() {
      this.hoursIdList = this.gridOptions.api.getSelectedRows().map(item => ({
        approvedTime: item.approvedTime || item.time,
        hoursId: item.hoursId,
        time: item.time,
        approvedDesc: item.workContent,
        billRate: item.criterionRate,
        approvedAmountCust: item.amount,
        caseId: item.caseId || undefined
      }))
      if (!this.hoursIdList.length) {
        this.$message.error('请选择工时！')
        return
      }
      auditWorkHours({workHoursList: this.hoursIdList, result: 1}).then(() => {
        this.$message.success('审核成功！')
        this.queryList()
        this.selectionState = false
        this.hoursIdList = []
      })
    },
    changeTextRange(e) {
      this.$set(this.query, "agentNumEnd", e);
    },
    handleTask(row) {
      this.hoursId = row.hoursId
      this.workHourView = true
    },
    handleSearch() {
      this.listQuery.pageNo = 1
      this.queryList()
    },
    unique(data, key) {
      const hash = {};
      const data2 = data.reduce((preVal, curVal) => {
        hash[curVal[key]] ? '' : hash[curVal[key]] = true && preVal.push(curVal);
        return preVal
      }, [])
      return data2
    },
    filterHandler(value, row, column) {
      const property = column['property'];
      return row[property] === value;
    },
    queryList() {
      queryWorkHourToBillTask({...this.listQuery, ...this.$commonUtils.cleanNullAttr(this.query), custName: undefined, wfStatus: '未核销', auditUserId: this.$store.getters.userId}).then(res => {
        this.hourList = res.data
        this.total = res.total
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-row {
  display: flex;
  padding: 20px 5px;
  margin: 10px 2px;
  box-shadow: 0px 2px 5px 0px rgba(163, 163, 163, 0.35);

  .el-form-item {
    margin-bottom: 0;

    /deep/ .el-form-item__content {
      display: flex;
      height: 32px;

      input {
        /*height: 100%;*/
      }
    }
  }
}
.ViewsSwitching {
  position: absolute;
  right: 0;
  z-index: 100;
  top: 5px;
}

.buttonWrap {
  display: flex;
  justify-content: space-between;
  padding-left: 10px;
  align-items: center;
}

.button_wrap {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 50px;

  .el-button {
    margin-left: 10px;
  }
}

.el-table {
  /deep/ th {
    padding: 5px 0
  }

  /deep/ td {
    padding: 0;
  }

  /deep/ .cell {
    white-space: nowrap
  }
}

.el-table {
  width: auto;

  /deep/ tr:nth-of-type(1) {
    th {
      background: rgba(242, 242, 242, 1);
    }
  }
}

.el-dropdown {
  margin-left: 10px;
  cursor: pointer;
  line-height: 1;
  position: relative;
  top: -1px;

  .el-dropdown-link {
    color: #FFF;
    background-color: #409EFF;
    border-color: #409EFF;
    padding: 7px 15px;
    font-size: 12px;
    border-radius: 3px;
    line-height: 1;

    &:hover {
      background: #66b1ff;
      border-color: #66b1ff;
      color: #FFF;
    }
  }

}

.lowCreditFrom {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;

  .el-form-item {
    line-height: 30px;
    width: 100%;
    display: flex;
    border: 1px solid #EBEEF5;
    margin-bottom: 10px;

    /deep/ .el-form-item__label {
      background: #f5f7fa;
      line-height: 30px;
    }

    /deep/ .el-form-item__content {
      line-height: 30px;
      margin-left: 0 !important;
      padding-left: 10px;
      background: #fff;
      flex: 1;
    }
  }
}

.tips {
  padding: 8px 16px 8px 20px;
  box-sizing: border-box;
  width: 418px;
  background-color: rgba(253, 246, 236, 1);
  margin-bottom: 10px;

  img {
    vertical-align: middle;
    width: 15px;
    height: auto;
    margin-right: 12px;
  }

  span {
    font-weight: 400;
    font-style: normal;
    font-size: 12px;
    color: #E6A23C;
    text-align: left;
    line-height: 18px;

  }
}

.el-scrollbar li {
  display: flex;

  span {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    border-right: 1px solid #f4f4f5;
    border-bottom: 1px solid #f4f4f5;
  }
}

.abow_dialog {
  >>> .el-dialog {
    position: absolute;
    top: 50%;
    left: 50%;
    margin: 0 !important;
    transform: translate(-50%, -50%);
    max-height: calc(100% - 30px);
    max-width: calc(100% - 30px);
    display: flex;
    flex-direction: column;
  }

  >>> .el-dialog__body {
    overflow: auto;
  }
}
.ag-work-table {
  width: 100%;
  position: relative;
  .work-table{
    position: relative;
  }
  .content_wrap {
    width: 100%;
    display: flex;
    .left_wrap {
      position: relative;
      transition: all 5s;
      //   width: 40%;
    }

  }
}
.right_wrap{
  float: right;
  width: 38%;
  margin-right: 20px;
  box-shadow: 0px 0px 18px 0px rgba(64, 158, 255,0.5);
  height: 598px;
  // width: 38%;
  /*overflow: auto;*/
  // flex: 1;
  overflow: hidden;
  transition:all 0.5s;
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
.dots {
  cursor: pointer;
  position: absolute;
  left: 0;
  top: 6px;
  z-index: 1;
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
  right: 10px;
  top: 0px;
  z-index: 1;
}
>>>.ag-status-bar-right {
  width: 100%;
}
>>>.ag-status-name-value {
  width: 100%;
}
>>>.currentClick{
  background-color: #2981EB!important;
  color: #ffffff;
  font-weight: bold;
}
.rebookDiv {
  width: 100%;
  border: 1px solid #D7D7D7;
  padding: 10px;

  .rebookTitle {
    color: #D9001B;
    padding-bottom: 10px;
    border-bottom: 2px solid #797979;
  }

  .rebookBody {
    display: flex;

    .bodyLeft {
      min-height: 300px;
      max-height: 500px;
      overflow: auto;
      flex: 4;
      /*background-color: red;*/
      margin-right: 10px;

      .nameList {
        width: 100%;
        height: 35px;
        border: 1px solid #F2F2F2;
        border-bottom: none;
        display: flex;
        justify-content: center;
        align-items: center;

        &:last-child {
          border-bottom: 1px solid #F2F2F2;
        }
      }
    }

    .bodyRight {
      min-height: 300px;
      max-height: 500px;
      overflow: auto;
      flex: 6;

      .rightTitle {
        text-align: center;
        background-color: #D7D7D7;
        margin-top: 10px;
        height: 30px;
        line-height: 30px;
      }

      .rightSearch {
        .el-input {
          input {
            border-radius: 0 !important;
          }

          > > > .el-input__inner {
            height: 35px;
          }
        }
      }

      .rightTable {
        thead {
          tr {
            th {
              background-color: #D7D7D7;
              color: #606266;
            }
          }
        }
      }
    }
  }
}
</style>
