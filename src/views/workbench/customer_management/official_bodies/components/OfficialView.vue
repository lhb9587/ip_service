<template>
  <div class="createPost-container">

    <el-form ref="postForm" :model="postForm" :rules="rules" size="mini" class="form-container" label-width="130px">
      <div class="createPost-main-container">
        <div class="form-con">
          <el-row>
            <el-col class="tilteSpan" :span="24">
              <span id='jbxx-title'>基本信息</span>
            </el-col>
          </el-row>

          <el-row>
            <el-col class="form-con-item" :span="22">

              <el-row class="form-border">
                <el-col :span="24">
                  <el-row class="fullRow">
                    <el-col :span="24">
                      <el-form-item label="编码:" class="postInfo-container-item uploader-custfile">
                        {{postForm.custId}}
                      </el-form-item>
                    </el-col>

                  </el-row>
                  <el-row class="">
                    <el-col :span="12">
                      <el-form-item label="简称:" class="postInfo-container-item uploader-custfile">
                        {{postForm.name}}
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="全称:" class="postInfo-container-item uploader-custfile">
                        {{postForm.fullname}}
                      </el-form-item>
                    </el-col>

                  </el-row>
<!--                  <el-row class="fullRow">-->
<!--                    <el-col :span="24">-->
<!--                      <el-form-item label="全称:" class="postInfo-container-item uploader-custfile">-->
<!--                        {{postForm.fullname}}-->
<!--                      </el-form-item>-->
<!--                    </el-col>-->
<!--                  </el-row>-->

                  <el-row class="">
                    <el-col :span="12">
                      <el-form-item label="外文全称:" class="postInfo-container-item uploader-custfile">
                        {{postForm.fgFullname}}
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="申请人:" class="postInfo-container-item uploader-custfile">
                        {{postForm.isApplicant=='1'?'是':'否'}}
                      </el-form-item>
                    </el-col>

                  </el-row>

<!--                  <el-row class="fullRow">-->
<!--                    <el-col :span="24">-->
<!--                      <el-form-item label="申请人:" class="postInfo-container-item uploader-custfile">-->
<!--                        {{postForm.isApplicant=='1'?'是':'否'}}-->
<!--                      </el-form-item>-->
<!--                    </el-col>-->
<!--                  </el-row>-->

                  <el-row class="">
                    <el-col :span="12">
                      <el-form-item label="主体法律性质:" class="postInfo-container-item uploader-custfile">
                        <template>
                          <el-select  v-model="postForm.legalNature" disabled>
                            <el-option v-for="item in seletData.mainLegalNature" :key="item.id" :label="item.typeName" :value="item.id">
                            </el-option>
                          </el-select>
                        </template>
                      </el-form-item>

                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="政府机关类别:" class="postInfo-container-item uploader-custfile">
                        {{postForm.companyType}}
                      </el-form-item>

                    </el-col>

                  </el-row>
<!--                  <el-row class="fullRow">-->
<!--                    <el-col :span="24">-->
<!--                      <el-form-item label="政府机关类别:" class="postInfo-container-item uploader-custfile">-->
<!--                        {{postForm.companyType}}-->
<!--                      </el-form-item>-->

<!--                    </el-col>-->

<!--                  </el-row>-->
                  <el-row class="">
                    <el-col :span="12">
                      <el-form-item label="行政级别:" class="postInfo-container-item uploader-custfile">
                        {{postForm.officerLevel}}
                      </el-form-item>

                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="来源:" class="postInfo-container-item uploader-custfile">
                        {{postForm.source}}
                      </el-form-item>
                    </el-col>

                  </el-row>

<!--                  <el-row class="fullRow">-->
<!--                    <el-col :span="24">-->
<!--                      <el-form-item label="来源:" class="postInfo-container-item uploader-custfile">-->
<!--                        {{postForm.source}}-->
<!--                      </el-form-item>-->
<!--                    </el-col>-->

