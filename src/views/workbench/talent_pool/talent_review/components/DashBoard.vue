<template>
  <div id="chartColumn" style="width: 100%; height: 400px;"></div>
</template>
<script>
// 引入基本模板
import echarts from 'echarts'
export default {
  name: 'DashBoard',
  data() {
    return {
      chartColumn: null
    }
  },
  mounted() {
    this.drawLine();
  },
  methods: {
    drawLine(){
      this.chartColumn = echarts.init(document.getElementById('chartColumn'));

      this.chartColumn.setOption({
        title: { text: 'Column Chart' },
        tooltip: { trigger: "axis", axisPointer: { type: "cross", label: { backgroundColor: "#76baf1" } } },
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          type: 'line'
        }]
      });
    }
  }
}
</script>

<style scoped lang="scss">

</style>
