<template>
  <div class="container section">
    <template v-if="!searchPage" v-show="!searchPage">
      <div class="container-left" v-if="isCalendar === '1'">
        <div class="left-search">
          <el-input type="text" v-model="searchInput" class="input-field" @change="searchItinerary" placeholder="搜索日程"></el-input>
          <el-button type="primary" class="create-button"  @change="searchItinerary" icon="el-icon-search"></el-button>
        </div>
        <div class="left-calendar">
          <v-date-picker ref="datepicker" v-model="date" :attributes="smallCalendarAttributes" @update:to-page="handleMonthUpdate"/>
        </div>
        <div class="left-list">
          <div class="list-title">
            会议列表
            <el-popover
              placement="top-start"
              title="会议列表"
              width="250"
              trigger="hover"
              content="显示会议列表，可勾选会议，查看会议相关日程，或指定人员会议日程">
              <i slot="reference" class="el-icon-info"></i>
            </el-popover>
          </div>
          <div class="list-content">
            <div v-for="item in meetingList" :key="item.meId" :title="item.title" @click="meetingSelect(item.meId)">
              <p>
                <i class="iconfont" :class="item.meId == meetingId ? 'icon-choosehandle' : 'icon-choose'"></i>
                {{ item.title }}
              </p>
              <div v-if="item.meId == meetingId" style="margin-left: 20px">
                <p><el-checkbox v-model="isSelectAll" @change="selectUserList">全选/取消全选</el-checkbox></p>
                <div class="user-list">
                  <el-checkbox-group v-model="queryUserList">
                    <p v-for="item in mettingUserList"><el-checkbox :key="item" :label="item">{{ queryUserName(item) }}</el-checkbox></p>
                  </el-checkbox-group>
                </div>
                <!--              <virtual-select class="virtual-select" :isUser="true" clearable multiple-->
                <!--                              :data="$store.getters.userList"-->
                <!--                              v-model="mettingUserList" filterable-->
                <!--                              :render="(data)=>$commonUtils.UserRender(data,this)">-->
                <!--              </virtual-select>-->
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="container-right">
        <div class="buttonWrap" style="margin-bottom: 10px">
          <el-button size="mini" type="primary" @click="changeView" style="margin-right: 10px">切换视图</el-button>
          <template v-if="$store.getters.permissions.includes(406)">
            <el-button-group v-if="isCalendar === '2'" style="margin-right: 10px" class="button-group-search" v-clickoutside="clickoutside">
              <el-button id="mySearch" type="primary" size="mini" @click="handleSearch">搜索</el-button>
              <el-button type="primary" class="searchRight" size="mini" icon="el-icon-arrow-down"
                        @click.stop.prevent="drawerState=true"></el-button>
              <transition name="show" mode="out-in">
                <div class="searchWrap" v-show="drawerState">
                  <div style="width: 550px;
      max-height: 500px;overflow: auto">
                    <el-form label-width="130px" size="mini" class="form-container1">
                      <el-template v-if="isCalendar === '1'">
                        <el-form-item label="创建日期:">
                          <DataPicker class="DataPicker" v-model="queryModuleData.createDateArray"></DataPicker>
                        </el-form-item>
                        <el-form-item label="用户">
                          <el-select size="mini"
                                    aria-readonly="true"
                                    class="edit-border" style="width: 100%;" v-model="queryModuleData.userId"
                                    filterable
                                    clearable
                                    placeholder="请选择">
                            <el-option
                              v-for="item in $store.getters.userList"
                              :key="item.userId"
                              :label="item.fullname"
                              :value="item.userId">
                              <!--                  <UserIconAndUserName :user-id="item.userId"></UserIconAndUserName>-->
                            </el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item label="活动:">
                          <el-input size="mini" v-model="queryModuleData.activities" placeholder="请填写"></el-input>
                        </el-form-item>
                        <el-form-item label="描述:">
                          <el-input size="mini" v-model="queryModuleData.details" placeholder="请填写"></el-input>
                        </el-form-item>
                        <el-form-item label="地点:">
                          <el-input size="mini" v-model="queryModuleData.site" placeholder="请填写"></el-input>
                        </el-form-item>
                      </el-template>
                      <template v-else>
                        <el-form-item label="会议名称:">
                          <el-input size="mini" v-model="queryModuleData.title" placeholder="请填写"></el-input>
                        </el-form-item>
                        <el-form-item label="会议地点:">
                          <el-input size="mini" v-model="queryModuleData.site" placeholder="请填写"></el-input>
                        </el-form-item>
                        <el-form-item label="创建日期:">
                          <DataPicker class="DataPicker" v-model="queryModuleData.createDateArray"></DataPicker>
                        </el-form-item>
                      </template>
                    </el-form>

                  </div>
                  <div class="clearWrap">
                    <el-button size="mini" @click="clearSearch"><span>重置</span></el-button>
                    <el-button type="primary" size="mini" @click="handleSearch">搜索</el-button>
                  </div>
                </div>
              </transition>
            </el-button-group>
            <el-button v-if="isCalendar === '2'" size="mini" type="primary" @click="createMeetFunc">新建会议</el-button>
            <el-button v-if="isCalendar === '2'" size="mini" type="primary" @click="createFunc">新建日程</el-button>
            <el-button v-if="isCalendar === '2'" size="mini" type="primary" @click="importSchedule">导入日程</el-button>
            <el-button v-if="isCalendar === '2'" size="mini" type="primary" @click="defaultQxConfig">默认企信提醒设置</el-button>
            <el-button v-if="isCalendar === '2'" size="mini" type="primary" @click="qxConfig">会议企信提醒配置</el-button>
            <el-button v-if="isCalendar === '2'" size="mini" type="primary" @click="outlookConfig">同步outlook设置</el-button>
            <el-button v-if="isCalendar === '2'" size="mini" type="primary" @click="sendItineraryForOutlook">一键同步outlook</el-button>
          </template>
        </div>
        <template v-if="isCalendar === '1'">
          <v-calendar
            :key="calendarKey"
            ref="calendar"
            class="custom-calendar max-w-full"
            :masks="masks"
            :attributes="attributes"
            disable-page-swipe
            is-expanded
            mode="range"
            @update:to-page="handleUpdateToPage"
            drag
          >
            <template v-slot:day-content="{ day, attributes }">
              <div class="flex flex-col h-full z-10 overflow-hidden">
                <div>
                  <span class="day-label text-sm text-gray-900">{{ day.day }}</span>
                </div>
                <div class="flex-grow overflow-auto">
                  <!--              <RecycleScroller-->
                  <!--                class="scroller"-->
                  <!--                :items="attributes?attributes:[]"-->
                  <!--                :item-size="20"-->
                  <!--                key-field="key"-->
                  <!--                v-slot="{ item }"-->
                  <!--              >-->
                  <div class="it-row" v-for="(item, index) in attributes" :key="item.itId" :style="item.customData.color ? 'border-left: 5px solid '+item.customData.color+';background-color:'+hexToRgb(item.customData.color) : ''">
                    <el-popover
                      placement="right"
                      :title="item.customData.activities + '(' + item.customData.custName + ')'"
                      width="400"
                      trigger="click"
                      :key="item.key"
                    >
                      <p><span class="el-icon-alarm-clock"></span> {{item.customData.itDate}} -
                        {{item.customData.itEndDate}}</p>
                      <p><span class="el-icon-location-outline"></span> {{item.customData.site}}</p>
                      <p><span class="el-icon-user"></span> {{item.customData.personName}}</p>
                      <div slot="reference" @contextmenu="rowContextmenu(item.customData,$event)">
                        <div style="">
                          <div><span class="el-icon-alarm-clock"></span>{{item.customData.itStartTime}}-{{item.customData.itEndTime}}<span
                            style="margin-left: 10px">{{ item.customData.activities + '(' + item.customData.custName + ')' }}</span>
                          </div>
