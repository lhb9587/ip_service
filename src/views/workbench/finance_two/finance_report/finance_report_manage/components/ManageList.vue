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
    <pagination v-show="total>0" :total="total" :page-sizes="[10,50,100,500,1000,5000,10000]" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />
    <Manage v-if="manageVisible" :page-state="pageState" :report-data="reportData" :company-list="companyList" v-on:closeDialog="closeDialog(arguments)"></Manage>
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
import { queryReportCompany, queryFinancialDoc, deleteFinancialDoc } from '@/api/caseList'
import Pagination from '@/components/Pagination'; // secondary package based on el-pagination
import Manage from './Manage'

export default {
  name: 'ManageList',
  components: {
    Pagination,
    Manage,
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

      manageVisible: false,
      pageState: 'create',
      reportData: [],
      queryState: [],
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
        { 'label': '报表类型', prop: 'docTypeStr'},
        { 'label': '所属日期', prop: 'belongTo'},
        { 'label': '创建日期', prop: 'createDate'},
        { 'label': '附件名称', prop: 'docName'},
      ],
      preferenceList: [],
      total: 0,
      listQuery: {
        pageNo: 1,
        pageSize: JSON.parse(localStorage.getItem('pageSize'))?JSON.parse(localStorage.getItem('pageSize')).find(item=>item.name==this.$route.name)?JSON.parse(localStorage.getItem('pageSize')).find(item=>item.name==this.$route.name).pageSize:10:10
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
      return  document.documentElement.clientHeight-180
    },
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
            this.delete( params.node.data)
          }
        }
      ]
    },
    // 双击查看
    rowDoubleClicked(params) {
      var row = params.data
      this.manageVisible = true
      this.pageState = 'view'
      this.reportData = row
    },
    // 获取数据
    getList() {
      var queryModuleData = []
      queryModuleData.pageNo = this.listQuery.pageNo
      queryModuleData.pageSize = this.listQuery.pageSize
      this.listLoading = true;
      for (var key in this.queryModuleData) {
        if (this.queryModuleData[key] === null || this.queryModuleData[key] === '') {
          delete this.queryModuleData[key]
        }
      }
      queryModuleData = Object.assign(this.queryModuleData, queryModuleData)
      this.queryFinancialDoc(queryModuleData);
      this.getallSelectData() // 数据渲染
    },
    // 数据请求
    queryFinancialDoc(queryModuleData){
      queryFinancialDoc(queryModuleData).then(response => {
        this.list = response.data;
        this.total = response.total;
        // this.gridApi.sizeColumnsToFit() // 自适应大小
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
    // 搜索
    handleSearch(flag) {
      if(typeof flag == 'object'){
        const { searchType, searchData } = flag
        this.queryModuleData = searchData
      }
      this.listQuery.pageNo=1
      this.getList()
    },
    // 创建
    create(){
      this.manageVisible = true
      this.pageState = 'create'
      this.reportData = []
    },
    // 编辑
    edit(row) {
      this.manageVisible = true
      this.pageState = 'edit'
      this.reportData = row
    },
    // 删除
    delete(row) {
      deleteFinancialDoc({ finDocId: row.finDocId }).then(res => {
        if (res.success) {
          this.$message.success(res.message)
          this.closeDialog([false, true])
        }
      });
    },
    closeDialog(res){
      this.manageVisible = res[0]
      if (res[1]) {
        this.getList()
      }
    },
  }
}
</script>
