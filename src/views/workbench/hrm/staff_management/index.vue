<template>
  <div class="hrm-container">
    <div class="hrm-header">
      <span>人员管理</span>
      <div class="right-button">
        <el-button size="medium" v-if="$store.getters.permissions.includes(363)" @click="updatePersonnel = true">金蝶人员信息更新</el-button>
        <el-button size="medium" v-if="$store.getters.permissions.includes(363)" @click="updateContract = true">劳动合同信息更新</el-button>
        <el-button size="medium" v-if="$store.getters.permissions.includes(365)" @click="updateOtherInfo = true">收集人员信息更新</el-button>
        <el-button size="medium" v-if="$store.getters.permissions.includes(365)" @click="updateBonusInfo = true">员工薪资调整</el-button>
        <el-button size="medium" v-if="$store.getters.permissions.includes(363)" @click="auditList = true">待审核
          <div v-if="auditNum" class="notice">{{ auditNum }}</div>
        </el-button>
      </div>
    </div>
    <div class="hrm-main">
      <List></List>
    </div>
    <el-dialog title="金蝶人员信息更新" :visible.sync="updatePersonnel" width="400px" :close-on-click-modal="false" :close-on-press-escape="false">
      <UpdatePersonnel></UpdatePersonnel>
    </el-dialog>

    <el-dialog title="劳动合同信息更新" :visible.sync="updateContract" width="400px" :close-on-click-modal="false" :close-on-press-escape="false">
      <UpdateContract></UpdateContract>
    </el-dialog>

    <el-dialog title="员工薪资调整" :visible.sync="updateBonusInfo" width="400px">
      <UpdateBonus></UpdateBonus>
    </el-dialog>

    <el-dialog title="收集人员信息更新" :visible.sync="updateOtherInfo" width="400px">
      <UpdateOtherInfo></UpdateOtherInfo>
    </el-dialog>

    <AuditList v-if="auditList" @closeAuditList="closeAuditList()"></AuditList>
  </div>
</template>

<script>
import UpdatePersonnel from './components/UpdatePersonnel';
import UpdateContract from './components/UpdateContract';
import UpdateOtherInfo from './components/UpdateOtherInfo';
import UpdateBonus from './components/UpdateBonus';
import AuditList from './components/AuditList';
import List from './list'
import { queryUnAuditModifyRecordNum } from '@/api/hrmList.js'
export default {
  name: 'index',
  data() {
    return {
      updatePersonnel: false, // 金蝶人员信息更新
      updateContract: false, // 劳动合同信息更新
      updateOtherInfo: false, // 收集人员信息更新
      updateBonusInfo: false, // 员工薪资调整
      auditList: false,
      auditNum: '',
    }
  },
  created() {
    this.auditQuantity()
  },
  methods: {
    // 获取待审核数量
    auditQuantity() {
      queryUnAuditModifyRecordNum().then(res => {
        if (res.data){
          this.auditNum = res.data
        }
      })
    },
    // 关闭审核列表
    closeAuditList() {
      this.auditList = false
    }
  },
  components: {
    UpdatePersonnel,
    UpdateContract,
    UpdateOtherInfo,
    UpdateBonus,
    AuditList,
    List
  }
}
</script>

<style lang="scss" scoped>
.hrm-container {
  width: 100%;
  background-color: #F2F2F2;
}
.hrm-header{
  width: 100%;
  height: 50px;
  background-color: #FFFFFF;
  color: #333;
  span{
    font-size: 18px;
    line-height: 50px;
    font-weight: bold;
  }
  .right-button{
    margin-top: 6px;
    float: right;
  }
  button{
    font-size: 16px;
    i{
      width: 20px;
      border-radius: 3px;
      background: #409eff;
      color: #fff
    }
  }
  .notice{
    font-size: 12px;
    display: initial;
    border-radius: 18px;
    background-color: #52A0F5;
    padding: 2px 6px;
    color: #FFFFFF;
  }
}
.hrm-main{
  width:100%;
  padding: 15px;
  .main-list{
    width: 100%;
    padding: 0 10px 10px 10px;
    background-color: #FFFFFF;
  }
}
.hrm-search{
  font-size: 14px;
  height: 46px;
  line-height: 46px;
  width: 100%;
  a{
    color: #52A0F5;
  }
  i{
    padding-right: 5px;
  }
  .header-search{
    float: left;
    padding-top: 7px;
    margin-left: -10px;
  }
  .el-select /deep/ .el-input input{
    //width: 90px;
    font-weight: bold;
    border: 0px !important;
  }
}
</style>
