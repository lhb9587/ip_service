<template>
  <div>
    <top-panel v-if="toolPosTop == 'top'" :tool-arr="toolArr" tool-type="report_account_tool" :ctx="this"/>
    <report-top-menu :ctx="this" :tab-list="tabList" type="account"/>
    <right-panel v-if="toolPosTop == 'right'" :tool-arr="toolArr" tool-type="report_account_tool" :ctx="this"></right-panel>
    <AccountList ref="accountList"/>
  </div>
</template>

<script>
import { mapState } from "vuex";
import TopPanel from '../../components/TopPanel'
import RightPanel from '../../../../../components/RightPanel/index'
import ReportTopMenu from '../components/ReportTopMenu'
import AccountList from './components/AccountList'
export default {
  name: 'finance_report_account',
  components: { AccountList, ReportTopMenu, RightPanel, TopPanel },
  data(){
    return {
      // 顶部菜单项
      tabList: [],
      toolArr: [
        {index:'4',name:'新建',icon:'el-icon-document-add',action: 'REPORT_ACCOUNT_CREATE'},
        {index:'5',name:'修改',icon:'el-icon-edit-outline',action: 'REPORT_ACCOUNT_EDIT'},
        {index:'6',name:'删除',icon:'el-icon-delete',action: 'REPORT_ACCOUNT_DELETE'}
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
    cancel(){
      // this.$refs.billList.cancel()
    },
  }
}
</script>

<style scoped>

</style>
