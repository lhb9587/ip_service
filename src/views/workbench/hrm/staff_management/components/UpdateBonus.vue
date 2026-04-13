<template>
  <div>
    <el-upload
      class="upload-demo"
      ref="upload"
      drag
      :limit="1"
      name="uploadFile"
      :action="upsertPersonBonusFromExcel"
      :file-list="fileList"
      :on-progress="handleSuccess">
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
    </el-upload>
  </div>
</template>
<script>
import { upsertPersonBonusFromExcel } from "@/api/ipServiceApi.config.js";
export default {
  name: 'UpdatePersonnel',
  data() {
    return {
      upsertPersonBonusFromExcel,
      fileList: [],
    };
  },
  methods: {
    handleSuccess(response, file, fileList) {
      this.$message({
        showClose: true,
        message: '上传成功，员工薪资调整更新中，请稍后查看',
        type: 'success'
      });
    },
  }
}
</script>
