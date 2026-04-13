<template>
  <div>
    <!-- 宿舍住宿申请  -->
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
          <el-form-item label="申请原因" prop="reason">
            <el-input type="textarea" v-model="examineForm.reason"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin-bottom: 10px;">
        <el-col :span="9">
          <el-form-item label="住宿起止日期:" prop="startDate" label-width="135px">
            <div style="display: flex;">
              <el-form-item prop="startDate" class="innerItem">
                <el-date-picker
                  v-model="examineForm.startDate"
                  type="date"
                  placeholder="开始日期"
                  style="width: 120px"
                  prefix-icon="dateIconNone"
                  value-format="yyyy-MM-dd"
                />
              </el-form-item>
              <el-col class="line" :span="4">-</el-col>
              <el-form-item prop="endDate" class="innerItem">
                <el-date-picker
                  v-model="examineForm.endDate"
                  type="date"
                  placeholder="结束日期"
                  style="width: 120px"
                  prefix-icon="dateIconNone"
                  value-format="yyyy-MM-dd"
                />
              </el-form-item>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin-bottom: 10px;">
        <el-col :span="20" :offset="1">
          <el-form-item>
            <span>
              说明：
              行政部接到申请后，根据宿舍空余情况安排房间及床位，并反馈住宿安排计划。如出现无法安排住
              宿情形，行政部与人力资源部按照住宿员工部门比例或住宿原因协调解决；经协调确实无法解决，则与需
              求部门负责人协商员工到京行程或更改住宿方式。
            </span>
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
  name: "StayApply",
  props: ['dataDetail'],
  data() {
    return {
      appUser: this.$store.getters.name,
      appUserId: this.$store.getters.userId,
      appDate: "",
      examineForm: {
        reason: "",
        startDate: "",
        endDate: ""
      },
      rules: {
        reason: [
          {
            required: true,
            message: "请输入申请原因",
            trigger: ["blur", "change"]
          }
        ],
        startDate: [
          {
            required: true,
            message: "请选择住宿开始日期",
            trigger: ["blur", "change"]
          }
        ],
        endDate: [
          {
            required: true,
            message: "请选择住宿结束日期",
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
        startDate: item.startDate,
        endDate: item.endDate,
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
            appDate: this.appDate,
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
/deep/ .innerItem {
  margin-bottom: 0;
  .el-input--prefix .el-input__inner {
    padding: 0 15px;
  }
}
/deep/ .dateIconNone {
  display: none;
}
</style>
