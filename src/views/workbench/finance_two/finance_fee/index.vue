<template>
  <div>
    <top-panel v-if="toolPosTop == 'top'" :tool-arr="toolArr" :tool-type="isDetail ? 'fee_detail_tool' : 'fee_tool'" :ctx="this"/>
    <top-menu :buss-id="bussId" :ctx="this" :tab-list="tabList" type="fee"/>
    <right-panel v-if="toolPosTop == 'right'" :tool-arr="toolArr" :tool-type="isDetail ? 'fee_detail_tool' : 'fee_tool'" :ctx="this"></right-panel>
    <cost_list :buss-id="bussId" ref="costList" :is-detail="isDetail" :is-finance="true" @events="handleEvents"/>

    <!--  改签  -->
    <el-dialog v-if="dialogRebookVisible" title="改签任务" :visible.sync="dialogRebookVisible">
      <rebook v-if="dialogRebookVisible" ref="rebook" @closeDialog="closeDialog" :ctx="this" dataName="费用"/>
    </el-dialog>

    <!--  费用核销  -->
    <el-dialog v-if="dialogVerificationVisible" class="verification" title="修改核销状态" :visible.sync="dialogVerificationVisible">
      <verification-status v-if="dialogVerificationVisible" ref="verification" @closeDialog="closeVerificationDialog" :ctx="this"/>
    </el-dialog>

<!--    欠票-->
    <InvoiceBorrowDetail ref="invoiceBorrowDetail" />

    <el-dialog
      v-if="feedialogVisible"
      :title="feeDetailEdit ? '费用编辑' : '费用查看'"
      :close-on-click-modal="false"
      :visible.sync="feedialogVisible"
      width="80%"
      height="80%"
      class="abow_dialog"
    >
      <component v-if="feedialogVisible" :is="feeDetailEdit ? 'AddFeeDetail' : 'SeeFeeDetail'"
                 :dialog-fee-type="feeType" :dialog-fee-id="feeId" :dialog-task-no="taskNo"
                 @close="closeFeeDialog"></component>
    </el-dialog>
  </div>
</template>

