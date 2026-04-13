<template>
  <div class="staff_mangement_detail">
    <h2 class="title">{{$route.meta.title}}</h2>
    <div class="createPost-container">

      <el-form ref="postForm" :model="postForm" size="mini" class="form-container">
        <el-table class="staff_mangement_detail_table">
          <el-table-column>
            <template slot="header" slot-scope="scope">
              <table class="staff_table">
                <tr>
                  <td>
                    <el-form-item label-width="130px" label="编号:" class="postInfo-container-item">
                    </el-form-item>
                  </td>
                  <td class="td"><span style="padding-left: 6px">{{$route.query.userId}}</span></td>
                  <td rowspan="4">
                    <el-form-item label-width="130px" label="照片:" class="postInfo-container-item">
                    </el-form-item>
                  </td>
                  <td rowspan="4">
                    <div class="uploadWrap">
                      <el-upload ref="upload" class="avatar-uploader" :action="addUserIconUrl" :show-file-list="false" :before-upload="beforeAvatarUpload" :auto-upload="false" :on-change="fileChange"
                        :data="postPicData">
                        <img v-if="imageUrl" :src="imageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                      </el-upload>
                      <div class="tips">
                        <p class="ts-p">提示：</p>
                        <p class="ts-p">图片格式为jpg、png，</p>
                        <p class="ts-p">图片大小不得超过200kb</p>
                      </div>
                    </div>

                  </td>
                </tr>
                <tr>
                  <td>
                    <el-form-item :rules='rules' label-width="130px" label="姓名:" class="postInfo-container-item">
                    </el-form-item>
                  </td>
                  <td>
                    <el-input v-model="postForm.fullname"></el-input>
                  </td>
                </tr>
                <tr>
                  <td>
                    <el-form-item label-width="130px" label="英文姓名:" class="postInfo-container-item">
                    </el-form-item>
                  </td>
                  <td>
                    <el-input v-model="postForm.fullnameEn"></el-input>
                  </td>
                </tr>
                <tr>
                  <td>
                    <el-form-item :rules='rules' label-width="130px" label="性别:" class="postInfo-container-item">

                    </el-form-item>
                  </td>
                  <td>
                    <div style="padding-left: 6px">
                      <el-radio v-model="postForm.sex" label="1">男</el-radio>
                      <el-radio v-model="postForm.sex" label="2">女</el-radio>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <el-form-item label-width="130px" label="身份证号:" class="postInfo-container-item">
                    </el-form-item>
                  </td>
                  <td>
                    <el-input v-model="postForm.IDCard"></el-input>
                  </td>
                  <td>
                    <el-form-item label-width="130px" label="生日:" class="postInfo-container-item">
                    </el-form-item>
                  </td>
                  <td>
                    <el-date-picker v-model="postForm.birthday" type="date" placeholder="选择日期">
                    </el-date-picker>
                  </td>
                </tr>
                <tr>
                  <td>
                    <el-form-item :rules='rules' label-width="130px" label="职位:" class="postInfo-container-item">
                    </el-form-item>
                  </td>
                  <td>
                    <el-select default-first-option v-model="postForm.position" clearable filterable placeholder="请选择">
                      <el-option v-for="item in queryPositionList" :key="item.userPosId" :label="item.position" :value="item.userPosId">
                      </el-option>
                    </el-select>
                  </td>
                  <td>
                    <el-form-item label-width="130px" label="合伙人所属领域:" class="postInfo-container-item">
                    </el-form-item>
                  </td>
                  <td>
                    <el-select default-first-option multiple v-model="partnerFieldIdList" clearable filterable placeholder="请选择">
                      <el-option v-for="item in domainList" :key="item.id" :label="item.typeName" :value="item.id">
                      </el-option>
                    </el-select>
                  </td>
                </tr>
                <tr>
                  <td>
                    <el-form-item :rules='rules' label-width="130px" label="所属部门:" class="postInfo-container-item">
                    </el-form-item>
                  </td>
                  <td>
                    <el-select default-first-option v-model="postForm.deptId" clearable filterable placeholder="请选择">
                      <el-option v-for="item in queryDeptByConditionList" :key="item.deptId" :label="item.name" :value="item.deptId">
                      </el-option>
                    </el-select>
                  </td>
                  <td>
                    <el-form-item label-width="130px" label="是否在职:" class="postInfo-container-item">
                    </el-form-item>
                  </td>
                  <td>
                    <div style="padding-left: 6px">
                      <el-radio v-model="postForm.isActive" label="1">在职</el-radio>
                      <el-radio v-model="postForm.isActive" label="0">离职</el-radio>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <el-form-item :rules='rules' label-width="130px" label="入职日期:" class="postInfo-container-item">

                    </el-form-item>
                  </td>
                  <td>
                    <el-date-picker v-model="postForm.jointime" type="date" placeholder="选择日期">
                    </el-date-picker>
                  </td>
                  <td>
                    <el-form-item label-width="130px" label="离职日期:" class="postInfo-container-item">
                    </el-form-item>
                  </td>
                  <td>
                    <el-date-picker :disabled="dimissionTimeDisableState" v-model="postForm.dimissionTime" type="date" placeholder="选择日期">
                    </el-date-picker>
                  </td>
                </tr>
                <tr>
                  <td>
                    <el-form-item label-width="130px" label="手机号:" class="postInfo-container-item">

                    </el-form-item>
                  </td>
                  <td>
                    <el-input v-model="postForm.phone"></el-input>
                  </td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td>
                    <el-form-item label-width="130px" label="办公电话:" class="postInfo-container-item">

                    </el-form-item>
                  </td>
                  <td>
                    <el-input v-model="postForm.phhoneext"></el-input>
                  </td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td>
                    <el-form-item :rules='rules' label-width="130px" label="邮箱:" class="postInfo-container-item">

                    </el-form-item>
                  </td>
                  <td>
                    <el-input v-model="postForm.email" @change="(string)=>$set(postForm,'username',string)"></el-input>
                  </td>
                  <td>
                    <el-form-item label-width="130px" label="用户名:" class="postInfo-container-item">
                    </el-form-item>
                  </td>
                  <td>
                    <el-input v-model="postForm.username"></el-input><span class="setHeight" @click="settingState = true;mailbox.email?'':mailbox.email=postForm.email">高级邮箱设置</span>
                  </td>

                </tr>
                <tr>
                  <td>
                    <el-form-item label-width="130px" label="员工号:" class="postInfo-container-item">

                    </el-form-item>
                  </td>
                  <td>
                    <el-input v-model="postForm.wechat"></el-input>
                  </td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td>
                    <el-form-item label-width="130px" label="律师证号:" class="postInfo-container-item">
                    </el-form-item>
                  </td>
                  <td>
                    <el-input v-model="postForm.lawyerNo"></el-input>
                  </td>
                  <td>
                    <el-form-item label-width="130px" label="专利证号:" class="postInfo-container-item">

                    </el-form-item>
                  </td>
                  <td>
                    <el-input v-model="postForm.patentNo"></el-input>
                  </td>
                </tr>
                <!--<tr>-->
                  <!--<td>-->
                    <!--<el-form-item label-width="130px" label="所属工作组:" class="postInfo-container-item">-->
                    <!--</el-form-item>-->
                  <!--</td>-->
                  <!--<td colspan="3">-->
                    <!--<div style="display: block">-->
                      <!--<el-button type="primary" class="floatRight" @click="handleAddItem(1)">添加</el-button>-->
                    <!--</div>-->
                    <!--&lt;!&ndash;<table>&ndash;&gt;-->
                      <!--&lt;!&ndash;<tr>&ndash;&gt;-->
                        <!--&lt;!&ndash;<th class="width332"> 工作组名称</th>&ndash;&gt;-->
                        <!--&lt;!&ndash;<th class="width332"> 工作组角色</th>&ndash;&gt;-->
                        <!--&lt;!&ndash;<th class="width332"> 备注</th>&ndash;&gt;-->
                        <!--&lt;!&ndash;<th class="width68"> 操作</th>&ndash;&gt;-->
                      <!--&lt;!&ndash;</tr>&ndash;&gt;-->
                      <!--&lt;!&ndash;<tr v-for="item,index in postForm.workgroups" :key="index">&ndash;&gt;-->
                        <!--&lt;!&ndash;<td>&ndash;&gt;-->
                          <!--&lt;!&ndash;<el-select default-first-option @change="sonWorkGroup(index,postForm.workgroups[index].wkgId)" v-model="postForm.workgroups[index].wkgId" :disabled="item.disabledState"&ndash;&gt;-->
                            <!--&lt;!&ndash;clearable filterable placeholder="请选择">&ndash;&gt;-->
                            <!--&lt;!&ndash;<el-option v-for="item in queryWorkgroupNamesList" :key="item.wkgId" :label="item.groupName" :value="item.wkgId">&ndash;&gt;-->
                            <!--&lt;!&ndash;</el-option>&ndash;&gt;-->
                          <!--&lt;!&ndash;</el-select>&ndash;&gt;-->
                        <!--&lt;!&ndash;</td>&ndash;&gt;-->
                        <!--&lt;!&ndash;<td>&ndash;&gt;-->
                          <!--&lt;!&ndash;<el-select default-first-option v-model="postForm.workgroups[index].wkgRoleId" :disabled="item.disabledState" clearable filterable placeholder="请选择">&ndash;&gt;-->
                            <!--&lt;!&ndash;<el-option v-for="item in queryRoleNamesList" :key="item.roleId" :label="item.name" :value="item.roleId">&ndash;&gt;-->
                            <!--&lt;!&ndash;</el-option>&ndash;&gt;-->
                          <!--&lt;!&ndash;</el-select>&ndash;&gt;-->
                        <!--&lt;!&ndash;</td>&ndash;&gt;-->
                        <!--&lt;!&ndash;<td>&ndash;&gt;-->
                          <!--&lt;!&ndash;<el-input v-model="postForm.workgroups[index].memo" :disabled="item.disabledState"></el-input>&ndash;&gt;-->
                        <!--&lt;!&ndash;</td>&ndash;&gt;-->
                        <!--&lt;!&ndash;<td>&ndash;&gt;-->
                          <!--&lt;!&ndash;<el-button @click="handleChangeDisable(1,index)" type="text" size="small">{{item.disabledState?'修改':'保存'}}</el-button>&ndash;&gt;-->
                          <!--&lt;!&ndash;<el-button type="text" size="small" @click="deleteDeptId(1,index)">删除</el-button>&ndash;&gt;-->
                        <!--&lt;!&ndash;</td>&ndash;&gt;-->
                      <!--&lt;!&ndash;</tr>&ndash;&gt;-->
                    <!--&lt;!&ndash;</table>&ndash;&gt;-->

                  <!--</td>-->
                <!--</tr>-->
                <!--<tr>-->
                  <!--<td>-->
                    <!--<el-form-item label-width="130px" label="负责的客户:" class="postInfo-container-item">-->
                    <!--</el-form-item>-->
                  <!--</td>-->
                  <!--<td colspan="3">-->
                    <!--<div style="display: block">-->
                      <!--<el-button type="primary" class="floatRight" @click="handleAddItem(2)">添加</el-button>-->
                    <!--</div>-->
                    <!--<table>-->
                      <!--<tr>-->
                        <!--<th class="width332"> 客户名称</th>-->
                        <!--<th class="width332"> 备注</th>-->
                        <!--<th class="width68"> 操作</th>-->
                      <!--</tr>-->
                      <!--<tr v-for="item,index in postForm.agencyContacts" :key="index">-->
                        <!--<td>-->
                          <!--<el-select default-first-option v-model="postForm.agencyContacts[index].custId" clearable filterable remote reserve-keyword placeholder="请输入关键词"-->
                            <!--:remote-method="queryCustName" :disabled="item.disabledState">-->
                            <!--<el-option v-for="item in queryCustNameList.slice(0,100)" :key="item.custId" :label="item.name" :value="item.custId">-->
                            <!--</el-option>-->
                          <!--</el-select>-->
                        <!--</td>-->
                        <!--<td>-->
                          <!--<el-input v-model="postForm.agencyContacts[index].memo" :disabled="item.disabledState"></el-input>-->
                        <!--</td>-->
                        <!--<td>-->
                          <!--<el-button @click="handleChangeDisable(2,index)" type="text" size="small">{{item.disabledState?'修改':'保存'}}</el-button>-->
                          <!--<el-button type="text" size="small" @click="deleteDeptId(2,index)">删除</el-button>-->
                        <!--</td>-->
                      <!--</tr>-->
                    <!--</table>-->
                  <!--</td>-->
                <!--</tr>-->
                <!--<tr>-->
                  <!--<td>-->
                    <!--<el-form-item label-width="130px" label="员工费率:" class="postInfo-container-item">-->
                    <!--</el-form-item>-->
                  <!--</td>-->
                  <!--<td colspan="3">-->
                    <!--<table>-->
                      <!--<tr>-->
                        <!--<th class="width332"> 费率</th>-->
                        <!--<th class="width332"> 备注</th>-->
                        <!--<th class="width68"> 操作</th>-->
                      <!--</tr>-->
                      <!--<tr v-for="item,index in postForm.userRates" :key="index">-->
                        <!--<td>-->
                          <!--<el-input v-model="postForm.userRates[0].rate" :disabled="item.disabledState"></el-input>-->
                        <!--</td>-->
                        <!--<td>-->
                          <!--<el-input v-model="postForm.userRates[0].memo" :disabled="item.disabledState"></el-input>-->
                        <!--</td>-->
                        <!--<td>-->
                          <!--<el-button @click="handleChangeDisable(3,index)" type="text" size="small">{{item.disabledState?'修改':'保存'}}</el-button>-->
                          <!--<el-button type="text" size="small" @click="deleteDeptId(3,index)">取消</el-button>-->
                        <!--</td>-->
                      <!--</tr>-->
                    <!--</table>-->
                  <!--</td>-->
                <!--</tr>-->
                <!--<tr v-if="$route.params.title=='2'">-->
                  <!--<td>-->
                    <!--<el-form-item label-width="130px" label="员工变动记录:" class="postInfo-container-item">-->
                    <!--</el-form-item>-->
                  <!--</td>-->
                  <!--<td colspan="3">-->
                    <!--<div style="display: block">-->
                      <!--<el-button type="primary" class="floatRight" @click="handleAddItem(4)">添加</el-button>-->
                    <!--</div>-->
                    <!--<table>-->
                      <!--<tr>-->
                        <!--<th class="width100"> 员工</th>-->
                        <!--<th class="width332"> 变动类型</th>-->
                        <!--<th class="width332"> 变动日期</th>-->
                        <!--<th class="width332"> 转组原组</th>-->
                        <!--<th class="width332"> 转组新组</th>-->
                        <!--<th class="width68"> 操作</th>-->
                      <!--</tr>-->
                      <!--<tr v-for="item,index in postForm.userChanges" :key="index">-->
                        <!--<td>{{postForm.fullname}}</td>-->
                        <!--<td>-->
                          <!--<el-select default-first-option v-model="postForm.userChanges[index].changeType" :disabled="item.disabledState" clearable filterable placeholder="请选择">-->
                            <!--<el-option v-for="item in changeTypeList" :key="item.changeType" :label="item.value" :value="item.changeType">-->
                            <!--</el-option>-->
                          <!--</el-select>-->
                        <!--</td>-->
                        <!--<td>-->
                          <!--<el-date-picker :disabled="item.disabledState" v-model="postForm.userChanges[index].changeDate" type="date" placeholder="选择日期">-->
                          <!--</el-date-picker>-->
                        <!--</td>-->
                        <!--<td>-->
                          <!--<el-select default-first-option v-model="postForm.userChanges[index].oldGroup" :disabled="item.disabledState" filterable placeholder="请选择">-->
                            <!--<el-option v-for="item in queryWorkgroupNamesList" :key="item.wkgId" :label="item.groupName" :value="item.wkgId">-->
                            <!--</el-option>-->
                          <!--</el-select>-->
                        <!--</td>-->
                        <!--<td>-->
                          <!--<el-select default-first-option v-model="postForm.userChanges[index].newGroup" :disabled="item.disabledState" filterable placeholder="请选择">-->
                            <!--<el-option v-for="item in queryWorkgroupNamesList" :key="item.wkgId" :label="item.groupName" :value="item.wkgId">-->
                            <!--</el-option>-->
                          <!--</el-select>-->
                        <!--</td>-->
                        <!--<td>-->
                          <!--<el-button @click="handleChangeDisable(4,index)" type="text" size="small">{{item.disabledState?'修改':'保存'}}</el-button>-->
                          <!--<el-button type="text" size="small" @click="deleteDeptId(4,index)">删除</el-button>-->
                        <!--</td>-->
                      <!--</tr>-->
                    <!--</table>-->
                  <!--</td>-->
                <!--</tr>-->
              </table>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <el-form  class="table-el-form" label-width="151px"  >
        <el-row>
          <el-form-item label="所属工作组:"  style="border-top:0 ">
            <div style="display: block">
              <el-button type="primary" class="floatRight" @click="handleAddItem(1)">添加</el-button>
            </div>
            <el-table
            :data="postForm.workgroups"
            border
            style="width: 100%">
            <el-table-column
            prop="date"
            label="工作组名称"
            >
            <template slot-scope="scope">
            <el-select default-first-option @change="sonWorkGroup(scope.$index,postForm.workgroups[scope.$index].wkgId)" v-model="postForm.workgroups[scope.$index].wkgId" :disabled="scope.row.disabledState"
            clearable filterable placeholder="请选择">
            <el-option v-for="item in queryWorkgroupNamesList" :key="item.wkgId" :label="item.groupName" :value="item.wkgId">
            </el-option>
            </el-select>
            </template>
            </el-table-column>
            <el-table-column
            prop="name"
            label="工作组角色:"
            >
            <template slot-scope="scope">
            <el-select default-first-option v-model="postForm.workgroups[scope.$index].wkgRoleId" :disabled="scope.row.disabledState" clearable filterable placeholder="请选择">
            <el-option v-for="item in queryRoleNamesList" :key="item.roleId" :label="item.name" :value="item.roleId">
            </el-option>
            </el-select>
            </template>
            </el-table-column>
            <el-table-column
            prop="address"
            label="备注">
            <template slot-scope="scope">
            <el-input v-model="postForm.workgroups[scope.$index].memo" :disabled="scope.row.disabledState"></el-input>
            </template>
            </el-table-column>
            <el-table-column
            prop="address"
            label="操作">
            <template slot-scope="scope">
            <el-button @click="handleChangeDisable(1,scope.$index)" type="text" size="small">{{scope.row.disabledState?'修改':'保存'}}</el-button>
            <el-button type="text" size="small" @click="deleteDeptId(1,scope.$index)">删除</el-button>
            </template>
            </el-table-column>
            </el-table>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="负责的客户:"  >
            <div style="display: block">
