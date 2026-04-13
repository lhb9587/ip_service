<template>
  <div>
  <div class="app-container" v-show="offBillVisible">
    <header class='y-header'>{{$route.meta.title}}</header>
    <div class="filter-container" style="margin-bottom:15px">
      <el-form :inline="true" :model="listQuery" size="small" class="demo-form-inline">
        <el-row class="searchfullRow">
          <el-col v-if="searchbool" :span="11" class="searchcol">

            <el-form-item label="案件文号">
              <div style="display: flex" v-if="!$route.query.agentNum">
                <GetCase style="flex: 1" v-model="agentNums" ></GetCase>

<!--              <el-input-->
<!--                type="textarea"-->
<!--                :autosize="{ minRows: 5, maxRows: 5}"-->
<!--                placeholder="请输入案件文号"-->
<!--                v-model="agentNums"-->
<!--                @keyup.enter.native="getCase"-->
<!--              >-->
<!--              </el-input>-->
<!--              <el-input @keyup.enter.native="getList('search')" v-model="listQuery.agentNum" placeholder=""></el-input>-->
                <div style="margin-left: 20px">
                  <el-button class="filter-item" type="primary" @click="getCase" size="small">
                    确定
                  </el-button>
                </div>
              </div>
              <div style="display: flex" v-if="$route.query.agentNum">
               {{$route.query.agentNum}}
              </div>
            </el-form-item>

            <!-- <el-form-item label="客户">
              <el-select default-first-option :clearable='true' v-model="listQuery.custId" no-match-text='暂无数据' loading-text='正在查询' filterable remote reserve-keyword placeholder="请输入关键词"
                :remote-method="remotepaternalUnit">
                <el-option v-for="item in seletData.custnames" :key="item.custId" :label="item.fullname" :value="item.custId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="提交人">
              <el-select default-first-option :clearable='true' v-model="listQuery.createUserId" no-match-text='暂无数据' loading-text='正在查询' filterable remote reserve-keyword placeholder="请输入关键词"
                :remote-method="remotepaternalUnit">
                <el-option v-for="(item,key) in seletData.usernames" :key="key" :label="item.fullname" :value="item.userId">
                </el-option>
              </el-select>
            </el-form-item> -->

          </el-col>
          <el-col v-else :span="11" class="searchcol">
            <el-form-item label="案件文号">

              <span>{{searchCaseidTitle}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="11" v-if="billType == 'bill'">
            <el-form-item label="是否一个案件开具一张账单:">
              <el-radio-group v-model="fenkai" style="margin-left: 10px">
                <el-radio :label='1'>是</el-radio>
                <el-radio :label='0'>否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <!-- <el-col :span="12" class="searchcol">
            <el-form-item label="案件类型">

              <el-cascader ref="caseTypecascader" :clearable='true' filterable v-model="listQuery.caseTypeId" :show-all-levels="false" :options="caseTypeOptions" :props="defaultParams"
                placeholder="请选择">
              </el-cascader>
            </el-form-item>

            <el-form-item label="申请人">
              <el-select default-first-option :clearable='true' v-model="listQuery.appId" no-match-text='暂无数据' loading-text='正在查询' filterable remote reserve-keyword placeholder="请输入关键词"
                :remote-method="remotepaternalUnitapp">
                <el-option v-for="(item,key) in seletData.apps" :key="key" :label="item.applicantName" :value="item.appId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="立卷日期" class="dateSlect">
              <el-date-picker v-model="fwDatevalue" type="daterange" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
              </el-date-picker>

            </el-form-item>
          </el-col> -->
          <!-- <el-col v-if="searchbool" :span="2" class="searchcol">
            <el-button type="primary" class="clearButton" size="mini" @click="clearSeach"><img src="@/assets/清除@2x.png" alt=""><span>重置</span></el-button>
          </el-col> -->
        </el-row>

      </el-form>

    </div>
    <el-row>
      <el-col class="totalClass" :span="24">
        总计：{{total}}条

      </el-col>
    </el-row>
    <el-table ref="offBill" @row-dblclick="dblclick" :row-class-name="rowClassName" @selection-change="handleSelectionChange" @select="handleSelectionSingle" size="mini" :data="list" border fit empty-text="暂无数据" highlight-current-row current-row-key style="width: 100%;">
      <el-table-column type="selection" width="55" :selectable="selectable" >
      </el-table-column>
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-table :data="props.row.expandList">
            <el-table-column
              v-for="item in defaultTitleList"
              :label="item.label"
              :prop="item.prop"
              align="left"
              width
            >
              <template slot-scope="scope">
                <span>{{scope.row[item.prop]}}</span>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column type="index" width="50" label="序号" align="left"></el-table-column>
      <el-table-column label="案件文号" align="left" width sortable prop="agentNum" :filters="$commonUtils.unique(list.map(i=>({text:i['agentNum'],value:i['agentNum']})),'value').filter(ii=>ii.value)"
                                    :filter-method="filterHandler"
                                  filter-placement="bottom-start">
                <template slot-scope="scope">
                  <span>{{ scope.row.agentNum }}</span>
                </template>
              </el-table-column>
              <el-table-column label="支出类型" align="left" sortable width  prop="payType" :filters="$commonUtils.unique(list.map(i=>({text:i['payType'],value:i['payType']})),'value').filter(ii=>ii.value)"
                               :filter-method="filterHandler"
                               filter-placement="bottom-start">
                <template slot-scope="scope">
                  <span>{{ scope.row.payType }}</span>
                </template>
              </el-table-column>
              <el-table-column label="费用种类" align="left" sortable width  prop="feeKindStr" :filters="$commonUtils.unique(list.map(i=>({text:i['feeKindStr'],value:i['feeKindStr']})),'value').filter(ii=>ii.value)"
                               :filter-method="filterHandler"
                               filter-placement="bottom-start">
                <template slot-scope="scope">
                  <span>{{ scope.row.feeKindStr }}</span>
                </template>
              </el-table-column>
              <el-table-column label="费用类型" align="left" sortable width  prop="feetStr" :filters="$commonUtils.unique(list.map(i=>({text:i['feetStr'],value:i['feetStr']})),'value').filter(ii=>ii.value)"
                               :filter-method="filterHandler"
                               filter-placement="bottom-start">
                <template slot-scope="scope">
                  <span>{{ scope.row.feetStr }}</span>
                </template>
              </el-table-column>
              <el-table-column label="描述" align="left" sortable width  prop="description" :filters="$commonUtils.unique(list.map(i=>({text:i['description'],value:i['description']})),'value').filter(ii=>ii.value)"
                               :filter-method="filterHandler"
                               filter-placement="bottom-start">
                <template slot-scope="scope">
                  <span>{{ scope.row.description }}</span>
                </template>
              </el-table-column>
        <!--      <el-table-column label="数量" align="left" width>-->
<!--        <template slot-scope="scope">-->
<!--          <span>{{ scope.row.manhourBill }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column label="单价金额" align="left" width>-->
<!--        <template slot-scope="scope">-->
<!--          <span>{{ scope.row.priceBill }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column label="金额" align="left" sortable width  prop="amountBill" :filters="$commonUtils.unique(list.map(i=>({text:i['amountBill'],value:i['amountBill']})),'value').filter(ii=>ii.value)"
                       :filter-method="filterHandler"
                       filter-placement="bottom-start">
                <template slot-scope="scope">
                  <span>{{ scope.row.amountBill }}</span>
                </template>
              </el-table-column>
<!--      <el-table-column label="开单日期" align="left" width>-->
<!--        <template slot-scope="scope">-->
<!--          <span>{{ scope.row.referDate }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
        <el-table-column label="员工" align="left" width sortable prop="userName" :filters="$commonUtils.unique(list.map(i=>({text:i['userName'],value:i['userName']})),'value').filter(ii=>ii.value)"
                         :filter-method="filterHandler"
                         filter-placement="bottom-start">
          <template slot-scope="scope">
            <span>{{ scope.row.userName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="日期" align="left" width  sortable prop="createDate" :filters="$commonUtils.unique(list.map(i=>({text:i['createDate'],value:i['createDate']})),'value').filter(ii=>ii.value)"
                         :filter-method="filterHandler"
                         filter-placement="bottom-start">
          <template slot-scope="scope">
            <span>{{ scope.row.createDate }}</span>
          </template>
        </el-table-column>
              <el-table-column label="流程状态" align="left" width sortable prop="procedure" :filters="$commonUtils.unique(list.map(i=>({text:i['procedure'],value:i['procedure']})),'value').filter(ii=>ii.value)"
                               :filter-method="filterHandler"
                               filter-placement="bottom-start">
                <template slot-scope="scope">
                  <span>{{ scope.row.procedure }}</span>
                </template>
              </el-table-column>

            </el-table>
            <el-row>
              <el-col :span="24" style="text-align:right; padding-top:15px">
                <span> 数量合计：{{list?list.length:'0'}}条</span>
                <span style="margin-left:20px">总金额:</span><span class="piceSpan">￥{{selectTablepice|toFixed2}}</span>
              </el-col>
            </el-row>
            <!-- <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize"
              @pagination="getList" /> -->
    <!-- <div class="bottom-row-div">
      <el-row class="bottom-row">
        <el-col class="bottom-row-title" :span="4">提交员工</el-col>
        <el-col class="bottom-row-content" :span="20">{{name}}</el-col>
      </el-row>
      <el-row class="bottom-row">
        <el-col class="bottom-row-title" :span="4">开单日期</el-col>
        <el-col class="bottom-row-content" :span="20">{{getNowFormatDate()}}</el-col>
      </el-row>
      <el-row class="bottom-row">
        <el-col class="bottom-row-title" :span="4">核销状态</el-col>
        <el-col class="bottom-row-content" :span="20">未核销</el-col>
      </el-row>
    </div> -->
    <el-row style="margin-top:40px">
      <el-col :span="24" style="text-align:center">

        <el-button size="medium" type="primary" @click="submitBtn">下一步
        </el-button>

        <el-button style="margin-left:50px" type="" @click="cancel" size="medium">取消</el-button>

      </el-col>

    </el-row>

  </div>
  <!--    弹框创建账单-->
  <el-dialog
    v-if="createBillVisible"
    :visible.sync="createBillVisible"
    width="90%"
    top="0vh"
    :modal-append-to-body="true"
    :append-to-body="true"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="closeDialog">
    <component :createCommonBill="createCommonBill" :is="billType" :type="type" :billData="billData"  :page-bill-id="pageBillId" :is-finance="true" @cancel="closeDialog" @closeBillDialog="closeDialog"></component>
  </el-dialog>
  </div>
</template>
<script>

import {
  queryBillRecordUrl,
  queryCustomerNameIdUrl,
  querywfUserNameUrl,
  queryAllUrl,
  writeOffBillRecordUrl,
  writeOffBillRecordnbUrl,
  queryHXBillData
} from "@/api/billApi";
import { queryCaseType } from "@/api/caseList.js";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import { mapGetters } from "vuex";
import {getCase} from "@/api/feeList";
import bill from "./components/billDetail";
import insideBill from "./components/insideBillDetails";
const defaultData = {
  // pageNo: 1,
  // pageSize: 10,
  agentNum: "",
  agentNumStart: "", //（案件文号，查询使用），
  agentNumEnd: "", //（案件文号，查询使用），
  caseTypeId: [], //（案件类型ID，查询使用），
  createUserId: "",
  custId: "", //，
  caseDate: "",
  appId: "", //,（申请人Id，查询使用）
  caseDateStart: "",
  caseDateEnd: ""
};
export default {
  components: { Pagination, bill, insideBill },
  props: ['pageType'],
  computed: {
    ...mapGetters(["name", "roles", "userId"]),
    selectTablepice: function() {
      let fw_number = 0;
      if (this.allselecOffs) {
        this.allselecOffs.forEach(item => {
          fw_number += Number(item.amountBill)
        });
      }

      return fw_number;
    }
  },
  data() {
    return {
      createCommonBill: false,
      billData: {},
      type: 'creat',
      fenkai: 0,
      billType: 'bill', // bill 账单, insideBill 内部账单
      offBillVisible: true,
      createBillVisible: false,
      pageBillId: '',
      defaultTitleList:[
        {label:'案件文号',prop:'agentNum',sortable:true},
        {label:'支出类型',prop:'payType',sortable:true},
        {label:'费用种类',prop:'feeKindStr',sortable:true},
        {label:'费用类型',prop:'feetStr',sortable:true},
        {label:'描述',prop:'description',sortable:true},
        {label:'金额',prop:'amountBill',sortable:true},
        {label:'员工',prop:'userName',sortable:true},
        {label:'日期',prop:'createDate',sortable:true},
        {label:'流程状态',prop:'procedure',sortable:true}],
      fwDatevalue: [],
      defaultParams: {
        // 級聯菜單默認
        value: "caseTypeId",
        label: "caseType",
        children: "childrens",
        checkStrictly: false
      },
      searchCaseidTitle: "",
      searchbool: true,
      allselecOffs: [],
      caseTypeOptions: [], // 案件类型集合
      list: [],
      total: 0,

      listLoading: false,
      listQuery: {
        // pageNo: 1,
        // pageSize: 10,
        agentNum: "",
        agentNumStart: "", //（案件文号，查询使用），
        agentNumEnd: "", //（案件文号，查询使用），
        caseTypeId: [], //（案件类型ID，查询使用），
        createUserId: "",
        custId: "", //，
        caseDate: "",
        appId: "", //,（申请人Id，查询使用）
        caseDateStart: "",
        caseDateEnd: ""
      },

      pickerOptions: {
        // disabledDate(time) {
        //   return time.getTime() > Date.now();
        // },
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            }
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            }
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            }
          }
        ]
      },
      seletData: {
        custnames: [],
        usernames: [],
        apps: []
      },
      allcaseId: [],
      agentNums:''
    };
  },
  created() {
    this.billType = this.pageType ? this.pageType : this.$route.params.type
    if (this.$route.query.caseIdList) {
      this.searchbool = false;
      if(this.$store.state.caseInformation.caseIdList.length){
        this.listQuery.caseIds = this.$store.state.caseInformation.caseIdList
      } else {
        this.listQuery.caseIds = this.$route.query.caseIdList;
      }
      this.$store.commit('caseInformation/SET_CASEIDLIST',[])
      this.getList("search");
    } else {
      this.searchbool = true;
    }
    this.getselectdata();
    // this.getList();

    if (this.$route.query.agentNum) {
      this.listQuery.agentNum = this.$route.query.agentNum;
      this.getList("search");
    }
  },
  watch: {},
  methods: {
    dblclick(row){
      if(row.feetId){
        window.open( this.$router.resolve(`/workbench/finance/seeFeeDetail?feeId=${row.screenId}`).href, '_blank');
      }
    },
    selectable(row){
      if(row.taskNo>=4){
        return true
      }else {
        return  false
      }
    },
    filterHandler(value, row, column) {
      const property = column['property'];
      return row[property] === value;
    },
    rowClassName({row, rowIndex}){
      if(row.expandList.length==1){
        return 'noExpand'
      }
    },
    getCase(){
      getCase({agentNums:this.agentNums}).then(res=>{
        this.listQuery.caseIds=res.data.map(item=>item.caseId)
        this.getList()
      })
    },
    getList(type) {
      // if (type == "search") {
      //   this.listQuery.pageNo = "1";
      // }

      this.listLoading = true;
      if(this.billType == 'insideBill'){
        this.listQuery.isBillInternal=1
      }
      queryHXBillData(this.listQuery).then(response => {
        this.list = this.formatList(response.data.HXBillModelArray);
        this.allcaseId = response.data.caseIds;
        this.searchCaseidTitle = response.data.agentNumString;
        this.total = this.list.length // response.total;
        this.listLoading = false;
        if (response.data == "-2") {
          this.$message.error(response.message);
        }
      });
    },
    formatList(list){
      return list.reduce((pre,next)=>{
        if(!pre.screenId[next.screenId]){
          pre.screenId[next.screenId]=true
          next['expandList']=[JSON.parse(JSON.stringify(next))]
          pre.list.push(next)
        }else {
          let data=pre.list.find(item=>item.screenId==next.screenId)
          data['expandList'].push(next)
          data.amountBill=data['expandList'].reduce((p,n)=>p+n.amountBill,0).toFixed(2)
        }
        return pre
      },{screenId:{},list:[]}).list
    },
    handleSelectionChange(val) {
      this.allselecOffs = val;
    },
    handleSelectionSingle(val, row){
      if (!val.find(item => item.id === row.id)) {
        this.list.forEach(item=>{
          if(item.screenId==row.screenId){
            this.$refs.offBill.toggleRowSelection(item,false)
          }
        })
      } else {
        this.list.forEach(item=>{
          if(item.screenId==row.screenId){

            this.$refs.offBill.toggleRowSelection(item,true)
          }
        })
      }
    },
    submitBtn() {
      if(this.$store.state.user.name=='管理员'){
        this.$message.error('管理员无法创建账单')
        return
      }
      // this.$router.push("/workbench/finance/creatBill/4996045/creat");
      const type = this.billType;
      if (type == "bill") {
        // this.allselecOffs=this.allselecOffs.filter(item=>!!item.amount)
        writeOffBillRecordUrl({
          hXBillModelArray: this.allselecOffs.reduce((pre,next)=>[...pre,...next.expandList],[]),
          caseIds: this.allcaseId,
          checkCase: 1,
          fenkai: this.fenkai
        }).then(res=>{
          if(res.message.includes('案件已闭卷')){
            this.$confirm(res.message, "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }).then(()=>{
                writeOffBillRecordUrl({
                  hXBillModelArray: this.allselecOffs.reduce((pre,next)=>[...pre,...next.expandList],[]),
                  caseIds: this.allcaseId,
                  fenkai: this.fenkai
              }).then(res => {
                if(!this.fenkai){
                  if (this.$route.query.agentNum) {
                    this.createBillMethod(res.data.billId,{ taskId: this.$route.query.taskId })
                    // this.$router.replace({
                    //   path:
                    //     "/workbench/finance/creatBill/" + res.data.billId + "/creat",
                    //   query: { taskId: this.$route.query.taskId }
                    // });
                  } else {
                    this.createBillMethod(res.data.billId)
                    // this.$router.replace(
                    //   "/workbench/finance/creatBill/" + res.data.billId + "/creat"
                    // );
                  }
                }else{
                  this.createCommonBill = true
                  this.createBillMethod(res.data.billId, '', res.data.billIdList)
                  // this.$router.push({
                  //   name: 'bill',
                  //   params: {
                  //     fenkai: this.fenkai
                  //   }
                  // })
                  // this.$store.commit('caseInformation/SET_FENKAI',this.fenkai)
                  // this.$router.replace('/workbench/finance/bill')
                }

              });
            }).catch(()=>{
              this.$message({
                type: "info",
                message: "已取消操作"
              });
            })
          }else{
            if(!this.fenkai){
              if (this.$route.query.agentNum) {
                this.createBillMethod(res.data.billId,{ taskId: this.$route.query.taskId })
                // this.$router.replace({
                //   path:
                //     "/workbench/finance/creatBill/" + res.data.billId + "/creat",
                //   query: { taskId: this.$route.query.taskId }
                // });
              } else {
                this.createBillMethod(res.data.billId)
                // this.$router.replace(
                //   "/workbench/finance/creatBill/" + res.data.billId + "/creat"
                // );
              }
            }else{
              this.createCommonBill = true
              this.createBillMethod(res.data.billId, '', res.data.billIdList)
              // this.$router.push({
              //   name: 'bill',
              //   params: {
              //     fenkai: this.fenkai
              //   }
              // })

              // this.$store.commit('caseInformation/SET_FENKAI',this.fenkai)
              // this.$router.replace('/workbench/finance/bill')
            }
          }
        })

      } else if (type == "insideBill") {
        writeOffBillRecordnbUrl({
          billRecords: this.allselecOffs.reduce((pre,next)=>[...pre,...next.expandList],[]),
          caseIds: this.allcaseId
        }).then(res => {
          this.createBillMethod(res.data.billinterid)
          // this.$router.push(
          //   "/workbench/finance/cinBill/" + res.data.billinterid + "/creat"
          // );
        });
      }
    },
    // 创建账单方式:跳转/弹框
    createBillMethod(billId, query, billIdList) {
      const queryData = query ? query : {};
      if (!this.pageType){ // 不是弹框方式
        if (this.createCommonBill) {
          queryData.createCommonBill = true
          queryData.billIdList = billIdList || []
        }
        if (this.billType == 'bill'){
          this.$router.replace({
            path:
              "/workbench/finance/creatBill/" + billId + "/creat",
            query: queryData
          });
        }else {
          this.$router.push(
            "/workbench/finance/cinBill/" + billId + "/creat"
          );
        }
      } else {
        this.$set(this, 'billData', {
          billId: billId,
          billIdList: billIdList || []
        })
        this.pageBillId = billId
        this.offBillVisible = false
        this.createBillVisible = true
        // this.billData = {
        //   billId: billId,
        //   billIdList: billIdList || []
        // }
      }
    },
    // 弹框内关闭账单创建
    closeDialog(){
      this.createCommonBill = false
      if (this.pageType == 'bill') {
        this.$emit('billCreateDialog',false) // 关闭父级弹框
      }else {
        this.$emit('billCreateDialog', true)
        this.pageBillId = ''
        this.allcaseId = []
        this.searchCaseidTitle = ''
        this.clearSeach()
        this.offBillVisible = true
        this.createBillVisible = false
      }
    },
    // 页面内关闭
    cancel(){
      if (!this.pageType) {
        this.$router.go(-1)
      } else {
        this.$emit('billCreateDialog',false) // 关闭父级弹框
      }
    },
    remotepaternalUnit(query) {
      if (query !== "") {
        queryCustomerNameIdUrl({ keyword: query,isCustomer:1  }).then(response => {
          if (response.success) {
            this.seletData.custnames = response.data;
          } else {
            this.$message.error(response.message);
          }
        });
      }
    },
    remotepaternalUnitapp(query) {
      if (query !== "") {
        queryAllUrl({ applicantName: query ,orderBy:1}).then(response => {
          if (response.success) {
            this.seletData.apps = response.data;
          } else {
            this.$message.error(response.message);
          }
        });
      }
    },

    clearSeach() {
      this.listQuery = Object.assign({}, defaultData);
      this.list = [];
      this.total = "0";
    },
    shSeach() {
      this.listQuery = Object.assign({}, defaultData);
      this.listQuery.billwfStatus = "待组长审核";
      this.getList();
    },
    getselectdata() {
      // queryCaseType().then(res => {
      //   this.caseTypeOptions = res.data; // this.getTreeData()
      // });
      // querywfUserNameUrl().then(response => {
      //   if (response.success) {
      //     this.seletData.usernames = response.data;
      //   } else {
      //     this.$message.error(response.message);
      //   }
      // });
    },

    handledeleElement(item, index) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.deldata.customerID = item.custId;
          delCustomer(this.deldata).then(response => {
            if (response.success) {
              // const index = this.list.indexOf(item);
              this.list.splice(index, 1);
              this.$message({
                type: "success",
                message: "删除成功"
              });
            } else {
              this.$message.error(response.message);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }
};
</script>

 <style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.bottom-row-title {
  text-align: center;
  background-color: #f2f2f2;
  height: 45px;
  line-height: 45px;
}
.bottom-row-content {
  text-align: center;
  height: 45px;
  line-height: 45px;
}
.bottom-row-div {
  border: 1px solid #cccccc;
  border-bottom: none;
}
.bottom-row {
  margin-bottom: 0px !important;
  border-bottom: 1px solid #cccccc;
}
.searchfullRow {
  .searchcol {
    padding-right: 1%;
  }
  /deep/ .el-form-item__label {
    width: 25%;
  }
  /deep/ .el-form-item__content {
    width: 75%;
  }
  /deep/ .el-form-item {
    width: 100%;
  }
  /deep/ .el-input,
  /deep/ .el-select {
    width: 80%;
  }
}
.searchfullRow1 {
  .searchcol {
    padding-right: 0%;
  }
  /deep/ .el-form-item__label {
    width: 5.6%;
  }
  /deep/ .el-checkbox,
  .el-checkbox-group {
    display: inline-block;
  }
  /deep/ .el-form-item__content {
    width: 75%;
  }
  /deep/ .el-form-item {
    width: 100%;
  }
  /deep/ .el-input,
  /deep/ .el-select {
    width: 80%;
  }
}
.dateSlect {
  /deep/ .el-input,
  /deep/ .el-select {
    width: 46.4%;
  }
}
.el-table /deep/ th {
  background-color: #7199d5;
  color: #ffffff;
}
.el-row {
  margin-bottom: 5px;
}
.el-row:last-child {
  margin-bottom: 0;
}
.el-table /deep/ th {
  background-color: #f2f2f2;
  color: #333333;
  text-align: center;
}
.el-table /deep/ td {
  padding: 0px;
  text-align: center;
}
.iconBtn {
  font-size: 20px;
}
/deep/ .el-cascader {
  width: 100%;
}
.piceSpan {
  font-weight: 700;
  font-style: normal;
  font-size: 28px;
  color: #ff6600;
}
.totalClass {
  font-size: 14px;
}
/deep/.el-range-editor {
  width: 100% !important;
}
/deep/ .el-date-editor .el-range-separator {
  width: 9% !important;
}
.clearButton {
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
/deep/.el-table__body .el-table__expanded-cell{
  padding: 20px 50px;
}
/deep/ .noExpand .el-table__expand-icon {
  visibility: hidden;
}
</style>

