<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      top="5vh"
      width="60%"
      @change="handleClose">
      <div class="div-form" :style="pageState !== 'create' ? 'width:80%' : 'width:100%'">
        <el-form :model="submitData" :rules="rules" ref="ruleForm" label-width="160px" >
          <el-row>
            <el-form-item label="主题">
              {{ submitData.subject }}
            </el-form-item>
            <MaterialUpload v-if="pageState !== 'view' && dialogVisible" :obj-type="objType" :obj-inst-id="objInstId" :subject="submitData.subject" @file-list="fileList"></MaterialUpload>
          </el-row>
          <el-row>
            <el-col :span="17">
              <el-form-item label="文号:">
                <span v-if="pageState === 'view'">{{submitData.showRefno}}</span>
                <template v-else>
                  <span class="title-mx" style="cursor: pointer">{{ submitData.showRefno }}</span>
                  <el-button style="margin-left: 10px" size="mini" type="primary" @click="changeCaseVisible=true">修改</el-button>
                </template>

                <ChooseCase
                  :dialogVisible="changeCaseVisible"
                  :agentNums="caseArray.map(item=>item.agentNum).join('\n')"
                  @closed="changeCaseVisible=false"
                  rules="custId"
                  @getList="getList"></ChooseCase>
              </el-form-item>

            </el-col>
            <el-col :span="7">
              <el-form-item label="状态" label-width="130px">
                {{ submitData.wfStatus ? submitData.wfStatus : '提交' }}
              </el-form-item>
            </el-col>
          </el-row>
          <div class="content" v-if="materialList.length > 0">
            <el-row>
              <el-form-item label="附件文档" >
                <div v-for="(item, key) in materialList">
                  <span >{{ item.materialName }}</span>
                  <el-button type="text" class="el-icon-view" style="line-height:0" @click="preView(item.address)" ></el-button>
                  <el-button type="text" size="smail" @click="downLoad(item.address)">下载</el-button>
                  <el-button v-if="pageState !== 'view'" type="text" size="smail" @click="deleteMaterial(item.materialId, key)">删除</el-button>
                </div>
              </el-form-item>
            </el-row>
          </div>
          <div class="content">
            <el-row>
              <el-form-item label="填报日期：" prop="fillinDate">
                <span v-if="pageState === 'view'">{{submitData.fillinDate}}</span>
                <el-date-picker
                  v-else
                  v-model="submitData.fillinDate"
                  type="date"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="借款性质:" prop="loanNature">
                <span v-if="pageState === 'view'">{{submitData.loanNature}}</span>
                <el-select v-else v-model="submitData.loanNature" @change="loanNature" placeholder="请选择借款性质">
                  <el-option
                    v-for="item in loanNatureOption"
                    :key="item"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="所属组:" prop="wkgId">
                <span v-if="pageState === 'view'">{{submitData.wkgIdStr}}</span>
                <el-select v-else v-model="submitData.wkgId" size="small" no-match-text="暂无数据" filterable>
                  <el-option
                    v-for="item in selectData.groupList"
                    :key="item.wkgId"
                    :label="item.groupName"
                    :value="item.wkgId"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="支付公司:" prop="companyId">
                <span v-if="pageState === 'view'">{{submitData.companyIdStr}}</span>
                <el-select v-else @change="queryPayMode" v-model="submitData.companyId" filterable clearable reserve-keyword placeholder="请选择支付公司">
                  <el-option
                    v-for="item in selectData.companyList"
                    :key="item.deptId"
                    :label="item.companyShortName"
                    :value="item.deptId"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="还款日期:" prop="repaymentDate">
                <span v-if="pageState === 'view'">{{submitData.repaymentDate}}</span>
                <el-date-picker
                  v-else
                  v-model="submitData.repaymentDate"
                  type="date"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="支付方式:" prop="payType">
                <span v-if="pageState === 'view'">{{submitData.payType}}</span>
                <el-select v-else v-model="submitData.payType" filterable clearable reserve-keyword placeholder="请选择方式">
                  <el-option
                    v-for="item in selectData.payTypeList"
                    :key="item.payMode"
                    :label="item.payMode"
                    :value="item.payMode"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="借款人:" prop="loanUserId">
                <span v-if="pageState === 'view'">{{submitData.loanUserIdStr}}</span>
                <el-select v-else v-model="submitData.loanUserId" filterable clearable reserve-keyword
                           placeholder="请选择借款人" @change="changeReibuserUserId">
                  <el-option
                    v-for="item in selectData.userList"
                    :key="item.userId"
                    :label="item.fullname"
                    :value="item.userId"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="借款日期:" prop="loanDate">
                <span v-if="pageState === 'view'">{{submitData.loanDate}}</span>
                <el-date-picker
                  v-else
                  v-model="submitData.loanDate"
                  type="date"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="借款事由:" prop="loanReason">
                <span v-if="pageState === 'view'">{{submitData.loanReason}}</span>
                <el-input v-else v-model="submitData.loanReason"></el-input>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="借款">
                <el-form-item label="北京地区日常借款">
                  <span v-if="pageState === 'view'">{{submitData.beiJingLoanMoney}}</span>
                  <el-input v-else type="number" v-model="submitData.beiJingLoanMoney" v-bind:disabled="bjDailyVisible" v-on:input="inputIntCheck('beiJingLoanMoney')"></el-input>
                </el-form-item>
                <el-form-item label="差旅借款" :label-width="pageState !== 'create' ? '36.1%' : '39.6%'" >
                  <el-form-item label="出差天数">
                    <span v-if="pageState === 'view'">{{submitData.businessDays}}</span>
                    <el-input v-else type="number" oninput="value=value.replace(/[^0-9]/g,'')" v-model="submitData.businessDays" v-bind:disabled="travelLoanVisible"></el-input>
                  </el-form-item>
                  <el-form-item label="往返异地费用">
                    <span v-if="pageState === 'view'">{{submitData.roundTripMoney}}</span>
                    <el-input v-else type="number" v-model="submitData.roundTripMoney" v-bind:disabled="travelLoanVisible" v-on:input="inputIntCheck('roundTripMoney')"></el-input>
                  </el-form-item>
                  <el-form-item label="本市及外埠交通费">
                    <span v-if="pageState === 'view'">{{submitData.trafficMoney}}</span>
                    <el-input v-else type="number" v-model="submitData.trafficMoney" v-bind:disabled="travelLoanVisible" v-on:input="inputIntCheck('trafficMoney')"></el-input>
                  </el-form-item>
                  <el-form-item label="住宿费">
                    <span v-if="pageState === 'view'">{{submitData.hotelMoney}}</span>
                    <el-input v-else type="number" v-model="submitData.hotelMoney" v-bind:disabled="travelLoanVisible" v-on:input="inputIntCheck('hotelMoney')"></el-input>
                  </el-form-item>
                  <el-form-item label="招待费">
                    <span v-if="pageState === 'view'">{{submitData.hospitalityMoney}}</span>
                    <el-input v-else type="number" v-model="submitData.hospitalityMoney" v-bind:disabled="travelLoanVisible" v-on:input="inputIntCheck('hospitalityMoney')"></el-input>
                  </el-form-item>
                  <el-form-item label="业务费">
                    <span v-if="pageState === 'view'">{{submitData.businessMoney}}</span>
                    <el-input v-else type="number" v-model="submitData.businessMoney" v-bind:disabled="travelLoanVisible" v-on:input="inputIntCheck('businessMoney')"></el-input>
                  </el-form-item>
                  <el-form-item label="办公费">
                    <span v-if="pageState === 'view'">{{submitData.officeMoney}}</span>
                    <el-input v-else type="n umber" v-model="submitData.officeMoney" v-bind:disabled="travelLoanVisible" v-on:input="inputIntCheck($event,'officeMoney')"></el-input>
                  </el-form-item>
                  <el-form-item label="劳务费">
                    <span v-if="pageState === 'view'">{{submitData.laborMoney}}</span>
                    <el-input v-else type="number" v-model="submitData.laborMoney" v-bind:disabled="travelLoanVisible" v-on:input="inputIntCheck($event,'laborMoney')"></el-input>
                  </el-form-item>
                  <el-form-item label="其他">
                    <span v-if="pageState === 'view'">{{submitData.otherMoney}}</span>
                    <el-input v-else type="number" v-model="submitData.otherMoney" v-bind:disabled="travelLoanVisible" v-on:input="inputIntCheck($event,'otherMoney')"></el-input>
                  </el-form-item>
                </el-form-item>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="核销日期">
                <span v-if="pageState === 'view'">{{submitData.hxDate}}</span>
                <el-date-picker
                  v-else
                  v-model="submitData.hxDate"
                  type="date"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  placeholder="核销日期"
                  disabled>
                </el-date-picker>
              </el-form-item>
              <el-form-item label="借款总金额" prop="loanTotal">
                <span v-if="pageState === 'view'">{{submitData.loanTotal}}</span>
                <el-input v-else type="number" v-model="submitData.loanTotal" disabled></el-input>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="备注">
                <span v-if="pageState === 'view'">{{submitData.remarks}}</span>
                <el-input v-else type="textarea" v-model="submitData.remarks"></el-input>
              </el-form-item>
            </el-row>
          </div>
        </el-form>
        <div class="button_wrap" v-if="pageState =='create'">
          <el-button class="exactButton" type="primary" @click="submit(1)">保存</el-button>
          <el-button class="exactButton" type="primary" @click="submit(2)">提交</el-button>
          <el-button class="exactButton" plain @click="handleClose">取消</el-button>
        </div>
        <div class="button_wrap" v-if="pageState =='submit'">
          <el-button class="exactButton" type="primary" @click="submit(2)">提交</el-button>
          <el-button class="exactButton" plain @click="handleClose">取消</el-button>
        </div>
        <div class="button_wrap" v-if="!isAudit && pageState =='edit'">
          <el-button class="exactButton" type="primary" @click="submit(1)">修改</el-button>
          <el-button class="exactButton" plain @click="handleClose">取消</el-button>
        </div>
        <div class="button_wrap" v-if="isAudit">
          <el-button class="exactButton" type="primary" @click="submit(2,'退回')">退回</el-button>
          <el-button class="exactButton" type="primary" @click="submit(2,'通过')">通过</el-button>
          <el-button class="exactButton" plain @click="handleClose">取消</el-button>
        </div>
      </div>
      <div class="TaskRecordWrap" v-if="pageState !== 'create' && dialogVisible">
        <TaskRecord :id="objInstId" :type-id="typeId"></TaskRecord>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { queryUserById } from '@/api/systemList'
