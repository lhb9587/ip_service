<template>
  <div>
    <top-panel v-if="toolPosTop == 'top'" :tool-arr="toolArr" tool-type="bill_tool" :ctx="this" :mbData="mbData"/>
    <top-menu :display="true" :buss-id="8" :ctx="this" :tab-list="tabList" type="bill"/>
    <right-panel v-if="toolPosTop == 'right'" :tool-arr="toolArr" tool-type="bill_tool" :ctx="this"
                 :mbData="mbData"></right-panel>
    <bill-list ref="billList" :is-finance="true" @changeTicket="changeTicket"/>
    <!--  改签  -->
    <el-dialog v-if="dialogRebookVisible"  title="改签任务" :visible.sync="dialogRebookVisible">
      <rebook v-if="dialogRebookVisible" ref="rebook" @closeDialog="closeDialog" :ctx="this" dataName="账单"/>
    </el-dialog>
    <!--    坏账-->
    <el-dialog v-if="badBillView" title="账单-坏账" :close-on-click-modal="false" :visible.sync="badBillView">
      <bad-bill v-if="badBillView" ref="badBill" @closeBadView="closeDialog"></bad-bill>
    </el-dialog>
    <!--    境外账单-->
    <el-dialog v-if="outBillView" class="abow_dialog" title="收到境外账单" :close-on-click-modal="false" :visible.sync="outBillView" width="80%"
               height="80%">
      <add-over-sears-bill v-if="outBillView" ref="outBill" :createOverBillNo="createOverBillNo" :finance-type="1" :is-finance="true" @close="closeDialog"/>
    </el-dialog>
<!--    账单收款-->
    <el-dialog
      v-if="collectDialogVisible"
      title="收款-新建"
      :close-on-click-modal="false"
      :visible.sync="collectDialogVisible"
      width="80%"
      height="80%"
      class="abow_dialog"
    >
      <collection-detail v-if="collectDialogVisible" :curIdString="curIdString" :billIds="billIds"  type="create" @closeDialog="closeDialog" />
    </el-dialog>
  </div>
</template>

