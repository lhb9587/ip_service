<template>
  <el-dialog
    title="选择要导出的列表项"
    :visible.sync="dialogVisible"
    width="80%"
    :before-close="handleClose"
    :append-to-body="true">
    <div>
      <div class="el-checkbox-warp">
        <el-checkbox-group v-model="multipleSelect" @change="handleCheckedCitiesChange">
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
import { exportChartDataItems, selectColumn, queryPreference} from "@/api/dashboard.js";
import { downLoadAll } from '@/utils'
export default {
  props:{
    dialogVisible:{

    },
    panelId:{
      default:0
    },
    queryModuleData:{},
    idArray:{

    },
    propsArray:{

    },
    exportType:{
      defalut:2
    },
    exportQueryModel:{

    }
  },
   async created(){
   let {data} = await this.queryPreference()
     this.defaultMultipleSelect=data.map(item=>item.title)
     this.multipleSelect=this.defaultMultipleSelect
     this.isIndeterminate=true
     this.queryHerderList()
    if(localStorage.getItem('exportList')){
      let arr=JSON.parse(localStorage.getItem('exportList'))
      let listObj=arr.find(item => item.name==this.panelId)
      if(listObj){
        this.multipleSelect = listObj.exportList
        this.isIndeterminate=this.multipleSelect.length
      }
    }
  },
  name: "SelectOption",
  data(){
    return {
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
      const data = {userId:this.$store.getters.userId,panelId:this.panelId}
      return queryPreference(Object.assign(data, this.queryModuleData))
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
      let data;
      if(this.exportType==1){
        data=Object.assign(JSON.parse(this.exportQueryModel) ,{panelId:this.panelId, propertyArray: propertyArray.filter(item=>item)})
      } else if(this.exportType==2){
        if(!this.idArray.length){
          this.$message.error('请选择导出数据')
          return
        }
        data={panelId:this.panelId, idArray:this.idArray, propsArray: this.propsArray, propertyArray: propertyArray.filter(item=>item)}
      }
      if(this.radio==2){
        data.exportCust=1
        data.propertyArray=['custName']
      }
      // console.log(d)
      exportChartDataItems(this.$commonUtils.cleanNullAttr(Object.assign(data, this.queryModuleData))).then(res=>{
        downLoadAll({url:`ipdoc/${res.data}`})
        this.$emit('cancel')
        if(!localStorage.getItem('exportList')){
          let arr=[]
          arr.push({name:this.panelId,exportList:this.multipleSelect})
          localStorage.setItem('exportList',JSON.stringify(arr))
        } else {
          let arr=JSON.parse(localStorage.getItem('exportList'))
          if(arr.find(item=>item.name==this.panelId)) {
            arr.find(item => item.name==this.panelId).exportList = this.multipleSelect
            localStorage.setItem('exportList',JSON.stringify(arr))
          } else {
            arr.push({name:this.panelId,exportList:this.multipleSelect})
            localStorage.setItem('exportList',JSON.stringify(arr))
          }
        }
      })

    },
    queryHerderList() {
      selectColumn(Object.assign({ panelId: this.panelId }, this.queryModuleData)).then(res=>{
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
