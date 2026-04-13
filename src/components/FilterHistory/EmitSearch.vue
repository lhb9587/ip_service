<template>

</template>

<script>
  import { mapState } from 'vuex'
  export default {
    name: "EmitSearch",
    computed:{
      ...mapState({
        'filterValue':state => state.caseInformation.filterValue,
        'bussId':state => state.caseInformation.bussId,
      }),
    },
    watch: {
      filterValue(n){
        if(n){
          this.$emit('undateSearch',{bussId:this.bussId,value:n})
          this.$store.commit('caseInformation/SET_CLOSEFLAG',true)
        }
      },
    }
  }
</script>

<style lang="scss" scoped>

</style>
