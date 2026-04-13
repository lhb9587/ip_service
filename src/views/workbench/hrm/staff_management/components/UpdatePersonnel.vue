<template>
  <div v-loading="loading" element-loading-text="金蝶数据合并中，请等候！" element-loading-spinner="el-icon-loading">
    <el-upload
      class="upload-demo"
      ref="upload"
      drag
      name="uploadFile"
      :action="upsertPersonBasicInfoFromExcel"
      :file-list="fileList"
      :on-progress="handleProgress"
      :on-success="handleSuccess">
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
    </el-upload>
  </div>
</template>
<script>
import { upsertPersonBasicInfoFromExcel } from "@/api/ipServiceApi.config.js";
export default {
  name: 'UpdatePersonnel',
  data() {
    return {
      upsertPersonBasicInfoFromExcel,
      loading: false,
      fileList: [],
    };
  },
  methods: {
    handleProgress(response, file, fileList) {
      this.loading = true
    },
    handleSuccess(response, file, fileList) {
      if (response.success){
        this.loading = false
        this.$message({
          showClose: true,
          message: '金蝶数据合并成功，可关闭上传页',
          type: 'success'
        });
      }else{
        this.loading = false
        this.$message({
          showClose: true,
          message: response.message,
          type: 'error'
        });
      }

    }
  }
}
</script>
