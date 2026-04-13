<template>
  <keep-alive>
    <HomePage v-if="activeIndex == '概览'" :check-list="checkList"/>
    <Charts v-else :check-list="checkList"/>
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

</style>
