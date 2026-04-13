<template>
  <div >
    <header>权限管理</header>
    <div class="changeBlock">
      <el-button type="primary"  plain @click="jumpPerModular" v-allow="108" >模块操作权设置</el-button>
      <el-button type="primary" plain @click="jumpPerUser" v-allow="109">按用户设置权限</el-button>
    </div>
    <router-view>
    </router-view>
  </div>
</template>

<script>
export default {
  name: "permission_management",
  data() {
    return {}
  },
  created(){
  },
  methods:{
    jumpPerModular(){
      this.$router.replace('/workbench/system_management/permission_management/permission_Modular')
    },
    jumpPerUser(){
      this.$router.replace('/workbench/system_management/permission_management/permission_user')
    }
  }
}
</script>

<style lang="scss" scoped>
  header{
    height:36px;
    font-size:18px;
    font-family:SourceHanSansCN-Normal;
    font-weight:400;
    color:rgba(38,42,47,1);
    line-height: 36px;
    margin-bottom: 10px;

  }
.changeBlock{
  margin-bottom: 10px;
}
</style>
