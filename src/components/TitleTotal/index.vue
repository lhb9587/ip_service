<template>
  <div class="title_total" v-if="total>0" >共计 : &nbsp;{{total}} <span v-if="currentPageSize" style="margin-left: 10px">本页 :{{currentPageSize}}</span></div>
</template>

<script>
export default {
  props:{
    total:{

    },
    currentPageSize:{

    }
  },
  name: "index"
}
</script>

<style lang="scss" scoped>
  .title_total{
    padding-left: 15px;
    height:30px;
    font-size:12px;
    line-height:30px;
    font-family:Source Han Sans CN;
    font-weight:bold;
    color:rgba(254,153,23,1);
  }
</style>
