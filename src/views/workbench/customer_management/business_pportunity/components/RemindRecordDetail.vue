<template>
  <div>
    <el-popover
      placement="top-start"
      width="650"
      trigger="click"
      v-model="visible"
      @show="show"
    >
      <RecordList v-if="list.length" :list="list"></RecordList>
      <div v-else>暂无数据</div>
      <p  style="cursor: pointer;color: #131EEA" slot="reference">查看记录</p>
    </el-popover>
  </div>

</template>

<script>
import RecordList from './RecordList.vue'
  import {getRemindRecordDetail} from '@/api/caseList'
  export default {
    name: "RemindRecordDetail",
    props:{
      regNumber:{}
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
        getRemindRecordDetail({regNumber:this.regNumber}).then(res=>{
         this.list= res.data
          this.flag=true
        })


      }
    },
    components:{
      RecordList
    }
  }
</script>

<style scoped>

</style>
