<template>
  <div>
    <top-panel v-if="toolPosTop == 'top'" :tool-arr="toolArr" tool-type="traw_tool" :ctx="this"/>
    <top-menu :ctx="this" :tab-list="tabList" type="traw" style="margin-top: 10px"/>
    <right-panel v-if="toolPosTop == 'right'" :tool-arr="toolArr" tool-type="traw_tool" :ctx="this"></right-panel>

    <traw-sheet-list ref="trawList" :is-finance="true"/>
  </div>
</template>

<script>
  import {mapState} from "vuex";
  import InsideBill from "../../finance/billviews/components/insideBill";
  import RightPanel from "../../../../components/RightPanel/index";
  import TopPanel from "../components/TopPanel";
  import TopMenu from "../components/TopMenu";
  import TrawSheetList from "../../finance/billviews/components/trawSheet";

  export default {
    name: "index",
    components: {TrawSheetList, InsideBill, RightPanel, TopPanel, TopMenu},
    computed: {
      ...mapState({
        toolPosTop: state => state.settings.toolPosTop
      })
    },
    data(){
      return{
        tabList: [],
        toolArr: [
          { index: '1', name: '修改', icon: 'el-icon-edit-outline', action: 'TRAW_EDIT', permissions: 168 },
          { index: '2', name: '批量编辑', icon: 'iconfont icon-piliangbianji', action: 'TRAW_PL_EDIT', permissions: 168 },
          { index: '3', name: '删除', icon: 'el-icon-delete', action: 'TRAW_DELETE', permissions: 169 },
        ]
      }
    }
  }
</script>

<style scoped>

</style>
