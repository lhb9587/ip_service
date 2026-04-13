<template>
  <div>
    <div class="grid-table">
      <div class="dots" @click="handleCheckboxState">
        <span class="dot">.</span>
        <span class="dot">.</span>
        <span class="dot">.</span>
      </div>
      <el-button class="brush_right" :class="brushRightHasFilter?'red':''" @click="brushRight" type="text"
                 icon="el-icon-brush"></el-button>
      <AgGridVue :style="{width:'100%',height: statementTopHeight}"
                 class="ag-theme-balham"
                 :columnDefs="columnDefs"
                 :rowData="list"
                 rowSelection="multiple"
                 @grid-ready="onGridReady"
                 @dragStopped="dragStopped"
                 :gridOptions="gridOptions"
                 :getContextMenuItems="getContextMenuItems"
                 suppressAutoSize
                 animateRows
                 @rowClicked="rowClicked"
                 @sortChanged="refreshEvenRowsCurrencyData"
                 @filterChanged="refreshEvenRowsCurrencyData"
                 :localeText="$store.state.caseInformation.localeText"
                 :suppressDragLeaveHidesColumns="true"
                 :suppressMakeColumnVisibleAfterUnGroup="true"
                 rowGroupPanelShow="always"
                 :groupSelectsChildren="true"
                 :suppressAggFuncInHeader="true"
                 :autoGroupColumnDef="autoGroupColumnDef"
                 :masterDetail="true"
                 keepDetailRows
                 :rowHeight="$commonUtils.getRowHeight()"
      >
      </AgGridVue>
      <pagination
        :style="{width:'100%',overflow: 'auto'}"
        v-if="total"
        :total="total"
        style="border: 1px solid #BDC3C7;border-top: none;"
        :page.sync="listQuery.pageNo"
        :limit.sync="listQuery.pageSize"
        @pagination="queryList"
        :pageSizes="pageSizesList"
        :storageName="$options.name"
      />
      <div class="checkbox" v-show="checkboxState">
        <el-select ref="checkCaseSelect" v-model="checkCaseList" multiple reserve-keyword filterable placeholder="请选择"
                   collapse-tags :popper-append-to-body="false" @visible-change="handleChange"
                   :filter-method="filterCheck">
          <template slot="">
            <div class="checkbox_bottom">
              <el-button size="mini" round @click.stop="delPreference(1)">恢复默认</el-button>
              <el-button style="margin-right: 3px" size="mini" round @click.stop="savePreference(1)">保存设置</el-button>
              <!--<el-button size="mini" round @click.stop="checkNotAtAll">全不选</el-button>-->
            </div>
          </template>
          <el-option v-for="(item,idx) in selectColumnList.filter(item =>item.COLUMN_COMMENT.includes(filterText))"
                     :key="item.COLUMN_NAME" :label="item.COLUMN_COMMENT" :value="item.COLUMN_NAME">
            <!--<el-checkbox v-model="selectBox[idx]">{{item.COLUMN_COMMENT}}</el-checkbox>-->
          </el-option>
        </el-select>
      </div>
    </div>

    <!--    导出-->
    <SelectOption
      :buss-id="52"
      v-if="selectionOptionState"
      :dialog-visible="selectionOptionState"
      @cancel="closeSelect"
      :idArray="getSelectedRows().map(item=>item['custId'])"
      :defaultMultipleSelect="preferenceList.map(i=>i.title)"
      :exportType="exportType"
      :exportQueryModel="exportQueryModel"></SelectOption>
  </div>
</template>

