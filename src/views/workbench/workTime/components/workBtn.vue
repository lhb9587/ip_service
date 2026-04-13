<template>
    <div class="work-btn">
      <el-popover
        v-clickoutside="closePop"
        v-model="workShow"
        ref="dcPopover"
        placement="top-start"
        width="350"
        trigger="manual">
        <el-form :model="formTime" v-if="view">
          <el-row>
            <el-col :span="12" style="height: 80px;">
              <el-form-item class="selected agent-num" label="案件文号:">
<!--                <el-input v-model="handTime.agentNum"></el-input>-->
<!--                <el-autocomplete-->
<!--                  :disabled="isWorkType"-->
<!--                  @clear="clearCase"-->
<!--                  class="inline-input"-->
<!--                  v-model="formTime.agentNum"-->
<!--                  style=""-->
<!--                  multiple-->
<!--                  filterable-->
<!--                  clearable-->
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
                  <el-input style="" clearable slot="reference" v-model="formTime.agentNum" @input="(v)=>{useHistoryList(v,'agent')}" @blur="()=>{loseFocus('agent')}" @focus="(v)=>{queryHistoryList(v,'agent')}"  @keyup.enter.native="(v)=>{queryCaseList(v,'agent')}"></el-input>
                </el-popover>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item class="selected time-long" label="工作类型:" style="height: 30px;width: 100%">
                  <el-select clearable :disabled="isAgent" class="select-input" v-model="formTime.workType" placeholder="请选择">
                      <el-option
                        v-for="item in workKinds"
                        :key="item.workType"
                        :label="item.workTypeName"
                        :value="item.workType">
                      </el-option>
                    </el-select>
<!--                  <div><i class="el-icon-s-unfold"></i></div>-->
<!--                  <div v-if="workKinds.length==0" @click="workClick" style="width: 200px;">案件类型<i class="el-icon-caret-bottom"></i></div>-->
<!--                  <div v-if="workKinds.length>0">-->
<!--                    <el-select clearable class="select-input" v-model="handTime.workType" placeholder="请选择">-->
<!--                      <el-option-->
<!--                        v-for="item in workKinds"-->
<!--                        :key="item.workType"-->
<!--                        :label="item.workTypeName"-->
<!--                        :value="item.workType">-->
<!--                      </el-option>-->
<!--                    </el-select>-->
<!--                  </div>-->

              </el-form-item>
            </el-col>

          </el-row>
          <el-row>
            <el-col :span="12">
<!--              <el-form-item class="selected">-->
<!--                <i class="el-icon-s-claim"></i>-->
<!--              <span>关联任务</span><i class="el-icon-caret-bottom"></i>-->
<!--              </el-form-item>-->
            </el-col>
          </el-row>
          <el-row v-if="handTimeView" style="height: 80px;">
            <el-col :span="12" style="height: 80px;">
              <el-form-item class="time-long" label="案件名称:">
<!--                <el-autocomplete-->
<!--                  class="inline-input"-->
<!--                  @clear="clearCase"-->
<!--                  :disabled="isWorkType"-->
<!--                  v-model="formTime.caseName"-->
<!--                  style=""-->
<!--                  multiple-->
<!--                  filterable-->
<!--                  clearable-->
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
                  <el-input clearable slot="reference" v-model="formTime.caseName" @input="(v)=>{useHistoryList(v,'name')}" @focus="queryHistoryList" @blur="loseFocus"  @keyup.enter.native="queryCaseList"></el-input>
                </el-popover>
              </el-form-item>
            </el-col>
            <el-col :span="12" style="height: 80px;">
              <el-form-item class="time-long" label="客户名称:">
                <el-input :disabled="isWorkType" v-model="formTime.custName"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="handTimeView" style="display: flex;justify-content: space-between">
            <el-col :span="10" style="flex: 1;height: 80px;">
              <el-form-item label="工时日期:" style="width: 100px">
                <el-date-picker
                  v-model="formTime.hourDate"
                  type="date"
                  :placeholder="formTime.hourDate"
                  value-format="yyyy/MM/dd"
                  :clearable="false"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="10" style="flex: 1;height: 80px;">
              <el-form-item class="time-long" label="时长:" style="width: 100%;">
                <TimerComponent v-model="formTime.time" :sign="true"></TimerComponent>
