<template>
  <div class="time-wrapper">
    <div class="btns">
<!--      <TitleTotal :total="total"/>-->
      <el-button type="primary" size="mini" v-allow="445" @click="createFun">新建</el-button>
      <el-form size="mini">
        <el-form-item label="注册国家:" label-width="100px" style="margin-bottom: 0;">
          <!--            <el-input size="mini" v-model="trialForm.term"></el-input>-->
          <el-select size="mini" multiple :clearable="true" default-first-option filterable placeholder="请选择" ref="appContactPerson" v-model="listQuery.appStateList">
            <el-option :key="key" :label="item.value" :value="item.value" v-for="(item, key) in countryList" />
          </el-select>
        </el-form-item>
      </el-form>
      <!--      <el-button type="primary" size="mini">删除</el-button>-->
    </div>
    <el-button class="brush_right" :class="brushRightHasFilter?'red':''" @click="brushRight" type="text"
               icon="el-icon-brush"></el-button>
    <AgGridVue
      :style="{height: clientHeight + 'px', width: '500px'}"
      class="ag-theme-balham"
      :columnDefs="columnDefs"
      :rowData="gridData"
      rowSelection="multiple"
      @grid-ready="onGridReady"
      :gridOptions="gridOptions"
      :getContextMenuItems="getContextMenuItems"
      @sortChanged="refreshEvenRowsCurrencyData"
      @filterChanged="refreshEvenRowsCurrencyData"
      suppressAutoSize
      animateRows
      :localeText="$store.state.caseInformation.localeText"
    >
    </AgGridVue>
<!--    <pagination v-show="total > 0" :total="total" :page-sizes="[10,50,100,500,1000,5000]" :page.sync="listQuery.pageNo"-->
<!--                :limit.sync="listQuery.pageSize" @pagination="getList"/>-->

    <el-dialog :title="title" :close-on-click-modal="false" append-to-body :visible.sync="dialogVisible" width="30%">
      <el-form label-position="right" label-width="130px" :model="trialForm">
        <el-row style="width: 100%">
          <el-form-item label="案件类型:">
<!--            <el-input size="mini" v-model="trialForm.appMatter"></el-input>-->
             <el-cascader
               ref="caseTypecascader"
               filterable
               size="mini"
               clearable
               style="width: 100%"
               v-model="trialForm.appMatter"
               :show-all-levels="false"
               :options="$store.getters.caseTypeList.filter(item => item.caseType === '商标')[0].childrens"
               :props="{
                  value: 'caseType',
                  label: 'caseType',
                  children: 'childrens',
                  checkStrictly:false
                }"
               placeholder="请选择"
              >
              </el-cascader>
          </el-form-item>
        </el-row>
        <el-row style="width: 100%">
          <el-form-item label="平均审理期限(月):">
            <el-input size="mini" :disabled="title === '修改审限' && trialForm.appState !== '中国'" v-model="trialForm.term" placeholder="请输入"></el-input>
          </el-form-item>
        </el-row>
        <el-row style="width: 100%">
          <el-form-item label="注册国家:">
