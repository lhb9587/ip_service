<template>
  <ul  v-infinite-scroll="load"   class="scroll_wrap" :style="{height:type==1 ?'400px':'auto',overflow: 'auto'}"  >
    <li class="list_Item" v-for="item in list">
<!--      <div class="case-list-top">-->
<!--        <div class="case-tag">-->
<!--          <dd>注册公告</dd>-->
<!--          <dd>无效宣告请求</dd>-->
<!--          <dd>争议商标予以维持</dd>-->
<!--        </div>-->
<!--      </div>-->
      <p class="title" @click="takeDetail(item.id,item.firtStId)">{{item.title}}</p>
      <rulingDocumentCard  v-if="item.firtStId==1" :detail="item">
        <div class="content_warp">
          <div class="shenlijg">
            <getRegNumImg v-if="item.regNumber" :regNumber="item.regNumber"></getRegNumImg>
            <el-popover
              placement="right"
              :width="popoverWidth"
              trigger="click">
              <TrademarkInvolved
                v-if="item.detail"
                :regNumber="item.regNumber"
                :quoteRegNumber="item.quoteRegNumber"></TrademarkInvolved>
              <el-button slot="reference"  type="text" size="small" @click="queryDetail(item,'involved',$event)">更多</el-button>
            </el-popover>

          </div>
        </div>
      </rulingDocumentCard>
      <template v-if="item.firtStId==14">
      <div class="content_warp">
          <div class="shenlijg" v-if="item.shenlijg">
            {{item.shenlijg}}
          </div>
        <div style="width: 100%;display: flex;flex-direction: column;justify-content: space-between">


          <div class="shenlijg" v-if="item.content" v-text="item.content.replace(/(<\/?.+?\/?>|&#xa0;)/g,'')">
          </div>
        <FunctionalModule v-if="item.id" :id="item.id" :pageData="item"></FunctionalModule>
        </div>

<!--          <div class="button_warp">-->
<!--            <el-popover-->
<!--              placement="right"-->
<!--              :width="popoverWidth"-->
<!--              trigger="click">-->
<!--              <TrademarkInvolved-->
<!--                v-if="item.detail"-->
<!--                :regNumber="item.detail.regNumber"-->
<!--                :quoteRegNumber="item.detail.quoteRegNumber"></TrademarkInvolved>-->
<!--              <el-button slot="reference" type="primary" size="small" @click="queryDetail(item,'involved')">涉及商标</el-button>-->
<!--            </el-popover>-->

<!--            <el-popover-->
<!--              placement="right"-->
<!--              :width="popoverWidth"-->
<!--              height="400"-->
<!--              trigger="click">-->
<!--              <party  v-if="item.detail" :item="item.detail"></party>-->
<!--              <el-button  slot="reference"  type="primary" size="small" @click="queryDetail(item,'party')">当事人</el-button>-->
<!--            </el-popover>-->
<!--            <el-popover-->
<!--              placement="right"-->
<!--              :width="popoverWidth"-->
<!--              trigger="click">-->
<!--              <information  v-if="item.detail" :item="item.detail"></information>-->
<!--              <el-button slot="reference" type="primary" size="small" @click="queryDetail(item,'information')">裁决信息</el-button>-->
<!--            </el-popover>-->
<!--          </div>-->
          <div class="button_warp">
            <el-popover
              placement="right"
              :width="popoverWidth"
              trigger="click">
              <authorComponent  :item="item"></authorComponent>
              <el-button slot="reference" type="primary" size="small" @click="setPopoverWidth($event)">作者</el-button>
            </el-popover>
            <el-popover
              placement="right"
              :width="popoverWidth"
              trigger="click">
              <keyWordComponent  :item="item"></keyWordComponent>
              <el-button slot="reference" type="primary" size="small" @click="setPopoverWidth($event)">关键词</el-button>
            </el-popover>
          </div>
      </div>
      </template>

    </li>
  </ul>
</template>

