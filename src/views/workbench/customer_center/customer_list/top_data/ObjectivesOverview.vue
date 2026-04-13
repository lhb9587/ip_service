<template>
  <div>
    <div class="cust-box">
      <div class="box-top">
        <div class="top-title">目标概述
          <el-tooltip class="item" effect="dark" content="负责客户" placement="right">
            <div style="display: inline-block" @click="openPopHover(1)"><img src="../assets/images/u361.svg" alt=""
                                                                             style="margin-left: 20px;cursor:pointer;">
            </div>
          </el-tooltip>
        </div>
        <el-tooltip class="item" effect="dark" content="负责部门" placement="right">
          <img src="../assets/images/u322.svg" alt=""
               style="width: 90px;margin-top:-10px;cursor: pointer;position:absolute;right: 30px"
               @click="openPopHover(2)">
        </el-tooltip>

        <el-popover
            placement="top-start"
            title="目标概述"
            width="700"
            trigger="hover">
          <svg-icon slot="reference" class="question" icon-class="问题"/>
          <div>
            <p>去年收入：去年下属小组及可见小组负责的客户总收入 + 当前人员作为客户负责人客户去年总收入</p>
            <p>本年目标：去年下属小组及可见小组负责的客户总收入*1.1（或变更分配数据） +
              当前人员作为客户负责人客户预算收入</p>
            <p>本年累计：本年下属小组及可见小组负责的客户总收入</p>
          </div>
        </el-popover>
      </div>
    </div>

    <div class="box-bottom">
      <div style="height: 35px;">
        <span style="font-size: 12px;color: #7F7F7F;display: inline-block;">本年累计</span>
        <span style="font-size: 12px;color: #7F7F7F">/</span>
        <span style="font-size: 12px;color: #7F7F7F">本年目标</span>
      </div>
      <div style="width: 100%;overflow: hidden">
        <span style="font-size: 16px;font-weight: bold;color: #7F7F7F">¥</span>
        <span style="font-size: 18px;font-weight: bold;">{{ Math.round(currentYearSum) | formatAmount }}</span>
        <span style="font-size: 12px;color: #7F7F7F;height: 21px;position: relative;top: -2px;">/</span>
        <span style="font-size: 16px;font-weight: bold;color: #7F7F7F;">¥</span>
        <span
            style="font-size: 16px;font-weight: bold;color: #555555">{{ Math.round(currentYearExpectSum / 10000) }}w</span>
      </div>
      <el-progress style="margin: 10px 0" :text-inside="true" :stroke-width="16"
                   :percentage="+fomatFloat(currentYearSum * 100 / currentYearExpectSum, 2)"></el-progress>

      <!--      <div>-->
      <!--        <span class="el-icon-top right-icon"-->
      <!--              v-if=" currentMonth - yestMonth >= 0"></span>-->
      <!--        <span class="el-icon-bottom right-icon" style="color: #78BF85"-->
      <!--              v-else></span>-->
      <!--        <span class="right-num"-->
      <!--              :style="{color: currentMonth - yestMonth >= 0 ? '#E44D60' : '#78BF85'}">{{fomatFloat((Math.abs(currentMonth - yestMonth) * 100) / yestMonth, 2)}}%</span>-->
      <!--        <span-->
      <!--          style="display: inline-block;margin-left: 20px;font-size: 12px;color: #7F7F7F;margin-top: 10px">与上月相比</span>-->
      <!--      </div>-->
      <div class="hoverBox"
           v-clickoutside="clickoutside"
           v-show="visible"
           :style="{border: visible ? '2px solid #F2F2F2' : 'none' ,height: visible ? '370px' : 0}">
        <div class="charts-top">
          <div>
            <span class="title">去年收入</span>
            <span class="value">{{
                (isNaN(lastIncome) || typeof lastIncome === "undefined") ? 0 : Math.round(lastIncome) | formatAmount
              }}</span>
          </div>
          <div>
            <span class="title">本年目标</span>
            <span class="value">{{ Math.round(currentYearExpectSum) | formatAmount }}</span>
          </div>
          <div>
            <span class="title">本年累计</span>
            <span class="value">{{ Math.round(currentYearSum) | formatAmount }}</span>
          </div>
          <!--          <el-button-group>-->
          <!--            <el-button size="mini" :type="isLastYear ? '' : 'primary'" @click="changeYear(false)">本年</el-button>-->
          <!--            <el-button size="mini" :type="isLastYear ? 'primary' : ''" @click="changeYear(true)">去年</el-button>-->
          <!--          </el-button-group>-->
        </div>
        <div class="chart-left">{{chartType === 1 ? '负责客户' : '负责部门'}}</div>
        <vueChart v-if="status" :autoresize="true" :options="options" theme="ovilia-green"
                  style="height: 300px;width: 800px"></vueChart>
      </div>
      <!--      <img src="../assets/images/u354.png" alt="">-->
    </div>
  </div>
