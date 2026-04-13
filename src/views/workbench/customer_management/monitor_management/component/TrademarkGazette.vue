<template>
  <div>
    <div class="topSearch">
      <!--      <el-select size="mini" style="margin-bottom: 10px" default-first-option :clearable='true'-->
      <!--                 v-model="queryData.custName"-->
      <!--                 no-match-text='暂无数据' @change="queryList"-->
      <!--                 loading-text='正在查询' filterable remote reserve-keyword placeholder="选择客户"-->
      <!--                 :remote-method="remotepaternalUnit">-->
      <!--        <el-option v-for="(item,key) in custList" :key="key" :label="item.fullname"-->
      <!--                   :value="item.fullname">-->
      <!--        </el-option>-->
      <!--      </el-select>-->
      <el-input clearable style="width: 180px;margin-right: 10px;width: 220px;" placeholder="输入商标号/名称/申请人搜索"
                size="mini"
                @change="queryList(1)"
                v-model="queryData.combine"
      >
      </el-input>
      <el-select :clearable="false" size="mini" style="margin-bottom: 10px" @change="queryList(1)" default-first-option
                 v-model="queryData.annNum"
                 filterable placeholder="期号" clearable>
        <el-option
            v-for="item in annNumList"
            :key="item"
            :label="item"
            :value="item">
        </el-option>
      </el-select>
      <el-select @change="queryList(1)" size="mini" style="margin-left: 10px;width: 120px;margin-right: 10px"
                 default-first-option
                 v-model="queryData.annType"
                 filterable placeholder="公告类型">
        <el-option
            v-for="item in gazetteList"
            :key="item"
            :label="item"
            :value="item">
        </el-option>
      </el-select>
      <el-input clearable style="width: 180px;margin-right: 10px;width: 80px;" placeholder="类别" size="mini"
                @change="queryList(1)"
                v-model="queryData.marktypenum"
      ></el-input>
      <el-input clearable style="width: 180px;margin-right: 10px;width: 150px;" placeholder="代理人" size="mini"
                @change="queryList(1)"
                v-model="queryData.agentname"
      ></el-input>

      <el-date-picker
          size="mini"
          style="width: 130px;height: 28px;line-height: 28px;"
          v-model="queryData.applyDate"
          value-format="yyyy-MM-dd"
          type="date"
          @change="queryList(1)"
          placeholder="申请日期起">
      </el-date-picker>
      <span style="font-size: 14px;color: #606266;height: 28px;line-height: 28px;">至</span>
      <el-date-picker
          size="mini"
          style="width: 130px;height: 28px;line-height: 28px;"
          v-model="queryData.lastApplyDate"
          value-format="yyyy-MM-dd"
          @change="queryList(1)"
          type="date"
          placeholder="申请日期止">
      </el-date-picker>
      <!--      <el-select clearable size="mini" style="margin-left: 10px" @change="queryList" default-first-option-->
      <!--                 v-model="queryData.wkgId"-->
      <!--                 filterable placeholder="工作组">-->
      <!--        <el-option-->
      <!--          v-for="item in workgroupNamesList"-->
      <!--          :key="item.wkgId"-->
      <!--          :label="item.groupName"-->
      <!--          :value="item.wkgId">-->
      <!--        </el-option>-->
      <!--      </el-select>-->
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
      <!--      <el-select @change="queryList" size="mini" style="margin-left: 10px;width: 120px" default-first-option-->
      <!--                 v-model="queryData.supplier"-->
      <!--                 clearable filterable placeholder="供应商">-->
      <!--        <el-option-->
      <!--          v-for="item in [{label: '白兔', value: '白兔'}, {label: '社文', value: '社文'}, {label: '摩知轮', value: '摩知轮'}]"-->
      <!--          :key="item.value"-->
      <!--          :label="item.label"-->
      <!--          :value="item.value">-->
      <!--        </el-option>-->
      <!--      </el-select>-->
      <!--      <div class="fl-ac-jc">-->
      <!--        <el-select @change="queryList" size="mini" style="margin-left: 10px;width: 120px" default-first-option-->
      <!--                   v-model="queryData.orderRule"-->
      <!--                   clearable filterable placeholder="排序字段">-->
      <!--          <el-option-->
      <!--            v-for="item in [-->
      <!--            {label: '监控结果数量', value: 'mCount'},-->
      <!--             {label: '商标号', value: 'regNumber'},-->
      <!--              {label: '客户', value: 'custName'},-->
      <!--               {label: '监控内容', value: 'monitorItem'},-->
      <!--               ]"-->
      <!--            :key="item.value"-->
      <!--            :label="item.label"-->
      <!--            :value="item.value">-->
      <!--          </el-option>-->
      <!--        </el-select>-->
      <!--        <el-button @click="clickSort('asc')" v-if="queryData.sort === 'desc'"-->
      <!--                   style="height: 28px;margin-left: 5px" type="primary" size="mini">-->
      <!--          <span class="el-icon-sort-up"></span>-->
      <!--          升序-->
      <!--        </el-button>-->
      <!--        <el-button @click="clickSort('desc')" v-else-->
      <!--                   style="height: 28px;margin-left: 5px" type="primary" size="mini">-->
      <!--          <span class="el-icon-sort-down"></span>-->
      <!--          倒序-->
      <!--        </el-button>-->
      <!--      </div>-->
      <!--      <div class="fl-ac-jc" style="margin-left: 25px">-->
      <!--        <el-button style="height: 28px;margin-left: 5px" type="success" round size="mini" @click="clickReportView">-->
      <!--          <span class="el-icon-view"></span>-->
      <!--          查看报告-->
      <!--        </el-button>-->
      <!--      </div>-->
      <!--      <div class="fl-ac-jc" style="margin-left: 25px;">-->
      <!--        <el-switch-->
      <!--          v-model="queryData.handle"-->
      <!--          active-color="#13ce66"-->
      <!--          inactive-color="#DCDFE6"-->
      <!--          active-text="包括已处理"-->
      <!--          @change="queryList()"-->
      <!--        >-->
      <!--        </el-switch>-->
      <!--      </div>-->
      <!--      <div class="fl-ac-jc" style="margin-left: 25px;">-->
      <!--        <el-switch-->
      <!--          v-model="queryData.state"-->
      <!--          active-color="#13ce66"-->
      <!--          inactive-color="#DCDFE6"-->
      <!--          active-text="包括已停止"-->
      <!--          @change="queryList()"-->
      <!--        >-->
      <!--        </el-switch>-->
      <!--      </div>-->
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
        :height="clientHeight"
        @header-dragend="(newWidth, oldWidth, column, event) => {headerDrage(newWidth, oldWidth, column)}"
        @sort-change="sortChangeOut"
        @filter-change="sortChangeOut"
    >
      <el-table-column
          v-for="(item,index) in tableDefaultList"
          :key="item.value"
          :width="item.width"
          :label="item.title"
          align="left"
          :prop="item.value"
          sortable
          :sort-method="(a, b) => $commonUtils.sort(a[item.value], b[item.value])"
          filter-placement="bottom-start"
          :filters="processTableFilters(item.value)"
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
          <div v-else-if="item.value === 'companyname'" v-html="scope.row[item.value]" class="ellipsis1" :title="scope.row[item.value]"></div>
          <div v-else class="ellipsis1" :title="scope.row[item.value]">{{ scope.row[item.value] }}</div>
        </template>
      </el-table-column>
    </el-table>

    <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.pageSize"
        @pagination="queryList"
        :pageSizes="pageSizesList"
    />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import {queryAnnouncementName, queryAnnounnceName, queryoAnnouncement} from "../../../../../api/monitor";

