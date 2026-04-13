<template>
  <div style="position:relative;">
    <ViewsSwitching v-if="!isFinance" class="ViewsSwitching" @changePattern="changePattern"></ViewsSwitching>
    <MyTabs ref="myTabs" class="MyTabs" :page-title="pageTitle" :identification="identification" :defaultColumnDefs="columnDefs"
            @editableTab="editableTab" :class="myTabsActivity?'activity':''"
            v-if="pageTitle=='账单'" @cancel="myTabsDetailCancel"></MyTabs>
    <div v-if="!isFinance" class="filter-container" style="margin-bottom:15px">
      <el-form :inline="true" :model="listQuery" size="small" class="demo-form-inline">

        <div class="queryButton" style="width: 70%;margin: 0 auto">
          <div class="buttonWrap_small">
            <!--            <el-button-group>-->
            <!--  <el-button type="primary" size="small" @click="queryList('search')" >搜索</el-button>-->
            <!--  <el-popover-->
            <!--    placement="bottom"-->
            <!--    width="550"-->
            <!--    trigger="click"-->
            <!-- >-->
            <!-- <template >-->
            <!--     <el-form label-width="120px" :model="listQuery"  size="mini" class="form-container" @keyup.enter.native="queryList('search')">-->
            <!--<el-form-item label="案件文号">-->
            <!--              <el-input v-model="listQuery.agentNumString" placeholder=""></el-input>-->

            <!--            </el-form-item>-->

            <!--            <el-form-item label="账单号">-->
            <!--              <el-input v-model="listQuery.billNo" placeholder=""></el-input>-->

            <!--            </el-form-item>-->
            <!-- <el-form-item label="案件类型">-->
            <!--              <el-cascader ref="caseTypecascader" :clearable='true' filterable v-model="listQuery.caseTypeId" :show-all-levels="false" :options="caseTypeOptions" :props="defaultParams" placeholder="请选择">-->
            <!--              </el-cascader>-->
            <!--            </el-form-item>-->
            <!--            <el-form-item label="客户">-->
            <!--              <el-select default-first-option :clearable='true' v-model="listQuery.custId" no-match-text='暂无数据' loading-text='正在查询' filterable remote reserve-keyword placeholder="请输入关键词" :remote-method="remotepaternalUnit">-->
            <!--                <el-option v-for="item in seletData.custnames" :key="item.custId" :label="item.fullname" :value="item.custId">-->
            <!--                </el-option>-->
            <!--              </el-select>-->
            <!--            </el-form-item>-->


            <!--            <el-form-item class="" label="开单日期">-->
            <!--              <DataPicker class="DataPicker" v-model="fwDatevalue" ></DataPicker>-->
            <!--            </el-form-item>-->
            <!--        <el-form-item label="提交人">-->
            <!--              <el-select default-first-option :clearable='true' v-model="listQuery.billUserId" no-match-text='暂无数据' loading-text='正在查询' filterable remote reserve-keyword placeholder="请输入关键词">-->
            <!--                <el-option v-for="(item,key) in seletData.usernames" :key="key" :label="item.fullname" :value="item.userId">-->
            <!--                </el-option>-->
            <!--              </el-select>-->
            <!--            </el-form-item>-->
            <!--            <el-form-item label="申请人">-->
            <!--              <el-select default-first-option :clearable='true' v-model="listQuery.appId" no-match-text='暂无数据' loading-text='正在查询' filterable remote reserve-keyword placeholder="请输入关键词" :remote-method="remotepaternalUnitapp">-->
            <!--                <el-option v-for="(item,key) in seletData.apps" :key="key" :label="item.applicantName" :value="item.appId">-->
            <!--                </el-option>-->
            <!--              </el-select>-->
            <!--            </el-form-item>-->
            <!--     </el-form>-->
            <!--        <div style="text-align:right" >-->
            <!--                <el-button  size="mini"   @click="clearSearch"><span>重置</span></el-button>-->
            <!--                <el-button  type="primary" size="mini"  @click="queryList('search')">搜索</el-button>-->
            <!--              </div>-->
            <!--              </template>-->
            <!--     <el-button slot="reference"  style="padding: 8.5px 5px;" type="primary" size="small" icon="el-icon-arrow-down"></el-button>-->
            <!--  </el-popover>-->

            <!--</el-button-group>-->

            <el-button-group class="button-group-search" v-clickoutside="clickoutside">
              <el-button id="mySearch" type="primary" size="small" @click="handleSearch(0)">搜索</el-button>
              <el-popover
                placement="bottom-start"
                width="550"
                trigger="click"
              >
                <div style="position:relative;">
                  <div class="searchWrap">
                    <!--                  <el-form label-width="120px"  size="mini" class="form-container" @keyup.enter.native="handleSearch(0)">-->
                    <!--                    <el-form-item label="案件文号">-->
                    <!--                      <el-input v-model="queryModuleData.agentNumString" placeholder=""></el-input>-->

                    <!--                    </el-form-item>-->

                    <!--                    <el-form-item label="账单号">-->
                    <!--                      <el-input v-model="queryModuleData.billNo" placeholder=""></el-input>-->

                    <!--                    </el-form-item>-->
                    <!--                    <el-form-item label="案件类型">-->
                    <!--                      <el-cascader ref="caseTypecascader" :clearable='true' filterable v-model="queryModuleData.caseTypeId" :show-all-levels="false" :options="caseTypeOptions" :props="defaultParams" placeholder="请选择">-->
                    <!--                      </el-cascader>-->
                    <!--                    </el-form-item>-->
                    <!--                    <el-form-item label="客户">-->
                    <!--                      <el-select default-first-option :clearable='true' v-model="queryModuleData.custId" no-match-text='暂无数据' loading-text='正在查询' filterable remote reserve-keyword placeholder="请输入关键词" :remote-method="remotepaternalUnit">-->
                    <!--                        <el-option v-for="item in seletData.custnames" :key="item.custId" :label="item.fullname" :value="item.custId">-->
                    <!--                        </el-option>-->
                    <!--                      </el-select>-->
                    <!--                    </el-form-item>-->


                    <!--                    <el-form-item class="" label="开单日期">-->
                    <!--                      <DataPicker class="DataPicker" v-model="fwDatevalue" ></DataPicker>-->
                    <!--                    </el-form-item>-->
                    <!--                    <el-form-item label="提交人">-->
                    <!--                      <el-select default-first-option :clearable='true' v-model="queryModuleData.billUserId" no-match-text='暂无数据' loading-text='正在查询' filterable remote reserve-keyword placeholder="请输入关键词">-->
                    <!--                        <el-option v-for="(item,key) in seletData.usernames" :key="key" :label="item.fullname" :value="item.userId">-->
                    <!--                        </el-option>-->
                    <!--                      </el-select>-->
                    <!--                    </el-form-item>-->
                    <!--                    <el-form-item label="申请人">-->
                    <!--                      <el-select default-first-option :clearable='true' v-model="queryModuleData.appId" no-match-text='暂无数据' loading-text='正在查询' filterable remote reserve-keyword placeholder="请输入关键词" :remote-method="remotepaternalUnitapp">-->
                    <!--                        <el-option v-for="(item,key) in seletData.apps" :key="key" :label="item.applicantName" :value="item.appId">-->
                    <!--                        </el-option>-->
                    <!--                      </el-select>-->
                    <!--                    </el-form-item>-->
                    <!--                  </el-form>-->
                    <!--                  <div class="divdiver"></div>-->
                    <el-form size="mini" label-width="120px" class="form-container"
                             @keyup.enter.native="handleSearch(0)" style="margin-top: 2px">
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
                                   v-model="queryModuleData[item.property]" multiple placeholder="请选择" filterable
                                   clearable @change="(e)=>checkBox(e,item.property,item.values)">
                          <el-option v-for="itm in item.values" :key="itm.id" :label="itm.value" :value="itm.id">
                          </el-option>
                        </el-select>
                        <el-select v-if="item.filterType==='selectMany'" v-model="queryModuleData[item.property]"
                                   filterable remote clearable reserve-keyword placeholder="请输入关键词" :remote-method="(queryString)=>{
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
                          <el-option v-for="itm,idx in item['valueList']" :key="itm.id" :label="itm.value"
                                     :value="itm.id">
                            <el-tooltip v-for="itmx,key in item['valueList'][idx]" v-if="key!='id'" class="item"
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
                          <el-option v-for="itm,idx in item['valueList']" :key="itm.id" :label="itm.value"
                                     :value="itm.id">
                            <el-tooltip v-for="itmx,key in item['valueList'][idx]" v-if="key!='id'" class="item"
                                        effect="light" :content="itmx" placement="top">
                              <span>{{itmx}}</span>
                            </el-tooltip>
                          </el-option>
                        </el-select>
                        <el-select v-if="item.filterType==='selectTable'" v-model="queryModuleData[item.property]"
                                   filterable clearable placeholder="请选择">
                          <el-option v-for="itm ,idx in item.values" :key="idx" :label="itm.value" :value="itm.id"
                                     :disabled="itm.id==-1">
                            <span v-for="itmx ,key in item['values'][idx]" v-if="key!='id'">{{itmx}}</span>
                          </el-option>
                        </el-select>
                        <el-radio-group v-model="queryModuleData[item.property]" v-if="item.filterType==='radio'">
                          <el-radio :label="itm.id" v-for="itm,index in item.values" :key="index">{{itm.value}}
                          </el-radio>
                        </el-radio-group>
                        <el-input clearable v-model="queryModuleData[item.property]"
                                  :placeholder="'请输入'+item.filterName" v-if="item.filterType==='text'"></el-input>
                        <el-input clearable v-model="queryModuleData[item.property]"
                                  :placeholder="'请输入'+item.filterName" type="textarea" v-if="item.filterType==='textarea'"></el-input>
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
                          v-if="item.filterType==='cascader'"
                          ref="multiCascader"
                          :class="item.property"
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
                  <div class="clearWrap">
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

                    <el-button size="mini" @click="() => {clearSearch(this)}"><span>重置</span></el-button>
                    <el-button type="primary" size="mini" @click="handleSearch(0)">搜索</el-button>
                  </div>
                  <el-button style="position:absolute;top: 0;right: 10px" type="text" size="small" @click="queryFilter">
                    <i class="el-icon-s-tools"></i>更多
                  </el-button>

                </div>
                <el-button type="primary" slot="reference" style="margin-left:0" class="searchRight" size="small"
                           icon="el-icon-arrow-down"></el-button>
              </el-popover>
            </el-button-group>

            <el-dropdown trigger="click" @command="commandMorebtn">

              <el-button class="el-dropdown-link" type="primary" size="small">
                更多
              </el-button>

              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-allow="155" command="0">修改备注</el-dropdown-item>
                <el-dropdown-item v-allow="156" command="1">修改开单日期</el-dropdown-item>
                <el-dropdown-item v-allow="157" command="3">生成总账单号</el-dropdown-item>
                <el-dropdown-item command="4">设置结余</el-dropdown-item>
                <!--                <el-dropdown-item v-allow="159" command="5">案件及其账单汇总表</el-dropdown-item>-->

              </el-dropdown-menu>
            </el-dropdown>
            <el-button class="filter-item" type="primary" @click="submission('提交',1)" size="small">提交
            </el-button>
            <!--            <el-button v-allow="162" class="filter-item" type="primary" @click="shbtnclick" size="small">审核-->
            <!--            </el-button>-->
            <!--        <el-button v-allow="162" class="filter-item" type="primary" @click="shbtnclick" size="small">审核-->
            <!--            </el-button>-->

            <el-menu class="el-menu-demo" menu-trigger="click" mode="horizontal" @select="(e)=>submission(e,2)"
                     v-if="$store.getters.permissions.includes(243)">
              <el-submenu index="1">
                <template slot="title">组长审核</template>
                <el-menu-item index="组长审核">通过</el-menu-item>
                <el-menu-item index="组长审核退回">
                  <el-popover
                    placement="bottom-start"
                    width="250"
                    title="退回原因"
                  >
                    <div style="text-align: right">
                      <el-input
                        type="textarea"
                        :rows="2"
                        placeholder="请输入内容"
                        v-model="failReasion">
                      </el-input>
                      <el-button type="primary" @click="returnToExamin(0,2)" class="exactButton" size="mini">确认退回
                      </el-button>
                    </div>
                    <div slot="reference">退回</div>
                    <!--          <el-button  slot="reference"   size="mini"  >退回</el-button>-->
                  </el-popover>
                </el-menu-item>
              </el-submenu>
            </el-menu>
            <el-menu class="el-menu-demo" mode="horizontal" @select="(e)=>submission(e,3)"
                     v-if="$store.getters.permissions.includes(244)">
              <el-submenu index="1">
                <template slot="title">账单岗审核</template>
                <el-menu-item index="账单岗审核">通过</el-menu-item>
                <el-menu-item index="账单岗审核退回">
                  <el-popover
                    placement="bottom-start"
                    width="250"
                    title="退回原因"
                  >
                    <div style="text-align: right">
                      <el-input
                        type="textarea"
                        :rows="2"
                        placeholder="请输入内容"
                        v-model="failReasion">
                      </el-input>
                      <el-button type="primary" @click="returnToExamin(0,3)" class="exactButton" size="mini">确认退回
                      </el-button>
                    </div>
                    <div slot="reference">退回</div>
                    <!--          <el-button  slot="reference"   size="mini"  >退回</el-button>-->
                  </el-popover>
                </el-menu-item>
              </el-submenu>
            </el-menu>
            <el-menu class="el-menu-demo" mode="horizontal" @select="(e)=>submission(e,4)"
                     v-if="$store.getters.permissions.includes(245)">
              <el-submenu index="1">
                <template slot="title">财务审核</template>
                <el-menu-item index="财务审核">通过</el-menu-item>
                <el-menu-item index="财务审核退回">
                  <el-popover
                    placement="bottom-start"
                    width="250"
                    title="退回原因"
                  >
                    <div style="text-align: right">
                      <el-input
                        type="textarea"
                        :rows="2"
                        placeholder="请输入内容"
                        v-model="failReasion">
                      </el-input>
                      <el-button type="primary" @click="returnToExamin(0,4)" class="exactButton" size="mini">确认退回
                      </el-button>
                    </div>
                    <div slot="reference">退回</div>
                    <!--          <el-button  slot="reference"   size="mini"  >退回</el-button>-->
                  </el-popover>
                </el-menu-item>
              </el-submenu>
            </el-menu>
            <el-menu class="el-menu-demo" mode="horizontal" @select="(e)=>submission(e,5)"
                     v-if="$store.getters.permissions.includes(246)">
              <el-submenu index="1">
                <template slot="title">承办组审核</template>
                <el-menu-item index="承办组审核">通过</el-menu-item>
                <el-menu-item index="承办组审核退回">
                  <el-popover
                    placement="bottom-start"
                    width="250"
                    title="退回原因"
                  >
                    <div style="text-align: right">
                      <el-input
                        type="textarea"
                        :rows="2"
                        placeholder="请输入内容"
                        v-model="failReasion">
                      </el-input>
                      <el-button type="primary" @click="returnToExamin(0,5)" class="exactButton" size="mini">确认退回
                      </el-button>
                    </div>
                    <div slot="reference">退回</div>
                    <!--          <el-button  slot="reference"   size="mini"  >退回</el-button>-->
                  </el-popover>
                </el-menu-item>
              </el-submenu>
            </el-menu>
            <el-button class="filter-item" type="primary" v-if="$store.getters.permissions.includes(243)"
                       @click="submission('确认比例',6)" size="small">重新确认比例
            </el-button>
            <!--            <el-button v-allow="243" class="filter-item" type="primary" @click="submission('组长审核')" size="small">组长审核</el-button>-->
            <!--            <el-button v-allow="244" class="filter-item" type="primary" @click="submission('账单岗审核')" size="small">账单岗审核</el-button>-->
            <!--            <el-button v-allow="245" class="filter-item" type="primary" @click="submission('财务审核')" size="small">财务审核</el-button>-->
            <!--            <el-button v-allow="246" class="filter-item" type="primary" @click="submission('承办组审核')" size="small">承办组审核</el-button>-->
            <el-button class="el-dropdown-link" type="primary" size="small" @click="creatbtn('1')" v-allow="160">
              新建账单
            </el-button>
            <!--            <el-dropdown trigger="click" @command="creatbtn">-->

            <!--              <el-button class="el-dropdown-link" type="primary" size="small">-->
            <!--                新建-->
            <!--              </el-button>-->
            <!--             -->
            <!--              <el-dropdown-menu slot="dropdown">-->
            <!--                <el-dropdown-item v-allow="160" command="1">账单</el-dropdown-item>-->
            <!--                <el-dropdown-item v-allow="161" command="2">内部账单</el-dropdown-item>-->
            <!--              </el-dropdown-menu>-->
            <!--            </el-dropdown>-->
            <el-dropdown trigger="click" @command="mbmorebtn">

              <el-button class="el-dropdown-link" type="primary" size="small">
                模板生成<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>

              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="(item,key) in mbData" :key='key' :command='item'>{{item.name}}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-button v-allow="215" class="filter-item" type="primary" @click="takeInvoice" size="small">开发票
            </el-button>
            <el-button v-allow="229" class="filter-item" type="primary" @click="takeOverseasBills" size="small">境外账单
            </el-button>
            <el-button v-allow="164" class="filter-item" type="primary" @click="delMoreBill" size="small">删除</el-button>
            <!--            <el-button class="filter-item" type="primary" @click="billPay" size="small">账单收款</el-button>-->
            <!--            <el-button v-allow="229" class="filter-item" type="primary" @click="updateBillRemarks" size="small">编辑备注-->
            <!--            </el-button>-->
          </div>
        </div>

        <el-row class="searchfullRow1">
          <el-col :span="24" class="searchcol">
            <el-form-item label="账单状态" label-width="120px">
              <template>
                <el-radio-group v-model="queryModuleData.billwfStatus" @change="handleSearch(1)">
                  <el-radio label="">全部</el-radio>
                  <el-radio label="待提交"></el-radio>
                  <el-radio label="待组长审核"></el-radio>
                  <el-radio label="待账单岗审核"></el-radio>
                  <el-radio label="待财务审核"></el-radio>
                  <el-radio label="承办组组长退回"></el-radio>
                </el-radio-group>
              </template>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

    </div>
    <div style="overflow: hidden;position: relative">
      <TitleTotal style="float: left;margin-right:10px" :currentPageSize="currentPageSize" :total="total"/>
      <TitleTotal style="float: left;margin-right:10px" :currentPageSize="currentPageSize" :total="totalzzd"/>
      <TitleTotal style="float: left;margin-right:10px" :currentPageSize="currentPageSize" :total="totalsh"/>
      <!--    <el-row class="" v-if="showBottomBtn&&selectionState" style="float: left">-->

      <!--      <el-button v-if="showBottomBtn===6&&selectionState" @click="editBtnclick('6')" class="iconBtn" type="primary" size="mini">修改备注</el-button>-->
      <!--      <el-button v-if="showBottomBtn===1&&selectionState" @click="editBtnclick('1')" class="iconBtn" type="primary" size="mini">修改开单日期</el-button>-->
      <!--      <el-button v-if="showBottomBtn===3&&selectionState" @click="editBtnclick('3')" class="iconBtn" type="primary" size="mini">生成总账单号</el-button>-->
      <!--      &lt;!&ndash; <el-button v-if="showBottomBtn===4&&selectionState" @click="editBtnclick('4')" class="iconBtn" type="primary" size="mini">月度账单</el-button> &ndash;&gt;-->
      <!--      &lt;!&ndash; <el-button v-if="showBottomBtn===5&&selectionState" @click="editBtnclick('5')" class="iconBtn" type="primary" size="mini">案件及其账单汇总表</el-button> &ndash;&gt;-->
      <!--      <el-button v-if="showBottomBtn===7&&selectionState" @click="editBtnclick('7')" class="iconBtn" type="primary" size="mini">通过</el-button>-->
      <!--      <el-button v-if="showBottomBtn===7&&selectionState" @click="editBtnclick('8')" class="iconBtn" type="primary" size="mini">退回</el-button>-->
      <!--      <el-button v-if="showBottomBtn===9&&selectionState" @click="editBtnclick('9')" class="iconBtn" type="primary" size="mini">导出</el-button>-->
      <!--      <el-button v-if="mbshow&&selectionState" @click="scmbClick(10)" class="iconBtn" type="primary" size="mini">{{mbtitle}}</el-button>-->
      <!--      <el-popover-->
      <!--        placement="top"-->
      <!--        width="250"-->
      <!--        title="退回原因"-->
      <!--        v-if="mbshow&&selectionState&&mbtitle.includes('审核')"-->
      <!--        >-->
      <!--        <div style="text-align: right">-->
      <!--          <el-input-->
      <!--            type="textarea"-->
      <!--            :rows="2"-->
      <!--            placeholder="请输入内容"-->
      <!--            v-model="failReasion">-->
      <!--          </el-input>-->
      <!--          <el-button   type="primary"  @click="returnToExamin(0)" class="exactButton" size="mini">确认退回</el-button>-->
      <!--        </div>-->
      <!--        <el-button  slot="reference"   size="mini"  >退回</el-button>-->
      <!--      </el-popover>-->

      <!--      <el-button @click="selectionState =false;showBottomBtn=false;mbshow=false" class="iconBtn" type="primary" size="mini">取消</el-button>-->
      <!--      </el-row>-->
      <div
        style="cursor:pointer;position: absolute;display:flex;align-items:center;right: 0;bottom:-6px;font-size: 14px;padding-right: 6px">
        <el-button type="text" @click="exportList(2)" >导出</el-button>
        <span style="color: #52A2F4;margin: 0 5px"> / </span>
        <el-button type="text" @click="exportList(1)">全局导出</el-button>
        <!--        <img @click="exportList(2)" src="@/assets/moon.png" style="width: 16px;height: 16px" width="16" alt="">-->
      </div>
      <!--    <el-button type="text" style="position: absolute;right: 0;bottom:-6px;font-size: 14px;padding-right: 6px" @click="morebtn('9')"><i class="el-icon-download">导出</i></el-button>-->
    </div>
    <div class="content_wrap">
      <div class="left_wrap" :style="{width:currentCaseId&&pattern?leftWrapWidth:'100%' }">
        <div class="dots" @click="handleCheckboxState">
          <span class="dot">.</span>
          <span class="dot">.</span>
          <span class="dot">.</span>
        </div>
        <el-button class="brush_right" :class="brushRightHasFilter?'red':''" @click="brushRight" type="text"
                   icon="el-icon-brush"></el-button>
        <AgGridVue :style="{width:'100%',height: clientHeight+'px'}"
                   ref="bill"
                   class="ag-theme-balham"
                   :columnDefs="columnDefs"
                   :rowData="list"
                   :rowSelection="rowSelection"
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
                   :rowHeight="isFinance ? $commonUtils.getRowHeight() : 28"
                   :pinnedBottomRowData="pinnedBottomRowData"

        >
        </AgGridVue>
        <!--     <div style="height: 100%;width: 100%" id="plTable">-->
        <!--       <div :style="{'height':clientHeight+'px','width': '100%'}">-->
        <!--         &lt;!&ndash;<pl-table :datas="tableData" height="400" useVirtual-->
        <!--         注意点： 表格插件并不需要height属性字段(跟ele不同)，因为涉及分页组件。里面会去计算高度，只需要父级外层设置高度即可-->
        <!--         row-height属性很重要 请看表格属性列表-->
        <!--         &ndash;&gt;-->

        <!--         <pl-table-->
        <!--           v-if="tableFlag"-->
        <!--           big-data-checkbox-->
        <!--           fixed-columns-roll-->
        <!--           header-drag-style-->
        <!--           use-virtual-->
        <!--           :row-height="50"-->
        <!--           highlight-current-row-->
        <!--           class="myeltable cube"-->
        <!--           autoResize-->
        <!--           :height="clientHeight"-->
        <!--           ref="todoTaskMultiple"-->
        <!--           :datas="list"-->
        <!--           @row-click="rowClick"-->
        <!--           empty-text="暂无数据"-->
        <!--           @select="handleSelectionChange"-->
        <!--           @select-all="handleSelectionAll"-->
        <!--           @header-dragend="headerDragend"-->
        <!--           @filter-change="filterChange"-->
        <!--           :class="total<=listQuery.pageSize?'':'noTrigger'"-->
        <!--           fit-->
        <!--           border-->
        <!--           :paginationShow="false"-->
        <!--         >-->
        <!--           <template v-if="selectionState">-->
        <!--             <pl-table-column type="selection" width="30" class="selection">-->
        <!--             </pl-table-column>-->
        <!--           </template>-->
        <!--           <pl-table-column type="index" width="60" label="序号" align="left">-->
        <!--             <template slot="header" slot-scope="scope">-->
        <!--               <span>序号</span>-->
        <!--             </template>-->
        <!--           </pl-table-column>-->
        <!--           <pl-table-column v-for="(col, index) in tableHeader" :key="index"-->
        <!--                            :prop="col.prop"-->
        <!--                            :label="col.label"-->
        <!--                            :width="col.width"-->
        <!--                            :min-width="getMinWidth(col,tableHeader)"-->
        <!--                            :type="col.type"-->
        <!--                            :header-align="col.headerAlign"-->
        <!--                            :column-key="index.toString()"-->
        <!--                            :render-header="renderHeader"-->
        <!--                            :filters="unique(list.map(i=>({text:i[col.prop],value:i[col.prop]})),'value')"-->
        <!--                            :filter-method="filterHandler"-->
        <!--                            sortable-->
        <!--                            filter-placement="bottom-start"-->
        <!--           >-->
        <!--             <template slot-scope="scope">-->
        <!--               {{scope.row[col.prop]}}-->
        <!--             </template>-->
        <!--           </pl-table-column>-->
        <!--           <pl-table-column label="操作" align="left" width="" class-name="small-padding fixed-width">-->
        <!--             <template slot-scope="scope">-->
        <!--               <el-row>-->
        <!--                 <el-col :span="24">-->
        <!--                   <router-link v-allow="163" :to='"./creatBill/" +scope.row.billId + "/edit"'>-->
        <!--                     <el-button class="iconBtn" type="text" size="medium" icon="el-icon-edit">-->
        <!--                     </el-button>-->
        <!--                   </router-link>-->
        <!--                   <el-button v-allow="164" class="iconBtn" size="medium" type="text" @click="handledeleElement(scope.row,scope.$index)" icon="el-icon-delete"></el-button>-->
        <!--                 </el-col>-->
        <!--               </el-row>-->
        <!--             </template>-->
        <!--           </pl-table-column>-->
        <!--         </pl-table>-->
        <!--       </div>-->
        <!--     </div>-->
        <!--            <el-table-->
        <!--              highlight-current-row-->
        <!--              class="myeltable cube"-->
        <!--              ref="multipleTable"-->
        <!--              :data="list"-->
        <!--              :height="clientHeight"-->
        <!--              @row-click="rowClick"-->
        <!--              empty-text="暂无数据"-->
        <!--              @select="handleSelectionChange"-->
        <!--              @select-all="handleSelectionAll"-->
        <!--              @header-dragend="headerDragend"-->
        <!--              @filter-change="filterChange"-->
        <!--              :class="total<=listQuery.pageSize?'':'noTrigger'"-->
        <!--              border-->
        <!--            >-->
        <!--              <template v-if="selectionState">-->
        <!--                <el-table-column type="selection" width="30" class="selection"  >-->
        <!--                </el-table-column>-->
        <!--              </template>-->
        <!--              <el-table-column type="index" width="60" label="序号" align="left">-->
        <!--                <template slot="header" slot-scope="scope">-->
        <!--                  <div class="dots" @click="handleCheckboxState">-->
        <!--                    <span class="dot">.</span>-->
        <!--                    <span class="dot">.</span>-->
        <!--                    <span class="dot">.</span>-->
        <!--                  </div>-->
        <!--                  <span>序号</span>-->
        <!--                </template>-->
        <!--              </el-table-column>-->
        <!--              <el-table-column v-for="(col, index) in tableHeader" :key="index"-->
        <!--                               :prop="col.prop"-->
        <!--                               :label="col.label"-->
        <!--                               :width="col.width"-->
        <!--                               :min-width="getMinWidth(col,tableHeader)"-->
        <!--                               :type="col.type"-->
        <!--                               :header-align="col.headerAlign"-->
        <!--                               :column-key="index.toString()"-->
        <!--                               :render-header="renderHeader"-->
        <!--                               :filters="unique(list.map(i=>({text:i[col.prop],value:i[col.prop]})),'value').filter(ii=>ii.value!='')"-->
        <!--                               :filter-method="filterHandler"-->
        <!--                               sortable-->
        <!--                               filter-placement="bottom-start"-->
        <!--              >-->
        <!--                <template slot-scope="scope">-->
        <!--                 {{scope.row[col.prop]}}-->
        <!--                </template>-->
        <!--              </el-table-column>-->
        <!--              <el-table-column label="操作" align="left" width="" class-name="small-padding fixed-width">-->
        <!--                <template slot-scope="scope">-->

        <!--                  <el-row>-->
        <!--                    <el-col :span="24">-->

        <!--                      <router-link v-allow="163" :to='"./creatBill/" +scope.row.billId + "/edit"'>-->
        <!--                        <el-button class="iconBtn" type="text" size="medium" icon="el-icon-edit">-->

        <!--                        </el-button>-->
        <!--                      </router-link>-->
        <!--                      <el-button v-allow="164" class="iconBtn" size="medium" type="text" @click="handledeleElement(scope.row,scope.$index)" icon="el-icon-delete"></el-button>-->
        <!--                    </el-col>-->
        <!--                  </el-row>-->
        <!--                </template>-->
        <!--              </el-table-column>-->
        <!--            </el-table>-->


        <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :page-sizes="pageSizesList"
                    :limit.sync="listQuery.pageSize" @pagination="queryList('page')"/>
        <pagination v-show="totalzzd>0" :total="totalzzd" :page.sync="listQuery.pageNo" :page-sizes="pageSizesList"
                    :limit.sync="listQuery.pageSize" @pagination="getzzdlist"/>
        <pagination v-show="totalsh>0" :total="totalsh" :page.sync="listQuery.pageNo" :page-sizes="pageSizesList"
                    :limit.sync="listQuery.pageSize" @pagination="shSeach"/>
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
      <div class="right_wrap" v-if="pattern"
           :style="{position:'relative','margin-left':currentCaseId&&pattern?'10px' :'0',height:clientHeight+'px'}">
        <!--<span class="el-icon-close" slot="close" style="cursor:pointer;position: absolute;right: 0;top: 10px;z-index: 1000" @click="closeCurrentRow"></span>-->
        <seeCaseDetail v-if="currentCaseId" :judge-rank="judgeRank" :case-type-id="caseTypeId" :case-id="currentCaseId"
                       :case-type="caseType" :sign="1" :backsign="0" :caseList="caseList" :taskType="taskType">
        </seeCaseDetail>
      </div>
    </div>
    <el-dialog :title="`确定要修改这${getSelectedRows().length}条备注吗？`" :close-on-click-modal="false"
               :visible.sync="dialogVisible" width="40%">
      <h3 class="titilespan">修改前账单备注</h3>
      <el-table :data="getSelectedRows()" border size="mini" style="width: 100%">
        <el-table-column prop="billNo" label="账单号" width="180">
        </el-table-column>
        <el-table-column prop="remarks" label="备注">
        </el-table-column>

      </el-table>
      <h3 class="titilespan">备注</h3>
      <el-input type="textarea" :rows="3" v-model="editremarks" placeholder="请输入">
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editmome">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="批量修改开单日期" :close-on-click-modal="false" :visible.sync="dialogVisiblerq" width="30%">
      <el-form label-position="right" label-width="30%" :model="formLabelAlign">
        <el-row style="width: 100%">
          <el-form-item label="开单日期">
            <template>
              <el-date-picker v-model="formLabelAlign.billDate" format='yyyy-MM-dd' value-format="yyyy-MM-dd"
                              align="right" type="date" placeholder="选择日期" :picker-options="pickerOptions">
              </el-date-picker>
            </template>

          </el-form-item>
        </el-row>
        <el-row style="width: 100%">
          <el-form-item label="所属月">
            <template>
              <el-date-picker v-model="formLabelAlign.belongToDate" format='yyyy-MM-dd' value-format="yyyy-MM-dd"
                              align="right" type="date" placeholder="选择日期" :picker-options="pickerOptions">
              </el-date-picker>

            </template>

          </el-form-item>
        </el-row>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisiblerq = false">取 消</el-button>
        <el-button type="primary" @click="editrq">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="生成总账单号" @open="zzdDialogShow" :close-on-click-modal="false" :visible.sync="dialogVisiblezzd"
               width="40%">
      <el-form label-position="right" :model="formLabelAlignzzd">
        <div class="createPost-main-container">
          <div class="form-con">
            <el-row class="form-border">
              <el-col :span="24">
                <el-row class="fullRow">
                  <el-col :span="24">
                    <el-form-item label="总账单号:">
                      <template>
                        <span>{{formLabelAlignzzd.sumbillno}}</span>
                      </template>
                    </el-form-item>

                  </el-col>

                </el-row>
                <el-row class="fullRow">
                  <el-col :span="24">
                    <el-form-item label="案件文号:">
                      <template>
                        <span>{{formLabelAlignzzd.showRefno}}</span>
                      </template>
                    </el-form-item>

                  </el-col>

                </el-row>
                <el-row class="fullRow">
                  <el-col :span="24">
                    <el-form-item label="账单号:">
                      <template>
                        <div v-for="(item, index) in formLabelAlignzzd.billNoDetaiList" :key="index">{{item.billNo}}</div>
                        <!--                        <el-table :show-header="false" :data="formLabelAlignzzd.billNoDetaiList" border>-->
                        <!--                          <el-table-column prop="billNo" label="">-->
                        <!--                          </el-table-column>-->

                        <!--                        </el-table>-->
                      </template>
                    </el-form-item>

                  </el-col>

                </el-row>
                <el-row class="fullRow">
                  <el-col :span="24">
                    <el-form-item label="合并账单描述:">
                      <template>

                        <el-input type="textarea" :rows="3" v-model="formLabelAlignzzd.sumbilldescrip"
                                  placeholder="请输入"></el-input>
                      </template>
                    </el-form-item>

                  </el-col>

                </el-row>
                <el-row class="fullRow">
                  <el-col :span="24">
                    <el-form-item label="提交日期:">
                      <template>
                        <span>{{formLabelAlignzzd.submitdate}}</span>
                      </template>
                    </el-form-item>

                  </el-col>

                </el-row>
                <el-row class="fullRow">
                  <el-col :span="24">
                    <el-form-item label="提交人:">
                      <template>
                        <span>{{formLabelAlignzzd.submitusername}}</span>
                      </template>
                    </el-form-item>

                  </el-col>

                </el-row>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisiblezzd = false">取 消</el-button>
        <el-button type="primary" @click="editzzd">确 定</el-button>
      </span>
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
    <createInvoice v-if="createInvoiceState" :createInvoiceState="createInvoiceState" :billIdList="getSelectedRows()"
                   @close="createInvoiceClose" pageState="create"></createInvoice>
    <EmitSearch @undateSearch="undateSearch"></EmitSearch>
    <SelectOption
      :buss-id="bussId"
      v-if="selectionOptionState"
      :dialog-visible="selectionOptionState"
      @cancel="closeSelect"
      :idArray="getCurrentRowsData()"
      :defaultMultipleSelect="preferenceList.map(i=>i.title)"
      :exportType="exportType"
      :exportQueryModel="exportQueryModel"></SelectOption>
    <el-dialog
      title="预览"
      append-to-body
      :visible.sync="pdfDataState"
      width="50%"
      height="100vh"
      :modal="false"
      top="0"
      class="pdfDialog"
      :close-on-click-modal="false"
      v-dialogDrag
    >

      <iframe class="iframe" :src="pdfData"></iframe>
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
        <el-table-column align="left" label="案件类型" prop="agentNum">
          <template slot-scope="scope">
            <span style="margin: 0;cursor: pointer" @click="takeCaseDetail(scope.row)">
              {{scope.row.caseTypeStr}}
            </span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="案件名称" prop="agentNum">
          <template slot-scope="scope">
            <span style="margin: 0;cursor: pointer" @click="takeCaseDetail(scope.row)">
              {{scope.row.caseName}}
            </span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="类别" prop="agentNum">
          <template slot-scope="scope">
            <span style="margin: 0;cursor: pointer" @click="takeCaseDetail(scope.row)">
              {{scope.row.goodClasses}}
            </span>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="selectCaseVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="编辑备注"
      append-to-body
      :visible.sync="editRemarksState"
      width="50%"
      height="100vh"
      :modal="false"
      top="0"
      class="pdfDialog"
      :close-on-click-modal="false"
      v-dialogDrag
    >
      <el-input
        type="textarea"
        placeholder="请输入内容"
        v-model="editRemarks"
      >
      </el-input>
    </el-dialog>
    <template v-if="!isFinance">
      <el-drawer
        :wrapperClosable="false"
        :before-close="beforeClose"
        title="账单详情"
        :visible.sync="billDetailState"
        direction="btt"
        :modal="false"
        size="95%"
        append-to-body
        custom-class="billDraw"
      >
        <billDetail ref="billdetail" v-if="billDetailState" :type="type" :billData="billData" @cancel="cancel" @changeGridData="changeGridData"></billDetail>
      </el-drawer>
    </template>
    <template v-else>
      <el-dialog v-if="billDetailState" :before-close="beforeClose" top title="账单详情" :close-on-click-modal="false" :visible.sync="billDetailState" width="80%">
        <billDetail ref="billdetail" v-if="billDetailState" :type="type" :billData="billData" @cancel="cancel" @changeGridData="changeGridData"></billDetail>
      </el-dialog>
    </template>

    <!--    结余-->
    <el-dialog title="设置结余" :close-on-click-modal="false" :visible.sync="dialogViewjy" width="30%">
      <el-form label-position="right" label-width="30%" :model="formJY">
        <el-row style="width: 100%">
          <el-form-item label="结余状态:">
            <el-select size="small" default-first-option :clearable="true" v-model="formJY.balance">
              <el-option v-for="(item,key) in jyList" :key="key" :label="item.typeName" :value="item.id"></el-option>
            </el-select>
            <!--            <el-radio-group v-model="formJY.balance">-->
            <!--              <el-radio :label="1887">未结余</el-radio>-->
            <!--              <el-radio :label="1888">部分结余</el-radio>-->
            <!--              <el-radio :label="1889">已结余</el-radio>-->
            <!--            </el-radio-group>-->
          </el-form-item>
          <el-form-item label="结余日期:">
            <el-date-picker v-model="formJY.balanceDate" format='yyyy-MM-dd' value-format="yyyy-MM-dd"
                            align="right" type="date" placeholder="选择日期" :picker-options="pickerOptions">
            </el-date-picker>
          </el-form-item>
        </el-row>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogViewjy = false">取 消</el-button>
        <el-button type="primary" @click="editJy">确 定</el-button>
      </span>
    </el-dialog>
    <!--    弹框核销草单-->
    <el-dialog
      v-if="billCreateVisible"
      :visible.sync="billCreateVisible"
      width="80%"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <bill-create :page-type="pageType" @billCreateDialog="billCreateDialog"></bill-create>
    </el-dialog>
  </div>
