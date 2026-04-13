<template>
  <div class="hrm-container">
    <div class="hrm-header">
      <span>奖金管理</span>
      <div class="right-button">
        <el-button size="medium" v-if="$store.getters.permissions.includes(431) && activeName == 'midYear'" @click="midYearBonusVisible = true">年中奖金导入</el-button>
        <el-button size="medium" v-if="$store.getters.permissions.includes(431) && activeName == 'yearEnd'" @click="yearEndBonusVisible = true">年终奖金导入</el-button>
        <el-button size="medium" v-if="$store.getters.permissions.includes(431) && activeName == 'partnerBonus'" @click="partnerBonusVisible = true">合伙人奖金导入</el-button>
        <el-button size="medium" v-if="$store.getters.permissions.includes(432) && activeName == 'extInfo'" @click="extInfoVisible = true">备注信息导入</el-button>
      </div>
    </div>
    <div class="hrm-main">
      <keep-alive>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane v-if="$store.getters.permissions.includes(431)" label="年中奖" name="midYear">
            <keep-alive>
              <MidYearList :key="midYearKey" v-if="activeName == 'midYear'"></MidYearList>
            </keep-alive>
          </el-tab-pane>
          <el-tab-pane v-if="$store.getters.permissions.includes(431)" label="年终奖" name="yearEnd">
            <keep-alive>
              <YearEndList :key="yearEndKey" v-if="activeName == 'yearEnd'"></YearEndList>
            </keep-alive>
          </el-tab-pane>
          <el-tab-pane v-if="$store.getters.permissions.includes(431)" label="合伙人奖金" name="partnerBonus">
            <keep-alive>
              <PartnerBonusList :key="partnerBonusKey" v-if="activeName == 'partnerBonus'"></PartnerBonusList>
            </keep-alive>
          </el-tab-pane>
          <el-tab-pane label="备注信息" name="extInfo">
            <keep-alive>
              <ExtInfoList :key="extInfoKey" v-if="activeName == 'extInfo'"></ExtInfoList>
            </keep-alive>
          </el-tab-pane>
        </el-tabs>
      </keep-alive>
    </div>
    <el-dialog title="年中奖金导入" :visible.sync="midYearBonusVisible" width="400px" :before-close="closeDialog">
      <MidYearBonus v-if="midYearBonusVisible" @closeDialog="closeDialog"></MidYearBonus>
    </el-dialog>
    <el-dialog title="年终奖金导入" :visible.sync="yearEndBonusVisible" width="400px" :before-close="closeDialog">
      <YearEndBonus v-if="yearEndBonusVisible" @closeDialog="closeDialog"></YearEndBonus>
    </el-dialog>
    <el-dialog title="合伙人奖金导入" :visible.sync="partnerBonusVisible" width="400px" :before-close="closeDialog">
      <PartnerBonus v-if="partnerBonusVisible" @closeDialog="closeDialog"></PartnerBonus>
    </el-dialog>
    <el-dialog title="备注信息导入" :visible.sync="extInfoVisible" width="400px" :before-close="closeDialog">
      <ExtInfo v-if="extInfoVisible" @closeDialog="closeDialog"></ExtInfo>
    </el-dialog>
  </div>
</template>

<script>
import MidYearBonus from './components/MidYearBonus';
import YearEndBonus from './components/YearEndBonus';
import PartnerBonus from './components/PartnerBonus';
import ExtInfo from './components/ExtInfo';
import MidYearList from './midYearList'
import YearEndList from './yearEndList'
import PartnerBonusList from './partnerBonusList'
import ExtInfoList from './extInfoList'
export default {
  name: 'index',
  data() {
    return {
      activeName: '',
      midYearBonusVisible: false,
      yearEndBonusVisible: false,
      partnerBonusVisible: false,
      extInfoVisible: false,
      midYearKey: 1,
      yearEndKey: 1,
      partnerBonusKey: 1,
      extInfoKey: 1
    }
  },
  created() {
    this.activeName = this.$store.getters.permissions.includes(431) ? 'midYear' : 'extInfo'
  },
  methods: {
    closeDialog() {
      // 更新相应标签页的 key，以触发组件重新渲染
      switch (this.activeName) {
        case 'midYear':
          this.midYearBonusVisible = false
          this.midYearKey += 1;
          break;
        case 'yearEnd':
          this.yearEndBonusVisible = false
          this.yearEndKey += 1;
          break;
        case 'partnerBonus':
          this.partnerBonusVisible = false
          this.partnerBonusKey += 1;
          break;
        case 'extInfo':
          this.extInfoVisible = false
          this.extInfoKey += 1;
          break;
      }
    }
  },
  components: {
    MidYearBonus,
    YearEndBonus,
    PartnerBonus,
    ExtInfo,
    MidYearList,
    YearEndList,
    PartnerBonusList,
    ExtInfoList
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
  /deep/ .el-tabs{
    background-color: #FFFFFF;
  }
  /deep/ .el-tabs__header{
    padding-left: 20px;
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
