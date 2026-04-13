<template>
    <div class="work-btn">
      <el-button type="primary" size="small" @click.native="onShow">新建工时</el-button>
      <el-dialog
        title="新建工时"
        :visible.sync="isShow"
        width="60%"
        :before-close="closeDialog"
        center
        top="0"
        append-to-body
        :modal="false"
        v-dialogDrag
        :close-on-click-modal="false"
      >
        <el-form  :model="handTime" :rules="rules" label-width="100px">
          <template v-if="!projectId">
          <el-row>
            <el-col :span="12" style="height: 60px;">
              <el-form-item class="selected agent-num" label="案件文号:">
<!--                <el-autocomplete-->
<!--                  :disabled="isWorkType"-->
<!--                  @clear="clearCase"-->
<!--                  class="inline-input"-->
<!--                  v-model="handTime.agentNum"-->
<!--                  style=""-->
<!--                  multiple-->
<!--                  filterable-->
<!--                  clearable-->
<!--                  @focus="historyList"-->
<!--                  :fetch-suggestions="queryCaseList"-->
<!--                  @select="queryCaseInfo"-->
<!--                  placeholder="请输入内容"-->
<!--                  :popper-append-to-body="false"-->
<!--                  :trigger-on-focus="true"-->
<!--                >-->
<!--                  <template slot-scope="{ item }" style="">-->
<!--                    <div class="tables" style="display: flex;">-->
<!--                      <el-tooltip  :content="item.agentNum" placement="top" effect="light">-->
<!--                        <div style="flex: 1;" class="overflow-hidden" :class="{'table-head': item.agentNum == '案件文号'}">{{item.agentNum}}</div>-->
<!--                      </el-tooltip>-->
<!--                      <el-tooltip  :content="item.caseName" placement="top" effect="light">-->
<!--                        <div style="flex: 1;" class="overflow-hidden" :class="{'table-head': item.caseName == '案件名称'}">{{item.caseName}}</div>-->
<!--                      </el-tooltip>-->
<!--                      <el-tooltip  :content="item.name||item.custName" placement="top" effect="light">-->
<!--                        <div style="flex: 1;" class="overflow-hidden" :class="{'table-head': item.custName == '客户'}">{{item.name||item.custName}}</div>-->
<!--                      </el-tooltip>-->
<!--                    </div>-->
<!--      &lt;!&ndash;              <div class="name">{{ item.caseId }}</div>&ndash;&gt;-->
<!--      &lt;!&ndash;              <span class="addr">{{ item.address }}</span>&ndash;&gt;-->
<!--                  </template>-->
<!--                </el-autocomplete>-->
                <el-popover
                  placement="bottom-start"
                  width="600"
                  trigger="manual"
                  v-model="agentVisible"
                  >
                  <div style="max-height: 200px;overflow-y: auto">
                    <div @click="queryCaseInfo(item)" v-for="(item,index) in agentCaseLists" :key="index" class="tables" style="display: flex;max-height: 100px;overflow-y: auto">
                      <el-tooltip  :content="item.agentNum" placement="top" effect="light">
                        <div style="flex: 1;cursor: default;height: 30px;line-height: 30px;" class="overflow-hidden" :class="{'table-head': item.agentNum == '案件文号'}">{{item.agentNum}}</div>
                      </el-tooltip>
                      <el-tooltip  :content="item.caseName" placement="top" effect="light">
                        <div style="flex: 1;cursor: default;height: 30px;line-height: 30px;" class="overflow-hidden" :class="{'table-head': item.caseName == '案件名称'}">{{item.caseName}}</div>
                      </el-tooltip>
                      <el-tooltip  :content="item.name||item.custName" placement="top" effect="light">
                        <div style="flex: 1;cursor: default;height: 30px;line-height: 30px;" class="overflow-hidden" :class="{'table-head': item.custName == '客户'}">{{item.name||item.custName}}</div>
                      </el-tooltip>
                    </div>
                  </div>
                  <el-input style="" clearable slot="reference" v-model="handTime.agentNum" @input="(v)=>{useHistoryList(v,'agent')}" @blur="()=>{loseFocus('agent')}" @focus="(v)=>{queryHistoryList(v,'agent')}"  @keyup.enter.native="($event)=>{queryCaseList($event.target.value,'agent')}"></el-input>
                </el-popover>
              </el-form-item>
            </el-col>
            <el-col :span="12" style="height: 60px;">
              <el-form-item class="selected time-long" label="工作类型:" style="height: 80px;">
                  <el-select filterable clearable :disabled="isAgent" class="select-input" v-model="handTime.workType" placeholder="请选择">
                      <el-option
                        v-for="item in workKinds"
                        :key="item.workType"
                        :label="item.workTypeName"
                        :value="item.workType">
                      </el-option>
                    </el-select>
              </el-form-item>
            </el-col>

          </el-row>
          <el-row>
            <el-col :span="12" style="height: 60px;">
              <el-form-item class="time-long" label="案件名称:">
