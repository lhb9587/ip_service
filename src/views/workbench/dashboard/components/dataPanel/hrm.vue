<template>
  <keep-alive>
    <HomePage v-if="activeIndex == '概览'" :check-list="checkList"/>
    <Charts v-else :check-list="checkList"/>
<!--    <div>-->
<!--      <div style="width: 100%;text-align: center;color: #5d6ed5">系统开发中...</div>-->
<!--      <svg-icon class="left-insert" icon-class="系统开发"/>-->
<!--    </div>-->
  </keep-alive>
</template>

<script>
import HomePage from '../HomePage'
import Charts from '../Charts'
export default {
  components: {
    Charts,
    HomePage
  },
  props: ['activeIndex', 'checkList'],
  name: 'DataPanel',
  data() {
    return {
    };
  }
}
</script>

<style lang="scss" scoped>
.left-insert{
  width: 100%;
  height: 50vh;
}
</style>
