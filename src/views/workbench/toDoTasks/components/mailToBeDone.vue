<template>
  <div>
    <el-form label-width="136px">
      <!--<div class="el-wrap">-->
      <el-form-item label="案件文号:" class="twoInputWarp">
        <el-input :disabled="queryModuleData.withCase == 2" v-model="queryModuleData.agentNumStart " placeholder="请输入内容" @change="changeTextRange" clearable></el-input>
        <span>至</span>
        <el-input :disabled="queryModuleData.withCase == 2" v-model="queryModuleData.agentNumEnd" placeholder="请输入内容" clearable></el-input>
      </el-form-item>
      <el-form-item label="案件类型:">
        <el-cascader :disabled="queryModuleData.withCase == 2" ref="caseTypecascader" filterable v-model="caseTypeIdList" :show-all-levels="false" :options="caseTypeOptions" :props="defaultParams" @change="catchange" placeholder="请选择"
          clearable></el-cascader>
      </el-form-item>
      <el-form-item label="递交日期:" class="twoInputWarp">
        <el-date-picker :disabled="queryModuleData.withCase == 2" v-model="queryModuleData.djSubmitDateStart" type="date" placeholder="开始日期" value-format="yyyy-MM-dd">
        </el-date-picker>
        <span>至</span>
        <el-date-picker :disabled="queryModuleData.withCase == 2" v-model="queryModuleData.djSubmitDateEnd" type="date" placeholder="结束日期" value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-form-item>
      <!--</div>-->
      <!--<div class="el-wrap">-->
      <el-form-item label="客户:" prop="mailCustId">
        <el-select v-model="queryModuleData['mailCustId']" ref="custSelect" filterable clearable remote reserve-keyword placeholder="请输入客户姓名" :remote-method="queryCustomerList"
          >
          <el-option v-for="item in customerNameIdList" :key="item.custId" :label="item.fullname" :value="item.custId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="申请人:">
        <el-select :disabled="queryModuleData.withCase == 2" v-model="queryModuleData.appId" placeholder="请选择/输入申请人姓名" filterable clearable remote :remote-method="queryAllUrl">
          <el-option v-for="item in appInfoList" :key="item.appId" :label="item.applicantName" :value="item.appId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="邮件类型:">
        <el-select v-model="queryModuleData.mailTypeDescList" placeholder="请选择" filterable clearable multiple>
          <el-option v-for="item in mailTypeList" :key="item.mailTypeDesc" :label="item.mailTypeDesc" :value="item.mailTypeDesc">
          </el-option>
        </el-select>
      </el-form-item>
      <!--</div>-->
      <!--<div class="el-wrap">-->
      <el-form-item label="官文类型:">
        <el-select  default-first-option v-model="queryModuleData.materialTypeId" placeholder="请选择" filterable
                    clearable>
          <el-option
            v-for="item in typeNameList"
            :key="item.materialTypeId"
            :label="item.typeName"
            :value="item.materialTypeId">
          </el-option>
        </el-select>
      </el-form-item>
<!--      </el-form-item>-->
      <el-form-item label="官方通知收文日期:" class="twoInputWarp">
        <el-date-picker v-model="queryModuleData.recvDateStar" type="date" placeholder="开始日期" value-format="yyyy-MM-dd">
        </el-date-picker>
        <span>至</span>
        <el-date-picker v-model="queryModuleData.recvDateEnd" type="date" placeholder="结束日期" value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="商标号:" >
        <el-input :disabled="queryModuleData.withCase == 2" v-model="queryModuleData.regNumber " placeholder="请输入商标号" clearable></el-input>
      </el-form-item>
      <el-form-item label="商标名称:">
        <el-input :disabled="queryModuleData.withCase == 2" v-model="queryModuleData.tmName " placeholder="请输入商标名称"  clearable></el-input>
      </el-form-item>
      <el-form-item label="作业人:">
        <VirtualSelect clearable filterable :data="$store.getters.allUserList" v-model="queryModuleData.handler" placeholder="请选择作业人"></VirtualSelect>
