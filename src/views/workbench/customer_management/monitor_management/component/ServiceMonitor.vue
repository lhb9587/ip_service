<template>
  <div>
    <div class="topSearch">
      <el-select :clearable="false" size="mini" style="margin-bottom: 10px;" @change="queryList(1)" default-first-option
                 v-model="queryData.annNum"
                 filterable placeholder="期号" clearable>
        <el-option
            v-for="item in annNumList"
            :key="item"
            :label="item"
            :value="item">
        </el-option>
      </el-select>
      <el-select size="mini" style="margin-left: 10px" default-first-option :clearable='true'
                 v-model="queryData.custName"
                 no-match-text='暂无数据' @change="queryList(1)"
                 filterable reserve-keyword placeholder="选择客户"
                 clearable
      >
        <el-option v-for="(item,key) in custListMerge" :key="key" :label="item.fullname"
                   :value="item.fullname">
        </el-option>
      </el-select>
      <el-input clearable style="width: 180px;margin-left: 10px" placeholder="申请人/收件人" size="mini"
                @change="queryList(1)"
                v-model="queryData.companyname"
      >
      </el-input>
      <!--      <el-input clearable style="width: 180px;margin-left: 10px" placeholder="收件人查询" size="mini"-->
      <!--                @change="queryList(1)"-->
      <!--                v-model="queryData.recipient"-->
      <!--      >-->
      <!--      </el-input>-->
      <!--      <el-select @change="queryList" size="mini" style="margin-left: 10px;width: 120px" default-first-option-->
      <!--                 v-model="queryData.monitorType"-->
      <!--                 clearable filterable placeholder="监控类型">-->
      <!--        <el-option-->
      <!--          v-for="item in [{label: '文字', value: 1}, {label: '图形', value: 2}]"-->
      <!--          :key="item.value"-->
      <!--          :label="item.label"-->
      <!--          :value="item.value">-->
      <!--        </el-option>-->
      <!--      </el-select>-->
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
      <div class="fl-ac-jc" style="margin-left: 25px">
        <el-button style="height: 28px;margin-left: 5px" type="success" round size="mini" @click="exportExcel">
          <span class="el-icon-view"></span>
          导出Excel
        </el-button>
      </div>
      <div class="fl-ac-jc" style="margin-left: 25px;">
        <el-switch
            v-model="queryData.dispose"
            active-color="#13ce66"
            inactive-color="#DCDFE6"
            active-text="包括已处理"
            @change="queryList(1)"
        >
        </el-switch>
      </div>
      <div class="fl-ac-jc" style="margin-left: 25px;margin-bottom: 10px">
        <el-switch
            v-model="queryData.state"
            active-color="#13ce66"
            inactive-color="#DCDFE6"
            active-text="包括已停止"
            @change="queryList(1)"
        >
        </el-switch>
      </div>
      <!--      <div class="fl-ac-jc" style="margin-left: 25px;margin-bottom: 10px;">-->
      <!--        <el-switch-->
      <!--          v-model="queryData.nullResult"-->
      <!--          active-color="#13ce66"-->
      <!--          inactive-color="#DCDFE6"-->
      <!--          active-text="包括无结果"-->
      <!--          @change="queryList()"-->
      <!--        >-->
      <!--        </el-switch>-->
      <!--      </div>-->
      <!--      <div class="fl-ac-jc" style="margin-left: 25px">-->
      <!--        <el-button style="height: 28px;margin-left: 5px" type="primary" size="mini" @click="addMonitor">-->
      <!--          <span class="el-icon-upload"></span>-->
      <!--          新建-->
      <!--        </el-button>-->
      <!--        <el-button style="height: 28px;margin-left: 5px" type="danger" size="mini" @click="stopMonitor">-->
      <!--          <span class="fl-ac-jc">-->
      <!--            <img src="./stop.svg" width="13" height="13" alt="">-->
      <!--            <span style="margin-left: 2px">停止</span>-->
      <!--          </span>-->
      <!--        </el-button>-->
      <!--      </div>-->
    </div>
    <el-table
        ref="tableList"
        :key="tableKeyOut"
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
          :width="item.width" sortable
          :sort-method="(a, b) => $commonUtils.sort(a[item.value], b[item.value])"
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
            <span v-if="scope.row[item.value] === 2">国内</span>
            <span v-if="scope.row[item.value] === 1">国际</span>
          </div>
          <div v-else-if="item.value === 'dispose'">
            <span v-if="scope.row[item.value] === 1">已处理</span>
            <!--            <span v-if="scope.row[item.value] === 2">已导出</span>-->
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
      <!--      <pl-table-column label="操作" align="left" class-name="small-padding fixed-width" width="80">-->
      <!--        <template slot-scope="scope">-->
      <!--          <div style="display: flex;;">-->
      <!--            <el-button type="primary" size="mini" @click="viewMonitor(scope.row)">-->
      <!--              <span class="el-icon-view"></span>-->
      <!--            </el-button>-->
      <!--            &lt;!&ndash;            <el-button type="danger" size="mini" v-if="scope.row.state" @click="stopMonitorSingle(scope.row)">&ndash;&gt;-->
      <!--            &lt;!&ndash;              <span class="fl-ac-jc">&ndash;&gt;-->
      <!--            &lt;!&ndash;                <img src="./stop.svg" width="13" height="13" alt="">&ndash;&gt;-->
      <!--            &lt;!&ndash;              </span>&ndash;&gt;-->
      <!--            &lt;!&ndash;            </el-button>&ndash;&gt;-->
      <!--          </div>-->
      <!--        </template>-->
      <!--      </pl-table-column>-->
    </el-table>

    <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.pageNum"
        :limit.sync="listQuery.pageSize"
        @pagination="queryList"
        :pageSizes="pageSizesList"
    />

    <bottom-tags :bottom-info="bottomInfo" v-if="bottomInfo.annNum"></bottom-tags>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import {queryCustomerNameIdUrl} from "../../../../../api/customerList";
