<template>
  <div class="work-time">
    <ViewsSwitching class="ViewsSwitching" @changePattern="changePattern"></ViewsSwitching>
    <div class="buttonWrap" style="margin-bottom: 10px">
    <el-button-group class="button-group-search"  v-clickoutside="clickoutside">
      <el-button id="mySearch" style="margin-right:0" type="primary" size="small" @click="handleSearch(0)">搜索</el-button>
<!--        <el-button type="primary"  class="searchRight"  size="small" icon="el-icon-arrow-down" @click.stop.prevent="drawerState=true"></el-button>-->
      <el-button type="primary"  class="searchRight"  size="small" icon="el-icon-arrow-down" @click.stop.prevent="clearWfStatus"></el-button>
      <transition name="show" mode="out-in">
        <div class="searchWrap" id="searchWrap" v-show="drawerState">
          <el-form size="mini" label-width="120px" class="form-container" @keyup.enter.native="handleSearch(0)" style="margin-top: 2px"  >
            <el-form-item :label="item.filterName+':'"
                          :class="item.filterType==='radio'&&item.values.length>3?'fullItem':'postInfo-container-item'" v-for="(item,index) in conditionsModuleList" :key="index">
              <el-select v-model="queryModuleData[item.property]" placeholder="请选择" v-if="item.filterType==='select'" filterable clearable>
                <el-option v-for="itm in item.values" :key="itm.id" :label="itm.value" :value="itm.id">
                </el-option>
              </el-select>
              <!--<el-checkbox-group style="display:flex" v-model="queryModuleData[item.property]" v-if="item.filterType==='checkbox'">-->
              <!--<el-checkbox v-for="itm in item.values" :label="itm.value" :key="itm.id">{{itm.value}}</el-checkbox>-->
              <!--</el-checkbox-group>-->
              <el-select  v-if="item.filterType==='checkbox'&&item.values&&item.values.length"    v-model="queryModuleData[item.property]" multiple  placeholder="请选择"  filterable  clearable @change="(e)=>checkBox(e,item.property,item.values)">
                <el-option v-for="itm in item.values" :key="itm.id" :label="itm.value" :value="itm.id">
                </el-option>
              </el-select>
              <el-select v-if="item.filterType==='selectMany'" v-model="queryModuleData[item.property]"  filterable remote clearable reserve-keyword placeholder="请输入关键词" :remote-method="(queryString)=>{
          remoteMethod(queryString,index,item.property,item.filterName);
          }">
                <el-option v-for="itm in item['valueList']" :key="itm.id" :label="itm.value" :value="itm.id">
                </el-option>
              </el-select>
              <el-select v-if="item.filterType==='selectMultipleManyTable'" v-model="queryModuleData[item.property]"  filterable remote clearable reserve-keyword placeholder="请输入关键词" :remote-method="(queryString)=>{
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
                v-model="queryModuleData[item.property]"> </el-multi-cascader>
              <!--                  <el-cascader :change-on-select="true" :show-all-levels="false" v-if="item.filterType==='cascader'" collapse-tags filterable clearable v-model="queryModuleData[item.property]"-->
              <!--                               :options="item.values" :props="defaultParams" placeholder="请选择"></el-cascader>-->
            </el-form-item>
          </el-form>
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
          <el-button style="position:absolute;top: 10px;right: 10px" type="text" size="small"  @click="queryFilter"><i class="el-icon-s-tools"></i>更多</el-button>
        </div>
      </transition>
    </el-button-group>

      <el-button type="primary" size="small" style="" @click="() => {workHourView = true;title = '新建工时';dialogType = 'create'}">新建工时</el-button>
<!--        <HandTime @refreshList="queryWorkHours"></HandTime>-->
       <el-dialog
        :title="title"
        append-to-body
        :close-on-click-modal="false"
        :visible.sync="workHourView"
        width="45%"
        height="80%"
        class="abow_dialog"
      >
        <create-work-hour :hoursId="hoursId" :type="dialogType" @refreshList="queryWorkHours" v-if="workHourView && dialogType != 'view'" @closeDialog="workHourView = false"></create-work-hour>
        <work-hour-view :hoursId="hoursId" :type="dialogType" v-if="workHourView && dialogType == 'view'" @closeDialog="workHourView = false"></work-hour-view>
      </el-dialog>
<!--        <el-button style="margin-left: 10px" type="primary" size="small" @click="submitWorkHoursMore()">提交</el-button>-->
<!--        <el-button type="primary" size="small" style="margin-left: 0" @click="allSlect(2)">审核</el-button>-->
      <el-menu class="el-menu-demo" mode="horizontal" @select="(e)=>auditWorkHoursMore(e)" >
        <el-submenu index="1">
          <template slot="title">审核</template>
          <el-menu-item index="1">通过</el-menu-item>
<!--            <el-menu-item index="2">退回</el-menu-item>-->
        </el-submenu>
      </el-menu>
      <el-button size="small" type="primary" @click="rebook">改签</el-button>
      <el-popover
        placement="bottom"
        width="900"
        max-heigth="500"
        trigger="click"
        @hide="hideData"
        >
        <div v-loading="isStatisticsLoading">
          <AgGridVue
            class="ag-theme-balham"
            :style="{width:'100%',height: '300px'}"
            :rowData="analyzeList"
            :columnDefs="analyzeDefs"
            :localeText="$store.state.caseInformation.localeText"
            :defaultColDef="defaultColDef"
            >
            <!-- 工时分析数据 -->
          </AgGridVue>
          <!-- <pagination
            v-show="total>0"
            :total="total"
            :page.sync="listQuery.pageNo"
            :limit.sync="listQuery.pageSize"
            @pagination="queryWorkHours"
            :pageSizes="pageSizesList"
          /> -->
        </div>
        <el-button @click="analyzeData" size="small" type="primary" slot="reference" :loading="isStatisticsLoading">工时分析数据</el-button>
      </el-popover>
      <el-menu class="el-menu-demo" mode="horizontal" @select="(e)=>auditWorkHourSuggest(e)" >
        <el-submenu index="1">
          <template slot="title">审核意见</template>
          <el-menu-item index="1">审核备注</el-menu-item>
          <el-menu-item index="2">补充说明</el-menu-item>
          <!--            <el-menu-item index="2">退回</el-menu-item>-->
        </el-submenu>
      </el-menu>
      <el-button size="small" type="primary" @click="writeOffBill">核销进账单</el-button>
  </div>

    <div class="query-btns" style="display: flex;justify-content: space-between">
      <el-form style="display: flex;flex-wrap:wrap ;justify-content: space-between;flex: 1;margin-right: 30px;">
        <el-form-item  label="工时日期:" label-width="90px">
          <DateRange v-model="queryModuleData.workHourDateArray"  @change="handleSearch(1)"></DateRange>
        </el-form-item>
        <el-form-item  label="员工:" label-width="45px">
          <el-select v-model="queryModuleData.userIdList"   multiple filterable clearable placeholder="请选择" @change="handleSearch(1)">
            <el-option
              v-for="item in userList"
              :key="item.userId"
              :label="item.fullname"
              :value="item.userId">
              <UserIconAndUserName :user-id="item.userId" :userItem="item"></UserIconAndUserName>
            </el-option>
          </el-select>
          <!--            <el-button type="primary" @click="queryWorkHours">查询</el-button>-->
        </el-form-item>
        <el-form-item  label="类型:" label-width="50px">
          <el-radio-group v-model="queryModuleData.hrType" @change="handleSearch(1)">
            <el-radio  label="0" >案件工时</el-radio>
            <el-radio  label="1" >无案工时</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item  label="状态:" label-width="50px">
          <el-radio-group v-model="queryModuleData.whStatus" @change="handleSearch(1)">
<!--              <el-radio  label="1" >待提交</el-radio>-->
<!--              <el-radio  label="2" >待重新提交</el-radio>-->
<!--             -->
<!--              <el-radio  label="7" >已核销</el-radio>-->
            <el-radio  label="4" >全部</el-radio>
            <el-radio  label="3" v-if="$store.getters.permissions.includes(274)">待审核</el-radio>

            <el-radio  label="5" v-if="$store.getters.permissions.includes(275)">未核销</el-radio>
<!--              <el-radio  label="6" v-if="$store.getters.permissions.includes(276)">全部未核销</el-radio>-->
<!--              <el-radio  label="7" v-if="$store.getters.permissions.includes(276)">已核销</el-radio>-->
          </el-radio-group>
<!--            <el-checkbox-group v-model="whStatusList" @change="timelimitState1" >-->
<!--              <el-checkbox class="checkboxChangeRadio" label="4" >全部</el-checkbox>-->
<!--              <el-checkbox class="checkboxChangeRadio" label="3" v-if="$store.getters.permissions.includes(274)">待审核</el-checkbox>-->
<!--              <el-checkbox class="checkboxChangeRadio" label="5" v-if="$store.getters.permissions.includes(275)">本组未核销</el-checkbox>-->
<!--              <el-checkbox class="checkboxChangeRadio" label="6" v-if="$store.getters.permissions.includes(276)">全部未核销</el-checkbox>-->
<!--            </el-checkbox-group>-->
        </el-form-item>

<!--          <el-form-item style="position: relative; margin-left: 30px;height: 30px;bottom: 5px" class="years">-->
<!--            月份:-->
<!--            <el-select style="height: 30px;" v-model="month" @change="changeMonth" clearable>-->
<!--              <el-option-->
<!--                v-for="item in monthList"-->
<!--                :key="item.value"-->
<!--                :label="item.label"-->
<!--                :value="item.value">-->
<!--              </el-option>-->
<!--            </el-select>-->
<!--          </el-form-item>-->
      </el-form>




    </div>

<!--      <div style="height: 30px;">-->

