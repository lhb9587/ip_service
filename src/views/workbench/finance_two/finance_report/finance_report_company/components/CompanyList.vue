<template>
  <div>
<!--    <TitleTotal :total="total" />-->
    <div style="position:relative;">
      <div class="dots" @click="handleCheckboxState">
        <span class="dot">.</span>
        <span class="dot">.</span>
        <span class="dot">.</span>
      </div>
      <div class="checkbox" v-show="checkboxState">
        <el-select ref="checkCaseSelect" v-model="checkCaseList" multiple reserve-keyword filterable placeholder="请选择"
                   collapse-tags :popper-append-to-body="false" @visible-change="handleChange"
                   :filter-method="filterCheck">
          <template slot="">
            <div class="checkbox_bottom">
              <el-button size="mini" round @click.stop="delPreference(1)">恢复默认</el-button>
              <el-button style="margin-right: 3px" size="mini" round @click.stop="savePreference(1)">保存设置</el-button>
              <!--<el-button size="mini" round @click.stop="checkNotAtAll">全不选</el-button>-->
            </div>
          </template>
          <el-option v-for="(item,idx) in selectColumnList.filter(item =>item.COLUMN_COMMENT.includes(filterText))"
                     :key="item.COLUMN_NAME" :label="item.COLUMN_COMMENT" :value="item.COLUMN_NAME">
          </el-option>
        </el-select>
      </div>
    </div>
    <AgGridVue
      :style="{width:'100%',height: clientHeight+'px',marginTop: '15px'}"
      class="ag-theme-balham"
      :columnDefs="columnDefs"
      :rowData="list"
      rowSelection="multiple"
      @grid-ready="onGridReady"
      :gridOptions="gridOptions"
      @dragStopped="dragStopped"
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
    <Company v-if="companyVisible" :page-state="pageState" :report-data="reportData" :company-list="companyList" v-on:closeDialog="closeDialog(arguments)"></Company>
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
import {
  queryReportCompany1,
  deleteReportCompany,
  delPreference,
  savePreference,
  selectColumn,
  queryPreference, queryReportCompanySelect
} from '@/api/caseList'
import Pagination from '@/components/Pagination'; // secondary package based on el-pagination
import Company from './Company'

