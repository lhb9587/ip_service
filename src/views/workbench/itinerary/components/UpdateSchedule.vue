<template>
  <div v-loading="loading" element-loading-text="日程导入中，请等候！" element-loading-spinner="el-icon-loading">
    <div style="display: flex; align-items: center;margin-bottom: 10px;gap: 10px;">
      <div>日程时区:</div>
      <el-select v-model="timeZoneId" size="small" filterable clearable @change="changeTimeZone" placeholder="请选择">
        <el-option
          v-for="item in timeZoneList"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </div>
    <el-upload
      class="upload-demo"
      ref="upload"
      drag
      name="attachFile"
      :action="importItineraryData"
      :file-list="fileList"
      :on-progress="handleProgress"
      :data="{tokenID:$store.getters.token,meId : scheduleMeId,timeZoneId,timeZoneName}"
      :on-success="handleSuccess">
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
    </el-upload>
  </div>
</template>
<script>
import { importItineraryData } from "@/api/serviceApi.config.js";
import { queryTimeZone } from "@/api/schedule";
export default {
  name: 'UpdateSchedule',
  props: ["scheduleMeId"],
  data() {
    return {
      importItineraryData,
      loading: false,
      fileList: [],
      meId: 0,
      timeZoneList:[],
      timeZoneId:'',
      timeZoneName:''
    };
  },
  created() {
    this.queryTimeZone()
  },
  methods: {
    changeTimeZone(){
      if(this.timeZoneId) {
        this.timeZoneName = this.timeZoneList.find(item=>item.value == this.timeZoneId).label
      }
    },
    queryTimeZone() {
      queryTimeZone().then(res => {
        this.timeZoneList = res.data
      })
    },
    handleProgress(response, file, fileList) {
      this.loading = true
    },
    handleSuccess(response, file, fileList) {
      if (response.success){
        this.loading = false
        this.$message({
          showClose: true,
          message: '日程导入成功，可关闭上传页',
          type: 'success',
          duration: 0
        });
      }else{
        this.loading = false
        this.$message({
          showClose: true,
          message: response.message,
          type: 'error',
          duration: 0
        });
      }

    }
  }
}
</script>
