<template>
  <el-dialog
    title="调查保护"
    append-to-body
    :close-on-click-modal="false"
    :visible.sync="dialogVisible"
    width="96%"
    top="24px"
    custom-class="investigation-protection-dialog-panel"
    class="investigation-protection-dialog"
  >
    <iframe
      v-if="dialogVisible"
      :src="iframeUrl"
      class="investigation-protection-iframe"
      @load="handleIframeLoad"
    ></iframe>
  </el-dialog>
</template>

<script>
import { Loading } from 'element-ui'
import { getInfo } from '@/api/user'

export default {
  name: 'InvestigationProtectionDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    caseData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      loadingInstance: null
    }
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible
      },
      set(value) {
        this.$emit('update:visible', value)
      }
    },
    iframeUrl() {
      const hostname = window.location.hostname
      const port = window.location.port || 8000
      const baseUrl = hostname === 'ips.wanhuida.cn'
        ? 'https://ips.wanhuida.cn'
        : hostname === 'localhost'
          ? 'http://localhost:9528'
          : `http://${hostname}:${port}`
      const query = new URLSearchParams({
        layout: 'no',
        action: 'create',
        caseId: this.caseData.caseId || '',
        agentNum: this.caseData.agentNum || '',
        t: String(new Date().getTime())
      })

      return `${baseUrl}/v2/management/investigation-protection?${query.toString()}`
    }
  },
  watch: {
    visible(value) {
      if (value) {
        this.loadingInstance = Loading.service({
          lock: true,
          text: '加载中...',
          background: 'rgba(255, 255, 255, 0.7)'
        })
      } else {
        this.closeLoading()
      }
    }
  },
  mounted() {
    window.addEventListener('message', this.handleIframeMessage)
  },
  beforeDestroy() {
    window.removeEventListener('message', this.handleIframeMessage)
    this.closeLoading()
  },
  methods: {
    closeLoading() {
      if (this.loadingInstance) {
        this.loadingInstance.close()
        this.loadingInstance = null
      }
    },
    handleIframeLoad() {
      this.closeLoading()
    },
    handleIframeMessage(event) {
      if (event.data.code === '-200') {
        getInfo()
      } else if (['investigation-protection-created', 'investigation-protection-close'].includes(event.data.code)) {
        this.dialogVisible = false
        if (event.data.code === 'investigation-protection-created') {
          this.$emit('saved')
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.investigation-protection-dialog {
  >>> .investigation-protection-dialog-panel {
    max-width: calc(100vw - 32px);
    margin-bottom: 0;
  }

  >>> .el-dialog__body {
    padding: 0;
    overflow: hidden;
  }
}

.investigation-protection-iframe {
  display: block;
  width: 100%;
  height: calc(100vh - 96px);
  border: none;
}
</style>
