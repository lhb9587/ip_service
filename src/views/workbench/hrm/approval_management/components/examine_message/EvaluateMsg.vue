<template>
  <div class="examine-message">
    <el-row :gutter="20">
      <el-col :span="12">
        <div>
          <p>实习工作组</p>
          {{ approveDetail.internWkgIdStr }}
        </div>
      </el-col>
      <el-col :span="11" :offset="1">
        <div>
          <p>实习指导老师</p>
          {{ approveDetail.internTeacherIdStr }}
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="12">
        <div>
          <p>实习期</p>
          <span v-if="approveDetail.startDate && approveDetail.endDate">{{
            approveDetail.startDate + "-" + approveDetail.endDate
          }}</span>
        </div>
      </el-col>
      <el-col :span="11" :offset="1">
        <div>
          <p>实际出勤天数</p>
          {{ approveDetail.internDays }}
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="16">
        <div style="display: flex;">
          <p>附件</p>
          <div>
            <div
              class="fontColor"
              v-for="(item, index) in approveMaterials"
              :key="index"
            >
              <span @click="preView(item.materialPath)">{{
                item.materialName
              }}</span>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { preView } from "@/utils/index";
export default {
  name: "EvaluateMsg",
  props: ["approveDetail", "approveMaterials"],
  methods: {
    preView,
  }
};
</script>

<style lang="scss" scoped>
.examine-message {
  margin-top: 24px;
  div {
    margin-bottom: 14px;
    p {
      float: left;
      width: 100px;
      text-align: right;
      margin-right: 16px;
      color: #c3c3c3;
      clear: both;
    }
  }
}
.fontColor {
  color: #409eff;
  cursor: pointer;
}
</style>
