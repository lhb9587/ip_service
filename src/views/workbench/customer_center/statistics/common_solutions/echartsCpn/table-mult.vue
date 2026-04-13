<template>
  <div>
    <el-table
      :data="tableData"
      border
      :style="{width: chartWidth}"
      :max-height="tableMaxHeight"
      highlight-current-row
      @row-click="getDrillPanels"
      ref="multipleTable">
      <el-table-column
        v-for="(item, index) in tableHeader"
        :key="index"
        :prop="item.field"
        :label="item.name"
        sortable
        show-overflow-tooltip>
      </el-table-column>
    </el-table>
    <!--全屏显示的容器-->
    <el-dialog append-to-body :visible.sync="dialog" fullscreen :show-close="false">
      <el-button size="mini" @click="dialog = false">关闭全屏</el-button>
      <el-table
        v-show="dialog"
        :data="tableData"
        border
        style="width: 100%"
        max-height="700"
        highlight-current-row
        ref="multipleTable">
        <el-table-column
          v-for="(item, index) in tableHeader"
          :key="index"
          :prop="item.field"
          :label="item.name"
          sortable
          show-overflow-tooltip>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'StableMult',
    props: ['chartData', 'chartSelectName', 'chartWidth', 'tableHeight'],
    data() {
      return {
        dialog: false,
        tableWidth: 'auto',
        tableMaxHeight: this.tableHeight ? this.tableHeight : '250',
        tableHeader: [],
        tableData: [],
        popstate: false
      }
    },
    created() {
      this.chartData.headers && this.initOption()
    },
    mounted() {
      if (window.history && window.history.pushState) {
        this.popstate = true
      }
    },
    methods: {
      initOption() {
        this.tableHeader = this.chartData.headers
        this.tableData = this.chartData.list

        // 默认下级钻取条件
        var drillName = this.chartSelectName ? this.chartSelectName : (this.tableData[0] ? this.tableData[0].name : '')
        drillName && this.$emit('saveDrillPanels', drillName, 1)

        // 表格设置默认第一行选中效果
        this.$nextTick(() => {
          this.$refs.multipleTable.setCurrentRow(this.tableData.find(item => item.name == drillName), true)
        })
      },

      // 单元格整行点击事件
      getDrillPanels(row) {
        console.log('table-click', row.name)
        this.$emit('drillPanels', row.name)
        this.$emit('drillData', row)
      },
      goBack() {
        // 在这里写自己的业务逻辑
        this.dialog = false;
      }
    },
    watch: {
      'chartData.refresh': {
        handler(n) {
          n && this.chartData.headers && this.initOption()
          n && this.$emit('cancelRefresh')
        },
        immediate: false
      },
      dialog() {
        if (this.popstate) {
          if (this.dialog) {
            history.pushState(null, null, document.URL);
            window.addEventListener('popstate', this.goBack, false);
          } else {
            window.removeEventListener('popstate', this.goBack, false);
          }
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .el-table {
    /deep/ th {
      padding: 0;
      color: rgba(51, 51, 51, 1);
      background: #f5f7fa;
    }

    /deep/ td {
      padding: 0;
    }

    /deep/ .el-table__body tr.current-row > td {
      background-color: #81bdff;
    }

    /deep/ .cell {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
    }
  }

  .el-dialog .el-button {
    margin-bottom: 10px;
  }
</style>
