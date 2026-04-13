<template>
  <div>
    <div v-if="onlyEdit3">
      <div class="box-border">
        <div class="timeDiv">
          <timer :formTime="JSON.parse(JSON.stringify(formTime))" :type="type"></timer>
        </div>
        <el-form size="small" class="form-container" label-width="130px">
          <el-row class="first-row">
            <el-col :span="12">
              <el-form-item label="活动类型:" class="postInfo-container-item" :class="{'requireForm': !formTime.agentNum}">
<!--                {{formTime.workTypeName}}-->
                <div style="display: flex">
                  <el-cascader
                    clearable
                    filterable
                    :show-all-levels="false"
                    v-model="workTypeList"
                    :options="activityKinds"
                    :props="defaultParams"
                    placeholder="请选择"
                    @change="changeWorkType"
                  ></el-cascader>
                  <el-popover
                    placement="top"
                    width="400"
                    trigger="hover"
                    :content="computedDesc">
                    <div v-show="computedDesc" slot="reference" style="line-height: 32px;font-size: 16px;margin-left: 5px;cursor:pointer;"
                         class="el-icon-info"></div>
                  </el-popover>

                </div>

              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="客户名称:" class="postInfo-container-item">
                {{formTime.custName}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="first-row" v-if="formTime.workType === 2069">
            <el-col :span="formTime.baifangType === '其他' ? 12 : 24">
              <el-form-item label="拜访方式:" class="postInfo-container-item">
                {{formTime.baifangType}}
              </el-form-item>
            </el-col>
            <el-col v-if="formTime.baifangType === '其他'" :span="12">
              <el-form-item label="其他说明:" class="postInfo-container-item">
                {{formTime.qitaDes}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="first-row" v-if="formTime.workType === 2071">
            <el-col :span="12">
              <el-form-item label="业务领域:" class="postInfo-container-item">
                {{formTime.bussDomain}}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item class="postInfo-container-item">
                <span slot="label">非定向或涉及<br>多客户开发</span>
                {{formTime.custmemo}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="first-row" @click.stop v-if="[2069, 2070, 2071].includes(formTime.workType)">
            <el-col :span="24">
              <el-form-item label="参与会议:" class="postInfo-container-item">
                {{formTime.title}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="first-row" v-if="formTime.workType" @click.stop>
            <el-col :span="12">
              <el-form-item label="内部参会人员:" class="postInfo-container-item">
                {{innerUserList1 && innerUserList1.map(item => item.fullname).join(',')}}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="客户联系人:" class="postInfo-container-item">
                {{custContactList1 && custContactList1.map(item => item.name).join(',')}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="first-row" v-if="!formTime.workType" @click.stop>
            <el-col :span="12" @click.stop>
              <el-form-item label="案件文号:" @click.stop class="postInfo-container-item requireForm settings">
                <el-popover
                    placement="bottom-start"
                    width="600"
                    trigger="focus"
                    v-model="agentVisible"
                    @click.stop
                >
                  <!-- <div style="max-height: 200px;overflow-y: auto">
                    <div @click="queryCaseInfo(item)" v-for="(item,index) in agentCaseLists" :key="index" class="tables"
                        style="display: flex;max-height: 100px;overflow-y: auto">
                      <div style="flex: 1;cursor: default;height: 30px;line-height: 30px;" class="overflow-hidden"
                          :class="{'table-head': item.agentNum == '案件文号'}" :title="item.agentNum">{{item.agentNum}}
                      </div>
                      <div style="flex: 1;cursor: default;height: 30px;line-height: 30px;" class="overflow-hidden"
                          :class="{'table-head': item.caseName == '案件名称'}" :title="item.caseName">{{item.caseName}}
                      </div>
                      <div style="flex: 1;cursor: default;height: 30px;line-height: 30px;" class="overflow-hidden"
                          :class="{'table-head': item.custName == '客户'}" :title="item.name||item.custName">
                        {{item.name||item.custName}}
                      </div>
                    </div>
                  </div> -->
                  <!-- 1234 -->
                  <div @click.stop class="agent-reference" style="max-height: 200px;overflow-y: auto;" ref="tablebox"  >
                    <div class="search-object"  style="position: absolute; top: -30px; left: 10px; z-index: 100;" v-if="tableSeacherVisible">
                      <el-input
                          placeholder="请输入"
                          v-model="inputContent"
                          clearable>
                        <el-button slot="append" icon="el-icon-search"  @click="twiceSearch"></el-button>
                      </el-input>
                    </div>
                    <el-table
                        @cell-click="queryCaseInfo"
                        @header-click="queryCaseOff"
                        :data="twiceData"
                        :row-style="{ 'height': '30px'}"
                        :header-cell-style="{'borderColor':'#cacaca','color': '#666','font-size': '14px', 'text-align':'center', 'height': '30px', 'padding': '0', 'background-color': '#f9f9f9', 'font-weight': '400'}"
                        :cell-style="{'borderColor':'#cacaca','text-align':'center', 'padding': '0','white-space':'nowrap', 'overflow':'hidden', 'text-overflow':'ellipsis'}"
                        highlight-current-row
                        ref="brlbtable"
                        style="width: 100%; border-color: #cacaca;"
                        border>
                      <el-table-column prop="agentNum" show-overflow-tooltip>
                        <template #header>
                          <div style="cursor:pointer;" @click="tableSeacherVisible=!tableSeacherVisible">
                            <span>案件文号</span>
                            <i class="el-icon-search"></i>
                          </div>
                        </template>
                      </el-table-column>
                      <el-table-column prop="caseName" label="案件名称" show-overflow-tooltip></el-table-column>
                      <el-table-column prop="name" label="客户" show-overflow-tooltip>
                        <template slot-scope="scope">
                          <span>{{ scope.row.name ? scope.row.name : scope.row.custName }}</span>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                  <el-input
                      placeholder="请输入案号"
                      clearable
                      slot="reference"
                      v-model="formTime.agentNum"
                      style="width: 84%"
                      v-debounce:autoSearchCase="'input',500"
                      @change.prevent="changeAgentNum"
                      @focus.prevent="(v)=>{queryHistoryList(v, 'agent')}"
                  ></el-input>
                </el-popover>

                <el-tooltip class="item-settings" style="margin-left: 20px;" effect="light" content="案件推荐规则" placement="top">
                  <el-dropdown @command="(command)=>{handleCommand(command)}" trigger="click">
                    <el-button class="item-settings-button" style="font-size: 22px; border: none;" icon="el-icon-setting" circle></el-button>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item v-for="item in menuItems" :key="item.value" :command="item.value" :class="{ 'is-active': item.value === ruleId }">{{ item.label }}</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </el-tooltip>

              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="案件名称:" class="postInfo-container-item">
                {{formTime.caseName}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="first-row">
            <el-col :span="12">
              <el-form-item label="工作日期:" class="postInfo-container-item">
                {{formTime.hourDate}}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="开始时间:" class="postInfo-container-item">
                {{formTime.beginDate}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="first-row">
            <el-col :span="12">
              <el-form-item label="工作时长:" class="postInfo-container-item" :class="{'requireForm': !formTime.workType}">
                <span :class="{'red-color': formTime.time&&+formTime.time.substring(0,2)>3}">{{formTime.time}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="结束时间:" class="postInfo-container-item">
                {{formTime.endDate}}
              </el-form-item>
            </el-col>
          </el-row>
          <template>
            <el-row class="first-row">
              <el-col :span="12">
                <el-form-item label="员工:" class="postInfo-container-item">
                  {{formTime.whUserName}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="员工角色:" class="postInfo-container-item">
                  {{formTime.roleName}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="first-row">
              <el-col :span="12">
                <el-form-item label="标准费率:" class="postInfo-container-item">
                  {{formTime.criterionRate}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="金额:" class="postInfo-container-item">
                  {{formTime.amount | formatAmount}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="first-row">
              <el-col
                :span="formTime.wfStatus === '未核销' && !formTime.workType ? 12 : 24">
                <el-form-item label="所属工作组:" class="postInfo-container-item">
                  {{formTime.groupName}}
                </el-form-item>
              </el-col>
              <el-col v-if="formTime.wfStatus === '未核销'"
                      :span="12">
                <el-form-item label="核定金额:" class="postInfo-container-item">
                  <span>{{formTime.approvedAmountCust | formatAmount}}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </template>
          <template v-if="(formTime.wfStatus === '待审核' || formTime.wfStatus === '未核销')">
            <el-row class="first-row">
              <el-col :span="12">
                <el-form-item label="核定工时:" class="postInfo-container-item">
                  <TimerComponent placeholder="请输入核定工时" @changeTime="changeAppCount(arguments, formTime)"
                                  v-model="formTime.approvedTime" :sign="true"></TimerComponent>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="核定费率:" class="postInfo-container-item">
                  {{formTime.billRate}}
                </el-form-item>
              </el-col>
            </el-row>
          </template>
          <el-row class="first-row" v-if="isWorkHourAdmin">
            <el-col :span="12" v-if="formTime.workType">
              <el-form-item label="发现商机:" class="postInfo-container-item">
                <span v-if="formTime.hasSj === 1">是</span>
                <span v-if="formTime.hasSj === 0">否</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="记录人:" class="postInfo-container-item requireForm">
                {{$store.getters.userList.find(item => item.userId === formTime.userId) &&
                $store.getters.userList.find(item => item.userId === formTime.userId).fullname || ""}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="first-row" v-else>
            <el-col :span="12" v-if="formTime.workType">
              <el-form-item label="发现商机:" class="postInfo-container-item">
                <span v-if="formTime.hasSj === 1">是</span>
                <span v-if="formTime.hasSj === 0">否</span>
              </el-form-item>
            </el-col>
            <el-col v-else :span="12" v-if="!formTime.workType">
              <el-form-item label="记录人:" class="postInfo-container-item requireForm">
                {{$store.getters.userList.find(item => item.userId === formTime.userId) &&
                $store.getters.userList.find(item => item.userId === formTime.userId).fullname || ""}}
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-form-item label="出差路途:" class="postInfo-container-item">
              {{formTime.hasBusinessTripStr}}
<!--              <el-checkbox v-model="formTime.hasBusinessTrip" disabled :true-label="1" :false-label="0"></el-checkbox>-->
            </el-form-item>
            <el-form-item label="关联项目:" class="postInfo-container-item">
              {{formTime.prjName}}
            </el-form-item>
          </el-row>
          <el-row v-if="formTime.workType">
            <el-form-item label="活动工时审核人:" class="postInfo-container-item">
              {{partnerList.find(item => item.userId === formTime.noCaseAuditUserId) &&
                partnerList.find(item => item.userId === formTime.noCaseAuditUserId).fullname || ""}}
            </el-form-item>
          </el-row>
          <div v-if="formTime.hasSj">
            <div class="divider">
          <span>
              商机线索
          </span>
            </div>
            <el-row>
              <el-table
                class="el-table1"
                :data="formTime.shangjiList"
                style="width: 99.5%;"
                border
              >
                <el-table-column label="领域" width="100px">
                  <template slot-scope="scope">
                    {{scope.row.domain}}
                  </template>
                </el-table-column>
<!--                <el-table-column label="客户联系人" width="200px">-->
<!--                  <template slot-scope="scope">-->
<!--                    {{scope.row.lxren}}-->
<!--                  </template>-->
<!--                </el-table-column>-->
<!--                <el-table-column label="联系方式" width="150px">-->
<!--                  <template slot-scope="scope">-->
<!--                    {{scope.row.lxfs}}-->
<!--                  </template>-->
<!--                </el-table-column>-->
                <el-table-column label="商机描述" width="auto">
                  <template slot-scope="scope">
                    {{scope.row.sjdesc}}
                  </template>
                </el-table-column>
              </el-table>
            </el-row>
          </div>
          <!--        <div v-if="formTime.feeDetais && formTime.feeDetais.length">-->
          <!--          <div class="divider">-->
          <!--            <span>-->
          <!--                关联费用-->
          <!--            </span>-->
          <!--          </div>-->
          <!--          <el-row>-->
          <!--            <el-table-->
          <!--              class="el-table1"-->
          <!--              :data="formTime.feeDetais"-->
          <!--              style="width: 99.5%;"-->
          <!--              border-->
          <!--              maxHeight="280"-->
          <!--            >-->
          <!--              <el-table-column label="费用科目" prop="feetStr" width="100">-->
          <!--              </el-table-column>-->
          <!--              <el-table-column label="费用名称" prop="feeName" width="120">-->
          <!--              </el-table-column>-->
          <!--              <el-table-column label="金额" prop="amount" width="70">-->
          <!--              </el-table-column>-->
          <!--              <el-table-column label="费用描述" prop="feeDesc" width="auto">-->
          <!--              </el-table-column>-->
          <!--              <el-table-column label="费用状态" prop="wfStatus" width="120">-->
          <!--              </el-table-column>-->
          <!--&lt;!&ndash;              <el-table-column label="操作" width="60px">&ndash;&gt;-->
          <!--&lt;!&ndash;                <template slot-scope="scope">&ndash;&gt;-->
          <!--&lt;!&ndash;                  <span class="pointer" @click="unBindFee(scope.row, scope.$index)">解绑</span>&ndash;&gt;-->
          <!--&lt;!&ndash;                </template>&ndash;&gt;-->
          <!--&lt;!&ndash;              </el-table-column>&ndash;&gt;-->
          <!--            </el-table>-->
          <!--          </el-row>-->
          <!--        </div>-->

          <div class="divider">
          <span class="require">
              工作描述
          </span>
          </div>
          <el-row style="border: none">
            {{formTime.workContent}}
          </el-row>
          <div v-if="(formTime.wfStatus === '待审核' || formTime.wfStatus === '未核销')">
            <div class="divider">
            <span class="">
                核定描述
            </span>
            </div>
            <el-row>
              <el-input type="textarea" v-model="formTime.approvedDesc" @input="handleQuoteReplace('approvedDesc')" :autosize="{ minRows: 4}"
                        placeholder="[核定描述]:"></el-input>
            </el-row>
          </div>
          <div v-if="(formTime.wfStatus === '待审核' || formTime.wfStatus === '未核销')">
            <div class="divider">
            <span class="">
                审核备注
            </span>
            </div>
            <el-row>
              <el-input maxlength="100" type="textarea" v-model="formTime.auditNote" :autosize="{ minRows: 4}"
                        placeholder="[审核备注]:"></el-input>
            </el-row>
          </div>
        </el-form>
        <div class="divider">
          <span class="">
              附件
          </span>
        </div>
        <div>
          <div v-for="(item, index) in fileList" @click="onPreview(item)" :key="index">
            <span class="pointer">{{item.materialName}}</span>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="box-border">
        <div class="timeDiv">
          <timer :formTime="JSON.parse(JSON.stringify(formTime))" :custRequre="custRequre" :projectId="projectId"
                 :type="type" @calcTime="calcTime" @closeTimer="() => closeDialog(false)"></timer>
        </div>
        <el-form size="small" class="form-container" label-width="130px" @click.stop>
          <el-row class="first-row">
            <el-col :span="12">
              <el-form-item label="活动类型:" class="postInfo-container-item" :class="{'requireForm': !formTime.agentNum}">
                <!--              <el-select clearable v-model="formTime.workType" @change="changeWorkType" style="width: 100%;"-->
                <!--                         placeholder="请选择">-->
                <!--                <el-option-->
                <!--                  v-for="item in activityKinds"-->
                <!--                  :key="item.workType"-->
                <!--                  :label="item.workTypeName"-->
                <!--                  :value="item.workType">-->
                <!--                </el-option>-->
                <!--              </el-select>-->
                <div style="display: flex">
                  <el-cascader
                    clearable
                    filterable
                    :show-all-levels="false"
                    v-model="workTypeList"
                    :options="activityKinds"
                    :props="defaultParams"
                    placeholder="请选择"
                    @change="changeWorkType"
                  >
                  </el-cascader>
                  <el-popover
                    placement="top"
                    width="400"
                    trigger="hover"
                    :content="computedDesc">
                    <div slot="reference" style="line-height: 32px;font-size: 16px;margin-left: 5px;cursor:pointer;"
                         class="el-icon-info"></div>
                  </el-popover>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="客户名称:" class="postInfo-container-item" :class="{requireForm: custRequre}">
                <el-popover
                  placement="bottom-start"
                  width="600"
                  trigger="manual"
                  v-model="shouldShowPopover"
                >
                  <div style="max-height: 200px;overflow-y: auto">
                    <div @click="changeCust(item)"  v-for="(item,index) in custList" :key="index" class="tables"
                         style="display: flex;max-height: 100px;overflow-y: auto">
                      <div style="flex: 1;cursor: default;height: 30px;line-height: 30px;" class="overflow-hidden"
                           :title="item.fullname"
                           :class="{'table-head': item.fullname == '全称'}">{{item.fullname}}
                      </div>
                      <div style="flex: 1;cursor: default;height: 30px;line-height: 30px;" class="overflow-hidden"
                           :class="{'table-head': item.name == '简称'}" :title="item.name">{{item.name}}
                      </div>
                      <div style="flex: 1;cursor: default;height: 30px;line-height: 30px;" class="overflow-hidden"
                           :class="{'table-head': item.status == '状态'}">{{item.status ? item.status : item.custId ?
                        '已存在':'不存在'}}
                      </div>
                      <!--                    <el-tooltip :content="item.name||item.custName" placement="top" effect="light">-->
                      <!--                      <div style="flex: 1;cursor: default;height: 30px;line-height: 30px;" class="overflow-hidden"-->
                      <!--                           :class="{'table-head': item.custName == '客户'}">{{item.name||item.custName}}-->
                      <!--                      </div>-->
                      <!--                    </el-tooltip>-->
                    </div>
                  </div>
                  <el-input placeholder="请输入客户名称" :clearable="true"  slot="reference" v-model="formTime.custName"
                            @input="(v)=>debounce((v) => remoteQueryCust(v), 500)(v)"
                            @blur="()=>custBlur()"
                            @focus="(v)=>{custVisible = true}"
                            @clear="(v)=>{custList = []}"
                            @keyup.enter.native="inputEnter"></el-input>
                </el-popover>
                <div v-show="noMatch"
                     style="font-size: 12px!important;color: #E6A23C;height: 16px;line-height: 16px;">客户不存在，将创建新客户
                </div>
                <div v-show="shouldShowPopover"
                     style="font-size: 12px!important;color: #E6A23C;height: 16px;line-height: 16px;">请选择客户
                </div>
                <!--              <el-select v-model="formTime.custId" clearable style="width: 100%;" default-first-option-->
                <!--                         :clearable='true' no-match-text='暂无数据'-->
                <!--                         loading-text='正在查询' filterable remote reserve-keyword placeholder="请输入关键词"-->
                <!--                         :remote-method="(q) => remotepaternalUnit(q)" @change="changeCust" :allow-create="false">-->
                <!--                <el-option v-for="item in custList" :key="item.custId" :label="item.fullname"-->
                <!--                           :value="item.custId">-->
                <!--                </el-option>-->
                <!--              </el-select>-->
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="first-row" v-if="formTime.workType === 2069">
            <el-col :span="formTime.baifangType === '其他' ? 12 : 24">
              <el-form-item label="拜访方式:" class="postInfo-container-item">
                <el-select clearable class="select-input"
                           v-model="formTime.baifangType" placeholder="请选择">
                  <el-option
                    v-for="item in ['客户来访', '我方拜访', '其他']"
                    :key="item"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col v-if="formTime.baifangType === '其他'" :span="12">
              <el-form-item label="其他说明:" class="postInfo-container-item">
                <el-input size="small" v-model="formTime.qitaDes"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="first-row" v-if="formTime.workType === 2071">
            <el-col :span="12">
              <el-form-item label="业务领域:" class="postInfo-container-item">
                <el-select clearable class="select-input" multiple
                           v-model="formTime.bussDomainList" placeholder="请选择">
                  <el-option
                    v-for="item in ['商标', '专利', '其他', '不确定']"
                    :key="item"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item class="postInfo-container-item">
                <span slot="label">非定向或涉及<br>多客户开发</span>
                <el-input type="textarea" :autosize="{ minRows: 1}" size="small" placeholder="请填写情况说明"
                          v-model="formTime.custmemo"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="first-row" @click.stop v-if="[2069, 2070, 2071].includes(formTime.workType)">
            <el-col :span="24">
              <el-form-item label="参与会议:" class="postInfo-container-item">
                <el-select clearable class="select-input"
                           remote
                           filterable
                           :remote-method="queryRecentMeetingList"
                           v-model="formTime.meId" placeholder="请选择">
                  <el-option
                    v-for="item in recentMeetingList"
                    :key="item.meId"
                    :label="item.title"
                    :value="item.meId">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="first-row" v-if="formTime.workType" @click.stop>
            <el-col :span="12">
              <el-form-item label="内部参会人员:" class="postInfo-container-item">
                <virtual-select
                  placeholder="请选择内部参会人"
                  class="virtual-select"
                  multiple
                  :isUser="true"
                  clearable
                  :data="$store.getters.userList"
                  v-model="formTime.innerUserList"
                  filterable
                  :render="(data)=>$commonUtils.UserRender(data, this)">
                </virtual-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="客户联系人:" class="postInfo-container-item">
                <el-select  multiple v-model="formTime.custContactList"  filterable remote clearable  placeholder="请输入关键词" :remote-method="(queryString)=>{
              remoteCustContactMethod(queryString); }">
                  <el-option disabled label="" value="-1">
                          <span v-for="(itmx,key) in getAppTitleList()" v-if="key!='id'">
                          {{itmx}}
                          </span>
                  </el-option>
                  <el-option v-for="(itm,idx) in custContactList" :key="idx" :label="itm.value" :value="itm.id">
                    <el-tooltip v-for="(itmx,key) in custContactList[idx]" v-if="key!='id'" :key="key" class="item" effect="light" :content="itmx" placement="top">
                      <span v-if="key === 'value'">{{itmx}}</span>
                      <span v-if="key === 'value1'" @click.stop>
                        <span v-if="custContactList[idx].value2 === '已存在'">{{itmx}}</span>
                        <el-input v-else v-model="custContactList[idx].value1" placeholder="请输入"></el-input>
                      </span>
                      <span v-if="key === 'value2'">{{itmx}}</span>
                    </el-tooltip>
                  </el-option>
                </el-select>
                <div v-show="formTime.custContactList && formTime.custContactList.find(item => typeof item === 'string')"
                     style="font-size: 12px!important;color: #E6A23C;height: 16px;line-height: 16px;">部分客户联系人不存在，将自动创建
                </div>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row class="first-row" v-if="!formTime.workType" @click.stop>
            <el-col :span="12" @click.stop>
              <el-form-item label="案件文号:" @click.stop class="postInfo-container-item requireForm settings">
                  <el-popover
                    placement="bottom-start"
                    width="600"
                    trigger="focus"
                    v-model="agentVisible"
                    @click.stop
                  >
                    <!-- <div style="max-height: 200px;overflow-y: auto">
                      <div @click="queryCaseInfo(item)" v-for="(item,index) in agentCaseLists" :key="index" class="tables"
                          style="display: flex;max-height: 100px;overflow-y: auto">
                        <div style="flex: 1;cursor: default;height: 30px;line-height: 30px;" class="overflow-hidden"
                            :class="{'table-head': item.agentNum == '案件文号'}" :title="item.agentNum">{{item.agentNum}}
                        </div>
                        <div style="flex: 1;cursor: default;height: 30px;line-height: 30px;" class="overflow-hidden"
                            :class="{'table-head': item.caseName == '案件名称'}" :title="item.caseName">{{item.caseName}}
                        </div>
                        <div style="flex: 1;cursor: default;height: 30px;line-height: 30px;" class="overflow-hidden"
                            :class="{'table-head': item.custName == '客户'}" :title="item.name||item.custName">
                          {{item.name||item.custName}}
                        </div>
                      </div>
                    </div> -->
                    <!-- 1234 -->
                    <div @click.stop class="agent-reference" style="max-height: 200px;overflow-y: auto;" ref="tablebox"  >
                      <div class="search-object"  style="position: absolute; top: -30px; left: 10px; z-index: 100;" v-if="tableSeacherVisible">
                                    <el-input
                                      placeholder="请输入"
                                      v-model="inputContent"
                                      clearable>
                                      <el-button slot="append" icon="el-icon-search"  @click="twiceSearch"></el-button>
                                    </el-input>
                                </div>
                      <el-table
                        @cell-click="queryCaseInfo"
                        @header-click="queryCaseOff"
                        :data="twiceData"
                        :row-style="{ 'height': '30px'}"
                        :header-cell-style="{'borderColor':'#cacaca','color': '#666','font-size': '14px', 'text-align':'center', 'height': '30px', 'padding': '0', 'background-color': '#f9f9f9', 'font-weight': '400'}"
                        :cell-style="{'borderColor':'#cacaca','text-align':'center', 'padding': '0','white-space':'nowrap', 'overflow':'hidden', 'text-overflow':'ellipsis'}"
                        highlight-current-row
                        ref="brlbtable"
                        style="width: 100%; border-color: #cacaca;"
                        border>
                        <el-table-column prop="agentNum" show-overflow-tooltip>
                          <template #header>
                            <div style="cursor:pointer;" @click="tableSeacherVisible=!tableSeacherVisible">
                              <span>案件文号</span>
                              <i class="el-icon-search"></i>
                            </div>
                          </template>
                        </el-table-column>
                        <el-table-column prop="caseName" label="案件名称" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="name" label="客户" show-overflow-tooltip>
                          <template slot-scope="scope">
                            <span>{{ scope.row.name ? scope.row.name : scope.row.custName }}</span>
                          </template>
                        </el-table-column>
                      </el-table>
                    </div>
                    <el-input
                        placeholder="请输入案号"
                        clearable
                        slot="reference"
                        v-model="formTime.agentNum"
                        style="width: 84%"
                        v-debounce:autoSearchCase="'input',500"
                        @change.prevent="changeAgentNum"
                        @focus.prevent="(v)=>{queryHistoryList(v, 'agent')}"
                      ></el-input>
                  </el-popover>

                  <el-tooltip class="item-settings" style="margin-left: 20px;" effect="light" content="案件推荐规则" placement="top">
                    <el-dropdown @command="(command)=>{handleCommand(command)}" trigger="click">
                      <el-button class="item-settings-button" style="font-size: 22px; border: none;" icon="el-icon-setting" circle></el-button>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item v-for="item in menuItems" :key="item.value" :command="item.value" :class="{ 'is-active': item.value === ruleId }">{{ item.label }}</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </el-tooltip>

              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="案件名称:" class="postInfo-container-item">
                <el-popover
                  placement="bottom-start"
                  width="600"
                  trigger="manual"
                  v-model="visible"
                >
                  <div style="max-height: 200px;overflow-y: auto">
                    <div @click="queryCaseInfo(item)" v-for="(item,index) in nameCaseLists" :key="index" class="tables"
                         style="display: flex;max-height: 100px;overflow-y: auto">
                      <div style="flex: 1;cursor: default;height: 30px;line-height: 30px;" class="overflow-hidden"
                           :class="{'table-head': item.agentNum == '案件文号'}" :title="item.agentNum">{{item.agentNum}}
                      </div>
                      <div style="flex: 1;cursor: default;height: 30px;line-height: 30px;" class="overflow-hidden"
                           :class="{'table-head': item.caseName == '案件名称'}" :title="item.caseName">{{item.caseName}}
                      </div>
                      <div style="flex: 1;cursor: default;height: 30px;line-height: 30px;" class="overflow-hidden"
                           :class="{'table-head': item.custName == '客户'}" :title="item.name||item.custName">
                        {{item.name||item.custName}}
                      </div>
                    </div>
                  </div>
                  <el-input placeholder="请输入案件名称" clearable slot="reference" v-model="formTime.caseName"
                            @input="(v)=>{useHistoryList(v,'name')}" @focus="queryHistoryList" @blur="loseFocus"
                            @keyup.enter.native="queryCaseList"></el-input>
                </el-popover>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="first-row">
            <el-col :span="12">
              <el-form-item label="工作日期:" class="postInfo-container-item requireForm">
                <el-date-picker
                  placeholder="请选择工作日期"
                  v-model="formTime.hourDate"
                  type="date"
                  value-format="yyyy-MM-dd"
                  :clearable="false"
                  :picker-options="pickerOptions"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="开始时间:" class="postInfo-container-item">
                <TimerComponent placeholder="请输入开始时间" style="width:100%" v-model="formTime.beginDate"
                                @change="computedTime"
                                :sign="false"></TimerComponent>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="first-row">
            <el-col :span="12">
              <el-form-item label="工作时长:" @changeTime="changeTime(arguments, formTime)"
                            class="postInfo-container-item requireForm" :class="{'requireForm': !formTime.workType}">
                <TimerComponent placeholder="00:00" v-model="formTime.time" :sign="true"></TimerComponent>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="结束时间:" class="postInfo-container-item">
                <TimerComponent placeholder="请输入结束时间" style="width:100%" v-model="formTime.endDate"
                                @change="computedTime"
                                :sign="false"></TimerComponent>
              </el-form-item>
            </el-col>
          </el-row>
          <template v-if="type !== 'create'">
            <el-row class="first-row">
              <el-col :span="12">
                <el-form-item label="员工:" class="postInfo-container-item">
                  {{formTime.whUserName}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="员工角色:" class="postInfo-container-item">
                  {{formTime.roleName}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="first-row">
              <el-col :span="12">
                <el-form-item label="标准费率:" class="postInfo-container-item">
                  {{formTime.criterionRate}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="金额:" class="postInfo-container-item">
                  {{formTime.amount | formatAmount}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="first-row">
              <el-col :span="(type === 'audit' || formTime.wfStatus === '未核销') && !formTime.workType ? 12 : 24">
                <el-form-item label="所属工作组:" class="postInfo-container-item">
                  <el-select allow-create filterable clearable class="select-input"
                             v-model="formTime.wkgId" placeholder="请选择">
                    <el-option
                      v-for="item in groupList"
                      :key="item.wkgId"
                      :label="item.groupName"
                      :value="item.wkgId">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col v-if="(type === 'audit' || formTime.wfStatus === '未核销')" :span="12">
                <el-form-item label="核定金额:" class="postInfo-container-item">
                  <span>{{formTime.approvedAmountCust | formatAmount}}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </template>
          <template v-if="(type === 'audit' || formTime.wfStatus === '未核销')">
            <el-row class="first-row">
              <el-col :span="12">
                <el-form-item label="核定工时:" class="postInfo-container-item">
                  <TimerComponent placeholder="请输入核定工时" @changeTime="changeAppCount(arguments, formTime)"
                                  v-model="formTime.approvedTime" :sign="true"></TimerComponent>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="核定费率:" class="postInfo-container-item">
                  <el-input size="small" v-model="formTime.billRate" @input="(v)=>{changeMoney(v,formTime)}"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </template>
          <el-row class="first-row" v-if="isWorkHourAdmin">
            <el-col :span="12" v-if="formTime.workType">
              <el-form-item label="发现商机:" class="postInfo-container-item">
                <el-radio-group v-model="formTime.hasSj">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="记录人:" class="postInfo-container-item requireForm">
                <virtual-select
                  placeholder="请选择记录人"
                  class="virtual-select"
                  :isUser="true"
                  clearable
                  :data="$store.getters.userList"
                  v-model="formTime.userId"
                  filterable
                  :render="(data)=>$commonUtils.UserRender(data, this)">
                </virtual-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="first-row" v-else>
            <el-col :span="12" v-if="formTime.workType">
              <el-form-item label="发现商机:" class="postInfo-container-item">
                <el-radio-group v-model="formTime.hasSj">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col v-else :span="12" v-if="!(type === 'create' && formTime.workType)">
              <el-form-item label="记录人:" class="postInfo-container-item requireForm">
                <virtual-select
                  placeholder="请选择记录人"
                  class="virtual-select"
                  :isUser="true"
                  clearable
                  :disabled="type !== 'create'"
                  :data="$store.getters.userList"
                  v-model="formTime.userId"
                  filterable
                  :render="(data)=>$commonUtils.UserRender(data, this)">
                </virtual-select>
                <!--              <el-select style="width: 100%;" v-model="formTime.userId" filterable clearable-->
                <!--                         :disabled="type !== 'create'" placeholder="请选择记录人">-->
                <!--                <el-option-->
                <!--                  v-for="item in $store.getters.userList"-->
                <!--                  :key="item.userId"-->
                <!--                  :label="item.fullname"-->
                <!--                  :value="item.userId">-->
                <!--                  <UserIconAndUserName :user-id="item.userId"></UserIconAndUserName>-->
                <!--                </el-option>-->
                <!--              </el-select>-->
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="first-row" v-if="type === 'create'">
            <el-form-item label="所属工作组:" class="postInfo-container-item">
              <el-select filterable clearable class="select-input"
                         v-model="formTime.wkgId" placeholder="请选择">
                <el-option
                  v-for="item in groupList"
                  :key="item.wkgId"
                  :label="item.groupName"
                  :value="item.wkgId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item class="postInfo-container-item" label="出差路途:">
                <el-checkbox v-model="formTime.hasBusinessTrip" :true-label="1" :false-label="0"></el-checkbox>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item class="postInfo-container-item" label="关联项目:">
                <el-select
                  clearable
                  v-model="formTime.projectId"
                  filterable
                  reserve-keyword
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in projectList"
                    :key="item.projectId"
                    :label="item.prjName"
                    :value="item.projectId"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="formTime.workType">
            <el-col :span="24">
              <el-form-item class="postInfo-container-item" label="活动工时审核人:" :class="[!isPartner ? 'requireForm' : '']">
                <el-select v-model="formTime.noCaseAuditUserId" filterable clearable placeholder="请选择">
                  <el-option
                    v-for="item in partnerList"
                    :key="item.userId"
                    :label="item.fullname"
                    :value="item.userId">
                    <UserIconAndUserName :user-id="item.userId"></UserIconAndUserName>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <div v-if="formTime.hasSj">
            <div class="divider">
          <span>
              商机线索
          </span>
            </div>
            <el-row>
              <el-table
                class="el-table1"
                :data="formTime.shangjiList"
                style="width: 99.5%;"
                border
                maxHeight="280"
              >
                <el-table-column label="领域" width="100px">
                  <template slot-scope="scope">
                    <el-select size="mini" default-first-option v-model="scope.row.domain" placeholder="领域" filterable
                               clearable>
                      <el-option
                        v-for="itm in domainList"
                        :key="itm"
                        :label="itm"
                        :value="itm">
                      </el-option>
                    </el-select>
                  </template>
                </el-table-column>
<!--                <el-table-column label="客户联系人" width="200px">-->
<!--                  <template slot-scope="scope">-->
<!--                    <el-autocomplete-->
<!--                      size="mini"-->
<!--                      class="inline-input"-->
<!--                      v-model="scope.row.lxren"-->
<!--                      :fetch-suggestions="querySearch"-->
<!--                      placeholder="客户联系人"-->
<!--                      @select="(item) => handleSelect(item, scope.row)"-->
<!--                    ></el-autocomplete>-->
<!--                    &lt;!&ndash;                  <el-input size="mini" v-model="scope.row.lxren"></el-input>&ndash;&gt;-->
<!--                  </template>-->
<!--                </el-table-column>-->
<!--                <el-table-column label="联系方式" width="150px">-->
<!--                  <template slot-scope="scope">-->
<!--                    <el-input placeholder="请输入联系方式" size="mini" v-model="scope.row.lxfs"></el-input>-->
<!--                  </template>-->
<!--                </el-table-column>-->
                <el-table-column label="商机描述" width="auto">
                  <template slot-scope="scope">
                    <el-input placeholder="请输入商机描述" type="textarea" :autosize="{ minRows: 1}" size="mini"
                              v-model="scope.row.sjdesc"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="100px">
                  <template slot-scope="scope">
                    <el-button size="mini" type="primary" icon="el-icon-plus" circle @click="addData"></el-button>
                    <el-button size="mini" type="danger" icon="el-icon-minus" circle
                               @click="deleteData(scope.$index)"></el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-row>
          </div>

          <!--        <div v-if="formTime.feeDetais && formTime.feeDetais.length">-->
          <!--          <div class="divider">-->
          <!--            <span>-->
          <!--                关联费用-->
          <!--            </span>-->
          <!--          </div>-->
          <!--          <el-row>-->
          <!--            <el-table-->
          <!--              class="el-table1"-->
          <!--              :data="formTime.feeDetais"-->
          <!--              style="width: 99.5%;"-->
          <!--              border-->
          <!--              maxHeight="280"-->
          <!--            >-->
          <!--              <el-table-column label="费用科目" prop="feetStr" width="100">-->
          <!--              </el-table-column>-->
          <!--              <el-table-column label="费用名称" prop="feeName" width="120">-->
          <!--              </el-table-column>-->
          <!--              <el-table-column label="金额" prop="amount" width="70">-->
          <!--              </el-table-column>-->
          <!--              <el-table-column label="费用描述" prop="feeDesc" width="auto">-->
          <!--              </el-table-column>-->
          <!--              <el-table-column label="费用状态" prop="wfStatus" width="120">-->
          <!--              </el-table-column>-->
          <!--              <el-table-column label="操作" width="60px">-->
          <!--                <template slot-scope="scope">-->
          <!--                  <span class="pointer" @click="unBindFee(scope.row, scope.$index)">解绑</span>-->
          <!--                </template>-->
          <!--              </el-table-column>-->
          <!--            </el-table>-->
          <!--          </el-row>-->
          <!--        </div>-->

          <div class="divider">
          <span class="require">
              工作描述
          </span>
          </div>
          <el-row style="width: 100%;border-bottom: none">
            <el-popover style="width: 100%;" class="inputshow" placement="bottom" trigger="click" v-model="contentShow">
              <el-table size="mini" @row-click="
                              val => {
                                fwtableClick(val);
                              }
                            " :data="gridData" style="height:250px;overflow: scroll;">
                <el-table-column width="500" property="nameCn" label="工作描述"></el-table-column>
                <!--                            <el-table-column width="300" property="nameEn" label="工作内容(英文)"></el-table-column>-->
              </el-table>
              <el-input style="width: 100%;" slot="reference" v-debounce:searchContent="'input',500" type="textarea"
                        v-model="formTime.workContent"
                        :autosize="{ minRows: 4}"
                        placeholder="[工作描述]:"></el-input>
            </el-popover>
          </el-row>

          <div v-if="(type === 'audit' || formTime.wfStatus === '未核销')">
            <div class="divider">
            <span class="">
                核定描述
            </span>
            </div>
            <el-row>
              <el-input type="textarea" v-model="formTime.approvedDesc" @input="handleQuoteReplace('approvedDesc')" :autosize="{ minRows: 4}"
                        placeholder="[核定描述]:"></el-input>
            </el-row>
          </div>
          <div v-if="(formTime.wfStatus === '待审核' || formTime.wfStatus === '未核销')">
            <div class="divider">
            <span class="">
                审核备注
            </span>
            </div>
            <el-row>
              <el-input maxlength="100" type="textarea" v-model="formTime.auditNote" :autosize="{ minRows: 4}"
                        placeholder="[审核备注]:"></el-input>
            </el-row>
          </div>
        </el-form>
        <div>
          <el-upload
            name="attachFile"
            :data="uploadFileData"
            :action="creatematerialUrl"
            :on-preview="onPreview"
            :on-remove="brforeRemoveFile"
            :on-success="successCallback"
            :auto-upload="true"
            multiple
            :file-list="fileList">
            <div class="upload-btn">
              <span class="el-icon-plus"></span>
              <span>上传附件</span>
            </div>
          </el-upload>
        </div>

      </div>
    </div>
    <div class="fl-ac-jc">
      <el-button size="small" style="width: 100px;margin-right: 0px" @click="() => closeDialog(false)">取 消</el-button>
      <template v-if="type === 'audit'">
        <el-button size="small" style="width: 100px;" type="primary" @click="auditWorkTime(1)">通过</el-button>
        <!--        <el-button size="small" style="width: 100px;" type="primary" @click="auditWorkTime(2)">不通过</el-button>-->
      </template>
      <el-button v-if="type === 'create'" type="primary" size="small" style="width: 100px;" @click="submitWorkHour">确
        定
      </el-button>
      <el-button v-if="type === 'edit'" type="primary" size="small" style="width: 100px;" @click="editWorkHour">确 定
      </el-button>
    </div>
  </div>
</template>

<script>
  import WorkTimeTips from "@/views/workbench/toDoTasks/components/WorkTimeTips.vue";
  import { creatematerialUrl } from "@/api/serviceApi.config.js";
  import {
    addTaskHours, auditWorkHours,
    decFile,
    deleteFile,
    getCaseHistory, modifyTaskHours, queryActiveWorkgroupBossUserList, queryIfHehuoren, queryList,
    queryRecentCase, querySimilarCustomer, queryWorkHours,
    queryWorkType, queryCustGroupByCaseId, queryRecentMeeting, queryProjectList
  } from '../../../../api/caseList'
  import { queryCustomerContactListUrl, queryCustomerNameIdUrl } from '../../../../api/customerList'
  import {delCaseMaterialUrl, queryCaseWorkgroupUrl, queryCustomerContactByCustIdUrl} from "../../../../api/caseDetail";
  import {getProgID} from "../../../../utils/editInOffice";
  import {queryChargeItemBynameCnUrl} from "../../../../api/billApi";
  import {unbindWorkHour} from "../../../../api/feeList";
  import Timer from "./Timer";
  import {queryChargeItemList, queryWorkByUserId} from "../../../../api/systemList";

  export default {
    name: "CreateWorkHour",
    components: {Timer,WorkTimeTips},
    props: {
      hoursId: {},
      type: {
        type: String,
        default: 'create'
      },
      caseData: {},
      projectId: {},
      noQuery: ''
    },
    watch: {
      "formTime.custId": {
        handler(v) {
          if (!v) {
            this.custContactList = []
            this.$set(this.formTime, 'custContactList', [])
          }
        },
        immediate: true
      },
      "formTime.bussDomainList": {
        handler(n) {
          this.formTime.bussDomain = n.join(',')
        }
      },
      "formTime.agentNum": {
        handler(n) {
          if (n) {
            this.twiceData = this.agentCaseLists.filter((item) => {
              return item.agentNum.includes(n)
            });
          } else {
            this.handleCommand(1)
            this.twiceData = this.agentCaseLists;
          }
        }
      },
      "formTime.noCaseAuditUserId": {
        handler(n) {
          if(n && this.partnerList.find(item => item.userId == n)){
            this.formTime.wkgId = this.partnerList.find(item => item.userId == n).wkgId
          }
        }
      },
      "formTime.custName": {
        handler(newVal) {
          if (!newVal) {
            this.noMatch = false
          }
        },
        immediate: true
      },
      inputContent() { this.twiceSearch() },
            // 观察 custVisible 和 custList.length 的变化
            'custVisible'(newVal) {
        // 如果 custVisible 发生变化，同时 custList.length > 1，则更新 shouldShowPopover
        this.shouldShowPopover = newVal && this.custList.length > 1;
      },
      'custList.length'(newVal) {
        // 如果 custList.length 发生变化，重新评估 shouldShowPopover
        this.shouldShowPopover = this.custVisible && newVal > 1;
      },
    },
    computed: {
      computedDesc() {
        return this.formTime.workType && this.activityKinds.length && this.$commonUtils.extractTree(this.activityKinds, 'childrens', ['workType', 'workTypeName', 'memo']).find(item => item.workType === this.formTime.workType) && this.$commonUtils.extractTree(this.activityKinds, 'childrens', ['workType', 'workTypeName', 'memo']).find(item => item.workType === this.formTime.workType).memo || ''
      },
      isWorkHourAdmin() {
        return this.$store.state.user.roles.find(item => item.name === '工时管理员')
      },
      custRequre() {
        return this.formTime.workType && this.activityKinds.length && this.$commonUtils.extractTree(this.activityKinds, 'childrens', ['workType', 'workTypeName', 'hdFlag']).find(item => item.workType === this.formTime.workType) && this.$commonUtils.extractTree(this.activityKinds, 'childrens', ['workType', 'workTypeName', 'hdFlag']).find(item => item.workType === this.formTime.workType).hdFlag == 9
      }
    },
    data() {
      return {
        projectList: [],
        noMatch:false,
        shouldShowPopover:false,
        innerUserList1: [],
        custContactList1:[],
        custContactList: [],
        recentMeetingList: [],
        menuItems: [
          { label: '最近记录工时', value: 1 },
          { label: '最近立案', value: 2 },
          { label: '最近处理', value: 3 }
        ],
        rowHeight: 30,
        inputContent: '',
        twiceData: [],
        ruleId: localStorage.getItem('value') ? localStorage.getItem('value') - 0 : 1,
        nowIndex:0,
        onlyEdit3: false,
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now() || time.getTime() < Date.now() - 6 * 24 * 60 * 60 * 1000;
          },
        },
        tagList: [],
        workTypeList: [],
        defaultParams: { // 級聯菜單默認
          value: 'workType',
          label: 'workTypeName',
          children: 'childrens',
          checkStrictly: true
        },
        workUserList: [],
        gridData: [],
        defaultGridData: [],
        contentShow: false,
        groupList: [],
        timer: null,
        uploadFileData: {
          tokenID: this.$store.getters.token,
          hoursFile: 1
        },
        creatematerialUrl,
        fileList: [],
        nameCaseLists: [],
        custList: [{'fullname': '全称', 'name': '简称', 'status': '状态'}],
        historyList: [],
        visible: false,
        custVisible: false,
        agentVisible: false,
        tableSeacherVisible: false, // 表格搜索控制
        agentCaseLists: [],
        domainList: ['保护', '诉讼', '商标', '专利', '域名', '著作权', '非诉', '无'],
        formTime: {
          custmemo: '',
          noCaseAuditUserId: '',
          hasBusinessTrip: 0,
          bussDomainList: [],
          baifangType: '',
          qitaDes: '',
          bussDomain: '',
          feeDetais: [],
          wkgId: '',
          criterionRate: 0,
          amount: 0,
          approvedTime: 0,
          billRate: 0,
          approvedAmountCust: 0,
          approvedDesc: undefined,
          custIntroductor: undefined,
          workContent: undefined,
          userId: this.$store.getters.userId,
          materialIdList: [],
          shangjiList: [
            {
              domain: undefined,
              lxren: undefined,
              lxfs: undefined,
              sjdesc: undefined
            }
          ],
          agentNum: undefined,
          caseName: undefined,
          workType: undefined,
          hasSj: 0,
          beginDate: undefined,
          endDate: undefined,
          time: undefined,
          hourDate: this.$commonUtils.formatDate(new Date()),
          custName: ''
        },
        activityKinds: [],
        opportunityCluesData: [],
        agentHistorySearch: false,
        customerContacts: [],
        partnerList: [],
        isPartner: false
      }
    },
    async created() {
      this.getPrjList()
      this.queryRecentMeetingList()
      this.queryGridDataDefault()
      queryActiveWorkgroupBossUserList().then(res => {
        this.partnerList = res.data
      })
      queryIfHehuoren().then(res => {
        this.isPartner = !!res.data
      })
      this.queryGroupList()
      await this.queryActivityType()
      if (this.caseData) {
        this.formTime.workType = undefined
        this.formTime.agentNum = this.caseData.agentNum
        this.formTime.caseId = this.caseData.caseId
        this.formTime.wkgId = this.caseData.wkgId
        this.formTime.caseName = this.caseData.caseName
        this.formTime.custId = this.caseData.custId;
        this.formTime.custName = this.caseData.custName
        this.remotepaternalUnit(this.caseData.custName, () => {

        })
        this.queryCustGroup(this.caseData.caseId)
      }
      if (this.projectId) {
        this.formTime.projectId = this.projectId
      }
      if (this.type === 'edit' || this.type == 'audit') {
        this.init()
      }

      queryWorkByUserId({userId: this.$store.getters.userId}).then(res => {
        if (res.data.groups && res.data.groups.length) {
          this.workUserList = res.data.groups
          if (this.type === 'create' && !this.caseData) {
            this.formTime.wkgId = res.data.groups[0].wkgId
          }
        }
      })
    },
    // watch: {
    //   agentVisible(a,b){
    //    if(a===false){
    //     // this.tableSeacherVisible=false
    //     // this.twiceData= []
    //    }
    //   }
    // },
    methods: {
      getPrjList() {
        queryProjectList({pageSize:10000}).then(res => {
          this.projectList = res.data
        })
      },
      remoteCustContactMethod(val){
        if (!val || !this.formTime.custId)return
        this.custContactList = []
        if (this.formTime.custContactList.filter(item => typeof item === 'number').length) {
          queryCustomerContactListUrl({custId: this.formTime.custId, customerContactIds: this.formTime.custContactList.filter(item => typeof item === 'number').join(','), isCustomer: "1", pageSize: 50}).then(res1 => {
            this.custContactList = res1.data.map(item => ({
              id: item.custContactId,
              value: item.name,
              value1: item.email,
              value2: '已存在'
            }))
            if (this.formTime.custContactList.filter(item => typeof item === 'string').length) {
              this.custContactList = this.custContactList.concat(this.formTime.custContactList.filter(item => typeof item === 'string').map(item => ({
                id: item,
                value: item,
                value1: '',
                value2: '不存在'
              })))
            }

            queryCustomerContactListUrl({custId: this.formTime.custId, name: val, isCustomer: "1", pageSize: 50}).then(res2 => {
              if(res2.data && res2.data.length) {
                this.custContactList = this.$commonUtils.unique(this.custContactList.concat(res2.data.map(item => ({
                  id: item.custContactId,
                  value: item.name,
                  value1: item.email,
                  value2: '已存在'
                }))), 'id')
              } else {
                this.custContactList = this.$commonUtils.unique(this.custContactList.concat([{
                  id: val,
                  value: val,
                  value1: '',
                  value2: '不存在'
                }]), 'id')
              }
            })
          })
        } else {
          queryCustomerContactListUrl({custId: this.formTime.custId, name: val, isCustomer: "1", pageSize: 50}).then(res2 => {
            if(res2.data && res2.data.length) {
              this.custContactList = this.$commonUtils.unique(this.custContactList.concat(res2.data.map(item => ({
                id: item.custContactId,
                value: item.name,
                value1: item.email,
                value2: '已存在'
              }))), 'id')
            } else {
              this.custContactList = this.$commonUtils.unique(this.custContactList.concat([{
                id: val,
                value: val,
                value1: '',
                value2: '不存在'
              }]), 'id')
            }
          })
        }

      },
      inputEnter(values){
        if(this.shouldShowPopover){
          const info = this.custList[1]
          this.changeCust(info)
          this.custList = []
        }else{
          const value = values.target.value
          this.formTime.fullname = value
          this.formTime.custName = value
          this.formTime.custIntroductor = this.$store.getters.name
        }
      },
      getAppTitleList() {
        return {
          id: "-1",
          value: "姓名",
          value1: "联系方式",
          value2: "是否存在",
        }
      },
      // 查询最近会议
      queryRecentMeetingList(val) {
        queryRecentMeeting({title: val}).then(res => {
          this.recentMeetingList = res.data || []
        })
      },
      // 查询案件的客户组
      queryCustGroup(caseId) {
        queryCustGroupByCaseId({caseId: caseId}).then(res => {
          if (res.data){
            this.formTime.wkgId = res.data.wkgId
          }
        })
      },
      queryGridDataDefault() {
        queryChargeItemList({
          chargeType: 1,
          caseTypeIds: [[2]],
          pageSize: 100
        }).then(res => {
          this.defaultGridData = res.data.map(item => ({
            nameCn: item.nameEn
          }))
          this.gridData = res.data.map(item => ({
            nameCn: item.nameEn
          }))
        })
      },
      jumpDetails(val) {
        let taskType = 1
          switch (val.domain) {
            case '商标':
              taskType = 1
              break
            case '诉讼':
              taskType = 2
              break
            case '保护':
              taskType = 3
              break
            case '专利':
              taskType = 4
              break
            case '域名':
              taskType = 5
              break
            case '著作权':
              taskType = 6
              break
            case '非诉':
              taskType = 7
              break
            default:
              taskType = 1
          }
          const routeUrl = this.$router.resolve({ path: '/workbench/case/seeCaseDetail/' + val.caseId, query: {taskType: taskType}})
          window.open(routeUrl.href, "_blank");
      },
      remoteQueryCust(v) {
        this.remotepaternalUnit(v, () => {
        }, '客户', true)
      },
      calcTime(data) {
        if (data.time) {
          this.formTime.time = data.time
        }
      },
      unBindFee(row, index) {
        unbindWorkHour({
          hoursId: this.formTime.hoursId,
          feeIdList: [row.feeId]
        }).then(res => {
          this.$message.success("解除关联费用成功！")
          this.formTime.feeDetais.splice(index, 1)
        })
      },
      changeAgentNum(v) {
        // this.tagList.push(v)
        // this.formTime.agentNum = undefined
        // console.log(this.tagList,'this.tagList')
        if (!v) {
          this.formTime.caseId = undefined
        }
      },
      fwtableClick(row) {
        this.$set(this.formTime, 'workContent', row.nameCn || '')
        this.handleQuoteReplace('workContent')
      },
      handleQuoteReplace(field) {
        if (!this.formTime[field]) return;
        const regex = /([a-zA-Z])’/g;
        this.$set(this.formTime, field, this.formTime[field].replace(regex, "$1'"))
      },
      searchContent() {
        this.handleQuoteReplace('workContent');
        if (!this.formTime.workContent) {
          this.gridData = this.defaultGridData
          return
        };
        queryChargeItemBynameCnUrl({
          nameCn: this.formTime.workContent,
          caodan: 2,
          caseId: this.formTime.caseId
        }).then(res => {
          this.gridData = res.data
          if (this.gridData.length) {
            this.contentShow = true
          } else {
            this.contentShow = true
          }
        })
      },
      changeTime(v, d) {
        this.formTime.amount = this.ChangeStrToMinutes(v[0] || "00:00") * d.criterionRate / 60
      },
      changeMoney(v, d) {
        this.formTime.approvedAmountCust = this.ChangeStrToMinutes(d.approvedTime || "00:00") * v / 60
      },
      changeAppCount(v, d) {
        this.formTime.approvedAmountCust = this.ChangeStrToMinutes(v[0] || "00:00") * d.billRate / 60
      },
      ChangeStrToMinutes(str) {
        if (str) {
          let arrminutes = str.split(":");
          if (arrminutes.length == 2) {
            let minutes = parseInt(arrminutes[0]) * 60 + parseInt(arrminutes[1]);
            return minutes;
          } else {
            return 0;
          }
        }
      },
      init() {
        this.queryWorkHours()
      },
      queryGroupList() {
        queryCaseWorkgroupUrl({status: 1}).then(res => {
          this.groupList = res.data
        })
      },
      custBlur() {
        this.custVisible = false
        this.noMatch = false
        setTimeout(() => {
          if (!this.formTime.custId && this.formTime.custName) {
            const title = this.custList.length > 1 ?'已存在相似客户':'该客户不存在'
            this.$confirm(`${title}，是否创建新客户`, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              this.noMatch = true
              this.formTime.fullname = this.formTime.custName
              this.formTime.custIntroductor = this.$store.getters.name
            })
            .catch(() => {
              this.formTime.custName = null
              this.noMatch = false
            });
          }
          console.log('失焦');
        }, 500)
      },
      add0(m) {
        return m < 10 ? '0' + m : m
      },
      computedTime() {
        if (this.formTime.beginDate && this.formTime.endDate) {
          let beginHour = +this.formTime.beginDate.split(':')[0] || 0
          let beginMinite = +this.formTime.beginDate.split(':')[1] || 0
          let endHour = +this.formTime.endDate.split(':')[0] || 0
          let endMinite = +this.formTime.endDate.split(':')[1] || 0
          if (endHour - beginHour < 0) {
            this.formTime.time = ''
            return
          }
          if (endMinite - beginMinite < 0) {
            endMinite += 60
            endHour--
            if (endHour < 0) {
              this.formTime.time = ''
              return
            }
          }
          this.formTime.time = this.add0(endHour - beginHour) + ':' + this.add0(endMinite - beginMinite)
        }
      },
      auditWorkTime(f) {
        // if (this.formTime.caseId) {
        //   this.formTime.workTypeName = undefined
        //   this.formTime.workType = undefined
        // } else {
        //   this.formTime.agentNum = undefined
        //   this.formTime.caseName = undefined
        //   // this.formTime.custName = undefined
        //   // this.formTime.custId = undefined
        //   this.formTime.caseId = undefined
        // }
        // if (this.formTime.wfStatus == '待审核') {
        //   this.formTime.approvedTime = this.formTime.time
        // }
        if (this.formTime.fullname) {
          this.formTime.custId = undefined
          this.formTime.custIntroductor = this.$store.getters.name
        }
        if (this.custRequre && (!this.formTime.custId && !this.formTime.fullname)) {
          this.$message.error('请填写客户名称！')
          return
        }
        if(!this.isPartner && !this.formTime.noCaseAuditUserId && this.formTime.workType) {
          this.$message.error('请选择活动工时审核人！')
          return
        }
        if (!this.formTime.workContent) {
          this.$message.error('请填写工作描述！')
          return
        }
        if (!this.formTime.userId) {
          this.$message.error('请选择记录人！')
          return
        }
        if (!this.formTime.hourDate) {
          this.$message.error('请填写工时日期！')
          return
        }
        if (!this.formTime.time) {
          this.$message.error('请填写工作时长！')
          return
        }
        if (this.isTimeOver24Hours(this.formTime.time)) {
          this.$message.error('一天的记录工时不能超过24小时! ')
          return
        }
        if (!this.projectId && !(this.formTime.agentNum || this.formTime.workType)) {
          this.$message.error('请填写案件文号或活动类型！')
          return
        }
        const dateData = {
          hourDate: this.formTime.hourDate,
          beginDate: this.formTime.beginDate,
          endDate: this.formTime.endDate
        }
        if (dateData.beginDate) {
          dateData.beginDate = dateData.hourDate + ' ' + dateData.beginDate
          dateData.beginDate = dateData.beginDate.replace(/\//g, '-')
        }
        if (dateData.endDate) {
          dateData.endDate = dateData.hourDate + ' ' + dateData.endDate
          dateData.endDate = dateData.endDate.replace(/\//g, '-')
        }
        let innerUserList = []
        let custContactList = []
        if(this.formTime.innerUserList && this.formTime.innerUserList.length) {
          innerUserList = this.$store.getters.userList.filter(item => this.formTime.innerUserList.includes(item.userId))
        }
        if(this.formTime.custContactList && this.formTime.custContactList.length) {
          custContactList = this.custContactList.filter(item => this.formTime.custContactList.includes(item.id)).map(item => ({
            custContactId: typeof item.id === 'number' ? item.id : undefined,
            name: item.value,
            email: item.value1
          }))
        }
        auditWorkHours({workHoursList: [{...this.formTime, ...dateData, innerUserList, custContactList}], result: f}).then(() => {
          this.$message.success('审核成功！')
          this.closeDialog(true)
        })
      },
      editWorkHour() {
        // if (this.formTime.caseId) {
        //   this.formTime.workTypeName = undefined
        //   this.formTime.workType = undefined
        // } else {
        //   this.formTime.agentNum = undefined
        //   this.formTime.caseName = undefined
        //   // this.formTime.custName = undefined
        //   // this.formTime.custId = undefined
        //   this.formTime.caseId = undefined
        // }
        if (this.formTime.wfStatus == '待审核') {
          // this.formTime.approvedTime = this.formTime.time
        }
        if (this.formTime.wfStatus == '待审核') {
          // this.formTime.approvedDesc = this.formTime.workContent
        }
        if (this.formTime.workType) {
          // this.formTime.approvedTime = this.formTime.time
          // this.formTime.approvedDesc = this.formTime.workContent
        }
        if (this.formTime.fullname) {
          this.formTime.custId = undefined
          this.formTime.custIntroductor = this.$store.getters.name
        }
        if (this.custRequre && (!this.formTime.custId && !this.formTime.fullname)) {
          this.$message.error('请填写客户名称！')
          return
        }
        if(!this.isPartner && !this.formTime.noCaseAuditUserId && this.formTime.workType) {
          this.$message.error('请选择活动工时审核人！')
          return
        }
        if (!this.formTime.workContent) {
          this.$message.error('请填写工作描述！')
          return
        }
        if (!this.formTime.userId) {
          this.$message.error('请选择记录人！')
          return
        }
        if (!this.formTime.hourDate) {
          this.$message.error('请填写工时日期！')
          return
        }
        if (!this.formTime.time) {
          this.$message.error('请填写工作时长！')
          return
        }
        if (this.isTimeOver24Hours(this.formTime.time)) {
          this.$message.error('一天的记录工时不能超过24小时! ')
          return
        }
        if (!this.projectId && !(this.formTime.agentNum || this.formTime.workType)) {
          this.$message.error('请填写案件文号或活动类型！')
          return
        }
        const dateData = {
          hourDate: this.formTime.hourDate,
          beginDate: this.formTime.beginDate,
          endDate: this.formTime.endDate
        }
        if (dateData.beginDate) {
          dateData.beginDate = dateData.hourDate + ' ' + dateData.beginDate
          dateData.beginDate = dateData.beginDate.replace(/\//g, '-')
        }
        if (dateData.endDate) {
          dateData.endDate = dateData.hourDate + ' ' + dateData.endDate
          dateData.endDate = dateData.endDate.replace(/\//g, '-')
        }
        this.formTime.showRefno = this.formTime.agentNum
        let innerUserList = []
        let custContactList = []
        if(this.formTime.innerUserList && this.formTime.innerUserList.length) {
          innerUserList = this.$store.getters.userList.filter(item => this.formTime.innerUserList.includes(item.userId))
        }
        if(this.formTime.custContactList && this.formTime.custContactList.length) {
          custContactList = this.custContactList.filter(item => this.formTime.custContactList.includes(item.id)).map(item => ({
            custContactId: typeof item.id === 'number' ? item.id : undefined,
            name: item.value,
            email: item.value1
          }))
        }
        modifyTaskHours({
          workHoursList: [
            {
              ...this.formTime,
              ...dateData,
              innerUserList,
              custContactList
            }]
        }).then(res => {
          this.$message.success('修改成功！')
          this.closeDialog(true)
        })

      },
      queryWorkHours() {
        queryWorkHours({hoursId: this.hoursId}).then(res => {
          if (res.data && res.data.workhoursList && res.data.workhoursList.length) {
            this.formTime = res.data.workhoursList[0]
            if (this.type !== 'create') { // 任务4994
              if (this.formTime.auditUserId == this.$store.getters.userId && (this.formTime.submitUserId != this.$store.getters.userId || this.formTime.userId != this.$store.getters.userId)) {
                this.onlyEdit3 = true // 只能编辑三个字段
              }
            }
            if (this.type === 'audit') {
              if (this.formTime.wfStatus == '待审核') {
                this.formTime.approvedTime = this.formTime.time
                this.formTime.approvedDesc = this.formTime.workContent
                this.formTime.billRate = this.formTime.criterionRate
                this.formTime.approvedAmountCust = this.formTime.amount
              }
              if (this.formTime.workType) {
                this.formTime.approvedTime = this.formTime.time
                this.formTime.approvedDesc = this.formTime.workContent
                this.formTime.billRate = this.formTime.criterionRate
                this.formTime.approvedAmountCust = this.formTime.amount
              }
            }
            if (this.formTime.bussDomain) {
              this.$set(this.formTime, 'bussDomainList', this.formTime.bussDomain.split(','))
            } else {
              this.$set(this.formTime, 'bussDomainList', [])
            }
            if (this.formTime.agentNum) {
              getCaseHistory({
                businessList: [2, 3, 4, 5, 6, 11, 23],
                pageNo: 1,
                pageSize: 100,
                keyWord: this.formTime.agentNum
              }).then(res => {
                this.agentCaseLists = res.data
                // this.agentCaseLists.unshift({'agentNum': '案件文号', 'caseName': '案件名称', 'custName': '客户'})
              })
            }
            this.fileList = this.formTime.materialList.map(item => ({
              name: item.materialName,
              url: item.address,
              materialId: item.materialId,
              address: item.address
            }))
            if (this.formTime.custName) {
              this.remotepaternalUnit(this.formTime.custName)
            }
            if (this.formTime.beginDate) {
              this.formTime.beginDate = this.formTime.beginDate.split(' ')[1].substring(0, 5)
            }
            if (this.formTime.endDate) {
              this.formTime.endDate = this.formTime.endDate.split(' ')[1].substring(0, 5)
            }
            if (this.formTime.workType == 0) {
              this.formTime.workType = ''
            }
            if (this.formTime.workType) {
              if (this.activityKinds.find(item => item.childrens.find(i => i.workType == this.formTime.workType))) {
                this.workTypeList = [this.activityKinds.find(item => item.childrens.find(i => i.workType == this.formTime.workType)).workType, this.formTime.workType]
              }
            }
            if (!this.formTime.billRate && this.formTime.wfStatus == '待审核') {
              // this.formTime.billRate = this.formTime.criterionRate
            }
            if (!this.formTime.shangjiList || this.formTime.shangjiList && !this.formTime.shangjiList.length) {
              this.formTime.shangjiList = [{
                domain: undefined,
                lxren: undefined,
                lxfs: undefined,
                sjdesc: undefined
              }]
            }
            if (this.formTime.meId) {
              this.recentMeetingList = [{
                meId: this.formTime.meId,
                title: this.formTime.title
              }]
            }
            if (this.formTime.innerUserList && this.formTime.innerUserList.length) {
              this.innerUserList1 = JSON.parse(JSON.stringify(this.formTime.innerUserList))
              this.$set(this.formTime, 'innerUserList', this.formTime.innerUserList.map(item => item.userId))
            } else {
              this.$set(this.formTime, 'innerUserList', [])
            }
            if (this.formTime.custContactList && this.formTime.custContactList.length) {
              this.custContactList1 = JSON.parse(JSON.stringify(this.formTime.custContactList))
              this.custContactList = this.formTime.custContactList.map(item => ({
                id: item.custContactId,
                value: item.name,
                value1: item.email,
                value2: '已存在'
              }))
              this.$set(this.formTime, 'custContactList', this.formTime.custContactList.map(item => item.custContactId))
            } else {
              this.$set(this.formTime, 'custContactList', [])
            }
          }
        })
      },
      //判断时间是否超过24小时
      isTimeOver24Hours(timeStr) {
        // 将时间字符串分割为小时和分钟
        const [hours, minutes] = timeStr.split(':').map(Number);
        // 计算总小时数
        const totalHours = hours + minutes / 60;
        // 判断是否超过24小时
        return totalHours > 24;
      },
      submitWorkHour() {
        if (this.formTime.fullname) {
          this.formTime.custId = undefined
          this.formTime.custIntroductor = this.$store.getters.name
        }
        if (this.custRequre && (!this.formTime.custId && !this.formTime.fullname)) {
          this.$message.error('请填写客户名称！')
          return
        }
        if(!this.isPartner && !this.formTime.noCaseAuditUserId && this.formTime.workType) {
          this.$message.error('请选择活动工时审核人！')
          return
        }
        if (!this.formTime.workContent) {
          this.$message.error('请填写工作描述！')
          return
        }
        if (!this.formTime.userId) {
          this.$message.error('请选择记录人！')
          return
        }
        if (!this.formTime.hourDate) {
          this.$message.error('请填写工时日期！')
          return
        }
        if (!this.formTime.time) {
          this.$message.error('请填写工作时长！')
          return
        }
        if (this.isTimeOver24Hours(this.formTime.time)) {
          this.$message.error('一天的记录工时不能超过24小时! ')
          return
        }
        if (!this.projectId && !(this.formTime.agentNum || this.formTime.workType)) {
          this.$message.error('请填写案件文号或活动类型！')
          return
        }
        const dateData = {
          hourDate: this.formTime.hourDate,
          beginDate: this.formTime.beginDate,
          endDate: this.formTime.endDate
        }
        if (dateData.beginDate) {
          dateData.beginDate = dateData.hourDate + ' ' + dateData.beginDate
          dateData.beginDate = dateData.beginDate.replace(/\//g, '-')
        }
        if (dateData.endDate) {
          dateData.endDate = dateData.hourDate + ' ' + dateData.endDate
          dateData.endDate = dateData.endDate.replace(/\//g, '-')
        }
        let innerUserList = []
        let custContactList = []
        if(this.formTime.innerUserList && this.formTime.innerUserList.length) {
          innerUserList = this.$store.getters.userList.filter(item => this.formTime.innerUserList.includes(item.userId))
        }
        if(this.formTime.custContactList && this.formTime.custContactList.length) {
          custContactList = this.custContactList.filter(item => this.formTime.custContactList.includes(item.id)).map(item => ({
            custContactId: typeof item.id === 'number' ? item.id : undefined,
            name: item.value,
            email: item.value1
          }))
        }
        if (+this.formTime.time.substring(0, 2) > 3) {
          this.$confirm('时长过长，是否创建!', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            addTaskHours({...this.formTime, ...dateData, innerUserList, custContactList}).then(res => {
              // if (this.formTime.workType) {
              //   localStorage.setItem('workType', this.formTime.workType)
              // }
              this.$message.success('工时创建成功！')
              this.closeDialog(false)
              this.$store.commit('caseInformation/SET_HOURS_ID', res.data.hoursId)
              if (this.$route.path !== '/workbench/work_time') {
                this.$router.push('/workbench/work_time')
              }
            })
          })
        } else {
          addTaskHours({...this.formTime, ...dateData, innerUserList, custContactList}).then(res => {
            this.$message.success('工时创建成功！')
            // if (this.formTime.workType) {
            //   localStorage.setItem('workType', this.formTime.workType)
            // }
            this.closeDialog(false)
            this.$store.commit('caseInformation/SET_HOURS_ID', res.data.hoursId)
            if (this.$route.path !== '/workbench/work_time') {
              this.$router.push('/workbench/work_time')
            }
          })
        }

      },
      closeDialog(flag) {
        this.$emit('closeDialog')
        flag === true && this.$emit('refreshList')
      },
      successCallback(res, file, fileList) {
        this.formTime.materialIdList = fileList.map(item => {
          if (item.materialId) {
            return item.materialId
          } else {
            return item.response.data[0].materialId
          }
        })
        this.fileList.push(res.data.map(item => ({
          name: item.materialName,
          url: item.address,
          materialId: item.materialId,
        }))[0])
      },
      brforeRemoveFile(file, fileList) {
        let delmaterialId
        if (file.response) {
          delmaterialId = file.response.data[0].materialId
        } else {
          delmaterialId = file.materialId
        }
        delmaterialId && delCaseMaterialUrl({
          materialId: delmaterialId,
          hoursFile: 1
        }).then(res => {
          this.$message.success(res.message)
          this.formTime.materialIdList = fileList.map(item => {
            if (item.materialId) {
              return item.materialId
            } else {
              return item.response.data[0].materialId
            }
          })
          this.fileList = fileList
        })
      },
      downLoad(data) {
        const url = data.address || data.url
        const downData = {
          url: `ipdoc${url}`,
          success() {
          }
        }
        if (data.mailId) {
          downData.downLoad = data.materialName
        }
        this.$commonUtils.downLoadAll(downData)
      },
      onPreview(data) {
        let url = data.address || data.url
        if (getProgID(url) || ['eml', 'msg'].includes(url.replace(/.+\./, '').toLocaleLowerCase())) {
          if (['doc', 'docx'].includes(url.replace(/.+\./, "").toLocaleLowerCase())) {
            this.$commonUtils.viewPdf(`${url}`)
          } else {
            let flag = ''
            if (data.mailId) {
              flag = 'mailId'
            } else if (data.materialId) {
              flag = 'materialId'
            }
            url = url.replace(/&/g, '%26')
            window.open(`#/preView?address=ipdoc${url}&${flag}=${data[flag]}&hoursFile=1`.replace(/[+]/g, '%2B'))
          }
          // doEditInOffice(url, getProgID(url))
        } else if (['pdf', 'jpg', 'png'].some(item => url.replace(/.+\./, "").toLocaleLowerCase() == item)) {
          window.open(`/ipdoc${url}`.replace(/[+]/g, '%2B'))
        } else {
          this.downLoad(data)
        }
      },
      addData() {
        this.formTime.shangjiList.push({
          domain: '',
          lxren: '',
          lxfs: '',
          sjdesc: ''
        })
      },
      deleteData(index) {
        this.formTime.shangjiList.splice(index, 1)
      },
      handleSelect(item, row) {
        row.lxfs = item.email || ''
      },
      createFilter(queryString) {
        return (item) => {
          return (item.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
        }
      },
      querySearch(queryString, cb) {
        const results = queryString ? this.customerContacts.filter(this.createFilter(queryString)) : this.customerContacts
        cb(results)
      },
      changeCust(custInfo) {
        console.log(custInfo,'custInfo');
        if (custInfo.fullname === "全称") return
        // if (!custInfo.custId) { // 新录入客户名称
        //   this.formTime.fullname = custInfo.fullname
        //   this.formTime.custName = custInfo.fullname
        //   this.formTime.custIntroductor = this.$store.getters.name
        // }
        this.formTime.fullname = undefined
        this.formTime.custIntroductor = undefined
        this.formTime.custId = custInfo.custId
        this.formTime.custName = custInfo.fullname
        queryCustomerContactByCustIdUrl({
          custId: custInfo.custId
        }).then(res => {
          this.$nextTick(() => {
            this.customerContacts = res.data.customerContacts.filter(item => item.name).map(item => ({
              value: item.name,
              email: item.email
            }))
          })
        })

      },
      changeWorkType(v) {
        if (v && v.length) {
          this.formTime.workType = v[v.length - 1]
          if (this.formTime.workType === 2069) {
            this.formTime.bussDomain = ''
          }
          if (this.formTime.workType === 2071) {
            this.formTime.baifangType = ''
            this.formTime.qitaDes = ''
          }
          this.formTime.agentNum = undefined
          this.formTime.caseName = undefined
          this.formTime.caseId = undefined
          // this.formTime.wkgId = this.workUserList[0].wkgId
          this.agentCaseLists = this.historyList
          this.nameCaseLists = this.historyList
        } else {
          this.formTime.workType = undefined
        }
      },
      debounce(fn, wait) {
        return (v) => {
          if (this.timer !== null) {
            clearTimeout(this.timer)
          }
          this.timer = setTimeout(() => {
            fn(v)
          }, wait)
        }
      },
      remotepaternalUnit(query, cb, type, isSimilar) {
        if (!query && type === '客户') {
          this.formTime.fullname = undefined
          this.formTime.custIntroductor = undefined
          this.formTime.custId = undefined
          this.formTime.custName = undefined
        }
        if (query) {
          Promise.all([queryList({
            pageNo: 1,
            pageSize: 50,
            sign: 1,
            parameter: query
          }), querySimilarCustomer({fullname: query})]).then(res => {
            this.custList = this.$commonUtils.unique(res[0].data.concat(res[1].data.map(item => ({
              custId: item.custId,
              fullname: item.custName,
              name: item.name
            }))), 'custId')
            console.log(this.custList,'this.custList');
            // if (this.custList.length<2&&type === '客户') {
            //   // this.noMatch = true
            // }else{
            //   this.noMatch = false
            // }
            this.custList.unshift({'fullname': '全称', 'name': '简称', 'status': '状态'})
            // if (type === '客户') {
            //   const curObj = this.custList.find(item => item.name && item.name.toLowerCase().includes(query.toLowerCase()) || item.fullname && item.fullname.toLowerCase().includes(query.toLowerCase()))
            //   if (!curObj) {
            //     this.custList.splice(1, 0, {
            //       'fullname': query,
            //       'name': query,
            //       'status': '不存在'
            //     })
            //   }
            // }
          })
        }
      },
      loseFocus(f) {
        if (f == 'agent') {
          // this.agentVisible = false
        } else {
          this.visible = false
        }
      },
      handleCommand(val) {
        this.ruleId = val - 0
        localStorage.setItem("value",JSON.stringify(this.ruleId))
        // this.queryHistoryList()
        queryRecentCase({ ruleId: this.ruleId }).then(res => {
          this.agentHistorySearch = true
          this.historyList = res.data
          this.agentCaseLists = JSON.parse(JSON.stringify(this.historyList))
          this.historyList.unshift({'agentNum': '案件文号', 'caseName': '案件名称', 'custName': '客户'})
          this.twiceSearch()
        })
      },
      twiceSearch() {
        let fuzzy = this.inputContent;
        if (fuzzy) {
          this.twiceData = this.agentCaseLists.filter((item) => {
            return item.agentNum.includes(fuzzy)
          });
        } else {
          this.twiceData = this.agentCaseLists;
        }
      },
      queryHistoryList(v, f) {
        if (f == 'agent') {
          this.agentVisible = true

          if (!v.target.value) {
            if (!this.agentHistorySearch) {
              queryRecentCase({ ruleId: this.ruleId }).then(res => {
                this.agentHistorySearch = true
                this.historyList = res.data
                this.agentCaseLists = JSON.parse(JSON.stringify(this.historyList))
                this.historyList.unshift({'agentNum': '案件文号', 'caseName': '案件名称', 'custName': '客户'})
                this.twiceSearch()
              })
            }
          }

        } else {
          this.visible = true
          if (!v.target.value) {
            if (!this.nameHistorySearch) {
              queryRecentCase({ ruleId: this.ruleId }).then(res => {
                this.nameHistorySearch = true
                this.historyList = res.data
                this.historyList.unshift({'agentNum': '案件文号', 'caseName': '案件名称', 'custName': '客户'})
                this.nameCaseLists = JSON.parse(JSON.stringify(this.historyList))
              })
            }
          }
        }
      },
      autoSearchCase(v) {
        this.useHistoryList(v, 'agent')
        this.queryCaseList(v, 'agent')
      },
      useHistoryList(v, f) {
        if (!v) {
          if (f == 'agent') {
            this.agentCaseLists = this.historyList
          } else {
            this.nameCaseLists = this.historyList
          }
        }
      },
      queryCaseList(v, f) {
        if (!v.target.value) {
          return
        }
        let keyWord = v.target.value
        if (f == 'agent') {
          this.agentVisible = true
          getCaseHistory({
            businessList: [2, 3, 4, 5, 6, 11, 23],
            pageNo: 1,
            pageSize: 100,
            keyWord
          }).then((res) => {
            if (res.data && res.data.length == 1) {
              this.formTime.agentNum = res.data[0].agentNum
              this.formTime.caseName = res.data[0].caseName
              this.formTime.custId = res.data[0].custId
              this.formTime.custName = res.data[0].custName
              this.formTime.caseId = res.data[0].caseId
              this.formTime.wkgId = res.data[0].wkgId
            }
            this.agentCaseLists = res.data
            this.twiceData = res.data
            // this.agentCaseLists.unshift({'agentNum': '案件文号', 'caseName': '案件名称', 'custName': '客户'})
          })
        } else {
          this.visible = true
          getCaseHistory({
            businessList: [2, 3, 4, 5, 6, 11, 23],
            pageNo: 1,
            pageSize: 100,
            keyWord
          }).then((res) => {
            if (res.data && res.data.length == 1) {
              this.formTime.agentNum = res.data[0].agentNum
              this.formTime.caseName = res.data[0].caseName
              this.formTime.custName = res.data[0].custName || res.data[0].name
              this.formTime.caseId = res.data[0].caseId
              this.formTime.wkgId = res.data[0].wkgId
            }
            this.nameCaseLists = res.data
            this.nameCaseLists.unshift({'agentNum': '案件文号', 'caseName': '案件名称', 'custName': '客户'})
          })
        }


      },
      queryCaseInfo(row) {
        if (row.agentNum == '案件文号') {

        } else {
          this.agentVisible = false
          this.formTime.agentNum = row.agentNum
          this.formTime.caseId = row.caseId
          this.formTime.wkgId = row.wkgId
          this.formTime.caseName = row.caseName
          this.formTime.custId = row.custId;
          this.formTime.custName = row.custName || row.name
          this.remotepaternalUnit(row.custName || row.name, () => {

          })
        }
      },
      queryCaseOff(column) {
       if(column.property !=='agentNum'){
        this.tableSeacherVisible = false
        }
        // this.agentVisible = true

        this.$nextTick(()=>{
          document.addEventListener('keyup', this.keyUp)//创建监听键盘事件
        })
      },
      keyUp(e) {
        if (this.agentCaseLists.length == 0) {
          return
        }
        if (e.keyCode == 40) { // 下键
          if(this.agentCaseLists[this.nowIndex*1+1] != undefined){
            this.$refs.brlbtable.setCurrentRow(this.agentCaseLists[this.nowIndex*1+1])
            this.nowIndex = this.nowIndex*1+1
          }else{
            this.nowIndex = 0
            this.$refs.brlbtable.setCurrentRow(this.agentCaseLists[0])
          }
          let bodyWrapper = this.$refs.tablebox
          if(this.nowIndex > 2 && this.nowIndex < this.agentCaseLists.length - 4) {
            bodyWrapper.scrollTop = bodyWrapper.scrollTop + 30
          }
          if(this.nowIndex === 0){
            bodyWrapper.scrollTop = 0
          }

        }else if (e.keyCode == 38) { // 上键
          if(this.agentCaseLists[this.nowIndex*1-1] != undefined && this.nowIndex > 0){
            this.$refs.brlbtable.setCurrentRow(this.agentCaseLists[this.nowIndex*1-1])
            this.nowIndex = this.nowIndex*1-1
          }else{
            this.nowIndex = 0
            this.$refs.brlbtable.setCurrentRow(this.agentCaseLists[0])
          }
          let bodyWrapper = this.$refs.tablebox
          if(this.nowIndex > 0) {
            bodyWrapper.scrollTop = bodyWrapper.scrollTop - 30
          }
          if(this.nowIndex === 0){
            bodyWrapper.scrollTop = 0
          }
        }else if(e.keyCode == 13){ //回车
          this.queryCaseInfo(this.agentCaseLists[this.nowIndex])
        }
        // this.$refs.popoverRef.doClose()
      },
      async queryActivityType() {
        await queryWorkType().then(res => {
          this.activityKinds = res.data
        })
      },
    },

  }
</script>

<style lang="scss" scoped>
  .is-active {
    background-color: #66B1FF;
    color: #fff;
  }
  .fl-ac-jc {
    margin-top: 15px;
  }

  .box-border {
    border: 1px solid #D7D7D7;
    padding: 10px 10px 5px 10px;
  }

  .form-container {
    .el-form-item__error {
      position: relative !important;
      top: 0;
    }

    /deep/ .el-row {
      margin: 0 0 5px 0;
      display: flex;
    }

    /deep/ .postInfo-container-item {
      height: 100%;
      width: 100%;
    }

    /deep/ .el-form-item__label {
      flex-shrink: 0;
      background-color: #F2F2F2;
      /*width: 36.7%;*/
      text-align: right;
    }

    /deep/ .el-form-item {
      border-right: 1px solid #F2F2F2;
      margin: 0px !important;
    }

    .first-row {
      border-top: 1px solid #F2F2F2;
      .worktime-tips {
        float: left;
        margin-top: -4px;
      }
    }

    /deep/ .el-row {
      border-bottom: 1px solid #F2F2F2;
      border-left: 1px solid #F2F2F2;
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

    /deep/ .el-select .el-input {
      width: 100%;
    }
    .settings {
      /deep/ .el-form-item__content {
        position: relative;

        .item-settings {
          .item-settings-button {
            padding: 0;
            background-color: none;
            margin-left: -10px;
          }
        }
      }
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

      > > > .el-date-editor {
        width: 100%;
      }
    }
  }

  .divider {
    position: relative;
    border-bottom: 1px solid #797979;
    margin-bottom: 20px;
    /*border-right: 1px solid #ccc;*/
    margin-top: 20px;

    .el-badge {
      padding-right: 10px;
    }

    span {
      /*color: #333;*/
      /*font-weight: bold;*/
      font-size: 14px;
      background: #fff;
      position: absolute;
      bottom: -9px;
      left: 50px;
      padding: 0 10px;
    }
  }

  .el-table.el-table1 {
    /deep/ tr:nth-of-type(1) {
      th {
        padding: 0;
        background: #F2F2F2;
      }
    }
  }

  .tables {
    div {
      border: 1px solid #ccc;
      border-top: none;
      border-right: none;
      text-align: center;
      z-index: 9;
    }

    div:nth-child(3) {
      border-right: 1px solid #ccc;
    }
  }

  .table-head {
    text-align: center;
    background-color: #f7f7f7;
    border-top: 1px solid #ccc !important;
  }

  .overflow-hidden {
    overflow: hidden;
    width: 100%;
    display: inline-block;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-break: break-all;
    cursor: pointer !important;
  }

  .upload-btn {
    margin: 10px 0 5px 0;
    width: 120px;
    height: 30px;
    border: 1px solid #AAAAAA;
    color: #AAAAAA;
    text-align: center;
    line-height: 30px;
    cursor: pointer;

    &:hover {
      border: 1px solid #66B1FF;
      color: #66B1FF;
    }
  }

  .require:before {
    content: "*";
    color: #f56c6c;
    margin-right: 4px;
  }

  .requireForm /deep/ .el-form-item__label:before {
    content: "*";
    color: #f56c6c;
    margin-right: 4px;
  }

  .timeDiv {
    position: absolute;
    left: 100px;
    top: 10px;
    width: 180px;
  }
  .agent-reference {
    >>>.el-table__body tr.current-row>td {
        background: rgb(42, 124, 224) !important;
        color: #fff;
    }

  }
  .conditions-settings {
    .conditions-p {
      text-align: center;
      padding: 6px;
      font-size: 14px;
    }
    .conditions-p:hover {
      background-color: #66B1FF;
      color: #fff;
      font-size: 14px;
    }
    .conditions-p:active {
      background-color: #a5d1ff;
      font-size: 12px;
    }
  }
  /deep/ .el-table th div{
       line-height: 30px !important;
       height: 30px !important;
    }
  /deep/ .virtual-select  {
    .jh-virtual-select {
      height: auto;
    }
  }
  .el-scrollbar li {
    display: flex;
    width: 400px;
    span {
      flex: 1;
      flex-shrink: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      border-right: 1px solid #f4f4f5;
      border-bottom: 1px solid #f4f4f5;
    }
  }
</style>
