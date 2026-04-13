<template>
  <div class="case_management_item">
    <ViewsSwitching class="ViewsSwitching" @changePattern="changePattern"></ViewsSwitching>
    <MyTabs ref="myTabs" class="MyTabs" :page-title="pageTitle" :identification="identification" :defaultColumnDefs="deepCloneData" style="position: absolute" @editableTab="editableTab" :class="myTabsActivity?'activity':''" v-if="columnDefs.length&&pageTitle=='案件管理'" :getContextMenuItems="getContextMenuItems"></MyTabs>
    <div class="queryButton" style="margin: 0 auto" :class="myTabsActivity?'activity':''">
      <div class="buttonWrap_small">
        <el-button-group class="button-group-search" v-clickoutside="clickoutside">
          <el-button id="mySearch" type="primary" size="small" @click="handleSearch(0)">搜索</el-button>
          <el-button type="primary" style="margin-left:0" class="searchRight" size="small" icon="el-icon-arrow-down"
                     @click.stop.prevent="drawerState=true"></el-button>
          <transition name="show" mode="out-in">
            <div class="searchWrap" id="searchWrap" v-show="drawerState">
              <div class="form-container">
                <el-form label-width="120px" size="mini" @keyup.enter.native="handleSearch(0)">
                  <template v-if="pageTitle=='案件管理'||pageTitle=='官方通知'">
                    <el-form-item label="案件文号:" class="postInfo-container-item">
                      <el-input type="text" clearable v-model="queryModuleData.agentNumStart" placeholder="请输入案件文号"
                                @change="(value)=>changeTextRange(value,'agentNumEnd')"></el-input>
                      <span>至</span>
                      <el-input type="text" clearable v-model="queryModuleData.agentNumEnd"
                                placeholder="请输入案件文号"></el-input>
                    </el-form-item>
                  </template>
                  <template v-if="pageTitle=='递交官方'">
                    <el-form-item label="案件文号:" class="postInfo-container-item">
                      <el-input type="text" v-model="queryModuleData.agentNumStart" clearable placeholder="请输入案件文号"
                                @change="(value)=>changeTextRange(value,'agentNumEnd')"></el-input>
                      <span>至</span>
                      <el-input type="text" v-model="queryModuleData.agentNumEnd" clearable
                                placeholder="请输入案件文号"></el-input>
                    </el-form-item>
                  </template>
                </el-form>
                <div class="divdiver"></div>
                <el-form size="mini" label-width="120px" @keyup.enter.native="handleSearch(0)" style="margin-top: 2px">
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
                    <template v-if="item.filterType==='selectMultipleMany' && item.property === 'custIdArray'">
                      <el-select v-if="item.filterType==='selectMultipleMany' && item.property === 'custIdArray' && !isCustDim" multiple
                               v-model="queryModuleData[item.property]" filterable remote clearable reserve-keyword
                               placeholder="请输入关键词" :remote-method="(queryString)=>{
            remoteMethod(queryString,index,item.property,item.filterName);
            }">
                      <el-option v-for="itm in item['valueList']" :key="itm.id" :label="itm.value" :value="itm.id">
                      </el-option>
                    </el-select>
                      <el-input v-if="isCustDim" type="text" placeholder="请输入客户关键字" v-model="queryModuleData.custName"></el-input>
                      <el-checkbox :true-label="1" :false-label="0" v-model="isCustDim" label="模糊"></el-checkbox>
                    </template>
                    <el-select v-if="item.filterType==='selectMultipleMany' && item.property !== 'custIdArray'" multiple
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
                    <template v-if="item.filterType==='selectTableMultipleMany' && item.property === 'appCnNameArray'">
                      <el-select v-if="item.filterType==='selectTableMultipleMany' && !isAppDim"
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
                      <el-option v-for="itm,idx in item['valueList']" :key="itm.id" :label="itm.value" :value="itm.id">
                        <el-tooltip v-for="itmx,key in item['valueList'][idx]" v-if="key!='id'" class="item"
                                    effect="light" :content="itmx" placement="top">
                          <span>{{itmx}}</span>
                        </el-tooltip>
                      </el-option>
                    </el-select>
                      <el-input v-if="isAppDim" type="text" placeholder="请输入关键字" v-model="queryModuleData.appCnName"></el-input>
                      <el-checkbox :true-label="1" :false-label="0" v-model="isAppDim" label="模糊"></el-checkbox>
                    </template>
                    <el-select v-if="item.filterType==='selectTableMultipleMany' && item.property !== 'appCnNameArray'"
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
                      <el-option v-for="itm,idx in item['valueList']" :key="itm.id" :label="itm.value" :value="itm.id">
                        <el-tooltip v-for="itmx,key in item['valueList'][idx]" v-if="key!='id'" class="item"
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
                              v-if="item.filterType==='textarea'" type="textarea"></el-input>
                    <el-input clearable v-model="queryModuleData[item.property.split(',')[0]]"
                              :placeholder="'请输入'+item.filterName" v-if="item.filterType==='textRange'"
                              @change="(string)=>changeTextRange(string,index,item.property)"></el-input>
                    <span v-if="item.filterType==='textRange'" v-show="item.property.includes(',')">至</span>
                    <el-input clearable v-model="queryModuleData[item.property.split(',')[1]]"
                              :placeholder="'请输入'+item.filterName" v-if="item.filterType==='textRange'"></el-input>
                    <DataPicker class="DataPicker" v-if="item.filterType==='date'"
                                v-model="queryModuleData[item.property]"></DataPicker>
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
              <el-button style="position:absolute;top: 10px;right: 10px" type="text" size="small" @click="queryFilter">
                <i class="el-icon-s-tools"></i>更多
              </el-button>
            </div>
          </transition>
        </el-button-group>
        <el-menu class="el-menu-demo" mode="horizontal" @select='(e)=>handleSelect(e)' v-allow="83">
          <el-submenu index="1">
            <template slot="title">新建</template>
            <el-submenu index="1-1" v-allow="152">
              <template slot="title">新建费用账单</template>
              <el-menu-item index="1-1-1" v-allow="180">账单</el-menu-item>
              <el-menu-item index="1-1-2" v-allow="181">内部账单</el-menu-item>
              <el-menu-item index="1-1-4" v-allow="229">境外账单</el-menu-item>
              <el-menu-item index="1-1-3">费用</el-menu-item>
            </el-submenu>
            <el-submenu index="1-2">
              <template slot="title">新建案件进程</template>
              <el-menu-item index="1-2-1" v-if="$store.getters.permissions.includes(182)">递交指令</el-menu-item>
              <el-menu-item index="1-2-2" v-allow="183" v-if="business != 6&&taskType !=  7">官方通知</el-menu-item>
              <el-menu-item index="1-2-2-3" >cpc递交文件</el-menu-item>
              <el-menu-item index="1-2-2-2" >递交官方(文件)</el-menu-item>
              <el-menu-item index="1-2-3" v-if="taskType != 4">客户往来</el-menu-item>

                <el-submenu v-else index="1-2-3">
                  <template slot="title">客户往来</template>
                  <el-menu-item index="1-2-3-1">客户指示</el-menu-item>
                  <el-menu-item index="1-2-3-2">致函客户</el-menu-item>
                </el-submenu>

              <el-menu-item index="1-2-4">内部往来</el-menu-item>
              <el-menu-item index="1-2-5" v-if="taskType != 4">外代所往来</el-menu-item>
              <el-submenu v-else index="1-2-5">
                <template slot="title">外代所往来</template>
                <el-menu-item index="1-2-5-1">外代所来函</el-menu-item>
                <el-menu-item index="1-2-5-2">致函外代所</el-menu-item>
              </el-submenu>
              <el-menu-item index="1-2-6">对方当事人往来</el-menu-item>
              <!--<el-menu-item index="1-2-7">特批预立卷审批</el-menu-item>-->
            </el-submenu>
            <el-submenu index="1-3" v-allow="154">
              <template slot="title">新建时限</template>
              <el-menu-item index="1-3-1" v-allow="190">官方时限</el-menu-item>
              <el-menu-item index="1-3-2" v-allow="191">内部时限</el-menu-item>
            </el-submenu>
            <el-menu-item index="1-4">工时</el-menu-item>
            <el-menu-item index="1-5">任务</el-menu-item>
          </el-submenu>

        </el-menu>
        <el-button type="primary" size="small" v-allow="288" v-if="pageTitle==='递交官方' && taskType == 4" @click="changeDoc">制作
        </el-button>
        <el-button type="primary" size="small" v-allow="289" v-if="pageTitle==='递交官方' && taskType == 4" @click="auditingClick">审核
        </el-button>
        <!--        <el-button type="primary"  size="small" v-if="pageTitle==='案件管理' && taskType == 4"  @click="changeDoc" >制作</el-button>-->
        <el-button type="primary" size="small" v-if="pageTitle==='案件管理'&& isSuggestion" @click="handleSelect('立卷')">立卷
        </el-button>
        <el-button type="primary" v-allow='247' size="small" v-if="pageTitle==='案件管理'" @click="handleSelect('变更办案人')">
          变更办案人
        </el-button>
        <el-button type="primary" size="small" v-if="pageTitle==='案件管理'" @click="generateTemplate()">
          导出取证模板
        </el-button>
        <el-button type="primary" size="small" v-if="pageTitle==='案件管理'" @click="generateTemplateZip()">
          导出取证ZIP
        </el-button>

        <template v-if="taskType == 6">
<!--          <el-popover-->
<!--            placement="bottom"-->
<!--            width="400"-->
<!--            trigger="click">-->
<!--              <div v-if="!noContent">-->
<!--                <div v-for="(item,key) in mbData" :key='key' class="modelItem" @click="choseModel(item)">-->
<!--                  {{item.name}}-->
<!--                </div>-->
<!--              </div>-->
<!--              <div v-else>暂无数据</div>-->
<!--            <div slot="reference" class="tool_item">-->
<!--              <el-button size="small" type="primary">模板生成</el-button>-->
<!--            </div>-->
<!--          </el-popover>-->
        </template>

<!--        <el-button type="primary" size="small" v-if="pageTitle==='官方通知' && taskType == 4" @click="toExamine">审核-->
        </el-button>
        <el-button type="primary" size="small" v-if="pageTitle==='官方通知' && taskType == 4" @click="handleSelect('文件下载')">
          下载
        </el-button>
        <el-button type="primary" v-if="pageTitle==='官方通知'&& taskType == 4 && $store.getters.permissions.includes(233)" size="small"
                   @click="takeManualIdentification">手动识别官文 {{officialInfoCount?'('+officialInfoCount+')':''}}
        </el-button>
        <el-button type="primary" v-if="pageTitle==='官方通知'&& taskType == 4" size="small"
                   @click="handleSelect('文件上传排序')">文件上传
        </el-button>
<!--                模板生成-->
        <exportFile v-if="pageTitle==='案件管理'&&(taskType == 4 || taskType == 2)" ref="exportFile" :business="taskType == 4 ? 3 : 11" :downLoadState="downLoadState"
                    :multipleSelection="getSelectedRows()" @getData="getExportFileData" @exportList="exportList"
                    @close="closeSelect" :pageTitle="pageTitle" @multipleTypeText="changeMultiple"></exportFile>

        <el-button type="primary" v-if="pageTitle==='官方通知'&& taskType == 4" size="small" @click="cpcEnter">CPC录入
        </el-button>

        <el-button v-show="$store.getters.permissions.includes(278)" type="primary" v-if="pageTitle==='官方通知'&& taskType == 4" size="small" @click="deleteList">删除
        </el-button>
        <el-button type="primary" size="small" v-show="$store.getters.permissions.includes(238)" v-if="pageTitle!='官方通知' && pageTitle!='递交官方' && $route.meta.taskType == 4" @click="handleSelect('批量操作')">批量编辑</el-button>
        <el-button type="primary" size="small" v-show="$store.getters.permissions.includes(278)" v-if="pageTitle!='官方通知' && pageTitle!='递交官方' && $route.meta.taskType == 4" @click="deletecCases">删除</el-button>
        <el-menu class="el-menu-demo" mode="horizontal" @select='(e)=>handleSelect(e,[],true)' v-if="pageTitle!='官方通知' && pageTitle!='递交官方' && $route.meta.taskType == 2"  >
          <el-submenu index="1">
            <template slot="title">文件上传</template>
            <el-menu-item index="1-2-2-2">递交官方(文件)</el-menu-item>
            <el-menu-item index="1-2-3"  >客户往来</el-menu-item>
            <el-menu-item index="1-2-4" >内部往来</el-menu-item>
            <el-menu-item index="1-2-5" >外代所往来</el-menu-item >
            <el-menu-item index="1-2-6" >对方当事人往来</el-menu-item>
          </el-submenu>
        </el-menu>
        <el-button type="primary" v-if="pageTitle==='官方通知'&& taskType == 6" size="small" @click="createTem">模版生成
        </el-button>

<!--        <handTime ref="handTime" :caseData="caseData" noQuery="1" style="visibility: hidden"></handTime>-->
        <el-dialog
          title="新建工时"
          append-to-body
          :close-on-click-modal="false"
          :visible.sync="workHourView"
          width="45%"
          height="80%"
          class="abow_dialog"
        >
          <create-work-hour v-if="workHourView" :caseData="caseData" @closeDialog="workHourView = false"></create-work-hour>
        </el-dialog>


        <!--        <el-menu class="el-menu-demo" mode="horizontal" @select="handleSelect" v-allow="83">-->
        <!--          <el-submenu index="1">-->
        <!--            <template slot="title">新建</template>-->
        <!--            <el-submenu index="1-1" v-allow="152">-->
        <!--              <template slot="title">新建费用账单</template>-->
        <!--              <el-menu-item index="1-1-1" v-allow="180">账单</el-menu-item>-->
        <!--              <el-menu-item index="1-1-2" v-allow="181">内部账单</el-menu-item>-->
        <!--              <el-menu-item index="1-1-3">费用</el-menu-item>-->
        <!--            </el-submenu>-->
        <!--            <el-submenu index="1-2" v-if="$store.getters.permissions.includes(153)&&pageTitle==='案件管理'||(pageTitle==='递交官方'&&$store.getters.permissions.includes(183))" >-->
        <!--              <template slot="title">新建案件进程</template>-->
        <!--              <el-menu-item index="1-2-1" v-if="pageTitle==='案件管理'&&$store.getters.permissions.includes(182)">递交指令</el-menu-item>-->
        <!--              <el-menu-item index="1-2-2" v-allow="183">官方通知</el-menu-item>-->
        <!--              <el-menu-item index="1-2-2-2" v-if="pageTitle==='案件管理'">递交官方(文件)</el-menu-item>-->
        <!--              <el-menu-item index="1-2-3"  v-if="pageTitle==='案件管理'">客户往来</el-menu-item>-->
        <!--              <el-menu-item index="1-2-4"  v-if="pageTitle==='案件管理'">内部往来</el-menu-item>-->
        <!--              <el-menu-item index="1-2-5"  v-if="pageTitle==='案件管理'">外代所往来</el-menu-item>-->
        <!--              <el-menu-item index="1-2-6"  v-if="pageTitle==='案件管理'">对方当事人往来</el-menu-item>-->
        <!--              &lt;!&ndash;<el-menu-item index="1-2-7">特批预立卷审批</el-menu-item>&ndash;&gt;-->
        <!--            </el-submenu>-->
        <!--            <el-submenu index="1-3" v-allow="154">-->
        <!--              <template slot="title">新建时限</template>-->
        <!--              <el-menu-item index="1-3-1" v-allow="190">官方时限</el-menu-item>-->
        <!--              <el-menu-item index="1-3-2" v-allow="191">内部时限</el-menu-item>-->
        <!--            </el-submenu>-->
        <!--          </el-submenu>-->
        <!--        </el-menu>-->
        <!--        <el-button type="primary" size="small" @click="handleSelect('批量操作')" >批量编辑</el-button>-->
        <!--        <el-button type="primary" size="small" v-if="queryModuleData.instructionSubmitStatus!=1"-->
        <!--                   v-show="(pageTitle==='递交官方'&&$store.getters.permissions.includes(80))" @click="toExamine">审核</el-button>-->
        <el-form v-if="pageTitle==='案件管理'" label-width="120px" @submit.native.prevent size="mini" @keydown.enter.native="keyDownEnter">
          <el-form-item label="我的案件:" style="margin-bottom: 0!important">
            <el-radio-group v-model="queryModuleData.myCase" @change="handleSearch(1)">
              <el-radio label="2">最近三日浏览</el-radio>
              <el-radio label="3">当日立卷</el-radio>
              <el-radio label="">全部</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form v-if="pageTitle==='案件管理'" 
                   label-width="120px" 
                   @submit.native.prevent 
                   size="mini">
            <el-form-item label="快捷查询:" style="margin-bottom: 0">
              <el-input type="text" 
                       v-model="queryModuleData.regAndAgent" 
                       clearable
                       @change="handleChangeSearch"
                       @clear="handleClearSearch"
                       ref="quickSearchInput"
                       @keydown.enter.native.stop="handleEnterSearch"></el-input>
            </el-form-item>
          </el-form>
        </el-form>
        <el-form v-else label-width="120px" @submit.native.prevent size="mini">
          <el-row v-if="pageTitle==='递交官方' && taskType == 4">
            <el-form-item label="递交状态:" style="margin-bottom: 0!important">
              <el-radio-group v-model="queryModuleData.workStatus" @change="handleSearch(1)">
                <el-radio :label="0">退回到待递交</el-radio>
                <el-radio :label="1">待流程制作</el-radio>
                <el-radio :label="6">待流程合成申请文件</el-radio>
                <el-radio :label="5">待撰稿人审核</el-radio>
                <el-radio :label="2">待流程审核</el-radio>
                <el-radio :label="3">待回执</el-radio>
                <!--                <el-radio label="1">待递交</el-radio>-->
              </el-radio-group>
            </el-form-item>

            <el-form-item label="递交日期:" style="margin-bottom: 0">
              <!--            <el-input type="text" v-model="queryModuleData.regAndAgent" clearable  @change="handleSearch(1)" ></el-input>-->
              <DataPicker class="DataPicker" v-model="queryModuleData['submitDateArray']" @change="changeDjSubmitDate"></DataPicker>
