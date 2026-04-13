<template>
  <div>
    <div v-if="checkList" class="item-container" >
      <template v-for="(item, index) of checkList">
        <el-card v-if="item.visible > 0" shadow="always" :id="'chart_'+item.panelId" :style="{'width': (item.charts.length > 1) ?'100%':'49%'}" class="item-card">
          <template v-for="(obj,key) in item.charts">
            <el-card :key="obj.panelId" :class="item.charts.length > 2 ? 'items' : 'item'" style="position:relative;">
              <GraphRecursion :echart-type="obj.panelType" :custId="obj.custId" :index-key="key" :has-item="obj.hasItem" :echart-index="index" :panel-id="obj.panelId" :echart-name="obj.panelName" :dimension-item="obj.dimensionItem" :chart-length="item.charts.length" :table-height="250" @drillPanels="drillPanels" @searchDrillPanels="searchDrillPanels" @resetDrillPanels="resetDrillPanels" @closeChart="closeChart"></GraphRecursion>
              <div v-if="isExport" @click="() => $set(obj, 'export', !obj.export)" style="cursor:pointer;width: 100%;height: 100%;background-color: #EBEBEB;opacity: .5;position: absolute;top: 0;bottom: 0;left: 0;right: 0;z-index: 99">
              </div>
              <div v-if="!!obj.export && isExport" style="width: 100%;position: absolute;bottom: 0;left: 0;right: 0;z-index: 100;justify-content: center;display: flex">
                <span class="el-icon-success" style="font-size: 20px;color: #67C23A"></span>
              </div>
            </el-card>
          </template>
        </el-card>
      </template>
    </div>
    <svg-icon v-show="checkList.filter(item=> item.visible) < 1" class="left-insert" icon-class="左侧添加内容"/>
  </div>
