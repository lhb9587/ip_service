<template>
  <div>
    <top-panel v-if="toolPosTop == 'top'" :tool-arr="toolArr" tool-type="invoice_borrow_tool" :ctx="this"/>
    <top-menu :buss-id="50" :ctx="this" :tab-list="tabList" type="invoice_borrow"/>
    <right-panel v-if="toolPosTop == 'right'" :tool-arr="toolArr" tool-type="invoice_borrow_tool" :ctx="this"></right-panel>
    <InvoiceBorrowList ref="invoiceBorrowList" @events="handleEvents"/>
    <!--  改签  -->
    <el-dialog title="改签任务" :visible.sync="dialogRebookVisible">
      <rebook ref="rebook" @closeDialog="closeDialog" type="invoice_borrow" :ctx="this"/>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import TopPanel from '../../components/TopPanel'
import RightPanel from '../../../../../components/RightPanel/index'
import TopMenu from '../../components/TopMenu'
import InvoiceBorrowList from './components/InvoiceBorrowList'
import Rebook from '../../components/Rebook'
import dispatcher from '../../stateManage/dispatchers'
export default {
  name: 'finance_invoice_borrow',
  components: { InvoiceBorrowList, Rebook, TopMenu, RightPanel, TopPanel },
  data(){
    return {
      dialogRebookVisible: false,
      tabList: [
        {
          key: 'wfStatus',
          label: '待提交',
          value: '待提交'
        },
        {
          key: 'wfStatus',
          label: '待核销',
          value: '待核销'
        },
        {
          key: 'wfStatus',
          label: '已核销',
          value: '已完成'
        }
      ],
      title: '',
      type: '',
      toolArr: [
        { index: '4', name: '新建', icon: 'el-icon-document-add', action: 'INVOICE_BORROW_CREATE',permissions: 331 },
        { index: '5', name: '修改', icon: 'el-icon-edit-outline', action: 'INVOICE_BORROW_EDIT' },
        { index: '6', name: '删除', icon: 'el-icon-delete', action: 'INVOICE_BORROW_DELETE' },
        { index: '7', name: '提交', icon: 'el-icon-check', action: 'INVOICE_BORROW_SUBMIT' },
        { index: '8', name: '核销', icon: 'iconfont icon-caiwu1', action: 'INVOICE_BORROW_AUDIT', permissions: 306 },
        { index: '9', name: '改签', icon: 'iconfont icon-yemianxiugai', action: 'INVOICE_BORROW_REBOOK', permissions: 306 },
        { index: '10', name: '欠票人', icon: 'iconfont icon-Arrears', action: 'INVOICE_BORROW_DEBTOR', permissions: 306 },
        { index: '11', name: '时限延期', icon: 'iconfont icon-yanqi', action: 'INVOICE_TIME_DELAY', permissions: 520 }
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
    closeDialog(search) {
      search && this.$refs.invoiceBorrowList.queryList()
      this.dialogRebookVisible = false
    },
    handleEvents({ action, data }) {
      dispatcher(this)(action, data)
    },
    cancel(){
      this.$refs.invoiceBorrowList.cancel()
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