<!--                          <p v-if="item.customData.site">-->
<!--                            <span class="el-icon-location-outline">{{item.customData.site}}</span>-->
<!--                          </p>-->
                        </div>
                      </div>
                    </el-popover>
                  </div>
                  <!--              </RecycleScroller>-->
                </div>
              </div>
            </template>
          </v-calendar>
        </template>
        <template v-if="isCalendar === '2'">
          <el-button class="brush_right" :class="brushRightHasFilter ? 'red' : ''" @click="brushRight" type="text"
                     icon="el-icon-brush"></el-button>
          <AgGridVue :style="{width:'100%',height: clientHeight+'px'}"
                     class="ag-theme-balham"
                     :columnDefs="columnDefs"
                     :rowData="gridList"
                     rowSelection="multiple"
                     @rowClicked="rowClicked"
                     @grid-ready="onGridReady"
                     :gridOptions="gridOptions"
                     :getContextMenuItems="getContextMenuItems"
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
                     :masterDetail="true"
                     :detailRowAutoHeight="true"
                     :getRowHeight="getRowHeight"
                     :detailCellRendererParams="detailCellRendererParams"
                     keepDetailRows

          >
          </AgGridVue>
          <pagination
            :total="total"
            :page.sync="listQuery.pageNo"
            :limit.sync="listQuery.pageSize"
            @pagination="handleSearch(true)"
            :pageSizes="pageSizesList"
          />
        </template>
      </div>
      <el-dialog
        :title="title"
        append-to-body
        :close-on-click-modal="false"
        :visible.sync="visiable"
        top="5vh"
        width="45%"
        height="80vh"
        class="abow_dialog"
        :before-close="() => closeDialog(false)"
      >
        <template v-if="visiable">
          <div class="box-border" style="height: 80vh;overflow-y: auto;">
            <el-form size="small" class="form-container" label-width="130px">
              <el-row class="first-row">
                <el-col :span="24">
                  <el-form-item label="活动:" class="postInfo-container-item">
                    <div v-if="title === '查看'">{{itineraryData.activities}}</div>
                    <el-input v-else size="mini" v-model="itineraryData.activities" placeholder="请输入"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="first-row">
                <el-col :span="24">
                  <el-form-item label="地点:" class="postInfo-container-item">
                    <div v-if="title === '查看'">{{itineraryData.site}}</div>
                    <el-input v-else size="mini" v-model="itineraryData.site" placeholder="请输入"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="first-row">
                <el-col :span="12">
                  <el-form-item label="开始时间:" class="postInfo-container-item">
                    <div v-if="title === '查看'">{{itineraryData.itStartDate}}</div>
                    <el-date-picker
                      v-else
                      format="yyyy-MM-dd HH:mm:ss"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      v-model="itineraryData.itStartDate"
                      type="datetime"
                      placeholder="选择日期时间">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="日程时区:" class="postInfo-container-item">
                    <div v-if="title === '查看'">{{ itineraryData.timeZoneName }}</div>
                    <el-select  v-else v-model="itineraryData.timeZoneId" filterable clearable @change="changeTimeZone" placeholder="请选择">
                      <el-option
                        v-for="item in timeZoneList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="first-row">
                <el-col :span="12">
                  <el-form-item label="结束时间:" class="postInfo-container-item">
                    <div v-if="title === '查看'">{{itineraryData.itEndDate}}</div>
                    <el-date-picker
                      v-else
                      format="yyyy-MM-dd HH:mm:ss"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      v-model="itineraryData.itEndDate"
                      type="datetime"
                      placeholder="选择日期时间">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="first-row">
                <el-col :span="24">
                  <el-form-item label="企信提醒时间:" class="postInfo-container-item">
                    <div v-for="(wxitem,index) in itineraryData.wxList" style="margin-bottom: 2px">
                      <div v-if="title === '查看'">{{defaultReminderTimes.find(item=>item.value == wxitem.remTime).label}}</div>
                      <el-select v-else v-model="wxitem.remTime" placeholder="请选择" @change="sortWxList">
                        <el-option
                          v-for="item in defaultReminderTimes"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                      <template v-if="title !== '查看'">
                        <el-button icon="el-icon-plus" @click="addWxList" style="padding: 4px" circle></el-button>
                        <el-button v-if="index > 0" icon="el-icon-delete" @click="deleteWxList(index)" style="padding: 4px" circle></el-button>
                      </template>
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="first-row">
                <el-col :span="24">
                  <el-form-item label="outlook提醒时间:" class="postInfo-container-item">
                    <div v-if="title === '查看'">{{defaultReminderTimes.find(item=>item.value == itineraryData.outlookRemTime).label}}</div>
                    <el-select  v-else v-model="itineraryData.outlookRemTime" @change="changeReminderTime" placeholder="请选择">
                      <el-option
                        v-for="item in defaultReminderTimes"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>                
              </el-row>
              <el-row class="first-row">
                <el-col :span="24">
                  <el-form-item label="关联客户:" class="postInfo-container-item">
                    <el-select
                      class="cust-select"
                      :disabled="title === '查看'"
                      v-model="contactCustList"
                      allow-create
                      multiple
                      filterable
                      remote
                      clearable
                      reserve-keyword
                      :remote-method="remoteMethod"
                      @change="$forceUpdate()"
                      placeholder="请选择"
                    >
                      <el-option v-for="itm in custList" :key="itm.custId" :label="itm.name" :value="itm.custId"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="first-row">
                <el-col :span="24">
                  <el-form-item label="外部参会人员:" class="postInfo-container-item">
                    <el-select
                      class="cust-select"
                      :disabled="title === '查看'"
                      v-model="contactUserList"
                      allow-create
                      multiple
                      filterable
                      remote
                      clearable
                      reserve-keyword
                      :remote-method="queryContact"
                      @change="$forceUpdate()"
                      placeholder="请选择"
                    >
                      <el-option v-for="itm in contactList" :key="itm.custContactId" :label="itm.name" :value="itm.custContactId"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="first-row">
                <el-col :span="24">
                  <el-form-item label="礼品:" class="postInfo-container-item">
                    <div v-if="title === '查看'">{{itineraryData.gift}}</div>
                    <el-input v-else size="mini" v-model="itineraryData.gift" placeholder="请输入"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="first-row">
                <el-col :span="24">
                  <el-form-item label="显示颜色:" class="postInfo-container-item">
                    <el-color-picker :disabled="title === '查看'" v-model="itineraryData.color"></el-color-picker>
                    <div class="color-list" v-if="title !== '查看'">
                      <div v-for="color in colors" :key="color" class="color-block" :style="{ backgroundColor: color }" @click="selectColor(color)"></div>
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="first-row">
                <el-col :span="24" style="max-height: 500px">
                  <el-form-item label="人员:" class="postInfo-container-item">
                    <el-button v-if="title !== '查看'" icon="el-icon-edit" size="mini" style="margin-bottom: 5px" @click="meetingPersonnel()">一键获取会议可见人员</el-button>
                    <el-select
                      v-if="title !== '查看'"
                      @change="changePersonId"
                      size="mini"
                      class="edit-border" style="width: 100%;" v-model="itineraryData.personIdList" multiple
                      filterable
                      clearable
                      placeholder="请选择">
                      <el-option
                        v-for="item in $store.getters.userList"
                        :key="item.userId"
                        :label="item.fullname"
                        :value="item.userId">
                        <!--                  <UserIconAndUserName :user-id="item.userId"></UserIconAndUserName>-->
                      </el-option>
                    </el-select>
                    <el-table size="mini" :data="itineraryData.personList" border fit
                              empty-text="暂无数据" highlight-current-row current-row-key style="width: 100%;margin-top: 5px;max-height: 300px;overflow-y: auto">
                      <el-table-column type="index" width="50" label="序号" align="left"></el-table-column>
                      <el-table-column :label="'姓名 ('+itineraryData.personList.length+'人)'" align="left" width>
                        <template slot-scope="scope">
                          <!--                      <el-select size="mini"-->
                          <!--                                 aria-readonly="true"-->
                          <!--                                 class="edit-border" style="width: 100%;" v-model="scope.row.userId"-->
                          <!--                                 filterable-->
                          <!--                                 clearable-->
                          <!--                                 placeholder="请选择">-->
                          <!--                        <el-option-->
                          <!--                          v-for="item in $store.getters.userList"-->
                          <!--                          :key="item.userId"-->
                          <!--                          :label="item.fullname"-->
                          <!--                          :value="item.userId">-->
                          <!--                          &lt;!&ndash;                  <UserIconAndUserName :user-id="item.userId"></UserIconAndUserName>&ndash;&gt;-->
                          <!--                        </el-option>-->
                          <!--                      </el-select>-->
                          {{$store.getters.userList.find(i => i.userId === scope.row.userId) &&
                        $store.getters.userList.find(i => i.userId === scope.row.userId).fullname}}
                        </template>
                      </el-table-column>
                      <el-table-column label="企信提醒" align="left" width>
                        <template slot-scope="scope">
                          <div v-if="title === '查看'">{{scope.row.wx ? '是' : '否'}}</div>
                          <el-radio-group v-else v-model="scope.row.wx">
                            <el-radio :disabled="!isRemind" :label='1'>是</el-radio>
                            <el-radio :label='0'>否</el-radio>
                          </el-radio-group>
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-form-item>
                </el-col>
              </el-row>
              <div class="divider">
          <span>
              活动描述
          </span>
              </div>
              <el-input :readonly="title === '查看'" type="textarea" v-model="itineraryData.details"
                        :autosize="{ minRows: 4}"
                        placeholder="[活动描述]:"></el-input>

              <div class="divider">
          <span>
              活动备注
          </span>
              </div>
              <el-input :readonly="title === '查看'" type="textarea" v-model="itineraryData.memo" :autosize="{ minRows: 4}"
                        placeholder="[活动备注]:"></el-input>

            </el-form>
          </div>
          <div class="fl-ac-jc">
            <el-button size="small" style="width: 100px;margin-right: 0px" @click="() => closeDialog(false)">取 消
            </el-button>
            <el-button v-if="title !== '查看'" size="small" type="primary" style="width: 100px;margin-right: 0px"
                       @click="submitItinerary">确 定
            </el-button>
          </div>
        </template>
      </el-dialog>

      <el-dialog
        title="默认企信提醒设置"
        append-to-body
        :close-on-click-modal="false"
        :visible.sync="defaultQxView"
        width="35%"
      >
        <el-table
          class="el-table1"
          :data="qxSettings"
          style="width: 99.5%;"
          border
          maxHeight="280"
        >
          <el-table-column label="提前天数" width="250px">
            <template slot-scope="scope">
              <el-select
                v-model="scope.row.days"
                filterable
                allow-create
                default-first-option
                placeholder="请选择提前天数"
                size="mini"
                @change="sortDefaultWxRemind">
                <el-option
                  v-for="item in defaultDays"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="提醒时间" width="250px">
            <template slot-scope="scope">
              <el-time-picker
                v-model="scope.row.time"
                :format="'HH:mm'"
                value-format="HH:mm"
                size="mini"
                placeholder="任意时间点"
                @change="sortDefaultWxRemind">
              </el-time-picker>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" icon="el-icon-plus" circle @click="addDefaultWxRemind"></el-button>
              <el-button v-if="scope.$index > 0" size="mini" type="danger" icon="el-icon-minus" circle
                         @click="deleteDefaultWxRemind(scope.$index)"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <span slot="footer" class="fl-ac-jc">
          <el-button size="mini" type="primary" @click="submitQxSetting">确定</el-button>
          <el-button size="mini" type="" @click="defaultQxView = false">取消</el-button>
        </span>
      </el-dialog>

      <el-dialog
        title="企信提醒配置"
        append-to-body
        :close-on-click-modal="false"
        :visible.sync="qxView"
        width="40%"
      >
        <el-button type="primary" icon="el-icon-edit" size="mini" style="margin-bottom: 5px" @click="inSyncPersonnel()">一键获取日程所有人员</el-button>
        <virtual-select class="virtual-select" :isUser="true" clearable multiple
                        :data="$store.getters.userList"
                        v-model="configUserList" filterable
                        :render="(data)=>$commonUtils.UserRender(data,this)" placeholder="可接受所有日程企信提醒人员选择">
        </virtual-select>
        <el-tabs v-model="qxActiveName" tab-position="left" style="margin-top:20px;height: 260px">
          <el-tab-pane v-for="item in qxConfigList" :label="item.itDate" :name="item.itDate">
<!--            <el-radio-group v-model="item.wxList.length>0 ? 2 : 1">-->
              <el-radio v-model="item.wxList.length>0 ? 2 : 1" :label="1" @click.native="reminderSettings(1,item)">默认提醒</el-radio>
              <el-radio v-model="item.wxList.length>0 ? 2 : 1" :label="2" @click.native="reminderSettings(2,item)">自定义提醒</el-radio>
