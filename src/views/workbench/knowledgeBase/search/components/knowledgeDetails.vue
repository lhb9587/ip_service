<template>
  <div class="marAuto">
    <div class="detail_wrap" v-if="Object.keys(pageData).length">
    <p class="header" v-for="(item,key) in part1">
      {{pageData[item.property]}}
    </p>
    <div class="app_wrap" v-if="part2.length">
      <p class="app_p" v-for="(item,key) in part2" v-if="pageData[item.property]">
        <b v-if="item.property!=='address'">{{item.propertyName}}:</b>
        <span class="corblur" v-if="item.property=='address'">
          <a target="_blank" :href="`ipdoc/${pageData[item.property]}`">原文查看</a></span>
            <span class="span_content" v-else>
              <span v-if="Object.prototype.toString.call(pageData[item.property]).includes('Array')">
              {{pageData[item.property].join(',')}}
             </span>
               <span v-else>
              {{pageData[item.property]}}
            </span>
        </span>
      </p>
    </div>
    <ul class="casedetail_nn" v-for="(item,key) in part3" v-if="pageData[item.property]">
      <li><a name="m1" id="m1"></a>
        <div class="casedetail_nn_tit"><i></i>
          <span>{{item.propertyName}}：</span></div>
        <div class="casedetail_nn_n">
          <div v-if="item.property=='shenqingren'" v-html="formatHtml(pageData[item.property])">
          </div>
          <div v-else-if="item.elementType=='tags'" >
            <el-tag
              class="keyword_tag"
              :key="tag"
              v-for="tag in pageData[item.property]"
              :disable-transitions="false"
              @click="handleClick(tag)">
              {{tag}}
            </el-tag>
          </div>
          <div v-else v-html="pageData[item.property]">
          </div>
        </div>
      </li>
    </ul>
