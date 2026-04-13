<template>
  <div class="rightPanel-background">
    <div class="button_wrap">
      <template v-for="item in applicationManagement.filter(item=>!item.flag)">
        <el-popover
          v-if="item.name === '模板生成' && mbData.length && (!item.permissions || $store.getters.permissions.includes(item.permissions))"
          placement="left"
          width="400"
          trigger="click">
            <div v-if="!noContent">
              <div v-for="(item,key) in mbData" :key='key' class="modelItem" @click="choseModel(item)">
                {{item.name}}
              </div>
            </div>
            <div v-else>暂无数据</div>
            <div slot="reference" class="item" style="position: relative">
              <el-tooltip class="item" effect="dark" :content="item.name" placement="left" >
                <el-button class="rightp-item" :class="{'ing':showTypeId==item.index}" type="primary" @click="toOtherView(item.index, item)" :icon="item.icon" circle>
                </el-button>
              </el-tooltip>
            </div>
        </el-popover>
        <el-popover
          placement="left"
          width="400"
          trigger="click">
            <div v-for="(item,key) in [
              {id: '0', label: '网络支付'},
              {id: '1', label: 'PCT国际阶段费用'},
              {id: '2', label: 'PCT首次进入国家阶段费用'},
              {id: '3', label: '国家申请或集成电路费用'},
              {id: '4', label: '网上缴费费用信息模板'},
              ]" :key='key' class="modelItem" @click="choseNetPay(item)">
              {{item.label}}
            </div>
            <div slot="reference" class="item" style="position: relative" v-if="item.name === '网络支付' && (!item.permissions || $store.getters.permissions.includes(item.permissions))">
              <el-tooltip class="item" effect="dark" :content="item.name" placement="left" >
                <el-button class="rightp-item" :class="{'ing':showTypeId==item.index}" type="primary" @click="toOtherView(item.index, item)" :icon="item.icon" circle>
                </el-button>
              </el-tooltip>
            </div>
        </el-popover>
        <el-popover
          placement="left"
          width="400"
          trigger="click">
            <div v-for="(item,key) in [{id: '财务支付', label: '财务支付'}, {id: '补充缴费', label: '补充缴费'}]" :key='key' class="modelItem" @click="choseListPay(item)">
              {{item.label}}
            </div>
            <div slot="reference" class="item" style="position: relative" v-if="item.name === '财务支付' && (!item.permissions || $store.getters.permissions.includes(item.permissions))">
              <el-tooltip class="item" effect="dark" :content="item.name" placement="left" >
                <el-button class="rightp-item" :class="{'ing':showTypeId==item.index}" type="primary" @click="toOtherView(item.index, item)" :icon="item.icon" circle>
                </el-button>
              </el-tooltip>
            </div>
        </el-popover>

         <el-popover
           ref="popover"
          placement="left"
          width="400"
          trigger="click">
            <div style="height: 200px;width: 100%">
              <OfficialDocuments types="patenFee" @confirm="confirmClick"
                                 @closePopover="()=>{}"></OfficialDocuments>
            </div>
            <div slot="reference" class="item" style="position: relative" v-if="item.name === '收据录入' && (!item.permissions || $store.getters.permissions.includes(item.permissions))">
              <el-tooltip class="item" effect="dark" :content="item.name" placement="left" >
                <el-button class="rightp-item" :class="{'ing':showTypeId==item.index}" type="primary" @click="toOtherView(item.index, item)" :icon="item.icon" circle>
                </el-button>
              </el-tooltip>
            </div>
        </el-popover>

        <el-popover
          placement="left"
          width="400"
          trigger="click">
            <div v-for="(item,key) in [{id: 1, label: '全部导出'}, {id: 2, label: '部分导出'}]" :key='key' class="modelItem" @click="exportExcel(item)">
              {{item.label}}
            </div>
            <div slot="reference" class="item" style="position: relative" v-if="item.name === '导出' && (!item.permissions || $store.getters.permissions.includes(item.permissions))">
              <el-tooltip class="item" effect="dark" :content="item.name" placement="left" >
                <el-button class="rightp-item" :class="{'ing':showTypeId==item.index}" type="primary" @click="toOtherView(item.index, item)" :icon="item.icon" circle>
                </el-button>
              </el-tooltip>
            </div>
        </el-popover>

        <el-tooltip class="item" effect="dark" :content="item.name" placement="left" >
          <div style="position: relative" v-if="item.name === '模板生成' && !mbData.length || !['模板生成', '网络支付', '财务支付', '收据录入', '导出'].includes(item.name) && (!item.permissions || $store.getters.permissions.includes(item.permissions))">
            <el-button class="rightp-item" :class="{'ing':showTypeId==item.index}" type="primary" @click="toOtherView(item.index, item)" :icon="item.icon" circle>
    <!--          <div class="el-icon-remove-outline"></div>-->
            </el-button>
          </div>
        </el-tooltip>
      </template>

