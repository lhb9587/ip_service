<template>
  <div class="el-breadcrumb_wrap">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>案件详情</el-breadcrumb-item>
      <transition-group name="breadcrumb">
        <el-breadcrumb-item v-for="(item,key) in breadcrumbList"  :key="key">{{item}}</el-breadcrumb-item>
      </transition-group>
    </el-breadcrumb>
  </div>
</template>

<script>
  export default {
    name: "BreadCrumbCase",
    props:{
      caseDetailFoemData:{}
    },
    data(){
      return{
        breadcrumbList:[]
      }
    },
    created() {

        this.getBreadcrumbList()
    },
    methods:{
      getBreadcrumbList(){
        if(this.caseDetailFoemData.lawsuitCasetypeNameArray&&this.caseDetailFoemData.lawsuitCasetypeNameArray.length){
          this.breadcrumbList= [this.caseDetailFoemData.lawsuitCasetypeNameArray.join(','),this.caseDetailFoemData.agentNum,this.caseDetailFoemData.caseName]
        }else {
          this.breadcrumbList= [this.caseDetailFoemData.caseType,this.caseDetailFoemData.agentNum,this.caseDetailFoemData.caseName]
        }

      }
    }
  }
</script>

<style lang="scss" scoped>
.el-breadcrumb_wrap{
  position: absolute;
  top: -20px;
  left: 10px;
}
</style>
