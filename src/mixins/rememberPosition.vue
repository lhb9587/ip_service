<template>

</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: 'rememberPosition',
    computed: {
      ...mapState({
        'positionInfoList': state => state.caseInformation.positionInfoList
      })
    },
    data() {
      return {
        routesList: ['timeLimit', 'civilSuit', 'case_search', 'patentList'],
        posObj: {
          name: '',
          scrollDistance: 0,
          currentRowIndex: 0
        }
      }
    },
    methods: {
      changePosition() {
        var obj = document.getElementsByClassName('ag-body-viewport')[0]
        obj.scrollTop = this.posObj.scrollDistance
        if (this.gridApi) {
          this.gridApi.rowModel.rootNode.allLeafChildren.find(i => i.childIndex === this.posObj.currentRowIndex).setSelected(true)
        }

      }
    },
    beforeRouteLeave(to, from, next) {
      if (this.routesList.includes(from.name)) { // 将该需求的路由名称放到数组里
        if (document.getElementsByClassName('ag-body-viewport')[0] && this.gridApi && this.gridApi.getSelectedNodes()[0]) {
          this.$store.commit('caseInformation/SET_POSITIONINFO', {
            name: from.name,
            scrollDistance: document.getElementsByClassName('ag-body-viewport')[0].scrollTop,
            currentRowIndex: this.gridApi.getSelectedNodes()[0].rowIndex
          })
        }
      }
      next()

    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        if (vm.routesList.includes(to.name)) { // 将该需求的路由名称放到数组里
          vm.posObj = vm.positionInfoList.find(item => item.name === to.name) || {
            scrollDistance: 0,
            currentRowIndex: 0
          }
          // vm.changePosition(posObj)
        }
      })
    }

  }
</script>

<style scoped>

</style>