<!--            </el-radio-group>-->
            <div v-if="item.wxList.length <= 0">
              <el-table
                class="el-table1"
                :data="defaultQxSetting"
                style="width: 99.5%;margin-top: 20px"
                border
                maxHeight="280"
              >
                <el-table-column label="提前天数">
                  <template slot-scope="scope">
                    {{ defaultDays.find(i => i.value == scope.row.days) ? defaultDays.find(i => i.value == scope.row.days).label : ''  }}
                  </template>
                </el-table-column>
                <el-table-column label="提醒时间">
                  <template slot-scope="scope">
                    {{ scope.row.time }}
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <el-table
              v-else
              class="el-table1"
              :data="item.wxList"
              style="width: 99.5%;margin-top: 20px"
              border
              maxHeight="280"
            >
              <el-table-column label="提前天数" width="250px">
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.days"
                    filterable
                    allow-create
                    default-first-option
                    placeholder="请选择提前天数"
                    size="mini"
                    @change="sortWxRemind(item)">
                    <el-option
                      v-for="item in defaultDays"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="提醒时间" width="250px">
                <template slot-scope="scope">
                  <el-time-picker
                    v-model="scope.row.time"
                    :format="'HH:mm'"
                    value-format="HH:mm"
                    size="mini"
                    placeholder="任意时间点"
                    @change="sortWxRemind(item)">
                  </el-time-picker>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button size="mini" type="primary" icon="el-icon-plus" circle @click="addWxRemind(item)"></el-button>
                  <el-button v-if="scope.$index > 0" size="mini" type="danger" icon="el-icon-minus" circle
                             @click="deleteWxRemind(item,scope.$index)"></el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
        <span slot="footer" class="fl-ac-jc">
        <el-button size="mini" type="primary" @click="submitConfig">确定</el-button>
        <el-button size="mini" type="" @click="qxView = false">取消</el-button>
      </span>
      </el-dialog>

      <el-dialog
        title="同步outlook配置"
        append-to-body
        :close-on-click-modal="false"
        :visible.sync="outlookView"
        width="45%"
      >
        <!-- <el-button type="primary" icon="el-icon-edit" size="mini" style="margin-bottom: 5px" @click="inSyncPersonnel()">一键获取日程所有人员</el-button> -->
        <virtual-select class="virtual-select" :isUser="true" clearable multiple
                        :data="$store.getters.userList"
                        v-model="configUserList" filterable
                        :render="(data)=>$commonUtils.UserRender(data,this)">
        </virtual-select>
        <span slot="footer" class="fl-ac-jc">
        <el-button size="mini" type="primary" @click="submitOutlookConfig">确定</el-button>
        <el-button size="mini" type="" @click="outlookView = false">取消</el-button>
      </span>
      </el-dialog>

      <el-dialog
        :title="meetTitle"
        append-to-body
        :close-on-click-modal="false"
        :visible.sync="meetView"
        width="45%"
        height="80%"
        class="abow_dialog"
        :before-close="() => closeMeetDialog(false)"
      >
        <template v-if="meetView">
          <div class="box-border">
            <el-form size="small" class="form-container" label-width="120px">
              <el-row class="first-row">
                <el-col :span="24">
                  <el-form-item label="名称:" class="postInfo-container-item">
                    <div v-if="meetTitle === '查看'">{{meetData.title}}</div>
                    <el-input v-else size="mini" v-model="meetData.title" placeholder="请输入"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="first-row">
                <el-col :span="24">
                  <el-form-item label="地点:" class="postInfo-container-item">
                    <div v-if="meetTitle === '查看'">{{meetData.site}}</div>
                    <el-input v-else size="mini" v-model="meetData.site" placeholder="请输入"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="first-row">
                <el-col :span="12">
                  <el-form-item label="开始时间:" class="postInfo-container-item">
                    <div v-if="meetTitle === '查看'">{{meetData.mStartDate}}</div>
                    <el-date-picker
                      v-else
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                      v-model="meetData.mStartDate"
                      type="date"
                      placeholder="选择日期">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="结束时间:" class="postInfo-container-item">
                    <div v-if="meetTitle === '查看'">{{meetData.mEndDate}}</div>
                    <el-date-picker
                      v-else
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                      v-model="meetData.mEndDate"
                      type="date"
                      placeholder="选择日期">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="first-row">
                <el-col :span="24">
                  <el-form-item label="会议组织人:" class="postInfo-container-item">
                    <el-multi-cascader
                      ref="multiCascader"
                      :disabled="meetTitle === '查看'"
                      :show-all-levels="false"
                      :options="$store.getters.userList"
                      multiple
                      filterable
                      :clearable="meetTitle !== '查看'"
                      :props="{label: 'fullname', value: 'userId'}"
                      change-on-select
                      selectChildren
                      v-model="organizerList"></el-multi-cascader>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="first-row">
                <el-col :span="24">
                  <el-form-item label="可见参会人:" class="postInfo-container-item">
                    <el-multi-cascader
                      ref="multiCascader1"
                      :disabled="meetTitle === '查看'"
                      :show-all-levels="false"
                      :options="$store.getters.userList"
                      multiple
                      filterable
                      :clearable="meetTitle !== '查看'"
                      :props="{label: 'fullname', value: 'userId'}"
                      change-on-select
                      selectChildren
                      v-model="userIdList"></el-multi-cascader>
                  </el-form-item>
                </el-col>
              </el-row> 
              <el-row class="first-row">
                <el-col :span="24">
                  <el-form-item label="可见组:" class="postInfo-container-item">
                    <el-multi-cascader
                      ref="multiCascader"
                      :disabled="meetTitle === '查看'"
                      :show-all-levels="false"
                      :options="deptGroups"
                      multiple
                      filterable
                      :clearable="meetTitle !== '查看'"
                      change-on-select
                      selectChildren
                      v-model="wkgIdList"></el-multi-cascader>
                  </el-form-item>
                </el-col>
              </el-row>
              <div class="divider">
            <span>
                会议备注
            </span>
              </div>
              <el-input :readonly="meetTitle === '查看'" type="textarea" v-model="meetData.memo" :autosize="{ minRows: 4}"
                        placeholder="[会议备注]:"></el-input>

            </el-form>
          </div>
          <div class="fl-ac-jc">
            <el-button size="small" style="width: 100px;margin-right: 0px" @click="() => closeMeetDialog(false)">取 消
            </el-button>
            <el-button v-if="meetTitle !== '查看'" size="small" type="primary" style="width: 100px;margin-right: 0px"
                       @click="submitMeet">确 定
            </el-button>
          </div>
        </template>
      </el-dialog>
      
      <el-dialog title="日程导入" :visible.sync="updateScheduleVisible" width="400px" @close="handleSearch" :close-on-click-modal="false" :close-on-press-escape="false">
        <UpdateSchedule :scheduleMeId="scheduleMeId"></UpdateSchedule>
      </el-dialog>

    </template>
    <div v-show="searchPage" class="container-search">
      <div class="search-div">
        <el-input placeholder="输入搜索内容" v-model="searchInput" class="input-with-select" @change="searchItinerary">
          <el-button slot="append" type="primary" icon="el-icon-search" @change="searchItinerary">搜索</el-button>
        </el-input>
        <el-button type="text" class="clear-button" @click="clearSearchItinerary">取消搜索</el-button>
      </div>
      <div class="search-content">
        <div v-if="searchList.length > 0">
          <span class="search-total">共<b>{{ searchList.length }}</b>条搜索结果</span>
          <ul class="activity-list">
            <li v-for="item in searchList" :key="item.id" class="activity-item" :style="'border: 2px solid '+item.color">
              <div class="activity-info">
                <h3 item="activity-title">
                  {{ item.activities }}
                  <span class="attendees">{{item.personList.map(i => i.userName).join(',')}}</span>
                </h3>
                <p class="activity-time">
                  <span>开始时间: {{ item.itStartDate }}</span> -
                  <span>结束时间: {{ item.itEndDate }}</span>
                </p>
                <p class="activity-description">{{ item.details }}</p>
                <p class="activity-description">{{ item.site }}</p>
              </div>
            </li>
          </ul>
        </div>
        <svg-icon v-else style="width: 100%;height:100%" icon-class="暂无日程"/>
      </div>
    </div>
  </div>
</template>

