<template>
    <div>
      <el-dialog
            :visible.sync="editWorkTime"
            :title="sign"
            width="80%"
            :before-close="closeEdit"
            :close-on-click-modal="false"
            lock-scroll
         >
            <div>
              <el-form class="edit-form" label-width="130px" :model="editWorkTimeForm">
                <el-row  v-if="!rowDataForm.projectId">
                  <el-col :span="24" style="font-size: 16px;height: 40px;line-height: 40px;padding: 5px 10px">案件信息</el-col>
                </el-row>
                <el-row v-if="!rowDataForm.projectId">
                  <el-col :span="8">
                    <el-form-item style="height: 100%;" label="案件文号:">
                      <el-autocomplete
                        v-if="editLook"
                        class="inline-input"
                        @clear="clearAgent"
                        v-model="rowDataForm.agentNum"
                        style=""
                        multiple
                        filterable
                        clearable
                        :fetch-suggestions="queryCaseList"
                        @select="queryCaseInfo"
                        placeholder="请输入内容"
                        :popper-append-to-body="false"
                        :trigger-on-focus="true"
                      >
                        <template slot-scope="{ item }" style="">
                          <div class="tables" style="display: flex;">
                            <el-tooltip  :content="item.agentNum" placement="top" effect="light">
                              <div style="flex: 1;" class="overflow-hidden" :class="{'table-head': item.agentNum == '案件文号'}">{{item.agentNum}}</div>
                            </el-tooltip>
                            <el-tooltip  :content="item.caseName" placement="top" effect="light">
                              <div style="flex: 1;" class="overflow-hidden" :class="{'table-head': item.caseName == '案件名称'}">{{item.caseName}}</div>
                            </el-tooltip>
                            <el-tooltip  :content="item.custName || item.name" placement="top" effect="light">
                              <div style="flex: 1;" class="overflow-hidden" :class="{'table-head': item.custName == '客户'}">{{item.custName || item.name}}</div>
                            </el-tooltip>
<!--                            <div style="flex: 1;" class="overflow-hidden" :class="{'table-head': item.agentNum == '案件文号'}">{{item.agentNum}}</div>-->
<!--                            <div style="flex: 1;" class="overflow-hidden" :class="{'table-head': item.caseName == '案件名称'}">{{item.caseName}}</div>-->
<!--                            <div style="flex: 1;" class="overflow-hidden" :class="{'table-head': item.custName == '客户'}">{{item.custName||item.name}}</div>-->
                          </div>
            <!--              <div class="name">{{ item.caseId }}</div>-->
            <!--              <span class="addr">{{ item.address }}</span>-->
                        </template>
                      </el-autocomplete>
                      <span v-else>
                        {{rowDataForm.agentNum}}
                      </span>

                    </el-form-item>
                  </el-col>
                  <el-col :span="8" v-show="haveCaseId">
                    <el-form-item  label="案件名称:">
                      {{rowDataForm.caseName}}
                    </el-form-item>
                  </el-col>
                  <el-col :span="8" v-show="!haveCaseId">
                    <el-form-item label="工作类型:">
<!--                        <el-input v-if="!onlyLook&&!rowDataForm.agentNum" size="small" v-model="rowDataForm.workTypeName"></el-input>-->
                      <el-select v-if="!onlyLook&&editLook" filterable clearable  class="select-input" v-model="rowDataForm.workType" placeholder="请选择">
                        <el-option
                          v-for="item in workKinds"
                          :key="item.workType"
                          :label="item.workTypeName"
                          :value="item.workType">
                        </el-option>
                      </el-select>
                      <span v-else>{{rowDataForm.workTypeName}}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item v-show="haveCaseId" label="客户:">
                      {{rowDataForm.custName}}
                    </el-form-item>
                  </el-col>
                </el-row>
