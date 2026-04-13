<template>
  <div class="createPost-container">

    <el-form ref="postForm" :model="postForm" :rules="rules" size="mini" class="form-container">
      <div class="createPost-main-container">
        <div class="form-con">
          <el-row v-if="!isBillEdit">
            <el-col class="tilteSpan" :span="24">
              <span id='jbxx-title'>基本信息</span>
            </el-col>
          </el-row>

          <el-row>
            <el-col class="form-con-item" :span="!isBillEdit?22:24">

              <el-row v-if="!isBillEdit" class="form-border">
                <el-col :span="12">
                  <el-row>
                    <el-col :span="24">
                      <el-form-item label="编码:" class="postInfo-container-item">
                        <el-input v-model="postForm.code" :disabled="true"></el-input>
                      </el-form-item>
                    </el-col>

                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item label="简称:" prop="name" class="postInfo-container-item">
                        <el-popover :value='popoverShow' class="inputshow" ref="popover4" placement="bottom" width="600" trigger="click">
                          <el-table size="mini" :data="gridData" style='height:250px'>
                            <el-table-column align="left" width="" property="name" label="简称"></el-table-column>
                            <el-table-column align="left" width="" property="fullname" label="中文名称/全称"></el-table-column>
                            <el-table-column align="left" width="" property="fullnameEn" label="英文名称"></el-table-column>
                            <el-table-column align="left" width="" property="fgFullname" label="外文全称"></el-table-column>
                          </el-table>
                        </el-popover>
                        <el-input v-popover:popover4 v-model="postForm.name" @input="nameChangeinput"></el-input>

                      </el-form-item>
                    </el-col>

                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item label="中文名称/全称:" prop="fullname" class="">
                        <el-input v-model="postForm.fullname" @blur='creatLsCust("postForm")'></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item label="英文名称:" class="postInfo-container-item">
                        <el-input v-model="postForm.fullnameEn"></el-input>
                      </el-form-item>
                    </el-col>

                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item label="外文全称:" class="postInfo-container-item">
                        <el-input v-model="postForm.fgFullname"></el-input>
                      </el-form-item>
                    </el-col>

                  </el-row>

                </el-col>
                <el-col :span="12">
                  <el-row>
                    <el-col :span="24">
                      <el-form-item label="照片" class="postInfo-container-item avatar-uploader">
                        <div style="display: flex; flex-direction: column">
                          <div style="flex: 1">
                            <el-upload :action='userIconUrl' ref='userIconupload' :data='usericonSendData' :on-success='iconSendSuccess' accept="image/jpeg,image/gif,image/png"
                                       :before-upload="onBeforeUploadIcon" :show-file-list="false" :auto-upload='false' name='file' :on-change="handleAvatarChange">
                              <div v-if="postForm.userIcon && !iconIsDel" style="position: relative" @mouseenter="showDelIcon" @mouseleave="hideDelIcon" >
                                <img :src="userIconCust" class="avatar">
                                <div @click.stop="btnDelete()" class="mask" v-show="isShow"
                                     style="position:absolute; bottom: 0px; background-color: #000; opacity: 0.8; height: 20px; width: 100%">
                                  <i class="el-icon-delete" style="position:absolute; bottom: 3px; color: #fff;" ></i>
                                </div>
                              </div>
                              <i v-else="!postForm.userIcon" class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                          </div>
                        </div>
                      </el-form-item>
                    </el-col>
                  </el-row>

                </el-col>
              </el-row>
              <el-row v-if="!isBillEdit" class="form-border">
                <el-col :span="24">
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="客户负责人:" prop="customerResponsibleArray" class="postInfo-container-item">
                        <template>
                          <el-select :popper-append-to-body="false" :popper-class="!cssFlag?'customerResponsible':'text_left'" default-first-option :clearable='true' multiple  placeholder="请选择" v-model="customerUserIdList"  filterable :filter-method="filterMethod" @change="changeCustomerUserIdList" >
                            <el-option v-for="item in responsiblePartner" :key="item.userId" :label="item.fullname" :value="item.userId">
                              <UserIconAndUserName :user-id="item.userId"></UserIconAndUserName>
                            </el-option>
                          </el-select>
                        </template>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">

                      <el-form-item label="客户协调人:" class="postInfo-container-item">
                        <el-select default-first-option :clearable='true' placeholder="请选择" multiple  v-model="postForm.customerManageArray" filterable >
                          <el-option v-for="item in managementCommitteePartner.filter(i => !!i)" :key="item.userId" :label="item.fullname" :value="item.userId">
                            <UserIconAndUserName :user-id="item.userId"></UserIconAndUserName>
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row class="fullRow">
                    <el-col :span="24">
                      <el-form-item label="客户负责人领域:" prop="custGrade" class="postInfo-container-item">
                        <el-table
                          ref="customerResponsibleArray"
                          :data="postForm.customerResponsibleArray"
                          border
                          style="width: 85%">
                        <el-table-column

                          label="负责人"
                          >
                          <template slot-scope="scope">
                            {{$commonUtils.transformation(responsiblePartner,scope.row.userId,'userId','fullname')}}
                          </template>
                        </el-table-column>
                          <el-table-column

                            label="领域"
                           >
                            <template slot-scope="scope">
                              <el-select default-first-option  :clearable='true' placeholder="请选择" multiple  v-model="scope.row.userDomains" filterable >
                                <el-option v-for="item in ['商标申请','商标诉讼','专利申请','专利诉讼','调查保护', '著作权', '域名', '其他']" :key="item" :label="item" :value="item">
                                </el-option>
                              </el-select>
                            </template>
                          </el-table-column>
                          <el-table-column

                          label="角色"
                          >
                          <template slot-scope="scope">
                            <el-select default-first-option :clearable='true' placeholder="请选择" v-model="scope.row.principalRole" filterable>
                              <el-option v-for="item in seletData.roles" :key="item.id" :label="item.typeName" :value="item.id">
                              </el-option>
                            </el-select>
                          </template>
                        </el-table-column>
                        </el-table>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="审查报送人:" prop="customerResponsibleArray" class="postInfo-container-item">
                        <template>
                          <el-select default-first-option :clearable='true' placeholder="请选择" v-model="postForm.reviewSubmitter" filterable @change="changeReviewer">
                              <el-option v-for="item in $store.getters.userList" :key="item.userId" :label="item.fullname" :value="item.userId">
                              </el-option>
                            </el-select>
                        </template>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">

                      <el-form-item label="报送部门:" class="postInfo-container-item">
                        {{postForm.submissionDepartmentStr}}
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row class="fullRow">
                    <el-col :span="24">
                      <el-form-item label="客户等级:" prop="custGrade" class="postInfo-container-item">
                        <template>
                          <el-select default-first-option :clearable='true' placeholder="请选择" v-model="postForm.custGrade" filterable>
                            <el-option v-for="item in seletData.gradeList" :key="item.id" :label="item.typeName" :value="String(item.id)">
                            </el-option>
                          </el-select>
                        </template>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="沟通语言:" prop="contactLanguage" class="postInfo-container-item">
                        <template>
                          <el-select default-first-option :clearable='true' placeholder="请选择" v-model="postForm.contactLanguage" @change='creatLsCust("postForm")' filterable>
                            <el-option v-for="item in seletData.comLanguage" :key="String(item.id)" :label="item.typeName" :value="String(item.id)">
                            </el-option>
                          </el-select>
                        </template>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="官方机构:" class="postInfo-container-item">
                        <el-radio-group v-model="postForm.isOfficial">
                          <el-radio :label='1'>是</el-radio>
                          <el-radio :label='0'>否</el-radio>
                        </el-radio-group>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row class="">
                    <el-col :span="12">
                      <el-form-item label="合作资源:" class="postInfo-container-item">
                        <el-radio-group v-model="postForm.isCollaboration">
                          <el-radio :label='1'>是</el-radio>
                          <el-radio :label='0'>否</el-radio>
                        </el-radio-group>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="申请人:" class="postInfo-container-item">
                        <el-radio-group v-model="postForm.isApplicant">
                          <el-radio :label='1'>是</el-radio>
                          <el-radio :label='0'>否</el-radio>
                        </el-radio-group>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="初始合作事项:" class="postInfo-container-item">
                        <el-input v-model="postForm.firstcaseCollitem"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="审查号:" class="postInfo-container-item">
                        <el-input v-model="postForm.auditNo"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="正式客户时间:" class="postInfo-container-item">
                        <el-input v-model="postForm.firstcaseDate"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="父单位:" class="postInfo-container-item">
                        <template>

                          <el-select default-first-option :clearable='true' v-model="postForm.parentCustId" no-match-text='暂无数据' loading-text='正在查询' filterable remote reserve-keyword
                            placeholder="请输入关键词" :remote-method="remotepaternalUnit">
                            <el-option v-for="(item,key) in seletData.paternalUnit" :key="key" :label="item.name" :value="item.custId">
                            </el-option>
                          </el-select>
                        </template>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="事务所:" class="postInfo-container-item">
                        <el-radio-group v-model="postForm.isAgent">
                          <el-radio :label='1'>是</el-radio>
                          <el-radio :label='0'>否</el-radio>
                        </el-radio-group>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row class="fullRow">
                    <el-col :span="24">
                      <el-form-item label="主体法律性质:" prop="legalNature" class="postInfo-container-item">
                        <template>
                          <el-select default-first-option :clearable='true' placeholder="请选择" v-model="postForm.legalNature" @change='creatLsCust("postForm")' filterable>
                            <el-option v-for="item in seletData.mainLegalNature" :key="item.id" :label="item.typeName" :value="item.id">
                            </el-option>
                          </el-select>
                        </template>
                      </el-form-item>

                    </el-col>

                  </el-row>
                  <el-row class="fullRow">
                    <el-col :span="24">
                      <el-form-item label="合作状态:" class="postInfo-container-item">
                        <el-select :disabled="hzdisabled" default-first-option :clearable='true' placeholder="请选择" v-model="postForm.curStatus" filterable>
                          <el-option v-for="item in seletData.hzzt" :key="item.id" :label="item.typeName" :value="String(item.id)">
                          </el-option>
                        </el-select>
                      </el-form-item>

                    </el-col>
                  </el-row>
                  <el-row class="fullRow">
                    <el-col :span="24">
                      <el-form-item label="状态说明:" class="postInfo-container-item">
                        <template>
                          <el-input v-model="postForm.curStatusDesc"></el-input>
                        </template>
                      </el-form-item>

                    </el-col>
                  </el-row>
                  <el-row v-if="postForm.legalNature=='1195'">
                    <el-col :span="12">
                      <el-form-item label="证件种类:" class="postInfo-container-item">
                        <el-radio-group v-model="postForm.certType">
                          <el-radio label="护照号"></el-radio>
                          <el-radio label="身份证号"></el-radio>
                        </el-radio-group>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="证件号码:" class="postInfo-container-item">
                        <template>
                          <el-input v-model="postForm.idNumber"></el-input>
                        </template>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row class="">
                    <el-col :span="12">
                      <el-form-item label="客户信用等级:" class="postInfo-container-item">
                        <template>
                          <el-input :disabled="true" v-model="postForm.level"></el-input>
                        </template>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="活跃程度:" class="postInfo-container-item">
                        <template>
                          <el-input v-model="postForm.actLevel"></el-input>
                        </template>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="客户来源:" prop="source" class="postInfo-container-item postInfoleft" >
                        <el-cascader
                          v-model="sourceList"
                          :options="seletData.customerSource"
                          :props="{children:'childrens',label:'sourceName',value:'id'}"
                          @change="creatLsCust('postForm')"
                          filterable>
                        </el-cascader>
<!--                        <template>-->
<!--                          -->
<!--                          <el-select default-first-option :clearable='true' placeholder="请选择" v-model="postForm.source" @change='creatLsCust("postForm")' filterable>-->
<!--                            <el-option v-for="item in seletData.customerSource" :key="item.id" :label="item.typeName" :value="item.id">-->
<!--                            </el-option>-->
<!--                          </el-select>-->
<!--                        </template>-->
                      </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="postForm.legalNature!='1195'">
                      <el-form-item label="统一社会信用代码:" class="postInfo-container-item">
                        <template>
                          <el-input v-model="postForm.certCode"></el-input>
                        </template>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row class="fullRow">
                    <el-form-item label="客户来源说明:" class="postInfo-container-item uploader-custfile">
                      <el-input type="textarea" v-model="postForm.sourceExplain"></el-input>
                    </el-form-item>
                  </el-row>
                  <el-row class="">
                    <el-col :span="8">
                      <el-form-item label="客户介绍人:" class="postInfo-container-item">
                        <template>
                          <el-input v-model="postForm.custIntroductor"></el-input>
                        </template>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="客户介绍人单位:" class="postInfo-container-item">
                        <template>
                          <el-input v-model="postForm.custIntroCompany"></el-input>
                        </template>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="客户所有者:" prop="ownerDeptid" class="postInfo-container-item">
                        <template>
                          <el-select default-first-option :clearable='true' placeholder="请选择" v-model="postForm.ownerDeptid" @change='creatLsCust("postForm")' filterable>
                            <el-option v-for="item in seletData.customerOwner" :key="item.deptId" :label="item.companyName" :value="item.deptId">
                            </el-option>
                          </el-select>
                        </template>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row class="fullRow">
                    <el-col :span="24">
                      <el-form-item label="业务接洽人:" class="postInfo-container-item">
                        <template>
                          <el-input v-model="postForm.ourImporter"></el-input>
                        </template>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="财务年度结算日期:" class="postInfo-container-item">
                        <template>
                          <el-input v-model="postForm.annualAccDate"></el-input>
                        </template>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="初始来案案型:" class="postInfo-container-item">
                        <template>
                          <el-input v-model="postForm.caseType"></el-input>
                        </template>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row class="fullRow ">
                    <el-col :span="24">
                      <el-form-item label="国家/省份/城市:" prop="ctData" @change='creatLsCust("postForm")' class="postInfoleft">
                        <template>
                          <el-cascader clearable change-on-select style="width:41%" @change='creatLsCust("postForm")' placeholder="" v-model="postForm.ctData" :options="seletData.ctDataOption"
                            filterable>
                          </el-cascader>

                        </template>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row class="fullRow">
                    <el-col :span="24">
                      <el-form-item label="大洲:" class="postInfo-container-item">
                        <template>
                          <el-input :disabled="true" v-model="postForm.continent"></el-input>
                        </template>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="官网网址:" class="postInfo-container-item">
                        <template>
                          <el-input v-model="postForm.website"></el-input>
                        </template>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="传真:" class="postInfo-container-item">
                        <template>
                          <el-input v-model="postForm.fax1"></el-input>
                        </template>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="电话:" class="postInfo-container-item">
                        <template>
                          <el-input v-model="postForm.phone"></el-input>
                        </template>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="电子邮件:" class="postInfo-container-item">
                        <template>
                          <el-input v-model="postForm.email"></el-input>
                        </template>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row class="fullRow">
                    <el-form-item label="简介:" class="postInfo-container-item uploader-custfile">
                      <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="postForm.info">
                      </el-input>
                    </el-form-item>
                  </el-row>
                  <el-row class="fullRow">
                    <el-col :span="24">

                      <el-form-item label="客户文档:" class="postInfo-container-item uploader-custfile">
                        <template>
                          <el-upload class="upload-demo"
                                     name="custFile"
                                     :data='addCustomerFileData'
                                     ref="uploadCustFile"
                                     :action="addCustomerFileUrl"
                                     :before-upload="handlePreview"
                                     :on-preview="preview"
                                     :before-remove="(file)=>brforeRemoveFile(file,'cust')"
                                     :file-list="postForm.materialList"
                          >
                            <el-button size="small" type="primary">上传</el-button>
                          </el-upload>
                        </template>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row class="fullRow">
                    <el-col :span="24">

                      <el-form-item label="备注:" class="postInfo-container-item uploader-custfile">
                        <template>
                          <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="postForm.memo">
                          </el-input>
                        </template>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="建档日期:" class="postInfo-container-item">
                        <template>
                          <el-date-picker v-model="postForm.createTime" format='yyyy-MM-dd' value-format="yyyy-MM-dd" align="right" type="date" placeholder="选择日期" :picker-options="pickerOptions">
                          </el-date-picker>
                        </template>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="建档人:" class="postInfo-container-item">
                        <!-- <template>
                          <el-input v-model="postForm.createUserName"></el-input>
                        </template> -->
                        <template>
                          <el-input :disabled="true" v-model="postForm.createUserName"></el-input>
                        </template>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="审查日期:" class="postInfo-container-item">
                        <template>
                          <el-date-picker v-model="postForm.auditDate" format='yyyy-MM-dd' value-format="yyyy-MM-dd" align="right" type="date" placeholder="选择日期" :picker-options="pickerOptions">
                          </el-date-picker>
                        </template>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="审查人:" class="postInfo-container-item">

                        <template>
                          <el-select default-first-option :clearable='true' placeholder="请选择" v-model="postForm.auditUserName" filterable>
                            <el-option v-for="item in seletData.censor" :key="item.userId" :label="item.fullname" :value="item.userId">
