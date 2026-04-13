<template>
  <div>
    <trademark-writing-detail-view v-if="type === 'view'" :type="type" :atData="atData" :taskNo="taskNo"
                                   :caseIds="caseIds" @closetrademarkWriting="closetrademarkWriting"></trademark-writing-detail-view>
    <trademark-writing-detail-edit v-else :type="type" :caseIds="caseIds" :atData="atData" :taskIdList="taskIdList" :taskNo="taskNo"
                                   @closetrademarkWriting="closetrademarkWriting"></trademark-writing-detail-edit>
  </div>
</template>

<script>
  import TrademarkWritingDetailEdit from "./TrademarkWritingDetailEdit";
  import TrademarkWritingDetailView from "./TrademarkWritingDetailView";

  export default {
    name: "index",
    props: {
      taskIdList: {
        type: Array
      },
      taskNo: {
        type: [String, Number]
      },
      atData: {
        type: Object
      },
      type: {
        type: String,
        default: "create"
      },
      caseIds: {
        type: Array,
        default: () => []
      }
    },
    components: {TrademarkWritingDetailView, TrademarkWritingDetailEdit},
    methods: {
      closetrademarkWriting(flag) {
        this.$emit("closetrademarkWriting", flag === true)
      }
    }
  }
</script>

<style scoped>

</style>
