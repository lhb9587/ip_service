<template>
  <div>
    <top-panel v-if="toolPosTop == 'top'" :tool-arr="toolArr" tool-type="borrow_tool" :ctx="this"/>
    <top-menu :buss-id="51" :ctx="this" :tab-list="tabList" type="borrow"/>
    <right-panel v-if="toolPosTop == 'right'" :tool-arr="toolArr" tool-type="borrow_tool" :ctx="this"></right-panel>
    <BorrowList ref="borrowList" @events="handleEvents"/>
    <!--  改签  -->
    <el-dialog title="改签任务" :visible.sync="dialogRebookVisible">
      <rebook ref="rebook" @closeDialog="closeDialog" type="borrow" :ctx="this"/>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import TopPanel from '../components/TopPanel'
import RightPanel from '../../../../components/RightPanel/index'
import TopMenu from '../components/TopMenu'
import BorrowList from './components/BorrowList'
import BorrowDetail from './components/BorrowDetail'
import Rebook from '../components/Rebook'
import dispatcher from '../stateManage/dispatchers'
export default {
  name: 'finance_borrow',
  components: { BorrowList, BorrowDetail, Rebook, TopMenu, RightPanel, TopPanel },
  data(){
    return {
      dialogRebookVisible: false,
      tabList: [
        {
          key: 'wfStatus',
          label: '提交',
          value: '提交'
        },
        {
          key: 'wfStatus',
          label: '财务审核',
          value: '财务审核'
        },
        {
          key: 'wfStatus',
          label: '支付',
          value: '支付'
        },
        {
          key: 'wfStatus',
          label: '还款',
          value: '还款'
        }
      ],
      title: '',
      type: '',
      toolArr: [
        {index:'4',name:'新建',icon:'el-icon-document-add',action: 'BORROW_CREATE'},
        {index:'5',name:'修改',icon:'el-icon-edit-outline',action: 'BORROW_EDIT', permissions: 344},
        {index:'6',name:'删除',icon:'el-icon-delete',action: 'BORROW_DELETE', permissions: 345},
        {index:'7',name:'提交',icon:'el-icon-check',action: 'BORROW_SUBMIT'},
        {index:'8',name:'财务审核',icon:'iconfont icon-caiwu1',action: 'BORROW_AUDIT', permissions: 310},
        {index:'9',name:'支付',icon:'el-icon-coin',action: 'BORROW_PAY', permissions: 311},
        {index:'10',name:'还款',icon:'el-icon-thumb',action: 'BORROW_REPAY', permissions: 312},
        { index: '11', name: '改签', icon: 'iconfont icon-yemianxiugai', action: 'BORROW_REBOOK' },
      ]
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
      search && this.$refs.borrowList.queryList()
      this.dialogRebookVisible = false
    },
    handleEvents({ action, data }) {
      dispatcher(this)(action, data)
    },
    cancel(){
      this.$refs.borrowList.cancel()
    },
  }
}
</script>

<style lang="scss" scoped>
 @import "~@/styles/miniAg.scss";
</style>
