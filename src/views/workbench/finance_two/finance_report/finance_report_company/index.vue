<template>
  <div>
    <top-panel v-if="toolPosTop == 'top'" :tool-arr="toolArr" tool-type="report_company_tool" :ctx="this"/>
    <right-panel v-if="toolPosTop == 'right'" :tool-arr="toolArr" tool-type="report_company_tool" :ctx="this"></right-panel>
    <CompanyList ref="companyList"/>
  </div>
</template>

<script>
import { mapState } from "vuex";
import TopPanel from '../../components/TopPanel'
import RightPanel from '../../../../../components/RightPanel/index'
import CompanyList from './components/CompanyList'
export default {
  name: 'finance_report_company',
  components: { CompanyList, RightPanel, TopPanel },
  data(){
    return {
      // 顶部菜单项
      tabList: [],
      toolArr: [
        {index:'4',name:'新建',icon:'el-icon-document-add',action: 'REPORT_COMPANY_CREATE', permissions: 486, updateSign: true},
        {index:'5',name:'修改',icon:'el-icon-edit-outline',action: 'REPORT_COMPANY_EDIT', permissions: 486, updateSign: true},
        {index:'6',name:'删除',icon:'el-icon-delete',action: 'REPORT_COMPANY_DELETE', permissions: 486, updateSign: true}
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
