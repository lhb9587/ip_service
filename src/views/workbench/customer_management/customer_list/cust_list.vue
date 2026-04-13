<template>
  <div class="app-container">
    <header class="y-header">{{$route.meta.title}}</header>
    <div class="buttonWrap" style="margin-bottom: 10px">
      <el-button-group class="button-group-search"  v-clickoutside="clickoutside">
        <el-button id="mySearch" style="margin-right:0" type="primary" size="small" @click="handleSearch(0)">搜索</el-button>
        <el-button type="primary"  class="searchRight"  size="small" icon="el-icon-arrow-down" @click.stop.prevent="drawerState=true"></el-button>
        <transition name="show" mode="out-in">
          <div class="searchWrap" id="searchWrap" v-show="drawerState">
            <el-form size="mini" label-width="120px" class="form-container" @keyup.enter.native="handleSearch(0)" style="margin-top: 2px">
              <el-form-item :label="item.filterName+':'"
                            :class="item.filterType==='radio'&&item.values.length>3?'fullItem':'postInfo-container-item'" v-for="item,index in conditionsModuleList" :key="index">

                <el-select v-model="queryModuleData[item.property]" placeholder="请选择" v-if="item.filterType==='select'" filterable clearable>
                  <el-option v-for="itm in item.values" :key="itm.id" :label="itm.value" :value="itm.id">
                  </el-option>
                </el-select>
                <!--<el-checkbox-group style="display:flex" v-model="queryModuleData[item.property]" v-if="item.filterType==='checkbox'">-->
                <!--<el-checkbox v-for="itm in item.values" :label="itm.value" :key="itm.id">{{itm.value}}</el-checkbox>-->
                <!--</el-checkbox-group>-->
                <el-select  v-if="item.filterType==='checkbox'&&item.values&&item.values.length"    v-model="queryModuleData[item.property]" multiple  placeholder="请选择"  filterable  clearable >
                  <el-option v-for="itm in item.values" :key="itm.id" :label="itm.value" :value="itm.id">
                  </el-option>
                </el-select>
                <el-select v-if="item.filterType==='selectMany'" v-model="queryModuleData[item.property]"  filterable remote clearable reserve-keyword placeholder="请输入关键词" :remote-method="(queryString)=>{
            remoteMethod(queryString,index,item.property,item.filterName);
            }">
                  <el-option v-for="itm in item['valueList']" :key="itm.id" :label="itm.value" :value="itm.id">
                  </el-option>
                </el-select>
                <el-select v-if="item.filterType==='selectMultipleMany'" multiple v-model="queryModuleData[item.property]"  filterable remote clearable reserve-keyword placeholder="请输入关键词" :remote-method="(queryString)=>{
            remoteMethod(queryString,index,item.property,item.filterName);
            }">
                  <el-option v-for="itm in item['valueList']" :key="itm.id" :label="itm.value" :value="itm.id">
                  </el-option>
                </el-select>
                <el-select v-if="item.filterType==='selectTableMany'" v-model="queryModuleData[item.property]" filterable remote clearable reserve-keyword placeholder="请输入关键词" :remote-method="(queryString)=>{
            remoteMethod(queryString,index,item.property,item.filterName); }">
                  <el-option disabled label="" value="">
            <span v-for="(itmx,key) in getAppTitleList(item.filterName,item['valueList']?item['valueList'][0]:undefined)" v-if="key!='id'">
            {{itmx}}
            </span>
                  </el-option>
                  <el-option v-for="itm,idx in item['valueList']" :key="itm.id" :label="itm.value" :value="itm.id">
                    <el-tooltip v-for="itmx,key in item['valueList'][idx]" v-if="key!='id'" class="item" effect="light" :content="itmx" placement="top">
                      <span>{{itmx}}</span>
                    </el-tooltip>
                  </el-option>
                </el-select>
                <el-select v-if="item.filterType==='selectTableMultipleMany'" v-model="queryModuleData[item.property]" multiple filterable remote clearable reserve-keyword placeholder="请输入关键词" :remote-method="(queryString)=>{
            remoteMethod(queryString,index,item.property,item.filterName); }">
                  <el-option disabled label="" value="">
            <span v-for="(itmx,key) in getAppTitleList(item.filterName,item['valueList']?item['valueList'][0]:undefined)" v-if="key!='id'">
            {{itmx}}
            </span>
                  </el-option>
                  <el-option v-for="itm,idx in item['valueList']" :key="itm.id" :label="itm.value" :value="itm.id">
                    <el-tooltip v-for="itmx,key in item['valueList'][idx]" v-if="key!='id'" class="item" effect="light" :content="itmx" placement="top">
                      <span>{{itmx}}</span>
                    </el-tooltip>
                  </el-option>
                </el-select>
                <el-select v-if="item.filterType==='selectTable'" v-model="queryModuleData[item.property]" filterable clearable placeholder="请选择">
                  <el-option v-for="itm ,idx in item.values" :key="idx" :label="itm.value" :value="itm.id" :disabled="itm.id==-1">
                    <span v-for="itmx ,key in item['values'][idx]" v-if="key!='id'">{{itmx}}</span>
                  </el-option>
                </el-select>
                <el-radio-group v-model="queryModuleData[item.property]" v-if="item.filterType==='radio'">
                  <el-radio :label="itm.id" v-for="itm,index in item.values" :key="index">{{itm.value}}</el-radio>
                </el-radio-group>
                <el-input clearable v-model="queryModuleData[item.property]" :placeholder="'请输入'+item.filterName" v-if="item.filterType==='text'"></el-input>
                <el-input clearable v-model="queryModuleData[item.property]" :placeholder="'请输入'+item.filterName" type="textarea" v-if="item.filterType==='textarea'"></el-input>
                <el-input clearable v-model="queryModuleData[item.property.split(',')[0]]" :placeholder="'请输入'+item.filterName" v-if="item.filterType==='textRange'"
                          @change="(string)=>changeTextRange(string,index,item.property)"></el-input>
                <span v-if="item.filterType==='textRange'" v-show="item.property.includes(',')">至</span>
                <el-input clearable v-model="queryModuleData[item.property.split(',')[1]]" :placeholder="'请输入'+item.filterName" v-if="item.filterType==='textRange'"></el-input>
                <DataPicker class="DataPicker" v-if="item.filterType==='date'" v-model="queryModuleData[item.property]"></DataPicker>
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
                  v-model="queryModuleData[item.property]"> </el-multi-cascader>
              </el-form-item>
            </el-form>
            <el-button style="position:absolute;top: 10px;right: 10px" type="text" size="small"  @click="queryFilter"><i class="el-icon-s-tools"></i>更多</el-button>
            <div class="clearWrap" v-if="drawerState"  id="clearWrap" >
              <el-popover
                placement="top"
                width="300"
                v-model="addFilterState">
                <div>过滤器名称</div>
                <div><el-input type="text" v-model="schemeName"></el-input></div>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="addFilterState = false">取消</el-button>
                  <el-button type="primary" size="mini" @click="addFilterScheme(2)">确定</el-button>
                </div>
                <el-button  size="mini" slot="reference"><span>保存</span></el-button>
              </el-popover>

              <el-button  size="mini"   @click="clearSearch"><span>重置</span></el-button>
              <el-button  type="primary" size="mini"  @click="handleSearch(0)">搜索</el-button>
            </div>
          </div>
        </transition>
      </el-button-group>
      <el-button v-allow="43" class="filter-item" type="primary" @click="dialogFormxy = true" size="small">
                      设置信用等级
                    </el-button>
                    <router-link v-allow="42" :to="'./cust_creat'" style="margin-left:10px">
                      <el-button type="primary" size="small">新建客户</el-button>
                    </router-link>
    </div>
     <el-form label-width="120px"  @submit.native.prevent size="mini"  @keyup.enter.native="handleSearch(1)" style="margin-top:10px">
      <el-form-item label="客户模糊检索:" style="margin-bottom: 0">
        <el-input type="text" v-model="queryModuleData.keywords" clearable  @change="(e)=>handleSearch(1,!e)" ></el-input>
      </el-form-item>

    </el-form>
