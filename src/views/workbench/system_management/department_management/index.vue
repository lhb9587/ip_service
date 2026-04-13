<!--<template>-->
  <!--<div class="department">-->
    <!--<router-view></router-view>-->
    <!--&lt;!&ndash;<component :is="department" :modifyState="modifyState" @handerData="handerData" @jumpDepartment="jumpDepartment" :sendInfo="sendInfo" :queryDeptByConditionList="queryDeptByConditionList"></component>&ndash;&gt;-->
  <!--</div>-->
<!--</template>-->

<!--<script>-->
  <!--import request from '@/utils/request'-->
  <!--import department from './department'-->
  <!--import departmentModify from './department_modify'-->
  <!--export default {-->
    <!--name: 'department_management',-->
    <!--data() {-->
      <!--return {-->
        <!--modifyState:true,-->
        <!--department:'department',-->
        <!--sendInfo:{ },-->
        <!--queryDeptByConditionList:[]-->
      <!--}-->
    <!--},-->
    <!--created(){-->
      <!--this.queryDeptByCondition()-->
    <!--},-->
   <!--methods:{-->
      <!--//点击修改或添加 跳转页面-->
      <!--handerData(res){-->
        <!--if(res){-->
          <!--this.modifyState=true-->
        <!--}else{-->
          <!--this.modifyState=false-->
        <!--}-->
        <!--this.sendInfo=res-->
        <!--this.department='departmentModify'-->
      <!--},-->
     <!--//跳转部门列表-->
     <!--jumpDepartment(){-->
       <!--this.department='department'-->
     <!--},-->
     <!--//查询条件-->
     <!--queryDeptByCondition(){-->
       <!--request({-->
         <!--url: '/ip_sysm/interface/department/queryDeptByCondition',-->
         <!--method: 'post',-->
         <!--data: {}-->
       <!--}).then(res => {-->
         <!--if (res.success) {-->
           <!--this.queryDeptByConditionList = res.data-->
         <!--}-->
       <!--})-->
     <!--},-->
    <!--},-->
    <!--components:{-->
      <!--department,-->
      <!--departmentModify-->
    <!--}-->
  <!--}-->
<!--</script>-->

<!--<style >-->
<!--.department{-->
  <!--margin-left: 50px;-->
<!--}-->
<!--</style>-->
