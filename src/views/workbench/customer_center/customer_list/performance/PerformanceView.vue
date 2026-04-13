<template>
  <div class="performance-info">
    <div class="base-header">
<!--      <div class="header-left">-->
<!--        <span class="left-line"></span>-->
<!--        <span class="right-text">业绩数据</span>-->
<!--      </div>-->
      <div class="header-right">
        <el-date-picker
          @change="changeDate"
          size="mini"
          class="date-border"
          v-model="startYear"
          format="yyyy"
          value-format="yyyy"
          type="year"
          placeholder="开始"
          clearable
          :picker-options="pickerStartAuditYear"
        ></el-date-picker>
        <span style="color: #AAAAAA">至</span>
        <el-date-picker
          @change="changeDate"
          size="mini"
          class="date-border"
          v-model="endYear"
          format="yyyy"
          value-format="yyyy"
          type="year"
          placeholder="结束"
          clearable
          :picker-options="pickerEndAuditYear"
        ></el-date-picker>
      </div>
    </div>

    <div class="charts" v-for="(item, index) in yearList" :key="index">
      <div class="left-data">
        <div class="top">
          <div class="year" style="border: 1px solid #fff;">
            <span class="left-line"></span>
            <span class="right-text">{{item.year}}</span>
          </div>
          <div class="bill">
            <div class="title">账单收入
              <el-popover
                placement="top-start"
                title="账单收入"
                width="400"
                trigger="hover">
                <svg-icon slot="reference" class="question" icon-class="问题"/>
                <div v-html="billDesc"></div>
              </el-popover>
            </div>
            <div class="mount">
              <span v-if="item.billAmount">{{item.billAmount | formatAmount}}</span>
              <span style="color: #AAAAAA" v-else>无</span>
            </div>
            <div class="num" v-if="item.year != new Date().getFullYear()">
              <div>同比</div>
              <div :style="{color: item.billTongbi >= 0 ? '#E44D60' : '#78BF85'}">
                <span v-if="typeof item.billTongbi === 'number' && item.billTongbi !== 0">
                  {{item.billTongbi}}%
                </span>
                <span style="color: #AAAAAA" v-else>无</span>
              </div>
            </div>
          </div>
        </div>
        <div class="bottom">
          <div class="bill">
            <div class="title">案件数量</div>
            <div class="mount">
              <span v-if="item.caseCount">{{item.caseCount}}</span>
              <span style="color: #AAAAAA" v-else>无</span>
            </div>
            <div class="num" v-if="item.year != new Date().getFullYear()">
              <div>同比</div>
              <div :style="{color: item.caseTongbi >= 0 ? '#E44D60' : '#78BF85'}">
                <span v-if="typeof item.caseTongbi === 'number' && item.caseTongbi !== 0">{{item.caseTongbi}}%</span>
                <span style="color: #AAAAAA" v-else>无</span>
              </div>
            </div>
          </div>
          <div class="bill">
            <div class="title">
              案件胜率
              <el-popover
                placement="top-start"
                title="案件胜率"
                width="400"
                trigger="hover">
                <svg-icon slot="reference" class="question" icon-class="问题"/>
                <div v-html="shenglvDesc"></div>
              </el-popover>
            </div>
            <div class="mount">
              <span v-if="item.shenglv">{{item.shenglv}}%</span>
              <span style="color: #AAAAAA" v-else>无</span>
            </div>
            <div class="num" v-if="item.year != new Date().getFullYear()">
              <div>同比</div>
              <div :style="{color: item.shenglvTongbi >= 0 ? '#E44D60' : '#78BF85'}">
                <span
                  v-if="typeof item.shenglvTongbi === 'number' && item.shenglvTongbi !== 0">{{item.shenglvTongbi}}%</span>
                <span style="color: #AAAAAA" v-else>无</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="center-chart">
        <vueChart theme="ovilia-green" v-if="status" :autoresize="true" :options="computedBillData(item.year)"
                  style="height: 210px;width: 95%;"></vueChart>
        <a title="全屏">
          <svg-icon class="chart-icon chart-enlarge" icon-class="全屏" @click="fullScreenChart(item.options)"/>
        </a>
      </div>
      <div class="right-chart">
        <vueChart theme="ovilia-green" v-if="status" ref="rightChart" :autoresize="true" :options="item.options"
                  @click="(e) => clickChart(e, item.year, index)"
                  style="height: 210px;width: 100%;"></vueChart>
        <a title="全屏">
          <svg-icon class="chart-icon chart-enlarge" icon-class="全屏" @click="fullScreenChart(item.options)"/>
        </a>
      </div>
    </div>

    <!--  全屏chart  -->
    <el-dialog append-to-body style="height: 100vh;" :visible.sync="dialog" fullscreen :show-close="false">
      <el-button size="mini" @click="dialog = false">关闭全屏</el-button>
      <div class="fl-ac-jc">
        <vueChart style="width: 100vw;height: 80vh;" v-show="dialogOption" :autoresize="true" theme="ovilia-green"
                  :options="dialogOption"/>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import 'echarts'
  import vueChart from 'vue-echarts'
  import {queryBillAndCase, queryBillGroupbyCaseType, queryBillGroupbyDomain} from "../../../../../api/customerList";

  export default {
    name: "PerformanceView",
    props: {
      editStatus: {
        type: Boolean,
        default: false
      },
      custId: {}
    },
    components: {vueChart},
    data() {
      return {
        billDesc: '1.财务审核前的全部账单收入（包括状态待财务审核和已完成）' +
          '<br />2.账单收入=账单总金额-账单官费=账单服务费+杂费',
        shenglvDesc: '1.官方通知类型是裁定-赢，裁定-部分，裁定-输，评审裁定-部分，评审裁定-输' +
          '<br />2.收文日期在该时间范围内，赢+部分/全部的比率',
        dialogOption: null,
        dialog: false,
        startYear: '',
        endYear: '',
        pickerStartAuditYear: {
          disabledDate: time => {
            if (this.endYear) {
              return time.getFullYear() > this.endYear
            }
          }
        },
        pickerEndAuditYear: {
          disabledDate: time => {
            return time.getFullYear() < this.startYear || time.getFullYear() > new Date().getFullYear()
          }
        },
        caseTypeBillData: [],
        status: false,
        domainBillData: {},
        compareYearData: [],
        yearList: []
      }
    },
    created() {
      this.init()
    },
    methods: {
      fullScreenChart(options) {
        this.dialogOption = options
        this.dialog = true
      },
      changeDate() {
        if (this.startYear && this.endYear) {
          this.init(true)
        }
      },
      clickChart(event, year, index) {
        if (event.name === '其他') {
          let list = []
          list = JSON.parse(JSON.stringify(this.caseTypeBillData)).filter(item => item.year === year).map(item => ({
            value: item.billAmount,
            name: item.caseType
          }))
          this.yearList[index].options = {
            title: {
              text: '分案件类型账单收入占比',
              textStyle: {
                // fontWeight: 'normal',
                fontSize: 16
              }
            },
            tooltip: {
              trigger: 'item',
              formatter: '{b}: {c} ({d}%)' // 展示格式
            },
            grid: {
              top: '40%',
              // left: '3%',
              // right: '2%',
              // bottom: '3%',
            },
            legend: {
              type: 'scroll',
              top: '10%',
              left: 'auto',
              orient: 'vertical'
            },
            series: [
              {
                name: '账单金额',
                type: 'pie',
                radius: ['25%', '50%'],
                center: ['60%', '60%'],
                avoidLabelOverlap: false,
                emphasis: {
                  itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                },
                label: {
                  normal: {
                    position: 'outside', // 设置标签向外
                    formatter: '{b}: {c} ({d}%)' // 设置标签格式
                  }
                },
                labelLine: {
                  show: true
                },
                data: list
              }
            ]
          }
          this.$forceUpdate()
        }
      },
      computedCaseBillData(year) {
        let list = []
        list = JSON.parse(JSON.stringify(this.caseTypeBillData)).filter(item => item.year === year).map(item => ({
          value: item.billAmount,
          name: item.caseType
        }))
        const addValue = () => {
          let sum = 0
          list.forEach(item => {
            sum += item.value
          })
          return sum
        }
        let data1, data2
        if (list && list.length >= 10) {
          data1 = list.slice(0, 9)
          data1.push({
            name: '其他',
            value: addValue()
          })
        } else {
          data1 = list
        }
        return {
          title: {
            text: '分案件类型账单收入占比',
            textStyle: {
              // fontWeight: 'normal',
              fontSize: 16
            }
          },
          tooltip: {
            trigger: 'item',
            formatter: '{b}: {c} ({d}%)' // 展示格式
          },
          grid: {
            top: '40%',
            // left: '3%',
            // right: '2%',
            // bottom: '3%',
          },
          legend: {
            type: 'scroll',
            top: '10%',
            left: 'auto',
            orient: 'vertical'
          },
          series: [
            {
              name: '账单金额',
              type: 'pie',
              radius: ['25%', '50%'],
              center: ['60%', '60%'],
              avoidLabelOverlap: false,
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              },
              label: {
                normal: {
                  position: 'outside', // 设置标签向外
                  formatter: '{b}: {c} ({d}%)' // 设置标签格式
                }
              },
              labelLine: {
                show: true
              },
              data: data1
            }
          ]
        }
      },
      computedBillData(year) {
        if (!this.status) return {}
        const data = this.domainBillData.filter(item => item.year === year).map(item => ({
          value: item.billAmount,
          name: item.caseType
        }))
        return {
          title: {
            text: '领域账单收入占比',
            textStyle: {
              // fontWeight: 'normal',
              fontSize: 16
            },
          },
          tooltip: {
            trigger: 'item',
            formatter: '{b}: {c} ({d}%)' // 展示格式
          },
          grid: {
            top: '40%',
            // left: '3%',
            //
            // right: '2%',
            // bottom: '3%',
          },
          legend: {
            type: 'scroll',
            top: '10%',
            left: 'auto',
            orient: 'vertical'
          },
          series: [
            {
              name: '账单金额',
              type: 'pie',
              radius: ['25%', '50%'],
              center: ['60%', '60%'],
              avoidLabelOverlap: false,
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              },
              label: {
                normal: {
                  position: 'outside', // 设置标签向外
                  formatter: '{b}: {c} ({d}%)' // 设置标签格式
                }
              },
              labelLine: {
                show: true
              },
              data: data
            }
          ]
        }
      },
      init(flag) { // flag为true，不针对去年空账单做数据过滤
        Promise.all([
          queryBillGroupbyCaseType({
            custId: this.custId,
            startYear: this.startYear || undefined,
            endYear: this.endYear || undefined,
          }),
          queryBillGroupbyDomain({
            custId: this.custId,
            startYear: this.startYear || undefined,
            endYear: this.endYear || undefined,
          }),
          queryBillAndCase({
            custId: this.custId,
            startYear: this.startYear || undefined,
            endYear: this.endYear || undefined,
          })
        ]).then(res => {
          // this.compareYearData = res[2].data
          this.yearList = res[2].data
          this.yearList.pop()
          if (!flag) {
            if (!this.yearList[1].billAmount) {
              this.yearList = [this.yearList[0]]
              this.startYear = this.yearList[0].year + ''
              this.endYear = this.yearList[0].year + ''
            } else {
              this.startYear = this.yearList[this.yearList.length - 1].year + ''
              this.endYear = this.yearList[0].year + ''
            }
          }
          this.domainBillData = res[1].data
          this.caseTypeBillData = res[0].data
          this.yearList.forEach(item => {
            item.options = this.computedCaseBillData(item.year)
          })
          this.status = true
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .charts {
    display: flex;
    /*width: auto;*/
    margin: 10px;
    height: 230px;
    background-color: #fff;
    border-radius: 5px;

    .left-data {
      flex: 1;
      display: flex;
      flex-direction: column;

      .top, .bottom {
        width: 100%;
        height: 50%;
        display: flex;

        .year, .bill {
          flex: 1;
          margin: 10px;
          border: 1px solid #AAAAAA;
          border-radius: 3px;
        }

        .year {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 5px;
        }

        .bill {
          display: flex;
          flex-direction: column;
          padding: 5px;
          justify-content: space-around;

          .title, .num {
            font-size: 14px;
            color: #AAAAAA;
          }

          .mount {
            font-size: 18px;
          }

          .num {
            display: flex;
            justify-content: space-between;
          }
        }

        .left-line {
          display: flex;
          align-items: center;
          width: 8px;
          height: 30px;
          background-color: #409EFF;
          margin-right: 10px;
        }

        .right-text {
          display: flex;
          align-items: center;
          font-size: 38px;
          font-weight: 700;
        }
      }

      .bottom {
        width: 100%;
        height: 50%;
        display: flex;
      }
    }

    .center-chart {
      flex: 1;
      margin: 10px;
      border: 1px solid #AAAAAA;
      border-radius: 3px;
      position: relative;
    }

    .right-chart {
      flex: 1;
      margin: 10px;
      border: 1px solid #AAAAAA;
      border-radius: 3px;
      position: relative;
      /*background-color: pink;*/
    }
  }


  .performance-info {
    /*background-color: #fff;*/
    /*padding: 10px 15px;*/

    .el-button {
      float: right;
    }

    .base-header {
      padding: 10px 15px;
      background-color: #fff;
      display: flex;

      .header-left {
        display: flex;
        align-items: center;

        .left-line {
          display: inline-block;
          width: 10px;
          height: 26px;
          background-color: #409EFF;
          margin-right: 10px;
        }

        .right-text {
          font-weight: bold;
        }
      }

      .header-right {
        align-items: center;
        justify-content: space-between;
      }

    }
  }

  .date-border {
    /deep/ .el-input__inner {
      border: 1px solid #fff;
      font-size: 14px;
      color: #000000;
      /*padding-left: 0;*/

      &:hover {
        border-radius: 0;
        border-bottom: 1px solid #f2f2f2;
      }
    }
  }

  .chart-enlarge {
    color: #aeaeae;
    position: absolute;
    top: 5px;
    right: 0;
  }

  > > > .el-dialog__header {
    padding: 0;
  }
</style>
