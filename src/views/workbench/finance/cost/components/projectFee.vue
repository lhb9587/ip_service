<template>
  <div>
    <projectFeeDetail :project-id="projectId" :pageType="pageType" @cancel="cancel"></projectFeeDetail>
  </div>
</template>

<script>
  import getPageTitle from '@/utils/get-page-title'
  import projectFeeDetail from "./projectFeeDetail";
  export default {
    name: "projectFee",
    data(){
      return{
        feeId:this.$route.query.feeId,
        projectId:this.$route.query.projectId,
        pageType:this.$route.query.pageType,
        taskNo:this.$route.query.taskNo,
      }
    },
    created() {

    },
    methods:{
      cancel(){
        this.$router.go(-1)
      }

    },
    beforeRouteEnter: (to, from, next) => {
      if (to.query.pageType === "1") {
        document.title = getPageTitle((to.meta.title = "费用新建"));
        next(res => {});
      } else {
        document.title = getPageTitle((to.meta.title = "费用修改"));
        next(res => {});
      }
    },
    components:{
      projectFeeDetail
    }
  }
</script>

<style scoped>

</style>