<!--                <el-autocomplete-->
<!--                  :disabled="isWorkType"-->
<!--                  @clear="clearCase"-->
<!--                  ref="casenum"-->
<!--                  class="inline-input"-->
<!--                  v-model="handTime.caseName"-->
<!--                  style=""-->
<!--                  multiple-->
<!--                  filterable-->
<!--                  clearable-->
<!--                  :fetch-suggestions="queryCaseList"-->
<!--                  @keyup.enter.native="queryCaseList"-->
<!--                  @select="queryCaseInfo"-->
<!--                  placeholder="请输入内容"-->
<!--                  :popper-append-to-body="false"-->
<!--                  :trigger-on-focus="true"-->
<!--                >-->
<!--                  <template slot-scope="{ item }" style="">-->
<!--                    <div class="tables" style="display: flex;">-->
<!--                      <el-tooltip  :content="item.agentNum" placement="top" effect="light">-->
<!--                        <div style="flex: 1;" class="overflow-hidden" :class="{'table-head': item.agentNum == '案件文号'}">{{item.agentNum}}</div>-->
<!--                      </el-tooltip>-->
<!--                      <el-tooltip  :content="item.caseName" placement="top" effect="light">-->
<!--                        <div style="flex: 1;" class="overflow-hidden" :class="{'table-head': item.caseName == '案件名称'}">{{item.caseName}}</div>-->
<!--                      </el-tooltip>-->
<!--                      <el-tooltip  :content="item.name||item.custName" placement="top" effect="light">-->
<!--                        <div style="flex: 1;" class="overflow-hidden" :class="{'table-head': item.custName == '客户'}">{{item.name||item.custName}}</div>-->
<!--                      </el-tooltip>-->
<!--                    </div>-->
<!--      &lt;!&ndash;              <div class="name">{{ item.caseId }}</div>&ndash;&gt;-->
<!--      &lt;!&ndash;              <span class="addr">{{ item.address }}</span>&ndash;&gt;-->
<!--                  </template>-->
<!--                </el-autocomplete>-->
                <el-popover
                  placement="bottom-start"
                  width="600"
                  trigger="manual"
                  v-model="visible"
                  >
                  <div style="max-height: 200px;overflow-y: auto">
                    <div @click="queryCaseInfo(item)" v-for="(item,index) in nameCaseLists" :key="index" class="tables" style="display: flex;max-height: 100px;overflow-y: auto">
                      <el-tooltip  :content="item.agentNum" placement="top" effect="light">
                        <div style="flex: 1;cursor: default;height: 30px;line-height: 30px;" class="overflow-hidden" :class="{'table-head': item.agentNum == '案件文号'}">{{item.agentNum}}</div>
                      </el-tooltip>
                      <el-tooltip  :content="item.caseName" placement="top" effect="light">
                        <div style="flex: 1;cursor: default;height: 30px;line-height: 30px;" class="overflow-hidden" :class="{'table-head': item.caseName == '案件名称'}">{{item.caseName}}</div>
                      </el-tooltip>
                      <el-tooltip  :content="item.name||item.custName" placement="top" effect="light">
                        <div style="flex: 1;cursor: default;height: 30px;line-height: 30px;" class="overflow-hidden" :class="{'table-head': item.custName == '客户'}">{{item.name||item.custName}}</div>
                      </el-tooltip>
                    </div>
                  </div>
                  <el-input clearable slot="reference" v-model="handTime.caseName" @input="(v)=>{useHistoryList(v,'name')}" @focus="queryHistoryList" @blur="loseFocus"  @keyup.enter.native="queryCaseList($event.target.value)"></el-input>
                </el-popover>

              </el-form-item>
            </el-col>
            <el-col :span="12" style="height: 60px;">
              <el-form-item class="time-long cust-name" label="客户名称:">
                <el-input class="" :disabled="isWorkType" style="width: 150px;" v-model="handTime.custName"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          </template>
          <el-row>
            <el-col :span="12">
