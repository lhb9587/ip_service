<template>
  <div class="app-container">
    <header class='y-header'>{{$route.meta.title}}</header>
    <billDetails></billDetails>
  </div>
</template>

<script>
import billDetails from "./components/insideBillDetails";

export default {
  name: "",
  components: { billDetails },
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
