<template>
<div  style="width: 100%;">

  <template v-if="flag&&docStructure[activeName]&&docStructure[activeName].childList">
    <div class="Page_title_wrap" v-for="item in docStructure[activeName].childList">
      <header class="page_title"><svg-icon icon-class="天平"/>{{item.stName}}</header>
      <el-tabs class="first_tabs" tab-position="left" style="height: 400px;" type="border-card" >

        <el-tab-pane  :label="itm.stName" v-for="itm in item.childList"  >
          <el-tabs class="inside_tabs" tab-position="top" v-model="itm.activeName" type="card"  v-if="itm.childList&&itm.childList.length">
            <el-tab-pane :label="i.stName" :name="i.stName" v-for="i in itm.childList">
              <knowledgeCard :activeName="activeName" :stId="i.stId" :type="1" :list="i.detailList"></knowledgeCard>
            </el-tab-pane>
          </el-tabs>
          <knowledgeCard v-else :activeName="activeName"    :stId="itm.stId" :type="1" :list="itm.detailList"></knowledgeCard>
        </el-tab-pane>
      </el-tabs>
    </div>
  </template>
</div>
</template>

<script>
  import knowledgeCard from "./knowledgeCard";
  import {mapState} from "vuex";
  export default {
    name: "firstLevelPage",
    data(){
      return {
         list:[],
        flag:true
      }
    },
    methods:{
      load(){
        console.log('触底')
      }
    },
    components:{
      knowledgeCard
    },
    watch:{
      'activeName'(n,o){
        if(n){
          this.flag=false
          this.$nextTick(()=>{
            this.flag=true
          })
        }
      }
      // docStructure:{
      //   handler(n,o){
      //     this.list=JSON.parse(JSON.stringify(n))
      //     console.log(this.list,233);
      //   },
      //   deep:true,
      //   immediate:true
      // }
    },
    computed:{
      ...mapState({
        'activeName': state => state.knowledgeBase.activeName,
        docStructure: state => state.knowledgeBase.docStructure,


      })
    }
  }
</script>

<style lang="scss" scoped>
  .Page_title_wrap /deep/{
    padding: 10px 0;
    .page_title{
        height: 30px;
      line-height: 30px;
      font-size: 16px;
    }
    .el-tabs__nav.is-left{
      display: flex;
      height: 100%;
      background: #fff;
      /*flex-wrap:wrap ;*/
      flex-direction: column;
      width: 100px;
      /*justify-content: space-between;*/
      .el-tabs__item.is-left{
        /*flex: 1;*/
        margin: 0;
        background: #f3f3f3;
        border: 1px #e1e5e9 solid;
        width: 100%;
        margin-bottom: 20px;
        padding: 0;
        text-align: center;
      }
      .el-tabs__item.is-left:nth-last-child(1){
        margin-bottom: 0px;
      }
      .is-left.is-active{
        background: #fff;
        border: 1px #bdd3e9 solid;
        border-right:1px solid #fff;
        position: relative;
        &:after{
          background: #fff;
          width: 1px;
          height: 100%;
          right: -2px;
          content: '';
          position: absolute;
          z-index: 1000;
        }
        &:before{
          content: '';
          width: 2px;
          height: 20px;
          background: #d01822 ;
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
        }
      }

    }
    .first_tabs{
      display: flex;
      .el-tabs__header.is-left{
        margin: 0;
        border-right: 1px #bdd3e9 solid;
        position: relative;
        z-index: 10;

        border-bottom: 0
      }
      .el-tabs__header.is-left+.el-tabs__content{
        flex: 1;
        border: 1px #bdd3e9 solid;
        overflow: hidden;
        padding: 0;
      }

    }
    .inside_tabs{
      .scroll_wrap{
       height: 350px !important;
      }
    }
    .el-tabs--border-card {
      background: #FFF;
      border: 0;
      -webkit-box-shadow: 0 0 0 ;
      box-shadow: 0 0 0;
      .el-tabs__nav-wrap{
        overflow: visible;
      }
      .el-tabs__nav-scroll{
         overflow: visible;
       }
      .is-top{
        .el-tabs__nav-scroll{
          overflow: hidden;
        }
        .el-tabs__nav-wrap{
          overflow: hidden;
        }
      }
    }
  }

</style>
