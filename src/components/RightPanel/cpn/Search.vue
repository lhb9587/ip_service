<template>
  <div id="outBox" v-clickoutside="clickoutside">
    <div class="queryButton" id="queryButton" style="margin: 0 auto">
      <div class="buttonWrap_small">
        <div class="button-group-search">
          <el-button type="primary" size="mini" @click.stop.prevent="drawerState = !drawerState">
            <span class="iconfont icon-shaixuan"></span>
            高级筛选
          </el-button>
          <transition name="show" mode="out-in">
            <div class="searchWrap w-full" id="searchWrap" v-show="drawerState">
              <div class="form-container w-full">
                <el-form size="mini" label-width="120px" @keyup.enter.native="handleSearch(0)" style="margin-top: 2px">
                  <el-form-item :label="item.filterName+':'"
                                :class="item.filterType==='radio'&&item.values.length>3?'fullItem':'postInfo-container-item'"
                                v-for="(item,index) in conditionsModuleList" :key="index">
                    <el-select v-model="queryModuleData[item.property]" placeholder="请选择"
                               v-if="item.filterType==='select'" filterable clearable>
                      <el-option v-for="itm in item.values" :key="itm.id" :label="itm.value" :value="itm.id">
                      </el-option>
                    </el-select>

                    <el-select v-if="item.filterType==='checkbox'&&item.values&&item.values.length"
                               v-model="queryModuleData[item.property]" multiple placeholder="请选择" filterable
                               clearable
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
            {{ itmx }}
            </span>
                      </el-option>
                      <el-option v-for="(itm,idx) in item['valueList']" :key="itm.id" :label="itm.value"
                                 :value="itm.id">
                        <el-tooltip v-for="(itmx,key) in item['valueList'][idx]" v-if="key!='id'" class="item"
                                    effect="light" :content="itmx" placement="top">
                          <span>{{ itmx }}</span>
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
            {{ itmx }}
            </span>
                      </el-option>
                      <el-option v-for="(itm,idx) in item['valueList']" :key="itm.id" :label="itm.value"
                                 :value="itm.id">
                        <el-tooltip v-for="(itmx,key) in item['valueList'][idx]" v-if="key!='id'" class="item"
                                    effect="light" :content="itmx" placement="top">
                          <span>{{ itmx }}</span>
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
            {{ itmx }}
            </span>
                      </el-option>
                      <el-option v-for="(itm,idx) in item['valueList']" :key="idx" :label="itm.value" :value="itm.id">
                        <el-tooltip v-for="(itmx,key) in item['valueList'][idx]" v-if="key!='id'" :key="key"
                                    class="item" effect="light" :content="itmx" placement="top">
                          <span>{{ itmx }}</span>
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
                        <span v-for="(itmx ,key) in item['values'][idx]" v-if="key!='id'">{{ itmx }}</span>
                      </el-option>
                    </el-select>
                    <el-radio-group v-model="queryModuleData[item.property]" v-if="item.filterType==='radio'">
                      <el-radio :label="itm.id" v-for="(itm,index) in item.values" :key="index">{{ itm.value }}
                      </el-radio>
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

              <div class="clearWrap" v-if="drawerState">
                <el-button size="small" @click="clearSearch"><span>重置</span></el-button>
                <el-button type="primary" size="small" @click="handleSearch(0)">搜索</el-button>
              </div>
              <el-button
                id="more"
                style="position: absolute; top: 10px; right: 10px"
                type="text"
                size="small"
                @click="queryFilter"
              >
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

import {configFilter, queryFilter, queryFilterConfig} from "@/api/caseList";

