<template>
  <div>
    <div v-if="rowList.length">
      <div v-for="(row, index) in rowList" :key="index" class="rowCard">
        <div class="left-card" :style="{width: index === 0 ? '100%' :''}">
          <card-chart :rowData="row" :rowIndex="index" :index="0" @delUpdate="delUpdate" @updateRowData="updateRowData"
                      @drillData="(obj) => drillDataLeft(obj, index)"
                      v-if="row[0]&&row[0].panelName"
                      :key="row[0].configId"
                      :chartData="row[0]"></card-chart>
        </div>
        <div v-if="row[1]" class="right-card">
          <card-chart :rowData="row" :rowIndex="index" :index="1" @closeChart="closeChart" @delUpdate="delUpdate"
                      @updateRowData="updateRowData"
                      @drillData="(obj) => drillDataRight(obj, index)"
                      v-if="row[1]&&row[1].panelName"
                      :key="row[1].configId || row[1].panelId"
                      :chartData="row[1]"></card-chart>
        </div>
        <div v-if="row[2]" class="right-card">
          <card-chart :rowData="row" :rowIndex="index" :index="2" @closeChart="closeChart" @delUpdate="delUpdate"
                      @updateRowData="updateRowData"
                      v-if="row[2]&&row[2].panelName"
                      :key="row[2].configId || row[2].panelId"
                      :chartData="row[2]"></card-chart>
        </div>
      </div>
    </div>
    <div v-else>
      <svg-icon class="left-insert" icon-class="左侧添加内容"/>
    </div>

  </div>
</template>

