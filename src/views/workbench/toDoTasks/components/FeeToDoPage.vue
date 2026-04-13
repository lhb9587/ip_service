<template>
  <div>
    <el-form label-width="136px">
      <el-row>
        <el-form-item label="费用科目:">
          <el-input v-model="query.feeName " placeholder="请输入内容"  clearable></el-input>
        </el-form-item>

        <el-form-item label="案件文号:">
          <el-input v-model="query.beginNum " placeholder="请输入内容" @change="changeTextRange" clearable></el-input>
          <span>至</span>
          <el-input v-model="query.endNum" placeholder="请输入内容" clearable></el-input>
        </el-form-item>
        <div class="buttonWrap">
          <!--<el-button type="primary" size="mini" @click="detachMent">重置</el-button>-->
          <el-button  size="mini" @click="handleSearch">查询</el-button>
          <el-button type="primary" size="mini" @click="changeSonMenuState('审核')">审核</el-button>
          <el-button type="primary" size="mini" @click="changeSonMenuState('转交')">转交</el-button>
        </div>
      </el-row>
    </el-form>
    <div style="display: flex;position: relative">
      <TitleTotal :total="total"/>
      <div class="button_wrap" v-if="selectionState">
        <template v-if="multipleTypeText=='审核'">
          <el-button class="exactButton" size="mini" type="primary" @click="toExamine(1)">通过</el-button>
          <el-button class="exactButton" size="mini"  @click="toExamine(0)">退回</el-button>
        </template>
        <template v-if="multipleTypeText=='转交'">
          <el-button class="exactButton" size="mini" type="primary" @click="transferTask">{{multipleTypeText}}</el-button>
        </template>

        <el-button class="exactButton" size="mini" style="margin-right: 20px" @click="selectionState=false">取消</el-button>
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
              <span v-if="item.value=='showRefno'" style="margin: 0;cursor: pointer" @click="takeCaseDetail(scope.row)">{{scope.row[item.value]}}</span>
              <span v-else >{{scope.row[item.value]}}</span>
          </template>
      </el-table-column>
      <el-table-column label="操作" align="left" fixed="right"  class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="jumpMassfiling(scope.row)">处理</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.pageNo"
      :limit.sync="listQuery.pageSize"
      @pagination="queryFeeTask"
      :pageSizes="pageSizesList"
    />
    <HandOver :transfromState="transfromState" :transfromType="transfromType" :multipleSelection="multipleSelection" @closeHandover="closeHandover"></HandOver>
  </div>
</template>

<script>
  import HandOver from './HandOver'
import Pagination from '@/components/Pagination'; // secondary package based on el-pagination
import { queryFeeTask,batchDoFeeTask } from '@/api/feeList.js'
export default {
  components: { Pagination ,HandOver},
  name: 'index',
  activated() {
    this.queryFeeTask()
  },
  data() {
    return {
      selectionState: false, // 筛选递交复选框
      total: 0,
      loading: false,
      listLoading: false,
      taskList: [],
      query: { // 查询条件

      },
      multipleSelection:[],
      listQuery: {
        pageNo: 1,
        pageSize: JSON.parse(localStorage.getItem('pageSize'))?JSON.parse(localStorage.getItem('pageSize')).find(item=>item.name==this.$route.name)?JSON.parse(localStorage.getItem('pageSize')).find(item=>item.name==this.$route.name).pageSize:10:10
      },
      multipleTypeText:'',
      pageSizesList:[ 10, 50, 100,200,300,400 ,500],
      tableDefaultList:[{'title':'费用科目','value':'feeName' },{'title':'总金额','value':'total'},{'title':'案件文号','value':'showRefno'},{'title':'账单总金额','value':'total'},{'title':'客户','value':'custIdShort'}, {'title':'报销人','value':'reimburseUserIdStr' }, {'title':'报销人所属工作组','value':'reimburseWkgIdStr' },{'title':'费用承担工作组','value':'costWkgIdStr' },{'title':'填报人','value':'fillinUserIdStr' },{'title':'任务人','value':'tasker' },{'title':'费用状态','value':'wfStatus' }],
      transfromType:'',

      transfromState:false,

    }
  },
  // created() {
  //    this.handleSearch()
  // },
  methods: {
    detachMent() {
      this.query = {}
      this.listQuery.pageNo = 1
      this.queryFeeTask()
    },
    changeSonMenuState(e){
      this.multipleSelection = []
      if(e==='审核'){
        this.selectionState = true//!this.selectionState
        this.currentTypeText=''
        this.multipleTypeText = '审核'
      }
      if(e==='转交'){
        this.selectionState = true//!this.selectionState
        this.currentTypeText=''
        this.multipleTypeText = '转交'
      }
    },
    takeCaseDetail(row){
      this.$commonUtils.takeCaseDetail(row,this)
    },
    closeHandover(e){
      this.transfromState=false
      if(e){
        this.handleSearch()
      }
    },
    handleSearch() {
      this.selectionState = false
      this.multipleSelection = []
      this.listQuery.pageNo = 1
      this.queryFeeTask()
    },
    jumpMassfiling(row) {
       this.$router.push({path:`/workbench/finance/addFeeDetail/3`, query:{feeId:row.feeId,taskId: row.taskId, taskNo: row.taskNo }})
    },
    transferTask(){
      this.transfromState=true
      this.transfromType='批量转交'
      this.selectionState = false;
    },
    toExamine(result){
      const data = {
        taskIdList: this.multipleSelection.map(item => item.taskId),
        result
      }
      batchDoFeeTask(data).then(res=>{
        this.handleSearch()
      })
    },
    getMinWidth(data, header, currentId){
      //  let arr=[...[String(data.label).replace(/[\u4E00-\u9FA5]/gi,'aa').length],...this.caseList.map(item => item[data.prop]).filter(item=>item).map(item=>String(item).replace(/[\u4E00-\u9FA5]/gi,'aa').length)]
      return String(data.title).replace(/[\u4E00-\u9FA5]/gi,'aa').length*12+30
    },
    queryFeeTask() {
      const data = {
       // userId: this.$store.state.user.userId,
        pageNo: this.listQuery.pageNo,
        pageSize: this.listQuery.pageSize
      }
      this.listLoading = true
      queryFeeTask(Object.assign(data, this.query)).then(res => {
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
      this.$set(this.query, 'endNum', e)
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
}
</script>

<style lang="scss" scoped>
  .el-row{
    display: flex;
    padding: 20px 5px;
    margin: 10px 2px;
    box-shadow:0px 2px 5px 0px rgba(163, 163, 163, 0.35);
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
