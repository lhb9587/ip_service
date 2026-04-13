<template>
  <div>
    <div v-allow="494" class="performance-info" style="margin-bottom: 10px;">
      <!--      <el-button size="mini" type="primary" @click="addwfContact">导出</el-button>-->
      <FileSystem :custId="custId"></FileSystem>
    </div>
    <div style="display: flex;justify-content: flex-end;background-color: #fff;padding: 5px 15px 5px 0;">
      <el-button v-if="!isExport" type="primary" size="mini" @click="isExport = true">导出</el-button>
      <el-button v-if="isExport" type="primary" size="mini" @click="isExport = false">取消导出</el-button>
      <el-button v-if="isExport" type="primary" size="mini" @click="submitExport('pdf')" style="margin-right: 15px;">导出PDF</el-button>
      <el-button v-if="isExport" type="primary" size="mini" @click="submitExport('ppt')" style="margin-right: 15px;">导出PPT</el-button>
    </div>
    <div class="base-content">
      <Charts :check-list="checkList" :isExport="isExport"/>
      <!--      <Applicant></Applicant>-->
      <!--      <CaseQuantity></CaseQuantity>-->
      <!--      <CaseTypes></CaseTypes>-->
      <!--      <TrademarkBrands></TrademarkBrands>-->
      <!--      <TrademarkCategorys></TrademarkCategorys>-->
    </div>
  </div>
</template>

