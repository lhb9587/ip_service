<template>
  <img class="avatar" :src="src" alt="">
</template>

<script>
import { searchTmUrl } from "@/api/customerList";
export default {
  props:{
    regNumber:{}
  },
  data(){
    return {
      src:''
    }
  },
  name: "getRegNumImg",
  methods:{
    searchTmUrl(regNumber,type){
      searchTmUrl({regNumber}).then(res=>{
          if(res.data&&res.data.length){
            this.src='tmFile'+ res.data[0].imgFilePath
          }
        })
    }
  },
  created() {
    this.searchTmUrl(this.regNumber)
  }
}
</script>

<style lang="scss" scoped>
  .avatar {
    width: 70px;
    height: 70px;
    display: block;
    cursor: pointer;
  }
</style>
