<template>
  <div>
    <el-button v-if="otherChart" size="mini" icon="el-icon-back" @click="clickBack" round>返回上级</el-button>
    <v-chart v-if="option" :autoresize="true" ref="pie" theme="ovilia-green" @click="handleClick" :options="option" />
    <!--全屏显示的容器-->
    <el-dialog :visible.sync="dialog" append-to-body fullscreen :show-close="false">
      <el-button size="mini" @click="dialog = false">关闭全屏</el-button>
      <el-button v-if="otherChart" size="mini" icon="el-icon-back" @click="clickBack" round>返回上级</el-button>
      <v-chart ref="pie" v-show="dialog" :autoresize="true" theme="ovilia-green" @click="handleEnlargeClick" :options="option" />
    </el-dialog>
  </div>
</template>

<script>
import ECharts from "vue-echarts";
import "echarts/lib/chart/pie";
import Bus from "@/utils/Bus";
export default {
  name: 'Spie',
  props: ['chartData', 'chartSelectName'],
  components: { "v-chart": ECharts },
  data() {
    return {
      dialog: false,
      nameArr: [],
      data: [],
      mainData: [], // 主要数据
      splitData: [], // 拆分数据
      name: this.chartSelectName, // 图表高亮值,
      otherName: '合并数据', // 合并数据名称
      otherChart: false,
      option: [],
      popstate: false
    };
  },
  created() {
    this.chartData.list[0] && this.chartInit()
    console.log('图表数量',this.chartData.list[0].datas.length)
  },
  mounted() {
    if (window.history && window.history.pushState) {
      this.popstate = true
    }
  },
  methods: {
    // 图表初始化
    chartInit() {
      var chartData = this.chartData.list[0].datas
      var otherAmounts = 0
      this.nameArr = []
      this.data = []
      this.mainData = []
      this.splitData = []
      chartData.sort((a, b) => {
        return b.value - a.value
      })
      if (chartData.length > 12) {
        for (let i = 0; i < chartData.length; i++) {
          if (i < 11) {
            this.mainData.push(chartData[i])
          }else{
            otherAmounts = otherAmounts + chartData[i].value
            this.splitData.push(chartData[i])
          }
        }
        otherAmounts && this.mainData.push({ name: this.otherName, value: otherAmounts })
      } else {
        this.mainData = JSON.parse(JSON.stringify(chartData))
      }
      this.dataInit(this.mainData)
    },
    // 数据初始化
    dataInit(data) {
      var that = this
      this.nameArr = []
      this.data = []
      data.forEach(item => {
        this.nameArr.push(item.name)
        this.data.push({
          property: 'docTypeString',
          name: item.name,
          queryProperty: null,
          value: parseInt(item.value),
          label: {
            show: true,
            formatter: function(data) {
              return data.name + ' : ' + that.formatAmount(data.value) + ' - ' + data.percent + '%';
            },
          }
        })
      })
      this.option = {
        grid: {
          containLabel: true
        },
        tooltip: {
          trigger: 'item',
          formatter: function(data) {
            return data.name + ' : ' + that.formatAmount(data.value) + ' (' + data.percent + '%)';
          },
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
        legend: {
          orient: 'vertical',
          top: 'top',
          type: 'scroll',
          left: 'left',
          data: this.nameArr
        },
        series: [
          {
            name: this.chartData.name,
            type: 'pie',
            radius: '55%',
            center: [
              '50%',
              '60%'
            ],
            data: this.data,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      setTimeout(() => {
        Bus.$emit('chartBase64', {...this.chartData, base64: this.$refs.pie.getDataURL({
            type: 'jpg',
            backgroundColor: '#fff'
          })})
      }, 1000)
      var drillName = this.name ? this.name : (this.data[0] ? this.data[0].name : '')
      drillName && this.$emit('saveDrillPanels', drillName, 1) // 存储默认搜索条件
      this.$nextTick(() => {
        this.chartHighlight(drillName) // 默认高亮显示
      })
    },
    // 点击回退
    clickBack() {
      this.otherChart = false
      this.dataInit(this.mainData)
    },
    // 格式化千分位方法
    formatAmount(strNum) {
      return (strNum+ '').replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g,'$1,');
    },
    handleEnlargeClick(params) {
      this.chartHighlight(params.name)
      if (params.name == this.otherName) {
        this.dataInit(this.splitData)
        this.otherChart = true
      }
    },
    handleClick(params) {
      this.chartHighlight(params.name)
      if (params.name == this.otherName) {
        this.dataInit(this.splitData)
        this.otherChart = true
      }else{
        this.$emit('drillPanels', params.name)
      }
      this.$emit('drillData', params)
    },
    chartHighlight(name) {
      const pie = this.$refs.pie;
      pie.dispatchAction({
        type: 'downplay',
        seriesIndex: 0,
        name: this.name
      });
      pie.dispatchAction({
        type: 'highlight',
        seriesIndex: 0,
        name: name
      });
      this.name = name
    },
    goBack() {
      // 在这里写自己的业务逻辑
      this.dialog = false;
    }
  },
  watch: {
    chartData() {
      this.chartInit()
    },
    dialog() {
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
</style>

