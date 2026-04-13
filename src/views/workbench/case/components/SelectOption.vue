<template>
  <el-dialog
    title="选择要导出的列表项"
    :visible.sync="dialogVisible"
    width="80%"
    :before-close="handleClose"
    :append-to-body="true">
    <div>
      <el-radio-group v-if="caseBussIdList.find(item=>item==bussId)" v-model="radio" style="padding-bottom: 15px">
        <el-radio :label="1">导出全部案件信息</el-radio>
        <el-radio :label="2">导出客户</el-radio>
      </el-radio-group>
      <div class="el-checkbox-warp">
        <el-checkbox-group v-model="multipleSelect" @change="handleCheckedCitiesChange" class="custom-checkbox-group">
          <el-checkbox :disabled="radio==2" v-for="item in selectOptions" :label="item" :key="item">{{item}}</el-checkbox>
        </el-checkbox-group>
      </div>
    </div>

    <el-checkbox :disabled="radio==2" :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选/取消全选</el-checkbox>
    <span slot="footer" class="dialog-footer">
    <el-button @click="cancel">取 消</el-button>
    <el-button type="primary" @click="submit">导 出</el-button>
  </span>
  </el-dialog>
</template>

<script>
import { queryHerderList ,deriveList,queryPreference} from "@/api/caseList.js";
import { downLoadAll } from '@/utils'
export default {
  props:{
    moduleName:{

    },
    dialogVisible:{

    },
    bussId:{
      default:5
    },
    idArray:{

    },
    propsArray:{

    },
    exportType:{
      defalut:2
    },
    exportQueryModel:{

    },
    // defaultMultipleSelect:{
    //   default: ()=>([])
    // }
  },
   async created(){
   let {data} = await this.queryPreference()
     this.defaultMultipleSelect=data.map(item=>item.title)
     this.multipleSelect=this.defaultMultipleSelect
     this.isIndeterminate=true
     this.queryHerderList()
    if(localStorage.getItem('exportList')){
      let arr=JSON.parse(localStorage.getItem('exportList'))
      let listObj=arr.find(item => item.name==this.bussId)
      if(listObj){

        this.multipleSelect = listObj.exportList
        this.isIndeterminate=this.multipleSelect.length
      }
    }
  },
  name: "SelectOption",
  data(){
    return {
      caseBussIdList:[5,11,23,29,27,28,19],
      radio:1,
      defaultMultipleSelect:[],
      checkAll: false,
      multipleSelect:this.defaultMultipleSelect,
      isIndeterminate:false,
      selectOptions:[],
      defaultData:[]
    }
  },
  methods:{
    handleClose(){
      this.$emit('cancel')
    },
    cancel(){
      this.$emit('cancel')
    },

    queryPreference(){
      return queryPreference({userId:this.$store.getters.userId,bussId:this.bussId})
    },
    submit(){
      // let propertyArray=this.multipleSelect.map(item=>{
      //   if (this.defaultData.find(i=>i.COLUMN_COMMENT==item)){
      //     return  this.defaultData.find(i=>i.COLUMN_COMMENT==item).COLUMN_NAME
      //   } else {
      //     return false
      //   }
      // })
      let arr =  this.multipleSelect.filter(item=>this.defaultData.find(i=>i.COLUMN_COMMENT==item))
      let arr2=[]
      this.multipleSelect.forEach(item=>{
        if(!this.defaultMultipleSelect.includes(item)){
          arr2.push(item)
        }
      })

     let  propertyArray =  [...this.defaultMultipleSelect.reduce((pre,next)=>{
        if(arr.includes(next)){
          pre.push(next)
        }
        return pre
      },[]),...arr2].map(item=>{
            if (this.defaultData.find(i=>i.COLUMN_COMMENT==item)){
              return  this.defaultData.find(i=>i.COLUMN_COMMENT==item).COLUMN_NAME
            } else {
              return false
            }
          })
      if (this.moduleName === 'monitor') {
        propertyArray = this.defaultData.filter(item => propertyArray.includes(item.COLUMN_NAME)).map(item => item.COLUMN_NAME)
      }
      let data;
      if(this.exportType==1){
        data=Object.assign(JSON.parse(this.exportQueryModel) ,{bussId:this.bussId, propertyArray: propertyArray.filter(item=>item)})
      } else if(this.exportType==2){
        if(!this.idArray.length){
          this.$message.error('请选择导出数据')
          return
        }
        data={bussId:this.bussId, idArray:this.idArray, propsArray: this.propsArray, propertyArray: propertyArray.filter(item=>item)}
      }
      // 任务5137对承办工时和承办律师排序
      // 将对应字段取出来各自排序，再合并排序
      const regUser = /lawyer\dUserName/
      const regTime = /lawyer\dRecordTime/
      const userArray = data.propertyArray.filter(item => regUser.test(item)).map(item => ({
        no: item.replace(/.+(\d).+/, '$1'),
        field: item
      })).sort((a, b) => a.no - b.no)
      const timeArray = data.propertyArray.filter(item => regTime.test(item)).map(item => ({
        no: item.replace(/.+(\d).+/, '$1'),
        field: item
      })).sort((a, b) => a.no - b.no)
      const mergeArray = [...userArray, ...timeArray].sort((a, b) => a.no - b.no).map(i => i.field)
      data.propertyArray = data.propertyArray.filter(item => !regUser.test(item) && !regTime.test(item))
      data.propertyArray.push(...mergeArray)

      if(this.radio==2){
        data.exportCust=1
        data.propertyArray=['custName']
      }
      deriveList(this.$commonUtils.cleanNullAttr(data)).then(res=>{
        downLoadAll({url:`${res.data}`})
        this.$emit('cancel')
        if(!localStorage.getItem('exportList')){
          let arr=[]
          arr.push({name:this.bussId,exportList:this.multipleSelect})
          localStorage.setItem('exportList',JSON.stringify(arr))
        } else {
          let arr=JSON.parse(localStorage.getItem('exportList'))
          if(arr.find(item=>item.name==this.bussId)) {
            arr.find(item => item.name==this.bussId).exportList = this.multipleSelect
            localStorage.setItem('exportList',JSON.stringify(arr))
          } else {
            arr.push({name:this.bussId,exportList:this.multipleSelect})
            localStorage.setItem('exportList',JSON.stringify(arr))
          }
        }
      })

    },
    queryHerderList() {
      queryHerderList({ bussId: this.bussId }).then(res=>{
        this.selectOptions=res.data.map(item=>item.COLUMN_COMMENT)
        this.defaultData=res.data
      })
    },
    handleCheckAllChange(val) {
      this.multipleSelect = val ? this.selectOptions : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.selectOptions.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.selectOptions.length;
    }
  },
}
</script>

<style lang="scss" scoped>
  .el-checkbox-group {
    display: flex;
    flex-wrap:wrap ;
    flex-direction: column ;
    height: 450px;
    /*.el-checkbox{*/
    /*  width: 20%;*/
    /*}*/
  }
</style>

<style>
.custom-checkbox-group{
  height: 550px !important;
}
</style>
