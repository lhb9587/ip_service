<template>
  <el-dialog :title="'添加工作组-'+dialogTableInfo.domainName" :visible.sync="dialogTableVisible" :before-close="handleClose" width="70%">
    <el-button style="float: right" type="primary" size="small" @click="jumpDomainSonAdd">添加</el-button>
    <el-table :data="gridData">
      <el-table-column width="50" label="序号" align="left">
        <template slot-scope="scope">
          {{gridData.length-scope.$index}}
        </template>
      </el-table-column>
      <el-table-column prop="NAME" label="工作组" width="250">
        <template slot-scope="scope">
          <div v-if="!scope.row.edit">{{scope.row.NAME}}</div>
          <div v-if="scope.row.edit">
            <el-multi-cascader
              selectChildren
            :show-all-levels="false"
            :options="myOptions"
            :is-two-dimension-value="true"
            multiple filterable  clearable
            :props="defaultParams"
            collapse-tags
            change-on-select v-model="SaveCascadeIndexCodes"> </el-multi-cascader>
            <!--<el-cascader-->
              <!--:options="myOptions"-->
              <!--:props="defaultParams"-->
              <!--clearable></el-cascader>-->
          </div>
          <!--<choiceindex v-if="scope.row.edit" :myOptions="SaveCascadeIndexCodes" :myTips="inputValue" @CheckedsIndexCodes="FromTreeCheckeds"></choiceindex>-->
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作">
        <template slot-scope="scope">
          <el-button  type="text" size="small" v-if="scope.row.edit" @click="updateDeptOrWorkDominId(scope.row)">保存</el-button>
          <el-button type="text" size="small" v-if="scope.row.edit" @click="cancalSonDomain(scope.row)">取消</el-button>
          <el-button type="text" size="small" v-if="!scope.row.edit" @click="domainSonDelete(scope.row)">解除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
import { queryWorkgroupsByDomainId ,deleteGroupOrDeptById ,queryDepts,updateDeptOrWorkDominId} from '@/api/systemList'
import {getLanglist} from '@/utils'
// import choiceindex from "@/components/MulitileCascader/index";
export default {
  name: "domain_mangement",
  props: ['dialogTableVisible', 'dialogTableInfo'],
  data() {
    return{
      gridData:[],//數據
      myOptions:[],//多選菜單默認屬性
      SaveCascadeIndexCodes:[],//多選子菜單數據id
      inputValue:'',//顯示數據
      flag:2,//1 部門2工作組
      defaultParams: {
        //級聯菜單默認
        value: "deptId",
        label: "name",
        children: "children",
        // checkStrictly: true,
        // multiple: true
      },
      myOptionsList:[],
    }
  },
  created() {
    this.queryWorkgroupsByDomainId()
    this.queryDepts()
  },
  methods:{
    handleClose(){
      this.$emit('handleClose',false)
    },
    queryWorkgroupsByDomainId(){
      let data={
        id:this.dialogTableInfo.id
      }
      queryWorkgroupsByDomainId(data).then(res=>{
        if(res.success){
          this.gridData=res.data.filter(item=>item.flag==2).reverse()
        }
      })
    },
    jumpDomainSonAdd(){
      if(this.gridData.length!==0&&this.gridData[0].edit){
        return
      }
      this.gridData.unshift({edit:true})
    },
    cancalSonDomain(){
      this.gridData.shift()
    },
    domainSonDelete(res){
      this.$confirm('你确定要删除该工作組吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteGroupOrDeptById(res).then(res=>{
          if (res.success){
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.queryWorkgroupsByDomainId()
            this.queryDepts()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    queryDepts() {
      queryDepts().then(res => {
        if (res.success) {
          this.getTreeData(res.data)
          this.myOptions =res.data
        }
      })
    },
    updateDeptOrWorkDominId(){
      let newList = getLanglist(this.SaveCascadeIndexCodes).filter(item =>String(item).includes('|'))

      if(!newList.length){
        this.$alert('您必须选择部门下的工作組才能进行保存', '提示', {
          confirmButtonText: '确定'
        })
        return
      }
      let data={
        domainId:this.dialogTableInfo.id,
        flag:this.flag,
        //strDeptIds:this.SaveCascadeIndexCodes.join(','),
        strWkgIds:newList.join(',').replace(/[|]/g, '')
      }
      updateDeptOrWorkDominId(data).then(res=>{
        if(res.success){
          this.queryWorkgroupsByDomainId()
          this.queryDepts()
          this.SaveCascadeIndexCodes=[]
        }
      })
    },
    getTreeData(data){
      // 循环遍历json数据
      if(!data) return
      for(var i=0;i<data.length;i++){
        if(data[i].groupList&&data[i].children){
          data[i].groupList.forEach(item=>{
            item.parent=item.deptId
            item.deptId='|'+item.wkgId
            item.name=item.groupName+'(组)'
          })
          data[i].children=[...data[i].children,...data[i].groupList]
        }else if(data[i].groupList&&!data[i].children){
          data[i].groupList.forEach(item=>{
            item.parent=item.deptId
            item.deptId='|'+item.wkgId
            item.name=item.groupName+'(组)'
          })
          data[i].children = data[i].groupList
        }
        this.getTreeData(data[i].children);
      }
     // return data
    },
    //整理數組
    // arrayCollation(arr){
    //   let array=[]
    //   let obj1={
    //     checked: false,
    //     children: [],
    //     disabled: false,
    //     label: "部门",
    //     multiple: false,
    //     value: 1,
    //   }
    //   let obj2 = {
    //     checked: false,
    //     children: [],
    //     disabled: false,
    //     label: "工作组",
    //     multiple: false,
    //     value:2
    //   }
    //   arr.forEach((item,index)=>{
    //     item.label=item.NAME
    //     item.value=item.id
    //     item.multiple=true
    //     item.checked=false
    //     if(item.flag==1){
    //       obj1.children.push(item)
    //     }else{
    //       obj2.children.push(item)
    //     }
    //   })
    //   array=[obj1,obj2]
    //   return array
    // },
    // FromTreeCheckeds(IndexCodes) {
    // //IndexCodes就是选中的item的数组
    //   let arr=[]
    //   if(IndexCodes.length){
    //     if (this.myOptions[0].children.map(item=>item.id).includes(IndexCodes[0])){
    //       IndexCodes.forEach(i=>{
    //         arr.push(this.myOptions[0].children.find(item=>item.id===i))
    //       })
    //       this.inputValue=arr.map(item=>item.NAME).join('/')
    //       this.myOptions[1].disabled=true
    //       this.flag=1
    //     }else{
    //       IndexCodes.forEach(i=>{
    //         arr.push(this.myOptions[1].children.find(item=>item.id===i))
    //       })
    //       this.inputValue= arr.map(item=>item.NAME).join('/')
    //       this.myOptions[0].disabled=true
    //       this.flag=2
    //     }
    //   }else {
    //     this.myOptions[1].disabled=false
    //     this.myOptions[0].disabled=false
    //   }
    //   this.SaveCascadeIndexCodes = IndexCodes;
    //
    // },
  },
  components: {
   // choiceindex,
  },
  watch:{
    SaveCascadeIndexCodes(n){
      if(!n.length){
        this.$nextTick(()=>{
          document.querySelector('.multi-base-input .el-input__inner').setAttribute('value','')
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
