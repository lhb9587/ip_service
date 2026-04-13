<template>
  <div style="padding:0 20px">
    <!--<header>{{$route.meta.title}}</header>-->
    <Tabs v-model="activeName" >
      <el-tab-pane label="商标案件" name="1">
        <transition name="show" mode="out-in">
          <div  v-if="activeName=='1'">
          <filter-table
            :getCaseList="getCaseList"
            @getCaseRow="getCaseRow"
            :pageTitle="pageTitle"
            @getCaseQueryInfo="getCaseQueryInfo"
            :dialogVisible="refesh"
            bussId="7"
            @getViewRow="getViewRow"/>
            <el-dialog
              title="递交官方"
              append-to-body
              :visible.sync="detailSubmissionState"
              width="60%"
              height="100vh"
              :modal="false"
              top="0"
              class="pdfDialog dragDialog"
              :close-on-click-modal="false"
              v-dialogDrag
            >
              <detailSubmission :query="detailSubmissionData" @cancel="closeThisPage"></detailSubmission>
            </el-dialog>
          <detail-official-communication :taskType="1" v-if="dialogVisible" @closeThisPage="closeThisPage" :dialogVisible="dialogVisible" :queryInfo="queryInfo" >
          </detail-official-communication>
          </div>
        </transition>
      </el-tab-pane>
<!--      <el-tab-pane label="专利案件" name="2">专利案件-->
<!--      </el-tab-pane>-->
<!--      <el-tab-pane label="保护案件" name="3">-->
<!--        <div  v-if="activeName=='3'">-->
<!--        <protectList-->
<!--          :getCaseList="getCaseList"-->
<!--          :business="23"-->
<!--          :buss-id="25"-->

<!--          :pageTitle="pageTitle"-->

<!--          :dialogVisible="refesh"-->
<!--          field="litigation"-->
<!--        />-->
<!--        </div>-->
<!--      </el-tab-pane>-->
      <el-tab-pane label="诉讼案件" name="4">
        <transition name="show" mode="out-in">
          <!--<case-type v-if="activeName==='first'"></case-type>-->
          <!--<filterTable v-if="activeName==='first'"></filterTable>-->
          <div  v-if="activeName=='4'">
            <civilSuit
              v-if="activeName=='4'"
              :getCaseList="getCaseList"
              :business1="11"
              :buss-id1="13"
              @getCaseRow="ligetCaseRow"
              :pageTitle="pageTitle"
              :dialogVisible="refesh"
               :taskType1="2"
              />

            <!--              <detail-official-communication v-if="dialogVisible" @closeThisPage="closeThisPage" :dialogVisible="dialogVisible" :queryInfo="queryInfo"></detail-official-communication>-->
          </div>
        </transition>
      </el-tab-pane>
      <el-tab-pane label="专利案件" name="5">
        <transition name="show" mode="out-in">
          <!--<case-type v-if="activeName==='first'"></case-type>-->
          <!--<filterTable v-if="activeName==='first'"></filterTable>-->
          <div  v-if="activeName=='5'">
            <civilSuit
              v-if="activeName=='5'"
              :getCaseList="getCaseList"
              :business1="40"
              :buss-id1="40"
              @getCaseRow="ligetCaseRow"
              :pageTitle="pageTitle"

              :dialogVisible="refesh"
              :taskType1="4"
              />

            <!--              <detail-official-communication v-if="dialogVisible" @closeThisPage="closeThisPage" :dialogVisible="dialogVisible" :queryInfo="queryInfo"></detail-official-communication>-->
          </div>
        </transition>
      </el-tab-pane>
    </Tabs>
  </div>
</template>

<script>
import filterTable from '../components/filterTable'
import { getSubmitOfficialList } from '@/api/caseList.js'
import DetailOfficialCommunication from '@/views/workbench/case/officialCommunication/detailOfficialCommunication';
import litigationCase from '@/views/workbench/case/case_management/components/litigationCase.vue'
import detailSubmission from '@/views/workbench/case/officialSubmission/components/detailSubmission.vue'
import civilSuit from '@/views/workbench/case/case_management/components/civilSuit'
export default {
  name: "officialSubmission",
  data(){
    return {
      activeName:localStorage.getItem('field')? localStorage.getItem('field'):'1',
      dialogVisible:false,
      refesh:true,
      queryInfo:{},
      pageTitle: this.$route.meta.title,
      data:{},
      detailSubmissionState:false,
      detailSubmissionData:{}
    }
  },
  created(){
    this.changeActiveNameByRoles(this.$store.getters.roles)
  },
  watch:{
    activeName:{
      handler(){
        this.$commonUtils.dragZindex(this)
      },
      immediate: true
    },
    dialogVisible:{
      handler(){
        this.$commonUtils.dragZindex(this)
      },
      immediate: true
    }
  },
  methods: {
    changeActiveNameByRoles(roles){
      if(roles.find(i=>i.name.includes("专利"))){
        this.activeName = '5'
      }else if (this.$route.query.name) {
        this.activeName = this.$route.query.name;
      }
    },
    getCaseList(data) {
      return getSubmitOfficialList(data)
    },
    getCaseRow(row) {
      if(!row.caseId||!row.insId){
        this.$message.error('该案件存在错误')
        return
      }
      this.detailSubmissionData={ caseIds: row.caseId, pageId: row.pageId ,pageType: '3',pageId:104,insId:row.insId}
      this.detailSubmissionState=true

      // this.$router.push({ path: '/workbench/case/detailSubmission', query: { caseIds: row.caseId, pageId: row.pageId ,pageType: '3',pageId:104,insId:row.insId}})
      // this.queryInfo = {
      //   caseIds: row.caseId,
      //   pageId: 106,
      //   pageType: '3',
      //   materialId: row.materialId,
      //   mailingTypeId: row.mailingTypeId,
      //   info: [row]
      // }
      // this.dialogVisible = true
    },
    getViewRow(row){
      if(!row.caseId||!row.insId){
        this.$message.error('该案件存在错误')
        return
      }
      this.detailSubmissionData={  caseIds: row.caseId, pageId: row.pageId ,pageType: '5',pageId:104,insId:row.insId}
      this.detailSubmissionState=true
      // this.$router.push({ path: '/workbench/case/detailSubmission', query: { caseIds: row.caseId, pageId: row.pageId ,pageType: '5',pageId:104,insId:row.insId}})
    },
    getCaseQueryInfo(queryInfo) {
      this.queryInfo = queryInfo
      this.dialogVisible = true
    },
    ligetCaseRow(){

    },
    closeThisPage(data) {
      this.detailSubmissionState=false
      this.dialogVisible = false
      this.refesh=true
      this.$nextTick(()=>{
        if(!data){
          this.refesh=true
        } else {
          this.refesh=false
        }
      })
    },
  },
  components:{
    filterTable,DetailOfficialCommunication, litigationCase,detailSubmission,civilSuit
  },
}
</script>

<style lang="scss" scoped>
  header{
    height: 62px;
    line-height:62px;
    font-size:22px;
    font-family:SourceHanSansCN-Normal;
    font-weight:400;
    color:rgba(51,51,51,1);
    padding-left: 20px;
   // border-bottom:1px solid #D4D5D5 ;
  }
  .case_management{
    position: relative;
  //  min-height: calc(100vh - 50px);
    /*&>div{*/
    /*position: absolute;*/
    /*}*/
  }
  .pdfDialog {
    >>>.el-dialog__body {
      padding-top: 0;
    }
  }
</style>