<script>
  import {RecycleScroller} from 'vue-virtual-scroller'
  import { queryDeptGroup, queryCustomerNameId } from '@/api/caseList.js'
  import { queryHehuoren, queryContactByName } from '@/api/customerList.js'
  import {
    createItinerary, deleteItinerary,
    modifyItinerary,
    queryItineraryDetail,
    queryItineraryList,
    sendItineraryForOutlook,
    queryItineraryConfigUser,
    queryMeetingwxList,
    queryDeptGroupUser,
    queryTimeZone
  } from "@/api/schedule";
  import Pagination from '@/components/Pagination'
  import {
    configItineraryUser,
    createMeeting, deleteMeeting,
    modifyMeeting,
    queryItineraryUser,
    queryMeetingList,
    queryDefaultMeetingwxList,
    saveMeetingwx
  } from "../../../api/schedule";
  import {queryPerformanceDetailByUserId} from "../../../api/customerList";
  import { makeTree } from '../../../utils'
  import user from '../../../store/modules/user';
  import UpdateSchedule from './components/UpdateSchedule';

  const month = new Date().getMonth();
  const year = new Date().getFullYear();
  export default {
    name: "index",
    props: {},
    data() {
      let tableHeader = []
      if (localStorage.getItem('tableHeader') && JSON.parse(localStorage.getItem('tableHeader')).find(item => item.name == this.$options.name)) {
        tableHeader = JSON.parse(localStorage.getItem('tableHeader')).find(item => item.name == this.$options.name).tableHeader
      }
      return {
        date: new Date(),
        meetTitle: '',
        meetView: false,
        detailCellRendererParams: {
          detailGridOptions: {
            rowSelection: 'multiple',
            columnDefs: [],
            resizable: true,
            getContextMenuItems: this.getContextMenuItems1,
          },
          dragStopped: this.dragStopped,
          getDetailRowData: params => {
            // 数据插入
            this.queryDataInfo(params)
          },
        },
        defaultQxView: false,
        qxView: false,
        outlookView: false,
        pageSizesList: [10, 50, 200, 500, 1000],
        total: 0,
        queryModuleData: {
          createDateArray: [],
          userId: undefined,
          activities: undefined,
          details: undefined,
          site: undefined
        },
        gridList: [],
        searchInput: '',
        searchList: [], // 搜索结果列表
        calendarKey: '',
        initialTrigger: true, // 初始触发
        updateScheduleVisible: false, // 日程导入弹窗
        meetingId: '',
        meetingList: [],
        isSelectAll: true,
        searchPage: false,
        queryUserList: [], // 当前会议勾选查看人员
        mettingUserList: [], // 当前会议日程关联会议人员列表
        meetingListTotal: '',
        organizerList: [], // 会议组织人
        userIdList: [],
        wkgIdList: [],
        partnerUserList: [], // 合伙人列表
        deptGroups: [], // 部门工作组
        contactCustList: [], // 关联客户
        contactUserList: [], // 客户负责人
        scheduleMeId: 0, // 会议id
        colors: ['#ff0000','#FA5363','#ff7c00','#cc28d5','#7b3bff','#00c7ba','#00b853','#409eff'],
        defaultDays: [
          { label: '当天', value: 0 },
          { label: '开始前1天', value: 1 },
          { label: '开始前2天', value: 2 },
          { label: '开始前7天', value: 7 }
        ],
        defaultReminderTimes: [
          { label: '不提醒', value: 0 },
          { label: '开始前15分钟', value: 15 },
          { label: '开始前30分钟', value: 30 },
          { label: '开始前1小时', value: 60 },
          { label: '开始前2小时', value: 120 },
          { label: '开始前1天', value: 1440 },
          { label: '开始前2天', value: 2880 },
          { label: '开始前7天', value: 10080 }
        ],
        tableHeader,
        isCalendar: '1',
        visiable: false,
        title: '',
        itineraryData: {
          personList: [],
          personIdList: [],
          activities: '',
          site: '',
          itStartDate: '',
          itEndDate: '',
          details: '',
          color: '#409EFF',
          gift: '',
          memo: '',
          wxList: [
            { remTime: 0 }
          ],
          outlookRemTime: 0
        },
        columnDefs: [
          // {
          //   headerName: '序号',
          //   field: 'sid',
          //   width: 70,
          //   enableRowGroup: true,
          //   resizable: true,
          //   floatingFilter: true,
          //   filter: false,
          //   cellClass: 'vAlign',
          //   suppressMenu: true,
          //   checkboxSelection: false,
          //   headerCheckboxSelection: false,
          //   headerCheckboxSelectionFilteredOnly: true,
          //   cellRenderer: this.cellRenderer,
          // },
          {
            headerName: '会议',
            field: 'title',
            resizable: true,
            sortable: true,
            autoHeight: true,
            filter: 'agSetColumnFilter',
            cellRenderer: this.cellRenderer,
            menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
            enableRowGroup: true,
            filterParams: {
              defaultToNothingSelected: true,
              newRowsAction: 'keep',
              comparator: (a, b) => {
                return this.$commonUtils.sort(a, b, 'title')
              }
            }
          },
          {
            headerName: '开始时间',
            field: 'mStartDate',
            resizable: true,
            sortable: true,
            autoHeight: true,
            filter: 'agSetColumnFilter',
            cellRenderer: this.cellRenderer,
            menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
            enableRowGroup: true,
            filterParams: {
              defaultToNothingSelected: true,
              newRowsAction: 'keep',
              comparator: (a, b) => {
                return this.$commonUtils.sort(a, b, 'mStartDate')
              }
            }
          },
          {
            headerName: '结束时间',
            field: 'mEndDate',
            resizable: true,
            sortable: true,
            autoHeight: true,
            filter: 'agSetColumnFilter',
            cellRenderer: this.cellRenderer,
            menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
            enableRowGroup: true,
            filterParams: {
              defaultToNothingSelected: true,
              newRowsAction: 'keep',
              comparator: (a, b) => {
                return this.$commonUtils.sort(a, b, 'mEndDate')
              }
            }
          },
          {
            headerName: '会议地点',
            field: 'site',
            resizable: true,
            sortable: true,
            autoHeight: true,
            filter: 'agSetColumnFilter',
            cellRenderer: this.cellRenderer,
            menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
            enableRowGroup: true,
            filterParams: {
              defaultToNothingSelected: true,
              newRowsAction: 'keep',
              comparator: (a, b) => {
                return this.$commonUtils.sort(a, b, 'site')
              }
            }
          },
          {
            headerName: '备注',
            field: 'memo',
            resizable: true,
            sortable: true,
            autoHeight: true,
            filter: 'agSetColumnFilter',
            cellRenderer: this.cellRenderer,
            menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
            enableRowGroup: true,
            filterParams: {
              defaultToNothingSelected: true,
              newRowsAction: 'keep',
              comparator: (a, b) => {
                return this.$commonUtils.sort(a, b, 'memo')
              }
            }
          },
          {
            headerName: '同步outlook',
            field: 'sendCalendar',
            resizable: true,
            sortable: true,
            autoHeight: true,
            filter: 'agSetColumnFilter',
            cellRenderer: this.cellRenderer,
            menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
            enableRowGroup: true,
            filterParams: {
              defaultToNothingSelected: true,
              newRowsAction: 'keep',
              comparator: (a, b) => {
                return this.$commonUtils.sort(a, b, 'sendCalendar')
              }
            }
          }
        ],
        columnDefs1: [
          {
            headerName: '序号',
            field: 'sid',
            width: 70,
            enableRowGroup: true,
            resizable: true,
            floatingFilter: true,
            filter: false,
            cellClass: 'vAlign',
            suppressMenu: true,
            checkboxSelection: false,
            headerCheckboxSelection: false,
            headerCheckboxSelectionFilteredOnly: true,
            cellRenderer: this.cellRenderer1,
          },
          {
            headerName: '活动',
            field: 'activities',
            resizable: true,
            sortable: true,
            width: 300,
            autoHeight: true,
            filter: 'agSetColumnFilter',
            cellRenderer: this.cellRenderer1,
            menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
            enableRowGroup: true,
            filterParams: {
              defaultToNothingSelected: true,
              newRowsAction: 'keep',
              comparator: (a, b) => {
                return this.$commonUtils.sort(a, b, 'activities')
              }
            }
          },
          // {
          //   headerName: '人员',
          //   field: 'personList',
          //   resizable: true,
          //   sortable: true,
          //   width: this.getLoactionWidth('人员') == 'auto' ? 200 : this.getLoactionWidth('人员'),
          //   autoHeight: true,
          //   filter: 'agSetColumnFilter',
          //   cellRenderer: this.cellRenderer1,
          //   menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
          //   enableRowGroup: true,
          //   filterParams: {
          //     defaultToNothingSelected: true,
          //     newRowsAction: 'keep',
          //     comparator: (a, b) => {
          //       return this.$commonUtils.sort(a, b, 'personList')
          //     }
          //   }
          // },
          {
            headerName: '开始时间',
            field: 'itStartDate',
            resizable: true,
            sortable: true,
            width: this.getLoactionWidth('开始时间') == 'auto' ? 200 : this.getLoactionWidth('开始时间'),
            autoHeight: true,
            filter: 'agSetColumnFilter',
            cellRenderer: this.cellRenderer1,
            menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
            enableRowGroup: true,
            filterParams: {
              defaultToNothingSelected: true,
              newRowsAction: 'keep',
              comparator: (a, b) => {
                return this.$commonUtils.sort(a, b, 'itDate')
              }
            }
          },
          {
            headerName: '结束时间',
            field: 'itEndDate',
            resizable: true,
            sortable: true,
            width: this.getLoactionWidth('结束时间') == 'auto' ? 200 : this.getLoactionWidth('结束时间'),
            autoHeight: true,
            filter: 'agSetColumnFilter',
            cellRenderer: this.cellRenderer1,
            menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
            enableRowGroup: true,
            filterParams: {
              defaultToNothingSelected: true,
              newRowsAction: 'keep',
              comparator: (a, b) => {
                return this.$commonUtils.sort(a, b, 'itEndDate')
              }
            }
          },
          {
            headerName: '地点',
            field: 'site',
            resizable: true,
            sortable: true,
            width: this.getLoactionWidth('地点') == 'auto' ? 300 : this.getLoactionWidth('地点'),
            autoHeight: true,
            filter: 'agSetColumnFilter',
            cellRenderer: this.cellRenderer1,
            menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
            enableRowGroup: true,
            filterParams: {
              defaultToNothingSelected: true,
              newRowsAction: 'keep',
              comparator: (a, b) => {
                return this.$commonUtils.sort(a, b, 'site')
              }
            }
          },
          {
            headerName: '活动描述',
            field: 'details',
            resizable: true,
            sortable: true,
            width: this.getLoactionWidth('活动描述') == 'auto' ? 200 : this.getLoactionWidth('活动描述'),
            autoHeight: true,
            filter: 'agSetColumnFilter',
            cellRenderer: this.cellRenderer1,
            menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
            enableRowGroup: true,
            filterParams: {
              defaultToNothingSelected: true,
              newRowsAction: 'keep',
              comparator: (a, b) => {
                return this.$commonUtils.sort(a, b, 'details')
              }
            }
          },
          {
            headerName: '备注',
            field: 'memo',
            resizable: true,
            sortable: true,
            width: this.getLoactionWidth('备注') == 'auto' ? 200 : this.getLoactionWidth('备注'),
            autoHeight: true,
            filter: 'agSetColumnFilter',
            cellRenderer: this.cellRenderer1,
            menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
            enableRowGroup: true,
            filterParams: {
              defaultToNothingSelected: true,
              newRowsAction: 'keep',
              comparator: (a, b) => {
                return this.$commonUtils.sort(a, b, 'memo')
              }
            }
          },
          {
            headerName: '礼品',
            field: 'gift',
            resizable: true,
            sortable: true,
            width: this.getLoactionWidth('礼品') == 'auto' ? 200 : this.getLoactionWidth('礼品'),
            autoHeight: true,
            filter: 'agSetColumnFilter',
            cellRenderer: this.cellRenderer1,
            menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
            enableRowGroup: true,
            filterParams: {
              defaultToNothingSelected: true,
              newRowsAction: 'keep',
              comparator: (a, b) => {
                return this.$commonUtils.sort(a, b, 'gift')
              }
            },
          },
          {
            headerName: '客户名称',
            field: 'custName',
            resizable: true,
            sortable: true,
            width: this.getLoactionWidth('客户名称') == 'auto' ? 200 : this.getLoactionWidth('客户名称'),
            autoHeight: true,
            filter: 'agSetColumnFilter',
            cellRenderer: this.cellRenderer1,
            menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
            enableRowGroup: true,
            filterParams: {
              defaultToNothingSelected: true,
              newRowsAction: 'keep',
              comparator: (a, b) => {
                return this.$commonUtils.sort(a, b, 'custName')
              }
            },
          },
          {
            headerName: '参会人员',
            field: 'personName',
            resizable: true,
            sortable: true,
            width: this.getLoactionWidth('参会人员') == 'auto' ? 200 : this.getLoactionWidth('参会人员'),
            autoHeight: true,
            filter: 'agSetColumnFilter',
            cellRenderer: this.cellRenderer1,
            menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
            enableRowGroup: true,
            filterParams: {
              defaultToNothingSelected: true,
              newRowsAction: 'keep',
              comparator: (a, b) => {
                return this.$commonUtils.sort(a, b, 'custName')
              }
            },
          },
        ],
        masks: {
          weekdays: 'WWW',
        },
        page: {},
        attributes: [],
        smallCalendarAttributes: [],
        gridApi: {},
        columnApi: {},
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
        brushRightHasFilter: false,
        drawerState: false,
        listQuery: {
          pageSize: JSON.parse(localStorage.getItem('pageSize')) ? JSON.parse(localStorage.getItem('pageSize')).find(item => item.name == this.$route.name) ? JSON.parse(localStorage.getItem('pageSize')).find(item => item.name == this.$route.name).pageSize : 10 : 10,
          pageNo: 1
        },
        configUserList: [],
        meetData: {
          title: undefined,
          site: undefined,
          mStartDate: undefined,
          mEndDate: undefined,
          memo: undefined,
          userIdList: undefined,
          wkgIdList: undefined
        },
        custList: [],
        contactList: [],
        contactCustListContrast: [], // 客户备份
        contactListContrast: [], // 客户负责人备份
        qxSettings: [], // 默认企信配置方案
        defaultQxSetting: [],
        qxActiveName: '',
        qxConfigList: [],
        flattenedData: [],
        cascaderOptions: [],
        timeZoneList: [],
        isRemind: false, // 是否提醒
      }
    },
    computed: {
      clientHeight() {
        return document.documentElement.clientHeight - 185
      }
    },
    watch: {
      isCalendar: {
        handler(n) {
          this.queryModuleData = {
            createDateArray: [],
            userId: undefined,
            activities: undefined,
            details: undefined,
            site: undefined,
            title: undefined,
          }
          if (n === '2') {
            this.handleSearch()
          }
        },
        immediate: true
      },
      queryUserList: {
        handler (n) {
          const newKey = this.generateNewKey();
          // 更新组件的 key 属性
          this.calendarKey = newKey;
          this.initialTrigger = true
        }
      },
      qxActiveName: {
        handler (n) {
          console.log('qxActiveName',n)
        }
      }
    },
    created() {
      this.detailCellRendererParams.detailGridOptions.columnDefs = this.columnDefs1
      this.queryDeptGroup()
      this.queryMeetingList()
      this.saveLocation()
      this.queryTimeZone()
    },
    methods: {
      // 参会人级联初始化，地域+工作组+子部门+人员（废弃）
      // flattenData(data) {
      //   const flattenedData = [];
      //   data.forEach(department => {
      //     const departmentData = {
      //       value: department.deptId,
      //       label: department.deptName,
      //       parent: 0,
      //       children: []
      //     };

      //     // 处理同级的工作组
      //     if (department.workGroupList && department.workGroupList.length > 0) {
      //       department.workGroupList.forEach(group => {
      //         // 添加工作组
      //         const groupData = {
      //           value: group.wkgId,
      //           label: group.wkgName,
      //           parent: group.deptId,
      //           children: []
      //         };

      //         // 添加工作组下的成员（只有fullname字段有值的）
      //         if (group.groupMemberList && group.groupMemberList.length > 0) {
      //           group.groupMemberList.forEach(member => {
      //             if (member.fullname) {
      //               groupData.children.push({
      //                 value: member.userId,
      //                 label: member.fullname,
      //                 parent: member.wkgId,
      //                 isLeaf: true // 设置为叶子节点，因为成员没有子级
      //               });
      //             }
      //           });
      //         }

      //         // 只有工作组下有成员才添加到部门的children中
      //         if (groupData.children.length > 0) {
      //           departmentData.children.push(groupData);
      //         }
      //       });
      //     }

      //     // 处理子部门
      //     if (department.children && department.children.length > 0) {
      //       department.children.forEach(child => {
      //         const childData = {
      //           value: child.deptId,
      //           label: child.deptName,
      //           parent: child.parent,
      //           children: []
      //         };

      //         // 处理子部门下的工作组和成员
      //         if (child.workGroupList && child.workGroupList.length > 0) {
      //           child.workGroupList.forEach(group => {
      //             // 添加工作组
      //             const groupData = {
      //               value: group.wkgId,
      //               label: group.wkgName,
      //               parent: group.deptId,
      //               children: []
      //             };

      //             // 添加工作组下的成员（只有fullname字段有值的）
      //             if (group.groupMemberList && group.groupMemberList.length > 0) {
      //               group.groupMemberList.forEach(member => {
      //                 if (member.fullname) {
      //                   groupData.children.push({
      //                     value: member.userId,
      //                     label: member.fullname,
      //                     parent: member.wkgId,
      //                     isLeaf: true // 设置为叶子节点，因为成员没有子级
      //                   });
      //                 }
      //               });
      //             }

      //             // 只有工作组下有成员才添加到子部门的children中
      //             if (groupData.children.length > 0) {
      //               childData.children.push(groupData);
      //             }
      //           });
      //         }

      //         // 只有子部门下有工作组和成员才添加到部门的children中
      //         if (childData.children.length > 0) {
      //           departmentData.children.push(childData);
      //         }
      //       });
      //     }

      //     // 只有部门下有子部门、工作组和成员才添加到显示列表中
      //     if (departmentData.children.length > 0) {
      //       flattenedData.push(departmentData);
      //     }
      //   });

      //   this.cascaderOptions = flattenedData;
      //   console.log('this.cascaderOptions', this.cascaderOptions);
      // },
      // 获取时区
      queryTimeZone() {
        queryTimeZone().then(res => {
          this.timeZoneList = res.data
        })
      },
      // 选择时区，存储名称
      changeTimeZone() {
        if(this.itineraryData.timeZoneId) {
          this.itineraryData.timeZoneName = this.timeZoneList.find(item=>item.value == this.itineraryData.timeZoneId).label
        }
      },
      // 提醒操作，一键操作
      changeReminderTime() {
        if(this.itineraryData.remTime == 0){
          
        }
        if(this.itineraryData.outlookRemTime == 0){

        }
      },
      // 一键获取日程所有人员
      inSyncPersonnel() {
        queryItineraryUser({ meId: this.getSelectedRows()[0].meId }).then(res => {
          this.configUserList = res.data
        })
      },
      // 一键获取会议可见人员
      meetingPersonnel() {
        var userList = this.gridList.find(item => item.meId == this.getSelectedRows()[0].meId).userIdList
        this.$set(this.itineraryData, 'personIdList', userList)
        var personList = []
        personList = userList.map(item => {
          return {
            userId: item,
            wx: 0
          }
        })
        this.$set(this.itineraryData, 'personList', personList)
      },
      // 提醒设置
      reminderSettings(type,row) {
        if (type == 1){
          this.$set(row,'isEdit',true)
          this.$set(row,'wxList',[])
        }else{
          this.$set(row,'wxList',[{
            days: undefined,
            time: undefined
          }])
        }
      },
      // 添加关联日期企信提醒
      addWxRemind(item) {
        this.$set(item,'isEdit',true)
        item.wxList.push({
          days: 0,
          time: ''
        })
      },
      // 删除关联日期企信提醒
      deleteWxRemind(item,index) {
        this.$set(item,'isEdit',true)
        item.wxList.splice(index,1)
      },
      // 默认关联日期企信提醒排序
      sortWxRemind(item) {
        this.$set(item,'isEdit',true)
        item.wxList.sort((a, b) => {
          // 首先按照 days 字段进行升序排序
          if (a.days !== b.days) {
            return a.days - b.days;
          }

          // 如果 days 字段相同，则按照 time 字段进行排序
          const [hourA, minuteA] = a.time.split(':').map(Number);
          const [hourB, minuteB] = b.time.split(':').map(Number);
          const timeA = hourA * 60 + minuteA;
          const timeB = hourB * 60 + minuteB;
          return timeA - timeB;
        });
      },
      // 添加默认企信提醒
      addDefaultWxRemind() {
        this.qxSettings.push({
          days: 0,
          time: ''
        })
      },
      // 默认企信提醒排序
      sortDefaultWxRemind() {
        this.qxSettings.sort((a, b) => {
          // 首先按照 days 字段进行升序排序
          if (a.days !== b.days) {
            return a.days - b.days;
          }

          // 如果 days 字段相同，则按照 time 字段进行排序
          const [hourA, minuteA] = a.time.split(':').map(Number);
          const [hourB, minuteB] = b.time.split(':').map(Number);
          const timeA = hourA * 60 + minuteA;
          const timeB = hourB * 60 + minuteB;
          return timeA - timeB;
        });
      },
      // 删除默认企信提醒
      deleteDefaultWxRemind(index) {
        this.qxSettings.splice(index,1)
      },
      // 日程企信提醒排序
      sortWxList() {
        const hasZeroRemTime = this.itineraryData.wxList.some(item => item.remTime === 0);
        // 如果设置为不提醒进行处理
        if (hasZeroRemTime) {
          this.isRemind = false
          this.itineraryData.wxList = [{ remTime: 0 }]
          this.itineraryData.personList = this.itineraryData.personList.map(item => {
              return { ...item, wx: 0 };
          });
        }else{
          this.isRemind = true
          this.itineraryData.wxList.sort(function(a, b){
          return a.remTime - b.remTime
        })
        }
      },
      // 日程企信提醒添加
      addWxList() {
        this.itineraryData.wxList.push({
          remTime: ''
        })
      },
      // 日程企信提醒删除
      deleteWxList(index) {
        this.itineraryData.wxList.splice(index,1)
      },
      // 提交企信默认配置
      submitQxSetting() {
        // var meetingwxList = this.qxSettings.map(item => {
        //   return {
        //     ...item,
        //     meId: this.getSelectedRows()[0].meId
        //   };
        // })
        saveMeetingwx({ meId: this.getSelectedRows()[0].meId,meetingwxList: this.qxSettings}).then(
          res => {
            if (res.success) {
              this.$message.success('设置成功!')
              this.defaultQxView = false
            }
          }
        );
      },
      remoteMethod(value) {
        queryCustomerNameId({pageNo: 1, pageSize: 20, keyword: value}).then(
          res => {
            this.custList = res.data
            this.contactCustListContrast = this.contactCustListContrast.concat(res.data);
          }
        );
      },
      queryContact(value) {
        queryContactByName({name: value}).then(
          res => {
            this.contactList = res.data
            this.contactListContrast = this.contactListContrast.concat(res.data);
          }
        );
      },
      // 选择默认颜色
      selectColor(color) {
        this.itineraryData.color = color
      },
      // 颜色编码转RGB
      hexToRgb(hex) {
        // 去除颜色代码中的'#'字符
        hex = hex.replace('#', '');

        // 拆分颜色代码为红、绿、蓝三个部分
        const red = parseInt(hex.substr(0, 2), 16);
        const green = parseInt(hex.substr(2, 2), 16);
        const blue = parseInt(hex.substr(4, 2), 16);

        // 返回RGB格式字符串
        return `rgb(${red}, ${green}, ${blue},0.2)`;
      },
      // 取消日程搜索
      clearSearchItinerary() {
        this.searchPage = false
        this.searchInput = ''
        this.searchList = []
      },
      // 搜索日程
      searchItinerary() {
        this.searchPage = true
        queryItineraryList({
          meId: this.meetingId,
          kuaijie: this.searchInput,
          userIdList: this.queryUserList.length > 0 ? this.queryUserList : [0],
          pageSize: 999999
        }).then(res => {
          this.searchList = res.data
        })
      },
      // 让右侧大日历也跟随切换
      handleMonthUpdate(date) {
        const calendar = this.$refs.calendar
        calendar && calendar.move(date)
      },
      // 执行相关的页码更新操作
      handleUpdateToPage(page) {
        const datepicker = this.$refs.datepicker
        datepicker && datepicker.move(page)
        if (this.calendarKey && this.initialTrigger) {
          this.initialTrigger = false
          this.updateToPage(page);
        }
      },
      generateNewKey() {
        // 生成一个随机数作为新的 key 值
        return Math.random().toString(36).substr(2, 8);
      },
      // 选中用户列表
      selectUserList(checkAll) {
        if (checkAll) {
          this.queryUserList = JSON.parse(JSON.stringify(this.mettingUserList))
        }else{
          this.queryUserList = []
        }
      },
      queryUserName(userId){
        if (this.$store.getters.userList.find(i => i.userId === userId)){
          return this.$store.getters.userList.find(i => i.userId === userId).fullname
        }
      },
      // 会议选择
      meetingSelect(meId) {
        if (this.meetingId == meId)return;
        this.meetingId = meId
        // this.initialTrigger = true
        this.queryItineraryUser()
      },
      // 获取会议列表，并获取会议日程人员
      queryMeetingList() {
        queryMeetingList().then(res => {
          this.meetingList = res.data
          this.meetingListTotal = res.total
          if (this.meetingList.length > 0){
            this.meetingId = this.meetingList[this.meetingList.length-1]['meId']
            this.queryItineraryUser()
          }
        })
      },
      // 左侧选中会议日程关联会议
      queryItineraryUser() {
        queryItineraryUser({ meId: this.meetingId }).then(res => {
          this.mettingUserList = res.data
          this.isSelectAll = true
          this.queryUserList = JSON.parse(JSON.stringify(this.mettingUserList))
        })
      },
      queryDeptGroup() {
        // queryDeptGroupUser().then(res => {
        //   this.cascaderOptions = res.data
        //   this.flattenedData = []
        //   this.cascaderOptions.forEach(department => {
        //     // 为一级部门添加parentId属性
        //     if (!department.parentId) {
        //       department.parentId = 0;
        //     }
        //   });
        // })
        queryDeptGroup().then(res => {
          this.deptGroups = res.data
          this.processOrgData(this.deptGroups)
        })
      },
      // 递归处理部门数据
      processOrgData(data, level = 1) {
        data.forEach((item) => {
          item.parent = 0;

          if (level === 2) {
            item.parent = item.parentId;
          } else if (level === 3) {
            item.parent = item.deptId;
          }

          if (item.children && item.children.length > 0) {
            this.processOrgData(item.children, level + 1);
          }
        });
      },
      submitMeet() {        
        this.meetData.userIdList = this.userIdList.map(arr => arr[arr.length - 1]);
        this.meetData.organizerList = this.organizerList.map(arr => arr[arr.length - 1]);
        this.meetData.wkgIdList = this.wkgIdList.map(arr => arr[arr.length - 1]);
        if (this.meetTitle === '新建') {
          createMeeting(this.meetData).then(res => {
            this.$message.success('会议创建成功!')
            this.closeMeetDialog(true)
          })
        } else {
          modifyMeeting(this.meetData).then(res => {
            this.$message.success('会议修改成功!')
            this.closeMeetDialog(true)
          })
        }
      },
      closeMeetDialog(isSearch) {
        this.meetView = false
        this.meetTitle = ''
        this.userIdList = []
        this.organizerList = []
        this.wkgIdList = []
        this.meetData = {
          title: undefined,
          site: undefined,
          mStartDate: undefined,
          mEndDate: undefined,
          memo: undefined
        }
        isSearch === true && this.handleSearch()
      },
      createMeetFunc() {
        this.meetView = true
        this.meetTitle = '新建'
      },
      rowClicked(params) {
        if(params.node.data.itCount && params.node.data.itCount > 0) {
          if (params.node.expanded) {
            params.node.setExpanded(false);
          } else {
            params.node.setExpanded(true);
          }
          this.columnDefs.push({})
          this.columnDefs.pop()
        }
      },
      getContextMenuItemsChild(params) {
        console.log('getContextMenuItemsChild', params)
      },
      queryDataInfo(params) {
        queryItineraryList({
          meId: params.data.meId,
          pageSize: 999999
        }).then(res => {
          this.$nextTick(() => {
            params.successCallback(res.data || [])
          })
        })
      },
      getRowHeight(params) {
        if (params.node && params.node.detail) {
          var allDetailRowHeight = params.data.itCount * 28 + 76
          return allDetailRowHeight < 120 ? 120 : allDetailRowHeight
        }
      },
      submitConfig() {
        if (!this.configUserList.length) {
          this.$message.error('请选择提醒人！')
          return
        }
        var qxConfigList = []
        this.qxConfigList.map(item => {
          // var meetingwxList = item.wxList.map(res => {
          //   return Object.assign({}, res, { meId: this.getSelectedRows()[0].meId });
          // });
          if (item.isEdit){
            qxConfigList.push({
              itDate: item.itDate,
              meId: this.getSelectedRows()[0].meId,
              meetingwxList: item.wxList
            })
          }
        })
        // return false
        configItineraryUser({
          userIdList: this.configUserList,
          sendType: 1,
          meId: this.getSelectedRows()[0].meId
        }).then(res => {
          this.$message.success('配置成功!')
          this.qxView = false
        })
        qxConfigList.map(item => {
          saveMeetingwx(item).then(res => {});
        })
      },
      submitOutlookConfig() {
        if (!this.configUserList.length) {
          this.$message.error('请选择提醒人！')
          return
        }
        configItineraryUser({
          userIdList: this.configUserList,
          sendType: 2,
          meId: this.getSelectedRows()[0].meId
        }).then(res => {
          this.$message.success('配置成功!')
          this.outlookView = false
        })
      },
      // 默认企信设置
      defaultQxConfig() {
        if (!this.getSelectedRows().length) {
          this.$message.error('请先选择会议,进行设置默认提醒!')
          return
        }
        this.defaultQxView = true
        this.queryDefaultMeetingwxList(this.getSelectedRows()[0].meId)
      },
      queryDefaultMeetingwxList(meId) {
        queryDefaultMeetingwxList({ meId: meId }).then(res => {
          if (res.data.length > 0) {
            this.qxSettings = res.data
            this.defaultQxSetting = res.data
          } else {
            this.qxSettings = [{
              days: undefined,
              time: undefined
            }]
          }
        })
      },
      // 会议企信提醒配置
      qxConfig() {
        if (!this.getSelectedRows().length) {
          this.$message.error('请先选择会议!')
          return
        }
        this.qxView = true
        queryItineraryConfigUser({ meId: this.getSelectedRows()[0].meId, sendType: 1 }).then(res => {
          this.configUserList = res.data
        })
        queryMeetingwxList({ meId: this.getSelectedRows()[0].meId }).then(res => {
          if (res.data.length > 0){
            this.qxConfigList = res.data
            this.qxActiveName = res.data[0].itDate
          }
        })
        this.queryDefaultMeetingwxList(this.getSelectedRows()[0].meId)
      },
      outlookConfig() {
        if (!this.getSelectedRows().length) {
          this.$message.error('请先选择会议!')
          return
        }
        this.outlookView = true
        queryItineraryConfigUser({ meId: this.getSelectedRows()[0].meId, sendType: 2 }).then(res => {
          this.configUserList = res.data
        })
      },
      sendItineraryForOutlook() {
        if (!this.getSelectedRows().length) {
          this.$message.error('请先选择会议!')
          return
        }
        if (this.getSelectedRows()[0].sendCalendar) {
          this.$message.warning('当前会议已设置自动同步outlook')
          return
        }
        sendItineraryForOutlook({ meId: this.getSelectedRows()[0].meId }).then(res => {
          if (res.success) {
            this.$message.success('会议日程已设置自动发送到用户的outlook日历')
            this.handleSearch()
          }
        })
      },
      handleSearch(flag) {
        this.clickoutside()
        if (!flag) {
          this.listQuery.pageNo = 1
        }
        if (localStorage.getItem('isCalendar') === '2') {
          queryMeetingList({...this.listQuery, ...this.queryModuleData}).then(res => {
            this.gridList = res.data
            this.total = res.total
          })
        } else {
          // 这一部分用不到了，原搜索功能，可实时把结果返回在日历上，但和左侧有冲突，进行关闭
          // this.$refs.calendar.refreshPages()
        }

      },
      clearSearch() {
        this.queryModuleData = {
          createDateArray: [],
          userId: undefined,
          activities: undefined,
          details: undefined,
          site: undefined,
          title: undefined,
        }
      },
      clickoutside() {
        this.drawerState = false
      },
      getLoactionWidth(label) {
        if (!localStorage.getItem('tableHeader')) {
          return 150
        } else {
          var arr = JSON.parse(localStorage.getItem('tableHeader'))
          if (arr.find(item => item.name == this.$options.name)) {
            var header = arr.find(item => item.name == this.$options.name).tableHeader
            if (header.find(item => item.label == label)) {
              return header.find(item => item.label == label).width
            } else {
              return 150
            }
          } else {
            return 150
          }
        }
      },
      getSidDiv(params) {
        const h = this.$createElement;
        let vnode = h('div', {
            on: {
              // click: () => this.rowClicked(params)
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
                title: `${params.value}`
              }
            }, [`${params.value}`])
          ]
        )
        const div = document.createElement('div');
        this.__patch__(div, vnode, true, false)
        return div
      },
      cellRenderer(params) {
        if (params.colDef.field == 'title' && (params.node.data.itCount && params.node.data.itCount > 0)) {
          return this.getSidDiv(params)
        }
        if (params.colDef.field == 'sendCalendar') {
          return params.node.data.sendCalendar ? '已同步' : '未同步'
        }
        if (params.colDef.field == 'personList') {
          return `<span title="${params.value.map(item => item.userName).join(',')}">${params.value.map(item => item.userName).join(',')}</span>`
        }
        return `<span title="${params.value}">${params.value ? params.value : ''}</span>`
      },
      cellRenderer1(params) {
        if (params.colDef.field == 'sid') {
          return params.rowIndex + 1
        }
        if (params.colDef.field == 'personList') {
          return `<span title="${params.value.map(item => item.userName).join(',')}">${params.value.map(item => item.userName).join(',')}</span>`
        }
        return `<span title="${params.value}">${params.value ? params.value : ''}</span>`
      },
      brushRight() {
        let arr = this.columnDefs.map(item => item.field)// Object.keys(data)
        arr.forEach(item => {
          this.gridApi.destroyFilter(item)
        })
        this.brushRightHasFilter = false
      },
      onGridReady(params) {
        this.gridApi = params.api;
        this.columnApi = params.columnApi;
        params.api.sizeColumnsToFit()
      },
      dragStopped(params) {
        let tableHeader = params.columnApi.columnController.gridColumns.map(item => ({
          label: item.colDef.headerName,
          width: item.actualWidth,
          prop: item.colDef.field,
        })).filter(item => item.prop != 'sid' && item.prop != "group")
        var arr = JSON.parse(localStorage.getItem('tableHeader'))
        arr.find(item => item.name == this.$options.name).tableHeader = tableHeader
        localStorage.setItem('tableHeader', JSON.stringify(arr))
      },
      saveLocation() {
        if (!localStorage.getItem('tableHeader')) {
          let arr = []
          arr.push({name: this.$options.name, tableHeader: this.tableHeader})
          localStorage.setItem('tableHeader', JSON.stringify(arr))
        } else {
          let arr = JSON.parse(localStorage.getItem('tableHeader'))
          if (arr.find(item => item.name == this.$options.name)) {
            arr.find(item => item.name == this.$options.name).tableHeader = this.tableHeader
            localStorage.setItem('tableHeader', JSON.stringify(arr))
          } else {
            arr.push({name: this.$options.name, tableHeader: this.tableHeader})
            localStorage.setItem('tableHeader', JSON.stringify(arr))
          }
        }
      },
      getContextMenuItems(params) {
        if (!params.node || !params.node.data) {
          return []
        }
        return this.getRowContextmenuList(params.node.data).map(item => ({
          name: item.name,
          action: () => {
            this[item.action](params.node.data, params.value, params.node)
          }
        }))
      },
      getContextMenuItems1(params) {
        if (!params.node || !params.node.data) {
          return []
        }
        return this.getRowContextmenuList1(params.node.data).map(item => ({
          name: item.name,
          action: () => {
            this[item.action](params.node.data, params.value, params.node)
          }
        }))
      },
      rowDoubleClicked(params) {
        this.view(params.data)
      },
      refreshEvenRowsCurrencyData(params) {
        // this.currentPageSize = params.api.rowModel.rootNode.allChildrenCount
        if (!params.columnApi.columnController.groupAutoColumns) {
          this.gridApi.forEachNode(rowNode => {
            rowNode.setDataValue(
              'sid',
              rowNode.rowIndex + 1)
          })
        }
        if (Object.keys(this.gridApi.getFilterModel()).length) {
          this.brushRightHasFilter = true
        } else {
          this.brushRightHasFilter = false
        }
      },
      changeView() {
        if (this.isCalendar === '1') {
          this.isCalendar = '2'
          localStorage.setItem('isCalendar', '2')
        } else {
          this.isCalendar = '1'
          localStorage.setItem('isCalendar', '1')
        }
      },
      delFunc(row) {
        this.$confirm('确定要删除该日程吗, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteItinerary({
            itId: row.itId
          }).then(res => {
            this.$message.success('删除成功！')
            this.closeDialog(true)
          })
        })
      },
      changePersonId(value) {
        this.$set(this.itineraryData, 'personList', value.map(item => ({
          userId: item,
          wx: 0
        })))
      },
      closeDialog(isSearch) {
        this.visiable = false
        this.title = ''
        this.itineraryData = {
          personList: [],
          personIdList: [],
          activities: '',
          site: '',
          itStartDate: '',
          itEndDate: '',
          details: '',
          color: '#409EFF',
          gift: '',
          memo: '',
          wxList: [
            { remTime: 0 }
          ],
          outlookRemTime: 0
        }
        isSearch === true && this.isCalendar === '1' && this.$refs.calendar.refreshPages()
        isSearch === true && this.isCalendar === '2' && this.handleSearch()
      },
      // 初始数据
      defaultInitData() {
        this.contactList = []
        this.contactCustListContrast = []
        this.contactListContrast = []
        this.contactCustList = []
        this.contactUserList = []
        this.custList = []
      },
      createFunc() {
        if (!this.getSelectedRows().length) {
          this.$message.error('请先选择会议!')
          return
        }
        this.visiable = true
        this.title = '新建'
        this.defaultInitData()
      },
      // 导入日程
      importSchedule() {
        if (!this.getSelectedRows().length) {
          this.$message.error('请先选择会议!')
          return
        }
        this.updateScheduleVisible = true
        this.scheduleMeId = this.getSelectedRows()[0].meId
      },
      // 处理关联客户
      changeCustList(){
        var custList = []
        this.contactCustList.forEach(item => {
          if(!isNaN(item)){
            custList.push({
              custId: item,
              custName: this.contactCustListContrast.find(user => user.custId == item).name
            })
          }else{
            custList.push({
              custName: item
            })
          }
        })
        this.itineraryData.custList = custList
      },
      // 处理关联外部联系人
      changeContactList(){
        var externalPersonnelList = []
        this.contactUserList.forEach(item => {
          if(!isNaN(item)){
            externalPersonnelList.push({
              custContactId: item,
              personName: this.contactListContrast.find(user => user.custContactId == item).name
            })
          }else{
            externalPersonnelList.push({
              personName: item
            })
          }
        })
        this.itineraryData.externalPersonnelList = externalPersonnelList
      },
      submitItinerary() {
        if (this.title === '新建') {
          this.changeCustList()
          this.changeContactList()
          createItinerary({...this.itineraryData, meId: this.getSelectedRows()[0].meId}).then(res => {
            this.$message.success('创建成功!')
            this.defaultInitData()
            this.closeDialog(true)
          })
        } else {
          this.changeCustList()
          this.changeContactList()
          modifyItinerary(this.itineraryData).then(res => {
            this.$message.success('修改成功!')
            this.defaultInitData()
            this.closeDialog(true)
          })
        }
      },
      takeSee(row) {
        this.$router.push(`/workbench/seeTimeLimit/${row.tltId}`)
      },
      add0(m) {
        return m < 10 ? '0' + m : m
      },
      updateToPage(page) {
        this.attributes = []
        const data = {
          createDateArray: [page.year + '-' + this.add0(page.month) + '-01', page.year + '-' + this.add0(page.month) + '-31'], ...{
            meId: this.meetingId,
            userIdList: this.queryUserList.length > 0 ? this.queryUserList : [0],
            pageNo: 1,
            pageSize: 100000
          }, ...this.queryModuleData
        }
        queryItineraryList(data).then(res => {
          const uniqueDates = []
          this.attributes = res.data.map(item => {
            const dates = new Date(item.itStartDate)
            const dateString = dates.toISOString().split('T')[0];
            if (uniqueDates.every(i => i.dates.toISOString().split('T')[0] !== dateString)) {
              uniqueDates.push({
                dot: 'red',
                dates: dates
              })
            }
            return {
              key: item.tltId,
              customData: item,
              // dates: [{start: new Date(item.itDate), end: new Date(item.itEndDate)}]
              dates: dates
            }
          })
          this.smallCalendarAttributes = uniqueDates
        })

      },
      edit(row) {
        this.defaultInitData()
        queryItineraryDetail({
          itId: row.itId
        }).then(res => {
          this.visiable = true
          this.title = '修改'
          this.itineraryData = res.data
          this.itineraryData.color = res.data.color ? res.data.color : '#409EFF'
          this.itineraryData.custIdList = [];
          const tempCustList = []
          const editContactCustList = []
          const editContactList = []
          // if (res.data.custList.length > 0) {
          //   res.data.custList.forEach(item => {
          //     this.itineraryData.custIdList.push(item.custId);
          //     tempCustList.push({
          //       custId: item.custId,
          //       name: item.custName
          //     });
          //   });
          //   this.$nextTick(()=>{
          //     this.$set(this,'custList', tempCustList)
          //   })
          // }
          // 关联客户
          if (res.data.custList.length > 0) {
            this.contactCustList = []
            this.contactCustListContrast = []
            res.data.custList.forEach(item => {
              this.custList.push({
                custId: item.custId,
                name: item.custName
              });
              if(item.custId){
                this.contactCustList.push(item.custId)
              }else{
                this.contactCustList.push(item.custName)
              }
              editContactCustList.push({
                custId: item.custId,
                name: item.custName
              });
            });
            this.$nextTick(()=>{
              this.$set(this,'custList', editContactCustList)
              this.$set(this,'contactCustListContrast', editContactCustList)
            })
          }
          // 外部参会人
          if (res.data.externalPersonnelList.length > 0) {
            this.contactUserList = []
            this.contactListContrast = []
            res.data.externalPersonnelList.forEach(item => {
              if(item.custContactId){
                this.contactUserList.push(item.custContactId)
              }else{
                this.contactUserList.push(item.personName)
              }
              editContactList.push({
                custContactId: item.custContactId,
                name: item.personName
              });
            });
            this.$nextTick(()=>{
              this.$set(this,'contactList', editContactList)
              this.$set(this,'contactListContrast', editContactList)
            })
          }
          this.$set(this.itineraryData, 'personIdList', this.itineraryData.personList.map(item => item.userId))
        })
      },
      view(row) {
        this.defaultInitData()
        queryItineraryDetail({
          itId: row.itId
        }).then(res => {
          this.visiable = true
          this.title = '查看'
          this.itineraryData = res.data
          this.itineraryData.color = res.data.color ? res.data.color : '#409EFF'
          this.itineraryData.custIdList = [];
          this.custList = [];
          const viewContactCustList = []
          const viewContactList = []
          // 关联客户
          if (res.data.custList.length > 0) {
            this.contactCustList = []
            this.contactCustListContrast = []
            res.data.custList.forEach(item => {
              if(item.custId){
                this.contactCustList.push(item.custId)
              }else{
                this.contactCustList.push(item.custName)
              }
              viewContactCustList.push({
                custId: item.custId,
                name: item.custName
              });
            });
            this.$nextTick(()=>{
              this.$set(this,'custList', viewContactCustList)
              this.$set(this,'contactCustListContrast', viewContactCustList)
            })
          }
          // 外部参会人
          if (res.data.externalPersonnelList.length > 0) {
            this.contactUserList = []
            this.contactListContrast = []
            res.data.externalPersonnelList.forEach(item => {
              if(item.custContactId){
                this.contactUserList.push(item.custContactId)
              }else{
                this.contactUserList.push(item.personName)
              }
              viewContactList.push({
                custContactId: item.custContactId,
                name: item.personName
              });
            });
            this.$nextTick(()=>{
              this.$set(this,'contactList', viewContactList)
              this.$set(this,'contactListContrast', viewContactList)
            })
          }
          // this.$set(this.itineraryData, 'personIdList', this.itineraryData.personList.map(item => item.userId))
        })
      },
      getRowContextmenuList1(row) {
        return [
          {name: '查看', action: 'view'},
          {name: '修改', action: 'edit', permissions: 406,},
          // { name: '审核', action: 'takeExamine', permissions:41, isSign:1 },
          // { name: '修改', action: 'takemodify', permissions:125, kind:1},
          // { name: '修改', action: 'takemodify', permissions:126, kind:2},
          {name: '删除', action: 'delFunc', permissions: 406},
          // { name: '删除', action: 'delTimelimit', permissions:128, kind:2 },
          // { name: '撤销', action: 'revocationTimelimitWriteoff',permissions:227, isRevocation:true }
        ].filter(item => {
          if (item.permissions) {
            if (item.isRevocation) {
              return this.$store.getters.permissions.includes(item.permissions) || row.isRevocation
            } else {
              return this.$store.getters.permissions.includes(item.permissions)
            }
          } else {
            return true
          }
        })
      },
      viewMeet(row) {
        this.meetView = true
        this.meetData = row
        this.handleUserAndWkgGroup()
        this.meetTitle = '查看'
      },
      editMeet(row) {
        this.meetView = true
        this.meetData = row
        this.handleUserAndWkgGroup()
        this.meetTitle = '修改'
      },
      // 处理可见合伙人，工作组级联关系
      handleUserAndWkgGroup() {
        this.userIdList = this.meetData.userIdList.map(arr => [arr]);
        this.organizerList = this.meetData.organizerList.map(arr => [arr]);
        let wkgList = []
        this.meetData.wkgIdList.map(item => {
          var wkg = this.$commonUtils.extractTree(this.$commonUtils.findParentLevel(this.deptGroups, 'value', [item], 'parent', 'children'), 'children').map(item => item.value)
          wkgList.push(wkg)
        })
        this.wkgIdList = wkgList
      },
      delMeet(row) {
        this.$confirm('确定要删除该会议以及所有日程吗, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteMeeting({
            meId: row.meId
          }).then(res => {
            this.$message.success('删除成功!')
            this.closeMeetDialog(true)
          })
        })
      },
      getRowContextmenuList(row) {
        return [
          {name: '查看', action: 'viewMeet'},
          {name: '修改', action: 'editMeet', permissions: 406,},
          {name: '删除', action: 'delMeet', permissions: 406,},
        ].filter(item => {
          if (item.permissions) {
            if (item.isRevocation) {
              return this.$store.getters.permissions.includes(item.permissions) || row.isRevocation
            } else {
              return this.$store.getters.permissions.includes(item.permissions)
            }
          } else {
            return true
          }
        })
      },
      rowContextmenu(row, event) {
        const that = this
        this.$ContextMenu({
          event, // 传入鼠标事件
          menu: this.getRowContextmenuList1(row)
        }).then(rs => {
          if (rs) {
            // this.$emit('action', rs, row)
            this[rs](row)
          }
        });
      },
      getSelectedRows() {
        if (this.gridApi) {
          const selectedNodes = this.gridApi.getSelectedNodes();
          const selectedData = selectedNodes.map(node => node.data);
          return selectedData
        }
      },
      getStyle(item) {
        if (item.isSign === 1) {
          return {color: '#14800B'}
        }
        if (item.isSign === 2) {
          return {color: '#c9c9c9'}
        }
        var startTime = item.abslimitDate
        startTime = new Date(startTime).getTime()
        var endTime = new Date().getTime()
        var nextDay = new Date(this.$commonUtils.formatDate(new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toLocaleDateString())).getTime()
        if (startTime <= nextDay && startTime > endTime) {
          return {color: '#131EEA'}
        }
        if (startTime < endTime) {
          return {color: '#FB1E1E'}
        }
        return {color: '#333'}
      }
    },
    components: {
      'RecycleScroller': RecycleScroller,
      Pagination,
      UpdateSchedule,
    }

  }