</template>
<script>
import billDetail from './billDetail'
import SelectOption from '@/views/workbench/case/components/SelectOption.vue'
import {formatAmount, fomatFloat} from '@/utils/filters'
import MyTabs from '@/views/workbench/case/components/MyTabs'
import {
  fetchList,
  queryCustomerNameIdUrl,
  querywfUserNameUrl,
  queryAllUrl,
  deleteBillUrl,
  batchdoBillTaskUrl,
  querydotaskBillUrl,
  cancelrequest,
  updateBillRemarksUrl,
  updateBillDateAndBelongToDateUrl,
  querySingleBillUrl,
  checkIsSameCustUrl,
  createSumBillNoUrl,
  queryBillTemplateUrl,
  createBillTemplateUrl,
  queryBillSum,
  queryBillUrl,
  modifyBillBalanceBatch
} from "@/api/billApi";
import jsFileDownload from 'js-file-download'
import serviceApi from "@/api/serviceApi.config.js";
import {mapGetters, mapState} from "vuex";
import axios from 'axios';
import {
  queryCaseType,
  selectColumn,
  queryPreference,
  savePreference,
  configFilter,
  queryFilterConfig,
  queryFilter,
  addFilterScheme,
  queryCustomerNameId,
  delPreference,
  queryApplicantByIdList,
  checkPermission,
  recordOnlienEdit
} from "@/api/caseList.js";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import createInvoice from "../../../finance_two/finance_invoice/finance_invoice_opener/components/createInvoice";
import Summary from "@/components/Summary/index.js";
import {doEditInOffice, getProgID} from '@/utils/editInOffice.js'
import seeCaseDetail from '@/views/workbench/case/components/ManualIdentification/seeCaseDetail'
import ViewsSwitching from '@/views/workbench/case/components/ViewsSwitching'
import {downManyFile} from "../../../../../utils";
import billCreate from "../off_bill";
import {downloadMaterialBatch} from "../../../../../api/billApi";
import {querycustSelectClass} from "@/api/caseDetail";

