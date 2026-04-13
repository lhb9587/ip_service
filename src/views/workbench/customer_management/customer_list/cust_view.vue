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
<!--                        <el-input v-model="postForm.code" :disabled="true"></el-input>-->
                      {{ postForm.code }}
                      </el-form-item>
                    </el-col>

                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item label="简称:" prop="name" class="postInfo-container-item">
<!--                        <el-popover :value='popoverShow' class="inputshow" ref="popover4" placement="bottom" width="600" trigger="click">-->
<!--                          <el-table size="mini" :data="gridData" style='height:250px'>-->
<!--                            <el-table-column align="left" width="" property="name" label="简称"></el-table-column>-->
<!--                            <el-table-column align="left" width="" property="fullname" label="中文名称/全称"></el-table-column>-->
<!--                            <el-table-column align="left" width="" property="fullnameEn" label="英文名称"></el-table-column>-->
<!--                            <el-table-column align="left" width="" property="fgFullname" label="外文全称"></el-table-column>-->
<!--                          </el-table>-->
<!--                        </el-popover>-->
<!--                        <el-input v-popover:popover4 v-model="postForm.name" @input="nameChangeinput"></el-input>-->
                        {{postForm.name}}
                      </el-form-item>
                    </el-col>

                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item label="中文名称/全称:" prop="fullname" class="">
                        {{postForm.fullname}}
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item label="英文名称:" class="postInfo-container-item">
                        {{postForm.fullnameEn}}
                      </el-form-item>
                    </el-col>

                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item label="外文全称:" class="postInfo-container-item">
                        {{postForm.fgFullname}}
                      </el-form-item>
                    </el-col>

                  </el-row>

                </el-col>
                <el-col :span="12">
                  <el-row>
                    <el-col :span="24">
                      <el-form-item label="照片" class="postInfo-container-item avatar-uploader">
                        <img v-if="postForm.userIcon" :src="userIconCust" class="avatar">
<!--                        <el-upload :action='userIconUrl' ref='userIconupload' :data='usericonSendData' :on-success='iconSendSuccess' accept="image/jpeg,image/gif,image/png"-->
<!--                                   :before-upload="onBeforeUploadIcon" :show-file-list="false" :auto-upload='false' name='file' :on-change="handleAvatarChange">-->
<!--                          <img v-if="postForm.userIcon" :src="userIconCust" class="avatar">-->
<!--                          <i v-else class="el-icon-plus avatar-uploader-icon"></i>-->
<!--                        </el-upload>-->

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
                        {{postForm.customerResponsibleArray.map(item=>item.userId).map(item=>$commonUtils.transformation(responsiblePartner,item,'userId','fullname')).join(',')}}