<!--                <el-row>-->
<!--                  <el-col :span="11">-->
<!--                    <el-form-item label="工作类型:">-->
<!--                        <el-input v-if="!onlyLook&&!rowDataForm.agentNum" size="small" v-model="rowDataForm.workTypeName"></el-input>-->
<!--                      <span v-else>{{rowDataForm.workTypeName}}</span>-->
<!--                    </el-form-item>-->
<!--                  </el-col>-->
<!--                  <el-col :span="13">-->
<!--                    <el-form-item label="客户:">-->
<!--                      {{rowDataForm.custName}}-->
<!--                    </el-form-item>-->
<!--                  </el-col>-->
<!--                </el-row>-->
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="员工:">
                      {{rowDataForm.whUserName}}
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="员工角色:">
                      {{rowDataForm.roleName}}
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item  label="所属工作组:">
                      <el-select v-if="editLook" allow-create filterable clearable  class="select-input" v-model="rowDataForm.wkgId" placeholder="请选择">
                        <el-option
                          v-for="item in groupList"
                          :key="item.wkgId"
                          :label="item.groupName"
                          :value="item.wkgId">
                        </el-option>
                      </el-select>
                      <span v-else>
                        {{rowDataForm.groupName}}
                      </span>
<!--                      {{rowDataForm.groupName}}-->
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24" style="font-size: 16px;height: 40px;line-height: 40px;padding: 5px 10px">记录工时</el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="工时日期:">
                      <el-date-picker
                        v-if="!onlyLook&&rowDataForm.wfStatus=='待审核' || editLook"
                        v-model="rowDataForm.hourDate"
                        type="date"
                        :placeholder="rowDataForm.hourDate"
                        value-format="yyyy-MM-dd"
                        style="width: 150px;"
                      >
                      </el-date-picker>
                      <span v-else>{{rowDataForm.hourDate}}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="开始时间:">
<!--                      <el-input style="width: 50%" v-if="!onlyLook&&rowDataForm.userId == $store.getters.userId" v-model="rowDataForm.beginDate"></el-input>-->
                      <TimerComponent v-if="!onlyLook&&rowDataForm.wfStatus=='待审核' || editLook" v-model="rowDataForm.beginDate"></TimerComponent>
                      <span v-else>{{rowDataForm.beginDate}}</span>

                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="结束时间:">
<!--                      <el-input style="width: 50%" v-if="!onlyLook&&rowDataForm.userId == $store.getters.userId" v-model="rowDataForm.endDate"></el-input>-->
                      <TimerComponent v-if="!onlyLook&&rowDataForm.wfStatus=='待审核' || editLook" v-model="rowDataForm.endDate"></TimerComponent>
                      <span v-else>{{rowDataForm.endDate}}</span>
<!--                      <el-date-picker-->
<!--                        v-if="(rowDataForm.wfStatus=='待提交'||rowDataForm.wfStatus=='待重新提交')&&!onlyLook"-->
<!--                        v-model="rowDataForm.endDate"-->
<!--                        type="date"-->
<!--                        placeholder="选择日期">-->
<!--                      </el-date-picker>-->
                    </el-form-item>
                  </el-col>
<!--                  <el-col :span="4"></el-col>-->
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="记录工时:">
<!--                      <el-input  v-if="!onlyLook" size="small" v-model="rowDataForm.time"></el-input>-->
                      <TimerComponent @changeTime="changeTime(arguments, rowDataForm)" :sign="true" :class="{'red-color': rowDataForm.time&&+rowDataForm.time.substring(0,2)>3}" v-if="editLook||!onlyLook&&rowDataForm.wfStatus=='待审核'" v-model="rowDataForm.time"></TimerComponent>
                      <span v-else :class="{'red-color': rowDataForm.time&&+rowDataForm.time.substring(0,2)>3}">{{rowDataForm.time}}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="标准费率:">
                      {{rowDataForm.criterionRate}}
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="金额:">
                      {{rowDataForm.amount | formatAmount}}
<!--                      {{ChangeStrToMinutes(rowDataForm.time)*rowDataForm.criterionRate/60 | formatAmount}}-->
<!--                      {{rowDataForm.totalHour}}{{criterionRate}}-->
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24" class="tall-height">
                    <el-form-item label="工作内容:">
                      <div v-if="editLook||!onlyLook&&rowDataForm.wfStatus=='待审核'">
                        <el-popover class="inputshow"  placement="bottom" trigger="click" v-model="contentShow">
                          <el-table size="mini" @row-click="
                              val => {
                                fwtableClick(val);
                              }
                            " :data="gridData" style="height:250px;overflow: scroll;">
                            <el-table-column width="500" property="nameCn" label="工作内容"></el-table-column>
<!--                            <el-table-column width="300" property="nameEn" label="工作内容(英文)"></el-table-column>-->
                          </el-table>
                          <el-input slot="reference" v-debounce:searchContent="'input',1000" type="textarea" :autosize="{ minRows: 1, maxRows: 4}" size="small" v-model="rowDataForm.workContent"></el-input>
                        </el-popover>
                      </div>
