<template>
  <div>
    <div v-if="!isFinance" class="search">
      <el-row>
        <el-col :span="24" style="text-align:center">
          <el-button-group class="button-group-search">
            <el-button type="primary" size="small" @click="handleSearch(0, false)">搜索</el-button>
            <el-popover
              placement="bottom"
              width="550"
              trigger="click"
              v-model="drawerState"
            >
              <template>
                <el-form label-width="120px" :model="queryModuleData" size="mini" class="form-container">

                  <el-form-item label="收款种类:" class="content-center">
                    <el-select default-first-option :clearable='true' placeholder="请选择收款种类"
                               v-model="queryModuleData.recvKind" filterable>
                      <el-option :label="item.typeName" :value="item.id" v-for="item in recvKindList"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="收款类型:" class="content-center">
                    <el-select default-first-option :clearable='true' placeholder="请选择收款类型"
                               v-model="queryModuleData.recvType" filterable>
                      <el-option :label="item.typeName" :value="item.typeName" v-for="item in recvTypeList"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="收款日期:" class="content-center">
                    <DataPicker class="DataPicker" v-model="queryModuleData.recvDateArray"></DataPicker>
                  </el-form-item>
                  <el-form-item label="收款账户:" class="content-center">
                    <el-select filterable clearable default-first-option v-model="queryModuleData.payAccountId"
                               placeholder>
                      <el-option v-for="(item,key) in accountList" :key="key" :label="item.payAccountName"
                                 :value="item.payAccountId"></el-option>
                    </el-select>

                  </el-form-item>
                  <el-form-item label="收到币种:" class="content-center">
                    <el-select default-first-option
                               v-model="queryModuleData.recvCurId" placeholder>
                      <el-option v-for="(item,key) in bzList" :key="key" :label="item.curName"
                                 :value="item.curId"></el-option>
                    </el-select>

                  </el-form-item>
                  <el-form-item label="客户:" class="content-center">
                    <el-select
                      v-model="queryModuleData.custIds"
                      ref="custSelect"
                      filterable
                      clearable
                      multiple
                      remote
                      reserve-keyword
                      placeholder="请输入客户姓名"
                      :remote-method="queryCustomerList">
                      <el-option
                        v-for="item in customerNameIdList"
                        :key="item.custId"
                        :label="item.fullname"
                        :value="item.custId"
                      >
                      </el-option>
                    </el-select>

                  </el-form-item>
                  <el-form-item label="付款对方:" class="content-center">
                    <el-input v-model="queryModuleData.payCust" placeholder="请输入付款对方"></el-input>

                  </el-form-item>
                  <el-form-item label="付款日期:" class="content-center">
                    <DataPicker class="DataPicker" v-model="queryModuleData.payDateArray"></DataPicker>
                  </el-form-item>
                  <el-form-item label="账单号:" class="content-center">
                    <el-input v-model="queryModuleData.billNo" placeholder="请输入账单号"></el-input>

                  </el-form-item>
                  <el-form-item label="实收本币金额:" class="content-center">
                    <el-input v-model="queryModuleData.paidLocalStart" placeholder="请输入实收本币金额"></el-input>
                    至
                    <el-input v-model="queryModuleData.paidLocalEnd" placeholder="请输入实收本币金额"></el-input>

                  </el-form-item>
                  <el-form-item label="汇兑损益:" class="content-center">
                    <el-input v-model="queryModuleData.gainsLossesStart" placeholder="请输入汇兑损益"></el-input>
                    至
                    <el-input v-model="queryModuleData.gainsLossesEnd" placeholder="请输入汇兑损益"></el-input>

                  </el-form-item>
                  <el-form-item label="手续费:" class="content-center">
                    <el-input v-model="queryModuleData.chargeLocalStart" placeholder="请输入手续费"></el-input>
                    至
                    <el-input v-model="queryModuleData.chargeLocalEnd" placeholder="请输入手续费"></el-input>

                  </el-form-item>
                  <el-form-item label="同批收款额:" class="content-center">
                    <el-input v-model="queryModuleData.sameRecvAmountStart" placeholder="请输入同批收款额"></el-input>
                    至
                    <el-input v-model="queryModuleData.sameRecvAmountEnd" placeholder="请输入同批收款额"></el-input>

                  </el-form-item>
                  <el-form-item label="备注:" class="content-center">
                    <el-input clearable v-model="queryModuleData.remarks" placeholder="请输入备注"
                              type="textarea"></el-input>

                  </el-form-item>
                  <el-form-item label="录入人:" class="content-center">
                    <VirtualSelect filterable clearable :data="$store.getters.allUserList"
                                   v-model="queryModuleData.fillinUserId" placeholder="请选择录入人"></VirtualSelect>

                  </el-form-item>
                  <el-form-item label="录入日期:" class="content-center">
                    <DataPicker class="DataPicker" v-model="queryModuleData.fillinDateArray"></DataPicker>
                  </el-form-item>
                </el-form>
                <div style="text-align:right">
                  <el-button size="mini" @click="()=>{clearSeach(this)}"><span>重置</span></el-button>
                  <el-button type="primary" size="mini" @click="handleSearch(0, false)">搜索</el-button>
                </div>
              </template>
              <el-button slot="reference" style="padding: 8.5px 5px;" type="primary" size="small"
                         icon="el-icon-arrow-down"></el-button>
            </el-popover>

          </el-button-group>
          <el-button type="primary" size="small" @click="doPaymentTask('提交')" style="margin-left: 10px">提交</el-button>
          <el-button type="primary" size="small" @click="doPaymentTask('结账')">结账</el-button>
          <el-button type="primary" size="small" @click="changeEndorse">改签</el-button>
          <el-button type="primary" size="small" @click="createCollect" v-allow="303">新建</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form>
            <el-form-item label="状态:" class="noMargin" label-width="100px">
              <el-radio-group v-model="queryModuleData.wfStatusOut" @change="changeWfStatus">
                <el-radio label="待提交">待提交</el-radio>
                <el-radio label="待结账">待结账</el-radio>
                <!--                <el-radio label="本月收款">本月收款</el-radio>-->
              </el-radio-group>
            </el-form-item>
          </el-form>
          <el-form class="noBottomMargin">
            <el-form-item label="账户:" class="noMargin" label-width="100px">
              <el-tag @click="changeCompany(item)"
                      :class="{isActive: item.payAccountId == queryModuleData.payAccountIdOut}"
                      v-for="(item,index) in payCompanyList" :key="item.payAccountId">
                {{item.payAccountName}}
              </el-tag>
            </el-form-item>
          </el-form>
          <el-form class="noBottomMargin" v-if="queryModuleData.payAccountIdOut">
            <el-form-item label-width="100px" label="年份:">
              <el-tag @click="changeYear(item)" :class="{isActive: item == currentYear}"
                      v-for="(item,index) in [$wUtil.getDate('', 'year'), +$wUtil.getDate('', 'year')-1, +$wUtil.getDate('', 'year')-2, +$wUtil.getDate('', 'year')-3]"
                      :key="index">{{item}}
              </el-tag>
            </el-form-item>
          </el-form>
          <el-form class="noBottomMargin" v-if="queryModuleData.payAccountIdOut">
            <el-form-item label-width="100px" label="所属月:">
              <el-tag @click="changeMonth(item)" :class="{isActive: item == currentMonth}"
                      v-for="item in belongMonthList">{{item}}
              </el-tag>
            </el-form-item>
          </el-form>

        </el-col>
      </el-row>
    </div>
    <div class="grid-table">
      <TitleTotal :total="total" :currentPageSize="currentPageSize"/>
      <div
        style="cursor:pointer;position: absolute;display:flex;align-items:center;right: 0;top: 0;font-size: 14px;padding-right: 6px">
          <el-button type="text" @click="exportList(2)" >导出</el-button>
          <span style="color: #52A2F4;margin: 0 5px"> / </span>
          <el-button type="text" @click="exportList(1)">全局导出</el-button>