<!--&lt;!&ndash;        <el-button v-show="selectionState&&isSubmit" type="primary" class="exactButton"  size="mini" @click="submitWorkHoursMore()">提交</el-button>&ndash;&gt;-->
<!--&lt;!&ndash;        <el-button v-show="selectionState&&isAudit" type="primary" class="exactButton"  size="mini" @click="auditWorkHoursMore(1)">通过</el-button>&ndash;&gt;-->
<!--&lt;!&ndash;        <el-button v-show="selectionState&&isAudit" type="primary" class="exactButton"  size="mini" @click="auditWorkHoursMore(2)">不通过</el-button>&ndash;&gt;-->
<!--&lt;!&ndash;        <el-button v-show="selectionState&&exportView" type="primary" class="exactButton"  size="mini" @click="toExportList()">导出</el-button>&ndash;&gt;-->
<!--&lt;!&ndash;        <el-button v-show="selectionState" type="primary" class="exactButton"  size="mini" @click="selectionState=false">取消</el-button>&ndash;&gt;-->
<!--      </div>-->
    <div style="position: relative;display: flex;justify-content: space-between">

      <div style="display: flex;align-items: flex-end;margin-bottom: 12px;">
        <el-button  type="primary" class="exactButton"  size="mini" @click="gridApi.deselectAll()">清除所选</el-button>
        <TitleTotal :total="total" :currentPageSize="currentPageSize"/>
      </div>

      <!-- 工时进度显示区域 -->
      <div v-if="totalHourData.workHoursProgress['6']" class="work-progress-container">
        <div class="work-progress-content">
          <div class="progress-item">
            <span class="progress-label">工时进度</span>
          </div>

          <!-- 工时/天 进度条 -->
          <div class="progress-item">
            <div class="progress-bar-wrapper">
              <div class="progress-bar-header">
                <span class="progress-text">{{totalHourData.workHoursProgress['6']}} / 6:00</span>
                <span class="progress-unit">工时/天</span>
              </div>
              <div class="progress-bar">
                <div class="progress-bar-fill" :style="{width: calculateProgress(totalHourData.workHoursProgress['6'], '6:00') + '%'}"></div>
              </div>
              <span class="progress-percentage">{{Math.round(calculateProgress(totalHourData.workHoursProgress['6'], '6:00'))}}%</span>
            </div>
          </div>

          <!-- 工时/周 进度条 -->
          <div class="progress-item">
            <div class="progress-bar-wrapper">
              <div class="progress-bar-header">
                <span class="progress-text">{{totalHourData.workHoursProgress['30']}} / 30:00</span>
                <span class="progress-unit">工时/周</span>
              </div>
              <div class="progress-bar">
                <div class="progress-bar-fill" :style="{width: calculateProgress(totalHourData.workHoursProgress['30'], '30:00') + '%'}"></div>
              </div>
              <span class="progress-percentage">{{Math.round(calculateProgress(totalHourData.workHoursProgress['30'], '30:00'))}}%</span>
            </div>
          </div>

          <!-- 工时/月 进度条 -->
          <div class="progress-item">
            <div class="progress-bar-wrapper">
              <div class="progress-bar-header">
                <span class="progress-text">{{totalHourData.workHoursProgress['120']}} / 120:00</span>
                <span class="progress-unit">工时/月</span>
              </div>
              <div class="progress-bar">
                <div class="progress-bar-fill" :style="{width: calculateProgress(totalHourData.workHoursProgress['120'], '120:00') + '%'}"></div>
              </div>
              <span class="progress-percentage">{{Math.round(calculateProgress(totalHourData.workHoursProgress['120'], '120:00'))}}%</span>
            </div>
          </div>
        </div>
      </div>


      <div style="cursor:pointer;font-size: 14px;top: 0;right: 0;padding-right: 6px;display: flex;align-items: flex-end;">
        <el-button type="text"  @click.native="exportList(1)"><i class="el-icon-download">导出</i></el-button>
        <img style="margin-bottom: 12px;"
         @click="exportList(2)" src="@/assets/moon.png" width="16" alt="">
      </div>
    </div>
    <div class="work-table content_wrap">

      <div class="left_wrap" :style="{width:currentCaseId&&pattern?leftWrapWidth:'100%' }" style="position: relative;">
        <div class="dots" @click="handleCheckboxState">
          <span class="dot">.</span>
          <span class="dot">.</span>
          <span class="dot">.</span>
        </div>
        <el-button class="brush_right" :class="brushRightHasFilter?'red':''" @click="brushRight" type="text" icon="el-icon-brush" ></el-button>
        <div>
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
                   :frameworkComponents="frameworkComponents"

          >
          </AgGridVue>
        </div>

       <pagination
          v-show="total>0"
          :total="total"
          :page.sync="listQuery.pageNo"
          :limit.sync="listQuery.pageSize"
          @pagination="queryWorkHours"
          :pageSizes="pageSizesList"
        />
       </div>
        <div class="right_wrap" v-if="pattern"
         :style="{position:'relative','margin-left':currentCaseId&&pattern?'10px' :'0',height:clientHeight+'px'}">
          <!-- <span class="el-icon-close" slot="close" style="cursor:pointer;position: absolute;right: 0;top: 10px;z-index: 1000" @click="closeCurrentRow"></span> -->
          <seeCaseDetail :style="cssVar" :taskType="taskType" v-if="currentCaseId&&pattern" :case-id="currentCaseId" :sign="1" :backsign="0"></seeCaseDetail>
        </div>
       <div class="checkbox" v-show="checkboxState" >
         <el-select ref="checkCaseSelect" v-model="checkCaseList" multiple   reserve-keyword	 filterable placeholder="请选择" collapse-tags :popper-append-to-body="false"  @visible-change="handleChange"
                    :filter-method="filterCheck">
           <template slot="">
             <div class="checkbox_bottom">
               <el-button size="mini" round @click.stop="delPreference(1)">恢复默认</el-button>
               <el-button style="margin-right: 3px" size="mini" round @click.stop="savePreference(1)">保存设置</el-button>
               <!--<el-button size="mini" round @click.stop="checkNotAtAll">全不选</el-button>-->
             </div>
           </template>
           <el-option v-for="(item,idx) in selectColumnList.filter(item =>item.COLUMN_COMMENT.includes(filterText))" :key="item.COLUMN_NAME" :label="item.COLUMN_COMMENT" :value="item.COLUMN_NAME">
             <!--<el-checkbox v-model="selectBox[idx]">{{item.COLUMN_COMMENT}}</el-checkbox>-->
           </el-option>
         </el-select>
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
<!--         修改弹框-->
       <TimeDialog @updataData="queryWorkHours" @closeDialog="closeEdit" :sign="sign" :data-time="rowDataForm" :wh-status="whStatus" :view="editWorkTime"></TimeDialog>
<!--         <el-dialog-->
<!--            :visible.sync="editWorkTime"-->
<!--            width="80%"-->
<!--            :before-close="closeEdit"-->
<!--            :close-on-click-modal="false"-->
<!--            lock-scroll-->
<!--         >-->
<!--            <div>-->
<!--              <el-form class="edit-form" :model="editWorkTimeForm">-->
<!--                <el-row v-if="rowDataForm.agentNum">-->
<!--                  <el-col :span="8">-->
<!--                    <el-form-item label-width="130px" style="height: 100%;" label="案件文号:">-->
<!--                      {{rowDataForm.agentNum}}-->
<!--                    </el-form-item>-->
<!--                  </el-col>-->
<!--                  <el-col :span="8">-->
<!--                    <el-form-item label-width="130px" label="案件名称:">-->
<!--                      {{rowDataForm.caseName}}-->
<!--                    </el-form-item>-->
<!--                  </el-col>-->
<!--                  <el-col :span="8">-->
<!--                    <el-form-item label-width="130px" label="客户:">-->
<!--                      {{rowDataForm.custName}}-->
<!--                    </el-form-item>-->
<!--                  </el-col>-->
<!--                </el-row>-->
<!--                <el-row v-else>-->
<!--                  <el-col :span="11">-->
<!--                    <el-form-item label-width="130px" label="工作类型:">-->
<!--                        <el-input v-if="rowDataForm.wfStatus=='待提交'&&!onlyLook&&!rowDataForm.agentNum&&rowDataForm.wfStatus!='审核退回'" size="small" v-model="rowDataForm.workTypeName"></el-input>-->
<!--                      <span v-else>{{rowDataForm.workTypeName}}</span>-->
<!--                    </el-form-item>-->
<!--                  </el-col>-->
<!--                  <el-col :span="13">-->
<!--                    <el-form-item label-width="130px" label="客户:">-->
<!--                      {{rowDataForm.custName}}-->
<!--                    </el-form-item>-->
<!--                  </el-col>-->
<!--                </el-row>-->
<!--                <el-row>-->
<!--                  <el-col :span="8">-->
<!--                    <el-form-item label-width="130px" label="员工:">-->
<!--                      {{rowDataForm.whUserName}}-->
<!--                    </el-form-item>-->
<!--                  </el-col>-->
<!--                  <el-col :span="8">-->
<!--                    <el-form-item label-width="130px" label="员工角色:">-->
<!--                      {{rowDataForm.roleName}}-->
<!--                    </el-form-item>-->
<!--                  </el-col>-->
<!--                  <el-col :span="8">-->
<!--                    <el-form-item label-width="130px" label="所属工作组:">-->
<!--                      {{rowDataForm.groupName}}-->
<!--                    </el-form-item>-->
<!--                  </el-col>-->
<!--                </el-row>-->
<!--                <el-row>-->
<!--                  <el-col :span="11">-->
<!--                    <el-form-item label-width="130px" label="开始时间:">-->
<!--                      <TimerComponent v-if="(rowDataForm.wfStatus=='待提交'||rowDataForm.wfStatus=='待重新提交')&&!onlyLook" v-model="rowDataForm.beginDate"></TimerComponent>-->
<!--                      <span v-else>{{rowDataForm.beginDate}}</span>-->
<!--&lt;!&ndash;                      <el-date-picker&ndash;&gt;-->
<!--&lt;!&ndash;                        v-if="(rowDataForm.wfStatus=='待提交'||rowDataForm.wfStatus=='待重新提交')&&!onlyLook"&ndash;&gt;-->
<!--&lt;!&ndash;                        v-model="rowDataForm.beginDate"&ndash;&gt;-->
<!--&lt;!&ndash;                        type="date"&ndash;&gt;-->
<!--&lt;!&ndash;                        placeholder="选择日期">&ndash;&gt;-->
<!--&lt;!&ndash;                      </el-date-picker>&ndash;&gt;-->
<!--                    </el-form-item>-->
<!--                  </el-col>-->
<!--                  <el-col :span="13">-->
<!--                    <el-form-item label-width="130px" label="结束时间:">-->
<!--                      <TimerComponent v-if="(rowDataForm.wfStatus=='待提交'||rowDataForm.wfStatus=='待重新提交')&&!onlyLook" v-model="rowDataForm.endDate"></TimerComponent>-->
<!--                      <span v-else>{{rowDataForm.endDate}}</span>-->
<!--&lt;!&ndash;                      <el-date-picker&ndash;&gt;-->
<!--&lt;!&ndash;                        v-if="(rowDataForm.wfStatus=='待提交'||rowDataForm.wfStatus=='待重新提交')&&!onlyLook"&ndash;&gt;-->
<!--&lt;!&ndash;                        v-model="rowDataForm.endDate"&ndash;&gt;-->
<!--&lt;!&ndash;                        type="date"&ndash;&gt;-->
<!--&lt;!&ndash;                        placeholder="选择日期">&ndash;&gt;-->
<!--&lt;!&ndash;                      </el-date-picker>&ndash;&gt;-->
<!--                    </el-form-item>-->
<!--                  </el-col>-->
<!--&lt;!&ndash;                  <el-col :span="4"></el-col>&ndash;&gt;-->
<!--                </el-row>-->
<!--                <el-row>-->
<!--                  <el-col :span="8">-->
<!--                    <el-form-item label-width="130px" label="记录工时:">-->
<!--                      <el-input v-if="(rowDataForm.wfStatus=='待提交'||rowDataForm.wfStatus=='待重新提交')&&!onlyLook" size="small" v-model="rowDataForm.time"></el-input>-->
<!--                      <span v-else>{{rowDataForm.time}}</span>-->
<!--                    </el-form-item>-->
<!--                  </el-col>-->
<!--                  <el-col :span="8">-->
<!--                    <el-form-item label-width="130px" label="标准费率:">-->
<!--                      {{rowDataForm.criterionRate}}-->
<!--                    </el-form-item>-->
<!--                  </el-col>-->
<!--                  <el-col :span="8">-->
<!--                    <el-form-item label-width="130px" label="金额:">-->
<!--                      {{rowDataForm.totalHour*rowDataForm.criterionRate}}-->
<!--                    </el-form-item>-->
<!--                  </el-col>-->
<!--                </el-row>-->
<!--                <el-row>-->
<!--                  <el-col :span="24" class="tall-height">-->
<!--                    <el-form-item label-width="130px" label="工作内容:">-->
<!--                      <el-input type="textarea" :rows="4" v-if="(rowDataForm.wfStatus=='待提交'||rowDataForm.wfStatus=='待重新提交')&&!onlyLook" size="small" v-model="rowDataForm.workContent"></el-input>-->
<!--                      <span v-else>{{rowDataForm.workContent}}</span>-->
<!--                    </el-form-item>-->
<!--                  </el-col>-->
<!--                </el-row>-->
<!--                <el-row v-if="['3','4','5','6'].includes(whStatus)">-->
<!--                  <el-col :span="8">-->
<!--                    <el-form-item v-if="['3','4','5','6'].includes(whStatus)" label-width="130px" label="核定工时:">-->
<!--                      <TimerComponent @changeTime="changeAppCount(arguments, rowDataForm)" v-if="(rowDataForm.wfStatus=='待审核'||rowDataForm.wfStatus=='我的工时'||rowDataForm.wfStatus=='本组未核销'||rowDataForm.wfStatus=='未核销')&&!onlyLook" v-model="rowDataForm.approvedTime"></TimerComponent>-->
<!--&lt;!&ndash;                      <el-input @input="(v)=>{changeAppCount(v, rowDataForm)}" v-if="(rowDataForm.wfStatus=='待审核'||rowDataForm.wfStatus=='我的工时'||rowDataForm.wfStatus=='本组未核销'||rowDataForm.wfStatus=='未核销')&&!onlyLook" size="small" v-model="rowDataForm.approvedTime"></el-input>&ndash;&gt;-->
<!--                      <span v-else>{{rowDataForm.approvedTime}}</span>-->
<!--                    </el-form-item>-->
<!--                  </el-col>-->
<!--                  <el-col :span="8">-->
<!--                    <el-form-item v-if="['3','4','5','6'].includes(whStatus)" label-width="130px" label="核定费率:">-->
<!--                      <el-input size="small" v-model="rowDataForm.criterionRate"></el-input>-->
<!--                    </el-form-item>-->
<!--                  </el-col>-->
<!--                  <el-col :span="8">-->
<!--                    <el-form-item v-if="['3','4','5','6'].includes(whStatus)" label-width="130px" label="核定金额:">-->
<!--&lt;!&ndash;                      {{rowDataForm.time}}&ndash;&gt;-->
<!--                      <span v-if="changeAppMoney">{{changeAppMoney}}</span>-->
<!--&lt;!&ndash;                      <span v-else>{{ChangeStrToMinutes(rowDataForm.time)*rowDataForm.criterionRate/60}}</span>&ndash;&gt;-->

