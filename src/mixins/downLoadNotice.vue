<template>

</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'downLoadNotice',
    computed: {
      ...mapGetters(['progressList'])
    },
    data() {
      return {
        notify: {}
      }
    },
    watch: {
      progressList: {
        handler(n) {
          let data = JSON.parse(JSON.stringify(n))
          data.forEach(item => {
            const domList = [...document.getElementsByClassName(item.path)]
            if (domList.find(i => i.className == item.path)) {
              domList.find(i => i.className == item.path).innerHTML = item.progress + '%'
            } else {
              if (item.progress === null) {
                this.$store.commit('caseInformation/DEL_PROGRESS', item.path)
                return
              }
              this.notify[item.path] = this.$notify.success({
                // title: 'Info',
                dangerouslyUseHTMLString: true,
                message: `<p style="width: 100px;">正在下载<span class="${item.path}" style="float: right">${item.progress}%</span></p>`,
                showClose: false,
                duration: 0
              })
              item.uniq = this.notify[item.path]
            }
            console.log(item.progress + '%', '-------------------------->')

            if (item.progress == 100) {
              this.notify[item.path].close()
              // delete this.notify[item.path]
              setTimeout(() => {
                delete this.notify[item.path]
              }, 1000)
              this.$store.commit('caseInformation/DEL_PROGRESS', item.path)
            }
          })
        },
        deep: true
      }
    }
  }
</script>

<style scoped>

</style>
