<template>
  <div style="padding: 20px">
    <header>查看时限</header>
    <h4 class="title">案件信息</h4>
    <el-form  ref="submission"   label-width="206px"  >
      <el-row style="border-right: 1px solid #EBEEF5;border-top: 1px solid #EBEEF5">
        <el-form-item label="案件文号:"  class="small-el-form-item" style="border:0">
          <span style="cursor:pointer;color: #409EFF;" @click="seeCaseDetail">{{timelimitInfo.agentNum}}</span>
        </el-form-item>
      </el-row>
      <el-row >
        <el-form-item label="客户:"  >
          {{timelimitInfo.custName}}
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
    </el-form>
    <h4 class="title">时限信息</h4>
    <el-form  ref="submission" :model="timelimitInfo" label-width="206px"  >
      <el-row style="border-right: 1px solid #EBEEF5;border-top: 1px solid #EBEEF5">
        <el-form-item label="时限种类:" prop="kind">
          <span v-if="timelimitInfo.kind===1">官方时限</span>
          <span v-if="timelimitInfo.kind===2">内部时限</span>
        </el-form-item>
        <el-form-item label="时限类型:" prop="tltTypeId" >
          <span>{{getTimelimitTypeAllList.find(item=>item.tltTypeId===timelimitInfo.tltTypeId)?getTimelimitTypeAllList.find(item=>item.tltTypeId===timelimitInfo.tltTypeId).typeName:''}}</span>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="时限内容:" >
         <span>{{timelimitInfo.caption}}</span>
        </el-form-item>
        <el-form-item label="详细说明:" >
          <span>{{timelimitInfo.decription}}</span>
        </el-form-item>
      </el-row>
      <el-row >
        <el-form-item label="计算基准日期:" class="sendDate">
         <span> {{timelimitInfo.sendDate}}</span>
        </el-form-item>
        <el-form-item label="绝限日期:" prop="abslimitDate"  class="abslimitDate">
         <span>{{timelimitInfo.abslimitDate}}</span>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="内部期限:"  prop="abslimitInternalDate">
          <span>{{timelimitInfo.abslimitInternalDate}}</span>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="时限工作组:" >
          <div style="width: 100%;position: relative;padding: 10px 0">
            <el-table :data="timelimitInfo.workgroupArray" border style="width: 99%">
              <el-table-column align="left" label="时限工作组">
                <template slot-scope="scope">
                  <span>
                    {{queryWorkgroupNamesList.find(item=>item.wkgId===timelimitInfo.workgroupArray[scope.$index].wrkId)?queryWorkgroupNamesList.find(item=>item.wkgId===timelimitInfo.workgroupArray[scope.$index].wrkId).groupName:''}}</span>
                </template>
              </el-table-column>
              <el-table-column align="left" label="时限员工">
                <template slot-scope="scope" >
                  {{getTimelimitUser(timelimitInfo.workgroupArray[scope.$index].timelimitUserArray,'queryGetUserList')}}
<!--                  {{queryGetUserList.length?timelimitInfo.workgroupArray[scope.$index].timelimitUserArray.map(item=>queryGetUserList.find(itm=>item===itm.userId).fullname).join('、'):''}}-->
                  <!--<el-select v-model="timelimitInfo.workgroupArray[scope.$index].timelimitUserArray" placeholder="请选择时限员工" filterable-->
                  <!--multiple  clearable >-->
                  <!--<el-option-->
                  <!--v-for="item in queryGetUserList"-->
                  <!--:key="item.userId"-->
                  <!--:label="item.fullname"-->
                  <!--:value="item.userId">-->
                  <!--</el-option>-->
                  <!--</el-select>-->
                </template>
              </el-table-column>
              <!--<el-table-column label="操作"  align="left">-->
              <!--<template slot-scope="scope">-->
              <!--<el-button type="text" size="small" @click="timelimitInfo.workgroupArray.splice(scope.$index,1)">删除</el-button>-->
              <!--</template>-->
              <!--</el-table-column>-->
            </el-table>
          </div>

        </el-form-item>
      </el-row>
      <planList :type="true" :timelimitInfo="timelimitInfo" :queryGetUserList="queryGetUserList" ></planList>
      <el-row>
        <el-form-item label="备注:">
          <span>{{timelimitInfo.memo}}</span>
        </el-form-item>
        <el-form-item label="上传日期:">
          {{timelimitInfo.createDate?timelimitInfo.createDate:''}}
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="监督人:">
          <span>{{getTimelimitUser(timelimitInfo.watcherUserIdArray,'queryGetUserList')}}</span>
        </el-form-item>
        <el-form-item label="创建人:">
          {{timelimitInfo.senderUserName?timelimitInfo.senderUserName:''}}
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

    <div class="button_wrap" >
