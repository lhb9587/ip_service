<template>
  <div >
    <header>权限管理</header>
    <div class="changeBlock">
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
