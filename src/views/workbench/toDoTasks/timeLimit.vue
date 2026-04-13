<template>
  <div :style="{'padding':caseDetail?'0':'20px'}" @mousedown="mousedown">
    <template v-if="!caseDetail">
      <ViewsSwitching class="ViewsSwitching" @changePattern="changePattern"></ViewsSwitching>
      <div class="buttonWrap" style="margin-bottom: 10px">
        <el-button-group class="button-group-search"  v-clickoutside="clickoutside">
          <el-button id="mySearch" type="primary" size="mini" @click="handleSearch">搜索</el-button>
          <el-button type="primary" class="searchRight"   size="mini" icon="el-icon-arrow-down" @click.stop.prevent="drawerState=true"></el-button>
          <transition name="show" mode="out-in">
            <div class="searchWrap"  v-show="drawerState">
              <div  style="width: 550px;
    max-height: 500px;overflow: auto">
                <el-form label-width="120px"  size="mini" class="form-container" @keyup.enter.native="handleSearch" >
                  <el-form-item label="案件文号:" >
                    <el-input v-model="queryModuleData.agentNumStart " placeholder="请输入内容" @change="changeTextRange" clearable></el-input>
                    <span>至</span>
                    <el-input v-model="queryModuleData.agentNumEnd" placeholder="请输入内容" clearable></el-input>
                  </el-form-item>
                  <el-form-item label="时限种类:">
                    <el-select v-model="queryModuleData.kind" placeholder="请选择时限种类" filterable
                               clearable >
                      <el-option
                        v-for="item in [{id:1,value:'官方时限'},{id:2,value:'内部时限'}]"
                        :key="item.id"
                        :label="item.value"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="案件名称:">
                    <el-input v-model="queryModuleData.caseName " placeholder="请输入案件名称" clearable></el-input>
                  </el-form-item>
                  <el-form-item label="权利号:">
                    <el-input v-model="queryModuleData.droitNumber " placeholder="请输入权利号" clearable></el-input>
                  </el-form-item>
                  <el-form-item label="时限类型:" >
                    <el-select v-model="tltTypeIdList" multiple placeholder="请选择时限类型" filterable
                               clearable >
                      <el-option
                        v-for="item in getTimelimitTypeAllList"
                        :key="item.tltTypeId"
                        :label="item.typeName"
                        :value="item.tltTypeId">
                      </el-option>
                    </el-select>
                  </el-form-item>

                  <el-form-item label="客户:">
  <!--                  <el-select  multiple v-model="queryModuleData['custIds']" filterable remote clearable  placeholder="请输入关键词" :remote-method="(queryString)=>{-->
  <!--            remoteMethod(queryString,'custIds','客户'); }">-->
  <!--                    <el-option disabled label="" value="-1">-->
  <!--            <span v-for="(itmx,key) in getAppTitleList('客户')" v-if="key!='id'">-->
  <!--            {{itmx}}-->
  <!--            </span>-->
  <!--                    </el-option>-->
  <!--                    <el-option v-for="(itm,idx) in customerNameIdList" :key="idx" :label="itm.value" :value="itm.id">-->
  <!--                      <el-tooltip v-for="(itmx,key) in customerNameIdList[idx]" v-if="key!='id'" :key="key" class="item" effect="light" :content="itmx" placement="top">-->
  <!--                        <span>{{itmx}}</span>-->
  <!--                      </el-tooltip>-->
  <!--                    </el-option>-->
  <!--                  </el-select>-->
                    <el-select
                      v-model="queryModuleData['custIds']"
                      ref="custSelect"
                      filterable
                      clearable
                      multiple
                      remote
                      reserve-keyword
                      placeholder="请输入客户姓名"
                      :remote-method="queryCustomerList">
                      <el-option
                        v-for="item in customerNameIdList"
                        :key="item.custId"
                        :label="item.fullname"
                        :value="item.custId"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="申请人:">
  <!--                  <el-select  v-model="queryModuleData['appIds']" multiple filterable remote clearable  placeholder="请输入关键词" :remote-method="(queryString)=>{-->
  <!--            remoteMethod(queryString,'appIds','申请人'); }">-->
  <!--                    <el-option disabled label="" value="">-->
  <!--            <span v-for="(itmx,key) in getAppTitleList('申请人')" v-if="key!='id'" :key="key">-->
  <!--            {{itmx}}-->
  <!--            </span>-->
  <!--                    </el-option>-->
  <!--                    <el-option v-for="(itm,idx) in appInfoList" :key="itm.id+idx" :label="itm.value" :value="itm.id">-->
  <!--                      <el-tooltip v-for="(itmx,key) in appInfoList[idx]" v-if="key!='id'" :key="itmx+key" class="item" effect="light" :content="itmx" placement="top">-->
  <!--                        <span>{{itmx}}</span>-->
  <!--                      </el-tooltip>-->
  <!--                    </el-option>-->
  <!--                  </el-select>-->
                    <el-select
                      v-model="queryModuleData['appIdList']"
                      ref="custSelect"
                      filterable
                      clearable
                      multiple
                      remote
                      reserve-keyword
                      placeholder="请输入申请人姓名"
                      :remote-method="queryAllUrl">
                      <el-option
                        v-for="item in appInfoList"
                        :key="item.appId"
                        :label="item.applicantName"
                        :value="item.appId"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>

                  <el-form-item label="部门/客户组:" >
                    <el-multi-cascader
                      ref="multiCascader"
                      :show-all-levels="false"
                      :options="deptGroupList"
                      multiple
                      filterable
                      clearable
                      change-on-select
                      selectChildren
                      v-model="queryModuleData.deptGroupIds"> </el-multi-cascader>
                  </el-form-item>
                  <el-form-item label="案件类型:" >
                  <el-multi-cascader
                    ref="multiCascader"
                    :show-all-levels="false"
                    :options="$store.state.caseInformation.caseTypeList"
                    multiple
                    filterable
                    clearable
                    :props="defaultParams"

                    change-on-select
                    selectChildren
                    v-model="queryModuleData.caseTypeIds"> </el-multi-cascader>
                  </el-form-item>
                  <el-form-item label="申请方向:" >
                    <el-select v-model="queryModuleData.appFromtoList" multiple placeholder="请选择申请方向" filterable
                               clearable >
                      <el-option
                        v-for="item in ['外-内', '内-内','内-外','外-外','台-内']"
                        :key="item"
                        :label="item"
                        :value="item">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="机密案件:">
                    <el-radio-group v-model="queryModuleData.ifSec">
                      <el-radio :label='1'>是</el-radio>
                      <el-radio :label='0'>否</el-radio>
                      <el-radio :label='null' >全部</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="时限内容:">
                    <el-input v-model="queryModuleData.caption " placeholder="请输入时限内容" clearable></el-input>
                  </el-form-item>
                  <el-form-item label="绝限日期:">
                    <DataPicker class="DataPicker" v-model="queryModuleData.abslimitDateList" @change="(date)=>changeDate(date,'abslimitDateStart','abslimitDateEnd')"></DataPicker>
                    <!--<el-date-picker-->
                    <!--v-model="queryModuleData.abslimitDateStart"-->
                    <!--value-format="yyyy-MM-dd"-->
                    <!--type="date"-->
                    <!--placeholder="选择日期">-->
                    <!--</el-date-picker>-->
                    <!--<span>至</span>-->
                    <!--<el-date-picker-->
                    <!--v-model="queryModuleData.abslimitDateEnd"-->
                    <!--value-format="yyyy-MM-dd"-->
                    <!--type="date"-->
                    <!--placeholder="选择日期">-->
                    <!--</el-date-picker>-->
                  </el-form-item>
                  <el-form-item label="立卷日期:">
                    <DataPicker  class="DataPicker" v-model="queryModuleData.caseDateList" @change="(date)=>changeDate(date,'caseDateStart','caseDateEnd')"></DataPicker>
                    <!--<el-date-picker-->
                    <!--v-model="queryModuleData.caseDateStart"-->
                    <!--value-format="yyyy-MM-dd"-->
                    <!--type="date"-->
                    <!--placeholder="选择日期">-->
                    <!--</el-date-picker>-->
                    <!--<span>至</span>-->
                    <!--<el-date-picker-->
                    <!--v-model="queryModuleData.caseDateEnd"-->
                    <!--value-format="yyyy-MM-dd"-->
                    <!--type="date"-->
                    <!--placeholder="选择日期">-->
                    <!--</el-date-picker>-->
                  </el-form-item>
                  <el-form-item label="商标类别:">
                    <el-input type="number" v-model="queryModuleData.goodClasse" placeholder="请输入商标类别" clearable></el-input>
                  </el-form-item>
                  <el-form-item label="计算基准日期:">
                    <DataPicker  class="DataPicker" v-model="queryModuleData.sendDateList" @change="(date)=>changeDate(date,'sendDateStart','sendDateEnd')"></DataPicker>
                    <!--<el-date-picker-->
                    <!--v-model="queryModuleData.sendDateStart"-->
                    <!--value-format="yyyy-MM-dd"-->
                    <!--type="date"-->
                    <!--placeholder="选择日期">-->
                    <!--</el-date-picker>-->
                    <!--<span>至</span>-->
                    <!--<el-date-picker-->
                    <!--v-model="queryModuleData.sendDateEnd"-->
                    <!--value-format="yyyy-MM-dd"-->
                    <!--type="date"-->
                    <!--placeholder="选择日期">-->
                    <!--</el-date-picker>-->
                  </el-form-item>
                  <el-form-item label="核销日期:">
                    <DataPicker  class="DataPicker" v-model="queryModuleData.writeoffDateList" @change="(date)=>changeDate(date,'writeoffDateStart','writeoffDateEnd')"></DataPicker>
                    <!--<el-date-picker-->
                    <!--v-model="queryModuleData.writeoffDateStart"-->
                    <!--value-format="yyyy-MM-dd"-->
                    <!--type="date"-->
                    <!--placeholder="选择日期">-->
                    <!--</el-date-picker>-->
                    <!--<span>至</span>-->
                    <!--<el-date-picker-->
                    <!--v-model="queryModuleData.writeoffDateEnd"-->
                    <!--value-format="yyyy-MM-dd"-->
                    <!--type="date"-->
                    <!--placeholder="选择日期">-->
                    <!--</el-date-picker>-->
                  </el-form-item>
                  <el-form-item label="时限员工:">
                    <el-select v-model="queryModuleData.userIds" placeholder="请选择时限员工" filterable
                               clearable multiple>
                      <el-option
                        v-for="item in $store.getters.userList"
                        :key="item.userId"
                        :label="item.fullname"
                        :value="item.userId">
                        <UserIconAndUserName :user-id="item.userId"></UserIconAndUserName>
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="创建员工:">
                    <el-select v-model="queryModuleData.userIdList" multiple placeholder="请选择创建员工" filterable
                               clearable >
                      <el-option
                        v-for="item in $store.getters.userList"
                        :key="item.userId"
                        :label="item.fullname"
                        :value="item.userId">
                        <UserIconAndUserName :user-id="item.userId"></UserIconAndUserName>
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="内部绝限:">
                    <DataPicker  class="DataPicker" v-model="queryModuleData.abslimitInternalDateList" @change="(date)=>changeDate(date,'abslimitInternalDateStart','abslimitInternalDateEnd')"></DataPicker>
                    <!--<el-date-picker-->
                    <!--v-model="queryModuleData.abslimitInternalDateStart"-->
                    <!--value-format="yyyy-MM-dd"-->
                    <!--type="date"-->
                    <!--placeholder="选择日期">-->
                    <!--</el-date-picker>-->
                    <!--<span>至</span>-->
                    <!--<el-date-picker-->
                    <!--v-model="queryModuleData.abslimitInternalDateEnd"-->
                    <!--value-format="yyyy-MM-dd"-->
                    <!--type="date"-->
                    <!--placeholder="选择日期">-->
                    <!--</el-date-picker>-->
                  </el-form-item>
                  <el-form-item label="时限工作组:">
                    <el-select v-model="queryModuleData.wrkIds" placeholder="请选择时限工作组" filterable
                               clearable multiple>
                      <el-option
                        v-for="item in queryWorkgroupNamesList"
                        :key="item.wkgId"
                        :label="item.groupName"
                        :value="item.wkgId">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="核销员工:">
                    <el-select v-model="queryModuleData.writeoffUserId" placeholder="请选择核销员工" filterable
                               clearable >
                      <el-option
                        v-for="item in $store.getters.userList"
                        :key="item.userId"
                        :label="item.fullname"
                        :value="item.userId">
                        <UserIconAndUserName :user-id="item.userId"></UserIconAndUserName>
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="监督员工:">
                    <el-select v-model="queryModuleData.watcherUserId" placeholder="请选择监督员工" filterable
                               clearable >
                      <el-option
                        v-for="item in $store.getters.userList"
                        :key="item.userId"
                        :label="item.fullname"
                        :value="item.userId">
                        <UserIconAndUserName :user-id="item.userId"></UserIconAndUserName>
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="核销状态:">
                    <el-select v-model="queryModuleData.writeoffState" placeholder="请选择核销状态" filterable
                               clearable >
                      <el-option
                        v-for="item in writeoffStateList"
                        :key="item.id"
                        :label="item.str"
                        :value="item.id">
                      </el-option>
                    </el-select>

                  </el-form-item>
                  <el-form-item label="创建时间:">
                    <DataPicker  class="DataPicker" v-model="queryModuleData.createDateList"></DataPicker>
                  </el-form-item>
                  <el-form-item label="注册国家:">
                    <el-select default-first-option :clearable='true' placeholder="请选择" v-model="queryModuleData.appState" filterable>
                      <el-option v-for="(item,key)  in countryList" :key="key" :label="item.countryCn" :value="item.countryCn">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="详情描述:">
                    <el-input v-model="queryModuleData.decription " placeholder="请输入详情描述" clearable></el-input>
                  </el-form-item>
                  <el-form-item label="核销/延期:">
                    <el-radio-group v-model="queryModuleData.operationStr">
                      <el-radio label='延期'>延期</el-radio>
                      <el-radio label='核销'>核销</el-radio>
                      <el-radio label='' >全部</el-radio>

                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="时限状态:">

                    <el-checkbox-group v-model="queryModuleData.timelimitStateList" @change="timelimitState1">
                      <el-checkbox class="checkboxChangeRadio" label="未核销"></el-checkbox>
                      <el-checkbox class="checkboxChangeRadio" label="已核销"></el-checkbox>
                      <el-checkbox class="checkboxChangeRadio" label="全部"></el-checkbox>
                    </el-checkbox-group>
                  </el-form-item>
                  <el-form-item label="客户案号:">
                    <el-input v-model="queryModuleData.custRefNo " placeholder="请输入客户案号" clearable></el-input>
                  </el-form-item>
                  <el-form-item label="申请人案号:">
                    <el-input v-model="queryModuleData.applicantRefNo " placeholder="请输入申请人案号" clearable></el-input>
                  </el-form-item>
                  <el-form-item label="第一次提醒日期:">
                    <DataPicker class="DataPicker" v-model="queryModuleData.remindDateArray1" :disabled="disabled1"></DataPicker>
                  </el-form-item>
                  <el-form-item label="第二次提醒日期:">
                    <DataPicker class="DataPicker" v-model="queryModuleData.remindDateArray2" :disabled="disabled2"></DataPicker>
                  </el-form-item>
                  <el-form-item label="第三次提醒日期:">
                    <DataPicker  class="DataPicker" v-model="queryModuleData.remindDateArray3" :disabled="disabled3"></DataPicker>
                  </el-form-item>
                  <el-form-item label="撰稿人:">
                    <VirtualSelect filterable clearable :data="$store.getters.allUserList"
                                     v-model="queryModuleData.actualAttorney"></VirtualSelect>
                  </el-form-item>
                  <el-form-item label="承办组:">
                    <el-select :clearable="true" default-first-option filterable placeholder="请选择" ref="gzzselect"
                               v-model="queryModuleData.cbWkgId" remote :remote-method="getFilterText">
                      <el-option :key="key" :label="item.groupName" :value="item.wkgId"
                                 v-for="(item,key) in filterGroup"/>
                    </el-select>
                  </el-form-item>
                  <el-form-item style="width: 90%;" label="多个客户文号">
                    <el-input clearable v-model="queryModuleData.custRefNos" placeholder="请输入多个客户文号" type="textarea" @keyup.enter.native.stop="() => {}"></el-input>
                  </el-form-item>
                  <el-form-item style="width: 90%;" label="多个案件文号">
                    <el-input clearable v-model="queryModuleData.agentNums" placeholder="请输入多个案件文号" type="textarea" @keyup.enter.native.stop="() => {}"></el-input>
                  </el-form-item>
                  <el-form-item style="width: 90%;" label="多个权利号">
                    <el-input clearable v-model="queryModuleData.droitNumbers" placeholder="请输入多个权利号" type="textarea" @keyup.enter.native.stop="() => {}"></el-input>
                  </el-form-item>
                </el-form>

              </div>
            <div class="clearWrap" >
              <el-popover
                placement="top"
                width="300"
                v-model="addFilterState">
                <div>过滤器名称</div>
                <div><el-input type="text" v-model="schemeName"></el-input></div>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="addFilterState = false">取消</el-button>
                  <el-button type="primary" size="mini" @click="addFilterScheme">确定</el-button>
                </div>
                <el-button style="margin-right: 10px" size="mini" slot="reference"><span>保存</span></el-button>
              </el-popover>
              <el-button  size="mini"   @click="clearSearch"><span>重置</span></el-button>
              <el-button  type="primary" size="mini"  @click="handleSearch(1)">搜索</el-button>
            </div>
            </div>
          </transition>
        </el-button-group>
