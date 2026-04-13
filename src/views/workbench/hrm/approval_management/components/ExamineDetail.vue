<template>
  <div>
    <el-dialog
      :visible.sync="dialogFormVisible"
      width="1200px"
      @close="offDetail()"
    >
      <el-row :gutter="20" style="margin-top: 10px;">
        <el-col :span="17">
          <div class="detail-left">
            <div class="header">
              <el-row :gutter="20">
                <el-col :span="10">
                  <div class="blok"></div>
                  <span>审批详情</span>
                </el-col>
                <el-col
                  :span="14"
                  style="text-align: right"
                  v-if=" dataDetail.examine==1"
                >
                  <el-button
                    type="primary"
                    size="small"
                    @click="innerVisible = true"
                    >审批</el-button
                  >
                  <el-button
                    type="primary"
                    plain
                    size="small"
                    @click="offChange = true"
                    >加签</el-button
                  >
                  <!-- <el-dropdown>
                    <el-button type="primary" plain size="small">
                      更多操作<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item @click.native="offChange = true"
                        >加签</el-dropdown-item
                      >
                    </el-dropdown-menu>
                  </el-dropdown> -->
                  <ExamineIdea
                    v-if="innerVisible && flagT"
                    :approveId="approveId"
                    @offIdea="offIdea"
                    @refreshDetail="refreshDetail"
                    :dataDetail="dataDetail"
                  ></ExamineIdea>
                  <el-dialog
                    width="42%"
                    title="加签任务"
                    :visible.sync="offChange"
                    append-to-body
                  >
                    <div class="Change">
                      <div class="rebookTitle">
                        确认要加签这条{{
                          dataDetail.approveType
                        }}吗？请指定您要加签的人
                      </div>
                      <div class="rebookBody">
                        <div class="bodyRight">
                          <div class="rightTitle">设置加签人员</div>
                          <div class="rightSearch">
                            <el-input
                              v-model="name"
                              @input="searchName"
                              size="small"
                              placeholder="搜索部门名称或人员姓名"
                            ></el-input>
                          </div>
                          <div class="rightTable">
                            <el-table
                              border
                              fit
                              empty-text="暂无数据"
                              size="mini"
                              current-row-key
                              :row-class-name="rowClassName"
                              :data="list"
                              @select-all="selectTicketAll"
                              @select="selectTicket"
                              style="width: 100%;"
                            >
                              <el-table-column
                                type="selection"
                                width="72"
                                align="center"
                              ></el-table-column>
                              <el-table-column
                                label="部门"
                                prop="deptName"
                              ></el-table-column>
                              <el-table-column
                                label="姓名"
                                prop="fullname"
                              ></el-table-column>
                            </el-table>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="fl-ac-jc" style="padding: 20px 0">
                      <el-button @click="offChange = false">取 消</el-button>
                      <el-button type="primary" @click="rowSubmit"
                        >确 定</el-button
                      >
                    </div>
                  </el-dialog>
                </el-col>
              </el-row>
              <div class="segmentation"></div>
            </div>
            <div class="submitter">
              <p class="people">
                {{ dataDetail.createUser }}提交的<span
                  style="color: rgb(41, 41, 255);"
                  >{{ dataDetail.approveType }}</span
                >
              </p>
            </div>
            <!-- 申请信息组件 -->
            <InviteMessage
              v-if="dataDetail && flag"
              :approveTypeId="approveTypeId"
              :dataDetail="dataDetail"
            ></InviteMessage>

            <div v-if="examineList.length">
              <div class="message">
                <div class="blok"></div>
                <span>审批信息</span>
              </div>
              <div class="examineBox">
                <div v-for="(item, index) in examineList">
                  <div v-if="approveTypeId === 6 && dataDetail.taskNo == 2">
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
                        <td>
                          现基本能达到目标要求，基本符合该职务期望和要求的能力水平
                        </td>
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
                        <th colspan="2" width="70%" class="centerTd">
                          评价内容
                        </th>
                        <th width="30%" class="centerTd">
                          评价等级（A/B/C/D）
                        </th>
                      </tr>
                      <tr>
                        <td width="20%" class="centerTd">1</td>
                        <td width="50%">工作质量:工作成果是否达到了标准要求</td>
                        <td width="30%" class="centerTd">
                          {{ item.gradeScore1 ? item.gradeScore1 : "-" }}
                        </td>
                      </tr>
                      <tr>
                        <td width="20%" class="centerTd">2</td>
                        <td width="50%">工作效率:是否按时按量完成工作任务</td>
                        <td width="30%" class="centerTd">
                          {{ item.gradeScore2 ? item.gradeScore2 : "-" }}
                        </td>
                      </tr>
                      <tr>
                        <td width="20%" class="centerTd">3</td>
                        <td width="50%">
                          团队合作:是否能与其他同事共同解决问题
                        </td>
                        <td width="30%" class="centerTd">
                          {{ item.gradeScore3 ? item.gradeScore3 : "-" }}
                        </td>
                      </tr>
                      <tr>
                        <td width="20%" class="centerTd">4</td>
                        <td width="50%">积极性:是否能经常主动的完成各种工作</td>
                        <td width="30%" class="centerTd">
                          {{ item.gradeScore4 ? item.gradeScore4 : "-" }}
                        </td>
                      </tr>
                      <tr>
                        <td width="20%" class="centerTd">5</td>
                        <td width="50%">沟通能力:是否能与他人进行有效的交流</td>
                        <td width="30%" class="centerTd">
                          {{ item.gradeScore5 ? item.gradeScore5 : "-" }}
                        </td>
                      </tr>
                      <tr>
                        <td width="20%" class="centerTd">6</td>
                        <td width="50%">表达能力:是否能准确表达自己的意图</td>
                        <td width="30%" class="centerTd">
                          {{ item.gradeScore6 ? item.gradeScore6 : "-" }}
                        </td>
                      </tr>
                      <tr>
                        <td width="20%" class="centerTd">7</td>
                        <td width="50%">专业知识:是否具备本岗位所需相关知识</td>
                        <td width="30%" class="centerTd">
                          {{ item.gradeScore7 ? item.gradeScore7 : "-" }}
                        </td>
                      </tr>
                      <tr>
                        <td width="20%" class="centerTd">8</td>
                        <td width="50%">出勤:迟到、早退和无故缺勤情况</td>
                        <td width="30%" class="centerTd">
                          {{ item.gradeScore8 ? item.gradeScore8 : "-" }}
                        </td>
                      </tr>
                    </table>
                  </div>
                  <el-card
                    class="box-card"
                    style="margin-bottom: 10px;"
                    :key="index"
                    v-else
                  >
                    <div style="display: flex;flex-wrap: wrap;">
                      <div
                        :style="{
                          width: key == 'supplementOpinion' ? '100%' : '50%',
                          display: 'flex',
                          gap: '10px',
                          marginBottom: '10px'
                        }"
                        v-for="(value, key) in item"
                        :key="key"
                        v-if="showExamineFields.includes(key) && value"
                      >
                        <div
                          style="min-width: 100px;color: rgb(156, 156, 156);text-align: right;"
                        >
                          {{ labelMap[key] }}
                        </div>
                        <div>{{ value }}</div>
                      </div>
                    </div>
                  </el-card>
                </div>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="7">
          <div class="detail-right">
            <el-timeline v-if="activities.length">
              <el-timeline-item
                v-for="(item, index) in activities"
                :key="index"
                :color="item.status == '已完成' ? 'green' : 'red'"
                :timestamp="item.finish"
                @click.native="selectedProcessRunId = item.processRunId"
                style="margin-left: 2px"
              >
                <el-card
                  style="margin-top: 4px"
                  :class="{
                    highlight: selectedProcessRunId == item.processRunId
                  }"
                >
                  <h3>任务名称：{{ item.progressName }}</h3>
                  <p class="item_p">状态：{{ item.status }}</p>
                  <!-- <p class="item_p" v-if="item.returnReason">
                    退回原因：{{ item.returnReason }}
                  </p> -->
                  <p class="item_p">任务人：</p>
                  <p class="item_p" v-for="item in formattedTasks(item.countersign)">{{ item }}</p>
                  <!-- <p class="item_p">时间：{{item.finish}}</p> -->
                </el-card>
              </el-timeline-item>
            </el-timeline>
            <!-- <el-empty v-else style="margin-top: 80px" description="暂无流程任务"/> -->
          </div>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import {
  queryApproveProcess,
  queryApproveTaskRecord,
  countersignPersonApprove
} from "@/api/hrmList.js";
import TaskRecord from "@/views/workbench/finance/components/TaskRecord";
import Rebook from "@/views/workbench/finance_two/components/Rebook";
import InviteMessage from "./examine_message/InviteMessage";
import ExamineIdea from "./ExamineIdea";
export default {
  name: "ExamineDetail",
  props: ["approveId", "approveTypeId"],
  components: {
    TaskRecord,
    Rebook,
    InviteMessage,
    ExamineIdea
  },
  data() {
    return {
      flagT: false,
      flag: false,
      offChange: false,
      dialogFormVisible: true,
      innerVisible: false,
      resUser: "",
      auditUserIds: [],
      name: "",
      list: [],
      dataDetail: {},
      activities: [],
      selectedProcessRunId: "",
      examineList: [],
      labelMap: {
        supplementOpinion: "补充意见",
        regularSalary: "转正后月薪",
        regularDate: "转正生效时间",
        delayDate: "延迟实习日期",
        preparePosition: " 拟聘职务",
        trialAgreement: "试用期约定",
        trialSalary: " 试用期月薪",
        posAfterChange: "变动后岗位核定",
        startDate: "开始日期",
        endDate: "结束日期",
        compensation: "经济补偿金核算标准及金额",
        salaryAfterChange: "变动后工资",
        salaryAfterChange: "变动后工资"
      },
      showExamineFields: [
        "supplementOpinion",
        "regularDate",
        "delayDate",
        "preparePosition",
        "trialAgreement",
        "trialSalary",
        "posAfterChange",
        "salaryAfterChange",
        "startDate",
        "endDate",
        "compensation"
      ]
    };
  },
  methods: {
    //格式化任务人
    formattedTasks(taskList) {
      if (taskList&&taskList.length) {
        return taskList.filter(item => item.fullname).map(item => `${item.fullname}（${item.statusStr}）${item.createDate?' - '+item.createDate:''}`) || [];
      }
    },
    // 关闭详情
    offDetail() {
      this.$emit("offDetail");
    },
    offIdea() {
      this.innerVisible = false;
    },
    refreshDetail() {
      this.queryApproveProcess();
    },
    rowClassName({ row, rowIndex }) {
      if (row.userId == this.auditUserIds) {
        return "currentClick";
      }
      return "";
    },
    searchName(value) {
      if (!value) return;
      this.auditUserIds = "";
      this.list = this.$store.getters.userList.filter(item =>
        (item.deptName + "~" + item.fullname).includes(value)
      );
    },
    // rowClick(row) {
    //     this.name = row.fullname
    //     this.auditUserIds = row.userId
    // },
    // 获取审核详情信息
    queryApproveProcess() {
      const data = {
        approveId: this.approveId,
        approveTypeId: this.approveTypeId
      };
      queryApproveProcess(data).then(res => {
        res.data.taskNo = 2;
        this.dataDetail = res.data;
        // this.resUser = this.$store.getters.userList.filter(value => value['userId'] === res.data.appUserId)[0].fullname
        this.flag = true;
        this.flagT = true;
        this.queryApproveTaskRecord();
      });
    },
    //根据审批流程Id查询审批流程
    queryApproveTaskRecord() {
      const data = {
        approveId: this.approveId,
        approveTypeId: this.approveTypeId,
        processDefineId: this.dataDetail.processDefineId
      };
      queryApproveTaskRecord(data).then(res => {
        this.activities = res.data;
      });
    },
    // 加签审批流程
    addSignature() {
      const data = {
        id: this.approveId,
        currentTaskId: this.dataDetail.currentTaskId,
        auditUserIdList: this.auditUserIds
      };
      countersignPersonApprove(data).then(res => {
        this.$message({ message: "加签成功", type: "success" });
        this.offChange = false;
      });
    },
    rowSubmit() {
      this.addSignature();
    },
    // 选中加签项
    selectTicket(selection, row) {
      this.auditUserIds = selection.map(item => item.id);
    },
    selectTicketAll(selection) {
      this.auditUserIds = selection.map(item => item.id);
    }
  },
  watch: {
    selectedProcessRunId(val) {
      let list = this.activities.filter(
        item => item.processRunId == this.selectedProcessRunId
      );
      if (list.length > 0) {
        console.log(list, "list");
        this.examineList = list[0].personApproveOpinions || [];
      }
    }
  },
  created() {
    this.queryApproveProcess();
  }
};
</script>

