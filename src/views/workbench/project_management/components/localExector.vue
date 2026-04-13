<template>
  <div>
  <el-tag
    :key="tag"
    v-for="tag in dynamicTags"
    @click="handleClick(tag)"
    :disable-transitions="false"
   >
    <UserIconAndUserName :user-id="tag" ></UserIconAndUserName>
  </el-tag>
  </div>
</template>

<script>
  export default {
    name: "localExector",
    created(){

      this.getNewDynamicTags()
      let that=this
      window.addEventListener("storage", function(e) {
        that.getNewDynamicTags()
      });
      window.addEventListener("setItemEvent", function (e) {
        console.log(666);
        that.getNewDynamicTags()
      });
    },
    data(){
      return{
        dynamicTags:[]
      }
    },
    methods:{
      handleClick(tag){
        this.$emit('getUserId',tag)
      },
      getNewDynamicTags(){
        if(localStorage.getItem('executor')){
          this.dynamicTags=JSON.parse(localStorage.getItem('executor'))
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
.el-tag{
  cursor: pointer;
  margin-right: 10px;
}
</style>
