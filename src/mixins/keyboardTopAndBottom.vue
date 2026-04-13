<template>

</template>

<script>
  function browserBehavior() {
    window.document.onkeydown=function(){
      // let list= [112,113,114,115,117,118,119,120,121,122,123]
      if([40,38].includes(event.keyCode)){
        Bus.$emit('keyboardEvents',event.keyCode)
      }
    }
  }
  import Bus from '@/utils/Bus'
  export default {
    name: "keyboardTopAndBottom",
    created() {
      browserBehavior()
    },
    methods: {
      initKeyboard(){
        Bus.$on('keyboardEvents', context => {
          if (this.getSelectedRows().length) {
            if (context == 40) {
              if (this.gridApi.rowModel.rootNode.childrenAfterSort[this.gridApi.rowModel.rootNode.childrenAfterSort.indexOf(this.gridApi.selectionController.lastSelectedNode) + 1]) {
                this.gridApi.rowModel.rootNode.childrenAfterSort[this.gridApi.rowModel.rootNode.childrenAfterSort.indexOf(this.gridApi.selectionController.lastSelectedNode) + 1].setSelected(true, true);
              }
            }
            if (context == 38) {
              if (this.gridApi.rowModel.rootNode.childrenAfterSort[this.gridApi.rowModel.rootNode.childrenAfterSort.indexOf(this.gridApi.selectionController.lastSelectedNode) - 1]) {
                this.gridApi.rowModel.rootNode.childrenAfterSort[this.gridApi.rowModel.rootNode.childrenAfterSort.indexOf(this.gridApi.selectionController.lastSelectedNode) - 1].setSelected(true, true);
              }
            }
            this.changeSelectedEvent&&this.changeSelectedEvent()
          }
      })
      }
    },
    beforeDestroy() {
      // Bus.$off('keyboardEvents')
    }
  }
</script>

<style scoped>

</style>
