<template>
  <div class="addFeeDetail">
    <div style="flex: 1">
      <h4 class="title">费用基础信息</h4>
      <el-form label-width="190px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="案件文号:">
              <span class="title-mx" style="cursor: pointer" @click="takeCaseDetail(submitData)">{{submitData.showRefno}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="案由描述:">
              {{submitData.caseDesc}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="账单号:" class="require">
              {{submitData.billNo}}
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="结余状态:" class="custom-item">
              {{submitData.balanceStr}}
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="注册国家:" class="require">
              {{submitData.regCountry}}
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="案件类型:" class="custom-item">
              {{submitData.caseTypes}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="客户:">
            {{submitData.custName}}
          </el-form-item>
          <el-form-item label="客户信用等级:">
            {{submitData.custLevel}}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="商标案件承办组:">
            {{ transformation(workgroupNamesList,submitData.tmCaseCbWkgId,'wkgId','groupName')}}
            <!--          <el-select   v-model="submitData.tmCaseCbWkgId" filterable  clearable reserve-keyword placeholder="请选择工作组" >-->
            <!--            <el-option v-for="itm in workgroupNamesList" :key="itm.wkgId" :label="itm.groupName" :value="itm.wkgId">-->
            <!--            </el-option>-->
            <!--          </el-select>-->
          </el-form-item>
          <el-form-item label="费用承担工作组:" class="require">
            {{ transformation(workgroupNamesList,submitData.feeCostWkgId,'wkgId','groupName')}}
            <!--          <el-select   v-model="submitData.feeCostWkgId" filterable  clearable reserve-keyword placeholder="请选择工作组" >-->
            <!--            <el-option v-for="itm in workgroupNamesList" :key="itm.wkgId" :label="itm.groupName" :value="itm.wkgId">-->
            <!--            </el-option>-->
            <!--          </el-select>-->
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="我方账单收款情况:">
            {{billData.paymentStatusStr}}
          </el-form-item>
          <el-form-item label="账单服务费:">
            {{billData.serviceCost|formatAmount}}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="账单官费:">
            {{billData.officialCost|formatAmount}}
          </el-form-item>
          <el-form-item label="账单杂费:">
            {{billData.otherCost|formatAmount}}
          </el-form-item>
        </el-row>
        <el-row style="border-bottom: 1px solid #EBEEF5;">
          <el-form-item label="账单总金额:">
            {{billData.billSum|formatAmount}}
          </el-form-item>
          <el-form-item label="外币总金额:">
            {{billData.foreignSum|formatAmount}}
          </el-form-item>
        </el-row>
        <h4 class="title">境外账单信息</h4>
        <el-row>
          <el-form-item label="境外账单电子版:" class="require">
            <a v-for="item in submitData.materialList&&submitData.materialList.filter(i => i.materialTypeId === 359)"
               style="color: #409EFF" target="_blank" :href="`ipdoc${item.address}`" :key="item.address">{{item.materialName}}</a>
          </el-form-item>
          <el-form-item label="境外代理所:" class="require">
            {{submitData.agencyCustName}}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="境外账单日:" class="require">
            {{submitData.abroadBillDate}}
          </el-form-item>
          <el-form-item label="境外账单号:" class="require">
            {{submitData.abroadBillNo}}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="境外账单费用概要:" class="require">
            {{submitData.abroadContent}}
          </el-form-item>
          <el-form-item label="境外账单币种:" class="require">
            {{ transformation(queryCurrencyList,submitData.abroadCurId,'curId','curName')}}
            <!--          <el-select v-model='submitData.abroadCurId'>-->
            <!--            <el-option v-for="item in queryCurrencyList" :label="item.curName" :value="item.curId" :key="item.curId"></el-option>-->
            <!--          </el-select>-->
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="境外账单汇率:" class="require">
            {{submitData.abroadExchangeRate}}
          </el-form-item>
          <el-form-item label="境外代理费（折扣后）:">
            {{submitData.abroadServiceFee|formatAmount}}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="境外官费:">
            {{submitData.abroadOfficialFee|formatAmount}}
          </el-form-item>
          <el-form-item label="境外杂费:">
            {{submitData.abroadOtherFee|formatAmount}}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="境外账单总金额:" class="require">
            {{submitData.abroadBillSum|formatAmount}}
          </el-form-item>
          <el-form-item label="境外事务所案件联系人:">
            {{submitData.agencyCustContact}}
          </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="账单类型:">
              {{submitData.billStyleStr}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="汇款附言:">
            {{submitData.remittanceInformation}}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="账期:">
            {{submitData.accountPeriod }}
            <span v-if="submitData.accountPeriod">天</span>
          </el-form-item>
          <el-form-item label="汇款绝限日期:">
            {{submitData.remittanceDeadline}}
          </el-form-item>
        </el-row>
        <el-row style="border-bottom: 1px solid #EBEEF5;">
          <el-form-item label="预计付款日:">
            {{submitData.expectedPaymentDate}}
          </el-form-item>
          <el-form-item label="预计付款月:">
            {{submitData.expectedPaymentMonth}}
          </el-form-item>
        </el-row>
        <h4 class="title">支付信息</h4>
        <el-row>
          <el-form-item label="支付凭证电子版:" class="require">
            <a v-for="item in submitData.materialList&&submitData.materialList.filter(i => i.materialTypeId === 301560)"
               style="color: #409EFF" target="_blank" :href="`ipdoc${item.address}`" :key="item.address">{{item.materialName}}</a>
          </el-form-item>
          <el-form-item label="财务初审日期:">
            {{submitData.financialApprovalDate}}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="购付汇:" class="require">
            {{submitData.purchaseOrPayExcRate}}
          </el-form-item>
          <el-form-item label="支付日期:">
            {{submitData.payDate}}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="支付币种:">
            {{ transformation(queryCurrencyList,submitData.payCurId,'curId','curName')}}
            <!--          <el-select v-model='submitData.payCurId'>-->
            <!--            <el-option v-for="item in queryCurrencyList" :label="item.curName" :value="item.curId" :key="item.curId"></el-option>-->
            <!--          </el-select>-->
          </el-form-item>
          <el-form-item label="支付金额（本币）:">
            {{submitData.payMoney|formatAmount}}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="外汇牌价:">
            {{submitData.foreignExchangeRate}}
          </el-form-item>
          <el-form-item label="手续费:">
            {{submitData.handleFee|formatAmount}}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="手续费支付方式:">
            {{submitData.handleFeePayType}}
          </el-form-item>
          <el-form-item label="支付方式:">
            {{submitData.payType}}
          </el-form-item>
        </el-row>
        <el-row style="border-bottom: 1px solid #EBEEF5;">
          <el-form-item label="报销人:">
            {{submitData.reimburseUserIdStr}}
<!--            {{ transformation(queryCurrencyList,submitData.reimburseUserId,'userId','fullname')}}-->
            <!--          <el-select   v-model="submitData.reimburseUserId" filterable  clearable reserve-keyword placeholder="请选择报销人" >-->
            <!--            <el-option v-for="itm in userList" :key="itm.userId" :label="itm.fullname" :value="itm.userId">-->
            <!--            </el-option>-->
            <!--          </el-select>-->
          </el-form-item>
          <el-form-item label="支付公司:">
            {{ transformation(companyList,submitData.payDeptId,'deptId','companyShortName')}}
            <!--          <el-select  v-model="submitData.payDeptId" filterable  clearable reserve-keyword placeholder="请选择支付公司" >-->
            <!--            <el-option v-for="itm in companyList" :key="itm.deptId" :label="itm.companyShortName" :value="itm.deptId">-->
            <!--            </el-option>-->
            <!--          </el-select>-->
          </el-form-item>
        </el-row>
        <h4 class="title">银行信息</h4>
        <el-row>
          <el-form-item label="银行账户:">
            {{ submitData.account }}
          </el-form-item>
          <el-form-item label="银行名称:">
            {{ submitData.bankName }}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="银行分行:">
            {{ submitData.bankBranch }}
          </el-form-item>
          <el-form-item label="银行地址:">
            {{ submitData.address }}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="收款人姓名:">
            {{ submitData.payeeName }}
          </el-form-item>
          <el-form-item label="收款人地址:">
            {{ submitData.accAddr }}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="收款人国家:">
            {{ submitData.accCountry }}
          </el-form-item>
          <el-form-item label="Swift Code:">
            {{ submitData.swiftcode }}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="ABA No:">
            {{ submitData.aba }}
          </el-form-item>
          <el-form-item label="用途代码:">
            {{ submitData.purposeCode }}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="银行账户备注:">
            {{ submitData.memo }}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="中间行/代理行名称:">
            {{ submitData.agencyBankName }}
          </el-form-item>
          <el-form-item label="中间行/代理行Swift Code:">
            {{ submitData.swiftCodeIntermediary }}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="中间行/代理行其他信息:">
            {{ submitData.agencyBankAddr }}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="中间行/代理行备注:">
            {{ submitData.swiftCodeIntermediaryMemo }}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="银行手续费:">
            {{ submitData.bankChargesStr }}
          </el-form-item>
        </el-row>
        <el-row style="border-bottom: 1px solid #EBEEF5;">
          <el-form-item label="Tax No:">
            {{ submitData.taxNo }}
          </el-form-item>
        </el-row>
        <!-- <el-row>
          <el-form-item label="收款人名称:">
            {{submitData.payeeName}}
          </el-form-item>
          <el-form-item label="收款人地址:">
            {{submitData.accAddr}}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="开户银行名称:">
            {{submitData.bankName}}
          </el-form-item>
          <el-form-item label="开户银行地址:">
            {{submitData.address}}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="开户银行账户:">
            {{submitData.account}}
          </el-form-item>
          <el-form-item label="Swift Code:">
            {{submitData.swiftcode}}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="代理银行名称:">
            {{submitData.agencyBankName}}
          </el-form-item>
          <el-form-item label="代理银行地址:">
            {{submitData.agencyBankAddr}}
          </el-form-item>
        </el-row> -->
        <h4 class="title">系统信息</h4>
        <el-row>
          <el-form-item label="备注:">
            {{submitData.remarks}}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="同批付款金额:">
            {{submitData.batchPayMoney|formatAmount}}
          </el-form-item>
          <el-form-item label="同批付款境外账单号:">{{submitData.batchAbroadNo}}</el-form-item>
        </el-row>
        <el-row style="border-bottom: 1px solid #EBEEF5;">
          <el-form-item label="创建人:">
            {{submitData.createUserName}}
          </el-form-item>
          <el-form-item label="创建日期:">
            {{submitData.createDate}}
          </el-form-item>
        </el-row>
      </el-form>

      <div class="button_wrap">
        <el-button class="exactButton" plain @click="cancel">返回</el-button>
      </div>
    </div>
    <div class="TaskRecordWrap">
      <TaskRecord v-if="submitData.abroadBillId" :id="submitData.abroadBillId" :typeId="19"></TaskRecord>
    </div>

    <el-dialog title="案件选择" :modal-append-to-body="false" append-to-body :visible.sync="selectCaseVisible" width="40%">
      <el-table :data="selectCaseList" border height="450">
        <el-table-column type="index" width="60" label="序号" align="left">
          <template slot-scope="scope">
            <span style="margin: 0;cursor: pointer" @click="takeCaseDetail(scope.row)">
              {{scope.$index+1}}
            </span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="案件文号" prop="agentNum">
          <template slot-scope="scope">
            <span style="margin: 0;cursor: pointer" @click="takeCaseDetail(scope.row)">
              {{scope.row.agentNum}}
            </span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="案件类型" prop="agentNum">
          <template slot-scope="scope">
            <span style="margin: 0;cursor: pointer" @click="takeCaseDetail(scope.row)">
              {{scope.row.caseTypeStr}}
            </span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="案件名称" prop="agentNum">
          <template slot-scope="scope">
            <span style="margin: 0;cursor: pointer" @click="takeCaseDetail(scope.row)">
              {{scope.row.caseName}}
            </span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="类别" prop="agentNum">
          <template slot-scope="scope">
            <span style="margin: 0;cursor: pointer" @click="takeCaseDetail(scope.row)">
              {{scope.row.goodClasses}}
            </span>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="selectCaseVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {queryZZWorkGroupUrl, queryAbroadBillDetail} from "@/api/billApi";
  import {queryCurrencyUrl} from "@/api/customerList";
  import {queryUsers} from '@/api/systemList'
  import {queryCompany, queryPayMode} from "@/api/feeList";
  import {queryCountry, queryOtherCustomerListUrl} from '@/api/caseDetail'
  import TaskRecord from "../components/TaskRecord";

  export default {
    name: 'seeOverseasBill',
    components: {TaskRecord},
    props: {
      outAbroadBillId: '',
      isFinance: {
        default: false
      }
    },
    data() {
      return {
        selectCaseList: [],
        selectCaseVisible: false,
        submitData: {},
        billData: {},
        companyList: [],
        payTypeList: [],
        queryCurrencyList: [],
        countryList: [],
        workgroupNamesList: [],
        userList: [],
        hzLists: [], // 境外代理所列表
      }
    },
    created() {
      // setTimeout(()=>{
      //   this.queryUsers()
      // })
      this.queryCountry()
      this.queryCurrencyUrl()
      this.queryCompany()
      this.queryWorkgroupNames()
      this.queryAbroadBillDetail()
    },
    methods: {
      takeCaseDetail(row) {
        if (row.caseArray && row.caseArray.length > 1) {
          this.selectCaseList = row.caseArray;
          this.selectCaseVisible = true;
        } else {
          if (!row.caseId) {
            this.takeCaseDetail(row.caseArray[0])
          } else {
            this.$commonUtils.takeCaseDetail(row, this)
            // window.open(`#/workbench/case/seeCaseDetail/${row.caseId}?taskType=${row.taskType}`)
          }
        }
      },
      queryCountry() {
        queryCountry().then(res => {
          this.countryList = res.data;
        })
      },
      queryUsers() {
        // this.userList = this.$store.getters.allUserList
        // queryUsers({pageNo:1,pageSize:10000}).then(res=>{
        //   this.userList=res.data.users
        // })
      },
      queryWorkgroupNames() {
        queryZZWorkGroupUrl().then(res => {
          this.workgroupNamesList = res.data
        })
      },
      queryCurrencyUrl() {
        queryCurrencyUrl().then(res => {
          this.queryCurrencyList = res.data
        })
      },
      queryPayMode(e) {
        queryPayMode().then(res => {
          this.payTypeList = res.data
        })
      },
      queryCompany() {
        queryCompany().then(res => {
          this.companyList = res.data
        })
      },
      formatDate(timestamp) {
        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      },
      queryAbroadBillDetail() {
        queryAbroadBillDetail({abroadBillId: this.$route.query.abroadBillId || this.outAbroadBillId}).then(res => {
          this.submitData = res.data
          let {bill} = res.data
          if (this.submitData.financialApprovalDate) {
            this.submitData.financialApprovalDate = this.formatDate(this.submitData.financialApprovalDate)
          }
          if (this.submitData.remittanceDeadline) {
            this.submitData.remittanceDeadline = this.formatDate(this.submitData.remittanceDeadline)
          }
          if (this.submitData.expectedPaymentDate) {
            this.submitData.expectedPaymentDate = this.formatDate(this.submitData.expectedPaymentDate)
          }
          console.log(res.data.abroadAgencyCustId,'res.data.abroadAgencyCustId');
          this.billData = JSON.parse(JSON.stringify(bill))
          delete this.submitData.bill
          this.materialList = this.submitData.materialList
          this.materialList.forEach(item => item.name = item.materialName)
          this.materialIdList = this.submitData.materialList.map(item => item.materialId)
          
          // 获取境外代理所列表，从中取出账期信息
          if (this.submitData.agencyCustName) {
            this.queryOtherCustomerListUrl(this.submitData.agencyCustName)
          }
        })
      },
      queryOtherCustomerListUrl(v) {
        v && queryOtherCustomerListUrl({fullname: v, isCollaboration: 1})
          .then(response => {
            this.hzLists = response.data;
            this.hzLists.forEach(item => {
              item.label = item.fullname
              item.value = item.custId
            })
            
            // 从列表中获取对应代理所的账期
            this.$nextTick(() => {
              if (this.submitData.abroadAgencyCustId) {
                const selectedAgency = this.hzLists.find(item => item.custId === this.submitData.abroadAgencyCustId)
                if (selectedAgency && selectedAgency.accountPeriod) {
                  this.submitData.accountPeriod = selectedAgency.accountPeriod
                }
              }
            })
          })
      },
      cancel() {
        if (this.isFinance) {
          this.$emit('close', false)
        } else {
          this.$router.go(-1)
        }
      },
      transformation(arr, val, valType, labelStr) {
        if (arr && arr.length) {
          var item = arr.find(item => item[valType] == val)
          if (item) {
            return item[labelStr]
          } else {
            return ''
          }
        }
        return ''
      },
    }
  }
</script>

<style lang='scss' scoped>
  aside {
    & > div {
      display: flex;
      align-items: center;

      .el-textarea {
        width: 80%;
      }

      .el-button {
        margin-left: 20px;
        width: 67px;
        height: 32px;
        padding: 0;
        color: #409EFF;
        border: 1px solid #409EFF;
      }
    }

    span {
      display: block;
      margin: 10px 0;
      font-size: 12px;
      color: #FB9608;
    }

  }

  .title {
    font-size: 16px;
    color: #6AA7FF;
    height: 50px;
    line-height: 50px;
    font-weight: normal;
  }

  .el-form {
    display: flex;
    flex-wrap: wrap;

    .el-select, .el-input, .el-date-picker, .el-textarea {
      width: 95%;
    }

    .el-textarea {
      margin: 10px 0;
    }

    /deep/ input {
      height: 28px;
    }

    /deep/ .el-input__icon {
      line-height: 28px;
    }

    .el-row {
      min-height: 30px;
      width: 100%;
      display: flex;
      align-items: center;

      .el-form-item {
        width: 100%;
        height: 100%;
        display: flex;
        border: 1px solid #EBEEF5;
        border-bottom: 0;
        margin-bottom: 0;

        /deep/ .el-form-item__label {
          background: #f5f7fa;
        }

        /deep/ .el-form-item__content {
          margin-left: 0 !important;
          padding-left: 10px;
          background: #fff;
          flex: 1;
        }
      }
    }
  }

  .button_wrap {
    margin-top: 10px;
    width: 100%;
    display: flex;
    justify-content: center;

    .el-button {
      margin-left: 30px;
    }
  }

  .addFeeDetail {
    padding: 20px;
    display: flex;
  }

  .TaskRecordWrap {
    margin-top: 20px;
    margin-left: 10px;
    width: 200px;
  }
  .title-mx {
    /*float: left;*/
    font-size: 15px;
    color: rgb(64, 158, 255);
    font-weight: 350;
    font-style: normal;
  }
  .custom-item{
    /deep/ .el-form-item__label{
      width: 90px !important;
    }
  }
</style>
