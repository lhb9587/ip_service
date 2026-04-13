<template>
    <router-view/>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: "case",
  computed: {
    ...mapGetters(['keepAliveList']),
  },
}
</script>

<style lang="scss">
  .el-table{
    /deep/ th{
      padding:5px 0
    }
    /deep/ td {
      padding: 0 ;
    }
}
</style>
