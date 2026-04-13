<template>
  <div>
    <div style="margin-bottom: 10px">
      <el-button size="mini" type="primary" @click="createRule">添加</el-button>
    </div>
    <el-button class="brush_right" :class="brushRightHasFilter?'red':''" @click="brushRight" type="text"
                 icon="el-icon-brush"></el-button>
    <AgGridVue :style="{width:'100%',height: clientHeight + 'px'}"
               id="right-grid"
               class="ag-theme-balham"
               :columnDefs="columnDefs"
               :rowData="tableData"
               @grid-ready="onGridReady"
               rowSelection="multiple"
               :gridOptions="gridOptions"
               suppressAutoSize
               animateRows
               :getContextMenuItems="getContextMenuItems"
               @sortChanged="refreshEvenRowsCurrencyData"
               @filterChanged="refreshEvenRowsCurrencyData"
               :localeText="$store.state.caseInformation.localeText"
               :groupSelectsChildren="true"
               :suppressAggFuncInHeader="true"
               rowHeight="28"
    >
    </AgGridVue>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :pageSizes="pageSizesList"
                :limit.sync="listQuery.pageSize" @pagination="queryFeeRuleList()"/>

    <el-dialog :close-on-click-modal="false" title="提示" :visible.sync="ruleView" width="40%" :before-close="closeView">
      <el-row>
        <el-col :span="24">
          <el-form label-width="100px" :model="ruleData">
            <el-form-item label="费用科目:">
              <el-multi-cascader
                      ref="multiCascader"
                      :show-all-levels="false"
                      :options="feeTypeList"
                      multiple
                      filterable
                      clearable
                      :props="defaultParams"
                      change-on-select
                      selectChildren
                      v-model="ruleData.feetIdList"></el-multi-cascader>
