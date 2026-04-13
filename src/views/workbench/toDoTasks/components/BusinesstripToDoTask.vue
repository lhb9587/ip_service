<template>
  <div>
    <el-table
      ref="todoTaskMultiple"
      :data="taskList"
      fit
      empty-text="暂无数据"
      highlight-current-row
      current-row-key
      style="width: 100%"
      :height="clientHeight"
    >
      <el-table-column
        v-for="(item, index) in tableDefaultList"
        :key="index"
        :label="item.title"
        align="left"
        :prop="item.value"
        :show-overflow-tooltip="true"
        :filters="
          unique(
            taskList.map((i) => ({
              text: i[item.value],
              value: i[item.value],
            })),
            'value'
          ).filter((ii) => ii.value)
        "
        :filter-method="filterHandler"
        :formatter="item.value === 'createDate' ? formatDate : null"
        sortable
        width="auto"
      ></el-table-column>

      <el-table-column
        label="操作"
        align="left"
        fixed="right"
        width="80"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="jumpContractDetail(scope.row)"
          >处理</el-button
          >
        </template>
      </el-table-column></el-table
    >
    <div style="margin-top: 10px;">
      <Pagination
        v-show="total > 0"
        :total="total"
        :page.sync="listQuery.pageNo"
        :limit.sync="listQuery.pageSize"
        @pagination="fetchList"
        :pageSizes="pageSizesList"
      />
    </div>

    <el-drawer
      :visible.sync="drawerStatus"
      :modal="false"
      size="50%"
      append-to-body
      title="出差申请"
    >
      <div slot="title">
        <div
          style="
            display: flex;
            align-items: center;
          "
        >
          <span
            v-if="appData.btId"
            style="font-size: 16px"
            >出差申请
            <span v-if="appData.wfStatus">
              <el-tag
                type="primary"
                v-if="appData.wfStatus == '待提交'"
                >{{ appData.wfStatus }}</el-tag
              >
              <el-tag
                type="warning"
                v-if="appData.wfStatus == '待审核'"
                >{{ appData.wfStatus }}</el-tag
              >
              <el-tag
                type="danger"
                v-if="appData.wfStatus == '审核退回'"
                >{{ appData.wfStatus }}</el-tag
              >
              <el-tag
                type="success"
                v-if="appData.wfStatus == '已完成'"
                >{{ appData.wfStatus }}</el-tag
              >
            </span>
          </span>
        </div>
      </div>
      <ViewDetail :appData="appData" />
      <div
        class="footer-actions"
        v-if="auditable"
      >
        <el-button
          type="info"
          :loading="rejectLoading"
          @click="auditHandle(0)"
          plain
          >退回</el-button
        >
        <el-button
          type="primary"
          :loading="passLoading"
          @click="auditHandle(1)"
          >通过</el-button
        >
      </div>
    </el-drawer>

    <el-dialog
      :visible.sync="auditDialogVisible"
      :title="currentAuditType === 1 ? '审核通过' : '审核退回'"
      width="500px"
      :close-on-click-modal="false"
      append-to-body
    >
      <el-form label-width="80px">
        <el-form-item label="审核意见">
          <el-input
            v-model="auditComment"
            type="textarea"
            :rows="4"
            placeholder="请输入审核意见（非必填）"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="auditDialogVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click="submitAudit"
          :loading="currentAuditType === 1 ? passLoading : rejectLoading"
        >
          提交
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getContractList } from "@/api/dashboard";
import {queryBusinessTripTodoTask, auditBusinessTrip} from "@/api/business";
import Pagination from "@/components/Pagination";
import ViewDetail from "./viewDetail.vue";
import dayjs from "dayjs";

