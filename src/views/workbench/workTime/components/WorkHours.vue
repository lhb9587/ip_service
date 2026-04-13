<template>
  <div class="work-btn">
    <div class="start-btn1" @click="createWorkHours" v-show="!autoHourView">
      <img src="@/assets/工时设置.svg" alt="" style="cursor: pointer">
    </div>
    <div v-show="autoHourView" class="start-btn1 long-stop-btn">
      <timer :autoHourView="autoHourView" type="edit" :isOut="true" @editWorkHour="editWorkHour"></timer>
    </div>

    <el-dialog
      :title="title"
      :close-on-click-modal="false"
      :visible.sync="workHourView"
      width="45%"
      height="80%"
      class="abow_dialog"
    >
      <create-work-hour v-if="workHourView" :hoursId="hoursId" :type="type" @closeDialog="closeDialog"></create-work-hour>
    </el-dialog>
  </div>
</template>

<script>
  import CreateWorkHour from "./CreateWorkHour";
  import Timer from "./Timer";

  export default {
    name: "workBtn",
    components: {Timer, CreateWorkHour},
    data() {
      return {
        type: '',
        title: '',
        hoursId: '',
        autoHourView: false,
        workHourView: false
      }
    },
    computed: {
      workTimeStatus() {
        return this.$store.getters.workTimeStatus
      },
    },
    watch: {
      workTimeStatus(n, o) {
        if (n == 2 || n == 1) {
          this.autoHourView = true
        } else {
          this.autoHourView = false
        }
      }
    },
    methods: {
      editWorkHour(hoursId){
        this.hoursId = hoursId
        this.type = 'edit'
        this.title = '修改工时'
        this.workHourView = true
      },
      createWorkHours() {
        this.type = 'create'
        this.title = '新建工时'
        this.workHourView = true
      },
      closeDialog() {
         this.hoursId = ''
        this.type = ''
        this.title = ''
        this.workHourView = false
      }
    }
  }
</script>

<style lang="scss" scoped>
  .work-btn {
    z-index: 99999;
  }

  .start-btn1 {
    /*cursor: pointer;*/
    z-index: 3;
    position: fixed;
    bottom: 10px;
    right: 0px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: #fff;
    box-shadow: -1px -1px 1px 2px #f2f2f2;

    img {
      height: 30px;
      transform: translateX(-50%);
      margin-left: 51%;
      margin-top: 23%;
      color: #2981EB
    }
  }

  .long-stop-btn {
    width: 180px;
    border-radius: 25px;

    img {
      margin-top: 8%;
    }
  }

  .abow_dialog {
    > > > .el-dialog {
      position: absolute;
      top: 50%;
      left: 50%;
      margin: 0 !important;
      transform: translate(-50%, -50%);
      min-height: calc(60%);
      max-height: calc(100% - 30px);
      max-width: calc(100% - 30px);
      display: flex;
      flex-direction: column;
    }

    > > > .el-dialog__body {
      overflow: auto;
      padding: 0 10px 10px 10px;
    }
  }

</style>
