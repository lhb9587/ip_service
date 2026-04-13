<template>
  <div class="case_management_item" id="case_management_item">
    <ViewsSwitching class="ViewsSwitching" @changePattern="changePattern"></ViewsSwitching>
    <MyTabs :business="business" :buss-id="bussId" @editFun="editFun" @handleSelect="handleSelect" ref="myTabs" class="MyTabs" :page-title="pageTitle" :identification="identification" :defaultColumnDefs="deepCloneData" style="position: absolute" @editableTab="editableTab" :class="myTabsActivity?'activity':''" v-if="columnDefs.length&&(pageTitle=='案件管理' || pageTitle=='官方通知')" :getContextMenuItems="getContextMenuItems"></MyTabs>
    <div class="queryButton" style="width: 40%;margin: 0 auto" :class="myTabsActivity?'activity':''">
      <div class="buttonWrap_small">
        <!--<el-button size="small" @click="reset">重置</el-button>-->
        <!--<el-button id="mySearch" type="primary" size="small" @click="drawerState=true">搜索条件</el-button>-->
        <el-button-group class="button-group-search" :class="[searchState?'corRed':'']" v-clickoutside="clickoutside" >
          <el-button id="mySearch" type="primary" size="small" @click="handleSearch(0)" >搜索</el-button>
          <el-button type="primary" style="margin-left:0" class="searchRight"  size="small" icon="el-icon-arrow-down" @click.stop.prevent="drawerState=true"></el-button>
          <transition name="show" mode="out-in">
            <div class="searchWrap" id="searchWrap" v-show="drawerState">
              <div class="form-container">
                <template v-if="bussId != 60">
                  <el-form label-width="120px"  size="mini" @keyup.enter.native="handleSearch(0)">
                  <template v-if="pageTitle=='案件管理'||pageTitle=='官方通知'">
                    <el-form-item  label="案件文号:" class="postInfo-container-item">
                      <el-input type="text" clearable v-model="queryModuleData.agentNumStart" placeholder="请输入案件文号" @change="(value)=>changeTextRange(value,'agentNumEnd')"></el-input>
                      <span>至</span>
                      <el-input type="text" clearable v-model="queryModuleData.agentNumEnd"  placeholder="请输入案件文号"></el-input>
                    </el-form-item>
                    <el-form-item label="商标类别:" >
                      <el-input type="text" v-model="queryModuleData.goodClasses" clearable placeholder="请输入商标类别"></el-input>
                    </el-form-item>
                    <el-form-item label="商标号:" >
                      <el-input type="text" v-model="queryModuleData.regNumber" clearable placeholder="请输入商标号"></el-input>
                    </el-form-item>
                    <el-form-item label="商标名称:" >
                      <el-input type="text" v-model="queryModuleData.tmName" clearable placeholder="请输入商标名称"></el-input>
                    </el-form-item>
                  </template>
                  <template v-if="pageTitle=='递交官方'">
                    <el-form-item  label="案件文号:" class="postInfo-container-item">
                      <el-input type="text" v-model="queryModuleData.agentNumStart" clearable placeholder="请输入案件文号" @change="(value)=>changeTextRange(value,'agentNumEnd')"></el-input>
                      <span>至</span>
                      <el-input type="text" v-model="queryModuleData.agentNumEnd" clearable placeholder="请输入案件文号"></el-input>
                    </el-form-item>
                    <el-form-item label="商标名称:" >
                      <el-input type="text" v-model="queryModuleData['tmName']"  clearable placeholder="请输入商标名称"></el-input>
                    </el-form-item>
                  </template>
                </el-form>
                <div class="divdiver"></div>
                </template>
                <el-form size="mini" label-width="120px" @keyup.enter.native="handleSearch(0)" style="margin-top: 2px"  >
                  <el-form-item :label="item.filterName+':'"
                                :class="item.filterType==='radio'&&item.values.length>3?'fullItem':'postInfo-container-item'" v-for="item,index in conditionsModuleList" :key="index">

                    <el-select v-model="queryModuleData[item.property]" placeholder="请选择" v-if="item.filterType==='select'" filterable clearable>
                      <el-option v-for="itm in item.values" :key="itm.id" :label="itm.value" :value="itm.id">
                      </el-option>
                    </el-select>
                    <!--<el-checkbox-group style="display:flex" v-model="queryModuleData[item.property]" v-if="item.filterType==='checkbox'">-->
                    <!--<el-checkbox v-for="itm in item.values" :label="itm.value" :key="itm.id">{{itm.value}}</el-checkbox>-->
                    <!--</el-checkbox-group>-->
                    <el-select  v-if="item.filterType==='checkbox'&&item.values&&item.values.length"    v-model="queryModuleData[item.property]" reserve-keyword multiple placeholder="请选择"  filterable  clearable @change="(e)=>checkBox(e,item.property,item.values)">
                      <el-option v-for="itm in item.values" :key="itm.id" :label="itm.value" :value="itm.id">
                      </el-option>
                    </el-select>
                    <el-select v-if="item.filterType==='selectMany' && item.property !== 'custContactId'" v-model="queryModuleData[item.property]" reserve-keyword  filterable remote clearable  placeholder="请输入关键词" :remote-method="(queryString)=>{
            remoteMethod(queryString,index,item.property,item.filterName);
            }">
                      <el-option v-for="itm in item['valueList']" :key="itm.id" :label="itm.value" :value="itm.id">
                      </el-option>
                    </el-select>
                    <el-select v-if="item.filterType==='selectMultipleMany'" multiple v-model="queryModuleData[item.property]"  reserve-keyword filterable remote clearable placeholder="请输入关键词" :remote-method="(queryString)=>{
            remoteMethod(queryString,index,item.property,item.filterName);
            }">
                      <el-option v-for="itm in item['valueList']" :key="itm.id" :label="itm.value" :value="itm.id">
                      </el-option>
                    </el-select>
                    <template v-if="item.filterType==='selectMultipleManyTable' && item.property === 'custIdArray'">
                      <el-select v-if="item.filterType==='selectMultipleManyTable' && item.property === 'custIdArray' && !isDim" multiple v-model="queryModuleData[item.property]" reserve-keyword filterable remote clearable  placeholder="请输入关键词" :remote-method="(queryString)=>{
              remoteMethod(queryString,index,item.property,item.filterName); }">
                        <el-option disabled label="" value="-1">
                          <span v-for="(itmx,key) in getAppTitleList(item.filterName,item['valueList']?item['valueList'][0]:undefined)" v-if="key!='id'">
                          {{itmx}}
                          </span>
                        </el-option>
                        <el-option v-for="(itm,idx) in item['valueList']" :key="idx" :label="itm.value" :value="itm.id">
                          <el-tooltip v-for="(itmx,key) in item['valueList'][idx]" v-if="key!='id'" :key="key" class="item" effect="light" :content="itmx" placement="top">
                            <span>{{itmx}}</span>
                          </el-tooltip>
                        </el-option>
                      </el-select>
                      <el-input v-if="isDim" type="text" placeholder="请输入客户关键字" v-model="queryModuleData.custName"></el-input>
                      <el-checkbox :true-label="1" :false-label="0" v-model="isDim" label="模糊"></el-checkbox>
                    </template>
                    <!-- <template v-if="item.filterType==='selectTableMany' && (['custContactId','billCustContactId','billAddrId'].includes(item.property))">
                      <el-select v-model="queryModuleData[item.property]" reserve-keyword filterable remote clearable  placeholder="请输入关键词" :remote-method="(queryString)=>{
              remoteMethod(queryString,index,item.property,item.filterName); }">
                        <el-option disabled label="" value="-1">
                          <span v-for="(itmx,key) in getAppTitleList(item.filterName,item['valueList']?item['valueList'][0]:undefined)" v-if="key!='id'">
                          {{itmx}}
                          </span>
                        </el-option>
                        <el-option v-for="(itm,idx) in item['valueList']" :key="idx" :label="itm.value" :value="itm.id">
                          <el-tooltip v-for="(itmx,key) in item['valueList'][idx]" v-if="key!='id'" :key="key" class="item" effect="light" :content="itmx" placement="top">
                            <span>{{itmx}}</span>
                          </el-tooltip>
                        </el-option>
                      </el-select>
                      <el-input v-if="isDim" type="text" placeholder="请输入关键字" v-model="queryModuleData.custName"></el-input>
                    </template> -->
                    <el-select v-if="item.filterType==='selectMultipleManyTable' && item.property !== 'custIdArray'" multiple v-model="queryModuleData[item.property]" reserve-keyword filterable remote clearable  placeholder="请输入关键词" :remote-method="(queryString)=>{
            remoteMethod(queryString,index,item.property,item.filterName); }">
                      <el-option disabled label="" value="-1">
                        <span v-for="(itmx,key) in getAppTitleList(item.filterName,item['valueList']?item['valueList'][0]:undefined)" v-if="key!='id'">
                        {{itmx}}
                        </span>
                      </el-option>
                      <el-option v-for="(itm,idx) in item['valueList']" :key="idx" :label="itm.value" :value="itm.id">
                        <el-tooltip v-for="(itmx,key) in item['valueList'][idx]" v-if="key!='id'" :key="key" class="item" effect="light" :content="itmx" placement="top">
                          <span>{{itmx}}</span>
                        </el-tooltip>
                      </el-option>
                    </el-select>
                    <el-select v-if="item.filterType==='selectTableMany'"  v-model="queryModuleData[item.property]" reserve-keyword filterable remote clearable  placeholder="请输入关键词" :remote-method="(queryString)=>{
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
                    <template v-if="item.filterType==='selectTableMultipleMany' && item.property === 'appCnNameArray'">
                      <el-select v-if="item.filterType==='selectTableMultipleMany' && item.property == 'appCnNameArray' && !isAppDim" v-model="queryModuleData[item.property]" reserve-keyword multiple filterable remote clearable  placeholder="请输入关键词" :remote-method="(queryString)=>{
                          remoteMethod(queryString,index,item.property,item.filterName); }">
                        <el-option disabled label="" value="">
                          <span v-for="(itmx,key) in getAppTitleList(item.filterName,item['valueList']?item['valueList'][0]:undefined)" v-if="key!='id'" :key="key">
                          {{itmx}}
                          </span>
                        </el-option>
                        <el-option v-for="(itm,idx) in item['valueList']" :key="itm.id+idx" :label="itm.value" :value="itm.id">
                          <el-tooltip v-for="(itmx,key) in item['valueList'][idx]" v-if="key!='id'" :key="itmx+key" class="item" effect="light" :content="itmx" placement="top">
                            <span>{{itmx}}</span>
                          </el-tooltip>
                        </el-option>
                      </el-select>
                      <el-input v-if="isAppDim" type="text" placeholder="请输入申请人关键字" v-model="queryModuleData.appCnName"></el-input>
                      <el-checkbox :true-label="1" :false-label="0" v-model="isAppDim" label="模糊"></el-checkbox>
                    </template>
                    <el-select v-if="item.filterType==='selectTableMultipleMany' && item.property !== 'appCnNameArray'" v-model="queryModuleData[item.property]" reserve-keyword multiple filterable remote clearable  placeholder="请输入关键词" :remote-method="(queryString)=>{
            remoteMethod(queryString,index,item.property,item.filterName); }">
                      <el-option disabled label="" value="">
            <span v-for="(itmx,key) in getAppTitleList(item.filterName,item['valueList']?item['valueList'][0]:undefined)" v-if="key!='id'" :key="key">
            {{itmx}}
            </span>
                      </el-option>
                      <el-option v-for="(itm,idx) in item['valueList']" :key="itm.id+idx" :label="itm.value" :value="itm.id">
                        <el-tooltip v-for="(itmx,key) in item['valueList'][idx]" v-if="key!='id'" :key="itmx+key" class="item" effect="light" :content="itmx" placement="top">
                          <span>{{itmx}}</span>
                        </el-tooltip>
                      </el-option>
                    </el-select>
                    <el-select v-if="item.filterType==='selectTable'" v-model="queryModuleData[item.property]" filterable clearable placeholder="请选择">
                      <el-option v-for="itm ,idx in item.values" :key="idx" :label="itm.value" :value="itm.id" :disabled="itm.id==-1">
                        <span v-for="itmx ,key in item['values'][idx]" v-if="key!='id'">{{itmx}}</span>
                      </el-option>
                    </el-select>
                    <el-select v-model="queryModuleData[item.property]" placeholder="请选择" v-if="item.filterType==='selectCreate'" allow-create default-first-option filterable clearable>
                      <el-option v-for="itm in item.values" :key="itm.id" :label="itm.value" :value="itm.id">
                      </el-option>
                    </el-select>
                    <el-radio-group v-model="queryModuleData[item.property]" v-if="item.filterType==='radio'">
                      <el-radio :label="itm.id" v-for="itm,index in item.values" :key="index">{{itm.value}}</el-radio>
                    </el-radio-group>
                    <el-input clearable v-model="queryModuleData[item.property]" :placeholder="'请输入'+item.filterName" v-if="item.filterType==='text'"></el-input>
                    <el-input clearable v-model="queryModuleData[item.property]" :placeholder="'请输入'+item.filterName" type="textarea" v-if="item.filterType==='textarea'" @keyup.enter.native.stop="textareaEnter"></el-input>
                    <el-input clearable v-model="queryModuleData[item.property.split(',')[0]]" :placeholder="'请输入'+item.filterName" v-if="item.filterType==='textRange'"
                              @change="(string)=>changeTextRange(string,item.property.split(',')[1])"></el-input>
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
                          <el-tooltip  class="item" effect="light" :content="item.value" placement="top">
                            <div  :class="item.id==-1?'name0':'name'">{{ item.value }}</div>
                          </el-tooltip>
                          <el-tooltip  class="item" effect="light" :content="item.value1" placement="top">
                            <div :class="item.id==-1?'name0':'name'">{{ item.value1 }}</div>
                          </el-tooltip>
                          <el-tooltip  class="item" effect="light" :content="item.value2" placement="top">
                            <div  :class="item.id==-1?'name0':'name'">{{ item.value2 }}</div>
                          </el-tooltip>
                          <el-tooltip  class="item" effect="light" :content="item.value3" placement="top">
                            <div :class="item.id==-1?'name0':'name'">{{ item.value3 }}</div>
                          </el-tooltip>
                        </div>
                      </template>
                    </el-autocomplete>
                    <!--                  <el-cascader :change-on-select="true" :show-all-levels="false" v-if="item.filterType==='cascader'" collapse-tags filterable clearable v-model="queryModuleData[item.property]"-->
                    <!--                               :options="item.values" :props="defaultParams" placeholder="请选择"></el-cascader>-->
                  </el-form-item>
                </el-form>

              </div>
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

        <el-menu class="el-menu-demo" mode="horizontal" @select='(e)=>handleSelect(e)'  v-allow="83" >
          <el-submenu index="1">
            <template slot="title">新建</template>
            <el-submenu index="1-1" v-allow="152">
              <template slot="title">新建费用账单</template>
              <el-menu-item index="1-1-1" v-allow="180">账单</el-menu-item>
              <el-menu-item index="1-1-2" v-allow="181">内部账单</el-menu-item>
              <el-menu-item index="1-1-4" v-allow="229">境外账单</el-menu-item>
              <el-menu-item index="1-1-3">费用</el-menu-item>
            </el-submenu>
            <el-submenu index="1-2" >
              <template slot="title">新建案件进程</template>
              <el-menu-item index="1-2-1" v-if="$store.getters.permissions.includes(182) && bussId != 60">递交指令</el-menu-item>
              <el-menu-item index="1-2-2" v-allow="183" v-if="bussId != 60">官方通知</el-menu-item>
              <el-menu-item index="1-2-2-2" v-if="bussId != 60">递交官方(文件)</el-menu-item>
              <el-menu-item index="1-2-3"  >客户往来</el-menu-item>
              <el-menu-item index="1-2-4" >内部往来</el-menu-item>
              <el-menu-item index="1-2-8" v-if="pageTitle==='案件管理' && $store.getters.permissions.includes(423)">境外盈余核算</el-menu-item>
              <el-menu-item index="1-2-5" >外代所往来</el-menu-item>
              <el-menu-item index="1-2-6" >对方当事人往来</el-menu-item>
              <el-menu-item index="1-2-7" v-if="$store.getters.permissions.includes(378)">撰写指派</el-menu-item>
              <!--<el-menu-item index="1-2-7">特批预立卷审批</el-menu-item>-->
            </el-submenu>
            <el-submenu index="1-3" v-allow="154">
              <template slot="title">新建时限</template>
              <el-menu-item index="1-3-1" v-allow="190">官方时限</el-menu-item>
              <el-menu-item index="1-3-2" v-allow="191">内部时限</el-menu-item>
            </el-submenu>
          </el-submenu>

        </el-menu>
        <div v-if="pageTitle==='案件管理'" style="width: 87px;margin: 0 10px">
          <el-dropdown>
            <el-button type="primary" size="small">
              批量编辑<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item type="primary" size="small" v-show="$store.getters.permissions.includes(238)" @click.native="handleSelect('批量操作')" >批量编辑案件信息</el-dropdown-item>
              <el-dropdown-item type="primary" size="small"  @click.native="handleSelect('批量编辑客户')" >批量编辑客户信息</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <el-button type="primary" size="small" v-if="pageTitle==='递交官方'&&$store.getters.permissions.includes(237)" @click="handleSelect('批量操作')" >批量编辑</el-button>
        <el-button type="primary" size="small" v-if="pageTitle==='官方通知'&&$store.getters.permissions.includes(232)" @click="handleSelect('批量操作')" >批量编辑</el-button>
        <el-button type="primary" size="small" v-if="queryModuleData.submitStatus!=1"
                   v-show="(pageTitle==='递交官方'&&$store.getters.permissions.includes(182))" @click="toSubmit">递交</el-button>
        <el-button type="primary" size="small" v-if="queryModuleData.instructionSubmitStatus!=1"
                   v-show="(pageTitle==='递交官方'&&$store.getters.permissions.includes(80))" @click="toExamine">审核</el-button>
        <el-button type="primary" size="small" v-if="(pageTitle==='官方通知'&&$store.getters.permissions.includes(82))"
                   @click="toExamine">审核</el-button>
        <el-button type="primary" size="small" v-if="pageTitle==='官方通知'"
                   @click="handleSelect('文件下载')">下载</el-button>
        <el-button type="primary" v-if="pageTitle==='官方通知'&&$store.getters.permissions.includes(233)" size="small"   @click="takeManualIdentification">手动识别官文 {{officialInfoCount?'('+officialInfoCount+')':''}}</el-button>
        <el-button type="primary" v-if="pageTitle==='官方通知'&&$store.getters.permissions.includes(183)" size="small"   @click="handleSelect('文件上传排序')">文件上传 </el-button>
<!--        <el-menu class="el-menu-demo" mode="horizontal" @select="(e)=>handleSelect(e,[],true)" v-if="pageTitle==='官方通知'&&$store.getters.permissions.includes(183)" >-->
<!--          <el-submenu index="1">-->
<!--            <template slot="title">文件上传</template>-->
<!--            <el-menu-item index="文件上传排序">文件上传(排序)</el-menu-item>-->
<!--            <el-menu-item index="文件上传">文件上传</el-menu-item>-->
<!--          </el-submenu>-->
<!--        </el-menu>-->
        <exportFile v-if="bussId != 60" ref="exportFile" :downLoadState="downLoadState" :multipleSelection="getSelectedRows()" @getData="getExportFileData" @exportList="exportList" @close="closeSelect" :pageTitle="pageTitle" @multipleTypeText="changeMultiple"></exportFile>
<!--        <el-button v-if="pageTitle==='递交官方'" type="primary" size="small" @click="getExportFileData([{label:'案件类型',value:'caseTypeId'},{label:'上报事项',value:'reportMatter'}],'1-2')">报官清单</el-button>-->
        <el-menu class="el-menu-demo" mode="horizontal" @select="(e)=>handleSelect(e,[{label:'案件类型',value:'caseTypeId'},{label:'上报事项',value:'reportMatter'}])" v-if="pageTitle==='递交官方'" >
          <el-submenu index="1">
            <template slot="title">报官清单</template>
            <el-menu-item index="1-2">报官清单</el-menu-item>
            <el-menu-item index="1-3">批量报官清单</el-menu-item>
          </el-submenu>
        </el-menu>
        <el-popover
          width="400"
          trigger="click"
          v-show="pageTitle==='官方通知'"
          placement="bottom">
          <div style="position: relative;height: 200px;width: 100%">
            <OfficialDocuments></OfficialDocuments>
          </div>
          <el-button slot="reference" type="primary" size="small" v-show="$store.getters.permissions.includes(234)">官文录入</el-button>
        </el-popover>
        <el-popover
          width="400"
          trigger="click"
          v-show="pageTitle==='递交官方'"
          placement="bottom">
          <div style="position: relative;height: 200px;width: 100%">
            <OfficialDocuments isOfficialSub></OfficialDocuments>
          </div>
          <el-button slot="reference" type="primary" size="small">报官清单留底</el-button>
        </el-popover>
        <el-button  v-show="$store.getters.permissions.includes(278) && bussId != 60" type="primary" size="small" @click="deleteList">删除</el-button>
        <el-button type="primary"  v-allow='247' size="small" v-if="pageTitle==='案件管理' && bussId != 60"   @click="handleSelect('变更办案人')" >变更办案人</el-button>
        <el-menu class="el-menu-demo" mode="horizontal" @select='(e)=>handleSelect(e,[],true)' v-if="pageTitle!='官方通知' && bussId != 60"  >
          <el-submenu index="1">
            <template slot="title">文件上传</template>
            <el-menu-item index="1-2-2-2">递交官方(文件)</el-menu-item>
            <el-menu-item index="1-2-3"  >客户往来</el-menu-item>
            <el-menu-item index="1-2-4" >内部往来</el-menu-item>
            <el-menu-item index="1-2-5" >外代所往来</el-menu-item >
            <el-menu-item index="1-2-6" >对方当事人往来</el-menu-item>
          </el-submenu>
        </el-menu>
        <el-button v-if="pageTitle==='案件管理' && $store.getters.permissions.includes(374)" type="primary" size="small" @click="changeCusts">批量转客户</el-button>
        <el-button v-if="pageTitle==='案件管理' && $store.getters.permissions.includes(387)" type="primary" size="small" @click="changeCaseStage">修改案件阶段进展</el-button>
        <el-button v-if="pageTitle==='案件管理' && $store.getters.permissions.includes(388)" type="primary" size="small" @click="changeCaseType">修改案件类型</el-button>
        <el-button v-if="pageTitle==='案件管理'" type="primary" size="small" @click="setBrand">设置品牌</el-button>
        <el-popover
          width="400"
          trigger="click"
          v-if="$store.getters.permissions.includes(367)"
          v-show="pageTitle==='递交官方'"
          @hide="setHolidaysVisible = false"
          placement="bottom">
          <div style="position: relative;height: 200px;width: 100%">
            <SetHolidays v-if="setHolidaysVisible" isOfficialSub></SetHolidays>
          </div>
          <el-button slot="reference" type="primary" size="small" @click="setHolidaysVisible=true">设置节假日</el-button>
        </el-popover>
