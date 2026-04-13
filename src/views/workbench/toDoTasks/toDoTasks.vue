<template>
  <div class="case_management">
<!--    <myCalendar></myCalendar>-->
    <i style="right: 60px" class="el-icon-s-promotion" @click="transfromState=true"></i>
    <i class="iconfont icon-task-assigned" @click="queryAssignTask"></i>
    <!--    <header>{{$route.meta.title}}</header>-->
<!--    <TimerComponent></TimerComponent>-->
    <el-tabs ref="tabs" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane :label="`商标待办 ${$store.state.user.todoTaskNotice.caseMatterSum?'('+$store.state.user.todoTaskNotice.caseMatterSum+')':'(0)'}`" name="1"
                   v-if="$store.getters.permissions.includes(34)">
        <transition name="show" mode="out-in">
          <case-type :refesh="refesh" @changeRefesh="refesh=false"></case-type>
        </transition>
      </el-tab-pane>
<!--      <el-tab-pane :label="`诉讼待办  ${$store.state.user.todoTaskNotice.ldCaseMatterSum?'('+$store.state.user.todoTaskNotice.ldCaseMatterSum+')':'(0)'}`" name="2"-->
<!--                   v-if="$store.getters.permissions.includes(34)" >-->
<!--        <transition name="show" mode="out-in">-->
<!--          <litigationTask ></litigationTask>-->
<!--        </transition>-->
<!--      </el-tab-pane>-->


      <el-tab-pane :label="`账单待办 ${$store.state.user.todoTaskNotice.billMatterSum?'('+$store.state.user.todoTaskNotice.billMatterSum+')':'(0)'}`" name="3" v-if="$store.getters.permissions.includes(35)">
        <transition name="show" mode="out-in">
          <BillToDoPage :refesh="refesh" @changeRefesh="refesh=false"></BillToDoPage>
        </transition>
      </el-tab-pane>
      <el-tab-pane :label="`内部账单待办 ${$store.state.user.todoTaskNotice.billInternalMatterSum?'('+$store.state.user.todoTaskNotice.billInternalMatterSum+')':'(0)'}`"  name="8" v-if="$store.getters.permissions.includes(35)">
        <transition name="show" mode="out-in">
          <InternalBillToDo :refesh="refesh" @changeRefesh="refesh=false"></InternalBillToDo>
        </transition>
      </el-tab-pane>
      <el-tab-pane :label="`待报告 ${$store.state.user.todoTaskNotice.waitReportMatterSum?'('+$store.state.user.todoTaskNotice.waitReportMatterSum+')':'(0)'}`" name="4"
                   v-if="$store.getters.permissions.includes(36)">
        <transition name="show" mode="out-in">
          <mainToBeDone v-if="activeName==='4'"></mainToBeDone>
        </transition>
      </el-tab-pane>
      <el-tab-pane :label="`费用待办 ${$store.state.user.todoTaskNotice.feeMatterSum?'('+$store.state.user.todoTaskNotice.feeMatterSum+')':'(0)'}`" name="5"
                   v-if="$store.getters.permissions.includes(214)">
        <transition name="show" mode="out-in">
          <FeeToDoPage ></FeeToDoPage>
        </transition>
      </el-tab-pane>
      <el-tab-pane :label="`分配任务  ${$store.state.user.todoTaskNotice.ldTaskMatterSum?'('+$store.state.user.todoTaskNotice.ldTaskMatterSum+')':'(0)'}`" name="6" v-if="$store.getters.permissions.includes(264)">
