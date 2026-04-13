<template>
  <div>
    <div class="topSearch">
      <el-select size="mini" style="margin-bottom: 10px" default-first-option :clearable='true'
                 v-model="queryData.custName"
                 no-match-text='暂无数据' @change="queryList(1)"
                 loading-text='正在查询' clearable filterable reserve-keyword placeholder="选择客户"
      >
        <el-option v-for="(item,key) in custListMerge" :key="key" :label="item.fullname"
                   :value="item.fullname">
        </el-option>
      </el-select>
      <el-select :clearable="false" size="mini" style="margin-left: 10px" clearable @change="queryList(1)"
                 default-first-option
                 v-model="queryData.annNum"
                 filterable placeholder="期号">
        <el-option
            v-for="item in annNumList"
            :key="item"
            :label="item"
            :value="item">
        </el-option>
      </el-select>
      <el-select @change="queryList(1)" size="mini" style="margin-left: 10px;width: 120px" default-first-option
                 v-model="queryData.template"
                 clearable filterable placeholder="模板类型">
        <el-option
            v-for="item in [{label: '中文', value: 2}, {label: '英文', value: 1}]"
            :key="item.value"
            :label="item.label"
            :value="item.value">
        </el-option>
      </el-select>
      <el-select clearable size="mini" style="margin-left: 10px" @change="queryList(1)" default-first-option
                 v-model="queryData.wkgId"
                 filterable placeholder="工作组">
        <el-option
            v-for="item in workgroupNamesList"
            :key="item.wkgId"
            :label="item.groupName"
            :value="item.wkgId">
        </el-option>
      </el-select>
      <el-select @change="queryList(1)" size="mini" style="margin-left: 10px;width: 120px" default-first-option
                 v-model="queryData.monitorType"
                 clearable filterable placeholder="监控类型">
        <el-option
            v-for="item in [{label: '文字', value: 1}, {label: '图形', value: 2}]"
            :key="item.value"
            :label="item.label"
            :value="item.value">
        </el-option>
      </el-select>
      <el-input clearable style="width: 180px;margin-left: 10px" placeholder="监控内容/商标号" size="mini"
                @change="queryList(1)"
                v-model="queryData.monitorItem"
      >
      </el-input>
      <el-select @change="queryList" size="mini" style="margin-left: 10px;width: 120px" default-first-option
                 v-model="queryData.supplier"
                 clearable filterable placeholder="供应商">
        <el-option
            v-for="item in supplierList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
        </el-option>
      </el-select>
      <div class="fl-ac-jc">
        <el-select @change="queryList(1)" size="mini" style="margin-left: 10px;width: 120px" default-first-option
                   v-model="queryData.orderRule"
                   clearable filterable placeholder="排序字段">
          <el-option
              v-for="item in [
            {label: '监控结果数量', value: 'mCount'},
             {label: '商标号', value: 'regNumber'},
              {label: '客户', value: 'custName'},
               {label: '监控内容', value: 'monitorItem'},
               ]"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
        <el-button @click="clickSort('asc')" v-if="queryData.sort === 'desc'"
                   style="height: 28px;margin-left: 5px" type="primary" size="mini">
          <span class="el-icon-sort-up"></span>
          升序
        </el-button>
        <el-button @click="clickSort('desc')" v-else
                   style="height: 28px;margin-left: 5px" type="primary" size="mini">
          <span class="el-icon-sort-down"></span>
          倒序
        </el-button>
      </div>
      <div class="fl-ac-jc" style="margin-left: 25px">
        <el-button style="height: 28px;margin-left: 5px" type="success" round size="mini" @click="clickReportView">
          <span class="el-icon-view"></span>
          查看报告
        </el-button>
      </div>
      <div class="fl-ac-jc" style="margin-left: 25px;">
        <el-switch
            v-model="queryData.handle"
            active-color="#13ce66"
            inactive-color="#DCDFE6"
            active-text="包括已处理"
            @change="queryList(1)"
        >
        </el-switch>
      </div>
      <div class="fl-ac-jc" style="margin-left: 25px;">
        <el-switch
            v-model="queryData.state"
            active-color="#13ce66"
            inactive-color="#DCDFE6"
            active-text="包括已停止"
            @change="queryList(1)"
        >
        </el-switch>
      </div>
      <div class="fl-ac-jc" style="margin-left: 25px;margin-bottom: 10px;">
        <el-switch
            v-model="queryData.nullResult"
            active-color="#13ce66"
            inactive-color="#DCDFE6"
            active-text="包括无结果"
            @change="queryList(1)"
        >
        </el-switch>
      </div>
    </div>
    <el-table
        ref="tableList"
        :key="tableKeyOut"
        use-virtual
        border
        :row-class-name="({row, rowIndex}) => tableRowClassName({row, rowIndex})"
        :data="monitorList"
        fit
        empty-text="暂无数据"
        highlight-current-row
        current-row-key
        style="width: 100%;"
        :height="clientHeight - 30"
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
      >
      </el-table-column>
      <el-table-column
          v-for="(item,index) in tableDefaultList"
          :key="item.value"
          :width="item.width"
          :sort-method="(a, b) => $commonUtils.sort(a[item.value], b[item.value])"
          sortable
          :label="item.title"
          align="left"
          :prop="item.value"
          filter-placement="bottom-start"
          :filters="tableHeadFilters[item.value]"
          :filter-method="filterHandler"
      >
        <template slot-scope="scope">
          <div v-if="item.value === 'state'">
            {{ scope.row[item.value] ? '否' : '是' }}
          </div>
          <div v-else-if="item.value === 'template'">
            <span v-if="scope.row[item.value] === 1">国际</span>
            <span v-if="scope.row[item.value] === 2">国内</span>
          </div>
          <div v-else-if="item.value === 'handle'">
            <span v-if="scope.row[item.value] === 1">已处理</span>
            <span v-if="scope.row[item.value] === 2">已导出</span>
            <span v-if="!scope.row[item.value]">未处理</span>
          </div>
          <div v-else-if="item.value === 'imgUrL'">
            <img v-if="scope.row[item.value]" class="filterTableTmg"
                 :src="scope.row[item.value].includes('http') ? scope.row[item.value] : `ipdoc${scope.row[item.value]}`"
                 width="32"
                 height="32">
            <img v-else class="filterTableTmg" src="./picFail.svg" width="32" height="32" alt="">
          </div>
          <div v-else class="ellipsis1" :title="scope.row[item.value]">{{ scope.row[item.value] }}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" align="left" width="80" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <div style="display: flex;;">
            <el-button type="primary" size="mini" @click="viewMonitor(scope.row)">
              <span class="el-icon-view"></span>
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.pageNum"
        :limit.sync="listQuery.pageSize"
        @pagination="queryList"
        :pageSizes="pageSizesList"
    />

    <el-dialog
        title="监控结果"
        top="10"
        :fullscreen="false" :show-close="true"
        :close-on-click-modal="false" :modal="true"
        :visible.sync="monitorView"
        width="calc(100% - 20px)"
        class="abow_dialog"
        :before-close="closeDialog"
        style="margin-top: 10px; height: calc(100vh - 30px)"
    >
      <el-table
          v-if="monitorView"
          :key="tableKey"
          border
          :row-class-name="({row, rowIndex}) => tableRowClassName({row, rowIndex})"
          ref="todoTaskMultiple"
          :data="resultList"
          fit
          empty-text="暂无数据"
          highlight-current-row
          current-row-key
          style="width: 100%;"
          :height="clientHeight + 55"
          @select="handleResultSelectionChange"
          @select-all="handleResultSelectionAll"
          @sort-change="sortChange"
          @filter-change="sortChange"
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
        >
        </el-table-column>
        <el-table-column
            v-for="(item,index) in tableDefaultList1"
            :key="item.value"
            :width="item.width"
            :label="item.title"
            align="left"
            :prop="item.value"
            :sort-method="(a, b) => $commonUtils.sort(a[item.value], b[item.value])"
            sortable
            filter-placement="bottom-start"
            :filters="headFilters[item.value]"
            :filter-method="filterHandler">
          <template slot-scope="scope">
            <div v-if="['state'].includes(item.value)">
              {{ scope.row[item.value] ? '否' : '是' }}
            </div>
            <div v-else-if="item.value === 'template'">
              <span v-if="scope.row[item.value] === 1">国内</span>
              <span v-if="scope.row[item.value] === 2">国际</span>
            </div>
            <div v-else-if="item.value === 'handle'">
              <span v-if="scope.row[item.value] === 1">已处理</span>
              <span v-if="!scope.row[item.value]">未处理</span>
            </div>
            <div v-else-if="item.value === 'url' || item.value === 'imgpath' || item.value === 'imageUrl'">
              <img v-if="scope.row[item.value]" class="filterTableTmg" :src="scope.row[item.value]" width="100%"
                   height="60">
              <img v-else class="filterTableTmg" src="./picFail.svg" width="32" height="32" alt="">
            </div>
            <div v-else class="ellipsis1" :title="scope.row[item.value]">{{ scope.row[item.value] }}</div>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer fl-ac-jc">
        <el-button style="height: 28px;margin-left: 5px" type="success" round size="mini" @click="exportExcel">
          <span class="el-icon-view"></span>
          导出Excel
        </el-button>
        <el-button size="mini" round type="success" style="margin-left: 15px" @click="() => closeDialog(false)">
          <span class="el-icon-close"></span>
          关闭
        </el-button>
      </span>
    </el-dialog>

    <bottom-tags :bottom-info="bottomInfo" v-if="bottomInfo.annNum"></bottom-tags>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import {queryCustomerNameIdUrl} from "../../../../../api/customerList";
