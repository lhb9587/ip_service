<template>
  <div class="app-container">
    <header class="y-header">{{$route.meta.title}}</header>
    <div class="filter-container" style="margin-bottom:15px">
      <el-form :inline="true" :model="listQuery" size="small" class="demo-form-inline">

        <el-form-item label="官方机构名称">
          <el-select default-first-option :clearable='true' v-model="listQuery.keyword" no-match-text='暂无数据' loading-text='正在查询' filterable remote reserve-keyword placeholder="请输入关键词"
            :remote-method="remotepaternalUnit">
            <el-option v-for="item in seletData.custnames" :key="item.custId" :label="item.name" :value="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="国籍">
          <el-select default-first-option :clearable='true' placeholder="请选择" v-model="listQuery.country" filterable>
            <el-option v-for="item in seletData.country" :key="String(item.countryCn)" :label="item.countryCn" :value="String(item.countryCn)">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审查状态">
          <el-select default-first-option :clearable='true' placeholder="请选择" v-model="listQuery.examineStatuss" filterable>
            <el-option v-for="item in seletData.scStatu" :key="String(item.id)" :label="item.typeName" :value="String(item.id)">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="创建日期">
          <el-date-picker v-model="listQuery.createTime" format='yyyy-MM-dd' value-format="yyyy-MM-dd" align="right" type="date" placeholder="选择日期" :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="listQuery.keyword" placeholder="请输入查询内容..."></el-input>
        </el-form-item>

      </el-form>
      <el-row>
        <el-col :span="24" style="text-align:center ">
          <el-button class="filter-item" type="primary" @click="getList('search')" size="small" icon="el-icon-search">搜索
          </el-button>
          <el-button class="filter-item" type="primary" @click="clearSeach" size="small" icon="el-icon-delete">清除
          </el-button>
          <!-- <el-button v-allow="61" class="filter-item" type="primary" @click="clearSeach" size="small" icon="el-icon-delete">审查
          </el-button> -->
          <router-link v-allow="60" :to="'./official_creat'">
            <el-button type="primary" size="small" icon="el-icon-edit">创建</el-button>
          </router-link>
        </el-col>
      </el-row>
    </div>
    <TitleTotal :total="total" />
