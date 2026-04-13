<template>
  <div>
<!--    <TitleTotal :total="total" />-->
    <AgGridVue
      :style="{width:'100%',height: clientHeight+'px'}"
      class="ag-theme-balham"
      :columnDefs="columnDefs"
      :rowData="list"
      rowSelection="multiple"
      @grid-ready="onGridReady"
      :gridOptions="gridOptions"
      :getContextMenuItems="getContextMenuItems"
      @rowDoubleClicked="rowDoubleClicked"
      @sortChanged="refreshEvenRowsCurrencyData"
      @filterChanged="refreshEvenRowsCurrencyData"
      suppressAutoSize
      animateRows
      :localeText="$store.state.caseInformation.localeText"
    >
    </AgGridVue>
    <pagination v-show="total>0" :total="total" :page-sizes="[100,500,1000,5000,10000]" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <component v-if="componentVisible" :is="currentView" :page-state="pageState" :dialog-visible="dialogVisible" :report-data="reportData" :company-list="companyList" v-on:closeDialog="closeDialog(arguments)"></component>
    <el-dialog
      title="汇总报表导出"
      :visible.sync="summaryReportVisible"
      width="20%"
      center>
      <div>
        <el-date-picker
          v-model="summaryReportMonth"
          type="month"
          placeholder="选择导出报表月份">
        </el-date-picker>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="summaryReportVisible = false">取 消</el-button>
        <el-button type="primary" @click="summaryReportVisible = false">导 出</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="报表锁定解锁"
      :visible.sync="reportManageVisible"
      width="25%"
      center>
      <div>
        <el-date-picker
          v-model="reportMonth"
          type="month"
          placeholder="选择查询报表月份">
        </el-date-picker>
        <el-switch
          v-model="reportStatus"
          active-text="锁定"
          inactive-text="解锁">
        </el-switch>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { queryFinancialList, queryfSalaryList, queryFManageDevList, queryFProfitLossList, queryFAssetsDebtList, queryFFundRegions, queryReportCompany} from '@/api/caseList'
import Pagination from '@/components/Pagination'; // secondary package based on el-pagination
import Financial from './Financial'
import Salary from './Salary'
import ManageDev from './ManageDev'
import ProfitLoss from './ProfitLoss'
import AssetsDebt from './AssetsDebt'
import FundBalance from './FundBalance'