export default {
  name: "BusinesstripToDoTask",
  components: {
    Pagination,
    ViewDetail,
  },
  activated() {
    this.fetchList()
  },
  data() {
    return {
      drawerStatus: false,
      appData: {},
      auditable: false,
      rejectLoading: false,
      passLoading: false,
      auditDialogVisible: false,
      currentAuditType: null,
      auditComment: '',
      taskList: [],
      tableDefaultList: [
        { title: "申请人", value: "userIdStr" },
        { title: "申请时间", value: "createDate" },
        { title: "出差类型", value: "tripTypeStr" },
        { title: "同行人", value: "companionsStr" },
        { title: "出发城市", value: "departureCity" },
        { title: "到达城市", value: "destinationCity" },
        { title: "开始时间", value: "startDate" },
        { title: "结束时间", value: "endDate" },
        { title: "出差天数", value: "tripDays" },
        { title: "审核状态", value: "wfStatus" },
      ],
      total: 0,
      listQuery: {
        pageNo: 1,
        pageSize: JSON.parse(localStorage.getItem("pageSize"))
          ? JSON.parse(localStorage.getItem("pageSize")).find(
            (item) => item.name == this.$route.name
          )
            ? JSON.parse(localStorage.getItem("pageSize")).find(
              (item) => item.name == this.$route.name
            ).pageSize
            : 10
          : 10,
      },
      pageSizesList: [10, 50, 100, 200, 300, 400, 500],
    };
  },
  computed: {
    clientHeight() {
      return document.documentElement.clientHeight - 180;
    },
  },
  methods: {
    jumpContractDetail(row) {
      this.appData = { ...row };
      this.drawerStatus = true;
      this.auditable = row.wfStatus === '待审核';
    },
    auditHandle(type) {
      this.currentAuditType = type;
      this.auditComment = '';
      this.auditDialogVisible = true;
    },
    submitAudit() {
      if (this.currentAuditType) {
        this.passLoading = true;
      } else {
        this.rejectLoading = true;
      }
      const params = {
        btId: this.appData.btId,
        result: this.currentAuditType,
        taskId: this.appData.taskId,
        auditComment: this.auditComment
      };
      auditBusinessTrip(params).then((res) => {
        this.passLoading = false;
        this.rejectLoading = false;
        if (res.success) {
          this.$message.success("操作成功");
          this.fetchList();
          this.resetData();
          this.auditDialogVisible = false;
          this.auditComment = '';
        }
      });
    },
    resetData() {
      this.drawerStatus = false;
      this.appData = {};
      this.auditable = false;
    },
    fetchBtList() {
      this.fetchList();
    },
    fetchList() {
      queryBusinessTripTodoTask({
        pageNo: this.listQuery.pageNo,
        pageSize: this.listQuery.pageSize,
      }).then((res) => {
        this.taskList = res.data || [];
        this.total = res.total || 0;
      });
    },
    filterHandler(value, row, column) {
      const property = column["property"];
      return row[property] === value;
    },
    unique(data, key) {
      const hash = {};
      const data2 = data.reduce((preVal, curVal) => {
        hash[curVal[key]]
          ? ""
          : (hash[curVal[key]] = true && preVal.push(curVal));
        return preVal;
      }, []);
      return data2;
    },
    formatDate(row, column, cellValue) {
      if (!cellValue) return '';
      return dayjs(cellValue).format("YYYY-MM-DD HH:mm:ss");
    },
  },
  created() {
    this.fetchList();
  },
};
</script>
<style lang="scss" scoped>
.el-table {
  /deep/ th {
    padding: 5px 0;
  }
  /deep/ td {
    padding: 0;
  }
  /deep/ .cell {
    white-space: nowrap;
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
.el-dropdown {
  margin-left: 10px;
  cursor: pointer;
  line-height: 1;
  position: relative;
  top: -1px;
  .el-dropdown-link {
    color: #fff;
    background-color: #409eff;
    border-color: #409eff;
    padding: 7px 15px;
    font-size: 12px;
    border-radius: 3px;
    line-height: 1;
    &:hover {
      background: #66b1ff;
      border-color: #66b1ff;
      color: #fff;
    }
  }
}
.footer-actions {
  position: fixed;
  bottom: 0;
  right: 0;
  width: 50%;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 20px;
  border-top: 1px solid #e8e8e8;
  background-color: #fff;
  z-index: 10;
}
</style>
