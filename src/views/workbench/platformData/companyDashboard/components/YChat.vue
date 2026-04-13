<template>
  <div class="fff" :id="options.id">
    <v-chart :autoresize="true" theme="ovilia-green" @click="handleClick" :options="option" />
  </div>

</template>

<script>
import qs from "qs";
import ECharts from "vue-echarts";
import "echarts/lib/chart/bar";
import "echarts/lib/chart/line";
import "echarts/lib/chart/pie";
import "echarts/lib/chart/map";
import "echarts/lib/chart/radar";
import "echarts/lib/chart/scatter";
import "echarts/lib/chart/effectScatter";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/polar";
import "echarts/lib/component/geo";
import "echarts/lib/component/legend";
import "echarts/lib/component/title";
import "echarts/lib/component/visualMap";
import "echarts/lib/component/dataset";
import "echarts/map/js/world";
import "zrender/lib/svg/svg";
import "echarts-gl";
import getOption from "./getOptions.js";
import theme from "./shine.json";
ECharts.registerTheme("ovilia-green", theme);
export default {
  name: "YChat",
  components: { "v-chart": ECharts },
  props: {
    type: {
      type: String,
      default: ""
    },
    options: {
      type: Object,
      default: () => {}
    }
  },
  created(){

  },
  data() {
    return {
      option:  getOption(this.type, this.options)
    };
  },
  watch: {
    options(n) {
      this.option = getOption(this.type, n);
    }
  },
  computed: {},
  methods: {
    handleClick(params){
      this.$emit('getParams',params)
    }
  },
  mounted() {}
};
</script>
<style lang="scss" scoped>
.fff {
  display: inline-block;
  position: relative;
  margin-bottom: 0em;
  margin-top: .5em;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  background-color: white;
  padding: 0.5em 0.5em;
  min-width: 20vw;
  width: 100%;
  .echarts {
    // width 40vw
    width: 100%;
    min-width: 300px;
    height:300px;
  }
}
</style>
