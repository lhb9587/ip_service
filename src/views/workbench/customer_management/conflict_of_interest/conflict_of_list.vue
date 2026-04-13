<template>
  <div class="app-container">
    <header class="y-header">{{ $route.meta.title }}</header>

    <div class="filter-container" style="margin-bottom:15px">
      <el-form :inline="true" :model="listQuery" size="small" class="demo-form-inline">

        <el-form-item label="客户">
          <el-input v-model="listQuery.custName" placeholder="请输入查询内容..."></el-input>
        </el-form-item>
        <el-form-item label="利益冲突者名称">
          <el-input v-model="listQuery.fullname" placeholder="请输入查询内容..."></el-input>
        </el-form-item>
        <el-form-item label="创建日期">
          <el-date-picker v-model="listQuery.createDateStart" format='yyyy-MM-dd' value-format="yyyy-MM-dd"
                          align="right" type="date" placeholder="选择日期" :picker-options="pickerOptions">
          </el-date-picker>
          至
          <el-date-picker v-model="listQuery.createDateEnd" format='yyyy-MM-dd' value-format="yyyy-MM-dd" align="right"
                          type="date" placeholder="选择日期" :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>

      </el-form>
      <el-row>
        <el-col :span="24" style="text-align:center">
          <el-button class="filter-item" type="primary" @click="getList('search')" size="small" icon="el-icon-search">搜索
          </el-button>
          <el-button class="filter-item" type="primary" @click="clearSeach" size="small" icon="el-icon-delete">重置
          </el-button>
          <router-link v-allow="64" :to="'./conflict_of_creat'">
            <el-button type="primary" size="small" icon="el-icon-edit">创建</el-button>
          </router-link>
        </el-col>
      </el-row>
    </div>
    <TitleTotal :total="total"/>
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
               @selectionChanged="selectionChanged"
               :localeText="$store.state.caseInformation.localeText"
    >
    </AgGridVue>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.pageNo"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
    />
  </div>
</template>
<script>
import {
  delConflicterUrl,
  querycustSelectClass,
  searchtmdataUrl,
  querylyctListUrl
} from '@/api/customerList'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
const defaultData = {
  pageNo: 1,
  pageSize: 10,
  keyword: '',
  createTime: '',
  examineStatuss: '',
  isCustomer: '1'
}
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
        keyword: '',
        createTime: '',
        examineStatuss: '',
        isCustomer: '1'
      },
      deldata: {
        conId: ''
      },
      seletData: {
        scStatu: {},
        country: {},
        custnames: {},
        level: {}
      },
      pickerOptions: {
        shortcuts: [
          {
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date())
            }
          },
          {
            text: '昨天',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24)
              picker.$emit('pick', date)
            }
          },
          {
            text: '一周前',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', date)
            }
          }
        ]
      },
      xyData: {
        conId: '',
        level: '',
        memo: ''
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
      columnDefs: []
    }
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
      // const data = {
      //   userId: this.userId,
      //   bussId: this.bussId
      // }
      var tableHeader = []
      if (localStorage.getItem('tableHeader') && JSON.parse(localStorage.getItem('tableHeader')).find(item => item.name === this.$route.name)) {
        tableHeader = JSON.parse(localStorage.getItem('tableHeader')).find(item => item.name === this.$route.name).tableHeader
      }
      if (tableHeader.length === 0) {
        this.preferenceList = [{ 'label': '利益冲突者', prop: 'fullname' }, {
          'label': '相对客户',
          prop: 'custName'
        }, { 'label': '创建日期', prop: 'createDate' }, { 'label': '备注', prop: 'memo' }]
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
        { name: '商标导入', action: 'installtmmessage', permissions: 185 },
        { name: '修改', action: 'editFun', permissions: 65 },
        { name: '删除', action: 'handledeleElement', permissions: 66 }
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
      this.$router.push(`./conflict_of_edit/${row.conId}`)
    },
    installtmmessage(row) {
      searchtmdataUrl({
        appName: row.fullname
      }).then(res => {
      })
    },
    rowDoubleClicked(params) {
      this.$router.push(`./conflict_view/${params.data.conId}`)
    },
    getList(type) {
      if (type === 'search') {
        this.listQuery.pageNo = '1'
      }
      this.listLoading = true
      querylyctListUrl(this.listQuery).then(response => {
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
      querycustSelectClass({ classId: '1130,1099' }).then(response => {
        if (response.success) {
          this.seletData.scStatu = response.data['1130']
          this.seletData.level = response.data['1099']
        } else {
          this.$message.error(response.message)
        }
      })
    },
    handledeleElement(item, index) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.deldata.conId = item.conId
          delConflicterUrl(this.deldata).then(response => {
            const index = this.list.indexOf(item)
            this.total--
            this.list.splice(index, 1)
            this.$message({
              type: 'success',
              message: '删除成功'
            })
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
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

