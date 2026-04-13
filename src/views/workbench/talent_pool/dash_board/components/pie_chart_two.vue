<template>
  <div class="box">
    <div v-bind:id=id ref="data" style="width:100%;height:375px;"></div>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  name: 'pie_chart_two',
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
        data = [],//series的数据
      } = {}  //作为一个整体的参数
    ) {
      let chart = echarts.init(document.getElementById(this.id));
      let option = {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          top: '5%',
          left: 'center'
        },
        series: [
          {
            name: '层级分布',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '15'
              }
            },
            labelLine: {
              show: false
            },
            data: data
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
