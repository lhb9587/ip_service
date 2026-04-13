<template>
  <div>
    <el-upload
      class="upload-demo"
      ref="upload"
      drag
      :limit="1"
      name="uploadFile"
      :action="upsertTalentPersonFromExcel"
      :file-list="fileList"
      :on-progress="handleSuccess">
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
    </el-upload>
  </div>
</template>
<script>
import { upsertTalentPersonFromExcel } from "@/api/ipServiceApi.config.js";
export default {
  name: 'UpdatePersonnel',
  data() {
    return {
      upsertTalentPersonFromExcel,
      fileList: [],
    };
  },
  methods: {
    handleSuccess(response, file, fileList) {
      this.$message({
        showClose: true,
        message: '上传成功，人员更新中，请稍后查看',
        type: 'success'
      });
    },
  }
}
</script>