</template>

<script>
import 'echarts'
import vueChart from 'vue-echarts'
import {fomatFloat} from "../../../../../utils/filters";
import {
  queryCustStatistics,
  queryExpectIncomeByMonth, queryGroupExpectIncomeByMonth, queryGroupIncomeByMonth, queryGroupIncomeByYear,
  queryIncomeByMonth,
  queryIncomeByYear
} from "../../../../../api/customerList";

export default {
  name: "ObjectivesOverview",
  props: {},
  components: {
    vueChart
  },
  data() {
    return {
      chartType: 1,
      lastIncome: '',
      isLastYear: false,
      status: false,
      targetLineData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      realityLineData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      expectLineData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      lastYearMonthList: [],
      currentYearMonthList: [],
      currentYearExpectMonthList: [],
      visible: false,
      currentMonth: 100,
      yestMonth: 80,
      currentYearSum: 0,
      currentYearExpectSum: 0,
      options: {}
    }
  },
  created() {
    this.init()
  },
  methods: {
    clickoutside() {
      this.visible = false
    },
    changeYear(status) {
      this.isLastYear = status
      const year = status ? new Date().getFullYear() - 1 : new Date().getFullYear()
      Promise.all([queryIncomeByMonth({year}), queryExpectIncomeByMonth({year}), queryIncomeByYear({year})]).then(res => {
        this.targetLineData = this.targetLineData.map(item => Math.round(res[2].data.expectIncome / 12))
        this.realityLineData = this.realityLineData.map((item, index) => res[0].data[index + 1])
        this.expectLineData = this.expectLineData.map((item, index) => res[1].data[index + 1])
        this.options = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow',
              shadowStyle: {
                shadowOffsetY: '2000'
              }
            }
          },
          legend: {
            type: 'scroll',
            bottom: 'bottom',
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
                  "bar",
                  "stack"
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
          xAxis: [
            {
              type: 'category',
              axisTick: {
                show: false
              },
              data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          grid: {
            bottom: 30,
            top: 30,
            containLabel: true
          },
          series: [
            // {
            //   name: '目标线',
            //   type: 'bar',
            //   data: this.targetLineData,
            //   // color: '#2EC7C9',
            //   lineStyle: {
            //     type: "solid",
            //   }
            // },
            {
              name: '预测收入',
              type: 'bar',
              data: this.expectLineData,
            },
            {
              name: '实际收入',
              type: 'bar',
              data: this.realityLineData,
              // color: '#B6A2DE'
            }
          ]
        }
      })
    },
    init() {
      Promise.all([queryIncomeByMonth({year: new Date().getFullYear()}), queryExpectIncomeByMonth({year: new Date().getFullYear()}), queryIncomeByYear({year: new Date().getFullYear()})]).then(res => {

        this.currentYearSum = res[2].data.income
        this.currentYearExpectSum = res[2].data.expectIncome
        this.lastIncome = res[2].data.lastIncome
        this.targetLineData = this.targetLineData.map(item => Math.round(res[2].data.expectIncome / 12))
        this.currentYearMonthList = res[0].data
        this.realityLineData = this.realityLineData.map((item, index) => res[0].data[index + 1])
        this.expectLineData = this.expectLineData.map((item, index) => res[1].data[index + 1])
        this.currentMonth = this.currentYearMonthList[new Date().getMonth() + 1]
        this.yestMonth = this.currentYearMonthList[new Date().getMonth()]
        this.status = true
        this.options = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow',
              shadowStyle: {
                shadowOffsetY: '2000'
              }
            }
          },
          legend: {
            type: 'scroll',
            bottom: 'bottom',
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
                  "bar",
                  // "stack"
                ]
              },
              saveAsImage: {
                show: false,
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
          xAxis: [
            {
              type: 'category',
              axisTick: {
                show: false
              },
              data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          grid: {
            bottom: 30,
            top: 30,
            containLabel: true
          },
          series: [
            // {
            //   name: '目标线',
            //   type: 'bar',
            //   data: this.targetLineData,
            //   // color: '#2EC7C9',
            //   lineStyle: {
            //     type: "solid",
            //   }
            // },
            {
              name: '预测收入',
              type: 'bar',
              data: this.expectLineData,
            },
            {
              name: '实际收入',
              type: 'bar',
              data: this.realityLineData,
              // color: '#B6A2DE'
            }
          ]
        }
        // this.compareMonthPercent = (this.currentYearMonthList[new Date().getMonth() + 1] - this.currentYearMonthList[new Date().getMonth()]) * 100 / this.currentYearMonthList[new Date().getMonth() + 1] - this.currentYearMonthList[new Date().getMonth()]
      })
    },
    init1() {
      Promise.all([queryGroupIncomeByMonth({year: new Date().getFullYear()}), queryGroupExpectIncomeByMonth({year: new Date().getFullYear()}), queryGroupIncomeByYear({year: new Date().getFullYear()})]).then(res => {

        this.currentYearSum = res[2].data.income
        this.currentYearExpectSum = res[2].data.expectIncome
        this.lastIncome = res[2].data.lastIncome
        this.targetLineData = this.targetLineData.map(item => Math.round(res[2].data.expectIncome / 12))
        this.currentYearMonthList = res[0].data
        this.realityLineData = this.realityLineData.map((item, index) => res[0].data[index + 1])
        this.expectLineData = this.expectLineData.map((item, index) => res[1].data[index + 1])
        this.currentMonth = this.currentYearMonthList[new Date().getMonth() + 1]
        this.yestMonth = this.currentYearMonthList[new Date().getMonth()]
        this.status = true
        this.options = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow',
              shadowStyle: {
                shadowOffsetY: '2000'
              }
            }
          },
          legend: {
            type: 'scroll',
            bottom: 'bottom',
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
                  "bar",
                  // "stack"
                ]
              },
              saveAsImage: {
                show: false,
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
          xAxis: [
            {
              type: 'category',
              axisTick: {
                show: false
              },
              data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          grid: {
            bottom: 30,
            top: 30,
            containLabel: true
          },
          series: [
            // {
            //   name: '目标线',
            //   type: 'bar',
            //   data: this.targetLineData,
            //   // color: '#2EC7C9',
            //   lineStyle: {
            //     type: "solid",
            //   }
            // },
            {
              name: '预测收入',
              type: 'bar',
              data: this.expectLineData,
            },
            {
              name: '实际收入',
              type: 'bar',
              data: this.realityLineData,
              // color: '#B6A2DE'
            }
          ]
        }
        // this.compareMonthPercent = (this.currentYearMonthList[new Date().getMonth() + 1] - this.currentYearMonthList[new Date().getMonth()]) * 100 / this.currentYearMonthList[new Date().getMonth() + 1] - this.currentYearMonthList[new Date().getMonth()]
      })
    },
    openPopHover(type) {
      this.chartType = type
      if (this.visible) return
      if (type === 1) {
        this.init() // 全部数据
      } else {
        this.init1() // 大组数据
      }
      this.visible = !this.visible
      this.$emit('showOne', 'objectOverview', type)
    },
    fomatFloat(number, n = 2) {
      return fomatFloat(number, n)
    },
  }
}
</script>

