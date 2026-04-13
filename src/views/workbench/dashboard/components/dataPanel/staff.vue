<template>
  <keep-alive>
    <StaffList v-if="activeIndex == '概览'"/>
  </keep-alive>
</template>

<script>
import StaffList from '../hrm/StaffList'
export default {
  components: {
    StaffList
  },
  props: ['activeIndex', 'checkList'],
  name: 'staff',
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
