<template>
  <div>
    <div>
      <el-form label-width="136px" class="autowrite-form">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="案件文号:">
              <div style="display: flex">
                <el-input
                  v-model="queryModuleData.agentNumStart"
                  placeholder="请输入内容"
                  @change="changeTextRange"
                  clearable
                  size="small"
                ></el-input>
                <div>至</div>
                <el-input
                  v-model="queryModuleData.agentNumEnd"
                  placeholder="请输入内容"
                  clearable
                  size="small"
                ></el-input>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="多个案件文号:">
              <el-input
                clearable
                v-model="queryModuleData.agentNums"
                placeholder="请输入案件文号"
                type="textarea"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="任务创建人:">
              <el-select
                default-first-option
                :clearable="true"
                placeholder="请选择"
                v-model="queryModuleData.createUserId"
                filterable
                size="small"
              >
                <el-option
                  v-for="item in $store.getters.userList"
                  :key="item.userId"
                  :label="item.fullname"
                  :value="item.userId"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="任务开始时间范围:" class="date-select-item">
              <DataPicker
                class="DataPicker"
                v-model="queryModuleData.startWriteDateArray"
              ></DataPicker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="任务结束时间范围:" class="date-select-item">
              <DataPicker
                class="DataPicker"
                v-model="queryModuleData.endWriteDateArray"
              ></DataPicker>
            </el-form-item>
          </el-col>
          <el-col
            :span="4"
            :offset="1"
            style="display: flex; align-items: center"
          >
            <el-button type="primary" size="small" @click="fetchData"
              >搜索</el-button
            >
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-table
      ref="autoWriteListRef"
      :data="dataList"
      fit
      empty-text="暂无数据"
      highlight-current-row
      current-row-key
      style="width: 100%"
      :height="clientHeight"
    >
      <el-table-column
        :label="item.title"
        align="left"
        v-for="(item, index) in columnsList"
        :key="index"
        :width="item.width ? item.width : 'auto'"
        :prop="item.value"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span
            v-if="item.value === 'flName'"
            style="cursor: pointer; color: #409eff"
            @click="onlineEdit(scope.row)"
            >{{ scope.row.flName }}</span
          >
          <span
            v-else-if="item.value === 'agentNum'"
            style="cursor: pointer; color: #409EFF"
            @click="gotoCaseDetail(scope.row)"
          >
            {{ scope.row.agentNum }}
          </span>
          <span v-else>
            {{ scope.row[item.value] }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="left" fixed="right" width="150">
        <template slot-scope="scope">
          <!-- <el-button
            type="text"
            size="small"
            :disabled="scope.row.status !== '已完成'"
            @click="() => onlineEdit(scope.row)"
            >在线编辑</el-button
          > -->
          <el-button
            type="text"
            size="small"
            @click="saveDownloadRecord(scope.row)"
            :disabled="scope.row.status !== '已完成'"
            >下载</el-button
          >
          <el-button
            type="text"
            size="small"
            style="color: red"
            @click="delTask(scope.row)"
            >删除</el-button
          >
          <el-button
            type="text"
            size="small"
            :disabled="scope.row.status !== '已完成'"
            @click="archive(scope.row)"
            >存档</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import {
  queryAutowriteTaskRecord,
  deleteAutowriteDoc,
  saveAutowriteDownloadRecord,
  saveMaterialToCase,
} from "@/api/dashboard";
import { doEditInOffice, getProgID } from "@/utils/editInOffice";

export default {
  name: "autoWrite",
  data() {
    return {
      dataList: [],
      queryModuleData: {},
      columnsList: [
        { title: "案件文号", value: "agentNum", width: 140 },
        { title: "文件类型", value: "flType", width: 120 },
        { title: "状态", value: "status" },
        { title: "开始时间", value: "startWriteDate", width: 150 },
        { title: "完成时间", value: "endWriteDate", width: 150 },
        { title: "任务创建人", value: "createTaskUser", width: 120 },
        { title: "文件名", value: "flName", width: 200 },
        { title: "下载次数", value: "dlCount" },
        { title: "最后下载时间", value: "dlDate", width: 150 },
        { title: "存档人", value: "saveUser" },
        { title: "存档时间", value: "saveDate", width: 150 },
        // { title: "删除人", value: "delUser" },
        // { title: "删除时间", value: "delDate", width: 150 },
      ],
    };
  },
  computed: {
    clientHeight() {
      return document.documentElement.clientHeight - 240;
    },
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    gotoCaseDetail(row){
      this.$router.push('/workbench/case/case_detail/'+row.caseId+'/'+row.caseType+`?caseTypeId=${row.caseTypeId}`)
    },
    fetchData() {
      const params = {
        ...this.queryModuleData,
      };
      if (params.startWriteDateArray) {
        if (!params.startWriteDateArray[0] || !params.startWriteDateArray[1]) {
          delete params.startWriteDateArray;
        }
      }
      if (params.endWriteDateArray) {
        if (!params.endWriteDateArray[0] || !params.endWriteDateArray[1]) {
          delete params.endWriteDateArray;
        }
      }
      queryAutowriteTaskRecord(this.$commonUtils.cleanNullAttr(params)).then(
        (res) => {
          this.dataList = res.data || [];
        }
      );
    },
    changeTextRange(e) {
      this.$set(this.queryModuleData, "agentNumEnd", e);
    },
    onlineEdit(data) {
      const url = data.address;
      if (url) {
        doEditInOffice(url, getProgID(url));
      }
    },
    delTask(data) {
      this.$confirm("确定要删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        deleteAutowriteDoc({ atrId: data.atrId }).then((res) => {
          if (res.success) {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.fetchData();
          }
        });
      });
    },
    saveDownloadRecord(data) {
      const url = data.address;
      this.$commonUtils.downLoadAll({ url: `ipdoc${url}` });
      saveAutowriteDownloadRecord({ atrId: data.atrId }).then((res) => {
        if (res.success) {
          this.fetchData();
        }
      });
    },
    archive(data) {
      saveMaterialToCase({ atrId: data.atrId }).then((res) => {
        if (res.success) {
          this.$message.success("存档成功");
          this.fetchData();
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.el-table {
  /deep/ th {
    padding: 8px 0;
  }
  /deep/ td {
    padding: 6px 0;
  }
}
.el-table {
  width: auto;
  /deep/ tr:nth-of-type(1) {
    th {
      background: rgba(242, 242, 242, 1);
    }
  }
}
.date-select-item {
  /deep/ .el-input__inner {
    line-height: 32px;
    height: 32px;
  }
}
</style>
