<template>
  <div>
    <div class="cust-box">
      <div class="box-top">
        <div class="top-title" @click="queryAllList">客户预警</div>
        <div class="top-num" @click="queryAllList">
          <span class="left-num">{{num}}</span>
        </div>
        <el-popover
          placement="top-start"
          title="客户预警"
          width="400"
          trigger="hover">
          <svg-icon slot="reference" class="question" icon-class="问题"/>
          <div>
            <p>预计类型：分为账单收入、案量</p>
            <p>预警规则：按年同比，同比上年同期，支持月份段范围选择，默认勾选本年已过月份</p>
            <p>预警监测：默认监测账单额>20w,案量>10客户</p>
            <p></p>
          </div>
        </el-popover>
      </div>
    </div>
    <div class="box-bottom" @click="queryAllList">
      <img src="../assets/images/u354.png" alt="">
    </div>

    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :visible.sync="warningView"
      width="45%"
      height="80%"
      class="abow_dialog"
    >
      <div slot="title">
        <div>预警信息</div>
      </div>
      <div style="padding: 10px 20px">
        <div style="display: flex;justify-content: left;align-items: center;margin-bottom: 10px">
          <div>
            <span>监测月份: </span>
            <el-select @change="changeMonth" style="width: 100px;margin: 0 5px" size="small" v-model="startMonth"
                       placeholder="监测月份"
                       filterable clearable>
              <el-option :disabled="(+itm > +endMonth) && !!endMonth" v-for="itm in monthList" :key="itm"
                         :label="itm + '月'"
                         :value="itm">
              </el-option>
            </el-select>
            至
            <el-select @change="changeMonth" style="width: 100px;margin: 0 5px" size="small" v-model="endMonth"
                       placeholder="监测月份"
                       filterable clearable>
              <el-option :disabled="+startMonth > +itm"
                         v-for="itm in monthList" :key="itm" :label="itm + '月'" :value="itm">
              </el-option>
            </el-select>
          </div>
          <div v-if="activeName == 1" style="margin-left: 15px">
            <span>监测范围: </span>
            <el-select allow-create @change="() => warningClick(activeName)" style="width: 100px;margin: 0 5px"
                       size="mini" v-model="billAmount"
                       placeholder="监测范围"
                       filterable clearable>
              <el-option v-for="itm in rangeList" :key="itm" :label="itm"
                         :value="itm">
              </el-option>
            </el-select>
            万+
          </div>
          <div v-else style="margin-left: 15px">
            <span>监测案量: </span>
            <el-select allow-create @change="() => warningClick(activeName)" style="width: 100px;margin: 0 5px"
                       size="mini" v-model="caseCount"
                       placeholder="监测案量"
                       filterable clearable>
              <el-option v-for="itm in caseNumList" :key="itm" :label="itm"
                         :value="itm">
              </el-option>
            </el-select>
          </div>
        </div>
        <el-tabs type="border-card" :activeName="activeName" @tab-click="handleClick">
          <el-tab-pane :label="'账单预警(' + warningList1.length + ')'" :name="1">
            <RecycleScroller
              v-if="warningList1.length"
              class="scroller"
              :items="warningList1"
              :item-size="75"
              key-field="id"
              v-slot="{ item }"
            >
              <div class="warning-item" :class="{
            warnLevel1: item.warnLevel === 1,
            warnLevel2: item.warnLevel === 2
          }">
                <div style="">{{item.fullname}}</div>
                <div style="font-size: 12px">
                  <span style="margin-right: 20px" :style="{color: item.warnLevel === 1 ? '#D9001B' : '#F59A23'}">{{item.warnLevel === 1 ? '严重' : '轻度'}}</span>
                  <span>
                账单收入同比减少 <span :style="{color: item.warnLevel === 1 ? '#D9001B' : '#F59A23'}"> {{item.jianshao}}%</span>
              </span>
                  <span style="margin-left: 15px">去年 {{item.lastCount}}</span>
                  <span style="margin-left: 15px">今年 {{item.currentCount}}</span>
                </div>
              </div>
              <div class="line"></div>

            </RecycleScroller>
            <div v-else style="height: 50vh;" class="fl-ac-jc">
              <svg-icon style="width: 100%;height:100%" icon-class="暂无图表"/>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="'案件预警(' + warningList2.length + ')'" :name="2">
            <RecycleScroller
              v-if="warningList2.length"
              class="scroller"
              :items="warningList2"
              :item-size="75"
              key-field="id"
              v-slot="{ item }"
            >
              <div class="warning-item" :class="{
            warnLevel1: item.warnLevel === 1,
            warnLevel2: item.warnLevel === 2
          }">
                <div style="">{{item.fullname}}</div>
                <div style="font-size: 12px">
                  <span style="margin-right: 20px" :style="{color: item.warnLevel === 1 ? '#D9001B' : '#F59A23'}">{{item.warnLevel === 1 ? '严重' : '轻度'}}</span>
                  <span>
                案量同比减少 <span :style="{color: item.warnLevel === 1 ? '#D9001B' : '#F59A23'}"> {{item.jianshao}}%</span>
              </span>
                  <span style="margin-left: 15px">去年 {{item.lastCount}}</span>
                  <span style="margin-left: 15px">今年 {{item.currentCount}}</span>
                </div>
              </div>
              <div class="line"></div>

            </RecycleScroller>
            <div v-else style="height: 50vh;" class="fl-ac-jc">
              <svg-icon style="width: 100%;height:100%" icon-class="暂无图表"/>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import {queryWarningList, queryWarningStatistics} from "../../../../../api/customerList";
  import {RecycleScroller} from 'vue-virtual-scroller'

  export default {
    name: "CustWarning",
    props: {
      // num: {}
    },
    components: {RecycleScroller},
    watch: {},
    data() {
      return {
        caseNumList: [10, 50, 100, 500, 1000],
        billAmount: 10,
        caseCount: 10,
        rangeList: [10, 30, 50, 100, 500],
        startMonth: '1',
        endMonth: new Date().getMonth() + '',
        monthList: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
        activeName: 1,
        monthDate: '',
        num: 0,
        warningView: false,
        chartData: [],
        chartValue: 0,
        warningList1: [],
        warningList2: [],
      }
    },
    created() {
      this.queryNum()
    },
    mounted() {
    },
    methods: {
      async queryAllList() {
        await this.warningClick(1)
        await this.warningClick(2)
        if (this.warningList2.length) {
          this.activeName = 2
        }
        if (this.warningList1.length) {
          this.activeName = 1
        }
      },
      changeMonth() {
        this.warningClick(this.activeName)
      },
      handleClick(tab) {
        if (tab.name == this.activeName) return
        this.activeName = tab.name
        // this.warningClick(this.activeName)
      },
      queryNum() {
        queryWarningStatistics({
          billAmount: this.billAmount * 10000,
          caseCount: this.caseCount
        }).then(res => {
          this.num = res.data.warningCustCount
        })

      },
      async warningClick(activeName) {
        // if (!this.num) return
        await queryWarningList({
          startMonth: this.startMonth,
          endMonth: this.endMonth,
          alarmType: activeName,
          billAmount: this.billAmount * 10000,
          caseCount: this.caseCount + 0
        }).then(res => {
          this['warningList' + activeName] = res.data
          this['warningList' + activeName] = this['warningList' + activeName].map((item, index) => ({
            id: index + 1,
            jianshao: item.jianshao,
            currentCount: item.currentCount,
            lastCount: item.lastCount,
            warnLevel: item.warnLevel,
            warnType: item.warnType,
            fullname: item.fullname
          }))
          this.warningView = true

        })
      },
    }
  }
