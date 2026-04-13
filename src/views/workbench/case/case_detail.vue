<template >

  <Casedetails v-if="viewPush=='1'&&prePage" :is-edit="true" :prePage="prePage"></Casedetails>
  <Transfer v-else-if="viewPush=='2'&&prePage" :is-edit="true" :prePage="prePage"></Transfer>
  <Litigation v-else-if="viewPush=='3'&&prePage" :business="11" :is-edit="true" :prePage="prePage"></Litigation>
  <ProtectCase v-else-if="viewPush=='4'&&prePage" :business="4" :is-edit="true" :prePage="prePage"></ProtectCase>
  <PatentCase v-else-if="viewPush=='5'&&prePage" :is-edit="true" :prePage="prePage"></PatentCase>

</template>

<script>
  import {queryAgentNumByCaseId} from '@/api/caseDetail'
import Casedetails from "./components/Casedetails";
import Transfer from "./components/Transfer_casedetail";
import Litigation from "./components/Litigation_casedetail";
import ProtectCase from "./components/Protect_casedetail";
import PatentCase from "./components/PatentCase";
import {deleteCase} from "@/api/caseList";
//赵
const defaultZData = [
  "答复临时驳回/审查意见（境外）",
  "变名变址",
  "续展",
  "变更注册申请代理机构",
  "删减商品项目",
  "更正商标申请事项",
  "商标注册",
  "签署代理合同协议",
  "商标监控总卷/协议",
  "咨询",
  "其他",
  "投标"
];
//于
const defaultYData = [
  "转让/移转",
  "许可备案",
  "分割申请",
  "异议",
  "异议答辩",
  "无效宣告申请",
  "撤销成为通用名称注册商标",
  "无效宣告答辩",
  "注册驳回复审",
  "无效复审",
  "国际注册驳回复审",
  '商标监控报告',
  '许可备案变更',
  '许可备案提前终止',
  '注册人死亡终止注销',
  '专用权质权登记',
  '广告',
  '著名商标认定',
  '行政复议',
  '撤回行政复议',
  '国际注册指定国家补正',
  "不予注册复审",
  "撤销商标复审",
  "无效宣告复审",
  "撤三答辩（提供使用证明）",
  "撤销三年停止使用申请",
  "商标查询",
  "撤回商标申请",
  "补发商标注册证",
  "补发商标变转续证明",
  "撤回商标评审",
  "参加不予注册复审",
  "商标注销",
  "出具优先权证明文件",
  "出具商标注册证明",
  "撤销复审答辩",
  "撤销通用名称答辩"
];

export default {
  name: "EditForm",
  components: { Casedetails, Transfer, Litigation,ProtectCase,PatentCase },
  data () {
    return {
      viewPush: '',
      prePage: "",
    };
  },
  created () {
    let caseType = this.$route.params.caseType;
    if (defaultYData.includes(caseType) && this.$route.query.taskType!='4') {
      this.viewPush = '2';
    } else if(this.$route.query.taskType=='2') {
      this.viewPush = '3';
    } else if(this.$route.query.taskType=='4'){
      this.viewPush = '5';
    } else if(['3','5','6','7'].includes(this.$route.query.taskType)) {
      this.viewPush = '4';
    }else {
      this.viewPush = '1';
    }
    if(this.$route.query.caseTypeId){
      let realCaseType=this.$commonUtils.getMenuName(this.$store.state.caseInformation.caseTypeList,'childrens').find(item=>item.caseTypeId==this.$route.query.caseTypeId).caseType
      if (defaultYData.includes(realCaseType)) {
        this.viewPush = '2';
      } else if(this.$route.query.taskType=='2') {
        this.viewPush = '3';
      }else {
        this.viewPush = '1';
      }
    }
  },
  beforeRouteLeave (to, from, next) {
    //专利复制立案退出删除案件
      if(from.query&&from.query.copy&&from.query.copy == 'true' && from.query.taskType && from.params&&from.params.id){
          queryAgentNumByCaseId({caseId: from.params.id}).then(res => {
            if (res.data && res.data.agentNum == from.query.agentNum) {
              console.log('将要删除案号：', from.query.agentNum)
              deleteCase({caseIds: from.params.id, taskType: from.query.taskType})
            } else {
              console.log('将要删除案号：', from.query.agentNum)
              console.log('查询出的案号：', res.data.agentNum)
              console.log('案号不等，不执行删除操作')
            }
          }).finally(()=> next())
        }else{
        next()
      }
    },
  beforeRouteEnter (to, from, next) {
    next(res => {
      console.log(from.name);
      if (
        from &&
        [
          "case_management",
          "registration",
          "massfiling",
          "toDoTasksChildren"
        ].includes(from.name)
      ) {
        if (from.name == "case_management") {
          res.prePage = "案件管理";
        }
        if (from.name == "registration") {
          res.prePage = "立卷";
        }
        if (from.name == "massfiling") {
          res.prePage = "批量立卷";
        }
        if (from.name == "toDoTasksChildren") {
          res.prePage = "案件管理";
        }
      } else {
        res.prePage = "案件管理";
      }
    });
  }
};
</script>