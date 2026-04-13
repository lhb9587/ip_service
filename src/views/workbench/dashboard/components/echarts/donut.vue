<template>
  <div>
    <v-chart :autoresize="true" ref="dount" theme="ovilia-green" @click="handleClick" :options="option" />
    <!--全屏显示的容器-->
    <el-dialog append-to-body :visible.sync="dialog" fullscreen :show-close="false">
      <el-button size="mini" @click="dialog = false">关闭全屏</el-button>
      <v-chart v-show="dialog" :autoresize="true" ref="dount" theme="ovilia-green" :options="option" />
    </el-dialog>
  </div>
</template>

<script>
import ECharts from "vue-echarts";
import "echarts/lib/chart/pie";
import Bus from "@/utils/Bus";
// import "echarts/lib/chart/map";
// import "echarts/lib/chart/radar";
// import "echarts/lib/chart/scatter";
// import "echarts/lib/chart/effectScatter";

export default {
  name: 'Sdonut',
  props: ['chartData', 'chartSelectName'],
  components: { "v-chart": ECharts },
  data() {
    return {
      dialog: false,
      nameArr: [],
      data: [],
      name: this.chartSelectName, // 图表高亮值
      option: [],
      popstate: false
    };
  },
  created() {
    this.chartData.list && this.chartInit(0)
  },
  mounted() {
    if (window.history && window.history.pushState) {
      this.popstate = true
    }
  },
  methods: {
    // 图表初始化
    chartInit() {
      var that = this
      var chartData = this.chartData.list[0].datas
      this.nameArr = []
      this.data = []
      chartData.sort((a, b) => {
        return b.value - a.value
      })
      chartData.forEach(item => {
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
            radius: ['40%', '70%'],
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
        Bus.$emit('chartBase64', {...this.chartData, base64: this.$refs.dount.getDataURL({
            type: 'jpg',
            backgroundColor: '#fff'
          })})
      }, 1000)
      var drillName = this.name ? this.name : (this.data[0] ? this.data[0].name : '')
      drillName && this.$emit('saveDrillPanels', drillName, 1)
      this.$nextTick(() => {
        this.chartHighlight(drillName)
      })
    },
    // 格式化千分位方法
    formatAmount(strNum) {
      return (strNum+ '').replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g,'$1,');
    },
    handleClick(params){
      this.chartHighlight(params.name)
      this.$emit('drillPanels', params.name)
    },
    chartHighlight(name) {
      const dount = this.$refs.dount;
      dount.dispatchAction({
        type: 'downplay',
        seriesIndex: 0,
        name: this.name
      });
      dount.dispatchAction({
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
      this.chartData.list && this.chartInit(1)
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
.el-dialog .el-button{
  margin-bottom: 10px;
}
</style>