<!--                <el-input placeholder="请输入时长"></el-input>-->
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="handTimeView" style="display: flex;justify-content: space-between">
            <el-col :span="10" style="flex: 1">
              <el-form-item label="开始时间:" style="width: 100px">
                <TimerComponent style="width:150px" v-model="formTime.beginDate" :sign="false"></TimerComponent>
              </el-form-item>
            </el-col>
            <el-col :span="10" style="flex: 1">
              <el-form-item label="结束时间:" style="width: 100px">
                <TimerComponent style="width:150px" v-model="formTime.endDate" :sign="false"></TimerComponent>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
<!--            <el-col :span="12">-->
<!--              <el-form-item>-->
<!--              </el-form-item>-->
<!--            </el-col>-->
            <el-col v-if="handTimeView" :span="12">
              <el-form-item label="员工:" label-width="90px">
                <el-select class="select-input" v-model="formTime.userId"  filterable clearable placeholder="请选择">
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
              <el-form-item>
                <div>
                  <el-popover class="inputshow"  placement="bottom" trigger="click" v-model="contentShow">
                    <el-table size="mini" @row-click="
                        val => {
                          fwtableClick(val);
                        }
                      " :data="gridData" style="height:250px;overflow: scroll;">
                      <el-table-column width="500" property="nameCn" label="工作内容"></el-table-column>
<!--                      <el-table-column width="300" property="nameEn" label="工作内容(英文)"></el-table-column>-->
                    </el-table>
                    <el-input slot="reference" v-debounce:searchContent="'input',1000" type="textarea" placeholder="请输入工作描述" :rows="4" size="small" v-model="formTime.workContent"></el-input>
                  </el-popover>
                </div>
<!--                <el-input :rows="4" type="textarea" v-model="formTime.workContent" placeholder="请输入工作描述"></el-input>-->
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" style="height: 28px;line-height: 28px;">
              <span style="cursor: pointer;color:#409EFF" v-if="!handTimeView" @click="handTimeViews('手动')">手动填写时间</span>
              <span style="cursor: pointer;color:#409EFF" v-else @click="handTimeViews('自动')">自动填写时间</span>
            </el-col>
            <el-col :span="12">
<!--              <span @click="postMessage">测试</span>-->
              <span style="margin-right: 15px;cursor: pointer" @click="closePop">取消</span>
              <el-button v-if="!handTimeView" @click="startTaskHours(formTime)" style="width: 80px" type="primary" round size="mini">开始</el-button>
              <el-button v-else @click="startTaskHours(formTime)" style="width: 80px" type="primary" round size="mini">确定</el-button>
            </el-col>
          </el-row>
        </el-form>
        <div class="long-stop-btn" v-if="isStop" slot="reference">
          <img class="clock" src="@/assets/time.png" alt="">
          <div style="display: inline-block; transform: translateX(-10px) translateY(-4px); color: #52A0F5">{{str}}</div>
          <img v-if="changeBtn" src="@/assets/play.png" alt="" @click="pauseTaskHours">
          <img v-if="!changeBtn" class="fix-btn" src="@/assets/start.png" alt="" @click="startTaskHours(1)">
          <img class="fix-btn stop" src="@/assets/stop.png" alt="" @click="stopTime">
        </div>
        <div v-else class="start-btn" slot="reference">
          <img class="fix-btn" src="@/assets/start.png" alt="" @click="onShow" style="margin-left: 51%;margin-top: 29%">
        </div>
      </el-popover>




