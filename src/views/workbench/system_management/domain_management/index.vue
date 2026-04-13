<template>
  <div class="domain">
    <h2 class="department_header">领域管理</h2>
    <div class="queryBlock">
      <div class="buttonWrap">
        <el-button type="primary" @click="mySearch">搜索</el-button>
        <el-button type="primary" @click="detachMent">移除</el-button>
        <el-button type="primary" @click="jumpDomainAdd">新增</el-button>
      </div>
      <div class="queryModular">
    <el-form ref="postForm"  size="mini" class="form-container">
      <el-form-item  label-width="130px"  label="领域名称:" class="postInfo-container-item">
        <el-select  default-first-option  v-model="domainName" clearable filterable placeholder="请选择">
          <el-option
            v-for="item in queryDomainNamesList"
            :key="item.id"
            :label="item.domainName"
            :value="item.domainName"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item  label-width="130px"  label="创建日期:" class="postInfo-container-item">
        <el-date-picker
          v-model="creatTime"
          type="date"
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
    </el-form>
      </div>
    </div>
    <el-table
      :data="domainsList"
      style="width: 100%">
      <el-table-column
        prop="domainName"
        label="领域名称"
        width="380">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建日期"
        width="400">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button  type="text" size="small" @click="domainModify(scope.row)">修改</el-button>
          <el-button type="text" size="small" @click="addDomainSon(scope.row)">添加工作组</el-button>
          <el-button type="text" size="small"  @click="jumpWorkGroup(scope.row)">工作组</el-button>
          <el-button type="text" size="small" @click="domainDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <domain-son-list @handleClose="handleClose" v-if="dialogTableVisible" :dialogTableVisible="dialogTableVisible" :dialogTableInfo="dialogTableInfo"></domain-son-list>
  </div>
</template>

<script>
import domainSonList from './domain_mangement'
import { queryDomainNames, queryDomains,domainDelete } from '@/api/systemList'
export default {
  name: "domain_management",
  data() {
    return {
      domainName:'',//領域查詢
      creatTime:'',//創建時間
      queryDomainNamesList: [],//領域下拉列表
      domainsList:[],//領域數據列表
      dialogTableVisible:false,//添加子部門（組件）
      dialogTableInfo:{}
    }
  },
  created() {
    this.queryDomainNames()
    this.queryDomains()
  },
  methods: {
    mySearch(){
      this.queryDomains()
    },
    detachMent(){
      this.domainName=''
      this.creatTime=''
      this.queryDomains()
    },
    jumpDomainAdd(){
      this.$router.push('domain_management_detail/1')
    },
    handleClose(res){
      this.dialogTableVisible=res
    },
    domainModify(query){
      this.$router.push({ path:'domain_management_detail/2',query})
    },
    addDomainSon(res){
      this.dialogTableInfo=res
      this.dialogTableVisible=true
    },
    jumpWorkGroup(query){
      this.$router.push({path:'workingGroup_management',query:{domainName:query.domainName}})
    },
    domainDelete(res){
      let data= {
        id: res.id
      }
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        domainDelete(data).then(res=>{
          if(res.success){
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.detachMent()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    queryDomainNames() {
      queryDomainNames().then(res => {
        if (res.success) {
          this.queryDomainNamesList = res.data
        }
      })
    },
    queryDomains() {
      let data={
        agencyId: 1,
        domainName:this.domainName
      }
      queryDomains(data).then(res => {
        if(res.success){
          this.domainsList=res.data
        }
      })
    }
  },
  components:{
    domainSonList
  }
}
</script>

<style lang="scss" scoped>
  .department_header{
    width:72px;
    height:36px;
    font-size:18px;
    font-family:SourceHanSansCN-Normal;
    font-weight:400;
    color:rgba(38,42,47,1);
    line-height: 36px;
  }
  .buttonWrap{
    float: right;
    position: relative;
    z-index: 1;
  }
  .queryBlock{
    border:1px solid rgba(191,191,191,1);
    padding: 15px;
    margin-bottom: 13px;
  }
  .queryModular{
    margin-bottom:15px;
  }
  .el-table{
    border:1px solid rgba(191,191,191,1);
    padding-left: 10px;
  }
</style>
