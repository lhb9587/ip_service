<template>
    <div>
      <header>
        设置权限--{{$route.params.name}}
      </header>
      <el-table
        ref="userMultipleTable"
        :data="modularData"
        tooltip-effect="dark"
        style="width: 100%"
        row-key="permId"
        node-key="permId"
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
          width="650">
        </el-table-column>
      </el-table>

    </div>
</template>

<script>
import { queryPermissionAll, queryPersonPermissions, updatePersonPermission } from '@/api/hrmList'
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
    this.getAllWfs()
  },
  methods:{
    handleSelectionChange(val,row){
      if(!row) {

        this.defaultMultipleSelection = this.unique(this.defaultMultipleSelection.concat(val), 'permId')
        if (!val.length) {
          this.getMenuName(this.modularData).forEach(row => {
            this.defaultMultipleSelection = this.defaultMultipleSelection.filter(item => item.permId !== row.permId)
          })
        }
      } else {

        if(!val.find(d => d.permId === row.permId)){
          console.log(this.fatherAndSon)
          if(this.fatherAndSon){
            this.traversalRow(row,false)
          }else {
            this.defaultMultipleSelection=this.defaultMultipleSelection.filter(d=>d.permId!==row.permId)
          }
        } else {
          if(this.fatherAndSon){
            this.traversalRow(row,true)
          }else {
            this.defaultMultipleSelection.push(row)
          }
          this.defaultMultipleSelection = this.unique(this.defaultMultipleSelection, 'permId')
        }
      }
      let data = {
        talentCode: this.$route.params.talentCode,
        permIdList: this.defaultMultipleSelection.map(item=>item.permId)
      }
      console.log(data)
      updatePersonPermission(data).then(res=>{

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
    traversalRow(row,bool) {
      if(bool){
        this.defaultMultipleSelection.push(row)
      } else {
        this.defaultMultipleSelection=this.defaultMultipleSelection.filter(d=>d.permId!==row.permId)
      }
      if(bool){
        if(row.parent!=0){
          this.$refs.userMultipleTable.toggleRowSelection(this.getMenuName(this.modularData).find(item=>item.permId===row.parent), bool)
          this.traversalRow(this.getMenuName(this.modularData).find(item=>item.permId===row.parent),bool)
        }
      } else {
        if(row.parent!=0){
          if(!this.getMenuName(this.modularData).find(item=>item.permId===row.parent).children.some(item=>this.defaultMultipleSelection.find(itm=>itm.permId==item.permId))){
            this.$refs.userMultipleTable.toggleRowSelection(this.getMenuName(this.modularData).find(item=>item.permId===row.parent), bool)
            this.traversalRow(this.getMenuName(this.modularData).find(item=>item.permId===row.parent),bool)
          }
        }
      }
    },
    getAllWfs(){
      Promise.all([queryPermissionAll(),queryPersonPermissions(this.$route.params.userId)]).then(res=>{
        this.defaultMultipleSelection=res[1].data.permissions.filter(item=>item!=null)
        this.modularData=res[0].data
        this.multipleSelection=res[1].data.permissions.filter(item=>item!=null)
        let List=this.getMenuName(this.modularData)
        this.$nextTick(_=>{
          List.forEach(row=>{
            if(this.multipleSelection.find(d => parseInt(row.permId) === d.permId)){
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