<!--            <el-input size="mini" v-model="trialForm.term"></el-input>-->
            <el-select size="mini" :clearable="true" default-first-option filterable placeholder="请选择" ref="appContactPerson" v-model="trialForm.appState">
              <el-option :key="key" :label="item.value" :value="item.value" v-for="(item, key) in countryList" />
            </el-select>
          </el-form-item>
        </el-row>
        <el-row style="width: 100%">
          <el-form-item label="案件阶段:">
            <el-select size="mini" multiple :clearable="true" default-first-option filterable placeholder="请选择" ref="appContactPerson" v-model="trialForm.caseStageIdList">
              <el-option :key="key" :label="item.value" :value="item.id" v-for="(item, key) in stageList" />
            </el-select>
          </el-form-item>
        </el-row>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="submitTrial">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import Pagination from "../../Pagination/index";
  import {
    addTrademarkHearTerm,
    delTrademarkHearTermById,
    queryTrademarkHearTermList,
    updateTrademarkHearTerm
  } from "../../../api/caseList";
  import { queryCaseStageTm, queryCountryTm } from '@/api/caseDetail'

  export default {
    name: "TrialTimelimit",
    components: {Pagination},
    data() {
      return {
        stageList: [],
        countryList: [],
        caseTypeOptions: [],
        caseTypeProps: { // 級聯菜單默認
          value: 'caseTypeId',
          label: 'caseType',
          children: 'childrens',
          checkStrictly: false
        },
        title: '',
        dialogVisible: false,
        brushRightHasFilter: false,
        total: 0,
        gridData: [],
        listQuery: {
          pageNo: 1,
          pageSize: 99999,
          appState: '',
          appStateList: []

        },
        gridApi: {},
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
        trialForm: {
          appMatter: '',
          term: '',
          appState: '',
          caseStageId: '',
          caseStageIdList: []
        },
        preferenceList: [
          {'label': '案件类型', prop: 'appMatter'},
          {'label': '平均审理期限(月)', prop: 'term'},
          {'label': '案件阶段', prop: 'caseStageName'},
        ],
      }
    },
    computed: {
      clientHeight() {
        return document.documentElement.clientHeight - 160
      }
    },
    watch: {
      "listQuery.appStateList": {
        handler(n) {
          this.listQuery.appState = n.join(',')
          this.getList()
        }
      }
    },
    created() {
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
          defaultToNothingSelected: true,
          newRowsAction: 'keep',
          comparator: (a, b) => {
            return this.$commonUtils.sort(a, b, item.prop)
          }
        }
      }))]
      this.getList()
      this.queryCountryCase()
      this.queryStageList()
    },
    methods: {
      queryStageList() {
        queryCaseStageTm().then(res => {
          this.stageList = res.data || []
        })
      },
      queryCountryCase() {
        queryCountryTm().then(res => {
          this.countryList = res.data
        })
      },
      submitTrial() {
        const data = JSON.parse(JSON.stringify(this.trialForm))
        data.caseStageId = data.caseStageIdList.join(',')
        data.appMatter = data.appMatter[data.appMatter.length - 1]
        delete data.caseStageIdList
        if (this.title == "添加审限") {
          addTrademarkHearTerm(data).then(res => {
            this.$message.success("添加成功!")
            this.getList()
            this.dialogVisible = false
          })
        } else {
          updateTrademarkHearTerm(data).then(res => {
            this.$message.success("修改成功!")
            this.getList()
            this.dialogVisible = false
          })
        }

      },
      brushRight() {
        let arr = this.columnDefs.map(item => item.field)// Object.keys(data)
        arr.forEach(item => {
          this.gridApi.destroyFilter(item)
        })
        this.brushRightHasFilter = false
      },
      getList() {
        const queryData = JSON.parse(JSON.stringify(this.listQuery))
        if (!queryData.appState) {
          queryData.appState = '暂无国家'
        }
        delete queryData.appStateList
        queryTrademarkHearTermList(queryData).then(res => {
          this.gridData = res.data || []
          this.total = res.total
        })
      },
      refreshEvenRowsCurrencyData(params) {
        this.currentPageSize = params.api.rowModel.rootNode.allChildrenCount
        if (!params.columnApi.columnController.groupAutoColumns) {
          this.gridApi.forEachNode(rowNode => {
            rowNode.setDataValue(
              'sid',
              rowNode.rowIndex + 1)
          })
        }
        if (Object.keys(this.gridApi.getFilterModel()).length) {
          this.brushRightHasFilter = true
        } else {
          this.brushRightHasFilter = false
        }
      },
      cellRenderer(params) {
        if (params.colDef.field === 'sid') {
          return params.rowIndex + 1
        }
        return `<span title="${params.value || ''}">${params.value || ''}</span>`
      },
      onGridReady(params) {
        this.gridApi = params.api
        params.api.sizeColumnsToFit()
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
          {name: '修改', action: 'editFun', permissions: 445},
          {name: '删除', action: 'delFun', permissions: 445}
        ].filter(item => {
          if (item.permissions) {
            return this.$store.getters.permissions.includes(item.permissions)
          } else {
            return true
          }
        })
      },
      copy(row, index, value) {
        if (value) {
          this.$copyText(String(value)).then(
            res => {
            })
        }
      },
      createFun() {
        this.title = "添加审限"
        this.dialogVisible = true
        this.trialForm = {
          appMatter: [],
          term: '',
          appState: '',
          caseStageId: '',
          caseStageIdList: []
        }
      },
      editFun(row) {
        const data = JSON.parse(JSON.stringify(row))
        data.caseStageIdList =  data.caseStageId && data.caseStageId.split(',').map(item => Number(item)) || []
        const caseTypeList = this.$commonUtils.extractTree(this.$commonUtils.findParentLevel(this.$store.getters.caseTypeList.filter(item => item.caseType === '商标'), 'caseType', [data.appMatter], 'parent', 'childrens', 'caseTypeId'), 'childrens').map(item => item.caseType)
        caseTypeList.splice(0, 1)
        data.appMatter = caseTypeList
        this.trialForm = data
        this.title = "修改审限"
        this.dialogVisible = true
      },
      delFun(row) {
        this.$confirm('此操作将永久删除该审限, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delTrademarkHearTermById({id: row.id}).then(res => {
            this.$message.success("删除成功!")
            this.getList()
          })
        }).catch(() => {

        })

      }
    }
  }
</script>

<style lang="scss" scoped>
  .time-wrapper {
    padding: 15px 45px 15px 15px;
    width: 100%;
    height: 100%;
  }

  .brush_right {
    position: absolute;
    right: 50px;
    z-index: 1;
    top: 50px;
  }

  .btns {
    display: flex;
    justify-content: space-between;
    padding: 5px 0;
  }
</style>
