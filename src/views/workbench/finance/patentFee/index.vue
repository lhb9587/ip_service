<template>
  <div>
    <div v-if="!isFinance" class="header-box" style="height: 50px;">
      <!--      <el-button class="el-dropdown-link" type="primary" size="small"-->
      <!--                 @click="()=>{drawerView = true;title = '新建清单'}">-->
      <!--        新建清单-->
      <!--      </el-button>-->
      <div class="fl-ac-jc">
        <headerSearch style="display: inline-block;margin-right: 10px" :name="$options.name" @search="queryPayList"
                      :bussId="42"></headerSearch>
        <el-popover
          ref="popover"
          width="400"
          trigger="click"
          placement="bottom">
          <div style="height: 200px;width: 100%">
            <OfficialDocuments types="patenFee" @confirm="confirmClick"
                               @closePopover="()=>{$refs.popover.doClose()}"></OfficialDocuments>
          </div>
          <el-button slot="reference" type="primary" size="small" style="margin: 0 10px" @click="sjClick">收据录入</el-button>
        </el-popover>
        <el-button size="small" type="primary" style="margin: 0 10px" @click="editCurrency">缴费汇率</el-button>
      </div>
      <div style="float: right;height: 50px;width: 50px;">
        <ViewsSwitching class="ViewsSwitching" @changePattern="changePattern"></ViewsSwitching>
      </div>

    </div>

    <div class="content_wrap" style="padding-top: 10px">
      <div style="position: relative;padding: 10px 10px 0 10px;border: 1px solid #E4E7ED" class="left_wrap"
           :style="{width:visiable&&pattern?leftWrapWidth:'100%' }">

        <div style="position:absolute;top: 15px" v-if="!isFinance">
          <div style="display: flex;justify-content: flex-start;height: 32px;">
            <el-button type="primary" size="mini"
                       @click="createList">
              新建清单
            </el-button>
            <!--            <el-button size="mini" type="primary" @click="payReceiptView = true">收据录入</el-button>-->
            <el-dropdown class="head-btn" style="margin-left: 10px" size="small" split-button type="primary" @click="netPay(0)" @command="netPay">
              网络支付
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="1">PCT国际阶段费用</el-dropdown-item>
                <el-dropdown-item command="2">PCT首次进入国家阶段费用</el-dropdown-item>
                <el-dropdown-item command="3">国家申请或集成电路费用</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
<!--            <el-button size="mini" type="primary" @click="netPay">网络支付</el-button>-->
            <el-dropdown class="head-btn" style="margin-left: 10px" size="small" split-button type="primary" @click="financePay" @command="financePay">
              财务支付
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="补充缴费">补充缴费</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
<!--            <el-button size="mini" type="primary" @click="financePay">财务支付</el-button>-->
          </div>
        </div>
<!--        <div style="position:absolute; cursor: pointer; float: right; align-items: center; right: 45px; top: -35px; font-size: 14px; padding-right: 6px;z-index: 5;">-->
<!--          <el-button type="text" @click="exportList(2)" >导出</el-button>-->
<!--          <span style="color: #52A2F4;margin: 0 5px"> / </span>-->
<!--          <el-button type="text" @click="exportList(1)">全局导出</el-button>-->
<!--        </div>-->
        <el-button class="brush_right" :class="brushRightHasFilter?'red':''" @click="brushRight" type="text"
                   icon="el-icon-brush"></el-button>
        <!--        <TitleTotal :total="total" :currentPageSize="currentPageSize"/>-->
        <AgGridVue
          :style="{width:'100%',height: clientHeight-50+'px'}"
          class="ag-theme-balham"
          :columnDefs="columnDefs"
          :rowData="payList"
          rowSelection="multiple"
          @grid-ready="onGridReady"
          @rowClicked="rowClicked"
          @rowDoubleClicked="rowDoubleClicked"
          :gridOptions="gridOptions"
          :getContextMenuItems="getContextMenuItems"
          @sortChanged="refreshEvenRowsCurrencyData"
          @filterChanged="refreshEvenRowsCurrencyData"
          suppressAutoSize
          animateRows
          :localeText="$store.state.caseInformation.localeText"
          :frameworkComponents="frameworkComponents"
          :rowHeight="isFinance ? $commonUtils.getRowHeight() : 28"
          :pinnedBottomRowData="pinnedBottomRowData"
        >
        </AgGridVue>
        <pagination
          v-if="total>0"
          :total="total"
          :page.sync="listQuery.pageNo"
          :limit.sync="listQuery.pageSize"
          @pagination="queryPayList"
          :pageSizes="pageSizesList"
        />
      </div>
      <div class="right_wrap"
           style="position:relative;padding: 50px 0px 0 0px;"
           :style="{position:'relative','margin-left':visiable?'10px' :'0','margin-right':visiable?'10px' :'0',height:clientHeight+'px'}">
        <div v-if="pattern" style="position:absolute;top:15px;left: 10px;z-index: 99">
          <el-button type="primary" size="mini" @click="addCao">
            新建
          </el-button>
          <el-button size="mini" type="primary" @click="addDaoru">导入
          </el-button>
          <el-button size="mini" type="primary" @click="exportList(2)">导出
          </el-button>
          <el-button size="mini" type="primary" @click="downloadList">下载
          </el-button>
          <el-button type="primary" size="mini" @click="modifyPatentPayList">
            保存
          </el-button>
          <el-button type="primary" size="mini" @click="delCao">
            删除
          </el-button>
        </div>
        <right-table :is-finance="isFinance" ref="rightTable" :table-height="false" v-if="visiable&&pattern" type="官费"
                     :childDataList="childDataList"></right-table>
      </div>

    </div>