<!--    <div class="filter-container" style="margin-bottom:15px">-->
<!--      <el-form :inline="true" :model="listQuery" size="small" class="demo-form-inline">-->
<!--        <el-row class="searchfullRow">-->
<!--          <el-col :span="11" class="searchcol">-->
<!--            <el-form-item label="客户名称">-->
<!--              &lt;!&ndash; <el-select default-first-option :clearable='true' allow-create v-model="listQuery.keyword" no-match-text='暂无数据' loading-text='正在查询' filterable remote reserve-keyword placeholder="请输入关键词"-->
<!--                :remote-method="remotepaternalUnit">-->
<!--                <el-option v-for="item in seletData.custnames" :key="item.custId" :label="item.fullname" :value="item.fullname">-->
<!--                </el-option>-->
<!--              </el-select> &ndash;&gt;-->
<!--              <el-autocomplete class="inline-input" v-model="listQuery.keyword" :fetch-suggestions="remotepinput" placeholder="请输入内容" :trigger-on-focus="false"></el-autocomplete>-->
<!--            </el-form-item>-->

<!--            <el-form-item label="审查状态">-->
<!--              <el-select default-first-option :clearable='true' placeholder="请选择" v-model="listQuery.examineStatus" filterable>-->
<!--                <el-option v-for="item in seletData.scStatu" :key="String(item.id)" :label="item.typeName" :value="String(item.id)">-->
<!--                </el-option>-->
<!--              </el-select>-->
<!--            </el-form-item>-->

<!--            <el-form-item label="客户介绍人">-->
<!--              <el-input v-model="listQuery.custIntroductor" placeholder=""></el-input>-->
<!--            </el-form-item>-->
<!--            <el-form-item label="行业">-->

<!--              <el-select default-first-option :clearable='true' placeholder="请选择" v-model="listQuery.induId" filterable>-->
<!--                <el-option v-for="(item,key) in seletData.industry" :key="key" :label="item.fname" :value="item.induid">-->
<!--                </el-option>-->

<!--              </el-select>-->
<!--            </el-form-item>-->

<!--          </el-col>-->
<!--          <el-col :span="11" class="searchcol">-->
<!--            <el-form-item label="国籍">-->
<!--              <el-select default-first-option :clearable='true' placeholder="请选择" v-model="listQuery.country" filterable>-->
<!--                <el-option v-for="item in seletData.country" :key="String(item.countryCn)" :label="item.countryCn" :value="String(item.countryCn)">-->
<!--                </el-option>-->
<!--              </el-select>-->
<!--            </el-form-item>-->
<!--            <el-form-item label="创建日期">-->
<!--              <el-date-picker v-model="listQuery.createTime" format='yyyy-MM-dd' value-format="yyyy-MM-dd" align="right" type="date" placeholder="选择日期" :picker-options="pickerOptions">-->
<!--              </el-date-picker>-->
<!--            </el-form-item>-->
<!--            <el-form-item label="客户所有者">-->

<!--              <el-select default-first-option :clearable='true' placeholder="请选择" v-model="listQuery.ownerDeptid" filterable>-->
<!--                <el-option v-for="item in seletData.customerOwner" :key="item.deptId" :label="item.name" :value="item.deptId">-->
<!--                </el-option>-->
<!--              </el-select>-->
<!--            </el-form-item>-->
<!--          </el-col>-->
<!--          <el-col :span="2" class="searchcol">-->
<!--            <el-button type="primary" class="clearButton" size="mini" @click="clearSeach"><img src="@/assets/清除@2x.png" alt=""><span>重置</span></el-button>-->
<!--          </el-col>-->
<!--        </el-row>-->
<!--        <el-row class="searchfullRow1">-->
<!--          <el-col :span="24" class="searchcol">-->
<!--            <el-form-item label="合作状态">-->
<!--              <template>-->
<!--                <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选-->
<!--                </el-checkbox>-->
<!--                <el-checkbox-group v-model="listQuery.curStatusArray" @change="handleCheckedCitiesChange">-->
<!--                  <el-checkbox v-for="(item,key) in seletData.curStatusArray" :key='key' :label="item.id">-->
<!--                    {{item.typeName}}-->
<!--                  </el-checkbox>-->

<!--                </el-checkbox-group>-->
<!--              </template>-->
<!--            </el-form-item>-->
<!--          </el-col>-->

<!--        </el-row>-->
<!--        <el-row>-->
<!--          <el-col :span="24" style="text-align:center">-->
<!--            <el-button class="filter-item" type="primary" @click="getList('search')" size="small">-->
<!--              搜索-->
<!--            </el-button>-->

<!--            <el-button v-allow="43" class="filter-item" type="primary" @click="dialogFormxy = true" size="small">-->
<!--              设置信用等级-->
<!--            </el-button>-->
<!--            <router-link v-allow="42" :to="'./cust_creat'" style="margin-left:10px">-->
<!--              <el-button type="primary" size="small">新建客户</el-button>-->
<!--            </router-link>-->

<!--          </el-col>-->
<!--        </el-row>-->
<!--      </el-form>-->

