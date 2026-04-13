<template>
  <el-dialog title="选择—工作组负责人" :visible.sync="dialogTableVisible" :before-close="handleClose" width="80%">
    <div class="queryModel">
      <el-input v-model="fullname"  placeholder="请输入员工姓名"></el-input>
      <el-button type="primary" @click="queryUsers">查询</el-button>
    </div>
    <p class="title">查询结果</p>
    <el-table :data="nameData"  highlight-current-row @current-change="handleCurrentChange">
      <el-table-column prop="fullname" label="员工姓名" width="250"   fixed>
      </el-table-column>
      <el-table-column prop="email" label="邮箱" width="250">
      </el-table-column>
      <el-table-column prop="deptName" label="部门" width="250">
      </el-table-column>
      <el-table-column prop="duty" label="角色" width="250">
      </el-table-column>
    </el-table>
    <div class="button_wrap">
      <el-button class="exactButton" :type="submitFlag?'primary':'info'" :disabled="!submitFlag" @click="submit">确定</el-button>
      <el-button class="exactButton" plain @click="handleClose">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { queryUsers} from '@/api/systemList'
export default {
  props:["dialogTableVisible"],
  name: "selectionHeader",
  data() {
    return {
      fullname: '',
      nameData: [],
      submitFlag: false,
      emitInfoUserId: ''
    }
  },
  methods: {
    queryUsers() {
      let data = {
        fullname: this.fullname
      }
      queryUsers(data).then(res => {
        if (res.success) {
          this.nameData = res.data.users
        }
      })
    },
    handleCurrentChange(e) {
      this.emitInfoUserId = e.userId
      if (e.userId == 0 || e.userId) {
        this.submitFlag = true
      } else {
        this.submitFlag = false
      }
    },
    submit() {
      this.$emit('getUserId',this.emitInfoUserId)
    },
    handleClose(){
      this.$emit('handleClose',false)
    }
  }
}
</script>

<style lang="scss" scoped>
  .queryModel{
    display: flex;
    .el-input{
      width: 400px;
      margin-right: 20px;
    }
  }
  .button_wrap {
    display: flex;
    justify-content: center
  }
  p.title{
    height: 30px;
    line-height: 30px;
  }
  .button_wrap .exactButton{
    width: 169px;
    height: 47px;
    margin: 20px ;
  }
</style>