<!--    修改汇率-->
    <el-dialog :close-on-click-modal="false" :modal="false" title="缴费汇率" class="currency"
               :visible.sync="editCurrencyView" width="60%">

      <el-table size="mini" :data="currencyList" border fit empty-text="暂无数据" style="width: 100%;">
        <el-table-column type="index" label="序号" align="left" width="60"></el-table-column>
        <el-table-column label="币种名称">
          <template slot-scope="scope">
            <el-input size="mini" v-model="scope.row.curName"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="简称">
          <template slot-scope="scope">
            <el-input size="mini" v-model="scope.row.signEn"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="汇率">
          <template slot-scope="scope">
            <el-input size="mini" v-model="scope.row.exchangeRate"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="更新时间">
          <template slot-scope="scope">
            <el-date-picker
            v-model="scope.row.modifyDate"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd">
          </el-date-picker>
          </template>
        </el-table-column>
      </el-table>
       <span slot="footer" class="dialog-footer fl-ac-jc">
        <el-button size="small" @click="editCurrencyView = false">取 消</el-button>
        <el-button size="small" type="primary" @click="modifyCurrency">修 改</el-button>
      </span>
    </el-dialog>
    <!--    清单弹框-->
    <el-dialog :close-on-click-modal="false" :modal="false" :before-close="closeDialog" :title="title"
               :visible.sync="qingView" width="60%">
      <qingDialog ref="patentFee" @close="closeDialog" @daoRuCao="daoRuCao" @search="queryPayList"
                  :editData="editData" :sign="sign"
                  :payListType="queryModuleData.payListType"></qingDialog>
    </el-dialog>

    <!--  抽屉弹框  -->
    <el-drawer
      :wrapperClosable="false"
      :title="title"
      :visible.sync="drawerView"
      direction="btt"
      :modal="false"
      size="95%"
      custom-class="billDraw"
      :before-close="closeDialog"
    >
      <createPatentFee @close="closeDialog" @daoRuCao="daoRuCao" :sign="sign"
                       :payListType="queryModuleData.payListType"></createPatentFee>
    </el-drawer>

    <SelectOption :buss-id="bussId" v-if="selectionOptionState" :dialog-visible="selectionOptionState"
                  @cancel="closeSelect" :idArray="getCurrentRowsData('payDetailId')"
                  :defaultMultipleSelect="preferenceList.map(i=>i.title)"
                  :propsArray="getCurrentRowsProps()"
                  :exportType="exportType" :exportQueryModel="exportQueryModel">
    </SelectOption>

  </div>
</template>

