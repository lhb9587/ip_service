<template>
  <div style="width: 100%;">
    <ChartInit :chart-list="checkList" :isExport="isExport"/>
  </div>
</template>

<script>
import ChartInit from './echarts/ChartInit'
export default {
  components: {
    ChartInit
  },
  props: ['checkList', 'isExport'],
  name: 'Charts',
  data() {
    return {
    };
  }
}
</script>

<style lang="scss" scoped>

</style>