<style lang="scss" scoped>
.hoverBox {
  background-color: #fff;
  width: 810px;
  transition: height ease-in-out 0.1s;
  position: absolute;
  left: -2px;
  top: 50px;
  z-index: 2;
  .chart-left {
    position: absolute;
    left: 20px;
    width: 20px;
    top: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    font-size: 18px;
    font-weight: bold;
  }
}

.right-num {
  font-size: 14px;
  color: #E44D60;
}

.right-icon {
  font-size: 16px;
  font-weight: bold;
  color: #E44D60;
}

> > > .el-progress-bar__innerText {
  position: absolute;
  left: 5px;
  top: 2px;
  color: #FFF;
  font-size: 12px;
  margin: 0 5px;
}

.cust-box {
  width: 100%;
  height: 60px;
  padding: 15px 15px 0px 15px;
  position: relative;

  .box-top {
    position: relative;
    display: flex;
    flex-direction: column;

    .top-title {
      font-size: 17px;
      font-weight: bold;
      display: flex;
      align-items: flex-end;
    }
  }
}

.box-bottom {
  padding: 0 15px;
  width: 100%;
  height: 110px;
  overflow: hidden;

  img {
    width: 99%;
  }
}

.charts-top {
  height: 40px;
  margin-top: 10px;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: space-around;

  div {
    height: 30px;
    /*border: 1px solid #CDCDCD;*/
    width: 200px;
    color: #999999;
    font-size: 14px;
    display: flex;
    flex-direction: column;
    /*align-items: center;*/
    padding: 0 10px;

    .title {
      font-size: 12px;
    }

    .value {
      font-size: 16px;
      font-weight: bold;
      color: #333;
    }
  }
}

.question {
  position: absolute;
  right: 5px;
  top: 10px;
  cursor: pointer;
}
</style>