<!--      <el-tooltip  class="item" effect="dark" content="商标查询" placement="left"  >-->
<!--        <el-button class="rightp-item" :class="{'ing':showTypeId==item.index}" type="primary" @click="toOtherView('1')" icon="el-icon-search" circle></el-button>-->
<!--      </el-tooltip>-->
<!--      <el-tooltip class="item" effect="dark" content="过滤器" placement="left">-->
<!--        <el-button class="rightp-item" type="primary" :class="{'ing':showTypeId=='2'}" @click="toOtherView('2')" icon="iconfont icon-tiaojian" circle></el-button>-->
<!--      </el-tooltip>-->
      <el-tooltip class="item" effect="dark" content="添加" placement="left">
        <el-button class="rightp-item" type="primary" :class="{'ing':showTypeId=='more'}" @click="toOtherView('more')" icon="el-icon-plus" circle></el-button>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="切换顶部显示" placement="left" v-if="$route.path.includes('finance_')">
        <el-button class="rightp-item" type="primary" :class="{'ing':showTypeId=='more'}" @click="changeToolsPos" icon="iconfont icon-jiantou_zuoyouqiehuan" circle></el-button>
      </el-tooltip>
    </div>
    <div ref="rightPanel" :class="['rightPanel-background', 'rightPanel', 'show', {'product-service-panel': showTypeId == '13'}]" id="rightPanel" v-if="show">
      <retrieval v-if="showTypeId=='1'" />
      <FilterHistory v-if="showTypeId=='2'" />
      <CommodityServic v-if="showTypeId=='3'" @cancel="toOtherView('3')" />
      <AbroadAgency v-if="showTypeId=='4'" />
      <judgment-document v-if="showTypeId == '5'" :half-width="halfWidth" />
      <knowledge v-if="showTypeId == '6'" :half-width="halfWidth" />
      <TrialTimelimit v-if="showTypeId=='7'" />
      <patent-judgment-document v-if="showTypeId == '10'" :half-width="halfWidth" />
      <product-service-recommendation v-if="showTypeId == '13'" :half-width="halfWidth" />
      <rejection-notice-writer v-if="showTypeId == '14'" :half-width="halfWidth" />
    </div>
    <el-dialog
          title="应用管理"
          :visible.sync="dialogVisible"
          width="30%"
          >
        <div style="display: flex;flex-wrap: wrap;">
          <div class="appWrap">
            <div style="position: relative" v-for="item in applicationManagement.filter(item=>item.flag)">
              <el-tooltip class="item" effect="dark" :content="item.name" placement="left" >
                <el-button v-if="!item.permissions || $store.getters.permissions.includes(item.permissions)" class="rightp-item" type="primary"  :icon="item.icon" circle></el-button>
              </el-tooltip>
              <div v-if="!item.permissions || $store.getters.permissions.includes(item.permissions)" class="el-icon-circle-plus-outline" @click="addItem(item.index)"></div>
            </div>
          </div>

          <div class="divider"></div>
          <div  class="appWrap">
            <div style="position: relative" v-for="item in applicationManagement.filter(item=>!item.flag)">
              <el-tooltip  class="item" effect="dark" :content="item.name" placement="left" >
                <el-button v-if="!item.permissions || $store.getters.permissions.includes(item.permissions)" class="rightp-item"  type="primary"  :icon="item.icon" circle></el-button>
              </el-tooltip>
              <div v-if="!item.permissions || $store.getters.permissions.includes(item.permissions)" class="el-icon-remove-outline" @click="deleteItem(item.index)"></div>
  <!--            <div class="el-icon-circle-plus-outline" @click="addItem(item.index)"></div>-->
            </div>
          </div>
        </div>
          <span slot="footer" class="dialog-footer">
