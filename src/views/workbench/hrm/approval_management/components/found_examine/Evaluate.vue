<template>
  <div>
    <!-- 实习评价 -->
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
          <el-form-item label="工作组" prop="internWkgId" label-width="120px">
            <el-cascader
              ref="groupCascader"
              placeholder="部门工作组"
              :props="defaultParams"
              :options="groupList"
              clearable
              filterable
              change-on-select
              v-model="examineForm.internWkgId"
              style="width: 100%;"
            ></el-cascader>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin-bottom: 10px;">
        <el-col :span="9" :offset="1">
          <el-form-item
            label="实习指导老师"
            prop="internTeacherId"
            label-width="120px"
          >
            <el-select v-model="examineForm.internTeacherId" filterable placeholder="请选择">
              <el-option
                v-for="item in talentList"
                :key="item.talentCode"
                :label="item.talentName"
                :value="item.talentCode"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="实习期" required>
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
      <el-row :gutter="20">
        <el-col :span="9" :offset="1">
          <el-form-item
            label="实际出勤天数"
            prop="internDays"
            label-width="120px"
          >
            <el-input-number
              v-model.number="examineForm.internDays"
              :min="0"
            ></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="11" :offset="1">
          <el-form-item label="上传附件" prop="approveMaterials"
            ><UpLoad
              @addApproveMaterials="addApproveMaterials"
              @deleteApproveMaterials="deleteApproveMaterials"
              tip="（实习期工作总结）"
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
import { queryOrganizations } from "@/api/hrmList.js";
import UpLoad from "./UpLoad.vue";
export default {
  name: "Evaluate",
  props: ["dataDetail","talentList"],
  components: { UpLoad },
  data() {
    return {
      groupList: [],
      appUser: this.$store.getters.name,
      appUserId: this.$store.getters.userId,
      appDate: "",
      examineForm: {
        internWkgId: null,
        internTeacherId: "",
        startDate: null,
        endDate: null,
        internDays: 0
      },
      materialIdList:[],
      defaultParams: {
        value: "deptCode",
        label: "kingDeeGroupName",
        checkStrictly: true,
        children: "children"
      },
      rules: {
        internWkgId: [
          { required: true, message: "请填写工作组" }
        ],
        internTeacherId: [
          { required: true, message: "请填写实习指导老师" }
        ],
        startDate: [
          { required: true, message: "请填写实习期开始时间" }
        ],
        endDate: [
          { required: true, message: "请填写实习期结束时间" }
        ],
        internDays: [
          { required: true, message: "请填写实际出勤天数" }
        ]
      }
    };
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
    // 获取部门列表
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
            materialIdList: this.materialIdList.map(item=>item.materialId),
            approveItems: [],
          };
          let approveItems = JSON.parse(JSON.stringify(this.examineForm))
          approveItems.internWkgId = approveItems.internWkgId[approveItems.internWkgId.length - 1];
          data.approveItems.push(approveItems);
          this.$emit("createApproval",data,type);
        } else {
          this.$message({ message: "请根据提示填写表单", type: "error" });
          
        }
      });
    },
    Cancel() {
      this.$emit("CancelOff");
    },
    findAncestors(nodes, targetId) {  
      console.log(nodes,'nodes');
      console.log(targetId,'targetId');
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
      return arr;  
    },
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
        internWkgId: this.findAncestors(this.groupList, item.internWkgId),
        internTeacherId: item.internTeacherId,
        startDate: item.startDate,
        endDate: item.endDate,
        internDays: item.internDays
      };
    },
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
/deep/ .custom-date-picker {
  .mx-datepicker-range {
    width: 238px;
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