</script>

<style lang="scss" scoped>
@import "~@/styles/icons/font_4138936_qsm1p7503k.css";
.container {
  display: flex;
}

.container-search{
  width: 100%;
  .search-div {
    width: 500px;
    margin: auto;
    display: flex;
  }
  .clear-button {
    margin-left: 10px;
  }
  .search-content {
    margin-top: 20px;
    width: 80%;
    height: 80vh;
    margin: 0 auto;
  }

  .search-total{
    font-size: 14px;
    color: #666;
    display: block;
    margin-bottom: 5px;
    b {
      color: #52A0F5;
      margin: 0 3px;
    }
  }

  .activity-list {
    list-style: none;
    padding: 0;
  }

  .activity-item {
    border: 2px solid #ccc;
    border-radius: 4px;
    padding: 16px;
    margin-bottom: 16px;
  }

  .activity-title {
    font-size: 18px;
    margin-top: 0;
    margin-bottom: 8px;
  }

  .activity-time {
    font-size: 14px;
  }

  .activity-description {
    font-size: 14px;
    color: #666;
  }

  .activity-title {
    display: flex;
    align-items: center;
    margin-bottom: 4px;
  }

  .attendees {
    margin-left: 8px;
    font-size: 14px;
    color: #409eff;
  }
}