<!--                      <el-input type="textarea" :autosize="{ minRows: 1, maxRows: 4}" v-if="editLook||!onlyLook&&rowDataForm.wfStatus=='待审核'" size="small" v-model="rowDataForm.workContent"></el-input>-->
                      <span v-else>{{rowDataForm.workContent}}</span>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row v-if="!((editLook||onlyLook)&&rowDataForm.wfStatus=='待审核')">
                  <el-col :span="24" style="font-size: 16px;height: 40px;line-height: 40px; padding: 5px 10px">核定工时</el-col>
                </el-row>
                <el-row v-if="!((editLook||onlyLook)&&rowDataForm.wfStatus=='待审核')">
                  <el-col :span="8">
                    <el-form-item label="核定工时:">
                      <TimerComponent :sign="true" @changeTime="changeAppCount(arguments, rowDataForm)" v-if="rowDataForm.auditFlag || editLook" v-model="rowDataForm.approvedTime"></TimerComponent>
<!--                      <el-input @input="(v)=>{changeAppCount(v, rowDataForm)}" v-if="(rowDataForm.wfStatus=='待审核'||rowDataForm.wfStatus=='我的工时'||rowDataForm.wfStatus=='本组未核销'||rowDataForm.wfStatus=='未核销')&&!onlyLook" size="small" v-model="rowDataForm.approvedTime"></el-input>-->
                      <span v-else :class="{'red-color': rowDataForm.approvedTime&&+rowDataForm.approvedTime.substring(0,2)>3}">{{rowDataForm.approvedTime}}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="核定费率:">
                      <el-input v-if="rowDataForm.auditFlag || editLook" size="small" v-model="rowDataForm.billRate" @input="(v)=>{changeMoney(v,rowDataForm)}"></el-input>
                      <span v-else>{{rowDataForm.billRate}}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="核定金额:">
<!--                      {{rowDataForm.time}}-->
                      <span>{{rowDataForm.approvedAmountCust | formatAmount}}</span>
<!--                      <span v-else>{{ChangeStrToMinutes(rowDataForm.approvedTime)*rowDataForm.criterionRate/60}}</span>-->
<!--                      <span v-else>{{ChangeStrToMinutes(rowDataForm.approvedTime)*rowDataForm.criterionRate/60 | formatAmount}}</span>-->

                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row v-if="!((editLook||onlyLook)&&rowDataForm.wfStatus=='待审核')">
                  <el-col :span="24" class="tall-height">
                    <el-form-item label="核定描述:">
                      <el-input type="textarea" :rows="4"  v-if="rowDataForm.auditFlag || editLook" size="small" v-model="rowDataForm.approvedDesc"></el-input>
                      <span v-else>{{rowDataForm.approvedDesc}}</span>
                    </el-form-item>
                  </el-col>
                </el-row>

              </el-form>
            </div>

            <span v-if="editLook" slot="footer" class="dialog-footer">
<!--              <el-button @click="editWorkTime = false">取 消</el-button>-->
              <el-button @click="closeEdit()" size="mini">取 消</el-button>
              <el-button type="primary" size="mini" @click.native="modifyWorkTime(rowDataForm)">确 定</el-button>
            </span>
           <span v-else-if="copyView" slot="footer" class="dialog-footer">
<!--              <el-button @click="editWorkTime = false">取 消</el-button>-->
              <el-button @click="closeEdit()" size="mini">取 消</el-button>
<!--              <el-button type="primary" @click="editWorkTime = false">提交</el-button>-->
              <el-button type="primary" @click="copyTime(rowDataForm)" size="mini">复制</el-button>
            </span>
           <span v-else-if="auditWorkHoursView" slot="footer" class="dialog-footer">
<!--              <el-button @click="editWorkTime = false">取 消</el-button>-->
             <el-button @click="closeEdit()" size="mini">取 消</el-button>
              <el-button type="primary" @click="auditWorkTime(rowDataForm, 1)" size="mini">通过</el-button>
              <el-button type="primary" @click="auditWorkTime(rowDataForm, 2)" size="mini">不通过</el-button>
            </span>
            <span v-else slot="footer" class="dialog-footer">
