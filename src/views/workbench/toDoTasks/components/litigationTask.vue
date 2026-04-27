<template>
  <div>
    <el-form label-width="136px">
      <el-row>
        <el-form-item label="案件文号:">
          <el-input v-model="query.beginNum " placeholder="请输入内容" @change="changeTextRange" clearable></el-input>
          <span>至</span>
          <el-input v-model="query.endNum" placeholder="请输入内容" clearable></el-input>
        </el-form-item>
        <div class="buttonWrap">
          <!--<el-button type="primary" size="mini" @click="detachMent">重置</el-button>-->
          <el-button type="primary" size="mini" @click="handleSearch">搜索</el-button>
          <!--<div class="el-button el-button&#45;&#45;primary el-button&#45;&#45;mini" type="primary"  @click="changeSonMenuState">-->
          <!--<span>批量</span>-->
          <!--<div class="sonMenu" v-if="sonMenuState">-->
          <!--<div  @click.stop="querySubmission" v-if="$store.getters.permissions.includes(111)">递交</div>-->
          <!--<div  @click.stop="queryInstruction"></div>-->
          <!--<div  >上传报官清单回执</div>-->
          <!--<div  >官方通知审核</div>-->
          <!--</div>-->
          <!--</div>-->
          <el-dropdown trigger="click"  @command="changeSonMenuState" placement="bottom-start">
            <span class="el-dropdown-link">
              批量
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="a" v-allow="111">递交</el-dropdown-item>
<!--              <el-dropdown-item command="b" v-allow="114">递交官方审核</el-dropdown-item>-->
              <el-dropdown-item command="c" v-allow="112">上传官文</el-dropdown-item>
