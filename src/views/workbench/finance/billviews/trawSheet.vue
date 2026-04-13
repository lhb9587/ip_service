<template>
  <div class="app-container">
    <header class='y-header'>{{$route.meta.title}}</header>
    <trawSheetDetails></trawSheetDetails>
  </div>
</template>

<script>
import trawSheetDetails from "./components/trawSheetDetails";

export default {
  name: "",
  components: { trawSheetDetails },
  props: {},
  data() {
    return {};
  },
  watch: {},
  computed: {},
  methods: {},
  created() {},
  mounted() {}
};
</script>
<style lang="scss" scoped>
/deep/ .el-tabs__item {
  text-align: center;
  width: 100px;
}
</style>