<!--         <el-button @click="dialogVisible = false">取 消</el-button>-->
         <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 翻译软件平台弹框 -->
    <el-dialog
      title="翻译软件平台"
      :visible.sync="translationPlatformVisible"
      width="560px"
      :close-on-click-modal="false"
      class="translation-platform-dialog">
      <div v-loading="platformLoading" class="translation-platform-content">
        <div v-if="platformList.length === 0 && !platformLoading" class="no-data">
          暂无支持的翻译平台
        </div>
        <div v-else class="platform-list">
          <div 
            v-for="(platform, index) in platformList" 
            :key="index" 
            class="platform-item">
            <div class="platform-icon-wrapper">
              <i class="el-icon-connection platform-icon"></i>
            </div>
            <div class="platform-content">
              <div class="platform-header">
                <span class="platform-name-wrapper">
                  <span 
                    v-if="platform.platformUrl"
                    class="platform-name" 
                    @click="openPlatform(platform.platformUrl)">
                    {{ platform.platformName }}
                  </span>
                  <span v-else class="platform-name">{{ platform.platformName }}</span>
                  <el-link 
                    v-if="platform.platformUrl" 
                    @click="openPlatform(platform.platformUrl)"
                    class="platform-link"
                    :underline="false">
                    <i class="el-icon-top-right"></i>
                  </el-link>
                </span>
              </div>
              <div class="platform-description">
                <i class="el-icon-document description-icon"></i>
                <span class="description-text">{{ platform.description || '暂无描述' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="translationPlatformVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import dispatcher from '../../views/workbench/finance_two/stateManage/dispatchers'
import { addClass, removeClass } from "@/utils";
import retrieval from "@/views/workbench/platformData/trademarkRetrieval/retrieval.vue";
import FilterHistory from '@/components/FilterHistory'
import { mapState } from "vuex";
import CommodityServic from '@/components/CommodityServic'
import AbroadAgency from '@/components/AbroadAgency'
import OfficialDocuments from "../../views/workbench/case/components/OfficialDocuments";
import TrialTimelimit from "./cpn/TrialTimelimit";
import JudgmentDocument from "@/components/RightPanel/cpn/JudgmentDocument.vue";
import knowledge from '@/components/RightPanel/cpn/knowledge.vue';
  import PatentJudgmentDocument from '@/components/RightPanel/cpn/PatentJudgmentDocument.vue'
import ProductServiceRecommendation from '@/components/RightPanel/cpn/ProductServiceRecommendation.vue'
import RejectionNoticeWriter from '@/components/RightPanel/cpn/RejectionNoticeWriter.vue'
import { queryUserPlatformList } from '@/api/platform'

export default {
  name: "RightPanel",
  components: {
    PatentJudgmentDocument,
    JudgmentDocument,
    TrialTimelimit, OfficialDocuments, retrieval,FilterHistory ,CommodityServic, AbroadAgency, knowledge, ProductServiceRecommendation, RejectionNoticeWriter},
  props: {
    mbData: {
      type: Array,
      default: () => []
    },
    ctx: {
      type: Object
    },
    toolType: {
      type: String,
      default: ''
    },
    toolArr: {
      type: Array,
      default: () => []
    },
    clickNotClose: {
      default: false,
      type: Boolean
    },
    buttonBottom: {
      default: 20,
      type: Number
    }
  },
  created() {

  },
  data() {
    return {
      halfWidth: '50%',
      noContent: false,
      show: false,
      showTypeId:'',
      dialogVisible:false,
      applicationManagement:[],
      toolList: [],
      translationPlatformVisible: false,
      platformList: [],
      platformLoading: false
    };
  },
  computed: {
    ...mapState({
      'closeFlag': state => state.caseInformation.closeFlag,
    }),
    opened() {
      return this.$store.state.app.sidebar.opened
    },
  },
  watch: {
    $route: {
      handler: function(val, oldVal){
        this.$nextTick(()=>{
          this.changeTools()
        })
      },
      immediate: true
    },
    closeFlag(n,o){
      if(n){
        this.toOtherView(this.showTypeId)
        this.show=false
        this.$store.commit('caseInformation/SET_CLOSEFLAG',false)
      }
    },
    dialogVisible(n){
      if(!n){
        this.showTypeId=''
      }
    }
  },

  methods: {
    exportExcel(item){
      this.ctx.$refs.cust_grid.exportList(item.id)
    },
    confirmClick(){
      this.ctx.$refs.patentList.confirmClick()
    },
    choseListPay(item){
      this.ctx.$refs.patentList.financePay(item.id)
    },
    choseNetPay(item){
      this.ctx.$refs.patentList.netPay(item.id)
    },
    choseModel(item){
      if(this.toolType == 'bill_tool'){
        this.ctx.$refs.billList.mbmorebtn(item)
      }
      if(this.toolType == 'outside_price_tool'){
        this.ctx.$refs.overseasPriceList.createModel(item.id, item)
      }
      if (this.toolType === 'outside_bill_tool') {
        this.ctx.$refs.overseasBillList.createModel(item.id, item)
      }
    },
    changeToolsPos(){
      this.$store.dispatch('settings/changeToolsPos', 'top')
    },
    changeTools(){
      if(this.$route.path.includes('finance_')){
        this.toolList = this.toolArr
        let arr = this.toolList
        if(!localStorage.getItem('toolObj')){
          localStorage.setItem('toolObj',JSON.stringify({}))
        }
        if(!JSON.parse(localStorage.getItem('toolObj'))[this.toolType]){
          const obj = JSON.parse(localStorage.getItem('toolObj'))
          localStorage.setItem('toolObj', JSON.stringify({
            ...obj,
            [this.toolType]: arr
          }))
        }
        this.getApplicationManagement(true)
      }else{
       this.toolList = [
         {index:'1',name:'商标查询',icon:'el-icon-search',},
         {index:'2',name:'检索条件保存',icon:'iconfont icon-tiaojian',},
         {index:'3',name:'商品与服务查询工具',icon:'el-icon-arrow-down',},
         {index:'4',name:'境外代理所（合作所）',icon:'el-icon-s-order', permissions: 442},
         {index:'5',name:'裁判文书检索',icon:'iconfont icon-menu_flyz', permissions: 435 },
         {index:'6',name:'境外知识库',icon:'iconfont icon-zhishiku1',permissions: 435},
         {index:'7',name:'商标审限',icon:'el-icon-date',permissions: 444},
         {index:'8',name:'AI知识库',icon:'iconfont icon-AIzhishiku',permissions: 441},
         {index:'9',name:'事实检索',icon:'iconfont icon-externalLinker',permissions: 482},
         {index:'10',name:'专利裁判文书检索',icon:'iconfont icon-menu_flyz', permissions: 435 },
         {index:'11',name:'邮件检索',icon:'iconfont icon-emailjiankong', permissions: 501 },
         {index:'12',name:'异议方案',icon:'iconfont icon-yiyi', permissions: 510},
         {index:'13',name:'商品服务推荐',icon:'iconfont icon-shangpintuijian', permissions: 513},
         {index:'14',name:'报驳回通知邮件自动撰写',icon:'el-icon-edit-outline', permissions: 509},
         {index:'15',name:'翻译软件',icon:'el-icon-connection', permissions: 525},
         {index:'16',name:'自动撰写',icon:'iconfont icon-yiyi',},
         ]
        let arr = this.toolList
        if(!localStorage.getItem('applicationManagement')){
          localStorage.setItem('applicationManagement', JSON.stringify(arr))
        }
        else {
          if(!JSON.parse(localStorage.getItem('applicationManagement')).find(item=>item.name==='商品与服务查询工具')){
           let newArr = JSON.parse(localStorage.getItem('applicationManagement'))
            newArr.push({index:'3',name:'商品与服务查询工具',icon:'el-icon-arrow-down',})
            localStorage.setItem('applicationManagement', JSON.stringify(newArr))
          }
        }
        this.getApplicationManagement()
      }
    },
    getApplicationManagement(flag){
      if(flag){
        this.applicationManagement =  localStorage.getItem('toolObj') ? JSON.parse(localStorage.getItem('toolObj'))[this.toolType].filter(i => this.toolList.find(item => item.name == i.name)) : [];
        this.applicationManagement = this.applicationManagement.sort((a, b) => ~~a.index - ~~b.index)
        // const newList = this.toolList.filter(item => !this.applicationManagement.find(i => i.name == item.name));
        const newList = []
        this.toolList.forEach(item => {
          if(!this.applicationManagement.find(i => i.name == item.name)){
            this.applicationManagement.push(item)
          }
           // updateSign: 更新标识
          if(this.applicationManagement.findIndex(i => i.updateSign !== item.updateSign && i.name == item.name) > -1){
            this.applicationManagement.splice(this.applicationManagement.findIndex(i => i.updateSign !== item.updateSign && i.name == item.name), 1, item)
          }
        })
        const obj = JSON.parse(localStorage.getItem('toolObj'))
        localStorage.setItem('toolObj', JSON.stringify({
            ...obj,
            [this.toolType]: [...this.applicationManagement, ...newList]
          }))
      }else{
       this.applicationManagement =  localStorage.getItem('applicationManagement') ? JSON.parse(localStorage.getItem('applicationManagement')).filter(item => ['1', '2', '3'].includes(item.index)) : [];
       this.toolList.forEach(item => {
          if(!this.applicationManagement.find(i => i.name == item.name)){
            this.applicationManagement.push(item)
          }
        })
      }
    },
    addItem(e){
      if(this.$route.path.includes('finance_')){
        let arr=JSON.parse(localStorage.getItem('toolObj'))[this.toolType]
        this.$set(arr.find(item=>item.index==e),'flag',false)
        localStorage.setItem('toolObj', JSON.stringify({[this.toolType]: arr}))
        this.getApplicationManagement(true)
      }else{
        let arr=JSON.parse(localStorage.getItem('applicationManagement'))
        this.$set(arr.find(item=>item.index==e),'flag',false)
        localStorage.setItem('applicationManagement', JSON.stringify(arr))
        this.getApplicationManagement()
      }
    },
    deleteItem(e){
      if(this.$route.path.includes('finance_')){
        let arr=JSON.parse(localStorage.getItem('toolObj'))[this.toolType]
        this.$set(arr.find(item=>item.index==e),'flag',true)
        localStorage.setItem('toolObj', JSON.stringify({[this.toolType]: arr}))
        this.getApplicationManagement(true)
      }else{
        let arr=JSON.parse(localStorage.getItem('applicationManagement'))
        this.$set(arr.find(item=>item.index==e),'flag',true)
        localStorage.setItem('applicationManagement', JSON.stringify(arr))
        this.getApplicationManagement()
      }
    },
    toOtherView(e, item) {
      if(this.$route.path.includes('finance_')){
        this.showTypeId=e
        if(e == 'more'){
          this.dialogVisible=true
        }
        if(item&&item.action){
          dispatcher(this.ctx)(item.action, this)
        }
      }else{
        // AI知识库，打开新页面
        if(e == 8){
          window.open('/KnowledgeBase/#/home', '_blank');
        }
        if(e == 9){
          window.open('/ExternalLinker', '_blank');
        }
        if(e == 11){
          window.open('/EmailMonitoring', '_blank');
        }
        if(e == 12){
          window.open('/AIOppositionDraft', '_blank');
        }
        if(e == '15'){
          this.openTranslationPlatform();
          return;
        }
        if(e == '16'){
          window.open('/AutoWrite', '_blank');
        }
       if(!this.show){
          this.showTypeId=e
          if(e!='more'){
            this.show=true
            this.$nextTick(() => {
              const obj = document.getElementById('rightPanel')
              this.halfWidth = `calc(50vw - ${this.opened ? '85px' : '25px'})`
              // obj.style.width = `calc(50vw - ${this.opened ? '85px' : '22px'})`
              obj.style.maxWidth = `calc(100vw - ${this.opened ? '160px' : '45px'})`
            })
          }else {
            this.dialogVisible=true
          }
        }else{
          if(e==this.showTypeId){
            this.show=!this.show;
            this.showTypeId=''
          } else {
            if(e=='more'){
              this.dialogVisible=true
              this.show=false;
            }
            this.showTypeId=e
          }
        }
      }
    },
    // 打开翻译软件平台弹框
    async openTranslationPlatform() {
      this.translationPlatformVisible = true;
      await this.loadPlatformList();
    },
    // 加载翻译平台列表
    async loadPlatformList() {
      this.platformLoading = true;
      try {
        const res = await queryUserPlatformList({});
        if (res && res.success && res.data) {
          this.platformList = Array.isArray(res.data) ? res.data : [];
        } else {
          this.platformList = [];
          if (res && res.message) {
            this.$message.warning(res.message);
          }
        }
      } catch (error) {
        console.error('获取翻译平台列表失败:', error);
        this.platformList = [];
        this.$message.error('获取平台列表失败，请稍后重试');
      } finally {
        this.platformLoading = false;
      }
    },
    // 格式化平台URL，确保有协议前缀
    formatPlatformUrl(url) {
      if (!url) return '';
      // 如果URL已经包含协议，直接返回
      if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
      }
      // 如果没有协议，添加 https://
      return 'https://' + url;
    },
    // 打开平台链接（在新标签页）
    openPlatform(url) {
      if (!url) return;
      // 格式化URL，确保有协议前缀
      let formattedUrl = this.formatPlatformUrl(url);
      // 获取token
      const token = this.$store.getters.token || '';
      // 添加 #auth_action#token{token值} 参数
      formattedUrl += '#auth_action#token' + token;
      // 在新标签页打开
      window.open(formattedUrl, '_blank');
    }
  }
};
</script>

<style>

.showRightPanel {
  overflow: scroll!important;
  position: relative!important;
  width: calc(100%-15px)!important;
}
</style>

<style lang="scss" scoped>
  @import "~@/styles/icons/font_889103_gu06lslk7g9.css";
  @import "~@/styles/icons/font_1400426_lpcevksbfe.css";
  @import "~@/styles/icons/font_2251928_441yfy31kbp.css";
  .button_wrap{
    width:32px;
    position: fixed;
    top:80px;
    /*bottom:0;*/
    right: 0px;
    /*height: 92vh;*/
    /*box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.05);*/
    transition: all 0.25s cubic-bezier(0.7, 0.3, 0.1, 1);
    /*transform: translate(100%);*/
    z-index: 1999;
    text-align: center;
    /deep/.element::-webkit-scrollbar { width: 0 !important };
    /deep/ .element { -ms-overflow-style: none!important; }
    /deep/ .element { overflow: -moz-scrollbars-none!important; }
  }
  .rightp-item {
    position: relative;
    margin: 0 auto;
    margin-top: 20px;
    font-size: 12px;
    padding: 7px;
    right: -2px;
    transition: all 0.2s ease-in-out;
    &:hover{
      transform: scale(1.7);
      right: 7px;
    }
    /*@keyframes progressmove {*/
    /*  0% {*/
    /*    right: 0px;*/
    /*  }*/
    /*  100% {*/
    /*    !*transform: scale(1.8);*!*/
    /*    right: 10px;*/
    /*  }*/
    /*}*/
    /deep/ .icon-tiaojian{
      font-size: 13px !important;
    }
  }
  .handle-button {
    width: 48px;
    height: 48px;
    position: absolute;
    /*float: left;*/
    left: -48px;
    text-align: center;
    font-size: 24px;
    border-radius: 6px 0 0 6px !important;
    z-index: 0;
    pointer-events: auto;
    cursor: pointer;
    color: #fff;
    line-height: 48px;
    i {
      font-size: 24px;
      line-height: 48px;
    }
  }
  .rightPanel {
    overflow: scroll!important;
    //width: 100%;
    max-width: 1000px;
    height: calc(100vh - 40px);
    position: fixed;
    //top: 4.5vh;
    top: 40px;
    right: -17px;
    box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.05);
    transition: all 0.25s cubic-bezier(0.7, 0.3, 0.1, 1);
    /*transform: translate(100%);*/
    background: #fff;
    z-index: 1998;
    text-align: center;

  }
