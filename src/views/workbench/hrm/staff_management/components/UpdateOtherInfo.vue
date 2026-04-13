<template>
  <div>
    <el-upload
      class="upload-demo"
      ref="upload"
      drag
      :limit="1"
      name="uploadFile"
      :action="upsertPersonOtherInfoFromZip"
      :file-list="fileList"
      :on-progress="handleSuccess"
      :before-upload="beforeUpload">
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
    </el-upload>
  </div>
</template>
<script>
import { upsertPersonOtherInfoFromZip } from "@/api/ipServiceApi.config.js";
export default {
  name: 'UpdatePersonnel',
  data() {
    return {
      upsertPersonOtherInfoFromZip,
      fileList: [],
    };
  },
  methods: {
    handleSuccess(response, file, fileList) {
      this.$message({
        showClose: true,
        message: '上传成功，人员信息更新中，请稍后查看',
        type: 'success'
      });
    },
    beforeUpload(file) {
      const sizeLimit = file.size / 1024 / 1024 > 10
      if (sizeLimit) {
        this.$message.warning('上传文件大小不能超过 10MB!')
      }
      const fileFamart = file.name.split('.')[file.name.split('.').length - 1];
      if (fileFamart !== 'zip') {
        this.$message.warning('必须上传zip格式的文件!')
      }
      return !sizeLimit && fileFamart === 'zip'
    }
  }
}
</script>
