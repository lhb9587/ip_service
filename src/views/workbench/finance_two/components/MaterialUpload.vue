<template>
  <div>
    <el-upload
      class="upload-demo"
      name="attachFile"
      :data="formData"
      :action="creatematerial"
      multiple
      :show-file-list="false"
      :on-success="(value)=> handleSuccess(value)">
      <el-button size="small" type="primary">上传附件</el-button>
    </el-upload>
  </div>
</template>

<script>
import { creatematerial } from "@/api/ipServiceApi.config.js";
export default {
  name: 'MaterialUpload',
  props: ['objType', 'subject', 'objInstId'],
  data() {
    return {
      creatematerial,
      formData: {
        tokenID: this.$store.getters.token,
        objType: this.objType,
        subject: this.subject,
        objInstId: this.objInstId,
        doctId: 13,
      }
    }
  },
  created() {
    console.log(this.objInstId)
  },
  methods: {
    handleSuccess(file) {
      this.$message.success('上传成功')
      this.$emit('file-list', file.data[0])
    }
  }
}
</script>

<style scoped>

</style>