<script>

  import TaskQueue from "../../../dashboard/components/TaskQueue";
  import Scard from "../../../dashboard/components/echarts/card";
  import Sbar from "../../../dashboard/components/echarts/bar";
  import StableMult from "../../../dashboard/components/echarts/table-mult";
  import SagGridMult from "../../../dashboard/components/echarts/ag-grid-mult";
  import Sdonut from "../../../dashboard/components/echarts/donut";
  import SbarGrouped from "../../../dashboard/components/echarts/bar-grouped";
  import SbarStacked from "../../../dashboard/components/echarts/bar-stacked";
  import Spie from "../../../dashboard/components/echarts/pie";
  import Sline from "../../../dashboard/components/echarts/line";
  import Stable from "../../../dashboard/components/echarts/table";
  import Search from "../../../dashboard/components/Search";
  import SetDrill from "../../../dashboard/components/SetDrill";
  import DetailList from "../../../dashboard/components/DetailList";
  import CustomData from "../../../dashboard/components/CustomData";
  import {
    getChartDataUrl,
    queryCustomerStatisticsPanel,
    queryFilterUrl,
    queryPanelTab
  } from "../../../../../api/customerList";
  import CardChart from "./CardChart";
  import {getChartData} from "../../../../../api/dashboard";

  export default {
    name: "ChartsView",
    components: {
      CardChart,
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
      CustomData
    },
    computed: {
      panelsData() {
        return this.$store.getters.panelsData.chartCheckList
      },
      allPanelsData() {
        return this.$store.getters.panelsData.chartList
      }
    },
    watch: {
      panelsData: {
        handler(n, o) {
          this.initOrUpdateRowList(n)
          n && this.queryList(n)
        },
        deep: true,
        immediate: true
      }
    },
    data() {
      return {
        initFlag: true,
        longList: [],
        rowList: [],
      }
    },
    created() {

    },
    mounted() {
      // this.initRowList(this.panelsData)
    },
    methods: {
      handlerQueryModuleData(data) {
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
      getTwoChartData(data) {
        if (data.type === 1) { // 原经营数据
          return getChartData(data)
        } else if (data.type === 2) { // 现客户数据
          return getChartDataUrl(data)
        }
      },
      updateRowData(rowIndex, index, type) {
        if (type === 'drillTypeChange') { // 下钻类型变更 this.getInitName(this.rowList[index][1].chartDatas || [])
          // this.drillDataLeft(this.rowList[rowIndex][0].targetDrillData, rowIndex)
          if (this.rowList[rowIndex][2]) {
            if (index === 0) { // 左边图表触发更新，中间、右边存在的话需同步更新
              this.drillDataLeft({
                ...this.rowList[rowIndex][0].targetDrillData
              }, rowIndex)

            } else if (index === 1) { // 中间图表触发更新，右边存在则需要同步更新
              this.drillDataRight({
                ...this.rowList[rowIndex][1].targetDrillData
              }, rowIndex)

            } else if (index === 2) { // 右边图表更新

            }
          } else if (this.rowList[rowIndex][1] && this.rowList[rowIndex][1].isDrill) {
            if (index === 0) {
              this.drillDataLeft({
                ...this.rowList[rowIndex][0].targetDrillData
              }, rowIndex)
            }
          }
        }
        if (type === 'searchChange') {
          if (this.rowList[rowIndex][2]) {
            if (index === 0) { // 左边图表触发更新，中间、右边存在的话需同步更新
              this.drillDataLeft({
                ...this.rowList[rowIndex][0].targetDrillData,
                seriesName: this.getInitName(this.rowList[rowIndex][0].chartDatas || [], 'x'),
                name: this.getInitName(this.rowList[rowIndex][0].chartDatas || [], 'y')
              }, rowIndex)

            } else if (index === 1) { // 中间图表触发更新，右边存在则需要同步更新
              this.drillDataRight({
                ...this.rowList[rowIndex][1].targetDrillData,
                seriesName: this.getInitName(this.rowList[rowIndex][1].chartDatas || [], 'x'),
                name: this.getInitName(this.rowList[rowIndex][1].chartDatas || [], 'y')
              }, rowIndex)

            } else if (index === 2) { // 右边图表更新

            }
          } else if (this.rowList[rowIndex][1] && this.rowList[rowIndex][1].isDrill) {
            if (index === 0) {
              this.drillDataLeft({
                ...this.rowList[rowIndex][0].targetDrillData,
                seriesName: this.getInitName(this.rowList[rowIndex][0].chartDatas || [], 'x'),
                name: this.getInitName(this.rowList[rowIndex][0].chartDatas || [], 'y')
              }, rowIndex)
            }
          }
        }
      },
      closeChart(uniqueKey) {
        let closeDrillIndex
        this.rowList.forEach((row, idx) => {
          closeDrillIndex = row.findIndex(chart => chart.uniqueKey == uniqueKey)
          if (closeDrillIndex !== -1) {
            row.splice(closeDrillIndex, closeDrillIndex === 2 ? 1 : 2)
          }
        })
      },
      delUpdate(data) {
        if (data.isDrill) {
          let index
          this.rowList.forEach((row, idx) => {
            if (row.findIndex(chart => chart.configId == data.configId) !== -1) {
              index = idx
            }
          })
          this.rowList.splice(index, 1)
        } else {
          this.rowList.forEach((row, idx) => {
            if (row.findIndex(chart => chart.configId == data.configId) !== -1) {
              row.splice(row.findIndex(chart => chart.configId == data.configId), 1)
            }
          })
        }
        this.$store.commit('app/SET_HIDE_CHART', data.configId)
        this.initRowList(this.panelsData.filter(item => item !== data.configId))
        this.queryList(this.panelsData.filter(item => item !== data.configId))
      },
      drillDataLeft(data, index) {
        if (this.rowList[index][2]) {
          this.drillLeftAuto(data, index) // 自动下钻最底层
        } else {
          this.drillLeftClick(data, index) // 正常下钻逻辑
        }
      },
      async drillLeftAuto(data, index) {
        const type = this.rowList[index][0].type
        const panelData = this.rowList[index][0].drillPanels && this.rowList[index][0].drillPanels.length && (this.rowList[index][0].drillPanels.find(item => item.default || item.checked) || this.rowList[index][0].drillPanels[0]) || {}
        this.rowList[index][0].targetDrillData = panelData
        let leftData = {}
        const uniqueKey = new Date().getTime()
        leftData = JSON.parse(JSON.stringify(this.rowList[index][0]))
        this.$set(this.rowList[index][0], 'searchData', {
          [leftData.childPropertyX && leftData.childPropertyX.replace('Array', '')]: leftData.childPropertyX && leftData.childPropertyX.includes('Array') ? [data.name] : data.name,
          [leftData.childPropertyY && leftData.childPropertyY.replace('Array', '')]: leftData.childPropertyY && leftData.childPropertyY.includes('Array') ? [data.seriesName] : data.seriesName,
        })
        // this.rowList[index][0].searchData = {
        //   [leftData.childPropertyX && leftData.childPropertyX.replace('Array', '')]: leftData.childPropertyX && leftData.childPropertyX.includes('Array') ? [data.name] : data.name,
        //   [leftData.childPropertyY && leftData.childPropertyY.replace('Array', '')]: leftData.childPropertyY && leftData.childPropertyY.includes('Array') ? [data.seriesName] : data.seriesName,
        // }
        this.$set(this.rowList[index][1], 'uniqueKey', uniqueKey)
        this.$set(this.rowList[index][1], 'isLoading', true)
        await this.getTwoChartData({
          type,
          panelType: panelData.panelType,
          panelId: panelData.panelId,
          configId: panelData.configId,
          uniqueKey,
          ...this.handlerQueryModuleData(this.rowList[index][0].queryData || {}),
          ...this.handlerQueryModuleData(this.rowList[index][1].queryData || {}),
          ...this.rowList[index][0].searchData,
        }).then(res => {
            if (res.data) {
              this.rowList.forEach((row, idx) => {
                if (row.findIndex(chart => chart.uniqueKey == res.data.uniqueKey) !== -1) {
                  this.$set(this.rowList[idx], row.findIndex(chart => chart.uniqueKey == res.data.uniqueKey), {
                    ...res.data,
                    type,
                    isDrill: true,
                    refresh: true
                  })
                }
              })
              this.$set(this.rowList[index][1], 'searchData', {
                [this.rowList[index][1].childPropertyX && this.rowList[index][1].childPropertyX.replace('Array', '')]: this.rowList[index][1].childPropertyX && this.rowList[index][1].childPropertyX.includes('Array') ? [this.getInitName(this.rowList[index][1].chartDatas || [], 'x')] : this.getInitName(this.rowList[index][1].chartDatas || [], 'x'),
                [this.rowList[index][1].childPropertyY && this.rowList[index][1].childPropertyY.replace('Array', '')]: this.rowList[index][1].childPropertyY && this.rowList[index][1].childPropertyY.includes('Array') ? [this.getInitName(this.rowList[index][1].chartDatas || [], 'y')] : this.getInitName(this.rowList[index][1].chartDatas || [], 'y'),
              })
              // this.rowList[index][1].searchData = {
              //   [this.rowList[index][1].childPropertyX && this.rowList[index][1].childPropertyX.replace('Array', '')]: this.rowList[index][1].childPropertyX && this.rowList[index][1].childPropertyX.includes('Array') ? [this.getInitName(this.rowList[index][1].chartDatas || [], 'x')] : this.getInitName(this.rowList[index][1].chartDatas || [], 'x'),
              //   [this.rowList[index][1].childPropertyY && this.rowList[index][1].childPropertyY.replace('Array', '')]: this.rowList[index][1].childPropertyY && this.rowList[index][1].childPropertyY.includes('Array') ? [this.getInitName(this.rowList[index][1].chartDatas || [], 'y')] : this.getInitName(this.rowList[index][1].chartDatas || [], 'y'),
              // }
            } else {
              this.rowList.forEach((row, idx) => {
                if (row.findIndex(chart => chart.isLoading === true) !== -1) {
                  this.$set(this.rowList[idx], row.findIndex(chart => chart.isLoading === true), {
                    panelName: panelData.panelName,
                    panelId: panelData.panelId,
                    configId: panelData.configId,
                    panelType: panelData.panelType,
                    type,
                    isDrill: true,
                    refresh: true
                  })
                }
              })
            }
          }
        ).catch(err => {
          this.rowList.forEach((row, idx) => {
            if (row.findIndex(chart => chart.isLoading === true) !== -1) {
              this.$set(this.rowList[idx], row.findIndex(chart => chart.isLoading === true), {
                panelName: panelData.panelName,
                panelType: panelData.panelType,
                refresh: true
              })
            }
          })
        })
        const panelData1 = this.rowList[index][1].drillPanels && this.rowList[index][1].drillPanels.length && (this.rowList[index][1].drillPanels.find(item => item.default || item.checked) || this.rowList[index][1].drillPanels[0]) || {}
        this.rowList[index][1].targetDrillData = panelData1
        const type1 = this.rowList[index][2].type
        if (panelData1 && panelData1.panelId) {
          const uniqueKey = new Date().getTime()
          this.$set(this.rowList[index][2], 'uniqueKey', uniqueKey)
          this.$set(this.rowList[index][2], 'isLoading', true)
          this.getTwoChartData({
            type: type1,
            uniqueKey,
            panelType: panelData1.panelType,
            panelId: panelData1.panelId,
            configId: panelData1.configId,
            ...this.handlerQueryModuleData(this.rowList[index][0].queryData || {}),
            ...this.handlerQueryModuleData(this.rowList[index][1].queryData || {}),
            ...this.handlerQueryModuleData(this.rowList[index][2].queryData || {}),
            ...this.rowList[index][0].searchData,
            ...this.rowList[index][1].searchData
          }).then(res => {
            if (res.data) {
              this.rowList.forEach((row, idx) => {
                if (row.findIndex(chart => chart.uniqueKey == res.data.uniqueKey) !== -1) {
                  this.$set(this.rowList[idx], row.findIndex(chart => chart.uniqueKey == res.data.uniqueKey), {
                    ...res.data,
                    type: type1,
                    isDrill: true,
                    refresh: true
                  })
                }
              })
            } else {
              this.rowList.forEach((row, idx) => {
                if (row.findIndex(chart => chart.isLoading === true) !== -1) {
                  this.$set(this.rowList[idx], row.findIndex(chart => chart.isLoading === true), {
                    panelName: panelData1.panelName,
                    panelId: panelData1.panelId,
                    configId: panelData1.configId,
                    panelType: panelData1.panelType,
                    type,
                    isDrill: true,
                    refresh: true
                  })
                }
              })
            }
          }).catch(err => {
            this.rowList.forEach((row, idx) => {
              if (row.findIndex(chart => chart.isLoading === true) !== -1) {
                this.$set(this.rowList[idx], row.findIndex(chart => chart.isLoading === true), {
                  panelName: panelData.panelName,
                  panelType: panelData.panelType,
                  refresh: true
                })
              }
            })
          })
        } else {
          this.$set(this.rowList[index], 2, {
            panelName: panelData.panelName,
            panelType: panelData.panelType,
            refresh: true,
            isLoading: false
          })
        }

      },
      getInitName(list, type) {
        if (!list || list && !list.length) return ''
        if (type === 'x') {
          if (list[0].name) {
            return list[0].name
          }
          if (list[0].legend) {
            return list[0].legend
          }
        } else {
          if (list[0].datas && list[0].datas[0] && list[0].datas[0].name) {
            return list[0].datas[0].name
          }
        }
        return undefined

      },
      drillLeftClick(data, index) {
        const type = this.rowList[index][0].type
        const panelData = this.rowList[index][0].drillPanels && this.rowList[index][0].drillPanels.length && (this.rowList[index][0].drillPanels.find(item => item.default || item.checked) || this.rowList[index][0].drillPanels[0]) || {}
        this.rowList[index][0].targetDrillData = panelData
        let leftData = {}
        const uniqueKey = new Date().getTime()
        leftData = JSON.parse(JSON.stringify(this.rowList[index][0]))
        if (this.rowList[index][0].isDrill) {
          this.$set(this.rowList[index], 1, {
            isLoading: true,
            uniqueKey,
            panelType: panelData.panelType,
            configId: panelData.panelId,
            panelId: panelData.panelId,
            panelName: panelData.panelName
          })
        } else {
          if (this.rowList[index][1]) {
            const rightData = JSON.parse(JSON.stringify(this.rowList[index][1]))
            this.rowList.splice(index, 1, [{...leftData, isDrill: true}, {
              isLoading: true,
              uniqueKey,
              panelType: panelData.panelType,
              configId: panelData.panelId,
              panelId: panelData.panelId,
              panelName: panelData.panelName
            }])
            this.rowList.splice(index + 1, 0, [{...rightData, isDrill: true}])
          } else {
            this.$set(this.rowList[index][0], 'isDrill', true)
            this.$set(this.rowList[index], 1, {
              isLoading: true,
              uniqueKey,
              panelType: panelData.panelType,
              configId: panelData.panelId,
              panelId: panelData.panelId,
              panelName: panelData.panelName
            })
          }
        }
        this.$set(this.rowList[index][0], 'searchData', {
          [leftData.childPropertyX && leftData.childPropertyX.replace('Array', '')]: leftData.childPropertyX && leftData.childPropertyX.includes('Array') ? [data.name] : data.name,
          [leftData.childPropertyY && leftData.childPropertyY.replace('Array', '')]: leftData.childPropertyY && leftData.childPropertyY.includes('Array') ? [data.seriesName] : data.seriesName,
        })
        // this.rowList[index][0].searchData = {
        //   [leftData.childPropertyX && leftData.childPropertyX.replace('Array', '')]: leftData.childPropertyX && leftData.childPropertyX.includes('Array') ? [data.name] : data.name,
        //   [leftData.childPropertyY && leftData.childPropertyY.replace('Array', '')]: leftData.childPropertyY && leftData.childPropertyY.includes('Array') ? [data.seriesName] : data.seriesName,
        // }
        this.getTwoChartData({
          type,
          panelType: panelData.panelType,
          panelId: panelData.panelId,
          configId: panelData.configId,
          uniqueKey,
          ...this.handlerQueryModuleData(this.rowList[index][0].queryData || {}),
          ...this.handlerQueryModuleData(this.rowList[index][1].queryData || {}),
          [leftData.childPropertyX && leftData.childPropertyX.replace('Array', '')]: leftData.childPropertyX && leftData.childPropertyX.includes('Array') ? [data.name] : data.name,
          [leftData.childPropertyY && leftData.childPropertyY.replace('Array', '')]: leftData.childPropertyY && leftData.childPropertyY.includes('Array') ? [data.seriesName] : data.seriesName,
        }).then(res => {
            if (res.data) {
              this.rowList.forEach((row, idx) => {
                if (row.findIndex(chart => chart.uniqueKey == res.data.uniqueKey) !== -1) {
                  this.$set(this.rowList[idx], row.findIndex(chart => chart.uniqueKey == res.data.uniqueKey), {
                    ...res.data,
                    type,
                    isDrill: true
                  })
                }
              })
            } else {
              this.rowList.forEach((row, idx) => {
                if (row.findIndex(chart => chart.isLoading === true) !== -1) {
                  this.$set(this.rowList[idx], row.findIndex(chart => chart.isLoading === true), {
                    panelName: panelData.panelName,
                    panelId: panelData.panelId,
                    configId: panelData.configId,
                    panelType: panelData.panelType,
                    type,
                    isDrill: true,
                    refresh: true
                  })
                }
              })
            }
          }
        ).catch(err => {
          this.rowList.forEach((row, idx) => {
            if (row.findIndex(chart => chart.isLoading === true) !== -1) {
              this.$set(this.rowList[idx], row.findIndex(chart => chart.isLoading === true), {
                panelName: panelData.panelName,
                panelType: panelData.panelType,
              })
            }
          })
        })
      },
      drillDataRight(data, index) {
        let idx = index
        const type = this.rowList[index][1].type
        const uniqueKey = new Date().getTime()
        const panelData = this.rowList[index][1].drillPanels && this.rowList[index][1].drillPanels.length && (this.rowList[index][1].drillPanels.find(item => item.default || item.checked) || this.rowList[index][1].drillPanels[0]) || {}
        this.rowList[index][1].targetDrillData = panelData
        let leftData = JSON.parse(JSON.stringify(this.rowList[index][0]))
        let rightData = JSON.parse(JSON.stringify(this.rowList[index][1]))
        if (this.rowList[index][1].isDrill) {
          this.$set(this.rowList[index][1], 'searchData', {
            [rightData.childPropertyX && rightData.childPropertyX.replace('Array', '')]: rightData.childPropertyX && rightData.childPropertyX.includes('Array') ? [data.name] : data.name,
            [rightData.childPropertyY && rightData.childPropertyY.replace('Array', '')]: rightData.childPropertyY && rightData.childPropertyY.includes('Array') ? [data.seriesName] : data.seriesName,
          })
          // this.rowList[index][1].searchData = {
          //   [rightData.childPropertyX && rightData.childPropertyX.replace('Array', '')]: rightData.childPropertyX && rightData.childPropertyX.includes('Array') ? [data.name] : data.name,
          //   [rightData.childPropertyY && rightData.childPropertyY.replace('Array', '')]: rightData.childPropertyY && rightData.childPropertyY.includes('Array') ? [data.seriesName] : data.seriesName,
          // }
          this.$set(this.rowList[index], 2, {
            isLoading: true,
            uniqueKey,
            panelType: panelData.panelType,
            configId: panelData.panelId,
            panelId: panelData.panelId,
            panelName: panelData.panelName
          })

        } else {
          idx++
          this.$set(this.rowList, index, [leftData])
          this.rowList.splice(index + 1, 0, [{...rightData, isDrill: true}, {
            isLoading: true,
            isDrill: true,
            uniqueKey,
            configId: panelData.panelId,
            panelId: panelData.panelId,
            panelName: panelData.panelName,
            panelType: panelData.panelType,
          }])
          this.$set(this.rowList[idx][0], 'searchData', {
            [rightData.childPropertyX && rightData.childPropertyX.replace('Array', '')]: rightData.childPropertyX && rightData.childPropertyX.includes('Array') ? [data.name] : data.name,
            [rightData.childPropertyY && rightData.childPropertyY.replace('Array', '')]: rightData.childPropertyY && rightData.childPropertyY.includes('Array') ? [data.seriesName] : data.seriesName,
          })
          // this.rowList[idx][0].searchData = {
          //   [rightData.childPropertyX && rightData.childPropertyX.replace('Array', '')]: rightData.childPropertyX && rightData.childPropertyX.includes('Array') ? [data.name] : data.name,
          //   [rightData.childPropertyY && rightData.childPropertyY.replace('Array', '')]: rightData.childPropertyY && rightData.childPropertyY.includes('Array') ? [data.seriesName] : data.seriesName,
          // }
        }
        this.getTwoChartData({
          type,
          uniqueKey,
          panelType: panelData.panelType,
          panelId: panelData.panelId,
          configId: panelData.configId,
          ...this.handlerQueryModuleData(this.rowList[idx][0] && this.rowList[idx][0].queryData || {}),
          ...this.handlerQueryModuleData(this.rowList[idx][1] && this.rowList[idx][1].queryData || {}),
          ...this.handlerQueryModuleData(this.rowList[idx][2] && this.rowList[idx][2].queryData || {}),
          ...this.rowList[idx][0].searchData,
          ...this.rowList[idx][1].searchData
        }).then(res => {
            if (res.data) {
              this.rowList.forEach((row, idx) => {
                if (row.findIndex(chart => chart.uniqueKey == res.data.uniqueKey) !== -1) {
                  this.$set(this.rowList[idx], row.findIndex(chart => chart.uniqueKey == res.data.uniqueKey), {
                    ...res.data,
                    type,
                    isDrill: true
                  })
                }
              })
            } else {
              this.rowList.forEach((row, idx) => {
                if (row.findIndex(chart => chart.isLoading === true) !== -1) {
                  this.$set(this.rowList[idx], row.findIndex(chart => chart.isLoading === true), {
                    panelName: panelData.panelName,
                    panelId: panelData.panelId,
                    configId: panelData.configId,
                    panelType: panelData.panelType,
                    type,
                    isDrill: true,
                    refresh: true
                  })
                }
              })
            }

          }
        ).catch(err => {
          this.rowList.forEach((row, idx) => {
            if (row.findIndex(chart => chart.isLoading === true) !== -1) {
              this.$set(this.rowList[idx], row.findIndex(chart => chart.isLoading === true), {
                panelName: panelData.panelName,
                panelType: panelData.panelType,
              })
            }
          })
        })
      },
      initOrUpdateRowList(n) {
        if (this.initFlag) {
          this.initFlag = false
          this.initRowList(n)
        } else {
          this.initRowList(n)
          // this.updateRowList(n)
        }
      },
      initRowList(n) {
        this.rowList = []
        JSON.parse(JSON.stringify(n)).sort((a, b) => a - b).forEach(item => {
          if (!this.rowList.length) {
            this.rowList.push([{
              isLoading: true,
              configId: item,
              panelName: this.allPanelsData.find(i => i.configId === item) && this.allPanelsData.find(i => i.configId === item).panelName
            }])
          } else {
            if (this.rowList[this.rowList.length - 1].length === 1) {
              this.rowList[this.rowList.length - 1].push({
                isLoading: true,
                configId: item,
                panelName: this.allPanelsData.find(i => i.configId === item) && this.allPanelsData.find(i => i.configId === item).panelName
              },)
            } else {
              this.rowList.push([{
                isLoading: true,
                configId: item,
                panelName: this.allPanelsData.find(i => i.configId === item) && this.allPanelsData.find(i => i.configId === item).panelName
              }])
            }
          }

        })
      },
      updateRowList(n) {
        // 将rowList全部平铺，下钻的3个或者2个看成一个整体，没下钻的看成一个整体，冒泡排序（已经下钻的按照第一个来排序），最后重组rowList
        let flatIdList = JSON.parse(JSON.stringify(n || []))
        const flatRowList = []
        this.rowList.map(item => {
          if (item[0].isDrill) {
            flatRowList.push(item)
          } else {
            item.forEach(i => {
              flatRowList.push(i)
            })
          }
        })
        const newRowList = flatRowList.filter(j => {
          if (Array.isArray(j)) {
            return flatIdList.includes(j[0].configId)
          } else {
            return flatIdList.includes(j.configId)
          }
        })
        flatIdList.forEach(i => {
          if (!flatRowList.find(k => Array.isArray(k) ? k[0].configId === i : k.configId === i)) {
            newRowList.push({
              isLoading: true,
              configId: i,
              panelName: this.allPanelsData.find(i => i.configId === i) && this.allPanelsData.find(i => i.configId === i).panelName
            })
          }
        })
        if (!newRowList.length) {
          this.rowList = []
        } else {
          const list = []
          newRowList.sort((a, b) => ((Array.isArray(a) ? a[0].configId : a.configId) - (Array.isArray(b) ? b[0].configId : b.configId))).forEach(newRow => {
            if (Array.isArray(newRow)) {
              list.push(newRow)
            } else {
              if (list.length) {
                if (list[list.length - 1].length === 1) {
                  list[list.length - 1].push(newRow)
                } else if (list[list.length - 1].length === 2) {
                  list.push([newRow])
                }
              } else {
                list.push([newRow])
              }

            }
          })
          this.rowList = list
        }
      },
      queryFilter(chart) {
        queryFilterUrl({configId: chart.configId, panelId: chart.panelId}).then(res => {
          chart.filterData = res.data || []
        })
      }
      ,
      pushRowList(list) {
        this.panelsData.forEach(item => {
          const data = list.find(i => i.configId === item)
          if (data) {
            if (!this.rowList.length) {
              this.rowList.push([data])
            } else {
              if (this.rowList[this.rowList.length - 1].length === 1) {
                this.rowList[this.rowList.length - 1].push(data)
              } else {
                this.rowList.push([data])
              }
            }
          }
        })
      }
      ,
      queryList(list) {
        const taskQueue = new TaskQueue(5)
        // this.longList = []
        for (let i = 0; i < list.length; i++) {
          if (!this.longList.find(item => item.configId === list[i])) {
            const task = () => this.getTwoChartData({
              configId: list[i],
              type: this.allPanelsData.find(k => k.configId == list[i]) && this.allPanelsData.find(k => k.configId == list[i]).type,
              panelId: this.allPanelsData.find(k => k.configId == list[i]) && this.allPanelsData.find(k => k.configId == list[i]).panelId
            }).then(res => {
              let data
              if (res.data) {
                data = res.data
                data.type = this.allPanelsData.find(k => k.configId == list[i]) && this.allPanelsData.find(k => k.configId == list[i]).type
                !this.longList.find(item => item.configId === data.configId) && this.longList.push(res.data)
              } else {
                data = {
                  type: this.allPanelsData.find(k => k.configId == list[i]) && this.allPanelsData.find(k => k.configId == list[i]).type,
                  configId: list[i],
                  chartDatas: [],
                  panelName: this.allPanelsData.find(item => item.configId === list[i]).panelName
                }
                this.longList.push(data)
              }
              this.rowList.forEach((row, index) => {
                if (row.findIndex(chart => chart.configId === data.configId) !== -1) {
                  this.$set(this.rowList[index], row.findIndex(chart => chart.configId === data.configId), data)
                }
              })
            }).catch(err => {
              const data = {
                configId: list[i],
                chartDatas: [],
                panelName: this.allPanelsData.find(item => item.configId === list[i]).panelName
              }
              this.longList.push(data)
              this.rowList.forEach((row, index) => {
                if (row.findIndex(chart => chart.configId === data.configId) !== -1) {
                  this.$set(this.rowList[index], row.findIndex(chart => chart.configId === data.configId), data)
                }
              })
            })
            taskQueue.addTask(task)
          } else {
            const data = this.longList.find(item => item.configId === list[i])
            this.rowList.forEach((row, index) => {
              if (row.findIndex(chart => chart.configId === data.configId) !== -1) {
                this.$set(this.rowList[index], row.findIndex(chart => chart.configId === data.configId), data)
              }
            })
          }
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .rowCard {
    width: 100%;
    height: 400px;
    display: flex;
    margin-top: 15px;

    .left-card, .right-card {
      flex: 1;
      min-width: 300px;
    }

    .right-card {
      margin-left: 15px;
    }
  }

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
  }

  .left-insert {
    width: 100%;
    height: 50vh;
  }
</style>
