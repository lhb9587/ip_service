<template>
  <el-dialog
    title="案件选择"
    :visible.sync="dialogVisible"
    width="80%"
    append-to-body
    :close-on-click-modal="false"
    :before-close="()=>{$emit('closed',false)}"
    >
    <div style="display: flex">
    <el-input
      type="textarea"
      :autosize="{ minRows: 2, maxRows: 10}"
      placeholder="请输入内容"
      v-model="agentNums">
    </el-input>
      <div style="margin-left: 20px">
    <el-button type="primary" @click="getCase">确定</el-button>
      </div>
    </div>
    <h4 class="title">案件信息</h4>
    <el-table :data="caseData"
              border class="el-table1" ref="caseListMultiple"
                  @select="handleSelectionChange"
                  @select-all="handleSelectionAll"
    >
      <el-table-column type="selection" width="60"  align="left">
      </el-table-column>
      <el-table-column type="index" width="60" label="序号" align="left">
      </el-table-column>
      <el-table-column align="left" :key="item.title" v-for="item,index in tableTitleList" :label="item.title" :prop="item.value">
        <template slot-scope="scope">
          {{scope.row[item.value]}}
        </template>
      </el-table-column>

    </el-table>
    <span slot="footer" class="dialog-footer">
    <el-button @click="$emit('closed',false)">取 消</el-button>
    <el-button type="primary" @click="confirm(true)">确 定</el-button>
  </span>
  </el-dialog>
</template>

<script>
import {getCase} from "@/api/feeList";
export default {
  props:{
    billId: {},
    dialogVisible:{
      default: false
    },
    agentNums:{

    },
    rules:{

    }
  },
  name: "ChooseCase",
  data(){
    return {
      dialogVisibleSelf:false,
      tableTitleList:[{'title':'案件文号','value':'agentNum' },{'title':'客户','value':'custName' },{'title':'申请人','value':'appName'},{'title':'案件类型','value':'caseTypeStr'},{'title':'申请方向','value':'appFromto'},{'title':'权利号','value':'droitNumber'},{'title':'案件状态','value':'status'},{'title':'案件名称','value':'caseName'},{'title':'商标类别','value':'goodClasses'}],
      caseData:[],
      selectionList:[]
    }
  },
  methods:{
    getCase(){
      // 处理多个文号空行情况
      let agentNums = this.agentNums.split('\n')
      agentNums.forEach((item,index) =>{
        !item && agentNums.splice(index,1)
      })
      getCase({agentNums: agentNums.join("\n"), billId: this.billId}).then(res=>{
        this.caseData=res.data
        this.selectionList=[]
       this.$nextTick(()=>{
         this.caseData.forEach(item=>{
           this.$refs.caseListMultiple.toggleRowSelection(item,true)
           this.selectionList.push(item)
         })
       })
      })
    },
    confirm(flag){
      this.$emit('closed',flag)
      if(flag){
        this.$emit('getList',this.selectionList)
      }
    },
    handleSelectionAll(val) {
      val = val.filter(item => item !== undefined);
      this.selectionList=val
      if ([...new Set(this.selectionList.map(item => item.custId))].length >= 2) {
        this.$message.error("您必须选择同一客户下的案件");
        this.selectionList.filter(item => item.custId !== this.selectionList[0].custId).forEach(row => {
          this.$refs.caseListMultiple.toggleRowSelection(row,false)
          this.selectionList = this.selectionList.filter(item => item[this.rules] !== row[this.rules]);
        });
      }
      if (!val.length) {
        this.caseData.forEach(row => {
          this.selectionList = this.selectionList.filter(
            item =>
              item[this.rules] !==
              row[this.rules]
          );
        });
      }
    },

    handleSelectionChange(val, row) {
      val = val.filter(item => item != undefined);
      this.selectionList =val
      if (!val.find(item => item[this.rules] === row[this.rules])) {
        this.selectionList = this.selectionList.filter(
          item =>
            item[this.rules] !==
            row[this.rules]
        );
      }
      if ([...new Set(this.selectionList.map(item => item.custId))].length >= 2) {
            this.$message.error("您必须选择同一客户下的案件");
            this.$refs.caseListMultiple.toggleRowSelection(row,false)
            this.selectionList = this.selectionList.filter(
              item =>
                item[this.rules] !==
                row[this.rules]
            );
          }
    },
  },
  watch:{
    dialogVisible(){
      this.dialogVisibleSelf=this.dialogVisible
    }
  }
}
</script>

<style scoped>

</style>
