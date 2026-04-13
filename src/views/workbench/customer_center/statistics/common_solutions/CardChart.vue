<template>
  <div :style="{height: isCustomer ? 'auto' : '400px',minHeight:'400px'}">
    <el-card class="box-card" style="overflow: visible">
      <div slot="header" class="clearfix">
        <span style="font-size: 18px">{{chartData&&chartData.panelName}}</span>
        <el-popover
          placement="top-start"
          :title="chartData.panelName"
          width="400"
          trigger="hover">
          <svg-icon slot="reference" class="question" icon-class="问题"/>
          <div v-html="desc"></div>
        </el-popover>
        <div style="float: right;" v-if="![300003, 300004, 300005].includes(chartData.configId)">
          <span v-if="!isConfig" :style="{color: searchView ? '#66b1ff' : ''}" title="筛选" @click="clickFilter">
            <svg-icon style="cursor: pointer" class="chart-icon" icon-class="筛选"/>
          </span>
          <span style="cursor: pointer;margin-right: 4px" :style="{color: isShowAllData ? '#66b1ff' : ''}" title="全部数据"
                class="el-icon-s-grid chart-icon" @click="showAllData"></span>
          <span style="cursor: pointer;margin-right: 4px" :style="{color: detailDataView ? '#66b1ff' : ''}" title="数据详情"
                class="el-icon-tickets chart-icon" @click="dataDetail"></span>
          <span v-if="!isConfig" style="cursor: pointer" :style="{color: drillView ? '#66b1ff' : ''}" title="下钻设置"><svg-icon
            v-if="chartData.drillPanels && chartData.drillPanels.length > 0" class="chart-icon" icon-class="下钻"
            @click="clickDrill"/></span>
          <span title="删除图表" v-if="!chartData.uniqueKey && chartData.type === 2" style="cursor: pointer"
                @click="delChart"
                class="el-icon-delete" :style="{color: delHover ? 'red' : ''}" @mouseover="delHover = true"
                @mouseleave="delHover = false"></span>
          <span title="取消钻取" v-if="chartData.uniqueKey" style="cursor: pointer" class="el-icon-circle-close-outline"
                @click="closeChart"></span>
          <span title="导出" style="cursor: pointer" @click="chartExport"><svg-icon class="chart-icon" icon-class="导出" /></span>
        </div>

      </div>
      <div v-clickoutside.prevent="clickSearchOut">
        <search style="width: 100%;height: 100%;" v-show="searchView" :panelId="chartData.panelId" :index="index"
                :rowData="rowData"
                ref="search"
                :searchView="searchView"
                :key="chartData.configId || chartData.panelId"
                :chartData="chartData"
                :configId="chartData.configId"
                :queryData="queryModuleDataObj[chartData.configId || chartData.uniqueKey] || {}"
                @search="search"></search>
      </div>
      <div style="position:relative;width: 100%;height: 100%;" v-if="drillView">
        <drill v-if="drillView" :drills="chartData.drillPanels" @changeDrillIndex="changeDrillIndex"></drill>
      </div>
      <div v-show="!drillView && !searchView" customClass="loadingClass" v-loading="chartData.isLoading"
           element-loading-text="数据加载中">
        <component v-if="chartData.panelId && chartData.chartDatas"
                   :is="'S'+ comPanelType"
                   ref="chartComponent"
                   :panelId="chartData.panelId"
                   :dimensionItem="chartData.colProper"
                   :chart-data="{...chartData, list: chartData.chartDatas || []}"
                   :table-height="350"
                   @drillData="drillData"
                   @cancelRefresh="cancelRefresh"
                   :isCustomer="isCustomer"
        ></component>
      </div>

      <svg-icon v-if="!chartData.isLoading && !chartData.panelId || !chartData.chartDatas"
                style="width: 100%;height:100%" icon-class="暂无图表"/>
    </el-card>

    <el-dialog
      title="详细数据"
      append-to-body
      :close-on-click-modal="false"
      :visible.sync="detailDataView"
      width="80%"
      height="80%"
      class="abow_dialog"
    >
      <div style="width: 80%;">
        <el-button type="text" @click="exportList(1)">全局导出</el-button>
      </div>
      <detail-grid v-if="detailDataView" :tableData="tableData" :tableTitleList="titleList"></detail-grid>
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="listQuery.pageNo"
        :limit.sync="listQuery.pageSize"
        @pagination="() => queryList(chartData.type)"
        :pageSizes="pageSizesList"
      />
      <SelectOption :config-id="chartData.configId" :panel-id="chartData.panelId" v-if="selectionOptionState" :dialog-visible="selectionOptionState" :defaultMultipleSelect="titleList" :queryModuleData="configQueryData" @cancel="closeSelect" :exportType="1" :exportQueryModel="exportQueryModel"></SelectOption>
    </el-dialog>
  </div>
