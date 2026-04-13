<template>
<div>
  <header style="display: flex;justify-content: space-between">
    <p style="color: #409EFF">已核销费用</p>
    <p v-if="type!=='view'">
      <el-button @click="deleteWriteList" size="mini" type="primary">移除</el-button>
      <el-button @click="takeNoWeiteOff" size="mini" type="primary">添加</el-button>
    </p>
  </header>

  <el-table :row-class-name="rowClassName" @row-dblclick="dblclick" @filter-change="filterChange" @selection-change="writeOffSelectionChange" @select="writeOffSelectionSingle"  size="mini" ref="writeOff" :data="writeOffList" border fit empty-text="暂无数据" highlight-current-row current-row-key style="width: 100%;">
    <el-table-column type="selection" width="55" v-if="type!=='view'">
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
              <span v-if="item.prop == 'amountBill'">
                {{scope.row[item.prop].toFixed(2)}}
              </span>
              <span v-else>{{scope.row[item.prop]}}</span>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </el-table-column>
    <el-table-column type="index" width="50" label="序号" align="left"></el-table-column>

    <el-table-column
      v-for="item in defaultTitleList"
      :label="item.label"
      :prop="item.prop"
      align="left"
      :sortable="item.sortable"
      width
      :filters="unique(writeOffList.map(i=>({text:i[item.prop],value:i[item.prop]})),'value').filter(ii=>ii.value!='')"
      :filter-method="filterHandler">
      <template slot-scope="scope">
        <span v-if="item.prop == 'amountBill'">
          {{scope.row[item.prop].toFixed(2)}}
        </span>
        <span v-else>{{scope.row[item.prop]}}</span>
      </template>
    </el-table-column>
  </el-table>
  <el-row>
    <el-col :span="24" style="text-align:right; padding-top:15px">
      <span> 数量合计：{{writeOffList?writeOffList.length:'0'}}条</span>
      <span style="margin-left:20px">总金额:</span><span class="piceSpan">￥{{writeOffNumber|toFixed2}}</span>
    </el-col>
  </el-row>
  <el-dialog
    title="未核销"
    :visible.sync="dialogVisible"
    width="70%"
    :modal="false"
   >
    <el-row>
      <el-col class="totalClass" :span="24">
        总计：{{total}}条
      </el-col>
    </el-row>
    <el-table ref="offBill" :row-class-name="rowClassName" @row-dblclick="dblclick" @selection-change="handleSelectionChange" @select="handleSelectionSingle" size="mini" :data="list" border fit empty-text="暂无数据" highlight-current-row current-row-key style="width: 100%;">
      <el-table-column type="selection" width="55"  :selectable="selectable" >
      </el-table-column>
      <el-table-column type="index" width="50" label="序号" align="left"></el-table-column>
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
                <span v-if="item.prop == 'amountBill'">
                  {{scope.row[item.prop].toFixed(2)}}
                </span>
                <span v-else>{{scope.row[item.prop]}}</span>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column :prop="item.prop" :label="item.label"  :sortable="item.sortable" align="left" width v-for="item in defaultTitleList">
        <template slot-scope="scope">
          <span v-if="item.prop == 'amountBill'">
            {{scope.row[item.prop].toFixed(2)}}
          </span>
          <span v-else>{{scope.row[item.prop]}}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-row>
      <el-col :span="24" style="text-align:right; padding-top:15px">
        <span> 数量合计：{{list?list.length:'0'}}条</span>
        <span style="margin-left:20px">总金额:</span><span class="piceSpan">￥{{selectTablepice|toFixed2}}</span>
      </el-col>
    </el-row>
    <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="submitBtn">核销</el-button>
  </span>
  </el-dialog>

</div>
</template>

