<template>
  <div>
    <div class="talents-container"  @getValue="getValue">
      <el-form label-width="160px"
               size="small"
               class="form-container"
               :model="caseDetailFormData" :rules="rules">
        <div>
          <!--基本信息-->
          <el-row>
            <el-col class="tilteSpan" :span="21">
              <span id="info-title" class="header-info">基本信息</span>
            </el-col>
          </el-row>
          <el-row class="border-top">
            <el-col :span="8">
              <el-form-item label="员工姓名:">
                {{ postForm.talentName }}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="出生日期:">
                <el-date-picker
                  v-model="postForm.birthday"
                  :disabled="$store.getters.talentPoolPermission.permissions.includes(11) ? false : true"
                  @change="getAge"
                  type="date"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="年龄:">
                {{ age }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="部门:">
                {{ postForm.mainDeptName }}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="入职时间:">
                <el-date-picker
                  v-model="postForm.joinDate"
                  :disabled="$store.getters.talentPoolPermission.permissions.includes(11) ? false : true"
                  type="date"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="性别:">
                <el-select
                  v-model="postForm.gender"
                  :disabled="$store.getters.talentPoolPermission.permissions.includes(11) ? false : true"
                  placeholder="请选择"
                  default-first-option
                  filterable
                  clearable>
                  <el-option v-for="item in querySex" :key="item.type" :label="item.name" :value="item.type"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="工作组:">
                {{ postForm.mainWorkGroup }}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="转正日期:">
                <el-date-picker
                  v-model="postForm.regularDate"
                  :disabled="$store.getters.talentPoolPermission.permissions.includes(11) ? false : true"
                  type="date"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="序号:">
                {{ postForm.talentCode }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="岗位名称:">
                {{ postForm.mainPosName }}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="合同到期时间:">
                <el-date-picker
                  v-model="postForm.expirationDate"
                  :disabled="$store.getters.talentPoolPermission.permissions.includes(11) ? false : true"
                  type="date"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="是否在职:">
                <el-select
                  v-model="postForm.empStatus"
                  :disabled="$store.getters.talentPoolPermission.permissions.includes(11) ? false : true"
                  placeholder="请选择"
                  default-first-option
                  filterable
                  clearable>
                  <el-option v-for="item in queryStatus" :key="item.type" :label="item.name" :value="item.type"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <el-form>
        <div v-if="$store.getters.talentPoolPermission.permissions.includes(12)">
          <el-row>
            <el-col class="tilteSpan" :span="22">
              <span id='school-title' class="header-info">毕业院校及专业</span>
            </el-col>
            <el-col :span="2">
              <el-button type="primary" class="floatRight" @click="handleAddItem('eduExperiences')">添加</el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-col class="header" :span="24">
              <el-form-item style="border-top:0;">
                <el-table
                  :data="postForm.eduExperiences"
                  border
                  style="width: 100%;">
                  <el-table-column
                    prop="collegeName"
                    label="院校名称"
                    :row-class-name="success-row"
                  >
                    <template slot-scope="scope">
                      <el-input
                        v-model="postForm.eduExperiences[scope.$index].collegeName"
                        :disabled="scope.row.disabledState"
                        placeholder="请输入院校名称"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="major"
                    label="专业"
                  >
                    <template slot-scope="scope">
                      <el-input
                        v-model="postForm.eduExperiences[scope.$index].major"
                        :disabled="scope.row.disabledState"
                        placeholder="请填写专业"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="collegeType"
                    label="学历"
                  >
                    <template slot-scope="scope">
                      <el-select
                        v-model="postForm.eduExperiences[scope.$index].collegeType"
                        :disabled="scope.row.disabledState"
                        placeholder="请选择学历或填写"
                        default-first-option
                        allow-create
                        filterable
                        clearable
                      >
                        <el-option v-for="item in queryDegreeList" :key="item.name" :label="item.name" :value="item.name">
                        </el-option>
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="flag"
                    label="数据状态"
                  >
                    <template slot-scope="scope">
                      <div v-html="stateFormat(postForm.eduExperiences[scope.$index].flag)"></div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="operate"
                    label="操作"
                  >
                    <template slot-scope="scope">
                      <el-button type="text" size="smail" @click="handleChangeDisable('eduExperiences',scope.$index)">{{scope.row.disabledState?'修改':'保存'}}</el-button>
                      <el-button type="text" v-if="$store.getters.talentPoolPermission.permissions.includes(3) === true" size="smail" @click="deleteDeptId('eduExperiences',scope.$index)">删除</el-button>
                      <el-button type="success" round v-if="$store.getters.talentPoolPermission.permissions.includes(3) === true && postForm.eduExperiences[scope.$index].flagStatus === 0 && postForm.eduExperiences[scope.$index].hasOwnProperty('eduId') === true" @click="auditPass('eduExperiences',scope.$index,1)">通过</el-button>
                      <el-button round v-if="$store.getters.talentPoolPermission.permissions.includes(3) === true && postForm.eduExperiences[scope.$index].flagStatus === 0 && postForm.eduExperiences[scope.$index].hasOwnProperty('eduId') === true" @click="auditPass('eduExperiences',scope.$index,-1)">退回</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div v-if="$store.getters.talentPoolPermission.permissions.includes(13)">
          <el-row>
            <el-col class="tilteSpan" :span="22">
              <span id="cert-title" class="header-info">专业资格证书</span>
            </el-col>
            <el-col :span="2">
              <el-button type="primary" class="floatRight" @click="handleAddItem('personCertificates')">添加</el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-col class="header" :span="24">
              <el-form-item style="border-top:0">
                <el-table
                  :data="postForm.personCertificates"
                  border
                  style="width: 100%">
                  <el-table-column
                    prop="certificateName"
                    label="证书名称"
                  >
                    <template slot-scope="scope">
                      <el-select
                        v-model="postForm.personCertificates[scope.$index].certificateName"
                        :disabled="scope.row.disabledState"
                        placeholder="请选择证书或填写"
                        default-first-option
                        allow-create
                        filterable
                        clearable
                      >
                        <el-option v-for="item in queryCertList" :key="item.name" :label="item.name" :value="item.name">
                        </el-option>
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="acquireDate"
                    label="获取时间"
                  >
                    <template slot-scope="scope">
                      <el-date-picker v-model="postForm.personCertificates[scope.$index].acquireDate" :disabled="scope.row.disabledState" type="date" value-format="yyyy-MM-dd" placeholder="选择日期">
                      </el-date-picker>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="certificatePath"
                    label="上传附件"
                  >
                    <template slot-scope="scope">
                      <div v-if="postForm.personCertificates[scope.$index].certificatePath">
                        {{ postForm.personCertificates[scope.$index].certificateName }}
                        <el-button type="text" class="el-icon-view" style="line-height:0" @click="preView(postForm.personCertificates[scope.$index].certificatePath)" ></el-button>
                      </div>
                      <div v-else>
                        <el-upload
                          class="upload-demo"
                          name="attachFile"
                          :data="uploadCertificateData"
                          :action="uploadCertificateMaterial"
                          multiple
                          :limit="1"
                          :before-upload="(file) => { return beforeuploadCertificate(file,scope.$index)}"
                          :file-list="fileList"
                          :on-success="(value)=> handleSuccess(scope.$index, value)"
                          :disabled="scope.row.disabledState">
                          <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="flag"
                    label="数据状态"
                  >
                    <template slot-scope="scope">
                      <div v-html="stateFormat(postForm.personCertificates[scope.$index].flag)"></div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="operate"
                    label="操作"
                  >
                    <template slot-scope="scope">
                      <el-button type="text" size="smail" @click="handleChangeDisable('personCertificates',scope.$index)">{{scope.row.disabledState?'修改':'保存'}}</el-button>
                      <el-button type="text" v-if="$store.getters.talentPoolPermission.permissions.includes(3) === true" size="smail" @click="deleteDeptId('personCertificates',scope.$index)">删除</el-button>
                      <el-button type="success" round v-if="$store.getters.talentPoolPermission.permissions.includes(3) === true && postForm.personCertificates[scope.$index].flagStatus === 0 && postForm.personCertificates[scope.$index].hasOwnProperty('certId') === true" @click="auditPass('personCertificates',scope.$index,1)">通过</el-button>
                      <el-button round v-if="$store.getters.talentPoolPermission.permissions.includes(3) === true && postForm.personCertificates[scope.$index].flagStatus === 0 && postForm.personCertificates[scope.$index].hasOwnProperty('certId') === true" @click="auditPass('personCertificates',scope.$index,-1)">退回</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form-item>
            </el-col>
        </el-row>
        </div>
        <div v-if="$store.getters.talentPoolPermission.permissions.includes(14)">
          <el-row>
            <el-col class="tilteSpan" :span="22">
              <span id='wsk-title' class="header-info">外语水平</span>
            </el-col>
            <el-col :span="2">
              <el-button type="primary" class="floatRight" @click="handleAddItem('personLanguages')">添加</el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-col class="header" :span="24">
              <el-form-item style="border-top:0;">
                <el-table
                  :data="postForm.personLanguages"
                  border
                  style="width: 100%;">
                  <el-table-column
                    prop="language"
                    label="外语语种"
                  >
                    <template slot-scope="scope">
                      <el-select
                        v-model="postForm.personLanguages[scope.$index].language"
                        :disabled="scope.row.disabledState"
                        placeholder="请选择语种或填写"
                        default-first-option
                        allow-create
                        filterable
                        clearable
                      >
                        <el-option v-for="item in querypersonLanguages" :key="item.name" :label="item.name" :value="item.name">
                        </el-option>
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="languageDegree"
                    label="外语等级"
                  >
                    <template slot-scope="scope">
                      <el-select
                        v-model="postForm.personLanguages[scope.$index].languageDegree"
                        :disabled="scope.row.disabledState"
                        placeholder="请选择外语等级或填写"
                        default-first-option
                        allow-create
                        filterable
                        clearable
                      >
                        <el-option v-for="item in querypersonLanguageDegree" :key="item.name" :label="item.name" :value="item.name">
                        </el-option>
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="flag"
                    label="数据状态"
                  >
                    <template slot-scope="scope">
                      <div v-html="stateFormat(postForm.personLanguages[scope.$index].flag)"></div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="operate"
                    label="操作"
                  >
                    <template slot-scope="scope">
                      <el-button type="text" size="smail" @click="handleChangeDisable('personLanguages',scope.$index)">{{scope.row.disabledState?'修改':'保存'}}</el-button>
                      <el-button type="text" v-if="$store.getters.talentPoolPermission.permissions.includes(3) === true" size="smail" @click="deleteDeptId('personLanguages',scope.$index)">删除</el-button>
                      <el-button type="success" round v-if="$store.getters.talentPoolPermission.permissions.includes(3) === true && postForm.personLanguages[scope.$index].flagStatus === 0 && postForm.personLanguages[scope.$index].hasOwnProperty('langId') === true" @click="auditPass('personLanguages',scope.$index,1)">通过</el-button>
                      <el-button round v-if="$store.getters.talentPoolPermission.permissions.includes(3) === true && postForm.personLanguages[scope.$index].flagStatus === 0 && postForm.personLanguages[scope.$index].hasOwnProperty('langId') === true" @click="auditPass('personLanguages',scope.$index,-1)">退回</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div v-if="$store.getters.talentPoolPermission.permissions.includes(15)">
          <el-row>
            <el-col class="tilteSpan" :span="22">
              <span id='personDepartments-title' class="header-info">任职组织</span>
            </el-col>
            <el-col :span="2">
              <el-button type="primary" class="floatRight" @click="handleAddItem('personDepartments')">添加</el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-col class="header" :span="24">
              <el-form-item style="border-top:0;">
                <el-table
                  :data="postForm.personDepartments"
                  border
                  style="width: 100%;">
                  <el-table-column
                    prop="deptCode"
                    label="部门"
                  >
                    <template slot-scope="scope">
                      <el-cascader
                        ref="myCascader"
                        :options="queryDepartmentAllList"
                        :show-all-levels="false"
                        :props="{value : 'deptCode', label: 'wkGroupName', children: 'children'}"
                        style="width: 100%"
                        change-on-select
                        @change="(val)=>handleDepartmentChange(val, scope.$index)"
                        v-model="postForm.personDepartments[scope.$index].deptCodeArr"
                        :disabled="scope.row.disabledState"
                      ></el-cascader>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="posName"
                    label="岗位名称"
                  >
                    <template slot-scope="scope">
                      <el-select  default-first-option v-model="postForm.personDepartments[scope.$index].posId" :disabled="scope.row.disabledState" @change="(val)=>handlePositionChange(val, scope.$index)" clearable filterable placeholder="请选择">
                        <el-option
                          v-for="item in queryPositionList"
                          :key="item.posId"
                          :label="item.posName"
                          :value="item.posId"
                        >
                        </el-option>
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="sortNum"
                    label="任职类型"
                  >
                    <template slot-scope="scope">
                      <el-select  default-first-option v-model="postForm.personDepartments[scope.$index].sortNum" :disabled="scope.row.disabledState" clearable filterable placeholder="请选择">
                        <el-option
                          v-for="item in querypersonDepartmentsType"
                          :key="item.type"
                          :label="item.name"
                          :value="item.type"
                        >
                        </el-option>
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="operate"
                    label="操作"
                  >
                    <template slot-scope="scope">
                      <el-button type="text" size="smail" @click="handleChangeDisable('personDepartments',scope.$index)">{{scope.row.disabledState?'修改':'保存'}}</el-button>
                      <el-button type="text" size="smail" @click="deleteDeptId('personDepartments',scope.$index)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div v-if="$store.getters.talentPoolPermission.permissions.includes(16)">
          <el-row>
            <el-col class="tilteSpan" :span="22">
              <span id='personEvaluates-title' class="header-info">试用期考评</span>
            </el-col>
            <el-col :span="2">
              <el-button type="primary" class="floatRight" @click="personEvaluatesDialogVisible=true">上传</el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-col class="header" :span="24">
              <el-form-item style="border-top:0;">
                <el-table
                  :data="postForm.personEvaluates"
                  border
                  style="width: 100%;">
                  <el-table-column
                    prop="evaluateMaterialType"
                    label="文件类型"
                  >
                    <template slot-scope="scope">
                      {{ postForm.personEvaluates[scope.$index].evaluateMaterialType }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="evaluateMaterialName"
                    label="文件名称"
                  >
                    <template slot-scope="scope">
                      {{ postForm.personEvaluates[scope.$index].evaluateMaterialName }}
                      <el-button type="text" class="el-icon-view" style="line-height:0" @click="preView(postForm.personEvaluates[scope.$index].evaluateMaterialPath)" ></el-button>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="evaluateDate"
                    label="上传时间"
                  >
                    <template slot-scope="scope">
                      {{ postForm.personEvaluates[scope.$index].evaluateDate }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="operate"
                    label="操作"
                  >
                    <template slot-scope="scope">
                      <el-button type="text" size="smail" @click="downLoad(postForm.personEvaluates[scope.$index].evaluateMaterialPath)">下载</el-button>
                      <el-button type="text" size="smail" @click="deleteMaterial(scope.$index, postForm.personEvaluates[scope.$index].evalId,2)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div v-if="$store.getters.talentPoolPermission.permissions.includes(17)">
          <el-row>
            <el-col class="tilteSpan" :span="22">
              <span id="reward-title" class="header-info">奖惩记录</span>
            </el-col>
            <el-col :span="2">
              <el-button type="primary" class="floatRight" @click="handleAddItem('personRewards')">添加</el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-col class="header" :span="24">
              <el-form-item style="border-top:0">
                <el-table
                  :data="postForm.personRewards"
                  border
                  style="width: 100%">
                  <el-table-column
                    prop="rewardDate"
                    label="日期"
                  >
                    <template slot-scope="scope">
                      <el-date-picker v-model="postForm.personRewards[scope.$index].rewardDate" :disabled="scope.row.disabledState" type="date" value-format="yyyy-MM-dd" placeholder="选择日期">
                      </el-date-picker>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="rewardType"
                    label="奖惩状态"
                  >
                    <template slot-scope="scope">
                      <el-select
                        v-model="postForm.personRewards[scope.$index].rewardType"
                        :disabled="scope.row.disabledState"
                        placeholder="请选择奖惩状态"
                        default-first-option
                        filterable
                        clearable
                      >
                        <el-option v-for="item in queryRewardTypeList" :key="item.name" :label="item.name" :value="item.name">
                        </el-option>
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="rewardContent"
                    label="备注"
                  >
                    <template slot-scope="scope">
                      <el-input type="textarea" v-model="postForm.personRewards[scope.$index].rewardContent" :disabled="scope.row.disabledState"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="operate"
                    label="操作"
                  >
                    <template slot-scope="scope">
                      <el-button type="text" size="smail" @click="handleChangeDisable('personRewards',scope.$index)">{{scope.row.disabledState?'修改':'保存'}}</el-button>
                      <el-button type="text" size="smail" @click="deleteDeptId('personRewards',scope.$index)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div v-if="$store.getters.talentPoolPermission.permissions.includes(18)">
          <el-row>
          <el-col class="tilteSpan" :span="22">
            <span id="promotion-title" class="header-info">晋升调整</span>
          </el-col>
          <el-col :span="2">
            <el-button type="primary" class="floatRight" @click="handleAddItem('personPromotes')">添加</el-button>
          </el-col>
          </el-row>
          <el-row>
            <el-col class="header" :span="24">
              <el-form-item style="border-top:0">
                <el-table
                  :data="postForm.personPromotes"
                  border
                  style="width: 100%">
                  <el-table-column
                    prop="adjustDate"
                    label="调整时间"
                  >
                    <template slot-scope="scope">
                      <el-date-picker v-model="postForm.personPromotes[scope.$index].adjustDate" :disabled="scope.row.disabledState" type="date" value-format="yyyy-MM-dd" placeholder="选择日期">
                      </el-date-picker>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="oldPosId"
                    label="原岗位"
                  >
                    <template slot-scope="scope">
                      <el-select
                        v-model="postForm.personPromotes[scope.$index].oldPosId"
                        :disabled="scope.row.disabledState"
                        placeholder="请选择原岗位"
                        default-first-option
                        filterable
                        clearable
                      >
                        <el-option v-for="item in queryPositionList" :key="item.posId" :label="item.posName" :value="item.posId">
                        </el-option>
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="newPosId"
                    label="新岗位"
                  >
                    <template slot-scope="scope">
                      <el-select
                        v-model="postForm.personPromotes[scope.$index].newPosId"
                        :disabled="scope.row.disabledState"
                        placeholder="请选择新岗位"
                        default-first-option
                        filterable
                        clearable
                      >
                        <el-option v-for="item in queryPositionList" :key="item.posId" :label="item.posName" :value="item.posId">
                        </el-option>
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="operate"
                    label="操作"
                  >
                    <template slot-scope="scope">
                      <el-button type="text" size="smail" @click="handleChangeDisable('personPromotes',scope.$index)">{{scope.row.disabledState?'修改':'保存'}}</el-button>
                      <el-button type="text" size="smail" @click="deleteDeptId('personPromotes',scope.$index)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div v-if="$store.getters.talentPoolPermission.permissions.includes(19)">
          <el-row>
            <el-col class="tilteSpan" :span="22">
              <span id="personPayments-title" class="header-info">薪酬情况</span>
            </el-col>
            <el-col :span="2">
              <el-button type="primary" class="floatRight" @click="handleAddItem('personPayments')">添加</el-button>
            </el-col>
          </el-row>
          <el-row>
          <el-col class="header" :span="24">
            <el-form-item style="border-top:0">
              <el-table
                :data="postForm.personPayments"
                border
                style="width: 100%">
                <el-table-column
                  prop="payYear"
                  label="年份"
                >
                  <template slot-scope="scope">
                    <el-date-picker type="year" v-model="postForm.personPayments[scope.$index].payYear" value-format="yyyy"  :disabled="scope.row.disabledState" placeholder="选择年份">
                    </el-date-picker>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="salary"
                  label="基本月薪"
                >
                  <template slot-scope="scope">
                    <el-input v-model="postForm.personPayments[scope.$index].salary" :disabled="scope.row.disabledState"></el-input>元
                  </template>
                </el-table-column>
                <el-table-column
                  prop="bonus"
                  label="年度奖金"
                >
                  <template slot-scope="scope">
                    <el-input v-model="postForm.personPayments[scope.$index].bonus" :disabled="scope.row.disabledState"></el-input>元
                  </template>
                </el-table-column>
                <el-table-column
                  prop="adjustDate"
                  label="调整时间"
                >
                  <template slot-scope="scope">
                    <el-date-picker v-model="postForm.personPayments[scope.$index].adjustDate" :disabled="scope.row.disabledState" type="date" value-format="yyyy-MM-dd" placeholder="选择日期">
                    </el-date-picker>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="adjustSalary"
                  label="调整后月薪"
                >
                  <template slot-scope="scope">
                    <el-input v-model="postForm.personPayments[scope.$index].adjustSalary" :disabled="scope.row.disabledState"></el-input>元
                  </template>
                </el-table-column>
                <el-table-column
                  prop="operate"
                  label="操作"
                >
                  <template slot-scope="scope">
                    <el-button type="text" size="smail" @click="handleChangeDisable('personPayments',scope.$index)">{{scope.row.disabledState?'修改':'保存'}}</el-button>
                    <el-button type="text" size="smail" @click="deleteDeptId('personPayments',scope.$index)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-col>
        </el-row>
        </div>
        <div v-if="$store.getters.talentPoolPermission.permissions.includes(20)">
          <el-row>
          <el-col class="tilteSpan" :span="22">
            <span id="personTrains-title" class="header-info">培训</span>
          </el-col>
          <el-col :span="2">
            <el-button type="primary" class="floatRight" @click="handleAddItem('personTrains')">添加</el-button>
          </el-col>
          </el-row>
          <el-row>
            <el-col class="header" :span="24">
              <el-form-item style="border-top:0">
                <el-table
                  :data="postForm.personTrains"
                  border
                  style="width: 100%">
                  <el-table-column
                    prop="trainDate"
                    label="日期"
                  >
                    <template slot-scope="scope">
                      <el-date-picker v-model="postForm.personTrains[scope.$index].trainDate" :disabled="scope.row.disabledState" type="date" value-format="yyyy-MM-dd" placeholder="选择日期">
                      </el-date-picker>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="duration"
                    label="时长"
                  >
                      <template slot-scope="scope">
                        <el-input v-model="postForm.personTrains[scope.$index].duration" :disabled="scope.row.disabledState"></el-input>时
                      </template>
                  </el-table-column>
                  <el-table-column
                    prop="cost"
                    label="费用(如有)"
                  >
                    <template slot-scope="scope">
                      <el-input v-model="postForm.personTrains[scope.$index].expense" :disabled="scope.row.disabledState"></el-input>元
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="title"
                    label="会议主题"
                  >
                    <template slot-scope="scope">
                      <el-input v-model="postForm.personTrains[scope.$index].trainTitle" :disabled="scope.row.disabledState"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="content"
                    label="培训内容"
                  >
                    <template slot-scope="scope">
                        <el-input type="textarea" v-model="postForm.personTrains[scope.$index].trainContent" :disabled="scope.row.disabledState"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="flag"
                    label="数据状态"
                  >
                    <template slot-scope="scope">
                      <div v-html="stateFormat(postForm.personTrains[scope.$index].flag)"></div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="operate"
                    label="操作"
                  >
                    <template slot-scope="scope">
                      <el-button type="text" size="smail" @click="handleChangeDisable('personTrains',scope.$index)">{{scope.row.disabledState?'修改':'保存'}}</el-button>
                      <el-button type="text" v-if="$store.getters.talentPoolPermission.permissions.includes(3) === true" size="smail" @click="deleteDeptId('personTrains',scope.$index)">删除</el-button>
                      <el-button type="text" size="smail" v-if="$store.getters.talentPoolPermission.permissions.includes(3) === true && postForm.personTrains[scope.$index].flagStatus === 0 && postForm.personTrains[scope.$index].hasOwnProperty('trainId') === true" @click="auditPass('personTrains',scope.$index,1)">通过</el-button>
                      <el-button type="text" size="smail" v-if="$store.getters.talentPoolPermission.permissions.includes(3) === true && postForm.personTrains[scope.$index].flagStatus === 0 && postForm.personTrains[scope.$index].hasOwnProperty('trainId') === true" @click="auditPass('personTrains',scope.$index,-1)">退回</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div v-if="$store.getters.talentPoolPermission.permissions.includes(21)">
          <el-row>
            <el-col class="tilteSpan" :span="22">
              <span id="personMaterials-title" class="header-info">附件资料上传</span>
            </el-col>
            <el-col :span="2">
              <el-button type="primary" class="floatRight" @click="dialogVisible=true">上传</el-button>
            </el-col>
          </el-row>
          <el-row class="border-top">
          <el-col class="header" :span="24">
            <el-form-item style="border-top:0">
              <el-table
                :data="postForm.personMaterials"
                border
                style="width: 100%">
                <el-table-column
                  prop="materialType"
                  label="文件类型"
                >
                  <template slot-scope="scope">
                    <div v-for="item in materialTypeList">
                      <div v-if="item.materialTypeId == postForm.personMaterials[scope.$index].materialType">
                        {{item.typeName}}
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="materialName"
                  label="文件名称"
                >
                  <template slot-scope="scope">
                    {{ postForm.personMaterials[scope.$index].materialName }}
                    <el-button type="text" class="el-icon-view" style="line-height:0" @click="preView(postForm.personMaterials[scope.$index].materialPath)" ></el-button>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="createUserName"
                  label="上传人"
                >
                  <template slot-scope="scope">
                    {{ postForm.personMaterials[scope.$index].createUserName }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="createDate"
                  label="上传时间"
                >
                  <template slot-scope="scope">
                    {{ postForm.personMaterials[scope.$index].createDate }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="operate"
                  label="操作"
                >
                  <template slot-scope="scope">
                    <el-button type="text" size="smail" @click="downLoad(postForm.personMaterials[scope.$index].materialPath)">下载</el-button>
                    <el-button type="text" size="smail" @click="deleteMaterial(scope.$index, postForm.personMaterials[scope.$index].materialId,1)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-col>
        </el-row>
        </div>
        <el-row>
          <el-col class="form-con-item clearfix" :span="2">
            <div style="height: 520px;position: fixed;top:20%;right:2%">
              <el-steps :space="200" :active="stepActive1" direction="vertical">
                <el-step v-for="(item,index) in elstepList" :title="item.title"
                         @click.native="getTopPosition(item.id,index)" v-if="item.state"></el-step>
              </el-steps>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="button_wrap">
      <el-button class="exactButton" type="primary" @click="myRules">确定</el-button>
      <el-button class="exactButton" plain @click="cancel">取消</el-button>
    </div>

    <el-dialog title="试用期考评上传" :visible.sync="personEvaluatesDialogVisible" width="70%">
      <UploadEvaluateMaterial
        v-if="personEvaluatesDialogVisible"
        :talentCode="talentCode"
        @updateInfo="updateAttachmentData">
      </UploadEvaluateMaterial>
    </el-dialog>

    <el-dialog title="附件资料上传" :visible.sync="dialogVisible" width="70%" :before-close="handleClose">
      <UploadMetailDetail
        v-if="dialogVisible"
        :talentCode="talentCode"
        @updateInfo="updateAttachmentData">
      </UploadMetailDetail>
    </el-dialog>

  </div>
</template>

<script>
import UploadMetailDetail from "./UploadMetailDetail";
import UploadEvaluateMaterial from "./UploadEvaluateMaterial";
import { queryTalentPersonInfo, queryPositionAll, queryDepartmentAll, delectTalentMaterial, upsertTalentPersonInfo, deleteEvaluateMaterial } from '@/api/hrmList'
import { uploadCertificateMaterial } from "@/api/ipServiceApi.config.js";
export default {
  name: 'GrowthArchives',
  components: {
    UploadMetailDetail,
    UploadEvaluateMaterial
  },

  data() {
    return {
      talentCode: 0,
      // 模拟数据
      postForm: {
        personEvaluates: [],
        eduExperiences: [],
        personLanguages: [],
        personCertificates: [],
        personRewards: [],
        personPromotes: [],
        personPayments: [],
        personTrains: [],
        personMaterials: [],
        personDepartments: [],
      },
      uploadCertificateMaterial,
      uploadCertificateData: {
        tokenID: this.$store.getters.token
      },
      queryDepartmentAllList: [],
      queryForm: {
        personEvaluates: {},
        eduExperiences: {
          collegeType: '',
          collegeName: '',
          major: '',
          flag: 0
        },
        personLanguages: {
          language: '',
          languageDegree: '',
          flag: 0
        },
        personCertificates: {
          certificateName: '',
          acquireDate: '',
          flag: 0
        },
        personRewards: {
          rewardDate: '',
          rewardType: '',
          rewardContent: ''
        },
        personPromotes: {
          oldPosId: '',
          newPosId: ''
        },
        personPayments: {
          payYear: '',
          salary: '',
          bonus: '',
          adjustSalary: '',
          adjustDate: ''
        },
        personTrains: {
          trainTitle: '',
          trainContent: '',
          duration: '',
          expense: '',
          trainDate: '',
          flag: 0
        },
        personDepartments: {
          deptCode: '',
          posId: '',
          posName: '',
          sortNum: 0
        }
      },
      elstepList: [],
      stepActive1: 0,
      age: 0, // 年龄
      dialogVisible: false,
      personEvaluatesDialogVisible: false,
      caseDetailFormData: {},
      queryStatus: [
        {
          type: 0,
          name: '离职员工'
        },
        {
          type: 1,
          name: '正式员工'
        },
        {
          type: 2,
          name: '实习员工'
        },
        {
          type: 3,
          name: '兼职人员'
        },
        {
          type: 4,
          name: '试用员工'
        },
        {
          type: 5,
          name: '退休返聘'
        }
      ],
      querySex: [
        {
          type: 1,
          name: '男'
        },
        {
          type: 2,
          name: '女'
        }
      ],
      materialTypeList: [
        {
          "materialTypeId": '1',
          "typeName": "简历"
        },
        {
          "materialTypeId": '2',
          "typeName": "劳动合同"
        },
        {
          "materialTypeId": '3',
          "typeName": "保密协议"
        },
        {
          "materialTypeId": '4',
          "typeName": "入职登记表"
        },
        {
          "materialTypeId": '5',
          "typeName": "岗位说明书"
        },
        {
          "materialTypeId": '6',
          "typeName": "合规准则签署书"
        },
        {
          "materialTypeId": '7',
          "typeName": "公司制度签收单"
        },
        {
          "materialTypeId": '8',
          "typeName": "其他"
        }
      ],
      querypersonLanguages: [
        {
          name: '英语',
        },
        {
          name: '日语',
        },
        {
          name: '德语',
        }
      ],
      querypersonLanguageDegree: [
        {
          name: '大学英语四级',
        },
        {
          name: '大学英语六级',
        },
        {
          name: '英语专业四级',
        },
        {
          name: '英语专业八级',
        },
        {
          name: '雅思6分',
        },
        {
          name: '雅思6.5分',
        },
        {
          name: '雅思7.0',
        }
      ],
      querypersonDepartmentsType: [
        {
          type: 1,
          name: '主要任职',
        },
        {
          type: 0,
          name: '兼职任职',
        },
      ],
      queryProbationList: [
        {
          name: '第一月考评表',
        },
        {
          name: '第二月考评表',
        },
        {
          name: '第三月考评表',
        },
        {
          name: '试用期评价表',
        }
      ],
      queryPositionList: [],
      queryDegreeList: [
        {
          name: '专科'
        },
        {
          name: '本科'
        },
        {
          name: '硕士'
        },
        {
          name: '博士'
        }
      ],
      queryCertList: [
        {
          name: '律师资格证',
        },
        {
          name: '律师执业证',
        },
        {
          name: '专利代理人资格证',
        },
        {
          name: '专利代理师执业证',
        },
      ],
      queryRewardTypeList: [
        {
          name: '奖励'
        },
        {
          name: '表彰'
        },
        {
          name: '惩罚'
        },
        {
          name: '批评'
        }
      ]
    }
  },
  created() {
    this.talentCode = this.$route.params && this.$route.params.id
    this.queryUserById(this.talentCode)
    this.queryPosition()
    this.queryDepartmentAll()
    this.getValue()
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll, true);
  },
  methods: {
    handleScroll() {
      var top1 = document.getElementsByClassName("tilteSpan");
      var top2 = Array.prototype.slice.call(top1);

      top2 = top2.filter(
        item =>
          item.getBoundingClientRect().top > 0 &&
          item.getBoundingClientRect().top < 150
      );

      if (top2.length == 1) {
        let stepindex = "";
        this.elstepList.forEach((item, index) => {
          if (item.id == top2[0].children[0].id && item.state == true) {
            stepindex = index;
          }
        });

        this.stepActive1 = stepindex;
      }
    },
    getValue() {
      if (this.$store.getters.talentPoolPermission.permissions.includes(3)) {
        this.elstepList = [
          {title: "基本信息", state: true, id: "info-title"},
          {title: "毕业院校及专业", state: true, id: "school-title"},
          {title: "专业资格证书", state: true, id: "cert-title"},
          {title: "外语水平", state: true, id: "wsk-title"},
          {title: "任职组织", state: true, id: "personDepartments-title"},
          {title: "试用期考评", state: true, id: "personEvaluates-title"},
          {title: "奖惩记录", state: true, id: "reward-title"},
          {title: "晋升调整", state: true, id: "promotion-title"},
          {title: "薪酬情况", state: true, id: "personPayments-title"},
          {title: "培训", state: true, id: "personTrains-title"},
          {title: "附件资料上传", state: true, id: "personMaterials-title"},
        ].filter(item => item.state)
      } else {
        this.elstepList = [
          {title: "基本信息", state: true, id: "info-title"},
          {title: "毕业院校及专业", state: true, id: "school-title"},
          {title: "专业资格证书", state: true, id: "cert-title"},
          {title: "外语水平", state: true, id: "wsk-title"},
          {title: "培训", state: true, id: "personTrains-title"},
        ].filter(item => item.state)
      }

    },
    getTopPosition (el, active) {
      this.stepActive1 = active;
      document.getElementById(el).scrollIntoView();
    },
    // 根据Id查询信息组织页面数据
    queryUserById(userId) {
      queryTalentPersonInfo(userId).then(res => {
        res.data.personDepartments.forEach((item, index) => {
          var deptCode = item.deptCode.toString()
          var strArr = []
          var deptCodeStr = parseInt(deptCode.slice(0, 3))
          strArr.push(deptCodeStr)
          var str = (deptCode.slice(3))
          for (let i = 0; i < str.length; i += 2) {
            deptCodeStr = parseInt(deptCodeStr + str.slice(i, i + 2))
            strArr.push(deptCodeStr)
          }
          item.deptCodeArr = strArr
          item.disabledState = true;
        })
        res.data.eduExperiences.forEach(item => {
          item.disabledState = true;
          item.flagStatus = item.flag
        });
        res.data.personLanguages.forEach(item => {
          item.disabledState = true;
          item.flagStatus = item.flag
        });
        res.data.personCertificates.forEach(item => {
          item.disabledState = true;
          item.flagStatus = item.flag
        });
        res.data.personPromotes.forEach(item => {
          item.disabledState = true;
        });
        res.data.personRewards.forEach(item => {
          item.disabledState = true;
        });
        res.data.personTrains.forEach(item => {
          item.disabledState = true;
          item.flagStatus = item.flag
        });
        res.data.personPayments.forEach(item => {
          item.disabledState = true;
        });
        this.postForm = res.data
        this.getAge()
      })
    },
    updateAttachmentData(userId) {
      queryTalentPersonInfo(userId).then(res => {
        this.postForm.personEvaluates = res.data.personEvaluates
        this.postForm.personMaterials = res.data.personMaterials
        this.dialogVisible = false
        this.personEvaluatesDialogVisible = false
      })
    },
    queryPosition() {
      queryPositionAll().then(res => {
        if (res.success) {
          this.queryPositionList = res.data
        }
      })
    },
    queryDepartmentAll() {
      queryDepartmentAll().then(res => {
        if (res.success) {
          this.queryDepartmentAllList = res.data
        }
      })
    },
    // 计算年龄
    getAge() {
      let birthdays = new Date(this.postForm.birthday.replace(/-/g, '/'))
      let d = new Date()
      this.age = d.getFullYear() - birthdays.getFullYear() - (d.getMonth() < birthdays.getMonth() || (d.getMonth() == birthdays.getMonth() && d.getDate() < birthdays.getDate()) ? 1 : 0);
    },
    // 专业资格证书，上传时判断处理
    beforeuploadCertificate(file, key) {
      if (!this.postForm.personCertificates[key].certificateName) {
        this.$message('请选择或填写证书名称')
        return false
      }
      this.uploadCertificateData.talentCode = this.talentCode;
      if (this.postForm.personCertificates[key].certId) {
        this.uploadCertificateData.certId = this.postForm.personCertificates[key].certId;
      }
      this.uploadCertificateData.certificateName = this.postForm.personCertificates[key].certificateName;
    },
    // 专业资格证书，上传成功返回
    handleSuccess(key, file) {
      this.postForm.personCertificates[key].certificatePath = file.data[0].certificatePath
    },
    // 预览查看
    preView(url) {
      if(['doc','docx'].includes(url.replace(/.+\./,"").toLocaleLowerCase())) {
        this.$commonUtils.viewPdf(`${url}`)
      }else if(['pdf','jpg','png'].some(item=>url.replace(/.+\./,"").toLocaleLowerCase()==item)) {
        window.open(`/ipdoc${url}`.replace(/[+]/g,'%2B'))
      } else {
        this.downLoad(url)
      }
    },
    // 附件下载
    downLoad(url){
      const downData={
        url:`ipdoc${url}`,
        success(){
          // notify.close()
        }
      }
      this.$commonUtils.downLoadAll(downData)
    },
    // 附件删除
    deleteMaterial(key, materialId, type) {
      this.$confirm('此操作将删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (type === 1) { // 附件
          delectTalentMaterial({ materialId: materialId }).then(res => {
            this.postForm.personMaterials.splice(key,1)
          })
        }
        if (type === 2) { // 试用期考核
          deleteEvaluateMaterial({ evalId: materialId }).then(res => {
            this.postForm.personEvaluates.splice(key,1)
          })
        }
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    handleAddItem(type) {
      if (this.postForm[type].length !== 0) {
        if (
          !this.postForm[type][this.postForm[type].length - 1]
            .disabledState
        ) {
          this.$alert('请先添加保存项', '提示信息', {
            confirmButtonText: '确定'
          })
          return
        }
      }
      this.postForm[type].push(
        JSON.parse(JSON.stringify(this.queryForm[type]))
      )
    },
    handleChangeDisable(type, res) {
      this.postForm[type][res].disabledState = !this.postForm[type][res].disabledState
      console.log(this.postForm[type][res].disabledState)
      if (this.postForm[type][res].disabledState === true){
        if (this.$store.getters.talentPoolPermission.permissions.includes(3)) {
          this.postForm[type][res]['flag'] = 1
        } else {
          this.postForm[type][res]['flag'] = 0
        }
      }
      this.postForm[type].push({})
      this.postForm[type].pop()
    },
    deleteDeptId(type, index) {
      this.postForm[type].splice(index, 1)
    },
    auditPass(type, index, status) {
      this.$confirm('此操作, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        this.postForm[type][index]['flag'] = status
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
      })
    },
    // 数据状态展示
    stateFormat(state) {
      if (state === 1) {
        return '正常'
      } else if (state === 0) {
        return '待审核'
      } else {
        return '审核退回'
      }
    },
    myRules() {
      this.submit();
      console.log(this.postForm.eduExperiences)
    },
    submit() {
      upsertTalentPersonInfo(this.postForm).then(res => {
        if (res.success) {
          this.$router.history.go(-1);
          this.$message({
            message: '修改成功',
            type: 'success'
          });
        }
      });
    },
    cancel() {
      this.$router.history.go(-1);
    },
    // 职位调整处理
    handleDepartmentChange(item, scope) {
      this.postForm.personDepartments[scope].deptCode = item[item.length - 1]
    },
    // 岗位调整处理
    handlePositionChange(id, scope) {
      var position = this.queryPositionList.find(item => item.posId === id)
      this.postForm.personDepartments[scope].posName = position.posName
    },
  }
}
</script>

<style lang="scss" scoped>
> > > .talents-container {
  .el-form {
    .el-row {
      display: flex;

      .header-info {
        cursor: pointer;
        font-size: 18px;
        padding: 15px 0px;
        color: #7199d5;
      }

      .el-col {
        display: flex;
        /*height: 42px;*/
        .el-form-item {
          flex: 1;
          border: 1px solid #d7d7d7;
          border-top: none;
          border-right: none;
          margin-bottom: 0;
          /*display: flex;*/
          /*align-items: center;*/
          /*justify-content: center;*/
          .el-form-item__content {
            height: 100%;
            /*line-height: 30px;*/
            padding: 5px 15px;
          }


          .el-select {
            width: 90%;
          }

          .el-input__inner {
            height: 28px;
            background-color: #FFF;
          }

          .el-input__icon {
            line-height: 28px;
          }

          .el-input, .el-textarea {
            width: 80%;
            margin-left: 10px;
          }

          .virtual-select {
            width: 80% !important;

            .content {
              height: 28px;
              overflow: hidden;

            }
          }

          .el-form-item__label {
            /*min-height: 35px;*/
            line-height: 35px;
            height: 100%;
            border-right: 1px solid #d7d7d7;
            background-color: #f9f9f9;
          }


        }

        &:last-child {
          border-right: 1px solid #d7d7d7;
        }
      }

    }

    .border-top {
      border-top: 1px solid #d7d7d7;
    }

  }

  .handle {
    span {
      color: #409EFF;
      cursor: pointer;
    }
  }

  .file-box {
    box-sizing: border-box;
    width: 100%;
    min-height: 300px;
    border: 1px solid #d7d7d7;

    .file-box-left {
      width: 50%;
      height: 100%;
      border-right: 1px solid #d7d7d7;
    }

    .file-box-right {
      width: 50%;
      height: 100%;
    }
  }

  /*> > > .el-form-item__error {*/
  /*  position: relative;*/
  /*  top: 0;*/
  /*}*/
  .el-form-item__error {
    position: static;
  }

  .hideApp,
  .hideNewApp,
  .hidePatentBase {
    opacity: 0;
    height: 0;
    /*display: none!important;*/
    overflow: hidden;
    transition-duration: .5s;
    transition-property: all;
    transition-timing-function: ease;
    transition-delay: 0s;

  }

  .showApp,
  .showNewApp,
  .showPatentBase {
    opacity: 1;
    height: 100%;
    /*display: block;*/
    transition-duration: .5s;
    transition-property: all;
    transition-timing-function: ease;
    transition-delay: 0s;
  }

  .right {
    transform: rotate(-90deg);
    /*display: block;*/
    transition-duration: .5s;
    transition-property: all;
    transition-timing-function: ease;
    transition-delay: 0s;
  }

  .down {
    /*transform: rotate(90deg);*/
    /*display: block;*/
    transition-duration: .5s;
    transition-property: all;
    transition-timing-function: ease;
    transition-delay: 0s;
  }

  .floatRight {
    float: right;
    margin-bottom: 5px;
    margin-top: 5px;
  }
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

.abow_dialog {
  > > > .el-dialog {
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

  > > > .el-dialog__body {
    overflow: auto;
  }
}

.adress {
  width: 100%;
}

.avatar-uploader {
  /deep/ .el-form-item__label {
    height: 154px;
    line-height: 154px;
    width: 30%;
  }

  height: 154px;

  /deep/ .el-upload {
    border: 1px dashed #b6b2b2;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    margin-top: 4px;
  }
}

.avatar-uploader {
  /deep/ .el-upload:hover {
    border-color: #409eff;
  }
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 145px;
  height: 145px;
  line-height: 145px;
  text-align: center;
  border: 1px dashed #d9d9d9;
}

.avatar {
  width: 145px;
  height: 145px;
  display: block;
}

> > > .special-width {
  .el-input--suffix {
    width: 100% !important;
  }

  .el-select__tags {
    left: 10px;
  }
}

>>> .header .el-form-item__content{
  padding: 1px 1px !important;
}


</style>
