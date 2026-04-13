<template>
  <div style="padding:0 20px">
      <Tabs v-model="activeName" @tab-click="">
        <el-tab-pane label="商标案件" name="1">
          <transition name="show" mode="out-in">
            <div  v-if="activeName=='1'">
                <filter-table bussId="6" :getCaseList="getCaseList" @getCaseRow="getCaseRow" :pageTitle="pageTitle"   @getCaseQueryInfo="getCaseQueryInfo" :dialogVisible="refesh" @getViewRow="getViewRow"/>
                <DetailOfficial :taskType='1' :business="2" v-if="dialogVisible" @closeThisPage="closeThisPage" :dialogVisible="dialogVisible" :queryInfo="queryInfo"></DetailOfficial>
            </div>
          </transition>
        </el-tab-pane>
<!--        <el-tab-pane label="专利案件" name="2">专利案件-->
<!--        </el-tab-pane>-->

        <el-tab-pane label="诉讼案件" name="2">
          <transition name="show" mode="out-in">
            <div  v-if="activeName=='2'">
              <civilSuit
                :getCaseList="getCaseList"
                :business1="11"
                :buss-id1="12"
                :pageTitle="pageTitle"
                :dialogVisible="refesh"
                :taskType1='2'
               />
             </div>
          </transition>
        </el-tab-pane>
        <el-tab-pane label="保护案件" name="3">
          <div  v-if="activeName=='3'">
            <civilSuit
              :getCaseList="getCaseList"
              :business1="23"
              :buss-id1="25"

              :pageTitle="pageTitle"

              :dialogVisible="refesh"
              :taskType1="3"
            />
          </div>
        </el-tab-pane>
        <el-tab-pane label="域名案件" name="4">
          <div  v-if="activeName=='4'">
            <civilSuit
              :getCaseList="getCaseList"
              :business1="5"
              :buss-id1="33"

              :pageTitle="pageTitle"

              :dialogVisible="refesh"
              :taskType1="5"
            />
          </div>
        </el-tab-pane>
        <el-tab-pane label="著作权案件" name="5">
          <div  v-if="activeName=='5'">
            <civilSuit
              :getCaseList="getCaseList"
              :business1="4"
              :buss-id1="31"

              :pageTitle="pageTitle"

              :dialogVisible="refesh"
              :taskType1="6"
            />
          </div>
        </el-tab-pane>
        <el-tab-pane label="非诉案件" name="6">
          <div  v-if="activeName=='6'">
            <civilSuit
              :getCaseList="getCaseList"
              :business1="6"
              :buss-id1="32"

              :pageTitle="pageTitle"

              :dialogVisible="refesh"
              :taskType1="7"
            />
          </div>
        </el-tab-pane>

        <el-tab-pane label="专利案件" name="7">
          <div  v-if="activeName=='7'">
            <civilSuit
              :getCaseList="getCaseList"
              :business1="41"
              :buss-id1="41"

              :pageTitle="pageTitle"

              :dialogVisible="refesh"
              :taskType1="4"
            />
          </div>
        </el-tab-pane>

      </Tabs>
  </div>
</template>

