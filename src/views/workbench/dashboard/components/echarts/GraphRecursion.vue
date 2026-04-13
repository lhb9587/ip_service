<template>
  <div style="width: 100%" v-loading="loading" element-loading-text="数据加载中" v-resize="handleResize">
    <div class="header">
      <a title="可点击下钻"><svg-icon v-if="drills.length > 0" class="chart-icon chart-click-icon" icon-class="下钻点击" /></a>
      <span>{{ panelName }}</span>
      <el-popover
        placement="top-start"
        :title="panelName"
        width="400"
        trigger="hover">
        <svg-icon slot="reference" class="question" icon-class="问题" />
        <div v-html="panelDesc"></div>
      </el-popover>
      <div class="left_work" v-if="echartIndex !== undefined">
        <a title="筛选"><svg-icon class="chart-icon" icon-class="筛选" :class="{active: searchState}" @click.stop.prevent="searchState= !searchState" /></a>
        <a title="表格"><svg-icon v-if="!echartType.includes('table') && !echartType.includes('ag-grid-mult')" class="chart-icon" icon-class="表格" :class="{active: tableState}" @click="changeTableState" /></a>
        <a title="数据详情"><i v-if="hasItem" class="el-icon-tickets chart-icon" title="数据详情" :class="{active: dataState}" @click.stop.prevent="dataState= !dataState"></i></a>
        <a title="下钻设置"><svg-icon v-if="drills.length > 0" class="chart-icon" icon-class="下钻" :class="{active: drillState}" @click.stop.prevent="drillState= !drillState" /></a>
        <a title="自定义"><svg-icon v-if="customType > 0 && panelId < 10000" class="chart-icon" icon-class="自定义" :class="{active: customState}" @click.stop.prevent="customState= !customState" /></a>
        <a title="导出"><svg-icon class="chart-icon" icon-class="导出" @click="chartExport"/></a>
        <a title="取消钻取"><i v-if="indexKey > 0" class="el-icon-circle-close-outline" @click="closeChart"></i></a>
      </div>
    </div>
    <Search v-show="!drillState" ref="search" class="chart-layer" :custId="custId" :name="$options.name" :panel-id="panelId" :chart-width="chartWidth" :echart-index="echartIndex" :search-state="searchState" @search="handleSearch"></Search>
    <div v-if="otherDesc" class="other-desc">{{ otherDesc }}</div>
    <SetDrill v-if="drillState" :drills="drills" :name="$options.name" :panel-id="panelId" :d-index="drillIndex" @setDirllChart="setDirllChart" @resetDirllChart="resetDirllChart" />
    <Stable v-if="tableState" ref="chartStable" :chart-data="chartData" :chart-select-name="chartSelectName" @drillPanels="drillPanels" @saveDrillPanels="saveDrillPanels"/>
    <DetailList v-if="dataState" class="chart-layer" :custId="custId" :p-id="panelId" :panel-name="panelName" :data-state="dataState" :queryModuleData="queryModuleData" @dataDetailClose="dataDetailClose" />
    <CustomData v-if="customState" :custom-type="customType" :panel-id="panelId" @customDataClose="customDataClose"></CustomData>
    <component v-if="!tableState && !drillState && chartData.list" :is="'S'+echartType" ref="chartComponent" :chart-data="chartData" :chart-select-name="chartSelectName" :chart-width="chartWidth" :table-height="tableHeight" @drillPanels="drillPanels" @saveDrillPanels="saveDrillPanels"></component>
    <svg-icon v-if="reportError" style="width: 100%;height:100%" icon-class="暂无图表"/>
    <a title="全屏"><svg-icon v-show="chartData.list" class="chart-icon chart-enlarge" icon-class="全屏" @click="chartEnlarge"/></a>
  </div>
