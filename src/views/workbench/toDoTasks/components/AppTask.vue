<template>
  <div>

    <el-form label-width="136px">
      <el-row>
        <el-form-item label="申请人:">
          <el-select size="small" v-model="query['appId']" filterable remote clearable placeholder="请输入关键词"
                     :remote-method="(queryString)=>{
            remoteMethod(queryString); }">
            <el-option disabled label="" value="-1">
            <span v-for="(itmx,key) in data " v-if="key!='id'">
              {{itmx}}
            </span>
            </el-option>
            <el-option v-for="(itm,idx) in customerList" :key="idx" :label="itm.value" :value="itm.id">
              <el-tooltip v-for="(itmx,key) in customerList[idx]" v-if="key!='id'" :key="key" class="item"
                          effect="light" :content="itmx" placement="top">
                <span>{{itmx}}</span>
              </el-tooltip>
            </el-option>
          </el-select>
        </el-form-item>

        <div class="buttonWrap">
          <el-button size="mini" @click="handleSearch">查询</el-button>
        </div>
      </el-row>
    </el-form>
    <div>
      <TitleTotal :total="total"/>
      <el-table
        ref="todoTaskMultiple"
        :data="taskList"
        fit
        empty-text="暂无数据"
        highlight-current-row
        current-row-key
        style="width: 100%;"
        :height="clientHeight"
      >
        <el-table-column
          type="index"
          width="50"
          align="left"
          label="序号"
        >
        </el-table-column>
        <el-table-column v-for="(item,index) in tableDefaultList" :key="index" :width="item.width ? item.width : 'auto'"
                         :label="item.title" align="left" :prop="item.value"
                         :filters="unique(taskList.map(i=>({text:i[item.value],value:i[item.value]})),'value').filter(ii=>ii.value)"
                         :filter-method="filterHandler"
                         sortable
                         show-overflow-tooltip
                         filter-placement="bottom-start">
          <template slot-scope="scope">
            <span>{{scope.row[item.value]}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="left" fixed="right" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="handleTask(scope.row)">处理
            </el-button>
          </template>
        </el-table-column>
      </el-table>

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
      title="申请人待办"
      class="abow_dialog"
      v-if="custTaskView"
      :visible.sync="custTaskView"
      append-to-body
      width="80%"
      center
      top="0"
      height="500"
      :before-close="(done) => {closeDetail(false, done)}"
    >
      <applicant-view v-if="custTaskView" ref="applicant" isCust :app-id="applicantId" :isAudit="true"></applicant-view>
      <div slot="footer" v-if="custTaskView" class="dialog-footer">
        <el-popover
          v-if="appData.examineStatus == 1622"
          placement="top"
          width="350"
          v-model="auditVisible">
          <el-input type="textarea" v-model="auditMemo" placeholder="请输入审核备注"></el-input>
          <div style="display: flex;margin-top: 15px;justify-content: flex-end;">
            <el-button type="primary" size="mini" @click="auditClick(1621)">通过</el-button>
            <el-button size="mini" type="" @click="auditClick(1624)">不通过</el-button>
          </div>
          <el-button v-if="appData.examineStatus == 1622" type="primary" size="small" slot="reference">审核</el-button>
        </el-popover>
        <el-button v-if="appData.examineStatus === 1623 || appData.examineStatus === 1624" type="primary" size="small" @click="submitClick">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Bus from '@/utils/Bus'
import Pagination from '@/components/Pagination'
import { appExamine, appSubmit, queryAppTask, queryCustomerUrl } from '../../../../api/customerList'
import { queryApplication } from '@/api/applicant'
import ApplicantView from '@/views/workbench/customer_management/applicant/components/ApplicantView.vue'
// import {queryList} from '@/api/caseList.js'
// import CustDetail from "../../customer_center/customer_list/CustomDetail";

export default {
  name: "AppTask",
  components: {
    ApplicantView,
    // CustDetail,
    Pagination
  },
  computed: {
    cssVar() {
      return {
        '--height': 'calc(100vh - 400px)'
      }
    },
    clientHeight() {
      return document.documentElement.clientHeight - 300
    },
  },
  data() {
    return {
      appData: {
        review: '',
        examineStatus: 0
      },
      auditMemo: '',
      auditVisible: false,
      applicantId: '',
      examineStatusStr: '',
      needUpdate: false,
      editStatus: false,
      isSubmit: false,
      isExamine: false,
      customerData: {},
      custTaskView: false,
      data: {id: "-1", value: "申请人", value1: "国籍"},
      query: {
        appId: '',
        custName: ''
      },
      customerList: [],
      total: 0,
      taskList: [],
      listQuery: {
        pageNo: 1,
        pageSize: JSON.parse(localStorage.getItem('pageSize')) ? JSON.parse(localStorage.getItem('pageSize')).find(item => item.name == this.$route.name) ? JSON.parse(localStorage.getItem('pageSize')).find(item => item.name == this.$route.name).pageSize : 10 : 10
      },
      pageSizesList: [10, 50, 100, 200, 300, 400, 500],
      tableDefaultList: [
        {'title': '申请人名称', 'value': 'applicantName', width: 160},
        {'title': '申请人地址', 'value': 'applicantAddress', width: 160},
        {'title': '国家', 'value': 'country'},
        {'title': '主体法律性质', 'value': 'appType'},
        {'title': '进展', 'value': 'proceeName'},
        {'title': '建档人', 'value': 'createUserName'},
        {'title': '审查人', 'value': 'auditUserName'},
        {'title': '审查状态', 'value': 'examineStatusStr'},
        {'title': '审查退回原因', 'value': 'failReason', width: 160}
      ],
      preferenceList: [
        {
          title: '案件文号',
          value: 'agentNum'
        },
        {
          title: '案件名称',
          value: 'caseName'
        },
        {
          title: '案件类型',
          value: 'caseType'
        },
        {
          title: '客户',
          value: 'custName'
        },
        {
          title: '员工',
          value: 'whUserName'
        },
        {
          title: '工时日期',
          value: 'hourDate'
        },
        {
          title: '工时内容',
          value: 'workContent'
        },
        {
          title: '职位',
          value: 'positionName'
        },
        {
          title: '状态',
          value: 'wfStatus'
        },
        {
          title: '记录工时',
          value: 'time'
        },
        {
          title: '标准费率',
          value: 'criterionRate'
        },
      ],
    }
  },
  created() {
    this.queryList()
  },
  methods: {
    // 提交
    submitClick() {
      this.$confirm("是否提交新申请人审查？", "提示", {
        confirmButtonText: "提交审查",
        cancelButtonText: "取消",
        distinguishCancelAndClose: true,
        type: "warning"
      }).then(() => {
        appSubmit({appId: this.applicantId}).then(res => {
          this.$message.success('提交审查成功')
          this.custTaskView = false
          this.queryList()
        })
      })
    },
    // 审核备注
    auditClick(examineStatus) {
      if (!this.auditMemo) {
        this.$message.error('请输入审核备注')
        return
      }
      appExamine({
        examineStatus,
        failReason: this.auditMemo,
        appId: this.applicantId
      }).then(res => {
        this.auditVisible = false
        this.custTaskView = false
        this.$message.success('审核成功')
        this.queryList()
      })
    },
    updateCust(flag) {
      this.needUpdate = flag
      flag && this.closeDetail(flag)
    },
    closeDetail(isSearch, cb) {
      cb && cb()
      this.custTaskView = false
      this.applicantId = ''
      // Bus.$emit('checkCustEdit', () => {
      //   cb && cb()
      //   isSearch === true && this.queryList()
      //   this.custTaskView = false
      //   this.isSubmit = false
      //   this.isExamine = false
      //   this.editStatus = false
      //   this.needUpdate = false
      // })
    },
    handleTask(row) {
      this.editStatus = false
      this.examineStatusStr = row.examineStatusStr
      this.applicantId = row.appId
      this.appData = row
      this.custTaskView = true
      // if (row.examineStatusStr === '审查中') {
      //   this.isExamine = true
      //   this.editStatus = true
      // } else if (row.examineStatusStr === '审查未通过' || row.examineStatusStr === '待提交') {
      //   this.isSubmit = true
      //   this.editStatus = true
      // }
      // queryCustomerUrl({customerID: row.custId}).then(res => {
      //   this.customerData = res.data
      //   this.custTaskView = true
      // })
    },
    remoteMethod(value) {
      queryApplication({pageNo: 1, pageSize: 100, keywords: value}).then(res => {
        this.customerList = res.data.map(item => ({
          id: item.appId,
          value: item.applicantName,
          value1: item.country,
          // value2: item.fullname
        }))
      })
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
      queryAppTask({...this.listQuery, ...this.query, custName: undefined}).then(res => {
        this.taskList = res.data
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
  > > > .el-dialog {
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

  > > > .el-dialog__body {
    overflow: auto;
  }
}
</style>
