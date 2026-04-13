<template>
  <div class="home">
    <div class="year-filter">
      <span class="year-label">年份筛选 :</span>
      <el-select v-model="selectedYear" placeholder="选择年份" class="year-select" size="small">
        <el-option
          v-for="year in years"
          :key="year"
          :label="year"
          :value="year">
        </el-option>
      </el-select>
    </div>
    <el-row :gutter="40" v-if="!reload">
      <el-col v-for="item of topCards" :key="item.panelId" :xs="12" :sm="12" :lg="8" class="card-panel-col">
        <template>
          <component :is="'S'+item.panelType" :panel-id="item.panelId" :selected-year="selectedYear"></component>
        </template>
      </el-col>
    </el-row>
    <el-row :gutter="40" v-if="!reload">
      <el-col v-for="item of dataCards" :key="item.panelId" :xs="12" :sm="12" :lg="8" class="card-panel-col">
        <el-card class="homepage-card">
          <GraphRecursion :echart-type="item.panelType" :table-height="280" :panel-id="item.panelId" :overview="true" :selected-year="selectedYear"></GraphRecursion>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import Scard from './echarts/card'
import ScardMult from './echarts/card-mult'
import GraphRecursion from './echarts/GraphRecursion'
export default {
  components: {
    Scard,
    ScardMult,
    GraphRecursion
  },
  props: ['checkList'],
  data() {
    return {
      topCards: [],
      dataCards: [],
      selectedYear: new Date().getFullYear(), // 默认选中当前年份
      years: [], // 年份数组
      reload: false
    }
  },
  created() {
    this.dataInit()
    this.initYears(); // 初始化年份
  },
  watch: {
    selectedYear(newYear) {
      this.reload = true
      setTimeout(() => {
        this.reload = false
      }, 100)
    }
  },
  methods: {
    // 图表列表循环区分类型
    dataInit() {
      this.topCards = []
      this.dataCards = []
      this.checkList.map((item, index) => {
        if (item.panelType == 'card' || item.panelType == 'card-mult'){
          this.topCards.push(item)
        }else{
          this.dataCards.push(item)
        }
      })
    },
    initYears() {
      const currentYear = new Date().getFullYear();
      this.years = Array.from({ length: currentYear - 1998 }, (v, k) => k + 1999).reverse(); // 生成1999至当前年份的数组并反转
    },
  }
}
</script>
<style lang="scss" scoped>
.year-filter {
  display: flex;
  align-items: center; // 垂直居中
  margin-bottom: 10px; // 添加底部间距
}

.year-label {
  margin-right: 10px; // 标签与选择框之间的间距
  font-size: 14px;
  color: #303313;
  // font-weight: bold; // 加粗字体
}

.year-select {
  width: 100px; // 设置选择框宽度
}
.home .el-row .el-col{
  margin-bottom: 20px;
}
.homepage-card{
  height: 395px;
}
</style>