<!--      <div class="long-start-btn">-->
<!--        <img class="fix-btn" src="@/assets/start.png" alt="">-->
<!--      </div>-->
<!--      <div class="stop-btn">-->
<!--        <span></span>-->
<!--        <img class="fix-btn" src="@/assets/stop.png" alt="">-->
<!--      </div>-->
<!--      <div class="long-stop-btn">-->
<!--        <span></span>-->
<!--        <img class="fix-btn" src="@/assets/stop.png" alt="">-->
<!--      </div>-->
      <el-dialog
        title=""
        :visible.sync="caseView"
        width="30%"
        :modal-append-to-body='false'
        :before-close="beforeClose"
        >
        <div style="display: flex;align-items: center;justify-content: center;padding-bottom: 30px"><span>选择所属案件</span></div>
        <div class="search-case" style="display: flex;justify-content: left;padding-bottom: 30px">
          <el-input @input="inputCaseId" @keyup.enter.native="queryCase(formTime.agentNum)" class="search" size="small" v-model="formTime.agentNum" clearable placeholder="请输入案件文号" prefix-icon="el-icon-search"></el-input><span style="margin-left: 20px">共{{total}}个项目</span>
        </div>
        <div style="height: 250px;">
          <div v-if="caseList.length==0" class="none-case" style="display: flex;flex-direction:column; justify-content: center;align-items: center">
            <img src="@/assets/search.png" alt="">
            <span>没有可选择的项目</span>
          </div>
          <div v-if="caseList.length>0" style="max-height: 250px; overflow-y: auto;background-color: #F5F7F7;">
            <div @click="choseCase(item)" style="padding: 10px; font-size: 14px;cursor: pointer" :class="{'bgColor': index % 2 ==0}" v-for="(item, index) in caseList" :key="index">{{item.agentNum}}</div>
          </div>
        </div>
        <span slot="footer" class="dialog-footer" style="display: flex;justify-content: center">
          <el-button type="primary" @click="changeCaseId">确 定</el-button>
        </span>
      </el-dialog>
    </div>
</template>

