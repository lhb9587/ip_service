<template>
  <div>
    <div class="box-border">
      <el-form size="small" class="form-container" label-width="200px">
        <!-- 基本信息 -->
        <div class="group-label">基本信息</div>
        <el-row class="first-row">
          <el-col :span="8">
            <el-form-item label="年度：" class="postInfo-container-item">
              {{ dataInfo.salaryYear }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="月份：" class="postInfo-container-item">
              {{ dataInfo.salaryMonth }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="工资标准" class="postInfo-container-item">
              <el-input v-model="dataInfo.wageStandard"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="first-row">
          <el-col :span="12">
            <el-form-item label="核算结果组织名称：" class="postInfo-container-item">
              <el-input v-model="dataInfo.kingDeeDepartment"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工资发放地：" class="postInfo-container-item">
              <el-input v-model="dataInfo.contractOwner"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <div class="group-label">工资信息</div>
        <el-row class="first-row">
          <el-col :span="8">
            <el-form-item label="出勤工资：" class="postInfo-container-item">
              <el-input v-model="dataInfo.attendanceSalary"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="出勤天数：" class="postInfo-container-item">
              <el-input v-model="dataInfo.attendanceDays"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="补贴：" class="postInfo-container-item">
              <el-input v-model="dataInfo.subsidy"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="first-row">
          <el-col :span="8">
            <el-form-item label="奖金：" class="postInfo-container-item">
              <el-input v-model="dataInfo.bonus"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="福利费：" class="postInfo-container-item">
              <el-input v-model="dataInfo.benefit"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="其它：" class="postInfo-container-item">
              <el-input v-model="dataInfo.other"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="first-row">
          <el-col :span="8">
            <el-form-item label="加班费：" class="postInfo-container-item">
              <el-input v-model="dataInfo.overtimePay"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="平时加班：" class="postInfo-container-item">
              <el-input v-model="dataInfo.regularPay"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="周末加班：" class="postInfo-container-item">
              <el-input v-model="dataInfo.weekendPay"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="first-row">
          <el-col :span="8">
            <el-form-item label="节假日加班：" class="postInfo-container-item">
              <el-input v-model="dataInfo.holidayPay"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="劳务费：" class="postInfo-container-item">
              <el-input v-model="dataInfo.serviceFee"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="应发：" class="postInfo-container-item">
              <el-input v-model="dataInfo.payable"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <div class="group-label">社保（个人）</div>
        <el-row class="first-row">
          <el-col :span="6">
            <el-form-item label="养老（个人）：" class="postInfo-container-item">
              <el-input v-model="dataInfo.retirement"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="失业（个人）：" class="postInfo-container-item">
              <el-input v-model="dataInfo.unemploy"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="医疗（个人）：" class="postInfo-container-item">
              <el-input v-model="dataInfo.medical"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="公积金（个人）：" class="postInfo-container-item">
              <el-input v-model="dataInfo.fund"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="first-row">
          <el-col :span="6">
            <el-form-item label="养老基数：" class="postInfo-container-item">
              <el-input v-model="dataInfo.pensionBase"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="失业基数：" class="postInfo-container-item">
              <el-input v-model="dataInfo.unemployBase"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="工伤基数：" class="postInfo-container-item">
              <el-input v-model="dataInfo.workInjuryBase "></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="生育基数：" class="postInfo-container-item">
              <el-input v-model="dataInfo.fertilityBase "></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="first-row">
          <el-col :span="6">
            <el-form-item label="医疗基数：" class="postInfo-container-item">
              <el-input v-model="dataInfo.medicalBase"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="公积金基数：" class="postInfo-container-item">
              <el-input v-model="dataInfo.fundBase"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="扣款合计：" class="postInfo-container-item">
              <el-input v-model="dataInfo.totalDeduction"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <div class="group-label">社保（公司）</div>
        <el-row class="first-row">
          <el-col :span="6">
            <el-form-item label="养老（公司）：" class="postInfo-container-item">
              <el-input v-model="dataInfo.retirementInc"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="医疗（公司）：" class="postInfo-container-item">
              <el-input v-model="dataInfo.medicalInc"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="失业（公司）：" class="postInfo-container-item">
              <el-input v-model="dataInfo.unemployInc"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="工伤（公司）：" class="postInfo-container-item">
              <el-input v-model="dataInfo.workInjuryInc"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="first-row">
          <el-col :span="6">
            <el-form-item label="生育（公司）：" class="postInfo-container-item">
              <el-input v-model="dataInfo.fertilityInc"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="公积金（公司）：" class="postInfo-container-item">
              <el-input v-model="dataInfo.fundInc"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="地方医疗（公司）：" class="postInfo-container-item">
              <el-input v-model="dataInfo.localHealthInc"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="重大疾病险（公司）：" class="postInfo-container-item">
              <el-input v-model="dataInfo.criticalInc"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="first-row">
          <el-col :span="6">
            <el-form-item label="城镇补充医疗（公司）：" class="postInfo-container-item">
              <el-input v-model="dataInfo.urbanMedicalInc"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="强积金：" class="postInfo-container-item">
              <el-input v-model="dataInfo.mpfPay"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <div class="group-label">专项扣除</div>
        <el-row class="first-row">
          <el-col :span="6">
            <el-form-item label="子女教育专项扣除：" class="postInfo-container-item">
              <el-input v-model="dataInfo.childrenSpec"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="赡养老人专项扣除：" class="postInfo-container-item">
              <el-input v-model="dataInfo.elderlySpec"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="住房租金专项扣除：" class="postInfo-container-item">
              <el-input v-model="dataInfo.houseSpec"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="继续教育专项扣除：" class="postInfo-container-item">
              <el-input v-model="dataInfo.educationSpec"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="first-row">
          <el-col :span="6">
            <el-form-item label="住房贷款专项扣除：" class="postInfo-container-item">
              <el-input v-model="dataInfo.housingLoansSpec"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="累计预扣预缴应纳税所得额：" class="postInfo-container-item">
              <el-input v-model="dataInfo.taxableIncome"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="累计预扣税额：" class="postInfo-container-item">
              <el-input v-model="dataInfo.taxAmount"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="累计已预扣预缴税额：" class="postInfo-container-item">
              <el-input v-model="dataInfo.taxPrepaid"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="first-row">
          <el-col :span="6">
            <el-form-item label="代扣税：" class="postInfo-container-item">
              <el-input v-model="dataInfo.withholdingTax"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="税率：" class="postInfo-container-item">
              <el-input v-model="dataInfo.taxRate"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="速算扣除数：" class="postInfo-container-item">
              <el-input v-model="dataInfo.quickDeduction"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        
        <div class="group-label">工资发放</div>
        <el-row class="first-row">
          <el-col :span="6">
            <el-form-item label="实发合计：" class="postInfo-container-item">
              <el-input v-model="dataInfo.totalPaid"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="应发合计：" class="postInfo-container-item">
              <el-input v-model="dataInfo.totalPayable"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="form-button">
      <el-button size="small" style="width: 100px; margin-right: 20px" @click="closeDialog(false)">取消</el-button>
      <el-button type="primary" size="small" style="width: 100px;" @click="submit">确定</el-button>
    </div>
  </div>
</template>

<script>
import { updateTalentPersonSalaryInfo } from '@/api/hrmList.js';

export default {
  name: "SalaryInfoSave",
  props: ['dataInfo'],
  data() {
    return {};
  },
  created() {
    console.log(this.dataInfo);
  },
  methods: {
    submit() {
      updateTalentPersonSalaryInfo(this.dataInfo).then((res) => {
        if (res.success) {
          this.$message.success(res.message);
          this.closeDialog();
        }
      });
    },
    closeDialog() {
      this.$emit('closeDialog');
    },
  },
};
</script>
<style lang="scss" scoped>
  .form-container {
    margin: 20px;
  }

  .postInfo-container-item {
    width: 100%;
  }

  .el-row {
    margin: 10px 0;
    display: flex;
    align-items: center;
  }

  .el-form-item {
    border-right: 1px solid #F2F2F2;
    margin: 0 !important;
  }

  .first-row {
    border-top: 1px solid #F2F2F2;
  }

  .el-row {
    border-bottom: 1px solid #F2F2F2;
    border-left: 1px solid #F2F2F2;
  }

  .el-form-item__label {
    flex-shrink: 0;
    background-color: #F2F2F2;
    text-align: right;
  }

  .el-button {
    width: 100px;
    margin-right: 20px;
  }

  .fl-ac-jc {
    margin-top: 15px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  .box-border {
    border: 1px solid #D7D7D7;
    padding: 10px;
    height: 500px;
    overflow-y: auto;
  }
  
  .form-button {
    margin-top: 10px;
  }

  .upload-btn {
    margin: 10px 0 5px 0;
    width: 120px;
    height: 30px;
    border: 1px solid #AAAAAA;
    color: #AAAAAA;
    text-align: center;
    line-height: 30px;
    cursor: pointer;

    &:hover {
      border: 1px solid #66B1FF;
      color: #66B1FF;
    }
  }

  .require:before,
  .requireForm /deep/ .el-form-item__label:before {
    content: "*";
    color: #f56c6c;
    margin-right: 4px;
  }

  .red-color {
    color: red !important;
  }
</style>