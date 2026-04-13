<template>
  <div>
    <top-panel v-if="toolPosTop == 'top'" :tool-arr="toolArr" tool-type="collect_tool" :ctx="this"/>
    <right-panel v-if="toolPosTop == 'right'" :tool-arr="toolArr" tool-type="collect_tool" :ctx="this" />
    <top-menu :buss-id="46" :ctx="this" :tab-list="tabList" type="collect"/>
    <Collection ref="collectionList" :is-finance="true" @events="handleEvents" />
    <!--  改签  -->
    <el-dialog v-if="dialogRebookVisible" title="改签任务" :visible.sync="dialogRebookVisible">
      <rebook v-if="dialogRebookVisible"  ref="rebook" @closeDialog="closeDialog" :ctx="this" dataName="收款"/>
    </el-dialog>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import Collection from '../../finance/collections'
  import TopPanel from "../components/TopPanel";
  import RightPanel from "../../../../components/RightPanel/index";
  import TopMenu from "../components/TopMenu";
  import Rebook from "../components/Rebook";
  import dispatcher from "../stateManage/dispatchers";
  export default {
    components:{
      Rebook,
      TopMenu,
      RightPanel,
      TopPanel,
      Collection
    },
    name: 'index',
    computed: {
      ...mapState({
        showSettings: state => state.settings.showSettings,
        toolPosTop: state => state.settings.toolPosTop
      })
    },
    data(){
      return {
        dialogRebookVisible: false,
        componentStr: '',
        collectDialogVisible: false,
        title: '',
        toolArr: [
          { index: '1', name: '新建', icon: 'el-icon-document-add', action: 'COLLECTION_CREATE', permissions: 303 },
          { index: '2', name: '修改', icon: 'el-icon-edit-outline', action: 'COLLECTION_EDIT', permissions: 339 },
          { index: '3', name: '删除', icon: 'el-icon-delete', action: 'COLLECTION_DELETE', permissions: 340 },
          { index: '4', name: '提交', icon: 'el-icon-check', action: 'COLLECTION_SUBMIT' },
          { index: '5', name: '结账', icon: 'iconfont icon-jiezhang1', action: 'COLLECTION_CHECK', permissions: 341 },
          { index: '6', name: '改签', icon: 'iconfont icon-yemianxiugai', action: 'COLLECTION_REBOOK' },
        ],
        tabList: [
          {
            key: 'wfStatusOut',
            label: '待提交',
            value: '待提交'
          },
          {
            key: 'wfStatusOut',
            label: '待结账',
            value: '待结账'
          },
          {
            key: 'wfStatusDetail',
            label: '待提交(明细)',
            value: '待提交'
          },
          {
            key: 'wfStatusDetail',
            label: '待结账(明细)',
            value: '待结账'
          },
          {
            key: 'createDateArray',
            label: '本月收款',
            value: []
          },
        ]
      }
    },
    methods: {
      handleEvents({ action, data }) {
        dispatcher(this)(action, data)
      },
      closeDialog(search) {
        if(search){
          if(search === true){
            this.$refs.collectionList.handleSearch(this.$refs.collectionList.$data.searchType)
          }else if(typeof search == 'object'){
            this.$refs.collectionList.queryPartData(search)
          }
        }
        this.dialogRebookVisible = false
      }
    }

  }
</script>

<style lang="scss" scoped>
@import "~@/styles/miniAg.scss";
</style>
