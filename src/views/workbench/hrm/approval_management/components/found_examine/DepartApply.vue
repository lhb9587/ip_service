<template>
  <div>
    <!-- 离职申请  -->
    <el-form
      size="small"
      ref="examineForm"
      :model="examineForm"
      label-width="100px"
      :rules="rules"
    >
      <el-row :gutter="20" style="margin-bottom: 10px;">
        <el-col :span="9" :offset="1">
          <el-form-item label="申请人" prop="appUser">
            <el-input v-model="appUser" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="1">
          <el-form-item label="申请日期" prop="appDate">
            <el-input v-model="appDate" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="message">
        <div class="blok"></div>
        <span>申请信息</span>
      </div>
      <el-row :gutter="20" style="margin-bottom: 10px;">
        <el-col :span="20" :offset="1">
          <el-form-item label="离职原因" prop="reason">
            <el-input type="textarea" v-model="examineForm.reason"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin-bottom: 10px;">
        <el-col :span="9">
          <el-form-item label="计划离职日期" prop="leaveDate" label-width="135px">
            <el-date-picker
              v-model="examineForm.leaveDate"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin-bottom: 10px;">
        <el-col :span="20" :offset="1">
          <el-form-item label="特殊说明" prop="description">
            <el-input
              type="textarea"
              v-model="examineForm.description"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin-bottom: 10px;">
        <el-col
          :span="20"
          :offset="1"
          style="text-align: right; margin-top: 60px;"
        >
        <el-button @click="Cancel">取消</el-button>
        <el-button type="primary" @click="onCreactExamine(0)">保存</el-button>
        <el-button type="primary" v-if="!dataDetail.submit" @click="onCreactExamine(1)">提交</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "DepartApply",
  props: ["dataDetail"],
  data() {
    return {
      appUser: this.$store.getters.name,
      appUserId: this.$store.getters.userId,
      appDate: "",
      examineForm: {
        reason: "",
        leaveDate: "",
        description: ""
      },
      rules: {
        reason: [
          {
            required: true,
            message: "请填写离职原因",
            trigger: ["blur", "change"]
          }
        ],
        leaveDate: [
          {
            required: true,
            message: "请填写计划离职日期",
            trigger: ["blur", "change"]
          }
        ],
        description: [
          {
            required: true,
            message: "请填写特殊说明",
            trigger: ["blur", "change"]
          }
        ]
      }
    };
  },
  watch: {
    deep: true,
    dataDetail(newVal) {
      const item = newVal.approveItems[0];
      this.examineForm = {
        id: item.id,
        reason: item.reason,
        leaveDate: item.leaveDate,
        description: item.description,
      };
    },
  },
  methods: {
    //获取当前日期函数
    getNowFormatDate() {
      let date = new Date(),
        year = date.getFullYear(),
        month = date.getMonth() + 1,
        strDate = date.getDate();
      if (month < 10) month = `0${month}`;
      if (strDate < 10) strDate = `0${strDate}`;
      this.appDate = `${year}-${month}-${strDate}`;
      return `${year}-${month}-${strDate}`;
    },
    // 提交审批
    onCreactExamine(type) {
      this.$refs.examineForm.validate(valid => {
        if (valid) {
          this.$message({ message: "验证成功", type: "success" });
          const data = {
            appUserId: this.appUserId,
            approveItems: []
          };
          data.approveItems.push(this.examineForm);
          this.$emit("createApproval",data,type);
        } else {
          this.$message({ message: "请根据提示填写表单", type: "error" });
        }
      });
    },
    Cancel() {
      this.$emit("CancelOff");
    }
  },
  created() {
    this.getNowFormatDate();
  }
};
</script>

<style lang="scss" scoped>
.message {
  height: 30px;
  line-height: 30px;
  position: relative;
  margin-bottom: 20px;
  .blok {
    height: 20px;
    width: 6px;
    background-color: blue;
    border-radius: 6px;
    float: left;
    margin: 5px 14px 0 0;
  }
  span {
    font-size: 18px;
    color: #313131;
  }
}
</style>
