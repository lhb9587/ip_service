<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <i class="el-icon-d-caret"></i>
      <span>设置默认下钻图表</span>
    </div>
    <div v-for="(item, index) in drills" :key="index" class="text item" :class="{active: index === drillIndex }" @click="selectDrillChart(index)">
      {{ item.panelName }}
      <i v-if="index === drillIndex" class="el-icon-check"></i>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'SetDrill',
  props: ['drills','dIndex','name','panelId'],
  data() {
    return {
      drillIndex: this.dIndex
    }
  },
  created() {
  },
  methods: {
    selectDrillChart(index) {
      // 如果切换图表，下级图表将会重置
      if (this.drillIndex != index){
        this.$emit('resetDirllChart')
      }
      this.drillIndex = index
      // 图表默认下钻保存

      if (JSON.parse(localStorage.getItem('queryModuleData'))) {
        var arr = JSON.parse(localStorage.getItem('queryModuleData'))
      } else {
        var arr = []
      }
      const chartSearch = {
        panelId: this.panelId,
        drillIndex: this.drillIndex,
        queryModuleData: []
      }
      // 判断本地是否存在图表搜索缓存
      if (arr.find(item => item.name == this.name)){
        // 判断是否该图表id是否存在搜索条件
        var panelData = arr.find(item => item.name == this.name).chartArr.find(item => item.panelId == this.panelId)
        if (panelData) {
          arr.find(item => item.name == this.name).chartArr.find(item => item.panelId == this.panelId).drillIndex = this.drillIndex
        }else{
          arr.find(item => item.name == this.name).chartArr.push(chartSearch)
        }
      } else {
        arr.push({name: this.name, chartArr: [ chartSearch ] })
      }
      localStorage.setItem('queryModuleData', JSON.stringify(arr))
      this.$emit('setDirllChart', this.drillIndex)
    }
  }
}
</script>

<style lang="scss" scoped>
.text {
  font-size: 14px;
}

.item {
  padding: 18px 0;
  overflow-y: auto;
  .el-icon-check {
    padding-left: 20px;
  }
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}
.box-card {
  width: 70%;
  height: 240px;
  margin: 20px auto;
  /deep/ .el-card__body{
    height: 190px;
    overflow-y: auto;
    display: block !important;
  }
  .active{
    color: #66b1ff;
  }
}
</style>