<!--      <el-tab-pane label='任务待办' name="6">-->
        <transition name="show" mode="out-in">
          <Lawsuit :caseId="caseId" :taskName="taskName" :toTaskId="taskId" :closeDelayView="handleDelayView"></Lawsuit>
        </transition>
      </el-tab-pane>
      <el-tab-pane :label="`流程任务  ${$store.state.user.todoTaskNotice.ldCaseMatterSum?'('+$store.state.user.todoTaskNotice.ldCaseMatterSum+')':'(0)'}`" name="7" v-if="$store.getters.permissions.includes(265)" >
        <transition name="show" mode="out-in">
          <litigationTask :task-type="3"> </litigationTask>
        </transition>
      </el-tab-pane>
      <el-tab-pane :label="`客户待办  ${$store.state.user.todoTaskNotice.custMatterSum?'('+$store.state.user.todoTaskNotice.custMatterSum+')':'(0)'}`" name="9" >
        <transition name="show" mode="out-in">
          <cust-task></cust-task>
        </transition>
      </el-tab-pane>
      <el-tab-pane :label="`待审工时  ${$store.state.user.todoTaskNotice.worhourMatterSum?'('+$store.state.user.todoTaskNotice.worhourMatterSum+')':'(0)'}`" name="10">
        <transition name="show" mode="out-in">
          <work-time-list></work-time-list>
        </transition>
      </el-tab-pane>
      <el-tab-pane :label="`待核销工时 ${$store.state.user.todoTaskNotice.workhourToBillSum?'('+$store.state.user.todoTaskNotice.workhourToBillSum+')':'(0)'}`" name="11">
        <transition name="show" mode="out-in">
          <wait-audit-work-time />
        </transition>
      </el-tab-pane>
      <el-tab-pane :label="`申请人待办 ${$store.state.user.todoTaskNotice.appTaskSum?'('+$store.state.user.todoTaskNotice.appTaskSum+')':'(0)'}`" name="12" >
        <transition name="show" mode="out-in">
          <app-task />
        </transition>
      </el-tab-pane>
      <el-tab-pane :label="`合同待办 ${$store.state.user.todoTaskNotice.contractToBeReviewedNum?'('+$store.state.user.todoTaskNotice.contractToBeReviewedNum+')':'(0)'}`" name="13" >
        <transition name="show" mode="out-in">
          <ContractToDoTask/>
        </transition>
      </el-tab-pane>
      <!-- <el-tab-pane :label="`出差待办 ${$store.state.user.todoTaskNotice.bussTripSum?'('+$store.state.user.todoTaskNotice.bussTripSum+')':'(0)'}`" name="14" >
        <transition name="show" mode="out-in">
          <BusinesstripToDoTask />
        </transition>
      </el-tab-pane> -->
    </el-tabs>
    <HandOver :transfromState="transfromState" :transfromType="transfromType" :multipleSelection="multipleSelection" @closeHandover="closeHandover"></HandOver>
    <el-dialog
      title="可回收任务"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="()=>dialogVisible=false">
      <el-table
        :data="backTask"
        style="width: 100%">
        <el-table-column
          prop="taskName"
          label="任务名">
        </el-table-column>
        <el-table-column
          prop="taskCandidateName"
          label="接交人">
        </el-table-column>
        <el-table-column
          prop="address"
          label="操作">
          <template slot-scope="{row}">
            <el-button type="text" @click="tackBackTask(row)">回收</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

  </div>
</template>