<!--                              <UserIconAndUserName :user-id="item.userId"></UserIconAndUserName>-->
                            </el-option>
                          </el-select>
                        </template>

                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row class="fullRow">
                    <el-col :span="24">
                      <el-form-item label="邮件配置:" class="postInfo-container-item">
                        <template>

                          <el-checkbox-group v-model="postForm.mailConfigs">
                            <el-checkbox :label="1">续展提醒</el-checkbox>
                            <el-checkbox :label="2">初审公告提醒</el-checkbox>
                            <el-checkbox :label="3">送达公告提醒</el-checkbox>
                          </el-checkbox-group>
                        </template>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
              <el-row>
                <el-col class="tilteSpan" :span="24">
                  <span id='khdz-title'>客户地址</span>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24" style='text-align:right'>
                  <el-button type="primary" size="mini" @click="addFormShow('addr')">添加
                  </el-button>
                  <el-button v-if="postForm.customerAddrs.length>3" type="primary" size="mini" @click="allMessageFormShow('addr')">全部
                  </el-button>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-table size="mini" :data="postForm.customerAddrs.filter((item,index)=>index<=2)" border fit empty-text="暂无数据" highlight-current-row current-row-key style="width: 100%;">
                    <el-table-column type="index" width="50" label="序号" align="left"></el-table-column>
                    <el-table-column label="信函抬头" align="left" width>
                      <template slot-scope="scope">
                        <span>{{ scope.row.title }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="大洲" align="left" width>
                      <template slot-scope="scope">
                        <span>{{ scope.row.continent }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="国家" align="left" width>
                      <template slot-scope="scope">
                        <span>{{ scope.row.country }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="州省份" align="left" width>
                      <template slot-scope="scope">
                        <span>{{ scope.row.province }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="城市" align="left" width>
                      <template slot-scope="scope">
                        <span>{{ scope.row.city }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="中文地址" align="left" width>
                      <template slot-scope="scope">
                        <span>{{ scope.row.addressCn }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="英文地址" align="left" width>
                      <template slot-scope="scope">
                        <span>{{ scope.row.addressEn }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="邮编" align="left" width>
                      <template slot-scope="scope">
                        <span>{{ scope.row.post }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="状态" align="left" width>
                      <template slot-scope="scope">
                        <span>{{ scope.row.statusStr }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="备注" align="left" width>
                      <template slot-scope="scope">
                        <span>{{ scope.row.memo }}</span>
                      </template>
                    </el-table-column>

                    <el-table-column label="操作" align="left" width="" class-name="small-padding fixed-width">
                      <template slot-scope="scope">

                        <el-button size="mini" type="text" @click="custAddrupdata(scope.row,'addr', true)">查看</el-button>
                        <el-button size="mini" type="text" @click="custAddrupdata(scope.row,'addr')">修改</el-button>
                        <el-button v-if="!isBillEdit" size="mini" type="text" @click="custAddrdel(scope.row,scope.$index,'addr')">删除</el-button>

                      </template>
                    </el-table-column>
                  </el-table>
                </el-col>
              </el-row>
              <el-row>
                <el-col class="tilteSpan" :span="24">
                  <span id='dflxr-title'>对方联系人</span>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24" class="" style='text-align:right'>
                  <el-button type="primary" size="mini" @click="addFormShow('dfcon')">添加
                  </el-button>
                  <el-button v-if="postForm.customerContacts.length>3" type="primary" size="mini" @click="allMessageFormShow('dfcon')">全部
                  </el-button>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-table size="mini" :data="postForm.customerContacts.filter((item,index)=>index<=2)" border fit empty-text="暂无数据" highlight-current-row current-row-key style="width: 100%;">

                    <el-table-column label="姓名" align="left" width>
                      <template slot-scope="scope">
                        <span>{{ scope.row.name }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="职务" align="left" width>
                      <template slot-scope="scope">
                        <span>{{ scope.row.jobtitle }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="部门" align="left" width>
                      <template slot-scope="scope">
                        <span>{{ scope.row.department }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="办公电话" align="left" width>
                      <template slot-scope="scope">
                        <span>{{ scope.row.tel }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="邮箱" align="left" width>
                      <template slot-scope="scope">
                        <span>{{ scope.row.email }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="状态" align="left" width>
                      <template slot-scope="scope">
                        <span>{{ scope.row.statusStr }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="启用" align="left" width>
                      <template slot-scope="scope">
                        <span>{{ scope.row.sysStatusStr }}</span>
                      </template>
                    </el-table-column>

                    <el-table-column label="操作" align="left" width="" class-name="small-padding fixed-width">
                      <template slot-scope="scope">

                        <el-button size="mini" type="text" @click="custAddrupdata(scope.row,'dfcon', true)">查看</el-button>
                        <el-button size="mini" type="text" @click="custAddrupdata(scope.row,'dfcon')">修改</el-button>
                        <el-button v-if="!isBillEdit" size="mini" type="text" @click="custAddrdel(scope.row,scope.$index,'dfcon')">删除</el-button>

                      </template>
                    </el-table-column>
                  </el-table>
                </el-col>
              </el-row>
              <div v-if="!isBillEdit">
                <el-row>
                  <el-col class="tilteSpan" :span="24">
                    <span id='khhd-title'>客户--活动</span>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24" style='text-align:right'>
                    <el-button v-if="$store.getters.permissions.includes(71)" type="primary" size="mini" @click="addFormShow('hd')">添加
                    </el-button>
                    <el-button v-if="postForm.activities.length>3" type="primary" size="mini" @click="allMessageFormShow('hd')">全部
                    </el-button>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-table size="mini" :data="postForm.activities.filter((item,index)=>index<=2)" border fit empty-text="暂无数据" highlight-current-row current-row-key style="width: 100%;">
                      <el-table-column type="index" width="50" label="序号" align="left"></el-table-column>
                      <el-table-column label="主题" align="left" width>
                        <template slot-scope="scope">
                          <span>{{ scope.row.subject }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column label="开始时间" align="left" width>
                        <template slot-scope="scope">
                          <span>{{ scope.row.begindate }}</span>
                        </template>
                      </el-table-column>
                      <!-- <el-table-column label="对方联系人" align="left" width>
                      <template slot-scope="scope">
                        <span>{{ scope.row.customerContactActs[0].custContactName }}</span>
                      </template>
                    </el-table-column> -->
                      <el-table-column label="赠送礼品" align="left" width>
                        <template slot-scope="scope">
                          <span>{{ scope.row.putGift }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column label="内容描述" align="left" width>
                        <template slot-scope="scope">
                          <span>{{ scope.row.description }}</span>
                        </template>
                      </el-table-column>

                      <el-table-column label="操作" align="left" width="" class-name="small-padding fixed-width">
                        <template slot-scope="scope">

                          <el-button size="mini" type="text" @click="custAddrupdata(scope.row,'hd', true)">查看</el-button>
                          <el-button size="mini" type="text" @click="custAddrupdata(scope.row,'hd')">修改</el-button>
                          <el-button size="mini" type="text" @click="custAddrdel(scope.row,scope.$index,'hd')">删除</el-button>

                        </template>
                      </el-table-column>
                    </el-table>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col class="tilteSpan" :span="24">
                    <span id='wflxr-title'>我方联系人</span>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24" style='text-align:right'>
                    <el-button type="primary" size="mini" @click="addFormShow('wfcon')">添加
                    </el-button>
                    <el-button v-if="postForm.agencyContacts.length>3" type="primary" size="mini" @click="allMessageFormShow('wfcon')">全部
                    </el-button>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-table size="mini" :data="postForm.agencyContacts.filter((item,index)=>index<=2)" border fit empty-text="暂无数据" highlight-current-row current-row-key style="width: 100%;">
                      <el-table-column type="index" width="50" label="序号" align="left"></el-table-column>
                      <el-table-column label="姓名" align="left" width>
                        <template slot-scope="scope">
                          <span>{{ scope.row.fullname }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column label="业务领域" align="left" width>
                        <template slot-scope="scope">
                          <span>{{ scope.row.business }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column label="案件类型" align="left" width>
                        <template slot-scope="scope">
                          <span>{{ scope.row.caseTypeStr }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column label="职位" align="left" width>
                        <template slot-scope="scope">
                          <span>{{ scope.row.position }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column label="角色描述" align="left" width>
                        <template slot-scope="scope">
                          <span>{{ scope.row.userrole }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column label="开始日期" align="left" width>
                        <template slot-scope="scope">
                          <span>{{ scope.row.startdate }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column label="截止日期" align="left" width>
                        <template slot-scope="scope">
                          <span>{{ scope.row.enddate }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column label="备注" align="left" width>
                        <template slot-scope="scope">
                          <span>{{ scope.row.memo }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column label="查全部案件" align="left" width>
                        <template slot-scope="scope">
                          <span>{{ scope.row.ischeckStr }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column label="查全部时限" align="left" width>
                        <template slot-scope="scope">
                          <span>{{ scope.row.isAllTltStr }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column label="处理全部待报告" align="left" width>
                        <template slot-scope="scope">
                          <span>{{ scope.row.mailtodoStr }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column label="操作" align="left" width="" class-name="small-padding fixed-width">
                        <template slot-scope="scope">

                          <el-button size="mini" type="text" @click="custAddrupdata(scope.row,'wfcon', true)">查看</el-button>
                          <el-button size="mini" type="text" @click="custAddrupdata(scope.row,'wfcon')">修改</el-button>
                          <el-button size="mini" type="text" @click="custAddrdel(scope.row,scope.$index,'wfcon')">删除</el-button>

                        </template>
                      </el-table-column>
                    </el-table>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col class="tilteSpan" :span="24">
                    <span id='khzs-title'>客户指示</span>
                  </el-col>
                </el-row>
                <CustZs :postForm="postForm"></CustZs>

                <el-row>
                  <el-col class="tilteSpan" :span="24">
                    <span id='glgs-title'>关联公司</span>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24" style='text-align:right'>
                    <el-button type="primary" size="mini" @click="addhdDftable('glgs')">添加
                    </el-button>
                    <el-button v-if="postForm.customerAssociates.length>3" type="primary" size="mini" @click="allMessageFormShow('glgs')">全部
                    </el-button>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-table size="mini" :data="postForm.customerAssociates.filter((item,index)=>index<=2)" border fit empty-text="暂无数据" highlight-current-row current-row-key style="width: 100%;">
                      <el-table-column type="index" width="50" label="序号" align="left"></el-table-column>
                      <el-table-column label="公司名称" align="left" width>
                        <template slot-scope="scope">
<!--                          <el-autocomplete-->
<!--                            v-model="scope.row.custAssName"-->
<!--                            :fetch-suggestions="querySearchAsync"-->
<!--                            placeholder="请输入内容"-->
<!--                            filterable-->
<!--                            :popper-append-to-body="true"-->
<!--                          >-->
<!--                            <template slot-scope="{ item }">-->
<!--                              <div class="name_wrap" :class="item.id==-1?'firstName_wrap':''">-->
<!--                                <el-tooltip  class="item" effect="light" :content="item.value" placement="top">-->
<!--                                  <div  :class="item.id==-1?'name0':'name'">{{ item.value }}</div>-->
<!--                                </el-tooltip>-->
<!--                                <el-tooltip  class="item" effect="light" :content="item.value1" placement="top">-->
<!--                                  <div :class="item.id==-1?'name0':'name'">{{ item.value1 }}</div>-->
<!--                                </el-tooltip>-->
<!--                                <el-tooltip  class="item" effect="light" :content="item.value2" placement="top">-->
<!--                                  <div  :class="item.id==-1?'name0':'name'">{{ item.value2 }}</div>-->
<!--                                </el-tooltip>-->
<!--                              </div>-->
<!--                            </template>-->
<!--                          </el-autocomplete>-->
                          <el-input type="text" placeholder="" v-model="scope.row.custAssName" >
                          </el-input>
                        </template>
                      </el-table-column>
                      <el-table-column label="与关联公司关系" align="left" width>
                        <template slot-scope="scope">
                          <el-input type="text" placeholder="" v-model="scope.row.relationship">
                          </el-input>
                        </template>
                      </el-table-column>

                      <el-table-column label="操作" align="left" width="" class-name="small-padding fixed-width">
                        <template slot-scope="scope">

                          <el-button size="mini" type="text" @click="handledeleElementglgs(scope.$index)">删除</el-button>

                        </template>
                      </el-table-column>
                    </el-table>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col class="tilteSpan" :span="24">
                    <span id='lyct-title'>利益冲突</span>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24" style='text-align:right'>
                    <el-button type="primary" size="mini" @click="addhdDftable('lyct')">添加
                    </el-button>
                    <el-button v-if="postForm.conflicters.length>3" type="primary" size="mini" @click="allMessageFormShow('lyct')">全部
                    </el-button>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-table size="mini" :data="postForm.conflicters.filter((item,index)=>index<=2)" border fit empty-text="暂无数据" highlight-current-row current-row-key style="width: 100%;">
                      <el-table-column type="index" width="50" label="序号" align="left"></el-table-column>
                      <el-table-column label="利益冲突者名称" align="left" width>
                        <template slot-scope="scope">

                          <el-select default-first-option :clearable='true' v-model="scope.row.fullname" @change="conflictersChange(scope.row)" no-match-text='暂无数据' loading-text='正在查询' filterable remote reserve-keyword placeholder="请输入关键词"
                            :remote-method="remotepaternalUnitactivityList">
                            <el-option v-for="item in seletData.activityList" :key="String(item.conId)" :label="item.fullname" :value="item.fullname">
                            </el-option>
                          </el-select>
                        </template>
                      </el-table-column>
                      <el-table-column label="备注" align="left" width>
                        <template slot-scope="scope">
                          <el-input type="text" placeholder="" v-model="scope.row.memo">
                          </el-input>
                        </template>
                      </el-table-column>

                      <el-table-column label="操作" align="left" width="" class-name="small-padding fixed-width">
                        <template slot-scope="scope">

                          <el-button size="mini" type="text" @click="handledeleElementlyct(scope.$index)">删除</el-button>

                        </template>
                      </el-table-column>
                    </el-table>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col class="tilteSpan" :span="24">
                    <span id='hy-title'>行业</span>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24" style='text-align:right'>
                    <el-button type="primary" size="mini" @click="addhdDftable('hy')">添加
                    </el-button>
                    <el-button v-if="postForm.customerIndustrys.length>3" type="primary" size="mini" @click="allMessageFormShow('hy')">全部
                    </el-button>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-table size="mini" :data="postForm.customerIndustrys.filter((item,index)=>index<=2)" border fit empty-text="暂无数据" highlight-current-row current-row-key style="width: 100%;">
                      <el-table-column type="index" width="50" label="序号" align="left"></el-table-column>
                      <el-table-column label="行业" align="left" width>
                        <template slot-scope="scope">
                          <el-select default-first-option :clearable='true' placeholder="请选择" v-model="scope.row.induId" filterable>
                            <el-option v-for="(item,key) in seletData.industry" :key="key" :label="item.fname" :value="item.induid">
                            </el-option>

                          </el-select>
                        </template>
                      </el-table-column>
                      <el-table-column label="细分行业" align="left" width>
                        <template slot-scope="scope">
                          <el-input type="text" placeholder="" v-model="scope.row.info">
                          </el-input>
                        </template>
                      </el-table-column>
                      <el-table-column label="行业标签" align="left" width>
                        <template slot-scope="scope">
                          <el-select v-model="scope.row.customerTags" filterable allow-create multiple clearable default-first-option placeholder="请选择标签">
                            <el-option
                              v-for="item in industryTagList"
                              :key="item.tagName"
                              :label="item.tagName"
                              :value="item.tagName">
                            </el-option>
                          </el-select>
                        </template>
                      </el-table-column>

                      <el-table-column label="操作" align="left" width="" class-name="small-padding fixed-width">
                        <template slot-scope="scope">

                          <el-button size="mini" type="text" @click="handledeleElementhy(scope.$index)">删除</el-button>

                        </template>
                      </el-table-column>
                    </el-table>
                  </el-col>
                </el-row>
                <el-row v-if="$route.params.type!='sc'">
                  <el-col :span="24" style="text-align:center">
                    <el-form-item>
                      <el-button size="medium" type="primary" v-if="!isEdit" @click="updatasubmitForm('postForm')">创建客户
                      </el-button>
                      <el-button size="medium" type="primary" v-if="isEdit" @click="updatasubmitForm('postForm')">保存修改
                      </el-button>

                      <el-button type="primary" v-if="!isEdit" @click="delCustomer" size="medium">取消</el-button>
                      <el-button type="primary" v-if="isEdit"  @click="$router.go(-1);" size="medium">取消</el-button>

                    </el-form-item>
                  </el-col>

                </el-row>
                <el-row v-if="$route.params.type=='sc'">
                  <el-col :span="24" style="text-align:center">
                    <el-form-item>
                      <el-button size="medium" type="primary" @click="customerExamine('1621')">审核通过
                      </el-button>
                      <el-button size="medium" type="primary" @click="customerExamine('1624')">审核驳回
                      </el-button>

                      <el-button type="primary" @click="$router.go(-1);" size="medium">取消</el-button>

                    </el-form-item>
                  </el-col>

                </el-row>
              </div>
            </el-col>

            <el-col v-if="!isBillEdit" class="form-con-item clearfix" :span="2">
              <div style="height: 520px;position: fixed;top:20%;right:2%">
                <el-steps :space="200" :active="stepActive" direction="vertical">
                  <el-step class="stepItem" @click.native="stepset(0)" title="基本信息"></el-step>
                  <el-step class="stepItem" @click.native="stepset(1)" title="客户地址"></el-step>
                  <el-step class="stepItem" @click.native="stepset(2)" title="对方联系人"></el-step>
                  <el-step class="stepItem" @click.native="stepset(3)" title="活动"></el-step>
                  <el-step class="stepItem" @click.native="stepset(4)" title="我方联系人"></el-step>
                  <el-step class="stepItem" @click.native="stepset(5)" title="客户指示"></el-step>
                  <el-step class="stepItem" @click.native="stepset(6)" title="关联公司"></el-step>
                  <el-step class="stepItem" @click.native="stepset(7)" title="利益冲突"></el-step>
                  <el-step class="stepItem" @click.native="stepset(8)" title="行业"></el-step>
                </el-steps>
              </div>
            </el-col>
          </el-row>

        </div>

      </div>

    </el-form>

    <el-dialog :show-close="false" :close-on-click-modal="false" :append-to-body="true" title="客户地址" :visible.sync="dialogFormAddr" width="70%">
      <el-form ref="creatAddrForm" :model="addrFromData" size="mini" label-position="left" style="width: 100%;">
        <el-row class="form-border">
          <el-col :span="24">
            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="单位:" class="postInfo-container-item">

                  <span v-if="dialogLook">{{postForm.fullname}}</span>
                  <el-input v-else type="text" placeholder="" :disabled="true" v-model="postForm.fullname">
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="信函抬头:" class="postInfo-container-item">

                  <span v-if="dialogLook">{{addrFromData.title}}</span>
                  <el-input v-else type="text" placeholder="" v-model="addrFromData.title">
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="中文地址:" class="postInfo-container-item">
                  <span v-if="dialogLook">{{addrFromData.addressCn}}</span>
                  <el-input v-else type="text" placeholder="" v-model="addrFromData.addressCn">
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <!-- <el-row>
              <el-col :span="12">
                <el-form-item label="是否信函地址 :" class="postInfo-container-item">
                  <el-radio-group v-model="addrFromData.isMailAdd">
                    <el-radio :label='1'>是</el-radio>
                    <el-radio :label='0'>否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="是否账单地址 :" class="postInfo-container-item">
                  <el-radio-group v-model="addrFromData.isBillAdd">
                    <el-radio :label='1'>是</el-radio>
                    <el-radio :label='0'>否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row> -->
            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="英文地址:" class="postInfo-container-item">

                  <span v-if="dialogLook">{{addrFromData.addressEn}}</span>
                  <el-input v-else type="text" placeholder="" v-model="addrFromData.addressEn">
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="邮寄地址:" class="postInfo-container-item">

                  <span v-if="dialogLook">{{addrFromData.addressMail}}</span>
                  <el-input v-else type="text" placeholder="" v-model="addrFromData.addressMail">
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="邮编:" class="postInfo-container-item">

                  <span v-if="dialogLook">{{addrFromData.post}}</span>
                  <el-input v-else type="text" placeholder="" v-model="addrFromData.post">
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="国家/省份/城市:" prop="ctData" class="postInfo-container-item">
                  <template>
                    <span v-if="dialogLook">{{addrFromData.country +  ' ' + addrFromData.province + ' ' + addrFromData.city}}</span>
                    <el-cascader v-else clearable change-on-select style="width:60%" placeholder="" v-model="addrFromData.ctData" :options="seletData.ctDataOption" filterable>
                    </el-cascader>
                  </template>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="大洲:" class="postInfo-container-item">
                  <span v-if="dialogLook">{{addrFromData.continent}}</span>
                  <el-input v-else type="text" :disabled="true" placeholder="" v-model="addrFromData.continent">
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="状态:" class="postInfo-container-item">
                  <template>
                    <span v-if="dialogLook">{{addrFromData.statusStr}}</span>
                    <el-select v-else default-first-option :clearable='true' placeholder="请选择" v-model="addrFromData.status" filterable>
                      <el-option v-for="item in seletData.statu" :key="String(item.id)" :label="item.typeName" :value="String(item.id)">
                      </el-option>
                    </el-select>
                  </template>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="备注:" class="postInfo-container-item uploader-custfile">
                  <template>
                    <span v-if="dialogLook">{{addrFromData.memo}}</span>
                    <el-input v-else type="textarea" :rows="2" placeholder="请输入内容" v-model="addrFromData.memo">
                    </el-input>
                  </template>
                </el-form-item>
              </el-col>
            </el-row>

          </el-col>
        </el-row>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="()=>{this.dialogFormAddr = false;}">
          取消
        </el-button>
        <el-button v-if="!dialogLook" type="primary" @click="dialogFormStatus==='create'?createCustAddr('addr'):updateCustAddr('addr')">
          确定
        </el-button>
      </div>
    </el-dialog>
    <el-dialog :show-close="false" :close-on-click-modal="false" :append-to-body="true" title="对方联系人" @open='dialogFormOpen("dfcon")' :visible.sync="dialogFormdfcon" width="70%">
<!--      <el-form ref="dfconFromData" :model="dfconFromData" :rules="dfconRules" size="mini" label-position="left" style="width: 100%;">-->

<!--        <el-row>-->
<!--          <el-col class="form-con-item" :span="24">-->
<!--            <el-row>-->
<!--              <el-col class="tilteSpan" :span="24">-->
<!--                <span>基本信息</span>-->
<!--              </el-col>-->
<!--            </el-row>-->
<!--            <el-row class="form-border">-->
<!--              <el-col :span="12">-->
<!--                <el-row>-->
<!--                  <el-col :span="24">-->
<!--                    <el-form-item label="编码:" class="postInfo-container-item">-->
<!--                      <el-input v-model="dfconFromData.custContactId" :disabled="true"></el-input>-->
<!--                    </el-form-item>-->
<!--                  </el-col>-->

<!--                </el-row>-->
<!--                <el-row>-->
<!--                  <el-col :span="24">-->
<!--                    <el-form-item label="姓:" class="postInfo-container-item">-->
<!--                      <el-input v-model="dfconFromData.firstname"></el-input>-->
<!--                    </el-form-item>-->
<!--                  </el-col>-->

<!--                </el-row>-->
<!--                <el-row>-->
<!--                  <el-col :span="24">-->
<!--                    <el-form-item label="姓名:" prop="name" class="">-->
<!--                      <el-input v-model="dfconFromData.name" @blur='creatLsCust("dfconFromData")'></el-input>-->
<!--                    </el-form-item>-->
<!--                  </el-col>-->
<!--                </el-row>-->
<!--                <el-row>-->
<!--                  <el-col :span="24">-->
<!--                    <el-form-item label="性别:" prop="gender" class="postInfo-container-item">-->
<!--                      <template>-->
<!--                        <el-select default-first-option :clearable='true' placeholder="请选择" v-model="dfconFromData.gender" @change='creatLsCust("dfconFromData")' filterable>-->
<!--                          <el-option v-for="item in seletData.sex" :key="item.id" :label="item.typeName" :value="item.id">-->
<!--                          </el-option>-->
<!--                        </el-select>-->
<!--                      </template>-->
<!--                    </el-form-item>-->
<!--                  </el-col>-->

<!--                </el-row>-->
<!--                <el-row>-->
<!--                  <el-col :span="24">-->
<!--                    <el-form-item label="称谓:" class="postInfo-container-item">-->
<!--                      <template>-->
<!--                        <el-select default-first-option :clearable='true' placeholder="请选择" v-model="dfconFromData.called" filterable>-->
<!--                          <el-option v-for="item in seletData.called" :key="item.id" :label="item.typeName" :value="item.id">-->
<!--                          </el-option>-->
<!--                        </el-select>-->
<!--                      </template>-->
<!--                    </el-form-item>-->
<!--                  </el-col>-->

<!--                </el-row>-->

<!--              </el-col>-->
<!--              <el-col :span="12">-->
<!--                <el-row>-->
<!--                  <el-col :span="24">-->
<!--                    <el-form-item label="照片" class="postInfo-container-item avatar-uploader">-->

<!--                      <el-upload :action='dfuserIconUrl' ref='custContIconupload' :data='custContIconSendData' :on-success='dficonSendSuccess' accept="image/jpeg,image/gif,image/png"-->
<!--                        :before-upload="onBeforeUploadIcon" :show-file-list="false" :auto-upload='false' name='custContIcon' :on-change="dfhandleAvatarChange">-->
<!--                        <img v-if="dfconFromData.custContIcon" :src="dfuserIconCust" class="avatar">-->
<!--                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>-->
<!--                      </el-upload>-->
<!--                    </el-form-item>-->
<!--                  </el-col>-->
<!--                </el-row>-->

<!--              </el-col>-->
<!--            </el-row>-->
<!--            <el-row class="form-border">-->
<!--              <el-col :span="24">-->

<!--                <el-row class="fullRow">-->
<!--                  <el-col :span="24">-->
<!--                    <el-form-item label="出生日期:" class="postInfo-container-item">-->

<!--                      <el-date-picker v-model="dfconFromData.dfconFromData" format='yyyy-MM-dd' value-format="yyyy-MM-dd" align="right" type="date" placeholder="选择日期" :picker-options="pickerOptions">-->
<!--                      </el-date-picker>-->
<!--                    </el-form-item>-->
<!--                  </el-col>-->
<!--                </el-row>-->
<!--                <el-row class="fullRow">-->
<!--                  <el-col :span="24">-->
<!--                    <el-form-item label="所属单位:" class="postInfo-container-item">-->

<!--                      <el-input v-model="postForm.fullname"></el-input>-->
<!--                    </el-form-item>-->
<!--                  </el-col>-->
<!--                </el-row>-->

<!--                <el-row class="fullRow">-->
<!--                  <el-col :span="24">-->
<!--                    <el-form-item label="业务领域:" class="postInfo-container-item">-->

<!--                      <el-input v-model="dfconFromData.bustype"></el-input>-->
<!--                    </el-form-item>-->
<!--                  </el-col>-->
<!--                </el-row>-->

<!--                <el-row class="fullRow">-->
<!--                  <el-col :span="24">-->
<!--                    <el-form-item label="分支机构:" class="postInfo-container-item">-->

<!--                      <el-input v-model="dfconFromData.branch"></el-input>-->
<!--                    </el-form-item>-->
<!--                  </el-col>-->
<!--                </el-row>-->
<!--                <el-row>-->
<!--                  <el-col :span="12">-->
<!--                    <el-form-item label="是否主要联系人:" prop="ismain" class="postInfo-container-item">-->
<!--                      <el-radio-group v-model="dfconFromData.ismain" @change='creatLsCust("dfconFromData")'>-->
<!--                        <el-radio :label='true'>是</el-radio>-->
<!--                        <el-radio :label='false'>否</el-radio>-->
<!--                      </el-radio-group>-->
<!--                    </el-form-item>-->
<!--                  </el-col>-->
<!--                  <el-col :span="12">-->
<!--                    <el-form-item label="是否账单联系人:" prop="isBillContact" class="postInfo-container-item">-->
<!--                      <el-radio-group v-model="dfconFromData.isBillContact" @change='creatLsCust("dfconFromData")'>-->
<!--                        <el-radio :label='true'>是</el-radio>-->
<!--                        <el-radio :label='false'>否</el-radio>-->
<!--                      </el-radio-group>-->
<!--                    </el-form-item>-->
<!--                  </el-col>-->
<!--                </el-row>-->
<!--                <el-row>-->
<!--                  <el-col :span="12">-->
<!--                    <el-form-item label="部门:" class="postInfo-container-item">-->
<!--                      <el-input v-model="dfconFromData.department"></el-input>-->
<!--                    </el-form-item>-->
<!--                  </el-col>-->
<!--                  <el-col :span="12">-->
<!--                    <el-form-item label="职务:" class="postInfo-container-item">-->
<!--                      <el-input v-model="dfconFromData.jobtitle"></el-input>-->
<!--                    </el-form-item>-->
<!--                  </el-col>-->
<!--                </el-row>-->
<!--                <el-row class="fullRow">-->
<!--                  <el-col :span="24">-->
<!--                    <el-form-item label="状态:" prop="status" class="postInfo-container-item">-->

<!--                      <template>-->
<!--                        <el-select default-first-option :clearable='true' @change='creatLsCust("dfconFromData")' placeholder="请选择" v-model="dfconFromData.status" filterable>-->
<!--                          <el-option v-for="item in seletData.lxstatu" :key="item.id" :label="item.typeName" :value="item.id">-->
<!--                          </el-option>-->
<!--                        </el-select>-->
<!--                      </template>-->

<!--                    </el-form-item>-->
<!--                  </el-col>-->
<!--                </el-row>-->
<!--                <el-row class="fullRow">-->
<!--                  <el-col :span="24">-->
<!--                    <el-form-item label="启动状态:" prop="sysStatus" class="postInfo-container-item">-->

<!--                      <template>-->
<!--                        <el-select default-first-option :clearable='true' @change='creatLsCust("dfconFromData")' placeholder="请选择" v-model="dfconFromData.sysStatus" filterable>-->
<!--                          <el-option v-for="item in seletData.statu" :key="item.id" :label="item.typeName" :value="item.id">-->
<!--                          </el-option>-->
<!--                        </el-select>-->
<!--                      </template>-->

<!--                    </el-form-item>-->
<!--                  </el-col>-->
<!--                </el-row>-->
<!--                <el-row class="fullRow">-->
<!--                  <el-col :span="24">-->
<!--                    <el-form-item label="是否对账人:" class="postInfo-container-item">-->

<!--                      <el-radio-group v-model="dfconFromData.isCollectbillMan">-->
<!--                        <el-radio :label='1'>是</el-radio>-->
<!--                        <el-radio :label='0'>否</el-radio>-->
<!--                      </el-radio-group>-->

<!--                    </el-form-item>-->
<!--                  </el-col>-->
<!--                </el-row>-->

<!--              </el-col>-->
<!--            </el-row>-->
<!--            <el-row>-->
<!--              <el-col class="tilteSpan" :span="24">-->
<!--                <span>联系方式</span>-->
<!--              </el-col>-->
<!--            </el-row>-->
<!--            <el-row class="form-border">-->
<!--              <el-col :span="24">-->

<!--                <el-row class="">-->
<!--                  <el-col :span="12">-->
<!--                    <el-form-item label="办公电话1:" class="postInfo-container-item">-->
<!--                      <el-input v-model="dfconFromData.tel"></el-input>-->
<!--                    </el-form-item>-->
<!--                  </el-col>-->
<!--                  <el-col :span="12">-->
<!--                    <el-form-item label="办公电话2:" class="postInfo-container-item">-->
<!--                      <el-input v-model="dfconFromData.mobile2"></el-input>-->
<!--                    </el-form-item>-->
<!--                  </el-col>-->
<!--                </el-row>-->

<!--                <el-row class="">-->
<!--                  <el-col :span="12">-->
<!--                    <el-form-item label="移动电话:" class="postInfo-container-item">-->

<!--                      <el-input v-model="dfconFromData.mobile1"></el-input>-->
<!--                    </el-form-item>-->
<!--                  </el-col>-->
<!--                  <el-col :span="12">-->
<!--                    <el-form-item label="住宅电话:" class="postInfo-container-item">-->

<!--                      <el-input v-model="dfconFromData.phone2"></el-input>-->
<!--                    </el-form-item>-->
<!--                  </el-col>-->
<!--                </el-row>-->

<!--                <el-row class="">-->
<!--                  <el-col :span="12">-->
<!--                    <el-form-item label="邮箱1:" class="postInfo-container-item">-->

<!--                      <el-input v-model="dfconFromData.email"></el-input>-->
<!--                    </el-form-item>-->
<!--                  </el-col>-->
<!--                  <el-col :span="12">-->
<!--                    <el-form-item label="邮箱2:" class="postInfo-container-item">-->

<!--                      <el-input v-model="dfconFromData.email2"></el-input>-->
<!--                    </el-form-item>-->
<!--                  </el-col>-->
<!--                </el-row>-->

<!--                <el-row class="">-->
<!--                  <el-col :span="12">-->
<!--                    <el-form-item label="传真1:" class="postInfo-container-item">-->

<!--                      <el-input v-model="dfconFromData.fax1"></el-input>-->
<!--                    </el-form-item>-->
<!--                  </el-col>-->
<!--                  <el-col :span="12">-->
<!--                    <el-form-item label="即时通类型:" class="postInfo-container-item">-->

<!--                      <el-input v-model="dfconFromData.msgType"></el-input>-->
<!--                    </el-form-item>-->
<!--                  </el-col>-->
<!--                </el-row>-->

<!--                <el-row class="fullRow">-->
<!--                  <el-col :span="24">-->
<!--                    <el-form-item label="即时通账号:" class="postInfo-container-item">-->

<!--                      <el-input v-model="dfconFromData.msgAccount"></el-input>-->
<!--                    </el-form-item>-->
<!--                  </el-col>-->
<!--                </el-row>-->

<!--              </el-col>-->
<!--            </el-row>-->
<!--            <el-row>-->
<!--              <el-col class="tilteSpan" :span="24">-->
<!--                <span>关系人信息</span>-->
<!--              </el-col>-->
<!--            </el-row>-->
<!--            <el-row class="form-border">-->
<!--              <el-col :span="24">-->
<!--                <el-row class="fullRow">-->
<!--                  <el-col :span="24">-->
<!--                    <el-form-item label="上级主管:" class="postInfo-container-item">-->

<!--                      <template>-->
<!--                        <el-select default-first-option :clearable='true' placeholder="请选择" v-model="dfconFromData.bossCustContactId" filterable>-->
<!--                          <el-option v-for="item in seletData.dfcon" :key="item.custContactId" :label="item.name" :value="item.custContactId">-->
<!--                          </el-option>-->
<!--                        </el-select>-->
<!--                      </template>-->

<!--                    </el-form-item>-->
<!--                  </el-col>-->
<!--                </el-row>-->
<!--                <el-row class="fullRow">-->
<!--                  <el-col :span="24">-->
<!--                    <el-form-item label="关系人1名称:" class="postInfo-container-item">-->

<!--                      <template>-->
<!--                        <el-select default-first-option :clearable='true' placeholder="请选择" v-model="dfconFromData.gxr1CustContactId" filterable>-->
<!--                          <el-option v-for="item in seletData.dfcon" :key="item.custContactId" :label="item.name" :value="item.custContactId">-->
<!--                          </el-option>-->
<!--                        </el-select>-->
<!--                      </template>-->

<!--                    </el-form-item>-->
<!--                  </el-col>-->
<!--                </el-row>-->
<!--                <el-row class="fullRow">-->
<!--                  <el-col :span="24">-->
<!--                    <el-form-item label="关系人1关系描述:" class="postInfo-container-item">-->

<!--                      <el-input v-model="dfconFromData.relat1"></el-input>-->
<!--                    </el-form-item>-->
<!--                  </el-col>-->
<!--                </el-row>-->
<!--                <el-row class="fullRow">-->
<!--                  <el-col :span="24">-->
<!--                    <el-form-item label="关系人2名称:" class="postInfo-container-item">-->

<!--                      <template>-->
<!--                        <el-select default-first-option :clearable='true' placeholder="请选择" v-model="dfconFromData.gxr2CustContactId" filterable>-->
<!--                          <el-option v-for="item in seletData.dfcon" :key="item.custContactId" :label="item.name" :value="item.custContactId">-->
<!--                          </el-option>-->
<!--                        </el-select>-->
<!--                      </template>-->

<!--                    </el-form-item>-->
<!--                  </el-col>-->
<!--                </el-row>-->
<!--                <el-row class="fullRow">-->
<!--                  <el-col :span="24">-->
<!--                    <el-form-item label="关系人2关系描述:" class="postInfo-container-item">-->

<!--                      <el-input v-model="dfconFromData.relat2"></el-input>-->
<!--                    </el-form-item>-->
<!--                  </el-col>-->
<!--                </el-row>-->
<!--                <el-row class="fullRow">-->
<!--                  <el-col :span="24">-->
<!--                    <el-form-item label="关系人3名称:" class="postInfo-container-item">-->

<!--                      <template>-->
<!--                        <el-select default-first-option :clearable='true' placeholder="请选择" v-model="dfconFromData.gxr3CustContactId" filterable>-->
<!--                          <el-option v-for="item in seletData.dfcon" :key="item.custContactId" :label="item.name" :value="item.custContactId">-->
<!--                          </el-option>-->
<!--                        </el-select>-->
<!--                      </template>-->

<!--                    </el-form-item>-->
<!--                  </el-col>-->
<!--                </el-row>-->
<!--                <el-row class="fullRow">-->
<!--                  <el-col :span="24">-->
<!--                    <el-form-item label="关系人3关系描述:" class="postInfo-container-item">-->

<!--                      <el-input v-model="dfconFromData.relat3"></el-input>-->
<!--                    </el-form-item>-->
<!--                  </el-col>-->
<!--                </el-row>-->
<!--                <el-row class="fullRow">-->
<!--                  <el-col :span="24">-->
<!--                    <el-form-item label="来源人:" class="postInfo-container-item">-->

<!--                      <el-input v-model="dfconFromData.infoFromStaff"></el-input>-->
<!--                    </el-form-item>-->
<!--                  </el-col>-->
<!--                </el-row>-->
<!--                <el-row class="fullRow">-->
<!--                  <el-col :span="24">-->
<!--                    <el-form-item label="来源场合:" class="postInfo-container-item">-->

<!--                      <el-input v-model="dfconFromData.infoFromPlace"></el-input>-->
<!--                    </el-form-item>-->
<!--                  </el-col>-->
<!--                </el-row>-->
<!--                <el-row class="fullRow">-->
<!--                  <el-col :span="24">-->
<!--                    <el-form-item label="来源时间:" class="postInfo-container-item">-->

<!--                      <el-date-picker v-model="dfconFromData.infoFromDate" format='yyyy-MM-dd' value-format="yyyy-MM-dd" align="right" type="date" placeholder="选择日期" :picker-options="pickerOptions">-->
<!--                      </el-date-picker>-->
<!--                    </el-form-item>-->
<!--                  </el-col>-->
<!--                </el-row>-->
<!--              </el-col>-->
<!--            </el-row>-->
<!--            <el-row>-->
<!--              <el-col class="tilteSpan" :span="24">-->
<!--                <span>常规活动信息</span>-->
<!--              </el-col>-->
<!--            </el-row>-->
<!--            <el-row class="form-border">-->
<!--              <el-col :span="24">-->
<!--                <el-row class="fullRow">-->
<!--                  <el-col :span="24">-->
<!--                    <el-form-item label="常规活动:" class="postInfo-container-item">-->

<!--                      <el-input v-model="dfconFromData.routineAct"></el-input>-->
<!--                    </el-form-item>-->
<!--                  </el-col>-->
<!--                </el-row>-->
<!--                <el-row class="fullRow">-->
<!--                  <el-col :span="24">-->
<!--                    <el-form-item label="常规活动备注:" class="postInfo-container-item">-->

<!--                      <el-input v-model="dfconFromData.routineActMemo"></el-input>-->
<!--                    </el-form-item>-->
<!--                  </el-col>-->
<!--                </el-row>-->
<!--                <el-row class="fullRow">-->
<!--                  <el-col :span="24">-->

<!--                    <el-form-item label="联系人文档:" class="postInfo-container-item uploader-custfile">-->
<!--                      <template>-->

<!--                        <el-upload class="upload-demo" name="custContactFile" :data='custContactFiledata' ref="uploadcustContactFile" :action="custContactFileUrl" :before-upload="handlePreview"-->
<!--                          list-type='picture' :file-list="dfconFromData.materialList" :before-remove="(file)=>brforeRemoveFile(file,'dffile')"-->
<!--                                   :on-preview="preview" :auto-upload="false">-->
<!--                          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>-->
<!--                          <el-button style="margin-left: 10px;" size="small" type="success" @click="addCustomerFile('dffile')">-->
<!--                            上传</el-button>-->

<!--                        </el-upload>-->
<!--                      </template>-->
<!--                    </el-form-item>-->
<!--                  </el-col>-->
<!--                </el-row>-->
<!--                <el-row class="fullRow">-->
<!--                  <el-col :span="24">-->
<!--                    <el-form-item label="备注:" class="postInfo-container-item uploader-custfile">-->
<!--                      <template>-->
<!--                        <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="dfconFromData.memo">-->
<!--                        </el-input>-->
<!--                      </template>-->
<!--                    </el-form-item>-->
<!--                  </el-col>-->
<!--                </el-row>-->
<!--              </el-col>-->
<!--            </el-row>-->
<!--            <el-row>-->
<!--              <el-col class="tilteSpan" :span="24">-->
<!--                <span id=''>对方联系人-地址</span>-->

<!--                <el-select default-first-option :clearable='true' placeholder="请选择" size="mini" multiple @change="dfdzchange" collapse-tags v-model="dfdzlist" filterable>-->
<!--                  <el-option v-for="(item,key) in seletData.dfkhdzlist" :key="key" :label="`${[item.title,item.addressCn,item.addressEn].filter(i=>!!i).join(' ; ')}`" :value="item.addrId">-->
<!--                  </el-option>-->
<!--                </el-select>-->
<!--              </el-col>-->
<!--            </el-row>-->

<!--            <el-row>-->
<!--              <el-col :span="24">-->
<!--                <el-table size="mini" :data="dfconFromData.customerContactAddArray" border fit empty-text="暂无数据" highlight-current-row current-row-key style="width: 100%;">-->
<!--                  <el-table-column type="index" width="50" label="序号" align="left"></el-table-column>-->
<!--                  <el-table-column label="信函抬头" align="left" width>-->
<!--                    <template slot-scope="scope">-->
<!--                      <span>{{ scope.row.title }}</span>-->
<!--                    </template>-->
<!--                  </el-table-column>-->
<!--                  <el-table-column label="大洲" align="left" width>-->
<!--                    <template slot-scope="scope">-->
<!--                      <span>{{ scope.row.continent }}</span>-->
<!--                    </template>-->
<!--                  </el-table-column>-->
<!--                  <el-table-column label="国家" align="left" width>-->
<!--                    <template slot-scope="scope">-->
<!--                      <span>{{ scope.row.country }}</span>-->
<!--                    </template>-->
<!--                  </el-table-column>-->
<!--                  <el-table-column label="州省份" align="left" width>-->
<!--                    <template slot-scope="scope">-->
<!--                      <span>{{ scope.row.province }}</span>-->
<!--                    </template>-->
<!--                  </el-table-column>-->
<!--                  <el-table-column label="城市" align="left" width>-->
<!--                    <template slot-scope="scope">-->
<!--                      <span>{{ scope.row.city }}</span>-->
<!--                    </template>-->
<!--                  </el-table-column>-->
<!--                  <el-table-column label="中文地址" align="left" width>-->
<!--                    <template slot-scope="scope">-->
<!--                      <span>{{ scope.row.addressCn }}</span>-->
<!--                    </template>-->
<!--                  </el-table-column>-->
<!--                  <el-table-column label="英文地址" align="left" width>-->
<!--                    <template slot-scope="scope">-->
<!--                      <span>{{ scope.row.addressEn }}</span>-->
<!--                    </template>-->
<!--                  </el-table-column>-->
<!--                  <el-table-column label="邮编" align="left" width>-->
<!--                    <template slot-scope="scope">-->
<!--                      <span>{{ scope.row.post }}</span>-->
<!--                    </template>-->
<!--                  </el-table-column>-->
<!--                  <el-table-column label="状态" align="left" width>-->
<!--                    <template slot-scope="scope">-->
<!--                      <span>{{ scope.row.statusStr }}</span>-->
<!--                    </template>-->
<!--                  </el-table-column>-->
<!--                  <el-table-column label="备注" align="left" width>-->
<!--                    <template slot-scope="scope">-->
<!--                      <span>{{ scope.row.memo }}</span>-->
<!--                    </template>-->
<!--                  </el-table-column>-->

<!--                </el-table>-->
<!--              </el-col>-->
<!--            </el-row>-->
<!--            <el-row>-->
<!--              <el-col class="tilteSpan" :span="24">-->
<!--                <span id=''>对方联系人-我方联系人</span>-->
<!--              </el-col>-->
<!--            </el-row>-->
<!--            <el-row>-->
<!--              <el-col :span="24" style='text-align:right'>-->
<!--                <el-button type="primary" size="mini" @click="addFormShow('dfwfcon')">添加-->
<!--                </el-button>-->
<!--              </el-col>-->
<!--            </el-row>-->
<!--            <el-row>-->
<!--              <el-col :span="24">-->
<!--                <el-table size="mini" :data="dfconFromData.customerContactAgencyContacts" border fit empty-text="暂无数据" highlight-current-row current-row-key style="width: 100%;">-->
<!--                  <el-table-column type="index" width="50" label="序号" align="left"></el-table-column>-->
<!--                  <el-table-column label="姓名" align="left" width>-->
<!--                    <template slot-scope="scope">-->
<!--                      <span>{{ scope.row.userName }}</span>-->
<!--                    </template>-->
<!--                  </el-table-column>-->
<!--                  <el-table-column label="业务领域" align="left" width>-->
<!--                    <template slot-scope="scope">-->
<!--                      <span>{{ scope.row.business }}</span>-->
<!--                    </template>-->
<!--                  </el-table-column>-->

<!--                  <el-table-column label="职位" align="left" width>-->
<!--                    <template slot-scope="scope">-->
<!--                      <span>{{ scope.row.position }}</span>-->
<!--                    </template>-->
<!--                  </el-table-column>-->
<!--                  <el-table-column label="角色描述" align="left" width>-->
<!--                    <template slot-scope="scope">-->
<!--                      <span>{{ scope.row.userrole }}</span>-->
<!--                    </template>-->
<!--                  </el-table-column>-->
<!--                  <el-table-column label="开始日期" align="left" width>-->
<!--                    <template slot-scope="scope">-->
<!--                      <span>{{ scope.row.startdate }}</span>-->
<!--                    </template>-->
<!--                  </el-table-column>-->
<!--                  <el-table-column label="截止日期" align="left" width>-->
<!--                    <template slot-scope="scope">-->
<!--                      <span>{{ scope.row.enddate }}</span>-->
<!--                    </template>-->
<!--                  </el-table-column>-->
<!--                  <el-table-column label="备注" align="left" width>-->
<!--                    <template slot-scope="scope">-->
<!--                      <span>{{ scope.row.memo }}</span>-->
<!--                    </template>-->
<!--                  </el-table-column>-->

<!--                  <el-table-column label="操作" align="left" width="" class-name="small-padding fixed-width">-->
<!--                    <template slot-scope="scope">-->

<!--                      <el-button size="mini" type="text" @click="custAddrupdata(scope.row,'dfwfcon')">修改</el-button>-->
<!--                      <el-button size="mini" type="text" @click="custAddrdel(scope.row,scope.$index,'dfwfcon')">删除</el-button>-->

<!--                    </template>-->
<!--                  </el-table-column>-->
<!--                </el-table>-->
<!--              </el-col>-->
<!--            </el-row>-->
<!--            <el-row>-->
<!--              <el-col class="tilteSpan" :span="24">-->
<!--                <span id=''>对方联系人-活动</span>-->
<!--              </el-col>-->
<!--            </el-row>-->

<!--            <el-row>-->
<!--              <el-col :span="24">-->
<!--                <el-table size="mini" :data="postForm.activities" border fit empty-text="暂无数据" highlight-current-row current-row-key style="width: 100%;">-->
<!--                  <el-table-column type="index" width="50" label="序号" align="left"></el-table-column>-->
<!--                  <el-table-column label="主题" align="left" width>-->
<!--                    <template slot-scope="scope">-->
<!--                      <span>{{ scope.row.subject }}</span>-->
<!--                    </template>-->
<!--                  </el-table-column>-->
<!--                  <el-table-column label="开始时间" align="left" width>-->
<!--                    <template slot-scope="scope">-->
<!--                      <span>{{ scope.row.begindate }}</span>-->
<!--                    </template>-->
<!--                  </el-table-column>-->
<!--                  &lt;!&ndash; <el-table-column label="对方联系人" align="left" width>-->
<!--                      <template slot-scope="scope">-->
<!--                        <span>{{ scope.row.customerContactActs[0].custContactName }}</span>-->
<!--                      </template>-->
<!--                    </el-table-column> &ndash;&gt;-->
<!--                  <el-table-column label="赠送礼品" align="left" width>-->
<!--                    <template slot-scope="scope">-->
<!--                      <span>{{ scope.row.putGift }}</span>-->
<!--                    </template>-->
<!--                  </el-table-column>-->
<!--                  <el-table-column label="内容描述" align="left" width>-->
<!--                    <template slot-scope="scope">-->
<!--                      <span>{{ scope.row.description }}</span>-->
<!--                    </template>-->
<!--                  </el-table-column>-->

<!--                </el-table>-->
<!--              </el-col>-->
<!--            </el-row>-->
<!--            <el-dialog :show-close="false" :close-on-click-modal="false" title="添加对方联系人-我方联系人" :visible.sync="dialogFormdfwfcon" width="70%" append-to-body>-->
<!--              <el-form :model="dfwfconFromData" label-position="left" style="width: 100%;">-->
<!--                <el-row class="form-border">-->
<!--                  <el-col :span="24">-->

<!--                    <el-row class="fullRow">-->
<!--                      <el-col :span="24">-->
<!--                        <el-form-item label="姓名:" class="postInfo-container-item">-->
<!--                          <template>-->
<!--                            <el-select default-first-option :clearable='true' @change="wfUserNamechange" placeholder="请选择" v-model="dfwfconFromData.userId" filterable>-->
<!--                              <el-option v-for="item in seletData.wfuserNames" :key="item.userId" :label="item.fullname" :value="item.userId">-->
<!--                              </el-option>-->
<!--                            </el-select>-->
<!--                          </template>-->
<!--                        </el-form-item>-->
<!--                      </el-col>-->
<!--                    </el-row>-->

<!--                    <el-row class="fullRow">-->
<!--                      <el-col :span="24">-->
<!--                        <el-form-item label="业务领域 :" class="postInfo-container-item">-->
<!--                          <template>-->
<!--                            <el-select default-first-option :clearable='true' placeholder="请选择" v-model="dfwfconFromData.business" filterable>-->
<!--                              <el-option v-for="item in seletData.ywstuta" :key="String(item.typeName)" :label="item.typeName" :value="String(item.typeName)">-->
<!--                              </el-option>-->
<!--                            </el-select>-->
<!--                          </template>-->
<!--                        </el-form-item>-->
<!--                      </el-col>-->
<!--                    </el-row>-->

<!--                    <el-row class="fullRow">-->
<!--                      <el-col :span="24">-->
<!--                        <el-form-item label="职位:" class="postInfo-container-item">-->

<!--                          <el-input type="text" :disabled="true" placeholder="" v-model="dfwfconFromData.position">-->
<!--                          </el-input>-->
<!--                        </el-form-item>-->
<!--                      </el-col>-->
<!--                    </el-row>-->

<!--                    <el-row class="fullRow">-->
<!--                      <el-col :span="24">-->
<!--                        <el-form-item label="角色描述:" class="postInfo-container-item">-->
<!--                          <template>-->
<!--                            <el-select default-first-option :clearable='true' placeholder="请选择" v-model="dfwfconFromData.userrole" filterable>-->
<!--                              <el-option v-for="(item,key) in seletData.roleMessage" :key="key" :label="item.typeName" :value="item.typeName">-->
<!--                              </el-option>-->
<!--                            </el-select>-->
<!--                          </template>-->
<!--                        </el-form-item>-->
<!--                      </el-col>-->
<!--                    </el-row>-->
<!--                    <el-row class="fullRow">-->
<!--                      <el-col :span="24">-->
<!--                        <el-form-item label="开始日期:" class="postInfo-container-item">-->
<!--                          <el-date-picker v-model="dfwfconFromData.startdate" format='yyyy-MM-dd' value-format="yyyy-MM-dd" align="right" type="date" placeholder="选择日期"-->
<!--                            :picker-options="pickerOptions">-->
<!--                          </el-date-picker>-->
<!--                        </el-form-item>-->
<!--                      </el-col>-->
<!--                    </el-row>-->
<!--                    <el-row class="fullRow">-->
<!--                      <el-col :span="24">-->
<!--                        <el-form-item label="截止日期:" class="postInfo-container-item">-->
<!--                          <el-date-picker v-model="dfwfconFromData.enddate" format='yyyy-MM-dd' value-format="yyyy-MM-dd" align="right" type="date" placeholder="选择日期" :picker-options="pickerOptions">-->
<!--                          </el-date-picker>-->
<!--                        </el-form-item>-->
<!--                      </el-col>-->
<!--                    </el-row>-->

<!--                    <el-row class="fullRow">-->
<!--                      <el-col :span="24">-->
<!--                        <el-form-item label="备注:" class="postInfo-container-item uploader-custfile">-->
<!--                          <template>-->
<!--                            <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="dfwfconFromData.memo">-->
<!--                            </el-input>-->
<!--                          </template>-->
<!--                        </el-form-item>-->
<!--                      </el-col>-->
<!--                    </el-row>-->

<!--                  </el-col>-->
<!--                </el-row>-->

<!--              </el-form>-->
<!--              <div slot="footer" class="dialog-footer">-->
<!--                <el-button @click="dialogFormdfwfcon = false">-->
<!--                  取消-->
<!--                </el-button>-->
<!--                <el-button type="primary" @click="dialogFormStatus==='create'?createCustAddr('dfwfcon'):updateCustAddr('dfwfcon')">-->
<!--                  确定-->
<!--                </el-button>-->
<!--              </div>-->
<!--            </el-dialog>-->
<!--          </el-col>-->

<!--        </el-row>-->
<!--      </el-form>-->
      <ContactDfDetail :dfCreated="dfCreated" ref="ContactDfDetail" @updateCustomerContact="updateCustomerContact" v-if="dialogFormdfcon" :isLook="dialogLook" :isEdit="isEdit" :id="dfconFromData.custContactId"></ContactDfDetail>
      <div slot="footer" class="dialog-footer">
        <el-button @click="deldfcondialog">
          取消
        </el-button>
        <el-button type="primary" v-if="!dialogLook" @click="createCustAddr('dfcon')">
          确定
        </el-button>
      </div>
    </el-dialog>
    <el-dialog :show-close="false" :close-on-click-modal="false" title="客户活动" @open="hdDialogShow" :visible.sync="dialogFormhd" width="70%">
      <Activity ref="Activity"  v-if="dialogFormhd" @updateCustomerActivity="updateCustomerActivity" :isEdit="isEditActivity" :isLook="dialogLook" :componentState="true" :id="hdFromData.id"></Activity>
<!--      <el-form ref="hdFromDataForm" :model="hdFromData" :rules="hdrules" label-position="left" style="width: 100%;">-->
<!--        <el-row class="form-border">-->
<!--          <el-col :span="24">-->
<!--            <el-row class="fullRow">-->
<!--              <el-col :span="24">-->
<!--                <el-form-item label="活动编号:" class="postInfo-container-item">-->

<!--                  <el-input type="text" placeholder="" :disabled="true" v-model="hdFromData.custActId">-->
<!--                  </el-input>-->
<!--                </el-form-item>-->
<!--              </el-col>-->
<!--            </el-row>-->
<!--            <el-row class="fullRow">-->
<!--              <el-col :span="24">-->
<!--                <el-form-item label="活动状态:" prop="actStatus" class="postInfo-container-item">-->
<!--                  <template>-->
<!--                    <el-select default-first-option :clearable='true' placeholder="请选择" v-model="hdFromData.actStatus" filterable>-->
<!--                      <el-option v-for="item in seletData.hdstatu" :key="String(item.id)" :label="item.typeName" :value="String(item.id)">-->
<!--                      </el-option>-->
<!--                    </el-select>-->
<!--                  </template>-->
<!--                </el-form-item>-->
<!--              </el-col>-->
<!--            </el-row>-->
<!--            <el-row class="fullRow">-->
<!--              <el-col :span="24">-->
<!--                <el-form-item label="主题:" prop="subject" class="postInfo-container-item">-->

<!--                  <el-input type="text" placeholder="" v-model="hdFromData.subject">-->
<!--                  </el-input>-->
<!--                </el-form-item>-->
<!--              </el-col>-->
<!--            </el-row>-->
<!--            <el-row>-->
<!--              <el-col :span="12">-->
<!--                <el-form-item label="活动类型 :" prop="actType" class="postInfo-container-item">-->
<!--                  <template>-->
<!--                    <el-select default-first-option :clearable='true' placeholder="请选择" v-model="hdFromData.actType" filterable>-->
<!--                      <el-option v-for="item in seletData.hdtype" :key="String(item.id)" :label="item.typeName" :value="String(item.id)">-->
<!--                      </el-option>-->
<!--                    </el-select>-->
<!--                  </template>-->
<!--                </el-form-item>-->
<!--              </el-col>-->
<!--              <el-col :span="12">-->
<!--                <el-form-item label="活动方式:" prop="actKind" class="postInfo-container-item">-->
<!--                  <template>-->
<!--                    <el-select default-first-option :clearable='true' placeholder="请选择" v-model="hdFromData.actKind" filterable>-->
<!--                      <el-option v-for="item in seletData.hdfs" :key="String(item.id)" :label="item.typeName" :value="String(item.id)">-->
<!--                      </el-option>-->
<!--                    </el-select>-->
<!--                  </template>-->
<!--                </el-form-item>-->
<!--              </el-col>-->
<!--            </el-row>-->
<!--            <el-row>-->
<!--              <el-col :span="12">-->
<!--                <el-form-item label="开始时间 :" class="postInfo-container-item">-->
<!--                  <el-date-picker v-model="hdFromData.begindate" format='yyyy-MM-dd' value-format="yyyy-MM-dd" align="right" type="date" placeholder="选择日期" :picker-options="pickerOptions">-->
<!--                  </el-date-picker>-->
<!--                </el-form-item>-->
<!--              </el-col>-->
<!--              <el-col :span="12">-->
<!--                <el-form-item label="结束时间 :" class="postInfo-container-item">-->
<!--                  <el-date-picker v-model="hdFromData.enddate" format='yyyy-MM-dd' value-format="yyyy-MM-dd" align="right" type="date" placeholder="选择日期" :picker-options="pickerOptions">-->
<!--                  </el-date-picker>-->
<!--                </el-form-item>-->
<!--              </el-col>-->
<!--            </el-row>-->
<!--            <el-row class="fullRow">-->
<!--              <el-col :span="24">-->
<!--                <el-form-item label="地点:" class="postInfo-container-item">-->

<!--                  <el-input type="text" placeholder="" v-model="hdFromData.place">-->
<!--                  </el-input>-->
<!--                </el-form-item>-->
<!--              </el-col>-->
<!--            </el-row>-->
<!--            <el-row>-->
<!--              <el-col :span="12">-->
<!--                <el-form-item label="招待类型 :" class="postInfo-container-item">-->
<!--                  <template>-->
<!--                    <el-select default-first-option :clearable='true' placeholder="请选择" v-model="hdFromData.serviceType" filterable>-->
<!--                      <el-option v-for="item in seletData.zdfs" :key="String(item.id)" :label="item.typeName" :value="String(item.id)">-->
<!--                      </el-option>-->
<!--                    </el-select>-->
<!--                  </template>-->
<!--                </el-form-item>-->
<!--              </el-col>-->
<!--              <el-col :span="12">-->
<!--                <el-form-item label="招待地点 :" class="postInfo-container-item">-->

<!--                  <el-input type="text" placeholder="" v-model="hdFromData.servicePlace">-->
<!--                  </el-input>-->
<!--                </el-form-item>-->
<!--              </el-col>-->
<!--            </el-row>-->
<!--            <el-row>-->
<!--              <el-col :span="12">-->
<!--                <el-form-item label="赠送礼品 :" class="postInfo-container-item">-->
<!--                  <el-input type="text" placeholder="" v-model="hdFromData.putGift">-->
<!--                  </el-input>-->
<!--                </el-form-item>-->
<!--              </el-col>-->
<!--              <el-col :span="12">-->
<!--                <el-form-item label="收到礼品 :" class="postInfo-container-item">-->

<!--                  <el-input type="text" placeholder="" v-model="hdFromData.getGift">-->
<!--                  </el-input>-->
<!--                </el-form-item>-->
<!--              </el-col>-->
<!--            </el-row>-->
<!--            <el-row class="fullRow">-->
<!--              <el-col :span="24">-->
<!--                <el-form-item label="内容描述:" class="postInfo-container-item uploader-custfile">-->
<!--                  <template>-->
<!--                    <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="hdFromData.description">-->
<!--                    </el-input>-->
<!--                  </template>-->
<!--                </el-form-item>-->
<!--              </el-col>-->
<!--            </el-row>-->
<!--            <el-row class="fullRow  table-dl-row">-->
<!--              <el-col :span="24">-->
<!--                <el-form-item label="对方联系人:" class="postInfo-container-item uploader-custfile">-->
<!--                  <template>-->
<!--                    <el-row>-->
<!--                      <el-col :span="24" style='text-align:right'>-->
<!--                        <el-button type="primary" size="mini" @click="addhdDftable('dfcon')">添加-->
<!--                        </el-button>-->

<!--                      </el-col>-->
<!--                    </el-row>-->
<!--                    <el-table size="mini" :data="hdFromData.customerContactActs" :highlight-current-row='false' border fit empty-text="暂无数据" current-row-key style="width: 100%;">-->
<!--                      <el-table-column type="index" width="50" label="序号" align="left"></el-table-column>-->
<!--                      <el-table-column label="客户" align="left" width>-->
<!--                        <template slot-scope="scope">-->
<!--                          <el-select default-first-option ref='hddfselectref' :clearable='true' v-model="scope.row.custId" @change="((val)=>{hdkhselect(val, scope.row)})" no-match-text='暂无数据'-->
<!--                            loading-text='正在查询' filterable remote reserve-keyword placeholder="请输入关键词" :remote-method="remotepaternalUnitKh">-->
<!--                            <el-option v-for="(item,key) in seletData.paternalUnitKh" :key="key" :label="item.fullname" :value="item.custId">-->
<!--                            </el-option>-->
<!--                          </el-select>-->

<!--                        </template>-->
<!--                      </el-table-column>-->

<!--                      <el-table-column label="对方联系人" align="left" width>-->
<!--                        <template slot-scope="scope">-->
<!--                          <el-select default-first-option :clearable='true' placeholder="请选择" v-model="scope.row.custContactId" filterable>-->
<!--                            <el-option v-for="(item,key) in scope.row.hdlx" :key="key" :label="item.name" :value="item.custContactId">-->
<!--                            </el-option>-->
<!--                          </el-select>-->

<!--                        </template>-->
<!--                      </el-table-column>-->
<!--                      <el-table-column label="备注" align="left" width>-->
<!--                        <template slot-scope="scope">-->

<!--                          <el-input type="text" placeholder="" v-model="scope.row.memo">-->
<!--                          </el-input>-->
<!--                        </template>-->
<!--                      </el-table-column>-->

<!--                      <el-table-column label="操作" align="left" class-name="small-padding fixed-width">-->
<!--                        <template slot-scope="scope">-->
<!--                          <el-row>-->
<!--                            <el-col :span="24">-->
<!--                              <el-button size="mini" type="text" @click="handledeleElementhddfcon(scope.$index)">删除</el-button>-->
<!--                            </el-col>-->
<!--                          </el-row>-->

<!--                        </template>-->
<!--                      </el-table-column>-->
<!--                    </el-table>-->
<!--                  </template>-->
<!--                </el-form-item>-->
<!--              </el-col>-->
<!--            </el-row>-->
<!--            <el-row class="fullRow  table-dl-row">-->
<!--              <el-col :span="24">-->
<!--                <el-form-item label="" class="postInfo-container-item uploader-custfile">-->
<!--                  <template>-->
<!--                    <el-row>-->
<!--                      <el-col :span="24" style='text-align:right'>-->
<!--                        <el-button type="primary" size="mini" @click="addhdDftable('wfcon')">添加-->
<!--                        </el-button>-->
<!--                      </el-col>-->
<!--                    </el-row>-->
<!--                    <el-table size="mini" :data="hdFromData.agencyContactActs" border fit empty-text="暂无数据" :highlight-current-row='false' current-row-key>-->
<!--                      <el-table-column type="index" width="50" label="序号" align="left"></el-table-column>-->
<!--                      <el-table-column label="员工" align="left" width>-->
<!--                        <template slot-scope="scope">-->

<!--                          <el-select default-first-option :clearable='true' placeholder="请选择" v-model="scope.row.userId" filterable>-->
<!--                            <el-option v-for="item in seletData.userNames" :key="item.userId" :label="item.fullname" :value="item.userId">-->
<!--                            </el-option>-->
<!--                          </el-select>-->

<!--                        </template>-->
<!--                      </el-table-column>-->

<!--                      <el-table-column label="备注" align="left" width>-->
<!--                        <template slot-scope="scope">-->

<!--                          <el-input type="text" placeholder="" v-model="scope.row.memo">-->
<!--                          </el-input>-->
<!--                        </template>-->
<!--                      </el-table-column>-->

<!--                      <el-table-column label="操作" align="left" width="430" class-name="small-padding fixed-width">-->
<!--                        <template slot-scope="scope">-->
<!--                          <el-row>-->
<!--                            <el-col :span="24">-->

<!--                              <el-button size="mini" type="text" @click="handledeleElementhdwfcon(scope.$index)">删除</el-button>-->

<!--                            </el-col>-->
<!--                          </el-row>-->

<!--                        </template>-->
<!--                      </el-table-column>-->
<!--                    </el-table>-->
<!--                  </template>-->
<!--                </el-form-item>-->
<!--              </el-col>-->
<!--            </el-row>-->

<!--          </el-col>-->
<!--        </el-row>-->

<!--      </el-form>-->
      <div slot="footer" class="dialog-footer">
        <el-button @click="()=>{this.dialogFormhd = false;}">
          取消
        </el-button>
        <el-button v-if="!dialogLook" type="primary" @click="dialogFormStatus==='create'?createCustAddr('hd'):updateCustAddr('hd')">
          确定
        </el-button>
      </div>
    </el-dialog>
    <el-dialog :show-close="false" :close-on-click-modal="false" title="我方联系人" :visible.sync="dialogFormwfcon" width="70%">
      <el-form ref="creatwfconForm" :model="wfconFromData" label-position="left" style="width: 100%;">
        <el-row class="form-border">
          <el-col :span="24">

            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="姓名:" class="postInfo-container-item">
                  <template>
                    <span v-if="dialogLook">{{wfconFromData.fullname}}</span>
                    <el-select v-else default-first-option :clearable='true' @change="wfUserNamechange" placeholder="请选择" v-model="wfconFromData.userId" filterable>
                      <el-option v-for="item in seletData.wfuserNames" :key="item.userId" :label="item.fullname" :value="item.userId">
<!--                        <UserIconAndUserName :user-id="item.userId"></UserIconAndUserName>-->
                      </el-option>
                    </el-select>
                  </template>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="业务领域 :" class="postInfo-container-item">
                  <template>
                    <span v-if="dialogLook">{{wfconFromData.business}}</span>
                    <el-select v-else default-first-option :clearable='true' placeholder="请选择" v-model="wfconFromData.business" filterable>
                      <el-option v-for="item in seletData.ywstuta" :key="String(item.typeName)" :label="item.typeName" :value="String(item.typeName)">
                      </el-option>
                    </el-select>
                  </template>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="案件类型:" class="postInfo-container-item">
                  <template>
                    <span v-if="dialogLook">{{wfconFromData.caseTypeStr}}</span>
                    <el-select v-else default-first-option :clearable='true' placeholder="请选择" v-model="wfconFromData.caseTypeId" filterable>
                      <el-option v-for="item in seletData.caseType" :key="item.caseTypeId" :label="item.caseType" :value="item.caseTypeId">
                      </el-option>
                    </el-select>
                  </template>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="职位:" class="postInfo-container-item">
                  <span v-if="dialogLook">{{wfconFromData.position}}</span>
                  <el-select v-else default-first-option v-model="wfconFromData.position" clearable filterable placeholder="请选择">
                    <el-option v-for="item in queryPositionList" :key="item.position" :label="item.position" :value="item.position">
                    </el-option>
                  </el-select>
<!--                  <el-input type="text"  placeholder="" v-model="wfconFromData.position">-->
<!--                  </el-input>-->
                </el-form-item>
              </el-col>
            </el-row>

            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="角色描述:" class="postInfo-container-item">
                  <template>
                    <span v-if="dialogLook">{{wfconFromData.userrole}}</span>
                    <el-select v-else default-first-option :clearable='true' placeholder="请选择" v-model="wfconFromData.userrole" filterable>
                      <el-option v-for="item in seletData.roleMessage" :key="String(item.typeName)" :label="item.typeName" :value="String(item.typeName)">
                      </el-option>
                    </el-select>
                  </template>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="开始日期:" class="postInfo-container-item">
                  <span v-if="dialogLook">{{wfconFromData.startdate}}</span>
                  <el-date-picker v-else v-model="wfconFromData.startdate" format='yyyy-MM-dd' value-format="yyyy-MM-dd" align="right" type="date" placeholder="选择日期" :picker-options="pickerOptions">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="截止日期:" class="postInfo-container-item">
                  <span v-if="dialogLook">{{wfconFromData.enddate}}</span>
                  <el-date-picker v-else v-model="wfconFromData.enddate" format='yyyy-MM-dd' value-format="yyyy-MM-dd" align="right" type="date" placeholder="选择日期" :picker-options="pickerOptions">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row >
              <el-col :span="12">
                <el-form-item label="能否查看全部案件:" class="postInfo-container-item">
                  <span v-if="dialogLook">{{wfconFromData.ischeck ? '是' : '否'}}</span>
                  <el-radio-group v-else v-model="wfconFromData.ischeck">
                    <el-radio :label='1'>是</el-radio>
                    <el-radio :label='0'>否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="能否查看全部时限:" class="postInfo-container-item">
                  <span v-if="dialogLook">{{wfconFromData.isAllTlt ? '是' : '否'}}</span>
                  <el-radio-group v-else v-model="wfconFromData.isAllTlt">
                    <el-radio :label='1'>是</el-radio>
                    <el-radio :label='0'>否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="是否处理全部待报告:" class="postInfo-container-item">
                  <span v-if="dialogLook">{{wfconFromData.mailtodoStr}}</span>
                  <el-radio-group v-else v-model="wfconFromData.mailtodo">
                    <el-radio :label='1'>是</el-radio>
                    <el-radio :label='0'>否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="备注:" class="postInfo-container-item uploader-custfile">
                  <template>
                    <span v-if="dialogLook">{{wfconFromData.memo}}</span>
                    <el-input v-else type="textarea" :rows="2" placeholder="请输入内容" v-model="wfconFromData.memo">
                    </el-input>
                  </template>
                </el-form-item>
              </el-col>
            </el-row>

          </el-col>
        </el-row>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="()=>{this.dialogFormwfcon = false;}">
          取消
        </el-button>
        <el-button v-if="!dialogLook" type="primary" @click="dialogFormStatus==='create'?createCustAddr('wfcon'):updateCustAddr('wfcon')">
          确定
        </el-button>
      </div>
    </el-dialog>

    <el-dialog title="全部" :visible.sync="alldialogVisible" :append-to-body="true" :show-close="false" :before-close="allhandleClose" width="70%">
      <el-table size="mini" v-if='alldialogBool=="hd"' :data="alltableData" border fit empty-text="暂无数据" highlight-current-row current-row-key style="width: 100%;">
        <el-table-column type="index" width="50" label="序号" align="left"></el-table-column>
        <el-table-column label="主题" align="left" width>
          <template slot-scope="scope">
            <span>{{ scope.row.subject }}</span>
          </template>
        </el-table-column>
        <el-table-column label="开始时间" align="left" width>
          <template slot-scope="scope">
            <span>{{ scope.row.begindate }}</span>
          </template>
        </el-table-column>

        <el-table-column label="赠送礼品" align="left" width>
          <template slot-scope="scope">
            <span>{{ scope.row.putGift }}</span>
          </template>
        </el-table-column>
        <el-table-column label="内容描述" align="left" width>
          <template slot-scope="scope">
            <span>{{ scope.row.description }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="left" width="" class-name="small-padding fixed-width">
          <template slot-scope="scope">

            <el-button size="mini" type="text" @click="custAddrupdata(scope.row,'hd', true)">查看</el-button>
            <el-button size="mini" type="text" @click="custAddrupdata(scope.row,'hd')">修改</el-button>
            <el-button size="mini" type="text" @click="custAddrdel(scope.row,scope.$index,'hd')">删除</el-button>

          </template>
        </el-table-column>
      </el-table>
      <el-table size="mini" v-if='alldialogBool=="dfcon"' :data="alltableData" border fit empty-text="暂无数据" highlight-current-row current-row-key style="width: 100%;">
        <el-table-column label="姓名" align="left" width>
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="职务" align="left" width>
          <template slot-scope="scope">
            <span>{{ scope.row.jobtitle }}</span>
          </template>
        </el-table-column>
        <el-table-column label="部门" align="left" width>
          <template slot-scope="scope">
            <span>{{ scope.row.department }}</span>
          </template>
        </el-table-column>
        <el-table-column label="办公电话" align="left" width>
          <template slot-scope="scope">
            <span>{{ scope.row.tel }}</span>
          </template>
        </el-table-column>
        <el-table-column label="邮箱" align="left" width>
          <template slot-scope="scope">
            <span>{{ scope.row.email }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="left" width>
          <template slot-scope="scope">
            <span>{{ scope.row.statusStr }}</span>
          </template>
        </el-table-column>
        <el-table-column label="启用" align="left" width>
          <template slot-scope="scope">
            <span>{{ scope.row.sysStatusStr }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="left" width="" class-name="small-padding fixed-width">
          <template slot-scope="scope">

            <el-button size="mini" type="text" @click="custAddrupdata(scope.row,'dfcon', true)">查看</el-button>
            <el-button size="mini" type="text" @click="custAddrupdata(scope.row,'dfcon')">修改</el-button>
            <el-button v-if="!isBillEdit" size="mini" type="text" @click="custAddrdel(scope.row,scope.$index,'dfcon')">删除</el-button>

          </template>
        </el-table-column>
      </el-table>
      <el-table size="mini" v-if='alldialogBool=="addr"' :data="alltableData" border fit empty-text="暂无数据" highlight-current-row current-row-key style="width: 100%;">
        <el-table-column type="index" width="50" label="序号" align="left"></el-table-column>
        <el-table-column label="信函抬头" align="left" width>
          <template slot-scope="scope">
            <span>{{ scope.row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column label="大洲" align="left" width>
          <template slot-scope="scope">
            <span>{{ scope.row.continent }}</span>
          </template>
        </el-table-column>
        <el-table-column label="国家" align="left" width>
          <template slot-scope="scope">
            <span>{{ scope.row.country }}</span>
          </template>
        </el-table-column>
        <el-table-column label="州省份" align="left" width>
          <template slot-scope="scope">
            <span>{{ scope.row.province }}</span>
          </template>
        </el-table-column>
        <el-table-column label="城市" align="left" width>
          <template slot-scope="scope">
            <span>{{ scope.row.city }}</span>
          </template>
        </el-table-column>
        <el-table-column label="中文地址" align="left" width>
          <template slot-scope="scope">
            <span>{{ scope.row.addressCn }}</span>
          </template>
        </el-table-column>
        <el-table-column label="英文地址" align="left" width>
          <template slot-scope="scope">
            <span>{{ scope.row.addressEn }}</span>
          </template>
        </el-table-column>
        <el-table-column label="邮编" align="left" width>
          <template slot-scope="scope">
            <span>{{ scope.row.post }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="left" width>
          <template slot-scope="scope">
            <span>{{ scope.row.statusStr }}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" align="left" width>
          <template slot-scope="scope">
            <span>{{ scope.row.memo }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="left" width="" class-name="small-padding fixed-width">
          <template slot-scope="scope">

            <el-button size="mini" type="text" @click="custAddrupdata(scope.row,'addr', true)">查看</el-button>
            <el-button size="mini" type="text" @click="custAddrupdata(scope.row,'addr')">修改</el-button>
            <el-button v-if="!isBillEdit" size="mini" type="text" @click="custAddrdel(scope.row,scope.$index,'addr')">删除</el-button>

          </template>
        </el-table-column>
      </el-table>
      <el-table size="mini" v-if='alldialogBool=="wfcon"' :data="alltableData" border fit empty-text="暂无数据" highlight-current-row current-row-key style="width: 100%;">
        <el-table-column type="index" width="50" label="序号" align="left"></el-table-column>
        <el-table-column label="姓名" align="left" width>
          <template slot-scope="scope">
            <span>{{ scope.row.fullname }}</span>
          </template>
        </el-table-column>
        <el-table-column label="业务领域" align="left" width>
          <template slot-scope="scope">
            <span>{{ scope.row.business }}</span>
          </template>
        </el-table-column>
        <el-table-column label="案件类型" align="left" width>
          <template slot-scope="scope">
            <span>{{ scope.row.caseTypeStr }}</span>
          </template>
        </el-table-column>
        <el-table-column label="职位" align="left" width>
          <template slot-scope="scope">
            <span>{{ scope.row.position }}</span>
          </template>
        </el-table-column>
        <el-table-column label="角色描述" align="left" width>
          <template slot-scope="scope">
            <span>{{ scope.row.userrole }}</span>
          </template>
        </el-table-column>
        <el-table-column label="开始日期" align="left" width>
          <template slot-scope="scope">
            <span>{{ scope.row.startdate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="截止日期" align="left" width>
          <template slot-scope="scope">
            <span>{{ scope.row.enddate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" align="left" width>
          <template slot-scope="scope">
            <span>{{ scope.row.memo }}</span>
          </template>
        </el-table-column>
        <el-table-column label="查全部案件" align="left" width>
          <template slot-scope="scope">
            <span>{{ scope.row.ischeckStr }}</span>
          </template>
        </el-table-column>
        <el-table-column label="查全部时限" align="left" width>
          <template slot-scope="scope">
            <span>{{ scope.row.isAllTltStr }}</span>
          </template>
        </el-table-column>
        <el-table-column label="处理全部待报告" align="left" width>
          <template slot-scope="scope">
            <span>{{ scope.row.mailtodoStr }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="left" width="" class-name="small-padding fixed-width">
          <template slot-scope="scope">

            <el-button size="mini" type="text" @click="custAddrupdata(scope.row,'wfcon', true)">查看</el-button>
            <el-button size="mini" type="text" @click="custAddrupdata(scope.row,'wfcon')">修改</el-button>
            <el-button size="mini" type="text" @click="custAddrdel(scope.row,scope.$index,'wfcon')">删除</el-button>

          </template>
        </el-table-column>
      </el-table>
      <el-table size="mini" v-if='alldialogBool=="glgs"' :data="alltableData" border fit empty-text="暂无数据" highlight-current-row current-row-key style="width: 100%;">
        <el-table-column type="index" width="50" label="序号" align="left"></el-table-column>
        <el-table-column label="公司名称" align="left" width>
          <template slot-scope="scope">
            <el-input type="text" placeholder="" v-model="scope.row.custAssName">
            </el-input>
          </template>
        </el-table-column>
        <el-table-column label="与关联公司关系" align="left" width>
          <template slot-scope="scope">
            <el-input type="text" placeholder="" v-model="scope.row.relationship">
            </el-input>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="left" width="" class-name="small-padding fixed-width">
          <template slot-scope="scope">

            <el-button size="mini" type="text" @click="handledeleElementglgs(scope.$index)">删除</el-button>

          </template>
        </el-table-column>
      </el-table>
      <el-table size="mini" v-if='alldialogBool=="hy"' :data="alltableData" border fit empty-text="暂无数据" highlight-current-row current-row-key style="width: 100%;">
        <el-table-column type="index" width="50" label="序号" align="left"></el-table-column>
        <el-table-column label="行业" align="left" width>
          <template slot-scope="scope">
            <el-select default-first-option :clearable='true' placeholder="请选择" v-model="scope.row.induId" filterable>
              <el-option v-for="(item,key) in seletData.industry" :key="key" :label="item.fname" :value="item.induid">
              </el-option>

            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="细分行业" align="left" width>
          <template slot-scope="scope">
            <el-input type="text" placeholder="" v-model="scope.row.info">
            </el-input>
          </template>
        </el-table-column>
        <el-table-column label="行业标签" align="left" width>
          <template slot-scope="scope">
            <el-select v-model="scope.row.customerTags" filterable allow-create multiple clearable default-first-option placeholder="请选择标签">
              <el-option
                v-for="item in industryTagList"
                :key="item.tagName"
                :label="item.tagName"
                :value="item.tagName">
              </el-option>
            </el-select>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="left" width="" class-name="small-padding fixed-width">
          <template slot-scope="scope">

            <el-button size="mini" type="text" @click="handledeleElementhy(scope.$index)">删除</el-button>

          </template>
        </el-table-column>
      </el-table>
      <el-table size="mini" v-if='alldialogBool=="lyct"' :data="alltableData" border fit empty-text="暂无数据" highlight-current-row current-row-key style="width: 100%;">
        <el-table-column type="index" width="50" label="序号" align="left"></el-table-column>
        <el-table-column label="利益冲突者名称" align="left" width>
          <template slot-scope="scope">

            <el-select default-first-option :clearable='true' v-model="scope.row.fullname" @change="conflictersChange(scope.row)" no-match-text='暂无数据' loading-text='正在查询' filterable remote reserve-keyword placeholder="请输入关键词"
              :remote-method="remotepaternalUnitactivityList">
              <el-option v-for="item in seletData.activityList" :key="String(item.conId)" :label="item.fullname" :value="item.fullname">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="备注" align="left" width>
          <template slot-scope="scope">
            <el-input type="text" placeholder="" v-model="scope.row.memo">
            </el-input>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="left" width="" class-name="small-padding fixed-width">
          <template slot-scope="scope">

            <el-button size="mini" type="text" @click="handledeleElementlyct(scope.$index)">删除</el-button>

          </template>
        </el-table-column>
      </el-table>

      <span slot="footer" class="dialog-footer">

        <el-button @click="alldialogVisible = false">关闭</el-button>

      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  addCustomer,
  delCustomer,
  querycustSelectClass,
  queryFiliale,
  queryCustomerNameId,
  queryUserByPermissionId,
  queryCountry,
  addCustomerAddrUrl,
  updateCustomerAddrUrl,
  delCustomerAddrUrl,
  queryCustomerContactCustIdUrl,
  addCustomerContactUrl,
  updateCustomerContacturl,
  delCustomerContacturl,
  queryCustomersUrl,
  queryUserNamesUrl,
  addActivityUrl,
  delActivity,
  updateActivityUrl,
  queryCaseTypeUrl,
  querywfUserNameUrl,
  allocationCustomerUrl,
  delAgencyContactUrl,
  updateAgencyContactUrl,
  delCustomerFile,
  queryCustomerReqTypeUrl,
  queryregCaseTypeUrl,
  addCustomerRequirementUrl,
  updateCustomerRequirementUrl,
  delCustomerRequirementUrl,
  queryActivityListflUrl,
  queryIndustryUrl,
  queryCustomerUrl,
  updateCustomerUrl,
  queryCurrencyUrl,
  queryPayAcountUrl,
  queryCustomerAddrUrl,
  queryCustomerContactUrl,
  queryActivityOneUrl,
  queryAgencyContactUrl,
  queryCustomerRequirementUrl,
  addCustomerContactAgencyUrl,
  queryCustomerContactAgencyUrl,
  updateCustomerContactAgencyUrl,
  delCustomerContactAgencyUrl,
  CustomerExamineUrl,
  queryCaseType,
  queryCustomerAddrListUrl,
  queryChargeItemUrl,
  queryCustomerRequirementBycustIdUrl,
  queryActivityListUrl,
  deleteCustomerIcon,
  queryAgencyContactListUrl
} from "@/api/customerList";
import serviceApi from "@/api/serviceApi.config.js";
import { queryCustomerSource } from "@/api/caseList"
import { mapGetters } from "vuex";
import Vue from "vue";
import { truncate } from "fs";
import { getTwoDimensionalArray } from "@/utils/index.js";
// import { CustZs } from "@/views/workbench/customer_management/customer_list/components/CustZs.vue";
import {queryUserByRoleId} from '@/api/caseList'
import {
queryPosition,
} from "@/api/systemList";
import ContactDfDetail from '@/views/workbench/customer_management/contact_df_management/components/ContactDfDetail.vue'
import Activity from '@/views/workbench/customer_management/activity_management/components/Activity.vue'
import CustZs from "./CustZs";
import { queryIndustryTag } from '../../../../../api/customerList'
const titlesArr = {
  "jbxx-title": 0,
  "khdz-title": 1,
  "dflxr-title": 2,
  "khhd-title": 3,
  "wflxr-title": 4,
  "khzs-title": 5,
  "glgs-title": 6,
  "lyct-title": 7,
  "hy-title": 8
};
export default {
  name: "CustDetail",
  computed: {
    ...mapGetters(["token", "name"])
  },
  components: { CustZs, ContactDfDetail ,Activity},
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    isBillEdit: {
      type: Boolean,
      default: false
    },
    billCustId: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      dfCreated: false,
      industryTagList: [],
      dialogLook: false,
      hzdisabled: true,
      alldialogBool: "",
      alltableData: [],
      alldialogVisible: false,
      disabledZs: false,
      dfdzlist: [],
      iconIsDel: false,
      isShow: false,
      hdrules: {
        subject: [
          {
            required: true,
            trigger: "blur"
          }
        ],
        actStatus: [
          {
            required: true,
            trigger: "change"
          }
        ],
        actType: [
          {
            required: true,
            trigger: "change"
          }
        ],
        actKind: [
          {
            required: true,
            trigger: "change"
          }
        ]
      },
      userIconCust: "",
      dfuserIconCust: "",
      popoverShow: false,
      gridData: [],
      dialogFormdfwfcon: false,
      zsfileUploadbool: false,
      isCreatTrue: false,
      creatAddrForm: {},
      stepActive: 0,
      sourceList:[],
      postForm: {
        caseType: '',
        mailConfigs: [1, 2, 3],
        custGrade:'',
        name: "",
        custId: "",
        examineStatus: "1623",
        userIcon: "",
        materiaoList: [],
        fullname: "",
        fullnameEn: "",
        fgFullname: "",
        contactLanguage: "",
        isCollaboration: "",
        firstcaseCollitem: "",
        parentCustId: "",
        legalNature: "",
        isAgent: "",
        curStatus: "",
        certType: "",
        idNumber: "",
        level: "",
        actLevel: "",
        source: '',
        certCode: "",
        custIntroductor: "",
        custIntroCompany: "",
        ownerDeptid: "",
        country: "",
        continent: "",
        province: "",
        city: "",
        website: "",
        fax1: "",
        phone: "",
        email: "",
        info: "",
        memo: "",
        isOfficial: "",
        isCustomer: "1",
        curStatusDesc: "",
        annualAccDate: "",
        mailConfig: [],
        ourImporter: "",
        auditUserName: "",
        customerAddrs: [],
        customerContacts: [],
        activities: [],
        agencyContacts: [],
        customerRequirements: [],
        customerAssociates: [],
        conflicters: [],
        customerIndustrys: [],
        ctData: []
      },
      dfagencyContacts: [],
      loading: false,
      dialogFormAddr: false,
      dialogFormStatus: "",
      dialogFormdfcon: false,
      dialogFormhd: false,
      dialogFormwfcon: false,
      dialogFormzs: false,
      hdlx: "",
      customerUserIdList:[],
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
            type: "array",
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
            trigger: "change"
          }
        ],
        ownerDeptid: [
          {
            required: true,
            trigger: "change"
          }
        ],
        source: [
          {
            required: true,
            trigger: "change"
          }
        ]
      },
      dfconRules: {
        name: [
          {
            required: true,
            trigger: "change",
            message: "请填写姓名"
          }
        ],
        gender: [
          {
            required: true,
            trigger: "change",
            message: "请选择性别"
          }
        ],
        ismain: [
          {
            required: true,
            trigger: "change",
            message: "请选择是否主联系人"
          }
        ],
        isBillContact: [
          {
            required: true,
            trigger: "change",
            message: "请选择是否账单联系人"
          }
        ],
        status: [
          {
            required: true,
            trigger: "change",
            message: "请选择状态"
          }
        ],
        sysStatus: [
          {
            required: true,
            trigger: "change",
            message: "请选择启用状态"
          }
        ]
      },
      userIconUrl: serviceApi.addCustomerIcon,
      dfuserIconUrl: serviceApi.addCustomerContactIcon,
      usericonSendData: {
        tokenID: "",
        custId: ""
      },
      custContIconSendData: {
        tokenID: "",
        custContactId: "",
        custId: ""
      },
      deldata: {
        customerID: ""
      },
      custContIconSendData: {},
      addCustomerFileUrl: serviceApi.addCustomerFile,
      addCustomerFileData: {
        tokenID: "",
        custId: "",
        fileNames: ""
      },
      custContactFileUrl: serviceApi.addCustomerContactFileurl,
      custContactFiledata: {
        tokenID: "",
        custContactId: "",
        fileNames: ""
      },
      addCustomerRequirementFileUrl: serviceApi.addCustomerRequirementFileUrl,
      addCustomerRequirementFileData: {
        tokenID: "",
        custId: "",
        id: "",
        indicateType: "",
        fileNames: ""
      },

      custfileLists: [], //客户文档
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
      // select的获取id有对应文档查询
      seletDataArr:
        "1129,1042,1,1044,1053,1045,1076,1050,1049,1051,1052,1112,1063,5,4,1156",
      seletData: {
        hzzt: [],
        chargeItemlist: [],
        dfkhdzlist: [],
        comLanguage: [], //沟通语言
        mainLegalNature: [], //主法律性质
        customerSource: [], //客户来源
        paternalUnit: [], //父单位
        paternalUnitKh: [], //kh
        customerOwner: [], //客户所有者
        censor: [],
        caseType: [],
        ctDataOption: [],
        statu: {},
        sex: {},
        lxstatu: {},
        called: {},
        dfcon: {},
        hdstatu: {},
        hdtype: {},
        hdfs: {},
        zdfs: {},
        userNames: {},
        wfuserNames: {},
        ywstuta: {},
        roleMessage: {},
        reqType: {},
        caseTypezs: {},
        activityList: {},
        industry: {},
        payAcount: [],
        curId: [],
        gradeList:[]
      },
      // 添加客户地址相关属性-->
      addrFromData: {
        custId: "",
        title: "",
        addressCn: "",
        addressEn: "",
        isMailAdd: "",
        isBillAdd: "",
        addressMail: "",
        post: "",
        continent: "",
        country: "",
        province: "",
        city: "",
        status: "",
        memo: "",
        ctData: []
      },

      // 添加对方联系人相关属性-->
      dfconFromData: {
        examineStatus: "1623",
        custId: "",

        custContactId: "",
        firstname: "",
        name: "",
        gender: "",
        custContIcon: "",
        custContactFile: [],
        called: "",
        birthday: "",
        bustype: "",
        branch: "",
        ismain: "",
        isBillContact: "",
        department: "",
        jobtitle: "",
        status: "",
        sysStatus: "",
        isCollectbillMan: "",
        tel: "",
        mobile2: "",
        mobile1: "",
        phone2: "",
        email: "",
        email2: "",
        fax1: "",
        msgType: "",
        msgAccount: "",
        bossCustContactId: "",
        gxr1CustContactId: "",
        relat1: "",
        gxr2CustContactId: "",
        relat2: "",
        gxr3CustContactId: "",
        relat3: "",
        infoFromStaff: "",
        infoFromPlace: "",
        infoFromDate: "",
        routineAct: "",
        routineActMemo: "",
        customerContactAgencyContacts: []
      },
      // <--添加对方联系人相关属性
      // 添加活动相关属性-->
      hdFromData: {
        examineStatus: "1623",
        custActId: "",
        actStatus: "",
        subject: "",
        actType: "",
        actKind: "",
        begindate: "",
        enddate: "",
        place: "",
        serviceType: "",
        servicePlace: "",
        putGift: "",
        getGift: "",
        description: "",
        customerContactActs: [],
        agencyContactActs: []
      },
      // <--添加活动相关属性
      // 添加我方联系人相关属性-->
      dfwfconFromData: {
        custContactId: "",
        position: "",
        userId: "",

        custContactAgencyContactId: "",

        memo: "",

        userrole: "",

        business: "",

        startdate: "",

        enddate: ""
      },
      wfconFromData: {
        custId: "",
        userId: "",
        startdate: "",
        enddate: "",
        business: "",
        roleId: "",
        caseTypeId: "",
        userrole: "",
        memo: "",
        position: "",
        ischeck: ""
      },
      // <--添加活动相关属性

      // 添加指示相关属性-->
      zsFromData: {
        custId: "",
        indicateType: "",
        examineStatus: "1623",
        caseTypeIdArray: [],
        caseTypeIds: [],
        specialInfo: "",
        price: "",

        chargeItemId: "",

        startDate: "",

        endDate: "",

        status: "",

        memo: "",

        billIfmonth: "",

        billSenddate: "",

        billSendtype: "",

        curId: "",

        value: "",

        payAcountId: "",

        appId: "",
        ID: "",
        id: ""
      },
      queryPositionList:[],
      managementCommitteePartner:[],
      responsiblePartner:[],
      isEditActivity:false,
      cssFlag:false
      // <--添加指示相关属性
    };
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll, true);
    // if (this.billCustId != "") {
    //   this.fetchData(this.billCustId);
    // }
  },
  async created() {
    if (this.isEdit) {
      var id = this.$route.params && this.$route.params.id;
      if (this.billCustId != "") {
        id = this.billCustId;
      }
      await this.fetchData(id);
    } else {
      addCustomer({isCustomer:1}).then(response => {
        if (response.success) {
          this.postForm = response.data;
          this.queryCustomerSource()
          queryUserByRoleId({roleId:'2049'}).then(res=>{
            this.responsibleList = res.data
            this.responsiblePartner= this.responsibleList.filter(item=>this.postForm.customerResponsibleArray.map(itm=>itm.userId).includes(item.userId))
          })
        } else {
          this.$message.error(response.message);
        }
      });
    }
    this.queryIndustryTag()
    this.getAllSelectData();
  },
  watch: {
    sourceList(){
      this.postForm.source=this.sourceList[this.sourceList.length-1]
    },
    gridData(val) {
      this.popoverShow = true;
    },
    responsiblePartner:{
      handler(n){
        if(n.length){
          this.cssFlag=true
        }else {
          this.cssFlag=false
        }
      },
      deep:true
    },
    "postForm.ctData": function(data, oldval) {
      this.postForm.country = "";
      this.postForm.province = "";
      this.postForm.city = "";
      if (data && data[0]) {
        this.postForm.country = data[0];
      }
      if (data && data[1]) {
        this.postForm.province = data[1];
      }
      if (data && data[2]) {
        this.postForm.city = data[2];
      }

      if (data && data.length && !this.postForm.continent) {
        this.postForm.continent = this.getcontinent(data[0]);
      }
    },

    "addrFromData.ctData": function(data, oldval) {
      this.addrFromData.country = "";
      this.addrFromData.province = "";
      this.addrFromData.city = "";
      if (data && data[0]) {
        this.addrFromData.country = data[0];
      }
      if (data && data[1]) {
        this.addrFromData.province = data[1];
      }
      if (data && data[2]) {
        this.addrFromData.city = data[2];
      }

      this.addrFromData.continent = this.getcontinent(data[0]);
    }
  },
  methods: {
    queryIndustryTag() {
      queryIndustryTag().then(res => {
        this.industryTagList = res.data || []
      })
    },
    changeReviewer(userId){
      if(!userId){
        this.postForm.submissionDepartmentStr = ''
      }
      this.postForm.submissionDepartmentStr = this.$store.getters.userList.find(item => item.userId == userId).domainName
    },
    showDelIcon() {
      this.isShow = true;
    },
    hideDelIcon() {
      this.isShow = false;
    },
    btnDelete() {
      console.log(111);
      this.$confirm(`确认是否删除照片？`, '删除', {
        confirmButtonText: '确定',
        type: "warning"
      }).then(() => {
        deleteCustomerIcon({custId: this.postForm.custId}).then((req) => {
          this.iconIsDel = true;
          let msg = req.message;
          this.$message({
            type: 'success',
            message: msg
          })
        })
      })
    },
    queryCustomerSource() {
      queryCustomerSource().then(res=>{
        this.seletData.customerSource = res.data
        this.sourceList = this.$commonUtils.getTwoDimensionalArray( this.seletData.customerSource,'id',this.postForm.source,{children:'childrens',parent:'parentId'})
      })
    },
    changeCustomerUserIdList(){
      this.postForm.customerResponsibleArray=this.customerUserIdList.map(item=>({
        userId:item,
        userDomains: this.postForm.customerResponsibleArray.find(i=>i.userId==item)?this.postForm.customerResponsibleArray.find(i=>i.userId==item)['userDomains']:[],
        principalRole: this.postForm.customerResponsibleArray.find(i=>i.userId==item)?this.postForm.customerResponsibleArray.find(i=>i.userId==item)['principalRole']:[]
      }))
    },
    filterMethod(text){
      if(text==''){
        this.responsiblePartner= this.responsibleList.filter(item=>this.postForm.customerResponsibleArray.map(itm=>itm.userId).includes(item.userId))
        return
      }
      let list=[...this.responsibleList.filter(item=>this.postForm.customerResponsibleArray.map(itm=>itm.userId).includes(item.userId)),...this.responsibleList.filter(item=>item.fullname.includes(text))]
      this.responsiblePartner=this.$commonUtils.unique(list,'userId')
    },
    async fetchData(id) {
      await queryCustomerUrl({ customerID: id })
        .then(response => {
          this.postForm = this.$commonUtils.cleanNullAttr(response.data || {});
          if (this.postForm.customerIndustrys && this.postForm.customerIndustrys.length) {
            this.postForm.customerIndustrys.forEach(item => {
              if (item.customerTags && item.customerTags.length) {
                item.customerTags = item.customerTags.map(itm => itm.tagName)
              }
            })
          }
          this.customerUserIdList=this.postForm.customerResponsibleArray.map(item=>{
            if(!item.userDomains){
              item.userDomains = []
            }
           return item.userId
          })
         this.queryCustomerSource()
          queryUserByRoleId({roleId:'2049'}).then(res=>{
            this.responsibleList = res.data
            this.responsiblePartner= this.responsibleList.filter(item=>this.postForm.customerResponsibleArray.map(itm=>itm.userId).includes(item.userId))
          })
          this.postForm.materialList.forEach(item=>item.url='ipdoc'+item.url)
          Vue.set(this.postForm, "ctData", []);
          this.postForm.ctData = [
            this.postForm.country,
            this.postForm.province,
            this.postForm.city
          ];
          if (this.postForm.isCurStatus == "1") {
            this.hzdisabled = false;
          } else {
            this.hzdisabled = true;
          }
          if (this.postForm.parentCustId) {
            queryCustomerNameId({
              isCustomer: "1",
              custId: this.postForm.parentCustId
            }).then(response => {
              this.seletData.paternalUnit = response.data;
            });
          }
          if (this.postForm.userIcon) {
            this.userIconCust = `/ipdoc${this.postForm.userIcon}`;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    customerExamine(type) {
      CustomerExamineUrl({
        custId: this.postForm.custId,
        examineStatus: type
      }).then(res => {
        this.$router.push({
          path: "/workbench/customer_management/customer_list",
          query: { sc: "1", custid: this.postForm.custId }
        });
      });
    },
    queryPosition() {
      queryPosition().then(res => {
          this.queryPositionList = res.data;
      });
    },
    allMessageFormShow(type) {
      this.alldialogVisible = true;

      switch (type) {
        case "dfcon":
          queryCustomerContactCustIdUrl({
            customerId: this.postForm.custId
          }).then(res => {
            this.alltableData = res.data;
            this.alldialogBool = "dfcon";
          });
          break;
        case "hd":
          queryActivityListUrl({
            isCustomer: "1",
            custId: this.postForm.custId,
            pageSize: 9999
          }).then(res => {
            this.alltableData = res.data;
            this.alldialogBool = "hd";
          });
          break;
        case "addr":
          queryCustomerAddrListUrl({
            custId: this.postForm.custId
          }).then(res => {
            this.alltableData = res.data;
            this.alldialogBool = "addr";
          });
          break;
        case "wfcon":
          queryAgencyContactListUrl({
            customerID: this.postForm.custId
          }).then(res => {
            this.alltableData = res.data;
            this.alldialogBool = "wfcon";
          });
          break;
        case "glgs":
          this.alltableData = this.postForm.customerAssociates;
          this.alldialogBool = "glgs";
          break;
        case "lyct":
          this.alltableData = this.postForm.conflicters;
          this.alldialogBool = "lyct";
          break;
        case "hy":
          this.alltableData = this.postForm.customerIndustrys;
          this.alldialogBool = "hy";
          break;

        default:
          break;
      }
    },
    //icon上传-->
    handleAvatarChange(file, fileList) {
      if (this.isItemTrue("custId")) {
        this.postForm.userIcon = URL.createObjectURL(file.raw);
        this.userIconCust = URL.createObjectURL(file.raw);
        console.log(this.postForm.userIcon, "000");
        this.$refs.userIconupload.submit();
      }
    },
    dfhandleAvatarChange(file, fileList) {
      if (this.isdfItemTrue()) {
        this.dfconFromData.custContIcon = URL.createObjectURL(file.raw);
        this.dfuserIconCust = URL.createObjectURL(file.raw);
        this.$refs.custContIconupload.submit();
        console.log(
          this.dfconFromData.custContIcon,
          URL.createObjectURL(file.raw)
        );
      }
    },
    onBeforeUploadIcon(file) {
      this.usericonSendData.tokenID = this.token;
      this.usericonSendData.custId = this.postForm.custId;

      this.custContIconSendData.tokenID = this.token;
      this.custContIconSendData.custContactId = this.dfconFromData.custContactId;
      const isIMAGE = file.type === "image/jpeg" || "image/gif" || "image/png";
      const isLt1M = file.size / 1024 / 1024 < 1;
      if (!isIMAGE) {
        this.$message.error("上传文件只能是图片格式!");
      }
      if (!isLt1M) {
        this.$message.error("上传文件大小不能超过 1MB!");
      }
      return isIMAGE && isLt1M;
    },
    dficonSendSuccess(response, file, fileList) {
      if (response.success) {
        this.$message.success(response.message);
      } else {
        this.$message.error(response.message);
        this.dfconFromData.custContIcon = "";
      }
    },
    iconSendSuccess(response, file, fileList) {
      if (response.success) {
        this.iconIsDel = false
        this.$message.success(response.message);
      } else {
        this.$message.error(response.message);
        this.postForm.userIcon = "";
      }
    },
    allhandleClose() {
      this.alldialogBool = "";
    },
    //<--icon上传
    //创建用户-->
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (!valid) {
          this.$message.error("请填写必填项");
        } else {
          this.loading = true;
          this.postForm.isCustomer=1
          delete this.postForm.customerAddrs;
          delete this.postForm.customerContacts;
          delete this.postForm.activities;
          delete this.postForm.agencyContacts;
          delete this.postForm.customerRequirements;
          delete this.postForm.ctData;
          delete this.postForm.materialList;
          addCustomer(this.postForm).then(response => {
            this.loading = false;
            if (response.success) {
              this.isCreatTrue = true;
              this.$message({
                type: "success",
                message: "创建成功"
              });
              this.$router.push({ path: "./customer_list" });
            } else {
              this.$message.error(response.message);
            }
          });
        }
      });
    },
    updatasubmitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (!valid) {
          this.$message.error("请填写必填项");
        } else {
          this.loading = true;
          delete this.postForm.customerAddrs;
          delete this.postForm.customerContacts;
          delete this.postForm.activities;
          delete this.postForm.agencyContacts;
          delete this.postForm.customerRequirements;
          delete this.postForm.ctData;
          delete this.postForm.materialList;
          delete this.postForm.userIcon
          !this.postForm.pinpaiList && delete this.postForm.pinpaiList
          !this.postForm.customerConflicterList && delete this.postForm.customerConflicterList
          !this.postForm.induIdArray && delete this.postForm.induIdArray
          !this.postForm.principalRoleArray && delete this.postForm.principalRoleArray
          !this.postForm.list && delete this.postForm.list
          !this.postForm.responsibleUserIdArray && delete this.postForm.responsibleUserIdArray
          !this.postForm.manageUserIdArray && delete this.postForm.manageUserIdArray
          !this.postForm.createTimeArray && delete this.postForm.createTimeArray
          let list = []
          if (this.postForm.customerIndustrys && this.postForm.customerIndustrys.length) {
            list = JSON.parse(JSON.stringify(this.postForm.customerIndustrys))
            list.forEach(item => {
              if (item.customerTags && item.customerTags.length) {
                item.customerTags = item.customerTags.map(itm => {
                  if (typeof itm == 'string' ) {
                    return  {tagName: itm}
                  } else {
                    return itm
                  }
                })
              }
            })
          }
          updateCustomerUrl({...this.postForm, customerIndustrys: list}).then(response => {
            if (response.success) {
              this.isCreatTrue = true;
              this.$message({
                type: "success",
                message: "保存成功"
              });
              this.$router.go(-1);
            } else {
              this.$message.error(response.message);
            }
          });
        }
      });
    },
    creatLsCust(formName) {
      if (formName == "dfconFromData") {
        if (!this.dfconFromData.custContactId) {
        }
      } else {
        if (!this.postForm.ctData[0]) {
          return;
        }
      }
    },

    //<--创建用户
    //添加客户文件-->
    // addCustomerFile(type) {
    //   if (type == "dffile") {
    //     if (this.isdfItemTrue()) {
    //       this.$refs.uploadcustContactFile.submit();
    //     }
    //   } else {
    //     if (this.isItemTrue("custId")) {
    //       this.$refs.uploadCustFile.submit();
    //     }
    //   }
    // },
    // 新建用户后点击‘取消’ 删除用户
    delCustomer() {
      this.deldata.customerID = this.postForm.custId
      delCustomer(this.deldata).then(()=>{
        this.$message.success('取消成功')
        this.$router.go(-1)
      })
    },
    brforeRemoveFile(file,type) {
      let delmaterialId;
      if (file.response) {
        if(type == "dffile"){
          delmaterialId = file.response.data.materialId;
        } else {
          delmaterialId = file.response.data.materialId;
        }
      } else {
        delmaterialId = file.materialId;
      }
      if(delmaterialId){
        delCustomerFile({materialId:delmaterialId}).then(res=>{

        })
      }

      // delCaseMaterialUrl({
      //   caseIdArray: this.mainCaseIds,
      //   materialId: delmaterialId
      // }).then(res => {
      //   this.message.success(res.message);
      //   this.wtsfileList = this.wtsfileList.filter(
      //     item => item.materialId != delmaterialId
      //   );
      //   this.wtsfileListzr = this.wtsfileListzr.filter(
      //     item => item.materialId != delmaterialId
      //   );
      // });
    },
    preview(file){
      if(file.raw){
        if(file.response){
          this.$commonUtils.downLoadAll({url:'ipdoc'+file.response.data.address})
        }
      } else {
        this.$commonUtils.downLoadAll({url: file.url})
      }
    },
    handlePreview(file) {

      this.custContactFiledata.tokenID = this.token;
      this.custContactFiledata.custContactId = this.dfconFromData.custContactId;
      this.addCustomerFileData.tokenID = this.token;
      this.addCustomerFileData.custId = this.postForm.custId;
      this.addCustomerRequirementFileData.tokenID = this.token;
      this.addCustomerRequirementFileData.custId = this.postForm.custId;
      this.addCustomerRequirementFileData.id = this.zsFromData.id;
      this.addCustomerRequirementFileData.indicateType = this.zsFromData.indicateType;

      this.addCustomerFileData.fileNames = file.name.substr(
        0,
        file.name.lastIndexOf(".")
      );

      this.custContactFiledata.fileNames = file.name.substr(
        0,
        file.name.lastIndexOf(".")
      );
      this.addCustomerRequirementFileData.fileNames = file.name.substr(
        0,
        file.name.lastIndexOf(".")
      );
    },
    //<--添加客户文件
    //-->提示
    isItemTrue(item) {
      if (!this.postForm[item]) {
        this.$message.error("请填写必填项");
        return false;
      } else {
        return true;
      }
    },
    isdfItemTrue() {
      if (!this.dfconFromData.custContactId) {
        this.$message.error("请填写必填项");
        return false;
      } else {
        return true;
      }
    },
    // 获取各个select数据
    getAllSelectData() {
      console.log(this.seletDataArr, "00000");
      this.queryPosition()
      querycustSelectClass({ classId: this.seletDataArr }).then(response => {
        if (response.success) {
          this.seletData.comLanguage = response.data["1129"];
          this.seletData.hzzt = response.data["5"];
          this.seletData.mainLegalNature = response.data["1042"];
          // this.seletData.customerSource = response.data["1"];
          this.seletData.statu = response.data["1044"];
          this.seletData.sex = response.data["1053"];
          this.seletData.lxstatu = response.data["1045"];
          this.seletData.called = response.data["1076"];
          this.seletData.hdstatu = response.data["1050"];
          this.seletData.hdtype = response.data["1049"];
          this.seletData.hdfs = response.data["1051"];
          this.seletData.zdfs = response.data["1052"];
          this.seletData.ywstuta = response.data["1112"];
          this.seletData.roleMessage = response.data["1063"];
          this.seletData.gradeList = response.data["4"];
          this.seletData.roles = response.data["1156"];
        } else {
          this.$message.error(response.message);
        }
      });

      queryIndustryUrl().then(response => {
        if (response.success) {
          this.seletData.industry = response.data;
        } else {
          this.$message.error(response.message);
        }
      });

      querywfUserNameUrl().then(response => {
        if (response.success) {
          this.seletData.wfuserNames = response.data;
        } else {
          this.$message.error(response.message);
        }
      });
      queryCaseTypeUrl().then(response => {
        if (response.success) {
          this.seletData.caseType = response.data;
        } else {
          this.$message.error(response.message);
        }
      });
      queryFiliale().then(response => {
        if (response.success) {
          this.seletData.customerOwner = response.data;
        } else {
          this.$message.error(response.message);
        }
      });
      queryUserNamesUrl().then(response => {
        if (response.success) {
          this.seletData.userNames = response.data.users;
        } else {
          this.$message.error(response.message);
        }
      });

      queryCountry().then(response => {
        if (response.success) {
          this.seletData.ctDataOption = response.data;
          if (!this.postForm.continent && this.postForm.ctData && this.postForm.ctData.length) {
            this.postForm.continent = this.getcontinent(this.postForm.ctData[0]);
          }
        } else {
          this.$message.error(response.message);
        }
      });
      queryUserByPermissionId({ permissionId: "61" }).then(response => {
        if (response.success) {
          this.seletData.censor = response.data;
        } else {
          this.$message.error(response.message);
        }
      });
      queryUserByRoleId({roleId: '2049,1'}).then(res=>{
        this.managementCommitteePartner=res.data
      })

    },
    dialogFormOpen(type) {
      return;
      switch (type) {
        case "dfcon":
          this.dfconFromData.custId = this.postForm.custId;

          queryCustomerContactCustIdUrl({
            customerId: this.postForm.custId
          }).then(response => {
            if (response.success) {
              this.seletData.dfcon = response.data;
            } else {
              this.$message.error(response.message);
            }
          });
          queryCustomerAddrListUrl({ custId: this.postForm.custId }).then(
            response => {
              if (response.success) {
                this.seletData.dfkhdzlist = response.data;
              } else {
                this.$message.error(response.message);
              }
            }
          );
          break;
        case "zs":
          break;

        default:
          break;
      }
    },

    remotepaternalUnit(query) {
      if (query !== "") {
        queryCustomerNameId({ keyword: query, isCustomer: "1" }).then(
          response => {
            if (response.success) {
              this.seletData.paternalUnit = response.data;
            } else {
              this.$message.error(response.message);
            }
          }
        );
      }
    },
    conflictersChange(row){
      Object.assign(row,this.seletData.activityList.find(item=>item.fullname==row.fullname))
    },
    remotepaternalUnitactivityList(query) {
      if (query !== "") {
        queryActivityListflUrl({ fullname: query }).then(response => {
          if (response.success) {
            this.seletData.activityList = response.data;
          } else {
            this.$message.error(response.message);
          }
        });
      }
    },
    remotepaternalUnitKh(query) {
      if (query !== "") {
        queryCustomersUrl({ fullname: query }).then(response => {
          if (response.success) {
            this.seletData.paternalUnitKh = response.data;
          } else {
            this.$message.error(response.message);
          }
        });
      }
    },
    nameChangeinput(val) {
      queryCustomerNameId({
        isCustomer: "1",
        name: val,
        pageSize: "10",
        pageNo: "0"
      }).then(response => {
        this.gridData = response.data;
        this.popoverShow = true;
      });
    },
    getcontinent(item) {
      var newItem;

      this.seletData.ctDataOption.forEach(element => {
        if (element.value == item) {
          newItem = element.continentCn;
          return;
        }
      });
      console.log(newItem, "999");
      return newItem;
    },
    // querySearchAsync(value,cb){
    //   if (value ) {
    //     queryCustomerNameId({
    //       pageNo: 1, pageSize: 100, keyword: value
    //     }).then(res => {
    //       let list = res.data.map(item => ({ id: item.custId, value:item.name,value1:item.country,value2:item.fullname}))
    //       cb([...[{
    //       id: "-1",
    //       value: "简称",
    //       value1: "国籍",
    //       value2: "全称",
    //     }],...list])
    //     })
    //   }
    //   cb([])
    // },
    stepset(active) {
      this.stepActive = active;
      switch (active) {
        case 0:
          document.getElementById("jbxx-title").scrollIntoView();
          break;
        case 1:
          document.getElementById("khdz-title").scrollIntoView();
          break;
        case 2:
          document.getElementById("dflxr-title").scrollIntoView();
          break;
        case 3:
          document.getElementById("khhd-title").scrollIntoView();
          break;
        case 4:
          document.getElementById("wflxr-title").scrollIntoView();
          break;
        case 5:
          document.getElementById("khzs-title").scrollIntoView();
          break;
        case 6:
          document.getElementById("glgs-title").scrollIntoView();
          break;
        case 7:
          document.getElementById("lyct-title").scrollIntoView();
          break;
        case 8:
          document.getElementById("hy-title").scrollIntoView();
          break;

        default:
          break;
      }
    },
    handleScroll() {
      var top1 = document.getElementsByClassName("tilteSpan");
      var top2 = Array.prototype.slice.call(top1);

      top2 = top2.filter(
        item =>
          item.getBoundingClientRect().top > 0 &&
          item.getBoundingClientRect().top < 120
      );

      if (top2.length == 1) {
        this.stepActive = titlesArr[top2[0].children[0].id];
      }
    },
    // 表格项-->
    resetFromData(type) {
      switch (type) {
        case "addr":
          this.addrFromData = {
            title: "",
            addressCn: "",
            addressEn: "",
            isMailAdd: "",
            isBillAdd: "",
            addressMail: "",
            post: "",
            continent: "",
            country: "",
            province: "",
            city: "",
            status: "",
            memo: "",
            ctData: []
          };
          break;
        case "dfcon":
          this.dfconFromData = {
            custContactId: "",
            examineStatus: "1623",
            custId: "",
            firstname: "",
            name: "",
            gender: "",
            custContIcon: "",
            custContactFile: "",
            called: "",
            birthday: "",
            bustype: "",
            branch: "",
            ismain: "",
            isBillContact: "",
            department: "",
            jobtitle: "",
            status: "",
            sysStatus: "",
            isCollectbillMan: "",
            tel: "",
            mobile2: "",
            mobile1: "",
            phone2: "",
            email: "",
            email2: "",
            fax1: "",
            msgType: "",
            msgAccount: "",
            bossCustContactId: "",
            gxr1CustContactId: "",
            relat1: "",
            gxr2CustContactId: "",
            relat2: "",
            gxr3CustContactId: "",
            relat3: "",
            infoFromStaff: "",
            infoFromPlace: "",
            infoFromDate: "",
            routineAct: "",
            routineActMemo: "",
            customerContactAgencyContacts: []
          };
          break;
        case "hd":
          this.hdFromData = {
            examineStatus: "1623",
            custActId: "",
            actStatus: "",
            subject: "",
            actType: "",
            actKind: "",
            begindate: "",
            enddate: "",
            place: "",
            serviceType: "",
            servicePlace: "",
            putGift: "",
            getGift: "",
            description: "",
            customerContactActs: [],
            agencyContactActs: []
          };
          break;
        case "zs":
          this.zsFromData = {
            custId: "",

            indicateType: "",
            caseTypeIdArray: [],
            examineStatus: "1623",

            caseTypeIds: [],

            specialInfo: "",

            price: "",

            chargeItemId: "",

            startDate: "",

            endDate: "",

            status: "",

            memo: "",

            billIfmonth: "",

            billSenddate: "",

            billSendtype: "",

            curId: "",

            value: "",

            payAcountId: "",

            appId: "",

            id: ""
          };
          break;
        case "wfcon":
          this.wfconFromData = {
            custId: "",
            userId: "",
            startdate: "",
            enddate: "",
            business: "",
            roleId: "",
            caseTypeId: "",
            userrole: "",
            memo: "",
            position: "",
            ischeck: ""
          };
          break;
        case "dfwfcon":
          this.dfwfconFromData = {
            custId: "",
            userId: "",
            startdate: "",
            enddate: "",
            business: "",
            roleId: "",
            caseTypeId: "",
            userrole: "",
            memo: "",
            position: "",
            ischeck: ""
          };
          break;

        default:
          break;
      }
    },
    addFormShow(type) {
      this.dialogLook = false
      if (this.isItemTrue("custId") || this.isBillEdit) {
        switch (type) {
          case "addr":
            this.dialogFormAddr = true;
            break;
          case "dfcon":
            addCustomerContactUrl({ custId: this.postForm.custId }).then(
              response => {
                if (response.success) {
                  this.dfconFromData.custContactId = response.data.data.custContactId;
                  this.postForm.customerContacts.unshift(response.data.data);
                  this.dialogFormdfcon = true;
                  this.dfCreated = true
                  this.isEdit = true
                } else {
                  this.$message.error(response.message);
                }
              }
            );
            break;
          case "hd":
            this.isEditActivity=false

            this.dialogFormhd = true;
            this.$nextTick(()=>{
              this.$refs.Activity.hdFromData.customerContactActs=[{custId:this.postForm.custId}]
              this.$refs.Activity.seletData.paternalUnitKh=[{name:this.postForm.fullname,custId:this.postForm.custId}]
            })
            break;
          case "wfcon":
            this.dialogFormwfcon = true;
            break;

          case "dfwfcon":
            if (this.dfconFromData.custContactId) {
              this.dialogFormdfwfcon = true;
            } else {
              this.$message.error("请填写必填项");
            }

            break;

          default:
            break;
        }
        this.resetFromData(type);
        this.dialogFormStatus = "create";
      }
    },
    custAddrupdata(row, type, isLook) {
      if(isLook){
       this.dialogLook = true
      }else{
        this.dialogLook = false
      }
      switch (type) {
        case "addr":
          queryCustomerAddrUrl({ addrId: row.addrId }).then(res => {
            this.addrFromData = res.data;
            Vue.set(this.addrFromData, "ctData", []);
            this.addrFromData.ctData = [
              this.addrFromData.country,
              this.addrFromData.province,
              this.addrFromData.city
            ];
          });
          this.dialogFormAddr = true;
          break;
        case "dfcon":
          queryCustomerContactUrl({ custContactId: row.custContactId }).then(
            res => {
              this.dfconFromData = res.data;
              if (this.dfconFromData.custContIcon) {
                this.dfuserIconCust = `/ipdoc${this.dfconFromData.custContIcon}`;
              }

              this.dialogFormdfcon = true;
              this.dfdzlist = this.dfconFromData.customerContactAddArray.map(
                item => item.addrId
              );
            }
          );

          break;
        case "hd":
          this.isEditActivity=true
          this.hdFromData.id=row.custActId
          this.hdFromData.custActId=row.custActId
          this.dialogFormhd = true;
          // queryActivityOneUrl({ custActId: row.custActId }).then(res => {
          //   this.hdFromData = res.data;
          //   this.dialogFormhd = true;
          // });

          break;
        case "wfcon":
          queryAgencyContactUrl({ agencyContactId: row.agencyContactId }).then(
            res => {
              this.wfconFromData = res.data;
              this.dialogFormwfcon = true;
            }
          );

          break;
        case "dfwfcon":
          queryCustomerContactAgencyUrl({
            custContactAgencyContactId: row.custContactAgencyContactId
          }).then(res => {
            this.dfwfconFromData = res.data;
            this.dialogFormdfwfcon = true;
          });

          break;

        default:
          break;
      }
      this.dialogFormStatus = "update";
    },
    custAddrdel(row, index, type) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          switch (type) {
            case "addr":
              delCustomerAddrUrl({ addrId: row.addrId }).then(response => {
                if (response.success) {
                  // const index = this.postForm.customerAddrs.indexOf(row);
                  this.postForm.customerAddrs.splice(index, 1);
                  if (this.alldialogBool == "addr") {
                    this.alltableData.splice(index, 1);
                    queryCustomerAddrListUrl({
                      custId: this.postForm.custId,
                      pageNo: 1,
                      pageSize: 3
                    }).then(res => {
                      this.postForm.customerAddrs = res.data;
                    });
                  }
                  this.$message({
                    type: "success",
                    message: "删除成功"
                  });
                } else {
                  this.$message.error(response.message);
                }
              });
              break;
            case "dfcon":
              delCustomerContacturl({ custContactId: row.custContactId }).then(
                response => {
                  if (response.success) {
                    // const index = this.postForm.customerContacts.indexOf(row);
                    this.postForm.customerContacts.splice(index, 1);
                    if (this.alldialogBool == "dfcon") {
                      // const index1 = this.alltableData.indexOf(row);
                      this.alltableData.splice(index, 1);
                      queryCustomerContactCustIdUrl({
                        customerId: this.postForm.custId,
                        pageNo: 1,
                        pageSize: 3
                      }).then(res => {
                        this.postForm.customerContacts = res.data;
                      });
                    }
                    this.$message({
                      type: "success",
                      message: "删除成功"
                    });
                  } else {
                    this.$message.error(response.message);
                  }
                }
              );
              break;
            case "hd":
              delActivity({ custActId: row.custActId }).then(response => {
                if (response.success) {
                  // const index = this.postForm.activities.indexOf(row);
                  this.postForm.activities.splice(index, 1);
                  if (this.alldialogBool == "hd") {
                    // const index1 = this.alltableData.indexOf(row);
                    this.alltableData.splice(index, 1);
                    queryActivityListUrl({
                      isCustomer: "1",
                      custId: this.postForm.custId,
                      pageNo: 1,
                      pageSize: 3
                    }).then(res => {
                      this.postForm.activities = res.data;
                    });
                  }
                  this.$message({
                    type: "success",
                    message: "删除成功"
                  });
                } else {
                  this.$message.error(response.message);
                }
              });
              break;

            case "wfcon":
              delAgencyContactUrl({
                agencyContactId: row.agencyContactId
              }).then(response => {
                if (response.success) {
                  // const index = this.postForm.agencyContacts.indexOf(row);
                  this.postForm.agencyContacts.splice(index, 1);
                  if (this.alldialogBool == "wfcon") {
                    this.alltableData.splice(index, 1);
                    queryAgencyContactListUrl({
                      customerID: this.postForm.custId,
                      pageNo: 1,
                      pageSize: 3
                    }).then(res => {
                      this.postForm.activities = res.data;
                    });
                  }
                  this.$message({
                    type: "success",
                    message: "删除成功"
                  });
                } else {
                  this.$message.error(response.message);
                }
              });
              break;
            case "dfwfcon":
              delCustomerContactAgencyUrl({
                custContactAgencyContactId: row.custContactAgencyContactId
              }).then(response => {
                if (response.success) {
                  // const index = this.dfwfconFromData.customerContactAgencyContacts.indexOf(
                  //   row
                  // );
                  this.dfwfconFromData.customerContactAgencyContacts.splice(
                    index,
                    1
                  );
                  this.$message({
                    type: "success",
                    message: "删除成功"
                  });
                } else {
                  this.$message.error(response.message);
                }
              });
              break;

            default:
              break;
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    deldfcondialog() {
      if (
        this.dialogFormStatus == "update" ||
        !this.dfconFromData.custContactId
      ) {
        this.dialogFormdfcon = false;
      } else {
        delCustomerContacturl({
          custContactId: this.dfconFromData.custContactId
        }).then(response => {
          if (response.success) {
            queryCustomerContactCustIdUrl({
              customerId: this.postForm.custId,
              pageNo: 1,
              pageSize: 3
            }).then(res => {
              this.postForm.customerContacts = res.data;
              this.dialogFormdfcon = false;
            });
          } else {
            this.$message.error(response.message);
          }
        });
      }
    },
    updateCustomerActivity(response){
      this.dialogFormhd = false;
      this.postForm.activities.unshift(response.data);
    },
    updateCustomerContact(response){
      for (const v of this.postForm.customerContacts) {
        if (v.custContactId === this.dfconFromData.custContactId) {
          const index = this.postForm.customerContacts.indexOf(v);
          this.postForm.customerContacts.splice(
            index,
            1,
            response.data.data
          );

          break;
        }
      }
      if (this.alldialogBool == "dfcon") {
        for (const v of this.alltableData) {
          if (v.custContactId === this.dfconFromData.custContactId) {
            const index = this.alltableData.indexOf(v);
            this.alltableData.splice(index, 1, response.data.data);
            break;
          }
        }
      }
    this.dialogFormdfcon = false;
    },
    createCustAddr(type) {
      switch (type) {
        case "addr":
          this.addrFromData.custId = this.postForm.custId;
          addCustomerAddrUrl(this.addrFromData).then(response => {
            if (response.success) {
              this.dialogFormAddr = false;
              this.postForm.customerAddrs.unshift(response.data);
            } else {
              this.$message.error(response.message);
            }
          });
          break;
        case "dfcon":
          if (this.isdfItemTrue()) {
            const tempData = Object.assign({}, this.dfconFromData);
            tempData.custId = this.postForm.custId;
            delete tempData.activities;
            delete tempData.materialList;
            this.$refs.ContactDfDetail.createCustAddr()
            // updateCustomerContacturl(tempData).then(response => {
            //   if (response.success) {
            //     for (const v of this.postForm.customerContacts) {
            //       if (v.custContactId === this.dfconFromData.custContactId) {
            //         const index = this.postForm.customerContacts.indexOf(v);
            //         this.postForm.customerContacts.splice(
            //           index,
            //           1,
            //           response.data.data
            //         );
            //
            //         break;
            //       }
            //     }
            //     if (this.alldialogBool == "dfcon") {
            //       for (const v of this.alltableData) {
            //         if (v.custContactId === this.dfconFromData.custContactId) {
            //           const index = this.alltableData.indexOf(v);
            //           this.alltableData.splice(index, 1, response.data.data);
            //
            //           break;
            //         }
            //       }
            //     }
            //     this.dialogFormdfcon = false;
            //   } else {
            //     this.$message.error(response.message);
            //   }
            // });
          }
          break;

        case "hd":
          this.$refs.Activity.updateCustAddr()
          // this.$refs["hdFromDataForm"].validate(valid => {
          //   if (valid) {
          //     this.hdFromData.custId = this.postForm.custId;
          //     this.hdFromData.customerContactActs.forEach(e => {
          //       delete e.hdlx;
          //     });
          //     addActivityUrl(this.hdFromData).then(response => {
          //       if (response.success) {
          //         this.dialogFormhd = false;
          //
          //         this.postForm.activities.unshift(response.data);
          //         console.log(this.postForm.activities, "+++");
          //       } else {
          //         this.$message.error(response.message);
          //       }
          //     });
          //   } else {
          //     this.$message.error("请填写必填项");
          //     return false;
          //   }
          // });

          break;
        case "wfcon":
          this.wfconFromData.custId = this.postForm.custId;
          allocationCustomerUrl(this.wfconFromData).then(response => {
            if (response.success) {
              this.dialogFormwfcon = false;
              this.postForm.agencyContacts.unshift(response.data);
            } else {
              this.$message.error(response.message);
            }
          });
          break;
        case "dfwfcon":
          this.dfwfconFromData.custId = this.postForm.custId;
          this.dfwfconFromData.custContactId = this.dfconFromData.custContactId;

          addCustomerContactAgencyUrl(this.dfwfconFromData).then(response => {
            if (response.success) {
              this.dialogFormdfwfcon = false;
              this.dfwfconFromData.customerContactAgencyContacts.unshift(
                response.data
              );
            } else {
              this.$message.error(response.message);
            }
          });
          break;
        case "zs":
          break;
        default:
          break;
      }
    },
    updateCustAddr(type) {
      switch (type) {
        case "addr":
          const tempData = Object.assign({}, this.addrFromData);
          updateCustomerAddrUrl(tempData).then(response => {
            if (response.success) {
              for (const v of this.postForm.customerAddrs) {
                if (v.addrId === this.addrFromData.addrId) {
                  const index = this.postForm.customerAddrs.indexOf(v);
                  this.postForm.customerAddrs.splice(index, 1, response.data);
                  Vue.set(this.addrFromData, "ctData", []);
                  this.addrFromData.ctData = [
                    this.addrFromData.country,
                    this.addrFromData.province,
                    this.addrFromData.city
                  ];
                  break;
                }
              }

              this.dialogFormAddr = false;
            } else {
              this.$message.error(response.message);
            }
          });
          break;

        case "hd":

          // const tempData1 = Object.assign({}, this.hdFromData);
          delete this.$refs.Activity.hdFromData.materialList
          updateActivityUrl(this.$refs.Activity.hdFromData).then(response => {
            if (response.success) {
              for (const v of this.postForm.activities) {
                if (v.custActId === this.hdFromData.custActId) {
                  const index = this.postForm.activities.indexOf(v);
                  this.postForm.activities.splice(index, 1, response.data);

                  break;
                }
              }
              if (this.alldialogBool == "hd") {
                for (const v of this.alltableData) {
                  if (v.custActId === this.hdFromData.custActId) {
                    const index = this.alltableData.indexOf(v);
                    this.alltableData.splice(index, 1, response.data);

                    break;
                  }
                }
              }
              this.dialogFormhd = false;
            } else {
              this.$message.error(response.message);
            }
          });
          break;

        case "wfcon":
          const tempData2 = Object.assign({}, this.wfconFromData);

          updateAgencyContactUrl(tempData2).then(response => {
            if (response.success) {
              for (const v of this.postForm.agencyContacts) {
                if (v.agencyContactId === this.wfconFromData.agencyContactId) {
                  const index = this.postForm.agencyContacts.indexOf(v);
                  const index1 = this.alltableData.findIndex(item => item.agencyContactId == response.data.agencyContactId);
                  this.postForm.agencyContacts.splice(index, 1, response.data);
                  this.alltableData.splice(index1, 1, response.data);

                  break;
                }
              }

              this.dialogFormwfcon = false;
            } else {
              this.$message.error(response.message);
            }
          });
          break;
        case "dfwfcon":
          const tempData21 = Object.assign({}, this.dfwfconFromData);

          updateCustomerContactAgencyUrl(tempData21).then(response => {
            if (response.success) {
              for (const v of this.dfwfconFromData
                .customerContactAgencyContacts) {
                if (
                  v.custContactAgencyContactId ===
                  this.dfwfconFromData.custContactAgencyContactId
                ) {
                  const index = this.dfwfconFromData.customerContactAgencyContacts.indexOf(
                    v
                  );
                  this.dfwfconFromData.customerContactAgencyContacts.splice(
                    index,
                    1,
                    response.data
                  );

                  break;
                }
              }

              this.dialogFormdfwfcon = false;
            } else {
              this.$message.error(response.message);
            }
          });
          break;

        default:
          break;
      }
    },
    addhdDftable(type) {
      switch (type) {
        case "dfcon":
          this.hdFromData.customerContactActs.unshift({
            custContactId: "",
            custId: "",
            memo: "",
            hdlx: ""
          });

          break;
        case "wfcon":
          this.hdFromData.agencyContactActs.unshift({
            userId: "",
            memo: ""
          });

          break;
        case "glgs":
          this.postForm.customerAssociates.unshift({
            custAssName: "",
            relationship: ""
          });

          break;
        case "lyct":
          this.postForm.conflicters.unshift({
            fullname: "",
            memo: ""
          });

          break;
        case "hy":
          this.postForm.customerIndustrys.unshift({
            induId: "",
            info: "",
            customerTags: []
          });

          break;

        default:
          break;
      }
    },
    handledeleElementhy(index) {
      // const index = this.hdFromData.customerContactActs.indexOf(item);
      this.postForm.customerIndustrys.splice(index, 1);
    },
    handledeleElementglgs(index) {
      // const index = this.hdFromData.customerContactActs.indexOf(item);
      this.postForm.customerAssociates.splice(index, 1);
    },

    handledeleElementlyct(index) {
      // const index = this.hdFromData.customerContactActs.indexOf(item);
      this.postForm.conflicters.splice(index, 1);
    },
    handledeleElementhddfcon(index) {
      // const index = this.hdFromData.customerContactActs.indexOf(item);
      this.hdFromData.customerContactActs.splice(index, 1);
    },
    handledeleElementhdwfcon(index) {
      // const index = this.hdFromData.agencyContactActs.indexOf(item);
      this.hdFromData.agencyContactActs.splice(index, 1);
    },
    dfdzchange(val) {
      // console.log(val, "**-**");
      // var e = [];
      // val.forEach(item => {
      //   this.seletData.dfkhdzlist.forEach(ite => {
      //     if (ite.addrId == item) {
      //       e.push(ite);
      //     }
      //   });
      // });
      // this.dfconFromData.customerContactAddArray = e;
      this.dfconFromData.customerContactAddArray = this.seletData.dfkhdzlist.filter(item=>this.dfdzlist.includes(item.addrId));
    },
    hdkhselect(vId, row) {
      var e = {};
      this.seletData.paternalUnitKh.forEach(ite => {
        if (ite.custId == vId) {
          e = ite;
          return;
        }
      });

      console.log(e);
      const index = this.hdFromData.customerContactActs.indexOf(row);
      this.hdFromData.customerContactActs[index].hdlx = e.customerContacts;
    },
    wfUserNamechange(id) {
      var e = {};
      this.seletData.wfuserNames.forEach(ite => {
        if (ite.userId == id) {
          e = ite;
          return;
        }
      });
      this.dfwfconFromData.position = e.positionStr;
    },

    jdbtn() {
      console.log("jiandan ");
    },
    //<--表格项
    hdDialogShow() {
      let custsArr = [];
      this.hdFromData.customerContactActs.forEach(element => {
        custsArr.unshift(element.custId);
      });
      if (custsArr && custsArr.length > 0) {
        queryCustomersUrl({ custIdArray: custsArr }).then(response => {
          this.seletData.paternalUnitKh = response.data;
          this.hdFromData.customerContactActs.forEach(element => {
            var e = {};
            this.seletData.paternalUnitKh.forEach(ite => {
              if (ite.custId == element.custId) {
                e = ite;
                return;
              }
            });

            console.log(e);
            const index = this.hdFromData.customerContactActs.indexOf(element);
            this.hdFromData.customerContactActs[index].hdlx =
              e.customerContacts;
          });
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.el-table /deep/ th {
  background-color: #f2f2f2;
  color: #333333;
  height: 30px;
  line-height: 30px;
  padding: 0px !important;
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
    height: 30px;
    line-height: 30px;
    padding: 0px !important;
  }
  /deep/ td {
    background-color: #ffffff !important;
  }
}

.form-border {
  /deep/ .el-row {
    margin: 0px;
  }
  /deep/ .postInfo-container-item {
    width: 100%;
  }
  /deep/ .el-form-item__label {
    background-color: #f9f9f9;
    width: 30%;
    text-align: center;
  }

  /deep/ .el-form-item {
    border-right: 1px solid #d7d7d7;
    margin: 0px !important;
  }
  /deep/ .el-row {
    border-bottom: 1px solid #d7d7d7;
  }
  /deep/ .el-input,
  /deep/ .el-select {
    width: 70%;
  }
  /deep/ .el-form-item__content {
    text-align: center;
    /*height: 30px;*/
  }
  .fullRow {
    /deep/ .el-form-item__label {
      width: 15%;
    }

    /deep/ .el-input,
    /deep/ .el-select {
      width: 85%;
    }
  }
  /deep/ .el-input__inner {
    border: none;
  }
  /deep/ .el-select .el-input {
    width: 100%;
  }
  border-top: 1px solid #d7d7d7;
  border-left: 1px solid #d7d7d7;
  // border-bottom: 1px solid #d7d7d7;
}

.titleLeft {
  margin-right: 20px;
}
.createPost-container {
  position: relative;

  background-color: #e8ebed;
  /deep/ .form-con {
    background-color: #ffffff;

    /deep/ .form-con-item {
      @include clearfix;
      padding: 5px 20px;
      /deep/ .el-col {
      }
    }
  }
  /deep/ .createPost-main-container {
    padding: 0px;
    border: 1px solid #ccc;
    /deep/ .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;
    }
  }

  /deep/ .word-counter {
    width: 40px;
    position: absolute;
    right: 10px;
    top: 0px;
  }
}
.clearfix::after {
  content: "";
  display: block;
  clear: both;
}
.uploader-custfile {
  display: flex;
  width: 100%;
  /deep/ .el-form-item__content {
    text-align: left;
    display: inline-table;
    width: 85%;
  }

  /deep/ .el-form-item__label {
  }
}
.tilteSpan {
  font-size: 18px;
  padding: 15px 0px;
  color: #7199d5;
}
.article-textarea /deep/ {
  /deep/ textarea {
    padding-right: 40px;
    resize: none;
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #bfcbd9;
  }
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
.el-step {
  cursor: pointer;
}
.tilteBtn {
  text-align: right;
  padding: 10px 10px;
  background-color: #d0d0d0;
}
/deep/.postInfoleft /deep/.el-form-item__content {
  text-align: left;

}
/deep/ .el-col.el-col-12{
  .el-cascader{
    width:70%;
    .el-input{
      width: 100%;
    }
  }
}
/deep/ .el-form-item__error {
  display: none !important;
}
/deep/ .jdbtn {
  position: absolute;
  bottom: 0px;
}
.casecBtn {
  position: absolute;
  left: 0px;
  bottom: -147px;
}
/deep/ .el-cascader-menus {
  z-index: 1000 !important;
}
/deep/ .customerResponsible {
  display: none;
}
/deep/.text_left{
    text-align: left;
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
</style>
