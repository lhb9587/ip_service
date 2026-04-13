<template>
  <div class="app_wrap">
    <p class="app_p"><b>裁定结果:</b><span>{{item.cdResult}}</span></p>
    <p class="app_p"><b >裁定日期:</b><span>{{item.docDate}}</span></p>
    <p class="app_p"><b >裁定摘要:</b><span>{{item.caiding}}</span></p>
    <p class="app_p"><b >裁定支持法律条款:</b><span>{{item.law1.join('&nbsp;')}}</span></p>
    <p class="app_p"><b >概要:</b><span>{{item.gaiyao}}</span></p>
  </div>
</template>

<script>
  export default {
    name: "information",
    props:{
      item:{}
    }
  }
</script>

<style lang="scss" scoped>
  .app_wrap{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    p{
      width:100%;
      /*height: 32px;*/
      line-height: 32px;
      span{
        font-size: 14px;
        margin-left: 20px;
      }
    }
  }
</style>