<style lang="scss" scoped>
.detail-left {
  border-radius: 10px;
  padding: 0 14px 40px 14px;
  max-height: 640px;
  overflow-x: hidden;
  overflow-y: scroll;
  .header {
    height: 50px;
    line-height: 50px;
    margin-bottom: 14px;
    .blok {
      height: 26px;
      width: 6px;
      background-color: blue;
      border-radius: 6px;
      float: left;
      margin: 12px 14px 0 0;
    }
    span {
      font-size: 20px;
      color: #313131;
    }
    .segmentation {
      width: 100%;
      border-top: 1px solid #dcdcdc;
    }
  }
  .submitter {
    margin-bottom: 15px;
    width: 60%;
    margin: 0 auto;
    padding: 24px 0;
    .people {
      width: 100%;
      text-align: center;
      font-size: 22px;
      font-weight: 500;
    }
    .encoding {
      width: 100%;
      text-align: center;
      font-size: 12px;
      color: #a0a0a0;
      margin-top: 8px;
    }
  }
  .message {
    height: 30px;
    line-height: 30px;
    position: relative;
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
    .segmentation {
      width: 88%;
      border-top: 1px solid #dcdcdc;
      position: absolute;
      top: 16px;
      right: 0;
    }
  }
  .examineBox {
    margin-top: 24px;
    .box-card {
      max-width: 98%;
      margin: 0 auto;
    }
  }
}
.detail-right {
  margin: 16px 20px 0 0;
  max-height: 680px;
  overflow-x: hidden;
  overflow-y: scroll;
  position: relative;
  .item_p {
    margin-top: 6px;
  }
  .el-card {
    // 其他样式...
    &:hover {
      cursor: pointer;
      background-color: lightgray;
    }
  }
  .highlight {
    background-color: lightgray;
  }
}
.Change {
  width: 100%;
  border: 1px solid #d7d7d7;
  padding: 10px;
  .rebookTitle {
    color: #d9001b;
    padding-bottom: 10px;
    border-bottom: 2px solid #797979;
  }
  .rebookBody {
    display: flex;
    .bodyRight {
      min-height: 300px;
      max-height: 500px;
      overflow: auto;
      flex: 6;

      .rightTitle {
        text-align: center;
        background-color: #d7d7d7;
        margin-top: 10px;
        height: 30px;
        line-height: 30px;
      }

      .rightSearch {
        .el-input {
          input {
            border-radius: 0 !important;
          }
        }
      }

      .rightTable {
        thead {
          tr {
            th {
              background-color: #d7d7d7;
              color: #606266;
            }
          }
        }
      }
    }
  }
}
// >>>.currentClick{
//     background-color: #2981EB!important;
//     color: #ffffff;
//     font-weight: bold;
// }
>>> .el-table--enable-row-hover .el-table__body tr:hover > td {
  background-color: transparent !important;
}
.detail-right::-webkit-scrollbar {
  display: none;
}
.detail-left::-webkit-scrollbar {
  display: none;
}
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
</style>