import { queryZZWorkGroupUrl, disposeAgentNum } from "@/api/billApi";
import { queryCompany, queryPayMode } from "@/api/feeList";
import { createLoan, modifyLoan, doLoanTask, queryMaterialByObjTypeAndInstId } from "@/api/caseList";
import { deleteMaterial } from "@/api/customerList";
import ChooseCase from '../../../case/components/ChooseCase'
import TaskRecord from '../../../finance/components/TaskRecord'
import MaterialUpload from '../../components/MaterialUpload'
export default {
  name: 'BorrowDetail',
  data() {
    return {
      pageState: 'create',
      dialogTitle: '',
      objInstId: '',
      objType: 1116,
      typeId: 17,
      isAudit: false,
      dialogVisible: false,
      changeCaseVisible: false,
      bjDailyVisible: true, // 北京日常借款
      travelLoanVisible: true, // 差旅借款
      loanNatureOption: ['无案差旅','无案日常','案内差旅','案内日常'],
      sumList: ['beiJingLoanMoney', 'roundTripMoney', 'trafficMoney', 'hotelMoney', 'hospitalityMoney', 'businessMoney', 'officeMoney', 'laborMoney', 'otherMoney'],
      caseArray: [],
      selectData: {
        groupList: [],
        companyList: [],
        payTypeList: [],
        userList: []
      },
      rules: {
        fillinDate: [{required: true, message: '请选择填报日期', trigger: 'blur'}],
        loanNature: [{required: true, message: '请选择借款性质', trigger: 'blur'}],
        wkgId: [{required: true, message: '请选择所属组', trigger: 'blur'}],
        companyId: [{required: true, message: '请选择支付公司', trigger: 'blur'}],
        repaymentDate: [{required: true, message: '请选择还款日期', trigger: 'blur'}],
        payType: [{required: true, message: '请选择支付方式', trigger: 'blur'}],
        loanUserId: [{required: true, message: '请选择借款人', trigger: 'blur'}],
        loanDate: [{required: true, message: '请选择借款日期', trigger: 'blur'}],
        loanReason: [{required: true, message: '请填写借款事由', trigger: 'blur'}],
        loanTotal: [{required: true, message: '总金额不能为空', trigger: 'blur'}]
      },
      materialList: [],
      submitData: {},
      defaultForm: {
        subject: '借款',
        showRefno: '',
        wfStatus: '',
        fillinDate: '',
        loanNature: '',
        companyId: '',
        repaymentDate: '',
        payType: '',
        wkgId: '',
        loanUserId: '',
        loanDate: '',
        loanReason: '',
        beiJingLoanMoney: '',
        businessDays: '',
        roundTripMoney: '',
        trafficMoney: '',
        hotelMoney: '',
        hospitalityMoney: '',
        businessMoney: '',
        officeMoney: '',
        laborMoney: '',
        otherMoney: '',
        hxDate: '',
        loanTotal: '',
        remarks: '',
        caseIds: null,
        materialIdArray: []
      }
    }
  },
  created() {
    this.getallSelectdata()
  },
  methods: {
    borrowView(row) {
      this.dialogTitle = '借款-查看'
      this.pageState = 'view'
      this.isAudit = false
      this.defaultDataInit(row)
    },
    borrowCreate() {
      this.dialogTitle = '借款-提交借款申请'
      this.pageState = 'create'
      this.isAudit = false
      this.defaultDataInit()
    },
    borrowEdit(row) {
      this.dialogTitle = '借款-编辑'
      this.pageState = 'edit'
      this.isAudit = false
      this.defaultDataInit(row)
    },
    borrowSubmit(row) {
      this.dialogTitle = '借款-提交借款申请'
      this.pageState = 'submit'
      this.isAudit = false
      this.defaultDataInit(row)
    },
    borrowAudit(row, pageState) {
      this.dialogTitle = '借款-审核'
      this.pageState = pageState
      this.isAudit = true
      this.defaultDataInit(row)
    },
    defaultDataInit(row) {
      this.dialogVisible = true
      if (this.pageState == 'create') {
        this.submitData = JSON.parse(JSON.stringify(this.defaultForm))
        this.materialList = []
        this.bjDailyVisible = true
        this.travelLoanVisible = true
        var user_id = this.$store.getters.userId
        var to_date = this.$commonUtils.formatDate1(new Date())
        this.submitData.loanUserId = user_id
        this.submitData.fillinDate = to_date
        this.submitData.loanDate = to_date
        this.changeReibuserUserId(user_id)
      } else {
        this.submitData = JSON.parse(JSON.stringify(row))
        if (this.submitData.wfStatus == '已完成') {
          this.pageState = 'view'
        }
        this.objInstId = this.submitData.loanId
        this.loanNature(this.submitData.loanNature)
        this.queryMaterial()
      }
      this.queryPayMode()
    },
    async getallSelectdata() {
      this.selectData.userList = this.$store.getters.userList
      queryZZWorkGroupUrl().then(res => {
        this.selectData.groupList = res.data
      })
      queryCompany().then(res => {
        this.selectData.companyList = res.data
      })
    },
    queryMaterial() {
      this.materialList = []
      this.submitData.materialIdArray = []
      queryMaterialByObjTypeAndInstId({ objType: this.objType, objInstId: this.submitData.loanId }).then(res => {
        res.data.forEach(item => {
          this.materialList.push(item)
          this.submitData.materialIdArray.push(item.materialId)
        })
      })
    },
    // input 整数判断
    inputIntCheck(index) {
      setTimeout(() => {
        if (this.submitData[index] < 0) {
          this.$message({
            message: '金额必须大于0',
            type: 'warning'
          });
          this.submitData[index] = ''
        }
        this.totalAmount()
      }, 500);
    },
    // 附件上传处理,文件追加
    fileList(data) {
      this.materialList.push(data)
      this.submitData.materialIdArray.push(data.materialId)
    },
    // 预览查看
    preView(url) {
      if(['doc','docx'].includes(url.replace(/.+\./,"").toLocaleLowerCase())) {
        this.$commonUtils.viewPdf(`${url}`)
      }else if(['pdf','jpg','png'].some(item=>url.replace(/.+\./,"").toLocaleLowerCase()==item)) {
        window.open(`/ipdoc${url}`.replace(/[+]/g,'%2B'))
      } else {
        this.downLoad(url)
      }
    },
    // 附件下载
    downLoad(url){
      const downData={
        url:`ipdoc${url}`,
        success(){
          // notify.close()
        }
      }
      this.$commonUtils.downLoadAll(downData)
    },
    // 删除附件
    deleteMaterial(materialId, key){
      deleteMaterial({ materialId: materialId }).then(res => {
        this.materialList.splice(key,1)
        this.submitData.materialIdArray.splice(key,1)
        this.$message.success(res.message)
      })
    },
    queryPayMode(e) {
      if (e) {
        this.submitData.payType = ''
      }
      if (this.submitData.companyId) {
        queryPayMode({deptId: this.submitData.companyId}).then(res => {
          this.selectData.payTypeList = res.data
        })
      } else {
        this.selectData.payTypeList = []
      }
    },
    changeReibuserUserId(e) {
      queryUserById(e).then(res=>{
        if(res.data.groups&&res.data.groups.length){
          this.submitData.wkgId= res.data.groups[0].wkgId // 工作组
        }
        if (res.data.department){
          let data = this.selectData.companyList.find(item => item.companyShortName == res.data.department.companyShortName) // 公司
          if (data) {
            this.submitData.companyId = data.deptId
          }
          this.queryPayMode(this.submitData.companyId)
        }
      })
    },
    // 借款性质切换,可填项展现关闭
    loanNature(name) {
      if (name.includes('差旅')) {
        this.travelLoanVisible = false
        this.bjDailyVisible = true
        this.submitData.beiJingLoanMoney = ''
      } else if (name.includes('日常')) {
        this.travelLoanVisible = true
        this.bjDailyVisible = false
        for (var index of this.sumList) {
          if (index != 'beiJingLoanMoney') {
            this.submitData[index] = ''
          }
        }
      }
      this.totalAmount()
    },
    // 获取文案数据
    getList(list) {
      if (list.length) {
        this.submitData.caseIds = list.map(item => item.caseId)
        this.caseArray = list
        disposeAgentNum({agentNumberArray: list.map(item => item.agentNum)}).then(res => {
          this.submitData.showRefno = res.data
        })
      } else {
        this.submitData.showRefno = ''
        this.submitData.caseIds = null
      }
    },
    // 统计借款总额
    totalAmount() {
      let sum = 0
      const sumList = this.sumList
      for (var index of sumList) {
        if (this.submitData[index]) {
          var money = this.submitData[index];
          sum = Number(sum) + Number(money)
        }
      }

      this.submitData.loanTotal = parseFloat(sum).toFixed(2)
    },
    async submit(type, result) {
      if (!this.$commonUtils.formValidate(this.$refs['ruleForm'])) return
      if (this.pageState == 'create'){
        createLoan(this.submitData).then(res => {
          if (res.success){
            this.dialogVisible = false
            if (type == 2){
              this.doBorrowTask(res.data[0].taskId)
            }
            this.$message.success(res.message)
            this.$emit('cancel')
          }
        });
      } else {
        modifyLoan(this.submitData).then(async res => {
          if (res.success){
            this.dialogVisible = false
            if (type == 2){
              await this.doBorrowTask(this.submitData.taskId, result)
            }
            this.$message.success('操作成功')
            this.$emit('cancel')
          }
        });
      }
    },
    doBorrowTask(taskId,resultName) {
      var data = { taskIdList: taskId }
      if (resultName) {
        var result = resultName == '通过' ? 1 : 0
        data = Object.assign(data, { result: result });
      }
      return doLoanTask(data)
    },
    handleClose() {
      this.dialogVisible = false
    }
  },
  components: {
    ChooseCase,
    MaterialUpload,
    TaskRecord
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-dialog {
  height: 90vh;
  overflow: auto;
}
.el-form{
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  .el-select,.el-input,.el-date-picker,.el-textarea{
    width: 95%;
  }
  .el-textarea{
    margin: 10px 0;
  }
  /deep/ input{
    height: 32px;
    line-height: 32px;
  }
  /deep/ .el-input__icon{
    line-height: 32px;
  }
  .el-row{
    min-height: 30px;
    width: 100%;
    display: flex;
    align-items: center;
    .el-form-item{
      width: 100%;
      display: flex;
      border: 1px solid #EBEEF5;
      margin: 0px !important;
      /deep/ .el-form-item__label{
        text-align: left;
        padding-left: 12px;
        background: #f5f7fa;
        display: flex;
        display: -webkit-flex;
        jusitify-content: center;
        align-items: center;
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
.div-upload{
  background: #f5f7fa;
  width: 160px;
  line-height: 40px;
  border: 1px solid #EBEEF5;
  text-align: center;
}
.content {
  width: 100%;
  border: 1px solid #D7D7D7;
  margin-top: 10px;
  padding: 5px;
}
.button_wrap {
  margin-top: 20px;
  width: 100%;
  display: flex;
  justify-content: center;
  .el-button{
    margin-left: 30px;
  }
}
.div-form {
  display: inline-block;
}
.TaskRecordWrap {
  width: 18%;
  margin-top: 20px;
  float: right;
}
</style>