</template>

<script>
  import Pagination from "@/components/Pagination";
  import {
    delCustomerStatisticsPanelConfig,
    getChartDataUrl,
    getInfoData,
    getPropertyPreferenceUrl,
    queryFilterUrl,
  } from "../../../../../api/customerList";
  import Scard from "../../../dashboard/components/echarts/card";
  import Sbar from "../../../dashboard/components/echarts/bar";
  import StableMult from "./echartsCpn/table-mult";
  import SagGridMult from "../../../dashboard/components/echarts/ag-grid-mult";
  import Sdonut from "../../../dashboard/components/echarts/donut";
  import SbarGrouped from "../../../dashboard/components/echarts/bar-grouped";
  import SbarStacked from "../../../dashboard/components/echarts/bar-stacked";
  import Spie from "../../../dashboard/components/echarts/pie";
  import Sline from "../../../dashboard/components/echarts/line";
  import SlineGrouped from "./echartsCpn/line-grouped";
  import Stable from "./echartsCpn/table";
  import Search from "./Search";
  import SetDrill from "../../../dashboard/components/SetDrill";
  import DetailList from "../../../dashboard/components/DetailList";
  import CustomData from "../../../dashboard/components/CustomData";
  import DetailGrid from "./DetailGrid";
  import Drill from "./Drill";
  import SelectOption from './SelectOption'
  import {getChartData, queryChartDateItems, queryPreference} from "../../../../../api/dashboard";

  export default {
    name: "CardChart",
    computed: {
      desc() {
        return (this.chartData.memo || this.chartData.panelDesc || '').replace(/\r\n/g, '<br />')
      },
      comPanelType() {
        if (this.chartData.panelType1 === 'tableData') {
          return 'table'
        }
        return this.chartData.panelType
      }
    },
    props: {
      rowData: {},
      rowIndex: {},
      index: {},
      chartData: {},
      isConfig: {
        type: Boolean,
        default: false
      },
      configQueryData: {},
      isCustomer: {
        type: Boolean,
        default: false
      }
    },
    components: {
      Drill,
      DetailGrid,
      Scard,
      Sbar,
      StableMult,
      SagGridMult,
      Sdonut,
      SbarGrouped,
      SbarStacked,
      Spie,
      Sline,
      Stable,
      Search,
      SetDrill,
      DetailList,
      CustomData,
      SlineGrouped,
      Pagination,
      SelectOption
    },
    data() {
      return {
        panelTypeBack: '',
        isShowAllData: false,
        delHover: false,
        targetDrillPaneData: {},
        drillView: false,
        searchView: false,
        pageSizesList: [10, 50, 200, 500, 1000, 5000, 10000],
        listQuery: {
          pageSize: 10,
          pageNo: 1
        },
        titleList: [],
        tableData: [],
        total: 0,
        detailDataView: false,
        queryModuleDataObj: {},
        backData: {},
        exportQueryModel:'',
        preferenceList:[],
        selectionOptionState:false
      }
    },
    watch: {
      'chartData.refresh': {
        handler(n) {
          if(this.$refs.search && this.$refs.search.refreshFilter());
        }
      }
    },
    mounted() {
    },
    methods: {
      exportList(){
        this.selectionOptionState=true
      },
      closeSelect(){
        this.selectionOptionState=false
      },
      cancelRefresh() {
        this.$set(this.chartData, 'refresh', false)
        this.$nextTick(() => {

        })
      },
      getTwoChartData(data) {
        if (data.type === 1) { // 原经营数据
          return getChartData(data)
        } else if (data.type === 2) { // 现客户数据
          return getChartDataUrl(data)
        }
      },
      showAllData() {
        this.isShowAllData = !this.isShowAllData
        let data = {}
        if (this.isConfig) {
          data = this.configQueryData
          data.whole = this.isShowAllData ? 1 : undefined
          if (!this.backData.panelTypeBack) {
            this.backData = JSON.parse(JSON.stringify(this.chartData))
            this.backData.panelTypeBack = this.backData.panelType
          }
        } else {
          if (!this.rowData[this.index].queryData) {
            this.rowData[this.index].queryData = {}
          }
          this.$set(this.rowData[this.index].queryData, 'whole', this.isShowAllData ? 1 : undefined)
          if (this.index === 0) {
            data = Object.assign({}, this.$commonUtils.cleanNullAttr(this.rowData[this.index].queryData || {}))
          } else if (this.index === 1) {
            data = Object.assign(
              this.$commonUtils.cleanNullAttr({...(this.rowData[this.index - 1].queryData || {}), ...(this.rowData[this.index].queryData || {})}),
              this.$commonUtils.cleanNullAttr({...(this.rowData[this.index - 1].searchData || {})})
            )
          } else if (this.index === 2) {
            data = Object.assign(
              this.$commonUtils.cleanNullAttr({...(this.rowData[this.index - 2].queryData || {}), ...(this.rowData[this.index - 1].queryData || {}), ...(this.rowData[this.index].queryData || {})}),
              this.$commonUtils.cleanNullAttr({...(this.rowData[this.index - 2].searchData || {}), ...(this.rowData[this.index - 1].searchData || {})}),
            )
          }
          if (!this.backData.panelTypeBack) {
            this.backData = JSON.parse(JSON.stringify(this.rowData[this.index]))
            this.backData.panelTypeBack = this.backData.panelType
          }
        }
        this.chartData.isLoading = true
        this.searchView = false
        this.drillView = false
        this.delHover = false
        this.detailDataView = false
        this.getTwoChartData({
          ...this.handlerQueryModuleData(data),
          uniqueKey: this.chartData.uniqueKey,
          panelType: this.backData.panelTypeBack,
          panelId: this.chartData.panelId,
          type: this.chartData.type,
          configId: this.chartData.configId,
        }).then(res => {
          this.$set(this.chartData, 'isLoading', false)
          if (this.isConfig) {
            this.$set(this.chartData, 'uniqueKey', this.backData.uniqueKey)
            this.$set(this.chartData, 'type', this.backData.type)
            this.$set(this.chartData, 'configId', this.backData.configId)
            this.$set(this.chartData, 'panelType1', this.isShowAllData && this.backData.panelTypeBack !== 'table-mult' ? 'tableData' : this.backData.panelTypeBack)
            this.$set(this.chartData, 'panelType', res.data.panelType)
            this.$set(this.chartData, 'chartDatas', res.data && res.data.chartDatas || [])
            this.$set(this.chartData, 'refresh', true)
          } else {
            this.rowData.splice(this.index, 1, {...(res.data || {}), dimensionItem: res.data && res.data.colProper})
            this.$set(this.rowData[this.index], 'chartDatas', res.data && res.data.chartDatas || [])
            this.$set(this.rowData[this.index], 'isDrill', this.backData.isDrill)
            this.$set(this.rowData[this.index], 'type', this.backData.type)
            this.$set(this.rowData[this.index], 'queryData', this.backData.queryData)
            this.$set(this.rowData[this.index], 'searchData', this.backData.searchData)
            this.$set(this.rowData[this.index], 'uniqueKey', this.backData.uniqueKey)
            this.$set(this.rowData[this.index], 'configId', this.backData.configId)
            this.$set(this.rowData[this.index], 'panelType1', this.isShowAllData && this.backData.panelTypeBack !== 'table-mult' ? 'tableData' : this.backData.panelTypeBack)
            this.$set(this.rowData[this.index], 'panelType', res.data.panelType)
            this.$set(this.rowData[this.index], 'refresh', true)
          }

        }).catch(() => {
          if (this.isConfig) {
            this.$set(this.chartData, 'isLoading', false)
          } else {
            this.$set(this.rowData[this.index], 'isLoading', false)
          }
        })
      },
      clickFilter() {
        this.searchView = !this.searchView
        this.drillView = false
        this.delHover = false
        this.detailDataView = false
      },
      clickDrill() {
        this.drillView = !this.drillView
        this.searchView = false
        this.delHover = false
        this.detailDataView = false
      },
      closeChart() {
        this.$emit('closeChart', this.chartData.uniqueKey)
      },
      delChart() {
        this.$confirm('确定要永久删除该图表吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delCustomerStatisticsPanelConfig({
            configId: this.chartData.configId
          }).then(res => {
            this.$message.success('删除成功!')
            this.$emit('delUpdate', this.chartData)
          })
        })
      },
          // 图表导出Excel
    chartExport() {
      console.log(this.chartData, 'this.chartData');
      if (this.chartData.chartDatas) {
        let tableHeader = []
        let tableData = []
        let colNameArr = this.chartData.colName ? this.chartData.colName.split('#') : []
        let dataKey = []
        console.log(this.chartData.panelType ,'this.chartData.panelType ');
        // 针对不同数据格式进行处理
        if (this.chartData.panelType == 'bar-grouped' || this.chartData.panelType == 'bar-stacked'){
          dataKey = Object.keys(this.chartData.chartDatas[0].datas[0])
          const column = ['legend'].concat(dataKey)
          column.map((item, index) => {
            tableHeader.push({
              key: item,
              title: colNameArr[index]
            })
          })
          this.chartData.chartDatas.forEach(item => {
            const legend = {legend:item.legend}
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
          tableData = this.chartData.chartDatas
        } else {
          dataKey = Object.keys(this.chartData.chartDatas[0].datas[0])
          dataKey.map((item, index) => {
            tableHeader.push({
              key: item,
              title: colNameArr[index]
            })
          })
          tableData = this.chartData.chartDatas[0].datas
        }
        this.$commonUtils.ExportExcel(tableHeader, tableData, this.chartData.panelName + '.xlsx') // 生成Excel
      }
    },
      changeDrillIndex(index) {
        this.drillView = false
        this.searchView = false
        this.delHover = false
        this.detailDataView = false
        this.targetDrillPaneData = this.chartData.drillPanels[index]
        // if (this.rowData[2]) {
        //   if (index === 0) { // 左边图表触发更新，中间、右边存在的话需同步更新
        //     this.$set(this.rowData[index + 1], 'refresh', true)
        //     this.$set(this.rowData[index + 2], 'refresh', true)
        //   } else if (index === 1) { // 中间图表触发更新，右边存在则需要同步更新
        //     this.$set(this.rowData[index + 1], 'refresh', true)
        //
        //   } else if (index === 2) { // 右边图表更新
        //
        //   }
        // } else if (this.rowData[1].isDrill) {
        //   if (index === 0) {
        //     this.$set(this.rowData[index + 1], 'refresh', true)
        //   }
        // }
        this.$emit('updateRowData', this.rowIndex, this.index, 'drillTypeChange')
      },
      handlerQueryModuleData(data) {
        if (this.chartData.panelId == 25) {
          delete data.belongToDate
          delete data.belongToMonth
        }else{
          delete data.caseDate
        }
        const queryModuleData = JSON.parse(JSON.stringify(data))
        for (let key in queryModuleData) {
          if (Array.isArray(queryModuleData[key])) {
            if (!queryModuleData[key].filter(Boolean).length) {
              delete queryModuleData[key]
            } else {
              if (key === 'caseTypeIds' || key === 'wkgId') {
                queryModuleData[key] = queryModuleData[key].filter(item => item.length === 3).map(item => item[item.length - 1]).join(',')
              } else {
                queryModuleData[key] = queryModuleData[key].join(',')
              }
            }
          } else {
            if (!queryModuleData[key] && queryModuleData[key] !== false && queryModuleData[key] !== 0) {
              delete queryModuleData[key]
            }
          }
        }
        return queryModuleData
      },
      search(query) {
        // this.queryModuleDataObj[this.chartData.configId || this.chartData.uniqueKey] = JSON.parse(JSON.stringify(query))
        this.$set(this.queryModuleDataObj, this.chartData.configId || this.chartData.uniqueKey, JSON.parse(JSON.stringify(query)))
        this.searchView = false
        const type = this.chartData.type
        this.$set(this.chartData, 'refresh', false)
        this.getTwoChartData({
          panelId: this.chartData.panelId,
          panelType: this.chartData.panelType,
          configId: this.chartData.configId,
          ...this.handlerQueryModuleData(JSON.parse(JSON.stringify(query))),
          type
        }).then(res => {
          this.$set(this.chartData, 'chartDatas', res.data && res.data.chartDatas || [])
          this.$set(this.chartData, 'queryData', this.$commonUtils.cleanNullAttr(query))
          this.$set(this.chartData, 'type', type)
          this.$set(this.chartData, 'refresh', true)
          this.$emit('updateRowData', this.rowIndex, this.index, 'searchChange')
        })
      },
      drillData(data) {
        if (data.legend) {
          data.seriesName = data.legend
        }
        if (!this.chartData.drillPanels || this.chartData.drillPanels && !this.chartData.drillPanels.length) return
        //this.targetDrillPaneData = this.chartData && this.chartData.drillPanels && this.chartData.drillPanels.find(item => item.default) || this.chartData.drillPanels && this.chartData.drillPanels[0]
        if (!this.targetDrillPaneData.panelId) {
          this.targetDrillPaneData = this.chartData && this.chartData.drillPanels && this.chartData.drillPanels.find(item => item.default) || this.chartData.drillPanels && this.chartData.drillPanels[0]
        }
        this.chartData && this.chartData.drillPanels && this.$emit('drillData', {
          ...data,
          targetPanel: this.targetDrillPaneData
        })
      },
      clickDillsOut() {
        this.drillView = false
      },
      clickSearchOut() {
        // this.searchView = false
      },
      queryFilter(chart) {
        queryFilterUrl({configId: chart.configId, panelId: chart.panelId}).then(res => {
          chart.filterData = res.data || []
        })
      },
      dataDetail() {
        if (this.chartData.type === 1) {
          queryPreference({
            panelId: this.chartData.panelId,
            userId: this.$store.getters.userId
          }).then(res => {
            this.titleList = res.data || []
            console.log(this.titleList, 'this.titleList');
            const list = this.titleList.map(i=>i.title)
            console.log(list,'list!!!!');
            this.queryList(1)
            // queryChartDateItems()
          })
        } else if (this.chartData.type === 2) {
          getPropertyPreferenceUrl({
            panelId: this.chartData.panelId
          }).then(res => {
            this.titleList = res.data || []
            console.log(this.titleList, 'this.titleList');
            const list = this.titleList.map(i=>i.title)
            console.log(list,'list!!!!');
            this.queryList(2)
          })
        }
      },
      queryList(chartType) {
        let data = {}
        if (this.isConfig) {
          data = this.configQueryData
        } else {
          if (this.index === 0) {
            data = Object.assign({}, this.$commonUtils.cleanNullAttr(this.rowData[this.index].queryData || {}))
          } else if (this.index === 1) {
            data = Object.assign(
              this.$commonUtils.cleanNullAttr({...(this.rowData[this.index - 1].queryData || {}), ...(this.rowData[this.index].queryData || {})}),
              this.$commonUtils.cleanNullAttr({...(this.rowData[this.index - 1].searchData || {}), ...(this.rowData[this.index].searchData || {})})
            )
          } else if (this.index === 2) {
            data = Object.assign(
              this.$commonUtils.cleanNullAttr({...(this.rowData[this.index - 2].queryData || {}), ...(this.rowData[this.index - 1].queryData || {}), ...(this.rowData[this.index].queryData || {})}),
              this.$commonUtils.cleanNullAttr({...(this.rowData[this.index - 2].searchData || {}), ...(this.rowData[this.index - 1].searchData || {}), ...(this.rowData[this.index - 1].searchData || {}), ...(this.rowData[this.index].searchData || {})}),
            )
          }
        }
        let idData = {}
        if (chartType === 2) {
          idData = {configId: this.chartData.configId, panelId: this.chartData.panelId}
        } else {
          idData = {panelId: this.chartData.panelId}
        }
        this.exportQueryModel = JSON.stringify(this.handlerQueryModuleData(data))
        console.log(this.exportQueryModel,'exportQueryModel');
        this.twoGetInfoData({
          ...this.handlerQueryModuleData(data),
          ...idData,
          ...this.listQuery,
          type: chartType
        }).then(res => {
          this.total = res.total || 0
          this.tableData = res.data || []
          this.detailDataView = true
        })
      },
      twoGetInfoData(data) {
        if (data.type === 1) {
          return queryChartDateItems({...data, type: undefined})
        } else if (data.type === 2) {
          return getInfoData({...data, type: undefined})
        }
      }
    }
  }
</script>

<style lang="scss" scoped>

  > > > .el-card__header {
    padding: 10px;
    margin: 0 5px;
  }

  .box-card {
    height: 100%;
  }

  > > > .el-card__body {
    height: calc(100% - 45px);
    padding: 0;
    background-color: #fff;
    border-radius: 4px;
  }

  .abow_dialog {
    > > > .el-dialog {
      position: absolute;
      top: 50%;
      left: 50%;
      margin: 0 !important;
      transform: translate(-50%, -50%);
      min-height: calc(60%);
      max-height: calc(100% - 30px);
      max-width: calc(100% - 30px);
      display: flex;
      flex-direction: column;
    }

    > > > .el-dialog__body {
      overflow: auto;
      padding: 0 10px 10px 10px;
    }
  }

  .question:hover {
    color: #52A0F5;
    cursor: pointer;
  }

</style>
