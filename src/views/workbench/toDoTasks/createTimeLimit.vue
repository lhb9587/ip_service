<template>
    <div style="padding:0 20px ">
<!--      <header>新建时限</header>-->
      <aside>
        <div>
          <GetCase style="flex: 1" v-model="agentNums" ></GetCase>
<!--          <el-input-->
<!--            type="textarea"-->
<!--            :autosize="{ minRows: 5, maxRows: 5}"-->
<!--            placeholder="请输入案件文号"-->
<!--            v-model="agentNums"-->
<!--          >-->
<!--          </el-input>-->
          <el-button @click="getCase">确定</el-button>
        </div>
        <span>每一行只能输入一个案件号，若想继续输入，需按“Enter”键，换行输入。</span>
      </aside>
      <h4 class="title">案件信息</h4>
      <el-table :data="caseData" border class="el-table1" maxHeight="400">
        <el-table-column type="index" width="60" label="序号" align="left">
        </el-table-column>
        <el-table-column align="left" :key="item.title" v-for="item,index in tableTitleList" :label="item.title" :prop="item.value">
          <template slot-scope="scope">
           <span :title="scope.row[item.value]">{{scope.row[item.value]}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作"  align="left">
          <template slot-scope="{row}">
            <el-button type="text" size="small" @click="editTimelimit(row)">时限编辑</el-button>
            <el-button type="text" size="small" @click="delTimelimit(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <section>
      <h4 class="title">时限信息</h4>
      <el-form  ref="submission" :rules="rules" :model="timelimitInfo" label-width="206px"  >
        <el-row style="border-right: 1px solid #EBEEF5;border-top: 1px solid #EBEEF5">
          <el-form-item label="案件文号:"  class="small-el-form-item" style="border:0">
            {{timelimitInfo.agentNum}}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="时限种类:" prop="kind">
            <el-radio-group v-model="timelimitInfo.kind" @change="getTimelimitType" ref="elRadio">
              <el-radio  :label="1" v-allow='192' v-if="!query.kind||query.kind=='1'">官方时限</el-radio>
              <el-radio  :label="2" v-allow='193' v-if="!query.kind||query.kind=='2'">内部时限</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="时限类型:" prop="tltTypeId" >
            <el-select v-model="timelimitInfo.tltTypeId" placeholder="请选择时限类型" filterable @change="(n) => {this.getAbslimitDate(this.timelimitInfo.sendDate,n,true)}"
                       clearable >
              <el-option
                v-for="item in getTimelimitTypeAllList"
                :key="item.tltTypeId"
                :label="item.typeName"
                :value="item.tltTypeId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="时限内容:" >
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              placeholder="请输入内容"
              v-model="timelimitInfo.caption"
            >
            </el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="详细说明:" >
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              placeholder="请输入内容"
              v-model="timelimitInfo.decription"
            >
            </el-input>
          </el-form-item>
        </el-row>
        <el-row >
          <el-form-item label="计算基准日期:"  class="sendDate">
            <el-date-picker
              @change="getAbslimitDate"
              v-model="timelimitInfo.sendDate"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="绝限日期:" prop="abslimitDate" class="abslimitDate">
            <el-date-picker
              v-model="timelimitInfo.abslimitDate"
              type="date"
              @change="absLimitChange"
              :disabled="!$store.getters.permissions.includes(249)&&timelimitInfo.kind==1"
              placeholder="选择日期"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="内部期限:"  prop="abslimitInternalDate">
            <el-date-picker
              v-model="timelimitInfo.abslimitInternalDate"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="时限工作组:" >
            <el-button  size="small" style="float: right;
    margin: 10px;" @click="addTimelimitWorkgroupArray" type="primary">添加</el-button>
            <el-table :data="timelimitInfo.workgroupArray" border >
              <el-table-column align="left" label="时限工作组">
                <template slot-scope="scope">
                  <el-select v-model="timelimitInfo.workgroupArray[scope.$index].wrkId" placeholder="请选择时限工作组" filterable
                             clearable  @change="(e)=>getTimelimitInfoWkgUsers(e,scope.$index)">
                    <el-option
                      v-for="item in queryWorkgroupNamesList"
                      :key="item.wkgId"
                      :label="item.groupName"
                      :value="item.wkgId">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column align="left" label="时限成员">
                <template slot-scope="scope" >
                  <virtual-select class="virtual-select" :isUser="true" clearable multiple   :data="$store.getters.userList" v-model="timelimitInfo.workgroupArray[scope.$index].timelimitUserArray"   filterable :render="(data)=>$commonUtils.UserRender(data,this)" >
                  </virtual-select>
<!--                  <el-select v-model="timelimitInfo.workgroupArray[scope.$index].timelimitUserArray" placeholder="请选择时限成员" filterable-->
<!--                             multiple  clearable >-->
<!--                    <el-option-->
<!--                      v-for="item in queryGetUserList"-->
<!--                      :key="item.userId"-->
<!--                      :label="item.fullname"-->
<!--                      :value="item.userId">-->
<!--                      <UserIconAndUserName :user-id="item.userId"></UserIconAndUserName>-->
<!--                    </el-option>-->
<!--                  </el-select>-->
                </template>
              </el-table-column>

              <el-table-column label="操作"  align="left">
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click="timelimitInfo.workgroupArray.splice(scope.$index,1)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-row>
        <planList ref="planlist" :timelimitInfo="timelimitInfo" :queryGetUserList="queryGetUserList" @getData="getData"></planList>
        <!--<el-row>-->
          <!--<el-form-item label="提醒计划:">-->

          <!--</el-form-item>-->
        <!--</el-row>-->

        <el-row>
          <el-form-item label="备注:">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              placeholder="请输入内容"
              v-model="timelimitInfo.memo"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="上传时间:">
            {{new Date().toLocaleDateString()}}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="监督人:">
            <virtual-select class="virtual-select" :isUser="true" :disabled="!$store.getters.permissions.includes(249)&&timelimitInfo.kind==1" clearable multiple   :data="$store.getters.userList" v-model="timelimitInfo.watcherUserIdArray"   filterable :render="(data)=>$commonUtils.UserRender(data,this)" >
            </virtual-select>
<!--            <el-select :disabled="!$store.getters.permissions.includes(249)&&timelimitInfo.kind==1" v-model="timelimitInfo.watcherUserIdArray" placeholder="请选择监督员工" filterable-->
<!--                       multiple clearable >-->
<!--              <el-option-->
<!--                v-for="item in queryGetUserList"-->
<!--                :key="item.userId"-->
<!--                :label="item.fullname"-->
<!--                :value="item.userId">-->
<!--                <UserIconAndUserName :user-id="item.userId"></UserIconAndUserName>-->
<!--              </el-option>-->
<!--            </el-select>-->
          </el-form-item>
          <el-form-item label="创建人:">
            {{$store.getters.name}}
          </el-form-item>
        </el-row>
      </el-form>
      <div class="button_wrap" >
        <el-button class="exactButton" type="primary" @click="confirmExactButton" v-if="createState">创建</el-button>
        <el-button class="exactButton" type="primary" @click="upTimelimit()" v-if="!createState">保存</el-button>
        <el-button class="exactButton" type="primary" @click="upTimelimit(1)" v-if="!createState">复制</el-button>
        <el-button class="exactButton" style="margin-right: 20px" @click="cancel()">取消</el-button>
      </div>
      </section>
    </div>
</template>

<script>
import {addTimelimit,getCase,delTimelimit,upTimelimit,getTimelimitByCaseId,getTimelimitTypeAll,getTimelimitDetail,getTimelimitType, getAbslimitDate, getCaption, getTimelimitObj} from '@/api/caseList'
import { queryWorkgroupNames} from '@/api/systemList'
import {queryCaseWorkgroupUrl} from '@/api/caseDetail'
import { getUser } from '@/api/user'
import {getEndDate} from '@/utils'
import planList from "./components/planList";
export default {
  props:{
    isPatent: {
      type: Boolean,
      default: false
    },
    query:{

    },
    objInstId:{

    },
    objType:{

    },
    // noFilter:{
    //   default: false
    // }
  },
  name: "createTimeLimit",
  data(){
    var validateDate = (rule, value, callback) => {
      console.log(value)
      if (!value) {
        callback(new Error('请选择时间'));
      } else {
        callback();
      }
    };
    return{
      agentNums:'',
      caseData:[],
      tableTitleList:[{'title':'案件文号','value':'agentNum' },{'title':'客户','value':'custName' },{'title':'申请人','value':'appName'},{'title':'案件类型','value':'caseTypeStr'},{'title':'申请方向','value':'appFromto'},{'title': '申请日（优先权日）', 'value': 'appDate'},{'title':'权利号','value':'droitNumber'},{'title':'案件状态','value':'status'},{'title':'案件名称','value':'caseName'},{'title':'商标类别','value':'goodClasses'}],
      timelimitInfo:{
        abslimitDate: null,
        abslimitInternalDate: null,
        agentNum: '',
        appDate: null,
        appFromto: null,
        appState: null,
        applicantName: null,
        caption: null,
        caseDate: null,
        caseId: '',
        caseIdArray: null,
        caseName: null,
        caseStatus: null,
        caseTypeId: null,
        caseTypeName: null,
        cmplDate: null,
        createDate: null,
        custId: '',
        custName: null,
        dataSource: null,
        decription: null,
        droitNumber: null,
        execUserId: null,
        fromSource: null,
        goodClasses: null,
        isExamine: null,
        isRevocation: null,
        isSign: null,
        isSignStr: null,
        isSubmitWriteoff: null,
        kind: null,
        kindStr: null,
        materialArray: [],
        materialIds: null,
        memo: null,
        objInstId: null,
        objType: null,
        rempId: null,
        sendDate: null,
        senderUserId: null,
        senderUserName: null,
        stageName: null,
        timeWorks: null,
        timelimitWorkgroupArray: [],
        tltId: null,
        tltIdArray: null,
        tltIds: null,
        tltTypeId: null,
        tmGoodClasses: null,
        typeName: null,
        undoDate: null,
        undoUserId: null,
        upcaseVolstatusId: null,
        watcherUserIdArray: [],
        watcherUserIds: "",
        watcherUserNmaes: null,
        workgroupArray: [],
        wpmElemid: null,
        writeoffDate: null,
        writeoffDesc: null,
        writeoffState: null,
        writeoffStateStr: null,
        writeoffUserId: null,
        writeoffUserName: null,
      },
      getTimelimitTypeAllList:[],
      queryWorkgroupNamesList:[],
      queryGetUserList:[],
      createState:true,
      curCaseId:'',
      rules: {
        kind: [
          { required: true, message: '请选择时限种类', trigger: ['change','blur'] }
        ],
        tltTypeId: [
          { required: true, message: '请选择时限类型', trigger: ['change','blur'] }
        ],
        abslimitDate: [
          { type: 'date', required: true, message: '请选择绝限日期', trigger: 'blur' ,validator: validateDate,}
        ],
        abslimitInternalDate: [
          { type: 'date', required: true, message: '请选择内部期限', trigger: 'blur',validator: validateDate, }
        ]
      },
      hasCaseState:true
    }
  },
  computed:{
    isPatents(){
      return this.isPatent || this.timelimitInfo.tltTypeId&&this.getTimelimitTypeAllList.find(item=>this.timelimitInfo.tltTypeId==item.tltTypeId).memo == '专利';
    }
  },
  created(){
    if(this.query.agentNums){
      this.agentNums=this.query.agentNums.replace(/,/g,'\n')
      this.getCase()
    }
    if(!this.query.kind){
      this.getTimelimitTypeAll()
    }
    // if(this.timelimitInfo.watcherUserIdArray && this.timelimitInfo.watcherUserIdArray.length == 0 && this.timelimitInfo.watcherUserIds){
    //   this.timelimitInfo.watcherUserIdArray = this.timelimitInfo.watcherUserIds.split(',')
    // }
    this.queryWorkgroupNames()
    this.getUser()
  },
  components:{
    planList
  },
  methods:{
    absLimitChange(n){
      this.timelimitInfo.abslimitInternalDate=getEndDate(n,-1,'天')
    },
    getData(data){
      this.timelimitInfo.rempId=data.rempId
      this.timelimitInfo.planList=data.planList
    },
    getCase(){
      getCase({agentNums:this.agentNums}).then(res=>{
        this.caseData=res.data
        if(!this.curCaseId){
          this.editTimelimit(res.data[0])
        }
      })
    },
    delTimelimit(row){
      if(row.tltId){
        delTimelimit({tltId:row.tltId}).then(res=>{
          this.caseData=this.caseData.filter(item=>item.caseId!==row.caseId)
        })
      } else {
        this.caseData=this.caseData.filter(item=>item.caseId!==row.caseId)
      }
    },
    editTimelimit(row){
      this.curCaseId=row.caseId
      if(row.tltId){
        this.createState=false
        getTimelimitDetail({tltId:row.tltId}).then(res=>{
          this.timelimitInfo=res.data
        })
      } else {
        this.createState=true
        getTimelimitByCaseId({caseId:row.caseId}).then(res=>{
          if(this.query.kind){
            this.$refs.elRadio.$el.children[0].click()
            // this.timelimitInfo.kind = Number(this.$route.query.kind)
            // this.getTimelimitType(this.timelimitInfo.kind)
          }
          for(var key in res.data){
            if(res.data[key]){
               this.timelimitInfo[key]=res.data[key]

            }
          }
          this.timelimitInfo.taskType = row.taskType
         // =res.data
        })
      }
      if(this.timelimitInfo.watcherUserIdArray && this.timelimitInfo.watcherUserIdArray.length == 0 && this.timelimitInfo.watcherUserIds){
        this.timelimitInfo.watcherUserIdArray = this.timelimitInfo.watcherUserIds.split(',')
      }
    },
    getTimelimitTypeAll(){
      getTimelimitTypeAll().then(res=>{
        this.getTimelimitTypeAllList=res.data
      })
    },
    getTimelimitInfoWkgUsers(e,index){
      this.timelimitInfo.workgroupArray[index].timelimitUserArray = [...new Set(this.queryWorkgroupNamesList.find(item=>item.wkgId==e).wkgUsers.map(item=>item.userId))]
    },
    queryWorkgroupNames(){
    queryCaseWorkgroupUrl({status:1}).then(res => {
        if (res.success) {
          this.queryWorkgroupNamesList = res.data
        }
      })
    },
    getTimelimitType(kind){
      getTimelimitType({
        kind:kind,
        caseId:this.timelimitInfo.caseId
      }).then(res=>{
        this.timelimitInfo.tltTypeId=null
        this.getTimelimitTypeAllList=res.data
      })
      if(this.caseData.length){
        if(this.caseData[0].taskType == 1) {
          this.getCuiXin(kind)
        }else if(this.caseData[0].taskType == 4) {
          this.getWangZhenZhu(kind)
        }
      }
    },
    getWangZhenZhu(kind){
      // if(kind==1){
        if(this.timelimitInfo.watcherUserIdArray.includes(2837)) {
          this.timelimitInfo.watcherUserIdArray.splice(this.timelimitInfo.watcherUserIdArray.indexOf(2837), 1)
        }
        if(this.timelimitInfo.watcherUserIdArray.includes(4255)){
          return
        }
        //   return
        // }else {
        //   this.timelimitInfo.watcherUserIdArray = []
        this.timelimitInfo.taskType == 4 && this.timelimitInfo.watcherUserIdArray.push(4255)
        // }
      // }else if(kind==2){
        // if(this.timelimitInfo.tltTypeId==83){
        //   if(this.timelimitInfo.watcherUserIdArray.includes(3113)){
        //     return
        //   }else {
        //     this.timelimitInfo.watcherUserIdArray.push(3113)
        //   }
        // }else {
        //   if(this.timelimitInfo.watcherUserIdArray.includes(3113)){
        //     this.timelimitInfo.watcherUserIdArray.splice( this.timelimitInfo.watcherUserIdArray.indexOf(3113),1)
        //   }
        // }
      // }
    },
    getCuiXin(kind){
      if(kind==1){
        if(this.timelimitInfo.watcherUserIdArray.includes(2837)){
          return
        }else {
          this.timelimitInfo.watcherUserIdArray.push(2837)
        }
      }else if(kind==2){
        if(this.timelimitInfo.tltTypeId==83){
          if(this.timelimitInfo.watcherUserIdArray.includes(2837)){
            return
          }else {
            this.timelimitInfo.watcherUserIdArray.push(2837)
          }
        }else {
          if(this.timelimitInfo.watcherUserIdArray.includes(2837)){
            this.timelimitInfo.watcherUserIdArray.splice( this.timelimitInfo.watcherUserIdArray.indexOf(2837),1)
          }
        }
      }
    },
    async getAbslimitDate(sendDate,id,flag){
      if(flag){
        this.timelimitInfo.caseId&&id&& await getTimelimitObj({caseId: this.timelimitInfo.caseId, objInstId: this.timelimitInfo.objInstId, objType: this.timelimitInfo.objType, tltTypeId: this.timelimitInfo.tltTypeId}).then(res=>{
          this.timelimitInfo.abslimitDate = res.data.abslimitDate || ''
          this.timelimitInfo.sendDate = res.data.sendDate || ''
          // 对kind赋值
          this.timelimitInfo.kind = res.data.kind
        })
        if(this.getTimelimitTypeAllList.find(item=>this.timelimitInfo.tltTypeId==item.tltTypeId)){
           this.timelimitInfo.tltTypeId != 118 && (this.timelimitInfo.caption=this.getTimelimitTypeAllList.find(item=>this.timelimitInfo.tltTypeId==item.tltTypeId).typeName)
          this.timelimitInfo.rempId=this.getTimelimitTypeAllList.find(item=>this.timelimitInfo.tltTypeId==item.tltTypeId).rempId
        }
      }
      if(!this.timelimitInfo.kind){
        return
      } else {
        // this.isPatents ? this.getWangZhenZhu(this.timelimitInfo.kind) : this.getCuiXin(this.timelimitInfo.kind)
        if(this.caseData.length){
          if(this.caseData[0].taskType == 1) {
            this.getCuiXin(this.timelimitInfo.kind)
          }else if(this.caseData[0].taskType == 4) {
            this.getWangZhenZhu(this.timelimitInfo.kind)
          }
        }
      }
      if(!this.timelimitInfo.sendDate){
        return
      }
      if(!this.timelimitInfo.tltTypeId){
        return
      }
      getAbslimitDate({
        sendDate: this.timelimitInfo.sendDate,
        tltTypeId:this.timelimitInfo.tltTypeId,
        kind:this.timelimitInfo.kind,
        caption: this.timelimitInfo.tltTypeId == 118 ? this.timelimitInfo.caption : undefined, // 年费时限需要传该参数
        caseId: this.timelimitInfo.caseId
      }).then(res=>{
        this.timelimitInfo.abslimitDate=res.data.abslimitDate
        this.absLimitChange(this.timelimitInfo.abslimitDate)
        // this.timelimitInfo.abslimitInternalDate=res.data.abslimitInternalDate?res.data.abslimitInternalDate:
      })

    },
    addTimelimitWorkgroupArray(){
      this.timelimitInfo.workgroupArray.push({wrkId:null,timelimitUserArray:[]})
    },
    getUser(){
      this.queryGetUserList =this.$store.getters.userList
    },
    confirmExactButton(){
      this.$refs['submission'].validate((valid) => {
        if (valid) {
          if(this.createState){
            this.addTimelimit()
          } else {
            this.upTimelimit()
          }
        } else {
          this.$message.error('请填写必填项!')
          return false;
        }
      });
    },
    checkPlanUsers(){
      if (this.timelimitInfo.rempId && (!this.timelimitInfo.planList || this.timelimitInfo.planList && this.timelimitInfo.planList[0] && !this.timelimitInfo.planList[0].userIdList.length)) {
        this.$message.error("请增加提醒计划提醒人！")
        return false
      }
      return true
    },
    addTimelimit(){
    //  Promise.all(this.caseData.map(item=))
      this.timelimitInfo.caseIdArray=this.caseData.map(item=>item.caseId)
      this.timelimitInfo.objInstId=this.objInstId
      this.timelimitInfo.objType=this.objType
      //  校验提醒计划人
      if (!this.checkPlanUsers()) return
      addTimelimit(this.timelimitInfo).then(res=>{
        this.$message.success('创建成功')
        if(this.caseData.length>1){
          this.caseData.forEach(item=>{
            res.data.forEach(itm=>{
              if(item.caseId==itm.caseId){
                item.tltId=itm.tltId
              }
            })
          })
          this.createState=false
          let obj=this.caseData.find(item=>item.caseId===this.curCaseId)
          this.editTimelimit(obj)
        }else {
         this.cancel()
        }
      })
    },
    upTimelimit(e){
      if(e){
        this.timelimitInfo.tltIdArray=this.caseData.map(item=>item.tltId)
      } else {
        this.timelimitInfo.tltIdArray=this.timelimitInfo.tltId
      }
      upTimelimit(this.timelimitInfo).then(res=>{
        this.$message.success('修改成功')
      })
    },
    cancel(){
      this.$emit('cancel')
    }
  },
  watch:{
    'timelimitInfo.workgroupArray':{
      handler(n){
         if(n.find(item => item.timelimitUserArray)){
           this.$refs.planlist.changePeople(n)
         }
      },
      // immediate: true,
      deep: true
    },
    isPatents(n){
      n&&this.timelimitInfo.kind&&this.getWangZhenZhu(this.timelimitInfo.kind)

      !n&&this.timelimitInfo.watcherUserIdArray.includes(4255)&&(this.timelimitInfo.watcherUserIdArray.splice(this.timelimitInfo.watcherUserIdArray.indexOf(4255), 1))
    },
    'timelimitInfo.tltTypeId'(n){
      if(n == 118) {
        this.timelimitInfo.caseId&&(getCaption({caseId: this.timelimitInfo.caseId}).then(res=>{
          this.timelimitInfo.caption = res.data.caption
          this.timelimitInfo.abslimitDate=res.data.abslimitDate
          this.timelimitInfo.sendDate=res.data.sendDate
          // this.getAbslimitDate(this.timelimitInfo.sendDate,n,true)
        }))
      }else{
        // this.getAbslimitDate(this.timelimitInfo.sendDate,n,true)
      }
    },
    'timelimitInfo.abslimitDate'(n){
      n&&!this.timelimitInfo.abslimitInternalDate&&(
        this.timelimitInfo.abslimitInternalDate=getEndDate(n,-1,'天')
      )
    },
    query:{
      handler(n,o){
        if(this.query.agentNums){
          this.agentNums=this.query.agentNums.replace(/,/g,'\n')
          this.curCaseId=''
          this.timelimitInfo={
            abslimitDate: null,
              abslimitInternalDate: null,
              agentNum: '',
              appDate: null,
              appFromto: null,
              appState: null,
              applicantName: null,
              caption: null,
              caseDate: null,
              caseId: '',
              caseIdArray: null,
              caseName: null,
              caseStatus: null,
              caseTypeId: null,
              caseTypeName: null,
              cmplDate: null,
              createDate: null,
              custId: '',
              custName: null,
              dataSource: null,
              decription: null,
              droitNumber: null,
              execUserId: null,
              fromSource: null,
              goodClasses: null,
              isExamine: null,
              isRevocation: null,
              isSign: null,
              isSignStr: null,
              isSubmitWriteoff: null,
              kind: null,
              kindStr: null,
              materialArray: [],
              materialIds: null,
              memo: null,
              objInstId: null,
              objType: null,
              rempId: null,
              sendDate: null,
              senderUserId: null,
              senderUserName: null,
              stageName: null,
              timeWorks: null,
              timelimitWorkgroupArray: [],
              tltId: null,
              tltIdArray: null,
              tltIds: null,
              tltTypeId: null,
              tmGoodClasses: null,
              typeName: null,
              undoDate: null,
              undoUserId: null,
              upcaseVolstatusId: null,
              watcherUserIdArray: [],
              watcherUserIds: "",
              watcherUserNmaes: null,
              workgroupArray: [],
              wpmElemid: null,
              writeoffDate: null,
              writeoffDesc: null,
              writeoffState: null,
              writeoffStateStr: null,
              writeoffUserId: null,
              writeoffUserName: null,
          },
          this.getCase()
        }
      },
      deep:true
    },
    // 'timelimitInfo.abslimitDate'(n){
    //   if(n){
    //     this.timelimitInfo.abslimitInternalDate = getEndDate(n,0,-1)
    //   }
    // },
    'caseData.length'(n){
      if(n==0){
        this.curCaseId=''
        this.timelimitInfo.caseId=''
        this.timelimitInfo.agentNum=''
        this.createState=true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  aside{
    &>div{
      display: flex;
      align-items: center;
      .el-textarea{
        width: 80%;
      }
      .el-button{
        margin-left: 20px;
        width: 67px;
        height: 32px;
        padding: 0;
        color: #409EFF;
        border: 1px solid #409EFF;
      }
    }
    span{
      display: block;
      margin: 10px 0;
      font-size: 12px;
      color: #FB9608;
    }

  }
  .el-form {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    padding: 20px;
    margin:0 20px ;
    .el-select,.el-input,.el-date-picker,.el-textarea{
      width: 95%;
    }
    .el-textarea{
      margin: 10px 0;
    }
    /deep/ input{
      height: 28px;
    }
    /deep/ .el-input__icon{
      line-height: 28px;
    }
    .el-row{
      min-height: 30px;
      width: 100%;
      display: flex;
     // align-items: center;
      .el-form-item{
        width: 100%;
        display: flex;
        border: 1px solid #EBEEF5;
        border-bottom: 0;
        margin-bottom: 0;
        /deep/ .el-form-item__label{
          background: #f5f7fa;
        }
        /deep/ .el-form-item__content{
          margin-left: 0 !important;
          padding-left: 10px;
          background: #fff;
          flex: 1;
        }

      }
      .sendDate /deep/{
        .el-form-item__label,input{
          color: blue;
        }
      }
      .abslimitDate /deep/{
        .el-form-item__label,input{
          color: red;
        }
      }
      .small-el-form-item-prev:before{
        content: '';
        width: 50%;
        height: 1px;
        background: #EBEEF5;
        position: absolute;
        bottom: -1px;
        right: 0;
        z-index: 1;
      }
      .small-el-form-item{
        position: relative;
        width: 50%;
        /deep/ .el-form-item__content{
          flex: 1;
          .pad20{
            padding-left: 20px;
          }
        }
      }
    }
    .el-row:nth-last-child(1){
      .el-form-item{
        border: 1px solid #EBEEF5;
      }
    }
  }
  .button_wrap {
    width: 100%;
    display: flex;
    height: 85px;
    align-items: center;
    justify-content: flex-end;
    .el-button{
      margin-right: 30px;
    }
  }
  /deep/ .el-form-item__error{
    position: relative;
    top: 0;
  }
  header{
    height: 62px;
    line-height:62px;
    font-size:22px;
    font-family:SourceHanSansCN-Normal;
    font-weight:400;
    color:rgba(51,51,51,1);
  }
  .title{
    font-size: 16px;
    color: #6AA7FF;
    height: 50px;
    line-height: 50px;
    font-weight: normal;
  }
  .el-table.el-table1{
    width: auto;
    /deep/ tr:nth-of-type(1){
      th{
        background: rgba(242, 242, 242, 1);
      }
    }
  }
  .virtual-select/deep/{
    .jh-virtual-select{
      height: auto;
      width: 100%;
    }
    .jh-virtual-select>.content .inner-input{
      flex: 1;
    }
  }
  .el-table{
    /*overflow: visible;*/
    /deep/ .cell{
      /*overflow: visible;*/

    }
    /deep/.el-date-editor{
      width: 100%;
      .el-icon-date{
        display: none;

      }
      .el-input__inner{
        padding: 0;
        padding-left: 10px;
      }
    }
    /deep/ .el-table__body-wrapper{
      /*overflow: visible;*/
    }
    /deep/ th{
      /*color: rgba(51, 51, 51, 1);*/
    }

  }
  >>>.el-table1 {
    height: auto;
    .cell {
      max-height: 70px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      overflow: hidden;
    }
  }

</style>