<!--              <el-button type="primary" class="floatRight" @click="handleAddItem(2)" style="margin: 0 10px;">全部</el-button>-->
              <el-button type="primary" class="floatRight" @click="handleAddItem(2)">添加</el-button>
            </div>
            <AgGridVue :style="{width:'100%',height: 300+'px',border:'1px'}"
                       ref="agency"
                       class="ag-theme-balham"
                       :columnDefs="columnDefs"
                       :gridOptions="gridOptions"
                       :rowData="postForm.agencyContacts"
                       :localeText="$store.state.caseInformation.localeText"
                       :getContextMenuItems="getContextMenuItems"
                       @CellValueChangedEvent="CellValueChangedEvent"
                       :frameworkComponents="frameworkComponents"
            >
            </AgGridVue>
<!--            <el-table-->
<!--              :data="postForm.agencyContacts"-->
<!--              border-->
<!--              style="width: 100%">-->
<!--              <el-table-column-->
<!--                prop="date"-->
<!--                label="客户名称"-->
<!--               >-->
<!--                <template slot-scope="scope">-->
<!--                  <el-select default-first-option v-model="postForm.agencyContacts[scope.$index].custId" clearable filterable remote reserve-keyword placeholder="请输入关键词"-->
<!--                             :remote-method="queryCustName" :disabled="scope.row.disabledState">-->
<!--                    <el-option v-for="item in queryCustNameList.slice(0,100)" :key="item.custId" :label="item.name" :value="item.custId">-->
<!--                    </el-option>-->
<!--                  </el-select>-->
<!--                </template>-->
<!--              </el-table-column>-->
<!--              <el-table-column-->
<!--                prop="name"-->
<!--                label="备注"-->
<!--                >-->
<!--                <template slot-scope="scope">-->
<!--                  <el-input v-model="postForm.agencyContacts[scope.$index].memo" :disabled="scope.row.disabledState"></el-input>-->
<!--                </template>-->
<!--              </el-table-column>-->
<!--              <el-table-column-->
<!--                prop="address"-->
<!--                label="操作">-->
<!--                <template slot-scope="scope">-->
<!--                  <el-button @click="handleChangeDisable(2,scope.$index)" type="text" size="small">{{scope.row.disabledState?'修改':'保存'}}</el-button>-->
<!--                  <el-button type="text" size="small" @click="deleteDeptId(2,scope.$index)">删除</el-button>-->
<!--                </template>-->
<!--              </el-table-column>-->
<!--            </el-table>-->
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="员工费率:"  >
            <el-table
              :data="postForm.userRates"
              border
              style="width: 100%">
              <el-table-column
                prop="date"
                label="费率"
                >
                <template slot-scope="scope">
                  <el-input v-model="postForm.userRates[0].rate" :disabled="scope.row.disabledState"></el-input>
                </template>
              </el-table-column>
              <el-table-column
                prop="name"
                label="备注"
                >
                <template slot-scope="scope">
                  <el-input v-model="postForm.userRates[0].memo" :disabled="scope.row.disabledState"></el-input>
                </template>
              </el-table-column>
              <el-table-column
                prop="address"
                label="操作">
                <template slot-scope="scope">
                  <el-button @click="handleChangeDisable(3,scope.$index)" type="text" size="small">{{scope.row.disabledState?'修改':'保存'}}</el-button>
                  <el-button type="text" size="small" @click="deleteDeptId(3,scope.$index)">取消</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-row>
        <el-row v-if="$route.params.title=='2'">
          <el-form-item label="员工变动记录:"  >
            <div style="display: block">
              <el-button type="primary" class="floatRight" @click="handleAddItem(4)">添加</el-button>
            </div>
            <el-table
              :data="postForm.userChanges"
              border
              style="width: 100%">
              <el-table-column
                prop="date"
                label="员工"
                >
                <template slot-scope="scope">
                  {{postForm.fullname}}
                </template>
              </el-table-column>
              <el-table-column
                prop="name"
                label="变动类型"
                >
                <template slot-scope="scope">
                  <el-select default-first-option v-model="postForm.userChanges[scope.$index].changeType" :disabled="scope.row.disabledState" clearable filterable placeholder="请选择">
                    <el-option v-for="item in changeTypeList" :key="item.changeType" :label="item.value" :value="item.changeType">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                prop="name"
                label="变动日期"
                >
                <template slot-scope="scope">
                  <el-date-picker :disabled="scope.row.disabledState" v-model="postForm.userChanges[scope.$index].changeDate" type="date" placeholder="选择日期">
                  </el-date-picker>
                </template>
              </el-table-column>
              <el-table-column
                prop="name"
                label="转组原组"
                >
                <template slot-scope="scope">
                  <el-select default-first-option v-model="postForm.userChanges[scope.$index].oldGroup" :disabled="scope.row.disabledState" filterable placeholder="请选择">
                    <el-option v-for="item in queryWorkgroupNamesList" :key="item.wkgId" :label="item.groupName" :value="item.wkgId">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                prop="name"
                label="转组新组"
                >
                <template slot-scope="scope">
                  <el-select default-first-option v-model="postForm.userChanges[scope.$index].newGroup" :disabled="scope.row.disabledState" filterable placeholder="请选择">
                    <el-option v-for="item in queryWorkgroupNamesList" :key="item.wkgId" :label="item.groupName" :value="item.wkgId">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                prop="address"
                label="操作">
                <template slot-scope="scope">
                  <el-button @click="handleChangeDisable(4,scope.$index)" type="text" size="small">{{scope.row.disabledState?'修改':'保存'}}</el-button>
                  <el-button type="text" size="small" @click="deleteDeptId(4,scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-row>
      </el-form>
      <div class="button_wrap">
        <el-button class="exactButton" type="primary" @click="myRules">确定</el-button>
        <el-button class="exactButton" plain @click="cancel">取消</el-button>
      </div>
    </div>
    <advancedMailboxSettings :userId="setUserId" :mailbox="mailbox" :settingState="settingState" @settingChange="settingChange" @updateMailbox="updateMailbox"></advancedMailboxSettings>
  </div>