<!--      <el-button class="exactButton" type="primary" @click="takeModify($route.params.tltId)">修改</el-button>-->
      <el-button v-if="!seeTltId" class="exactButton" style="margin-right: 20px" @click="$router.history.go(-1)">返回</el-button>
      <el-button v-else class="exactButton" style="margin-right: 20px" @click="$emit('closeTimeLimit')">关闭</el-button>
    </div>
  </div>
</template>

<script>
  import planList from "./components/planList";
import {upTimelimit,getTimelimitTypeAll,getTimelimitDetail,getTimelimitType} from '@/api/caseList'
import { queryWorkgroupNames} from '@/api/systemList'
import { getUser } from '@/api/user'
import {getEndDate} from '@/utils'
export default {
  name: "seeTimeLimit",
  components:{
    planList
  },
  props: {
    seeTltId:{
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
      timelimitInfo:{watcherUserIdArray:[]},
      getTimelimitTypeAllList:[],
      queryWorkgroupNamesList:[],
      queryGetUserList:[],
      createState:true,
    }
  },
  created(){
    this.getTimelimitDetail()
    this.getTimelimitTypeAll()
    this.queryWorkgroupNames()
    this.getUser()
  },
  methods: {
    seeCaseDetail(){
      window.open('/#/workbench/case/seeCaseDetail/'+this.timelimitInfo.caseId+`?taskType=${this.timelimitInfo.taskType || 1}`)
    },
    getTimelimitTypeAll(){
      getTimelimitTypeAll().then(res=>{
        this.getTimelimitTypeAllList=res.data
      })
    },
    queryWorkgroupNames(){
      queryWorkgroupNames().then(res => {
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
    },
    getTimelimitDetail(){
      getTimelimitDetail({tltId: this.$route.params.tltId || this.seeTltId}).then(res=>{
        this.timelimitInfo=res.data
        if(this.timelimitInfo.watcherUserIdArray && this.timelimitInfo.watcherUserIdArray.length == 0 && this.timelimitInfo.watcherUserIds){
          this.timelimitInfo.watcherUserIdArray = this.timelimitInfo.watcherUserIds.split(',')
        }
      })
    },
    getUser(){
      this.queryGetUserList = this.$store.getters.userList
    },
    confirmExactButton(){
      this.$refs['submission'].validate((valid) => {
        if (valid) {
          this.upTimelimit()
        } else {
          return false;
        }
      });
    },
    getTimelimitUser(list,prop){
      if(this[prop].length){
        return  list.map(item=>{
          if(this[prop].find(itm=>item===itm.userId)){
            return this[prop].find(itm=>item===itm.userId).fullname
          }else {
            return false
          }
        }).filter(item=>!!item).join('、')
      }
    },
    takeModify(tltId){
      this.$router.push(`/workbench/modifyTimeLimit/${tltId}`)
    },
    upTimelimit(){
      upTimelimit(this.timelimitInfo).then(res=>{
        this.$router.history.go(-1)
      })
    }
  },
  watch:{
    seeTltId(n){
      if(n){
        this.getTimelimitDetail()
        this.getTimelimitTypeAll()
        this.queryWorkgroupNames()
        this.getUser()
      }
    },
    // 'timelimitInfo.abslimitDate'(n){
    //   if(n){
    //     this.timelimitInfo.abslimitInternalDate=getEndDate(n,0,-1)
    //   }
    // }
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
  .el-form /deep/{
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
    input{
      height: 28px;
    }
     .el-input__icon{
      line-height: 28px;
    }
    .el-row{
      min-height: 30px;
      width: 100%;
      display: flex;
      //align-items: center;
      .el-form-item{
        width: 100%;
        display: flex;
        border: 1px solid #EBEEF5;
        border-bottom: 0;
        margin-bottom: 0;
        .el-form-item__label{
          background: #f5f7fa;
        }
         .el-form-item__content{
          margin-left: 0 !important;
          padding-left: 10px;
          background: #fff;
          flex: 1;
        }

      }
      .sendDate {
        .el-form-item__label,input, span{
          color: blue;
        }
      }
      .abslimitDate {
        .el-form-item__label,input, span{
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
         .el-form-item__content{
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
</style>
