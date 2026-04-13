<template>
  <div>
    <!-- 专利时限类型表格特殊处理 -->
    <el-table
      v-if="chartData.panelId === 4077"
      :data="formattedTableData"
      border
      style="width: 99%"
      :max-height="tableMaxHeight"
      highlight-current-row
      @row-click="getDrillPanels"
      :show-summary="showSummary"
      :summary-method="(params)=> getSummaries(params,'timeLimit')"
      ref="tableRef">
      <el-table-column show-overflow-tooltip label="" prop="name" width="150" fixed="left">
        <template #header>
          <div class="group-bias-divide">
            <div class="top">人员</div>
            <div class="bottom">时限类型</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        v-for="(item, index) in timeLimitTypes"
        :key="index"
        :prop="item"
        :label="item"
        align="right"
        min-width="100"
        :formatter="stateFormat"
        sortable
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="total"
        label="合计"
        :align="'right'"
        :formatter="stateFormat"
        fixed="right"
        sortable
        show-overflow-tooltip>
      </el-table-column>
    </el-table>
    <el-table
      v-else
      :data="tableData"
      border
      style="width: 99%"
      :max-height="tableMaxHeight"
      highlight-current-row
      @row-click="getDrillPanels"
      :show-summary="showSummary"
      :summary-method="(params)=> getSummaries(params)"
      ref="tableRef">
      <el-table-column
        v-for="(item, index) in tableHeader"
        :key="index"
        :prop="item.field"
        :label="item.name"
        :align="item.align"
        :formatter="item.field=='value' ? stateFormat : ''"
        :filters="[...filtersFormat(item.field)]"
        :filter-method="filterHandler"
        sortable
        show-overflow-tooltip>
      </el-table-column>
    </el-table>
    <!--全屏显示的容器-->
    <el-dialog append-to-body :visible.sync="dialog" fullscreen :show-close="false">
      <el-button size="mini" @click="dialog = false">关闭全屏</el-button>
      <el-table
      v-if="chartData.panelId === 4077"
      :data="formattedTableData"
      border
      style="width: 100%"
      max-height="700"
      highlight-current-row
      :show-summary="showSummary"
      :summary-method="(params)=> getSummaries(params,'timeLimit')"
      ref="tableRef">
      <el-table-column show-overflow-tooltip label="" prop="name" width="150" fixed="left">
        <template #header>
          <div class="group-bias-divide">
            <div class="top">人员</div>
            <div class="bottom">时限类型</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        v-for="(item, index) in timeLimitTypes"
        :key="index"
        :prop="item"
        :label="item"
        align="right"
        min-width="100"
        :formatter="stateFormat"
        sortable
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="total"
        label="合计"
        :align="'right'"
        :formatter="stateFormat"
        fixed="right"
        sortable
        show-overflow-tooltip>
      </el-table-column>
    </el-table>
      <el-table
        v-else
        v-show="dialog"
        :data="tableData"
        border
        style="width: 100%"
        max-height="700"
        highlight-current-row
        :show-summary="showSummary"
        :summary-method="(params)=> getSummaries(params)"
        ref="tableRef">
        <el-table-column
          v-for="(item, index) in tableHeader"
          :key="index"
          :prop="item.field"
          :label="item.name"
          :align="item.fixed"
          :formatter="item.field=='value' ? stateFormat : ''"
          :filters="filtersFormat(item.field)"
          :filter-method="filterHandler"
          sortable
          show-overflow-tooltip>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import {formatAmount} from "@/utils/filters";

