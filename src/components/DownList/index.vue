<template>
  <div>
    <svg-icon class="downIcon" v-if="minimize" @click="minimize=false" style="cursor: pointer" icon-class="下载最小化"/>
    <transition name="pretty" >
    <div class="downLoadList" v-if="!minimize" :class="!minimize?'minimize':''">
      <div class="icon_title">
       <p>下载文件列表</p> <svg-icon @click="minimize=true" style="cursor: pointer" icon-class="最小化"/>
      </div>
      <div class="downLoadItem_wrap">
        <div class="downLoadItem" v-for="item in downLoadList">
          <svg-icon  style="font-size: 32px; vertical-align: middle;" :icon-class="getSuffix(item.url)"/>
          <span style="font-size: 14px"> {{item.url.replace(/(.*\/)*([^.]+).*/ig,"$2",'')+'.'+item.url.replace(/.+\./,"")}}</span>
          <span style="margin-right: 10px;line-height: 32px;font-size: 12px;float: right"> 下载完成</span>
        </div>
      </div>
    </div>
    </transition>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: "index",
  data(){
    return {
      minimize: true
    }
  },
  methods:{
    getSuffix(url){
      if(['pdf'].includes(url.replace(/.+\./,""))){
        return 'pdf'
      }
      if(['docx','doc'].includes(url.replace(/.+\./,""))){
        return 'word'
      }
      if(['xlsx','xls'].includes(url.replace(/.+\./,""))){
        return 'excel'
      }
      if(['msg'].includes(url.replace(/.+\./,""))){
        return 'msg'
      }
      return '文件'
    }
  },
  watch:{
    downLoadList:{
      handler(n,o){
        if(n.length){
          // this.minimize=false
        }
      },
      deep:true
    }
  },
  computed:{
    ...mapState({
      'downLoadList': state => state.caseInformation.downLoadList
    })
  }
}
</script>

<style lang="scss" scoped>
  /*.minimize{*/
  /*  right: 0 !important;*/
  /*  bottom: 0!important;*/
  /*  !*transform: translate3d(0px,0px) !important;*!*/
  /*}*/
  .downLoadList{
    position: fixed;
    right: 0;
    bottom: 0;
    width: 500px;
    height: 400px;
    display: flex;
    flex-direction: column;
    z-index: 10000;
    background: #fff;
    border-radius: 5px;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    /*transform: translate3d(500px,400px);*/
    /*transition: all 2s;*/
    .icon_title{
      overflow: hidden;
      /*height: 20px;*/
      display: flex;
      justify-content: space-between;
      font-size: 20px;
      padding:5px;
      align-items: center;
      p{
        margin-left: 12px;
        font-size:16px;
      }
    }
    .downLoadItem_wrap{
      display: flex;
      flex-direction: column;
      flex: 1;
      margin-left: 10px;
      overflow: auto;
      margin-bottom: 10px;
    }
  }
  .downIcon{
    font-size: 20px;
    position: fixed;
    right: 0;
    bottom: 10px;
    cursor: pointer;
    z-index: 9999;
  }
  .pretty-enter,
  .pretty-leave-to {
    opacity: 0;
    transform: translate(500px,400px);
  }

  .pretty-enter-active,
  .pretty-leave-active {
    transition: all 0.5s ease;
  }
</style>
