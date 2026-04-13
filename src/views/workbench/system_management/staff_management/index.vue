<template>
  <div class="staff">
    <h2 class="department_header">员工管理</h2>
    <div class="queryBlock">
      <div class="buttonWrap">
        <el-button type="primary" @click="mySearch">搜索</el-button>
        <el-button type="primary" @click="detachMent">移除</el-button>
        <el-button type="primary" @click="jumpStaffAdd" v-if="$store.getters.permissions.includes(102)">新增</el-button>
      </div>
      <div class="queryModular">
        <el-form ref="postForm"  size="mini" class="form-container">
        <el-form-item  label-width="130px"  label="员工姓名:" class="postInfo-container-item">
          <el-select  default-first-option  v-model="employeeName" clearable filterable placeholder="请选择">
            <el-option
              v-for="item in namesList"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
          <el-form-item  label-width="130px"  label="角色:" class="postInfo-container-item">
            <el-select  default-first-option  v-model="wkgRoleName" clearable filterable placeholder="请选择">
              <el-option
                v-for="item in roleNamesList"
                :key="item.roleId"
                :label="item.name"
                :value="item.name"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item  label-width="130px"  label="总部门:" class="postInfo-container-item">
            <el-select  default-first-option v-model="queryDeptByConditionName" clearable filterable  placeholder="请选择">
              <el-option
                v-for="item in queryDeptByConditionList"
                :key="item.deptId"
                :label="item.name"
                :value="item.name">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item  label-width="130px"  label="工作组:" class="postInfo-container-item">
            <el-select  default-first-option v-model="workgroupName" clearable filterable placeholder="请选择">
              <el-option
                v-for="item in queryWorkgroupNamesList"
                :key="item.wkgId"
                :label="item.groupName"
                :value="item.groupName">
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
          <el-form-item  label-width="130px"  label="是否在职:" class="postInfo-container-item">
              <el-radio v-model="isOrNotIncumbency" label="">全部</el-radio>
              <el-radio v-model="isOrNotIncumbency" label="1">在职</el-radio>
              <el-radio v-model="isOrNotIncumbency" label="0">离职</el-radio>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <el-table
      :data="staffList"
      style="width: 100%">
      <el-table-column
        prop="fullname"
        label="姓名"
        width="180">
        <template slot-scope="scope">
          <div style="cursor: pointer" @click="$router.push('see_staff_management_detail?userId='+scope.row.userId)">
            {{scope.row.fullname}}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="deptName"
        label="所属主部门"
        width="180">
      </el-table-column>
      <el-table-column
        prop="groupName"
        label="所属工作组">
      </el-table-column>
      <el-table-column
        prop="duty"
        label="岗位或角色">
      </el-table-column>
      <el-table-column
        prop="isIncumbency"
        label="是否在职">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="jumpStaffModify(scope.row)" type="text" size="small" v-if="$store.getters.permissions.includes(103)">修改</el-button>
          <el-button type="text" size="small" @click="deleteDeptId(scope.row)" v-if="$store.getters.permissions.includes(104)">删除</el-button>
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
import { queryUsers, queryRoleNames, queryUserNames, queryDeptByCondition, queryWorkgroupNames ,deleteUser} from '@/api/systemList'
export default {
  name: 'staff_management',
  data() {
    return {
      employeeName: '',//员工
      wkgRoleName: '',//工作组角色
      queryDeptByConditionName: '',//部门名
      workgroupName: '',//工作组名
      creatTime: '',//创建时间
      isOrNotIncumbency: '',//是否离职
      namesList: [],//员工名字列表
      roleNamesList: [],//工作组角色列表
      queryDeptByConditionList: [],//部门名列表
      queryWorkgroupNamesList: [],//工作组名列表
      staffList: [],//当前table列表数据,
      listQuery:{
        pageNo:0,
        pageSize:10,
      },
      total:0
    }
  },
  activated() {
    this.queryUsers()
  },
  created() {
    this.queryUserNames()
    this.queryRoleNames()
    this.queryDeptByCondition()
    this.queryWorkgroupNames()
    if(this.$route.query.queryDeptByConditionName||this.$route.query.roleId||this.$route.query.groupName){//從其他路徑進來後賦值
      this.queryDeptByConditionName=this.$route.query.queryDeptByConditionName
      this.wkgRoleName=this.$route.query.name
      this.workgroupName=this.$route.query.groupName
    }
    this.mySearch()
  },
  methods: {
    queryUsers() {
      const data = {
        fullname: this.employeeName,
        deptName: this.queryDeptByConditionName,
        isActive: this.isOrNotIncumbency,
        groupName: this.workgroupName,
        roleName: this.wkgRoleName,
        creatTime:this.formatDate(this.creatTime),
        pageNo:this.listQuery.pageNo,
        pageSize:this.listQuery.pageSize
      }
      queryUsers(data).then(res => {
        if (res.success) {
          this.staffList = res.data.users
          this.total=res.total
          this.staffList.forEach(item => {
            if (item.isActive) {
              item.isIncumbency = '是'
            } else {
              item.isIncumbency = '否'
            }
          })
        }
      })
    },
    mySearch() {
      this.listQuery.pageNo = 1
      this.queryUsers()
    },
    detachMent() {
      this.employeeName = ''
      this.queryDeptByConditionName = ''
      this.isOrNotIncumbency = ''
      this.workgroupName = ''
      this.wkgRoleName = ''
      this.listQuery.pageNo = 1
      this.queryUsers()
    },
    jumpStaffModify(query) {
      this.$router.push({ path: '/workbench/system_management/staff_management_detail/2', query: { userId: query.userId }})
    },
    jumpStaffAdd() {
      this.$router.push('/workbench/system_management/staff_management_detail/1')
    },
    queryUserNames() {
      queryUserNames().then(res => {
        if (res.success) {
          this.namesList = Array.from(new Set(res.data.map(item => item.fullname)))
        }
      })
    },
    queryRoleNames() {
      queryRoleNames().then(res => {
        if (res.success) {
          this.roleNamesList = res.data
        }
      })
    },
    queryDeptByCondition() {
      queryDeptByCondition().then(res => {
        if (res.success) {
          this.queryDeptByConditionList = res.data
        }
      })
    },
    queryWorkgroupNames() {
      queryWorkgroupNames().then(res => {
        if (res.success) {
          this.queryWorkgroupNamesList = res.data
        }
      })
    },
    deleteDeptId(res){
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUser(res.userId).then(res=>{
          if(res.success){
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.queryUsers()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });

    },
    unique(arr) {//根據userid去重
      const res = new Map();
      return arr.filter((a) => !res.has(a.userId) && res.set(a.userId, 1))
    },
    formatDate(time){
      return this.$commonUtils.formatDate(time)
    }
  },
  components:{
    Pagination
  }
}
</script>

<style scoped lang="scss">
  .staff  .department_header{
    width:72px;
    height:36px;
    font-size:18px;
    font-family:SourceHanSansCN-Normal;
    font-weight:400;
    color:rgba(38,42,47,1);
    line-height: 36px;
  }
  .staff  .queryBlock{
    border:1px solid rgba(191,191,191,1);
    padding: 15px;
    margin-bottom: 13px;
  }
  .staff .el-select{
    vertical-align: middle;
    margin-right:20px ;
  }
  .staff  .buttonWrap{
    float: right;
    margin-right: 58px ;
  }
  .staff .el-table{
    border:1px solid rgba(191,191,191,1);
    padding-left: 10px;
  }
  .staff .queryModular{
    margin-bottom:15px;
  }
  .staff .queryModular:nth-last-of-type(1){
    margin-bottom:0 ;
  }
  .form-container{
    width: 80%;
    .postInfo-container-item{
      display: inline-block;
    }
  }
</style>