<!--        <el-button type="text" @click="exportList(1)"><i class="el-icon-download">导出</i></el-button>-->
<!--        <img @click="exportList(2)" src="@/assets/moon.png" style="width: 16px;height: 16px" width="16" alt="">-->
      </div>
      <el-button class="brush_right" :class="brushRightHasFilter?'red':''" @click="brushRight" type="text"
                 icon="el-icon-brush"></el-button>
      <div class="dots" @click="handleCheckboxState" v-if="$options.name === 'collect_detail'">
        <span class="dot">.</span>
        <span class="dot">.</span>
        <span class="dot">.</span>
      </div>
      <AgGridVue :style="{width:'100%',height: clientHeight+'px'}"
                 class="ag-theme-balham"
                 :columnDefs="columnDefs"
                 :rowData="collectList"
                 rowSelection="multiple"
                 @grid-ready="onGridReady"
                 @dragStopped="dragStopped"
                 :gridOptions="gridOptions"
                 :getContextMenuItems="getContextMenuItems"
                 suppressAutoSize
                 animateRows
                 @rowDoubleClicked="rowDoubleClicked"
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
                 :detailCellRendererParams="detailCellRendererParams"
                 keepDetailRows
                 :rowHeight="isFinance ? $commonUtils.getRowHeight() : 28"
                 :pinnedBottomRowData="pinnedBottomRowData"
      >
      </AgGridVue>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.pageNo"
        :limit.sync="listQuery.pageSize"
        @pagination="queryPaymentList"
        :pageSizes="pageSizesList"
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

    <el-dialog
      v-if="endorseTaskerView"
      title="选择改签人"
      :visible.sync="endorseTaskerView"
      width="30%"
    >
      <el-select v-model="endorseTasker" placeholder="请选择" filterable default-first-option clearable>
        <el-option
          v-for="item in $store.getters.userList"
          :key="item.userId"
          :label="item.fullname"
          :value="item.userId">
        </el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
      <el-button @click="endorseTaskerView = false">取 消</el-button>
      <el-button type="primary" @click="endorseCollect">确 定</el-button>
    </span>
    </el-dialog>
    <el-dialog
      v-if="collectDialogVisible"
      :title="title"
      :close-on-click-modal="false"
      :visible.sync="collectDialogVisible"
      width="80%"
      height="80%"
      class="abow_dialog"
      :before-close="() => {closeDialog(false)}"
    >
      <collection-detail v-if="collectDialogVisible" :pay-id="payId" :type="type" :isAudit="isAudit" @closeDialog="closeDialog"/>
    </el-dialog>

    <!--    导出-->
    <SelectOption
      :buss-id="$options.name == 'collect_list' ? 47 : 46"
      v-if="selectionOptionState"
      :dialog-visible="selectionOptionState"
      @cancel="closeSelect"
      :idArray="getCurrentRowsData($options.name == 'collect_list' ? 'payId' : 'payDetailId')"
      :defaultMultipleSelect="preferenceList.map(i=>i.title)"
      :exportType="exportType"
      :exportQueryModel="exportQueryModel"></SelectOption>
  </div>
</template>

