<template>
  <div>
    <div class="assess-div">
      <el-table
        v-if="isTable"
        ref="table"
        class="assess-table"
        :data="tableDisplayData"
        :span-method="objectSpanMethod"
        show-summary
        :summary-method="getSummaries"
        border
        height="790px"
      >
        <el-table-column
          prop="performType"
          label="考核维度及总占比"
          width="160"
        >
          <template slot-scope="scope">
            <div
              v-if="showAddButton(scope.$index)"
              style="text-align: center"
            >
              <div class="perform-type-label">
                <div>{{ performTypes[getMergeGroupPerformType(scope.$index)][0] }}</div>
                <div>{{ performTypes[getMergeGroupPerformType(scope.$index)][1] }}</div>
              </div>
              <el-button
                type="primary"
                size="mini"
                icon="el-icon-plus"
                circle
                @click="addAssessItem(getMergeGroupPerformType(scope.$index))"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="assessContentLabel"
          label="考核内容"
          width="160"
          align="center"
        >
          <template slot-scope="scope">
            <el-input
              v-if="scope.row.rowKind === 'comment'"
              type="textarea"
              :autosize="{ minRows: 3, maxRows: 6 }"
              v-model="assessData[scope.row._sourceIndex].element"
              placeholder="点评: (上级填写)"
            />
            <span
              v-else-if="scope.row.rowKind === 'workAssess' || scope.row.rowKind === 'assess'"
              class="assess-content-label"
            >{{ assessData[scope.row._sourceIndex].assessContentLabel }}</span>
            <div
              v-else-if="scope.row.rowKind === 'workOverview'"
              class="assess-content-label assess-content-label--multiline"
            >
              <div>情况概述</div>
              <div>（个人填写）</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="element"
          label="考核要素"
          min-width="160"
        >
          <template slot-scope="scope">
            <el-input
              v-if="scope.row.rowKind === 'workAssess' || scope.row.rowKind === 'assess'"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4 }"
              v-model="assessData[scope.row._sourceIndex].element"
            />
            <el-input
              v-else-if="scope.row.rowKind === 'workOverview'"
              type="textarea"
              class="work-overview-input"
              :autosize="{ minRows: 2, maxRows: 6 }"
              v-model="assessData[scope.row._sourceIndex].completeStatus"
              placeholder="请填写本月工作情况概述"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="standard"
          label="考核标准"
          min-width="320"
        >
          <template slot-scope="scope">
            <el-input
              v-if="scope.row.rowKind === 'workAssess' || scope.row.rowKind === 'assess'"
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 10 }"
              v-model="assessData[scope.row._sourceIndex].standard"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="weight"
          label="权重"
          width="120"
        >
          <template slot-scope="scope">
            <div
              v-if="scope.row.rowKind === 'workAssess' || scope.row.rowKind === 'assess'"
              class="weight-cell"
            >
              <el-input
                v-model="assessData[scope.row._sourceIndex].weight"
                type="number"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="100"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              v-if="showDeleteButton(scope.row)"
              size="mini"
              type="danger"
              @click="handleDelete(scope.row._sourceIndex)"
            >删除</el-button>
          </template>
        </el-table-column>
        <el-table-column
          label="整体评定标准"
          width="210"
        >
          <template slot-scope="scope">
            <div
              v-if="isOverallStandardFirstRow(scope.$index)"
              class="overall-standard"
            >
              <p v-for="(line, idx) in overallEvaluationStandard" :key="idx">{{ line }}</p>
            </div>
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
import Vue from 'vue'
import { queryPersonPerformanceTemp, upsertPersonPerformanceTemp } from '@/api/hrmList'

const OVERALL_EVALUATION_STANDARD = [
  '优秀，绩效工资按120%发放',
  '良好，绩效工资按100%发放',
  '称职，绩效工资按100%发放',
  '待改进，绩效工资按80%发放',
  '不合格，绩效工资按0%发放'
]

const STANDARD_WORK_INPUT = `优秀：深度参与1个及以上专项项目或关键任务，或日均有效工作时长饱满，主动承担额外职责
良好：能完全胜任并饱满完成所有分配的本职工作，并能主动响应协作需求
称职：按时完成所有主要工作，在工作流程或衔接上仍有优化空间，无明显工作空档
待改进：时常出现工作时间处理私事，或任务未饱和，或明显空岗现象
不合格：长期工作不饱和且无合理解释，或在岗怠工`

