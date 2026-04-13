<template>
  <div>
    <el-button type="primary" size="mini" @click="detailDialog = true">添加</el-button>
    <el-table
      :data="tableData"
      style="width: 100%"
      max-height="550">
      <el-table-column
        prop="userFullName"
        label="编写人"
        width="80">
      </el-table-column>
      <el-table-column
        prop="content"
        label="内容">
      </el-table-column>
      <el-table-column
        label="操作"
        width="100">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="saveDetail(scope.row)">修改</el-button>
          <el-button type="text" size="small" @click="deleteId(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="内部管理详情" :visible.sync="detailDialog" :append-to-body="true" :close-on-click-modal="false" class="detail" width="70%">
      <NeibuGuanliDetail v-if="detailDialog" :date-array="dateArray" :detail-info="detailInfo" @closeDetail="closeDetail()"></NeibuGuanliDetail>
    </el-dialog>
  </div>
</template>

<script>
import { queryNeibuGuanliList,delNeibuGuanli } from '@/api/dashboard'
import NeibuGuanliDetail from './NeibuGuanliDetail'
export default {
  name: 'NeibuGuanliList',
  props: ['date-array'],
  data() {
    return {
      detailDialog: false,
      detailInfo: {
        id: 0,
        content: ''
      },
      tableData: []
    }
  },
  created() {
    this.queryList()
  },
  methods: {
    queryList() {
      // 搜索条件查询
      const data = {
        createDateArray: this.dateArray
      }
      queryNeibuGuanliList(data).then(res => {
        this.tableData = res.data
      })
    },
    saveDetail(row) {
      this.detailDialog = true
      this.detailInfo = row
    },
    deleteId(row){
      delNeibuGuanli({wngId:row.wngId}).then(res => {
        if(res.success){
          this.$message.success('删除成功');
          this.queryList()
        }
      })
    },
    // 关闭审核详情界面
    closeDetail() {
      this.detailDialog = false
      this.detailInfo = {}
      this.queryList()
    }
  },
  components: {
    NeibuGuanliDetail
  },
}
</script>

<style lang="scss" scoped>
/deep/ .el-dialog__body{
  padding: 10px 20px 20px 20px
}
.detail /deep/ .el-dialog__body{
  padding: 0;
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