export default {
  name: "TrademarkGazette",
  components: {
    Pagination
  },
  props: {
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
      appDateArray: ['', ''],
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
          width: '80'
        },
        {
          title: '商标号',
          value: 'applyno',
          width: '100'
        },
        {
          title: '名称',
          value: 'markname',
          width: '150'
        },
        {
          title: '状态',
          value: 'lawstatus',
          width: '80'
        },
        {
          title: '类别',
          value: 'marktypenum',
          width: '60'
        },
        {
          title: '注册申请人',
          value: 'companyname',
          width: 'auto'
        },
        {
          title: '代理人',
          value: 'agentname',
          width: 'auto'
        },
        {
          title: '申请日期',
          value: 'applyDateStr',
          width: '120'
        },
        {
          title: '群组',
          value: 'groups',
          width: 'auto'
        }
      ],
      monitorList: [],
      total: 0,
      pageSizesList: [10, 50, 100, 200],
      listQuery: {
        page: 1,
        pageSize: JSON.parse(localStorage.getItem('pageSize')) ? JSON.parse(localStorage.getItem('pageSize')).find(item => item.name == this.$route.name) ? JSON.parse(localStorage.getItem('pageSize')).find(item => item.name == this.$route.name).pageSize : 10 : 10
      },
      custList: [],
      checkNumberList: [],
      checkNumberList1: [],
      queryData: {
        applyDate: undefined,
        lastApplyDate: undefined,
        agentname: undefined,
        marktypenum: undefined,
        annType: '全部',
        combine: undefined,
        annNum: undefined,
      },
      isShow: false,
      iconIsDel: false,
      userIconCust: '',
      gazetteList: [],
      tableHeader: {}
    }
  },
  created() {
    this.init()
  },
  methods: {
    sortChangeOut(a, b, c) {
      this.tableHeadFilters = this.$commonUtils.tableFilter(this.$refs.tableList.tableData || [])
    },
    processTableFilters(columnKey) {
      const filters = this.$commonUtils.tableFilter(this.monitorList);

      // 针对特定列处理数据
      if (columnKey === 'companyname' && filters[columnKey]) {
        return filters[columnKey].map(filter => {
          const plainText = filter.text.replace(/<[^>]+>/g, ''); // 去除 HTML 标签
          return { text: plainText, value: plainText }; // 确保 value 也为纯文本
        });
      }

      // 默认返回其他列的筛选数据
      return filters[columnKey] || [];
    },
    filterHandler(value, row, column) {
      const property = column['property'];

      if (property === 'companyname' && row[property]) {
        const plainText = row[property].replace(/<[^>]+>/g, ''); // 去除 HTML 标签
        return plainText.includes(value); // 用纯文本匹配
      }

      // 其他列的筛选逻辑
      return row[property] === value;
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
    init() {
      this.initTableHeader()
      this.queryData.annNum = this.annNumList[0]
      this.queryList()
      queryAnnouncementName().then(res => {
        this.gazetteList = res.data
        this.gazetteList.unshift('全部')
      })
    },
    clickClassNumber(number) {
      if (this.checkNumberList.find(num => num == number)) {
        this.checkNumberList.splice(this.checkNumberList.findIndex(num => num == number), 1)
      } else {
        this.checkNumberList.push(number)
      }
    },
    clickClassNumber1(number) {
      if (this.checkNumberList1.find(num => num == number)) {
        this.checkNumberList1.splice(this.checkNumberList1.findIndex(num => num == number), 1)
      } else {
        this.checkNumberList1.push(number)
      }
    },
    tableRowClassName({row, rowIndex}) {
      if (rowIndex % 2) {
        return 'single-row'
      } else {
        return 'duouble-row'
      }
    },
    queryList(flag) {
      if (flag === 1) {
        this.listQuery.page = 1
      }
      const annType = this.queryData.annType === '全部' ? undefined : this.queryData.annType
      queryoAnnouncement(this.$commonUtils.cleanNullAttr({
        ...this.listQuery, ...this.queryData, annType
      })).then(res => {
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

</style>
