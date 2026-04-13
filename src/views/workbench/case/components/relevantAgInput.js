import Vue from 'vue'
import { queryCaseByagent } from '@/api/caseList'

export default Vue.extend({
  template: `
    <el-popover v-model="fwfPopShow" width class="inputshow" placement="bottom" trigger="click">
      <el-table size="mini" @row-click="fwtableClick" :data="gridData" style="height:250px;overflow: scroll;">
        <el-table-column width="200" property="agentNum" label="案件文号"></el-table-column>
        <el-table-column width="200" property="caseName" label="案件名称"></el-table-column>
        <el-table-column width="200" property="custName" label="客户"></el-table-column>
      </el-table>
      <el-input :ref="'input'" type="text" size="small" slot="reference" autosize :title="value"
                v-debounce:fwfinputchange="'input',300" v-model="value"></el-input>
    </el-popover>
  `
  ,
  data() {
    return {
      value: '',
      gridData: [],
      cancelBeforeStart: true,
      loading: false,
      fwfPopShow: false
    }
  },
  methods: {
    getValue() {
      return this.value;
    },
    // isCancelBeforeStart() {
    //   return this.cancelBeforeStart;
    // },
    fwfinputchange() {
      this.params.data['relevantCaseId'] = ''
      if (this.value != '') {
        queryCaseByagent({ agentNums: this.value, business: this.business }).then(res => {
          this.gridData = res.data
          this.fwfPopShow = true
          this.fwfPopShow = !!this.gridData.length
        })
      }
    },
    fwtableClick(row) {
      this.params.data['relevantAgent'] = row.agentNum
      // this.params.data['relevantReason'] = row.caseName
      this.params.data['relevantCaseId'] = row.caseId
      // this.params.data['billRecordId'] = row.billRecordId
      this.value = row.agentNum
      this.params.api.refreshCells()
      this.fwfPopShow = false
    }

  },
  created() {
    this.value = this.params.value
    this.business = this.params.data.business
  },
  watch: {
    value(n, o) {
      this.params.data[this.params.colDef.field] = n
    }
  },
  mounted() {
    Vue.nextTick(() => {
      if (this.$refs.input) {
        this.$refs.input.focus()
      }
    })
  }
})
