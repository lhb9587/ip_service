<template>
    <div>
<!--      <div v-if="identification === 'types_of_casescase_management_litigation'">-->
<!--        <Tabs class="tabs" v-model="editableTabsValue" type="card" closable @tab-remove="removeTab" @tab-click="tabClick">-->
<!--          <el-tab-pane-->
<!--            v-for="(item, index) in editableTabs"-->
<!--            :key="item.name"-->
<!--            :label="item.title+`（${item.list.length}）`"-->
<!--            :name="item.name"-->
<!--          >-->
<!--            &lt;!&ndash;          <Table :list="item.list" :editableTabsValue="editableTabsValue"></Table>&ndash;&gt;-->
<!--            <LitigationTable :defaultGetContextMenuItems="getContextMenuItems" :identification="identification" :defaultColumnDefs="defaultColumnDefs" :list="item.list" :editableTabsValue="editableTabsValue"></LitigationTable>-->
<!--          </el-tab-pane>-->
<!--        </Tabs>-->
<!--      </div>-->

        <Tabs class="tabs" v-model="editableTabsValue" type="card" closable @tab-remove="removeTab" @tab-click="tabClick">
          <el-tab-pane
            v-for="(item, index) in editableTabs"
            :key="item.name"
            :label="item.title+`（${item.list.length}）`"
            :name="item.name"
          >

            <LitigationTable ref="litigationTables" :name="item.title" v-if="identification === 'types_of_all_cases' ||identification === 'litigationCasecase_managementlitigation' || identification === 'patentCasecase_managementpatent'" :taskType="taskType" :defaultGetContextMenuItems="getContextMenuItems" :identification="identification" :defaultColumnDefs="defaultColumnDefs" :list="item.list" :editableTabsValue="editableTabsValue"></LitigationTable>

            <OverseasTable v-if="identification === 'indexoverseasBill'" :page-title="pageTitle" :defaultGetContextMenuItems="getContextMenuItems" :identification="identification" :defaultColumnDefs="defaultColumnDefs" :list="item.list" :editableTabsValue="editableTabsValue"></OverseasTable>
            <!--          <Table :list="item.list" :editableTabsValue="editableTabsValue"></Table>-->
            <BillTable v-if="identification === 'billListbill'" :page-title="pageTitle" :defaultGetContextMenuItems="getContextMenuItems" :identification="identification" :defaultColumnDefs="defaultColumnDefs" :list="item.list" :editableTabsValue="editableTabsValue" @cancel="cancel"></BillTable>

            <CostTable v-if="identification === 'cost_listcost_list'" :page-title="pageTitle" :defaultGetContextMenuItems="getContextMenuItems" :identification="identification" :defaultColumnDefs="defaultColumnDefs" :list="item.list" :editableTabsValue="editableTabsValue"></CostTable>

            <InvocieTable @copyInvo="copyInvo" @invocie="invocie" @edit="edit" v-if="identification === 'invocieList'" :page-title="pageTitle" :defaultGetContextMenuItems="getContextMenuItems" :identification="identification" :defaultColumnDefs="defaultColumnDefs" :list="item.list" :editableTabsValue="editableTabsValue"></InvocieTable>

            <ArchiveTable v-if="identification === 'archiveList'" :page-title="pageTitle" :defaultGetContextMenuItems="getContextMenuItems" :identification="identification" :defaultColumnDefs="defaultColumnDefs" :list="item.list" :editableTabsValue="editableTabsValue"></ArchiveTable>

            <SampleTable v-if="identification === 'sampleList'" :page-title="pageTitle" :defaultGetContextMenuItems="getContextMenuItems" :identification="identification" :defaultColumnDefs="defaultColumnDefs" :list="item.list" :editableTabsValue="editableTabsValue"></SampleTable>

            <StorageTable :bussId="bussId" :business="business" v-on="$listeners" v-if="identification === 'types_of_casescase_management' || identification === 'types_of_casesofficialCommunication'" :page-title="pageTitle" :defaultGetContextMenuItems="getContextMenuItems" :identification="identification" :defaultColumnDefs="defaultColumnDefs" :list="item.list" :editableTabsValue="editableTabsValue"></StorageTable>

<!--            <communication-table v-if="identification === 'types_of_casesofficialCommunication'" :page-title="pageTitle" :defaultGetContextMenuItems="getContextMenuItems" :identification="identification" :defaultColumnDefs="defaultColumnDefs" :list="item.list" :editableTabsValue="editableTabsValue"></communication-table>-->

          </el-tab-pane>
        </Tabs>

    </div>
</template>

<script>
import {mapState,mapActions} from 'vuex'
import {unique, throttle} from '@/utils'
import Table from './Table'
import StorageTable from './StorageTable.vue'
import LitigationTable from "@/views/workbench/case/components/MyTabs/LitigationTable";

