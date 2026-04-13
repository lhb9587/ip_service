<template>
  <div>
    <top-panel v-if="toolPosTop == 'top'" :tool-arr="toolArr" tool-type="exchange_rate_tool" :ctx="this"/>
    <top-menu :ctx="this" :tab-list="tabList" type="exchangeRate" style="margin-top: 10px"/>
    <right-panel v-if="toolPosTop == 'right'" :tool-arr="toolArr" tool-type="exchange_rate_tool"
                 :ctx="this"></right-panel>
    <exchange-rate-list ref="rateList"></exchange-rate-list>
  </div>
</template>

<script>
import ExchangeRateList from "@/views/workbench/finance_two/exchange_rate_manager/ExchangeRateList.vue";
import TopPanel from "@/views/workbench/finance_two/components/TopPanel.vue";
import {mapState} from "vuex";
import TopMenu from "@/views/workbench/finance_two/components/TopMenu.vue";
import RightPanel from "@/components/RightPanel/index.vue";

export default {
  name: "index",
  components: {RightPanel, TopMenu, TopPanel, ExchangeRateList},
  computed: {
    ...mapState({
      toolPosTop: state => state.settings.toolPosTop
    })
  },
  data() {
    return {
      tabList: [],
      toolArr: [
        {index: '1', name: '新建', icon: 'el-icon-document-add', action: 'EXCHANGE_RATE_CREATE'},
        {index: '2', name: '修改', icon: 'el-icon-edit-outline', action: 'EXCHANGE_RATE_EDIT'},
      ]
    }
  }
}
</script>

<style scoped lang="scss">
@import "~@/styles/miniAg.scss";
</style>
