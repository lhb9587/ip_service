<template>
  <div>
    <top-panel v-if="toolPosTop == 'top'" :tool-arr="toolArr" tool-type="invoice_opener_tool" :ctx="this"/>
    <top-menu :buss-id="15" :ctx="this" :tab-list="tabList" type="invoice_opener"/>
    <right-panel v-if="toolPosTop == 'right'" :tool-arr="toolArr" tool-type="invoice_opener_tool" :ctx="this"></right-panel>
    <InvoiceOpenerList ref="invoiceOpenerList"/>
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
import InvoiceOpenerList from './components/InvoiceOpenerList'
import Rebook from '../../components/Rebook'
export default {
  name: 'finance_invoice_opener',
  components: { InvoiceOpenerList, Rebook, TopMenu, RightPanel, TopPanel },
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
          label: '待审核',
          value: '待审核'
        },
        {
          key: 'wfStatus',
          label: '待开具',
          value: '待开具'
        }
      ],
      title: '',
      type: '',
      toolArr: [
        { index: '4', name: '新建', icon: 'el-icon-document-add', action: 'INVOICE_OPENER_CREATE' },
        { index: '5', name: '修改', icon: 'el-icon-edit-outline', action: 'INVOICE_OPENER_EDIT', permissions: 216 },
        { index: '6', name: '删除', icon: 'el-icon-delete', action: 'INVOICE_OPENER_DELETE', permissions: 217 },
        { index: '7', name: '提交', icon: 'el-icon-check', action: 'INVOICE_OPENER_SUBMIT' },
        { index: '8', name: '财务审核', icon: 'iconfont icon-caiwu1', action: 'INVOICE_OPENER_AUDIT', permissions: 314 },
        { index: '9', name: '开具', icon: 'el-icon-tickets', action: 'INVOICE_OPENER', permissions: 315 },
        { index: '10', name: '改签', icon: 'iconfont icon-yemianxiugai', action: 'INVOICE_OPENER_REBOOK' },
        { index: '11', name: '开具日期', icon: 'el-icon-date', action: 'INVOICE_OPENER_DATE', permissions: 355 },
        { index: '12', name: '统计组税额', icon: 'el-icon-coin', action: 'INVOICE_OPENER_TAX_AMOUNT', permissions: 389, updateSign: true },
        { index: '13', name: '上传发票', icon: 'el-icon-upload', action: 'UPLOAD_INVOICE' }
      ]
    }
  },
  created() {
  },
  computed: {
    ...mapState({
      showSettings: state => state.settings.showSettings,
      toolPosTop: state => state.settings.toolPosTop
    })
  },
  methods: {
    closeDialog(search) {
      search && this.$refs.invoiceOpenerList.queryReceiptList()
      this.dialogRebookVisible = false
    },
    cancel(){

    },
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/miniAg.scss";
</style>
