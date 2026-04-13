<template>
  <div>
    <el-form ref="submission" label-width="206px">
      <el-row style="border-right: 1px solid #EBEEF5;border-top: 1px solid #EBEEF5">
        <el-form-item label="文件类型:">
          <el-select default-first-option v-model="submitData.materialTypeId" placeholder="请选择" filterable clearable >
            <el-option v-for="item in materialTypeList" :key="item.materialTypeId" :label="item.typeName" :value="item.materialTypeId">
            </el-option>
          </el-select>
        </el-form-item>
      </el-row>

      <el-row>
        <el-form-item label="上传文件:">
          <el-upload class="upload-demo"
                     :limit="1"
                     drag
                     ref="uploadFile"
                     :data="uploadFileData"
                     :action="talentCreatematerialUrl"
                     name="attachFile"
                     :auto-upload="true"
                     :before-upload="beforeupload"
                     :file-list="flielist"
                     :on-success="handleSuccess"
                     :on-remove="brforeRemoveFile">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
          </el-upload>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="上传人:">
          {{
            submitData.creater
              ? submitData.creater
              : (submitData.creater = $store.getters.name)
          }}
        </el-form-item>
        <el-form-item label="上传日期:">
          {{
            submitData.createDate
              ? submitData.createDate
              : (submitData.createDate = getNowFormatDate())
          }}
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { delectTalentMaterial } from '@/api/hrmList'
import { talentCreatematerialUrl } from "@/api/ipServiceApi.config.js";
import Vue from "vue";
export default {
  props: {
    talentCode: {},
  },
  name: "UploadMetailDetail",
  data() {
    return {
      flielist: [],
      submitData: {},
      materialTypeList: [
        {
          "materialTypeId": 1,
          "typeName": "简历"
        },
        {
          "materialTypeId": 2,
          "typeName": "劳动合同"
        },
        {
          "materialTypeId": 3,
          "typeName": "保密协议"
        },
        {
          "materialTypeId": 4,
          "typeName": "入职登记表"
        },
        {
          "materialTypeId": 5,
          "typeName": "岗位说明书"
        },
        {
          "materialTypeId": 6,
          "typeName": "合规准则签署书"
        },
        {
          "materialTypeId": 7,
          "typeName": "公司制度签收单"
        },
        {
          "materialTypeId": 8,
          "typeName": "其他"
        }
      ],
      talentCreatematerialUrl,
      uploadFileData: {
        talentCode: this.talentCode,
        tokenID: this.$store.getters.token
      }
    };
  },
  created() {
    console.log(this.talentCode)
  },
  methods: {
    handleSuccess() {
      this.$emit('updateInfo', this.talentCode);
      setTimeout(() => {
        this.message('上传附件成功')
      }, 3000);
    },
    // 上传文件之前的钩子，返回return false，停止上传，可进行上传前判断处理
    beforeupload() {
      if (!this.submitData.materialTypeId) {
        this.$message('请选择文件类型')
        return false
      }
      this.uploadFileData.materialType = this.submitData.materialTypeId;
      this.uploadFileData.createUserName = this.submitData.creater;
    },
    // 文件列表移除文件时处理
    brforeRemoveFile(file) {
      if (file && file.status === "success") {
        let delmaterialId;
        if (file.response) {
          delmaterialId = file.response.data[0].materialId;
        } else {
          delmaterialId = file.materialId;
        }
        delectTalentMaterial({
          materialId: delmaterialId
        }).then(res => {
          this.message('删除附件成功')
        });
      }
    },
    message(msg) {
      this.$message({
        message: msg,
        type: 'success'
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.el-form {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 20px;
  margin: 0 20px;
  .el-select,
  .el-input,
  .el-date-picker,
  .el-textarea {
    width: 95%;
  }
  .el-textarea {
    margin: 10px 0;
  }
  /deep/ input {
    height: 28px;
  }
  /deep/ .el-input__icon {
    line-height: 28px;
  }
  .el-row {
    min-height: 30px;
    width: 100%;
    display: flex;
    align-items: center;
    .el-form-item {
      width: 100%;
      display: flex;
      border: 1px solid #ebeef5;
      border-bottom: 0;
      margin-bottom: 0;
      /deep/ .el-form-item__label {
        background: #f5f7fa;
      }
      /deep/ .el-form-item__content {
        margin-left: 0 !important;
        padding-left: 10px;
        background: #fff;
        flex: 1;
      }
    }
    .small-el-form-item-prev:before {
      content: "";
      width: 50%;
      height: 1px;
      background: #ebeef5;
      position: absolute;
      bottom: -1px;
      right: 0;
      z-index: 1;
    }
    .small-el-form-item {
      position: relative;
      width: 50%;
      /deep/ .el-form-item__content {
        flex: 1;
        .pad20 {
          padding-left: 20px;
        }
      }
    }
  }
  .el-row:nth-last-child(1) {
    .el-form-item {
      border: 1px solid #ebeef5;
    }
  }
}
.dialog-footer {
  width: 100%;
  display: flex;
  height: 85px;
  align-items: center;
  justify-content: flex-end;
  .el-button {
    margin-right: 30px;
  }
}
</style>
