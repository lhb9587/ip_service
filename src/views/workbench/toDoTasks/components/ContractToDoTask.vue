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
  </div>
</template>
<script>
import { getContractList } from "@/api/dashboard";
import Pagination from "@/components/Pagination";

export default {
  name: "ContractToDoTask",
  components: {
    Pagination,
  },
  activated() {
    this.fetchList()
  },
  data() {
    return {
      taskList: [],
      tableDefaultList: [
        { title: "合同号", value: "contractNo" },
        { title: "合同名称", value: "contractName" },
        { title: "合同类型", value: "contractType" },
        { title: "甲方", value: "partyA" },
        { title: "乙方", value: "partyB" },
        { title: "合同金额", value: "amount" },
        { title: "呈批人", value: "chargePerson" },
        { title: "提交日期", value: "contractUploadDate" },
        { title: "当前流程", value: "presentTaskName" },
        { title: "当前流程任务人", value: "presentHandlerName" },
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
      this.$router.push(`contract_detail/${row.contractId}`)
    },
    fetchList() {
      getContractList({
        page: this.listQuery.pageNo,
        pageSize: this.listQuery.pageSize,
        toBeReviewed: 1,
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
</style>
