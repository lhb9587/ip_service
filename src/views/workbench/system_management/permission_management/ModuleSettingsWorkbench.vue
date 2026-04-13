<template>
  <div>
    <header>
      模块操作权设置--工作台
    </header>
    <div class="queryBlock">

          <el-input v-model="name" @keyup.enter.native="searchBtn">
            <template slot="prepend">快速查找</template>
          </el-input>
          <div class="button_wrap">
            <el-button size="small" type="primary" @click="searchBtn">查找</el-button>
            <el-button size="small" type="primary" @click="detachMent">移除</el-button>
            <el-button size="small" type="primary" @click="historyBack">返回</el-button>
            <el-radio-group v-model="queryType" style="display: flex;justify-content: center;align-items: center;margin-left: 15px;">
              <el-radio label="role">角色</el-radio>
              <el-radio label="stuff">员工</el-radio>
            </el-radio-group>
          </div>
    </div>
    <el-table
      ref="multipleTable"
      :data="allRolesList"
      tooltip-effect="dark"
      style="width: 100%"
      row-key="roleId"
      @select="handleSelectionChange"
      @select-all="handleSelectionChange">
      <el-table-column
        type="selection"
        prop="roleId"
        width="55">
      </el-table-column>
      <el-table-column
        label="序号"
        width="120">
        <template slot-scope="scope">{{scope.$index + 1}}</template>
      </el-table-column>
      <el-table-column
        v-if="queryType === 'role'"
        prop="dataSource"
        label="领域/职能名称"
        width="120">
      </el-table-column>
      <el-table-column
        v-if="queryType === 'role'"
        prop="name"
        label="角色名称"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        v-if="queryType === 'stuff'"
        prop="name"
        label="姓名"
        show-overflow-tooltip>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
import {
  addPermissionForRole,
  addUserForPermission,
  queryAllRoles,
  queryRolesByPermissionId,
  queryUserIdByPermission
} from '@/api/systemList'
export default {
  name: "ModuleSettingsWorkbench",
  data() {
    return {
      queryType: 'role',
      multipleSelection: [],//多選數組
      allRolesList:[],//角色數據
      name:''//查詢名稱
    }
  },
  watch: {
    queryType(value) {
      if (value === 'role') {
        this.getAllWfs()
      } else {
        this.getStuff()
      }
    }
  },
  created(){
    this.getDefaultList()
    this.getAllWfs()
  },
  methods: {
    searchBtn() {
      if (this.queryType === 'role') {
        this.getAllWfs()
      } else {
        this.allRolesList = this.$store.getters.userList.filter(item => item.name.includes(this.name))
        this.$nextTick(() => {
          this.allRolesList.forEach(row=>{
            if(this.multipleSelection.find(d => row.userId === d.userId)){
              this.$refs.multipleTable.toggleRowSelection(row, true)  // 设置默认选中
            }
          })
        })
      }
    },
    detachMent(){
      this.name=''
      this.getAllWfs()
    },
    handleSelectionChange(val, row) {//選擇添加
      if (this.queryType === 'role') {
        if(!row){
          this.defaultMultipleSelection = Array.from(new Set([...this.defaultMultipleSelection,...val.map(item=>item.roleId)]))
          if (!val.length) {
            this.allRolesList.forEach(row => {
              this.defaultMultipleSelection = this.defaultMultipleSelection.filter(item => item !== row.roleId)
            })
          }
        } else {
          if (!val.find(d => d.roleId === row.roleId)){
            this.defaultMultipleSelection=this.defaultMultipleSelection.filter(roleId=>roleId!==row.roleId)
          }else {
            this.defaultMultipleSelection.push(row.roleId)
          }
        }
        let data ={
          id: this.$route.params.id,
          roleIds:this.defaultMultipleSelection.join(',')
        }
        addPermissionForRole(data).then(res=>{
          this.$message.success('设置成功!')
        })
      } else {
        if(!row){
          this.defaultMultipleSelection = Array.from(new Set([...this.defaultMultipleSelection.map(item => item.userId),...val.map(item=>item.userId)]))
          if (!val.length) {
            this.allRolesList.forEach(row => {
              this.defaultMultipleSelection = this.defaultMultipleSelection.filter(userId => userId)
            })
          }
        } else {
          if (!val.find(d => d.userId === row.userId)){
            this.defaultMultipleSelection = this.defaultMultipleSelection.filter(userId=>userId!==row.userId)
          }else {
            this.defaultMultipleSelection.push(row.userId)
          }
        }
        let data ={
          id: this.$route.params.id,
          userIds:this.defaultMultipleSelection.join(',')
        }
        addUserForPermission(data).then(res=>{
          this.$message.success('设置成功!')
        })
      }

    },
    getDefaultList(){
      let data={
        agencyId: 1,
        name:this.name
      }
      Promise.all([queryAllRoles(),queryRolesByPermissionId(this.$route.params.id)]).then(res=>{
        this.defaultAllRolesList=res[0].data
        this.defaultMultipleSelection=res[1].data
      })
    },
    getStuff() {
      queryUserIdByPermission({id: this.$route.params.id}).then(res => {
        this.allRolesList = this.$store.getters.userList
        this.multipleSelection = res.data
        this.defaultMultipleSelection = this.multipleSelection.map(item => item.userId)
        this.$nextTick(_=>{
          this.allRolesList.forEach(row=>{
            if(this.multipleSelection.find(d => row.userId === d.userId)){
              this.$refs.multipleTable.toggleRowSelection(row, true)  // 设置默认选中
            }
          })
        })
      })
    },
    getAllWfs(){
      let data={
        agencyId: 1,
        name:this.name
      }
      Promise.all([queryAllRoles(data),queryRolesByPermissionId(this.$route.params.id)]).then(res=>{
        this.allRolesList=res[0].data
        this.multipleSelection=res[1].data
        this.$nextTick(_=>{
          this.allRolesList.forEach(row=>{
            if(this.multipleSelection.find(d => parseInt(row.roleId) === d)){
              this.$refs.multipleTable.toggleRowSelection(row, true)  // 设置默认选中
            }
          })
        })
      })
    },
    historyBack(){
      this.$router.history.go(-1)
    },
  }
}
</script>

<style lang="scss" scoped>
  header{
    height:36px;
    font-size:18px;
    font-family:SourceHanSansCN-Normal;
    font-weight:400;
    color:rgba(38,42,47,1);
    line-height: 36px;
  }
  .queryBlock{
    border:1px solid rgba(191,191,191,1);
    padding: 15px;
    margin-bottom: 13px;
    display: flex;
    /deep/.el-input {
      width: 40%;
      margin-right:50px ;
    }
    .button_wrap{
      display: flex;
    }
  }
  .el-table{
    border:1px solid rgba(191,191,191,1);
    padding-left: 10px;
  }
</style>
