<template>
  <div class="box">
    <div v-bind:id=id ref="data" style="width:60%;height:550px;"></div>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  name: 'bar_chart_two',
  props: ["id", "data"],
  data() {
    return {}
  },
  watch: {
    data: {
      handler(value) {
        this.drawChart(value)
      },
      deep: true
    }
  },
  mounted() {
    this.drawChart(this.data)
  },
  methods: {
    drawChart({
        areaArr = [],//x轴的数据
        series = [],//series的数据
      } = {}  //作为一个整体的参数
    ) {
      let chart = echarts.init(document.getElementById(this.id));
      let option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {},
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          minInterval: 1
        },
        yAxis: {
          type: 'category',
          data: areaArr,
          inverse: true
        },
        series: series
      };
      chart.setOption(option);
      window.addEventListener("resize", function() {
        chart.resize()
      })
    }
  }
}
</script>
