<template>

</template>

<script>
  export default {
    name: "TabNameStorage",

    methods:{
      getTabName(){
        if(['case_detail','seeCaseDetail'].includes(this.$route.name)){
          if(localStorage.getItem('tabName')&&(this.caseDetailFoemData.caseId == JSON.parse(localStorage.getItem('tabName')).caseId)&&this.$route.name==JSON.parse(localStorage.getItem('tabName')).routeName){
            this.activeName = JSON.parse(localStorage.getItem('tabName')).name
          }
        }else {
          if(localStorage.getItem('caseTabName')&&this.$route.name==JSON.parse(localStorage.getItem('caseTabName')).routeName){
            this.activeName = JSON.parse(localStorage.getItem('caseTabName')).name
          }
        }
        // else{
        //   let obj = {'caseId': this.caseDetailFoemData.caseId,'name': this.activeName}
        //   localStorage.setItem('tabName', JSON.stringify(obj))
        // }
      }
    },
    watch:{
      'caseDetailFoemData.caseId'(n){
        if(n){
          if(!this.tabName) {
            this.getTabName()
          }
        }
      },
      activeName(n){
        if(['case_detail','seeCaseDetail'].includes(this.$route.name)){
          if(!this.tabName){
            let obj = {'caseId': this.caseDetailFoemData.caseId,routeName:this.$route.name,'name': this.activeName}
            localStorage.setItem('tabName', JSON.stringify(obj))
          }
        }else {
          let obj = {routeName:this.$route.name,'name': this.activeName}
          localStorage.setItem('caseTabName', JSON.stringify(obj))
        }
      }
    }
  }
</script>

<style scoped>

</style>
