<template>
  <div>
    <div class="tabbar">费用审批</div>
    <div class="content">
      <div class="status">
        <div><span
          style="display: inline-block;margin:0 10px;height: 10px;width: 10px;border-radius: 50%;background-color: #008000"></span>{{feeInfo.wfStatus}}
        </div>
      </div>
      <div class="content-case">
        <div class="case-row" v-for="(item, key) of caseInfo" :key="key">
          <div class="row-left">{{keyValue[key]}}</div>
          <div class-="row-right">{{caseInfo[key]}}</div>
        </div>
      </div>
      <div class="content-fee">
        <div class="fee-title">
          <div class="row-left">费用明细</div>
          <div class="row-right">总金额：{{totalSum | formatAmount}}</div>
        </div>
        <div class="fee-content">
          <el-collapse v-model="activeNames">
            <el-collapse-item :name="index + 1" v-for="(item, index) in feeInfo.feeDetails" :key="index">
              <template slot="title">
                <div class="fee-content-head">
                  <span class="head-left">{{item.feeName}}</span>
                  <span class="head-right">{{item.amount | formatAmount}}</span>
                </div>
              </template>
              <div>
                <div class="fee-content-item"><span class="row-left">收款对方名称:</span><span class="row-right">{{item.receiverName}}</span>
                </div>
                <div class="fee-content-item"><span class="row-left">费用描述:</span><span class="row-right">{{item.feeDesc}}</span>
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
    </div>
    <div class="foot fl-ac-jc">
      <el-button size="small"
                 :style="{backgroundColor: isAudit ? 'darkgray' : '#fff', borderColor: isAudit ? 'darkgray' : '', color: isAudit ? '#fff' : '#000'}"
                 :disabled="isAudit" @click="submitFee(0)">退 回
      </el-button>
      <el-button type="primary"
                 :style="{backgroundColor: isAudit ? 'darkgray' : '#409EFF', borderColor: isAudit ? 'darkgray' : '#409EFF'}"
                 :disabled="isAudit" size="small" @click="submitFee(1)">通 过
      </el-button>
      <el-button type="primary" size="small" @click="closeWindow">关 闭</el-button>
    </div>
  </div>
</template>

<script>
  import {submitFee, queryFeeInfo} from "@/api/feeList";

  export default {
    name: 'AuditFeeH5',
    data() {
      return {
        auditStatus: false,
        activeNames: [],
        feeInfo: {
          feeDetails: []
        },
        feeId: '',
        caseInfo: {
          showRefno: '', // 案件文号
          caseName: '', // 案件名称
          custIdStr: '', // 客户
          beginDate: '', // 发生日期
          endDate: '', // 结束日期
          reimburseUserIdStr: '', // 报销人
          costWkgIdStr: '', // 费用承担工作组
          reimburseWkgIdStr: '', // 报销人所属工作组
          remarks: '', // 备注
          fillinUserIdStr: '', // 填报人
          fillinDate: '', // 填报日期
        },
        keyValue: {
          showRefno: '案件文号', // 案件文号
          caseName: '案件名称', // 案件名称
          custIdStr: '客户', // 客户
          beginDate: '发生日期', // 发生日期
          endDate: '结束日期', // 结束日期
          reimburseUserIdStr: '报销人', // 报销人
          costWkgIdStr: '费用承担工作组', // 费用承担工作组
          reimburseWkgIdStr: '报销人所属工作组', // 报销人所属工作组
          remarks: '备注', // 备注
          fillinUserIdStr: '填报人', // 填报人
          fillinDate: '填报日期', // 填报日期
        }
      }
    },
    computed: {
      isAudit() {
        if (this.taskNo == 2 && this.feeInfo.wfStatus == '承办组审核' && !this.auditStatus) {
          return false
        } else if (this.taskNo == 3 && this.feeInfo.wfStatus == '组长审核' && !this.auditStatus) {
          return false
        } else if (this.taskNo == 7 && this.feeInfo.wfStatus == '组长上级加批' && !this.auditStatus) {
          return false
        } else {
          return true
        }
      },
      totalSum() {
        let amountList = this.feeInfo.feeDetails.map(item => item.amount).filter(item => !!item)
        if (amountList.length == 0) {
          return 0.00
        }
        if (amountList.length == 1) {
          return amountList[0]
        } else {
          return this.feeInfo.feeDetails.map(item => item.amount).filter(item => !!item).reduce((pre, next) => {
            return Number(pre) + Number(next)
          })
        }

      }
    },
    created() {
      this.feeId = this.$route.query && this.$route.query.feeId
      this.taskNo = this.$route.query && this.$route.query.taskNo
      this.feeId && this.queryFeeInfo()
    },
    methods: {
      closeWindow() {
        window.location.href = "about:blank";
        window.close();
      },
      queryFeeInfo() {
        queryFeeInfo({
          feeId: this.feeId
        }).then(res => {
          this.feeInfo = res.data || {}
          for (let key in this.caseInfo) {
            this.caseInfo[key] = this.feeInfo[key]
          }
        })
      },
      async submitFee(result) {
        // this.submitData.materialIdArray = this.materialIdList
        delete this.feeInfo.materialArray
        this.feeInfo.taskIdList = this.feeInfo.taskId
        this.feeInfo.result = result
        this.feeInfo.feeDetails.forEach(item => {
          item.feeId = this.feeInfo.feeId
          delete item.feetIdList
          delete item.invoices // 删除关联发票信息
        })
        submitFee(this.feeInfo).then(Response => {
          this.auditStatus = true
          result && this.$message.success('审核成功!')
          !result && this.$message.success('退回成功!')
        })
      },
    }
  }
</script>

<style scoped lang="scss">
  .tabbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 45px;
    background-color: #52A0F5;
    color: #fff;
    text-align: center;
    font-size: 16px;
    line-height: 45px;
    font-weight: bold;
  }

  .content {
    height: 100vh;
    background-color: #F7F7F7;
    margin-top: 45px;
    padding-bottom: 45px;
    font-size: 14px;
    overflow: auto;

    .status {
      width: 100%;
      padding: 10px 0;

      div {
        padding: 10px;
        background-color: #fff;
      }
    }

    .content-case {
      /*height: 900px;*/
      /*width: 100%;*/
      margin: 0px 10px 10px 10px;
      background-color: #fff;
      border-radius: 10px;
      padding: 0 10px 0 10px;
      font-size: 13px;
    }

    .content-fee {
      margin: 0px 10px 10px 10px;
      background-color: #fff;
      border-radius: 10px;
      padding: 0 10px 0 10px;
      font-size: 13px;

      > > > .el-collapse-item__header {
        line-height: 35px;
        height: 35px;
      }

      .fee-content-head {
        width: 100%;
        display: flex;
        justify-content: space-between;

        .head-right {
          margin-right: 10px;
        }
      }
    }

    .case-row, .fee-title, .fee-content-item {
      display: flex;
      justify-content: space-between;
      line-height: 35px;
      border-bottom: 1px solid #EBEEF5;

      .row-left {
        margin-right: 10px;
        flex-shrink: 0;
      }

      &:last-child {
        border: none;
      }
    }

    .fee-content-item {
      justify-content: left;
      border: none;
      line-height: 20px;

      .row-left {
        margin-right: 5px;
      }
    }

    .fee-title {
      border: none;

      .row-left {
        color: #52A0F5;
      }
    }
  }

  .foot {
    padding-bottom: 10px;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #F7F7F7;

    .el-button {
      width: 25%;
    }
  }
</style>
