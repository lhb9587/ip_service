<template>
  <div>
    <el-upload
      ref="upload"
      drag
      :limit="1"
      name="uploadFile"
      :action="upsertDepartmentFromExcel"
      :file-list="fileList"
      :on-progress="handleSuccess">
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
    </el-upload>
  </div>
</template>
<script>
import { upsertDepartmentFromExcel } from "@/api/ipServiceApi.config.js";
export default {
  name: 'updateOrganization',
  data() {
    return {
      upsertDepartmentFromExcel,
      fileList: [],
    };
  },
  methods: {
    handleSuccess(response, file, fileList) {
      this.$message({
        showClose: true,
        message: '上传成功，组织架构更新中，请稍后查看',
        type: 'success'
      });
    },

  }
}
</script>
