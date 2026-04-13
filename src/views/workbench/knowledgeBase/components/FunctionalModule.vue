<template>
    <div class="functionalModule">
      <ul class="FunctionalModule_wrap">
        <li class="item_li">
          <svg-icon @click="handleClick('collectionState',true,2)"  v-if="!moduleData.collectionState" icon-class="收 藏"/>
          <svg-icon @click="handleClick('collectionState',false,2)" v-else style="color: red" icon-class="收藏我的"/>
          收藏
         </li>
        <li class="item_li">
          <svg-icon @click="handleClick('commentState',!moduleData.commentState)"  icon-class="评 论"/>评论({{commentNum}})</li>
        <li >
          <svg-icon @click="handleClick('fabulousState',true,1)"  v-if="!moduleData.fabulousState" icon-class="点赞默认"/>
          <svg-icon @click="handleClick('fabulousState',false,1)" v-else style="color: red" icon-class="点赞"/>
          赞</li>
      </ul>
      <comment v-if="moduleData.commentState" :docId="id" :pageData="pageData" @addNum="(num)=>commentNum+=num"></comment>
    </div>
</template>

<script>
  import {  updateDocCensus,addComment } from '@/api/knowledgeBase'

  import comment from "./comment";
export default {
  props:{
    id:{

    },
    pageData:{

    }
  },
  name: "FunctionalModule",
  data() {
    return {
      moduleData:{
        collectionState: false,
        fabulousState: false,
        commentState: false
      },
      commentNum:0
    }
  },
  created() {
    this.moduleData.collectionState=Boolean(this.pageData.collect)
    this.moduleData.fabulousState=Boolean(this.pageData.praise)
    if(this.pageData.docCommentList&&this.pageData.docCommentList.length){
      this.commentNum= this.pageData.docCommentList.reduce((pre,next)=>pre+next.docReplyArray.length+1,0)
    }

  },
  methods:{
    handleClick(moduleType, bool,type) {
      if(type){
        updateDocCensus({type,action:Number(bool),id:this.id})
      }

      this.moduleData[moduleType] = bool
    }
  },
  components: {
    comment
  }
}
</script>

<style lang="scss" scoped>
.svg-icon{
  cursor: pointer
}
  .FunctionalModule_wrap{
    display: flex;
    li{
      text-align: center;
      flex: 1;
    }
  }
  .functionalModule{
    padding-bottom: 20px;
  }
  .item_li{
    border-right:1px solid #ccc;
  }
</style>