<!--                    </el-form-item>-->
<!--                  </el-col>-->
<!--                </el-row>-->
<!--                <el-row v-if="['3','4','5','6'].includes(whStatus)">-->
<!--                  <el-col :span="24" class="tall-height">-->
<!--                    <el-form-item v-if="['3','4','5','6'].includes(whStatus)" label-width="130px" label="核定描述:">-->
<!--                      <el-input type="textarea" :rows="4"  v-if="(rowDataForm.wfStatus=='待审核'||rowDataForm.wfStatus=='我的工时'||rowDataForm.wfStatus=='本组未核销'||rowDataForm.wfStatus=='未核销')&&!onlyLook" size="small" v-model="rowDataForm.approvedDesc?rowDataForm.approvedDesc:rowDataForm.workContent"></el-input>-->
<!--                      <span v-else>{{rowDataForm.approvedDesc}}</span>-->
<!--                    </el-form-item>-->
<!--                  </el-col>-->
<!--                </el-row>-->

<!--              </el-form>-->
<!--            </div>-->

<!--            <span v-if="editLook" slot="footer" class="dialog-footer">-->
<!--&lt;!&ndash;              <el-button @click="editWorkTime = false">取 消</el-button>&ndash;&gt;-->
<!--              <el-button @click="closeEdit()">取 消</el-button>-->
<!--              <el-button type="primary" @click.native="modifyWorkTime(rowDataForm)">确 定</el-button>-->
<!--            </span>-->
<!--           <span v-if="isSubmit" slot="footer" class="dialog-footer">-->
<!--&lt;!&ndash;              <el-button @click="editWorkTime = false">取 消</el-button>&ndash;&gt;
<!--              <el-button @click="closeEdit()">取 消</el-button>-->
<!--&lt;!&ndash;              <el-button type="primary" @click="editWorkTime = false">提交</el-button>&ndash;&gt;-->
<!--              <el-button type="primary" @click="submitWork(rowDataForm)">提交</el-button>-->
<!--            </span>-->
<!--           <span v-if="!editLook&&!isSubmit&&!auditWorkHoursView" slot="footer" class="dialog-footer">-->
<!--&lt;!&ndash;              <el-button @click="editWorkTime = false">取 消</el-button>&ndash;&gt;-->
<!--              <el-button @click="closeEdit()">取 消</el-button>-->
<!--            </span>-->
<!--           <span v-if="auditWorkHoursView" slot="footer" class="dialog-footer">-->
<!--&lt;!&ndash;              <el-button @click="editWorkTime = false">取 消</el-button>&ndash;&gt;-->
<!--             <el-button @click="closeEdit()">取 消</el-button>-->
<!--              <el-button type="primary" @click="auditWorkTime(rowDataForm, 1)">通过</el-button>-->
<!--              <el-button type="primary" @click="auditWorkTime(rowDataForm, 2)">不通过</el-button>-->
<!--            </span>-->
<!--          </el-dialog>-->

     </div>
    <SelectOption :buss-id="bussId" v-if="selectionOptionState" :dialog-visible="selectionOptionState" @cancel="closeSelect" :idArray="getSelectedRows().map(item=>item.hoursId)" :defaultMultipleSelect="preferenceList.map(i=>i.title)" :exportType="exportType" :exportQueryModel="exportQueryModel"></SelectOption>

<!--   工时改签   -->
    <el-dialog :close-on-click-modal="false" :show-close="false" :visible.sync="rebookView" title="改签" width="50%">
      <div class="rebookDiv">
        <div class="rebookTitle">确认要改签这些工时吗？请指定您要改签的人</div>
        <div class="rebookBody">
          <div class="bodyRight">
            <div class="rightTitle">设置改签人员</div>
            <div class="rightSearch">
              <el-input style="margin-top: 5px;margin-bottom:5px" v-model="name" v-debounce:searchName="'input',300" size="small" placeholder="搜索部门名称或人员姓名">
                <template slot="prepend"><span class="el-icon-search"></span></template>
              </el-input>
            </div>
            <div class="rightTable">
          <el-table @row-click="rowClick" size="mini" :data="list" border fit empty-text="暂无数据" :row-class-name="rowClassName"
                    current-row-key
                    style="width: 100%;">
            <el-table-column label="部门" prop="deptName"></el-table-column>
            <el-table-column label="姓名" prop="fullname"></el-table-column>
          </el-table>
        </div>
          </div>
        </div>
      </div>
      <div class="fl-ac-jc" style="padding: 20px 0">
        <el-button size="small" @click="closeRebookDialog()">取 消</el-button>
        <el-button size="small" type="primary" @click="submitRebook">确 定</el-button>
      </div>
    </el-dialog>

<!--  审核意见  -->
    <el-dialog :close-on-click-modal="false" :before-close="closeAuditSuggest" :show-close="false" :visible.sync="auditWorkerHourView" :title="auditWorkerHourType == 1 ? '审核备注' : '补充说明'" width="35%">
      <div style="width: 100%">
        <el-form style="width: 100%;">
          <el-form-item style="width: 100%">
            <el-input v-if="auditWorkerHourType == 1" maxlength="100" type="textarea" v-model="auditWorkerHourValue" :autosize="{ minRows: 4}"
                      placeholder="[审核备注]:"></el-input>
            <el-input v-if="auditWorkerHourType == 2" type="textarea" v-model="auditWorkerHourValue" :autosize="{ minRows: 4}"
                      placeholder="[补充说明]:"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="fl-ac-jc" style="padding: 20px 0">
        <el-button size="small" @click="closeAuditSuggest()">取 消</el-button>
        <el-button size="small" type="primary" @click="submitAuditSuggest">确 定</el-button>
      </div>
    </el-dialog>

    <!--  审核意见  -->
    <el-dialog :close-on-click-modal="false" :before-close="closeWriteOffBill" :show-close="true" :visible.sync="writeOffView" title="核销进账单" width="60%">
      <div style="width: 100%">
        <el-table
          ref="writeTable"
          :data="writeOffHourList"
          tooltip-effect="dark"
          style="width: 100%"
          class="writeTable"
          @select="handleWriteOffBillSelection"
          >
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            type="index"
            width="50">
          </el-table-column>
          <el-table-column
            label="账单号"
            width="120">
            <template slot-scope="scope"><span class="pointer" @dblclick="openBillView(scope.row)">{{ scope.row.billNo }}</span></template>
          </el-table-column>
          <el-table-column
            prop="belongToDate"
            label="账单所属月"
            width="120">
          </el-table-column>
          <el-table-column
            prop="caseDesc"
            label="账单描述"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="billSum"
            label="总金额"
            width="120">
          </el-table-column>
          <el-table-column
            prop="wfStatus"
            label="状态"
            width="120">
          </el-table-column>
          <el-table-column
            prop="billUserIdString"
            label="开单人"
            width="120">
          </el-table-column>
        </el-table>
      </div>
      <div class="fl-ac-jc" style="padding: 20px 0">
        <el-button size="small" @click="closeWriteOffBill()">取 消</el-button>
        <el-button size="small" type="primary" @click="writeOffHourBill">核 销</el-button>
      </div>
    </el-dialog>

    <el-dialog v-if="billDetailState" :before-close="beforeBillClose" top title="账单详情" :close-on-click-modal="false" :visible.sync="billDetailState" width="80%">
      <billDetail ref="billdetail" v-if="billDetailState" :type="type" :billData="billData" @cancel="cancelMethod"></billDetail>
    </el-dialog>
  </div>
</template>