<script>
  import {formatAmount, fomatFloat} from '@/utils/filters'
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
  import Pagination from '@/components/Pagination'
  // import { queryCustomerNameId } from '@/api/caseList.js'
  import {
    queryPaymentList,
    queryPaymentDetailList,
    queryPayAcountUrl,
    queryCurrencyUrl,
    deletePayment,
    doPaymentTask,
    pay,
    checkTasker,
    endorse,
    queryPayAccountByPermission
  } from '@/api/billApi'
  import {querycustSelectClass} from '@/api/customerList.js'
  import CollectionDetail from "./components/CollectionDetail";
  import SelectOption from "../../case/components/SelectOption";

  export default {
    name: 'collect_list',
    components: {
      SelectOption,
      CollectionDetail,
      Pagination
    },
    props: {
      isFinance: {
        type: Boolean,
        default: false
      }
    },
    data() {
      // var tableHeader = []
      // if (localStorage.getItem('tableHeader') && JSON.parse(localStorage.getItem('tableHeader')).find(item => item.name == this.$options.name + this.$route.name)) {
      //   tableHeader = JSON.parse(localStorage.getItem('tableHeader')).find(item => item.name == this.$options.name + this.$route.name).tableHeader
      // }
      return {
        gridApi: {},
        exportType: '',
        exportQueryModel: '',
        selectionOptionState: false,
        type: '',
        payId: '',
        title: '',
        isAudit: false,
        collectDialogVisible: false,
        firstQuery: true,
        currentMonth: '',
        currentYear: '',
        payCompanyList: [],
        endorseTasker: '',
        endorseTaskerView: false,
        preferenceList: [],
        filterText: '',
        selectColumnList: [],
        checkCaseList: [],
        checkboxState: false,
        tableHeader: [],
        recvKindList: [],
        recvTypeList: [],
        bzList: [],
        accountList: [],
        brushRightHasFilter: false,
        currentPageSize: 0,
        total: 0,
        pageSizesList: [10, 50, 200, 500, 1000, 5000, 10000],
        drawerState: false,
        listQuery: {
          pageNo: 1,
          pageSize: JSON.parse(localStorage.getItem('pageSize')) ? JSON.parse(localStorage.getItem('pageSize')).find(item => item.name == this.$route.name) ? JSON.parse(localStorage.getItem('pageSize')).find(item => item.name == this.$route.name).pageSize : 10 : 10
        },
        searchType: 0,
        customerNameIdList: [],
        queryModuleData: {
          createDateArray: []
        },
        tableTitleList: [
          {'label': '客户', 'prop': 'custIdStr'},
          {'label': '收款日期', 'prop': 'recvDate'},
          {'label': '收款账户', 'prop': 'payAccountIdStr'},
          {'label': '收款种类', 'prop': 'recvKindStr'},
          {'label': '收款类型', 'prop': 'recvType'},
          {'label': '收款账户所属公司', 'prop': 'payAccountIdStr'},
          {'label': '收到币种', 'prop': 'recvCurIdStr'},
          {'label': '现在汇率', 'prop': 'currExchangeRate'},
          {'label': '实收总本币金额', 'prop': 'paidLocalTotal'},
          {'label': '实收总外币金额', 'prop': 'paidForeignTotal'},
          {'label': '同批收款额', 'prop': 'sameRecvAmount'},
          {'label': '支付对方', 'prop': 'payCust'},
          {'label': '付款日期', 'prop': 'payDate'},
          {'label': '录入人', 'prop': 'fillinUserIdStr'},
          {'label': '录入日期', 'prop': 'fillinDate'},
          {'label': '备注', 'prop': 'remarks'},
          {'label': '流程状态', 'prop': 'wfStatus'},
          {'label': '任务人', 'prop': 'tasker'},
          // { 'label': '创建人', 'prop': 'createUserId' },
          {'label': '创建日期', 'prop': 'createDate'}
        ],
        tableTitleList2: [
          {'label': '文号', 'prop': 'showRefno', 'width': 200},
          {'label': '账单号', 'prop': 'billNo', 'width': 200},
          {'label': '账单收款状态', 'prop': 'paymentStatusStr', 'width': 200},
          {'label': '账单总金额', 'prop': 'billSum', 'width': 200},
          {'label': '账单服务费', 'prop': 'serviceCost', 'width': 200},
          {'label': '账单官费', 'prop': 'officialCost', 'width': 200},
          {'label': '账单杂费', 'prop': 'otherCost', 'width': 200},
          {'label': '账单折扣', 'prop': 'discount', 'width': 200},
          {'label': '账单服务费折扣后', 'prop': 'serviceCostDiscount', 'width': 200},
          {'label': '账单外币总金额', 'prop': 'foreignSum', 'width': 200},
          {'label': '账单币种', 'prop': 'curIdStr', 'width': 200},
          {'label': '账单所属月', 'prop': 'belongToDate', 'width': 200},
          {'label': '账单财务审核', 'prop': 'auditStatus', 'width': 200},
          {'label': '应收本币金额', 'prop': 'duetoLocal', 'width': 200},
          {'label': '应收外币金额', 'prop': 'duetoForeign', 'width': 200},
          {'label': '实收本币金额', 'prop': 'paidLocal', 'width': 200},
          {'label': '实收外币金额', 'prop': 'paidForeign', 'width': 200},
          {'label': '当时汇率', 'prop': 'oriExchangeRate', 'width': 200},
          {'label': '汇兑损益', 'prop': 'gainsLosses', 'width': 200},
          {'label': '手续费本币', 'prop': 'chargeLocal', 'width': 200},
          {'label': '手续费外币', 'prop': 'chargeForeign', 'width': 200},
          {'label': '部分收款', 'prop': 'payPartStr', 'width': 200},
          {'label': '收款汇率', 'prop': 'currExchangeRate', 'width': 200},
          {'label': '账单所属工作组', 'prop': 'billGroupName', 'width': 200}
        ],
        gridOptions: {
          ...this.$store.state.caseInformation.gridOptions, ...{
            statusBar: {
              statusPanels: [
                // { statusPanel: 'agTotalAndFilteredRowCountComponent', align: 'left' },
                // { statusPanel: 'agSelectedRowCountComponent', align: 'left' }
              ]
            }
            //floatingFilter: true,
          }
        },
        detailCellRendererParams: {
          detailGridOptions: {
            rowSelection: 'multiple',
            columnDefs: [],
            // rowHeight:67,
            // defaultColDef: { flex: 1 },
            getContextMenuItems: this.getContextMenuItemsChild,
            localeText: this.$store.state.caseInformation.localeText
          },
          getDetailRowData: params => {
            params.successCallback(params.data.payDetails)
          }

        },
        // frameworkComponents: {
        //   CountStatusBarComponent: Summary
        // },
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
        columnDefs: [],
        collectList: [],
        // gridOptions: '',
        autoGroupColumnDef: {
          headerName: '组',
          field: 'group',
          headerCheckboxSelection: true,
          cellRenderer: 'agGroupCellRenderer',
          cellRendererParams: {checkbox: true}
        }
        // frameworkComponents: '',
        // detailCellRendererParams: ''

      }
    },
    computed: {
      clientHeight() {
        let height = 0;
        if (this.$store.state.settings.toolPosTop == 'top') {
          height = 260
        } else if (this.$store.state.settings.toolPosTop == 'right') {
          height = 200
        }
        return (document.documentElement.clientHeight - (this.isFinance ? height : 200))
      },
      belongMonthList() {
        let year = +this.$wUtil.getDate('', 'year')
        let month = +this.$wUtil.getDate('', 'month').slice(5)
        const list = []
        if (year != this.currentYear) {
          month = 12
        }
        while (month > 0) {
          list.push(month)
          month--
        }
        return list
      },
      pinnedBottomRowData() {
        if (this.isFinance && this.gridApi.rowModel) {
          // 实收总本币金额、实收总外币金额、同批收款额、账单总金额、账单服务费、账单官费、账单杂费、账单服务费折扣后、账单外币总金额、应收本币金额、应收外币金额、实收本币金额、实收外币金额、汇兑损益、手续费
          const columnDisplay = ['paidLocalTotal', 'paidForeignTotal', 'sameRecvAmount', 'billSum', 'serviceCost', 'officialCost', 'otherCost', 'serviceCostDiscount', 'foreignSum', 'duetoLocal', 'duetoForeign', 'paidLocal', 'paidForeign', 'gainsLosses', 'chargeLocal']
          return this.$commonUtils.pinnedBottomRowData(this.gridApi.rowModel.rootNode.childrenAfterFilter.map(item=>item.data), this.columnDefs, columnDisplay)
        }
        return ''
      },
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
      this.init()
    },
    methods: {
      getCurrentRowsData(key){
        if (this.gridApi && this.gridApi.rowModel) {
          return this.gridApi.rowModel.rootNode.childrenAfterSort.map(item => item.data).map(item => item[key])
        }
        return []
      },
      exportList(flag) {
        this.exportType = flag
        this.selectionOptionState = true
      },
      closeSelect() {
        this.selectionOptionState = false
      },
      closeDialog(search) {
        this.title = ''
        this.collectDialogVisible = false
        this.payId = ''
        this.type = ''
        this.isAudit = false
        if(search){
          if(search === true){
            this.handleSearch(this.searchType, true)
          }else if(typeof search == 'object'){
            this.queryPartData(search)
          }
        }
      },
      changeWfStatusDetail(){
        this.queryModuleData.createDateArray = []
        this.$set(this.queryModuleData, 'wfStatusOut', null)
        this.$set(this.queryModuleData, 'payAccountIdOut', '')
        this.$set(this.queryModuleData, 'belongtoDateBeginOut', '')
        this.currentYear = ''
        this.currentMonth = ''
        this.handleSearch(1, false)
      },
      changeCreateDate() {
        this.$set(this.queryModuleData, 'wfStatusDetail', null)
        this.$set(this.queryModuleData, 'wfStatusOut', null)
        this.$set(this.queryModuleData, 'payAccountIdOut', '')
        this.$set(this.queryModuleData, 'belongtoDateBeginOut', '')
        this.currentYear = ''
        this.currentMonth = ''
        this.handleSearch(1, false)
      },
      changeWfStatus(v) {
        this.queryModuleData.wfStatusDetail = ''
        this.queryModuleData.payAccountIdOut = ''
        this.queryModuleData.createDateArray = []
        this.queryModuleData.belongtoDateBeginOut = ''
        // this.queryModuleData.wfStatusOut = ''
        this.currentYear = ''
        this.currentMonth = ''
        this.handleSearch(1, false)
      },
      changeBelongDate({payAccountId}) {
        this.$set(this.queryModuleData, 'wfStatusDetail', null)
        this.$set(this.queryModuleData, 'wfStatusOut', null)
        this.$set(this.queryModuleData, 'createDateArray', [])
        this.$set(this.queryModuleData, 'payAccountIdOut', payAccountId)
        this.$set(this.queryModuleData, 'belongtoDateBeginOut', this.currentYear + '-' + this.currentMonth)
        this.handleSearch(1, false)
      },
      changeYear(year) {
        if (this.currentYear == year) return
        this.currentYear = year
        this.$set(this.queryModuleData, 'belongtoDateBeginOut', this.currentYear + '-' + this.currentMonth)
        this.handleSearch(1, false)
      },
      changeMonth(month) {
        if (this.currentMonth == month) return
        this.currentMonth = month
        this.$set(this.queryModuleData, 'belongtoDateBeginOut', this.currentYear + '-' + this.currentMonth)
        this.handleSearch(1, false)
      },
      changeCompany({payAccountId, payAccountName}) {
        if (this.queryModuleData.payAccountIdOut == payAccountId) return
        this.currentMonth = this.$wUtil.getDate('', 'month').slice(5)
        this.currentYear = this.$wUtil.getDate('', 'year')
        this.$set(this.queryModuleData, 'wfStatusDetail', null)
        this.$set(this.queryModuleData, 'wfStatusOut', null)
        this.$set(this.queryModuleData, 'createDateArray', [])
        this.$set(this.queryModuleData, 'payAccountIdOut', payAccountId)
        this.$set(this.queryModuleData, 'belongtoDateBeginOut', this.currentYear + '-' + this.currentMonth)
        this.handleSearch(1, false)

      },
      endorseCollect() {
        endorse({
          auditUserIds: [this.endorseTasker],
          taskIdList: this.getSelectedRows().map(item => item.taskId)
        }).then(res => {
          this.$message.success('改签成功！')
          this.endorseTaskerView = false
        })
      },
      changeEndorse() {
        if (!this.getSelectedRows().length) {
          this.$message.error('请选择收款！')
          return
        }
        // return
        checkTasker({taskIdList: this.getSelectedRows().map(item => item.taskId)}).then(res => {
          // queryEndorseTasker().then(res=>{
          //   this.endorseTaskerList=res.data
          this.endorseTaskerView = true
          // })
        })
      },
      // payCollects() {
      //   if (!this.getSelectedRows().length) {
      //     this.$message.error('请选择收款！')
      //     return
      //   }
      //   return
      //   pay({ idList: this.getSelectedRows().map(item => item.payId) }).then(res => {
      //     this.$message.success('结账成功！')
      //     this.handleSearch(this.searchType)
      //   }).catch(err => {
      //     this.$message.error('结账失败！')
      //   })
      // },
      doPaymentTask(taskNo) {
        if (!this.getSelectedRows().length) {
          this.$message.error('请选择收款！')
          return
        }
        var list = this.getSelectedRows().filter(item=>item.taskNo!==taskNo)
        if (list.length){
          this.$message.error(`有${list.length}条收款流程状态不符合当前操作！`)
          return false
        }
        doPaymentTask({taskIdList: this.getSelectedRows().map(item => item.taskId)}).then(res => {
          this.$message.success('操作成功！')
          this.queryPartData({payIds: '' + this.getSelectedRows().map(item => item.payId), payDetailIds: '' + this.getSelectedRows().map(item => item.payDetailId)})
          // this.handleSearch(this.searchType, false)
        }).catch(err => {
          // this.$message.error('操作失败！')
        })
      },
      init() {
        this.defaultQuerySearch()
        this.queryPayAcount()
        this.queryCurrency()
        this.queryClass()
        this.queryCounts()
      },
      queryCounts() {
        queryPayAccountByPermission().then(res => {
          this.payCompanyList = res.data || []
        })
      },
      queryClass() {
        let classIdString = [1157, 1039].join(',')
        querycustSelectClass({classId: classIdString}).then(res => {
          this.recvKindList = res.data['1157']
          this.recvTypeList = res.data['1039']
        })
      },
      queryCurrency() {
        queryCurrencyUrl().then(res => {
          this.bzList = res.data || []
        })
      },
      queryPayAcount() {
        queryPayAcountUrl().then(res => {
          this.accountList = res.data || []
        })
      },
      brushRight() {
        let data = this.$commonUtils.getFilterModel(this.$options.name + this.$route.name, 'FilterModel')
        let arr = Object.keys(data)
        arr.forEach(item => {
          this.gridApi.destroyFilter(item)
        })
      },
      defaultQuerySearch() {
        this.queryModuleData = JSON.parse(localStorage.getItem('queryModuleData')) ? JSON.parse(localStorage.getItem('queryModuleData')).find(item => item.name == this.$route.name) ? JSON.parse(localStorage.getItem('queryModuleData')).find(item => item.name == this.$route.name).queryModuleData : {} : {}
        if (this.queryModuleData.wfStatusOut || this.queryModuleData.wfStatusDetail || this.queryModuleData.createDateArray && this.queryModuleData.createDateArray.length) {
          this.searchType = 1
        }
        if (this.queryModuleData.belongtoDateBeginOut) {
          this.currentYear = this.queryModuleData.belongtoDateBeginOut.slice(0, 4)
          this.currentMonth = this.queryModuleData.belongtoDateBeginOut.slice(5)
        }
        if (this.queryModuleData.payAccountIdOut || this.queryModuleData.createDateArray && this.queryModuleData.createDateArray.length || this.queryModuleData.wfStatusDetail) {
          this.searchType = 1
          this.$set(this.queryModuleData, 'wfStatusOut', null)
        }
        !this.isFinance && this.handleSearch(this.searchType, true)
      },
      queryCustomerList(query) {
        if (query !== '') {
          queryCustomerNameId({pageNo: 1, pageSize: 100, keyword: query}).then(res => {
            this.customerNameIdList = res.data
          })
        }
      },
      handleSearch(flag, type) {
        if (typeof flag == 'object') {
          const {searchType, searchData} = flag
          this.queryModuleData = Object.assign(this.queryModuleData, searchData)
          if (searchType !== undefined) {
            this.searchType = searchType
            if (searchData.wfStatusDetail) {
              delete this.queryModuleData.wfStatusOut
              delete this.queryModuleData.createDateArray
            }
            if (searchData.wfStatusOut) {
              delete this.queryModuleData.wfStatusDetail
              delete this.queryModuleData.createDateArray
            }
            if (searchData.createDateArray && searchData.createDateArray.length) {
              delete this.queryModuleData.wfStatusDetail
              delete this.queryModuleData.wfStatusOut
            }
            if (searchType && this.queryModuleData.wfStatusOut) {
              this.changeWfStatus()
              return;
            }
            if (searchType && this.queryModuleData.wfStatusDetail) {
              this.changeWfStatusDetail()
              return;
            }
            if (searchType && this.queryModuleData.createDateArray && this.queryModuleData.createDateArray.length) {
              this.changeCreateDate()
              return;
            }
          }
        } else {
          this.searchType = flag
        }
        // this.searchType = flag || 0
        this.drawerState = false
        if (this.searchType) { //外部搜索

        } else {
          for (var key in this.queryModuleData) {
            const list = ['wfStatusOut', 'belongtoDateBeginOut', 'payAccountIdOut', 'createDateArray', 'wfStatusDetail']
            if (list.includes(key)) {
              this.$set(this.queryModuleData, key, undefined)
              if (key == 'createDateArray') {
                this.$set(this.queryModuleData, key, [])
              }
            }
          }
        }
        this.queryPaymentList(type)
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
      queryPartData({payIds, payDetailIds}){
        if(!payIds)return;
        if(this.$options.name == 'collect_list'){
          this.$commonUtils.partUpdate(
            this.collectList,
            queryPaymentList,
            {key: 'payId', value: payIds},
            (list) => {
              this.gridApi.refreshCells();
              let rowId = []
              String(list.map(item => item.payId)).split(',').forEach(item => {
                if(this.collectList.find(i => i.payId == item ).wfStatus !== this.queryModuleData.wfStatusOut && this.queryModuleData.wfStatusOut){
                  rowId.push(this.collectList.find(i => i.payId == item ).payId)
                }
              })
              this.$commonUtils.partDel(this.collectList, rowId, 'payId', () => {this.total && this.total --;this.currentPageSize --;})
            }
          )
        }else{
          this.$commonUtils.partUpdate(
            this.collectList,
            queryPaymentDetailList,
            {key: 'payDetailId', value: payDetailIds},
            (list) => {
              this.gridApi.refreshCells();
              let rowId = []
              String(list.map(item => item.payDetailId)).split(',').forEach(item => {
                if(this.collectList.find(i => i.payDetailId == item ).wfStatus !== this.queryModuleData.wfStatusDetail && this.queryModuleData.wfStatusDetail){
                  rowId.push(this.collectList.find(i => i.payDetailId == item ).payDetailId)
                }
              })
              this.$commonUtils.partDel(this.collectList, rowId, 'payDetailId', () => {this.total && this.total --;this.currentPageSize --;})
            }
          )
        }
      },
      queryPaymentList(type) {
        const data = {
          pageNo: this.listQuery.pageNo,
          pageSize: this.listQuery.pageSize
        }
        const searchData = Object.assign(data, this.queryModuleData)
        const list = ['recvDateArray', 'wfStatusDetail','wfStatusOut', 'wfStatus', 'pageNo', 'pageSize', 'payAccountId', 'payAccountIdOut', 'belongtoDateBegin', 'belongtoDateBeginOut', 'createDateArray']
        if (this.searchType) {//外部
          for (var key in searchData) {
            if (key == 'payAccountIdOut' && searchData[key]) {
              searchData['payAccountId'] = this.queryModuleData.payAccountIdOut
              searchData['wfStatus'] = '已完成'
            }
            if (key == 'wfStatusOut' && searchData[key]) {
              searchData['wfStatus'] = this.queryModuleData.wfStatusOut
            }
            if (key == 'wfStatusDetail' && searchData[key]) {
              searchData['wfStatus'] = this.queryModuleData.wfStatusDetail
            }
            if (key == 'belongtoDateBeginOut' && searchData[key]) {
              searchData['wfStatus'] = '已完成'
              searchData['recvDateArray'] = [this.queryModuleData.belongtoDateBeginOut + '-01', this.$commonUtils.getEndDate( this.$commonUtils.getEndDate( this.queryModuleData.belongtoDateBeginOut + '-01', 1, '月'), -1, '天')]
              // searchData['belongtoDateBegin'] = this.queryModuleData.belongtoDateBeginOut
              // searchData['belongtoDateEnd'] = this.queryModuleData.belongtoDateBeginOut
            }
            if(key == 'createDateArray' && searchData[key] && searchData[key].length){
              searchData['wfStatus'] = '已完成'
            }
            if (!list.includes(key)) {
              delete searchData[key]
            }
          }
        } else {//内部

        }
        this.exportQueryModel = JSON.stringify(searchData)
        if (searchData.wfStatusOut) {
          this.$options.name = 'collect_list'
          this.tableHeader = []
          if (localStorage.getItem('tableHeader') && JSON.parse(localStorage.getItem('tableHeader')).find(item => item.name == this.$options.name + this.$route.name)) {
            this.tableHeader = JSON.parse(localStorage.getItem('tableHeader')).find(item => item.name == this.$options.name + this.$route.name).tableHeader
          }
          if (this.tableHeader.length) {
            this.tableTitleList = this.tableHeader
          } else {
            this.tableHeader = this.tableTitleList.map(item => ({
              label: item.label,
              prop: item.prop,
              width: this.getLoactionWidth(item.label)
            }))
          }
          this.saveLocation()
          // return
          this.columnDefs = [...this.defaultcolumnDefs, ...this.tableTitleList.map(item => ({
            headerName: item.label,
            field: item.prop,
            resizable: true,
            sortable: true,
            width: this.getLoactionWidth(item.label) == 'auto' ? 110 : this.getLoactionWidth(item.label),
            autoHeight: true,
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
          this.detailCellRendererParams.detailGridOptions.columnDefs = [...this.defaultcolumnDefs2, ...this.tableTitleList2.map(item => ({
            headerName: item.label,
            field: item.prop,
            // width:200,
            resizable: true,
            sortable: true,
            filter: 'agSetColumnFilter',
            cellRenderer: this.cellRenderer2,
            menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
            enableRowGroup: true,
            filterParams: {
              newRowsAction: 'keep',
              comparator: (a, b) => {
                return this.$commonUtils.sort(a, b, item.prop)
              }
            }
          }))]
          queryPaymentList(searchData).then(res => {
            this.collectList = res.data
            this.total = res.total || 0
            if(this.collectList.length){
              this.getFilterModel()
            }
          })
        } else {
          this.$options.name = 'collect_detail'
          this.queryTableTitle()

          queryPaymentDetailList(searchData).then(res => {
            this.collectList = res.data
            this.total = res.total || 0
            if(this.collectList.length){
              this.getFilterModel()
            }
          })
        }
      },
      getFilterModel() {
        this.$nextTick(() => {
          let data = this.$commonUtils.getFilterModel(this.$options.name + this.$route.name, 'FilterModel')
          let arr = Object.keys(data)
          let arrInstance = arr.map(item => this.gridApi.getFilterInstance(item))
          arrInstance.forEach((item, index) => {
            item && item.selectNothing()
            item && item.setModel(data[arr[index]])
            item && item.applyModel()
          })
          this.gridApi.onFilterChanged()
          let sortData = this.$commonUtils.getFilterModel(this.$options.name + this.$route.name, 'SortModel')
          if (sortData && sortData.length) {
            this.gridApi.setSortModel(sortData)
            this.gridApi.onSortChanged()
          }
        })
      },
      handleChange(boolean) {
        if (!boolean) {
          this.checkboxState = false
        }
      },
      filterCheck(val) {
        this.filterText = val
      },
      handleCheckboxState() {
        this.checkboxState = !this.checkboxState
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
      dragStopped(params) {
        let tableHeader = params.columnApi.columnController.gridColumns.map(item => ({
          label: item.colDef.headerName,
          width: item.actualWidth,
          prop: item.colDef.field
        })).filter(item => item.prop != 'sid' && item.prop != 'group')
        this.tableHeader = tableHeader
        this.$options.name === 'collect_detail' && this.changeHeader(tableHeader)
        this.saveLocation()
      },
      savePreference(num) {
        let list2 = this.checkCaseList.map(item => ({
          title: this.selectColumnList.find(i => i.COLUMN_NAME === item)
            .COLUMN_COMMENT,
          value: item
        }))
        const data = {
          userId: this.$store.getters.userId,
          bussId: 46,
          list2
        }
        savePreference(data).then(res => {
          if (res.success) {
            this.checkboxState = false
            this.filterText = ''
            if (!num) {
              // this.queryFeeList()
            }
            // this.saveLocation()
            this.queryTableTitle(true)
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
          }))
          const data = {
            userId: this.$store.getters.userId,
            bussId: 46,
            list2
          }

          savePreference(data).then(res => {

          })
        }
      },
      delPreference(num) {
        const data = {
          userId: this.$store.getters.userId,
          bussId: 46
        }
        delPreference(data).then(res => {
          if (res.success) {
            this.checkboxState = false
            if (!num) {
              // this.queryFeeList()
            }
            // this.saveLocation()
            this.queryTableTitle(true)
          }
        })
      },
      queryTableTitle(flag) {
        // if(!this.firstQuery && !flag){
        //   this.columnDefs = [...this.defaultcolumnDefs, ...this.tableHeader.map(item => ({
        //     headerName: item.label,
        //     field: item.prop,
        //     width: item.width,
        //     resizable: true,
        //     sortable: true,
        //     filter: 'agSetColumnFilter',
        //     menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
        //     cellRenderer: this.cellRenderer,
        //     enableRowGroup: true,
        //     filterParams: {
        //       newRowsAction: 'keep',
        //       comparator: (a, b) => {
        //         return this.$commonUtils.sort(a, b, item.prop)
        //       }
        //     }
        //   }))]
        //   return
        // };
        this.firstQuery = false;
        const data = {
          userId: this.$store.getters.userId,
          bussId: 46
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
            }
          }))]
          this.$nextTick(()=>{
            this.columnDefs.forEach(item=>{
              this.columnApi.getColumn&&this.columnApi.getColumn(item.field)&&this.columnApi.getColumn(item.field).addEventListener('menuVisibleChanged', ()=>{
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
          this.saveLocation()
          this.checkCaseList = this.preferenceList.map(item => item.value)

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
      rowClicked(params) {
        if (params.node.expanded) {
          params.node.setExpanded(false)
        } else {
          params.node.setExpanded(true)
        }
        // this.columnDefs.push({})
        // this.columnDefs.pop()
      },
      getSidDiv(params) {
        let expandIndex = 10000
        if (params.colDef.field === 'sid') {
          params.api.forEachNode(rowNode => {
            if (rowNode.expanded) {
              expandIndex = rowNode.rowIndex
            }
          })
        }
        const h = this.$createElement
        let vnode =
          params.node.data.payDetails ?
            h('div', {
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
            : h('div', {}, [
              h('span', {
                attrs: {
                  title: `${params.rowIndex + 1}`
                }
              }, [`${params.rowIndex + 1}`])
            ]
            )
        const div = document.createElement('div')
        this.__patch__(div, vnode, true, false)
        return div
      },
      cellRenderer(params) {
        if (params.colDef.field === 'sid' && params.value !== '') {
          return this.getSidDiv(params)
        }
        const mountList = ['currExchangeRate', 'paidLocalTotal', 'paidForeignTotal', 'sameRecvAmount', 'billSum', 'serviceCost', 'officialCost', 'otherCost', 'serviceCostDiscount', 'foreignSum', 'duetoLocal', 'duetoForeign', 'paidLocal', 'paidForeign', 'gainsLosses', 'chargeLocal', 'chargeForeign']
        if (mountList.includes(params.colDef.field)) {
          return `<span title="${params.value}" style="float: right">${formatAmount(params.value) || ''}</span>`
        }
        return `<span title="${params.value}">${params.value ? params.value : ''}</span>`
      },
      cellRenderer2(params) {
        if (params.colDef.field === 'sid' && params.value !== '') {
          return params.rowIndex + 1
        }
        const mountList = ['currExchangeRate', 'paidLocalTotal', 'paidForeignTotal', 'sameRecvAmount', 'billSum', 'serviceCost', 'officialCost', 'otherCost', 'serviceCostDiscount', 'foreignSum', 'duetoLocal', 'duetoForeign', 'paidLocal', 'paidForeign', 'gainsLosses', 'chargeLocal', 'chargeForeign']
        if (mountList.includes(params.colDef.field)) {
          return `<span title="${params.value}" style="float: right">${formatAmount(params.value) || ''}</span>`
        }
        return `<span title="${params.value}">${params.value ? params.value : ''}</span>`
      },
      getContextMenuItemsChild(params) {
        if (!params.node || !params.node.data) {
          return []
        }
        return this.getRowContextmenuListChild(params.node.data).map(item => ({
          name: item.name,
          action: () => {
            this[item.action](params.node.data, params.value, params)
          }
        }))
      },
      getRowContextmenuListChild(row) {
        return [
          {name: '复制', action: 'copy'},
          {name: '修改', action: 'edit', flag: 1}
          // { name: '修改', action: 'edit' }
        ].filter(item => {
          if (item.flag) {
            return row.flag === item.flag
          } else {
            return true
          }
        })
      },
      clearSeach(that) {
        for (var key in that.queryModuleData) {
          let list = ['wfStatusOut']
          if (!list.includes(key)) {
            if (key.includes('Date')) {
              that.$set(that.queryModuleData, key, ['', ''])
            } else if (key.includes('Array') || key.includes('List')) {
              that.$set(that.queryModuleData, key, [])
            } else if (key === 'caseTypeIds' || key === 'custIds') {
              that.$set(that.queryModuleData, key, [])
            } else {
              that.$set(that.queryModuleData, key, undefined)
            }
          }
        }
      },
      onGridReady(params) {
        this.gridparams = params
        this.gridApi = params.api
        this.columnApi = params.columnApi
        // params.api.sizeColumnsToFit()
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
      createCollect() {
        this.collectDialogVisible = true
        this.title = '收款-新建'
        this.type = 'create'
        // this.$router.push('/workbench/finance/collectionCreate')
      },
      edit(row) {
        this.payId = row.payId
        this.collectDialogVisible = true
        this.title = '收款-编辑'
        this.type = 'edit'
        // this.$router.push('/workbench/finance/collectionEdit/' + row.payId)
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
      getSelectedRows() {
        if (this.gridApi) {
          const selectedNodes = this.gridApi.getSelectedNodes()
          const selectedData = selectedNodes.map(node => node.data)
          return selectedData
        } else {
          return false
        }
      },
      rebook(row) {
        this.$emit('events', {action: 'COLLECTION_REBOOK', data: {...row, rightKeySign: true}})
      },
      getRowContextmenuList(row) {
        return [
          {name: '复制', action: 'copy'},
          {name: '改签', action: 'rebook'},
          {name: '修改', action: 'edit', flag: 1},
          {name: '删除', action: 'deletePay', flag: 1}
        ].filter(item => {
          if (item.flag) {
            return row.flag === item.flag
          } else {
            return true
          }
        })
      },
      deletePays(rows) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deletePayment({
            payIds: String(rows.map(i => i.payId))
          }).then(res => {
            this.$commonUtils.partDel(this.collectList, rows.map(item => item.payId), 'payId', () => {this.total && this.total --;this.currentPageSize --;this.$message.success('删除成功!')})
            // this.handleSearch(this.searchType, false)
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      deletePay(row) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deletePayment({
            payIds: row.payId
          }).then(res => {
            this.$commonUtils.partDel(this.collectList, [row.payId], 'payId', () => {this.total && this.total --;this.currentPageSize --;this.$message.success('删除成功!')})
            // this.handleSearch(this.searchType, false)
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      rowDoubleClicked(params) {
        var row = params.data
        this.payId = row.payId
        var isTaskPerson = row.tasker ? row.tasker.includes(this.$store.getters.name) : false
        if(
          row.taskNo == 1 && isTaskPerson
          ||
          this.$store.getters.permissions.includes(341) && row.taskNo == 2 && isTaskPerson
        ) {
          this.title = '收款-编辑'
          this.type = 'edit'
          this.isAudit = true
        }else{
          this.title = '收款-查看'
          this.type = 'view'
        }
        this.collectDialogVisible = true
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
        if (this.collectList.length) {
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
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "~@/styles/mixin.scss";

  .dateSlect {
    /deep/ .el-input,
    /deep/ .el-select {
      width: 45%;
    }
  }

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

  .el-table /deep/ th {
    background-color: #f2f2f2;
    color: #333333;
    text-align: center;
  }

  .el-table /deep/ td {
    padding: 0px;
    text-align: center;
  }

  .iconBtn {
    font-size: 20px;
  }

  /deep/ .el-cascader {
    width: 100%;
  }

  .form-container /deep/ {
    max-height: 500px;
    overflow: auto;
    /*width: 550px;*/
    padding-bottom: 10px;

    .el-form-item__label {
      text-align: left;
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

  .DataPicker /deep/ {
    line-height: 28px;

    .el-input__prefix {
      display: none;
    }

    .el-input__inner {
      text-align: left;
      padding-left: 15px;
      padding-right: 18px;
      // padding-left: 10px;
    }
  }

  .grid-table {
    position: relative;
  }

  .brush_right {
    position: absolute;
    right: 6px;
    z-index: 1;
    top: 25px;
  }


  > > > .content-center {
    .el-form-item__content {
      height: 28px;
      display: flex;
      align-items: center;
      /*justify-content: center;*/
    }
  }

  /deep/ .rotateClass {
    transform: rotate(90deg);
    transition: transform 5s ease-in-out
  }

  .noMargin {
    margin: 0;
  }

  .dots {
    cursor: pointer;
    position: absolute;
    left: 0;
    z-index: 1;
    top: 36px;
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

  .isActive {
    background-color: #409EFF;
    color: #fff;
  }

  > > > .noBottomMargin {
    .el-form-item {
      margin-bottom: 0;
    }
  }

  .el-tag {
    cursor: pointer;
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

</style>
