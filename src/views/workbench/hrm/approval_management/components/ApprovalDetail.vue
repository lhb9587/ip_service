<template>
  <div>
    <el-dialog
      :visible.sync="dialogFormVisible"
      width="900px"
      style="margin-top:-50px"
      @close="offExamine()"
    >
      <div class="draw-examine">
        <div class="header">
          <div class="blok"></div>
          <span>发起{{ appName }}</span>
          <div class="segmentation"></div>
        </div>
        <InviteFormal
          v-if="appTypeId == 1 || appTypeId == 2"
          :appTypeId="appTypeId"
          @CancelOff="CancelOff()"
          :dataDetail="dataDetail"
          :talentInfo="talentInfo"
          @createApproval="createApproveProcess"
        ></InviteFormal>
        <EntryFormal
          v-if="appTypeId == 3 || appTypeId == 4"
          :appTypeId="appTypeId"
          @CancelOff="CancelOff()"
          :dataDetail="dataDetail"
          @createApproval="createApproveProcess"
        ></EntryFormal>
        <StraightFor
          v-if="appTypeId == 5"
          @CancelOff="CancelOff()"
          :dataDetail="dataDetail"
          :talentInfo="talentInfo"
          :positionsList="positionsList"
          :groupList="groupList"
          @createApproval="createApproveProcess"
        ></StraightFor>
        <Evaluate
          v-if="appTypeId == 6"
          @CancelOff="CancelOff()"
          :dataDetail="dataDetail"
          :talentList="talentList"
          @createApproval="createApproveProcess"
        ></Evaluate>
        <Mobilize
          v-if="appTypeId == 7"
          @CancelOff="CancelOff()"
          :dataDetail="dataDetail"
          :talentInfo="talentInfo"
          @createApproval="createApproveProcess"
        ></Mobilize>
        <RaiseSalary
          v-if="appTypeId == 8"
          :talentList="talentList"
          @CancelOff="CancelOff()"
          :dataDetail="dataDetail"
          @createApproval="createApproveProcess"
        ></RaiseSalary>
        <PromotionApply
          v-if="appTypeId == 9"
          @CancelOff="CancelOff()"
          :dataDetail="dataDetail"
          :positionsList="positionsList"
          :talentInfo="talentInfo"
          @createApproval="createApproveProcess"
        ></PromotionApply>
        <PromotionCareful
          v-if="appTypeId == 10"
          @CancelOff="CancelOff()"
          :dataDetail="dataDetail"
          :talentList="talentList"
          :positionsList="positionsList"
          @createApproval="createApproveProcess"
        ></PromotionCareful>
        <DepartApply
          v-if="appTypeId == 11"
          :appTypeId="appTypeId"
          @CancelOff="CancelOff()"
          :dataDetail="dataDetail"
          @createApproval="createApproveProcess"
        ></DepartApply>
        <Dismiss
          v-if="appTypeId == 12"
          :appTypeId="appTypeId"
          :talentList="talentList"
          :positionsList="positionsList"
          @CancelOff="CancelOff()"
          :dataDetail="dataDetail"
          @createApproval="createApproveProcess"
        ></Dismiss>
        <RenewalAsk
          v-if="appTypeId == 13"
          :appTypeId="appTypeId"
          :talentList="talentList"
          @CancelOff="CancelOff()"
          :dataDetail="dataDetail"
          @createApproval="createApproveProcess"
        ></RenewalAsk>
        <RenewalNotice
          v-if="appTypeId == 14"
          :appTypeId="appTypeId"
          :talentList="talentList"
          @CancelOff="CancelOff()"
          :dataDetail="dataDetail"
          @createApproval="createApproveProcess"
        ></RenewalNotice>
        <FormalWages
          v-if="appTypeId == 15 || appTypeId == 16"
          :appTypeId="appTypeId"
          @CancelOff="CancelOff()"
          :dataDetail="dataDetail"
          @createApproval="createApproveProcess"
        ></FormalWages>
        <DocumentPatent
          v-if="appTypeId == 17 || appTypeId == 18"
          :appTypeId="appTypeId"
          :talentInfo="talentInfo"
          @CancelOff="CancelOff()"
          :dataDetail="dataDetail"
          :positionsList="positionsList"
          :groupList="groupList"
          @createApproval="createApproveProcess"
        ></DocumentPatent>
        <ResidenceProve
          v-if="appTypeId == 19"
          :talentList="talentList"
          :positionsList="positionsList"
          @CancelOff="CancelOff()"
          :dataDetail="dataDetail"
          @createApproval="createApproveProcess"
        ></ResidenceProve>
        <ProveApply
          v-if="appTypeId == 20"
          @CancelOff="CancelOff()"
          :dataDetail="dataDetail"
          @createApproval="createApproveProcess"
        ></ProveApply>
        <StayApply
          v-if="appTypeId == 21"
          @CancelOff="CancelOff()"
          :dataDetail="dataDetail"
          @createApproval="createApproveProcess"
        ></StayApply>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import InviteFormal from "./found_examine/InviteFormal";
