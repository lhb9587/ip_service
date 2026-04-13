<template>
  <div style="padding: 5px 10px 5px 10px">
    <!--    顶部搜索-->
    <div class="search-box">
      <div class="search-left">
        <div>
          <el-input placeholder="商机信息检索" prefix-icon="el-icon-search" v-model="queryModuleData.keyword"
                    @keyup.enter.native="(e)=>handleSearch(1)">
            <!--            <template slot="prepend"><span class="el-icon-search"></span></template>-->
          </el-input>
        </div>
        <search-btn ref="searchBtn" :buss-id="81" :name="$options.name" @search="handleSearch"></search-btn>
        <div class="search-border" :class="queryModuleData.kuaijie === item.id ? 'choice-item' : ''"
             @click="choiceItem(item)"
             v-for="(item, index) in [{label: '我创建的', id: 1, num: filterNum.myNum}, {label: '我参与的', id: 2, num: filterNum.canyuNum}, {label: '今日新增', id: 3, num: filterNum.todayNum}, {label: '分配给我的', id: 4, num: filterNum.fgNum}]"
             :key="item.label">
          <div class="search-item">
            <img src="../customer_list/assets/images/file.svg">
            <div>
              <div>{{item.num}}</div>
              <div>{{item.label}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="search-right-btn">
        <el-button v-allow="42" @click="businessAllocation">
          <div style="display: flex;align-items: center">
            <img src="../../../../assets/businessAllocation.svg" alt="" style="margin-right: 10px">
            商机分配
          </div>
        </el-button>
        <el-button type="primary" v-allow="42" @click="createBusiness">
          <span class="el-icon-plus"></span>
          新建商机
        </el-button>
      </div>
    </div>

    <!--  商机列表  -->
    <div style="position: relative;">
      <div class="dots" @click="handleCheckboxState">
        <span class="dot">.</span>
        <span class="dot">.</span>
        <span class="dot">.</span>
      </div>
      <el-button class="brush_right" :class="brushRightHasFilter?'red':''" @click="brushRight" type="text"
                 icon="el-icon-brush"></el-button>
      <AgGridVue :style="{width:'100%',height: clientHeight+'px', marginTop: '15px'}"
                 class="ag-theme-balham"
                 :columnDefs="columnDefs"
                 :rowData="businessList"
                 rowSelection="multiple"
                 @grid-ready="onGridReady"
                 :gridOptions="gridOptions"
                 @dragStopped="dragStopped"
                 @rowDoubleClicked="rowDoubleClicked"
                 :getContextMenuItems="getContextMenuItems"
                 @rowClicked="rowClicked"
                 suppressAutoSize

                 animateRows
                 @sortChanged="refreshEvenRowsCurrencyData"
                 @filterChanged="refreshEvenRowsCurrencyData"
                 :localeText="$store.state.caseInformation.localeText"
                 :suppressDragLeaveHidesColumns="true"
                 :suppressMakeColumnVisibleAfterUnGroup="true"
                 rowGroupPanelShow="always"
                 :groupSelectsChildren="true"
                 :suppressAggFuncInHeader="true"
                 :autoGroupColumnDef="autoGroupColumnDef"

      >
      </AgGridVue>
      <pagination v-show="total > 0" :total="total" :pageSizes="pageSizesList" :page.sync="listQuery.pageNo"
                  :limit.sync="listQuery.pageSize" @pagination="getList"/>

      <div class="checkbox" v-if="checkboxState">
        <el-select ref="checkCaseSelect" v-model="checkCaseList" multiple reserve-keyword filterable placeholder="请选择"
                   collapse-tags @visible-change="handleChange" :filter-method="filterCheck">
          <template slot="">
            <div class="checkbox_bottom">
              <el-button size="mini" round @click.stop="delPreference(1)">恢复默认</el-button>
              <el-button style="margin-right: 3px" size="mini" round @click.stop="savePreference(1)">保存设置</el-button>
            </div>
          </template>
          <el-option
            v-for="item in selectColumnList.filter(item =>item.COLUMN_COMMENT.includes(filterText))"
            :key="item.COLUMN_NAME"
            :label="item.COLUMN_COMMENT"
            :value="item.COLUMN_NAME">
          </el-option>
        </el-select>
      </div>
    </div>

    <!--  新建、修改、查看  -->
    <el-dialog
      :title="title"
      append-to-body
      :close-on-click-modal="false"
      :visible.sync="businessDialogView"
      width="45%"
      height="80%"
      class="abow_dialog"
    >
      <business-dialog v-if="businessDialogView" :sjId="sjId" :type="title" @close="closeDialog"></business-dialog>
    </el-dialog>

    <!--  分配  -->
    <el-dialog
      title="商机分配"
      append-to-body
      :close-on-click-modal="false"
      :visible.sync="businessAllocationView"
      width="45%"
      height="80%"
      class="abow_dialog"
    >
      <business-allocation v-if="businessAllocationView" :sjId="sjId" @close="closeDialog"></business-allocation>
    </el-dialog>
  </div>
</template>

<script>
  import SearchBtn from "../customer_list/SearchBtn";
  import {delShangji, queryShangjiList} from "../../../../api/business";
  import {delPreference, queryPreference, savePreference, selectColumn} from "../../../../api/caseList";
  import Pagination from "../../../../components/Pagination/index";
  import BusinessDialog from "./BusinessDialog";
  import {delCustomer} from "../../../../api/customerList";
  import BusinessAllocation from "./BusinessAllocation";

  export default {
    name: "index",
    components: {BusinessAllocation, BusinessDialog, Pagination, SearchBtn},
    computed: {
      clientHeight() {
        return document.documentElement.clientHeight - 190
      }
    },
    watch: {
      checkboxState(n) {
        if (n) {
          this.$nextTick(() => {
            this.$refs.checkCaseSelect.focus()
          })
        }
      },
    },
    data() {
      let tableHeader = []
      if (localStorage.getItem('tableHeader') && JSON.parse(localStorage.getItem('tableHeader')).find(item => item.name == this.$options.name)) {
        tableHeader = JSON.parse(localStorage.getItem('tableHeader')).find(item => item.name == this.$options.name).tableHeader
      }
      return {
        filterText: '',
        filterNum: {},
        businessAllocationView: false,
        sjId: '',
        businessDialogView: false,
        title: '',
        searchFlag: 0,
        queryModuleData: {},
        listQuery: {
          pageSize: JSON.parse(localStorage.getItem('pageSize')) ? JSON.parse(localStorage.getItem('pageSize')).find(item => item.name == this.$route.name) ? JSON.parse(localStorage.getItem('pageSize')).find(item => item.name == this.$route.name).pageSize : 10 : 10,
          pageNo: 1
        },
        tableHeader,
        pageSizesList: [10, 50, 200, 500, 1000, 5000, 10000],
        autoGroupColumnDef: {
          headerName: '组',
          field: 'group',
          headerCheckboxSelection: true,
          cellRenderer: 'agGroupCellRenderer',
          cellRendererParams: {checkbox: true},
        },
        columnDefs: [],
        gridOptions: {
          ...this.$store.state.caseInformation.gridOptions, ...{
            statusBar: {
              statusPanels: [
                {statusPanel: 'agSelectedRowCountComponent', align: 'left'},
                { statusPanel: 'agTotalAndFilteredRowCountComponent', align: 'left' },
              ]
            },
            getRowStyle: (params) => {
              if (params.node.data) {
                if (params.node.data.isCheck == 0) {
                  return {background: '#DCDFE6'}
                }
              }
            },
            //floatingFilter: true,
          }
        },
        businessList: [],
        drawerView: false,
        gridApi: {},
        columnApi: {},
        bussId: 81,
        preferenceList: [],
        defaultcolumnDefs: [
          {
            headerName: '序号',
            field: 'sid',
            width: 80,
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
          },
        ],
        checkCaseList: [],
        total: 0,
        exportQueryModel: {},
        brushRightHasFilter: false,
        checkboxState: false,
        selectColumnList: []
      }
    },
    created() {
      queryShangjiList({tongji: 1}).then(res => {
        this.filterNum = res.data
      })
      this.getAllWfs()
      const queryData = JSON.parse(localStorage.getItem('queryModuleData')) // 全部搜索数据
        && JSON.parse(localStorage.getItem('queryModuleData')).find(item => item.name == this.$options.name)
        && JSON.parse(localStorage.getItem('queryModuleData')).find(item => item.name == this.$options.name).queryModuleData
        || {}
      if (queryData.keyword) {
        this.$set(this.queryModuleData, 'keyword', queryData.keyword)
      }
      if (queryData.kuaijie) {
        this.$set(this.queryModuleData, 'kuaijie', queryData.kuaijie)
      }
      this.handleSearch(1)
    },
    methods: {
      savePreference() {
        let list2 = this.checkCaseList.map(item => ({
          title: this.selectColumnList.find(i => i.COLUMN_NAME === item).COLUMN_COMMENT,
          value: item
        }))
        const data = {
          userId: this.userId,
          bussId: this.bussId,
          list2
        }
        savePreference(data).then(res => {
          if (res.success) {
            this.checkboxState = false
            this.filterText = ''
            this.getList()
            this.getAllWfs()
          }
        })
      },
      delPreference() {
        const data = {
          userId: this.$store.getters.userId,
          bussId: this.bussId,
        }
        delPreference(data).then(res => {
          if (res.success) {
            this.checkboxState = false
            this.handleSearch(this.searchFlag)
            this.getAllWfs()
          }
        })
      },
      filterCheck(val) {
        this.filterText = val;
      },
      handleChange(boolean) {
        if (!boolean) {
          this.checkboxState = false
          const els1 = this.$el.getElementsByClassName('checkbox')[0]
          els1.children[0].click()
        }
      },
      businessAllocation() {
        if (!this.getSelectedRows().length) {
          this.$message.error('请选择商机!')
          return
        }
        this.sjId = this.getSelectedRows()[0].sjId
        this.businessAllocationView = true
      },
      closeDialog(isSearch) {
        isSearch === true && this.getList()
        this.businessDialogView = false
        this.businessAllocationView = false
      },
      choiceItem(item) {
        this.$set(this.queryModuleData, 'kuaijie', item.id)
        this.$set(this.queryModuleData, 'keyword', undefined)
        this.handleSearch(1)
      },
      getSelectedRows() {
        if (this.gridApi) {
          const selectedNodes = this.gridApi.getSelectedNodes();
          const selectedData = selectedNodes.map(node => node.data);
          return selectedData
        } else {
          return []
        }

      },
      createBusiness() {
        this.title = '新增商机'
        this.businessDialogView = true
      },
      brushRight() {
        let data = this.$commonUtils.getFilterModel(this.$options.name + this.$route.name, 'FilterModel')
        let arr = Object.keys(data)
        arr.forEach(item => {
          this.gridApi.destroyFilter(item)
        })
        this.$commonUtils.saveFilterModel(this.$options.name + this.$route.name, 'FilterModel', {})
      },
      handleCheckboxState() {
        this.checkboxState = !this.checkboxState;
      },
      handleSearch(flag) {
        this.queryModuleData.keyword && this.$set(this.queryModuleData, 'kuaijie', undefined)
        this.queryModuleData.kuaijie && this.$set(this.queryModuleData, 'keyword', undefined)
        this.searchFlag = flag // 0: 搜索按钮内部搜索， 1：外面模糊搜索和过滤条件
        this.getList(flag)
      },
      getList(flag) {
        const queryData = JSON.parse(localStorage.getItem('queryModuleData')) // 全部搜索数据
          && JSON.parse(localStorage.getItem('queryModuleData')).find(item => item.name == this.$options.name)
          && JSON.parse(localStorage.getItem('queryModuleData')).find(item => item.name == this.$options.name).queryModuleData
          || {}
        let data = {}
        if (this.searchFlag) { // 外部
          data = JSON.parse(JSON.stringify(this.queryModuleData))
        } else { // 内部
          data = JSON.parse(JSON.stringify(queryData))
          delete data.keyword
          delete data.kuaijie
          delete this.queryModuleData.keyword
          delete this.queryModuleData.kuaijie
        }
        typeof flag === 'number' && (this.listQuery.pageNo = 1)
        let arr = []
        if (JSON.parse(localStorage.getItem('queryModuleData'))) {
          arr = JSON.parse(localStorage.getItem('queryModuleData'))
        } else {
          arr = []
        }
        if (arr.find(item => item.name == this.$options.name)) {
          arr.find(item => item.name == this.$options.name).queryModuleData = {...queryData, ...this.queryModuleData}
        } else {
          arr.push({name: this.$options.name, queryModuleData: {...queryData, ...this.queryModuleData}})
        }
        localStorage.setItem('queryModuleData', JSON.stringify(arr))

        queryShangjiList({...this.listQuery, ...this.$commonUtils.cleanNullAttr(data) }).then(response => {
          this.businessList = response.data || []
          this.total = response.total
          if (this.businessList.length) {
            this.getFilterModel()
          }
        })
      },
      async getAllWfs() {
        const data = {
          userId: this.$store.getters.userId,
          bussId: this.bussId
        }
        Promise.all([selectColumn(data), queryPreference(data)]).then(res => {
          this.selectColumnList = res[0].data
          this.preferenceList = res[1].data
          this.columnDefs = [...this.defaultcolumnDefs, ...this.preferenceList.map(item => ({
            headerName: item.title,
            field: item.value,
            width: this.getLoactionWidth(item.title) == 'auto' ? 200 : this.getLoactionWidth(item.title),
            resizable: true,
            sortable: true,
            enableRowGroup: true,
            filter: 'agSetColumnFilter',
            cellRenderer: this.cellRenderer,
            filterParams: {
              comparator: (a, b) => {
                return this.$commonUtils.sort(a, b, item.value)
              }
            },
            menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
          }))]
          this.$nextTick(() => {
            this.columnDefs.forEach(item => {
              this.columnApi.getColumn(item.field)&&this.columnApi.getColumn(item.field).addEventListener('menuVisibleChanged', () => {
                if (document.querySelector(".ag-tabs")) {
                  new this.$DraginResize(document.querySelector(".ag-set-filter-list"), {
                    clone: true,
                    end(info) {
                      if (info.dir == 'ver') {
                        this.elem.style.height = info.height + 'px';
                      } else if (info.dir == 'hor') {
                        this.elem.style.width = info.width + 'px';
                      }
                    }
                  })
                }
              });
            })
          })
          this.tableHeader = this.preferenceList.map(item => ({
            label: item.title,
            prop: item.value,
            width: this.getLoactionWidth(item.title)
          }))
          this.saveLocation()
          this.checkCaseList = this.preferenceList.map(item => item.value)
        })
      },
      refreshEvenRowsCurrencyData(params) {
        this.gridApi.rowModel.rootNode.childrenAfterFilter && this.gridApi.rowModel.rootNode.childrenAfterFilter.length && this.gridApi.rowModel.rootNode.childrenAfterFilter.forEach(rowNode => {
          setTimeout(() => {
            rowNode.setDataValue(
              'sid',
              rowNode.rowIndex + 1)
          }, 0)
        });
        // if(!params.columnApi.columnController.groupAutoColumns) {
        //   this.gridApi.forEachNode(rowNode => {
        //     rowNode.setDataValue(
        //       'sid',
        //       rowNode.rowIndex + 1)
        //   });
        // }
        if (this.businessList.length) {
          if (params.type == "filterChanged") {
            let obj = this.gridApi.getFilterModel()
            for (let k in obj) {
              if (obj.hasOwnProperty(k)) {
                if (obj[k].values && !obj[k].values.length) {
                  delete obj[k]
                }
              }
            }
            Object.keys(obj).length && this.$commonUtils.saveFilterModel(this.$options.name + this.$route.name, 'FilterModel', this.gridApi.getFilterModel())
            var data = this.$commonUtils.getFilterModel(this.$options.name + this.$route.name, 'FilterModel');
            var arr = Object.keys(data);
            if (arr.length) {
              if (arr.length == 1 && arr[0] == 'gfCreateDate' && data.gfCreateDate.values.length == 0) {
                this.brushRightHasFilter = false
              } else {
                this.brushRightHasFilter = true
              }
            } else {
              this.brushRightHasFilter = false
            }
            // if(arr.length){
            //   this.brushRightHasFilter=true
            // }else {
            //   this.brushRightHasFilter=false
            // }
          }
          if (params.type == "sortChanged") {
            this.$commonUtils.saveFilterModel(this.$options.name + this.$route.name, 'SortModel', this.gridApi.getSortModel())
          }
        }
      },
      getLoactionWidth(label) {
        if (!localStorage.getItem('tableHeader')) {
          return 'auto'
        } else {
          var arr = JSON.parse(localStorage.getItem('tableHeader'))
          if (arr.find(item => item.name == this.$options.name)) {
            var header = arr.find(item => item.name == this.$options.name).tableHeader
            if (header.find(item => item.label == label)) {
              return header.find(item => item.label == label).width
            } else {
              return 'auto'//String(label).replace(/[\u4E00-\u9FA5]/gi,'aa').length*12+30
            }
          } else {
            return 'auto'
          }
        }
      },
      copy(row, value) {
        if (value) {
          this.$copyText(value)
        }
      },
      saveLocation() {
        if (!localStorage.getItem('tableHeader')) {
          let arr = []
          arr.push({name: this.$options.name, tableHeader: this.tableHeader})
          localStorage.setItem('tableHeader', JSON.stringify(arr))
        } else {
          let arr = JSON.parse(localStorage.getItem('tableHeader'))
          if (arr.find(item => item.name == this.$options.name)) {
            arr.find(item => item.name == this.$options.name).tableHeader = this.tableHeader
            localStorage.setItem('tableHeader', JSON.stringify(arr))
          } else {
            arr.push({name: this.$options.name, tableHeader: this.tableHeader})
            localStorage.setItem('tableHeader', JSON.stringify(arr))
          }
        }
      },
      cellRenderer(params) {
        if (params.colDef.field == 'sid') {
          return params.rowIndex + 1
        }
        return `<span title="${params.value}">${params.value ? params.value : ''}</span>`
      },
      rowClicked() {

      },
      getContextMenuItems(params) {
        if (!params.node || !params.node.data) {
          return []
        }
        return this.getRowContextmenuList(params.node.data).map(item => ({
          name: item.name,
          action: () => {
            this[item.action](params.node.data, params.value, params.node)
          },
        }))
      },
      rowDoubleClicked(params) {
        this.title = '查看商机'
        this.businessDialogView = true
        this.sjId = params.data.sjId
      },
      takeModify(row) {
        this.title = '修改商机'
        this.businessDialogView = true
        this.sjId = row.sjId
      },
      handledeleElement(row) {
        const index = this.businessList.indexOf(row)
        this.$confirm("此操作将永久删除该商机, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            delShangji({
              sjId: row.sjId
            }).then(response => {
              if (response.success) {
                this.getList()
                // this.businessList.splice(index, 1)
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
            });
          });
      },
      getRowContextmenuList(row) {
        return [
          {name: '复制', action: 'copy'},
          {name: '修改', action: 'takeModify'},
          {name: '删除', action: 'handledeleElement'}].filter(item => {
          if (item.permissions) {
            if (item.examineStatusStr) {
              return this.$store.getters.permissions.includes(item.permissions) && row.examineStatusStr == item.examineStatusStr
            } else if (item.isCheck) {
              return this.$store.getters.permissions.includes(item.permissions) && row.isCheck == item.isCheck
            } else {
              return this.$store.getters.permissions.includes(item.permissions)
            }
          } else {
            return true
          }
        })
      },
      dragStopped(params) {
        let tableHeader = params.columnApi.columnController.gridColumns.map(item => ({
          label: item.colDef.headerName,
          width: item.actualWidth,
          prop: item.colDef.field,
        })).filter(item => item.prop != 'sid' && item.prop != "group")
        const arr = JSON.parse(localStorage.getItem('tableHeader'))
        arr.find(item => item.name == this.$options.name).tableHeader = tableHeader
        localStorage.setItem('tableHeader', JSON.stringify(arr))
        this.changeHeader(tableHeader)
      },
      getFilterModel() {
        this.$nextTick(() => {
          let data = this.$commonUtils.getFilterModel(this.$options.name + this.$route.name, 'FilterModel')
          let arr = Object.keys(data)
          let arrInstance = arr.map(item => this.gridApi.getFilterInstance(item))
          arrInstance.forEach((item, index) => {
            item && item.selectNothing && item.selectNothing()
            item && item.setModel && item.setModel(data[arr[index]])
            item && item.applyModel && item.applyModel()
          })
          this.gridApi.onFilterChanged()
          let sortData = this.$commonUtils.getFilterModel(this.$options.name + this.$route.name, 'SortModel')
          if (sortData && sortData.length) {
            this.gridApi.setSortModel(sortData)
            this.gridApi.onSortChanged()
          }
          if (this.gridApi.rowModel.rootNode.childrenAfterFilter.length) {
            this.gridApi.rowModel.rootNode.childrenAfterFilter[0].setSelected(true)
          }
        })
      },
      changeHeader(n) {
        if (n && n.length) {
          this.checkCaseList = n.map(item => item.prop)
          let list2 = this.checkCaseList.map(item => ({
            title: this.selectColumnList.find(i => i.COLUMN_NAME === item)
              .COLUMN_COMMENT,
            value: item
          }));
          const data = {
            userId: this.$store.getters.userId,
            bussId: this.bussId,
            list2
          };
          savePreference(data)
        }
      },
      onGridReady(params) {
        this.gridApi = params.api;
        this.columnApi = params.columnApi;
      },
    }
  }