<script>
  import FunctionalModule from '../../components/FunctionalModule'
  import {queryDocDetail,queryDocBystId} from '@/api/knowledgeBase.js'
  import information from './information'
  import party from './party'
  import authorComponent from "./authorComponent";
  import keyWordComponent from "./keyWordComponent";
  import TrademarkInvolved from './TrademarkInvolved.vue'
  import rulingDocumentCard from "./rulingDocumentCard";
  import getRegNumImg from './getRegNumImg'
  import qs from 'qs'
  export default {
    props:{
      list:{
        default:()=>([])
      },
      type:{
        default:2
      },
      stId:{

      },
      activeName:{

      }
    },
    data(){
      return{
        popoverWidth:'0',
        pageSize:10,
        pageNo:1,
        flag:false
      }
    },
    created() {
      // this.load()
    },
    components:{
      information,party,TrademarkInvolved,authorComponent,keyWordComponent,FunctionalModule,rulingDocumentCard,getRegNumImg
    },
    mounted() {
      setTimeout(()=>{
        if(!this.flag){
          this.load()
        }
      })
    },
    name: "knowledgeCard",
    methods:{
      load(){
        this.flag=true
        if(!this.stId){
          return
        }
        this.queryDocBystId(this.stId)
        this.pageNo++
      },
      queryDocBystId(stId) {

        let queryData = JSON.parse(JSON.stringify(Object.assign({tokenID:this.$store.state.knowledgeBase.defaultTokenData.tokenID}, {stId,pageSize:this.pageSize,pageNo:this.pageNo})))
        queryDocBystId(queryData).then(res => {
          this.$store.commit('knowledgeBase/CHANGE_DOCSTEUCTURE', {stId, data: res.data,total:res.total,activeName:this.activeName})

        })
      },
      takeDetail(id,firtStId){
        let href=`#/workbench/knowledgeBase?${qs.stringify({id,firtStId})}`
        window.open(href, '_blank');
      },
      setPopoverWidth(event){
        this.popoverWidth=getComputedStyle(event.path.find(item => item.className == 'content_warp').querySelector('.shenlijg')).getPropertyValue("width").replace('px', '')
      },
      queryDetail(item,type,event){
        if(item.detail){
          return
        }
       let {id} =item
        this.popoverWidth=getComputedStyle(event.path.find(item => item.className == 'list_Item').querySelector('.app_wrap')).getPropertyValue("width").replace('px','')
        this.$set(item,'detail',true)
        // queryDocDetail(Object.assign({tokenID:this.$store.state.knowledgeBase.defaultTokenData.tokenID},{id})).then(res=>{
        //
        //   // item.detail=res.data[0]
        //   // this.queryDetail(item,type)
        // })
      },

    },
  }
</script>

<style lang="scss" scoped>

  .list_Item{
    margin: 20px;
    padding: 10px;
    border:1px solid #ccc;
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
      width:1000px;
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
    .content_warp{
      display: flex;
      .shenlijg{
        padding: 0 60px 0 0;
        color: #333;
        font-size: 14px;
        flex: 1;
        display: -webkit-box;
        display: -moz-box;
        text-overflow: -o-ellipsis-lastline;
        text-overflow: ellipsis;
        overflow: hidden;
        -webkit-line-clamp:3; /*控制文本行数，多少行以后开始省略号 */
        line-clamp:3;
        -webkit-box-orient: vertical;
        line-height: 18px;
      }
      .button_warp{
        position: relative;
        min-height: 80px;
        display: flex;
        flex-wrap:wrap ;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-end;
        .el-button{
          width: 86px;
          height: 34px;
        }
        &:after{
          content: '';
          position: absolute;
          left: -20px;
          top: 50%;
          transform: translateY(-50%);
          height: 88px;
          width: 1px;
          background: #d7d8d9;
        }
      }
    }
  }
  /deep/ .functionalModule{
    padding-bottom: 0;
    padding-top: 10px;
  }
</style>