<!--              <el-dropdown-item command="d" v-allow="115">官方通知审核</el-dropdown-item>-->
              <el-dropdown-item command="f">低信用审核</el-dropdown-item>
              <el-dropdown-item command="e">转交</el-dropdown-item>
              <el-dropdown-item command="同意">同意</el-dropdown-item>
              <el-dropdown-item command="完成" v-allow="284">完成</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-row>
    </el-form>
    <p v-if="selectionState" style="margin-bottom: 10px">{{currentTypeText}}</p>
    <div style="display: flex;position: relative">
      <TitleTotal :total="total" />
      <div class="button_wrap" v-if="selectionState">
        <el-button size="mini" class="exactButton" type="primary" @click="jumpDetailSubmisson">{{multipleTypeText}}</el-button>
        <el-button size="mini" class="exactButton"  @click="cancel">取消</el-button>
      </div>
    </div>
    <el-table
      ref="todoTaskMultiple"
      :data="taskList"
      fit
      empty-text="暂无数据"
      :height="clientHeight"
      current-row-key
      style="width: 100%;"
      @select="handleSelectionChange"
      @select-all="handleSelectionAll"
      :row-class-name="getRowClassName"
    >
      <el-table-column
        type="selection"
        width="50"
        class="selection"
        v-if="selectionState"
      >
      </el-table-column>
      <el-table-column type="index" width="50" label="序号" align="left">
        <template slot-scope="scope">
          <span>{{scope.$index+1}}</span>
        </template>
      </el-table-column>
      <el-table-column v-for="(item,index) in tableDataList" :key="index" :label="item.title" align="left" :prop="item.value" :width="item.width?item.width:'auto'"
                       :filters="unique(taskList.map(i=>({text:i[item.value],value:i[item.value]})),'value').filter(ii=>ii.value)"
                       :filter-method="filterHandler"
                       sortable
                       :min-width="getMinWidth(item)"
                       filter-placement="bottom-start">
        <template slot-scope="scope">
          <div :class="item.value=='agentNum'&&scope.row.pageId!==101?'itemTitle_style':''" :style="{cursor: scope.row.pageId!==101? 'pointer':''}" @click="takeCaseDetail(scope.row)">
            <span v-if="item.value==='index'">{{ scope.$index+1 }}</span>
            <span v-if="item.value!=='isLoadPriorityFile'&&item.value!=='materials'&&item.value!=='index'&&item.value!=='materialArray'&&item.value!=='proceeName'" >{{ scope.row[item.value] }}</span>
            <span v-if="item.value==='isLoadPriorityFile'">{{ supplementList.includes(scope.row.caseType)?formartValue(scope.row['supplementDoc']):formartValue(scope.row[item.value])}}</span>
            <span v-if="item.value==='materials'&&item.title==='文件类型'">{{ Object.prototype.toString.call(scope.row[item.value]).includes('Array')?scope.row[item.value].length?scope.row[item.value][0].typeName:'':'' }}</span>
            <span v-if="item.value==='materials'&&item.title==='文件名称'">{{ Object.prototype.toString.call(scope.row[item.value]).includes('Array')?scope.row[item.value].length?scope.row[item.value][0].docName:'':'' }}</span>
            <div v-if="item.value==='materials'&&item.title==='上传文件'">
              <a v-for="(itm,idx) in scope.row[item.value]" :key="idx" :href="'ipdoc'+itm.address" target="_blank" style="display: block;color: #409EFF;" >{{ itm.materialName }}</a>
            </div>
            <el-tooltip v-if="item.value==='proceeName'&&scope.row[item.value]==='网申递交失败'" class="item" effect="dark" :content="scope.row['failReason']" placement="top">
              <span>{{ scope.row[item.value] }}</span>
            </el-tooltip>
            <span v-if="item.value==='proceeName'&&scope.row[item.value]!=='网申递交失败'">{{ scope.row[item.value] }}</span>
            <div v-if="item.value==='materialArray'&&item.title==='上传文件'">
              <a style="display: block;color: #409EFF;" :href="'ipdoc'+scope.row.address">{{ scope.row.name }}</a>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="left" fixed="right"  class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="jumpMassfiling(scope.row)"
            v-if="
            (scope.row.pageId==130)
            ||
            (scope.row.pageId==131)
            ||
            (scope.row.pageId==100)
            ||
            (scope.row.pageId==101)
            ||
            (scope.row.pageId==102&&$store.getters.permissions.includes(113))
            ||
            (scope.row.pageId==103&&$store.getters.permissions.includes(111))
            ||
            (scope.row.pageId==104&&$store.getters.permissions.includes(114))
            ||
            (scope.row.pageId==105&&$store.getters.permissions.includes(112))
            ||
            (scope.row.pageId==106&&$store.getters.permissions.includes(115))
            ||
            (scope.row.pageId==107)
            ||
            (scope.row.pageId==108)
            ||
            (scope.row.pageId==109)
            ||
            (scope.row.pageId==120)
            ||
            scope.row.pageId==150
            ||
            scope.row.pageId==151
            ||
            scope.row.pageId==152
            ||
            scope.row.pageId==153
            ||
            scope.row.pageId==154
            ||
            scope.row.pageId==501
            "
          >处理</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.pageNo"
      :limit.sync="listQuery.pageSize"
      @pagination="queryAlltask"
      :pageSizes="pageSizesList"
    />

    <detail-official-communication v-if="dialogVisible" :taskType="taskType" @closeThisPage="closeThisPage" :dialogVisible="dialogVisible" :queryInfo="queryInfo"></detail-official-communication>
    <el-dialog
      title="低信用审核"
      :visible.sync="lowCreditdialogVisible"
      width="50%"
    >
      <div class="tips">
        <img src="@/assets/tips.png" alt="">
        <span>客户信用较差，通过审核将对未来产生的坏账负责，请慎重操作！</span>
      </div>
      <el-form  class="lowCreditFrom" label-width="206px"  v-if="lowCreditCaseList.length&&lowCreditCaseList.length===1">
        <el-form-item label="客户:" >
          {{lowCreditCaseList[0].custName}}
        </el-form-item>
        <el-form-item label="案件类型:"  >
          {{lowCreditCaseList[0].caseType}}
        </el-form-item>
        <el-form-item label="案件个数:"  >
          {{lowCreditCaseList[0].caseNumber}}
        </el-form-item>
        <el-form-item label="商标名称:" >
          {{lowCreditCaseList[0].tmName}}
        </el-form-item>
        <el-form-item label="备注:" >
          {{lowCreditCaseList[0].memo}}
        </el-form-item>
      </el-form>
      <el-table :data="lowCreditCaseList"  v-if="lowCreditCaseList.length>1" border>
        <el-table-column :label="item.title" align="left" v-for="item,index in lowCreditCaseListTitle" :key="index" >
          <template slot-scope="scope" >
            <span v-if="item.value!=='index'">{{scope.row[item.value]}}</span>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="lowCreditAudit(0)">退回</el-button>
        <el-button type="primary" @click="lowCreditAudit(1)">确 定</el-button>
       </span>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="bJView" width="70%">
      <UploadMetailDetail v-if="bJView" :taskInfo="taskInfo" pageType="edit" :eventRecordData="{eventRecordId}" :curCaseId="bJCaseId" :custId="bJCustId" @changeFalse="changeFalse"></UploadMetailDetail>
    </el-dialog>
    <litigationOfficial :taskType="taskType" v-if="officialCommunicationState" :officialCommunicationState="officialCommunicationState" officialCommunicationType="create" :multipleSelection="multipleSelectionCaseArray" @closeThisPage="closeSelect"></litigationOfficial>
    <litigationSubmission :taskType="taskType" v-if="submissionState" :submissionState="submissionState" submissionType="create" :multipleSelection="multipleSelectionCaseArray" :curCaseId="multipleSelectionCaseArray.map(item=>item.caseId)" @changeFalse="closeSelect"></litigationSubmission>
    <HandOver :transfromState="transfromState" :transfromType="transfromType" :multipleSelection="multipleSelection" @closeHandover="closeHandover"></HandOver>
    
    <el-dialog
      title="代理师同意签署委托书"
      :visible.sync="agentSignDialogVisible"
      width="70%"
      :close-on-click-modal="false"
    >
      <div class="agent-sign-container">
        <div class="case-info-table">
          <el-table :data="agentSignCaseInfo ? [agentSignCaseInfo] : multipleSelection" border style="width: 100%" max-height="400">
            <el-table-column prop="agentNum" label="案件文号" align="center" width="200"></el-table-column>
            <el-table-column prop="caseType" label="案件类型" align="center" width="150"></el-table-column>
            <el-table-column prop="caseName" label="案件名称" align="center" min-width="150"></el-table-column>
            <el-table-column prop="custName" label="客户" align="center" width="180"></el-table-column>
            <el-table-column prop="appCnName" label="申请人" align="center" min-width="200"></el-table-column>
          </el-table>
        </div>
        
        <div class="sign-title">
          代理师同意签署委托书
        </div>
        
        <div class="sign-info">
          <el-form label-width="100px">
            <el-form-item label="代理人:">
              <span class="info-text">{{ $store.getters.name }}</span>
            </el-form-item>
            <el-form-item label="签署日期:">
              <span class="info-text">{{ getCurrentDate() }}</span>
            </el-form-item>
          </el-form>
        </div>
      </div>
      
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeAgentSignDialog">取 消</el-button>
        <el-button type="primary" @click="handleAgentSign">同 意</el-button>
      </span>
    </el-dialog>

    <!-- 专利撰写 -->
     <el-dialog
      :title="patentWritingTitle"
      append-to-body
      :visible.sync="patentWritingView"
      width="80%"
      :modal="false"
      top="100px"
      class="dragDialog writingDialog"
      :close-on-click-modal="false"
      v-dialogDrag
      :before-close="closePatentWriting"
    >
      <PatentDrafting v-if="patentWritingView" :dialogType="dialogType" :dialogId="dialogId" :taskType="4" :caseId="patentCaseIds" @changeFalse="closePatentWriting"/>
    </el-dialog>
  </div>
