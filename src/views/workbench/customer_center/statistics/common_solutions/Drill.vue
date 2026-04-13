<template>
  <div class="box-card1">
    <el-card class="">
      <div slot="header" class="clearfix">
        <i class="el-icon-d-caret"></i>
        <span>设置默认下钻图表</span>
      </div>
      <div v-for="(item, index) in drills" :key="index" class="text item" :class="{active: index === drillIndex }"
           @click="selectDrillChart(index)">
        {{ item.panelName }}
        <i v-if="index === drillIndex" class="el-icon-check"></i>
      </div>
    </el-card>
  </div>

</template>

<script>
  export default {
    name: "Drill",
    props: {
      drills: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {
        drillIndex: 0
      }
    },
    created() {
      if (this.drills && this.drills.findIndex(item => item.default === 1 || item.checked) !== -1) {
        this.drillIndex = this.drills.findIndex(item => item.default || item.checked)
      }
      this.drills.forEach((item, idx) => {
        if (idx === this.drillIndex) {
          item.checked = true
        } else {
          item.checked = false
        }
      })
    },
    methods: {
      selectDrillChart(index) {
        this.drillIndex = index
        this.drills.forEach((item, idx) => {
          if (idx === index) {
            item.checked = true
          } else {
            item.checked = false
          }
        })
        this.$emit('changeDrillIndex', index)
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
    padding-left: 10px;
    overflow-y: auto;
    cursor: pointer;

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

  .box-card1 {
    z-index: 2;
    position: absolute;
    /*right: 0;*/
    width: 100%;
    background-color: #fff;
    height: 300px;
    margin: 20px auto;

    /deep/ .el-card__body {
      height: 190px;
      overflow-y: auto;
    }

    .active {
      color: #66b1ff;
    }
  }
</style>
