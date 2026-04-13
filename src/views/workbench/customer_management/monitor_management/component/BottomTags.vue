<template>
  <div>
    <div class="fl-ac-jc" style="margin-top: 15px;">
      <el-tag>当前期: {{bottomInfo.annNum}}</el-tag>
      <el-tag type="warning">监控商标: {{bottomInfo.exitsResult + bottomInfo.notExitsResult}}</el-tag>
      <el-tag type="success">有结果: {{bottomInfo.exitsResult}}</el-tag>
      <el-tag type="danger">无结果: {{bottomInfo.notExitsResult}}</el-tag>
    </div>
  </div>
</template>

<script>
export default {
  name: "BottomTags",
  props: {
    bottomInfo: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>

<style scoped lang="scss">

</style>