<!--              <el-form-item class="selected">-->
<!--                <div style="display: flex;align-items: center;justify-content: space-between">-->
<!--                  <div class="el-icon-s-claim"></div>-->
<!--                  <div @click="noTask" v-if="caseTasks.length==0" style="width: 200px;">关联任务<i class="el-icon-caret-bottom"></i></div>-->
<!--                  <div>-->
<!--                    <el-select clearable class="select-input" v-if="caseTasks.length>0" v-model="handTime.task" placeholder="请选择">-->
<!--                      <el-option-->
<!--                        v-for="item in caseTasks"-->
<!--                        :key="item.prjTaskId"-->
<!--                        :label="item.prjTaskName"-->
<!--                        :value="item.prjTaskId">-->
<!--                      </el-option>-->
<!--                    </el-select>-->
<!--                  </div>-->
<!--                </div>-->

<!--              </el-form-item>-->
            </el-col>
          </el-row>
          <el-row style="display: flex;justify-content: space-between;height: 60px;">
            <el-col :span="10" style="flex: 1;height: 60px;">
              <el-form-item label="工时日期:" >
                <el-date-picker
                  v-model="handTime.hourDate"
                  type="date"
                  value-format="yyyy-MM-dd"
                  style="width: 50%"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="10" style="flex: 1">
              <el-form-item class="time-long" label="时长:">
                <TimerComponent style="width: 50%;" v-model="handTime.time" :sign="true"></TimerComponent>
<!--                <el-input placeholder="请输入时长"></el-input>-->
              </el-form-item>
            </el-col>
          </el-row>
          <el-row style="display: flex;justify-content: space-between">
            <el-col :span="10" style="flex: 1">
              <el-form-item class="time-long" label="开始时间:" style="">
                <TimerComponent style="width: 50%;" v-model="handTime.beginDate" :sign="false"></TimerComponent>
              </el-form-item>
            </el-col>
            <el-col :span="10" style="flex: 1">
              <el-form-item class="time-long" label="结束时间:" style="">
                <TimerComponent style="width: 50%;" v-model="handTime.endDate" :sign="false"></TimerComponent>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
<!--            <el-col :span="12">-->
<!--              <el-form-item>-->
<!--              </el-form-item>-->
<!--            </el-col>-->
            <el-col :span="12">
              <el-form-item label="员工:">
                <el-select style="width: 50%" v-model="handTime.userId"  filterable clearable placeholder="请选择">
                  <el-option
                    v-for="item in $store.getters.userList"
                    :key="item.userId"
                    :label="item.fullname"
                    :value="item.userId">
                    <UserIconAndUserName :user-id="item.userId"></UserIconAndUserName>
                  </el-option>
                </el-select>
              </el-form-item>

            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item prop="workContent" label-width="0">
                <div>
                  <el-popover class="inputshow" width="100%" placement="bottom" trigger="click" v-model="contentShow">
                    <el-table size="mini" @row-click="
                        val => {
                          fwtableClick(val);
                        }
                      " :data="gridData" style="height:250px;overflow: scroll;">
                      <el-table-column width="500" property="nameCn" label="工作内容"></el-table-column>