<script>
  import { queryBillTemplateUrl } from '@/api/billApi'
  import { mapState } from 'vuex'
  import TopPanel from '../components/TopPanel'
  import RightPanel from '../../../../components/RightPanel/index'
  import TopMenu from '../components/TopMenu'
  import BillList from '../../finance/billviews/components/billList'
  import BillDetail from '../../finance/billviews/components/billDetail'
  import Rebook from '../components/Rebook'
  import BadBill from '../components/BadBill'
  import AddOverSearsBill from '../../finance/overseasBill/addOverseasBill'
  import CollectionDetail from "../../finance/collections/components/CollectionDetail";

  export default {
    name: 'finance_bill',
    components: {CollectionDetail, BadBill, Rebook, BillDetail, BillList, TopMenu, RightPanel, TopPanel, AddOverSearsBill },
    data() {
      return {
        collectDialogVisible: false,
        curIdString: '',
        billIds: '',
        mbData: [],
        createOverBillNo: '',
        outBillView: false,
        badBillView: false,
        name: '',
        list: [],
        dialogRebookVisible: false,
        tabList: [
          // {
          //   key: 'billwfStatus',
          //   label: '待核销',
          //   value: '待核销'
          // },
          {
            key: 'billwfStatus',
            label: '待提交',
            value: '待提交'
          },
          {
            key: 'billwfStatus',
            label: '待组长审核',
            value: '待组长审核'
          },
          // {
          //   key: 'billwfStatus',
          //   label: '待账单岗审核',
          //   value: '待账单岗审核'
          // },
          {
            key: 'billwfStatus',
            label: '待财务审核',
            value: '待财务审核'
          },
          {
            key: 'billwfStatus',
            label: '承办组组长退回',
            value: '承办组组长退回'
          },
          {
            key: 'billwfStatus',
            label: '待同意分配',
            value: '待同意分配'
          },
          {
            // key: 'belongToDateArrayOut',
            key: 'queryCurrMonth',
            label: '本月账单',
            value: 1,
            // value: [this.$wUtil.getDate('', 'month', '-'), this.$wUtil.getDate('', 'month', '-')]
          },
          {
            key: 'queryCurrYearMyWkg',
            label: '本组年度',
            value: 1,
            // value: [this.$wUtil.getDate('', 'year') + '-01', this.$wUtil.getDate('', 'year') + '-12']
          }
        ],
        title: '',
        billData: {},
        type: '',
        billDetailState: false,
        toolArr: [ //  updateSign 更新相应的功能菜单，初始默认值为undefined，如需更新对应功能按钮，改变updateSign的值即可
          { index: '1', name: '新建', icon: 'el-icon-document-add', action: 'BILL_CREATE', permissions: 160 }, // 未做
          { index: '2', name: '修改', icon: 'el-icon-edit-outline', action: 'BILL_EDIT', permissions: 163 },
          { index: '3', name: '删除', icon: 'el-icon-delete', action: 'BILL_DELETE', permissions: 164 },
          { index: '4', name: '提交', icon: 'iconfont icon-tijiao', action: 'BILL_SUBMIT', permissions: 22 },
          { index: '5', name: '组长审核', icon: 'iconfont icon-man-examine', action: 'BILL_HEADMAN_AUDIT', permissions: 243 },
          // { index: '6', name: '账单岗审核', icon: 'iconfont icon-shenheyijian', action: 'BILL_JOB_AUDIT', permissions: 244 },
          { index: '7', name: '财务审核', icon: 'iconfont icon-caiwu1', action: 'BILL_AUDIT', permissions: 245 },
          { index: '8', name: '同意比例', icon: 'iconfont icon-chengbanzu', action: 'BILL_UNDERTAKE', permissions: 246, updateSign: true }, // 待测试
          { index: '9', name: '重新确认比例', icon: 'iconfont icon-chongxin', action: 'BILL_RECONFIRM', permissions: 243 }, // 待测试
          { index: '10', name: '改签', icon: 'iconfont icon-yemianxiugai', action: 'BILL_REBOOK' },
          { index: '11', name: '模板生成', icon: 'iconfont icon-mobanguanli', action: 'BILL_EXPORT_MODEL' },
          { index: '12', name: '开发票', icon: 'iconfont icon-fapiaoxinxi', action: 'BILL_CREATE_INVOICE', permissions: 215 },
          { index: '13', name: '境外账单', icon: 'iconfont icon-diqiu', action: 'BILL_OUTBILL', permissions: 229 },
          { index: '14', name: '账单收款', icon: 'iconfont icon-shoukuan1', action: 'BILL_COLLECTION', permissions: 304 },
          { index: '15', name: '填写备注', icon: 'el-icon-chat-line-square', action: 'BILL_EDIT_REMARK', permissions: 155 },
          { index: '16', name: '修改开单日期', icon: 'iconfont icon-riqixuanze', action: 'BILL_EDIT_DATE', permissions: 156 },
          { index: '17', name: '生成总账单号', icon: 'iconfont icon-zhangdanhao', action: 'BILL_SUMBILLNO', permissions: 157 },
          { index: '18', name: '设置结余', icon: 'iconfont icon-jieyu', action: 'BILL_BALANCE', permissions: 334 },
          { index: '19', name: '坏账', icon: 'iconfont icon-liefeng', action: 'BILL_BADBILL', permissions: 329 },
          { index: '20', name: '下载', icon: 'el-icon-download', action: 'BILL_DOWNLOAD' }
        ]
      }
    },
    computed: {
      ...mapState({
        showSettings: state => state.settings.showSettings,
        toolPosTop: state => state.settings.toolPosTop
      })
    },
    created() {
      this.queryMbData()
    },
    methods: {
      changeTicket(row) {
        let taskIdList = []
        let num = 0
        if (row.taskList&&row.taskList.find(j => j.taskCandidates.includes(String(this.$store.getters.userId)))) {
          taskIdList.push(row.taskList.find(j => j.taskCandidates.includes(String(this.$store.getters.userId))).taskId)
        } else {
          num++
        }
        if (num) {
          this.$message.error(`您所选择的 [账单] 中没有您的任务！`)
          return
        }
        this.dialogRebookVisible = true
        this.$nextTick(() => {
          this.$refs.rebook.$data.taskIdList = taskIdList
        })
      },
      queryMbData() {
        queryBillTemplateUrl().then(res => {
          this.mbData = res.data
        })
      },
      closeDialog(search) {
        if(search){
          if(search === true){
            this.$refs.billList.queryList()
          }else if(typeof search == 'string'){
            this.$refs.billList.changeGridData(search)
          }
        }
        this.dialogRebookVisible = false
        this.collectDialogVisible = false
        this.badBillView = false
        this.outBillView = false
      },
      cancel() {
        this.$refs.billList.cancel()
      }
    }
  }
</script>

<style lang="scss" scoped>

  > > > .el-dialog__body {
    padding-top: 0;
    padding-bottom: 0;
  }

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

  .exportModel {
    position: absolute;
    top: 60px;
    z-index: 99;
    /*.modelItem{*/
    /*  height: 40px;*/
    /*  line-height: 40px;*/
    /*  cursor: pointer;*/
    /*  &:hover{*/
    /*    background-color: #ECF5FF;*/
    /*    color: #66B7FF;*/
    /*  }*/
    /*}*/
  }
  @import "~@/styles/miniAg.scss";
</style>