<!--              <el-date-picker-->
<!--                @change="changeDjSubmitDate"-->
<!--                v-model="queryModuleData.submitDateArray"-->
<!--                type="daterange"-->
<!--                range-separator="至"-->
<!--                start-placeholder="开始日期"-->
<!--                end-placeholder="结束日期">-->
<!--              </el-date-picker>-->
            </el-form-item>
          </el-row>

          <el-row>
            <el-form-item label="快捷查询:" style="margin-bottom: 0">
              <el-input type="text" v-model="queryModuleData.regAndAgent" clearable
                        @change="handleSearch(1)"></el-input>
            </el-form-item>
          </el-row>
          <el-form-item  label="创建日期:"  style="margin-bottom: 0" v-if="business==4">
            <!-- <el-date-picker
              v-model="queryModuleData.materialCreateDateArray"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              @change="handleSearch(1)"
              value="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              end-placeholder="结束日期"
            >
            </el-date-picker> -->
            <DataPicker class="DataPicker" v-model="queryModuleData['materialCreateDateArray']" @change="changeDjSubmitDate"></DataPicker>
          </el-form-item>
        </el-form>
      </div>


    </div>
    <div v-if="pageTitle==='官方通知'&& taskType == 4">
      <el-form label-width="120px" @submit.native.prevent size="mini"
               style="margin-top:10px">
        <el-form-item label="官文状态:" style="margin-bottom: 0!important">
          <el-radio-group v-model="queryModuleData.officialInformScreen" @change="handleSearch(1)">
<!--            <el-radio label="1">待审核</el-radio>-->
            <!--          <el-radio label="2">待审核电子官文</el-radio>-->
            <!--          <el-radio label="3">待审核纸质官文</el-radio>-->
            <el-radio label="4">当天收到</el-radio>
            <el-radio label="5">待报告</el-radio>
            <!--          <el-radio label="6">正在发送</el-radio>-->
            <el-radio label="7">全部</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

    </div>


    <section>
      <div style="display: flex;position: relative">
        <TitleTotal :total="total"/>
        <div class="button_wrap">
          <el-button class="exactButton" type="primary" size="mini"
                     @click="gridApi.deselectAll();gridApi.selectAllFiltered()">全选
          </el-button>
          <el-button class="exactButton" size="mini" @click="gridApi.deselectAll()">清除所选</el-button>
          <el-button type="primary" size="mini" @click="recognizedError"
                     v-if="(pageTitle==='官方通知'&&$store.getters.permissions.includes(290))">识别错误
          </el-button>
          <!--          <el-button class="exactButton" size="mini" type="primary" @click="jumpDetailSubmisson">{{multipleTypeText}}</el-button>-->
          <!--          <el-button class="exactButton"  size="mini" @click="selectionState=false">取消</el-button>-->
        </div>
        <div
          style="cursor:pointer;position: absolute;display:flex;align-items:center;right: 0;bottom:-6px;font-size: 14px;padding-right: 6px">
          <el-button type="text" @click="exportList(2)" >导出</el-button>
          <span style="color: #52A2F4;margin: 0 5px"> / </span>
          <el-button type="text" @click="exportList(1)">全局导出</el-button>
        </div>
<!--          <el-button type="text" @click="exportList(1)"><i class="el-icon-download">导出</i></el-button>-->
<!--          <img @click="exportList(2)" src="@/assets/moon.png" width="16" alt=""></div>-->
        <!--        <el-button type="text" style="position: absolute;right: 0;bottom:-6px;font-size: 14px;padding-right: 6px" @click="exportList(2)"><i class="el-icon-download">导出</i></el-button>-->
      </div>
      <div class="content_wrap">
        <div class="left_wrap" :style="{width:pattern?leftWrapWidth:'100%' }">
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
                     :rowData="caseList"
                     rowSelection="multiple"
                     @grid-ready="onGridReady"
                     :gridOptions="gridOptions"
                     @dragStopped="dragStopped"
                     :getContextMenuItems="getContextMenuItems"
                     suppressAutoSize

                     animateRows
                     @rowSelected="rowSelected"
                     @rowDoubleClicked="rowDoubleClicked"

                     @rowClicked="rowClicked"
                     @sortChanged="refreshEvenRowsCurrencyData"
                     @filterChanged="refreshEvenRowsCurrencyData"
                     @selectionChanged="selectionChanged"
                     :localeText="$store.state.caseInformation.localeText"
                     :suppressDragLeaveHidesColumns="true"
                     :suppressMakeColumnVisibleAfterUnGroup="true"
                     rowGroupPanelShow="always"
                     :groupSelectsChildren="true"
                     :suppressAggFuncInHeader="true"
                     :autoGroupColumnDef="autoGroupColumnDef"
                     @drop.native.stop.prevent="enentDrop($event)"
                     @dragover.native.stop.prevent="hoverState=true"
                     @dragleave.native.stop.prevent="hoverState=false"
                     @dragenter.native.stop.prevent="hoverState=true"
          >
          </AgGridVue>
          <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :pageSizes="pageSizesList"
                      :limit.sync="listQuery.pageSize" @pagination="queryCaseList(true)"/>
          <div class="checkbox" v-show="checkboxState">
            <el-select ref="checkCaseSelect" v-model="checkCaseList" multiple reserve-keyword filterable
                       placeholder="请选择" collapse-tags :popper-append-to-body="false" @visible-change="handleChange"
                       :filter-method="filterCheck">
              <template slot="">
                <div class="checkbox_bottom">
                  <el-button size="mini" round @click.stop="delPreference(1)">恢复默认</el-button>
                  <el-button style="margin-right: 3px" size="mini" round @click.stop="savePreference(1)">保存设置
                  </el-button>
                  <!--<el-button size="mini" round @click.stop="checkNotAtAll">全不选</el-button>-->
                </div>
              </template>
              <el-option v-for="(item,idx) in selectColumnList.filter(item =>item.COLUMN_COMMENT.includes(filterText))"
                         :key="item.COLUMN_NAME+Math.random()" :label="item.COLUMN_COMMENT" :value="item.COLUMN_NAME">
                <!--<el-checkbox v-model="selectBox[idx]">{{item.COLUMN_COMMENT}}</el-checkbox>-->
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="right_wrap"
             :style="{position:'relative','margin-left':currentCaseId&&pattern?'10px' :'0',height:clientHeight+'px'}">
          <!--<span class="el-icon-close" slot="close" style="cursor:pointer;position: absolute;right: 0;top: 10px;z-index: 1000" @click="closeCurrentRow"></span>-->
          <seeCaseDetail :style="cssVar" v-if="currentCaseId&&pattern" :case-id="currentCaseId" :sign="1" :taskType="taskType"
                         :backsign="false" :business="business"></seeCaseDetail>
        </div>
      </div>
    </section>
    <el-dialog
      title="预览"
      append-to-body
      :visible.sync="preDocState"
      width="50%"
      height="100vh"
      :modal="false"
      top="0"
      class="pdfDialog dragDialog"
      :close-on-click-modal="false"
      v-dialogDrag
    >
      <swiper :options="swiperOption" v-if="pdfData.length">
        <swiper-slide v-for="(item, index) in pdfData">
          <iframe @load="onload()" class="iframe"  :src="`/ipdoc${item}`"></iframe>
        </swiper-slide>
        <div v-show="pdfData.length>1" class="swiper-button-prev swiper-button-prev2" slot="button-prev"></div>
        <div v-show="pdfData.length>1" class="swiper-button-next swiper-button-next2" slot="button-next"></div>
      </swiper>
    </el-dialog>
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
    <el-dialog title="案件选择" :visible.sync="selectCaseVisible" width="40%">
      <el-table :data="selectCaseList" border height="450">
        <el-table-column type="index" width="60" label="序号" align="left">
          <template slot-scope="scope">
            <span style="margin: 0;cursor: pointer" @click="takeCaseDetail(scope.row)">
              {{scope.$index+1}}
            </span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="案件文号" prop="agentNum">
          <template slot-scope="scope">
            <span style="margin: 0;cursor: pointer" @click="takeCaseDetail(scope.row)">
              {{scope.row.agentNum}}
            </span>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="selectCaseVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <PdfPreview class="pdfPreview" v-if="pdfDataState" :pdf-data="pdfData"
                @closePdfPreview="pdfDataState=false"></PdfPreview>
    <Willtable v-if="showTable" :plType="plType"
               :changeType="getSelectedRows().length?getSelectedRows()[0].changeType:''"
               :reportMatter="getSelectedRows().length?getSelectedRows()[0].reportMatter:null"
               :materialTypeId="getSelectedRows().length?getSelectedRows()[0].materialTypeId:null"
               :caseTypeId="getSelectedRows().length?getSelectedRows()[0].caseTypeId:null"
               :caseIds='willtableCaseIdList'
                :showTable='showTable'  @closeTable='closeTable'>
    </Willtable>
    <el-dialog :title="comUploadType" :visible.sync="uploadState" width="70%">
      <el-table :data="getSelectedRows()" border>
        <el-table-column type="index" width="60" label="序号" align="left">
          <template slot-scope="scope">
            <span style="margin: 0;cursor: pointer" @click="takeCaseDetail(scope.row)">
              {{scope.$index+1}}
            </span>
          </template>
        </el-table-column>
        <el-table-column align="left" v-for="(item,index) in tableTitle" :label="item.title" :prop="item.value"
                         :width="item.width" :key="index">
          <template slot-scope="scope">
            <span :class="item.value=='agentNum'?'itemTitle_style':''"
                  v-if="item.value!=='imageFile'&&item.value!='custName'" :title='scope.row[item.value]'
                  style="margin: 0;cursor: pointer"
                  @click="takeCaseDetail(scope.row)">
              {{scope.row[item.value]}}
            </span>
            <CustCard v-if="item.value=='custName'" :custName="scope.row.custName" :customerID="scope.row.custId"/>
            <img class="filterTableTmg" v-if="item.value==='imageFile'" :src="'ipdoc'+scope.row['imageFile']" alt="">
          </template>
        </el-table-column>
      </el-table>
      <BulkUploadFile :taskType="taskType" v-if="uploadState" :patentOneMaterial="patentOneMaterial" :uploadType="uploadType"
                      :curCaseId="getSelectedRows().map(item=>item.caseId)" @changeFalse="closeSelect"></BulkUploadFile>
    </el-dialog>
    <litigationSubmission @updateData="queryCaseList" :business="business" :taskType="taskType" :changeDoc="isChangeDoc"
                          :isAuditing="isAuditing"
                          :title="title"
                          v-if="submissionState" :submissionState="submissionState" :submissionType="submissionType"
                          :multipleSelection="multipleSelectionCaseArray"
                          :curCaseId="multipleSelectionCaseArray.map(item=>item.caseId)"
                          @changeFalse="closeSelect"
                          @openRecord="openRecord"
    ></litigationSubmission>
    <SelectOption :buss-id="bussId" v-if="selectionOptionState" :dialog-visible="selectionOptionState"
                  @cancel="closeSelect" :idArray="getCurrentRowsData(getCurFilterId(pageTitle))"
                  :defaultMultipleSelect="preferenceList.map(i=>i.title)" :exportType="exportType"
                  :exportQueryModel="exportQueryModel"></SelectOption>
    <EmitSearch @undateSearch="undateSearch"></EmitSearch>
    <litigationOfficial :business="business" :taskType="taskType" v-if="officialCommunicationState"
                        :officialCommunicationState="officialCommunicationState"
                        :officialCommunicationType="officialCommunicationType"
                        :multipleSelection="multipleSelectionCaseArray" @closeThisPage="closeSelect"/>
    <CreateNewTask v-if="taskView" ref="createNewTask" :taskView="taskView" @closeView="taskView=false" :caseId="caseData.caseId"
                   :case-type-id="caseData.caseTypeId" :judgeRank="caseData.judgeRank"></CreateNewTask>
    <el-dialog
      ref="timeLimit"
      title="创建时限"
      append-to-body
      :visible.sync="timeLimitState"
      width="50%"
      height="100vh"
      :modal="false"
      top="0"
      class="pdfDialog"
      :close-on-click-modal="false"
      v-dialogDrag
    >
      <createTimeLimit :query="timeLimitData" @cancel="closeSelect"></createTimeLimit>

    </el-dialog>
    <el-dialog
      title="变更办案人"
      append-to-body
      :visible.sync="updateWkgState"
      width="60%"
      height="100vh"
      :modal="false"
      top="0"
      class="pdfDialog"
      :close-on-click-modal="false"
      v-dialogDrag
    >
      <CaseInvestigators :statusChange="true" ref="CaseInvestigators" v-if="updateWkgState" :isPatent="taskType == 4"
                         :caseDetailData="updateWkgData"></CaseInvestigators>
      <span slot="footer" class="dialog-footer" style="float: left">
        <el-button @click="updateWkgState = false">取 消</el-button>
        <el-button type="primary" @click="updateWkg">确 定</el-button>
      </span>
      <!--      <officialSubmission v-if="updateWkgState" :query="detailSubmissionData" @cancel="closeSelect"></officialSubmission>-->
    </el-dialog>

    <el-dialog
      :visible.sync="examineDialog"
      width="50%"
      title="是否已对录入的官文信息及时限进行核查?"
    >
      <el-table
        :data="examineData.tmcoiMapList"
        style="width: 100%">
        <el-table-column
          prop="typeName"
          label="官文类型"
          width="180">
        </el-table-column>
        <el-table-column
          prop="num"
          label="数量"
          width="180">
        </el-table-column>
        <el-table-column
          prop="tltNum"
          label="有时限的数量">
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="examineDialog = false">取 消</el-button>
        <el-button type="primary" @click="auditOfficalDoc" :class="{'button_grey':!examineData.ifShow}">确 定</el-button>
      </span>
    </el-dialog>

    <ManualIdentification v-if="ManualIdentificationState" :officialInfoCounData="officialInfoCounData"
                          @changeManualIdentification="ManualIdentificationState=false"
                          :ManualIdentificationState="ManualIdentificationState"
                          :caseTypeId="$commonUtils.getCaseTypeIdByTaskType(+taskType)"
                          :taskType="taskType"
                          :isPatent="true"
                          :business="41"
                          @changeTotal="getManualRecognitionOfficialInfoCount">
    </ManualIdentification>

    <el-dialog
      :visible.sync="cpcEnterView"
      width="80%"
      title="CPC录入"
    >
      <cpcGrid ref="cpcenter" @close="closeCpcEnterView"></cpcGrid>
      <span slot="footer" class="dialog-footer fl-ac-jc">
<!--        <el-button @click="cpcEnterView = false">取 消</el-button>-->
<!--        <el-button type="primary">确 定</el-button>-->
      </span>
    </el-dialog>

<!--    文件下载选择命名方式弹框-->
    <el-dialog
      class="file-down"
      :visible.sync="fileDownLoadView"
      width="40%"
      title="文件命名"
      :before-close="closeDialog"
    >
      <FileDownLoadDialog ref="filedown" @downLoadfiles="downLoadfiles" @closeDialog="closeDialog"></FileDownLoadDialog>
<!--      <span slot="footer" class="dialog-footer"></span>-->
    </el-dialog>
<!--    文件上传-->
    <el-dialog
      v-dialogDrag
      center
      top="0"
      height="852"
      :visible.sync="uploadProofreadingState"
      width="50%"
      :close-on-click-modal="false"
      :show-close="false"
      :close-on-press-escape="false"
    >
      <UploadProofreading v-if="uploadProofreadingState" :uploadType="uploadType" :multipleTypeText="multipleTypeText"  @cancel="closeSelect" :defaultCaseList="getSelectedSortRows()" :filelist="curFile"></UploadProofreading>
    </el-dialog>

