<template>
  <div class="workingGroup">
    <h2 class="department_header">工作组管理</h2>
    <div class="queryBlock">
    <el-tag type="info">工作组</el-tag>
    <el-select  default-first-option v-model="workgroupName" clearable filterable placeholder="请选择">
      <el-option
        v-for="item in queryWorkgroupNamesList"
        :key="item.wkgId"
        :label="item.groupName"
        :value="item.groupName">
      </el-option>
    </el-select>
    <el-tag type="info">领域</el-tag>
    <el-select  default-first-option v-model="domainName" clearable filterable  placeholder="请选择">
      <el-option
        v-for="item in domainNames"
        :key="item.id"
        :label="item.domainName"
        :value="item.domainName">
      </el-option>
    </el-select>
    <el-tag type="info">部门</el-tag>
    <el-select  default-first-option v-model="queryDeptByConditionName" clearable filterable  placeholder="请选择">
      <el-option
        v-for="item in queryDeptByConditionList"
        :key="item.deptId"
        :label="item.name"
        :value="item.name">
      </el-option>
    </el-select>
      <el-tag type="info">是否有效(地域)</el-tag>
      <el-select  default-first-option v-model="wkgStatus" clearable filterable  placeholder="请选择">
        <el-option
          v-for="item in [{value: 1, label: '有效'}, {value: 0, label: '无效'}]"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    <el-tag type="info">创建日期</el-tag>
    <el-date-picker
      v-model="createTime"
      value-format="yyyy-MM-dd"
      type="date"
      placeholder="选择日期">
    </el-date-picker>
      <div class="buttonWrap">
        <el-button type="primary" @click="mySearch">搜索</el-button>
        <el-button type="primary" @click="detachMent">移除</el-button>
        <el-button type="primary" @click="addWorkGroup" v-allow="99">新增</el-button>
      </div>
    </div>
    <el-table
      :data="workGroupList"
      style="width: 100%">
      <el-table-column
        prop="groupName"
        label="工作组名称"
        width="auto">
      </el-table-column>
      <el-table-column
        prop="domainName"
        label="所属领域"
        width="auto">
      </el-table-column>
      <el-table-column
        prop="name"
        label="所属部门(地域)"
        width="auto">
      </el-table-column>
      <el-table-column
        prop="statusStr"
        label="是否有效(地域)"
        width="auto">
      </el-table-column>
      <el-table-column
        prop="areaName"
        label="地域"
        width="auto">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建日期"
        width="auto">
      </el-table-column>
      <el-table-column label="操作" width="auto">
        <template slot-scope="scope">
          <el-button @click="jumpWorkingGroupModify(scope.row)" type="text" size="small" v-allow="100">修改</el-button>
          <el-button type="text" size="small" @click="jumpStaffList(scope.row)">成员</el-button>
          <el-button type="text" size="small" @click="upDatebar(scope.row)">更新案件办案人</el-button>
          <el-button type="text" size="small" @click="deleteDeptId(scope.row)" v-allow="101">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { queryWorkGroup,queryDeptByCondition,deleteWorkgroup,queryDomainNames ,queryWorkgroupNames} from '@/api/systemList'
import {upWorkMember} from '@/api/caseList'
export default {
  name: "workingGroup_management",
  data() {
    return {
      wkgStatus: null,
      workGroupList: [],//工作組數據列表
      workgroupName: null,//工作組名字
      domainName: null,//領域名字
      queryDeptByConditionName:null,//部門
      createTime: '',//創建時間
      queryDeptByConditionList:[],//部門查詢列表
      queryWorkgroupNamesList:[],//工作組查詢列表
      domainNames:[]//領域查詢列表
    }
  },
  activated(){
    if(this.$route.query.name||this.$route.query.domainName){//从部门管理进入或者領域進入
      this.queryWorkGroup(this.$route.query)
      this.domainName=this.$route.query.domainName
      this.queryDeptByConditionName=this.$route.query.name
    }else if(this.$route.query.groupName){
      this.workgroupName = this.$route.query.groupName
      this.queryWorkGroup({groupName: this.$route.query.groupName})
    }else{
      // this.queryWorkGroup()
      this.mySearch()
    }
    this.queryDeptByCondition()
    this.queryDomainNames()
    this.queryWorkgroupNames()
  },
  // activated() {
  //   this.mySearch()
  // },
  methods :{
    //工作组列表
    queryWorkGroup(data){
      for (var key in data) {
        if (!data[key] && data[key] !== 0 && data[key] !== false) {
          data[key] = undefined
        }
      }
      queryWorkGroup(data).then(res => {
        if (res.success) {
          this.workGroupList = res.data

        }
      })
    },
    jumpStaffList(query){
      this.$router.push({path:'staff_management',query:{groupName:query.groupName}})
    },
    upDatebar({wkgId}){
      this.notify = this.$notify({
        title: "提示",
        message: "办案人更新中...",
        duration: 3000,
        showClose: false,
        type: "warning"
      });
      upWorkMember({wkgId}).then(res=>{

      })
    },
    mySearch() {
      let data = {
        deptName: this.queryDeptByConditionName,
        domainName:this.domainName,
        groupName:this.workgroupName ,
        wkgStatus: this.wkgStatus,
        createTime: this.createTime
      }
      this.queryWorkGroup(data)
    },
    detachMent(){
      this.createTime = ''
      this.wkgStatus = null
      this.workgroupName = null
      this.domainName = null
      this.queryDeptByConditionName = null
      this.mySearch()
    },
    queryDomainNames(){
      queryDomainNames().then(res=>{
        if(res.success){
          this.domainNames=res.data
        }
      })
    },
    queryDeptByCondition(){
      queryDeptByCondition().then(res=>{
        if(res.success){
          this.queryDeptByConditionList=res.data
        }
      })
    },
    queryWorkgroupNames(){
      queryWorkgroupNames().then(res => {
        if (res.success) {
          this.queryWorkgroupNamesList = res.data
        }
      })
    },
    jumpWorkingGroupModify(query){
      query.auditorList = JSON.stringify(query.auditorList)
      this.$router.push({
        path: '/workbench/system_management/workingGroup_management_add/2',
        query
      })
    },
    addWorkGroup(){
      this.$router.push({
        path: '/workbench/system_management/workingGroup_management_add/1'
      })
    },
    deleteDeptId(res){
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteWorkgroup(res).then(res => {
          if (res.success) {
            this.queryWorkGroup()
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }
  }
}

</script>

<style >
  .workingGroup  .department_header{
    height:36px;
    font-size:18px;
    font-family:SourceHanSansCN-Normal;
    font-weight:400;
    color:rgba(38,42,47,1);
    line-height: 36px;
  }
  .workingGroup  .queryBlock{
    height:124px;
    border:1px solid rgba(191,191,191,1);
    padding: 15px;
    margin-bottom: 13px;
  }
  .workingGroup .el-select{
    vertical-align: middle;
    margin-right:20px ;
  }
  .workingGroup  .buttonWrap{
    float: right;
    margin-right: 58px ;
  }
  .workingGroup .el-table{
    border:1px solid rgba(191,191,191,1);
    padding-left: 10px;
  }
</style>