<script>
  import {
    queryChargeItemBynameCnUrl,
  } from "@/api/billApi";
  import bus from '@/utils/Bus'
  // import { getUser } from '@/api/user'
  import {queryRecentCase,queryCaseList,queryWorkType,getCaseHistory,queryProjectTask,queryCaseIdByAgentNum,addTaskHours,startTaskHours,queryAutoWorkHours,stopTaskHours,pauseTaskHours} from '@/api/caseList';
  export default {
    name: "workBtn",
    data() {
      return {
        contentShow: false,
        gridData: [],
        visible:false,
        agentHistorySearch:false,
        nameHistorySearch:false,
        historyList: [],
        agentVisible: false,
        agentCaseLists:[],
        nameCaseLists: [],


        userList: [],
        changeBtn:true,
        onlyOneTime: false,
        checked: false,
        isStop: false,
        workKinds: [],
        formTime: {
          workType: '',
          custName: '',
          caseName: '',
          agentNum: '',
          workContent: '',
          hourDate: this.nowDate(),
          beginDate: '',
          endDate: '',
          userId: this.$store.getters.userId
        },
        status: '',
        beginDate: '',
        handTimeView: false,
        dialogFormVisible: false,
        view: true,
        workShow: false,
        caseView: false,
        caseList: [],
        total: 0,
        caseTasks: [],
        changeTime: '',
        time: '',
        day: 0,
        hour: 0,
        minute: 0,
        second: 0,
        ms: 0,
        str: '00:00:00',
        hoursId: '',
        checkCase: false

      }
    },
    created() {
      this.queryAutoWorkHours()
      this.workClick()
      // this.getUser()
    },
    computed: {
      workTimeStatus() {
        return this.$store.getters.workTimeStatus
      },
      isAgent() {
        return this.formTime.agentNum?true:false
      },
      isWorkType() {
        return this.formTime.workType?true:false
      }
    },
    watch: {
      workTimeStatus(n,o) {
        if(n == 2){
            // console.log('计时')
            clearInterval(this.time)
            this.timeStart()
            this.changeBtn = true
            this.workShow = false
            this.isStop = true
          }else if(n == 1){
            // console.log('暂停')
            this.changeBtn = false
            this.workShow = false
            this.isStop = true
            clearInterval(this.time)
          } else{
            // console.log('stop!!!!!')
            this.workShow = false
            this.isStop = false
            this.reset()
          }
      }
    },
    methods: {
      searchContent(){
        if(this.formTime.workContent === '')return;
        queryChargeItemBynameCnUrl({nameCn: this.formTime.workContent, caodan: 2, caseId: this.formTime.caseId}).then(res=>{
          this.gridData = res.data
          if(this.gridData.length){
            this.contentShow = true
          }else{
            this.contentShow = false
          }
        })
      },
      fwtableClick(row){
        this.$set(this.formTime, 'workContent', row.nameCn || '')
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
        this.formTime.agentNum = ''
        this.formTime.caseName = ''
        this.formTime.custName = ''
      },
      // getUser(){
      //   getUser().then(res=>{
      //     this.userList=res.data
      //   })
      // },
      queryCaseInfo(item){
        if(item.agentNum == '案件文号'){

        }else{
          this.formTime.agentNum = item.agentNum
          this.formTime.caseName = item.caseName
          this.formTime.custName = item.custName || item.name
          this.formTime.caseId = item.caseId
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
        if(!v.target.value){
          return
        }
        let keyWord = v.target.value
        if(f == 'agent'){
          this.agentVisible = true
          getCaseHistory({
            businessList: [3,4,5,6,11,23],
            pageNo: 1,
            pageSize: 100,
            keyWord
          }).then((res)=>{
            if(res.data&&res.data.length == 1){
              this.formTime.agentNum = res.data[0].agentNum
              this.formTime.caseName = res.data[0].caseName
              this.formTime.custName = res.data[0].custName || res.data[0].name
              this.formTime.caseId = res.data[0].caseId
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
              this.formTime.agentNum = res.data[0].agentNum
              this.formTime.caseName = res.data[0].caseName
              this.formTime.custName = res.data[0].custName || res.data[0].name
              this.formTime.caseId = res.data[0].caseId
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
      //   // return
      //   if(queryString == ''){
      //      queryRecentCase().then(res=>{
      //        if(res.data&&res.data.length){
      //
      //        }
      //       res.data.unshift({'agentNum': '案件文号','caseName': '案件名称','custName': '客户'})
      //       cb(res.data)
      //     })
      //   }else{
      //     let keyWord = queryString
      //    getCaseHistory({
      //       businessList: [3,4,5,6,11,23],
      //       pageNo: 1,
      //       pageSize: 100,
      //       keyWord
      //     }).then(res=>{
      //       if(res.data&&res.data.length == 1){
      //         this.formTime.agentNum = res.data[0].agentNum
      //         this.formTime.caseName = res.data[0].caseName
      //         this.formTime.custName = res.data[0].custName || item.name
      //         this.formTime.caseId = res.data[0].caseId
      //         this.checkCase = true
      //       }else{
      //         this.checkCase = false
      //       }
      //       res.data.unshift({'agentNum': '案件文号','caseName': '案件名称','custName': '客户'})
      //       cb(res.data)
      //     })
      //   }
      // },
      pauseTaskHours() {
        this.$store.commit('caseInformation/SET_WORKTIMESTATUS', 1)
        clearInterval(this.time)
        this.changeBtn = false
        this.postMessage(1)
        pauseTaskHours({hoursId: this.hoursId}).then(res=>{
          this.$message.success('暂停计时')
        })
      },
      stopTime() {
        this.isStop = false
        this.reset()
        this.$store.commit('caseInformation/SET_WORKTIMESTATUS', 'stop')
        stopTaskHours({hoursId: this.hoursId}).then(()=>{
          this.postMessage(3)
          this.$message.success('记录工时成功！')
          bus.$emit('updateWorkList')
        })
      },
      formatSeconds(a) {
        let hh = parseInt(a/3600);
        if(hh<10) hh = "0" + hh;
        let mm = parseInt((a-hh*3600)/60);
        if(mm<10) mm = "0" + mm;
        let ss = parseInt((a-hh*3600)%60);
        if(ss<10) ss = "0" + ss;
        let length = hh + ":" + mm + ":" + ss;
        if(a>0){
          return length;
        }else{
          return "00:00:00";
        }
      },
      async queryAutoWorkHours() {
        const res = await queryAutoWorkHours()
        if(res.data){
          this.hoursId = res.data.hoursId
          this.status = res.data.status
        }

        if(this.status == 1 || this.status == 2){
          this.$store.commit('caseInformation/SET_WORKTIMESTATUS', res.data.status)
        }else{
          this.$store.commit('caseInformation/SET_WORKTIMESTATUS', 3)
        }
        if(!this.status){
          this.isStop = false
          this.workShow = false
        }
        if(this.status == 2){
          let computedTime  = this.formatSeconds(res.data.totalTime).split(':')
          this.hour = +computedTime[0]
          this.minute = +computedTime[1]
          this.second = +computedTime[2]
          this.changeBtn = true
          this.workShow = false
          this.isStop = true
          this.str =this.toDub(this.hour) +':' +this.toDub(this.minute) +':' +this.toDub(this.second)
          clearInterval(this.time)
          this.timeStart()
        }
        if(this.status == 1) {
          let computedTime  = this.formatSeconds(res.data.totalTime).split(':')
          this.hour = +computedTime[0]
          this.minute = +computedTime[1]
          this.second = +computedTime[2]
          this.changeBtn = false
          this.workShow = false
          this.isStop = true
          clearInterval(this.time)
          this.str =this.toDub(this.hour) +':' +this.toDub(this.minute) +':' +this.toDub(this.second)
        }
      },
      timeStart(){
        this.time =setInterval(this.timer,1000)
      },
      timer () {
        this.second =this.second +1        //毫秒
        // if (this.ms >=1000) {
        //   this.ms =0
        //   this.second =this.second +1        //秒
        // }
        // console.log(this.hour,this.minute,this.second)
        // this.second =this.second +1
        if (this.second >=60) {
        this.second =0
          this.minute =this.minute +1
        }
        if (this.minute >=60) {
          this.minute =0
          this.hour =this.hour +1
        }
          this.str =this.toDub(this.hour) +':' +this.toDub(this.minute) +':' +this.toDub(this.second)
        // console.log(this.str,'=============')
      },
      toDub (n) {
        //补0
        if (n <10) {
          return '0' + n
        }else {
          return '' + n
        }
      },
      reset () {
        //重置
        clearInterval(this.time)
        this.hour =0
        this.minute =0
        this.ms =0
        this.second =0
        this.beginDate = ''
        this.str ='00:00:00'
      },
      add0(m){
         return m<10?'0'+m:m
       },
      format(shijianchuo) {
        //shijianchuo是整数，否则要parseInt转换
        var time = new Date(shijianchuo);
        var y = time.getFullYear();
        var m = time.getMonth()+1;
        var d = time.getDate();
        // var h = time.getHours();
        // var mm = time.getMinutes();
        // var s = time.getSeconds();
        return y+'-'+this.add0(m)+'-'+this.add0(d)
      },
      postMessage(status) {
        this.$worker.postMessage({data:{
          value: {
            "popFlag":0,
            "msgType":-6,
            "data":"连接成功, userId=2834",
            "success":true,
            "event":"workTime",
            "message":"连接成功",
            status: status,
            userId:this.$store.getters.userId
          }}
        })
      },
      async startTaskHours(data) {
        if(data==1){
          startTaskHours({hoursId: this.hoursId}).then(()=>{
            this.$store.commit('caseInformation/SET_WORKTIMESTATUS', 2)
            this.postMessage(2)
            // const time = new Date().getTime()
            // localStorage.setItem('workTimePlay', time+'')
            this.$message.success('继续计时')
          })
        }else{
          if(this.formTime.workContent==''){
            this.$message.error('请填写任务内容！')
            return
          }
          if(!(this.formTime.agentNum||this.formTime.workType)){
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
                this.formTime.agentNum = res.data[0].agentNum
                this.formTime.caseName = res.data[0].caseName
                this.formTime.custName = res.data[0].custName||res.data[0].name
                this.formTime.caseId = res.data[0].caseId
                this.checkCase = true
              }else{
                this.checkCase = false
              }
              this.agentCaseLists = res.data
              this.agentCaseLists.unshift({'agentNum': '案件文号','caseName': '案件名称','custName': '客户'})
            }
          }
          if(!this.checkCase&&!this.formTime.workType){
            this.$message.error('请填写正确案件文号或名称！')
            return
          }

        // this.closePop()
        // if(this.$store.getters.name == this.caseTasks.find(item=>item.prjTaskId==data.task).executorName){
          if(this.formTime.hourDate){
            this.formTime.hourDate = this.formTime.hourDate.replace(/\//g, '-')
          }
          if(this.formTime.beginDate){
            this.formTime.beginDate = this.formTime.hourDate+' '+this.formTime.beginDate
            this.formTime.beginDate = this.formTime.beginDate.replace(/\//g, '-')
          }
          if(this.formTime.endDate){
            this.formTime.endDate = this.formTime.hourDate+' '+this.formTime.endDate
            this.formTime.endDate = this.formTime.endDate.replace(/\//g, '-')
          }
        if(this.handTimeView){
          if(+this.formTime.time.substring(0,2) > 3) {
            this.$confirm('时长过长，是否创建!', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              addTaskHours(this.formTime).then(()=>{
                this.$message.success('添加工时成功！')
                this.checkCase = false
                bus.$emit('updateWorkList')
                  this.formTime = {}
                  this.$set(this.formTime,'hourDate',this.nowDate())
                  this.formTime.userId = this.$store.getters.userId
                  this.closePop()
              }).catch(()=>{
                this.formTime = {}
                // this.formTime.hourDate = this.nowDate()
                this.$set(this.formTime,'hourDate',this.nowDate())
                this.formTime.userId = this.$store.getters.userId
              })
            })
          }else{
            addTaskHours(this.formTime).then(()=>{
                this.$message.success('添加工时成功！')
                this.checkCase = false
                bus.$emit('updateWorkList')
                  this.formTime = {}
                  // this.formTime.hourDate = this.nowDate()
                  this.$set(this.formTime,'hourDate',this.nowDate())
                  this.formTime.userId = this.$store.getters.userId
                  this.closePop()
              }).catch(()=>{
                this.formTime = {}
                // this.formTime.hourDate = this.nowDate()
                this.$set(this.formTime,'hourDate',this.nowDate())
                this.formTime.userId = this.$store.getters.userId
              })
          }
        }else{
          this.formTime.beginDate = ''
          this.formTime.endDate = ''
          this.$store.commit('caseInformation/SET_WORKTIMESTATUS', 2)
          // const time = new Date().getTime()
          // localStorage.setItem('workTimePlay', time+'')
          startTaskHours({...this.formTime}).then((res)=>{
            this.postMessage(2)
            this.changeBtn = true
            this.workShow = false
            this.isStop = true
            this.$message.success('开始记录工时！')
            bus.$emit('updateWorkList')
            this.checkCase = false
            this.hoursId = res.data.hoursId
            this.hoursId = res.data.hoursId
              this.formTime = {}
              this.formTime.hourDate = this.nowDate()
              this.formTime.userId = this.$store.getters.userId
          })
        }

        clearInterval(this.time)
        this.timeStart()
        }
      },
      queryCase(e) {
        if(!this.formTime.agentNum){
          return
        }
        queryCaseIdByAgentNum({taskType:2, agentNum: e, pageSize: 100}).then(res=>{
          this.caseList = res.data
          this.total = res.total
          if(this.caseList.length == 1){
            this.formTime.caseId = this.caseList[0].caseId
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
      },
      choseCase(item) {
        this.formTime.agentNum = item.agentNum
        this.formTime.caseId = item.caseId
        this.checked = true
        // this.formTime.caseId = item.caseId
      },
      inputCaseId() {
      },
      beforeClose() {
        // this.caseList = []
        // this.total = 0
        this.caseView = false
        if(!this.checked&&this.caseList.length!=1){
          this.formTime.agentNum = ''
          this.caseList = []
          this.total = 0
        }
        if(!this.checked&&this.caseList.length==1){
          this.formTime.agentNum = this.caseList[0].agentNum
          this.caseList = []
          this.total = 0
        }
        if(this.checked){
          this.caseList = []
          this.total = 0
          this.checked = false
        }
      },
      caseViews() {
        // console.log('haha')
        this.caseView = true
      },
      workClick() {
        queryWorkType().then(res=>{
          this.workKinds = res.data
        })
      },
      onShow() {
        // if(this.onlyOneTime){
        //   this.$message.error('其它页面正在自动计时！')
        //   return
        // }else {
        //   this.workShow = !this.workShow;
        // }
        this.workShow = !this.workShow;
      },
      handTimeViews(v) {
        if(v=='手动') {
          this.handTimeView = true
          this.$nextTick(()=> {
            this.$refs.dcPopover.updatePopper()
          })
        }
        if(v=='自动') {
          this.handTimeView = false
          this.$nextTick(()=> {
            this.$refs.dcPopover.updatePopper()
          })
        }


      },
      closePop() {
        // this.isStop = !this.isStop
        this.$refs.dcPopover.doClose()
      }
    },
    // beforeDestroy() {
    //   clearInterval(this.time);
    // }
  }
</script>

<style lang="scss" scoped>
  .work-btn {
    z-index: 99999;
  }
  .start-btn, .stop-btn, .long-stop-btn, .long-start-btn {
    position: fixed;
    bottom: 10px;
    right: 0px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: #fff;
    box-shadow:-1px -1px 1px 2px #f2f2f2;
    img {
      height: 20px;
      margin-left: 3%;
      transform: translateX(-50%);
      /*margin-top: 0%;*/
    }
    .clock {
      display: inline-block;
      height: 20px;
      margin-left: 15%;
      /*margin-top: 30%;*/
    }
  }
  .stop-btn {
    img {
      margin-left: 50%;
    }
  }
  .long-stop-btn, .long-start-btn {
    width: 180px;
    border-radius: 25px;
    img {
      /*margin-left: 80%;*/
      margin-top: 8%;
    }
  }
  .el-icon-s-cooperation, .el-icon-s-claim, .el-icon-s-unfold {
    color: #52A0F5;
  }
  .selected {
    cursor: pointer;
  }
  >>> .el-input--prefix .el-input__inner {
    width: 150px;
  }
  .time-long, .agent-num {
    >>> .el-input__inner {
      width: 150px;
      height: 30px;
    }
  }
  .bgColor {
    background-color: #eee;
  }
  .select-input {
    >>>.el-input.is-disabled{
      width: 150px;
      height: 30px;
      line-height: 30px;
    }
    >>> .el-input__inner {
      width: 150px;
      height: 30px!important;
      line-height: 30px;
    }
    >>>.el-input__icon{
      line-height: 30px;
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
  }
  >>> .el-input--prefix .el-input__inner {
    width: 150px;
    height: 30px;
  }
  .time-long {
    >>> .el-input__inner {
      width: 150px;
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
    width: 180px;
    >>> .el-input__inner {
      width: 180px;
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
  >>>.el-textarea__inner{
        word-break: keep-all;
  }
  >>> .el-autocomplete-suggestion{
    width: 400px!important;
  }
  .new-time {
    z-index: 1!important;
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
</style>
