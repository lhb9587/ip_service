<template>
  <div style="display: flex;align-items: center" v-if="userData">
    <Avatar :username="userData.fullname"  :size="24" :src="`ipdoc${userData.userIcon}`"></Avatar>
    <span class="username">{{userData.fullname}}</span>
  </div>

</template>

<script>
import Avatar from '@/layout/components/VueAvatar.vue'
export default {
  props:{
    userId:{},
    userItem:{},
    list:{}
  },
  name: "index",
  data(){
    return {
      userData:{
        fullname:'',
        userIcon:''
      }
    }
  },
  components:{
    Avatar
  },
  created() {
    let userData
    if(!this.list){
      userData=this.$store.getters.allUserList.find(item=>item.userId==this.userId)
    }else {
      userData=this.list.find(item=>item.userId==this.userId)
    }

    if(userData){
      this.userData=userData
    }else {
      this.userData=this.userItem
      // this.userData=this.userData.userIcon='http://www.gravatar.com/avatar/227dda8fadad6eb6f1ea65b459818837?d=mm&s=24'
    }
  },
  watch:{
    userId(n,o){
      let userData
      if(!this.list){
        userData=this.$store.getters.allUserList.find(item=>item.userId==this.userId)
      }else {
        userData=this.list.find(item=>item.userId==this.userId)
      }

      if(userData){
        this.userData=userData
      }else {
        this.userData=this.userItem
        // this.userData=this.userData.userIcon='http://www.gravatar.com/avatar/227dda8fadad6eb6f1ea65b459818837?d=mm&s=24'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.username{
  margin-left: 5px;
}
</style>
