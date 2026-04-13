<template>
  <div>
    <div class="block" style="margin-top: -10px;margin-bottom: 10px;">
      <span class="demonstration">选择导入年</span>
      <el-date-picker
        v-model="bonusYear"
        type="year"
        format="yyyy"
        value-format="yyyy"
        placeholder="选择年">
      </el-date-picker>
    </div>
    <el-upload
      class="upload-demo"
      ref="upload"
      drag
      multiple
      name="uploadFile"
      :action="upsertYearBonusFromExcel"
      :data="{tokenID:$store.getters.token,bonusYear : bonusYear}"
      :file-list="fileList"
      :on-success="handleSuccess"
      :before-upload="beforeAvatarUpload">
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
    </el-upload>
  </div>
</template>
<script>
import { upsertYearBonusFromExcel } from "@/api/ipServiceApi.config.js";
export default {
  name: 'YearEndBonus',
  data() {
    return {
      bonusYear: new Date().getFullYear().toString(),
      upsertYearBonusFromExcel,
      fileList: [],
      // 用于跟踪成功和失败的上传数量
      successfulUploads: 0,
      failedUploads: 0,
    };
  },
  created() {
  },
  methods: {
    beforeAvatarUpload(file) {
      if (!this.bonusYear) {
        this.$message.info({
          message: '请先选择导入年！',
          duration: 6000
        });
        return false;
      }
    },
    handleSuccess(response, file, fileList) {
      if (response) {
        // 根据响应中的 success 字段判断上传是否成功
        if (response.success) {
          this.successfulUploads++;
          if(response.messageType === 100){
            this.$message({
            showClose: true,
            duration: 0,
            message: file.name + '提示：' + response.message,
            type: 'warning'
          });
          }
        } else {
          this.failedUploads++;
          this.$message({
            showClose: true,
            duration: 0,
            message: file.name + '提示：' + response.message,
            type: 'error'
          });
        }
        // 检查是否所有文件都已上传完成
        if (fileList.length === this.successfulUploads + this.failedUploads) {
          // 所有文件都已上传完成，可以触发关闭对话框的事件
          this.handleUploadCompletion();
        }
      }
    },
    handleUploadCompletion() {
      if (this.successfulUploads > 0) {
        this.$message({
          showClose: true,
          message: '年终奖导入中，请稍后查看',
          type: 'success'
        });
        // 触发关闭对话框的事件
        this.$emit('closeDialog');
      }
    },
  }
}
</script>
