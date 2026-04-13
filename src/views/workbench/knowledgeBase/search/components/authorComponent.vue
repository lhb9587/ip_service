<template>
  <div class="app_wrap">
    <p class="app_p">
      <el-tag
      class="keyword_tag"
      :key="tag"
      v-for="tag in item.authorArray"
      :disable-transitions="false"
      @click="handleClick(tag)">
      {{tag}}
    </el-tag>
    </p>
  </div>
</template>

<script>
  import qs from 'qs'
  export default {
    name: "authorComponent",
    props:{
      item:{}
    },
    methods:{
      handleClick(tag){
        let data=Object.assign({tokenID:this.$store.state.knowledgeBase.defaultTokenData.tokenID},{keyword:tag,scId:7})
        let href=`#/workbench/knowledgeBase?${qs.stringify(data)}`
        window.open(href, '_blank');
      }
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
  .keyword_tag{
    margin-right: 10px;
    cursor: pointer;
  }
</style>