<!--        <el-button type="primary" size="mini"  @click="handleSearch(1)">搜索</el-button>-->
<!--        <el-menu class="el-menu-demo" mode="horizontal" @select="(e)=>startDerred(e)" v-if="$store.getters.permissions.includes(38)" >-->
<!--          <el-submenu index="1">-->
<!--            <template slot="title">延期/核销</template>-->
<!--            <el-menu-item index="1-c">延期/核销(查询)</el-menu-item>-->
<!--            <el-menu-item index="1">延期/核销</el-menu-item>-->
<!--          </el-submenu>-->
<!--        </el-menu>-->

        <el-button type="primary" size="mini" @click="startDerred(1)" v-allow="38">延期/核销</el-button>
        <el-button type="primary" size="mini" @click="createTime()" v-allow="37">新建</el-button>
<!--        <el-menu class="el-menu-demo" mode="horizontal" @select="(e)=>startDerred(e)" v-if="$store.getters.permissions.includes(41)" >-->
<!--          <el-submenu index="1">-->
<!--            <template slot="title">批量审核</template>-->
<!--            <el-menu-item index="2-c">批量审核(查询)</el-menu-item>-->
<!--            <el-menu-item index="2">审核(通过)</el-menu-item>-->
<!--          </el-submenu>-->
<!--        </el-menu>-->
        <el-button type="primary" size="mini" v-allow="41" @click="startDerred('2-c')">批量审核</el-button>
       <!-- <el-button type="primary" size="mini" v-allow="270"  @click="remindPlanState=true">提醒计划</el-button> -->
        <!--                模板生成-->
        <exportFile ref="exportFile" :business.sync="business" :downLoadState="downLoadState" :isTimeLimit="true"
                    :multipleSelection="multipleSelection"
                    @selectedRows="()=>this.multipleSelection = this.getSelectedRows()" @getData="getExportFileData"
                    @close="closeSelect" pageTitle="时限"></exportFile>

        <el-dropdown v-allow="287" trigger="click" @command="commandMorebtn">
          <el-button class="el-dropdown-link" type="primary" size="small">
            批量转时限
          </el-button>

          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="0">转时限成员</el-dropdown-item>
            <el-dropdown-item command="1">转监督人</el-dropdown-item>

          </el-dropdown-menu>
        </el-dropdown>

      </div>

    </template>

    <div class="limitDayNum" v-if="!caseDetail">

      <TitleTotal :total="total" :currentPageSize="currentPageSize" />
      <el-form label-width="120px"  size="mini" class="form-container" @submit.native.prevent>
        <el-form-item label="快捷查询:"  style="margin-bottom: 0">
          <el-input v-model="queryModuleData.keyword" placeholder="请输入内容"   @keyup.enter.native="handleSearch" @change="handleSearch" clearable></el-input>
        </el-form-item>
      </el-form>
      <div class="button_wrap">
        <el-button class="exactButton"  type="primary"  size="mini" @click="allselect">全选</el-button>
          <el-button class="exactButton"  size="mini" @click="gridApi.deselectAll()">清除所选</el-button>
        <el-button class="exactButton" type="primary"  v-if="selectionState" size="mini" @click="confirmExactButton">{{multipleTypeText}}</el-button>
        <el-button class="exactButton" style="margin-right: 20px" size="mini"  v-if="selectionState" @click="selectionState=false">取消</el-button>
      </div>
      <div style="position: absolute;right: 0px;display: flex;align-items: center;">
<!--        <img @click="$store.getters.permissions.includes(0)?rotateY+=180:''" style="vertical-align: middle;" src="@/assets/小日历.png" alt=""><span>距离绝限天数</span>-->
        <img @click="$store.getters.permissions?rotateY+=180:''" style="vertical-align: middle;" src="@/assets/小日历.png" alt=""><span>距离绝限天数</span>
        <el-select v-model="queryModuleData.countDownDay" placeholder="请选择" @change="handleSearch">
          <el-option
            v-for="item in [{id:'',value:'不限'},{id:-1,value:'昨天'},{id:0,value:'当天'},{id:1,value:'明天'},{id:2,value:'2'},{id:7,value:'7'},{id:10,value:'10'},{id:15,value:'15'}, {id:30,value:'30'}]"
            :key="item.id"
            :label="item.value"
            :value="item.id">
          </el-option>
        </el-select>
<!--        <el-button type="text" v-if="total" @click="exportList(2)"><i class="el-icon-download">导出</i></el-button>-->
<!--        <div style="cursor:pointer;display:flex;align-items:center;right: 0;bottom:-6px;font-size: 14px;padding-right: 6px"><el-button type="text"  @click="exportList(1)"><i class="el-icon-download">导出</i></el-button>-->
<!--          <img @click="exportList(2)" src="@/assets/moon.png" style="width: 16px;height: 16px" width="16" alt=""></div>-->
        <div style="cursor: pointer; position: relative; display: flex; align-items: center; right: 0px; bottom: -6px; font-size: 14px; padding-right: 6px;">
          <el-button type="text" @click="exportList(2)" >导出</el-button>
            <span style="color: #52A2F4;margin: 0 5px"> / </span>
          <el-button type="text" @click="exportList(1)">全局导出</el-button>
        </div>
      </div>
    </div>
    <section>
    <template v-if="caseDetail">
      <div class="buttonWrap2">
        <!--<el-button type="primary" size="mini"  @click="handleSearch(1)">搜索</el-button>-->
        <div v-if="selectionState" style="float: left">
          <el-button class="exactButton" type="primary" size="mini" @click="confirmExactButton">{{multipleTypeText}}</el-button>
          <el-button class="exactButton" style="margin-right: 20px" size="mini" @click="selectionState=false">取消</el-button>
        </div>
<!--        <el-button type="primary" size="mini" @click="startDerred(1)" v-allow="38">延期/核销</el-button>-->
        <div style="display: flex;justify-content: space-between;align-items: center">
          <el-radio-group v-model="isHexiao" @change="()=>{getCaseTimelimitList()}">
            <el-radio :label="1">未核销</el-radio>
            <el-radio :label="2">已核销</el-radio>
            <el-radio :label="3">全部</el-radio>
        </el-radio-group>
        <el-button type="primary" size="mini" @click="createTime(agentNum)" v-allow="37">新建</el-button>
        </div>

      </div>
    </template>
      <div style="position:relative;">
      <div class="content_wrap" v-if="!caseDetail" :style="{transform: `rotateY(${rotateY}deg)`}">
        <div class="left_wrap" :style="{width:(currentCaseId||currentTltId)&&pattern?leftWrapWidth:'100%' }">
        <div  class="dots" @click="handleCheckboxState">
          <span class="dot">.</span>
          <span class="dot">.</span>
          <span class="dot">.</span>
        </div>
        <el-button class="brush_right" :class="brushRightHasFilter?'red':''" @click="brushRight" type="text" icon="el-icon-brush" ></el-button>
      <AgGridVue :style="{width:'100%',height: clientHeight+'px'}"
                 class="ag-theme-balham"
                 :columnDefs="columnDefs"
                 :rowData="timeLimitList"
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
                 @selectionChanged="selectionChanged"
                 :localeText="$store.state.caseInformation.localeText"
                 :suppressDragLeaveHidesColumns="true"
                 :suppressMakeColumnVisibleAfterUnGroup="true"
                 rowGroupPanelShow="always"
                 :groupSelectsChildren="true"
                 :suppressAggFuncInHeader="true"
                 :autoGroupColumnDef="autoGroupColumnDef"

                >
      </AgGridVue>
        <pagination
          :total="total"

          :page.sync="listQuery.pageNo"
          :limit.sync="listQuery.pageSize"
          @pagination="getTimelimitList(undefined, true)"
          :pageSizes="pageSizesList"
        />
        </div>
        <div class="right_wrap" v-if="pattern" :style="{position:'relative','margin-left':(currentCaseId||currentTltId)&&pattern?'10px' :'0',height:clientHeight+'px'}">
          <seeCaseDetail v-if="currentCaseId" :case-id="currentCaseId" :sign="1" :backsign="0" :taskType="taskType" pageType="timeLimit">
          </seeCaseDetail>
          <limitElectronicDocument v-if="currentTltId" :taskType="taskType" :tltId="currentTltId"></limitElectronicDocument>
        </div>
      </div>