import OverseasTable from "./OverseasTable";
import BillTable from "./BillTable";
import CostTable from "./CostTable";
import InvocieTable from "./InvocieTable";
import ArchiveTable from "./ArchiveTable";
import SampleTable from "./SampleTable";
import Bus from '@/utils/Bus'
export default {
  props:{
    bussId: {},
    business: {},
    pageTitle:{

    },
    getContextMenuItems:{},
    defaultColumnDefs:{},
    identification:{}
  },
  components:{
    Table,StorageTable,LitigationTable,OverseasTable,BillTable,CostTable,InvocieTable,ArchiveTable,SampleTable
  },
  name: "index",
  data(){
    return {
      editableTabsValue:'',
      acitvit:''
    }
  },
  created() {
    console.log('identification',this.identification)
  },
  methods:{
    copyInvo(data) {
      this.$emit('copyInvo', data)
    },
    invocie(data) {
      this.$emit('invocie', data)
    },
    edit(data) {
      this.$emit('edit', data)
    },
    tabClick({name}, flag){
      if(flag){
        this.editableTabsValue = name
      }
      // if(this.identification == 'patentCasecase_managementpatent'){
        Bus.$emit('changeColumns', name)
      // }
      if(this.acitvit==''){
        this.acitvit=this.editableTabsValue
      }else if(this.acitvit==name){
        this.editableTabsValue=''
        this.acitvit=this.editableTabsValue
      } else {
        this.acitvit=this.editableTabsValue
      }
    },
    removeTab(targetName) {
      this.$store.commit('tabs/CHANGE_STORAGETABLE', {
        type: 'deleteItem',
        targetName: targetName,
        identification: this.identification
      })
      if (targetName == this.editableTabsValue) {
        this.editableTabsValue = ''
        this.acitvit = this.editableTabsValue
      }

      // if(this.pageTitle=='案件管理'){
      //   this.$store.commit('tabs/CHANGE_AJGLTABLIST',{type:'deleteItem',targetName:targetName})
      //   if(targetName==this.editableTabsValue){
      //     this.editableTabsValue=''
      //     this.acitvit=this.editableTabsValue
      //   }
      // }
    },
    removeTabs(targetName){
      this.$store.commit('tabs/CHANGE_AJGLTABLIST', {type:'deleteItem',targetName:targetName,identification:this.identification})
      if(targetName==this.editableTabsValue){
        this.editableTabsValue=''
        this.acitvit=this.editableTabsValue
      }
      // if(this.pageTitle=='案件管理'){
      //   this.$store.commit('tabs/CHANGE_AJGLTABLIST',{type:'deleteItem',targetName:targetName})
      //   if(targetName==this.editableTabsValue){
      //     this.editableTabsValue=''
      //     this.acitvit=this.editableTabsValue
      //   }
      // }
    },
    cancel(data){
      this.$emit('cancel',data)
    }
  },
  watch:{
    editableTabsValue(n){
      this.$emit('editableTab',n)
    }
  },
  computed:{
    taskType(){
      if (this.identification === 'patentCasecase_managementpatent') {
        return 4
      } else if (this.identification === 'types_of_all_cases') {

      } else {
        return 2
      }
    },
    ...mapState({
      'pattern' : state => state.user.pattern,
      storageTable:state => state.tabs.storageTable,
      'ajglTabList' : state => state.tabs.ajglTabList,
      'djgfTabList' : state => state.tabs.djgfTabList,
      'gftzTabList' : state => state.tabs.gftzTabList,
    }),
    editableTabs(){
      return  this.storageTable[this.identification]
      // if(this.pageTitle==='官方通知'){
      //   return this.gftzTabList
      // }
      // if(this.pageTitle==='递交官方'){
      //   return this.ajglTabList
      // }
      // if(this.pageTitle==='案件管理'){
      //   return this.ajglTabList
      // }
    },
    LitigationTabs(){
      return  this.ajglTabList
      // if(this.pageTitle==='官方通知'){
      //   return this.gftzTabList
      // }
      // if(this.pageTitle==='递交官方'){
      //   return this.ajglTabList
      // }
      // if(this.pageTitle==='案件管理'){
      //   return this.ajglTabList
      // }
    }
  }
}
</script>

<style lang="scss" scoped>
  @keyframes show{
    to {
      visibility:visible;
      opacity: 1;
      transform: translateY(0)
    }
  }
  .tabs > /deep/ .el-tabs__item{
     visibility:hidden;
     opacity:0;
     transform:translateY(100px);
     transition:all .3s;
     animation: show 0.3s forwards;
 }
  .tabs > /deep/ .el-tabs__header .el-tabs__item {
    background-color: #f5f7fa;
    border-bottom: 1px solid #E4E7ED;
    &.is-active{
      background: #fff;
      border-bottom:0;
    }
  }
</style>
