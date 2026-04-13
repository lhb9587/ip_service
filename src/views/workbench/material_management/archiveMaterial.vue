<template>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="档案" name="archives">
      <archiveList v-if="activeName == 'archives'"></archiveList>
    </el-tab-pane>
    <el-tab-pane label="样品" name="sample">
      <sampleList v-if="activeName == 'sample'"></sampleList>
    </el-tab-pane>
<!--    <el-tab-pane label="合同" name="contract">-->
<!--      <contractList v-if="activeName == 'contract'"></contractList>-->
<!--    </el-tab-pane>-->
  </el-tabs>
</template>
<script>
import archiveList from './components/archiveList.vue';
import sampleList from './components/sampleList.vue';
// import contractList from './components/contractList.vue';
export default {
  components: {
    archiveList,
    sampleList
  },
  data() {
    return {
      activeName: 'archives'
    };
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    }
  }
};
</script>