</template>

<script>
import getPageTitle from "@/utils/get-page-title";
import { addUserIcon } from "@/api/serviceApi.config.js";
import { getToken } from "@/utils/auth";
import {
  queryWorkgroupNames,
  queryDeptByCondition,
  queryCustName,
  queryPosition,
  addUser,
  updateUser,
  queryUserById,
  queryRoleNames
} from "@/api/systemList";
import aGSelectMany from "@/components/aGSelectMany/index.js";
import advancedMailboxSettings from "./components/advancedMailboxSettings";
import { querycustSelectClass } from '@/api/caseDetail'
export default {
  name: "staff_management_detail",
  data() {
    const that = this
    var setUserId = "";
    if (this.$route.params.title == 2) {
      setUserId = this.$route.query.userId;
    }
    return {
      domainList: [],
      gridApi: {},
      changeList: [],
      setUserId: setUserId,
      mailbox: {},
      settingState: false,
      partnerFieldIdList: [],
      postForm: {
        partnerFieldIds: '',
        deptId: "",
        sex: "1",
        isActive: "1",
        workgroups: [],
        agencyContacts: [],
        userRates: [{ roleId: undefined }],
        userChanges: [],
        jointime:''
      }, //上传数据
      addUserIconUrl: process.env.VUE_APP_BASE_API + addUserIcon, //图片上传路径
      postPicData: {
        userId: "",
        tokenID: getToken()
      }, //上传图片数据
      rules: {
        required: true
      },
      gridOptions:{
        onGridReady: function (params) {
          that.gridApi = params.api
          params.api.sizeColumnsToFit();
        },
        onCellEditingStarted(event) {
          if (typeof event.data.dataSource !== 'number') {
            event.data.dataSource = null
          }
          that.preValue = event.value
        },
        onCellEditingStopped: (event) => {
          if (that.preValue === event.value) {
            return;
          }
          if (this.changeList.findIndex(item => item.custId === event.data.custId) > -1) {
            this.changeList.splice(this.changeList.findIndex(item => item.custId === event.data.custId), 1, {...event.data, dataSource: event.data.dataSource || 2})
          } else {
            this.changeList.push({...event.data, dataSource: event.data.dataSource || 2})
          }
          event.api.refreshCells()
        },
      },
      frameworkComponents:{
        aGSelectMany:aGSelectMany
      },
      columnDefs:[
        {
          headerName: '客户',
          field: 'custId',
          resizable: true,
          sortable: true,
          editable: true,
          cellEditor:'aGSelectMany',
          filter: 'agSetColumnFilter',
          menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
          cellRenderer: this.cellRenderer,
          filterParams: {
            comparator: (a, b) => {
              return this.$commonUtils.sort(a,b)
            }
          }
        },
        { headerName: '备注',
          field:'memo',

          editable: true,
          resizable: true,
          sortable: true,
          filter: 'agSetColumnFilter',
          menuTabs: ['filterMenuTab','generalMenuTab','columnsMenuTab'],
          cellRenderer: this.cellRenderer,
          filterParams: {
             comparator: (a, b)=>{
              return this.$commonUtils.sort(a,b)
            }
          }}
      ],
      imageUrl: "", //当前图片路径
      queryPositionList: [], //员工职务列表
      queryCustNameList: [], //顾客列表
      queryWorkgroupNamesList: [], //工作组名列表
      queryDeptByConditionList: [], //所属部门列表
      queryRoleNamesList: [], //工作组角色列表
      changeTypeList: [
        {
          changeType: 1,
          value: "离职"
        },
        {
          changeType: 2,
          value: "转组"
        }
      ],
      dimissionTimeDisableState: true, //离职日期状态
      loading: false
    };
  },
  created() {
    this.postForm.jointime = this.$commonUtils.formatDate(new Date()); //初始化入职时间
    this.queryPosition();
    // this.queryCustName()
    this.queryWorkgroupNames();
    this.queryDeptByCondition();
    this.queryRoleNames();
    if (this.$route.params.title == 2) {
      this.queryUserById(this.$route.query.userId);
    }
    this.queryDomainList()
  },
  beforeRouteEnter: (to, from, next) => {
    if (to.params.title === "1") {
      document.title = getPageTitle((to.meta.title = "员工新增"));
      next(res => {});
    } else {
      document.title = getPageTitle((to.meta.title = "员工修改"));
      next(res => {});
    }
  },
  methods: {
    queryDomainList() {
      querycustSelectClass({ classId: '1177' }).then(response => {
        this.domainList = response.data['1177']
      });
    },
    cellRenderer(params){
      if(params.colDef.field=='custId'){
        return params.data.name
      }
      return  `<span title="${params.value}">${params.value?params.value:''}</span>`
    },
    getContextMenuItems(params){
      return [ {name:'复制',
        action: () =>{
          this.$copyText(params.value).then(
            res => {
            })
        }},
        {name:'删除',
          action:()=>{
            this.postForm.agencyContacts.splice(this.postForm.agencyContacts.indexOf(params.node.data),1)
            this.changeList.push({...params.node.data, dataSource: 3})
          }}]
    },
    CellValueChangedEvent(o,n){
      console.log(o, n);
    },
    //查询员工职务
    queryPosition() {
      queryPosition().then(res => {
        if (res.success) {
          this.queryPositionList = res.data;
        }
      });
    },
    //查询客户列表
    queryCustName(value) {
      if (!value) return;
      if (!this.loading) {
        this.loading = true;
        queryCustName({ name: value }).then(res => {
          if (res.success) {
            this.queryCustNameList = res.data;

            this.loading = false;
          }
        });
      }
    },
    //查询工作组列表
    queryWorkgroupNames() {
      queryWorkgroupNames().then(res => {
        if (res.success) {
          this.queryWorkgroupNamesList = res.data;
        }
      });
    },
    //所属部门列表
    queryDeptByCondition() {
      queryDeptByCondition().then(res => {
        if (res.success) {
          this.queryDeptByConditionList = res.data;
        }
      });
    },
    //工作组角色名列表
    queryRoleNames() {
      queryRoleNames().then(res => {
        if (res.success) {
          this.queryRoleNamesList = res.data;
        }
      });
    },
    // 根据Id查询信息组织页面数据
    queryUserById(userId) {
      queryUserById(userId).then(res => {
        this.mailbox = res.data.mailbox;
        let {
          userIcon,
          birthday,
          fullname,
          isActive,
          idcard,
          jointime,
          dimissionTime,
          email,
          wechat,
          lawyerNo,
          patentNo,
          sex,
          userId,
          deptId,
          phone,
          phhoneext,
          position,
          fullnameEn,
          username,
          partnerFieldIds,
          partnerFieldIdStr
        } = res.data.user;
        if (partnerFieldIds) {
          this.partnerFieldIdList = partnerFieldIds.split(',').map(item => Number(item))
        }
        let userInfo = {
          isActive: String(isActive),
          fullname,
          username,
          fullnameEn,
          sex: String(sex),
          IDCard: idcard,
          position,
          birthday,
          deptId,
          jointime,
          dimissionTime,
          phone,
          phhoneext,
          email,
          wechat,
          lawyerNo,
          patentNo,
          userId,
          partnerFieldIdList: this.partnerFieldIdList,
          partnerFieldIdStr
        };
        res.data.changes.forEach(item => {
          item.disabledState = true;
        });
        res.data.groups.forEach(item => {
          item.name = item.roleName;
          item.disabledState = true;
        });
        res.data.customer.forEach(item => {
          item.disabledState = true;
        });
        let userList = {
          userChanges: res.data.changes,
          userRates: res.data.rate.length === 0 ? [{}] : res.data.rate,
          workgroups: res.data.groups,
          agencyContacts: res.data.customer
        };
        this.imageUrl = "/ipdoc" + userIcon;
        this.$set(this, 'postForm', { ...userInfo, ...userList })
        // this.postForm = { ...userInfo, ...userList };
        this.queryCustNameList = this.postForm.agencyContacts;
      });
    },
    fileChange(file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    async submit() {
      await new Promise(res => {
        this.gridApi.stopEditing()
        setTimeout(() => res(), 300)
      })
      if (this.partnerFieldIdList.length) {
        this.postForm.partnerFieldIds = this.partnerFieldIdList.join(',')
      }
      if (this.postForm.birthday) {
        this.postForm.birthday = this.formatDate(this.postForm.birthday);
      }
      if (this.postForm.jointime) {
        this.postForm.jointime = this.formatDate(this.postForm.jointime);
      }
      if (this.postForm.isActive == 1) {
        //判斷是否在職
        this.postForm.dimissionTime = null;
      } else {
        this.postForm.dimissionTime = this.formatDate(
          this.postForm.dimissionTime
        );
      }
      if (this.$route.params.title == 1) {
        //新增员工
        if (this.mailbox.email) {
          this.postForm.mailbox = this.mailbox;
        }
        addUser({...this.postForm, agencyContacts: this.changeList}).then(res => {
          if (res.success) {
            this.postPicData.userId = res.data;
            this.$refs.upload.submit();
            this.$router.history.go(-1);
          }
        });
      } else {
        //修改员工
        this.postPicData.userId = this.$route.query.userId;
        this.$refs.upload.submit();
        this.postForm.userChanges.forEach(item => {
          item.changeDate = this.formatDate(item.changeDate);
        });
        updateUser({...this.postForm, agencyContacts: this.changeList}).then(res => {
          if (res.success) {
            this.$router.history.go(-1);
          }
        });
      }
    },
    cancel() {
      this.$router.history.go(-1);
    },
    //所属工作组监听变化
    sonWorkGroup(idx, e) {
      this.postForm.workgroups[
        idx
      ].wkgRoleId = this.queryWorkgroupNamesList.find(
        item => item.wkgId === e
      ).roleId;
      this.postForm.workgroups[idx].memo = this.queryWorkgroupNamesList.find(
        item => item.wkgId === e
      ).memo;
    },
    //控制保存修改切换
    handleChangeDisable(type, res) {
      switch (type) {
        case 1:
          this.postForm.workgroups[res].disabledState = !this.postForm
            .workgroups[res].disabledState;
          this.postForm.workgroups.push({});
          this.postForm.workgroups.pop();
          break;
        case 2:
          this.postForm.agencyContacts[res].disabledState = !this.postForm
            .agencyContacts[res].disabledState;
          this.postForm.agencyContacts.push({});
          this.postForm.agencyContacts.pop();
          break;
        case 3:
          this.postForm.userRates[res].disabledState = !this.postForm.userRates[
            res
          ].disabledState;
          this.postForm.userRates.push({});
          this.postForm.userRates.pop();
          break;
        case 4:
          this.postForm.userChanges[res].disabledState = !this.postForm
            .userChanges[res].disabledState;
          this.postForm.userChanges.push({});
          this.postForm.userChanges.pop();
          break;
      }
    },
    handleAddItem(type) {
      if (type === 1) {
        if (this.postForm.workgroups.length !== 0) {
          if (
            !this.postForm.workgroups[this.postForm.workgroups.length - 1]
              .disabledState
          ) {
            this.$alert("请先保存添加项", "提示信息", {
              confirmButtonText: "确定"
            });
            return;
          }
        }
        this.postForm.workgroups.push({
          memo: "",
          wkgId: "",
          wkgRoleId: ""
        });
      } else if (type === 2) {
        this.postForm.agencyContacts.unshift({memo:'', dataSource: 1});
      } else if (type === 4) {
        if (this.postForm.userChanges.length !== 0) {
          if (
            !this.postForm.userChanges[this.postForm.userChanges.length - 1]
              .disabledState
          ) {
            this.$alert("请先保存添加项", "提示信息", {
              confirmButtonText: "确定"
            });
            return;
          }
        }
        this.postForm.userChanges.push({
          changeType: "",
          changeDate: "",
          oldGroup: "",
          newGroup: ""
        });
        this.postForm.userChanges[
          this.postForm.userChanges.length - 1
        ].oldGroup = this.postForm.wkgId;
        this.postForm.userChanges[
          this.postForm.userChanges.length - 1
        ].changeDate = new Date();
      }
    },
    deleteDeptId(type, index) {
      if (type === 1) {
        this.postForm.workgroups.splice(index, 1);
      } else if (type === 2) {
        this.postForm.agencyContacts.splice(index, 1);
      } else if (type === 3) {
        this.postForm.userRates[0].rate = null;
        this.postForm.userRates[0].memo = null;
      } else if (type === 4) {
        this.postForm.userChanges.splice(index, 1);
      }
    },
    beforeAvatarUpload(file) {
      const isJPGOrisPNG =
        file.type === "image/jpeg" || file.type === "image/png";
      const isLt200K = file.size / 1024 / 1024 / 1024 < 200;
      if (!isJPGOrisPNG) {
        this.$message.error("上传头像图片只能是 JPG 格式或者PNG");
      }
      if (!isLt200K) {
        this.$message.error("上传头像图片大小不能超过 200K!");
      }
      return isJPGOrisPNG && isLt200K;
    },
    async myRules() {
      // var reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
      if (!this.postForm.fullname) {
        this.$message.error("请填写姓名");
        return;
      }
      if (!this.postForm.position) {
        this.$message.error("请选择职务");
        return;
      }
      if (!this.postForm.deptId) {
        this.$message.error("请选择所属部门");
        return;
      }
      if (!this.postForm.jointime) {
        this.$message.error("请选择入职时期");
        return;
      }
      if (!this.postForm.email) {
        this.$message.error("请填写邮箱");
        return;
      }
      if (
        this.postForm.workgroups.length === 0 ||
        !this.postForm.workgroups[0].wkgId
      ) {
        this.$message.error("请至少选择一个工作组");
        return;
      }
      // if (
      //   this.postForm.agencyContacts.length === 0 ||
      //   !this.postForm.agencyContacts[0].custId
      // ) {
      //   this.$message.error("请至少选择一个客户");
      //   return;
      // }
      this.submit();
    },
    settingChange(data) {
      this.settingState = data;
    },
    updateMailbox(data) {
      this.mailbox = data;
    },
    formatDate(time) {
      return this.$commonUtils.formatDate(time)
    }
  },
  watch: {
    "postForm.isActive": {
      handler(n, o) {
        if (n == 1) {
          this.dimissionTimeDisableState = true;
          // 如果从离职状态变更为在职状态，移除姓名后的"(已离职)"标识
          if (o == 0 && this.postForm.fullname && this.postForm.fullname.includes('(已离职)')) {
            this.postForm.fullname = this.postForm.fullname.replace('(已离职)', '');
          }
        } else {
          this.dimissionTimeDisableState = false;
          // 如果变更为离职状态，在姓名后添加"(已离职)"标识
          if (this.postForm.fullname && !this.postForm.fullname.includes('(已离职)')) {
            this.postForm.fullname = this.postForm.fullname + '(已离职)';
          }
        }
      },
      immediate: true
    }
  },
  components: {
    advancedMailboxSettings
  }
};
</script>

<style lang="scss" scoped>
.avatar-uploader {
  width: 135px;
  height: 150px;
  border: 1px solid #777;
  margin: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  height: 100%;
  width: 100%;
  text-align: center;
}
.avatar {
  width: 100%;
}
.upLoadButton {
  position: absolute;
  right: -119px;
  bottom: 10px;
}
.uploadWrap {
  display: flex;
}
.tips {
  font-size: 12px;
  font-family: SourceHanSansCN-Normal;
  padding-top: 22px;
  margin-left: 10px;
  font-weight: 400;
  p {
    text-align: left;
  }
}
.postInfo-container-item {
  position: relative;
}
.postInfo-container-item {
  margin-bottom: 0;
}
.staff_mangement_detail {
}
.staff_mangement_detail .title {
  height: 39px;
  border-bottom: 1px solid rgba(232, 235, 237, 1);
  font-size: 18px;
  font-family: SourceHanSansCN-Normal;
  font-weight: 400;
  color: rgba(38, 42, 47, 1);
  line-height: 39px;
  text-indent: 21px;
}
.input_wrap {
  display: flex;
}

.staff_table {
  /deep/ .el-form-item__label{
    padding-right: 0;
  }
  .el-input,
  .el-select {
    width: 330px;
    padding: 0px 5px;
    /deep/ .el-input--suffix{
      padding: 0;
    }
  }

  border: 1px solid #ebeef5;
  border-collapse: collapse;
  td {
    border: 1px solid #ebeef5;
  }
  tr td:nth-child(1),
  tr td:nth-child(3) {
    background: #f5f7fa;
  }
  table {
    tr th {
      background: #f5f7fa;
    }
    tr td:nth-child(1),
    tr td:nth-child(3) {
      background: #fff;
    }
  }
}
.staff_table .postInfo-container-item /deep/ div {
  display: none;
}
.staff_mangement_detail_table /deep/{
  .cell{
    padding-left: 0;
  }

  th.is-leaf{
    border: 0;
  }
}
.staff_mangement_detail_table /deep/ .el-table__empty-block {
  display: none;
}
.staff_mangement_detail_table:before{
  display: none;
}
.floatRight {
  float: right;
  margin-bottom: 10px;
}
.width332 {
  width: 332px;
  text-align: center;
}
.width68 {
  width: 68px;
  text-align: center;
}
.button_wrap {
  display: flex;
  justify-content: center;
}
.button_wrap .exactButton {
  width: 169px;
  height: 47px;
  margin: 20px;
}
.width100 {
  width: 100px;
  text-align: center;
}
.setHeight {
  margin-left: 20px;
  cursor: pointer;
  font-size: 14px;
  color: #409eff;
  font-weight: normal;
  line-height: 40px;
}
.table-el-form{
  position: relative;
  top: -12px;
  width: 1069px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  .el-row{
    // min-height: 20px;
    width: 100%;
    display: flex;
    line-height: 30px;
    .el-form-item{
      width: 100%;
      display: flex;
      border: 1px solid #EBEEF5;
      border-bottom: 0;
      margin-bottom: 0;
      .el-input,
      .el-select {
        width: 100%;
        padding: 0px 5px;
      }
      /deep/ .el-form-item__label{
        background: #f5f7fa;
        line-height: 30px;
      }
      /deep/ .el-form-item__content{
        line-height: 30px;
        margin-left: 0 !important;
        padding: 6px;
        background: #fff;
        flex: 1;
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
  .el-row:nth-last-child(1){
    .el-form-item{
      border: 1px solid #EBEEF5;
    }
  }
}
</style>