<!--                  </el-row>-->
                  <el-row class="">
                    <el-col :span="12">
                      <el-form-item label="介绍人:" class="postInfo-container-item uploader-custfile">
                        {{postForm.custIntroductor}}
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="介绍人单位:" class="postInfo-container-item uploader-custfile">
                        {{postForm.custIntroCompany}}
                      </el-form-item>
                    </el-col>
                  </el-row>
<!--                  <el-row class="fullRow">-->
<!--                    <el-col :span="24">-->
<!--                      <el-form-item label="介绍人单位:" class="postInfo-container-item uploader-custfile">-->
<!--                        {{postForm.custIntroCompany}}-->
<!--                      </el-form-item>-->
<!--                    </el-col>-->

<!--                  </el-row>-->

                  <el-row class="">
                    <el-col :span="12">
                      <el-form-item label="官网网址:" class="postInfo-container-item uploader-custfile">
                        {{postForm.website}}
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="传真:" class="postInfo-container-item uploader-custfile">
                        {{postForm.phone}}
                      </el-form-item>
                    </el-col>
                  </el-row>
<!--                  <el-row class="fullRow">-->
<!--                    <el-col :span="24">-->
<!--                      <el-form-item label="传真:" class="postInfo-container-item uploader-custfile">-->
<!--                        {{postForm.phone}}-->
<!--                      </el-form-item>-->
<!--                    </el-col>-->
<!--                  </el-row>-->
                  <el-row class="">
                    <el-col :span="12">
                      <el-form-item label="电话:" class="postInfo-container-item uploader-custfile">
                        {{postForm.fax1}}
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="电子邮件:" class="postInfo-container-item uploader-custfile">
                        {{postForm.email}}
                      </el-form-item>
                    </el-col>
                  </el-row>
<!--                  <el-row class="fullRow">-->
<!--                    <el-col :span="24">-->
<!--                      <el-form-item label="电子邮件:" class="postInfo-container-item uploader-custfile">-->
<!--                        {{postForm.email}}-->
<!--                      </el-form-item>-->
<!--                    </el-col>-->
<!--                  </el-row>-->
                  <el-row class="fullRow">
                    <el-col :span="24">
                      <el-form-item label="简介:" class="postInfo-container-item uploader-custfile">

                        {{postForm.info}}
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row class="fullRow">
                    <el-col :span="24">

                      <el-form-item label="文档:" class="postInfo-container-item uploader-custfile">

<!--                          <el-upload class="upload-demo" name="custFile" :data='addCustomerFileData' ref="uploadCustFile" :action="addCustomerFileUrl" :before-upload="handlePreview"-->
<!--                                     list-type='picture' :on-remove="handleRemove" :file-list="postForm.materiaoList" :auto-upload="false">-->
<!--                            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>-->
<!--                            <el-button style="margin-left: 10px;" size="small" type="success" @click="addCustomerFile">-->
<!--                              上传</el-button>-->