<!--              <el-cascader-->
<!--                style="width: 100%;"-->
<!--                ref="cascader"-->
<!--                v-model="ruleData.feetIdList"-->
<!--                filterable-->
<!--                clearable-->
<!--                :emitPath="false"-->
<!--                :change-on-select="true"-->
<!--                :show-all-levels="true"-->
<!--                :options="feeTypeList"-->
<!--                :props="defaultParams"-->
<!--                placeholder="请选择费用科目"-->
<!--              ></el-cascader>-->
            </el-form-item>
            <el-form-item label="部门:" size="">
              <el-select style="width: 100%;" v-model="ruleData.deptId" filterable clearable reserve-keyword
                         placeholder="请选择部门">
                <el-option v-for="itm in deptByConditionList" :key="itm.deptId" :label="itm.name" :value="itm.deptId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="工作组:">
              <el-select style="width: 100%;" size="" default-first-option v-model="ruleData.wkgId" clearable
                         filterable placeholder="请选择工作组">
                <el-option
                  v-for="item in queryWorkgroupNamesList"
                  :key="item.wkgId"
                  :label="item.groupName"
                  :value="item.wkgId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="层级:">
              <el-select style="width: 100%;" size="" placeholder="请选择层级" default-first-option v-model="ruleData.level"
                         clearable>
                <el-option
                  v-for="item in 5"
                  :key="item"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="审核人:">
              <el-select style="width: 100%;" size="" default-first-option v-model="ruleData.userIdList" multiple
                         clearable
                         filterable placeholder="请选择审核人">
                <el-option
                  v-for="item in $store.getters.userList"
                  :key="item.userId"
                  :label="item.fullname"
                  :value="item.userId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="限制金额:">
              <el-input placeholder="请填写限制金额" size="" v-model="ruleData.amount"></el-input>
            </el-form-item>
            <el-form-item label="备注:">
              <el-input placeholder="请填写备注" type="textarea" v-model="ruleData.remark"></el-input>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer fl-ac-jc">
        <el-button size="small" @click="() => closeView()">取 消</el-button>
        <el-button size="small" type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>

  import {createFeeRule, deleteFeeRule, modifyFeeRule, queryFeeRuleList, queryFeeTypeList} from "../../../api/feeList";
  import Pagination from "../../../components/Pagination/index";
  import {queryDeptByCondition, queryWorkgroupNames} from "../../../api/systemList";

  export default {
    name: 'feeRules',
    components: {Pagination},
    data() {
      return {
        brushRightHasFilter: false,
        viewType: '',
        defaultParams: {
          value: 'feetId',
          label: 'feeName',
          checkStrictly: true,
          children: 'feeTypes'
        },
        queryWorkgroupNamesList: [],
        deptByConditionList: [],
        ruleView: false,
        ruleData: {
          deptId: '',
          userIdList: [],
          amount: '',
          level: '',
          wkgId: '',
          feetIdList: [],
        },
        pageSizesList: [10, 50, 200, 500, 1000, 5000, 10000],
        listQuery: {
          pageNo: 1,
          pageSize: JSON.parse(localStorage.getItem('pageSize'))?JSON.parse(localStorage.getItem('pageSize')).find(item=>item.name==this.$route.name)?JSON.parse(localStorage.getItem('pageSize')).find(item=>item.name==this.$route.name).pageSize:10:10
        },
        tableData: [],
        total: 0,
        tableTitleList: [
          {'title': '费用科目名称', 'value': 'feeNames', 'editable': false},
          {'title': '部门', 'value': 'name', 'editable': false},
          {'title': '工作组', 'value': 'groupName', 'editable': false},
          {'title': '层级', 'value': 'level', 'editable': false},
          {'title': '任务人', 'value': 'taskers', 'editable': false},
          {'title': '限制金额', 'value': 'amount', 'editable': false},
          {'title': '备注', 'value': 'remark', 'editable': false},


        ],
        gridOptions: {
          ...this.$store.state.caseInformation.gridOptions,
        },
        defaultcolumnDefs: [
          {
            headerName: '序号',
            field: 'sid',
            width: 60,
            'pinned': 'left', //固定再左边
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
        gridparams: {},
        gridApi: {},
        columnApi: {},
        feeTypeList: []
      }
    },
    computed: {
      clientHeight() {
        return document.documentElement.clientHeight - 170
      },
    },
    created() {
      this.getColumDefs()
      this.queryDeptByCondition()
      this.queryWorkgroupNames()
      this.queryFeeTypeList()
    },
    methods: {
      brushRight() {
        let data = this.$commonUtils.getFilterModel(this.$options.name + this.$route.name, 'FilterModel')
        let arr = Object.keys(data)
        arr.forEach(item => {
          this.gridApi.destroyFilter(item)
        })
        this.$commonUtils.saveFilterModel(this.$options.name+this.$route.name,'FilterModel', {})
      },
      getFilterModel() {
        this.$nextTick(() => {
          let data = this.$commonUtils.getFilterModel(this.$options.name + this.$route.name, 'FilterModel')
          let arr = Object.keys(data)
          let arrInstance = arr.map(item => this.gridApi.getFilterInstance(item))
          arrInstance.forEach((item, index) => {
            // item.selectNothing()
            item.setModel(data[arr[index]])
            item.applyModel()
          })
          this.gridApi.onFilterChanged()
          let sortData = this.$commonUtils.getFilterModel(this.$options.name + this.$route.name, 'SortModel')
          if (sortData && sortData.length) {
            this.gridApi.setSortModel(sortData)
            this.gridApi.onSortChanged()
          }

        })
      },
      queryFeeTypeList() {
        queryFeeTypeList().then(res => {
          this.feeTypeList = res.data
          this.feeTypeList = this.$commonUtils.cascaderDisabled(this.feeTypeList, 'feeTypes', 'isUse')
        })
      },
      queryWorkgroupNames() {
        queryWorkgroupNames().then(res => {
          if (res.success) {
            this.queryWorkgroupNamesList = res.data
          }
        })
      },
      queryDeptByCondition() {
        queryDeptByCondition({isactive: 1}).then(res => {
          this.deptByConditionList = res.data
        })
      },
      createRule() {
        this.ruleView = true
        this.viewType = 'create'
      },
      closeView(done) {
        this.ruleView = false
        this.viewType = ''
        this.ruleData = {
          deptId: '',
          userIdList: [],
          amount: '',
          level: '',
          wkgId: '',
          feetIdList: []
        }
        done && done()
      },
      submit() {
        if (this.viewType === 'create') {
          this.ruleData.feetIds = this.ruleData.feetIdList.filter(arr => arr.length > 3).map(item => item[item.length - 1]).join(',')
          this.ruleData.userIds = this.ruleData.userIdList.join(',')
          createFeeRule(this.ruleData).then(res => {
            this.closeView()
            this.queryFeeRuleList()
          })
        } else if (this.viewType === 'edit') {
          this.ruleData.feetIds = this.ruleData.feetIdList.join(',')
          this.ruleData.userIds = this.ruleData.userIdList.join(',')
          modifyFeeRule(this.ruleData).then(res => {
            this.closeView()
            this.queryFeeRuleList()
          })
        }
      },
      queryFeeRuleList() {
        queryFeeRuleList(this.listQuery).then(res => {
          this.tableData = res.data || []
          if (this.tableData.length) {
            this.getFilterModel()
          }
          this.total = res.total
        })
      },
      scrollToBottom() {
        this.$nextTick(() => {
          let sObj = document.getElementById('right-grid').getElementsByClassName('ag-body-viewport')[0]
          sObj.scrollTop = sObj.scrollHeight
        })
      },
      refreshCells() {
        this.gridApi.stopEditing(false)
        this.gridApi.refreshCells()
      },
      cellRenderer(params) {
        if (params.colDef.field == 'sid' && params.value !== '') {
          return params.rowIndex + 1
        }
        return `<span title="${params.value}">${(params.value || params.value === 0) ? params.value : ''}</span>`
      },
      onGridReady(params) {
        this.gridparams = params
        this.gridApi = params.api
        this.columnApi = params.columnApi
        params.api.sizeColumnsToFit()
      },
      getColumDefs() {
        this.columnDefs = [...this.defaultcolumnDefs, ...this.tableTitleList.map(item => ({
          headerName: item.title,
          field: item.value,
          width: item.width,
          resizable: true,
          editable: !!item.editable,
          cellEditor: item.cellEditor,
          // sortable: true,
          filter: 'agSetColumnFilter',
          cellRenderer: this.cellRenderer,
          menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
          // enableRowGroup: true,
          filterParams: {
            refreshValuesOnOpen: true,
            comparator: (a, b) => {
              return this.$commonUtils.sort(a, b, item.value)
            }
          }
        }))]
        this.queryFeeRuleList()
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
          // setTimeout(() =>{
          //   this.gridApi.forEachNode(rowNode => {
          //     rowNode.setDataValue(
          //       'sid',
          //       rowNode.rowIndex + 1)
          //   });
          // }, 0)
        // }
        if (this.tableData.length) {
          if (params.type == "filterChanged") {
            let obj = this.gridApi.getFilterModel()
            for (let k in obj) {
              if (obj.hasOwnProperty(k)) {
                if(obj[k].values && !obj[k].values.length){
                  delete obj[k]
                }
              }
            }
            Object.keys(obj).length && this.$commonUtils.saveFilterModel(this.$options.name+this.$route.name,'FilterModel', this.gridApi.getFilterModel())
            var data = this.$commonUtils.getFilterModel(this.$options.name + this.$route.name, 'FilterModel');
            var arr = Object.keys(data);
            if (arr.length) {
              this.brushRightHasFilter = true
            } else {
              this.brushRightHasFilter = false
            }
          }
          if (params.type == "sortChanged") {
            this.$commonUtils.saveFilterModel(this.$options.name + this.$route.name, 'SortModel', this.gridApi.getSortModel())
          }
        }else{
          this.brushRightHasFilter = false
        }
      },
      getContextMenuItems(params) {
        if (!params.node || !params.node.data) {
          return []
        }
        return this.getRowContextmenuList(params.node.data).map(item => ({
          name: item.name,
          action: () => {
            this[item.action](params.node.data, params.node.rowIndex, params.value, params.node)
          }
        }))
      },
      getRowContextmenuList(row) {
        return [
          {name: '复制', action: 'copy'},
          {name: '修改', action: 'editFun'},
          {name: '删除', action: 'delete'}
        ]
      },
      editFun(row, index) {
        this.ruleView = true
        this.viewType = 'edit'
        if (row.userIds) {
          row.userIdList = row.userIds.split(',').map(Number)
        } else {
          row.userIdList = []
        }
        // if (row.feetIds) {
        //   row.feetIdList = row.feetIds.split(',').map(Number)
        // }
        delete row.feetIds
        delete row.userIds
        this.ruleData = JSON.parse(JSON.stringify(row))
      },
      delete(row) {
        var index = this.tableData.indexOf(row)
        this.$confirm("此操作将永久删除, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          deleteFeeRule({feeAddRulesId: row.feeAddRulesId}).then(res => {
            this.$message.success("删除成功")
            this.tableData.splice(index, 1)
            this.total--
            setTimeout(() => {
              this.getFilterModel()
            }, 200)
          })
        }).catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          })
        })
      },
      copy(row, value) {
        this.$copyText(value).then(
          res => {
          })
      },
      getSelectedRows() {
        if (this.gridApi) {
          const selectedNodes = this.gridApi.getSelectedNodes()
          const selectedData = selectedNodes.map(node => node.data)
          return selectedData
        } else {
          return false
        }

      }
    }
  }
</script>

<style lang="scss" scoped>
  /deep/ .ag-cell-inline-editing {
    background: #fff;
    color: #333;
  }

  > > > .href {
    cursor: pointer;
    color: #409eff;
  }

  > > > .ag-row-selected {
    .href {
      cursor: pointer;
      color: #fff;
    }
  }
  .brush_right {
    position: absolute;
    right: 25px;
    z-index: 1;
    top: 35px;
  }
</style>