import EntryFormal from "./found_examine/EntryFormal";
import StraightFor from "./found_examine/StraightFor";
import Evaluate from "./found_examine/Evaluate";
import Mobilize from "./found_examine/Mobilize";
import RaiseSalary from "./found_examine/RaiseSalary";
import PromotionApply from "./found_examine/PromotionApply";
import PromotionCareful from "./found_examine/PromotionCareful";
import DepartApply from "./found_examine/DepartApply";
import Dismiss from "./found_examine/Dismiss";
import RenewalAsk from "./found_examine/RenewalAsk";
import RenewalNotice from "./found_examine/Renewalnotice";
import FormalWages from "./found_examine/FormalWages";
import DocumentPatent from "./found_examine/DocumentPatent";
import ResidenceProve from "./found_examine/ResidenceProve";
import ProveApply from "./found_examine/ProveApply";
import StayApply from "./found_examine/StayApply";
import {
  createApproveProcess,
  queryPositions,
  queryOrganizations,
  queryApproveProcess,
  saveApproveProcess,
  queryTalentPersonListNoPermission
} from "@/api/hrmList.js";
export default {
  name: "ApprovalDetail",
  components: {
    InviteFormal,
    EntryFormal,
    StraightFor,
    Evaluate,
    Mobilize,
    RaiseSalary,
    PromotionApply,
    PromotionCareful,
    DepartApply,
    Dismiss,
    RenewalAsk,
    RenewalNotice,
    FormalWages,
    DocumentPatent,
    ResidenceProve,
    ProveApply,
    StayApply
  },
  props: ["appTypeId", "appName", "action", "approveId"],
  data() {
    return {
      dialogFormVisible: true,
      talentList: [],
      talentInfo: {},
      positionsList: [],
      groupList: [],
      dataDetail: {}
    };
  },
  methods: {
    // 关闭详情
    offExamine() {
      this.$emit("offExamine");
    },
    // 起草审批流程并创建审批项目 
    createApproveProcess(val, submit) {
      const data = {
        approveTypeId: this.appTypeId,
        id: this.approveId ? this.approveId : undefined,
        approveItems: [],
        submit: submit
      };
      Object.assign(data, val);
      if (submit) {
        createApproveProcess(data).then(res => {
          if (res.success) {
            this.$message({ message: res.message, type: "success" });
            this.dialogFormVisible = false;
          }
        });
      } else {
        if (this.action == "create") {
          createApproveProcess(data).then(res => {
            if (res.success) {
              this.$message({ message: res.message, type: "success" });
              this.dialogFormVisible = false;
            }
          });
        } else {
          delete data.submit;
          saveApproveProcess(data).then(res => {
            if (res.success) {
              this.$message({ message: "保存成功", type: "success" });
              this.dialogFormVisible = false;
            }
          });
        }
      }
    },
    CancelOff() {
      this.dialogFormVisible = false;
    },
    // 获取人才列表
    fetchTalentList() {
      const data = {
        pageNo: 1,
        pageSize: 99999
      };
      queryTalentPersonListNoPermission(data).then(res => {
        this.talentList = res.data;
      });
    },
    //获取个人信息
    fetchPersonInfo() {
      const data = {
        userId: this.$store.state.user.userId
      };
      queryTalentPersonListNoPermission(data).then(res => {
        this.talentInfo = res.data[0] || {};
      });
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
    // 获取审核详情信息
    queryApproveProcess() {
      const data = {
        approveId: this.approveId,
        approveTypeId: this.appTypeId
      };
      queryApproveProcess(data).then(res => {
        console.log(res.data, "data");
        this.dataDetail = res.data;
      });
    }
  },
  created() {
    if (
      this.appTypeId == 6 ||
      this.appTypeId == 8 ||
      this.appTypeId == 10 ||
      this.appTypeId == 12 ||
      this.appTypeId == 13 ||
      this.appTypeId == 14 ||
      this.appTypeId == 17 ||
      this.appTypeId == 18 ||
      this.appTypeId == 19
    ) {
      this.fetchTalentList();
    }
    if (
      this.appTypeId == 5 ||
      this.appTypeId == 9 ||
      this.appTypeId == 10 ||
      this.appTypeId == 12 ||
      this.appTypeId == 17 ||
      this.appTypeId == 18 ||
      this.appTypeId == 19
    ) {
      this.queryPositions();
    }
    if (this.appTypeId == 5 || this.appTypeId == 17 || this.appTypeId == 18) {
      this.queryOrganizations();
    }
    this.fetchPersonInfo();
    if (this.action === "edit") {
      this.queryApproveProcess();
    }
  }
};
</script>

<style lang="scss" scoped>
.draw-examine {
  padding: 20px;
  max-height: 820px;
  overflow-x: hidden;
  overflow-y: scroll;
  .header {
    height: 50px;
    line-height: 50px;
    margin-bottom: 30px;
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
}
.draw-examine::-webkit-scrollbar {
  display: none;
}
</style>
