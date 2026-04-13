<template>
  <div>
    <el-popover
      placement="top-start"
      width="650"
      trigger="click"
      v-model="visible"
      @show="show"
    >
      <UseRecordList v-if="list.length" :list="list"></UseRecordList>
      <div v-else>暂无数据</div>
      <p  style="cursor: pointer;color: #131EEA" slot="reference">查看记录</p>
    </el-popover>
  </div>

</template>

<script>
import { getBusinessUseRemindRecord, getRemindRecordDetail } from '@/api/caseList'
import UseRecordList from '@/views/workbench/customer_management/business_pportunity/components/UseRecordList.vue'
export default {
  name: "UseRemindRecordDetail",
  props:{
    agentNum:{},
    remindDate:{},
  },
  data(){
    return{

      visible:false,
      list:[],

    }
  },

  methods:{

    show(){
      if(this.flag){
        return
      }
      getBusinessUseRemindRecord({agentNum:this.agentNum,remindDate: this.remindDate }).then(res=>{
        this.list= res.data
        this.flag=true
      })


    }
  },
  components:{
    UseRecordList,
  }
}
</script>

<style scoped>

</style>
