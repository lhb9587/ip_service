<template>
  <el-menu @click.native="updateMailList" :popper-append-to-body="false" :default-active="activeIndex" v-clickoutside="clickOutside" :default-openeds="defaultOpenedsArray" class="messageNotice" mode="horizontal" @select="handleSelect" menu-trigger="click">
    <el-submenu index="1" :popper-append-to-body="false">
      <template slot="title">
        消息
       <div class="rightp-item animated" v-if="reportedTemporarily&&reportedTemporarily.length || rightNum ||caseWorkgroupChangeList.length"  :class="reportedTemporarily.length||caseWorkgroupChangeList.length|| rightNum?'twinkling':''">
         <img src="@/assets/message.png"   alt="">
       </div>
      </template>
<!--      <el-menu-item v-if="!total" index="1-1" >邮件通知</el-menu-item>-->
      <el-submenu index="1-1" :popper-append-to-body="false" v-if="total" >
        <template slot="title">邮件通知 <div class="toDoTaskNotice">{{total}}</div></template>
        <el-menu-item class="flexBox" v-for="item in reportedTemporarily" :index="item" >
          <div v-if="item.status!=1&&item.createFlag==0">{{item.agentNum}}等{{item.caseCount}}个{{item.mailTypeDesc}}</div>
          <div v-if="item.mailPath&&item.createFlag==1" title="该文件较大需要手动发送" style="color:#007aff">{{item.agentNum}}等{{item.caseCount}}个{{item.mailTypeDesc}}</div>
          <div v-if="item.status==1" :title="item.failReason" style="color: #ff0000">{{item.agentNum}}等{{item.caseCount}}个{{item.mailTypeDesc}}</div>
<!--          <i @click.stop="doEditInOffice(item.mailPath)" class="el-icon-view"></i>-->
        </el-menu-item>
        <el-pagination
          v-show="total>pageSize"
          @current-change="currentChange"
          :page-size="pageSize"
          :pager-count="5"
          layout="prev, pager, next"
          :total="total"
         >
        </el-pagination>
      </el-submenu>
<!--      <el-menu-item v-if="!caseWorkgroupChangeList.length" index="1-2" >工作组消息</el-menu-item>-->
      <el-submenu index="1-2" :popper-append-to-body="false" v-if="caseWorkgroupChangeList.length" >
        <template slot="title">工作组消息 <div class="toDoTaskNotice">{{caseWorkgroupChangeList.length}}</div></template>
        <el-menu-item class="flexBox" v-for="item in caseWorkgroupChangeList" :index="item" ><div>{{item.wkgName}}{{item.success?'更新成功':'更新失败'}}</div>
          <!--          <i @click.stop="doEditInOffice(item.mailPath)" class="el-icon-view"></i>-->
        </el-menu-item>
      </el-submenu>
      <el-menu-item v-if="rightNum" index="1-3" @click.native="goToDoTask">任务提醒<div class="toDoTaskNotice">{{rightNum}}</div></el-menu-item>
<!--      <el-submenu index="1-3" :popper-append-to-body="false" v-else >-->
<!--        <template slot="title">任务提醒 <div class="toDoTaskNotice">{{queryToDoTaskList.length}}</div></template>-->
<!--&lt;!&ndash;        <el-menu-item class="flexBox" v-for="(item, index) in queryToDoTaskList" :index="item.caseId" @click="remindClick(item)"><div>{{item.taskName}}</div>&ndash;&gt;-->
<!--          &lt;!&ndash;          <i @click.stop="doEditInOffice(item.mailPath)" class="el-icon-view"></i>&ndash;&gt;-->
<!--&lt;!&ndash;        </el-menu-item>&ndash;&gt;-->
<!--      </el-submenu>-->

    </el-submenu>


  </el-menu>
</template>

<script>

