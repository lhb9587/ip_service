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
        <span>合同续签信息</span>
      </div>
      <el-row :gutter="20" style="margin-bottom: 10px;">
        <el-col :span="9" :offset="1">
          <el-form-item label="合同续签员工姓名" prop="enrollName">
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
        <el-col :span="10">
          <el-form-item label="服务期" required label-width="110px">
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
              <el-col class="line" :span="3">-</el-col>
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
        <el-col :span="9" :offset="1">
          <el-form-item label="续签答复日期" prop="renewReplyDate">
            <el-date-picker
              v-model="examineForm.renewReplyDate"
              type="date"
              placeholder="选择日期"
              style="width: 184px;"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="1">
          <el-form-item label="续签提交日期" prop="renewSubmitDate">
            <el-date-picker
              v-model="examineForm.renewSubmitDate"
              type="date"
              placeholder="选择日期"
              style="width: 205px;"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin-bottom: 10px;">
        <el-col :span="9" :offset="1">
          <el-form-item label="合同最长期限" prop="renewLimitYear">
            <el-input-number
              v-model="examineForm.renewLimitYear"
              :min="1"
            ></el-input-number>
            <span>年</span>
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
  name: "Renewalnotice",
  props: ["talentList","dataDetail"],
  data() {
    return {
      appUserId: this.$store.getters.userId,
      appDate: "",
      appUser: this.$store.getters.name,
      examineForm: {
        enrollName: "",
        startDate: null,
        endDate: null,
        renewReplyDate: "",
        renewSubmitDate: "",
        renewLimitYear: 1
      },
      rules: {
        enrollName: [
          { required: true, message: "请填写合同续签员工姓名", trigger: ["blur","change"] }
        ],
        renewReplyDate: [
          { required: true, message: "请填写答复期限", trigger: ["blur","change"] }
        ],
        renewSubmitDate: [
          { required: true, message: "请填写提交签收表期限", trigger: ["blur","change"] }
        ],
        renewLimitYear: [
          { required: true, message: "请填写合同最长期限", trigger: ["blur","change"] }
        ],
        startDate: [
          { required: true, message: "请填写服务开始日期", trigger: ["blur","change"] }
        ],
        endDate: [
          { required: true, message: "请填写服务结束日期", trigger: ["blur","change"] }
        ]
      },
      // 审批人
      examinePerson: {
        examinePerson: [],
        examinePersonId: []
      },
      // 抄送人
      copyPerson: {
        copyPerson: [],
        copyPersonId: []
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
        endDate:  item.endDate,
        renewReplyDate: item.renewReplyDate,
        renewSubmitDate: item.renewSubmitDate,
        renewLimitYear: item.renewLimitYear,
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
/deep/ .custom-date-picker {
  .mx-datepicker-range {
    width: 220px;
  }
}

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
  .el-input--prefix .el-input__inner{
    padding: 0 15px
  }
}
/deep/ .dateIconNone {
  display: none;
}
</style>
