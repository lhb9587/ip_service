<template>
  <div class="app-container">
    <div class="search-box">
      <div class="search-left">
        <el-input ref="searchRef" clearable style="margin-right: 10px;" placeholder="关键字模糊检索" size="small" prefix-icon="el-icon-search" @change="(value) => {!value && vagueSearch('')}" v-model="listQuery.keywords"
                  @keyup.enter.native="(e)=>vagueSearch(e.target.value, true)">
          <!--            <template slot="prepend"><span class="el-icon-search"></span></template>-->
        </el-input>
        <el-button-group class="button-group-search" v-clickoutside="clickoutside">
          <el-button id="mySearch" type="primary" size="mini" @click="getList('search')">搜索</el-button>
          <el-button type="primary" class="searchRight" size="small" icon="el-icon-arrow-down"
                     @click.stop.prevent="drawerState=true"></el-button>
          <transition name="show" mode="out-in">
            <div class="searchWrap" v-show="drawerState">
              <div style="width: 550px;
    max-height: 500px;overflow: auto">
                <el-form :model="listQuery" size="mini" label-width="120px" class="form-container"
                         @keyup.enter.native="getList('search')">

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
                    <el-date-picker v-model="listQuery.createDateEnd" format='yyyy-MM-dd' value-format="yyyy-MM-dd"
                                    align="right"
                                    type="date" placeholder="选择日期" :picker-options="pickerOptions">
                    </el-date-picker>
                  </el-form-item>

                </el-form>

              </div>
              <div class="clearWrap">
                <el-button size="mini" @click="clearSeach"><span>重置</span></el-button>
                <el-button type="primary" size="mini" @click="getList('search')">搜索</el-button>
              </div>
            </div>
          </transition>
        </el-button-group>
        <el-button v-allow="64" type="primary" size="small" @click="createClick">
          <span class="el-icon-plus"></span>
          创建
        </el-button>
      </div>
    </div>
    <TitleTotal :total="total" v-if="total"/>
    <div v-else style="height: 30px;"></div>
    <el-button class="brush_right" :class="brushRightHasFilter?'red':''" @click="brushRight" type="text"
               icon="el-icon-brush"></el-button>
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
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.pageNo"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
    />

    <el-dialog
      :title="titleType"
      append-to-body
      :close-on-click-modal="false"
      :visible.sync="conflictView"
      width="90%"
      height="80%"
      class="abow_dialog"
      :before-close="() => closeDialog(false)"
    >
      <conflict-view v-if="titleType === '查看' && conflictView" :conflictId="conflictId" isCustomer
                     :is-edit="titleType === '查看'"></conflict-view>
      <conflict-detail ref="conflict" @closeDialog="closeDialog" v-if="titleType !== '查看' && conflictView"
                       :conflictId="conflictId" isCustomer :is-edit="titleType === '修改'"></conflict-detail>

      <span slot="footer" class="dialog-footer fl-ac-jc">
        <el-button size="small" type="primary" v-if="titleType === '新建'" @click="createConflict">创建</el-button>
        <el-button size="small" type="primary" v-if="titleType === '修改'" @click="updateConflict">保存</el-button>
        <el-button size="small" @click="closeDialog(false)">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import {
    delConflicterUrl,
    querycustSelectClass,
    searchtmdataUrl,
    querylyctListUrl
  } from '@/api/customerList'
  import Pagination from '@/components/Pagination'
  import ConflictView from "../../customer_management/conflict_of_interest/components/conflict_view";
  import ConflictDetail from "../../customer_management/conflict_of_interest/components/ConflictDetail"; // secondary package based on el-pagination
  const defaultData = {
    pageNo: 1,
    pageSize: 10,
    keyword: '',
    createTime: '',
    examineStatuss: '',
    isCustomer: '1'
  }
  export default {
    components: {ConflictDetail, ConflictView, Pagination},
    data() {
      return {
        brushRightHasFilter: false,
        conflictId: '',
        conflictView: false,
        titleType: '',
        drawerState: false,
        dialogFormxy: false,
        list: [],
        total: 0,
        listLoading: true,
        listQuery: {
          keywords: '',
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
                {statusPanel: 'agTotalAndFilteredRowCountComponent', align: 'left'},
                {statusPanel: 'agSelectedRowCountComponent', align: 'left'}
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
      // this.getList()
      this.getallSelectData()
    },
    computed: {
      clientHeight() {
        return document.documentElement.clientHeight - 210
      }
    },
    methods: {
      vagueSearch(e, forceSearch) {
        if (forceSearch) {
          this.getList('search')
        } else {
          if (!e) {
            this.$refs.searchRef.focus()
          } else {
            this.getList('search')
          }
        }
      },
      brushRight() {
        let data = this.$commonUtils.getFilterModel(this.$options.name + this.$route.name, 'FilterModel')
        let arr = Object.keys(data)
        arr.forEach(item => {
          this.gridApi.destroyFilter(item)
        })
      },
      createConflict() {
        this.$refs.conflict.submitForm('postForm')
      },
      updateConflict() {
        this.$refs.conflict.updatasubmitForm('postForm')
      },
      closeDialog(isSearch) {
        isSearch === true && this.getList('search')
        this.conflictView = false
        this.conflictId = ''
        this.titleType = ''
      },
      clickoutside() {
        this.drawerState = false
      },
      clearSeach() {
        this.listQuery = JSON.parse(JSON.stringify(defaultData))

        // this.total = '0'
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
          this.preferenceList = [{'label': '利益冲突者', prop: 'fullname'}, {
            'label': '相对客户',
            prop: 'custName'
          }, {'label': '创建日期', prop: 'createDate'}, {'label': '备注', prop: 'memo'}]
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

        this.tableHeader = this.preferenceList.map(item => ({label: item.label, prop: item.prop, width: item.width}))
        this.saveLocation()
      },
      saveLocation() {
        if (!localStorage.getItem('tableHeader')) {
          const arr = []
          arr.push({name: this.$route.name, tableHeader: this.tableHeader})
          localStorage.setItem('tableHeader', JSON.stringify(arr))
        } else {
          const arr = JSON.parse(localStorage.getItem('tableHeader'))
          if (arr.find(item => item.name === this.$route.name)) {
            arr.find(item => item.name === this.$route.name).tableHeader = this.tableHeader
            localStorage.setItem('tableHeader', JSON.stringify(arr))
          } else {
            arr.push({name: this.$route.name, tableHeader: this.tableHeader})
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
        if (params.type == "filterChanged") {
          this.$commonUtils.saveFilterModel(this.$options.name + this.$route.name, 'FilterModel', this.gridApi.getFilterModel())
          var data = this.$commonUtils.getFilterModel(this.$options.name + this.$route.name, 'FilterModel');
          var arr = Object.keys(data);
          if (arr.length) {
            this.brushRightHasFilter = true
          } else {
            this.brushRightHasFilter = false
          }
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
          {name: '复制', action: 'copy'},
          {name: '商标导入', action: 'installtmmessage', permissions: 185},
          {name: '修改', action: 'editFun', permissions: 65},
          {name: '删除', action: 'handledeleElement', permissions: 66}
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
      createClick() {
        this.conflictView = true
        this.titleType = '新建'
      },
      editFun(row) {
        this.conflictId = row.conId
        this.conflictView = true
        this.titleType = '修改'
        // this.$router.push(`./conflict_of_edit/${row.conId}`)
      },
      installtmmessage(row) {
        searchtmdataUrl({
          appName: row.fullname
        }).then(res => {
        })
      },
      rowDoubleClicked(params) {
        this.conflictId = params.data.conId
        this.conflictView = true
        this.titleType = '查看'
        // this.$router.push(`./conflict_view/${params.data.conId}`)
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
        querycustSelectClass({classId: '1130,1099'}).then(response => {
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

  .search-box {
    display: flex;
    justify-content: space-between;
    height: 70px;
    width: 100%;
    margin-top: 15px;
    border: 2px solid #F2F2F2;
    border-bottom: 2px solid #52A0F5;
    border-radius: 5px 5px 0 0;

    .search-left {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-left: 15px;
    }
  }

  .search-right-btn {
    display: flex;
    align-items: center;
    margin-right: 15px;
  }

  .button-group-search {
    position: relative;
    display: flex;
    margin-right: 10px;

    .searchWrap {
      border-radius: 5px;
      top: 34px;
      left: 0;
      width: 550px;
      max-height: 500px;
      position: absolute;
      background: #ffffff;
      border: 1px solid #d4d5d5;
      z-index: 4;
      overflow: hidden;
      /*padding: 20px 0;*/
      box-shadow: 0 3px 6px rgba(111, 111, 111, 0.2);

      /deep/ .el-form {
        padding: 20px 20px 50px 0;

        .el-form-item__label {
          text-align: right;
          padding-left: 32px;
          font-weight: normal;
        }

        .el-form-item__content {
          display: flex;

          input {
            border-top: 0;
            border-left: 0;
            border-radius: 0;
            border-right: 0
          }

          .el-radio {
            line-height: 28px;
          }
        }
      }

      .clearWrap {
        display: flex;
        justify-content: flex-end;
        /*width: 100%;*/
        background: #fff;
        right: 10px;
        bottom: 0;
        padding-bottom: 10px;
        position: absolute;
        z-index: 1;
      }
    }
  }

  .DataPicker /deep/ {
    line-height: 28px;

    .el-input__prefix {
      display: none !important;
    }

    .el-input__inner {
      text-align: left;
      padding-left: 15px;
      padding-right: 18px;
    }
  }

  .searchRight {
    border-top-right-radius: 3px !important;
    border-bottom-right-radius: 3px !important;
    padding: 0 5px;
    height: 33px;
  }

  .abow_dialog {
    > > > .el-dialog {
      position: absolute;
      top: 50%;
      left: 50%;
      margin: 0 !important;
      transform: translate(-50%, -50%);
      min-height: calc(60%);
      max-height: calc(100% - 30px);
      max-width: calc(100% - 30px);
      display: flex;
      flex-direction: column;
    }

    > > > .el-dialog__body {
      overflow: auto;
      padding: 0 10px 10px 10px;
    }
  }

  .brush_right {
    position: absolute;
    right: 15px;
    z-index: 1;
    top: 120px;
  }
</style>