<!--        <el-button type="primary" size="small" v-if="pageTitle==='案件管理'" @click="importPrice">导入境外报价</el-button>-->
        <!--<i class="el-icon-rank" :style="{cursor: 'pointer',color:pattern?'#409EFF':'rgba(187,187,187)',transition:'all 0.5s',transform:pattern?'transform: rotate(180deg)':'transform: rotate(-180deg)'}" @click="changePattern"></i>-->
      </div>

    </div>
    <el-form label-width="120px"  @submit.native.prevent size="mini"  @keyup.enter.native="handleSearch(1)" style="margin-top:10px">
      <template v-if="pageTitle=='案件管理' && bussId != 60">
        <el-form-item label="我的案件:" style="margin-bottom: 0!important">
          <el-radio-group v-model="queryModuleData.myCase"@change="() => { this.$set(this.queryModuleData, 'regAndAgent', ''); handleSearch(1) }">
            <el-radio label="4">待立卷</el-radio>
            <el-radio label="2">最近三日浏览</el-radio>
            <el-radio label="3">当日立卷</el-radio>
            <el-radio label="1">全部</el-radio>
          </el-radio-group>
        </el-form-item>
      </template>
      <template v-if="pageTitle=='递交官方'">
        <el-form-item  label="递交状态:" style="margin-bottom: 0!important">
          <el-radio-group v-model="queryModuleData.instructionSubmitStatus" @change="() => { this.$set(this.queryModuleData, 'regAndAgent', '');; handleSearch(1) }">
            <el-radio :label="8">待下达</el-radio>
            <el-radio :label="6">当天待审核</el-radio>
            <el-radio :label="1">当天已审核</el-radio>
            <el-radio :label="7">明日待审核</el-radio>
            <el-radio :label="2">过期的审核</el-radio>
            <el-radio :label="3">昨日递交成功网申</el-radio>
            <el-radio :label="4">近三日递交成功网申</el-radio>
            <el-radio :label="5">下达&递交网申</el-radio>
            <el-radio :label="0">全部</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item  label="递交日期:"  style="margin-bottom: 0!important" class="djSubmitDateArray"  v-if="conditionsModuleList.map(item=>item.filterName).includes('递交日期')" >
          <DataPicker class="DataPicker" v-model="queryModuleData['djSubmitDateArray']" @change="changeDjSubmitDate"></DataPicker>
        </el-form-item>

      </template>
      <el-form-item label="官文状态:" v-if="pageTitle=='官方通知'" style="margin-bottom: 0!important">
        <el-radio-group v-model="queryModuleData.officialInformScreen" @change="() => { this.$set(this.queryModuleData, 'regAndAgent', ''); handleSearch(1) }">
          <el-radio label="1">待审核</el-radio>
          <el-radio label="2">待审核电子官文</el-radio>
          <el-radio label="3">待审核纸质官文</el-radio>
          <el-radio label="4">当天收到</el-radio>
          <el-radio label="8">当天收到电子官文</el-radio>
          <el-radio label="9">当天收到纸件官文</el-radio>
          <el-radio label="5">待报告</el-radio>
          <el-radio label="6" v-if="$store.getters.permissions.includes(390)">待报证</el-radio>
<!--          <el-radio label="6">正在发送</el-radio>-->
          <el-radio label="7">全部</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="快捷查询:" style="margin-bottom: 0">
<!--        <el-input type="text" v-model="queryModuleData.regAndAgent" clearable  @change="(e)=>handleSearch(1,!e)" ></el-input>-->
        <el-autocomplete
          class="inline-input"
          v-model="queryModuleData.regAndAgent"
          :fetch-suggestions="querySearch"
          placeholder="请输入内容"
          @change="(e)=>{handleSearch(1,!e)}"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item  label="创建日期:"  style="margin-bottom: 0!important" class="djSubmitDateArray"   v-if="conditionsModuleList.map(item=>item.property).includes('materialCreateDateArray')" >
        <DataPicker class="DataPicker" v-model="queryModuleData['materialCreateDateArray']" @change="changeDjSubmitDate"></DataPicker>
      </el-form-item>
    </el-form>

    <section>
      <div style="display: flex;position: relative">
        <TitleTotal :total="total" :currentPageSize="currentPageSize"/>
        <div class="button_wrap" >

          <el-button class="exactButton"  type="primary"  size="mini" @click="gridApi.deselectAll();gridApi.selectAllFiltered()">全选</el-button>
          <el-button class="exactButton"  size="mini" @click="gridApi.deselectAll()">清除所选</el-button>
          <el-button type="primary" size="mini" @click="recognizedError" v-if="(pageTitle==='官方通知'&&$store.getters.permissions.includes(290))">识别错误</el-button>
<!--          <el-button v-if="multipleTypeText" :disabled="multipleTypeTextDisabled" class="exactButton" size="mini" type="primary" @click="jumpDetailSubmisson(multipleTypeText=='报官清单'?'1-2':'')">{{multipleTypeText}}</el-button>-->
<!--          <el-button v-if="multipleTypeText=='报官清单'" class="exactButton" size="mini" type="primary" @click="jumpDetailSubmisson('1-3')">批量报官清单</el-button>-->

<!--          <el-button class="exactButton"  size="mini"  v-if="multipleTypeText==='审核'" v-show="pageTitle=='官方通知'" @click="multipleTypeText=''">取消</el-button>-->
        </div>
        <div style="cursor:pointer;position: absolute;display:flex;align-items:center;right: 0;bottom:-6px;font-size: 14px;padding-right: 6px">
          <el-button type="text" @click="exportList(2)" >导出</el-button>
          <span style="color: #52A2F4;margin: 0 5px"> / </span>
          <el-button type="text" @click="exportList(1)">全局导出</el-button>
<!--          <el-button type="text"  @click="exportList(1)"><i class="el-icon-download">导出</i></el-button>-->
<!--          <img @click="exportList(2)" src="@/assets/moon.png" width="16" alt="">-->
        </div>
      </div>
      <div class="content_wrap">
<!--        <i class="el-icon-folder" v-if="curFile.length"></i>-->
        <div class="left_wrap" :style="{width:pattern?leftWrapWidth:'100%' }">
          <div class="dots" @click="handleCheckboxState">
            <span class="dot">.</span>
            <span class="dot">.</span>
            <span class="dot">.</span>
          </div>
          <el-button class="brush_right" :class="brushRightHasFilter?'red':''" @click="brushRight" type="text" icon="el-icon-brush" ></el-button>
          <AgGridVue :style="{width:'100%',height: clientHeight+'px'}"
                     v-if="tableFlag"
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
          <div class="progressWrap" v-if="percentage">
            <el-progress type="circle" :percentage="percentage"></el-progress>
          </div>
          <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :pageSizes="pageSizesList" :limit.sync="listQuery.pageSize" @pagination="queryCaseList()" />
          <div class="checkbox" v-show="checkboxState" >
            <el-select ref="checkCaseSelect" v-model="checkCaseList" multiple  reserve-keyword	 filterable placeholder="请选择" collapse-tags :popper-append-to-body="false"  @visible-change="handleChange"
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
        </div>
        <div class="right_wrap" :style="{position:'relative','margin-left':(currentCaseId||currentTltId)&&pattern?'10px' :'0',height:clientHeight+'px'}">
          <!--<span class="el-icon-close" slot="close" style="cursor:pointer;position: absolute;right: 0;top: 10px;z-index: 1000" @click="closeCurrentRow"></span>-->
          <seeCaseDetail :style="cssVar" v-if="currentCaseId&&pattern" :case-id="currentCaseId" :sign="1" :backsign="0">
          </seeCaseDetail>
          <limitElectronicDocument v-if="currentTltId&&pattern" :tltId="currentTltId"></limitElectronicDocument>
        </div>
      </div>
    </section>
    <el-dialog title="提示" :append-to-body="false" :visible.sync="transferVisible" width="80%" >
      <el-transfer v-model="transferValue" @left-check-change="leftCheckChange" :key="transferData.filterId" :data="transferData" filterable filter-placeholder="请输入搜索内容"
        :titles="['选择筛选项—全部案件', '已选']">
      </el-transfer>
      <span slot="footer" class="dialog-footer">
        <el-button @click="transferVisible = false">取 消</el-button>
        <el-button type="primary" @click="configFilter">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :append-to-body="false" title="案件选择" :visible.sync="selectCaseVisible" width="40%" >
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
    <el-dialog
      title="预览"
      append-to-body
      :visible.sync="pdfDataState"
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
          <iframe @load="onload()" class="iframe"  :src="`ipdoc${item}`"></iframe>
        </swiper-slide>
        <div v-show="pdfData.length>1" class="swiper-button-prev swiper-button-prev2" slot="button-prev"></div>
        <div v-show="pdfData.length>1" class="swiper-button-next swiper-button-next2" slot="button-next"></div>
      </swiper>
    </el-dialog>
<!--    <PdfPreview class="pdfPreview" v-if="pdfDataState" :pdf-data="pdfData" @closePdfPreview="pdfDataState=false"></PdfPreview>-->
    <Willtable v-if="showTable" :modifyCase="modifyCase" :plType="plType" :changeType="getSelectedRows().length?getSelectedRows()[0].changeType:''" :reportMatter="getSelectedRows().length?getSelectedRows()[0].reportMatter:null"
      :materialTypeId="getSelectedRows().length?getSelectedRows()[0].materialTypeId:null" :caseTypeId="getSelectedRows().length?getSelectedRows()[0].caseTypeId:null" :caseIds='willtableCaseIdList'
       :showTable='showTable'  @closeTable='closeTable'>
    </Willtable>
    <el-dialog :modal-append-to-body="false" :append-to-body="false" :close-on-click-modal="false" :title="uploadType" :visible.sync="uploadState" width="70%" >
      <el-table :data="getCurFilterCaseData()" border>
        <el-table-column type="index" width="60" label="序号" align="left">
          <template slot-scope="scope">
            <span style="margin: 0;cursor: pointer" @click="takeCaseDetail(scope.row)">
              {{scope.$index+1}}
            </span>
          </template>
        </el-table-column>
        <el-table-column align="left" v-for="(item,index) in tableTitleList" :label="item.title" :prop="item.value" :width="item.width" :key="index">
          <template slot-scope="scope">
            <span :class="item.value=='agentNum'?'itemTitle_style':''" v-if="item.value!=='imageFile'&&item.value!='custName'" :title='scope.row[item.value]' style="margin: 0;cursor: pointer"
                  @click="takeCaseDetail(scope.row)">
              {{scope.row[item.value]}}
            </span>
            <CustCard v-if="item.value=='custName'" :custName="scope.row.custName" :customerID="scope.row.custId" />
            <img class="filterTableTmg" v-if="item.value==='imageFile'" :src="'ipdoc'+scope.row['imageFile']" alt="">
          </template>
        </el-table-column>
      </el-table>
      <BulkUploadFile v-if="uploadState" :caseList="getCurFilterCaseData()" :uploadType="uploadType" :curCaseId="getCurFilterCaseData().map(item=>item.caseId)" @changeFalse="closeSelect()"></BulkUploadFile>
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
    <ManualIdentification v-if="ManualIdentificationState" :officialInfoCounData="officialInfoCounData" @changeManualIdentification="ManualIdentificationState=false"
                          :ManualIdentificationState="ManualIdentificationState" @changeTotal="getManualRecognitionOfficialInfoCount">
    </ManualIdentification>
    <SelectOption :buss-id="bussId" v-if="selectionOptionState" :dialog-visible="selectionOptionState" @cancel="closeSelect" :idArray="getCurrentRowsData(getCurFilterId(pageTitle))" :defaultMultipleSelect="columnDefs.map(i=>i.headerName)" :exportType="exportType" :exportQueryModel="exportQueryModel"></SelectOption>
    <EmitSearch @undateSearch="undateSearch"></EmitSearch>
    <el-dialog
      ref="timeLimit"
      title="创建时限"
      append-to-body
      :visible.sync="timeLimitState"
      width="50%"
      height="100vh"
      :modal="false"
      top="0"
      class="pdfDialog dragDialog"
      :close-on-click-modal="false"
      v-dialogDrag
    >
      <createTimeLimit v-if="pageTitle=='官方通知' && timeLimitState" :query="timeLimitData" objType="1021" :objInstId="curentObjInstId" @cancel="closeSelect"></createTimeLimit>
      <createTimeLimit v-if="pageTitle!='官方通知' && timeLimitState" :query="timeLimitData"  @cancel="closeSelect"></createTimeLimit>
    </el-dialog>
    <el-dialog
      title="递交官方"
      append-to-body
      :visible.sync="detailSubmissionState"
      width="60%"
      height="100vh"
      :modal="false"
      top="0"
      class="pdfDialog dragDialog"
      :close-on-click-modal="false"
      v-dialogDrag
    >
      <officialSubmission :query="detailSubmissionData" @cancel="closeSelect"></officialSubmission>
    </el-dialog>
    <el-dialog
      title="变更办案人"
      append-to-body
      :visible.sync="updateWkgState"
      width="60%"
      height="100vh"
      :modal="false"
      top="0"
      class="pdfDialog dragDialog"
      :close-on-click-modal="false"
      v-dialogDrag
    >
      <CaseInvestigators :statusChange="true" ref="CaseInvestigators" v-if="updateWkgState" :caseDetailData="updateWkgData"></CaseInvestigators>
      <span slot="footer" class="dialog-footer" style="float: left">
        <el-button @click="updateWkgState = false">取 消</el-button>
        <el-button type="primary" @click="updateWkg">确 定</el-button>
      </span>
<!--      <officialSubmission v-if="updateWkgState" :query="detailSubmissionData" @cancel="closeSelect"></officialSubmission>-->
    </el-dialog>
    <el-dialog
      v-dialogDrag
      class="dragDialog"
      center
      top="0"
      height="852"
      :visible.sync="uploadProofreadingState"
      width="50%"
      :close-on-click-modal="false"
      :show-close="false"
      :close-on-press-escape="false"
    >
      <UploadProofreading :bussId="bussId" v-if="uploadProofreadingState" :uploadType="uploadType" :multipleTypeText="multipleTypeText"  @cancel="closeSelect" :defaultCaseList="getSelectedSortRows()" :filelist="curFile"></UploadProofreading>
    </el-dialog>
    <relevant-dialog v-if="relevantView && relCaseId" :viewState="relevantView" @closeRelevantDialog="closeRelevantDialog" :business="business" :relCaseId="relCaseId"></relevant-dialog>
    <el-dialog
      :close-on-click-modal="false"
      title="编辑客户"
      :visible.sync="custTableView"
      width="80%"
    >
      <VueWilltable
        v-if="custTableView"
        class="VueWilltable1"
        ref="willtable"
        :rowHeight="rowHeight"
        :columns="columns"
        v-model="tableData"
        :maxHeight="150"
      />
      <span slot="footer" class="dialog-footer fl-ac-jc">
        <el-button @click="custTableView = false">取 消</el-button>
        <el-button type="primary" @click="saveCaseCust">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :close-on-click-modal="false"
      title="编辑客户文号"
      :visible.sync="editCustRefnoView"
      width="35%"
    >
      <div>
        <div class="topBox">
          <span class="iconfont icon-warning-circle-fill" style="color: #E6A23C;font-size: 20px;"></span>
          <span>确认要修改这条案件吗？</span>
        </div>
        <div class="content">
          <el-form v-if="editCustRefnoView" ref="postForm" size="small" class="form-container1" label-width="120px">
            <el-row class="first-row">
              <el-col :span="24">
                  <el-form-item label="客户文号:" class="postInfo-container-item">
                    <el-input size="mini" v-model="editCustRefnoInfo.custRefno" placeholder="请输入客户文号"></el-input>
                  </el-form-item>
              </el-col>
            </el-row>
            <el-row class="">
              <el-col :span="24">
                  <el-form-item label="案件备注:" class="postInfo-container-item">
                    <el-input type="textarea" size="mini" v-model="editCustRefnoInfo.remarks" placeholder="请输入案件备注"></el-input>
                  </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
      <span slot="footer" class="dialog-footer fl-ac-jc">
        <el-button size="mini" @click="editCustRefnoView = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="submitCustRefno">确 定</el-button>
      </span>
    </el-dialog>

<!--  批量转客户  -->
    <el-dialog
      class="pt0"
      :close-on-click-modal="false"
      title="批量转客户"
      :visible.sync="changeCustsView"
      width="35%"
    >
      <div>
        <div class="topBox">
          <span class="iconfont icon-warning-circle-fill" style="color: #E6A23C;font-size: 20px;"></span>
          <span>请确认以下项目，不填为保持原值:</span>
        </div>
        <div class="content">
          <el-form v-if="changeCustsView" ref="postForm" size="small" class="form-container1" label-width="120px">
            <el-row class="first-row">
              <el-col :span="24">
                  <el-form-item label="客户名称:" class="postInfo-container-item">
                    <el-select
                      v-model="changeCustsInfo.custId"
                      @change="changeCustId"
                      ref="custSelect"
                      filterable
                      clearable
                      remote
                      reserve-keyword
                      placeholder="请输入关键词"
                      :remote-method="queryCustomerNameId"

                    >
                      <el-option
                        v-for="item in queryCustomerNameIdList"
                        :key="item.custId"
                        :label="item.fullname"
                        :value="item.custId"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
              </el-col>
            </el-row>
            <el-row class="">
              <el-col :span="24">
                  <el-form-item label="客户文号:" class="postInfo-container-item">
                    <el-input size="mini" v-model="changeCustsInfo.custRefno" placeholder="请输入客户文号"></el-input>
                  </el-form-item>
              </el-col>
            </el-row>
            <el-row class="">
              <el-col :span="24">
                <el-form-item label="客户联系人:" class="postInfo-container-item" prop="custContactId">
                  <template>

                    <el-select @change='contactchange' default-first-option :clearable='true'
                               placeholder="请选择" v-model="changeCustsInfo.custContactId" filterable>
                      <el-option v-for="(item,key)  in selectData.customerContacts" :key="key"
                                 :label="`${item.called ? item.called + ' ' : ''}${item.name}`" :value="item.custContactId">
                      </el-option>
                    </el-select>
                  </template>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="">
              <el-col :span="24">
                <el-form-item label="信函地址:" class="postInfo-container-item">
                  <template>
                    <el-select default-first-option :clearable='true' placeholder="请选择"
                               v-model="changeCustsInfo.letterAddrId" filterable>
                      <el-option v-for="(item,key)  in selectData.customerMailAdds" :key="key"
                                 :label="(item.addressCn||'')+(item.addressEn||'')" :value="item.addrId">
                      </el-option>
                    </el-select>
                  </template>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="账单联系人:" class="postInfo-container-item">
                  <template>
                    <el-select default-first-option :clearable='true' placeholder="请选择"
                               v-model="changeCustsInfo.billCustContactId" filterable>
                      <el-option v-for="(item,key)  in selectData.billContacts" :key="key"
                                 :label="`${item.called ? item.called + ' ' : ''}${item.name}`" :value="item.custContactId">
                      </el-option>
                    </el-select>
                  </template>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="账单地址:" class="postInfo-container-item">
                  <template>
                    <el-select default-first-option :clearable='true' placeholder="请选择"
                               v-model="changeCustsInfo.billAddrId" filterable>
                      <el-option v-for="(item,key)  in selectData.billAdds" :key="key"
                                 :label="(item.addressCn||'')+(item.addressEn||'')" :value="item.addrId">
                      </el-option>
                    </el-select>
                  </template>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="折扣率:" class="postInfo-container-item">
                  <template>
                    <el-input placeholder="请输入" type="number" min="1" max="100" v-model="changeCustsInfo.discount"/>
                  </template>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
      <span slot="footer" class="dialog-footer fl-ac-jc">
        <el-button size="mini" @click="changeCustsView = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="submitChangeCusts">确 定</el-button>
      </span>
    </el-dialog>

<!--  批量修改案件阶段和进展  -->
    <el-dialog
      :close-on-click-modal="false"
      class="pt0"
      title="批量修改案件阶段和进展"
      :visible.sync="changeCaseStageView"
      width="35%"
      :before-close="changeCaseStageClose"
    >
      <div>
        <div class="content">
          <el-form v-if="changeCaseStageView" ref="postForm" size="small" class="form-container1" label-width="150px">
            <el-row class="first-row">
              <el-col :span="24">
                  <el-form-item label="更新后的案件阶段:" class="postInfo-container-item">
                    <el-select  default-first-option v-model="changeCaseStageForm.caseStageId" placeholder="请选择" filterable
                                clearable @change="stageChange">
                      <el-option
                        v-for="itm in getCaseStageList"
                        :key="itm.id"
                        :label="itm.stageName"
                        :value="itm.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
              </el-col>
            </el-row>
            <el-row class="">
              <el-col :span="24">
                  <el-form-item label="更新后的案件进展:" class="postInfo-container-item">
                    <el-select  default-first-option v-model="changeCaseStageForm.caseNestProcess" placeholder="请选择" filterable
                                clearable >
                      <el-option
                        v-for="itm in caseNestProcessList"
                        :key="itm.caseNestProcess"
                        :label="itm.progressName"
                        :value="itm.caseNestProcess">
                      </el-option>
                    </el-select>
                  </el-form-item>
              </el-col>
            </el-row>
            <el-row class="">
              <el-col :span="24">
                  <el-form-item label="更新后的案件状态:" class="postInfo-container-item">
                    <el-select  default-first-option v-model="changeCaseStageForm.statusId" placeholder="请选择" filterable
                                clearable >
                      <el-option
                        v-for="itm in caseStatusList"
                        :key="itm.statusId"
                        :label="itm.statusName"
                        :value="itm.statusId">
                      </el-option>
                    </el-select>
                  </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
      <span slot="footer" class="dialog-footer fl-ac-jc">
        <el-button size="mini" @click="changeCaseStageClose">取 消</el-button>
        <el-button size="mini" type="primary" @click="submitChangeCaseStage">确 定</el-button>
      </span>
    </el-dialog>

    <!--  批量修改案件类型  -->
    <el-dialog
      :close-on-click-modal="false"
      class="pt0"
      title="批量修改案件类型"
      :visible.sync="changeCaseTypeView"
      width="35%"
      :before-close="changeCaseTypeClose"
    >
      <div>
        <div class="content">
          <el-form v-if="changeCaseTypeView" ref="postForm" size="small" class="form-container1" label-width="150px">
            <el-row class="first-row">
              <el-col :span="24">
                  <el-form-item label="案件类型:" class="postInfo-container-item">
                    <el-cascader
                      ref="caseTypecascader"
                      v-model="changeCaseTypeForm.caseTypeIdList"
                      filterable
                      clearable
                      :show-all-levels="false"
                      :options="$store.getters.caseTypeList.filter(item => item.caseType === '商标')"
                      :props="defaultParams"
                      placeholder="请选择"
                      @change="catchange"
                    />
                  </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="changeCaseTypeForm.caseTypeIdList.includes(48)" class="">
              <el-col :span="24">
                  <el-form-item label="撤回案件类型:" class="postInfo-container-item">
                    <el-select
                      placeholder="请选择"
                      clearable
                      v-model="changeCaseTypeForm.changeType"
                      filterable
                    >
                      <el-option
                        v-for="item in withdrawList"
                        :key="item"
                        :label="item"
                        :value="item"
                      />
                    </el-select>
                  </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
      <span slot="footer" class="dialog-footer fl-ac-jc">
        <el-button size="mini" @click="changeCaseTypeClose">取 消</el-button>
        <el-button size="mini" type="primary" @click="submitChangeCaseType">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 报价导入-->
    <el-dialog
      v-if="importPriceView"
      title="境外报价"
      :close-on-click-modal="false"
      :visible.sync="importPriceView"
      width="80%"
      height="80%"
      class="abow_dialog"
    >
      <price-grid :idArray="priceIdArray" @closeImportDialog="closeImportDialog"/>
    </el-dialog>

