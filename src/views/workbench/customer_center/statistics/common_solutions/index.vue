<template>
  <div style="margin-bottom: 15px">
    <chart-config v-if="$route.query.config"></chart-config>
    <charts-view v-if="!$route.query.config"></charts-view>

  </div>
</template>

<script>
  import ECharts from "vue-echarts";
  import "echarts/lib/chart/line";
  import "echarts/lib/chart/bar";
  import "echarts/lib/chart/pie";
  import "echarts/lib/chart/scatter";
  import "echarts/lib/chart/radar";
  import "echarts/lib/chart/map";
  import "echarts/lib/chart/tree";
  import "echarts/lib/chart/treemap";
  import "echarts/lib/chart/graph";
  import "echarts/lib/chart/gauge";
  import "echarts/lib/chart/funnel";
  import "echarts/lib/chart/parallel";
  import "echarts/lib/chart/sankey";
  import "echarts/lib/chart/boxplot";
  import "echarts/lib/chart/candlestick";
  import "echarts/lib/chart/effectScatter";
  import "echarts/lib/chart/lines";
  import "echarts/lib/chart/heatmap";
  import "echarts/lib/chart/pictorialBar";
  import "echarts/lib/chart/themeRiver";
  import "echarts/lib/chart/sunburst";
  import "echarts/lib/chart/custom";
  import "echarts/lib/component/grid";
  import "echarts/lib/component/polar";
  import "echarts/lib/component/geo";
  import "echarts/lib/component/singleAxis";
  import "echarts/lib/component/parallel";
  import "echarts/lib/component/calendar";
  import "echarts/lib/component/graphic";
  import "echarts/lib/component/toolbox";
  import "echarts/lib/component/tooltip";
  import "echarts/lib/component/axisPointer";
  import "echarts/lib/component/brush";
  import "echarts/lib/component/title";
  import "echarts/lib/component/timeline";
  import "echarts/lib/component/markPoint";
  import "echarts/lib/component/markLine";
  import "echarts/lib/component/markArea";
  import "echarts/lib/component/legendScroll";
  import "echarts/lib/component/legend";
  import "echarts/lib/component/dataZoom";
  import "echarts/lib/component/dataZoomInside";
  import "echarts/lib/component/dataZoomSlider";
  import "echarts/lib/component/visualMap";
  import "echarts/lib/component/visualMapContinuous";
  import "echarts/lib/component/visualMapPiecewise";
  import "echarts/lib/component/dataset";
  import theme from "../../../platformData/companyDashboard/components/shine.json"

  ECharts.registerTheme("ovilia-green", theme);
  import ChartsView from "./ChartsView";
  import ChartConfig from "./ChartConfig";

  export default {
    name: "index",
    components: {
      ChartConfig,
      ChartsView,
    },
    computed: {},
    watch: {},
    data() {
      return {}
    },
    created() {

    },
    mounted() {
    },
    methods: {}
  }
</script>

<style lang="scss" scoped>

</style>