<script>
  import Lawsuit  from "./components/Lawsuit";
  import HandOver  from "./components/HandOver";
  import caseType from "./components/type_of_cases";
  import mainToBeDone from "./components/mailToBeDone";
  import BillToDoPage from "./components/BillToDoPage";
  import FeeToDoPage from "./components/FeeToDoPage";
  import litigationTask from "./components/litigationTask";
  import InternalBillToDo from './components/InternalBillToDo'
  import {queryAssignTask,tackBackTask} from '@/api/caseList'
  import CustTask from "./components/CustTask";
  import WorkTimeList from "./components/WorkTimeList";
  import WaitAuditWorkTime from '@/views/workbench/toDoTasks/components/WaitAuditWorkTime.vue'
  import AppTask from '@/views/workbench/toDoTasks/components/AppTask.vue'
  import ContractToDoTask from '@/views/workbench/toDoTasks/components/ContractToDoTask.vue'
  import BusinesstripToDoTask from '@/views/workbench/toDoTasks/components/BusinesstripToDoTask.vue'
  export default {
    name: "toDoTasksChildren",
    data() {
      return {
        activeName:localStorage.getItem('toDoTasksChildren')?localStorage.getItem('toDoTasksChildren'):'1',
        dialogVisible:false,
        backTask:[],
        refesh:false,
        transfromState:false,
        transfromType:'任务权限转交',
        multipleSelection:[],
        handleDelayView: false
      };
    },
    beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.handleDelayView = true
    });
  },
    beforeRouteLeave (to, from, next) {
      this.handleDelayView = false
      next()
    },
    computed: {
      taskId() {
        if(this.$route.query.taskId) {
          this.activeName = this.$route.query.activeName
          return this.$route.query.taskId
        }else {
          return ''
        }
      },
      caseId() {
        if(this.$route.query.caseId) {
          this.activeName = this.$route.query.activeName
          return this.$route.query.caseId
        }else {
          return ''
        }
      },
      taskName() {
        if(this.$route.query.taskName) {
          this.activeName = this.$route.query.activeName
          return  this.$route.query.taskName
        }else {
          return ''
        }

      }
    },
    created() {
      if (this.$route.query.name) {
        this.activeName = this.$route.query.name;
      } else {
        this.activeName = localStorage.getItem('toDoTasksChildren')
        ?
        localStorage.getItem('toDoTasksChildren')
        : this.$route.query.name
          ? this.$route.query.name
          : '1'
        this.$store.dispatch('user/getTodoTaskNotice');
      }
      // if(!localStorage.getItem('toDoTasksChildren')){
      //   if(this.$store.getters.permissions.includes(265)){
      //     this.activeName = '7'
      //   }
      //   if(this.$store.getters.permissions.includes(264)){
      //     this.activeName = '6'
      //   }
      // }

    },
    activated(){
      if (this.$route.query.name) {
        this.activeName = this.$route.query.name;
      } else {
        this.activeName = localStorage.getItem('toDoTasksChildren')
        ?
        localStorage.getItem('toDoTasksChildren')
        : this.$route.query.name
          ? this.$route.query.name
          : '1'
        this.$store.dispatch('user/getTodoTaskNotice');
      }
      // this.activeName = localStorage.getItem('toDoTasksChildren')
      //   ?
      //   localStorage.getItem('toDoTasksChildren')
      //   : this.$route.query.name
      //     ? this.$route.query.name
      //     : '1'
      // this.$store.dispatch('user/getTodoTaskNotice');
    },
    methods: {
      handleClick() {
        localStorage.setItem('toDoTasksChildren',this.activeName)
      },
      closeHandover(e){
        this.transfromState=false
        this.refesh=true
      },
      queryAssignTask(){
        this.dialogVisible=true
        queryAssignTask().then(res=>{
          this.backTask=res.data
        })
      },
      tackBackTask(row){
        tackBackTask({
          processDefineId:row.processDefineId,
          taskName:row.taskName}).then(res=>{
          this.refesh=true
          queryAssignTask().then(res=>{
            this.backTask=res.data
          })
        })
      }
    },
    components: {
      BusinesstripToDoTask,
      AppTask,
      ContractToDoTask,
      WaitAuditWorkTime,
      WorkTimeList,
      CustTask,
      caseType,
      mainToBeDone,
      BillToDoPage,
      FeeToDoPage,
      litigationTask,
      HandOver,
      Lawsuit,
      InternalBillToDo
    }
  };
</script>

<style lang="scss" scoped>
  .el-icon-s-promotion{
    position: absolute;
    right: 60px;
    top: -16px;
    cursor: pointer;
    z-index: 1;
    color: rgb(82, 160, 245);
    font-size: 20px;
  }
  .iconfont{
    position: absolute;
    right: 20px;
    top: -18px;
    cursor: pointer;
    z-index: 1;
    color: rgb(82, 160, 245);
    font-size: 20px;
  }
  .case_management {
    position: relative;
  }
  @keyframes show {
    0% {
      opacity: 0;
      transform: translateX(100%);
    }
    100% {
      transform: translateX(0);
      opacity: 1;
    }
  }
  @keyframes hide {
    0% {
      opacity: 1;
      transform: translateX(0);
    }
    100% {
      opacity: 0;
      transform: translateX(100%);
    }
  }
  .show-enter-active {
    animation: show 1.2s;
  }
  .show-leave-active {
    animation: hide 1.2s;
  }
  .show-enter,
  .show-leave-to {
    opacity: 0;
  }
  header {
    height: 62px;
    line-height: 62px;
    font-size: 22px;
    font-family: SourceHanSansCN-Normal;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    padding-left: 20px;
    border-bottom: 1px solid #d4d5d5;
  }
  .el-tabs {
    margin: 0 20px;
  }
</style>
