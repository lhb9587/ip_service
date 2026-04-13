<template>
    <div class="case_management">
      <!--<header>{{$route.meta.title}}</header>-->
<!--      <Tabs v-model="activeName" @tab-click="handleClick">-->
<!--        <el-tab-pane label="商标案件" name="1">-->
<!--&lt;!&ndash;          <transition name="show" mode="out-in">&ndash;&gt;-->
<!--            &lt;!&ndash;<case-type v-if="activeName==='first'"></case-type>&ndash;&gt;-->
<!--            &lt;!&ndash;<filterTable v-if="activeName==='first'"></filterTable>&ndash;&gt;-->
<!--            <div  v-if="activeName==='1'">-->
<!--          -->
<!--&lt;!&ndash;          </transition>&ndash;&gt;-->
<!--        </el-tab-pane>-->
<!--        <el-tab-pane label="专利案件" name="2">专利案件-->
<!--        </el-tab-pane>-->
<!--&lt;!&ndash;        <el-tab-pane label="保护案件" name="3">&ndash;&gt;-->
<!--&lt;!&ndash;          <div v-if="activeName==='3'">&ndash;&gt;-->
<!--&lt;!&ndash;            <protectList&ndash;&gt;-->
<!--&lt;!&ndash;              :getCaseList="getCaseList"&ndash;&gt;-->
<!--&lt;!&ndash;              @getCaseRow="protectgetCaseRow"&ndash;&gt;-->
<!--&lt;!&ndash;              :business="23"&ndash;&gt;-->
<!--&lt;!&ndash;              :buss-id="23"&ndash;&gt;-->
<!--&lt;!&ndash;              :pageTitle="pageTitle"&ndash;&gt;-->
<!--&lt;!&ndash;              @getCaseQueryInfo="ligetCaseQueryInfo"&ndash;&gt;-->
<!--&lt;!&ndash;              :dialogVisible="refesh"&ndash;&gt;-->
<!--&lt;!&ndash;              field="protect"&ndash;&gt;-->
<!--&lt;!&ndash;              @closeModel="closeModel"/>&ndash;&gt;-->
<!--&lt;!&ndash;          </div>&ndash;&gt;-->
<!--&lt;!&ndash;        </el-tab-pane>&ndash;&gt;-->
<!--        <el-tab-pane label="诉讼案件" name="4">-->
<!--&lt;!&ndash;          <transition name="show" mode="out-in">&ndash;&gt;-->
<!--            <div v-if="activeName==='4'">-->
<!--              <litigationCase-->

<!--                :getCaseList="getCaseList"-->
<!--                :business="11"-->
<!--                :buss-id="11"-->
<!--                @getCaseRow="ligetCaseRow"-->
<!--                :pageTitle="pageTitle"-->
<!--                @getCaseQueryInfo="ligetCaseQueryInfo"-->
<!--                :dialogVisible="refesh"-->
<!--                field="litigation"-->
<!--                @closeModel="closeModel"/>-->
<!--            </div>-->
<!--&lt;!&ndash;          </transition>&ndash;&gt;-->
<!--        </el-tab-pane>-->
<!--        <el-tab-pane label="全部案件" name="5" v-if="$store.getters.permissions.includes(248)">-->
<!--          &lt;!&ndash;          <transition name="show" mode="out-in">&ndash;&gt;-->
<!--          <div v-if="activeName==='5'">-->
<!--            <case_search-->
<!--            ></case_search>-->
<!--          </div>-->
<!--          &lt;!&ndash;          </transition>&ndash;&gt;-->
<!--        </el-tab-pane>-->
<!--      </Tabs>-->

      <filterTable
        :getCaseList="getCaseList"
        @getCaseRow="getCaseRow"
        @getCaseQueryInfo="getCaseQueryInfo"
        :dialogVisible="refesh"
        @closeModel="closeModel"
        taskType="1"
        :bussId="bussId"
      />
     <detail-official-communication :taskType="1" v-if="dialogVisible" @closeThisPage="closeThisPage" :dialogVisible="dialogVisible" :queryInfo="queryInfo"></detail-official-communication>
    </div>