<!--  撰写指派 trademarkWritingView -->
    <el-dialog
      title="撰写指派"
      append-to-body
      :visible.sync="trademarkWritingView"
      width="60%"
      :modal="false"
      top="0"
      class="pdfDialog dragDialog writingDialog"
      :close-on-click-modal="false"
      v-dialogDrag
    >
      <trademark-writing-detail v-if="trademarkWritingView" type="create" :caseIds="trademarkWritingCaseIdList" @closetrademarkWriting="trademarkWritingView = false"></trademark-writing-detail>
    </el-dialog>

<!--  设置品牌  -->
    <el-dialog
      title="设置品牌"
      append-to-body
      :visible.sync="setBrandView"
      width="35%"
      :modal="true"
      :close-on-click-modal="false"
    >
      <el-form size="mini" label-width="100px">
        <el-form-item label="品牌:">
          <el-select size="mini" default-first-option :clearable='true' v-model="brandForm.ppId"
                     no-match-text='暂无数据' @change="selectPinpai"
                     loading-text='正在查询' filterable remote reserve-keyword placeholder="请输入品牌名称"
                     :remote-method="remotepaternalUnit">
            <el-option v-for="(item, key) in brandArray" :key="item.ppId" :label="item.pinpai"
                       :value="item.ppId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="图样:">
          <img v-if="!!brandArray.find(item => item.ppId == brandForm.ppId)" class="filterTableTmg" :src="'/ipdoc' + brandArray.find(item => item.ppId == brandForm.ppId).address" width="100"
                 height="100">
          <img v-else class="filterTableTmg" src="../../../../assets/picFail.svg" width="100" height="100" alt="">
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer fl-ac-jc">
        <el-button size="mini" @click="setBrandView = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="() => brandSubmit()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 境外盈余核算-->
    <el-dialog
        v-if="caseSurplusView"
        title="境外盈余核算"
        :close-on-click-modal="false"
        :visible.sync="caseSurplusView"
        width="80%"
        height="70%"
        class="abow_dialog11"
    >
      <case-surplus ref="caseSurplus" :surplusData="caseSurplusList" :address="caseSurplusAddress" @updateCaseSurplus="queryCaseSurplusListFunc" @updateAndExport="updateAndExport"></case-surplus>
      <span slot="footer" class="dialog-footer fl-ac-jc">
        <el-button size="mini" @click="caseSurplusView = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="() => caseSurplusSubmit()">保 存</el-button>
      </span>
    </el-dialog>

    <!-- 驳回复审对话框 -->
    <el-dialog
      title="驳回复审"
      :visible.sync="rejectionDialogVisible"
      width="600px"
      custom-class="rejection-dialog"
      :before-close="handleRejectionCancel">
      <div class="rejection-content">
        <!-- 中止审理 -->
        <div class="field-group">
          <div class="field-label">中止审理</div>
          <el-radio-group v-model="rejectionOption">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </div>

        <!-- 对近似商标的描述 -->
        <div class="field-group">
          <div class="field-label">对近似商标的描述</div>
          <el-input
            v-model="similarPrompt"
            type="textarea"
            :rows="3"
            placeholder="例如：字形、读音、含义等区别明显，不混淆误认；或者，申请商标是申请人更早商标的延续性注册"
            maxlength="500"
            show-word-limit>
          </el-input>
        </div>

        <!-- 中止原因 -->
        <template v-if="rejectionOption === 1">
          <div class="field-group">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <div class="field-label" style="margin-bottom: 0;">中止原因</div>
                <el-tooltip
                  placement="top"
                  effect="light"
                  popper-class="suspension-reason-tooltip">
                  <div slot="content" style="max-width: 400px; line-height: 1.6;">
                    示例：即将针对引证商标第12345678号提起撤三申请/提起异议申请/提起无效宣告申请），对此，程序应该按照之前定义的规则自动生成中止审理的理由
                  </div>
                  <i class="el-icon-question" style="color: #909399; font-size: 16px; cursor: pointer;"></i>
                </el-tooltip>
              </div>
              <el-button size="small" type="primary" icon="el-icon-plus" @click="addSuspensionReason">添加中止原因</el-button>
            </div>
          </div>

          <div v-for="(item, index) in custSuspensionReasonList" :key="index" class="reason-item">
            <div class="reason-fields">
              <div class="field-inline">
                <span class="field-label-inline">引证商标号</span>
                <el-input v-model="item.regNumber" placeholder="请输入引证商标号" size="small"></el-input>
              </div>
              <div class="field-inline">
                <span class="field-label-inline">申请类型</span>
                <el-select v-model="item.tmStatus" placeholder="请选择" size="small">
                  <el-option
                    v-for="status in tmStatusList"
                    :key="status.value || status"
                    :label="status.label || status"
                    :value="status.value || status">
                  </el-option>
                </el-select>
              </div>
              <el-button
                type="text"
                size="small"
                icon="el-icon-delete"
                @click="deleteSuspensionReason(index)"
                style="color: #f56c6c; flex-shrink: 0;">
                删除
              </el-button>
            </div>
          </div>
        </template>

        <!-- 申请人信息按钮 -->
        <div class="field-group">
          <el-button size="small" type="success" @click="showApplicantInfo = !showApplicantInfo">
            {{ showApplicantInfo ? '收起申请人介绍' : '填写申请人介绍' }}
          </el-button>
        </div>

        <!-- 申请人信息表单 -->
        <template v-if="showApplicantInfo">
          <div class="field-group">
            <div class="field-label">申请人名称</div>
            <el-input v-model="applicantInfo.companyName" placeholder="请输入申请人名称"></el-input>
          </div>

          <div class="field-group">
            <div class="field-label">信息链接</div>
            <el-input v-model="applicantInfo.url" placeholder="填写获取申请人信息的链接（系统自动根据用户指定的链接，抓取网页上的数据）"></el-input>
          </div>

          <div class="field-group">
            <div class="field-label">申请人介绍</div>
            <el-input
              v-model="applicantInfo.description"
              type="textarea"
              :rows="4"
              placeholder="填写申请人介绍的文字（系统可以保存用户设置的申请人介绍）"
              maxlength="1000"
              show-word-limit>
            </el-input>
          </div>
          <div class="field-group">
            <div class="field-label">案件文号</div>
            <el-input v-model="applicantInfo.agentNum" placeholder="填写案件文号（系统自动提取该案件的驳回复审理由书中的知名度介绍）"></el-input>
          </div>
        </template>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleRejectionCancel">取 消</el-button>
        <el-button type="primary" @click="handleRejectionConfirm">确 定</el-button>
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
      <FileDownLoadDialog ref="filedown" :caseTypeNum="3" @downLoadfiles="downLoadfiles" @closeDialog="closeDialog"></FileDownLoadDialog>
    </el-dialog>

  </div>
</template>

