<template>
  <div class="chart-container">
    <div class="chart-header">
      <span>商标类别分布</span>
      <el-popover
        style="display: inline-block;"
        placement="left-start"
        title="商标类别分布"
        width="300"
        trigger="hover"
        content="基于官方公开的商标数据，统计客户的商标申请类别分布">
        <div slot="reference">
          <i class="el-icon-question"></i>
        </div>
      </el-popover>

      <div class="header-right">

        <el-date-picker
          class="chart-date"
          v-model="queryData.startDate"
          :clearable="false"
          type="year"
          placeholder="开始"
          size="mini">
        </el-date-picker>
        <span>-</span>
        <el-date-picker
          class="chart-date"
          v-model="queryData.endDate"
          :clearable="false"
          type="year"
          placeholder="结束"
          size="mini">
        </el-date-picker>

        <div class="chart-detail">
          <i title="数据详情" class="el-icon-tickets"></i>
        </div>
      </div>

    </div>

    <div class="chart-content">
      <img src="../../assets/images/TrademarkCategorys.jpg">
    </div>
  </div>
</template>

<script>
export default {
  name: 'TrademarkCategorys',
  data() {
    return {
      queryData: {
        startDate: '2021',
        endDate: '2022'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.chart-container {
  flex-basis: calc(50% - 10px); /* 默认一行有两个图表，减去间隔宽度 */
  margin: 5px; /* 图表之间的间隔宽度 */
  height: 385px;
  .chart-header {
    margin-top: 5px;
    margin-left: 10px;
    color: #515C88;
    span {
      font-weight: bold;
      margin-right: 10px;
    }
  }
  .header-right {
    display: flex;
    float: right;
    margin-right: 10px;
    .el-select {
      display: flex;
      margin-right: 15px;
    }
    .chart-date {
      width: 100px;
      margin-right: 15px;
      border: 0;
      /deep/ .el-input__inner {
        font-weight: bold;
        color: #515C88;
      }
    }
    .chart-detail {
      width: 38px;
      height: 28px;
      border-radius: 5px;
      padding: 2px 12px;
      background-color: #FFFFFF;
    }
  }
  .chart-content {
    height: 350px;
    background-color: #fff;
    margin: 10px 10px 0 10px;
    border-radius: 15px;
    padding: 20px;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
