<template>
  <div>
    <!-- 合同续签征询 -->
    <el-form
      size="small"
      ref="examineForm"
      :model="examineForm"
      label-width="135px"
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
        <el-col :span="9" :offset="1">
          <el-form-item
            label="合同到期员工姓名"
            prop="enrollName"
          >
            <el-select
              v-model="examineForm.enrollName"
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="item in talentList"
                :key="item.talentCode"
                :label="item.talentName"
                :value="item.talentName"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="1">
          <el-form-item label="入职时间" prop="startDate">
            <el-date-picker
              v-model="examineForm.startDate"
              clearable
              type="date"
              class="dataTime"
              style="width: 203px;" 
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin-bottom: 10px;">
        <el-col :span="9" :offset="1">
          <el-form-item label="服务年限" prop="contractLimit">
            <el-input-number
              v-model="examineForm.contractLimit"
            ></el-input-number>
            <span>年</span>
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="1">
          <el-form-item label="合同到期时间" prop="endDate">
            <el-date-picker
              v-model="examineForm.endDate"
              clearable
              type="date"
              class="dataTime"
              style="width: 203px;"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin-bottom: 10px;">
        <el-col :span="9" :offset="1">
          <el-form-item label="建议续签年限" prop="renewLimitYear">
            <el-input-number
              v-model="examineForm.renewLimitYear"
              :min="1"
            ></el-input-number>
            <span>年</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin-bottom: 10px;">
        <el-col :span="20" :offset="1">
          <el-form-item label="说明" prop="description">
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
  name: "RenewalAsk",
  props: ["talentList","dataDetail"],
  data() {
    return {
      appUserId: this.$store.getters.userId,
      appDate: "",
      appUser: this.$store.getters.name,
      examineForm: {
        enrollName: "",
        startDate: "",
        contractLimit: 0,
        endDate: "",
        renewLimitYear: 1,
        description: ""
      },
      rules: {
        enrollName: [
          {
            required: true,
            message: "请填写合同到期员工姓名",
            trigger: ["blur", "change"]
          }
        ],
        startDate: [
          {
            required: true,
            message: "请填写入职时间",
            trigger: ["blur", "change"]
          }
        ],
        contractLimit: [
          {
            required: true,
            message: "请填写服务年限",
            trigger: ["blur", "change"]
          }
        ],
        endDate: [
          {
            required: true,
            message: "请填写合同到期时间",
            trigger: ["blur", "change"]
          }
        ],
        renewLimitYear: [
          {
            required: true,
            message: "请填写建议续签年限",
            trigger: ["blur", "change"]
          }
        ],
        description: [
          { required: true, message: "请填写说明", trigger: ["blur", "change"] }
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
        enrollName: item.enrollName,
        startDate: item.startDate,
        contractLimit: item.contractLimit,
        endDate:  item.endDate,
        renewLimitYear: item.renewLimitYear,
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
</style>
