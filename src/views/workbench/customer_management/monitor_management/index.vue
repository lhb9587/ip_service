<template>
  <div class="case_management">
    <el-tabs lazy v-model="activeName">
      <el-tab-pane :label="item.label" :name="item.name" v-for="(item, index) in monitorList" v-if="!item.permissions || $store.getters.permissions.includes(item.permissions)" :key="index">
        <transition name="show" mode="out-in">
          <keep-alive>
            <component :is="item.cpn" v-if="activeName === item.name" :workgroupNamesList="workgroupNamesList"
                       :annNumList="annNumList" :custList="custList"></component>
          </keep-alive>
        </transition>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import MonitorContent from "./component/MonitorContent";
import FirstTrialMonitor from "./component/FirstTrialMonitor";
import MainBodyMonitor from "./component/MainBodyMonitor";
import ServiceMonitor from "./component/ServiceMonitor";
import {queryIssueList, queryMonitorCustomer} from "../../../../api/monitor";
import {queryWorkGroup, queryWorkgroupNames} from "../../../../api/systemList";
import TrademarkGazette from "./component/TrademarkGazette";
import ProcessMonitor from "./component/ProcessMonitor";

export default {
  name: "business_pportunity",
  computed: {
    monitorList(){
      return [
        {
          label: '监控内容',
          name: '1',
          cpn: 'MonitorContent'
        },
        {
          label: '初审监控(' + this.$store.state.user.remindNotice.firstResultSum + ')',
          name: '2',
          cpn: 'FirstTrialMonitor'
        },
        {
          label: '主体监控(' + this.$store.state.user.remindNotice.subjectResultSum + ')',
          name: '3',
          cpn: 'MainBodyMonitor'
        },
        {
          label: '送达监控(' + this.$store.state.user.remindNotice.deliveryResultSum + ')',
          name: '4',
          cpn: 'ServiceMonitor'
        },
        {
          label: '商标公告',
          name: '5',
          cpn: 'TrademarkGazette'
        },
        {
          label: '流程监控',
          name: '6',
          cpn: 'ProcessMonitor',
          permissions: 489
        }
      ]
    }
  },
  data() {
    return {
      // monitorList: ,
      activeName: '1',
      annNumList: [],
      workgroupNamesList: [],
      custList: []
    }
  },
  watch: {},
  created() {
    this.queryCustList()
    this.queryIssueList()
    this.queryWorkgroupNames()
    this.$store.dispatch("user/getMonitorNumData");
  },
  methods: {
    queryCustList() {
      queryMonitorCustomer().then(res => {
        this.custList = res.data.map(item => ({fullname: item.custName}))
      })
    },
    queryIssueList() {
      queryIssueList().then(res => {
        if (res.data && res.data.length) {
          this.annNumList = res.data
        }
      })
    },
    queryWorkgroupNames() {
      queryWorkGroup({
        isBussiness: 1,
        wkgStatus: 1
      }).then(res => {
        if (res.success) {
          this.workgroupNamesList = res.data
        }
      })
    },
  },
  components: {
    TrademarkGazette,
    ServiceMonitor,
    MainBodyMonitor,
    FirstTrialMonitor,
    MonitorContent,
    ProcessMonitor
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

header {
  height: 62px;
  line-height: 62px;
  font-size: 22px;
  font-family: SourceHanSansCN-Normal;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  padding-left: 20px;
  border-bottom: 1px solid #D4D5D5;
}

.el-tabs {
  margin: 0 20px;
}
</style>
