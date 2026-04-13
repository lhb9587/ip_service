<template>


    <router-view/>


<!--    <div class="knowledge">-->
<!--      <SearchTitle></SearchTitle>-->
<!--      <ScreeningCriteria v-if="pageState==2"></ScreeningCriteria>-->
<!--      <div class="flexAble" :class="{'marginT40':pageState==1}" v-if="pageState==1||pageState==2">-->
<!--        <firstLevelPage v-if="pageState==1"></firstLevelPage>-->
<!--        <template v-if="pageState==2">-->
<!--          <div class="flexAble_left_model">-->
<!--            <knowlegdeListModel></knowlegdeListModel>-->
<!--          </div>-->
<!--          <div class="flexAble_List">-->
<!--            <knowledgeList></knowledgeList>-->
<!--          </div>-->
<!--        </template>-->
<!--      </div>-->
<!--      <knowledgeDetails v-if="pageState==3"></knowledgeDetails>-->
<!--    </div>-->
</template>

<script>
  // import knowledgeDetails from "./search/components/knowledgeDetails";
  // import SearchTitle from "./search/components/SearchTitle";
  // import ScreeningCriteria from "./search/components/ScreeningCriteria";
  // import knowlegdeListModel from "./search/components/knowlegdeListModel";
  // import knowledgeList from "./search/components/knowledgeList";
  // import firstLevelPage from "./search/components/firstLevelPage";
  // import {queryDocStructure,queryPropertyList,queryDocBystId} from '@/api/knowledgeBase'
  export default {
    name: "index",
    components:{
      // SearchTitle,ScreeningCriteria,knowlegdeListModel,knowledgeList,firstLevelPage,knowledgeDetails
    },
    data(){
      return {

      }
    },
    created() {
      // this.queryDocStructure()
    },
    methods:{
  //     queryDocStructure(){
  //       queryDocStructure(Object.assign(this.$store.state.knowledgeBase.defaultTokenData)).then(res=>{
  //         res.data.forEach(item=>{
  //           if(item.scList&&item.scList.length){
  //             item.searchType=item.scList[0].scId
  //           }
  //
  //         })
  //         this.$store.commit('knowledgeBase/SET_DOCSTEUCTURE',res.data)
  //
  //         res.data.forEach(item=>{
  //           this.queryPropertyList(item.stId)
  //           if(item.childList&&item.childList.length){
  //             item.childList.forEach(itm=>{
  //               if(itm.childList&&itm.childList.length){
  //                 itm.childList.forEach(i=>{
  //                    this.queryDocBystId(i.stId)
  //                 })
  //               }
  //             })
  //           }
  //         })
  //
  //       })
  //     },
  //     queryDocBystId(stId){
  //      let queryData= JSON.parse(JSON.stringify(Object.assign(this.$store.state.knowledgeBase.defaultTokenData,{stId})))
  //        queryDocBystId(queryData).then(res=>{
  //          this.$store.commit('knowledgeBase/CHANGE_DOCSTEUCTURE',{stId,data:res.data})
  //          console.log(JSON.parse(JSON.stringify(this.$store.state.knowledgeBase.docStructure)));
  //          // data.forEach(item=>{
  //          //   if(item.childList&&item.childList.length){
  //          //     item.childList.forEach(itm=>{
  //          //       if(itm.childList&&itm.childList.length){
  //          //         itm.childList.forEach(i=>{
  //          //           if(i.stId==stId){
  //          //             this.$set(i,'detailList',res.data)
  //          //           }
  //          //         })
  //          //       }
  //          //     })
  //          //   }
  //            // item.childList.forEach(itm=>{
  //            //   itm.childList.forEach(i=>{
  //            //     if(i.stId==stId){
  //            //       i.detailList=res.data
  //            //     }
  //            //   })
  //            // })
  //          })
  //          // setTimeout(()=>{
  //          //   this.$store.commit('knowledgeBase/SET_DOCSTEUCTURE',data)
  //          // },1000)
  //
  //          // console.log(this.$store.state.knowledgeBase.docStructure);
  //        // })
  //     },
  //     queryPropertyList(stId){
  //       let data =JSON.parse(JSON.stringify(Object.assign(this.$store.state.knowledgeBase.defaultTokenData,{stId})))
  //       queryPropertyList(data).then(res=>{
  //         this.$store.commit('knowledgeBase/CHANGE_PROPERTYLIST',{stId:`property${stId}`,data:res.data})
  //       })
  //     }
    },
    watch:{
    },
    computed:{
      // pageState(){
      //   if(this.$route.query.tokenID){
      //     return 2
      //   }else if(this.$route.query.id){
      //     return 3
      //   }else {
      //     return 1
      //   }
      // }
    }
  }
</script>

<style lang="scss" scoped>
  /*.knowledge{*/
  /*  display: flex;*/
  /*  flex-direction:column ;*/
  /*  !*height: 100%;*!*/
  /*  height: calc(100vh - 80px)*/
  /*}*/
  /*.flexAble{*/
  /*  display: flex;*/
  /*  flex: 1;*/
  /*  !*overflow: auto;*!*/
  /*  box-shadow: 0px 0 10px rgba(0,0,0,.2);*/
  /*  padding: 0 20px;*/
  /*  .flexAble_left_model{*/
  /*    width:285px ;*/
  /*  }*/
  /*  .flexAble_List{*/
  /*    flex: 1;*/
  /*    overflow: auto;*/
  /*    height: 100%;*/
  /*  }*/
  /*}*/
  /*.marginT40{*/
  /*  margin-top: 40px;*/
  /*}*/
</style>