<script>
import litigationCase from '@/views/workbench/case/case_management/components/litigationCase.vue'
import civilSuit from '@/views/workbench/case/case_management/components/civilSuit.vue'
import { getOfficialInformList, getCaseByTmFileId } from '@/api/caseList.js'
import DetailOfficial from '@/views/workbench/case/officialCommunication/detailOfficialCommunication';
import filterTable from '@/views/workbench/case/components/filterTable'
export default {
  name: "detailOfficialCommunication",
  data(){
    return {
      activeName:localStorage.getItem('field')? localStorage.getItem('field'):'1',
      dialogVisible:false,
      refesh: true,
      queryInfo:{},
      pageTitle: this.$route.meta.title
    }
  },
  created() {
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
        this.activeName = '7'
      }else if (this.$route.query.name) {
        this.activeName = this.$route.query.name;
      }
    },
    getCaseList(data) {
      return getOfficialInformList(this.$commonUtils.emptyParameterProcessing(data))
    },
    getCaseRow(row) {
      // row.insId=row.tmFileId
      // getCaseByTmFileId({ tmFileId: row.tmFileId }).then(res=>{
      //   this.queryInfo={
      //     caseIds: row.caseId,
      //     pageId: 106,
      //     pageType:'3',
      //     materialId: row.materialId,
      //     mailingTypeId: row.mailingTypeId,
      //     insId: row.tmFileId,
      //     info: res.data
      //   }
      //   this.dialogVisible = true
      // })
      this.queryInfo={
          caseIds: row.caseId,
          pageId: 106,
          pageType:'3',
          materialId: row.materialId,
          mailingTypeId: row.mailingTypeId,
          insId: row.tmFileId,
          info: row.caseArray
        }
        this.dialogVisible = true

    },
    getViewRow(row){
      // row.insId=row.tmFileId
      // getCaseByTmFileId({tmFileId:row.tmFileId}).then(res=>{
      //   this.queryInfo={
      //     caseIds: row.caseId,
      //     pageId: 106,
      //     pageType: '4',
      //     materialId: row.materialId,
      //     mailingTypeId: row.mailingTypeId,
      //     insId: row.tmFileId,
      //     info: res.data
      //   }
      //   this.dialogVisible = true
      // })
      this.queryInfo={
          caseIds: row.caseId,
          pageId: 106,
          pageType: '4',
          materialId: row.materialId,
          mailingTypeId: row.mailingTypeId,
          insId: row.tmFileId,
          info: row.caseArray
        }
        this.dialogVisible = true
    },
    getCaseQueryInfo(queryInfo){
      this.queryInfo = queryInfo
      this.dialogVisible = true
    },
    closeThisPage(data){
      this.dialogVisible=false
      this.refesh=true
      this.$nextTick(()=>{
        if(data){
          this.refesh=false
        }else {
          this.refesh=true
        }
      })
      // console.log();
      // if(!data){
      //
      //
      // } else {
      //   this.refesh=false
      // }
    }
  },
  components:{
    filterTable,DetailOfficial,litigationCase,civilSuit
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
    /*min-height: calc(100vh - 50px);*/
    /*&>div{*/
    /*position: absolute;*/
    /*}*/
  }
</style>
<!--<template>-->
<!--  <div class="case_management">-->
<!--    &lt;!&ndash;    <header>{{$route.meta.title}}</header>&ndash;&gt;-->
<!--    <el-tabs v-model="activeName" @tab-click="handleClick">-->
<!--      <el-tab-pane label="商标案件" name="1">-->
<!--        <transition name="show" mode="out-in">-->
<!--          <tmOfficial></tmOfficial>-->
<!--        </transition>-->
<!--      </el-tab-pane>-->
<!--    </el-tabs>-->
<!--  </div>-->
<!--</template>-->

<!--<script>-->
<!--import tmOfficial from "./components/tmOfficial";-->
<!--export default {-->
<!--  name: "toDoTasksChildren",-->
<!--  data() {-->
<!--    return {-->
<!--      activeName: "1"-->
<!--    };-->
<!--  },-->
<!--  created() {-->
<!--    if (this.$route.query.name) {-->
<!--      this.activeName = this.$route.query.name;-->
<!--    }-->
<!--  },-->
<!--  methods: {-->
<!--    handleClick() {}-->
<!--  },-->
<!--  components: {-->
<!--    tmOfficial-->
<!--  }-->
<!--};-->
<!--</script>-->

<!--<style lang="scss" scoped>-->
<!--  .case_management {-->
<!--    position: relative;-->
<!--  }-->
<!--  @keyframes show {-->
<!--    0% {-->
<!--      opacity: 0;-->
<!--      transform: translateX(100%);-->
<!--    }-->
<!--    100% {-->
<!--      transform: translateX(0);-->
<!--      opacity: 1;-->
<!--    }-->
<!--  }-->
<!--  @keyframes hide {-->
<!--    0% {-->
<!--      opacity: 1;-->
<!--      transform: translateX(0);-->
<!--    }-->
<!--    100% {-->
<!--      opacity: 0;-->
<!--      transform: translateX(100%);-->
<!--    }-->
<!--  }-->
<!--  .show-enter-active {-->
<!--    animation: show 1.2s;-->
<!--  }-->
<!--  .show-leave-active {-->
<!--    animation: hide 1.2s;-->
<!--  }-->
<!--  .show-enter,-->
<!--  .show-leave-to {-->
<!--    opacity: 0;-->
<!--  }-->
<!--  header {-->
<!--    height: 62px;-->
<!--    line-height: 62px;-->
<!--    font-size: 22px;-->
<!--    font-family: SourceHanSansCN-Normal;-->
<!--    font-weight: 400;-->
<!--    color: rgba(51, 51, 51, 1);-->
<!--    padding-left: 20px;-->
<!--    border-bottom: 1px solid #d4d5d5;-->
<!--  }-->
<!--  .el-tabs {-->
<!--    margin: 0 20px;-->
<!--  }-->
<!--</style>-->
