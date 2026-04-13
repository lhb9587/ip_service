<!--<template>-->
  <!--<div >-->
    <!--&lt;!&ndash;<component&ndash;&gt;-->
      <!--&lt;!&ndash;:is="pageState"&ndash;&gt;-->
      <!--&lt;!&ndash;:domainNames ='domainNames'&ndash;&gt;-->
      <!--&lt;!&ndash;:queryDeptByConditionList ="queryDeptByConditionList"&ndash;&gt;-->
      <!--&lt;!&ndash;:queryWorkgroupNamesList ="queryWorkgroupNamesList"&ndash;&gt;-->
      <!--&lt;!&ndash;@jumpWorkingGroupModify="jumpWorkingGroupModify"&ndash;&gt;-->
      <!--&lt;!&ndash;:modifyMessage="modifyMessage"&ndash;&gt;-->
      <!--&lt;!&ndash;@jumpWorkingGroup="jumpWorkingGroup"&ndash;&gt;-->
      <!--&lt;!&ndash;:pageType="pageType"&ndash;&gt;-->
    <!--&lt;!&ndash;&gt;</component>&ndash;&gt;-->
  <!--</div>-->
<!--</template>-->

<!--<script>-->
<!--import request from '@/utils/request'-->
<!--import workingGroup from './workingGroup_management'-->
<!--import workingGroupModify from './workingGroup_management_modify'-->
<!--export default {-->
  <!--name: "workingGroup_management",-->
  <!--data() {-->
    <!--return {-->
      <!--pageState: 'workingGroup',-->
      <!--domainNames: [],-->
      <!--queryDeptByConditionList:[],-->
      <!--queryWorkgroupNamesList:[],-->
      <!--modifyMessage:{},-->
      <!--pageType:1,//1为添加，2为修改-->
    <!--}-->
  <!--},-->
  <!--components: {-->
    <!--workingGroup, workingGroupModify-->
  <!--},-->
  <!--created(){-->
    <!--this.queryDomainNames()-->
    <!--this.queryWorkgroupNames()-->
    <!--this.queryDeptByCondition()-->
  <!--},-->
  <!--methods: {-->
    <!--//领域列表-->
    <!--queryDomainNames() {-->
      <!--request({-->
        <!--url: '/ip_sysm/interface/domain/queryDomainNames',-->
        <!--method: 'post',-->
        <!--data: { agencyId: 1 }-->
      <!--}).then(res => {-->
        <!--if (res.success) {-->
          <!--this.domainNames = res.data-->
        <!--}-->
      <!--})-->
    <!--},-->


    <!--queryDeptByCondition(){-->
      <!--request({-->
        <!--url: '/ip_sysm/interface/department/queryDeptByCondition',-->
        <!--method: 'post',-->
        <!--data: {  }-->
      <!--}).then(res => {-->
        <!--if (res.success) {-->
          <!--this.queryDeptByConditionList = res.data-->
        <!--}-->
      <!--})-->
    <!--},-->
    <!--jumpWorkingGroupModify(res){-->
      <!--if(res){//res有对象 和0 0为添加-->
        <!--this.modifyMessage=res-->
        <!--this.pageType=2-->
      <!--}else {-->
        <!--this.pageType=1-->
      <!--}-->
      <!--this.pageState='workingGroupModify'-->
    <!--},-->
    <!--jumpWorkingGroup(){-->
      <!--this.pageState='workingGroup'-->
    <!--}-->
  <!--}-->
<!--}-->
<!--</script>-->

<!--<style >-->

<!--</style>-->
