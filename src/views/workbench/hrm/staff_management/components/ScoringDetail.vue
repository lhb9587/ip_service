<template>
  <div>
    <el-date-picker
      v-model="dates"
      type="monthrange"
      format="yyyy-MM"
      value-format="yyyy-MM"
      align="right"
      unlink-panels
      range-separator="至"
      start-placeholder="开始月份"
      end-placeholder="结束月份"
      :picker-options="pickerOptions"
      @change="handleYears">
    </el-date-picker>
    <el-table
      :data="tableData"
      :span-method="objectSpanMethod"
      border
      :summary-method="getSummaries"
      show-summary
      style="width: 100%; margin-top: 20px">
      <el-table-column v-for="column in dynamicColumns" :key="column.prop" :prop="column.prop" :label="column.label" :width="column.width" class-name="custom-header"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import { queryPersonPerformanceCompare } from '@/api/hrmList'
export default {
  name: 'ScoringDetail',
  props: ["talentCode","assessData"],
  data() {
    return {
      tableData: [],
      dynamicColumns: [],
      pickerOptions: {
        shortcuts: [{
          text: '最近六个月',
          onClick(picker) {
            const today = new Date();
            const start = new Date(today.getFullYear(), today.getMonth() - 6, 1);
            const end = new Date(today.getFullYear(), today.getMonth(), 0);
            picker.$emit('pick', [start, end]);
          }
        },{
          text: '最近一年',
          onClick(picker) {
            const today = new Date();
            const start = new Date(today.getFullYear(), today.getMonth() - 12, 1);
            const end = new Date(today.getFullYear(), today.getMonth(), 0);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      dates: [],
      personPerformances: [],
      performTypes: {
        1: '工作任务',
        2: '综合评价',
        3: '浮动部分'
      },
    };
  },
  created() {
    this.dateInit()
  },
  methods: {
    dateInit() {
      const today = new Date();
      const start = new Date(today.getFullYear(), today.getMonth() - 6, 1);
      const end = new Date(today.getFullYear(), today.getMonth(), 0);

      this.dates = [start, end];

      this.assessData.map(item => {
        this.tableData.push({
          name: this.performTypes[item.performType],
          element: item.element
        })
      })

      this.handleYears()
    },
    getData(start,end) {
      const formattedStartDate = `${start.getFullYear()}-${(start.getMonth() + 1).toString().padStart(2, '0')}`;
      const formattedEndDate = `${end.getFullYear()}-${(end.getMonth() + 1).toString().padStart(2, '0')}`;
      return queryPersonPerformanceCompare({ talentCodeList: [this.talentCode], performDateArray: [formattedStartDate, formattedEndDate] });
    },
    handleYears() {
      const [start, end] = this.dates.map(date => new Date(date)); // 将日期转换为 Date 对象

      this.getData(start, end).then(res => {
        if (res.success) {
          this.personPerformances = res.data;
          // 执行其他操作
          this.updateDynamicColumns(start, end);
          // 正则表达式匹配 prop 中的年份和月份
          const propPattern = /(\d{4})-(\d{1,2})/;
          // 遍历 dynamicColumns
          this.dynamicColumns.forEach(column => {
            // 跳过 prop 为 name 或 element 的列
            if (column.prop === 'name' || column.prop === 'element') {
              return;
            }
            // 使用正则表达式匹配年份和月份
            const match = column.prop.match(propPattern);
            if (!match) {
              return; // 如果匹配失败，则跳过此列
            }
            const year = parseInt(match[1], 10);

            const month = parseInt(match[2], 10);

            const matchingData = this.personPerformances.find(item => {
              return item.performYear === year && item.performMonth === month;
            });
            // 如果匹配到数据
            if (matchingData) {
              // 遍历 tableData
              this.tableData.forEach(tableItem => {
                // 找到匹配的项目
                const matchingItem = matchingData.performItems.find(performItem => {
                  return performItem.element === tableItem.element;
                });

                // 如果匹配到项目，更新 tableData 中对应的值
                if (matchingItem) {
                  tableItem[column.prop] = matchingItem.score;
                }
              });
            }
          })
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '考核得分';
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
        } else {
          // sums[index] = 'N/A';
        }
      });

      return sums;
    },
    // 根据列值合并列
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        const _row = this.mergeColumn()[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        };
      }
    },
    mergeColumn() {
      const spanOneArr = [];
      let concatOne = 0;
      this.tableData.forEach((item, index) => {
        if (index === 0) {
          spanOneArr.push(1);
        } else {
          if (item.name === this.tableData[index - 1].name) {
            spanOneArr[concatOne] += 1;
            spanOneArr.push(0);
          } else {
            spanOneArr.push(1);
            concatOne = index;
          }
        }
      });
      return spanOneArr;
    },
    // 更新动态列
    updateDynamicColumns(start, end) {
      const startMonth = start.getMonth() + 1;
      const endMonth = end.getMonth() + 1;
      const startYear = start.getFullYear();
      const endYear = end.getFullYear();
      const dynamicColumns = [
        { prop: "name", label: "考核维度", width: "120px" },
        { prop: "element", label: "考核要素", width: "150px"  }
      ];

      for (let i = endYear; i >= startYear; i--) {
        for (let j = (i === endYear ? endMonth : 12); j >= (i === startYear ? startMonth : 1); j--) {
          dynamicColumns.push({
            prop: `${i}-${j}`,
            label: `${i}年${j}月`,
            width: "120px"
          });
        }
      }

      this.dynamicColumns = dynamicColumns;
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/ .el-date-editor .el-range-separator {
  width: 7%;
}
.el-table{
  /deep/ th{
    padding: 6px 0;
    color: #000000;
    background: #bdd7ed;
  }
}
</style>
