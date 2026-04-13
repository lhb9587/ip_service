<template>
  <div>
    <top-panel v-if="toolPosTop == 'top'" :tool-arr="toolArr" tool-type="patent_fee_tool" :ctx="this"/>
    <top-menu :display="true" :buss-id="42" :ctx="this" :tab-list="tabList" type="patent" style="margin-top: 10px"/>
    <right-panel v-if="toolPosTop == 'right'" :tool-arr="toolArr" tool-type="patent_fee_tool" :ctx="this"></right-panel>
    <patent-fee ref="patentList" :is-finance="true"/>

  </div>
</template>

<script>
  import {mapState} from "vuex";
  import TopMenu from "../components/TopMenu";
  import TopPanel from "../components/TopPanel";
  import RightPanel from "../../../../components/RightPanel/index";
  import PatentFee from '../../finance/patentFee'

  export default {
    name: "finance_patent_fee",
    components: {RightPanel, TopPanel, TopMenu, PatentFee},
    computed: {
      ...mapState({
        showSettings: state => state.settings.showSettings,
        toolPosTop: state => state.settings.toolPosTop
      })
    },
    data(){
      return {
        toolArr: [
          { index: '1', name: '修改', icon: 'el-icon-edit-outline', action: 'PATENT_EDIT' },
          { index: '2', name: '新建清单', icon: 'el-icon-document-add', action: 'PATENT_CREATE'},
          { index: '3', name: '网络支付', icon: 'iconfont icon-wangyinzhifu', action: 'PATENT_NET_PAY'},
          { index: '4', name: '财务支付', icon: 'iconfont icon-licaibao', action: 'PATENT_FINANCE_PAY'},
          { index: '5', name: '收据录入', icon: 'iconfont icon-shouju', action: 'PATENT_RECEIPT_INPUT'},
          { index: '6', name: '缴费汇率', icon: 'iconfont icon-huishuai', action: 'PATENT_CHARGE_EXCHANGE'},
          { index: '7', name: '合并', icon: 'el-icon-finished', action: 'PATENT_MERGE'},
        ],
        tabList: []
      }
    },
  }
</script>

<style lang="scss" scoped>
@import "~@/styles/miniAg.scss";
</style>
