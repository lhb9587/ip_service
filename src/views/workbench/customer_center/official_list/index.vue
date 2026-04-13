<template>
  <div class="app-container">
    <div class="search-box">
      <div class="search-left">
        <el-input ref="searchRef" clearable style="margin-right: 10px;" placeholder="关键字模糊检索" size="small" prefix-icon="el-icon-search" @change="(value) => {!value && vagueSearch('')}" v-model="listQuery.keywords"
                  @keyup.enter.native="(e)=>vagueSearch(e.target.value, true)">
          <!--            <template slot="prepend"><span class="el-icon-search"></span></template>-->
        </el-input>
        <el-button-group class="button-group-search">
          <el-button type="primary" size="small" @click="getList('search')">搜索</el-button>
          <el-popover
            placement="bottom"
            width="550"
            trigger="click"
            v-model="drawerState"
          >
            <template>
              <el-form :model="listQuery" size="mini" label-width="140px" class="form-container1">

                <el-form-item label="官方机构名称">
                  <el-select default-first-option :clearable='true' v-model="listQuery.keyword" no-match-text='暂无数据'
                             loading-text='正在查询' filterable remote reserve-keyword placeholder="请输入关键词"
                             :remote-method="remotepaternalUnit">
                    <el-option v-for="item in seletData.custnames" :key="item.custId" :label="item.fullname"
                               :value="item.fullname">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="全称">
                  <el-input style="width: 50%;" size="mini" v-model="listQuery.fullname" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="政府机关类别:">
                  <template>
                    <el-select default-first-option :clearable='true' placeholder="请选择" v-model="listQuery.companyType" filterable>
                      <el-option v-for="item in seletData.zfjgType" :key="item.id" :label="item.typeName" :value="item.typeName">
                      </el-option>
                    </el-select>
                  </template>
                </el-form-item>
                <el-form-item label="行政级别:" class="postInfo-container-item">
                  <template>
                    <el-select default-first-option :clearable='true' placeholder="请选择" v-model="listQuery.officerLevel" filterable>
                      <el-option v-for="item in seletData.xzLevel" :key="item.id" :label="item.typeName" :value="item.typeName">
                      </el-option>
                    </el-select>
                  </template>
                </el-form-item>
                <el-form-item label="国籍">
                  <el-select default-first-option :clearable='true' placeholder="请选择" v-model="listQuery.country"
                             filterable>
                    <el-option v-for="item in seletData.country" :key="String(item.countryCn)" :label="item.countryCn"
                               :value="String(item.countryCn)">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="审查状态">
                  <el-select default-first-option :clearable='true' placeholder="请选择" v-model="listQuery.examineStatus"
                             filterable>
                    <el-option v-for="item in seletData.scStatu" :key="String(item.id)" :label="item.typeName"
                               :value="String(item.id)">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="创建日期">
                  <el-date-picker v-model="listQuery.createTime" format='yyyy-MM-dd' value-format="yyyy-MM-dd"
                                  align="right"
                                  type="date" placeholder="选择日期" :picker-options="pickerOptions">
                  </el-date-picker>
                </el-form-item>
                <!--                <el-form-item label="">-->
                <!--                  <el-input v-model="listQuery.keyword" placeholder="请输入查询内容..."></el-input>-->
                <!--                </el-form-item>-->

              </el-form>
              <div style="text-align:right">
                <el-button size="mini" @click="clearSeach"><span>重置</span></el-button>
                <el-button type="primary" size="mini" @click="getList('search')">搜索</el-button>
              </div>
            </template>
            <el-button slot="reference" style="padding: 8.5px 5px;" type="primary" size="small"
                       icon="el-icon-arrow-down"></el-button>
          </el-popover>

        </el-button-group>
        <el-button v-allow="60" style="height: 32px;" type="primary" size="small" @click="createClick">
          <span class="el-icon-plus"></span>
          新建
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
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" :pageSizes="pageSizesList"
                @pagination="getList"/>

    <el-dialog
      :title="titleType"
      append-to-body
      :close-on-click-modal="false"
      :visible.sync="officialView"
      width="90%"
      height="80%"
      class="abow_dialog"
      :before-close="() => closeDialog(false)"
    >
      <official-view isCustomer ref="official" v-if="titleType === '查看' && officialView"
                     :officialId="officialId"></official-view>
      <official-detail isCustomer ref="official" @closeDialog="closeDialog" v-if="titleType !== '查看' && officialView"
                       :is-edit="titleType === '修改'"
                       :officialId="officialId"></official-detail>
      <span slot="footer" class="dialog-footer fl-ac-jc">
        <el-button size="small" type="primary" v-if="titleType === '新建'" @click="createOfficial">创建</el-button>
        <el-button size="small" type="primary" v-if="titleType === '修改'" @click="updateOfficial">保存</el-button>
        <el-button size="small" @click="closeDialog(false)">取消</el-button>
      </span>
    </el-dialog>

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
  import {deleteUrl, queryAllUrl, queryCountrysUrl, searchtmdataUrl} from '@/api/applicant'
  import OfficialDetail from "../../customer_management/official_bodies/components/officialDetail";
  import OfficialView from "../../customer_management/official_bodies/components/OfficialView";

  export default {
    components: {OfficialView, OfficialDetail, Pagination},
    data() {
      return {
        pageSizesList:[10,100, 200, 500, 1000],
        brushRightHasFilter: false,
        officialId: '',
        isEdit: false,
        officialView: false,
        titleType: '',
        defaultData: {
          pageNo: 1,
          pageSize: JSON.parse(localStorage.getItem('pageSize')) ? JSON.parse(localStorage.getItem('pageSize')).find(item => item.name == this.$route.name) ? JSON.parse(localStorage.getItem('pageSize')).find(item => item.name == this.$route.name).pageSize : 10 : 10,
          keyword: "",
          createTime: "",
          isOfficial: "1",
          country: "",
          examineStatus: ""
        },
        drawerState: false,
        dialogFormxy: false,
        list: [],
        total: 0,
        listLoading: true,
        listQuery: {
          fullname: '',
          companyType: '',
          officerLevel: '',
          keywords: '',
          pageNo: 1,
          pageSize: JSON.parse(localStorage.getItem('pageSize')) ? JSON.parse(localStorage.getItem('pageSize')).find(item => item.name == this.$route.name) ? JSON.parse(localStorage.getItem('pageSize')).find(item => item.name == this.$route.name).pageSize : 10 : 10,
          keyword: "",
          isOfficial: "1",
          createTime: "",
          country: "",
          examineStatus: ""
        },
        deldata: {
          customerID: ""
        },
        seletData: {
          scStatu: {},
          country: {},
          custnames: {},
          level: {},
          zfjgType: []
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
      this.getallSelectData()
    },
    computed: {
      clientHeight() {
        return document.documentElement.clientHeight - 220
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
      updateOfficial() {
        this.$refs.official.updatasubmitForm('postForm')
      },
      createOfficial() {
        this.$refs.official.submitForm('postForm')
      },
      closeDialog(isSearch) {
        isSearch === true && this.getList('search')
        this.officialId = ''
        this.officialView = false
        this.titleType = ''
      },
      clearSeach() {
        this.listQuery = JSON.parse(JSON.stringify(this.defaultData))

        // this.total = '0'
      },
      getAllWfs() {
        var tableHeader = []
        if (localStorage.getItem('tableHeader') && JSON.parse(localStorage.getItem('tableHeader')).find(item => item.name === this.$route.name)) {
          tableHeader = JSON.parse(localStorage.getItem('tableHeader')).find(item => item.name === this.$route.name).tableHeader
        }
        if (tableHeader.length === 0) {
          this.preferenceList = [{'label': '官方机构名称', prop: 'fullname'}, {
            'label': '国籍',
            prop: 'country'
          }, {'label': '审查状态', prop: 'examineStatusStr'}, {'label': '创建日期', prop: 'createTime'}
          ]
        } else {
          this.preferenceList = tableHeader
        }
        if (this.preferenceList.find(item => item.prop === 'name')) {
          this.preferenceList.find(item => item.prop === 'name').prop = 'fullname'
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
          {name: '修改', action: 'editFun', permissions: 62},
          {name: '删除', action: 'handledeleElement', permissions: 63}
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
        this.officialView = true
      },
      editFun(row) {
        this.officialId = row.custId
        this.titleType = '修改'
        this.officialView = true
      },
      installtmmessage(row) {
        searchtmdataUrl({
          appName: row.appId
        }).then(res => {
        })
      },
      rowDoubleClicked(params) {
        this.officialId = params.data.custId
        this.titleType = '查看'
        this.officialView = true
        // console.log(params.data)
        // this.$router.push(`./official_view/${params.data.custId}`)
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
      getallSelectData() {
        queryCountryUrl().then(response => {
          if (response.success) {
            this.seletData.country = response.data.areas;
          } else {
            this.$message.error(response.message);
          }
        });
        querycustSelectClass({classId: "1130,1099,1048,1037"}).then(response => {
          if (response.success) {
            this.seletData.scStatu = response.data["1130"];
            this.seletData.level = response.data["1099"];
            this.seletData.xzLevel = response.data["1048"];
            this.seletData.zfjgType = response.data["1037"];
          } else {
            this.$message.error(response.message);
          }
        });
      },
      remotepaternalUnit(query) {
        if (query !== "") {
          queryCustomerNameIdUrl({keyword: query, isOfficial: 1}).then(response => {
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

  .form-container1 /deep/ {
    max-height: 500px;
    overflow: auto;
    /*width: 550px;*/
    padding-bottom: 10px;

    .el-form-item__label {
      text-align: right;
      padding-left: 32px;
      font-weight: normal;
      float: left;
    }

    .el-form-item__content {
      display: flex;

      input {
        border-top: 0;
        border-left: 0;
        border-radius: 0;
        border-right: 0
      }
    }
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