</script>

<style lang="scss" scoped>
  .cust-box {
    width: 100%;
    height: 85px;
    padding: 15px 15px 0px 15px;

    .box-top {
      display: flex;
      flex-direction: column;

      .top-title {
        font-size: 17px;
        font-weight: bold;
        cursor: pointer;
      }

      .top-num {
        cursor: pointer;
        vertical-align: bottom;
        margin-top: 10px;

        .left-num {
          font-size: 22px;
          font-weight: bold;
        }

        .right-icon {
          font-size: 16px;
          font-weight: bold;
          color: #E44D60;
        }

        .right-num {
          font-size: 14px;
          color: #E44D60;
        }
      }
    }
  }

  .box-bottom {
    width: 100%;
    height: 100px;
    overflow: hidden;
    cursor: pointer;

    img {
      width: 99%;
    }
  }

  .abow_dialog {
    > > > .el-dialog {
      position: absolute;
      top: 50%;
      left: 50%;
      margin: 0 !important;
      transform: translate(-50%, -50%);
      max-height: calc(80%);
      min-height: 400px;
      max-width: calc(100% - 30px);
      display: flex;
      flex-direction: column;
    }

    > > > .el-dialog__header {
      border-bottom: 1px solid #D7D7D7;
    }

    > > > .el-dialog__body {
      overflow: auto;
      padding: 0;
    }
  }

  .scroller {
    /*min-height: 300px;*/
  }

  .warning-item {
    height: 50px;
    margin-top: 15px;
    padding: 5px 10px;
  }

  .warnLevel1 {
    border-left: 5px solid #D9001B;
  }

  .warnLevel2 {
    border-left: 5px solid #F59A23;
  }

  .line {
    height: 10px;
    border-bottom: 1px solid #D7D7D7;
  }

  > > > .vue-recycle-scroller__item-wrapper {
    /*min-height: 50px;*/
  }

  > > > .vue-recycle-scroller__item-view {
    /*will-change: transform!important;*/
    will-change: unset !important;
  }

  > > > .el-tabs__content {
    padding-top: 0;
    max-height: 60vh;
    min-height: 60vh;
    overflow: auto;
  }
  .question {
    position: absolute;
    right: 5px;
    top: 10px;
    cursor: pointer;
  }
</style>
