<template>
  <div>
    <el-form ref="form" class ="queryBlock" label-width="80px">
      <el-form-item label="姓名">
        <el-input v-model="queryData.fullname"></el-input>
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="queryData.email"></el-input>
      </el-form-item>
      <el-form-item label="所属部门">
        <el-select  default-first-option  v-model="queryData.deptName" clearable filterable placeholder="请选择">
          <el-option
            v-for="item in departmentsList"
            :key="item.deptId"
            :label="item.name"
            :value="item.name"
          >
          </el-option>
        </el-select>
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
        prop="fullname"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱"
        width="180">
      </el-table-column>
      <el-table-column
        prop="deptName"
        label="所属部门">
      </el-table-column>
      <el-table-column
        prop="isActive"
        label="是否在职">
        <template slot-scope="scope">
        <span>{{scope.row.isActive?'是':'否'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="address"
        label="操作">
        <template slot-scope="scope">
        <el-button  type="text" size="small"  @click="setting(scope.row)" v-if="$store.getters.permissions.includes(110)">设置</el-button>
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
import { queryUsers } from '@/api/systemList'
export default {
  name: "permission_user",
  data(){
    return{
      queryData:{//查詢條件
        fullname: '',
        email: '',
        deptName: '',
      },
      departmentsList:[],//部門列表下拉
      usersList:[],
      listQuery:{
        pageNo:0,
        pageSize:10,
      },
      total:0
    }

  },
  created(){
    this.queryUsers()
  },
  methods:{
    queryName(){
      this.queryUsers()
    },
    detachMent(){
      this.queryData={ }
      this.queryUsers()
    },
    queryUsers(){

      this.queryData.pageNo=this.listQuery.pageNo
      this.queryData.pageSize=this.listQuery.pageSize
      queryUsers(this.queryData).then(res=>{
        if (res.success){
          this.departmentsList=res.data.departments
          this.usersList=res.data.users
          this.total=res.total
        }
      })
    },
    setting(res){
      this.$router.push('/workbench/system_management/SetpermissionsbyUser/'+res.userId+'/'+res.fullname)
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
