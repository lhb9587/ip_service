<template>
  <div class="case_management">
<!--    <header>{{$route.meta.title+' ('+($store.state.user.todoTaskNotice.businessSum?$store.state.user.todoTaskNotice.businessSum:'0')+')'}}</header>-->
    <el-tabs v-model="activeName">
      <el-tab-pane v-if="$store.getters.permissions.includes(283)"  :label="`中国续展提醒 (${zgxzNum})`" name="1">
        <transition name="show" mode="out-in">
          <renewable v-if="activeName==='1'" ref="renewable"></renewable>
        </transition>
      </el-tab-pane>
      <el-tab-pane v-if="$store.getters.permissions.includes(283)"  :label="`境外续展提醒 (${jwxzNum})`" name="2">
        <transition name="show" mode="out-in">
          <abroad-renewable v-if="activeName==='2'"/>
        </transition>
      </el-tab-pane>
      <el-tab-pane v-if="$store.getters.permissions.includes(283)"  :label="`境外使用证据提醒 (${jwsyzj})`" name="3">
        <transition name="show" mode="out-in">
          <reminder-of-overseas v-if="activeName==='3'" />
        </transition>
      </el-tab-pane>
<!--      <el-tab-pane :label="`其他商机 (${$store.state.user.todoTaskNotice.otherBusinessSum?$store.state.user.todoTaskNotice.otherBusinessSum:'0'})`" name="2">-->
<!--        <transition name="show" mode="out-in">-->
<!--          &lt;!&ndash;<case-type v-if="activeName==='2'"></case-type>&ndash;&gt;-->
<!--        </transition>-->
<!--      </el-tab-pane>-->
<!--      <el-tab-pane v-if="$store.getters.permissions.includes(260)"   :label="`近似监控 (${$store.state.user.todoTaskNotice.tmMonitorSum?$store.state.user.todoTaskNotice.tmMonitorSum:'0'})`" name="3">-->
<!--        <transition name="show" mode="out-in">-->
<!--          <TrademarkTesting v-if="activeName==='3'"></TrademarkTesting>-->
<!--        </transition>-->
<!--      </el-tab-pane>-->
<!--      <el-tab-pane v-if="$store.getters.permissions.includes(262)"   :label="`送达监控 (${$store.state.user.todoTaskNotice.tmAnnouncementSum?$store.state.user.todoTaskNotice.tmAnnouncementSum:'0'})`" name="4">-->
<!--        <transition name="show" mode="out-in">-->
<!--          <Announcement v-if="activeName==='4'"></Announcement>-->
<!--        </transition>-->
<!--      </el-tab-pane>-->
<!--      <el-tab-pane v-if="$store.getters.permissions.includes(268)"   :label="`监控主体 (${$store.state.user.todoTaskNotice.tmFirstCheckNum ?$store.state.user.todoTaskNotice.tmFirstCheckNum :'0'})`" name="5">-->
<!--        <transition name="show" mode="out-in">-->
<!--          <MonitoringSubject v-if="activeName==='5'"></MonitoringSubject>-->
<!--        </transition>-->
<!--      </el-tab-pane>-->
    </el-tabs>
  </div>
</template>

<script>
import renewable from './renewable.vue'
import TrademarkTesting from "./TrademarkTesting";
import Announcement from "./announcement";
import MonitoringSubject from "./MonitoringSubject";
import AbroadRenewable from '@/views/workbench/customer_management/business_pportunity/abroadRenewable.vue'
import ReminderOfOverseas from '@/views/workbench/customer_management/business_pportunity/ReminderOfOverseas.vue'
export default {
  name: "business_pportunity",
  computed: {
    zgxzNum() {
      return this.$store.state.user.todoTaskNotice.tmBusinessSum ? this.$store.state.user.todoTaskNotice.tmBusinessSum : '0'
    },
    jwxzNum() {
      return this.$store.state.user.todoTaskNotice.abroadTmBusinessSum ? this.$store.state.user.todoTaskNotice.abroadTmBusinessSum : '0'
    },
    jwsyzj() {
      return this.$store.state.user.todoTaskNotice.abroadTmUseRemindSum ? this.$store.state.user.todoTaskNotice.abroadTmUseRemindSum : '0'
    }
  },
  data(){
    return {
      activeName:'1',
    }
  },
  watch:{
  },
  methods:{
  },
  components:{
    ReminderOfOverseas,
    AbroadRenewable,
    renewable,
    TrademarkTesting,
    Announcement,
    MonitoringSubject
  }
}
</script>

<style lang="scss" scoped>
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
  .show-enter, .show-leave-to {
    opacity: 0;
  }
  header{
    height: 62px;
    line-height:62px;
    font-size:22px;
    font-family:SourceHanSansCN-Normal;
    font-weight:400;
    color:rgba(51,51,51,1);
    padding-left: 20px;
    border-bottom:1px solid #D4D5D5 ;
  }
  .el-tabs{
    margin:0 20px;
  }
</style>
