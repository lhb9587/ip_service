<template>
  <div>
    <top-panel v-if="toolPosTop == 'top'" :tool-arr="toolArr" tool-type="report_manage_tool" :ctx="this"/>
    <report-top-menu :ctx="this" :tab-list="tabList" type="manage"/>
    <right-panel v-if="toolPosTop == 'right'" :tool-arr="toolArr" tool-type="report_manage_tool" :ctx="this"></right-panel>
    <ManageList ref="manageList"/>
  </div>
</template>

<script>
import { mapState } from "vuex";
import TopPanel from '../../components/TopPanel'
import RightPanel from '../../../../../components/RightPanel/index'
import ReportTopMenu from '../components/ReportTopMenu'
import ManageList from './components/ManageList'
export default {
  name: 'finance_report_manage',
  components: { ManageList, ReportTopMenu, RightPanel, TopPanel },
  data(){
    return {
      // 顶部菜单项
      tabList: [],
      toolArr: [
        {index:'4',name:'新建',icon:'el-icon-document-add',action: 'REPORT_MANAGE_CREATE'},
        {index:'5',name:'修改',icon:'el-icon-edit-outline',action: 'REPORT_MANAGE_EDIT'},
        {index:'6',name:'删除',icon:'el-icon-delete',action: 'REPORT_MANAGE_DELETE'}
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
