<template>
  <div>
    <!-- 晋升申请  -->
    <el-form
      size="small"
      ref="examineForm"
      :model="examineForm"
      label-width="100px"
      :rules="rules"
    >
      <el-row :gutter="20" style="margin-bottom: 10px;">
        <el-col :span="20" :offset="1">
          <el-form-item label="主题" prop="theme">
            申请进入晋升考核期
          </el-form-item>
        </el-col>
      </el-row>
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
          <el-form-item label="入职时间" prop="startDate">
            <el-input
              v-model="talentInfo.startWorkDate"
              :disabled="true"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="1">
          <el-form-item label="司龄" prop="workYears">
            <el-input
              v-model="companyAgeFormatted"
              :disabled="true"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin-bottom: 10px;">
        <el-col :span="5" :offset="1">
          <el-form-item label="性别" prop="gender">
            <el-input
              v-model="talentInfo.gender"
              style="width: 60px"
              :disabled="true"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5" :offset="1">
          <el-form-item label="年龄" prop="age">
            <el-input v-model="talentInfo.age" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="1">
          <el-form-item label="现岗位" prop="enrollPosId">
            <el-select
              v-model="talentInfo.posId"
              filterable
              clearable
              placeholder="请选择"
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
        <el-col :span="10">
          <el-form-item
            label="申请晋升岗位"
            prop="promotePosId"
            label-width="135px"
          >
            <el-select
              v-model="examineForm.promotePosId"
              filterable
              clearable
              placeholder="请选择"
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
          <el-form-item label="上传附件" prop="approveMaterials"
            ><UpLoad
              @addApproveMaterials="addApproveMaterials"
              @deleteApproveMaterials="deleteApproveMaterials"
              tip="（工作总结）"
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
import { convertDecimalToYearsMonths } from '@/utils/index.js';
import UpLoad from "./UpLoad.vue";
import { queryOrganizations } from '@/api/hrmList.js'
export default {
  name: "PromotionApply",
  components: { UpLoad },
  props: ["talentInfo", "positionsList","dataDetail"],
  data() {
    return {
      appUser: this.$store.getters.name,
      appUserId: this.$store.getters.userId,
      appDate: "",
      materialIdList:[],
      enrollWkgId: [],
      examineForm: {
        enrollPosId: "",
        promotePosId: ""
      },
      groupList: [],
      defaultParams: {
        value: "deptCode",
        label: "kingDeeGroupName",
        checkStrictly: true,
        children: "children"
      },
      rules: {
        promotePosId: [
          {
            required: true,
            message: "请填写申请晋升岗位",
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
            url: item.materialPath,
            materialId: item.materialId
          };
        });
      }
      const item = newVal.approveItems[0];
      this.examineForm = {
        id: item.id,
        promotePosId: item.promotePosId,
        enrollPosId: item.enrollPosId,
      };
    },
    groupList(newVal){
        this.findAncestors(newVal, this.talentInfo.deptCode)
    }
  },
  computed: {  
    // 计算属性，将月份转换为“年 月”格式  
    companyAgeFormatted() {  
      return this.convertDecimalToYearsMonths(this.talentInfo.companyAge);  
    },  
  },
  methods: {
    convertDecimalToYearsMonths,
    findAncestors(nodes, targetId) {  
      let arr = []
      nodes.forEach((firItem)=>{
        if (firItem.deptCode == targetId) {
          arr = [ targetId ]
        }else{
          if (firItem.children&&firItem.children.length) {
            firItem.children.forEach(secItem => {
              if (secItem.deptCode==targetId) {
                arr =  [ firItem.deptCode, targetId]
              }else{
                if (secItem.children&&secItem.children.length) {
                  secItem.children.forEach(thiItem => {
                    if (thiItem.deptCode == targetId) {
                      arr = [ firItem.deptCode, secItem.deptCode, targetId]
                    }
                  });
                }
              }
            });
          }
        }
      })
      return this.enrollWkgId = arr;  
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
    // 获取部门列表
    queryOrganizations() {
      queryOrganizations({ status: 1 }).then(res => {
        this.groupList = res.data;
      });
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
          this.examineForm.enrollPosId = this.talentInfo.posId;
          this.examineForm.enrollWkgId = this.talentInfo.deptCode;
          this.examineForm.startDate = this.talentInfo.startWorkDate;
          this.examineForm.workingYears = this.talentInfo.companyAge;
          this.examineForm.enrollGender = this.talentInfo.gender;
          this.examineForm.age = this.talentInfo.age;
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
