<template>
  <div>
    <!-- 调动申请 -->
    <el-form
      size="small"
      ref="examineForm"
      :model="examineForm"
      label-width="100px"
      :rules="rules"
    >
      <el-row :gutter="20" style="margin-bottom: 10px;">
        <el-col :span="20" :offset="1">
          <el-form-item label="主题" prop="title">
            <el-select v-model="examineForm.title" placeholder="请选择">
              <el-option
                v-for="item in themeOptions"
                :key="item.value"
                size="mini"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
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
          <el-form-item label="司龄" prop="workingYears">
            <el-input v-model="companyAgeFormatted" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin-bottom: 10px;">
        <el-col :span="9">
          <el-form-item
            label="最高学历毕业院校"
            label-width="135px"
            :prop="`promoteList[0].collegeName`"
            :rules="rules.collegeName"
          >
            <el-input
              v-model="examineForm.promoteList[0].collegeName"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item
            label="学历"
            :prop="`promoteList[0].eduDegree`"
            :rules="rules.eduDegree"
            label-width="60px"
          >
            <el-input v-model="examineForm.promoteList[0].eduDegree"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item
            label="专业"
            :prop="`promoteList[0].major`"
            :rules="rules.major"
            label-width="60px"
          >
            <el-input v-model="examineForm.promoteList[0].major"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin-bottom: 10px;">
        <el-col :span="20" :offset="1">
          <el-form-item label="调动原因" prop="reason">
            <el-input type="textarea" v-model="examineForm.reason"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="message">
        <div class="blok"></div>
        <span>调动信息（变动前）</span>
      </div>
      <el-row :gutter="20" style="margin-bottom: 10px;">
        <el-col :span="9" :offset="1">
          <el-form-item label="部门" prop="deptBefore">
            <el-input v-model="talentInfo.department" disabled></el-input>
            <!-- <el-select
              :disabled="true"
              v-model="examineForm.promoteList[0].deptBefore"
              filterable
              clearable
              reserve-keyword
              placeholder="请选择部门"
            >
              <el-option
                v-for="itm in deptByConditionList"
                :key="itm.deptId"
                :label="itm.name"
                :value="itm.name"
              >
              </el-option>
            </el-select> -->
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="1">
          <el-form-item label="岗位" prop="posBefore">
            <el-select
              :disabled="true"
              v-model="talentInfo.posName"
              filterable
              clearable
              placeholder="请选择"
              style="width: 100%;"
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
        <el-col :span="20" :offset="1">
          <el-form-item label="工作组" prop="wkgBefore">
            <el-input
              v-model="talentInfo.groupName"
              :disabled="true"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin-bottom: 10px;">
        <el-col :span="7" :offset="1">
          <el-form-item
            label="月薪"
            :prop="`promoteList[0].salaryBefore`"
            :rules="rules.salaryBefore"
          >
            <el-input-number
              v-model="examineForm.promoteList[0].salaryBefore"
              :controls="false"
              style="width: 80px"
            ></el-input-number>
            <span>元/月</span>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item
            label="费率"
            :prop="`promoteList[0].addrAfter`"
            label-width="60px"
          >
            <el-input
              v-model="examineForm.promoteList[0].rateBefore"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            label="工作地"
            :prop="`promoteList[0].addrBefore`"
            :rules="rules.addrBefore"
            label-width="70px"
          >
            <el-input
              v-model="examineForm.promoteList[0].addrBefore"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="message">
        <div class="blok"></div>
        <span>调动信息（变动后）</span>
      </div>
      <el-row :gutter="20" style="margin-bottom: 10px;">
        <el-col :span="9" :offset="1">
          <el-form-item
            label="部门"
            :prop="`promoteList[0].deptAfter`"
            :rules="rules.deptAfter"
          >
            <el-select
              v-model="examineForm.promoteList[0].deptAfter"
              filterable
              clearable
              reserve-keyword
              placeholder="请选择部门"
            >
              <el-option
                v-for="itm in deptByConditionList"
                :key="itm.deptId"
                :label="itm.name"
                :value="itm.name"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="1">
          <el-form-item
            label="岗位"
            :prop="`promoteList[0].posAfter`"
            :rules="rules.posAfter"
          >
            <el-select
              v-model="examineForm.promoteList[0].posAfter"
              filterable
              clearable
              placeholder="请选择"
              style="width: 100%;"
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
        <el-col :span="20" :offset="1">
          <el-form-item
            label="工作组"
            :prop="`promoteList[0].wkgAfter`"
            :rules="rules.wkgAfter"
          >
            <el-cascader
              ref="groupCascader"
              placeholder="部门工作组"
              :props="defaultParams"
              :options="groupList"
              clearable
              filterable
              change-on-select
              v-model="examineForm.promoteList[0].wkgAfter"
              style="width: 100%;"
            ></el-cascader>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin-bottom: 10px;">
        <el-col :span="7" :offset="1">
          <el-form-item
            label="月薪"
            :prop="`promoteList[0].salaryAfter`"
            :rules="rules.salaryAfter"
          >
            <el-input-number
              v-model="examineForm.promoteList[0].salaryAfter"
              :controls="false"
              style="width: 80px"
            ></el-input-number>
            <span>元/月</span>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item
            label="费率"
            :prop="`promoteList[0].rateAfter`"
            label-width="60px"
          >
            <el-input v-model="examineForm.promoteList[0].rateAfter"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            label="工作地"
            :prop="`promoteList[0].addrAfter`"
            :rules="rules.addrAfter"
            label-width="70px"
          >
            <el-input v-model="examineForm.promoteList[0].addrAfter"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="message">
        <div class="blok"></div>
        <span>确认选项</span>
      </div>
      <el-row :gutter="20" style="margin-bottom: 10px;">
        <el-col :span="10">
          <el-form-item
            label="薪资是否上调"
            prop="salaryIncr"
            label-width="135px"
          >
            <el-radio-group v-model="examineForm.salaryIncr">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="1">
          <el-form-item
            label="调动生效时间"
            prop="effectiveDate"
            label-width="120px"
          >
            <el-date-picker
              v-model="examineForm.effectiveDate"
              type="date"
              style="width: 100%;"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
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
import { queryOrganizations, queryPositions } from "@/api/hrmList.js";
import { queryDeptByCondition } from "@/api/systemList";
import { convertDecimalToYearsMonths } from '@/utils/index.js';
export default {
  name: "Mobilize",
  props: ["talentInfo","dataDetail"],
  data() {
    return {
      groupList: [],
      positionsList: [],
      deptByConditionList: [],
      appUser: this.$store.getters.name,
      appUserId: this.$store.getters.userId,
      appDate: "",
      themeOptions: [
        {
          value: "跨部门调动",
          label: "跨部门调动"
        },
        {
          value: "跨区域调动",
          label: "跨区域调动"
        },
        {
          value: "跨岗位调动",
          label: "跨岗位调动"
        }
      ],
      defaultParams: {
        value: "kingDeeGroupName",
        label: "kingDeeGroupName",
        checkStrictly: true,
        children: "children"
      },
      examineForm: {
        title: "",
        reason: "",
        salaryIncr: 1,
        effectiveDate: "",
        promoteList: [
          {
            collegeName: "",
            eduDegree: "",
            major: "",
            salaryBefore: null,
            rateBefore: "",
            addrBefore: "",
            deptBefore: "",
            posBefore: "",
            wkgBefore: "",
            deptAfter: "",
            posAfter: "",
            wkgAfter: [],
            salaryAfter: null,
            rateAfter: "",
            addrAfter: ""
          }
        ]
      },
      rules: {
        title: [{ required: true, message: "请选择主题" }],
        collegeName: [{ required: true, message: "请填写最高学历毕业院校" }],
        eduDegree: [{ required: true, message: "请填写最高学历" }],
        major: [{ required: true, message: "请填写专业" }],
        reason: [{ required: true, message: "请填写调动原因" }],
        salaryBefore: [{ required: true, message: "请填写月薪" }],
        addrBefore: [{ required: true, message: "请填写工作地" }],
        deptAfter: [{ required: true, message: "请填写部门" }],
        posAfter: [{ required: true, message: "请填写岗位" }],
        wkgAfter: [{ required: true, message: "请填写工作组" }],
        salaryAfter: [{ required: true, message: "请填写月薪" }],
        addrAfter: [{ required: true, message: "请填写工作地" }],
        effectiveDate: [{ required: true, message: "请填调动生效时间" }],
        salaryIncr: [{ required: true, message: "请选择是否上调薪资" }]
      }
    };
  },
  computed: {  
    // 计算属性，将月份转换为“年 月”格式  
    companyAgeFormatted() {  
        return this.convertDecimalToYearsMonths(this.talentInfo.companyAge);  
    }
  },
  methods: {
    convertDecimalToYearsMonths,
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
    // 获取岗位列表
    queryPositions() {
      queryPositions().then(res => {
        this.positionsList = res.data;
      });
    },
    // 获取部门列表
    queryOrganizations() {
      queryOrganizations({ status: 1 }).then(res => {
        this.groupList = res.data;
      });
    },
    queryDeptByCondition() {
      queryDeptByCondition().then(res => {
        this.deptByConditionList = res.data;
      });
    },
    findAncestors(nodes, targetId) {  
      console.log(nodes,'nodes');
      console.log(targetId,'targetId');
      let arr = []
      nodes.forEach((firItem)=>{
        if (firItem.kingDeeGroupName == targetId) {
          arr = [ targetId ]
        }else{
          if (firItem.children&&firItem.children.length) {
            firItem.children.forEach(secItem => {
              if (secItem.kingDeeGroupName==targetId) {
                arr =  [ firItem.kingDeeGroupName, targetId]
              }else{
                if (secItem.children&&secItem.children.length) {
                  secItem.children.forEach(thiItem => {
                    if (thiItem.kingDeeGroupName == targetId) {
                      arr = [ firItem.kingDeeGroupName, secItem.kingDeeGroupName, targetId]
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
    // 提交审批
    onCreactExamine(type) {
      this.$refs.examineForm.validate(valid => {
        if (valid) {
          this.$message({ message: "验证成功", type: "success" });
          const data = {
            appUserId: this.appUserId,
            appDate: this.appDate,
            title: this.examineForm.title,
            startDate: this.talentInfo.startWorkDate,
            workingYears: this.talentInfo.companyAge,
            approveItems: []
          };
          let approveItem = JSON.parse(JSON.stringify(this.examineForm))
          approveItem.promoteList[0].deptBefore = this.talentInfo.department
          approveItem.promoteList[0].posBefore = this.talentInfo.posName
          approveItem.promoteList[0].wkgBefore = this.talentInfo.groupName
          approveItem.promoteList[0].wkgAfter = approveItem.promoteList[0].wkgAfter[approveItem.promoteList[0].wkgAfter.length - 1]
          delete approveItem.title;
          data.approveItems.push(approveItem);
          this.$emit("createApproval",data,type);
        } else {
          this.$message({ message: "请根据提示填写表单", type: "error" });
          
        }
      });
    },
    Cancel() {
      this.$emit("CancelOff");
    },
  },
  watch: {
    dataDetail(newVal) {
      const item = newVal.approveItems[0];
      this.examineForm = {
        id: item.id,
        title: newVal.title,
        reason: item.reason,
        salaryIncr: item.salaryIncr,
        effectiveDate: item.effectiveDate,
        promoteList:item.promoteList
      };
      this.examineForm.promoteList[0].wkgAfter = this.findAncestors(this.groupList, item.promoteList[0].wkgAfter)
    },
    // groupList(newVal) {
    //   console.log(newVal, "newVal222");
    //   this.findAncestors(newVal, this.talentInfo.deptCode);
    // }
  },
  created() {
    this.getNowFormatDate();
    this.queryPositions();
    this.queryOrganizations();
    this.queryDeptByCondition();
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
