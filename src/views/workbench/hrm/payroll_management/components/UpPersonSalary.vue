<template>
  <div>
    <div class="block" style="margin-top: -10px;margin-bottom: 10px;">
      <span class="demonstration">选择导入年月</span>
      <el-date-picker
        v-model="years"
        type="month"
        format="yyyy-MM"
        value-format="yyyy-MM"
        :clearable="false"
        placeholder="选择年月">
      </el-date-picker>
    </div>
    <el-upload
      class="upload-demo"
      ref="upload"
      drag
      multiple
      name="uploadFile"
      :action="upPersonSalaryFromExcel"
      :data="{tokenID:$store.getters.token,salaryYear : salaryYear, salaryMonth : salaryMonth}"
      :file-list="fileList"
      :on-success="handleSuccess"
      :before-upload="beforeAvatarUpload">
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
    </el-upload>
  </div>
</template>
<script>
import { upPersonSalaryFromExcel } from "@/api/ipServiceApi.config.js";
export default {
  name: 'UpPersonSalary',
  data() {
    return {
      years: '',
      salaryYear: '',
      salaryMonth: '',
      upPersonSalaryFromExcel,
      fileList: [],
      // 用于跟踪成功和失败的上传数量
      successfulUploads: 0,
      failedUploads: 0,
    };
  },
  created() {
    this.years = this.getLastMonthYearMonth()
    console.log(this.years)
  },
  methods: {
    getLastMonthYearMonth() {
      const today = new Date();
      const lastMonth = new Date(today);
      // 设置日期为上一个月
      lastMonth.setMonth(today.getMonth() - 1);
      // 获取上一个月的年份和月份
      const lastMonthYear = lastMonth.getFullYear();
      const lastMonthMonth = (lastMonth.getMonth() + 1).toString().padStart(2, '0');
      this.salaryYear = lastMonthYear;
      this.salaryMonth = lastMonthMonth;
      return `${lastMonthYear}-${lastMonthMonth}`;
    },
    beforeAvatarUpload(file) {
      if (!this.years) {
        this.$message.info({
          message: '请先选择导入年月！',
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
          message: '每月工资导入中，请稍后查看',
          type: 'success'
        });
        // 触发关闭对话框的事件
        this.$emit('closeDialog');
      }
    },
  },
  watch: {
    years(newYears) {
      // 在years变化时更新提取的值
      const matches = newYears.match(/\d+/g);
      this.salaryYear = matches ? matches[0] : '';
      this.salaryMonth = matches ? matches[1] : '';
    },
  }
}
</script>