export default {
  name: 'Stable',
  props: ['chartData', 'chartSelectName','tableHeight'],
  data() {
    return {
      dialog: false,
      tableMaxHeight: this.tableHeight ? this.tableHeight : '250',
      tableHeader: [],
      tableData: [],
      popstate: false,
      timeLimitTypes: [],
      formattedTableData: []
    }
  },
  computed: {
    showSummary() {
      return !!this.chartData.sumColumns
    },
  },
  created() {
    console.log('table',this.chartData.panelId)
    this.chartData.colName && this.initOption()
  },
  mounted() {
    if (window.history && window.history.pushState) {
      this.popstate = true
    }
  },
  methods: {
    filterHandler(value, row, column) {
      if (value === '全部') {
        console.log(this.$refs.tableRef,'this.refs.tableRef');
      }
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
    getSummaries(param,type) {
      const {columns, data} = param
      const sums = []
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
          sums[index] = this.stateFormat('','',sums[index])
          if(type !== 'timeLimit'){
            sums[index] = this.chartData.sumColumns && this.chartData.sumColumns.includes(column.property) ? sums[index] : ''
          }
        }
      })
      return sums
    },
    // 初始化数据, 列名格式化
    initOption() {
      this.tableHeader = []
      this.tableData = []
        var colNameArr = this.chartData.colName.split('#')
        var dataKey = this.chartData.list[0] && this.chartData.list[0].datas && this.chartData.list[0].datas[0] ? Object.keys(this.chartData.list[0].datas[0]) : []
        if (dataKey) {
          if (this.chartData.panelType != 'bar-grouped' && this.chartData.panelType != 'bar-stacked' && (this.chartData.panelType1 != 'tableData' || this.chartData.panelType === 'pie')){
            dataKey.map((item, index) => {
              var fixed = item == 'value' ? 'right' : 'left'
              this.tableHeader.push({ 'field': item, 'name': colNameArr[index], 'align': fixed })
            })
            this.tableData = this.chartData.list[0].datas
          }else{
            var column = ['legend'].concat(dataKey)
            column.map((item, index) => {
              var fixed = item == 'value' ? 'right' : 'left'
              this.tableHeader.push({ 'field': item, 'name': colNameArr[index], 'align': fixed })
            })
            this.chartData.list.forEach(item => {
              var legend = {legend:item.legend}
              item.datas.forEach(itm => {
                this.tableData.push(JSON.parse(JSON.stringify(Object.assign(legend,itm))))
              })
            })
        }
        if (this.chartData.panelId === 4077) {
          this.timeLimitTypes = [...new Set(this.chartData.list.map(item => item.legend))]; // 获取所有时限类型
          this.formattedTableData = this.formatDataForPanelId4077(this.chartData.list);
        }
      }

      console.log(this.tableHeader,'this.tableHeader');
      console.log(this.tableData,'this.tableData');
      

      var drillName = this.chartSelectName ? this.chartSelectName : (this.tableData[0] ? this.tableData[0].name : '')
      drillName && this.$emit('saveDrillPanels', drillName, 1)

      // 表格设置默认第一行选中效果
      this.$nextTick(()=>{
        this.$refs.tableRef.setCurrentRow(this.tableData.find(item => item.name == drillName),true)
      })
    },
    formatDataForPanelId4077(data) {
        const resultMap = {};
        const legends = new Set();
    
        // 遍历数据，提取所有 legend，并初始化 resultMap
        data.forEach(item => {
            legends.add(item.legend);
            item.datas.forEach(dataItem => {
                const { name, value } = dataItem;
                if (!resultMap[name]) {
                    resultMap[name] = { name };
                }
            });
        });
    
        // 遍历数据，填充每个 legend 的值
        data.forEach(item => {
            const { legend, datas } = item;
            datas.forEach(dataItem => {
                const { name, value } = dataItem;
                if (!resultMap[name][legend]) {
                    resultMap[name][legend] = 0;
                }
                resultMap[name][legend] += value;
            });
        });
    
        // 确保每个 name 都有所有 legend 的值，没有则设为 0
        const legendArray = Array.from(legends);
        const formattedResult = Object.values(resultMap).map(entry => {
            legendArray.forEach(legend => {
                if (!(legend in entry)) {
                    entry[legend] = 0;
                }
            });
            // 计算 total
            entry.total = legendArray.reduce((sum, legend) => sum + entry[legend], 0);
            return entry;
        });
    
        return formattedResult;
    },
    // 单元格整行点击事件
    getDrillPanels(row) {
      console.log('table-click',row.name)
      this.$emit('drillPanels', row.name)
      this.$emit('drillData', row)
    },
    // 金额转换千分符
     stateFormat(row, column, cellValue) {
      if (!cellValue) {
        return 0
      }
      // 将 cellValue 转换为浮点数，并确保保留两位小数
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
    goBack() {
      // 在这里写自己的业务逻辑
      this.dialog = false;
    }
  },
  watch: {
    chartData() {
      this.chartData.colName && this.initOption()
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
  }
  /deep/ td {
    padding: 0;
  }
  /deep/ .cell {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
  }
  /deep/ .el-table__body tr.current-row>td{
    background-color: #81bdff;
  }
}
.el-dialog .el-button{
  margin-bottom: 10px;
}
.group-bias-divide{
  .top {
    text-align: right;
    // padding-right: .5em;
    box-sizing: border-box;
    position: absolute;
    top: 20px;
  }

  .bottom {
    text-align: left;
    padding-left: 4em;
    box-sizing: border-box;
    &::before {
      content: "";
      position: absolute;
      width: 1px !important;
      height: 187px !important;
      bottom: 0 !important;
      right: 0 !important;
      background-color: #bfbfbf;
      transform: rotate(292deg);
      transform-origin: bottom;
    }
  }
}

</style>
