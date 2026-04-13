<template>
  <div v-clickoutside="clickoutside">
    <div class="queryButton" id="queryButton" style="margin: 0 auto">
      <div class="buttonWrap_small">
        <div class="button-group-search">
          <!--          <el-button id="mySearch" type="primary" size="mini" @click="handleSearch(0)">搜索</el-button>-->
          <!--          <el-button type="primary" style="margin-left:0" class="searchRight" size="mini" icon="el-icon-arrow-down"-->
          <!--                     @click.stop.prevent="drawerState= !drawerState"></el-button>-->
          <transition name="show" mode="out-in">
            <div class="searchWrap" id="searchWrap" v-show="drawerState">
              <div class="form-container">
                <el-form size="mini" label-width="120px" style="margin-top: 2px">
                  <el-form-item :label="item.filterName+':'"
                                :class="item.filterType==='radio'&&item.values.length>3?'fullItem':'postInfo-container-item'"
                                v-for="(item,index) in conditionsModuleList" :key="index">
                    <el-select v-model="queryModuleData[item.property]" placeholder="请选择"
                               v-if="item.filterType==='select'" filterable clearable>
                      <el-option v-for="itm in item.values" :key="itm.id" :label="itm.value" :value="itm.id">
                      </el-option>
                    </el-select>

                    <el-select v-if="item.filterType==='checkbox'&&item.values&&item.values.length"
                               v-model="queryModuleData[item.property]" multiple placeholder="请选择" filterable clearable
                               @change="(e)=>checkBox(e,item.property,item.values)">
                      <el-option v-for="itm in item.values" :key="itm.id" :label="itm.value" :value="itm.id">
                      </el-option>
                    </el-select>
                    <el-select v-if="item.filterType==='selectMany'" v-model="queryModuleData[item.property]" filterable
                               remote clearable reserve-keyword placeholder="请输入关键词" :remote-method="(queryString)=>{
            remoteMethod(queryString,index,item.property,item.filterName);
            }">
                      <el-option v-for="itm in item['valueList']" :key="itm.id" :label="itm.value" :value="itm.id">
                      </el-option>
                    </el-select>
                    <template v-if="type == 'bill'">
                      <template v-if="item.filterType==='selectMultipleMany' && item.property === 'custIdList'">
                        <el-select v-if="item.filterType==='selectMultipleMany' && !isDim" multiple
                                   v-model="queryModuleData[item.property]" filterable remote clearable reserve-keyword
                                   placeholder="请输入关键词" :remote-method="(queryString)=>{
            remoteMethod(queryString,index,item.property,item.filterName);
            }">
                          <el-option v-for="itm in item['valueList']" :key="itm.id" :label="itm.value" :value="itm.id">
                          </el-option>
                        </el-select>
                        <el-input v-if="isDim" type="text" placeholder="请输入客户关键字"
                                  v-model="queryModuleData.custName"></el-input>
                        <el-checkbox :true-label="1" :false-label="0" v-model="isDim" label="模糊"></el-checkbox>
                      </template>
                      <el-select v-if="item.filterType==='selectMultipleMany' && item.property !== 'custIdList'"
                                 multiple
                                 v-model="queryModuleData[item.property]" filterable remote clearable reserve-keyword
                                 placeholder="请输入关键词" :remote-method="(queryString)=>{
            remoteMethod(queryString,index,item.property,item.filterName);
            }">
                        <el-option v-for="itm in item['valueList']" :key="itm.id" :label="itm.value" :value="itm.id">
                        </el-option>
                      </el-select>
                    </template>
                    <template v-else>
                      <el-select v-if="item.filterType==='selectMultipleMany'" multiple
                                 v-model="queryModuleData[item.property]" filterable remote clearable reserve-keyword
                                 placeholder="请输入关键词" :remote-method="(queryString)=>{
            remoteMethod(queryString,index,item.property,item.filterName);
            }">
                        <el-option v-for="itm in item['valueList']" :key="itm.id" :label="itm.value" :value="itm.id">
                        </el-option>
                      </el-select>
                    </template>
                    <el-select v-if="item.filterType==='selectTableMany'" v-model="queryModuleData[item.property]"
                               filterable remote clearable reserve-keyword placeholder="请输入关键词" :remote-method="(queryString)=>{
            remoteMethod(queryString,index,item.property,item.filterName); }">
                      <el-option disabled label="" value="">
            <span
              v-for="(itmx,key) in getAppTitleList(item.filterName,item['valueList']?item['valueList'][0]:undefined)"
              v-if="key!='id'">
            {{itmx}}
            </span>
                      </el-option>
                      <el-option v-for="(itm,idx) in item['valueList']" :key="itm.id" :label="itm.value"
                                 :value="itm.id">
                        <el-tooltip v-for="(itmx,key) in item['valueList'][idx]" v-if="key!='id'" class="item"
                                    effect="light" :content="itmx" placement="top">
                          <span>{{itmx}}</span>
                        </el-tooltip>
                      </el-option>
                    </el-select>
                    <el-select v-if="item.filterType==='selectTableMultipleMany'"
                               v-model="queryModuleData[item.property]" multiple filterable remote clearable
                               reserve-keyword placeholder="请输入关键词" :remote-method="(queryString)=>{
            remoteMethod(queryString,index,item.property,item.filterName); }">
                      <el-option disabled label="" value="">
            <span
              v-for="(itmx,key) in getAppTitleList(item.filterName,item['valueList']?item['valueList'][0]:undefined)"
              v-if="key!='id'">
            {{itmx}}
            </span>
                      </el-option>
                      <el-option v-for="(itm,idx) in item['valueList']" :key="itm.id" :label="itm.value"
                                 :value="itm.id">
                        <el-tooltip v-for="(itmx,key) in item['valueList'][idx]" v-if="key!='id'" class="item"
                                    effect="light" :content="itmx" placement="top">
                          <span>{{itmx}}</span>
                        </el-tooltip>
                      </el-option>
                    </el-select>
                    <el-select v-if="item.filterType==='selectMultipleManyTable'" multiple
                               v-model="queryModuleData[item.property]" filterable remote clearable
                               placeholder="请输入关键词"
                               :remote-method="(queryString)=>{
            remoteMethod(queryString,index,item.property,item.filterName); }">
                      <el-option disabled label="" value="-1">
            <span
              v-for="(itmx,key) in getAppTitleList(item.filterName,item['valueList']?item['valueList'][0]:undefined)"
              v-if="key!='id'">
            {{itmx}}
            </span>
                      </el-option>
                      <el-option v-for="(itm,idx) in item['valueList']" :key="idx" :label="itm.value" :value="itm.id">
                        <el-tooltip v-for="(itmx,key) in item['valueList'][idx]" v-if="key!='id'" :key="key"
                                    class="item" effect="light" :content="itmx" placement="top">
                          <span>{{itmx}}</span>
                        </el-tooltip>
                      </el-option>
                    </el-select>
                    <el-autocomplete
                      v-if="item.filterType==='autocomplete'"
                      v-model="queryModuleData[item.property]"
                      :fetch-suggestions="(queryString,cb)=>querySearchAsync(queryString, index, item.property, item.filterName,cb)"
                      placeholder="请输入内容"
                      filterable
                      :popper-append-to-body="false"
                    >
                      <template slot-scope="{ item }">
                        <div class="name_wrap" :class="item.id==-1?'firstName_wrap':''">
                          <el-tooltip class="item" effect="light" :content="item.value" placement="top">
                            <div :class="item.id==-1?'name0':'name'">{{ item.value }}</div>
                          </el-tooltip>
                          <el-tooltip class="item" effect="light" :content="item.value1" placement="top">
                            <div :class="item.id==-1?'name0':'name'">{{ item.value1 }}</div>
                          </el-tooltip>
                          <el-tooltip class="item" effect="light" :content="item.value2" placement="top">
                            <div :class="item.id==-1?'name0':'name'">{{ item.value2 }}</div>
                          </el-tooltip>
                          <el-tooltip class="item" effect="light" :content="item.value3" placement="top">
                            <div :class="item.id==-1?'name0':'name'">{{ item.value3 }}</div>
                          </el-tooltip>
                        </div>
                      </template>
                    </el-autocomplete>
                    <el-select v-if="item.filterType==='selectTable'" v-model="queryModuleData[item.property]"
                               filterable clearable placeholder="请选择">
                      <el-option v-for="(itm ,idx) in item.values" :key="idx" :label="itm.value" :value="itm.id"
                                 :disabled="itm.id==-1">
                        <span v-for="(itmx ,key) in item['values'][idx]" v-if="key!='id'">{{itmx}}</span>
                      </el-option>
                    </el-select>
                    <el-radio-group v-model="queryModuleData[item.property]" v-if="item.filterType==='radio'">
                      <el-radio :label="itm.id" v-for="(itm,index) in item.values" :key="index">{{itm.value}}</el-radio>
                    </el-radio-group>
                    <el-input clearable v-model="queryModuleData[item.property]" :placeholder="'请输入'+item.filterName"
                              v-if="item.filterType==='text'"></el-input>
                    <el-input clearable v-model="queryModuleData[item.property]" :placeholder="'请输入'+item.filterName"
                              type="textarea" v-if="item.filterType==='textarea'"></el-input>
                    <el-input clearable v-model="queryModuleData[item.property.split(',')[0]]"
                              :placeholder="'请输入'+item.filterName" v-if="item.filterType==='textRange'"
                              @change="(string)=>changeTextRange(string,index,item.property)"></el-input>
                    <span v-if="item.filterType==='textRange'" v-show="item.property.includes(',')">至</span>
                    <el-input clearable v-model="queryModuleData[item.property.split(',')[1]]"
                              :placeholder="'请输入'+item.filterName" v-if="item.filterType==='textRange'"></el-input>
                    <DataPicker class="DataPicker" v-if="item.filterType==='date'"
                                v-model="queryModuleData[item.property]"></DataPicker>
                    <DateMonthPicker class="DataPicker" v-if="item.filterType==='dateMonth'"
                                     v-model="queryModuleData[item.property]"></DateMonthPicker>
                    <!--<el-date-picker v-if="item.filterType==='date'" v-model="queryModuleData[item.property.split(',')[0]]" type="date" placeholder="开始日期">-->
                    <!--</el-date-picker>-->
                    <!--<span v-if="item.filterType==='date'" v-show="item.property.includes(',')">至</span>-->
                    <!--<el-date-picker v-if="item.filterType==='date'" v-show="item.property.includes(',')" v-model="queryModuleData[item.property.split(',')[1]]" type="date" placeholder="结束日期">-->
                    <!--</el-date-picker>-->
                    <el-multi-cascader
                      ref="multiCascader"
                      :class="item.property"
                      v-if="item.filterType==='cascader'"
                      :show-all-levels="false"
                      :options="item.values"
                      multiple
                      filterable
                      clearable
                      :props="item.props"

                      change-on-select
                      selectChildren
                      v-model="queryModuleData[item.property]"></el-multi-cascader>
                    <!--                  <el-cascader :change-on-select="true" :show-all-levels="false" v-if="item.filterType==='cascader'" collapse-tags filterable clearable v-model="queryModuleData[item.property]"-->
                    <!--                               :options="item.values" :props="defaultParams" placeholder="请选择"></el-cascader>-->
                  </el-form-item>
                </el-form>
              </div>

              <div class="clearWrap" v-show="drawerState">
                <!--                <el-popover-->
                <!--                  placement="top"-->
                <!--                  width="300"-->
                <!--                  v-model="addFilterState">-->
                <!--                  <div>过滤器名称</div>-->
                <!--                  <div>-->
                <!--                    <el-input type="text" v-model="schemeName"></el-input>-->
                <!--                  </div>-->
                <!--                  <div style="text-align: right; margin: 0">-->
                <!--                    <el-button size="mini" type="text" @click="addFilterState = false">取消</el-button>-->
                <!--                    <el-button type="primary" size="mini" @click="addFilterScheme(2)">确定</el-button>-->
                <!--                  </div>-->
                <!--                  <el-button size="mini" slot="reference"><span>保存</span></el-button>-->
                <!--                </el-popover>-->

                <el-button size="mini" @click="clearSearch"><span>重置</span></el-button>
                <el-button type="primary" size="mini" @click="handleSearch(0)">搜索</el-button>
              </div>
              <el-button id="more" style="position:absolute;top: 10px;right: 10px" type="text" size="mini"
                         @click="queryFilter">
                <i class="el-icon-s-tools"></i>更多
              </el-button>
            </div>
          </transition>
        </div>
      </div>
    </div>

    <el-dialog title="提示" append-to-body :modal="true" :visible.sync="transferVisible" width="80%">
      <el-transfer v-model="transferValue" :key="transferData.filterId"
                   :data="transferData" filterable filter-placeholder="请输入搜索内容"
                   :titles="['选择筛选项—全部案件', '已选']">
      </el-transfer>
      <span slot="footer" class="dialog-footer">
        <el-button @click="transferVisible = false">取 消</el-button>
        <el-button type="primary" @click="configFilter">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import dispatcher from '../stateManage/dispatchers'
  import {querycustSelectClass, querylyctListUrl} from "@/api/customerList.js";
  import {queryOfficialBillRecordList} from '@/api/billApi';
  import {queryAllUrl} from "@/api/applicant";
  import {
    addFilterScheme,
    delCase,
    selectColumn,
    savePreference,
    queryCaseList,
    queryPreference,
    delPreference,
    queryFilter,
    configFilter,
    queryFilterConfig,
    submitOfficalAudit,
    auditOfficalDoc,
    deleteCase,
    deleteDoc,
    deleteIns,
    queryCustomerNameId,
    getManualRecognitionOfficialInfoCount,
    recognizedError,
    getCaseByTmFileId,
    submitOfficalModify,
    queryCorrelationCaseList, copyCase, queryCaseWork,
    updateWkg,
    queryList,
    queryTrademarkCaseOfficial,
    downloadMaterial,
    queryDocs,
    queryApplicantByIdList
  } from "@/api/caseList.js";

  export default {
    name: "SearchContent",
    props: {
      ctx: {},
      name: '',
      bussId: '',
      type: ''
    },
    data() {
      return {
        isDim: 0,
        custList: [],
        childDataList: [],
        // bussId: 43,
        addFilterState: false,
        drawerState: false,
        schemeName: '',
        agentNums: '',
        listQuery: {
          pageNo: 1,
          pageSize: 10
        },
        queryModuleData: {},
        checkboxState: false, // 表头筛选框状态
        transferVisible: false, // 配置筛选条件框
        transferData: [], // 筛选条件数据
        transferValue: [], // 当前筛选条件id
        caseList: [], // 当前列表数据
        checkCaseList: [], // 当前选中表头条件
        selectColumnList: [], // 配置表头总列数据做循环用
        preferenceList: [], // 循环表头数据
        filterData: {}, // 表头过滤数据
        conditionsModuleList: [], // 渲染筛选条件
        caseListDefault: [], // 案件默认全部列表
        checkFilterList: [], // 控制筛选漏斗状态
        firstRequest: false, //第一次请求
        payTypeList: [],
      }
    },
    created() {
      this.queryFilterConfig(1)
    },
    watch: {
      isDim(n, o) {
        this.$set(this.queryModuleData, 'custIdList', [])
        this.$set(this.queryModuleData, 'custName', '')
      },
    },
    methods: {
      querySearchAsync(value, index, property, filterName, cb) {
        if (value && ["被申请人"].includes(filterName)) {
          querylyctListUrl({
            fullname: value,
            pageNo: 1,
            pageSize: 100,
            isCustomer: 1
          }).then(res => {

            let list = res.data.map(item => ({
              id: item.fullname,
              value: item.fullname,
              value1: item.fullnameEn,
              value2: item.address,
              value3: item.addressEn
            }))
            cb([...[this.getAppTitleList(filterName)], ...list])
          })
        }
        cb([])
      },
      openOrClose() {
        this.drawerState = !this.drawerState
      },
      clickClose(e) {
        e.target.id == 'outBox' || e.target.id == 'queryButton' ? this.drawerState = false : '';
      },
      queryRecordList() {
        queryOfficialBillRecordList({
          payListType: 1826,
          ...this.queryModuleData
        }).then(res => {
          this.childDataList = res.data
        })
      },
      checkBox(e, property, values) {
        if (this.queryModuleData[property].includes('') && this.queryModuleData[property].filter(item => item).length != values.filter(item => item).length) {
          this.queryModuleData[property] = this.queryModuleData[property].filter(item => item)
        }
        if (e[e.length - 1] == '') {
          this.queryModuleData[property] = values.map(item => item.id)
        }
      },
      clearSearch() {
        switch (this.type) {
          case 'bill':
            dispatcher(this.ctx)('BILL_CLEAR_SEARCH', this);
            for (var key in this.queryModuleData) {
              if (key.includes('Ids') || key=='billStyleArr') {
                this.$set(this.queryModuleData, key, [])
              }
            }
            break;
          case 'fee':
            dispatcher(this.ctx)('FEE_CLEAR_SEARCH', this);
            break;
          case 'collect':
            dispatcher(this.ctx)('COLLECTION_CLEAR_SEARCH', this);
            break;
          case 'borrow':
            dispatcher(this.ctx)('BORROW_CLEAR_SEARCH', this);
            break;
          case 'invoice_borrow':
            dispatcher(this.ctx)('INVOICE_BORROW_CLEAR_SEARCH', this);
            break;
          case 'invoice_opener':
            dispatcher(this.ctx)('INVOICE_OPENER_CLEAR_SEARCH', this);
            break;
          case 'invoice_library':
            dispatcher(this.ctx)('INVOICE_LIBRARY_CLEAR_SEARCH', this);
            break;
          case  'patent':
            this.patentClearSearch()
            break;
          case 'insideBill':
            dispatcher(this.ctx)('INSIDE_BILL_CLEAR_SEARCH', this);
            break;
          case 'outBill':
            dispatcher(this.ctx)('OUTBILL_CLEAR_SEARCH', this);
            break;
          default:
            break;
        }
        
        // if (this.$refs.multiCascader) {
        //   this.$refs.multiCascader.forEach(item => {
        //     item.$el.querySelector('.el-input__inner').value = ''
        //   })
        // }
      },
      patentClearSearch() {
        for (var key in this.queryModuleData) {
          if (key.includes('Date')) {
            this.$set(this.queryModuleData, key, ['', ''])
          } else if (key.includes('Array')) {
            this.$set(this.queryModuleData, key, [])
          } else if (key === 'caseTypeIds' || key === 'deptGroupIds' || key === 'billStyleArr') {
            this.$set(this.queryModuleData, key, [])
          } else {
            this.$set(this.queryModuleData, key, null)
          }
        }
        if (this.$refs.multiCascader) {
          this.$refs.multiCascader.forEach(item => {
            item.$el.querySelector('.el-input__inner').value = ''
          })
        }
      },
      queryFilter() {
        this.transferVisible = true;
        const data = {
          bussId: this.bussId
        };
        queryFilter(data).then(res => {
          this.transferData = res.data
          if (this.type === 'bill' && !this.$store.getters.permissions.includes(433)) {
            this.transferData = this.transferData.filter(j => j.filterName !== '我方账户')
          }
          this.transferData = this.generateData(this.transferData);
        });
      },
      generateData(arr) {
        arr.forEach(item => {
          item.key = item.filterId;
          item.label = item.filterName;
        });
        return arr;
      },
      configFilter() {
        const data = {
          bussId: this.bussId,
          filterIds: this.transferValue.join(",")
        };
        configFilter(data).then(res => {
          this.queryFilterConfig();
        });
      },
      defaultQuerySearch() {
        this.queryModuleData = JSON.parse(localStorage.getItem('queryModuleData')) ? JSON.parse(localStorage.getItem('queryModuleData')).find(item => item.name == this.name) ? JSON.parse(localStorage.getItem('queryModuleData')).find(item => item.name == this.name).queryModuleData : {} : {}
        if (this.queryModuleData.custName) {
          const custName = this.queryModuleData.custName
          this.isDim = 1
          this.$nextTick(() => {
            this.$set(this.queryModuleData, 'custName', custName)
          })
        }
        if (this.type === 'bill' && !this.$store.getters.permissions.includes(433)) {
          this.queryModuleData.payAccountId = undefined
        }
      },
      queryFilterConfig(type) {
        const data = {
          bussId: this.bussId
        };
        this.conditionsModuleList = []
        queryFilterConfig(data).then(res => {
          this.transferVisible = false;
          this.$nextTick(() => {
            this.conditionsModuleList = res.data;
            if (this.type === 'bill' && !this.$store.getters.permissions.includes(433)) {
              this.conditionsModuleList = this.conditionsModuleList.filter(j => j.filterName !== '我方账户')
            }
            let keyList = res.data.map(item => item.property)
            for (var key in this.queryModuleData) {
              if (!keyList.includes(key)) {
                if (key.includes('Date')) {
                  this.$set(this.queryModuleData, key, ['', ''])
                } else if (key.includes('Array') || key.includes('List') || key.includes('Ids')) {
                  this.$set(this.queryModuleData, key, [])
                } else {
                  this.$set(this.queryModuleData, key, null)
                }
              }
            }
            switch (this.type) {
              case 'fee':
                this.ctx.$refs.costList.$data.conditionsModuleList = this.conditionsModuleList
                this.ctx.$refs.costList.defaultQuerySearch()
                break;
              case 'bill':
                this.ctx.$refs.billList.$data.conditionsModuleList = this.conditionsModuleList
                this.ctx.$refs.billList.defaultQuerySearch()
                break;
              case 'collect':
                this.ctx.$refs.collectionList.defaultQuerySearch()
                break;
              case 'patent':
                // this.ctx.$refs.patentList.defaultQuerySearch()
                break;
              case 'outBill':
                this.ctx.$refs.overseasBillList.$data.conditionsModuleList = this.conditionsModuleList
                this.ctx.$refs.overseasBillList.defaultQuerySearch();
                break;
              case 'insideBill':
                this.ctx.$refs.insideBillList.defaultQuerySearch()
                break;
              default:
                break;
            }
            this.defaultQuerySearch()
            if (type == 1) {
              this.$emit('search', {data: this.queryModuleData, searchType: undefined})
            }
            res.data.forEach(item => {
              if (item.filterType.includes("Many")) {
                if (this.queryModuleData[item.property]) {
                  if (item.filterType.includes('Many')) {
                    if (["被申请人", "转让人"].includes(item.filterName)) {
                    } else if (item.filterName == '申请人') {
                      if (this.queryModuleData[item.property] && this.queryModuleData[item.property].length) {
                        queryApplicantByIdList({appIdArray: this.queryModuleData[item.property]}).then(res => {
                          this.$set(item, 'valueList', res.data.map(i => ({
                            id: i.appId,
                            value: i.applicantName,
                            value1: i.applicantEnName,
                            value2: i.applicantAddress,
                            value3: i.applicantEnAddress
                          })))
                        })
                      }
                    } else if (item.filterName == '客户') {
                      if (this.queryModuleData[item.property].length) {
                        queryCustomerNameId({custIdArray: this.queryModuleData[item.property]}).then(res => {
                          this.$set(item, 'valueList', res.data.map(i => ({id: i.custId, value: i.name})))
                          this.custList = item.valueList
                        })
                      }
                    } else {
                      item.valueList = item.values.filter(i => i.id == this.queryModuleData[item.property])
                    }
                  }
                } else {
                  item.valueList = []
                }
              }
              if (item.filterType.includes("checkbox")) {
                if (this.queryModuleData[item.property] && this.queryModuleData[item.property].length) {
                  this.$set(this.queryModuleData, item.property, this.queryModuleData[item.property]);
                } else {
                  this.$set(this.queryModuleData, item.property, []);
                }
              }
            });
            this.transferValue = res.data.map(item => item.filterId);
            if (this.$route.query.custId) {
              if (!this.transferValue.find(item => item == 58)) {
                this.$set(this.transferValue, this.transferValue.length - 1, 58);
                this.configFilter();
              } else {
                this.remoteMethod(
                  this.$route.query.name,
                  this.transferValue.indexOf(58),
                  "",
                  "客户"
                );
              }
            }
          });
        })
      },
      addFilterScheme(e) {
        if (e == 1) {
          this.addFilterState = true
        } else if (e == 2) {
          if (!this.schemeName || !this.schemeName.trim()) {
            this.$message.error('请输入过滤器名称')
            return
          }
          const data = {
            schemeName: this.schemeName,
            bussId: this.bussId,
            value: JSON.stringify(this.queryModuleData)
          }
          addFilterScheme(data).then(res => {
            this.addFilterState = false
          })
        }
      },
      clickoutside() {
        // alert(1)
        this.drawerState = false
      },
      handleSearch(flag) {
        // this.operationState = flag
        this.drawerState = false
        // this.selectionState = false;
        if (JSON.parse(localStorage.getItem('queryModuleData'))) {
          var arr = JSON.parse(localStorage.getItem('queryModuleData'))
        } else {
          var arr = []
        }
        if (arr.find(item => item.name == this.name)) {
          arr.find(item => item.name == this.name).queryModuleData = this.queryModuleData
        } else {
          arr.push({name: this.name, queryModuleData: this.queryModuleData})
        }
        this.type === 'patent' && localStorage.setItem('queryModuleData', JSON.stringify(arr))
        this.$emit('search', {data: this.queryModuleData, searchType: 0})
      },
      remoteMethod(value, index, property, filterName) {
        if (value && filterName === "客户") {
          queryCustomerNameId({pageNo: 1, pageSize: 100, keyword: value}).then(
            res => {
              this.custList = this.$commonUtils.unique([...new Set([...res.data.map(item => ({
                id: item.custId,
                value: item.name
              })), ...this.custList])], 'id')
              this.$set(
                this.conditionsModuleList[index],
                "valueList",
                this.custList
              );
              this.$forceUpdate();
            }
          );
        }
        if (value && filterName == '缴费类型') {
          querycustSelectClass({classId: 1149}).then(res => {
            this.$set(
              this.conditionsModuleList[index],
              "valueList",
              res.data["1149"]
            );
            this.$forceUpdate();
            // this.payTypeList = res.data["1149"]
          });
        }
        if (value && ["申请人", "被申请人", "转让人"].includes(filterName)) {
          queryAllUrl({
            applicantName: value,
            pageNo: 1,
            pageSize: 100,
            orderBy: 1
          }).then(res => {
            this.$set(
              this.conditionsModuleList[index],
              "valueList",
              res.data.map(item => ({
                id: item.appId,
                value: item.applicantName,
                value1: item.applicantEnName,
                value2: item.applicantAddress,
                value3: item.applicantEnAddress
              }))
            );
            this.$forceUpdate();
          });
        }
        if (
          value &&
          filterName !== "客户" &&
          !["申请人", "被申请人", "转让人"].includes(filterName)
        ) {
          this.$set(
            this.conditionsModuleList[index],
            "valueList",
            this.conditionsModuleList[index].values
              .filter(item =>
                item.value
                  ? item.value
                    .toLocaleUpperCase()
                    .includes(value.toLocaleUpperCase())
                  : false
              )
              .slice(0, 100)
          );
          this.$forceUpdate();
        }
      },
      changeTextRange(value, index, property) {
        this.$set(this.queryModuleData, property.split(',')[1], value);
      },
      getAppTitleList(filterName, valueList0) {
        if (filterName === "申请人") {
          return {
            id: "-1",
            value: "申请人中文名称",
            value1: "申请人英文名称",
            value2: "申请人中文地址",
            value3: "申请人英文地址",
            // disabled:true
          };
        }
        if (filterName === "申请人姓名") {
          return {
            id: "-1",
            value: "申请人中文名称",
            value1: "申请人英文名称",
            value2: "申请人中文地址",
            value3: "申请人英文地址"
          };
        }
        if (filterName === "被申请人") {
          return {
            id: "-1",
            value: "被申请人中文名称",
            value1: "被申请人英文名称",
            value2: "被申请人中文地址",
            value3: "被申请人英文地址"
          };
        }
        if (filterName === "转让人") {
          return {
            id: "-1",
            value: "转让人中文名称",
            value1: "转让人英文名称",
            value2: "转让人中文地址",
            value3: "转让人英文地址"
          };
        }
        if (filterName === "客户") {
          return {
            id: "-1",
            value: "简称",
            value1: "国籍",
            value2: "全称",
          };

        }
        return valueList0;
      },
    }
  }