export default {
  name: 'SearchContent',
  props: {
    isShow: {
      default: false,
    },
    type: {},
    name: 'documentSearch',
    bussId: {
      default: 91
    },
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
        pageSize: 10,
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
    isShow(v) {
      // 关闭弹框
      v && this.clickClose()
    },
    isDim(n, o) {
      // this.$set(this.queryModuleData, "custIdList", []);
      // this.$set(this.queryModuleData, "custName", "");
    },
  },
  methods: {
    setData(data) {
      this.$set(this, 'queryModuleData', JSON.parse(JSON.stringify(data)))
    },
    querySearchAsync(value, index, property, filterName, cb) {
      // if (value && ["被申请人"].includes(filterName)) {
      //   querylyctListUrl({
      //     fullname: value,
      //     pageNo: 1,
      //     pageSize: 100,
      //     isCustomer: 1
      //   }).then(res => {
      //
      //     let list = res.data.map(item => ({
      //       id: item.fullname,
      //       value: item.fullname,
      //       value1: item.fullnameEn,
      //       value2: item.address,
      //       value3: item.addressEn
      //     }))
      //     cb([...[this.getAppTitleList(filterName)], ...list])
      //   })
      // }
      cb([])
    },
    openOrClose() {
      this.drawerState = !this.drawerState
    },
    clickClose(e) {
      this.drawerState = false
      // e.target.id == 'outBox' || e.target.id == 'queryButton' ? this.drawerState = false : '';
    },
    queryRecordList() {
      // queryOfficialBillRecordList({
      //   payListType: 1826,
      //   ...this.queryModuleData
      // }).then(res => {
      //   this.childDataList = res.data
      // })
    },
    checkBox(e, property, values) {
      if (
        this.queryModuleData[property].includes('') &&
        this.queryModuleData[property].filter((item) => item).length !=
        values.filter((item) => item).length
      ) {
        this.queryModuleData[property] = this.queryModuleData[property].filter((item) => item)
      }
      if (e[e.length - 1] == '') {
        this.queryModuleData[property] = values.map((item) => item.id)
      }
    },
    clearSearch() {
      for (var key in this.queryModuleData) {
        if (key.includes('Date') || key === 'belongToYearMonth') {
          // this.queryModuleData[key] = ['', '']
          this.$set(this.queryModuleData, key, ['', '']);
        } else if (key.includes('Array')) {
          this.$set(this.queryModuleData, key, []);
          // this.queryModuleData[key] = []
        } else if (key === 'caseTypeIds' || key === 'deptGroupIds' || key === 'cbGroupIds') {
          this.$set(this.queryModuleData, key, []);
          // this.queryModuleData[key] = []
        } else {
          this.$set(this.queryModuleData, key, null);
          // this.queryModuleData[key] = null
        }
      }
      this.$forceUpdate()
    },
    queryFilter() {
      this.transferVisible = true
      const data = {
        bussId: this.bussId,
      }
      queryFilter(data).then((res) => {
        if (res.success) {
          this.transferData = this.generateData(res.data)
        }
      })
    },
    generateData(arr) {
      arr.forEach((item) => {
        item.key = item.filterId
        item.label = item.filterName
      })
      return arr
    },
    configFilter() {
      const data = {
        bussId: this.bussId,
        filterIds: this.transferValue.join(','),
      }
      configFilter(data).then((res) => {
        this.queryFilterConfig()
      })
    },
    defaultQuerySearch() {
      // this.queryModuleData = JSON.parse(localStorage.getItem('queryModuleData'))
      //   ? JSON.parse(localStorage.getItem('queryModuleData')).find(
      //     (item) => item.name == this.name,
      //   )
      //     ? JSON.parse(localStorage.getItem('queryModuleData')).find(
      //       (item) => item.name == this.name,
      //     ).queryModuleData
      //     : {}
      //   : {}
      // if (this.queryModuleData.custName) {
      //   const custName = this.queryModuleData.custName;
      //   this.isDim = 1;
      //   this.$nextTick(() => {
      //     this.$set(this.queryModuleData, "custName", custName);
      //   });
      // }
    },
    queryFilterConfig(type) {
      const data = {
        bussId: this.bussId,
      }
      this.conditionsModuleList = []
      queryFilterConfig(data).then((res) => {
        this.transferVisible = false
        this.$nextTick(() => {
          this.conditionsModuleList = res.data
          let keyList = res.data.map((item) => item.property)
          for (var key in this.queryModuleData) {
            if (!keyList.includes(key)) {
              if (key.includes('Date') || ['belongToYearMonth'].includes(key)) {
                this.$set(this.queryModuleData, key, ['', '']);
                // this.queryModuleData[key] = ['', '']
              } else if (key.includes('Array') || key.includes('List')) {
                this.$set(this.queryModuleData, key, []);
                // this.queryModuleData[key] = []
              } else {
                this.$set(this.queryModuleData, key, null);
                // this.queryModuleData[key] = null
              }
            }
          }
          this.defaultQuerySearch()
          if (type == 1) {
            // this.$emit('search', {data: this.queryModuleData, searchType: 0})
          }
          res.data.forEach((item) => {
            // if (item.filterType.includes("Many")) {
            //   if (this.queryModuleData[item.property]) {
            //     if (item.filterType.includes('Many')) {
            //       if (["被申请人", "转让人"].includes(item.filterName)) {
            //       } else if (item.filterName == '申请人') {
            //         if (this.queryModuleData[item.property] && this.queryModuleData[item.property].length) {
            //           queryApplicantByIdList({appIdArray: this.queryModuleData[item.property]}).then(res => {
            //             this.$set(item, 'valueList', res.data.map(i => ({
            //               id: i.appId,
            //               value: i.applicantName,
            //               value1: i.applicantEnName,
            //               value2: i.applicantAddress,
            //               value3: i.applicantEnAddress
            //             })))
            //           })
            //         }
            //       } else if (item.filterName == '客户') {
            //         if (this.queryModuleData[item.property].length) {
            //           queryCustomerNameId({custIdArray: this.queryModuleData[item.property]}).then(res => {
            //             this.$set(item, 'valueList', res.data.map(i => ({id: i.custId, value: i.name})))
            //             this.custList = item.valueList
            //           })
            //         }
            //       } else {
            //         item.valueList = item.values.filter(i => i.id == this.queryModuleData[item.property])
            //       }
            //     }
            //   } else {
            //     item.valueList = []
            //   }
            // }
            if (item.filterType.includes('checkbox')) {
              if (
                this.queryModuleData[item.property] &&
                this.queryModuleData[item.property].length
              ) {
                // this.queryModuleData[item.property] = this.queryModuleData[item.property]
                this.$set(this.queryModuleData, item.property, this.queryModuleData[item.property]);
              } else {
                // this.queryModuleData[item.property] = []
                this.$set(this.queryModuleData, item.property, []);
              }
            }
          })
          this.transferValue = res.data.map((item) => item.filterId)
          // if (this.$route.query.custId) {
          //   if (!this.transferValue.find(item => item == 58)) {
          //     this.$set(this.transferValue, this.transferValue.length - 1, 58);
          //     this.configFilter();
          //   } else {
          //     this.remoteMethod(
          //       this.$route.query.name,
          //       this.transferValue.indexOf(58),
          //       "",
          //       "客户"
          //     );
          //   }
          // }
        })
      })
    },
    addFilterScheme(e) {
      // if (e == 1) {
      //   this.addFilterState = true
      // } else if (e == 2) {
      //   if (!this.schemeName || !this.schemeName.trim()) {
      //     this.$message.error('请输入过滤器名称')
      //     return
      //   }
      //   const data = {
      //     schemeName: this.schemeName,
      //     bussId: this.bussId,
      //     value: JSON.stringify(this.queryModuleData)
      //   }
      //   addFilterScheme(data).then(res => {
      //     this.addFilterState = false
      //   })
      // }
    },
    clickoutside() {
      this.drawerState = false
    },
    handleSearch(flag) {
      const tagList = []
      this.conditionsModuleList.forEach(item => {
        if (Array.isArray(this.queryModuleData[item.property]) && !this.queryModuleData[item.property].length || this.queryModuleData[item.property] === undefined || this.queryModuleData[item.property] === '' || this.queryModuleData[item.property] === null) {
          delete this.queryModuleData[item.property]
        } else {
          let value
          if (['caseType'].includes(item.property)) {
            value = item.values.find(i => i.id == this.queryModuleData[item.property]).value
          } else if (['privyC'].includes(item.property)) {
            value = this.queryModuleData[item.property] && this.queryModuleData[item.property].replace(/[^\w\u4E00-\u9FA5]|_/g, ',') // 所有标点符号替换成,
            this.queryModuleData[item.property] = value
          } else {
            value = Array.isArray(this.queryModuleData[item.property])
              ? this.queryModuleData[item.property] = this.queryModuleData[item.property].filter(Boolean)
              : this.queryModuleData[item.property]
          }
          if (value !== '' && (Array.isArray(value) ? value.length > 0 : true)) {
            tagList.push({
              label: item.filterName,
              value: value + '',
              property: item.property
            })
          }
        }
      })
      this.$emit('search', {data: this.queryModuleData, searchType: 0, tagList})
      this.clickoutside()
    },
    remoteMethod(value, index, property, filterName) {
      // if (value && filterName === "客户") {
      //   queryCustomerNameId({pageNo: 1, pageSize: 100, keyword: value}).then(
      //     res => {
      //       this.custList = this.$commonUtils.unique([...new Set([...res.data.map(item => ({
      //         id: item.custId,
      //         value: item.name
      //       })), ...this.custList])], 'id')
      //       this.$set(
      //         this.conditionsModuleList[index],
      //         "valueList",
      //         this.custList
      //       );
      //       this.$forceUpdate();
      //     }
      //   );
      // }
      // if (value && filterName == '缴费类型') {
      //   querycustSelectClass({classId: 1149}).then(res => {
      //     this.$set(
      //       this.conditionsModuleList[index],
      //       "valueList",
      //       res.data["1149"]
      //     );
      //     this.$forceUpdate();
      //     // this.payTypeList = res.data["1149"]
      //   });
      // }
      // if (value && ["申请人", "被申请人", "转让人"].includes(filterName)) {
      //   queryAllUrl({
      //     applicantName: value,
      //     pageNo: 1,
      //     pageSize: 100,
      //     orderBy: 1
      //   }).then(res => {
      //     this.$set(
      //       this.conditionsModuleList[index],
      //       "valueList",
      //       res.data.map(item => ({
      //         id: item.appId,
      //         value: item.applicantName,
      //         value1: item.applicantEnName,
      //         value2: item.applicantAddress,
      //         value3: item.applicantEnAddress
      //       }))
      //     );
      //     this.$forceUpdate();
      //   });
      // }
      // if (
      //   value &&
      //   filterName !== "客户" &&
      //   !["申请人", "被申请人", "转让人"].includes(filterName)
      // ) {
      //   this.$set(
      //     this.conditionsModuleList[index],
      //     "valueList",
      //     this.conditionsModuleList[index].values
      //       .filter(item =>
      //         item.value
      //           ? item.value
      //             .toLocaleUpperCase()
      //             .includes(value.toLocaleUpperCase())
      //           : false
      //       )
      //       .slice(0, 100)
      //   );
      //   this.$forceUpdate();
      // }
    },
    changeTextRange(value, index, property) {
      this.queryModuleData[property.split(',')[1]] = value
      // this.$set(this.queryModuleData, property.split(",")[1], value);
    },
    getAppTitleList(filterName, valueList0) {
      if (filterName === '申请人') {
        return {
          id: '-1',
          value: '申请人中文名称',
          value1: '申请人英文名称',
          value2: '申请人中文地址',
          value3: '申请人英文地址',
          // disabled:true
        }
      }
      if (filterName === '申请人姓名') {
        return {
          id: '-1',
          value: '申请人中文名称',
          value1: '申请人英文名称',
          value2: '申请人中文地址',
          value3: '申请人英文地址',
        }
      }
      if (filterName === '被申请人') {
        return {
          id: '-1',
          value: '被申请人中文名称',
          value1: '被申请人英文名称',
          value2: '被申请人中文地址',
          value3: '被申请人英文地址',
        }
      }
      if (filterName === '转让人') {
        return {
          id: '-1',
          value: '转让人中文名称',
          value1: '转让人英文名称',
          value2: '转让人中文地址',
          value3: '转让人英文地址',
        }
      }
      if (filterName === '客户') {
        return {
          id: '-1',
          value: '简称',
          value1: '国籍',
          value2: '全称',
        }
      }
      return valueList0
    },
  },
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
    > > > .el-form-item__content {
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

.el-transfer {
  display: flex;

  > > > .el-transfer-panel {
    flex: 1;
  }

  > > > .el-transfer__buttons {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    .el-transfer__button {
      margin-bottom: 10px;
    }

  }

}

.dialog-footer {
  display: flex;
  justify-content: center;
}

.fullItem {
  width: 100%;
}

.button-group-search {
  position: relative;
  display: flex;

  .searchRight {
    margin-left: 0;
    height: 32px;
    border-top-right-radius: 3px !important;
    border-bottom-right-radius: 3px !important;
    padding: 0 5px;
  }

  .searchWrap {
    border-radius: 5px;
    top: 34px;
    left: -310px;
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

    > > > .form-container {
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
          border-right: 0;
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

.searchRight {
  margin-left: 0;
  height: 32px;
  border-top-right-radius: 3px !important;
  border-bottom-right-radius: 3px !important;
  padding: 0 5px;
}

.queryButton {
  z-index: 7;
}

> > > .name_wrap {
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

> > > .firstName_wrap {
  cursor: not-allowed;
  background: #c9c9c9;
}
</style>