export default {
  name: 'CompanyList',
  components: {
    Pagination,
    Company
  },
  data() {
    return {
      tableHeader: [],
      filterText: '',
      userId: this.$store.getters.userId,
      bussId: 57,
      selectColumnList: [],
      checkboxState: false,
      checkCaseList: [],
      summaryReportVisible: false,
      summaryReportMonth: '',
      reportManageVisible: false,
      reportMonth: '',
      reportStatus: false,
      createState: true,

      companyList: [],
      companyData: [],

      companyVisible: false,
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
        { 'label': '中文名称', prop: 'nameCn'},
        { 'label': '英文名称', prop: 'nameEn'}
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
    // this.queryPreferenceList()
    this.getAllWfs()
    this.queryCompany()
    // this.getallSelectData();
  },
  watch: {
    checkboxState(n) {
      if (n) {
        this.$nextTick(() => {
          this.$refs.checkCaseSelect.focus()
        })
      }
    },
  },
  computed: {
    // 设置表格高度
    clientHeight(){
      return  document.documentElement.clientHeight-180
    },
  },
  methods: {
    savePreference(num) {
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
        if (res.success) {
          this.checkboxState = false;
          this.filterText = ''
          if (!num) {
            this.queryList();
          }
          this.getAllWfs();
        }
      });
    },
    delPreference(num) {
      const data = {
        userId: this.userId,
        bussId: this.bussId
      };
      delPreference(data).then(res => {
        if (res.success) {
          this.checkboxState = false;
          this.getAllWfs();
        }
      });
    },
    getAllWfs() {
      const data = {
        userId: this.userId,
        bussId: this.bussId
      };
      Promise.all([selectColumn(data), queryPreference(data)]).then(res => {
        this.selectColumnList = res[0].data;

        this.tableHeader = this.preferenceList.map(item => ({
          label: item.title,
          prop: item.value,
          width: this.getLoactionWidth(item.title)
        }))
        this.preferenceList = res[1].data;
        this.columnDefs = [...this.defaultcolumnDefs, ...this.preferenceList.map(item => ({
          headerName: item.title,
          field: item.value,
          width: this.getLoactionWidth(item.title) == 'auto' ? 200 : this.getLoactionWidth(item.title),
          resizable: true,
          sortable: true,
          filter: 'agSetColumnFilter',
          menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
          cellRenderer: this.cellRenderer,
          enableRowGroup: true,
          filterParams: {
            newRowsAction: 'keep',
            comparator: (a, b) => {
              return this.$commonUtils.sort(a, b, item.value)
            }
          }
        }))]
        this.saveLocation()
        this.checkCaseList = this.preferenceList.map(item => item.value);
        this.getList();
      });
    },
    changeHeader(n) {
      if (n && n.length) {
        this.checkCaseList = n.map(item => item.prop).filter(item => item != 'sid')
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
        });
      }
    },
    dragStopped(params) {
      let tableHeader = params.columnApi.columnController.gridColumns.map(item => ({
        label: item.colDef.headerName,
        width: item.actualWidth,
        prop: item.colDef.field,
      })).filter(item => item.prop != "group")
      var arr = JSON.parse(localStorage.getItem('tableHeader'))
      arr.find(item => item.name == this.$route.name).tableHeader = tableHeader
      localStorage.setItem('tableHeader', JSON.stringify(arr))
      this.changeHeader(tableHeader)
    },
    saveLocation() {
      if (!localStorage.getItem('tableHeader')) {
        const arr = []
        arr.push({name: this.$route.name, tableHeader: this.tableHeader})
        localStorage.setItem('tableHeader', JSON.stringify(arr))
      } else {
        const arr = JSON.parse(localStorage.getItem('tableHeader'))
        if (arr.find(item => item.name === this.$route.name)) {
          arr.find(item => item.name === this.$route.name).tableHeader = this.tableHeader
          localStorage.setItem('tableHeader', JSON.stringify(arr))
        } else {
          arr.push({name: this.$route.name, tableHeader: this.tableHeader})
          localStorage.setItem('tableHeader', JSON.stringify(arr))
        }
      }
    },
    getLoactionWidth(label) {
      if (!localStorage.getItem('tableHeader')) {
        return 'auto'
      } else {
        var arr = JSON.parse(localStorage.getItem('tableHeader'))
        if (arr.find(item => item.name == this.$route.name)) {
          var header = arr.find(item => item.name == this.$route.name).tableHeader
          if (header.find(item => item.label == label)) {
            return header.find(item => item.label == label).width
          } else {
            return 'auto'
          }
        } else {
          return 'auto'
        }
      }
    },
    handleCheckboxState() {
      this.checkboxState = !this.checkboxState;
    },
    handleChange(boolean) {
      if (!boolean) {
        this.checkboxState = false;
      }
    },
    filterCheck(val) {
      this.filterText = val;
    },
    queryPreferenceList(){
      this.preferenceList = this.defaultPreferenceList
    },
    changeView(index) {
      this.index = index;
    },
    // 获取单位数据
    queryCompany() {
      // queryReportCompanySelect().then(res => {
      //   this.companyList = res.data
      //   res.data.forEach(item => {
      //     this.companyData[item.deptId] = item.nameCn
      //   })
      //   this.companyData = Object.assign([],this.companyData)
      // });
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
          },
        },
        {
          name: '修改',
          action: () =>{
            this.edit(params.node.data)
          },
          permission: 486
        },
        {
          name: '删除',
          action:()=>{
            this.delete(params.node.data)
          },
          permission: 486
        }
      ].filter(item => !item.permission || this.$store.getters.permissions.includes(item.permission))
    },
    // 双击查看
    rowDoubleClicked(params) {
      var row = params.data
      this.companyVisible = true
      this.pageState = 'view'
      this.reportData = row
    },
    // 获取数据
    getList() {
      var queryModuleData = []
      queryModuleData.pageNo = this.listQuery.pageNo
      queryModuleData.pageSize = this.listQuery.pageSize
      this.listLoading = true;
      if (this.operationState) {
        // 状态项，固定栏条件
        queryModuleData = Object.assign(this.queryState, queryModuleData)
      }else{
        // 搜索项
        queryModuleData = Object.assign(this.queryModuleData, queryModuleData)
      }

      this.queryReportCompany(queryModuleData)
      // this.getallSelectData() // 数据渲染
    },
    // 数据请求
    queryReportCompany(queryModuleData){
      queryReportCompany1(queryModuleData).then(response => {
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
      // 备注：搜索条件topmenu传过来，我们只需根据传过来的值进行修改，传过来什么查询什么，queryModuleData 默认是空的，需要根据传来的值填充
      if(typeof flag == 'object'){
        const { searchType, searchData } = flag
        if (searchType) {
          this.queryState = searchData
        }else{
          this.queryModuleData = searchData
        }
        this.operationState = searchType
      }
      this.listQuery.pageNo=1
      // this.saveQueryModel()
      this.getList()
    },
    // 创建
    create(){
      this.companyVisible = true
      this.pageState = 'create'
      this.reportData = []
    },
    // 编辑
    edit(row) {
      if (row.locked) {
        this.$message.warning('该报表已锁定，请解锁后在进行操作！');
        return;
      }
      this.companyVisible = true
      this.pageState = 'edit'
      this.reportData = JSON.parse(JSON.stringify(row))
    },
    // 删除
    delete(row) {
      deleteReportCompany({ compId: row.compId }).then(res => {
        if (res.success) {
          this.$message.success(res.message)
          this.closeDialog([false, true])
        }
      });
    },
    // 导出
    export(){
      this.companyVisible = true
      this.pageState = 'export'
    },
    // 管理
    lock(){
      this.companyVisible = true
      this.pageState = 'lock'
    },
    closeDialog(res){
      this.companyVisible = res[0]
      if (res[1]) {
        this.getList()
      }
    },
    warning() {
      this.$message({
        showClose: true,
        message: '上月报表未锁定,请联系相关人员锁定后，在进行制表操作',
        type: 'warning'
      });
    }
  }
}
</script>
<style lang="scss" scoped>
.checkbox {
  position: absolute;
  left: 0px;
  top: 33px;
  /*width: 222px;*/
  height: 330px;
  border: 1px solid #99a9bf;
  background: #fff;
  z-index: 100;
  padding-top: 6px;
  padding-left: 6px;
  padding-right: 16px;
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

.dots {
  cursor: pointer;
  position: absolute;
  left: 0;
  z-index: 1;
  top: 6px;
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
</style>
