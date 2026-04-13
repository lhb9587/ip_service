<template>
  <div style="padding-bottom: 20px">
    <div class="search-box">
      <div style="display: flex">
        <div class="header">自定义客户数据统计</div>
        <div style="margin-left: 20px">
          <el-breadcrumb class="app-breadcrumb" separator="/" style="line-height: 28px;">
            <transition-group name="breadcrumb">
              <el-breadcrumb-item @click.native="clickBreadcrumb(num)" style="cursor: pointer"
                                  v-for="num in dimensionNum - 1" :key="num">
                {{backupData['data' + num].dimensionList[backupData['data' + num].dimensionIndex].panelName}}
              </el-breadcrumb-item>
              <el-breadcrumb-item style="cursor: pointer" key="3">
                {{dimensionList[dimensionIndex] && dimensionList[dimensionIndex].panelName}}
              </el-breadcrumb-item>
            </transition-group>
          </el-breadcrumb>
        </div>
      </div>
      <el-form size="mini" label-width="80px">
        <el-form-item label="图表名称:">
          <el-input size="mini" placeholder="请填写图表名称" v-model="queryModuleData.statisticsName"></el-input>
        </el-form-item>
        <el-form-item v-if="dimensionNum === 1" label="统计主题:">
          <div class="btns">
            <div v-for="(tab, index) in tabList" :class="tabIndex === index ? 'checkBtn' : ''" :key="index"
                 @click="queryCustomerStatistics(tab, index)">
              {{tab}}
            </div>
          </div>
        </el-form-item>
        <el-form-item v-if="tabIndex === 2" label="来源类型:">
          <div class="btns">
            <div v-for="(active, index) in ['客户活动', '合伙人活动']" :class="activeIndex === index ? 'checkBtn' : ''"
                 :key="index"
                 @click="clickActive(active, index)">
              {{active}}
            </div>
          </div>
        </el-form-item>
        <el-form-item label="统计维度:">
          <div class="btns">
            <div v-for="(dimension, index) in dimensionList" :class="dimensionIndex === index ? 'checkBtn' : ''"
                 :key="index" @click="changeDimension(dimension, index)">
              {{dimension.panelName}}
            </div>
          </div>
        </el-form-item>
        <div class="hide-form" :style="{height: isFormHide ? 0 : '', overflow: isFormHide ? 'hidden' : ''}">
          <el-form-item :label="item.filterName+':'"
                        :class="item.filterType==='radio'&&item.values.length>3?'fullItem':'postInfo-container-item'"
                        v-for="(item, index) in conditionsModuleList" :key="index">

            <div v-if="item.filterType==='select'">
              <div v-if="item.showTile" class="btns">
                <div v-for="(selectItem, selectIndex) in item.values"
                     :key="selectIndex"
                     @click="clickShowTitle(index, selectIndex, item.property, selectItem.id, item.filterType)"
                     :class="clickObj[`click${index}`] === selectIndex ? 'checkBtn' : ''">
                  {{selectItem.value}}
                </div>
              </div>
              <el-select v-else v-model="queryModuleData[item.property]" placeholder="请选择"
                         filterable clearable>
                <el-option v-for="itm in item.values" :key="itm.id" :label="itm.value" :value="itm.id">
                </el-option>
              </el-select>
            </div>

            <div v-if="item.filterType==='selectMany'">
              <el-select v-model="queryModuleData[item.property]" placeholder="请选择"
                         filterable clearable multiple>
                <el-option v-for="itm in item.values" :key="itm.id" :label="itm.value" :value="itm.id">
                </el-option>
              </el-select>
            </div>
            <div v-if="item.filterType==='date'">
              <el-date-picker
                v-model="queryModuleData[item.property]"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
                >
              </el-date-picker>
            </div>

            <div v-if="item.filterType === 'incomeRange'" style="display:flex;">
              <div class="btns" style="flex-shrink: 0;align-items: center">
                <div v-for="(selectItem, selectIndex) in item.values"
                     :key="selectIndex"
                     @click="clickShowTitle(index, selectIndex, item.property, selectItem.id, item.filterType)"
                     :class="clickObj[`click${index}`] === selectIndex ? 'checkBtn' : ''">
                  {{selectItem.value}}
                </div>
              </div>
              <div style="display: flex;gap: 6px;" class="inputRange">
                <el-input placeholder="开始范围" size="mini" v-model="queryModuleData[item.property][0]"
                          @change="changeRange(index)"></el-input>
                至
                <el-input v-model="queryModuleData[item.property][1]" placeholder="结束范围" size="mini"
                          @change="changeRange(index)"></el-input>
                万
              </div>
            </div>

            <div v-if="item.filterType === 'yoyRange'" style="display:flex;">
              <div class="btns" style="flex-shrink: 0;align-items: center">
                <div v-for="(selectItem, selectIndex) in item.values"
                     :key="selectIndex"
                     @click="clickShowTitle(index, selectIndex, item.property, selectItem.id, item.filterType)"
                     :class="clickObj[`click${index}`] === selectIndex ? 'checkBtn' : ''">
                  {{selectItem.value}}
                </div>
              </div>
              <div style="display: flex;gap: 6px;" class="inputRange">
                <el-select v-model="queryModuleData[item.property][0]" placeholder="开始月份" @change="changeRange(index)"
                           filterable clearable>
                  <el-option
                    :disabled="(+itm > +queryModuleData[item.property][1]) && !!queryModuleData[item.property][1]"
                    v-for="itm in monthList" :key="itm" :label="itm" :value="itm">
                  </el-option>
                </el-select>
                至
                <el-select v-model="queryModuleData[item.property][1]" placeholder="结束月份" @change="changeRange(index)"
                           filterable clearable>
                  <el-option :disabled="+queryModuleData[item.property][0] > +itm"
                             v-for="itm in monthList" :key="itm" :label="itm" :value="itm">
                  </el-option>
                </el-select>
                月
              </div>
            </div>

            <div v-if="item.filterType === 'dateMonthRange'" style="display:flex;">
              <div class="btns" style="flex-shrink: 0;align-items: center">
                <div v-for="(selectItem, selectIndex) in item.values"
                     :key="selectIndex"
                     @click="clickShowTitle(index, selectIndex, item.property, selectItem.id, item.filterType)"
                     :class="clickObj[`click${index}`] === selectIndex ? 'checkBtn' : ''">
                  {{selectItem.value}}
                </div>
              </div>
              <DateMonthPicker class="DataPicker" v-model="queryModuleData[item.property]"
                               @change="changeRange(index)"></DateMonthPicker>
            </div>
            <el-select v-if="item.filterType==='selectMultipleMany'" multiple
                       v-model="queryModuleData[item.property]" filterable remote clearable reserve-keyword
                       placeholder="请输入关键词" :remote-method="(queryString)=>{
            remoteMethod(queryString,index,item.property,item.filterName);
            }">
              <el-option v-for="itm in item['valueList']" :key="itm.id" :label="itm.value" :value="itm.id">
              </el-option>
            </el-select>

            <el-multi-cascader
              ref="multiCascader"
              :class="item.property"
              v-if="item.filterType==='cascader'"
              :show-all-levels="false"
              :options="item.values"
              multiple
              filterable
              clearable
              :props="item.props"
              collapse-tags
              change-on-select
              selectChildren
              v-model="queryModuleData[item.property]"></el-multi-cascader>
          </el-form-item>
          <el-form-item label="图表类型:">
            <chart-swiper ref="chartTypeRef" v-if="panelTypeList.length && allList.length"
                          :panelTypeList="panelTypeList"
                          :allList="allList" @changeChart="changeChart"></chart-swiper>
          </el-form-item>
          <el-form-item label="图表描述:">
            <el-input size="mini" placeholder="请输入图表描述" v-model="queryModuleData.memo"></el-input>
          </el-form-item>
        </div>
        <!--        <el-button size="mini" @click="previewChart" type="">预览方案</el-button>-->
        <el-button size="mini" type="" @click="saveConfig">保存方案</el-button>
        <el-button size="mini" type=""
                   v-if="dimensionList[dimensionIndex] && dimensionList[dimensionIndex].childCustomerStatisticsPanelList && dimensionList[dimensionIndex].childCustomerStatisticsPanelList.length"
                   @click="setChildDimension">设置子维度
        </el-button>
        <el-button size="mini" v-if="dimensionNum > 1" @click="goBackDimension">返回上级</el-button>
      </el-form>
      <div v-if="!isFormHide" class="ctrl-btn" @click="hideForm">
        <span class="el-icon-caret-top"></span>
        <div class="text">收起</div>
      </div>
      <div v-else class="ctrl-btn" @click="showForm">
        <span class="el-icon-caret-bottom"></span>
        <div class="text">展开</div>
      </div>

    </div>

    <div class="charts-box">
      <div v-if="dimensionNum > 1">
        <card-chart :configQueryData="queryModuleData" :isConfig="true" class="chart" v-for="item in dimensionNum - 1"
                    :chartData="backupData['data' + item].chartData"></card-chart>
        <card-chart :configQueryData="queryModuleData" :isConfig="true" class="chart"
                    v-if="chartData && chartData.panelId"
                    :chartData="chartData"></card-chart>
      </div>
      <div class="charts" v-else>
        <card-chart :configQueryData="queryModuleData" :isConfig="true" class="chart"
                    v-if="chartData && chartData.panelId"
                    :chartData="chartData" :isCustomer="true"></card-chart>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    addCustomerStatisticsPanelConfig,
    getAllgraph,
    getChartDataUrl, queryCustomerNameIdUrl,
    queryCustomerStatisticsPanel,
    queryPanelTab
  } from "../../../../../api/customerList";
  import ChartSwiper from "./ChartSwiper";
  import {getChartData} from "../../../../../api/dashboard";
  import CardChart from "./CardChart";
  import {queryCustomerNameId} from "../../../../../api/caseList";

  export default {
    name: "ChartConfig",
    components: {
      CardChart,
      ChartSwiper
    },
    data() {
      return {
        isFormHide: false,
        activeIndex: 0,
        custList: [],
        monthList: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
        panelType: '',
        statisticsName: '',
        dimensionNum: 1,
        backupData: {
          data1: {},
          data2: {},
          data3: {}
        },
        chartData: {},
        tabList: [],
        tabIndex: -1,
        dimensionIndex: -1,
        dimensionList: [],
        conditionsModuleList: [],
        defaultQueryData: {},
        queryModuleData: {
          source: undefined,
          custId: [],
          belongToMonth: ['',''],
          havincomeSum: ['', ''],
          belongToDate: ['', ''],
          yoyMonth: ['', ''],
          caseTypeIds: [],
          caseDateMonth: ['', ''],
          wkgId: []
        },
        clickObj: {},
        panelTypeList: [],
        allList: []
      }
    },
    async created() {
      await getAllgraph().then(res => {
        this.allList = res.data
      })
      await queryPanelTab().then(res => {
        this.tabList = res.data
      })
      await this.queryCustomerStatistics(this.tabList[0], 0)
    },
    watch: {
      queryModuleData: {
        handler(newVale) {
          this.$nextTick(() => {
            this.previewChart()
          })
        },
        deep: true
      },
      dimensionIndex: {
        handler() {
        }
      },
    },
    methods: {
      showForm() {
        this.isFormHide = false
      },
      hideForm() {
        this.isFormHide = true
      },
      clickActive(active, index) {
        this.activeIndex = index
        this.queryModuleData.source = active
        queryCustomerStatisticsPanel({
          tab: active
        }).then(res => {
          this.dimensionList = res.data
          this.dimensionList && this.dimensionList.length && this.changeDimension(this.dimensionList[0], 0)
        })
      },
      remoteMethod(value, index, property, filterName) {
        if (value && filterName === "客户") {
          queryCustomerNameId({pageNo: 1, pageSize: 100, keyword: value,mergeCust:this.queryModuleData.mergeCust}).then(
            res => {
              this.custList = this.$commonUtils.unique([...new Set([...res.data.map(item => ({
                id: item.custId,
                value: item.fullname
              })), ...this.custList])], 'id')
              this.$set(
                this.conditionsModuleList[index],
                "valueList",
                this.custList
              );
              this.$forceUpdate();
            }
          );
        }
      },
      saveConfig() {
        if (!this.backupData['data' + this.dimensionNum].panelId) {
          this.saveBackupData()
        }
        if (!this.backupData.data1.queryModuleData.statisticsName) {
          this.$message.error('请填写父维度图表名称!')
          return
        }
        const list = []
        for (let i = 1; i <= 3; i++) {
          if (this.backupData['data' + i].panelId) {
            list.push({
              statisticsName: this.backupData['data' + i].queryModuleData.statisticsName,
              memo: this.backupData['data' + i].queryModuleData.memo,
              panelId: this.backupData['data' + i].panelId,
              panelType: this.backupData['data' + i].panelType,
              customerStatisticsFilterConfigList: this.makeFilterData(this.backupData['data' + i].conditionsModuleList, this.backupData['data' + i].queryModuleData),
            })
          }
        }
        addCustomerStatisticsPanelConfig({customerStatisticsPanelConfigList: list}).then(res => {
          this.$message.success('自定义图表成功！')
          this.$store.commit('app/SET_PANELS_REFRESH', true)
          this.$router.push(`/workbench/customer_statistics/common_solutions`)
          // window.location.reload()
        })
      },
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
      makeFilterData(customerStatisticsFilters, queryModuleData1) {
        const queryModuleData = JSON.parse(JSON.stringify(queryModuleData1))
        let list = []
        for (let key in queryModuleData) {
          if (Array.isArray(queryModuleData[key])) {
            if (!queryModuleData[key].filter(Boolean).length) {

            } else {
              if (key === 'caseTypeIds' || key === 'wkgId') {
                list.push({
                  filterId: customerStatisticsFilters.find(item => item.property === key).id,
                  filterValue: queryModuleData[key].filter(item => item.length === 3).map(item => item[item.length - 1]).join(',')
                })
              } else {
                customerStatisticsFilters.find(item => item.property === key) && list.push({
                  filterId: customerStatisticsFilters.find(item => item.property === key).id,
                  filterValue: queryModuleData[key].join(',')
                })
              }
            }
          } else {
            if (queryModuleData[key] !== '') {
              customerStatisticsFilters.find(item => item.property === key) && list.push({
                filterId: customerStatisticsFilters.find(item => item.property === key).id,
                filterValue: queryModuleData[key]
              })
            }
          }
        }
        return list
      },
      clickBreadcrumb(num) {
        this.dimensionNum = num
        this.makeData()
      },
      changeChart(type) {
        this.panelType = type
        this.previewChart()
      },
      goBackDimension() {
        this.saveBackupData()
        this.dimensionNum--
        this.makeData()
      },
      saveBackupData() {
        this.backupData['data' + this.dimensionNum] = {
          panelId: this.dimensionList[this.dimensionIndex].panelId,
          tabList: this.tabList,
          tabIndex: this.tabIndex,
          dimensionList: this.dimensionList,
          dimensionIndex: this.dimensionIndex,
          conditionsModuleList: this.conditionsModuleList,
          queryModuleData: this.queryModuleData,
          clickObj: this.clickObj,
          panelTypeList: this.panelTypeList,
          allList: this.allList,
          panelType: this.panelType,
          chartData: this.chartData
        }
      },
      makeData() {
        this.tabList = this.backupData['data' + this.dimensionNum].tabList
        this.tabIndex = this.backupData['data' + this.dimensionNum].tabIndex
        this.dimensionList = this.backupData['data' + this.dimensionNum].dimensionList
        this.dimensionIndex = this.backupData['data' + this.dimensionNum].dimensionIndex
        this.conditionsModuleList = this.backupData['data' + this.dimensionNum].conditionsModuleList
        this.conditionsModuleList.forEach((item, outerIndex) => {
          if (item.filterType.includes('Range')) {
            this.defaultQueryData[item.filterType] = ['', '']
          } else if (['selectMultipleMany', 'cascader'].includes(item.filterType)) {
            this.defaultQueryData[item.filterType] = []
          } else {
            this.defaultQueryData[item.filterType] = undefined
          }
        })
        this.queryModuleData = this.backupData['data' + this.dimensionNum].queryModuleData
        this.clickObj = this.backupData['data' + this.dimensionNum].clickObj
        this.panelTypeList = this.backupData['data' + this.dimensionNum].panelTypeList
        this.allList = this.backupData['data' + this.dimensionNum].allList
        this.panelType = this.backupData['data' + this.dimensionNum].panelType

        this.chartData = this.backupData['data' + this.dimensionNum].chartData
        this.$nextTick(() => {
          this.$refs.chartTypeRef.changeChartId(this.panelType)
        })
      },
      setChildDimension() {
        this.saveBackupData()
        this.dimensionNum++
        if (this.backupData['data' + this.dimensionNum].queryModuleData) {
          this.makeData()
        } else {
          this.resetForm(this.dimensionList[this.dimensionIndex])
        }
      },
      async resetForm(dimensionData) {
        this.dimensionList = dimensionData.childCustomerStatisticsPanelList
        this.dimensionList && this.dimensionList.length
        this.dimensionIndex = 0
        this.conditionsModuleList = this.dimensionList[0].customerStatisticsFilters
        this.panelTypeList = this.dimensionList[0].panelType && this.dimensionList[0].panelType.split(',')
        this.panelType = this.allList.find(item => item.id == this.panelTypeList[0]) && this.allList.find(item => item.id == this.panelTypeList[0]).graphType
        // this.queryModuleData = this.defaultQueryData
        this.clickObj = {}
        this.conditionsModuleList.forEach((item, outerIndex) => {
          if (item.filterType.includes('Range')) {
            this.queryModuleData[item.filterType] = ['', '']
            this.defaultQueryData[item.filterType] = ['', '']
          } else if (['selectMultipleMany', 'cascader'].includes(item.filterType)) {
            this.queryModuleData[item.filterType] = []
            this.defaultQueryData[item.filterType] = []
          } else {
            this.queryModuleData[item.filterType] = undefined
            this.defaultQueryData[item.filterType] = undefined
          }
          if (item.defaultValue && item.showTile) {
            let idx = item.values && item.values.findIndex(i => i.id == item.defaultValue)
            idx > -1 && this.clickShowTitle(outerIndex, idx, item.property, item.defaultValue, item.filterType)
          }
        })
      },
      previewChart(panelType) {
        const data = this.handlerQueryModuleData(this.queryModuleData)
        if (this.tabIndex==1) {
          delete data.belongToDate
          delete data.belongToMonth
        }else{
          delete data.caseDate
          delete data.caseDateMonth
        }
        this.$set(this.chartData, 'refresh', false)
        getChartDataUrl({
          panelId: this.dimensionList[this.dimensionIndex] && this.dimensionList[this.dimensionIndex].panelId,
          tab: this.tabList[this.tabIndex],
          panelType: this.panelType || this.allList.find(item => item.id == this.panelTypeList[0]) && this.allList.find(item => item.id == this.panelTypeList[0]).graphType,
          ...data
        }).then(res => {
          if (res.data) {
            this.chartData = res.data
            this.chartData.type = 2
            this.$set(this.chartData, 'refresh', true)
          } else {
            this.chartData = {
              panelName: this.dimensionList[this.dimensionIndex] && this.dimensionList[this.dimensionIndex].panelName
            }
          }
        })
      },
      clickShowTitle(outerIndex, index, property, value, filterType) {
        if (this.clickObj[`click${outerIndex}`] === index && filterType === 'incomeRange') {
          if (['dateMonthRange', 'yoyRange'].includes(filterType)) {
            value = ['', '']
          } else if (['incomeRange'].includes(filterType)) {
            value = ['', '']
          } else {
            value = undefined
          }
          this.$set(this.clickObj, `click${outerIndex}`, 999)
        } else {
          if (['dateMonthRange', 'yoyRange'].includes(filterType)) {
            value = value.split(',').map(item => filterType === 'yoyRange' && item[0] == 0 ? item[1] : item)
          }
          if (['incomeRange'].includes(filterType)) {
            value = [value, '']
          }
          this.$set(this.clickObj, `click${outerIndex}`, index)
        }
        this.$set(this.queryModuleData, property, value)
        // this.$set(this.clickObj, `click${outerIndex}`, index)
      },
      changeRange(index) {
        this.$set(this.clickObj, `click${index}`, 999)
      },
      changeDimension(dimension, index) {
        // if (this.dimensionIndex == index) return
        this.clickObj = {}
        this.dimensionIndex = index
        this.conditionsModuleList = dimension.customerStatisticsFilters
        // this.queryModuleData = this.defaultQueryData
        this.conditionsModuleList.forEach((item, outerIndex) => {
          if (item.filterType.includes('Range')) {
            this.queryModuleData[item.filterType] = ['', '']
            this.defaultQueryData[item.filterType] = ['', '']
          } else if (['selectMultipleMany', 'cascader'].includes(item.filterType)) {
            this.queryModuleData[item.filterType] = []
            this.defaultQueryData[item.filterType] = []
          } else {
            this.queryModuleData[item.filterType] = undefined
            this.defaultQueryData[item.filterType] = undefined
          }
          if (item.defaultValue && item.showTile) {
            // switch (item.defaultValueType) {
            //   case 'string':
            //     break
            //   case 'number':
            //     item.defaultValue = +item.defaultValue
            //     break
            //   case 'stringArray':
            //     item.defaultValue = item.defaultValue && item.defaultValue.split(',') || ['', '']
            //     break
            //   case 'numberArray':
            //
            //     break
            //   default:
            //     break
            // }
            let idx = item.values && item.values.findIndex(i => i.id == item.defaultValue)
            idx > -1 && this.clickShowTitle(outerIndex, idx, item.property, item.defaultValue, item.filterType)
          }
        })
        this.panelTypeList = dimension.panelType && dimension.panelType.split(',')
        this.panelType = this.allList.find(item => item.id == this.panelTypeList[0]) && this.allList.find(item => item.id == this.panelTypeList[0]).graphType
        this.$nextTick(() => {
          this.previewChart()
        })
      },
      async queryCustomerStatistics(tab, index) {
        if (this.tabIndex === index) return
        if (tab === '客户活动') {
          this.clickActive('客户活动', 0)
        } else {
          this.queryModuleData.source = undefined
        }
        this.backupData.data2 = {}
        this.backupData.data3 = {}
        this.tabIndex = index
        await queryCustomerStatisticsPanel({
          tab
        }).then(res => {
          this.dimensionList = res.data
          this.dimensionList && this.dimensionList.length && this.changeDimension(this.dimensionList[0], 0)
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .search-box {
    position: relative;
    min-height: 70px;
    width: 100%;
    margin-top: 15px;
    border: 2px solid #F2F2F2;
    border-bottom: 2px solid #52A0F5;
    border-radius: 5px 5px 0 0;
    padding: 10px;
    .hide-form {
      height: auto;
      transition: all ease-in-out 0.2s;
    }

    .ctrl-btn {
      position: absolute;
      width: 75px;
      height: 22px;
      background-color: #97C6F9;
      color: #fff;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      bottom: -24px;
      left: calc(50% - 33px);
      border-radius: 0 0 10px 10px;

      &:hover {
        background-color: #52A0F5;
      }

      .el-icon-caret-top, .el-icon-caret-bottom {
        font-size: 18px;
      }

      .text {
        margin-left: 5px;
        font-size: 12px;
      }
    }

    .header {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 10px;
    }

    .btns {
      display: flex;

      div {
        cursor: pointer;
        font-size: 13px;
        padding: 0px 20px;
        background-color: #fff;
        margin-right: 15px;
      }

      .checkBtn {
        background-color: #52A0F5;
        color: #fff;
      }
    }
  }

  .charts-box {
    /*height: 30vw;*/
    padding: 15px;
    border: 2px solid #F2F2F2;
    margin: 22px 0;

    .charts {
      display: flex;
      width: 100%;

      .chart {
        flex: 1;
        min-width: 300px;
      }
    }
  }

  .el-form-item {
    margin-bottom: 10px;
  }

  > > > .DataPicker {
    .el-input__inner, .el-date-editor {
      width: 110px;
    }
  }

  > > > .inputRange {
    .el-input__inner {
      width: 110px;
    }
  }

  .datePickerWrap {
    line-height: 28px;
  }
</style>
