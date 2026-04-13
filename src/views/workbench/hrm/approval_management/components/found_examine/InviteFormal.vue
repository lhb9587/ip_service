<template>
  <div>
    <!-- 招聘申请（正式岗位） -->
    <!-- 招聘申请（实习生岗位） -->
    <el-form
      size="small"
      ref="examineForm"
      :model="formData"
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
            <el-input v-model="formData.appDate" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <div v-for="(item, index) in formData.approveItems">
        <div class="message">
          <div class="blok"></div>
          <span
            >申请信息<span v-if="appTypeId == 1">-{{ index + 1 }}</span>
            <el-tooltip
              class="item"
              effect="dark"
              content="新增"
              placement="top"
            >
              <i
                v-if="
                  appTypeId == 1 && formData.approveItems.length == index + 1
                "
                class="el-icon-circle-plus"
                style="color: #409eff;cursor:pointer"
                @click="addApproveItem(index)"
              ></i>
            </el-tooltip>

            <el-tooltip
              class="item"
              effect="dark"
              content="删除"
              placement="top"
            >
              <i
                v-if="appTypeId == 1 && index > 0"
                class="el-icon-remove"
                style="color: #f56c6c;cursor:pointer"
                @click="delApproveItem(index)"
              ></i>
            </el-tooltip>
          </span>
        </div>
        <el-row v-if="appTypeId == 1" :gutter="20" style="margin-bottom: 10px;">
          <el-col :span="9" :offset="1">
            <el-form-item
              label="招聘类型"
              :prop="`approveItems[${index}].recruitType`"
              :rules="rules.recruitType"
            >
              <el-select
                v-model="item.recruitType"
                filterable
                clearable
                :style="{ width: '100%' }"
                :class="[index == 0 ? 'el-form-item-required' : '']"
                placeholder="请选择招聘类型"
              >
                <el-option label="离职补员" value="离职补员"></el-option>
                <el-option label="新增编制" value="新增编制"></el-option>
                <el-option label="新设岗位" value="新设岗位"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="1">
            <el-form-item
              label="招聘岗位"
              :prop="`approveItems[${index}].recruitPosId`"
              :rules="rules.recruitPosId"
            >
              <el-select
                v-model="item.recruitPosId"
                filterable
                clearable
                placeholder="请选择"
                style="width: 100%;"
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
          <el-col :span="10" :offset="1">
            <el-form-item
              label="招聘数量"
              :prop="`approveItems[${index}].recruitNum`"
              :rules="rules.recruitNum"
            >
              <el-input-number
                v-model.number="item.recruitNum"
                :min="1"
              ></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-bottom: 10px;">
          <el-col :span="20" :offset="1">
            <el-form-item
              label="招聘工作组"
              :prop="`approveItems[${index}].recruitWkgId`"
              :rules="rules.recruitWkgId"
            >
              <el-cascader
                ref="groupCascader"
                placeholder="部门工作组"
                :props="defaultParams"
                :options="groupList"
                clearable
                filterable
                change-on-select
                v-model="item.recruitWkgId"
                style="width: 100%;"
              ></el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="appTypeId == 1" :gutter="20" style="margin-bottom: 10px;">
          <el-col :span="20" :offset="1">
            <el-form-item label="月薪区间" required>
              <div style="display: flex;">
                <el-form-item
                  :prop="`approveItems[${index}].salaryMin`"
                  class="innerItem"
                  :rules="rules.salaryMin"
                >
                  <el-input
                    v-model.number="item.salaryMin"
                    style="width: 80px"
                  ></el-input>
                  <span>元/月</span>
                </el-form-item>
                <div style="width: 30px;text-align: center;">-</div>
                <el-form-item
                  :prop="`approveItems[${index}].salaryMax`"
                  class="innerItem"
                  :rules="rules.salaryMax"
                >
                  <el-input
                    v-model.number="item.salaryMax"
                    style="width: 80px"
                  ></el-input>
                  <span>元/月</span>
                </el-form-item>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="appTypeId == 1" :gutter="20" style="margin-bottom: 10px;">
          <el-col :span="20" :offset="1">
            <el-form-item label="年度奖金区间">
              <el-input
                v-model.number="item.bonusAmount"
                style="width: 80px"
              ></el-input>
              <span>元/年</span>
              <span style="font-size: 16px; color: #606266;"> 或 </span>
              <el-input
                v-model.number="item.bonusMonth"
                style="width: 80px"
              ></el-input>
              <span>个月月薪</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-bottom: 10px;">
          <el-col :span="20" :offset="1">
            <el-form-item
              label="招聘原因"
              :prop="`approveItems[${index}].reason`"
              :rules="rules.reason"
            >
              <el-input
                type="textarea"
                :rows="6"
                v-model="item.reason"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
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
import { queryOrganizationsChild, queryPositions } from "@/api/hrmList.js";
export default {
  name: "InviteFormal",
  props: ["appTypeId","dataDetail","talentInfo"],
  data() {
    return {
      groupList: [],
      positionsList: [],
      appUser: this.$store.getters.name,
      formData: {
        appUserId: this.$store.getters.userId,
        appDate: "",
        approveItems: [
          {
            recruitNum: 1,
            recruitType: "",
            recruitWkgId: [],
            recruitPosId: "",
            salaryMin: "",
            salaryMax: "",
            bonusAmount: "",
            bonusMonth: null,
            reason: ""
          }
        ]
      },
      defaultParams: {
        value: "deptCode",
        label: "kingDeeGroupName",
        checkStrictly: true,
        children: "children"
      },
      rules: {
        recruitNum: [
          { required: true, message: "招聘数量不能为空" },
          {
            pattern: /^(0|[1-9][0-9]*)$/,
            message: "招聘数量必须为数字值",
            trigger: "blur"
          },
          { type: "number", message: "招聘数量必须为数字值" }
        ],
        recruitWkgId: [{ required: true, message: "请选择招聘工作组" }],
        reason: [{ required: true, message: "请填写招聘原因" }],
        recruitType: [{ required: true, message: "请选择招聘类型" }],
        recruitPosId: [{ required: true, message: "请选择招聘岗位" }],
        salaryMin: [
          { required: true, message: "最低月薪不能为空" },
          { type: "number", message: "最低月薪必须为数字值" }
        ],
        salaryMax: [
          { required: true, message: "最高月薪不能为空" },
          { type: "number", message: "最高月薪必须为数字值" }
        ]
      }
    };
  },
  watch: {  
    dataDetail(newVal) {  
      if (newVal) {  
        // 处理新数据  
        this.formData.approveItems = newVal.approveItems.map(item => {
          return {
            id:item.id,
            recruitNum: item.recruitNum,
            recruitType: item.recruitType,
            recruitWkgId: this.findAncestors(this.groupList, item.recruitWkgId),
            recruitPosId: item.recruitPosId,
            salaryMin: Number(item.salaryMin),
            salaryMax: Number(item.salaryMax),
            bonusAmount: Number(item.bonusAmount),
            bonusMonth: item.bonusMonth,
            reason: item.reason
          };
        });
      }  
    },
    talentInfo(newVal){
      if (newVal) {
        this.queryOrganizationsChild();
      }
    },
    groupList(newVal){
      if(this.dataDetail && Array.isArray(this.dataDetail.approveItems) && newVal.length){
        this.formData.approveItems = this.dataDetail.approveItems.map(item => {
          return {
            id:item.id,
            recruitNum: item.recruitNum,
            recruitType: item.recruitType,
            recruitWkgId: this.findAncestors(newVal, item.recruitWkgId),
            recruitPosId: item.recruitPosId,
            salaryMin: Number(item.salaryMin),
            salaryMax: Number(item.salaryMax),
            bonusAmount: Number(item.bonusAmount),
            bonusMonth: item.bonusMonth,
            reason: item.reason
          };
        });
      }
    }
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
      this.formData.appDate = `${year}-${month}-${strDate}`;
      return `${year}-${month}-${strDate}`;
    },
    findAncestors(nodes, targetId) {  
      console.log(nodes,'nodes');
      console.log(targetId,'targetId');
      let arr = []
      console.log(nodes.length,'nodes.length');
      if (nodes.length) {
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
      }
      return arr;  
    },
    addApproveItem() {
      this.formData.approveItems.push({
        recruitNum: null,
        recruitWkgId: [],
        reason: "",
        recruitType: null,
        recruitPosId: null,
        salaryMin: null,
        salaryMax: null
      });
    },
    delApproveItem(index) {
      this.formData.approveItems.splice(index, 1);
    },
    // 获取岗位列表
    queryPositions() {
      queryPositions().then(res => {
        this.positionsList = res.data;
      });
    },
    // 获取部门列表
    queryOrganizationsChild() {
      const parmas = { deptCode:this.talentInfo.deptCode,status: 1}
      queryOrganizationsChild(parmas).then(res => {
        this.groupList = res.data || [];
      });
    },
    // 提交审批
    onCreactExamine(type) {
      this.$refs.examineForm.validate(valid => {
        if (valid) {
          this.$message({ message: "验证成功", type: "success" });
          const newFormData = JSON.parse(JSON.stringify(this.formData));
          newFormData.approveItems.forEach(item => {
            item.recruitWkgId = item.recruitWkgId[item.recruitWkgId.length - 1];
          });
          this.$emit("createApproval",newFormData,type);
        } else {
          this.$message({ message: "请根据提示填写表单", type: "error" });
        }
      });
    },
    Cancel() {
      this.$emit("CancelOff");
    },
  },
  created() {
    this.getNowFormatDate();
    this.queryPositions();
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
}
</style>
