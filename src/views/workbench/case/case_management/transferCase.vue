<template>
  <div>
    <header>{{$route.meta.title}}</header>
    <div class="sectionWarp">
      <span class="" style="color: #6AA7FF;font-size: 18px;display: block;height: 40px"> 转案—选择案件</span>
      <el-form ref="ruleForm" :model="query" label-width="206px">
        <el-form-item label="案件文号:"  class="regNumber">
          <el-input v-model="query.agentNumStart " placeholder="请输入内容" @input="changeTextRange" clearable></el-input>
          <span>至</span>
          <el-input v-model="query.agentNumEnd" placeholder="请输入内容" clearable></el-input>
        </el-form-item>
        <el-form-item label="案件文号自定义输入">
          <el-input
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 10}"
            placeholder="每一行只能输入一个案件号，若想继续输入，需按“Enter”键，换行输入。"
            v-model="query.agentNums">
          </el-input>
        </el-form-item>
        <el-form-item label="商标号自定义输入">
          <el-input
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 10}"
            placeholder="每一行只能输入一个商标号，若想继续输入，需按“Enter”键，换行输入。"
            v-model="query.regNumber">
          </el-input>
        </el-form-item>
        <div class="button_wrap" style="display: flex;justify-content: center">
          <el-button class="exactButton" type="primary" size="medium" @click="getChangeCaseList">确定</el-button>
        </div>
      </el-form>
      <section>
        <el-table :data="caseFormData" border>
          <el-table-column type="index" width="50" label="序号" align="left">
            <template slot-scope="scope">
              <span>{{scope.$index+1}}</span>
            </template>
          </el-table-column>
          <el-table-column v-for='item in titleList' :label="item.title" :prop="item.type"  align="left" >
            <template slot-scope="scope">
              <span >{{scope.row[item.type]}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作"  align="left">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="deleteCase(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="button_wrap" style="margin-top:10px;display: flex;justify-content: center">
          <el-button class="exactButton" size="medium" @click="$router.go(-1)">取消</el-button>
          <el-button class="exactButton" type="primary" size="medium" @click="create2(1)">确定</el-button>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { getChangeCaseList,create2 } from '@/api/caseList'
export default {
  name: "transferCase",
  data() {
    return {
      query: {
        // agentNumStart: '',
        // agentNumEnd: '',
        // agentNums: '',
        // regNumber: ''
      },
      caseFormData:[],
      titleList:[{title:'前案案件',type:'agentNum'},{title:'前案案件类型',type:'caseType'},{title:'客户',type:'custName'},{title:'商标号',type:'regNumber'},{title:'商标名称',type:'tmName'},{title:'转案类型',type:'changeCaseType'}]
    }
  },
  created() {
    if(this.$route.query.agentNum){
      this.query.agentNums=this.$route.query.agentNum
      this.getChangeCaseList()
    }
  },
  methods: {
    changeTextRange(e) {
      this.$set(this.query, 'agentNumEnd', e)
    },
    getChangeCaseList(){
      getChangeCaseList(this.query).then(res=>{
        this.caseFormData=res.data.caseArray
      })
    },
    deleteCase(row){
      this.caseFormData=this.caseFormData.filter(item => item !== row)
    },
    create2(checkCase){
      if (this.caseFormData.length === 0) {
        return
      }
      const data={
        draftNumber:this.$route.params.draftNumber,
        caseArray:this.caseFormData,
        checkCase
      }
      create2(data).then(res => {
        if(res.messageType === -6){
          this.$confirm(res.message+' 请确认是否继续立卷?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.create2(0)
          })
          return
        }
        if (this.caseFormData.length === 1) {
          this.$router.replace({
            path: '/workbench/case/case_detail/' + res.data.caseIds + '/' + this.caseFormData[0].changeCaseType,
            query: { pageId: 100 ,taskType:res.data.taskType}
          })
        } else {
          this.$router.replace({ path: '/workbench/case/massfiling', query: { taskId: res.data.taskId, isChangeCase: 0 }})
        }
      })
    }
  },
  watch:{
    'query.agentNums'(n,o){
      this.query.agentNums=n.replace(/[,; ]/g,'\n')
    },
    'query.regNumber'(n,o){
      this.query.regNumber=n.replace(/[,; ]/g,'\n')
    }
  }
}
</script>

<style lang="scss" scoped>
  header{
    border-bottom: 1px solid rgba(163, 163, 163, 0.5);
    height: 60px;
    font-size: 26px;
    line-height: 80px;
    padding-left: 20px;
  }
  .sectionWarp{
    width: 80%;
    margin:5px 0 0 30px;
    border: 1px solid rgba(163, 163, 163, 0.5);
    padding: 20px;
  }
  .el-form{
    padding: 20px;
    margin-bottom:20px;
    box-shadow:0px 2px 5px 0px rgba(163, 163, 163, 0.35);
    .el-form-item{
      /deep/ .el-form-item__content{
        display: flex;
      }
    }
    .regNumber{
      width: 50%;
    }
  }
  .el-table{
    overflow: visible;
    /deep/ th{
      color: rgba(51, 51, 51, 1);
      background: rgba(187, 187, 187, 0.5);
    }
  }
</style>
