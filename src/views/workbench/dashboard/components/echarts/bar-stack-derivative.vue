<template>
    <div>
      <v-chart ref="chart" :autoresize="true" theme="ovilia-green" :options="option" />
    </div>
  </template>
  
  <script>
  import ECharts from "vue-echarts";
  import Bus from "@/utils/Bus";
  import { formatAmount } from "@/utils/filters";
  export default {
    name: 'DbarGrouped',
    props: ['chartData', 'chartSelectName','nameArr','data','seriesData'],
    components: { "v-chart": ECharts },
    data() {
      return { 
        dialog: false,
        popstate: false,
        showCount:true,
        currentType:'bar',
        isStack:true,
        option:[]
      };
    },
    created() {
        console.log(this.chartData,'chartData');
        
      this.chartData.list && this.chartInit()
    },
    mounted() {
      if (window.history && window.history.pushState) {
        this.popstate = true
      }
    },
    computed:{
      totalMap(){
        return this.calculateTotalByYear(this.chartData.list)
      }
    },
    methods: {
      // IPSERVICE-6294, 目前只针对收支余图表进行处理
      formatAmount,
      formatAmountValue(value) {
        if (value == null || value === '') return '';
  
        const absValue = Math.abs(value);
        const sign = value < 0 ? '-' : '';
        // 如果金额大于等于 1 千万，保留两位小数并附加 '亿'
        if (absValue >= 100000000) {
          return sign + (Math.trunc(absValue / 1000000) / 100) + '亿+';
        }
        // 如果金额在 1 万到 1 千万之间，不保留小数并附加 '万'
        if (absValue >= 100000) {
          return sign + Math.trunc(absValue / 10000) + '万+';
        }
        // 显示原始值
        return sign + absValue;
      },
      handleMagicTypeChanged(params) {
        if (params.currentType == 'stack') {
          this.isStack = !this.isStack;
        }else{
          this.currentType = params.currentType;
        }
        this.chartInit()
      },
      // 图表初始化
      chartInit() {
        this.nameArr = []
        this.data = []
        this.seriesData = []
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
            type: 'bar',
            data: eachTypeData,
          })
          this.seriesData.push({
            label: {
              show: this.showCount,
              position: 'top',
              rotate: 30,
              offset: [20, -15],
              z:10,
              formatter: (params) => {
                const result = this.formatAmount(params.value)
                return result
              }
            },
            stack:'sum',
            name: item.legend,
            type: this.currentType,
            data: eachTypeData.map(value => ({
              value,
              formatted: this.formatAmountValue(value)
            }))
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
            },
            formatter: function (params) {  
              let res = '';  
              let sum = 0;  
              params.forEach(item => {  
                  sum += item.value; // 累加每个数据点的值  
                  res += `<span style="display:inline-block;margin-right:5px;border-radius:50%;width:10px;height:10px;background-color:${item.color};"></span>${item.seriesName}: ${item.value}<br/>`;  
              });  
              res += `<span>合计: ${Number.isInteger(sum)?sum:sum.toFixed(2)}</span>`; // 添加汇总项  
              return res;  
            } 
          },
          legend: {
            type: 'scroll',
            bottom: 'bottom',
            data: this.data
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
            top: 70,
            containLabel: true
          },
          series: this.seriesData.map((series,index) => ({
              ...series,
              label:{
                show: this.showCount,
                position: 'top',
                rotate: 30,
                offset: [20, -15],
                z:10,
                formatter: (params) => {
                  if (this.isStack) {
                    if (this.seriesData.length -1 == index) {
                      const total = this.totalMap[params.name]
                      return  this.formatAmount(total)
                    }else {
                      return ''
                    }
                  }else{
                    return  this.formatAmount(params.value)
                  }
                }
              }
            }))
            ,
        } 
        setTimeout(() => {
          Bus.$emit('chartBase64', {...this.chartData, base64: this.$refs.chart.getDataURL({
              type: 'jpg',
              backgroundColor: '#fff'
            })})
            const myChart = this.$refs.chart.chart
          if (myChart) {
            myChart.on('magicTypeChanged', this.handleMagicTypeChanged)
          }
        }, 1000)
        var drillName = this.chartSelectName ? this.chartSelectName : (this.nameArr[0] ? this.nameArr[0] : '')
        drillName && this.$emit('saveDrillPanels', drillName, 1)
   
      },
      goBack() {
        // 在这里写自己的业务逻辑
        this.dialog = false;
      },
      calculateTotalByYear(dataArray) {
        let totalValues = {};
    
        dataArray.forEach(item => {
          if (item.datas&&item.datas.length>0) {
            item.datas.forEach(dataPoint => {  
                if (!totalValues[dataPoint.name]) {  
                    totalValues[dataPoint.name] = 0;  
                }  
                totalValues[dataPoint.name] += Number(dataPoint.value);  
            });  
          }
        });  
        return totalValues;
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
    height: 260px;
  }
  </style>
  
  