<template>
  <el-row>
    <el-col class="createPost-container" :span="21">
      <el-tabs v-model="activeName" @tab-click="handleClickTab">
        <el-tab-pane name="first" label="成长档案">
          <div class="form-container">
            <GrowthArchives></GrowthArchives>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-col>
  </el-row>
</template>

<script>
import GrowthArchives from './components/GrowthArchives';
export default {
  data() {
    return {
      activeName: 'first',
    }
  },
  created() {
  },
  methods: {
    // 切换tab
    handleClickTab(tab, event) {

    }
  },
  components: {
    GrowthArchives
  }
}
</script>

<style lang="scss" scoped>
.createPost-container {
  position: relative;
  padding: 10px 2px;
  border: 1px solid #d7d7d7;
  margin: 15px 20px;
  min-height: 800px;

  > > > .el-tabs {
    .el-tab-pane {
      .form-container {

      }
    }
  }
}

.tilteSpan {
  font-size: 18px;
  padding: 15px 0px;
  color: #7199d5;
}
>>>.el-dialog__body{
  padding-top: 0;
}
</style>
