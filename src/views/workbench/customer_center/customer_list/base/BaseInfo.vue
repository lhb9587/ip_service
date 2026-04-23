<template>
  <div class="cust-base">
    <el-button v-if="(!isCreated && editStatus && !isFenpei) || (isCreated && editStatus && createSign && !isFenpei)"
               size="small" type="primary"
               style="position: absolute; top: 5px;right: 5px;"
               @click="() => saveBaseInfo(true)">保存
    </el-button>
    <div v-show="!isFenpei">
      <!-- 基本信息  -->
      <div class="base-info">
        <div class="base-header">
          <span class="left-line"></span>
          <span class="right-text">基本信息</span>
        </div>
        <div class="base-content">
          <el-form ref="postForm" :rules="rules" :model="customerBaseInfo" label-width="130px" prop="name">
            <el-row>
              <el-col :span="isSmallWidth">
                <el-form-item label="简称">
                  <el-input v-if="editStatus" class="edit-border" size="mini"
                            v-model="customerBaseInfo.name"></el-input>
                  <span v-else>{{ customerBaseInfo.name }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="isSmallWidth">
                <el-form-item label="中文名称/全称" prop="fullname">
                  <el-input size="mini" v-if="editStatus" class="edit-border"
                            v-model="customerBaseInfo.fullname"></el-input>
                  <div v-else>
                    {{ customerBaseInfo.fullname }}
                  </div>
                  <!--                  <div>-->
                  <span class="pointer" @click="linkQiChacha">企查查</span>
                  <span class="pointer" @click="linkBaidu">百度一下</span>
                  <!--                  </div>-->
                </el-form-item>
              </el-col>
              <el-col :span="isSmallWidth">
                <el-form-item label="英文名称">
                  <el-input size="mini" v-if="editStatus" class="edit-border"
                            v-model="customerBaseInfo.fullnameEn"></el-input>
                  <span v-else>{{ customerBaseInfo.fullnameEn }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="isSmallWidth">
                <el-form-item label="外文全称">
                  <el-input size="mini" v-if="editStatus" class="edit-border"
                            v-model="customerBaseInfo.fgFullname"></el-input>
                  <span v-else>{{ customerBaseInfo.fgFullname }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="isSmallWidth">
                <el-form-item label="客户等级">
                  <el-select size="mini" v-if="editStatus" class="edit-border" default-first-option :clearable='true'
                             placeholder="请选择" v-model="customerBaseInfo.custGrade" filterable>
                    <el-option v-for="item in seletData.gradeList" :key="item.id" :label="item.typeName"
                               :value="String(item.id)">
                    </el-option>
                  </el-select>
                  <span v-else>{{ customerBaseInfo.custGradeStr }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="isSmallWidth">
                <el-form-item label="沟通语言" prop="contactLanguage">
                  <el-select size="mini" v-if="editStatus" class="edit-border" default-first-option :clearable='true'
                             placeholder="请选择" v-model="customerBaseInfo.contactLanguage" filterable>
                    <el-option v-for="item in seletData.comLanguage" :key="String(item.id)" :label="item.typeName"
                               :value="String(item.id)">
                    </el-option>
                  </el-select>
                  <span v-else>{{ customerBaseInfo.contactLanguageStr }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="isSmallWidth">
                <el-form-item label="合作状态">
                  <el-select :disabled="!(editStatus && !hzdisabled)" size="mini" class="edit-border"
                             default-first-option
                             :clearable='true' placeholder="请选择"
                             v-model="customerBaseInfo.curStatus" filterable>
                    <el-option v-for="item in seletData.hzzt" :key="item.id" :label="item.typeName"
                               :value="String(item.id)">
                    </el-option>
                  </el-select>
                  <!--                  <span v-else>{{customerBaseInfo.curStatusStr}}</span>-->
                </el-form-item>
              </el-col>
              <el-col :span="isSmallWidth">
                <el-form-item label="合作资源">
                  <el-radio-group v-if="editStatus" v-model="customerBaseInfo.isCollaboration">
                    <el-radio :label='1'>是</el-radio>
                    <el-radio :label='0'>否</el-radio>
                  </el-radio-group>
                  <div v-else>
                    <span v-if="customerBaseInfo.isCollaboration=='0'">否</span>
                    <span v-if="customerBaseInfo.isCollaboration=='1'">是</span>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="isSmallWidth">
                <el-form-item label="国家/省份/城市" prop="ctData">
                  <el-cascader size="mini" class="edit-border" v-if="editStatus" clearable change-on-select
                               placeholder="" v-model="customerBaseInfo.ctData" :options="seletData.ctDataOption"
                               filterable>
                  </el-cascader>
                  <span
                    v-else>{{ [customerBaseInfo.country, customerBaseInfo.province, customerBaseInfo.city].filter(item => !!item).join('/') }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="isSmallWidth">
                <el-form-item label="审查号">
                  <el-input size="mini" v-if="editStatus" class="edit-border"
                            v-model="customerBaseInfo.auditNo"></el-input>
                  <span v-else>{{ customerBaseInfo.auditNo }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="isSmallWidth">
                <el-form-item label="申请人">
                  <el-radio-group v-if="editStatus" v-model="customerBaseInfo.isApplicant">
                    <el-radio :label='1'>是</el-radio>
                    <el-radio :label='0'>否</el-radio>
                  </el-radio-group>
                  <div v-else>
                    <span v-if="customerBaseInfo.isApplicant=='0'">否</span>
                    <span v-if="customerBaseInfo.isApplicant=='1'">是</span>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="isSmallWidth">
                <el-form-item label="事务所">
                  <el-radio-group v-if="editStatus" v-model="customerBaseInfo.isAgent">
                    <el-radio :label='1'>是</el-radio>
                    <el-radio :label='0'>否</el-radio>
                  </el-radio-group>
                  <div v-else>
                    <span v-if="customerBaseInfo.isAgent=='0'">否</span>
                    <span v-if="customerBaseInfo.isAgent=='1'">是</span>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="isSmallWidth">
                <el-form-item label="所属集团">
                  <el-select size="mini" v-if="editStatus" class="edit-border" default-first-option :clearable='true'
                             v-model="customerBaseInfo.custjtId" no-match-text='暂无数据'
                             loading-text='正在查询' filterable remote reserve-keyword
                             placeholder="请输入关键词" :remote-method="remotepaternalUnit1">
                    <el-option v-for="(item,key) in jtCustList" :key="key" :label="item.jtName"
                               :value="item.custjtId">
                    </el-option>
                  </el-select>
                  <span v-else>
                    {{ customerBaseInfo.jtName }}
                  </span>
                </el-form-item>

              </el-col>
              <el-col :span="isSmallWidth">
                <el-form-item label="父单位">
                  <el-select size="mini" v-if="editStatus" class="edit-border" default-first-option :clearable='true'
                             v-model="customerBaseInfo.parentCustId" no-match-text='暂无数据'
                             loading-text='正在查询' filterable remote reserve-keyword
                             placeholder="请输入关键词" :remote-method="remotepaternalUnit">
                    <el-option v-for="(item,key) in seletData.paternalUnit" :key="key" :label="item.name"
                               :value="item.custId">
                    </el-option>
                  </el-select>
                  <span v-else>
                  {{ customerBaseInfo.parentCustName }}
                </span>
                </el-form-item>
              </el-col>
              <el-col :span="isSmallWidth">
                <el-form-item label="内部签约主体:">
                  <template>
                    <el-select size="mini" v-if="editStatus" class="edit-border" default-first-option multiple
                               :clearable='true' placeholder="请选择" v-model="customerBaseInfo.compIdArray" filterable>
                      <el-option v-for="item in seletData.customerOwner" :key="item.compId" :label="item.companyNameCn"
                                 :value="item.compId">
                      </el-option>
                    </el-select>
                    <el-select size="mini" v-else disabled class="edit-border" default-first-option multiple :clearable='true'
                               placeholder="请选择" v-model="customerBaseInfo.compIdArray" filterable>
                      <el-option v-for="item in seletData.customerOwner" :key="item.compId" :label="item.companyNameCn"
                                 :value="item.compId">
                      </el-option>
                    </el-select>
                  </template>
                </el-form-item>
              </el-col>
              <el-col :span="isSmallWidth">
                <el-form-item label="主体法律性质" prop="legalNature">
                  <el-select size="mini" v-if="editStatus" class="edit-border" default-first-option :clearable='true'
                             placeholder="请选择" v-model="customerBaseInfo.legalNature" filterable>
                    <el-option v-for="item in seletData.mainLegalNature" :key="item.id" :label="item.typeName"
                               :value="item.id">
                    </el-option>
                  </el-select>
                  <span v-else>{{ customerBaseInfo.legalNatureStr }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="isSmallWidth">
                <el-form-item label="客户信用等级">
                  <input disabled size="mini" class="edit-border" type="text" v-model="customerBaseInfo.level">
                </el-form-item>
              </el-col>
              <el-col :span="isSmallWidth">
                <el-form-item label="客户来源" prop="source">
                  <el-cascader
                    size="mini" class="edit-border" v-if="editStatus"
                    clearable
                    v-model="sourceList"
                    :options="seletData.customerSource"
                    :props="{children:'childrens',label:'sourceName',value:'id'}"
                    filterable>
                  </el-cascader>
                  <span v-else>
                  {{ customerBaseInfo.sourceStr }}
                </span>
                </el-form-item>
              </el-col>
              <el-col :span="isSmallWidth">
                <el-form-item label="客户来源说明">
                  <el-input size="mini" v-if="editStatus" class="edit-border"
                            v-model="customerBaseInfo.sourceExplain"></el-input>
                  <span v-else>{{ customerBaseInfo.sourceExplain }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="isSmallWidth" v-if="customerBaseInfo.source == 6">
                <el-form-item prop="activityDesc">
                  <span slot="label">
                    市场活动
                    <el-popover
                      placement="top"
                      width="400"
                      >
                      <svg-icon slot="reference" class="question" icon-class="问题"/>
                      <div>
                        <p>请在下拉列表中选择获得客户的市场活动，若无合适选项，请自行填写，填写内容包括时间、地点、活动名称（如XX研讨会/讲座/授课等），如涉及到其他现有客户，请注明客户名称</p>
                      </div>
                    </el-popover>
                  </span>
                    <el-select v-if="editStatus" size="small" class="edit-border"
                              default-first-option
                              allow-create
                              remote
                              :remote-method="fetchActivityDescList"
                              :clearable='true' placeholder="请选择"
                              v-model="customerBaseInfo.activityDesc" filterable>
                      <el-option v-for="item in activityDescList" :key="item.value" :label="item.label"
                                :value="item.value">
                      </el-option>
                    </el-select>
                    <span v-else>
                      {{ customerBaseInfo.activityDesc }}
                    </span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="isSmallWidth">
                <el-form-item label="官网网址">
                  <el-input size="mini" v-if="editStatus" class="edit-border"
                            v-model="customerBaseInfo.website"></el-input>
                  <span v-else>{{ customerBaseInfo.website }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <div v-show="!moreView" class="pointer" @click="moreView = true"
                 style="display: flex;justify-content: right;font-size: 14px">查看更多
            </div>
            <!--     查看更多     -->
            <div v-show="moreView">
              <el-row>
                <el-col :span="isSmallWidth">
                  <el-form-item label="统一社会信用代码">
                    <el-input size="mini" v-if="editStatus" class="edit-border"
                              v-model="customerBaseInfo.certCode"></el-input>
                    <span v-else>{{ customerBaseInfo.certCode }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="isSmallWidth">
                  <el-form-item label="业务接洽人" prop="ourImporter">
                    <el-input size="mini" v-if="editStatus" class="edit-border"
                              v-model="customerBaseInfo.ourImporter"></el-input>
                    <span v-else>{{ customerBaseInfo.ourImporter }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="isSmallWidth">
                  <el-form-item label="财务年度结算日期">
                    <el-input size="mini" v-if="editStatus" class="edit-border"
                              v-model="customerBaseInfo.annualAccDate"></el-input>
                    <span v-else>{{ customerBaseInfo.annualAccDate }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="isSmallWidth">
                  <el-form-item label="初始合作事项" prop="firstcaseCollitem">
                    <el-input size="mini" v-if="editStatus" class="edit-border"
                              v-model="customerBaseInfo.firstcaseCollitem"></el-input>
                    <span v-else>{{ customerBaseInfo.firstcaseCollitem }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="isSmallWidth">
                  <el-form-item label="状态说明">
                    <el-input size="mini" v-if="editStatus" class="edit-border"
                              v-model="customerBaseInfo.curStatusDesc"></el-input>
                    <span v-else>{{ customerBaseInfo.curStatusDesc }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="isSmallWidth">
                  <el-form-item label="大洲">
                    <el-input size="mini" disabled class="edit-border"
                              v-model="customerBaseInfo.continent"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="isSmallWidth">
                  <el-form-item label="官方机构">
                    <el-radio-group v-if="editStatus" v-model="customerBaseInfo.isOfficial">
                      <el-radio :label='1'>是</el-radio>
                      <el-radio :label='0'>否</el-radio>
                    </el-radio-group>
                    <div v-else>
                      <span v-if="customerBaseInfo.isOfficial=='0'">否</span>
                      <span v-if="customerBaseInfo.isOfficial=='1'">是</span>
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span="isSmallWidth">
                  <el-form-item label="初始来案案型">
                    <el-input size="mini" v-if="editStatus" class="edit-border"
                              v-model="customerBaseInfo.caseType"></el-input>
                    <span v-else>{{ customerBaseInfo.caseType }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="isSmallWidth">
                  <el-form-item label="电话">
                    <el-input size="mini" v-if="editStatus" class="edit-border"
                              v-model="customerBaseInfo.phone"></el-input>
                    <span v-else>{{ customerBaseInfo.phone }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="isSmallWidth">
                  <el-form-item label="电子邮件">
                    <el-input size="mini" v-if="editStatus" class="edit-border"
                              v-model="customerBaseInfo.email"></el-input>
                    <span v-else>{{ customerBaseInfo.email }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="isSmallWidth">
                  <el-form-item label="传真">
                    <el-input size="mini" v-if="editStatus" class="edit-border"
                              v-model="customerBaseInfo.fax1"></el-input>
                    <span v-else>{{ customerBaseInfo.fax1 }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="isSmallWidth">
                  <el-form-item label="正式客户时间">
                    <el-input size="mini" v-if="editStatus" class="edit-border"
                              v-model="customerBaseInfo.firstcaseDate"></el-input>
                    <span v-else>{{ customerBaseInfo.firstcaseDate }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="简介">
                    <el-input style="margin-top: 10px" v-if="editStatus" placeholder="请输入内容" type="textarea"
                              class="edit-border"
                              v-model="customerBaseInfo.info"></el-input>
                    <span v-else>{{ customerBaseInfo.info }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="客户文档">
                    <el-upload
                      v-if="editStatus"
                      class="upload-demo"
                      name="attachFile"
                      :data='addCustomerFileData'
                      ref="uploadCustFile"
                      multiple
                      :action="creatematerial"
                      :before-upload="handlePreview"
                      :on-preview="onPreview"
                      :on-success='uploadSuccess'
                      :before-remove="(file)=>brforeRemoveFile(file,'cust')"
                      :file-list="materialList"
                    >
                      <el-button size="small" type="primary">上传</el-button>
                    </el-upload>
                    <div v-else>
                      <div v-for="item in materialList" @click="onPreview(item)">
                        <span class="pointer">{{ item.materialName }}</span>
                      </div>
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="备注">
                    <el-input :rows="2" placeholder="请输入内容" v-if="editStatus"
                              type="textarea" class="edit-border"
                              v-model="customerBaseInfo.memo"></el-input>
                    <span v-else>{{ customerBaseInfo.memo }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="isSmallWidth">
                  <el-form-item label="建档日期">
                    <!--                    <el-date-picker class="date-border" v-if="editStatus" v-model="customerBaseInfo.createTime"-->
                    <!--                                    format='yyyy-MM-dd'-->
                    <!--                                    value-format="yyyy-MM-dd" align="right" type="date" placeholder="选择日期"-->
                    <!--                                    :picker-options="pickerOptions">-->
                    <!--                    </el-date-picker>-->
                    <span>{{ customerBaseInfo.createTime }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="isSmallWidth">
                  <el-form-item label="建档人">
                    <el-input size="mini" disabled class="edit-border"
                              v-model="customerBaseInfo.createUserName"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="isSmallWidth">
                  <el-form-item label="首次审查日期">
                    <el-date-picker class="date-border" v-if="editStatus" v-model="customerBaseInfo.auditDate"
                                    format='yyyy-MM-dd'
                                    value-format="yyyy-MM-dd" align="right" type="date" placeholder="选择日期"
                                    :picker-options="pickerOptions">
                    </el-date-picker>
                    <span v-else>{{ customerBaseInfo.auditDate }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="isSmallWidth">
                  <el-form-item label="审查人">
                    <!--                    <el-select size="mini" v-if="editStatus" class="edit-border" default-first-option :clearable='true'-->
                    <!--                               placeholder="请选择" v-model="customerBaseInfo.auditUserId" filterable>-->
                    <!--                      <el-option v-for="item in seletData.censor" :key="String(item.userId)" :label="item.fullname"-->
                    <!--                                 :value="item.userId">-->
                    <!--                      </el-option>-->
                    <!--                    </el-select>-->
                    <span>{{ customerBaseInfo.auditUserName }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="isSmallWidth">
                  <el-form-item label="报送部门">
                    {{ customerBaseInfo.submissionDepartmentStr }}
                  </el-form-item>
                </el-col>
                <el-col :span="isSmallWidth">
                  <el-form-item label="审查报送人">
                    <template>
                      <el-select size="mini" v-if="editStatus" class="edit-border" default-first-option
                                 :clearable='true' placeholder="请选择"
                                 v-model="customerBaseInfo.reviewSubmitter" filterable @change="changeReviewer">
                        <el-option v-for="item in $store.getters.userList" :key="item.userId" :label="item.fullname"
                                   :value="item.userId">
                        </el-option>
                      </el-select>
                      <div v-else>{{ customerBaseInfo.reviewSubmitterStr }}</div>
                    </template>
                  </el-form-item>
                </el-col>
                <el-col v-if="customerBaseInfo.curStatus == 6 || customerBaseInfo.secondAuditDate" :span="isSmallWidth">
                  <el-form-item label="再次审查日期">
                    <el-date-picker class="date-border" v-if="editStatus" v-model="customerBaseInfo.secondAuditDate"
                                    format='yyyy-MM-dd'
                                    value-format="yyyy-MM-dd" align="right" type="date" placeholder="选择日期"
                                    :picker-options="pickerOptions">
                    </el-date-picker>
                    <span v-else>{{ customerBaseInfo.secondAuditDate }}</span>
                  </el-form-item>
                </el-col>
                <el-col v-else :span="12">
                  <el-form-item label="邮件配置">
                    <el-checkbox-group v-if="editStatus" v-model="customerBaseInfo.mailConfigs" @change="changEmailConfigs">
                      <el-checkbox :label="1">续展提醒</el-checkbox>
                      <el-checkbox :label="2">初审公告提醒</el-checkbox>
                      <el-checkbox :label="3">送达公告提醒</el-checkbox>
                    </el-checkbox-group>
                    <el-checkbox-group v-else v-model="customerBaseInfo.mailConfigs">
                      <el-checkbox :disabled="true" :label="1">续展提醒</el-checkbox>
                      <el-checkbox :disabled="true" :label="2">初审公告提醒</el-checkbox>
                      <el-checkbox :disabled="true" :label="3">送达公告提醒</el-checkbox>
                    </el-checkbox-group>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row v-if="customerBaseInfo.curStatus == 6">
                <el-col :span="12">
                  <el-form-item label="邮件配置">
                    <el-checkbox-group v-if="editStatus" v-model="customerBaseInfo.mailConfigs" @change="changEmailConfigs">
                      <el-checkbox :label="1">续展提醒</el-checkbox>
                      <el-checkbox :label="2">初审公告提醒</el-checkbox>
                      <el-checkbox :label="3">送达公告提醒</el-checkbox>
                    </el-checkbox-group>
                    <el-checkbox-group v-else v-model="customerBaseInfo.mailConfigs">
                      <el-checkbox :disabled="true" :label="1">续展提醒</el-checkbox>
                      <el-checkbox :disabled="true" :label="2">初审公告提醒</el-checkbox>
                      <el-checkbox :disabled="true" :label="3">送达公告提醒</el-checkbox>
                    </el-checkbox-group>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-form>
        </div>
      </div>
      <!--  负责人信息  -->
      <div class="header-info">
        <el-button style="float: right" v-allow="410" type="primary" size="small" v-if="customerBaseInfo.custId"
                   @click="fenPeiClick(false)">客户分配
        </el-button>
        <div class="base-header">
          <span class="left-line"></span>
          <span class="right-text">客户负责人信息</span>
        </div>
        <div class="base-content">
          <el-form :rules="rules" label-width="130px">
            <el-row>
              <!--              <el-col :span="isSmallWidth">-->
              <!--                <el-form-item label="客户负责人">-->
              <!--                  <el-select size="mini" v-if="editStatus" class="edit-border" :popper-append-to-body="false"-->
              <!--                             :popper-class="!cssFlag?'customerResponsible':'text_left'"-->
              <!--                             default-first-option :clearable='true' multiple placeholder="请选择"-->
              <!--                             v-model="customerUserIdList" filterable :filter-method="filterMethod"-->
              <!--                             @change="changeCustomerUserIdList">-->
              <!--                    <el-option v-for="item in responsiblePartner" :key="item.userId" :label="item.fullname"-->
              <!--                               :value="item.userId">-->
              <!--                      <UserIconAndUserName :user-id="item.userId"></UserIconAndUserName>-->
              <!--                    </el-option>-->
              <!--                  </el-select>-->
              <!--                </el-form-item>-->
              <!--              </el-col>-->
              <el-col :span="isSmallWidth">
                <el-form-item label="客户协调人">
                  <el-select size="mini" v-if="editStatus && $store.getters.permissions.includes(410)"
                             class="edit-border" default-first-option :clearable='true'
                             placeholder="请选择" multiple
                             v-model="customerBaseInfo.customerManageArray" filterable>
                    <el-option v-for="item in $store.getters.userList" :key="item.userId"
                               :label="item.fullname" :value="item.userId">
                      <UserIconAndUserName :user-id="item.userId"></UserIconAndUserName>
                    </el-option>
                  </el-select>
                  <el-select size="mini" v-else disabled class="edit-border" default-first-option :clearable='true'
                             placeholder="请选择" multiple
                             v-model="customerBaseInfo.customerManageArray" filterable>
                    <el-option v-for="item in $store.getters.userList" :key="item.userId"
                               :label="item.fullname" :value="item.userId">
                      <UserIconAndUserName :user-id="item.userId"></UserIconAndUserName>
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="isSmallWidth">
                <el-form-item label=" 客户开发人">
                  <el-input size="mini" v-if="editStatus && $store.getters.permissions.includes(410)"
                            class="edit-border"
                            v-model="customerBaseInfo.custIntroductor"></el-input>
                  <span v-else>{{ customerBaseInfo.custIntroductor }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="isSmallWidth">
                <el-form-item label="客户开发人单位">
                  <el-input size="mini" v-if="editStatus && $store.getters.permissions.includes(410)"
                            class="edit-border"
                            v-model="customerBaseInfo.custIntroCompany"></el-input>
                  <span v-else>{{ customerBaseInfo.custIntroCompany }}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div class="header-table">
            <el-table
              @row-dblclick="cfpDbClick"
              empty-text="暂无数据"
              size="mini"
              ref="customerResponsibleArray"
              :data="customerBaseInfo.customerResponsibleArray"
            >
              <el-table-column

                label="负责人"
              >
                <template slot-scope="scope">
                  {{ $commonUtils.transformation($store.getters.allUserList, scope.row.userId, 'userId', 'fullname') }}
                </template>
              </el-table-column>
              <el-table-column

                label="领域"
              >
                <template slot-scope="scope">
                  <!--                  <el-select size="mini" v-if="editStatus" class="edit-border" default-first-option :clearable='true'-->
                  <!--                             placeholder="请选择" multiple-->
                  <!--                             v-model="scope.row.userDomains" filterable>-->
                  <!--                    <el-option v-for="item in ['商标申请','商标诉讼','专利申请','专利诉讼','调查保护', '版权', '域名', '其他']" :key="item"-->
                  <!--                               :label="item" :value="item">-->
                  <!--                    </el-option>-->
                  <!--                  </el-select>-->
                  <div>
                    {{ scope.row.userDomains && scope.row.userDomains.join(',') }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column

                label="角色"
              >
                <template slot-scope="scope">
                  <!--                  <el-select size="mini" v-if="editStatus" class="edit-border" default-first-option :clearable='true'-->
                  <!--                             placeholder="请选择"-->
                  <!--                             v-model="scope.row.principalRole"-->
                  <!--                             filterable>-->
                  <!--                    <el-option v-for="item in seletData.roles" :key="item.id" :label="item.typeName" :value="item.id">-->
                  <!--                    </el-option>-->
                  <!--                  </el-select>-->
                  <div>
                    {{ scope.row.principalRoleStr }}
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <div class="header-table">
            <el-table
              empty-text="暂无数据"
              size="mini"
              ref="customerResponsibleArray"
              @row-dblclick="wfpDbClick"
              :data="customerBaseInfo.customerFenpeiList"
            >
              <el-table-column

                label="负责工作组"
              >
                <template slot-scope="scope">
                  {{ scope.row.groupName }}
                </template>
              </el-table-column>
              <el-table-column

                label="领域"
              >
                <template slot-scope="scope">
                  <!--                  <el-select size="mini" v-if="editStatus" class="edit-border" default-first-option :clearable='true'-->
                  <!--                             placeholder="请选择" multiple-->
                  <!--                             v-model="scope.row.userDomains" filterable>-->
                  <!--                    <el-option v-for="item in ['商标申请','商标诉讼','专利申请','专利诉讼','调查保护', '版权', '域名', '其他']" :key="item"-->
                  <!--                               :label="item" :value="item">-->
                  <!--                    </el-option>-->
                  <!--                  </el-select>-->
                  <div>
                    {{ scope.row.userDomain }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column

                label="最近立卷日期"
              >
                <template slot-scope="scope">
                  {{ scope.row.caseDate }}
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>

      </div>

      <!--  预算记录  -->
      <!--      <div class="budget-info">-->
      <!--        <div class="base-header">-->
      <!--          <span class="left-line"></span>-->
      <!--          <span class="right-text">客户预算记录</span>-->
      <!--        </div>-->
      <!--        <div class="header-table">-->
      <!--          <el-button v-if="editStatus" size="mini" type="primary" style="float: right;margin-bottom: 5px" @click="addYc"-->
      <!--                     :disabled="!!ycList.find(item => item.year == new Date().getFullYear())">添加-->
      <!--          </el-button>-->
      <!--          <el-table-->
      <!--            empty-text="暂无数据"-->
      <!--            size="mini"-->
      <!--            ref="customerResponsibleArray"-->
      <!--            :data="ycList"-->
      <!--            @row-dblclick="rowDbClick"-->
      <!--          >-->
      <!--            <el-table-column-->

      <!--              label="年度"-->
      <!--            >-->
      <!--              <template slot-scope="scope">-->
      <!--                {{scope.row.year}}-->
      <!--              </template>-->
      <!--            </el-table-column>-->
      <!--            <el-table-column-->

      <!--              label="领域"-->
      <!--            >-->
      <!--              <template slot-scope="scope">-->
      <!--                {{scope.row.customerYuceList.map(item => item.domain) + ''}}-->
      <!--              </template>-->
      <!--            </el-table-column>-->
      <!--            <el-table-column-->

      <!--              label="预算收入"-->
      <!--            >-->
      <!--              <template slot-scope="scope">-->
      <!--                <span>{{scope.row.amount | formatAmount}}</span>-->
      <!--              </template>-->
      <!--            </el-table-column>-->
      <!--            &lt;!&ndash;            <el-table-column&ndash;&gt;-->

      <!--            &lt;!&ndash;              label="预算描述"&ndash;&gt;-->
      <!--            &lt;!&ndash;            >&ndash;&gt;-->
      <!--            &lt;!&ndash;              <template slot-scope="scope">&ndash;&gt;-->
      <!--            &lt;!&ndash;                <span :title="scope.row.ycdesc">{{scope.row.ycdesc}}</span>&ndash;&gt;-->
      <!--            &lt;!&ndash;              </template>&ndash;&gt;-->
      <!--            &lt;!&ndash;            </el-table-column>&ndash;&gt;-->
      <!--            &lt;!&ndash;            <el-table-column&ndash;&gt;-->
      <!--            &lt;!&ndash;              label="操作"&ndash;&gt;-->
      <!--            &lt;!&ndash;              v-if="editStatus"&ndash;&gt;-->
      <!--            &lt;!&ndash;            >&ndash;&gt;-->
      <!--            &lt;!&ndash;              <template slot-scope="scope">&ndash;&gt;-->
      <!--            &lt;!&ndash;                <span class="pointer" @click="delYc(scope.row, scope.$index)">删除</span>&ndash;&gt;-->
      <!--            &lt;!&ndash;              </template>&ndash;&gt;-->
      <!--            &lt;!&ndash;            </el-table-column>&ndash;&gt;-->
      <!--          </el-table>-->
      <!--        </div>-->

      <!--        <el-dialog-->
      <!--          :title="'预算 - ' + title"-->
      <!--          :fullscreen="false" :show-close="false"-->
      <!--          :close-on-click-modal="false" :modal="false"-->
      <!--          :append-to-body="false"-->
      <!--          :visible.sync="custYcView"-->
      <!--          width="45%"-->
      <!--          class="abow_dialog"-->
      <!--          :before-close="closeYcDialog"-->
      <!--        >-->
      <!--          <div class="box-border">-->
      <!--            <el-form size="small" class="form-container" label-width="120px">-->
      <!--              <el-row class="first-row">-->
      <!--                <el-col :span="12">-->
      <!--                  <el-form-item label="年份:" class="postInfo-container-item">-->
      <!--                    <div>-->
      <!--                      {{YcData.year}}-->
      <!--                    </div>-->
      <!--                  </el-form-item>-->
      <!--                </el-col>-->
      <!--                <el-col :span="12">-->
      <!--                  <el-form-item label="预算收入:" class="postInfo-container-item">-->
      <!--                    <el-row>-->
      <!--                      {{YcData.amount | formatAmount}}-->
      <!--                    </el-row>-->
      <!--                  </el-form-item>-->
      <!--                </el-col>-->
      <!--              </el-row>-->
      <!--              <div class="divider">-->
      <!--                <span>-->
      <!--                    领域-->
      <!--                </span>-->
      <!--              </div>-->
      <!--              <div>-->
      <!--                &lt;!&ndash;                <el-button size="mini" type="primary" v-if="title === '新建' || title === '修改'">添加</el-button>&ndash;&gt;-->
      <!--                <el-table-->
      <!--                  empty-text="暂无数据"-->
      <!--                  size="mini"-->
      <!--                  max-height="200"-->
      <!--                  :data="YcData.customerYuceList"-->
      <!--                >-->
      <!--                  <el-table-column-->
      <!--                    label="领域"-->
      <!--                  >-->
      <!--                    <template slot-scope="scope">-->
      <!--                      <el-select v-if="title !== '查看'" size="mini" class="" default-first-option-->
      <!--                                 :clearable='true'-->
      <!--                                 @change="(v)=> changeDomain(v, scope.$index)"-->
      <!--                                 placeholder="请选择"-->
      <!--                                 v-model="scope.row.domain" filterable-->
      <!--                      >-->
      <!--                        <el-option-->
      <!--                          :disabled="!!YcData.customerYuceList.find(i => i.domain === domain)"-->
      <!--                          v-for="domain in ['商标','诉讼','保护','专利','域名', '著作权', '非诉', '全部']"-->
      <!--                          :key="domain"-->
      <!--                          :label="domain" :value="domain">-->
      <!--                        </el-option>-->
      <!--                      </el-select>-->
      <!--                      <span v-else>{{scope.row.domain}}</span>-->
      <!--                    </template>-->
      <!--                  </el-table-column>-->
      <!--                  <el-table-column-->
      <!--                    label="收入"-->
      <!--                  >-->
      <!--                    <template slot-scope="scope">-->
      <!--                      <el-input v-if="title !== '查看'" size="mini" v-model="scope.row.billSum"></el-input>-->
      <!--                      <span v-else>{{scope.row.billSum}}</span>-->
      <!--                    </template>-->
      <!--                  </el-table-column>-->
      <!--                  <el-table-column-->

      <!--                    label="预算描述"-->
      <!--                  >-->
      <!--                    <template slot-scope="scope">-->
      <!--                      <el-input v-if="title !== '查看'" size="mini" v-model="scope.row.ycdesc"></el-input>-->
      <!--                      <span v-else>{{scope.row.ycdesc}}</span>-->
      <!--                    </template>-->
      <!--                  </el-table-column>-->
      <!--                </el-table>-->
      <!--              </div>-->

      <!--              &lt;!&ndash;              <div class="divider">&ndash;&gt;-->
      <!--              &lt;!&ndash;                <span>&ndash;&gt;-->
      <!--              &lt;!&ndash;                    预算描述&ndash;&gt;-->
      <!--              &lt;!&ndash;                </span>&ndash;&gt;-->
      <!--              &lt;!&ndash;              </div>&ndash;&gt;-->
      <!--              &lt;!&ndash;              <div v-if="title === '新建' || title === '修改'">&ndash;&gt;-->
      <!--              &lt;!&ndash;                <el-input class="edit-border" type="textarea" v-model="YcData.ycdesc" :autosize="{ minRows: 4}"&ndash;&gt;-->
      <!--              &lt;!&ndash;                          placeholder="[预算描述]:"></el-input>&ndash;&gt;-->
      <!--              &lt;!&ndash;              </div>&ndash;&gt;-->
      <!--              &lt;!&ndash;              <div v-else>{{YcData.ycdesc}}</div>&ndash;&gt;-->
      <!--            </el-form>-->
      <!--          </div>-->
      <!--          <span slot="footer" class="dialog-footer fl-ac-jc">-->
      <!--          <el-button size="small" @click="() => closeYcDialog(false)">取 消</el-button>-->
      <!--          <el-button size="small" type="primary" v-if="title === '新建' || title === '修改'"-->
      <!--                     @click="submitYcData">确 定</el-button>-->
      <!--        </span>-->
      <!--        </el-dialog>-->
      <!--      </div>-->
    </div>
    <div v-if="isFenpei">
      <customer-allocation @refreshCustData="refreshCustData" :editStatus="editStatus" :fpType="fpType"
                           @fenPeiClick="fenPeiClick"
                           :custData="JSON.parse(JSON.stringify(customerBaseInfo))"></customer-allocation>
    </div>
  </div>
</template>

<script>
import {creatematerial} from "@/api/ipServiceApi.config";
import CustomerAllocation from '../../customer_allocation'
import {mapState} from 'vuex'
import {
  addCustomer,
  addCustomerYuce,
  delCustomerFile,
  delCustomerYuce,
  queryCaseTypeUrl,
  queryCountry,
  queryCustomerJituanList,
  queryCustomerNameId,
  queryCustomerUrl,
  queryCustomerYuceByCustId,
  querycustSelectClass,
  queryFiliale,
  queryIndustryUrl,
  queryUserByPermissionId,
  queryUserNamesUrl,
  querywfUserNameUrl, saveCustomerYuce,
  updateCustomerNew,
  updateCustomerYuceById,
  queryCustomerActivityDesc
} from "../../../../../api/customerList"
import serviceApi from "@/api/serviceApi.config.js"
import {getProgID} from "../../../../../utils/editInOffice"
import {checkPermission, queryCustomerSource, queryReportCompany1, queryUserByRoleId} from "../../../../../api/caseList"
import Bus from '@/utils/Bus'
import {queryDeptCompany} from "@/api/feeList";

export default {
  name: "BaseInfo",
  props: {
    userIcon: {},
    examineStatusStr: {},
    isCreated: {},
    createSign: {},
    activeName: {},
    tabNo: {},
    editStatus: {},
    customerData: {},
    seletData: {},
  },
  watch: {
    userIcon(n){
      this.$set(this.customerBaseInfo, 'userIcon', n)
    },
    'YcData.customerYuceList': {
      handler(n) {
        if (n && !n.find(item => !item.domain)) {
          n.push({
            domain: '',
            billSum: '',
            ycdesc: ''
          })
        }
        if (n && n.length) {
          this.$set(this.YcData, 'amount', n && n.reduce((pre, next) => +pre + (Number.isNaN(Number(next.billSum)) ? 0 : +next.billSum), 0))
        }

        // this.YcData.amount = n.reduce((pre, next) => pre.billSum + next.billSum, 0).toFixed(2)
      },
      deep: true,
      immediate: true
    },
    activeName(n) {
      if (n && n != 1) {
        if (this.isCreated) {
          this.checkCreate()
        } else {
          this.checkEdit()
        }
      }
    },
    'sourceList': {
      handler(n) {
        if (n && n.length) {
          this.customerBaseInfo.source = this.sourceList[this.sourceList.length - 1]
          this.backData.source = this.sourceList[this.sourceList.length - 1]
        } else {
          this.customerBaseInfo.source = ''
          this.backData.source = ''
        }
      },
      immediate: true,
      deep: true
    },
    "customerBaseInfo.source":{
      handler(n) {
        if(n!==6){
          this.customerBaseInfo.activityDesc = undefined
        }
      }
    },
    customerData: {
      handler(n) {
        this.fetchData(n)
      },
      immediate: true
    },
    "customerBaseInfo.ctData": function (data, oldval) {
      this.customerBaseInfo.country = "";
      this.customerBaseInfo.province = "";
      this.customerBaseInfo.city = "";
      if (data[0]) {
        this.customerBaseInfo.country = data[0];
      }
      if (data[1]) {
        this.customerBaseInfo.province = data[1];
      }
      if (data[2]) {
        this.customerBaseInfo.city = data[2];
      }

      if (!this.customerBaseInfo.continent) {
        this.customerBaseInfo.continent = this.getcontinent(data[0]);
      }
    },
    responsiblePartner: {
      handler(n) {
        if (n.length) {
          this.cssFlag = true
        } else {
          this.cssFlag = false
        }
      },
      deep: true
    },
    highLightFlag(){
      this.checkHighLight()
    }
  },
  data() {
    const validateCtData = (rule, value, callback) => {
      if (!value || value && !value.length || value && !value.filter(Boolean).length) {
        callback(new Error("请选择区域"));
      } else {
        callback();
      }
    }
    return {
      materialList: [],
      creatematerial,
      backData: {},
      fpType: 2,
      isFenpei: false,
      jtCustList: [],
      title: '',
      YcData: {
        year: new Date().getFullYear(),
        ycId: undefined,
        customerYuceList: []
      },
      custYcView: false,
      ycList: [],
      cssFlag: false,
      customerUserIdList: [],
      moreView: false,
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
      addCustomerRequirementFileData: {
        tokenID: this.$store.getters.token,
        custId: "",
        id: "",
        indicateType: "",
        fileNames: ""
      },
      addCustomerFileUrl: serviceApi.addCustomerFile,
      addCustomerFileData: {
        tokenID: this.$store.getters.token,
        custId: "",
        fileNames: ""
      },
      sourceList: [],
      hzdisabled: true,
      // editStatus: true,
      rules: {
        fullname: [
          {
            required: true,
            trigger: "change",
            message: "请填写全称"
          }
        ],
        name: [
          {
            required: true,
            trigger: "change",
            message: "请填写简称"
          }
        ],
        ctData: [
          {
            validator: validateCtData,
            required: true,
            message: "请选择区域",
            trigger: "change"
          }
        ],
        contactLanguage: [
          {
            required: true,
            trigger: "change",
            message: "请选择沟通语言"
          }
        ],
        legalNature: [
          {
            required: true,
            trigger: "change",
            message: "请选择主体法律性质"
          }
        ],
        ownerDeptid: [
          {
            required: true,
            trigger: "change",
            message: "请选择客户所有者"
          }
        ],
        source: [
          {
            required: true,
            trigger: "change",
            message: "请选择客户来源"
          }
        ],
        activityDesc: [
          {
            required: true,
            trigger: "change",
            message: "请选择活动描述"
          }
        ],
        ourImporter: [
          {
            required: true,
            trigger: "blur",
            message: "请填写业务接洽人"
          }
        ],
        firstcaseCollitem: [
          {
            required: true,
            trigger: "blur",
            message: "请填写初始合作事项"
          }
        ],
      },
      customerBaseInfo: {},
      responsiblePartner: [],
      activityDescList:[]
    }
  },
  components: {
    CustomerAllocation
  },
  computed: {
    ...mapState({
      'rightDrawerWidth': state => state.caseInformation.rightDrawerWidth,
    }),
    isSmallWidth() {
      return this.rightDrawerWidth < 800 && this.rightDrawerWidth ? 12 : 6
    },
    highLightFlag() {
      return this.$store.state.app.highLightFlag
    },
    highLightValue() {
      return this.$store.state.app.highLightValue
    },
  },
  created() {
    Bus.$on('checkCustEdit', (cb) => {
      if (this.isCreated) {
        this.checkCreate(cb)
      } else {
        this.checkEdit(cb)
      }
    })
    if (this.customerBaseInfo.custId) {
      this.queryCustomerYuceByCustId()
    }
  },
  beforeDestroy() {
    Bus.$off('checkCustEdit')
  },
  mounted() {
    this.fetchActivityDescList()
  },
  methods: {
    changEmailConfigs(values){
      if (!values.length) {
        this.customerBaseInfo.nullValueList = ['mailConfigs']
      }else{
        this.customerBaseInfo.nullValueList = []
      }
    },
    fetchActivityDescList(text){
      queryCustomerActivityDesc({prjName:text}).then(res => {
        this.activityDescList = res.data.map(item => {
          return {
            value: item,
            label: item
          }
        })
      })
    },
    checkHighLight() {
      const valueText = this.highLightValue
      const root = document.querySelector('.cust-base');
      const treeWalker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      const allTextNodes = [];
      let currentNode = treeWalker.nextNode();
      while (currentNode) {
        allTextNodes.push(currentNode);
        currentNode = treeWalker.nextNode();
      }
      let indices = [] // 位置信息
      const ranges = allTextNodes
        .map((el) => {
          return { el, text: el.textContent.toLowerCase() };
        })
        .map(({ text, el }) => {
          let startPos = 0
          while (startPos < text.length) {
            const index = text.indexOf(valueText.toLowerCase(), startPos);
            if (index === -1) break
            indices.push({
              el,
              start: index,
              end: index + valueText.length
            });
            startPos = index + valueText.length;
          }
        });
      indices.length && this.$store.commit('app/SET_HIGHT_LIST', '基本信息')
    },
    uploadSuccess(response, file, fileList) {
      const data = response.data[0] || {}
      data.name = data.materialName
      if (!this.customerBaseInfo.materialList) {
        this.customerBaseInfo.materialList = []
      }
      this.customerBaseInfo.materialList.push(response.data[0])
      // this.materialList = JSON.parse(JSON.stringify(this.customerBaseInfo.materialList || []))
    },
    linkQiChacha() {
      if (!this.customerBaseInfo.fullname) {
        this.$message.warning('请填写用户全称！')
        return
      }
      window.open('https://www.qcc.com/web/search?key=' + this.customerBaseInfo.fullname)
    },
    linkBaidu() {
      if (!this.customerBaseInfo.fullname) {
        this.$message.warning('请填写用户全称！')
        return
      }
      window.open('https://www.baidu.com/s?ie=UTF-8&wd=' + this.customerBaseInfo.fullname)
    },
    changeReviewer(userId) {
      if (!userId) {
        this.customerBaseInfo.submissionDepartmentStr = ''
      }
      this.customerBaseInfo.submissionDepartmentStr = this.$store.getters.userList.find(item => item.userId == userId).domainName
    },
    refreshCustData() {
      Bus.$emit('updateStatics') // 更新客户列表上方目标概述
      this.queryCustomerYuceByCustId() // 更新客户信息中预测列表信息
      queryCustomerUrl({customerID: this.customerBaseInfo.custId}).then(res => { // 更新客户信息中负责人和负责工作组信息
        this.customerBaseInfo.customerResponsibleArray = res.data.customerResponsibleArray
        this.customerBaseInfo.customerFenpeiList = res.data.customerFenpeiList
      })
    },
    changeDomain(value, index) {
      if (!value) {
        this.YcData.customerYuceList.splice(index, 1)
      }
    },
    checkCreate(cb) {
      this.$confirm("当前客户尚未新建，是否新建", "提示", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning"
      }).then(async () => {
          if (this.validateForm()) {
            this.customerBaseInfo.materialList && this.customerBaseInfo.materialList.forEach(item => {
              if (typeof item.status !== 'number') {
                item.status = undefined
              }
            })
            await addCustomer({isCustomer: 1, ...this.customerBaseInfo}).then(response => {
              if (response.success) {
                this.customerBaseInfo = response.data
                if (this.customerBaseInfo.compIdStr) {
                  this.$set(this.customerBaseInfo, 'compIdArray', this.customerBaseInfo.compIdStr.split(',').map(Number))
                }
                this.backData = JSON.parse(JSON.stringify(this.customerBaseInfo))
                this.$emit('changeActiveName', this.activeName, response.data)
              } else {
                this.$message.error(response.message);
              }
              cb && cb()
            })
          } else {
            this.$emit('changeActiveName', '1')
            cb && cb()
          }
      }).catch(() => {
        this.$emit('changeActiveName', '1')
        cb && cb()
      })
    },
    checkEdit(cb) {
      // customerResponsibleArray、 customerFenpeiList不作检查
      if (this.$commonUtils.diffObj( {
        ...JSON.parse(JSON.stringify(this.backData)),
        customerResponsibleArray: [],
        customerFenpeiList: []
      }, {
        ...JSON.parse(JSON.stringify(this.customerBaseInfo)),
        customerResponsibleArray: [],
        customerFenpeiList: []
      }) && this.editStatus) {
        this.$confirm("您编辑的内容尚未保存，是否保存", "提示", {
          confirmButtonText: "是",
          cancelButtonText: "否",
          type: "warning"
        }).then(async () => {
          if (this.validateForm()) {
            await this.saveBaseInfo(true)
            cb && cb()
          }
        }).catch(async (err) => {
          this.backData = JSON.parse(JSON.stringify(this.customerBaseInfo))
          this.$emit('updateCust', false)
          cb && cb()
        })
      } else {
        cb && cb()
      }
    },
    createBaseInfo(flag, cb) {
      this.customerBaseInfo.materialList && this.customerBaseInfo.materialList.forEach(item => {
        if (typeof item.status !== 'number') {
          item.status = undefined
        }
      })
      addCustomer({isCustomer: 1, ...this.customerBaseInfo}).then(res => {
        const custInfo = res.data
        if (custInfo.compIdStr) {
          this.$set(custInfo, 'compIdArray', custInfo.compIdStr.split(',').map(Number))
        } else {
          this.$set(custInfo, 'compIdArray', [])
        }
        this.$confirm("当前客户是否提交审查？", "提示", {
          confirmButtonText: "创建并提交审查",
          cancelButtonText: "仅创建",
          distinguishCancelAndClose: true,
          type: "warning"
        }).then(() => {
          custInfo.saveAndSubmit = 2
          custInfo.materialList && custInfo.materialList.forEach(item => {
            if (typeof item.status !== 'number') {
              item.status = undefined
            }
          })
          const formData = JSON.parse(JSON.stringify(custInfo))
          !formData.pinpaiList && delete formData.pinpaiList
          !formData.customerConflicterList && delete formData.customerConflicterList
          !formData.induIdArray && delete formData.induIdArray
          !formData.principalRoleArray && delete formData.principalRoleArray
          !formData.list && delete formData.list
          !formData.responsibleUserIdArray && delete formData.responsibleUserIdArray
          !formData.manageUserIdArray && delete formData.manageUserIdArray
          !formData.createTimeArray && delete formData.createTimeArray
          !formData.customerRankingList && delete formData.customerRankingList
          !formData.customerOffercountriesList && delete formData.customerOffercountriesList
          delete formData.customerAssociates
          updateCustomerNew(formData).then(() => {
            this.$message.success('提交成功!')
            this.$emit('updateCust', true)
            cb && cb(res.data)
          })
        }).catch((action) => {
          cb && cb(res.data)
          this.$emit('updateCust', true)
        })
      })
    },
    async saveBaseInfo(flag) {
      if (this.validateForm()) {
        let saveAndSubmit
        if (this.examineStatusStr === '待提交') {
          saveAndSubmit = 2
          await this.$confirm("当前客户审查状态为“待提交”，是否确认要提交审查？", "提示", {
            confirmButtonText: "保存信息并提交审查",
            cancelButtonText: "仅保存信息",
            distinguishCancelAndClose: true,
            type: "warning"
          }).then(() => {
            saveAndSubmit = 2
          }).catch((action) => {
            saveAndSubmit = 1
          })
        }
        this.customerBaseInfo.saveAndSubmit = saveAndSubmit
        this.customerBaseInfo.materialList && this.customerBaseInfo.materialList.forEach(item => {
          if (typeof item.status !== 'number') {
            item.status = undefined
          }
        })
        const formData = JSON.parse(JSON.stringify(this.customerBaseInfo))
        !formData.pinpaiList && delete formData.pinpaiList
        !formData.customerConflicterList && delete formData.customerConflicterList
        !formData.induIdArray && delete formData.induIdArray
        !formData.principalRoleArray && delete formData.principalRoleArray
        !formData.list && delete formData.list
        !formData.responsibleUserIdArray && delete formData.responsibleUserIdArray
        !formData.manageUserIdArray && delete formData.manageUserIdArray
        !formData.createTimeArray && delete formData.createTimeArray
        !formData.customerRankingList && delete formData.customerRankingList
        !formData.customerOffercountriesList && delete formData.customerOffercountriesList
        delete formData.customerAssociates
        await updateCustomerNew(formData).then(async res => {
          this.$message.success('保存成功!')
          this.backData = JSON.parse(JSON.stringify(this.customerBaseInfo))
          await this.$emit('updateCust', flag) // 需要刷新客户列表
        })
      }
    },
    validateForm() {
      if (!this.$commonUtils.formValidate(this.$refs['postForm'])) return false
      return true
    },
    wfpDbClick() {
      if (this.$store.getters.permissions.includes(410)) {
        this.fpType = 1
        this.fenPeiClick(false)
      }
    },
    cfpDbClick() {
      if (this.$store.getters.permissions.includes(410)) {
        this.fpType = 2
        this.fenPeiClick(false)
      }
    },
    fenPeiClick(flag) {
      const obj = document.querySelector('.el-tabs__content')
      if (obj) {
        obj.scrollTop = 0
      }
      this.isFenpei = !this.isFenpei
      // flag === true && queryCustomerUrl({customerID: this.customerBaseInfo.custId}).then(res => {
      //   this.customerBaseInfo.customerResponsibleArray = res.data.customerResponsibleArray
      //   this.customerBaseInfo.customerFenpeiList = res.data.customerFenpeiList
      // })
    },
    queryCustomerYuceByCustId() {
      this.ycList = []
      queryCustomerYuceByCustId({custId: this.customerBaseInfo.custId}).then(res => {
        const dataList = res.data || []
        if (dataList.length) {
          dataList.forEach(data => {
            const item = data.customerYuceList && data.customerYuceList.length && data.customerYuceList[0] || {}
            this.ycList.push({
              ...item,
              amount: data.amount,
              customerYuceList: data.customerYuceList || [],
            })
          })
          if (this.ycList.length > 1) {
            this.ycList = this.ycList.sort((a, b) => b.year - a.year)
          }
        }
      })
    },
    submitYcData() {
      this.YcData.custId = this.customerBaseInfo.custId
      this.YcData.customerYuceList.forEach(item => {
        item.year = this.YcData.year
      })
      saveCustomerYuce({
        custId: this.YcData.custId,
        customerYuceList: this.YcData.customerYuceList.filter(item => item.domain)
      }).then(res => {
        this.$message.success(this.title + '成功!')
        this.closeYcDialog(true)
      })
      // if (this.title === '新建') {
      //   addCustomerYuce(this.YcData).then(res => {
      //     this.$message.success('新建成功!')
      //     this.closeYcDialog(true)
      //   })
      // } else if (this.title === '修改') {
      //   updateCustomerYuceById(this.YcData).then(res => {
      //     this.$message.success('修改成功')
      //     this.closeYcDialog(true)
      //   })
      // } else {
      //   this.closeYcDialog(false)
      // }
    },
    closeYcDialog(isSearch) {
      isSearch === true && this.queryCustomerYuceByCustId()
      this.custYcView = false
      this.YcData = {
        year: new Date().getFullYear(),
        ycId: undefined,
        customerYuceList: []
      }
      this.title = ''
      isSearch === true && Bus.$emit('updateStatics')
      this.$emit('changeMask', {type: 'del', value: this.tabNo})
    },
    rowDbClick(row) {
      this.$emit('changeMask', {type: 'add', value: this.tabNo})
      if (row.year != new Date().getFullYear()) {
        this.title = '查看'
        this.custYcView = true
        this.YcData = JSON.parse(JSON.stringify(row))
      } else {
        if (this.editStatus) {
          this.title = '修改'
          this.custYcView = true
          this.YcData = JSON.parse(JSON.stringify(row))
        } else {
          this.title = '查看'
          this.custYcView = true
          this.YcData = JSON.parse(JSON.stringify(row))
        }
      }
    },
    addYc() {
      this.$emit('changeMask', {type: 'add', value: this.tabNo})
      this.title = '新建'
      this.custYcView = true
      this.YcData = {
        year: new Date().getFullYear(),
        amount: 0,
        customerYuceList: []
      }
    },
    delYc(row, index) {
      this.$confirm("确定删除这条预算?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        delCustomerYuce({ycId: row.ycId}).then(res => {
          // this.queryCustomerYuceByCustId()
          this.$message.success('删除成功!')
          this.ycList.splice(index, 1)
        })
      }).catch(() => {

      })
    },
    updateYc(row) {
      updateCustomerYuceById(row)
    },
    changeCustomerUserIdList() {
      this.customerBaseInfo.customerResponsibleArray = this.customerUserIdList.map(item => ({
        userId: item,
        userDomains: this.customerBaseInfo.customerResponsibleArray.find(i => i.userId == item) ? this.customerBaseInfo.customerResponsibleArray.find(i => i.userId == item)['userDomains'] : [],
        principalRole: this.customerBaseInfo.customerResponsibleArray.find(i => i.userId == item) ? this.customerBaseInfo.customerResponsibleArray.find(i => i.userId == item)['principalRole'] : []
      }))
    },
    filterMethod(text) {
      if (text == '') {
        this.responsiblePartner = this.responsibleList.filter(item => this.customerBaseInfo.customerResponsibleArray.map(itm => itm.userId).includes(item.userId))
        return
      }
      let list = [...this.responsibleList.filter(item => this.customerBaseInfo.customerResponsibleArray.map(itm => itm.userId).includes(item.userId)), ...this.responsibleList.filter(item => item.fullname.includes(text))]
      this.responsiblePartner = this.$commonUtils.unique(list, 'userId')
    },
    fetchData(n) {
      this.moreView = false
      this.customerBaseInfo = JSON.parse(JSON.stringify(n || {}))
      if (this.customerBaseInfo.compIdStr) {
        this.$set(this.customerBaseInfo, 'compIdArray', this.customerBaseInfo.compIdStr.split(',').map(Number))
      }
      this.materialList = JSON.parse(JSON.stringify(this.customerBaseInfo.materialList || []))
      if (this.customerBaseInfo.jtName) {
        this.remotepaternalUnit1(this.customerBaseInfo.jtName)
      }
      if (this.customerBaseInfo.customerIndustrys && this.customerBaseInfo.customerIndustrys.length) {
        this.customerBaseInfo.customerIndustrys.forEach(item => {
          if (item.customerTags && item.customerTags.length) {
            item.customerTags = item.customerTags.map(itm => itm.tagName)
          }
        })
      }
      this.customerUserIdList = this.customerBaseInfo.customerResponsibleArray && this.customerBaseInfo.customerResponsibleArray.map(item => {
        if (!item.userDomains) {
          item.userDomains = []
        }
        return item.userId
      })
      queryUserByRoleId({roleId: '2049'}).then(res => {
        this.responsibleList = res.data
        this.responsiblePartner = this.responsibleList.filter(item => this.customerBaseInfo.customerResponsibleArray.map(itm => itm.userId).includes(item.userId))
      })
      // this.customerBaseInfo.materialList && this.customerBaseInfo.materialList.forEach(item => item.url = 'ipdoc' + item.url)
      this.$set(this.customerBaseInfo, "ctData", [])
      this.customerBaseInfo.ctData = [
        this.customerBaseInfo.country,
        this.customerBaseInfo.province,
        this.customerBaseInfo.city
      ]
      if (this.customerBaseInfo.isCurStatus == "1") {
        this.hzdisabled = false
      } else {
        this.hzdisabled = true
      }
      if (this.customerBaseInfo.parentCustId) {
        queryCustomerNameId({
          isCustomer: "1",
          custId: this.customerBaseInfo.parentCustId
        }).then(response => {
          this.seletData.paternalUnit = response.data
        })
      }
      if (this.customerBaseInfo.userIcon) {
        this.userIconCust = `/ipdoc${this.customerBaseInfo.userIcon}`
      }
      this.getAllSelectData()
      // 这里删掉无用的数组，否则接口报错400
      delete this.customerBaseInfo.conflicters
      delete this.customerBaseInfo.agencyContacts
      delete this.customerBaseInfo.customerAddrs
      delete this.customerBaseInfo.customerContacts
      delete this.customerBaseInfo.activities
      delete this.customerBaseInfo.customerRequirements
      delete this.customerBaseInfo.bankaccounts
      delete this.customerBaseInfo.customerIndustrys
      this.queryCustomerSource()
      this.backData = JSON.parse(JSON.stringify(this.customerBaseInfo))
    },
    getcontinent(item) {
      var newItem
      this.seletData.ctDataOption.forEach(element => {
        if (element.value == item) {
          newItem = element.continentCn
          return
        }
      })
      return newItem
    },
    // 获取各个select数据
    getAllSelectData() {
      querycustSelectClass({classId: "1129,1042,1,1044,1053,1045,1076,1050,1049,1051,1052,1112,1063,5,4,1156"}).then(response => {
        if (response.success) {
          this.seletData.comLanguage = response.data["1129"]
          this.seletData.hzzt = response.data["5"]
          this.seletData.mainLegalNature = response.data["1042"]
          // this.seletData.customerSource = response.data["1"]
          this.seletData.statu = response.data["1044"]
          this.seletData.sex = response.data["1053"]
          this.seletData.lxstatu = response.data["1045"]
          this.seletData.called = response.data["1076"]
          this.seletData.hdstatu = response.data["1050"]
          this.seletData.hdtype = response.data["1049"]
          this.seletData.hdfs = response.data["1051"]
          this.seletData.zdfs = response.data["1052"]
          this.seletData.ywstuta = response.data["1112"]
          this.seletData.roleMessage = response.data["1063"]
          this.seletData.gradeList = response.data["4"]
          this.seletData.roles = response.data["1156"]
        } else {
          this.$message.error(response.message)
        }
      })
      queryIndustryUrl().then(response => {
        if (response.success) {
          this.seletData.industry = response.data
        } else {
          this.$message.error(response.message)
        }
      })

      querywfUserNameUrl().then(response => {
        if (response.success) {
          this.seletData.wfuserNames = response.data
        } else {
          this.$message.error(response.message)
        }
      })
      queryCaseTypeUrl().then(response => {
        if (response.success) {
          this.seletData.caseType = response.data
        } else {
          this.$message.error(response.message)
        }
      })
      queryDeptCompany({pageSize: 9999}).then(response => {
        if (response.success) {
          this.seletData.customerOwner = response.data
        } else {
          this.$message.error(response.message)
        }
      })
      queryUserNamesUrl().then(response => {
        if (response.success) {
          this.seletData.userNames = response.data.users
        } else {
          this.$message.error(response.message)
        }
      })

      queryCountry().then(response => {
        if (response.success) {
          this.seletData.ctDataOption = response.data
          this.customerBaseInfo.continent = this.getcontinent(this.customerBaseInfo.ctData[0])
        } else {
          this.$message.error(response.message)
        }
      })
      // queryUserByPermissionId({permissionId: "61"}).then(response => {
      //   if (response.success) {
      //     this.seletData.censor = response.data
      //   } else {
      //     this.$message.error(response.message)
      //   }
      // })
      queryUserByRoleId({roleId: '2049,1'}).then(res => {
        this.seletData.managementCommitteePartner = res.data
      })
    },
    queryCustomerSource() {
      queryCustomerSource().then(res => {
        this.seletData.customerSource = res.data
        this.sourceList = this.$commonUtils.getTwoDimensionalArray(this.seletData.customerSource, 'id', this.customerBaseInfo.source, {
          children: 'childrens',
          parent: 'parentId'
        })
      })
    },
    brforeRemoveFile(file, type) {
      let delmaterialId
      if (file.response) {
        delmaterialId = file.response.data[0].materialId
      } else {
        delmaterialId = file.materialId
      }
      if (!file.response) {
        delCustomerFile({materialId: delmaterialId}).then(res => {
          this.$message.success('文件删除成功!')
          this.customerBaseInfo.materialList.splice(this.customerBaseInfo.materialList.findIndex(item => item.materialId == delmaterialId), 1)
          // this.materialList = JSON.parse(JSON.stringify(this.customerBaseInfo.materialList || []))
        })
      } else {
        this.$message.success('文件删除成功!')
        this.customerBaseInfo.materialList.splice(this.customerBaseInfo.materialList.findIndex(item => item.materialId == delmaterialId), 1)
      }
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
      if (data.raw) {
        data = data.response.data[0]
      }
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
          window.open(`#/preView?address=ipdoc${url}&${flag}=${data[flag]}`.replace(/[+]/g, '%2B'))
        }
      } else if (['pdf', 'jpg', 'png'].some(item => url.replace(/.+\./, "").toLocaleLowerCase() == item)) {
        window.open(`/ipdoc${url}`.replace(/[+]/g, '%2B'))
      } else {
        this.downLoad(data)
      }
    },
    handlePreview(file) {

      this.addCustomerFileData.materialTypeId = 301625

      this.addCustomerFileData.fileNames = file.name.substr(
        0,
        file.name.lastIndexOf(".")
      )
    },
    remotepaternalUnit(query) {
      if (query !== "") {
        queryCustomerNameId({keyword: query, isCustomer: "1"}).then(
          response => {
            if (response.success) {
              this.seletData.paternalUnit = response.data
            } else {
              this.$message.error(response.message)
            }
          }
        )
      }
    },
    remotepaternalUnit1(query) {
      if (query !== "") {
        queryCustomerJituanList({jtName: query, pageSize: 100}).then(
          response => {
            if (response.success) {
              this.jtCustList = response.data
            } else {
              this.$message.error(response.message)
            }
          }
        )
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.cust-base {
  position: relative;
  /*padding: 10px 15px;*/

  .base-info, .header-info, .budget-info {
    background-color: #fff;
    padding: 10px 15px;

    .base-header {
      display: flex;
      align-items: center;

      .left-line {
        display: inline-block;
        width: 10px;
        height: 26px;
        background-color: #409EFF;
        margin-right: 10px;
      }

      .right-text {
        font-weight: bold;
      }
    }
  }

  .header-info, .budget-info {
    margin-top: 15px;
  }
}

.el-form {
  .el-form-item {
    margin-bottom: 0;

    > > > .el-form-item__label {
      text-align: right;
      /*padding-left: 32px;*/
      font-weight: normal;
      font-size: 14px;
      color: #7F7F7F;
    }
  }
}

> > > .el-select, > > > .el-cascader {
  width: 100%;

  .el-cascader__label {
    padding-left: 0;
    font-size: 14px;
    color: #000000;
  }

  .el-input.is-focus .el-input__inner {
    border-radius: 0;
    border-color: #fff;
    border-bottom: 1px solid #f2f2f2;
  }
}

.edit-border {
  /deep/ .el-input__inner {
    border: 1px solid #fff;
    font-size: 14px;
    color: #000000;
    padding-left: 0;

    &:hover {
      border-radius: 0;
      border-bottom: 1px solid #f2f2f2;
    }
  }
}

.date-border {
  /deep/ .el-input__inner {
    border: 1px solid #fff;
    font-size: 14px;
    color: #000000;
    /*padding-left: 0;*/

    &:hover {
      border-radius: 0;
      border-bottom: 1px solid #f2f2f2;
    }
  }
}

> > > .header-table {
  margin-top: 10px;
  padding: 0 15px;
  margin-bottom: 15px;

  .el-table__header-wrapper {
    border: 1px solid #EBEEF5;
    border-bottom: none;

    th {
      background-color: #FAFAFA;
      font-size: 16px;
      color: #555555;
      font-weight: normal;
    }
  }
}

.box-border {
  border: 1px solid #D7D7D7;
  padding: 10px 10px 5px 10px;
}

.form-container {

  /deep/ .el-row {
    margin: 0 0 5px 0;
    display: flex;
  }

  /deep/ .postInfo-container-item {
    height: 100%;
    width: 100%;

    .el-row {
      border: none;
    }
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

> > > .el-select, > > > .el-cascader {
  width: 100%;

  .el-cascader__label {
    padding-left: 0;
    font-size: 14px;
    color: #000000;
  }

  .el-input.is-focus .el-input__inner {
    border-radius: 0;
    border-color: #fff;
    border-bottom: 1px solid #f2f2f2;
  }
}

.edit-border {
  /deep/ .el-input__inner {
    border: 1px solid #fff;
    font-size: 14px;
    color: #000000;
    padding-left: 0;

    &:hover {
      border-radius: 0;
      border-bottom: 1px solid #f2f2f2;
    }
  }
}

.date-border {
  /deep/ .el-input__prefix {
    left: -5px;
  }

  /deep/ .el-input__inner {
    border: 1px solid #fff;
    font-size: 14px;
    color: #000000;
    padding-left: 20px;

    &:hover {
      border-radius: 0;
      border-bottom: 1px solid #f2f2f2;
    }
  }
}

> > > .el-dialog__body {
  padding-top: 0;
}

.abow_dialog {
  position: fixed;
  left: 35%;
  bottom: 5%;
  top: unset;
}

> > > .el-form-item__error {
  /*position: relative !important;*/
  top: 70% !important;
}

.linkSpan {
  background-color: #E6EFFB;
  font-size: 12px;
  border-radius: 25px;
  padding: 4px 6px;
  border: 1px solid #E3E5EB;
  cursor: pointer;
  display: inline-block;
  /*color: ;*/
}
.question {
  cursor: pointer;
}
</style>
