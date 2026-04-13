<template>
  <div class="box">
    <div v-bind:id=id ref="data" style="width:100%;height:550px;"></div>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  name: 'bar_chart_four',
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
        nameArr = [],//x轴的数据
        data = [],//series的数据
      } = {}  //作为一个整体的参数
    ) {
      let chart = echarts.init(document.getElementById(this.id));
      let option = {
        xAxis: {
          type: 'category',
          data: nameArr
        },
        yAxis: {
          type: 'value'
        },
        tooltip: {
          trigger: 'axis',
          formatter: '{c} 人'
        },
        series: [
          {
            data: data,
            barWidth: 30,
            type: 'bar',
            itemStyle: {
              color: "rgb(82, 160, 245)"
            }
          }
        ]
      };
      chart.setOption(option, true);
      window.addEventListener("resize", function() {
        chart.resize()
      })
    },
  }
}
</script>
