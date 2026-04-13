<template>
  <div>
    <BreadCrumbCase v-if="caseDetailFormData.caseId" :caseDetailFoemData="caseDetailFormData"></BreadCrumbCase>
    <el-row>
      <el-col class="createPost-container" :span="21">
        <el-tabs v-model="activeName" @tab-click="handleClickTab">
          <el-tab-pane name="first" label="案件详情">
            <div class="form-container">
              <KindsOfPatentCase ref="patentComponents" @getBackData="getBackData"
                                 @getValue="getValue"></KindsOfPatentCase>
            </div>

          </el-tab-pane>
          <el-tab-pane label="特殊指示" name="second">
            <el-row>
              <el-col class="tilteSpan" :span="24">
                <span id='-title'>客户个案要求</span>
              </el-col>
            </el-row>
            <el-row>
              <el-col class="form-con-item" :span="24">
                <el-row class="form-border">
                  <el-col :span="24">
                    <el-row class="fullRow">
                      <el-col :span="24">
                        <div label="客户个案要求:" class="postInfo-container-item">
                          <template>
                            <el-input type="textarea" :rows="3" v-model="caseDetailFormData.custCommand"
                                      placeholder="请输入">
                            </el-input>

                          </template>
                        </div>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <el-row>
              <el-col class="tilteSpan" :span="24">
                <span>特殊指示-案件指示</span>
              </el-col>
            </el-row>
            <el-row>
              <el-col class="form-con-item" :span="24">
                <SpecialInstructions label="案件特殊指示" type="view"
                                     :data="{custFullNameString:caseDetailFormData.custName,customerRequirementBillList:custReqCases}"></SpecialInstructions>
              </el-col>
            </el-row>
            <el-row>
              <el-col class="tilteSpan" :span="24">
                <span>特殊指示-账单指示</span>
                <!--<caseBill :billData='caseDetailFoemData'></caseBill>-->
              </el-col>
            </el-row>
            <el-row>
              <SpecialInstructions type="view"
                                   :data="{custFullNameString:caseDetailFormData.custName,customerRequirementBillList:custReqBills}"></SpecialInstructions>

            </el-row>
            <el-row>
              <el-col class="tilteSpan" :span="24">
                <span>客户活动</span>
              </el-col>
            </el-row>
            <el-row>
              <SpecialInstructions v-for="(item, index) in custActivityList" :key="index" type="view"
                                   :label="item.actType"
                                   :data="{custFullNameString:caseDetailFormData.custName,customerRequirementBillList:item.custActivity}"></SpecialInstructions>

            </el-row>
          </el-tab-pane>
          <el-tab-pane label="办案人" name="third">
            <CaseInvestigators :isPatent="true" :prePage="prePage" :caseDetailData='caseDetailFormData' :isEdit="true"
                               @workGroup="workGroup" @caseRoleSelectList="(v)=>{caseRoleSelectList = v}"
                               v-if="activeName==='third'"></CaseInvestigators>
          </el-tab-pane>
          <el-tab-pane label="账单费用" name="fourth">
            <caseBill v-if="caseDetailFormData.caseId" :billData='caseDetailFormData'></caseBill>
          </el-tab-pane>
          <el-tab-pane label="案件进展" name="Fifth">
            <ElectronicArchives v-if="caseDetailFormData.caseId && activeName==='Fifth'"
                                :taskType="$route.query.taskType" :caseTypeId="caseDetailFormData.caseTypeId"
                                :caseEvolve="caseDetailFormData.caseEvolve" :isEdit="true"
                                :agentNum="caseDetailFormData.agentNum" :curCaseId="caseDetailFormData.caseId"
                                :custId="caseDetailFormData.custId"></ElectronicArchives>
          </el-tab-pane>
          <el-tab-pane label="著变信息" name="six">
            <SignificantChange v-if="activeName==='six' &&caseDetailFormData.caseId"
                               :case-id="caseDetailFormData.caseId"
                               :custId="caseDetailFormData.custId"></SignificantChange>
          </el-tab-pane>
        </el-tabs>

      </el-col>
      <el-col :span="3">
        <div style="height: 520px;position: fixed;top:20%;right:2%">
          <el-steps :space="200" :active="stepActive1" direction="vertical">
            <el-step v-for="(item,index) in elstepList" :title="item.title"
                     @click.native="getTopPosition(item.id,index)" v-if="item.state"></el-step>
          </el-steps>
        </div>
      </el-col>
    </el-row>
    <div class="fl-ac-jc">
      <el-button v-if="!caseDetailFormData.ctAudit || [2, 3, 4].includes(caseDetailFormData.ctAudit)" type="primary" @click="submitCaseForm(undefined, 1, 1)">保 存</el-button>

      <template v-if="caseDetailFormData.ctAudit === 1">
        <el-button size="medium" style="margin-right:10px" type="primary" @click="chongtuTestFunc(true)">
          检查冲突
        </el-button>
        <el-button size="medium" style="margin-right:10px" type="primary" @click="alertChongtuAuditFunc(1)">
          通 过
        </el-button>
        <el-button size="medium" style="margin-right:10px" type="primary" @click="alertChongtuAuditFunc(2)">
          退 回
        </el-button>
      </template>
      <template v-if="caseDetailFormData.ctAudit === 2">
        <el-button size="medium" style="margin-right:10px" type="primary" @click="dialogcheckChongTuBtn">
          提 交
        </el-button>
      </template>
      <template>
        <el-button size="medium"
                   v-if="(caseDetailFormData.ctAudit === 4 || !caseDetailFormData.ctAudit)&&$route.query.pageId&&curCustLevel&&!(caseDetailFormData.agentNum&&caseDetailFormData.agentNum.includes('PT'))"
                   style="margin: 0 10px" type="primary"
                   @click="creatCaseForm(1, 1)">立卷
        </el-button>
        <el-dropdown trigger="click" placement="top" @command="filingOperation"
                     v-if="(caseDetailFormData.ctAudit === 4 || !caseDetailFormData.ctAudit)&&$route.query.pageId&&!curCustLevel&&!(caseDetailFormData.agentNum&&caseDetailFormData.agentNum.includes('PT'))"
                     style="margin:0 10px">
          <el-button type="primary">
            立卷<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="prefiling">预立卷审批</el-dropdown-item>
            <el-dropdown-item command="createBills">创建账单</el-dropdown-item>
            <el-dropdown-item command="lowCreditAudit">低信用审核</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </template>

      <el-button type="primary" @click.native="()=>{$router.go(-1)}">取 消</el-button>
    </div>

    <!--    时限-->
    <el-dialog
      top="0"
      :visible.sync="poppingTimeLimitState"
      width="60%"
      :close-on-click-modal="false"
      :show-close="false"
      :close-on-press-escape="false"
      :lock-scroll="false"
      :modal="false"
      title="创建时限"
      class="dialog——body——padding"
      v-dialogDrag
      center
    >
      <poppingTimeLimit :isPatent="true" v-if="poppingTimeLimitState" disabled @cancel="closePoppingTimeLimit"
                        :list="caseData"></poppingTimeLimit>
    </el-dialog>

    <!--  冲突  -->
    <el-dialog :close-on-click-modal="false" title="请注意:" :visible.sync="dialogcheckChongTuVisible" class="chongtuTitle">
      <el-row style="margin: 10px 5px">
        <el-col :span="24">
          <span
            style="font-size:17px;color: #ff0000">被申请人与下列我方代理过的客户/申请人名称相同/近似，请提交客户管理组刘佳进行冲突检索，审核通过后方可继续立案。</span>
        </el-col>
      </el-row>
      <el-table :data="gridData">
        <el-table-column property="agentNum" label="案件文号"></el-table-column>
        <el-table-column property="caseType" label="案件类型"></el-table-column>
        <el-table-column property="caseName" label="案件名称">
          <template slot-scope="scope">
            <span v-html="highlightKey(scope.row.caseName, scope.row.keyName)"></span>
          </template>
        </el-table-column>
        <el-table-column property="droitNumber" label="权利号"></el-table-column>
        <el-table-column property="applicantName" label="申请人">
          <template slot-scope="scope">
            <span v-html="highlightKey(scope.row.applicantName, scope.row.keyName)"></span>
          </template>
        </el-table-column>
        <el-table-column property="custName" label="客户名称">
          <template slot-scope="scope">
            <span v-html="highlightKey(scope.row.custName, scope.row.keyName)"></span>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogcheckChongTuVisible = false">取 消</el-button>
        <el-button v-if="caseDetailFormData.ctAudit !== 1" type="primary" @click="dialogcheckChongTuBtn">提 交</el-button>
      </div>
    </el-dialog>

    <el-dialog :close-on-click-modal="false" title="提示" :visible.sync="chongtuAuditViewCom" width="40%">
      <el-row>
        <el-col :span="24" style="text-align: center">
          <el-form>
            <el-form-item label="理由:">
              <el-input v-model="chongtuAuditReason"></el-input>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="chongtuAuditView = false">取 消</el-button>
        <el-button type="primary" @click="chongtuAuditFunc(chongtuAuditView)">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import SignificantChange from './SignificantChange'
  import ElectronicArchives from '@/views/workbench/case/components/ElectronicArchives.vue'
  import CaseBill from '@/views/workbench/case/components/CaseBill.vue'
  import CaseInvestigators from '@/views/workbench/case/components/CaseInvestigators.vue'
  import SpecialInstructions from '@/views/workbench/finance/billviews/components/SpecialInstructions'
  import BreadCrumbCase from './BreadCrumbCase'
  import KindsOfPatentCase from './KindsOfPatentCase'
  import poppingTimeLimit from '@/views/workbench/toDoTasks/poppingTimeLimit.vue'
  import { billSubmitUrl, billDiscount } from '@/api/billApi'
  import {
    saveCaseInfoUrl,
    heighCreditUrl,
    queryCustomerReqUrl,
    chongtuTest,
    tijiao,
    chongtuAudit
  } from '@/api/caseDetail'
  import {
    getCaseTime,
    deleteCase
  } from '@/api/caseList'
  import { queryCaseAppExamine } from '@/api/customerList'

  let that = {}
  export default {
    name: 'PatentCase',
    props: {
      isEdit: {
        type: Boolean,
        default: false
      },
      prePage: {
        default: '案件管理'
      }
    },
    data() {
      return {
        chongtuAuditReason: '',
        chongtuAuditView: false,
        gridData: [],
        chongtuType: '',
        chongtuForwordType: '',
        dialogcheckChongTuVisible: false,
        caseRoleSelectList: [],
        isCopy: '',
        // nullValueList: [],
        backData: {},
        caseType: '',
        stepActive1: 0,
        elstepList: [],
        activeName: 'first',
        caseDetailFormData: {},
        curCustLevel: false,
        caseIds: '',
        poppingTimeLimitState: false,
        prefiling: false,
        caseData: {},
        custReqCases: [],
        custReqBills: [],
        custActivity: [],
        custActivityList: []
      }
    },
    computed: {
      chongtuAuditViewCom(){
        return !!this.chongtuAuditView
      },
    },
    components: {
      BreadCrumbCase,
      KindsOfPatentCase,
      poppingTimeLimit,
      SpecialInstructions,
      CaseInvestigators,
      CaseBill,
      ElectronicArchives,
      SignificantChange
    },
    mounted() {
    },
    created() {
      //test
      // this.caseData = JSON.parse(localStorage.getItem('testTimelimit'))
      // this.caseData[0].timelimit = this.caseData[0].timelimitList[0]
      // this.caseData[0].timelimitList[1] = JSON.parse(JSON.stringify( this.caseData[0].timelimitList[0]))
      // this.caseData[1] = JSON.parse(JSON.stringify(this.caseData[0]))
      // this.poppingTimeLimitState = true

      this.isCopy = this.$route.query.copy || ''
      const id = this.$route.params && this.$route.params.id
      //  this.$route.query.pageId
      this.caseIds = id.split(',')
    },
    watch: {},
    methods: {
      highlightKey(text, key) {
        if (!key || !text || text.indexOf(key) === -1) {
          // 没有匹配到就原样返回
          return text;
        }
        const regex = new RegExp(key, 'gi');
        return text.replace(regex, `<span style="color: red;">${key}</span>`);
      },
      async chongtuTestFunc(flag) {
        if (this.caseDetailFormData.ctAudit && !flag) return false
        const data = this.$commonUtils.cleanNullAttr(this.caseDetailFormData)
        delete data.status

        return new Promise(resolve => {
          chongtuTest({
            taskType: 4,
            taskId: this.caseDetailFormData.taskId,
            draftNumber: this.caseDetailFormData.agentNum,
            ...data
          }).then(res => {
            if (res.messageType == 10) {
              this.checkChongTuSet(res.data.length > 500 ? res.data.splice(0, 500) : res.data, '', '')
              resolve(true)
            } else {
              resolve(false)
            }
          }).catch(err => {
            resolve(true)
          })
        })
      },
      alertChongtuAuditFunc(type) {
        this.chongtuAuditView = type
      },
      chongtuAuditFunc(result) {
        if (!this.chongtuAuditReason) {
          this.$message.error(`请填写${result === 1 ? '通过' : '退回'}理由！`)
          return
        }
        chongtuAudit({
          taskType: 4,
          failReason: this.chongtuAuditReason,
          taskId: this.caseDetailFormData.taskId,
          result: result === 1 ? 1 : 0
        }).then(res => {
          this.$message.success('审核成功！')
          this.updateCtAudit()
        })
      },
      getTopPosition(el, active) {
        this.stepActive1 = active
        this.$refs['patentComponents'].getTopPosition(el)
      },
      workGroup(work) {
        this.caseDetailFormData.trademarkCaseCustWorkgroups[0].trademarkCaseWorkgroupMembers =
          work.trademarkCaseCustWorkgroups[0].trademarkCaseWorkgroupMembers
        this.caseDetailFormData.trademarkCaseLCWorkgroups[0].trademarkCaseWorkgroupMembers =
          work.trademarkCaseLCWorkgroups[0].trademarkCaseWorkgroupMembers
        this.caseDetailFormData.trademarkCaseCBWorkgroups =
          work.trademarkCaseCBWorkgroups
      },
      //切换tab
      handleClickTab(tab, event) {
        if (tab.index == '1' && this.caseDetailFormData.custId) {
          queryCustomerReqUrl({ custId: this.caseDetailFormData.custId, caseId: this.caseDetailFormData.caseId }).then(
            res => {
              this.custReqBills = res.data.custReqBills
              this.custReqCases = res.data.custReqCases
              this.custActivity = res.data.custActivity
              this.custActivity.forEach(item => {
                item.specialInfo = item.subject + '\r\n' + item.specialInfo
                if (this.custActivityList.find(i => i.actType == item.actType)) {
                  this.custActivityList.find(i => i.actType == item.actType).custActivity.push(item)
                } else {
                  this.custActivityList.push({
                    actType: item.actType,
                    custActivity: [item]
                  })
                }
              })
            }
          )
        }
      },
      // changeNullValue(list){
      //   this.nullValueList = []
      //   if(list&&list.length){
      //     this.nullValueList = list
      //   }
      // },
      getBackData(data) {
        this.backData = data
      },
      getValue(value) {
        that = value
        this.caseDetailFormData = that.caseDetailFormData
        this.backData.divcaseList && this.backData.divcaseList.join('') == this.caseDetailFormData.divcaseList && this.caseDetailFormData.divcaseList.join('')
          ? this.caseDetailFormData.clearDivcase = 0
          : this.caseDetailFormData.clearDivcase = 1

        this.curCustLevel = that.curCustLevel
        // this.caseIds = this.caseDetailFormData.caseIds
        if (that.stepActive1 || that.stepActive1 == 0) {
          this.stepActive1 = +that.stepActive1
        }

        this.caseType = this.caseDetailFormData.caseType
        if (['普通新申请', 'PCT国家阶段', 'PCT国际申请'].includes(this.caseDetailFormData.caseType)) {
          this.elstepList = [
            { title: '基本信息', state: true, id: 'info-title' },
            { title: '客户', state: true, id: 'cust-title' },
            { title: '申请人', state: true, id: 'app-title' },
            { title: '发明人', state: true, id: 'inventor-title' },
            {
              title: '外代所',
              state: this.caseDetailFormData.appFromto == '内-外' || this.caseDetailFormData.appFromto == '外-外',
              id: 'wds-title'
            },
            { title: '要求优先权', state: true, id: 'priority-title' },
            { title: '新申请递交', state: true, id: 'new-app-title' },
            // {title: "个案信息", state: true, id: "case-info-title"},
            { title: 'PCT国家阶段', state: this.caseType == 'PCT国家阶段', id: 'country-title' },
            { title: '专利基础信息', state: true, id: 'patent-base-title' },
            { title: '立卷信息', state: true, id: 'create-info-title' }
          ].filter(item => item.state)
        } else {
          this.elstepList = [
            { title: '基本信息', state: true, id: 'info-title' },
            { title: '委托方', state: this.caseType == '无效', id: 'wt-title' },
            { title: '客户', state: true, id: 'cust-title' },
            { title: '申请人', state: this.caseType != '翻译', id: 'app-title' },
            { title: '许可人', state: this.caseType == '许可备案', id: 'xk-title' },
            {
              title: '发明人',
              state: this.caseType != '顾问服务' && this.caseType != '无效' && this.caseType != '咨询' && this.caseType != '许可备案' && this.caseType != '翻译',
              id: 'inventor-title'
            },
            {
              title: '要求优先权',
              state: this.caseType != '顾问服务' && this.caseType != '无效' && this.caseType != '咨询' && this.caseType != '许可备案' && this.caseType != '翻译',
              id: 'priority-title'
            },
            {
              title: '外代所',
              state: (this.caseDetailFormData.appFromto == '内-外' || this.caseDetailFormData.appFromto == '外-外') && (this.caseType != '无效' && this.caseType != '咨询' && this.caseType != '许可备案'),
              id: 'wds-title'
            },

            { title: '新申请递交', state: this.caseType == '欧洲专利国家生效', id: 'new-app-title' },
            // { title: "个案信息", state: true, id: "case-info-title" },
            // { title: "PCT国家阶段", state: this.caseDetailFormData.caseType == 'PCT国家阶段', id: "country-title" },
            {
              title: '专利基础信息',
              state: ['咨询', '许可备案', '翻译', '欧洲专利国家生效'].includes(this.caseDetailFormData.caseType),
              id: 'patent-base-title'
            },
            {
              title: '母案信息',
              state: ['香港登记', '澳门登记'].includes(this.caseType),
              id: 'parent-title'
            },
            {
              title: '香港申请信息',
              state: ['香港登记'].includes(this.caseType),
              id: 'hk-app-title'
            },
            {
              title: '澳门申请信息',
              state: ['澳门登记'].includes(this.caseType),
              id: 'am-app-title'
            },
            { title: '立卷信息', state: true, id: 'create-info-title' }
          ].filter(item => item.state)
        }

      },
      closePoppingTimeLimit() {
        this.poppingTimeLimitState = false
        if (this.prefiling) {
          this.$router.push({
            path: '/workbench/case/preFilingPush/1',
            query: { taskId: this.caseDetailFormData.taskId, taskType: 4 }
          })
          return
        }
        this.goNext()
      },
      async checkJianjiao() {
        if (this.caseDetailFormData.appFromto == '外-内' || this.caseDetailFormData.appFromto == '内-内' || this.caseDetailFormData.appFromto == '台-内') {
          return await this.$confirm('请核查申请人的“已费用减缴备案”和“备案年度”是否正确',
            '提示',
            {
              // distinguishCancelAndClose:true,
              confirmButtonText: '核查',
              cancelButtonText: '不核查',
              type: 'warning'
            }
          ).then(() => {
            return 1
          }).catch((err) => {
            return 0
          })
        }
        return 0
      },
      async validateRules() {
        if (this.$route.query.flag === 'noCheck') {
          return true
        }
        if (this.caseType == '无效') {
          if (!this.caseDetailFormData.patentRighter) {
            this.$message.error('请填写委托方中的专利权人！')
            return false
          }
          if (!this.caseDetailFormData.disableAppliant) {
            this.$message.error('请填写委托方中的请求人！')
            return false
          }
          if (this.caseDetailFormData.patentCaseApplicationList && !this.caseDetailFormData.patentCaseApplicationList.length) {
            this.$message.error('请增加申请人！')
            return false
          }
          if (this.caseDetailFormData.disableWtr == 1) {
            if (this.caseDetailFormData.patentRighter !== this.caseDetailFormData.patentCaseApplicationList[0].applicantName) {
              this.$message.error('专利权人名称必须和第一申请人名称一致！')
              return false
            }
          } else if (this.caseDetailFormData.disableWtr == 2) {
            if (this.caseDetailFormData.disableAppliant !== this.caseDetailFormData.patentCaseApplicationList[0].applicantName) {
              this.$message.error('请求人名称必须和第一申请人名称一致！')
              return false
            }
          }
        }
        if (['内-外', '外-外'].includes(this.caseDetailFormData.appFromto) && !this.caseDetailFormData.toCountry && this.caseType !== '海牙国际申请') {
          this.$message.error('请选择进入国家！')
          return false
        }
        if (['内-外', '外-外'].includes(this.caseDetailFormData.appFromto) && (!this.caseDetailFormData.designatedCountryList || !this.caseDetailFormData.designatedCountryList.length) && this.caseType == '海牙国际申请') {
          this.$message.error('请选择指定国家！')
          return false
        }
        if (['内-外', '外-外'].includes(this.caseDetailFormData.appFromto) && !this.caseDetailFormData.agencyCustId) {
          this.$message.error('请选择外方代理所!')
          return false
        }
        if (!this.$commonUtils.checkBA(this.caseRoleSelectList)) {
          this.$message.error('承办律师或客户律师有误！')
          return false
        }
        if(!this.caseDetailFormData.trademarkCaseCustWorkgroups || 
           !this.caseDetailFormData.trademarkCaseCustWorkgroups[0] || 
           !this.caseDetailFormData.trademarkCaseCustWorkgroups[0].wkgId){
          this.$message.error('请选择客户组')
          return false
        }
        if(!this.caseDetailFormData.caseCustRespUserArray || 
           !this.caseDetailFormData.caseCustRespUserArray.length){
          this.$message.error('请选择客户负责人')
          return false
        }
        if (['普通新申请','PCT国家阶段'].includes(this.caseDetailFormData.caseType) && !this.caseDetailFormData.actualAttorney) {
          this.$message.error('请选择撰稿人')
          return false
        }
        this.$route.query.copy = 'false'
        if (!this.caseDetailFormData.patentType) {
          this.$message.error('请选择专利类型!')
          return false
        }
        if (!this.caseDetailFormData.appFromto) {
          this.$message.error('请选择申请方向!')
          return false
        }
        if (!this.caseDetailFormData.caseCnName) {
          this.$message.error('请填写案件中文名称!')
          return false
        }
        if (this.caseDetailFormData.feeReduce > 1 || this.caseDetailFormData.feeReduce < 0) {
          this.$message.error('费减比例数据错误!')
          return false
        }
        if (this.caseDetailFormData.patentCaseApplicationList && this.caseDetailFormData.patentCaseApplicationList.length) {
          if (this.caseDetailFormData.patentCaseApplicationList.some(i => !i.no && i.no !== 0)) {
            this.$message.error('申请人的序号不能为空')
            return false
          }
          let firstlist = [this.caseDetailFormData.patentCaseApplicationList[0]]
          if (firstlist.length && !+this.caseDetailFormData.feeReduce && (firstlist[0].fyjhbeian || firstlist[0].beianYear)) {
            if (await this.checkJianjiao()) {
              return false
            }
          } else if (firstlist.length && +this.caseDetailFormData.feeReduce && (!firstlist[0].fyjhbeian || firstlist[0].beianYear != new Date().getFullYear())) {
            if (await this.checkJianjiao()) {
              return false
            }
          }
        }
        if (this.caseDetailFormData.patentInventorList && this.caseDetailFormData.patentInventorList.length) {
          if (this.caseDetailFormData.patentInventorList.some(i => !i.no && i.no !== 0)) {
            this.$message.error('发明人的序号不能为空')
            return false
          }
        }
        return true
      },
      //预立卷审批等组合按钮
      async filingOperation(command) {
        if (!await this.validateRules()) return
        if (command === 'prefiling') {
          this.submitCaseForm('prefiling', 1, 1)
        } else if (command == 'createBills') {
          this.$router.push({
            path: '/workbench/finance/off_bill/bill',
            query: {
              taskId: this.caseDetailFormData.taskId,
              agentNum: this.caseDetailFormData.agentNum
            }
          })
        } else {
          if (this.caseDetailFormData.patentCaseApplicationList && this.caseDetailFormData.patentCaseApplicationList.length) {
            const res = await queryCaseAppExamine({appIds: this.caseDetailFormData.patentCaseApplicationList.map(i => i.appId), caseIds: [this.caseDetailFormData.caseId]})
            if (res.messageType == 300) {
              this.$message.warning('该主体为新申请人，请在申请人界面提交审核，由客户管理组审查后再立案')
              return;
            }
          }
          billSubmitUrl({
            taskId: this.caseDetailFormData.taskId,
            userId: this.$store.getters.userId
          }).then(res => {
            this.$message.success('低信用审核已发送')
            this.goNext()
          })
        }
      },
      async creatCaseForm(checkCase = 1, checkChongTu = 1) {
        if (!await this.validateRules()) return

        if (this.caseDetailFormData.patentCaseApplicationList && this.caseDetailFormData.patentCaseApplicationList.length) {
          const res = await queryCaseAppExamine({appIds: this.caseDetailFormData.patentCaseApplicationList.map(i => i.appId), caseIds: [this.caseDetailFormData.caseId]})
          if (res.messageType == 300) {
            this.$message.warning('该主体为新申请人，请在申请人界面提交审核，由客户管理组审查后再立案')
            return;
          }
        }
        // if(!this.$commonUtils.checkBA(this.caseRoleSelectList)){
        //   this.$message.error('承办律师或客户律师有误！')
        //   return
        // }
        // this.$route.query.copy = 'false'
        // if (!this.caseDetailFormData.patentType && !['咨询', '许可备案', '顾问服务', '政府项目', '其他'].includes(this.caseType)) {
        //   this.$message.error('请选择专利类型!')
        //   return
        // }
        // if (!this.caseDetailFormData.appFromto) {
        //   this.$message.error('请选择申请方向!')
        //   return
        // }
        // if (!this.caseDetailFormData.caseCnName) {
        //   this.$message.error('请填写案件中文名称!')
        //   return
        // }
        // if (this.caseDetailFormData.feeReduce > 1 || this.caseDetailFormData.feeReduce < 0) {
        //   this.$message.error('费减比例数据错误!')
        //   return
        // }
        // if (this.caseDetailFormData.patentCaseApplicationList && this.caseDetailFormData.patentCaseApplicationList.length) {
        //   if (this.caseDetailFormData.patentCaseApplicationList.some(i => !i.no && i.no !== 0)) {
        //     this.$message.error('申请人的序号不能为空')
        //     return
        //   }
        //   let firstlist = [this.caseDetailFormData.patentCaseApplicationList[0]]
        //   if (firstlist.length && !+this.caseDetailFormData.feeReduce && (firstlist[0].fyjhbeian || firstlist[0].beianYear)) {
        //     if (await this.checkJianjiao()) {
        //       return
        //     }
        //   } else if (firstlist.length && +this.caseDetailFormData.feeReduce && (!firstlist[0].fyjhbeian || firstlist[0].beianYear != new Date().getFullYear())) {
        //     if (await this.checkJianjiao()) {
        //       return
        //     }
        //   }
        // }
        // if (this.caseDetailFormData.patentInventorList && this.caseDetailFormData.patentInventorList.length) {
        //   if (this.caseDetailFormData.patentInventorList.some(i => !i.no && i.no !== 0)) {
        //     this.$message.error('发明人的序号不能为空')
        //     return
        //   }
        // }
        let compareData = this.$commonUtils.compareObjAttrs(this.backData, this.caseDetailFormData)
        this.$commonUtils.handleObjNullAttr(compareData, this.backData)
        let data = {
          ...compareData,
          ...{
            taskId: this.backData.taskId,
            caseId: this.backData.caseId,
            userId: this.$store.getters.userId,
            taskType: 4,
            checkCase,
            checkChongTu
          }
        }
        if (await this.chongtuTestFunc()) return ;
        delete data.checkChongTu
        heighCreditUrl(data)
          .then(response => {
            if (response.messageType == -6) {
              this.$confirm(
                response.message + ' 请确认是否继续立卷?',
                '提示',
                {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }
              ).then(() => {
                this.creatCaseForm(0, 1)
              })
              return
            }
            if (response.messageType == '10') {
              this.checkChongTuSet(response.data, '', '')
              return
            }
            if (response.messageType == 12) {
              this.$confirm('时限生成失败',
                '提示',
                {
                  confirmButtonText: '确定',
                  // cancelButtonText: '取消',
                  showCancelButton: false,
                  type: 'warning'
                }
              ).then(() => {
                this.goNext() //test
              }).catch(err => {
                this.goNext()
              })
              return
            }
            if (response.messageType == 13) {
              this.caseData = response.data
              this.caseData[0].timelimit = this.caseData[0].timelimitList[0]
              // localStorage.setItem('testTimelimit',JSON.stringify(this.caseData))
              this.poppingTimeLimitState = true
              return
            }
            if (!response.messageType) {
              this.$message.success('立卷成功')
            }
            this.goNext() //test
          })
          .catch(err => {
          })
      },
      checkChongTuSet(chongData, type, forwordType) {
        this.gridData = chongData.length > 500 ?chongData.splice(0, 500) : chongData
        this.chongtuType = type
        this.chongtuForwordType = forwordType
        this.dialogcheckChongTuVisible = true
      },
      dialogcheckChongTuBtn() {
        // if (this.chongtuType == 'sive') {
        //   this.submitCaseForm(this.chongtuForwordType, 0, 0)
        // } else {
        //   this.creatCaseForm(0, 0)
        // }
        //
        // this.dialogcheckChongTuVisible = false
        tijiao({
          taskType: 4,
          taskId: this.caseDetailFormData.taskId
        }).then(async res => {
          this.$message.success('提交成功!')
          await this.updateCtAudit()
          this.dialogcheckChongTuVisible = false
        })
      },
      async updateCtAudit() {
        this.goNext()
        // this.$router.go(-1)
        // lawsuitUrl({ caseIds: this.mainCaseIds }).then(response => {
        //   this.$set(this.caseDetailFoemData, 'ctAudit', response.data.ctAudit)
        //   this.$set(this.caseDetailFoemData, 'taskId', response.data.taskId)
        // })
      },
      async submitCaseForm(forwordType, checkCase = 1, checkChongTu = 1) {
        if (!await this.validateRules()) return
        // if (checkCase !== 0 && this.caseDetailFoemData.patentCaseApplicationList && !this.selectData.apps.find(i => this.caseDetailFoemData.agentPartyArray.find(j => j.applicantName === i.applicantName))) {
        //   await this.$confirm('建立新申请人需要提交客户管理岗审核', '提示', {
        //     confirmButtonText: '提交审核',
        //     cancelButtonText: '取消',
        //     type: 'warning'
        //   }).then(() => {
        //     this.caseDetailFoemData.appSub = 1
        //     // this.caseDetailFoemData.appId = '0000'
        //   }).catch(() => {
        //     this.caseDetailFoemData.appSub = 0
        //     // this.caseDetailFoemData.appId = '0000'
        //     // this.caseDetailFoemData.appCnName = '0000'
        //   })
        //   return
        // }
        // if(!this.$commonUtils.checkBA(this.caseRoleSelectList)){
        //   this.$message.error('承办律师或客户律师有误！')
        //   return
        // }
        // this.$route.query.copy = 'false'
        // if (!this.caseDetailFormData.patentType && !['咨询', '许可备案', '顾问服务', '政府项目', '其他'].includes(this.caseType)) {
        //   this.$message.error('请选择专利类型!')
        //   return
        // }
        // if (!this.caseDetailFormData.appFromto) {
        //   this.$message.error('请选择申请方向!')
        //   return
        // }
        // if (!this.caseDetailFormData.caseCnName) {
        //   this.$message.error('请填写案件中文名称!')
        //   return
        // }
        // if (this.caseDetailFormData.feeReduce > 1 || this.caseDetailFormData.feeReduce < 0) {
        //   this.$message.error('费减比例数据错误!')
        //   return
        // }
        // if (this.caseDetailFormData.patentCaseApplicationList && this.caseDetailFormData.patentCaseApplicationList.length) {
        //   if (this.caseDetailFormData.patentCaseApplicationList.some(i => !i.no && i.no !== 0)) {
        //     this.$message.error('申请人的序号不能为空')
        //     return
        //   }
        //   let firstlist = [this.caseDetailFormData.patentCaseApplicationList[0]]
        //   if (firstlist.length && !+this.caseDetailFormData.feeReduce && (firstlist[0].fyjhbeian || firstlist[0].beianYear)) {
        //     if (await this.checkJianjiao()) {
        //       return
        //     }
        //   } else if (firstlist.length && +this.caseDetailFormData.feeReduce && (!firstlist[0].fyjhbeian || firstlist[0].beianYear != new Date().getFullYear())) {
        //     if (await this.checkJianjiao()) {
        //       return
        //     }
        //   }
        // }
        // if (this.caseDetailFormData.patentInventorList && this.caseDetailFormData.patentInventorList.length) {
        //   if (this.caseDetailFormData.patentInventorList.some(i => !i.no && i.no !== 0)) {
        //     this.$message.error('发明人的序号不能为空')
        //     return
        //   }
        // }
        this.caseDetailFormData.caseDate = this.backData.caseDate || null
        let compareData = this.$commonUtils.compareObjAttrs(this.backData, this.caseDetailFormData)
        this.$commonUtils.handleObjNullAttr(compareData, this.backData)
        let item = {
          ...compareData,
          checkCase,
          checkChongTu,
          taskType: 4,
          userId: this.$store.getters.userId,
          caseIds: this.caseIds,
          taskId: this.caseDetailFormData.taskId
        }
        delete item.checkChongTu
        saveCaseInfoUrl(item)
          .then(async response => {
            if (response.messageType == -6) {
              this.$confirm(
                response.message + ' 当前案件是否继续保存',
                '提示',
                {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }
              ).then(() => {
                this.submitCaseForm(forwordType, 0, 1)
              })
              return
            }
            if (response.messageType == '10') {
              this.checkChongTuSet(response.data, 'sive', forwordType)
              return
            }
            if (forwordType && forwordType === 'prefiling') {
              if (this.caseDetailFormData.patentCaseApplicationList && this.caseDetailFormData.patentCaseApplicationList.length) {
                const res = await queryCaseAppExamine({appIds: this.caseDetailFormData.patentCaseApplicationList.map(i => i.appId), caseIds: [this.caseDetailFormData.caseId]})
                if (res.messageType == 300) {
                  this.$message.warning('该主体为新申请人，请在申请人界面提交审核，由客户管理组审查后再立案')
                  return;
                }
              }
              getCaseTime({ caseIds: this.caseIds }).then(res => {
                if (res.messageType == 12) {
                  this.$confirm(res.message,
                    '提示',
                    {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                      type: 'warning'
                    }
                  ).then(() => {
                    this.$router.push({
                      path: '/workbench/case/preFilingPush/1',
                      query: { taskId: this.caseDetailFormData.taskId, taskType: 4 }
                    })
                  })
                  return
                }
                // if (res.messageType == 13) {
                //   this.caseData = response.data.data
                //   this.caseData[0].timelimit = this.caseData[0].timelimitList[0]
                //   // localStorage.setItem('testTimelimit',JSON.stringify(this.caseData))
                //   this.prefiling = true
                //   this.poppingTimeLimitState = true
                //   return;
                // }
                if (res.messageType == 13) {
                  this.caseData = res.data
                  this.caseData[0].timelimit = this.caseData[0].timelimitList[0]
                  // localStorage.setItem('testTimelimit',JSON.stringify(this.caseData))
                  this.prefiling = true
                  this.poppingTimeLimitState = true

                  return
                }
                // alert(1)
                this.$router.push({
                  path: '/workbench/case/preFilingPush/1',
                  query: { taskId: this.caseDetailFormData.taskId, taskType: 4 }
                })
              })
            } else {
              this.$message.success('保存成功')
              this.goNext()//test
            }
          })
          .catch(err => {
          })
      },
      goNext() {
        this.$store.commit('caseInformation/SET_PREONLYID', this.caseDetailFormData.caseId)
        this.$route.query.copy = 'false'
        if (this.$route.query.flag === 'noCheck') {
          this.$router.go(-1)
        } else {
         this.$router.replace('/workbench/case/patentList')
        }
      }
    }

  }
</script>

<style lang="scss" scoped>
  .createPost-container {
    position: relative;
    padding: 10px 2px;
    border: 1px solid #d7d7d7;
    margin: 15px 20px;
    min-height: 800px;

    > > > .el-tabs {
      .el-tab-pane {
        .form-container {

        }

      }
    }
  }

  .tilteSpan {
    font-size: 18px;
    padding: 15px 0px;
    color: #7199d5;
  }

  > > > .el-dialog__body {
    padding-top: 0;
  }
</style>
