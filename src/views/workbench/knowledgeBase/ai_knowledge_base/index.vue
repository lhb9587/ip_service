<template>
  <div>
    <el-button type="primary" size="mini" @click="createDetail()">添加</el-button>
    <el-button type="primary" size="mini" @click="batchSetting()">批量修改</el-button>
    <el-button v-if="isBatch" size="mini" @click="closeBatchSetting()">取消批量</el-button>
    <el-table
      ref="multipleTable"
      :data="tableData"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      max-height="750">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        type="index"
        label="序号"
        width="300">
      </el-table-column>
      <el-table-column
        prop="fullname"
        label="姓名">
      </el-table-column>
      <el-table-column
        label="操作"
        width="150">
        <template slot-scope="scope">
          <el-button v-if="!isBatch" type="text" size="small" @click="saveDetail(scope.row)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="配置知识库权限" :visible.sync="detailDialog" :append-to-body="true" @close="configData = []" :close-on-click-modal="false" class="detail" width="40%">
      <KnowledgeBaseAssignment v-if="detailDialog" :config-data="configData" @closeDialog="closeDetail()"></KnowledgeBaseAssignment>
    </el-dialog>
  </div>
</template>

<script>
import { queryKbLibUser } from '@/api/knowledgeBase.js'
import KnowledgeBaseAssignment from './components/KnowledgeBaseAssignment'
export default {
  name: 'index',
  data() {
    return {
      detailDialog: false,
      configData: [],
      tableData: [],
      isBatch: false,
    }
  },
  created() {
    this.queryList()
  },
  methods: {
    queryList() {
      queryKbLibUser().then(res => {
        this.tableData = res.data
      })
    },
    createDetail() {
      this.configData = []
      this.detailDialog = true
    },
    saveDetail(row) {
      this.detailDialog = true
      this.configData = [row]
    },
    // 关闭审核详情界面
    closeDetail() {
      this.detailDialog = false
      this.configData = []
      this.queryList()
    },
    handleSelectionChange(val) {
      console.log(val)
      this.isBatch = val.length > 0 ? true : false
      this.configData = val;
    },
    // 批量编辑
    batchSetting() {
      if(!this.configData.length > 0) {
        this.$message.warning('请勾选要编辑的人员');
        return
      }
      this.detailDialog = true
    },
    // 取消批量编辑
    closeBatchSetting() {
      this.isBatch = false
      this.$refs.multipleTable.clearSelection();
      this.configData = []
    }
  },
  components: {
    KnowledgeBaseAssignment
  },
}
</script>

<style lang="scss" scoped>
/deep/ .el-dialog__body{
  padding: 10px 20px 20px 20px
}
.detail /deep/ .el-dialog__body{
  padding: 0 0 15px 0;
}
.el-table{
  /deep/ th{
    padding: 6px 0;
    color: #555555;
    background: #FAFAFA;
  }
  /deep/ .cell {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
