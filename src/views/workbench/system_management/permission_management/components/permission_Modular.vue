<template>
    <div>
      <div ref="form" class="queryBlock" label-width="80px">
          <el-input v-model="name" size="small" @keyup.enter="queryName">
            <template slot="prepend">权限名称</template>
          </el-input>
        <div class="button_wrap">
          <el-button size="small" type="primary" @click="queryName">查找</el-button>
          <el-button size="small" type="primary" @click="detachMent">移除</el-button>
        </div>
      </div>

      <el-table
        ref="modulTable"
        :data="modularData"
        tooltip-effect="dark"
        style="width: 100%"
        row-key="id"
       >
        <el-table-column
          label="权限名称"
          prop="name"
          width="820">
        </el-table-column>
        <el-table-column
          prop="strStatus"
          label="状态"
          width="820">
          <template slot-scope="scope">
            <el-button  type="text" size="small"  @click="setting(scope.row)" v-if="$store.getters.permissions.includes(110)">设置</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
</template>

<script>

import { queryAllPermission } from '@/api/systemList'
export default {
  name: "permission_Modular",
  data(){
    return{
      name:'',//查詢條件
      modularData:[],//列表數據
    }
  },
  created(){
    this.queryName()
  },
  methods:{
    setting(res){//設置跳轉
      this.$router.push('/workbench/system_management/ModuleSettingsWorkbench/'+res.id)
    },
    queryName(){//查詢
      this.queryAllPermission()
    },
    detachMent(){//清除
      this.name=''
      this.queryAllPermission()
    },
    queryAllPermission(){//請求數據
      let data={name:this.name}
      queryAllPermission(data).then(res=>{
        if(res.success){
          this.modularData=res.data
          this.expandAll()
        }
      })
    },
    expandAll () {//展開一級
      let timer= setInterval(()=>{
        if(this.$el.getElementsByClassName('el-table__expand-icon')[0]){
          const els = this.$el.getElementsByClassName('el-table__expand-icon')[0]
          els.click()
          clearInterval(timer)
        }
      },60)
    }
  },
}
</script>

<style lang="scss" scoped>
  .queryBlock{
    display: flex;
    border:1px solid rgba(191,191,191,1);
    padding: 15px;
    margin-bottom: 13px;
    justify-content: space-between;
    /deep/ .el-input{
      width: 350px;
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