</template>

<script>
  import UploadMetailDetail from '@/views/workbench/case/components/UploadMetailDetail'
  import HandOver  from "./HandOver";
  import litigationSubmission from '@/views/workbench/case/officialSubmission/components/litigationSubmission.vue'
  import Pagination from '@/components/Pagination'; // secondary package based on el-pagination
  import DetailOfficialCommunication from '@/views/workbench/case/officialCommunication/detailOfficialCommunication';
  import PatentDrafting from '@/views/workbench/case/components/PatentDrafting.vue';
  import { queryAlltask, queryInstruction, submitOfficalAudit, auditOfficalDoc, queryDocs ,lowCreditAudit,taskFinishTask, agentReview} from '@/api/caseList.js'
  import { queryPatentWritingDetail } from "@/api/patentWriting";
  export default {
    props:{
      taskType:{
        default:2
      }
    },
    components: { Pagination, DetailOfficialCommunication,litigationSubmission,HandOver,UploadMetailDetail, PatentDrafting },
    name: 'litigationTask',
    activated() {
      this.queryAlltask()
    },
    data() {
      return {
        patentWritingTask: {},
        patentCaseIds: [],
        dialogId: '',
        dialogType: '',
        patentWritingTitle: '',
        patentWritingView: false,
        taskInfo:{
          taskId: '',
          type: ''
        },
        bJView: false,
        bJCaseId: '',
        bJCustId: '',
        eventRecordId: '',
        selectionState: false, // 筛选递交复选框
        total: 0,
        loading: false,
        listLoading: false,
        taskList: [],
        pageNo: 0,
        pageSize: 10,
        query: { // 查询条件
          beginNum: undefined,
          endNum: undefined
        },
        officialCommunicationState:false,
        submissionState:false,
        multipleSelectionCaseArray:[],
        listQuery: {
          pageNo: 0,
          pageSize:  JSON.parse(localStorage.getItem('pageSize'))?JSON.parse(localStorage.getItem('pageSize')).find(item=>item.name==this.$route.name)?JSON.parse(localStorage.getItem('pageSize')).find(item=>item.name==this.$route.name).pageSize:10:10
        },

        pageSizesList:[ 10, 50, 100,200,300,400 ,500],
        defaultParams: { // 級聯菜單默認
          value: 'caseTypeId',
          label: 'caseType',
          children: 'childrens',
          checkStrictly: false
        },
        lowCreditdialogVisible:false,
        //  queryCustomerNameIdList:[],
        multipleSelection: [],// 当前选中的待处理案件
        multipleTypeText: '确认',
        tableDefaultList:[{'title':'案件文号','value':'agentNum','width': 200 },{'title':'案件类型','value':'caseType'},{'title':'案件名称','value':'caseName'},{'title':'客户','value':'custName'},{'title':'申请人','value':'appCnName'}, {'title':'发起人','value':'fullname','width': 110 }, {'title':'案件阶段','value':'stageName','width': 120 },{'title':'案件最新进展','value':'proceeName' },{'title':'案件个数','value':'caseNumber',width:120 },{'title':'案件状态','value':'statusName' }],
        tableSubmissonList:[{'title':'案件文号','value':'agentNum','width': 200 },{'title':'案件类型','value':'caseType'},{'title':'递交方式','value':'submitMode' },{'title':'上报事项','value':'reportMatter'},{'title':'是否缺材料','value':'isLoadPriorityFile' },{'title':'递交场所','value':'submitPlace'},
          {'title':'递交日期','value':'submitDate' },{'title':'文件类型','value':'materials'},{'title':'文件名称','value':'materials' },{'title':'上传文件','value':'materials'},{'title':'下达人','value':'submitUser'}],
        tableOfficialList:[{'title':'案件文号','value':'agentNum','width': 200},{'title':'案件类型','value':'caseType'},{'title':'客户','value':'custName'},{'title':'申请人','value':'appCnName'},{'title':'官文类型','value':'typeName'},{'title':'文件名称','value':'docName'},
          { 'title': '发文日期', 'value': 'docDate' }, { 'title':'收文日期','value':'recvDate'},{'title':'邮寄方式','value': 'mailingTypeName'}, {'title': '上传文件', 'value': 'materialArray','width': 200 }, {'title': '提交人', 'value': 'creater','width': 110 } ],
        tableDataList: [ ],
        currentTypeText: '',
        dialogVisible: false,
        queryInfo: { caseIds: '' },
        lowCreditCaseList: [],
        lowCreditCaseListTitle: [{'title':'客户','value':'custName'},{'title':'客户信用等级','value':'level'},{'title':'案件类型','value':'caseType'},{'title':'案件个数','value':'caseNumber'},{'title':'商标名称','value':'tmName'},{'title':'备注','value':'memo'},],
        supplementList: [
          '变更注册申请代理机构',
          '异议',
          '注册驳回复审',
          '国际注册驳回复审',
          '撤销商标复审',
          '不予注册复审',
          '异议答辩',
          '撤三答辩（提供使用证明）',
          '撤销通用名称答辩',
          '参与不予注册复审',
          '无效宣告答辩',
          '撤销复审答辩',
          '撤销三年停止使用申请',
          '撤销成为通用名称注册商标',
          '无效宣告申请'],
        transfromType:'',
        transfromState:false,
        agentSignDialogVisible: false,
        agentSignCaseInfo: null,
      }
    },
    created() {


      //this.queryAlltask()
    },
    methods: {
      async doWriteTask(type) {
        this.patentCaseIds = [this.patentWritingTask.caseId]
        this.dialogId = this.patentWritingTask.pwId
        const detail = await queryPatentWritingDetail({ id: this.dialogId })
        if (!detail.data.taskUserId || detail.data.taskUserId !== this.$store.getters.userId) {
          this.$message.error('您不是当前任务的任务人!')
          return
        }
        switch (type) {
          case 1:
            this.dialogType = 'submit'
            this.patentWritingTitle = '提交'
            this.patentWritingView = true
            break
          case 2:
            this.dialogType = 'audit'
            this.patentWritingTitle = '审核'
            this.patentWritingView = true
            break
          case 3:
            this.dialogType = 'audit'
            this.patentWritingTitle = '审核'
            this.patentWritingView = true
            break
          default:
            this.$message.error('无需处理！')
            break
        }
      },
      closePatentWriting(flag) {
        this.patentWritingView = false
        flag === true && this.handleSearch()
      },
      changeFalse(flag) {
        this.bJView = false
        this.bJCaseId = ''
        this.bJCustId = ''
        this.eventRecordId = ''
        this.taskInfo = {
          taskId: '',
          type: ''
        }
      },
      detachMent() {
        this.query = {}
        this.listQuery.pageNo = 1
        this.queryAlltask()
      },
      takeCaseDetail(row){
        if(row.pageId!==101){
          this.$commonUtils.takeCaseDetail(row,this)
        }
      },
      handleSearch() {
        this.selectionState = false
        this.multipleSelection = []
        this.listQuery.pageNo = 1
        delete this.query.pageId
        this.queryAlltask()
      },
      closeSelect() {
        this.officialCommunicationState=false
        this.submissionState = false
        this.handleSearch()
      },
      closeHandover(e){
        this.transfromState=false
        if(e){
          this.handleSearch()
        }
      },
      closeAgentSignDialog() {
        this.agentSignDialogVisible = false
        this.agentSignCaseInfo = null
      },
      handleAgentSign() {
        let patentCaseAgreeList = []
        if (this.agentSignCaseInfo) {
          patentCaseAgreeList = [{
            caseId: this.agentSignCaseInfo.caseId,
            taskId: this.agentSignCaseInfo.taskId
          }]
        } else {
          patentCaseAgreeList = this.multipleSelection.map(item => ({
            caseId: item.caseId,
            taskId: item.taskId
          }))
        }
        
        const data = { patentCaseAgreeList }
        agentReview(data).then(res => {
          if (res.success) {
            this.$message.success(this.agentSignCaseInfo ? '同意签署成功' : '批量同意签署成功')
            this.agentSignDialogVisible = false
            this.agentSignCaseInfo = null
            this.multipleSelection = []
            this.selectionState = false
            this.handleSearch()
          }
        })
      },
      getCurrentDate() {
        const now = new Date()
        const year = now.getFullYear()
        const month = String(now.getMonth() + 1).padStart(2, '0')
        const day = String(now.getDate()).padStart(2, '0')
        const hours = String(now.getHours()).padStart(2, '0')
        const minutes = String(now.getMinutes()).padStart(2, '0')
        const seconds = String(now.getSeconds()).padStart(2, '0')
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
      },
      filterHandler(value, row, column) {
        const property = column['property'];
        return row[property] === value;
      },
      jumpMassfiling(row) {
        if (row.pageId== 501) {
          this.patentWritingTask = row
          this.doWriteTask(row.taskNo)
          return
        }
        if (row.pageId== 154) {
          this.agentSignCaseInfo = row
          this.agentSignDialogVisible = true
          return
        }
        if(row.pageId == 130){
          this.bJView = true
          this.bJCaseId = row.caseId
          this.bJCustId = row.custId
          this.eventRecordId = row.eventRecordId
          this.taskInfo = {
            taskId: row.taskId,
            type: 'edit',
            taskType:row.taskType
          }

        }
        if(row.pageId == 131){
          this.bJView = true
          this.bJCaseId = row.caseId
          this.bJCustId = row.custId
          this.eventRecordId = row.eventRecordId
          this.taskInfo = {
            taskId: row.taskId,
            type: 'audit',
            taskType:row.taskType
          }
        }
        if (row.pageId == 100 || row.pageId == 150 || row.pageId == 151) {
          this.$router.push({ path: '/workbench/case/case_detail/' + row.caseId+'/'+row.caseType, query: {taskType:this.$commonUtils.getTaskType(row,this), pageId: row.pageId,createStatus:row.createStatus }})
        }
        if (row.pageId == 120) {
          this.$router.push({ path: '/workbench/case/case_detail/' + row.caseId+'/'+row.caseType, query: {taskType:this.$commonUtils.getTaskType(row,this),createStatus:row.createStatus }})
        }
        if (row.pageId == 101 || row.pageId == 152 || row.pageId == 153) {
          this.$router.push({ path: '/workbench/case/massfiling', query: { taskType: row.taskType, taskId: row.taskId, deliverId: row.deliverId ,isChangeCase:row.isChangeCase,createStatus:row.createStatus}})
        }
        if (row.pageId==102) {
          this.$router.push({ path: '/workbench/case/preFilingPush/2', query: { taskId: row.taskId,taskType:this.$commonUtils.getTaskType(row,this)}})
        }
        if (row.pageId==103&&row.proceeName=='网申递交失败') {
          this.multipleSelectionCaseArray=[row]
          this.taskType=this.$commonUtils.getTaskType(row,this)
          this.submissionState = true
         // this.$router.push({ path: '/workbench/case/detailSubmission', query: { caseIds: row.caseId, pageId: row.pageId, pageType:'4',insId:row.insId,taskIdList:row.taskId }})
        }
        if (row.pageId==103&&row.proceeName!=='网申递交失败') {
          this.multipleSelectionCaseArray=[row]
          this.taskType=this.$commonUtils.getTaskType(row,this)
          this.submissionState = true
        }
        if (row.pageId==104) {
          this.multipleSelectionCaseArray=[row]
          this.taskType=this.$commonUtils.getTaskType(row,this)
          this.submissionState = true
          //this.$router.push({ path: '/workbench/case/detailSubmission', query: { caseIds: row.caseId, pageId: row.pageId ,pageType:'2' ,insId:row.insId}})
        }
        if (row.pageId == 106) {
          this.queryInfo={
            caseIds: row.caseId,
            pageId: 106,
            pageType:'2',
            info:[row],
            insId: row.insId,
          }
          this.dialogVisible=true
        }
        if (row.pageId==107) {
          this.$router.push({ path: '/workbench/case/preFilingPush/3', query: { taskId: row.taskId,taskType:this.$commonUtils.getTaskType(row,this)}})
        }
        if(row.pageId==105){
          this.multipleSelectionCaseArray=[row]
          this.taskType=this.$commonUtils.getTaskType(row,this)
          this.officialCommunicationState = true
        }
        if(row.pageId==108){
          this.lowCreditCaseList=[row]
          this.lowCreditdialogVisible=true
        }
        if (row.pageId == 109) {
          this.$router.push({ path: '/workbench/case/divisionCase',query: {custId:row.custId, caseIds: row.caseId,taskType:this.$commonUtils.getTaskType(row,this),taskId:row.taskId}})
        }
      },
      cancel(){
        this.selectionState=false
        delete this.query.pageId
        this.queryAlltask()
      },
      jumpDetailSubmisson() {
        if (this.multipleSelection.length&&this.multipleTypeText==='确认') {
          this.multipleSelectionCaseArray = this.multipleSelection
          this.submissionState = true
          // this.$router.push({
          //   path: '/workbench/case/detailSubmission',
          //   query: {
          //     pageType: '1',
          //     caseIds: this.multipleSelection.filter(item => item.pageId==103).map(item => item.caseId),
          //     taskIdList: this.multipleSelection.filter(item => item.pageId==103).map(item => item.taskId)
          //   }
          // })
        }
        if (this.multipleSelection.length&&this.multipleTypeText==='上传') {
          this.multipleSelectionCaseArray = this.multipleSelection
          this.officialCommunicationState = true
          // this.queryInfo = {
          //   caseIds: this.multipleSelection.filter(item => item.pageId == 105).map(item => item.caseId),
          //   pageId: 105,
          //   pageType: '1',
          //   insId: this.multipleSelection.filter(item => item.pageId == 105).map(item => item.insId),
          //   info: this.multipleSelection.filter(item => item.pageId == 105),
          // }
          // this.dialogVisible = true
        }
        if(this.multipleSelection.length&&this.multipleTypeText==='审核'&&this.currentTypeText==='递交官方') {
          const data = {
            userId: this.$store.getters.userId,
            caseIds: this.multipleSelection.filter(item => item.pageId==104).map(item => item.caseId),
            taskIdList: this.multipleSelection.filter(item => item.pageId==104).map(item => item.taskId),
            insIdList:this.multipleSelection.filter(item => item.pageId==104).map(item => item.insId),
            result: 1
          }
          submitOfficalAudit(data).then(res=>{
            if (res.success) {
              this.multipleSelection = []
              this.queryInstruction()
            }
          })
        }
        if(this.multipleSelection.length&&this.multipleTypeText==='审核'&&this.currentTypeText==='官方通知') {
          const data = {
            userId: this.$store.getters.userId,
            caseIds: this.multipleSelection.filter(item => item.pageId==106).map(item => item.caseId),
            taskIdList: this.multipleSelection.filter(item => item.pageId==106).map(item => item.taskId),
            insIdList: this.multipleSelection.filter(item => item.pageId==106).map(item => item.insId),
            result: 1
          }
          auditOfficalDoc(data).then(res=>{
            if (res.success) {
              this.multipleSelection = []
              this.queryDocs()
            }
          })
        }
        if(this.multipleSelection.length && this.multipleTypeText === '审核' && this.currentTypeText === '低信用审核') {
          this.lowCreditCaseList = this.multipleSelection.filter(item=>item.pageId===108)
          this.lowCreditdialogVisible = true
        }
        if(this.multipleSelection.length&&this.multipleTypeText==='批量转交'){
          this.transfromState=true
          this.transfromType='批量转交'
        }
        if (this.multipleSelection.length&&this.multipleTypeText==='完成') {
          taskFinishTask({
            taskIdList:this.multipleSelection.map(item=>item.taskId),
            caseIds:this.multipleSelection.map(item=>item.caseId)
          }).then(res=>{
            this.queryAlltask()
          })
        }
        if (this.multipleSelection.length&&this.multipleTypeText==='同意') {
          this.agentSignDialogVisible = true
        }
        this.selectionState = false;
      },
      lowCreditAudit(audit) {
        const data = {
          taskIdList: this.lowCreditCaseList.filter(item=>item.pageId===108).map(item=>item.taskId),
          userId: this.$store.getters.userId,
          result: audit
        }
        lowCreditAudit(data).then(res => {
          this.lowCreditdialogVisible = false
          this.handleSearch()
        })
      },
      queryAlltask() {
        const data = {
          userId: this.$store.state.user.userId,
          pageNo: this.listQuery.pageNo,
          pageSize: this.listQuery.pageSize,
          taskType:this.taskType
        }
        this.listLoading = true
        queryAlltask(Object.assign(data, this.query)).then(res => {
         // this.$store.dispatch('user/getTodoTaskNotice');
          this.total = res.total
          this.taskList = res.data || []
          this.listLoading = false;
          if (this.multipleSelection.length) {
            this.$nextTick(() => {
              this.multipleSelection.forEach(itm => {
                this.$refs.todoTaskMultiple.toggleRowSelection(this.taskList.find(item => item.taskId === itm.taskId), true)
              })
            })
          }
          if(this.currentTypeText === '递交官方'){
            if(this.taskList.length===0) return
            queryInstruction({ userId: this.$store.getters.userId ,insIdList:this.taskList.filter(item => item.pageId==104).map(item => item.insId)}).then(res=>{
              this.taskList.forEach(caseItem=>{
                res.data.forEach((item,index) => {
                  if(item.insId == caseItem.insId) {
                    for(var key in item){
                      this.$set(caseItem,key,item[key])
                    }
                  }
                })
              })
            })
          }
          if(this.currentTypeText==='官方通知'){
            if(!this.taskList.length) return
            queryDocs({ userId: this.$store.getters.userId ,insIdList:this.taskList.filter(item => item.pageId==106).map(item => item.insId)}).then(res=>{
              let arr=[]
              res.data.forEach(item=>{
                arr.push(...item.materialArray.map(itm=>Object.assign(itm,item)))
              })
              this.taskList.forEach(caseItem=>{
                arr.forEach((item,index) => {
                  if(item.insId == caseItem.insId&&item.caseId==caseItem.caseId) {
                    for(var key in item){
                      this.$set(caseItem, key, item[key])
                    }
                  }
                })
              })
              console.log(this.taskList)
            })
          }
        });
      },
      querySubmission() {
        this.selectionState = true//!this.selectionState
        this.currentTypeText=''
        this.multipleTypeText = '确认'
        if (this.selectionState) {
          this.query.pageId = 103
          this.listQuery.pageNo = 1
        } else {
          this.query.pageId = null
        }
        this.queryAlltask()
      },
      queryInstruction(){
        this.selectionState = true//!this.selectionState
        this.multipleTypeText='审核'
        this.currentTypeText='递交官方'
        if (this.selectionState) {
          this.query.pageId = 104
          this.listQuery.pageNo = 1
        } else {
          this.query.pageId = null
        }
        this.queryAlltask()
      },
      queryOffcialCommunication(){
        this.selectionState = true// !this.selectionState
        this.currentTypeText=''
        this.multipleTypeText='上传'
        if (this.selectionState) {
          this.query.pageId = 105
          this.listQuery.pageNo = 1
        } else {
          this.query.pageId = null
        }
        this.queryAlltask()
      },
      queryDocs(){
        this.selectionState = true//!this.selectionState
        this.multipleTypeText='审核'
        this.currentTypeText='官方通知'
        if (this.selectionState) {
          this.query.pageId = 106
          this.listQuery.pageNo = 1
        } else {
          this.query.pageId = null
        }
        this.queryAlltask()
      },
      queryLowCredit(){
        this.selectionState = true//!this.selectionState
        this.multipleTypeText='审核'
        this.currentTypeText='低信用审核'
        if (this.selectionState) {
          this.query.pageId = 108
          this.listQuery.pageNo = 1
        } else {
          this.query.pageId = null
        }
        this.queryAlltask()
      },
      changeTextRange(e) {
        this.$set(this.query, 'endNum', e)
      },
      changeSonMenuState(e) {
        this.multipleSelection = []
        if(e==='a'){
           this.querySubmission()
        }
        if(e==='b'){
          this.queryInstruction()
        }
        if(e==='c'){
           this.queryOffcialCommunication()
        }
        if(e==='d'){
          this.queryDocs()
        }
        if(e==='f'){
          this.queryLowCredit()
        }
        if(e==='e'){
          this.currentTypeText=''
          this.selectionState=true
          this.multipleTypeText='批量转交'
        }
        if(e==='完成'){
          this.selectionState = true//!this.selectionState
          this.multipleTypeText='完成'
          this.currentTypeText='完成'
        }
        if(e==='同意'){
          this.selectionState = true
          this.multipleTypeText='同意'
          this.currentTypeText='代理师同意签署委托书'
          this.query.pageId = 154
          this.listQuery.pageNo = 1
          this.queryAlltask()
        }
        // this.sonMenuState = !this.sonMenuState
      },
      getMinWidth(data, header, currentId){
        //  let arr=[...[String(data.label).replace(/[\u4E00-\u9FA5]/gi,'aa').length],...this.caseList.map(item => item[data.prop]).filter(item=>item).map(item=>String(item).replace(/[\u4E00-\u9FA5]/gi,'aa').length)]
        return String(data.title).replace(/[\u4E00-\u9FA5]/gi,'aa').length*12+30
      },
      handleSelectionAll(val) {
        val = val.filter(item => item !== undefined)
        this.multipleSelection = this.unique(this.multipleSelection.concat(val), 'taskId')
        if(this.multipleTypeText==='确认'){
          if ([...new Set(this.multipleSelection.map(item => item.custName))].length >= 2) {
            this.$message.error('您必须选择同一客户下的案件')
            this.multipleSelection.filter(item => item.custName !== this.multipleSelection[0].custName).forEach(row => {
              this.$refs.todoTaskMultiple.toggleRowSelection(row, false)
              this.multipleSelection = this.multipleSelection.filter(item => item.taskId !== row.taskId)
            })
          }
          if ([...new Set(this.multipleSelection.map(item => item.caseType))].length >= 2) {
            this.$message.error('您必须选择同一类型下的案件')
            this.multipleSelection.filter(item => item.caseType !== this.multipleSelection[0].caseType).forEach(row => {
              this.$refs.todoTaskMultiple.toggleRowSelection(row, false)
              this.multipleSelection = this.multipleSelection.filter(item => item.taskId !== row.taskId)
            })
          }
          if ([...new Set(this.multipleSelection.map(item => item.appCnName))].length >= 2) {
            this.$message.error('您必须选择同一申请人下的案件')
            this.multipleSelection.filter(item => item.appCnName !== this.multipleSelection[0].appCnName).forEach(row => {
              this.$refs.todoTaskMultiple.toggleRowSelection(row, false)
              this.multipleSelection = this.multipleSelection.filter(item => item.taskId !== row.taskId)
            })
          }
        }
        if (!val.length) {
          this.taskList.forEach(row => {
            this.multipleSelection = this.multipleSelection.filter(item => item.taskId !== row.taskId)
          })
        }
      },
      handleSelectionChange(val, row) {
        val = val.filter(item => item != undefined)
        this.multipleSelection = this.unique(this.multipleSelection.concat(val), 'taskId')
        if (!val.find(item => item.taskId === row.taskId)) {
          this.multipleSelection = this.multipleSelection.filter(item => item.taskId !== row.taskId)
        }
        if(this.multipleTypeText ==='确认'){
          if ([...new Set(this.multipleSelection.map(item => item.custName))].length >= 2) {
            this.$message.error('您必须选择同一客户下的案件');
            this.$refs.todoTaskMultiple.toggleRowSelection(row, false)
            this.multipleSelection = this.multipleSelection.filter(item => item.taskId !== row.taskId)
          }
          if ([...new Set(this.multipleSelection.map(item => item.caseType))].length >= 2) {
            this.$message.error('您必须选择统一类型下的案件');
            this.$refs.todoTaskMultiple.toggleRowSelection(row, false)
            this.multipleSelection = this.multipleSelection.filter(item => item.taskId !== row.taskId)
          }
          if ([...new Set(this.multipleSelection.map(item => item.appCnName))].length >= 2) {
            this.$message.error('您必须选择同一申请人下的案件')
            this.multipleSelection.filter(item => item.appCnName !== this.multipleSelection[0].appCnName).forEach(row => {
              this.$refs.todoTaskMultiple.toggleRowSelection(row, false)
              this.multipleSelection = this.multipleSelection.filter(item => item.taskId !== row.taskId)
            })
          }
        }
      },
      unique(data, key) {
        const hash = {};
        const data2 = data.reduce((preVal, curVal) => {
          hash[curVal[key]] ? '' : hash[curVal[key]] = true && preVal.push(curVal);
          return preVal
        }, [])
        return data2
      },
      formartValue(e){
        if(e){
          return '是'
        }
        else if(e==0||e===false){
          return '否'
        }
        return null
      },

      closeThisPage(data){
        this.dialogVisible=false
        if(data==='清单回执'){
          this.multipleSelection = []
          this.queryOffcialCommunication()
        }
        if(data === '清单回执审核'){
          this.multipleSelection = []
          this.queryDocs()
        }
      },
      getRowClassName({row, rowIndex}){
        if(this.selectionState){
          if(this.multipleSelection.map(item=>item['taskId']).includes(row['taskId'])){
            if(this.$refs.todoTaskMultiple){
              this.$refs.todoTaskMultiple.toggleRowSelection(row,true)
            }
            return 'selectRow'
          }
        }
      }
    },
    computed:{
      clientHeight(){
        return  document.documentElement.clientHeight-300
      },
    },
    watch:{
      selectionState(n){
        if(n===false){
          this.currentTypeText=''
        }
      },
      currentTypeText:{
        handler(n,o){
          this.$nextTick(()=>{
            if(this.currentTypeText==='递交官方'&&this.selectionState){
              this.tableDataList=this.tableSubmissonList
            }else if(this.currentTypeText==='官方通知'&&this.selectionState){
              this.tableDataList=this.tableOfficialList
            }else{
              this.tableDataList=this.tableDefaultList
            }
          })
        },
        immediate:true
      },
    }
  }
