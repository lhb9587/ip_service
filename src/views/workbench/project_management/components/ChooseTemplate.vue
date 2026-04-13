<template>
  <div>
    <div>{{teptName}}<el-button type="primary" size="mini" @click="taskTemplateView=true">选 择</el-button></div>
    <el-dialog class="abow_dialog" :visible.sync="taskTemplateView" append-to-body width="80%" height="80%">
      <TemplateList ref="tempList" :teptId="lovingVue" @templateData="templateData" class="list"></TemplateList>
      <div slot="footer" class="dialog-footer">
        <!--                <el-button @click="taskTemplateView = false">取 消</el-button>-->
        <el-button @click="taskTemplateView=false">取 消</el-button>
        <el-button type="primary" @click="leadIn">选 择</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {queryTemplateList} from '@/api/templateManagement'
import TemplateList from '@/views/workbench/system_management/templateManagement/index'
export default {
  name: "ChooseTemplate",
  props:{
    lovingVue: {
      default: ''
    },
  },
  data(){
    return{
      newlovingVue: this.lovingVue,
      taskTemplateView:false,
      teptName:'',
      currentData:{}
    }
  },
  model:{
    prop: 'lovingVue',
    event: 'change'
  },
  created() {
    this.queryTemplateList()
  },
  methods:{
    queryTemplateList(){
      queryTemplateList ({pageNo:1, pageSize:1000}).then((res)=> {
        this.templateList = res.data
        this.teptName=this.templateList.find(item=>item.teptId==this.newlovingVue).teptName

      })
    },

    templateData(data){
      this.currentData = data
      // this.newlovingVue= this.currentData.teptId
      // this.teptName=this.currentData.teptName
    },
    cancel(){
      this.newlovingVue=this.lovingVue
      this.taskTemplateView=false
    },
    leadIn(){
      this.newlovingVue= this.currentData.teptId
      this.teptName=this.currentData.teptName
      this.taskTemplateView=false
    }
  },
  watch:{
    newlovingVue(n,o){
        if(n){
          this.teptName=this.templateList.find(item=>item.teptId==n).teptName
        }else {
          this.teptName=''
        }

        this.$emit('change',n)
    }
  },
  components:{
    TemplateList
  }
}
</script>

<style lang="scss" scoped>

</style>
