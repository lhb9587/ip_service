<template>
  <div class="app_wrap">
    <p class="app_p"><b>申请人:</b><span>{{item.appCnName?item.appCnName.join(' '):''}}</span></p>
    <p class="app_p"><b >代理机构:</b><span>{{item.agentPerson?item.agentPerson.join(' '):''}}</span></p>
    <p class="app_p"><b >被申请人:</b><span>{{item.respondentNameCn?item.respondentNameCn.join(' '):''}}</span></p>
  </div>
</template>

<script>
  export default {
    name: "party",
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
      width: 50%;
      height: 32px;
      line-height: 32px;
      span{
        font-size: 14px;
        margin-left: 20px;
      }
    }
  }
</style>
