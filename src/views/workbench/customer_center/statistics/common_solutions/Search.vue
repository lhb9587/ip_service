<template>
  <div class="search-content">
    <el-button-group class="button-group-search">
      <transition name="show" mode="out-in">
        <div class="searchWrap" id="searchWrap" :style="{width: '100%'}">
          <div class="form-container">
            <el-form size="mini" label-width="120px" @keyup.enter.native="handleSearch(0)" style="margin-top: 20px;">
              <el-form-item :label="item.filterName+':'"
                            :class="item.filterType==='radio'&&item.values.length>3?'fullItem':'postInfo-container-item'"
                            v-for="(item, index) in conditionsModuleList" :key="index">

                <div v-if="item.filterType==='select'" style="width: 100%">
                  <el-select v-model="queryModuleData[item.property]" placeholder="请选择"
                             filterable clearable>
                    <el-option v-for="itm in item.values" :key="itm.id" :label="itm.value" :value="itm.id">
                    </el-option>
                  </el-select>
                </div>

                <div v-if="item.filterType === 'incomeRange'" style="display:flex;">
                  <div style="display: flex;" class="inputRange">
                    <el-input placeholder="开始范围" size="mini" v-model="queryModuleData[item.property][0]"></el-input>
                    至
                    <el-input v-model="queryModuleData[item.property][1]" placeholder="结束范围" size="mini"></el-input>
                    万
                  </div>
                </div>
                <div v-if="item.filterType === 'dateYearRange'" style="display:flex;">
                  <DateYearPicker class="DataPicker" v-model="queryModuleData[item.property]"></DateYearPicker>
                  <!--                  <div style="display: flex;" class="inputRange">-->
                  <!--                    <el-input placeholder="开始范围" size="mini" v-model="queryModuleData[item.property][0]"></el-input>-->
                  <!--                    至-->
                  <!--                    <el-input v-model="queryModuleData[item.property][1]" placeholder="结束范围" size="mini"></el-input>-->
                  <!--                    万-->
                  <!--                  </div>-->
                </div>

                <div v-if="item.filterType === 'dateMonthRange'" style="display:flex;">
                  <DateMonthPicker class="DataPicker" v-model="queryModuleData[item.property]"></DateMonthPicker>
                </div>

                <div v-if="item.filterType === 'yoyRange'" style="display:flex;">
                  <div style="display: flex;" class="inputRange">
                    <el-select v-model="queryModuleData[item.property][0]" placeholder="开始月份"
                               filterable clearable>
                      <el-option
                        v-for="itm in monthList" :key="itm" :label="itm" :value="itm">
                      </el-option>
                    </el-select>
                    至
                    <el-select v-model="queryModuleData[item.property][1]" placeholder="结束月份"
                               filterable clearable>
                      <el-option
                        v-for="itm in monthList" :key="itm" :label="itm" :value="itm">
                      </el-option>
                    </el-select>
                    月
                  </div>

                </div>

                <el-select v-if="item.filterType==='selectMultipleMany'" multiple
                           v-model="queryModuleData[item.property]" filterable remote clearable reserve-keyword
                           placeholder="请输入关键词" :remote-method="(queryString)=>{
            remoteMethod(queryString,index,item.property,item.filterName);
            }">
                  <el-option v-for="itm in item['valueList']" :key="itm.id" :label="itm.value" :value="itm.id">
                  </el-option>
                </el-select>

                <!--                <el-select v-model="queryModuleData[item.property]" placeholder="请选择"-->
                <!--                           v-if="item.filterType==='select'" filterable clearable>-->
                <!--                  <el-option v-for="itm in item.values" :key="itm.id" :label="itm.value" :value="itm.id">-->
                <!--                  </el-option>-->
                <!--                </el-select>-->

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
                <!--                <el-select v-if="item.filterType==='selectMultipleMany'" multiple-->
                <!--                           v-model="queryModuleData[item.property]" filterable remote clearable reserve-keyword-->
                <!--                           placeholder="请输入关键词" :remote-method="(queryString)=>{-->
                <!--            remoteMethod(queryString,index,item.property,item.filterName);-->
                <!--            }">-->
                <!--                  <el-option v-for="itm in item['valueList']" :key="itm.id" :label="itm.value" :value="itm.id">-->
                <!--                  </el-option>-->
                <!--                </el-select>-->
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
                  <el-option v-for="(itm,idx) in item['valueList']" :key="itm.id" :label="itm.value" :value="itm.id">
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
                  <el-option v-for="(itm,idx) in item['valueList']" :key="itm.id" :label="itm.value" :value="itm.id">
                    <el-tooltip v-for="(itmx,key) in item['valueList'][idx]" v-if="key!='id'" class="item"
                                effect="light" :content="itmx" placement="top">
                      <span>{{itmx}}</span>
                    </el-tooltip>
                  </el-option>
                </el-select>
                <el-select v-if="item.filterType==='selectMultipleManyTable'" multiple
                           v-model="queryModuleData[item.property]" filterable remote clearable placeholder="请输入关键词"
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

                <el-input clearable v-model="queryModuleData[item.property][0]"
                          :placeholder="'请输入'+item.filterName" v-if="item.filterType==='searchRange'"></el-input>
                <span v-if="item.filterType==='searchRange'">至</span>
                <el-input clearable v-model="queryModuleData[item.property][1]"
                          :placeholder="'请输入'+item.filterName" v-if="item.filterType==='searchRange'"></el-input>

                <el-input clearable v-model="queryModuleData[item.property][0]"
                          :placeholder="'请输入'+item.filterName" v-if="item.filterType==='searchCompare'"
                          @change="handleSearchCompare(item.property,0,false)"></el-input>
                <span v-if="item.filterType==='searchCompare'">至</span>
                <el-input clearable v-model="queryModuleData[item.property][1]"
                          :placeholder="'请输入'+item.filterName" v-if="item.filterType==='searchCompare'"
                          @change="handleSearchCompare(item.property,1,false)"></el-input>

                <DataPicker class="DataPicker" v-if="item.filterType==='date'"
                            v-model="queryModuleData[item.property]"></DataPicker>
                <DateMonthPicker class="DataPicker" v-if="item.filterType==='dateMonth'"
                                 v-model="queryModuleData[item.property]"></DateMonthPicker>

                <el-multi-cascader
                  style="width: 100%;"
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
              </el-form-item>
            </el-form>
          </div>

          <div class="clearWrap">
            <el-button size="mini" @click="clearSearch"><span>重置</span></el-button>
            <el-button type="primary" size="mini" @click="handleSearch(0)">搜索</el-button>
          </div>
          <el-button id="more" style="position:absolute;top: 10px;right: 10px" type="text" size="mini"
                     @click="queryFilter">
            <i class="el-icon-s-tools"></i>更多
          </el-button>
        </div>
      </transition>
    </el-button-group>

    <el-dialog title="提示" append-to-body :modal="true" :visible.sync="transferVisible" width="80%">
      <el-transfer style="width: 100%;" v-model="transferValue" :key="transferData.id || transferData.filterId"
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
  import DateYearPicker from '@/components/DateYearPicker/index.vue'
  import {queryCustomerNameId} from "@/api/caseList.js";
  import {querycustSelectClass, querylyctListUrl} from "@/api/customerList.js";
  import {queryOfficialBillRecordList} from '@/api/billApi';
  import {queryAllUrl} from "@/api/applicant";
  import {
    addFilterScheme,
    getFilterScheme,
    deleteFilterScheme,
    queryFilter,
    configFilter,
    queryFilterConfig
  } from "@/api/dashboard.js";
  import {configFilterUrl, queryFilterConfigUrl, queryFilterUrl} from "../../../../../api/customerList";
  import {queryList} from "../../../../../api/caseList";

  export default {
    name: "Search",
    props: {
      searchView: {
        default: false
      },
      chartData: {},
      index: {},
      rowData: {},
      configId: '',
      name: '',
      panelId: '',
      chartWidth: '',
      searchState: false,
      echartIndex: '',
      // queryData: {
      //   type: Object,
      //   default: () => ({})
      // }
    },
    components: {
      DateYearPicker
    },
    data() {
      return {
        clearQueryData: {},
        initState: false,
        queryData: {},
        monthList: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
        date: '',
        isExpired: false,
        childDataList: [],
        addFilterState: false,
        schemeName: '',
        agentNums: '',
        listQuery: {
          pageNo: 1,
          pageSize: 10
        },
        queryModuleData: {
          belongToMonth: ['', ''],
          havbillSum: ['', ''],
          belongToDate: ['', ''],
          caseTypeIds: [],
          wkgId: [],
        },
        defaultSearchTerms: {}, // 重置操作保存的默认搜索项
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
        drawerState: true,
        schemeList: {
          flag: 0,
          list: []
        },
        clickObj: {},
        custList: []
      }
    },
    created() {
      if (this.searchView) {
        this.refreshFilter()
      }
      // this.getFilterScheme()
      // this.$emit('search', 0)
    },
    methods: {
      refreshFilter() {
        this.initSearchQuery()
        let year = new Date().getFullYear();
        let month = new Date().getMonth() + 1;
        let day = new Date().getDate();
        this.date = year + '-' + month + '-' + day
        this.queryFilterConfig(this.chartData.type)
      },
      changeDataPicker(value) {
        // if (!this.drawerState) {
        value[0] && value[1] && this.handleSearch()
        // }
      },
      // searchRange 年份筛选
      handleSearchRange(filed) {
        this.yearErrorMessage(filed) && this.queryModuleData[filed][0] && this.queryModuleData[filed][1] && this.handleSearch()
      },
      // searchCompare,输一个，然后另一个自动变为前一年或后一年
      handleSearchCompare(filed, index, search) {
        if (this.yearErrorMessage(filed)) {
          if (this.queryModuleData[filed][0] && index === 0) {
            this.$set(this.queryModuleData[filed], 1, parseInt(this.queryModuleData[filed][0]) + 1)
          }
          if (this.queryModuleData[filed][1] && index === 1) {
            this.$set(this.queryModuleData[filed], 0, parseInt(this.queryModuleData[filed][1]) - 1)
          }
          search && this.handleSearch()
        }
      },
      yearErrorMessage(filed) {
        if (this.queryModuleData[filed][0].length > 4 || this.queryModuleData[filed][1].length > 4) {
          this.$message({
            showClose: true,
            message: '年份填写错误',
            type: 'warning'
          });
          return false
        }
        return true
      },
      twoConfigFilter(data) {
        if (data.type === 1) {
          configFilter(data).then(res => {
            this.queryFilterConfig(data.type);
          })
        } else if (data.type === 2) {
          configFilterUrl(data).then(res => {
            this.queryFilterConfig(data.type);
          });
        }
      },
      twoQueryFilter(data) {
        if (data.type === 1) {
          queryFilter(data).then(res => {
            if (res.success) {
              this.transferData = this.generateData(res.data);
            }
          })
        } else if (data.type === 2) {
          queryFilterUrl(data).then(res => {
            if (res.success) {
              this.transferData = this.generateData(res.data);
            }
          });
        }

      },
      twoQueryFilterConfig(data) {
        if (data.type === 1) {
          return queryFilterConfig(data)
        } else if (data.type === 2) {
          return queryFilterConfigUrl(data)
        }
      },
      initSearchQuery() {
        if (this.index === 0) {
          this.queryData = Object.assign({}, this.$commonUtils.cleanNullAttr(this.rowData[this.index].queryData || {}))
        } else if (this.index === 1) {
          this.queryData = Object.assign(
            this.$commonUtils.cleanNullAttr({...(this.rowData[this.index - 1].queryData || {}), ...(this.rowData[this.index].queryData || {})}),
            this.$commonUtils.cleanNullAttr({...(this.rowData[this.index - 1].searchData || {}), ...(this.rowData[this.index].searchData || {})})
          )
        } else if (this.index === 2) {
          this.queryData = Object.assign(
            this.$commonUtils.cleanNullAttr({...(this.rowData[this.index - 2].queryData || {}), ...(this.rowData[this.index - 1].queryData || {}), ...(this.rowData[this.index].queryData || {})}),
            this.$commonUtils.cleanNullAttr({...(this.rowData[this.index - 2].searchData || {}), ...(this.rowData[this.index - 1].searchData || {}), ...(this.rowData[this.index].searchData || {})}),
          )
        }
      },
      remoteMethod(value, index, property, filterName) {
        if (value && filterName === "客户") {
          queryCustomerNameId({pageNo: 1, pageSize: 100, keyword: value}).then(
            res => {
              this.$set(
                this.conditionsModuleList[index],
                "valueList",
                res.data.map(item => ({id: item.custId, value: item.name}))
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
      // 查询保存筛选项方案
      getFilterScheme() {
        getFilterScheme({panelId: this.panelId}).then(res => {
          if (res.data) {
            this.schemeList.flag = 1
            this.schemeList.list = res.data
          }
        })
      },
      // 删除保存筛选项方案
      deleteFilterScheme(index, schemeId) {
        deleteFilterScheme({panelId: this.panelId, schemeId: schemeId}).then(res => {
          if (res.success) {
            this.schemeList.list.splice(index, 1)
          }
        })
      },
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
      // 重置
      clearSearch() {
        this.$set(this, 'queryModuleData', this.clearQueryData)
        // this.queryModuleData = this.clearQueryData

        // for (var key in this.queryModuleData) {
        //   console.log('搜索条件',key)
        //   if (!['officialInformScreen', 'myCase', 'instructionSubmitStatus'].includes(key)) {
        //     if (key.includes('Date')) {
        //       this.$set(this.queryModuleData, key, ['', ''])
        //     } else if (key.includes('Array')) {
        //       this.$set(this.queryModuleData, key, [])
        //     } else if (key === 'caseTypeIds' || key === 'deptGroupIds') {
        //       this.$set(this.queryModuleData, key, [])
        //     } else {
        //       this.$set(this.queryModuleData, key, null)
        //     }
        //   }
        // }
      },
      queryFilter() {
        this.transferVisible = true;
        const data = {
          configId: this.configId,
          panelId: this.panelId,
          type: this.chartData.type
        };
        this.twoQueryFilter(data)
      },
      generateData(arr) {
        arr.forEach(item => {
          item.key = item.id || item.filterId;
          item.label = item.filterName;
        });
        return arr;
      },
      configFilter() {
        const data = {
          configId: this.configId,
          panelId: this.panelId,
          filterIds: this.transferValue.join(","),
          type: this.chartData.type
        };
        this.twoConfigFilter(data)

      },
      defaultQuerySearch() {

      },
      queryFilterConfig(type) {
        const data = {
          configId: this.configId,
          panelId: this.panelId,
          type
        };
        this.conditionsModuleList = []
        this.twoQueryFilterConfig(data).then(res => {
          this.transferVisible = false
          // this.$nextTick(() => {
          this.conditionsModuleList = res.data
          res.data.forEach(item => {
            if (item.filterType.includes('Range')) {
              this.$set(this.clearQueryData, item.property, ['', ''])
              this.$set(this.queryModuleData, item.property, ['', ''])
            } else if (['selectMultipleMany', 'cascader'].includes(item.filterType)) {
              this.$set(this.clearQueryData, item.property, [])
              this.$set(this.queryModuleData, item.property, [])
            } else {
              this.$set(this.clearQueryData, item.property, undefined)
              this.$set(this.queryModuleData, item.property, undefined)
            }
            if (item.defaultValueType) {
              switch (item.defaultValueType) {
                case 'string':
                  this.$set(this.queryModuleData, item.property, this.queryData[item.property] ? this.queryData[item.property] : item.filterValue)
                  this.$set(this.clearQueryData, item.property, item.filterValue)
                  break
                case 'number':
                  this.$set(this.queryModuleData, item.property, (this.queryData[item.property] || this.queryData[item.property] === 0) ? +this.queryData[item.property] : item.filterValue && +item.filterValue || '')
                  this.$set(this.clearQueryData, item.property, item.filterValue && +item.filterValue || '')
                  break
                case 'stringArray':
                  this.$set(this.queryModuleData, item.property, this.queryData[item.property] && this.queryData[item.property].length ? this.queryData[item.property] : item.filterValue && item.filterValue.split(',') || ['', ''])
                  this.$set(this.clearQueryData, item.property, item.filterValue && item.filterValue.split(',') || ['', ''])
                  break
                case 'numberArray':
                  if (item.filterType === 'cascader') {
                    const list = []
                    if (this.queryData[item.property] && this.queryData[item.property].length) {
                      this.$set(this.queryModuleData, item.property, this.queryData[item.property])
                    } else {
                      item.filterValue && item.filterValue.split(',').map(i => Number(i)).forEach(i => {
                        list.push(this.$commonUtils.extractTree(this.$commonUtils.findParentLevel(item.values, item.props.value, [i], 'parent', item.props.children), item.props.children).map(j => j[item.props.value]))
                      })
                      this.$set(this.queryModuleData, item.property, list)
                      this.$set(this.clearQueryData, item.property, list)
                    }
                  } else {
                    this.$set(this.queryModuleData, item.property, item.filterValue && item.filterValue.split(',').map(i => {
                      if (!i && i !== 0) {
                        return i
                      } else {
                        return +i
                      }
                    }) || [])
                    this.$set(this.clearQueryData, item.property, item.filterValue && item.filterValue.split(',').map(i => {
                      if (!i && i !== 0) {
                        return i
                      } else {
                        return +i
                      }
                    }) || [])
                  }
                  break
                default:
                  break
              }
            } else if (item.defaultFilter) {
              this.$set(this.queryModuleData, item.property, this.queryData[item.property] ? this.queryData[item.property] : item.defaultFilter)
              this.$set(this.clearQueryData, item.property, item.defaultFilter)
            } else {
              // (this.queryData[item.property] || this.queryData[item.property] === 0 || this.queryData[item.property] === false) && this.$set(this.queryModuleData, item.property, this.queryData[item.property])
            }
            if (item.filterName == '客户' && (this.queryModuleData[item.property] && this.queryModuleData[item.property].length || this.queryData.custName)) {
              queryCustomerNameId({
                pageNo: 1,
                pageSize: 100,
                isCustomer: 1,
                keyword: this.queryData.custName,
                custIdArray: this.queryModuleData.custId
              }).then(res => {
                this.custList = res.data.map(item => ({
                  id: item.custId,
                  value: item.fullname
                }))
                this.$set(
                  item,
                  "valueList",
                  this.custList
                );
                // if ((!this.queryModuleData.custId || this.queryModuleData.custId && !this.queryModuleData.custId.length) && this.custList.length) {
                  this.$set(this.queryModuleData, 'custId', [this.custList.map(i => i.id)[0]])
                // }
              })
            }
          })
          this.queryModuleData = Object.assign(this.queryModuleData, this.queryData)
          for (let k in this.queryModuleData) {
            this.$set(this.queryModuleData, k, this.queryModuleData[k])
            if (k === 'belongToYear' && this.queryModuleData[k] && this.queryModuleData[k].length === 1) {
              this.$set(this.queryModuleData, k, [this.queryModuleData[k][0], this.queryModuleData[k][0]])
            }
          }
          // this.defaultQuerySearch()

          // 记录初始化搜索项，后期重置需要
          this.defaultSearchTerms = JSON.parse(JSON.stringify(this.queryModuleData))

          this.transferValue = res.data.map(item => item.id || item.filterId);
          // });
        })
      },
      // 点击外侧关闭
      clickoutside() {
        // this.drawerState = false
      },
      handleSearch(flag) {
        this.drawerState = false
        // this.saveSearchCriteria()
        this.$emit('search', {...this.queryModuleData})
      },
      // 保存搜索条件
      saveSearchCriteria() {
        if (JSON.parse(localStorage.getItem('queryModuleData'))) {
          var arr = JSON.parse(localStorage.getItem('queryModuleData'))
        } else {
          var arr = []
        }

        // 处理请求接口数据
        const queryModuleData = this.$commonUtils.cleanNullAttr(JSON.parse(JSON.stringify(this.queryModuleData)))
        // for(let item in queryModuleData) {
        //   if (queryModuleData[item] === null) {
        //     delete queryModuleData[item]
        //   }
        // }
        const chartSearch = {
          panelId: this.panelId,
          date: this.date,
          queryModuleData: queryModuleData
        }

        // 判断本地是否存在图表搜索缓存
        // if (arr.find(item => item.name == this.name)){
        //   // 判断是否该图表id是否存在搜索条件
        //   if (arr.find(item => item.name == this.name).chartArr.find(item => item.panelId == this.panelId)) {
        //     if (!this.isExpired){
        //       arr.find(item => item.name == this.name).chartArr.find(item => item.panelId == this.panelId).queryModuleData = queryModuleData
        //     }else{
        //       var arr_index = arr.find(item => item.name == this.name).chartArr.findIndex(item => item.panelId == this.panelId)
        //       arr.find(item => item.name == this.name).chartArr.splice(arr_index,1)
        //       arr.find(item => item.name == this.name).chartArr.push(chartSearch)
        //     }
        //   }else{
        //     arr.find(item => item.name == this.name).chartArr.push(chartSearch)
        //   }
        // } else {
        //   arr.push({name: this.name, chartArr: [ chartSearch ] })
        // }
        // localStorage.setItem('queryModuleData', JSON.stringify(arr))
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
    },
    watch: {
      searchView(n) {
        if (n && !this.initState) {
          this.initState = true
          this.initSearchQuery()
          let year = new Date().getFullYear();
          let month = new Date().getMonth() + 1;
          let day = new Date().getDate();
          this.date = year + '-' + month + '-' + day
          this.queryFilterConfig(this.chartData.type)
        }
      },
      searchState() {
        this.drawerState = this.searchState
      },
      drawerState() {
        // 判断是否有获取请求
        // !this.schemeList.flag && this.getFilterScheme()
      }
    }
  }
</script>

<style lang="scss" scoped>
  .search-content {
    width: 100%;
    height: 100%;

    .button-group-search {
      position: relative;
      display: flex;

      .searchWrap {
        border-radius: 0px;
        top: 0px;
        left: 0;
        width: 100%;
        height: 350px;
        position: absolute;
        background: #ffffff;
        border: 1px solid #d4d5d5;
        z-index: 4;
        overflow: hidden;
        /*padding: 20px 0;*/
        box-shadow: 0 3px 6px rgba(111, 111, 111, 0.2);

        /deep/ .el-form {
          padding: 20px 20px 0px 0;

          .el-form-item__label {
            text-align: right;
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

            .el-select, .el-input {
              width: 100%;
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

  .btns {
    display: flex;

    div {
      cursor: pointer;
      font-size: 13px;
      padding: 0px 20px;
      background-color: #fff;
      margin-right: 15px;
    }

    .checkBtn {
      background-color: #52A0F5;
      color: #fff;
    }
  }

  .form-container {
    max-height: 300px;
    overflow: auto;
  }
</style>
