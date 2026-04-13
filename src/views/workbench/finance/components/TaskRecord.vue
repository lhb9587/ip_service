<template>
<!--  <el-steps :direction="direction" :active="recordList.length">-->
<!--    <el-step v-for="item in recordList" :title="item.progressName">-->

<!--    </el-step>-->
<!--  </el-steps>-->
  <el-timeline>
    <el-timeline-item :color="item.status=='已完成'?'green':'red'" v-for="item in recordList"  :timestamp="item.finish" placement="top">
      <el-card>
        <h4>任务名称 {{item.progressName}}</h4>
        <p class="item_p">状态 {{item.status}}</p>
        <p class="item_p" v-if="item.returnReason">退回原因 {{item.returnReason}}</p>
        <p class="item_p">任务人 {{item.tasker}}</p>
<!--        <p class="item_p">动作 {{item.tasker}}</p>-->
        <p class="item_p">时间 {{item.finish}}</p>
      </el-card>
    </el-timeline-item>
  </el-timeline>
</template>

<script>
  import {queryBillTaskRecord} from "@/api/billApi";
  export default {

    props:{
      typeId:{
        default:14
      },
      id:{

      },
      direction:{
        default: 'vertical'
      }
    },
    name: "TaskRecord",
    data(){
      return {
        recordList:[]
      }
    },
    created() {
      this.queryBillTaskRecord()
    },
    methods:{
      queryBillTaskRecord(){
        queryBillTaskRecord({typeId: this.typeId,id:this.id}).then(res=>{
           this.recordList=res.data
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
.el-card{
  .item_p{margin-top: 10px}
}
</style>
