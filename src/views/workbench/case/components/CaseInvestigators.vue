<template>
  <div class="app-container">

    <el-form :model="caseDetailFoemData" label-width="140px" class="form-container" ref="postForm1" size="small">
      <div class="createPost-main-container">
        <div class="form-con">
          <el-row class="form-border">
            <el-col :span="24">
              <el-row>
                <el-col :span="24" class="tilteSpan">
                  <span id="-title">办案人</span>
                </el-col>
              </el-row>
              <el-row class="fullRow patent ">
                <el-col :span="24">
                  <el-form-item class="postInfo-container-item">
                    <template slot="label"><span class="required-asterisk">*</span>客户负责人</template>
                    <el-select 
                      v-model="caseDetailFoemData.caseCustRespUserArray" 
                      filterable
                      default-first-option
                      multiple
                      v-if="isEdit"
                      value-key='userId'
                       @change="changeHanlder"
                    >
                      <el-option v-for="item in custUserList" :key="item.userId" :label="item.fullname" :value="item"></el-option>
                    </el-select>
                    <span v-else>{{custUserNameFormat(caseDetailFoemData.caseCustRespUserArray) }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="fullRow patent " v-if="isCustwork!='cb'">
                <el-col :span="24">
                  <el-form-item class="postInfo-container-item" label="客户组：" :rules="[{required: true, message: '请选择客户组', trigger: 'change'}]">
                    <template>
                      <span v-if="!isEdit"> {{caseDetailFoemData.trademarkCaseCustWorkgroups[0].groupName}}</span>
                      <el-select v-if="isEdit" :class="{seeType:!isEdit}" :clearable="true" @change="khzChange" remote :remote-method="khzFilterText"
                                 default-first-option filterable placeholder=""
                                 v-model="caseDetailFoemData.trademarkCaseCustWorkgroups[0].wkgId">
                        <el-option :key="key" :label="item.groupName" :value="item.wkgId"
                                   v-for="(item,key) in custfilterGroup"/>
                      </el-select>
                      <el-button v-if="isEdit" @click="addgroupCy('khz','')" size="mini" style="margin-left:10px"
                                 type="primary">
                        添加成员
                      </el-button>
                      <el-button @click="cyshow=!cyshow" size="mini" style="margin-left:10px;float:right"
                                 type="primary">
                        {{cyshow?'收起':'查看'}}
                      </el-button>
                      <el-row v-if="cyshow" class="fullRow table-dl-row" style="margin-top: 5px">
                        <el-col :span="24">
                          <el-table
                            :data="KHData"
                            border current-row-key empty-text="暂无数据" fit highlight-current-row
                            style="width: 100%;" >
                            <el-table-column align="left" label="成员姓名" width>
                              <template slot-scope="scope">
                                <!-- <el-select :clearable='true' placeholder="请选择" v-model="scope.row.fullname" filterable>
                                          <el-option v-for="(item,key) in selectData.username" :key="key" :label="item"
                                            :value="item">
                                          </el-option>
                                        </el-select> -->
                                <span>{{ scope.row.fullname }}</span>
                              </template>
                            </el-table-column>
                            <el-table-column align="left" label="案件角色" width>
                              <template slot-scope="scope">
                                <el-select v-if="isEdit" :clearable='true' placeholder="请选择"
                                           v-model="scope.row.caseRoleName" @change="(v)=>{changeCaseRole(v, scope.row.fullname, 1)}" filterable>
                                  <el-option v-for="(item,key)  in caseRoleNameList.filter(i=>i.id.includes('客户'))"
                                             :disabled="caseRoleSelectList.includes(item.id)" :key="key"
                                             :label="item.id"
                                             :value="item.id">
                                  </el-option>
                                </el-select>
                                <span v-else>{{scope.row.caseRoleName}}</span>
                              </template>
                            </el-table-column>
                            <el-table-column align="left" label="成员角色" width>
                              <template slot-scope="scope">
                                <!-- <el-select :clearable='true' placeholder="请选择" v-model="scope.row.roleId" filterable>
                                          <el-option v-for="(item,key)  in selectData.rolename" :key="key" :label="item.name"
                                            :value="item.roleId">
                                          </el-option>
                                        </el-select> -->
<!--                                <span>{{ scope.row.roleName }}</span>-->
                                <span>{{ KHNameList.find(item=>item.userId == scope.row.userId )&&KHNameList.find(item=>item.userId == scope.row.userId ).roleNameListStr | filterName }}</span>
                              </template>
                            </el-table-column>
                            <el-table-column align="left" label="核定工时" width>
                              <template slot-scope="scope">
                                <span>{{scope.row.approvedTime}}</span>
                              </template>
                            </el-table-column>
                            <el-table-column v-if="isEdit" align="left" label="操作" width>
                              <template slot-scope="scope">
                                <el-button v-if="isEdit" @click="delKhgroup(scope.row.userId)" size="mini" type="text">删除
                                </el-button>
                              </template>
                            </el-table-column>
                          </el-table>
                        </el-col>
                      </el-row>
                    </template>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row class="fullRow patent table-dl-row" v-if="isCustwork!='cust'">
                <el-col :span="24">
                  <el-form-item class="postInfo-container-item" label="承办组:">
                    <template>
                      <div style="display: flex;justify-content: space-between">
                        <div v-if="statusChange">
                          <el-radio-group v-model="caseDetailFoemData.updateWorkType" style="margin-left: 10px">
                            <el-radio :label='1'>保持不变</el-radio>
                            <el-radio :label='3'>置空</el-radio>
                            <el-radio :label='2'>修改</el-radio>
                          </el-radio-group>
                        </div>
                        <div v-if="caseDetailFoemData.updateWorkType == 2 || !statusChange"
                             style="flex: 1;margin-left: 10px;">
                          <el-row :key="key" class="fullRow "
                                  v-for="(item,key) in CBData">
                            <el-col :span="24">
                              <el-form-item class="postInfo-container-item">
                                <template>
                                  <el-col :span="24" style="text-align:right">
                                    <span style="float:left">{{item.groupName}}</span>
                                    <el-button v-if="isEdit" @click="addgroupCy('cbz',key)" size="mini"
                                               style="margin-left:10px" type="">
                                      新增成员
                                    </el-button>
                                    <el-button v-if="isEdit" @click="delgroupCb(key)" size="mini"
                                               style="margin-left:10px" type="">
                                      删除组
                                    </el-button>

                                  </el-col>
                                  <el-table v-if="cbshow" :data="item.trademarkCaseWorkgroupMembers" border
                                            current-row-key empty-text="暂无数据" fit highlight-current-row size="mini"
                                            style="width: 100%;" >

                                    <el-table-column align="left" label="成员姓名" width>
                                      <template slot-scope="scope">
                                        <!-- <el-select :clearable='true' placeholder="请选择" v-model="scope.row.fullname"
                                          filterable>
                                          <el-option v-for="(item,key) in selectData.username" :key="key" :label="item"
                                            :value="item">
                                          </el-option>
                                        </el-select> -->
                                        <span>{{ scope.row.fullname }}</span>
                                      </template>
                                    </el-table-column>
                                    <el-table-column align="left" label="案件角色" width>
                                      <template slot-scope="scope">
                                        <el-select v-if="isEdit" :clearable='true' placeholder="请选择"
                                                   v-model="scope.row.caseRoleName" @change="(v)=>{changeCaseRole(v, scope.row.fullname, 2)}" filterable>
                                          <el-option v-for="(item,key)  in caseRoleNameList.filter(i=>i.id.includes('承办'))"
                                                     :disabled="caseRoleSelectList.includes(item.id)" :key="key"
                                                     :label="item.id"
                                                     :value="item.id">
                                          </el-option>
                                        </el-select>
                                        <span v-else>{{scope.row.caseRoleName}}</span>
                                      </template>
                                    </el-table-column>
                                    <el-table-column align="left" label="成员角色" width>
                                      <template slot-scope="scope">
                                        <!-- <el-select :clearable='true' placeholder="请选择" v-model="scope.row.roleId"
                                          filterable>
                                          <el-option v-for="(item,key)  in selectData.rolename" :key="key"
                                            :label="item.name" :value="item.roleId">
                                          </el-option>
                                        </el-select> -->
<!--                                        <span>{{ scope.row.roleName }}</span>-->
                                        <span>{{ CBNameList.find(item=>item.userId == scope.row.userId )&&CBNameList.find(item=>item.userId == scope.row.userId ).roleNameListStr | filterName }}</span>
                                      </template>
                                    </el-table-column>
                                    <el-table-column align="left" label="核定工时" width>
                                      <template slot-scope="scope">
                                        <span>{{scope.row.approvedTime}}</span>
                                      </template>
                                    </el-table-column>
                                    <el-table-column v-if="isEdit" align="left" label="操作" width>
                                      <template slot-scope="scope">
                                        <el-button v-if="isEdit" @click="delgroupCbCy(scope.row.userId,key)" size="mini"
                                                   type="text">删除
                                        </el-button>
                                      </template>
                                    </el-table-column>

                                  </el-table>

                                </template>
                              </el-form-item>

                            </el-col>

                          </el-row>
                        </div>
                        <div v-if="caseDetailFoemData.updateWorkType == 2 || !statusChange" style="width: 135px">
                          <el-button v-if="isEdit" @click="dialogFormgroupGzz=true" size="mini"
                                     style="margin-left:10px;float:left" type="primary">
                            新增
                          </el-button>
                          <el-button @click="cbshow=!cbshow" size="mini" style="margin-left:10px;float:right"
                                     type="primary">
                            {{cbshow?'收起':'查看'}}
                          </el-button>
                        </div>
                      </div>
                    </template>
                  </el-form-item>

                </el-col>

              </el-row>
              <el-row class="fullRow patent" v-if="isCustwork!='cust'&&isCustwork!='cb'&&!caseDetailFoemData.usAgency&&!isTrademark">
                <el-col :span="24">
                  <el-form-item class="postInfo-container-item" label="流程组:">
                    <el-select v-if="isEdit" :class="{seeType:!isEdit}" :clearable="true" @change="lczChange"
                               default-first-option filterable placeholder=""
                               v-model="caseDetailFoemData.trademarkCaseLCWorkgroups[0].groupName">
                      <el-option :key="key" :label="item.groupName" :value="item.groupName"
                                 v-for="(item,key) in technologicalProcess"/>
                    </el-select>
                    <!--                    <span v-if="isEdit&&!isTrademark">{{caseDetailFoemData.trademarkCaseLCWorkgroups[0].groupName}}</span>-->
                    <span v-if="!isEdit">{{caseDetailFoemData.trademarkCaseLCWorkgroups[0]?caseDetailFoemData.trademarkCaseLCWorkgroups[0].groupName:''}}</span>
                    <el-button @click="lcshow=!lcshow" size="mini" style="margin-left:10px;float:right" type="primary">
                      {{lcshow?'收起':'查看'}}
                    </el-button>
                    <el-row v-if="lcshow" class="fullRow table-dl-row" style="margin-top: 5px">
                      <el-col :span="24">
                        <el-table :data="LCData"
                                  border
                                  current-row-key empty-text="暂无数据" fit style="width: 100%;">
                          <el-table-column align="left" label="成员姓名" width>
                            <template slot-scope="scope">
                              <span>{{ scope.row.fullname }}</span>
                            </template>
                          </el-table-column>
                          <el-table-column align="left" label="成员角色" width>
                            <template slot-scope="scope">
<!--                              <span>{{ scope.row.roleName }}</span>-->
                              <span>{{ LCNameList.find(item=>item.userId == scope.row.userId )&&LCNameList.find(item=>item.userId == scope.row.userId ).roleNameListStr | filterName }}</span>
                            </template>
                          </el-table-column>
                        </el-table>
                      </el-col>
                    </el-row>
                  </el-form-item>
                </el-col>
              </el-row>
              <div v-if="isTrademark && !statusChange && !$route.query.pageId" class="patent">
                <el-row>
                  <el-col :span="24">
                    <el-form-item class="" label="撰写人:">
                      <el-select v-if="isEdit" v-model="caseDetailFoemData.actualAttorney" filterable clearable placeholder="请选择">
                        <el-option
                          v-for="item in $store.getters.userList"
                          :key="item.userId"
                          :label="item.fullname"
                          :value="item.userId">
                          <!--                  <UserIconAndUserName :user-id="item.userId"></UserIconAndUserName>-->
                        </el-option>
                      </el-select>
                      <span v-else>{{caseDetailFoemData.actualAttorneyName}}</span>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
              <div v-if="isPatent" class="patent">
                <el-row>
                  <el-col :span="6">
                    <el-form-item class="" label="代理人一:">
                      <VirtualSelect filterable clearable v-if="isEdit" @change="()=>{queryUserCaseNumber('代理人一')}"
                                     :data="patentAgentUserList"
                                     v-model="caseDetailFoemData.namedAttorney"></VirtualSelect>
                      <!--                      <el-select v-if="isEdit" v-model="caseDetailFoemData.namedAttorney" filterable clearable placeholder="请选择">-->
                      <!--                        <el-option-->
                      <!--                          v-for="item in $store.getters.allUserList"-->
                      <!--                          :key="item.userId"-->
                      <!--                          :label="item.fullname"-->
                      <!--                          :value="item.userId">-->
                      <!--                          &lt;!&ndash;                  <UserIconAndUserName :user-id="item.userId"></UserIconAndUserName>&ndash;&gt;-->
                      <!--                        </el-option>-->
                      <!--                      </el-select>-->
                      <span v-else>{{caseDetailFoemData.namedAttorneyName}}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item class="" label="代理人二:">
                      <VirtualSelect filterable clearable v-if="isEdit" @change="()=>{queryUserCaseNumber('代理人二')}"
                                     :data="patentAgentUserList"
                                     v-model="caseDetailFoemData.namedAttorney2"></VirtualSelect>
                      <!--                      <el-select v-if="isEdit" v-model="caseDetailFoemData.namedAttorney2" filterable clearable placeholder="请选择">-->
                      <!--                        <el-option-->
                      <!--                          v-for="item in $store.getters.allUserList"-->
                      <!--                          :key="item.userId"-->
                      <!--                          :label="item.fullname"-->
                      <!--                          :value="item.userId">-->
                      <!--                          &lt;!&ndash;                  <UserIconAndUserName :user-id="item.userId"></UserIconAndUserName>&ndash;&gt;-->
                      <!--                        </el-option>-->
                      <!--                      </el-select>-->
                      <span v-else>{{caseDetailFoemData.namedAttorneyName2}}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item class="" label="撰稿人:">
                      <template slot="label"><span class="required-asterisk" v-if="['普通新申请','PCT国家阶段'].includes(caseDetailFoemData.caseType)">*</span>撰稿人:</template>
                      <VirtualSelect filterable clearable v-if="isEdit" :data="$store.getters.allUserList" @change="changeActualAttorney"
                                     v-model="caseDetailFoemData.actualAttorney"></VirtualSelect>
                      <!--                      <el-select v-if="isEdit" v-model="caseDetailFoemData.actualAttorney" filterable clearable placeholder="请选择">-->
                      <!--                        <el-option-->
                      <!--                          v-for="item in $store.getters.allUserList"-->
                      <!--                          :key="item.userId"-->
                      <!--                          :label="item.fullname"-->
                      <!--                          :value="item.userId">-->
                      <!--                          &lt;!&ndash;                  <UserIconAndUserName :user-id="item.userId"></UserIconAndUserName>&ndash;&gt;-->
                      <!--                        </el-option>-->
                      <!--                      </el-select>-->
                      <span v-else>{{caseDetailFoemData.actualAttorneyName}}</span>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>

                  <!--                  <el-col :span="6">-->
                  <!--                    <el-form-item class="" label="案件秘书:">-->
                  <!--                      <el-select v-if="isEdit" v-model="caseDetailFoemData.flowcharge" filterable clearable placeholder="请选择">-->
                  <!--                        <el-option-->
                  <!--                          v-for="item in $store.getters.userList"-->
                  <!--                          :key="item.userId"-->
                  <!--                          :label="item.fullname"-->
                  <!--                          :value="item.userId">-->
                  <!--                          &lt;!&ndash;                  <UserIconAndUserName :user-id="item.userId"></UserIconAndUserName>&ndash;&gt;-->
                  <!--                        </el-option>-->
                  <!--                      </el-select>-->
                  <!--                      <span v-else>{{caseDetailFoemData.flowchargeName}}</span>-->
                  <!--                    </el-form-item>-->
                  <!--                  </el-col>-->
                  <el-col :span="6">
                    <el-form-item class="" label="案件审核:">
                      <div v-if="isEdit" style="width: 100%;">
                        <VirtualSelect filterable clearable  :data="$store.getters.allUserList"
                                     v-model="caseDetailFoemData.casecharge"></VirtualSelect>
                      </div>
                      <!--                      <el-select v-if="isEdit" v-model="caseDetailFoemData.casecharge" filterable clearable placeholder="请选择">-->
                      <!--                        <el-option-->
                      <!--                          v-for="item in $store.getters.allUserList"-->
                      <!--                          :key="item.userId"-->
                      <!--                          :label="item.fullname"-->
                      <!--                          :value="item.userId">-->
                      <!--                          &lt;!&ndash;                  <UserIconAndUserName :user-id="item.userId"></UserIconAndUserName>&ndash;&gt;-->
                      <!--                        </el-option>-->
                      <!--                      </el-select>-->
                      <span v-else>{{caseDetailFoemData.casechargeName}}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item class="" label="代理助理:">
                      <VirtualSelect filterable clearable v-if="isEdit" :data="$store.getters.allUserList"
                                     v-model="caseDetailFoemData.assistant"></VirtualSelect>
                      <!--                      <el-select v-if="isEdit" v-model="caseDetailFoemData.assistant" filterable clearable placeholder="请选择">-->
                      <!--                        <el-option-->
                      <!--                          v-for="item in $store.getters.allUserList"-->
                      <!--                          :key="item.userId"-->
                      <!--                          :label="item.fullname"-->
                      <!--                          :value="item.userId">-->
                      <!--                          &lt;!&ndash;                  <UserIconAndUserName :user-id="item.userId"></UserIconAndUserName>&ndash;&gt;-->
                      <!--                        </el-option>-->
                      <!--                      </el-select>-->
                      <span v-else>{{caseDetailFoemData.assistantName}}</span>
                    </el-form-item>
                  </el-col>
                  <el-col
                    :span="caseDetailFoemData.caseType == '翻译案件' || caseDetailFoemData.caseType == '普通新申请' && caseDetailFoemData.patentType == 1298 ? 6 : 12">
                    <el-form-item class="" label="实审阶段作业人:">
                      <VirtualSelect filterable clearable v-if="isEdit" :data="$store.getters.allUserList"
                                     v-model="caseDetailFoemData.sale"></VirtualSelect>
                      <!--                      <el-select v-if="isEdit" v-model="caseDetailFoemData.sale" filterable clearable placeholder="请选择">-->
                      <!--                        <el-option-->
                      <!--                          v-for="item in $store.getters.allUserList"-->
                      <!--                          :key="item.userId"-->
                      <!--                          :label="item.fullname"-->
                      <!--                          :value="item.userId">-->
                      <!--                          &lt;!&ndash;                  <UserIconAndUserName :user-id="item.userId"></UserIconAndUserName>&ndash;&gt;-->
                      <!--                        </el-option>-->
                      <!--                      </el-select>-->
                      <span v-else>{{caseDetailFoemData.saleName}}</span>
                    </el-form-item>
                  </el-col>
                  <el-col v-if="caseDetailFoemData.caseType == '普通新申请' && caseDetailFoemData.patentType == 1298"
                          :span="6">
                    <el-form-item label="合作部门:">
                      <el-select v-if="isEdit" v-model="caseDetailFoemData.dept1" filterable clearable reserve-keyword
                                 placeholder="请选择部门">
                        <el-option v-for="itm in deptByConditionList" :key="itm.deptId" :label="itm.name"
                                   :value="itm.deptId">
                        </el-option>
                      </el-select>
                      <span v-else>{{caseDetailFoemData.dept1Name}}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6" v-if="caseDetailFoemData.caseType == '翻译案件'">
                    <el-form-item label="翻译人:">
                      <VirtualSelect filterable clearable v-if="isEdit" :data="$store.getters.allUserList"
                                     v-model="caseDetailFoemData.actualAttorney"></VirtualSelect>
                      <!--                      <el-input type="text" :rows="1" size="small" v-model="caseDetailFormData.appNumber"></el-input>-->
                      <!--                      <el-select v-if="isEdit" v-model="caseDetailFoemData.actualAttorney" filterable clearable placeholder="请选择">-->
                      <!--                        <el-option-->
                      <!--                          v-for="item in $store.getters.allUserList"-->
                      <!--                          :key="item.userId"-->
                      <!--                          :label="item.fullname"-->
                      <!--                          :value="item.userId">-->
                      <!--                          &lt;!&ndash;                  <UserIconAndUserName :user-id="item.userId"></UserIconAndUserName>&ndash;&gt;-->
                      <!--                        </el-option>-->
                      <!--                      </el-select>-->
                      <span v-else>{{caseDetailFoemData.actualAttorneyName}}</span>
                    </el-form-item>
                  </el-col>
                  <!--                <el-col :span="12">-->
                  <!--                  <el-form-item  class="" label="结案人员:">-->

                  <!--                  </el-form-item>-->
                  <!--                </el-col>-->
                </el-row>
                <!--                <el-row-->
                <!--                  v-if="(-->
                <!--                    caseDetailFoemData.caseType == 'PCT国家阶段' && (caseDetailFoemData.patentType == 1296 ||caseDetailFoemData.patentType == 1297))-->
                <!--                   || (caseDetailFoemData.caseType == '普通新申请' && (caseDetailFoemData.patentType == 1297)-->
                <!--                   || caseDetailFoemData.caseType == '翻译'-->
                <!--                   || caseDetailFoemData.caseType == '顾问服务'-->
                <!--                   || caseDetailFoemData.caseType == '欧洲专利国家生效'-->
                <!--                   || caseDetailFoemData.caseType == 'PCT国际申请' && (caseDetailFoemData.patentType == 1296)-->
                <!--                   || caseDetailFoemData.caseType == '其他'-->
                <!--                   || caseDetailFoemData.caseType == '咨询'-->
                <!--                   || caseDetailFoemData.caseType == '年费代缴'-->

                <!--                   )">-->
                <!--                  <el-col :span="6">-->
                <!--                    <el-form-item class="" label="合作人一:">-->
                <!--                      <el-select v-if="isEdit" v-model="caseDetailFoemData.person1" filterable clearable placeholder="请选择">-->
                <!--                        <el-option-->
                <!--                          v-for="item in $store.getters.userList"-->
                <!--                          :key="item.userId"-->
                <!--                          :label="item.fullname"-->
                <!--                          :value="item.userId">-->
                <!--                          &lt;!&ndash;                  <UserIconAndUserName :user-id="item.userId"></UserIconAndUserName>&ndash;&gt;-->
                <!--                        </el-option>-->
                <!--                      </el-select>-->
                <!--                      <span v-else>{{caseDetailFoemData.person1Name}}</span>-->
                <!--                    </el-form-item>-->
                <!--                  </el-col>-->
                <!--                  <el-col :span="6">-->
                <!--                    <el-form-item class="" label="合作人二:">-->
                <!--                      <el-select v-if="isEdit" v-model="caseDetailFoemData.person2" filterable clearable placeholder="请选择">-->
                <!--                        <el-option-->
                <!--                          v-for="item in $store.getters.userList"-->
                <!--                          :key="item.userId"-->
                <!--                          :label="item.fullname"-->
                <!--                          :value="item.userId">-->
                <!--                          &lt;!&ndash;                  <UserIconAndUserName :user-id="item.userId"></UserIconAndUserName>&ndash;&gt;-->
                <!--                        </el-option>-->
                <!--                      </el-select>-->
                <!--                      <span v-else>{{caseDetailFoemData.person2Name}}</span>-->
                <!--                    </el-form-item>-->
                <!--                  </el-col>-->
                <!--                  <el-col :span="caseDetailFoemData.caseType == '翻译案件' ? 6 : 12">-->
                <!--                    <el-form-item label="合作部门:">-->
                <!--                      <el-select v-if="isEdit" v-model="caseDetailFoemData.dept1" filterable clearable reserve-keyword-->
                <!--                                 placeholder="请选择部门">-->
                <!--                        <el-option v-for="itm in deptByConditionList" :key="itm.deptId" :label="itm.name"-->
                <!--                                   :value="itm.deptId">-->
                <!--                        </el-option>-->
                <!--                      </el-select>-->
                <!--                      <span v-else>{{caseDetailFoemData.dept1Name}}</span>-->
                <!--                    </el-form-item>-->
                <!--                  </el-col>-->
                <!--                  <el-col :span="6" v-if="caseDetailFoemData.caseType == '翻译案件'">-->
                <!--                    <el-form-item label="翻译字数:">-->
                <!--                      <el-input v-if="isEdit" type="text" :rows="1" size="small" v-model="caseDetailFoemData.wordsNum"></el-input>-->
                <!--                      <span v-else>{{caseDetailFoemData.wordsNum}}</span>-->
                <!--                    </el-form-item>-->
                <!--                  </el-col>-->
                <!--                  &lt;!&ndash;                  <el-col :span="6">&ndash;&gt;-->
                <!--                  &lt;!&ndash;                    <el-form-item class="" label="接案人员:">&ndash;&gt;-->
                <!--                  &lt;!&ndash;                      <el-select v-model="caseDetailFoemData.sale" filterable clearable placeholder="请选择">&ndash;&gt;-->
                <!--                  &lt;!&ndash;                        <el-option&ndash;&gt;-->
                <!--                  &lt;!&ndash;                          v-for="item in $store.getters.userList"&ndash;&gt;-->
                <!--                  &lt;!&ndash;                          :key="item.userId"&ndash;&gt;-->
                <!--                  &lt;!&ndash;                          :label="item.fullname"&ndash;&gt;-->
                <!--                  &lt;!&ndash;                          :value="item.userId">&ndash;&gt;-->
                <!--                  &lt;!&ndash;                          &lt;!&ndash;                  <UserIconAndUserName :user-id="item.userId"></UserIconAndUserName>&ndash;&gt;&ndash;&gt;-->
                <!--                  &lt;!&ndash;                        </el-option>&ndash;&gt;-->
                <!--                  &lt;!&ndash;                      </el-select>&ndash;&gt;-->
                <!--                  &lt;!&ndash;                    </el-form-item>&ndash;&gt;-->
                <!--                  &lt;!&ndash;                  </el-col>&ndash;&gt;-->
                <!--                </el-row>-->
                <!--                <el-row v-if="caseDetailFoemData.caseType == '年费代缴'">-->
                <!--                  <el-col :span="24">-->
                <!--                    <el-form-item label="转出所至:">-->
                <!--                      <el-input v-if="isEdit" type="text" size="small" v-model="caseDetailFoemData.alteragency"></el-input>-->
                <!--                      <span v-else>{{caseDetailFoemData.alteragency}}</span>-->
                <!--                    </el-form-item>-->
                <!--                  </el-col>-->
                <!--                </el-row>-->
              </div>
              <div v-if="caseDetailFoemData.caseType === '商标行政'">
                <el-row>
                  <el-col :span="24">
                    <el-form-item class="postInfo-container-item" label="客户POA被委托人:">
                      <el-select v-if="isEdit" multiple v-model="caseDetailFoemData.mandataryIds" filterable clearable placeholder="请选择">
                        <el-option
                          v-for="item in poaList"
                          :key="item.userId"
                          :label="item.fullname + ` (${item.practiceType} - ${item.contractOwner || '无'})`"
                          :value="item.userId">
                          <!--                  <UserIconAndUserName :user-id="item.userId"></UserIconAndUserName>-->
                        </el-option>
                      </el-select>
                      <span v-else>{{
                        caseDetailFoemData.mandataryIds.map(i => poaList.find(item => item.userId === i).fullname + ` (${poaList.find(item => item.userId === i).practiceType} - ${poaList.find(item => item.userId === i).contractOwner || '无'})`) + ''
                        }}</span>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
              <el-row class="patent" v-if="isPatent">
                <el-col span="6">
                  <el-form-item label="流程负责人:">
                    <el-select
                      v-if="isEdit"
                      v-model="caseDetailFoemData.processManagerUserId"
                      filterable
                      allow-create
                      default-first-option
                      :reserve-keyword="false"
                      style="width: 100%"
                    >
                      <el-option
                        v-for="item in $store.getters.allUserList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.userId"
                      />
                    </el-select>
                    <span v-else>
                      {{ caseDetailFoemData.processManagerUserName }}
                    </span>
                  </el-form-item>
                </el-col>
                <el-col span="6">
                  <el-form-item label="翻译人:">
                    <el-select
                      v-if="isEdit"
                      v-model="caseDetailFoemData.translator"
                      filterable
                      allow-create
                      default-first-option
                      :reserve-keyword="false"
                      style="width: 100%"
                    >
                      <el-option
                        v-for="item in $store.getters.allUserList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.label"
                      />
                    </el-select>
                    <span v-else>
                      {{ caseDetailFoemData.translator }}
                    </span>
                  </el-form-item>
                </el-col>
                <el-col span="12">
                  <el-form-item label="校对人:">
                    <el-select
                      v-if="isEdit"
                      v-model="caseDetailFoemData.proofreader"
                      filterable
                      allow-create
                      default-first-option
                      :reserve-keyword="false"
                      style="width: 100%"
                    >
                      <el-option
                        v-for="item in $store.getters.allUserList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.label"
                      />
                    </el-select>
                    <span v-else>
                      {{ caseDetailFoemData.proofreader }}
                    </span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="patent" v-if="isPatent">
                <el-col span="24">
                  <el-form-item label="翻校备注:">
                    <el-input
                      v-if="isEdit"
                      v-model="caseDetailFoemData.reviewNotes"
                      :autosize="{minRows: 1}"
                      :rows="1"
                      style="width: 100%"
                      type="textarea"
                    />
                    <span v-else>
                      {{ caseDetailFoemData.reviewNotes }}
                    </span>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <slot></slot>
        </div>
      </div>
    </el-form>
    <el-dialog :append-to-body="true" :close-on-click-modal="false" :show-close="false"
               :visible.sync="dialogFormgroupGzz" title="选择工作组" width="60%">
      <el-form :model="groupGzzObjc" label-position="left" ref="" size="mini" style="width: 100%;">
        <el-row class="form-border">
          <el-col :span="24">
            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item class="postInfo-container-item" label="工作组:">
                  <template>
                    <el-select :clearable="true" default-first-option filterable placeholder="请选择" ref="gzzselect"
                               v-model="groupGzzObjc.wkgId" remote :remote-method="getFilterText">
                      <el-option :key="key" :label="item.groupName" :value="item.wkgId"
                                 v-for="(item,key) in filterGroup"/>
                    </el-select>
                  </template>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-form>
      <div class="dialog-footer" slot="footer">
        <el-button @click="dialogFormgroupGzz = false">
          取消
        </el-button>
        <el-button @click="addgroupGzzBtn" type="primary">
          确定
        </el-button>
      </div>
    </el-dialog>
    <el-dialog :append-to-body="true" :close-on-click-modal="false" :show-close="false"
               :visible.sync="dialogFormgroupCy" title="添加成员" width="60%">
      <el-form :model="groupCyObjc" label-position="left" ref="" size="mini" style="width: 100%;">
        <el-row class="form-border">
          <el-col :span="24">
            <el-row class="">
              <el-col :span="24">
                <el-form-item class="postInfo-container-item" label="成员姓名:">
                  <template>
                    <el-select :clearable="true" default-first-option filterable placeholder="请选择" ref="cyselect"
                               v-model="groupCyObjc.userId" @change="changeUserId">
                      <el-option :key="key" :label="item.fullname" :value="item.userId" :disabled="disabledUser(item.userId)"
                                 v-for="(item,key) in selectData.username"/>
                    </el-select>

                  </template>
                </el-form-item>
              </el-col>