<!--              <el-button @click="editWorkTime = false">取 消</el-button>-->
              <el-button @click="closeEdit()" size="mini">关 闭</el-button>
            </span>
          </el-dialog>
    </div>
</template>

<script>
  import {
    queryChargeItemBynameCnUrl,
  } from "@/api/billApi";
  import {
    submitWorkHours,
    auditWorkHours,
    modifyTaskHours,
    queryCustomerNameId,
    selectColumn,
    queryPreference,
    savePreference,
    configFilter ,
    queryFilterConfig,
    queryFilter,
    addFilterScheme,
    delPreference,
    queryApplicantByIdList,
    checkPermission,
    queryWorkHours,
    queryRecentCase,
    getCaseHistory,
    addTaskHours,
    queryWorkType
  } from "@/api/caseList.js";
  import {queryCaseWorkgroupUrl} from '@/api/caseDetail';
  export default {
    name: "TimeDialog",
    props: {
      sign: '',
      whStatus: '',
      view: false,
      dataTime: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    data() {
      var tableHeader=[]
      if(localStorage.getItem('tableHeader')&&JSON.parse(localStorage.getItem('tableHeader')).find(item=>item.name==this.$options.name+this.$route.name)){
        tableHeader = JSON.parse(localStorage.getItem('tableHeader')).find(item => item.name == this.$options.name+this.$route.name).tableHeader
      }
      return {
        contentShow: false,
        gridData: [],
        groupList:[],
        workKinds: [],
        month: '',
        monthList:[{value: '1',label: '一月'},{value: '2',label: '二月'},{value: '3',label: '三月'},{value: '4',label: '四月'},
          {value: '5',label: '五月'},{value: '6',label: '六月'},{value: '7',label: '七月'},{value: '8',label: '八月'},
          {value: '9',label: '九月'},{value: '10',label: '十月'},{value: '11',label: '十一月'},{value: '12',label: '十二月'}
        ],
        flag: '',
        editWorkTimeForm: {},
        rowDataForm: {
          agentNum:'',
          caseName: '',
          workTypeName: '',
          custName: '',
          whUserName: '',
          roleName: '',
          groupName: '',
          beginDate: '',
          endDate: '',
          time: '',
          criterionRate: '',
          totalHour: '',
          workContent: '',
          approvedTime: '',
          approvedDesc: '',
          custId: ''
          // criterionRate: '',
          // criterionRate: '',
          // criterionRate: '',

        },
        editWorkTime: false,
        input: '',
        // identification:'work_time_indexworkTime',
        myTabsActivity: false,
        pageTitle: this.$route.meta.title,
        drawerState:false,
        selectionState: false, // 筛选递交复选框
        total: 0,
        isSubmit: false,
        loading: false,
        listLoading: false,
        isAudit: false,
        feeList: [],
        feetList:[],
        queryModuleData: { // 查询条件
        },
        tableHeader,
        selectionOptionState:false,
        multipleTypeText:'确定',
        defaultParams:{
          value: 'feetId',
          label: 'feeName',
          checkStrictly: true,
          children: 'feeTypes'
        },
        listQuery: {
          pageNo: 1,
          pageSize: JSON.parse(localStorage.getItem('pageSize'))?JSON.parse(localStorage.getItem('pageSize')).find(item=>item.name==this.$route.name)?JSON.parse(localStorage.getItem('pageSize')).find(item=>item.name==this.$route.name).pageSize:10:10
        },
        pageSizesList:[10, 50, 200,500,1000,5000,10000],
        tableDefaultList:[{'label':'案件文号','prop':'agentNum' },{'label':'案件名称','prop':'caseName'},{'label':'客户','prop':'custName'},{'label':'工作类型','prop':'workTypeName'},{'label':'员工','prop':'whUserName'}, {'label':'员工角色','prop':'roleName' }, {'label':'开始时间','prop':'beginDate' },{'label':'所属工作组','prop':'groupName' },{'label':'结束时间','prop':'endDate' },
          {'label':'记录工时','prop':'time' },{'label':'金额','prop':'amount' },{'label':'核定工时','prop':'approvedTime' },{'label':'核定金额','prop':'approvedAmountCust' },{'label':'状态','prop':'wfStatus' },{'label':'提交时间','prop':'submitDate' },{'label':'提交人','prop':'submitUserName' },
        ],
        customerNameIdList:[],
        feeTypeList:[],
        userList:[],
        deptByConditionList:[],
        workgroupNamesList:[],
        feeWfstatusList:[],
        endorseTaskerList:[],
        endorseTaskerState:false,
        endorseTasker:'',
        exportQueryModel:'',
        filterText:'',
        userId:this.$store.getters.userId,
        bussId:22,
        conditionsModuleList:[],
        schemeName:'',
        addFilterState:false,
        checkCaseList:[],
        checkboxState:false,
        selectColumnList:[],
        transferVisible: false, // 配置筛选条件框
        transferData: [], // 筛选条件数据
        transferValue: [], // 当前筛选条件id
        multipleSelection:[],
        currentPageSize:0,
        dateTime: [],
        defaultcolumnDefs:[
          {
            headerName: '序号',
            field: 'sid',
            width: 80,
            enableRowGroup: true,
            // enablePivot: true,
            cellRenderer:this.cellRenderer,
            floatingFilter:true,
            filter: false,
            cellClass: 'vAlign',
            suppressMenu: true,
            submitView: false,
            checkboxSelection: false,
            headerCheckboxSelection: false,
            headerCheckboxSelectionFilteredOnly: true
          },
        ],
        columnDefs: [

        ],
        // whStatus: '',
        whStatusBack: '',
        editLook: false,
        onlyLook: false,
        selectionState: false,
        auditWorkHoursView: false,
        brushRightHasFilter:false,
        exportView: false,
        idArray: [],
        changeAppMoney: 0,
        gridOptions:{
          statusBar: {
            statusPanels: [
              { statusPanel: 'agSelectedRowCountComponent', align: 'left' },
              {statusPanel: 'CountStatusBarComponent'}
            ]
          },
          //floatingFilter: true,
        },
        autoGroupColumnDef:{
          headerName: '组',
          field: 'group',
          headerCheckboxSelection: true,
          cellRenderer: 'agGroupCellRenderer',
          cellRendererParams: { checkbox: true },
        },
        haveCaseId: false,
        checkCase:true,
        copyView:false
      }
    },
    created() {
      this.workClick()
      // this.queryCaseWorkgroupUrl()
    },
    computed: {
      // whStatus() {
      //   console.log('++++444+++++++++++')
      //   console.log(this.status)
      //   console.log('+++++++++++++++')
      //   return this.status
      // }
      isAgentNum(){
        return this.rowDataForm.agentNum
      }
    },
    watch: {
      editWorkTime(n){
        if(n&&!this.groupList.length){
          this.queryCaseWorkgroupUrl()
        }
      },
      // status(n,o) {
      //   this.whStatus = n
      // },
      'rowDataForm.hourDate': {
         handler: function() {
           if(this.rowDataForm.beginDate){
             this.rowDataForm.beginDate = this.rowDataForm.hourDate + this.rowDataForm.beginDate.substring(10)
           }
           if(this.rowDataForm.endDate){
             this.rowDataForm.endDate = this.rowDataForm.hourDate + this.rowDataForm.endDate.substring(10)
           }

         },
     },
      isAgentNum: {
        handler(n){
          if(n){
            this.haveCaseId = true
          }else{
            this.haveCaseId = false
          }
        },
        immediate:true
      },
      view(n,o) {
        this.editWorkTime = n
      },
      dataTime:{
        handler(n,o){
          this.rowDataForm = JSON.parse(JSON.stringify(n))
          if(this.rowDataForm.agentNum){
            this.haveCaseId = true
          }
          if(this.rowDataForm.workType == 0){
            this.rowDataForm.workType = ''
          }
          if(!this.rowDataForm.approvedDesc && this.rowDataForm.wfStatus=='待审核'){
            this.rowDataForm.approvedDesc = this.rowDataForm.workContent
          }
          if(!this.rowDataForm.billRate && this.rowDataForm.wfStatus=='待审核'){
            this.rowDataForm.billRate = this.rowDataForm.criterionRate
          }
          // if(!this.rowDataForm.approvedTime && this.rowDataForm.approvedTime != '0'&& this.rowDataForm.approvedTime != '00:00'){
          //   this.rowDataForm.approvedTime = this.rowDataForm.time
          // }
        },
        immediate: true

      },
      sign(n,o){
        if(n == '审核'){
          this.auditWorkHoursView = true
          this.editWorkTime = true
        }
        if(n == '提交'){
          this.editWorkTime = true
          this.isSubmit = true
        }
        if(n == '修改'){
          this.editWorkTime = true
          this.editLook = true
        }
        if(n == '复制工时'){
          this.editWorkTime = true
          this.copyView = true
        }
        if(n == '查看'){
          this.onlyLook = true
          this.editWorkTime = true
        }
      }
    },
    methods: {
      searchContent(){
        if(this.rowDataForm.workContent === '')return;
        queryChargeItemBynameCnUrl({nameCn: this.rowDataForm.workContent, caodan: 2, caseId: this.rowDataForm.caseId}).then(res=>{
          this.gridData = res.data
          if(this.gridData.length){
            this.contentShow = true
          }else{
            this.contentShow = false
          }
        })
      },
      fwtableClick(row){
        this.$set(this.rowDataForm, 'workContent', row.nameCn || '')
      },
      queryCaseWorkgroupUrl(){
        queryCaseWorkgroupUrl({status: 1}).then(res=>{
          this.groupList = res.data
        })
      },
      workClick() {
        queryWorkType().then(res=>{
          this.workKinds = res.data
        })
      },
      copyTime(data){
        if(!data.time){
          this.$message.error('请填写记录工时！')
          return
        }
        if(!data.workContent){
          this.$message.error('请填写工作内容！')
          return
        }
        addTaskHours(data).then(()=>{
          this.$message.success('添加工时成功！')
          this.$emit('updataData')
          this.closeEdit()
        })
      },
      clearAgent(){
        this.rowDataForm.agentNum = ''
        this.rowDataForm.caseName = ''
        this.rowDataForm.custName = ''
        this.rowDataForm.caseId = ''
        this.checkCase = false
      },
      queryCaseInfo(item){
        if(item.agentNum == '案件文号'){

        }else{
          this.rowDataForm.agentNum = item.agentNum
          this.rowDataForm.caseName = item.caseName
          this.rowDataForm.custName = item.custName||item.name
          this.rowDataForm.caseId = item.caseId
          this.rowDataForm.custId = item.custId
          this.checkCase = true
        }

      },
      queryCaseList(queryString, cb) {
        if(!queryString){
           queryRecentCase().then(res=>{
            res.data.unshift({'agentNum': '案件文号','caseName': '案件名称','custName': '客户'})
            cb(res.data)
          })
        }else{
          let keyWord = queryString
          getCaseHistory({
            businessList: [3,4,5,6,11,23],
            pageNo: 1,
            pageSize: 100,
            keyWord
          }).then(res=>{
            if(res.data&&res.data.length == 1){
              this.rowDataForm.agentNum = res.data[0].agentNum
              this.rowDataForm.caseName = res.data[0].caseName
              this.rowDataForm.custName = res.data[0].custName||item.name
              this.rowDataForm.caseId = res.data[0].caseId
              this.rowDataForm.custId = res.data[0].custId
              this.checkCase = true
            }else{
              this.checkCase = false
            }
            res.data.unshift({'agentNum': '案件文号','caseName': '案件名称','custName': '客户'})
            cb(res.data)
          })
        }

      },
      changeMoney(v,d){
        this.rowDataForm.approvedAmountCust= this.ChangeStrToMinutes(d.approvedTime)*v/60
      },
      changeAppCount(v,d) {
        this.rowDataForm.approvedAmountCust= this.ChangeStrToMinutes(v[0])*d.billRate/60
      },
      changeTime(v,d){
        this.rowDataForm.amount= this.ChangeStrToMinutes(v[0])*d.criterionRate/60
      },
      ChangeStrToMinutes(str){
        if(str){
          let arrminutes = str.split(":");
          if (arrminutes.length == 2) {
            let minutes = parseInt(arrminutes[0]) * 60 + parseInt(arrminutes[1]);
            return minutes;
          }
          else {
           return 0;
          }
        }
      },
      closeEdit() {
        this.exportView = false
        this.selectionState = false
        this.editWorkTime = false
        this.auditWorkHoursView = false
        this.editLook = false
        this.onlyLook = false
        this.isSubmit = false
        this.isAudit =false
        this.copyView = false
        this.haveCaseId = false
        this.$emit('closeDialog')
      },
      auditWorkTime(data, f) {
        // if(!data.agentNum && !data.workType){
        //   this.$message.error('请输入正确的案件文号或工作类型！')
        //   return
        // }
        const workHoursList = [{
          ...data
          // createDate: data.createDate,
          // billRate: data.billRate,
          // hoursId: data.hoursId,
          // time: data.time,
          // workContent: data.workContent,
          // beginDate: data.beginDate,
          // endDate: data.endDate,
          // approvedDesc: data.approvedDesc,
          // approvedTime: data.approvedTime
        }]
        auditWorkHours({workHoursList: workHoursList, result: f}).then(()=>{
          this.$message.success('审核成功！')
          this.$emit('updataData')
          this.closeEdit()
        })
      },
      submitWork(data) {
        submitWorkHours({workHoursList: [{hoursId: data.hoursId,
          time: data.time,
          workContent: data.workContent,
          beginDate: data.beginDate,
          endDate: data.endDate}]}).then(()=>{
          this.$message.success('提交成功！')
          // this.queryWorkHours()
          this.$emit('updataData')
          this.closeEdit()
        })
      },
      modifyWorkTime(data) {
        if(this.haveCaseId){
          data.workTypeName = ''
          data.workType = ''
        }else{
          data.agentNum = ''
          data.caseName = ''
          data.custName = ''
          data.custId = ''
          data.caseId = ''
        }
        if(!data.projectId){
          if(!data.agentNum && !data.workType){
            this.$message.error('请输入正确的案件文号或工作类型！')
            return
          }
        }

        if(data.wfStatus=='待审核'){
          data.approvedTime = data.time
        }
        // data.beginDate = data.hourDate + data.beginDate.substring(10)
        // data.endDate = data.hourDate + data.endDate.substring(10)
        modifyTaskHours({
          workHoursList: [
            {
              ...data
              // agentNum: data.agentNum,
              // createDate: data.createDate,
              // billRate: data.billRate,
              // hoursId: data.hoursId,
              // time: data.time,
              // workContent: data.workContent,
              // beginDate: data.beginDate,
              // endDate: data.endDate,
              // approvedDesc: data.approvedDesc,
              // approvedTime: data.approvedTime
            }]
        }).then(()=>{
          this.$message.success('修改成功！')
          this.checkCase = true
          // this.queryWorkHours();
          this.$emit('updataData')
          this.closeEdit()
        })
      },
    }
  }
</script>

<style lang="scss" scoped>
  .edit-form {
    .el-row {
      display: flex;

      .el-col {
        /*height: 100%;*/
        display: flex;
        border: 1px solid #ccc;
        border-bottom: none;

        .el-form-item {
          flex: 1;
          margin-bottom: 0;
          /*max-height: 120px;*/
          /*overflow-y: auto;*/
          display: flex;
          justify-content: left;
          /*align-items: center;*/
          > > > .el-form-item__label {
            background-color: #f7f7f7;
          }

          > > > .el-form-item__content {
            margin-left: 0 !important;
            width: 75%;
          }
        }
      }

      .bott {
        border-bottom: 1px solid #ccc;
      }
    }
  }
  .el-form {
    .el-row{
      &:last-child{
        border-bottom: 1px solid #ccc;
      }
    }
  }
  >>> .el-dialog {
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
/*  dialog样式*/
  >>> .el-dialog {
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
  >>> .el-dialog__body {
        overflow: auto;
        padding-top: 0;
        padding-bottom: 0;
  }
  .pdfDialog  /deep/{
  z-index: 3000;
  .el-dialog{
    z-index: 3000;
    height: 100vh;
    display: flex;
    /*flex-direction: column;*/
    .el-dialog__body {
      flex: 1;
      .el-textarea{
        height: 100%;
        textarea{
          height: 100%;
        }
      }
    }
    }
  }
  .red-color{
    color: red!important;
  }
  .dialog-footer{
    display: flex;
    justify-content: center;
  }
  >>> .el-autocomplete-suggestion{
    width: 800px!important;
    top: 130px!important;
    left: 135px!important;
  }
  .tables{
    div{
      border: 1px solid #ccc;
      border-top: none;
      text-align: center;
    }
  }
  .table-head{
    text-align: center;
    background-color: #f7f7f7;
  }
  .overflow-hidden{
      overflow:hidden;
      width: 100%;
      display:inline-block;
      text-overflow:ellipsis;
      white-space:nowrap;
      word-break: break-all;
    }
</style>