<!--      <TimeLimitCalendar v-allow="0" class="timeLimitCalendar" :style="{transform: `rotateY(${rotateY-180}deg)`}" :exportQueryModel="exportQueryModel" @action="timeLimitCalendarAction"></TimeLimitCalendar>-->
      <TimeLimitCalendar v-if="!caseDetail&&(rotateY/180)%2"  class="timeLimitCalendar" :style="{transform: `rotateY(${rotateY-180}deg)`,zIndex:(rotateY/180)%2?1:-1}" :exportQueryModel="exportQueryModel" @action="timeLimitCalendarAction"></TimeLimitCalendar>
      </div>
      <div class="w-table contextmenu" v-if="caseDetail">
        <div  class="dots" @click="handleCheckboxState">
          <span class="dot">.</span>
          <span class="dot">.</span>
          <span class="dot">.</span>
        </div>
        <el-table
          highlight-current-row
          class="timeLimitTable myeltable"
          :class="total<=listQuery.pageSize?'':'noTrigger'"
          @row-contextmenu="rowContextmenu"
          ref="todoTaskMultiple"
          :data="timeLimitList"
          fit
          empty-text="暂无数据"
          :height="clientHeight-200"
          @select="handleSelectionChange"
          @select-all="handleSelectionAll"
          :row-class-name="getRowClassName"
          :header-cell-class-name="headerCellClassName"
          :cell-class-name="getCellClassName"
          @header-dragend="headerDragend"
          :row-style="rowStyle"
          @row-dblclick="rowDblclick"
          @filter-change="filterChange"

          border

        >
          <el-table-column
            type="selection"
            width="30"
            class="selection"
            v-if="selectionState"
          >
          </el-table-column>
          <el-table-column type="index" width="30" label="序号" align="left">
            <template slot="header" slot-scope="scope">

              <span>序号</span>
            </template>
            <template slot-scope="scope">
              <span :title="scope.$index+1">{{scope.$index+1}}</span>
            </template>
          </el-table-column>
          <el-table-column v-for="(col, index) in tableHeader" :key="index"
                           :prop="col.prop"
                           :label="col.label"
                           :width="col.width"
                           :type="col.type"
                           :min-width="getMinWidth(col)"
                           :header-align="col.headerAlign"
                           :column-key="index.toString()"
                           :render-header="renderHeader"
                           filter-placement="bottom-start"
                           sortable
          >
            <template slot-scope="scope">
              <div style="cursor: pointer" @click="takeCaseDetail(scope.row,col.prop)">
                <span v-show="col.prop=='isSign'&&scope.row[col.prop]==0"  :title="'未核销'">未核销</span>
                <span v-show="col.prop=='isSign'&&scope.row[col.prop]==1" :title="'未核销'">未核销</span>
                <span v-show="col.prop=='isSign'&&scope.row[col.prop]==2":title="'已核销'">已核销</span>
                <span v-show="col.prop!='index'&&col.prop!='isSign'"  :title="scope.row[col.prop]"> {{scope.row[col.prop]}}</span>
              </div>
            </template>
          </el-table-column>
          <!--<el-table-column-->
          <!--:column-key="item.value"-->
          <!--:filters="!caseDetail?unique(timeLimitList.map(i=>({text:item.title=='时限状态'?getState(i[item.value]):i[item.value],value:i[item.value]})),'value').filter(ii=>ii.value!=null):false"-->
          <!--:filter-method="!caseDetail?filterHandler:false"-->
          <!--:sortable="!caseDetail"-->
          <!--filter-placement="bottom-start"-->
          <!--align="left" v-for="(item,index) in preferenceList"  :width="getWidth(item)" :label="item.title" :prop="item.value" :key="index">-->
          <!--<template slot-scope="scope">-->
          <!--<div style="cursor: pointer" @click="$router.push('/workbench/case/seeCaseDetail/'+scope.row.caseId)">-->
          <!--<span v-if="item.value==='isSign'&&scope.row[item.value]===0" :style="{'color':validTime(scope.row.abslimitDate,scope.row.isSign)}" :title="'未核销'">未核销</span>-->
          <!--<span v-if="item.value==='isSign'&&scope.row[item.value]===1" :style="{'color':validTime(scope.row.abslimitDate,scope.row.isSign)}" :title="'未核销'">未核销</span>-->
          <!--<span v-if="item.value==='isSign'&&scope.row[item.value]===2" :style="{'color':validTime(scope.row.abslimitDate,scope.row.isSign)}" :title="'已核销'">已核销</span>-->
          <!--<span v-if="item.value!=='index'&&item.value!=='isSign'" :style="{'color':validTime(scope.row.abslimitDate,scope.row.isSign)}" :title="scope.row[item.value]">{{scope.row[item.value]}}</span>-->
          <!--</div>-->
          <!--</template>-->
          <!--</el-table-column>-->
<!--          <el-table-column label="操作" align="left" fixed="right" class-name="small-padding fixed-width" minWidth="200" >-->
<!--            <template slot-scope="scope">-->
<!--              <el-button type="text" size="small" @click="takeSee(scope.row)">查看</el-button>-->
<!--              <el-button v-show="scope.row.isSign==0&&$store.getters.permissions.includes(38)" type="text" size="small" @click="confirmExact(scope.row)">核销</el-button>-->
<!--              <el-button type="text" size="small" v-show="scope.row.isSign===1" @click="takeExamine(scope.row)" v-if="$store.getters.permissions.includes(41)">审核</el-button>-->
<!--              <el-button type="text" size="small" @click="takemodify(scope.row)" v-if="(scope.row.kind==1&&$store.getters.permissions.includes(125))||(scope.row.kind==2&&$store.getters.permissions.includes(126))">修改</el-button>-->
<!--              <el-button type="text" size="small" @click="delTimelimit(scope.row)" v-if="(scope.row.kind==1&&$store.getters.permissions.includes(127))||(scope.row.kind==2&&$store.getters.permissions.includes(128))">删除</el-button>-->
<!--            </template>-->
<!--          </el-table-column>-->
        </el-table>
        <pagination
          :total="total"
          :storage="false"
          :page.sync="listQuery.pageNo"
          :limit.sync="listQuery.pageSize"
          @pagination="getCaseTimelimitList"
          :pageSizes="pageSizesList"
        />
      </div>

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
    </section>

    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="70%"
      top="0"
      height="100vh"
      :close-on-click-modal="false"
      class="deffered"
      append-to-body
      :modal="false"
      v-dialogDrag
    >
      <DeferredCancellation
        v-if="dialogVisible"
        :multipleSelection="multipleSelection"
        @closeThisPage="closeDialog"
        :examineState="examineState"></DeferredCancellation>
    </el-dialog>
    <EmitSearch v-if="!caseDetail" @undateSearch="undateSearch"></EmitSearch>
    <SelectOption
      :buss-id="bussId"
      v-if="selectionOptionState"
      :dialog-visible="selectionOptionState"
      @cancel="closeDialogSelectOption"
      :idArray="getCurrentRowsData('tltId')"
      :defaultMultipleSelect="preferenceList.map(i=>i.title)"
      :exportType="exportType"
      :exportQueryModel="exportQueryModel"></SelectOption>
    <el-dialog
      ref="timeLimit"
      title="创建时限"
      append-to-body
      :visible.sync="timeLimitState"
      width="50%"
      center
      height="100vh"
      :modal="false"
      top="0"
      class="pdfDialog"
      :close-on-click-modal="false"
      v-dialogDrag
    >
      <createTimeLimit v-if="timeLimitState" :isPatent="isPatent" :query="timeLimitData" @cancel="closeDialog"></createTimeLimit>
    </el-dialog>
    <RemindPlan v-if="remindPlanState" @cancel="remindPlanState=false"></RemindPlan>

<!--    提醒弹框-->
    <el-dialog
      top="0"
      :visible.sync="remindView"
      width="80%"
      :modal="false"
      :close-on-click-modal="false"
      :show-close="false"
      :close-on-press-escape="false"
      append-to-body
      :lock-scroll="false"
      title="提醒计划"
      v-dialogDrag
      center
    >
      <el-button size="small" @click="addCurrentRemindPlan">添加</el-button>
      <el-table :data="planList" height="600">
        <el-table-column property="cycleNotice" label="提醒方式(周期提醒)" width="150">
          <template slot-scope="scope">
            <span v-if="scope.row[scope.column.property]">是</span>
            <span  v-else>否</span>
<!--            <el-checkbox  :disabled="type" v-model="scope.row[scope.column.property]"></el-checkbox>-->
          </template>
        </el-table-column>

        <el-table-column property="startDate" label="开始时间" width="200">
          <template slot-scope="scope">
            <el-date-picker
              v-model="scope.row[scope.column.property]"
              type="date"
              :disabled="!scope.row['cycleNotice']"
              placeholder="选择日期"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </template>
        </el-table-column>
<!--    <el-table-column property="daysEarlier" label="周期提醒提前天数" width="150">-->
<!--      <template slot-scope="scope">-->
<!--        <el-input :disabled="!scope.row['cycleNotice']" v-model="scope.row[scope.column.property]"></el-input>-->
<!--       </template>-->
<!--     </el-table-column>-->
        <el-table-column property="aheadDays" label="提醒间隔" width="100">
          <template slot-scope="scope">
            <el-input :disabled="!scope.row['cycleNotice']" v-model="scope.row[scope.column.property]"></el-input>
          </template>
        </el-table-column>
        <el-table-column property="remindOnce" label="提前天数" width="100">
          <template slot-scope="scope">
            <el-input :disabled="scope.row['cycleNotice']" v-model="scope.row[scope.column.property]"></el-input>

          </template>
        </el-table-column>
        <el-table-column property="userIdList" label="提醒人" width="350" >
          <template slot-scope="scope">
            <virtual-select class="virtual-select" :isUser="true" clearable multiple  :data="$store.getters.userList" v-model="scope.row[scope.column.property]"   filterable :render="(data)=>$commonUtils.UserRender(data,this)" >
            </virtual-select>
<!--            <el-select v-model="scope.row[scope.column.property]" placeholder="请选择时限成员" filterable-->
<!--                       multiple  :disabled="type" clearable >-->
<!--              <el-option-->
<!--                v-for="item in queryGetUserList"-->
<!--                :key="item.userId"-->
<!--                :label="item.fullname"-->
<!--                :value="item.userId">-->
<!--                <UserIconAndUserName :user-id="item.userId"></UserIconAndUserName>-->
<!--              </el-option>-->
<!--            </el-select>-->
          </template>
        </el-table-column>
        <el-table-column property="wechatNotice" label="企信提醒" width="100">
          <template slot-scope="scope">
            <el-checkbox  v-model="scope.row[scope.column.property]"></el-checkbox>

          </template>
        </el-table-column>
        <el-table-column property="emailNotice" label="邮件提醒" width="100">
          <template slot-scope="scope">
            <el-checkbox  v-model="scope.row[scope.column.property]"></el-checkbox>
          </template>
        </el-table-column>

        <el-table-column property="emailNotice" label="操作" >
          <template slot-scope="scope">
           <el-button type="text" @click="planList.splice(scope.$index,1)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
        <span slot="footer" class="dialog-footer">
        <el-button @click="remindView = false">取 消</el-button>
        <el-button type="primary" @click="upTimelimit">确 定</el-button>
      </span>
    </el-dialog>

<!--    批量转时限-->
    <el-dialog :title="changeTimeLimitTitle" :close-on-click-modal="false" :visible.sync="changeTimeLimitView" width="60%">
      <el-form label-position="right" label-width="30%" :model="timeLimitForm">
        <el-row style="width: 100%" v-if="changeTimeLimitTitle == '批量转时限成员'">
          <el-form-item label="时限工作组:" >
            <template slot="label">
              <span style="display: block">时限工作组</span>
              <el-button  size="small"  @click="addTimelimitWorkgroupArray" type="primary">添加</el-button>
            </template>
            <el-table :data="timeLimitForm.workgroupArray" border>
              <el-table-column align="left" label="时限工作组">
                <template slot-scope="scope">
                  <el-select v-model="timeLimitForm.workgroupArray[scope.$index].wrkId" placeholder="请选择时限工作组" filterable
                             clearable @change="(e)=>getTimelimitInfoWkgUsers(e,scope.$index)">
                    <el-option
                      v-for="item in timeLimitForm.queryWorkgroupNamesList"
                      :key="item.wkgId"
                      :label="item.groupName"
                      :value="item.wkgId">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column align="left" label="时限成员">
                <template slot-scope="scope" >
                  <virtual-select class="virtual-select" :isUser="true" clearable multiple   :data="$store.getters.userList" v-model="timeLimitForm.workgroupArray[scope.$index].timelimitUserArray"   filterable :render="(data)=>$commonUtils.UserRender(data,this)" >
                  </virtual-select>
                </template>
              </el-table-column>
              <el-table-column label="操作"  align="left">
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click="timeLimitForm.workgroupArray.splice(scope.$index,1)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-row>
        <el-row style="width: 100%" v-else>
          <el-form-item label="监督人">
            <template>
              <virtual-select class="virtual-select" :isUser="true" clearable multiple   :data="$store.getters.userList" v-model="timeLimitForm.watcherUserIdArray"   filterable :render="(data)=>$commonUtils.UserRender(data,this)" ></virtual-select>
            </template>

          </el-form-item>
        </el-row>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="changeTimeLimitView = false">取 消</el-button>
        <el-button type="primary" @click="editTimeLimitForm">确 定</el-button>
      </span>
    </el-dialog>

<!--    修改时限-->
    <el-dialog
      ref="timeLimitModify"
      append-to-body
      :visible.sync="timeLimitStateModify"
      width="80%"
      height="100vh"
      :modal="false"
      top="0"
      center
      class="pdfDialog"
      :close-on-click-modal="false"
      v-dialogDrag
    >