<!--              <el-col :span="12">-->
<!--                <el-form-item class="postInfo-container-item" label="成员角色:">-->
<!--                  <template>-->
<!--                    <el-select :clearable="true" default-first-option filterable placeholder="请选择" ref="jsselect"-->
<!--                               v-model="groupCyObjc.roleId">-->
<!--                      <el-option :key="key" :label="item.name" :value="item.roleId"-->
<!--                                 v-for="(item,key) in selectData.rolename"/>-->
<!--                    </el-select>-->

<!--                  </template>-->
<!--                </el-form-item>-->
<!--              </el-col>-->
            </el-row>

          </el-col>
        </el-row>

      </el-form>
      <div class="dialog-footer" slot="footer">
        <el-button @click="dialogFormgroupCy = false">
          取消
        </el-button>
        <el-button @click="addgroupCyBtn" type="primary">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    queryCaseWorkgroupUrl,
    queryRoleNames,
    queryUserNames,
    queryCaseRoleName,
    queryUserRole,
    queryUserCaseNumber,
    queryCustUserList
  } from '@/api/caseDetail'
  import {
    querywfUserNameUrl
  } from '@/api/billApi'
  import { queryDeptByCondition } from '@/api/systemList'
  import {queryGroupsByUserId} from '@/api/user'
  import {queryCustPOAPerson} from "../../../../api/caseList";
  import { getPatentAgentUser } from '@/api/customerList'

  export default {
    name: 'CaseInvestigators',
    components: {},
    props: {
      statusChange: false,
      caseDetailData: {
        type: Object,
        default: () => ({
          trademarkCaseLCWorkgroups: [{}]
        })
      },
      plData: {
        type: Array
      },
      isPatent: {
        type: Boolean,
        default: false
      },
      isEdit: {
        type: Boolean,
        default: true
      },
      isCustwork: {
        type: String,
        default: ''
      },
      prePage:{
        type: String,
      }
    },
    data() {
      return {
        poaList: [],
        filterFlag: false,
        flagName: '',
        custfilterGroup: [],
        addUserRoleList: [],
        caseRoleSelectList: [],
        caseRoleNameList: [],
        caseDetailFoemData: {
          trademarkCaseCustWorkgroups: [],
          trademarkCaseLCWorkgroups: []
        },
        cbshow: true,
        cyshow: true,
        lcshow: true,

        custGroup: [],
        technologicalProcess: [],
        dialogFormgroupGzz: false,
        dialogFormgroupCy: false,
        groupGzzObjc: {
          wkgId: '',
          groupName: '',
          trademarkCaseWorkgroupMembers: [],
          wkgRoleId: ''
        },
        groupCyObjc: {
          userId: '',
          roleId: '',
          roleName: '',
          fullname: ''
        },
        selectData: {
          username: [],
          rolename: []
        },
        addCbzCyindex: '',
        filterText: '',
        filterGroup: [],
        deptByConditionList: [],
        KHNameList: [],
        CBNameList: [],
        LCNameList: [],
        patentAgentUserList:[],
        custUserList: []
      }
    },
    watch: {
      'caseDetailFoemData.caseId': {
        handler(newVal) {
          if(newVal) {
            this.fetchCustUserList()
          }
        },
        immediate: true
      }
    },
    filters: {
      filterName(value){
        if(!value || value.includes('null')){
          return '';
        }
        return value.slice(0, value.length - 1)
      }
    },
    computed: {
      LCData(){
        return this.makeRoleNameListStr(this.caseDetailFoemData.trademarkCaseLCWorkgroups || [], 'LCNameList', 'one')
      },
      KHData(){
        // if(this.caseDetailFoemData.trademarkCaseCustWorkgroups&&this.caseDetailFoemData.trademarkCaseCustWorkgroups.length){
        //   const list = JSON.parse(JSON.stringify(this.caseDetailFoemData.trademarkCaseCustWorkgroups[0].trademarkCaseWorkgroupMembers || []))
        //   this.KHNameList = this.$wUtil.uniqueByAttr(list.map(item=>({
        //     fullname: item.fullname,
        //     userId: item.userId
        //   })), 'userId')
        //
        //   this.KHNameList.forEach((item, index) => {
        //     list.forEach(i => {
        //       if(item.userId == i.userId){
        //         item.roleNameListStr = (item.roleNameListStr || '') + (i.roleName + ' ,' || '')
        //       }
        //     })
        //   })
        //   return this.$wUtil.uniqueByAttr(list, 'userId')
        // }else{
        //   return []
        // }
        return this.makeRoleNameListStr(this.caseDetailFoemData.trademarkCaseCustWorkgroups || [], 'KHNameList', 'one')
      },
      CBData(){
        return this.makeRoleNameListStr(this.caseDetailFoemData.trademarkCaseCBWorkgroups || [], 'CBNameList', 'more')
      },
      caseTaskType() {
        return this.$commonUtils.getTaskType(this.caseDetailFoemData, this)
      },
      isTrademark() {
        return this.$commonUtils.getTaskType(this.caseDetailFoemData, this) == 1
        // return this.$commonUtils.getCaseTypeIdByTcaseType(+this.caseDetailFoemData.tcaseType || 3) == 1
      }
    },
    methods: {
      custUserNameFormat(value) {
        if(!value || !value.length) return '';
        const values = JSON.parse(JSON.stringify(value))
        const fullnames = values
          .map(person => person.fullname);           // 提取 fullname
        // 使用 join 方法将数组中的 fullname 连接成一个字符串
        return fullnames.join('，');
      },
      fetchPatentAgentUserList(){
        const params = {
          custId: this.caseDetailFoemData.custId,
        }
        getPatentAgentUser(params).then(res=>{
          this.patentAgentUserList = res.data.map(item=>{
            return {
              label:item.fullname,
              value:item.userId,
              isActive:item.isActive
            }
          })
        })
      },
      queryUserCaseNumber(type){
        
        if(type == '代理人一' && !this.caseDetailFoemData.namedAttorney)return;
        if(type == '代理人二' && !this.caseDetailFoemData.namedAttorney2)return;
        // if(!this.caseDetailFoemData.namedAttorney&&!this.caseDetailFoemData.namedAttorney2)return;
        queryUserCaseNumber({
            caseTypeId: this.caseDetailFoemData.caseTypeId,
            appFromto: this.caseDetailFoemData.appFromto,
            patentType: this.caseDetailFoemData.patentType,
            namedAttorney: this.caseDetailFoemData.namedAttorney,
            namedAttorney2: this.caseDetailFoemData.namedAttorney2,
          }).then(res=>{
            // this.$wangConfirm('测试测试')
            if(res.messageType == 100){
              this.$wangConfirm(res.message)
            }
          })
      },
      changeActualAttorney(v){
        if(!v)return;
        if (['普通新申请','PCT国家阶段'].includes(this.caseDetailFoemData.caseType)) {
          this.caseDetailFoemData.sale = v
        }
        queryGroupsByUserId({userId: v}).then(res=>{
          let list = res.data || []
          if(list.length){
            this.custGroup.forEach(element => {
              if (list.find(i => i.wkgId == element.wkgId && !this.caseDetailFoemData.trademarkCaseCBWorkgroups.find(j => j.wkgId == i.wkgId))) {
                let objc = {}
                objc.trademarkCaseWorkgroupMembers = JSON.parse(JSON.stringify(element.wkgUsers))
                objc.wkgRoleId = element.wkgRoleId
                objc.wkgId = element.wkgId
                objc.groupName = element.groupName
                objc.bossUserId = element.bossUserId
                this.caseDetailFoemData.trademarkCaseCBWorkgroups.push(objc)
              }
            })
            this.$emit('workGroup', this.caseDetailFoemData)
          }
        })
      },
      makeRoleNameListStr(dataList, name, num){
        this[name] = []
        if(dataList.length){
          const list = JSON.parse(JSON.stringify(dataList || []))
          list.forEach(item => {
            if (item.trademarkCaseWorkgroupMembers && item.trademarkCaseWorkgroupMembers.length) {
              item.trademarkCaseWorkgroupMembers.forEach(it => {
                this[name].push({
                  fullname: it.fullname,
                  userId: it.userId
                })
              })
            }
          })
          this[name].forEach((item, index) => {
            list.forEach(i => {
              if (i.trademarkCaseWorkgroupMembers && i.trademarkCaseWorkgroupMembers.length) {
                i.trademarkCaseWorkgroupMembers.forEach(j => {
                  if(item.userId == j.userId){
                    item.roleNameListStr = (item.roleNameListStr || '') + (j.roleName + ' ,' || '')
                  }
                })
              }
            })
          })
          list.forEach(item=>{
            if(item.trademarkCaseWorkgroupMembers&&item.trademarkCaseWorkgroupMembers.length){
             item.trademarkCaseWorkgroupMembers = this.$wUtil.uniqueByAttr(item.trademarkCaseWorkgroupMembers, 'userId')
            }
          })
          if(num == 'one'){
            return list[0].trademarkCaseWorkgroupMembers
          }
          return list
        }
        return []
      },
      changeCaseRoleSelectList(v, fullname, flag) {
        this.$set(this, 'caseRoleSelectList', [])
          //客户组
          this.caseDetailFoemData.trademarkCaseCustWorkgroups && this.caseDetailFoemData.trademarkCaseCustWorkgroups[0] && this.caseDetailFoemData.trademarkCaseCustWorkgroups[0].trademarkCaseWorkgroupMembers
            &&this.caseDetailFoemData.trademarkCaseCustWorkgroups[0].trademarkCaseWorkgroupMembers.forEach(item => {
            if(!v && fullname === item.fullname && flag == 1){
                item.caseRoleName = ''
              }
              if(v && fullname === item.fullname && flag == 1){
                item.caseRoleName = v
              }
            if (item.caseRoleName) {
              this.caseRoleSelectList.push(item.caseRoleName)
            }
          })
          //承办组
          this.caseDetailFoemData.trademarkCaseCBWorkgroups && this.caseDetailFoemData.trademarkCaseCBWorkgroups.length && this.caseDetailFoemData.trademarkCaseCBWorkgroups.forEach(item => {
            if (item.trademarkCaseWorkgroupMembers && item.trademarkCaseWorkgroupMembers.length) {
              item.trademarkCaseWorkgroupMembers.forEach(it => {
                if(!v && fullname === it.fullname && flag == 2){
                  it.caseRoleName = ''
                }
                if(v && fullname === it.fullname && flag == 2){
                  it.caseRoleName = v
                }
                if (it.caseRoleName) {
                  this.caseRoleSelectList.push(it.caseRoleName)
                }
              })
            }
          })

        this.$emit('caseRoleSelectList', [...new Set(this.caseRoleSelectList)])
      },
      changeCaseRole(v, name, flag) {
        this.changeCaseRoleSelectList(v, name, flag)
      },
      sortTableList(list) {
        if (list && list.length) {
          list = list.sort((a, b) => a.userId - b.userId)
        }
      },
      mergeRow({ row, column, rowIndex, columnIndex }, list) {
        let arr = []
        list.forEach(ele => {
          let firstIndex = list.findIndex(item => {
            return item.fullname === ele.fullname
          })
          if (arr.findIndex(item => {
            return item.firstIndex === firstIndex
          }) === -1) {
            arr.push({
              length: list.filter(item => {
                return item.fullname === ele.fullname
              }).length,
              firstIndex: firstIndex
            })
          }
        })
        if (column.label === '成员姓名' || column.label === '案件角色') {
          let index = arr.findIndex(item => {  //遍历数组
            return item.firstIndex === rowIndex
          })
          if (index > -1) {
            return {
              rowspan: arr[index].length,
              colspan: 1
            }
          } else {
            return {
              rowspan: 0,
              colspan: 0
            }
          }
        }
      },
      mergeRowCust({ row, column, rowIndex, columnIndex }) {
        return this.mergeRow({
          row,
          column,
          rowIndex,
          columnIndex
        }, this.caseDetailFoemData.trademarkCaseCustWorkgroups[0].trademarkCaseWorkgroupMembers || [])
      },
      mergeRowCB({ row, column, rowIndex, columnIndex }) {
        if (this.caseDetailFoemData.trademarkCaseCBWorkgroups.find(item => item.groupId === row.groupId) && this.caseDetailFoemData.trademarkCaseCBWorkgroups.find(item => item.groupId === row.groupId).trademarkCaseWorkgroupMembers) {
          return this.mergeRow({
            row,
            column,
            rowIndex,
            columnIndex
          }, this.caseDetailFoemData.trademarkCaseCBWorkgroups.find(item => item.groupId === row.groupId).trademarkCaseWorkgroupMembers || [])
        }
      },
      mergeRowLC({ row, column, rowIndex, columnIndex }) {
        return this.mergeRow({ row, column, rowIndex, columnIndex }, this.caseDetailFoemData.trademarkCaseLCWorkgroups
          && this.caseDetailFoemData.trademarkCaseLCWorkgroups[0]
          && this.caseDetailFoemData.trademarkCaseLCWorkgroups[0].trademarkCaseWorkgroupMembers || [])
      },
      queryCaseRoleName() {
        queryCaseRoleName().then(res => {
          this.caseRoleNameList = res.data.map((item, index) => ({
            id: item.id,
            value: item.value
          }))
        })
      },
      queryDeptByCondition() {
        queryDeptByCondition({ isactive: 1 }).then(res => {
          this.deptByConditionList = res.data
        })
      },
      khzFilterText(e){
        this.custfilterGroup = this.custGroup.filter(item =>{
          this.flagName = ''
          this.filterFlag = false
          if (e) {
            if (item.wkgUsers.map(i => i.fullname).includes(e)) {
              this.flagName = e
              this.filterFlag = true
              return true
            }
            if (item.groupName.includes(e)) {
              return true
            }
            return false
          } else {
            return true
          }
        })
      },
      getFilterText(e) {
        this.filterGroup = this.custGroup.filter(item =>{
          this.flagName = ''
          this.filterFlag = false
          if (e) {
            if (item.wkgUsers.map(i => i.fullname).includes(e)) {
              this.flagName = e
              this.filterFlag = true
              return true
            }
            if (item.groupName.includes(e)) {
              return true
            }
            return false
          } else {
            return true
          }
        })
        // console.log(e);
        // this.filterGroup = this.custGroup.filter(item => e ? item.wkgUsers.map(i => i.fullname).includes(e) || item.groupName.includes(e) : true)
        // this.filterText=e
      },
      khzChange(item) {
        this.caseDetailFoemData.trademarkCaseCustWorkgroups && this.caseDetailFoemData.trademarkCaseCustWorkgroups[0]
        && this.caseDetailFoemData.trademarkCaseCustWorkgroups[0].trademarkCaseWorkgroupMembers
        &&this.caseDetailFoemData.trademarkCaseCustWorkgroups[0].trademarkCaseWorkgroupMembers.length
        &&this.caseDetailFoemData.trademarkCaseCustWorkgroups[0].trademarkCaseWorkgroupMembers.forEach(item => {
          if (item.caseRoleName) {
            item.caseRoleName = ''
          }
        })
        this.caseRoleSelectList = this.caseRoleSelectList.filter(i=>!i.includes('客户'))
        this.$emit('caseRoleSelectList', [...new Set(this.caseRoleSelectList)])
        var e = {}

        this.custGroup.forEach(ite => {
          if (ite.wkgId == item) {
            // e = ite
            e = JSON.parse(JSON.stringify(ite))
            return
          }
        })
        // console.log(e);
        this.caseDetailFoemData.trademarkCaseCustWorkgroups[0].bossUserId =
          e.bossUserId
        this.caseDetailFoemData.trademarkCaseCustWorkgroups[0].groupName =
          e.groupName
        this.caseDetailFoemData.trademarkCaseCustWorkgroups[0].wkgRoleId =
          e.wkgRoleId
        this.caseDetailFoemData.trademarkCaseCustWorkgroups[0].trademarkCaseWorkgroupMembers =
          e.wkgUsers
        if (this.filterFlag && this.flagName && e.wkgId == 2357) {
          this.caseDetailFoemData.trademarkCaseCustWorkgroups[0].trademarkCaseWorkgroupMembers = e.wkgUsers.filter(i => i.fullname.includes(this.flagName))
          this.flagName = ''
          this.filterFlag = false
        }
        if (this.isTrademark) {
          queryCaseWorkgroupUrl({
            status: '2',
            groupName: e.groupName,
            caseTypeId: this.caseDetailFoemData.caseTypeId
          }).then(
            res => {
              this.caseDetailFoemData.trademarkCaseLCWorkgroups[0].bossUserId = res.data[0].bossUserId
              this.caseDetailFoemData.trademarkCaseLCWorkgroups[0].wkgRoleId = res.data[0].wkgRoleId
              this.caseDetailFoemData.trademarkCaseLCWorkgroups[0].wkgId = res.data[0].wkgId
              this.caseDetailFoemData.trademarkCaseLCWorkgroups[0].groupName = res.data[0].groupName
              this.caseDetailFoemData.trademarkCaseLCWorkgroups[0].trademarkCaseWorkgroupMembers =
                res.data[0].wkgUsers
              if (this.filterFlag && this.flagName && e.wkgId == 2357) {
                this.caseDetailFoemData.trademarkCaseCustWorkgroups[0].trademarkCaseWorkgroupMembers = e.wkgUsers.filter(i => i.fullname.includes(this.flagName))
                this.flagName = ''
                this.filterFlag = false
              }
              this.$emit('workGroup', this.caseDetailFoemData, this.isCustwork)
            }
          )
        }
      },
      changeUserId(e) {
        if(!e)return;
        if (this.selectData.username.find(item => item.userId == e).roles && this.selectData.username.find(item => item.userId == e).roles.length) {
          this.groupCyObjc.roleId = this.selectData.username.find(item => item.userId == e).roles[0].roleId
        }
        queryUserRole({
          userId: e
        }).then(res=>{
          this.addUserRoleList = res.data || []
        })
      },
      lczChange(groupName) {
        let obj = this.technologicalProcess.find(item => item.groupName == groupName)
        if (obj) {
          this.caseDetailFoemData.trademarkCaseLCWorkgroups[0].bossUserId = obj.bossUserId
          this.caseDetailFoemData.trademarkCaseLCWorkgroups[0].wkgRoleId = obj.wkgRoleId
          this.caseDetailFoemData.trademarkCaseLCWorkgroups[0].wkgId = obj.wkgId
          // this.caseDetailFoemData.trademarkCaseLCWorkgroups[0].groupName = obj.groupName
          this.caseDetailFoemData.trademarkCaseLCWorkgroups[0].trademarkCaseWorkgroupMembers = obj.wkgUsers
        } else {
          this.caseDetailFoemData.trademarkCaseLCWorkgroups[0].wkgRoleId = ''
          this.caseDetailFoemData.trademarkCaseLCWorkgroups[0].wkgId = ''
          this.caseDetailFoemData.trademarkCaseLCWorkgroups[0].groupName = ''
          this.caseDetailFoemData.trademarkCaseLCWorkgroups[0].trademarkCaseWorkgroupMembers = []
          // this.caseDetailFoemData.trademarkCaseLCWorkgroups[0].trademarkCaseWorkgroupMembers=[]
        }

      },
      addgroupGzzBtn() {
        this.groupGzzObjc.groupName = this.$refs.gzzselect.selected.label
        if (!this.groupGzzObjc.groupName) {

          this.$message.error(`请先选择${[1, 4].includes(this.caseTaskType) ? '客户组' : '客户负责人'}`)

          return
        }
        this.custGroup.forEach(element => {
          if (element.wkgId == this.$refs.gzzselect.selected.value) {
            // this.groupGzzObjc.trademarkCaseWorkgroupMembers = element.wkgUsers
            this.groupGzzObjc.trademarkCaseWorkgroupMembers = JSON.parse(JSON.stringify(element.wkgUsers))
            if (this.filterFlag && this.flagName && element.wkgId == 2357) {
              this.groupGzzObjc.trademarkCaseWorkgroupMembers = element.wkgUsers.filter(i => i.fullname.includes(this.flagName))
              this.flagName = ''
              this.filterFlag = false
            }
            this.groupGzzObjc.wkgRoleId = element.wkgRoleId
            this.groupGzzObjc.bossUserId = element.bossUserId
            // return
          }
        })
        const objc = Object.assign({}, this.groupGzzObjc)
        // const objc = JSON.parse(JSON.stringify(this.groupGzzObjc))
        if (this.caseDetailFoemData.trademarkCaseCBWorkgroups.find(item => item.wkgId == objc.wkgId)) {
          this.$message.error('该承办组已存在！')
          return
        }
        this.caseDetailFoemData.trademarkCaseCBWorkgroups.push(objc)
        this.dialogFormgroupGzz = false
        // this.cbshow = true;
        this.$emit('workGroup', this.caseDetailFoemData, this.isCustwork)
      },
      addgroupCyBtn() {
        this.groupCyObjc.fullname = this.$refs.cyselect.selected.label
        // this.groupCyObjc.roleName = this.$refs.jsselect.selected.label

        const objc = Object.assign({}, this.groupCyObjc)
        if (this.addCbzCyindex === '') {
          //addUserRoleList
          if(this.addUserRoleList.length){
            this.addUserRoleList = this.addUserRoleList.map(item=>({
              fullname: item.fullName || item.fullname,
              roleId: item.roleId,
              roleName: item.roleName,
              userId: item.userId
            }))
          }else{
            this.addUserRoleList = [this.groupCyObjc].map(item=>({
              fullname: item.fullname,
              roleId: item.roleId,
              roleName: item.roleName || '',
              userId: item.userId
            }))
          }
          if (!this.caseDetailFoemData.trademarkCaseCustWorkgroups[0].wkgId) {
            this.$message.error(`请先选择${[1, 4].includes(this.caseTaskType) ? '客户组' : '客户负责人'}`)
            this.dialogFormgroupCy = false
            return
          }
          if (!this.groupCyObjc.fullname) {
            this.$message.error('请先选择成员')
            return
          }
          // this.caseDetailFoemData.trademarkCaseCustWorkgroups[0].trademarkCaseWorkgroupMembers.push(
          //   objc
          // )
          this.caseDetailFoemData.trademarkCaseCustWorkgroups[0].trademarkCaseWorkgroupMembers.push(
            ...this.addUserRoleList
          )
          this.cyshow = true
          // this.sortTableList(this.caseDetailFoemData.trademarkCaseCustWorkgroups[0].trademarkCaseWorkgroupMembers)
        } else {
          if (!this.groupCyObjc.fullname) {
            this.$message.error('请先选择成员')
            return
          }
          objc.groupId = this.caseDetailFoemData.trademarkCaseCBWorkgroups[
            this.addCbzCyindex
            ].groupId
          //addUserRoleList
        if(this.addUserRoleList.length){
          this.addUserRoleList = this.addUserRoleList.map(item=>({
            fullname: item.fullName || item.fullname,
            roleId: item.roleId,
            roleName: item.roleName,
            userId: item.userId,
            // groupId: item.groupId
          }))
        }else{
          this.addUserRoleList = [this.groupCyObjc].map(item=>({
            fullname: item.fullname,
            roleId: item.roleId,
            roleName: item.roleName || '',
            userId: item.userId,
            // groupId: item.groupId
          }))
        }
          // this.caseDetailFoemData.trademarkCaseCBWorkgroups[
          //   this.addCbzCyindex
          //   ].trademarkCaseWorkgroupMembers.push(objc)
          this.caseDetailFoemData.trademarkCaseCBWorkgroups[
            this.addCbzCyindex
            ].trademarkCaseWorkgroupMembers.push(...this.addUserRoleList)
          this.cbshow = true
          // this.caseDetailFoemData.trademarkCaseCBWorkgroups && this.caseDetailFoemData.trademarkCaseCBWorkgroups.length && this.caseDetailFoemData.trademarkCaseCBWorkgroups.forEach(item => {
          //   if (item.trademarkCaseWorkgroupMembers && item.trademarkCaseWorkgroupMembers.length) {
          //     this.sortTableList(item.trademarkCaseWorkgroupMembers)
          //   }
          // })
        }
        // console.log(this.caseDetailFoemData.trademarkCaseCBWorkgroups, "+++");
        this.dialogFormgroupCy = false
        this.$emit('workGroup', this.caseDetailFoemData, this.isCustwork)
        // this.addUserRoleList = []
      },
      addgroupCy(type, index) {
        this.dialogFormgroupCy = true
        if (type == 'cbz') {
          this.addCbzCyindex = index
        } else {
          this.addCbzCyindex = ''
        }
      },
      disabledUser(userId){
        if(this.isCustwork == 'cb'){
          let hasExit = false
          this.plData && this.plData.length && this.plData.forEach((item, index) => {
            if (index === this.addCbzCyindex && item.trademarkCaseWorkgroupMembers && item.trademarkCaseWorkgroupMembers.length) {
              item.trademarkCaseWorkgroupMembers.forEach(it => {
                if(it.userId === userId){
                  hasExit = true
                }
              })
            }
          })
          return hasExit
        }else if(this.isCustwork == 'cust'){
          return this.plData[0].trademarkCaseWorkgroupMembers&&this.plData[0].trademarkCaseWorkgroupMembers.find(i => i.userId == userId) || false
        }
        if(this.addCbzCyindex === ''){
          return this.caseDetailFoemData.trademarkCaseCustWorkgroups[0].trademarkCaseWorkgroupMembers&&this.caseDetailFoemData.trademarkCaseCustWorkgroups[0].trademarkCaseWorkgroupMembers.find(i => i.userId == userId) || false
        }else{
          let hasExit = false
          this.caseDetailFoemData.trademarkCaseCBWorkgroups && this.caseDetailFoemData.trademarkCaseCBWorkgroups.length && this.caseDetailFoemData.trademarkCaseCBWorkgroups.forEach((item, index) => {
            if (index === this.addCbzCyindex && item.trademarkCaseWorkgroupMembers && item.trademarkCaseWorkgroupMembers.length) {
              item.trademarkCaseWorkgroupMembers.forEach(it => {
                if(it.userId === userId){
                  hasExit = true
                }
              })
            }
          })
          return hasExit
        }
      },
      delgroupCb(index) {
        this.caseDetailFoemData.trademarkCaseCBWorkgroups[index].trademarkCaseWorkgroupMembers
        && this.caseDetailFoemData.trademarkCaseCBWorkgroups[index].trademarkCaseWorkgroupMembers.length
        && this.caseDetailFoemData.trademarkCaseCBWorkgroups[index].trademarkCaseWorkgroupMembers.forEach(item=>{
          if(item.caseRoleName){
            this.caseRoleSelectList = this.caseRoleSelectList.filter(i=>i!==item.caseRoleName)
            item.caseRoleName = ''
          }
        })
        this.caseDetailFoemData.trademarkCaseCBWorkgroups.splice(index, 1)
        this.$emit('workGroup', this.caseDetailFoemData, this.isCustwork)
        this.$emit('caseRoleSelectList', [...new Set(this.caseRoleSelectList)])
      },
      delKhgroup(userId) {
        // const index = this.caseDetailFoemData.trademarkCaseCustWorkgroups[0].trademarkCaseWorkgroupMembers.indexOf(
        //   item
        // );
        // console.log( this.caseDetailFoemData,'00-00')
        this.caseDetailFoemData.trademarkCaseCustWorkgroups[0].trademarkCaseWorkgroupMembers =
          this.caseDetailFoemData.trademarkCaseCustWorkgroups[0].trademarkCaseWorkgroupMembers.filter(item=>item.userId != userId)
        this.changeCaseRoleSelectList()
        this.$emit('workGroup', this.caseDetailFoemData, this.isCustwork)
      },
      delgroupCbCy(userId, index) {
        // const index1 = this.caseDetailFoemData.trademarkCaseCBWorkgroups[
        //   index
        // ].trademarkCaseWorkgroupMembers.indexOf(row);
        this.caseDetailFoemData.trademarkCaseCBWorkgroups[
          index
          ].trademarkCaseWorkgroupMembers =
          this.caseDetailFoemData.trademarkCaseCBWorkgroups[
          index
          ].trademarkCaseWorkgroupMembers.filter(item=>item.userId != userId)
        // this.caseDetailFoemData.trademarkCaseCBWorkgroups[
        //   index
        //   ].trademarkCaseWorkgroupMembers.splice(index1, 1)
        this.changeCaseRoleSelectList()
        this.$emit('workGroup', this.caseDetailFoemData, this.isCustwork)
      },
      changeHanlder(){
        console.log('变更！！');
        this.$forceUpdate()
      },
      fetchCustUserList() {
        queryCustUserList({
          custId: this.caseDetailFoemData.custId,
          caseTypeId: this.caseDetailFoemData.caseTypeId,
          appFromto: this.caseDetailFoemData.appFromto,
          rightType: this.caseDetailFoemData.rightType,
          wkId: this.caseDetailFoemData.lawsuitWorkArray ? this.caseDetailFoemData.lawsuitWorkArray[this.caseDetailFoemData.lawsuitWorkArray.length - 1] : undefined,
        }).then(res => {
          let list  = res.data || []
          const arr = JSON.parse(JSON.stringify(this.caseDetailFoemData.caseCustRespUserArray))
          if (arr&&arr.length) {
            list = res.data.concat(arr)
          }
          // 使用 Map 或 Set 来去重，基于 userId
          const uniqueList = Array.from(
            new Map(list.map(item => [item.userId, item])).values()
          )
          this.custUserList =uniqueList.map((item)=>{
            return{
              userId:item.userId,
              fullname:item.fullname
            }
          })
          const isMassfilingStauts = this.prePage =='立卷'||this.prePage =='批量立卷' 
          if (isMassfilingStauts||this.$route.query.type == 'massfiling'||this.$route.query.operate == 'many' || this.$route.query.copy == 'true') {
            if (uniqueList.length == 1) {
              this.caseDetailFoemData.caseCustRespUserArray = [uniqueList[0]]
            }
          }
        })
      }
    },
    created() {
      if (this.isCustwork == '') {
        if (!this.caseDetailData.trademarkCaseCustWorkgroups.length) {
          this.caseDetailData.trademarkCaseCustWorkgroups = [
            { wkgId: '' }
          ]
        }
        this.caseDetailFoemData = this.caseDetailData
      }
      // console.log(this.caseDetailFoemData,777);
      if (this.isCustwork == 'cust') {
        this.caseDetailFoemData = {
          trademarkCaseCustWorkgroups: this.plData,
          trademarkCaseLCWorkgroups: [],
          trademarkCaseCBWorkgroups: { wkgId: '' }

        }

      }
      if (this.isCustwork == 'cb') {
        this.caseDetailFoemData = {
          trademarkCaseCustWorkgroups: { wkgId: '' },
          trademarkCaseLCWorkgroups: [],
          trademarkCaseCBWorkgroups: this.plData

        }
      }
      if (this.isEdit) {
        queryCaseWorkgroupUrl({ status: '1' }).then(res => {
          this.custGroup = res.data
          this.filterGroup = res.data
          this.custfilterGroup = res.data
        })
        queryCaseWorkgroupUrl({ status: '2', caseTypeId: this.caseDetailFoemData.caseTypeId }).then(res => {
          this.technologicalProcess = res.data
        })
        queryRoleNames().then(response => {
          this.selectData.rolename = response.data
        })
          .catch(err => {
            console.log(err)
          })
        querywfUserNameUrl().then(response => {
          this.selectData.username = response.data
        })
      }
      if (this.statusChange) {
        this.$set(this.caseDetailFoemData, 'updateWorkType', 1)
        // this.caseDetailFoemData.updateWorkType = 1
      }
      this.isPatent && this.queryDeptByCondition()
      // queryUserNames()
      //   .then(response => {
      //     this.selectData.username = response.data;
      //   })
      //   .catch(err => {
      //     console.log(err);
      //   });
      // }
      this.queryCaseRoleName()
    },
    mounted() {
      if (this.caseDetailFoemData.caseType === '商标行政') {
        queryCustPOAPerson().then(res => {
          this.poaList = res.data
        })
      }
      if(this.$store.getters.patentCaseTypeIdList.includes(this.caseDetailFoemData.caseTypeId) || this.$store.getters.tmCaseTypeIdList.includes(this.caseDetailFoemData.caseTypeId)){
        this.cbshow = false
        this.cyshow = false
        this.lcshow = false
      }
      this.changeCaseRoleSelectList()

      this.isPatent&&this.fetchPatentAgentUserList()
      //流程组
      // this.sortTableList(this.caseDetailFoemData.trademarkCaseLCWorkgroups
      //   && this.caseDetailFoemData.trademarkCaseLCWorkgroups[0]
      //   && this.caseDetailFoemData.trademarkCaseLCWorkgroups[0].trademarkCaseWorkgroupMembers)
      //承办组
      // this.caseDetailFoemData.trademarkCaseCBWorkgroups && this.caseDetailFoemData.trademarkCaseCBWorkgroups.length && this.caseDetailFoemData.trademarkCaseCBWorkgroups.forEach(item => {
      //   if (item.trademarkCaseWorkgroupMembers && item.trademarkCaseWorkgroupMembers.length) {
      //     this.sortTableList(item.trademarkCaseWorkgroupMembers)
      //   }
      // })
      //客户组
      // this.sortTableList(this.caseDetailFoemData.trademarkCaseCustWorkgroups && this.caseDetailFoemData.trademarkCaseCustWorkgroups[0] && this.caseDetailFoemData.trademarkCaseCustWorkgroups[0].trademarkCaseWorkgroupMembers)
      // if (!this.caseDetailFoemData.trademarkCaseCustWorkgroups[0]) {
      //   this.$set(this.caseDetailFoemData.trademarkCaseCustWorkgroups, 0, { wkgId: '' })
      //   // this.caseDetailFoemData.trademarkCaseCustWorkgroups[0] = { wkgId: "" };
      // }
      if (!this.caseDetailFoemData.trademarkCaseLCWorkgroups[0]) {
        this.$set(this.caseDetailFoemData.trademarkCaseLCWorkgroups, 0, {})
        // if (this.isEdit && !this.isTrademark) {
        //   queryCaseWorkgroupUrl({status: "2", groupName: '律所流程组', caseTypeId: this.caseDetailFoemData.caseTypeId}).then(
        //     res => {
        //       this.caseDetailFoemData.trademarkCaseLCWorkgroups[0].bossUserId = res.data[0].bossUserId;
        //       this.caseDetailFoemData.trademarkCaseLCWorkgroups[0].wkgRoleId = res.data[0].wkgRoleId;
        //       this.caseDetailFoemData.trademarkCaseLCWorkgroups[0].wkgId = res.data[0].wkgId
        //       this.caseDetailFoemData.trademarkCaseLCWorkgroups[0].groupName = res.data[0].groupName
        //       this.caseDetailFoemData.trademarkCaseLCWorkgroups[0].trademarkCaseWorkgroupMembers =
        //         res.data[0].wkgUsers;
        //       // this.$emit("workGroup", this.caseDetailFoemData,this.isCustwork);
        //     }
        //   );
        // }
      } else {
        // if (this.isEdit && !this.isTrademark) {
        //   queryCaseWorkgroupUrl({status: "2", groupName: '律所流程组', caseTypeId: this.caseDetailFoemData.caseTypeId}).then(
        //     res => {
        //       this.caseDetailFoemData.trademarkCaseLCWorkgroups[0].bossUserId = res.data[0].bossUserId;
        //       this.caseDetailFoemData.trademarkCaseLCWorkgroups[0].wkgRoleId = res.data[0].wkgRoleId;
        //       this.caseDetailFoemData.trademarkCaseLCWorkgroups[0].wkgId = res.data[0].wkgId
        //       this.caseDetailFoemData.trademarkCaseLCWorkgroups[0].groupName = res.data[0].groupName
        //       this.caseDetailFoemData.trademarkCaseLCWorkgroups[0].trademarkCaseWorkgroupMembers =
        //         res.data[0].wkgUsers;
        //       // this.$emit("workGroup", this.caseDetailFoemData,this.isCustwork);
        //     }
        //   );
        // }
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";

  .createPost-container {
    position: relative;
    padding: 10px 2px;
    border: 1px solid #d7d7d7;
    margin: 15px 20px;
    min-height: 800px;

    .step-div {
      padding: 20px 65px;
    }

    /deep/ .el-tabs__header {
      margin-bottom: 2px;
    }

    /deep/ .el-collapse-item__header {
      display: block;
      text-align: center;
      background: #f5f5f5;
      height: 35px;
      line-height: 35px;
    }

    /deep/ .el-collapse-item__content {
      padding: 0px;
    }

    .fg-div {
      height: 20px;
      background: #e4e4e4;
    }

    .tilteSpan {
      font-size: 18px;
      padding: 15px 0px;
      color: #7199d5;

      span {
        display: block;
      }
    }

    /deep/ .el-step {
      cursor: pointer;
    }
  }

  .table-dl-row {
    /deep/ thead,
    /deep/ th,
    /deep/ .el-table__header-wrapper,
    /deep/ .el-table__header,
    /deep/ tr,
    /deep/ td,
    /deep/ .el-select,
    /deep/ .el-input,
    /deep/ .el-input__inner {
      height: 35px;
      line-height: 35px;
      // padding: 0px;
    }

    /deep/ td {
      background-color: #ffffff !important;
    }

    /deep/ .el-input__inner,
    /deep/ .el-select {
      width: 100% !important;
    }
  }

  /deep/ .form-border {
    .el-form-item__error {
      position: relative !important;
      top: 0;

    }

    .el-row {
      margin: 0px;
    }

    .postInfo-container-item {
      width: 100%;
    }

    .el-form-item__label {
      background-color: #f9f9f9;
      width: 36.7%;
      text-align: right;
    }

    .el-form-item {
      border-right: 1px solid #d7d7d7;
      border-left: 1px solid #d7d7d7;
      margin: 0px !important;
    }

    .el-row {
      border-bottom: 1px solid #d7d7d7;
    }

    .el-input,
    .el-select {
      width: 77%;
    }

    .el-form-item__content {
      text-align: left;
      // height: 30px;
    }

    .fullRow {
      .el-form-item__label {
        width: 15%;
      }

      .el-input,
      .el-select {
        width: 30%;
      }
    }

    .el-input__inner {
      // border: none;
    }

    .el-select .el-input {
      width: 100%;
    }

    .postInfo-container-item {
      display: flex;
      width: 100%;

      .el-form-item__content {
        text-align: left;
        display: inline-table;
        width: 100%;
        padding: 5px 15px;
        margin-left: 0 !important;
      }

      .el-form-item__label {
        line-height: 43px;
        border-right: 1px solid #d7d7d7;
      }
    }

    .patent {
      .el-form-item {
        display: flex;
        justify-content: left;
        width: 100%;
      }

      .el-form-item__content {
        text-align: left;
        display: inline-table;
        width: 100%;
        padding: 5px 15px;
        margin-left: 0 !important;
      }

      .el-form-item__label {
        flex-shrink: 0;
        line-height: 43px;
        border-right: 1px solid #d7d7d7;
      }
    }

    border-top: 1px solid #d7d7d7;
    border-left: 1px solid #d7d7d7;
    // border-bottom: 1px solid #d7d7d7;
  }

  /deep/ .el-table__header tr,
  /deep/ .el-table__header th {
    padding: 0;
    height: 30px;
    background: #f5f5f5;
  }

  /deep/ .el-table__body tr,
  /deep/ .el-table__body td {
    padding: 0;
    height: 40px;
  }

  /deep/ .el-step {
    cursor: pointer;
  }

  .upload-btn {
    display: inline-block;
  }

  /deep/ .el-table /deep/ .warning-row {
    background: #dd7a7a;
    color: white;
  }

  .redClass {
    color: #dd7a7a;
  }

  .greenClass {
    color: rgb(49, 165, 49);
  }

  .tmCmsearch {
    /deep/ .el-select .el-input {
      width: 130px;
    }

    /deep/ .input-with-select .el-input-group__prepend {
      background-color: #fff;
    }
  }

  .totleSpan {
    display: inline-block;
    border: 1px solid #ccc;
    text-align: center;
    padding: 5px 100px;
    margin-top: 12px;
  }

  .seeType {
    /deep/ .el-input__inner {
      border: none;
    }

    /deep/ .el-input__suffix {
      display: none;
    }
  }
  .required-asterisk{ color:#F56C6C; margin-right:4px; }
</style>