<script>
import ViewsSwitching from '@/views/workbench/case/components/ViewsSwitching'
import seeCaseDetail from '@/views/workbench/case/components/ManualIdentification/seeCaseDetail'
import TimeDialog from "./components/TimeDialog";
import bus from '@/utils/Bus'
import HandTime from '@/views/workbench/workTime/components/handTime'
import SelectOption from '@/views/workbench/case/components/SelectOption.vue'
import Pagination from "@/components/Pagination";
import { deriveList,queryHourUserList,addTaskHours } from "@/api/caseList.js";
import { downLoadAll } from '@/utils'
// import MyTabs from '@/views/workbench/case/components/MyTabs'
// import {queryUsers,queryWorkgroupNames,queryDeptByCondition} from '@/api/systemList'
import {queryFeeList,queryFeeTypeList,deleteFee,endorseFee,submitFee,batchDoFeeTask,checkFeeTasker,queryEndorseTasker,queryFeeTaskDefine,queryFeeSum} from "@/api/feeList";
import { submitWorkHours,auditWorkHours,modifyTaskHours,queryCustomerNameId, selectColumn, queryPreference, savePreference,configFilter ,queryFilterConfig,queryFilter,addFilterScheme,delPreference,queryApplicantByIdList,checkPermission,queryWorkHours,queryTotalHour,deleteTaskHours} from "@/api/caseList.js";
import {queryAllUrl} from "@/api/billApi";
import {formatAmount} from '@/utils/filters'
import Summary from "@/components/Summary/index.js";
import dateRangUtil from '@/utils/dateRangUtil'
import {filterAsyncRoutes} from "../../../store/modules/permission";
import CreateWorkHour from "./components/CreateWorkHour";
import WorkHourView from "./components/WorkHourView";
import {updateWorkHourTasker} from "../../../api/caseList";
import {mapState} from "vuex";
import { hxWorkHoursToBill, queryCaseBillList } from '../../../api/billApi'
import BillDetail from '../finance/billviews/components/billDetail'
export default {
  name: "index",
  data() {
    var tableHeader=[]
    if(localStorage.getItem('tableHeader')&&JSON.parse(localStorage.getItem('tableHeader')).find(item=>item.name==this.$options.name+this.$route.name)){
      tableHeader = JSON.parse(localStorage.getItem('tableHeader')).find(item => item.name == this.$options.name+this.$route.name).tableHeader
    }
    return {
      gridApi: {},
      hxBillData: {},
      billData: {},
      billDetailState: false,
      type: 'view',
      writeOffHourIdList: [],
      writeOffHourList: [],
      writeOffView: false,
      auditWorkerHourData: {},
      auditWorkerHourType: '',
      auditWorkerHourValue: '',
      auditWorkerHourView: false,
      cancel: null,
      isStatisticsFlag: 0,
      isStatisticsLoading: false,
      isStatistics: null,
      analyzeList: [],
      analyzeDefs: [
        { headerName: '员工', field: 'userName', menuTabs: ['filterMenuTab','generalMenuTab','columnsMenuTab']},
        { headerName: '记录工时', field: 'jiluSum', menuTabs: ['filterMenuTab','generalMenuTab','columnsMenuTab']},
        { headerName: '核定工时', field: 'hedingSum', menuTabs: ['filterMenuTab','generalMenuTab','columnsMenuTab']},
        { headerName: '账单工时', field: 'zhangdanSum', menuTabs: ['filterMenuTab','generalMenuTab','columnsMenuTab']},
        { headerName: '核定/记录比', field: 'hedingjilu', menuTabs: ['filterMenuTab','generalMenuTab','columnsMenuTab'],cellRenderer: this.analyRenderer},
        { headerName: '账单/核定比', field: 'zhangdanheding', menuTabs: ['filterMenuTab','generalMenuTab','columnsMenuTab'],cellRenderer: this.analyRenderer},
      ],
      defaultColDef: {
        filter: true,
        flex: 1,
        minWidth: 100,
        sortable: true,
        resizable: true,
        filterParams: {
          newRowsAction: 'keep',
          comparator: (a, b)=>{
            return this.$commonUtils.sort(a,b,item.value)
          }
        }
      },
      taskType: '',
      currentId: '',
      leftWrapWidth: '60%',
      currentCaseId: '',
      taskUserId: '',
      name: '',
      list: [],
      rebookUserIdList: [],
      rebookView: false,
      newHoursIdFlag: false,
      hoursId: '',
      dialogType: '新建',
      title: '新建工时',
      workHourView: false,
      exportType: '',
      modify: '',
      sign: '',
      month: '',
      monthList:[{value: '1',label: '一月'},{value: '2',label: '二月'},{value: '3',label: '三月'},{value: '4',label: '四月'},
        {value: '5',label: '五月'},{value: '6',label: '六月'},{value: '7',label: '七月'},{value: '8',label: '八月'},
        {value: '9',label: '九月'},{value: '10',label: '十月'},{value: '11',label: '十一月'},{value: '12',label: '十二月'}
      ],
      flag: '',
      editWorkTimeForm: {},
      rowDataForm: {
      },
      whStatusList:[],
      editWorkTime: false,
      input: '',
      // identification:'work_time_indexworkTime',
      myTabsActivity: false,
      pageTitle: this.$route.meta.title,
      drawerState:false,
      selectionState: false, // 筛选递交复选框
      total: 0,
      isSubmit: false,
      loading: false,
      listLoading: false,
      isAudit: false,
      feeList: [],
      feetList:[],
      queryModuleData: { // 查询条件
        userIdList:[this.$store.getters.userId],
        whStatus:'4',
        workHourDateArray:new dateRangUtil().getCurrentMonth().map(item=>this.$commonUtils.formatDate(item))
      },
      totalHourData:{
        totalHourState:true,
        totalHour:0,
        workHoursProgress: {}
      },
      tableHeader,
      selectionOptionState:false,
      multipleTypeText:'确定',
      defaultParams:{
        value: 'feetId',
        label: 'feeName',
        checkStrictly: true,
        children: 'feeTypes'
      },
      listQuery: {
        pageNo: 1,
        pageSize: JSON.parse(localStorage.getItem('pageSize'))?JSON.parse(localStorage.getItem('pageSize')).find(item=>item.name==this.$route.name)?JSON.parse(localStorage.getItem('pageSize')).find(item=>item.name==this.$route.name).pageSize:10:10
      },
      pageSizesList:[10, 50, 200,500,1000,5000,10000],
      tableDefaultList:[{'label':'案件文号','prop':'agentNum' },{'label':'案件名称','prop':'caseName'},{'label':'客户','prop':'custName'},{'label':'工作类型','prop':'workTypeName'},{'label':'员工','prop':'whUserName'}, {'label':'员工角色','prop':'roleName' }, {'label':'开始时间','prop':'beginDate' },{'label':'所属工作组','prop':'groupName' },{'label':'结束时间','prop':'endDate' },
        {'label':'记录工时','prop':'time' },{'label':'金额','prop':'amount' },{'label':'核定工时','prop':'approvedTime' },{'label':'核定金额','prop':'approvedAmountCust' },{'label':'状态','prop':'wfStatus' },{'label':'提交时间','prop':'submitDate' },{'label':'提交人','prop':'submitUserName' },
      ],
      customerNameIdList:[],
      feeTypeList:[],
      userList:[],
      deptByConditionList:[],
      workgroupNamesList:[],
      feeWfstatusList:[],
      endorseTaskerList:[],
      endorseTaskerState:false,
      endorseTasker:'',
      exportQueryModel:'',
      filterText:'',
      userId:this.$store.getters.userId,
      bussId:22,
      conditionsModuleList:[],
      schemeName:'',
      addFilterState:false,
      checkCaseList:[],
      checkboxState:false,
      selectColumnList:[],
      transferVisible: false, // 配置筛选条件框
      transferData: [], // 筛选条件数据
      transferValue: [], // 当前筛选条件id
      multipleSelection:[],
      currentPageSize:0,
      dateTime: [],
      defaultcolumnDefs:[
        {
          headerName: '序号',
          field: 'sid',
          width: 80,
          enableRowGroup: true,
          // enablePivot: true,
          cellRenderer:this.cellRenderer,
          floatingFilter:true,
          filter: false,
          cellClass: 'vAlign',
          suppressMenu: true,
          submitView: false,
          checkboxSelection: false,
          headerCheckboxSelection: false,
          headerCheckboxSelectionFilteredOnly: true
        },
      ],
      columnDefs: [

      ],
      whStatus: '',
      whStatusBack: '',
      editLook: false,
      onlyLook: false,
      selectionState: false,
      auditWorkHoursView: false,
      brushRightHasFilter:false,
      exportView: false,
      idArray: [],
      changeAppMoney: 0,
      gridOptions:{
        statusBar: {
          statusPanels: [
            { statusPanel: 'agSelectedRowCountComponent', align: 'left' },
            { statusPanel: 'CountStatusBarComponent' },
          ]
        },
        //floatingFilter: true,
      },
      frameworkComponents:{
        CountStatusBarComponent:Summary
      },
      autoGroupColumnDef:{
        headerName: '组',
        field: 'group',
        headerCheckboxSelection: true,
        cellRenderer: 'agGroupCellRenderer',
        cellRendererParams: { checkbox: true },
      },
    }
  },
  selectionState(n){
    // if(n){
    //     this.gridApi.deselectAll()
    // }
    //  this.changeSelection(n)
  },
  activated(){
    this.$store.commit('caseInformation/SET_BUSSID',this.bussId)
  },
  mounted() {
    bus.$on('updateWorkList', ()=>{
      this.queryWorkHours()
    })
    this.rightDrag()
  },
  created() {
    this.$store.commit('caseInformation/SET_BUSSID',this.bussId)
    // this.queryFeeTaskDefine()
    // this.getDefaultTableHeader()
    // if(localStorage.getItem('month')){
    //   this.month = localStorage.getItem('month')
    // }
    // if(localStorage.getItem('whStatus')){
    //   this.whStatus = localStorage.getItem('whStatus')
    // }
    // if((!JSON.parse(localStorage.getItem('queryModuleData'))||!JSON.parse(localStorage.getItem('queryModuleData'))[0].queryModuleData.wfStatus)&&!localStorage.getItem('whStatus')){
    //   this.whStatus = '4'
    //   localStorage.setItem('whStatus', '4')
    // }
    this.getAllWfs()
    this.queryFilterConfig(1);
    this.getUser()
  },
  components: {
    BillDetail,
    CreateWorkHour,
    HandTime,Pagination,TimeDialog,SelectOption,
    WorkHourView,
    ViewsSwitching,
    seeCaseDetail
  },
  methods:{
    cancelMethod() {
      this.billDetailState = false
    },
    beforeBillClose(done) {
      this.$refs.billdetail.cancel(1)
      done();
    },
    openBillView(row) {
      this.billData = {
        billId: row.billId
      }
      this.type = 'view'
      this.billDetailState = true
    },
    handleWriteOffBillSelection(selection, row) {
      this.$refs.writeTable.clearSelection()
      this.$refs.writeTable.toggleRowSelection(row, true)
      this.hxBillData = row
    },
    handleWriteOffBillSelectionChange() {

    },
    closeWriteOffBill() {
      this.writeOffView = false
      this.writeOffHourIdList = []
      this.writeOffHourList = []
      this.hxBillData = {}
    },
    writeOffHourBill() {
      if (Object.keys(this.hxBillData).length === 0) {
        return this.$message.error('请选择账单')
      }
      hxWorkHoursToBill({
        billId: this.hxBillData.billId,
        hoursIdList: this.writeOffHourIdList
      }).then(res => {
        this.$message.success('核销成功！')
        this.closeWriteOffBill()
        this.queryWorkHours()
      })
    },
    writeOffBill() { // 核销进账单
      if (!this.getSelectedRows().length) {
        this.$message.error('请选择工时!')
        return
      }
      if (this.getSelectedRows().filter(item => !item.caseId).length) {
        this.$message.error('请选择案件工时!')
        return
      }
      if ([...new Set(this.getSelectedRows().filter(item => item.caseId).map(item => item.caseId))].length > 1) {
        this.$message.error('只能选择同一案件下的工时！!')
        return
      }
      if (this.getSelectedRows().filter(item => item.wfStatus !== '未核销').length) {
        this.$message.error('只能选择未核销的工时!')
        return
      }
      if(this.getSelectedRows().find(item => item.auditUserName != this.$store.getters.name)){
        this.$message.error(`您不是所选工时的审核任务人`)
        return
      }
      this.writeOffHourIdList = this.getSelectedRows().map(item => item.hoursId)
      queryCaseBillList({
        caseId: this.getSelectedRows()[0].caseId
      }).then(res => {
        this.writeOffHourList = res.data || []
        this.writeOffView = true
      })
    },
    submitAuditSuggest() {
      if (!this.auditWorkerHourValue) {
        this.$message.error(`请填写${this.auditWorkerHourType == 1 ? '审核备注' : '补充说明'}`)
      }
      modifyTaskHours({
        workHoursList: [
          {
            ...this.auditWorkerHourData,
            [this.auditWorkerHourType == 1 ? 'auditNote' : 'supExplanation']: this.auditWorkerHourValue
          }]
      }).then(res => {
        this.$message.success('操作成功！')
        this.closeAuditSuggest()
        this.queryWorkHours()
      })
    },
    closeAuditSuggest() {
      this.auditWorkerHourType = ''
      this.auditWorkerHourValue = ''
      this.auditWorkerHourView = false
    },
    auditWorkHourSuggest(type) {
      if (!this.getSelectedRows().length) {
        this.$message.error('请选择工时!')
        return
      }
      if(type == 1 && this.getSelectedRows()[0].auditUserName != this.$store.getters.name){
        this.$message.error(`您不是所选工时的审核任务人`)
        return
      }
      if(type == 2 && this.getSelectedRows()[0].userId !== this.$store.getters.userId) {
        this.$message.error(`您不是所选工时的记录人`)
        return
      }
      this.auditWorkerHourValue = type == 1 ? this.getSelectedRows()[0].auditNote : this.getSelectedRows()[0].supExplanation
      this.auditWorkerHourData = JSON.parse(JSON.stringify(this.getSelectedRows()[0]))
      this.auditWorkerHourType = type
      this.auditWorkerHourView = true
    },
    rightDrag() {
      let that = this
      if(document.querySelector(".left_wrap")){
       new this.$DraginResize(document.querySelector(".left_wrap"), {
        clone: true,
        end(info) {
          if (info.dir == 'ver') {
            this.elem.style.height = info.height + 'px';
          } else if (info.dir == 'hor') {
            this.elem.style.width = info.width + 'px';
            localStorage.setItem('leftWrapWidth', info.width + 'px')
            that.leftWrapWidth = info.width + 'px'
          }
        }
      })}
    },
    changePattern(e) {
      if (e === 1) {
        this.$store.commit('user/SET_PATTERN', false)
      } else {
        this.$store.commit('user/SET_PATTERN', true)
      }
    },
    searchName(value) {
      if (!value.target.value) return
      this.taskUserId = ''
      this.list = this.$store.getters.userList.filter(item => (item.deptName + '~' + item.fullname).includes(value.target.value))
      if (this.list.length === 1) {
        this.name = this.list[0].fullname
        this.taskUserId = this.list[0].userId || ''
      }
    },
    rowClassName({row, rowIndex}){
      if(row.userId == this.taskUserId){
        return 'currentClick'
      }
      return ''
    },
    rowClick(row) {
      this.name = row.fullname
      this.taskUserId = row.userId || ''
    },
    submitRebook() {
      if (!this.taskUserId) {
        this.$message.error('请选择员工！')
        return
      }
      updateWorkHourTasker({
        hoursIdList: this.getSelectedRows().map(item => item.hoursId),
        taskUserId: this.taskUserId
      }).then(res => {
        this.closeRebookDialog()
        this.queryWorkHours()
      })
    },
    closeRebookDialog() {
      this.rebookView = false
      this.taskUserId = ''
      this.list = []
      this.name = ''
    },
    rebook() {
      if(this.getSelectedRows().length < 1){
        this.$message.error('请选择需要改签的工时！')
        return
      }
      if (this.getSelectedRows().find(item => !item.taskUserName || item.taskUserName && !item.taskUserName.includes(this.$store.getters.name))) {
        this.$message.error('您不是审核任务人，不能改签')
        return
      }
      this.rebookView = true
    },
    getCurFilterId(title) {
      switch (title) {
        case "案件管理":
          return "caseId";
        case "递交官方":
          return "insId";
        case "官方通知":
          return "insId";
      }
    },
    getUser(){
      this.userList=[...[{userId:-1,fullname:'本组'},{userId:-2,fullname:'全部'}],...this.$store.getters.userList]
    },
    exportList(f) {

      this.exportType = f
      if(f == 1){
        this.selectionOptionState = true
      }else{
        if(this.getSelectedRows().length<1){
          this.$message.error('请选择导出的工时！')
          return
        }
        this.selectionOptionState = true
      }
      // let data;
      // if(f==1){
      //   data={bussId:this.bussId,  ...this.queryModuleData }
      //   deriveList(data).then(res=>{
      //     downLoadAll({url:`${res.data}`})
      //     this.closeEdit()
      //   })
      // } else if(f==2){
      //   this.selectionState = true
      //   this.exportView = true
      //   this.toExportList()
      // }

    },
    timelimitState1(e){
      this.whStatusList=[e[e.length-1]]
      // if(this.whStatusList&&this.queryModuleData.timelimitStateList[0]==='未核销'){
      //   this.queryModuleData.timelimitState=1
      // }
      // if(this.whStatusList[0]&&this.queryModuleData.timelimitStateList[0]==='已核销'){
      //   this.queryModuleData.timelimitState=2
      // }
      // if(this.queryModuleData.timelimitStateList[0]&&this.queryModuleData.timelimitStateList[0]==='全部'){
      //   this.queryModuleData.timelimitState=0
      // }
      if(!this.whStatusList[0]){
        this.queryModuleData.whStatus=null
      }else {
        this.queryModuleData.whStatus=this.whStatusList[0]
      }
      this.handleSearch(1)
    },
    toExportList() {
      if(this.getSelectedRows().length<1){
          this.$message.error('请选择导出的工时！')
          return
        }
      this.selectionOptionState = true
      let data
      this.idArray = this.getSelectedRows().map(item=>item.hoursId)
      data={bussId:this.bussId,idArray:this.idArray}
      deriveList(data).then(res=>{
        downLoadAll({url:`${res.data}`})
        this.closeEdit()
      })
    },
    changeAppCount(v,d) {
      this.changeAppMoney= this.ChangeStrToMinutes(v[0])*d.criterionRate/60
    },
    ChangeStrToMinutes(str){
      if(str){
        let arrminutes = str.split(":");
        if (arrminutes.length == 2) {
          let minutes = parseInt(arrminutes[0]) * 60 + parseInt(arrminutes[1]);
          return minutes;
        }
        else {
         return 0;
        }
      }
    },
    submitWork(data) {
      submitWorkHours({workHoursList: [{hoursId: data.hoursId,
        time: data.time,
        workContent: data.workContent,
        beginDate: data.beginDate,
        endDate: data.endDate}]}).then(()=>{
        this.$message.success('提交成功！')
        this.queryWorkHours()
        this.closeEdit()
      })

    },
    allSlect(f) {
      if(f==1){
        this.isSubmit = true
        this.isAudit = false
        if(this.whStatus == '1') {
        }else{
          this.whStatus = '1'
          this.handleSearch()
        }
      }else{
        this.isAudit = true
        this.isSubmit = false
        if(this.whStatus == '3'){
        }else{
          this.whStatus = '3'
          this.handleSearch()
        }
      }
      this.selectionState = true
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
        this.columnDefs.find(item => item.field == 'sid').width = 80
        this.columnDefs.push({})
        this.columnDefs.pop({})
      } else {
        this.columnDefs.find(item => item.field == 'sid').checkboxSelection = false
        this.columnDefs.find(item => item.field == 'sid').headerCheckboxSelection = false
        this.columnDefs.find(item => item.field == 'sid').width = 60
        this.columnDefs.push({})
        this.columnDefs.pop({})
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
    closeEdit() {
      this.sign = ''
      this.exportView = false
      this.selectionState = false
      this.editWorkTime = false
      this.auditWorkHoursView = false
      this.editLook = false
      this.onlyLook = false
      this.isSubmit = false
      this.isAudit =false
    },
    clearWfStatus(){
      this.drawerState=true
      this.whStatus = ''
    },
    brushRight(){
      let data =   this.$commonUtils.getFilterModel(this.$options.name+this.$route.name,'FilterModel')
      let arr =  Object.keys(data)
      arr.forEach(item=>{
        this.gridApi.destroyFilter(item)
      })
    },
    getFilterModel(){
      this.$nextTick(()=>{
        let data =   this.$commonUtils.getFilterModel(this.$options.name+this.$route.name,'FilterModel')
        let arr =  Object.keys(data)
        let arrInstance=arr.map(item=>this.gridApi.getFilterInstance(item))
        arrInstance.forEach((item,index)=>{
          item.selectNothing()
          item.setModel(data[arr[index]])
          item.applyModel()
        })
        this.gridApi.onFilterChanged()
        let sortData =   this.$commonUtils.getFilterModel(this.$options.name+this.$route.name,'SortModel')
        if(sortData&&sortData.length){
          this.gridApi.setSortModel(sortData)
          this.gridApi.onSortChanged()
        }
      })
    },
    getAllWfs() {
      const data = {
        userId: this.userId,
        bussId: this.bussId
      };
      Promise.all([selectColumn(data), queryPreference(data)]).then(res => {
        this.selectColumnList = res[0].data;
        this.preferenceList = res[1].data;
        this.tableHeader=this.preferenceList.map(item=>({label:item.title, prop:item.value,width: this.getLoactionWidth(item.title)}))
        this.columnDefs=[...this.defaultcolumnDefs,...this.preferenceList.map(item=>({
          headerName: item.title,
          field: item.value,
          width:this.getLoactionWidth(item.title)=='auto'?200:this.getLoactionWidth(item.title),
          resizable: true,
          sortable: true,
          filter: 'agSetColumnFilter',
          menuTabs: ['filterMenuTab','generalMenuTab','columnsMenuTab'],
          cellRenderer: this.cellRenderer,
          enableRowGroup: true,
          filterParams: {
            newRowsAction: 'keep',
             comparator: (a, b)=>{
              return this.$commonUtils.sort(a,b,item.value)
            }
          }
        }))]
        this.$nextTick(()=>{
          this.columnDefs.forEach(item=>{
            if(this.columnApi.getColumn(item.field)){
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
            }

          })
        })
        this.saveLocation()
        this.checkCaseList = this.preferenceList.map(item => item.value);
      });
    },
    clickAgentNum(params) {

      if (params.data['hoursId'] != this.currentId) {
        this.currentId = ''
        this.currentCaseId = ''
        this.$nextTick(() => {
          if (params.data['caseId']) {
            switch (params.data['domain']) {
              case '商标':
                this.taskType = 1
                break
              case '诉讼':
                this.taskType = 2
                break
              case '保护':
                this.taskType = 3
                break
              case '专利':
                this.taskType = 4
                break
              case '域名':
                this.taskType = 5
                break
              case '著作权':
                this.taskType = 6
                break
              case '非诉':
                this.taskType = 7
                break
              default:
                this.taskType = 1
            }
            this.currentId = params.data['hoursId']
            this.currentCaseId = params.data['caseId']
          }
        })
      }
    },
    analyRenderer(params) {
      if(params.colDef.field == 'zhangdanheding' || params.colDef.field == 'hedingjilu') {
        return `<span title="${params.value}">${(params.value == 0 || !params.value) ? '' : params.value + '%'}</span>`
      }
      return `<span title="${params.value}">${(params.value == 0 || !params.value) ? '' : params.value}</span>`
    },
    cellRenderer(params){

      if (params.data && params.colDef.field == 'agentNum') {
        var eDiv1 = document.createElement('div');
        eDiv1.innerHTML = `<span class="btn-simple1" style="cursor: pointer;color: #00b0ff" title="${params.value}">${params.value ? params.value : ''}</span>`
        var eButton1 = eDiv1.querySelectorAll('.btn-simple1')[0];

        eButton1.addEventListener('click', () => {
          if (params.data) {
            this.clickAgentNum(params)
          }
        });
        return eDiv1;
        // return `<a href="#/workbench/case/seeCaseDetail/${params.data.caseId}?taskType=${params.data.taskType}" target="_blank" title="${params.value}">${params.value?params.value:''} </a>`
      }
      if((params.colDef.field=='time'||params.colDef.field=='approvedTime')&&params.value&&+params.value.substring(0,2)>3){
        return `<span title="${params.value}" style="color: red">${(params.value == 0 || !params.value) ? '' : params.value}</span>`
      }
      if(params.colDef.field=='sid'){
        return params.rowIndex+1
      } else if(Object.prototype.toString.call(params.value).includes('Number')){
        return `<span title="${params.value}" style="float: right">${(formatAmount(params.value) == 0 || !params.value) ? '' : formatAmount(params.value)}</span>`
      }
      return `<span title="${params.value}">${(params.value == 0 || !params.value) ? '' : params.value}</span>`
    },
    getLoactionWidth(label){
      if(!localStorage.getItem('tableHeader')){
        return 'auto'
      } else {
        var arr= JSON.parse(localStorage.getItem('tableHeader'))
        if(arr.find(item=>item.name==this.$options.name+this.$route.name)){
          var header=arr.find(item=>item.name==this.$options.name+this.$route.name).tableHeader
          if(header.find(item=>item.label==label)){
            return header.find(item=>item.label==label).width
          } else {
            return 'auto'
          }
        } else {
          return 'auto'
        }
      }
    },
    rowDoubleClicked(params){
      // this.editLook=false
      // this.editWorkTime = true
      // this.rowDataForm = JSON.parse(JSON.stringify(params.data))
      // this.sign = '查看'
      // this.onlyLook = true
      this.hoursId = params.data.hoursId
      this.workHourView = true
      this.title = '查看工时'
      this.dialogType = 'view'
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
    onGridReady(params) {
      this.gridparams=params
      this.gridApi = params.api;
      this.columnApi = params.columnApi;
    },
    dragStopped(params){
      let tableHeader=params.columnApi.columnController.gridColumns.map(item=>({
        label:item.colDef.headerName,
        width:item.actualWidth,
        prop:item.colDef.field,
      })).filter(item=>item.prop!='sid'&&item.prop!="group")
      this.tableHeader=tableHeader
      this.changeHeader(tableHeader)
      this.saveLocation()
    },
    saveLocation() {
      if (!localStorage.getItem('tableHeader')) {
        let arr = []
        arr.push({name:this.$options.name + this.$route.name, tableHeader: this.tableHeader})
        localStorage.setItem('tableHeader', JSON.stringify(arr))
      } else {
        let arr = JSON.parse(localStorage.getItem('tableHeader'))
        if (arr.find(item => item.name == this.$options.name+this.$route.name)) {
          arr.find(item => item.name==  this.$options.name+this.$route.name).tableHeader = this.tableHeader
          localStorage.setItem('tableHeader', JSON.stringify(arr))
        } else {
          arr.push({name: this.$options.name+this.$route.name, tableHeader: this.tableHeader})
          localStorage.setItem('tableHeader', JSON.stringify(arr))
        }
      }
    },
    refreshEvenRowsCurrencyData(params) {
       this.getSummary(this.gridApi.rowModel.rootNode.childrenAfterFilter.map(item=>item.data))
      this.currentPageSize = params.api.rowModel.rootNode.allChildrenCount
      if(!params.columnApi.columnController.groupAutoColumns) {
        this.gridApi.forEachNode(rowNode => {
          rowNode.setDataValue(
            'sid',
            rowNode.rowIndex + 1)
        });
      }
      if(this.feeList.length){
        // this.$commonUtils.saveFilterModel(this.$options.name+this.$route.name,'FilterModel',this.gridApi.getFilterModel())
        if(params.type=="filterChanged"){
          if (this.gridApi.getSelectedNodes().length) {
            this.gridApi.getSelectedNodes().forEach(rowNode => {
              if (!this.gridApi.rowModel.rootNode.childrenAfterFilter.find(item => item.id === rowNode.id)) {
                rowNode.setSelected(false)
              }
            })
          }
          this.$commonUtils.saveFilterModel(this.$options.name+this.$route.name,'FilterModel',this.gridApi.getFilterModel())
          var data = this.$commonUtils.getFilterModel(this.$options.name + this.$route.name, 'FilterModel');
          var arr = Object.keys(data);
          if(arr.length){
            this.brushRightHasFilter=true
          }else {
            this.brushRightHasFilter=false
          }
        }
        if(params.type=="sortChanged"){
          this.$commonUtils.saveFilterModel(this.$options.name+this.$route.name,'SortModel',this.gridApi.getSortModel())
        }
      }
    },
    // async checkP(row){
    //     let hoursId = row.hoursId
    //     let res =await checkPermission({hoursId})
    //     this.modify = res.data.modify
    //     return this.modify
    //
    // },
    getContextMenuItems(params){
      return this.getRowContextmenuList(params.node.data).map(item=>({
        name: item.name,
        action: () =>{
          this[item.action](params.node.data,params.value)
        }
      }))
      if(!params.node.data){
        return []
      }
    },
    getRowContextmenuList(row,){
      return [
          { name:'复制',action: 'copy' },
          { name:'复制工时',action: 'copyHour' },
          // { name: '提交', action: 'submitWorkHours', wfStatus: ['待提交', '审核退回']},
          { name: '审核', action: 'auditWorkHours', auditFlag: '1'},
          { name: '修改', action: 'modifyTaskHours', permission: '1'},
          { name: '删除', action: 'deleteTaskHours', permission: '1'},
          // { name: '修改', action: 'modifyTaskHours', permission: '1'},
          ].filter(item=> {
          if (item.auditFlag) {
            return item.auditFlag == row.auditFlag
          }else if(item.permission){
            return true
          }else{
            return true
          }
        })

    },
    deleteTaskHours(data){
      let hoursId = data.hoursId
      checkPermission({hoursId}).then(res=> {
        if (res.data.delete == 0) {
          this.$message.error('该工时您无法删除')
        }else{
          this.$confirm('此操作将永久删除该工时, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(()=>{
            deleteTaskHours({hoursIdList:[hoursId]}).then(res=>{
              this.$message.success('删除工时成功')
              this.queryWorkHours()
            })
          }).catch(()=>{
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })

        }
      })
    },
    auditWorkHours(data) {
      // this.sign = '审核'
      // this.auditWorkHoursView = true
      // this.editWorkTime = true
      // this.rowDataForm = JSON.parse(JSON.stringify(data))
      this.hoursId = data.hoursId
      this.workHourView = true
      this.title = '审核工时'
      this.dialogType = 'audit'
    },
  auditWorkTime(data, f) {
      const workHoursList = [{hoursId: data.hoursId,
        approvedTime: data.approvedTime}]
      auditWorkHours({workHoursList: workHoursList, result: f}).then(()=>{
        this.$message.success('审核成功！')
        this.queryWorkHours();
        this.closeEdit()
      })
    },
    auditWorkHoursMore(a){
      if(this.getSelectedRows().length<1){
        this.$message.error('请选择工时！')
        return
      }
      if(this.getSelectedRows().find(i=>i.auditFlag == 0)){
        let indexList = []
        this.getSelectedRows().forEach((item, index)=>{
          if(item.auditFlag == '0'){
            indexList.push(index + 1)
          }
        })
        this.$message.error(`您不是第${indexList}条所选工时的审核任务人`)
        return
      }
      const workHoursList = this.getSelectedRows().map(item=>({
        hoursId: item.hoursId,
        approvedTime: item.time,
        time: item.time,
        approvedDesc: item.workContent,
        billRate: item.criterionRate,
        approvedAmountCust: item.amount,
        caseId: item.caseId || undefined
      }))
      if(a==1){
        auditWorkHours({workHoursList: workHoursList, result: 1}).then(()=>{
          this.$message.success('审核成功！')
          this.queryWorkHours()
          this.closeEdit()
        })
      }else{
        auditWorkHours({workHoursList: workHoursList, result: 2}).then(()=>{
          this.$message.success('审核成功！')
          this.queryWorkHours()
          this.closeEdit()
        })
      }
    },
    submitWorkHours(data) {
      this.sign = '提交'
      this.editWorkTime = true
      this.isSubmit = true
      this.rowDataForm = JSON.parse(JSON.stringify(data))
    },
    submitWorkHoursMore() {
      if(this.getSelectedRows().length<1){
        this.$message.error('请选择工时！')
        return
      }
      const workHoursList = this.getSelectedRows().map(item=>({
        hoursId: item.hoursId,
        time: item.time,
        workContent: item.workContent,
        beginDate: item.beginDate,
        endDate: item.endDate
      }))
      submitWorkHours({workHoursList: workHoursList}).then(()=>{
        this.$message.success('提交工时成功！')
        this.selectionState = false
        this.closeEdit()
        this.queryWorkHours()
      })
    },
    modifyTaskHours(data) {
      let hoursId = data.hoursId
      checkPermission({hoursId}).then(res=> {
        if (res.data.modify == 0) {
          this.$message.error('该工时您无法修改')
        }else{
          // this.sign = '修改'
          // this.flag = data.wfStatus
          // this.rowDataForm = JSON.parse(JSON.stringify(data))
          // this.editWorkTime = true
          // this.editLook = true
          this.hoursId = data.hoursId
          this.workHourView = true
          this.title = '修改工时'
          this.dialogType = 'edit'
        }
      })
      // this.onlyLook = false

    },
    modifyWorkTime(data) {
      console.log(data)
      return
        modifyTaskHours({
          workHoursList: [
            {
              hoursId: data.hoursId,
              time: data.time,
              workContent: data.workContent,
              beginDate: data.beginDate,
              endDate: data.beginDate,
              approvedDesc: data.approvedDesc,
              approvedTime: data.approvedTime
            }]
        }).then(()=>{
          this.$message.success('修改成功！')
          this.queryWorkHours();
          this.closeEdit()
        })

      // modifyTaskHours().then(()=>{
      //
      // })
    },
    temporarStorage(row, column, event) {
        this.$store.commit('tabs/CHANGE_STORAGETABLE',{type:'push',title:'暂存费用',name:'暂存费用',identification:this.identification,data:row})
    },
    editableTab(data){
        if(data&&data!=0){
          this.myTabsActivity=true
        }else {
          this.myTabsActivity=false
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
      if (e.length + this.transferValue.length > 15) {
        this.$message({
          type: "warning",
          message: `您最多选择15项`
        });
        e.pop();
      }
    },
    filterCheck(val) {
      this.filterText = val;
    },
    handleChange(boolean) {
      if (!boolean) {
        this.checkboxState = false
      }
    },
    checkBox(e,property,values){
      if(this.queryModuleData[property].includes('')&&this.queryModuleData[property].filter(item=>item).length!=values.filter(item=>item).length){
        this.queryModuleData[property]=this.queryModuleData[property].filter(item=>item)
      }
      if(e[e.length-1]==''){
        this.queryModuleData[property]=values.map(item=>item.id)
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
          this.filterText=''
          if (!num) {
            this.queryWorkHours();
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
            this.queryWorkHours();
          }
          this.getAllWfs();
        }
      });
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
    defaultQuerySearch(){
      this.queryModuleData = JSON.parse(localStorage.getItem('queryModuleData'))?JSON.parse(localStorage.getItem('queryModuleData')).find(item=>item.name==this.$route.name)?JSON.parse(localStorage.getItem('queryModuleData')).find(item=>item.name==this.$route.name).queryModuleData:this.queryModuleData:this.queryModuleData
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
            if(!['userIdList','workHourDateArray','whStatus', 'hrType'].includes(key)){
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
          }
          // this.defaultQuerySearch()
          if(type==1){
             // if(!this.whStatus && !this.queryModuleData.wfStatus){
             //  // this.queryModuleData.whStatus == '4'
             //    this.$set(this.queryModuleData, 'whStatus', '4')
             //   // this.queryModuleData.whStatus = '4'
             //   localStorage.setItem('queryModuleData',JSON.stringify([{'name': "workTime",'queryModuleData': this.queryModuleData}]))
             //  }
            !this.newHoursIdFlag && this.handleSearch(1)
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
                  } else if(item.filterName=='客户'){
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
    copy(row,value){
      if(value){
        this.$copyText(value).then(
          res => {
          })
      }else {
        this.$copyText(event.target.innerText).then(
          res => {
          })
      }
    },
    copyHour(row, value,event) {

      // this.sign = '复制工时'
      // this.rowDataForm = JSON.parse(JSON.stringify(row))

      // this.editWorkTime = true
      this.$confirm('此操作会创建一条相同的工时, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(()=>{
            row.hourDate = this.nowDate()
            row.beginDate = ''
            row.endDate = ''
            row.approvedTime = ''
            row.billRate = ''
            row.approvedAmountCust = ''
            row.approvedDesc = ''
            addTaskHours(row).then(()=>{
              this.$message.success('复制工时成功！')
              this.queryWorkHours()
            })
        })
    },
    nowDate(){
      let nowDate = new Date();
      let year = nowDate.getFullYear();
      let month = nowDate.getMonth() + 1 < 10 ? "0" + (nowDate.getMonth() + 1) : nowDate.getMonth() + 1;
      let day = nowDate.getDate() < 10 ? "0" + nowDate.getDate() : nowDate.getDate();
      let dateStr = year + "-" + month + "-" + day;
      return dateStr
    },
    handleCheckboxState() {
      this.checkboxState = !this.checkboxState;
    },
    closeSelect(){
      this.selectionOptionState=false
    },
    clearSearch(){
      this.month = ''
      this.dateTime = []
      localStorage.removeItem('monthArr')
      localStorage.removeItem('month')
      for (var key in this.queryModuleData) {
        if(key.includes('Array')||key.includes('List')){
          this.$set(this.queryModuleData,key,[])
        }else if(key==='feetIds'){
          this.$set(this.queryModuleData,key,[])
        }
        else{
          this.$set(this.queryModuleData,key,null)
        }
      }
      if(this.$refs.multiCascader){
        this.$refs.multiCascader.forEach(item=>{
          item.$el.querySelector('.el-input__inner').value=''
        })
      }
    },
    add0(v){
      if (v <10) {
        return   '0' + v
      }else {
        return '' + v
      }
    },
    // changeMonth(v){
    //   // let day
    //   // if([1,3,5,7,8,10,12].includes(v)){
    //   //   day = 31
    //   // }else{
    //   //   day = 30
    //   // }
    //   if(v == null){
    //     this.dateTime = []
    //     localStorage.removeItem('monthArr')
    //     localStorage.removeItem('month')
    //   }else{
    //     this.dateTime = [(new Date).getFullYear()+'-'+this.add0(v)+'-01',(new Date).getFullYear()+'-'+this.add0((+v)+1)+'-01']
    //     // this.queryModuleData.workHourDateArray= [(new Date).getFullYear()+'-'+this.add0(v)+'-01',(new Date).getFullYear()+'-'+this.add0((+v)+1)+'-01']
    //     if(this.queryModuleData.workHourDateArray){
    //       delete this.queryModuleData.workHourDateArray
    //     }
    //     localStorage.setItem('monthArr',JSON.stringify(this.dateTime))
    //     localStorage.setItem('month',v)
    //   }
    //
    //   this.handleSearch()
    //
    // },
    handleSearch(a){
      // if(a>0){
      //   this.whStatus = a
      //   localStorage.setItem('whStatus', a)
      // }else {
      //   if(this.queryModuleData.wfStatus){
      //     this.whStatus = ''
      //     localStorage.removeItem('whStatus')
      //   }else{
      //     if(localStorage.getItem('whStatus')){
      //       this.whStatus = localStorage.getItem('whStatus')
      //     }else{
      //       this.whStatus = '4'
      //       localStorage.setItem('whStatus', this.whStatus)
      //     }
      //   }
      //   if(this.queryModuleData.workHourDateArray){
      //     this.dateTime = []
      //     this.month = ''
      //     localStorage.removeItem('monthArr')
      //     localStorage.removeItem('month')
      //   }
      // }
      this.operationState=a
      this.drawerState=false
      this.selectionState = false
      this.multipleSelection = []
      this.listQuery.pageNo = 1
      this.queryWorkHours(a)
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
    },
    remoteMethod(value, index, property, filterName) {
      if (value && filterName === "客户") {
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
      if (value && ["申请人", "被申请人", "转让人"].includes(filterName)) {
        queryAllUrl({
          applicantName: value,
          pageNo: 1,
          pageSize: 100,
          orderBy:1
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
    changeTextRange(value, index,property) {
      this.$set(this.queryModuleData, property.split(',')[1], value);
    },
    analyzeData() {
      this.isStatisticsFlag++

      // if(this.isStatisticsFlag == 1) {
        // this.isStatistics = 1
        this.isStatisticsLoading = true
        this.queryWorkHours('analyzeData')
      // }
      // if(this.isStatisticsFlag > 1) {
      //   this.cancel('请求已取消')
      // }
    },
    hideData() {
      // this.isStatistics = null
      this.isStatisticsFlag = 0
      console.log(9999)
      // this.cancel('请求已取消')
    },
    queryWorkHours(a){
      console.log()
      let data = {
        pageNo: this.listQuery.pageNo,
        pageSize: this.listQuery.pageSize,
        isStatistics: this.isStatistics
      }
      // if(JSON.parse(localStorage.getItem('monthArr'))){
      //   delete this.queryModuleData.workHourDateArray
      //   data.workHourDateArray = JSON.parse(localStorage.getItem('monthArr'))
      // }
      // if(JSON.parse(localStorage.getItem('whStatus'))){
      //   delete this.queryModuleData.wfStatus
      //   data.whStatus = JSON.parse(localStorage.getItem('whStatus'))
      // }

      let querData=JSON.parse(JSON.stringify(Object.assign(data, this.queryModuleData)))
      // console.log(JSON.parse(JSON.stringify(querData)));
      if(this.operationState){
        for (var key in querData) {
          if(!['business', 'pageNo', 'pageSize'].includes(key)){
            if(!['workHourDateArray','whStatus','userIdList', 'hrType'].includes(key)){
              delete querData[key]
            }
          }
        }
      } else {
        for (var key in querData) {
          if(!['business', 'pageNo', 'pageSize'].includes(key)){
            if(['workHourDateArray','whStatus', 'hrType', 'userIdList'].includes(key)||![...this.conditionsModuleList.map(item=>item.property),...['agentNumStart', 'agentNumEnd','amountStart' ,'amountEnd','goodClasses', 'regNumber',  'tmName']].includes(key)){
              if(key=='whStatus'){
                this.queryModuleData.whStatus=null//'7'
              }
              if(key=='workHourDateArray'){
                this.queryModuleData.workHourDateArray=[]//'7'
              }
              if(key=='userIdList'){
                this.queryModuleData.userIdList=[]//'7'
              }

              delete querData[key]
            }
          }
        }
      }
      if(querData.userIdList&&(querData.userIdList.includes(-1)||querData.userIdList.includes(-2))){
        if(querData.userIdList.includes(-1)){
          querData.fanwei = 1
        }
        if(querData.userIdList.includes(-2)){
          querData.fanwei = 2
        }
        querData.userIdList=querData.userIdList.filter(item=>![-1,-2].includes(item))
      }

      // if((querData.userIdList&&querData.userIdList.length)||(querData.workHourDateArray&&querData.workHourDateArray.filter(item=>!!item).length)){
      //
      //   // queryTotalHour(querData).then(res=>{
      //   //   this.totalHourData.totalHour=res.data[0].totalHour
      //   //   this.totalHourData.totalHourState=true
      //   // })
      // }else {
      //   this.totalHourData.totalHourState=false
      // }
      this.exportQueryModel=JSON.stringify(querData)
      querData.isStatistics = a==='analyzeData'? 1: null
      queryWorkHours(querData,this).then(res=>{
        if(a==='analyzeData') {
          this.analyzeList = res.data.workhoursList
          this.analyzeList.forEach(item => {
            item.zhangdanheding = item.zhangdanheding && +item.zhangdanheding.replace('%','') || 0
            item.hedingjilu = item.hedingjilu && +item.hedingjilu.replace('%','') || 0
            item.jiluSum = item.jiluSum && +item.jiluSum.replace(/,/g, '') || ''
            item.hedingSum = item.hedingSum && +item.hedingSum.replace(/,/g, '') || ''
            item.zhangdanSum = item.zhangdanSum && +item.zhangdanSum.replace(/,/g, '') || ''
          })
        }else {
          this.feeList = res.data.workhoursList
        }
        this.currentPageSize = res.data.workhoursList.length
        console.log('案号 下标 --- 记录 核定 核定（后）')
        this.feeList.forEach((item,index)=>{
          if(this.getMins(item.time)!=item.totalMinute){
              console.log(item.agentNum,index,'---',this.getMins(item.time),item.approvedTime,item.totalMinute)
          }
        })
        this.totalHourData.totalHour=res.data.totalHour
        this.totalHourData.workHoursProgress=res.data.workHoursProgress
        // this.totalHourData.workHoursProgress={
        //   '6': '3:00',
        //   '30': '20:00',
        //   '120': '100:00'
        // }
        // this.feeList.forEach(item=>{
        //   if(!item.approvedTime){
        //     item.approvedAmountCust = 0
        //   }
        // })
        this.total=res.total

        // 新建工时高亮
        this.$nextTick(() => {
          if (this.newHoursId) {
            this.gridApi.rowModel.rootNode.allLeafChildren[this.feeList.findIndex(item => item.hoursId === this.newHoursId) || 0] && this.gridApi.rowModel.rootNode.allLeafChildren[this.feeList.findIndex(item => item.hoursId === this.newHoursId) || 0].setSelected(true)
            this.$store.commit('caseInformation/SET_HOURS_ID', '')
          }
        })
        // if(this.feeList.length){
          this.getFilterModel()
        // }
        this.$nextTick(()=>{
           this.getSummary(this.gridApi.rowModel.rootNode.childrenAfterFilter.map(item=>item.data))
        })
        this.isStatisticsLoading = false
      })
    },
    clickoutside(){
      this.drawerState=false
      if(localStorage.getItem('whStatus')){
        this.whStatus = localStorage.getItem('whStatus')
      }

      // this.queryModuleData.whStatus = JSON.parse(localStorage.getItem('queryModuleData'))[0].queryModuleData.whStatus
    },
    getSummary(list){
      let data={
        time: this.getSum(list,'time','工时'),
        approvedTime: this.getSum(list,'approvedTime','工时'),
        amount:this.getSum(list,'amount'),
        approvedAmountCust: this.getSum(list,'approvedAmountCust'),
      }
      this.$store.commit('caseInformation/SET_SUMMARYDATA',{name:'workTime',count:data})
    },
    getSum(list,type,tp){
      if(tp=='工时'){
        return parseInt(list.map(item=>item[type]).filter(item=>!!item).reduce((x,y)=>x+this.getMins(y),0)/60)+':' +this.add0(list.map(item=>item[type]).filter(item=>!!item).reduce((x,y)=>x+this.getMins(y),0)%60)
      }else {
        return list.map(item=>item[type]).filter(item=>!!item).reduce((x,y)=>x+y,0)
      }

    },
    getMins(str){
      if(str&&str.includes(':')){
       return  str.split(':')[0]*60+Number(str.split(':')[1])
      }else {
        return 0
      }
    },
    // 计算工时进度百分比
    calculateProgress(currentTime, targetTime) {
      if (!currentTime || !targetTime) return 0;

      // 将时间格式转换为分钟
      const parseTimeToMinutes = (timeStr) => {
        if (!timeStr || typeof timeStr !== 'string') return 0;
        const parts = timeStr.split(':');
        if (parts.length !== 2) return 0;
        const hours = parseInt(parts[0]) || 0;
        const minutes = parseInt(parts[1]) || 0;
        return hours * 60 + minutes;
      };

      const currentMinutes = parseTimeToMinutes(currentTime);
      const targetMinutes = parseTimeToMinutes(targetTime);

      if (targetMinutes === 0) return 0;

      const percentage = (currentMinutes / targetMinutes) * 100;
      return Math.min(percentage, 100); // 限制最大值为100%
    },
  },
  watch:{
    $route: {
      handler: function (val, oldVal) {
        this.$nextTick(() => {
          this.rightDrag()
        })
      },
      immediate: true
    },
    newHoursId: {
      handler(n) {
        if (n) {
          this.newHoursIdFlag = true

          // 设置工时日期为今天，员工为当前用户
          const now = new Date()
          const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
          const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
          const formatDate = (date) => {
            const year = date.getFullYear()
            const month = (date.getMonth() + 1).toString().padStart(2, '0')
            const day = date.getDate().toString().padStart(2, '0')
            return `${year}-${month}-${day}`
          }
          this.queryModuleData.workHourDateArray = [formatDate(firstDay), formatDate(lastDay)]
          this.queryModuleData.userIdList = [this.$store.getters.userId]
          this.handleSearch(1)
          return;
          queryWorkHours({
            hoursId: this.newHoursId
          },this).then(res => {
            this.feeList = res.data.workhoursList
            this.$store.commit('caseInformation/SET_HOURS_ID', '')
          })
        }
      },
      immediate: true
    },
    selectionState(n){
      // this.changeSelection(n)
    },
    checkboxState(n){
      if(n){
        this.$nextTick(()=>{
          this.$refs.checkCaseSelect.focus()
        })
      }
    },
  },
  computed:{
    cssVar(){
      return {
        '--height': document.documentElement.clientHeight-290 + 'px'
      }
    },
    ...mapState({
      'pattern': state => state.user.pattern
    }),
    clientHeight(){
      return document.documentElement.clientHeight-290
    },
    newHoursId() {
      return this.$store.state.caseInformation.hoursId
    }
  }
}
</script>

<style lang="scss" scoped>
.edit-form {
  display: flex;
  .el-row {
    width: 100%;
    &:last-child {
      border-bottom: 1px solid #EBEEF5;
    }
    .el-col {
      line-height: 40px;
      height: 40px;
      border: 1px solid #EBEEF5;
      border-bottom: none;
      .el-form-item {
        >>>.el-form-item__content {
          overflow: hidden;
          height: 40px;
        }
        >>>.el-form-item__label {
          background-color: #F9F9F9;
          line-height: 40px;
          height: 40px;
          margin-right: 10px;
        }
      }
    }
  }
}
.work-time {
  padding: 30px 30px;
  .add-time {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 150px;
    width: 100%;
    margin-top: 10px;
    background-color: #f8f8f9;
    margin-bottom: 10px;
    .time-num {
      font-size: 50px;
      font-weight: lighter;
      margin-bottom: 10px;
    }
    span {
      color: #ACADB0;
    }
  }
  .search {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 5px;
    .search-left {
    display: flex;
    justify-content: flex-start;
    .line {
      height: 16px;
      margin-top: 10px;
      margin-right: 20px;
      background-color: #ccc;
      width: 1px;
    }
    .el-dropdown {
      padding-right: 20px;
      padding-top: 10px;
      padding-bottom: 10px;
      cursor: pointer;
      .el-dropdown-link {
        .el-icon-caret-bottom {
          transition: all .4s;
          /*&:hover {*/
          /*  transform: rotate(180deg);*/
          /*}*/
        }
      }
    }
  }
    .search-right {
      display: flex;
      align-items: center;
      .search {
        >>> .el-input__inner {
          border-radius: 15px;
        }
      }
      .line {
        height: 20px;
        margin: 0 20px;
        background-color: #ccc;
        width: 1px;
      }
      .export {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        width: 200px;
        span {
          font-size: 14px;
          color: #606266;
          cursor: pointer;
        }
      }
    }
  }
  .hyphen {
    height: 1px;
    width: 100%;
    background-color: #f2f2f2;
  }
}

/*  *********/
.el-transfer {
  display: flex;
  justify-content: space-around;
  align-items: center;
  >>>.el-transfer-panel {
    flex: 1;
  }
}

.el-table{
  /deep/ th{
    padding:5px 0;
    color: rgba(51, 51, 51, 1);
    background: rgba(187, 187, 187, 0.5);
  }
  /deep/ td {
    padding: 0 ;
  }
}
.writeTable{
  /deep/ thead .el-checkbox{
    display: none;
  }
}
/deep/ .pass-row{
  background: #c9c9c9!important;
}
.clearButton{
  position: absolute;
  right: 18px;
  top:20px;
  background: #fff;
  color: RGBA(254, 153, 23, 1);
  border: 0;
  /deep/ span{
    display: flex;
    justify-content: center;
    align-items: center;
  }
  img{
    width: 20px;
    margin-right: 8px;
    vertical-align: middle;
  }
}
.buttonWrap{
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 2;
  .el-button{
    margin-right: 10px;
  }
}
.buttonWrap2{
  width: 100%;
  text-align: right;
  margin-bottom: 10px;
  margin-top: 10px;
}
.limitDayNum{
  height:30px;
  display: flex;
  position:relative;
  align-items: center;
  margin-bottom:10px;
  img {
    width: 30px;
    height: 30px
  }
  span{
    font-family: 'Nunito Sans';
    font-weight: 400;
    font-style: normal;
    font-size: 14px;
    margin-left: 2px;
    margin-right: 10px;
    color: rgb(121, 121, 121);
  }
  .el-select{
    width: 174px;
    height: 32px;
    line-height: 32px;
    margin-right: 20px;
    /deep/ .el-input__icon{
      line-height:25px
    }
    /deep/ input{
      height: 32px;
      line-height: 32px;
    }
  }
}
section{
  position: relative;
  clear: both;
  flex: 1;
}
.checkbox{
  position:absolute;
  left: 0px;
  top: 33px;
  width: 222px;
  height: 324px;
  border: 1px solid #99a9bf;
  background: #fff;
  /*z-index: 100;*/
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
.checkboxChangeRadio{
  /deep/.el-checkbox__inner{
    border-radius: 50%;
  }
  /deep/ .el-checkbox__inner:after{
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background-color: #FFF;
    position: absolute;
    left: 50%;
    top: 50%;
    z-index: 0;
    -webkit-transition: -webkit-transform .01s ease-in;
    transition: -webkit-transform .01s ease-in;
    transition: transform .01s ease-in;
    transition: transform .01s ease-in, -webkit-transform .01s ease-in;
    transition: transform .01s ease-in,-webkit-transform .01s ease-in;
    transform: translate(-50%,-50%) scale(1);
  }
}
/deep/ .selectRow{
  background:  #C9C8D0
}
.timeLimitTable /deep/ .cell{
  white-space: nowrap;
  text-overflow: clip;
}
.w-table {
  position: relative;
  /deep/ .caret-wrapper{
    position: relative;
  }
  /deep/ .el-table__column-filter-trigger{
    position: relative;
  }
  /deep/ .el-table th {
    padding: 0;
    .virtual{
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
    .el-table th .thead-cell{
      cursor: move !important;
    }
    .el-table__fixed {
      cursor: not-allowed;
    }
  }
}
/deep/ .moveIng{
  .virtual {
    border: 2px dotted #666 !important;
  }

}
/deep/.pagination-container{
  padding: 0;
}
.DataPicker /deep/ {
  .el-input__prefix{
    display: none;
  }
  .el-input{
    width: 100%;
  }
  .el-input__inner{

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
      /*height: 28px;*/
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
/*.button-group-search{*/
/*  position: relative;*/
/*  display: flex;*/
/*  .searchWrap{*/
/*    border-radius: 5px;*/
/*    top: 34px;*/
/*    left: 10px;*/
/*    width: 550px;*/
/*    max-height: 500px;*/
/*    min-height: 200px;*/
/*    position: absolute;*/
/*    background: #ffffff;*/
/*    border: 1px solid #d4d5d5;*/
/*    z-index: 1;*/
/*    overflow: auto;*/
/*    padding: 20px 0;*/
/*    box-shadow: 0 3px 6px rgba(111,111,111,0.2);*/
/*    /deep/  .el-form{*/
/*      padding-bottom: 10px;*/
/*      .multi-cascader /deep/{*/
/*        .el-cascader__label{*/
/*          max-height: 40px;*/
/*          overflow-y: auto*/
/*        }*/
/*      }*/
/*      .el-form-item__label{*/
/*        text-align: left;*/
/*        padding-left: 32px;*/
/*        font-weight: normal;*/
/*        float:left;*/
/*      }*/
/*      .el-form-item__content{*/
/*        input{*/
/*          border-top: 0;*/
/*          border-left: 0;*/
/*          border-radius: 0;*/
/*          border-right: 0*/
/*        }*/
/*      }*/
/*    }*/
/*    .clearWrap{*/
/*      display: flex;*/
/*      justify-content: flex-end;*/
/*      width: 100%;*/
/*      background: #fff;*/
/*      right: 10px;*/
/*      padding-bottom: 10px;*/
/*      position: absolute;*/
/*      z-index: 1;*/
/*    }*/
/*  }*/
/*}*/
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
    /deep/  .el-form{
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
      right: 10px;
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
.dots {
  cursor: pointer;
  position: absolute;
  left: 0;
  top: 6px;
  z-index: 1;
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
.brush_right{
  position: absolute;
  right: 10px;
  top: 0px;
  z-index: 1;

}
.MyTabs{
width: 100%;
position: absolute;

/deep/ .el-tabs{
  .el-tabs__header{
    margin: 0;
    .el-tabs__nav {
      width: 150px;
    }
    .el-tabs__item {
      width: 100%;
    }
  }
  .el-tabs__content{
    background: #fff;
  }
}
}
.MyTabs.activity{
background: #fff;
z-index: 8;
/deep/ .el-tabs{
  .el-tabs__header{
    margin: 0;
    background: #fff;
  }
  .el-tabs__content{
    background: #fff;
  }
}
}


>>> .el-dialog {
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
/*  dialog样式*/
>>> .el-dialog {
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
>>> .el-dialog__body {
      overflow: auto;
}
.pdfDialog  /deep/{
z-index: 3000;
.el-dialog{
  z-index: 3000;
  height: 100vh;
  display: flex;
  /*flex-direction: column;*/
  .el-dialog__body {
    flex: 1;
    .el-textarea{
      height: 100%;
      textarea{
        height: 100%;
      }
    }
  }
  }
}
.years {
  >>>.el-input__inner {
    height: 30px;
    width: 150px;
  }
}
.el-row {
  .el-col{
    height: 150px;
  }
  .tall-height{
    /*height: 200px!important;*/
    border: none;
    height: 100px!important;
    >>>.el-form-item__content{
      height: 100px!important;
    }
    >>>.el-form-item__label{
      height: 100px!important;
    }
  }
}
.dialog-footer{
  display: flex;
  justify-content: center;
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
  margin-right: 20px;
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
.query-btns{
  position: relative;z-index: 1;
}
.work-table{
  position: relative;
}
.abow_dialog {
  > > > .el-dialog {
    position: absolute;
    top: 50%;
    left: 50%;
    margin: 0 !important;
    transform: translate(-50%, -50%);
    min-height: calc(60%);
    max-height: calc(100% - 30px);
    max-width: calc(100% - 30px);
    display: flex;
    flex-direction: column;
  }

  > > > .el-dialog__body {
    overflow: auto;
    padding: 0 10px 10px 10px;
  }
}
.rebookDiv {
  width: 100%;
  border: 1px solid #D7D7D7;
  padding: 10px;

  .rebookTitle {
    color: #D9001B;
    padding-bottom: 10px;
    border-bottom: 2px solid #797979;
  }

  .rebookBody {
    display: flex;

    .bodyLeft {
      min-height: 300px;
      max-height: 500px;
      overflow: auto;
      flex: 4;
      /*background-color: red;*/
      margin-right: 10px;

      .nameList {
        width: 100%;
        height: 35px;
        border: 1px solid #F2F2F2;
        border-bottom: none;
        display: flex;
        justify-content: center;
        align-items: center;

        &:last-child {
          border-bottom: 1px solid #F2F2F2;
        }
      }
    }

    .bodyRight {
      min-height: 300px;
      max-height: 500px;
      overflow: auto;
      flex: 6;

      .rightTitle {
        text-align: center;
        background-color: #D7D7D7;
        margin-top: 10px;
        height: 30px;
        line-height: 30px;
      }

      .rightSearch {
        .el-input {
          input {
            border-radius: 0 !important;
          }

          > > > .el-input__inner {
            height: 35px;
          }
        }
      }

      .rightTable {
        thead {
          tr {
            th {
              background-color: #D7D7D7;
              color: #606266;
            }
          }
        }
      }
    }
  }
}
>>>.currentClick{
  background-color: #2981EB!important;
  color: #ffffff;
  font-weight: bold;
}

>>>.el-table--enable-row-hover .el-table__body tr:hover>td{
  background-color: transparent!important;
}
.ViewsSwitching {
  position: absolute;
  right: 0;
  z-index: 100;
  top: 5px;
}
.content_wrap {
  width: 100%;
  display: flex;

  .left_wrap {
    position: relative;
    transition: all 0.5s;
    //   width: 40%;
  }

  .right_wrap{
    box-shadow: 0px 0px 18px 0px rgba(64, 158, 255,0.5);
    height: 598px;
    /*overflow: auto;*/
    overflow: hidden;
    transition:all 0.5s;
    flex: 1;
    /deep/ *{
      font-size: 12px !important;
    }
   // width: 60%;
    /deep/.sectionWrap{
      padding: 0 !important;
      padding-left: 10px !important;
     // padding-bottom: 350px!important;
      .ElectronWrap{
        padding: 0!important;
      }
    }
  }
}
.el-tabs--top {
  /*height: 580px;*/
}
>>>.ag-status-bar-right {
  width: 100%;
}

/* 工时进度样式 */
.work-progress-container {
  display: flex;
  //flex: 1;
  background: linear-gradient(135deg, #52A0F5 0%, #3B82F6 100%);
  border-radius: 8px;
  margin: 8px 0 12px 0;
  padding: 5px 30px;
  box-shadow: 0 4px 15px rgba(82, 160, 245, 0.25);
  position: relative;
  overflow: hidden;
  min-width: calc(100vw - 700px);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
    pointer-events: none;
  }
}

.work-progress-content {
  display: flex;
  width: 100%;
  justify-content: space-around;
  align-items: center;
  gap: 50px;
  position: relative;
  z-index: 1;
}

.progress-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 160px;
  position: relative;

  &:first-child {
    flex-direction: row;
    align-items: center;
    margin-right: 30px;
    min-width: auto;
  }
}

.progress-bar-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  //gap: 8px;
}

.progress-bar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3px;
}

.progress-bar {
  width: 100%;
  height: 10px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 5px;
  overflow: hidden;
  position: relative;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #ffffff 0%, #f0f8ff 100%);
  border-radius: 4px;
  transition: width 0.6s ease-in-out;
  position: relative;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.4) 50%, transparent 100%);
    animation: shimmer 2s infinite;
  }
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.progress-label {
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  white-space: nowrap;
}

.progress-unit {
  color: #ffffff;
  font-size: 12px;
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  white-space: nowrap;
  margin-left: 10px;
}

.progress-text {
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  white-space: nowrap;
}

.progress-percentage {
  position: absolute;
  right: -35px;
  bottom: -12px;
  transform: translateY(-50%);
  color: #ffffff;
  font-size: 12px;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  white-space: nowrap;
  z-index: 10;
}
>>>.ag-status-name-value {
  width: 100%;
}
</style>