</template>

<script>
import filterTable from '../components/filterTable'
import filterTable1 from '../components/filterTable1'
import litigationCase from './components/litigationCase.vue'
import protectList from './components/protectList.vue'
import { queryCaseList } from '@/api/caseList.js'
import DetailOfficialCommunication from '@/views/workbench/case/officialCommunication/detailOfficialCommunication';
import case_search from '../case_search'
export default {
  name: "case_management",
  data(){
    return {
      bussId: '',
      activeName: localStorage.getItem('field')? localStorage.getItem('field'):'1',
      refesh: true,
      dialogVisible:false,
      queryInfo:{},
    }
  },
  created(){
    this.bussId = this.$route.meta.bussId
    if (this.$route.query.name) {
      this.activeName = this.$route.query.name;
    }
  },
  watch:{
    dialogVisible:{
      handler(){
        this.$commonUtils.dragZindex(this)
      },
      immediate: true
    }
  },
  methods: {
    handleClick(){

    },
    closeModel(){
      this.dialogVisible = false
    },
    getCaseList(data) {
      return queryCaseList(data)
    },
    getCaseRow(row) {
      if(row.pageId===100){
        this.$router.push('/workbench/case/case_detail/'+row.caseId+'/'+row.caseType+`?pageId=100&caseTypeId=${row.caseTypeId}`)
      }else {
        this.$router.push('/workbench/case/case_detail/'+row.caseId+'/'+row.caseType+`?caseTypeId=${row.caseTypeId}`)
      }
    },
    getCaseQueryInfo(queryInfo) {
      this.queryInfo = queryInfo
      this.dialogVisible = true
    },
    ligetCaseRow(row){
      if(row.pageId===100){
        this.$router.push('/workbench/case/case_detail/'+row.caseId+'/'+row.caseType+'?pageId=100&taskType=2&agentNum='+row.agentNum)
      }else {
        this.$router.push('/workbench/case/case_detail/'+row.caseId+'/'+row.caseType+'?taskType=2&agentNum='+row.agentNum)
      }
    },
    protectgetCaseRow(row){
      if(row.pageId===100){
        this.$router.push('/workbench/case/case_detail/'+row.caseId+'/'+'保护'+'?pageId=100&taskType=3')
      }else {
        this.$router.push('/workbench/case/case_detail/'+row.caseId+'/'+'保护'+'?taskType=3')
      }
    },
    ligetCaseQueryInfo(queryInfo) {
      this.queryInfo = queryInfo
      this.dialogVisible = true
    },
    closeThisPage(data) {
      this.dialogVisible = false
      if(!data){
        this.refesh=true
      } else {
        this.refesh=false
      }
    },
  },
  components:{
    filterTable,DetailOfficialCommunication,litigationCase,filterTable1,case_search,protectList
  },
}
</script>

<style scoped>
  header{
    height: 62px;
    line-height:62px;
    font-size:22px;
    font-family:SourceHanSansCN-Normal;
    font-weight:400;
    color:rgba(51,51,51,1);
    padding-left: 20px;
    border-bottom:1px solid #D4D5D5 ;
  }
  .case_management{
    position: relative;
   /*min-height: calc(100vh - 50px);*/
    /*&>div{*/
       /*position: absolute;*/
    /*}*/
  }
  .el-tabs{
    margin: 0 20px;
  }
  @keyframes show {
    0% {

      opacity: 0;
      transform: translateX(100%);

    }
    100% {
      transform: translateX(0);
      opacity: 1;

    }
  }
  @keyframes hide {
    0% {
      opacity: 1;
      transform: translateX(0);
    }
    100% {

      opacity: 0;
      transform: translateX(100%);
    }
  }
  .show-enter-active {
    animation: show 1.2s;
  }
  .show-leave-active {
    animation: hide 1.2s;
  }
  .show-enter, .show-leave-to {
    opacity: 0;
  }
 /deep/ .el-tabs__content{
    overflow: visible;
  }
</style>
