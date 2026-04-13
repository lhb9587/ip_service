<template>
  <div class="case_management">
    <caseMaterialDetail ></caseMaterialDetail>
    <!--<header>{{$route.meta.title}}</header>-->
<!--    <Tabs v-model="activeName" @tab-click="handleClick">-->
<!--      <el-tab-pane label="商标" name="1">-->
<!--        -->
<!--      </el-tab-pane>-->
<!--      <el-tab-pane label="专利" name="2" ><caseMaterialDetail :caseTypeParty="4"></caseMaterialDetail>-->
<!--      </el-tab-pane>-->
<!--      <el-tab-pane label="保护" name="3"><caseMaterialDetail :caseTypeParty="1"></caseMaterialDetail></el-tab-pane>-->
<!--      <el-tab-pane label="诉讼" name="4">-->
<!--        <caseMaterialDetail :caseTypeParty="2"></caseMaterialDetail>-->
<!--      </el-tab-pane>-->
<!--    </Tabs>-->
  </div>
</template>

<script>
import caseMaterialDetail from './components/caseMaterialDetail.vue';
export default {
  name: "caseMaterial",
  data() {
    return {
      activeName: localStorage.getItem('field') ? localStorage.getItem('field') : '1',
    }
  },
  methods: {
    handleClick(){
      localStorage.setItem('field',this.activeName)
    }
  },
  components:{
    caseMaterialDetail
  }
}
</script>
<style>

</style>
