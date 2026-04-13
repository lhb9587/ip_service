export default {
  methods: {
    selectionChange(yIndex,flag) {
      const { states } = this.store;
      if(states.rowSelection==='single'){
        if(flag==true){
          states.selector.selectedYIndex = yIndex
          states.dataStatusList.forEach((item, index) => {
            if(index===states.selector.selectedYIndex){
              this.$set(states.dataStatusList[index], "checked", true);
            } else {
              this.$set(states.dataStatusList[index], "checked", false);
            }
          });
        }
      }
      const selection = this.store.states.showData.filter((item, index) => states.dataStatusList[index].checked);
      this.$emit('selection-change', selection);
      if (states.dataStatusList.every((item) => item.checked)) {
        this.$refs.theaderContent.checkedAll = true;
        this.$refs.fixedTheaderContent.checkedAll = true;
      } else {
        this.$refs.theaderContent.checkedAll = false;
        this.$refs.fixedTheaderContent.checkedAll = false;
      }
    },
  },
};
