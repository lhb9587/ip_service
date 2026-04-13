<template>
  <div class="work-btn">
    <!--    formTime.hoursId == hoursId-->
    <div class="work-hour-title" v-if="isOut && (workTypeName || agentNum)" @click="editWorkTime" :title="workTypeName || agentNum">{{workTypeName || agentNum}}</div>
    <div class="long-stop-btn" v-if="isStop && (type !== 'create') && formTime.hoursId === hoursId || isOut">
      <img class="clock" src="@/assets/time.png" alt="" :style="{marginTop: isOut && (workTypeName || agentNum) ? '15%' : '8%'}">
      <div style="display: inline-block; transform: translateX(-10px) translateY(-4px); color: #52A0F5">{{str}}</div>
      <!--   只在修改工时页面可以暂停、停止自动记工时  -->
      <template v-if="type === 'edit'">
        <img v-if="changeBtn" :style="{marginTop: isOut && (workTypeName || agentNum) ? '15%' : '8%'}" src="@/assets/play.png" alt="" style="cursor: pointer" @click="pauseTaskHours">
        <img v-if="!changeBtn" :style="{marginTop: isOut && (workTypeName || agentNum) ? '15%' : '8%'}" class="fix-btn" src="@/assets/start.png" style="cursor: pointer" alt=""
             @click="startTaskHours(1)">
        <img class="fix-btn stop" :style="{marginTop: isOut && (workTypeName || agentNum) ? '15%' : '8%'}" src="@/assets/stop.png" style="cursor: pointer" alt="" @click="stopTime">
      </template>
    </div>
    <div v-else class="start-btn">
      <!--      只在新建页面可以新建工时-->
      <img v-if="type === 'create'" class="fix-btn" src="@/assets/start.png" alt="" @click="createAutoHour"
           style="margin-left: 51%;margin-top: 29%;cursor: pointer" title="开始计时">
    </div>
  </div>
</template>