</script>

<style lang="scss" scoped>
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

  .search-border {
    cursor: pointer;
    margin-left: 15px;
    font-size: 14px;
    color: #999999;
    font-weight: bold;

    &:hover {
      color: #52A0F5;
    }

    .search-item {
      border: 1px dashed #D7D7D7;
      width: 130px;
      height: 50px;
      display: flex;
      align-items: center;

      &:hover {
        border-color: #52A0F5;
      }

      img {
        width: 45px;
        height: 45px;
        margin: 0 2px
      }
    }
  }

  .choice-item {
    color: #52A0F5;
    border-color: #52A0F5;

    .search-item {
      border-color: #52A0F5;
    }
  }

  .search-right-btn {
    display: flex;
    align-items: center;
    margin-right: 15px;
  }

  > > > .el-drawer {
    padding-bottom: 0 !important;
  }

  > > > .el-drawer__wrapper {
    margin-top: 40px !important;
    margin-left: 200px;
  }

  .brush_right {
    position: absolute;
    right: 6px;
    z-index: 1;
    top: -4px;
  }

  .dots {
    cursor: pointer;
    position: absolute;
    left: 0;
    z-index: 1;
    top: 6px;
    width: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;

    .dot {
      color: transparent;
      padding: 1px;
      margin: 1px;
      width: 5px;
      background: RGBA(113, 123, 140, 1);
      height: 5px;
      display: block;
    }

    & ~ span {
      margin-left: 5px;
    }
  }

  .checkbox {
    position: absolute;
    left: 0px;
    top: 32px;
    width: 222px;
    height: 326px;
    border: 1px solid #99a9bf;
    background: #fff;
    z-index: 100;
    padding-top: 6px;
    padding-left: 6px;
  }

  .checkbox_bottom {
    position: absolute;
    display: flex;
    bottom: 0;
    right: 0;
    width: 100%;
    height: 29px;
    background: #fff;
    z-index: 2;
    justify-content: flex-end;
  }

  .checkbox_bottom ~ li:last-of-type {
    margin-bottom: 30px;
  }

  .abow_dialog {
    > > > .el-dialog {
      position: absolute;
      top: 50%;
      left: 50%;
      margin: 0 !important;
      transform: translate(-50%, -50%);
      min-height: calc(50%);
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
</style>
