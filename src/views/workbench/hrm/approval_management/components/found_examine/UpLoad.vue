<template>
  <div>
    <el-upload
      ref="uploadEntry"
      class="upload-demo"
      :action="fileUrl"
      :on-remove="handleRemove"
      :on-success="successUpload"
      :on-error="errorUpload"
      :data="uploadFileData"
      :before-upload="beforeUpload"
      name="attachFile"
      :file-list="fileList"
      list-type="text"
      :auto-upload="true"
      :show-file-list="true"
    >
      <el-button size="small" type="primary">点击上传</el-button>
      <span style="margin-left: 10px;" slot="tip" class="el-upload__tip"
        >{{ tip }}</span
      >
    </el-upload>
  </div>
</template>

<script>
import { creatematerialUrl } from "@/api/serviceApi.config.js";

export default {
  name: "upload",
  props: {
    tip:{
      type:String,
      default:'只能上传.pdf文件'
    },
    fileList:{
        type:Array,
        default:()=>[]
    }
  },
  data() {
    return {
      fileUrl: creatematerialUrl,
      uploadFileData: {
        tokenID: this.$store.getters.token,
        materialTypeId:301633
      },
    };
  },
  methods: {
    // 上传相关
    // handleChange(file, fileList) {
    //   //   this.fileList = fileList.slice(-3);
    // },
    handleRemove(file) {
        this.$emit("deleteApproveMaterials", file.materialId);
    },
    errorUpload() {
      this.$message({
        message: "上传失败",
        type: "warning"
      });
    },
    successUpload(response,file) {
      if (response.data&&response.data.length) {
        const data = {
          materialId:response.data[0].materialId,
          ...file,
        }
        this.$emit("addApproveMaterials", data);
      }
      this.$message({
        message: "上传成功",
        type: "success"
      });
    },
    beforeUpload(file) {
      var is2M = file.size / 1024 / 1024 < 200;
      if (!is2M) {
        this.$message({
          message: "上传文件大小不能超过 200MB!",
          type: "warning"
        });
        return false;
      }
      // let regex = /(.jpg|.jpeg|.gif|.png|.pdf)$/;
      // let regex = /(.pdf)$/;
      // if (regex.test(file.name.toLowerCase())) {
      //   console.log("校验通过");
      // } else {
      //   this.$message.warning("只能上传.pdf文件");
      //   return false;
      // }
    }
  }
};
</script>

<style lang="scss" scoped>
  /deep/ .upload-demo {
    .el-upload-dragger {
      height: 70px;
      width: 400px;

      .el-icon-upload {
        margin-top: 0 !important;
        margin-bottom: 0 !important;
        height: 30px;
        font-size: 30px;
      }
    }
  }</style>