<script>
  import bus from '@/utils/Bus'
  import {
    getCaseHistory,
    addTaskHours,
    startTaskHours,
    queryAutoWorkHours,
    stopTaskHours,
    pauseTaskHours
  } from '@/api/caseList';

  export default {
    name: "Timer",
    props: {
      autoHourView: {},
      isOut: {
        type: Boolean
      },
      custRequre: {},
      projectId: {},
      formTime: {
        type: Object,
        default: () => ({})
      },
      type: {
        type: String
      }
    },
    data() {
      return {
        workTypeName: '',
        agentNum: '',
        getHoursIdFlag: false,
        contentShow: false,
        gridData: [],
        visible: false,
        agentHistorySearch: false,
        nameHistorySearch: false,
        historyList: [],
        agentVisible: false,
        agentCaseLists: [],
        nameCaseLists: [],


        userList: [],
        changeBtn: true,
        onlyOneTime: false,
        checked: false,
        isStop: false,
        workKinds: [],
        status: '',
        beginDate: '',
        handTimeView: false,
        dialogFormVisible: false,
        view: true,
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
    },
    computed: {
      workTimeStatus() {
        return this.$store.getters.workTimeStatus
      },
    },
    watch: {
      autoHourView(n) {
        setTimeout(() => {
          n && queryAutoWorkHours().then(res => {
            if (res.data) {
              this.hoursId = res.data.hoursId
              this.agentNum = res.data.agentNum
              this.workTypeName = res.data.workTypeName
            }
          })
        }, 1000)
      },
      workTimeStatus(n, o) {
        if (n == 2) {
          // console.log('计时')
          clearInterval(this.time)
          this.timeStart()
          this.changeBtn = true
          this.isStop = true
        } else if (n == 1) {
          // console.log('暂停')
          this.changeBtn = false
          this.isStop = true
          clearInterval(this.time)
        } else {
          // console.log('stop!!!!!')
          this.isStop = false
          this.reset()
        }
      }
    },
    methods: {
      editWorkTime() {
        this.$emit('editWorkHour', this.hoursId)
      },
      createAutoHour() {
        this.startTaskHours()
      },
      pauseTaskHours() {
        this.$store.commit('caseInformation/SET_WORKTIMESTATUS', 1)
        clearInterval(this.time)
        this.changeBtn = false
        this.postMessage(1)
        pauseTaskHours({hoursId: this.hoursId}).then(res => {
          this.$message.success('暂停计时')
        })
      },
      stopTime() {
        stopTaskHours({hoursId: this.hoursId}).then(() => {
          this.postMessage(3)
          this.$emit('calcTime', {time: this.toDub(this.hour) + ':' + this.toDub(this.minute)})
          this.isStop = false
          this.reset()
          this.$store.commit('caseInformation/SET_WORKTIMESTATUS', 'stop')
          // this.$emit('calcTime', {time: this.toDub(this.hour) + ':' + this.toDub(this.minute)})
          this.$message.success('记录工时成功！')
          // bus.$emit('updateWorkList')
          this.$store.commit('caseInformation/SET_HOURS_ID', this.hoursId)
          if (this.$route.path !== '/workbench/work_time') {
            this.$router.push('/workbench/work_time')
          }
        })
      },
      formatSeconds(a) {
        let hh = parseInt(a / 3600);
        if (hh < 10) hh = "0" + hh;
        let mm = parseInt((a - hh * 3600) / 60);
        if (mm < 10) mm = "0" + mm;
        let ss = parseInt((a - hh * 3600) % 60);
        if (ss < 10) ss = "0" + ss;
        let length = hh + ":" + mm + ":" + ss;
        if (a > 0) {
          return length;
        } else {
          return "00:00:00";
        }
      },
      async queryAutoWorkHours() {
        const res = await queryAutoWorkHours()
        if (res.data) {
          this.hoursId = res.data.hoursId
          this.status = res.data.status
          this.agentNum = res.data.agentNum
          this.workTypeName = res.data.workTypeName
        }

        if (this.status == 1 || this.status == 2) {
          this.$store.commit('caseInformation/SET_WORKTIMESTATUS', res.data.status)
        } else {
          this.$store.commit('caseInformation/SET_WORKTIMESTATUS', 3)
        }
        if (!this.status) {
          this.isStop = false
        }
        if (this.status == 2) {
          let computedTime = this.formatSeconds(res.data.totalTime).split(':')
          this.hour = +computedTime[0]
          this.minute = +computedTime[1]
          this.second = +computedTime[2]
          this.changeBtn = true
          this.isStop = true
          this.str = this.toDub(this.hour) + ':' + this.toDub(this.minute) + ':' + this.toDub(this.second)
          clearInterval(this.time)
          this.timeStart()
        }
        if (this.status == 1) {
          let computedTime = this.formatSeconds(res.data.totalTime).split(':')
          this.hour = +computedTime[0]
          this.minute = +computedTime[1]
          this.second = +computedTime[2]
          this.changeBtn = false
          this.isStop = true
          clearInterval(this.time)
          this.str = this.toDub(this.hour) + ':' + this.toDub(this.minute) + ':' + this.toDub(this.second)
        }
      },
      timeStart() {
        this.time = setInterval(this.timer, 1000)
      },
      timer() {
        this.second = this.second + 1        //毫秒
        if (this.second >= 60) {
          this.second = 0
          this.minute = this.minute + 1
        }
        if (this.minute >= 60) {
          this.minute = 0
          this.hour = this.hour + 1
        }
        this.str = this.toDub(this.hour) + ':' + this.toDub(this.minute) + ':' + this.toDub(this.second)
        // console.log(this.str,'=============')
      },
      toDub(n) {
        //补0
        if (n < 10) {
          return '0' + n
        } else {
          return '' + n
        }
      },
      reset() {
        //重置
        clearInterval(this.time)
        this.hour = 0
        this.minute = 0
        this.ms = 0
        this.second = 0
        this.beginDate = ''
        this.str = '00:00:00'
      },
      add0(m) {
        return m < 10 ? '0' + m : m
      },
      format(shijianchuo) {
        //shijianchuo是整数，否则要parseInt转换
        var time = new Date(shijianchuo);
        var y = time.getFullYear();
        var m = time.getMonth() + 1;
        var d = time.getDate();
        return y + '-' + this.add0(m) + '-' + this.add0(d)
      },
      postMessage(status) {
        this.$worker.postMessage({
          data: {
            value: {
              "popFlag": 0,
              "msgType": -6,
              "data": "连接成功, userId=2834",
              "success": true,
              "event": "workTime",
              "message": "连接成功",
              status: status,
              userId: this.$store.getters.userId
            }
          }
        })
      },
      async startTaskHours(data) {
        if (data == 1) {
          startTaskHours({hoursId: this.hoursId}).then(() => {
            this.$store.commit('caseInformation/SET_WORKTIMESTATUS', 2)
            this.postMessage(2)
            this.$message.success('继续计时')
          })
        } else {
          if (this.formTime.fullname) {
            this.formTime.custId = undefined
            this.formTime.custIntroductor = this.$store.getters.name
          }
          if (this.custRequre && (!this.formTime.custId && !this.formTime.fullname)) {
            this.$message.error('请填写客户名称！')
            return
          }
          if (!this.formTime.workContent) {
            this.$message.error('请填写工作描述！')
            return
          }
          if (!this.formTime.userId) {
            this.$message.error('请选择记录人！')
            return
          }
          if(!this.formTime.noCaseAuditUserId && this.formTime.workType) {
            this.$message.error('请选择活动工时审核人！')
            return
          }
          // if (!this.formTime.time) {
          //   this.$message.error('请填写工作时长！')
          //   return
          // }
          if (!this.projectId && !(this.formTime.agentNum || this.formTime.workType)) {
            this.$message.error('请填写案件文号或活动类型！')
            return
          }
          this.formTime.beginDate = undefined
          this.formTime.endDate = undefined
          this.$store.commit('caseInformation/SET_WORKTIMESTATUS', 2)
          startTaskHours({...this.formTime}).then((res) => {
            this.postMessage(2)
            // this.changeBtn = true
            // this.isStop = true
            this.$message.success('开始记录工时！')
            this.$emit('closeTimer')
            // bus.$emit('updateWorkList')
            this.hoursId = res.data.hoursId
            this.hoursId = res.data.hoursId
            this.$store.commit('caseInformation/SET_HOURS_ID', this.hoursId)
            if (this.$route.path !== '/workbench/work_time') {
              this.$router.push('/workbench/work_time')
            }
          })

          clearInterval(this.time)
          this.timeStart()
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  .work-btn {
    z-index: 99999;
  }

  .start-btn, .long-stop-btn {
    img {
      height: 20px;
      margin-left: 3%;
      transform: translateX(-50%);
      margin-top: 15%;
    }

    .clock {
      display: inline-block;
      height: 20px;
      margin-left: 15%;
      /*margin-top: 30%;*/
    }
  }

  /*.long-stop-btn {*/
  /*  width: 180px;*/
  /*  border-radius: 25px;*/

  /*  img {*/
  /*    margin-top: 8%;*/
  /*  }*/
  /*}*/

  .el-icon-s-cooperation, .el-icon-s-claim, .el-icon-s-unfold {
    color: #52A0F5;
  }

  .selected {
    cursor: pointer;
  }

  > > > .el-input--prefix .el-input__inner {
    width: 150px;
  }

  .time-long, .agent-num {
    > > > .el-input__inner {
      width: 150px;
      height: 30px;
    }
  }

  .bgColor {
    background-color: #eee;
  }

  .work-btn {
    z-index: 999;
  }

  .start-btn, .stop-btn {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    /*background-color: #fff;*/
  }

  .time-long {
    > > > .el-input__inner {
      width: 150px;
      height: 30px;
    }
  }

  .bottom-btn {
    span {
      cursor: pointer;
    }
  }

  .overflow-hidden {
    overflow: hidden;
    width: 100%;
    display: inline-block;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-break: break-all;
  }

  .new-time {
    z-index: 1 !important;
  }

  .work-hour-title {
    font-size: 14px;
    cursor: pointer;
    position: absolute;
    left: 20px;
    max-width: 150px;
    overflow: hidden;
    display: inline-block;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-break: break-all;
    color: #52A0F5;
    /*color: orange;*/
  }
</style>
