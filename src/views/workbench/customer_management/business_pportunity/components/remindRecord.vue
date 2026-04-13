<template>
    <div>
      <el-form label-width="136px">
        <el-form-item label="客户">
          <el-select
            v-model="mailQueryModuleData['custId']"
            ref="custSelect"
            filterable
            clearable
            remote
            reserve-keyword
            placeholder="请输入客户姓名"
            :remote-method="queryCustomerList">
            <el-option
              v-for="item in customerNameIdList"
              :key="item.custId"
              :label="item.name"
              :value="item.custId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="申请人" >
          <el-select
            v-model="mailQueryModuleData['applicantName']"
            ref="custSelect"
            filterable
            clearable
            remote
            reserve-keyword
            placeholder="请输入申请人姓名"
            :remote-method="queryAllUrl">
            <el-option
              v-for="item in queryAppLicantList"
              :key="item.appId"
              :label="item.applicantName"
              :value="item.applicantName"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="有效截止日:">
          <el-date-picker
            v-model="mailQueryModuleData.validEndDateStart"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
          <span>至</span>
          <el-date-picker
            v-model="mailQueryModuleData.validEndDateEnd"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="发送日期:" class="twoInputWarp">
          <el-date-picker
            v-model="mailQueryModuleData.createTimeStart"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
          <span>至</span>
          <el-date-picker
            v-model="mailQueryModuleData.createTimeEnd"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <div class="buttonWrap">
          <el-button type="primary" size="mini" @click="handleSearch">查询</el-button>
        </div>
      </el-form>
      <el-table
        :data="mailHistoryList"
        border
        fit
        height="400"
        empty-text="暂无数据"
        highlight-current-row
        current-row-key
        style="width: 100%;"
      >
        <el-table-column :label="item.title" align="left" v-for="item,index in mailTitleList" :key="index" :width="item.value==='index'?50:'auto'">
          <template slot-scope="scope">
            <span v-if="item.value==='index'">{{scope.$index+1}}</span>
            <span v-if="item.value!=='index'&&item.value!=='recordList'" >{{scope.row[item.value]}}</span>
            <el-popover
              placement="top-start"
              width="750"
              trigger="click"
              v-if="item.value=='recordList'"
            >
              <RecordList :list="scope.row[item.value]"></RecordList>
              <p style="cursor: pointer;color: #007aff" slot="reference">查看记录</p>
            </el-popover>
          </template>
        </el-table-column>
<!--        <el-table-column label="操作" align="left"  class-name="small-padding fixed-width">-->
<!--          <template slot-scope="{row}">-->
<!--            <el-button type="text" size="small" @click="downLoadAll(row)">查看邮件</el-button>-->
<!--          </template>-->
<!--        </el-table-column>-->
      </el-table>
      <pagination
        v-show="mailTotal>0"
        :total="mailTotal"
        :page.sync="mailListQuery.pageNo"
        :limit.sync="mailListQuery.pageSize"
        @pagination="getRemindRecord"
        :pageSizes="pageSizesList"
      />
      <span style="margin-top:10px;display: flex;justify-content: center">
        <el-button type="primary" size="mini" @click="$emit('changeFalse')">关闭</el-button>
      </span>
    </div>
</template>

<script>
  import RecordList from './RecordList'
import {getRemindRecord,queryCustomerNameId} from '@/api/caseList'
import {queryAllUrl} from '@/api/applicant'
import pagination from '@/components/Pagination'
import { downLoadAll } from '@/utils'
export default {
  name: "remindRecord",
  data(){
    return{
      pageSizesList:[500,1000,5000,10000],
      mailTitleList:[{"title":"序号","value":"index" },{'title':'商标名称','value':'tmName'},{"title":"商标号","value":"regNumber" },
        {"title":"商标类别","value":"tmGroup" },{"title":"客户","value":"custName" },{"title":"申请人","value":"applicantName" },{"title":"创建时间","value":"sendDate" },{"title":"处理结果","value":"disposeResult" },{"title":"发送记录","value":"recordList" },],
      mailHistoryList:[],
      mailQueryModuleData:{
        custId: '',
        applicantName: '',
        validEndDateStart: '',
        validEndDateEnd: '',
        createTimeStart: '',
        createTimeEnd: ''
      },
      customerNameIdList:[],
      queryAppLicantList:[],
      mailTotal:0,
      mailListQuery: {
        pageNo: 0,
        pageSize: 500
      },
    }
  },
  created(){
    this.handleSearch()
  },
  methods:{
    downLoadAll(row){
      if(['html','pdf','jpg','png'].some(item=>row.mailPath.replace(/.+\./,"").toLocaleLowerCase()==item)){
        window.open(`/ipdoc${row.mailPath}`.replace(/[+]/g,'%2B'))
        // window.open(`#/preView?address=ipdoc${url}`.replace(/[+]/g,'%2B'))
      }else{
        downLoadAll({target: '_blank', url: 'ipdoc' + row.mailPath})
      }
    },
    handleSearch(){
      this.mailListQuery.pageNo=1
      this.getRemindRecord()
    },
    getRemindRecord(){
      getRemindRecord(Object.assign(this.mailListQuery,this.mailQueryModuleData)).then(res=>{
        this.mailHistoryList=res.data
        this.mailTotal=res.total
      })
    },
    queryAllUrl(query){
      if(query !== ''){
        queryAllUrl({ pageNo: 1, pageSize: 100,applicantName:query,orderBy:1 }).then(res=>{
          this.queryAppLicantList=res.data
        })
      }
    },
    queryCustomerList(query){
      if(query !== ''){
        queryCustomerNameId({ pageNo: 1, pageSize: 100,keyword:query }).then(res=>{
          this.customerNameIdList=res.data
        })
      }
    },
  },
  components:{
    pagination,RecordList
  }
}
</script>

<style lang="scss" scoped>
  .el-table{
    /deep/ tr{
      th.el-table-column--selection{
        border-right: 0;
        overflow: visible;
        .cell{
          position: relative;
          right: -14px;
          z-index: 1;
          text-overflow: clip;
        }
      }
      td.el-table-column--selection{
        border-right: 0;
        overflow: visible;
        .cell{
          position: relative;
          right: -14px;
          z-index: 1;
          text-overflow: clip;
        }
      }
    }
  }
  .el-form{
    position: relative;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    padding: 20px 120px 20px  0;
    /*padding-right: 120px;*/
    margin: 10px 0 40px 0;
    box-shadow:0px 2px 5px 0px rgba(163, 163, 163, 0.35);
    .el-form-item{
      width: 33%;
      /deep/  .el-form-item__content{
        display: flex;
        align-items: center;
        height: 100%;
        .el-cascader{
          width: 100%;
        }
        .el-select{
          width: 100%;
        }
      }
    }
  }
  .buttonWrap{
    width: 100%;
    text-align: center;
  }

</style>