<script>
  import { downLoadAll, getLanglist } from '@/utils'
  import { formatAmount, fomatFloat } from '@/utils/filters'
  import Summary from '@/components/Summary/index.js'
  import { mapState } from 'vuex'
  import { queryPayList, deletePatentPayList, modifyPatentPayList, createPayExcel, createFee, modifyPatentPayCurrency, queryPatentPayCurrency } from '@/api/billApi'
  import ViewsSwitching from '@/views/workbench/case/components/ViewsSwitching'
  import axios from 'axios'
  import jsFileDownload from 'js-file-download'

  import qingDialog from './component/qingDialog'
  import OfficialDocuments from '../../case/components/OfficialDocuments'
  import Pagination from '@/components/Pagination'
  import rightTable from '../../customer_management/business_pportunity/components/rightTable'
  import createPatentFee from './component/create_patentFee'
  import headerSearch from '@/components/HeaderSearch'
  import SelectOption from '@/views/workbench/case/components/SelectOption.vue'

  export default {
    name: 'patentFeeIndex',
    components: {
      SelectOption,
      Pagination,
      rightTable,
      createPatentFee,
      headerSearch,
      OfficialDocuments,
      ViewsSwitching,
      qingDialog
    },
    computed: {
      ...mapState({
        'pattern': state => state.user.pattern
      }),
      pinnedBottomRowData(){
        if(this.isFinance){
          const columnDisplay = ['payAmountSum']
          return this.$commonUtils.pinnedBottomRowData(this.payList, this.columnDefs, columnDisplay)
        }
        return ''
      },
      clientHeight() {
        let height = 0;
        if(this.$store.state.settings.toolPosTop == 'top'){
          height = 180
        }else if(this.$store.state.settings.toolPosTop == 'right'){
          height = 100
        }
        return (document.documentElement.clientHeight - (this.isFinance ? height : 250))
      }
    },
    props:{
      isFinance:{
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        exportQueryModel: '',
        bussId: 95,
        exportType: 1,
        selectionOptionState: false,
        gridApi: {},
        currencyList: [],
        editCurrencyView: false,
        currentPayListId: '',
        frameworkComponents: {
          CountStatusBarComponent: Summary
        },
        qingView: false,
        scrollTop: 0,
        selectId: 0,
        payReceiptView: false,
        sign: '', // createQing => 新建清单 | editQing => 修改清单 | createCao => 导入草单
        brushRightHasFilter: false,
        title: '',
        drawerView: false,
        childDataList: [],
        leftWrapWidth: localStorage.getItem('leftWrapWidth') ? localStorage.getItem('leftWrapWidth') : '60%',
        visiable: false,
        listQuery: {
          pageNo: 1,
          pageSize: JSON.parse(localStorage.getItem('pageSize')) ? JSON.parse(localStorage.getItem('pageSize')).find(item => item.name == this.$route.name) ? JSON.parse(localStorage.getItem('pageSize')).find(item => item.name == this.$route.name).pageSize : 10 : 10
        },
        payList: [],
        columnDefs: [],
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
        preferenceList: [
          { 'label': '清单编号', prop: 'payListNo', 'width': 120 },
          { 'label': '缴费类型', prop: 'payListTypeStr', 'width': 120 },
          { 'label': '缴费方式', prop: 'payMethodStr', 'width': 120 },
          { 'label': '收据抬头', prop: 'receiptTitleStr', 'width': 120 },
          { 'label': '缴费日期', prop: 'payDate', 'width': 120 },
          // {"label": "缴费期限", prop: "ofeeDeadline", 'width': 120},
          { 'label': '制作日期', prop: 'createDate', 'width': 120 },
          { 'label': '制作人', prop: 'createUserIdStr', 'width': 120 },
          { 'label': '登记日期', prop: 'regDate', 'width': 120 },
          { 'label': '登记人', prop: 'regUserIdStr', 'width': 120 },
          { 'label': '收据号范围', prop: 'invoiceNos', 'width': 120 },
          { 'label': '状态', prop: 'statusStr', 'width': 120 },
          { 'label': '金额合计', prop: 'payAmountSum', 'width': 120 },
          { 'label': '备注信息', prop: 'memo', 'width': 120 }
        ],
        gridOptions: {
          ...this.$store.state.caseInformation.gridOptions, ...{
            statusBar: {
              statusPanels: [
                // { statusPanel: 'agTotalAndFilteredRowCountComponent', align: 'left' },
                // { statusPanel: 'agSelectedRowCountComponent', align: 'left' },
                { statusPanel: 'CountStatusBarComponent' }
              ]
            }
          }
        },
        pageSizesList: [10, 50, 200, 300, 400, 500],
        total: 0,
        currentPageSize: 0,
        queryModuleData: {},
        editData: {},
        payListSelectData: {}
      }
    },
    watch: {
      pattern: {
        handler(n, o) {
          if (n) {
            // this.$store.commit('app/TOGGLE_SIDEBAR', false)
          } else {
            // this.$store.commit('app/TOGGLE_SIDEBAR',true)
          }
        },
        immediate: true
      },
      $route: {
        handler: function(val, oldVal) {
          this.$nextTick(() => {
            this.rightDrag()
          })
        },
        immediate: true
      }
    },
    created() {
      this.queryModuleData = JSON.parse(localStorage.getItem('queryModuleData')) ? JSON.parse(localStorage.getItem('queryModuleData')).find(item => item.name == this.$options.name) ? JSON.parse(localStorage.getItem('queryModuleData')).find(item => item.name == this.$options.name).queryModuleData : {} : {}
      // this.queryPayList()
    },
    mounted() {
      this.rightDrag()
    },
    methods: {
      downloadList() {
        let list = []
        if (this.$refs.rightTable.gridApi && this.$refs.rightTable.gridApi.rowModel) {
          list = this.$refs.rightTable.gridApi.rowModel.rootNode.childrenAfterSort.map(item => item.data).map(item => ({
            agentNum: item.agentNum,
            payDate: item.payDate
          })).filter(item => item.agentNum)
        }
        if (list.length) {
          const payDates = [...new Set(list.map(i => i.payDate))]
          if (payDates.length > 1) {
            this.$message.error('请选择同一缴费日期下的收据')
            return
          }
          this.$router.push({
            path: '/workbench/material_management/caseMaterial',
            query: { agentNums: list.map(i => i.agentNum).join('@'), payDate: list[0].payDate }
          })
        } else {
          this.$message.error('请选择正确案件文号的收据')
        }
      },
      getCurrentRowsProps(){
        // if (this.$refs.rightTable.gridApi && this.$refs.rightTable.gridApi.rowModel) {
        //   return this.$refs.rightTable.gridApi.rowModel.rootNode.childrenAfterSort.map(item => item.data).map(item => ({payDetailId:item.payDetailId}))
        // }
        return []
      },
      getCurrentRowsData(key){
        if (this.$refs.rightTable.gridApi && this.$refs.rightTable.gridApi.rowModel) {
          return this.$refs.rightTable.gridApi.rowModel.rootNode.childrenAfterSort.map(item => item.data).map(item => item[key])
        }
        return []
      },
      closeSelect(){
        this.selectionState=false
        this.selectionOptionState=false
      },
      exportList(flag){
        this.exportType = flag
        this.selectionOptionState = true
      },
      mergePatent() {
        if (this.getSelectedRows().length == 0) {
          this.$message.error('请选择清单')
          return
        }
        const {payListType, payMethod, receiptTitle} = this.getSelectedRows()[0]
        if (this.getSelectedRows().find(item => item.statusStr !== '待网络支付' || item.payListType !== payListType || item.payMethod !== payMethod || item.receiptTitle !== receiptTitle)) {
          this.$message.error('所选清单无法合并！')
          return
        }
        const patentFormData = JSON.parse(JSON.stringify(this.getSelectedRows()[0]))
        patentFormData.payDetails = []
        this.getSelectedRows().forEach(item => {
          patentFormData.payDetails.push(...item.payDetails)
        })
        patentFormData.createDate = this.$commonUtils.formatDate(new Date())
        patentFormData.payDate = this.$commonUtils.formatDate(new Date())
        patentFormData.createUserId = this.$store.getters.userId
        patentFormData.payAmountSum = this.getSelectedRows().reduce((sum, item) => sum + item.payAmountSum, 0)
        patentFormData.hebing = 1
        modifyPatentPayList(patentFormData).then(res => {
          deletePatentPayList({
            idList: this.getSelectedRows().map(item => item.payListId).filter(item => item != patentFormData.payListId),
            hebing: 1
          }).then(res => {
            this.$message.success('合并成功!')
            this.queryPayList()
          })
        })

        console.log('+++++++++++++++++')
        console.log(patentFormData)
        console.log('+++++++++++++++++')
        // 缴费类型 payListType
        // 缴费方式 payMethod
        // 收据抬头 receiptTitle
        // 状态 statusStr 待网络支付
        // createDate payDate
      },
      createList(){
        this.qingView = true;
        this.sign = 'createQing';
        this.title = '新建清单'
      },
      modifyCurrency(){
        this.currencyList.forEach(item=>{
          modifyPatentPayCurrency({...item}).then(res=>{
            this.$message.success('修改成功!')
            this.editCurrencyView = false
          })
        })
      },
      editCurrency(){
        this.editCurrencyView = true
        queryPatentPayCurrency().then(res=>{
          this.currencyList = res.data
        })
      },
      getSummary(list) {
        let data = {
          payAmountSum: this.getSum(list, 'payAmountSum')
        }
        this.$store.commit('caseInformation/SET_SUMMARYDATA', { name: 'patentFee', count: data })
      },
      getSum(list, type) {
        return list.map(item => item[type]).filter(item => !!item).reduce((x, y) => x + y, 0)
      },
      sjClick() {
        this.scrollTop = document.getElementsByClassName('ag-body-viewport')[0].scrollTop
        // this.selectId = this.getSelectedRows()[0] && this.getSelectedRows()[0].payListId
      },
      confirmClick() {
        this.queryPayList('', () => {
          let index = this.payList.findIndex(i => i.payListId == this.currentPayListId)
          this.$nextTick(() => {
            let obj = document.getElementsByClassName('ag-body-viewport')[0]
            obj.scrollTop = this.scrollTop
            this.gridApi.rowModel.rootNode.childrenAfterFilter[index].setSelected(true)
          })
        })

      },
      closeDialog() {
        this.$refs.patentFee && this.$refs.patentFee.clearData()
        this.drawerView = false
        this.qingView = false
        this.sign = ''
      },
      changePattern(e) {
        if (e === 1) {
          this.$store.commit('user/SET_PATTERN', false)
        } else {
          this.$store.commit('user/SET_PATTERN', true)
          // if(this.caseList.length&&!this.currentId){
          //   let row=this.caseList.find((item,index)=>index==0)
          //   this.currentId=row[this.getCurFilterId(this.pageTitle)]
          //   this.currentCaseId=row.caseId
          //    this.$refs.caseListMultiple.setCurrentRow(row)
          // }
        }
      },
      rightDrag() {
        let that = this
        // document.getElementById('searchWrap').onscroll=function (e) {
        //   that.clearWrapTop = e.target.scrollTop+ e.target.offsetHeight
        //   document.getElementById('clearWrap').style.top = that.clearWrapTop -40 + 'px'
        // }
        document.querySelector('.left_wrap') && new this.$DraginResize(document.querySelector('.left_wrap'), {
          clone: true,
          end(info) {
            if (info.dir == 'ver') {
              this.elem.style.height = info.height + 'px'
            } else if (info.dir == 'hor') {
              this.elem.style.width = info.width + 'px'
              localStorage.setItem('leftWrapWidth', info.width + 'px')
              that.leftWrapWidth = info.width + 'px'
            }
          }
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
      },
      netPay(type) {
        if (this.getSelectedRows().length == 0) {
          this.$message.error('请选择清单')
        } else {
          let payListId = this.getSelectedRows()[0].payListId
          createPayExcel({ payListId, excelType: +type }).then(res => {
            res.data&&downLoadAll({ url: `ipdoc${res.data.address}`, success: () => {
              this.$message.success('导出成功')
              }})
            // window.location.href = `ipdoc${res.data.address}`
          })
        }

      },
      financePay(type) {
        if (this.getSelectedRows().length == 0) {
          this.$message.error('请选择清单')
        } else {
          let payListIdArr = this.getSelectedRows().map(i => i.payListId)
          createFee({ payListIdArr, isSupp: type === '补充缴费' }).then(res => {
            this.$message.success('已自动生成费用，等待专利局收据')
          })
        }
      },
      addDaoru() {
        if (this.getSelectedRows().length) {
          this.drawerView = true
          this.sign = 'createCao'
          this.title = '导入草单'
        } else {
          this.$message.error('请选择清单')
        }

      },
      delCao() {
        if (this.$refs.rightTable && this.$refs.rightTable.getSelectedRows().length) {
          this.$confirm('此操作将永久删除, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$refs.rightTable.getSelectedRows().map(i => {
              let index = this.childDataList.indexOf(i)
              this.childDataList.splice(index, 1)
            })
            this.modifyPatentPayList('del')
          })
        } else {
          this.$message.error('请选择')
        }
      },
      modifyPatentPayList(f) {
        if (this.getSelectedRows().length == 0) {
          this.$message.error('请选择清单')
          return
        }
        this.$refs.rightTable.refreshCells()
        // delete this.payListSelectData.payDetails;
        modifyPatentPayList({
          ...this.payListSelectData,
          payDetails: this.childDataList
        }).then(res => {
          f == 'del' ? this.$message.success('删除成功！') : f == 'daoru' ? (this.$message.success('导入成功！'),this.$refs.rightTable.scrollToBottom()) : this.$message.success('修改成功！')
        })
      },
      daoRuCao(dataList) {
        this.drawerView = false
        this.sign = ''
        this.childDataList = this.childDataList.concat(dataList)
        this.getSelectedRows()[0].payDetails = this.childDataList
        this.modifyPatentPayList('daoru')
      },
      addCao() {
        if (this.getSelectedRows().length == 0) {
          this.$message.error('请选择清单')
          return
        }
        const data = {
          agentNum: '',
          appNumber: '',
          caseCnName: '',
          nameCn: '',
          yearNo: '',
          payAmount: '',
          invoiceNo: '',
          payDate: this.$commonUtils.getDay(0, '-'),
          billNo: ''
        }
        this.childDataList.push(data)
        this.$refs.rightTable.scrollToBottom()
      },
      queryPayList(flag, callback) {
        this.drawerView = false
        this.qingView = false
        this.sign = ''
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
              return this.$commonUtils.sort(a, b, item.value)
            }
          }
        }))]
        this.$nextTick(()=>{
          this.columnDefs.forEach(item=>{
            this.columnApi.getColumn(item.field)&&this.columnApi.getColumn(item.field).addEventListener('menuVisibleChanged', ()=>{
              if(document.querySelector(".ag-tabs")){
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
            });
          })
        })
        flag === 1 && (this.listQuery.pageNo = 1)
        // !queryModuleData.page ? (this.queryModuleData = queryModuleData, this.listQuery.pageNo = 1) : ''
        this.queryModuleData = JSON.parse(localStorage.getItem('queryModuleData'))
          && JSON.parse(localStorage.getItem('queryModuleData')).find(item => item.name == this.$options.name)
          && JSON.parse(localStorage.getItem('queryModuleData')).find(item => item.name == this.$options.name).queryModuleData
          || {}

        queryPayList({ ...this.listQuery, ...this.queryModuleData }).then(res => {
          this.payList = res.data
          this.currentPageSize = this.payList.length
          this.total = res.total
          this.exportQueryModel = JSON.stringify(this.queryModuleData)
          callback && (this.childDataList = this.payList.find(i => i.payListId == this.currentPayListId).payDetails, callback());
          this.$nextTick(() => {
            this.getSummary(this.gridApi.rowModel.rootNode.childrenAfterFilter.map(item => item.data))
            if (this.currentPayListId){
              this.childDataList = this.payList.find(i => i.payListId == this.currentPayListId).payDetails
              if(this.gridApi.rowModel.rootNode.childrenAfterSort.length){
                this.gridApi.rowModel.rootNode.childrenAfterSort.find(item => item.data.payListId == this.currentPayListId).setSelected(true)
              }
              this.$refs.rightTable&&this.$refs.rightTable.refreshCells()
            }
          })
          if (JSON.parse(localStorage.getItem('queryModuleData'))) {
            var arr = JSON.parse(localStorage.getItem('queryModuleData'))
          } else {
            var arr = []
          }
          if (arr.find(item => item.name == this.$options.name)) {
            arr.find(item => item.name == this.$options.name).queryModuleData = this.queryModuleData
            arr.find(item => item.name == this.$options.name).operationState = this.operationState
          } else {
            arr.push({name: this.$options.name, queryModuleData: this.queryModuleData, operationState: this.operationState})
          }
          // this.childDataList = this.payList.find(i => i.payListId == this.selectId).payDetails
          localStorage.setItem('queryModuleData', JSON.stringify(arr))
        }).catch(err => {
          this.total = err.total
        })
      },
      rowDoubleClicked(params) {
        this.sign = 'viewQing'
        this.title = '查看清单'
        this.qingView = true
        this.editData = params.data
      },
      rowClicked(params) {
        if (this.currentPayListId == params.data.payListId) return
        this.selectId = params.data.payListId
        this.childDataList = params.data.payDetails
        this.payListSelectData = params.data
        this.currentPayListId = params.data.payListId
        this.visiable = true
      },
      brushRight() {
        // let data =   this.$commonUtils.getFilterModel(this.$options.name+this.$route.name,'FilterModel')
        let arr = this.columnDefs.map(item => item.field)// Object.keys(data)
        arr.forEach(item => {
          this.gridApi.destroyFilter(item)
        })
      },
      cellRenderer(params) {
        if (params.colDef.field === 'sid' && params.value !== '') {
          return params.rowIndex + 1
        }
        if (params.colDef.field === 'payAmountSum') {
          return `<span title="${params.value}">${typeof params.value === 'string' ? params.value : formatAmount(+params.value, 2)}</span>`
        }
        return `<span title="${params.value}">${params.value ? params.value : ''}</span>`
      },
      refreshEvenRowsCurrencyData(params) {
        this.getSummary(this.gridApi.rowModel.rootNode.childrenAfterFilter.map(item => item.data))
        this.currentPageSize = params.api.rowModel.rootNode.allChildrenCount
        if (!params.columnApi.columnController.groupAutoColumns) {
          this.gridApi.forEachNode(rowNode => {
            rowNode.setDataValue(
              'sid',
              rowNode.rowIndex + 1)
          })
        }
        if (params.type == 'filterChanged') {
          // this.$commonUtils.saveFilterModel(this.$options.name+this.$route.name,'FilterModel',this.gridApi.getFilterModel())
          // var data = this.$commonUtils.getFilterModel(this.$options.name + this.$route.name, 'FilterModel');
          var arr = Object.keys(this.gridApi.getFilterModel())
          if (arr.length) {
            this.brushRightHasFilter = true
          } else {
            this.brushRightHasFilter = false
          }
        }
      },
      onGridReady(params) {
        this.gridparams = params
        this.gridApi = params.api
        this.columnApi = params.columnApi
        params.api.sizeColumnsToFit()
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
      getRowContextmenuList(row) {
        return [
          { name: '复制', action: 'copy' },
          // { name: '商标导入', action: 'installtmmessage', permissions: 185 },
          { name: '修改', action: 'editFun' },
          { name: '删除', action: 'handledeleElement' }
        ]
      },
      handledeleElement(row) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deletePatentPayList({ payListId: row.payListId }).then(res => {
            const index = this.payList.indexOf(row)
            this.total--
            this.payList.splice(index, 1)
            this.$message.success('删除成功!')
            this.childDataList = []
          })
        })

      },
      editFun(row) {
        this.sign = 'editQing'
        this.title = '修改清单'
        this.qingView = true
        this.editData = row
        this.selectId = row.payListId
      },
      copy(row, value) {
        this.$copyText(value).then(
          res => {
          })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .header-box {
    width: 100%;
    border-top: 1px solid #E4E7ED;
    /*display: flex;*/
    /*justify-content: center;*/
  }

  .content_wrap {
    width: 100%;
    display: flex;

    .left_wrap {
      position: relative;
      transition: all 0.5s;
      //   width: 40%;
    }

    .right_wrap {
      box-shadow: 0px 0px 18px 0px rgba(64, 158, 255, 0.5);
      height: 598px;
      overflow: auto;
      transition: all 0.5s;
      flex: 1;
      z-index: 1;

      /deep/ * {
        font-size: 12px !important;
      }

      // width: 60%;
      /deep/ .sectionWrap {
        padding: 0 !important;
        padding-left: 10px !important;
        // padding-bottom: 350px!important;
        .ElectronWrap {
          padding: 0 !important;
        }
      }
    }
  }

  .brush_right {
    position: absolute;
    right: 16px;
    top: 6px;
    z-index: 4;
  }
  >>>.head-btn{
    .el-dropdown__caret-button{
      height: 32px;
    }
  }
  .currency{
    .el-table /deep/ th {
      background-color: #7199d5;
      color: #ffffff;
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
  }

</style>