</script>

<style lang="scss" scoped>
  header {
    margin-bottom: 19px;
    box-shadow: 0px 2px 5px 0px rgba(163, 163, 163, 0.35);
  }

  .queryButton {
    display: flex;
    flex-wrap: nowrap;
    position: relative;
    justify-content: center;

    .buttonWrap_small {
      display: flex;
      /*margin: 5px 5px;*/
      align-items: center;

      .el-button {
        margin-left: 10px;
      }
    }
  }

  .el-form {
    position: relative;
    display: flex;
    align-items: center;
    flex-wrap: wrap;

    .el-cascader {
      width: 100%;
    }

    /*.el-select /deep/{*/
    /*  .el-select__tags{*/
    /*    max-height: 40px;*/
    /*    overflow-y: auto;*/
    /*  }*/
    /*}*/
    /*.multi-cascader /deep/{*/
    /*  .el-cascader__label{*/
    /*    max-height: 40px;*/
    /*    overflow-y: auto*/
    /*  }*/
    /*}*/
    .postInfo-container-item {

      /deep/ .el-form-item__content {
        width: 330px;
        display: flex;
        //height: 28px;
        align-items: center;

        .el-select {
          width: 100%;
        }

        .el-input {
          width: 100%;
        }

        .el-autocomplete {
          width: 100%;

        }
      }
    }
  }

  .case_management_item {
    /*min-height: calc(100vh - 50px - 18px - 41px);*/
    display: flex;
    flex-direction: column;
    //overflow: auto;
    padding: 5px 5px;
  }

  section {
    position: relative;
    clear: both;
    flex: 1;
    //padding-bottom: 200px;
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

  .el-table {
    overflow: visible;

    /deep/ th {
      color: rgba(51, 51, 51, 1);
      background: rgba(187, 187, 187, 0.5);
    }
  }

  .el-table /deep/ th .cell {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    position: relative;
    padding-left: 10px;

    img {
      margin-left: 5px;
      width: 12px;
      cursor: pointer;
    }

  }

  .el-table /deep/ th div {
    overflow: visible;
    text-overflow: inherit;
    padding: 0;
  }

  .el-table /deep/ .el-table__header-wrapper {
    overflow: hidden;

    th {
      overflow: visible;

      .cell {
        overflow: visible;
      }
    }
  }

  .el-scrollbar li {
    display: flex;

    span {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      border-right: 1px solid #f4f4f5;
      border-bottom: 1px solid #f4f4f5;
    }
  }

  .el-transfer {
    display: flex;

    /deep/ & > .el-transfer-panel {
      flex: 1;
    }

    /deep/ .el-transfer__buttons {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    /deep/ .el-transfer-panel__list {
      display: flex;
      flex-wrap: wrap;

      label {
        width: 33.3%;
        margin-right: 0;
      }
    }
  }

  .el-dropdown {
    color: #fff;
    background-color: #409eff;
    border-color: #409eff;
    width: 66px;
    height: 32px;
    font-size: 12px;
    border-radius: 3px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 10px;
  }

  .el-menu-demo {
    display: inline-block;
    color: #fff;
    background-color: #409eff;
    border-color: #409eff;
    width: 92px;
    height: 32px;
    font-size: 12px;
    border-radius: 3px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 10px;

    &:hover {
      opacity: 0.8;
    }

    /deep/ li {
      height: 100%;
      width: 100%;

      .el-submenu__title {
        border-radius: 3px;
        background: #409eff;
        color: #fff !important;
        line-height: 32px;
        height: 100%;
        text-align: center;
        border-bottom: 0;
        padding: 0;

        i {
          color: #fff;
        }

        &:hover {
          color: #fff;
          background: #409eff;
        }
      }
    }

    //padding: 9px 15px;
  }

  .button_wrap {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 50px;

    .el-button {
      margin-left: 10px;
    }
  }

  .filterTableTmg {
    height: 100%;
  }

  .fullItem {
    width: 100%;
  }

  /deep/ .plTableBox {
    .ant-table-scroll {
      max-height: "af" !important;

      .el-table {
        height: "123" !important;
      }
    }

    .myPagination {
      display: none;
    }
  }

  .FilterSelectWrap {
    display: flex;
    flex-wrap: wrap;

    .filterSelect {
      width: 232px;
      margin-right: 30px;
      margin-bottom: 10px;
    }
  }

  .selectButton {
    position: absolute;
    right: 12px;
    top: 28px;
  }

  .myeltable {
    /deep/ .cell {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: clip;
    }
  }

  .divdiver {
    position: relative;
    left: 30px;
    height: 1px;
    width: 83%;
    background: #EEF2FB;
    margin-bottom: 10px;
  }

  /deep/ .selectRow {
    background: #C9C8D0;


  }

  /deep/ .gray {
    background: #E4E2E2;
  }

  /deep/ .pagination-container {
    padding: 0;
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

  .w-table {
    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
    -khtml-user-select: none; /* Konqueror HTML */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    user-select: none; /* 没有前缀，目前支持Opera和谷歌浏览器 */
    /deep/ .caret-wrapper {
      position: relative;
    }

    /deep/ .el-table__column-filter-trigger {
      position: relative;
    }

    /deep/ .el-table th {
      padding: 0;

      .virtual {
        position: absolute;
        display: block;
        width: 0;
        height: 0;
        z-index: 99;
        top: 0;
        background: none;
        border: none;
        box-sizing: border-box;
      }

    }

    .thead-cell {
      vertical-align: middle !important;
      padding: 0;
      display: inline-flex;
      flex-direction: column;
      align-items: left;
      cursor: pointer;
      overflow: initial;
      /*&:before {*/
      /*content: "";*/
      /*position: absolute;*/
      /*top: 0;*/
      /*left: 0;*/
      /*bottom: 0;*/
      /*right: 0;*/
      /*}*/
    }

    &.w-table_moving {
      .el-table th .thead-cell {
        cursor: move !important;
      }

      .el-table__fixed {
        cursor: not-allowed;
      }
    }
  }

  .right_wrap {

    /deep/ .el-collapse-item {
      border-bottom: 1px solid #303133;
    }
  }

  /deep/ .moveIng {
    .virtual {
      border: 2px dotted #666 !important;
    }
  }

  /deep/ .darg_active_left {
    .virtual {
      border-left: 2px dotted #666 !important;
    }
  }

  /deep/ .darg_active_right {
    .virtual {
      border-right: 2px dotted #666 !important;
    }
  }

  .DataPicker /deep/ {
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

  .djSubmitDateArray {
    width: 490px;
    margin-bottom: 0;

    /deep/ .el-form-item__label {
      line-height: 40px !important;
    }
  }

  .button-group-search {
    position: relative;
    display: flex;

    .searchRight {
      margin-left: 0;
      height: 32px;
      border-top-right-radius: 3px !important;
      border-bottom-right-radius: 3px !important;
      padding: 0 5px
    }

    .searchWrap {
      border-radius: 5px;
      top: 20px;
      left: -20px;
      width: 550px;
      min-height: 200px;
      /*max-height: 500px;*/
      position: absolute;
      background: #ffffff;
      border: 1px solid #d4d5d5;
      z-index: 50;
      /*overflow: auto;*/
      padding: 20px 0;
      box-shadow: 0 3px 6px rgba(111, 111, 111, 0.2);

      /deep/ .form-container {
        padding-bottom: 10px;
        overflow: auto;
        max-height: 500px;

        .el-form-item__label {
          text-align: left;
          padding-left: 32px;
          font-weight: normal;
        }

        .el-form-item__content {
          input {
            border-top: 0;
            border-left: 0;
            border-radius: 0;
            border-right: 0
          }
        }
      }

      .clearWrap {
        display: flex;
        justify-content: flex-end;
        right: 20px;
        bottom: 10px;
        position: absolute;
        z-index: 1;
      }
    }
  }

  @keyframes show {
    0% {

      opacity: 0;
      //transform: translateX(100%);

    }
    100% {
      // transform: translateX(0);
      opacity: 1;

    }
  }

  @keyframes hide {
    0% {
      opacity: 1;
      // transform: translateX(0);
    }
    100% {

      opacity: 0;
      //  transform: translateX(100%);
    }
  }

  .show-enter-active {
    animation: show 0.5s;
  }

  .show-leave-active {
    animation: hide 0.5s;
  }

  .show-enter, .show-leave-to {
    opacity: 0;
  }

  .ViewsSwitching {
    position: absolute !important;
    right: 0;
    z-index: 100;
    top: 5px;
  }

  .searchRight {
    margin-left: 0;
    height: 32px;
    border-top-right-radius: 3px !important;
    border-bottom-right-radius: 3px !important;
    padding: 0 5px
  }


  .queryButton {
    z-index: 7
  }


  .noTrigger /deep/ .el-table__column-filter-trigger {
    display: none;
  }


  .brush_right {
    position: absolute;
    right: 6px;
    z-index: 1;
    top: -4px;
  }

  /deep/ .btn-simple1 {
    color: #409EFF;
  }

  /deep/ .name_wrap {
    display: flex;

    .name {
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      border-right: 1px solid #2b2f3a;
      border-bottom: 1px solid #2b2f3a;
    }

    .name0 {
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      /*text-overflow: ellipsis;*/
      border-right: 1px solid #2b2f3a;
      border-bottom: 1px solid #2b2f3a;
    }
  }

  /deep/ .firstName_wrap {
    cursor: not-allowed;
    background: #c9c9c9;
  }

  .file-down {
    > > > .el-dialog__body {
      padding-bottom: 50px;
      padding-top: 20px;
    }
  }
</style>