export default {
  name: 'billList',
  components: {Pagination, createInvoice, SelectOption, seeCaseDetail, ViewsSwitching, MyTabs, billDetail, billCreate },
  computed: {
    ...mapState({
      'pattern': state => state.user.pattern
    }),
    ...mapGetters(["token", "name"]),
    clientHeight() {
      let height = 0;
      if(this.$store.state.settings.toolPosTop == 'top'){
        height = 260
      }else if(this.$store.state.settings.toolPosTop == 'right'){
        height = 200
      }
      return (document.documentElement.clientHeight - (this.isFinance ? height : 300))
    },
    // pinnedBottomRowData(){
    //   if(this.isFinance && this.gridApi.rowModel){
    //     const columnDisplay = ['paidLocal', 'billIn', 'billSum', 'serviceCost', 'officialCost', 'otherCost', 'serviceCostDiscount', 'foreignSum', 'actualExpense']
    //     return this.$commonUtils.pinnedBottomRowData(this.gridApi.rowModel.rootNode.childrenAfterFilter.map(item=>item.data), this.columnDefs, columnDisplay)
    //   }
    //   return ''
    // },
  },
  props:{
    isFinance: {
      type: Boolean,
      default: false
    }
  },
  data() {
    var tableHeader = []
    if (localStorage.getItem('tableHeader') && JSON.parse(localStorage.getItem('tableHeader')).find(item => item.name == this.$options.name)) {
      tableHeader = JSON.parse(localStorage.getItem('tableHeader')).find(item => item.name == this.$options.name).tableHeader
    }
    return {
      pinnedBottomRowData: null,
      gridApi: {},
      jyList: [
        // {name: '未结余', id: 1887},
        // {name: '部分结余', id: 1888},
        // {name: '已结余', id: 1889},
      ],
      formJY:{
        balance: '',
        balanceDate: this.$wUtil.getDate('', 'day')
      },
      dialogViewjy: false,
      caseTypeId: '',
      judgeRank: '',
      identification: 'billListbill',
      myTabsActivity: false,
      pageTitle: this.$route.meta.title,
      rowSelection: 'multiple',
      exportQueryModel: '',
      selectionOptionState: false,
      selectionState: false,
      schemeName: '',
      drawerState: false,
      userId: this.$store.getters.userId,
      conditionsModuleList: [],
      bussId: 8,
      createInvoiceState: false,
      searcgvisible: false,
      mbtitle: '',
      mbshow: false,
      mbcode: '',
      formLabelAlign: {
        billDate: "",
        belongToDate: ""
      },
      checkboxState: false, // 表头筛选框状态
      transferVisible: false, // 配置筛选条件框
      transferData: [], // 筛选条件数据
      transferValue: [], // 当前筛选条件id
      formLabelAlignzzd: {},
      editremarks: "",
      dialogVisiblezzd: false,
      dialogVisiblerq: false,
      dialogVisible: false,
      showBottomBtn: "",
      fwDatevalue: [],
      defaultParams: {
        // 級聯菜單默認
        value: "caseTypeId",
        label: "caseType",
        children: "childrens",
        checkStrictly: false
      },
      caseTypeOptions: [], // 案件类型集合
      list: [],
      total: 0,
      totalsh: 0,
      listLoading: true,
      listQueryzzd: {
        pageNo: 1,
        pageSize: JSON.parse(localStorage.getItem('pageSize')) ? JSON.parse(localStorage.getItem('pageSize')).find(item => item.name == this.$route.name) ? JSON.parse(localStorage.getItem('pageSize')).find(item => item.name == this.$route.name).pageSize : 10 : 10
      },
      listQueryash: {
        pageNo: 1,
        pageSize: JSON.parse(localStorage.getItem('pageSize')) ? JSON.parse(localStorage.getItem('pageSize')).find(item => item.name == this.$route.name) ? JSON.parse(localStorage.getItem('pageSize')).find(item => item.name == this.$route.name).pageSize : 10 : 10
      },
      listQuery: {
        pageNo: 1,
        pageSize: JSON.parse(localStorage.getItem('pageSize')) ? JSON.parse(localStorage.getItem('pageSize')).find(item => item.name == this.$route.name) ? JSON.parse(localStorage.getItem('pageSize')).find(item => item.name == this.$route.name).pageSize : 10 : 10
      },
      caseType: '',
      queryModuleData: {
        date: '',
        billUserId: "",
        agentNumString: "", //（案件文号，查询使用），
        caseTypeId: [], //（案件类型ID，查询使用），
        billNo: "", //（账单号），
        custIdArray: [], //，
        appId: "", //,（申请人Id，查询使用）
        billDateStart: "", //，（开单日期开始，查询使用）
        billDateEnd: "", //，（开单日期结束，查询使用）
        billwfStatus: "" //（账单状态集合，查询使用）为空时代表全部
      },
      operationState: 0,
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
      multipleSelection: [],
      seletData: {
        custnames: [],
        usernames: [],
        apps: []
      },
      source: null,
      totalzzd: 0,
      mbData: {},
      selectColumnList: [],
      checkCaseList: [],
      preferenceList: [],
      tableHeader: [],
      pageSizesList: [10, 50, 200, 500, 1000, 5000, 10000],
      addFilterState: false,
      dragState: {
        start: -1, // 起始元素的 index
        end: -1, // 结束元素的 index
        move: -1, // 移动鼠标时所覆盖的元素 index
        dragging: false, // 是否正在拖动
        direction: undefined // 拖动方向
      },
      filterData: {},
      filterDataSum: {},
      filterText: '',
      tableHeaderLabelList: [],
      startRow: '',
      lastRow: '',
      rowList: [],
      tableFlag: true,
      gridOptions: {
        ...this.$store.state.caseInformation.gridOptions, ...{
          statusBar: {
            statusPanels: [
              // {statusPanel: 'agSelectedRowCountComponent', align: 'left'},
              {statusPanel: 'CountStatusBarComponent'}
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
      brushRightHasFilter: false,
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
      pdfData: '',
      pdfDataState: false,
      selectCaseList: [],
      selectCaseVisible: false,
      editRemarksState: false,
      editRemarks: '',
      currentCaseId: '',
      agentNum: '',
      leftWrapWidth: '60%',
      currentId: '',
      caseList: [],
      taskType: 1,
      failReasion: '',
      zzth: false,
      billDetailState: false,
      billData: {},
      type: 'view',
      pageType: 'bill',
      billCreateVisible: false
    };
  },
  // activated() {
  //   this.$route.meta.activeName=1
  //   if(this.initFlag){
  //     this.init()
  //     // this.handleSearch(1)
  //     if(document.querySelector('.ag-body-viewport')){
  //       document.querySelector('.ag-body-viewport').scrollTop=this.scrollTopY
  //     }
  //   }
  //   this.initFlag=true
  // },
  created() {
    this.$route.meta.activeName = 1
    this.init(1)
  },
  watch: {
    $route: {
      handler: function (val, oldVal) {
        this.$nextTick(() => {
          this.rightDrag()
        })
      },
      immediate: true
    },
    pattern: {
      handler(n, o) {
        if (n) {
          // this.$store.commit('app/TOGGLE_SIDEBAR', false)

        } else {
          // this.$store.commit('app/TOGGLE_SIDEBAR',true)
        }
      },
      immediate: true
    },

    selectionState(n) {
      // this.changeSelection(n)
    },
    checkboxState(n) {
      if (n) {
        this.$nextTick(() => {
          this.$refs.checkCaseSelect.focus()
        })
      }
    },
    tableHeader(n) {
      this.tableHeaderLabelList = n.map(item => item.label)
    },
    tableHeaderLabelList(n, o) {
      if (o.length) {
        if (localStorage.getItem('tableHeader')) {
          let header = JSON.parse(localStorage.getItem('tableHeader')).find(item => item.name == this.$options.name + this.$route.name).tableHeader
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
  },
  mounted() {
    this.rightDrag()
  },
  methods: {
    downloadMaterialBatch() {
      downloadMaterialBatch({
        billIdList: this.getSelectedRows().map(item => item.billId)
      }).then(res => {
        this.$commonUtils.downLoadAll({
          url: `ipdoc${res.data}`
        })
      })
    },
    getCurrentRowsData() {
      if (this.gridApi && this.gridApi.rowModel) {
        return this.gridApi.rowModel.rootNode.childrenAfterSort.map(item => item.data).map(item => item['billId'])
      }
      return []
    },
    billPay(){
      if(!this.getSelectedRows().length){
        this.$message.error('请选择账单！')
        return
      }
      this.$router.push(`/workbench/finance/collectionCreate?curIdString=${this.getSelectedRows()[0].curIdString}&billIds=${this.getSelectedRows().map(i=>i.billId).join(',')}`)
    },
    editJy(){
      modifyBillBalanceBatch({
        billIds: this.getSelectedRows().map(item => item.billId).join(","),
        balance: this.formJY.balance,
        balanceDate: this.formJY.balanceDate
      }).then(res=>{
        this.dialogViewjy = false
        this.$message.success('设置成功！')
        const balanceObj = {};
        this.jyList.forEach(item => {
          balanceObj[item.id] = item.typeName
        })
        this.propsChange('balanceStr', balanceObj[this.formJY.balance])
        this.propsChange('balanceDate', this.formJY.balanceDate)
        this.formJY.balance = ''
      })
    },
    beforeClose(done){
      let result = this.$refs.billdetail.compare()
      !result ? (
        this.$confirm("是否保存该账单?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then( ()=>{
          this.$refs.billdetail.sunmitBill(2, () => {});
          // setTimeout(()=>{
          //   this.$refs.billdetail.cancel(1)
          // }, 100)
          // done()
        }).catch(err=>{
          this.$refs.billdetail.cancel(1)
          done();
          // this.$refs.billdetail.cancel(1)
        })
      ) : this.$refs.billdetail.cancel(1)

    },
    rightDrag() {
      let that = this
      // document.getElementById('searchWrap').onscroll=function (e) {
      //   that.clearWrapTop = e.target.scrollTop+ e.target.offsetHeight
      //   document.getElementById('clearWrap').style.top = that.clearWrapTop -40 + 'px'
      // }
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
    delMoreBill() {
      let list = this.gridApi.getSelectedRows(),
        billIdList = [],
        PermissionBillIdList = [],
        noPermissionBillIdList = [],
        hasReceipt = [],
        noPermissonListStr = '',
        hasReceiptStr = '',
        agentNoList = []

      if (list.length < 1) {
        this.$message.error('请先选择账单');
        return
      } else {
        list.forEach(item => {
          item.billId && billIdList.push(item.billId)
          if (item.isHaveReceiptStr == '是') {
            //有发票不能删除的账单号数组
            hasReceipt.push(item.billId)
          }
        })
      }
      checkPermission({billIdList}).then(res => {
        res.data.forEach(item => {
          if (item.delete) {
            //有权限删除的账单号数组
            PermissionBillIdList.push(item.billId)
          } else {
            noPermissionBillIdList.push(item.billId)//没有权限删除的账单号数组
          }
        });
        if (noPermissionBillIdList.length) {

          noPermissionBillIdList.forEach(item => {
            if (list.find(items => items.billId == item)) {
              agentNoList.push(list.find(items => items.billId == item).agentNumString)
            }
          })
          // noPermissonListStr = Array.from(new Set(agentNoList)).join('、')
        }
        let hasReceiptAgentNum = []
        if (hasReceipt.length) {
          hasReceipt.forEach(item => {
            if (list.find(items => items.billId == item)) {
              hasReceiptAgentNum.push(list.find(items => items.billId == item).agentNumString)
            }
          })
        }
        // let hasReceiptAgentNumStr = hasReceiptAgentNum.join('、')
        let noPermissionAndHasReclist = [...agentNoList, ...hasReceiptAgentNum]
        let canNotDelAgentNumList = Array.from(new Set(noPermissionAndHasReclist)).join('、')

        //有权限且没有关联发票的数组
        PermissionBillIdList = PermissionBillIdList.filter(item => !hasReceipt.includes(item))

        if (PermissionBillIdList.length) {
          let havePermissionAndNoRecList = []
          PermissionBillIdList.forEach(item => {
            if (list.find(items => items.billId == item)) {
              havePermissionAndNoRecList.push(list.find(items => items.billId == item).agentNumString)
            }
          })
          let havePermissionAndNoRecStr = havePermissionAndNoRecList.join('、')
          let confirmText = ['以下账单已开发票或您没有权限，无法删除:', canNotDelAgentNumList, '以下账单点击确定后将被删除:', havePermissionAndNoRecStr]
          const newDatas = []
          const h = this.$createElement
          for (const i in confirmText) {
            newDatas.push(h('p', null, confirmText[i]))
          }
          if (hasReceipt.length || noPermissionBillIdList.length) {
            this.$confirm(
              '提示',
              {
                title: '提示',
                message: h('div', null, newDatas),
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                customClass: 'winClass'
              }
            ).then(() => {
              deleteBillUrl({billIds: PermissionBillIdList}).then(response => {
                if (response.success) {
                  PermissionBillIdList.forEach(item => {
                    if (list.find(items => items.billId == item)) {
                      this.list.splice(this.list.indexOf(list.find(items => items.billId == item)), 1);
                    }
                  })
                  this.currentPageSize = this.currentPageSize - PermissionBillIdList.length
                  this.total = this.total - PermissionBillIdList.length
                } else {
                  this.$message.error(response.message);
                }
              });
            })
          } else {
            this.$confirm("此操作将永久删除所选账单, 是否继续?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }).then(() => {
              deleteBillUrl({billIds: PermissionBillIdList}).then(response => {
                if (response.success) {
                  PermissionBillIdList.forEach(item => {
                    if (list.find(items => items.billId == item)) {
                      this.list.splice(this.list.indexOf(list.find(items => items.billId == item)), 1);
                    }
                  })
                  this.currentPageSize = this.currentPageSize - PermissionBillIdList.length
                  this.total = this.total - PermissionBillIdList.length
                } else {
                  this.$message.error(response.message);
                }
              });
            })

          }

        } else {
          let confirmText = ['因所选账单已开发票或您没有权限，全部无法删除']
          const newDatas = []
          const h = this.$createElement
          for (const i in confirmText) {
            newDatas.push(h('p', null, confirmText[i]))
          }
          this.$confirm(
            '提示',
            {
              title: '提示',
              message: h('div', null, newDatas),
              showCancelButton: true,
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              customClass: 'winClass'
            }
          ).then(() => {

          })
        }
      })
    },
    myTabsDetailCancel(data) {
      let obj = this.list.find(item => item['billId'] === data['billId'])

      if (obj) {
        for (var key in obj) {
          if (key != 'sid') {
            this.$set(obj, key, data[key])
          }
        }
      }
      this.columnDefs.push({})
      this.columnDefs.pop()
      // this.list.push({})
      // this.list.pop()
      this.getSummary(this.gridApi.rowModel.rootNode.childrenAfterFilter.map(item => item.data))

    },
    cancel(billId, allSearch) {
      if (allSearch) {
        this.queryList()
        this.billDetailState = false
        return
      }
      billId && this.changeGridData(billId)
      this.billDetailState = false
      return;
      if (billId) {
        fetchList({billId}).then(res => {
          if (res.data.length) {
            let obj = this.list.find(item => item['billId'] === res.data[0]['billId'])
            this.$store.commit('tabs/CHANGE_STORAGETABLE', {
              type: 'update',
              title: '暂存账单',
              name: '暂存账单',
              identification: this.identification,
              data: res.data[0]
            })

            if (obj) {
              for (var key in obj) {
                if (key != 'sid') {
                  this.$set(obj, key, res.data[0][key])
                }
              }
            }
            this.columnDefs.push({})
            this.columnDefs.pop()
            // this.list.push({})
            // this.list.pop()
            this.getSummary(this.gridApi.rowModel.rootNode.childrenAfterFilter.map(item => item.data))
          }
        })
      }
      this.billDetailState = false
    },
    async changeGridData(billId){
      await this.$commonUtils.partUpdate(
        this.list,
        fetchList,
        {key: 'billId', value: billId},
        (list) => {
          this.updateTabsData(list)
          this.gridApi.refreshCells()
          let rowId = []

          function getRowId(item, taskNo){
            if(list.find(i => i.billId == item ).taskList && list.find(i => i.billId == item ).taskList.length){
              if(!list.find(i => i.billId == item ).taskList.find(item => item.taskNo == taskNo)){
                rowId.push(list.find(i => i.billId == item ).billId)
              }
            }else{
              rowId.push(list.find(i => i.billId == item ).billId)
            }
          }
          String(list.map(i => i.billId)).split(',').forEach(item => {
            switch (this.queryModuleData.billwfStatus) {
              case "待同意分配":
                getRowId(item, 5)
                break
              case "承办组组长退回":
                getRowId(item, 6)
                break
              case "待提交":
                getRowId(item, 1)
                break
              case "待组长审核":
                getRowId(item, 2)
                break
              case "待账单岗审核":
                getRowId(item, 3)
                break
              case "待财务审核":
                getRowId(item, 4)
                break
              default:
                break
            }
            // if(this.queryModuleData.billwfStatus == '待同意分配'){
            //   if(list.find(i => i.billId == item ).taskList && list.find(i => i.billId == item ).taskList.length){
            //     if(!list.find(i => i.billId == item ).taskList.find(item => item.taskNo == 5)){
            //       rowId.push(list.find(i => i.billId == item ).billId)
            //     }
            //   }else{
            //     rowId.push(list.find(i => i.billId == item ).billId)
            //   }
            // }
            // if(this.queryModuleData.billwfStatus == '承办组组长退回'){
            //   if(list.find(i => i.billId == item ).taskList && list.find(i => i.billId == item ).taskList.length){
            //     if(!list.find(i => i.billId == item ).taskList.find(item => item.taskNo == 6)){
            //       rowId.push(list.find(i => i.billId == item ).billId)
            //     }
            //   }else{
            //     rowId.push(list.find(i => i.billId == item ).billId)
            //   }
            // }
            // if( this.queryModuleData.billwfStatus !== '待同意分配' && this.queryModuleData.billwfStatus !== '承办组组长退回' && list.find(i => i.billId == item ).wfStatus !== this.queryModuleData.billwfStatus && this.queryModuleData.billwfStatus && this.queryModuleData.billwfStatus != 100){
            //   rowId.push(list.find(i => i.billId == item ).billId)
            // }
          })
          this.$commonUtils.partDel(this.list, rowId, 'billId', () => {this.total --;this.currentPageSize --;})
        }
      )

    },
    updateTabsData(list){
      list.forEach(item => {
        this.$store.commit('tabs/CHANGE_STORAGETABLE', {
          type: 'update',
          title: '暂存账单',
          name: '暂存账单',
          identification: this.identification,
          data: item
        })
      })
    },
    init(flag) {
      querycustSelectClass({ classId: "1159" }).then(res => {
        this.jyList = res.data['1159']
        this.$store.commit('caseInformation/SET_JYLIST',this.jyList || [])
      })
      this.$store.commit('caseInformation/SET_BUSSID', this.bussId)
      if (flag) {
        this.getselectdata();
        queryBillTemplateUrl().then(res => {
          this.mbData = res.data;
        });
        !this.isFinance && this.queryFilterConfig(1)
      } else {

        if (this.$route.query.name) {
          this.remotepaternalUnit(this.$route.query.name)
          this.queryModuleData.custIdArray = this.$route.query.custId
          this.queryList();
        } else if (this.$route.params.siveId) {
          fetchList({billId: this.$route.params.siveId}).then(res => {
            if (res.data.length) {
              let obj = this.list.find(item => item['billId'] === res.data[0]['billId'])
              if (obj) {
                for (var key in obj) {
                  if (key != 'sid') {
                    this.$set(obj, key, res.data[0][key])
                  }
                }
              }
            }
          })
        } else {
          if (this.$store.state.caseInformation.preOnlyId) {
            fetchList({billId: this.$store.state.caseInformation.preOnlyId}).then(res => {
              if (res.data.length) {
                let obj = this.list.find(item => item['billId'] === res.data[0]['billId'])
                if (obj) {
                  for (var key in obj) {
                    if (key != 'sid') {
                      this.$set(obj, key, res.data[0][key])
                    }
                  }
                }
                this.columnDefs.push({})
                this.columnDefs.pop()
                // this.list.push({})
                // this.list.pop()
                this.getSummary(this.gridApi.rowModel.rootNode.childrenAfterFilter.map(item => item.data))
              }
            })
          } else {
            this.queryList();
          }
        }
      }
    },
    commandMorebtn(type) {
      this.jumpDetailSubmisson(type)
    },
    jumpDetailSubmisson(type) {
      if (type == 0) {
        this.editBtnclick('6')
      }
      if (type == 1) {
        this.editBtnclick('1')
      }
      if (type == 3) {
        this.editBtnclick('3')
      }
      if (type == 4) {
        this.editBtnclick('4')
      }
    },
    editableTab(data) {
      if (data && data != 0) {
        this.myTabsActivity = true
      } else {
        this.myTabsActivity = false
      }
    },
    changePattern(e) {
      if (e === 1) {
        this.$store.commit('user/SET_PATTERN', false)
      } else {
        this.$store.commit('user/SET_PATTERN', true)
      }
    },
    brushRight() {

      let data = this.$commonUtils.getFilterModel(this.$options.name + this.$route.name, 'FilterModel')
      let arr = Object.keys(data)
      arr.forEach(item => {
        this.gridApi.destroyFilter(item)
      })
      this.$commonUtils.saveFilterModel(this.$options.name+this.$route.name,'FilterModel', {})
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
    rowDoubleClicked(params) {
      if(params.rowPinned == 'bottom')return;
      var row = params.data
      this.billData = {
        billId: row.billId
      }
      this.type = 'view'
      this.billDetailState = true

      // this.$router.push(`./creatBill/${row.billId}/view`)
    },
    changeSelection(n) {
      if (this.mbtitle == '境外账单') {
        this.rowSelection = 'single'
        if (n) {
          this.columnDefs.find(item => item.field == 'sid').checkboxSelection = function (params) {
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
      } else {
        this.rowSelection = 'multiple'
        if (n) {
          this.columnDefs.find(item => item.field == 'sid').checkboxSelection = function (params) {
            // we put checkbox on the name if we are not doing grouping
            return params.columnApi.getRowGroupColumns().length === 0;
          }
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
      }

    },
    getSelectedRows() {
      if (this.gridApi && this.gridApi.getSelectedNodes) {
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
      this.getAllWfs();
      let that = this
      this.$nextTick(() => {
        document.querySelector('.ag-body-viewport').onscroll = function (e) {
          that.scrollTopY = e.target.scrollTop
        }
      })
    },
    dragStopped(params) {
      let tableHeader = params.columnApi.columnController.gridColumns.map(item => ({
        label: item.colDef.headerName,
        width: item.actualWidth,
        prop: item.colDef.field,
      })).filter(item => item.prop != "group")
      var arr = JSON.parse(localStorage.getItem('tableHeader'))
      arr.find(item => item.name == this.$options.name + this.$route.name).tableHeader = tableHeader
      localStorage.setItem('tableHeader', JSON.stringify(arr))
      this.changeHeader(tableHeader)
      // console.log(a);
    },
    refreshEvenRowsCurrencyData(params) {
      this.getSummary(this.gridApi.rowModel.rootNode.childrenAfterFilter.map(item => item.data))
      this.currentPageSize = params.api.rowModel.rootNode.allChildrenCount
      this.gridApi.rowModel.rootNode.childrenAfterFilter&&this.gridApi.rowModel.rootNode.childrenAfterFilter.length&&this.gridApi.rowModel.rootNode.childrenAfterFilter.forEach(rowNode => {
        setTimeout(() => {
          rowNode.setDataValue(
            'sid',
            rowNode.rowIndex + 1)
        }, 0)
      });
      // if (!params.columnApi.columnController.groupAutoColumns) {
      // setTimeout(() =>{
      //   this.gridApi.forEachNode(rowNode => {
      //     rowNode.setDataValue(
      //       'sid',
      //       rowNode.rowIndex + 1)
      //   });
      // }, 0)
      // }
      if (this.list.length) {
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
      }else{
        this.brushRightHasFilter = false
      }
      this.$nextTick(() => {
        this.pinnedBottomRowDataFunc()
      })
    },
    getContextMenuItems(params) {
      if (!params.node.data) {
        return []
      }
      // console.log(params.node.data,this.$router.name,1);
      return this.getRowContextmenuList(params.node.data).map(item => ({
        name: item.name,
        action: () => {
          if (item.action == 'toExamine') {
            this[item.action](params.node.data, item.taskNo)
          } else {
            this[item.action](params.node.data, params.value, params)
          }
        },
      }))
    },
    changeTicket(row){
      this.$emit('changeTicket', row)
    },
    editRemarksEvent(row){
      this.editBtnclick('6', row)
    },
    getRowContextmenuList(row) {
      let list = []
      if(this.isFinance){
        list = [
          // {name: '暂存', action: 'temporarStorage'},
          {name: '暂存', action: 'temporarStorageAll'},
          {name: '隐藏', action: 'hidden'},
          {name: '隐藏(批量)', action: 'hiddenAll'},
          {name: '复制', action: 'copy'},
          {name: '查看文档', action: 'preView'},
          {name: '修改文档', action: 'editView', permissions: 163},
          {name: '修改', action: 'editBill', permissions: 163},
          {name: '删除', action: 'handledeleElement', permissions: 164,},
          {name: '提交', action: 'toExamine', permissions: 22, taskId: true, taskNo: 1},
          {name: '组长审核', action: 'toExamine', permissions: 243, taskId: true, taskNo: 2},
          {name: '账单岗审核', action: 'toExamine', permissions: 244, taskId: true, taskNo: 3},
          {name: '财务审核', action: 'toExamine', permissions: 245, taskId: true, taskNo: 4},
          {name: '承办组审核', action: 'toExamine', permissions: 246, taskId: true, taskNo: 5},
          {name: '重新确认比例', action: 'toExamine', permissions: 243, taskId: true, taskNo: 6},
          {name: '填写备注', action: 'editRemarksEvent', permissions: 155},
          {name: '改签', action: 'changeTicket'},
        ]
      }else{
        list = [
          // {name: '暂存', action: 'temporarStorage'},
          {name: '暂存', action: 'temporarStorageAll'},
          {name: '隐藏', action: 'hidden'},
          {name: '隐藏(批量)', action: 'hiddenAll'},
          {name: '复制', action: 'copy'},
          {name: '查看文档', action: 'preView'},
          {name: '修改文档', action: 'editView', permissions: 163},
          {name: '提交', action: 'toExamine', permissions: 22, taskId: true, taskNo: 1},
          {name: '组长审核', action: 'toExamine', permissions: 243, taskId: true, taskNo: 2},
          {name: '账单岗审核', action: 'toExamine', permissions: 244, taskId: true, taskNo: 3},
          {name: '财务审核', action: 'toExamine', permissions: 245, taskId: true, taskNo: 4},
          {name: '承办组审核', action: 'toExamine', permissions: 246, taskId: true, taskNo: 5},
          {name: '重新确认比例', action: 'toExamine', permissions: 243, taskId: true, taskNo: 6},
          {name: '修改', action: 'editBill', permissions: 163},
          {name: '删除', action: 'handledeleElement', permissions: 164,}]
      }
      return list.filter(item => {
        if (item.permissions) {
          if (item.taskId) {
            if (row.taskList) {
              return this.$store.getters.permissions.includes(item.permissions) && (row.taskList.find(i => i.taskNo == item.taskNo))
            } else {
              return false
            }
          } else {
            if (item.name == '修改文档') {
              if (row.address) {
                return this.$store.getters.permissions.includes(item.permissions)
              } else {
                return false
              }
            } else {
              return this.$store.getters.permissions.includes(item.permissions)
            }
          }

        } else if (item.name == '查看文档' && !row.address) {
          return false
        } else {
          // if(item.name=='查看文档'&&row.address&&this.$store.getters.permissions.includes(163)){
          //   return false
          // }
          return true
        }
      })
    },
    hiddenAll() {
      let list = this.gridApi.getSelectedRows()
      this.list = this.list.filter(item => !list.includes(item))
      this.$nextTick(() => {
        this.currentPageSize = this.gridApi.rowModel.rootNode.allChildrenCount
      })
    },
    temporarStorage(row, column, event) {
      this.$store.commit('tabs/CHANGE_STORAGETABLE', {
        type: 'push',
        title: '暂存账单',
        name: '暂存账单',
        identification: this.identification,
        data: row
      })
      this.$refs.myTabs.tabClick({name: '暂存账单'}, true)
    },
    temporarStorageAll() {
      if(!this.gridApi.getSelectedRows().length){
        this.$message.error('请选择账单！')
        return
      }
      let list = this.gridApi.getSelectedRows()
      list.forEach(item => {
        this.temporarStorage(item)
      })
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
      }
    },
    hidden(row) {
      this.list = this.list.filter(item => item[this.getCurFilterId(this.pageTitle)] != row[this.getCurFilterId(this.pageTitle)])
      // this.caseList.splice(this.caseList.indexOf(row),1)
      this.currentPageSize -= 1
    },
    toExamine(row, taskNo) {
      this.billData = {
        billId: row.billId,
        taskId: row.taskList.find(item => item.taskNo == taskNo).taskId,
        taskNo
      }
      this.type = 'edit'
      if (taskNo == 6 || taskNo == 5) {
        this.type = 'view'
        this.billData.billAllocation = true
      }
      this.billDetailState = true
      // this.$router.push({path:`/workbench/finance/creatBill/${row.billId}/edit`, query:{taskId: row.taskList.find(item=>item.taskNo==taskNo).taskId, taskNo }})
      // batchdoBillTaskUrl({
      //   taskIdList: row.taskId,
      //   result: 1,
      // }).then(response => {
      //   // this.$message.success(response.message);
      //   this.handleSearch(1);
      // });
    },
    preView(row) {
      if (row.address) {
        let data = row
        let url = data.address
        if (getProgID(url) || ['eml', 'msg'].includes(url.replace(/.+\./, '').toLocaleLowerCase())) {
          if (['doc', 'docx'].includes(url.replace(/.+\./, '').toLocaleLowerCase())) {
            this.$commonUtils.viewPdf(`${url}`)
          } else {
            let flag = ''
            if (data.mailId) {
              flag = 'mailId'
            } else if (data.materialId) {
              flag = 'materialId'
            }
            url = url.replace(/&/g, '%26')
            window.open(`#/preView?address=ipdoc${url}&${flag}=${data[flag]}`.replace(/[+]/g, '%2B'))
          }
          // doEditInOffice(url, getProgID(url))
        }else
        if (['pdf', 'jpg', 'png'].some(item => row.address.replace(/.+\./, "").toLocaleLowerCase() == item)) {
          this.pdfDataState = false
          this.pdfData = `ipdoc${row.address}`
          this.$nextTick(() => {
            this.pdfDataState = true
          })
        } else {
          if (['doc', 'docx'].includes(row.address.replace(/.+\./, "").toLocaleLowerCase())) {
            this.$commonUtils.viewPdf(`${row.address}`)
          } else {
            this.pdfDataState = false
            this.$commonUtils.downLoadAll({url: `ipdoc${row.address}`})
            // window.open(`#/preView?address=ipdoc${url}`.replace(/[+]/g,'%2B'))
          }

        }
      }
    },
    editView(row) {
      checkPermission({billId: row.billId}).then(res => {
        if (res.data.modify == 0) {
          this.$message.error('该文档您无法修改')
        } else {
          if (row.address) {
            if (['pdf', 'jpg', 'png'].some(item => row.address.replace(/.+\./, "").toLocaleLowerCase() == item)) {
              this.pdfDataState = false
              this.pdfData = `ipdoc${row.address}`
              this.$nextTick(() => {
                this.pdfDataState = true
              })
            } else {
              this.pdfDataState = false
              if (getProgID(`${row.address}`)) {
                recordOnlienEdit({materialId: row.materialId})
                doEditInOffice(`${row.address}`, getProgID(`${row.address}`))
              } else {
                this.pdfDataState = false
                this.$commonUtils.downLoadAll({url: `ipdoc${row.address}`})
              }
            }
          }
        }
      })

    },
    copy(row, value) {
      if (value) {
        this.$copyText(String(value)).then(
          res => {
          })
      }
    },
    editBill(row) {
      checkPermission({billId: row.billId}).then(res => {
        if (res.data.modify == 0) {
          this.$message.error('该账单您无法修改')
        } else {
          this.billData = {
            billId: row.billId
          }
          this.type = 'edit'
          this.billDetailState = true
          // this.$router.push(`./creatBill/${row.billId}/edit`)
        }
      })
    },
    handleSearch(flag) {
      if(typeof flag == 'object'){
        const { searchType, searchData } = flag
        if (searchData.billwfStatus) {
          delete this.queryModuleData.queryCurrMonth
          delete this.queryModuleData.queryCurrYearMyWkg
        }
        if (searchData.queryCurrMonth) {
          delete this.queryModuleData.billwfStatus
          delete this.queryModuleData.queryCurrYearMyWkg
        }
        if(searchData.queryCurrYearMyWkg){
          delete this.queryModuleData.queryCurrMonth
          delete this.queryModuleData.billwfStatus
        }
        this.queryModuleData = Object.assign(this.queryModuleData, searchData)
        if(searchType !== undefined){
          this.operationState = searchType
        }
      }else {
        this.operationState = flag
      }
      this.drawerState = false
      this.selectionState = false;
      this.listQuery.pageNo = 1;
      this.queryList();
      if (JSON.parse(localStorage.getItem('queryModuleData'))) {
        var arr = JSON.parse(localStorage.getItem('queryModuleData'))
      } else {
        var arr = []
      }
      if (arr.find(item => item.name == this.$route.name)) {
        arr.find(item => item.name == this.$route.name).queryModuleData = this.queryModuleData
      } else {
        arr.push({name: this.$route.name, queryModuleData: this.queryModuleData})
      }
      localStorage.setItem('queryModuleData', JSON.stringify(arr))
    },
    clearSearch(that) {
      for (var key in that.queryModuleData) {
        if (!['billwfStatus'].includes(key)) {
          // for (var key in that.queryModuleData) {
          if(key.includes('Date') && key.includes('Array')){
            that.$set(that.queryModuleData,key,['',''])
          }else if (key.includes('Array') || key.includes('List')) {
            that.$set(that.queryModuleData, key, [])
          } else if (key === 'caseTypeIds' || key === 'deptGroupIds' || key === 'caseGroupIds') {
            that.$set(that.queryModuleData, key, [])
          } else {
            that.$set(that.queryModuleData, key, null)
          }
          // }
        }
      }
      if (that.$refs.multiCascader) {
        that.$refs.multiCascader.forEach(item => {
          item.$el.querySelector('.el-input__inner').value = ''
        })
      }
      //this.listQuery.pageNo = 1;
      // this.queryList();
    },
    createInvoiceClose(e) {
      this.createInvoiceState = false
    },
    undateSearch(n) {
      if (this.bussId == n.bussId) {
        this.queryModuleData = JSON.parse(n.value)
        this.handleSearch(0)
        this.queryFilterConfig()
      }

    },
    filterCheck(val) {
      this.filterText = val;
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
            this.queryList();
          }
          this.getAllWfs();
        }
      });
    },
    checkBox(e, property, values) {
      if (this.queryModuleData[property].includes('') && this.queryModuleData[property].filter(item => item).length != values.filter(item => item).length) {
        this.queryModuleData[property] = this.queryModuleData[property].filter(item => item)
      }
      if (e[e.length - 1] == '') {
        this.queryModuleData[property] = values.map(item => item.id)
      }
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
            this.queryList();
          }
          this.getAllWfs();
        }
      });
    },
    handleCheckboxState() {
      this.checkboxState = !this.checkboxState;
    },
    handleSelectionAll(val) {
      // val = val.filter(item => item !== undefined);
      // this.multipleSelection = this.unique(
      //   this.multipleSelection.concat(val),
      // );
      // if (!val.length) {
      //   this.caseList.forEach(row => {
      //     this.multipleSelection = this.multipleSelection.filter(
      //       item =>
      //         item['billId'] !==
      //         row['billId']
      //     );
      //   });
      // }
    },

    handleSelectionChange(val, row) {
      if (!val.find(item => item['billId'] === row['billId'])) {
        this.$refs.todoTaskMultiple.newTableStore.states.selection = this.$refs.todoTaskMultiple.newTableStore.states.selection.filter(item => item !== row)
        this.startRow = ''
      } else {
        this.startRow = row['billId']
      }
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
    leftCheckChange(e) {
      // if (e.length + this.transferValue.length > 15) {
      //   this.$message({
      //     type: "warning",
      //     message: `您最多选择15项`
      //   });
      //   e.pop();
      // }
    },
    clickoutside() {
      this.drawerState = false
    },
    // 按下鼠标开始拖动
    handleMouseDown(e, column) {
      e.target.parentNode.parentNode.childNodes[1].click()
      this.dragState.dragging = true
      this.dragState.start = parseInt(column.columnKey)

      // 给拖动时的虚拟容器添加宽高
      let table = document.getElementsByClassName('w-table')[0]
      let virtual = document.getElementsByClassName('virtual')
      for (let item of virtual) {
        item.style.height = item.parentElement.clientHeight - 1 + 'px'
        item.style.width = item.parentElement.clientWidth + 'px'
        item.style.left = '10px'
        // item.innerText=item.parentElement.parentElement.innerText
      }
    },

// 鼠标放开结束拖动
    handleMouseUp(e, column) {
      this.dragState.end = parseInt(column.columnKey) // 记录起始列
      this.dragColumn(this.dragState)
      // 初始化拖动状态
      this.dragState = {
        start: -1,
        end: -1,
        move: -1,
        dragging: false,
        direction: undefined
      }
    },
// 拖动中
    handleMouseMove(e, column) {
      if (this.dragState.dragging) {
        let index = parseInt(column.columnKey) // 记录起始列
        if (index - this.dragState.start !== 0) {
          this.dragState.direction = index - this.dragState.start < 0 ? 'left' : 'right' // 判断拖动方向
          this.dragState.move = parseInt(column.columnKey)
        } else {
          this.dragState.direction = undefined
        }
      } else {
        return false
      }
    },
    // 拖动易位
    dragColumn({start, end, direction}) {
      if (start == -1) {
        return
      }
      let tempData = []
      let left = direction === 'left'
      let min = left ? end : start - 1
      let max = left ? start + 1 : end
      for (let i = 0; i < this.tableHeader.length; i++) {
        if (i === end) {
          tempData.push(this.tableHeader[start])
        } else if (i > min && i < max) {
          tempData.push(this.tableHeader[left ? i - 1 : i + 1])
        } else {
          tempData.push(this.tableHeader[i])
        }
      }
      if (start == end) {
        return
      }

      this.tableHeader = tempData
      this.$refs.todoTaskMultiple.newTableStore.states.filters = {}
      let arr = Array.from(this.$refs.todoTaskMultiple.$el.querySelectorAll('.is-sortable'))
      let classList = arr.map(item => Array.from(item.classList).find(itm => itm.includes('column')))
      this.$refs.todoTaskMultiple.newTableStore.states.columns.forEach(ii => {
        ii.filteredValue = []
      })
      this.tableHeader.forEach((item, index) => {
        classList.forEach((itm, idx) => {
          if (index == idx) {
            this.$refs.todoTaskMultiple.newTableStore.states.filters[itm] = this.filterDataSum[item.label]
            this.$refs.todoTaskMultiple.newTableStore.states.columns.forEach(ii => {
              if (ii.id == itm) {
                ii.filteredValue = this.filterDataSum[item.label]
              }
            })
          }
        })
      })
    },
    filterChange(a) {
      this.setTable()
      //  this.total=this.$refs.multipleTable.tableData.length
      //  console.log(this.$refs.multipleTable.tableData.length);
      for (var key in a) {
        this.tableHeader.forEach((item, index) => {
          if (index == key) {
            this.$set(this.filterDataSum, item.label, a[key])
            // this.filterDataSum[item.label]=a[key]
          }
        })
      }
    },
    setTable() {
      setTimeout(() => {
        this.$nextTick(() => {
          if (this.$refs.todoTaskMultiple.newTableStore.table.tableData.length < Math.ceil((this.clientHeight - 40) / 50)) {
            this.$refs.todoTaskMultiple.newTableStore.table.start = 0
            this.$set(this.$refs.todoTaskMultiple.newTableStore.table, 'end', Math.ceil((this.clientHeight - 40) / 50))

            this.$refs.todoTaskMultiple.setHeight()
            //this.$refs.caseListMultiple.newTableStore.table.end=this.$refs.caseListMultiple.newTableStore.table.tableData.length-1
          } else {
            this.$refs.todoTaskMultiple.newTableStore.table.start = 0
            this.$set(this.$refs.todoTaskMultiple.newTableStore.table, 'end', this.$refs.todoTaskMultiple.newTableStore.table.start + Math.ceil((this.clientHeight - 40) / 50))
            this.$refs.todoTaskMultiple.setHeight()
          }
        })
      })
    },
    filterHandler(value, row, column) {
      const property = column['property'];
      return row[property] === value;
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
          // this.tableState=false
          // this.$nextTick(()=>{
          //   //  this.tableState=true
          //   this.list.push({})
          //   this.list.pop()
          // })
        });
      }
      // this.selectColumnList=
      // console.log(this.selectColumnList);
      // this.savePreference(1)
    },
    saveLocation() {
      if (!localStorage.getItem('tableHeader')) {
        let arr = []
        arr.push({name: 'billList' + this.$route.name, tableHeader: this.tableHeader})
        localStorage.setItem('tableHeader', JSON.stringify(arr))
      } else {
        let arr = JSON.parse(localStorage.getItem('tableHeader'))
        if (arr.find(item => item.name == 'billList' + this.$route.name)) {
          arr.find(item => item.name == 'billList' + this.$route.name).tableHeader = this.tableHeader
          localStorage.setItem('tableHeader', JSON.stringify(arr))
        } else {
          arr.push({name: 'billList' + this.$route.name, tableHeader: this.tableHeader})
          localStorage.setItem('tableHeader', JSON.stringify(arr))
        }
      }
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
    headerDragend(newWidth, oldWidth, column, event) {
      var arr = JSON.parse(localStorage.getItem('tableHeader'))
      var header = arr.find(item => item.name == this.$options.name + this.$route.name).tableHeader
      if (header.find(item => item.label == column.label)) {
        header.find(item => item.label == column.label).width = newWidth
      }
      localStorage.setItem('tableHeader', JSON.stringify(arr))
    },
    checkNotAtAll() {
      this.checkCaseList = [];
    },
    setWidth() {
      let timer = setInterval(() => {
        if (this.$el.getElementsByClassName("el-select-dropdown")[0]) {
          const els = this.$el.getElementsByClassName("el-select-dropdown")[0];
          const els1 = this.$el.getElementsByClassName("checkbox")[0];
          els1.children[0].click();
          //els.style.width = '100px';
          clearInterval(timer);
        }
      }, 60);
    },
    setFilterItem(index) {
      this.checkFilterList.splice(index, 1, !this.checkFilterList[index]);
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
    renderHeader(createElement, {column}) {
      return createElement(
        'div', {
          'class': ['thead-cell'],
          on: {
            mousedown: ($event) => {
              this.handleMouseDown($event, column)
            },
            mouseup: ($event) => {
              this.handleMouseUp($event, column)
            },
            mousemove: ($event) => {
              this.handleMouseMove($event, column)
            }
          }
        }, [
          // 添加 <a> 用于显示表头 label
          createElement('a', column.label),
          // 添加一个空标签用于显示拖动动画
          createElement('span', {
            'class': ['virtual']
          })
        ])
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
      if (this.$route.query.custId) {
        // this.$set(this.queryModuleData, "custId", Number(this.$route.query.custId));
        // console.log(456)
        this.$set(this.queryModuleData, "custIdArray", [Number(this.$route.query.custId)]);
        this.operationState = 1
        //this.queryList();
      }
      if(this.queryModuleData.billwfStatus && this.queryModuleData.billwfStatus != 100){
        this.operationState = 1
      }
      if(this.queryModuleData.queryCurrYearMyWkg){
        this.operationState = 1
      }
      if(this.queryModuleData.queryCurrMonth){
        this.operationState = 1
      }
      if (this.$route.query.myCase) {
        this.$set(this.queryModuleData, "myCase", this.$route.query.myCase);
        // this.queryList();
      }
      if(this.$route.params&&this.$route.params.fenkai){
        this.$set(this.queryModuleData, "billwfStatus", '待提交');
      }
      if (JSON.parse(localStorage.getItem('queryModuleData'))) {
        var arr = JSON.parse(localStorage.getItem('queryModuleData'))
      } else {
        var arr = []
      }
      if (arr.find(item => item.name == this.$route.name)) {
        arr.find(item => item.name == this.$route.name).queryModuleData = this.queryModuleData
      } else {
        arr.push({name: this.$route.name, queryModuleData: this.queryModuleData})
      }
      localStorage.setItem('queryModuleData', JSON.stringify(arr))
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
            this.queryList()
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
    getAllWfs() {
      const data = {
        userId: this.userId,
        bussId: this.bussId
      };
      Promise.all([selectColumn(data), queryPreference(data)]).then(res => {
        this.selectColumnList = res[0].data;

        this.preferenceList = res[1].data;
        this.tableHeader = this.preferenceList.map(item => ({
          label: item.title,
          prop: item.value,
          width: this.getLoactionWidth(item.title)
        }))
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
        setTimeout(() => {
          this.columnDefs.forEach(item => {
            this.columnApi.getColumn(item.field).addEventListener('menuVisibleChanged', () => {
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
    cellRenderer(params) {
      if (params.node.rowPinned == 'bottom') {
        return `<span title="${params.value}" style="float: right">${(params.value || params.value === 0) ? params.value : ''}</span>`
      }
      if (params.colDef.field == 'sid' && params.value !== '') {
        return params.rowIndex + 1
      } else if (Object.prototype.toString.call(params.value).includes('Number')) {
        if (params.colDef.field == 'foreignSum') {
          return `<span title="${params.value}" style="float: right">${fomatFloat(+params.value, 1)}</span>`
        } else {
          return `<span title="${params.value}" style="float: right">${formatAmount(params.value)}</span>`
        }
      }
      if (params.colDef.field == 'materialName') {
        var eDiv = document.createElement('div');
        eDiv.innerHTML = `<span class="btn-simple" style="cursor: pointer;color: #00b0ff" title="${params.value}">${params.value ? params.value : ''}</span>`
        var eButton = eDiv.querySelectorAll('.btn-simple')[0];

        eButton.addEventListener('click', () => {
          if (params.data) {
            this.preView(params.data)
          }
        });

        return eDiv;
      }
      // if(params.colDef.field == 'sid'){
      //   return params.rowIndex+1
      // }
      if (params.data && params.colDef.field == 'agentNumString') {
        var eDiv1 = document.createElement('div');
        eDiv1.innerHTML = `<span class="btn-simple1" style="cursor: pointer;color: #00b0ff" title="${params.value}">${params.value ? params.value : ''}</span>`
        var eButton1 = eDiv1.querySelectorAll('.btn-simple1')[0];

        eButton1.addEventListener('click', () => {
          if (params.data) {
            this.takeCaseDetail(params)
          }
        });
        return eDiv1;
        // return `<a href="#/workbench/case/seeCaseDetail/${params.data.caseId}?taskType=${params.data.taskType}" target="_blank" title="${params.value}">${params.value?params.value:''} </a>`
      }
      return `<span title="${params.value}">${params.value ? params.value : ''}</span>`
    },
    takeCaseDetail(params) {
      // if (row.caseArray&&row.caseArray.length > 1) {
      //   this.selectCaseList = row.caseArray;
      //   this.selectCaseVisible = true;
      // } else {
      //   window.open(`#/workbench/case/seeCaseDetail/${row.caseId}?taskType=${row.taskType}`)
      //   // this.$router.push("/workbench/case/seeCaseDetail/" + row.caseId);
      //   this.selectCaseVisible = false;
      // }
      if (params.data['billId'] != this.currentId) {
        this.currentId = ''
        this.currentCaseId = ''
        queryBillUrl({billId: params.data.billId}).then(res => {
          this.caseList = res.data.caseArray
          this.taskType = res.data.caseArray[0].taskType
          this.currentId = params.data.billId
          this.currentCaseId = params.data.caseId
          this.caseType = params.data.caseTypeIdString
          this.caseTypeId = params.data.caseTypeId
          this.judgeRank = params.data.judgeRank
        })
        // this.$nextTick(()=>{
        //   this.currentId=params.data.billId
        //   this.currentCaseId=params.data.caseId
        //   this.caseType = params.data.caseTypeIdString
        //   this.caseTypeId = params.data.caseTypeId
        //   this.judgeRank = params.data.judgeRank
        //
        // })
      }
    },
    exportList(flag) {
      this.exportType = flag
      // if(flag==2){
      //   // this.multipleSelection.forEach(item=>{
      //   //   this.$refs.todoTaskMultiple.toggleRowSelection(item, false)
      //   // })
      //   this.showBottomBtn=9;
      //   this.selectionState=true;
      // } else if(flag == 1) {
      //   this.selectionOptionState=true
      // }
      this.selectionOptionState = true
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
      // if(property=='agentNumEnd'){
      //   this.handleSearch(1)
      // }
    },
    getMinWidth(data, header, currentId) {
      //  let arr=[...[String(data.label).replace(/[\u4E00-\u9FA5]/gi,'aa').length],...this.caseList.map(item => item[data.prop]).filter(item=>item).map(item=>String(item).replace(/[\u4E00-\u9FA5]/gi,'aa').length)]
      return String(data.label).replace(/[\u4E00-\u9FA5]/gi, 'aa').length * 12 + 30
    },
    queryList() {
      //  this.$refs.todoTaskMultiple.clearFilter();
      const data = {
        pageNo: this.listQuery.pageNo,
        pageSize: this.listQuery.pageSize
      }
      let conditionsModuleList = this.$commonUtils.getLanglist(this.conditionsModuleList.map(item => item.property).map(item => item.split(',')))
      for (var key in this.queryModuleData) {
        if (Object.prototype.toString.call(this.queryModuleData[key]).includes("Date")) {
          this.queryModuleData[key] = this.formatDate(this.queryModuleData[key]);
        }
        if (this.queryModuleData[key] === null) {
          delete this.queryModuleData[key]
        }
      }
      const querData = Object.assign(data, this.queryModuleData)
      if (this.operationState) {
        for (var key in querData) {
          if (!['business', 'pageNo', 'pageSize'].includes(key)) {
            if (!['billwfStatus', 'queryCurrMonth', 'queryCurrYearMyWkg'].includes(key)) {
              delete querData[key]
            }
            // if(key == 'belongToDateArrayOut'){
            //   querData.belongToDateArray = querData['belongToDateArrayOut']
            // }
          }
        }
      } else {
        for (var key in querData) {
          if (!['business', 'pageNo', 'pageSize'].includes(key)) {
            if (['billwfStatus', 'queryCurrMonth', 'queryCurrYearMyWkg'].includes(key) || (!conditionsModuleList.includes(key) && !['custName'].includes(key))) {//||![...this.conditionsModuleList.map(item=>item.property).map(item=>item.split(','))].includes(key)
              if (key == 'billwfStatus') {
                this.queryModuleData.billwfStatus = 100//''
              }
              // if(key == 'belongToDateArrayOut'){
              //    this.queryModuleData.belongToDateArrayOut = ['', '']
              // }
              delete querData[key]
            }
          }
        }
      }

      this.exportQueryModel = JSON.stringify(querData)

      // queryBillSum(querData).then(res=>{
      //   this.$store.commit('caseInformation/SET_SUMMARYDATA',{name:'bill',count:res.data})
      // })
      fetchList(querData).then(
        res => {
          res.data.forEach(item => {
            for (var key in item) {
              if (!item[key]) {
                item[key] = ''
              }
            }
          })
          // if(this.$refs.todoTaskMultiple.newTableStore.table.tableData.length<16){
          //   this.$refs.todoTaskMultiple.newTableStore.table.start=0
          //   this.$refs.todoTaskMultiple.newTableStore.table.end=16
          // }
          this.totalsh = 0
          this.totalzzd = 0
          this.total = res.total;
          this.list = res.data
          if (this.list.length) {
            this.getFilterModel()
          }
          this.$nextTick(() => {
            this.currentPageSize = this.gridApi.rowModel.rootNode.allChildrenCount
            this.getSummary(this.gridApi.rowModel.rootNode.childrenAfterFilter.map(item => item.data))
            this.pinnedBottomRowDataFunc()
          })
        }
      );
    },
    pinnedBottomRowDataFunc() {
      if(this.isFinance && this.gridApi.rowModel){
        const columnDisplay = ['paidLocal', 'billIn', 'billSum', 'serviceCost', 'officialCost', 'otherCost', 'serviceCostDiscount', 'foreignSum', 'actualExpense']
        this.pinnedBottomRowData = this.$commonUtils.pinnedBottomRowData(this.gridApi.rowModel.rootNode.childrenAfterFilter.map(item=>item.data), this.columnDefs, columnDisplay)
      }
    },
    getSummary(list) {
      let data = {
        billIn: this.getSum(list, 'billIn'),
        billSum: this.getSum(list, 'billSum'),
        foreignSum: this.getSum(list, 'foreignSum'),
        officialCost: this.getSum(list, 'officialCost'),
        otherCost: this.getSum(list, 'otherCost'),
        serviceCost: this.getSum(list, 'serviceCost'),
        serviceCostTotal: this.getSum(list, 'serviceCostDiscount'),
      }
      this.$store.commit('caseInformation/SET_SUMMARYDATA', {name: 'bill', count: data})
    },
    getSum(list, type) {
      return list.map(item => item[type]).filter(item => !!item).reduce((x, y) => x + y, 0)
    },
    getList(type) {
      if (type == "search") {
        this.listQuery.pageNo = "1";
        this.selectionState = false;
        this.showBottomBtn = false;
        this.mbshow = false
      }
      this.listLoading = true;
      let casearr = [];
      if (this.listQuery.caseTypeId) {
        casearr = this.listQuery.caseTypeId;
        this.listQuery.caseTypeId = this.listQuery.caseTypeId[
        this.listQuery.caseTypeId.length - 1
          ];
      }
      // this.total = 0;
      this.totalzzd = 0;
      this.totalsh = 0;

      fetchList(this.listQuery).then(response => {
        this.listQuery.caseTypeId = casearr;
        this.list = response.data;
        if (this.list.length) {
          this.getFilterModel()
        }
        this.total = response.total;
        this.listLoading = false;
        this.currentPageSize = this.gridApi.rowModel.rootNode.allChildrenCount
        // this.selectionState = false;
      });
    },
    mbmorebtn(item) {
      // this.queryList();
      // this.selectionState = true; this.showBottomBtn = true; this.mbshow = true;
      this.mbtitle = item.name;
      this.mbcode = item.code;
      this.scmbClick(10)
    },
    getTaskList(taskNo) {
      return this.getSelectedRows().map(item => {
        if (item.taskList.find(itm => itm.taskNo == taskNo && itm.taskCandidates.includes(this.$store.getters.userId + ''))) {
          return item.taskList.find(itm => itm.taskNo == taskNo && itm.taskCandidates.includes(this.$store.getters.userId+'')).taskId
        } else {
          this.$message.error(`${item.billNo}该账单不符合该流程`)
          return false
        }
      }).filter(item => !!item)
    },
    scmbClick(checkFlag) {
      if (!this.getSelectedRows().length) {
        this.$message.error("请先选择！");
        return;
      }
      if (this.mbtitle === '开具发票') {
        this.createInvoiceState = true
      } else if (this.mbtitle === '提交' || this.mbtitle.includes('审核') || this.mbtitle.includes('确认比例')) {
        if(!this.getTaskList(this.taskNo) || this.getTaskList(this.taskNo)&&!this.getTaskList(this.taskNo).length){
          this.$message.error('您不是当前任务的任务人!')
          return
        }
        batchdoBillTaskUrl({
          taskIdList: this.getTaskList(this.taskNo),//this.getSelectedRows().map(item => item.taskId),
          result: 1,
        }).then(response => {
          // this.$message.success(response.message);
          this.changeGridData(this.getSelectedRows().map(item => item.billId) + '')
          // this.handleSearch(1);
        });
      } else if (this.mbtitle === '境外账单') {
        this.$router.push(`/workbench/finance/addOverseasBill/1?billNo=${this.getSelectedRows().map(item => item.billNo).join(",")}`)
      } else if (this.mbtitle === '编辑备注') {
        this.editRemarksState = true
        this.editRemarks = this.getSelectedRows()[0].memo
      } else {
        createBillTemplateUrl({
          billIds: this.getSelectedRows().map(item => item.billId).join(","),
          code: this.mbcode,
          checkFlag: checkFlag
        }).then(res => {
          if (res.messageType == -6) {
            this.$confirm(`${res.message}`, {
              distinguishCancelAndClose: true,
              cancelButtonText: '否',
              confirmButtonText: '是'
            })
              .then(() => {
                this.scmbClick(30)
              })
              .catch((e) => {
                if (e == 'cancel') {
                  this.scmbClick(20)
                } else {
                  this.selectionState = false;
                  this.showBottomBtn = false;
                  this.mbshow = false;
                  this.mbtitle = '';
                  this.mbcode = '';
                  // this.$commonUtils.downManyFile(res.data)
                }// console.log(e);
              });
            return
          }
          this.$message.success(res.message);
          // this.queryList()
          this.changeGridData(this.getSelectedRows().map(item => item.billId) + '')
          this.selectionState = false;
          this.showBottomBtn = false;
          this.mbshow = false;
          this.mbtitle = '';
          this.mbcode = '';
          if(res.data && res.data.length > 1){
            this.$commonUtils.downManyFile(res.data)
          }else if(res.data && res.data.length === 1){
            if (getProgID(`${res.data[0].localFilePath}`)) {
              recordOnlienEdit({materialId: this.getSelectedRows().materialId})
              doEditInOffice(`${res.data[0].localFilePath}`, getProgID(`${res.data[0].localFilePath}`))
            } else {
              this.$commonUtils.downManyFile(res.data)
            }
          }

          // res.data.forEach((item, index) => {
          //   axios.get(`ipdoc${item.localFilePath}`, {            responseType: 'blob', headers: {
          //       "Content-Type": "application/json; charset=utf-8",
          //     }          }).then(function (res) {
          //
          //     jsFileDownload(res.data, item.localFilePath.replace(/(.*\/)*([^.]+).*/ig, "$2", '') + '.' + item.localFilePath.replace(/.+\./, ""));
          //   })
          // })
        });
      }
    },
    returnToExamin(flag, taskNo) {
      if(!this.getTaskList(taskNo) || this.getTaskList(taskNo)&&!this.getTaskList(taskNo).length){
        this.$message.error('您不是当前任务的任务人!')
        return
      }
      batchdoBillTaskUrl({
        taskIdList: this.getTaskList(taskNo),
        failReasion: this.failReasion,
        result: flag,
      }).then(response => {
        // this.$message.success(response.message);
        this.changeGridData(this.getSelectedRows().map(item => item.billId) + '')
        // this.handleSearch(1);
      });
    },
    rowClick(row, column, event) {
      // console.log(row);
      // if(this.selectionState){
      //   if(this.multipleSelection.find(item=>item['billId']==row['billId'])){
      //     this.multipleSelection=this.multipleSelection.filter(item=>item['billId']!=row['billId'])
      //     this.$refs.todoTaskMultiple.toggleRowSelection(row, false)
      //   } else {
      //     this.multipleSelection.push(row)
      //     this.$refs.todoTaskMultiple.toggleRowSelection(row, true)
      //   }
      // }
      if (this.selectionState) {
        if (this.$refs.todoTaskMultiple.newTableStore.states.selection.find(item => item == row)) {
          this.$refs.todoTaskMultiple.toggleRowSelection([{row: row, selected: false}])
          this.$refs.todoTaskMultiple.newTableStore.states.selection = this.$refs.todoTaskMultiple.newTableStore.states.selection.filter(item => item !== row)
          this.startRow = ''
        } else {
          row.plChoose = true
          this.$refs.todoTaskMultiple.toggleRowSelection([{row: row, selected: true}])
          var flag = true

          if (event.shiftKey) {
            if (this.startRow) {
              this.lastRow = row['billId']
              if (this.lastRow == this.startRow) {
                this.lastRow = ''
              }
            }
            if (!this.startRow && flag) {
              this.startRow = row['billId']
              return
            }
            this.tableselectRow(this.rowList)
            this.rowList = []

          } else {
            if (!this.startRow && flag) {
              this.startRow = row['billId']
            }
            if (this.startRow) {
              this.startRow = row['billId']
            }
          }
        }
      }
    },
    tableselectRow() {
      let indexOfList = [this.$refs.todoTaskMultiple.newTableStore.table.tableData.map(item => Number(item['billId'])).indexOf(Number(this.startRow)), this.$refs.todoTaskMultiple.newTableStore.table.tableData.map(item => Number(item['billId'])).indexOf(Number(this.lastRow))].sort((a, b) => a - b)
      this.rowList = this.$refs.todoTaskMultiple.newTableStore.table.tableData.filter((item, index) => index >= indexOfList[0] && index <= indexOfList[1])
      let newSet = new Set(this.$refs.todoTaskMultiple.newTableStore.states.selection)
      this.rowList.forEach(itm => {
        if (!newSet.has(itm)) {
          if (!itm.plChoose) {
            itm.plChoose = true
          }
          this.$refs.todoTaskMultiple.newTableStore.states.selection.push(itm)
        }
      })
      this.startRow = ''
      this.lastRow = ''
    },
    handleChange(boolean) {
      if (!boolean) {
        this.checkboxState = false;
        // const els1 = this.$el.getElementsByClassName("checkbox")[0];
        // els1.children[0].click();
      }
    },
    remotepaternalUnit(query) {
      if (query !== "") {
        queryCustomerNameIdUrl({keyword: query, isCustomer: 1}).then(response => {
          if (response.success) {
            this.seletData.custnames = response.data;
          } else {
            this.$message.error(response.message);
          }
        });
      }
    },

    remotepaternalUnitapp(query) {
      if (query !== "") {
        queryAllUrl({applicantName: query, orderBy: 1}).then(response => {
          if (response.success) {
            this.seletData.apps = response.data;
          } else {
            this.$message.error(response.message);
          }
        });
      }
    },

    // clearSearch() {
    //   this.listQuery = Object.assign({}, defaultData);
    //
    //   // this.total = "0";
    // },
    shbtnclick() {
      this.queryModuleData.billwfStatus = ''
      cancelrequest("fetchList");
      this.shSeach();
    },
    zzdDialogShow() {
    },
    editzzd() {
      this.formLabelAlignzzd.billIds = this.getSelectedRows()
        .map(item => item.billId)
        .join(",");
      createSumBillNoUrl(this.formLabelAlignzzd).then(res => {
        this.$message.success(res.message);
        this.dialogVisiblezzd = false;
        this.listQueryzzd = Object.assign({}, this.listQuery);
        this.getzzdlist();
      });
    },
    editrq() {
      const data = {billIds: this.getSelectedRows().map(item => item.billId).join(",")}
      if (this.formLabelAlign.billDate) {
        data.billDate = this.formLabelAlign.billDate
      }
      if (this.formLabelAlign.belongToDate) {
        data.belongToDate = this.formLabelAlign.belongToDate
      }
      updateBillDateAndBelongToDateUrl(data).then(res => {
        this.$message.success(res.message);
        if (this.formLabelAlign.billDate) {
          this.propsChange('billDate', this.formLabelAlign.billDate)
        }
        if (this.formLabelAlign.belongToDate) {
          this.propsChange('belongToDate', this.formLabelAlign.belongToDate)
          this.propsChange('belongToDateShort', this.formLabelAlign.belongToDate.slice(0,7))
        }
        this.dialogVisiblerq = false;
        // this.clearSearch();
      });
    },
    propsChange(type, value) {
      this.list.forEach(item => {
        if (this.getSelectedRows().map(itm => itm.billId).includes(item.billId)) {
          this.$set(item, type, value)
        }
      })
      this.list.push({})
      this.list.pop()
    },
    editmome() {
      updateBillRemarksUrl({
        billIds: this.getSelectedRows().map(item => item.billId).join(","),
        remarks: this.editremarks
      }).then(res => {
        this.$message.success(res.message);
        // this.list.forEach(item=>{
        //   if(this.getSelectedRows().map(itm => itm.billId).includes(item.billId)){
        //     this.$set(item,'remarks',this.editremarks)
        //   }
        // })
        this.propsChange('remarks', this.editremarks)
        this.dialogVisible = false;
        // this.clearSearch();
      });
    },
    shSeach() {
      this.selectionState = true;
      this.showBottomBtn = 7;
      this.list = [];
      this.listLoading = true;
      this.total = 0;
      this.totalzzd = 0;
      querydotaskBillUrl(this.listQuery).then(response => {
        this.list = response.data;
        this.totalsh = response.total;
        this.listLoading = false;
        this.currentPageSize = this.gridApi.rowModel.rootNode.allChildrenCount
      });
    },
    getselectdata() {
      queryCaseType().then(res => {
        this.caseTypeOptions = res.data; // this.getTreeData()
      });
      querywfUserNameUrl().then(response => {
        if (response.success) {
          this.seletData.usernames = response.data;
        } else {
          this.$message.error(response.message);
        }
      });
    },
    handleSelectionlistChange(val) {
      this.multipleSelection = val;
    },
    handledeleElement(item) {
      if (item.isHaveReceiptStr == '是') {
        this.$message.error('该账单已开发票，不能删除')
        return
      }
      checkPermission({billId: item.billId}).then(res => {
        if (res.data.delete == 0) {
          this.$message.error('该账单您无法删除')
        } else {
          this.$confirm("此操作将永久删除该账单, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              deleteBillUrl({billIds: [item.billId]}).then(response => {
                if (response.success) {
                  // const index = this.list.indexOf(item);
                  this.list.splice(this.list.indexOf(item), 1);
                  this.$message({
                    type: "success",
                    message: "删除成功"
                  });
                  this.currentPageSize = this.currentPageSize - 1
                  this.total = this.total - 1
                } else {
                  this.$message.error(response.message);
                }
              });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消删除"
              });
            });
        }
      })
    },
    morebtn(val) {
      this.selectionState = true;
      switch (val) {
        case "0":
          // this.queryList();
          this.showBottomBtn = 6;
          this.selectionState = true;
          break;
        case "1":
          // this.queryList();
          this.showBottomBtn = 1;
          this.selectionState = true;
          break;

        case "3":
          this.showBottomBtn = 3;
          cancelrequest("fetchList");
          this.getzzdlist();
          break;
        case "4":
          // this.queryList();
          this.showBottomBtn = 4;
          break;
        case "5":
          // this.queryList();
          this.showBottomBtn = 5;
          break;
        case "9":
          this.showBottomBtn = 9;
          this.selectionState = true;
          break;
        default:
          break;
      }
    },
    closeSelect(e) {
      this.selectionOptionState = false
      this.selectionState = false
      // if(e){
      //   this.selectionState = false
      // }
    },
    getzzdlist() {
      // this.listQueryzzd = Object.assign({}, defaultDatazzd);
      this.list = [];
      this.listLoading = true;
      this.total = 0;
      this.totalsh = 0;
      // this.totalzzd = 0;
      querySingleBillUrl(this.listQuery).then(response => {
        this.list = response.data;

        this.totalzzd = response.total;
        this.listLoading = false;
        this.currentPageSize = this.gridApi.rowModel.rootNode.allChildrenCount
        this.$nextTick(() => {
          this.getSummary(this.gridApi.rowModel.rootNode.childrenAfterFilter.map(item => item.data))
        })
      });
    },

    editBtnclick(val, row) {
      if (!this.getSelectedRows().length && !row) {
        this.$message.error("请先选择！");
        return;
      }
      switch (val) {
        case "6":
          this.dialogVisible = true;

          this.editremarks = row&&row.remarks || this.getSelectedRows()[0]&&this.getSelectedRows()[0].remarks
          break;
        case "1":
          this.dialogVisiblerq = true;
          break;

        case "3":
          checkIsSameCustUrl({
            billIds: this.getSelectedRows().map(item => item.billId).join(",")
          }).then(res => {
            this.formLabelAlignzzd = res.data;
            this.dialogVisiblezzd = true;
          });

          break;
        case "4":
          const balanceObj = {};
          this.jyList.forEach(item => {
            balanceObj[item.typeName] = item.id
          })
          const list = [...new Set(this.getSelectedRows().filter(i=>i.balanceStr).map(i=>i.balanceStr))]
          if(list.length === 1){
            this.formJY.balance = balanceObj[list[0]];
          }else if(list.length === 0){
            this.formJY.balance = 1887
          }else{
            this.formJY.balance = ''
          }
          this.dialogViewjy = true;
          break;
        case "5":
          break;
        case "7":
          this.shfunc("1");
          break;
        case "8":
          this.shfunc("0");
          break;
        case "9":
          this.selectionOptionState = true;

          break;
        default:
          break;
      }
    },
    takeInvoice() {
      this.selectionState = true;
      this.showBottomBtn = true;
      this.mbshow = true;
      this.mbtitle = '开具发票'
      this.scmbClick(10)
    },
    submission(key, taskNo) {
      // if(key=='提交'){
      //   this.queryModuleData.billwfStatus='待提交'
      // }
      // if(key=='组长审核'){
      //   this.queryModuleData.billwfStatus='待组长审核'
      // }
      // if(key=='账单岗审核'){
      //   this.queryModuleData.billwfStatus='待账单岗审核'
      // }
      // if(key=='财务审核'){
      //   this.queryModuleData.billwfStatus='待财务审核'
      // }
      // if(key=='承办组审核'){
      //   this.queryModuleData.billwfStatus='承办组组长退回'
      // }
      // this.handleSearch(1)
      // this.selectionState = true;
      // this.showBottomBtn = true;
      // this.mbshow = true;
      //

      if (key.includes('退回')) {
        return
      }
      this.mbtitle = key
      this.taskNo = taskNo
      this.scmbClick(10)
    },
    takeOverseasBills() {
      this.selectionState = true;
      this.showBottomBtn = true;
      this.mbshow = true;
      this.mbtitle = '境外账单'
      this.scmbClick(10)
    },
    updateBillRemarks() {
      this.selectionState = true;
      this.showBottomBtn = true;
      this.mbshow = true;
      this.mbtitle = '编辑备注'
    },
    shfunc(style) {
      if (!this.getSelectedRows()) {
        this.$message.error("请选择账单");
        return;
      }
      batchdoBillTaskUrl({
        taskIdList: this.getSelectedRows().map(item => item.taskId),
        result: style,
        agree: style
      }).then(response => {
        this.$message.success(response.message);
        this.changeGridData(this.getSelectedRows().map(item => item.billId) + '')
        // this.queryList();
        // this.shSeach();
      });
    },
    creatbtn(val) {
      if (val === "1") {
        this.$router.push("./off_bill/bill");
      }
      if (val === "2") {
        this.$router.push("./off_bill/insideBill");
      }
    },
    // 弹框账单创建
    billCreate(type) {
      this.pageType = type
      this.billCreateVisible = true
    },
    // 账单创建弹框关闭
    billCreateDialog() {
      this.billCreateVisible = false
      this.queryList()
    }
  }
};
</script>

<style lang="scss" scoped>
/*@import "~@/styles/mixin.scss";*/
.queryButton {
  display: flex;
  flex-wrap: nowrap;
  position: relative;
  justify-content: center;

  .buttonWrap_small {
    transform: translateX(-90px);
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

  .postInfo-container-item {

    /deep/ .el-form-item__content {
      width: 330px;
      display: flex;
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
  top: 33px;
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
  //background-color: #409eff;
  border-color: #409eff;
  // width: 66px;
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
  /*width: 92px;*/
  padding: 0 10px;
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
    transition: all 0.5s;
    //   width: 40%;
  }

  .right_wrap {
    box-shadow: 0px 0px 18px 0px rgba(64, 158, 255, 0.5);
    height: 598px;
    overflow: auto;
    transition: all 0.5s;
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
  position: relative;

  /deep/ .caret-wrapper {
    position: relative;
  }

  /deep/ .el-table__column-filter-trigger {
    position: relative;
  }

  /deep/ .el-table th {
    padding: 0;

    div {
      overflow: visible !important;
    }

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

  /deep/ .thead-cell {
    vertical-align: middle !important;
    padding: 0;
    display: inline-flex;
    flex-direction: column;
    align-items: self-start;
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

}

.searchWrap {
  min-height: 200px;
  max-height: 500px;
  position: relative;
  overflow: auto;

  /deep/ .el-form {
    padding-bottom: 10px;

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

}

.clearWrap {
  display: flex;
  justify-content: flex-end;
  width: 100%;
  background: #fff;
  right: 10px;
  /*padding-bottom: 10px;*/
  /*position: absolute;*/
  z-index: 1;
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

.searchRight {
  margin-left: 0;
  height: 32px;
  border-top-right-radius: 3px !important;
  border-bottom-right-radius: 3px !important;
  padding: 0 5px
}

.MyTabs {
  width: 100%;
  /*position: absolute;*/

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
      /*账单暂存页面显示超出的内容*/
      overflow: auto;
    }
  }
}

.MyTabs.activity {
  position: absolute;
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
    width: 50px;
    height: 30px;
  }
}

.noTrigger /deep/ .el-table__column-filter-trigger {
  display: none;
}

.form-con {
  .fullRow {
    width: 100%;

    .el-form-item {
      display: flex;
    }
  }
}

.brush_right {
  position: absolute;
  right: 6px;
  z-index: 1;
  top: -4px;
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

.exactButton {
  margin-top: 10px;
}

> > > .winClass {
  max-width: 800px !important;
}
</style>

