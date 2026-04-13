<template>
  <div id="outBox" style="width: 100%;height: 100%;" @click="clickClose">

    <div v-if="sign == 'createQing' || sign =='editQing' || sign == 'viewQing'"
         style="width: 90%;margin: 0 auto;margin-top: 0%;">
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
    name: "qingDialog",
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
        postForm: {},
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
      // this.queryFilterConfig(1)
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
            yearNo: '',
            chargeItemId: item.chargeItemId,
            payAmount: item.amountBill,
            invoiceNo: '',
            payDate: this.$commonUtils.getDay(0, '-'),
            billNo: '',
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
      clickClose(e) {
        e.target.id == 'outBox' || e.target.id == 'queryButton' ? this.drawerState = false : '';
      },
      queryRecordList(queryModuleData) {
        queryModuleData.listQuery ? this.listQuery = queryModuleData.listQuery : (this.queryModuleData = queryModuleData, this.listQuery.pageNo = 1);

        queryOfficialBillRecordList({
          payListType: 1826,
          ...this.queryModuleData,
        }).then(res => {
          this.childDataList = res.data
          this.total = res.total
        })
      },
      clearSearch() {
        for (var key in this.queryModuleData) {
          if (!['officialInformScreen', 'myCase', 'instructionSubmitStatus'].includes(key)) {
            if (key.includes('Date')) {
              this.$set(this.queryModuleData, key, ['', ''])
            } else if (key.includes('Array')) {
              this.$set(this.queryModuleData, key, [])
            } else if (key === 'caseTypeIds' || key === 'deptGroupIds') {
              this.$set(this.queryModuleData, key, [])
            } else {
              this.$set(this.queryModuleData, key, null)
            }
          }
        }
        if (this.$refs.multiCascader) {
          this.$refs.multiCascader.forEach(item => {
            item.$el.querySelector('.el-input__inner').value = ''
          })
        }
      },
      queryFilter() {
        this.transferVisible = true;
        const data = {
          bussId: this.bussId
        };
        queryFilter(data).then(res => {
          if (res.success) {
            this.transferData = this.generateData(res.data);
          }
        });
      },
      generateData(arr) {
        arr.forEach(item => {
          item.key = item.filterId;
          item.label = item.filterName;
        });
        return arr;
      },
      configFilter() {
        const data = {
          bussId: this.bussId,
          filterIds: this.transferValue.join(",")
        };
        configFilter(data).then(res => {
          this.queryFilterConfig();
        });
      },
      defaultQuerySearch() {
        this.queryModuleData = JSON.parse(localStorage.getItem('queryModuleData')) ? JSON.parse(localStorage.getItem('queryModuleData')).find(item => item.name == this.$options.name) ? JSON.parse(localStorage.getItem('queryModuleData')).find(item => item.name == this.$options.name).queryModuleData : {} : {}
      },
      queryFilterConfig(type) {
        const data = {
          bussId: this.bussId
        };
        this.conditionsModuleList = []
        queryFilterConfig(data).then(res => {
          this.transferVisible = false;
          this.$nextTick(() => {
            this.conditionsModuleList = res.data;
            let keyList = res.data.map(item => item.property)
            for (var key in this.queryModuleData) {
              if (!keyList.includes(key)) {
                if (key.includes('Date')) {
                  this.$set(this.queryModuleData, key, ['', ''])
                } else if (key.includes('Array')) {
                  this.$set(this.queryModuleData, key, [])
                } else {
                  this.$set(this.queryModuleData, key, null)
                }
              }
            }
            this.defaultQuerySearch()
            if (type == 1) {
              this.queryRecordList()
            }
            res.data.forEach(item => {
              if (item.filterType.includes("Many")) {
                if (this.queryModuleData[item.property]) {
                  if (item.filterType.includes('Many')) {
                    if (["被申请人", "转让人"].includes(item.filterName)) {
                      // queryAllUrl({ appId:this.queryModuleData[item.property]}).then(res=>{
                      //   this.$set(item,'valueList', res.data.map(i => ({
                      //     id: i.applicantName,
                      //     value: i.applicantName,
                      //     value1: i.applicantEnName,
                      //     value2: i.applicantAddress,
                      //     value3: i.applicantEnAddress
                      //   })))
                      // })
                    } else if (item.filterName == '申请人姓名') {
                      // console.log(this.queryModuleData[item.property]);
                      // Promise.all( this.queryModuleData[item.property].map(itm=>queryAllUrl({appId:itm}))).then(res=>{
                      //   this.$set(item,'valueList', this.$commonUtils.getLanglist(res.map(i=>i.data)).map(i => ({
                      //     id: i.applicantName,
                      //     value: i.applicantName,
                      //     value1: i.applicantEnName,
                      //     value2: i.applicantAddress,
                      //     value3: i.applicantEnAddress
                      //   })))
                      //   // this.$set(item,'valueList', this.$commonUtils.getLanglist(res.map(i=>i.data)).map(i => ({ id: i.custId, value: i.name })))
                      // })
                    } else if (item.filterName == '客户') {
                      if (this.queryModuleData[item.property].length) {
                        queryCustomerNameId({custIdArray: this.queryModuleData[item.property]}).then(res => {
                          this.$set(item, 'valueList', res.data.map(i => ({id: i.custId, value: i.name})))
                        })
                      }
                    } else {
                      if (item.values) {
                        item.valueList = item.values.filter(i => i.id == this.queryModuleData[item.property])
                      }
                    }
                    // if(item.property.includes('Array')){
                    //   //this.queryModuleData[item.property]=this.queryModuleData[item.property].map(itm=>Number(itm))
                    // }else {
                    //  // this.queryModuleData[item.property]=Number(this.queryModuleData[item.property])
                    // }
                  }
                } else {
                  item.valueList = []
                }
              }
              if (item.filterType.includes("checkbox")) {
                if (this.queryModuleData[item.property] && this.queryModuleData[item.property].length) {
                  this.$set(this.queryModuleData, item.property, this.queryModuleData[item.property]);
                } else {
                  this.$set(this.queryModuleData, item.property, []);
                }
              }
            });
            this.transferValue = res.data.map(item => item.filterId);
            if (this.$route.query.custId) {
              if (!this.transferValue.find(item => item == 58)) {
                this.$set(this.transferValue, this.transferValue.length - 1, 58);
                this.configFilter();
              } else {
                this.remoteMethod(
                  this.$route.query.name,
                  this.transferValue.indexOf(58),
                  "",
                  "客户"
                );
              }
            }
          });
        })
      },
      addFilterScheme(e) {
        if (e == 1) {
          this.addFilterState = true
        } else if (e == 2) {
          if (!this.schemeName || !this.schemeName.trim()) {
            this.$message.error('请输入过滤器名称')
            return
          }
          const data = {
            schemeName: this.schemeName,
            bussId: this.bussId,
            value: JSON.stringify(this.queryModuleData)
          }
          addFilterScheme(data).then(res => {
            this.addFilterState = false
          })
        }
      },
      clickoutside() {
        // alert(1)
        this.drawerState = false
      },
      handleSearch(flag) {
        // this.operationState = flag
        this.drawerState = false
        // this.selectionState = false;
        this.queryRecordList();
        // if (JSON.parse(localStorage.getItem('queryModuleData'))) {
        //   var arr = JSON.parse(localStorage.getItem('queryModuleData'))
        // } else {
        //   var arr = []
        // }
        // if (arr.find(item => item.name == this.$options.name)) {
        //   arr.find(item => item.name == this.$options.name).queryModuleData = this.queryModuleData
        // } else {
        //   arr.push({name: this.$options.name, queryModuleData: this.queryModuleData})
        // }
        // localStorage.setItem('queryModuleData', JSON.stringify(arr))
      },
      remoteMethod(value, index, property, filterName) {
        if (value && filterName === "客户") {
          queryCustomerNameId({pageNo: 1, pageSize: 100, keyword: value}).then(
            res => {
              this.$set(
                this.conditionsModuleList[index],
                "valueList",
                res.data.map(item => ({id: item.custId, value: item.name}))
              );
              this.$forceUpdate();
            }
          );
        }
        if (value && filterName == '缴费类型') {
          querycustSelectClass({classId: 1149}).then(res => {
            this.$set(
              this.conditionsModuleList[index],
              "valueList",
              res.data["1149"]
            );
            this.$forceUpdate();
            // this.payTypeList = res.data["1149"]
          });
        }
        if (value && ["申请人", "被申请人", "转让人"].includes(filterName)) {
          queryAllUrl({
            applicantName: value,
            pageNo: 1,
            pageSize: 100,
            orderBy: 1
          }).then(res => {
            this.$set(
              this.conditionsModuleList[index],
              "valueList",
              res.data.map(item => ({
                id: item.appId,
                value: item.applicantName,
                value1: item.applicantEnName,
                value2: item.applicantAddress,
                value3: item.applicantEnAddress
              }))
            );
            this.$forceUpdate();
          });
        }
        if (
          value &&
          filterName !== "客户" &&
          !["申请人", "被申请人", "转让人"].includes(filterName)
        ) {
          this.$set(
            this.conditionsModuleList[index],
            "valueList",
            this.conditionsModuleList[index].values
              .filter(item =>
                item.value
                  ? item.value
                    .toLocaleUpperCase()
                    .includes(value.toLocaleUpperCase())
                  : false
              )
              .slice(0, 100)
          );
          this.$forceUpdate();
        }
      },
      changeTextRange(value, property) {
        this.$set(this.queryModuleData, property, value);
        // if(property=='agentNumEnd'){
        //   this.handleSearch(1)
        // }
      },
      getAppTitleList(filterName, valueList0) {
        if (filterName === "申请人") {
          return {
            id: "-1",
            value: "申请人中文名称",
            value1: "申请人英文名称",
            value2: "申请人中文地址",
            value3: "申请人英文地址",
            // disabled:true
          };
        }
        if (filterName === "申请人姓名") {
          return {
            id: "-1",
            value: "申请人中文名称",
            value1: "申请人英文名称",
            value2: "申请人中文地址",
            value3: "申请人英文地址"
          };
        }
        if (filterName === "被申请人") {
          return {
            id: "-1",
            value: "被申请人中文名称",
            value1: "被申请人英文名称",
            value2: "被申请人中文地址",
            value3: "被申请人英文地址"
          };
        }
        if (filterName === "转让人") {
          return {
            id: "-1",
            value: "转让人中文名称",
            value1: "转让人英文名称",
            value2: "转让人中文地址",
            value3: "转让人英文地址"
          };
        }
        if (filterName === "客户") {
          return {
            id: "-1",
            value: "简称",
            value1: "国籍",
            value2: "全称",
          };

        }
        return valueList0;
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
