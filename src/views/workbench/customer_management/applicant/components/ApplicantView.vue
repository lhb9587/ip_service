<template>
  <div class="createPost-container">

    <el-form ref="postForm" :model="postForm" :rules="rules" size="mini" class="form-container">
      <div class="createPost-main-container">
        <div class="form-con">
          <el-row class="tilteSpan">
            <span id='jbxx-title'>申请人基本信息</span>
          </el-row>
          <el-row>
            <el-col :span="postForm.taskRecordList && postForm.taskRecordList.length ? 18 : 23">
              <p class="p-style">
                <el-form-item label="编码:" class="postInfo-container-item" label-width="130px">
                  {{postForm.appId}}
                </el-form-item>
                <el-form-item label="国籍:" class="postInfo-container-item left-border">
                  {{postForm.country}}
                </el-form-item>
              </p>
              <p class="p-style">
                <el-form-item label="主体法律性质:" class="postInfo-container-item" label-width="130px">
                  {{postForm.appType}}
                </el-form-item>
              </p>
              <p class="p-style" v-if="postForm.country == '中国'&&postForm.appType!='自然人'">
                <el-form-item label="统一社会信用代码:" class="postInfo-container-item" label-width="130px">
                  {{postForm.certCode}}
                </el-form-item>
              </p>
              <p class="p-style">
                <el-form-item label="企业字号:" class="postInfo-container-item" label-width="130px">
                  {{postForm.keyNameList + ''}}
                </el-form-item>
              </p>
              <p class="p-style" v-if="postForm.appType=='自然人'">
                <el-form-item label="证件类型:" class="postInfo-container-item" label-width="130px">
                  {{postForm.cardName}}
                </el-form-item>
                <el-form-item label="证件号:" class="postInfo-container-item left-border">
                  {{postForm.cardNumber}}
                </el-form-item>
              </p>
              <p class="p-style">
                <el-form-item label="简称:" class="postInfo-container-item" label-width="130px">
                  {{postForm.shortname}}
                </el-form-item>
              </p>
              <p class="p-style">
                <el-form-item label="中文名称:" class="postInfo-container-item" label-width="130px">
                  {{postForm.applicantName}}
                </el-form-item>
              </p>
              <p class="p-style">
                <el-form-item label="原文名称:" class="postInfo-container-item" label-width="130px">
                  {{postForm.fgFullname}}
                </el-form-item>
                <el-form-item label="英文名称:" class="postInfo-container-item left-border">
                  {{postForm.applicantEnName}}
                </el-form-item>
              </p>
              <p class="p-style">
                <el-form-item label="是否属于客户:" class="postInfo-container-item" label-width="130px">
                  {{postForm.isCustomer=='1'?'是':'否'}}
                </el-form-item>
                <el-form-item label="所属客户:"  class="postInfo-container-item left-border">
                  {{getCustNameStr}}
                </el-form-item>
              </p>
              <p class="p-style">
                <el-form-item label="证件扣发设置:" class="postInfo-container-item" label-width="130px">
                  {{postForm.certDeprive}}
                </el-form-item>
                <el-form-item label="案件类型:" class="postInfo-container-item left-border">
                  {{postForm.caseTypeIds}}
                </el-form-item>
              </p>
              <p class="p-style">
                <el-form-item label="邮件配置:" class="postInfo-container-item" label-width="130px">
                  <el-checkbox-group v-model="postForm.mailConfigs">
                    <el-checkbox :disabled="true" :label="1">续展提醒</el-checkbox>
                    <el-checkbox :disabled="true" :label="2">初审公告提醒</el-checkbox>
                    <el-checkbox :disabled="true" :label="3">送达公告提醒</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </p>
              <p class="p-style">
                <el-form-item label="案件要求:" class="postInfo-container-item" label-width="130px">
                  {{postForm.jobRequire}}
                </el-form-item>
              </p>
              <p class="p-style">
                <el-form-item label="费用要求:" class="postInfo-container-item" label-width="130px">
                  {{postForm.costRequire}}
                </el-form-item>
              </p>
              <p class="p-style">
                <el-form-item label="联系电话:" class="postInfo-container-item" label-width="130px">
                  {{postForm.phone}}
                </el-form-item>
              </p>
              <p class="p-style">
                <el-form-item label="备注:" class="postInfo-container-item" label-width="130px">
                  {{postForm.memo}}
                </el-form-item>
              </p>
              <p class="p-style">
                <el-form-item label="建档日期:" class="postInfo-container-item" label-width="130px">
                  {{postForm.createDate}}
                </el-form-item>
                <el-form-item label="建档人:" class="postInfo-container-item left-border">
                  {{userName}}
                </el-form-item>
              </p>
              <p class="p-style bot-p">
                <el-form-item label="其他收据抬头:" class="postInfo-container-item" label-width="130px">
                  {{postForm.otherTitle}}
                </el-form-item>
                <el-form-item label="主体统一社会信用代码:" class="postInfo-container-item left-border" label-width="170px">
                  {{postForm.otherCertCode}}
                </el-form-item>
              </p>
            </el-col>
            <el-col style="margin-left: -30px;height: 100px;" :span="1">
            </el-col>
            <el-col :span="5" v-if="postForm.taskRecordList && postForm.taskRecordList.length">
              <el-timeline>
                <el-timeline-item :color="item.status=='已完成'?'green':'red'" v-for="item in postForm.taskRecordList"  :timestamp="item.finish" placement="top">
                  <el-card>
                    <h4>任务名称 {{item.progressName}}</h4>
                    <p class="item_p">状态 {{item.status}}</p>
                    <p class="item_p"">审核备注 {{item.failReason || '-'}}</p>
                    <p class="item_p">审核人 {{item.auditUserName}}</p>
                    <!--        <p class="item_p">动作 {{item.tasker}}</p>-->
                    <p class="item_p">时间 {{item.createTime}}</p>
                  </el-card>
                </el-timeline-item>
              </el-timeline>
            </el-col>
          </el-row>

          <el-row>
            <el-col class="tilteSpan" :span="24">
              <span id='khdz-title'>申请人地址</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-table size="mini" :data="postForm.applicantAddresses" border fit empty-text="暂无数据" highlight-current-row current-row-key style="width: 100%;">
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
                <el-table-column label="专利" align="left" width>
                      <template slot-scope="scope">
