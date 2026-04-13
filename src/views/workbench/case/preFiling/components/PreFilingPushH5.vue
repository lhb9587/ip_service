<template>
  <div>
    <tabbar-h5 title="预立卷审批"></tabbar-h5>
    <div class="content">
      <div class="status">
        <div>
          <span
            style="display: inline-block;margin:0 10px;height: 10px;width: 10px;border-radius: 50%;background-color: #008000"></span>{{taskStatus}}
        </div>
      </div>
      <approve-form-h5 :form-data="approveFormData" :key-value="keyValue"></approve-form-h5>
      <div class="status">
        <!--          <span style="font-weight: bold">审批意见:</span>-->
        <el-input placeholder="请输入审批意见" type="textarea" v-model="formData.auditNote"></el-input>
      </div>
      <div class="fl-ac-jc">
        <template v-if="taskStatus !== '已完成'">
          <el-button class="exactButton" size="small" type="primary" @click="passOrReturn(1)">通过</el-button>
          <el-button class="exactButton" size="small" type="primary" @click="passOrReturn(0)">退回</el-button>
        </template>
        <el-button type="primary" size="small" @click="closeWindow">关 闭</el-button>
      </div>
    </div>

  </div>
</template>

<script>
import ApproveFormH5 from "../../../../../layout/components/ApproveFormH5";
import TabbarH5 from "../../../../../layout/components/TabbarH5";
import {mapGetters} from "vuex";
import {passOrReturn, preCaseApproval, queryMaterialByCaseIdUrl} from "../../../../../api/caseList";

export default {
  name: "PreFilingPushH5",
  components: {TabbarH5, ApproveFormH5},
  computed: {
    tmCaseTypeList() {
      return this.$store.getters.tmCaseTypeList
    },
    ...mapGetters(["token", "name", "userId"])
  },
  data() {
    return {
      taskStatus: '',
      // 案件类型 预立卷文号  客户名称 客户信用等级 申请人 案件名称 商标名称 上传文件  提交说明 提交人 提交时间 审批人
      gridData: [],
      dialogcheckChongTuVisible: false,
      rules: {
        auditUserIds: [
          {type: 'array', required: true, message: '请选择审批人', trigger: 'change'},
        ],
      },
      update: true,
      keyValue: {},
      approveFormData: {},
      formData: {auditUserIds: [], auditNote: '', appNote: ''},
      queryDeliverList: [],
      submitData: {
        appNote: '',
        auditUserIds: [],
        audit: 1,
        taskId: this.$route.query.taskId,
        userId: this.$store.getters.userId
      },
      isYunFen: false,
      curUploadTitle: '',
      typeNameList: [],
      materialList: []
    }
  },
  created() {
    this.preCaseApproval()
    this.taskStatus = this.$route.query.taskStatus
    // this.queryCustGroup(),
    // this.queryMaterialTypeByDocId()
  },
  methods: {
    passOrReturn(result) {
      const data = {
        taskId: this.$route.query.taskId,
        userId: this.$store.getters.userId,
        result,
        taskType: this.$route.query.taskType,
        caseId: this.formData.caseId,
        tmCaseId: this.formData.tmCaseId,
        auditUserId: this.$store.getters.userId,
        auditId: this.formData.auditId,
        auditNote: this.formData.auditNote,
        draftNumber: this.formData.agentNum,
        submitUserId: this.formData.submitUserId
      }
      passOrReturn(data).then(async res => {
        if (res.success) {
          await this.$message.success('审批成功！')
          this.closeWindow()
        }
      })
    },
    closeWindow() {
      window.location.href = "about:blank";
      window.close();
    },
    preCaseApproval() {
      const data = {
        userId: this.$store.getters.userId,
        taskId: this.$route.query.taskId,
        taskType: this.$route.query.taskType
      }
      preCaseApproval(data).then(async res => {
        if (res.data.data) {
          res.data.appNote = res.data.data.appNote
          res.data.auditId = res.data.data.auditId
          res.data.submitDate = new Date(res.data.data.submitDate).toLocaleDateString()
          res.data.auditNote = res.data.data.auditNote
          res.data.submitUser = res.data.data.submitUser
          res.data.submitUserId = res.data.data.submitUserId
          this.formData.auditUserIds = res.data.data.auditUserId ? [res.data.data.auditUserId] : []
          delete res.data.data
        }
        this.formData = Object.assign(this.formData, JSON.parse(JSON.stringify(res.data)))
        await this.queryMaterialByCaseIdUrl()
        this.formData.currentUserName = this.$store.getters.name
        this.keyValue = {
          caseType: '案件类型',
          agentNum: '预立卷文号',
          name: '客户名称',
          [this.tmCaseTypeList.includes(this.formData.caseType) ? 'caseName' : 'tmName']: this.tmCaseTypeList.includes(this.formData.caseType) ? '案件名称' : '商标名称',
          materialList: '上传文件',
          appNote: '提交说明',
          submitUser: '提交人',
          submitDate: '提交时间',
          currentUserName: '审批人',
        }
        const {caseType, agentNum, name, appNote, submitUser, submitDate, currentUserName} = this.formData
        this.approveFormData = {
          caseType,
          agentNum,
          name,
          [this.tmCaseTypeList.includes(this.formData.caseType) ? 'caseName' : 'tmName']: this.tmCaseTypeList.includes(this.formData.caseType) ? this.formData.caseName || this.formData.caseCnName : this.formData.tmName,
          materialList: this.materialList,
          appNote,
          submitUser,
          submitDate,
          currentUserName
        }
        this.$forceUpdate()
      })
    },
    async queryMaterialByCaseIdUrl() {
      await queryMaterialByCaseIdUrl({caseIds: this.formData.caseId}).then(res => {
        if (res.data) {
          this.materialList = res.data[0] && res.data[0].materialArray || []
        }
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.content {
  height: 100vh;
  background-color: #F7F7F7;
  padding-top: 45px;
  padding-bottom: 45px;
  font-size: 14px;
  overflow: auto;
}

.status {
  width: 100%;
  padding: 10px 0;

  div {
    padding: 10px;
    background-color: #fff;
  }
}

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

</style>
