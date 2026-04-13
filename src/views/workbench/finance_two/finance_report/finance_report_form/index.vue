<template>
  <div>
    <top-panel v-if="toolPosTop == 'top'" :tool-arr="toolArr" tool-type="report_tool" :ctx="this"/>
    <report-top-menu :ctx="this" :tab-list="tabList" type="report"/>
    <right-panel v-if="toolPosTop == 'right'" :tool-arr="toolArr" tool-type="report_tool" :ctx="this"></right-panel>
    <ReportList ref="reportList"/>
  </div>
</template>

<script>
import { mapState } from "vuex";
import TopPanel from '../../components/TopPanel'
import RightPanel from '../../../../../components/RightPanel/index'
import ReportList from './components/ReportList'
import ReportTopMenu from '../components/ReportTopMenu'
export default {
  name: 'finance_report',
  components: { ReportTopMenu, RightPanel, ReportList, TopPanel },
  data(){
    return {
      // 顶部菜单项
      tabList: [
        // 财务状况,从业人员工资总额,经营财务研发，财务需求暂时隐藏
        // {
        //   key: 'action',
        //   label: '财务状况',
        //   value: 'financial',
        //   permissions: 316
        // },
        // {
        //   key: 'action',
        //   label: '从业人员工资总额',
        //   value: 'salary',
        //   permissions: 317
        // },
        // {
        //   key: 'action',
        //   label: '经营财务研发',
        //   value: 'manageDev',
        //   permissions: 318
        // },
        {
          key: 'action',
          label: '损益表',
          value: 'profitLoss',
          permissions: 319
        },
        {
          key: 'action',
          label: '资产负债表',
          value: 'assetsDebt',
          permissions: 320
        },
        {
          key: 'action',
          label: '货币资金情况表',
          value: 'fundBalance',
          permissions: 321
        }
      ],
      toolArr: [
        {index:'4',name:'新建',icon:'el-icon-document-add',action: 'REPORT_CREATE'},
        {index:'5',name:'修改',icon:'el-icon-edit-outline',action: 'REPORT_EDIT'},
        {index:'6',name:'删除',icon:'el-icon-delete',action: 'REPORT_DELETE'},
        {index:'7',name:'下载',icon:'el-icon-download',action: 'REPORT_EXPORT', permissions: 332},
        {index:'8',name:'锁定解锁',icon:'el-icon-lock',action: 'REPORT_LOCK', permissions: 325 },
      ]
    }
  },
  created() {
    // console.log(this.$store.getters.permissions)
  },
  computed: {
    ...mapState({
      showSettings: state => state.settings.showSettings,
      toolPosTop: state => state.settings.toolPosTop
    })
  },
  methods: {
    cancel(){
      // this.$refs.billList.cancel()
    },
  }
}
</script>

<style scoped>

</style>
