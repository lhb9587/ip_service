<template>
  <div>
    <div class="assess-div">
      <el-table
        :data="assessInfo"
        class="assess-table"
      >
        <el-table-column
          prop="element"
          label="考核要素">
          <template slot-scope="scope">
            <el-input type="textarea" v-model="scope.row.element"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="standard"
          label="工作标准">
          <template slot-scope="scope">
            <el-input type="textarea" v-model="scope.row.standard"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="120">
          <template slot-scope="scope">
            <el-button v-if="assessInfo.length !== 1" size="mini" type="danger" icon="el-icon-minus" circle
                       @click="deleteInfo(scope.$index)"></el-button>
            <el-button v-if="assessInfo.length == (scope.$index + 1)" size="mini" type="primary" icon="el-icon-plus" circle @click="addInfo"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="assess-div">
      <el-table
        v-if="isTable"
        ref="table"
        class="assess-table"
        :data="assessData"
        :span-method="objectSpanMethod"
        show-summary
        :summary-method="getSummaries"
        sum-text="考核得分"
        border
        height="790px"
        :default-sort= "{prop: 'performType', order: 'ascending'}">
        <el-table-column
          prop="performType"
          label="考核维度及总占比"
          width="180">
          <template slot-scope="scope">
            <div style="text-align: center">
              {{ performTypes[scope.row.performType] }}
              <el-button type="primary" size="mini" icon="el-icon-plus" @click="addAssessItem(scope.row.performType)" circle></el-button>
              <el-input
                type="textarea"
                :rows="2"
                placeholder="评分说明"
                @change="addAssessDesc(scope.row.performType,scope.row.performTypeDesc)"
                v-model="scope.row.performTypeDesc">
              </el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="element"
          label="考核要素"
          width="180">
          <template slot-scope="scope">
            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="scope.row.element" :placeholder="scope.row.elementPlaceholder"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="standard"
          label="考核标准">
          <template slot-scope="scope">
            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="scope.row.standard" :placeholder="scope.row.placeholder"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="selfAssessment"
          label="自评范围"
          width="250">
          <template slot-scope="scope">
            <div v-if="scope.row.performType !== 3">
              <p v-for="(item,index) in scope.row.selfAssessmentArray" :key="item">
                <el-input :value="item" @input="updateItem(scope, index, $event)" size="mini" style="width: 150px"></el-input>
                <i style="cursor: pointer" class="el-icon-delete" @click="delectItem(scope,index)"></i>
              </p>
              <p>
                <el-input v-model="scope.row.newItem" placeholder="请输入自评名称" @change="addItem(scope)" size="mini" style="width: 150px"></el-input>
                <el-button size="mini" @click="addItem(scope)">添加</el-button>
              </p>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="weight"
          label="权重"
          width="150">
          <template slot-scope="scope">
            <el-input v-model="scope.row.weight" type="number"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="weight"
          label="操作"
          width="100">
          <template slot-scope="scope">
            <el-button
              v-if="deleteCheck(scope.row.performType)"
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index,scope.row.performType)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="clearAssess">取消</el-button>
      <el-button type="primary" @click="assessSubmit">考核内容保存</el-button>
    </span>
  </div>
</template>

