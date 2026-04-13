<template>
  <div>
    <div class="outTabs">
      <div class="search" name="search" :style="{backgroundColor: activeName === 'search' ? '#FFFFFF' : '#f5f7fa'}">
        <div class="btns" style="height: 40px;">
          <div style="cursor: pointer" @click="searchTab">
            <span class="el-icon-search" style="height: 40px;line-height: 40px;margin-left: 5px"></span>
            <span style="height: 40px;line-height: 40px">搜索</span>
          </div>

          <div style="height: 40px;line-height: 40px;cursor: pointer" @click="changeState"><span
            class="el-icon-arrow-down"></span></div>
        </div>
        <search-content v-if="!['statement', 'outPrice', 'traw', 'exchangeRate'].includes(type)" ref="search" style="display: inline-block;margin-right: 10px"
                        :name="name"
                        @search="queryList"
                        :bussId="bussId" :type="type" :ctx="ctx"/>
        <manual-search v-if="type == 'statement'" ref="search" style="width: 10px" :name="name"
                       @search="queryList"
                       :bussId="bussId" :type="type" :ctx="ctx"></manual-search>
        <outside-price-search v-if="type==='outPrice'" ref="search" style="width: 10px" :name="name"
                       @search="queryList"
                       :bussId="bussId" :type="type" :ctx="ctx" />
        <traw-search v-if="type == 'traw'" ref="search" style="width: 10px" :name="name"
                       @search="queryList"
                        :type="type" :ctx="ctx" />
        <exchange-rate-search v-if="type === 'exchangeRate'" ref="search" style="width: 10px" :name="name"
                              @search="queryList" :type="type" :ctx="ctx"></exchange-rate-search>

      </div>
      <div class="more" :style="{backgroundColor: ['国内', '国际', 4].includes(activeName) ? '#FFFFFF' : '#f5f7fa',color: ['国内', '国际', 4].includes(activeName) ? '#409EFF' : '#909399'}" style="display: flex;min-width: 100px;" @click="moreTab" name="more"
           v-if="['statement'].includes(type)">
        <el-popover
          placement="bottom"
          width="200"
          trigger="click"
        >
          <div class="statement">

            <template>
              <div class="statement-item" :class="{isActive: item.value == activeName}"
                      @click="changeStatementSearch(item)"
                      v-for="(item,index) in statementDropBtn" :key="item.value">
                {{item.label}}
              </div>
            </template>

          </div>
          <div style="display: flex;padding: 0 0 0 20px;cursor:pointer;" class="btns" slot="reference">
            <div>我负责的欠款客户</div>
            <span class="el-icon-arrow-down" style="margin-right: 5px"></span>
          </div>
        </el-popover>
      </div>
      <el-tabs :style="{borderRight: ['fee', 'collect','invoice_opener','invoice_library'].includes(type) ? 'none' : '1px solid #DCDFE6'}"
               v-model="activeName" type="border-card" style="margin:10px 0px 10px 0px;" @tab-click="tabSearch">
        <el-tab-pane :name="JSON.stringify(item)" v-for="(item, index) in tabList" :key="item.label">
          <span slot="label">{{item.label}}</span>
        </el-tab-pane>
      </el-tabs>
      <div class="more" :style="{backgroundColor: activeName.includes('当日') ? '#FFFFFF' : '#f5f7fa',color: activeName.includes('当日') ? '#409EFF' : '#909399'}" style="display: flex;min-width: 84px;" @click="todayPay" name="more" v-if="['fee', 'invoice_opener'].includes(type)">
        <span class="today" v-if="type=='fee'">当日支付</span>
        <span class="today" v-if="type=='invoice_opener'">当日开具</span>
      </div>
      <div class="more" :style="{backgroundColor: activeName=='今日欠票' ? '#FFFFFF' : '#f5f7fa',color: activeName=='今日欠票' ? '#409EFF' : '#909399'}" style="display: flex;min-width: 84px;" @click="todayPayBorrow(1)" name="more" v-if="['invoice_borrow'].includes(type)">
        <span class="today">今日欠票</span>
      </div>
      <div class="more" :style="{backgroundColor: activeName=='还票待核销' ? '#FFFFFF' : '#f5f7fa',color: activeName=='还票待核销' ? '#409EFF' : '#909399'}" style="display: flex;min-width: 110px;" @click="todayPayBorrow(3)" name="more" v-if="['invoice_borrow'].includes(type)">
        <span class="today">还票待核销</span>
      </div>
      <div class="more" :style="{backgroundColor: activeName=='今日核销' ? '#FFFFFF' : '#f5f7fa',color: activeName=='今日核销' ? '#409EFF' : '#909399'}" style="display: flex;min-width: 84px;" @click="todayPayBorrow(2)" name="more" v-if="['invoice_borrow'].includes(type)">
        <span class="today">今日核销</span>
      </div>
      <div class="more" :style="{backgroundColor: activeName=='超期欠票' ? '#FFFFFF' : '#f5f7fa',color: activeName=='超期欠票' ? '#409EFF' : '#909399'}" style="display: flex;min-width: 84px;" @click="todayPayBorrow(4)" name="more" v-if="['invoice_borrow'].includes(type)">
        <span class="today">超期欠票</span>
      </div>
      <div class="more" :style="{backgroundColor: activeName === 'more' ? '#FFFFFF' : '#f5f7fa',color: activeName === 'more' ? '#409EFF' : '#909399'}" style="display: flex;min-width: 100px;" @click="moreTab" name="more"
           v-if="['fee','collect','invoice_opener','invoice_library'].includes(type)">
        <el-popover
          placement="bottom"
          width="500"
          trigger="click"
        >
          <div class="companyBox">
            <template v-if="['fee'].includes(type)">
              <el-tag :class="{isActive: item.deptId == paymentDeptId}" @click.prevent.native="changeCompany(item)"
                      v-for="(item,index) in payCompanyList" :key="item.deptId" :title="item.companyShortName">
                {{item.companyShortName}}
              </el-tag>
            </template>
            <template v-if="type == 'collect'">
              <el-tag :class="{isActive: item.payAccountId == paymentDeptId}"
                      @click.prevent.native="changeCompany(item)"
                      v-for="(item,index) in payCompanyList" :key="item.payAccountId" :title="item.payAccountName">
                {{item.payAccountName}}
              </el-tag>
            </template>
            <template v-if="['invoice_opener', 'invoice_library'].includes(type)">
              <el-tag :class="{isActive: item.repCompId == paymentDeptId}"
                      @click.prevent.native="changeCompany(item)"
                      v-for="(item,index) in payCompanyList" :key="item.repCompId" :title="item.shortname">
                {{item.shortname}}
              </el-tag>
            </template>
          </div>
          <div style="display: flex;padding: 0 0 0 20px;cursor: pointer;" class="btns" slot="reference">
            <div>{{paymentDeptName}}</div>
            <span class="el-icon-arrow-down" style="margin-right: 5px"></span>
          </div>
        </el-popover>
      </div>
      <div style="" class="date" name="date"
           v-if="['fee', 'collect','invoice_opener'].includes(type)">
        <div class="dateInput">
          <el-date-picker
            style="cursor: pointer"
            ref="datePickers"
            id="datePick"
            @change="changeDatePick"
            v-model="belongToDate"
            type="month"
            value-format="yyyy-MM"
            :placeholder="belongToDate ? belongToDate : '所属月'">
          </el-date-picker>
        </div>
      </div>
      <ViewsSwitching v-if="['bill', 'patent', 'outPrice'].includes(type)" class="ViewsSwitching" @changePattern="changePattern"></ViewsSwitching>
    </div>
  </div>