<!--      <createTimeLimit v-if="timeLimitState" :isPatent="isPatent" :query="timeLimitData" @cancel="closeDialog"></createTimeLimit>-->
      <modify-time-limit :tltId="modifyTitId" @modifyDone="modifyDone" @cancelModify="cancelModify"></modify-time-limit>
    </el-dialog>
    <!--    查看时限-->
    <el-dialog
      ref="timeLimitView"
      append-to-body
      :visible.sync="timeLimitStateView"
      width="80%"
      height="100vh"
      :modal="false"
      top="0"
      center
      class="pdfDialog"
      :close-on-click-modal="false"
      v-dialogDrag
    >
<!--      <createTimeLimit v-if="timeLimitState" :isPatent="isPatent" :query="timeLimitData" @cancel="closeDialog"></createTimeLimit>-->
      <see-time-limit v-if="seeTltId" :seeTltId="seeTltId" @closeTimeLimit="()=>{this.seeTltId = '', this.timeLimitStateView = false}"></see-time-limit>
    </el-dialog>

    <!--    商标撰写-->
    <el-dialog
      title="撰写指派"
      append-to-body
      :visible.sync="trademarkWritingView"
      width="60%"
      :modal="false"
      top="0"
      class="dragDialog writingDialog"
      :close-on-click-modal="false"
      v-dialogDrag
    >
      <trademark-writing-detail v-if="trademarkWritingView" type="create" :caseIds="trademarkWritingCaseIdList"
                                @closetrademarkWriting="closetrademarkWriting"></trademark-writing-detail>
    </el-dialog>
    </div>

</template>

<script>
  import {queryCaseWorkgroupUrl} from '@/api/caseDetail'
  import exportFile from '@/components/exportFile'
import SelectOption from '@/views/workbench/case/components/SelectOption'
import TimeLimitCalendar from './components/TimeLimitCalendar'
import request from '@/utils/request'
import  YearFilter from '@/components/ag-year-filter'
// import { AllModules } from '@ag-grid-enterprise/all-modules';
// //
//  console.log(AllModules);
import ViewsSwitching from '@/views/workbench/case/components/ViewsSwitching'
// import seeCaseDetail from '@/views/workbench/case/components/ManualIdentification/seeCaseDetail'
import { mapState } from "vuex";
import Pagination from '@/components/Pagination'; // secondary package based on el-pagination
import DeferredCancellation from './components/DeferredCancellation'
import {upTimelimit,getTimelimitDetail,revocationTimelimitWriteoff,addFilterScheme,queryCustomerNameId, getTimelimitList ,getTimelimitTypeAll, getWriteoffState,delTimelimit,selectColumn,queryPreference,savePreference,delPreference,getCaseTimelimitList,queryDeptGroup
} from '@/api/caseList.js'
import { queryWorkgroupNames} from '@/api/systemList'
import { getUser } from '@/api/user'
import { formatDate } from '@/utils'
import {queryCountry} from "@/api/caseDetail";
import createTimeLimit from "@/views/workbench/toDoTasks/createTimeLimit";
import { queryAllUrl } from '@/api/applicant.js'
import limitElectronicDocument from '@/views/workbench/toDoTasks/components/limitElectronicDocument'
import RemindPlan from "./components/RemindPlan";
  import ModifyTimeLimit from "./modifyTimeLimit";
  import SeeTimeLimit from "./seeTimeLimit";
 // import axios from 'axios'
var defaultqueryModuleData={
    countDownDay: '',
    timelimitState:'',
    agentNumStart: '',
    agentNumEnd:'',
    timelimitStateList:[],
    appIdList:[],
    custIds:[],
    caseTypeIds: [],
    wrkIds: [],
    userIds: [],
    deptGroupIds:[],
    abslimitInternalDateList:[],
    appInfoList :[],
    writeoffDateList:[],
    sendDateList:[],
    caseDateList:[],
    appFromtoList:[],
    abslimitDateList:[],
    kind: '',
    caseName: '',
    droitNumber: '',
    caption: '',
    goodClasse: '',
    userIdList: [],
    writeoffUserId: '',
    watcherUserId: '',
    writeoffState: '',
    createDateList: [],
    appState: '',
    decription: '',
    operationStr: undefined,
    custRefNo: '',
    applicantRefNo: '',
    remindDateArray1: [],
    remindDateArray2: [],
    remindDateArray3: [],
    actualAttorney: '',
    cbWkgId: '',
    custRefNos: '',
    agentNums: '',
    droitNumbers: ''
}
import rememberPosition from '@/mixins/rememberPosition.vue'
  import TrademarkWritingDetail from "../case/trademarkWriting/trademarkWritingDetail";