const STANDARD_WORK_QUALITY = `优秀：工作质量高，成果突出，交办事项完成出色
良好：工作质量稳定，成果符合预期要求
称职：工作质量合格，能按时完成基本工作成果
待改进：工作质量不稳定，部分成果未达预期
不合格：工作质量差，成果严重不达标`

const STANDARD_ATTENDANCE = `良好及以上：全勤或请假手续合规，严格遵守工作纪律
称职：偶有迟到早退，总体能遵守工作纪律
待改进及以下：出勤情况不佳或存在违反纪律行为`

const STANDARD_PROFESSIONAL = `优秀：职业精神突出，主动协作，团队贡献显著
良好：职业态度端正，能积极配合团队协作
称职：基本具备职业精神，能完成协作要求
待改进：职业精神不足，协作意识有待加强
不合格：缺乏职业精神，严重影响团队协作`

export default {
  name: 'AssessThreeContent',
  props: ['talentCode'],
  data() {
    return {
      isTable: true,
      assessData: [],
      evaluationStandard: '',
      evaluationStandardOptions: ['优秀', '良好', '称职', '待改进', '不合格'],
      overallEvaluationStandard: OVERALL_EVALUATION_STANDARD,
      performTypes: {
        1: ['工作任务', '(70%)'],
        2: ['其他评价', '(30%)'],
        3: ['点评：', '（上级填写）']
      },
      defaultAssessContent: [
        {
          performType: 1,
          assessContentLabel: '考核内容1',
          element: '工作投入度与饱和度',
          standard: STANDARD_WORK_INPUT,
          weight: 35,
          completeStatus: ''
        },
        {
          performType: 1,
          assessContentLabel: '考核内容2',
          element: '工作质量与成果',
          standard: STANDARD_WORK_QUALITY,
          weight: 35,
          completeStatus: ''
        },
        {
          performType: 2,
          assessContentLabel: '考核内容3',
          element: '出勤情况与纪律',
          standard: STANDARD_ATTENDANCE,
          weight: 15
        },
        {
          performType: 2,
          assessContentLabel: '考核内容4',
          element: '职业精神与协作',
          standard: STANDARD_PROFESSIONAL,
          weight: 15
        },
        {
          performType: 3,
          element: ''
        }
      ]
    }
  },
  computed: {
    tableDisplayData() {
      return this.buildDisplayRows(this.assessData)
    }
  },
  watch: {
    evaluationStandard(val) {
      if (this._summaryEvalVm) {
        this._summaryEvalVm.localValue = val
      }
    },
    isTable() {
      this.$nextTick(() => {
        this.mountSummaryEvaluation()
      })
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.mountSummaryEvaluation()
    })
  },
  beforeDestroy() {
    this.destroySummaryEvaluation()
  },
  created() {
    this.queryPersonPerformanceTemp()
  },
  methods: {
    normalizePerformType(performType) {
      const type = Number(performType)
      return type >= 1 && type <= 3 ? type : performType
    },
    isWorkTaskItem(item) {
      return Number(item.performType) === 1
    },
    getMergeGroupPerformType(rowIndex) {
      const merge = this.mergeColumn()
      let start = rowIndex
      while (start > 0 && merge[start] === 0) {
        start--
      }
      const row = this.tableDisplayData[start]
      if (row && row.performType != null) {
        return this.normalizePerformType(row.performType)
      }
      return this.normalizePerformType(
        this.assessData[row._sourceIndex].performType
      )
    },
    showAddButton(rowIndex) {
      const merge = this.mergeColumn()[rowIndex]
      return merge > 0
    },
    showDeleteButton(row) {
      if (row.rowKind === 'workOverview') {
        return false
      }
      const item = this.assessData[row._sourceIndex]
      return this.deleteCheck(item.performType)
    },
    deleteCheck(performType) {
      const type = this.normalizePerformType(performType)
      return this.assessData.filter(
        item => this.normalizePerformType(item.performType) === type
      ).length > 1
    },
    isAssessContentItem(item) {
      const type = this.normalizePerformType(item.performType)
      return type === 1 || type === 2
    },
    parseAssessContentNum(label) {
      const match = (label || '').match(/考核内容(\d+)/)
      return match ? parseInt(match[1], 10) : 0
    },
    applySequentialAssessContentLabels(assessData) {
      let seq = 1
      assessData.forEach(item => {
        if (!this.isAssessContentItem(item)) return
        item.assessContentLabel = `考核内容${seq}`
        seq++
      })
    },
    resolveAssessContentLabel(parsedLabel, existingLabel, nextNum) {
      const candidates = [parsedLabel, existingLabel].filter(Boolean)
      for (const candidate of candidates) {
        const n = this.parseAssessContentNum(candidate)
        if (n >= nextNum.num) {
          nextNum.num = Math.max(nextNum.num, n + 1)
          return candidate
        }
      }
      const label = `考核内容${nextNum.num}`
      nextNum.num++
      return label
    },
    createDefaultItem(performType) {
      const type = this.normalizePerformType(performType)
      if (type === 1) {
        return {
          performType: 1,
          element: '',
          standard: '',
          weight: 0,
          completeStatus: ''
        }
      }
      if (type === 2) {
        return {
          performType: 2,
          element: '',
          standard: '',
          weight: 0
        }
      }
      return {
        performType: 3,
        element: ''
      }
    },
    getTableBodyScrollTop() {
      const tableRef = this.$refs.table
      if (!tableRef || !tableRef.$el) return 0
      const bodyWrapper = tableRef.$el.querySelector('.el-table__body-wrapper')
      return bodyWrapper ? bodyWrapper.scrollTop : 0
    },
    setTableBodyScrollTop(scrollTop) {
      const tableRef = this.$refs.table
      if (!tableRef || !tableRef.$el) return
      const bodyWrapper = tableRef.$el.querySelector('.el-table__body-wrapper')
      if (bodyWrapper) {
        bodyWrapper.scrollTop = scrollTop
      }
    },
    updateTableLayout() {
      this.$nextTick(() => {
        const tableRef = this.$refs.table
        if (tableRef) {
          tableRef.doLayout()
        }
        this.mountSummaryEvaluation()
      })
    },
    refreshTable() {
      const scrollTop = this.getTableBodyScrollTop()
      this.isTable = false
      this.$nextTick(() => {
        this.isTable = true
        this.$nextTick(() => {
          this.mountSummaryEvaluation()
          this.$nextTick(() => {
            this.setTableBodyScrollTop(scrollTop)
          })
        })
      })
    },
    addAssessItem(performType) {
      const type = this.normalizePerformType(performType)
      const assessData = JSON.parse(JSON.stringify(this.assessData))
      const newItem = this.createDefaultItem(type)
      let insertAt = assessData.length
      for (let i = assessData.length - 1; i >= 0; i--) {
        if (this.normalizePerformType(assessData[i].performType) === type) {
          insertAt = i + 1
          break
        }
        if (this.normalizePerformType(assessData[i].performType) < type) {
          insertAt = i + 1
          break
        }
      }
      assessData.splice(insertAt, 0, newItem)
      this.applySequentialAssessContentLabels(assessData)
      this.assessData = assessData
      this.updateTableLayout()
    },
    handleDelete(sourceIndex) {
      const deleted = this.assessData[sourceIndex]
      this.assessData.splice(sourceIndex, 1)
      if (deleted && this.isAssessContentItem(deleted)) {
        this.applySequentialAssessContentLabels(this.assessData)
      }
      this.updateTableLayout()
    },
    buildDisplayRows(items) {
      const rows = []
      items.forEach((item, index) => {
        const performType = this.normalizePerformType(item.performType)
        const base = { _sourceIndex: index, performType }
        if (performType === 1) {
          rows.push({ ...base, rowKind: 'workAssess' })
          rows.push({ ...base, rowKind: 'workOverview' })
        } else if (performType === 2) {
          rows.push({ ...base, rowKind: 'assess' })
        } else if (performType === 3) {
          rows.push({ ...base, rowKind: 'comment' })
        }
      })
      return rows
    },
    parseAssessContentLabel(element, performType) {
      const text = (element || '').trim()
      const tryPrefixes = ['考核内容', '考核要素']
      const matchedPrefix = tryPrefixes.find(p => text.startsWith(p))
      if (!matchedPrefix) {
        return { label: '', element: text }
      }
      const lines = text.split('\n')
      const label = lines[0].trim()
      const rest = lines.slice(1).join('\n').trim()
      return { label, element: rest || label }
    },
    normalizePerformItems(items) {
      const sorted = [...items].sort((a, b) => a.performType - b.performType)
      const result = []
      const nextNum = { num: 1 }
      let i = 0
      while (i < sorted.length) {
        const item = sorted[i]
        if (item.performType === 3) {
          result.push({
            performType: 3,
            element: item.element || ''
          })
          i++
          continue
        }
        if (item.performType === 2) {
          const parsed = this.parseAssessContentLabel(item.element, 2)
          const label = this.resolveAssessContentLabel(
            parsed.label,
            item.assessContentLabel,
            nextNum
          )
          result.push({
            performType: 2,
            assessContentLabel: label,
            element: parsed.label ? parsed.element : item.element || '',
            standard: item.standard || '',
            weight: item.weight
          })
          i++
          continue
        }
        if (item.performType === 1) {
          if (item.assessContentLabel) {
            result.push({
              performType: 1,
              assessContentLabel: this.resolveAssessContentLabel(
                '',
                item.assessContentLabel,
                nextNum
              ),
              element: item.element || '',
              standard: item.standard || '',
              weight: item.weight,
              completeStatus: item.completeStatus || ''
            })
            i++
            continue
          }
          const isOverview =
            item.rowKind === 'overview' || (item.element || '').includes('情况概述')
          if (isOverview) {
            if (result.length && result[result.length - 1].performType === 1) {
              result[result.length - 1].completeStatus =
                item.completeStatus || item.element || ''
            }
            i++
            continue
          }
          const parsed = this.parseAssessContentLabel(item.element, 1)
          const label = this.resolveAssessContentLabel(
            parsed.label,
            '',
            nextNum
          )
          let completeStatus = item.completeStatus || ''
          if (
            i + 1 < sorted.length &&
            sorted[i + 1].performType === 1 &&
            (sorted[i + 1].rowKind === 'overview' ||
              (sorted[i + 1].element || '').includes('情况概述'))
          ) {
            completeStatus =
              sorted[i + 1].completeStatus || sorted[i + 1].element || ''
            i += 2
          } else {
            i++
          }
          result.push({
            performType: 1,
            assessContentLabel: label,
            element: parsed.element,
            standard: item.standard || '',
            weight: item.weight,
            completeStatus
          })
          continue
        }
        i++
      }
      return result
    },
    isOverallStandardFirstRow(rowIndex) {
      return rowIndex === 0
    },
    queryPersonPerformanceTemp() {
      queryPersonPerformanceTemp({ talentCode: this.talentCode }).then(res => {
        if (res.evaluationStandard !== undefined && res.evaluationStandard !== null) {
          this.evaluationStandard = res.evaluationStandard
        }
        const items = Array.isArray(res.data) ? res.data : []
        if (items.length > 0) {
          this.assessData = this.normalizePerformItems(items).map(item => ({
            ...item,
            performType: this.normalizePerformType(item.performType)
          }))
        } else {
          this.assessData = JSON.parse(JSON.stringify(this.defaultAssessContent))
        }
        this.$nextTick(() => {
          this.mountSummaryEvaluation()
        })
      })
    },
    assessSubmit() {
      const submitData = {
        talentCode: this.talentCode,
        performItems: this.assessData,
        evaluationStandard: this.evaluationStandard
      }
      upsertPersonPerformanceTemp(submitData).then(res => {
        if (res.success) {
          this.$message.success(res.message)
          this.clearAssess()
        }
      })
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (row.rowKind === 'comment') {
        if (columnIndex === 1) {
          return [1, 4]
        }
        if (columnIndex === 2 || columnIndex === 3 || columnIndex === 4) {
          return [0, 0]
        }
      }
      if (row.rowKind === 'workOverview') {
        if (columnIndex === 2) {
          return [1, 2]
        }
        if (columnIndex === 3) {
          return [0, 0]
        }
        if (columnIndex === 4 || columnIndex === 5 || columnIndex === 6) {
          return [0, 0]
        }
      }
      if (columnIndex === 4) {
        if (row.rowKind === 'workAssess') {
          return { rowspan: 2, colspan: 1 }
        }
        if (row.rowKind === 'workOverview') {
          return { rowspan: 0, colspan: 0 }
        }
      }
      if (columnIndex === 5) {
        if (row.rowKind === 'workAssess') {
          return { rowspan: 2, colspan: 1 }
        }
        if (row.rowKind === 'workOverview') {
          return { rowspan: 0, colspan: 0 }
        }
      }
      if (columnIndex === 0) {
        const _row = this.mergeColumn()[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return { rowspan: _row, colspan: _col }
      }
      if (columnIndex === 6) {
        if (this.isOverallStandardFirstRow(rowIndex)) {
          return {
            rowspan: this.tableDisplayData.length,
            colspan: 1
          }
        }
        return { rowspan: 0, colspan: 0 }
      }
    },
    mergeColumn() {
      const spanOneArr = []
      let concatOne = 0
      this.tableDisplayData.forEach((row, index) => {
        const performType = row.performType != null
          ? this.normalizePerformType(row.performType)
          : this.normalizePerformType(
            this.assessData[row._sourceIndex].performType
          )
        const prevRow = index > 0 ? this.tableDisplayData[index - 1] : null
        const prevPerformType = prevRow
          ? (prevRow.performType != null
            ? this.normalizePerformType(prevRow.performType)
            : this.normalizePerformType(
              this.assessData[prevRow._sourceIndex].performType
            ))
          : null
        if (index === 0 || performType !== prevPerformType) {
          spanOneArr.push(1)
          concatOne = index
        } else {
          spanOneArr[concatOne] += 1
          spanOneArr.push(0)
        }
      })
      return spanOneArr
    },
    getSummaries() {
      return ['', '', '', '', '', '本月评定：', '']
    },
    destroySummaryEvaluation() {
      if (this._summaryEvalVm) {
        this._summaryEvalVm.$destroy()
        this._summaryEvalVm = null
      }
    },
    mountSummaryEvaluation() {
      const tableRef = this.$refs.table
      if (!tableRef || !this.isTable) return
      const footerTr = tableRef.$el.querySelector('.el-table__footer-wrapper tbody tr')
      if (!footerTr) return
      const cells = footerTr.querySelectorAll('td')
      if (cells.length < 7) return
      const labelCell = cells[5]
      const selectCell = cells[6]
      this.destroySummaryEvaluation()
      for (let i = 0; i < 5; i++) {
        cells[i].innerHTML = ''
      }
      labelCell.style.textAlign = 'right'
      labelCell.style.verticalAlign = 'middle'
      const parent = this
      const Vm = Vue.extend({
        data() {
          return {
            localValue: parent.evaluationStandard
          }
        },
        watch: {
          localValue(val) {
            parent.evaluationStandard = val
          }
        },
        render(h) {
          return h(
            'el-select',
            {
              props: {
                value: this.localValue,
                placeholder: '请选择',
                clearable: true
              },
              style: { width: '100%' },
              on: {
                input: val => {
                  this.localValue = val
                }
              }
            },
            parent.evaluationStandardOptions.map(item =>
              h('el-option', {
                key: item,
                props: { label: item, value: item }
              })
            )
          )
        }
      })
      this._summaryEvalVm = new Vm()
      selectCell.innerHTML = ''
      this._summaryEvalVm.$mount()
      selectCell.appendChild(this._summaryEvalVm.$el)
    },
    clearAssess() {
      this.$emit('clearAssess')
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-dialog__body {
  padding: 0 20px;
}
.el-table {
  /deep/ th {
    padding: 6px 0;
    color: #555555;
    background: #fafafa;
  }
}

.assess-div {
  padding: 10px 0;
  background-color: #ecf5ff;
}
.assess-table {
  width: 95%;
  margin: auto;
  /deep/ .el-table__header th {
    text-align: center;
    background: linear-gradient(#98c9ff 37%, #f5f7fa 100%);
  }
  /deep/ .el-table__body td {
    padding: 5px;
    border-right: 2px dashed #dcdfe6;
    border-bottom: 2px dashed #dcdfe6;
  }
  /deep/ .el-table__footer-wrapper tbody td {
    padding: 5px 0;
  }
}
.assess-content-label {
  display: inline-block;
  font-weight: bold;
  color: #303133;
  line-height: 1.4;
  text-align: center;
}
.assess-content-label--multiline {
  display: block;
  > div {
    display: block;
    line-height: 1.5;
  }
}
.perform-type-label {
  font-weight: bold;
  color: #303133;
  line-height: 1.5;
  margin-bottom: 6px;
  > div {
    display: block;
  }
}
.work-overview-input {
  width: 100%;
}
.weight-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 48px;
}
.overall-standard {
  font-size: 13px;
  line-height: 1.6;
  color: #303133;
  p {
    margin: 0 0 6px;
  }
}
/deep/ .el-table__footer-wrapper tbody td:nth-child(6) {
  text-align: right;
  font-size: 14px;
  font-weight: bold;
  color: #303133;
}
.dialog-footer {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}
</style>
