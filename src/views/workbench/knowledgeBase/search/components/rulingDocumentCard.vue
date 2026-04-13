<template>
  <div class="rulingDocumentCard">
    <div class="app_wrap">
      <div class="app_p" v-html="getHtml(detail.shenqingren)">
      </div>
  <!--    <p class="app_p"><b >代理机构:</b><span>{{detail.agentPerson?detail.agentPerson.join(' '):''}}</span></p>-->
  <!--    <p class="app_p"><b >被申请人:</b><span>{{detail.respondentNameCn?detail.respondentNameCn.join(' '):''}}</span></p>-->

  <!--    <p class="app_p"><b>裁定结果:</b><span>{{detail.cdResult}}</span></p>-->
      <p class="app_p"><b >裁定日期:</b><span>{{detail.docDate}}</span></p>
      <p class="app_p"><b >裁定摘要:</b><span>{{detail.caiding}}</span></p>
      <p class="app_p"><b >热词:</b><span>{{detail.keyName}}</span></p>

  <!--    <p class="app_p"><b >裁定支持法律条款:</b><span>{{detail.law1Array.join('&nbsp;')}}</span></p>-->
    </div>
    <slot></slot>
  </div>
</template>

<script>
  export default {
    props:{
      detail:{}
    },
    name: "rulingDocumentCard",
    methods:{
      getHtml(str){
        return  str.split('\r\n').map(item=>`<p class="app_p"><b>`+item.split(':').join(`:</b><span>`)+`</span></p>`).join('')
      }
    }
  }
</script>

<style lang="scss" scoped>
.app_wrap{
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
 /deep/ p{
    width:100%;
    /*height: 32px;*/
    line-height: 32px;
    span{
      font-size: 14px;
      margin-left: 20px;
    }
  }
}
  .rulingDocumentCard{
    display: flex;
  }
</style>
