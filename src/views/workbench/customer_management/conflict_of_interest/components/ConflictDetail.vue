<template>
  <div class="createPost-container">

    <el-form ref="postForm" :model="postForm" :rules="rules" size="mini"  class="form-container"  label-width="206px">
      <div class="tilteSpan">
        <span id='jbxx-title'>基本信息</span>
      </div>
          <el-row style="display: none">
            <el-col class="" :span="24">
            </el-col>
          </el-row>
              <el-row class="" style="border-top: 1px solid #f5f5f5;">
                  <el-col :span="12">
                    <el-form-item label="编码:" class="">
                      <el-input v-model="postForm.conId" :disabled="true"></el-input>
                    </el-form-item>
                  </el-col>
                <el-col :span="12">
                  <el-form-item label="相对客户:" class="">
                    <el-select
                      class="slect-op"
                      v-model="postForm.custIdArray"
                      multiple
                      filterable
                      remote
                      clearable
                      placeholder="请输入客户名"
                      :remote-method="(queryString)=>{queryCustArrList(queryString)}"
                    >
                      <el-option v-for="(item,index) in custList" :key="index" :label="item.fullname" :value="item.custId">
                        <span>{{item.name}}</span>
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="fullRow">

                  <el-form-item label="中文名称/全称:" prop="fullname" class="small-el-form-item">
                    <el-input v-model="postForm.fullname"></el-input>
                  </el-form-item>
              </el-row>

              <el-row>
                  <el-form-item label="简称:" prop="shortname" class="postInfo-container-item">
                    <el-input v-model="postForm.shortname"></el-input>
                  </el-form-item>


                  <el-form-item label="外文简称:" class="postInfo-container-item">
                    <el-input v-model="postForm.fgFullname"></el-input>
                  </el-form-item>

              </el-row>

              <el-row class="fullRow">
                  <el-form-item label="国家/省份/城市:" prop="ctData" class="small-el-form-item">
                    <template>
                      <el-cascader clearable change-on-select style="width:41%" placeholder="" v-model="postForm.ctData" :options="seletData.ctDataOption" filterable>
                      </el-cascader>

                    </template>
                  </el-form-item>
              </el-row>
              <el-row class="fullRow">
                  <el-form-item label="中文地址:" class="small-el-form-item">
                    <template>
                      <el-input v-model="postForm.address"></el-input>
                    </template>
                  </el-form-item>
              </el-row>
              <el-row >

                  <el-form-item label="英文地址:" class="small-el-form-item">
                    <template>
                      <el-input v-model="postForm.addressEn"></el-input>
                    </template>
                  </el-form-item>
              </el-row>
              <el-row>

                  <el-form-item label="主页:" class="postInfo-container-item">
                    <template>
                      <el-input v-model="postForm.info"></el-input>
                    </template>
                  </el-form-item>

                  <el-form-item label="传真:" class="postInfo-container-item">
                    <template>
                      <el-input v-model="postForm.fax"></el-input>
                    </template>
                  </el-form-item>

              </el-row>
              <el-row>
                  <el-form-item label="电话:" class="postInfo-container-item">
                    <template>
                      <el-input v-model="postForm.phone"></el-input>
                    </template>
                  </el-form-item>

                  <el-form-item label="电子邮件:" class="postInfo-container-item">
                    <template>
                      <el-input v-model="postForm.email"></el-input>
                    </template>
                  </el-form-item>

              </el-row>
              <el-row >
                <el-form-item label="上传文件:">
                  <el-upload
                    ref="upload"
                    class="upload-demo"
                    drag
                    multiple
                    name="attachFile"
                    :data="getUploadData()"
                    :action="creatematerial"
                    :file-list="materialArray"
                    :on-remove="handleRemove"
                    :on-preview="onPreview"
                    :on-success="onsuccess"
                    >
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                  </el-upload>
                </el-form-item>
              </el-row>
              <el-row class="fullRow">
                  <el-form-item label="备注:" class="postInfo-container-item uploader-custfile">
                    <template>
                      <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="postForm.memo">
                      </el-input>
                    </template>
                  </el-form-item>
              </el-row>
              <el-row>
                  <el-form-item label="建档日期:" class="postInfo-container-item">
                    <template>
                      {{postForm.createDate}}
<!--                      <el-input v-model="postForm.createDate"></el-input>-->
                    </template>
                  </el-form-item>
                  <el-form-item label="建档人:" class="postInfo-container-item">
                    <template>
                      {{postForm.createName}}
<!--                      <el-input v-model="postForm.createName"></el-input>-->
                    </template>
                  </el-form-item>
              </el-row>


              <div v-if="!isCustomer" style="display:flex;justify-content: center;margin-top:20px">
                   <el-button size="medium" type="primary" v-if="!isEdit" @click="submitForm('postForm')">创建
                    </el-button>
                    <el-button size="medium" type="primary" v-if="isEdit" @click="updatasubmitForm('postForm')">保存修改
                    </el-button>

                    <el-button type="primary" size="medium" @click="cancel">取消</el-button>
              </div>
    </el-form>

  </div>