<!--                      <el-table-column width="300" property="nameEn" label="工作内容(英文)"></el-table-column>-->
                    </el-table>
                    <el-input slot="reference" v-debounce:searchContent="'input',1000" type="textarea" placeholder="请输入工作描述" :rows="4" size="small" v-model="handTime.workContent"></el-input>
                  </el-popover>
                </div>
<!--                <el-input :rows="4" type="textarea" v-model="handTime.workContent" placeholder="请输入工作描述"></el-input>-->
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
<!--            <el-col :span="12" style="height: 28px;line-height: 28px;">-->
<!--              <span v-if="!handTimeView" @click="handTimeViews('手动')">手动填写时间</span>-->
<!--              <span v-else @click="handTimeViews('自动')">自动填写时间</span>-->
<!--            </el-col>-->
            <el-col :span="24" class="bottom-btn">
              <el-form-item style="margin-left: 0!important;">
                <div style="width: 100%; display: flex;justify-content: center;align-items: center">
                  <span style="margin-right: 15px" @click="closeDialog">取消</span>
<!--                <el-checkbox v-model="checked">保存后添加下一个</el-checkbox>-->
                  <el-button @click.native="addWorkTime(handTime)" style="width: 80px" type="primary" round size="mini">确定</el-button>
                </div>

              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-dialog>
<!--      <el-dialog-->
<!--        title=""-->
<!--        :visible.sync="caseView"-->
<!--        width="30%"-->
<!--        :modal-append-to-body='false'-->
<!--        :before-close="beforeClose"-->
<!--        >-->
<!--        <div style="display: flex;align-items: center;justify-content: center;padding-bottom: 30px"><span>选择所属案件</span></div>-->
<!--        <div class="search-case" style="display: flex;justify-content: left;padding-bottom: 30px">-->
<!--          <el-input @input="inputCaseId" @keyup.enter.native="queryCase(handTime.agentNum)" class="search" size="small" v-model="handTime.agentNum" clearable placeholder="请输入案件文号" prefix-icon="el-icon-search"></el-input><span style="margin-left: 20px">共{{total}}个项目</span>-->
<!--        </div>-->
<!--        <div style="height: 250px;">-->
<!--          <div v-if="caseList.length==0" class="none-case" style="display: flex;flex-direction:column; justify-content: center;align-items: center">-->
<!--            <img src="@/assets/search.png" alt="">-->
<!--            <span>没有可选择的项目</span>-->
<!--          </div>-->
<!--          <div v-if="caseList.length>0" style="max-height: 250px; overflow-y: auto;background-color: #F5F7F7;">-->
<!--            <div @click="choseCase(item)" style="padding: 10px; font-size: 14px;cursor: pointer" :class="{'bgColor': index % 2 ==0}" v-for="(item, index) in caseList" :key="index">{{item.agentNum}}</div>-->
<!--          </div>-->
<!--        </div>-->
<!--        <span slot="footer" class="dialog-footer" style="display: flex;justify-content: center">-->
<!--          <el-button type="primary" @click="changeCaseId">确 定</el-button>-->
<!--        </span>-->
<!--      </el-dialog>-->
    </div>
</template>