</template>
<script>
// 图表初始化中间件
import Bus from '../../../../../utils/Bus'
import Scard from './card'
import Sbar from './bar'
import StableMult from './table-mult'
import SagGridMult from './ag-grid-mult'
import Sdonut from './donut'
import SbarGrouped from './bar-grouped'
import SlineGrouped from './line-grouped'
import SbarStacked from './bar-stacked'
import Spie from './pie'
import Sline from './line'
import Stable from './table'
import Search from '../Search'
import SetDrill from '../SetDrill'
import DetailList from '../DetailList'
import CustomData from '../CustomData'
import '../mixins/resize.js';
import { queryFilterConfig, getChartData } from '@/api/dashboard.js'
import { ExportExcelWithDC } from '@/utils/index.js'
export default {
  props: ['custId', 'echartType', 'indexKey','hasItem', 'echartIndex', 'panelId','echartName','overview', 'dimensionItem', 'chartLength', 'tableHeight', 'selectedYear'],
  name: 'GraphRecursion',
  components: {
    Scard,
    Sbar,
    StableMult,
    SagGridMult,
    Sdonut,
    SbarGrouped,
    SlineGrouped,
    SbarStacked,
    Spie,
    Sline,
    Stable,
    Search,
    SetDrill,
    DetailList,
    CustomData
  },
  data() {
    return {
      panelName: '',
      panelDesc: '',
      otherDesc: '', // 金额单位
      drillIndex: 0,
      drillType: false,
      customType: 0, // 自定义图表，0不是自定义，1案件类型，2工作组，4费用类型。
      drillTypeData: ['date','searchRange','checkbox','cascader'],
      dirllChart: [], // 选中钻取图表
      drills: [], // 可选钻取图表
      chartData: [],
      chartSelectName: '',
      chartWidth: '600px',
      loading: true, // 数据加载效果
      searchStatus: 0, // 搜索状态
      queryModuleData: [], // 搜索条件
      searchState: false, // 搜索组件
      tableState: false, // 表格组件
      drillState: false, // 下钻设置组件
      dataState: false, // 数据详情组件
      customState: false, // 自定义数据组件
      reportError: false // 报告错误
    };
  },
  created() {
    this.panelName = this.echartName
    var queryData = JSON.parse(localStorage.getItem('queryModuleData')) ? JSON.parse(localStorage.getItem('queryModuleData')).find(item => item.name == this.$options.name) : ''
    this.drillIndex = queryData ? queryData.chartArr.find(item => item.panelId == this.panelId) ? queryData.chartArr.find(item => item.panelId == this.panelId).drillIndex ? queryData.chartArr.find(item => item.panelId == this.panelId).drillIndex : 0 : 0 : 0
    // this.getChartData()
  },
  methods: {
    ExportExcelWithDC,
    // 计算图表宽度，高度
    handleResize({ width, height }) {
      this.chartWidth = width
      // console.log('gr-handleResize', width, height);
    },
    getChartData() {
      this.queryModuleData = this.overview ? [] : JSON.parse(localStorage.getItem('queryModuleData')) ? JSON.parse(localStorage.getItem('queryModuleData')).find(item => item.name == this.$options.name) ? JSON.parse(localStorage.getItem('queryModuleData')).find(item => item.name == this.$options.name).chartArr.find(item => item.panelId == this.panelId) ? JSON.parse(localStorage.getItem('queryModuleData')).find(item => item.name == this.$options.name).chartArr.find(item => item.panelId == this.panelId).queryModuleData : {} : {} : {}
      this.loading = true
      const params = {panelId: this.panelId, ...this.queryModuleData, custId: this.custId || this.queryModuleData.custId };
      if (this.selectedYear) {
        params.singleYear = this.selectedYear;
      }
      getChartData(params).then(res => {
        if (res.success && res.data != null) {
          this.panelName = res.data.panelName
          if(!res.data.chartDatas || (res.data.chartDatas && !res.data.chartDatas.length) || (res.data.chartDatas && res.data.chartDatas[0] && res.data.chartDatas[0].datas && !res.data.chartDatas[0].datas.length)) {
            this.reportError = true
            this.loading = false
            this.searchState = false
            this.chartData = []
            Bus.$emit('list_resolve',this.panelId)
            return
          } else {
            this.reportError = false
          }
          this.panelDesc = res.data.panelDesc ? res.data.panelDesc.replace(/\r\n/g,'<br/>') : ''
          this.otherDesc = res.data.otherDesc ? res.data.otherDesc : ''
          var drillPanels = res.data.drillPanels
          if (res.data.customType) {
            drillPanels.forEach(item => {
              item.panelId = item.panelId + 10000
            })
          }
          this.drills = drillPanels
          this.dirllChart = drillPanels[this.drillIndex]
          this.chartData = {
            name: res.data.panelName,
            panelType: res.data.panelType,
            panelId: res.data.panelId,
            list: res.data.chartDatas ? res.data.chartDatas : [],
            colName: res.data.colName,
            headers: res.data.headers ? res.data.headers : [],
            drillPanels: drillPanels,
            sumColumns: res.data.sumColumns
          }
          this.customType = res.data.customType
        } else {
          this.reportError = true
        }
        this.loading = false
        this.searchState = false
        Bus.$emit('list_resolve',this.panelId)
      })
    },
    // 搜索处理
    handleSearch(status) {
      this.getChartData()
      this.searchStatus = status
    },
    // 图表钻取,下级图表增加更新
    drillPanels(name) {
      // 获取对应关系，保存到本地缓存中，插入图表渲染时直接获取查询条件
      console.log(this.drillIndex,this.dimensionItem, name, this.dirllChart)
      this.chartSelectName = name
      this.saveDrillPanels(name)
      this.dirllChart && this.$emit('drillPanels', this.echartIndex, this.dirllChart)

    },
    // 搜索项更改，下级图表更新
    searchDrillPanels() {
      this.dirllChart && this.$emit('searchDrillPanels', this.echartIndex, this.dirllChart)
    },
    // 下钻类型检查，保存钻取图表条件项
    saveDrillPanels(name,status) {
      if (this.dimensionItem && this.dirllChart) {
        if (!this.drillType){
          this.setDrillType(this.dimensionItem).then(res => {
            this.savaDrillQueryModuleData(name,status)
          })
        }else{
          this.savaDrillQueryModuleData(name,status)
        }
      }
    },
    // 保存钻取图表条件项
    savaDrillQueryModuleData(name,status){
      if (JSON.parse(localStorage.getItem('queryModuleData'))) {
        var arr = JSON.parse(localStorage.getItem('queryModuleData'))
      } else {
        var arr = []
      }
      var queryModuleData = JSON.parse(JSON.stringify(this.queryModuleData))

      if (this.drillTypeData.includes(this.drillType)) {
        queryModuleData[this.dimensionItem] = []
        name && queryModuleData[this.dimensionItem].push(name)
      }else{
        queryModuleData[this.dimensionItem] = name ? name : ''
      }

      let year = new Date().getFullYear();
      let month = new Date().getMonth() +1;
      let day = new Date().getDate();
      let date = year + '-' + month + '-' + day

      const chartSearch = {
        panelId: this.dirllChart.panelId,
        date: date,
        queryModuleData: queryModuleData
      }
      // 判断本地是否存在图表搜索缓存
      if (arr.find(item => item.name == this.$options.name)) {
        // 判断是否该下级图表id是否存在搜索条件
        if (arr.find(item => item.name == this.$options.name).chartArr.find(item => item.panelId == this.dirllChart.panelId)) {
          // arr.find(item => item.name == this.$options.name).chartArr.find(item => item.panelId == this.dirllChart.panelId).queryModuleData[this.dimensionItem] = name
          arr.find(item => item.name == this.$options.name).chartArr.find(item => item.panelId == this.dirllChart.panelId).queryModuleData = queryModuleData
        }else{
          arr.find(item => item.name == this.$options.name).chartArr.push(chartSearch)
        }
      } else {
        arr.push({name: this.$options.name, chartArr: [ chartSearch ] })
      }

      localStorage.setItem('queryModuleData', JSON.stringify(arr))
      status && Bus.$emit('resolve',this.panelId)
      if (this.searchStatus) {
        this.searchDrillPanels()
        this.searchStatus = 0
      }
    },
    // 设置下钻传值类型
    async setDrillType(dimensionItem){
      await queryFilterConfig({panelId: this.dirllChart.panelId}).then(res => {
        if (res.data && res.data.find(item => item.property == dimensionItem)) {
          this.drillType = res.data.find(item => item.property == dimensionItem).filterType
        }else {
          this.drillType = 'string'
        }
        return this.drillType
      })
    },
    // 设置默认下钻图表
    setDirllChart(index) {
      this.drillIndex = index
      this.dirllChart = this.drills[index]
      this.drillType = false
      this.drillState = false
      // 处理已下钻的图表,清空或替换处理之前的已生成的图表
    },
    // 重置下钻图表
    resetDirllChart() {
      this.$emit('resetDrillPanels', this.echartIndex, this.dirllChart)
      this.$nextTick(() => {
        this.$emit('drillPanels', this.echartIndex, this.dirllChart)
      })
    },
    // 关闭下钻图表
    closeChart() {
      this.$emit('closeChart', this.echartIndex, this.panelId)
    },
    // 关闭数据详情
    dataDetailClose() {
      this.dataState = false
    },
    // 关闭自定义图表
    customDataClose(status) {
      this.customState = false
      if (status == 1){
        this.getChartData()
        this.chartLength > 1 && this.resetDirllChart()
      }
    },
    // 表格切换
    changeTableState() {
      this.tableState = !this.tableState
      this.searchState = false // 关闭检索弹框
    },
    // 图表导出Excel
    chartExport() {
      if (this.chartData.list) {
        var tableHeader = []
        var tableData = []
        var colNameArr = this.chartData.colName ? this.chartData.colName.split('#') : []
        var dataKey = []
        // 针对不同数据格式进行处理
        if(this.chartData.panelId === 4077){
          const legends = this.chartData.list.map(item => item.legend) || []
          const headerList = legends.map((item)=>({
            key:item,
            title:item
          }))
          tableHeader = [
            {key:'name',title:'人员/时限类型'},
            ...headerList,
            {key:'total',title:'合计'}
          ]
          tableData = this.formatDataForPanelId4077(this.chartData.list)
        } else if (this.chartData.panelType == 'bar-grouped' || this.chartData.panelType == 'bar-stacked'){
          dataKey = Object.keys(this.chartData.list[0].datas[0])
          var column = ['legend'].concat(dataKey)
          column.map((item, index) => {
            tableHeader.push({
              key: item,
              title: colNameArr[index]
            })
          })
          this.chartData.list.forEach(item => {
            var legend = {legend:item.legend}
            item.datas.forEach(itm => {
              tableData.push(JSON.parse(JSON.stringify(Object.assign(legend,itm))))
            })
          })
        } else if (this.chartData.panelType == 'table-mult' || this.chartData.panelType == 'ag-grid-mult'){
          this.chartData.headers.map(item => {
            tableHeader.push({
              key: item.field,
              title: item.name
            })
          })
          tableData = this.chartData.list
        } else {
          dataKey = Object.keys(this.chartData.list[0].datas[0])
          dataKey.map((item, index) => {
            tableHeader.push({  
              key: item,
              title: colNameArr[index]
            })
          })
          tableData = this.chartData.list[0].datas
        }
        if (this.chartData.panelId === 4077) {
          this.ExportExcelWithDC(tableHeader, tableData, this.panelName + '.xlsx')
        }else{
          this.$commonUtils.ExportExcel(tableHeader, tableData, this.panelName + '.xlsx') // 生成Excel
        }
      }
    },

    formatDataForPanelId4077(data) {
        const resultMap = {};
        const legends = new Set();
    
        // 遍历数据，提取所有 legend，并初始化 resultMap
        data.forEach(item => {
            legends.add(item.legend);
            item.datas.forEach(dataItem => {
                const { name, value } = dataItem;
                if (!resultMap[name]) {
                    resultMap[name] = { name };
                }
            });
        });
    
        // 遍历数据，填充每个 legend 的值
        data.forEach(item => {
            const { legend, datas } = item;
            datas.forEach(dataItem => {
                const { name, value } = dataItem;
                if (!resultMap[name][legend]) {
                    resultMap[name][legend] = 0;
                }
                resultMap[name][legend] += value;
            });
        });
    
        // 确保每个 name 都有所有 legend 的值，没有则设为 0
        const legendArray = Array.from(legends);
        const formattedResult = Object.values(resultMap).map(entry => {
            legendArray.forEach(legend => {
                if (!(legend in entry)) {
                    entry[legend] = 0;
                }
            });
            // 计算 total
            entry.total = legendArray.reduce((sum, legend) => sum + entry[legend], 0);
            return entry;
        });
    
        return formattedResult;
    },
    // 图表放大
    chartEnlarge() {
      if (!this.tableState){
        this.$refs.chartComponent.dialog = true
      }else{
        this.$refs.chartStable.dialog = true
      }
    }
  },
  watch: {
    chartSelectName() {
      // alert('数据改变')
    }
  }
}
</script>

<style lang="scss" scoped>
.header{
  height: 30px;
  border-bottom: 1px #e1e1e1 solid;
  span{
    color: #000000;
    font-size: 14px;
    font-weight: 400;
    overflow: hidden; /*超出隐藏*/
    text-overflow: ellipsis;/*隐藏后添加省略号*/
    white-space: nowrap;/*强制不换行*/
  }
  .left_work{
    float: right;
    padding: 3px 0;
    .active{
      color: #66b1ff;
    }
    .chart-icon:hover{
      color: #66b1ff;
    }
  }
  .question:hover{
    color: #52A0F5;
    cursor: pointer;
  }
}
.chart-layer{
  display: inline-block;
  margin-right: 10px
}
.other-desc {
  float: right;
  font-size: 14px;
  padding: 12px;
  color: #a3a9b5;
  font-weight: bold;
}
.chart-enlarge{
  float: right;
  width: 1.2rem;
  height: 1.2rem;
  color: #aeaeae;
}
.chart-click-icon{
  width: 1.2rem;
  height: 1.2rem;
  color: #409EFF;
  margin-right: 0;
  vertical-align: -0.15em;
}
</style>
