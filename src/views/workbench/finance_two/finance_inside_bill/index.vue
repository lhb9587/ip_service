<template>
  <div>
    <top-panel v-if="toolPosTop == 'top'" :tool-arr="toolArr" tool-type="inside_bill_tool" :ctx="this"/>
    <top-menu :buss-id="9" :ctx="this" :tab-list="tabList" type="insideBill" style="margin-top: 10px"/>
    <right-panel v-if="toolPosTop == 'right'" :tool-arr="toolArr" tool-type="inside_bill_tool" :ctx="this"></right-panel>

    <inside-bill ref="insideBillList" :is-finance="true"/>
  </div>
</template>

<script>
  import TopMenu from "../components/TopMenu";
  import TopPanel from "../components/TopPanel";
  import RightPanel from "../../../../components/RightPanel/index";
  import {mapState} from "vuex";
  import InsideBill from "../../finance/billviews/components/insideBill";

  export default {
    name: "index",
    components: {InsideBill, RightPanel, TopPanel, TopMenu},
    computed: {
      ...mapState({
        toolPosTop: state => state.settings.toolPosTop
      })
    },
    data(){
      return {
        toolArr: [
          { index: '1', name: '新建', icon: 'el-icon-document-add', action: 'INSIDE_BILL_CREATE', permissions: 161},
          { index: '2', name: '修改', icon: 'el-icon-edit-outline', action: 'INSIDE_BILL_EDIT', permissions: 166 },
          { index: '3', name: '审核', icon: 'iconfont icon-man-examine', action: 'INSIDE_BILL_AUDIT', permissions: 165 },
        ],
        tabList: []
      }
    }
  }
</script>

<style lang="scss" scoped>
@import "~@/styles/miniAg.scss";
  .abow_dialog {
    > > > .el-dialog {
      position: absolute;
      top: 50%;
      left: 50%;
      margin: 0 !important;
      transform: translate(-50%, -50%);
      max-height: calc(100% - 30px);
      max-width: calc(100% - 30px);
      display: flex;
      flex-direction: column;
    }

    > > > .el-dialog__body {
      overflow: auto;
    }
  }
</style>
