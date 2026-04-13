<template>
  <div>
    <el-dialog title="审核列表" :visible.sync="auditListDialog" width="70%" @close="closeAuditList()">
      <el-select v-model="talentName" @change="queryAuditList" size="small" filterable clearable placeholder="姓名">
        <el-option
          v-for="item in userList"
          :key="item.talentName"
          :label="item.talentName"
          :value="item.talentName">
        </el-option>
      </el-select>
      <el-table
        :data="tableData"
        style="width: 100%"
        max-height="550">
        <el-table-column
          prop="talentName"
          label="人员"
          width="180">
        </el-table-column>
        <el-table-column
          prop="submitDate"
          label="变更日期"
          width="180">
        </el-table-column>
        <el-table-column
          prop="submitUser"
          label="变更人">
        </el-table-column>
        <el-table-column
          prop="auditStatus"
          label="状态">
          <template v-slot="scope">
            <span v-if="scope.row.auditStatus === 0">未审核</span>
            <span v-if="scope.row.auditStatus === 1">审核通过</span>
            <span v-if="scope.row.auditStatus === 2">审核未通过</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="auditDate"
          label="审核日期">
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="handleAudit(scope.row)">{{ scope.row.auditStatus === 0 ? '审核' : '查看' }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.pageNo"
        :limit.sync="listQuery.pageSize"
        @pagination="queryAuditList"
      />
    </el-dialog>
    <el-dialog :title="auditInfo.talentName+' -信息变更审核'" :visible.sync="auditDetailDialog" class="audit-detail" width="70%">
      <AuditDetail v-if="auditDetailDialog" :audit-info="auditInfo" @closeAuditDetail="closeAuditDetail()"></AuditDetail>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination';
import { queryAuditList, queryPersonAll } from '@/api/hrmList'
import AuditDetail from './AuditDetail'
export default {
  name: 'AuditList',
  data() {
    return {
      total: 12,
      auditListDialog: true,
      auditDetailDialog: false,
      auditInfo: {
        auditStatus: 0,
        talentName: '',
        auditId: 0,
        changedFields: []
      },
      defaultAuditInfo: {
        auditStatus: 0,
        talentName: '',
        auditId: 0,
        changedFields: []
      },
      listQuery: {
        pageNo: 1,
        pageSize: 10
      },
      talentName: '',
      userList: [], // 用户列表
      tableData: []
    }
  },
  created() {
    this.queryAuditList()
    this.queryPersonAll()
  },
  methods: {
    // 获取审核列表
    queryAuditList() {
      // 搜索条件查询
      const data = {
        talentName: this.talentName,
        pageNo: this.listQuery.pageNo,
        pageSize: this.listQuery.pageSize,
      }
      queryAuditList(data).then(res => {
        this.total = res.total
        this.tableData = res.data
      })
    },
    queryPersonAll() {
      queryPersonAll({ empStatus: '在职' }).then(res => {
        if (res.success) {
          this.userList = res.data
        }
      })
    },
    // 审核详情
    handleAudit(row) {
      this.auditDetailDialog = true
      this.auditInfo.auditStatus = row.auditStatus
      this.auditInfo.talentName = row.talentName
      this.auditInfo.auditId = row.id
      this.auditInfo.talentCode = row.talentCode
      this.auditInfo.changedFields = row.changedFields
    },
    // 关闭审核列表
    closeAuditList() {
      this.$emit('closeAuditList')
    },
    // 关闭审核详情界面
    closeAuditDetail() {
      this.auditDetailDialog = false
      this.queryAuditList()
    }
  },
  components: {
    Pagination,
    AuditDetail
  },
  watch: {
    auditDetailDialog() {
      if (!this.auditDetailDialog) {
        // this.auditInfo = JSON.parse(JSON.stringify(this.defaultAuditInfo))
      }
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-dialog__body{
  padding: 10px 20px 20px 20px
}
.audit-detail /deep/ .el-dialog__body{
  padding: 0;
}
.el-table{
  /deep/ th{
    padding: 6px 0;
    color: #555555;
    background: #FAFAFA;
  }
}
</style>
