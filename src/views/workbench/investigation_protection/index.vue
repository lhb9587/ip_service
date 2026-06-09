<template>
  <div style="height: 100%">
    <iframe
      :src="url"
      style="width: 100%; height: calc(100vh - 48px); border: none"
      @load="handleIframeLoad"
      ref="iframe"
    ></iframe>
  </div>
</template>

<script>
import { Loading } from 'element-ui'
import { getInfo } from '@/api/user'

export default {
  name: 'InvestigationProtection',
  data() {
    return {
      url: '',
      loadingInstance: null
    }
  },
  created() {
    const hostname = window.location.hostname
    const port = window.location.port || 8000
    const path = '/v2/management/investigation-protection'
    const query = new URLSearchParams()
    const routeQuery = { ...this.$route.query }
    if (this.$route.query.invtId) {
      query.set('invtId', this.$route.query.invtId)
    }
    if (this.$route.query.keyword) {
      query.set('keyword', this.$route.query.keyword)
    }
    query.set('layout', this.$route.query.layout || 'no')
    if (this.$route.query.todoList) {
      query.set('todoList', this.$route.query.todoList)
    }
    if (!this.$route.query.invtId) {
      query.set('t', new Date().getTime())
    }

    if (hostname === 'ips.wanhuida.cn') {
      this.url = `https://ips.wanhuida.cn${path}?${query.toString()}`
    } else if (hostname === 'localhost') {
      this.url = `http://localhost:9528${path}?${query.toString()}`
    } else {
      this.url = `http://${hostname}:${port}${path}?${query.toString()}`
    }

    if (routeQuery.keyword) {
      delete routeQuery.keyword
      this.$router.replace({
        path: this.$route.path,
        query: routeQuery
      })
    }
  },
  mounted() {
    this.loadingInstance = Loading.service({
      lock: true,
      text: '加载中...',
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
      } else if (['2', 'investigation-protection-close', 'investigation-protection-cancel'].includes(event.data.code)) {
        this.$router.push('/workbench/toDoTask?name=14')
      }
    }
  }
}
</script>
