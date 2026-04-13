<template>
  <div id="outBox" style="width: 100%;height: 100%;">
    <div style="width: 100%;height: 32px; display: flex;justify-content: center;margin-bottom: 20px" id="queryButton">
      <headerSearch ref="headersearch" v-if="sign == 'createCao'" :name="$options.name" @search="queryRecordList" :bussId="43"></headerSearch>
      <el-button v-if="sign == 'createCao'" size="mini" type="primary" @click="addCao" style="margin-left: 10px">导入
      </el-button>
    </div>
    <div v-if="sign == 'createCao'" style="width: 100%;height: 100%;">
      <right-table ref="rightTable" :total="total" :sign="sign" :tableHeight="500" type="草单" :childDataList="childDataList"
                   @search="queryRecordList"></right-table>
    </div>

    <div v-if="sign == 'createQing' || sign =='editQing' || sign == 'viewQing'"
         style="width: 90%;margin: 0 auto;margin-top: 3%;">
      <el-form ref="postForm" :model="postForm" size="small" class="form-container">
        <el-row class="first-row">
          <el-col :span="12">
            <el-form-item label="清单编号:" prop="" class="postInfo-container-item">
              <el-input v-if="sign == 'editQing'" size="mini" v-model="postForm.payListNo"></el-input>
              <el-input v-else-if="sign == 'createQing'" disabled></el-input>
              <span v-else>{{postForm.payListNo}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="缴费类型:" prop="" class="postInfo-container-item">
              <span v-if="sign == 'viewQing'">{{postForm.payListTypeStr}}</span>
              <el-select v-else clearable v-model="postForm.payListType">
                <el-option v-for="item in payTypeList" :label="item.typeName" :key="item.id"
                           :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="">
          <el-col :span="12">
            <el-form-item label="缴费方式:" prop="" class="postInfo-container-item">
              <span v-if="sign == 'viewQing'">{{postForm.payMethodStr}}</span>
              <el-select v-else clearable v-model="postForm.payMethod">
                <el-option v-for="item in payMethodList" :label="item.typeName" :key="item.id"
                           :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="收据抬头:" prop="" class="postInfo-container-item">
              <span v-if="sign == 'viewQing'">{{postForm.receiptTitleStr}}</span>
              <el-select v-else clearable v-model="postForm.receiptTitle">
                <el-option v-for="item in receiptTitleList" :label="item.typeName" :key="item.id"
                           :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="">
          <el-col :span="12">
            <el-form-item label="缴费日期:" prop="" class="postInfo-container-item">
              <span v-if="sign == 'viewQing'">{{postForm.payDate}}</span>
              <el-date-picker
                v-else
                v-model="postForm.payDate"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="" prop="" class="postInfo-container-item">
<!--              <span v-if="sign == 'viewQing'">{{postForm.ofeeDeadline}}</span>-->
<!--              <el-date-picker-->
<!--                v-else-->
<!--                v-model="postForm.ofeeDeadline"-->
<!--                type="date"-->
<!--                placeholder="选择日期"-->
<!--                value-format="yyyy-MM-dd">-->
<!--              </el-date-picker>-->
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="">
          <el-col :span="12">
            <el-form-item label="制作日期:" prop="" class="postInfo-container-item">
              <span v-if="sign == 'viewQing'">{{postForm.createDate}}</span>
              <el-date-picker
                v-else
                v-model="postForm.createDate"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="制作人:" prop="" class="postInfo-container-item">
              <span v-if="sign == 'viewQing'">{{postForm.createUserIdStr}}</span>
              <el-select v-else :disabled="true" v-model="postForm.createUserId" filterable>
                <el-option v-for="(item,key) in $store.getters.userList" :key="key"
                           :label="item.fullname" :value="item.userId">
                  <!--                  <UserIconAndUserName :user-id="item.userId"></UserIconAndUserName>-->
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="">
          <el-col :span="12">
            <el-form-item label="登记日期:" prop="" class="postInfo-container-item">
              <span v-if="sign == 'viewQing'">{{postForm.regDate}}</span>
              <el-date-picker
                v-else
                v-model="postForm.regDate"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="登记人:" prop="" class="postInfo-container-item">
              <span v-if="sign == 'viewQing'">{{postForm.regUserIdStr}}</span>
              <el-select v-else clearable v-model="postForm.regUserId" filterable>
                <el-option v-for="(item,key) in $store.getters.userList" :key="key"
                           :label="item.fullname" :value="item.userId">
                  <!--                  <UserIconAndUserName :user-id="item.userId"></UserIconAndUserName>-->
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="fl-ac-jc" style="margin-top: 20px">
        <el-button v-if="sign == 'createQing'" size="mini" type="primary" @click="createPatentPayList">创建</el-button>
        <el-button v-if="sign == 'editQing'" size="mini" type="primary" @click="modifyPatentPayList">修改</el-button>
        <el-button size="mini" type="primary" @click="()=>{$emit('close')}">取消</el-button>
      </div>
    </div>


  </div>
</template>

<script>
  import {querycustSelectClass} from "@/api/customerList.js";
  import {queryOfficialBillRecordList, createPatentPayList, getPayListNo, modifyPatentPayList} from '@/api/billApi';
  import {queryAllUrl} from "@/api/applicant";
  import {
    addFilterScheme,
    delCase,
    selectColumn,
    savePreference,
    queryCaseList,
    queryPreference,
    delPreference,
    queryFilter,
    configFilter,
    queryFilterConfig,
    submitOfficalAudit,
    auditOfficalDoc,
    deleteCase,
    deleteDoc,
    deleteIns,
    queryCustomerNameId,
    getManualRecognitionOfficialInfoCount,
    recognizedError,
    getCaseByTmFileId,
    submitOfficalModify,
    queryCorrelationCaseList, copyCase, queryCaseWork,
    updateWkg,
    queryList,
    queryTrademarkCaseOfficial,
    downloadMaterial,
    queryDocs
  } from "@/api/caseList.js";


  import headerSearch from '@/components/HeaderSearch';
  import rightTable from "../../../customer_management/business_pportunity/components/rightTable";
  import Pagination from "@/components/Pagination";


  export default {
    name: "create_patentFee",
    components: {
      rightTable,
      headerSearch,
      Pagination
    },
    props: {
      sign: {
        default: ''
      }, // createQing => 新建清单 | editQing => 修改清单 | createCao => 导入草单
      payListType: '',
      editData: {}
    },
    watch: {
      sign: {
        handler(n) {
          (n == 'createQing' || n == 'editQing') && this.querycustSelectClass();
          n == 'createQing' && (this.postForm = {
            createUserId: this.$store.getters.userId,
            payDate: this.$commonUtils.getDay(0, '-'),
            createDate: this.$commonUtils.getDay(0, '-'),
            payMethod: 1847,
            receiptTitle: 1838
          });
          (n == 'editQing' || n == 'viewQing') ? this.postForm = this.editData : '';
        },
        immediate: true
      },
      'postForm.payDate': {
        handler(n) {
          if (this.sign == 'editQing' && this.postForm.payDetails && this.postForm.payDetails.length) {
            this.postForm.payDetails.forEach(item => {
              item.payDate = n
            })
          }
        },
        immediate: true
      }
    },
    data() {
      return {
        postForm: {

        },
        total: 0,
        pageSizesList: [10, 50, 100, 200, 300, 400, 500],
        childDataList: [],
        bussId: 43,
        addFilterState: false,
        drawerState: false,
        schemeName: '',
        agentNums: '',
        listQuery: {
          pageNo: 1,
          pageSize: 10
        },
        queryModuleData: {},
        checkboxState: false, // 表头筛选框状态
        transferVisible: false, // 配置筛选条件框
        transferData: [], // 筛选条件数据
        transferValue: [], // 当前筛选条件id
        caseList: [], // 当前列表数据
        checkCaseList: [], // 当前选中表头条件
        selectColumnList: [], // 配置表头总列数据做循环用
        preferenceList: [], // 循环表头数据
        filterData: {}, // 表头过滤数据
        conditionsModuleList: [], // 渲染筛选条件
        caseListDefault: [], // 案件默认全部列表
        checkFilterList: [], // 控制筛选漏斗状态
        firstRequest: false, //第一次请求
        payTypeList: [],
        payMethodList: [],
        receiptTitleList: [],
      }
    },
    created() {
      this.defaultQuerySearch()
    },
    methods: {
      addCao() {
        if (this.$refs.rightTable && this.$refs.rightTable.getSelectedRows().length) {
          let data = this.$refs.rightTable.getSelectedRows().map(item => ({
            appNumber: item.appNumber,
            caseCnName: item.caseCnName,
            caseId: item.caseId,
            billRecordId: item.billRecordId,
            agentNum: item.agentNum,
            nameCn: item.descriptionCn,
            yearNo: item.yearNo,
            chargeItemId: item.chargeItemId,
            payAmount: item.amountBill,
            invoiceNo: '',
            payDate: this.$commonUtils.getDay(0, '-'),
            billNo: '',
            custName: item.custName,
            applicantName: item.applicantName
          }))
          this.$emit('daoRuCao', data)
        } else {
          this.$message.error('请先选择')
        }
      },
      clearData() {
        this.postForm = {createUserId: this.$store.getters.userId}
      },
      getPayListNo() {
        getPayListNo({payListType: this.payListType || 1826}).then(res => {

          // this.postForm.payListNo = res.data.payListNo
          this.$set(this.postForm, 'payListNo', res.data.payListNo)
        })
      },
      modifyPatentPayList() {
        modifyPatentPayList({...this.postForm}).then(res => {
          this.$message.success('修改成功！')
          this.$emit('search', this.queryModuleData)
          this.clearData()
        })
      },
      createPatentPayList() {
        createPatentPayList({...this.postForm}).then(res => {
          this.$message.success('创建成功！')
          this.$emit('search', this.queryModuleData)
          this.clearData()
        })
      },
      querycustSelectClass() {
        querycustSelectClass({classId: '1149,1151,1152'}).then(res => {
          this.payTypeList = res.data["1149"];
          this.payMethodList = res.data["1151"];
          this.receiptTitleList = res.data["1152"]
        });
      },
      queryRecordList(flag) {
        // queryModuleData.listQuery ? this.listQuery = queryModuleData.listQuery : (this.queryModuleData = queryModuleData, this.listQuery.pageNo = 1);
        flag === 1 && (this.listQuery.pageNo = 1)
        flag && flag !== 1 && (this.listQuery = flag.listQuery)
        // !queryModuleData.page ? (this.queryModuleData = queryModuleData, this.listQuery.pageNo = 1) : ''
        this.queryModuleData = JSON.parse(localStorage.getItem('queryModuleData'))
          && JSON.parse(localStorage.getItem('queryModuleData')).find(item => item.name == this.$options.name)
          && JSON.parse(localStorage.getItem('queryModuleData')).find(item => item.name == this.$options.name).queryModuleData
          || {}
        queryOfficialBillRecordList({
          payListType: 1826,
          ...this.queryModuleData,
          ...this.listQuery
        }).then(res => {
          this.childDataList = res.data
          this.total = res.total
        })
      },
      defaultQuerySearch() {
        this.queryModuleData = JSON.parse(localStorage.getItem('queryModuleData')) ? JSON.parse(localStorage.getItem('queryModuleData')).find(item => item.name == this.$options.name) ? JSON.parse(localStorage.getItem('queryModuleData')).find(item => item.name == this.$options.name).queryModuleData : {} : {}
      },
    }
  }
</script>

<!--<style lang="scss" scoped>-->
<!--  .queryButton {-->
<!--    display: flex;-->
<!--    flex-wrap: nowrap;-->
<!--    position: relative;-->
<!--    justify-content: center;-->

<!--    .buttonWrap_small {-->
<!--      display: flex;-->
<!--      margin: 5px 5px;-->
<!--      align-items: center;-->

<!--      .el-button {-->
<!--        margin-left: 10px;-->
<!--      }-->
<!--    }-->
<!--  }-->

<!--</style>-->
<style lang="scss" scoped>

  .form-container {
    .el-form-item__error {
      position: relative !important;
      top: 0;
    }

    /deep/ .el-row {
      margin: 0px;
      display: flex; /*解决账单查看表单样式被撑开*/
    }

    /deep/ .postInfo-container-item {
      height: 100%;
      width: 100%;
    }

    /deep/ .el-form-item__label {
      background-color: #f9f9f9;
      width: 36.7%;
      text-align: right;
    }

    /deep/ .el-form-item {
      border-right: 1px solid #d7d7d7;
      margin: 0px !important;
    }

    .first-row {
      /*>>>.el-row {*/
      border-top: 1px solid #d7d7d7;
      /*}*/
    }

    /deep/ .el-row {
      border-bottom: 1px solid #d7d7d7;
      border-left: 1px solid #d7d7d7;
    }

    /deep/ .el-input,
    /deep/ .el-select {
      width: 77%;
    }

    /deep/ td .el-input,
    /deep/ td .el-select {
      width: 100%;
    }

    /deep/ .el-form-item__content {
      text-align: left;
      word-break: break-word;
      // height: 30px;
    }

    .fullRow {
      /deep/ .el-form-item__label {
        width: 15%;
      }

      /deep/ .el-input,
      /deep/ .el-select {
        width: 30%;
      }
    }

    /deep/ .el-input__inner {
      // border: none;
    }

    /deep/ .el-select .el-input {
      width: 100%;
    }

    /deep/ td .el-select,
    /deep/ td .el-input,
    /deep/ td .el-input__inner {
      // border: 0px !important;
    }

    .postInfo-container-item {
      display: flex;
      width: 100%;

      /deep/ .el-form-item__content {
        text-align: left;
        display: inline-table;
        width: 85%;
        padding: 0px 15px;
      }

      /deep/ .el-form-item__label {
        line-height: 28px;
      }
    }
  }
</style>
