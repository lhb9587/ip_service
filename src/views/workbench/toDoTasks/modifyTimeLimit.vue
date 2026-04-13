<template>
  <div style="padding: 20px">
    <header>修改时限</header>
    <h4 class="title">案件信息</h4>
    <el-form  ref="submission"   label-width="206px"  >
      <el-row style="border-right: 1px solid #EBEEF5;border-top: 1px solid #EBEEF5">
        <el-form-item label="案件文号:"  class="small-el-form-item" style="border:0">
          <el-input type="text" v-model="timelimitInfo.agentNum" @change="changeAgentNum"></el-input>
<!--          {{timelimitInfo.agentNum}}-->
        </el-form-item>
      </el-row>
      <el-row >
        <el-form-item label="客户:" >
          <el-select
            v-model="timelimitInfo.custId"
            ref="custSelect"
            :disabled="!$store.getters.permissions.includes(242)"
            filterable
            clearable
            remote
            reserve-keyword
            placeholder="请输入关键词"
            :remote-method="queryCustomerNameId"
          >
            <el-option
              v-for="item in queryCustomerNameIdList"
              :key="item.custId"
              :label="item.fullname"
              :value="item.custId"
            >
            </el-option>
          </el-select>
<!--          {{timelimitInfo.custName}}-->
        </el-form-item>
        <el-form-item label="申请人:"  >
          {{timelimitInfo.applicantName}}
        </el-form-item>
      </el-row>
      <el-row >
        <el-form-item label="案件类型:"  >
          {{timelimitInfo.caseTypeName}}
        </el-form-item>
        <el-form-item label="申请方向:"  >
          {{timelimitInfo.appFromto}}
        </el-form-item>
      </el-row>
      <el-row >
        <el-form-item label="权利号:"  >
          {{timelimitInfo.droitNumber}}
        </el-form-item>
        <el-form-item label="案件阶段:"  >
          {{timelimitInfo.stageName}}
        </el-form-item>
      </el-row>
      <el-row >
        <el-form-item label="案件名称:"  >
          {{timelimitInfo.caseName}}
        </el-form-item>
        <el-form-item label="商标类别:"  >
          {{timelimitInfo.goodClasses}}
        </el-form-item>
      </el-row>
      <el-row >
        <el-form-item label="申请日（优先权日）:"  >
          {{timelimitInfo.appDate}}
        </el-form-item>
        <el-form-item label="撰稿人:"  >
          {{timelimitInfo.actualAttorney}}
        </el-form-item>
      </el-row>
    </el-form>
  <h4 class="title">时限信息</h4>
  <el-form  ref="submission" :rules="rules" :model="timelimitInfo" label-width="206px"  >
    <!--<el-row >-->
      <!--<el-form-item label="案件文号:"  class="small-el-form-item" style="border:0">-->
        <!--{{timelimitInfo.agentNum}}-->
      <!--</el-form-item>-->
    <!--</el-row>-->
    <el-row style="border-right: 1px solid #EBEEF5;border-top: 1px solid #EBEEF5">
      <el-form-item label="时限种类:" prop="kind">
        <el-radio-group v-model="timelimitInfo.kind" @change="getTimelimitType">
          <el-radio  :label="1" v-if="$store.getters.permissions.includes(125)">官方时限</el-radio>
          <el-radio  :label="2" v-if="$store.getters.permissions.includes(126)">内部时限</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="时限类型:" prop="tltTypeId" >
        <el-select v-model="timelimitInfo.tltTypeId" @change="changeTltTypeId" placeholder="请选择时限类型" filterable
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
      <el-form-item label="详情描述:" >
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
      <el-form-item label="计算基准日期:" class="sendDate">
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
          @change="absLimitChange"
          type="date"
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
        <template slot="label">
          <span style="display: block">时限工作组</span>
          <el-button  size="small"  @click="addTimelimitWorkgroupArray" type="primary">添加</el-button>
        </template>
        <el-table :data="timelimitInfo.workgroupArray" border >
          <el-table-column align="left" label="时限工作组">
            <template slot-scope="scope">
              <el-select v-model="timelimitInfo.workgroupArray[scope.$index].wrkId" placeholder="请选择时限工作组" filterable
                         clearable @change="(e)=>getTimelimitInfoWkgUsers(e,scope.$index)">
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
              <virtual-select class="virtual-select" @change="changePlanPeople" :isUser="true" clearable multiple   :data="$store.getters.userList" v-model="timelimitInfo.workgroupArray[scope.$index].timelimitUserArray"   filterable :render="(data)=>$commonUtils.UserRender(data,this)" >
              </virtual-select>
