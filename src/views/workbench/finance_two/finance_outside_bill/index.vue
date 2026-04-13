<template>
  <div>
    <top-panel v-if="toolPosTop == 'top'" :tool-arr="toolArr" tool-type="outside_bill_tool" :ctx="this" :mbData="mbData"/>
    <top-menu :buss-id="16" :ctx="this" :tab-list="tabList" type="outBill" style="margin-top: 10px"/>
    <right-panel v-if="toolPosTop == 'right'" :tool-arr="toolArr" tool-type="outside_bill_tool" :mbData="mbData"
                 :ctx="this"></right-panel>
    <overseas-bill ref="overseasBillList" :is-finance="true" :ctx="this"/>

    <!--  境外账单操作  -->
    <el-dialog v-if="outBillView" class="abow_dialog" :title="outBillTitle" :close-on-click-modal="false" :visible.sync="outBillView" width="80%"
               height="80%" :before-close="closeDialog">
      <component :is="cpnName" v-if="outBillView" ref="outBill" :out-abroad-bill-id="outAbroadBillId" :finance-type="financeType"
                 :is-finance="true" @close="closeDialog"/>
    </el-dialog>
    <!--  改签  -->
    <el-dialog title="改签任务" :visible.sync="dialogRebookVisible">
      <rebook ref="rebook" @closeDialog="closeRebookDialog" :ctx="this" dataName="境外账单"/>
    </el-dialog>
  </div>
</template>

<script>
  import {mapState} from "vuex";
  import TopMenu from "../components/TopMenu";
  import TopPanel from "../components/TopPanel";
  import RightPanel from "../../../../components/RightPanel/index";
  import Rebook from '../components/Rebook'
  import OverseasBill from '../../finance/overseasBill'
  import AddOverseasBill from '../../finance/overseasBill/addOverseasBill'
  import SeeOverseasBill from '../../finance/overseasBill/seeOverseasBill'
  import {queryAbroadBillTemplate} from '@/api/billApi'

  export default {
    name: "index",
    components: {RightPanel, TopPanel, TopMenu, Rebook, OverseasBill, AddOverseasBill, SeeOverseasBill},
    computed: {
      ...mapState({
        toolPosTop: state => state.settings.toolPosTop
      })
    },
    data() {
      return {
        outAbroadBillId: '',
        outBillTitle: '',
        financeType: '',
        cpnName: '',
        outBillView: false,
        dialogRebookVisible: false,
        tabList: [
          {
            key: 'wfStatus',
            label: '待提交',
            value: '待提交'
          },
          {
            key: 'wfStatus',
            label: '待财务初审',
            value: '待财务初审'
          },
          {
            key: 'wfStatus',
            label: '待支付',
            value: '待支付'
          },
          {
            key: 'wfStatus',
            label: '待费用复审',
            value: '待费用复审'
          },
          {
            key: 'wfStatus',
            label: '全部',
            value: ''
          }
        ],
        mbData: [],
        toolArr: [
          {index: '1', name: '新建', icon: 'el-icon-document-add', action: 'OUTBILL_CREATE', permissions: 229},
          {index: '2', name: '修改', icon: 'el-icon-edit-outline', action: 'OUTBILL_EDIT', permissions: 230},
          {index: '3', name: '提交', icon: 'iconfont icon-tijiao', action: 'OUTBILL_SUBMIT'},
          {index: '4', name: '初审', icon: 'iconfont icon-chushen', action: 'OUTBILL_FIRSTAUDIT', permissions: 348},
          {index: '5', name: '支付', icon: 'iconfont icon-payingY-fill', action: 'OUTBILL_PAY', permissions: 349},
          {index: '6', name: '复审', icon: 'iconfont icon-fushenguanli', action: 'OUTBILL_SECONDAUDIT', permissions: 350},
          {index: '7', name: '设置/取消同批付款', icon: 'iconfont icon-pici', action: 'OUTBILL_BATCH_PAY'},
          { index: '9', name: '批量编辑', icon: 'iconfont icon-piliangbianji', action: 'OUTBILL_PL_EDIT', permissions: 352},
          { index: '10', name: '模板生成', icon: 'iconfont icon-mobanguanli', action: 'OUTBILL_EXPORT_MODEL', permissions: 353 },
          { index: '11', name: '生成费用', icon: 'iconfont icon-feiyongshenqing', action: 'OUTBILL_CREATE_FEE', permissions: 354 },
          { index: '12', name: '改签', icon: 'iconfont icon-yemianxiugai', action: 'OUTBILL_REBOOK' },
          { index: '13', name: '上传境外账单', icon: 'el-icon-upload', action: 'UPLOAD_BILL' },
          { index: '14', name: '下载境外账单', icon: 'el-icon-download', action: 'DOWNLOAD_BILL' },
          { index: '14', name: '批量导入境外账单', icon: 'el-icon-upload', action: 'OUTBILL_PATCHIMPORT' }
        ]
      }
    },
    methods: {
      seeFun(abroadBillId){
        this.outAbroadBillId = abroadBillId
        this.outBillTitle = '境外账单-查看'
        this.outBillView = true
        this.cpnName = 'SeeOverseasBill'
      },
      createFun(){
        this.outBillTitle = '境外账单-新建'
        this.outBillView = true
        this.cpnName = 'AddOverseasBill'
        this.financeType = '1'
      },
      editFun(abroadBillId, type){
        this.outAbroadBillId = abroadBillId
        this.outBillTitle = '境外账单-编辑'
        this.outBillView = true
        this.cpnName = 'AddOverseasBill'
        this.financeType = type
      },
      closeDialog(search) {
        this.outBillTitle = ''
        this.outBillView = false
        this.cpnName = ''
        this.financeType = ''
        this.$refs.overseasBillList.queryAbroadList()
      },
      closeRebookDialog(){
        this.dialogRebookVisible = false
        this.$refs.overseasBillList.queryAbroadList()
      }
    },
    created() {
      queryAbroadBillTemplate().then(res => {
        const list = res.data || []
        this.mbData = list.map(item => ({
          id: item.id,
          name: item.name,
          code: item.code
        }))
      })
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