</template>

<script>
import {
  queryCountry,
  addConflicterUrl,
  updateCustomerConflicterUrl,
  queryCustomerConflicterUrl,
  deleteMaterial
} from "@/api/customerList";
import { creatematerial } from '@/api/ipServiceApi.config.js'
import {delCaseMaterial } from '@/api/caseList.js'
import { mapGetters } from "vuex";
import { truncate, truncateSync } from "fs";
import Vue from "vue";
import { queryCustomerNameId } from '../../../../../api/customerList'
export default {
  name: "ConflictDetail",
  computed: {
    ...mapGetters(["token", "name"])
  },
  components: {},
  props: {
    isCustomer: {
      type: Boolean,
      default: false
    },
    conflictId: {},
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      postForm: {
        custIdArray: [],
        createTime: "",
        createUserName: "",
        conId: "",
        fullname: "",
        shortname: "",
        fgFullname: "",
        country: "",
        province: "",
        city: "",
        address: "",
        addressEn: "",
        phone: "",
        fax: "",
        email: "",
        memo: "",
        info: "",
        ctData: []
      },

      creatematerial,
      materialArray:[],
      materialIdList:[],
      loading: false,

      rules: {
        fullname: [
          {
            required: true,
            trigger: "change"
          }
        ],
        ctData: [
          {
            type: "array",
            required: true,

            trigger: "change"
          }
        ],
        shortname: [
          {
            required: true,
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

      seletData: {
        ctDataOption: []
      },
      custList: []
    };
  },
  created() {
    this.getAllSelectData();

    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id || this.conflictId;
      this.fetchData(id);
    }
  },
  watch: {
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
    }
  },
  methods: {
    queryCustArrList(value) {
      if(value !== ''){
        queryCustomerNameId({ pageNo: 1, pageSize: 100,keyword: value }).then(res=>{
          this.custList = this.$commonUtils.unique([...this.custList, ...res.data], 'custId')
        })
      } else {
        this.custList = []
      }
    },
    cancel() {
      if (this.isCustomer) {
        this.$emit('closeDialog', true)
      } else {
       this.$router.go(-1);
      }
    },
    fetchData(id) {
      queryCustomerConflicterUrl({ conId: id })
        .then(response => {
          this.postForm = response.data;
          if (!this.postForm.custIdArray) {
            this.$set(this.postForm, 'custIdArray', [])
          } else {
            queryCustomerNameId({pageNo: 1, pageSize: 100,custIdArray: this.postForm.custIdArray}).then(res=> {
              this.custList = res.data
            })
          }
          this.materialArray = this.postForm.materialList
          this.materialIdList= this.materialArray.map(item=>item.materialId)
          Vue.set(this.postForm, "ctData", []);
          this.postForm.ctData = [
            this.postForm.country,
            this.postForm.province,
            this.postForm.city
          ];
        })
        .catch(err => {
          console.log(err);
        });
    },
    onPreview(file) {
      var a = document.createElement('a')
      a.setAttribute('href', '/ipdoc' + file.address)
      a.setAttribute('id', 'startTelMedicine')
      a.setAttribute('target', '_blank')
      if(document.getElementById('startTelMedicine')) {
        document.body.removeChild(document.getElementById('startTelMedicine'))
      }
      document.body.appendChild(a)
      a.click()
    },
    onsuccess(res, file, fileList) {
      this.materialIdList.push(res.data[0].materialId)
    },
    getUploadData(caseIds) {
      const data = {
        tokenID: this.$store.getters.token
      }
      return data
    },
    handleRemove(file, fileList, caseId) {
      let delmaterialId;
      if (file.response) {
        delmaterialId = file.response.data[0].materialId;
      } else {
        delmaterialId = file.materialId;
      }
      deleteMaterial({ materialId: delmaterialId}).then(res => {
        this.materialIdList.splice(this.materialIdList.indexOf(delmaterialId),1)
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (!valid) {
          this.$message.error("请填写必填项");
        } else {
          this.loading = true;
          this.postForm.materialIdList=this.materialIdList
          delete this.postForm.materialList
          addConflicterUrl(this.postForm).then(response => {
            this.loading = false;
            if (response.success) {
              this.isCreatTrue = true;
              this.$message({
                type: "success",
                message: "添加成功"
              });
              this.cancel()
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
          this.postForm.materialIdList=this.materialIdList
           delete this.postForm.materialList
          updateCustomerConflicterUrl(this.postForm).then(response => {
            this.loading = false;
            if (response.success) {
              this.isCreatTrue = true;
              this.$message({
                type: "success",
                message: "修改成功"
              });
              this.cancel()
            } else {
              this.$message.error(response.message);
            }
          });
        }
      });
    },

    isItemTrue(item) {
      if (!this.postForm[item]) {
        this.$message.error("请填写必填项");
        return false;
      } else {
        return true;
      }
    },

    // 获取各个select数据
    getAllSelectData() {
      queryCountry().then(response => {
        if (response.success) {
          this.seletData.ctDataOption = response.data;
        } else {
          this.$message.error(response.message);
        }
      });
    }
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
/*.form-border {*/
/*  /deep/ .el-row {*/
/*    margin: 0px;*/
/*  }*/
/*  /deep/ .postInfo-container-item {*/
/*    width: 100%;*/
/*  }*/
/*  /deep/ .el-form-item__label {*/
/*    background-color: #f9f9f9;*/
/*    width: 30%;*/
/*    text-align: center;*/
/*  }*/

/*  /deep/ .el-form-item {*/
/*    border-right: 1px solid #d7d7d7;*/
/*    margin: 0px !important;*/
/*  }*/
/*  /deep/ .el-row {*/
/*    border-bottom: 1px solid #d7d7d7;*/
/*  }*/
/*  /deep/ .el-input,*/
/*  /deep/ .el-select {*/
/*    width: 70%;*/
/*  }*/
/*  /deep/ .el-form-item__content {*/
/*    text-align: center;*/
/*    height: 30px;*/
/*  }*/
/*  .fullRow {*/
/*    /deep/ .el-form-item__label {*/
/*      width: 15%;*/
/*    }*/

/*    /deep/ .el-input,*/
/*    /deep/ .el-select {*/
/*      width: 85%;*/
/*    }*/
/*  }*/
/*  /deep/ .el-input__inner {*/
/*    border: none;*/
/*  }*/
/*  /deep/ .el-select .el-input {*/
/*    width: 100%;*/
/*  }*/
/*  border-top: 1px solid #d7d7d7;*/
/*  border-left: 1px solid #d7d7d7;*/
/*  // border-bottom: 1px solid #d7d7d7;*/
/*}*/

.titleLeft {
  margin-right: 20px;
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
/*.article-textarea /deep/ {*/
/*  /deep/ textarea {*/
/*    padding-right: 40px;*/
/*    resize: none;*/
/*    border: none;*/
/*    border-radius: 0px;*/
/*    border-bottom: 1px solid #bfcbd9;*/
/*  }*/
/*}*/

/*.avatar-uploader {*/
/*  /deep/ .el-form-item__label {*/
/*    height: 154px;*/
/*    line-height: 154px;*/
/*    width: 30%;*/
/*  }*/
/*  height: 154px;*/

/*  /deep/ .el-upload {*/
/*    border: 1px dashed #b6b2b2;*/
/*    border-radius: 6px;*/
/*    cursor: pointer;*/
/*    position: relative;*/
/*    overflow: hidden;*/
/*    margin-top: 4px;*/
/*  }*/
/*}*/
/*.avatar-uploader {*/
/*  /deep/ .el-upload:hover {*/
/*    border-color: #409eff;*/
/*  }*/
/*}*/
/*.avatar-uploader-icon {*/
/*  font-size: 28px;*/
/*  color: #8c939d;*/
/*  width: 145px;*/
/*  height: 145px;*/
/*  line-height: 145px;*/
/*  text-align: center;*/
/*  border: 1px dashed #d9d9d9;*/
/*}*/
/*.avatar {*/
/*  width: 145px;*/
/*  height: 145px;*/
/*  display: block;*/
/*}*/
/*.el-step {*/
/*  cursor: pointer;*/
/*}*/
/*.tilteBtn {*/
/*  text-align: right;*/
/*  padding: 10px 10px;*/
/*  background-color: #d0d0d0;*/
/*}*/
/*/deep/.postInfoleft /deep/.el-form-item__content {*/
/*  text-align: left;*/
/*}*/
.el-form{
  /*display: flex;*/
  /*flex-wrap: wrap;*/
  /*justify-content: center;*/
  /*padding: 20px;*/
  /*margin:0 20px ;*/
    /deep/ .el-input__inner {
    border: none;
  }
  /deep/ .el-select .el-input {
    width: 100%;
  }
  .el-select,.el-input,.el-date-picker,.el-textarea{
    width: 95%;
  }
  .el-textarea{
    margin: 10px 0;
  }
  /deep/ input{
    /*height: 28px;*/
    height:44px;
    line-height:44px
  }
  /deep/ .el-input__icon{
    /*line-height: 28px;*/
    line-height:44px
  }
  .el-row{
    min-height: 30px;
    width: 100%;
    display: flex;
    align-items: center;
    border-bottom: 2px solid #f5f5f5;
    border-right: 2px solid #f5f5f5;
    .el-form-item{
      width: 100%;
      display: flex;
      /*border: 1px solid #EBEEF5;*/
      border-bottom: 0;
      margin-bottom: 0;
      /deep/ .el-form-item__label{
        background: #f9f9f9;
        line-height:44px;

      }
      /deep/ .el-form-item__content{
        margin-left: 0 !important;
        padding-left: 10px;
        background: #fff;
        flex: 1;
       .el-cascader__label{
         line-height:44px;
       }
      }
     /deep/ .el-upload-dragger{
        height:70px
      }

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
}
</style>