<!--                          </el-upload>-->
                          <p v-for="item in materialList">
                            <span  class="itemTitle_style" @click="preView(`${item.address}`) ">{{item.materialName}}</span>
                          </p>
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

                </el-col>
              </el-row>
              <el-row>
                <el-col class="tilteSpan" :span="24">
                  <span id='khdz-title'>官方机构-地址</span>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-table size="mini" :data="postForm.customerAddrs" border fit empty-text="暂无数据" highlight-current-row current-row-key style="width: 100%;">
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
                  </el-table>
                </el-col>
              </el-row>
              <el-row>
                <el-col class="tilteSpan" :span="24">
                  <span id='dflxr-title'>官方机构-对方联系人</span>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-table size="mini" :data="postForm.customerContacts" border fit empty-text="暂无数据" highlight-current-row current-row-key style="width: 100%;">

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
                        <span>{{ scope.row.status }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="启用" align="left" width>
                      <template slot-scope="scope">
                        <span>{{ scope.row.sysStatus }}</span>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-col>
              </el-row>
              <el-row>
                <el-col class="tilteSpan" :span="24">
                  <span id='khhd-title'>官方机构-活动</span>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="24">
                  <el-table size="mini" :data="postForm.activities" border fit empty-text="暂无数据" highlight-current-row current-row-key style="width: 100%;">
                    <el-table-column type="index" width="50" label="序号" align="left"></el-table-column>
                    <el-table-column label="活动类型" align="left" width>
                      <template slot-scope="scope">
                        <span>{{ scope.row.actTypeStr }}</span>
                      </template>
                    </el-table-column>
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


                  </el-table>
                </el-col>
              </el-row>
              <el-row>
                <el-col class="tilteSpan" :span="24">
                  <span id='wflxr-title'>官方机构-我方联系人</span>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="24">
                  <el-table size="mini" :data="postForm.agencyContacts" border fit empty-text="暂无数据" highlight-current-row current-row-key style="width: 100%;">
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


                  </el-table>
                </el-col>
              </el-row>

              <el-row>
                <el-col class="tilteSpan" :span="24">
                  <span id='glgs-title'>关联公司</span>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="24">
                  <el-table size="mini" :data="postForm.customerAssociates" border fit empty-text="暂无数据" highlight-current-row current-row-key style="width: 100%;">
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

                  </el-table>
                </el-col>
              </el-row>

              <el-row v-if="!isCustomer">
                <el-col :span="24" style="text-align:center">
                  <el-form-item>

                    <el-button type="primary" @click="$router.go(-1);" size="medium">取消</el-button>

                  </el-form-item>
                </el-col>

              </el-row>
            </el-col>
            <el-col class="form-con-item clearfix" :span="2">
              <div style="height: 520px;position: fixed;top:20%;right:2%">
                <el-steps :space="200" :active="stepActive" direction="vertical">
                  <el-step @click.native="stepset(0)" title="基本信息"></el-step>
                  <el-step @click.native="stepset(1)" title="地址"></el-step>
                  <el-step @click.native="stepset(2)" title="对方联系人"></el-step>
                  <el-step @click.native="stepset(3)" title="活动"></el-step>

                  <el-step @click.native="stepset(6)" title="关联公司"></el-step>

                </el-steps>
              </div>
            </el-col>
          </el-row>

        </div>

      </div>

    </el-form>


  </div>
</template>

<script>
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
  updateCustomerUrl
} from "@/api/customerList";
import serviceApi from "@/api/serviceApi.config.js";
import { mapGetters } from "vuex";
import { truncate, truncateSync } from "fs";
export default {
  name: "officialView",
  computed: {
    ...mapGetters(["token", "name"])
  },
  components: {},
  props: {
    isCustomer: {
      type: Boolean,
      default: false
    },
    officialId: {
      type: [Number, String]
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      zsfileUploadbool: false,
      isCreatTrue: false,
      creatAddrForm: {},
      stepActive: 0,
      materialList: [],
      postForm: {
        name: "",
        custId: "",
        examineStatus: "1623",
        officerLevel: "",
        companyType: "",
        // userIcon: $("#sendFile-btn").attr("data-fileName"),   //头像
        materialList: [],
        fullname: "",
        fullnameEn: "",
        fgFullname: "",
        contactLanguage: "",
        isCollaboration: "",
        firstcaseCollitem: "",
        parentCustId: "",

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
        isOfficial: "1",
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
        customerIndustryS: [],

        ctData: []
      },

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
            trigger: "blur",
            message: " "
          }
        ],

        fax1: [
          {
            required: true,
            trigger: "blur",
            message: " "
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
        ID: "",
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
        "1042,1,1044,1053,1045,1076,1050,1049,1051,1052,1112,1063,1037,1048",
      seletData: {
        mainLegalNature: {}, //主法律性质
        customerSource: {}, //客户来源
        xzLevel: {},
        zfjgType: {},
        paternalUnitKh: {}, //kh
        customerOwner: {}, //客户所有者
        censor: {},
        caseType: {},
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
        industry: {}
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
        routineActMemo: ""
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

        caseTypeIds: "",

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
      }
      // <--添加指示相关属性
    };
  },
  created() {
    this.getAllSelectData();
    window.addEventListener("scroll", this.handleScroll);
      const id = this.$route.params && this.$route.params.id || this.officialId;
      this.fetchData(id);
  },
  watch: {
    "postForm.ctData": function(data, oldval) {
      if (data) {
        this.postForm.country = data[0];
        this.postForm.province = data[1];
        this.postForm.city = data[2];
        if (!this.postForm.continent) {
          this.postForm.continent = this.getcontinent(data[0]);
        }
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
    fetchData(id) {
      queryCustomerUrl({ customerID: id })
        .then(response => {
          this.postForm = response.data;
          this.materialList= this.postForm.materialList
          // this.materialIdList= this.materialArray.map(item=>item.materialId)
          if (this.postForm.country) {
            this.postForm.ctData = [
              this.postForm.country,
              this.postForm.province,
              this.postForm.city
            ];
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    preView(url){
      if(['pdf','jpg','png'].some(item=>url.replace(/.+\./,"").toLocaleLowerCase()==item)){
        window.open(`/ipdoc${url}`.replace(/[+]/g,'%2B'))
      } else {
        this.$commonUtils.downLoadAll({url:`ipdoc${url}`})
      }
    },
    // 获取各个select数据
    getAllSelectData() {
      console.log(this.seletDataArr, "00000");
      querycustSelectClass({ classId: this.seletDataArr }).then(response => {
        if (response.success) {
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
          this.seletData.xzLevel = response.data["1048"];
          this.seletData.zfjgType = response.data["1037"];
        } else {
          this.$message.error(response.message);
        }
      });
      queryActivityListflUrl().then(response => {
        if (response.success) {
          this.seletData.activityList = response.data;
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
      queryCustomerReqTypeUrl().then(response => {
        if (response.success) {
          this.seletData.reqType = response.data;
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
    remotepaternalUnitKh(query) {
      if (query !== "") {
        queryCustomersUrl({ name: query }).then(response => {
          if (response.success) {
            this.seletData.paternalUnitKh = response.data;
          } else {
            this.$message.error(response.message);
          }
        });
      }
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

    handledeleElementhddfcon(item) {
      const index = this.hdFromData.customerContactActs.indexOf(item);
      this.hdFromData.customerContactActs.splice(index, 1);
    },
    handledeleElementhdwfcon(item) {
      const index = this.hdFromData.agencyContactActs.indexOf(item);
      this.hdFromData.agencyContactActs.splice(index, 1);
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
      this.wfconFromData.position = e.positionStr;
    },
    regTypeselectChange(id) {
      this.zsFromData.custId = this.postForm.custId;
      addCustomerRequirementUrl(this.zsFromData).then(response => {
        if (response.success) {
          this.zsFromData.id = response.data.id;
          this.zsFromData.ID = response.data.id;
          this.zsfileUploadbool = true;
          this.postForm.customerRequirements.push(response.data);
        } else {
          this.$message.error(response.message);
        }
      });
      queryregCaseTypeUrl({
        indicateType: id,
        custId: this.postForm.custId
      }).then(response => {
        if (response.success) {
          this.seletData.caseTypezs = response.data;
        }
      });
    }
    //<--表格项
  }
};
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.el-table /deep/ th {
  background-color: #7199d5;
  color: #ffffff;
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
    height: 40px;
    line-height: 40px;
    padding: 0px;
  }
  /deep/ td {
    background-color: #ffffff !important;
  }
  /deep/ .el-input__inner,
  /deep/ .el-select {
    width: 100%;
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
    /*width: 30%;*/
    text-align: center;
    flex-shrink: 0;
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
    height: 30px;
    margin-left: 0!important;
  }
  .fullRow {
    /deep/ .el-form-item__label {
      /*width: 15%;*/
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
</style>
<style>
.form-border[data-v-043163e9] .el-form-item__label {
  margin-right: 10px;
  text-align: right;
}
</style>