<!--    <div class="app_wrap">-->
<!--      <p class="app_p"><b>案号:</b><span>{{pageData.agentNum}}</span></p>-->
<!--      <p class="app_p"><b >裁定结果:</b><span>{{pageData.cdResult}}</span></p>-->
<!--      <p class="app_p"><b >裁定日期:</b><span>{{pageData.docDate}}</span></p>-->
<!--    </div>-->
<!--    <ul class="casedetail_nn">-->
<!--    <li><a name="m1" id="m1"></a>-->
<!--      <div class="casedetail_nn_tit"><i></i>-->
<!--        <span>当事人：</span></div>-->
<!--      <div class="casedetail_nn_n">-->
<!--        &emsp;&emsp;再审申请人(一审原告、二审被上诉人):吴小秦,陕西省咸阳市工商行政管理局渭城分局职工。-->
<!--        <br>&emsp;&emsp;委托代理人:郭晖,陕西五功律师事务所律师<br>&emsp;&emsp;-->
<!--        被申请人(一审被告、二审上诉人):陕西广电网络传媒(集团)股份有限公司。住所地:陕西省西安市高新一路15号。-->
<!--        <br>&emsp;&emsp;法定代表人:吕晓明,该公司董事长。-->
<!--        <br>&emsp;&emsp;委托代理人:禄子文,陕西海普睿诚律师事务所律师。-->
<!--        <br>&emsp;&emsp;委托代理人:黄世岭,陕西海普睿诚律师事务所律师。</div>-->
<!--    </li>-->
<!--    </ul>-->
<!--    <ul class="casedetail_nn">-->
<!--      <li><a name="m1" id="m1"></a>-->
<!--        <div class="casedetail_nn_tit"><i></i>-->
<!--          <span>当事人：</span></div>-->
<!--        <div class="casedetail_nn_n">-->
<!--          &emsp;&emsp;再审申请人(一审原告、二审被上诉人):吴小秦,陕西省咸阳市工商行政管理局渭城分局职工。-->
<!--          <br>&emsp;&emsp;委托代理人:郭晖,陕西五功律师事务所律师<br>&emsp;&emsp;-->
<!--          被申请人(一审被告、二审上诉人):陕西广电网络传媒(集团)股份有限公司。住所地:陕西省西安市高新一路15号。-->
<!--          <br>&emsp;&emsp;法定代表人:吕晓明,该公司董事长。-->
<!--          <br>&emsp;&emsp;委托代理人:禄子文,陕西海普睿诚律师事务所律师。-->
<!--          <br>&emsp;&emsp;委托代理人:黄世岭,陕西海普睿诚律师事务所律师。</div>-->
<!--      </li>-->
<!--    </ul>-->
<!--    <ul class="casedetail_nn">-->
<!--      <li><a name="m1" id="m1"></a>-->
<!--        <div class="casedetail_nn_tit"><i></i>-->
<!--          <span>当事人：</span></div>-->
<!--        <div class="casedetail_nn_n">-->
<!--          &emsp;&emsp;再审申请人(一审原告、二审被上诉人):吴小秦,陕西省咸阳市工商行政管理局渭城分局职工。-->
<!--          <br>&emsp;&emsp;委托代理人:郭晖,陕西五功律师事务所律师<br>&emsp;&emsp;-->
<!--          被申请人(一审被告、二审上诉人):陕西广电网络传媒(集团)股份有限公司。住所地:陕西省西安市高新一路15号。-->
<!--          <br>&emsp;&emsp;法定代表人:吕晓明,该公司董事长。-->
<!--          <br>&emsp;&emsp;委托代理人:禄子文,陕西海普睿诚律师事务所律师。-->
<!--          <br>&emsp;&emsp;委托代理人:黄世岭,陕西海普睿诚律师事务所律师。</div>-->
<!--      </li>-->
<!--    </ul>-->
<!--    <ul class="casedetail_nn">-->
<!--      <li><a name="m1" id="m1"></a>-->
<!--        <div class="casedetail_nn_tit"><i></i>-->
<!--          <span>当事人：</span></div>-->
<!--        <div class="casedetail_nn_n">-->
<!--          &emsp;&emsp;再审申请人(一审原告、二审被上诉人):吴小秦,陕西省咸阳市工商行政管理局渭城分局职工。-->
<!--          <br>&emsp;&emsp;委托代理人:郭晖,陕西五功律师事务所律师<br>&emsp;&emsp;-->
<!--          被申请人(一审被告、二审上诉人):陕西广电网络传媒(集团)股份有限公司。住所地:陕西省西安市高新一路15号。-->
<!--          <br>&emsp;&emsp;法定代表人:吕晓明,该公司董事长。-->
<!--          <br>&emsp;&emsp;委托代理人:禄子文,陕西海普睿诚律师事务所律师。-->
<!--          <br>&emsp;&emsp;委托代理人:黄世岭,陕西海普睿诚律师事务所律师。</div>-->
<!--      </li>-->
<!--    </ul>-->
<!--    <ul class="casedetail_nn">-->
<!--      <li><a name="m1" id="m1"></a>-->
<!--        <div class="casedetail_nn_tit"><i></i>-->
<!--          <span>当事人：</span></div>-->
<!--        <div class="casedetail_nn_n">-->
<!--          &emsp;&emsp;再审申请人(一审原告、二审被上诉人):吴小秦,陕西省咸阳市工商行政管理局渭城分局职工。-->
<!--          <br>&emsp;&emsp;委托代理人:郭晖,陕西五功律师事务所律师<br>&emsp;&emsp;-->
<!--          被申请人(一审被告、二审上诉人):陕西广电网络传媒(集团)股份有限公司。住所地:陕西省西安市高新一路15号。-->
<!--          <br>&emsp;&emsp;法定代表人:吕晓明,该公司董事长。-->
<!--          <br>&emsp;&emsp;委托代理人:禄子文,陕西海普睿诚律师事务所律师。-->
<!--          <br>&emsp;&emsp;委托代理人:黄世岭,陕西海普睿诚律师事务所律师。</div>-->
<!--      </li>-->
<!--    </ul>-->
      <FunctionalModule v-if="pageData.id" :id="pageData.id" :pageData="pageData"></FunctionalModule>
  </div>
    <div class="flex_right" >
      <el-popover
        v-if="pageData.regNumber||pageData.quoteRegNumber"
        placement="right"
        :width="982"
        trigger="click">
        <TrademarkInvolved
          :regNumber="pageData.regNumber"
          :quoteRegNumber="pageData.quoteRegNumber"></TrademarkInvolved>
        <el-card slot="reference" class="box-card">
          涉及商标
        </el-card>
<!--        <el-button slot="reference" type="primary" size="small" @click="queryDetail(item,'involved')">涉及商标</el-button>-->
      </el-popover>
      <el-collapse class="laws_and_regulations" v-model="activeNames" v-if="part4.length">
        <el-collapse-item title="引用法规" name="1">
          <ul class="clause" v-for="(item,key) in part4">
            <li v-for="(itm,key) in pageData[item.property]">
              {{itm}}
            </li>
          </ul>
        </el-collapse-item>
      </el-collapse>

    </div>
  </div>
</template>

