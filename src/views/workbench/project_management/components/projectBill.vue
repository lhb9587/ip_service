<template>
  <div>
    <el-tabs  v-model="activeName">
<!--      <el-tab-pane  :label="`工时(${workHours.length})`" name="工时">-->
<!--        <projectTime :projectId="projectId"></projectTime>-->
<!--      </el-tab-pane>-->
      <el-tab-pane :label="`费用(${feeList.length})`" name="费用">
        <projectFee :projectId="projectId"></projectFee>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import projectTime from "./projectTime";
  import projectFee from './projectFee'
  import {queryProjectFeeInfo} from '@/api/caseList'
  export default {
    name: "projectBill",
    props:{
      projectId:{

      }
    },
    data(){
      return{
        activeName:'费用',
        workHours:[],
        feeList:[]
      }
    },
    created() {

    },
    methods:{

    },
    watch:{
      projectId(n,o){
        // this.queryProjectFeeInfo(n)
      }
    },
    components:{
      projectFee,projectTime
    }
  }
</script>

<style lang="scss" scoped>
/deep/ .el-dialog__body{
  padding: 10px 20px;
}
</style>
