<template>
  <div>
    <el-tabs type="border-card" v-model="activeName">
      <el-tab-pane
        v-for="(item,index) in tabList"
        :key="index"
        :label="item.name"
        :name="item.name"
      >
      </el-tab-pane>
      <div>
        <keep-alive>
          <component :is="activeType" :date-array="dateArray"></component>
        </keep-alive>
      </div>
    </el-tabs>
  </div>
</template>

<script>
import CaidingList from './CaidingList'
import RongyuList from './RongyuList'
import NeibuGuanliList from './NeibuGuanliList'
import RenliList from './RenliList'
import XuanchuanList from './XuanchuanList'
export default {
  name: 'newsList',
  props: ['date-array'],
  data() {
    return {
      activeName: '重要裁定及判决',
      activeType: 'CaidingList',
      tabList: [
        {name:'重要裁定及判决',type:'CaidingList'},
        {name:'荣誉和任职',type:'RongyuList'},
        {name:'宣传动态',type:'XuanchuanList'},
        {name:'人力资源动态',type:'RenliList'},
        {name:'内部管理',type:'NeibuGuanliList'}
      ],
    }
  },
  created() {
  },
  methods: {
  },
  watch:{
    activeName() {
      // 顶部tab名称转类型
      this.activeType = this.tabList.find(item => item.name == this.activeName).type
    }
  },
  components: {
    CaidingList,
    RongyuList,
    NeibuGuanliList,
    RenliList,
    XuanchuanList
  },
}
</script>

<style lang="scss" scoped>
/deep/ .el-dialog__body{
  padding: 10px 20px 20px 20px
}
.audit-detail /deep/ .el-dialog__body{
  padding: 0;
}
.el-table{
  /deep/ th{
    padding: 6px 0;
    color: #555555;
    background: #FAFAFA;
  }
}
</style>
