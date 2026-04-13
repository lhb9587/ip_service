<template>
  <div>
    <!-- 调薪审批 -->
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
          <el-form-item label="生效时间" prop="effectiveDate">
            <el-date-picker
              v-model="examineForm.effectiveDate"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="message">
        <div class="blok"></div>
        <span>调薪信息</span>
        <el-button type="primary" size="mini" @click="addNewRow"
          >新增一行</el-button
        >
      </div>
      <el-table
        :data="examineForm.salaryChangeList"
        size="mini"
        style="width: 95%;margin: auto;"
        :border="true"
        class="salaryTable"
      >
        <el-table-column fixed label="调薪人员">
          <template slot-scope="scope">
            <el-form-item
              class="table-item"
              :prop="`salaryChangeList[${scope.$index}][talentCode]`"
              :rules="rules.talentCode"
            >
              <el-select
                v-model="scope.row.talentCode"
                filterable
                placeholder="请选择"
                size="mini"
                @change="changeTalent(scope.row.talentCode, scope.$index)"
              >
                <el-option
                  v-for="item in talentList"
                  :key="item.talentCode"
                  :label="item.talentName"
                  :value="item.talentCode"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column prop="position" label="岗位">
          <template slot-scope="scope">
            <div>{{ scope.row.position }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="workYears" label="司龄">
          <template slot-scope="scope">
            <div>{{ scope.row.workYears }}</div>
          </template>
        </el-table-column>
        <el-table-column label="目前薪资" width="120">
          <template slot-scope="scope">
            <el-form-item
              class="table-item"
              :prop="`salaryChangeList[${scope.$index}][currentSalary]`"
              :rules="rules.currentSalary"
            >
              <el-input v-model="scope.row.currentSalary" size="mini">
                <template #suffix
                  >元/月</template
                ></el-input
              >
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="调整后薪资" width="120">
          <template slot-scope="scope">
            <el-form-item
              class="table-item"
              :prop="`salaryChangeList[${scope.$index}][changedSalary]`"
              :rules="rules.changedSalary"
            >
              <el-input v-model="scope.row.changedSalary" size="mini">
                <template #suffix
                  >元/月</template
                ></el-input
              >
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="调整原因" width="200">
          <template slot-scope="scope">
            <el-form-item
              class="table-item"
              :prop="`salaryChangeList[${scope.$index}][changedReason]`"
              :rules="rules.changedReason"
            >
              <el-input v-model="scope.row.changedReason" clearable size="mini">
              </el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="60px">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="mini"
              :disabled="scope.$index === 0"
              @click="HandleDel(scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

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
import { queryTalentPersonListNoPermission } from "@/api/hrmList.js";
export default {
  name: "RaiseSalary",
  props: ["talentList","dataDetail"],
  data() {
    return {
      appUser: this.$store.getters.name,
      appUserId: this.$store.getters.userId,
      appDate: null,
      examineForm: {
        effectiveDate: null,
        salaryChangeList: [
          {
            id: 1,
            talentCode: "",
            talentName: "",
            position: "",
            workYears: "",
            currentSalary: "",
            changedSalary: "",
            changedReason: ""
          }
        ]
      },
      rules: {
        effectiveDate: [
          { required: true, message: "请填写生效日期", trigger: "blur" }
        ],
        talentCode: [
          { required: true, message: "请填写调薪人员", trigger: "blur" }
        ],
        currentSalary: [
          { required: true, message: "请填写目前薪资", trigger: "blur" }
        ],
        changedSalary: [
          { required: true, message: "请填写调整后薪资", trigger: "blur" }
        ],
        changedReason: [
          { required: true, message: "请填写调整原因", trigger: "blur" }
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
        effectiveDate: item.effectiveDate,
        salaryChangeList: item.salaryChangeList
      };
    },
  },
  methods: {
    addNewRow() {
      // 创建一个新的行对象，具体字段根据你的数据结构来定
      const newRow = {
        id: `id-${Math.random()
          .toString(36)
          .substr(2, 9)}`,
        name: "",
        quantity: ""
      };
      this.examineForm.salaryChangeList.push(newRow);
    },
    toggleEdit(row, index) {
      console.log(index, "index");
      if (!row.editing) {
        // 编辑前，备份数据
      } else {
        // 如果是在保存数据，可以在这里添加发送更新到服务器的代码
      }
      row.editing = !row.editing;
      row.isNew = false;
    },
    cancelEdit(row) {
      if (row.isNew) {
        // 如果这是新添加的行，当用户取消时我们需要将其移除
        const index = this.tableData.indexOf(row);
        this.tableData.splice(index, 1);
      } else {
        // 如果这是已存在的行，取消编辑时恢复原始数据
        Object.assign(row, row.originalData);
        row.editing = false;
      }
    },
    //根据调薪人员获取岗位和司龄
    changeTalent(value, index) {
      const data = {
        talentCode: value
      };
      queryTalentPersonListNoPermission(data).then(res => {
        const talentInfo = res.data[0] || {};
        this.examineForm.salaryChangeList[index].talentName = talentInfo.talentName
        this.examineForm.salaryChangeList[index].position = talentInfo.posName
        this.examineForm.salaryChangeList[index].workYears = talentInfo.workAge
      });
    },
    HandleDel(row) {
      const index = this.examineForm.salaryChangeList.findIndex(
        item => item.id === row.id
      );
      if (index !== -1) {
        this.examineForm.salaryChangeList.splice(index, 1);
      }
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
    console.log(this.talentList, "talentList");
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
.salaryTable {
  >>> .el-table__cell {
    padding: 0 4px;
  }
  >>> .el-input__inner {
    padding: 0 4px;
  }
}
.table-item {
  >>> .el-form-item__content {
    margin-left: 0 !important;
  }
}
/deep/.salaryTable {
  .el-form-item {
    margin-bottom: 0;
  }
}
</style>