<script>
import { queryBillInfoByBillId,queryHXBillData ,writeOffBillRecordUrl,deleteBillInfo} from '@/api/billApi'
export default {
  name: "WriteOff",
  props:{
    caseIds:{},
    billId:{

    },
    type:{}
  },
  data(){
    return {
      writeOffList: [],
      allselecOffs:[],
      allselectList:[],
      list:[],
      total:0,
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
      feeTitleList:[],
      dialogVisible:false,
      writeOffNumber:0
    }
  },
  created() {
    this.queryBillInfoByBillId()
  },
  methods:{
    dblclick(row){
      if(row.feetId){
        window.open(this.$router.resolve(`/workbench/finance/seeFeeDetail?feeId=${row.screenId}`).href, '_blank');
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
    filterChange(){
      this.$nextTick(()=>{
        let fw_number = 0;
        if (this.$refs.writeOff.$data.store.states.filteredData&&this.$refs.writeOff.$data.store.states.filteredData.length) {
          // console.log(this.$refs.writeOff.$data.store.states.filteredData);
          this.$refs.writeOff.$data.store.states.filteredData.forEach(item => {
            fw_number += Number(item.amountBill)
          });
        }
        this.writeOffNumber = fw_number
      })
    },
    deleteWriteList(){
      if(!this.allselectList.length){
        this.$message.error('请选择需要移除的费用')
        return
      }
      this.$confirm("此操作将会影响账单基本信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
      .then(() => {
        this.deleteList=JSON.parse(JSON.stringify(this.allselectList.reduce((pre,next)=>[...pre,...next.expandList],[])))
        this.writeOffList= this.writeOffList.filter(item=>!this.allselectList.includes(item) )
        this.filterChange()
        this.$emit('changeBill','delete')

      })

      // this.allselectList.forEach(item=>{
      //   if(this.writeOffList.includes(item)){
      //
      //   }
      // })
    },
    deleteBillInfo(){
     return deleteBillInfo({
        hXBillModelArray: this.deleteList,
        caseIds: this.caseIds,
        billId: this.billId })
    },
    unique(list,type){
      return this.$commonUtils.unique(list,type)
    },
    submitBtn(){
      if(this.allselecOffs.length==0){
        this.$message.error('请选择要核销的费用')
        return
      }
      this.writeOffBillList=JSON.parse(JSON.stringify(this.allselecOffs.reduce((pre,next)=>[...pre,...next.expandList],[])))
      this.$emit('changeBill','writeOff')
      this.dialogVisible=false
      // writeOffBillRecordUrl({
      //   hXBillModelArray: this.allselecOffs,
      //   caseIds: this.caseIds,
      //   billId:this.billId
      // }).then(res => {
      //   this.$message.success(res.message)
      //   this.queryBillInfoByBillId()
      //   this.dialogVisible=false
      //
      // });
    },
    writeOffBillRecordUrl(){
      return writeOffBillRecordUrl({
        hXBillModelArray: this.writeOffBillList,
        caseIds: this.caseIds,
        billId:this.billId
      })
    },
    takeNoWeiteOff(){
      this.dialogVisible=true
      this.getList()
    },
    queryBillInfoByBillId() {
      queryBillInfoByBillId({ billId: this.billId }).then(res => {
        this.writeOffList =this.formatList(res.data)
        if(res.data.find(i=>i.payType == '草单')){
          //billStyle:账单类型
          //billStyleName:账单类型名称
          this.$emit('billTypeEvent',res.data.find(i=>i.payType == '草单'))
        }
        this.$nextTick(() => {
          this.filterChange()
        })
      })
    },
    formatList(list){
      return list.reduce((pre,next)=>{
        if(!pre.screenId[next.screenId]){
          pre.screenId[next.screenId]=true
          next['expandList']=[JSON.parse(JSON.stringify(next))]
          pre.list.push(next)
          // pre.list.forEach(item=>{
            // let amountBill = +item.amountBill
            // item.amountBill = amountBill.toFixed(2)
          // })
        }else {
          let data=pre.list.find(item=>item.screenId==next.screenId)
          data['expandList'].push(next)
          // data.expandList.forEach(it=>{
            // let amountBill = +it.amountBill
            // it.amountBill = amountBill.toFixed(2)
          // })
          data.amountBill=+data['expandList'].reduce((p,n)=>p+(+n.amountBill),0).toFixed(2);
          data.feetStr=data['expandList'].reduce((p,n)=>p + ( n.feetStr + ';'),'');
          data.description=data['expandList'].reduce((p,n)=>p + ( n.description + ';'),'');
        }
        return pre
      },{screenId:{},list:[]}).list
    },
    getList(type){

      queryHXBillData({caseIds:this.caseIds}).then(response => {
        this.list =this.formatList(response.data.HXBillModelArray);
        this.total = this.list.length // response.total;
        if (response.data == "-2") {
          this.$message.error(response.message);
        }
      })
    },
    writeOffSelectionChange(val){
      this.allselectList=val
    },
    writeOffSelectionSingle(val, row){
      // if (!val.find(item => item.id === row.id)) {
      //   this.writeOffList.forEach(item=>{
      //     if(item.screenId==row.screenId){
      //       this.$refs.writeOff.toggleRowSelection(item,false)
      //     }
      //   })
      // } else {
      //   this.writeOffList.forEach(item=>{
      //     if(item.screenId==row.screenId){
      //       this.$refs.writeOff.toggleRowSelection(item,true)
      //     }
      //   })
      // }
    },
    rowClassName({row, rowIndex}){
      if(row.expandList.length==1){
        return 'noExpand'
      }
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
  },
  computed:{
    // writeOffNumber(){
    //   let fw_number = 0;
    //   if(this.$refs.writeOff){
    //     console.log(this.$refs.writeOff.$data.store.states.filteredData);
    //     if (this.$refs.writeOff.$data.store.states.filteredData&&this.$refs.writeOff.$data.store.states.filteredData.length) {
    //       this.$refs.writeOff.$data.store.states.filteredData.forEach(item => {
    //         fw_number += Number(item.amount)
    //       });
    //     }
    //   //  this.writeOffNumber= fw_number
    //   }
    //   return fw_number
    // },
    selectTablepice: function() {
      let fw_number = 0;
      if (this.allselecOffs&&this.allselecOffs.length) {
        this.allselecOffs.forEach(item => {
          fw_number += Number(item.amountBill)
        });
      }

      return fw_number;
    }
  }
}
</script>

<style lang="scss" scoped>
.piceSpan {
  font-weight: 700;
  font-style: normal;
  font-size: 28px;
  color: #ff6600;
}
  /deep/.el-table__body .el-table__expanded-cell{
     padding: 20px 50px;
  }
  /deep/ .noExpand .el-table__expand-icon {
    visibility: hidden;
  }
</style>