<script>
import VueWilltable from '@/components/vueWilltable'
import Checkbox from "./Checkbox"
import Pagination from "@/components/Pagination";
import FilterSelect from '@/components/FilterSelect'
import ManualIdentification from "./ManualIdentification";
import { queryAllUrl } from "@/api/applicant";
import BulkUploadFile from './BulkUploadFile'
import exportFile from '@/components/exportFile'
import SelectOption from './SelectOption'
import UploadProofreading from './UploadProofreading'
import OfficialDocuments from '@/views/workbench/case/components/OfficialDocuments'
import SetHolidays from '@/views/workbench/case/components/SetHolidays'
import { formatAmount } from '@/utils/filters.js'
import wTable from '@/components/dragTable'
import {
  querylyctListUrl,
} from "@/api/customerList";
import ViewsSwitching from './ViewsSwitching'
import MyTabs from './MyTabs'
import FileDownLoadDialog from '@/components/FileDownLoadDialog';
import createTimeLimit from "@/views/workbench/toDoTasks/createTimeLimit";
// import {AgGridVue} from 'ag-grid-vue'
import { createReexaminationReasonDoc, saveApplicantInfo, queryTmStatusList } from "@/api/dashboard";

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
  submitOffical,
  submitOfficalAudit,
  auditOfficalDoc,
  queryTrademarkCaseOfficial,
  deleteCase,
  deleteDoc,
  deleteIns,
  queryCustomerNameId,
  getManualRecognitionOfficialInfoCount,
  recognizedError,
  getCaseByTmFileId,
  submitOfficalModify,
  queryCorrelationCaseList,
  downloadMaterial,
  copyCase,
  uploadDocFile,
  updateWkg,
  queryCaseWork,
  queryList,
  checkPermission
} from "@/api/caseList.js";
import {
  queryCaseByCaseIdsUrl,
  saveCasesUrl
} from "@/api/caseDetail.js";
import {browserBehavior} from './browserBehavior'
import limitElectronicDocument from '@/views/workbench/toDoTasks/components/limitElectronicDocument'
import PdfPreview from "./ManualIdentification/PdfPreview";
import Willtable from "@/components/Willtable";
import { mapGetters,mapState } from "vuex";
import { downLoadAll ,throttle} from "@/utils";
import seeCaseDetail from './ManualIdentification/seeCaseDetail'
import jsFileDownload from 'js-file-download'
import axios from 'axios'
import Bus from "../../../../utils/Bus";
import officialSubmission from '@/views/workbench/case/officialSubmission/components/detailSubmission.vue'
import CaseInvestigators from './CaseInvestigators'
import  DateFilter from '@/components/ag-date-filter'
import RelevantDialog from './RelevantDialog'
import PriceGrid from './PriceGrid'
import TrademarkWritingDetail from "../trademarkWriting/trademarkWritingDetail";
import {queryCustomerContactByCustContactIdUrl, queryCustomerContactByCustIdUrl,queryCustomerAddrAll} from "../../../../api/caseDetail";
import {
  getCaseStage,
  modifyCaseStage, modifyCaseType,
  queryCaseProgressName,
  queryWithdraw,
  updateCaseCust, updateCaseCustInfo, updateZczStatus
} from "../../../../api/caseList";
import {queryCustomerPinpai, updateCasePinpai,queryCustContactAllUrl,queryCollaborationAll} from "../../../../api/customerList";
import {queryCaseSurplusList} from "@/api/billApi";
import CaseSurplus from "@/views/workbench/case/components/CaseSurplus.vue";
import { createRejectionDoc } from '@/api/rejectionNotice'
export default {
  props: {
    field:{

    },
    taskType:{
      default: 1
    },
    business: {
      default: "2"
    },
    bussId: {
      default: "5"
    },
    getCaseList: {
      type: Function,
      default: queryCaseList
    },
    // queryModuleData: {
    //   type: Object,
    //   default: () => ({})
    // },
    pageTitle: {
      type: String,
      default:'案件管理'
    },
    dialogVisible: {
      type: Boolean,
      default: true
    },
  },
  name: "types_of_cases",
  data() {
    var tableHeader=[]
    if(localStorage.getItem('tableHeader')&&JSON.parse(localStorage.getItem('tableHeader')).find(item=>item.name==this.$options.name+this.$route.name)){
      tableHeader=JSON.parse(localStorage.getItem('tableHeader')).find(item=>item.name==this.$options.name+this.$route.name).tableHeader
    }

    return {
      fileDownLoadView: false,
      rejectionOption: 1, // 驳回复审选项，默认选择"是"
      rejectionDialogVisible: false, // 驳回复审对话框显示状态
      currentRejectionRow: null, // 当前驳回复审的行数据
      similarPrompt: '', // 用户指定的双方商标的区别描述
      custSuspensionReasonList: [], // 中止审理原因列表
      tmStatusList: [], // 商标申请类型列表
      showApplicantInfo: false, // 是否显示申请人信息表单
      applicantInfo: {
        companyName: '',
        url: '',
        description: '',
        agentNum: ''
      }, // 申请人信息
      caseSurplusAddress: '',
      caseSurplusView: false,
      caseSurplusList: [],
      brandArray: [],
      brandForm: {
        ppId: '',
        materialId: '',
        caseIdList: []
      },
      setBrandView: false,
      withdrawList: [],
      changeCaseTypeForm: {
        caseTypeIdList: [],
        changeType: ''
      },
      changeCaseTypeView: false,
      caseNestProcessList: [],
      changeCaseStageForm: {
        caseStageId: '',
        caseNestProcess: '',
        statusId:''
      },
      getCaseStageList: [],
      caseStatusList: [],
      changeCaseStageView: false,
      selectData: {
        appaddr: [],
        goodsznselect: [],
        goodszn: {},
        country: [],
        billContacts: [],
        customerMailAdds: [],
        apps: [],
        billAdds: [],
        queryAppContact: [],
        workgroup: [],
        username: [],
        rolename: [],
        goodsPlanselect: [],
        hzLists: [],
        customerContactswf: [],
        customerContacts: [],
        customerAddrs: [],
        casecount: []
      },
      changeCustsInfo: {
        custName: '',
        custId: '',
        custRefno: '',
        custContactId: '',
        letterAddrId: '',
        billCustContactId: '',
        discount: '',
        billAddrId: ''
      },
      changeCustsView: false,
      trademarkWritingView: false,
      trademarkWritingCaseIdList: [],
      modifyCase: undefined,
      priceIdArray: [],
      editCustRefnoInfo: {},
      editCustRefnoView: false,
      rowHeight: 28,
      columns: [
        {
          title: '序号',
          key: 'sid',
          type: 'number',
          width: 48,
          fixed: true,
          disabled: true
        },
        {
          // action: true,
          title: '案件文号',
          key: 'agentNum',
          width: 200,
          disabled: true
        },
        {
          // action: true,
          title: '客户名称',
          key: 'custName',
          width: 200,
          disabled: true
        },
        {
          // action: true,
          title: '客户文号',
          key: 'custRefno',
          width: 200
        },
        {
          // action: true,
          title: '客户联系人',
          key: 'custContactId',
          width: 200,
          type: 'selectItem',
          options: [],
          // autofill: false
        },
        {
          // action: true,
          title: '信函地址',
          key: 'letterAddrId',
          width: 200,
          type: 'selectItem',
          options: [],
          // autofill: false
        },
        {
          // action: true,
          title: '账单联系人',
          key: 'billCustContactId',
          width: 200,
          type: 'selectItem',
          options: [],
          // autofill: false
        },
        {
          // action: true,
          title: '抄送人',
          key: 'trademarkCaseCustContactArray',
          width: 200,
          type: 'moreSelect',
          options: [],
          // autofill: false
        },
        {
          // action: true,
          title: '账单地址',
          key: 'billAddrId',
          width: 200,
          type: 'selectItem',
          options: [],
          // autofill: false
        },
        {
          // action: true,
          title: '折扣率',
          key: 'discount',
          width: 200
        },
        {
          // action: true,
          type: 'text',
          title: '案件备注',
          key: 'remarks',
          width: 200
        },
      ],
      tableData: [],
      custTableView: false,
      isDim: 0,
      isAppDim: 0,
      relCaseId: '',
      relevantView: false,
      scrollTop: 0,
      loadIndex: 0,
      setHolidaysVisible: false,
      gridOptions:{...this.$store.state.caseInformation.gridOptions,...{
        getRowStyle:(params)=>{
          if(params.node.data){

            if(params.node.data.auditStatus==1||params.node.data.isCheck==0){
              return { background:'#DCDFE6' }
            } else if(params.node.data.isOverTerm==1){
              return { color: 'red' }
            }
          }
        },
        statusBar: {
          statusPanels: [
            { statusPanel: 'agTotalAndFilteredRowCountComponent', align: 'left' },
            { statusPanel: 'agSelectedRowCountComponent', align: 'left' },
          ]
        },
        // suppressScrollOnNewData:true
        //floatingFilter: true,
      }},
      currentPageSize:0,
      defaultcolumnDefs:[
        {
          headerName: '序号',
          field: 'sid',
          width:this.getLoactionWidth('序号')=='auto'?60:this.getLoactionWidth('序号'),
          resizable: true,
          'pinned': 'left', //固定再左边
          enableRowGroup: true,
          // enablePivot: true,
          floatingFilter:true,
          filter: false,
          cellClass: 'vAlign',
          suppressMenu: true,
          checkboxSelection: false,
          headerCheckboxSelection: false,
          headerCheckboxSelectionFilteredOnly: true,
          cellRenderer:this.cellRenderer,
          // checkboxSelection:function(params) {
          //   // we put checkbox on the name if we are not doing grouping
          //   return params.columnApi.getRowGroupColumns().length === 0;
          // },
          // headerCheckboxSelection:(params)=>{
          //   // we put checkbox on the name if we are not doing grouping
          //   if(this.selectionState){
          //     return false
          //   }
          //   console.log(params.columnApi.getRowGroupColumns().length === 0);
          //   return params.columnApi.getRowGroupColumns().length === 0;
          // }
        },
      ],
      columnDefs: [

      ],
      brushRightHasFilter:false,
      autoGroupColumnDef:{
        headerName: '组',
        field: 'group',
        headerCheckboxSelection: true,
        cellRenderer: 'agGroupCellRenderer',
        cellRendererParams: { checkbox: true },
      },
      tableFlag:true,
      selectionOptionState:false,
      plType: "",
      drawerState:false,
      queryModuleData: {
        instructionSubmitStatus: ""
      },
      tableOption:{
        maxHeight:200
      },
      exportType:1,
      currentCaseId:'',
      pageSizesList:[10, 50, 200,500,1000,5000,10000],
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
      conditionsModuleList: [], // 渲染筛选条件
      caseListDefault: [], // 案件默认全部列表
      checkFilterList: [], // 控制筛选漏斗状态
      firstRequest: false, //第一次请求
      listQuery: {
        pageNo: 0,
        pageSize: JSON.parse(localStorage.getItem('pageSize'))?JSON.parse(localStorage.getItem('pageSize')).find(item=>item.name==this.$route.name)?JSON.parse(localStorage.getItem('pageSize')).find(item=>item.name==this.$route.name).pageSize:10:10
      },
      total: 0,
      listLoading: false,
      defaultParams: {
        //級聯菜單默認
        value: "caseTypeId",
        label: "caseType",
        children: "childrens",
        checkStrictly: true,
        multiple: true
      },
      tableTitleList:[{"title":"案件文号", "value": "agentNum" },{"title":"案件类型","value":"caseType","boo":"2"},{"title":"商标名称","value":"tmName"},{"title":"商标号","value":"regNumber"},{"title":"商标类别","value":"goodClasses"},{"title":"客户","value":"custName" },{"title":"申请人中文名称","value":"appCnName","boo":"1"},{"title":"阶段","value":"stageName" }],
      multipleSelection: [],
      selectionState: false,
      multipleTypeText: "",
      pdfData: [],
      pdfDataState: false,
      willtableCaseIdList: [],
      selectCaseVisible: false,
      selectCaseList: [],
      officialInfoCount: 0,
      forCount: 100,
      requireList:[],
      otherSelect:false,
      downLoadState:false,
      exportListState:false,
      lastRow:'',
      startRow:'',
      rowList:[],
      dragState: {
        start: -1, // 起始元素的 index
        end: -1, // 结束元素的 index
        move: -1, // 移动鼠标时所覆盖的元素 index
        dragging: false, // 是否正在拖动
        direction: undefined // 拖动方向
      },
      tableHeader: tableHeader,
      currentId:'',
      clearWrapTop:0,
      tableHeaderLabelList:[],
      myTabsActivity: false,
      curFilterSelect:{},
      rowContextmenuList: [

        { name: '相关案件', action: 'relevant' },
        { name:'暂存', action: 'temporarStorage'},
        { name:'暂存(批量)', action: 'temporarStorageAll'},
        { name:'隐藏', action: 'hidden'},
        { name:'隐藏(批量)', action: 'hiddenAll'},

      ],
      filterDataSum:{},
      operationState:1,
      officialInfoCounData:{},
      addFilterState:false,
      schemeName:'',
      exportQueryModel:'',
      examineDialog: false,
      examineData:{tmcoiMapList:[],ifShow:0},
      percentage:0,
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
      timeLimitState:false,
      timeLimitData:{
        agentNums: [], kind: ''
      },
      detailSubmissionData:{
        caseIds:[],
        pageType:''
      },
      curFile:[],
      detailSubmissionState:false,
      updateWkgState:false,
      updateWkgData:{},
      cloneNode:'',
      leftWrapWidth:localStorage.getItem('leftWrapWidth')?localStorage.getItem('leftWrapWidth'):'60%',
      identification:'types_of_cases' + this.$route.name,
      multipleTypeTextDisabled:false,
      uploadProofreadingState: false,
      currentTltId:'',
      curentObjInstId:'',
      importPriceView: false,
      queryCustomerNameIdList: [],
    };
  },
  created() {

  },
  mounted(){
    this.rightDrag()
  },
  methods: {
    formatAmount,
    async updateAndExport(saveSurplus, billIds) {
      await this.queryCaseSurplusListFunc(saveSurplus, billIds)
      this.$message.success("操作成功!")
      this.$commonUtils.downLoadAll({url: `ipdoc/${this.caseSurplusAddress}`})
    },
    closeDialog() {
      this.fileDownLoadView = false
      this.$refs.filedown.clearData()
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
        this.closeDialog()
      })
    },
    caseSurplusSubmit() {
      this.$refs.caseSurplus.submit()
    },
    handleQuickQuery(item) {
      let quickQueryList = JSON.parse(localStorage.getItem(this.pageTitle + 'quickQuery') || JSON.stringify([]))
      if (quickQueryList.findIndex(item => item.value == this.queryModuleData.regAndAgent) > -1 && this.queryModuleData.regAndAgent) {
        quickQueryList.splice(quickQueryList.findIndex(item => item.value == this.queryModuleData.regAndAgent), 1)
      }
      if (quickQueryList.length < 10) {
        this.queryModuleData.regAndAgent && quickQueryList.unshift({value: this.queryModuleData.regAndAgent, label: this.queryModuleData.regAndAgent})
      } else {
        this.queryModuleData.regAndAgent && quickQueryList.pop()
        this.queryModuleData.regAndAgent && quickQueryList.unshift({value: this.queryModuleData.regAndAgent, label: this.queryModuleData.regAndAgent})
      }
      localStorage.setItem(this.pageTitle + 'quickQuery', JSON.stringify(quickQueryList))
    },
    querySearch(queryString, cb) {
      const restaurants = JSON.parse(localStorage.getItem(this.pageTitle + 'quickQuery') || JSON.stringify([]))
      // 崔欣需求，历史记录始终显示，不做过滤操作
      // const results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      cb(restaurants);
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    selectPinpai(ppId) {
      this.brandForm.materialId = this.brandArray.find(item => item.ppId === ppId).materialId
    },
    remotepaternalUnit(query) {
      if (query !== "") {
        queryCustomerPinpai({pinpai: query, pageSize: 100}).then(res => {
          this.brandArray = res.data || []
        })
      }
    },
    brandSubmit(checkFlag = 1) {
      if (!this.brandForm.ppId) {
        this.$message.error('请选择品牌!')
        return
      }
      updateCasePinpai({
        ...this.brandForm,
        checkFlag
      }).then(res => {
        if (res.messageType == 100) {
          this.$confirm(res.message, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            this.brandSubmit(2)
          }).catch(() => {
            this.setBrandView = false
          })
        } else {
          this.$message.success(res.message)
          this.queryCaseList()
          this.setBrandView = false
        }
      })
    },
    setBrand() {
      if (!this.getSelectedRows().length) {
        this.$message.error('请选择案件！')
        return
      }
      if ([...new Set(this.getSelectedRows().map(item => item.custId).filter(Boolean))].length > 1) {
        this.$message.error('请选择同一客户下的案件！')
        return
      }
      this.brandArray = []
      this.setBrandView = true
      this.brandForm = {
        ppId: undefined,
        materialId: undefined,
        caseIdList: [],
        custId: undefined
      }
      this.brandForm.caseIdList = [...new Set(this.getSelectedRows().map(item => item.caseId))]
      this.brandForm.custId = [...new Set(this.getSelectedRows().map(item => item.custId).filter(Boolean))][0]
    },
    queryWithdraw(caseTypeId) {
      caseTypeId === 48 && !this.withdrawList.length && queryWithdraw({ caseTypeId }).then(res => {
        this.withdrawList = res.data
      })
    },
    catchange(value) {
      if (value && value.length) {
        this.queryWithdraw(value[value.length - 1])
        if (value[value.length - 1] !== 48) {
          this.changeCaseTypeForm.changeType = ''
        }
      }
    },
    submitChangeCaseType() {
      if (!this.changeCaseTypeForm.caseTypeIdList || this.changeCaseTypeForm.caseTypeIdList && !this.changeCaseTypeForm.caseTypeIdList.length) {
        this.$message.error('请选择案件类型!')
        return
      } else if (this.changeCaseTypeForm.caseTypeIdList.includes(48) && !this.changeCaseTypeForm.changeType) {
        this.$message.error('请选择撤回案件类型!')
        return
      }
      this.changeCaseTypeForm.caseTypeId = this.changeCaseTypeForm.caseTypeIdList[this.changeCaseTypeForm.caseTypeIdList.length - 1]
      const caseType = this.$commonUtils.extractTree(this.$store.getters.caseTypeList.filter(item => item.caseType === '商标'), 'childrens').find(item => item.caseTypeId === this.changeCaseTypeForm.caseTypeId).caseType
      modifyCaseType({
        caseType,
        caseIds: this.getSelectedRows().map(item => item.caseId),
        ...this.changeCaseTypeForm
      }).then(res => {
        this.changeCaseTypeClose()
        this.$message.success('修改成功!')
        this.queryCaseList()
      })
    },
    changeCaseTypeClose() {
      this.changeCaseTypeView = false
      this.withdrawList = []
      this.changeCaseTypeForm.caseTypeIdList = []
      this.changeCaseTypeForm.changeType = ''
    },
    changeCaseStageClose() {
      this.changeCaseStageView = false
      this.changeCaseStageForm.caseStageId = ''
      this.changeCaseStageForm.caseNestProcess = ''
      this.changeCaseStageForm.statusId = ''
    },
    stageChange(value) {
      value && this.queryCaseProgressName()
      this.changeCaseStageForm.caseNestProcess = ''
      this.changeCaseStageForm.statusId = ''
    },
    queryCaseProgressName(progressName) {
      queryCaseProgressName({ caseStageId: this.changeCaseStageForm.caseStageId }).then(res => {
        this.caseNestProcessList = res.data || []
        if (progressName) {
          this.changeCaseStageForm.caseNestProcess = this.caseNestProcessList.find(item => item.progressName === progressName) && this.caseNestProcessList.find(item => item.progressName === progressName).caseNestProcess
        }
      })
    },
    getCaseStage(stageName, progressName,status){
      getCaseStage({ taskType: 1 }).then(res => {
        this.getCaseStageList = res.data
        this.changeCaseStageForm.caseStageId = this.getCaseStageList.find(item => item.stageName === stageName) && this.getCaseStageList.find(item => item.stageName === stageName).id
        this.queryCaseProgressName(progressName)
        const list = this.$commonUtils.unique(res.data,'statusId')
        this.caseStatusList = list
        const obj = this.caseStatusList.find(item => item.statusName === status) || {}
        this.changeCaseStageForm.statusId = obj.statusId
      })
    },
    submitChangeCaseStage() {
      if (!this.changeCaseStageForm.caseStageId) {
        this.$message.error('请选择更新后的案件阶段!')
        return
      }
      // if (!this.changeCaseStageForm.caseNestProcess) {
      //   this.$message.error('请选择更新后的案件进展!')
      //   return
      // }
      modifyCaseStage({
        caseIds: this.getSelectedRows().map(item => item.caseId),
        ...this.changeCaseStageForm,
      }).then(res => {
        if (res.messageType === 1) {
          this.$confirm(res.message,
            "提示",
            {
              confirmButtonText: "确定",
              showCancelButton: false,
              // cancelButtonText: "取消",
              type: "warning"
            })
        } else if (res.messageType === 2) {
          this.$confirm(res.message,
            "提示",
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }).then(() => {
            modifyCaseStage({
              caseIds: this.getSelectedRows().map(item => item.caseId),
              ...this.changeCaseStageForm,
              sign: 1
            }).then(res => {
              this.$message.success('修改成功!')
              this.changeCaseStageClose()
              this.queryCaseList()
            })
          })
        } else {
          this.$message.success('修改成功!')
          this.changeCaseStageClose()
          this.queryCaseList()
        }
      })
    },
    changeCaseStage() {
      if (!this.getSelectedRows().length) {
        this.$message.error('请选择案件！')
        return
      }
      const rowInfo = this.getSelectedRows()[0] || {}
      this.getCaseStage(rowInfo.stageName, rowInfo.progressName,rowInfo.status)
      this.changeCaseStageView = true
    },
    changeCaseType() {
      if (!this.getSelectedRows().length) {
        this.$message.error('请选择案件！')
        return
      }
      this.changeCaseTypeForm.caseTypeIdList = this.$commonUtils.extractTree(this.$commonUtils.findParentLevel(this.$store.getters.caseTypeList.filter(item => item.caseType === '商标'), 'caseTypeId', [this.getSelectedRows()[0].caseTypeId], 'parent', 'childrens'), 'childrens').map(item => item.caseTypeId)
      this.changeCaseTypeForm.caseTypeIdList && this.changeCaseTypeForm.caseTypeIdList.length && this.queryWithdraw(this.changeCaseTypeForm.caseTypeIdList[this.changeCaseTypeForm.caseTypeIdList.length - 1])
      this.changeCaseTypeForm.changeType = this.getSelectedRows()[0].changeType
      this.changeCaseTypeView = true
    },
    contactchange(id) {
      queryCustomerContactByCustContactIdUrl({custContactId: id}).then(
        res => {
          this.selectData.customerMailAdds = res.data.customerMailAdds;
          this.selectData.billAdds = res.data.BillAdds;
          this.selectData.billAdds.forEach(item => {
            if (!item.addressCn) {
              item.addressCn = item.addressEn;
            }
          });
        }
      );
    },
    changeCustId(value) {
      value && queryCustomerContactByCustIdUrl({
        custId: value
      }).then(response => {
        this.selectData.customerContacts = response.data.customerContacts
        this.selectData.billContacts = response.data.BillContacts
        this.changeCustsInfo.custName = this.queryCustomerNameIdList.find(item =>item.custId == this.changeCustsInfo.custId).fullname
      })
    },
    queryCustomerNameId(query) {
      if (query !== '') {
        setTimeout(() => {
          queryCustomerNameId({isCustomer: 1, pageNo: 0, pageSize: 100, keyword: query}).then(res => {
            this.queryCustomerNameIdList = res.data
          })
        }, 200)
      }
    },
    changeCusts() {
      if (!this.getSelectedRows().length) {
        this.$message.error('请选择案件！')
        return
      }
      this.changeCustsInfo = {
        custName: '',
        custId: '',
        custRefno: '',
        custContactId: '',
        letterAddrId: '',
        billCustContactId: '',
        discount: '',
        billAddrId: ''
      }
      this.changeCustsView = true
    },
    submitChangeCusts() {
      updateCaseCust({
        caseIds: this.getSelectedRows().map(item => item.caseId),
        ...this.changeCustsInfo
      }).then(res => {
        this.$message.success('批量转客户成功')
        this.queryCaseList()
        this.changeCustsView = false
      })
    },
    textareaEnter(){

    },
    closeImportDialog() {
      this.importPriceView = false
      this.priceIdArray = []
    },
    importPrice(){
      if (!this.getSelectedRows().length) {
        this.$message.error('请选择案件！')
        return;
      }
      if (this.getSelectedRows().find(item => !['内-外', '外-外'].includes(item.appFromto))) {
        this.$message.error('案件的申请方向必须是内-外/外-外！')
        return;
      }
      if ([...new Set(this.getSelectedRows().map(item => item.caseType))].length > 1) {
        this.$message.error('所选案件类型必须相同！')
        return;
      }
      this.importPriceView = true
      this.priceIdArray = this.getSelectedRows().map(item => item.caseId)
    },
    saveCaseCust() {
      let senddata
      setTimeout(()=> {
        senddata = this.$refs.willtable.getChangeData()
        senddata = senddata.map(item => {
          for (const ite in item) {
            if (item.hasOwnProperty(ite)) {
              if (item[ite] && item[ite].value && item[ite].label) {

                if (item[ite] && item[ite].applicantName) {
                  item['appId'] = item[ite].appId
                }
                item[ite] = item[ite].value;
              }
            }
          }
          return item;
        });
        if (senddata && senddata.length <= 0) {
          this.$message.error('暂无修改');
          return;
        }
        updateCaseCustInfo({ tmCaseList: senddata }).then(res => {
          this.$message.success(res.message || '修改成功!');
          this.queryCaseList()
          // ['custRefno', 'custContactId', 'letterAddrId', 'billCustContactId', 'trademarkCaseCustContactArray', 'billAddrId', 'discount', 'remarks']
          // this.caseList.forEach(item => {
          //   if (senddata.find(i => i.caseId == item.caseId)) {
          //     const obj = senddata.find(i => i.caseId == item.caseId)
          //     for (let key in obj) {
          //       this.$set(item, key, obj[key])
          //     }
          //   }
          // })
          // this.gridApi.refreshCells()
          this.custTableView = false
        });
      }, 0)
    },
    getCurrentRowsData(key){
      if (this.gridApi && this.gridApi.rowModel) {
        return this.gridApi.rowModel.rootNode.childrenAfterSort.map(item => item.data).map(item=>item[key])
      }
      return []
    },
    closeRelevantDialog(){
      this.relevantView = false
      this.relCaseId = ''
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
    rightDrag(){
      let that=this
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
            }
            else if (info.dir == 'hor') {
              this.elem.style.width = info.width + 'px';
              localStorage.setItem('leftWrapWidth', info.width + 'px')
              that.leftWrapWidth = info.width + 'px'
            }
          }
        })
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
    uploadDocFile(file){
      let formData = new FormData()
      for (let item of file){
        formData.append("attachFile", item);
      }
      formData.append("tokenID", this.$store.getters.token);
      formData.append("insIdList",this.getSelectedSortRows().map(item=>item.tmFileId));
      formData.append("lastModify",  Array.from(file).map(item=>item.name+'_'+item.lastModified).join(','));
      uploadDocFile(formData,(e)=>{
        this.percentage = parseInt(e.loaded/e.total*100)
      }).then(res => {
        this.percentage = 0
        this.$message.success(res.message)
      }).catch(()=>{
        this.percentage = 0
      })
    },
    init(flag){

      // browserBehavior()
      if(flag){
        Bus.$on('keyboardEvents', context => {
          if(!this.selectionState){
            if(context==40){
              if(this.gridApi.rowModel.rootNode.childrenAfterSort[this.gridApi.rowModel.rootNode.childrenAfterSort.indexOf(this.gridApi.selectionController.lastSelectedNode)+1]){
                this.gridApi.rowModel.rootNode.childrenAfterSort[this.gridApi.rowModel.rootNode.childrenAfterSort.indexOf(this.gridApi.selectionController.lastSelectedNode)+1].setSelected(true, true);
                console.log(this.gridApi.rowModel.rootNode.childrenAfterSort[this.gridApi.rowModel.rootNode.childrenAfterSort.indexOf(this.gridApi.selectionController.lastSelectedNode) + 1],666);
              }
            }
            if(context==38){
              if( this.gridApi.rowModel.rootNode.childrenAfterSort[this.gridApi.rowModel.rootNode.childrenAfterSort.indexOf(this.gridApi.selectionController.lastSelectedNode)-1]){
                this.gridApi.rowModel.rootNode.childrenAfterSort[this.gridApi.rowModel.rootNode.childrenAfterSort.indexOf(this.gridApi.selectionController.lastSelectedNode)-1].setSelected(true, true);
              }
            }
          }
          const that =this
          switch (context) {
            case 112: this.$store.getters.permissions.includes(180)?this.handleSelect('1-1-1' ):'';break;
            case 113:this.$store.getters.permissions.includes(181)?this.handleSelect('1-1-2' ):'';break;
            case 114:this.$store.getters.permissions.includes(182)?this.handleSelect('1-2-1' ):''; break;
            case 115:this.$store.getters.permissions.includes(183)? ~function () {   that.handleSelect('1-2-2' );if(that.pageTitle=='案件管理')that.jumpDetailSubmisson();
            } ():''; break;
            case 117:  ~function () {   that.handleSelect('1-2-2-2' );if(that.pageTitle=='案件管理')that.jumpDetailSubmisson();
            } (); break;//this.handleSelect('1-2-2-2');break;
            case 118: this.handleSelect('1-2-3');break;
            case 119: this.handleSelect('1-2-4');break;
            case 120: this.handleSelect('1-2-5');break;
            case 121: this.handleSelect('1-2-6');break;
            case 122:this.$store.getters.permissions.includes(190)? this.handleSelect('1-3-1' ):'';break;
            case 123:this.$store.getters.permissions.includes(191)? this.handleSelect('1-3-2' ):'';break;
            default:return
          }
        })
      }
      localStorage.setItem('field','1')
      this.$store.commit('caseInformation/SET_BUSSID',this.bussId)
      if (this.pageTitle === "官方通知") {
        this.getManualRecognitionOfficialInfoCount();
      }
      if(this.$route.query.instructionSubmitStatus){
        this.$set(this.queryModuleData, "instructionSubmitStatus",Number(this.$route.query.instructionSubmitStatus));
        this.queryCaseList();
      } else {
        if(flag){
          this.queryFilterConfig(1);
        }
      }
      if(flag) {
        this.getAllWfs();
      }
      if(this.pageTitle=='递交官方'||this.pageTitle=='案件管理'){
        this.changeKeepAlive()
      }
    },
    // cellKeydown(params){
    //   if(params.event.keyCode==40||params.event.keyCode==38){
    //     // this.rowClicked(params)
    //     // console.log(params);
    //     console.log(params.data);
    //     params.node.setSelected(true, true);
    //   }
    // },
    rowSelected(params){
      if(this.pdfDataState){
        if(params.node.selected){
          this.pdfData=[]
          this.$nextTick(()=>{
            if(params.node.data.addressList){
              this.pdfData = params.node.data.addressList.filter(itm=>['pdf','jpg','png'].some(item=>itm.replace(/.+\./,"").toLocaleLowerCase()==item))
              if(this.pdfData.length==0){
                this.pdfDataState=false
              }
            }
            // this.pdfDataState = true;
            // this.pdfPre(params.node.data,params.value,params.node)
          })
        }
      }
      if(!this.selectionState){
        this.rowClicked(params)
      }
    },
    rowClicked(param){
      if(param.node.selected){
        if(this.pageTitle=='案件管理'&&param.data.isCheck==1){
          if(param.data[this.getCurFilterId(this.pageTitle)]!=this.currentId){
            this.currentId=''
            this.currentCaseId=''
            this.$nextTick(()=>{
              this.currentId=param.data[this.getCurFilterId(this.pageTitle)]
              this.currentCaseId=param.data.caseId
            })
          }
        }
        if(this.pageTitle!='案件管理'){
          if(param.data[this.getCurFilterId(this.pageTitle)]!=this.currentId){
            this.currentId=''
            this.currentCaseId=''
            this.currentTltId=''
            this.$nextTick(()=>{
              this.currentId=param.data[this.getCurFilterId(this.pageTitle)]
              this.currentCaseId=param.data.caseId
              if(!this.currentCaseId){
                this.currentTltId=param.data.tltId
              }
            })
          }
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
      // if(!params.columnApi.columnController.groupAutoColumns) {
      //   this.gridApi.forEachNode(rowNode => {
      //     rowNode.setDataValue(
      //       'sid',
      //       rowNode.rowIndex + 1)
      //   });
      // }
      if(this.caseList.length){
        if(params.type=="filterChanged"){
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
          if(arr.length){
            if(arr.length == 1 && arr[0] == 'gfCreateDate' && data.gfCreateDate.values.length == 0){
              this.brushRightHasFilter=false
            }else{
              this.brushRightHasFilter=true
            }
          }else {
            this.brushRightHasFilter=false
          }
          // if(arr.length){
          //   this.brushRightHasFilter=true
          // }else {
          //   this.brushRightHasFilter=false
          // }
        }
        if(params.type=="sortChanged"){
          this.$commonUtils.saveFilterModel(this.$options.name+this.$route.name,'SortModel',this.gridApi.getSortModel())
        }
      }
    },
    selectionChanged(params,n){
      let flag=true
        if (this.multipleTypeText === "递交") {
          if ([...new Set(this.getSelectedRows().map(item => item.custName))].length >= 2) {
            this.$message.error("您必须选择同一客户下的案件");
            flag=false
          }
          if ([...new Set(this.getSelectedRows().map(item => item.caseType))].length >= 2) {
            this.$message.error("您必须选择同一案件类型的案件");
            flag=false
          }
          if ([...new Set(this.getSelectedRows().map(item => item.appCnName))].length >= 2) {
            this.$message.error("您必须选择同一申请人下的案件");
            flag=false
          }
        }

        if (this.multipleTypeText === "新建账单" || this.multipleTypeText === "新建内部账单") {
          if ([...new Set(this.getSelectedRows().map(item => item.custName))].length >= 2) {
            this.$message.error("您必须选择同一客户下的案件");
            flag=false
          }
        }
        // if (this.multipleTypeText === "批量操作") {
        //   if ([...new Set(this.getSelectedRows().map(item => item.caseTypeId))].length >= 2) {
        //     this.$message.error("您必须选择同一案件类型的案件");
        //     flag=false
        //   }
        //   if (this.multipleSelection.length&&(this.getSelectedRows()[0].caseTypeId==48||this.getSelectedRows()[0].caseTypeId==62)&&[...new Set(this.getSelectedRows().map(item => item.changeType))].length >= 2) {
        //     this.$message.error("您必须选择同一撤回类型的案件");
        //     flag=false
        //   }
        // }
        if (this.multipleTypeText === "报官清单"){
          if(this.requireList.length){

            this.requireList.forEach(thisType =>{
              if ([...new Set(this.multipleSelection.map(item => item[thisType['value']]))].length >= 2) {
                this.$message.error(`该选择需要${thisType.label}相同`);
                flag=false
              }
            })
          }
        }
        if(this.multipleTypeText === "申请书") {
          if ([...new Set(this.getSelectedRows().map(item => item.caseType))].length >= 2) {
            this.$message.error("您必须选择同一案件类型的案件");
            flag=false
          }
        }
        return flag
    },
    cellRenderer(params){
      if(params.colDef.field=='imageFile'){
        let tyimage = ''
        if(/^tmFile|\/tmFile/.test(params.value)){
          tyimage = `${params.value}`;
        }else {
          tyimage = `/ipdoc${params.value}`;
        }
        return  `<img class="filterTableTmg" src="${tyimage}" alt="">`
      }
      if(params.colDef.field=='isLackMaterial'){
        if (params.value=='是'){
          return `<label role="checkbox" class="el-checkbox is-checked" aria-checked="true"><span aria-checked="mixed" class="el-checkbox__input is-checked"><span class="el-checkbox__inner"></span><input type="checkbox" aria-hidden="true" class="el-checkbox__original" value=""></span></label>`
        } else {
          return `<label role="checkbox" class="el-checkbox" aria-checked="true"><span aria-checked="mixed" class="el-checkbox__input"><span class="el-checkbox__inner"></span><input type="checkbox" aria-hidden="true" class="el-checkbox__original" value=""></span></label>`
        }
      }
      if(params.colDef.field=='agentNum'){
        var eDiv = document.createElement('div');
        eDiv.innerHTML = `<span class="btn-simple fillwidth-text" title="${params.data.autowriteStatus || params.value}">${params.value?params.value:''}</span>`
        var eButton = eDiv.querySelectorAll('.btn-simple')[0];

        eButton.addEventListener('click', ()=> {
          if(!this.pattern&&!this.selectionState){
            this.takeCaseDetail(params.data)
          }
        });

        return eDiv;
      }
      if(params.colDef.field==='reportMatter'){
        if(params.value=='申请'){
          return `<span style="color:blue" title="${params.value}">${params.value ? params.value :''}</span>`
        } else {
          return  `<span style="color:red" title="${params.value}">${params.value ? params.value :''}</span>`
        }
      } else if (params.colDef.field === 'insSubmitType') {
        if (params.value == '人工送达') {
          return `<span style="color:blue" title="${params.value}">${params.value ? params.value :''}</span>`
        } else {
          return `<span style="color:red" title="${params.value}">${params.value ? params.value :''}</span>`
        }
      } else if (params.colDef.field ==='submitPlace') {
        if (params.value == '国际处' ||params.value == '海淀区工商局') {
          return `<span style="color:blue" title="${params.value}">${params.value ? params.value :''}</span>`
        }
      }
      if(params.colDef.field == 'sid'){
        return params.rowIndex+1
      }
      if(params.colDef.field == 'multiclassStr'){
        return `<span title="${params.value}">${params.value?params.value:'否'}</span>`
      }
      if(params.colDef.field == 'feeTotal'){
        return `<span title="${params.value}">${params.value?this.formatAmount(params.value):'0.00'}</span>`
      }
      if(params.colDef.field == 'gfTypeName'){
        return `<span class="fillwidth-text" title="${params.data.autowriteStatus || params.value}">${params.value}</span>`
      }

      return `<span title="${params.value}">${params.value?params.value:''}</span>`
    },
    rowDoubleClicked(params){
      var row=params.data
      if(this.pageTitle!=='案件管理'){
        this.getViewRow(row)
      } else {
        if(row.isCheck==1){
          this.takeCaseDetail(row)
        }
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
    //     this.columnDefs.find(item=>item.field=='sid').width=80
    //     this.columnDefs.push({})
    //     this.columnDefs.pop({})
    //   }else {
    //     this.columnDefs.find(item=>item.field=='sid').checkboxSelection=false
    //     this.columnDefs.find(item=>item.field=='sid').headerCheckboxSelection=false
    //     this.columnDefs.find(item=>item.field=='sid').width=60
    //     this.columnDefs.push({})
    //     this.columnDefs.pop({})
    //   }
    // },
    getSelectedRows() {
      if(this.gridApi){
        const selectedNodes = this.gridApi.getSelectedNodes();
        const selectedData = selectedNodes.map(node => node.data);
        return selectedData
      }else {
        return []
      }

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
    onGridReady(params) {
      this.gridparams=params
      this.gridApi = params.api;
      this.columnApi = params.columnApi;
      this.init(1)
      let that=this
      this.$nextTick(()=>{
        if(document.querySelector('.ag-body-viewport')){
          document.querySelector('.ag-body-viewport').onscroll=function (e) {
            that.scrollTopY= e.target.scrollTop
          }
        }
      })
    },
    dragStopped(params){
      let tableHeader=params.columnApi.columnController.gridColumns.map(item=>({
        label:item.colDef.headerName,
        width:item.actualWidth,
        prop:item.colDef.field,
        pinned: item.pinned || ''
      })).filter(item=>item.prop!="group")
      var arr=JSON.parse(localStorage.getItem('tableHeader'))
      const rightFixIndex = tableHeader.findIndex(item => item.prop === 'sid')
      tableHeader.forEach((item, index) => {
        if (index <= rightFixIndex) {
          item.pinned = 'left'
        } else {
          item.pinned = ''
        }
      })
      arr.find(item=>item.name==this.$options.name+this.$route.name).tableHeader=tableHeader
      localStorage.setItem('tableHeader',JSON.stringify(arr))
      this.changeHeader(tableHeader)
    },

    getContextMenuItems(params){
      if(!params.node||!params.node.data){
        return []
      }
      return this.getRowContextmenuList(params.node.data).map(item=>({
        name: item.name,
        action: () =>{
          this[item.action](params.node.data,params.value,params.node)
        },
      }))
    },
    changeHeader(n){
      if(n&&n.length){
        this.checkCaseList=n.map(item => item.prop).filter(item=>item!='sid')
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
          //  this.$nextTick(()=>{
          //  //  this.tableState=true
          //    this.caseList.push({})
          //    this.caseList.pop()
          //  })
        });
      }
      // this.selectColumnList=
      // console.log(this.selectColumnList);
      // this.savePreference(1)
    },
    editableTab(data){
      if(data&&data!=0){
        this.myTabsActivity=true
      }else {
        this.myTabsActivity=false
      }
    },
    changeMultiple(text){
      // this.multipleTypeText=text
    },
    clickoutside(){
      this.drawerState = false
    },
    // closeCurrentRow(){
    //   this.currentCaseId=''
    //   this.currentId=''
    // },
    closeSelect(flag){
      this.detailSubmissionState=false
      this.timeLimitState=false
      this.selectionState=false
      this.selectionOptionState=false
      this.uploadState = false
      this.uploadType=''
      this.ManualIdentificationState = false
      this.uploadProofreadingState=false
      this.$emit('closeModel')
      this.changeKeepAlive()
      if(flag){
        this.queryCaseList()
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
    newlovingVue1(value,property){
      property.split(',').forEach((item,index)=>{
        this.queryModuleData[item]=value[index]
      })
    },
    getManualRecognitionOfficialInfoCount() {
      getManualRecognitionOfficialInfoCount({business: 2}).then(res => {
        this.officialInfoCount = res.data.count;
        this.officialInfoCounData=res.data
      });
    },
    recognizedError() {
      if (!this.getSelectedRows().length) {
        return;
      }
      this.$confirm("确认识别错误?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(()=>{
        recognizedError({
        tmFileIds: this.getSelectedRows().map(item => item.tmFileId).join(",")
        }).then(res => {
          this.getManualRecognitionOfficialInfoCount()
          this.selectionState=false
           this.queryCaseList();
        });
      })

    },
    takeCaseDetail(row) {
      this.closeSelect()
      if (this.pageTitle === "官方通知") {
        getCaseByTmFileId({ tmFileId: row.tmFileId }).then(res => {
          if (res.data.length > 1) {
            this.selectCaseList = res.data;
            this.selectCaseVisible = true;
          } else {
            this.$router.push("/workbench/case/seeCaseDetail/" + row.caseId);
            this.selectCaseVisible = false;
          }
        });
      } else {
        this.$router.push("/workbench/case/seeCaseDetail/" + row.caseId);
      }
    },
    closeTable(bool) {
      this.showTable = bool;
      this.selectionState=false
      this.queryCaseList();
    },
    pdfPre({ address },value,node) {
      this.pdfDataState = true;
      this.pdfData=[]
      this.$nextTick(()=>{
        if(node.data.addressList){
          this.pdfData =node.data.addressList.filter(itm=>['pdf','jpg','png'].some(item=>itm.replace(/.+\./,"").toLocaleLowerCase()==item))
          if(this.pdfData.length==0){
            this.pdfDataState=false
          }
        }
        // this.pdfDataState = true;
        // this.pdfPre(params.node.data,params.value,params.node)
      })
      // this.$nextTick(()=>{
      //   node.setSelected(true, true);
      // })

      // downLoadAll({ url: "ipdoc" + address, target: "_blank" });
      // this.pdfData ="ipdoc" + address

    },
    takeManualIdentification() {
      this.ManualIdentificationState = true;
    },
    handleSelect(key,requireList,multipleTypeTextDisabled) {
      this.requireList=[]
      this.uploadType=''
      this.multipleTypeText=''
      if(requireList){
        this.requireList=requireList
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
      if (key === "1-2-3") {
        this.multipleTypeText = "客户往来";
        this.uploadType = "客户往来";
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
      if (key === "1-2-6") {
        this.multipleTypeText = "对方当事人往来";
        this.uploadType = "对方当事人往来";
        // this.queryCaseList();
      }
      if (key === "1-2-7") {
        this.multipleTypeText = "撰写指派";
        // this.queryCaseList();
      }
      if (key === "1-2-8") {
        this.multipleTypeText = "境外盈余核算";
      }
      if (key === "批量操作") {
        this.multipleTypeText = "批量操作";
        // this.queryCaseList();
      }
      if (key === "批量编辑客户") {
        this.multipleTypeText = "批量编辑客户";
        // this.queryCaseList();
      }
      if (key === "文件下载") {
        this.multipleTypeText = "文件下载";
      }
      if (key === "变更办案人") {
        this.multipleTypeText = "变更办案人";
      }
      if (key === "1-2") {

        this.multipleTypeText = "模板生成";
        // this.multipleTypeText = "报官清单";
      }
      if (key === "1-3") {
        this.multipleTypeText = "模板生成";
        // this.multipleTypeText = "批量报官清单";
      }
      if (key === "文件上传排序") {
        this.multipleTypeText = "文件上传";
        this.multipleTypeTextDisabled=true
        // this.queryModuleData.isTmfileIdOrder=1
        this.queryCaseList({isTmfileIdOrder:1})
        return
      }
      // if (key === "文件上传") {
      //   this.multipleTypeText = "文件上传";
      // }
      if(multipleTypeTextDisabled){
        if(!this.getSelectedSortRows().length){
          this.$message.error('请选择需要匹配的案件')
          return;
        }

        if(!this.curFile.length){
          this.$message.error('先拖动文件到表格中，再点击"文件上传"')
          return
        }
        if(this.curFile.length!=this.getSelectedSortRows().length){
          this.$message.error('文件和案件数量需要相同')
          return
        }
        this.uploadProofreadingState=true
        return;
      }
      if (key === "1-4") {

        this.multipleTypeText = "工时";
      }
      if (key === "1-5") {

        this.multipleTypeText = "任务";
      }
      this.jumpDetailSubmisson(key)
    },
    exportList(flag){
      this.exportType=flag
      this.selectionOptionState=true
    },
    toExamine() {
      this.requireList=[]
      this.otherSelect=false
      this.exportListState=false
      this.multipleTypeText = "审核";
      this.jumpDetailSubmisson()
    },
    toSubmit() {
      this.requireList=[]
      this.otherSelect=false
      this.exportListState=false
      this.multipleTypeText = "递交";
      this.submitOffical()
    },
    submitOffical() {
      if (!this.getSelectedRows().length) {
        this.$message.error("请先选择！");
        return;
      }
      if(!this.selectionChanged()){
        return;
      }
      const data = {
        // userId: this.$store.getters.userId,
        // caseId: this.getSelectedRows()[0].caseId,
        insIdList: this.getSelectedRows().map(i=>i.insId),
        beforeSubmit: 1
      };
      submitOffical(data).then(res => {
        if (res.success) {
          this.queryCaseList();
        }
      });
    },
    getLanglist(array) {
      let arr = [];
      array.forEach(item => {
        arr.push(...item);
      });
      return arr;
    },
    async queryCaseSurplusListFunc(saveSurplus, billIds = []) {
      const list = this.getSelectedRows()
      if (list.find(item => !['内-外', '外-外'].includes(item.appFromto))) {
        this.$message.error("所选案件申请方向必须是【内-外】或者【外-外】！");
        return
      }
      if (list.find(item => !['结案'].includes(item.caseStatusName))) {
        this.$message.error("所选案件的案件最新状态必须是【结案】！");
        return
      }
      await queryCaseSurplusList({
        saveSurplus,
        billIds,
        caseIds: list.map(item => item.caseId)
      }).then(res => {
        if (res.messageType == 100) {
          this.$confirm(
            '提示',
            {
              message: this.$commonUtils.rowsMessage(res.message, '$'),
              confirmButtonText: '确定',
              // cancelButtonText: '否',
              showCancelButton: false,
              type: 'warning'
            }
          ).then(() => {}).catch(() => {})
          return
        }
        this.caseSurplusView = true
        this.caseSurplusList = res.data.caseSurplusList
        this.caseSurplusAddress = res.data.address
        // this.address = res.data.address
      })
    },
    async jumpDetailSubmisson(currentType) {
      if (!this.getSelectedRows().length) {
        this.$message.error("请先选择！");
        return;
      }
      if(!this.selectionChanged()){
        return;
      }
      console.log(currentType);
      if(currentType=='1-2'||currentType=='1-3'){
        this.$refs.exportFile.currentType=currentType
      }
      if (this.multipleTypeText === "境外盈余核算") {
        this.queryCaseSurplusListFunc()
        // alert(this.multipleTypeText)
      }
      if (this.multipleTypeText === "撰写指派") {
        if (this.pageTitle === "案件管理") {
          let caseIds = [...new Set(this.getSelectedRows().map(item => item.caseId))]
          this.trademarkWritingCaseIdList = caseIds
          this.trademarkWritingView = true

        } else if(this.pageTitle === "官方通知") {
          let list = this.unique(
            this.getSelectedRows(),
            this.getCurFilterId(this.pageTitle)
          );
          let caseIds = this.getLanglist(list.map(item => item.caseArray)).map(
            item => item.caseId
          );
          this.trademarkWritingCaseIdList = [...new Set(caseIds)]
          this.trademarkWritingView = true

        } else if(this.pageTitle === "递交官方") {
          let caseIds = [...new Set(this.getSelectedRows().map(item => item.caseId))]
          this.trademarkWritingCaseIdList = caseIds
          this.trademarkWritingView = true
        }
      }
      if (this.multipleTypeText === "递交") {
        if (this.pageTitle === "官方通知") {
          let list = this.unique(
            this.getSelectedRows(),
            this.getCurFilterId(this.pageTitle)
          );
          let caseIds = this.getLanglist(list.map(item => item.caseArray)).map(
            item => item.caseId
          );
          this.detailSubmissionData={
            caseIds: [...new Set(caseIds)] , pageType: "1"
          }
          this.detailSubmissionState=true
          // this.$router.push({
          //   path: "/workbench/case/detailSubmission",
          //   query: { caseIds: [...new Set(caseIds)] , pageType: "1" }
          // });
        } else {
          this.detailSubmissionData= {
            caseIds: [
              ...new Set(this.getSelectedRows().map(item => item.caseId))
            ],
            pageType: "1"
          }
          this.detailSubmissionState=true
        }
      }
      if (this.multipleTypeText === "官方通知") {
        if (this.pageTitle === "官方通知") {
          let list = this.unique(
            this.getSelectedRows(),
            this.getCurFilterId(this.pageTitle)
          );
          let caseList = this.getLanglist(list.map(item => item.caseArray));
          let caseIds = caseList.map(item => item.caseId);
          const queryInfo = {
            business: this.business,
            caseIds: [...new Set(caseIds)] ,
            pageType: "1",
            info: caseList
          };
          this.$emit("getCaseQueryInfo", queryInfo);
        } else {
          let info = this.unique(this.getSelectedRows(), "caseId");
          info.forEach(item => {
            delete item.insId;
          });
          const queryInfo = {
            business: this.business,
            caseIds: [
              ...new Set(this.getSelectedRows().map(item => item.caseId))
            ],
            pageType: "1",
            info
          };
          this.$emit("getCaseQueryInfo", queryInfo);
        }
      }
      if (this.multipleTypeText === "审核" && this.pageTitle === "递交官方") {
        const data = {
          userId: this.$store.getters.userId,
          caseIds: [
            ...new Set(this.getSelectedRows().map(item => item.caseId))
          ],
          insIdList: this.getSelectedRows().map(item => item.insId),
          result: 1
        };
        submitOfficalAudit(data).then(res => {
          if (res.success) {
            this.queryCaseList();
          }
        });
      }
      if (this.multipleTypeText === "审核" && this.pageTitle === "官方通知") {

        queryTrademarkCaseOfficial({ insIdList: this.getSelectedRows().map(item => item.tmFileId)}).then(res=>{
          this.examineDialog=true
          this.examineData=res.data
        })
        // auditOfficalDoc(data).then(res => {
        //
        //     this.selectionState=false
        //     this.queryCaseList();
        //
        // });
      }
      if (this.multipleTypeText === "新建账单") {
        if (this.pageTitle === "官方通知") {
          let list = this.unique(
            this.getSelectedRows(),
            this.getCurFilterId(this.pageTitle)
          );
          let caseIds = this.getLanglist(list.map(item => item.caseArray)).map(
            item => item.caseId
          );
          if([...new Set(caseIds)].length>1000){
            this.$store.commit('caseInformation/SET_CASEIDLIST',[...new Set(caseIds)])
          }
          this.$router.push({
            path: "/workbench/finance/off_bill/bill",
            query: { caseIdList:[...new Set(caseIds)] }
          });
        } else {
          if([
            ...new Set(this.getSelectedRows().map(item => item.caseId))
          ].length>1000){
            this.$store.commit('caseInformation/SET_CASEIDLIST',[
              ...new Set(this.getSelectedRows().map(item => item.caseId))
            ])
          }
          this.$router.push({
            path: "/workbench/finance/off_bill/bill",
            query: {
              caseIdList: [
                ...new Set(this.getSelectedRows().map(item => item.caseId))
              ]
            }
          });
        }
      }
      if ( this.multipleTypeText === "新建内部账单") {
        if (this.pageTitle === "官方通知") {
          let list = this.unique(
            this.getSelectedRows(),
            this.getCurFilterId(this.pageTitle)
          );
          let caseIds = this.getLanglist(list.map(item => item.caseArray)).map(
            item => item.caseId
          );
          if([...new Set(caseIds)].length>1000){
            this.$store.commit('caseInformation/SET_CASEIDLIST',[...new Set(caseIds)])
          }
          this.$router.push({
            path: "/workbench/finance/off_bill/bill",
            query: { caseIdList: [...new Set(caseIds)]}
          });
        } else {
          if([
            ...new Set(this.getSelectedRows().map(item => item.caseId))
          ].length>1000){
            this.$store.commit('caseInformation/SET_CASEIDLIST',[
              ...new Set(this.getSelectedRows().map(item => item.caseId))
            ])
          }
          this.$router.push({
            path: "/workbench/finance/off_bill/insideBill",
            query: {
              caseIdList: [
                ...new Set(this.getSelectedRows().map(item => item.caseId))
              ]
            }
          });
        }
      }
      if (this.multipleTypeText === "新建官方时限") {
        if (this.pageTitle === "官方通知") {
          let list = this.unique(
            this.getSelectedRows(),
            this.getCurFilterId(this.pageTitle)
          );
          let agentNums = this.getLanglist(list.map(item => item.caseArray))
            .map(item => item.agentNum)
            .join(",");
           this.timeLimitData={
             agentNums: agentNums, kind: 1
           }
          this.curentObjInstId = list[0][this.getCurFilterId(this.pageTitle)]
           if(list.reduce((pre,next)=>next.caseArray.length?pre+1:pre,0)!=list.length&&list.length>1){
             this.$message.error('只能选一个无案件官文绑定时限')
            return;
           }
          this.timeLimitState=true
          // this.$router.push({
          //   path: "/workbench/createTimeLimit",
          //   query: { agentNums: agentNums, kind: 1 }
          // });
        } else {
          // this.$router.push({
          //   path: "/workbench/createTimeLimit",
          //   query: {
          //     agentNums: [
          //       ...new Set(this.getSelectedRows().map(item => item.agentNum))
          //     ].join(","),
          //     kind: 1
          //   }
          // });
          this.timeLimitData={
            agentNums: [
                  ...new Set(this.getSelectedRows().map(item => item.agentNum))
                ].join(","),
                kind: 1
          }

          this.timeLimitState=true
        }
      }
      if ( this.multipleTypeText === "新建内部时限") {
        if (this.pageTitle === "官方通知") {
          let list = this.unique(
            this.getSelectedRows(),
            this.getCurFilterId(this.pageTitle)
          );
          let agentNums = this.getLanglist(list.map(item => item.caseArray))
            .map(item => item.agentNum)
            .join(",");
          this.timeLimitData={
            agentNums: agentNums, kind: 2
          }
          this.curentObjInstId = list[0][this.getCurFilterId(this.pageTitle)]
          if(list.reduce((pre,next)=>next.caseArray.length?pre+1:pre,0)!=list.length&&list.length>1){
            this.$message.error('只能选一个无案件官文绑定时限')
            return;
          }
          this.timeLimitState=true
          // let agentNums = this.getLanglist(list.map(item => item.caseArray))
          //   .map(item => item.agentNum)
          //   .join(",");
          // this.$router.push({
          //   path: "/workbench/createTimeLimit",
          //   query: { agentNums: agentNums, kind: 2 }
          // });
        } else {
          this.timeLimitData={
            agentNums: [
              ...new Set(this.getSelectedRows().map(item => item.agentNum))
            ].join(","),
            kind: 2
          }
          this.timeLimitState=true
          // this.$router.push({
          //   path: "/workbench/createTimeLimit",
          //   query: {
          //     agentNums: [
          //       ...new Set(this.getSelectedRows().map(item => item.agentNum))
          //     ].join(","),
          //     kind: 2
          //   }
          // });
        }
      }
      if (this.multipleTypeText === "新建费用") {
        if (this.pageTitle === "官方通知") {
          let list = this.unique(
            this.getSelectedRows(),
            this.getCurFilterId(this.pageTitle)
          );
          let agentNums = this.getLanglist(list.map(item => item.caseArray))
            .map(item => item.agentNum)
            .join(",");

          this.$router.push({
            path: "/workbench/finance/addFeeDetail/1",
            query: { agentNums: agentNums, kind: 2 }
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
      }
      if (this.multipleTypeText === "新建境外账单") {
        if (this.pageTitle === "官方通知") {
          let list = this.unique(
            this.getSelectedRows(),
            this.getCurFilterId(this.pageTitle)
          );
          let agentNums = this.getLanglist(list.map(item => item.caseArray))
            .map(item => item.agentNum)
            .join(",");

          this.$router.push({
            path: "/workbench/finance/addOverseasBill/1",
            query: { agentNums: agentNums }
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
      if (this.multipleTypeText === "批量编辑客户") {
        this.plType = '编辑客户'
        this.willtableCaseIdList = [
          ...new Set(this.getSelectedSortRows().map(item => item.caseId))
        ];
        this.custTableView = true
        queryCaseByCaseIdsUrl({ caseIds: this.willtableCaseIdList,propertiesArray: this.columns.map(item => item.key), business: 2 }).then(res => {
           let data= res.data
          res.data.forEach((item,index)=>{
            item.sid=index+1
            for(let k in item){
              if(item[k] === 0 || item[k] === 1) {
                item[k] = String(item[k])
              }
            }
          })
          this.tableData = data
          this.$refs.willtable.setData(data);
          this.$nextTick(()=>{
            this.rowHeight=this.$refs.willtable.$el.querySelectorAll('tr')[res.data.length-1].getBoundingClientRect().height
          })
        });
      }
      if ( this.multipleTypeText === "批量操作") {
        this.plType = this.pageTitle + this.taskType; // this.taskType区分不同的pageTitle
        if (this.pageTitle === "官方通知") {
          if(this.$store.getters.permissions.includes(195) || this.$store.getters.permissions.includes(200)){
            if(this.$store.getters.permissions.includes(195) && !this.$store.getters.permissions.includes(200)){
              if(this.getSelectedSortRows().find(item => item.auditStatus === 1)){
                this.$message.error('无法批量编辑所选官方通知！')
                return;
              }
            }
            if(this.$store.getters.permissions.includes(200) && !this.$store.getters.permissions.includes(195)) {
              if(this.getSelectedSortRows().find(item => item.auditStatus === 0 || item.auditStatus === 2 || item.auditStatus === 3)){
                this.$message.error('无法批量编辑所选官方通知！')
                return;
              }
            }
          }else{
            this.$message.error('无法批量编辑所选官方通知！')
            return;
          }
          // let list = this.unique(
          //   this.multipleSelection,
          //   this.getCurFilterId(this.pageTitle)
          // );
          // let caseIdList = this.getLanglist(
          //   list.map(item => item.caseArray)
          // ).map(item => item.tmFileId);
          this.willtableCaseIdList = [
            ...new Set(this.getSelectedSortRows().map(item => item.tmFileId))
          ];
          // this.willtableCaseIdList = caseIdList;
          this.showTable = true;
        } else {
          if (this.pageTitle === "递交官方") {
            this.willtableCaseIdList = [
              ...new Set(this.getSelectedSortRows().map(item => item.insId))
            ];
            const examineBeforeList = this.caseList
              .filter(item => this.willtableCaseIdList.includes(item.insId) && !item.auditStatus)
              .map(item => item.agentNum)
            const examineBeforeListSet = Array.from(new Set(examineBeforeList))
            const examineAfterList = this.caseList
              .filter(item => this.willtableCaseIdList.includes(item.insId) && item.auditStatus)
              .map(item => item.agentNum)
            const examineAfterListSet = Array.from(new Set(examineAfterList))

            let msg = ''
            if (!this.$store.getters.permissions.includes(194)&&examineBeforeListSet.length>0) {
              msg += `<div style="margin-bottom:6px;">您没有审核通过前修改权限，不能编辑下列递交指令:</div>
              ${examineBeforeListSet.length>10 ? examineBeforeListSet.splice(0,10).join('、') + '......' : examineBeforeListSet.join('、')}
              `
            }
            if (!this.$store.getters.permissions.includes(197)&&examineAfterListSet.length>0) {
              msg += `<div style="margin:6px 0;">您没有审核通过后修改权限，不能编辑下列递交指令：</div>
              ${examineAfterListSet.length>10 ? examineAfterListSet.splice(0,10).join('、') + '......' : examineAfterListSet.join('、')}
              `
            }
            if (msg) {
             return this.$message.error({
              dangerouslyUseHTMLString: true,
              message:msg,
              duration:5000
             })
            }
            let res = await checkPermission({
              insIdList: this.willtableCaseIdList
            });

            if(!res.data.modify){
              this.$message.error('无法批量编辑所选递交指令！')
              return;
            }
          } else {
            if(this.getSelectedSortRows().find(item => !item.isCheck)){
              this.$message.error('无法批量编辑所选案件！')
              return;
            }
            if(this.$store.getters.permissions.includes(203) || this.$store.getters.permissions.includes(204)){
              console.log('有203或204权限:')
              console.log('203:', this.$store.getters.permissions.includes(203))
              console.log('204:', this.$store.getters.permissions.includes(204))
              if(this.$store.getters.permissions.includes(203) && !this.$store.getters.permissions.includes(204)){
                console.log('+++++++++++++++++')
                console.log('有203没有204权限')
                console.log('所选案件')
                console.log(this.getSelectedSortRows())
                console.log('isSubmitOfficial为1的案件:')
                console.log(this.getSelectedSortRows().find(item => item.isSubmitOfficial === 1))
                console.log('+++++++++++++++++')
                if(this.getSelectedSortRows().find(item => item.isSubmitOfficial === 1)){
                  console.log('这里提示无法编辑递交后所选案件')
                  this.$message.error('无法批量编辑所选案件！')
                  return;
                }
              }
              if(this.$store.getters.permissions.includes(204) && !this.$store.getters.permissions.includes(203)) {
                console.log('+++++++++++++++++')
                console.log('有204没有203权限')
                console.log('所选案件')
                console.log(this.getSelectedSortRows())
                console.log('isSubmitOfficial为0的案件:')
                console.log(this.getSelectedSortRows().find(item => item.isSubmitOfficial === 0))
                console.log('+++++++++++++++++')
                if(this.getSelectedSortRows().filter(row => !(row.agentNum.slice(0,2) === 'NO' && row.createUserId == this.userId)).find(item => item.isSubmitOfficial === 0)){
                  console.log('这里提示无法编辑递前后所选案件')
                  this.$message.error('无法批量编辑所选案件！')
                  return;
                }
              }
            }else if(this.getSelectedSortRows().every(row => row.agentNum.slice(0,2) === 'NO' && row.createUserId == this.userId)){

            }
            else{
              this.$message.error('无法批量编辑所选案件！')
              return;
            }
            this.willtableCaseIdList = [
              ...new Set(this.getSelectedSortRows().map(item => item.caseId))
            ];
            this.modifyCase = 1
          }

          this.showTable = true;
        }
      }
      if ( this.multipleTypeText === "变更办案人") {
        queryCaseWork({caseId:this.getSelectedRows()[0].caseId}).then(res=>{
          // this.updateWkgData= res.data
          this.updateWkgData={...{caseTypeId:this.getSelectedRows()[0].caseTypeId,trademarkCaseCustWorkgroups:[{ wkgId: "" }],trademarkCaseCBWorkgroups:[],trademarkCaseLCWorkgroups:[{groupName:''}]},...res.data}
          this.updateWkgState = true;
        })

      }

      if(this.multipleTypeText==='模板生成'){
        this.downLoadState=true
        this.$nextTick(()=>{
          this.downLoadState=false
        })
      }
      if ( this.multipleTypeText === "文件下载") {
        this.fileDownLoadView = true;
      }
      if(this.exportListState){
        this.selectionOptionState=true
        this.exportListState=false
      }
      if(this.uploadType&&!this.otherSelect&&!this.selectionOptionState){
        this.uploadState=true
      }
      // this.selectionState = false;
    },
    auditOfficalDoc(){
      let list = this.unique(
        this.getSelectedRows(),
        this.getCurFilterId(this.pageTitle)
      );
      let caseList = this.getLanglist(list.map(item => item.caseArray));
      let caseIds = caseList.map(item => item.caseId);
      const data = {
        userId: this.$store.getters.userId,
        caseIds: caseIds,
        insIdList: this.getSelectedRows().map(item => item.tmFileId),
        result: 1
      };
      this.scrollTop = document.getElementsByClassName('ag-body-viewport')[0].scrollTop
      auditOfficalDoc(data).then(res => {
        let rowIndex = this.gridApi.getSelectedNodes()[0].rowIndex
        this.examineDialog = false
        this.caseList = this.caseList.filter(i=>!this.getSelectedRows().includes(i))
        this.currentPageSize -= this.getSelectedRows().length
        this.$nextTick(()=>{
          var obj = document.getElementsByClassName('ag-body-viewport')[0]
          obj.scrollTop = this.scrollTop
          this.gridApi.rowModel.rootNode.allLeafChildren.find(i=>i.childIndex == rowIndex).setSelected(true)
        })
        // this.queryCaseList();
      });
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
    getCurFilterCaseData(){
      if(this.pageTitle==='官方通知'){
        let list = this.unique(
          this.getSelectedRows(),
          this.getCurFilterId(this.pageTitle)
        );
        let caseList = this.getLanglist(list.map(item => (item.caseArray || [])));
        return this.unique(caseList, 'caseId')
      } else {
        return this.unique( this.getSelectedRows(), 'caseId')
      }
    },
    getExportFileData(requireList,key){
      if(key){
        this.$refs.exportFile.currentType=key
      }
      this.multipleTypeTextDisabled=false
      this.multipleTypeText='模板生成'
      this.exportListState=false
      this.requireList=requireList
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
    remoteMethod(value, index, property, filterName) {
      if (value && filterName === "客户") {
        let request = new Promise(resolve => {
          if(this.queryModuleData[property]&&this.queryModuleData[property].length){
            queryCustomerNameId({ pageNo: 1, pageSize: 100, custIdArray: this.queryModuleData[property]}).then(res=>{
              resolve(res)
            })
          } else {
            resolve({data:[]})
          }
        })
        Promise.all([ request,queryList({ pageNo: 1, pageSize: 100,sign:1, parameter: value})]).then(res=>{
          this.$set(
            this.conditionsModuleList[index],
            "valueList",
            this.$commonUtils.unique(res[0].data.concat(res[1].data).map(item => ({ id: item.custId, value:item.name,value1:item.country,value2:item.fullname})),'id')
          );
          this.$forceUpdate();
        })
      }
      if (value && ["申请人",  "转让人"].includes(filterName)) {
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
              id: item.applicantName,
              value: item.applicantName,
              value1: item.applicantEnName,
              value2: item.applicantAddress,
              value3: item.applicantEnAddress
            }))
          );
          this.$forceUpdate();
        });
      }
      if (value && ["被申请人"].includes(filterName)) {
          querylyctListUrl({
            fullname: value,
            pageNo: 1,
            pageSize: 100,
            isCustomer:1
          }).then(res => {
            this.$set(
              this.conditionsModuleList[index],
              "valueList",
              res.data.map(item => ({
                id: item.fullname,
                value: item.fullname,
                value1: item.fullnameEn,
                value2: item.address,
                value3: item.addressEn
              }))
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
        if (value && ["信函地址","账单地址"].includes(filterName)) {
          queryCustomerAddrAll({
            addressCn: value,
            pageNo: 1,
            pageSize: 100,
          }).then(res => {
            this.$set(
              this.conditionsModuleList[index],
              "valueList",
              res.data.map(item => ({
                id: item.addrId,
                value: item.addressCn,
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
      if (
        value &&
        filterName !== "客户" &&
        !["申请人", "被申请人", "转让人","客户联系人","账单联系人",'信函地址','账单地址','外方代理所'].includes(filterName)
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
    changeTextRange(value, property) {
      this.$set(this.queryModuleData, property, value);
      // if(property=='agentNumEnd'){
      //   this.handleSearch(1)
      // }
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
    changePattern(e){
      if(e===1){
        this.$store.commit('user/SET_PATTERN',false)
      } else {
        this.$store.commit('user/SET_PATTERN',true)
        // if(this.caseList.length&&!this.currentId){
        //   let row = this.caseList.find((item,index) => index == 0)
        //   // this.currentId=row[this.getCurFilterId(this.pageTitle)]
        //   // this.currentCaseId=row.caseId
        //   // this.$refs.caseListMultiple.setCurrentRow(row)
        // }
      }
    },
    changeDjSubmitDate(e){
      if(this.drawerState){
        return
      }
      if(e.filter(item=>item).length===2){
        if(this.pageTitle=='递交官方'){
          this.$set(this.queryModuleData,'instructionSubmitStatus',0)
        }
        this.handleSearch(1)
      }else if(e.filter(item=>item).length===0){
        this.handleSearch(1)
      }
    },
    handleSearch(flag,e) {
      this.handleQuickQuery()
      if(e){
        return
      }
      if (this.queryModuleData.regAndAgent && this.pageTitle == '官方通知') {
        this.$set(this.queryModuleData, 'officialInformScreen', '7')
      }
      if (this.queryModuleData.regAndAgent && this.pageTitle == '递交官方') {
        this.$set(this.queryModuleData, 'instructionSubmitStatus', 0)
      }
      if (this.queryModuleData.regAndAgent && this.pageTitle == '案件管理') {
        this.$set(this.queryModuleData, 'myCase', '1')
      }
      this.operationState=flag
      this.drawerState=false
      this.listQuery.pageNo = 1;
      this.queryCaseList();
      if(JSON.parse(localStorage.getItem('queryModuleData'))){
        var arr = JSON.parse(localStorage.getItem('queryModuleData'))
      }else {
        var arr = []
      }
      if(arr.find(item=>item.name==this.identification)){
       let data= arr.find(item=>item.name==this.identification)
        data.queryModuleData=this.queryModuleData
        data.operationState=this.operationState
      }else {
        arr.push({name:this.identification,queryModuleData:this.queryModuleData,operationState:this.operationState})
      }
      localStorage.setItem('queryModuleData',JSON.stringify(arr))
    },
    clearSearch() {
      for (var key in this.queryModuleData) {
        if(!['officialInformScreen', 'myCase', 'instructionSubmitStatus'].includes(key)){
          if(key.includes('Date')){
            this.$set(this.queryModuleData,key,['',''])
          } else if(key.includes('Array')) {
            this.$set(this.queryModuleData,key,[])
          }else if(key==='caseTypeIds'||key==='deptGroupIds' || key === 'cbGroupIds'){
            this.$set(this.queryModuleData,key,[])
          } else if(Array.isArray(this.queryModuleData[key])){
            this.$set(this.queryModuleData,key,[])
          }else{
            this.$set(this.queryModuleData,key,null)
          }
        }
      }
      if(this.$refs.multiCascader){
        this.$refs.multiCascader.forEach(item=>{
          item.$el.querySelector('.el-input__inner').value=''
        })
      }
    },
    editFun(row) {
      this.scrollTop = document.getElementsByClassName('ag-body-viewport')[0].scrollTop
      this.$emit("getCaseRow", row);
    },
    getViewRow(row){
      this.$emit("getViewRow", row);
    },
    queryCaseList(obj) {
      if(obj){
        for (var key in obj) {
          this.queryModuleData[key]=obj[key]
        }
      }else {
        delete this.queryModuleData.isTmfileIdOrder
      }
     // this.$refs.caseListMultiple.clearFilter();
      const data = {
        business: this.business,
        pageNo: this.listQuery.pageNo,
        pageSize: this.listQuery.pageSize
      };
      for (var key in this.queryModuleData) {
        if (Object.prototype.toString.call(this.queryModuleData[key]).includes("Date")) {
          this.queryModuleData[key] = this.formatDate(this.queryModuleData[key]);
        }
        if(this.queryModuleData[key]===null){
          delete this.queryModuleData[key]
        }
      }
      const querData=Object.assign(data, this.queryModuleData)
      if(this.operationState){
        for (var key in querData) {
          if(!['business', 'pageNo', 'pageSize','shortcuts','isTmfileIdOrder'].includes(key)){
            if(!['officialInformScreen','djSubmitDateArray','materialCreateDateArray','myCase', 'regAndAgent','instructionSubmitStatus'].includes(key)){
              delete querData[key]
            }
          }
        }
      } else {
        for (var key in querData) {
          if(!['business', 'pageNo', 'pageSize','shortcuts','isTmfileIdOrder'].includes(key)){
            if(['officialInformScreen',  'myCase', 'instructionSubmitStatus'].includes(key)||![...this.conditionsModuleList.map(item=>item.property),...['agentNumStart', 'agentNumEnd', 'goodClasses', 'regNumber',  'tmName', 'custName', 'appCnName']].includes(key)){
              if(key=='officialInformScreen'){
                this.queryModuleData.officialInformScreen=100//'7'
              }
              if(key=='myCase'){
                this.queryModuleData.myCase=100//'1'
              }
              if(key=='instructionSubmitStatus'){
                this.queryModuleData.instructionSubmitStatus=100//0
               }
              delete querData[key]
            }
          }
        }
      }

      this.exportQueryModel=JSON.stringify(querData)
      if (this.bussId === 60) {
        querData.usAgency = 1
        querData.myCase = 1
      }
      this.getCaseList(querData).then(
        res => {
          (res.data || []).forEach(item=>{
            for(var key in item){
              if(!item[key]){
                item[key]=''
              }
            }
          })
          this.caseListDefault = JSON.parse(JSON.stringify(res.data))
          this.total = res.total;
          this.caseList = res.data
          this.currentId=''
          this.currentCaseId=''
          this.currentPageSize=this.caseList.length
          this.caseList.forEach((item,index) => {
            if (item.tmFileId) {
              item.insId = item.tmFileId;
            }
          });
          if(this.caseList.length){
              this.getFilterModel()
          }
          // this.brushRight()
        }
      );
    },
    getFilterModel(){
      this.$nextTick(()=>{
        let data =   this.$commonUtils.getFilterModel(this.$options.name+this.$route.name,'FilterModel')
        let arr =  Object.keys(data)
        let arrInstance=arr.map(item=>this.gridApi.getFilterInstance(item))
        arrInstance.forEach((item,index)=>{
          item && item.selectNothing && item.selectNothing()
          item && item.setModel && item.setModel(data[arr[index]])
          item && item.applyModel && item.applyModel()
        })
        this.gridApi.onFilterChanged()
        let sortData =   this.$commonUtils.getFilterModel(this.$options.name+this.$route.name,'SortModel')
        if(sortData&&sortData.length){
          this.gridApi.setSortModel(sortData)
          this.gridApi.onSortChanged()
        }
        if(this.gridApi.rowModel.rootNode.childrenAfterFilter.length){
          this.gridApi.rowModel.rootNode.childrenAfterFilter[0].setSelected(true)
        }

      })
    },
    brushRight(){

      let data = this.$commonUtils.getFilterModel(this.$options.name+this.$route.name,'FilterModel')
      let arr =  Object.keys(data)
      arr.forEach(item=>{
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
          this.filterText=''
          // if (!num) {
          //   this.queryCaseList();
          // }
          this.queryCaseList()
          this.getAllWfs(1);
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
          // if (!num) {
          //   this.queryCaseList();
          // }
          this.queryCaseList();
          this.getAllWfs(1);
        }
      });
    },
    filterDataChange() {
      // this.caseList=this.multiFilter(this.caseListDefault,this.filterData)
      let arr = JSON.parse(JSON.stringify(this.caseListDefault));
      const filterKeys = Object.keys(this.filterData);
      filterKeys.forEach(key => {
        if (this.filterData[key].length !== 0 && !key.includes("List")) {
          arr = arr.filter(itm => {
            var flag = false;
            this.filterData[key].forEach(item => {
              if (item === itm[key]) {
                flag = true;
              }
            });
            return flag;
          });
        }
      });
      this.caseList = arr;
    },
    checkAllOrNot(prop) {
      if (
        this.filterData[prop].length !== this.filterData[prop + "List"].length
      ) {
        this.filterData[prop] = [];
        this.filterData[prop + "List"].forEach(item => {
          this.filterData[prop].push(item);
        });
      } else {
        this.filterData[prop] = [];
      }
      this.filterDataChange();
    },
    handleCheckboxState() {
      this.checkboxState = !this.checkboxState;
      // if (this.checkboxState) {
      //   this.setWidth();
      // }
    },
    saveLocation(){
      if(!localStorage.getItem('tableHeader')){
        let arr=[]
        arr.push({name:this.$options.name+this.$route.name,tableHeader:this.tableHeader})
        localStorage.setItem('tableHeader',JSON.stringify(arr))
      }else {
        let arr=JSON.parse(localStorage.getItem('tableHeader'))
        if(arr.find(item=>item.name==this.$options.name+this.$route.name)) {
          arr.find(item => item.name==this.$options.name+this.$route.name).tableHeader = this.tableHeader
          localStorage.setItem('tableHeader',JSON.stringify(arr))
        } else {
          arr.push({name:this.$options.name+this.$route.name,tableHeader:this.tableHeader})
          localStorage.setItem('tableHeader',JSON.stringify(arr))
        }
      }
    },
    getPinned(label){
      if(!localStorage.getItem('tableHeader')){
        return ''
      } else {
        var arr = JSON.parse(localStorage.getItem('tableHeader'))
        if(arr.find(item => item.name == this.$options.name + this.$route.name)){
          var header = arr.find(item => item.name == this.$options.name + this.$route.name).tableHeader
          if(header.find(item => item.label == label)){
            return header.find(item => item.label == label).pinned
          } else {
            return ''
          }
        } else {
          return ''
        }
      }
    },
    getAllWfs(flag) {
      const data = {
        userId: this.userId,
        bussId: this.bussId
      };
      Promise.all([selectColumn(data), queryPreference(data)]).then(res => {
        this.selectColumnList = res[0].data;

        this.preferenceList = res[1].data;

        if (flag === 1) {
          this.preferenceList.forEach(col => {
            if (!this.columnDefs.find(item => item.field === col.value) && col.value !== 'sid') {
              this.columnDefs.push({
                headerName: col.title,
                field: col.value,
                pinned: this.getPinned(col.title),
                width: this.getLoactionWidth(col.title) == 'auto' ? 200 : this.getLoactionWidth(col.title),
                resizable: true,
                sortable: true,
                filter: ['gfCreateDate', 'reportEvidenceDate', 'certificationDate', 'certificationTime', 'reportEvidenceTime'].includes(col.value) ? DateFilter : 'agSetColumnFilter',
                cellRenderer: this.cellRenderer,
                menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
                enableRowGroup: true,
                filterParams: {
                  showTooltips: true,
                  defaultToNothingSelected: true,
                  newRowsAction: 'keep',
                  comparator: (a, b) => {
                    return this.$commonUtils.sort(a,b,col.value)
                  },
                }
              })
            }
          })
          const spliceFieId = []
          this.columnDefs.forEach(col => {
            if (!this.preferenceList.find(item => item.value === col.field) && col.field !== 'sid') {
              spliceFieId.push(col.field)
            }
          })
          spliceFieId.forEach(spFieId => {
            this.columnDefs.splice(this.columnDefs.findIndex(item => item.field === spFieId), 1)
          })
        } else {
          this.columnDefs = [...this.preferenceList.map(item => ({
            headerName: item.title,
            field: item.value,
            pinned: this.getPinned(item.title),
            width: this.getLoactionWidth(item.title) == 'auto' ? 200 : this.getLoactionWidth(item.title),
            resizable: true,
            sortable: true,
            filter: ['gfCreateDate', 'reportEvidenceDate', 'certificationDate', 'certificationTime', 'reportEvidenceTime'].includes(item.value) ? DateFilter : 'agSetColumnFilter',
            cellRenderer: this.cellRenderer,
            menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
            enableRowGroup: true,
            filterParams: {
              showTooltips: true,
              defaultToNothingSelected: true,
              newRowsAction: 'keep',
              comparator: (a, b) => {
                return this.$commonUtils.sort(a,b,item.value)
              },
            }
          }))]

          for (let i = 0; i < this.columnDefs.length; i++) {
            if (!this.columnDefs[i].pinned) {
              this.columnDefs.splice(i, 0, this.defaultcolumnDefs[0])
              break
            }
          }
        }
        this.columnDefs.forEach(item=>{
          if(item.field=='materialName'){
            item.comparator= (a,b) => {
              if (!a && !b) {
                return 0;
              }
              if (!a) {
                return -1;
              }
              if (!b) {
                return 1;
              }
              // if (!/^\d+$/.test(a.split(/[-_]/)[0])&&!/^\d+$/.test(b.split(/[-_]/)[0])){
              if (!/^\d+$/.test(this.regNum(a))&&!/^\d+$/.test(this.regNum(b))){
                return 0;
              }
              // if (!/^\d+$/.test(a.split(/[-_]/)[0])){
              if (!/^\d+$/.test(this.regNum(a))){
                return -1;
              }
              // if (!/^\d+$/.test(b.split(/[-_]/)[0])){
              if (!/^\d+$/.test(this.regNum(b))){
                return 1;
              }
              // return a.split(/[-_]/)[0] - b.split(/[-_]/)[0];
              return this.regNum(a) - this.regNum(b);
            }
          }else if(item.field=='goodClasses'){
            item.comparator=function (a,b) {
              if (!a && !b) {
                return 0;
              }
              if (!a) {
                return -1;
              }
              if (!b) {
                return 1;
              }
              if (!/^\d+$/.test(a.split(';')[0])&&!/^\d+$/.test(b.split(';')[0])){
                return 0;
              }
              if (!/^\d+$/.test(a.split(';')[0])){
                return -1;
              }
              if (!/^\d+$/.test(b.split(';')[0])){
                return 1;
              }

              return a.split(';')[0] - b.split(';')[0];
            }
          }else if(item.field=='regNumber'||item.field=='approvalNo') {
            item.comparator = function (a, b) {
              if (!a && !b) {
                return 0;
              }
              if (!a) {
                return -1;
              }
              if (!b) {
                return 1;
              }
              if (!a.match(/^\d+/)) {
                return 1;
              }
              if (!b.match(/^\d+/)) {
                return -1;
              }
              if (a.match(/^\d+/) && b.match(/^\d+/)) {
                return Number(a.match(/^\d+/)[0]) - Number(b.match(/^\d+/)[0])
              }
            }
          }
        })
        //表头全选、拖拽
        this.$nextTick(()=>{
          this.columnDefs.forEach(item=>{
            this.columnApi && this.columnApi.getColumn(item.field)&&this.columnApi.getColumn(item.field).addEventListener('menuVisibleChanged', ()=>{
              if(document.querySelector(".ag-tabs") && document.querySelector(".ag-set-filter-list")){
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
              let data =   this.$commonUtils.getFilterModel(this.$options.name+this.$route.name,'FilterModel')
              let arr =  Object.keys(data)
              if(this.columnDefs.map(itm => itm.field).diff(arr).includes(item.field)){
                this.gridApi.getFilterInstance(item.field).selectNothing()
              }
            });
          })

        })
        this.tableHeader=this.preferenceList.map(item=>({label:item.title, prop:item.value, pinned: this.getPinned(item.title), width: this.getLoactionWidth(item.title)}))
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
    regNum(str){
      return str.match(/^\d+[-_]/) ? str.match(/^\d+[-_]/)[0].replace(/[^\d]/g, '') : str.match(/[-_]\d+[-_]/) ? str.match(/[-_]\d+[-_]/)[0].replace(/[^\d]/g, '') : str
    },
    getLoactionWidth(label){
      if (label == '序号') return 70
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
    defaultQuerySearch(){
      this.queryModuleData = JSON.parse(localStorage.getItem('queryModuleData'))?JSON.parse(localStorage.getItem('queryModuleData')).find(item=>item.name==this.identification)?JSON.parse(localStorage.getItem('queryModuleData')).find(item=>item.name==this.identification).queryModuleData:{}:{}
      this.operationState= JSON.parse(localStorage.getItem('queryModuleData'))?JSON.parse(localStorage.getItem('queryModuleData')).find(item=>item.name==this.identification)?JSON.parse(localStorage.getItem('queryModuleData')).find(item=>item.name==this.identification).operationState:1:1
      if (this.$route.query.custId) {
        // this.$set(this.queryModuleData, "custId", Number(this.$route.query.custId));
        // console.log(456)
        this.$set(this.queryModuleData, "custIdArray", [Number(this.$route.query.custId)]);
        this.operationState=1
        //this.queryCaseList();
      }
      // if (this.$route.query.myCase) {
      //   this.$set(this.queryModuleData, "myCase", this.$route.query.myCase);
      //   // this.queryCaseList();
      // }
      if(this.pageTitle=='案件管理'){
        if(this.queryModuleData.myCase==1||!this.queryModuleData.myCase){
          this.$set(this.queryModuleData, "myCase", '2');
        }
        if (this.queryModuleData.custName) {
          const custName = this.queryModuleData.custName
          this.isDim = 1
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
      if(this.pageTitle=='官方通知'){
        if(!this.queryModuleData.officialInformScreen){
          this.$set(this.queryModuleData, "officialInformScreen", '1');
        }
      }
      if(this.pageTitle=='递交官方'){
        if(!this.queryModuleData.instructionSubmitStatus){
          this.$set(this.queryModuleData, "instructionSubmitStatus", 6);
        }
      }
    },
    queryFilterConfig(type) {
      this.defaultQuerySearch()

      const data = {
        bussId: this.bussId
      };
      this.conditionsModuleList=[]
      queryFilterConfig(data).then(res => {
        this.transferVisible = false;
        this.$nextTick(()=>{
          this.conditionsModuleList = res.data;
          if(type==1&&!this.$route.query.custId){
            this.queryCaseList()
          }
          let keyList=res.data.map(item=>item.property)
          for (var key in this.queryModuleData) {
            if(!keyList.includes(key)&&!this.queryModuleData[key]){
              if(key.includes('Date')){
                this.$set(this.queryModuleData,key,['',''])
              } else if(key.includes('Array')) {
                this.$set(this.queryModuleData,key,[])
              }else{
                this.$set(this.queryModuleData,key,null)
              }
            }
          }

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
            this.operationState=0
            this.clearSearch()
            this.$set(this.queryModuleData,'custIdArray',[Number(this.$route.query.custId)])
            this.queryCaseList()
          } else {
            res.data.forEach(item => {
              if (item.filterType.includes("Many")) {
                if(this.queryModuleData[item.property]){
                  if(item.filterType.includes('Many')){
                    console.log(item.filterName,'filterName!!!!');
                    if(["被申请人", "转让人"].includes(item.filterName)){
                      // queryAllUrl({ appId:this.queryModuleData[item.property]}).then(res=>{
                      //   this.$set(item,'valueList', res.data.map(i => ({
                      //     id: i.applicantName,
                      //     value: i.applicantName,
                      //     value1: i.applicantEnName,
                      //     value2: i.applicantAddress,
                      //     value3: i.applicantEnAddress
                      //   })))
                      // })
                    }else if(item.filterName=='申请人' ){
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
                    } else if(item.filterName=='客户'){
                      if(this.queryModuleData[item.property].length){
                        queryCustomerNameId({custIdArray: this.queryModuleData[item.property]}).then(res=>{
                          this.$set(item,'valueList', res.data.map(i => ({ id: i.custId, value:`${i.name}-${i.country?i.country:''}-${i.fullname}` })))
                        })
                      }
                    } else if(['账单联系人','客户联系人'].includes(item.filterName)){
                      queryCustContactAllUrl({custContactId: this.queryModuleData[item.property]}).then(res=>{
                        this.$set(item,'valueList',res.data.map(i => ({id:i.custContactId,value:i.name,value1:i.custName}) ))
                      })
                    } else if(['账单地址','信函地址'].includes(item.filterName)){
                      queryCustomerAddrAll({addrId: this.queryModuleData[item.property]}).then(res=>{
                        this.$set(item,'valueList',res.data.map(i => ({id:i.addrId,value:i.addressCn}) ))
                      })
                    } else if(['外方代理所'].includes(item.filterName)){
                      if (this.queryModuleData[item.property]&&this.queryModuleData[item.property].length) {
                        queryCollaborationAll({custIdArray: this.queryModuleData[item.property]}).then(res=>{
                          this.$set(item,'valueList',res.data.map(i => ({id:i.custId,value:i.fullname}) ))
                        })
                      }
                    } else {
                      item.valueList = item.values?item.values.filter(i=>i.id==this.queryModuleData[item.property]) : []
                    }
                    // if(item.property.includes('Array')){
                    //   //this.queryModuleData[item.property]=this.queryModuleData[item.property].map(itm=>Number(itm))
                    // }else {
                    //  // this.queryModuleData[item.property]=Number(this.queryModuleData[item.property])
                    // }
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
          }
        });
      })
    },
    async deleteList(){
      if (this.pageTitle === "递交官方") {
        this.willtableCaseIdList = [
          ...new Set(this.getSelectedSortRows().map(item => item.insId))
        ];
        let res = await checkPermission({
          insIdList: this.willtableCaseIdList
        });
        if(!res.data.delete){
          this.$message.error('无法批量删除所选递交指令！')
          return;
        }
      } else if (this.pageTitle === "官方通知") {
        // if(this.$store.getters.permissions.includes(201) || this.$store.getters.permissions.includes(202)){
        //     if(this.$store.getters.permissions.includes(201) && !this.$store.getters.permissions.includes(202)){
        //       if(this.getSelectedSortRows().find(item => item.auditStatus === 1)){
        //         this.$message.error('无法删除所选官方通知！')
        //         return;
        //       }
        //     }
        //     if(this.$store.getters.permissions.includes(202) && !this.$store.getters.permissions.includes(201)) {
        //       if(this.getSelectedSortRows().find(item => item.auditStatus === 0 || item.auditStatus === 2 || item.auditStatus === 3)){
        //         this.$message.error('无法删除所选官方通知！')
        //         return;
        //       }
        //     }
        //   }else{
        //     this.$message.error('无法删除所选官方通知！')
        //     return;
        //   }
      } else if (this.pageTitle === "案件管理") {
        // if(this.$store.getters.permissions.includes(205) || this.$store.getters.permissions.includes(206) || this.$store.getters.permissions.includes(250)){
        //   if(this.$store.getters.permissions.includes(205) && !this.$store.getters.permissions.includes(206)){
        //     if(this.getSelectedSortRows().find(item => item.isSubmitOfficial === 1)){
        //       this.$message.error('无法删除所选案件！')
        //       return;
        //     }
        //   }
        //   if(this.$store.getters.permissions.includes(206) && !this.$store.getters.permissions.includes(205)) {
        //     if(this.getSelectedSortRows().find(item => item.isSubmitOfficial === 0)){
        //       this.$message.error('无法删除所选案件！')
        //       return;
        //     }
        //   }
        // }else{
        //   this.$message.error('无法删除所选案件！')
        //   return;
        // }
      }
      const selectedNodes = this.gridApi.getSelectedNodes();
      const selectedData = selectedNodes.map(node => node.data);
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          if (this.pageTitle === "案件管理") {
            deleteCase({ caseIds: selectedData.map(item=>item[this.getCurFilterId(this.pageTitle)])})
              .then(res => {
                if (res.success) {
                  this.$message({
                    type: "success",
                    message: "删除成功!"
                  });
                  //    this.filterMulList(row)
                  this.queryCaseList()
                  //  this.queryCaseList();
                }
              })
              .catch(err => {
                this.$alert(`<p>${err.message}<p>`, "删除提示", {
                  dangerouslyUseHTMLString: true
                });
              });
          } else if (this.pageTitle === "官方通知") {
            deleteDoc({
              docList:selectedData.map(item=>({tmFileId:item.tmFileId}))
            }).then(res => {
              if (res.success) {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                this.queryCaseList()
              }
            });
          } else if (this.pageTitle === "递交官方") {
            deleteIns({ insIdList:selectedData.map(item=>item[this.getCurFilterId(this.pageTitle)])}).then(res => {
              if (res.success) {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                //    this.filterMulList(row)
                this.queryCaseList()
                //this.queryCaseList();
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
    scrollToIndex(index){
      this.$nextTick(()=>{
          var obj = document.getElementsByClassName('ag-body-viewport')[0]
          obj.scrollTop = this.scrollTop
          this.gridApi.rowModel.rootNode.allLeafChildren[index].setSelected(true)
      })
    },
    delCase(row) {
      this.scrollTop = document.getElementsByClassName('ag-body-viewport')[0].scrollTop
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          if (this.pageTitle === "案件管理") {
            deleteCase({ caseIds: row.caseId })
              .then(res => {
                if (res.success) {
                  this.$message({
                    type: "success",
                    message: "删除成功!"
                  });
               //    this.filterMulList(row)
               //    this.caseList.splice(this.caseList.indexOf(row),1)
                //  this.queryCaseList();
                  const index = this.caseList.indexOf(row)
                  this.caseList.splice(this.caseList.indexOf(row),1)
                  this.scrollToIndex(index)
                }
              })
              .catch(err => {
                this.$alert(`<p>${err.message}<p>`, "删除提示", {
                  dangerouslyUseHTMLString: true
                });
              });
          } else if (this.pageTitle === "官方通知") {
            deleteDoc({
              docList: [{ tmFileId: row.tmFileId }]
            }).then(res => {
              if (res.success) {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
             //   this.filterMulList(row)
                const index = this.caseList.indexOf(row)
                this.caseList.splice(this.caseList.indexOf(row),1)
                this.scrollToIndex(index)
                //this.queryCaseList();
                if(row.auditStatus==2||row.auditStatus==3){
                  this.getManualRecognitionOfficialInfoCount()
                }
              }
            });
          } else if (this.pageTitle === "递交官方") {
            deleteIns({ insIdList: row.insId }).then(res => {
              if (res.success) {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
            //    this.filterMulList(row)
            //     this.caseList.splice(this.caseList.indexOf(row),1)
                //this.queryCaseList();
                const index = this.caseList.indexOf(row)
                this.caseList.splice(this.caseList.indexOf(row),1)
                this.scrollToIndex(index)
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
      if (filterName === "被申请人") {
        return {
          id: "-1",
          value: "中文名称",
          value1: "英文名称",
          value2: "中文地址",
          value3: "英文地址"
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
      if (['账单联系人','客户联系人'].includes(filterName)) {
        return {
          id: "-1",
          value: "联系人名称",
          value1: "客户简称",
        };
      }
      if (['账单地址','信函地址'].includes(filterName)) {
        return {
          id: "-1",
          value: "地址",
        };
      }
      if (['外方代理所'].includes(filterName)) {
        return {
          id: "-1",
          value: "名称",
        };
      }
      return valueList0;
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
    filterHandler(value, row, column) {
      const property = column['property'];
      return row[property] === value;
    },
    getMinWidth(data, header, currentId){
     //  let arr=[...[String(data.label).replace(/[\u4E00-\u9FA5]/gi,'aa').length],...this.caseList.map(item => item[data.prop]).filter(item=>item).map(item=>String(item).replace(/[\u4E00-\u9FA5]/gi,'aa').length)]
       return String(data.label).replace(/[\u4E00-\u9FA5]/gi,'aa').length*12+30
    },
    getWidth(data, header, currentId){
      if(data.width!=='auto'){
        return data.width
      } else {
        return 'auto'
      }
    },
    getCellClassName({row, column, rowIndex, columnIndex}){
      if(column.label==='上报事项'){
        if(row['reportMatter']=='申请'){
          return 'blue'
        } else {
          return 'red'
        }
      } else if (column.label === '递交方式') {
        if (row['insSubmitType'] == '人工送达') {
          return 'blue'
        } else {
          return 'red'
        }
      } else if (column.label==='递交场所') {
        if (row['submitPlace'] == '国际处' || row['submitPlace'] == '海淀区工商局') {
          return 'blue'
        }
      } else if (column.label==='商标图样') {
         return 'imgWrap'
      }
    },
    checkEditFun(row){
      checkPermission({
        insIdList: [row.insId]
      }).then(res => {
        if(res.data.modify){
          this.editFun(row)
        }else{
          this.$message.error('该递交指令无法修改')
        }
      })
    },
    checkDelCase(row){
      checkPermission({
        insIdList: [row.insId]
      }).then(res => {
        if(res.data.delete){
          this.delCase(row)
        }else{
          this.$message.error('该递交指令无法删除')
        }
      })
    },
    updateZczStatus(zczStatus) {
      if (!this.getSelectedRows().length) {
        this.$message.error('请先选择！')
        return
      }
      if ([...new Set(this.getSelectedRows().filter(item => item.zczStatus).map(item => item.zczStatus))].length > 1) {
        this.$message.error('只能批量操作一种【注册证进展】的官文')
        return
      }
      updateZczStatus({
        insIdList: this.getSelectedRows().map(i=>i.insId),
        zczStatus
      }).then(res => {
        this.$message.success('操作成功!')
        this.queryCaseList()
      })
    },
    updateBcStatus() {
      this.updateZczStatus('已报出')
    },
    updateZlStatus() {
      this.updateZczStatus('不处理')
    },
    generateRejectReport(row) {
      const caseIds =  row.caseArray.map(i => i.caseId).join(',')
      createRejectionDoc({caseIds:caseIds}).then((res)=>{
        if (res.success) {
          this.$message.success(res.message || '操作成功!')
        }
      })
    },
    getRowContextmenuList(row){
      if(this.pageTitle==='官方通知'){
        return [
          { name:'复制', action: 'copy' },
          { name:'暂存', action: 'temporarStorageAll' },
          { name: '附件', action: 'pdfPre' },
          { name:'隐藏', action: 'hidden' },
          { name:'隐藏(批量)', action: 'hiddenAll' },
          { name: '修改', action: 'editFun', permissions:195, auditStatus: 0 },
          { name: '修改', action: 'editFun', permissions:200, auditStatus: 1 },
          { name: '修改', action: 'editFun', permissions:195, auditStatus: 2 },
          { name: '修改', action: 'editFun', permissions:195, auditStatus: 3 },
          { name: '删除', action: 'delCase', permissions:201, auditStatus: 0 },
          { name: '删除', action: 'delCase', permissions:202, auditStatus: 1 },
          { name: '删除', action: 'delCase', permissions:201, auditStatus: 2 },
          { name: '删除', action: 'delCase', permissions:201, auditStatus: 3 },
          { name: '已报出', action: 'updateBcStatus', permissions: 391, updateSign: '已报内外业务' },
          { name: '不处理', action: 'updateZlStatus', permissions: 392, updateSign: '待报证' },
          { name: '生成驳回报告', action: 'generateRejectReport',permissions:509, },
          ].filter(item => {
          if(item.permissions){
            if (item.auditStatus !== undefined) {
              return this.$store.getters.permissions.includes(item.permissions) && row.auditStatus == item.auditStatus
            } else if (item.updateSign) {
              return this.$store.getters.permissions.includes(item.permissions) && this.queryModuleData.officialInformScreen == 6 && this.getSelectedRows().find(i => i.zczStatus === item.updateSign)
            } else {
              return this.$store.getters.permissions.includes(item.permissions)
            }
          }else if( item.action == 'pdfPre'){
            return row.addressList && this.isOrNotPdfPre(row.addressList)
          } else if(item.action == 'generateRejectReport'){
            return row.gfTypeName === '驳回通知' || row.gfTypeName === '部分驳回通知'
          }else {
            return true
          }
        })
      }
      if(this.pageTitle==='递交官方'){
        return [
          { name:'复制',action: 'copy' },
          { name:'隐藏', action: 'hidden'},
          { name:'隐藏(批量)', action: 'hiddenAll'},
          { name: '修改', action: 'checkEditFun',permissions:194, auditStatus:0},
          { name: '修改', action: 'checkEditFun',permissions:197, auditStatus:1 },
          { name: '删除', action: 'checkDelCase',permissions:198, auditStatus:0},
          { name: '删除', action: 'checkDelCase',permissions:199, auditStatus:1 }].filter(item=>{
          if(item.permissions){
            return this.$store.getters.permissions.includes(item.permissions)&&row.auditStatus==item.auditStatus
          }else if(item.action=='pdfPre'){
            return row.addressList&&this.isOrNotPdfPre(row.addressList)
          }else {
            return true
          }
        })
      }
      if(this.pageTitle==='案件管理'){
        let hash = {}
        return this.rowContextmenuList.concat([
          { name:'复制',action: 'copy' },
          { name:'修改客户文号',action: 'editCustRefnoFunc' },
          { name: '修改', action: 'editFun',permissions:203, isSubmitOfficial:0,isCheck:true},
          { name: '修改', action: 'editFun',permissions:204, isSubmitOfficial:1 ,isCheck:true},
          { name: '删除', action: 'delCase',permissions:205, isSubmitOfficial:0},
          { name: '删除', action: 'delCase',permissions:206, isSubmitOfficial:1 },
          { name: '删除', action: 'delCase',permissions:250},
          { name:'复制立案',action: 'createCase',permissions:18},
          { name:'设置相关案件',action: 'setRelevant'},
          ...((row.caseTypeId === 40 && ['外-内','内-内','台-内'].includes(row.appFromto) && this.$store.getters.permissions.includes(511)) ? [{ name:'生成驳回复审理由',action: 'rejectionReview'}] : [])
          ]).filter(item=>{
            if(row.agentNum.slice(0,2) === 'NO' && row.createUserId == this.userId){
              return true
            }
          if(item.permissions){
            if(item.permissions==18 || item.permissions==250){
              return  this.$store.getters.permissions.includes(item.permissions)
            }
            else if(item.isCheck){
              return this.$store.getters.permissions.includes(item.permissions)&&row.isSubmitOfficial==item.isSubmitOfficial&&row.isCheck==item.isCheck
            } else {
              return this.$store.getters.permissions.includes(item.permissions)&&row.isSubmitOfficial==item.isSubmitOfficial
            }
          }else if(item.action=='pdfPre'){
            return row.addressList&&this.isOrNotPdfPre(row.addressList)
          }else {
            return true
          }
        }).reduce((preVal, curVal) => {
            hash[curVal.action] ? '' : hash[curVal.action] = true && preVal.push(curVal);
            return preVal
        }, [])
      }
    },
    submitCustRefno(){
      for (let key in this.editCustRefnoInfo) {
        if (!['caseId', 'custRefno', 'remarks'].includes(key)) {
          delete this.editCustRefnoInfo[key]
        }
      }
      updateCaseCustInfo({ tmCaseList: [this.editCustRefnoInfo] }).then(res => {
        this.$message.success(res.message || '修改成功！');
        this.editCustRefnoView = false
        this.caseList.forEach(item => {
          if (item.caseId == this.editCustRefnoInfo.caseId) {
            this.$set(item, 'custRefno', this.editCustRefnoInfo.custRefno)
            this.$set(item, 'remarks', this.editCustRefnoInfo.remarks)
            this.gridApi.refreshCells()
          }
        })
      });
    },
    editCustRefnoFunc(row){
      this.editCustRefnoView = true
      this.editCustRefnoInfo = JSON.parse(JSON.stringify(row))
    },
    setRelevant(row){
      this.relCaseId = row.caseId
      this.relevantView = true
    },
    async rejectionReview(row){
      this.rejectionDialogVisible = true
      this.currentRejectionRow = row
      this.rejectionOption = 1 // 默认选择"是"
      // 清空之前的数据
      this.resetRejectionForm()
      // 查询商标申请类型列表
      await this.queryTmStatusListData()
    },
    async queryTmStatusListData() {
      // 查询商标申请类型列表
      try {
        const res = await queryTmStatusList({
          tokenID: this.$store.state.user.token
        })
        if (res.success && res.data) {
          this.tmStatusList = res.data
        }
      } catch (error) {
        console.error('查询商标申请类型列表失败:', error)
      }
    },
    async generateRejectionReason(row, selectedValue) {
      const params = {
        caseId: row.caseId,
        needSuspension: selectedValue,
        similarPrompt: this.similarPrompt || undefined, // 商标区别描述
        custSuspensionReasonList: this.rejectionOption === 1 && this.custSuspensionReasonList.length > 0
          ? this.custSuspensionReasonList
          : undefined
      }
      const res = await createReexaminationReasonDoc(params)
      if (res.success) {
        res.message && this.$message.success(res.message)
      }
      return res
    },
    async saveApplicantInfoData() {
      // 保存申请人信息
      const params = {
        tokenID: this.$store.state.user.token,
        companyName: this.applicantInfo.companyName,
        url: this.applicantInfo.url,
        description: this.applicantInfo.description,
        agentNum: this.applicantInfo.agentNum
      }

      try {
        const res = await saveApplicantInfo(params)
        if (res.success) {
          this.$message.success(res.message || '申请人信息保存成功')
        } else {
          this.$message.error(res.message || '申请人信息保存失败')
        }
        return res
      } catch (error) {
        console.error('保存申请人信息失败:', error)
        this.$message.error('保存申请人信息失败，请重试')
        throw error
      }
    },
    resetRejectionForm() {
      // 重置表单数据
      this.similarPrompt = ''
      this.custSuspensionReasonList = []
      this.showApplicantInfo = false
      this.applicantInfo = {
        companyName: '',
        url: '',
        description: '',
        agentNum: ''
      }
    },
    addSuspensionReason() {
      // 添加中止原因
      this.custSuspensionReasonList.push({
        regNumber: '',
        tmStatus: ''
      })
    },
    deleteSuspensionReason(index) {
      // 删除中止原因
      this.custSuspensionReasonList.splice(index, 1)
    },
    async handleRejectionConfirm() {
      // 处理驳回复审对话框确定按钮
      try {
        // 1. 生成驳回复审理由
        await this.generateRejectionReason(this.currentRejectionRow, this.rejectionOption)

        // 2. 如果显示了申请人信息且填写了数据，则保存申请人信息
        if (this.applicantInfo.url || this.applicantInfo.description || this.applicantInfo.agentNum) {
          await this.saveApplicantInfoData()
        }

        this.rejectionDialogVisible = false
        this.currentRejectionRow = null
        // 清空表单
        this.resetRejectionForm()
      } catch (error) {
        console.error('操作失败:', error)
      }
    },
    handleRejectionCancel() {
      // 处理驳回复审对话框取消按钮
      this.rejectionDialogVisible = false
      this.currentRejectionRow = null
      // 清空表单
      this.resetRejectionForm()
    },
    hidden(row){
      this.caseList=this.caseList.filter(item=>item[this.getCurFilterId(this.pageTitle)]!=row[this.getCurFilterId(this.pageTitle)])
      // this.caseList.splice(this.caseList.indexOf(row),1)
      this.currentPageSize-=1
    },
    hiddenAll(){
      let list=this.gridApi.getSelectedRows()
      this.caseList=this.caseList.filter(item=>!list.includes(item))
      this.$nextTick(()=>{
        this.currentPageSize = this.gridApi.rowModel.rootNode.allChildrenCount
      })
    },
    isOrNotPdfPre(list){
       return  list.filter(itm=>['pdf','jpg','png'].some(item=>itm.replace(/.+\./,"").toLocaleLowerCase()==item)).length!==0;
    },
    // rowContextmenu(row, column, event) {
    //   const that=this
    //   this.$ContextMenu({
    //     event, // 传入鼠标事件
    //     menu:this.getRowContextmenuList(row)
    //   }).then(rs => {
    //     if(rs){
    //       this[rs](row, column, event);
    //     }
    //   });
    // },
    createCase(row){
      copyCase({caseId:row.caseId}).then(res=>{
        this.$message({
          message: '立案成功',
          type: 'success'
        });
        this.queryCaseList()
        // this.
      })
    },
    relevant(row, column, event) {
      queryCorrelationCaseList({caseId:row.caseId}).then(res=>{
        res.data.forEach(item=>{
          this.$store.commit('tabs/CHANGE_STORAGETABLE',{type:'push',title:'相关案件',name:'相关案件',identification:this.identification,data:item})
        })
       this.$refs.myTabs.tabClick({name: '相关案件'}, true)

        // if(this.pageTitle==='案件管理'){
        //   res.data.forEach(item=>{
        //     if(this.ajglTabList.find(item=>item.title=='相关案件')){
        //       this.$store.commit('tabs/CHANGE_AJGLTABLIST',{type:'push',data:{title:'相关案件',name:'相关案件',data:item}})
        //     }else {
        //       this.$store.commit('tabs/CHANGE_AJGLTABLIST',{type:'pushItem',data:{title:'相关案件',name:'相关案件',list:[item]}})
        //     }
        //   })
        // }
      })
    },
    temporarStorage(row, column, event, flag) {
      let title = ''
      if(this.pageTitle==='官方通知'){
        title = '暂存官文(商标)'
      }else if(this.pageTitle==='案件管理'){
        title = '暂存案件(商标)'
      }
      this.$store.commit('tabs/CHANGE_STORAGETABLE',{type:'push',title:title,name:title,identification:this.identification,data:row})
      !flag && this.$refs.myTabs.tabClick({name: title}, true)
// return
//       if(this.pageTitle==='案件管理'){
//         if(this.ajglTabList.find(item=>item.title=='暂存案件')){
//           this.$store.commit('tabs/CHANGE_AJGLTABLIST',{type:'push',data:{title:'暂存案件',name:'暂存案件',data:row}})
//         }else {
//           this.$store.commit('tabs/CHANGE_AJGLTABLIST',{type:'pushItem',data:{title:'暂存案件',name:'暂存案件',list:[row]}})
//         }
//       }
    },
    temporarStorageAll(){
      let title = ''
      if(this.pageTitle==='官方通知'){
        title = '暂存官文(商标)'
      }else if(this.pageTitle==='案件管理'){
        title = '暂存案件(商标)'
      }
      let list = this.gridApi.getSelectedRows()
      list.forEach(item => {
        this.temporarStorage(item, '', '',true)
      })
      this.$refs.myTabs.tabClick({name: title}, true)
      // if(this.pageTitle==='案件管理'){
      //   if(this.ajglTabList.find(item=>item.title=='暂存案件')){
      //
      //     this.$store.commit('tabs/CHANGE_AJGLTABLIST',{type:'push',data:{title:'暂存案件',name:'暂存案件',data:row}})
      //   } else {
      //     this.$store.commit('tabs/CHANGE_AJGLTABLIST',{type:'pushItem',data:{title:'暂存案件',name:'暂存案件',list:[row]}})
      //   }
      // }
    },
    abnormal(row, column, event) {
      if(this.pageTitle==='案件管理'){
        if(this.ajglTabList.find(item=>item.title=='异常案件')){
          this.$store.commit('tabs/CHANGE_AJGLTABLIST',{type:'push',data:{title:'异常案件',name:'异常案件',data:row}})
        }else {
          this.$store.commit('tabs/CHANGE_AJGLTABLIST',{type:'pushItem',data:{title:'异常案件',name:'异常案件',list:[row]}})
        }
      }
    },
    copy(row, value) {
      if(value){
        this.$copyText(value).then(
          res => {
          })
      }
    },
    updateWkg(){
      const data = this.$refs.CaseInvestigators.caseDetailFoemData
      delete data.actualAttorney
      updateWkg(Object.assign( data,{caseIds:this.getSelectedRows().map(item=>item.caseId)})).then(res=>{
        this.queryCaseList()
        this.updateWkgState=false
      })
    },
    changeKeepAlive(){
      if(this.$store.state.caseInformation.preOnlyId){
        this.getCaseList({[`${this.getCurFilterId(this.pageTitle)}`]: this.$store.state.caseInformation.preOnlyId ,business:this.business}).then(res => {
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
            this.$nextTick(()=>{
              if(index != -1){
                //滚动
                //部分浏览器不兼容
                // this.gridApi.ensureIndexVisible(index, 'middle');
                var obj = document.getElementsByClassName('ag-body-viewport')[0]
                obj.scrollTop = this.scrollTop
                // this.gridApi.deselectAll()
                //选中
                this.gridApi.rowModel.rootNode.allLeafChildren[index].setSelected(true)
                // this.$forceUpdate()
              }
            })
          }
        })
      }
    },
    undateSearch(n){
      if(this.bussId==n.bussId){
        this.queryModuleData=JSON.parse(n.value)
        this.handleSearch(0)
        this.queryFilterConfig()
      }

    }
  },
  computed: {
    ...mapGetters(["userId"]),
    ...mapState({
      'pattern' : state => state.user.pattern,
      'ajglTabList' : state => state.tabs.ajglTabList,
      'djgfTabList' : state => state.tabs.djgfTabList,
      'gftzTabList' : state => state.tabs.gftzTabList,

    }),
    deepCloneData(){
        return this.$wUtil.deepClone3(this.columnDefs)
      },
    clientHeight(){
      return document.documentElement.clientHeight-250
    },
    cssVar(){
      return {
        '--height': document.documentElement.clientHeight-300 + 'px'
      }
    },
    searchState(){
      let arr=[...this.conditionsModuleList.map(item=>item.property),...['agentNumStart', 'agentNumEnd', 'goodClasses', 'regNumber',  'tmName', 'custName']]
      for (var key in this.queryModuleData) {
        if(arr.includes(key)){
          if( this.$commonUtils.hasValue(this.queryModuleData,key)){
            return   true
          }
        }
      }
        return false
    }
    // clearWrapTop(){
    //   if(document.getElementById('searchWrap')){
    //     return document.getElementById('searchWrap').scrollTop+document.getElementById('searchWrap').offsetHeight
    //   }
    //
    // }
  },
  watch: {
    isDim(n, o){
      this.$set(this.queryModuleData, 'custIdArray', [])
      this.$set(this.queryModuleData, 'custName', undefined)
    },
    isAppDim(n, o){
      this.$set(this.queryModuleData, 'appCnNameArray', [])
      this.$set(this.queryModuleData, 'appCnName', undefined)
    },
    timeLimitState(n,o){
      if(!n){
        let allData = this.$refs['timeLimit']._data
          for(var key in allData){
            allData[key] = ''
          }
      }
    },
    $route: {
      handler: function(val, oldVal){
        this.$nextTick(()=>{
          this.rightDrag()
        })
      },
      immediate: true
    },
    pattern:{
      handler(n,o){
        if(n){
          this.$store.commit('app/TOGGLE_SIDEBAR',false)

        } else {
         // this.$store.commit('app/TOGGLE_SIDEBAR',true)
        }
      },
      immediate:true
    },
    checkboxState(n){
      if(n){
        this.$nextTick(()=>{
          this.$refs.checkCaseSelect.focus()
        })
      }
    },
    timeLimitState(n){
      if(!n){
        const caseId = this.currentCaseId
        this.currentCaseId=''
        this.$nextTick(()=>{
          this.currentCaseId = caseId
        })
      }
    },
    drawerState(n){
      // if(n){
      //   this.$nextTick(()=>{
      //      document.getElementById('clearWrap').style.top =document.getElementById('searchWrap').scrollTop+ document.getElementById('searchWrap').offsetHeight - 40 + 'px'
      //   })
      // }
    },
    transferVisible(n){
      // if(!n){
      //   setTimeout(()=>{
      //     this.$nextTick(()=>{
      //       let searchWrap= document.getElementById('searchWrap')
      //       this.clearWrapTop = searchWrap.scrollTop+ searchWrap.offsetHeight
      //       document.getElementById('clearWrap').style.top=this.clearWrapTop -40 + 'px'
      //     })
      //   },0)
      // }
    },
    // tableHeader(n){
    //   this.tableHeaderLabelList=n.map(item=>item.label)
    // },
    // tableHeaderLabelList(n,o){
    //   if(o.length){
    //     if(localStorage.getItem('tableHeader')){
    //       let header=JSON.parse(localStorage.getItem('tableHeader')).find(item=>item.name==this.$options.name+this.$route.name+this.field).tableHeader
    //       this.tableHeader.forEach(item=>{
    //         header.forEach(itm=>{
    //           if(itm.label==item.label){
    //             this.$set(item,'width',itm.width)
    //           }
    //         })
    //       })
    //     }
    //     this.changeHeader(this.tableHeader)
    //   }
    // },
    selectionState(n){
      // if(n){
      //   if(this.multipleTypeText!='官方通知'&&this.multipleTypeText!='递交官方(文件)'){
      //     this.gridApi.deselectAll()
      //   }
      // }
       // this.changeSelection(n)
    },
    dialogVisible(n) {
      if (!n) {
        if(this.pageTitle=='案件管理'){
         // this.queryModuleData.shortcuts = 1;
        //  this.$refs.caseListMultiple.newTableStore.states.selection = [];
          this.selectionState = false
         // this.queryCaseList();
        //  delete this.queryModuleData.shortcuts;
        }else {

          this.changeKeepAlive()
        }
      }
    },
  },
  activated() {
    browserBehavior()
    if(this.gridApi){
      const selectedNodes = this.gridApi.getSelectedNodes();
      const selectedData = selectedNodes.map(node => node.data);
      this.currentCaseId = selectedData[0].caseId || ''
    }
    if(this.initFlag){
      this.init()
      if(document.querySelector('.ag-body-viewport')){
        document.querySelector('.ag-body-viewport').scrollTop=this.scrollTopY
      }
    }
    this.initFlag=true
  },
  deactivated() {
    this.currentCaseId = ''
  },
  components: {
    CaseSurplus,
    TrademarkWritingDetail,
    PriceGrid,
    RelevantDialog,
    OfficialDocuments,
    SetHolidays,
    Pagination,
    ManualIdentification,
    PdfPreview,
    Willtable,
    FilterSelect,
    BulkUploadFile,
    exportFile,
    SelectOption,
    seeCaseDetail,
    MyTabs,
    ViewsSwitching,
    limitElectronicDocument,
    createTimeLimit,
    officialSubmission,
    CaseInvestigators,
    UploadProofreading,
    FileDownLoadDialog,
    VueWilltable
    // AgGridVue
  }
};
</script>

<style lang="scss" scoped>
  @import "~@/styles/icons/font_2251928_asl9bha01s.css";


  .topBox {
    background-color: #F2F2F2;
    padding-left: 20px;
    display: flex;
    height: 40px;
    /*justify-content: center;*/
    align-items: center;

    .iconfont {
      margin-right: 10px;
    }
  }

  .content {
    border: 1px solid #D7D7D7;
    margin-top: 10px;
    padding: 5px;
  }
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
      /*width: 330px;*/
      display: flex;
      flex: 1;
      /*height: 28px;*/
      align-items: center;
      .el-select {
        width: 100%;
      }
      .el-input {
        width: 100%;
      }
      .el-autocomplete{
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
  top: 34px;
  /*width: 222px;*/
  height: 330px;
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
.brush_right{
  position: absolute;
  right: 6px;
  z-index: 1;
  top: -4px;
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
.el-table /deep/ td .cell {
  height: 40px;
}
.el-table /deep/ th .cell {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  position: relative;
  padding-left:10px ;
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
.el-table /deep/ th div{
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
    min-width: 100px;
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
  .FilterSelectWrap{
    display: flex;
    flex-wrap: wrap;
    .filterSelect{
      width: 232px;
      margin-right: 30px;
      margin-bottom: 10px;
    }
  }
  .selectButton{
    position: absolute;
    right: 12px;
    top: 28px;
  }
  .myeltable{
    /deep/ .cell{
      overflow:hidden;
     white-space: nowrap;
      text-overflow: clip;
    }
  }

.divdiver{
  position: relative;
  left: 30px;
  height: 1px;
  width: 83%;
  background: #EEF2FB;
  margin-bottom: 10px;
}
 /deep/ .selectRow{
    background: #C9C8D0;



  }
/deep/ .gray{
  background: #E4E2E2;
}
  /deep/ .pagination-container{
    padding: 0;
  }
  .content_wrap{
    width: 100%;
    display: flex;
    .left_wrap{
      position: relative;
      transition:all 0.5s;
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
.w-table  {
  position: relative;
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* 没有前缀，目前支持Opera和谷歌浏览器 */
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
      z-index: 99;
      top: 0;
      background: none;
      border: none;
      box-sizing: border-box;
    }
    .thead-cell {
      vertical-align: middle !important;
      padding: 0;
      display: inline-flex;
      flex-direction: column;
      align-items: left;
      cursor: pointer;
      overflow: visible;
      /*&:before {*/
      /*content: "";*/
      /*position: absolute;*/
      /*top: 0;*/
      /*left: 0;*/
      /*bottom: 0;*/
      /*right: 0;*/
      /*}*/
    }
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
.right_wrap{

  /deep/.el-collapse-item{
    border-bottom: 1px solid #303133;
  }
}
/deep/ .moveIng{
  .virtual {
    border: 2px dotted #666 !important;
  }
}
/deep/  .darg_active_left {
  .virtual {
    border-left: 2px dotted #666 !important;
  }
}

/deep/  .darg_active_right {
  .virtual {
    border-right: 2px dotted #666 !important;
  }
}
  .DataPicker /deep/ {
    .el-input__prefix{
      display: none;
    }
    .el-input__inner{
      text-align: left;
      padding-left: 15px;
      padding-right: 18px;
     // padding-left: 10px;
    }
  }
  .djSubmitDateArray{
    width: 490px;
    margin-bottom: 0;
    /deep/ .el-form-item__label{
      line-height: 40px!important;
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
  /*    position: absolute;*/
  /*    background: #ffffff;*/
  /*    border: 1px solid #d4d5d5;*/
  /*    z-index: 1;*/
  /*    overflow: auto;*/
  /*    padding: 20px 0;*/
  /*    box-shadow: 0 3px 6px rgba(111,111,111,0.2);*/
  /*    /deep/  .el-form{*/
  /*      padding-bottom: 10px;*/
  /*      .el-form-item__label{*/
  /*        text-align: left;*/
  /*        padding-left: 32px;*/
  /*        font-weight: normal;*/
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
  .searchRight{
    margin-left: 0;
    height: 32px;
    border-top-right-radius:3px !important;
    border-bottom-right-radius:3px !important;
    padding: 0 5px
  }
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
.file-down {
  >>>.el-dialog__body {
    padding-bottom: 50px;
    padding-top: 20px;
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
.ViewsSwitching{
  position: absolute !important;
  right: 0;
  z-index: 100;
  top: 5px;
}

  .MyTabs{
    width: 100%;
    position: absolute;

    /deep/ .el-tabs{
      .el-tabs__header{
        margin: 0;
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
  .queryButton{
     z-index:7
  }
.cube{
  -webkit-transform: translateZ(0);
  -moz-transform: translateZ(0);
  -ms-transform: translateZ(0);
  -o-transform: translateZ(0);
  transform: translateZ(0);
  /* Other transform properties here */
}
/deep/ .imgWrap{
     .cell{
      width: 100%;
      height: 30px;
    }
  }
.noTrigger /deep/.el-table__column-filter-trigger{
  display: none;
}
  /deep/ .filterTableTmg {
    height: 100%;
    /*width: 100%;*/
    /*height: 30px;*/
  }
  /*/deep/ .ag-theme-balham .ag-row-selected {*/
  /*  background-color: #b7e4ff !important;*/
  /*}*/
  .pdfDialog  /deep/{
    z-index: 3000;
    .el-dialog{
      z-index: 3000;
      height: 100vh;
      display: flex;
      flex-direction: column;
      .el-dialog__body{
        flex: 1;
        .swiper-container{
          height: 100%;
          .swiper-button-prev-son{
            cursor: pointer;
            position: absolute;
            top: 10px;
            left: 50%;
            z-index: 10000;
            transform: translateX(-50%);
            text-align: center;
            font-size: 50px;
          }
          .swiper-button-next-son{
            cursor: pointer;
            position: absolute;
            bottom:  10px;
            left: 50%;
            z-index: 10000;
            transform: translateX(-50%);
            text-align: center;
            font-size: 50px;
          }
        }
      }
    }
    .iframe{
      width: 100%;
      height: 100%;
    }
  }
.button_grey{
  background: grey;
  border-color: grey;
}
.progressWrap{
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(0,0,0,0.6);
  z-index: 200;
  .el-progress{
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    /deep/ .el-progress__text{
      color: #fff;
    }
    /deep/ path{
      fill: none !important;
    }
  }
}
/deep/ .name_wrap{
  display: flex;
  .name{
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    border-right:1px solid #2b2f3a;
    border-bottom:1px solid #2b2f3a;
  }
  .name0{
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    /*text-overflow: ellipsis;*/
    border-right:1px solid #2b2f3a;
    border-bottom:1px solid #2b2f3a;
  }
}
/deep/.firstName_wrap{
  cursor: not-allowed;
  background: #c9c9c9;
}
>>>.el-tabs__content{
  height: var(--height)!important;
  overflow: auto!important;
}
  .form-container1 {
    display: block!important;
    .el-form-item__error {
      position: relative !important;
      top: 0;
    }

    /deep/ .el-row {
      margin: 0px;
      display: flex; /*解决账单查看表单样式被撑开*/
      flex: 1;
    }

    /deep/ .postInfo-container-item {
      height: 100%;
      width: 100%;
    }

    /deep/ .el-form-item__label {
      background-color: #f9f9f9;
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
  .abow_dialog {
    > > > .el-dialog {
      position: absolute;
      top: 50%;
      left: 50%;
      margin: 0 !important;
      transform: translate(-50%, -50%);
      height: calc(100% - 100px);
      max-width: calc(100% - 30px);
      display: flex;
      flex-direction: column;
    }

    > > > .el-dialog__body {
      overflow: auto;
    }
  }
  .abow_dialog11 {
    > > > .el-dialog {
      margin-left: calc(10%)!important;
      margin-right: calc(10%)!important;
      margin-top: 30px!important;
      height: calc(100% - 100px);
      max-width: calc(100% - 30px);
    }

    > > > .el-dialog__body {
      overflow: auto;
    }
  }
  .writingDialog {
    >>>.el-dialog {
      height: 85vh !important;
    }
  }
  >>>.pt0 {
    .el-dialog__body {
      padding-top: 0;
    }
  }

  /* 驳回复审对话框样式 */
  .rejection-dialog {
    .el-dialog__body {
      padding: 0 !important;
      height: 500px !important;
      overflow: hidden !important;
    }

    .rejection-content {
      height: 100%;
      padding: 0;
      overflow-y: auto;

      /* 自定义滚动条 */
      &::-webkit-scrollbar {
        width: 6px;
      }

      &::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 3px;
      }

      &::-webkit-scrollbar-thumb {
        background: #c1c1c1;
        border-radius: 3px;

        &:hover {
          background: #a8a8a8;
        }
      }

      .field-group {
        margin-bottom: 20px;

        .field-label {
          font-size: 14px;
          font-weight: 500;
          color: #303133;
          margin-bottom: 8px;
        }
      }

      .reason-item {
        margin-bottom: 12px;
        padding: 12px;
        background: #f5f7fa;
        border-radius: 4px;

        .reason-fields {
          display: flex;
          align-items: center;
          gap: 12px;

          .field-inline {
            display: flex;
            align-items: center;
            gap: 8px;

            .field-label-inline {
              font-size: 13px;
              color: #606266;
              white-space: nowrap;
            }

            .el-input,
            .el-select {
              flex: 1;
            }

            // 引证商标号字段固定宽度210px（缩小10px）
            &:first-child {
              flex: 0 0 210px;
            }

            // 申请类型字段自动填充剩余空间（更宽）
            &:nth-child(2) {
              flex: 1;
            }
          }
        }
      }
    }
  }

</style>

<style>
  .fillwidth-text{
    display: inline-block;
    width: 100%;
  }
</style>