<!--        <el-input v-model="queryModuleData.handler " placeholder="请输入作业人名称"  clearable></el-input>-->
      </el-form-item>
      <!--</div>-->
      <el-form-item label="发送状态:">
        <el-radio-group v-model="queryModuleData.mailStatus" @change="handleSearch">
          <el-radio label="0">待发送</el-radio>
          <el-radio label="">全部</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="无案件官文:">
        <el-checkbox @change="changeWithCase" :true-label="2" v-model="queryModuleData.withCase"></el-checkbox>
      </el-form-item>
      <el-form-item label="客户组:">
        <el-select  default-first-option v-model="queryModuleData.custWkgId" clearable filterable placeholder="请选择">
          <el-option
            v-for="item in queryWorkgroupNamesList"
            :key="item.wkgId"
            :label="item.groupName"
            :value="item.wkgId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-button type="primary" class="clearButton" size="mini" @click="clearSearch"><img src="@/assets/清除@2x.png" alt=""><span>重置</span></el-button>
      <div class="buttonWrap">
        <!--<el-button type="primary" size="mini" @click="detachMent">重置</el-button>-->
        <el-button type="primary" size="mini" @click="handleSearch">搜索</el-button>
        <el-button type="primary" v-allow="124" size="mini" @click="sendMail(multipleSelection.map(item=>item.mailTodoId),1)">
          发送</el-button>
        <el-button type="primary" size="mini" @click="manualFinish(multipleSelection.map(item=>item.mailTodoId),1)">
          刪除</el-button>
        <el-button type="primary"  v-allow="284" size="mini" @click="batchFinish(multipleSelection.map(item=>item.mailTodoId),1)">
          完成</el-button>
      </div>
    </el-form>
    <TitleTotal :total="total" />
    <el-table ref="todoTaskMultiple" :data="mailList" fit empty-text="暂无数据" highlight-current-row current-row-key style="width: 100%;" @select="handleSelectionChange" @select-all="handleSelectionAll"
      :height="clientHeight" :row-style="tableRowStyle">
      <el-table-column type="selection" width="30" class="selection" v-if="selectionState">
      </el-table-column>
      <el-table-column type="index" width="50" label="序号" align="left">
        <template slot-scope="scope">
          <span>{{scope.$index+1}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="item.title" align="left" v-for="item,index in tableTitleList" :key="index" :width="item.value==='index'?50:item.value==='agentNum'?170:'auto'" :prop="item.value" sortable
        filter-placement="bottom-start" :filters="unique(mailList.map(i=>({text:i[item.value],value:i[item.value]})),'value').filter(ii=>ii.value)" :filter-method="filterHandler">
        <template slot-scope="scope">
          <p style="margin: 0;cursor: pointer" :title="scope.row.status==1?scope.row['failReason']:scope.row[item.value]" >
            <span v-if="item.value==='agentNum'" @click="takeCaseDetail(scope.row)">{{scope.row[item.value]}}</span>
            <span v-if="item.value!=='agentNum'">{{scope.row[item.value]}}</span>
          </p>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="left" fixed="right" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="sendMail(scope.row.mailTodoId,1)" :title="scope.row.autowriteStatus">发送</el-button>
          <el-button v-if="scope.row.mailPath"  type="text" size="small" @click="$commonUtils.downLoadAll({url:`ipdoc${scope.row.mailPath}`})">下载</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :pageSizes="pageSizesList" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="queryMailList()" />
  </div>
</template>

<script>
import {
  queryMailList,
  queryMailType,
  queryCustomerNameId,
  queryAppInfoUrl,
  queryCaseType,
  sendMail,
  queryMaterialType,
  queryMailTypeAll
} from "@/api/caseList";
import {manualFinish,batchFinish} from "@/api/mailList"
import { queryAllUrl } from "@/api/applicant";
import {queryWorkgroupNames} from '@/api/systemList'
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import { getTwoDimensionalArray } from "@/utils";
import { log } from "util";
export default {
  name: "mailToBeDone",
  data() {
    return {
      notify: {},
      selectionState: true,
      listLoading: false,
      queryModuleData: {
        // mailCustId: null,
        // mailCaseTypeId: '',
        // mailTypeId: null
        withCase: undefined,
        regNumber:'',
        tmName:'',
        mailStatus: "0"
      },
      typeNameList:[],
      customerNameIdList: [],
      appInfoList: [],
      mailTypeList: [],
      caseTypeOptions: [],
      listQuery: {
        pageNo: 1,
        pageSize: JSON.parse(localStorage.getItem("pageSize"))
          ? JSON.parse(localStorage.getItem("pageSize")).find(
              item => item.name == this.$route.name
            )
            ? JSON.parse(localStorage.getItem("pageSize")).find(
                item => item.name == this.$route.name
              ).pageSize
            : 10
          : 10
      },
      pageSizesList: [10, 50, 100, 200, 300, 400, 500],
      caseTypeIdList: [],
      defaultParams: {
        // 級聯菜單默認
        value: "caseTypeId",
        label: "caseType",
        children: "childrens",
        checkStrictly: false
      },
      total: 0,
      mailList: [],
      tableTitleList: [
        { title: "案件文号", value: "agentNum" },
        { title: "案件类型", value: "caseType" },
        { title: "客户", value: "custName" },
        { title: "申请人", value: "appCnName" },
        // { title: "商标名称", value: "tmName" },
        { title: "案件中文名称", value: "caseName" },
        { title: "类别", value: "goodClasses" },
        { title: "权利号", value: "droitNumber" },
        { title: "客户组", value: "groupName" },
        { title: "案件阶段", value: "stageName" },
        { title: "最新进展", value: "progressName" },
        { title: "发起人", value: "opertorName" },
        { title: "邮件类型", value: "mailTypeDesc" },
        { title: "发起日期", value: "createDate" },
        { title: "作业人", value: "handlers" },

      ],
      multipleSelection: [],
      exportQueryModel:{},
      queryWorkgroupNamesList:[]
    };
  },
  created() {
    this.queryMailList();
    this.queryCaseType();
    this.queryMaterialType()
    this.queryMailTypeAll()
    this.queryWorkgroupNames()
  },
  // activated() {
  //
  // },
  methods: {
    queryWorkgroupNames(){
      queryWorkgroupNames().then(res => {
        if (res.success) {
          this.queryWorkgroupNamesList = res.data
        }
      })
    },
    changeWithCase(value){
      const keyList = ["agentNumStart", "agentNumEnd", "mailCaseTypeId", "djSubmitDateStart", "djSubmitDateEnd", "appId", "regNumber", "tmName"]
      if (value) {
        this.caseTypeIdList = []
        keyList.forEach(item => {
          this.$set(this.queryModuleData, item, undefined)
        })
      }
    },
    clearSearch() {
      this.queryModuleData = {
        mailStatus: ""
      };
      this.caseTypeIdList = []
      // this.handleSearch()
    },
    takeCaseDetail(row){
      this.$commonUtils.takeCaseDetail(row,this)
    },
    tableRowStyle({row, rowIndex}) {
      if (row.status === 1) {
        return  { color: '#ff0000'};
      } else if (row.status!=1&&row.createFlag==1) {
        return { color: '#007aff' };
      }
      return '';
    },
    queryMaterialType() {
      queryMaterialType({ sign: 2,caseTypeId:3 }).then(res => {
        this.typeNameList = res.data
      })
    },
    queryMailTypeAll(){
      queryMailTypeAll().then(res=>{
        this.mailTypeList=res.data
      })
    },
    filterHandler(value, row, column) {
      const property = column["property"];
      return row[property] === value;
    },
    handleSearch() {
      this.multipleSelection = [];
      this.listQuery.pageNo = 1;
      this.queryMailList();
    },
    queryAllUrl(value){
      queryAllUrl({
        applicantName: value,
        pageNo: 1,
        pageSize: 100,
        orderBy:1
      }).then(res=>{
        this.appInfoList=res.data || []
      })
    },
    catchange(e) {
      if (e.length) {
        this.queryModuleData.mailCaseTypeId = e[e.length - 1]; //this.$refs.caseTypecascader.currentLabels[this.$refs.caseTypecascader.currentLabels.length-1]
      } else {
        this.queryModuleData.mailCaseTypeId = null;
      }
      //  this.queryMailType();
    },
    queryMailList(flag) {
      this.queryModuleData.pageNo = this.listQuery.pageNo;
      this.queryModuleData.pageSize = this.listQuery.pageSize;
      this.listLoading = true;
      queryMailList(flag?this.exportQueryModel:this.queryModuleData).then(res => {
        this.exportQueryModel=JSON.parse(JSON.stringify(this.queryModuleData))
        this.listLoading = false;
        this.mailList = res.data || [];
        // let oneObjList = this.unique(this.mailList, "caseId");
        // if (oneObjList.length === 1 && this.queryModuleData.agentNumStart) {
        //   this.caseTypeIdList = getTwoDimensionalArray(
        //     this.caseTypeOptions,
        //     "caseTypeId",
        //     oneObjList[0].caseTypeId
        //   );
        //   this.catchange(this.caseTypeIdList);
        //   this.queryCustomerList(oneObjList[0].custName);
        //   this.queryModuleData["mailCustId"] = oneObjList[0].custId;
        //   // this.selectCustChange(
        //   //   this.queryModuleData["mailCustId"],
        //   //   oneObjList[0].appId
        //   // );
        // }
        if (this.multipleSelection.length) {
          this.$nextTick(() => {
            this.multipleSelection.forEach(itm => {
              this.$refs.todoTaskMultiple.toggleRowSelection(
                this.mailList.find(item => item.mailTodoId === itm.mailTodoId),
                true
              );
            });
          });
        }
        this.total = res.total;
      });
    },
    // selectCustChange(custId, appId) {
    //   this.appInfoList = [];
    //   this.queryModuleData.appId = null;
    //   if (custId) {
    //     this.queryAppInfoUrl(custId, appId);
    //   }
    // },
    changeTextRange(e) {
      this.$set(this.queryModuleData, "agentNumEnd", e);
    },
    queryCustomerList(query) {
      if (query !== "") {
        queryCustomerNameId({ pageNo: 1, pageSize: 100, keyword: query }).then(
          res => {
            this.customerNameIdList = res.data;
          }
        );
      }
    },
    // queryAppInfoUrl(custId, appId) {
    //   queryAppInfoUrl({ custId }).then(res => {
    //     this.appInfoList = res.data;
    //     if (appId) {
    //       this.queryModuleData.appId = appId;
    //     }
    //   });
    // },
    queryCaseType() {
      queryCaseType().then(res => {
        this.caseTypeOptions = res.data; // this.getTreeData()
      });
    },
    // queryMailType() {
    //   queryMailType(this.queryModuleData).then(res => {
    //     this.mailTypeList = res.data;
    //   });
    // },
    manualFinish(mailTodoId) {
      if(!this.multipleSelection.length){
        return
      }
      manualFinish({ mailTodoIdArray: mailTodoId}).then(res=>{
        this.$message.success(res.message)
        this.multipleSelection=[]
        this.queryMailList();
      })
    },
    batchFinish(mailTodoId){
      if(!this.multipleSelection.length){
        return
      }
      batchFinish({ mailTodoIdArray: mailTodoId}).then(res=>{
        this.$message.success(res.message)
        this.multipleSelection=[]
        this.queryMailList();
        this.$store.dispatch('user/getTodoTaskNotice');
      })
    },
    sendMail(mailTodoId, isInspectCcEmail) {
      if (
        [...new Set(this.multipleSelection.map(item => item.custId))].length >=
        2
      ) {
        this.$message.error("您必须选择同一客户下的案件");
        this.multipleSelection
          .filter(item => item.custId !== this.multipleSelection[0].custId)
          .forEach(row => {
            this.$refs.todoTaskMultiple.toggleRowSelection(row, false);
            this.multipleSelection = this.multipleSelection.filter(
              item => item.mailTodoId !== row.mailTodoId
            );
          });
        return;
      }
      if (
        [...new Set(this.multipleSelection.map(item => item.mailTypeId))]
          .length >= 2
      ) {
        this.$message.error("您必须选择同一邮件类型案件");
        this.multipleSelection
          .filter(
            item => item.mailTypeId !== this.multipleSelection[0].mailTypeId
          )
          .forEach(row => {
            this.$refs.todoTaskMultiple.toggleRowSelection(row, false);
            this.multipleSelection = this.multipleSelection.filter(
              item => item.mailTodoId !== row.mailTodoId
            );
          });
        return;
      }
      if (
        [...new Set(this.multipleSelection.map(item => item.caseTypeId))]
          .length >= 2
      ) {
        this.$message.error("您必须选择同一案件类型案件");
        this.multipleSelection
          .filter(item => item.caseType !== this.multipleSelection[0].caseType)
          .forEach(row => {
            this.$refs.todoTaskMultiple.toggleRowSelection(row, false);
            this.multipleSelection = this.multipleSelection.filter(
              item => item.mailTodoId !== row.mailTodoId
            );
          });
        return;
      }
      if (
        [...new Set(this.multipleSelection.map(item => item.appCnName))]
          .length >= 2
      ) {
        this.$message.error("您必须选择同一申请人的案件");
        this.multipleSelection
          .filter(
            item => item.appCnName !== this.multipleSelection[0].appCnName
          )
          .forEach(row => {
            this.$refs.todoTaskMultiple.toggleRowSelection(row, false);
            this.multipleSelection = this.multipleSelection.filter(
              item => item.mailTodoId !== row.mailTodoId
            );
          });
        return;
      }
      // if (document.getElementsByClassName("el-notification").length > 0) {
      //   this.$message.error("请等待邮件发送完成后，再次发送。");
      //   return;
      // }

      this.notify = this.$notify({
        title: "提示",
        message: "邮件发送中...",
        duration: 3000,
        showClose: false,
        type: "warning"
      });

      sendMail({ mailTodoIdArray: mailTodoId, isInspectCcEmail })
        .then(res => {
          if (res.messageType == 10) {
            this.$confirm(res.message, "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            })
              .then(() => {
                this.sendMail(mailTodoId);
              })
              .catch(() => {});
          } else {
            // this.notify.close();
            // this.$notify({
            //   title: "提示",
            //   message: res.message,
            //   showClose: false,
            //   type: "success"
            // });
            this.multipleSelection=[]
            // this.queryMailList(1);
          }
        })
        .catch(item => {
        //  this.notify.close();
        });
    },

    handleSelectionAll(val) {
      val = val.filter(item => item !== undefined);
      this.multipleSelection = this.unique(
        this.multipleSelection.concat(val),
        "mailTodoId"
      );
      // if (
      //   [...new Set(this.multipleSelection.map(item => item.custId))].length >=
      //   2
      // ) {
      //   this.$message.error("您必须选择同一客户下的案件");
      //   this.multipleSelection
      //     .filter(item => item.custId !== this.multipleSelection[0].custId)
      //     .forEach(row => {
      //       this.$refs.todoTaskMultiple.toggleRowSelection(row, false);
      //       this.multipleSelection = this.multipleSelection.filter(
      //         item => item.mailTodoId !== row.mailTodoId
      //       );
      //     });
      // }
      // if (
      //   [...new Set(this.multipleSelection.map(item => item.caseTypeId))]
      //     .length >= 2
      // ) {
      //   this.$message.error("您必须选择同一案件类型案件");
      //   this.multipleSelection
      //     .filter(item => item.caseType !== this.multipleSelection[0].caseType)
      //     .forEach(row => {
      //       this.$refs.todoTaskMultiple.toggleRowSelection(row, false);
      //       this.multipleSelection = this.multipleSelection.filter(
      //         item => item.mailTodoId !== row.mailTodoId
      //       );
      //     });
      // }
      // if (
      //   [...new Set(this.multipleSelection.map(item => item.appCnName))]
      //     .length >= 2
      // ) {
      //   this.$message.error("您必须选择同一申请人的案件");
      //   this.multipleSelection
      //     .filter(
      //       item => item.appCnName !== this.multipleSelection[0].appCnName
      //     )
      //     .forEach(row => {
      //       this.$refs.todoTaskMultiple.toggleRowSelection(row, false);
      //       this.multipleSelection = this.multipleSelection.filter(
      //         item => item.mailTodoId !== row.mailTodoId
      //       );
      //     });
      // }
      // if (
      //   [...new Set(this.multipleSelection.map(item => item.mailTypeId))]
      //     .length >= 2
      // ) {
      //   this.$message.error("您必须选择同一邮件类型案件");
      //   this.multipleSelection
      //     .filter(
      //       item => item.mailTypeId !== this.multipleSelection[0].mailTypeId
      //     )
      //     .forEach(row => {
      //       this.$refs.todoTaskMultiple.toggleRowSelection(row, false);
      //       this.multipleSelection = this.multipleSelection.filter(
      //         item => item.mailTodoId !== row.mailTodoId
      //       );
      //     });
      // }
      if (!val.length) {
        this.mailList.forEach(row => {
          this.multipleSelection = this.multipleSelection.filter(
            item => item.mailTodoId !== row.mailTodoId
          );
        });
      }
    },
    handleSelectionChange(val, row) {
      val = val.filter(item => item != undefined);
      this.multipleSelection = this.unique(
        this.multipleSelection.concat(val),
        "mailTodoId"
      );
      // if (
      //   [...new Set(this.multipleSelection.map(item => item.custId))].length >=
      //   2
      // ) {
      //   this.$message.error("您必须选择同一客户下的案件");
      //   this.$refs.todoTaskMultiple.toggleRowSelection(row, false);
      //   this.multipleSelection = this.multipleSelection.filter(
      //     item => item.mailTodoId !== row.mailTodoId
      //   );
      // }
      // if (
      //   [...new Set(this.multipleSelection.map(item => item.caseTypeId))]
      //     .length >= 2
      // ) {
      //   this.$message.error("您必须选择同一案件类型案件");
      //   this.$refs.todoTaskMultiple.toggleRowSelection(row, false);
      //   this.multipleSelection = this.multipleSelection.filter(
      //     item => item.mailTodoId !== row.mailTodoId
      //   );
      // }
      // if (
      //   [...new Set(this.multipleSelection.map(item => item.appCnName))]
      //     .length >= 2
      // ) {
      //   this.$message.error("您必须选择同一申请人的案件");
      //   this.$refs.todoTaskMultiple.toggleRowSelection(row, false);
      //   this.multipleSelection = this.multipleSelection.filter(
      //     item => item.mailTodoId !== row.mailTodoId
      //   );
      // }
      // if (
      //   [...new Set(this.multipleSelection.map(item => item.mailTypeId))]
      //     .length >= 2
      // ) {
      //   this.$message.error("您必须选择同一邮件类型的案件");
      //   this.$refs.todoTaskMultiple.toggleRowSelection(row, false);
      //   this.multipleSelection = this.multipleSelection.filter(
      //     item => item.mailTodoId !== row.mailTodoId
      //   );
      // }
      if (!val.find(item => item.mailTodoId === row.mailTodoId)) {
        this.multipleSelection = this.multipleSelection.filter(
          item => item.mailTodoId !== row.mailTodoId
        );
      }
    },
    unique(data, key) {
      const hash = {};
      const data2 = data.reduce((preVal, curVal) => {
        hash[curVal[key]]
          ? ""
          : (hash[curVal[key]] = true && preVal.push(curVal));
        return preVal;
      }, []);
      return data2;
    }
  },
  watch:{
    mailFlag(n,o){
      if(n){
        this.queryMailList();
        this.$store.commit('caseInformation/SET_MAILFLAG',false)
      }
    }
  },
  computed: {
    mailFlag(){
      return this.$store.state.caseInformation.mailFlag
    },
    clientHeight() {
      return document.documentElement.clientHeight - 400;
    }
  },
  components: {
    Pagination
  }
};
</script>

<style lang="scss" scoped>
/*.el-form{*/
/*position: relative;*/
/*display: flex;*/
/*flex-wrap: wrap;*/
/*justify-content: flex-start;*/
/*margin-bottom: 20px;*/
/*.el-wrap{*/
/*display: flex;*/
/*width: 90%;*/
/*// width: calc(100% - 18px - 90px);*/
/*.el-form-item{*/
/*width: 33%;*/
/*display: flex;*/
/*flex: 1;*/
/*/deep/ .el-form-item__content{*/
/*margin-left: 0 !important;*/
/*padding-left: 10px;*/
/*background: #fff;*/
/*display: flex;*/
/*input{*/
/*width: 315px;*/
/*height: 32px;*/
/*}*/
/*.el-date-editor.el-input, .el-date-editor.el-input__inner{*/
/*width: 315px;*/
/*}*/
/*}*/
/*}*/
/*.twoInputWarp{*/
/*/deep/ .el-form-item__content{*/
/*input{*/
/*width: 150px;*/
/*height: 32px;*/
/*}*/
/*.el-date-editor.el-input, .el-date-editor.el-input__inner{*/
/*width: 150px;*/
/*}*/
/*}*/
/*}*/
/*}*/
/*}*/
.el-form {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  margin-bottom: 20px;
  padding-right: 120px;
  .el-form-item {
    width: 33%;
    height: 28px;
    line-height: 28px;
    /deep/ .el-form-item__label {
      line-height: 28px;
      height: 28px;
    }
    /deep/ .el-input {
      line-height: 28px;
      height: 28px;
    }
    /deep/ .el-input__icon {
      line-height: 28px !important;
      height: 28px;
    }
    /deep/ .el-input__inner {
      line-height: 28px;
      height: 28px;
    }
    /deep/ .el-form-item__content {
      display: flex;
      align-items: center;
      height: 100%;
      .el-cascader {
        width: 100%;
      }
      .el-select {
        width: 100%;
      }
    }
  }
}
.buttonWrap {
  position: absolute;
  left: 50%;
  bottom: -20px;
  transform: translateX(-50%);
}
.el-table {
  /deep/ th {
    padding: 5px 0;
  }
  /deep/ td {
    padding: 0;
  }
}
.el-table {
  width: auto;
  /deep/ tr:nth-of-type(1) {
    th {
      background: rgba(242, 242, 242, 1);
    }
  }
}
.clearButton {
  position: absolute;
  right: 18px;
  top: 0;
  background: #fff;
  color: RGBA(254, 153, 23, 1);
  border: 0;
  /deep/ span {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  img {
    width: 20px;
    margin-right: 8px;
    vertical-align: middle;
  }
}
.el-table /deep/ .cell {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: start;
  -ms-flex-pack: start;
  justify-content: flex-start!important;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  position: relative;
  margin-right: 10px;
  white-space: nowrap;
}
>>>.el-table-column--selection {
  .cell {
    display: inline-block;
  }
}
  >>> .el-select__tags {
    height: 25px;
    overflow: auto;
  }
</style>
