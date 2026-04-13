<template>
  <div>
    <el-dialog
      width="700px"
      :title="dataDetail.approveType + '- 审批'"
      :visible.sync="innerVisible"
      append-to-body
      @close="offIdea()"
    >
      <el-form
        ref="controls"
        :model="approveOpinions"
        label-width="125px"
        :rules="rules"
      >
        <div v-if="dataDetail.approveTypeId === 6 && dataDetail.taskNo == 2">
          <table
            width="100%"
            cellpadding="10px"
            :align="center"
            :border="true"
            class="cutomTable topTable"
            style="border-collapse: collapse;"
          >
            <tr>
              <th width="20%" class="centerTd">评级等级</th>
              <th width="80%" class="centerTd">说明</th>
            </tr>
            <tr>
              <td class="centerTd">A</td>
              <td>表现一贯十分卓越，超出该职务规定之期望水平</td>
            </tr>
            <tr>
              <td class="centerTd">B</td>
              <td>
                表现一贯达到目标要求，有时超出了该职务期望和要求的能力水平
              </td>
            </tr>
            <tr>
              <td class="centerTd">C</td>
              <td>现基本能达到目标要求，基本符合该职务期望和要求的能力水平</td>
            </tr>
            <tr>
              <td class="centerTd">D</td>
              <td>
                表现很少能达到目标要求，基本不符合该职务期望和要求的能力水平
              </td>
            </tr>
          </table>

          <table
            width="100%"
            cellpadding="10px"
            cellspacing="0"
            :align="center"
            :border="true"
            class="cutomTable"
            style="border-collapse: collapse;margin-bottom: 20px;"
          >
            <tr>
              <th colspan="2" width="70%" class="centerTd">评价内容</th>
              <th width="30%" class="centerTd">评价等级（A/B/C/D）</th>
            </tr>
            <tr>
              <td width="20%" class="centerTd">1</td>
              <td width="50%">工作质量:工作成果是否达到了标准要求</td>
              <td width="30%" class="centerTd">
                <el-radio-group
                  v-model="approveOpinions.gradeScore1"
                  class="customRadio"
                >
                  <el-radio label="A">A</el-radio>
                  <el-radio label="B">B</el-radio>
                  <el-radio label="C">C</el-radio>
                  <el-radio label="D">D</el-radio>
                </el-radio-group>
              </td>
            </tr>
            <tr>
              <td width="20%" class="centerTd">2</td>
              <td width="50%">工作效率:是否按时按量完成工作任务</td>
              <td width="30%" class="centerTd">
                <el-radio-group
                  v-model="approveOpinions.gradeScore2"
                  class="customRadio"
                >
                  <el-radio label="A">A</el-radio>
                  <el-radio label="B">B</el-radio>
                  <el-radio label="C">C</el-radio>
                  <el-radio label="D">D</el-radio>
                </el-radio-group>
              </td>
            </tr>
            <tr>
              <td width="20%" class="centerTd">3</td>
              <td width="50%">团队合作:是否能与其他同事共同解决问题</td>
              <td width="30%" class="centerTd">
                <el-radio-group
                  v-model="approveOpinions.gradeScore3"
                  class="customRadio"
                >
                  <el-radio label="A">A</el-radio>
                  <el-radio label="B">B</el-radio>
                  <el-radio label="C">C</el-radio>
                  <el-radio label="D">D</el-radio>
                </el-radio-group>
              </td>
            </tr>
            <tr>
              <td width="20%" class="centerTd">4</td>
              <td width="50%">积极性:是否能经常主动的完成各种工作</td>
              <td width="30%" class="centerTd">
                <el-radio-group
                  v-model="approveOpinions.gradeScore4"
                  class="customRadio"
                >
                  <el-radio label="A">A</el-radio>
                  <el-radio label="B">B</el-radio>
                  <el-radio label="C">C</el-radio>
                  <el-radio label="D">D</el-radio>
                </el-radio-group>
              </td>
            </tr>
            <tr>
              <td width="20%" class="centerTd">5</td>
              <td width="50%">沟通能力:是否能与他人进行有效的交流</td>
              <td width="30%" class="centerTd">
                <el-radio-group
                  v-model="approveOpinions.gradeScore5"
                  class="customRadio"
                >
                  <el-radio label="A">A</el-radio>
                  <el-radio label="B">B</el-radio>
                  <el-radio label="C">C</el-radio>
                  <el-radio label="D">D</el-radio>
                </el-radio-group>
              </td>
            </tr>
            <tr>
              <td width="20%" class="centerTd">6</td>
              <td width="50%">表达能力:是否能准确表达自己的意图</td>
              <td width="30%" class="centerTd">
                <el-radio-group
                  v-model="approveOpinions.gradeScore6"
                  class="customRadio"
                >
                  <el-radio label="A">A</el-radio>
                  <el-radio label="B">B</el-radio>
                  <el-radio label="C">C</el-radio>
                  <el-radio label="D">D</el-radio>
                </el-radio-group>
              </td>
            </tr>
            <tr>
              <td width="20%" class="centerTd">7</td>
              <td width="50%">专业知识:是否具备本岗位所需相关知识</td>
              <td width="30%" class="centerTd">
                <el-radio-group
                  v-model="approveOpinions.gradeScore7"
                  class="customRadio"
                >
                  <el-radio label="A">A</el-radio>
                  <el-radio label="B">B</el-radio>
                  <el-radio label="C">C</el-radio>
                  <el-radio label="D">D</el-radio>
                </el-radio-group>
              </td>
            </tr>
            <tr>
              <td width="20%" class="centerTd">8</td>
              <td width="50%">出勤:迟到、早退和无故缺勤情况</td>
              <td width="30%" class="centerTd">
                <el-radio-group
                  v-model="approveOpinions.gradeScore8"
                  class="customRadio"
                >
                  <el-radio label="A">A</el-radio>
                  <el-radio label="B">B</el-radio>
                  <el-radio label="C">C</el-radio>
                  <el-radio label="D">D</el-radio>
                </el-radio-group>
              </td>
            </tr>
          </table>
        </div>

        <el-form-item
          label="意见"
          prop="opinion"
          v-if="!(dataDetail.approveTypeId == 6 && dataDetail.taskNo == 2)"
        >
          <el-select v-model="approveOpinions.opinion" placeholder="请选择意见">
            <el-option
              v-for="(item, index) in idea"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <div v-if="dataDetail.approveTypeId === 6">
          <el-form-item
            label="延长实习至"
            prop="delayDate"
            v-if="dataDetail.taskNo == 3 && approveOpinions.opinion == 2"
          >
            <el-date-picker
              v-model="approveOpinions.delayDate"
              type="date"
              style="width: 200px;"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
            >
            </el-date-picker>
          </el-form-item>
          <div v-if="dataDetail.taskNo == 3 && approveOpinions.opinion == 3">
            <el-form-item label="拟聘职务" prop="preparePosition">
              <el-input
                v-model="approveOpinions.preparePosition"
                style="width: 200px;"
              ></el-input>
            </el-form-item>
            <el-form-item label="试用期约定" required>
              <div style="display: flex;">
                <el-form-item prop="startDate" class="innerItem">
                  <el-date-picker
                    v-model="approveOpinions.startDate"
                    type="date"
                    placeholder="开始日期"
                    style="width: 120px"
                    prefix-icon="dateIconNone"
                    value-format="yyyy-MM-dd"
                  />
                </el-form-item>
                <span class="line"> - </span>
                <el-form-item prop="endDate" class="innerItem">
                  <el-date-picker
                    v-model="approveOpinions.endDate"
                    type="date"
                    placeholder="结束日期"
                    style="width: 120px"
                    prefix-icon="dateIconNone"
                    value-format="yyyy-MM-dd"
                  />
                </el-form-item>
              </div>
            </el-form-item>
            <el-form-item label="试用期月薪" prop="trialSalary">
              <el-input
                v-model="approveOpinions.trialSalary"
                style="width: 80px"
              ></el-input>
              <span>元/月</span>
            </el-form-item>
          </div>
          <el-form-item
            label="转正后月薪"
            prop="regularSalary"
            v-if="
              dataDetail.approveTypeId == 5 &&
                approveOpinions.opinion == 1 &&
                dataDetail.taskNo == 2
            "
          >
            <el-input
              v-model="approveOpinions.regularSalary"
              style="width: 80px"
            ></el-input>
            <span>元/月</span>
          </el-form-item>
        </div>

        <el-form-item
          label="转正生效时间"
          prop="regularDate"
          v-if="
            dataDetail.approveTypeId == 5 &&
              approveOpinions.opinion == 1 &&
              dataDetail.taskNo == 2
          "
        >
          <el-date-picker
            v-model="approveOpinions.regularDate"
            type="date"
            style="width: 200px;"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <div v-if="dataDetail.approveTypeId === 7 && dataDetail.taskNo == 4">
          <el-form-item label="变动后岗位核定" prop="posAfterChange">
            <el-input
              v-model="approveOpinions.posAfterChange"
              style="width: 200px;"
            ></el-input>
          </el-form-item>
          <el-form-item label="薪资核定" prop="salaryAfterChange">
            <el-input
              v-model="approveOpinions.salaryAfterChange"
              style="width: 200px;"
            ></el-input>
          </el-form-item>
          <el-form-item label="调动考察期" required>
            <div style="display: flex;">
              <el-form-item prop="startDate" class="innerItem">
                <el-date-picker
                  v-model="approveOpinions.startDate"
                  type="date"
                  placeholder="开始日期"
                  style="width: 120px"
                  prefix-icon="dateIconNone"
                  value-format="yyyy-MM-dd"
                />
              </el-form-item>
              <span class="line"> - </span>
              <el-form-item prop="endDate" class="innerItem">
                <el-date-picker
                  v-model="approveOpinions.endDate"
                  type="date"
                  placeholder="结束日期"
                  style="width: 120px"
                  prefix-icon="dateIconNone"
                  value-format="yyyy-MM-dd"
                />
              </el-form-item>
            </div>
          </el-form-item>
        </div>
        <el-form-item
          label="建议考核期"
          required
          v-if="dataDetail.approveTypeId === 9 && dataDetail.taskNo == 2"
        >
          <div style="display: flex;">
            <el-form-item prop="startDate" class="innerItem">
              <el-date-picker
                v-model="approveOpinions.startDate"
                type="date"
                placeholder="开始日期"
                style="width: 120px"
                prefix-icon="dateIconNone"
                value-format="yyyy-MM-dd"
              />
            </el-form-item>
            <span class="line"> - </span>
            <el-form-item prop="endDate" class="innerItem">
              <el-date-picker
                v-model="approveOpinions.endDate"
                type="date"
                placeholder="结束日期"
                style="width: 120px"
                prefix-icon="dateIconNone"
                value-format="yyyy-MM-dd"
              />
            </el-form-item>
          </div>
        </el-form-item>
        <el-form-item
          label="经济补偿金核算标准及金额"
          prop="compensation"
          label-width="200px"
          v-if="dataDetail.approveTypeId == 12 && dataDetail.taskNo == 2"
        >
          <el-input
            v-model="approveOpinions.compensation"
            style="width: 200px;"
          ></el-input>
        </el-form-item>
        <div v-if="dataDetail.approveTypeId === 13 && dataDetail.taskNo == 2">
          <el-form-item
            label="未来工作发展设计"
            prop="supplementOpinion"
            v-if="approveOpinions.opinion == 1"
          >
            <el-input
              v-model="approveOpinions.supplementOpinion"
              style="width: 200px;"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="不同意续签原因"
            prop="supplementOpinion"
            v-if="approveOpinions.opinion == 2"
          >
            <el-input
              v-model="approveOpinions.supplementOpinion"
              style="width: 200px;"
            ></el-input>
          </el-form-item>
        </div>
        <el-form-item
          label="意见补充"
          prop="supplementOpinion"
          v-if="
            !(dataDetail.approveTypeId == 6 && dataDetail.taskNo == 2) &&
              dataDetail.approveTypeId != 11 &&
              !(dataDetail.approveTypeId == 13 && dataDetail.taskNo == 2) &&
              !(dataDetail.approveTypeId == 17 && dataDetail.taskNo == 3) &&
              !(dataDetail.approveTypeId == 18 && dataDetail.taskNo == 3) &&
              !(dataDetail.approveTypeId == 19 && dataDetail.taskNo == 3) &&
              !(dataDetail.approveTypeId == 20 && dataDetail.taskNo == 3)
          "
        >
          <el-input
            type="textarea"
            :rows="6"
            v-model="approveOpinions.supplementOpinion"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onExamine">确定</el-button>
          <el-button @click="resetForm">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { auditPersonApprove } from "@/api/hrmList.js";
