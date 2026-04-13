<template>
  <div class="app-container">
    <div class="search-box">
      <div class="search-left">
        <div>
          <el-input ref="searchRef" style="margin-right: 10px;" clearable placeholder="关键字模糊检索" size="small" prefix-icon="el-icon-search" @change="(value) => {!value && vagueSearch('')}" v-model="listQuery.keywords"
                    @keyup.enter.native="(e)=>vagueSearch(e.target.value, true)">
            <!--            <template slot="prepend"><span class="el-icon-search"></span></template>-->
          </el-input>
        </div>
        <el-button style="height: 32px;margin-left: 10px" type="primary" size="small" @click="createClick">
          <span class="el-icon-plus"></span>
          新建
        </el-button>
      </div>
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
      :localeText="$store.state.caseInformation.localeText"
    >
    </AgGridVue>
    <!--    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize"-->
    <!--                @pagination="getList"/>-->

    <el-dialog
      :title="titleType"
      :close-on-click-modal="false"
      :append-to-body="true"
      :visible.sync="jtView"
      width="45%"
      class="abow_dialog"
      :before-close="closeDialog"
    >
      <div class="box-border">
        <el-form size="small" class="form-container" label-width="120px">
          <el-row class="first-row">
            <el-col :span="24">
              <el-form-item label="集团名称:" class="postInfo-container-item">
                <el-input v-model="jtName" placeholder="请输入集团名称"></el-input>
              </el-form-item>
              <el-form-item label="关联客户:" class="postInfo-container-item">
                <el-select style="width: 100%;" default-first-option :clearable='true' v-model="custIdList" multiple no-match-text='暂无数据'
                           loading-text='正在查询' filterable remote reserve-keyword placeholder="请输入关键词"
                           :remote-method="remotepaternalUnit">
                  <el-option v-for="(item,key) in custnames" :key="key" :label="item.fullname"
                             :value="item.custId">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer fl-ac-jc">
          <el-button @click="() => closeDialog(false)">取 消</el-button>
          <el-button type="primary" v-if="titleType === '新建' || titleType === '修改'" @click="submitData">确 定</el-button>
        </span>
    </el-dialog>

  </div>
