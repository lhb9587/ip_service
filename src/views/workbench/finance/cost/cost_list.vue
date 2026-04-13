<template>
  <div :style="{margin: isFinance ? '0px' : '20px'}">
    <el-tabs v-if="!isFinance" v-model="activeName" @tab-click="changeTab">
      <el-tab-pane label="费用" name="first">

      </el-tab-pane>
      <el-tab-pane label="费用明细" name="second">

      </el-tab-pane>
    </el-tabs>
    <template v-if="!isFinance">
      <MyTabs ref="myTabs" class="MyTabs" :page-title="pageTitle" :identification="identification"
              :defaultColumnDefs="columnDefs" style="position: absolute" @editableTab="editableTab"
              :class="myTabsActivity?'activity':''" v-if="pageTitle=='费用'"></MyTabs>
      <div class="buttonWrap" style="margin-bottom: 10px">
        <el-button-group class="button-group-search" v-clickoutside="clickoutside">
          <el-button id="mySearch" style="margin-right:0" type="primary" size="small" @click="handleSearch(0)">搜索
          </el-button>
          <el-button type="primary" class="searchRight" size="small" icon="el-icon-arrow-down"
                     @click.stop.prevent="drawerState=true"></el-button>
          <transition name="show" mode="out-in">
            <div class="searchWrap" id="searchWrap" v-show="drawerState">
              <el-form size="mini" label-width="120px" class="form-container" @keyup.enter.native="handleSearch(0)"
                       style="margin-top: 2px">
                <el-form-item :label="item.filterName+':'"
                              :class="item.filterType==='radio'&&item.values.length>3?'fullItem':'postInfo-container-item'"
                              v-for="item,index in conditionsModuleList" :key="index">

                  <el-select v-model="queryModuleData[item.property]" placeholder="请选择"
                             v-if="item.filterType==='select'" filterable clearable>
                    <el-option v-for="itm in item.values" :key="itm.id" :label="itm.value" :value="itm.id">
                    </el-option>
                  </el-select>
                  <!--<el-checkbox-group style="display:flex" v-model="queryModuleData[item.property]" v-if="item.filterType==='checkbox'">-->
                  <!--<el-checkbox v-for="itm in item.values" :label="itm.value" :key="itm.id">{{itm.value}}</el-checkbox>-->
                  <!--</el-checkbox-group>-->
                  <el-select v-if="item.filterType==='checkbox'&&item.values&&item.values.length"
                             v-model="queryModuleData[item.property]" multiple placeholder="请选择" filterable clearable
                             @change="(e)=>checkBox(e,item.property,item.values)">
                    <el-option v-for="itm in item.values" :key="itm.id + Math.random()" :label="itm.value"
                               :value="itm.id">
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
                    <el-option v-for="itm,idx in item['valueList']" :key="itm.id" :label="itm.value" :value="itm.id">
                      <el-tooltip v-for="itmx,key in item['valueList'][idx]" v-if="key!='id'" class="item"
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
                    <el-option v-for="itm,idx in item['valueList']" :key="itm.id" :label="itm.value" :value="itm.id">
                      <el-tooltip v-for="itmx,key in item['valueList'][idx]" v-if="key!='id'" class="item"
                                  effect="light" :content="itmx" placement="top">
                        <span>{{itmx}}</span>
                      </el-tooltip>
                    </el-option>
                  </el-select>
                  <el-select v-if="item.filterType==='selectTable'" v-model="queryModuleData[item.property]" filterable
                             clearable placeholder="请选择">
                    <el-option v-for="itm ,idx in item.values" :key="idx" :label="itm.value" :value="itm.id"
                               :disabled="itm.id==-1">
                      <span v-for="itmx ,key in item['values'][idx]" v-if="key!='id'">{{itmx}}</span>
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
              <div class="clearWrap" v-if="drawerState" id="clearWrap">
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

                <el-button size="mini" @click="() => { clearSearch(this) }"><span>重置</span></el-button>
                <el-button type="primary" size="mini" @click="handleSearch(0)">搜索</el-button>
              </div>
              <el-button style="position:absolute;top: 10px;right: 10px" type="text" size="small" @click="queryFilter">
                <i class="el-icon-s-tools"></i>更多
              </el-button>
            </div>
          </transition>
        </el-button-group>
        <el-button @click="selectionList('费用提交')" type="primary" size="small"
                   v-if="$store.getters.permissions.includes(219)">费用提交
        </el-button>
        <el-button @click="selectionList('报销人所属组审核')" type="primary" size="small"
                   v-if="$store.getters.permissions.includes(220)">报销人所属组审核
        </el-button>
        <el-button @click="selectionList('承担组审核')" type="primary" size="small"
                   v-if="$store.getters.permissions.includes(221)">承担组审核
        </el-button>
        <el-dropdown @command="beginAudit">
          <el-button type="primary" size="small">
            初审<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :command="1">通过</el-dropdown-item>
            <el-dropdown-item :command="0">退回</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-dropdown @command="againAudit">
          <el-button type="primary" size="small">
            复审<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :command="1">通过</el-dropdown-item>
            <el-dropdown-item :command="0">退回</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <!--        <el-button @click="selectionList('初审')" type="primary" size="small" >初审</el-button>-->
        <!--        <el-button @click="selectionList('复审')" type="primary" size="small" >复审</el-button>-->
        <el-button @click="selectionList('支付')" type="primary" size="small">支付</el-button>
        <el-button @click="selectionList('改签')" type="primary" size="small">改签</el-button>


        <el-dropdown @command="plEdit" v-if="activeName == 'second'">
          <el-button type="primary" size="small">
            批量操作<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="所属月">所属月</el-dropdown-item>
            <el-dropdown-item command="支付方式">支付方式</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <!--      <el-button type="primary" size="mini" @click="selectionList(1)">批量操作</el-button>-->
        <el-button type="primary" size="small" @click="$router.push('addFeeDetail/1')">新建</el-button>
        <el-button type="primary" size="small" @click="createFeeTemplate(10)">生成模板</el-button>
      </div>
      <el-form class="noBottomMargin">
        <el-form-item label="费用状态:" label-width="100px">
          <el-radio-group v-model="queryModuleData.taskNo" @change="changeFeeStatus">
            <el-radio v-for="item in feeWfstatusList" :label="item.taskNo">{{item.taskName}}</el-radio>
            <el-radio label="">全部</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <el-form v-if="activeName == 'second'" class="noBottomMargin">
        <el-form-item label="支付公司:" label-width="100px">
          <el-tag @click="changeCompany(item)" :class="{isActive: item.deptId == queryModuleData.paymentDeptIdOut}"
                  v-for="(item,index) in payCompanyList" :key="item.deptId">{{item.companyShortName}}
          </el-tag>
        </el-form-item>
      </el-form>
      <el-form v-if="activeName == 'second'&&queryModuleData.paymentDeptIdOut" class="noBottomMargin">
        <el-form-item label-width="100px" label="年份:">
          <el-tag @click="changeYear(item)" :class="{isActive: item == currentYear}"
                  v-for="(item,index) in [$wUtil.getDate('', 'year'), +$wUtil.getDate('', 'year')-1, +$wUtil.getDate('', 'year')-2, +$wUtil.getDate('', 'year')-3]"
                  :key="index">{{item}}
          </el-tag>
        </el-form-item>
      </el-form>
      <el-form v-if="activeName == 'second'&&queryModuleData.paymentDeptIdOut" class="noBottomMargin">
        <el-form-item label-width="100px" label="所属月:">
          <el-tag @click="changeMonth(item)" :class="{isActive: item == currentMonth}" v-for="item in belongMonthList">
            {{item}}
          </el-tag>
        </el-form-item>
      </el-form>
    </template>
    <div style="display: flex;position: relative">
      <TitleTotal :total="total" :currentPageSize="currentPageSize"/>
      <!--    <div class="button_wrap" v-if="selectionState">-->
      <!--      <el-button class="exactButton"size="small"  type="primary" @click="jumpDetailSubmisson">{{multipleTypeText}}</el-button>-->
      <!--      <el-button class="exactButton"  size="mini" @click="selectionState=false">取消</el-button>-->
      <!--    </div>-->
      <div
        style="cursor:pointer;position: absolute;display:flex;align-items:center;right: 0;bottom:-6px;font-size: 14px;padding-right: 6px">
        <el-button type="text" @click="exportList(2)" >导出</el-button>
        <span style="color: #52A2F4;margin: 0 5px"> / </span>
        <el-button type="text" @click="exportList(1)">全局导出</el-button>