<script>
import { queryPersonPerformanceTemp, upsertPersonPerformanceTemp } from '@/api/hrmList'
export default {
  name: 'AssessTwoVisible',
  props: ['talentCode'],
  data() {
    return {
      isTable: true,
      assessInfo: '', // 考核信息
      assessData: [],
      performTypes: {
        1: '综合评价(90%)',
        2: '出勤情况(10%)',
        3: '浮动部分(5%)'
      },
      newItem: '',
      defaultAssessContent: [
        { performType: 1, element: '', elementPlaceholder: '考核要素：由直属主管制定考核内容', standard: '', performTypeDesc: '', weight: 0, selfAssessmentArray: [] },
        { performType: 2, element: '', elementPlaceholder: '精神面貌、专业技能及知识、责任意识、沟通技能、团队合作等方面', standard: '', performTypeDesc: '', weight: 0, selfAssessmentArray: [] },
        { performType: 3, element: '', elementPlaceholder: '说明：非必填部分。直属上级根据考核期内整体工作情况体现其他奖惩项目', standard: '', performTypeDesc: '', weight: 0 }
      ]
    }
  },
  created() {
    this.queryPersonPerformanceTemp()
  },
  methods: {
    deleteInfo(index) {
      this.assessInfo.splice(index,1)
    },
    addInfo() {
      this.assessInfo.push({
        element: '',
        standard: '',
        performType: 4
      })
    },
    addItem(scope) {
      // 将用户输入的 newItem 添加到数组中
      scope.row.selfAssessmentArray.push(scope.row.newItem);
      // 清空输入框，以便下次输入
      scope.row.newItem = '';
    },
    delectItem(scope, index) {
      scope.row.selfAssessmentArray.splice(index,1)
    },
    updateItem(scope, index, newValue) {
      // 使用 $set 方法更新数组元素，确保 Vue.js 能正确追踪变化
      this.$set(scope.row.selfAssessmentArray, index, newValue);
    },
    deleteCheck(type) {
      const count = this.assessData.filter(item => item.performType == type).length;
      if (count == 1){
        return false
      }
      return true
    },
    // 删除
    handleDelete(index,performType) {
      this.assessData.splice(index,1)
    },
    // 获取考核内容
    queryPersonPerformanceTemp() {
      queryPersonPerformanceTemp({ talentCode: this.talentCode }).then(res => {
        if (res.data.length > 0) {
          var performItems = res.data.sort((a, b) => a.performType - b.performType);
          this.assessData = performItems.filter(item => item.performType != 4).map(item => {
            // 在这里为每个item添加新的属性
            return { ...item, newItem: '' };
          });
          this.assessInfo = performItems.filter(item => item.performType == 4)
        }else{
          this.assessData = JSON.parse(JSON.stringify(this.defaultAssessContent))
        }
      })
    },
    // 添加考核项目
    addAssessItem(type) {
      var assessData = JSON.parse(JSON.stringify(this.assessData))
      assessData.push(JSON.parse(JSON.stringify(this.defaultAssessContent[type-1])))
      var performItems = assessData.sort((a, b) => a.performType - b.performType);
      this.assessData = assessData
      this.isTable = false
      this.$nextTick(() => {
        this.isTable = true
      });
    },
    // 添加评分说明
    addAssessDesc(type,desc) {
      this.assessData.filter(item => item.performType == type).map(res => {
        res.performTypeDesc = desc
      })
    },
    // 考核内容保存
    assessSubmit() {
      var submitData = {
        talentCode: this.talentCode,
        performItems: this.assessData.concat(this.assessInfo)
      }
      console.log('submitData',submitData)
      upsertPersonPerformanceTemp(submitData).then(res => {
        if (res.success){
          this.$message.success(res.message)
          this.clearAssess()
        }
      })
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      // console.log(row)
      if (columnIndex === 0) {
        const _row = this.mergeColumn()[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        };
      }
      if (row.performType == 3) {
        if (columnIndex === 1) {
          return [1, 2];
        } else if (columnIndex === 2) {
          return [0, 0];
        }
      }
    },
    mergeColumn() {
      const spanOneArr = [];
      let concatOne = 0;
      this.assessData.forEach((item, index) => {
        if (index === 0) {
          spanOneArr.push(1);
        } else {
          if (item.performType === this.assessData[index - 1].performType) {
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
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 4){
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
            sums[index] = '考核权重：' + sums[index];
          } else {
            sums[index] = 'N/A';
          }
        }else{
          sums[index] = '';
        }
      });
      return sums;
    },
    // 关闭
    clearAssess() {
      this.$emit('clearAssess')
    }
  },
}
</script>

<style lang="scss" scoped>
/deep/ .el-dialog__body{
  padding: 0 20px;
}
.el-table{
  /deep/ th{
    padding: 6px 0;
    color: #555555;
    background: #FAFAFA;
  }
}

.assess-div {
  padding: 10px 0;
  background-color: #ecf5ff;
}
.assess-table {
  width: 80%;
  margin: auto;
  /deep/ .el-table__header th {
    text-align: center;
    background: linear-gradient(#98c9ff 37%,#f5f7fa 100%);
  }
  /deep/ .el-table__body td {
    padding: 5px;
    border-right: 2px dashed #dcdfe6;
    border-bottom: 2px dashed #dcdfe6;
  }
  /deep/ .el-table__footer-wrapper tbody td {
    padding:  5px 0;
  }
}
.dialog-footer {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}
</style>