<script>
  import {formatAmount, fomatFloat} from '@/utils/filters'
  import keyboardTopAndBottom from '@/mixins/keyboardTopAndBottom.vue'
  import {
    queryCustomerNameId,
    selectColumn,
    queryPreference,
    savePreference,
    configFilter,
    queryFilterConfig,
    queryFilter,
    addFilterScheme,
    delPreference,
    queryApplicantByIdList,
    checkPermission
  } from '@/api/caseList.js'
  import {queryDebtCustomer} from '@/api/billApi'
  import Pagination from '@/components/Pagination'
  import SelectOption from "../../../case/components/SelectOption";
  export default {
    name: "custGrid",
    mixins: [keyboardTopAndBottom],
    components: {
      SelectOption,
      Pagination
    },
    props: {
      maxWidth: "",
      statementTopHeight: {
        default: '100%',
        type: String
      }
    },
    data() {
      var tableHeader = []
      if (localStorage.getItem('tableHeader') && JSON.parse(localStorage.getItem('tableHeader')).find(item => item.name == this.$options.name + this.$route.name)) {
        tableHeader = JSON.parse(localStorage.getItem('tableHeader')).find(item => item.name == this.$options.name + this.$route.name).tableHeader
      }
      return {
        exportQueryModel: '',
        exportType: '',
        selectionOptionState: false,
        total: 0,
        pageSizesList: [10, 50, 200, 500, 1000, 5000, 10000],
        queryModuleData: {},
        searchType: 0,
        autoGroupColumnDef: {
          headerName: '组',
          field: 'group',
          headerCheckboxSelection: true,
          cellRenderer: 'agGroupCellRenderer',
          cellRendererParams: {checkbox: true}
        },
        currentPageSize: 0,
        brushRightHasFilter: false,
        gridOptions: {
          ...this.$store.state.caseInformation.gridOptions, ...{
            // statusBar: {
            //   statusPanels: [
            //     {statusPanel: 'agTotalAndFilteredRowCountComponent', align: 'left'},
            //     {statusPanel: 'agSelectedRowCountComponent', align: 'left'}
            //   ]
            // }
            //floatingFilter: true,
          }
        },
        defaultcolumnDefs: [
          {
            headerName: '序号',
            field: 'sid',
            width: 60,
            resizable: true,
            enableRowGroup: true,
            // enablePivot: true,
            'pinned': 'left',
            floatingFilter: true,
            filter: false,
            cellClass: 'vAlign',
            cellRenderer: this.cellRenderer,
            suppressMenu: true
          }
        ],
        preferenceList: [],
        selectColumnList: [],
        checkCaseList: [],
        bussId: 52,
        tableHeader,
        list: [],
        columnDefs: [],
        checkboxState: false,
        filterText: '',
        gridparams: {},
        gridApi: {},
        columnApi: {},
        listQuery: {
          pageNo: 1,
          pageSize: JSON.parse(localStorage.getItem('pageSize')) ? JSON.parse(localStorage.getItem('pageSize')).find(item => item.name == this.$options.name) ? JSON.parse(localStorage.getItem('pageSize')).find(item => item.name == this.$options.name).pageSize : 10 : 10
        }
      }
    },
    watch: {
      checkboxState(n) {
        if (n) {
          this.$nextTick(() => {
            this.$refs.checkCaseSelect.focus()
          })
        }
      }
    },
    created() {
      this.queryTitle()
    },
    methods: {
      brushRight() {
        let data = this.$commonUtils.getFilterModel(this.$options.name + this.$route.name, 'FilterModel')
        let arr = Object.keys(data)
        arr.forEach(item => {
          this.gridApi.destroyFilter(item)
        })
      },
      exportList(flag) {
        this.exportType = flag
        this.selectionOptionState = true
      },
      closeSelect() {
        this.selectionOptionState = false
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
      handleSearch(flag) {
        if (typeof flag == 'object') {
          const {searchType, searchData} = flag
          if (searchData.isAll) {
            delete this.queryModuleData.custCountry
          }
          if (searchData.custCountry) {
            delete this.queryModuleData.isAll
          }
          this.queryModuleData = Object.assign(this.queryModuleData, searchData)
          if (searchType !== undefined) {
            this.searchType = searchType
          }
        } else {
          this.searchType = flag
        }
        this.queryList()
      },
      delPreference(num) {
        const data = {
          userId: this.$store.getters.userId,
          bussId: this.bussId
        }
        delPreference(data).then(res => {
          if (res.success) {
            this.checkboxState = false
            if (!num) {
              this.handleSearch(this.searchType)
            }
            this.queryTitle()
          }
        })
      },
      filterCheck(val) {
        this.filterText = val
      },
      handleChange(boolean) {
        if (!boolean) {
          this.checkboxState = false
        }
      },
      refreshEvenRowsCurrencyData(params) {
        this.currentPageSize = params.api.rowModel.rootNode.allChildrenCount
        this.gridApi.rowModel.rootNode.childrenAfterFilter&&this.gridApi.rowModel.rootNode.childrenAfterFilter.length&&this.gridApi.rowModel.rootNode.childrenAfterFilter.forEach(rowNode => {
          setTimeout(() => {
            rowNode.setDataValue(
            'sid',
            rowNode.rowIndex + 1)
          }, 0)
        });
        // if (!params.columnApi.columnController.groupAutoColumns) {
        //   this.gridApi.forEachNode(rowNode => {
        //     rowNode.setDataValue(
        //       'sid',
        //       rowNode.rowIndex + 1)
        //   })
        // }
        if (this.list.length) {
          if (params.type == 'filterChanged') {
            this.$commonUtils.saveFilterModel(this.$options.name + this.$route.name, 'FilterModel', this.gridApi.getFilterModel())
            var data = this.$commonUtils.getFilterModel(this.$options.name + this.$route.name, 'FilterModel')
            var arr = Object.keys(data)
            if (arr.length) {
              this.brushRightHasFilter = true
            } else {
              this.brushRightHasFilter = false
            }
          }
        }
      },
      rowClicked(params) {
        this.$emit('selectedRow', params)
      },
      getContextMenuItems(params) {
        if (!params.node.data) {
          return []
        }
        return this.getRowContextmenuList(params.node.data).map(item => ({
          name: item.name,
          action: () => {
            this[item.action](params.node.data, params.value)
          }
        }))
      },
      copy(row, value, event) {
        if (value) {
          this.$copyText(String(value)).then(
            res => {
            })
        } else {
          this.$copyText(event.target.innerText).then(
            res => {
            })
        }
      },
      setCredit(row) {
        this.$emit('events', {action: 'STATEMENT_SET_CREDIT', data: {...row, rightKeySign: true}})
      },
      setStatement(row) {
        this.$emit('events', {action: 'STATEMENT_SET_STATEMENT', data: {...row, rightKeySign: true}})
      },
      getRowContextmenuList(row) {
        return [
          {name: '复制', action: 'copy'},
          {name: '设定信用等级', action: 'setCredit'},
          {name: '设定对账信息', action: 'setStatement'},
        ].filter(item => {
          if (item.flag) {
            // return row.flag === item.flag
          } else {
            return true
          }
        })
      },
      cellRenderer(params) {
        if (params.colDef.field === 'sid') {
          return params.rowIndex + 1
        }
        const mountList = ['skamount', 'zdamount', 'totalDebt', '']
        if(mountList.includes(params.colDef.field)){
          return `<span title="${params.value}" style="float: right">${formatAmount(params.value) || ''}</span>`
        }
        return `<span title="${params.value}">${(params.value || params.value === 0) ? params.value : ''}</span>`
      },
      getLoactionWidth(label) {
        if (!localStorage.getItem('tableHeader')) {
          return 'auto'
        } else {
          var arr = JSON.parse(localStorage.getItem('tableHeader'))
          if (arr.find(item => item.name == this.$options.name + this.$route.name)) {
            var header = arr.find(item => item.name == this.$options.name + this.$route.name).tableHeader
            if (header.find(item => item.label == label)) {
              return header.find(item => item.label == label).width
            } else {
              return 'auto'
            }
          } else {
            return 'auto'
          }
        }
      },
      queryPartData(custId){
        queryDebtCustomer({custId}).then(res => {

        })
      },
      queryList() {
        const data = {
          pageNo: this.listQuery.pageNo,
          pageSize: this.listQuery.pageSize
        }
        let searchData = Object.assign(data, this.queryModuleData)
        const inList = ['custIdArray']
        const outList = ['isAll', 'custCountry']
        for (let k in searchData) {
          if (this.searchType) { // 外
            if (inList.includes(k)) {
              delete searchData[k]
            }
          } else { // 内
            if (outList.includes(k)) {
              delete searchData[k]
              delete this.queryModuleData[k]
            }
          }

        }
        this.exportQueryModel = JSON.stringify(searchData)
        queryDebtCustomer(searchData).then(res => {
          this.list = res.data
          this.total = res.total
          this.$nextTick(() => {
            if (this.list.length) {
              if (this.gridApi.rowModel.rootNode.childrenAfterFilter.length) {
                this.gridApi.rowModel.rootNode.childrenAfterFilter[0] && this.gridApi.rowModel.rootNode.childrenAfterFilter[0].setSelected(true)
                this.$emit('selectedRow', this.gridApi.rowModel.rootNode.childrenAfterFilter[0])
              }
            }
          })
          this.saveLocation()
        })
        if (JSON.parse(localStorage.getItem('queryModuleData'))) {
          var arr = JSON.parse(localStorage.getItem('queryModuleData'))
        } else {
          var arr = []
        }
        if (arr.find(item => item.name == this.$route.name)) {
          arr.find(item => item.name == this.$route.name).queryModuleData = this.queryModuleData
        } else {
          arr.push({name: this.$route.name, queryModuleData: this.queryModuleData})
        }
        localStorage.setItem('queryModuleData', JSON.stringify(arr))
      },
      defaultQuerySearch() {
        this.queryModuleData = JSON.parse(localStorage.getItem('queryModuleData')) ? JSON.parse(localStorage.getItem('queryModuleData')).find(item => item.name == this.$route.name) ? JSON.parse(localStorage.getItem('queryModuleData')).find(item => item.name == this.$route.name).queryModuleData : {} : {}
        if (this.queryModuleData.isAll || this.queryModuleData.custCountry) {
          this.searchType = 1
        }
      },
      queryTitle() {
        // this.defaultQuerySearch()
        const data = {
          userId: this.$store.getters.userId,
          bussId: this.bussId
        }
        Promise.all([selectColumn(data), queryPreference(data)]).then(res => {
          this.selectColumnList = res[0].data

          this.preferenceList = res[1].data
          this.tableHeader = this.preferenceList.map(item => ({
            label: item.title,
            prop: item.value,
            width: this.getLoactionWidth(item.title)
          }))
          this.columnDefs = [...this.defaultcolumnDefs, ...this.preferenceList.map(item => ({
            headerName: item.title,
            field: item.value,
            width: this.getLoactionWidth(item.title) == 'auto' ? 110 : this.getLoactionWidth(item.title),
            resizable: true,
            sortable: true,
            filter: 'agSetColumnFilter',
            menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
            cellRenderer: this.cellRenderer,
            enableRowGroup: true,
            filterParams: {
              newRowsAction: 'keep',
              comparator: (a, b) => {
                return this.$commonUtils.sort(a, b, item.value)
              }
            },
            cellStyle: (params) => {
              if(!params.data){
                return
              }
              if(params.data.nextMonth <= this.$wUtil.getDate('', 'month') && (this.queryModuleData.custCountry == '国际' || this.queryModuleData.custCountry == '国内' || this.queryModuleData.isAll == 4)) {
                return {color:'#FB1E1E'}
              }
              // return {color:'#333'}
            }
          }))]
          this.$nextTick(()=>{
            this.columnDefs.forEach(item=>{
              this.columnApi.getColumn(item.field).addEventListener('menuVisibleChanged', ()=>{
                if(document.querySelector(".ag-tabs") && document.querySelector(".ag-set-filter-list")){
                 new this.$DraginResize(document.querySelector(".ag-set-filter-list"), {
                    clone: true,
                    end(info) {
                      if (info.dir == 'ver') {
                        this.elem.style.height = info.height + 'px';
                      }
                      else if (info.dir == 'hor') {
                        this.elem.style.width = info.width + 'px';
                      }
                    }
                  })
                }
                let data =   this.$commonUtils.getFilterModel(this.$options.name+this.$route.name,'FilterModel')
                let arr =  Object.keys(data)
                if(this.columnDefs.map(itm => itm.field).diff(arr).includes(item.field)){
                  this.gridApi.getFilterInstance(item.field).selectNothing()
                }
              });
            })

          })
          this.checkCaseList = this.preferenceList.map(item => item.value)
        })
      },
      dragStopped(params) {
        let tableHeader = params.columnApi.columnController.gridColumns.map(item => ({
          label: item.colDef.headerName,
          width: item.actualWidth,
          prop: item.colDef.field
        })).filter(item => item.prop != 'sid' && item.prop != 'group')
        this.tableHeader = tableHeader
        this.changeHeader(tableHeader)
        this.saveLocation()
      },
      changeHeader(n) {
        if (n && n.length) {
          this.checkCaseList = n.map(item => item.prop).filter(item => item != 'sid')
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
      savePreference(num) {
        let list2 = this.checkCaseList.map(item => ({
          title: this.selectColumnList.find(i => i.COLUMN_NAME === item)
            .COLUMN_COMMENT,
          value: item
        }))
        const data = {
          userId: this.$store.getters.userId,
          bussId: this.bussId,
          list2
        }
        savePreference(data).then(res => {
          if (res.success) {
            this.checkboxState = false
            this.filterText = ''
            if (!num) {
              this.handleSearch(this.searchType)
            }
            this.queryTitle()
          }
        })
      },
      saveLocation() {
        if (!localStorage.getItem('tableHeader')) {
          let arr = []
          arr.push({name: this.$options.name + this.$route.name, tableHeader: this.tableHeader})
          localStorage.setItem('tableHeader', JSON.stringify(arr))
        } else {
          let arr = JSON.parse(localStorage.getItem('tableHeader'))
          if (arr.find(item => item.name == this.$options.name + this.$route.name)) {
            arr.find(item => item.name == this.$options.name + this.$route.name).tableHeader = this.tableHeader
            localStorage.setItem('tableHeader', JSON.stringify(arr))
          } else {
            arr.push({name: this.$options.name + this.$route.name, tableHeader: this.tableHeader})
            localStorage.setItem('tableHeader', JSON.stringify(arr))
          }
        }
      },
      handleCheckboxState() {
        this.checkboxState = !this.checkboxState
      },
      onGridReady(params) {
        this.gridparams = params
        this.gridApi = params.api
        this.columnApi = params.columnApi
        this.initKeyboard()
        // params.api.sizeColumnsToFit()
      },
      changeSelectedEvent(){
        this.rowClicked({data: this.getSelectedRows()[0]})
      }
    }
  }
</script>

<style lang="scss" scoped>
  .dots {
    cursor: pointer;
    position: absolute;
    left: 0;
    z-index: 1;
    top: 5px;
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
    top: 33px;
    width: 222px;
    height: 324px;
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

  .checkboxChangeRadio {
    /deep/ .el-checkbox__inner {
      border-radius: 50%;
    }

    /deep/ .el-checkbox__inner:after {
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background-color: #FFF;
      position: absolute;
      left: 50%;
      top: 50%;
      -webkit-transition: -webkit-transform .01s ease-in;
      transition: -webkit-transform .01s ease-in;
      transition: transform .01s ease-in;
      transition: transform .01s ease-in, -webkit-transform .01s ease-in;
      transition: transform .01s ease-in, -webkit-transform .01s ease-in;
      transform: translate(-50%, -50%) scale(1);
    }
  }
  >>>.pagination-container{
    overflow: hidden!important;
  }
  .brush_right {
    position: absolute;
    right: 6px;
    z-index: 1;
    top: -4px;
  }
</style>