<!--    </div>-->
    <div style="display: flex; position: relative;">
    <TitleTotal :total="total" />
    <div class="button_wrap" v-if="selectionState">
      <el-button class="exactButton" size="mini" type="primary" @click="jumpDetailSubmisson">{{multipleTypeText}}</el-button>
      <el-button class="exactButton"  size="mini" @click="selectionState=false">取消</el-button>
    </div>
    <div style="cursor: pointer; position: absolute; display: flex; align-items: center; right: 0px; bottom: -6px; font-size: 14px; padding-right: 6px;">
      <el-button type="text" @click="exportList(2)" >导出</el-button>
      <span style="color: #52A2F4;margin: 0 5px"> / </span>
      <el-button type="text" @click="exportList(1)">全局导出</el-button>
<!--      <el-button type="text"  @click="exportList(1)"><i class="el-icon-download">导出</i></el-button>-->
<!--      <img @click="exportList(2)" src="@/assets/moon.png" style="width: 16px;height: 16px" width="16" alt="">-->
    </div>
    </div>
    <div class="w-table contextmenu">
      <div  class="dots" @click="handleCheckboxState">
        <span class="dot">.</span>
        <span class="dot">.</span>
        <span class="dot">.</span>
      </div>
    <AgGridVue :style="{width:'100%',height: clientHeight+'px'}"
               class="ag-theme-balham"
               :columnDefs="columnDefs"
               :rowData="custList"
               rowSelection="multiple"
               @grid-ready="onGridReady"
               :gridOptions="gridOptions"
               @dragStopped="dragStopped"
               :getContextMenuItems="getContextMenuItems"
               @rowDoubleClicked="rowDoubleClicked"
               suppressAutoSize

               animateRows
               @sortChanged="refreshEvenRowsCurrencyData"
               @filterChanged="refreshEvenRowsCurrencyData"
               :localeText="$store.state.caseInformation.localeText"
               :suppressDragLeaveHidesColumns="true"
               :suppressMakeColumnVisibleAfterUnGroup="true"
               rowGroupPanelShow="always"
               :groupSelectsChildren="true"
               :suppressAggFuncInHeader="true"
               :autoGroupColumnDef="autoGroupColumnDef"

    >
    </AgGridVue>
