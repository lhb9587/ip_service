<template>
  <div>
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="在库信息" name="0"></el-tab-pane>
      <el-tab-pane label="借出信息" name="1"></el-tab-pane>
      <el-tab-pane label="寄出信息" name="4"></el-tab-pane>
      <el-tab-pane label="销毁信息" name="6"></el-tab-pane>
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        :max-height="(statementBottomHeight.replace('px','') >130) ? statementBottomHeight.replace('px','') : 130"
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
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: "sampleInfoGrid",
  components: {

  },
  props: {
    sampleInfo: {
      type: Object,
      default: () => []
    },
    statementBottomHeight: {
      default: '100%',
      type: String
    }
  },
  data() {
    return {
      activeName: 0,
      tableHeader: [],
      tableData: []
    }
  },
  computed: {

  },
  watch: {
    sampleInfo() {
      this.init(this.sampleInfo)
    },
    activeName() {
      this.init(this.sampleInfo)
    }
  },
  created() {
    console.log(this.statementBottomHeight.replace('px',''))
  },
  methods: {
    init(sampleInfo) {
      if (JSON.stringify(sampleInfo)!=='{}'){
        switch (this.activeName) {
          case '0':
            this.tableHeader = [
              { name: '数量', field: 'quantity' },
              { name: '位置', field: 'position' },
              { name: '备注', field: 'remarks' }
            ]
            this.tableData = [{
              quantity: sampleInfo.quantity,
              position: sampleInfo.position,
              remarks: sampleInfo.remarks
            }]
            break
          case '1':
            this.tableHeader = [
              { name: '借出人', field: 'operator' },
              { name: '借出日期', field: 'recordDate' },
              { name: '数量', field: 'number' },
              { name: '归还数量', field: 'returnNumber' },
              { name: '归还日期', field: 'returnDate' },
              { name: '位置', field: 'recordPosition' },
              { name: '备注', field: 'remarks' }
            ]
            var lendData = []
            sampleInfo.recordArray && sampleInfo.recordArray.forEach(item => {
              if (item.recordType == this.activeName){
                item.recordPosition = sampleInfo.position
                lendData.push(item)
              }
            })
            this.tableData = lendData
            break
          case '4':
            this.tableHeader = [
              { name: '寄出日期', field: 'recordDate' },
              { name: '寄件人', field: 'operator' },
              { name: '寄出数量', field: 'number' },
              { name: '地址', field: 'expressAddr' },
              { name: '快递单', field: 'expresNo' },
              { name: '位置', field: 'recordPosition' },
              { name: '备注', field: 'remarks' }
            ]
            var mailData = []
            sampleInfo.recordArray && sampleInfo.recordArray.forEach(item => {
              if (item.recordType == this.activeName){
                item.recordPosition = sampleInfo.position
                mailData.push(item)
              }
            })
            this.tableData = mailData
            break
          case '6':
            this.tableHeader = [
              { name: '销毁日期', field: 'recordDate' },
              { name: '销毁人', field: 'operator' },
              { name: '销毁数量', field: 'number' },
              { name: '备注', field: 'remarks' }
            ]
            var destructData = []
            sampleInfo.recordArray && sampleInfo.recordArray.forEach(item => {
              if (item.recordType == this.activeName){
                item.recordPosition = sampleInfo.position
                destructData.push(item)
              }
            })
            this.tableData = destructData
            break
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
>>> .el-table td{
  padding: 2px;
}
>>> .el-table th{
  padding: 5px;
}
</style>
