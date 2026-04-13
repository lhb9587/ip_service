<template>
  <div>
    <div class="topSearch">
      <el-select
        style="margin-bottom: 10px"
        size="mini"
        default-first-option
        :clearable="true"
        v-model="queryData.custId"
        no-match-text="暂无数据"
        loading-text="正在查询"
        filterable
        remote
        placeholder="请输入客户名称"
        :remote-method="remotepaternalUnit1"
        @change="queryList(1)"
      >
        <el-option
          v-for="(item, key) in custArray"
          :key="key"
          :label="item.fullname"
          :value="item.custId"
        ></el-option>
      </el-select>
      <el-select
        style="margin-bottom: 10px;margin-left: 10px"
        size="mini"
        default-first-option
        :clearable="true"
        v-model="queryData.applicantName"
        no-match-text="暂无数据"
        loading-text="正在查询"
        filterable
        remote
        allow-create
        placeholder="请输入申请人名称"
        :remote-method="remotepaternalUnit"
        @change="queryList(1)"
      >
        <el-option
          v-for="(item, key) in custListMerge"
          :key="key"
          :label="item.applicantName"
          :value="item.applicantName"
        ></el-option>
      </el-select>
      <el-input clearable style="width: 180px;margin-left: 10px" placeholder="商标号" size="mini"
                @change="queryList(1)"
                v-model="queryData.trademarkNum"
      >
      </el-input>
      <div class="fl-ac-jc" style="margin-left: 25px;">
        <el-switch
            v-model="queryData.viewType"
            active-color="#13ce66"
            inactive-color="#DCDFE6"
            :active-value="1"
            :inactive-value="0"
            active-text="重要流程更新"
            @change="queryList(1)"
        >
        </el-switch>
      </div>
      <div class="fl-ac-jc" style="margin-left: 25px;margin-bottom: 10px">
        <el-button style="height: 28px;margin-left: 5px" type="primary" size="mini" @click="addMonitor">
          <span class="el-icon-upload"></span>
          新建
        </el-button>
        <el-dropdown
          style="height: 28px; margin-left: 5px"
          size="mini"
          split-button
          type="danger"
          @click="deleteMonitor"
          @command="handleDelete"
        >
          <span class="el-icon-delete"></span>
          删除
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="deleteByCustomer">按客户删除</el-dropdown-item>
            <el-dropdown-item command="deleteByApplicant">按申请人删除</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-dropdown
          style="margin-left: 5px"
          size="mini"
          split-button
          type="success"
          @click="changeMonitor"
          @command="handleChange"
        >
        <span class="el-icon-edit" title="恢复"></span>
          更改通知人
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="changeByCustomer">按客户更改</el-dropdown-item>
            <el-dropdown-item command="changeByApplicant">按申请人更改</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="export">
        <el-button type="text" @click="exportList(2)">导出</el-button>
        <span style="color: #52A2F4;margin: 0 5px"> / </span>
        <el-button type="text" @click="exportList(1)">全局导出</el-button>
      </div>
    </div>
    <el-table
        ref="tableList"
        :key="tableKeyOut"
        border
        :row-class-name="({row, rowIndex}) => tableRowClassName({row, rowIndex})"
        :data="monitorList"
        empty-text="暂无数据"
        highlight-current-row
        current-row-key
        :height="clientHeight"
        @select="handleSelectionChange"
        @select-all="handleSelectionAll"
        @header-dragend="(newWidth, oldWidth, column, event) => {headerDrage(newWidth, oldWidth, column)}"
        @sort-change="sortChangeOut"
        @filter-change="sortChangeOut"
    >
      <el-table-column
          type="index"
          width="60"
          align="left"
          label="序号"
      >
      </el-table-column>
      <el-table-column
          type="selection"
          width="50"
          class="selection"
          :selectable="isSelectable"
      >
      </el-table-column>
      <el-table-column
          v-for="(item,index) in tableDefaultList"
          :key="item.value"
          :width="item.width"
          sortable
          :sort-method="(a, b) => $commonUtils.sort(a[item.value], b[item.value])"
          :label="item.title"
          align="left"
          :prop="item.value"
          :filters="tableHeadFilters[item.value]"
          :filter-method="filterHandler"
      >
        <template slot-scope="scope">
          <div v-if="item.value === 'linkName' && scope.row[item.value]" class="ellipsis1" :title="scope.row[item.value]">
            <el-popover
              v-if="scope.row.statusList.length > 0"
              placement="right"
              title="商标流程"
              width="450"
              trigger="hover">
              <template slot="reference">
                <span class="iconfont icon-liucheng highlight-icon"></span>
              </template>
              <div class="scroll-container">
                <div class="divider"></div>
                <div v-for="item in scope.row.statusList" :key="item.id">
                  <div :class="item.vitalNode ? 'highlight' : ''">{{ item.processDate }} {{ item.businessName }}-{{ item.linkName }} </div>
                  <div class="divider"></div>
                </div>
              </div>
            </el-popover>
            {{ scope.row[item.value] }}
          </div>
          <div v-else class="ellipsis1" :title="scope.row[item.value]">{{ scope.row[item.value] }}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <div style="display: flex;;">
            <el-button type="primary" size="mini" @click="viewMonitor(scope.row)">
              <span class="el-icon-view"></span>
            </el-button>
            <el-button v-if="scope.row.canBeDeleted" type="danger" size="mini" @click="deleteMonitorSingle(scope.row)">
              <span class="fl-ac-jc">
                <span class="el-icon-delete"></span>
              </span>
            </el-button>

          </div>
        </template>
      </el-table-column>
    </el-table>

    <div style="display: flex; justify-content: space-between; align-items: center;">
      <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="listQuery.pageNo"
          :limit.sync="listQuery.pageSize"
          @pagination="queryList"
          :pageSizes="pageSizesList"
      />
      <div class="disclaimer" style="margin-left: 10px; color: #999;">
          免责声明: 此界面商标流程仅供参考，具体流程请以商标局官方网站信息为准
      </div>
    </div>

    <el-dialog
        v-if="monitorView"
        :title="title + '商标流程监控'"
        center
        :fullscreen="false" :show-close="true"
        :close-on-click-modal="false" :modal="true"
        :visible.sync="monitorView"
        width="60%"
        destroy-on-close
        class="abow_dialog"
        :before-close="() => closeDialog(false)"
    >
      <el-form ref="postForm" size="mini" label-width="100px" :rules="rules" :model="monitorData">
        <el-row>
          <el-col :span="12">
            <el-form-item label="客户名称:">
              <el-select
                style="width: 100%;"
                size="mini"
                default-first-option
                :clearable="true"
                v-model="monitorData.custId"
                no-match-text="暂无数据"
                loading-text="正在查询"
                filterable
                remote
                reserve-keyword
                placeholder="请输入客户名称"
                :remote-method="remotepaternalUnit1"
                @change="selectCustId"
              >
                <el-option
                  v-for="(item, key) in custArray"
                  :key="key"
                  :label="item.fullname"
                  :value="item.custId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="23">
            <el-form-item label="申请人名称:" prop="appNameList">
              <el-select
                style="width: 100%;"
                size="mini"
                multiple
                filterable
                allow-create
                default-first-option
                :clearable="true"
                v-model="monitorData.applicantNameList"
                no-match-text="暂无数据"
                loading-text="正在查询"
                remote
                reserve-keyword
                placeholder="请输入申请人名称"
                :remote-method="remotepaternalUnit"
                @change="selectApplicantName"
              >
                <el-option
                  v-for="(item, key) in custListMerge"
                  :key="key"
                  :label="item.applicantName"
                  :value="item.applicantName"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="2" style="display: flex; justify-content: center; align-items: center;">
            <el-button icon="el-icon-search" type="primary" size="mini" @click="trademarkSearch">查询商标</el-button>
          </el-col> -->
        </el-row>
        <!-- <el-row> -->
          <!-- <el-col :span="24"> -->
            <AgGridVue
              style="width: 100%;"
              :style="{'height': clientHeightAg + 'px'}"
              class="ag-theme-balham"
              :columnDefs="columnDefs"
              :rowData="applist"
              :rowSelection="'multiple'"
              @grid-ready="onGridReady"
              :gridOptions="gridOptions"
              :getContextMenuItems="getContextMenuItems"
              @sortChanged="refreshEvenRowsCurrencyData"
              @filterChanged="refreshEvenRowsCurrencyData"
              suppressAutoSize
              animateRows
              :localeText="$store.state.caseInformation.localeText"
              :getRowStyle="getRowStyle"
            >
            </AgGridVue>
            <span>共计：{{ applist.length }}</span>
          <!-- </el-col> -->
        <!-- </el-row> -->
        <el-row style="margin-top: 10px;">
          <el-col :span="23">
            <el-form-item label="通知人管理:">
              <virtual-select class="virtual-select" placeholder="请选择通知人" :isUser="true" clearable multiple :data="$store.getters.userList"
                              v-model="monitorData.viewableUserList" filterable
                              :render="(data)=>$commonUtils.UserRender(data,this)">
              </virtual-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer fl-ac-jc">
          <el-button size="small" @click="() => closeDialog(false)">取 消</el-button>
          <el-button size="small" type="primary"
                     @click="submitData">确 认</el-button>
        </span>
    </el-dialog>

    <!-- 更改通知人弹窗 -->
    <el-dialog
      title="选择通知人"
      :visible.sync="dialogVisible"
      width="50%"
      @close="dialogVisible = false"
    >
    <el-form>
      <el-row style="margin-top: 10px;">
        <el-col :span="22">
          <el-form-item label="通知人管理:">
            <virtual-select
              class="virtual-select"
              placeholder="请选择通知人"
              :isUser="true"
              clearable
              multiple
              :data="$store.getters.userList"
              v-model="viewableUserList"
              filterable
              :render="(data) => $commonUtils.UserRender(data, this)"
            ></virtual-select>
          </el-form-item>
        </el-col>
      </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveMonitor">确定</el-button>
      </span>
    </el-dialog>

    <div class="rightPanel" v-if="retrievalDetallShow">
      <el-button
          icon="el-icon-close"
          size="mini"
          type="info"
          plain
          @click="callbackList"
          style="position: absolute;left: 0px; z-index: 1000;"
        ></el-button>
      <div style="overflow: scroll!important;height: calc(100vh - 40px);margin-top: 30;">
        <RetrievalDetall
          ref="tmDetail"
          v-if="retrievalDetallShow"
          :tId='retrievalData.dttId'
          :regNumber="retrievalData.regNumber"
          :tmType="retrievalData.tmType"
          @callbackList="callbackList"
          @scrollToTrademarkProcess="scrollToTrademarkProcess" />
      </div>
    </div>
    <SelectOption moduleName="monitor" :buss-id="bussId" v-if="selectionOptionState" :dialog-visible="selectionOptionState"
                  @cancel="closeSelect" :idArray="getCurrentRowsData('pm_Id')"
                  :defaultMultipleSelect="tableDefaultList.map(i=>i.title)" :exportType="exportType"
                  :exportQueryModel="exportQueryModel"></SelectOption>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import RetrievalDetall from "@/views/workbench/platformData/trademarkRetrieval/components/RetrievalDetall";
