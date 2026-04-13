<template>
  <div class="chart-container">
    <div class="chart-header">
      <span>案件数量时间分布</span>
      <el-popover
        style="display: inline-block;"
        placement="left-start"
        title="案件数量时间分布"
        width="300"
        trigger="hover"
        content="基于案件数据，统计客户的各个领域的案件数量的时间分布，默认显示最近10年每年的案件数量。默认显示商标领域的数据，可以选择切换查看其它领域的数据。">
        <div slot="reference">
          <i class="el-icon-question"></i>
        </div>
      </el-popover>

      <div class="header-right">
      <el-select class="chart-type" v-model="queryData.type" size="mini" placeholder="请选择">
        <el-option
          v-for="item in typeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>

      <div class="chart-detail">
        <i title="数据详情" class="el-icon-tickets"></i>
      </div>
    </div>

    </div>

    <div class="chart-content">
      <img src="../../assets/images/CaseQuantity.jpg">
    </div>
  </div>
</template>

<script>
export default {
  name: 'CaseQuantity',
  data() {
    return {
      typeOptions: [{
        value: '商标领域',
        label: '商标领域'
      }, {
        value: '诉讼领域',
        label: '诉讼领域'
      }, {
        value: '专利领域',
        label: '专利领域'
      }],
      queryData: {
        type: '商标领域'
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
    .chart-type {
      width: 100px;
      /deep/ .el-input__inner {
        font-weight: bold;
        color: #515C88;
        border: 0;
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