import {
  downloadMonitorListExcel, queryMonitorCustomer,
  queryMonitorResult,
  queryMonitorResultList, queryMonitorResultMessage,
  queryoObjectHasResult
} from "../../../../../api/monitor";
import BottomTags from "./BottomTags.vue";
import Dismiss from "@/views/workbench/hrm/approval_management/components/found_examine/Dismiss.vue";

export default {
  name: "FirstTrialMonitor",
  components: {
    Dismiss,
    BottomTags,
    Pagination
  },
  props: {
    custList: {
      default: () => []
    },
    annNumList: {
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
  },
  data() {
    return {
      currentRowKey:null,
      supplierList: [{label: '白兔', value: 1}, {label: '社文', value: 2}, {label: '摩知轮', value: 3}, {
        label: 'IPS',
        value: 4
      },{label:'太原数世',value:5}],
      bottomInfo: {
        annNum: '',
        exitsResult: '',
        notExitsResult: ''
      },
      tableKey: false,
      tableKeyOut: false,
      annNum: undefined,
      resultList: [],
      resultSelectionList: [],
      stopList: [],
      usericonSendData: {
        tokenID: "",
      },
      fuzzyList: [{label: '高度近似', value: 0}, {label: '中度近似', value: 1}, {label: '低度近似', value: 2}],
      custArray: [],
      defaultData: {
        custId: '',
        supplier: '',
        template: '',
        monitorType: '',
        fuzzy: '',
        regNumber: '',
        monitorItem: '',
        monitorDescription: '',
        keyCategories: '',
        ignoreCategories: '',
        startIssue: '',
        endIssue: '',
        wkgId: '',
        userIdList: []
      },
      monitorData: {
        custId: '',
        supplier: '',
        template: '',
        monitorType: '',
        fuzzy: '',
        regNumber: '',
        monitorItem: '',
        monitorDescription: '',
        keyCategories: '',
        ignoreCategories: '',
        startIssue: '',
        endIssue: '',
        wkgId: '',
        userIdList: []
      },
      monitorView: false,
      title: '',
      tableDefaultList: [
        {
          title: '期号',
          value: 'annNum',
          width: 'auto'
        },
        {
          title: '类型',
          value: 'monitorTypeStr',
          width: 'auto'
        },
        {
          title: '模板类型',
          value: 'templateStr',
          width: 'auto'
        },
        {
          title: '图片',
          value: 'imgUrL',
          width: '50'
        },
        {
          title: '商标号',
          value: 'regNumber',
          width: 'auto'
        },
        {
          title: '监控内容',
          value: 'monitorItem',
          width: 'auto'
        },
        {
          title: '结果',
          value: 'mCount',
          width: 'auto'
        },
        {
          title: '客户',
          value: 'custName',
          width: 'auto'
        },
        {
          title: '工作组',
          value: 'wkgName',
          width: '200'
        },
        {
          title: '供应商',
          value: 'supplierStr',
          width: '80'
        },
        {
          title: '已处理',
          value: 'handleStr',
          width: 'auto'
        },
      ],
      tableDefaultList1: [
        {
          title: '申请/商标号',
          value: 'applyno',
          width: '120'
        },
        {
          title: '商标名称',
          value: 'markname',
          width: '200'
        },
        {
          title: '图形',
          value: 'imgpath',
          width: '150'
        },
        {
          title: '原图',
          value: 'imageUrl',
          width: '150'
        },
        {
          title: '监控目标',
          value: 'monitorItem',
          width: '110'
        },
        {
          title: '申请日期',
          value: 'applyDate',
          width: '115'
        },
        {
          title: '初审期号',
          value: 'annNum',
          width: '110'
        },
        {
          title: '申请人',
          value: 'companyname',
          width: '300'
        },
        {
          title: '工作组',
          value: 'wkgName',
          width: '200'
        },
        {
          title: '类别',
          value: 'marktypenum',
          width: '75'
        },
        {
          title: '商品项目',
          value: 'goods',
          width: 'auto'
        },
        {
          title: '已占先',
          value: 'isOccupyStr',
          width: '100'
        },
        {
          title: '有异议',
          value: 'isMaliceStr',
          width: '100'
        },
      ],
      monitorList: [],
      total: 0,
      pageSizesList: [10, 50, 100, 200],
      listQuery: {
        pageNum: 1,
        pageSize: JSON.parse(localStorage.getItem('pageSize')) ? JSON.parse(localStorage.getItem('pageSize')).find(item => item.name == this.$route.name) ? JSON.parse(localStorage.getItem('pageSize')).find(item => item.name == this.$route.name).pageSize : 50 : 50
      },
      custListMerge: [],
      queryData: {
        nullResult: false,
        handle: false,
        annNum: undefined,
        state: false,
        sort: 'ASC',
        orderRule: undefined,
        custName: undefined,
        wkgId: undefined,
        template: undefined,
        monitorType: undefined,
        supplier: undefined
      },
      headFilters: {},
      tableHeadFilters: {},
      tableHeader: {},
    }
  },
  created() {
    this.init()
    this.custListMerge = JSON.parse(JSON.stringify(this.custList))
  },
  methods: {
    sortChangeOut(a, b, c) {
      this.tableHeadFilters = this.$commonUtils.tableFilter(this.$refs.tableList.tableData || [])
    },
    sortChange(a, b, c) {
      this.headFilters = this.$commonUtils.tableFilter(this.$refs.todoTaskMultiple.tableData || [])
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
    filterHandler(value, row, column) {
      const property = column['property']
      return row[property] === value
    },
    closeDialog(isSearch) {
      this.title = ''
      this.annNum = undefined
      this.monitorView = false
      // 关闭查看后，需要将查看的数据筛选掉
      if (!this.queryData.handle) {
        this.monitorList = this.monitorList.filter(item => item.id !== this.currentRowKey)
        this.total = this.total - 1
      }else{
        this.queryList()
      }
    },
    exportExcel() {
      if (!this.resultSelectionList.length) {
        this.$message.error('请勾选导出项！')
        return
      }
      this.resultSelectionList.forEach(item => {
        item.uniquKey = item.whdId + item.annNum
      })
      const list = this.$commonUtils.unique(this.resultSelectionList, 'uniquKey')
      const excelImportInfos = list.map(item => ({
        id: item.whdId,
        itemStr: this.resultSelectionList.filter(i => ((i.whdId + i.annNum) === item.uniquKey)).map(j => j.id).join(','),
        annNum: item.annNum
      }))
      downloadMonitorListExcel({
        excelImportInfos
      }).then(res => {
        res.data && this.$commonUtils.downLoadAll({url: res.data})
      })
    },
    viewMonitor(row) {
      this.currentRowKey = row.id
      queryMonitorResult({
        whdId: row.whdId,
        annNum: row.annNum
      }).then(res => {
        this.annNum = row.annNum
        this.resultList = res.data
        this.resultList.forEach(item => {
          item.isOccupyStr = item.isOccupy ? '是' : '否'
          item.isMaliceStr = item.isMalice ? '是' : '否'
        })
        this.monitorView = true
        this.title = '监控结果'
        this.headFilters = this.$commonUtils.tableFilter(this.resultList)
        this.tableKey = !this.tableKey
      })
    },
    clickReportView() {
      if (!this.stopList.length) {
        this.$message.warning('请选择监控目标！')
        return
      }
      if (!this.stopList.find(item => item.annNum)) {
        this.$message.warning('请选择有期号的监控目标！')
        return
      }
      queryMonitorResultList({
        monitors: this.stopList.map(item => ({
          id: item.whdId,
          annNum: item.annNum
        }))
        // annNum: this.stopList.find(item => item.annNum).annNum,
        // monitorList: this.stopList.map(item => item.whdId)
      }).then(res => {
        this.annNum = this.stopList.find(item => item.annNum).annNum
        this.resultList = res.data.flat()
        this.resultList.forEach(item => {
          item.isOccupyStr = item.isOccupy ? '是' : '否'
          item.isMaliceStr = item.isMalice ? '是' : '否'
        })
        this.monitorView = true
        this.title = '监控结果'
        this.headFilters = this.$commonUtils.tableFilter(this.resultList)
        this.tableKey = !this.tableKey
      })
    },
    init() {
      this.initTableHeader()
      this.queryData.annNum = this.annNumList[0]
      this.queryList()
    },
    handleSelectionAll(list) {
      list = list.filter(item => item != undefined)
      this.stopList = list
    },
    handleResultSelectionAll(list) {
      list = list.filter(item => item != undefined)
      this.resultSelectionList = list
    },
    handleResultSelectionChange(list) {
      list = list.filter(item => item != undefined)
      this.resultSelectionList = list
    },
    handleSelectionChange(list) {
      list = list.filter(item => item != undefined)
      this.stopList = list
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
    remotepaternalUnit(query) {
      if (query != "") {
        queryMonitorCustomer({custName: query, pageSize: 100}).then(res => {
          this.custListMerge = this.$commonUtils.unique(res.data, 'custId').map(item => ({fullname: item.custName}))
        })
      } else {
        this.custListMerge = JSON.parse(JSON.stringify(this.custList))
      }
    },
    queryList(flag) {
      if (flag === 1) {
        this.listQuery.pageNum = 1
      }
      const state = this.queryData.state ? undefined : 1
      const handle = this.queryData.handle ? 1 : undefined
      const nullResult = this.queryData.nullResult ? 1 : undefined
      queryoObjectHasResult(this.$commonUtils.cleanNullAttr({
        ...this.listQuery, ...this.queryData, trademarkMonitoringType: 1,
        state,
        handle,
        nullResult
      })).then(res => {
        this.total = res.total
        this.monitorList = res.data
        this.monitorList.forEach(item => {
          item.templateStr = item.template == 1 ? '英文' : item.template == 2 ? '中文' : ''
          item.handleStr = item.handle ? '已处理' : '未处理'
          item.supplierStr = this.supplierList.find(i => i.value == item.supplier) && this.supplierList.find(i => i.value == item.supplier).label || ""
        })
        this.tableHeadFilters = this.$commonUtils.tableFilter(this.monitorList)
        this.tableKeyOut = !this.tableKeyOut
        this.queryData.supplier && this.queryBottomInfo()
      })
    },
    queryBottomInfo() {
      queryMonitorResultMessage({
        supplier: this.queryData.supplier,
        monitorType: this.queryData.monitorType || undefined,
        annNum: this.queryData.annNum,
      }).then(res => {
        this.bottomInfo.annNum = res.data && res.data.annNum || ''
        this.bottomInfo.exitsResult = res.data && res.data.exitsResult || ''
        this.bottomInfo.notExitsResult = res.data && res.data.notExitsResult || ''
      })
    }
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

> > > .el-table, > > > .pl-table {
  /*margin-top: 10px;*/
  margin-bottom: 15px;

  .el-table__header-wrapper, .el-table__fixed-header-wrapper {
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

    .el-table__header {
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

.result-table {
  th {
    box-sizing: border-box;
    height: 70px;
    padding: 7px 0;
    background-color: #0D8CD6;
    font-size: 14px;
    color: #fff;
    font-weight: normal;
  }
}

> > > .el-dialog__body {
  padding-bottom: 10px !important;
}
</style>