</script>

<style lang="scss" scoped>
  .el-row{
    display: flex;
    padding: 20px 5px;
    margin: 10px 2px;
    box-shadow:0px 2px 5px 0px rgba(163, 163, 163, 0.35);
    .el-form-item{
      margin-bottom: 0;
      /deep/ .el-form-item__content{
        display: flex;
        height:32px;
        input{
          height: 100%;
        }
      }
    }
  }
  .buttonWrap{
    display: flex;
    justify-content: space-between;
    padding-left: 10px;
    align-items: center;
    /*.el-button{*/
    /*position: relative;*/
    /*.sonMenu{*/
    /*position: absolute;*/
    /*border: 1px solid #7F8C8D;*/
    /*color: #7F8C8D;*/
    /*background: #fff;*/
    /*left: 0;*/
    /*top: 100%;*/
    /*min-width: 100%;*/
    /*line-height:24px;*/
    /*box-sizing: border-box;*/
    /*z-index: 10;*/
    /*div{*/
    /*height: inherit;*/
    /*text-align: left;*/
    /*padding: 0 10px;*/
    /*}*/
    /*}*/
    /*.sonMenu div:hover{*/
    /*background: rgba(242,242,242,1);*/
    /*}*/
    // }
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
  .el-table{
    /deep/ th{
      padding:5px 10px
    }
    /deep/ td {
      padding: 0 10px;
    }
    /deep/ .cell{
      text-overflow: clip;
    }
  }
  .el-table{
    width: auto;
    /deep/ tr:nth-of-type(1){
      th{
        background: rgba(242, 242, 242, 1);
      }
    }
  }
  .el-dropdown{
    margin-left: 10px;
    cursor: pointer;
    line-height: 1;
    position: relative;
    top: -1px;
    .el-dropdown-link{
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
  .lowCreditFrom{
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    .el-form-item{
      line-height: 30px;
      width: 100%;
      display: flex;
      border: 1px solid #EBEEF5;
      margin-bottom: 10px;
      /deep/ .el-form-item__label{
        background: #f5f7fa;
        line-height: 30px;
      }
      /deep/ .el-form-item__content{
        line-height: 30px;
        margin-left: 0 !important;
        padding-left: 10px;
        background: #fff;
        flex: 1;
      }
    }
  }
  .tips{
    padding: 8px 16px 8px 20px;
    box-sizing: border-box;
    width: 418px;
    background-color: rgba(253, 246, 236, 1);
    margin-bottom: 10px;
    img{
      vertical-align: middle;
      width: 15px;
      height: auto;
      margin-right: 12px;
    }
    span{
      font-weight: 400;
      font-style: normal;
      font-size: 12px;
      color: #E6A23C;
      text-align: left;
      line-height: 18px;

    }
  }
  /deep/ .selectRow{
    background: #C9C8D0;
  }
  .el-table /deep/  .cell{
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: start;
    -ms-flex-pack: start;
    justify-content: flex-start;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    position: relative;
    padding-left:0;
    white-space: nowrap
  }
  
  .agent-sign-container {
    .case-info-table {
      margin-bottom: 30px;
    }
    
    .sign-title {
      text-align: center;
      font-size: 24px;
      font-weight: bold;
      color: #E6463C;
      margin: 40px 0 30px;
      letter-spacing: 2px;
    }
    
    .sign-info {
      margin-top: 30px;
      padding: 20px 0;
      
      .el-form {
        max-width: 500px;
        margin: 0 auto;
        
        .el-form-item {
          margin-bottom: 20px;
          
          /deep/ .el-form-item__label {
            font-weight: 500;
            color: #333;
          }
          
          .info-text {
            font-size: 14px;
            color: #606266;
          }
        }
      }
    }
  }
  .writingDialog {
    > > > .el-dialog {
      max-height: 90vh !important;

      .el-dialog__body {
        padding-top: 0;
      }
    }
  }
</style>
