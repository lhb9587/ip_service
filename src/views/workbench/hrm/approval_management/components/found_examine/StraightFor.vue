<template>
  <div>
    <!-- 转正申请 -->
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
          <el-form-item label="试用岗位" prop="enrollPosId">
            <el-select
              v-model="talentInfo.posId"
              filterable
              clearable
              placeholder="请选择"
              style="width: 100%;"
              :disabled="true"
            >
              <el-option
                v-for="opt in positionsList"
                :key="opt.id"
                :label="opt.posName"
                :value="opt.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="1">
          <el-form-item label="试用期月薪" prop="probationSalary">
            <el-input-number
              v-model="examineForm.probationSalary"
              :controls="false"
              style="width: 80px"
            ></el-input-number>
            <span>元/月</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin-bottom: 10px;">
        <el-col :span="20" :offset="1">
          <el-form-item label="工作组" prop="enrollWkgId">
            <el-cascader
              placeholder="部门工作组"
              :props="defaultParams"
              :options="groupList"
              clearable
              filterable
              v-model="enrollWkgId"
              style="width: 100%;"
              :disabled="true"
            ></el-cascader>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin-bottom: 10px;">
        <el-col :span="9" :offset="1">
          <el-form-item label="约定试用期" required>
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
        <el-col :span="9" :offset="1">
          <el-form-item
            label="申请转正时间"
            prop="appRegularDate"
            label-width="120px"
          >
            <el-date-picker
              v-model="examineForm.appRegularDate"
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
          <el-form-item label="上传附件" prop="materialIdList"
            ><UpLoad
              @addApproveMaterials="addApproveMaterials"
              @deleteApproveMaterials="deleteApproveMaterials"
              tip="（试用期间考核评价表及自我评价表 .pdf）"
              accept=".pdf"
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
  name: "StraightFor",
  props: ["positionsList", "talentInfo", "groupList", "dataDetail"],
  components: { UpLoad },
  data() {
    return {
      appUser: this.$store.getters.name,
      appUserId: this.$store.getters.userId,
      appDate: "",
      examineForm: {
        probationSalary: "",
        startDate: "",
        endDate: "",
        appRegularDate: ""
      },
      materialIdList: [],
      defaultParams: {
        value: "deptCode",
        label: "kingDeeGroupName",
        checkStrictly: true,
        children: "children"
      },
      rules: {
        probationSalary: [
          { required: true, message: "请填写试用期月薪", }
        ],
        startDate: [
          { required: true, message: "请填写试用期开始时间", }
        ],
        endDate: [
          { required: true, message: "请填写试用期结束时间", }
        ],
        appRegularDate: [
          { required: true, message: "请填写试申请转正时间", }
        ]
      }
    };
  },
  watch: {
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
        probationSalary: item.probationSalary,
        startDate: item.startDate,
        endDate: item.endDate,
        appRegularDate: item.appRegularDate
      };
    },
    // groupList(newVal) {
    //   this.findAncestors(newVal, this.talentInfo.deptCode);
    // }
  },
  computed:{
    enrollWkgId(){
      let list = []
      if (this.groupList.length&&this.talentInfo.deptCode) {
        list = this.findAncestors(this.groupList, this.talentInfo.deptCode);
      }
      return list
    }
  },
  methods: {
    // 格式化工作组字段
    findAncestors(nodes, targetId) {
      let arr = [];
      nodes.forEach(firItem => {
        if (firItem.deptCode == targetId) {
          arr = [targetId];
        } else {
          if (firItem.children && firItem.children.length) {
            firItem.children.forEach(secItem => {
              if (secItem.deptCode == targetId) {
                arr = [firItem.deptCode, targetId];
              } else {
                if (secItem.children && secItem.children.length) {
                  secItem.children.forEach(thiItem => {
                    if (thiItem.deptCode == targetId) {
                      arr = [firItem.deptCode, secItem.deptCode, targetId];
                    }
                  });
                }
              }
            });
          }
        }
      });
      // this.enrollWkgId = arr;
      return arr;
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
          data.approveItems.push({
            ...this.examineForm,
            enrollWkgId: this.talentInfo.deptCode,
            enrollPosId: this.talentInfo.posId
          });
          this.$emit("createApproval",data,type);
        } else {
          this.$message({ message: "请根据提示填写表单", type: "error" });
          
        }
      });
    },
    Cancel() {
      this.$emit("CancelOff");
    },
    //删除approveMaterials 
    deleteApproveMaterials(id) {
      this.materialIdList = this.materialIdList.filter(item => item.materialId != id);
    },
    //添加approveMaterials
    addApproveMaterials(data) {
      this.materialIdList.push(data);
    },
  },
  created() {
    this.getNowFormatDate();
  }
};
</script>

<style lang="scss" scoped>
/deep/ .custom-date-picker {
  .mx-datepicker-range {
    width: 230px;
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
</style>