<script>
  import Bus from '@/utils/Bus'
  import 'echarts'
  import vueChart from 'vue-echarts'
  import {queryBillAndCase, queryBillGroupbyCaseType, queryBillGroupbyDomain} from "../../../../../api/customerList";
  import Applicant from './charts/Applicant'
  import CaseQuantity from './charts/CaseQuantity'
  import CaseTypes from './charts/CaseTypes'
  import TrademarkBrands from './charts/TrademarkBrands'
  import TrademarkCategorys from './charts/TrademarkCategorys'
  import Charts from "../../../dashboard/components/Charts";
  import {getAllPanels} from "@/api/dashboard";
  import FileSystem from '@/views/workbench/customer_center/customer_list/customer_reports/file-system/index.vue'

  export default {
    name: "CustomerReports",
    props: {
      editStatus: {
        type: Boolean,
        default: false
      },
      custId: {}
    },
    components: {
      Charts,
      vueChart,
      Applicant,
      CaseQuantity,
      CaseTypes,
      TrademarkBrands,
      TrademarkCategorys,
      FileSystem
    },
    data() {
      return {
        isExport: false,
        checkList: [
          // {
          //   panelId: 921,
          //   panelType: 'bar',
          //   hasItem: 1,
          //   visible: 1,
          //   charts: [{
          //     custId: this.custId,
          //     panelId: 921,
          //     panelType: 'bar',
          //     hasItem: 1,
          //     visible: 1,
          //   }]
          // },
          // {
          //   panelId: 922,
          //   panelType: 'bar-grouped',
          //   hasItem: 1,
          //   visible: 1,
          //   charts: [{
          //     custId: this.custId,
          //     panelId: 922,
          //     panelType: 'bar-grouped',
          //     hasItem: 1,
          //     visible: 1,
          //   }]
          // },
          // {
          //   panelId: 923,
          //   panelType: 'pie',
          //   hasItem: 1,
          //   visible: 1,
          //   charts: [{
          //     custId: this.custId,
          //     panelId: 923,
          //     panelType: 'pie',
          //     hasItem: 1,
          //     visible: 1,
          //   }]
          // },
          // {
          //   panelId: 924,
          //   panelType: 'bar',
          //   hasItem: 1,
          //   visible: 1,
          //   charts: [{
          //     custId: this.custId,
          //     panelId: 924,
          //     panelType: 'bar',
          //     hasItem: 1,
          //     visible: 1,
          //   }]
          // },
          // {
          //   panelId: 925,
          //   panelType: 'bar',
          //   hasItem: 1,
          //   visible: 1,
          //   charts: [{
          //     custId: this.custId,
          //     panelId: 925,
          //     panelType: 'bar',
          //     hasItem: 1,
          //     visible: 1,
          //   }]
          // },
          // {
          //   panelId: 926,
          //   panelType: 'pie',
          //   hasItem: 1,
          //   visible: 1,
          //   charts: [{
          //     custId: this.custId,
          //     panelId: 926,
          //     panelType: 'pie',
          //     hasItem: 1,
          //     visible: 1,
          //   }]
          // },
          // {
          //   panelId: 927,
          //   panelType: 'pie',
          //   hasItem: 1,
          //   visible: 1,
          //   charts: [{
          //     custId: this.custId,
          //     panelId: 927,
          //     panelType: 'pie',
          //     hasItem: 1,
          //     visible: 1,
          //   }]
          // },
          // {
          //   panelId: 928,
          //   panelType: 'bar-grouped',
          //   hasItem: 1,
          //   visible: 1,
          //   charts: [{
          //     custId: this.custId,
          //     panelId: 928,
          //     panelType: 'bar-grouped',
          //     hasItem: 1,
          //     visible: 1,
          //   }]
          // },
          // {
          //   panelId: 929,
          //   panelType: 'pie',
          //   hasItem: 1,
          //   visible: 1,
          //   charts: [{
          //     custId: this.custId,
          //     panelId: 929,
          //     panelType: 'pie',
          //     hasItem: 1,
          //     visible: 1,
          //   }]
          // },
        ],
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
      // this.init()
      getAllPanels({
        belongToTab: '客户报告',
        belongToMenu: '案量'
      }).then(res => {
        this.checkList = res.data.map(item => ({
          panelId: item.panelId,
          hasItem: 1,
          visible: 1,
          charts: [{
            custId: this.custId,
            panelId: item.panelId,
            panelType: item.panelType,
            hasItem: 1,
            visible: 1
          }]
        }))
        // panelId: 921,
        //   panelType: 'bar',
        //   hasItem: 1,
        //   visible: 1,
        //   charts: [{
        //   custId: this.custId,
        //   panelId: 921,
        //   panelType: 'bar',
        //   hasItem: 1,
        //   visible: 1,
        // }]
      })
    },
    methods: {
      submitExport(type) {
        // 导出图表逻辑
        Bus.$emit('export', () => this.isExport = false, type)

      },
      changeDate() {
        if (this.startYear && this.endYear) {
          this.init()
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
      init() {
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
  .base-content {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    background-color: #F2F2F2;
    padding: 10px 0 10px 10px
  }

  > > > .el-table1 {
    /*height: auto;*/

    .cell {
      max-height: 70px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      overflow: hidden;
    }
  }

  > > > .header-table {
    margin-top: 10px;
    padding: 0 0 0 15px;

    .el-table__header-wrapper {
      border: 1px solid #EBEEF5;
      border-bottom: none;

      th {
        background-color: #FAFAFA;
        font-size: 16px;
        color: #555555;
        font-weight: normal;
      }
    }
  }

  .performance-info {
    background-color: #fff;
    padding: 0;

    .el-button {
      float: right;
    }

    .base-header {
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

  .form-border {
    /deep/ .el-row {
      margin: 0px;
    }

    /deep/ .postInfo-container-item {
      width: 100%;
    }

    /deep/ .el-form-item__label {
      background-color: #f9f9f9;
      width: 30%;
      text-align: center;
    }

    /deep/ .el-form-item {
      display: flex;
      border-right: 1px solid #d7d7d7;
      margin: 0px !important;
    }

    /deep/ .el-row {
      border-bottom: 1px solid #d7d7d7;
    }

    /deep/ .el-input,
    /deep/ .el-select {
      width: 70%;
    }

    /deep/ .el-form-item__content {
      flex: 1;
      text-align: center;
      /*height: 30px;*/
      margin-left: 0 !important;
    }

    .fullRow {
      /deep/ .el-form-item__label {
        width: 15%;
      }

      /deep/ .el-input,
      /deep/ .el-select {
        width: 100%;
      }
    }

    /deep/ .el-input__inner {
      border: none;
    }

    /deep/ .el-select .el-input {
      width: 100%;
    }

    border-top: 1px solid #d7d7d7;
    border-left: 1px solid #d7d7d7;
    // border-bottom: 1px solid #d7d7d7;
  }

  /deep/ .el-col.el-col-12 {
    .el-cascader {
      width: 100%;

      .el-input {
        width: 100%;
      }
    }
  }

  > > > .el-dialog {
    margin-top: 5vh !important;
  }

  > > > .el-dialog__body {
    padding-top: 0;
    padding-bottom: 0;
    max-height: 500px;
    overflow: auto;
  }

  /deep/ .el-form-item__content {
    text-align: center;

    .el-form-item__error {
      position: relative;
      text-align: left;
      left: 0;
      top: 0;
    }
  }
</style>