</template>
<script>
import Bus from '../../../../../utils/Bus'
import ECharts from "vue-echarts";
// import "echarts/lib/chart/bar";
// import "echarts/lib/chart/line";
// import "echarts/lib/chart/pie";
// import "echarts/lib/chart/map";
// import "echarts/lib/chart/radar";
// import "echarts/lib/chart/scatter";
// import "echarts/lib/chart/effectScatter";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/polar";
import "echarts/lib/component/geo";
import "echarts/lib/component/legend";
import "echarts/lib/component/title";
import "echarts/lib/component/visualMap";
import "echarts/lib/component/dataset";
import "echarts/map/js/world";
import "zrender/lib/svg/svg";
import "echarts-gl";
import theme from "../../../platformData/companyDashboard/components/shine.json";
ECharts.registerTheme("ovilia-green", theme);
import GraphRecursion from './GraphRecursion'
import TaskQueue from  '../TaskQueue.js'
import {exportChartPDF, exportChartPPt, exportNewChartPPt} from "@/api/dashboard";
export default {
  props: ['chartList', 'isExport'],
  name: 'ChartInit',
  components: {
    GraphRecursion
  },
  data() {
    return {
      checkList: [], // 图表渲染列表
      checkEventList: [], // 图表渲染等待列表
      eventList: [], // 图表下钻等待列表
      chartBase64List: [],
    };
  },
  created() {
    this.initList()
    Bus.$on('list_resolve',(panelId) => {
      if(this.checkEventList.filter(item=> item.panelId).find(item => item.panelId == panelId)){
        this.checkEventList.find(item => item.panelId == panelId).event()
        this.checkEventList.find(item => item.panelId == panelId).panelId = ''
      }
    })
    Bus.$on('resolve',(panelId) => {
      if(this.eventList.filter(item=> item.panelId).find(item => item.panelId == panelId)){
        this.eventList.find(item => item.panelId == panelId).event()
        this.eventList.find(item => item.panelId == panelId).panelId = ''
      }
    })
    Bus.$on('chartBase64', (chart) => {
      this.chartBase64List.push(chart)
    })
    Bus.$on('export', (cb, type) => {
      const list = []
      this.checkList.forEach(item => {
        if (item.charts && item.charts.length) {
          item.charts.forEach(obj => {
            obj.export && list.push(obj)
          })
        }
      })
      if (!list.length) {
        this.$message.warning('请选择要导出的图表！')
        return
      }
      const itemTextList = []
      const multipartFiles = []
      list.forEach(item => {
        this.chartBase64List.forEach(it => {
          if (item.panelId == it.panelId) {
            itemTextList.push(it.name)
            multipartFiles.push(this.base64ToFile(it.base64))
          }
        })
      })
      if (!itemTextList.length) {
        this.$message.warning('导出图表有误！')
        return
      }
      const formData = new FormData()
      for (const item of multipartFiles){
        formData.append("multipartFiles", item);
      }
      for (const item of itemTextList){
        formData.append("itemTextList", item);
      }
      formData.append("tokenID", this.$store.getters.token);
      if (type === 'pdf') {
        exportChartPDF(formData).then(res => {
          const downData = {
            url: res.data,
          }
          this.$commonUtils.downLoadAll(downData)
          this.$message.success(res.message)
          cb()
        })
      } else if (type === 'ppt') {
        const chartDatasPanelIdList = []
        list.forEach(it => {
          chartDatasPanelIdList.push({
            panel: {panelId: it.panelId},
            chartsParam: JSON.parse(localStorage.getItem('queryModuleData'))
              ? JSON.parse(localStorage.getItem('queryModuleData')).find(item => item.name == 'GraphRecursion')
                ? JSON.parse(localStorage.getItem('queryModuleData')).find(item => item.name == 'GraphRecursion').chartArr.find(item => item.panelId == it.panelId)
                  ? JSON.parse(localStorage.getItem('queryModuleData')).find(item => item.name == 'GraphRecursion').chartArr.find(item => item.panelId == it.panelId).queryModuleData
                  : {}
                : {}
              : {},
          })
        })
        exportNewChartPPt({
          chartDatasPanelIdList
        }).then(res => {
          const downData = {
            url: res.data,
          }
          this.$commonUtils.downLoadAll(downData)
          this.$message.success(res.message)
          cb()
        })
      }
    })
  },
  beforeDestroy() {
    Bus.$off('list_resolve')
    Bus.$off('resolve')
    Bus.$off('export')
    Bus.$off('chartBase64')
  },
  methods: {
    base64ToFile(base64) {
      const byteString = atob(base64.split(',')[1]);
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      return new File([new Blob([ab], { type: 'image/png' })], 'chart.png', { type: 'image/png' });
    },
    initList(){
      const taskQueue = new TaskQueue(4);
      this.checkList = []
      this.checkEventList = []
      for (let i = 0; i < this.chartList.length; i++) {
        const task = this.createTask(i);
        taskQueue.addTask(task);
      }
    },
    createTask(i) {
      return () => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            this.checkList.push(this.chartList[i])
            if (this.chartList[i].visible) {
              this.checkEventList.push({panelId: this.chartList[i].panelId, event: resolve })
            }else{
              reject();
            }
          }, 1);
        });
      };
    },
    // 下钻图表点击，增加更新
    drillPanels(index, chart) {
      if (!this.checkList[index].charts.find(item => item.panelId === chart.panelId)) {
        this.checkList[index].charts.length == 1 && this.goEchart(this.checkList[index].panelId)
        this.checkList[index].charts.push(chart)
      }else{
        this.handleDrillPanels(index, chart)
      }
    },
    // 搜索项改变，重新更新图表
    searchDrillPanels(index,chart) {
      this.handleDrillPanels(index, chart)
    },
    // 下钻图表处理，已存在，删除追加，更新图表所用
    async handleDrillPanels(index,chart) {
      const chartIndex = this.checkList[index].charts.findIndex(item => item.panelId === chart.panelId) // 获取图表位置
      if (chartIndex != -1) {
        var charts = this.checkList[index].charts.slice(chartIndex) // 获取点击图表下级所有图表数据
        this.checkList[index].charts.splice(chartIndex, 3) // 删除掉点击图表下级
        for (let i = 0; i < charts.length; i++) {
          await new Promise(resolve => {
            setTimeout(() => {
              this.checkList[index].charts.push(charts[i])
              this.eventList.push({panelId: charts[i].panelId, event: resolve })
            },1)
          })
        }
      }
    },
    // 重置图表，计算当前下级图图表位置，进行下级和后续图表删除
    resetDrillPanels(index, chart) {
      const chartIndex = this.checkList[index].charts.findIndex(item => item.panelId === chart.panelId)
      if (chartIndex != -1) {
        this.checkList[index].charts.splice(chartIndex,3)
      }
    },
    // 删除图表
    closeChart(index, panelId) {
      const chartIndex = this.checkList[index].charts.findIndex(item => item.panelId === panelId) // 获取图表位置
      if (chartIndex != -1) {
        this.checkList[index].charts.splice(chartIndex,3) // 删除掉点击图表及下级
        chartIndex == 1 && this.goEchart(this.checkList[index].panelId) //未生效
      }
    },
    // 点击跳转对应位置图表
    goEchart(panelId) {
      setTimeout(() => {
        this.$el.querySelector('#chart_' + panelId).scrollIntoView(false);
      },200)
    }
  },
  watch: {
    isExport(v) {
      if (!v) {
        this.checkList.forEach(item => {
          if (item.charts && item.charts.length) {
            item.charts.forEach(obj => {
              this.$set(obj, 'export', false)
            })
          }
        })
      }
    },
    chartList() {
      this.initList()
    }
  }
}
</script>

<style lang="scss" scoped>
.item-container {
  display: flex;
  flex-wrap: wrap;
  //width: calc( 100vw - 240px );
}
.item-card {
  margin-right: 1%;
  margin-bottom: 1%;
}
.item-card /deep/ .el-card__body{
  display: flex;
  padding: 5px;
  // flex-wrap: wrap;
}
.item{
  width: 50%;
  height: 395px;
  flex: 1;
  //background: bisque;
  //border: 1px #e1e1e1 solid;
}
.items{
  width: 33%;
  height: 395px;
  flex: 1;
  //background: bisque;
  //border: 1px #e1e1e1 solid;
}
.left-insert{
  width: 100%;
  height: 50vh;
}
.el-card {
  overflow: unset!important;
}
</style>
