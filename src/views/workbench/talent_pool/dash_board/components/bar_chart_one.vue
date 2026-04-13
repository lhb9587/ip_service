<template>
  <div class="box">
    <div v-bind:id=id ref="data" style="width:100%;height:630px;"></div>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  name: 'bar_chart_one',
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
      nameArr = [],
      areaArr = [],
      series = [],//series的数据
    } = {}  //作为一个整体的参数
    ) {
      let barBox = echarts.init(document.getElementById(this.id));
      let option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: (param, ticket, callback) => {
            var str = ''
            for (const item of param) {
              item.seriesName && (str += item.marker + ' ' + item.seriesName + '：' + item.value + '<br>')
            }
            return str
          }
        },
        legend: {
          data: areaArr,
          right: '20px'
        },
        grid: {
          left: '1%',
          right: '1%',
          bottom: '3%',
          width: '100%',
          containLabel: true
        },
        xAxis: {
          data: nameArr,
          axisLabel: {
            interval: 0,//横轴信息全部显示
          }
        },
        yAxis: {
          type: 'value'

        },
        series: series
      };
      //柱状图的相关结构已经定义好了调用setoption
      function getSum (params) {
        var datavalue = 0
        for (var i = 0; i < series.length; i++) {
          datavalue += series[i].data[params.dataIndex]
        }
        return datavalue
      }
      if (series[series.length - 1]) {
        series[series.length - 1].label.formatter = getSum
      }
      barBox.clear()
      barBox.off('legendselectchanged'); // 调用前先解绑，防止触发多次
      barBox.setOption(option);
      barBox.on('legendselectchanged', (obj) => {
        function getSum (params) {
          var datavalue = 0
          for (var i = 0; i < series.length; i++) {
            if (obj.selected[series[i].name]) {
              datavalue += series[i].data[params.dataIndex]
            }
          }
          return datavalue
        }
        if (series[series.length - 1]) {
          series[series.length - 1].label.formatter = getSum
        }
        barBox.setOption(option);
      });
      barBox.on('click', this.barBoxClick); // 模块点击处理
      window.addEventListener("resize", function() {
        barBox.resize()
      })
    },
    barBoxClick(param) {
      if (param['name'] == '专利和专利诉讼') {
        this.$parent.moduleClick(param['name'])
      }
    }
  }
}
</script>
