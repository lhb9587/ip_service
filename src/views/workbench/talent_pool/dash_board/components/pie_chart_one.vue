<template>
  <div class="box">
    <div v-bind:id=id ref="data" style="width:100%;height:375px;"></div>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  name: 'pie_chart_one',
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
        name = [],//x轴的数据
        data = [],//series的数据
      } = {}  //作为一个整体的参数
    ) {
      let chart = echarts.init(document.getElementById(this.id));
      let option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c}人 ({d}%)'
        },
        series : [
          {
            name: name,
            type: 'pie',
            radius : '50%',
            data: data,
            label:{
              normal:{
                show: true,
                formatter: '{b} {d}%'
              }
            },
            labelLine:{
              normal:{
                show: true
              }
            },
            itemStyle: {
              normal: {
                color: function(params) {
                  //自定义颜色
                  var colorList = [
                    '#ffcccc', '#409EFF', '#FE8463', '#45b97c', '#9b95c9'
                  ];
                  return colorList[params.dataIndex]
                }
              }
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
