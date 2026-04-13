<template>
    <div>
      <header>
        按用户设置权限--{{$route.params.name}}
      </header>
      <div class="queryBlock">
        <el-input v-model="name" @keyup.enter="queryName">
          <template slot="prepend">快速查找</template>
        </el-input>
        <div class="button_wrap">
          <el-button size="small" type="primary" @click="queryName">查找</el-button>
          <el-button size="small" type="primary" @click="detachMent">移除</el-button>
          <el-button size="small" type="primary" @click="historyBack">返回</el-button>
          <!--<el-button size="small" type="primary" @click="fatherAndSon=!fatherAndSon">{{!fatherAndSon?'开启父子联动':'关闭父子联动'}}</el-button>-->
        </div>
      </div>
      <el-table
        ref="userMultipleTable"
        :data="modularData"
        tooltip-effect="dark"
        style="width: 100%"
        row-key="id"
        node-key="id"
        @select="handleSelectionChange"
        @select-all="handleSelectionChange">
        <el-table-column
          type="selection"
          width="155">
        </el-table-column>
        <el-table-column
          label="权限名称"
          prop="name"
          width="820">
        </el-table-column>
        <el-table-column
          prop="strStatus"
          label="状态"
          width="820">
        </el-table-column>
      </el-table>

    </div>
</template>

<script>
import {queryAllPermission, addPermissionForUser, queryPermissionsByUserId } from '@/api/systemList'
export default {
  name: "SetpermissionsbyUser",
  data(){
    return{
      name: '', // 查詢條件
      modularData:[], // 列表數據
      multipleSelection:[], // 多選數據
      fatherAndSon: true
    }
  },
  created() {
   // this.getDefaultList()
    this.getAllWfs()
  },
  methods:{
    queryName(){
      this.getAllWfs()
    },
    detachMent(){
      this.name=''
      this.getAllWfs()
    },
    historyBack(){
      this.$router.history.go(-1)
    },
    handleSelectionChange(val,row){
      if(!row){
        this.defaultMultipleSelection = this.unique(this.defaultMultipleSelection.concat(val), 'id')
        if (!val.length) {
          this.getMenuName(this.modularData).forEach(row => {
            this.defaultMultipleSelection = this.defaultMultipleSelection.filter(item => item.id !== row.id)
          })
        }
      } else {
        if(!val.find(d => d.id === row.id)){
          if(this.fatherAndSon){
            this.traversalRow(row,false)
          }else {
            this.defaultMultipleSelection=this.defaultMultipleSelection.filter(d=>d.id!==row.id)
          }
        } else {
          if(this.fatherAndSon){
            this.traversalRow(row,true)
          }else {
            this.defaultMultipleSelection.push(row)
          }
          this.defaultMultipleSelection = this.unique(this.defaultMultipleSelection, 'id')
        }
      }
      let data = {
        userId: this.$route.params.userId,
        strIds: this.defaultMultipleSelection.map(item=>item.id).join(',')
      }
      addPermissionForUser(data).then(res=>{

      })
    },
    unique(data, key) {
      const hash = {};
      const data2 = data.reduce((preVal, curVal) => {
        hash[curVal[key]] ? '' : hash[curVal[key]] = true && preVal.push(curVal);
        return preVal
      }, [])
      return data2
    },
    // traversalRow(row,bool){
    //   if(bool){
    //     this.defaultMultipleSelection.push(row)
    //   } else {
    //     this.defaultMultipleSelection=this.defaultMultipleSelection.filter(d=>d.id!==row.id)
    //   }
    //   if(row.children&&row.children.length){
    //     row.children.forEach(item=>{
    //       this.$refs.userMultipleTable.toggleRowSelection(item, bool)
    //       this.traversalRow(item,bool)
    //     })
    //   }
    // },
    traversalRow(row,bool) {
      if(bool){
        this.defaultMultipleSelection.push(row)
      } else {
        this.defaultMultipleSelection=this.defaultMultipleSelection.filter(d=>d.id!==row.id)
      }
      if(bool){
        if(row.parent!=0){
          this.$refs.userMultipleTable.toggleRowSelection(this.getMenuName(this.modularData).find(item=>item.id===row.parent), bool)
          this.traversalRow(this.getMenuName(this.modularData).find(item=>item.id===row.parent),bool)
        }
      } else {
        if(row.parent!=0){
          if(!this.getMenuName(this.modularData).find(item=>item.id===row.parent).children.some(item=>this.defaultMultipleSelection.find(itm=>itm.id==item.id))){
            this.$refs.userMultipleTable.toggleRowSelection(this.getMenuName(this.modularData).find(item=>item.id===row.parent), bool)
            this.traversalRow(this.getMenuName(this.modularData).find(item=>item.id===row.parent),bool)
          }
        }
      }
    },
    getDefaultList() {
      Promise.all([queryAllPermission(),queryPermissionsByUserId(this.$route.params.userId)]).then(res=>{
        this.defaultModularData=res[0].data
        this.defaultMultipleSelection=res[1].data.filter(item=>item!=null)
      })
    },
    getAllWfs(){
      let data={
        name:this.name,
      }
      Promise.all([queryAllPermission(data),queryPermissionsByUserId(this.$route.params.userId)]).then(res=>{
        if(!this.name){
          this.defaultModularData=res[0].data
          this.defaultMultipleSelection=res[1].data.filter(item=>item!=null)
        }
        this.modularData=res[0].data
        this.multipleSelection=res[1].data.filter(item=>item!=null)
        let List=this.getMenuName(this.modularData)
        this.$nextTick(_=>{
          List.forEach(row=>{
            if(this.multipleSelection.find(d => parseInt(row.id) === d.id)){
              this.$refs.userMultipleTable.toggleRowSelection(row, true)  // 设置默认选中
            }
          })
        })
      })
    },
    //将多级数组合并
    getMenuName(obj) {
      var arr = [];
      arr.push(obj)
      for (var i = 0, len = obj.length; i < len; i++) {
        arr.push(obj[i].children);
        if (obj[i].children != null && obj[i].children.length > 0) {
          var factorial= function () {
            var _obj = arguments[0];
            for (var j = 0, _len = _obj.length; j < _len; j++) {
              arr.push(_obj[j].children);
              if (_obj[j].children != null && _obj[j].children.length > 0) {
                factorial(_obj[j].children);
              }
            }
          }
          factorial(obj[i].children)
        }
      }
      var result=[]
      for (let i = 0; i < arr.length; i++) {
        result = result.concat(arr[i]);
      }
      return result;
    }
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
  .queryBlock {
    border: 1px solid rgba(191, 191, 191, 1);
    padding: 15px;
    margin-bottom: 13px;
    display: flex;
      /deep/.el-input {
        width: 40%;
        margin-right:50px ;
      }
      .button_wrap {
        display: flex;
      }

  }
  .el-table{
    border:1px solid rgba(191,191,191,1);
    padding-left: 10px;
  }
</style>