import {queryCustomerNameIdUrl, searchTmUrl} from "../../../../../api/customerList";
import {
  queryProcessMonitorList,
  processMonitorExportExcel,
  deleteProcessMonitorBatch,
  addProcessMonitorBatch,
  updateViewableUserBatch,
  queryApplicanNameByCustId,
  queryTrademarkByApplicationName
} from "../../../../../api/monitor";
import {queryAllUrl} from "../../../../../api/applicant";
import SelectOption from '../../../case/components/SelectOption'

export default {
  name: "MonitorContent",
  components: {
    SelectOption,
    Pagination,
    RetrievalDetall
  },
  props: {
    custList: {
      default: () => []
    },
    workgroupNamesList: {
      default: () => []
    }
  },
  computed: {
    clientHeight() {
      return document.documentElement.clientHeight - 250
    },
    clientHeightAg() {
      return document.documentElement.clientHeight - 600
    },
  },
  data() {
    return {
      exportType: '',
      exportQueryModel: {},
      bussId: '156',
      selectionOptionState: false,
      selectionState: false,
      defaultExpandedKeys: [],
      filterText: '',
      defaultProps: {
        children: 'child',
        label: 'label'
      },
      tableKeyOut: false,
      tableHeadFilters: {},
      tableHeader: {},
      isAllCheck: false,
      isAllCheck1: false,
      selectCompanyList: [],
      companyList: [],
      stopList: [],
      custArray: [],
      defaultData: {
        custId: '',
        applicantNameList: [],
        trademarkNumberList: [],
        viewableUserList: [],
      },
      monitorData: {
        custId: '',
        applicantNameList: [],
        trademarkNumberList: [],
        viewableUserList: [],
      },
      monitorView: false,
      title: '',
      tableDefaultList: [
        {
          title: '客户',
          value: 'custName',
          width: 'auto'
        },
        {
          title: '申请人',
          value: 'applicantName',
          width: 'auto'
        },
        {
          title: '商标号',
          value: 'trademarkNum',
          width: 'auto'
        },
        {
          title: '类别',
          value: 'tmType',
          width: 'auto'
        },
        {
          title: '商标名称',
          value: 'tmName',
          width: 'auto'
        },
        {
          title: '申请日期',
          value: 'appDate',
          width: 'auto'
        },
        {
          title: '最新流程状态',
          value: 'linkName',
          width: '80'
        },
        {
          title: '最新流程日期',
          value: 'processDate',
          width: 'auto'
        },
        {
          title: '更新日期',
          value: 'tmCreateDate',
          width: 'auto'
        },
      ],
      monitorList: [],
      total: 0,
      pageSizesList: [10, 50, 100, 200],
      listQuery: {
        pageNo: 1,
        pageSize: JSON.parse(localStorage.getItem('pageSize')) ? JSON.parse(localStorage.getItem('pageSize')).find(item => item.name == this.$route.name) ? JSON.parse(localStorage.getItem('pageSize')).find(item => item.name == this.$route.name).pageSize : 10 : 10,
      },
      custListMerge: [],
      queryData: {
        custId: '',
        applicantName: '',
        trademarkNum: '',
        viewType: 1
      },
      isShow: false,
      iconIsDel: false,
      userIconCust: '',
      tableKey: false,
      treeData: [],
      previousApplicantNameList: [], // 上一次选中的申请人集合
      applist: [], // 查询到的商标数据
      gridApi: {}, // ag-grid图表
      columnDefs: [],
      gridOptions: {
        ...this.$store.state.caseInformation.gridOptions, ...{
          statusBar: {
            statusPanels: [
              // { statusPanel: 'agTotalAndFilteredRowCountComponent', align: 'left' },
              // { statusPanel: 'agSelectedRowCountComponent', align: 'left' }
            ]
          },
          suppressRowClickSelection: true, // 禁止点击行内容触发选中
        }
      },
      defaultcolumnDefs: [
        {
          headerCheckboxSelection: true, // 表头显示全选复选框
          checkboxSelection: true,      // 每行显示复选框
          width: 50,
        },
      ],
      preferenceList: [
        { name: '商标号', field: 'regNumber', width: 100 },
        { name: '商标名称', field: 'tmName', width: 250 },
        { name: '申请人名称', field: 'applicantName', width: 300 },
        { name: '商标类别', field: 'tmType', width: 100 },
        { name: '状态', field: 'status', width: 100 },
        { name: '申请日期', field: 'appDate', width: 150 }
      ],
      dialogVisible: false,
      viewableUserList: [],
      changeData: [], // 当前的更改类型（按客户更改或按申请人更改）
      retrievalDetallShow: false,
      retrievalData: {
        dttId: '',
        regNumber: '',
        tmType: ''
      },
      rules: {
        appNameList: [
          { required: true, message: '请选择申请人名称', trigger: 'blur' },
        ],
      }
    }
  },
  watch: {
  },
  created() {
    this.initTableHeader()
    this.queryList()
    this.agInit()
  },
  methods: {
    isSelectable(row, index) {
      return row.canBeDeleted === 1;
    },
    scrollToTrademarkProcess() {
      const container = document.getElementById('trademark-process');
      if (container) {
        container.scrollIntoView({ behavior: 'smooth' });
      }
    },
    // 选择客户
    selectCustId() {
      if (this.monitorData.custId != "") {
        queryApplicanNameByCustId({custId: this.monitorData.custId}).then(res => {
          this.custListMerge = res.data.map(item => ({applicantName: item.applicantName }))
        })
      }
    },
    callbackList(type) {
      this.retrievalDetallShow=false;
    },
    // 处理保存通知人
    saveMonitor() {
      if(this.viewableUserList.length > 0) {
        updateViewableUserBatch({viewableUserList: this.viewableUserList , ...this.changeData }).then(res => {
          this.$message.success('更改成功!');
          this.changeData = []
          this.dialogVisible = false;
        });
      } else {
        this.$message.error('请选通知人!');
        return
      }
    },
    changeMonitor() {
      if (this.stopList.length === 0) {
        this.$message.error('请选择流程监控!');
        return;
      }
      this.changeData = { pmIdList: this.stopList.map(item => item.pm_Id)};
      this.dialogVisible = true;
    },
    // 根据选择的命令进行处理
    handleChange(command) {
      if (this.stopList.length === 0) {
        this.$message.error('请选择流程监控!');
        return;
      }
      if (command === 'changeByCustomer') {
        this.changeByCustomer();
      } else if (command === 'changeByApplicant') {
        this.changeByApplicant();
      }
    },
    changeByCustomer() {
      const custIdList = this.stopList.filter(item => item.custId);
      if (custIdList.length > 0) {
        this.changeData = { custId: custIdList[0].custId }
        this.dialogVisible = true;
      } else {
        this.$message.error('请选择有客户的流程监控!');
      }
    },
    changeByApplicant() {
      // 获取唯一的申请人名称
      const uniqueApplicantNames = this.stopList
        .filter(item => item.applicantName) // 过滤有 applicantName 的数据
        .map(item => item.applicantName) // 提取 applicantName
        .filter((name, index, array) => array.indexOf(name) === index); // 保留唯一的申请人名称

      if (uniqueApplicantNames.length > 0) {
        this.changeData = { applicantNameList: uniqueApplicantNames }
        this.dialogVisible = true;
      } else {
        this.$message.error('请选择有申请人的流程监控!');
      }
    },
    // 查看商标流程
    viewMonitor(row) {
      this.retrievalDetallShow = true
      this.retrievalData = {
        dttId: row.trademarkNum,
        regNumber: row.trademarkNum,
        tmType: row.tmType
      }
    },
    // ag-grid 图表相关方法
    agInit() {
      this.columnDefs = [...this.defaultcolumnDefs, ...this.preferenceList.map(item => ({
        headerName: item.name,
        field: item.field,
        resizable: true,
        sortable: true,
        width: item.width,
        filter: 'agSetColumnFilter',
        cellRenderer: this.cellRenderer,
        menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
        filterParams: {
          defaultToNothingSelected: true,
          newRowsAction: 'keep',
          comparator: (a, b) => {
            return this.$commonUtils.sort(a, b, item.value)
          }
        },
      }))]
    },
    // 设置列背景颜色
    getRowStyle(params){
      return { background: '#fff' };
      // if (params.node.rowIndex % 2 === 0) {
      //  return { background: '#fff' };
      // }
    },
    // 创建完成后执行的事件
    onGridReady(params) {
      this.gridparams = params
      this.gridApi = params.api
      this.columnApi = params.columnApi
    },
    // 排序/过滤器
    getContextMenuItems(params) {
      if (!params.node || !params.node.data) {
        return []
      }
    },
    // 排序/过滤器
    refreshEvenRowsCurrencyData(params) {
      // if(!params.columnApi.columnController.groupAutoColumns) {
      //   this.gridApi.forEachNode(rowNode => {
      //     rowNode.setDataValue(
      //       'sid',
      //       rowNode.rowIndex + 1)
      //   });
      // }
    },
    cellRenderer(params) {
      return `<span title="${params.value}">${params.value !== undefined && params.value !== null ? params.value : 0}</span>`
    },
    // 商标查询按钮点击事件
    async trademarkSearch() {
      try {
        const newApplicants = this.monitorData.applicantNameList.filter(
          (name) => !this.previousApplicantNameList.includes(name)
        );
        const removedApplicants = this.previousApplicantNameList.filter(
          (name) => !this.monitorData.applicantNameList.includes(name)
        );
        // console.log('newApplicants',newApplicants)
        // console.log('removedApplicants',removedApplicants)
        // 查询新增的申请人
        for (const applicantName of newApplicants) {
          const data = (await this.selectApp(applicantName)) || [];
          if (Array.isArray(data)) {
            this.applist.push(...data);
          } else {
            console.warn(`接口返回值不是数组，跳过：${data}`);
          }
        }

        // 移除被删除的申请人
        this.applist = this.applist.filter(
          (item) => !removedApplicants.includes(item.applicantName)
        );

        // 更新历史申请人集合
        this.previousApplicantNameList = [...this.monitorData.applicantNameList];
        this.$nextTick(() => {
          if (this.gridApi) {
            this.gridApi.selectAll();
          }
        });
      } catch (err) {
        console.error("商标查询时发生错误：", err);
      }
    },

    // 模拟接口请求，返回 Promise
    selectApp(applicantName) {
      return new Promise((resolve, reject) => {
        searchTmUrl({ applicantName: applicantName, pageSize: 99999, pageNo: 1 })
        // queryTrademarkByApplicationName({ applicantNameList: [applicantName]})
          .then((res) => {
            // 确保返回的数据是有效的
            if (res && Array.isArray(res.data)) {
              resolve(res.data); // 返回结果数据
            }
          })
          .catch((error) => {
            // 捕获接口调用错误
            console.error("接口调用失败：", error);
          });
      });
    },
    // 申请人选择
    selectApplicantName(val) {
      this.trademarkSearch()
    }, 
    // 通用的删除函数
    deleteProcessMonitor(pmIdList) {
      if (pmIdList.length === 0) {
        this.$message.error('请选择流程监控!');
        return;
      }

      // 确认删除操作
      this.$confirm('此操作将删除选中的商标流程监控, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        // 执行删除操作
        deleteProcessMonitorBatch({ pmIdList }).then(res => {
          this.$message.success('删除成功!');
          this.queryList();
        });
      });
    },

    // 点击单个删除
    deleteMonitorSingle(row) {
      this.deleteProcessMonitor([row.pm_Id]);
    },
    // 勾选删除
    deleteMonitor() {
      const pmIdList = this.stopList.map(item => item.pm_Id);
      this.deleteProcessMonitor(pmIdList);
    },
    // 处理删除逻辑
    handleDelete(command) {
      if (command === 'deleteByCustomer') {
        this.deleteByCustomer();
      } else if (command === 'deleteByApplicant') {
        this.deleteByApplicant();
      }
    },
     // 按客户删除
    deleteByCustomer() {
      if (this.stopList.length === 0) {
        this.$message.error('请选择流程监控!');
        return;
      }

      const custIdList = this.stopList.filter(item => item.custId);
      if (custIdList.length > 0) {
        const custName = custIdList[0].custName;
        this.$confirm(`此操作将删除客户“${custName}”的所有商标流程监控, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          deleteProcessMonitorBatch({ custId: custIdList[0].custId }).then(res => {
            this.$message.success('删除成功!');
            this.queryList();
          });
        });
      } else {
        this.$message.error('请选择有客户的流程监控!');
      }
    },

    // 按申请人删除
    deleteByApplicant() {
      if (this.stopList.length === 0) {
        this.$message.error('请选择流程监控!');
        return;
      }

      // 获取唯一的申请人名称
      const uniqueApplicantNames = this.stopList
        .filter(item => item.applicantName) // 过滤有 applicantName 的数据
        .map(item => item.applicantName) // 提取 applicantName
        .filter((name, index, array) => array.indexOf(name) === index); // 保留唯一的申请人名称

      if (uniqueApplicantNames.length > 0) {
        const applicantNames = uniqueApplicantNames.join(",");
        this.$confirm(`此操作将删除申请人“${applicantNames}”下的所有商标流程监控, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          deleteProcessMonitorBatch({ applicantNameList: uniqueApplicantNames }).then(res => {
            this.$message.success('删除成功!');
            this.queryList();
          });
        });
      } else {
        this.$message.error('请选择有申请人的流程监控!');
      }
    },
    // 全局导出
    // exportList(flag) {
    //   // 创建导出查询对象
    //   let exportQuery = {}
    //   if (flag === 2) {
    //     if (this.stopList.length === 0) {
    //       this.$message.warning('请导出选择流程监控!');
    //       return;
    //     }
    //     exportQuery= { pmIdList: this.stopList.map(item => item.pm_Id), ...this.queryData};
    //   } else if (flag === 1) {
    //     exportQuery = this.queryData
    //   }
    //   // 调用导出接口
    //   processMonitorExportExcel(exportQuery).then(res => {
    //     this.downLoad(res.data)
    //   })
    // },
    exportList(flag) {
      this.exportType = flag
      this.exportQueryModel = JSON.stringify(this.queryData)
      if (flag == 2) {
        this.selectionOptionState = true;
        this.multipleTypeText = '列表导出';
      } else if (flag == 1) {
        this.selectionOptionState = true
      }
    },
    // 附件下载
    downLoad(data) {
      const url = data
      const downData = {
        url: `ipdoc${url}`,
        success() {
          // notify.close()
        }
      }
      this.$commonUtils.downLoadAll(downData)
    },
    closeSelect() {
      this.selectionState = false
      this.selectionOptionState = false
    },
    getCurrentRowsData(key) {
      return this.monitorList.map(item => item[key])
    },
    filterKeyLight(text) {
      if (!this.filterText) return text;
      if (!text) return text;
      const result = text.replace(
          new RegExp(this.filterText, "g"),
          `<span style='color: #3B8CCA !important;font-weight: bold;font-size: 16px;'>${this.filterText}</span>`
      );
      return result;
    },
    handleClose(tag) {
      this.monitorData.imageElementList.splice(this.monitorData.imageElementList.findIndex(item => item.factorId == tag.factorId), 1)
    },
    changeFilter(val) {
      const longList = this.$commonUtils.extractTree(this.treeData, 'child').filter(item => item.label.toLowerCase().indexOf(this.filterText.toLowerCase()) >= 0)
      this.defaultExpandedKeys.push(...longList.map(item => item.factorId))
      this.defaultExpandedKeys = [...new Set(this.defaultExpandedKeys)]
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    sortChangeOut(a, b, c) {
      this.tableHeadFilters = this.$commonUtils.tableFilter(this.$refs.tableList.tableData || [])
    },
    filterHandler(value, row, column) {
      const property = column['property']
      return row[property] === value
    },
    initTableHeader() {
      this.$set(this, 'tableHeader', JSON.parse(localStorage.getItem(this.$options.name)) || {})
      this.tableDefaultList.forEach(item => {
        item.width = this.tableHeader[item.value] || 'auto'
      })
    },
    headerDrage(newWidth, oldWidth, column) {
      this.tableHeader[column.property] = newWidth
      localStorage.setItem(this.$options.name, JSON.stringify(this.tableHeader))
    },
    closeDialog(flag, data) {
      if(flag) {
        this.title = ''
        this.monitorView = false
        this.monitorData = JSON.parse(JSON.stringify(this.defaultData))
        this.custArray = []
        this.applist = []
        this.previousApplicantNameList = []
      }else{
        this.monitorView = false
      }
    },
    // 获取select行数
    getSelectedRows() {
      if (this.gridApi) {
        const selectedRows = this.gridApi.getSelectedRows();
        const selectedData = selectedRows.map(node => ({
          regNumber: node.regNumber,
          applicantName: node.applicantName,
          appDate: node.appDate,
          tmType: node.tmType,
          tmName: node.tmName
        }));
        return selectedData
      }
    },
    async submitData() {
      // if (!this.monitorData.custId && this.monitorData.applicantNameList.length <= 0) {
      //   this.$message.error('客户或申请人必须填写一项')
      //   return;
      // }
      if (this.monitorData.applicantNameList.length <= 0) {
        this.$message.error('请选择申请人')
        return;
      }
      // 商标列表
      if (this.monitorData.applicantNameList.length > 0 && this.applist.length > 0) {
        this.monitorData.trademarkNumberList = this.getSelectedRows()
      }
      addProcessMonitorBatch(this.monitorData).then(res => {
        this.$message.success('新建成功!')
        this.closeDialog('add', res.data)
        this.queryList(1)
      })
    },
    addMonitor() {
      // this.monitorData = JSON.parse(JSON.stringify(this.defaultData))
      this.title = '新建'
      this.monitorView = true
    },
    handleSelectionAll(list) {
      list = list.filter(item => item != undefined)
      this.stopList = list
    },
    handleCompanySelectionAll(list) {
      list = list.filter(item => item != undefined)
      this.selectCompanyList = list
    },
    handleSelectionChange(list) {
      list = list.filter(item => item != undefined)
      this.stopList = list
    },
    handleCompanySelectionChange(list) {
      list = list.filter(item => item != undefined)
      this.selectCompanyList = list
    },
    tableRowClassName({row, rowIndex}) {
      if (rowIndex % 2) {
        return 'single-row'
      } else {
        return 'duouble-row'
      }
    },
    clickSort(sort) {
      this.queryData.sort = sort
      this.queryList(1)
    },
    // 查询申请人
    remotepaternalUnit(query) {
      if (query != "") {
        queryAllUrl({applicantName: query, pageSize: 100}).then(res => {
          this.custListMerge = this.$commonUtils.unique(res.data, 'appId').map(item => ({applicantName: item.applicantName }))
        })
      }
    },
    // 查询客户
    remotepaternalUnit1(query) {
      console.log(query,'测试')
      if (query !== "") {
        queryCustomerNameIdUrl({keyword: query, isCustomer: 1, pageSize: 100}).then(res => {
          this.custArray = this.$commonUtils.unique(res.data, 'custId')
        })
      }
    },
    queryList(flag) {
      if (flag === 1) {
        this.listQuery.pageNo = 1
      }
      queryProcessMonitorList(this.$commonUtils.cleanNullAttr({...this.listQuery, ...this.queryData })).then(res => {
        this.total = res.total
        this.monitorList = res.data
        this.tableHeadFilters = this.$commonUtils.tableFilter(this.monitorList)
        this.tableKeyOut = !this.tableKeyOut
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.topSearch {
  display: flex;
  flex-wrap: wrap;
}

.ellipsis1 {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

> > > .el-table {
  margin-bottom: 15px;

  .el-table__header-wrapper {
    /*border: 1px solid #EBEEF5;*/
    /*border-bottom: none;*/

    th {
      padding: 7px 0;
      background-color: #0D8CD6;
      font-size: 14px;
      color: #fff;
      font-weight: normal;

      .el-table__column-filter-trigger {
        .el-icon-arrow-down {
          color: #fff;
          font-size: 16px;
        }
      }
    }

    .cell {
      height: 23px;
      line-height: 23px;
      display: flex;

      .caret-wrapper {
        height: 23px !important;

        .ascending {
          top: 0 !important;
        }

        .descending {
          bottom: 1px !important;
        }
      }

      .el-table__column-filter-trigger {
        height: 23px;
        line-height: 23px;
      }
    }
  }
}

> > > .single-row {
  background-color: #F7F6FD;
}

> > > .double-row {
  background-color: #EBEBEB;
}

> > > .el-switch__label--right {
  height: 28px;
  line-height: 28px;
}

.el-switch {
  height: 28px;
  line-height: 28px;
}

> > > .el-dialog__header {
  background-color: #8AB2FC;
  padding: 10px;

  .el-dialog__title {
    color: #fff;
  }

  .el-dialog__close {
    color: #fff;
  }
}

> > > .jh-virtual-select {
  height: auto !important;
}

.classNumber {
  display: flex;
  flex-wrap: wrap;

  div {
    width: 25px;
    height: 25px;
    margin: 5px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid;
    cursor: pointer;
  }
}

> > > .el-table td, > > > .el-table th {
  padding: 5px 0;
}

.avatar-uploader {
  /deep/ .el-form-item__label {
    height: 154px;
    line-height: 154px;
    width: 30%;
  }

  height: 154px;

  /deep/ .el-upload {
    border: 1px dashed #b6b2b2;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    margin-top: 4px;
  }
}

.avatar-uploader {
  /deep/ .el-upload:hover {
    border-color: #409eff;
  }
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
  border: 1px dashed #d9d9d9;
}

.avatar {
  width: 100px;
  height: 100px;
  display: block;
}

.abow_dialog {
  display: flex;
  justify-content: center;
  align-items: center;
  > > > .el-dialog {
    //position: absolute;
    //display: flex;
    //top: 50%;
    //left: 50%;
    margin: 0 !important;
    //transform: translate(-50%, -50%);
    height: calc(85% - 30px);
    max-width: calc(100% - 30px);
    display: flex;
    flex-direction: column;
  }

  > > > .el-dialog__body {
    overflow: auto;
  }
}
.custom-tree-node {
  padding-left: 5px;
}
  .export {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
.rightPanel {
  //width: 100%;
  width: 1000px;
  height: calc(100vh - 40px);
  position: fixed;
  //top: 4.5vh;
  top: 40px;
  right: -17px;
  box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.05);
  transition: all 0.25s cubic-bezier(0.7, 0.3, 0.1, 1);
  /*transform: translate(100%);*/
  background: #fff;
  z-index: 1998;
  text-align: center;

}
.close-btn {
  position: fixed;  /* 固定定位 */
  top: 10px;        /* 距离顶部10px */
  left: 10px;       /* 距离左侧10px */
  z-index: 1000;    /* 确保按钮在最上层 */
}
.scroll-container {
  max-height: 250px;
  overflow-y: auto;
  padding-right: 10px;
}

.divider {
  border-top: 1px dashed #ccc;
  margin: 5px 0;
}

.highlight {
  color: #333;
  background-color: #ffff00;
}
.highlight-icon {
  transition: color 0.3s; /* 添加过渡效果 */
}

.highlight-icon:hover {
  color: #409eff; /* 鼠标移入时高亮显示的颜色 */
}
</style>
