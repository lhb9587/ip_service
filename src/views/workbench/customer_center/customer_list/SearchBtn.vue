<template>
  <div>
    <el-button-group class="button-group-search" v-clickoutside="clickoutside">
      <el-button id="mySearch" style="margin-right:0" type="primary" @click="handleSearch(0)">高级搜索
      </el-button>
      <el-button type="primary" class="searchRight" icon="el-icon-arrow-down"
                 @click.stop.prevent="drawerState = true"></el-button>
      <!--      <transition name="show" mode="out-in">-->
      <!--        <div class="searchWrap" id="searchWrap" v-show="drawerState">-->
      <!--          <el-form size="mini" label-width="120px" class="form-container" @keyup.enter.native="handleSearch(0)"-->
      <!--                   style="margin-top: 2px">-->
      <!--            <el-form-item :label="item.filterName+':'"-->
      <!--                          :class="item.filterType==='radio'&&item.values.length>3?'fullItem':'postInfo-container-item'"-->
      <!--                          v-for="(item, index) in conditionsModuleList" :key="index">-->

      <!--              <el-select v-model="queryModuleData[item.property]" placeholder="请选择"-->
      <!--                         v-if="item.filterType==='select'" filterable clearable>-->
      <!--                <el-option v-for="itm in item.values" :key="itm.id" :label="itm.value" :value="itm.id">-->
      <!--                </el-option>-->
      <!--              </el-select>-->
      <!--              &lt;!&ndash;<el-checkbox-group style="display:flex" v-model="queryModuleData[item.property]" v-if="item.filterType==='checkbox'">&ndash;&gt;-->
      <!--              &lt;!&ndash;<el-checkbox v-for="itm in item.values" :label="itm.value" :key="itm.id">{{itm.value}}</el-checkbox>&ndash;&gt;-->
      <!--              &lt;!&ndash;</el-checkbox-group>&ndash;&gt;-->
      <!--              <el-select v-if="item.filterType==='checkbox'&&item.values&&item.values.length"-->
      <!--                         v-model="queryModuleData[item.property]" multiple placeholder="请选择" filterable clearable>-->
      <!--                <el-option v-for="itm in item.values" :key="itm.id" :label="itm.value" :value="itm.id">-->
      <!--                </el-option>-->
      <!--              </el-select>-->
      <!--              <el-select v-if="item.filterType==='selectMany'" v-model="queryModuleData[item.property]" filterable-->
      <!--                         remote clearable reserve-keyword placeholder="请输入关键词" :remote-method="(queryString)=>{-->
      <!--            remoteMethod(queryString,index,item.property,item.filterName);-->
      <!--            }">-->
      <!--                <el-option v-for="itm in item['valueList']" :key="itm.id" :label="itm.value" :value="itm.id">-->
      <!--                </el-option>-->
      <!--              </el-select>-->
      <!--              <el-select v-if="item.filterType==='selectMultipleMany'" multiple-->
      <!--                         v-model="queryModuleData[item.property]" filterable remote clearable reserve-keyword-->
      <!--                         placeholder="请输入关键词" :remote-method="(queryString)=>{-->
      <!--            remoteMethod(queryString,index,item.property,item.filterName);-->
      <!--            }">-->
      <!--                <el-option v-for="itm in item['valueList']" :key="itm.id" :label="itm.value" :value="itm.id">-->
      <!--                </el-option>-->
      <!--              </el-select>-->
      <!--              <el-select v-if="item.filterType==='selectTableMany'" v-model="queryModuleData[item.property]"-->
      <!--                         filterable remote clearable reserve-keyword placeholder="请输入关键词" :remote-method="(queryString)=>{-->
      <!--            remoteMethod(queryString,index,item.property,item.filterName); }">-->
      <!--                <el-option disabled label="" value="">-->
      <!--            <span-->
      <!--              v-for="(itmx,key) in getAppTitleList(item.filterName,item['valueList']?item['valueList'][0]:undefined)"-->
      <!--              v-if="key!='id'">-->
      <!--            {{itmx}}-->
      <!--            </span>-->
      <!--                </el-option>-->
      <!--                <el-option v-for="(itm, idx) in item['valueList']" :key="itm.id" :label="itm.value" :value="itm.id">-->
      <!--                  <el-tooltip v-for="(itmx, key) in item['valueList'][idx]" v-if="key!='id'" class="item"-->
      <!--                              effect="light" :content="itmx" placement="top">-->
      <!--                    <span>{{itmx}}</span>-->
      <!--                  </el-tooltip>-->
      <!--                </el-option>-->
      <!--              </el-select>-->
      <!--              <el-select v-if="item.filterType==='selectTableMultipleMany'" v-model="queryModuleData[item.property]"-->
      <!--                         multiple filterable remote clearable reserve-keyword placeholder="请输入关键词" :remote-method="(queryString)=>{-->
      <!--            remoteMethod(queryString,index,item.property,item.filterName); }">-->
      <!--                <el-option disabled label="" value="">-->
      <!--            <span-->
      <!--              v-for="(itmx,key) in getAppTitleList(item.filterName,item['valueList']?item['valueList'][0]:undefined)"-->
      <!--              v-if="key!='id'">-->
      <!--            {{itmx}}-->
      <!--            </span>-->
      <!--                </el-option>-->
      <!--                <el-option v-for="(itm, idx) in item['valueList']" :key="itm.id" :label="itm.value" :value="itm.id">-->
      <!--                  <el-tooltip v-for="(itmx, key) in item['valueList'][idx]" v-if="key!='id'" class="item"-->
      <!--                              effect="light" :content="itmx" placement="top">-->
      <!--                    <span>{{itmx}}</span>-->
      <!--                  </el-tooltip>-->
      <!--                </el-option>-->
      <!--              </el-select>-->
      <!--              <el-select v-if="item.filterType==='selectTable'" v-model="queryModuleData[item.property]" filterable-->
      <!--                         clearable placeholder="请选择">-->
      <!--                <el-option v-for="(itm ,idx) in item.values" :key="idx" :label="itm.value" :value="itm.id"-->
      <!--                           :disabled="itm.id==-1">-->
      <!--                  <span v-for="(itmx ,key) in item['values'][idx]" v-if="key!='id'">{{itmx}}</span>-->
      <!--                </el-option>-->
      <!--              </el-select>-->
      <!--              <el-radio-group v-model="queryModuleData[item.property]" v-if="item.filterType==='radio'">-->
      <!--                <el-radio :label="itm.id" v-for="itm,index in item.values" :key="index">{{itm.value}}</el-radio>-->
      <!--              </el-radio-group>-->
      <!--              <el-input clearable v-model="queryModuleData[item.property]" :placeholder="'请输入'+item.filterName"-->
      <!--                        v-if="item.filterType==='text'"></el-input>-->
      <!--              <el-input clearable v-model="queryModuleData[item.property]" :placeholder="'请输入'+item.filterName"-->
      <!--                        type="textarea" v-if="item.filterType==='textarea'"></el-input>-->
      <!--              <el-input clearable v-model="queryModuleData[item.property.split(',')[0]]"-->
      <!--                        :placeholder="'请输入'+item.filterName" v-if="item.filterType==='textRange'"-->
      <!--                        @change="(string)=>changeTextRange(string,index,item.property)"></el-input>-->
      <!--              <span v-if="item.filterType==='textRange'" v-show="item.property.includes(',')">至</span>-->
      <!--              <el-input clearable v-model="queryModuleData[item.property.split(',')[1]]"-->
      <!--                        :placeholder="'请输入'+item.filterName" v-if="item.filterType==='textRange'"></el-input>-->
      <!--              <DataPicker class="DataPicker" v-if="item.filterType==='date'"-->
      <!--                          v-model="queryModuleData[item.property]"></DataPicker>-->
      <!--              <el-multi-cascader-->
      <!--                ref="multiCascader"-->
      <!--                :class="item.property"-->
      <!--                v-if="item.filterType==='cascader'"-->
      <!--                :show-all-levels="false"-->
      <!--                :options="item.values"-->
      <!--                multiple-->
      <!--                filterable-->
      <!--                clearable-->
      <!--                :props="defaultParams"-->

      <!--                change-on-select-->
      <!--                selectChildren-->
      <!--                v-model="queryModuleData[item.property]"></el-multi-cascader>-->
      <!--            </el-form-item>-->
      <!--          </el-form>-->
      <!--          <el-button style="position:absolute;top: 10px;right: 10px" type="text" size="small" @click="queryFilter">-->
      <!--            <i class="el-icon-s-tools"></i>更多-->
      <!--          </el-button>-->
      <!--          <div class="clearWrap" v-if="drawerState" id="clearWrap">-->

      <!--            <el-button size="mini" @click="clearSearch"><span>重置</span></el-button>-->
      <!--            <el-button type="primary" size="mini" @click="handleSearch(0)">搜索</el-button>-->
      <!--          </div>-->
      <!--        </div>-->
      <!--      </transition>-->
    </el-button-group>

    <el-dialog title="搜索" class="abow_dialog" :visible.sync="drawerState" append-to-body width="600px">
      <transition name="show" mode="out-in">
        <div class="searchWrap" id="searchWrap">
          <el-form size="mini" label-width="130px" class="form-container" @keyup.enter.native="handleSearch(0)"
                   style="margin-top: 15px;display: flex;justify-content: center">
            <el-form-item :label="item.filterName+':'"
                          :class="item.filterType==='radio'&&item.values.length>3?'fullItem':'postInfo-container-item'"
                          v-for="(item, index) in conditionsModuleList" :key="index">

              <el-select v-model="queryModuleData[item.property]" placeholder="请选择"
                         v-if="item.filterType==='select'" filterable clearable>
                <el-option v-for="itm in item.values" :key="itm.id" :label="itm.value" :value="itm.id">
                </el-option>
              </el-select>
              <!--<el-checkbox-group style="display:flex" v-model="queryModuleData[item.property]" v-if="item.filterType==='checkbox'">-->
              <!--<el-checkbox v-for="itm in item.values" :label="itm.value" :key="itm.id">{{itm.value}}</el-checkbox>-->
              <!--</el-checkbox-group>-->
              <el-select v-if="item.filterType==='checkbox'&&item.values&&item.values.length"
                         v-model="queryModuleData[item.property]" multiple placeholder="请选择" filterable clearable>
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
                <el-option v-for="(itm, idx) in item['valueList']" :key="itm.id" :label="itm.value" :value="itm.id">
                  <el-tooltip v-for="(itmx, key) in item['valueList'][idx]" v-if="key!='id'" class="item"
                              effect="light" :content="itmx" placement="top">
                    <span>{{itmx}}</span>
                  </el-tooltip>
                </el-option>
              </el-select>
              <el-select v-if="item.filterType==='selectTableMultipleMany'" v-model="queryModuleData[item.property]"
                         multiple filterable remote clearable reserve-keyword placeholder="请输入关键词" :remote-method="(queryString)=>{
            remoteMethod(queryString,index,item.property,item.filterName); }">
                <el-option disabled label="" value="">
            <span
              v-for="(itmx,key) in getAppTitleList(item.filterName,item['valueList']?item['valueList'][0]:undefined)"
              v-if="key!='id'">
            {{itmx}}
            </span>
                </el-option>
                <el-option v-for="(itm, idx) in item['valueList']" :key="itm.id" :label="itm.value" :value="itm.id">
                  <el-tooltip v-for="(itmx, key) in item['valueList'][idx]" v-if="key!='id'" class="item"
                              effect="light" :content="itmx" placement="top">
                    <span>{{itmx}}</span>
                  </el-tooltip>
                </el-option>
              </el-select>
              <el-select v-if="item.filterType==='selectTable'" v-model="queryModuleData[item.property]" filterable
                         clearable placeholder="请选择">
                <el-option v-for="(itm ,idx) in item.values" :key="idx" :label="itm.value" :value="itm.id"
                           :disabled="itm.id==-1">
                  <span v-for="(itmx ,key) in item['values'][idx]" v-if="key!='id'">{{itmx}}</span>
                </el-option>
              </el-select>
              <el-radio-group v-model="queryModuleData[item.property]" v-if="item.filterType==='radio'">
                <el-radio :label="itm.id" v-for="itm,index in item.values" :key="index">{{itm.value}}</el-radio>
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
              <el-multi-cascader
                ref="multiCascader"
                :class="item.property"
                v-if="item.filterType==='cascader'"
                :show-all-levels="false"
                :options="item.values"
                multiple
                filterable
                clearable
                :props="defaultParams"

                change-on-select
                selectChildren
                v-model="queryModuleData[item.property]"></el-multi-cascader>
            </el-form-item>
          </el-form>
          <el-button style="position:absolute;top: 10px;right: 70px" type="text" size="small" @click="queryFilter">
            <i class="el-icon-s-tools"></i>更多
          </el-button>
          <div class="clearWrap" v-if="drawerState" id="clearWrap">
            <el-button size="mini" @click="clearSearch"><span>重置</span></el-button>
            <el-button type="primary" size="mini" @click="handleSearch(0)">搜索</el-button>
          </div>
        </div>
      </transition>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="transferVisible" width="80%" append-to-body>
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
  import {
    fetchList,
    delCustomer,
    querycustSelectClass,
    queryCustomerNameIdUrl,
    queryCountryUrl,
    updateLevelUrl,
    queryIndustryUrl,
    queryFiliale,
    searchtmdataUrl,
    queryAppInfoUrl,
    queryCustomerUrl
  } from "@/api/customerList";
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
    queryApplicantByIdList
  } from '@/api/caseList.js'
  import Pagination from "@/components/Pagination";
  import {mapGetters} from "vuex";
  // import CustZs from "./components/CustZs"
  const defaultData = {
    pageNo: 1,
    pageSize: 10,
    keyword: "",
    createTime: "",
    country: "",
    isCustomer: "1",
    examineStatuss: "",
    fullname: "",
    curStatusArray: [],
    custIntroductor: "",
    ownerDeptid: "",
    induId: ""
  }
  export default {
    name: "SearchBtn",
    props: {
      name: {},
      bussId: {
        type: Number
      }
    },
    data() {
      return {
        transferData: [],
        transferValue: [],
        transferVisible: false,
        conditionsModuleList: [],
        drawerState: false,
        queryModuleData: {},
        defaultParams: {
          //級聯菜單默認
          value: "id",
          label: "sourceName",
          children: "childrens",
          checkStrictly: true,
          multiple: true
        },
      }
    },
    created() {
      this.queryFilterConfig(1)
    },
    methods: {
      getList() {

      },
      defaultQuerySearch() {
        this.queryModuleData = JSON.parse(localStorage.getItem('queryModuleData')) ? JSON.parse(localStorage.getItem('queryModuleData')).find(item => item.name == this.name) ? JSON.parse(localStorage.getItem('queryModuleData')).find(item => item.name == this.name).queryModuleData : {} : {}
      },
      clickoutside() {
        this.drawerState = false
      },
      changeTextRange(value, property) {
        this.$set(this.queryModuleData, property, value);
      },
      remotepinput(query, cb) {
        queryCustomerNameIdUrl({keyword: query, isCustomer: 1}).then(response => {
          let restaurants = response.data.map(ite => {
            return {value: ite.fullname}
          });
          const results = query
            ? restaurants.filter(this.createStateFilter(query))
            : restaurants

          cb(results)
        })
      },
      remoteMethod(value, index, property, filterName) {
        if (value && (filterName === "客户" || filterName === "客户名称" || filterName === "父单位")) {
          queryCustomerNameId({pageNo: 1, pageSize: 100, keyword: value}).then(
            res => {
              this.$set(
                this.conditionsModuleList[index],
                "valueList",
                res.data.map(item => ({id: item.custId, value: item.name}))
              );
              this.$forceUpdate()
            }
          )
        }
      },
      getAppTitleList() {

      },
      configFilter() {
        if (this.transferValue.find(item => item == 246 || item == 447)) {
          this.transferValue.unshift(246, 447)
        }
        const data = {
          bussId: this.bussId,
          filterIds: [...new Set(this.transferValue)].join(",")
        };
        configFilter(data).then(res => {
          this.queryFilterConfig()
        })
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
            let keyList = res.data.map(item => item.property)
            for (var key in this.queryModuleData) {
              if (!keyList.includes(key)) {
                if (key.includes('Date')) {
                  this.$set(this.queryModuleData, key, ['', ''])
                } else if (key.includes('Array') || key.includes('List')) {
                  this.$set(this.queryModuleData, key, [])
                } else {
                  this.$set(this.queryModuleData, key, null)
                }
              }
            }
            this.defaultQuerySearch()
            if (type == 1) {
              // this.getList()
              // this.$emit('search', 1)
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
                    } else if (item.filterName == '客户名称' || item.filterName == '父单位') {
                      if (this.queryModuleData[item.property].length) {
                        queryCustomerNameId({custIdArray: this.queryModuleData[item.property]}).then(res => {
                          this.$set(item, 'valueList', res.data.map(i => ({id: i.custId, value: i.name})))
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
          });
        })
      },
      queryFilter() {
        this.transferVisible = true;
        const data = {
          bussId: this.bussId
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
        })
        return arr
      },
      clearSearch() {
        for (var key in this.queryModuleData) {
          if (key.includes('Array') || key.includes('List')) {
            this.$set(this.queryModuleData, key, [])
          } else if (key === 'sourceIds') {
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
      handleSearch() {
        this.drawerState = false
        // this.selectionState = false;
        for (let key in this.queryModuleData) {
          if (!this.conditionsModuleList.map(item => item.property).includes(key)) {
            delete this.queryModuleData[key]
          }
        }
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
        localStorage.setItem('queryModuleData', JSON.stringify(arr))
        this.$emit('search', 0)
      },
    }
  }
</script>

<style lang="scss" scoped>
  .searchfullRow {
    .searchcol {
      padding-right: 3%;
    }

    /deep/ .el-form-item__label {
      width: 25%;
    }

    /deep/ .el-form-item__content {
      width: 75%;
    }

    /deep/ .el-form-item {
      width: 100%;
    }

    /deep/ .el-input,
    /deep/ .el-select {
      width: 100%;
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

  .el-autocomplete {
    width: 100% !important;
  }

  .clearButton {
    background: #fff;
    color: RGBA(254, 153, 23, 1);
    border: 0;

    /deep/ span {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    img {
      width: 20px;
      margin-right: 8px;
      vertical-align: middle;
    }
  }

  /deep/ .el-popper {
    margin: 0px !important;
  }

  .w-table {
    position: relative;
  }

  .buttonWrap {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    .el-button {
      margin-right: 10px;
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
      }
    }
  }

  .button-group-search {
    margin-left: 15px;
    position: relative;
    display: flex;

    .searchWrap {
      border-radius: 5px;
      top: 40px;
      left: 10px;
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
    }
  }

  .clearWrap {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    right: 20px;
    bottom: 10px;
    position: absolute;
    z-index: 1;
  }

  .DataPicker /deep/ {
    line-height: 28px;

    .el-input__prefix {
      display: none !important;
    }

    .el-input__inner {
      text-align: left;
      padding-left: 15px;
      padding-right: 18px;
    }
  }

  .searchRight {
    margin-left: 0;
    height: 40px;
    border-top-right-radius: 3px !important;
    border-bottom-right-radius: 3px !important;
    padding: 0 5px
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

  > > > .el-dialog__body {
    padding-top: 0;
  }

  .abow_dialog {
    > > > .el-dialog {
      position: absolute;
      top: 50%;
      left: 50%;
      margin: 0 !important;
      transform: translate(-50%, -50%);
      max-height: calc(80%);
      min-height: 400px;
      max-width: calc(100% - 30px);
      display: flex;
      flex-direction: column;
    }

    > > > .el-dialog__header {
      border-bottom: 1px solid #D7D7D7;
    }

    > > > .el-dialog__body {
      overflow: auto;
      padding: 0;
      margin-bottom: 40px;
    }
  }

</style>
