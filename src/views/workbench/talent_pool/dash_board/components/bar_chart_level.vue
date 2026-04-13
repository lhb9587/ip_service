<template>
  <div class="box">
    <div v-bind:id=id ref="data" style="width:100%;height:375px;"></div>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  name: 'bar_chart_level',
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
        tooltip:{
        },
        grid:{
          x: 120,
        },
        xAxis: {
          type: 'value',
          minInterval: 1
        },
        yAxis: {
          type: 'category',
          data: nameArr
        },
        series: [
          {
            data: data,
            type: 'bar',
            barWidth: 30,
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
