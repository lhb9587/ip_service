<template>

  <el-tabs v-model="activeName" type="card">
    <el-tab-pane :label="item.label" :name="item.name" v-for="item in pageList">
      <div class="trademark_wrap">
        <Trademark :item="itm" v-for="itm in item.data"></Trademark>
      </div>

<!--      <img :src="`tmFile${item.data.imgFilePath}`" alt="">-->
<!--      {{item.data}}-->
    </el-tab-pane>
  </el-tabs>
</template>

<script>
  import Trademark from "./Trademark";
  import { searchTmUrl } from "@/api/customerList";
  export default {
    props:{
      regNumber:{},
      quoteRegNumber:{}
    },
    components:{
      Trademark
    },
    name: "TrademarkInvolved",
    created() {
      let index=0
      if(this.regNumber){
        index+=1
        this.pageList.push({label:'争议商标',name:String(index),data:[]})
        this.searchTmUrl(this.regNumber,'regNumber')
      }
      if(this.quoteRegNumber){
        index+=1
        this.pageList.push({label:'引证商标',name:String(index),data:[]})
        Promise.all(this.quoteRegNumber.map(regNumber=> searchTmUrl({regNumber}))).then(res=>{
          res.forEach(item=>{
            if(item.data&&item.data.length){
              this.pageList.find(item=>item.label=='引证商标').data.push(item.data[0])
            }
          })
        })

      }
    },
    data(){
      return {
        activeName:'1',
        pageList:[]
      }
    },
    methods:{
      searchTmUrl(regNumber,type){
        searchTmUrl({regNumber}).then(res=>{
          if(res.data&&res.data.length){
            if(type=='regNumber'){
              this.pageList.find(item=>item.label=='争议商标').data.push(res.data[0])
              // this.pageList[0].data=res.data[0]
            }
            if(type=='quoteRegNumber'){
              this.pageList.find(item=>item.label=='引证商标').data.push(res.data[0])
            }
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
.trademark_wrap{
  max-height: 500px;
  overflow: auto;
}
</style>
