<template>
  <div id="outBox" v-clickoutside="clickoutside">
    <div class="queryButton" id="queryButton" style="margin: 0 auto">
      <div class="buttonWrap_small">
        <el-button-group class="button-group-search">
          <!--   全局搜索条件       -->
          <div v-if="echartIndex !== undefined" class="search-top">
            <el-form size="mini" @keyup.enter.native="handleSearch(0)" style="margin-top: 10px">
              <el-form-item :class="item.filterType==='radio'?'':'postInfo-container-item'"
                            v-for="(item,index) in conditionsModuleList"  v-if="item.required>0" :key="index">
                <el-select v-model="queryModuleData[item.property]" placeholder="请选择"
                           v-if="item.filterType==='select'" filterable clearable @change="(value)=>handleSelectSearch(value)">
                  <el-option v-for="itm in item.values" :key="itm.id" :label="itm.value" :value="itm.id">
                  </el-option>
                </el-select>
                <el-select v-if="item.filterType==='checkbox'&&item.values&&item.values.length"
                           v-model="queryModuleData[item.property]" multiple placeholder="请选择" filterable clearable
                           @change="(e)=>checkBox(e,item.property,item.values)">
                  <el-option v-for="itm in item.values" :key="itm.id" :label="itm.value" :value="itm.id">
                  </el-option>
                </el-select>
                <el-select v-if="item.filterType==='selectMany'" v-model="queryModuleData[item.property]" filterable @change="handleSearch"
                           remote clearable reserve-keyword :placeholder="'请输入'+item.filterName+'关键词'" :remote-method="(queryString)=>{
              remoteMethod(queryString,index,item.property,item.filterName);
              }">
                  <el-option v-for="itm in item['valueList']" :key="itm.id" :label="itm.value" :value="itm.id">
                  </el-option>
                </el-select>
                <el-select v-if="item.filterType==='selectMultipleMany'" multiple
                           v-model="queryModuleData[item.property]" filterable remote clearable reserve-keyword
                           :placeholder="'请输入'+item.filterName+'关键词'" :remote-method="(queryString)=>{
              remoteMethod(queryString,index,item.property,item.filterName);
              }">
                  <el-option v-for="itm in item['valueList']" :key="itm.id" :label="itm.value" :value="itm.id">
                  </el-option>
                </el-select>
                <el-select v-if="item.filterType==='selectTableMany'" v-model="queryModuleData[item.property]"
                           filterable remote clearable reserve-keyword :placeholder="'请输入'+item.filterName+'关键词'" :remote-method="(queryString)=>{
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
                           reserve-keyword :placeholder="'请输入'+item.filterName+'关键词'" :remote-method="(queryString)=>{
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
                <el-radio-group v-model="queryModuleData[item.property]" v-if="item.filterType==='radio'" @change="handleSearch">
                  <el-radio :label="itm.id" v-for="(itm,index) in item.values" :key="index">{{itm.value}}</el-radio>
                </el-radio-group>
                <el-input clearable v-model="queryModuleData[item.property]" :placeholder="'请输入'+item.filterName" v-if="item.filterType==='text'"></el-input>
                <el-input clearable v-model="queryModuleData[item.property]" :placeholder="'请输入'+item.filterName" type="textarea" v-if="item.filterType==='textarea'"></el-input>

                <el-input clearable v-model="queryModuleData[item.property.split(',')[0]]"
                          :placeholder="'请输入'+item.filterName" v-if="item.filterType==='textRange'"
                          @change="(string)=>changeTextRange(string,index,item.property)"></el-input>
                <span v-if="item.filterType==='textRange'" v-show="item.property.includes(',')">至</span>
                <el-input clearable v-model="queryModuleData[item.property.split(',')[1]]"
                          :placeholder="'请输入'+item.filterName" v-if="item.filterType==='textRange'"></el-input>

                <el-input class="search-mini-input" v-model="queryModuleData[item.property][0]"
                          :placeholder="item.filterName.split('所属')[1]" v-if="item.filterType==='searchRange'"
                          @change="handleSearchRange(item.property)"></el-input>
                <span v-if="item.filterType==='searchRange'">至</span>
                <el-input class="search-mini-input" v-model="queryModuleData[item.property][1]"
                          :placeholder="item.filterName.split('所属')[1]" v-if="item.filterType==='searchRange'"
                          @change="handleSearchRange(item.property)"></el-input>

                <el-input class="search-mini-input" v-model="queryModuleData[item.property][0]"
                          :placeholder="item.filterName.split('所属')[1]" v-if="item.filterType==='searchCompare'"
                          @change="handleSearchCompare(item.property,0,true)"></el-input>
                <span v-if="item.filterType==='searchCompare'">至</span>
                <el-input class="search-mini-input" v-model="queryModuleData[item.property][1]"
                          :placeholder="item.filterName.split('所属')[1]" v-if="item.filterType==='searchCompare'"
                          @change="handleSearchCompare(item.property,1,true)"></el-input>

                <DataPicker class="DataPicker" v-if="item.filterType==='date'"
                            v-model="queryModuleData[item.property]"
                            @change="(value)=>changeDataPicker(value)"></DataPicker>
                <DateMonthPicker class="DataPicker" v-if="item.filterType==='dateMonth'" v-model="queryModuleData[item.property]"></DateMonthPicker>


                <el-multi-cascader
                  ref="multiCascader"
                  :class="item.property"
                  v-if="item.filterType==='cascader'"
                  :show-all-levels="false"
                  :options="item.values"
                  multiple
                  filterable
                  clearable
                  :props="item.props ? item.props : {}"

                  change-on-select
                  selectChildren
                  v-model="queryModuleData[item.property]"></el-multi-cascader>
              </el-form-item>
            </el-form>
          </div>
          <!--          <el-button id="mySearch" type="primary" size="mini" @click="handleSearch(0)">搜索</el-button>-->
          <!--          <el-button type="primary" style="margin-left:0" class="searchRight" size="mini" icon="el-icon-arrow-down"-->
          <!--                     @click.stop.prevent="drawerState= !drawerState"></el-button>-->
          <transition name="show" mode="out-in">
            <div class="searchWrap" id="searchWrap" v-show="drawerState" :style="{width: chartWidth}">
              <div class="form-container">
                <template v-for="(item,index) in this.schemeList.list">
                  <el-button size="mini" @click="schemeSearch(item.value)">{{item.schemeName}}</el-button>
                  <i @click="deleteFilterScheme(index,item.schemeId)" class="el-icon-delete" style="cursor: pointer"></i>
                </template>
                <el-form size="mini" label-width="120px" @keyup.enter.native="handleSearch(0)" style="margin-top: 20px">
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
                    <el-select v-if="item.filterType==='selectMultipleMany'" multiple
                               v-model="queryModuleData[item.property]" filterable remote clearable reserve-keyword
                               placeholder="请输入关键词" :remote-method="(queryString)=>{
            remoteMethod(queryString,index,item.property,item.filterName);
            }">
                      <el-option v-for="itm in item['valueList']" :key="itm.id" :label="itm.value" :value="itm.id">
                      </el-option>
                    </el-select>
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
                    <el-input clearable v-model="queryModuleData[item.property]" :placeholder="'请输入'+item.filterName" v-if="item.filterType==='text'"></el-input>
                    <el-input clearable v-model="queryModuleData[item.property]" :placeholder="'请输入'+item.filterName" type="textarea" v-if="item.filterType==='textarea'"></el-input>
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
                    <DateMonthPicker class="DataPicker" v-if="item.filterType==='dateMonth'" v-model="queryModuleData[item.property]"></DateMonthPicker>
                    <el-multi-cascader
                      ref="multiCascader"
                      :class="item.property"
                      v-if="item.filterType==='cascader'"
                      :show-all-levels="false"
                      :options="item.values"
                      multiple
                      filterable
                      clearable
                      :props="item.props ? item.props : {}"

                      change-on-select
                      selectChildren
                      v-model="queryModuleData[item.property]"></el-multi-cascader>

                  </el-form-item>
                </el-form>
              </div>

              <div class="clearWrap" v-if="drawerState">
                <el-popover
                  placement="top"
                  width="300"
                  v-model="addFilterState">
                  <div>过滤器名称</div>
                  <div>
                    <el-input type="text" v-model="schemeName"></el-input>
                  </div>
                  <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text" @click="addFilterState = false">取消</el-button>
                    <el-button type="primary" size="mini" @click="addFilterScheme(2)">确定</el-button>
                  </div>
                  <el-button size="mini" slot="reference"><span>保存</span></el-button>
                </el-popover>

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
export default {
  name: "Search",
  props: {
    name: '',
    panelId: '',
    chartWidth: '',
    searchState: false,
    echartIndex: '',
    custId: {}
  },
  data() {
    return {
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
      queryModuleData: {},
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
      drawerState: false,
      schemeList: {
        flag: 0,
        list: []
      }
    }
  },
  created() {
    let year = new Date().getFullYear();
    let month = new Date().getMonth() +1;
    let day = new Date().getDate();
    this.date = year + '-' + month + '-' + day
    this.queryFilterConfig(1)
    // this.getFilterScheme()
    this.$emit('search', 0)
  },
  methods: {
    // 使用保存方案搜索
    schemeSearch(value) {
      this.queryModuleData = JSON.parse(value)
      this.handleSearch()
    },
    // 查询保存筛选项方案
    getFilterScheme() {
      getFilterScheme({ panelId: this.panelId }).then(res => {
        if (res.data) {
          this.schemeList.flag = 1
          this.schemeList.list = res.data
        }
      })
    },
    // 删除保存筛选项方案
    deleteFilterScheme(index,schemeId) {
      deleteFilterScheme({ panelId: this.panelId, schemeId: schemeId }).then(res => {
        if (res.success) {
          this.schemeList.list.splice(index,1)
        }
      })
    },
    querySearchAsync(value, index, property, filterName,cb){
      if (value && ["被申请人"].includes(filterName)) {
        querylyctListUrl({
          fullname: value,
          pageNo: 1,
          pageSize: 100,
          isCustomer:1
        }).then(res => {

          let list = res.data.map(item => ({
            id: item.fullname,
            value: item.fullname,
            value1: item.fullnameEn,
            value2: item.address,
            value3: item.addressEn
          }))
          cb([...[this.getAppTitleList(filterName)],...list])
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
      this.queryModuleData = JSON.parse(JSON.stringify(this.defaultSearchTerms))

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
      if (this.$refs.multiCascader) {
        this.$refs.multiCascader.forEach(item => {
          item.$el.querySelector('.el-input__inner').value = ''
        })
      }
    },
    queryFilter() {
      this.transferVisible = true;
      const data = {
        panelId: this.panelId
      };
      queryFilter(data).then(res => {
        if (res.success) {
          this.transferData = this.generateData(res.data);
        }
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
        panelId: this.panelId,
        filterIds: this.transferValue.join(",")
      };
      configFilter(data).then(res => {
        this.queryFilterConfig();
      });
    },
    defaultQuerySearch() {
      this.getlocalStorage = JSON.parse(localStorage.getItem('queryModuleData')) ? JSON.parse(localStorage.getItem('queryModuleData')).find(item => item.name == this.name) ? JSON.parse(localStorage.getItem('queryModuleData')).find(item => item.name == this.name).chartArr.find(item => item.panelId == this.panelId) : {} : {}
      if (this.getlocalStorage && this.getlocalStorage.queryModuleData) {
        this.queryModuleData = this.getlocalStorage.queryModuleData
        this.isExpired = false
        if (this.getlocalStorage.date && this.getlocalStorage.date != this.date){
          this.isExpired = true
          this.queryModuleData = {}
        }
      }
    },
    queryFilterConfig(type) {
      const data = {
        panelId: this.panelId
      };
      this.conditionsModuleList = []
      queryFilterConfig(data).then(res => {
        this.transferVisible = false;
        this.$nextTick(() => {
          this.conditionsModuleList = res.data;
          let keyList = res.data.map(item => item.property)
          for (var key in this.queryModuleData) {
            if (!keyList.includes(key)) {
              if (key.includes('Date')) {
                this.$set(this.queryModuleData, key, ['', ''])
              } else if (key.includes('Array')) {
                this.$set(this.queryModuleData, key, [])
              } else {
                this.$set(this.queryModuleData, key, null)
              }
            }
          }
          this.defaultQuerySearch()
          // 数据初始化设置
          res.data.forEach(item => {
            // 设置默认筛选项
            if (item.defaultFilter){
              !this.queryModuleData[item.property] && this.$set(this.queryModuleData, item.property, item.defaultFilter);
              !this.defaultSearchTerms[item.property] && this.$set(this.defaultSearchTerms, item.property, item.defaultFilter);
            }
            if (item.filterType.includes("Many")) {
              if (this.queryModuleData[item.property] || this.custId) {
                if (["被申请人", "转让人"].includes(item.filterName)) {
                } else if (item.filterName == '申请人姓名') {
                } else if (item.filterName == '客户') {
                  if (this.queryModuleData[item.property] && this.queryModuleData[item.property].length || item.property == 'custId' || this.custId) {
                    this.$set(this.defaultSearchTerms, item.property, []);
                    if (this.custId){
                      this.queryModuleData[item.property] = [this.custId]
                      this.$set(this.defaultSearchTerms, item.property, [this.custId]);
                    }
                    this.queryModuleData[item.property] && this.queryModuleData[item.property].length && queryCustomerNameId({custIdArray: this.queryModuleData[item.property] }).then(res => {
                      this.$set(item, 'valueList', res.data.map(i => ({id: i.custId, value: i.name})))
                    })
                  }
                } else {
                  if (item.values) {
                    item.valueList = item.values.filter(i => i.id == this.queryModuleData[item.property])
                  }
                }
              } else {
                this.$set(this.queryModuleData, item.property, []);
                this.$set(this.defaultSearchTerms, item.property, []);
                item.valueList = []
              }
            }
            // if (item.filterType.includes("checkbox")) {
            //   if (this.queryModuleData[item.property] && this.queryModuleData[item.property].length) {
            //     this.$set(this.queryModuleData, item.property, this.queryModuleData[item.property]);
            //   } else {
            //     this.$set(this.queryModuleData, item.property, []);

            //   }
            //   if (item.defaultFilter){
            //     this.$set(this.defaultSearchTerms, item.property, item.defaultFilter);
            //   }else{
            //     this.$set(this.defaultSearchTerms, item.property, []);
            //   }
            // }
            // if (item.filterType.includes("searchRange")) {
            //   if (this.queryModuleData[item.property] && this.queryModuleData[item.property].length) {
            //     this.$set(this.queryModuleData, item.property, this.queryModuleData[item.property]);
            //   } else {
            //     this.$set(this.queryModuleData, item.property, ['', '']);
            //   }
            //   if (item.defaultFilter){
            //     this.$set(this.defaultSearchTerms, item.property, item.defaultFilter);
            //   }else{
            //     this.$set(this.defaultSearchTerms, item.property, ['', '']);
            //   }
            // }
            // if (item.filterType.includes("searchCompare")) {
            //   if (this.queryModuleData[item.property] && this.queryModuleData[item.property].length) {
            //     this.$set(this.queryModuleData, item.property, this.queryModuleData[item.property]);
            //   } else {
            //     this.$set(this.queryModuleData, item.property, ['', '']);
            //   }
            //   if (item.defaultFilter){
            //     this.$set(this.defaultSearchTerms, item.property, item.defaultFilter);
            //   }else{
            //     this.$set(this.defaultSearchTerms, item.property, ['', '']);
            //   }
            // }

            if (item.filterType.includes("checkbox") || item.filterType.includes("searchRange") || item.filterType.includes("searchCompare")) {
              const propertyValue = this.queryModuleData[item.property] && this.queryModuleData[item.property].length
                ? this.queryModuleData[item.property]
                : (item.filterType.includes("checkbox") ? [] : ['', '']);

              this.$set(this.queryModuleData, item.property, propertyValue);

              const defaultFilterValue = item.defaultFilter ? item.defaultFilter : (item.filterType.includes("checkbox") ? [] : ['', '']);
              this.$set(this.defaultSearchTerms, item.property, defaultFilterValue);
            }
          });

          // this.$set(this.queryModuleData, 'custId', this.custId)

          // 记录初始化搜索项，后期重置需要
          this.defaultSearchTerms = JSON.parse(JSON.stringify(this.defaultSearchTerms))

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
          this.saveSearchCriteria()
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
          panelId: this.panelId,
          value: JSON.stringify(this.queryModuleData)
        }
        addFilterScheme(data).then(res => {
          this.addFilterState = false
          this.getFilterScheme()
        })
      }
    },
    // 点击外侧关闭
    clickoutside() {
      // this.drawerState = false
    },
    // 顶部搜索项触发事件
    // Select
    handleSelectSearch(value) {
      this.handleSearch()
    },
    // DataPicker
    changeDataPicker(value) {
      if (!this.drawerState){
        value[0] && value[1] && this.handleSearch()
      }
    },
    // searchRange 年份筛选
    handleSearchRange(filed) {
      this.yearErrorMessage(filed) && this.queryModuleData[filed][0] && this.queryModuleData[filed][1] && this.handleSearch()
    },
    // searchCompare,输一个，然后另一个自动变为前一年或后一年
    handleSearchCompare(filed,index,search) {
      if(this.yearErrorMessage(filed)) {
        if (this.queryModuleData[filed][0] && index === 0) {
          this.$set(this.queryModuleData[filed],1,parseInt(this.queryModuleData[filed][0])+1)
        }
        if (this.queryModuleData[filed][1] && index === 1) {
          this.$set(this.queryModuleData[filed],0,parseInt(this.queryModuleData[filed][1])-1)
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
    handleSearch(flag) {
      this.drawerState = false
      this.saveSearchCriteria()
      this.$emit('search', 1)
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
      if (arr.find(item => item.name == this.name)){
        // 判断是否该图表id是否存在搜索条件
        if (arr.find(item => item.name == this.name).chartArr.find(item => item.panelId == this.panelId)) {
          if (!this.isExpired){
            arr.find(item => item.name == this.name).chartArr.find(item => item.panelId == this.panelId).queryModuleData = queryModuleData
          }else{
            var arr_index = arr.find(item => item.name == this.name).chartArr.findIndex(item => item.panelId == this.panelId)
            arr.find(item => item.name == this.name).chartArr.splice(arr_index,1)
            arr.find(item => item.name == this.name).chartArr.push(chartSearch)
          }
        }else{
          arr.find(item => item.name == this.name).chartArr.push(chartSearch)
        }
      } else {
        arr.push({name: this.name, chartArr: [ chartSearch ] })
      }
      localStorage.setItem('queryModuleData', JSON.stringify(arr))
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
    searchState() {
      this.drawerState = this.searchState
    },
    drawerState() {
      // 判断是否有获取请求
      !this.schemeList.flag && this.getFilterScheme()
    }
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

.search-top .el-form{
  .el-form-item{
    border: #E5E5E5 solid 1px;
    margin-right: 10px;
    float: left;
    margin-bottom: 5px;
    padding: 0 5px;
  }

  .el-radio-group .el-radio{
    margin-right: 10px;
  }

  .postInfo-container-item {
    /deep/ .el-form-item__content {
      width: 100%;
      display: flex;
      //height: 28px;
      align-items: center;

      .el-select {
        width: 100%;
        .el-input__inner{
          border: 0 !important;
        }
      }

      .el-input {
        width: 100%;
      }

      .el-autocomplete {
        width: 100%;
      }
      .search-mini-input{
        width: 40px !important;
        .el-input__inner{
          text-align: center;
          border: 0 !important;
          padding: 0 5px !important;
        }
      }
      .el-input--suffix .el-input__inner{

      }
      .DataPicker {
        line-height: inherit;
        .el-input__inner{
          border: 0 !important;
          width: 100px;
          padding: 0 5px;
        }
      }
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
    top: 10px;
    min-height: 200px;
    max-height: 330px;
    overflow-y: auto;
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
      max-height: 285px;

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
