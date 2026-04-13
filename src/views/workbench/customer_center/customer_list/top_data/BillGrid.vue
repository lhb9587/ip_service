<template>
  <div class="app-container">
    <!--    <TitleTotal :total="total"/>-->
    <!--    <AgGridVue-->
    <!--      :style="{width:'100%',height: 350+'px'}"-->
    <!--      class="ag-theme-balham"-->
    <!--      :columnDefs="columnDefs"-->
    <!--      :rowData="list"-->
    <!--      rowSelection="multiple"-->
    <!--      @grid-ready="onGridReady"-->
    <!--      :gridOptions="gridOptions"-->
    <!--      :getContextMenuItems="getContextMenuItems"-->
    <!--      suppressAutoSize-->
    <!--      animateRows-->
    <!--      @sortChanged="refreshEvenRowsCurrencyData"-->
    <!--      @filterChanged="refreshEvenRowsCurrencyData"-->
    <!--      :localeText="$store.state.caseInformation.localeText"-->
    <!--    >-->
    <!--    </AgGridVue>-->
    <el-table border max-height="350" size="mini" :data="list" fit empty-text="暂无数据"
              highlight-current-row
              current-row-key style="width: 100%;">
      <el-table-column align="left" width="200px">
        <template slot="header" slot-scope="scope">
          <span>客户名称 </span>({{list.length}})
        </template>
        <template slot-scope="scope">
          <div>{{scope.row.name}}</div>
        </template>
      </el-table-column>
      <el-table-column align="left" width="180px">
        <template slot="header" slot-scope="scope">
          <span>账单金额 </span>({{list.reduce((pre, next) => pre + next.custAmount, 0).toFixed(2)}})
        </template>
        <template slot-scope="scope">
          {{scope.row.custAmount}}
        </template>
      </el-table-column>
      <el-table-column label="案件数量" align="left" width="100px">
        <template slot-scope="scope">
          {{scope.row.caseCount}}
        </template>
      </el-table-column>
      <el-table-column label="领域" align="left" width="100px">
        <template slot-scope="scope">
          {{scope.row.firstcaseCollitem}}
        </template>
      </el-table-column>
      <el-table-column label="介绍人" align="left" width>
        <template slot-scope="scope">
          {{scope.row.custIntroductor}}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
  import {queryNewCustYejiDetail} from "../../../../../api/customerList";

  export default {
    name: 'BillCustGrid',
    data() {
      return {
        drawerState: false,
        list: [],
        currentPageSize: 0,
      };
    },
    created() {
      this.getList()
    },
    computed: {},
    methods: {
      getList(type) {
        if (type === 'search') {
          this.listQuery.pageNo = '1'
        }
        this.listLoading = true
        queryNewCustYejiDetail({pageSize: 99999}).then(response => {
          this.list = response.data
          this.total = response.total
          this.listLoading = false
          this.drawerState = false
        })
      },
    }
  };
</script>

<style lang="scss" scoped>
  > > > .header-table {
    margin-top: 10px;
    padding: 0 0 0 15px;

    .el-table__header-wrapper {
      border: 1px solid #EBEEF5;
      border-bottom: none;

      th {
        background-color: #FFFFFF;
        font-size: 16px;
        color: #555555;
        font-weight: normal;
      }
    }
  }

</style>

