<template>
  <div>
    <el-form label-width="136px">
      <el-row>
        <el-form-item label="案件文号:">
          <el-input v-model="query.beginNumber " placeholder="请输入案件文号" @change="changeTextRange" clearable></el-input>
          <span>至</span>
          <el-input v-model="query.endNumber" placeholder="请输入案件文号" clearable></el-input>
        </el-form-item>
        <el-form-item label="商标号:">
          <el-input v-model="query.droitNumber" placeholder="请输入商标号"  clearable></el-input>
        </el-form-item>
        <el-form-item label="案件名称:">
          <el-input v-model="query.caseName" placeholder="请输入案件名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="账单号:">
          <el-input v-model="query.billNo" placeholder="请输入账单号" clearable></el-input>
        </el-form-item>
        <div class="buttonWrap">
          <!--<el-button type="primary" size="mini" @click="detachMent">重置</el-button>-->
          <el-button type="primary" size="mini" @click="handleSearch">查询</el-button>
          <el-button type="primary" size="mini" @click="changeSonMenuState('批量审核')">审核</el-button>
          <el-button type="primary" size="mini" @click="changeSonMenuState('批量转交')">转交</el-button>
        </div>
      </el-row>
    </el-form>
    <div style="display: flex;position: relative">
      <TitleTotal :total="total"/>
      <div class="button_wrap" v-if="selectionState&&multipleTypeText=='批量审核'">
        <el-button class="exactButton" size="mini" type="primary" @click="toExamine(1)">通过</el-button>
        <el-button class="exactButton" size="mini" style="margin-right: 20px" @click="toExamine(0)">退回</el-button>
        <el-button class="exactButton" size="mini" type="primary" @click="selectionState=false">取消</el-button>
      </div>
      <div class="button_wrap" v-if="selectionState&&multipleTypeText=='批量转交'">
        <el-button class="exactButton" size="mini" type="primary" @click="handlePlzj(1)">{{multipleTypeText}}</el-button>
        <el-button class="exactButton" size="mini" type="primary" @click="selectionState=false">取消</el-button>
      </div>
    </div>
    <el-table
      ref="todoTaskMultiple"
      :data="taskList"
      fit
      empty-text="暂无数据"
      highlight-current-row
      current-row-key
      style="width: 100%;"
      :height="clientHeight"
      @select="handleSelectionChange"
      @select-all="handleSelectionAll"
    >
      <el-table-column
        type="selection"
        width="30"
        class="selection"
        v-if="selectionState"
      >
      </el-table-column>
      <el-table-column
        type="index"
        width="50"
        align="left"
        label="序号"
      >
      </el-table-column>
      <el-table-column v-for="(item,index) in tableDefaultList" :key="index" :width="item.value==='index'?50:'auto'" :label="item.title" align="left" :prop="item.value"
                       :filters="unique(taskList.map(i=>({text:i[item.value],value:i[item.value]})),'value').filter(ii=>ii.value)"
                       :filter-method="filterHandler"
                       sortable
                       filter-placement="bottom-start">
        <template slot-scope="scope">
           <a v-if="item.value=='agentNumString'" class="itemTitle_style" @click="takeCaseDetail(scope.row)" :title="`${scope.row[item.value]}`">{{scope.row[item.value]}} </a>
          <span v-else>{{scope.row[item.value]}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="left" fixed="right"  class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="jumpMassfiling(scope.row)">处理</el-button>
<!--          <el-button-->
<!--            type="text"-->
<!--            size="small"-->
<!--            @click="transfromtask(scope.row)">任务权限转交</el-button>-->
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.pageNo"
      :limit.sync="listQuery.pageSize"
      @pagination="queryBillTask"
      :pageSizes="pageSizesList"
    />
    <HandOver :transfromState="transfromState" :transfromType="transfromType" :multipleSelection="multipleSelection" @closeHandover="closeHandover"></HandOver>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'; // secondary package based on el-pagination
import DetailOfficialCommunication from '@/views/workbench/case/officialCommunication/detailOfficialCommunication';
import { queryBillTask,batchdoBillTask } from '@/api/caseList.js'
import HandOver  from "./HandOver";
export default {
  components: { Pagination, DetailOfficialCommunication,HandOver },
  name: 'index',
  props:{
    refesh:{

    }
  },
  data() {
    return {
      selectionState: false, // 筛选递交复选框
      total: 0,
      loading: false,
      listLoading: false,
      taskList: [],
      query: { // 查询条件
        beginNumber: '',
        endNumber: '',
        droitNumber: '',
        caseName: '',
        billNo: ''
      },
      transfromState:false,
      multipleTypeText:'',
      transfromType:'',
      multipleSelection:[],
      listQuery: {
        pageNo: 1,
        pageSize: JSON.parse(localStorage.getItem('pageSize'))?JSON.parse(localStorage.getItem('pageSize')).find(item=>item.name==this.$route.name)?JSON.parse(localStorage.getItem('pageSize')).find(item=>item.name==this.$route.name).pageSize:10:10
      },
      pageSizesList:[ 10, 50, 100,200,300,400 ,500],
      tableDefaultList:[{'title':'账单号','value':'billNo' },{'title':'客户','value':'custFullNameString'},{'title':'申请人','value':'appFullNameString'},{'title':'案件名称','value':'tmName'},{'title':'权利号','value':'regNumber'},{'title':'案件文号','value':'agentNumString'},{'title':'账单总金额','value':'billSum'},{'title':'结算币种','value':'curName'}, {'title':'提交人','value':'userNameString' }, {'title':'开单日期','value':'billDate' },{'title':'账单状态','value':'wfStatus' }],
    }
  },
  created() {

  },
  activated() {
    this.query.beginNumber = ''
    this.query.endNumber = ''
    this.query.droitNumber = ''
    this.query.caseName = ''
    this.query.billNo = ''

    this.handleSearch()
  },
  methods: {
    takeCaseDetail(row){
      this.$commonUtils.takeCaseDetail(row,this)
    },
    detachMent() {
      this.query = {}
      this.listQuery.pageNo = 1
      this.queryBillTask()
    },
    changeSonMenuState(e) {
      this.multipleSelection = []
      this.selectionState=true
      this.multipleTypeText=e
    },
    transfromtask(row){
      this.transfromType = '任务权限转交'
      this.transfromState = true
      this.multipleSelection=[row]
    },
    handleSearch() {
      this.selectionState = false
      this.multipleSelection = []
      this.listQuery.pageNo = 1
      this.queryBillTask()
    },
    jumpMassfiling(row) {
     // window.open(`#/workbench/finance/creatBill/${row.billId}/edit?taskId=${row.taskId}&taskNo=${row.taskNo}`,"_blank","height=800px","width=1000px")
      if (row.taskNo == 5 || row.taskNo == 6) {
       this.$router.push({path:`/workbench/finance/creatBill/${row.billId}/view`, query:{taskId: row.taskId, taskNo: row.taskNo }})
      } else {
        this.$router.push({path:`/workbench/finance/creatBill/${row.billId}/edit`, query:{taskId: row.taskId, taskNo: row.taskNo }})
      }
    },
    closeHandover(e){
      this.transfromState=false
      if(e){
        this.handleSearch()
      }
    },
    toExamine(result){
      const data = {
        taskIdList: this.multipleSelection.map(item => item.taskId),
        result
      }
      batchdoBillTask(data).then(res=>{
        this.handleSearch()
      })
    },
    handlePlzj(){
      this.transfromState=true
      this.transfromType='批量转交'
    },
    queryBillTask() {
      const data = {
        userId: this.$store.state.user.userId,
        pageNo: this.listQuery.pageNo,
        pageSize: this.listQuery.pageSize
      }
      this.listLoading = true
      queryBillTask(Object.assign(data, this.query)).then(res => {
        // this.$store.dispatch('user/getTodoTaskNotice');
        this.total = res.total
        this.taskList = res.data
        this.listLoading = false;
        if (this.multipleSelection.length) {
          this.$nextTick(() => {
            this.multipleSelection.forEach(itm => {
              this.$refs.todoTaskMultiple.toggleRowSelection(this.taskList.find(item => item.taskId === itm.taskId), true)
            })
          })
        }
      });
    },
    changeTextRange(e) {
      this.$set(this.query, 'endNumber', e)
    },
    handleSelectionAll(val) {
      val = val.filter(item => item !== undefined)
      this.multipleSelection = this.unique(this.multipleSelection.concat(val), 'taskId')
      if (!val.length) {
        this.taskList.forEach(row => {
          this.multipleSelection = this.multipleSelection.filter(item => item.taskId !== row.taskId)
        })
      }
    },
    handleSelectionChange(val, row) {
      val = val.filter(item => item != undefined)
      this.multipleSelection = this.unique(this.multipleSelection.concat(val), 'taskId')
      if (!val.find(item => item.taskId === row.taskId)) {
        this.multipleSelection = this.multipleSelection.filter(item => item.taskId !== row.taskId)
      }
    },
    unique(data, key) {
      const hash = {};
      const data2 = data.reduce((preVal, curVal) => {
        hash[curVal[key]] ? '' : hash[curVal[key]] = true && preVal.push(curVal);
        return preVal
      }, [])
      return data2
    },
    filterHandler(value, row, column) {
      const property = column['property'];
      return row[property] === value;
    },
  },
  computed:{
    clientHeight(){
      return  document.documentElement.clientHeight-300
    },
  },
  watch:{
    refesh(n){
      if(n){
        this.handleSearch()
        this.$emit('changeRefesh',false)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-row{
    display: flex;
    padding: 20px 5px;
    margin: 10px 2px;
    box-shadow:0px 2px 5px 0px rgba(163, 163, 163, 0.35);
    flex-wrap: wrap;
    .el-form-item{
      margin-bottom: 0;
      /deep/ .el-form-item__content{
        display: flex;
        height:32px;
        input{
          height: 100%;
        }
      }
    }
  }
  .buttonWrap{
    display: flex;
    justify-content: space-between;
    padding-left: 10px;
    align-items: center;
  }
  .button_wrap {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 50px;

    .el-button {
      margin-left: 10px;
    }
  }
  .el-table{
    /deep/ th{
      padding:5px 0
    }
    /deep/ td {
      padding: 0 ;
    }
    /deep/ .cell{
      white-space: nowrap
    }
  }
  .el-table{
    width: auto;
    /deep/ tr:nth-of-type(1){
      th{
        background: rgba(242, 242, 242, 1);
      }
    }
  }
  .el-dropdown{
    margin-left: 10px;
    cursor: pointer;
    line-height: 1;
    position: relative;
    top: -1px;
    .el-dropdown-link{
      color: #FFF;
      background-color: #409EFF;
      border-color: #409EFF;
      padding: 7px 15px;
      font-size: 12px;
      border-radius: 3px;
      line-height: 1;
      &:hover {
        background: #66b1ff;
        border-color: #66b1ff;
        color: #FFF;
      }
    }

  }
  .lowCreditFrom{
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    .el-form-item{
      line-height: 30px;
      width: 100%;
      display: flex;
      border: 1px solid #EBEEF5;
      margin-bottom: 10px;
      /deep/ .el-form-item__label{
        background: #f5f7fa;
        line-height: 30px;
      }
      /deep/ .el-form-item__content{
        line-height: 30px;
        margin-left: 0 !important;
        padding-left: 10px;
        background: #fff;
        flex: 1;
      }
    }
  }
  .tips{
    padding: 8px 16px 8px 20px;
    box-sizing: border-box;
    width: 418px;
    background-color: rgba(253, 246, 236, 1);
    margin-bottom: 10px;
    img{
      vertical-align: middle;
      width: 15px;
      height: auto;
      margin-right: 12px;
    }
    span{
      font-weight: 400;
      font-style: normal;
      font-size: 12px;
      color: #E6A23C;
      text-align: left;
      line-height: 18px;

    }
  }
</style>
