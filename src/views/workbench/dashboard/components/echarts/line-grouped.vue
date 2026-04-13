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
import ECharts from "vue-echarts";
import Bus from "@/utils/Bus";
export default {
  name: 'SlineGrouped',
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
      this.chartData.list.forEach((item, index) => {
        item.datas.map(node => {
          !this.nameArr.includes(node.name) && this.nameArr.push(node.name)
        })
      })
      this.nameArr && this.chartData.list.forEach((item, index) => {
        var eachTypeData = []
        this.nameArr.forEach(name => {
          eachTypeData.push(item.datas.find(node => node.name == name) ? item.datas.find(node => node.name == name).value : 0)
        })
        this.data.push({
          name: item.legend,
          type: 'line',
          data: eachTypeData
        })
      })
      this.optionInit()
    },
    optionInit() {
      this.option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
            shadowStyle: {
              shadowOffsetY: '2000'
            }
          }
        },
        legend: {
          type: 'scroll',
          bottom: 'bottom',
          data: this.data
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
                "bar",
                "stack"
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
        xAxis: [
          {
            type: 'category',
            axisTick: {
              show: false
            },
            data: this.nameArr,
            axisLabel: {
              interval: this.dialog ? 0 : 0,
              rotate: this.dialog ? 60 : 30
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        grid: {
          top: 30,
          containLabel: true
        },
        series: this.data
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
    handleClick(params){
      console.log('echart-click',params.name, params.seriesName)
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