</template>

<script>
  import ViewsSwitching from '@/views/workbench/case/components/ViewsSwitching'
  import {queryCompanyByPermission} from '@/api/feeList'
  import {queryPayAccountByPermission} from '@/api/billApi'
  import {queryReceiptCompany} from '@/api/caseList'
  import dispatcher from '../stateManage/dispatchers'
  import SearchContent from './SearchContent'
  import ManualSearch from "./ManualSearch";
  import {mapState} from "vuex";
  import OutsidePriceSearch from "./OutsidePriceSearch";
  import TrawSearch from "./TrawSearch";
  import ExchangeRateSearch from "@/views/workbench/finance_two/components/ExchangeRateSearch.vue";

  export default {
    name: 'TopMenu',
    props: {
      display: {
        type: Boolean,
        default: false
      },
      type: {
        type: String,
        default: ''
      },
      tabList: {
        type: Array,
        default: () => []
      },
      ctx: {},
      bussId: {
        type: Number
      }
    },
    computed: {
      ...mapState({
        'pattern' : state => state.user.pattern,
      }),
      name() {
        switch (this.type) {
          case 'bill':
            return this.$route.name
          case 'fee':
            return 'cost_list' + this.$route.name
          case 'patent':
            return 'patentFeeIndex'
          case 'traw':
            return 'traw-sheet-list'
          default:
            return this.$route.name
        }
      }
    },
    watch: {
      pattern:{
        handler(n,o){
          if(n){
            // this.$store.commit('app/TOGGLE_SIDEBAR',false)

          } else {
           // this.$store.commit('app/TOGGLE_SIDEBAR',true)
          }
        },
        immediate:true
      },
      // belongToDate: {
      //   handler(n) {
      //     this.activeName = ''
      //     this.$nextTick(() => {
      //       this.activeName = 'date'
      //     })
      //   },
      //   immediate: false
      // },
    },
    data() {
      return {
        statementDropBtn: [
          {
            key: 'custCountry',
            label: '负责的国内欠款客户',
            value: '国内'
          },
          {
            key: 'custCountry',
            label: '负责的国际欠款客户',
            value: '国际'
          },
          {
            key: 'isAll',
            label: '负责欠款超一年客户',
            value: 4
          },
        ],
        paymentDeptName: '',
        fullname: '',
        focusState: false,
        paymentDeptId: 0,
        payCompanyList: [],
        belongToDate: '',
        activeName: 'search'
      }
    },
    components: {
      ExchangeRateSearch,
      TrawSearch,
      OutsidePriceSearch,
      ManualSearch,
      SearchContent,
      ViewsSwitching
    },
    created() {

    },
    mounted() {

    },
    methods: {
      todayPay(){ // 当日tab
        // statusDates当日支付
        if(this.activeName == '当日支付')return;
        this.activeName = '当日支付'
        switch (this.type) {
          case 'fee':
            this.belongToDate = ''
            dispatcher(this.ctx)('FEE_SEARCH', 1, {statusDates: this.$wUtil.getDate('', 'day')})
            break
          case 'invoice_opener':
            this.belongToDate = ''
            dispatcher(this.ctx)('INVOICE_OPENER_SEARCH', 1, {execDateOut: this.$wUtil.getDate('', 'day')})
            break
        }
      },
      // 今日外借发票tab
      todayPayBorrow(type) {
        if (type == 1) {
          this.activeName='今日欠票'
          dispatcher(this.ctx)('INVOICE_BORROW_SEARCH', 1, {borrowDate: this.$wUtil.getDate('', 'day')});
        }else if (type == 2) {
          this.activeName='今日核销'
          dispatcher(this.ctx)('INVOICE_BORROW_SEARCH', 1, {hxDate: this.$wUtil.getDate('', 'day')});
        }else if (type == 3) {
          this.activeName='还票待核销'
          dispatcher(this.ctx)('INVOICE_BORROW_SEARCH', 1, {mType: 1});
        } else if (type == 4) {
          this.activeName = '超期欠票'
          dispatcher(this.ctx)('INVOICE_BORROW_SEARCH', 1, {mType: 2});
        }
      },
      changeStatementSearch(item){
        if(item.value == this.activeName)return;
        this.activeName = item.value
        dispatcher(this.ctx)('STATEMENT_SEARCH', 1, {[item.key]: item.value})
      },
      changePattern(e) {
        if (e === 1) {
          this.$store.commit('user/SET_PATTERN', false)
        } else {
          this.$store.commit('user/SET_PATTERN', true)
        }
      },
      async initData() {
        if (this.type == 'fee') {
          queryCompanyByPermission().then(res => {
            this.payCompanyList = res.data
            if(this.paymentDeptId){
             this.paymentDeptName = this.payCompanyList.find(item => item.deptId == this.paymentDeptId) && this.payCompanyList.find(item => item.deptId == this.paymentDeptId).companyShortName || '更多'
            }else{
              this.paymentDeptName = this.payCompanyList[0].companyShortName || '更多'
              this.paymentDeptId = this.payCompanyList[0].deptId
              // this.ctx.$refs.costList.$data.queryModuleData.paymentDeptIdOut = this.payCompanyList[0].deptId
            }
          })
        } else if (this.type == 'collect') {
          queryPayAccountByPermission().then(res => {
            this.payCompanyList = res.data || []
            if(this.paymentDeptId){
             this.paymentDeptName = this.payCompanyList.find(item => item.payAccountId == this.paymentDeptId) && this.payCompanyList.find(item => item.payAccountId == this.paymentDeptId).payAccountName || '更多'
            }else{
              this.paymentDeptName = this.payCompanyList[0].payAccountName || '更多'
              this.paymentDeptId = this.payCompanyList[0].payAccountId
              // this.ctx.$refs.collectionList.$data.queryModuleData.payAccountIdOut = this.payCompanyList[0].payAccountId
            }
          })
        } else if(['invoice_opener','invoice_library'].includes(this.type)) {
          // 获取发票公司 queryReceiptCompany repCompId（发票所属公司id）/ shortname （公司简称）
          queryReceiptCompany().then(res => {
            this.payCompanyList = res.data
            if(this.paymentDeptId){
              this.paymentDeptName = this.payCompanyList.find(item => item.repCompId == this.paymentDeptId) && this.payCompanyList.find(item => item.repCompId == this.paymentDeptId).shortname || '更多'
              this.fullname = this.payCompanyList.find(item => item.repCompId == this.paymentDeptId) && this.payCompanyList.find(item => item.repCompId == this.paymentDeptId).fullname
            }else{
              this.paymentDeptName = this.payCompanyList[0].shortname || '更多'
              this.fullname = this.payCompanyList[0].fullname
              this.paymentDeptId = this.payCompanyList[0].repCompId
            }
          })

        }
      },
      changeDatePick(n) {
        console.log('changeDatePick',n)
        if (!n) return;
        this.activeName = 'more'
        if (this.type == 'fee') {
          this.ctx.$refs.costList.$data.currentYear = n.slice(0, 4)
          this.ctx.$refs.costList.$data.currentMonth = n.slice(5)
          this.ctx.$refs.costList.changeBelongDate({deptId: this.paymentDeptId})
        } else if (this.type == 'collect') {
          this.ctx.$refs.collectionList.$data.currentYear = n.slice(0, 4)
          this.ctx.$refs.collectionList.$data.currentMonth = n.slice(5)
          this.ctx.$refs.collectionList.changeBelongDate({payAccountId: this.paymentDeptId})
        } else if (this.type == 'invoice_opener') {
          this.ctx.$refs.invoiceOpenerList.$data.currentYear = n.slice(0, 4)
          this.ctx.$refs.invoiceOpenerList.$data.currentMonth = n.slice(5)
          this.ctx.$refs.invoiceOpenerList.changeBelongDate({repCompId: this.paymentDeptId})
        }

      },
      changeCompany({deptId, payAccountId, repCompId, payAccountName, companyShortName, shortname, fullname }) {
        if (this.type == 'fee') {
          if(this.paymentDeptId !== deptId || !this.belongToDate){
            this.belongToDate = this.$wUtil.getDate('', 'month')
          }
          this.paymentDeptId = deptId
          companyShortName && (this.paymentDeptName = companyShortName)
          // this.ctx.$refs.costList.$data.queryModuleData.paymentDeptIdOut = this.paymentDeptId
          this.ctx.$refs.costList.changeCompany({deptId})
        } else if (this.type == 'collect') {
          if(this.paymentDeptId !== payAccountId || !this.belongToDate){
            this.belongToDate = this.$wUtil.getDate('', 'month')
          }
          this.paymentDeptId = payAccountId
          payAccountName && (this.paymentDeptName = payAccountName)
          // this.ctx.$refs.collectionList.$data.queryModuleData.payAccountIdOut = this.paymentDeptId
          this.ctx.$refs.collectionList.changeCompany({payAccountId})
        } else if (this.type == 'invoice_opener') {
          if(this.paymentDeptId !== repCompId || !this.belongToDate){
            this.belongToDate = this.$wUtil.getDate('', 'month')
          }
          this.paymentDeptId = repCompId
          shortname && (this.paymentDeptName = shortname)
          this.ctx.$refs.invoiceOpenerList.changeCompany({repCompId})
        } else if (this.type == 'invoice_library') {
          if(this.paymentDeptId !== repCompId || !this.belongToDate){
            this.belongToDate = this.$wUtil.getDate('', 'month')
          }
          this.paymentDeptId = repCompId
          shortname && (this.paymentDeptName = shortname)
          fullname && (this.fullname = fullname)
          this.ctx.$refs.invoiceLibraryList.changeCompany({repCompId: repCompId, fullname: fullname})
        }
        this.activeName = ''
        this.$nextTick(() => {
          this.activeName = 'more'
        })
      },
      searchTab() {
        this.activeName = 'search'
        this.$refs.search.handleSearch()
      },
      moreTab() {
        if (this.type == 'fee' && !this.paymentDeptId) {
          this.paymentDeptId = this.payCompanyList[0].deptId
          // this.paymentDeptName = this.payCompanyList[0].companyShortName
        }
        if (this.type == 'collect' && !this.paymentDeptId) {
          this.paymentDeptId = this.payCompanyList[0].payAccountId
          // this.paymentDeptName = this.payCompanyList[0].payAccountName
        }
        if (['invoice_opener', 'invoice_library'].includes(this.type) && !this.paymentDeptId) {
          this.paymentDeptId = this.payCompanyList[0].repCompId
        }
        // this.changeCompany({deptId: this.paymentDeptId, payAccountId: this.paymentDeptId})
      },
      tabSearch(item) { // 任务区 tab
        this.activeName = item.name
        if (['more', 'search', 'date'].includes(item.name)) return
        const obj = {}
        obj[JSON.parse(item.name).key] = JSON.parse(item.name).value
        switch (this.type) {
          case 'bill':
            if (JSON.parse(item.name).key == 'belongToDateArrayOut') {
              if (JSON.parse(item.name).label == '本月账单') {
                // alert(2)
                // obj[JSON.parse(item.name).key] = [this.$wUtil.getDate('', 'month', '-'), this.$wUtil.getDate('', 'month', '-')]
              }
              if (JSON.parse(item.name).label == '本组年度') {
                obj[JSON.parse(item.name).key] = 1
              }
            }
            dispatcher(this.ctx)('BILL_SEARCH', 1, obj)
            break
          case 'fee':
            this.ctx.$refs.costList.changeFeeStatus()
            this.paymentDeptId = this.payCompanyList[0].deptId
            this.paymentDeptName = this.payCompanyList[0].companyShortName
            this.belongToDate = ''
            dispatcher(this.ctx)('FEE_SEARCH', 1, obj)
            break
          case 'borrow':
            dispatcher(this.ctx)('BORROW_SEARCH', 1, obj);
            break;
          case 'invoice_opener':
            this.ctx.$refs.invoiceOpenerList.changeStatus()
            this.paymentDeptId = this.payCompanyList[0].repCompId
            this.paymentDeptName = this.payCompanyList[0].shortname
            this.belongToDate = ''
            dispatcher(this.ctx)('INVOICE_OPENER_SEARCH', 1, obj);
            break;
          case 'invoice_borrow':
            dispatcher(this.ctx)('INVOICE_BORROW_SEARCH', 1, obj);
            break;
          case 'invoice_library':
            this.ctx.$refs.invoiceLibraryList.changeStatus()
            this.paymentDeptId = this.payCompanyList[0].repCompId
            this.paymentDeptName = this.payCompanyList[0].shortname
            this.belongToDate = ''
            dispatcher(this.ctx)('INVOICE_LIBRARY_SEARCH', 1, obj);
            break;
          case 'collect':
            if (JSON.parse(item.name).key == 'createDateArray') {
              if (JSON.parse(item.name).label == '本月收款') {
                obj[JSON.parse(item.name).key] = [this.$wUtil.getDate('', 'month', '-') +'-01', this.$commonUtils.getEndDate( this.$commonUtils.getEndDate( this.$wUtil.getDate('', 'month', '-') +'-01', 1, '月'), -1, '天')]
              }
            }
            this.paymentDeptId = this.payCompanyList[0].payAccountId
            this.paymentDeptName = this.payCompanyList[0].payAccountName
            this.belongToDate = ''
            dispatcher(this.ctx)('COLLECTION_SEARCH', 1, obj)
            break;
          case 'statement':
            dispatcher(this.ctx)('STATEMENT_SEARCH', 1, obj)
            break;
          case 'outBill':
            dispatcher(this.ctx)('OUTBILL_SEARCH', 1, obj);
            break;
          case 'insideBill':
            dispatcher(this.ctx)('INSIDE_BILL_SEARCH', 1, obj);
            break;
          default:
            break
        }
      },
      queryList({data, searchType}) {
        this.activeName = 'search'
        switch (this.type) {
          case 'bill':
            dispatcher(this.ctx)('BILL_SEARCH', searchType, data)
            break
          case 'fee':
            if(searchType === 0){
              this.ctx.$refs.costList.changeFeeStatus()
              this.paymentDeptId = this.payCompanyList[0].deptId
              this.paymentDeptName = this.payCompanyList[0].companyShortName
              this.belongToDate = ''
            }
            dispatcher(this.ctx)('FEE_SEARCH', searchType, data)
            break
          case 'borrow':
            dispatcher(this.ctx)('BORROW_SEARCH', searchType, data);
            break;
          case 'invoice_opener':
            if(searchType === 0){
              this.paymentDeptId = this.payCompanyList[0].repCompId
              this.paymentDeptName = this.payCompanyList[0].shortname
              this.belongToDate = ''
            }
            dispatcher(this.ctx)('INVOICE_OPENER_SEARCH', searchType, data);
            break;
          case 'invoice_borrow':
            dispatcher(this.ctx)('INVOICE_BORROW_SEARCH', searchType, data);
            break;
          case 'invoice_library':
            if(searchType === 0){
              this.paymentDeptId = this.payCompanyList[0].repCompId
              this.paymentDeptName = this.payCompanyList[0].shortname
              this.belongToDate = ''
            }
            dispatcher(this.ctx)('INVOICE_LIBRARY_SEARCH', searchType, data);
            break;
          case 'collect':
            if(searchType === 0){
              this.paymentDeptId = this.payCompanyList[0].payAccountId
              this.paymentDeptName = this.payCompanyList[0].payAccountName
              this.belongToDate = ''
            }
            dispatcher(this.ctx)('COLLECTION_SEARCH', searchType, data);
            break;
          case 'statement':
            dispatcher(this.ctx)('STATEMENT_SEARCH', searchType, data);
            break;
          case 'patent':
            dispatcher(this.ctx)('PATENT_SEARCH', searchType, data);
            break;
          case 'outPrice':
            dispatcher(this.ctx)('OUTPRICE_SEARCH', searchType, data);
            break;
          case 'outBill':
            dispatcher(this.ctx)('OUTBILL_SEARCH', searchType, data);
            break;
          case 'insideBill':
            dispatcher(this.ctx)('INSIDE_BILL_SEARCH', searchType, data);
            break;
          case 'traw':
            dispatcher(this.ctx)('TRAW_SEARCH', searchType, data);
            break;
          case 'exchangeRate':
            dispatcher(this.ctx)('EXCHANGE_RATE_SEARCH', searchType, data);
            break
          default:
            break
        }
        this.setActiveName(data, searchType)
      },
      async setActiveName(data, searchType) {
        if (searchType !== undefined) return;
        if (this.tabList.find(item => data[item.key] == item.value)) {
          this.activeName = JSON.stringify(this.tabList.find(item => data[item.key] == item.value))
        }
        // if (searchType === undefined) {
        //   if (this.tabList.find(item => data[item.key] == item.value)) {
        //     this.activeName = JSON.stringify(this.tabList.find(item => data[item.key] == item.value))
        //   }
        // }
        switch (this.type) {
          case 'statement':
            if (this.statementDropBtn.find(item => data[item.key] == item.value)) {
              this.activeName = this.statementDropBtn.find(item => data[item.key] == item.value).value
            }
            break;
          case 'bill':
            if (data['belongToDateArrayOut'] && data['belongToDateArrayOut'][0]) {
              if (data['belongToDateArrayOut'][0] == data['belongToDateArrayOut'][1]) {
                this.activeName = JSON.stringify({
                  key: 'belongToDateArrayOut',
                  label: '本月账单',
                  value: []
                })
              }
            }
            break;
          case 'invoice_opener':
            if (data['execDateOut']) {
              this.activeName = '当日开具'
            }
            if (data['repCompIdOut']) {
              this.paymentDeptId = data['repCompIdOut']
              // this.activeName = 'more'
            }
            if (data['belongtoDateBeginOut']) {
              this.$nextTick(() => {
                this.belongToDate = data['belongtoDateBeginOut']
                this.activeName = 'more'
              })
            }
            break;
          case 'invoice_borrow':
            if (data['borrowDate']) {
              this.activeName = '今日欠票'
            }
            if (data['hxDate']) {
              this.activeName = '今日核销'
            }
            if (data['mType']) {
              this.activeName = '还票待核销'
            }
            break;
          case 'fee':
            if (data['statusDates']) {
              this.activeName = '当日支付'
            }
            if (data['paymentDeptIdOut']) {
              this.paymentDeptId = data['paymentDeptIdOut']
              // this.activeName = 'more'
            }
            if (data['belongtoDateBeginOut']) {
              this.$nextTick(() => {
                this.belongToDate = data['belongtoDateBeginOut']
                this.activeName = 'more'
              })
            }
            break;
          case 'collect':
            if (data['createDateArray'] && data['createDateArray'].length) {
              this.activeName = JSON.stringify({
                key: 'createDateArray',
                label: '本月收款',
                value: []
              })
            }
            if (data['payAccountIdOut']) {
              this.paymentDeptId = data['payAccountIdOut']
              // this.activeName = 'more'
            }
            if (data['belongtoDateBeginOut']) {
              this.$nextTick(() => {
                this.belongToDate = data['belongtoDateBeginOut']
                this.activeName = 'more'
              })
            }
            break;
          case 'invoice_library':
            if (data['paymentDeptIdOut']) {
              this.paymentDeptId = data['paymentDeptIdOut']
            }
            break;
          default:
            break;
        }
        await this.initData()
      },
      changeState() {
        this.$refs.search.openOrClose()
      }
    }
  }
