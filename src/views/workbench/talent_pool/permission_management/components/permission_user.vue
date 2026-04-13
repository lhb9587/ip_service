<template>
  <div>
    <el-form ref="form" class ="queryBlock" label-width="100px">
      <el-form-item label="员工姓名:">
        <el-select default-first-option  v-model="queryData.talentCode" clearable filterable placeholder="请选择">
          <el-option
            v-for="item in namesList"
            :key="item.talentCode"
            :label="item.talentName"
            :value="item.talentCode"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="部门工作组">
        <el-multi-cascader
          ref="multiCascader"
          :show-all-levels="false"
          :options="departmentsList"
          :props="{value : 'deptCode', label: 'wkGroupName', children: 'children'}"
          multiple
          filterable
          clearable
          change-on-select
          collapse-tags
          selectChildren
          v-model="deptCode"> </el-multi-cascader>
      </el-form-item>
      <div class="button_wrap">
      <el-button size="small" type="primary" @click="queryName">查找</el-button>
      <el-button size="small" type="primary" @click="detachMent">移除</el-button>
      </div>
    </el-form>

    <el-table
      :data="usersList"
      style="width: 100%">
      <el-table-column
        prop="talentName"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="mainDeptName"
        label="部门名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="mainWorkGroup"
        label="工作组">
      </el-table-column>
      <el-table-column
        prop="mainPosName"
        label="岗位名称">
      </el-table-column>
      <el-table-column
        prop="empStatusStr"
        label="用工状态">
      </el-table-column>
      <el-table-column
        prop="address"
        label="操作">
        <template slot-scope="scope">
        <el-button  type="text" size="small"  @click="setting(scope.row,1)" >设置查看列表</el-button>
        <el-button  type="text" size="small"  @click="setting(scope.row,2)" >设置权限</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.pageNo"
      :limit.sync="listQuery.pageSize"
      @pagination="queryUsers"
    />
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import { queryTalentPersonList, queryDepartmentAll, queryPersonAll } from '@/api/hrmList'
export default {
  name: "permission_user",
  data(){
    return{
      queryData:{//查詢條件
        talentCode: '',
        deptCodes: '',
        isSearch: 0,
        tokenID: this.$store.getters.token
      },
      namesList: [],
      departmentsList:[],//部門列表下拉
      usersList:[],
      deptCode: [],
      listQuery:{
        pageNo:0,
        pageSize:10,
      },
      total:0
    }

  },
  created(){
    this.queryUsers()
    this.queryPersonAll()
    this.queryDepartmentAll()
  },
  methods:{
    queryName(){
      this.queryData.isSearch = 1
      this.queryUsers()
    },
    detachMent(){
      this.queryData = { }
      this.deptCode = []
      this.queryUsers()
    },
    queryPersonAll() {
      queryPersonAll().then(res => {
        if (res.success) {
          this.namesList = res.data
        }
      })
    },
    queryDepartmentAll() {
      queryDepartmentAll().then(res => {
        if (res.success) {
          this.departmentsList = res.data
        }
      })
    },
    queryUsers(){
      this.queryData.deptCodes=this.deptCode
      this.queryData.pageNo=this.listQuery.pageNo
      this.queryData.pageSize=this.listQuery.pageSize
      queryTalentPersonList(this.queryData).then(res=>{
        if (res.success){
          this.usersList=res.data
          this.total=res.total
        }
      })
    },
    setting(res, type) {
      if (type === 1) {
        this.$router.push('/workbench/talent_pool/SetpermissionsbyList/'+res.userId+'/'+res.talentCode+'/'+res.talentName)
      } else {
        this.$router.push('/workbench/talent_pool/SetpermissionsbyUser/'+res.userId+'/'+res.talentCode+'/'+res.talentName)
      }
    }
  },
  components:{
    Pagination
  }
}
</script>

<style lang="scss" scoped>
  .queryBlock{
    border:1px solid rgba(191,191,191,1);
    padding: 15px;
    margin-bottom: 13px;
    display: flex;
    position: relative;
    .button_wrap{
    width: 200px;
      position: absolute;
      right: 0;
    }
  }
  .el-table{
    border:1px solid rgba(191,191,191,1);
    padding-left: 10px;
  }
</style>