<!--        <img @click="exportList(2)" src="@/assets/moon.png" style="width: 16px;height: 16px" width="16" alt="">-->
      </div>
      <!--    <el-button type="text" style="position: absolute;right: 0;bottom:-6px;font-size: 14px;padding-right: 6px" @click="selectionList('导出')"><i class="el-icon-download">导出</i></el-button>-->
    </div>
    <div class="w-table">
      <div class="dots" @click="handleCheckboxState">
        <span class="dot">.</span>
        <span class="dot">.</span>
        <span class="dot">.</span>
      </div>
      <el-button class="brush_right" :class="brushRightHasFilter?'red':''" @click="brushRight" type="text"
                 icon="el-icon-brush"></el-button>
      <AgGridVue :style="{width:'100%',height: clientHeight+'px'}"
                 class="ag-theme-balham"
                 :columnDefs="columnDefs"
                 :rowData="feeList"
                 rowSelection="multiple"
                 @grid-ready="onGridReady"
                 :gridOptions="gridOptions"
                 @dragStopped="dragStopped"
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
                 :frameworkComponents="frameworkComponents"
                 :masterDetail="true"
                 :detailCellRendererParams="detailCellRendererParams"
                 keepDetailRows
                 :rowHeight="isFinance ? $commonUtils.getRowHeight() : 28"
                 :pinnedBottomRowData="pinnedBottomRowData"

      >
      </AgGridVue>
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
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.pageNo"
      :limit.sync="listQuery.pageSize"
      @pagination="queryFeeList"
      :pageSizes="pageSizesList"
    />


    <el-dialog title="提示" :visible.sync="transferVisible" width="80%">
      <el-transfer v-model="transferValue" @left-check-change="leftCheckChange" :key="transferData.filterId"
                   :data="transferData" filterable filter-placeholder="请输入搜索内容"
                   :titles="['选择筛选项—全部案件', '已选']">
      </el-transfer>
      <span slot="footer" class="dialog-footer">
        <el-button @click="transferVisible = false">取 消</el-button>
        <el-button type="primary" @click="configFilter">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="选择改签人"
      :visible.sync="endorseTaskerState"
      width="30%"
    >
      <el-select v-model="endorseTasker" placeholder="请选择" filterable default-first-option clearable>
        <el-option
          v-for="item in endorseTaskerList"
          :key="item.userId"
          :label="item.fullname"
          :value="item.userId">
        </el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
      <el-button @click="endorseTaskerState = false">取 消</el-button>
      <el-button type="primary" @click="endorseFee">确 定</el-button>
    </span>
    </el-dialog>
    <SelectOption
      :buss-id="bussId"
      v-if="selectionOptionState"
      :dialog-visible="selectionOptionState"
      @cancel="closeDialogSelectOption"
      :idArray="getCurrentRowsData()"
      :defaultMultipleSelect="tableDefaultList.map(i=>i.title)"
      :exportType="exportType"
      :exportQueryModel="exportQueryModel"></SelectOption>
    <EmitSearch @undateSearch="undateSearch"></EmitSearch>

    <el-dialog
      v-if="plEditView"
      class="no-top"
      :title="plTitle"
      :visible.sync="plEditView"
      width="30%"
    >
      <div class="topBox">
        <span class="iconfont icon-warning-circle-fill" style="color: #E6A23C;font-size: 20px;"></span>
        <span>确认要修改所选 [费用] 吗？</span>
      </div>
      <el-form class="form-container" size="small" label-position="right" label-width="120px" :model="plForm">
        <el-row style="width: 100%" class="first-row" v-if="belongMonthView">
          <el-form-item label="所属月" class="postInfo-container-item">
            <template>
              <el-date-picker v-model="plForm.belongtoDate" format='yyyy-MM-dd' value-format="yyyy-MM-dd"
                              align="right" type="date" placeholder="选择日期">
              </el-date-picker>
            </template>

          </el-form-item>
        </el-row>
        <el-row style="width: 100%" class="first-row" v-if="payKindsView">
          <el-form-item label="支付公司" class="postInfo-container-item">
            <el-select v-model="plForm.paymentDeptId" @change="changeDept" placeholder="请选择支付公司" filterable
                       default-first-option clearable>
              <el-option
                v-for="item in payCompanyList"
                :key="item.deptId"
                :label="item.companyShortName"
                :value="item.deptId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row style="width: 100%" v-if="payKindsView">
          <el-form-item label="支付方式" class="postInfo-container-item">
            <el-select v-model="plForm.payType" placeholder="请选择方式" filterable default-first-option clearable>
              <el-option
                v-for="item in payTypeList"
                :key="item.payMode"
                :label="item.payMode"
                :value="item.payMode">
              </el-option>
            </el-select>
          </el-form-item>
        </el-row>

      </el-form>
      <span slot="footer" class="dialog-footer">
      <el-button
        @click="()=>{this.plEditView = false; this.belongMonthView = false; this.payKindsView = false}">取 消</el-button>
      <el-button type="primary" @click="plEditSubmit">确 定</el-button>
    </span>
    </el-dialog>
    <el-dialog
      v-if="addFeeView"
      title="费用数量"
      :visible.sync="addFeeView"
      width="30%"
    >
      <div class="fl-ac-jc">
        <el-input size="small" style="width: 200px" type="number" placeholder="请输入复制费用数量" v-model="feeNum"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
      <el-button size="mini" @click="() => {addFeeView = false; copyFeeId = '';feeNum = 1}">取 消</el-button>
      <el-button size="mini" type="primary" @click="submitCopyFee">确 定</el-button>
    </span>
    </el-dialog>
    <!--  支付-->
    <el-dialog
      v-if="payOffView"
      class="no-top"
      title="费用支付"
      :visible.sync="payOffView"
      width="30%"
    >
      <!--    <div class="topBox">-->
      <!--      <span class="iconfont icon-warning-circle-fill" style="color: #E6A23C;font-size: 20px;"></span>-->
      <!--      <span>确认要修改这条 [费用] 吗？</span>-->
      <!--    </div>-->
      <el-form class="form-container" size="small" label-position="right" label-width="120px">
        <el-row style="width: 100%" class="first-row" v-if="payOffView">
          <el-form-item label="所属月" class="postInfo-container-item">
            <template>
              <el-date-picker v-model="payOffBelongtoDate" format='yyyy-MM-dd' value-format="yyyy-MM-dd"
                              align="right" type="date" placeholder="选择日期">
              </el-date-picker>
            </template>
          </el-form-item>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer fl-ac-jc">
      <el-button size="mini" @click="closePayOff">取 消</el-button>
      <el-button size="mini" type="primary" @click="payOff">支 付</el-button>
    </span>
    </el-dialog>

     <!--  查验-->
    <el-dialog
      v-if="checkAditView"
      class="no-top"
      title="费用查验"
      :visible.sync="checkAditView"
      width="30%"
    >
      <el-form class="form-container" size="small" label-position="right" label-width="120px">
        <el-row style="width: 100%" class="first-row" v-if="isCheckAuditDate">
          <el-form-item label="所属月" class="postInfo-container-item">
            <template>
              <el-date-picker v-model="payOffBelongtoDate" format='yyyy-MM-dd' value-format="yyyy-MM-dd"
                              align="right" type="date" placeholder="选择日期">
              </el-date-picker>
            </template>

          </el-form-item>
        </el-row>
        <el-row style="width: 100%" class="first-row">
          <el-form-item label="后期提供发票" class="postInfo-container-item">
            <template>
              <el-select v-model="invoiceLater" filterable clearable reserve-keyword
                         placeholder="请选择方式">
                <el-option key="1" label="是" :value="1" />
                <el-option key="0" label="否" :value="0" />
              </el-select>
            </template>
          </el-form-item>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer fl-ac-jc">
      <el-popover
        placement="top"
        width="300"
        v-model="popoverVisible">
        <el-input
          type="textarea"
          :rows="2"
          placeholder="请输入退回原因"
          v-model="rejectReason">
        </el-input>
        <div style="text-align: right; margin-top: 10px;">
          <el-button size="mini" @click="popoverVisible = false">取消</el-button>
          <el-button type="primary" size="mini" @click="confirmReject">确定</el-button>
        </div>
        <el-button size="mini" slot="reference" @click="resetRejectReason" style="margin-right: 10px;">退回</el-button>
      </el-popover>
      <el-button size="mini" type="primary" @click="againAudit(1)">通过</el-button>
    </span>
    </el-dialog>

    <!--  批量编辑-->
    <Willtable v-if="showTable" :showTable="showTable"
               :feeDetailIds="String(getSelectedRows().map(item=>item.feeDetailId))" plType="费用明细"
               @closeTable="closeTable"></Willtable>
    <!--  <SelectOption :buss-id="14" v-if="selectionOptionState&&multipleSelection.map(item=>item['feeId']).length" :dialog-visible="selectionOptionState" @cancel="closeSelect" :idArray="multipleSelection.map(item=>item['feeId'])"  ></SelectOption>-->
  </div>
</template>

