<template>
  <div class="investigation-protection-detail-box">
    <iframe
      ref="iframe"
      :src="url"
      style="width: 100%; height: 100%; border: none"
      @load="handleIframeLoad"
    ></iframe>
  </div>
</template>

<script>
import { Loading } from 'element-ui'
import { getInfo } from '@/api/user'

export default {
  name: 'InvestigationProtectionDetail',
  data() {
    return {
      url: '',
      loadingInstance: null
    }
  },
  created() {
    const hostname = window.location.hostname
    const port = window.location.port || 8000
    const invtId = this.$route.params.invtId
    const path = '/v2/management/investigation-protection'
    const query = `invtId=${invtId}&layout=no&todoList=1`

    if (hostname === 'ips.wanhuida.cn') {
      this.url = `https://ips.wanhuida.cn${path}?${query}`
    } else if (hostname === 'localhost') {
      this.url = `http://localhost:9528${path}?${query}`
    } else {
      this.url = `http://${hostname}:${port}${path}?${query}`
    }
  },
  mounted() {
    this.loadingInstance = Loading.service({
      lock: true,
      text: '\u52a0\u8f7d\u4e2d...',
      background: 'rgba(255, 255, 255, 0.7)'
    })
    window.addEventListener('message', this.handleIframeMessage)
  },
  beforeDestroy() {
    window.removeEventListener('message', this.handleIframeMessage)
  },
  methods: {
    handleIframeLoad() {
      if (this.loadingInstance) {
        this.loadingInstance.close()
        this.loadingInstance = null
      }
    },
    handleIframeMessage(event) {
      if (event.data.code === '-200') {
        getInfo()
      } else if (event.data.code === '2' || event.data.code === 'investigation-protection-processed') {
        this.$router.go(-1)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.investigation-protection-detail-box {
  height: calc(100vh - 60px);
  padding-top: 16px;
}
</style>
