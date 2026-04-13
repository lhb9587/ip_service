<template>
  <div>
    <div class="tabbar">{{title}}</div>
  </div>
</template>

<script>
  export default {
    name: "TabbarH5",
    props: ['title']
  }
</script>

<style lang="scss" scoped>
.tabbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 45px;
    background-color: #52A0F5;
    color: #fff;
    text-align: center;
    font-size: 16px;
    line-height: 45px;
    font-weight: bold;
  }
</style>
