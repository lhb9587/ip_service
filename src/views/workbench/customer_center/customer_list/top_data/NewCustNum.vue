<template>
  <div>
    <div class="cust-box">
      <div class="box-top">
        <div class="top-title">新客户数
          <div @click="openPopHover"><img src="../assets/images/u123.svg" alt=""
                                          style="margin-left: 20px;cursor:pointer;"></div>
        </div>
        <div class="top-num">
          <div class="charts-top">
            <div>
              <span class="title">当年新客户</span>
              <span class="value">{{custNumData.newCustCount}}</span>
            </div>
            <div>
              <span class="title">当年来案客户</span>
              <span class="value">{{custNumData.caseCustCount}}</span>
            </div>
            <div>
              <span class="title">重要客户</span>
              <span class="value">{{custNumData.importantCustCount}}</span>
            </div>
            <!--          <el-button-group>-->
            <!--            <el-button size="mini" :type="isLastYear ? '' : 'primary'" @click="changeYear(false)">本年</el-button>-->
            <!--            <el-button size="mini" :type="isLastYear ? 'primary' : ''" @click="changeYear(true)">去年</el-button>-->
            <!--          </el-button-group>-->
          </div>
          <!--          <span class="left-num">{{custNumData.newCustCount}}</span>-->
          <!--          <span class="left-num">{{custNumData.newCustCount}}</span>-->
          <!--          <span class="left-num">{{custNumData.newCustCount}}</span>-->
          <!--          <span class="el-icon-top right-icon"-->
          <!--                v-if="custNumData.newCustCount - custNumData.newCustLastYear >= 0"></span>-->
          <!--          <span class="el-icon-bottom right-icon" style="color: #78BF85"-->
          <!--                v-else></span>-->
          <!--          <span class="right-num"-->
          <!--                :style="{color: custNumData.newCustCount - custNumData.newCustLastYear >= 0 ? '#E44D60' : '#78BF85'}">{{fomatFloat((Math.abs(custNumData.newCustCount - custNumData.newCustLastYear) * 100) / custNumData.newCustLastYear, 2)}}%</span>-->
        </div>
        <el-popover
          placement="top-start"
          title="新客户数"
          width="400"
          trigger="hover">
          <svg-icon slot="reference" class="question" icon-class="问题"/>
          <div>
            <p>当年新客户：“当年首次来案”客户</p>
            <p>当年来案客户：“当年来案”客户</p>
            <p>重要客户：当年账单收入大于20w</p>
          </div>
        </el-popover>
      </div>
    </div>
    <div class="box-bottom">
      <vue-chart theme="ovilia-green" :options="options" style="width: 100%;height: 250px;top: -150px" ref="line"
                 :autoresize="true"></vue-chart>
      <div class="hoverBox"
           v-clickoutside="clickoutside"
           v-show="visible"
           :style="{border: visible ? '2px solid #F2F2F2' : 'none' ,height: visible ? '370px' : 0}">
        <bill-cust-grid></bill-cust-grid>
      </div>
    </div>


  </div>
</template>

<script>
  import {fomatFloat} from "@/utils/filters";
  import 'echarts'
  import vueChart from 'vue-echarts'
  import BillCustGrid from "./BillGrid";

  export default {
    name: "NewCustNum",
    components: {
      BillCustGrid,
      vueChart
    },
    props: {
      custNumData: {}
    },
    data() {
      return {
        visible: false,
        chartData: [],
        chartValue: 0,
        options: {
          tooltip: {
            trigger: 'item'
          },
          legend: {
            orient: 'vertical',
            bottom: '0%',
            right: 'right',
            // doesn't perfectly work with our tricks, disable it
            selectedMode: true
          },
          series: [
            {
              name: '数量',
              type: 'pie',
              radius: ['40%', '70%'],
              center: ['30%', '100%'],
              startAngle: 180,
              label: {
                show: false,
                position: 'center'
                // formatter(param) {
                //   // correct the percentage
                //   return param.name + ' (' + param.percent * 2 + '%)';
                // }
              },
              data: [
                {value: this.custNumData.newCustCount, name: '当年新客户'},
                {value: this.custNumData.caseCustCount, name: '当年来案客户'},
                {value: this.custNumData.importantCustCount, name: '重要客户'},
                {
                  // make an record to fill the bottom 50%
                  value: this.custNumData.newCustCount + this.custNumData.caseCustCount + this.custNumData.importantCustCount,
                  itemStyle: {
                    // stop the chart from rendering this piece
                    color: 'none',
                    decal: {
                      symbol: 'none'
                    }
                  },
                  labelLine: {
                    show: false
                  },
                  label: {
                    show: false,
                    position: 'center'
                  }
                }
              ]
            }
          ]
        }
      }
    },
    created() {
      this.chartData = []
    },
    methods: {
      clickoutside() {
        this.visible = false
      },
      openPopHover() {
        if (this.visible) return
        this.visible = true
        this.$emit('showOne', 'newCust')
      },
      fomatFloat(number, n) {
        return fomatFloat(number, 2)
      },
    }
  }
</script>

<style lang="scss" scoped>
  .cust-box {
    width: 100%;
    height: 85px;
    padding: 15px 15px 0px 15px;
    position: relative;
    z-index: 1;

    .box-top {
      display: flex;
      flex-direction: column;

      .top-title {
        display: flex;
        font-size: 17px;
        font-weight: bold;
      }

      .top-num {
        vertical-align: bottom;
        //margin-top: 10px;
        //
        //.left-num {
        //  font-size: 22px;
        //  font-weight: bold;
        //}
        //
        //.right-icon {
        //  font-size: 16px;
        //  font-weight: bold;
        //  color: #E44D60;
        //}
        //
        //.right-num {
        //  font-size: 14px;
        //  color: #E44D60;
        //}
      }
    }
  }

  .box-bottom {
    width: 100%;
    height: 100px;
    /*overflow: hidden;*/
  }

  .hoverBox {
    background-color: #fff;
    width: 810px;
    transition: height ease-in-out 0.1s;
    position: absolute;
    left: -2px;
    top: 50px;
    z-index: 2;
  }

  .charts-top {
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-around;

    div {
      height: 30px;
      /*border: 1px solid #CDCDCD;*/
      //width: 100px;
      color: #999999;
      font-size: 14px;
      display: flex;
      flex-direction: column;
      /*align-items: center;*/
      //padding: 0 10px;
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