.container-left {
  width: 240px;
  border: 1px solid #b8c2cc;
}
.left-search {
  display: flex;
  align-items: center;
  margin: 15px 0;
  .input-field {
    width: 160px;
    margin-left: 15px;
    /deep/ .el-input__inner{
      height: 35px;
    }
  }

  .create-button {
    width: 35px;
    height: 35px;
    padding: 0px;
    margin-left: 15px;
  }
}
.left-calendar {
  margin: 20px 0 0;
  width: 100%;
  /deep/ .vc-container {
    border: 0;
  }
  /deep/ .vc-pane{
    min-width: 238px;
  }
  /deep/ .vc-weeks{
    min-width: 238px;
  }
}
.left-list {
  padding: 10px 10px 10px 15px;
  letter-spacing: 1px;
  .list-title {
    font-size: 14px;
    color: #a0aec0;
  }
  .list-content {
    margin-top: 10px;
    font-size: 14px;
    height: 450px;
    overflow: auto;
    p {
      margin-bottom: 10px;
      cursor: pointer;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    i {
      color: #409EFF;
    }
    .user-list {
      max-height: 300px;
      overflow: auto;
      margin-right: 5px;
    }
  }
}
.cust-select {
  display: flex;
}
.container-right {
  flex-grow: 1;
  width: calc(100% - 240px); /* 设置宽度为剩余空间 */
}

  /*  ::-webkit-scrollbar {*/
  /*  width: 0px;*/
  /*}*/
  /*::-webkit-scrollbar-track {*/
  /*  display: none;*/
  /*}*/
  ::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 1px;
  }

  ::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 10px;
    background-color: skyblue;
    background-image: -webkit-linear-gradient(
        45deg,
        rgba(255, 255, 255, 0.2) 25%,
        transparent 25%,
        transparent 50%,
        rgba(255, 255, 255, 0.2) 50%,
        rgba(255, 255, 255, 0.2) 75%,
        transparent 75%,
        transparent
    );
  }

  ::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #ededed;
    border-radius: 10px;
  }

  /deep/ .custom-calendar.vc-container {
    --day-border: 1px solid #b8c2cc;
    --day-border-highlight: 1px solid #b8c2cc;
    --day-width: 90px;
    --day-height: 120px;
    --weekday-bg: #f8fafc;
    --weekday-border: 1px solid #eaeaea;
    border-radius: 0;
    width: 100%;

    & .vc-header {
      background-color: #f1f5f8;
      padding: 10px 0;
    }

    & .vc-weeks {
      padding: 0;
    }

    & .vc-weekday {
      background-color: var(--weekday-bg);
      border-bottom: var(--weekday-border);
      border-top: var(--weekday-border);
      padding: 5px 0;
    }

    & .vc-day {
      padding: 0 5px 3px 5px;
      text-align: left;
      height: var(--day-height);
      min-width: var(--day-width);
      background-color: white;

      &.weekday-1,
      &.weekday-7 {
        background-color: #eff8ff;
      }

      &:not(.on-bottom) {
        border-bottom: var(--day-border);

        &.weekday-1 {
          border-bottom: var(--day-border-highlight);
        }
      }

      &:not(.on-right) {
        border-right: var(--day-border);
      }
    }

    & .vc-day-dots {
      margin-bottom: 5px;
    }
  }

  .overflow-auto {
    overflow: auto;
  }

  .flex {
    display: flex;
    flex-direction: column;
  }

  .flex-grow {
    flex: 1;
  }

  .h-full {
    height: 100%;
  }

  .text-xs {
    background-color: #fcf4db;
    border-radius: 2px;
    cursor: pointer;
    font-size: 14px;
    margin-bottom: 5px;
  }

  .text-xs:hover {
    background-color: #ffd9b9;
    border-radius: 2px;
  }

  /deep/ .svg-icon {
    float: right;
    color: red;
  }

  .scroller {
    height: 100%;
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

  > > > .el-dialog__body {
    padding-top: 0 !important;
  }

  .el-table /deep/ th {
    background-color: #f2f2f2;
    color: #333333;
    height: 30px;
    line-height: 30px;
    padding: 0px !important;
  }



  .brush_right {
    position: absolute;
    right: 40px;
    z-index: 1;
    top: 50px;
  }

  .buttonWrap {
    width: 100%;
    text-align: center;
    display: flex;
    justify-content: center;
  }

  .button-group-search {
    position: relative;
    display: flex;

    .searchWrap {
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
      box-shadow: 0 3px 6px rgba(111, 111, 111, 0.2);

      /deep/ .el-form {
        padding: 20px 20px 50px 0;

        .el-form-item__label {
          text-align: right;
          padding-left: 32px;
          font-weight: normal;
        }

        .el-form-item__content {
          display: flex;

          input {
            border-top: 0;
            border-left: 0;
            border-radius: 0;
            border-right: 0
          }

          .el-radio {
            line-height: 28px;
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

  .searchRight {
    border-top-right-radius: 3px !important;
    border-bottom-right-radius: 3px !important;
    padding: 0 5px;
    height: 32px
  }

  > > > .vue-recycle-scroller__item-wrapper {
    /*overflow: auto;*/
  }

  .leading-tight {
  }

  .it-row {
    background-color: rgba(64, 158, 255, 0.2);
    font-size: 14px;
    border-left: 5px solid #409eff;
    margin-bottom: 2px;
    padding-left: 3px;
    cursor: pointer;
  }

  .virtual-select /deep/ {
    .jh-virtual-select {
      height: auto;
      width: 100%;

    }

    .jh-virtual-select > .content .inner-input {
      flex: 1;
    }
  }

  /deep/ .rotateClass {
    transform: rotate(90deg);
    transition: transform 5s ease-in-out
  }

  .el-cascader{
    width: 100%;
  }

  /deep/ .el-color-picker--small {
    float: left;
  }

  .color-list {
    display: flex;
    float: left;
    margin: 6px 10px;
  }

  .color-block {
    width: 20px;
    height: 20px;
    margin-right: 10px;
    cursor: pointer;
    border-radius: 50%;
  }
  .cascader-container {  
    max-height: 300px; /* 设置你想要的最大高度 */  
    overflow-y: auto; /* 在超出时显示垂直滚动条 */  
  } 
</style>