<!--    <el-table size="mini" :data="list" border fit empty-text="暂无数据" highlight-current-row current-row-key style="width: 100%;">-->
<!--      <el-table-column type="index" width="50" label="序号" align="left"></el-table-column>-->
<!--      <el-table-column label="官方机构名称" align="left" width>-->
<!--        <template slot-scope="scope">-->
<!--          <span class="itemTitle_style" @click="$router.push('./official_edit/'+scope.row.custId)">{{ scope.row.name }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column label="国籍" align="left" width>-->
<!--        <template slot-scope="scope">-->
<!--          <span>{{ scope.row.country }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->

<!--      <el-table-column label="审查状态" align="left" width>-->
<!--        <template slot-scope="scope">-->
<!--          <span>{{ scope.row.examineStatusStr }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column label="创建日期" align="left" width>-->
<!--        <template slot-scope="scope">-->
<!--          <span>{{ scope.row.createTime }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->

<!--      <el-table-column label="操作" align="left" class-name="small-padding fixed-width">-->
<!--        <template slot-scope="scope">-->

<!--          <el-row>-->
<!--            <el-col :span="24">-->

<!--              <router-link v-allow="62" :to="'./official_edit/'+scope.row.custId">-->
<!--                <el-button type="text" size="medium">-->
<!--                  修改-->
<!--                </el-button>-->
<!--              </router-link>-->
<!--              <el-button v-allow="63" size="medium" type="text" @click="handledeleElement(scope.row,scope.$index)">删除</el-button>-->
<!--            </el-col>-->
<!--          </el-row>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--    </el-table>-->
    <AgGridVue
      :style="{width:'100%',height: clientHeight+'px'}"
      class="ag-theme-balham"
      :columnDefs="columnDefs"
      :rowData="list"
      rowSelection="multiple"
      @grid-ready="onGridReady"
      :gridOptions="gridOptions"
      @dragStopped="dragStopped"
      :getContextMenuItems="getContextMenuItems"
      suppressAutoSize
      @rowDoubleClicked="rowDoubleClicked"
      animateRows
      @sortChanged="refreshEvenRowsCurrencyData"
      @filterChanged="refreshEvenRowsCurrencyData"
      :localeText="$store.state.caseInformation.localeText"
    >
    </AgGridVue>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />

  </div>
</template>
<script>
import {
  fetchList,
  delCustomer,
  querycustSelectClass,
  queryCustomerNameIdUrl,
  queryCountryUrl,
  updateLevelUrl
} from "@/api/customerList";
import Pagination from "@/components/Pagination";
import { deleteUrl, queryAllUrl, queryCountrysUrl, searchtmdataUrl } from '@/api/applicant' // secondary package based on el-pagination
const defaultData = {
  pageNo: 1,
  pageSize: 10,
  keyword: "",
  createTime: "",
  isOfficial: "1",
  country: "",
  examineStatuss: ""
};
export default {
  components: { Pagination },
  data() {
    return {
      dialogFormxy: false,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        keyword: "",
        isOfficial: "1",
        createTime: "",
        country: "",
        examineStatuss: ""
      },
      deldata: {
        customerID: ""
      },
      seletData: {
        scStatu: {},
        country: {},
        custnames: {},
        level: {}
      },
      gridOptions: {
        ...this.$store.state.caseInformation.gridOptions, ...{
          statusBar: {
            statusPanels: [
              { statusPanel: 'agTotalAndFilteredRowCountComponent', align: 'left' },
              { statusPanel: 'agSelectedRowCountComponent', align: 'left' }
            ]
          }
        }
      },
      currentPageSize: 0,
      defaultcolumnDefs: [
        {
          headerName: '序号',
          field: 'sid',
          width: 60,
          'pinned': 'left', // 固定再左边
          enableRowGroup: true,
          // enablePivot: true,
          floatingFilter: true,
          filter: false,
          cellClass: 'vAlign',
          suppressMenu: true,
          checkboxSelection: false,
          headerCheckboxSelection: false,
          headerCheckboxSelectionFilteredOnly: true,
          cellRenderer: this.cellRenderer
        }
      ],
      columnDefs: [],
      pickerOptions: {
        // disabledDate(time) {
        //   return time.getTime() > Date.now();
        // },
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            }
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            }
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            }
          }
        ]
      },
      xyData: {
        custId: "",
        level: "",
        memo: ""
      }
    };
  },
  created() {
    this.getAllWfs()
    this.getList()
    this.getallSelectData()
  },
  computed: {
    clientHeight() {
      return document.documentElement.clientHeight - 310
    }
  },
  methods: {
    clearSeach() {
      this.listQuery = JSON.parse(JSON.stringify(defaultData))

      this.total = '0'
    },
    getAllWfs() {
      var tableHeader = []
      if (localStorage.getItem('tableHeader') && JSON.parse(localStorage.getItem('tableHeader')).find(item => item.name === this.$route.name)) {
        tableHeader = JSON.parse(localStorage.getItem('tableHeader')).find(item => item.name === this.$route.name).tableHeader
      }
      if (tableHeader.length === 0) {
        this.preferenceList = [{ 'label': '官方机构名称', prop: 'name' }, {
          'label': '国籍',
          prop: 'country'
        }, { 'label': '审查状态', prop: 'examineStatusStr' }, { 'label': '创建日期', prop: 'createTime' }
        ]
      } else {
        this.preferenceList = tableHeader
      }
      this.columnDefs = [...this.defaultcolumnDefs, ...this.preferenceList.map(item => ({
        headerName: item.label,
        field: item.prop,
        resizable: true,
        sortable: true,
        width: item.width,
        filter: 'agSetColumnFilter',
        // cellRenderer: this.cellRenderer,
        menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
        enableRowGroup: true,
        filterParams: {
          newRowsAction: 'keep',
          comparator: (a, b) => {
            return this.$commonUtils.sort(a, b, item.value)
          }
        }
      }))]

      this.tableHeader = this.preferenceList.map(item => ({ label: item.label, prop: item.prop, width: item.width }))
      this.saveLocation()
    },
    saveLocation() {
      if (!localStorage.getItem('tableHeader')) {
        const arr = []
        arr.push({ name: this.$route.name, tableHeader: this.tableHeader })
        localStorage.setItem('tableHeader', JSON.stringify(arr))
      } else {
        const arr = JSON.parse(localStorage.getItem('tableHeader'))
        if (arr.find(item => item.name === this.$route.name)) {
          arr.find(item => item.name === this.$route.name).tableHeader = this.tableHeader
          localStorage.setItem('tableHeader', JSON.stringify(arr))
        } else {
          arr.push({ name: this.$route.name, tableHeader: this.tableHeader })
          localStorage.setItem('tableHeader', JSON.stringify(arr))
        }
      }
    },
    // 序号
    refreshEvenRowsCurrencyData(params) {
      this.currentPageSize = params.api.rowModel.rootNode.allChildrenCount
      if (!params.columnApi.columnController.groupAutoColumns) {
        this.gridApi.forEachNode(rowNode => {
          rowNode.setDataValue(
            'sid',
            rowNode.rowIndex + 1)
        })
      }
    },
    cellRenderer(params) {
      if (params.colDef.field === 'sid') {
        return params.rowIndex + 1
      }
      return `<span title="${params.value}">${params.value ? params.value : ''}</span>`
    },
    // 右键点击表格
    getContextMenuItems(params) {
      if (!params.node || !params.node.data) {
        return []
      }
      return this.getRowContextmenuList(params.node.data).map(item => ({
        name: item.name,
        action: () => {
          this[item.action](params.node.data, params.value, params.node)
        }
      }))
    },
    getRowContextmenuList(row) {
      return [
        { name: '复制', action: 'copy' },
        { name: '修改', action: 'editFun', permissions: 62 },
        { name: '删除', action: 'handledeleElement', permissions: 63 }
      ].filter(item => {
        if (item.permissions) {
          if (item.examineStatusStr) {
            return this.$store.getters.permissions.includes(item.permissions) && row.examineStatusStr === item.examineStatusStr
          }
          return this.$store.getters.permissions.includes(item.permissions)
        } else {
          return true
        }
      })
    },
    copy(row, value) {
      if (value) {
        this.$copyText(value).then(
          res => {
          })
      }
    },
    editFun(row) {
      // console.log(row.appId)
      this.$router.push(`./official_edit/${row.custId}`)
    },
    installtmmessage(row) {
      searchtmdataUrl({
        appName: row.appId
      }).then(res => {
      })
    },
    rowDoubleClicked(params) {
      // console.log(params.data)
      this.$router.push(`./official_view/${params.data.custId}`)
    },
    getList(type) {
      if (type === 'search') {
        this.listQuery.pageNo = '1'
      }
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.total
        this.listLoading = false
      })
    },
    // 存储对grid和column API的引用
    onGridReady(params) {
      this.gridparams = params
      this.gridApi = params.api
      this.columnApi = params.columnApi
      params.api.sizeColumnsToFit()
    },
    // 改变width
    dragStopped(params) {
      const tableHeader = params.columnApi.columnController.gridColumns.map(item => ({
        label: item.colDef.headerName,
        width: item.actualWidth,
        prop: item.colDef.field
      })).filter(item => item.prop !== 'sid') // 过滤序号的数据
      var arr = JSON.parse(localStorage.getItem('tableHeader'))
      arr.find(item => item.name === this.$route.name).tableHeader = tableHeader
      localStorage.setItem('tableHeader', JSON.stringify(arr))
    },
    getallSelectData() {
      queryCountryUrl().then(response => {
        if (response.success) {
          this.seletData.country = response.data.areas;
        } else {
          this.$message.error(response.message);
        }
      });
      querycustSelectClass({ classId: "1130,1099" }).then(response => {
        if (response.success) {
          this.seletData.scStatu = response.data["1130"];
          this.seletData.level = response.data["1099"];
        } else {
          this.$message.error(response.message);
        }
      });
    },
    remotepaternalUnit(query) {
      if (query !== "") {
        queryCustomerNameIdUrl({ keyword: query ,isCustomer:1 }).then(response => {
          if (response.success) {
            this.seletData.custnames = response.data;
          } else {
            this.$message.error(response.message);
          }
        });
      }
    },
    handledeleElement(item, index) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.deldata.customerID = item.custId;
          delCustomer(this.deldata).then(response => {
            if (response.success) {
              // const index = this.list.indexOf(item);
              this.list.splice(index, 1);
              this.$message({
                type: "success",
                message: "删除成功"
              });
            } else {
              this.$message.error(response.message);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          })
        })
    },
    setXy() {
      updateLevelUrl(this.xyData).then(response => {
        if (response.success) {
          this.$message.success(response.message);
          this.dialogFormxy = false;
        } else {
          this.$message.error(response.message);
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.el-table /deep/ th {
  background-color: #7199d5;
  color: #ffffff;
}
.el-row {
  margin-bottom: 5px;
}
.el-row:last-child {
  margin-bottom: 0;
}
</style>