import jsFileDownload from 'js-file-download'
import axios from 'axios';
import {mapState} from 'vuex'
import {updateMail,upCaseWorkgroupChangeMessage,modifyTaskMessage, queryMailList} from '@/api/caseList'
import flashTitlePlayer from '@/utils/blinkTitle.js'
import toDoTasks from "../../views/workbench/toDoTasks/toDoTasks";
export default {
  components:{},
  name: "index",
  data() {
    return {
      defaultOpenedsArray: [],
      isView: false,
      activeIndex: '1',
      socket:'',
      // queryToDoTaskList: []

    }
  },
  created() {
    // console.log(flashTitlePlayer);
    this.updateMailList()
  },
  methods:{
    updateMailList() {
      queryMailList({ msg: 1000,pageSize: 5, pageNo: 1 }).then(res => {
        this.$store.commit('caseInformation/SET_MAILFLAG', true)
        this.$store.commit('caseInformation/SET_REPORTEDTEMPORARILY', res.data)
        this.$store.commit('caseInformation/SET_REPORTEDTEMPORARILYTOTAL', res.total)
        // flashTitlePlayer.start(`${res.total}`)
      })
    },
    clickOutside(){
      this.defaultOpenedsArray = []
    },
    postMessage(){
        this.$worker.postMessage({data:{
          value: {
            "popFlag":0,
            "msgType":-6,
            "data":"操作成功, userId=2834",
            "success":true,
            "event":"taskEvent",
            "message":"操作成功",
            userId:this.$store.getters.userId
          }}
        })
      },
    goToDoTask() {
      const list = this.queryToDoTaskList.map(i=>{
        return i.prjTaskId
      })
      modifyTaskMessage({taskIdList: list}).then(res=>{
        this.postMessage()
      })
      this.$notify.closeAll()
      if(this.$route.path == '/workbench/toDoTask'){
        return
      }
      this.$router.push('/workbench/toDoTask')
    },
    remindClick(item) {
      // if(this.$route.query&&this.$route.query.taskId == item.task){
      //   return
      // }
      // if(this.$route.query.taskId == item.task){
      //   return
      // }
      if(this.$route.query != {}&&this.$route.query.taskId == item.taskId){
        return
      }
      this.$router.push({path:'/workbench/toDoTask',query:{
                         activeName: "6",
                         taskId: item.taskId
                         }
                       })
      // this.$router.push('/workbench/toDoTask/')
      // if(this.$route.path == '/workbench/toDoTask'){
      //   console.log('hahahah')
      //   this.$store.commit('caseInformation/SET_TODOTASKCASEID', item.caseId)
      //   this.$store.commit('caseInformation/SET_TODOTASKNAME', item.taskName)
      //   this.$store.commit('caseInformation/SET_TODOTASKID', item.taskId)
      //   // sessionStorage.setItem('toDoTask', JSON.stringify([item.caseId,item.taskName]))
      // }else{
      //   this.$router.push({path:'toDoTask',query:{
      //                    caseId:item.caseId,
      //                    activeName: "6",
      //                    taskName: item.taskName,
      //                    taskId: item.taskId
      //                    }
      //                  })
      // }

    },
    currentChange(e){
      this.$store.commit('caseInformation/SET_REPORTEDTEMPORARILYPAGENO',e)
      this.$worker.postMessage({data:{
          value:{
            message: "连接成功, userId=2",
            msgType: -6,
            popFlag: 0,
            success: true,
            event: 'emailEvent',
            userId:this.$store.getters.userId}
        }});
      // this.$Socket.ws.send(JSON.stringify({
      //   message: "连接成功, userId=2",
      //   msgType: -6,
      //   popFlag: 0,
      //   success: true,
      //   event:'messageEvent',
      //   userId:this.$store.getters.userId})) // .emit('chatEvent', {
      //   userId: this.$store.getters.userId,
      // })
    },
    doEditInOffice(url){
      url = url.replace(/&/g, '%26')
      window.open(`#/preView?address=ipdoc${url}`.replace(/[+]/g,'%2B'))
    },
    handleSelect(key){
      if(Object.prototype.toString.call(key).includes('Object')&&key.mailTodoId){
        if(key.status==1){
          updateMail({mailTodoIdArray:key.mailTodoId}).then(res=> {
            this.$worker.postMessage({
              data: {
                value: {
                  message: "连接成功, userId=2",
                  msgType: -6,
                  popFlag: 0,
                  success: true,
                  event: 'messageEvent',
                  userId: this.$store.getters.userId
                }
              }
            });
          })
          // this.$worker.postMessage({data:{
          //     value:{
          //       message: "连接成功, userId=2",
          //       msgType: -6,
          //       popFlag: 0,
          //       success: true,
          //       event:'messageEvent',
          //       userId:this.$store.getters.userId}
          //   }});
          // this.$Socket.ws.send(JSON.stringify({
          //   message: "连接成功, userId=2",
          //   msgType: -6,
          //   popFlag: 0,
          //   success: true,
          //   event:'messageEvent',
          //   userId:this.$store.getters.userId}))
        }else {

        }
        if(!key.createFlag){
            updateMail({mailTodoIdArray:key.mailTodoId}).then(res=>{
              this.$worker.postMessage({data:{
                  value:{
                    message: "连接成功, userId=2",
                    msgType: -6,
                    popFlag: 0,
                    success: true,
                    event:'messageEvent',
                    userId:this.$store.getters.userId}
                }});
              // this.$Socket.ws.send(JSON.stringify({
              //   message: "连接成功, userId=2",
              //   msgType: -6,
              //   popFlag: 0,
              //   success: true,
              //   event:'messageEvent',
              //   userId:this.$store.getters.userId}))
            })
          }else {
            key.mailPath&&this.$commonUtils.downLoadAll({url:`ipdoc${key.mailPath}`,success:(res)=>{
                updateMail({mailTodoIdArray:key.mailTodoId}).then(res=>{
                  this.$worker.postMessage({data:{
                      value:{
                        message: "连接成功, userId=2",
                        msgType: -6,
                        popFlag: 0,
                        success: true,
                        event:'messageEvent',
                        userId:this.$store.getters.userId}
                    }});})
              },error:(e)=>{
                  this.$message.error('该文件无法下载')
              }})
            // axios.get(`ipdoc${key.mailPath}`, {
            //   responseType: 'blob', headers: {
            //     "Content-Type": "application/json; charset=utf-8",
            //   }
            // }).then( (res)=>{
            //   jsFileDownload(res.data, key.mailPath.replace(/(.*\/)*([^.]+).*/ig, "$2", '') + '.' + key.mailPath.replace(/.+\./, ""));
            //   updateMail({mailTodoIdArray:key.mailTodoId}).then(res=>{
            //     this.$worker.postMessage({data:{
            //         value:{
            //           message: "连接成功, userId=2",
            //           msgType: -6,
            //           popFlag: 0,
            //           success: true,
            //           event:'messageEvent',
            //           userId:this.$store.getters.userId}
            //       }});
            //     // this.$Socket.ws.send(JSON.stringify({
            //     //   message: "连接成功, userId=2",
            //     //   msgType: -6,
            //     //   popFlag: 0,
            //     //   success: true,
            //     //   event:'messageEvent',
            //     //   userId:this.$store.getters.userId}))
            //   })
            // })
          }


      }
      if(Object.prototype.toString.call(key).includes('Object')&&key.wkgId){
        upCaseWorkgroupChangeMessage({Id:key.id}).then(res=>{

        })
      }
    }
  },
  computed:{
    ...mapState({
      'reportedTemporarily': state => state.caseInformation.reportedTemporarily,
      'total': state => state.caseInformation.reportedTemporarilyTotal,
      pageSize: state => state.caseInformation.pageSize,
      caseWorkgroupChangeList: state => state.caseInformation.caseWorkgroupChangeList,
      queryToDoTaskList: state => state.caseInformation.queryToDoTaskList,
    }),
    flashFlag(){
      return this.total+this.caseWorkgroupChangeList.length+this.queryToDoTaskList.length
    },
    rightNum() {
      let num = this.queryToDoTaskList.filter(item=>item.userIds&&item.userIds.includes(this.$store.getters.userId))
      return this.queryToDoTaskList.length - num.length
    }
  },
  watch:{
    // flashFlag(n,o){
    //   if(n){
    //     flashTitlePlayer.stop()
    //     flashTitlePlayer.start(`${n}`)
    //   } else {
    //     flashTitlePlayer.stop()
    //   }
    // }
  }
}
</script>