<!--    <el-table size="mini" :data="list" border fit empty-text="暂无数据" highlight-current-row current-row-key style="width: 100%;">-->
<!--      <el-table-column type="index" width="50" label="序号" align="left"></el-table-column>-->
<!--      <el-table-column label="名称" align="left" width>-->
<!--        <template slot-scope="scope">-->
<!--          <span class="itemTitle_style" @click="$router.push('./cust_edit/'+scope.row.custId+'/xg')">{{ scope.row.fullname }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column label="国籍" align="left" width>-->
<!--        <template slot-scope="scope">-->
<!--          <span>{{ scope.row.country }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column label="合作状态" align="left" width>-->
<!--        <template slot-scope="scope">-->
<!--          <span>{{ scope.row.curStatusStr }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->

<!--      <el-table-column label="审查状态" align="left" width>-->
<!--        <template slot-scope="scope">-->
<!--          <span>{{ scope.row.examineStatusStr }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column label="创建日期" align="left" width>-->
<!--        <template slot-scope="scope">-->
<!--          <span>{{ scope.row.createTime }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->

<!--      <el-table-column label="操作" align="left" width="430" class-name="small-padding fixed-width">-->
<!--        <template slot-scope="scope">-->
<!--          <el-row>-->
<!--            <el-col :span="24">-->

<!--              <router-link v-allow="49" v-if="scope.row.examineStatusStr=='审查中'" :to="'./cust_edit/'+scope.row.custId+'/sc'">-->
<!--                <el-button type="text" size="medium">-->
<!--                  审查-->
<!--                </el-button>-->
<!--              </router-link>-->
<!--              <el-button v-allow="48" size="medium" type="text" @click="zsclick(scope.row.custId)">客户指示</el-button>-->
<!--              <el-button v-allow="47" size="medium" type="text"-->
<!--                @click='$router.push({path: "/workbench/customer_management/applicant_list",query: { name: scope.row.name, custId: scope.row.custId }})'>申请人-->
<!--              </el-button>-->
<!--              <el-dropdown v-allow="46" trigger="click" @command="(val)=>{listsbbtn(val,scope.row)}">-->

<!--                <el-button class="el-dropdown-link" type="text" size="medium">-->
<!--                  商标-->
<!--                </el-button>-->

<!--                <el-dropdown-menu slot="dropdown">-->
<!--                  <el-dropdown-item command="1">详情</el-dropdown-item>-->
<!--                  <el-dropdown-item command="2">导入</el-dropdown-item>-->
<!--                  <el-dropdown-item command="3">统计</el-dropdown-item>-->
<!--                </el-dropdown-menu>-->
<!--              </el-dropdown>-->
<!--              <el-dropdown v-allow="44" trigger="click" @command="(val)=>{listajbtn(val,scope.row)}">-->

<!--                <el-button class="el-dropdown-link" type="text" size="medium">-->
<!--                  案件-->
<!--                </el-button>-->

<!--                <el-dropdown-menu slot="dropdown">-->
<!--                  <el-dropdown-item command="1">详情</el-dropdown-item>-->
<!--                  <el-dropdown-item command="3">统计</el-dropdown-item>-->
<!--                </el-dropdown-menu>-->
<!--              </el-dropdown>-->

<!--              &lt;!&ndash; <el-button size="medium" type="text">案件</el-button> &ndash;&gt;-->
<!--              <el-button v-allow="45" size="medium" @click='$router.push({path: "/workbench/finance/bill",query: { name: scope.row.name, custId: scope.row.custId }})' type="text">账单</el-button>-->
<!--            </el-col>-->
<!--          </el-row>-->
<!--          <el-row>-->
<!--            <el-col :span="24">-->

<!--              <router-link v-allow="50" :to="'./cust_edit/'+scope.row.custId+'/xg'">-->
<!--                <el-button type="text" size="medium">-->
<!--                  修改-->
<!--                </el-button>-->
<!--              </router-link>-->
<!--              <el-button v-allow="51" size="medium" type="text" @click="handledeleElement(scope.row,scope.$index)">删除</el-button>-->
<!--            </el-col>-->
<!--          </el-row>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--    </el-table>-->

    <pagination v-show="total>0" :total="total" :pageSizes="pageSizesList" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <div class="checkbox" v-if="checkboxState">
      <el-select ref="checkCaseSelect" v-model="checkCaseList" multiple   reserve-keyword filterable  placeholder="请选择"  collapse-tags @visible-change="handleChange"  :filter-method="filterCheck">
        <template slot="">
          <div class="checkbox_bottom" >
            <el-button size="mini" round @click.stop="delPreference(1)">恢复默认</el-button>
            <el-button style="margin-right: 3px" size="mini" round @click.stop="savePreference(1)">保存设置</el-button>
          </div>
        </template>
        <el-option
          v-for="item in selectColumnList.filter(item =>item.COLUMN_COMMENT.includes(filterText))"
        :key="item.COLUMN_NAME"
        :label="item.COLUMN_COMMENT"
        :value="item.COLUMN_NAME">
        </el-option>
      </el-select>
    </div>
    </div>
    <el-dialog title="提示" :visible.sync="transferVisible" width="80%" >
      <el-transfer v-model="transferValue" @left-check-change="leftCheckChange" :key="transferData.filterId" :data="transferData" filterable filter-placeholder="请输入搜索内容"
                   :titles="['选择筛选项—全部案件', '已选']">
      </el-transfer>
      <span slot="footer" class="dialog-footer">
        <el-button @click="transferVisible = false">取 消</el-button>
        <el-button type="primary" @click="configFilter">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :show-close="false" :close-on-click-modal="false" title="设置信用等级" :visible.sync="dialogFormxy" width="50%">
      <el-form ref="setXyForm" label-width="100px" :model="xyData" label-position="right" style="width: 100%;">

        <el-form-item label="客户:" class="postInfo-container-item">
          <template>
            <el-select default-first-option :clearable='true' v-model="xyData.custId" no-match-text='暂无数据' loading-text='正在查询' filterable remote reserve-keyword placeholder="请输入关键词"
              :remote-method="remotepaternalUnit">
              <el-option v-for="item in seletData.custnames" :key="item.custId" :label="item.name" :value="item.custId">
              </el-option>
            </el-select>
          </template>
        </el-form-item>

        <el-form-item label="信用等级:" class="postInfo-container-item">
          <template>
            <el-select default-first-option :clearable='true' placeholder="请选择" v-model="xyData.level" filterable>
              <el-option v-for="item in seletData.level" :key="item.typeName" :label="item.typeName" :value="item.typeName">
              </el-option>
            </el-select>
          </template>
        </el-form-item>

        <el-form-item label="备注:" class="postInfo-container-item uploader-custfile">
          <template>
            <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="xyData.memo">
            </el-input>
          </template>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormxy = false">
          取消
        </el-button>
        <el-button type="primary" @click="setXy">
          确定
        </el-button>
      </div>
    </el-dialog>
    <el-dialog title="客户指示" :close-on-click-modal="false" :visible.sync="dialogVisiblezs" width="60%" :modal-append-to-body="false">
      <CustZs :postForm="custdata"></CustZs>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisiblezs = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisiblezs = false">确 定</el-button>
      </span>
    </el-dialog>
    <EmitSearch @undateSearch="undateSearch"></EmitSearch>
    <SelectOption :buss-id="bussId" v-if="selectionOptionState" :dialog-visible="selectionOptionState" @cancel="closeSelect" :idArray="getCurrentRowsData('custId')" :defaultMultipleSelect="preferenceList.map(i=>i.title)" :exportType="exportType" :exportQueryModel="exportQueryModel"></SelectOption>

  </div>
</template>
<script>
  import SelectOption from '@/views/workbench/case/components/SelectOption'
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
import {queryCustomerNameId, selectColumn, queryPreference, savePreference,configFilter ,queryFilterConfig,queryFilter,addFilterScheme,delPreference,queryApplicantByIdList} from '@/api/caseList.js'
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import { mapGetters } from "vuex";
import CustZs from "./components/CustZs";
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
};
export default {
  name: "customer_list",
  computed: {
    ...mapGetters(["token", "name", "roles"]),
    clientHeight() {
      return document.documentElement.clientHeight - 230
    }
  },
  components: { Pagination, CustZs,SelectOption },
  data() {
    var tableHeader=[]
    if(localStorage.getItem('tableHeader')&&JSON.parse(localStorage.getItem('tableHeader')).find(item=>item.name==this.$options.name)){
      tableHeader = JSON.parse(localStorage.getItem('tableHeader')).find(item => item.name == this.$options.name).tableHeader
    }
    return {
      custdata: {},
      dialogVisiblezs: false,
      checkAll: false,
      isIndeterminate: true,
      dialogFormxy: false,
      custList: [],

      listLoading: true,
      // listQuery: {
      //   pageNo: 1,
      //   pageSize: 10,
      //   keyword: "",
      //   isCustomer: "1",
      //   createTime: "",
      //   country: "",
      //   examineStatuss: "",
      //   fullname: "",
      //   curStatusArray: [],
      //   custIntroductor: "",
      //   ownerDeptid: "",
      //   induId: ""
      // },

      gridOptions:{
        ...this.$store.state.caseInformation.gridOptions,...{
          statusBar: {
            statusPanels: [
              { statusPanel: 'agSelectedRowCountComponent', align: 'left' },
            ]
          },
          getRowStyle:(params)=>{
            if(params.node.data){
              if(params.node.data.isCheck==0){
                return { background:'#DCDFE6' }
              }
            }
          },
          //floatingFilter: true,
        }
      },
      defaultcolumnDefs:[
        {
          headerName: '序号',
          field: 'sid',
          width: 80,
          enableRowGroup: true,
          // enablePivot: true,
          floatingFilter:true,
          filter: false,
          cellClass: 'vAlign',
          suppressMenu: true,
          checkboxSelection: false,
          headerCheckboxSelection: false,
          headerCheckboxSelectionFilteredOnly: true,
          cellRenderer:this.cellRenderer
        },
      ],
      columnDefs: [
      ],
      autoGroupColumnDef:{
        headerName: '组',
        field: 'group',
        headerCheckboxSelection: true,
        cellRenderer: 'agGroupCellRenderer',
        cellRendererParams: { checkbox: true },
      },
      total: 0,
      listQuery: {
        pageNo: 1,
        pageSize: JSON.parse(localStorage.getItem('pageSize'))?JSON.parse(localStorage.getItem('pageSize')).find(item=>item.name==this.$route.name)?JSON.parse(localStorage.getItem('pageSize')).find(item=>item.name==this.$route.name).pageSize:10:10
      },
      currentPageSize:0,
      pageSizesList:[10, 50, 200,500,1000,5000,10000],
      checkboxState:false,
      userId: this.$store.getters.userId,
      bussId: 17,
      filterText:'',
      preferenceList: [],
      selectColumnList: [],
      checkCaseList: [],
      tableHeader: tableHeader,
      tableHeaderLabelList:[],
      drawerState:false,
      addFilterState:false,
      schemeName:'',
      conditionsModuleList:[],
      transferVisible: false, // 配置筛选条件框
      transferData: [], // 筛选条件数据
      transferValue: [], // 当前筛选条件id
      queryModuleData:{},
      selectionState:false,
      selectionOptionState:false,
      exportQueryModel:'',
      multipleTypeText:'',
      defaultParams: {
        //級聯菜單默認
        value: "id",
        label: "sourceName",
        children: "childrens",
        checkStrictly: true,
        multiple: true
      },
      deldata: {
        customerID: ""
      },
      seletData: {
        scStatu: {},
        country: {},
        custnames: {},
        level: {},
        industry: [],
        customerOwner: [],
        curStatusArray: []
      },
      pickerOptions: {
        // disabledDate(time) {
        //   return time.getTime() > Date.now();
        // },
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            }
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            }
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            }
          }
        ]
      },
      xyData: {
        custId: "",
        level: "",
        memo: "",
        examineStatus: "1621",
        isCustomer: "1"
      }
    };
  },
  activated() {
    if(this.initFlag){
      this.init(1)
      if(document.querySelector('.ag-body-viewport')){
        document.querySelector('.ag-body-viewport').scrollTop=this.scrollTopY
      }
    }
    this.initFlag=true
  },
  created() {
    // this.$store.commit('caseInformation/SET_BUSSID',this.bussId)

    this.init(1)
  },
  watch:{
    tableHeader(n){
      this.tableHeaderLabelList=n.map(item=>item.label)
    },
    tableHeaderLabelList(n,o){
      if(o.length){
        if(localStorage.getItem('tableHeader')){
          let header=JSON.parse(localStorage.getItem('tableHeader')).find(item=>item.name==this.$options.name).tableHeader
          this.tableHeader.forEach(item=>{
            header.forEach(itm=>{
              if(itm.label==item.label){
                this.$set(item,'width',itm.width)
              }
            })
          })
        }
        this.changeHeader(this.tableHeader)
      }
    },
    selectionState(n){
      this.changeSelection(n)
    },
    checkboxState(n){
      if(n){
        this.$nextTick(()=>{
          this.$refs.checkCaseSelect.focus()
        })
      }
    },
  },
  methods: {
    getCurrentRowsData(key){
      if (this.gridApi && this.gridApi.rowModel) {
        return this.gridApi.rowModel.rootNode.childrenAfterSort.map(item => item.data).map(item => item[key])
      }
      return []
    },
    init(flag){
      this.$store.commit('caseInformation/SET_BUSSID',this.bussId)
      if(flag){
        this.getAllWfs()
        // this.getList();
        this.queryFilterConfig(1);
        this.getallSelectData();
      }else {
        if (this.$route.query.sc == "1" && this.$route.query.custid) {
          this.custList.find(
            item => item.custId == this.$route.query.custid
          ).examineStatusStr = "";
        }
      }
    },
    jumpDetailSubmisson(){
      if (!this.getSelectedRows().length) {
        this.$message.error("请先选择！");
        return;
      }
      if(this.multipleTypeText === "列表导出"){
        this.selectionOptionState=true
      }
    },
    closeSelect(){
      this.selectionState=false
      this.selectionOptionState=false
    },
    exportList(flag){
      this.exportType=flag
      // if(flag==2){
      //   this.selectionState = true;
      //   this.multipleTypeText = '列表导出';
      //   // this.exportListState=true
      // } else if(flag == 1) {
      //   this.selectionOptionState=true
      // }
      this.selectionOptionState = true
    },
    undateSearch(n){
      if(this.bussId==n.bussId) {
        this.queryModuleData = JSON.parse(n.value)
        this.handleSearch(0)
        this.queryFilterConfig()
      }
    },
    handleSearch(f){
      this.drawerState=false
      this.selectionState = false
      this.multipleSelection = []
      this.listQuery.pageNo = 1
      if(f == 1){
        for (let key in this.queryModuleData){
          if(key !== 'keywords'){
            if(key.includes('Date')){
              this.$set(this.queryModuleData,key,['',''])
            } else if(key.includes('Array')) {
              this.$set(this.queryModuleData,key,[])
            }else if(key==='caseTypeIds'||key==='deptGroupIds'){
              this.$set(this.queryModuleData,key,[])
            }else{
              this.$set(this.queryModuleData,key,null)
            }
          }
        }
      }else{
        if(this.queryModuleData.keywords){
          this.queryModuleData.keywords = ''
        }
      }
      if(JSON.parse(localStorage.getItem('queryModuleData'))){
        var arr = JSON.parse(localStorage.getItem('queryModuleData'))
      }else {
        var arr = []
      }
      if(arr.find(item=>item.name==this.$route.name)){
        arr.find(item=>item.name==this.$route.name).queryModuleData=this.queryModuleData
      }else {
        arr.push({name:this.$route.name,queryModuleData:this.queryModuleData})
      }
      localStorage.setItem('queryModuleData',JSON.stringify(arr))
      this.getList()
    },
    clickoutside(){
      this.drawerState=false
    },
    changeHeader(n){
      if(n&&n.length){
        this.checkCaseList=n.map(item => item.prop)
        let list2 = this.checkCaseList.map(item => ({
          title: this.selectColumnList.find(i => i.COLUMN_NAME === item)
            .COLUMN_COMMENT,
          value: item
        }));
        const data = {
          userId: this.userId,
          bussId: this.bussId,
          list2
        };
        savePreference(data).then(res => {
          // this.tableState=false
          // this.$nextTick(()=>{
          //   //  this.tableState=true
          //   this.list.push({})
          //   this.list.pop()
          // })
        });
      }
    },
    addFilterScheme(e){
      if(e==1){
        this.addFilterState=true
      }else if(e==2) {
        if(!this.schemeName||!this.schemeName.trim()){
          this.$message.error('请输入过滤器名称')
          return
        }
        const data={
          schemeName:this.schemeName,
          bussId:this.bussId,
          value: JSON.stringify(this.queryModuleData)
        }
        addFilterScheme(data).then(res=>{
          this.addFilterState = false
        })
      }
    },
    leftCheckChange(e) {
      // if (e.length + this.transferValue.length > 15) {
      //   this.$message({
      //     type: "warning",
      //     message: `您最多选择15项`
      //   });
      //   e.pop();
      // }
    },
    generateData(arr) {

      arr.forEach(item => {
        item.key = item.filterId;
        item.label = item.filterName;
      });
      return  arr
      // return arr.reduce((pre,next)=>{
      //   next.key = next.filterId;
      //   next.label = next.filterName;
      //   if(next.perminId&&this.$store.getters.permissions.includes(next.perminId)){
      //     pre.push(next)
      //   }else {
      //     pre.push(next)
      //   }
      //   return pre
      // },[])
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
    configFilter() {
      const data = {
        bussId: this.bussId,
        filterIds: this.transferValue.join(",")
      };
      configFilter(data).then(res => {
        this.queryFilterConfig();
      });
    },
    defaultQuerySearch(){
      this.queryModuleData = JSON.parse(localStorage.getItem('queryModuleData'))?JSON.parse(localStorage.getItem('queryModuleData')).find(item=>item.name==this.$route.name)?JSON.parse(localStorage.getItem('queryModuleData')).find(item=>item.name==this.$route.name).queryModuleData:{}:{}
    },
    queryFilterConfig(type) {
      const data = {
        bussId: this.bussId
      };
      this.conditionsModuleList=[]
      queryFilterConfig(data).then(res => {
        this.transferVisible = false;
        this.$nextTick(()=>{
          this.conditionsModuleList = res.data;
          let keyList=res.data.map(item=>item.property)
          for (var key in this.queryModuleData) {
            if(!keyList.includes(key)){
              if(key.includes('Date')){
                this.$set(this.queryModuleData,key,['',''])
              } else if(key.includes('Array')||key.includes('List')) {
                this.$set(this.queryModuleData,key,[])
              }else{
                this.$set(this.queryModuleData,key,null)
              }
            }
          }
          this.defaultQuerySearch()
          if(type==1){
            this.getList()
          }
          res.data.forEach(item => {
            if (item.filterType.includes("Many")) {
              if(this.queryModuleData[item.property]){
                if(item.filterType.includes('Many')){
                  if(["被申请人", "转让人"].includes(item.filterName)){
                  } else if(item.filterName=='申请人'){
                    if(this.queryModuleData[item.property]&&this.queryModuleData[item.property].length){
                      queryApplicantByIdList({appIdArray:this.queryModuleData[item.property]}).then(res=>{
                        this.$set(item,'valueList', res.data.map(i => ({
                          id: i.appId,
                          value: i.applicantName,
                          value1: i.applicantEnName,
                          value2: i.applicantAddress,
                          value3: i.applicantEnAddress
                        })))
                      })
                    }
                  } else if(item.filterName=='客户名称' || item.filterName=='父单位'){
                    if(this.queryModuleData[item.property].length){
                      queryCustomerNameId({custIdArray: this.queryModuleData[item.property]}).then(res=>{
                        this.$set(item,'valueList', res.data.map(i => ({ id: i.custId, value: i.name })))
                      })
                    }
                  } else {
                    item.valueList = item.values.filter(i=>i.id==this.queryModuleData[item.property])
                  }
                }
              } else {
                item.valueList=[]
              }
            }
            if (item.filterType.includes("checkbox")) {
              if(this.queryModuleData[item.property]&&this.queryModuleData[item.property].length){
                this.$set(this.queryModuleData, item.property, this.queryModuleData[item.property]);
              }else {
                this.$set(this.queryModuleData, item.property, []);
              }
            }
          });
          this.transferValue = res.data.map(item => item.filterId);
        });
      })
    },
    savePreference(){
      let list2 = this.checkCaseList.map(item => ({ title: this.selectColumnList.find(i => i.COLUMN_NAME === item).COLUMN_COMMENT, value: item }))
      const data={
        userId: this.userId,
        bussId: this.bussId,
        list2
      }
      savePreference(data).then(res => {
        if (res.success) {
          this.checkboxState = false
          this.filterText=''
          this.getList()
          this.getAllWfs()
        }
      })
    },
    handleCheckboxState() {
      this.checkboxState = !this.checkboxState
    },
    handleChange(boolean) {
      if (!boolean) {
        this.checkboxState=false
        const els1 = this.$el.getElementsByClassName('checkbox')[0]
        els1.children[0].click()
      }
    },
    async  getAllWfs() {
      const data = {
        userId: this.userId,
        bussId: this.bussId
      }
      Promise.all([selectColumn(data), queryPreference(data)]).then(res=>{
        this.selectColumnList = res[0].data
        this.preferenceList = res[1].data
        this.columnDefs=[...this.defaultcolumnDefs,...this.preferenceList.map(item=>({
          headerName: item.title,
          field: item.value,
          width:this.getLoactionWidth(item.title)=='auto'?200:this.getLoactionWidth(item.title),
          resizable: true,
          sortable: true,
          enableRowGroup: true,
          filter: 'agSetColumnFilter',
          cellRenderer:this.cellRenderer,
          filterParams: {
             comparator: (a, b)=>{
              return this.$commonUtils.sort(a,b,item.value)
            }
          },
          menuTabs: ['filterMenuTab','generalMenuTab','columnsMenuTab'],
        }))]
        this.$nextTick(()=>{
          this.columnDefs.forEach(item=>{
            this.columnApi.getColumn(item.field).addEventListener('menuVisibleChanged', ()=>{
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
        this.tableHeader = this.preferenceList.map(item=>({ label:item.title, prop:item.value,width: this.getLoactionWidth(item.title)}))
        this.saveLocation()
        this.checkCaseList = this.preferenceList.map(item => item.value)
        // this.preferenceList.forEach(item => {
        //   if(item.title.includes('日期')){
        //     item.width=140
        //   }
        // })
        // this.checkFilterList = this.preferenceList.map(item => false)
      })
    },

    getLoactionWidth(label){
      if(!localStorage.getItem('tableHeader')){
        return 'auto'
      } else {
        var arr= JSON.parse(localStorage.getItem('tableHeader'))
        if(arr.find(item=>item.name==this.$options.name)){
          var header=arr.find(item=>item.name==this.$options.name).tableHeader
          if(header.find(item=>item.label==label)){
            return header.find(item=>item.label==label).width
          } else {
            return 'auto'//String(label).replace(/[\u4E00-\u9FA5]/gi,'aa').length*12+30
          }
        } else {
          return 'auto'
        }
      }
    },
    saveLocation(){
      if(!localStorage.getItem('tableHeader')){
        let arr=[]
        arr.push({name:this.$options.name,tableHeader:this.tableHeader})
        localStorage.setItem('tableHeader',JSON.stringify(arr))
      }else {
        let arr=JSON.parse(localStorage.getItem('tableHeader'))
        if(arr.find(item=>item.name==this.$options.name)){
          arr.find(item=>item.name==this.$options.name).tableHeader= this.tableHeader
          localStorage.setItem('tableHeader',JSON.stringify(arr))
        } else {
          arr.push({name:this.$options.name,tableHeader:this.tableHeader})
          localStorage.setItem('tableHeader',JSON.stringify(arr))
        }
      }
    },
    delPreference() {
      const data = {
        userId: this.userId,
        bussId: this.bussId,
      }
      delPreference(data).then(res=>{
        if(res.success){
          this.checkboxState=false
          this.handleSearch()
          this.getAllWfs()
        }
      })
    },
    cellRenderer(params){
    // @click="$router.push('./cust_edit/'+scope.row.custId+'/xg')">{{ scope.row.fullname }}
    //   if(params.colDef.field=='fullname'){
    //     var eDiv = document.createElement('div');
    //     eDiv.innerHTML = `<span class="btn-simple" style="color:deepskyblue" title="${params.value}">${params.value?params.value:''}</span>`
    //     var eButton = eDiv.querySelectorAll('.btn-simple')[0];
    //
    //     eButton.addEventListener('click', ()=> {
    //       this.takeCaseDetail(params.data,params.colDef.field)
    //     });
    //
    //     return eDiv;
    //   }
      if(params.colDef.field=='sid'){
        return params.rowIndex+1
      }
      return  `<span title="${params.value}">${params.value?params.value:''}</span>`
    },
    refreshEvenRowsCurrencyData(params) {
      this.currentPageSize= params.api.rowModel.rootNode.allChildrenCount
      if(!params.columnApi.columnController.groupAutoColumns){
        this.gridApi.forEachNode(rowNode=> {
          rowNode.setDataValue(
            'sid',
            rowNode.rowIndex + 1)
        });
      }
    },
    changeSelection(n){
      if(n){
        this.columnDefs.find(item=>item.field=='sid').checkboxSelection=function(params) {
          // we put checkbox on the name if we are not doing grouping
          return params.columnApi.getRowGroupColumns().length === 0;
        },
          this.columnDefs.find(item=>item.field=='sid').headerCheckboxSelection= function(params) {
            // we put checkbox on the name if we are not doing grouping
            return params.columnApi.getRowGroupColumns().length === 0;
          }
        this.columnDefs.push({})
        this.columnDefs.pop({})
      }else {
        this.columnDefs.find(item=>item.field=='sid').checkboxSelection=false
        this.columnDefs.find(item=>item.field=='sid').headerCheckboxSelection=false
        this.columnDefs.push({})
        this.columnDefs.pop({})
      }
    },
    getSelectedRows(){
      if(this.selectionState){
        const selectedNodes = this.gridApi.getSelectedNodes();
        const selectedData = selectedNodes.map(node => node.data);
        return selectedData
      } else {
        return []
      }
    },
    onGridReady(params) {
      this.gridApi = params.api;
      this.columnApi = params.columnApi;
    },
    dragStopped(params){
      let tableHeader=params.columnApi.columnController.gridColumns.map(item=>({
        label:item.colDef.headerName ,
        width:item.actualWidth,
        prop:item.colDef.field,
      })).filter(item=>item.prop!='sid'&&item.prop!="group")
      var arr=JSON.parse(localStorage.getItem('tableHeader'))
      arr.find(item=>item.name==this.$options.name).tableHeader=tableHeader
      localStorage.setItem('tableHeader',JSON.stringify(arr))
      this.changeHeader(tableHeader)
    },
    getContextMenuItems(params){
      if(!params.node.data){
        return []
      }
      console.log(params.node.data,this.$router.name,2);
      return  this.getRowContextmenuList(params.node.data).map(item=>{
        if(!item.subMenu){
          return {
            name: item.name,
            action: () =>{
              this[item.action](params.node.data,params.value)
            },
          }
        }else {
          return {
            name: item.name,
            subMenu:item.subMenu.map((itm,idx)=>({
              name:itm.name,
              action: () =>{
                if(item.name=='商标'){
                  this[itm.action]((idx+1),params.node.data)
                }else {
                  this[itm.action]((idx+1),params.node.data)
                }
              },
            }))
          }
        }
      })
    },
    getRowContextmenuList(row){
      return [
        { name: '复制', action: 'copy' },
        { name: '审查', action: 'shencha', permissions:49,examineStatusStr:'审查中'},
        { name: '客户指示', action: 'zsclick', permissions:48},
        { name: '申请人', action: 'goApp', permissions:47, },
        { name: '账单', action: 'takebill', permissions:45, },
        { name:'商标',permissions:46,subMenu:[{name: '详情', action:'listsbbtn'},{name: '导入', action:'listsbbtn'},{name: '统计', action:'listsbbtn'}]},
        { name:'案件',subMenu: [{name: '详情', action:'listajbtn'},{name: '统计', action:'listajbtn'}],permissions:44},
        { name: '修改', action:'takeModify', permissions:50,isCheck:true},
        { name: '删除', action:'handledeleElement', permissions:51}].filter(item=>{
        if(item.permissions){
          if(item.examineStatusStr){
            return this.$store.getters.permissions.includes(item.permissions)&&row.examineStatusStr==item.examineStatusStr
          }else if(item.isCheck){
            return this.$store.getters.permissions.includes(item.permissions)&&row.isCheck==item.isCheck
          }else {
            return this.$store.getters.permissions.includes(item.permissions)
          }
        }else {
          return true
        }
      })
    },
    copy(row, value, event) {
      if(value){
        this.$copyText(value).then(
          res => {
          })
      }
    },
    takeModify(row){
      this.$router.push(`./cust_edit/${row.custId}/xg`)
    },
    goApp(row){
      this.$router.push({path: "/workbench/customer_management/applicant_list",query: { name: row.name, custId: row.custId }})
    },
    shencha(row){
      this.$router.push(`./cust_edit/${row.custId}/sc`)
    },
    takebill(row){
      this.$router.push({path: "/workbench/finance/bill",query: { name: row.name, custId: row.custId }})
    },
    takeCaseDetail(row, type) {
      if (type=='agentNum') {
        if(this.$commonUtils.getTwoDimensionalArray(this.$store.getters.caseTypeList,'caseTypeId',row.caseTypeId).includes(2)){
          this.$router.push('/workbench/case/seeCaseDetail/'+row.caseId+'?taskType=2')
        }else {
          this.$router.push('/workbench/case/seeCaseDetail/'+row.caseId)
        }
      }
    },
    filterCheck(val) {
      this.filterText = val;
    },
    rowDoubleClicked(params){
      var row = params.data
      if (row.isCheck) {
        this.takeSee(row)
      }
    },
    takeSee(row) {
      this.$router.push(`/workbench/customer_management/cust_view/${row.custId}`)
    },
    sortTableByKey(list, key, sort = 'desc') {
      list.forEach(item => !item[key] && (item[key] = ''))
      list = list.sort((a, b) => b[key].localeCompare(a[key]))
    },
    zsclick({custId}) {
      queryCustomerUrl({ customerID: custId }).then(res => {
        this.custdata = res.data;
        this.sortTableByKey(this.custdata.customerRequirements, 'startDate', 'desc')
        this.dialogVisiblezs = true;
      });
    },
    handleCheckAllChange(val) {
      let arr = [];
      this.seletData.curStatusArray.forEach(element => {
        arr.push(element.id);
      });
      this.listQuery.curStatusArray = val ? arr : [];
      this.isIndeterminate = false;
      console.log(this.listQuery.curStatusArray);
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.seletData.curStatusArray.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.seletData.curStatusArray.length;
    },
    // clearSeach() {
    //   this.listQuery = Object.assign({}, defaultData);
    //
    //   this.total = "0";
    // },
    clearSearch(){
      for (var key in this.queryModuleData) {
        if(key.includes('Array')||key.includes('List')){
          this.$set(this.queryModuleData,key,[])
        }else if(key==='sourceIds'){
          this.$set(this.queryModuleData,key,[])

        } else{
          this.$set(this.queryModuleData,key,null)
        }
      }
      if(this.$refs.multiCascader){
        this.$refs.multiCascader.forEach(item=>{
          item.$el.querySelector('.el-input__inner').value=''
        })
      }
    },
    getList(type) {
      this.listLoading = true;
      let conditionsModuleList =this.$commonUtils.getLanglist(this.conditionsModuleList.map(item => item.property).map(item=>item.split(',')))
      for (var key in this.queryModuleData) {
        if(![...conditionsModuleList,...['keywords']].includes(key)){
          delete this.queryModuleData[key]
        }
      }

      this.exportQueryModel=JSON.stringify(this.queryModuleData)
      fetchList({...this.listQuery,...this.queryModuleData}).then(response => {
        this.custList = response.data;
        this.total = response.total;
        this.listLoading = false;
      });
    },
    remotepinput(query, cb) {
      queryCustomerNameIdUrl({ keyword: query ,isCustomer:1 }).then(response => {
        var restaurants = response.data.map(ite => {
          return { value: ite.fullname };
        });
        var results = query
          ? restaurants.filter(this.createStateFilter(query))
          : restaurants;

        cb(results);
      });
    },
    remoteMethod(value, index, property, filterName) {
      if (value && (filterName === "客户名称" || filterName === "父单位")) {
        queryCustomerNameId({ pageNo: 1, pageSize: 100, keyword: value }).then(
          res => {
            this.$set(
              this.conditionsModuleList[index],
              "valueList",
              res.data.map(item => ({ id: item.custId, value: item.name }))
            );
            this.$forceUpdate();
          }
        );
      }
    },
    createStateFilter(queryString) {
      return state => {
        return (
          state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      };
    },
    remotepaternalUnit(query) {
      if (query !== "") {
        queryCustomerNameIdUrl({ keyword: query,isCustomer:1  }).then(response => {
          if (response.success) {
            this.seletData.custnames = response.data;
          } else {
            this.$message.error(response.message);
          }
        });
      }
    },
    getallSelectData() {
      queryIndustryUrl().then(response => {
        if (response.success) {
          this.seletData.industry = response.data;
        } else {
          this.$message.error(response.message);
        }
      });
      queryFiliale().then(response => {
        if (response.success) {
          this.seletData.customerOwner = response.data;
        } else {
          this.$message.error(response.message);
        }
      });
      queryCountryUrl().then(response => {
        if (response.success) {
          this.seletData.country = response.data.areas;
        } else {
          this.$message.error(response.message);
        }
      });
      querycustSelectClass({ classId: "1130,1099,5" }).then(response => {
        if (response.success) {
          this.seletData.scStatu = response.data["1130"];
          this.seletData.level = response.data["1099"];
          this.seletData.curStatusArray = response.data["5"];
        } else {
          this.$message.error(response.message);
        }
      });
    },
    handledeleElement(item) {
      var index=this.custList.indexOf(item)
      this.$confirm("此操作将永久删除该客户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.deldata.customerID = item.custId;
          delCustomer(this.deldata).then(response => {
            if (response.messageType == -6) {
              this.$confirm(response.message, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
              }).then(() => {
                delCustomer({...this.deldata, forceDelete: 1}).then(res => {
                  this.custList.splice(index, 1);
                  this.$message({
                    type: "success",
                    message: "删除成功"
                  });
                })
              }).catch(() =>{

              })

            } else {
              this.custList.splice(index, 1);
              this.$message({
                type: "success",
                message: "删除成功"
              });
            }

          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    setXy() {
      if (this.xyData.custId) {
        updateLevelUrl(this.xyData).then(response => {
          if (response.success) {
            this.$message.success(response.message);
            this.dialogFormxy = false;
          } else {
            this.$message.error(response.message);
          }
        });
      } else {
        this.$message.error("请选择客户");
      }
    },
    listajbtn(val, row) {
      if (val == "1") {
        this.$router.push({
          path: "/workbench/case/case_management",
          query: { name: row.name, custId: row.custId }
        });
      }
    },
    listsbbtn(val, row) {
      if (val == "1") {
        this.$router.push(
          "/workbench/trademark/trademark_list/" + row.custId + "/" + row.name
        );
      }
      if (val == "2") {
        queryAppInfoUrl({ custId: row.custId }).then(res => {
          if (res.data.map(ite => ite.applicantName).join(",")) {
            searchtmdataUrl({
              appName: res.data.map(ite => ite.applicantName).join(",")
            }).then(res => {
              this.$message.success(res.message);
            });
          } else {
            this.$message.error("请先给该客户添加申请人。");
          }
        });
      }
      if (val == "3") {
      }
    }
  }
};
</script>

 <style lang="scss" scoped>
@import "~@/styles/mixin.scss";
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
.searchfullRow1 {
  .searchcol {
    padding-right: 0%;
  }
  /deep/ .el-form-item__label {
    width: 11.7%;
  }
  /deep/ .el-checkbox,
  .el-checkbox-group {
    display: inline-block;
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
.w-table{
  position: relative;
}
.dots {
  cursor: pointer;
  position: absolute;
  left: 0;
  z-index: 1;
  top: 6px;
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
.checkbox{
  position:absolute;
  left: 14px;
  top: 48px;
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
.buttonWrap{
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .el-button{
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
.button-group-search{
  position: relative;
  display: flex;
  .searchWrap{
    border-radius: 5px;
    top: 34px;
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
    box-shadow: 0 3px 6px rgba(111,111,111,0.2);
    /deep/  .form-container{
      padding-bottom: 10px;
      overflow: auto;
      max-height: 500px;
      .el-form-item__label{
        text-align: left;
        padding-left: 32px;
        font-weight: normal;
      }
      .el-form-item__content{
        input{
          border-top: 0;
          border-left: 0;
          border-radius: 0;
          border-right: 0
        }
      }
    }
    .clearWrap{
      display: flex;
      justify-content: flex-end;
      right: 20px;
      bottom: 10px;
      position: absolute;
      z-index: 1;
    }
  }
}
.DataPicker /deep/ {
  line-height: 28px;
  .el-input__prefix {
    display: none!important;
  }
  .el-input__inner {
    text-align: left;
    padding-left: 15px;
    padding-right: 18px;
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
.button_wrap{
  margin-left:10px
}
.searchRight{
  margin-left: 0;
  height: 32px;
  border-top-right-radius:3px !important;
  border-bottom-right-radius:3px !important;
  padding: 0 5px
}
</style>

