<template>
  <div>
    <top-panel v-if="toolPosTop == 'top'" :tool-arr="toolArr" tool-type="outside_price_tool" :ctx="this"
               :mbData="mbData"/>
    <top-menu :ctx="this" :tab-list="tabList" type="outPrice" style="margin-top: 10px"/>
    <right-panel v-if="toolPosTop == 'right'" :tool-arr="toolArr" tool-type="outside_price_tool" :ctx="this"
                 :mbData="mbData"></right-panel>
    <overseas-price ref="overseasPriceList" :is-finance="true"/>

  </div>
</template>

<script>
import {mapState} from "vuex";
import TopMenu from "../components/TopMenu";
import TopPanel from "../components/TopPanel";
import RightPanel from "../../../../components/RightPanel/index";
import OverseasPrice from '../../finance/overseasPrice'
import {querySpecialTemplates} from "@/api/billApi";

export default {
  name: "index",
  components: {RightPanel, TopPanel, TopMenu, OverseasPrice},
  computed: {
    ...mapState({
      toolPosTop: state => state.settings.toolPosTop
    })
  },
  data() {
    return {
      mbData: [
        {id: 1, name: '境外注册方案及报价'},
        {id: 2, name: '境外商标注册申请报价明细'},
        {id: 3, name: '境外商标注册申请报价明细-拆分'},
        {id: 5, name: '境外商标查询报价明细'},
        {id: 6, name: '境外商标查询报价明细-拆分'},
        {id: 7, name: '境外商标转让报价明细'},
        {id: 8, name: '境外商标转让报价明细-拆分'},
        {id: 9, name: '境外商标续展报价明细'},
        {id: 10, name: '境外商标续展报价明细-拆分'},
        {id: 11, name: '境外商标变更地址报价明细'},
        {id: 12, name: '境外商标变更地址报价明细-拆分'},
        {id: 13, name: '境外商标变更名义报价明细'},
        {id: 14, name: '境外商标变更名义报价明细-拆分'},
        {id: 15, name: '境外商标变名变址报价明细'},
        {id: 16, name: '境外商标变名变址报价明细-拆分'},
      ],
      toolArr: [
        {index: '1', name: '新建', icon: 'el-icon-document-add', action: 'OUTPRICE_CREATE', permissions: 292},
        {index: '2', name: '修改', icon: 'el-icon-edit-outline', action: 'OUTPRICE_EDIT', permissions: 293},
        {
          index: '3',
          name: '逐一报价',
          icon: 'iconfont icon-geren-duihuanzhulangbi',
          action: 'OUTPRICE_ZY',
          permissions: 296
        },
        {index: '4', name: '马德里报价', icon: 'iconfont icon-M', action: 'OUTPRICE_MDL', permissions: 297},
        {index: '5', name: '模板生成', icon: 'iconfont icon-mobanguanli', action: 'OUTPRICE_EXPORT_MODEL', permissions: 480, updateSign: true},
        {index: '6', name: '外币汇率表', icon: 'el-icon-s-order', action: 'OUTPRICE_WAIBI', updateSign: false}
      ],
      tabList: []
    }
  },
  created() {
    querySpecialTemplates({
      business: 6
    }).then(res => {
      const list = res.data || []
      this.mbData.push(...list.map(item => ({
        id: item.id,
        name: item.name,
        code: item.code
      })))
    })
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/miniAg.scss";
</style>
