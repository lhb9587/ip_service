<template>
  <div>
  <el-form label-width="136px">
    <el-form-item label="部门名称:">
     <el-multi-cascader
        selectChildren
        :show-all-levels="false"
        :is-two-dimension-value="true"
        multiple
        filterable
        clearable
        collapse-tags
        change-on-select
         :options="limitDepartData"
        :props="defaultParams2"
        v-model="deptIdList">
    </el-multi-cascader>
    </el-form-item>
    <el-form-item label="申报日期:" class="twoInputWarp">
      <el-date-picker
        v-model="month"
        popper-class="monthPopper"
        type="month"
        format="MM"
        value-format="MM"
        placeholder="选择月">
      </el-date-picker>
    </el-form-item>
    <el-button type="primary" class="clearButton" size="mini"  @click="clearSearch"><img src="@/assets/清除@2x.png" alt=""><span>重置</span></el-button>
    <div class="buttonWrap">
      <el-button type="primary" size="mini"  @click="handleSearch">查询</el-button>
    </div>
  </el-form>
   <div style="display: flex;position: relative">
        <TitleTotal :total="total" />
        <el-button v-show='total' type="text" style="position: absolute;right: 0;bottom:-6px;font-size: 14px;padding-right: 6px" @click="queryReport(1)"><i class="el-icon-download">导出</i></el-button>
      </div>
     
  <el-table

      :data="reportList"
      fit
      empty-text="暂无数据"
      highlight-current-row
      current-row-key
      style="width: 100%;"
      :height="clientHeight"
    >
      <el-table-column
        type="index"
        width="50"
        align="left"
        label="序号"
      >
      </el-table-column>
      <el-table-column align="right" v-for="(item,index) in tableDefaultList" :key="index" :width="item.value==='index'?50:'auto'" :label="item.title"  :prop="item.value">
          <template slot-scope="scope">
              <span v-if="!item.noFilter">{{scope.row[item.value]|formatAmount}}</span>
              <span v-if="item.noFilter"> {{scope.row[item.value]}}</span>
         
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.pageNo"
      :limit.sync="listQuery.pageSize"
      @pagination="queryReport"
      :pageSizes="pageSizesList"
    />

  </div>
</template>

<script>
import Pagination from '@/components/Pagination'; 
import {queryReport,queryDepartMent} from '@/api/caseList.js'
import {downLoadAll} from '@/utils'
export default {
    components:{Pagination},
    data(){
        return{
            month:null,
            reportList:[],
            deptIdList:[],
            limitDepartData:[],
             tableDefaultList:[{'title':'预算年份','value':'year',noFilter:true },{'title':'预算月份','value':'month',noFilter:true },{'title':'机构名称','value':'deptName'},{'title':'部门编号','value':'deptId',noFilter:true },{'title':'科目编号','value':'feedId',noFilter:true }, {'title':'科目名称','value':'feeName' }, {'title':'编制预算','value':'budgetAmount' },{'title':'追加','value':'addAmount' },{'title':'调入','value':'inAmount' },{'title':'调出','value':'outAmount' },{'title':'上月预算剩余','value':'rmAmount'},{'title':'总预算','value':'totalAmount'},{'title':'实际支出数','value':'feeAmount' },{'title':'预算可用余额','value':'reminingAmount'}],
            defaultParams2:{
                value: 'deptId',
                label: 'deptName',
                checkStrictly: true,
                children: 'dataList'
            },
            total:0,
            listQuery: {
                pageNo: 1,
                pageSize: 169
                },
                pageSizesList:[169]
        }
    },
    created(){
        this.queryDepartMent()
    },
    methods:{
        handleSearch(){ 
            this.queryReport()
        },
        clearSearch(){
            this.month=''
            this.deptIdList=[]
        },
        queryReport(flag){
            if(!this.deptIdList.length){
                this.$message.error('请选择部门')
                return
            }
            const data=Object.assign(this.listQuery,{
                    deptIdList:this.deptIdList.map(item=>item[item.length-1]),
                    month:this.month,
                    dateFlag:this.month?2:1
                    })
                    if(!data.month){
                        delete data.month
                    }
                    if(flag===1){
                        data.export=1
                    
                    }else{
                        delete data.export
                    }
            queryReport(               
                data
            ).then(res=>{
                if(flag===1){
                    downLoadAll({url:'ipdoc'+res.data.exportFilePath})
                    return
                }
                this.reportList=res.data
                this.total=res.total
            })
        },
        queryDepartMent(){
            queryDepartMent({queryFlag:2}).then(res => {
              this.limitDepartData = res.data
             })
        }
        
    },
    computed:{
        clientHeight(){
        return  document.documentElement.clientHeight-300
        },
  },
}
</script>

<style lang="scss">
.buttonWrap{
    width: 100%;
    text-align: center;
    margin-bottom: 10px
  }
.el-table{
    /deep/ th{
      padding:5px 0
    }
    /deep/ td {
      padding: 0 ;
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
</style>