<!--                        <el-radio-group v-model="scope.row.isPatent">-->
<!--                          <el-radio :label='1'>是</el-radio>-->
<!--                          <el-radio :label='0'>否</el-radio>-->
<!--                        </el-radio-group>-->
                        <span>{{ scope.row.isPatent ? '是' : '否' }}</span>
                      </template>
                    </el-table-column>
                <el-table-column label="状态" align="left" width>
                  <template slot-scope="scope">
                    {{scope.row.status}}
                    <!--                        <span>{{ scope.row.status }}</span>-->
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
              <span id='wflxr-title'>申请人-联系人</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-table size="mini" :data="postForm.applicantContacts" border fit empty-text="暂无数据" highlight-current-row current-row-key style="width: 100%;">
                <el-table-column type="index" width="50" label="序号" align="left"></el-table-column>
                <el-table-column label="联系人中文名称" align="left" width>
                  <template slot-scope="scope">
                    <span>{{ scope.row.nameCn }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="联系人英文名称" align="left" width>
                  <template slot-scope="scope">
                    <span>{{ scope.row.nameEn }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="地址" align="left" width>
                  <template slot-scope="scope">
                    <span>{{ scope.row.address }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="联系电话" align="left" width>
                  <template slot-scope="scope">
                    <span>{{ scope.row.telphone }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="地址邮箱" align="left" width>
                  <template slot-scope="scope">
                    <span>{{ scope.row.email }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="邮政编码" align="left" width>
                  <template slot-scope="scope">
                    <span>{{ scope.row.post }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>

          <el-row v-if="!isCust">
            <el-col style="text-align:center">
                <el-button type="primary" @click="$router.go(-1);" size="medium">取消</el-button>
            </el-col>
          </el-row>

        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
import {
  querycustSelectClass,
  queryDetailByIdUrl,
  queryCountrysUrl,
  queryCountry,
  createUrl,
  updateUrl,

  queryCustomerNameIdUrl,
} from "@/api/applicant";
import serviceApi from "@/api/serviceApi.config.js";
import { queryUserNames } from "@/api/caseDetail";
import { getToken } from "@/utils/auth";
import { mapGetters } from "vuex";
import { truncate } from "fs";

export default {
  name: "ApplicantView",
  computed: {
    ...mapGetters(["token", "name"]),
    getCustNameStr(){
      if(this.customerList.length){
        return this.postForm.custIdArray.map(item=>this.customerList.find(itm=>itm.custId==item)).map(item=>item.fullname).join(', ')
      }else {
        return ''
      }

    }
  },
  components: {},
  props: {
    appId: {},
    isEdit: {
      type: Boolean,
      default: false
    },
    isCust: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      custIdArray:[],
      filterCustName: "",
      zsfileUploadbool: false,
      isCreatTrue: false,
      custselectDis: false,
      creatAddrForm: {},
      stepActive: 0,
      userName: '',
      postForm: {
        custId:'',
        isCustomer: 1,
        appId: "", // int(11) NOT NULL AUTO_INCREMENT COMMENT '申请人编号',
        applicantName: "", // varchar(500) DEFAULT NULL COMMENT '申请人中文名称',
        applicantAddress: "", // varchar(500) DEFAULT NULL COMMENT '申请人中文地址',
        applicantEnName: "", // varchar(500) DEFAULT NULL COMMENT '申请人英文名称',
        applicantEnAddress: "", // varchar(500) DEFAULT NULL COMMENT '申请人英文地址',
        usertName: "", // varchar(200) DEFAULT NULL COMMENT '操作人名字',
        modifyTime: "", // timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
        country: "", // varchar(150) DEFAULT NULL COMMENT '国籍',
        appType: "", // varchar(100) DEFAULT NULL COMMENT '主体法律性质',
        sendType: "", // varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '书式类型：中国大陆、国外、中国台湾、中国香港、中国澳门',
        cardName: "", // varchar(100) DEFAULT NULL COMMENT '证件名称',
        cardNumber: "", // varchar(100) DEFAULT NULL COMMENT '证件号码',
        mainAppId: "", // int(11) DEFAULT NULL COMMENT '所属申请人',
        hasTm: "", // int(11) DEFAULT NULL COMMENT '对应的商标',
        fromTm: "", // int(11) DEFAULT NULL COMMENT '申请人的来源，0：代表手工录入，1：代表从商标中提取 2：wpm中导入',
        certCode: "", // varchar(100) DEFAULT NULL COMMENT '统一社会信用代码',
        code: "", // varchar(100) DEFAULT NULL COMMENT '编码',
        shortname: "", // varchar(500) DEFAULT NULL COMMENT '简称（申请人名称取的是全称）',
        fgFullname: "", // varchar(500) DEFAULT NULL COMMENT '原文名称',
        continent: "", // varchar(100) DEFAULT NULL COMMENT '大洲',
        province: "", // varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '省份',
        city: "", // varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '城市',
        createDate: "", // datetime DEFAULT NULL COMMENT '创建时间',
        userId: "", // int(11) DEFAULT NULL COMMENT '建档人',
        post: "", // varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '邮编',
        memo: "", // text CHARACTER SET utf8 COLLATE utf8_general_ci COMMENT '备注',
        levelItem: "", // varchar(100) DEFAULT NULL COMMENT '申请人级别',
        jobRequire: "", //text COMMENT '作业要求',
        costRequire: "", // text COMMENT '费用要求',
        contactCn: "", // varchar(200) DEFAULT NULL COMMENT '联系人中文',
        contactEn: "", // varchar(200) DEFAULT NULL COMMENT '联系人英文',
        contactAddr: "", // varchar(500) DEFAULT NULL COMMENT '联系人地址',
        certDeprive: [], // varchar(100) DEFAULT NULL COMMENT '证件扣发设置',
        certificateType: "", // varchar(100) DEFAULT NULL COMMENT '证件种类',
        dataSource: "", // varchar(100) DEFAULT NULL COMMENT '数据来源（保存wpm中的Id，格式如：wpm数据-incid）',
        applicantAddresses: [],
        applicantContacts: [],
        preCustIdArray:[],
        taskRecordList: []
      },

      loading: false,
      dialogFormAddr: false,

      dialogFormwfcon: false,

      rules: {
        certCode: [
          {
            required: true,
            message: "请填写统一社会信用代码",
            trigger: "blur"
          }
        ],
        isCustomer: [
          {
            required: true,
            trigger: "change",
            message: " "
          }
        ],
        country: [
          {
            required: true,
            trigger: "change",
            message: " "
          }
        ],
        appType: [
          {
            required: true,
            message: " ",
            trigger: "change"
          }
        ],
        cardNumber: [
          {
            required: true,
            message: " ",
            trigger: "change"
          }
        ],
        // custId: [
        //   {
        //     required: true,
        //     message: " ",
        //     trigger: "change"
        //   }
        // ],
        cardName: [
          {
            required: true,
            message: " ",
            trigger: "change"
          }
        ],
        // lawNature: [
        //   {
        //     required: true,
        //     message: " ",
        //     trigger: "change"
        //   }
        // ],
        applicantName: [
          {
            required: true,
            message: " ",
            trigger: "change"
          }
        ]
      },

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
      seletDataArr: "1044,1042",
      seletData: {
        country: {},
        ctDataOption: {},
        statu: {},
        mainLegalNature: {},
        custnames: []
      },
      editIndex: "",
      alldialogVisible:false,
      alldialogBool:'',
      customerList:[]
    };
  },
  created() {
    this.getAllSelectData();
    window.addEventListener("scroll", this.handleScroll);
      const id = this.$route.params && this.$route.params.id || this.appId;
      this.fetchData(id);

    // console.log(this.isEdit,'**-**')
  },
  watch: {
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
    remotepaternalUnit(query) {
      if (query !== "") {
        queryCustomerNameIdUrl({ keyword: query ,isCustomer:1,pageNo: 1,pageSize: 100 }).then(response => {
          if (response.success) {
            this.seletData.custnames =this.$commonUtils.unique([...response.data,...this.customerList.filter(item=>this.postForm.custIdArray.includes(item.custId))],'custId')
          } else {
            this.$message.error(response.message);
          }
        });
      }
    },
    allMessageFormShow(type) {
      this.alldialogVisible = true;

      switch (type) {

        case "addr":

          this.alltableData = this.postForm.applicantAddresses;
          this.alldialogBool = "addr";

          break;
        case "wfcon":

          this.alltableData = this.postForm.applicantContacts;
          this.alldialogBool = "wfcon";

          break;


        default:
          break;
      }
    },
    fetchData(id) {
      queryDetailByIdUrl({ appId: id })
        .then(response => {
          this.postForm.userId = response.data.userId;
          this.postForm = response.data.applicant;
          this.postForm.applicantAddresses = response.data.address;
          this.postForm.applicantContacts = response.data.contact;
          this.postForm.custIdArray=response.data.applicant.custIdArray;
          queryUserNames().then(res => {
            res.data.forEach(item => {
              if(item.userId == this.postForm.userId) {
                this.userName = item.fullname
              }
            })
            // console.log(this.userName)
          })
          queryCustomerNameIdUrl({ isCustomer:1}).then(response => {
            this.customerList=response.data
            this.seletData.custnames = this.customerList.filter(item=>this.postForm.custIdArray.includes(item.custId))
          })
        })
        .catch(err => {
          console.log(err);
        });
    },

    //<--icon上传
    // 获取各个select数据
    getAllSelectData() {
      querycustSelectClass({ classId: this.seletDataArr }).then(response => {
        if (response.success) {
          this.seletData.statu = response.data["1044"];
          this.seletData.mainLegalNature = response.data["1042"];

        } else {
          this.$message.error(response.message);
        }
      });
    },
    filterCust(str) {
      this.filterCustName = str;
    }
  },
};
</script>


<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.el-table /deep/ th {
  background-color: #7199d5;
  color: #ffffff;
}
.titleLeft {
  margin-right: 20px;
}
.tilteSpan {
  font-size: 18px;
  padding: 15px 0px;
  color: #7199d5;
}
.el-step {
  cursor: pointer;
}
.tilteBtn {
  text-align: right;
  padding: 10px 10px;
  background-color: #d0d0d0;
}
.p-style {
  display: flex;
}
.p-style .el-form-item {
  flex: 1;
  width: 50%;
  border: 1px solid #EBEEF5;
  margin:0;
  border-bottom: 0;

}
.p-style .left-border {
  border-left: 0;
}
.el-form-item {
  width: 200px;
}
.bot-p {
  border-bottom: 1px solid #EBEEF5;
}

</style>
<style>
.p-style .el-form-item__content {
  line-height: 40px;
  /*padding-left: 5px;*/
}
.p-style .el-form-item__label {
  /*text-align: center;*/
  background-color: #F9F9F9;
  line-height: 40px;
  height: 40px;
  margin-right: 10px;
}
.left-border .el-form-item__label {
  width: 170px;

}
.el-card{
  .item_p{margin-top: 10px}
}
</style>