export default {
  name: "ExamineIdea",
  props: ["approveId", "dataDetail"],
  data() {
    return {
      innerVisible: true,
      currentTaskName: "首席合伙人意见",
      approveOpinions: {
        opinion: "",
        supplementOpinion: "",
        regularSalary: "",
        regularDate: null,
        delayDate: "",
        preparePosition: "",
        trialSalary: "",
        posAfterChange: "",
        salaryAfterChange: "",
        startDate: "",
        endDate: "",
        compensation: ""
      },
      rules: {
        opinion: [{ required: true, message: "请选择审批意见" }],
        regularSalary: [{ required: true, message: "请填写转正后月薪" }],
        regularDate: [{ required: true, message: "请选择转正生效时间" }],
        delayDate: [{ required: true, message: "请选择延长实习日期" }],
        preparePosition: [{ required: true, message: "请填写拟聘职务" }],
        trialSalary: [{ required: true, message: "请填写试用期月薪" }],
        posAfterChange: [{ required: true, message: "请填写变动后岗位核定" }],
        salaryAfterChange: [
          { required: true, message: "请填写变动后薪资核定" }
        ],
        startDate: [{ required: true, message: "请选择开始日期" }],
        endDate: [{ required: true, message: "请选择结束日期" }],
        compensation: [
          { required: true, message: "请填写经济补偿金核算标准及金额" }
        ]
      }
    };
  },
  methods: {
    // 关闭内置弹框
    resetForm() {
      this.innerVisible = false;
    },
    offIdea() {
      this.$emit("offIdea");
    },
    removeEmptyValues(obj) {
      for (const key in obj) {
        if (obj[key] === null || obj[key] === undefined || obj[key] === "") {
          delete obj[key];
        } else if (
          typeof obj[key] === "object" &&
          Object.keys(obj[key]).length === 0
        ) {
          delete obj[key];
        }
      }
      return obj;
    },
    // gmentProcess() {
    //   if (this.dataDetail.currentTaskName == "管委会合伙人意见") {
    //     // this.rules.aaaa[0].required =
    //     this.opinion = "councilOpinion";
    //     this.rules.supplementOpinion = [
    //       { required: true, message: "请选择活动区域", trigger: "change" }
    //     ];
    //   } else if (this.dataDetail.currentTaskName == "首席合伙人意见") {
    //     this.opinion = "chiefOpinion";
    //   }
    // },
    // changeYj(val) {
    //   this.$set(this.approveOpinions, `${this.opinion}`, val);
    // },
    // 提交
    onExamine() {
      this.$refs.controls.validate(valid => {
        if (valid) {
          this.auditPersonApprove();
        } else {
          this.$message({ message: "请根据提示填写表单", type: "error" });
          
        }
      });
    },
    auditPersonApprove() {
      const data = {
        // processDefineId: this.dataDetail.processDefineId,
        approveId: this.approveId,
        taskId: this.dataDetail.currentTaskId,
        approveOpinions: []
      };
      const params = this.removeEmptyValues(this.approveOpinions);
      data.approveOpinions.push(params);
      auditPersonApprove(data).then(res => {
        this.offIdea();
        this.$emit("refreshDetail");
      });
    }
  },
  computed: {
    idea() {
      let arr = [];
      switch (this.dataDetail.approveTypeId) {
        case 6:
          arr = [
            { label: "结束实习", value: 1 },
            { label: "延长实习", value: 2 },
            { label: "录用", value: 3 }
          ];
          break;
        case 13:
          arr = [
            { label: "同意续签", value: 1 },
            { label: "不同意续签", value: 2 }
          ];
          break;
        case 1:
          arr = [
            { label: "同意", value: 1 },
            { label: "不同意", value: 2 },
            { label: "部分同意", value: 3 },
            { label: "暂缓审批", value: 4 }
          ];
          break;
        case 2:
          arr = [
            { label: "同意", value: 1 },
            { label: "不同意", value: 2 },
            { label: "部分同意", value: 3 },
            { label: "暂缓审批", value: 4 }
          ];
          break;
        default:
          arr = [
            { label: "同意", value: 1 },
            { label: "不同意", value: 2 },
            { label: "暂缓审批", value: 4 }
          ];
          break;
      }
      return arr;
    }
  }
};
</script>

<style lang="scss" scoped>
.centerTd {
  text-align: center;
}
.cutomTable td {
  padding: 4px 0;
}
.topTable tr:last-child {
  border-bottom: none;
}
.cutomTable th {
  padding: 4px 0;
}
/deep/.customRadio {
  .el-radio {
    margin-right: 14px;
  }
}
.line {
  display: block;
  width: 20px;
  text-align: center;
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