<script>
  import SelectOption from '@/views/workbench/case/components/SelectOption.vue'
  import Pagination from "@/components/Pagination";
  import MyTabs from '@/views/workbench/case/components/MyTabs'
  import {queryUsers, queryWorkgroupNames, queryDeptByCondition} from '@/api/systemList'
  import {
    queryFeeList,
    queryFeeTypeList,
    deleteFee,
    deleteFeeDetail,
    endorseFee,
    submitFee,
    batchDoFeeTask,
    checkFeeTasker,
    queryEndorseTasker,
    queryFeeTaskDefine,
    queryFeeSum,
    createFeeTemplate,
    updateFeeBatch,
    queryCompanyByPermission,
    queryPayMode,
    copyFee
  } from "@/api/feeList";
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
  } from "@/api/caseList.js";
  import {queryAllUrl} from "@/api/billApi";
  import {formatAmount} from '@/utils/filters'
  import Summary from "@/components/Summary/index.js";
  import Willtable from '@/components/Willtable'

  export default {
    name: "cost_list",
    props: {
      isDetail: {
        type: Boolean,
        default: false
      },
      bussId: {
        type: Number,
        default: 14
      },
      isFinance: {
        type: Boolean,
        default: false
      }
    },
    data() {
      var tableHeader = []
      if (localStorage.getItem('tableHeader') && JSON.parse(localStorage.getItem('tableHeader')).find(item => item.name == this.$options.name + this.$route.name)) {
        tableHeader = JSON.parse(localStorage.getItem('tableHeader')).find(item => item.name == this.$options.name + this.$route.name).tableHeader
      }
      return {
        checkAditView: false,
        isCheckAuditDate: false,
        popoverVisible: false,
        rejectReason: '',
        isModList: [],
        notModList: [],
        showTable: false,
        payOffBelongtoDate: '',
        invoiceLater: '',
        payOffView: false,
        gridApi: {},
        copySign: '',
        feeNum: 1,
        addFeeView: false,
        exportType: '',
        searchType: 0,
        currentMonth: '',
        currentYear: '',
        currentCompanyName: '',
        payCompanyList: [],
        payTypeList: [],
        plForm: {
          belongtoDate: '',
          paymentDeptId: '',
          payType: ''
        },
        plEditView: false,
        plTitle: '批量操作',
        belongMonthView: false,
        payKindsView: false,
        activeName: 'first',
        identification: 'cost_listcost_list',
        myTabsActivity: false,
        pageTitle: this.$route.meta.title,
        drawerState: false,
        selectionState: false, // 筛选递交复选框
        total: 0,
        loading: false,
        listLoading: false,
        feeList: [],
        feetList: [],
        queryModuleData: { // 查询条件

        },
        tableHeader,
        selectionOptionState: false,
        multipleTypeText: '确定',
        defaultParams: {
          value: 'feetId',
          label: 'feeName',
          checkStrictly: true,
          children: 'feeTypes'
        },
        listQuery: {
          pageNo: 1,
          pageSize: JSON.parse(localStorage.getItem('pageSize')) ? JSON.parse(localStorage.getItem('pageSize')).find(item => item.name == this.$route.name) ? JSON.parse(localStorage.getItem('pageSize')).find(item => item.name == this.$route.name).pageSize : 10 : 10
        },
        pageSizesList: [10, 50, 200, 500, 1000, 5000, 10000],
        tableDefaultList: [{'label': '费用名称', 'prop': 'feeName'}, {'label': '总金额', 'prop': 'total'}, {
          'label': '案件文号',
          'prop': 'showRefno'
        }, {'label': '客户', 'prop': 'name'}, {'label': '报销人', 'prop': 'bxfullname'}, {
          'label': '报销人所属工作组',
          'prop': 'bxgroupname'
        }, {'label': '费用承担工作组', 'prop': 'groupName'}, {'label': '填报人', 'prop': 'fullname'}, {
          'label': '任务人',
          'prop': 'tasker'
        }, {'label': '费用状态', 'prop': 'wfStatus'}],
        customerNameIdList: [],
        feeTypeList: [],
        userList: [],
        deptByConditionList: [],
        workgroupNamesList: [],
        feeWfstatusList: [],
        endorseTaskerList: [],
        endorseTaskerState: false,
        endorseTasker: '',
        exportQueryModel: '',
        filterText: '',
        userId: this.$store.getters.userId,
        // bussId:14,
        conditionsModuleList: [],
        schemeName: '',
        addFilterState: false,
        checkCaseList: [],
        checkboxState: false,
        selectColumnList: [],
        transferVisible: false, // 配置筛选条件框
        transferData: [], // 筛选条件数据
        transferValue: [], // 当前筛选条件id
        multipleSelection: [],
        currentPageSize: 0,
        defaultcolumnDefs: [
          {
            headerName: '序号',
            field: 'sid',
            width: this.getLoactionWidth('序号') == 'auto' ? 110 : this.getLoactionWidth('序号'),
            resizable: true,
            enableRowGroup: true,
            // enablePivot: true,
            cellRenderer: this.cellRenderer,
            floatingFilter: true,
            filter: false,
            cellClass: 'vAlign',
            suppressMenu: true,
            checkboxSelection: false,
            headerCheckboxSelection: false,
            headerCheckboxSelectionFilteredOnly: true
          },
        ],
        columnDefs: [],
        tableTitleList2: [
          {'title': '费用类型', 'value': 'feetId'}, {'title': '费用名', 'value': 'feeName'}, {
            "title": "金额",
            "value": "amount"
          }, {title: '盈余核算状态', value: 'surplusStatus'},
          {"title": "收款对方名称", "value": "receiverName"}, {"title": "费用描述", "value": "feeDesc"}],

        defaultcolumnDefs2: [
          {
            headerName: '序号',
            field: 'sid',
            width: 60,
            'pinned': 'left', //固定再左边
            filter: false,
            resizable: true,
            cellClass: 'vAlign',
            suppressMenu: true,
            // headerCheckboxSelectionFilteredOnly: true,
            cellRenderer: this.cellRenderer,
            // checkboxSelection:function(params) {
            //   return params.columnApi.getRowGroupColumns().length === 0;
            // },
            // headerCheckboxSelection:(params)=>{
            //   return params.columnApi.getRowGroupColumns().length === 0;
            // }
          },
        ],
        brushRightHasFilter: false,
        gridOptions: {
          ...this.$store.state.caseInformation.gridOptions, ...{
            statusBar: {
              statusPanels: [
                // { statusPanel: 'agSelectedRowCountComponent', align: 'left' },
                {statusPanel: 'CountStatusBarComponent'}
              ]
            },
            //floatingFilter: true,
          }
        },
        detailCellRendererParams: {
          detailGridOptions: {
            rowSelection: 'multiple',
            columnDefs: [],
            rowHeight: this.isFinance ? 22 : 28,
            defaultColDef: {flex: 1},
            getContextMenuItems: this.getContextMenuItemsChild,
          },
          getDetailRowData: params => {
            params.successCallback(params.data.feeDetails);
          },
        },
        frameworkComponents: {
          CountStatusBarComponent: Summary
        },
        autoGroupColumnDef: {
          headerName: '组',
          field: 'group',
          headerCheckboxSelection: true,
          cellRenderer: 'agGroupCellRenderer',
          cellRendererParams: {checkbox: true},
        },
      }
    },
    activated() {
      this.$store.commit('caseInformation/SET_BUSSID', this.bussId)
    },
    mounted() {
      let that = this
      document.getElementById('searchWrap') && (document.getElementById('searchWrap').onscroll = function (e) {
        that.clearWrapTop = e.target.scrollTop + e.target.offsetHeight
        document.getElementById('clearWrap').style.top = that.clearWrapTop - 40 + 'px'
      })
    },
    async created() {
      // this.queryWorkgroupNames()
      // this.queryFeeTypeList()
      // this.queryDeptByCondition()
      // this.queryUsers()
      let res = await this.queryFeeTypeList()
      this.feeTypeList = res.data
      localStorage.setItem('feeTypeList', JSON.stringify(this.feeTypeList))
      this.$store.commit('caseInformation/SET_BUSSID', this.bussId)
      this.queryFeeTaskDefine()
      // this.getDefaultTableHeader()
      this.getAllWfs()
      !this.isFinance && this.queryFilterConfig(1);
    },
    methods: {
      getCurrentRowsData() {
        if (this.gridApi && this.gridApi.rowModel) {
          return this.gridApi.rowModel.rootNode.childrenAfterSort.map(item => item.data).map(item => item[this.isDetail ? 'feeDetailId' : 'feeId'])
        }
        return []
      },
      closeTable({feeDetailIds = []}) {
        this.showTable = false
        // this.queryFeeList()
        this.queryPartData({feeDetailIds})
      },
      closePayOff() {
        this.payOffView = false;
        this.payOffBelongtoDate = ''
      },
      payOff() {
        if (!this.payOffBelongtoDate) {
          this.$message.error('请选择所属月！')
          return
        }

        const data = {
          taskIdList: this.getSelectedRows().map(item => item.taskId),
          result: 1,
          belongtoDate: this.payOffBelongtoDate
        }
        batchDoFeeTask(data).then(Response => {
          this.queryPartData({
            feeDetailIds: this.getSelectedRows().map(item => item.feeDetailId),
            feeIds: this.getSelectedRows().map(item => item.feeId)
          })
          // this.queryFeeList()
          this.closePayOff()
          // this.handleSearch(this.searchType)
        })
      },
      checkSelectedRowsTaskNo() {
        let list = []
        let taskNo = 1000;
        switch (this.multipleTypeText) {
          case '费用提交':
            taskNo = 1;
            break;
          case '报销人所属组审核':
            taskNo = 2;
            break;
          case '承担组审核':
            taskNo = 3;
            break;
          case '复核':
            taskNo = 4;
            break;
          case '查验':
            taskNo = 5;
            break;
          case '支付':
            taskNo = 6;
            break;
          case '费用加批':
            taskNo = 7;
            break;
          case '财务负责人加审':
            taskNo = 8;
            break;
          case '账单财务岗审核':
            taskNo = 9;
            break;
          default:
            break
        }
        if (this.getSelectedRows().length) {
          console.log(this.getSelectedRows(),'this.getSelectedRows()');
          
          list = this.getSelectedRows().filter(item => item.taskNo !== taskNo)
          return list.length ? list.length : 'ok'
        }
        return 'error'
      },
      beginAudit(result) {
        this.multipleTypeText = '复核'
        if (typeof this.checkSelectedRowsTaskNo() == 'number') {
          this.$message.error(`有${this.checkSelectedRowsTaskNo()}条费用流程状态不符合当前操作！`)
          return
        }
        if (this.checkSelectedRowsTaskNo() == 'error') {
          this.$message.error('请选择费用！')
          return
        }
        this.submitFee(result)
      },
      againAudit(result) {
        this.multipleTypeText = '查验'
        console.log(this.checkSelectedRowsTaskNo(),'checkSelectedRowsTaskNo');
        
        if (typeof this.checkSelectedRowsTaskNo() == 'number') {
          this.$message.error(`有${this.checkSelectedRowsTaskNo()}条费用流程状态不符合当前操作！`)
          return
        }
        if (this.checkSelectedRowsTaskNo() == 'error') {
          this.$message.error('请选择费用！')
          return
        }

        if (this.invoiceLater === '' || this.invoiceLater === null) {
          this.$message.error('请选是否后期提供发票！')
          return
        }
        if (this.getSelectedRows().find(item => item.veriCode != null && item.veriCode !=0)) {
          this.$confirm('选择费用存在发票未验证通过, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.submitFee(result, 'belongtoDate','查验')
            return false
          }).catch(() => {
            return false
          });
        }else {
          this.submitFee(result, 'belongtoDate','查验')
        }
      },
      resetRejectReason() {
        this.rejectReason = '';
      },
      confirmReject() {
        if (!this.rejectReason.trim()) {
          this.$message.warning('请输入退回原因');
          return;
        }
        this.popoverVisible = false;
        this.againAudit(0);
      },
      submitFee(result, flag, type) {
        let data = {}
        if (type && type == '查验'){
          data = {
            taskIdList: this.getSelectedRows().map(i => i.taskId),
            invoiceLater: this.invoiceLater,
            result,
          }
          if (result === 0) {
            data.failReason = this.rejectReason
          }
        }else{
          data = {
            taskIdList: this.getSelectedRows().map(i => i.taskId),
            // feeDetails: this.getSelectedRows(),
            result,
            // belongtoDate: this.payOffBelongtoDate
          }
        }
        batchDoFeeTask(data).then(res => {
          this.$message.success('操作成功！')
          // this.handleSearch(this.searchType)
          this.queryPartData({
            feeDetailIds: this.getSelectedRows().map(item => item.feeDetailId),
            feeIds: this.getSelectedRows().map(item => item.feeId)
          })
          this.checkAditView = false
          if (flag && this.payOffBelongtoDate) {
            updateFeeBatch({
              tag: 1,
              belongtoDate: this.payOffBelongtoDate,
              idArray: this.getSelectedRows().map(i => i.feeId)
            }).then(res => {
              this.feeList.forEach(item => {
                if (this.getSelectedRows().map(i => i.feeId).includes(item.feeId)) {
                  this.$set(item, 'belongtoDate', this.payOffBelongtoDate)
                  this.$set(item, 'belongToDateShort', this.payOffBelongtoDate.slice(0, 7))
                }
              })
              this.payOffBelongtoDate = ''
            }).catch(err => {
              this.$message.error('修改失败!')
            })
          }
          // this.queryFeeList()
        })
      },
      changeFeeStatus() {
        this.queryModuleData.paymentDeptIdOut = ''
        this.queryModuleData.belongtoDateBeginOut = ''
        // this.queryModuleData.wfStatus = ''
        this.queryModuleData.statusDates = ''
        this.currentYear = ''
        this.currentMonth = ''
        !this.isFinance && this.handleSearch(1);
      },
      changeBelongDate({deptId}) {
        this.$set(this.queryModuleData, 'taskNo', null)
        this.$set(this.queryModuleData, 'statusDates', '')
        this.$set(this.queryModuleData, 'paymentDeptIdOut', deptId)
        this.$set(this.queryModuleData, 'belongtoDateBeginOut', this.currentYear + '-' + this.currentMonth)
        this.handleSearch(1)
      },
      changeYear(year) {
        if (this.currentYear == year) return;
        this.currentYear = year
        this.$set(this.queryModuleData, 'belongtoDateBeginOut', this.currentYear + '-' + this.currentMonth)
        this.handleSearch(1)
      },
      changeMonth(month) {
        if (this.currentMonth == month) return;
        this.currentMonth = month
        this.$set(this.queryModuleData, 'belongtoDateBeginOut', this.currentYear + '-' + this.currentMonth)
        this.handleSearch(1)
      },
      changeCompany({companyShortName, deptId}) {
        if (this.queryModuleData.paymentDeptIdOut == deptId) return;
        this.currentMonth = this.$wUtil.getDate('', 'month').slice(5)
        this.currentYear = this.$wUtil.getDate('', 'year')
        this.$set(this.queryModuleData, 'taskNo', null)
        this.$set(this.queryModuleData, 'statusDates', '')
        this.$set(this.queryModuleData, 'paymentDeptIdOut', deptId)
        this.$set(this.queryModuleData, 'belongtoDateBeginOut', this.currentYear + '-' + this.currentMonth)
        this.handleSearch(1)
      },
      plEditSubmit() {
        const data = {
          idArray: this.getSelectedRows().filter(i => i.feeId && this.isModList.includes(i.feeId)).map(i => i.feeId)
        }
        if (this.belongMonthView) {
          data.belongtoDate = this.plForm.belongtoDate
          data.tag = 1
        } else {
          data.paymentDeptId = this.plForm.paymentDeptId
          data.payType = this.plForm.payType
          data.tag = 2
        }
        updateFeeBatch(data).then(res => {
          if (this.belongMonthView) {
            this.feeList.forEach(item => {
              if (this.isModList.includes(item.feeId)) {
                this.$set(item, 'belongtoDate', data.belongtoDate)
                this.$set(item, 'belongToDateShort', data.belongtoDate.slice(0, 7))
              }
            })
          } else {
            this.feeList.forEach(item => {
              if (this.isModList.includes(item.feeId)) {
                this.$set(item, 'paymentDeptId', data.paymentDeptId)
                this.$set(item, 'payType', data.payType)
              }
            })
          }
          this.closeDialog()
          this.$message.success('修改成功!')
        }).catch(err => {
          this.$message.error('修改失败!')
        })
      },
      closeDialog() {
        this.plTitle = ''
        this.plEditView = false
        this.belongMonthView = false
        this.payKindsView = false
        this.feeList.push({})
        this.feeList.pop()
      },
      plEdit(type) {
        if (this.getSelectedRows() < 1) {
          this.$message.error('请选择费用！')
          return
        }
        checkPermission({feeIdList: this.getSelectedRows().map(item => item.feeId)}).then(res => {
          this.isModList = res.data.filter(item => item.modify).map(item => item.feeId) || []
          this.notModList = res.data.filter(item => !item.modify).map(item => item.feeId) || []
          if (this.notModList.length) {
            let notice = ''
            if (this.isModList.length) {
              notice = `已选费用中:  ${this.isModList.length}条费用可修改; ${this.notModList.length}条费用无法修改, 是否继续?`
            } else {
              notice = '所选费用都无法修改！'
            }
            this.$confirm(notice, "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }).then(() => {
              if (this.isModList.length) {
                this.plEditView = true;
                if (type == '所属月') {
                  this.plTitle = '修改所属月'
                  this.belongMonthView = true
                  if (this.getSelectedRows().filter(i => i.belongtoDate && this.isModList.includes(i.feeId)).length) {
                    this.plForm.belongtoDate = this.getSelectedRows().filter(i => i.belongtoDate && this.isModList.includes(i.feeId))[0].belongtoDate
                  }
                } else {
                  this.plTitle = '修改支付方式'
                  this.payKindsView = true
                  this.queryCompanyByPermission(this.getSelectedRows().filter(i => i.belongtoDate && this.isModList.includes(i.feeId)))
                }
              } else {

              }
            }).catch(() => {

            })
          } else {
            this.plEditView = true;
            if (type == '所属月') {
              this.plTitle = '修改所属月'
              this.belongMonthView = true
              if (this.getSelectedRows().filter(i => i.belongtoDate).length) {
                this.plForm.belongtoDate = this.getSelectedRows().filter(i => i.belongtoDate)[0].belongtoDate
              }
            } else {
              this.plTitle = '修改支付方式'
              this.payKindsView = true
              this.queryCompanyByPermission(this.getSelectedRows().filter(i => i.belongtoDate))
            }
          }
        })
      },
      async queryCompanyByPermission(list = []) {
        if (!this.payCompanyList.length) {
          let res = await queryCompanyByPermission()
          this.payCompanyList = res.data
        }
        if (list.filter(i => i.paymentDeptId).length) {
          this.plForm.paymentDeptId = list.filter(i => i.paymentDeptId)[0].paymentDeptId
          this.plForm.payType = list.filter(i => i.paymentDeptId)[0].payType
          this.queryPayMode(this.plForm.paymentDeptId)
        }

      },
      changeDept(v) {
        if (v) {
          this.queryPayMode(v)
          this.plForm.payType = ''
        }
      },
      queryPayMode(paymentDeptId) {
        paymentDeptId && (queryPayMode({deptId: paymentDeptId}).then(res => {
          this.payTypeList = res.data
        }))
      },
      changeTab(name) {
        if (name.name == 'first') {
          this.$options.name = 'cost_list'
          this.bussId = 14
          this.getAllWfs()
          this.queryFilterConfig(1);
        } else {
          this.$options.name = 'cost_list_second'
          this.bussId = 45
          // this.queryCompanyByPermission();
          this.getAllWfs()
          this.queryFilterConfig(1);
        }
      },
      createFeeTemplate(checkFlag) {
        if (this.getSelectedRows().length != 1) {
          this.$message.error('请选择一条费用')
          return
        }
        createFeeTemplate({checkFlag, feeId: this.getSelectedRows()[0].feeId}).then(res => {
          if (res.messageType == -6) {
            this.$confirm(`${res.message}`, {
              distinguishCancelAndClose: true,
              cancelButtonText: '否',
              confirmButtonText: '是'
            })
              .then(() => {
                this.createFeeTemplate(30)
              })
              .catch((e) => {
                if (e == 'cancel') {
                  this.createFeeTemplate(20)
                } else {

                }
              });
            return
          }
          this.$commonUtils.downManyFile(res.data)
        })
      },
      rowClicked(params) {
        if (params.node.expanded) {
          params.node.setExpanded(false);
        } else {
          params.node.setExpanded(true);
        }
        this.columnDefs.push({})
        this.columnDefs.pop()
      },
      getContextMenuItemsChild(params) {
        if (!params.node || !params.node.data) {
          return []
        }
        return this.getRowContextmenuListChild(params.node.data).map(item => ({
          name: item.name,
          action: () => {
            this[item.action](params.node.data, params.value, params)
          },
        }))
      },
      getRowContextmenuListChild(row) {
        return [
          {name: '复制', action: 'copy'},
          {name: '修改', action: 'edit', permissions: 222,},
        ].filter(item => {
          if (item.permissions) {
            return this.$store.getters.permissions.includes(item.permissions)
          } else {
            return true
          }
        })
      },
      brushRight() {
        let data = this.$commonUtils.getFilterModel(this.$options.name + this.$route.name, 'FilterModel')
        let arr = Object.keys(data)
        arr.forEach(item => {
          this.gridApi.destroyFilter(item)
        })
        this.$commonUtils.saveFilterModel(this.$options.name + this.$route.name, 'FilterModel', {})
      },
      getFilterModel() {
        this.$nextTick(() => {
          let data = this.$commonUtils.getFilterModel(this.$options.name + this.$route.name, 'FilterModel')
          let arr = Object.keys(data)
          let arrInstance = arr.map(item => this.gridApi.getFilterInstance(item))
          arrInstance.forEach((item, index) => {
            // item.selectNothing()
            item.setModel(data[arr[index]])
            item.applyModel()
          })
          this.gridApi.onFilterChanged()
          let sortData = this.$commonUtils.getFilterModel(this.$options.name + this.$route.name, 'SortModel')
          if (sortData && sortData.length) {
            this.gridApi.setSortModel(sortData)
            this.gridApi.onSortChanged()
          }
        })
      },
      undateSearch(n) {
        if (this.bussId == n.bussId) {
          this.queryModuleData = JSON.parse(n.value)
          this.queryFeeList()
          // this.handleSearch(this.searchType)
          this.queryFilterConfig()
        }

      },
      getSelectedRows() {
        if (this.gridApi) {
          const selectedNodes = this.gridApi.getSelectedNodes();
          const selectedData = selectedNodes.map(node => node.data);
          return selectedData
        } else {
          return []
        }
      },
      getAllWfs() {
        const data = {
          userId: this.userId,
          bussId: this.bussId
        };
        this.detailCellRendererParams.detailGridOptions.columnDefs = [...this.defaultcolumnDefs2, ...this.tableTitleList2.map(item => ({
          headerName: item.title,
          field: item.value,
          // width:this.getLoactionWidth(item.title)=='auto'?200:this.getLoactionWidth(item.title),
          resizable: true,
          sortable: true,
          filter: 'agSetColumnFilter',
          cellRenderer: this.cellRenderer,
          menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
          enableRowGroup: true,
          filterParams: {
            newRowsAction: 'keep',
            comparator: (a, b) => {
              return this.$commonUtils.sort(a, b, item.value)
            }
          }
        }))]

        Promise.all([selectColumn(data), queryPreference(data)]).then(res => {
          this.selectColumnList = res[0].data;

          this.preferenceList = res[1].data;
          // this.tableHeader=this.columnDefs.map(item=>({label:item.headerName, prop:item.field,width: this.getLoactionWidth(item.headerName)}))
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
          this.$nextTick(() => {
            this.columnDefs.forEach(item => {
              this.columnApi.getColumn(item.field).addEventListener('menuVisibleChanged', () => {
                if (document.querySelector(".ag-tabs") && document.querySelector(".ag-set-filter-list")) {
                  new this.$DraginResize(document.querySelector(".ag-set-filter-list"), {
                    clone: true,
                    end(info) {
                      if (info.dir == 'ver') {
                        this.elem.style.height = info.height + 'px';
                      } else if (info.dir == 'hor') {
                        this.elem.style.width = info.width + 'px';
                      }
                    }
                  })
                }
                let data = this.$commonUtils.getFilterModel(this.$options.name + this.$route.name, 'FilterModel')
                let arr = Object.keys(data)
                if (this.columnDefs.map(itm => itm.field).diff(arr).includes(item.field)) {
                  this.gridApi.getFilterInstance(item.field).selectNothing()
                }
              });
            })

          })
          this.saveLocation()
          this.checkCaseList = this.preferenceList.map(item => item.value);

        });
      },
      // getDefaultTableHeader(){
      //   if(this.tableHeader.length){
      //     this.columnDefs=[...this.defaultcolumnDefs,...this.tableHeader.map(item=>({
      //       headerName: item.label,
      //       field: item.prop,
      //       width:this.getLoactionWidth(item.label)=='auto'?200:this.getLoactionWidth(item.label),
      //       resizable: true,
      //       sortable: true,
      //       filter: 'agSetColumnFilter',
      //       menuTabs: ['filterMenuTab','generalMenuTab','columnsMenuTab'],
      //       cellRenderer: this.cellRenderer,
      //       enableRowGroup: true,
      //       filterParams: {
      //         comparator: (a, b)=>{
      //           return 0
      //         }
      //       }
      //     }))]
      //
      //   } else {
      //     this.columnDefs=[...this.defaultcolumnDefs,...this.tableDefaultList.map(item=>({
      //       headerName: item.label,
      //       field: item.prop,
      //       width:this.getLoactionWidth(item.label)=='auto'?200:this.getLoactionWidth(item.label),
      //       resizable: true,
      //       sortable: true,
      //       filter: 'agSetColumnFilter',
      //       menuTabs: ['filterMenuTab','generalMenuTab','columnsMenuTab'],
      //       cellRenderer: this.cellRenderer,
      //       enableRowGroup: true,
      //       filterParams: {
      //         comparator: (a, b)=>{
      //           return 0
      //         }
      //       }
      //     }))]
      //   }
      // },
      getSidDiv(params) {
        const h = this.$createElement;
        let vnode = params.node.data.feeDetails ? h('div', {
            on: {
              click: () => this.rowClicked(params)
            },
          }, [

            h('i', {
              'class': {
                'el-icon-caret-right': true,
                'rotateClass': params.node.expanded
              },

            }),
            h('span', {
              attrs: {
                title: `${params.rowIndex + 1}`
              }
            }, [`${params.rowIndex + 1}`])
          ]
        ) : h('div', {}, [
            h('span', {
              attrs: {
                title: `${params.rowIndex + 1}`
              }
            }, [`${params.rowIndex + 1}`])
          ]
        )
        const div = document.createElement('div');
        this.__patch__(div, vnode, true, false)
        return div
      },
      cellRenderer(params) {
        if (params.node.rowPinned == 'bottom') {
          return `<span title="${params.value}" style="float: right">${(params.value || params.value === 0) ? params.value : ''}</span>`
        }
        if (params.colDef.field == 'sid' && params.value !== '') {

          return this.getSidDiv(params)
          // return params.node.data.feeDetails?`<i class="el-icon-caret-right ${params.node.expanded?'rotateClass':''}"></i>${params.rowIndex+1}`:`<span title="${params.rowIndex+1}">${params.rowIndex+1}</span>`
        } else if (params.colDef.field == 'feetId') {
          let feetIdList = this.$commonUtils.getTwoDimensionalArray(this.feeTypeList, 'feetId', params.value, {children: 'feeTypes'})
          let feetName = feetIdList.map(i => this.$commonUtils.getMenuName(this.feeTypeList, 'feeTypes').find(ii => ii.feetId == i).feeName).join('/')
          return `<span title="${feetName}" key="${Math.random()}">${feetName}</span>`
        } else if (Object.prototype.toString.call(params.value).includes('Number')) {
          return `<span title="${params.value}" style="float: right">${formatAmount(params.value)}</span>`
        }
        return `<span title="${params.value}">${params.value ? params.value : ''}</span>`
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
      rowDoubleClicked(params) {
        if (params.rowPinned == 'bottom') return;
        var row = params.data
        if (this.isFinance) {
          var isTaskPerson = row.tasker ? row.tasker.includes(this.$store.getters.name) : false
          if (
            this.$store.getters.permissions.includes(347) && row.taskNo == 4 && isTaskPerson
            ||
            this.$store.getters.permissions.includes(336) && row.taskNo == 5 && isTaskPerson
            ||
            this.$store.getters.permissions.includes(337) && row.taskNo == 6 && isTaskPerson
          ) {
            this.$emit('events', {action: 'FEE_EDIT', data: {...row, rightKeySign: true, feeType: 3}})
          } else {
            this.$emit('events', {action: 'FEE_SEE', data: row})
          }
          return
        }
        this.$router.push(`seeFeeDetail?feeId=${row.feeId}`)
      },
      changeSelection(n) {
        if (n) {
          this.columnDefs.find(item => item.field == 'sid').checkboxSelection = function (params) {
            // we put checkbox on the name if we are not doing grouping
            return params.columnApi.getRowGroupColumns().length === 0;
          },
            this.columnDefs.find(item => item.field == 'sid').headerCheckboxSelection = function (params) {
              // we put checkbox on the name if we are not doing grouping
              return params.columnApi.getRowGroupColumns().length === 0;
            }
          this.columnDefs.push({})
          this.columnDefs.pop({})
        } else {
          this.columnDefs.find(item => item.field == 'sid').checkboxSelection = false
          this.columnDefs.find(item => item.field == 'sid').headerCheckboxSelection = false
          this.columnDefs.push({})
          this.columnDefs.pop({})
        }
      },
      onGridReady(params) {
        this.gridparams = params
        this.gridApi = params.api;
        this.columnApi = params.columnApi;
      },
      dragStopped(params) {
        let tableHeader = params.columnApi.columnController.gridColumns.map(item => ({
          label: item.colDef.headerName,
          width: item.actualWidth,
          prop: item.colDef.field,
        })).filter(item => item.prop != "group")
        this.tableHeader = tableHeader
        this.changeHeader(tableHeader)
        this.saveLocation()
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
      refreshEvenRowsCurrencyData(params) {
        this.getSummary(this.gridApi.rowModel.rootNode.childrenAfterFilter.map(item => item.data))
        this.currentPageSize = params.api.rowModel.rootNode.allChildrenCount
        this.gridApi.rowModel.rootNode.childrenAfterFilter && this.gridApi.rowModel.rootNode.childrenAfterFilter.length && this.gridApi.rowModel.rootNode.childrenAfterFilter.forEach(rowNode => {
          setTimeout(() => {
            rowNode.setDataValue(
              'sid',
              rowNode.rowIndex + 1)
          }, 0)
        });
        // if(!params.columnApi.columnController.groupAutoColumns) {
        //   this.gridApi.forEachNode(rowNode => {
        //     rowNode.setDataValue(
        //       'sid',
        //       rowNode.rowIndex + 1)
        //   });
        // }
        if (this.feeList.length) {
          // this.$commonUtils.saveFilterModel(this.$options.name+this.$route.name,'FilterModel',this.gridApi.getFilterModel())
          if (params.type == "filterChanged") {
            let obj = this.gridApi.getFilterModel()
            for (let k in obj) {
              if (obj.hasOwnProperty(k)) {
                if (obj[k].values && !obj[k].values.length) {
                  delete obj[k]
                }
              }
            }
            Object.keys(obj).length && this.$commonUtils.saveFilterModel(this.$options.name + this.$route.name, 'FilterModel', this.gridApi.getFilterModel())
            var data = this.$commonUtils.getFilterModel(this.$options.name + this.$route.name, 'FilterModel');
            var arr = Object.keys(data);
            if (arr.length) {
              this.brushRightHasFilter = true
            } else {
              this.brushRightHasFilter = false
            }
          }
          if (params.type == "sortChanged") {
            this.$commonUtils.saveFilterModel(this.$options.name + this.$route.name, 'SortModel', this.gridApi.getSortModel())
          }
        }
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
      firstAudit(row) {
        if (row.tasker.includes(this.$store.getters.name)) {
          this.$emit('events', {action: 'FEE_FIRSTAUDIT', data: {...row, rightKeySign: true}})
        } else {
          this.$message.error('此任务不是你的任务！')
        }
      },
      rebook(row) {
        this.$emit('events', {action: 'FEE_REBOOK', data: {...row, rightKeySign: true}})
      },
      editBelongMonth(row) {
        this.isModList = [row.feeId]
        checkPermission({feeId: row.feeId}).then(res => {
          if (res.data.modify == 0) {
            this.$message.error('该费用您无法修改')
          } else {
            this.plEditView = true
            this.plTitle = '修改所属月'
            this.belongMonthView = true
            if (row.belongtoDate) {
              this.plForm.belongtoDate = row.belongtoDate
            }
          }
        })
      },
      editPayStyle(row) {
        this.isModList = [row.feeId]
        checkPermission({feeId: row.feeId}).then(res => {
          if (res.data.modify == 0) {
            this.$message.error('该费用您无法修改')
          } else {
            this.plEditView = true
            this.plTitle = '修改支付方式'
            this.payKindsView = true
            this.queryCompanyByPermission([row])
          }
        })
      },
      headmanAudit(row) {
        if (row.tasker.includes(this.$store.getters.name)) {
          this.$emit('events', {action: 'FEE_FIRSTAUDIT', data: {...row, rightKeySign: true}})
        } else {
          this.$message.error('此任务不是你的任务！')
        }
      },
      financeAddAudit(row) {
        if (row.tasker.includes(this.$store.getters.name)) {
          this.$emit('events', {action: 'FEE_ADD_AUDIT', data: {...row, rightKeySign: true}})
        } else {
          this.$message.error('此任务不是你的任务！')
        }
      },
      financeBillAudit(row) {
        if (row.tasker.includes(this.$store.getters.name)) {
          this.$emit('events', {action: 'FEE_USER_AUDIT', data: {...row, rightKeySign: true}})
        } else {
          this.$message.error('此任务不是你的任务！')
        }
      },
      submitFee1(row) {
        if (row.tasker.includes(this.$store.getters.name)) {
          this.$emit('events', {action: 'FEE_SUBMIT', data: {...row, rightKeySign: true}})
        } else {
          this.$message.error('此任务不是你的任务！')
        }
      },
      getRowContextmenuList(row) {
        let list = []
        if (this.isFinance) {
          list = [
            {name: '复制', action: 'copy'},
            {name: '修改', action: 'edit', permissions: 222},
            {name: '删除', action: 'deleteFee', permissions: 223},
            {name: '提交', action: 'submitFee1', permissionsData: [{premission: 219, taskNo: 1}]},
            {name: '查验', action: 'firstAudit', permissionsData: [{premission: 336, taskNo: 5}]},
            {
              name: '组长审核',
              action: 'headmanAudit',
              permissionsData: [{premission: 220, taskNo: 2}, {premission: 221, taskNo: 3}]
            },
            {name: '财务负责人加审', action: 'financeAddAudit', permissionsData: [{premission: 516, taskNo: 8}]},
            {name: '账单财务岗审核', action: 'financeBillAudit', permissionsData: [{premission: 518, taskNo: 9}]},
            {name: '改签', action: 'rebook'},
            {name: '复制费用', action: 'copyFee'},
            {name: '修改所属月', action: 'editBelongMonth', permissions: 327},
            {name: '修改支付方式', action: 'editPayStyle', permissions: 328},
          ]
        } else {
          list = [
            {name: '暂存', action: 'temporarStorage'},
            {name: '隐藏', action: 'hidden'},
            {name: '复制', action: 'copy'},
            {name: '复制费用', action: 'copyFee'},
            {name: '提交', action: 'toExamine', permissionsData: [{premission: 219, taskNo: 1}]},
            {
              name: '审核',
              action: 'toExamine',
              permissionsData: [{premission: 220, taskNo: 2}, {premission: 221, taskNo: 3}]
            },
            {name: '修改', action: 'edit', permissions: 222,},
            {name: '删除', action: 'deleteFee', permissions: 223,}]
        }
        return list.filter(item => {
          if (item.permissions) {
            return this.$store.getters.permissions.includes(item.permissions)
          } else if (item.permissionsData) {
            return item.permissionsData.some(itm => this.$store.getters.permissions.includes(itm.premission) && row.taskNo == itm.taskNo)
          } else {
            return true
          }
        })
      },
      copyFee(row) {
        this.addFeeView = true;
        this.copyFeeId = row.feeId
        this.copySign = 'one'
      },
      copyFees() {
        this.addFeeView = true;
        this.copyFeeId = [...new Set(this.getSelectedRows().map(item => item.feeId))].join(',')
        if ([...new Set(this.getSelectedRows().map(item => item.feeId))].length > 1) {
          this.copySign = 'more'
        } else {
          this.copySign = 'one'
        }

      },
      submitCopyFee() {
        if (this.feeNum <= 0) {
          this.$message.error('费用数量必须大于0!')
          return
        }
        if (this.copySign == 'one') {
          if (!this.isFinance) {
            copyFee({
              feeId: this.copyFeeId,
              copyNum: this.feeNum
            }).then(res => {
              this.$message.success('复制费用成功，请到“待提交”中查看。')
              this.queryModuleData.taskNo == 1 && this.queryFeeList()
              this.addFeeView = false
              this.copyFeeId = ''
              this.feeNum = 1
            })
          } else {
            if (this.feeNum == 1) {
              copyFee({
                feeId: this.copyFeeId,
                copyNum: this.feeNum
              }).then(res => {
                this.queryModuleData.taskNo == 1 && this.queryFeeList()
                this.addFeeView = false
                this.copyFeeId = ''
                this.feeNum = 1
                this.$emit('events', {action: 'FEE_EDIT', data: {...res.data[0], rightKeySign: true, feeType: 3}})
              })
            } else {
              copyFee({
                feeId: this.copyFeeId,
                copyNum: this.feeNum
              }).then(res => {
                this.$message.success('复制费用成功，请到“待提交”中查看。')
                this.queryModuleData.taskNo == 1 && this.queryFeeList()
                this.addFeeView = false
                this.copyFeeId = ''
                this.feeNum = 1
              })
            }
          }
        } else if (this.copySign == 'more') {
          copyFee({
            feeIds: this.copyFeeId,
            copyNum: this.feeNum
          }).then(res => {
            this.$message.success('复制费用成功，请到“待提交”中查看。')
            this.queryModuleData.taskNo == 1 && this.queryFeeList()
            this.addFeeView = false
            this.copyFeeId = ''
            this.feeNum = 1
          })
        }
      },
      toExamine(row) {
        this.$router.push({
          path: `/workbench/finance/addFeeDetail/3`,
          query: {feeId: row.feeId, taskId: row.taskId, taskNo: row.taskNo}
        })
      },
      temporarStorage(row, column, event) {
        this.$store.commit('tabs/CHANGE_STORAGETABLE', {
          type: 'push',
          title: '暂存费用',
          name: '暂存费用',
          identification: this.identification,
          data: row
        })
        this.$refs.myTabs.tabClick({name: '暂存费用'}, true)
      },
      getCurFilterId(title) {
        switch (title) {
          case "案件管理":
            return "caseId";
          case "递交官方":
            return "insId";
          case "官方通知":
            return "tmFileId";
          case "境外账单":
            return "abroadBillId";
          case "账单":
            return "billId";
          case "费用":
            return "feeId";
        }
      },
      hidden(row) {
        this.feeList = this.feeList.filter(item => item[this.getCurFilterId(this.pageTitle)] != row[this.getCurFilterId(this.pageTitle)])
        // this.caseList.splice(this.caseList.indexOf(row),1)
        this.currentPageSize -= 1
      },
      editableTab(data) {
        if (data && data != 0) {
          this.myTabsActivity = true
        } else {
          this.myTabsActivity = false
        }
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
      leftCheckChange(e) {
        // if (e.length + this.transferValue.length > 15) {
        //   this.$message({
        //     type: "warning",
        //     message: `您最多选择15项`
        //   });
        //   e.pop();
        // }
      },
      filterCheck(val) {
        this.filterText = val;
      },
      handleChange(boolean) {
        if (!boolean) {
          this.checkboxState = false
        }
      },
      checkBox(e, property, values) {
        if (this.queryModuleData[property].includes('') && this.queryModuleData[property].filter(item => item).length != values.filter(item => item).length) {
          this.queryModuleData[property] = this.queryModuleData[property].filter(item => item)
        }
        if (e[e.length - 1] == '') {
          this.queryModuleData[property] = values.map(item => item.id)
        }
      },
      savePreference(num) {
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
          if (res.success) {
            this.checkboxState = false;
            this.filterText = ''
            if (!num) {
              this.queryFeeList();
            }
            this.getAllWfs();
          }
        });
      },
      delPreference(num) {
        const data = {
          userId: this.userId,
          bussId: this.bussId
        };
        delPreference(data).then(res => {
          if (res.success) {
            this.checkboxState = false;
            if (!num) {
              this.queryFeeList();
            }
            this.getAllWfs();
          }
        });
      },
      changeHeader(n) {
        if (n && n.length) {
          this.checkCaseList = n.map(item => item.prop).filter(item => item != 'sid')
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
            // this.$nextTick(()=>{
            //   this.feeList.push({})
            //   this.feeList.pop()
            // })
          });
        }
      },

      generateData(arr) {
        arr.forEach(item => {
          item.key = item.filterId;
          item.label = item.filterName;
        });
        return arr;
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
      defaultQuerySearch() {
        this.queryModuleData = JSON.parse(localStorage.getItem('queryModuleData')) ? JSON.parse(localStorage.getItem('queryModuleData')).find(item => item.name == this.$options.name + this.$route.name) ? JSON.parse(localStorage.getItem('queryModuleData')).find(item => item.name == this.$options.name + this.$route.name).queryModuleData : {} : {}
        if (this.queryModuleData.belongtoDateBeginOut) {
          this.currentYear = this.queryModuleData.belongtoDateBeginOut.slice(0, 4)
          this.currentMonth = this.queryModuleData.belongtoDateBeginOut.slice(5)
        }
        if (this.queryModuleData.taskNo) {
          this.searchType = 1
        }
        if (this.queryModuleData.paymentDeptIdOut || this.queryModuleData.statusDates) {
          this.searchType = 2
          this.$set(this.queryModuleData, 'taskNo', null)
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
              this.queryFeeList()
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
          });
        })
      },
      copy(row, value, event) {
        if (value) {
          this.$copyText(value).then(
            res => {
            })
        } else {
          this.$copyText(event.target.innerText).then(
            res => {
            })
        }
      },
      handleCheckboxState() {
        this.checkboxState = !this.checkboxState;
      },
      closeSelect() {
        this.selectionOptionState = false
      },
      clearSearch(that) {
        for (var key in that.queryModuleData) {
          let list = []
          if (!that.isFinance) {
            list = ['taskNo']
          } else {
            list = ['taskNo', 'paymentDeptIdOut', 'belongtoDateBeginOut']
          }
          if (!list.includes(key)) {
            if (key.includes('Date') && key.includes('Array')) {
              that.$set(that.queryModuleData, key, ['', ''])
            } else if (key.includes('Array') || key.includes('List')) {
              that.$set(that.queryModuleData, key, [])
            } else if (key === 'caseTypeIds' || key === 'feetIds' || key === 'deptGroupIds') {
              that.$set(that.queryModuleData, key, [])
            } else {
              that.$set(that.queryModuleData, key, null)
            }
          }
        }
        if (that.$refs.multiCascader) {
          that.$refs.multiCascader.forEach(item => {
            item.$el.querySelector('.el-input__inner').value = ''
          })
        }
      },
      handleSearch(flag) {
        if (typeof flag == 'object') {
          const {searchType, searchData} = flag
          this.queryModuleData = Object.assign(this.queryModuleData, searchData)
          if (searchType !== undefined) {
            this.searchType = searchType
          }
        } else {
          this.searchType = flag || 0
        }
        this.drawerState = false
        this.selectionState = false
        this.multipleSelection = []
        this.listQuery.pageNo = 1
        if (this.searchType) { //外部搜索

        } else {
          // for (var key in this.queryModuleData) {
          //   let list = []
          //   if(!this.isFinance){
          //     list = ['taskNo']
          //   }else{
          //     list = ['taskNo', 'paymentDeptIdOut', 'belongtoDateBeginOut', 'wfStatus']
          //     this.currentYear = ''
          //     this.currentMonth = ''
          //   }
          //   if(list.includes(key)){
          //     this.$set(this.queryModuleData,key,null)
          //   }
          // }
        }
        this.queryFeeList()
        if (JSON.parse(localStorage.getItem('queryModuleData'))) {
          var arr = JSON.parse(localStorage.getItem('queryModuleData'))
        } else {
          var arr = []
        }
        if (arr.find(item => item.name == this.$options.name + this.$route.name)) {
          arr.find(item => item.name == this.$options.name + this.$route.name).queryModuleData = this.queryModuleData
        } else {
          arr.push({name: this.$options.name + this.$route.name, queryModuleData: this.queryModuleData})
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
      edit(row) {
        checkPermission({feeId: row.feeId}).then(res => {
          if (res.data.modify == 0) {
            this.$message.error('该费用您无法修改')
          } else {
            if (this.isFinance) {
              this.$emit('events', {action: 'FEE_EDIT', data: {...row, rightKeySign: true}})
              return
            }
            this.$router.push(`addFeeDetail/2?feeId=${row.feeId}`)
          }
        })
      },
      deleteFees(list) {
        if (this.isDetail) {
          this.deletDetailsConfirm(list)
        } else {
          this.deletFeesConfirm(list)
        }
      },
      deletDetailsConfirm(list) {
        checkPermission({feeIdList: [...new Set(list.map(item => item.feeId))]}).then(res => {
          let isDelList = res.data.filter(item => item.delete) || []
          let notDelList = res.data.filter(item => !item.delete) || []
          if (notDelList.length) {
            let notice = ''
            if (isDelList.length) {
              notice = `已选费用中:  ${list.filter(item => isDelList.find(i => i.feeId == item.feeId)).length}条明细可删除; ${list.filter(item => notDelList.find(i => i.feeId == item.feeId)).length}条明细无法删除, 是否继续?`
            } else {
              notice = '所选明细都无法删除！'
            }
            this.$confirm(notice, "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            })
              .then(() => {
                if (isDelList.length) {
                  deleteFeeDetail({
                    checkFlag: 1,
                    feeDetailIdList: list.filter(item => isDelList.find(i => i.feeId == item.feeId)).map(item => item.feeDetailId)
                  }).then(res => {
                    if (res.messageType == -6) {
                      this.$confirm(res.message, "提示", {
                        confirmButtonText: `删除${list.filter(item => isDelList.find(i => i.feeId == item.feeId)).length}条费用明细`,
                        cancelButtonText: "删除所有费用明细",
                        distinguishCancelAndClose: true,
                        type: "warning"
                      }).then(() => {
                        deleteFeeDetail({
                          checkFlag: 0,
                          include: 1,
                          feeDetailIdList: list.filter(item => isDelList.find(i => i.feeId == item.feeId)).map(item => item.feeDetailId)
                        }).then(res => {
                          this.$message({
                            type: "success",
                            message: "删除成功"
                          });
                          this.$commonUtils.partDel(this.feeList, res.data.feeDetailIdList, 'feeDetailId', () => {
                            this.total && this.total--;
                            this.currentPageSize--;
                            this.$message.success('删除成功!')
                          })
                        })
                      }).catch((action) => {
                        action === 'cancel' && deleteFeeDetail({
                          checkFlag: 0,
                          include: 2,
                          feeDetailIdList: list.filter(item => isDelList.find(i => i.feeId == item.feeId)).map(item => item.feeDetailId)
                        }).then(res => {
                          this.$message({
                            type: "success",
                            message: "删除成功"
                          });
                          this.$commonUtils.partDel(this.feeList, res.data.feeDetailIdList, 'feeDetailId', () => {
                            this.total && this.total--;
                            this.currentPageSize--;
                            this.$message.success('删除成功!')
                          })
                        })
                      })
                    } else {
                      this.$message({
                        type: "success",
                        message: "删除成功"
                      });
                      this.$commonUtils.partDel(this.feeList, res.data.feeDetailIdList, 'feeDetailId', () => {
                        this.total && this.total--;
                        this.currentPageSize--;
                        this.$message.success('删除成功!')
                      })
                    }
                  })
                }
              }).catch()
          } else {
            this.$confirm("此操作将永久删除费用明细, 是否继续?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            })
              .then(() => {
                deleteFeeDetail({
                  checkFlag: 1,
                  feeDetailIdList: list.filter(item => isDelList.find(i => i.feeId == item.feeId)).map(item => item.feeDetailId)
                }).then(res => {
                  if (res.messageType == -6) {
                    this.$confirm(res.message, "提示", {
                      confirmButtonText: `删除${list.filter(item => isDelList.find(i => i.feeId == item.feeId)).length}条费用明细`,
                      cancelButtonText: "删除所有费用明细",
                      distinguishCancelAndClose: true,
                      type: "warning"
                    }).then(() => {
                      deleteFeeDetail({
                        checkFlag: 0,
                        include: 1,
                        feeDetailIdList: list.filter(item => isDelList.find(i => i.feeId == item.feeId)).map(item => item.feeDetailId)
                      }).then(res => {
                        this.$message({
                          type: "success",
                          message: "删除成功"
                        });
                        this.$commonUtils.partDel(this.feeList, res.data.feeDetailIdList, 'feeDetailId', () => {
                          this.total && this.total--;
                          this.currentPageSize--;
                          this.$message.success('删除成功!')
                        })
                      })
                    }).catch((action) => {
                      action === 'cancel' && deleteFeeDetail({
                        checkFlag: 0,
                        include: 2,
                        feeDetailIdList: list.filter(item => isDelList.find(i => i.feeId == item.feeId)).map(item => item.feeDetailId)
                      }).then(res => {
                        this.$message({
                          type: "success",
                          message: "删除成功"
                        });
                        this.$commonUtils.partDel(this.feeList, res.data.feeDetailIdList, 'feeDetailId', () => {
                          this.total && this.total--;
                          this.currentPageSize--;
                          this.$message.success('删除成功!')
                        })
                      })
                    })
                  } else {
                    this.$message({
                      type: "success",
                      message: "删除成功"
                    });
                    this.$commonUtils.partDel(this.feeList, res.data.feeDetailIdList, 'feeDetailId', () => {
                      this.total && this.total--;
                      this.currentPageSize--;
                      this.$message.success('删除成功!')
                    })
                  }
                })
              })
              .catch(() => {
              });
          }
        })
      },
      deletFeesConfirm(list) {
        checkPermission({feeIdList: list.map(item => item.feeId)}).then(res => {
          let isDelList = res.data.filter(item => item.delete) || []
          let notDelList = res.data.filter(item => !item.delete) || []
          if (notDelList.length) {
            let notice = ''
            if (isDelList.length) {
              notice = `已选费用中:  ${isDelList.length}条费用可删除; ${notDelList.length}条费用无法删除, 是否继续?`
            } else {
              notice = '所选费用都无法删除！'
            }
            this.$confirm(notice, "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }).then(() => {
              if (isDelList.length) {
                deleteFee({feeIds: isDelList.map(item => item.feeId).join(',')}).then(res => {
                  this.$message({
                    type: "success",
                    message: "删除成功"
                  });
                  this.$commonUtils.partDel(this.feeList, isDelList.map(item => item[this.bussId == '14' ? 'feeId' : 'feeDetailId']), this.bussId == '14' ? 'feeId' : 'feeDetailId', () => {
                    this.total && this.total--;
                    this.currentPageSize--;
                    this.$message.success('删除成功!')
                  })
                  // this.queryFeeList()
                })
              }
            }).catch()
          } else {
            this.$confirm("此操作将永久删除费用, 是否继续?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            })
              .then(() => {
                deleteFee({feeIds: isDelList.map(item => item.feeId).join(',')}).then(res => {
                  this.$message({
                    type: "success",
                    message: "删除成功"
                  });
                  this.$commonUtils.partDel(this.feeList, isDelList.map(item => item[this.bussId == '14' ? 'feeId' : 'feeDetailId']), this.bussId == '14' ? 'feeId' : 'feeDetailId', () => {
                    this.total && this.total--;
                    this.currentPageSize--;
                    this.$message.success('删除成功!')
                  })
                  // this.queryFeeList()
                })
              })
              .catch(() => {
              });
          }
        })
      },
      deleteFee(row) {
        if (this.isDetail) {
          checkPermission({feeId: row.feeId}).then(res => {
            if (res.data.delete == 0) {
              this.$message.error('该费用您无法删除')
            } else {
              this.$confirm("此操作将永久删除该费用明细, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
              })
                .then(() => {
                  deleteFeeDetail({
                    checkFlag: 1,
                    feeDetailIdList: [row.feeDetailId]
                  }).then(res => {
                    if (res.messageType == -6) {
                      this.$confirm(res.message, "提示", {
                        confirmButtonText: "删除1条费用明细",
                        cancelButtonText: "删除所有费用明细",
                        distinguishCancelAndClose: true,
                        type: "warning"
                      }).then(() => {
                        deleteFeeDetail({
                          checkFlag: 0,
                          include: 1,
                          feeDetailIdList: [row.feeDetailId]
                        }).then(res => {
                          this.$message({
                            type: "success",
                            message: "删除成功"
                          });
                          this.$commonUtils.partDel(this.feeList, res.data.feeDetailIdList, 'feeDetailId', () => {
                            this.total && this.total--;
                            this.currentPageSize--;
                            this.$message.success('删除成功!')
                          })
                        })
                      }).catch((action) => {
                        action === 'cancel' && deleteFeeDetail({
                          checkFlag: 0,
                          include: 2,
                          feeDetailIdList: [row.feeDetailId]
                        }).then(res => {
                          this.$message({
                            type: "success",
                            message: "删除成功"
                          });
                          this.$commonUtils.partDel(this.feeList, res.data.feeDetailIdList, 'feeDetailId', () => {
                            this.total && this.total--;
                            this.currentPageSize--;
                            this.$message.success('删除成功!')
                          })
                        })
                      })
                    } else {
                      this.$message({
                        type: "success",
                        message: "删除成功"
                      });
                      this.$commonUtils.partDel(this.feeList, res.data.feeDetailIdList, 'feeDetailId', () => {
                        this.total && this.total--;
                        this.currentPageSize--;
                        this.$message.success('删除成功!')
                      })
                    }
                  })
                })
                .catch(() => {
                });
            }
          })
        } else {
          checkPermission({feeId: row.feeId}).then(res => {
            if (res.data.delete == 0) {
              this.$message.error('该费用您无法删除')
            } else {
              this.$confirm("此操作将永久删除该费用, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
              })
                .then(() => {
                  deleteFee({feeId: row.feeId}).then(res => {
                    this.$message({
                      type: "success",
                      message: "删除成功"
                    });
                    // this.currentPageSize=this.currentPageSize-1
                    // this.handleSearch(this.searchType)
                    // this.queryFeeList()
                    this.$commonUtils.partDel(this.feeList, [row[this.bussId == '14' ? 'feeId' : 'feeDetailId']], this.bussId == '14' ? 'feeId' : 'feeDetailId', () => {
                      this.total && this.total--;
                      this.currentPageSize--;
                      this.$message.success('删除成功!')
                    })
                  })
                })
                .catch(() => {
                });
            }
          })
        }
      },
      closeDialogSelectOption() {
        this.selectionOptionState = false
        this.selectionState = false
      },
      selectionList(type, result = 1, failReason) {
        // this.selectionState=true
        this.multipleTypeText = type
        this.jumpDetailSubmisson(result, failReason)
        // if(this.multipleTypeText=='费用提交'){
        //   this.queryModuleData.taskNo =1
        //   this.queryFeeList()
        // }else if(this.multipleTypeText=='报销人所属组审核'){
        //   this.queryModuleData.taskNo =2
        //   this.queryFeeList()
        // }else if(this.multipleTypeText=='承担组审核'){
        //   this.queryModuleData.taskNo =3
        //   this.queryFeeList()
        // } else if(this.multipleTypeText=='导出'){
        //
        // }
      },
      exportList(flag) {
        this.exportType = flag
        // if(flag==2){
        //   this.multipleSelection.forEach(item=>{
        //     this.$refs.costList.toggleRowSelection(item, false)
        //   })
        //   this.multipleSelection = []
        //   this.selectionState = true;
        //   this.multipleTypeText = '列表导出';
        // } else if(flag == 1) {
        //
        //   this.selectionOptionState=true
        // }
        this.selectionOptionState = true
        // this.jumpDetailSubmisson()
      },
      async jumpDetailSubmisson(result = 1, failReason) {
        if (!['改签', '列表导出'].includes(this.multipleTypeText) && (typeof this.checkSelectedRowsTaskNo() == 'number')) {
          this.$message.error(`有${this.checkSelectedRowsTaskNo()}条费用流程状态不符合当前操作！`)
          return
        }
        if (this.checkSelectedRowsTaskNo() == 'error') {
          this.$message.error('请选择费用！')
          return
        }
        if (this.multipleTypeText.includes('审核') || this.multipleTypeText == '费用提交' || this.multipleTypeText == '费用加批' || this.multipleTypeText == '财务负责人加审' || this.multipleTypeText == '账单财务岗审核') {
          const data = {
            taskIdList: this.getSelectedRows().map(item => item.taskId),
            result: result,
            failReason
          }
          if (this.multipleTypeText == '费用提交') {
            const selectedRows = this.getSelectedRows()
            const invalidIndexes = []
            selectedRows.forEach((row, index) => {
              if (row.feeDetails && row.feeDetails.find(j => j.feetId == 210) && !row.custIdShort) {
                invalidIndexes.push(index + 1)
              }
            })
            
            if (invalidIndexes.length > 0) {
              let message = ''
              if (selectedRows.length === 1) {
                message = '有客户必须填写客户名称！'
              } else {
                message = `第${invalidIndexes.join('、')}条费用有客户必须填写客户名称！`
              }
              
              const confirmed = await this.$confirm(`${message}是否继续提交？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                return true
              }).catch(() => {
                return false
              })
              
              if (!confirmed) return
            }
          }
          batchDoFeeTask(data).then(Response => {
            this.queryPartData({
              feeDetailIds: this.getSelectedRows().map(item => item.feeDetailId),
              feeIds: this.getSelectedRows().map(item => item.feeId)
            })
            // this.queryFeeList()
            // this.handleSearch(this.searchType)
          })

        }
        if (this.multipleTypeText == '改签') {
          checkFeeTasker({taskIdList: this.getSelectedRows().map(item => item.taskId)}).then(res => {
            queryEndorseTasker().then(res => {
              this.endorseTaskerList = res.data
              this.endorseTaskerState = true
            })
          })
        }
        if (this.multipleTypeText == '列表导出') {
          this.selectionOptionState = true
        }
        if (this.multipleTypeText == '支付') {
          this.payOffView = true
          this.payOffBelongtoDate = this.$wUtil.getDate('', 'day')
          // this.submitFee(1)
        }
      },
      endorseFee() {
        if (this.endorseTasker) {
          endorseFee({
            auditUserIds: this.endorseTasker,
            taskIdList: this.getSelectedRows().map(item => item.taskId)
          }).then(res => {
            this.endorseTaskerState = false
            this.multipleSelection = []
            this.selectionState = false
            this.queryPartData({
              feeDetailIds: this.getSelectedRows().map(item => item.feeDetailId),
              feeIds: this.getSelectedRows().map(item => item.feeId)
            })
            // this.queryFeeList()
          })
        } else {
          this.endorseTaskerState = false
          this.multipleSelection = []
          this.selectionState = false
          this.queryPartData({
            feeDetailIds: this.getSelectedRows().map(item => item.feeDetailId),
            feeIds: this.getSelectedRows().map(item => item.feeId)
          })
          // this.queryFeeList()
        }
      },
      queryFeeTaskDefine() {
        queryFeeTaskDefine().then(res => {
          this.feeWfstatusList = res.data.filter(item => !!item)
        })
      },
      // changeTextRange(e) {
      //   this.$set(this.queryModuleData, 'agentNumEnd', e)
      // },
      async queryPartData({feeIds = '', feeDetailIds = []}) {
        let tag = ''
        this.bussId == 45 && (tag = 2) // 明细
        await this.$commonUtils.partUpdate(
          this.feeList,
          queryFeeList,
          {
            argSearch: {tag},
            searchKey: 'idStr',
            key: [tag ? 'feeDetailId' : 'feeId'],
            value: tag ? String(feeDetailIds) : String(feeIds)
          },
          (list) => {
            this.gridApi.refreshCells();
            if (this.bussId !== 45) { // 费用
              let rowId = []
              String(feeIds).split(',').forEach(item => {
                if (this.feeList.find(i => i.feeId == item).taskNo !== this.queryModuleData.taskNo && this.queryModuleData.taskNo) {
                  rowId.push(this.feeList.find(i => i.feeId == item).feeId)
                }
              })
              this.$commonUtils.partDel(this.feeList, rowId, 'feeId', () => {
                this.total--;
                this.currentPageSize--;
              })
            } else { // 明细
              let rowId = []
              list && list.length && list.map(item => item.feeDetailId).forEach(item => {
                if (this.feeList.find(i => i.feeDetailId == item).taskNo !== this.queryModuleData.taskNo && this.queryModuleData.taskNo) {
                  rowId.push(this.feeList.find(i => i.feeDetailId == item).feeDetailId)
                }
              })
              this.$commonUtils.partDel(this.feeList, rowId, 'feeDetailId', () => {
                this.total--;
                this.currentPageSize--;
              })
            }
          }
        )
      },
      queryFeeList() {
        // this.searchType && (this.queryModuleData.wfStatus = '')
        if (this.queryModuleData.statusDates) {
          this.$set(this.queryModuleData, 'paymentDeptIdOut', '')
          this.$set(this.queryModuleData, 'belongtoDateBeginOut', '')
          // this.$set(this.queryModuleData, 'wfStatus', '')
          this.$set(this.queryModuleData, 'currentYear', '')
          this.$set(this.queryModuleData, 'currentMonth', '')
          this.$set(this.queryModuleData, 'taskNo', null)
        }
        const data = {
          pageNo: this.listQuery.pageNo,
          pageSize: this.listQuery.pageSize,
          tag: this.bussId == 14 ? '' : 2
        }
        let list = []
        if (!this.isFinance) {
          list = ['taskNo']
        } else {
          list = ['taskNo', 'paymentDeptId', 'paymentDeptIdOut', 'belongtoDateBegin', 'belongtoDateEnd', 'belongtoDateBeginOut', 'wfStatus', 'statusDates', 'statusDateArray']
          // this.currentYear = ''
          // this.currentMonth = ''
        }
        let conditionsModuleList = this.$commonUtils.getLanglist(this.conditionsModuleList.map(item => item.property).map(item => item.split(',')))
        for (var key in this.queryModuleData) {
          if (![...conditionsModuleList, ...list].includes(key)) {
            delete this.queryModuleData[key]
          }
        }
        // this.getSummary()
        // queryFeeSum(Object.assign(data, this.queryModuleData)).then(res=>{
        //   this.$store.commit('caseInformation/SET_SUMMARYDATA',{name:'cost_list',count:res.data})
        // })
        const searchData = Object.assign(data, this.queryModuleData);

        if (this.searchType) {//外部
          searchData.wfStatus = undefined
          if (this.isFinance && this.searchType == 2 && !this.queryModuleData.taskNo || this.queryModuleData.paymentDeptIdOut || this.queryModuleData.statusDates) {
            searchData.wfStatus = '已完成'
          }

          const keys = Object.keys(searchData)
          for (const key of keys) {
            if (key == 'paymentDeptIdOut' && searchData[key]) {
              searchData['paymentDeptId'] = this.queryModuleData.paymentDeptIdOut
            }
            if (key === 'belongtoDateBeginOut' && searchData[key]) {
              searchData['belongtoDateBegin'] = this.queryModuleData.belongtoDateBeginOut
              searchData['belongtoDateEnd'] = this.queryModuleData.belongtoDateBeginOut
            }
            if (key == 'statusDates' && searchData[key]) {
              searchData.statusDateArray = [
                this.$wUtil.getDate('', 'day'),
                this.$wUtil.getDate('', 'day')
              ]
            }
          }

          // 处理完逻辑后，再清理 searchData
          const whiteList = ['business', 'pageNo', 'pageSize', 'tag', ...list]
          Object.keys(searchData).forEach(key => {
            if (!whiteList.includes(key)) {
              delete searchData[key]
            }
          })
        } else {//内部
          for (var key in searchData) {
            let list = []
            if (!this.isFinance) {
              list = ['taskNo']
            } else {
              list = ['taskNo', 'paymentDeptIdOut', 'belongtoDateBeginOut', 'statusDates']
              this.currentYear = ''
              this.currentMonth = ''
            }
            if (list.includes(key)) {
              this.$set(this.queryModuleData, key, null)
              delete searchData[key]
            }
          }
        }
        this.exportQueryModel = JSON.stringify(searchData)
        queryFeeList(searchData).then(res => {
          this.feeList = res.data || []
          this.total = res.total
          if (this.feeList.length) {
            this.getFilterModel()
          }
          this.$nextTick(() => {
            this.getSummary(this.gridApi.rowModel.rootNode.childrenAfterFilter.map(item => item.data))
          })
        })
      },
      getSum(list, type) {
        return list.map(item => item[type]).filter(item => !!item).reduce((x, y) => x + y, 0)
      },
      getSummary(list) {
        let data = {
          total: this.getSum(list, 'total'),
        }
        this.$store.commit('caseInformation/SET_SUMMARYDATA', {name: 'cost_list', count: data})
      },
      catchange(e) {
        this.queryModuleData.feetId = e[e.length - 1]
      },
      clickoutside() {
        this.drawerState = false
      },
      changeDate(n, start, end) {
        this.queryModuleData[start] = n[0]
        this.queryModuleData[end] = n[1]
      },
      // queryCustomerList(query){
      //   if(query !== ''){
      //     queryCustomerNameId({ pageNo: 1, pageSize: 100,keyword:query }).then(res=>{
      //       this.customerNameIdList=res.data
      //     })
      //   }
      // },
      // queryWorkgroupNames(){
      //   queryWorkgroupNames().then(res=>{
      //     this.workgroupNamesList=res.data
      //   })
      // },
      queryFeeTypeList() {
        return queryFeeTypeList()
      },
      // queryDeptByCondition(){
      //   queryDeptByCondition().then(res=>{
      //     this.deptByConditionList=res.data
      //   })
      // },
      // queryUsers(){
      //   queryUsers({pageNo:1,pageSize:10000}).then(res=>{
      //     this.userList=res.data.users
      //   })
      // },

    },
    watch: {
      checkAditView() {
        this.invoiceLater = this.getSelectedRows()[0].invoiceLater=='是' ? 1 : 0
      },
      selectionState(n) {
        // this.changeSelection(n)
      },
      drawerState(n) {
        if (n) {
          this.$nextTick(() => {
            document.getElementById('clearWrap').style.top = document.getElementById('searchWrap').scrollTop + document.getElementById('searchWrap').offsetHeight - 40 + 'px'
          })
        }
      },
      checkboxState(n) {
        if (n) {
          this.$nextTick(() => {
            this.$refs.checkCaseSelect.focus()
          })
        }
      },
    },
    components: {
      Willtable,
      Pagination, SelectOption, MyTabs
    },
    computed: {
      belongMonthList() {
        let year = +this.$wUtil.getDate('', 'year')
        let month = +this.$wUtil.getDate('', 'month').slice(5)
        const list = []
        if (year != this.currentYear) {
          month = 12
        }
        while (month > 0) {
          list.push(month);
          month--
        }
        return list
      },
      clientHeight() {
        let height = 0;
        if (this.$store.state.settings.toolPosTop == 'top') {
          height = 250
        } else if (this.$store.state.settings.toolPosTop == 'right') {
          height = 180
        }
        return (document.documentElement.clientHeight - (this.isFinance ? height : 250))
      },
      pinnedBottomRowData() {
        if (this.isFinance && this.gridApi.rowModel) {
          const columnDisplay = this.isDetail ? ['amount'] : ['total', 'actualReimburse']
          return this.$commonUtils.pinnedBottomRowData(this.gridApi.rowModel.rootNode.childrenAfterFilter.map(item => item.data), this.columnDefs, columnDisplay)
        }
        return ''
      },
    }
  }

</script>
<style lang="scss" scoped>
  @import "~@/styles/icons/font_2251928_asl9bha01s.css";

  /* 修改查询条件更多弹出框样式 */
  .el-transfer {
    display: flex;
    justify-content: space-around;
    align-items: center;

    > > > .el-transfer-panel {
      flex: 1;
    }
  }

  .el-table {
    /deep/ th {
      padding: 5px 0;
      color: rgba(51, 51, 51, 1);
      background: rgba(187, 187, 187, 0.5);
    }

    /deep/ td {
      padding: 0;
    }
  }

  /deep/ .pass-row {
    background: #c9c9c9 !important;
  }

  .clearButton {
    position: absolute;
    right: 18px;
    top: 20px;
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

  .buttonWrap {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    .el-button {
      margin-right: 10px;
      margin-left: 0;
    }
  }

  .buttonWrap2 {
    width: 100%;
    text-align: right;
    margin-bottom: 10px;
    margin-top: 10px;
  }

  .limitDayNum {
    height: 30px;
    display: flex;
    position: relative;
    align-items: center;
    margin-bottom: 10px;

    img {
      width: 30px;
      height: 30px
    }

    span {
      font-family: 'Nunito Sans';
      font-weight: 400;
      font-style: normal;
      font-size: 14px;
      margin-left: 2px;
      margin-right: 10px;
      color: rgb(121, 121, 121);
    }

    .el-select {
      width: 174px;
      height: 32px;
      line-height: 32px;
      margin-right: 20px;

      /deep/ .el-input__icon {
        line-height: 25px
      }

      /deep/ input {
        height: 32px;
        line-height: 32px;
      }
    }
  }

  section {
    position: relative;
    clear: both;
    flex: 1;
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

  /deep/ .selectRow {
    background: #C9C8D0
  }

  .timeLimitTable /deep/ .cell {
    white-space: nowrap;
    text-overflow: clip;
  }

  .w-table {
    position: relative;

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
        top: 0;
        background: none;
        border: none;
        box-sizing: border-box;
      }

    }

    /deep/ .thead-cell {
      vertical-align: middle;
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

  /deep/ .moveIng {
    .virtual {
      border: 2px dotted #666 !important;
    }

  }

  /deep/ .pagination-container {
    padding: 0;
  }

  .DataPicker /deep/ {
    .el-input__prefix {
      display: none;
    }

    .el-input {
      width: 100%;
    }

    .el-input__inner {

      text-align: center;

      padding: 0;
      padding-right: 18px;
      // padding-left: 10px;
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

    .postInfo-container-item {
      /deep/ .el-form-item__content {
        width: 330px;
        display: flex;
        height: 28px;
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
    position: relative;
    display: flex;

    .searchWrap {
      border-radius: 5px;
      top: 34px;
      left: 10px;
      width: 550px;
      max-height: 500px;
      min-height: 200px;
      position: absolute;
      background: #ffffff;
      border: 1px solid #d4d5d5;
      z-index: 1;
      overflow: auto;
      padding: 20px 0;
      box-shadow: 0 3px 6px rgba(111, 111, 111, 0.2);

      /deep/ .el-form {
        padding-bottom: 10px;

        .multi-cascader /deep/ {
          .el-cascader__label {
            max-height: 40px;
            overflow-y: auto
          }
        }

        .el-form-item__label {
          text-align: left;
          padding-left: 32px;
          font-weight: normal;
          float: left;
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
        width: 100%;
        background: #fff;
        right: 10px;
        padding-bottom: 10px;
        position: absolute;
        z-index: 1;
      }
    }
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

  .button_wrap {
    margin-left: 10px
  }

  .searchRight {
    margin-left: 0;
    height: 32px;
    border-top-right-radius: 3px !important;
    border-bottom-right-radius: 3px !important;
    padding: 0 5px
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

  .brush_right {
    position: absolute;
    right: 6px;
    z-index: 1;
    top: -4px;
  }

  .MyTabs {
    width: 100%;
    position: absolute;

    /deep/ .el-tabs {
      .el-tabs__header {
        margin: 0;

        .el-tabs__nav {
          width: 150px;
        }

        .el-tabs__item {
          width: 100%;
        }
      }

      .el-tabs__content {
        background: #fff;
      }
    }
  }

  .MyTabs.activity {
    background: #fff;
    z-index: 8;

    /deep/ .el-tabs {
      .el-tabs__header {
        margin: 0;
        background: #fff;
      }

      .el-tabs__content {
        background: #fff;
      }
    }
  }

  /deep/ .rotateClass {
    transform: rotate(90deg);
    transition: transform 5s ease-in-out
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

  .topBox {
    background-color: #F2F2F2;
    padding-left: 20px;
    display: flex;
    height: 40px;
    /*justify-content: center;*/
    align-items: center;
    margin-bottom: 10px;

    .iconfont {
      margin-right: 10px;
    }
  }

  > > > .no-top {
    .el-dialog__body {
      padding-top: 0;
    }
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
      /*background-color: #f9f9f9;*/
      /*width: 36.7%;*/
      text-align: right;
    }

    /deep/ .el-form-item {
      border-right: 1px solid #d7d7d7;
      margin: 0px !important;
    }

    .first-row {
      border-top: 1px solid #d7d7d7;
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
        flex: 1;
        padding: 5px 15px;
        margin-left: 0 !important;
      }

      /deep/ .el-form-item__label {
        /*line-height: 28px;*/
      }
    }
  }
</style>
