<template>
  <div>
    <!-- 劳务用工工资审批 -->
    <!-- 实习生工资审批 -->
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
        <el-col :span="9" :offset="1">
          <el-form-item label="发薪周期" prop="contractLimit">
            <el-date-picker
              v-model="examineForm.contractLimit"
              type="month"
              placeholder="选择月"
              style="width: 202px;"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="1">
          <el-form-item label="发薪人数" prop="recruitNum">
            <el-input-number
              v-model.number="examineForm.recruitNum"
              :min="1"
            ></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin-bottom: 10px;">
        <el-col :span="9" :offset="1">
          <el-form-item label="发薪总额" prop="salary">
            <el-input v-model.number="examineForm.salary"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="9" :offset="1">
          <el-form-item label="上传附件" prop="approveMaterials"
            ><UpLoad
              @addApproveMaterials="addApproveMaterials"
              @deleteApproveMaterials="deleteApproveMaterials"
              :tip="appTypeId==17?'（实习生工资表）':'（劳务人员工资表）'"
              :file-list="materialIdList"
          /></el-form-item>
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
import UpLoad from "./UpLoad.vue";
export default {
  name: "FormalWages",
  props: ["appTypeId","dataDetail"],
  components: { UpLoad },
  data() {
    return {
      appUser: this.$store.getters.name,
      appUserId: this.$store.getters.userId,
      appDate: "",
      materialIdList:[],
      examineForm: {
        contractLimit: "",
        recruitNum: 1,
        salary: ""
      },
      rules: {
        contractLimit: [
          {
            required: true,
            message: "请填写发薪周期",
            trigger: ["blur", "change"]
          }
        ],
        recruitNum: [
          {
            required: true,
            message: "请填写发薪人数",
            trigger: ["blur", "change"]
          }
        ],
        salary: [
          {
            required: true,
            message: "请填写发薪总额",
          },
          { type: "number", message: "发薪总额必须为数字值" }
        ],
      }
    };
  },
  watch: {
    deep: true,
    dataDetail(newVal) {
      if (newVal.approveMaterials&&newVal.approveMaterials.length) {
        this.materialIdList = newVal.approveMaterials.map(item => {
          return {
            name: item.materialName,
            url: item.materialPath,
            materialId: item.materialId
          };
        });
      }
      const item = newVal.approveItems[0];
      this.examineForm = {
        id: item.id,
        contractLimit: item.contractLimit,
        recruitNum: item.recruitNum,
        salary:  Number(item.salary),
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
    //删除approveMaterials 
    deleteApproveMaterials(id) {
      this.materialIdList = this.materialIdList.filter(item => item.materialId != id);
    },
    //添加approveMaterials
    addApproveMaterials(data) {
      this.materialIdList.push(data);
    },
    // 提交审批
    onCreactExamine(type) {
      this.$refs.examineForm.validate(valid => {
        if (valid) {
          this.$message({ message: "验证成功", type: "success" });
          const data = {
            appUserId: this.appUserId,
            appDate: this.appDate,
            materialIdList: this.materialIdList.map(item=>item.materialId),
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
