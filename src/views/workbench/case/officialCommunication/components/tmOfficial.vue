<template>
  <div style="padding:0 20px">
    <!--<header>{{$route.meta.title}}</header>-->
    <filter-table bussId="6" :getCaseList="getCaseList" @getCaseRow="getCaseRow" :pageTitle="pageTitle"   @getCaseQueryInfo="getCaseQueryInfo" :dialogVisible="refesh" @getViewRow="getViewRow"/>
    <DetailOfficial v-if="dialogVisible" @closeThisPage="closeThisPage" :dialogVisible="dialogVisible" :queryInfo="queryInfo"></DetailOfficial>
  </div>
</template>

<script>
  import { getOfficialInformList,getCaseByTmFileId } from '@/api/caseList.js'
  import DetailOfficial from '@/views/workbench/case/officialCommunication/detailOfficialCommunication';
  import filterTable from '@/views/workbench/case/components/filterTable'
  export default {
    name: "detailOfficialCommunication",
    data(){
      return {
        dialogVisible:false,
        refesh: false,
        queryInfo:{},
        pageTitle: this.$route.meta.title
      }
    },
    created(){

    },
    methods:{
      getCaseList(){
        return getOfficialInformList
      },
      getCaseRow(row) {
        row.insId=row.tmFileId
        getCaseByTmFileId({ tmFileId: row.tmFileId }).then(res=>{
          this.queryInfo={
            caseIds: row.caseId,
            pageId: 106,
            pageType: '3',
            materialId: row.materialId,
            mailingTypeId: row.mailingTypeId,
            insId: row.tmFileId,
            info: res.data
          }
          this.dialogVisible = true
          console.log(this.dialogVisible );
        })

      },
      getViewRow(row){
        row.insId=row.tmFileId
        getCaseByTmFileId({tmFileId:row.tmFileId}).then(res=>{
            this.queryInfo={
              caseIds: row.caseId,
              pageId: 106,
              pageType: '4',
              materialId: row.materialId,
              mailingTypeId: row.mailingTypeId,
              insId: row.tmFileId,
              info: res.data
            }
          this.dialogVisible = true
        })
      },
      getCaseQueryInfo(queryInfo){
        this.queryInfo = queryInfo
        this.dialogVisible = true
      },
      closeThisPage(data){
        this.dialogVisible=false
        if(!data){
          this.refesh=true
        } else {
          this.refesh=false
        }
      }
    },
    components:{
      filterTable,DetailOfficial
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
