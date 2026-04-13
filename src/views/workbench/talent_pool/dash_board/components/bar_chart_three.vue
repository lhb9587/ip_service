<template>
  <div class="box">
    <div v-bind:id=id ref="data" style="width:100%;height:580px;"></div>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  name: 'bar_chart_three',
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
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        legend: {
          data: ['入职数', '离职数', '离职率']
        },
        xAxis: [
          {
            type: 'category',
            data: nameArr,
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '离职数',
            min: 0,
            max: 100,
            interval: 4,
            axisLabel: {
              formatter: '{value}'
            }
          },
          {
            type: 'value',
            name: '离职率',
            min: 0,
            max: 100,
            interval: 20,
            axisLabel: {
              formatter: '{value} %'
            }
          }
        ],
        series: [
          {
            name: '入职数',
            stack: 'total',
            barWidth: 30,
            type: 'bar',
            data: data['入职数']
          },
          {
            name: '离职数',
            stack: 'total',
            barWidth: 30,
            type: 'bar',
            data: data['离职数']
          },
          {
            name: '离职率',
            type: 'line',
            yAxisIndex: 1,
            data: data['离职率']
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