<script>
  import { queryFeeTaskDefine } from "@/api/feeList";
  import dispatcher from '../stateManage/dispatchers'
  import { mapState } from 'vuex'
  import TopPanel from '../components/TopPanel'
  import RightPanel from '../../../../components/RightPanel/index'
  import Cost_list from '../../finance/cost/cost_list'
  import SeeFeeDetail from '../../finance/cost/seeFeeDetail'
  import AddFeeDetail from '../../finance/cost/addFeeDetail'
  import Rebook from '../components/Rebook'
  import VerificationStatus from './components/VerificationStatus'
  import TopMenu from '../components/TopMenu'
  import InvoiceBorrowDetail from "../finance_invoice/finance_invoice_borrow/components/InvoiceBorrowDetail";

  export default {
    name: 'index',
    props:{
      isDetail: {
        type: Boolean,
        default: false
      },
      bussId:{
        type: Number,
        default: 14
      }
    },
    components: {InvoiceBorrowDetail, TopMenu, VerificationStatus, Rebook, SeeFeeDetail, Cost_list, RightPanel, TopPanel, AddFeeDetail },
    computed: {
      ...mapState({
        showSettings: state => state.settings.showSettings,
        toolPosTop: state => state.settings.toolPosTop
      })
    },
    data() {
      return {
        tabList: [

        ],
        dialogVerificationVisible: false,
        dialogRebookVisible: false,
        feeId: '',
        feeType: '',
        taskNo: '',
        feedialogVisible: false,
        feeDetailEdit: false,
        toolArr: [
          { index: '1', name: '新建', icon: 'el-icon-document-add', action: 'FEE_CREATE'},
          { index: '2', name: '修改', icon: 'el-icon-edit-outline', action: 'FEE_EDIT', permissions: 222 },
          { index: '3', name: '删除', icon: 'el-icon-delete', action: 'FEE_DELETE', permissions: 223 },
          { index: '4', name: '费用提交', icon: 'iconfont icon-tijiao', action: 'FEE_SUBMIT', permissions: 219 },
          { index: '5', name: '组长1审核', icon: 'iconfont icon-man-examine', action: 'FEE_GROUPAUDIT', permissions: 220 },
          { index: '6', name: '组长2审核', icon: 'iconfont icon-shenheyijian', action: 'FEE_ASSUMEJOB_AUDIT', permissions: 221 },
          { index: '7', name: '费用加批', icon: 'iconfont icon-shenheyijian', action: 'FEE_ADD_RULE', permissions: 368, updateSign: true },
          { index: '8', name: '财务负责人加审', icon: 'iconfont icon-shenheyijian', action: 'FEE_ADD_AUDIT', permissions: 516, updateSign: true },
          { index: '9', name: '账单财务岗审核', icon: 'iconfont icon-shenheyijian', action: 'FEE_USER_AUDIT', permissions: 518 },
          { index: '10', name: '复核', icon: 'iconfont icon-fushenguanli', action: 'FEE_FIRSTAUDIT', permissions: 347, updateSign: true},
          { index: '11', name: '查验', icon: 'iconfont icon-chayan', action: 'FEE_SECONDAUDIT', permissions: 336 },
          { index: '12', name: '支付', icon: 'iconfont icon-payingY-fill', action: 'FEE_PAY', permissions: 337 },
          { index: '13', name: '改签', icon: 'iconfont icon-yemianxiugai', action: 'FEE_REBOOK' },
          { index: '14', name: '所属月', icon: 'iconfont icon-benyuedianjihou', action: 'FEE_BELONG_MONTH', permissions: 327 },
          { index: '15', name: '支付方式', icon: 'iconfont icon-zhifufangshi-yuezhifu', action: 'FEE_PAY_STYLE', permissions: 328 },
          { index: '16', name: '复制费用', icon: 'iconfont icon-fuzhi', action: 'FEE_COPY', permissions: 338 },
          {
            index: '15',
            name: '核销状态',
            icon: 'iconfont icon-dingdanliebiao-12px-hexiaozhuangtai',
            action: 'FEE_VERIFICATION_STATUS',
            permissions: 330
          },
          { index: '15', name: '欠票提醒', icon: 'iconfont icon-qianfeijilu', action: 'FEE_INVOICE_REMIND', permissions: this.isDetail ? '' : 10086 }, // 10086可替换成非权限表中的数字
          { index: '16', name: '批量编辑', icon: 'iconfont icon-piliangbianji', action: 'FEE_DETAIL_PL_EDIT', permissions: this.isDetail ? 351 : 10086, updateSign: true},
          { index: '17', name: '生成模板', icon: 'iconfont icon-mobanguanli', action: 'FEE_EXPORT_MODEL'}

        ].filter(item => item.name === '批量编辑' ? this.$store.getters.permissions.includes(222) : true)
      }
    },
    created() {
      queryFeeTaskDefine().then(res => {
        let list =res.data.filter(item=>!!item)
        this.tabList = list.map(item => ({
          key: 'taskNo',
          label: item.taskName,
          value: item.taskNo
        }))
      })
      if (this.$route.query.contractId) { // 如果地址带合同id，默认打开新建费用弹框，任务2-455
        this.editFee({}, 1)
      }
    },
    methods: {
      closeDialog(search) {
        if(search){
          if(search === true){
            this.$refs.costList.queryFeeList()
          }else if(typeof search == 'object'){
            this.$refs.costList.queryPartData(search)
          }
        }
        // search && this.$refs.costList.queryFeeList()
        this.dialogRebookVisible = false
      },
      handleEvents({ action, data }) {
        dispatcher(this)(action, data)
      },
      seeFee(row) {
        this.feeId = row.feeId
        this.taskNo = row.taskNo
        this.feedialogVisible = true
        this.feeDetailEdit = false
      },
      editFee(row, feeType) {
        this.feeId = row.feeId
        this.taskNo = row.taskNo
        this.feeType = feeType
        this.feedialogVisible = true
        this.feeDetailEdit = true
      },
      closeVerificationDialog(search) {
        if(search){
          if(search === true){
            this.$refs.costList.queryFeeList()
          }else if(typeof search == 'object'){
            this.$refs.costList.queryPartData(search)
          }
        }
        this.dialogVerificationVisible = false
        // search && this.$refs.costList.queryFeeList()
      },
      closeFeeDialog(search) {
        if(search){
          if(search === true){
            this.$refs.costList.queryFeeList()
          }else if(typeof search == 'object'){
            this.$refs.costList.queryPartData(search)
          }
        }
        this.feedialogVisible = false
        this.feeId = ''
        this.taskNo = ''
        this.feeType = ''
      }
    }
  }
</script>

<style lang="scss" scoped>
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

  .verification {
    > > > .el-dialog__body {
      padding-top: 0;
    }
  }
  @import "~@/styles/miniAg.scss";
</style>