<script>
  import qs from 'qs'
  import {queryDocDetail} from '@/api/knowledgeBase.js'
  import {mapState} from "vuex";
  import TrademarkInvolved from './TrademarkInvolved.vue'
  import FunctionalModule from '../../components/FunctionalModule'
  export default {
    name: "knowledgeDetails",
    data(){
      return {
        pageData:{},
        propertyList:[],
        part1:[],
        part2:[],
        part3:[],
        part4:[],
        activeNames:'1'
      }
    },
    created() {
      this.getHtml()
      this.queryDocDetail(this.$route.query.id)
    },
    methods:{
      formatHtml(text){
        return text.split('\n').map(item=>`<p>${item}</p>`).join('')
      },
      handleClick(tag){
        let data = Object.assign({tokenID:this.$store.state.knowledgeBase.defaultTokenData.tokenID},{keyword:tag,scId:7})
        let href = `#/workbench/knowledgeBase?${qs.stringify(data)}`
        window.open(href, '_blank');
      },
      getHtml(){
        this.part1=this.propertyList.filter(item=>item.location==1).sort(this.$commonUtils.compare('sequnce'))
        this.part2=this.propertyList.filter(item=>item.location==2).sort(this.$commonUtils.compare('sequnce'))
        this.part3=this.propertyList.filter(item=>item.location==3).sort(this.$commonUtils.compare('sequnce'))
        this.part4=this.propertyList.filter(item=>item.location>200)
      },
      queryDocDetail(id){
        queryDocDetail(Object.assign({tokenID:this.$store.state.knowledgeBase.defaultTokenData.tokenID},{id})).then(res=>{
            this.pageData=res.data
        })
      }
    },
    watch:{
      "propertyData":{
        handler(n,o){
          if(n[`property${this.$route.query.firtStId}`]){
            this.propertyList=n[`property${this.$route.query.firtStId}`].filter(item => item.showit==1)
            this.getHtml()
          }
        },
        deep: true,
      }
    },
    components:{
      TrademarkInvolved,FunctionalModule
    },
    computed:{
      ...mapState({
        'activeName': state => state.knowledgeBase.activeName,
        'propertyData': state => state.knowledgeBase.propertyData,
      })
    }
  }
</script>

<style lang="scss" scoped>
  .marAuto{
    position: relative;
    width: 982px;
    margin: 10px auto;
  }
  .detail_wrap{
    min-height: 800px;
    /*display: flex;*/
    box-shadow: 0px 0 10px rgba(0,0,0,.2);
    .header{
      font-size: 20px;
      font-weight: 700;
      text-indent: 20px;
      height: 50px;
      line-height: 60px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .app_wrap{
    margin: 10px 0;
    padding: 20px;
    border: 1px dashed #c9c9c9;
    display: flex;
    flex-wrap: wrap;
    /*justify-content: space-between;*/
    p{
      width:33%;
      /*height: 32px;*/
      line-height: 32px;
      .span_content{
        font-size: 14px;
        margin-left: 20px;
      }
    }
  }
  .casedetail_nn {
    margin-bottom: 20px;
    .casedetail_nn_n {
      color: #333333;
      padding: 20px;
      line-height: 30px;
      font-size: 16px;
      margin-top: 6px;
      text-align: justify;
      word-break: break-all;
      word-wrap: break-word;
    }

    .casedetail_nn_tit {
      display: inline-block;
      width: 100%;
      padding: 5px;
      color: #333333;
      line-height: 30px;
      font-size: 16px;
      position: relative;
      left: 10px;
      i {
        background: url(https://www.iphouse.cn/static/images/bt_bg.png) no-repeat left top;
        margin-left: -20px;
        width: 5px;
        height: 34px;
        float: left;
      }
      span {
        color: #ffffff;
        font-size: 16px;
        padding: 4px 10px;
        background-color: #0e88eb;
        float: left;
        margin-left: -15px;
        line-height: 22px;
      }
    }
  }
  .corblur{
    color: #00b0ff;
    text-decoration: underline;
    text-underline: #00b0ff;
    margin: 0 !important;
  }
  .flex_right{
    width: 350px;
    position: absolute;
    left: 1000px;
    top: 0;
    .box-card{
      text-align: center;
      margin-bottom: 20px;
    }
    .laws_and_regulations{
      /deep/ .el-collapse-item__wrap{
        border: 0;
      }
      box-shadow: 0px 0 10px rgba(0,0,0,.2);
      padding: 20px;
      .clause{
       li{
         border-bottom: 1px dashed #ddd;
       }
      }
    }
  }
  .keyword_tag{
    margin-right: 10px;
    cursor: pointer;
  }
  /deep/ img{
    max-width: 100%;
  }
</style>
