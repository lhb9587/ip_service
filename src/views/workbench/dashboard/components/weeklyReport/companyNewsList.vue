<template>
  <div>
<!--      <el-select v-model="talentName" @change="queryList" size="small" filterable clearable placeholder="姓名">-->
<!--        <el-option-->
<!--          v-for="item in userList"-->
<!--          :key="item.talentName"-->
<!--          :label="item.talentName"-->
<!--          :value="item.talentName">-->
<!--        </el-option>-->
<!--      </el-select>-->
      <el-table
        :data="tableData"
        style="width: 100%"
        max-height="550">
        <el-table-column
          prop="name"
          label="快讯名称"
          width="250">
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <div class="company-list">
              <el-button type="text" size="small" @click="handleOffice(scope.row)"><i class="el-icon-edit"></i>{{scope.row.docName }}</el-button>
              <el-button type="text" size="small" @click="handleView(scope.row)"><i class="el-icon-view"></i></el-button>
              <el-upload
                class="upload"
                name="attachFile"
                :show-file-list="false"
                :data="{tokenID:$store.getters.token,materialId:scope.row.materialId}"
                :action="uploadFlashMaterial"
                :on-success="handleSuccess">
                <el-button type="text" class="company-button" size="small">上传文件 </el-button>
              </el-upload>
              <el-button type="text" class="company-button" size="small" @click="downLoad(scope.row)">导出</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.pageNo"
        :limit.sync="listQuery.pageSize"
        @pagination="queryList"
        :pageSizes="pageSizesList"
      />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination';
import { queryWeekReportDoc } from '@/api/dashboard'
import {doEditInOffice, getProgID} from '@/utils/editInOffice.js'
import { uploadFlashMaterial } from "@/api/serviceApi.config.js";
export default {
  name: 'companyNewsList',
  data() {
    return {
      total: 0,
      pageSizesList: [10, 20, 50, 100],
      uploadFlashMaterial,
      listQuery: {
        pageNo: 1,
        pageSize: 10
      },
      tableData: []
    }
  },
  created() {
    this.queryList()
  },
  methods: {
    // 获取审核列表
    queryList() {
      // 搜索条件查询
      const data = {
        pageNo: this.listQuery.pageNo,
        pageSize: this.listQuery.pageSize,
      }
      queryWeekReportDoc(data).then(res => {
        this.total = res.total
        this.tableData = res.data
      })
    },
    // 在线编辑
    handleOffice(row) {
      if (getProgID(`${row.address}`)) {
        doEditInOffice(`${row.address}`, getProgID(`${row.address}`))
      }
    },
    handleView(row) {
      this.$commonUtils.viewPdf(row.address)
    },
    // 上传成功
    handleSuccess() {
      this.$message.success('快讯上传成功！');
      this.queryList()
    },
    // 附件下载
    downLoad(data){
      const url = data.address
      const downData={
        url:`ipdoc${url}`,
        success(){
          // notify.close()
        }
      }
      this.$commonUtils.downLoadAll(downData)
    },
  },
  components: {
    Pagination
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
  /deep/ td{
    padding: 6px 0;
  }
}
.company-list .el-button{
  float: left;
}
.company-list .upload{
  float: left;
}
.company-button {
  color: red;
  padding: 9px 5px;
}
</style>
