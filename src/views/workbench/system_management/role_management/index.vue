<template>
  <div class="domain">
    <h2 class="department_header">角色管理</h2>
    <div class="queryBlock">
      <div class="buttonWrap">
        <el-button type="primary" @click="mySearch">搜索</el-button>
        <el-button type="primary" @click="detachMent">移除</el-button>
        <el-button type="primary" @click="jumpRoleAdd" v-allow="105">新增</el-button>
      </div>
      <div class="queryModular">
        <el-form ref="postForm"  size="mini" class="form-container">
          <el-form-item  label-width="130px"  label="角色名称:" class="postInfo-container-item">
            <el-select  default-first-option  v-model="name" clearable filterable placeholder="请选择">
              <el-option
                v-for="item in queryRoleNamesList"
                :key="item.roleId"
                :label="item.name"
                :value="item.name"
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
      :data="allRoles"
      style="width: 100%">
      <el-table-column
        prop="name"
        label="角色名称"
        width="300">
      </el-table-column>
      <el-table-column
        prop="createDate"
        label="创建日期"
        width="350">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button  type="text" size="small" @click="roleModify(scope.row)" v-allow="106">修改</el-button>
          <el-button type="text" size="small" @click="jumpStaffList(scope.row)">员工</el-button>
          <el-button type="text" size="small" @click="roleDelete(scope.row)" v-allow="107">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { queryAllRoles,queryRoleNames,deleteRoleById } from '@/api/systemList'
export default {
  name: "domain_management",
  data() {
    return {
      name:'',//角色名
      creatTime:'',//創建時間
      queryRoleNamesList: [],//角色名下拉菜單
      allRoles:[],//角色table列表
    }
  },
  created() {
    this.mySearch()
    this.queryRoleNames()
  },
  methods: {
    mySearch(){
      this.queryAllRoles()
    },
    detachMent(){
      this.name=''
      this.creatTime=''
      this.mySearch()
    },
    jumpStaffList(query){
      this.$router.push({path:'staff_management',query})
    },
    jumpRoleAdd(){
      this.$router.push({ path:'role_management_detail/1'})
    },
    roleModify(query){
      this.$router.push({ path:'role_management_detail/2',query})
    },
    roleDelete(res){
      let data= {
        id: res.roleId
      }
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteRoleById(data).then(res=>{
          if(res.success){
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.mySearch()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    queryRoleNames() {//獲取角色名菜單
      queryRoleNames().then(res => {
        if (res.success) {
          this.queryRoleNamesList = res.data
        }
      })
    },
    queryAllRoles() {//獲取列表
      let data={
        agencyId: 1,
        name:this.name
      }
      queryAllRoles(data).then(res => {
        if(res.success){
          this.allRoles=res.data
        }
      })
    }
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
