<template>
  <div class="createPost-container">

    <el-form ref="postForm" :model="postForm" :rules="rules" size="mini"  class="form-container"  label-width="206px">
      <el-row class="fullRow">
        <el-col class="tilteSpan" :span="24">
          <span id='jbxx-title'>基本信息</span>
        </el-col>
      </el-row>
      <el-row class="fullRow">
        <el-form-item label="编码:" class="" style="line-height: 44px; height: 44px" >
          {{postForm.conId}}
        </el-form-item>
        <el-form-item label="相对客户:" class="">
          <el-select
            disabled
            class="slect-op"
            v-model="postForm.custIdArray"
            multiple
            filterable
            remote
            clearable
            placeholder="请输入客户名"
          >
            <el-option v-for="(item,index) in custList" :key="index" :label="item.fullname" :value="item.custId">
              <span>{{item.name}}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-row>
      <el-row class="fullRow">
        <el-form-item label="中文名称/全称:" prop="fullname" class="small-el-form-item">
          {{postForm.fullname}}
        </el-form-item>
      </el-row>

      <el-row class="fullRow">
        <el-form-item label="简称:" prop="shortname" class="postInfo-container-item">
          {{postForm.shortname}}
        </el-form-item>

        <el-form-item label="外文简称:" class="postInfo-container-item">
          {{postForm.fgFullname}}
        </el-form-item>

      </el-row>

      <el-row class="fullRow">
        <el-form-item label="国家/省份/城市:" prop="ctData" class="small-el-form-item">
         {{postForm.ctData.filter(item=>!!item).join('/')}}
        </el-form-item>
      </el-row>
      <el-row class="fullRow">
        <el-form-item label="中文地址:" class="small-el-form-item">
            {{postForm.address}}
        </el-form-item>
      </el-row>
      <el-row class="fullRow">

        <el-form-item label="英文地址:" class="small-el-form-item">
            {{postForm.addressEn}}
        </el-form-item>
      </el-row>
      <el-row class="fullRow">

        <el-form-item label="主页:" class="postInfo-container-item">
            {{postForm.info}}
        </el-form-item>

        <el-form-item label="传真:" class="postInfo-container-item">
            {{postForm.fax}}
        </el-form-item>

      </el-row>
      <el-row class="fullRow">
        <el-form-item label="电话:" class="postInfo-container-item">
            {{postForm.phone}}
        </el-form-item>

        <el-form-item label="电子邮件:" class="postInfo-container-item">
            {{postForm.email}}
        </el-form-item>

      </el-row>
      <el-row class="fullRow">
        <el-form-item label="上传文件:">
          <p v-for="item in materialArray">
            <span  class="itemTitle_style" @click="preView(`${item.address}`) ">{{item.name}}</span>
          </p>
        </el-form-item>
      </el-row>
      <el-row class="fullRow">
        <el-form-item label="备注:" class="postInfo-container-item uploader-custfile">
            {{postForm.memo}}
        </el-form-item>
      </el-row>
      <el-row class="fullRow">
        <el-form-item label="建档日期:" class="postInfo-container-item">
            {{postForm.createDate}}
        </el-form-item>
        <el-form-item label="建档人:" class="postInfo-container-item">
            {{postForm.createName}}
        </el-form-item>
      </el-row>

    </el-form>
    <el-row v-if="!isCustomer">
      <el-col style="text-align:center">
        <el-button type="primary" @click="$router.go(-1);" size="medium">取消</el-button>
      </el-col>
    </el-row>
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
import getTwoDimensionalArray from "@/utils/index"
import { creatematerial } from '@/api/ipServiceApi.config.js'
import {delCaseMaterial } from '@/api/caseList.js'
import { mapGetters } from "vuex";
import { truncate, truncateSync } from "fs";
import Vue from "vue";
import { getProgID } from '@/utils/editInOffice'
import { queryCustomerNameId } from '../../../../../api/customerList'
export default {
  name: "ConflictView",
  computed: {
    ...mapGetters(["token", "name"])
  },
  components: {},
  props: {
    conflictId: {},
    isCustomer: {
      type: Boolean,
      default: false
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      postForm: {
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

      seletData: {
        ctDataOption: []
      },
      custList: []
    };
  },
  created() {
    this.getAllSelectData();
      const id = this.$route.params && this.$route.params.id || this.conflictId;
    this.fetchData(id);
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
    preView(url){
     if(['pdf','jpg','png'].some(item=>url.replace(/.+\./,"").toLocaleLowerCase()==item)){
        window.open(`/ipdoc${url}`.replace(/[+]/g,'%2B'))
      } else {
        this.$commonUtils.downLoadAll({url:`ipdoc${url}`})
      }
    },
    fetchData(id) {
      queryCustomerConflicterUrl({ conId: id })
        .then(response => {
          this.postForm = response.data;
          this.materialArray = this.postForm.materialList
          this.materialIdList= this.materialArray.map(item=>item.materialId)
          if (!this.postForm.custIdArray) {
            this.$set(this.postForm, 'custIdArray', [])
          } else {
            queryCustomerNameId({pageNo: 1, pageSize: 100,custIdArray: this.postForm.custIdArray}).then(res=> {
              this.custList = res.data
            })
          }
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

    // 获取各个select数据
    getAllSelectData() {
      queryCountry().then(response => {
        this.seletData.ctDataOption = response.data;
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
.el-form{
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
    border-bottom: 1px solid #EBEEF5;
    border-right: 1px solid #EBEEF5;
    .el-form-item{
      width: 100%;
      display: flex;
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
<style>

.itemTitle_style, .fullRow .el-form-item__content{
  height: 44px;
  line-height: 44px;
}
</style>
