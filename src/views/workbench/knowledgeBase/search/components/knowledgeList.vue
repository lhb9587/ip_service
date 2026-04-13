<template>
  <div>
    <knowledgeCard :list="curList"></knowledgeCard>
<!--    <ul>-->
<!--      <li class="list_Item" v-for="item in curList">-->
<!--        <div class="case-list-top">-->
<!--          <div class="case-tag">-->
<!--            <dd>注册公告</dd>-->
<!--            <dd>无效宣告请求</dd>-->
<!--            <dd>争议商标予以维持</dd>-->
<!--          </div>-->
<!--        </div>-->
<!--       <p class="title" @click="takeDetail(item.id)">{{item.title}}</p>-->
<!--        <p>{{item.shenlijg}}</p>-->
<!--      </li>-->
<!--      </ul>-->
    <Pagination class="Pagination" :total="total" :pageSizes="[10]" @pagination="queryList"></Pagination>
  </div>
</template>

<script>
  import knowledgeCard from './knowledgeCard'
  import qs from 'qs'
  import {mapState } from "vuex";
import Pagination from '@/components/Pagination'
  export default {
    name: "knowledgeList",
    computed:{
      ...mapState({
        'curList': state => state.knowledgeBase.curList,
        total: state => state.knowledgeBase.curTotal,
      })
    },
    props:{
      queryData:{

      }
    },
    methods:{
      queryList({page}){
        let data={}
        if(!this.queryData){
          for (var key in this.$route.query){
            data[key] = this.$route.query[key]
          }
        }else {
          data=this.queryData
        }

        data.pageNo=page


        if(this.queryData){
          this.$emit('updataDataStore',data)
        }else {
          this.$router.push({query:data})
        }

        //this.$router.replace({query:data})
      },
      takeDetail(id){
        let href=`#/workbench/knowledgeBase?${qs.stringify({id})}`
        window.open(href, '_blank');
      }
    },
    components:{
      Pagination,knowledgeCard
    }
  }
</script>

<style lang="scss" scoped>
  /*@import "reviewcases.css";*/
 .list_Item{
   margin: 20px;
   .case-list-top{
     height: 36px;
     line-height: 36px;
     .case-tag {
       float: right;
       height: 36px;
       line-height: 36px;
       display: flex;
       justify-content: right;
       dd {
         display: inline-block;
         padding: 0 8px 0 18px;
         background: #f5f5f6 url(../images/tag-top.png) no-repeat 8px;
         line-height: 28px;
         height: 28px;
         margin-right: 6px;
         font-size: 12px;
         color: #999;
       }
     }
   }
    .title{
      cursor: pointer;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 80%;
      display: block;
      white-space: nowrap;
      color: #337ab7;
      font-family: "PingFang SC", "Lantinghei SC", "Microsoft YaHei", Helvetica, Arial, sans-serif, Helvetica, Arial, sans-serif;
      font-size: 18px;
      height: 30px;
      &:hover{
       color:  #23527c;
      }
    }
 }
  .Pagination /deep/{
      position: relative;
      .el-pagination{
        position: absolute;
        right: 0;
      }
  }
</style>
