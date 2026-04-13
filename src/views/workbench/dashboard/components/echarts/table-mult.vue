<template>
  <div>
    <el-table
      :summary-method="getSummaries"
      :show-summary="showSummary"
      :data="tableData"
      border
      width="100%"
      :max-height="tableMaxHeight"
      highlight-current-row
      @row-click="getDrillPanels"
      ref="multipleTable">
      <el-table-column
        v-for="(item, index) in tableHeader"
        :key="index"
        :prop="item.field"
        sortable
        min-width="120"
        :filters="filtersFormat(item.field)"
        :filter-method="filterHandler"
        >
        <template slot="header" slot-scope="scope">
          <div style="text-align: center;line-height: 1;" :title="item.name.replace(/\\n/g, '/')" v-html="item.name.replace(/\\n/g, '<br />')"></div>
        </template>
      </el-table-column>
    </el-table>
    <!--全屏显示的容器-->
    <el-dialog append-to-body :visible.sync="dialog" fullscreen :show-close="false">
      <el-button size="mini" @click="dialog = false">关闭全屏</el-button>
      <el-table
        v-show="dialog"
        :data="tableData"
        border
        style="width: 99%"
        max-height="700"
        highlight-current-row
        ref="multipleTable">
        <el-table-column
          v-for="(item, index) in tableHeader"
          :key="index"
          :prop="item.field"
          :filters="filtersFormat(item.field)"
          :filter-method="filterHandler"
          sortable
          show-overflow-tooltip>
          <template slot="header" slot-scope="scope">
            <div style="text-align: center;line-height: 1;" :title="item.name.replace(/\\n/g, '/')" v-html="item.name.replace(/\\n/g, '<br />')"></div>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
  import {formatAmount} from "@/utils/filters";

export default {
  name: 'StableMult',
  props: ['chartData', 'chartSelectName', 'chartWidth','tableHeight'],
  computed: {
    showSummary() {
      return !!this.chartData.sumColumns
    }
  },
  data() {
    return {
      tableKey: false,
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
    filterHandler(value, row, column) {
      const property = column['property'];
      return row[property] === value;
    },
    filtersFormat(key){
      if (this.tableData.length > 0 && this.tableData[0][key]) {
        return [...new Set(this.tableData.map(item => item[key]))].map(item => {
          return {text: item, value: item}
        })
      }
      return []
    },
    formatAmount(value){
      if (value) return formatAmount(value)
      return '0.00'
    },
    getSummaries(param) {
      const {columns, data} = param
      const sums = []
      //panelId=106、110、222增长率总计的特殊处理
      let lastyearTotal
      let thisYearTotal
      let growthRate
      let growthRateIndex

      //panelId=635人均结余总计的特殊处理
      let balanceTotal
      let balanceIndex
      let personTotal

      columns.forEach((column, index) => {

        if (index === 0) {
          sums[index] = "合计："
          return
        }
        const values = data.map(item => {
          return Number(item[column.property])
        })

        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          //106、110、222
          if (this.chartData.panelId == 106 || this.chartData.panelId == 110 ||  this.chartData.panelId == 222) {
            if (index == 1) {
              lastyearTotal = sums[index]
            } else if(index ==2){
              thisYearTotal = sums[index]
            }
            if (column.property == 'rate') {
              growthRateIndex = index
            }
          }
          //635
          if (this.chartData.panelId == 635) {
            if (column.property == 'average') {
              balanceIndex = index
            } 
            if (column.property == 'value') {
              balanceTotal = sums[index]
            }
            if (column.property == 'count') {
              personTotal = sums[index]
            }
          }
          sums[index] = this.chartData.sumColumns && this.chartData.sumColumns.includes(column.property) ? this.stateFormat(sums[index]) : ''
        }
      })
      //106、110、222
      if (this.chartData.panelId == 106 || this.chartData.panelId == 110 || this.chartData.panelId == 222) {
        if (!lastyearTotal) {
          return false
        }
        growthRate = ((thisYearTotal - lastyearTotal) / lastyearTotal) * 100
        const rate = growthRate.toFixed(2)
        sums[growthRateIndex] = this.stateFormat(rate)
      }
      //635
      if (this.chartData.panelId == 635 && personTotal) {
        const average = balanceTotal / personTotal
        sums[balanceIndex] = average.toFixed(2)
      }
      return sums
    },
    stateFormat(cellValue) {
      // 将 cellValue 转换为浮点数，并确保保留两位小数
      if (!cellValue) {
        return 0
      }
      let formattedValue = parseFloat(cellValue).toFixed(2);
    
      // 检查小数部分
      if (formattedValue.endsWith('.00')) {
        // 去掉小数部分
        formattedValue = formattedValue.slice(0, -3);
      }
    
      // 对整数部分添加千分位
      // 使用正则表达式只格式化整数部分
      formattedValue = formattedValue.replace(/(\d)(?=(\d{3})+\.)/g, function($0, $1) {
        return $1 + ',';
      });
    
      return formattedValue;
    },
    initOption() {
      this.tableHeader = this.chartData.headers
      this.tableData = this.chartData.list

      // 默认下级钻取条件
      var drillName = this.chartSelectName ? this.chartSelectName : (this.tableData[0] ? this.tableData[0].name : '')
      drillName && this.$emit('saveDrillPanels', drillName, 1)

      // 表格设置默认第一行选中效果
      this.$nextTick(()=>{
        this.$refs.multipleTable.setCurrentRow(this.tableData.find(item => item.name == drillName),true)
      })
    },

    // 单元格整行点击事件
    getDrillPanels(row) {
      console.log('table-click',row.name)
      this.$emit('drillPanels', row.name)
      this.$emit('drillData', row)
    },
    goBack() {
      // 在这里写自己的业务逻辑
      this.dialog = false;
    }
  },
  watch: {
    chartData() {
      this.chartData.headers && this.initOption()
    },
    dialog() {
      if (this.popstate){
        if (this.dialog){
          history.pushState(null, null, document.URL);
          window.addEventListener('popstate', this.goBack, false);
        }else {
          window.removeEventListener('popstate', this.goBack, false);
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.el-table{
  /deep/ th{
    padding: 0;
    color: rgba(51, 51, 51, 1);
    background: #f5f7fa;
    width: 120px;
  }
  /deep/ td {
    padding: 0;
  }
  /deep/ .el-table__body tr.current-row>td{
    background-color: #81bdff;
  }
  /deep/ .cell {
    //width: 120px;
    display: flex;
    justify-content: center;
    align-items: center;
    div {
      padding: 0;
    }
  }
}
.el-dialog .el-button{
  margin-bottom: 10px;
}
</style>
