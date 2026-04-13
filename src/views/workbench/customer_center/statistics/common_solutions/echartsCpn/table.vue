<template>
  <div>
    <pl-table
      :data="tableData"
      border
      style="width: 100%"
      :max-height="tableMaxHeight"
      highlight-current-row
      @row-click="getDrillPanels"
      ref="multipleTable">
      <pl-table-column
        v-for="(item, index) in tableHeader"
        :key="index"
        :prop="item.field"
        :label="item.name"
        :align="item.align"
        :formatter="item.field=='value' ? stateFormat : ''"
        sortable
        show-overflow-tooltip>
      </pl-table-column>
    </pl-table>
    <!--全屏显示的容器-->
    <el-dialog append-to-body :visible.sync="dialog" fullscreen :show-close="false">
      <el-button size="mini" @click="dialog = false">关闭全屏</el-button>
      <pl-table
        v-show="dialog"
        :data="tableData"
        border
        style="width: 100%"
        max-height="700"
        highlight-current-row
        ref="multipleTable">
        <pl-table-column
          v-for="(item, index) in tableHeader"
          :key="index"
          :prop="item.field"
          :label="item.name"
          :align="item.fixed"
          sortable
          show-overflow-tooltip>
        </pl-table-column>
      </pl-table>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'Stable',
    props: ['chartData', 'chartSelectName', 'tableHeight'],
    data() {
      return {
        dialog: false,
        tableMaxHeight: this.tableHeight ? this.tableHeight : '250',
        tableHeader: [],
        tableData: [],
        popstate: false
      }
    },
    created() {
      this.chartData.colName && this.initOption()
    },
    mounted() {
      if (window.history && window.history.pushState) {
        this.popstate = true
      }
    },
    methods: {
      // 初始化数据, 列名格式化
      initOption() {
        this.tableHeader = []
        this.tableData = []
        var colNameArr = this.chartData.colName.split('#')
        var dataKey = this.chartData.list[0] && this.chartData.list[0].datas && this.chartData.list[0].datas[0] ? Object.keys(this.chartData.list[0].datas[0]) : []
        if (dataKey) {
          if (this.chartData.panelType != 'bar-grouped' && this.chartData.panelType != 'bar-stacked' && (this.chartData.panelType1 != 'tableData' || this.chartData.panelType === 'pie' || this.chartData.panelType === 'line')) {
            dataKey.map((item, index) => {
              var fixed = item == 'value' ? 'right' : 'left'
              this.tableHeader.push({'field': item, 'name': colNameArr[index], 'align': fixed})
            })
            this.tableData = this.chartData.list[0].datas
          } else {
            var column = ['legend'].concat(dataKey)
            column.map((item, index) => {
              var fixed = item == 'value' ? 'right' : 'left'
              this.tableHeader.push({'field': item, 'name': colNameArr[index], 'align': fixed})
            })
            this.chartData.list.forEach(item => {
              var legend = {legend: item.legend}
              item.datas.forEach(itm => {
                this.tableData.push(JSON.parse(JSON.stringify(Object.assign(legend, itm))))
              })
            })
          }
        }

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
      // 金额转换千分符
      stateFormat(row, column, cellValue) {
        cellValue += ''
        if (!cellValue.includes('.')) cellValue += '.'
        return cellValue.replace(/(\d)(?=(\d{3})+\.)/g, function ($0, $1) {
          return $1 + ','
        }).replace(/\.$/, '')
      },
      goBack() {
        // 在这里写自己的业务逻辑
        this.dialog = false;
      }
    },
    watch: {
      'chartData.refresh': {
        handler(n) {
          n && this.initOption()
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
  >>>.el-table {
    th {
      padding: 0;
      color: rgba(51, 51, 51, 1);
      background: #f5f7fa;
    }

    td {
      padding: 0;
    }

    .cell {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
    }

    el-table__body tr.current-row > td {
      background-color: #81bdff;
    }
  }

  .el-dialog .el-button {
    margin-bottom: 10px;
  }
</style>