<script>
  import {
    queryChargeItemBynameCnUrl,
  } from "@/api/billApi";
  // import { getUser } from '@/api/user'
  import {queryWorkType,queryProjectTask,queryCaseIdByAgentNum,addTaskHours,queryRecentCase,getCaseHistory} from '@/api/caseList';
  export default {
    name: "handTime",
    props:{
      caseData:{

      },
      projectId:{

      },
      noQuery: ''
    },
    data() {
      return {
        contentShow: false,
        gridData: [],
        agentVisible:false,
        isHistory: false,
        username: '',
        userList: [],
        rules: {
          workContent: [{required: true, message: '请填写任务描述', trigger: 'blur' }],
          userId: [{required: true, message: '请选择员工', trigger: 'change' }],
        },
        total: 0,
        caseList: [],
        agentCaseLists: [],
        nameCaseLists: [],
        handTime: {
          workType: '',
          caseName: '',
          custName: '',
          workContent: '',
          hourDate: this.nowDate(),
          agentNum: '',
          beginDate: '',
          endDate: '',
          userId: this.$store.getters.userId,
          caseId: ''
        },
        isCaseId: true,
        checked: false,
        handTimeView: false,
        dialogFormVisible: false,
        view: true,
        caseView: false,
        isShow:false,
        workKinds: [],
        caseTasks:[],
        checked: false,
        checkCase: false,
        visible:false,
        agentHistorySearch:false,
        nameHistorySearch:false,
        historyList: []
      }
    },
    created() {
      // this.getUser()
      this.workClick()
    },
    computed: {
      isAgent() {
        return this.handTime.agentNum?true:false
      },
      isWorkType() {
        return this.handTime.workType?true:false
      }
    },
    watch:{
      isShow(n,o){
        if(n&&this.caseData){
          this.handTime.agentNum = this.caseData.agentNum
          this.handTime.caseId = this.caseData.caseId
          this.handTime.caseName = this.caseData.caseName
          this.handTime.custName = this.caseData.custName||this.caseData.name
          this.caseList = []
          this.total = 0
        }
        if(n&&this.projectId){
          this.handTime.projectId=this.projectId
        }
      },
      noQuery: {
        handler(n,o){
          if(n == '1'){
            this.checkCase = true
          }
        },
        immediate: true
      }
    },
    methods: {
      searchContent(){
        if(this.handTime.workContent === '')return;
        queryChargeItemBynameCnUrl({nameCn: this.handTime.workContent, caodan: 2, caseId: this.handTime.caseId}).then(res=>{
          this.gridData = res.data
          if(this.gridData.length){
            this.contentShow = true
          }else{
            this.contentShow = false
          }
        })
      },
      fwtableClick(row){
        this.$set(this.handTime, 'workContent', row.nameCn || '')
      },
      nowDate(){
        let nowDate = new Date();
        let year = nowDate.getFullYear();
        let month = nowDate.getMonth() + 1 < 10 ? "0" + (nowDate.getMonth() + 1) : nowDate.getMonth() + 1;
        let day = nowDate.getDate() < 10 ? "0" + nowDate.getDate() : nowDate.getDate();
        let dateStr = year + "-" + month + "-" + day;
        return dateStr
      },
      clearCase(){
        this.handTime.agentNum = ''
        this.handTime.caseName = ''
        this.handTime.custName = ''
      },
      closeDialog(){
        this.isShow = false
      },
      // historyList() {
        // console.log('haha')
        // this.isHistory = true
        // this.handTime.agentNum = ' '
        // queryRecentCase().then(res=>{
        //   this.queryCaseList('','',res.data)
        // })
      // },
      queryCaseInfo(item){
        if(item.agentNum == '案件文号'){

        }else{
          this.handTime.agentNum = item.agentNum
          this.handTime.caseName = item.caseName
          this.handTime.custName = item.custName||item.name
          this.handTime.caseId = item.caseId
          this.checkCase = true
        }

      },
      loseFocus(f){
        if(f == 'agent'){
          this.agentVisible = false
        }else{
          this.visible = false
        }
      },
      useHistoryList(v,f){
        if(!v){
          if(f == 'agent'){
            this.agentCaseLists = this.historyList
          }else{
            this.nameCaseLists = this.historyList
          }


        }
      },
      queryHistoryList(v,f){

          if(f == 'agent'){
            this.agentVisible = true
            if(!v.target.value) {
              if (!this.agentHistorySearch) {
                queryRecentCase().then(res => {
                  this.agentHistorySearch = true
                  this.historyList = res.data
                  this.historyList.unshift({'agentNum': '案件文号', 'caseName': '案件名称', 'custName': '客户'})
                  this.agentCaseLists = JSON.parse(JSON.stringify(this.historyList))
                })
              }
            }
          }else{
            this.visible = true
            if(!v.target.value) {
              if (!this.nameHistorySearch) {
                queryRecentCase().then(res => {
                  this.nameHistorySearch = true
                  this.historyList = res.data
                  this.historyList.unshift({'agentNum': '案件文号', 'caseName': '案件名称', 'custName': '客户'})
                  this.nameCaseLists = JSON.parse(JSON.stringify(this.historyList))
                })
              }
            }
          }

      },
      queryCaseList(v,f){
        if(!v){
          return
        }
        let keyWord = v
        if(f == 'agent'){
          this.agentVisible = true
          getCaseHistory({
            businessList: [3,4,5,6,11,23],
            pageNo: 1,
            pageSize: 100,
            keyWord
          }).then((res)=>{
            if(res.data&&res.data.length == 1){
              this.handTime.agentNum = res.data[0].agentNum
              this.handTime.caseName = res.data[0].caseName
              this.handTime.custName = res.data[0].custName||res.data[0].name
              this.handTime.caseId = res.data[0].caseId
              this.checkCase = true
            }else{
              this.checkCase = false
            }
            this.agentCaseLists = res.data
            this.agentCaseLists.unshift({'agentNum': '案件文号','caseName': '案件名称','custName': '客户'})
          })
        }else{
          this.visible = true
          getCaseHistory({
            businessList: [3,4,5,6,11,23],
            pageNo: 1,
            pageSize: 100,
            keyWord
          }).then((res)=>{
            if(res.data&&res.data.length == 1){
              this.handTime.agentNum = res.data[0].agentNum
              this.handTime.caseName = res.data[0].caseName
              this.handTime.custName = res.data[0].custName||item.name
              this.handTime.caseId = res.data[0].caseId
              this.checkCase = true
            }else{
              this.checkCase = false
            }
            this.nameCaseLists = res.data
            this.nameCaseLists.unshift({'agentNum': '案件文号','caseName': '案件名称','custName': '客户'})
          })
        }




      },
      // queryCaseList(queryString, cb) {
      //   if(!queryString){
      //      queryRecentCase().then(res=>{
      //       res.data.unshift({'agentNum': '案件文号','caseName': '案件名称','custName': '客户'})
      //       cb(res.data)
      //     })
      //   }else{
      //     return
      //     let keyWord = queryString
      //     getCaseHistory({
      //       businessList: [3,4,5,6,11,23],
      //       pageNo: 1,
      //       pageSize: 100,
      //       keyWord
      //     }).then(res=>{
      //       if(res.data&&res.data.length == 1){
      //         this.handTime.agentNum = res.data[0].agentNum
      //         this.handTime.caseName = res.data[0].caseName
      //         this.handTime.custName = res.data[0].custName||item.name
      //         this.handTime.caseId = res.data[0].caseId
      //         this.checkCase = true
      //       }else{
      //         this.checkCase = false
      //       }
      //       res.data.unshift({'agentNum': '案件文号','caseName': '案件名称','custName': '客户'})
      //       cb(res.data)
      //     })
      //   }
      //
      // },
      // getUser(){
      //   getUser().then(res=>{
      //     this.userList=res.data
      //   })
      // },
      beforeClose() {
        // this.caseList = []
        // this.total = 0
        this.caseView = false
        if(!this.checked&&this.caseList.length!=1){
          this.handTime.agentNum = ''
          this.caseList = []
          this.total = 0
        }
        if(!this.checked&&this.caseList.length==1){
          this.handTime.agentNum = this.caseList[0].agentNum
          this.caseList = []
          this.total = 0
        }
        if(this.checked){
          this.caseList = []
          this.total = 0
          this.checked = false
        }
      },
      cleanObj(obj){
        for(var key in obj){
          obj[key] = ''
        }
      },
      async addWorkTime(data) {
        if(this.handTime.workContent==''){
          this.$message.error('请填写任务内容！')
          return
        }
        if(!this.handTime.userId){
          this.$message.error('请选择员工！')
          return
        }
        if(!this.handTime.time){
          this.$message.error('请填写任务时长！')
          return
        }
        if(!this.projectId&&!(this.handTime.agentNum||this.handTime.workType)){
          this.$message.error('请填写案件文号或案件类型！')
          return
        }
        if(data.agentNum && !this.checkCase){
          // this.agentVisible = true
          let keyWord = data.agentNum
          let res =  await getCaseHistory({
              businessList: [3,4,5,6,11,23],
              pageNo: 1,
              pageSize: 100,
              keyWord
            })
          if(res.data.length){
            if(res.data&&res.data.length == 1){
              this.handTime.agentNum = res.data[0].agentNum
              this.handTime.caseName = res.data[0].caseName
              this.handTime.custName = res.data[0].custName||res.data[0].name
              this.handTime.caseId = res.data[0].caseId
              this.checkCase = true
            }else{
              this.checkCase = false
            }
            this.agentCaseLists = res.data
            this.agentCaseLists.unshift({'agentNum': '案件文号','caseName': '案件名称','custName': '客户'})
          }
        }


        if(!this.checkCase&& !this.handTime.workType){
          // this.agentVisible = false
          this.$message.error('请填写正确案件文号或名称！')
          return
        }

        if(this.handTime.hourDate){
          this.handTime.hourDate = this.handTime.hourDate.replace(/\//g, '-')
        }
        if(this.handTime.beginDate){
          this.handTime.beginDate = this.handTime.hourDate+' '+this.handTime.beginDate
          this.handTime.beginDate = this.handTime.beginDate.replace(/\//g, '-')
        }
        if(this.handTime.endDate){
          this.handTime.endDate = this.handTime.hourDate+' '+this.handTime.endDate

          this.handTime.endDate = this.handTime.endDate.replace(/\//g, '-')
        }
        // this.agentVisible = false
        if(+this.handTime.time.substring(0,2) > 3) {
           this.$confirm('时长过长，是否创建!', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
              addTaskHours(this.handTime).then(()=>{
                this.$message.success('添加工时成功！')
                this.checkCase = false
                this.$emit('refreshList')
                this.cleanObj(this.handTime)
                if(this.checked){

                  // this.handTime.hourDate = this.nowDate()
                  this.$set(this.handTime,'hourDate',this.nowDate())
                  this.handTime.userId = this.$store.getters.userId
                  this.checked = false
                }else{
                  // this.handTime.hourDate = this.nowDate()
                  this.$set(this.handTime,'hourDate',this.nowDate())
                  this.handTime.userId = this.$store.getters.userId
                  this.closeDialog()
                }
              })
          }).catch(() => {
              this.cleanObj(this.handTime)
              // this.handTime.hourDate = this.nowDate()
              this.$set(this.handTime,'hourDate',this.nowDate())
              this.handTime.userId = this.$store.getters.userId
          });
        }else{
          addTaskHours(this.handTime).then(()=>{
                this.$message.success('添加工时成功！')
                this.checkCase = false
                this.$emit('refreshList')
                this.cleanObj(this.handTime)
                if(this.checked){
                  // this.handTime = {}
                  // this.handTime.hourDate = this.nowDate()
                  this.$set(this.handTime,'hourDate',this.nowDate())
                  this.handTime.userId = this.$store.getters.userId
                  this.checked = false
                }else{
                  // this.handTime = {}
                  // this.handTime.hourDate = this.nowDate()
                  this.$set(this.handTime,'hourDate',this.nowDate())
                  this.handTime.userId = this.$store.getters.userId
                  this.closeDialog()
                }
              }).catch(() => {
                  // this.handTime = {}
                  // this.handTime.hourDate = this.nowDate()
                  this.$set(this.handTime,'hourDate',this.nowDate())
                  this.handTime.userId = this.$store.getters.userId
              });
        }
      },
      noTask() {
        this.$message.warning('没有任务')
      },
      choseCase(item) {
        this.handTime.agentNum = item.agentNum
        this.handTime.caseId = item.caseId
        this.checked = true
      },
      queryCase(e) {
        if(!this.handTime.agentNum){
          return
        }
        queryCaseIdByAgentNum({taskType:2, agentNum: e, pageSize: 100}).then(res=>{
          this.caseList = res.data
          this.total = res.total
          if(this.caseList.length == 1){
            this.handTime.caseId = this.caseList[0].caseId
          }
        })
      },
      changeCaseId() {
        if(this.caseList.length==1 || this.checked){
          this.caseView = false
          this.beforeClose()
        }else {
          this.$message.error('请输入正确的案件文号')
        }

        // queryProjectTask({caseId: this.handTime.caseId}).then(res=>{
        //   if(res.data.length>0){
        //     res.data.forEach(item=>{
        //       this.caseTasks = [...item.taskList].filter(it=>it.nextOperation!=1).map(i=>({
        //         prjTaskId: i.prjTaskId,
        //         prjTaskName: i.prjTaskName,
        //         executorName: i.executorName
        //       }))
        //     })
        //   }
        // })
      },
      workClick() {
        queryWorkType().then(res=>{
          this.workKinds = res.data
        })
      },
      onShow() {
        this.isShow = !this.isShow;
      },
      caseViews() {
        this.caseView = true
      },
      closePop() {
        this.$refs.dcPopover.doClose()
      },
      inputCaseId() {
      }
    }
  }
</script>

<style lang="scss" scoped>
  .bgColor {
    background-color: #eee;
  }
  .select-input {
    >>>.el-input__inner {
      height: 30px;
    }
  }
  .work-btn {
    z-index: 999;
  }
  .start-btn, .stop-btn {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: #fff;

    img {
      height: 20px;
      margin-left: 55%;
      transform: translateX(-50%);
      margin-top: 30%;
    }
  }
  .stop-btn {
    img {
      margin-left: 50%;
    }
  }
  .el-icon-s-cooperation, .el-icon-s-claim, .el-icon-s-unfold {
    color: #52A0F5;
  }
  .el-form {
    .el-row {
      .el-col {

      }
    }
  }
  .selected {
    cursor: pointer;
    >>>.el-input.is-disabled{
      /*width: 150px;*/
      height: 30px;
      line-height: 30px;
    }
    >>> .el-input__inner {
      /*width: 150px;*/
      height: 30px!important;
      line-height: 30px;
    }
    >>>.el-input__icon{
      line-height: 30px;
    }
  }
  >>> .el-input--prefix .el-input__inner {
    /*width: 150px;*/
    height: 30px;
  }
  .time-long, .agent-num{

    >>> .el-input__inner {
      /*width: 150px;*/
      height: 30px;
    }
  }
  .bottom-btn {
    span {
      cursor: pointer;
    }
  }
  .search-case, .none-case {
    span {
      height: 32px;
      color: #a6a6a6;
      font-size: 14px;
      line-height: 32px;
    }
  }
  .none-case {
    span {
      padding-top: 30px;
    }
  }
  .search {
    /*width: 180px;*/
    >>> .el-input__inner {
      /*width: 180px;*/
      border-radius: 15px;
    }
  }
  .overflow-hidden{
      overflow:hidden;
      width: 100%;
      display:inline-block;
      text-overflow:ellipsis;
      white-space:nowrap;
      word-break: break-all;
    }
  >>> .el-form-item__label {
    font-weight: 500;
  }
  .el-select{
    >>>.el-input__inner{
      /*width: 150px;*/
      height: 30px;
    }
  }
  .new-time {
    z-index: 1!important;
  }
  >>>.el-textarea__inner{
        word-break: keep-all;
  }
  >>> .el-autocomplete-suggestion{
    width: 500px!important;
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
  .el-form{
    .el-row{
      .el-col{
        >>>.el-form-item__content{
            margin-left: 0!important;
          }
        .el-autocomplete{
          width: 60%;
        }
        .el-input{
          width: 60%;
        }
        .time-long{
          .el-select{
            width: 60%;
          }
        }

        .cust-name{
          .el-input{
            width: 60% !important;
          }
        }
      }
    }
  }
</style>
<style>
  .popover-box {
    /*z-index: 1!important;*/
    top: 135px !important;
  }
</style>
