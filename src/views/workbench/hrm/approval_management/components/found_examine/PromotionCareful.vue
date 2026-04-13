<template>
  <div>
    <!-- 晋升审批  -->
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
      <el-row :gutter="20" style="margin-bottom: 10px;">
        <el-col :span="20" :offset="1">
          <el-form-item label="晋升说明" prop="description">
            <el-input
              type="textarea"
              v-model="examineForm.description"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="message">
        <div class="blok"></div>
        <span>晋升审批信息</span>
      </div>
      <el-row :gutter="20" style="margin-bottom: 10px;">
        <el-col :span="9" :offset="1">
          <el-form-item label="姓名" :prop="`promoteList[0].talentName`" :rules="rules.talentName">
            <el-select
              v-model="examineForm.promoteList[0].talentName"
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
          <el-form-item
            label="申请晋升岗位"
            label-width="135px"
            :prop="`promoteList[0].promotePos`"
            :rules="rules.promotePos"
          >
            <el-select
              v-model="examineForm.promoteList[0].promotePos"
              filterable
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="opt in positionsList"
                :key="opt.id"
                :label="opt.posName"
                :value="opt.posName"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin-bottom: 10px;">
        <el-col :span="9" :offset="1">
          <el-form-item label="考核期" required>
            <div style="display: flex;">
              <el-form-item :prop="`promoteList[0].startDate`" class="innerItem" :rules="rules.startDate">
                <el-date-picker
                  v-model="examineForm.promoteList[0].startDate"
                  type="date"
                  placeholder="开始日期"
                  style="width: 120px"
                  prefix-icon="dateIconNone"
                  value-format="yyyy-MM-dd"
                />
              </el-form-item>
              <el-col class="line" :span="3">-</el-col>
              <el-form-item :prop="`promoteList[0].endDate`" class="innerItem" :rules="rules.endDate">
                <el-date-picker
                  v-model="examineForm.promoteList[0].endDate"
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
        <el-col :span="10" :offset="1">
          <el-form-item label="司龄" required>
            <div style="display: flex;">
                <el-form-item  prop="workingYears" class="silingInnerItem">
                    <el-input v-model.number="examineForm.workingYears" style="width: 80px"></el-input>
                    <span>年</span>
                </el-form-item>
                <el-form-item  prop="workingMonths" class="silingInnerItem">
                    <el-input v-model.number="examineForm.workingMonths" style="width: 80px"></el-input>
                    <span>月</span>
                </el-form-item>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin-bottom: 10px;">
        <el-col :span="9" :offset="1">
          <el-form-item label="目前薪资" :prop="`promoteList[0].currentSalary`" :rules="rules.currentSalary">
            <el-input
              v-model="examineForm.promoteList[0].currentSalary"
              style="width: 80px"
            ></el-input>
            <span>元/月</span>
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="1">
          <el-form-item label="调整后薪资" :prop="`promoteList[0].changedSalary`" :rules="rules.changedSalary">
            <el-input
              v-model="examineForm.promoteList[0].changedSalary"
              style="width: 80px"
            ></el-input>
            <span>元/月</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin-bottom: 10px;">
        <el-col :span="9" :offset="1">
          <el-form-item label="生效时间" :prop="`promoteList[0].effectiveDate`" :rules="rules.effectiveDate">
            <el-date-picker
              v-model="examineForm.promoteList[0].effectiveDate"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12" :offset="1">
          <el-form-item label="上传附件" prop="approveMaterials">
            <UpLoad
              @addApproveMaterials="addApproveMaterials"
              @deleteApproveMaterials="deleteApproveMaterials"
              tip="（晋升考核评价表及工作总结 .pdf）"
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
import { convertAgeToDecimal } from '@/utils/index.js'
import { queryOrganizations } from "@/api/hrmList.js";
import UpLoad from "./UpLoad.vue";
export default {
  name: "PromotionCareful",
  props: ["talentList", "positionsList","dataDetail"],
  components: { UpLoad },
  data() {
    return {
      appUser: this.$store.getters.name,
      appUserId: this.$store.getters.userId,
      appDate: "",
      materialIdList: [],
      examineForm: {
        description: "",
        workingYears:null,
        workingMonths:null,
        promoteList: [
          {
            talentName: "",
            promotePos: "",
            startDate: null,
            endDate: null,
            currentSalary: "",
            changedSalary: "",
            effectiveDate: "",
          }
        ]
      },
      rules: {
        description: [
          {
            required: true,
            message: "请填写晋升说明",
            trigger: ["blur", "change"]
          }
        ],
        talentName: [
          { required: true, message: "请填写姓名", trigger: ["blur", "change"] }
        ],
        promotePos: [
          {
            required: true,
            message: "请填写申请晋升岗位",
            trigger: ["blur", "change"]
          }
        ],
        startDate: [
          {
            required: true,
            message: "请填写考核开始日期",
            trigger: ["blur", "change"]
          }
        ],
        endDate: [
          {
            required: true,
            message: "请填写考核结束日期",
            trigger: ["blur", "change"]
          }
        ],
        workingYears: [
          { required: true, message: "请填写司龄", trigger: ["blur", "change"] }
        ],
        currentSalary: [
          {
            required: true,
            message: "请填写目前薪资",
            trigger: ["blur", "change"]
          }
        ],
        changedSalary: [
          {
            required: true,
            message: "请填写调整后薪资",
            trigger: ["blur", "change"]
          }
        ],
        effectiveDate: [
          {
            required: true,
            message: "请填写调生效时间",
            trigger: ["blur", "change"]
          }
        ]
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
            materialId: item.materialId,
            uid:response.data[0].materialId,
          };
        });
      }
      const item = newVal.approveItems[0];
      this.examineForm = {
        id: item.id,
        description: newVal.description,
        promoteList: item.promoteList,
        workingYears:  item.workingYears?Math.floor(item.workingYears):'',
        workingMonths: this.countMonth(item.workingYears),
      };
    },
  },
  methods: {
    countMonth(decimalYears){
        // 将年份数乘以12得到月份数
        const totalMonths = Math.round(decimalYears * 12);
        // 使用取模运算得到额外的月份
        const months = totalMonths % 12;
        return months?months:''
    },
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
    //删除approveMaterials id
    deleteApproveMaterials(id) {
      this.materialIdList = this.materialIdList.filter(item => item.materialId != id);
    },
    //添加approveMaterials id
    addApproveMaterials(data) {
      this.materialIdList.push(data);
    },
    queryOrganizations() {
      queryOrganizations({ status: 1 }).then(res => {
        this.groupList = res.data;
      });
    },
    // 提交审批
    onCreactExamine(type) {
      this.$refs.examineForm.validate(valid => {
        if (valid) {
          this.$message({ message: "验证成功", type: "success" });
          const data = {
            appUserId: this.appUserId,
            appDate: this.appDate,
            description: this.examineForm.description,
            materialIdList: this.materialIdList.map(item=>item.materialId),
            approveItems: []
          };
          this.examineForm.workingYears = convertAgeToDecimal(this.examineForm.workingYears, this.examineForm.workingMonths)
          delete this.examineForm.description;
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
    this.queryOrganizations();
  }
};
</script>

<style lang="scss" scoped>
/deep/ .custom-date-picker {
  .mx-datepicker-range {
    width: 240px;
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
  .el-input--prefix .el-input__inner {
    padding: 0 15px;
  }
}
/deep/ .dateIconNone {
  display: none;
}
/deep/ .silingInnerItem {
  margin-bottom: 0;
  margin-right: 6px;
  .el-input--prefix .el-input__inner {
    padding: 0 15px;
  }
}
</style>