export default {
  mixins: [rememberPosition],
  name: 'timeLimit',
  props:{
    isPatent: {
      default:false
    },
    caseDetail: {
      default:false
    },
    caseDetailCaseId:{

    },
    agentNum:{

    },
    tltId:{
    }
  },
  data() {
    var tableHeader=[]
    if(localStorage.getItem('tableHeader')&&JSON.parse(localStorage.getItem('tableHeader')).find(item=>item.name==this.$options.name)){
      tableHeader = JSON.parse(localStorage.getItem('tableHeader')).find(item => item.name == this.$options.name).tableHeader
    }
    return {
      trademarkWritingCaseIdList: [],
      trademarkWritingView: false,
      tltTypeIdList: [],
      seeTltId: '',
      timeLimitStateView: false,
      modifyTitId: '',
      timeLimitStateModify: false,
      changeTimeLimitView: false,
      changeTimeLimitTitle: '',
      timeLimitForm: {},
      timeSelectedRows:[],
      business: 2,
      downLoadState: false,
      isHexiao: this.isPatent ? 1 : 3,
      planList: [],
      remindView: false,
      timelimitInfo:{watcherUserIdArray:[]},
      remindPlanState:false,
      gridOptions: {
        ...this.$store.state.caseInformation.gridOptions, ...{
          statusBar: {
            statusPanels: [
              {statusPanel: 'agSelectedRowCountComponent', align: 'left'},
            ]
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
    //  modules: AllModules,
      pageSizesList:[10, 50, 200,500,1000,5000,10000],
      tableFlag:true,
      multipleTypeText:'确定',
      selectionOptionState:false,

      selectionState:false,
      listLoading:false,
      timeLimitList:[],
      activeNames:[],
      listQuery: {
        pageNo: 0,
        pageSize:  JSON.parse(localStorage.getItem('pageSize'))?JSON.parse(localStorage.getItem('pageSize')).find(item=>item.name==this.$route.name)?JSON.parse(localStorage.getItem('pageSize')).find(item=>item.name==this.$route.name).pageSize:10:10
      },
      queryModuleData: {
        tltTypeIdList: '',
        countDownDay: '',
        timelimitState:'',
        agentNumStart: '',
        agentNumEnd:'',
        timelimitStateList:[],
        appIdList:[],
        custIds:[],
        caseTypeIds: [],
        wrkIds: [],
        userIds: [],
        userIdList: [],
        deptGroupIds:[],
        custRefNos: '',
        agentNums: '',
        droitNumbers: ''
      },
      total:0,
      tableTitleList:[
        {"title":"序号","value":"index" },{'title':'案件文号','value':'agentNum'},{'title':'案件名称','value':'caseName'},{"title":"客户","value":"custName" },
        {"title":"申请人","value":"applicantName" },{"title":"时限类型","value":"typeName" },{"title":"绝限日期","value":"abslimitDate" },{"title":"创建时间","value":"createDate" },{"title":"创建人","value":"senderUserName" },{"title":"时限状态","value":"isSign" }],
      multipleSelection:[],
      customerNameIdList:[],
      queryWorkgroupNamesList:[],
      queryGetUserList:[],
      countryList:[],
      timelimitState: [],
      writeoffStateList: [],
      getTimelimitTypeAllList: [],
      dialogVisible: false,
      operationState:0,
      examineState:false,
      checkboxState:false,
      userId: this.$store.getters.userId,
      bussId: 4,
      preferenceList: [],
      selectColumnList: [],
      checkCaseList: [],
      tableHeader: tableHeader,
      tableHeaderLabelList:[],
      rotateY:0,
      dragState: {
        start: -1, // 起始元素的 index
        end: -1, // 结束元素的 index
        move: -1, // 移动鼠标时所覆盖的元素 index
        dragging: false, // 是否正在拖动
        direction: undefined // 拖动方向
      },
      drawerState: false,
      clearWrapTop: 0,
      onlyOneSign:'tltId',
      filterText: '',
      filterDataSum: {},
      addFilterState: false,
      schemeName: '',
      exportType:'',
      exportQueryModel:'',
      columnApi:{},
      gridApi:{},
      currentPageSize:0,
      defaultParams: {
        //級聯菜單默認
        value: "caseTypeId",
        label: "caseType",
        children: "childrens",
        checkStrictly: true,
        multiple: true
      },
      timeLimitState:false,
      timeLimitData:{

      },
      currentCaseId:'',
      // leftWrapWidth:'60%',
      currentId:'',
      taskType:1,
      brushRightHasFilter:false,
      appInfoList:[],
      leftWrapWidth:localStorage.getItem('leftWrapWidth')?localStorage.getItem('leftWrapWidth'):'60%',
      currentTltId:'',
      deptGroupList:[],
      filterGroup: [],
      custGroup: [],
     }
  },

  created() {
    if(this.caseDetail){
      this.init(1)
    }
    this.defaultQuerySearch()
    this.queryCBZ()
    // axios.get('/peco/queryTasks',{
    //   params:{ perPage: 50,
    //     currentPage: 1,
    //     order_text: 'ascending',
    //     order_prop: 'tsk_type',
    //     tsk_filter: {"tsk_type":[],"tsk_cd":[],"tsk_stcd":[],"tsk_owner_id":[],"cz_status":[]},
    //     search_dict: {"tsk_keyword":"","tsk_owner":""}
    //   }
    //
    // }).then(res=>{
    //   let list=JSON.parse(res.data.tskInsInf).map(item=>{
    //     for(var key in item){
    //       item[key]=unescape(item[key])
    //     }
    //     return  item
    //   })
    //   console.log(list);
    //   // console.log(unescape(res.data.tskInsInf));
    // })
    // request({
    //   url:'/peco/queryTasks',
    //   method: 'get',
    //   data:{
    //     perPage: 50,
    //     currentPage: 1,
    //     order_text: 'ascending',
    //     order_prop: 'tsk_type',
    //     tsk_filter: {"tsk_type":[],"tsk_cd":[],"tsk_stcd":[],"tsk_owner_id":[],"cz_status":[]},
    //     search_dict: {"tsk_keyword":"","tsk_owner":""},
    //   }
    // }).then(res=>{
    //
    // })

    // qyeryTasks({user: 'b8782cb382619b663d110825bf00a255da029a5045947fda19e053eb',
    //   username: 'wanhuida',
    //   perPage: 50,
    //   currentPage: 1,
    //   order_text:null,
    //   order_prop:null,
    // tsk_filter: {"tsk_type":[],"tsk_cd":[],"tsk_stcd":[],"tsk_owner_id":[],"cz_status":[]},
    // search_dict: {"tsk_keyword":"脉动","tsk_owner":""}}).then(res=>{
    //
    // })
    // this.init(1)

  },
  activated() {
    if(this.initFlag){
      this.init()
      if(document.querySelector('.ag-body-viewport')){
        document.querySelector('.ag-body-viewport').scrollTop=this.scrollTopY
      }
    }
    this.initFlag=true
  },
  mounted(){
    if (!this.caseDetail) {
      let that=this
      new this.$DraginResize(document.querySelector(".left_wrap"), {
        clone: true,
        end(info) {
          if (info.dir == 'ver') {
            this.elem.style.height = info.height + 'px';
          }
          else if (info.dir == 'hor') {
            this.elem.style.width = info.width + 'px';
            localStorage.setItem('leftWrapWidth', info.width + 'px')
            // console.log(that);
            // that.$set(that,'leftWrapWidth',info.width + 'px')
            that.leftWrapWidth=info.width + 'px'
            // console.log(that.leftWrapWidth,that);
          }
        }
      })
      setTimeout(()=>{
        if(this.queryModuleData.custIds&&this.queryModuleData.custIds.length>0){
          queryCustomerNameId({ custIdArray:this.queryModuleData.custIds }).then(res=>{
            this.customerNameIdList=res.data
          })
        }
        if(this.queryModuleData.appIdList&&this.queryModuleData.appIdList.length>0){
          queryAllUrl({ pageNo: 1, pageSize: 100,appIdArray: this.queryModuleData.appIdList,orderBy:1 }).then(res=>{
            this.appInfoList = res.data
          })
        }
        this.queryDeptGroup()
        this.queryWorkgroupNames()
        this.getTimelimitTypeAll()
        this.getWriteoffState()
        // this.getUser()
        this.queryCountry()
      },300)
    }
  },
  methods: {
    closetrademarkWriting(flag) {
      this.trademarkWritingCaseIdList = []
      this.trademarkWritingView = false
      window.open("/#/workbench/technological_process/trademarkWriting")
    },
    getCurrentRowsData(key){
      if (this.gridApi && this.gridApi.rowModel) {
        return this.gridApi.rowModel.rootNode.childrenAfterSort.map(item => item.data).map(item => item[key])
      }
      return []
    },
    queryCBZ() {
      queryCaseWorkgroupUrl({ status: '1' }).then(res => {
          this.custGroup = res.data
          this.filterGroup = res.data
        })
    },
    getFilterText(e) {
        this.filterGroup = this.custGroup.filter(item => e ? item.wkgUsers.map(i => i.fullname).includes(e) || item.groupName.includes(e) : true)
      },
    defaultQuerySearch() {
      this.queryModuleData = JSON.parse(localStorage.getItem('queryModuleData')) ? JSON.parse(localStorage.getItem('queryModuleData')).find(item => item.name == this.$route.name) ? JSON.parse(localStorage.getItem('queryModuleData')).find(item => item.name == this.$route.name).queryModuleData : {} : {};
      if(this.queryModuleData.tltTypeIdList){
        this.tltTypeIdList = this.queryModuleData.tltTypeIdList
      }
      delete this.queryModuleData.operation
    },
    modifyDone(){
      this.modifyTitId =  ''
      this.timeLimitStateModify = false
      this.getCaseTimelimitList()
    },
    cancelModify(){
      this.modifyTitId =  ''
      this.timeLimitStateModify = false
    },
    addTimelimitWorkgroupArray(){
      this.timeLimitForm.workgroupArray.push({wrkId:null,timelimitUserArray:[]})
    },
    getTimelimitInfoWkgUsers(e,index){
      this.timeLimitForm.workgroupArray[index].timelimitUserArray=[...new Set(this.timeLimitForm.queryWorkgroupNamesList.find(item=>item.wkgId==e).wkgUsers.map(item=>item.userId))]
    },
    commandMorebtn(command){
      if (!this.getSelectedRows().length) {
        this.$message.error("请先选择！");
        return;
      }
      this.queryCaseWorkgroupUrl()
      this.changeTimeLimitView = true;
      if(command === '0'){
        this.changeTimeLimitTitle = '批量转时限成员'
        this.$set(this.timeLimitForm, 'workgroupArray', [])
      }else{
        this.changeTimeLimitTitle = '批量转监督人'
        this.$set(this.timeLimitForm, 'watcherUserIdArray', [])
      }
    },
    queryCaseWorkgroupUrl(){
      queryCaseWorkgroupUrl({status:1}).then(res => {
        if (res.success) {
          this.$set(this.timeLimitForm, 'queryWorkgroupNamesList', res.data)
        }
      })
    },
    editTimeLimitForm(){
      let key = ''
      if(this.changeTimeLimitTitle == '批量转时限成员'){
        key = 'workgroupArray'
      }else{
        key = 'watcherUserIdArray'
      }
      upTimelimit({
        tltIdArray: this.getSelectedRows().map(itm=>itm.tltId),
        [key]: this.timeLimitForm[key]
      }).then(res=>{
        this.changeTimeLimitView = false
        if(this.changeTimeLimitTitle == '批量转时限成员'){
          this.propsChange('timeUser', res.data.timeUser)
        }else{
          this.propsChange('watcherUserNmaes', res.data.watcherUserNmaes)
        }

      })
    },
    propsChange(type, value) {
      this.timeLimitList.forEach(item => {
        if (this.getSelectedRows().map(itm => itm.tltId).includes(item.tltId)) {
          this.$set(item, type, value)
        }
      })
      this.timeLimitList.push({})
      this.timeLimitList.pop()
    },
    getExportFileData(){
      this.downLoadState = true
      this.$nextTick(() => {
        this.downLoadState = false
      })
    },
    allselect(){
     this.gridApi.deselectAll();
     this.gridApi.selectAllFiltered()
    },
    timeLimitCalendarAction(action,row){
      this[action](row)
    },
    remoteMethod(value, property, filterName) {
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
        Promise.all([ request,queryCustomerNameId({ pageNo: 1, pageSize: 100, keyword: value})]).then(res=>{
          this.customerNameIdList= this.$commonUtils.unique(res[0].data.concat(res[1].data).map(item => ({ id: item.custId, value:item.name,value1:item.country,value2:item.fullname})),'id')

        })
        // queryCustomerNameId({ pageNo: 1, pageSize: 100, keyword: value, custIdArray: this.queryModuleData[property]}).then(
        //   res => {
        //     this.$set(
        //       this.conditionsModuleList[index],
        //       "valueList",
        //       res.data.map(item => ({ id: item.custId, value:item.name,value1:item.country,value2:item.fullname}))
        //     );
        //     this.$forceUpdate();
        //   }
        // );
        // queryCustomerNameId({ pageNo: 1, pageSize: 100, keyword: value, custIdArray: this.queryModuleData[property]}).then(
        //   res => {
        //     this.$set(
        //       this.conditionsModuleList[index],
        //       "valueList",
        //       res.data.map(item => ({ id: item.custId, value:item.name,value1:item.country,value2:item.fullname}))
        //     );
        //     this.$forceUpdate();
        //   }
        // );
      }
      if (value && ["申请人",  "转让人"].includes(filterName)) {
        queryAllUrl({
          applicantName: value,
          pageNo: 1,
          pageSize: 100,
          orderBy:1
        }).then(res => {
          this.appInfoList= res.data.map(item => ({
            id: item.appId,
            value: item.applicantName,
            value1: item.applicantEnName,
            value2: item.applicantAddress,
            value3: item.applicantEnAddress
          }))
          // console.log(this.appInfoList);
        });
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
        // "",
        // console.log(this.conditionsModuleList[index]['valueList']);

        // this.$set(
        //   this.conditionsModuleList[index],
        //   "valueList",
        //   this.conditionsModuleList[index].values
        //     .filter(item => {
        //       for (let key in item) {
        //         if (
        //           item[key] &&
        //           item[key]
        //             .toLocaleUpperCase()
        //             .includes(value.toLocaleUpperCase())
        //         ) {
        //           return true;
        //         }
        //       }
        //       return false;
        //     })
        //     .slice(0, 100)
        // );
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
    init(flag){
      this.$store.commit('caseInformation/SET_BUSSID',this.bussId)
      if(flag){
        this.getAllWfs()
      }
      if (this.caseDetail) {
        this.getCaseTimelimitList()
        return
      }

      this.getTimelimitList()
    },
    queryAllUrl(query){
      if(query !== ''){
        queryAllUrl({ pageNo: 1, pageSize: 100,applicantName: query,orderBy:1 }).then(res=>{
          this.appInfoList=res.data
        })
      }
    },
    changePattern(e){
      if(e===1){
        this.$store.commit('user/SET_PATTERN',false)
      } else {
        this.$store.commit('user/SET_PATTERN',true)
      }
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
        let sortData =  this.$commonUtils.getFilterModel(this.$options.name+this.$route.name,'SortModel')
        if(sortData&&sortData.length){
          this.gridApi.setSortModel(sortData)
          this.gridApi.onSortChanged()
        }
      })
    },
    brushRight(){

      let data =   this.$commonUtils.getFilterModel(this.$options.name+this.$route.name,'FilterModel')
      let arr =  Object.keys(data)
      arr.forEach(item=>{
        this.gridApi.destroyFilter(item)
      })
    },
    closeSelect(){
      this.selectionState = false
      this.selectionOptionState = false
      this.timeLimitState=false
      this.timeSelectedRows = []
    },
    createTime(agentNum){
      if(agentNum){
        this.timeLimitData={
          agentNums:agentNum
        }
      } else {
        const agentNums = this.getSelectedRows().map(item => item.agentNum).join(',')
        this.timeLimitData={
          agentNums
        }
      }
      this.timeLimitState=true
    },
    cellRenderer(params){
      if(params.colDef.field=='caption'){
        var eDiv = document.createElement('div');
        eDiv.style.height='100%'
        eDiv.innerHTML = `<div class="btn-simple" style="height:100%" title="${params.value}"><span>${params.value?params.value:''}</span></div>`
        var eButton = eDiv.querySelectorAll('.btn-simple')[0];
        eButton.addEventListener('click', ()=> {
          this.handleSeeCaseDetail(params)  //this.takeCaseDetail(params.data,params.colDef.field)
        });
        return eDiv;
      }
      if(params.colDef.field=='isSign'){
        if(params.value==0){
          return  `<span title="未核销">未核销</span>`
        }
        if(params.value==1){
          return  `<span title="未核销">未核销</span>`
        }
        if(params.value==2){
          return  `<span title="未核销">已核销</span>`
        }
      }
      if(params.colDef.field=='sid'){
        if(params.node.group) return ''
        let index = 0
        params.api.forEachNodeAfterFilterAndSort(node => {
          if (!node.group && node.rowIndex < params.node.rowIndex) index++
        })
        return index + 1
      }
      return  `<span title="${params.value}">${params.value?params.value:''}</span>`
    },
    selectionChanged(params){
      //  .data.tltTypeId!=this.gridApi.getSelectedNodes().
      if(this.operationState ==1){
        if ([...new Set(this.getSelectedRows().map(item => item.tltTypeId))].length >= 2) {
          this.$message.error('您必须选择相同时限类型进行核销')
         // params.api.selectionController.lastSelectedNode.setSelected(false)
        }
      }
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
      return valueList0;
    },
    refreshEvenRowsCurrencyData(params) {
      this.gridApi.rowModel.rootNode.childrenAfterFilter&&this.gridApi.rowModel.rootNode.childrenAfterFilter.length&&this.gridApi.rowModel.rootNode.childrenAfterFilter.forEach(rowNode => {
        setTimeout(() => {
          rowNode.setDataValue(
          'sid',
          rowNode.rowIndex + 1)
        }, 0)
      });
      // if(!params.columnApi.columnController.groupAutoColumns){
      //   this.gridApi.forEachNode(rowNode=> {
      //     rowNode.setDataValue(
      //       'sid',
      //       rowNode.rowIndex + 1)
      //   });
      // }
      if(this.timeLimitList.length){
      // &&!params.afterDataChange
        if(params.type=="filterChanged"){
          this.$commonUtils.saveFilterModel(this.$options.name+this.$route.name,'FilterModel',this.gridApi.getFilterModel())
          var data = this.$commonUtils.getFilterModel(this.$options.name + this.$route.name, 'FilterModel');
          var arr = Object.keys(data);
          if(arr.length){
            if(arr.length == 1 && arr[0] == 'abslimitDate' && data.abslimitDate.values.length == 0){
              this.brushRightHasFilter=false
            }else{
              this.brushRightHasFilter=true
            }
          }else {
            this.brushRightHasFilter=false
          }
        }
        if(params.type=="sortChanged"){
          this.$commonUtils.saveFilterModel(this.$options.name+this.$route.name,'SortModel',this.gridApi.getSortModel())
        }
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
    getSelectedRows(f){
      if (this.gridApi.getSelectedNodes) {
          const selectedNodes = this.gridApi.getSelectedNodes();
          const selectedData = selectedNodes.map(node => node.data);
          return selectedData
        }
      return  []
      // if(this.gridApi&&this.multipleSelection.length){
      //   this.timeSelectedRows = this.multipleSelection
      //   return  this.multipleSelection
      //
      // }else {
      //   if(this.gridApi.getSelectedNodes){
      //     const selectedNodes = this.gridApi.getSelectedNodes();
      //     const selectedData = selectedNodes.map(node => node.data);
      //     !this.timeSelectedRows.length&&(this.timeSelectedRows = selectedData)
      //     return selectedData
      //   } else {
      //     return  this.multipleSelection
      //   }
      // }
    },
    onGridReady(params) {
      this.gridApi = params.api;
      this.columnApi = params.columnApi;
      this.params=params
      let that=this
      this.$nextTick(()=>{
        document.querySelector('.ag-body-viewport').onscroll=function (e) {
          that.scrollTopY= e.target.scrollTop
        }
      })
      this.init(1)
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
      return  this.getRowContextmenuList(params.node.data).map(item=>({
        name: item.name,
        action: () =>{
          this[item.action](params.node.data,'','',params.value)
        },
      }))
    },
    takeCaseDetail(row, type) {
      if (type=='agentNum') {
        this.$commonUtils.takeCaseDetail(row,this)
      }
    },
    handleSeeCaseDetail(params){

      if(params.data['tltId']!=this.currentId){
        this.currentId=''
        this.currentCaseId=''
        this.currentTltId=''
        if(params.data.taskType){
          this.taskType=params.data.taskType
        }

        // this.caseList= params.data.caseArray
        this.$nextTick(()=>{
          this.currentId=params.data.tltId
          this.currentCaseId = params.data.caseId
          // console.log(this.currentCaseId);
          if(!this.currentCaseId){
            this.currentTltId=params.data.tltId
          }
        })
      }
    },
    filterCheck(val) {
      this.filterText = val;
    },
    rowDoubleClicked(params){
      var row=params.data
      this.takeSee(row, 'timelimitlist')
    },
    rowDblclick(row){
      this.takeSee(row)
    },
    addFilterScheme(e){
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
        this.addFilterState=false
      })
    },
    revocationTimelimitWriteoff(row){
      revocationTimelimitWriteoff({ tltId: row.tltId}).then(res => {
          getTimelimitList({tltIds: row.tltId}).then(res=> {
            if(res.data){
              for(var key in res.data[0]){
                this.$set(row,key,res.data[0][key])
              }
              this.columnDefs.push({})
              this.columnDefs.pop()
            }
          })
      })
    },
    copy(row, column, event,value) {
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
    write(row) {
      this.trademarkWritingCaseIdList = [row.caseId]
      this.trademarkWritingView = true
    },
    getRowContextmenuList(row){
        return [
          { name: '复制', action: 'copy' },
          { name: '核销', action: 'confirmExact', permissions:38, isSign:0},
          { name: '审核', action: 'takeExamine', permissions:41, isSign:1 },
          { name: '修改', action: 'takemodify', permissions:125, kind:1},
          { name: '修改', action: 'takemodify', permissions:126, kind:2},
          { name: '删除', action: 'delTimelimit', permissions:127, kind:1 },
          { name: '删除', action: 'delTimelimit', permissions:128, kind:2 },
          { name: '撤销', action: 'revocationTimelimitWriteoff',permissions:227, isRevocation:true },
          { name: '提醒', action: 'remind'},
          { name: '撰写指派', action: 'write', isCase: true, permissions:378},
        ].filter(item=>{
        if(item.permissions){
          if(item.isRevocation){
            return this.$store.getters.permissions.includes(item.permissions) || row.isRevocation
          } else if (item.isCase) {
            return this.$store.getters.permissions.includes(item.permissions) && row.caseId
          } else {
            return this.$store.getters.permissions.includes(item.permissions)&&(row.isSign==item.isSign||row.kind==item.kind)
          }
        } else {
          return true
        }
      })
    },
    remind(row){
      this.remindView = true;
      getTimelimitDetail({tltId: row.tltId}).then(res=>{
        this.timelimitInfo=res.data
        if(this.timelimitInfo.watcherUserIdArray && this.timelimitInfo.watcherUserIdArray.length == 0 && this.timelimitInfo.watcherUserIds){
          this.timelimitInfo.watcherUserIdArray = this.timelimitInfo.watcherUserIds.split(',')
        }
      })
    },
    addCurrentRemindPlan(){
        this.$confirm('该条时限提醒是否为周期提醒?', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          distinguishCancelAndClose:true
        }).then(() => {

          this.planList.push({
            remindOnce:null, startDate:null ,aheadDays :null,wechatNotice:false, emailNotice:false,
            userIdList:this.timelimitInfo.workgroupArray.reduce((pre,next)=>{
              return [...pre,...next.timelimitUserArray]
            },[]),
            cycleNotice:true
          })
        }).catch((action ) => {
          if(action=='cancel'){
            this.planList.push({
              remindOnce:null, startDate:null ,aheadDays :null,wechatNotice:false, emailNotice:false,
              userIdList:this.timelimitInfo.workgroupArray.reduce((pre,next)=>{
                return [...pre,...next.timelimitUserArray]
              },[]),
              cycleNotice:false
            })
          }
        });
    },
    upTimelimit(){
      this.timelimitInfo.planList = this.planList
      upTimelimit(this.timelimitInfo).then(res=>{
        this.$message.success('修改成功')
        this.remindView = false;
        // this.$router.history.go(-1)
      })
    },
    rowContextmenu(row, column, event) {
      const that=this
      this.$ContextMenu({
        event, // 传入鼠标事件
        menu:this.getRowContextmenuList(row)
      }).then(rs => {
        if(rs){
          this[rs](row, column, event);
        }
      });
    },
    rowClick(row, column, event){
      this.multipleSelection = this.getSelectedRows()
      if(this.selectionState){
        if(this.$refs.todoTaskMultiple.store.states.selection.find(item=>item==row)){
          this.$refs.todoTaskMultiple.toggleRowSelection([{row:row, selected:false }])
          this.$refs.todoTaskMultiple.store.states.selection=this.$refs.todoTaskMultiple.store.states.selection.filter(item=>item!==row)
          this.startRow=''
        }else {
          row.plChoose=true
          this.$refs.todoTaskMultiple.toggleRowSelection([{row:row,selected:true}])
          var flag=true

          if(event.shiftKey){
            if(this.startRow){
              this.lastRow = row['tltId']
              if(this.lastRow==this.startRow){
                this.lastRow=''
              }
            }
            if(!this.startRow&&flag) {
              this.startRow= row['tltId']
              return
            }
            this.tableselectRow(this.rowList)
            this.rowList = []

          } else {
            if(!this.startRow&& flag){
              this.startRow=row['tltId']
            }
            if(this.startRow){
              this.startRow=row['tltId']
            }
          }
        }
      }
    },
    tableselectRow(){
      let indexOfList=[this.$refs.todoTaskMultiple.store.table.tableData.map(item=>Number(item['tltId'])).indexOf(Number(this.startRow)),this.$refs.todoTaskMultiple.store.table.tableData.map(item=>Number(item['tltId'])).indexOf(Number(this.lastRow))].sort((a,b)=>a-b)
      this.rowList=this.$refs.todoTaskMultiple.store.table.tableData.filter((item,index)=>index>=indexOfList[0]&&index<=indexOfList[1])
      let newSet = new Set(this.$refs.todoTaskMultiple.store.states.selection)
      this.rowList.forEach(itm=>{
        if(!newSet.has(itm)){
          if(!itm.plChoose){
            itm.plChoose = true
          }
          this.$refs.todoTaskMultiple.store.states.selection.push(itm)
        }
      })
      this.startRow=''
      this.lastRow=''
      // setTimeout(()=>{
      //   this.$refs.todoTaskMultiple.toggleRowSelection(this.timeLimitList.find(i=>i[this.onlyOneSign]==Number(this.lastRow)), true);
      //   this.multipleSelection = this.unique(
      //     this.multipleSelection.concat([this.timeLimitList.find(i=>i[this.onlyOneSign]==Number(this.lastRow))]),
      //     this.onlyOneSign
      //   );
      // })
    },
    clickoutside(){
      this.drawerState=false
    },
    mousedown(e){

      function getParentTag(startTag, parentTagList = []) {
        // 传入标签是否是DOM对象
        if (!(startTag instanceof HTMLElement)) return console.error('receive only HTMLElement');
        // 父级标签是否是body,是着停止返回集合,反之继续
        if ('BODY' !== startTag.parentElement.nodeName) {
          // 放入集合
          parentTagList.push(startTag.parentElement)
          // 再上一层寻找
          return getParentTag(startTag.parentElement, parentTagList)
        }
        // 返回集合,结束
        else return parentTagList;
      }
      if(this.$route.name=='timeLimit'&&e.target.className!='btn-simple'&&e.target.className!='dragin-resize-hor'&&!getParentTag(e.target,[e.target]).map(item => item.className).includes('right_wrap')){
         this.currentCaseId=''
         this.currentId=''
      }
    },
    changeDate(n,start,end){
      this.queryModuleData[start]=n[0]
      this.queryModuleData[end]=n[1]
    },
    getCaseTimelimitList(){
      if(this.isHexiao == 1 || this.isHexiao == 2){
        this.queryModuleData.timelimitState=this.isHexiao
      }else if(this.isHexiao == 3){
        this.queryModuleData.timelimitState = ''
      }
      this.queryModuleData.caseId=this.caseDetailCaseId
      this.queryModuleData.pageNo=this.listQuery.pageNo
      this.queryModuleData.pageSize=this.listQuery.pageSize
      this.queryModuleData.tltId=this.tltId
      getCaseTimelimitList(this.queryModuleData).then(res=>{
        this.total=res.total
        this.listLoading = false
        res.data.forEach((item,index)=>{
          item.sid=index+1
        })
        this.timeLimitList= res.data
      })
    },
    filterHandler(value, row, column) {
      const property = column['property'];
      return row[property] === value;
    },
    queryCountry(){
      queryCountry()
        .then(response => {
          this.countryList = response.data;
        })
        .catch(err => {
          console.log(err);
        });
    },

    startDerred(num){
      if(num=='2-c'){
        this.selectionState = true
      }
      // this.selectionState = true
      //this.$refs.todoTaskMultiple.store.states.selection=[]
      if(String(num).includes('c')){
        this.operationState=num.replace('-c','')
        if(this.operationState==1){
          this.multipleTypeText='核销/延期'
        }
        if(this.operationState==2){
          this.multipleTypeText='审核'
        }
        this.getTimelimitList()
      }else {
        this.operationState=num
        if(this.operationState==1){
          if ([...new Set(this.getSelectedRows().map(item => item.taskType))].length >= 2) {
            this.$message.error('您必须选择相同案件类型进行核销')
            return
           // params.api.selectionController.lastSelectedNode.setSelected(false)
          }
          this.multipleTypeText='核销/延期'
        }
        if(this.operationState==2){
          this.multipleTypeText='审核'
        }
        this.confirmExactButton()
      }
    },
    // exportList(){
    //
    //   this.selectionState=true
    //   this.operationState=3
    //   this.multipleTypeText='导出'
    // },
    exportList(flag){
      this.exportType=flag
      if(flag==2){
       // this.$refs.todoTaskMultiple.store.states.selection = []
        this.selectionState = true;
        this.operationState=3
        this.multipleTypeText = '列表导出';
      } else if(flag == 1) {

        this.selectionOptionState=true
      }
      this.confirmExactButton()
    },
    handleSearch(num){
     // this.$refs.todoTaskMultiple.store.states.selection=[]
      delete this.queryModuleData.writeoffButton
      delete this.queryModuleData.audit
      this.selectionState=false
      this.listQuery.pageNo=1
      this.operationState=null
      this.saveQueryModel()
      this.getTimelimitList(num)
      // this.drawerState=false
    },
    saveQueryModel(){
      if(this.queryModuleData.tltTypeId){
        delete this.queryModuleData.tltTypeId
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
    },
    clearSearch(){
      this.queryModuleData=JSON.parse(JSON.stringify(defaultqueryModuleData))
      this.tltTypeIdList = []
      // for (var key in this.queryModuleData) {
      //   if(key.includes('Array')||key.includes('List')){
      //     this.$set(this.queryModuleData,key,[])
      //   }else if(key==='caseTypeIds'||key==='deptGroupIds' || key==='custIds' || key==='appIds' || key==='wrkIds' || key==='userIds'){
      //     this.$set(this.queryModuleData,key,[])
      //   } else{
      //     this.$set(this.queryModuleData,key,null)
      //   }
      // }
    },
    closeDialog(flag){
      this.dialogVisible=false
      this.timeLimitState=false
      this.multipleSelection=[]
      // this.operationState = null
      if(flag){
       // this.$refs.todoTaskMultiple.store.states.selection=[]
       //  this.selectionState=false
        if(this.caseDetail){
           this.getCaseTimelimitList()
        } else {
          this.timeLimitList= this.timeLimitList.filter(item=>!(this.getSelectedRows().map(itm=>itm.tltId).includes(item.tltId)))
          // this.currentPageSize= this.timeLimitList.length
          // this.startDerred(this.operationState)
        }
      }
    },
    closeDialogSelectOption(){
      this.selectionOptionState=false
     // this.$refs.todoTaskMultiple.store.states.selection=[]
      this.selectionState=false
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
          if(this.caseDetail){
            this.getCaseTimelimitList()
          } else {
            this.handleSearch()
          }
          this.getAllWfs()
        }
      })
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
          filter:item.value==='abslimitDate'? YearFilter: 'agSetColumnFilter',
          cellRenderer:this.cellRenderer,
          filterParams: {
            newRowsAction:'keep',
            comparator: (a, b)=>{
              return this.$commonUtils.sort(a,b,item.value)
            }
          },
          menuTabs: ['filterMenuTab','generalMenuTab','columnsMenuTab'],
          cellClass: function(parmas) {
            if(parmas.colDef.headerName==='绝限日期'){
              return 'red'
            }
            if(parmas.colDef.headerName==='时限内容'){
              return 'itemTitle_style'
            }
            if(parmas.data && parmas.data.isSign === 1) {
              return 'lightGreen'
            }
          },
          cellStyle: function(params) {
            if(!params.data){
              return
            }
            if(params.data.isSign === 1) {
              return {color:'#14800B'}
            }
            if(params.data.isSign === 2) {
              return {color:'#c9c9c9'}
            }
            var startTime = params.data.abslimitDate
            startTime=new Date(startTime).getTime()
            var endTime = new Date().getTime()
            var nextDay=new Date(formatDate(new Date(new Date().getTime() + 24*60*60*1000).toLocaleDateString())).getTime()
            if(startTime<=nextDay&&startTime>endTime){
              return {color:'#131EEA'}
            }
            if(startTime<endTime) {
              return {color:'#FB1E1E'}
            }
            return {color:'#333'}
          }
        }))]
        if(!this.caseDetail){
          this.$nextTick(()=>{
            this.columnDefs.forEach(item=>{
              if(item.field=='sid'){
                return
              }
              this.columnApi.getColumn(item.field).addEventListener('menuVisibleChanged', ()=>{
                if(document.querySelector(".ag-tabs")&&document.querySelector(".ag-set-filter-list")){
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
        }

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
          if(this.caseDetail){
            this.getCaseTimelimitList()
          } else {
            this.handleSearch()
          }
          this.getAllWfs()
        }
      })
    },
    handleSelectionAll(val) {
   //   val = val.filter(item => item !== undefined)
     // this.multipleSelection = this.unique(this.multipleSelection.concat(val), 'tltId')
     //  if(this.operationState ==1){
     //    if ([...new Set(this.multipleSelection.map(item => item.tltTypeId))].length >= 2) {
     //      this.$message.error('您必须选择相同时限类型进行核销')
     //      this.multipleSelection.filter(item => item.tltTypeId !== this.multipleSelection[0].tltTypeId).forEach(row => {
     //        this.$refs.todoTaskMultiple.toggleRowSelection(row, false)
     //        this.multipleSelection = this.multipleSelection.filter(item => item.tltId !== row.tltId)
     //      })
     //    }
     //  }
      if (!val.length) {
        this.timeLimitList.forEach(row => {
        //  row.plChoose=false
        })
      } else {
       // if(this.operationState ==1){
       //   if ([...new Set(this.$refs.todoTaskMultiple.store.states.selection.map(item => item.tltTypeId))].length >= 2) {
       //     this.$message.error('您必须选择相同时限类型进行核销')
       //     this.$refs.todoTaskMultiple.store.states.selection = this.$refs.todoTaskMultiple.store.states.selection.filter(item => item.tltTypeId !== this.$refs.todoTaskMultiple.store.states.selection[0].tltTypeId)
       //     console.log(this.$refs.todoTaskMultiple.store.states.selection);
       //   }
       // }
      }
    },
    handleSelectionChange(val, row) {

      // val = val.filter(item => item != undefined)
      // this.multipleSelection = this.unique(this.multipleSelection.concat(val), 'tltId')
      // if(this.operationState ==1){
      //   if ([...new Set(this.multipleSelection.map(item => item.tltTypeId))].length >= 2) {
      //     this.$message.error('您必须选择相同时限类型进行核销');
      //     this.$refs.todoTaskMultiple.toggleRowSelection(row, false)
      //     this.multipleSelection = this.multipleSelection.filter(item => item.tltId !== row.tltId)
      //   }
      // }
      if (!val.find(item => item['tltId'] === row['tltId'])) {
        this.$refs.todoTaskMultiple.store.states.selection=this.$refs.todoTaskMultiple.store.states.selection.filter(item=>item!==row)
        // this.multipleSelection = this.multipleSelection.filter(
        //   item =>
        //     item[this.getCurFilterId(this.pageTitle)] !==
        //     row[this.getCurFilterId(this.pageTitle)]
        // );
        this.startRow=''
      } else {
        // console.log(this.operationState);
        // if(this.operationState ==1){
        //   if ([...new Set(this.$refs.todoTaskMultiple.store.states.selection.map(item => item.tltTypeId))].length >= 2) {
        //     this.$message.error('您必须选择相同时限类型进行核销');
        //     this.$refs.todoTaskMultiple.store.states.selection=this.$refs.todoTaskMultiple.store.states.selection.filter(item=>item.tltId!==row.tltId)
        //     row.plChoose=false
        //     //this.multipleSelection = this.multipleSelection.filter(item => item.tltId !== row.tltId)
        //     console.log(this.$refs.todoTaskMultiple.store.states.selection);
        //     return
        //   }
        // }
        this.startRow=row['tltId']
      }
      // if (!val.find(item => item.tltId === row.tltId)) {
      //   this.multipleSelection = this.multipleSelection.filter(item => item.tltId !== row.tltId)
      //   this.startRow=''
      // }
    },
    unique(data, key) {
      const hash = {};
      const data2 = data.reduce((preVal, curVal) => {
        hash[curVal[key]] ? '' : hash[curVal[key]] = true && preVal.push(curVal);
        return preVal
      }, [])
      return data2
    },
    getTimelimitList(num, initPosition = false){
      if(this.gridApi.clearRangeSelection){
        this.gridApi.clearRangeSelection()
      }
      this.exportQueryModel=''
      this.startRow=''
      this.lastRow=''
      this.queryModuleData = JSON.parse(localStorage.getItem('queryModuleData'))?JSON.parse(localStorage.getItem('queryModuleData')).find(item=>item.name==this.$route.name)?JSON.parse(localStorage.getItem('queryModuleData')).find(item=>item.name==this.$route.name).queryModuleData:JSON.parse(JSON.stringify(defaultqueryModuleData)):JSON.parse(JSON.stringify(defaultqueryModuleData))
      if(!this.queryModuleData.timelimitStateList){
        this.$set(this.queryModuleData,'timelimitStateList',[])
        this.queryModuleData.timelimitStateList=[]
      }
      if(this.operationState==1){
        this.queryModuleData.writeoffButton=1
      }else if(this.operationState==2){
        this.queryModuleData.audit=1
      }else{
        delete this.queryModuleData.writeoffButton
        delete this.queryModuleData.audit
      }
      this.queryModuleData.pageNo=this.listQuery.pageNo
      this.queryModuleData.pageSize=this.listQuery.pageSize
      this.listLoading = true
      this.$nextTick(()=>{
        this.exportQueryModel=JSON.stringify(this.queryModuleData)
      })
      if(num === 1 && (this.queryModuleData.timelimitState === 1 || this.queryModuleData.timelimitState === '') && this.queryModuleData.writeoffState){
        this.$confirm("请选择【时限状态】为【已核销】或【全部】", "提示", {
          confirmButtonText: "搜索",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.drawerState = false
          getTimelimitList(this.$commonUtils.cleanNullAttr(this.queryModuleData)).then(res=>{
            this.total=res.total
            this.listLoading = false
            res.data.forEach((item,index)=>{
              item.sid=index+1
            })
            this.timeLimitList= res.data || []
            !initPosition && setTimeout(()=>{
              this.gridApi.getFilterInstance('abslimitDate')&&this.gridApi.getFilterInstance('abslimitDate').getDiv(this.params)
               this.timeLimitList.length &&this.changePosition()
            }, 0)
            if(this.timeLimitList.length&&!this.caseDetail){
              this.getFilterModel()

            }
          })
        }).catch(() => {

        })
        return
      }
      this.drawerState = false
      // console.log(JSON.parse(JSON.stringify(this.queryModuleData)), '@@@')
      getTimelimitList(this.$commonUtils.cleanNullAttr(this.queryModuleData)).then(res=>{
        this.total=res.total
        this.listLoading = false
        res.data.forEach((item,index)=>{
          item.sid=index+1
        })
        this.timeLimitList= res.data || []
        !initPosition && setTimeout(()=>{
          this.gridApi.getFilterInstance('abslimitDate')&&this.gridApi.getFilterInstance('abslimitDate').getDiv(this.params)
          this.timeLimitList.length && this.changePosition()
        }, 0)


        // console.log(this.gridApi.getFilterInstance('abslimitDate') && this.gridApi.getFilterInstance('abslimitDate'));
        if(this.timeLimitList.length&&!this.caseDetail){
          this.getFilterModel()

        }
        // if (this.multipleSelection.length) {
        //   this.$nextTick(() => {
        //     this.multipleSelection.forEach(itm => {
        //       this.$refs.todoTaskMultiple.toggleRowSelection(this.timeLimitList.find(item => item.tltId === itm.tltId), true)
        //     })
        //   })
        // }
      })
    },

    changeTextRange(e) {
      this.$set(this.queryModuleData, 'agentNumEnd', e)
    },
    queryCustomerList(query){
      if(query !== ''){
        queryCustomerNameId({ pageNo: 1, pageSize: 100,keyword:query }).then(res=>{
          this.customerNameIdList=res.data
        })
      }
    },
    queryWorkgroupNames(){
      queryWorkgroupNames().then(res => {
        if (res.success) {
          this.queryWorkgroupNamesList = res.data
        }
      })
    },
    queryDeptGroup(){
      queryDeptGroup().then(res => {
        this.deptGroupList = res.data
      })
    },
    getTimelimitTypeAll(){
      getTimelimitTypeAll().then(res=>{
        this.getTimelimitTypeAllList=res.data
      })
    },
    timelimitState1(e){
      this.queryModuleData.timelimitStateList=[e[e.length-1]]
      if(this.queryModuleData.timelimitStateList&&this.queryModuleData.timelimitStateList[0]==='未核销'){
            this.queryModuleData.timelimitState=1
          }
          if(this.queryModuleData.timelimitStateList[0]&&this.queryModuleData.timelimitStateList[0]==='已核销'){
            this.queryModuleData.timelimitState=2
          }
          if(this.queryModuleData.timelimitStateList[0]&&this.queryModuleData.timelimitStateList[0]==='全部'){
            this.queryModuleData.timelimitState=0
          }
          if(!this.queryModuleData.timelimitStateList[0]){
            this.queryModuleData.timelimitState=''
          }
    },
    getWriteoffState() {
      getWriteoffState().then(res => {
        this.writeoffStateList = res.data
      })
    },
    takemodify(row) {
      if(this.caseDetail){
        this.modifyTitId = row.tltId
      this.timeLimitStateModify = true
      }else{
        this.$router.push(`/workbench/modifyTimeLimit/${row.tltId}`)
      }
    },
    takeSee(row) {
      if(!this.caseDetail){
        this.$router.push(`/workbench/seeTimeLimit/${row.tltId}`)
      }else{
        this.seeTltId = row.tltId
        this.timeLimitStateView = true
      }
    },
    takeExamine(row){
      // this.$refs.todoTaskMultiple.store.states.selection.forEach(item=>{
      //   if(item.tltId!=row.tltId) {
      //     item.plChoose = false
      //   }
      // })
      // this.$refs.todoTaskMultiple.store.states.selection=[row]
      //row.plChoose=true
      // this.$refs.todoTaskMultiple.toggleRowSelection([{ row: row ,selected: true}])
     // this.$refs.todoTaskMultiple.store.states.selection=[row]
      // this.timeLimitList.forEach(item=>{
      //   if(item.tltId!=row.tltId){
      //     this.$refs.todoTaskMultiple.toggleRowSelection(item ,false)
      //   }
      // })
      this.selectionState=false
      this.multipleSelection=[row]
      this.dialogVisible=true
      this.examineState=true

    },
    delTimelimit(row){
      this.$confirm('确定要删除该时限吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delTimelimit({tltId:row.tltId}).then(res=>{
          if(this.caseDetail){
            this.getCaseTimelimitList()
          } else {
            this.handleSearch()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    confirmExactButton(){
      if(!this.getSelectedRows().length){
        return
      }
      this.multipleSelection = this.getSelectedRows()
      if(this.operationState==1){
        this.examineState=false
        this.dialogVisible=true
      } else if (this.operationState == 2){
        this.dialogVisible=true
        this.examineState=true
      } else if (this.operationState == 3){
        this.selectionOptionState=true
       // this.examineState=true
      }
    },
    confirmExact(row){
      this.selectionState=false
      this.multipleSelection=[row]
      // this.$refs.todoTaskMultiple.store.states.selection.forEach(item=>{
      //   if(item.tltId!=row.tltId) {
      //     item.plChoose = false
      //   }
      // })
      // this.$refs.todoTaskMultiple.store.states.selection=[row]
      // row.plChoose=true
      this.examineState=false
      this.dialogVisible=true
    },
    headerDragend(newWidth, oldWidth, column, event){
      var arr=JSON.parse(localStorage.getItem('tableHeader'))
      var header=arr.find(item=>item.name==this.$options.name).tableHeader
      if (header.find(item=>item.label==column.label)){
        header.find(item=>item.label==column.label).width=newWidth
      }
      localStorage.setItem('tableHeader',JSON.stringify(arr))
    },
    getRowClassName({row, rowIndex}){
      if(this.selectionState){
        // if(new Set(this.$refs.todoTaskMultiple.store.states.selection).has(row)){
        //   return 'selectRow'
        // }

        if(row.plChoose){
          return 'selectRow'
        }
      }
    },
    getMinWidth(data){
      return String(data.label).replace(/[\u4E00-\u9FA5]/gi,'aa').length*12+30
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
    getWidth(data){
      let arr=[...[String(data.label).replace(/[\u4E00-\u9FA5]/gi,'aa').length],...this.timeLimitList.map(item => item[data.prop]).filter(item=>item).map(item=>String(item).replace(/[\u4E00-\u9FA5]/gi,'aa').length)]
      if(data.label.includes('日')||data.label.includes('号')) {
        return 150
      }
      // } else if (data.label.includes('号')||data.label.includes('客户')) {
      //   return Math.max(...arr)*11+20
      // }
      return 'auto'
    },
    getState(val){
      if(val==0||val==1){
        return '未核销'
      }else if(val==2){
        return '已核销'
      }
    },
    validTime(startTime,isSign){
      // if(isSign === 1) {
      //   return '#1AB55A'
      // }
      // if(isSign === 2) {
      //   return '#c9c9c9'
      // }
      // startTime=new Date(startTime).getTime()
      // var endTime = new Date().getTime()
      // var nextDay=new Date(formatDate(new Date(new Date().getTime() + 24*60*60*1000).toLocaleDateString())).getTime()
      // if(startTime<=nextDay&&startTime>endTime){
      //   return '#409EFF'
      // }
      // if(startTime<endTime) {
      //   return '#FB1E1E'
      // }
      // return '#333'
    },
    rowStyle({row, rowIndex}){
      var startTime=row.abslimitDate
      if(row.isSign === 1) {
        return {color:'#1AB55A'}
      }
      if(row.isSign === 2) {
        return {color:'#c9c9c9'}
      }
      startTime=new Date(startTime).getTime()
      var endTime = new Date().getTime()
      var nextDay=new Date(formatDate(new Date(new Date().getTime() + 24*60*60*1000).toLocaleDateString())).getTime()
      if(startTime<=nextDay&&startTime>endTime){
        return {color:'#131EEA'}
      }
      if(startTime<endTime) {
        return {color:'#FB1E1E'}
      }
      return {color:'#333'}
    },
    renderHeader (createElement, {column}) {
      return createElement(
        'div', {
          'class': ['thead-cell'],
          on: {
            mousedown: ($event) => { this.handleMouseDown($event, column) },
            mouseup: ($event) => { this.handleMouseUp($event, column) },
            mousemove: ($event) => { this.handleMouseMove($event, column) }
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
    // 按下鼠标开始拖动
    handleMouseDown (e, column) {
      if(e.target.parentNode.parentNode.childNodes[1]){
        e.target.parentNode.parentNode.childNodes[1].click()
      }
      this.dragState.dragging = true
      this.dragState.start = parseInt(column.columnKey)
      // 给拖动时的虚拟容器添加宽高
      let table = document.getElementsByClassName('w-table')[0]
      let virtual = document.getElementsByClassName('virtual')
      for (let item of virtual) {
        item.style.height = item.parentElement.clientHeight - 1 + 'px'
        item.style.width = item.parentElement.clientWidth  + 'px'
        item.style.left='10px'
        // item.innerText=item.parentElement.parentElement.innerText
      }
    },

// 鼠标放开结束拖动
    handleMouseUp (e, column) {
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
    handleMouseMove (e, column) {
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
    dragColumn ({start, end, direction}) {
      if(start==-1){
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
          tempData.push(this.tableHeader[ left ? i - 1 : i + 1 ])
        } else {
          tempData.push(this.tableHeader[i])
        }
      }
      if(start==end){
        return
      }
      this.tableHeader = tempData
      this.$refs.todoTaskMultiple.store.states.filters={}
      let arr=Array.from(this.$refs.todoTaskMultiple.$el.querySelectorAll('.is-sortable'))
      let classList = arr.map(item=>Array.from(item.classList).find(itm=>itm.includes('column')))
      this.$refs.todoTaskMultiple.store.states.columns.forEach(ii=>{
        ii.filteredValue=[]
      })
      this.tableHeader.forEach((item,index)=>{
        classList.forEach((itm,idx)=>{
          if(index==idx){
            this.$refs.todoTaskMultiple.store.states.filters[itm]=this.filterDataSum[item.label]
            this.$refs.todoTaskMultiple.store.states.columns.forEach(ii=>{
              if(ii.id==itm){
                ii.filteredValue=this.filterDataSum[item.label]
              }
            })
          }
        })
      })
    },
    filterChange(a){
      this.setTable()
      for (var key in a){
        this.tableHeader.forEach((item,index)=>{
          if(index==key){
            this.$set(this.filterDataSum,item.label,a[key])
            // this.filterDataSum[item.label]=a[key]
          }
        })
      }
    },
    setTable(){
      setTimeout(()=>{
        this.$nextTick(()=> {
          if (this.$refs.todoTaskMultiple.store.table.tableData.length < Math.ceil((this.clientHeight-40)/50)) {
            this.$refs.todoTaskMultiple.store.table.start = 0
            this.$set(this.$refs.todoTaskMultiple.store.table, 'end',  Math.ceil((this.clientHeight-40)/50))

            this.$refs.todoTaskMultiple.setHeight()
            //this.$refs.caseListMultiple.store.table.end=this.$refs.caseListMultiple.store.table.tableData.length-1
          } else {
            this.$refs.todoTaskMultiple.store.table.start = 0
            this.$set(this.$refs.todoTaskMultiple.store.table, 'end',this.$refs.todoTaskMultiple.store.table.start + Math.ceil((this.clientHeight-40)/50))
            this.$refs.todoTaskMultiple.setHeight()
          }
        })
      })
    },
    headerCellClassName ({column, columnIndex}) {
      // if(this.dragState.dragging){
      //   console.log(this.dragState.move,columnIndex);
      //   return (columnIndex - 1 === this.dragState.move ? `moveIng` : '')
      // }
      if(!this.selectionState){
        return (columnIndex - 1 === this.dragState.move ? `moveIng` : '')
      }else {
        return (columnIndex -2=== this.dragState.move ? `moveIng` : '')
      }

      //  return (columnIndex - 1 === this.dragState.move ? `darg_active_${this.dragState.direction}` : '')
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
          this.$nextTick(()=>{
            //  this.tableState=true
            // this.timeLimitList.push({})
            // this.timeLimitList.pop()
          })
        });
      }
      // this.selectColumnList=
      // console.log(this.selectColumnList);
      // this.savePreference(1)
    },
    getCellClassName({row, column, rowIndex, columnIndex}){
     if(column.label==='绝限日期'){
        return 'red'
      }
    },
    undateSearch(n){
      if(this.bussId==n.bussId){
        this.queryModuleData=JSON.parse(n.value)
        this.handleSearch(0)
      }
    }
  },
  watch:{
    tltTypeIdList:{
      handler(n){
        if(n.length){
          this.queryModuleData.tltTypeIdList = n
        }
      },
      immediate: true
    },
    changeTimeLimitView(n){
      if(!n){
        this.$set(this.timeLimitForm, 'workgroupArray', [])
        this.$set(this.timeLimitForm, 'watcherUserIdArray', [])
      }
    },
    timelimitInfo:{
      handler(n,o){
        if(this.timelimitInfo.planList&&this.timelimitInfo.planList.length){
          this.planList=JSON.parse(JSON.stringify(this.timelimitInfo.planList))
          this.planList.forEach((item, index)=>{
            if(item.remindOnce >= 0){
              this.$set(item,'cycleNotice',false)
            } else {
              this.$set(item,'cycleNotice',true)
            }
          })
        }
        this.rempId=this.timelimitInfo.rempId
      },
      deep:true,
      immediate:true
    },
    timeLimitState(n,o){
      if(!n){
        let allData = this.$refs['timeLimit']._data
          for(var key in allData){
            allData[key] = ''
          }
      }
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
    timeLimitState(n){
      if(!n){
        if(this.caseDetail){
          this.getCaseTimelimitList()
        }else {
          this.getTimelimitList()
        }
      }
    },
    'gridApi.rowModel.rootNode.allChildrenCount'(n){
     this.currentPageSize=n
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
    // 'queryModuleData.caseDateList'(n){
    //   console.log(123)
    //   this.queryModuleData.caseDateStart=n[0]
    //   this.queryModuleData.caseDateEnd=n[1]
    // },
    // 'queryModuleData.abslimitInternalDateList'(n){
    //   console.log(123)
    //   this.queryModuleData.abslimitInternalDateStart=n[0]
    //   this.queryModuleData.abslimitInternalDateEnd=n[1]
    // },
    // 'queryModuleData.writeoffDateList'(n){
    //   console.log(123)
    //   this.queryModuleData.writeoffDateStart=n[0]
    //   this.queryModuleData.writeoffDateEnd=n[1]
    // },
    // 'queryModuleDatac.sendDateList'(n){
    //   console.log(123)
    //   this.queryModuleData.sendDateStart=n[0]
    //   this.queryModuleData.sendDateEnd=n[1]
    // },
    // 'queryModuleData.abslimitDateList'(n){
    //   console.log(123)
    //   this.queryModuleData.abslimitDateStart=n[0]
    //   this.queryModuleData.abslimitDateEnd=n[1]
    // },
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
    // 'queryModuleData.timelimitStateList'(n){
    //   if(!n){
    //     return
    //   }
    //   if(n[0]&&n[0]==='未核销'){
    //     this.queryModuleData.timelimitState=1
    //   }
    //   if(n[0]&&n[0]==='已核销'){
    //     this.queryModuleData.timelimitState=2
    //   }
    //   if(n[0]&&n[0]==='全部'){
    //     this.queryModuleData.timelimitState=0
    //   }
    //   if(!n[0]){
    //     this.queryModuleData.timelimitState=''
    //   }
    // }
  },
  computed:{
    disabled1(){
      return this.queryModuleData.remindDateArray2&&this.queryModuleData.remindDateArray2.filter(Boolean).length || this.queryModuleData.remindDateArray3&&this.queryModuleData.remindDateArray3.filter(Boolean).length
    },
    disabled2(){
      return this.queryModuleData.remindDateArray1&&this.queryModuleData.remindDateArray1.filter(Boolean).length || this.queryModuleData.remindDateArray3&&this.queryModuleData.remindDateArray3.filter(Boolean).length
    },
    disabled3(){
      return this.queryModuleData.remindDateArray1&&this.queryModuleData.remindDateArray1.filter(Boolean).length || this.queryModuleData.remindDateArray2&&this.queryModuleData.remindDateArray2.filter(Boolean).length
    },
    clientHeight(){
      return  (document.documentElement.clientHeight-230)<580?580: (document.documentElement.clientHeight-230)
    },

    ...mapState({
      'pattern' : state => state.user.pattern
    }),
  },
  components:{
    TrademarkWritingDetail,
    SeeTimeLimit,
    ModifyTimeLimit,
    Pagination,DeferredCancellation,
    SelectOption,createTimeLimit,
    limitElectronicDocument,
    'seeCaseDetail': (resolve, reject) => {
      require(['@/views/workbench/case/components/ManualIdentification/seeCaseDetail.vue'], resolve)
    },
    ViewsSwitching,
    TimeLimitCalendar,
    RemindPlan,
    exportFile
  }
}
</script>

<style lang="scss" scoped>
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
  text-align: center;
  display: flex;
  justify-content: center;
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
  .button-group-search{
    position: relative;
    display: flex;
    .searchWrap{
      border-radius: 5px;
      top: 34px;
      left: 0;
      width: 550px;
      max-height: 500px;
      position: absolute;
      background: #ffffff;
      border: 1px solid #d4d5d5;
      z-index: 4;
      overflow: hidden;
      /*padding: 20px 0;*/
      box-shadow: 0 3px 6px rgba(111,111,111,0.2);
      /deep/  .el-form{
        padding: 20px 0 50px 0;
        .el-form-item__label{
          text-align: left;
          padding-left: 32px;
          font-weight: normal;
        }
        .el-form-item__content{
          display: flex;
          input{
            border-top: 0;
            border-left: 0;
            border-radius: 0;
            border-right: 0
          }
          .el-radio{
            line-height: 28px;
          }
        }
      }
      .clearWrap{
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
    border-top-right-radius:3px !important;
    border-bottom-right-radius:3px !important;
    padding:0 5px;
    height: 32px
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
  .noTrigger /deep/.el-table__column-filter-trigger{
    display: none;
  }
  .deffered /deep/ .el-dialog{
    max-height: 100vh;
  }
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
  .ViewsSwitching{
    position: absolute !important;
    right: 20px;
    z-index: 100;
    top: 5px;
  }
  .content_wrap{
    width: 100%;
    display: flex;
    backface-visibility: hidden;
    /*transition: all 1s;*/
    .left_wrap{
      position: relative;
      transition:all 0.5s;
      //   width: 40%;
    }
    .right_wrap{
      box-shadow: 0px 0px 18px 0px rgba(64, 158, 255,0.5);
      height: 598px;
      overflow: auto;
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
  /*/deep/ .ag-theme-balham .ag-row{*/
  /*  font-size: 14px;*/
  /*}*/
  /*/deep/ .ag-theme-balham .ag-row-selected{*/
  /*  background-color: #2981eb!important;*/
  /*}*/
  /*/deep/ .ag-theme-balham .ag-row-odd{*/
  /*  background-color: #e1f3ff;*/
  /*}*/
  /deep/ .ag-row-selected  .lightGreen{
    span{
      color: #40FF43!important;
    }
  }
  /deep/ .ag-row-selected .itemTitle_style{
    span{
      color: #fff!important;
    }
  }
  .timeLimitCalendar{
    position: absolute;
    top: 0;
    width: 100%;
    backface-visibility: hidden;
    /*transition: all 1s;*/
    transform: rotateY(180deg);
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
/*  提醒*/
  .virtual-select/deep/{
  .jh-virtual-select{
    height: auto;
    width: 100%;
  }
}
.el-row{
    .el-select,.el-input,.el-date-picker,.el-textarea{
        width: 95%;
      }
      min-height: 30px;
      width: 100%;
      display: flex;
     // align-items: center;
      .el-form-item{
        width: 100%;
        display: flex;
        border: 1px solid #EBEEF5;
        border-bottom: 0;
        margin-bottom: 0;
        /deep/ .el-form-item__label{
          background: #f5f7fa;
        }
        /deep/ .el-form-item__content{
          margin-left: 0 !important;
          padding-left: 10px;
          background: #fff;
          flex: 1;
        }

      }
      .sendDate /deep/{
        .el-form-item__label,input{
          color: blue;
        }
      }
      .abslimitDate /deep/{
        .el-form-item__label,input{
          color: red;
        }
      }
      .small-el-form-item-prev:before{
        content: '';
        width: 50%;
        height: 1px;
        background: #EBEEF5;
        position: absolute;
        bottom: -1px;
        right: 0;
        z-index: 1;
      }
      .small-el-form-item{
        position: relative;
        width: 50%;
        /deep/ .el-form-item__content{
          flex: 1;
          .pad20{
            padding-left: 20px;
          }
        }
      }
    }
.el-table{
  /*overflow: visible;*/
  /deep/ .cell{
    /*overflow: visible;*/

  }
  /deep/.el-date-editor{
    width: 100%;
    .el-icon-date{
      display: none;

    }
    .el-input__inner{
      padding: 0;
      padding-left: 10px;
    }
  }
  /deep/ .el-table__body-wrapper{
    /*overflow: visible;*/
  }
  /deep/ th{
    /*color: rgba(51, 51, 51, 1);*/

  }

}
  >>>.el-table__body{
    tr.current-row>td {
      background-color: #E1F3FF;
    }
  }
</style>
