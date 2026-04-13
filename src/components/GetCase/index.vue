<template>
  <el-popover
    placement="right"
    trigger="click"
  v-model="state">
    <el-table :data="gridData" @row-click="rowClick" height="300">
      <el-table-column width="250" property="agentNum" label="案件文号"></el-table-column>
      <el-table-column width="200" property="custName" label="客户名称"></el-table-column>
      <el-table-column width="100" property="caseName" label="案件名称"></el-table-column>
    </el-table>
    <el-input
      slot="reference"
      type="textarea"
      :autosize="{ minRows: 5, maxRows: 5}"
      placeholder="请输入案件文号"
      v-model="newlovingVue"
      @input="getCase"
    >
    </el-input>
  </el-popover>

</template>

<script>
  import {getCase} from "../../api/feeList";

  export default {
    props:{
      placeholder:{
        default: '请输入案件文号'
      },
      lovingVue: {
        default: ''
      },
    },
    model:{
      prop: 'lovingVue',
      event: 'change'
    },
    data() {
      return {
        newlovingVue: this.lovingVue,
        state: false,
        gridData:[],
        inputList:[],
        loading:false
      }
    },
    name: "index",
    methods:{
      getCase(e) {
        if(e){
          this.inputList.push(e)
        }else{
          return
        }
        if(!this.loading){
          this.loading=true
          getCase({agentNumCaseName:e,pageSize:50}).then(res => {
            this.gridData = res.data
            this.$emit('getCaseIdList', this.gridData)
            this.loading=false
            this.state=true
            if(e!=this.inputList[this.inputList.length-1]){
              this.getCase(this.inputList[this.inputList.length-1])
            }
           //
          }).catch(()=>{
            this.loading=false
          })
        }
      },
      rowClick(row){
        this.newlovingVue=this.newlovingVue.split(/\n/g).filter(item=>!!item).map(item=>row.agentNum.includes(item)||row.caseName.includes(item)?row.agentNum:item).join('\n')
        this.getCase(this.newlovingVue)
      },
    },
    watch:{
      loading(n,o){
        if(!n){
          let str1=JSON.stringify(this.gridData.map(item => item.agentNum).sort((a, b) => a.localeCompare(b)))
          let str2=JSON.stringify(this.newlovingVue.split(/\n/).filter(item=>!!item).sort((a, b) => a.localeCompare(b)))

          if(str1==str2){

            this.state=false
          }
        }
      },
      newlovingVue(n,o){
        this.$emit('change',n)
      }
    }
  }
</script>

<style scoped>

</style>
