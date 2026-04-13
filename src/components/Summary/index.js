import Vue from 'vue';
import { mapGetters,mapState } from "vuex";
import vm from '@/main.js'
export default Vue.extend({
  template: `
    <div class="ag-status-name-value">
      <div v-if="router=='bill'">
        <span >本页总计&nbsp;账单总金额  {{summaryData[router]['billSum']|formatAmount}} </span>
        <span style="margin-left: 10px">账单收入 {{summaryData[router]['billIn']|formatAmount}} </span>
        <span style="margin-left: 10px">账单服务费 {{summaryData[router]['serviceCost']|formatAmount}}</span>
        <span style="margin-left: 10px">账单服务费(折扣后) {{summaryData[router]['serviceCostTotal']|formatAmount}}</span>
        <span style="margin-left: 10px">账单官费 {{summaryData[router]['officialCost']|formatAmount}}</span>
        <span style="margin-left: 10px">账单杂费 {{summaryData[router]['otherCost']|formatAmount}}</span>
        <span style="margin-left: 10px">外币金额 {{summaryData[router]['foreignSum']|formatAmount}}</span>
      </div>
      <div v-if="router=='workTime'" style="width: 100%;display: flex;justify-content: space-between">
        <div style="margin-left: 10px">本页
          <span style="color: #000000" v-if="count == filterCount">{{count}}</span>
          <span style="color: #000000" v-else>{{count}} of {{filterCount}}</span>
        </div>
        <div>
          <span style="margin-left: 10px">记录工时 {{summaryData[router]['time']}} </span>
          <span style="margin-left: 10px">核定工时 {{summaryData[router]['approvedTime']}}</span>
          <span style="margin-left: 10px">金额 {{summaryData[router]['amount']|formatAmount}}</span>
          <span style="margin-left: 10px">核定金额 {{summaryData[router]['approvedAmountCust']|formatAmount}}</span>
        </div>
      </div>
      <div v-if="router=='cost_list'">
        <span >总计 &nbsp;  {{summaryData[router]['total']|formatAmount}} </span>
      </div>
      <div v-if="router=='insidebill'">
        <span >总计 &nbsp;  {{summaryData[router]['total']|formatAmount}} </span>
      </div>
      <div v-if="router=='patentFee'">
        <span >金额总计:  {{summaryData[router]['payAmountSum']|formatAmount}} </span>
      </div>
    </div>
  `,
  data() {
    return {
      count: 0,
      filterCount: 0
      // router:this.$route.name
    };
  },
  created() {
    this.params.api.addEventListener('filterChanged', this.filterChanged.bind(this));
  },
  name:'Summary',
  beforeMount() {},
  mounted() {
  },
  computed:{
    ...mapState({
      'summaryData' : state => state.caseInformation.summaryData,

    }),
    router(){
      if(this.$route.name!=='bill'){
        return this.$route.name
      }else {
        if(this.$route.meta.activeName==1){
          return this.$route.name
        }else {
          return 'insidebill'
        }
      }

    }
  },
  methods: {
    filterChanged() {
      this.count = this.params.api.getModel().getRowCount();
      this.filterCount = this.params.api.getModel().rootNode.allLeafChildren.length
    },
  },
});