<!--    专利 - 复制立案-->
    <el-dialog
      v-if="copyForm.copyCaseView"
      title="案件数量"
      :visible.sync="copyForm.copyCaseView"
      width="30%"
    >
      <div class="fl-ac-jc">
        <el-input size="small" style="width: 200px" type="number" placeholder="请输入复制费用数量" v-model="copyForm.caseNumber"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
      <el-button size="mini" @click="() => {copyForm = {
          rowData: {},
          addAbroadBillView: false,
          caseNumber: 1
        }}">取 消</el-button>
      <el-button size="mini" type="primary" @click="submitCopyAbroadBill">确 定</el-button>
    </span>
    </el-dialog>

    <relevant-dialog v-if="relevantView && relCaseId" :viewState="relevantView" @closeRelevantDialog="closeRelevantDialog" :business="business" :relCaseId="relCaseId"></relevant-dialog>

    <el-dialog
      v-if="trawSheetView"
      title="草单"
      :close-on-click-modal="false"
      :visible.sync="trawSheetView"
      width="80%"
      height="80%"
      class="abow_dialog"
    >
      <traw-sheet-details :isPatentFee="true" v-if="trawSheetView" :billRecordList="billRecordList" open-type="edit" @closeDialog="closeRecordDialog" />
    </el-dialog>
  </div>
</template>

<script>
  import TrawSheetDetails from '../../../finance/billviews/components/trawSheetDetails'
  import UploadProofreading from '../../components/UploadProofreading'
  import FileDownLoadDialog from '@/components/FileDownLoadDialog';
  import cpcGrid from "../../components/cpcGrid";
  import CreateNewTask from "../../components/CreateNewTask";
  import CaseInvestigators from "@/views/workbench/case/components/CaseInvestigators";
  import Checkbox from "@/views/workbench/case/components/Checkbox"
  import Pagination from "@/components/Pagination";
  import FilterSelect from '@/components/FilterSelect'
  import ManualIdentification from "@/views/workbench/case/components/ManualIdentification";
  import {queryAllUrl} from "@/api/applicant";
  import BulkUploadFile from '@/views/workbench/case/components/BulkUploadFile'
  import litigationSubmission from '@/views/workbench/case/officialSubmission/components/litigationSubmission.vue'
  import litigationOfficial from '@/views/workbench/case/officialCommunication/components/litigationOfficial.vue'
  import exportFile from '@/components/exportFile'
  import SelectOption from '@/views/workbench/case/components/SelectOption'
  import OfficialDocuments from '@/views/workbench/case/components/OfficialDocuments'
  import wTable from '@/components/dragTable'
  import ViewsSwitching from '@/views/workbench/case/components/ViewsSwitching'
  import MyTabs from '@/views/workbench/case/components/MyTabs'
  import createTimeLimit from "@/views/workbench/toDoTasks/createTimeLimit";
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
    protectionCaseTemplateGeneration,
    downloadEvidenceMaterialzipPackage
  } from "@/api/caseList.js";
  import axios from 'axios'
  import jsFileDownload from 'js-file-download'
  import PdfPreview from "@/views/workbench/case/components/ManualIdentification/PdfPreview";
  import Willtable from "@/components/Willtable";
  import {mapGetters, mapState} from "vuex";
  import {downLoadAll, throttle} from "@/utils";
  import seeCaseDetail from '@/views/workbench/case/components/ManualIdentification/seeCaseDetail'
  // import {browserBehavior} from '../../components/browserBehavior'
  import Bus from '@/utils/Bus'
  // import handTime from '@/views/workbench/workTime/components/handTime.vue'
  import {
    querylyctListUrl,
    queryCustContactAllUrl,
    queryCollaborationAll
  } from "@/api/customerList";
  import RelevantDialog from '../../components/RelevantDialog'
  
