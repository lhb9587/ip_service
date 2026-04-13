<template>
  <div class="box">
    <div v-bind:id=id ref="data" style="width:100%;height:600px;"></div>
  </div>
</template>

<script>
import echarts from 'echarts'
import 'echarts/map/js/china'
export default {
  name: 'map_chart',
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
      areaArr = [],//x轴的数据
      series = [],//series的数据
    } = {}  //作为一个整体的参数
    ) {
      let chart = echarts.init(document.getElementById(this.id));
      let option = {
        //左下角lengend
        dataRange: {
          show: false,
          x: 'left',
          y: 'bottom',
          splitList: [
            { start: 5, end: 5, color: 'orange' },//当值为5时，区域背景
            { start: 10, end: 10, color: '#ff6300' },//当值为10时，区域背景
            { start: 15, end: 15, color: '#ccc' },//当值为15时，区域背景
          ],
          //左下值域文字样式
          textStyle: {
            color: '#ff6300'          // 值域文字颜色
          }
        },
        //鼠标悬浮tip
        tooltip: {
          show: true,
          trigger: 'item',
          "confine": true,//是否一直在画布内
          showContent: false,//是否显示内容区区
          formatter:function(data){
            console.log(data['data'].res)
            var tiptext="";
            data['data'].res.forEach(item =>{
              tiptext += item['city']
              var count = 0
              item['module'].forEach(area =>{
                tiptext += "</br>"+area['name']+": "+area['value']
                count = count + area['value']
              })
              tiptext += "</br>总人数: "+count
              tiptext += '</br>'
            })
            return tiptext;
          },
        },
        //图像样式
        series: [
          {
            name: '市场分布',
            type: 'map',
            mapType: 'china',
            hoverable: false,//禁止hover事件
            roam: false,//是否开启缩放和平移漫游
            itemStyle: {//区域样式
              normal: { label: { show: true } },
              emphasis: { label: { show: false } }
            },
            data: [],
          }
        ],
        animation: false
      };

      option.series[0].data = series;//将拼接好的数组赋给参数集合
      chart.setOption(option, true);//跟新图表

      //鼠标滑过事件
      var testStr = ',' + areaArr.join(",") + ",";
      chart.on('mouseover', function (param) {//点击事件

        if (testStr.indexOf("," + param.name + ",") != -1) {//如果滑到选中省份
          if (option.tooltip.showContent == false) {//如果tip显示为false
            option.tooltip.showContent = true;
            chart.setOption(option, true);
          }
        } else {
          if (option.tooltip.showContent == true) {
            option.tooltip.showContent = false;
            param.value = 15;
            chart.setOption(option, true);
          }
        }
      });

      // //点击事件
      // chart.on('click', function (params) {//点击事件
      //   select_province(params.name);
      // });
      //
      // //初始化省颜色
      // function ini_province() {
      //   var ini_len = option.series[0].data.length;
      //   console.log(ini_len)
      //   for (var i = 0; i < ini_len; i++) {
      //     //初始化颜色
      //     option.series[0].data[i].value = 5;
      //     chart.setOption(option, true);
      //   }
      // }
      //
      // //选中省颜色
      // function select_province(province_name) {
      //   var len = option.series[0].data.length;
      //   for (var i = 0; i < len; i++) {
      //     if (option.series[0].data[i].name == province_name) {//如果匹配正确
      //       //先归零
      //       ini_province();
      //       //改变颜色
      //       option.series[0].data[i].value = 10;
      //       console.log('选择的省份信息：' + option.series[0].data[i].name)
      //       chart.setOption(option, true);
      //     }
      //   }
      // }
    }
  },
}
</script>
<style lang="scss" scoped>
.clear {
  clear: both;
}

body {
  font-family: "微软雅黑";
}

a {
  text-decoration: none;
  color: #333;
}

#charts {
  width: 800px;
  height: 600px;
  margin: 0 auto;
}

.market_map_title {
  font-size: 32px;
  text-align: left;
  padding-left: 50px;
}
</style>