export default {
  name: 'index',
  components: {
    Pagination,
    Financial,
    Salary,
    ManageDev,
    ProfitLoss,
    AssetsDebt,
    FundBalance
  },
  data() {
    return {
      summaryReportVisible: false,
      summaryReportMonth: '',
      reportManageVisible: false,
      reportMonth: '',
      reportStatus: false,
      createState: true,

      companyList: [],
      companyData: [],

      componentVisible: false,
      dialogVisible: {
        main: false,
        export: false,
        lock: false
      },
      reportAction: 'financial',
      pageState: 'create',
      reportData: [],
      currentMonth: '',
      currentYear: '',
      queryModuleData: [],
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
      columnDefs: [],
      defaultPreferenceList: [
        { 'label': '所属单位', prop: 'deptIdStr'},
        { 'label': '所属月', prop: 'belongToDate'},
        { 'label': '填报人', prop: 'fillinUserIdStr' },
        { 'label': '锁定状态', prop: 'lockedStr' },
        { 'label': '填报日期', prop: 'fillinDate' },
      ],
      preferenceList: [],
      total: 0,
      listQuery: {
        pageNo: 1,
        pageSize: JSON.parse(localStorage.getItem('pageSize'))?JSON.parse(localStorage.getItem('pageSize')).find(item=>item.name==this.$route.name)?JSON.parse(localStorage.getItem('pageSize')).find(item=>item.name==this.$route.name).pageSize:100:100
      },
      list: null,
      gridOptions: {
        ...this.$store.state.caseInformation.gridOptions, ...{
          statusBar: {
            statusPanels: [
              { statusPanel: 'agTotalAndFilteredRowCountComponent', align: 'left' }, // 总和过滤的行数组件
              { statusPanel: 'agSelectedRowCountComponent', align: 'left' } // 选定的行计数组件
            ]
          }
        }
      },

    }
  },
  created() {
    this.queryPreferenceList()
    this.queryCompany()
    this.getList();
    this.getallSelectData();
  },
  computed: {
    // 设置表格高度
    clientHeight(){
      return  document.documentElement.clientHeight-220
    },
    currentView() {
      return this.reportAction;
    }
  },
  methods: {
    queryPreferenceList(){
      this.preferenceList = this.defaultPreferenceList
    },
    changeView(index) {
      this.index = index;
    },
    // 获取单位数据
    queryCompany() {
      queryReportCompany().then(res => {
        this.companyList = res.data
        res.data.forEach(item => {
          this.companyData[item.deptId] = item.nameCn
        })
        this.companyData = Object.assign([],this.companyData)
      });
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
    onGridReady(params) {
      this.gridApi = params.api
      this.columnApi = params.columnApi
      // params.api.sizeColumnsToFit() // 自适应大小
    },
    clearSearch() {
      this.queryModuleData.deptId = ''
      this.queryModuleData.belongToDateArray = []
      this.queryModuleData.fillinDateArray = []
      this.total = '0';
    },
    // 右侧点击
    getContextMenuItems(params){
      return [
        {
          name: '复制',
          action: () =>{
            this.$copyText(params.value).then(
              res => {
              })
          }
        },
        {
          name: '修改',
          action: () =>{
            this.edit(params.node.data)
          }
        },
        {
          name: '删除',
          action:()=>{
            this.deleteReportId(params.node.data)
          }
        }
      ]
    },
    // 双击查看
    rowDoubleClicked(params) {
      var row = params.data
      this.componentVisible = true
      this.dialogVisible.main = true
      this.pageState = 'view'
      this.reportData = row
    },
    changeBelongDate({repCompId}) {
      // this.$set(this.queryModuleData, 'repCompIdOut', repCompId)
      const belongToDateArray = this.currentYear + '-' + this.currentMonth
      this.$set(this.queryModuleData, 'belongToDateArray',[belongToDateArray, belongToDateArray])
      this.handleSearch(1)
    },
    changeCompany({deptId, shortname}) {
      if (this.queryModuleData.deptId == deptId) return
      this.currentMonth = this.$wUtil.getDate('', 'month').slice(5)
      this.currentYear = this.$wUtil.getDate('', 'year')
      const belongToDateArray = this.currentYear + '-' + this.currentMonth
      this.$set(this.queryModuleData, 'deptId', deptId)
      this.$set(this.queryModuleData, 'belongToDateArray', [belongToDateArray, belongToDateArray])
      this.handleSearch(1)
    },
    // 获取数据
    getList() {
      var queryModuleData = []
      queryModuleData.pageNo = this.listQuery.pageNo
      queryModuleData.pageSize = this.listQuery.pageSize
      this.listLoading = true;
      // 搜索项
      queryModuleData = Object.assign(this.queryModuleData, queryModuleData)
      if (queryModuleData.action){
        this.reportAction = queryModuleData.action
      }
      // 判断tab,请求方法
      switch (queryModuleData.action) {
        case 'financial': // 财务状况
          this.queryFinancialList(queryModuleData);
          break;
        case 'salary': // 从业人员工资总额
          this.queryfSalaryList(queryModuleData);
          break;
        case 'manageDev': // 经营财务研发
          this.queryFManageDevList(queryModuleData);
          break;
        case 'profitLoss': // 损益表
          this.queryFProfitLossList(queryModuleData);
          break;
        case 'assetsDebt': // 资产负债表
          this.queryFAssetsDebtList(queryModuleData);
          break;
        case 'fundBalance': // 资金余额情况
          this.queryFFundRegions(queryModuleData);
          break;
        default:
          // this.queryFinancialList(queryModuleData);
          this.queryModuleData.action = '';
          this.saveQueryModel()
          this.list = [];
          this.total = 0;
          break;
      }
      this.getallSelectData() // 数据渲染
      // console.log(this.gridApi)
      // this.gridApi.sizeColumnsToFit() // 自适应大小
    },
    // 数据请求
    queryFinancialList(queryModuleData){
      this.queryPreferenceList()
      queryFinancialList(queryModuleData).then(response => {
        this.list = response.data;
        this.total = response.total;
        this.listLoading = false;
      });
    },
    queryfSalaryList(queryModuleData){
      this.preferenceList = [
        { 'label': '所属单位', prop: 'deptIdStr'},
        { 'label': '所属年度', prop: 'belongToYear'},
        { 'label': '所属季度', prop: 'quarter'},
        { 'label': '填报人', prop: 'fillinUserIdStr' },
        { 'label': '锁定状态', prop: 'lockedStr' },
        { 'label': '填报日期', prop: 'fillinDate' },
      ]
      queryfSalaryList(queryModuleData).then(response => {
        this.list = response.data;
        this.total = response.total;
        this.listLoading = false;
      });
    },
    queryFManageDevList(queryModuleData){
      this.queryPreferenceList()
      queryFManageDevList(queryModuleData).then(response => {
        this.list = response.data;
        this.total = response.total;
        this.listLoading = false;
      });
    },
    queryFProfitLossList(queryModuleData){
      this.queryPreferenceList()
      queryFProfitLossList(queryModuleData).then(response => {
        this.list = response.data;
        this.total = response.total;
        this.listLoading = false;
      });
    },
    queryFAssetsDebtList(queryModuleData){
      queryFAssetsDebtList(queryModuleData).then(response => {
        this.list = response.data;
        this.total = response.total;
        this.listLoading = false;
      });
    },
    queryFFundRegions(queryModuleData){
      this.preferenceList = [
        { 'label': '所属单位', prop: 'deptIdStr'},
        { 'label': '所属月', prop: 'belongToDate'},
        { 'label': '填报人', prop: 'fillinUserIdStr' },
        { 'label': '锁定状态', prop: 'lockedStr' },
        { 'label': '填报日期', prop: 'fillinDate' },
        { 'label': '填写状态', prop: 'wfstatus' },
      ]
      queryFFundRegions(queryModuleData).then(response => {
        this.list = response.data;
        this.total = response.total;
        this.listLoading = false;
      });
    },

    // 行号获取
    getSelectedRows() {
      if (this.gridApi) {
        const selectedNodes = this.gridApi.getSelectedNodes();
        const selectedData = selectedNodes.map(node => node.data);
        return selectedData
      } else {
        return []
      }
    },

    // 数据渲染
    getallSelectData() {
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
            return this.$commonUtils.sort(a, b, item.prop)
          }
        }
      }))]
    },
    // 单元(列)渲染器
    cellRenderer(params) {
      if (params.colDef.field === 'sid') {
        return params.rowIndex + 1
      }
      return `<span title="${params.value}">${params.value ? params.value : ''}</span>`
    },
    deleteReportId(row, index){
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delete(row)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });

    },
    // 搜索
    handleSearch(flag) {
      if(typeof flag == 'object'){
        const { searchType, searchData } = flag
        this.queryModuleData = searchData
        this.operationState = searchType
      }
      this.listQuery.pageNo=1
      this.getList()
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
    // 创建
    create(){
      this.componentVisible = true
      this.dialogVisible.main = true
      this.pageState = 'create'
      this.reportData = []
    },
    // 编辑
    edit(row) {
      if (row.locked) {
        this.$message.warning('该报表已锁定，请解锁后在进行操作！');
        return;
      }
      this.componentVisible = true
      this.dialogVisible.main = true
      this.pageState = 'edit'
      this.reportData = row
    },
    // 删除
    delete(row) {
      if (row.locked) {
        this.$message.warning('该报表已锁定，请解锁后在进行操作！');
        return;
      }
      this.componentVisible = true
      this.pageState = 'delete'
      this.reportData = row
    },
    // 导出
    export(){
      this.componentVisible = true
      this.dialogVisible.export = true
      this.pageState = 'export'
    },
    // 管理
    lock(){
      this.componentVisible = true
      this.dialogVisible.lock = true
      this.pageState = 'lock'
    },
    closeDialog(res){
      this.componentVisible = res[0]
      this.dialogVisible.main = false
      this.dialogVisible.export = false
      this.dialogVisible.lock = false
      if (res[1]) {
        this.getList()
      }
    },
    // 后续有方面要求，在进行完善
    // warning() {
    //   this.$message({
    //     showClose: true,
    //     message: '上月报表未锁定,请联系相关人员锁定后，在进行制表操作',
    //     type: 'warning'
    //   });
    // }
  }
}
</script>
