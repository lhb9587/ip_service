<template>
  <div class="right-drawer" id="mid" :style="{width: visible ? width + '%' : 0, borderRight: visible ? '2px solid #D6D6D6' : 'none'}">
    <div v-show="visible" class="resize" id="resize"></div>
    <div v-show="visible" class="close-btn el-icon-close" @click="closeDrawer"></div>
    <div v-show="visible" class="round-btn"></div>
    <div style="overflow: hidden;" v-if="visible">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'

  export default {
    name: "RightDrawer",
    props: {
      width: {
        type: Number,
        default: 30
      },
      visible: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      ...mapGetters(["sidebar"]),
    },
    watch: {
      'sidebar.opened': {
        handler(n) {
          // const f = this.dragControllerDiv()
          // window.addEventListener('resize', f)
          this.$nextTick(() => {
            this.dragControllerDiv()
          })
        },
        immediate: true
      }
    },
    created() {
      const f = this.dragControllerDiv
      window.addEventListener('resize', f)
    },
    destroyed() {
      const f = this.dragControllerDiv
      window.removeEventListener('resize', f)
    },
    mounted() {
      // this.dragControllerDiv()
    },
    methods: {
      closeDrawer() {
        this.$emit('close')
      },
      dragControllerDiv() {
        const that = this
        const resize = document.getElementById('resize')
        const mid = document.getElementById('mid')
        const box = document.getElementById('custom-list')
        const clientWidth = box.clientWidth
        that.$store.commit('caseInformation/SET_RIGHT_DRAWER_WIDTH', mid.offsetWidth)
        resize.onmousedown = function (e) {
          resize.style.background = '#C5E2FF'
          const startX = e.clientX
          resize.left = e.clientX
          document.onmousemove = function (e) {
            const endX = e.clientX
            let moveLen = resize.left + (endX - startX)
            const maxT = clientWidth - resize.offsetWidth

            if (moveLen < 200) moveLen = 200 // 左边区域的最小宽度为200px
            if (moveLen > maxT - clientWidth / 2) moveLen = maxT - clientWidth / 2 //右边区域最小宽度为150px

            resize.style.left = moveLen // 设置左侧区域的宽度

            const len = that.sidebar.opened ? 190 : 60
            mid.style.width = (clientWidth - moveLen + len) + 'px'
            that.$store.commit('caseInformation/SET_RIGHT_DRAWER_WIDTH', clientWidth - moveLen + len)
          }
          // 鼠标松开事件
          document.onmouseup = function (evt) {
            resize.style.background = '#d6d6d6'
            document.onmousemove = null
            document.onmouseup = null
            resize.releaseCapture && resize.releaseCapture()
          }
          resize.setCapture && resize.setCapture()
          return false
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  .right-drawer {
    position: absolute;
    right: 0;
    top: -1px;
    bottom: 0;
    /*overflow: hidden;*/
    height: calc(100vh - 40px);
    background-color: #F2F2F2;
    transition: width ease-in-out 0.4s;
    z-index: 1;

    .close-btn {
      position: absolute;
      top: 5px;
      left: -20px;
      width: 20px;
      height: 25px;
      background-color: #AAAAAA;
      /*font-weight: bold;*/
      color: white;
      font-size: 20px;
      line-height: 25px;
      text-align: center;
      cursor: pointer;
    }

    .round-btn {
      position: absolute;
      top: 5px;
      left: -30px;
      width: 25px;
      height: 25px;
      border-radius: 12.5px;
      clip: rect(0px 12.5px 25px 0px);
      background-color: #AAAAAA;
    }
  }


  #resize {
    position: absolute;
    height: calc(100vh - 40px);
    width: 2px;
    background-color: #d6d6d6;
    cursor: w-resize;
    /*background: #fff;*/
    transition: all 0.3s ease-in-out;
    z-index: 1;

    &:hover {
      background-color: #C5E2FF;
      width: 5px;
    }
  }

  /*右侧div'样式*/
  .mid {
    /*float: left;*/
    /*width: 68%; !*右侧初始化宽度*!*/
    /*height: 100%;*/
    /*background: #fff;*/
  }
</style>
