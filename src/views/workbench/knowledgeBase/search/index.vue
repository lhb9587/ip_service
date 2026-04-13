<template>
  <div class="knowledge">
    <SearchTitle :queryData="queryDataStore"  @updataDataStore="updataDataStore"></SearchTitle>
   <ScreeningCriteria ref="ScreeningCriteria" :queryData="queryDataStore" v-if="pageState==2" @updataDataStore="updataDataStore"></ScreeningCriteria> <TitleTotal v-if="pageState==2" :total="curTotal"/>

    <div class="flexAble" :class="{'marginT40':pageState==1}" style="position: relative" v-if="pageState==1||pageState==2">
      <TitleTotal style="position: absolute;top: -36px" v-if="pageState==1" :total="total"/>
      <firstLevelPage v-if="pageState==1"></firstLevelPage>
      <template v-if="pageState==2">
        <div class="flexAble_left_model">
          <knowlegdeListModel :queryData="queryDataStore"  @updataDataStore="updataDataStore"></knowlegdeListModel>
        </div>
        <div class="flexAble_List">
          <knowledgeList :queryData="queryDataStore" @updataDataStore="updataDataStore"></knowledgeList>
        </div>
      </template>
    </div>
    <knowledgeDetails v-if="pageState==3"></knowledgeDetails>
  </div>
</template>

<script>
import knowledgeDetails from "./components/knowledgeDetails";
import SearchTitle from "./components/SearchTitle";
import ScreeningCriteria from "./components/ScreeningCriteria";
import knowlegdeListModel from "./components/knowlegdeListModel";
import knowledgeList from "./components/knowledgeList";
import firstLevelPage from "./components/firstLevelPage";
import {mapState} from "vuex";
import {queryDocStructure,queryPropertyList,queryDocBystId,queryFilterConfig} from '@/api/knowledgeBase'
export default {
  name: "index",
  components:{
    SearchTitle,ScreeningCriteria,knowlegdeListModel,knowledgeList,firstLevelPage,knowledgeDetails
  },
  props:{
   queryData:{

   }
  },
  data(){
    return {
      count: 0,
      queryDataStore:null
    }
  },
  created() {
    if(this.queryData){
      this.queryDataStore=JSON.parse(JSON.stringify(this.queryData))
    }

    this.queryDocStructure()
  },
  methods:{

    queryDocStructure(){
      let scId=this.$route.query.scId|| (this.queryData&&this.queryData.scId)
      queryDocStructure(Object.assign({tokenID:this.$store.state.knowledgeBase.defaultTokenData.tokenID})).then(res=>{

        res.data.forEach((item,index)=>{
          if(this.$route.query.firtStId&&item.stId==this.$route.query.firtStId){

            this.$store.commit('knowledgeBase/SET_ACTIVENAME',String(index))
          }
          if(item.scList&&item.scList.length){
            if(item.scList.find(i=>i.scId==scId)){
              this.$store.commit('knowledgeBase/SET_ACTIVENAME',String(index))
              item.searchType=Number(scId)
            } else {
              item.searchType=item.scList[0].scId
            }
            // this.$commonUtils.getTwoDimensionalArray(res.data,'scId',this.$route.query.scId,{children:'scList'})

          }

        })
        this.$store.commit('knowledgeBase/SET_DOCSTEUCTURE',res.data)
        queryFilterConfig(Object.assign({tokenID:this.$store.state.knowledgeBase.defaultTokenData.tokenID},{bussId:100,scId:res.data[0].searchType})).then(res=>{
          this.conditionsModuleList=res.data
          this.$commonUtils.saveFilterModel('filterType','filterType',this.conditionsModuleList)
        })
        if(this.pageState==2){
          return
        }
        res.data.forEach(item=>{
          this.queryPropertyList(item.stId)
          if(item.childList&&item.childList.length){
            item.childList.forEach(itm=>{
              if(itm.childList&&itm.childList.length){
                itm.childList.forEach(i=>{
                  // this.queryDocBystId(i.stId)
                })
              }
            })
          }
        })

      })
    },
    queryDocBystId(stId){
      let queryData= JSON.parse(JSON.stringify(Object.assign({tokenID:this.$store.state.knowledgeBase.defaultTokenData.tokenID},{stId})))
      queryDocBystId(queryData).then(res=>{
        this.$store.commit('knowledgeBase/CHANGE_DOCSTEUCTURE',{stId,data:res.data})
        console.log(JSON.parse(JSON.stringify(this.$store.state.knowledgeBase.docStructure)));
        // data.forEach(item=>{
        //   if(item.childList&&item.childList.length){
        //     item.childList.forEach(itm=>{
        //       if(itm.childList&&itm.childList.length){
        //         itm.childList.forEach(i=>{
        //           if(i.stId==stId){
        //             this.$set(i,'detailList',res.data)
        //           }
        //         })
        //       }
        //     })
        //   }
        // item.childList.forEach(itm=>{
        //   itm.childList.forEach(i=>{
        //     if(i.stId==stId){
        //       i.detailList=res.data
        //     }
        //   })
        // })
      })
      // setTimeout(()=>{
      //   this.$store.commit('knowledgeBase/SET_DOCSTEUCTURE',data)
      // },1000)

      // console.log(this.$store.state.knowledgeBase.docStructure);
      // })
    },
    queryPropertyList(stId){
      let data =JSON.parse(JSON.stringify(Object.assign({tokenID:this.$store.state.knowledgeBase.defaultTokenData.tokenID},{stId})))
      queryPropertyList(data).then(res=>{
        this.$store.commit('knowledgeBase/CHANGE_PROPERTYLIST',{stId:`property${stId}`,data:res.data})
      })
    },
    updataDataStore(data){
      console.log(data);
      this.queryDataStore=data
      this.$refs.ScreeningCriteria.getData(data)
      //
    }
  },
  watch:{
    queryDataStore:{
      handler(n){
        console.log(n);

      },
      deep:true
    }
  },
  computed:{
    pageState(){
      if(this.$route.query.tokenID||(this.queryData&&this.queryData.tokenID)){
        return 2
      }else if(this.$route.query.id||(this.queryData&&this.queryData.id)){
        return 3
      }else {
        return 1
      }
    },
    ...mapState({
      total: state => state.knowledgeBase.total,
      curTotal: state => state.knowledgeBase.curTotal,
    })

  }
}
</script>

<style lang="scss" scoped>
  .knowledge{
    display: flex;
    flex-direction:column ;
    /*height: 100%;*/
    height: calc(100vh - 80px)
  }
  .flexAble{
    display: flex;
    flex: 1;
    /*overflow: auto;*/
    box-shadow: 0px 0 10px rgba(0,0,0,.2);
    padding: 0 20px;
    .flexAble_left_model{

      overflow: auto;
    }
    .flexAble_List{
      flex: 1;
      overflow: auto;
      height: 100%;
    }
  }
  .marginT40{
    margin-top: 40px;

  }
</style>

