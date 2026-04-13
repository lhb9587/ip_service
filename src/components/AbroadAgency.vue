<template>
  <div style="padding: 15px; padding-right: 35px">
    <div v-if="!isMaterial" class="search-wrapper" style="padding: 10px">
      <el-form label-width="100px" size="mini" :model="queryData">
        <el-row>
          <el-col :span="6">
            <el-form-item label="地区/国家">
              <el-select style="width: 90%;" v-model="queryData.country" placeholder="" filterable clearable>
                <el-option
                  v-for="item in countryList"
                  :key="item.countryCn"
                  :label="item.countryCn"
                  :value="item.countryCn">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="案件类型">
              <el-multi-cascader
                ref="multiCascader"
                :show-all-levels="false"
                :options="caseTypeOptions"
                multiple
                filterable
                clearable
                :props="caseTypeProps"
                change-on-select
                selectChildren
                collapse-tags
                v-model="queryData.caseTypeIds"></el-multi-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="代理所">
              <el-select
                v-model="queryData.custIdArray"
                ref="custSelect"
                filterable
                clearable
                remote
                multiple
                reserve-keyword
                placeholder="请输入事务所名称"
                :remote-method="(v) => $wUtil.debounce(queryCustomerList(v), 500)">
                <el-option
                  v-for="item in customerNameIdList"
                  :key="item.custId"
                  :label="item.fullname"
                  :value="item.custId"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item style="margin-bottom: 0" label="立案日期">
              <DataPicker  class="DataPicker" style="line-height: 30px" v-model="queryData.caseDateArray"></DataPicker>
            </el-form-item>

          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" style="display: flex;justify-content: flex-end">
            <el-button size="mini" type="primary" @click="queryColAgencyList">查询</el-button>
            <!-- <el-button v-allow="58" size="mini" type="primary" @click="openDialog('新建')">新建</el-button> -->
            <el-button v-allow="443" type="primary" @click="exportList" size="mini">导出</el-button>

          </el-col>
        </el-row>

      </el-form>

    </div>
    <div>
      <el-button v-if="!isMaterial" class="brush_right" :class="brushRightHasFilter?'red':''" @click="brushRight" type="text"
                 icon="el-icon-brush"></el-button>
      <AgGridVue
        style="width:100%;"
        :style="{'height': clientHeight + 'px'}"
        class="ag-theme-balham"
        :columnDefs="columnDefs"
        :rowData="agencyTable"
        rowSelection="multiple"
        @grid-ready="onGridReady"
        :gridOptions="gridOptions"
        :getContextMenuItems="getContextMenuItems"
        @sortChanged="refreshEvenRowsCurrencyData"
        @filterChanged="refreshEvenRowsCurrencyData"
        @rowDoubleClicked="rowDoubleClicked"
        suppressAutoSize
        animateRows
        :localeText="$store.state.caseInformation.localeText"
        :suppressDragLeaveHidesColumns="true"
        :suppressMakeColumnVisibleAfterUnGroup="true"
        rowGroupPanelShow="always"
        :groupSelectsChildren="true"
        :suppressAggFuncInHeader="true"
        :autoGroupColumnDef="autoGroupColumnDef"
        :masterDetail="true"
        :detailCellRendererParams="detailCellRendererParams"
        keepDetailRows
        @dragStopped="dragStopped"
      >
      </AgGridVue>
      <pagination
        v-if="total>0"
        :total="total"
        :page.sync="listQuery.pageNo"
        :limit.sync="listQuery.pageSize"
        @pagination="queryColAgencyList"
        :pageSizes="pageSizesList"
      />
    </div>

    <el-dialog
      :title="title"
      :append-to-body="true"
      :visible.sync="dialogView"
      width="50%"
      :before-close="(done) => {closeDialog(false); done()}">
      <el-form :model="rowData" size="small" class="form-container">
        <el-row class="first-row">
          <el-col :span="12">
            <el-form-item label="大洲:" class="postInfo-container-item">
              <span v-if="title === '查看'">{{rowData.continent}}</span>
              <el-input v-else type="text" placeholder="" v-model="rowData.continent">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="国家:" class="postInfo-container-item">
              <span v-if="title === '查看'">{{rowData.country}}</span>
              <el-select v-else style="width: 90%;" v-model="rowData.country" placeholder="" filterable clearable>
                <el-option
                  v-for="item in countryList"
                  :key="item.countryCn"
                  :label="item.countryCn"
                  :value="item.countryCn">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="">
          <el-col :span="12">
            <el-form-item label="事务所名称:" class="postInfo-container-item">
              <el-select
                :disabled="title === '查看'"
                v-model="rowData.custId"
                ref="custSelect"
                filterable
                clearable
                remote
                reserve-keyword
                placeholder="请输入事务所名称"
                @change="() => rowData.name = customerNameIdList.find(item => item.custId === rowData.custId) && customerNameIdList.find(item => item.custId === rowData.custId).fullname"
                :remote-method="(v) => $wUtil.debounce(queryCustomerList(v), 500)">
                <el-option
                  v-for="item in customerNameIdList"
                  :key="item.custId"
                  :label="item.fullname"
                  :value="item.custId"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="事务所类型:" class="postInfo-container-item">
              <span v-if="title === '查看'">{{rowData.type}}</span>
              <el-select v-else default-first-option :clearable='true' placeholder="请选择" v-model="rowData.type"
                         filterable>
                <el-option v-for="item in swsTypeList" :key="item.id" :label="item.typeName"
                           :value="item.typeName">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="">
          <el-col :span="12">
            <el-form-item label="联系方式:" class="postInfo-container-item">
              <span v-if="title === '查看'">{{rowData.tel}}</span>
              <el-input v-else type="textarea" placeholder="" v-model="rowData.tel">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注:" class="postInfo-container-item">
              <span v-if="title === '查看'">{{rowData.memo}}</span>
              <el-input v-else type="textarea" placeholder="" v-model="rowData.memo">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="">
          <el-col :span="12">
            <el-form-item label="合作评价:" class="postInfo-container-item">
              <span v-if="title === '查看'">{{rowData.evaluation}}</span>
              <el-input v-else type="textarea" placeholder="" v-model="rowData.evaluation">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="折扣:" class="postInfo-container-item">
              <span v-if="title === '查看'">{{rowData.discount}}</span>
              <el-input v-else type="number" placeholder="" v-model="rowData.discount">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="fl-ac-jc">
        <el-button size="mini" @click="() => {closeDialog(false)}">取 消</el-button>
        <el-button size="mini" type="primary" @click="submit" v-if="title !== '查看'">确 定</el-button>
      </span>
    </el-dialog>

    <!--  报价列表  -->
    <el-dialog
      title="报价"
      :append-to-body="true"
      :visible.sync="baojiaView"
      width="80%"
      class="abow_dialog"
    >
      <div>
        <el-table
          :data="baojiaList"
          :max-height="clientHeight"
          style="width: 100%">
          <el-table-column
            type="index"
            label="序号"
            width="60">
          </el-table-column>
          <el-table-column
            prop="countryCn"
            label="国家"
          >
          </el-table-column>
          <el-table-column
            prop="custIdStr"
            label="代理所"
          >
          </el-table-column>
          <el-table-column label="境外商标注册费(RMB)">
            <!--      <el-table-column-->
            <!--        prop="name"-->
            <!--        label="姓名"-->
            <!--        width="120">-->
            <!--      </el-table-column>-->
            <!--      <el-table-column label="地址">-->
            <el-table-column
              prop="firstClass"
              label="官费首类"
            >
            </el-table-column>
            <el-table-column
              prop="secondClass"
              label="官费第2类"
            >
            </el-table-column>
            <el-table-column
              prop="thirdClass"
              label="官费3~n类"
            >
            </el-table-column>
            <el-table-column
              prop="additionalClass"
              label="官费附加类"
            >
            </el-table-column>
            <el-table-column
              prop="additionalClassBegin"
              label="附加开始类"
            >
            </el-table-column>
            <el-table-column
              prop="serviceFeeFirstClass"
              label="代理费首类"
            >
            </el-table-column>
            <el-table-column
              prop="serviceFeeSecondClass"
              label="代理费第2类"
            >
            </el-table-column>
            <el-table-column
              prop="serviceFeeThirdClass"
              label="代理费3~n类"
            >
            </el-table-column>
            <el-table-column
              prop="serviceFeeAdditionalClass"
              label="代理费附加类"
            >
            </el-table-column>
            <el-table-column
              prop="otherFeeFirstClass"
              label="杂费首类"
            >
            </el-table-column>
            <el-table-column
              prop="otherFeeAdditionalClass"
              label="杂费附加类"
            >
            </el-table-column>
            <!--      </el-table-column>-->
          </el-table-column>
          <el-table-column
            label="公证认证及翻译费(RMB)"
          >
            <el-table-column
              prop="abroadGzFee"
              label="境外公证及翻译费"
            >
            </el-table-column>
            <el-table-column
              prop="interGzFee"
              label="国内公证认证费"
            >
            </el-table-column>
          </el-table-column>
          <!--      <el-table-column-->
          <!--        prop="premium"-->
          <!--        label="溢价/类"-->
          <!--      >-->
          <!--      </el-table-column>-->
          <el-table-column
            prop="whdServiceFee"
            label="万慧达代理费"
          >
          </el-table-column>
          <el-table-column
            prop="calculationDesc"
            label="事务所及裸价"
          >
            <template slot-scope="scope">
              <span :title="scope.row.calculationDesc">{{scope.row.calculationDesc}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="remarks"
            label="备注"
          >
            <template slot-scope="scope">
              <span :title="scope.row.remarks">{{scope.row.remarks}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="influenceFactor"
            label="影响报价的因素"
          >
            <template slot-scope="scope">
              <span :title="scope.row.influenceFactor">{{scope.row.influenceFactor}}</span>
            </template>
          </el-table-column>
          <!--      <el-table-column-->
          <!--        label="操作"-->
          <!--      >-->
          <!--        <template slot-scope="scope">-->
          <!--          <span style="display:inline-block;cursor: pointer;color: #409eff;margin-right: 10px"-->
          <!--                @click="createAndEdit('edit', scope.$index, scope.row)" v-if="$store.getters.permissions.includes(296)">修改</span>-->
          <!--          <span style="display:inline-block; cursor: pointer;color: #409eff"-->
          <!--                @click="deleteOfferPrice(scope.row, scope.$index)"-->
          <!--                v-if="$store.getters.permissions.includes(296)">删除</span>-->
          <!--        </template>-->
          <!--      </el-table-column>-->
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { queryCaseType } from '@/api/caseList.js'
  import {
    queryOfferPrice
  } from '@/api/billApi'
  import Pagination from '@/components/Pagination'
  import {
    queryColAgencyList,
    queryColAgency,
    queryCountry,
    querycustSelectClass,
    fetchList,
    queryColAgencyInfo,
    updateColAgencyInfo,
    addColAgencyInfo,
    delColAgencyInfo, queryColAgencyItemList, exportColAgencyItemList
  } from '@/api/customerList'

  export default {
    name: 'AbroadAgency',
    components: { Pagination },
    computed: {
      clientHeight() {
        return document.documentElement.clientHeight - (this.isMaterial ? 400 : 200)
      }
    },
    props: ['isMaterial', 'custId'],
    watch: {
      custId: {
        handler(n) {
          this.isMaterial && (this.queryData.custId = n) && this.queryColAgencyList()
        },
        immediate: true
      }
    },
    data() {
      var tableHeader = []
      if (localStorage.getItem('tableHeader') && JSON.parse(localStorage.getItem('tableHeader')).find(item => item.name == this.$options.name)) {
        tableHeader = JSON.parse(localStorage.getItem('tableHeader')).find(item => item.name == this.$options.name).tableHeader
      }
      return {
        brushRightHasFilter: false,
        caseTypeOptions: [],
        baojiaList: [],
        baojiaView: false,
        tableHeader,
        caseTypeProps: { // 級聯菜單默認
          value: 'caseTypeId',
          label: 'caseType',
          children: 'childrens',
          checkStrictly: false
        },
        queryData: {
          country: undefined,
          caseTypeIds: [],
          custIdArray: []
        },
        customerNameIdList: [],
        swsTypeList: [],
        countryList: [],
        rowData: {
          colId: '',
          custId: '',
          continent: '',
          country: '',
          name: '',
          type: '',
          tel: '',
          memo: '',
          evaluation: '',
          discount: ''
        },
        dialogView: false,
        title: '',
        detailCellRendererParams: {
          detailGridOptions: {
            rowSelection: 'multiple',
            columnDefs: [],
            // rowHeight:67,
            defaultColDef: { flex: 1 },
            getContextMenuItems: this.getContextMenuItems1,
            localeText: this.$store.state.caseInformation.localeText
          },
          getDetailRowData: params => {
            params.successCallback(params.data.details)
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
            autoHeight: true,
            suppressMenu: true,
            checkboxSelection: false,
            headerCheckboxSelection: false,
            headerCheckboxSelectionFilteredOnly: true,
            cellRenderer: this.cellRenderer
          }
        ],
        defaultcolumnDefs2: [
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
            cellRenderer: this.cellRenderer2
          }
        ],
        preferenceList: [
          { 'label': ' 国家', prop: 'country', width: 100 },
          { 'label': '事务所名称', prop: 'name', width: 200 },
          { 'label': '来案领域', prop: 'comeDomain', width: 100 },
          { 'label': '来案案件类型', prop: 'comeCaseType', width: 130 },
          { 'label': '来案数量', prop: 'comeCaseNum', width: 100 },
          { 'label': '去案领域', prop: 'goDomain', width: 100 },
          { 'label': '去案案件类型', prop: 'goCaseType', width: 130 },
          { 'label': '去案数量', prop: 'goCaseNum', width: 100 },
          { 'label': '备注', prop: 'memo', width: 200 },
          { 'label': '折扣', prop: 'discount', width: 100 },
          { 'label': '报价', prop: 'price', width: 100 },
          { 'label': '事务所等级', prop: 'priceLevel', width: 120 },
          { 'label': '事务所类型', prop: 'type', width: 120 },
          { 'label': '平均分', prop: 'scoreAvg', width: 100 }
        ],
        preferenceList2: [
          { 'title': '年', 'value': 'year', width: 60 },
          { 'title': '去案数量', 'value': 'goNum', width: 120 },
          { 'title': '来案数量', 'value': 'comNum', width: 120 },
          // { 'title': '案量', 'value': 'num' },
          { 'title': '工作组', 'value': 'work', flex: 1 }

        ],
        autoGroupColumnDef: {
          headerName: '组',
          field: 'group',
          headerCheckboxSelection: true,
          cellRenderer: 'agGroupCellRenderer',
          cellRendererParams: { checkbox: true }
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
        gridApi: {},
        columnDefs: [],
        agencyTable: [],
        listQuery: {
          pageNo: 1,
          pageSize: 10
        },
        total: 0,
        pageSizesList: [10, 50, 100, 200, 300, 400, 500]
      }
    },
    created() {
      let list = []
      if (this.tableHeader && this.tableHeader.length) {
        list = this.tableHeader
      } else {
        list = this.preferenceList
      }
      // this.tableHeader = this.preferenceList.map(item => ({
      //   label: item.label,
      //   prop: item.prop,
      //   width: this.getLoactionWidth(item.label)
      // }))
      this.columnDefs = [...this.defaultcolumnDefs, ...list.map(item => ({
        headerName: item.label,
        field: item.prop,
        resizable: true,
        sortable: true,
        width: this.getLoactionWidth(item.label) == 'auto' ? 200 : this.getLoactionWidth(item.label),
        autoHeight: true,
        filter: 'agSetColumnFilter',
        cellRenderer: this.cellRenderer,
        menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
        enableRowGroup: true,
        filterParams: {
          defaultToNothingSelected: true,
          newRowsAction: 'keep',
          comparator: (a, b) => {
            return this.$commonUtils.sort(a, b, item.value)
          }
        }
      }))]
      this.saveLocation()

      this.detailCellRendererParams.detailGridOptions.columnDefs = [...this.defaultcolumnDefs2, ...this.preferenceList2.map(item => ({
        headerName: item.title,
        field: item.value,
        width: item.width,
        flex: item.flex,
        resizable: true,
        sortable: true,
        filter: 'agSetColumnFilter',
        cellRenderer: this.cellRenderer2,
        menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
        enableRowGroup: true,
        filterParams: {
          newRowsAction: 'keep',
          comparator: (a, b) => {
            return this.$commonUtils.sort(a, b, item.value)
          }
        }
      }))]
      // !this.isMaterial && this.queryColAgencyList()
      this.queryCountries()
      this.querycustSelectClass()
      this.queryCaseType()
    },
    methods: {
      getSelectedRows() {
        if(this.gridApi){
          const selectedNodes = this.gridApi.getSelectedNodes();
          const selectedData = selectedNodes.map(node => node.data);
          return selectedData
        } else {
          return []
        }
      },
      exportList() {
        // if (!this.queryData.custIdArray.length) {
        //   this.$message.warning('请选择需要导出数据的代理所！')
        //   return
        // }
        // if (this.queryData.custIdArray.length > 1) {
        //   this.$message.warning('只能导出一个代理所的数据！')
        //   return
        // }
        if (!this.getSelectedRows().length) {
          this.$message.error('请选择要导出的代理所！')
          return
        }
        exportColAgencyItemList({
          colIdArray: this.getSelectedRows().map(item => item.colId),
          ...this.queryData
        }).then(res => {
          const downData = {
            url: `/ipdoc${res.data}`,
            success() {
            }
          }
          this.$message.success('导出成功')
          this.$commonUtils.downLoadAll(downData)
        })

      },
      brushRight() {
        let arr = this.columnDefs.map(item => item.field)// Object.keys(data)
        arr.forEach(item => {
          this.gridApi.destroyFilter(item)
        })
        this.brushRightHasFilter = false
      },
      queryCaseType() {
        queryCaseType().then(res => {
          this.caseTypeOptions = res.data
        })
      },
      getLoactionWidth(label) {
        if (!localStorage.getItem('tableHeader')) {
          return 120
        } else {
          var arr = JSON.parse(localStorage.getItem('tableHeader'))
          if (arr.find(item => item.name == this.$options.name)) {
            var header = arr.find(item => item.name == this.$options.name).tableHeader
            if (header.find(item => item.label == label)) {
              return header.find(item => item.label == label).width
            } else {
              return 120
            }
          } else {
            return 120
          }
        }
      },
      dragStopped(params) {
        let tableHeader = params.columnApi.columnController.gridColumns.map(item => ({
          label: item.colDef.headerName,
          width: item.actualWidth,
          prop: item.colDef.field
        })).filter(item => item.prop != 'sid' && item.prop != 'group')
        this.tableHeader = tableHeader
        this.saveLocation()
      },
      saveLocation() {
        if (!localStorage.getItem('tableHeader')) {
          let arr = []
          arr.push({ name: this.$options.name, tableHeader: this.tableHeader })
          localStorage.setItem('tableHeader', JSON.stringify(arr))
        } else {
          let arr = JSON.parse(localStorage.getItem('tableHeader'))
          if (arr.find(item => item.name == this.$options.name)) {
            arr.find(item => item.name == this.$options.name).tableHeader = this.tableHeader
            localStorage.setItem('tableHeader', JSON.stringify(arr))
          } else {
            arr.push({ name: this.$options.name, tableHeader: this.tableHeader })
            localStorage.setItem('tableHeader', JSON.stringify(arr))
          }
        }
      },
      closeDialog(search) {
        search && this.queryColAgencyList()
        this.title = ''
        this.dialogView = false
        this.customerNameIdList = []
        this.rowData = {
          colId: '',
          custId: '',
          continent: '',
          country: '',
          name: '',
          type: '',
          tel: '',
          memo: '',
          evaluation: '',
          discount: ''
        }
      },
      submit() {
        if (this.title === '新建') {
          delete this.rowData['colId']
          addColAgencyInfo(this.rowData).then(res => {
            this.$message.success('新建成功！')
            this.closeDialog(true)
          })
        } else if (this.title === '修改') {
          updateColAgencyInfo(this.rowData).then(res => {
            this.$message.success('修改成功！')
            this.closeDialog(true)
          })
        }
      },
      queryCustomerList(query) {
        if (query !== '') {
          fetchList({ pageNo: 1, pageSize: 100, isAgentOrCollaboration: 1, isAll: 1, keyword: query, companyType: '外代所' }).then(res => {
            this.customerNameIdList = res.data
          })
        }
      },
      querycustSelectClass() {
        querycustSelectClass({ classId: '1166' }).then(res => {
          this.swsTypeList = res.data['1166']
        })
      },
      queryCountries() {
        queryCountry().then(res => {
          this.countryList = res.data
        })
      },
      openDialog(flag) {
        if (flag === '新建') {
          this.title = '新建'
          this.dialogView = true
        }
      },
      queryColAgencyList() {
        queryColAgencyList({ ...this.listQuery, ...this.queryData }).then(res => {
          this.agencyTable = res.data
          this.total = res.total
        })
      },
      rowDoubleClicked(params) {
        this.title = '查看'
        this.rowData.colId = params.data.colId
        queryColAgencyInfo({ colId: this.rowData.colId }).then(res => {
          this.rowData = res.data
          this.rowData.name && this.queryCustomerList(this.rowData.name)
          this.dialogView = true
        })
        // this.threeLevelData = JSON.parse(JSON.stringify(params.data))
        // // if (this.threeLevelData && this.threeLevelData.caseTypeIds) {
        // //   this.threeLevelData.caseTypeIds = this.threeLevelData.caseTypeIds.split(',').map(Number)
        // // }
        // this.title = '查看报价'
        // this.editType = 'view'
        // this.bjView = true
        // this.drawerView = true
      },
      copy(row, value) {
        if (value) {
          this.$copyText(value).then(
            res => {
            })
        }
      },
      rowClicked(params) {
        this.gridApi.forEachNode(rowNode => {
          if (rowNode.data.colId != params.data.colId) {
            rowNode.setExpanded(false)
          }
        })
        if (params.node.expanded) {
          params.node.setExpanded(false)
        } else {
          if (params.data.details) {
            params.node.setExpanded(true)
          } else {
            queryColAgency({ colId: params.data.colId }).then(res => {
              params.data.details = res.data
              this.gridApi.refreshCells()
              params.node.setExpanded(true)
            })
          }

        }
        this.columnDefs.push({})
        this.columnDefs.pop()
      },
      getSidDiv(params) {
        let expandIndex = 10000
        if (params.colDef.field === 'sid') {
          this.gridApi.forEachNode(rowNode => {
            if (rowNode.expanded) {
              expandIndex = rowNode.rowIndex
            }
          })
        }
        const h = this.$createElement
        let vnode = h('div', {
            on: {
              click: () => this.rowClicked(params)
            }
          }, [

            h('i', {
              'class': {
                'el-icon-caret-right': true,
                'rotateClass': params.node.expanded
              }

            }),
            h('span', {
              attrs: {
                title: `${params.rowIndex <= expandIndex ? (params.rowIndex + 1) : params.rowIndex}`
              }
            }, [`${params.rowIndex <= expandIndex ? (params.rowIndex + 1) : params.rowIndex}`])
          ]
        )
        const div = document.createElement('div')
        this.__patch__(div, vnode, true, false)
        return div
      },
      baojiaClick(row) {
        queryOfferPrice({ custId: row.custId }).then(res => {
          this.baojiaView = true
          this.baojiaList = res.data
        })
      },
      cellRenderer(params) {
        if (params.colDef.field === 'sid' && params.value !== '') {
          return this.getSidDiv(params)
        }
        if (params.colDef.field === 'price') {
          const h = this.$createElement
          const vnode = h('div', {
            'class': {
              'baoJia': true
            },
            attrs: {
              title: '报价链接'
            },
            on: {
              click: () => this.baojiaClick(params.data)
            }
          }, '报价链接')
          const div = document.createElement('div')
          this.__patch__(div, vnode, true, false)
          return div
        }
        return `<span title="${params.value}">${params.value ? params.value : ''}</span>`
      },
      cellRenderer2(params) {
        return this.getDiv(params)
      },
      getDiv(params) {
        const value = params.value
        if (params.colDef.field === 'sid' && value !== '') {
          params.value = params.rowIndex + 1
        }
        return `<span style="text-align: left;width: 100%;display: inline-block;" title="${params.value}">${params.value ? params.value : ''}</span>`
      },
      refreshEvenRowsCurrencyData(params) {
        // this.currentPageSize = params.api.rowModel.rootNode.allChildrenCount
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
      editFun(row) {
        this.title = '修改'
        this.rowData.colId = row.colId
        queryColAgencyInfo({ colId: this.rowData.colId }).then(res => {
          this.rowData = res.data
          this.rowData.name && this.queryCustomerList(this.rowData.name)
          this.dialogView = true
        })
      },
      handledeleElement(row) {
        // delColAgencyInfo
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delColAgencyInfo({ colId: row.colId }).then(res => {
            this.$message.success('删除成功！')
            this.total = this.total - 1
            this.agencyTable.splice(this.agencyTable.indexOf(row), 1)
          })
        })
      },
      getRowContextmenuList(row) {
        return [
          { name: '复制', action: 'copy' },
          // { name: '商标导入', action: 'installtmmessage', permissions: 185 },
          { name: '修改', action: 'editFun', permissions: 58 },
          { name: '删除', action: 'handledeleElement', permissions: 58 }
        ].filter(item => {
          if (item.permissions) {
            return this.$store.getters.permissions.includes(item.permissions)
          } else {
            return true
          }
        })
      },
      getRowContextmenuList1(row) {
        return [
          { name: '复制', action: 'copy' }
          // { name: '商标导入', action: 'installtmmessage', permissions: 185 },
          // { name: '修改', action: 'editFun' }
          // {name: '删除', action: 'handledeleElement', permissions: 74}
        ]
      },
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
      getContextMenuItems1(params) {
        if (!params.node || !params.node.data) {
          return []
        }
        return this.getRowContextmenuList1(params.node.data).map(item => ({
          name: item.name,
          action: () => {
            this[item.action](params.node.data, params.value, params.node)
          }
        }))
      },
      onGridReady(params) {
        this.gridparams = params
        this.gridApi = params.api
        this.columnApi = params.columnApi
        // params.api.sizeColumnsToFit()
      }
    }
  }
</script>

<style lang="scss" scoped>
  > > > .baoJia {
    cursor: pointer;
    color: #409eff;
  }

  > > > .ag-row-selected {
    .baoJia {
      cursor: pointer;
      color: #fff;
    }
  }

  /deep/ .rotateClass {
    transform: rotate(90deg);
    transition: transform 5s ease-in-out
  }

  .form-container {
    .el-form-item__error {
      position: relative !important;
      top: 0;
    }

    /deep/ .el-row {
      margin: 0px;
      display: flex; /*解决账单查看表单样式被撑开*/
    }

    /deep/ .postInfo-container-item {
      height: 100%;
      width: 100%;
    }

    /deep/ .el-form-item__label {
      background-color: #f9f9f9;
      /*width: 36.7%;*/
      width: 120px;
      text-align: right;
      flex-shrink: 0;
    }

    /deep/ .el-form-item {
      border-right: 1px solid #d7d7d7;
      margin: 0px !important;
    }

    .first-row {
      /*>>>.el-row {*/
      border-top: 1px solid #d7d7d7;
      /*}*/
    }

    /deep/ .el-row {
      border-bottom: 1px solid #d7d7d7;
      border-left: 1px solid #d7d7d7;
    }

    /deep/ .el-input,
    /deep/ .el-select {
      /*width: 77%;*/
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

    .fullRow {
      /deep/ .el-form-item__label {
        /*width: 15%;*/
        width: 120px;
        flex-shrink: 0;
      }

      /deep/ .el-input,
      /deep/ .el-select {
        /*width: 30%;*/
      }
    }

    /deep/ .el-input__inner {
      // border: none;
    }

    /deep/ .el-select .el-input {
      width: 100%;
    }

    /deep/ td .el-select,
    /deep/ td .el-input,
    /deep/ td .el-input__inner {
      // border: 0px !important;
    }

    .postInfo-container-item {
      display: flex;
      width: 100%;

      /deep/ .el-form-item__content {
        text-align: left;
        display: inline-table;
        width: 85%;
        padding: 0px 15px;
      }

      /deep/ .el-form-item__label {
        line-height: 28px;
      }
    }
  }

  > > > .el-table {
    height: auto;

    .cell {
      max-height: 70px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      overflow: hidden;
    }
  }

  .abow_dialog {
    > > > .el-dialog {
      position: absolute;
      top: 50%;
      left: 50%;
      margin: 0 !important;
      transform: translate(-50%, -50%);
      max-height: calc(100% - 30px);
      max-width: calc(100% - 30px);
      display: flex;
      flex-direction: column;
    }

    > > > .el-dialog__body {
      overflow: auto;
    }
  }

  .brush_right {
    position: absolute;
    right: 40px;
    z-index: 1;
    top: 105px;
  }
  .DataPicker /deep/ {
    .datePickerWrap {
      line-height: 30px;
    }
    line-height: 30px;
    height: 30px;
    .el-input__prefix{
      display: none;
    }
    .el-input{

      width: 100%;
    }
    .el-input__inner{

      text-align: center;

      padding: 0;
      padding-right: 18px;
      // padding-left: 10px;
    }
  }
</style>