</template>
<script>
  import Pagination from "@/components/Pagination";
  import {
    addCustomerJituan,
    delCustomerJituan,
    queryCustomerJituanList, queryCustomerNameIdUrl,
    updateCustomerJituanById
  } from "../../../../api/customerList";
  import {queryCustomerNameId} from "../../../../api/caseList";

  export default {
    components: {Pagination},
    data() {
      return {
        custnames: [],
        custIdList: [],
        jtName: '',
        custjtId: '',
        jtView: false,
        titleType: '',
        defaultData: {
          pageNo: 1,
          pageSize: JSON.parse(localStorage.getItem('pageSize')) ? JSON.parse(localStorage.getItem('pageSize')).find(item => item.name == this.$route.name) ? JSON.parse(localStorage.getItem('pageSize')).find(item => item.name == this.$route.name).pageSize : 10 : 10,
          keyword: "",
          createTime: "",
          isOfficial: "1",
          country: "",
          examineStatuss: ""
        },
        drawerState: false,
        dialogFormxy: false,
        list: [],
        total: 0,
        listLoading: true,
        listQuery: {
          keywords:　'',
          pageNo: 1,
          pageSize: JSON.parse(localStorage.getItem('pageSize')) ? JSON.parse(localStorage.getItem('pageSize')).find(item => item.name == this.$route.name) ? JSON.parse(localStorage.getItem('pageSize')).find(item => item.name == this.$route.name).pageSize : 10 : 10,
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
      // this.getList()
    },
    computed: {
      clientHeight() {
        return document.documentElement.clientHeight - 200
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
      remotepaternalUnit(query) {
        if (query !== "") {
          Promise.all([queryCustomerNameId({ pageNo: 1, pageSize: 100, custIdArray: this.custIdList}), queryCustomerNameIdUrl({keyword: query, isCustomer: 1, pageSize: 100})]).then(res => {
            this.custnames = this.$commonUtils.unique(res[0].data.concat(res[1].data), 'custId')
          })
        }
      },
      submitData() {
        if (this.titleType === '新建') {
          addCustomerJituan({
            custIdList: this.custIdList,
            jtName: this.jtName
          }).then(res => {
            this.$message.success('新建成功！')
            this.closeDialog(true)
          })
        } else {
          updateCustomerJituanById({
            custIdList: this.custIdList,
            custjtId: this.custjtId,
            jtName: this.jtName
          }).then(res => {
            this.$message.success('修改成功!')
            this.closeDialog(true)
          })
        }
      },
      closeDialog(isSearch) {
        isSearch === true && this.getList('search')
        this.custIdList = []
        this.custnames = []
        this.jtView = false
        this.jtName = ''
        this.titleType = ''
        this.custjtId = ''
      },
      getAllWfs() {
        var tableHeader = []
        if (localStorage.getItem('tableHeader') && JSON.parse(localStorage.getItem('tableHeader')).find(item => item.name === this.$route.name)) {
          tableHeader = JSON.parse(localStorage.getItem('tableHeader')).find(item => item.name === this.$route.name).tableHeader
        }
        // if (tableHeader.length === 0) {
        //   this.preferenceList = [{'label': '集团名称', prop: 'jtName'}]
        // } else {
        //   this.preferenceList = tableHeader
        // }
        this.preferenceList = [{'label': '集团名称', prop: 'jtName'}, {'label': '客户名称', prop: 'custListStr'}]
        this.columnDefs = [...this.defaultcolumnDefs, ...this.preferenceList.map(item => ({
          headerName: item.label,
          field: item.prop,
          resizable: true,
          sortable: true,
          width: item.width,
          filter: 'agSetColumnFilter',
          cellRenderer: this.cellRenderer,
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
      },
      cellRenderer(params) {
        if (params.colDef.field === 'sid') {
          return params.rowIndex + 1
        }
        // if (params.colDef.field === 'custList') {
        //   return `<span title="${params.value.map(item => item.custName).join('，')}">${params.value.map(item => item.custName).join('，')}</span>`
        // }
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
          {name: '修改', action: 'editFun'},
          {name: '删除', action: 'handledeleElement'}
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
        this.titleType = '新建'
        this.jtView = true
      },
      editFun(row) {
        this.custjtId = row.custjtId
        this.titleType = '修改'
        this.jtName = row.jtName
        this.jtView = true
        if (row.custList && row.custList.length) {
          this.custnames = row.custList.map(item => ({
            fullname: item.custName,
            custId: item.custId
          }))
          this.custIdList = row.custList.map(item => item.custId)
        }
      },
      rowDoubleClicked(params) {
      },
      getList(type) {
        if (type === 'search') {
          this.listQuery.pageNo = '1'
        }
        this.listLoading = true
        queryCustomerJituanList(this.listQuery).then(response => {
          this.list = response.data
          this.list.forEach(item => {
            item.custListStr = item.custList.map(item => item.custName).join('，')
          })
          this.total = response.total
          this.listLoading = false
          this.drawerState = false
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
      handledeleElement(item, index) {
        this.$confirm('此操作将永久删除该集团客户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            delCustomerJituan({
              custjtId: item.custjtId
            }).then(res => {
              this.list.splice(index, 1);
              this.$message({
                type: "success",
                message: "删除成功"
              });
            })
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            })
          })
      },
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
          text-align: left;
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

  .box-border {
    border: 1px solid #D7D7D7;
    padding: 10px 10px 5px 10px;
  }

  .form-container {
    height: 100%;
    .el-form-item__error {
      position: relative !important;
      top: 0;
    }

    /deep/ .el-row {
      margin: 0 0 5px 0;
      display: flex;
    }

    /deep/ .postInfo-container-item {
      /*height: 100%;*/
      width: 100%;

      .el-row {
        border: none;
      }
    }

    /deep/ .el-form-item__label {
      flex-shrink: 0;
      background-color: #F2F2F2;
      /*width: 36.7%;*/
      text-align: right;
    }

    /deep/ .el-form-item {
      border-right: 1px solid #F2F2F2;
      margin: 0px !important;
    }

    .first-row {
      border-top: 1px solid #F2F2F2;
    }

    /deep/ .el-row {
      border-bottom: 1px solid #F2F2F2;
      border-left: 1px solid #F2F2F2;
    }

    /deep/ td .el-input,
    /deep/ td .el-select {
      width: 100%;
    }

    /deep/ .el-form-item__content {
      text-align: left;
      word-break: break-word;
      // height: 30px;
    }

    /deep/ .el-select .el-input {
      width: 100%;
    }

    .postInfo-container-item {
      display: flex;
      width: 100%;

      /deep/ .el-form-item__content {
        text-align: left;
        display: inline-table;
        flex: 1;
        padding: 5px 15px;
        margin-left: 0 !important;
      }

      > > > .el-date-editor {
        width: 100%;
      }
    }
  }

</style>