<!--              <el-select v-model="timelimitInfo.workgroupArray[scope.$index].timelimitUserArray" placeholder="请选择时限成员" filterable-->
<!--                         multiple  clearable >-->
<!--                <el-option-->
<!--                  v-for="item in queryGetUserList"-->
<!--                  :key="item.userId"-->
<!--                  :label="item.fullname"-->
<!--                  :value="item.userId">-->
<!--                  <UserIconAndUserName :user-id="item.userId"></UserIconAndUserName>-->
<!--                </el-option>-->
<!--              </el-select>-->
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
    <planList ref="planlist" :isEdit="true" :timelimitInfo="timelimitInfo" :queryGetUserList="queryGetUserList" @getData="getData"></planList>
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
        {{timelimitInfo.sendDate?timelimitInfo.sendDate:new Date().toLocaleDateString()}}
      </el-form-item>
    </el-row>
    <el-row>
      <el-form-item label="监督人:">
        <virtual-select class="virtual-select" :isUser="true" :disabled="!$store.getters.permissions.includes(249)&&timelimitInfo.kind==1" clearable multiple   :data="$store.getters.userList" v-model="timelimitInfo.watcherUserIdArray"   filterable :render="(data)=>$commonUtils.UserRender(data,this)" >
        </virtual-select>
<!--        <el-select :disabled="!$store.getters.permissions.includes(249)&&timelimitInfo.kind==1" v-model="timelimitInfo.watcherUserIdArray" placeholder="请选择监督员工" filterable-->
<!--                   multiple clearable >-->
<!--          <el-option-->
<!--            v-for="item in queryGetUserList"-->
<!--            :key="item.userId"-->
<!--            :label="item.fullname"-->
<!--            :value="item.userId">-->
<!--            <UserIconAndUserName :user-id="item.userId"></UserIconAndUserName>-->
<!--          </el-option>-->
<!--        </el-select>-->
      </el-form-item>
      <el-form-item label="创建人:">
        {{timelimitInfo.senderUserName?timelimitInfo.senderUserName:$store.getters.name}}
      </el-form-item>
    </el-row>
  </el-form>
    <h4 class="title">时限核销情况</h4>
    <el-form    label-width="206px"  >
      <el-row >
        <el-form-item label="核销状态:"  >
          {{timelimitInfo.writeoffStateStr}}
        </el-form-item>
        <el-form-item label="时限状态:"  >
          {{timelimitInfo.isSignStr}}
        </el-form-item>

      </el-row>
      <el-row>
        <el-form-item label="处理方式:">
          {{timelimitInfo.operation}}
        </el-form-item>
        <el-form-item label="核销理由:">
          {{timelimitInfo.writeoffDesc}}
        </el-form-item>
      </el-row>
      <el-row >
        <el-form-item label="核销人:"  >
          {{timelimitInfo.writeoffUserName}}
        </el-form-item>
        <el-form-item label="核销日期:"  >
          {{timelimitInfo.writeoffDate}}
        </el-form-item>
      </el-row>
      <el-row >
        <el-form-item label="时限转案文号:"  >
          {{timelimitInfo.changeAgentNum}}
        </el-form-item>
      </el-row>
    </el-form>

    <div class="button_wrap" v-if="!this.tltId">
    <el-button class="exactButton" type="primary" @click="confirmExactButton">确定</el-button>
    <el-button class="exactButton" style="margin-right: 20px" @click="$router.history.go(-1)">取消</el-button>
  </div>
    <div class="button_wrap" v-else>
      <el-button class="exactButton" type="primary" @click="confirmExactButton">确定</el-button>
      <el-button class="exactButton" style="margin-right: 20px" @click="()=>{$emit('cancelModify')}">取消</el-button>
    </div>
</div>
</template>

<script>
import {upTimelimit,getTimelimitTypeAll,getTimelimitDetail,getTimelimitType, getAbslimitDate,getCaseInfo,queryCustomerNameId, getCaption} from '@/api/caseList'
import { queryWorkgroupNames} from '@/api/systemList'
import { getUser } from '@/api/user'
import {getEndDate} from '@/utils'
import {queryCaseWorkgroupUrl} from '@/api/caseDetail'
import planList from "./components/planList";

