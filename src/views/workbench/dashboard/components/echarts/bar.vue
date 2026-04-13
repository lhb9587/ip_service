<template>
  <div>
    <v-chart ref="chart" v-show="option" :autoresize="true" theme="ovilia-green" @click="handleClick" :options="option" />
    <!--全屏显示的容器-->
    <el-dialog append-to-body :visible.sync="dialog" fullscreen :show-close="false">
      <el-button size="mini" @click="dialog = false">关闭全屏</el-button>
      <v-chart ref="chart" v-show="option" :autoresize="true" theme="ovilia-green" :options="option" />
    </el-dialog>
  </div>
</template>

<script>
import Bus from '@/utils/Bus'
import ECharts from "vue-echarts";
import html2canvas from 'html2canvas';
export default {
  name: 'Sbar',
  props: ['chartData', 'chartSelectName'],
  components: { "v-chart": ECharts },
  data() {
    return {
      dialog: false,
      title: '',
      nameArr: [],
      data: [],
      option: [],
      popstate: false
    };
  },
  created() {
    this.chartData.list && this.chartInit()
  },
  mounted() {
    if (window.history && window.history.pushState) {
      this.popstate = true
    }
  },
  methods: {
    // 图表初始化
    chartInit() {
      this.nameArr = []
      this.data = []
      this.chartData.list[0].datas.forEach(item => {
        this.nameArr.push(item.name)
        this.data.push(parseInt(item.value))
      })
      this.optionInit()
    },
    optionInit() {
      var that = this
      this.option = {
        grid: {
          left: 80,
          bottom: this.dialog?150:60
        },
        legend: {
          type: 'scroll',
          bottom: "bottom",
          data: [{
            data: this.data,
            name: this.chartData.name,
            type: "bar",
            label: {
              show: true,
              formatter: "{c}",
              rich: {
                textShadowOffsetY: 111,
                c: {
                  "fontSize": 12
                }
              }
            }
          }]
        },
        toolbox: {
          show: true,
          orient: 'vertical',
          left: 'right',
          top: 'center',
          feature: {
            mark: {
              show: true
            },
            magicType: {
              show: true,
              emphasis: {
                iconStyle: {
                  textPosition: "left"
                }
              },
              type: [
                "line",
                "bar"
              ]
            },
            saveAsImage: {
              show: true,
              emphasis: {
                iconStyle: {
                  textPosition: 'left'
                }
              },
              title: '保存为图片',
              type: 'jpg',
              backgroundColor: '#fff',
              connectedBackgroundColor: '#fff'
            }
          }
        },
        xAxis: {
          type: 'category',
          data: this.nameArr,
          axisLabel: {
            interval: 0,
            rotate: 60 // 标题斜向展示
          }
        },
        yAxis: {
          type: 'value'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
            shadowStyle: {
              shadowOffsetY: '2000'
            }
          }
        },
        series: [
          {
            data: this.data,
            label: {
              normal:{
                formatter: function(data) {
                  return that.formatAmount(data.value);
                },
                rich:{
                  c:{
                    fontSize:12
                  },
                  textShadowOffsetY: 111
                },
                show: true,
                position: 'top'
              }
            },
            type: 'bar'
          }
        ]
      }
      setTimeout(() => {
        Bus.$emit('chartBase64', {...this.chartData, base64: this.$refs.chart.getDataURL({
            type: 'jpg',
            backgroundColor: '#fff'
          })})
      }, 1000)
      var drillName = this.chartSelectName ? this.chartSelectName : (this.nameArr[0] ? this.nameArr[0] : '')
      drillName && this.$emit('saveDrillPanels', drillName, 1)
    },
    // 格式化千分位方法
    formatAmount(strNum) {
      return (strNum+ '').replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g,'$1,');
    },
    handleClick(params){
      console.log('echart-click',params.name)
      this.$emit('drillPanels', params.name)
      this.$emit('drillData', params)
    },
    goBack() {
      // 在这里写自己的业务逻辑
      this.dialog = false;
    }
  },
  watch: {
    chartData() {
      this.chartData.list && this.chartInit()
    },
    dialog() {
      this.optionInit()
      if (this.popstate){
        if (this.dialog){
          history.pushState(null, null, document.URL);
          window.addEventListener('popstate', this.goBack, false);
        }else {
          window.removeEventListener('popstate', this.goBack, false);
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.echarts{
  width: 99%;
  height: 250px;
}
.el-dialog .echarts{
  height: 80vh;
}
.el-dialog .el-button{
  margin-bottom: 10px;
}
</style>

