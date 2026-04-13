<template>
  <div>
    <v-chart v-show="option" ref="line" :autoresize="true" theme="ovilia-green" @click="handleClick" :options="option" />
    <!--全屏显示的容器-->
    <el-dialog append-to-body :visible.sync="dialog" fullscreen :show-close="false">
      <el-button size="mini" @click="dialog = false">关闭全屏</el-button>
      <v-chart v-show="dialog" ref="line" :autoresize="true" theme="ovilia-green" :options="option" />
    </el-dialog>
  </div>
</template>

<script>
import ECharts from "vue-echarts";
import Bus from "@/utils/Bus";
export default {
  name: 'Sline',
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
    // console.log('111',this.chartData.list)
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
      var that = this
      this.nameArr = []
      this.data = []
      this.chartData.list[0].datas.forEach(item => {
        this.nameArr.push(item.name)
        this.data.push(parseInt(item.value))
      })
      // console.log('222',this.data)
      this.option = {
        grid: {
          left: 100
        },
        legend: {
          type: 'scroll',
          bottom: "bottom"
        },
        xAxis: {
          type: 'category',
          data: this.nameArr,
          axisLabel: {
            interval: 0,
            rotate: 30
          }
        },
        yAxis: {
          type: 'value'
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
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        series: [
          {
            data: this.data,
            label:{
              formatter: function(data) {
                return that.formatAmount(data.value);
              },
              rich:{
                c:{
                  fontSize:12
                },
                textShadowOffsetY: 111
              },
              show: true
            },
            type: 'line'
          }
        ]
      }
      setTimeout(() => {
        Bus.$emit('chartBase64', {...this.chartData, base64: this.$refs.line.getDataURL({
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
      // 折线图高亮显示
      const line = this.$refs.line;
      line.dispatchAction({
        type: "highlight",
        seriesIndex: 0,
        name: params.name
      });
      console.log('echart-click',params.name)
      this.$emit('drillPanels', params.name)
    },
    goBack() {
      // 在这里写自己的业务逻辑
      this.dialog = false;
    }
  },
  watch: {
    chartData() {
      console.log(this.chartData.list)
      this.chartData.list && this.chartInit()
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