import {
  downloadMonitorListExcel, downloadSdResultExcel, queryMonitorCustomer,
  queryMonitorResult,
  queryMonitorResultList, queryMonitorResultMessage,
  queryoObjectHasResult
} from "../../../../../api/monitor";
import BottomTags from "@/views/workbench/customer_management/monitor_management/component/BottomTags.vue";

export default {
  name: "ServiceMonitor",
  components: {
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
      tableKeyOut: false,
      tableHeadFilters: {},
      supplierList: [{label: '白兔', value: 1}, {label: '社文', value: 2}, {label: '摩知轮', value: 3}, {
        label: 'IPS',
        value: 4
      },{label:'太原数世',value:5}],
      bottomInfo: {
        annNum: '',
        exitsResult: '',
        notExitsResult: ''
      },
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
          title: '注册号',
          value: 'applyno',
          width: '100'
        },
        {
          title: '商标名称',
          value: 'markname',
          width: '150'
        },
        {
          title: '申请人',
          value: 'companyname',
          width: '150'
        },
        {
          title: '工作组',
          value: 'wkgName',
          width: '200'
        },
        {
          title: '期号',
          value: 'annNum',
          width: '80'
        },
        {
          title: '公告日期',
          value: 'annDate',
          width: '120'
        },
        {
          title: '原发文日期',
          value: 'originalDispatchDate',
          width: '120'
        },
        {
          title: '发文类型',
          value: 'docType',
          width: 'auto'
        },
        {
          title: '发文编号',
          value: 'docNum',
          width: 'auto'
        },
        {
          title: '收件人',
          value: 'changeUser',
          width: 'auto'
        },
        {
          title: '客户名称',
          value: 'custName',
          width: '200px'
        },
        {
          title: '供应商',
          value: 'supplierStr',
          width: '80'
        },
        {
          title: '已处理',
          value: 'disposeStr',
          width: '80'
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
          width: 'auto'
        },
        {
          title: '图形',
          value: 'imgpath',
          width: '50'
        },
        {
          title: '原图',
          value: 'url',
          width: '50'
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
          width: 'auto'
        },
        {
          title: '工作组',
          value: 'wkgName',
          width: '200'
        },
        {
          title: '类别',
          value: 'marktypenum',
          width: '50'
        },
        {
          title: '商品项目',
          value: 'goods',
          width: '300'
        },
      ],
      monitorList: [],
      total: 0,
      pageSizesList: [10, 50, 100, 200],
      listQuery: {
        pageNum: 1,
        pageSize: JSON.parse(localStorage.getItem('pageSize')) ? JSON.parse(localStorage.getItem('pageSize')).find(item => item.name == this.$route.name) ? JSON.parse(localStorage.getItem('pageSize')).find(item => item.name == this.$route.name).pageSize : 10 : 10
      },
      // workgroupNamesList: [],
      custListMerge: [],
      checkNumberList: [],
      checkNumberList1: [],
      // annNumList: [],
      queryData: {
        recipient: undefined,
        companyname: undefined,
        // nullResult: true,
        dispose: false,
        annNum: undefined,
        state: false,
        sort: 'ASC',
        orderRule: undefined,
        custName: undefined,
        wkgId: undefined,
        template: undefined,
        monitorType: 4,
        supplier: undefined
      },
      tableHeader: {}
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
    closeDialog(isSearch) {
      this.title = ''
      this.annNum = undefined
      this.monitorView = false
      this.queryList()
    },
    exportExcel() {
      if (!this.stopList.length) {
        this.$message.error('请勾选导出项！')
        return
      }
      downloadSdResultExcel({
        monitorList: this.stopList.map(item => item.id)
      }).then(res => {
        res.data && this.$commonUtils.downLoadAll({url: res.data})
        this.queryList()
      })
    },
    viewMonitor(row) {
      queryMonitorResult({
        whdId: row.whdId,
        annNum: row.annNum,
        monitorType: 4
      }).then(res => {
        this.annNum = row.annNum
        this.resultList = res.data
        this.monitorView = true
        this.title = '监控结果'
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
        monitorType: 4,
        annNum: this.stopList.find(item => item.annNum).annNum,
        monitorList: this.stopList.map(item => item.id)
      }).then(res => {
        this.annNum = this.stopList.find(item => item.annNum).annNum
        this.resultList = res.data.flat()
        this.monitorView = true
        this.title = '监控结果'
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
      const dispose = this.queryData.dispose ? 1 : undefined
      // const nullResult = this.queryData.nullResult ? 1 : undefined
      queryoObjectHasResult(this.$commonUtils.cleanNullAttr({
        ...this.listQuery, ...this.queryData, trademarkMonitoringType: 3,
        state,
        dispose,
        // nullResult
      })).then(res => {
        this.total = res.total
        this.monitorList = res.data
        this.monitorList.forEach(item => {
          item.disposeStr = item.dispose ? '已处理' : '未处理'
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
        monitorType: 4,
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

> > > .el-table {
  /*margin-top: 10px;*/
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

    .el-table__header {
      .cell {
        height: 23px;
        line-height: 23px;
        display: flex;
        flex-wrap: nowrap;

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

</style>
