<template>
  <div class="chart-container">
    <div class="chart-header">
      <span>商标品牌分布</span>
      <el-popover
        style="display: inline-block;"
        placement="left-start"
        title="商标品牌分布"
        width="300"
        trigger="hover"
        content="基于官方公开的商标数据，统计客户的各商标品牌下的商标数量，默认显示其商标数量最多的十个品牌">
        <div slot="reference">
          <i class="el-icon-question"></i>
        </div>
      </el-popover>

      <div class="header-right">
        <el-date-picker
          class="chart-date"
          v-model="queryData.date"
          :clearable="false"
          type="monthrange"
          range-separator="-"
          start-placeholder="开始"
          end-placeholder="结束"
          size="mini">
        </el-date-picker>

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
      <img src="../../assets/images/TrademarkBrands.jpg">
    </div>
  </div>
</template>

<script>
export default {
  name: 'TrademarkBrands',
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
        type: '商标领域',
        date: ['2023-01','2023-07']
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
      width: 200px;
      margin-right: 15px;
      border: 0;
      /deep/ .el-range-input {
        font-weight: bold;
        color: #515C88;
      }
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
