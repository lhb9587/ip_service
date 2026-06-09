<template>
  <div>
    <el-table
      ref="todoTaskMultiple"
      :data="taskList"
      fit
      :empty-text="emptyText"
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
        :width="item.width"
        :min-width="item.minWidth"
        :show-overflow-tooltip="true"
        :filters="
          unique(
            taskList.map((i) => ({
              text: i[item.value],
              value: i[item.value]
            })),
            'value'
          ).filter((ii) => ii.value)
        "
        :filter-method="filterHandler"
        sortable
      ></el-table-column>

      <el-table-column
        :label="operationTitle"
        align="left"
        fixed="right"
        width="80"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="jumpInvestigationProtectionDetail(scope.row)"
          >{{ processText }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 10px;">
      <Pagination
        v-show="total > 0"
        :total="total"
        :page.sync="listQuery.pageNo"
        :limit.sync="listQuery.pageSize"
        :pageSizes="pageSizesList"
        @pagination="fetchList"
      />
    </div>
  </div>
</template>

<script>
import { getInvestTaskList } from '@/api/dashboard'
import Pagination from '@/components/Pagination'

export default {
  name: 'InvestigationProtectionToDoTask',
  components: {
    Pagination
  },
  data() {
    return {
      emptyText: '\u6682\u65e0\u6570\u636e',
      operationTitle: '\u64cd\u4f5c',
      processText: '\u5904\u7406',
      taskList: [],
      tableDefaultList: [
        { title: '\u6848\u4ef6\u6587\u53f7', value: 'agentNum' },
        { title: '\u6848\u4ef6\u540d\u79f0', value: 'caseName', minWidth: 180 },
        { title: '\u5ba2\u6237', value: 'custName', minWidth: 110 },
        { title: '\u5ba2\u6237\u7ec4', value: 'custGroupIdStr' , minWidth: 110},
        { title: '\u7701\u4efd', value: 'provinceName', width: 90 },
        { title: '\u57ce\u5e02', value: 'cityName', width: 90 },
        { title: '\u5de5\u4f5c\u7c7b\u522b', value: 'categoryName', minWidth: 120 },
        { title: '\u6d41\u7a0b\u72b6\u6001', value: 'wfStatus' },
        { title: '\u4efb\u52a1\u4eba', value: 'tasker' },
        { title: '\u4e0b\u8fbe\u4eba', value: 'createUserIdStr' },
        { title: '\u4efb\u52a1\u7f16\u53f7', value: 'invtNo' }
      ],
      total: 0,
      listQuery: {
        pageNo: 1,
        pageSize: JSON.parse(localStorage.getItem('pageSize'))
          ? JSON.parse(localStorage.getItem('pageSize')).find(
            (item) => item.name == this.$route.name
          )
            ? JSON.parse(localStorage.getItem('pageSize')).find(
              (item) => item.name == this.$route.name
            ).pageSize
            : 10
          : 10
      },
      pageSizesList: [10, 50, 100, 200, 300, 400, 500]
    }
  },
  computed: {
    clientHeight() {
      return document.documentElement.clientHeight - 180
    }
  },
  created() {
    this.fetchList()
  },
  activated() {
    this.fetchList()
  },
  methods: {
    jumpInvestigationProtectionDetail(row) {
      this.$router.push(`/workbench/investigation-protection?invtId=${row.invtId}&layout=no&todoList=1`)
    },
    fetchList() {
      getInvestTaskList({
        page: this.listQuery.pageNo,
        pageSize: this.listQuery.pageSize,
        todoList: 1
      }).then((res) => {
        this.taskList = res.data || []
        this.total = res.total || 0
        this.$emit('updateTotal', this.total)
      })
    },
    filterHandler(value, row, column) {
      const property = column['property']
      return row[property] === value
    },
    unique(data, key) {
      const hash = {}
      const data2 = data.reduce((preVal, curVal) => {
        hash[curVal[key]]
          ? ''
          : (hash[curVal[key]] = true && preVal.push(curVal))
        return preVal
      }, [])
      return data2
    }
  }
}
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
</style>