export default {
  name: "modifyTimeLimit",
  components:{
    planList
  },
  props: {
    tltId: {
      type: Number
    }
  },
  data(){
    var validateDate = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请选择时间'));
      } else {
        callback();
      }
    };
    return{
      agentNums:'',
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
      queryCustomerNameIdList:[],
      getTimelimitTypeAllList:[],
      queryWorkgroupNamesList:[],
      queryGetUserList:[],
      createState:true,
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
      }
    }
  },
  created(){
    this.getTimelimitDetail()
    this.getTimelimitTypeAll()
    this.queryWorkgroupNames()
    this.getUser()
  },
  methods: {
    changeTltTypeId(n){
      if(n == 118) {
        this.timelimitInfo.caseId&&(getCaption({caseId: this.timelimitInfo.caseId || ''}).then(res=>{
          this.timelimitInfo.caption = res.data.caption
          this.timelimitInfo.abslimitDate=res.data.abslimitDate
          this.timelimitInfo.sendDate=res.data.sendDate
          this.getAbslimitDate(this.timelimitInfo.sendDate,n,false)
        }))
      }else{
        this.getAbslimitDate(this.timelimitInfo.sendDate,n,true)
      }
    },
    getData(data){
      this.timelimitInfo.rempId=data.rempId
      this.timelimitInfo.planList=data.planList
    },
    absLimitChange(n){
      this.timelimitInfo.abslimitInternalDate=getEndDate(n,-1,'天')
    },
    changeAgentNum(e){
      if(!e){
        this.timelimitInfo.agentNum=''
        this.timelimitInfo.caseId=null
        return
      }
      getCaseInfo({agentNum:e}).then(res=>{
        if(!res.data.length){
          this.timelimitInfo.agentNum=''
          this.timelimitInfo.caseId=null
          this.$message.error('该案件有误')
        } else {
          if(res.data.map(item=>item.agentNum).includes(e)){
            let data= res.data.find(item=>item.agentNum==e)
            this.timelimitInfo.caseId = data.caseId
            // this.timelimitInfo.custName=data.custName
            this.timelimitInfo.applicantName=data.appName
            this.timelimitInfo.caseTypeName=data.caseTypeStr
            this.timelimitInfo.goodClasses=data.goodClasses
            this.timelimitInfo.appFromto=data.appFromto
            this.timelimitInfo.droitNumber=data.droitNumber
            this.timelimitInfo.caseName =data.caseName
            this.timelimitInfo.stageName=data.stageName
          }else{
            this.timelimitInfo.agentNum=''
            this.timelimitInfo.caseId=null
            this.$message.error('该案件有误')
          }
        }
      }).catch(()=>{
        this.timelimitInfo.agentNum=''
        this.timelimitInfo.caseId=null
      })
    },
    getTimelimitTypeAll(){
      getTimelimitTypeAll().then(res=>{
        this.getTimelimitTypeAllList=res.data
      })
    },
    async changePlanPeople(){
      if(this.timelimitInfo.workgroupArray.find(item => item.timelimitUserArray)){
         this.$refs.planlist.changePeople(this.timelimitInfo.workgroupArray)
       }
    },
    getTimelimitInfoWkgUsers(e,index){
      this.timelimitInfo.workgroupArray[index].timelimitUserArray=[...new Set(this.queryWorkgroupNamesList.find(item=>item.wkgId==e).wkgUsers.map(item=>item.userId))]
      this.changePlanPeople()
    },
    queryWorkgroupNames(){
      queryCaseWorkgroupUrl({status:1}).then(res => {
        if (res.success) {
          this.queryWorkgroupNamesList = res.data
        }
      })
    },
    getTimelimitType(kind, notClear){
      getTimelimitType({
        kind:kind,
        caseId:this.timelimitInfo.caseId
      }).then(res=>{
        if (!notClear) {
         this.timelimitInfo.tltTypeId = null
        }
        this.getTimelimitTypeAllList = res.data
      })
    },
    queryCustomerNameId(query) {
      if (!this.loading) {
        if (query !== '') {
          this.loading = true;
          setTimeout(() => {
            queryCustomerNameId({curStatus: '4,5,6', pageNo: 0, pageSize: 100, keyword: query }).then(res => {
              this.queryCustomerNameIdList = res.data
              this.loading = false;
            })
          }, 200);
        }
      } else {
        this.queryCustomerNameIdList = [];
      }
    },
    getTimelimitDetail(){
        getTimelimitDetail({tltId: this.$route.params&&this.$route.params.tltId || this.tltId}).then(res=>{
          this.queryCustomerNameIdList=[{custId:Number(res.data.custId),fullname:res.data.custName}]
          this.timelimitInfo=res.data
          if(this.timelimitInfo.watcherUserIdArray && this.timelimitInfo.watcherUserIdArray.length == 0 && this.timelimitInfo.watcherUserIds){
            this.timelimitInfo.watcherUserIdArray = this.timelimitInfo.watcherUserIds.split(',')
          }
          if (this.timelimitInfo.kind) {
            this.timelimitInfo.kind && this.getTimelimitType(this.timelimitInfo.kind, true)
          } else {
            this.getTimelimitTypeAll()
          }
        })
    },
    getAbslimitDate(sendDate,id,flag){
      if(flag){
        if(this.getTimelimitTypeAllList.find(item=>this.timelimitInfo.tltTypeId==item.tltTypeId)){
          ( this.timelimitInfo.tltTypeId != 118) && (this.timelimitInfo.caption=this.getTimelimitTypeAllList.find(item=>this.timelimitInfo.tltTypeId==item.tltTypeId).typeName)
        }
      }
      if(!sendDate){
        return
      }
      if(!this.timelimitInfo.kind){
        return
      }
      if(!this.timelimitInfo.tltTypeId){
        return
      }
      getAbslimitDate({
        sendDate,
        tltTypeId:this.timelimitInfo.tltTypeId,
        kind:this.timelimitInfo.kind,
        caption: this.timelimitInfo.tltTypeId == 118 ? this.timelimitInfo.caption : undefined, // 年费时限需要传该参数
        caseId: this.timelimitInfo.caseId
      }).then(res=>{
        this.timelimitInfo.abslimitDate=res.data.abslimitDate
        this.absLimitChange(this.timelimitInfo.abslimitDate)
      })
    },
    addTimelimitWorkgroupArray(){
      this.timelimitInfo.workgroupArray.push({wrkId:null,timelimitUserArray:[]})
    },
    getUser(){
      this.queryGetUserList =this.$store.getters.userList
    },
    confirmExactButton(){
      // if(this.timelimitInfo.kind == 2 && !this.timelimitInfo.abslimitInternalDate){
      //   this.$message.error('请填写内部期限')
      //   return
      // }
      this.$refs['submission'].validate(async (valid) => {
        if (valid) {
          await this.changePlanPeople()
          this.upTimelimit()
        } else {
          this.$message.error('请填写必填项')
          return false;
        }
      });
    },
    checkPlanUsers(){
        if (this.timelimitInfo.rempId && (!this.timelimitInfo.planList || (this.timelimitInfo.planList && !this.timelimitInfo.planList.length) || this.timelimitInfo.planList &&this.timelimitInfo.planList[0] && !this.timelimitInfo.planList[0].userIdList.length)) {
          this.$message.error("请增加提醒计划提醒人！")
          return false
        }
        return true
      },
    upTimelimit(){
      //  校验提醒计划人
      if (!this.checkPlanUsers()) return
      upTimelimit(this.timelimitInfo).then(res=>{
        if(this.tltId){
          this.$emit('modifyDone')
        }else{
          this.$router.history.go(-1)
        }
      })
    }
  },
  watch:{
    tltId(n){
      if(n){
        this.getTimelimitDetail()
        // this.getTimelimitTypeAll()
        this.queryWorkgroupNames()
        this.getUser()
      }
    },
    // 'timelimitInfo.workgroupArray':{
    //   handler(n){
    //      if(n.find(item => item.timelimitUserArray&&item.timelimitUserArray.length)){
    //        this.$refs.planlist.changePeople(n)
    //      }
    //   },
    //   // immediate: true,
    //   deep: true
    // },
    'timelimitInfo.abslimitDate'(n){
      n&&!this.timelimitInfo.abslimitInternalDate&&(
        this.timelimitInfo.abslimitInternalDate=getEndDate(n,-1,'天')
      )
    }
  }
}
</script>

<style lang="scss" scoped>
  aside{
    display: flex;
    &>div>.el-input{
      display: block;
    }
  }
  .el-form {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    /*padding: 20px;*/
    /*margin:0 20px ;*/
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
          flex-shrink: 0;
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
</style>
