<template>
  <div style="height: 100%;background-color: #fff;">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="催款相关备注" name="MemoGrid"></el-tab-pane>
      <el-tab-pane label="对账历史记录" name="StatementGrid"></el-tab-pane>
      <el-tab-pane label="信用历史记录" name="CreditGrid"></el-tab-pane>
    </el-tabs>
    <div>
      <keep-alive>
        <component :ctx="ctx" :is="componentName" :custName="custName" :cust-id="custId" :statementTopHeight="statementTopHeight"></component>
      </keep-alive>
    </div>
  </div>
</template>

<script>
  import CreditGrid from "./CreditGrid";
  import MemoGrid from "./MemoGrid";
  import StatementGrid from "./StatementGrid";

  export default {
    name: "RightGrids",
    components: {
      MemoGrid,
      StatementGrid,
      CreditGrid
    },
    props: {
      statementTopHeight: '',
      custId: '',
      ctx: {},
      custName: ''
    },
    data() {
      return {
        activeName: 'MemoGrid',
        componentName: 'MemoGrid'
      }
    },
    methods: {
      handleClick(item) {
        if (item.name) {
          this.componentName = item.name
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  > > > .el-tabs__header {
    margin: 0;

    .el-tabs__item {
      height: 30px;
      line-height: 30px;
    }
  }
</style>