<!--                        <template>-->
<!--                          <el-select disabled default-first-option :clearable='true' multiple  placeholder="请选择" v-model="postForm.customerResponsibleArray"  filterable>-->
<!--                            <el-option v-for="item in responsiblePartner" :key="item.userId" :label="item.fullname" :value="item.userId">-->
<!--                            </el-option>-->
<!--                          </el-select>-->
<!--                        </template>-->
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="客户协调人:" class="postInfo-container-item">
                        <el-select disabled default-first-option :clearable='true' placeholder="请选择" multiple  v-model="postForm.customerManageArray" filterable>
                          <el-option v-for="item in managementCommitteePartner" :key="item.userId" :label="item.fullname" :value="item.userId">
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row class="fullRow">
                    <el-col :span="24">
                      <el-form-item label="客户负责人领域:" prop="custGrade" class="postInfo-container-item">
                        <el-table
                          :data="postForm.customerResponsibleArray"
                          border
                          style="width: 100%">
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
                             {{scope.row.userDomains&&scope.row.userDomains.join(',')}}
                            </template>
                          </el-table-column>
                          <el-table-column

                            label="角色"
                          >
                            <template slot-scope="scope">
                             {{scope.row.principalRoleStr}}
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
                          {{postForm.reviewSubmitterStr}}
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
                       {{postForm.custGradeStr}}
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="沟通语言:" prop="contactLanguage" class="postInfo-container-item">
                      {{postForm.contactLanguageStr}}
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="官方机构:" class="postInfo-container-item">
                        <span v-if="postForm.isOfficial=='0'">否</span>
                        <span v-if="postForm.isOfficial=='1'">是</span>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row class="">
                    <el-col :span="12">
                      <el-form-item label="合作资源:">
                        <span v-if="postForm.isCollaboration=='0'">否</span>
                        <span v-if="postForm.isCollaboration=='1'">是</span>
                      </el-form-item>
                      <!-- <el-form-item label="合作资源:" class="postInfo-container-item">
                        <el-radio-group v-model="postForm.isCollaboration">
                          <el-radio :label='1'>是</el-radio>
                          <el-radio :label='0'>否</el-radio>
                        </el-radio-group>
                      </el-form-item> -->
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="申请人:" class="postInfo-container-item">
                        <span v-if="postForm.isApplicant=='0'">否</span>
                        <span v-if="postForm.isApplicant=='1'">是</span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="初始合作事项:" class="postInfo-container-item">
                        {{postForm.firstcaseCollitem}}
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="审查号:" class="postInfo-container-item">
                        {{postForm.auditNo}}
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="正式客户时间:" class="postInfo-container-item">
                        {{postForm.firstcaseDate}}
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="父单位:" class="postInfo-container-item">
                       {{postForm.parentCustName}}
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="事务所:" class="postInfo-container-item">
                        <span v-if="postForm.isAgent=='0'">否</span>
                        <span v-if="postForm.isAgent=='1'">是</span>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row class="fullRow">
                      <el-form-item label="主体法律性质">
                        {{postForm.legalNatureStr}}
                      </el-form-item>
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
                        {{postForm.curStatusDesc}}
                      </el-form-item>

                    </el-col>
                  </el-row>
                  <el-row v-if="postForm.legalNature=='1195'">
                    <el-col :span="12">
                      <el-form-item label="证件种类:" class="postInfo-container-item">
                        {{postForm.certType}}
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="证件号码:" class="postInfo-container-item">
                        {{postForm.idNumber}}
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="客户信用等级:" class="postInfo-container-item">
                       {{postForm.level}}
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="活跃程度:" class="postInfo-container-item">
                       {{postForm.actLevel}}
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="客户来源:" prop="source" class="postInfo-container-item">
                        {{postForm.sourceStr}}
                      </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="postForm.legalNature!='1195'">
                      <el-form-item label="统一社会信用代码:" class="postInfo-container-item">
                       {{postForm.certCode}}
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row class="fullRow">
                    <el-col :span="24">
                      <el-form-item label="客户来源说明:" class="postInfo-container-item">
                        {{postForm.sourceExplain}}
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row class="">
                    <el-col :span="8">
                      <el-form-item label="客户介绍人:" class="postInfo-container-item">
                        {{postForm.custIntroductor}}
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="客户介绍人单位:" class="postInfo-container-item">
                        {{postForm.custIntroCompany}}
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="客户所有者:" prop="ownerDeptid" class="postInfo-container-item">
                        <template>
                          <el-select :disabled="true" default-first-option :clearable='true' placeholder="请选择" v-model="postForm.ownerDeptid" @change='creatLsCust("postForm")' filterable>
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
                        {{postForm.ourImporter}}
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="财务年度结算日期:" class="postInfo-container-item">
                        {{postForm.annualAccDate}}
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="初始来案案型:" class="postInfo-container-item">
                        {{postForm.caseType}}
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row class="fullRow ">
                    <el-col :span="24">
                      <el-form-item label="国家/省份/城市:" prop="ctData" @change='creatLsCust("postForm")' class="postInfoleft">
                       {{[postForm.country,postForm.province,postForm.city].filter(item=>!!item).join('/')}}
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row class="fullRow">
                    <el-col :span="24">
                      <el-form-item label="大洲:" class="postInfo-container-item">
                        {{postForm.continent}}
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="官网网址:" class="postInfo-container-item">
                        {{postForm.website}}
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="传真:" class="postInfo-container-item">
                       {{postForm.fax1}}
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="电话:" class="postInfo-container-item">
                        {{postForm.phone}}
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="电子邮件:" class="postInfo-container-item">
                        {{postForm.email}}
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row class="fullRow">
                    <el-col :span="24">
                      <el-form-item label="简介:" class="postInfo-container-item">

                       <p> {{postForm.info}}</p>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row class="fullRow">
                    <el-col :span="24">

                      <el-form-item label="客户文档:" class="postInfo-container-item uploader-custfile">
                         <p v-for="item in postForm.materialList" :key="item.address">
                            <a style="color: #409EFF" target="_blank" :href="`ipdoc${item.address}`">{{item.name}}</a>
                          </p>
                        <!-- {{postForm.materialList}} -->
                      </el-form-item>

                    </el-col>

                  </el-row>
                  <el-row class="fullRow">
                    <el-col :span="24">

                      <el-form-item label="备注:" class="postInfo-container-item uploader-custfile">
                       {{postForm.memo}}
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="建档日期:" class="postInfo-container-item">
                        {{postForm.createTime}}
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="建档人:" class="postInfo-container-item">
                        {{postForm.createUserName}}
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="审查日期:" class="postInfo-container-item">
                        {{postForm.auditDate}}
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="审查人:" class="postInfo-container-item">

                        {{postForm.auditUserName}}

                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row class="fullRow">
                    <el-col :span="24">
                      <el-form-item label="邮件配置:" class="postInfo-container-item">
                        <el-checkbox-group v-model="postForm.mailConfigs">
                          <el-checkbox :disabled="true" :label="1">续展提醒</el-checkbox>
                          <el-checkbox :disabled="true" :label="2">初审公告提醒</el-checkbox>
                          <el-checkbox :disabled="true" :label="3">送达公告提醒</el-checkbox>
                        </el-checkbox-group>
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
                      <el-table-column label="操作" align="left" width="" class-name="small-padding fixed-width">
                        <template slot-scope="scope">

                          <el-button size="mini" type="text" @click="custAddrupdata(scope.row,'wfcon', true)">查看</el-button>

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
                <CustZs type="view" :postForm="postForm"></CustZs>
                <el-row>
                  <el-col class="tilteSpan" :span="24">
                    <span id='glgs-title'>关联公司</span>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24" style='text-align:right'>
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
                         {{scope.row.custAssName}}
                        </template>
                      </el-table-column>
                      <el-table-column label="与关联公司关系" align="left" width>
                        <template slot-scope="scope">
                          {{scope.row.relationship}}
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

                          <el-select default-first-option :clearable='true' v-model="scope.row.fullname" no-match-text='暂无数据' loading-text='正在查询' filterable remote reserve-keyword placeholder="请输入关键词"
                                     :remote-method="remotepaternalUnitactivityList">
                            <el-option v-for="item in seletData.activityList" :key="String(item.conId)" :label="item.fullname" :value="String(item.conId)">
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
                          {{scope.row.customerTags && scope.row.customerTags.length && scope.row.customerTags.map(item => item.tagName).join(', ')}}
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-col>
                </el-row>

                <el-row >
                  <el-col :span="24" style="text-align:center">
                    <el-form-item>


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

                  <span>{{postForm.fullname}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="信函抬头:" class="postInfo-container-item">

                  <span>{{addrFromData.title}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="中文地址:" class="postInfo-container-item">
                  <span>{{addrFromData.addressCn}}</span>
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

                  <span>{{addrFromData.addressEn}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="邮寄地址:" class="postInfo-container-item">

                  <span>{{addrFromData.addressMail}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="邮编:" class="postInfo-container-item">

                  <span>{{addrFromData.post}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="国家/省份/城市:" prop="ctData" class="postInfo-container-item">
                  <template>
                    <span>{{addrFromData.country +  ' ' + addrFromData.province + ' ' + addrFromData.city}}</span>
                  </template>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="大洲:" class="postInfo-container-item">
                  <span>{{addrFromData.continent}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="状态:" class="postInfo-container-item">
                  <template>
                    <span>{{addrFromData.statusStr}}</span>
                  </template>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="备注:" class="postInfo-container-item uploader-custfile">
                  <template>
                    <span>{{addrFromData.memo}}</span>
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
      <ContactDfDetail ref="ContactDfDetail"  v-if="dialogFormdfcon" :isLook="dialogLook" :isEdit="isEdit" :id="dfconFromData.custContactId"></ContactDfDetail>
      <div slot="footer" class="dialog-footer">
        <el-button @click="deldfcondialog">
          取消
        </el-button>
        <el-button type="primary" v-if="!dialogLook" @click="createCustAddr('dfcon')">
          确定
        </el-button>
      </div>
    </el-dialog>
    <el-dialog v-if="dialogFormhd" :show-close="false" :close-on-click-modal="false" title="客户活动" @open="hdDialogShow" :visible.sync="dialogFormhd" width="70%">
      <Activity ref="Activity"  v-if="dialogFormhd && hdFromData.custActId" :isEdit="true" :isLook="dialogLook" :componentState="true" :id="hdFromData.custActId"></Activity>
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
                    <span>{{wfconFromData.fullname}}</span>
                  </template>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="业务领域 :" class="postInfo-container-item">
                  <template>
                    <span>{{wfconFromData.business}}</span>
                  </template>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="案件类型:" class="postInfo-container-item">
                  <template>
                    <span>{{wfconFromData.caseTypeStr}}</span>
                  </template>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="职位:" class="postInfo-container-item">
                  <span>{{wfconFromData.position}}</span>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="角色描述:" class="postInfo-container-item">
                  <template>
                    <span>{{wfconFromData.userrole}}</span>
                  </template>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="开始日期:" class="postInfo-container-item">
                  <span>{{wfconFromData.startdate}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="截止日期:" class="postInfo-container-item">
                  <span>{{wfconFromData.enddate}}</span>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row >
              <el-col :span="12">
                <el-form-item label="能否查看全部案件:" class="postInfo-container-item">
                  <span>{{wfconFromData.ischeck ? '是' : '否'}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="能否查看全部时限:" class="postInfo-container-item">
                  <span>{{wfconFromData.isAllTlt ? '是' : '否'}}</span>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="备注:" class="postInfo-container-item uploader-custfile">
                  <template>
                    <span>{{wfconFromData.memo}}</span>
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

        <el-table-column label="操作" align="left" width="" class-name="small-padding fixed-width">
          <template slot-scope="scope">

            <el-button size="mini" type="text" @click="custAddrupdata(scope.row,'wfcon', true)">查看</el-button>

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

<!--        <el-table-column label="操作" align="left" width="" class-name="small-padding fixed-width">-->
<!--          <template slot-scope="scope">-->

<!--            <el-button size="mini" type="text" @click="handledeleElementglgs(scope.$index)">删除</el-button>-->

<!--          </template>-->
<!--        </el-table-column>-->
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
            {{scope.row.customerTags && scope.row.customerTags.length && scope.row.customerTags.map(item => item.tagName).join(', ')}}
          </template>
        </el-table-column>

<!--        <el-table-column label="操作" align="left" width="" class-name="small-padding fixed-width">-->
<!--          <template slot-scope="scope">-->

<!--            <el-button size="mini" type="text" @click="handledeleElementhy(scope.$index)">删除</el-button>-->

<!--          </template>-->
<!--        </el-table-column>-->
      </el-table>
      <el-table size="mini" v-if='alldialogBool=="lyct"' :data="alltableData" border fit empty-text="暂无数据" highlight-current-row current-row-key style="width: 100%;">
        <el-table-column type="index" width="50" label="序号" align="left"></el-table-column>
        <el-table-column label="利益冲突者名称" align="left" width>
          <template slot-scope="scope">

            <el-select default-first-option :clearable='true' v-model="scope.row.fullname" no-match-text='暂无数据' loading-text='正在查询' filterable remote reserve-keyword placeholder="请输入关键词"
                       :remote-method="remotepaternalUnitactivityList">
              <el-option v-for="item in seletData.activityList" :key="String(item.conId)" :label="item.fullname" :value="String(item.conId)">
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

<!--        <el-table-column label="操作" align="left" width="" class-name="small-padding fixed-width">-->
<!--          <template slot-scope="scope">-->

<!--            <el-button size="mini" type="text" @click="handledeleElementlyct(scope.$index)">删除</el-button>-->

<!--          </template>-->
<!--        </el-table-column>-->
      </el-table>

      <span slot="footer" class="dialog-footer">

        <el-button @click="alldialogVisible = false">关闭</el-button>

      </span>
    </el-dialog>
  </div>
</template>

<script>
  import Activity from '@/views/workbench/customer_management/activity_management/components/Activity.vue'
  import ContactDfDetail from '@/views/workbench/customer_management/contact_df_management/components/ContactDfDetail.vue'
  // import { queryCustomerSource } from "@/api/caseList"
  import {
    addCustomer,
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
    queryAgencyContactListUrl
  } from "@/api/customerList";
  import serviceApi from "@/api/serviceApi.config.js";
  import { mapGetters } from "vuex";
  import Vue from "vue";
  import { truncate } from "fs";
  import { getTwoDimensionalArray } from "@/utils/index.js";
  // import { CustZs } from "@/views/workbench/customer_management/customer_list/components/CustZs.vue";
  import {queryUserByRoleId} from '@/api/caseList'
  import CustZs from "./components/CustZs";
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
    name: "cust_view",
    computed: {
      ...mapGetters(["token", "name"])
    },
    components: { CustZs,ContactDfDetail,Activity },
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
        dialogLook: false,
        hzdisabled: true,
        alldialogBool: "",
        alltableData: [],
        alldialogVisible: false,
        disabledZs: false,
        dfdzlist: [],

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
        postForm: {
          customerResponsibleArray:[],
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
          source: "",
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
          "1129,1042,1,1044,1053,1045,1076,1050,1049,1051,1052,1112,1063,5",
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
          curId: []
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
        responsiblePartner:[],
        managementCommitteePartner:[],
        sourceList:[]
        // <--添加指示相关属性
      };
    },
    mounted() {
      window.addEventListener("scroll", this.handleScroll, true);
      if (this.billCustId != "") {
        this.fetchData(this.billCustId);
      }
    },
    created() {
      this.getAllSelectData();
      var id = this.$route.params && this.$route.params.id;
      if (this.billCustId != "") {
        id = this.billCustId;
      }
      this.fetchData(id);
      //
      // if (this.isEdit) {
      //
      // } else {
      //   addCustomer().then(response => {
      //     if (response.success) {
      //       this.postForm.custId = response.data.custId;
      //     } else {
      //       this.$message.error(response.message);
      //     }
      //   });
      // }
    },
    watch: {
      gridData(val) {
        this.popoverShow = true;
      },
      "postForm.ctData": function(data, oldval) {
        this.postForm.country = "";
        this.postForm.province = "";
        this.postForm.city = "";
        if (data[0]) {
          this.postForm.country = data[0];
        }
        if (data[1]) {
          this.postForm.province = data[1];
        }
        if (data[2]) {
          this.postForm.city = data[2];
        }

        if (!this.postForm.continent) {
          this.postForm.continent = this.getcontinent(data[0]);
        }
      },

      "addrFromData.ctData": function(data, oldval) {
        this.addrFromData.country = "";
        this.addrFromData.province = "";
        this.addrFromData.city = "";
        if (data[0]) {
          this.addrFromData.country = data[0];
        }
        if (data[1]) {
          this.addrFromData.province = data[1];
        }
        if (data[2]) {
          this.addrFromData.city = data[2];
        }

        this.addrFromData.continent = this.getcontinent(data[0]);
      }
    },
    methods: {
      // queryCustomerSource() {
      //   queryCustomerSource().then(res=>{
      //     this.seletData.customerSource = res.data
      //     this.sourceList = this.$commonUtils.getTwoDimensionalArray( this.seletData.customerSource,'id',this.postForm.source,'childrens')
      //   })
      // },
      fetchData(id) {
        queryCustomerUrl({ customerID: id })
          .then(response => {
            this.postForm = response.data;
            // this.queryCustomerSource()
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
            updateCustomerUrl(this.postForm).then(response => {
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
      addCustomerFile(type) {
        if (type == "dffile") {
          if (this.isdfItemTrue()) {
            this.$refs.uploadcustContactFile.submit();
          }
        } else {
          if (this.isItemTrue("custId")) {
            this.$refs.uploadCustFile.submit();
          }
        }
      },
      brforeRemoveFile(file, fileList) {
        // let delmaterialId;
        // if (file.response) {
        //   delmaterialId = file.response.data[0].materialId;
        // } else {
        //   delmaterialId = file.materialId;
        // }
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
      handlePreview(file) {
        console.log(file);
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
        querycustSelectClass({ classId: this.seletDataArr }).then(response => {
          if (response.success) {
            this.seletData.comLanguage = response.data["1129"];
            this.seletData.hzzt = response.data["5"];
            this.seletData.mainLegalNature = response.data["1042"];
            this.seletData.customerSource = response.data["1"];
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
            this.postForm.continent = this.getcontinent(this.postForm.ctData[0]);
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
        queryUserByRoleId({roleId:'2049'}).then(res=>{
          this.responsiblePartner=res.data
        })
        queryUserByRoleId({roleId: '2049,1'}).then(res=>{
          this.managementCommitteePartner=res.data
        })
      },
      dialogFormOpen(type) {
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
        if (this.isItemTrue("custId") || this.isBillEdit) {
          switch (type) {
            case "addr":
              this.dialogFormAddr = true;
              break;
            case "dfcon":
              this.dialogFormdfcon = true;
              addCustomerContactUrl({ custId: this.postForm.custId }).then(
                response => {
                  if (response.success) {
                    this.dfconFromData.custContactId =
                      response.data.data.custContactId;

                    this.postForm.customerContacts.unshift(response.data.data);
                  } else {
                    this.$message.error(response.message);
                  }
                }
              );
              break;
            case "hd":
              this.dialogFormhd = true;
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
            this.hdFromData.custActId = row.custActId
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
              console.log(tempData);
              delete tempData.activities;
              updateCustomerContacturl(tempData).then(response => {
                if (response.success) {
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
                } else {
                  this.$message.error(response.message);
                }
              });
            }
            break;

          case "hd":
            this.$refs["hdFromDataForm"].validate(valid => {
              if (valid) {
                this.hdFromData.custId = this.postForm.custId;
                this.hdFromData.customerContactActs.forEach(e => {
                  delete e.hdlx;
                });
                addActivityUrl(this.hdFromData).then(response => {
                  if (response.success) {
                    this.dialogFormhd = false;

                    this.postForm.activities.unshift(response.data);
                    console.log(this.postForm.activities, "+++");
                  } else {
                    this.$message.error(response.message);
                  }
                });
              } else {
                this.$message.error("请填写必填项");
                return false;
              }
            });

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
            const tempData1 = Object.assign({}, this.hdFromData);

            updateActivityUrl(tempData1).then(response => {
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
                    this.postForm.agencyContacts.splice(index, 1, response.data);

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
              info: ""
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
      display: flex;
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
      /*text-align: center;*/
      flex: 1;
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
</style>