<style lang="scss" scoped>
.messageNotice /deep/{
  background: transparent;
  border-bottom:0;
  .el-menu--popup{
    min-width: 140px;
  }
  .el-menu-item{
    min-width: 140px;
  }
  .el-submenu__icon-arrow{
    display: none;
  }
  &>li.is-opened{
    background: transparent;
  }
  &>li{
    height: 100%;
    background: transparent;
  }
 &>li>{
   .el-submenu__title{
     padding: 0;
     background: transparent !important;
     height: 100%;
     line-height: 40px;
     color: #1a1a1a;
     display: flex;
    &~.el-menu--horizontal>ul{
       left: -90px;
    }
   }
 }
}
  .rightp-item{
    /*background: #fff;*/
    font-size: 16px;
    width: 22px;
    display: flex;
    justify-content: center;
    align-items: center;
    img{
      width: 100%;
    }
  }
.toDoTaskNotice{
  box-sizing: border-box;
  padding: 2px;
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  border-radius: 10px;
  height: 16px;
  font-size: 12px;
  line-height:10px;
  background: #f00;
  color: #ffffff;
  min-width: 16px;
  text-align: center;
  /*margin-left: 10px;*/
  /*float: right;*/
}
  .el-pagination{
    line-height: 1;
  }
  .el-icon-view:hover{
    color: #2d8cf0;
  }
  .flexBox{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>
