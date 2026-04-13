<template>
  <div class="box">
    <div v-bind:id=id ref="data" style="width:100%;height:375px;"></div>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  name: 'funnel_chart',
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
          trigger: 'item',
          formatter: '{a} <br/>{b}'
        },
        series: [
          {
            name: '层级分布',
            type: 'funnel',
            left: '0%',
            top: 30,
            bottom: 70,
            width: '100%',
            orient: 'vertical',
            min: 0,
            max: 100,
            minSize: '0%',
            maxSize: '100%',
            sort: 'ascending',
            gap: 2,
            label: {
              show: true,
              position: 'inside',
              fontSize: 10
            },
            labelLine: {
              length: 10,
              lineStyle: {
                width: 1,
                type: 'solid'
              }
            },
            itemStyle: {
              borderColor: '#fff',
              borderWidth: 1
            },
            emphasis: {
              label: {
                fontSize: 12
              }
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
