<template>
  <div class="flexAble">
    <managementMenu></managementMenu>
    <TabList class="TabList"></TabList>
  </div>
</template>

<script>
  import managementMenu from "./components/managementMenu.vue";
  import TabList from "./components/TabList.vue"
  export default {
    name: "index",
    methods:{
    },
    components:{
      managementMenu,
      TabList
    }
  }
</script>

<style lang="scss" scoped>
.flexAble{
  display: flex;
  .TabList{
    flex: 1;
  }
}
</style>