import rememberPosition from '@/mixins/rememberPosition.vue'
  import { addWaitCases, queryCasesByTaskId } from '../../../../../api/caseList'
  import CreateWorkHour from "../../../workTime/components/CreateWorkHour";
  import {createPOA, queryMandate,createReceipt} from "../../../../../api/formList";
  export default {
    mixins: [rememberPosition],
    props: {
      field: {
        default: 'litigation'
      },
      business1: {
        type: Number,
        default: 11
      },
      bussId1: {
        type: Number,
        default: 5
      },
      getCaseList: {
        type: Function,
        default: queryCaseList
      },
      // queryModuleData: {
      //   type: Object,
      //   default: () => ({})
      // },
      taskType1: {},
      pageTitle: {
        type: String,
        default: '案件管理'
      },
      dialogVisible: {
        type: Boolean,
        default: true
      }
    },
    name: "litigationCase",
    data() {
      var tableHeader = []
      if (localStorage.getItem('tableHeader') && JSON.parse(localStorage.getItem('tableHeader')).find(item => item.name == this.$route.name)) {
        tableHeader = JSON.parse(localStorage.getItem('tableHeader')).find(item => item.name == this.$route.name).tableHeader
      }
      return {
        scrollTop: 0,
        isEnterPressed: false, // 标志变量，用于防止回车键触发handleChangeSearch
        billRecordList: [],
        trawSheetView: false,
        noContent: false,
        mbData: [],
        workHourView: false,
        isAppDim: 0,
        isCustDim: 0,
        copyForm: {
          rowData: {},
          copyCaseView: false,
          caseNumber: 1
        },
        relCaseId: '',
        relevantView: false,
        tableTitleList: [
            {"title": "案件文号", "value": "agentNum"},
            {"title": "专利类型", "value": 'typeNameStr'},
            {"title": "案件类型", "value": "caseType",},
            {"title": "申请方向", "value": "appFromto",},
            // {"title": "审级", "value": "judgeRankName"},
            {"title": "案件名称", "value": "caseCnName"},
            {"title": "客户", "value": "custName"},
            {"title": "阶段", "value": "stageName"},
            {"title": "立卷日期", "value": "caseDate"},
            {"title": "申请号", "value": "appNumber"},
            {"title": "申请人名称", "value": "applicantName"},
          ],
        uploadProofreadingState: false,
        hoverState:false,
        curFile:[],
        fileDownLoadView: false,
        patentOneMaterial: false,
        cpcEnterView: false,
        title: '递交',
        multipleTypeTextDisabled: false,
        examineDialog: false,
        examineData: {},
        isAuditing: false,
        isChangeDoc: false,
        caseTypeId: '',
        judgeRank: '',
        updateWkgData: {},
        updateWkgState: false,
        selectionOptionState: false,
        plType: "",
        drawerState: false,
        queryModuleData: {
          instructionSubmitStatus: ""
        },
        tableOption: {
          maxHeight: 200
        },
        submissionType: '',
        currentCaseId: '',
        pageSizesList: [10, 50, 200, 500, 1000, 5000, 10000],
        uploadType: '',
        uploadState: false,
        selectBox: [],
        filterText: "",
        showTable: false,
        ManualIdentificationState: false,
        checkboxState: false, // 表头筛选框状态
        transferVisible: false, // 配置筛选条件框
        transferData: [], // 筛选条件数据
        transferValue: [], // 当前筛选条件id
        caseList: [], // 当前列表数据
        checkCaseList: [], // 当前选中表头条件
        selectColumnList: [], // 配置表头总列数据做循环用
        preferenceList: [], // 循环表头数据
        filterData: {}, // 表头过滤数据
        searchTimer: null, // 搜索防抖定时器
        conditionsModuleList: [], // 渲染筛选条件
        caseListDefault: [], // 案件默认全部列表
        checkFilterList: [], // 控制筛选漏斗状态
        firstRequest: false, //第一次请求
        listQuery: {
          pageNo: 0,
          pageSize: JSON.parse(localStorage.getItem('pageSize')) ? JSON.parse(localStorage.getItem('pageSize')).find(item => item.name == this.$route.name) ? JSON.parse(localStorage.getItem('pageSize')).find(item => item.name == this.$route.name).pageSize : 10 : 10
        },
        total: 0,
        submissionState: false,
        listLoading: false,
        defaultParams: {
          //級聯菜單默認
          value: "caseTypeId",
          label: "caseType",
          children: "childrens",
          checkStrictly: true,
          multiple: true
        },

        multipleSelection: [],
        multipleSelectionCaseArray: [],
        selectionState: false,
        multipleTypeText: "递交",
        pdfData: [],
        pdfDataState: false,
        preDocState: false,
        swiperOption:{
          centeredSlides:true,
          spaceBetween: 10,
          observer:true, //修改swiper自己或子元素时，自动初始化swiper
          observeParents:true,
          direction: 'horizontal',
          speed:600, //config参数同swiper4,与官网一致
          navigation: {
            nextEl: '.swiper-button-next2',
            prevEl: '.swiper-button-prev2'
          }
        },
        willtableCaseIdList: [],
        selectCaseVisible: false,
        selectCaseList: [],
        officialInfoCount: 0,
        forCount: 100,
        requireList: [],
        otherSelect: false,
        downLoadState: false,
        exportListState: false,
        lastRow: '',
        startRow: '',
        rowList: [],
        dragState: {
          start: -1, // 起始元素的 index
          end: -1, // 结束元素的 index
          move: -1, // 移动鼠标时所覆盖的元素 index
          dragging: false, // 是否正在拖动
          direction: undefined // 拖动方向
        },
        tableHeader: tableHeader,
        currentId: '',
        clearWrapTop: 0,
        tableHeaderLabelList: [],
        myTabsActivity: false,
        curFilterSelect: {},
        rowContextmenuList: [
          // { name:'复制立案',action: 'createCase',permissions:18},
          // { name: '相关案件', action: 'relevant' },
          // { name:'暂存', action: 'temporarStorage'},
          // // { name:'暂存(批量)', action: 'temporarStorageAll'},
          // { name:'隐藏', action: 'hidden'},
          // { name:'隐藏(批量)', action: 'hiddenAll'},

        ],
        // identification: 'litigationCasecase_managementlitigation',
        filterDataSum: {},
        operationState: 1,
        officialInfoCounData: {},
        addFilterState: false,
        schemeName: '',
        officialCommunicationState: false,
        taskView: false,
        officialCommunicationType: 'create',
        gridOptions: {
          ...this.$store.state.caseInformation.gridOptions, ...{
            statusBar: {
              statusPanels: [
                { statusPanel: 'agTotalAndFilteredRowCountComponent', align: 'left' },
                {statusPanel: 'agSelectedRowCountComponent', align: 'left'},
              ]
            },
            //floatingFilter: true,
          }
        },
        currentPageSize: 0,
        defaultcolumnDefs: [
          {
            headerName: '序号',
            field: 'sid',
            width: this.getLoactionWidth('序号') == 'auto' ? 60 : this.getLoactionWidth('序号'),
            resizable: true,
            enableRowGroup: true,
            // enablePivot: true,
            'pinned': 'left',
            floatingFilter: true,
            filter: false,
            cellClass: 'vAlign',
            cellRenderer: this.cellRenderer,
            suppressMenu: true,
            // checkboxSelection: function(params) {
            //   // we put checkbox on the name if we are not doing grouping
            //   return params.columnApi.getRowGroupColumns().length === 0;
            // },
            // headerCheckboxSelection: function(params) {
            //     // we put checkbox on the name if we are not doing grouping
            //   return params.columnApi.getRowGroupColumns().length === 0;
            // },
            // headerCheckboxSelectionFilteredOnly: true
          },
        ],
        columnDefs: [],

        autoGroupColumnDef: {
          headerName: '组',
          field: 'group',
          headerCheckboxSelection: true,
          cellRenderer: 'agGroupCellRenderer',
          cellRendererParams: {checkbox: true},
        },
        timeLimitState: false,
        timeLimitData: {
          agentNums: [], kind: ''
        },
        brushRightHasFilter: false,
        leftWrapWidth: localStorage.getItem('leftWrapWidth') ? localStorage.getItem('leftWrapWidth') : '60%',
        caseData: {},
        taskType:'',
        business:'',
        bussId:'',
        exportType: 1,
        exportQueryModel: ''
      };
    },
    created() {
      Bus.$on('handleSelect', (key)=>{
        this.handleSelect(key)
      })
      this.business = this.business1
      this.taskType = this.taskType1
      this.bussId = this.bussId1
      if (this.$route.meta.business) {
        this.business = this.$route.meta.business
        this.taskType = this.$route.meta.taskType
        this.bussId = this.$route.meta.bussId
      }
      if (this.taskType == 6) { // 著作权案件的模板列表
        queryMandate({
          business: 4
        }).then(res => {
          this.mbData = res.data || []
        })
      }
    },
    beforeDestroy(){
      Bus.$off('busEvent')
      // 移除键盘事件监听器
      window.removeEventListener('keydown', this.handleKeyDown);
    },
    mounted() {
      this.rightDrag()
    },
    methods: {
      createTem(){
        const data={
          tmFileIds:this.getSelectedRows().map(item=>item.lawFileId),
          type:6
        }
        createReceipt(data).then(res=>{
          downLoadAll({ url: `ipdoc${res.data}`})
          this.$message.success(res.message)
        })
      },
      changeMaterialCreateDate(value){
        console.log(value,'value');
        this.handleSearch(1)
      },
      checkAndAddListener() {
        if (this.permissions && this.business !== null && this.taskType !== null) {
          if (this.permissions.includes(183) && this.business == 4 && this.taskType != 7) {
            window.addEventListener('keydown', this.handleKeyDown);
          }
        }
      },
      handleKeyDown(event) {
        if (event.key == 'ArrowUp') {
          if( this.gridApi.rowModel.rootNode.childrenAfterSort[this.gridApi.rowModel.rootNode.childrenAfterSort.indexOf(this.gridApi.selectionController.lastSelectedNode)-1]){
            this.gridApi.rowModel.rootNode.childrenAfterSort[this.gridApi.rowModel.rootNode.childrenAfterSort.indexOf(this.gridApi.selectionController.lastSelectedNode)-1].setSelected(true, true);
          }
        } else if (event.key == 'ArrowDown') {
          if( this.gridApi.rowModel.rootNode.childrenAfterSort[this.gridApi.rowModel.rootNode.childrenAfterSort.indexOf(this.gridApi.selectionController.lastSelectedNode)+1]){
            this.gridApi.rowModel.rootNode.childrenAfterSort[this.gridApi.rowModel.rootNode.childrenAfterSort.indexOf(this.gridApi.selectionController.lastSelectedNode)+1].setSelected(true, true);
          }
        } else if (event.key == 'F4') {
          if (this.pageTitle === "官方通知" || this.pageTitle === "递交官方") {
            let list = this.unique(
              this.getSelectedRows(),
              this.getCurFilterId(this.pageTitle)
            );
            let caseList = this.getLanglist(list.map(item => item.caseArray));
            this.multipleSelectionCaseArray = caseList || [{}]
            this.officialCommunicationState = true
            this.officialCommunicationType = 'create'
          } else {
            let info = this.unique(this.getSelectedRows(), "caseId");
            info.forEach(item => {
              delete item.insId;
            });
            this.multipleSelectionCaseArray = this.getSelectedRows()
            this.officialCommunicationState = true
            this.officialCommunicationType = 'create'
          }
        }
      },
      checkJyCase() {
        if (this.getSelectedRows().find(item => item.agentNum.includes('JY'))) {
          this.$message.error('【建议】类型案件不能新建费用或账单，请立正式案卷！')
          return false
        }
        return true
      },
      changeKeepAlive(){
        if(this.$store.state.caseInformation.preOnlyId){
          this.getCaseList({[`${this.getCurFilterId(this.pageTitle)}`]: this.$store.state.caseInformation.preOnlyId ,business: this.business}).then(res => {
            if(res.data.length) {
              let str=this.getCurFilterId(this.pageTitle)
              let obj=this.caseList.find(item => item[str] === res.data[0][str])
              let index = this.caseList.findIndex(item => item[str] === res.data[0][str])
              // let index = this.gridApi.getSelectedNodes()[0].rowIndex
              if(obj){
                for (var key in res.data[0]) {
                  if(key!='sid'){
                    this.$set(obj,key,res.data[0][key])
                  }
                }
              }
              this.columnDefs.push({})
              this.columnDefs.pop()
              this.$store.commit('caseInformation/SET_PREONLYID', '')
              this.$nextTick(()=>{
                if(index != -1){
                  //滚动
                  //部分浏览器不兼容
                  // this.gridApi.ensureIndexVisible(index, 'middle');
                  var obj = document.getElementsByClassName('ag-body-viewport')[0]
                  obj.scrollTop = this.scrollTop
                  // this.gridApi.deselectAll()
                  //选中
                  setTimeout(()=>{
                    this.changePosition()
                  }, 0)
                  // this.gridApi.rowModel.rootNode.allLeafChildren[index].setSelected(true)
                  // this.$forceUpdate()
                }
              })
            }
          })
        }
      },
      openRecord(billRecordList) {
        this.trawSheetView = true
        this.billRecordList = billRecordList
        this.openType = 'edit'
      },
      closeRecordDialog() {
        this.trawSheetView = false
        this.billRecordList = []
      },
      downManyFile(list){
        var that=this
        let index=0
        function down(item){
          that.$commonUtils.downLoadAll({url:`ipdoc${item.localFilePath}`,success(){
              index+=1
              if(index===list.length){
                return
              }
              setTimeout(()=>{
                down(list[index])
              },1000)
            }
          })
        }
        down(list[index])
      },
      choseModel(item) {
        if (!this.getSelectedRows().length) {
          this.$message.error('请选择案件！')
          return
        }
        createPOA({
          business: 4,
          caseIds: this.getSelectedRows().map(item => item.caseId),
          code: item.code
        }).then(res => {
          this.downManyFile(res.data)
        })
      },
      submitCopyAbroadBill(){
        if (this.copyForm.caseNumber == 1) { // 复制单个立卷
          copyCase({caseId: this.copyForm.rowData.caseId}).then(res => {
            this.copyForm.copyCaseView = false
            this.editFun(res.data, '__^-^__')
          })
        } else { // 复制多个立卷
          let addWaitObj = {}
          copyCase({caseId: this.copyForm.rowData.caseId, isBatch: 1}).then(res => {
            const data = {
              taskId: res.data.taskId,
              taskType: 4
            }
            queryCasesByTaskId(data).then(response => {
              let { caseType, caseTypeId, agentNum, custId, taskId } = response.data[0] || {}
              addWaitObj = {
                caseTypeName: caseType,
                caseTypeId,
                draftNumber: agentNum,
                custId,
                taskId,
                taskType: 4,
                caseNumber: this.copyForm.caseNumber - 1
              }
              addWaitObj = Object.assign(response.data[0], addWaitObj)
              delete addWaitObj.caseId
              delete addWaitObj.createDate
              const filteredEntries = Object.entries(addWaitObj).filter(([key, value]) => value !== null && value !== undefined && value !== '');
              const obj = Object.fromEntries(filteredEntries)
              addWaitCases(obj).then(_ => {
                if (_.success) {
                  this.copyForm.copyCaseView = false
                  this.$router.replace({path:'massfiling',query:{taskId: res.data.taskId, taskType: 4}})
                }
              })
            })
          })
        }
      },
      getCurrentRowsData(key){
        if (this.gridApi && this.gridApi.rowModel) {
          return this.gridApi.rowModel.rootNode.childrenAfterSort.map(item => item.data).map(item => item[key])
        }
        return []
      },
      closeRelevantDialog(){
        this.relevantView = false
        this.relCaseId = ''
      },
      deletecCases(){
        if(this.pageTitle == '案件管理'){
          if(this.$store.getters.permissions.includes(205) || this.$store.getters.permissions.includes(206) || this.$store.getters.permissions.includes(250)){
            if(this.$store.getters.permissions.includes(205) && !this.$store.getters.permissions.includes(206)){
              if(this.getSelectedSortRows().find(item => item.isSubmitOfficial === 1)){
                this.$message.error('无法批量删除所选案件！')
                return;
              }
            }
            if(this.$store.getters.permissions.includes(206) && !this.$store.getters.permissions.includes(205)) {
              if(this.getSelectedSortRows().find(item => item.isSubmitOfficial === 0)){
                this.$message.error('无法批量删除所选案件！')
                return;
              }
            }
          }else{
            this.$message.error('无法批量删除所选案件！')
            return;
          }
        }
        this.$confirm("此操作将永久删除, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(()=>{
          deleteCase({caseIds: this.getSelectedRows().map(i => i.caseId), taskType: this.taskType})
          .then(res => {
            if (res.success) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });

              this.queryCaseList();
            }
          })
          .catch(err => {
            this.$alert(`<p>${err.message}<p>`, "删除提示", {
              dangerouslyUseHTMLString: true
            });
          });
        })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });

      },
      auditOfficalDoc(){
        // let list = this.unique(
        //   this.getSelectedRows(),
        //   this.getCurFilterId(this.pageTitle)
        // );
        // let caseList = this.getLanglist(list.map(item => item.caseArray));
        // let caseIds = caseList.map(item => item.caseId);
        // const data = {
        //   userId: this.$store.getters.userId,
        //   caseIds: caseIds,
        //   insIdList: this.getSelectedRows().map(item => item.tmFileId),
        //   result: 1
        // };
        // auditOfficalDoc(data).then(res => {
        //   this.examineDialog = false
        //   this.queryCaseList();
        // });
      },
      closeDialog() {
        this.fileDownLoadView = false
        this.$refs.filedown.clearData()
      },
      closeCpcEnterView(f){
        if(f == 'update') {
          // this.queryCaseList()
        }
        this.cpcEnterView = false
      },
      deleteList() {
        this.$confirm("此操作将永久删除, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          const selectedNodes = this.gridApi.getSelectedNodes();
          const selectedData = selectedNodes.map(node => node.data);
          deleteDoc({
            docList: selectedData.map(item => ({tmFileId: item.tmFileId || item.ptOfficialId})),
            taskType: this.taskType
          }).then(res => {
            if (res.success) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.queryCaseList()
            }
          });
        })

      },
      cpcEnter() {
        this.cpcEnterView = true
        setTimeout(() => {
          // console.log(this.$refs.cpcenter)
          this.$refs['cpcenter'].queryUnloadedDocFromCPC()
        }, 0)

        // this.$refs['cpcenter'].queryUnloadedDocFromCPC()
      },
      recognizedError() {
        if (!this.getSelectedRows().length) {
          return;
        }
        this.$confirm("确认识别错误?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          console.log(this.getSelectedRows())
          if (this.getSelectedRows().filter(i => i.tmFileId || i.ptOfficialId).length == 0) return
          recognizedError({
            tmFileIds: this.getSelectedRows().map(item => item.tmFileId || item.ptOfficialId).join(","),
            business: this.business
          }).then(res => {
            this.getManualRecognitionOfficialInfoCount()
            this.selectionState = false
            this.queryCaseList();
          });
        })

      },
      getManualRecognitionOfficialInfoCount() {
        getManualRecognitionOfficialInfoCount({business: 41}).then(res => {
          this.officialInfoCount = res.data.count;
          this.officialInfoCounData = res.data
        });
      },
      toExamine() {
        this.requireList = []
        this.otherSelect = false
        this.exportListState = false
        this.multipleTypeText = "审核";
        this.jumpDetailSubmisson()
      },
      auditingClick() {
        this.title = '递交 / 审核'
        let list = this.unique(
          this.getSelectedRows(),
          this.getCurFilterId(this.pageTitle)
        );
        let caseList = this.getLanglist(list.map(item => item.caseArray))
        this.multipleSelectionCaseArray = caseList || [{}]
        if(caseList.length == 1){
          if (this.getSelectedRows()[0].submitStatusStr === '待递交') {
            return this.$message.error('案件还未递交，递交后才能审核!')
          }
          this.submissionState = true
          // this.submissionType='create'
          this.submissionType = 'edit'
          this.isAuditing = true
        }else{
          // const data = {
          //   userId: this.$store.getters.userId,
          //   caseIds: [
          //     ...new Set(this.getSelectedRows().map(item => item.caseId))
          //   ],
          //   insIdList: this.getSelectedRows().map(item => item.insId),
          //   result: 1,
          //   taskType: this.taskType
          // };
          // submitOfficalAudit(data).then(res => {
          //   if (res.success) {
          //     this.$message.success('审核成功!')
          //     this.queryCaseList();
          //   }
          // });
          this.$message.error('请选择一条数据进行审核!')
        }

      },
      changeDoc() {
        this.title = '递交 / 制作'
        let list = this.unique(
          this.getSelectedRows(),
          this.getCurFilterId(this.pageTitle)
        );
        let caseList = this.getLanglist(list.map(item => item.caseArray))
        this.multipleSelectionCaseArray = caseList || [{}]
        this.submissionState = true
        // this.submissionType='create'
        this.submissionType = 'edit'
        this.isChangeDoc = true
      },
      rightDrag() {
        let that = this
        // document.getElementById('searchWrap').onscroll=function (e) {
        //   that.clearWrapTop = e.target.scrollTop+ e.target.offsetHeight
        //   document.getElementById('clearWrap').style.top = that.clearWrapTop -40 + 'px'
        // }

        // if(document.querySelector('.dragin-resize')){ // 任务6235专利官方通知无法拖拽问题注释此处
        //   return
        // }
          document.querySelector(".left_wrap")&&new this.$DraginResize(document.querySelector(".left_wrap"), {
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
          })

      },
      init(flag) {
        // Bus.$on('keyboardEvents', context => {
          // if(!this.selectionState){
          //   if(context==40){
          //     if( this.gridApi.rowModel.rootNode.childrenAfterSort[this.gridApi.rowModel.rootNode.childrenAfterSort.indexOf(this.gridApi.selectionController.lastSelectedNode)+1]){
          //       this.gridApi.rowModel.rootNode.childrenAfterSort[this.gridApi.rowModel.rootNode.childrenAfterSort.indexOf(this.gridApi.selectionController.lastSelectedNode)+1].setSelected(true, true);
          //     }
          //   }
          //   if(context==38){
          //     if( this.gridApi.rowModel.rootNode.childrenAfterSort[this.gridApi.rowModel.rootNode.childrenAfterSort.indexOf(this.gridApi.selectionController.lastSelectedNode)-1]){
          //       this.gridApi.rowModel.rootNode.childrenAfterSort[this.gridApi.rowModel.rootNode.childrenAfterSort.indexOf(this.gridApi.selectionController.lastSelectedNode)-1].setSelected(true, true);
          //     }
          //   }
          // }
          // switch (context) {
          //   case 112: this.$store.getters.permissions.includes(180)?this.handleSelect('1-1-1' ):'';break;
          //   case 113:this.$store.getters.permissions.includes(181)?this.handleSelect('1-1-2' ):'';break;
          //   case 114:this.$store.getters.permissions.includes(182)?this.handleSelect('1-2-1' ):''; break;
          //   case 115:this.$store.getters.permissions.includes(183)?this.handleSelect('1-2-2' ):''; break;
          
          //   case 117: this.handleSelect('1-2-2-2');break;
          //   case 118: this.handleSelect('1-2-3');break;
          //   case 119: this.handleSelect('1-2-4');break;
          //   case 120: this.handleSelect('1-2-5');break;
          //   case 121: this.handleSelect('1-2-6');break;
          //   case 122:this.$store.getters.permissions.includes(190)? this.handleSelect('1-3-1' ):'';break;
          //   case 123:this.$store.getters.permissions.includes(191)? this.handleSelect('1-3-2' ):'';break;
          //   default:return
          // }
        // })
        // localStorage.setItem('field','4')
        this.$store.commit('caseInformation/SET_BUSSID', this.bussId)
        if (this.pageTitle === "官方通知") {
          this.getManualRecognitionOfficialInfoCount();
        }
        if (this.$route.query.instructionSubmitStatus) {
          this.$set(this.queryModuleData, "instructionSubmitStatus", Number(this.$route.query.instructionSubmitStatus));
          this.queryCaseList();
        } else {
          this.queryFilterConfig(1);
        }
        flag&&this.getAllWfs();
        // if(this.pageTitle=='递交官方'){
        //   this.changeKeepAlive()
        // }
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
      rowSelected(params){
        console.log('选中事件！！');
        if(this.preDocState){
          if(params.node.selected){
            this.pdfData=[]
            this.$nextTick(()=>{
              console.log(params.node.data,'params.node.data');
              if(params.node.data.fileAddressList){
                this.pdfData = params.node.data.fileAddressList.filter(itm=>['pdf','jpg','png'].some(item=>itm.replace(/.+\./,"").toLocaleLowerCase()==item))
                if(this.pdfData.length==0){
                  this.preDocState=false
                }
              }
            })
          }
        }
        if(!this.selectionState){
          this.rowClicked(params)
        }
      },
      rowClicked(param) {

        if (param.node.selected) {
          if (param.data[this.getCurFilterId(this.pageTitle)] != this.currentId) {
            this.currentId = ''
            this.currentCaseId = ''
            this.$nextTick(() => {
              this.currentId = param.data[this.getCurFilterId(this.pageTitle)]
              this.currentCaseId = param.data.caseId
              this.caseTypeId = param.data.caseTypeId
              this.judgeRank = param.data.judgeRank
            })
          }
        }
      },
      refreshEvenRowsCurrencyData(params) {
        this.currentPageSize = params.api.rowModel.rootNode.allChildrenCount
        this.gridApi.rowModel.rootNode.childrenAfterFilter&&this.gridApi.rowModel.rootNode.childrenAfterFilter.length&&this.gridApi.rowModel.rootNode.childrenAfterFilter.forEach(rowNode => {
          setTimeout(() => {
            rowNode.setDataValue(
            'sid',
            rowNode.rowIndex + 1)
          }, 0)
        });
        // if (!params.columnApi.columnController.groupAutoColumns) {
        //   this.gridApi.forEachNode(rowNode => {
        //     rowNode.setDataValue(
        //       'sid',
        //       rowNode.rowIndex + 1)
        //   });
        // }
        // if(this.caseList.length){
        //   this.$commonUtils.saveFilterModel(this.$options.name+this.$route.name,'FilterModel',this.gridApi.getFilterModel())
        // }
        if (this.caseList.length) {
          if (params.type == "filterChanged") {
            let obj = this.gridApi.getFilterModel()
            for (let k in obj) {
              if (obj.hasOwnProperty(k)) {
                if(obj[k].values && !obj[k].values.length){
                  delete obj[k]
                }
              }
            }
            Object.keys(obj).length && this.$commonUtils.saveFilterModel(this.$options.name+this.$route.name,'FilterModel', this.gridApi.getFilterModel())
            // this.$commonUtils.saveFilterModel(this.$options.name + this.$route.name, 'FilterModel', this.gridApi.getFilterModel())
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
      updateWkg() {
        const data = this.$refs.CaseInvestigators.caseDetailFoemData
        const custMembers = data.trademarkCaseCustWorkgroups[0].trademarkCaseWorkgroupMembers || []
        const contractorMembers = data.trademarkCaseCBWorkgroups[0].trademarkCaseWorkgroupMembers || []
        const hasCustOne = custMembers.some(item => item.caseRoleName === '客户律师一')
        const hasContractorOne = contractorMembers.some(item => item.caseRoleName === '承办律师一')
        
        if (!hasCustOne) {
          return this.$message.error('选择客户律师一')
        }
        if (!hasContractorOne) {
          return this.$message.error('请选择承办律师一')
        }

        updateWkg(Object.assign(this.$refs.CaseInvestigators.caseDetailFoemData, {caseIds: this.getSelectedRows().map(item => item.caseId)})).then(res => {
          this.queryCaseList()
          this.updateWkgState = false
          this.selectionState = false
        })
      },
      selectionChanged(params, n) {

      },
      cellRenderer(params) {
        if (params.colDef.field == 'imageFile') {
          return `<img class="filterTableTmg"  src="/ipdoc${params.value}" alt="">`
        }
        if (params.colDef.field == 'sampleAddress') {
          return `<img class="filterTableTmg"  src="/ipdoc${params.value}" alt="">`
        }
        if (params.colDef.field == 'isLackMaterial') {
          if (params.value == '是') {
            return `<label role="checkbox" class="el-checkbox is-checked" aria-checked="true"><span aria-checked="mixed" class="el-checkbox__input is-checked"><span class="el-checkbox__inner"></span><input type="checkbox" aria-hidden="true" class="el-checkbox__original" value=""></span></label>`
          } else {
            return `<label role="checkbox" class="el-checkbox" aria-checked="true"><span aria-checked="mixed" class="el-checkbox__input"><span class="el-checkbox__inner"></span><input type="checkbox" aria-hidden="true" class="el-checkbox__original" value=""></span></label>`
          }
        }
        if (params.colDef.field == 'agentNum') {
          var eDiv = document.createElement('div');
          eDiv.innerHTML = `<span class="btn-simple" title="${params.value}">${params.value ? params.value : ''}</span>`
          var eButton = eDiv.querySelectorAll('.btn-simple')[0];

          eButton.addEventListener('click', () => {
            if (!this.pattern) {
              this.takeCaseDetail(params.data)
            }
          });

          return eDiv;
        }
        if (params.colDef.field == 'sid') {
          return params.rowIndex + 1
        }
        return `<span title="${params.value}">${params.value ? params.value : ''}</span>`
      },
      getCaseRow(row, flag) {
        flag = flag == '__^-^__' ? true : false
        if (row.pageId === 100 || flag) {
          this.$router.push('/workbench/case/case_detail/' + row.caseId + '/' + row.caseType + '?pageId=100&taskType=' + this.taskType + '&copy='+flag + '&agentNum=' + row.agentNum)
        } else {
          this.$router.push('/workbench/case/case_detail/' + row.caseId + '/' + row.caseType + '?taskType=' + this.taskType + '&copy='+flag + '&agentNum=' + row.agentNum)
        }
      },
      rowDoubleClicked(params) {
        var row = params.data
        if (this.pageTitle !== '案件管理') {
          this.getViewRow(row)
        } else {
          this.takeCaseDetail(row)
        }
      },
      // changeSelection(n){
      //   if(n){
      //     this.columnDefs.find(item=>item.field=='sid').checkboxSelection=function(params) {
      //       // we put checkbox on the name if we are not doing grouping
      //       return params.columnApi.getRowGroupColumns().length === 0;
      //     },
      //       this.columnDefs.find(item=>item.field=='sid').headerCheckboxSelection= function(params) {
      //         // we put checkbox on the name if we are not doing grouping
      //         return params.columnApi.getRowGroupColumns().length === 0;
      //       }
      //     this.columnDefs.push({})
      //     this.columnDefs.pop({})
      //   }else {
      //     this.columnDefs.find(item=>item.field=='sid').checkboxSelection=false
      //     this.columnDefs.find(item=>item.field=='sid').headerCheckboxSelection=false
      //     this.columnDefs.push({})
      //     this.columnDefs.pop({})
      //   }
      // },
      getSelectedRows() {
        if (this.gridApi) {
          const selectedNodes = this.gridApi.getSelectedNodes();
          const selectedData = selectedNodes.map(node => node.data);
          return selectedData
        }

      },
      onGridReady(params) {
        this.gridApi = params.api;
        this.columnApi = params.columnApi;
        this.init(1)
      },
      dragStopped(params) {
        let tableHeader = params.columnApi.columnController.gridColumns.map(item => ({
          label: item.colDef.headerName,
          width: item.actualWidth,
          prop: item.colDef.field,
        })).filter(item => item.prop != "group" && item.prop != "operation")
        var arr = JSON.parse(localStorage.getItem('tableHeader'))
        arr.find(item => item.name == this.$route.name).tableHeader = tableHeader
        localStorage.setItem('tableHeader', JSON.stringify(arr))
        this.changeHeader(tableHeader)
        // console.log(a);
      },

      getContextMenuItems(params) {
        if (!params.node.data) {
          return []
        }
        return this.getRowContextmenuList(params.node.data).map(item => ({
          name: item.name,
          action: () => {
            this[item.action](params.node.data, params.value)
          },
        }))
      },
      editableTab(data) {
        if (data && data != 0) {
          this.myTabsActivity = true
        } else {
          this.myTabsActivity = false
        }
      },
      changeMultiple(text) {
        // this.multipleTypeText = text
      },
      clickoutside() {
        this.drawerState = false
      },
      // closeCurrentRow(){
      //   this.currentCaseId=''
      //   this.currentId=''
      // },


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
            // this.tableState=false
            // this.$nextTick(()=>{
            //   //  this.tableState=true
            //   this.caseList.push({})
            //   this.caseList.pop()
            // })
          });
        }
        // this.selectColumnList=
        // console.log(this.selectColumnList);
        // this.savePreference(1)
      },
      saveInfo(row) {
        const data = {
          custId: row.custId,
          userId: this.$store.getters.userId,
          caseIds: row.caseId,
          materialTypeId: row.materialTypeId,
          insIdList: row.insId,
          remarks: row.djRemarks
        }
        submitOfficalModify(data).then(res => {
          this.$set(row, 'modifyState', false)
        })
      },
      cellDblclick(row, column, cell, event) {

        if (this.pageTitle !== '案件管理') {
          this.getViewRow(row)
        } else {
          this.takeCaseDetail(row)
        }
      },
      // 生成模板
      generateTemplate(){
        let caseIdList = this.gridApi.getSelectedNodes().map(node => node.data);
        if (caseIdList.length > 0) {
          protectionCaseTemplateGeneration({caseId: caseIdList[0].caseId}).then(res => {
            this.downLoad(res.data)
          })
        }else{
          this.$message({
            message: '请选择要导出的数据',
            type: 'warning'
          });
        }
      },
      // 导出zip
      generateTemplateZip(){
        let caseIdList = this.gridApi.getSelectedNodes().map(node => node.data);
        if (caseIdList.length > 0) {
          downloadEvidenceMaterialzipPackage({caseId: caseIdList[0].caseId}).then(res => {
            this.downLoad(res.data)
          })
        }else{
          this.$message({
            message: '请选择要导出的数据',
            type: 'warning'
          });
        }
      },
      // 附件下载
      downLoad(data) {
        const url = data
        const downData = {
          url: `ipdoc${url}`,
          success() {
            // notify.close()
          }
        }
        this.$commonUtils.downLoadAll(downData)
      },

      closeSelect(f) {
        this.isAuditing = false
        this.isChangeDoc = false
        this.timeLimitState = false
        this.selectionState = false
        this.selectionOptionState = false
        this.uploadState = false
        this.ManualIdentificationState = false
        this.submissionState = false
        this.officialCommunicationState = false
        this.uploadType = ''
        this.uploadProofreadingState=false
        if (f && this.pageTitle == '官方通知') {
          this.queryCaseList()
        }
         // this.$emit('closeModel')
        // this.changeKeepAlive()
      },
      checkBox(e, property, values) {
        if (this.queryModuleData[property].includes('') && this.queryModuleData[property].filter(item => item).length != values.filter(item => item).length) {
          this.queryModuleData[property] = this.queryModuleData[property].filter(item => item)
        }
        if (e[e.length - 1] == '') {
          this.queryModuleData[property] = values.map(item => item.id)
        }
      },
      newlovingVue1(value, property) {
        property.split(',').forEach((item, index) => {
          this.queryModuleData[item] = value[index]
        })
      },
      takeCaseDetail(row) {
        this.closeSelect()
        if (this.pageTitle === "官方通知") {
          getCaseByTmFileId({tmFileId: row.tmFileId}).then(res => {
            if (res.data.length > 1) {
              this.selectCaseList = res.data;
              this.selectCaseVisible = true;
            } else {
              this.$router.push("/workbench/case/seeCaseDetail/" + row.caseId + '?taskType=' + this.taskType);
              this.selectCaseVisible = false;
            }
          });
        } else {
          this.$router.push("/workbench/case/seeCaseDetail/" + row.caseId + '?taskType=' + this.taskType);
        }
      },
      closeTable(bool) {
        this.showTable = bool;
        this.selectionState = false
        this.queryCaseList();
      },
      pdfPre({address}) {
        downLoadAll({url: "ipdoc" + address, target: "_blank"});
        // this.pdfData = addressList
        //   .filter(item => /\.pdf$/i.test(item))
        //   .map(item => ({ url: "ipdoc" + item }));
        // if (this.pdfData.length) {
        //   this.pdfDataState = true;
        // }
      },
      takeManualIdentification() {
        this.ManualIdentificationState = true;
      },
      getSelectedSortRows() {
        if (this.gridApi) {
          const selectedNodes = this.gridApi.getSelectedNodes();
          // const selectedData = selectedNodes.map(node => node.data);
          return this.gridApi.rowModel.rootNode.childrenAfterSort.filter(item=>selectedNodes.includes(item)).map(node=>node.data)
        } else {
          return []
        }
      },
      enentDrop(e){
      e.stopPropagation();
      e.preventDefault();
      this.hoverState=false
      this.curFile = e.dataTransfer.files
      if(this.pageTitle=='官方通知'){
        this.multipleTypeText = "文件上传";
        if(!this.getSelectedSortRows().length){
          this.$message.error('请选择需要匹配的案件')
          return;
        }
        if(this.curFile.length!=this.getSelectedSortRows().length){
          this.$message.error('文件和案件数量需要相同')
          return
        }
        this.uploadProofreadingState=true
      }
    },
      handleSelect(key, requireList, multipleTypeTextDisabled) {
        this.patentOneMaterial = false
        this.requireList = []
        this.uploadType = ''
        this.multipleTypeText = ''
        if (requireList) {
          this.requireList = requireList
        }
        if (key === "1-2-1") {
          this.multipleTypeText = "递交";
        }
        if (key === "1-2-2") {
          this.multipleTypeText = "官方通知";
        }
        if (key === "1-1-1") {

          this.multipleTypeText = "新建账单";

        }
        if (key === "1-1-2") {
          this.multipleTypeText = "新建内部账单";
        }

        if (key === "1-1-3") {
          this.multipleTypeText = "新建费用";
        }
        if (key === "1-1-4") {
          this.multipleTypeText = "新建境外账单";
        }
        if (key === "1-3-1") {
          this.multipleTypeText = "新建官方时限";
          // this.queryCaseList();
        }
        if (key === "1-3-2") {
          this.multipleTypeText = "新建内部时限";
          // this.queryCaseList();
        }
        if (key === "1-2-2-2") {
          this.multipleTypeText = "递交官方(文件)";
          this.uploadType = "递交官方";

          // this.queryCaseList();
        }
        if (key === "1-2-2-3") {
          this.multipleTypeText = "cpc递交文件";
          this.uploadType = "递交官方";
          this.patentOneMaterial = true

          // this.queryCaseList();
        }
        if (key === "1-2-3") {
          this.multipleTypeText = "客户往来";
          this.uploadType = "客户往来";
          // this.queryCaseList();
        }
        if (key === "1-2-3-1") {
          this.multipleTypeText = "客户指示";
          this.uploadType = "客户指示";
          // this.queryCaseList();
        }
        if (key === "1-2-3-2") {
          this.multipleTypeText = "致函客户";
          this.uploadType = "致函客户";
          // this.queryCaseList();
        }
        if (key === "1-2-4") {
          this.multipleTypeText = "内部往来";
          this.uploadType = "内部往来";
          // this.queryCaseList();
        }
        if (key === "1-2-5") {
          this.multipleTypeText = "外代所往来";
          this.uploadType = "外代所往来";
          // this.queryCaseList();
        }
        if (key === "1-2-5-1") {
          this.multipleTypeText = "外代所来函";
          this.uploadType = "外方代理来函";
          // this.queryCaseList();
        }
        if (key === "1-2-5-2") {
          this.multipleTypeText = "致函外代所";
          this.uploadType = "致函外方代理";
          // this.queryCaseList();
        }
        if (key === "1-2-6") {
          this.multipleTypeText = "对方当事人往来";
          this.uploadType = "对方当事人往来";
          // this.queryCaseList();
        }
        if (key === "1-2-7") {
          this.multipleTypeText = "特批预立卷审批";
          this.uploadType = "特批预立卷审批";
          // this.queryCaseList();
        }
        if (key === "批量操作") {
          this.multipleTypeText = "批量操作";
          // this.queryCaseList();
        }
        if (key === "文件下载") {
          this.multipleTypeText = "文件下载";
        }
        if (key === "变更办案人") {
          this.multipleTypeText = "变更办案人";
        }
        if (key === "1-2") {
          this.multipleTypeText = "报官清单";
        }
        if (key === "1-3") {
          this.multipleTypeText = "批量报官清单";
        }
        if (key === "1-4") {
          this.multipleTypeText = "工时";
        }
        if (key === "1-5") {

          this.multipleTypeText = "任务";
        }
        if (key === "文件上传排序") {
          this.multipleTypeText = "文件上传";
          this.multipleTypeTextDisabled = true
          // this.queryModuleData.isTmfileIdOrder=1
          this.queryCaseList({isTmfileIdOrder: 1})
          return
        }
        if (key === "文件上传") {
          this.multipleTypeText = "文件上传";
        }
        if (multipleTypeTextDisabled) {
          if (!this.getSelectedSortRows().length) {
            this.$message.error('请选择需要匹配的案件')
            return;
          }
          if (this.curFile.length != this.getSelectedSortRows().length) {
            this.$message.error('文件和案件数量需要相同')
            return
          }
          this.uploadProofreadingState = true
          return;
        }
        if (key === "1-4") {

          this.multipleTypeText = "工时";
        }
        if (key === "1-5") {

          this.multipleTypeText = "任务";
        }
        if (key === "立卷") {
          // this.selectionState = true;
          // this.multipleTypeText = "立卷";
          if (this.getSelectedRows().length > 1) {
            this.$message.error('只能选择一个案件！')
          } else if (this.getSelectedRows().length == 1) {
            if (this.getSelectedRows()[0].caseType == '建议') {
              sessionStorage.setItem('suggestRowData', JSON.stringify(this.getSelectedRows()[0]))
              this.$router.push({
                path: 'registration', query: {
                  // data:this.getSelectedRows()[0]
                  caseId: this.getSelectedRows()[0].caseId,
                  custName: this.getSelectedRows()[0].custName,
                  custLevel: this.getSelectedRows()[0].custLevel,
                  custId: this.getSelectedRows()[0].custId,
                  caseTypeId: this.getSelectedRows()[0].caseTypeId
                }
              })
              // this.selectionState = false
            } else {
              this.$message.warning('仅支持建议类型案件立卷')
            }

          } else {
            this.$message.warning('请选择案件！')
          }
          // queryCaseWork({caseId:this.getSelectedRows()[0].caseId}).then(res=>{
          //   // this.updateWkgData= res.data
          //   this.updateWkgData={...{caseTypeId:this.getSelectedRows()[0].caseTypeId,trademarkCaseCustWorkgroups:[{ wkgId: "" }],trademarkCaseCBWorkgroups:[],trademarkCaseLCWorkgroups:[{groupName:''}]},...res.data}
          //
          //   this.updateWkgState = true;
          // })

        }
        this.jumpDetailSubmisson(key)
      },
      exportList(flag) {
        this.exportType = flag
        this.selectionOptionState = true
      },
      getLanglist(array) {
        let arr = [];
        array.forEach(item => {
          arr.push(...item);
        });
        return arr;
      },
      jumpDetailSubmisson() {
        if (!this.getSelectedRows().length) {
          this.$message.error("请先选择！");
          return;
        }
        if (this.multipleTypeText === "立卷") {
          if (this.getSelectedRows().length > 1) {
            this.$message.error('只能选择一个案件！')
          } else if (this.getSelectedRows().length == 1) {
            if (this.getSelectedRows()[0].caseType == '建议') {
              this.$router.push({name: 'registration', query: this.getSelectedRows()[0]})
            } else {
              this.$message.warning('仅支持建议类型案件立卷')
            }

          } else {
            this.$message.warning('请选择案件！')
          }
        }
        if (this.multipleTypeText === "审核") {
          let list = this.unique(
          this.getSelectedRows(),
          this.getCurFilterId(this.pageTitle)
        );
        let caseList = this.getLanglist(list.map(item => item.caseArray))
        this.multipleSelectionCaseArray = caseList || [{}]
        // if(caseList.length == 1){
          // this.multipleSelectionCaseArray = caseList

          // this.officialCommunicationState = true
          // this.officialCommunicationType = 'audit'


        // }else{
          const data = {
            userId: this.$store.getters.userId,
            caseIds: caseList.map(item => item.caseId),
            insIdList: caseList.map(item => item.insId),
            taskType: this.taskType,
            result: 1,
          }
          auditOfficalDoc(data).then(res => {
            this.$message.success(res.message)
            this.queryCaseList()
          })
        // }
          // queryTrademarkCaseOfficial({insIdList: this.getSelectedRows().map(item => item.tmFileId || item.ptOfficialId)}).then(res => {
          //   this.examineDialog = true
          //   this.examineData = res.data
          // })
        }
        if (this.multipleTypeText === "文件下载") {
          this.fileDownLoadView = true;
        }

        if (this.multipleTypeText === "工时") {
          if (this.getSelectedRows().length > 1) {
            this.$message.error('只能选择一个案件创建工时')
            return;
          }
          {
            // this.$refs.handTime.isShow = true
            this.workHourView = true
            this.caseData = [
              ...new Set(this.getSelectedRows())
            ][0]
          }

        }
        if (this.multipleTypeText === "任务") {
          if (this.getSelectedRows().length > 1) {
            this.$message.error('只能选择一个案件创建任务')
            return;
          }
          {
            this.caseData = [
              ...new Set(this.getSelectedRows())
            ][0]
            this.taskView = true
          }
        }

        if (this.getSelectedRows().length && this.multipleTypeText === "递交") {
          if(this.taskType == 4 && this.getSelectedRows().length > 1){
              this.$message.error('只能选择一条数据!')
              return
            }
          this.title = '递交 / 新建'
          if (this.pageTitle === "官方通知" || this.pageTitle === "递交官方") {
            let list = this.unique(
              this.getSelectedRows(),
              this.getCurFilterId(this.pageTitle)
            );
            let caseList = this.getLanglist(list.map(item => item.caseArray))
            this.multipleSelectionCaseArray = caseList || [{}]
            this.submissionState = true
            this.submissionType = 'create'
            // this.$router.push({
            //   path: "/workbench/case/detailSubmission",
            //   query: { caseIds: caseIds, pageType: "1" }
            // });
          } else {
            this.multipleSelectionCaseArray = this.getSelectedRows()
            this.submissionState = true
            // this.submissionData =
            this.submissionType = 'create'
          }
        }
        if (this.getSelectedRows().length && this.multipleTypeText === "变更办案人") {
          queryCaseWork({caseId: this.getSelectedRows()[0].caseId}).then(res => {
            // this.updateWkgData= res.data
            this.updateWkgData = {
              ...{
                caseTypeId: this.getSelectedRows()[0].caseTypeId,
                trademarkCaseCustWorkgroups: [{wkgId: ""}],
                trademarkCaseCBWorkgroups: [],
                trademarkCaseLCWorkgroups: [{groupName: ''}]
              }, ...res.data,
              custId:this.getSelectedRows()[0].custId,
              caseId:this.getSelectedRows()[0].caseId,
              caseTypeId:this.getSelectedRows()[0].caseTypeId,
              appFromto:this.getSelectedRows()[0].appFromto,
            }

            this.updateWkgState = true;
          })

        }
        //立卷
        if (this.multipleTypeText === "立卷") {
          if (this.getSelectedRows().length > 1) {
            this.$message.error('只能选择一个案件！')
          } else if (this.getSelectedRows().length == 1) {
            if (this.getSelectedRows()[0].caseType == '建议') {
              sessionStorage.setItem('suggestRowData', JSON.stringify(this.getSelectedRows()[0]))
              this.$router.push({
                path: 'registration', query: {
                  // data:this.getSelectedRows()[0]
                  caseId: this.getSelectedRows()[0].caseId,
                  custName: this.getSelectedRows()[0].custName,
                  custLevel: this.getSelectedRows()[0].custLevel,
                  custId: this.getSelectedRows()[0].custId,
                  caseTypeId: this.getSelectedRows()[0].caseTypeId
                }
              })
              this.selectionState = false
            } else {
              this.$message.warning('仅支持建议类型案件立卷')
            }

          } else {
            this.$message.warning('请选择案件！')
          }

        }
        if (this.getSelectedRows().length && this.multipleTypeText === "官方通知") {
          // if(this.taskType == 4 && this.getSelectedRows().length > 1){
          //     this.$message.error('只能选择一条数据!')
          //     return
          //   }
          if (this.pageTitle === "官方通知" || this.pageTitle === "递交官方") {
            let list = this.unique(
              this.getSelectedRows(),
              this.getCurFilterId(this.pageTitle)
            );
            let caseList = this.getLanglist(list.map(item => item.caseArray));
            // let caseIds = caseList.map(item => item.caseId);
            this.multipleSelectionCaseArray = caseList || [{}]
            this.officialCommunicationState = true
            this.officialCommunicationType = 'create'
          } else {
            let info = this.unique(this.getSelectedRows(), "caseId");
            info.forEach(item => {
              delete item.insId;
            });
            this.multipleSelectionCaseArray = this.getSelectedRows()
            this.officialCommunicationState = true
            this.officialCommunicationType = 'create'
          }
        }
        if (
          this.getSelectedRows().length &&
          this.multipleTypeText === "新建账单"
        ) {
          if (!this.checkJyCase())return; // 检查是否存在建议案件，建议案件无法新建费用账单
          if (this.pageTitle !== "案件管理") {
            let list = this.unique(
              this.getSelectedRows(),
              this.getCurFilterId(this.pageTitle)
            );
            let caseIds = this.getLanglist(list.map(item => item.caseArray)).map(
              item => item.caseId
            );
            this.$router.push({
              path: "/workbench/finance/off_bill/bill",
              query: {caseIdList: caseIds}
            });
          } else {
            this.$router.push({
              path: "/workbench/finance/off_bill/bill",
              query: {
                caseIdList: [
                  ...new Set(this.getSelectedRows().map(item => item.caseId))
                ]
              }
            });
          }
          this.selectionState = false
        }
        if (
          this.getSelectedRows().length &&
          this.multipleTypeText === "新建内部账单"
        ) {
          if (!this.checkJyCase())return;
          if (this.pageTitle !== "案件管理") {
            let list = this.unique(
              this.getSelectedRows(),
              this.getCurFilterId(this.pageTitle)
            );
            let caseIds = this.getLanglist(list.map(item => item.caseArray)).map(
              item => item.caseId
            );
            this.$router.push({
              path: "/workbench/finance/off_bill/bill",
              query: {caseIdList: caseIds}
            });
          } else {
            this.$router.push({
              path: "/workbench/finance/off_bill/insideBill",
              query: {
                caseIdList: [
                  ...new Set(this.getSelectedRows().map(item => item.caseId))
                ]
              }
            });
          }
          this.selectionState = false
        }
        if (
          this.getSelectedRows().length &&
          this.multipleTypeText === "新建官方时限"
        ) {
          if (this.pageTitle !== "案件管理") {
            let list = this.unique(
              this.getSelectedRows(),
              this.getCurFilterId(this.pageTitle)
            );
            let agentNums = this.getLanglist(list.map(item => item.caseArray))
              .map(item => item.agentNum)
              .join(",");
            this.timeLimitData = {
              agentNums: agentNums, kind: 1
            }
            this.timeLimitState = true
          } else {
            this.timeLimitData = {
              agentNums: [
                ...new Set(this.getSelectedRows().map(item => item.agentNum))
              ].join(","),
              kind: 1
            }
            this.timeLimitState = true
          }
          this.selectionState = false
        }
        if (
          this.getSelectedRows().length &&
          this.multipleTypeText === "新建内部时限"
        ) {
          if (this.pageTitle !== "案件管理") {
            let list = this.unique(
              this.getSelectedRows(),
              this.getCurFilterId(this.pageTitle)
            );
            let agentNums = this.getLanglist(list.map(item => item.caseArray))
              .map(item => item.agentNum)
              .join(",");
            this.timeLimitData = {
              agentNums: agentNums, kind: 2
            }
            this.timeLimitState = true
          } else {
            this.timeLimitData = {
              agentNums: [
                ...new Set(this.getSelectedRows().map(item => item.agentNum))
              ].join(","),
              kind: 2
            }
            this.timeLimitState = true
          }
          this.selectionState = false
        }
        if (
          this.getSelectedRows().length &&
          this.multipleTypeText === "新建费用"
        ) {
          if (!this.checkJyCase())return;
          if (this.pageTitle !== "案件管理") {
            let list = this.unique(
              this.getSelectedRows(),
              this.getCurFilterId(this.pageTitle)
            );
            let agentNums = this.getLanglist(list.map(item => item.caseArray))
              .map(item => item.agentNum)
              .join(",");

            this.$router.push({
              path: "/workbench/finance/addFeeDetail/1",
              query: {agentNums: agentNums, kind: 2}
            });
          } else {
            this.$router.push({
              path: "/workbench/finance/addFeeDetail/1",
              query: {
                agentNums: [
                  ...new Set(this.getSelectedRows().map(item => item.agentNum))
                ].join(","),
                kind: 2
              }
            });
          }
          this.selectionState = false
        }
        if (this.multipleTypeText === "新建境外账单") {
          if (!this.checkJyCase())return;
          if (this.pageTitle !== "案件管理") {
            let list = this.unique(
              this.getSelectedRows(),
              this.getCurFilterId(this.pageTitle)
            );
            let agentNums = this.getLanglist(list.map(item => item.caseArray))
              .map(item => item.agentNum)
              .join(",");

            this.$router.push({
              path: "/workbench/finance/addOverseasBill/1",
              query: {agentNums: agentNums}
            });
          } else {
            this.$router.push({
              path: "/workbench/finance/addOverseasBill/1",
              query: {
                agentNums: [
                  ...new Set(this.getSelectedRows().map(item => item.agentNum))
                ].join(","),
              }
            });
          }
        }
        if (this.multipleTypeText === '模板生成') {
          this.downLoadState = true
          this.$nextTick(() => {
            this.downLoadState = false
          })
        }
        if (
          this.getSelectedRows().length &&
          this.multipleTypeText === "批量操作"
        ) {
          this.plType = this.pageTitle + this.taskType; // this.taskType区分不同的pageTitle
          if (this.pageTitle === "官方通知") {
            // let list = this.unique(
            //   this.multipleSelection,
            //   this.getCurFilterId(this.pageTitle)
            // );
            // let caseIdList = this.getLanglist(
            //   list.map(item => item.caseArray)
            // ).map(item => item.tmFileId);
            this.willtableCaseIdList = [
              ...new Set(this.getSelectedRows().map(item => item.tmFileId))
            ];
            // this.willtableCaseIdList = caseIdList;
            this.showTable = true;
          } else {
            if (this.pageTitle === "递交官方") {
              this.willtableCaseIdList = [
                ...new Set(this.getSelectedRows().map(item => item.insId))
              ];
            } else {
              if(this.$store.getters.permissions.includes(203) || this.$store.getters.permissions.includes(204)){
                if(this.$store.getters.permissions.includes(203) && !this.$store.getters.permissions.includes(204)){
                  if(this.getSelectedSortRows().find(item => item.isSubmitOfficial === 1)){
                    this.$message.error('无法批量编辑所选案件！')
                    return;
                  }
                }
                if(this.$store.getters.permissions.includes(204) && !this.$store.getters.permissions.includes(203)) {
                  if(this.getSelectedSortRows().find(item => item.isSubmitOfficial === 0)){
                    this.$message.error('无法批量编辑所选案件！')
                    return;
                  }
                }
              }else{
                this.$message.error('无法批量编辑所选案件！')
                return;
              }
              this.willtableCaseIdList = [
                ...new Set(this.getSelectedRows().map(item => item.caseId))
              ];
            }

            this.showTable = true;
          }
        }
        if (this.uploadType && !this.otherSelect && !this.selectionOptionState) {
          this.uploadState = true
        }
      },
      // 文件下载
      downLoadfiles(data) {
        if (this.getSelectedRows().map(item => item.materialId).filter(i => !!i).length == 0) {
          this.$message.error('没有可下载的文件')
          return;
        };
        downloadMaterial({
          zipFlag: 1,
          materialIdList: this.getSelectedRows().map(item => item.materialId),
          ...data
        }).then(res => {
          this.$commonUtils.downLoadAll({download: res.data.replace(/(.*\/)*([^.]+).*/ig,"$2",'')+'.'+res.data.replace(/.+\./,""), url: "ipdoc" + res.data})
          // axios.get(`ipdoc${res.data}`, {
          //   responseType: 'blob', headers: {
          //     "Content-Type": "application/json; charset=utf-8",
          //   }
          // }).then(function (response) {
          //   jsFileDownload(response.data, res.data.replace(/(.*\/)*([^.]+).*/ig, "$2", '') + '.' + res.data.replace(/.+\./, ""));
          // })
          this.closeDialog()
          // res.data.forEach((item,index)=>{
          //   axios.get(`ipdoc${item.address}`,{ responseType: 'blob', headers: {
          //       "Content-Type": "application/json; charset=utf-8",
          //     }}).then(function (res) {
          //
          //     jsFileDownload(res.data,item.fileName);
          //   })
          // })
        })
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
      getExportFileData(requireList, key) {
        if (key) {
          this.$refs.exportFile.currentType = key
        }
        this.multipleTypeTextDisabled = false
        this.multipleTypeText = '模板生成'
        this.exportListState = false
        this.requireList = requireList
        this.jumpDetailSubmisson()
      },
      unique(data, key) {
        const hash = {};
        const data2 = data.reduce((preVal, curVal) => {
          hash[curVal[key]]
            ? ""
            : (hash[curVal[key]] = true && preVal.push(curVal));
          return preVal;
        }, []);
        return data2;
      },
      remoteMethod(value, index, property, filterName) {
        if (value && filterName === "客户") {
          let request = new Promise(resolve => {
            if (this.queryModuleData[property] && this.queryModuleData[property].length) {
              queryCustomerNameId({pageNo: 1, pageSize: 100, custIdArray: this.queryModuleData[property]}).then(res => {
                resolve(res)
              })
            } else {
              resolve({data: []})
            }
          })
          Promise.all([request, queryList({pageNo: 1, pageSize: 100, sign: 1, parameter: value})]).then(res => {
            this.$set(
              this.conditionsModuleList[index],
              "valueList",
              this.$commonUtils.unique(res[0].data.concat(res[1].data).map(item => ({
                id: item.custId,
                value: item.name,
                value1: item.country,
                value2: item.fullname
              })), 'id')
            );
            this.$forceUpdate();
          })
        }
        if (value && ["申请人姓名", "被申请人", "转让人", "申请人"].includes(filterName)) {
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
                id: item.applicantName,
                value: item.applicantName,
                value1: item.applicantEnName,
                value2: item.applicantAddress,
                value3: item.applicantEnAddress
              })).filter(id => !!id)
            );
            this.$forceUpdate();
          });

        }
        if (value && ["客户联系人","账单联系人"].includes(filterName)) {
          queryCustContactAllUrl({
            name: value,
            pageNo: 1,
            pageSize: 100,
          }).then(res => {
            this.$set(
              this.conditionsModuleList[index],
              "valueList",
              res.data.map(item => ({
                id: item.custContactId,
                value: item.name,
                value1: item.custName,
              }))
            );
            this.$forceUpdate();
          });
        }
        if (value && ["外方代理所"].includes(filterName)) {
          queryCollaborationAll({
            fullname: value,
            pageNo: 1,
            pageSize: 100,
          }).then(res => {
            this.$set(
              this.conditionsModuleList[index],
              "valueList",
              res.data.map(item => ({
                id: item.custId,
                value: item.fullname,
              }))
            );
            this.$forceUpdate();
          });
        }
        if (value && filterName !== "客户" && !["申请人姓名", "被申请人", "转让人", "申请人",'客户联系人','账单联系人','外方代理所'].includes(filterName)) {
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
      changeTextRange(value, property) {
        this.$set(this.queryModuleData, property, value);
        // if(property=='agentNumEnd'){
        //   this.handleSearch(1)
        // }
      },
      leftCheckChange(e) {
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
      changeDjSubmitDate(e) {
        // if (this.drawerState) {
        //   return
        // }
        // this.handleSearch(1)
        if (e.filter(item => item).length === 2) {
          // this.$set(this.queryModuleData, 'instructionSubmitStatus', 0)
          this.handleSearch(1)
        } else if (e.filter(item => item).length === 0) {
          this.handleSearch(1)
        }
      },
      keyDownEnter(e) {
        if (e.target.value) {
          this.handleSearch(1)
        }
      },
      handleSearch(flag) {
        this.operationState = flag
        this.drawerState = false
        this.selectionState = false;
        this.listQuery.pageNo = 1;
        console.log(this.queryModuleData,'queryModuleData');
        
        if(flag == 1){
        for (let key in this.queryModuleData){
          //submitDateArray
          if(!['regAndAgent', 'myCase', 'workStatus', 'submitDateArray','officialInformScreen','materialCreateDateArray'].includes(key)){
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
       for (let key in this.queryModuleData){
         if(['regAndAgent', 'myCase', 'workStatus'].includes(key)){
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
      }
        this.queryCaseList();
        if (JSON.parse(localStorage.getItem('queryModuleData'))) {
          var arr = JSON.parse(localStorage.getItem('queryModuleData'))
        } else {
          var arr = []
        }
        if (arr.find(item => item.name == this.$route.name)) {
          arr.find(item => item.name == this.$route.name).queryModuleData = this.queryModuleData
          arr.find(item => item.name == this.$route.name).operationState = this.operationState
        } else {
          arr.push({name: this.$route.name, queryModuleData: this.queryModuleData, operationState: this.operationState})
        }
        localStorage.setItem('queryModuleData', JSON.stringify(arr))
      },
      clearSearch() {
        for (var key in this.queryModuleData) {
          if (!['officialInformScreen', 'myCase', 'instructionSubmitStatus'].includes(key)) {
            if (key.includes('Date')) {
              this.$set(this.queryModuleData, key, ['', ''])
            } else if (key.includes('Array')) {
              this.$set(this.queryModuleData, key, [])
            } else if (key === 'caseTypeIds' || key === 'deptGroupIds' || key === 'caseCustRespUserIds') {
              this.$set(this.queryModuleData, key, [])
            } else {
              this.$set(this.queryModuleData, key, null)
            }
          }
        }
        if (this.$refs.multiCascader) {
          this.$refs.multiCascader.forEach(item => {
            item.$el.querySelector('.el-input__inner').value = ''
          })
        }
        //this.listQuery.pageNo = 1;
        // this.queryCaseList();
      },
      editFun(row, flag) {
        this.scrollTop = document.getElementsByClassName('ag-body-viewport')[0].scrollTop
        if (this.pageTitle == '递交官方') {
          this.multipleSelectionCaseArray = row.caseArray
          this.submissionState = true
          this.title = '递交 / 修改'
          this.submissionType = 'edit'
        }
        if (this.pageTitle == '官方通知') {
          if(row.caseArray.length == 0){
            row.caseArray.push({insId: row.insId})
          }
          this.multipleSelectionCaseArray = row.caseArray || [{}]
          this.officialCommunicationState = true
          this.officialCommunicationType = 'edit'
        }
        if (this.pageTitle == '案件管理') {
          this.getCaseRow(row, flag)
        }
      },
      checkAttachment(row) {
        console.log(row,'row')
      },
      getViewRow(row) {
        if (this.pageTitle == '官方通知') {
          this.multipleSelectionCaseArray = row.caseArray
          this.officialCommunicationState = true
          this.officialCommunicationType = 'view'
        }
        if (this.pageTitle == '递交官方') {
          this.multipleSelectionCaseArray = row.caseArray
          this.submissionState = true
          this.title = '递交 / 查看'
          this.submissionType = 'view'
        }
        // this.$emit("getViewRow", row);
      },
      queryCaseList(initPosition = false) {
        this.startRow = ''
        this.lastRow = ''
        const data = {
          business: this.business,
          pageNo: this.listQuery.pageNo,
          pageSize: this.listQuery.pageSize
        };

        for (var key in this.queryModuleData) {
          if (Object.prototype.toString.call(this.queryModuleData[key]).includes("Date")) {
            this.queryModuleData[key] = this.formatDate(this.queryModuleData[key]);
          }
          if (this.queryModuleData[key] === null) {
            delete this.queryModuleData[key]
          }
        }
        const querData = Object.assign(data, this.queryModuleData)
        //operationState ： 0 => 搜索按钮搜索
        //                  1 => 过滤条件搜索
        if (this.operationState) {
          for (var key in querData) {
            if (!['business', 'pageNo', 'pageSize', 'shortcuts'].includes(key)) {
              if (!['officialInformScreen', 'djSubmitDateArray', 'submitDateArray', 'myCase', 'regAndAgent', 'instructionSubmitStatus','workStatus','materialCreateDateArray'].includes(key)) {
                delete querData[key]
              }
            }
          }
        } else {
          if(querData.workStatus){
            this.queryModuleData.workStatus = 0
          }
          if(querData.officialInformScreen){
            this.queryModuleData.officialInformScreen = 100
          }
          for (var key in querData) {
            if (!['business', 'pageNo', 'pageSize', 'shortcuts'].includes(key)) {
              if (['officialInformScreen', 'myCase', 'instructionSubmitStatus', 'workStatus'].includes(key) || ![...this.conditionsModuleList.map(item => item.property), ...['agentNumStart', 'agentNumEnd', 'goodClasses', 'regNumber', 'tmName', 'custName', 'appCnName']].includes(key)) {
                delete querData[key]
              }
            }
          }
        }
        this.exportQueryModel = JSON.stringify(querData)
        this.getCaseList(querData).then(
          res => {
            (res.data || []).forEach(item => {
              for (var key in item) {
                if (!item[key] && item[key] !== 0) {
                  item[key] = ''
                }
              }
            })
            this.caseListDefault = JSON.parse(JSON.stringify(res.data))
            this.total = res.total;
            this.caseList = res.data
            this.currentId = ''
            this.currentCaseId = ''
            this.caseList.forEach(item => {
              if (item.tmFileId) {
                item.insId = item.tmFileId;
              }
            });
            if (this.caseList.length) {
              this.getFilterModel()
            }
            if(this.pageTitle == '案件管理') {
             initPosition === false && setTimeout(()=>{
                this.changePosition()
              }, 0)
            }
          }
        );
      },
      getFilterModel() {
        this.$nextTick(() => {
          let data = this.$commonUtils.getFilterModel(this.$options.name + this.$route.name, 'FilterModel')
          let arr = Object.keys(data)
          let arrInstance = arr.map(item => this.gridApi.getFilterInstance(item))
          arrInstance.forEach((item, index) => {
            item.selectNothing()
            item.setModel(data[arr[index]])
            item.applyModel()
          })
          this.gridApi.onFilterChanged()
          if (this.gridApi.rowModel.rootNode.childrenAfterFilter.length) {
            if(this.pageTitle !== '案件管理'){
              this.gridApi.rowModel.rootNode.childrenAfterFilter[0].setSelected(true)
            }
          }

          // setSelected()
          // this.currentId=this.caseList[0][this.getCurFilterId(this.pageTitle)]
          // this.currentCaseId=this.caseList[0].caseId
        })
      },
      brushRight() {

        let data = this.$commonUtils.getFilterModel(this.$options.name + this.$route.name, 'FilterModel')
        let arr = Object.keys(data)
        arr.forEach(item => {
          this.gridApi.destroyFilter(item)
        })
        this.$commonUtils.saveFilterModel(this.$options.name+this.$route.name,'FilterModel', {})
        // this.columnDefs.map(item=>item.field).forEach(item=>{
        //   this.gridApi.getFilterInstance(item).selectNothing()
        //   // this.gridApi.getFilterInstance(item).setModel(data[arr[index]])
        // })
      },
      handleChange(boolean) {
        if (!boolean) {
          this.checkboxState = false;
          // const els1 = this.$el.getElementsByClassName("checkbox")[0];
          // els1.children[0].click();
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
              this.queryCaseList();
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
              this.queryCaseList();
            }
            this.getAllWfs();
          }
        });
      },
      handleCheckboxState() {
        this.checkboxState = !this.checkboxState;
        // if (this.checkboxState) {
        //   this.setWidth();
        // }
      },
      saveLocation() {
        if (!localStorage.getItem('tableHeader')) {
          let arr = []
          arr.push({name: this.$options.name, tableHeader: this.tableHeader})
          localStorage.setItem('tableHeader', JSON.stringify(arr))
        } else {
          let arr = JSON.parse(localStorage.getItem('tableHeader'))
          if (arr.find(item => item.name == this.$route.name)) {
            arr.find(item => item.name == this.$route.name).tableHeader = this.tableHeader
            localStorage.setItem('tableHeader', JSON.stringify(arr))
          } else {
            arr.push({name: this.$route.name, tableHeader: this.tableHeader})
            localStorage.setItem('tableHeader', JSON.stringify(arr))
          }
        }

      },
      getAllWfs() {
        const data = {
          userId: this.userId,
          bussId: this.bussId
        };
        Promise.all([selectColumn(data), queryPreference(data)]).then(res => {
          this.selectColumnList = res[0].data;

          this.preferenceList = res[1].data;
          this.columnDefs = [...this.defaultcolumnDefs, ...this.preferenceList.map(item => ({
            headerName: item.title,
            field: item.value,
            width: this.getLoactionWidth(item.title) == 'auto' ? 200 : this.getLoactionWidth(item.title),
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
          this.$nextTick(() => {
            this.columnDefs.forEach(item => {
              this.columnApi.getColumn(item.field)&&this.columnApi.getColumn(item.field).addEventListener('menuVisibleChanged', () => {
                if (document.querySelector(".ag-tabs")) {
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
          this.tableHeader = this.preferenceList.map(item => ({
            label: item.title,
            prop: item.value,
            width: this.getLoactionWidth(item.title)
          }))

          this.saveLocation()
          this.checkCaseList = this.preferenceList.map(item => item.value);
          // this.selectBox = this.selectColumnList.map(item => {
          //   if (this.checkCaseList.includes(item.COLUMN_NAME)) {
          //     return true;
          //   } else {
          //     return false;
          //   }
          // });
          this.preferenceList.forEach(item => {
            this.$set(this.filterData, item.value, []);
          });
          this.checkFilterList = this.preferenceList.map(item => false);
        });
      },
      getLoactionWidth(label) {
        if (!localStorage.getItem('tableHeader')) {
          return 'auto'
        } else {
          var arr = JSON.parse(localStorage.getItem('tableHeader'))
          if (arr.find(item => item.name == this.$route.name)) {
            var header = arr.find(item => item.name == this.$route.name).tableHeader
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
      headerDragend(newWidth, oldWidth, column, event) {
        var arr = JSON.parse(localStorage.getItem('tableHeader'))
        var header = arr.find(item => item.name == this.$route.name).tableHeader
        if (header.find(item => item.label == column.label)) {
          header.find(item => item.label == column.label).width = newWidth
        }
        localStorage.setItem('tableHeader', JSON.stringify(arr))
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
        this.queryModuleData = JSON.parse(localStorage.getItem('queryModuleData')) ? JSON.parse(localStorage.getItem('queryModuleData')).find(item => item.name == this.$route.name) ? JSON.parse(localStorage.getItem('queryModuleData')).find(item => item.name == this.$route.name).queryModuleData : {} : {}
        this.operationState = JSON.parse(localStorage.getItem('queryModuleData')) ? JSON.parse(localStorage.getItem('queryModuleData')).find(item => item.name == this.$route.name) ? JSON.parse(localStorage.getItem('queryModuleData')).find(item => item.name == this.$route.name).operationState : 1 : 1
        if (this.$route.query.custId) {
          // this.$set(this.queryModuleData, "custId", Number(this.$route.query.custId));
          // console.log(456)
          this.$set(this.queryModuleData, "custIdArray", [Number(this.$route.query.custId)]);
          this.operationState = 1
          //this.queryCaseList();
        }
        if(this.pageTitle=='案件管理'){
          if (this.queryModuleData.custName) {
            const custName = this.queryModuleData.custName
            this.isCustDim = 1
            this.$nextTick(() => {
              this.$set(this.queryModuleData, 'custName', custName)
            })
          }
          if (this.queryModuleData.appCnName) {
            const appCnName = this.queryModuleData.appCnName
            this.isAppDim = 1
            this.$nextTick(() => {
              this.$set(this.queryModuleData, 'appCnName', appCnName)
            })
          }
        }
        // if (this.$route.query.myCase) {
        //   this.$set(this.queryModuleData, "myCase", this.$route.query.myCase);
        //   // this.queryCaseList();
        // }
      },
      queryFilterConfig(type) {
        this.defaultQuerySearch()
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
              if (!keyList.includes(key)&&!this.queryModuleData[key]) {
                if (key.includes('Date')) {
                  this.$set(this.queryModuleData, key, ['', ''])
                } else if (key.includes('Array')) {
                  this.$set(this.queryModuleData, key, [])
                } else {
                  this.$set(this.queryModuleData, key, null)
                }
              }
            }
            if (type == 1) {
              this.queryCaseList()
            }
            res.data.forEach(item => {
              if (item.filterType.includes("Many")) {
                if (this.queryModuleData[item.property]) {
                  if (item.filterType.includes('Many')) {
                    if (["被申请人", "转让人"].includes(item.filterName)) {
                      // queryAllUrl({ appId:this.queryModuleData[item.property]}).then(res=>{
                      //   this.$set(item,'valueList', res.data.map(i => ({
                      //     id: i.applicantName,
                      //     value: i.applicantName,
                      //     value1: i.applicantEnName,
                      //     value2: i.applicantAddress,
                      //     value3: i.applicantEnAddress
                      //   })))
                      // })
                    } else if (item.filterName == '申请人姓名') {
                      // console.log(this.queryModuleData[item.property]);
                      // Promise.all( this.queryModuleData[item.property].map(itm=>queryAllUrl({appId:itm}))).then(res=>{
                      //   this.$set(item,'valueList', this.$commonUtils.getLanglist(res.map(i=>i.data)).map(i => ({
                      //     id: i.applicantName,
                      //     value: i.applicantName,
                      //     value1: i.applicantEnName,
                      //     value2: i.applicantAddress,
                      //     value3: i.applicantEnAddress
                      //   })))
                      //   // this.$set(item,'valueList', this.$commonUtils.getLanglist(res.map(i=>i.data)).map(i => ({ id: i.custId, value: i.name })))
                      // })
                    } else if (item.filterName == '客户') {
                      if (this.queryModuleData[item.property].length) {
                        queryCustomerNameId({custIdArray: this.queryModuleData[item.property]}).then(res => {
                          this.$set(item, 'valueList', res.data.map(i => ({id: i.custId, value: i.name})))
                        })
                      }
                    } else if(['账单联系人','客户联系人'].includes(item.filterName)){
                      queryCustContactAllUrl({custContactId: this.queryModuleData[item.property]}).then(res=>{
                        this.$set(item,'valueList',res.data.map(i => ({id:i.custContactId,value:i.name,value1:i.custName}) ))
                      })
                    } else if(['外方代理所'].includes(item.filterName)){
                      if (this.queryModuleData[item.property]&&this.queryModuleData[item.property].length) {
                        queryCollaborationAll({custIdArray: this.queryModuleData[item.property]}).then(res=>{
                          this.$set(item,'valueList',res.data.map(i => ({id:i.custId,value:i.fullname}) ))
                        })
                      }
                    } else {
                      if (item.values) {
                        item.valueList = item.values.filter(i => i.id == this.queryModuleData[item.property])
                      }
                    }
                    // if(item.property.includes('Array')){
                    //   //this.queryModuleData[item.property]=this.queryModuleData[item.property].map(itm=>Number(itm))
                    // }else {
                    //  // this.queryModuleData[item.property]=Number(this.queryModuleData[item.property])
                    // }
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
      delCase(row) {
        this.$confirm("此操作将永久删除, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            if (this.pageTitle === "案件管理") {
              deleteCase({caseIds: row.caseId, taskType: this.taskType})
                .then(res => {
                  if (res.success) {
                    this.$message({
                      type: "success",
                      message: "删除成功!"
                    });

                    this.queryCaseList();
                  }
                })
                .catch(err => {
                  this.$alert(`<p>${err.message}<p>`, "删除提示", {
                    dangerouslyUseHTMLString: true
                  });
                });
            } else if (this.pageTitle === "官方通知") {
              deleteDoc({
                docList: [{tmFileId: row.insId}],
                taskType: this.taskType
              }).then(res => {
                if (res.success) {
                  this.$message({
                    type: "success",
                    message: "删除成功!"
                  });

                  this.queryCaseList();
                  if (row.auditStatus == 2 || row.auditStatus == 3) {
                    this.getManualRecognitionOfficialInfoCount()
                  }
                }
              });
            } else if (this.pageTitle === "递交官方") {
              deleteIns({insIdList: row.insId,
                taskType: this.taskType
              }).then(res => {
                if (res.success) {
                  this.$message({
                    type: "success",
                    message: "删除成功!"
                  });
                  this.caseList.splice(this.caseList.indexOf(row), 1)
                  this.queryCaseList();
                }
              });
            }
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      },
      formatDate(time) {
        return this.$commonUtils.formatDate(time)
      },
      filterCheck(val) {
        this.filterText = val;
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
        if (['客户联系人','账单联系人'].includes(filterName)) {
          return {
            id: "-1",
            value: "联系人名称",
            value1: "客户简称",
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
        if (filterName === "外方代理所") {
          return {
            id: "-1",
            value: "名称",
          };
        }
        return valueList0;
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
      getWidth(data, header, currentId) {
        if (data.width !== 'auto') {
          return data.width
        } else {
          return 'auto'
        }
      },
      copyCase(row){
        copyCase({caseId:row.caseId}).then(res=>{
          this.getCaseRow(res.data, '__^-^__')
        })
      },
      getRowContextmenuList(row) {
        if (this.pageTitle === '官方通知') {
          if (this.business==4) {
            return [
              {name: '复制', action: 'copy'},
              {name: '修改', action: 'editFun'},
              {name: '删除', action: 'delCase'},
              {name: '附件', action: 'pdfPreDoc'},
            ].filter((item)=>{
              if( item.action == 'pdfPreDoc'){
                return row.fileAddressList && this.isOrNotPdfPre(row.fileAddressList)
              }else{
                return true
              }
            })
          }else{
            return [
              {name: '复制', action: 'copy'},
              {name: '修改', action: 'editFun'},
              {name: '删除', action: 'delCase'},
            ]
          }
        }
        if (this.pageTitle === '递交官方') {
          return [
            {name: '复制', action: 'copy'},
            {name: '修改', action: 'editFun'},
            {name: '删除', action: 'delCase'}]
        }
        if (this.pageTitle === '案件管理') {
          let hash = {}
          this.taskType == 4 && (this.rowContextmenuList = [
            { name: '相关案件', action: 'relevant' },
            { name:'复制立案',action: 'createCase'},
            { name:'暂存', action: 'temporarStorage'},
            { name:'暂存(批量)', action: 'temporarStorageAll'},
            { name:'隐藏', action: 'hidden'},
            { name:'隐藏(批量)', action: 'hiddenAll'},
            { name:'设置相关案件',action: 'setRelevant'},
          ]);
          this.taskType == 6 && (this.rowContextmenuList = [
            { name:'复制立案',action: 'copyCase'},
          ])
          return this.rowContextmenuList.concat([
            {name: '复制', action: 'copy'},
            { name: '修改', action: 'editFun',permissions:203, isSubmitOfficial:0},
            { name: '修改', action: 'editFun',permissions:204, isSubmitOfficial:1},
            { name: '删除', action: 'delCase',permissions:205, isSubmitOfficial:0},
            { name: '删除', action: 'delCase',permissions:206, isSubmitOfficial:1 },
            {name: '删除', action: 'delCase', permissions: 250},
          ]).filter(item => {
            if(row.agentNum.slice(0,2) === 'NO' && row.createUserId == this.userId){
              return true
            }
            if (item.permissions) {
              if(item.permissions == 250){
                return this.$store.getters.permissions.includes(item.permissions)
              }
              if(this.taskType == 4){
                return this.$store.getters.permissions.includes(item.permissions) && row.isSubmitOfficial===item.isSubmitOfficial
              }
              return this.$store.getters.permissions.includes(item.permissions)
            } else if (item.action == 'pdfPre') {
              return row.addressList && this.isOrNotPdfPre(row.addressList)
            } else {
              return true
            }
          }).reduce((preVal, curVal) => {
            hash[curVal.action] ? '' : hash[curVal.action] = true && preVal.push(curVal);
            return preVal
        }, [])
        }
        // if(this.pageTitle==='案件管理'){
        //   return this.rowContextmenuList.concat([
        //     { name:'复制',action: 'copy' },
        //     { name: '修改', action: 'editFun'},
        //     { name: '删除', action: 'delCase'}])
        // }
      },
      isOrNotPdfPre(list){
        return  list.filter(itm=>['pdf','jpg','png'].some(item=>itm.replace(/.+\./,"").toLocaleLowerCase()==item)).length!==0;
      },
      pdfPreDoc(node) {
        this.preDocState = true;
        this.pdfData=[] 
        this.$nextTick(()=>{
          if(node.fileAddressList){
            this.pdfData =node.fileAddressList.filter(itm=>['pdf','jpg','png'].some(item=>itm.replace(/.+\./,"").toLocaleLowerCase()==item))
            if(this.pdfData.length==0){
              this.preDocState=false
            }
          }
          console.log(this.pdfData,'this.pdfData');
        })
      },
      onload(){
        this.loadIndex ++
        if(this.loadIndex == 1){
          setTimeout(()=>{
            document.getElementsByClassName('iframe')[0].contentWindow.location.reload()
          }, 200)
        }else{
          this.loadIndex = 0
        }
      },
      setRelevant(row){
        this.relCaseId = row.caseId
        this.relevantView = true
      },
      rowContextmenu(row, column, event) {
        const that = this
        this.$ContextMenu({
          event, // 传入鼠标事件
          menu: this.getRowContextmenuList(row)
        }).then(rs => {
          if (rs) {
            this[rs](row, column, event);
          }
        });
      },
      createCase(row) {
        this.copyForm.rowData = row
        this.copyForm.copyCaseView = true
      },
      // relevant(row, column, event) {
      //   queryCorrelationCaseList({caseId:row.caseId}).then(res=>{
      //     if(this.pageTitle==='案件管理'){
      //       res.data.forEach(item=>{
      //         if(this.ajglTabList.find(item=>item.title=='相关案件')){
      //           this.$store.commit('tabs/CHANGE_AJGLTABLIST',{type:'push',data:{title:'相关案件',name:'相关案件',data:item}})
      //         }else {
      //           this.$store.commit('tabs/CHANGE_AJGLTABLIST',{type:'pushItem',data:{title:'相关案件',name:'相关案件',list:[item]}})
      //         }
      //       })
      //     }
      //   })
      // },
      relevant(row, column, event) {
        queryCorrelationCaseList({caseId: row.caseId, business: this.business}).then(res => {
          res.data.forEach(item => {
            this.$store.commit('tabs/CHANGE_STORAGETABLE', {
              type: 'push',
              title: '相关案件',
              name: '相关案件',
              identification: this.identification,
              data: item
            })
          })
          this.$refs.myTabs.tabClick({name: '相关案件'}, true)

          // if(this.pageTitle==='案件管理'){
          //   res.data.forEach(item=>{
          //     if(this.ajglTabList.find(item=>item.title=='相关案件')){
          //       this.$store.commit('tabs/CHANGE_AJGLTABLIST',{type:'push',data:{title:'相关案件',name:'相关案件',data:item}})
      //         }else {
      //           this.$store.commit('tabs/CHANGE_AJGLTABLIST',{type:'pushItem',data:{title:'相关案件',name:'相关案件',list:[item]}})
      //         }
      //       })
      //     }
      //   })
      // }
        })
      },
      temporarStorage(row, column, event, flag) {
        this.$store.commit('tabs/CHANGE_STORAGETABLE', {
          type: 'push',
          title: '暂存案件',
          name: '暂存案件',
          identification: this.identification,
          data: row
        })
        !flag && this.$refs.myTabs.tabClick({name: '暂存案件'}, true)
        // if(this.pageTitle==='案件管理'){
        //   if(this.ajglTabList.find(item=>item.title=='暂存案件')){
        //     this.$store.commit('tabs/CHANGE_AJGLTABLIST',{type:'push',data:{title:'暂存案件',name:'暂存案件', identification:this.identification, data:row}})
        //   }else {
        //     this.$store.commit('tabs/CHANGE_AJGLTABLIST',{type:'pushItem',data:{title:'暂存案件',name:'暂存案件', identification:this.identification, list:[row]}})
        //   }
        // }
      },
      temporarStorageAll() {
        let list = this.gridApi.getSelectedRows()
        list.forEach(item => {
          this.temporarStorage(item, '', '',true)
        })
        this.$refs.myTabs.tabClick({name: '暂存案件'}, true)
        // if(this.pageTitle==='案件管理'){
        //   if(this.ajglTabList.find(item=>item.title=='暂存案件')){
        //
        //     this.$store.commit('tabs/CHANGE_AJGLTABLIST',{type:'push',data:{title:'暂存案件',name:'暂存案件',data:row}})
        //   } else {
        //     this.$store.commit('tabs/CHANGE_AJGLTABLIST',{type:'pushItem',data:{title:'暂存案件',name:'暂存案件',list:[row]}})
        //   }
        // }
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
      hidden(row) {
        this.caseList = this.caseList.filter(item => item[this.getCurFilterId(this.pageTitle)] != row[this.getCurFilterId(this.pageTitle)])
        // this.caseList.splice(this.caseList.indexOf(row),1)
        this.currentPageSize -= 1
      },
      hiddenAll(){
        let list=this.gridApi.getSelectedRows()
        this.caseList=this.caseList.filter(item=>!list.includes(item))
        this.$nextTick(()=>{
          this.currentPageSize = this.gridApi.rowModel.rootNode.allChildrenCount
        })
      },
      abnormal(row, column, event) {
        if (this.pageTitle === '案件管理') {
          if (this.ajglTabList.find(item => item.title == '异常案件')) {
            this.$store.commit('tabs/CHANGE_AJGLTABLIST', {
              type: 'push',
              data: {title: '异常案件', name: '异常案件', data: row}
            })
          } else {
            this.$store.commit('tabs/CHANGE_AJGLTABLIST', {
              type: 'pushItem',
              data: {title: '异常案件', name: '异常案件', list: [row]}
            })
          }
        }
      },
      copy(row, value) {
        this.$copyText(value).then(
          res => {
          })
      },
      undateSearch(n) {
        if (this.bussId == n.bussId) {
          this.queryModuleData = JSON.parse(n.value)
          this.handleSearch(0)
          this.queryFilterConfig()
        }

      },
      handleEnterSearch(e) {
        e.preventDefault();
        // 设置标志，防止handleChangeSearch执行
        this.isEnterPressed = true;
        this.handleSearch(1);
        this.$refs.quickSearchInput.blur()
        // 延迟重置标志，确保handleChangeSearch不会执行
        setTimeout(() => {
          this.isEnterPressed = false;
        }, 200);
      },
      handleChangeSearch(){
        // 如果是按回车键触发的，则不执行搜索
        if (this.isEnterPressed) {
          return;
        }
        // 值变化时执行搜索，只有当值不为空时才触发搜索
        // 使用 setTimeout 防抖
        if (this.searchTimer) {
          clearTimeout(this.searchTimer)
        }
        this.searchTimer = setTimeout(() => {
          // 只有当输入框有值时才执行搜索
          if (this.queryModuleData.regAndAgent) {
            this.handleSearch(1)
          }
          this.searchTimer = null
        }, 100)
      },
      handleClearSearch(){
        // 清除操作：不触发搜索
        // 清除定时器，避免 change 事件触发搜索
        // Element UI 会自动清空 v-model 绑定的值，所以不需要手动设置
        if (this.searchTimer) {
          clearTimeout(this.searchTimer)
          this.searchTimer = null
        }
        // 由于 handleChangeSearch 中已经检查了值是否为空，所以这里不需要额外处理
      }
    },
    computed: {
      permissions() {
        return this.$store.getters.permissions;
      },
      deepCloneData(){
        return this.$wUtil.deepClone3(this.columnDefs)
      },
      tableTitle(){
        if(this.taskType == 4){
          return this.tableTitleList
        }else{
          return this.preferenceList
        }
      },
      identification(){
        if(this.taskType == 2){
          return 'litigationCasecase_managementlitigation'
        }else if(this.taskType == 3){
          return 'protectCasecase_managementprotect'
        }else if(this.taskType == 4){
          return 'patentCasecase_managementpatent'
        }
      },
      ...mapGetters(["userId"]),
      ...mapState({
        'pattern': state => state.user.pattern,
        'ajglTabList': state => state.tabs.ajglTabList,
        'djgfTabList': state => state.tabs.djgfTabList,
        'gftzTabList': state => state.tabs.gftzTabList,
        'isUpdateList': state => state.caseInformation.isUpdateList
      }),
      clientHeight() {
        return document.documentElement.clientHeight - 200
      },
      cssVar(){
        return {
          '--height': document.documentElement.clientHeight-270 + 'px'
        }
      },
      isSuggestion() {
        if (this.caseList.some(item => item.caseType == '建议')) {
          return true
        } else {
          return false
        }
      },
      comUploadType() {
        return this.patentOneMaterial ? 'cpc递交文件' : this.uploadType
      }
    },
    watch: {
      permissions: 'checkAndAddListener',
      business: 'checkAndAddListener',
      taskType: 'checkAndAddListener',
      isAppDim(){
        this.$set(this.queryModuleData, 'appCnNameArray', [])
        this.$set(this.queryModuleData, 'appCnName', '')
      },
      isCustDim(n, o){
        this.$set(this.queryModuleData, 'custIdArray', [])
        this.$set(this.queryModuleData, 'custName', '')
      },
      isUpdateList(n){
        if(n){
          // this.queryCaseList()
          if(this.pageTitle=='官方通知'){
            this.queryCaseList()
          }
          this.$store.commit('caseInformation/UPDATE_LIST', false)
        }
      },
      timeLimitState(n, o) {
        if (!n) {
          let allData = this.$refs['timeLimit']._data
          for (var key in allData) {
            allData[key] = ''
          }
        }
      },
      $route: {
        handler: function (val, oldVal) {
          // this.$nextTick(() => {
          //   this.rightDrag()
          // })
          setTimeout(()=>{
            this.rightDrag()
          },500)
        },
        immediate: true
      },
      pattern: {
        handler(n, o) {
          if (n) {
            this.$store.commit('app/TOGGLE_SIDEBAR', false)
          } else {
            // this.$store.commit('app/TOGGLE_SIDEBAR',true)
          }
        },
        immediate: true
      },
      checkboxState(n) {
        if (n) {
          this.$nextTick(() => {
            this.$refs.checkCaseSelect.focus()
          })
        }
      },
      drawerState(n) {

      },
      transferVisible(n) {

      },
      tableHeader(n) {
        this.tableHeaderLabelList = n.map(item => item.label)
      },
      tableHeaderLabelList(n, o) {
        if (o.length) {
          if (localStorage.getItem('tableHeader')) {
            let header = JSON.parse(localStorage.getItem('tableHeader')).find(item => item.name == this.$route.name).tableHeader
            this.tableHeader.forEach(item => {
              header.forEach(itm => {
                if (itm.label == item.label) {
                  this.$set(item, 'width', itm.width)
                }
              })
            })
          }
          this.changeHeader(this.tableHeader)
        }
      },
      dialogVisible(n) {
        if (!n) {
          if (this.pageTitle == '案件管理') {
            // this.queryModuleData.shortcuts = 1;
            //  this.$refs.caseListMultiple.newTableStore.states.selection = [];
            this.selectionState = false
            // this.queryCaseList();
            //  delete this.queryModuleData.shortcuts;
          }
          // if(this.pageTitle=='官方通知'){
          //   this.changeKeepAlive()
          // }
        }
      },
    },
    activated() {
      this.business = this.business1
      this.taskType = this.taskType1
      this.bussId = this.bussId1
      if (this.$route.meta.business) {
        this.business = this.$route.meta.business
        this.taskType = this.$route.meta.taskType
        this.bussId = this.$route.meta.bussId
      }
      // if (!this.initFlag) {
      //   this.init()
      // }
      if(this.pageTitle == '案件管理') {
        this.changeKeepAlive()
      }
      this.initFlag = true
      // this.$store.commit('caseInformation/SET_BUSSID',this.bussId)
      // if(this.$route.query.instructionSubmitStatus){
      //   this.$set(this.queryModuleData, "instructionSubmitStatus",Number(this.$route.query.instructionSubmitStatus));
      //   this.queryCaseList();
      // }
      // if (this.$route.query.custId) {
      //   this.$set(this.queryModuleData, "custIdArray", Number(this.$route.query.custId));
      //   this.operationState=1
      //   this.queryCaseList();
      // }
      // if (this.$route.query.myCase) {
      //   this.$set(this.queryModuleData, "myCase", this.$route.query.myCase);
      //   this.queryCaseList();
      // }
      // if(this.pageTitle=='递交官方'){
      //   this.changeKeepAlive()
      // }
    },
    components: {
      CreateWorkHour,
      RelevantDialog,
      CreateNewTask,
      // handTime,
      Pagination,
      PdfPreview,
      Willtable,
      BulkUploadFile,
      exportFile,
      SelectOption,
      seeCaseDetail,
      ViewsSwitching,
      litigationSubmission,
      litigationOfficial,
      MyTabs,
      createTimeLimit,
      CaseInvestigators,
      ManualIdentification,
      cpcGrid,
      FileDownLoadDialog,
      UploadProofreading,
      TrawSheetDetails
    }
  };
</script>

<style lang="scss" scoped>
  header {
    margin-bottom: 19px;
    box-shadow: 0px 2px 5px 0px rgba(163, 163, 163, 0.35);

    /*<!--.queryButton:before{-->*/
    /*<!--content: '';-->*/
    /*<!--display: block;-->*/
    /*<!--width:0px;-->*/
    /*<!--border-right: 2px dashed rgba(191, 191, 191, 1);-->*/
    /*<!--height:58px;-->*/
    /*<!--position: absolute;-->*/
    /*<!--left: 0;-->*/
    /*<!--top: 50%;-->*/
    /*<!--transform: translateY(-50%);-->*/
    /*<!--}-->*/
  }

  .queryButton {
    display: flex;
    flex-wrap: nowrap;
    position: relative;
    justify-content: center;

    .buttonWrap_small {
      display: flex;
      margin: 5px 5px;
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

  .checkbox {
    position: absolute;
    left: 0px;
    top: 88px;
    /*width: 222px;*/
    height: 324px;
    border: 1px solid #99a9bf;
    background: #fff;
    z-index: 100;
    padding-top: 6px;
    padding-left: 6px;
    padding-right: 16px;
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

    .checkboxs {
      position: absolute;
      background: #fff;
      min-width: 100%;
      top: 47px;
      left: 0px;
      display: flex;
      z-index: 1;
      border: 1px solid #f4f4f5;
      overflow: visible;
      padding-left: 6px;
      padding-bottom: 80px;

      .filter_content {
        width: 100%;
        max-height: 200px;
        height: 200px;
        overflow: auto;
      }

      .el-checkbox-group {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        overflow: visible;
      }

      .checkAll {
        position: absolute;
        bottom: -27px;
        width: 100%;
        left: 0;
        background: #fff;
        height: 27px;
        color: #409eff;
        text-indent: 5px;
        line-height: 27px;
        cursor: pointer;
        border: 1px solid #f4f4f5;
      }
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

  >>> .filterTableTmg {
    height: 100%;
  }

  .fullItem {
    width: 100%;
  }

  .pdfPreview {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10;
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
      /*overflow: auto;*/
      overflow: hidden;
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

  .MyTabs {
    width: 100%;
    position: absolute;

    /deep/ .el-tabs {
      .el-tabs__header {
        margin: 0;
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

  .queryButton {
    z-index: 7
  }

  .cube {
    -webkit-transform: translateZ(0);
    -moz-transform: translateZ(0);
    -ms-transform: translateZ(0);
    -o-transform: translateZ(0);
    transform: translateZ(0);
    /* Other transform properties here */
  }

  /deep/ .imgWrap {
    .cell {
      width: 100%;
      height: 30px;
    }
  }

  .noTrigger /deep/ .el-table__column-filter-trigger {
    display: none;
  }

  .pdfDialog /deep/ {
    z-index: 3000;

    .el-dialog {
      z-index: 3000;
      height: 100vh;
      display: flex;
      flex-direction: column;

      .el-dialog__body {
        flex: 1;

        .swiper-container {
          height: 100%;

          .swiper-button-prev-son {
            cursor: pointer;
            position: absolute;
            top: 10px;
            left: 50%;
            z-index: 10000;
            transform: translateX(-50%);
            text-align: center;
            font-size: 50px;
          }

          .swiper-button-next-son {
            cursor: pointer;
            position: absolute;
            bottom: 10px;
            left: 50%;
            z-index: 10000;
            transform: translateX(-50%);
            text-align: center;
            font-size: 50px;
          }
        }
      }
    }

    .iframe {
      width: 100%;
      height: 100%;
    }
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
    >>>.el-dialog__body {
      padding-bottom: 50px;
      padding-top: 20px;
    }
  }
  >>>.el-tabs__content{
    height: var(--height)!important;
    overflow: auto!important;
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
  .modelItem{
    height: 40px;
    line-height: 40px;
    cursor: pointer;
    &:hover{
      background-color: #ECF5FF;
      color: #66B7FF;
    }
  }
</style>