</script>

<style lang="scss" scoped>
  > > > .el-tabs__content {
    padding: 0;
    height: 0;
    overflow: visible;
  }

  .btns {
    display: flex;
    align-items: center;
    /*justify-content: space-around;*/
    .el-icon-search {
      /*margin-right: 5px;*/
    }

    .el-icon-arrow-down {
      /*width: 30px;*/
      margin-left: 15px;
    }
  }

  > > > .el-tabs__item.is-active {
    .el-input__inner {
      color: #409EFF;
    }
  }

  .dateInput {
    > > > .el-input {
      width: 120px;
      color: #909399;

      .el-input__inner {
        background-color: transparent;
      }

      input {
        border: none;
      }
    }
  }

  .companyBox {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;

    .el-tag {
      width: 70px;
      margin: 5px;
      cursor: pointer;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .isActive {
      background-color: #409EFF;
      color: #fff;
    }
  }

  .outTabs {
    display: flex;
    justify-content: left;
    align-items: center;

    .search, .date, .more {
      display: flex;
      align-items: center;
      margin: -1px 0 0 -1px;
      height: 40px;
      transition: all .3s cubic-bezier(.645, .045, .355, 1);
      border: 1px solid transparent;
      color: #909399;
      /*background: #FFF;*/
      border: 1px solid #DCDFE6;
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .12), 0 0 6px 0 rgba(0, 0, 0, .04);
      background-color: #f5f7fa;
      border-bottom: 1px solid #E4E7ED;
      font-size: 14px;
      border-right: none;
    }

    .date, .more {
      border-left: none;
      border-right: 1px solid #DCDFE6;
      overflow: hidden;
      margin: -1px 0 0 -1px;
      height: 40px;
    }

    .more {
      border-right: none;
    }

    .el-tabs {
      border-right: none;
      border-left: none;
    }
  }
  .ViewsSwitching {
    position: absolute;
    right: 10px;
    z-index: 100;
    /*top: 10px;*/
  }
  .statement{
    .statement-item{
      cursor: pointer;
      height: 30px;
      line-height: 30px;
      text-align: center;
    }
    .isActive{
      background-color: #409EFF;
      color: #fff;
    }
  }
  .today{
    width: 100%;
    text-align: center;
    height: 40px;
    line-height: 42px;
    cursor:pointer;
    &:hover{
      color: #409EFF;
    }
  }
</style>