.ing{
  background: rgb(31, 114, 238) !important;
}
.el-icon-remove-outline{
  cursor: pointer;
  position: absolute;
  right: 0;
  top: 15px;
  color: #fff;
  background: #f00;
  border-radius: 50%;
}
.el-icon-circle-plus-outline{
  cursor: pointer;
  position: absolute;
  right: 0;
  top: 15px;
  color: #fff;
  background: #f00;
  border-radius: 50%;
}
  /*.rightPanel-background {
    position: fixed;
    top: 0;
    left: 0;
    opacity: 0;
    transition: opacity 0.3s cubic-bezier(0.7, 0.3, 0.1, 1);
    background: rgba(0, 0, 0, 0.2);
    z-index: -1;
  }

    .rightPanel {
       overflow: scroll!important;
      width: 100%;
      max-width: 46px;
      height: 95.5vh;
      position: fixed;
      top: 73px;
      right: -17px;
      box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.05);
      transition: all 0.25s cubic-bezier(0.7, 0.3, 0.1, 1);
      transform: translate(100%);
      background: #fff;
      z-index: 2000;
      text-align: center;
      /deep/.element::-webkit-scrollbar { width: 0 !important };
      /deep/ .element { -ms-overflow-style: none!important; }
      /deep/ .element { overflow: -moz-scrollbars-none!important; }
    }
    .rightPanel1 {
       overflow: scroll!important;
      width: 100%;
      max-width: 1000px;
      height: 95.5vh;
      position: fixed;
      top: 4.5vh;
      right: -17px;
      box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.05);
      transition: all 0.25s cubic-bezier(0.7, 0.3, 0.1, 1);
      // transform: translate(100%);
      background: #fff;
      z-index: 2000;
      text-align: center;

    }

    .show {
      transition: all 0.3s cubic-bezier(0.7, 0.3, 0.1, 1);

      .rightPanel-background {
        z-index: 20000;
        opacity: 1;
        width: 100%;
        height: 100%;
      }

      .rightPanel {
        transform: translate(0);
      }
    }
    .rightp-item {
      margin: 0 auto;
      margin-top: 20px;
      font-size: 12px;
      padding: 7px;
     /deep/ .icon-tiaojian{
        font-size: 13px !important;
      }
    }
    .handle-button {
      width: 48px;
      height: 48px;
      position: absolute;
      left: -48px;
      text-align: center;
      font-size: 24px;
      border-radius: 6px 0 0 6px !important;
      z-index: 0;
      pointer-events: auto;
      cursor: pointer;
      color: #fff;
      line-height: 48px;
      i {
        font-size: 24px;
        line-height: 48px;
      }
    }
      .button_wrap{
        padding-right: 18px;
        position: absolute;
        right: 0;
        width: 46px;
      }*/
  .divider{
    display: block;
    height: 1px;
    width: 100%;
    margin: 24px 0;
    background-color: #dcdfe6;
    position: relative;
    /*top: 20%;*/
  }
  .appWrap{
    width: 100%;
    min-height: 50px;
    display: flex;
    &>div{
      margin-right: 10px;
    }
  }
  /deep/ .iconfont{
    font-size: 14px;
  }
  .modelItem{
    height: 40px;
    line-height: 40px;
    cursor: pointer;
    &:hover{
      background-color: #ECF5FF;
      color: #66B7FF;
    }
  }

  // 商品服务推荐面板专用样式
  .rightPanel.product-service-panel {
    width: 100vw !important;
    max-width: 100vw !important;
    text-align: left !important;
    right: 0 !important;
    left: 0 !important;
  }

  // 翻译软件平台弹框样式
  /deep/ .translation-platform-dialog {
    .el-dialog__header {
      padding: 20px 24px 16px;
      background: #eeeeee;
      border-radius: 4px 4px 0 0;
      border-bottom: 1px solid #EBEEF5;
      
      .el-dialog__title {
        color: #303133;
        font-size: 18px;
        font-weight: 600;
      }
      
      .el-dialog__close {
        color: #909399;
        font-size: 20px;
        
        &:hover {
          color: #606266;
        }
      }
    }
    
    .el-dialog__body {
      padding: 24px;
      background: #f5f7fa;
    }
    
    .el-dialog__footer {
      padding: 16px 24px;
      background: #ffffff;
      border-top: 1px solid #EBEEF5;
    }
  }

  .translation-platform-content {
    min-height: 200px;
    max-height: 520px;
    overflow-y: auto;
    padding: 4px 0;
    
    // 自定义滚动条样式
    &::-webkit-scrollbar {
      width: 6px;
    }
    
    &::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 3px;
    }
    
    &::-webkit-scrollbar-thumb {
      background: #c1c1c1;
      border-radius: 3px;
      
      &:hover {
        background: #a8a8a8;
      }
    }
  }

  .no-data {
    text-align: center;
    padding: 80px 0;
    color: #909399;
    font-size: 14px;
    
    &::before {
      content: '📝';
      display: block;
      font-size: 48px;
      margin-bottom: 16px;
      opacity: 0.5;
    }
  }

  .platform-list {
    .platform-item {
      display: flex;
      padding: 0;
      margin-bottom: 16px;
      border-radius: 12px;
      background: #ffffff;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      overflow: hidden;
      border: 1px solid #E4E7ED;

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 4px;
        background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
        opacity: 0;
        transition: opacity 0.3s;
      }

      &:hover {
        border-color: #667eea;
        box-shadow: 0 8px 24px rgba(102, 126, 234, 0.2);
        transform: translateY(-4px);

        &::before {
          opacity: 1;
        }

        .platform-icon-wrapper {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          transform: scale(1.1);
          
          .platform-icon {
            color: #ffffff;
            transform: rotate(5deg);
          }
        }
      }

      &:last-child {
        margin-bottom: 0;
      }

      .platform-icon-wrapper {
        width: 64px;
        min-width: 64px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        
        .platform-icon {
          font-size: 28px;
          color: #667eea;
          transition: all 0.3s;
        }
      }

      .platform-content {
        flex: 1;
        padding: 20px 24px;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }

      .platform-header {
        margin-bottom: 12px;

        .platform-name-wrapper {
          display: flex;
          align-items: center;
          justify-content: space-between;

          .platform-name {
            font-size: 18px;
            font-weight: 600;
            color: #303133;
            cursor: pointer;
            transition: all 0.3s;
            flex: 1;
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;

            &:hover {
              transform: translateX(4px);
            }
          }

          .platform-link {
            margin-left: 12px;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 50%;
            color: #ffffff;
            cursor: pointer;
            transition: all 0.3s;
            text-decoration: none;
            box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);

            &:hover {
              transform: scale(1.15) rotate(15deg);
              box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
            }

            i {
              font-size: 16px;
            }
          }
        }
      }

      .platform-description {
        display: flex;
        align-items: flex-start;
        font-size: 14px;
        color: #606266;
        line-height: 1.8;
        padding-top: 12px;
        border-top: 1px solid #F0F2F5;
        margin-top: 8px;

        .description-icon {
          color: #909399;
          font-size: 16px;
          margin-right: 8px;
          margin-top: 2px;
          flex-shrink: 0;
        }

        .description-text {
          flex: 1;
        }
      }
    }
  }

</style>
