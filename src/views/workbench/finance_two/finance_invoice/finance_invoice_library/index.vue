<template>
  <div>
    <top-panel v-if="toolPosTop == 'top'" :tool-arr="toolArr" tool-type="invoice_library_tool" :ctx="this"/>
    <top-menu :buss-id="56" :ctx="this" :tab-list="tabList" type="invoice_library"/>
    <right-panel v-if="toolPosTop == 'right'" :tool-arr="toolArr" tool-type="invoice_library_tool" :ctx="this"></right-panel>
    <InvoiceLibraryList ref="invoiceLibraryList" @events="handleEvents"/>
  </div>
</template>

<script>
import { mapState } from "vuex";
import TopPanel from '../../components/TopPanel'
import RightPanel from '../../../../../components/RightPanel/index'
import TopMenu from '../../components/TopMenu'
import InvoiceLibraryList from './components/InvoiceLibraryList'
import dispatcher from '../../stateManage/dispatchers'
export default {
  name: 'finance_invoice_library',
  components: { InvoiceLibraryList, TopMenu, RightPanel, TopPanel },
  data(){
    return {
      tabList: [
        {
          key: 'cxFlag',
          label: '费用报销',
          value: '7'
        },
        {
          key: 'cxFlag',
          label: '欠票归还',
          value: '6'
        },
        {
          key: 'cxFlag',
          label: '交通票',
          value: '5'
        },
        {
          key: 'cxFlag',
          label: '其他票',
          value: '4'
        },
        {
          key: 'cxFlag',
          label: '今日已查验',
          value: '2'
        },
        {
          key: 'cxFlag',
          label: '今日已处理',
          value: '3'
        }
      ],
      title: '',
      type: '',
      toolArr: [
        { index: '1', name: '新建', icon: 'el-icon-document-add', action: 'INVOICE_LIBRARY_CREATE' },
        { index: '2', name: '修改', icon: 'el-icon-edit-outline', action: 'INVOICE_LIBRARY_EDIT' },
        { index: '3', name: '删除', icon: 'el-icon-delete', action: 'INVOICE_LIBRARY_DELETE' },
        { index: '4', name: '分批处理', icon: 'iconfont icon-zhangdanhao', action: 'INVOICE_LIBRARY_BATCH_PROCESS', permissions: 396 },
        { index: '5', name: '撤回处理', icon: 'el-icon-s-release', action: 'INVOICE_LIBRARY_WITHDRAW', permissions: 396, updateSign: true },
        { index: '6', name: '发票所属', icon: 'iconfont icon-piliangbianji', action: 'INVOICE_LIBRARY_BATCH_PEOPLE'},
        { index: '7', name: '报销额清零', icon: 'iconfont icon-caiwu1', action: 'INVOICE_LIBRARY_ZEROING', permissions: 407 }
      ],
    }
  },
  created() {
    console.log(this.toolPosTop)
  },
  computed: {
    ...mapState({
      showSettings: state => state.settings.showSettings,
      toolPosTop: state => state.settings.toolPosTop
    })
  },
  methods: {
    handleEvents({ action, data }) {
      dispatcher(this)(action, data)
    },
    cancel(){
      this.$refs.invoiceLibraryList.cancel()
    },
  }
}
</script>

<style lang="scss" scoped>

> > > .el-dialog__body {
  padding-top: 0;
  padding-bottom: 0;
}
@import "~@/styles/miniAg.scss";
</style>
