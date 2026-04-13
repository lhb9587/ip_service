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
import { Loading } from "element-ui";
import { getInfo } from "@/api/user";
export default {
  name: "TravelManagement",
  data() {
    return {
      url: "",
      loadingInstance: null,
    };
  },
  created() {
    const hostname = window.location.hostname;
    const port = window.location.port || 8000;
    if (hostname === "ips.wanhuida.cn") {
      this.url = `https://ips.wanhuida.cn/v2/businesstrip-management?layout=no&t=${new Date().getTime()}`; // 正式
    } else if (hostname === "localhost") {
      this.url = `http://localhost:9528/v2/businesstrip-management?layout=no&t=${new Date().getTime()}`; // 本地
    } else {
      this.url = `http://${hostname}:${port}/v2/businesstrip-management?layout=no&t=${new Date().getTime()}`; // 测试
    }
  },
  mounted() {
    // 显示 loading
    this.loadingInstance = Loading.service({
      lock: true,
      text: "加载中...",
      background: "rgba(255, 255, 255, 0.7)",
    });
    window.addEventListener("message", this.handleIframeMessage);
  },
  // 销毁
  beforeDestroy() {
    window.removeEventListener("message", this.handleIframeMessage);
  },
  methods: {
    handleIframeLoad() {
      // 关闭 loading
      if (this.loadingInstance) {
        this.loadingInstance.close();
        this.loadingInstance = null;
      }
    },
    handleIframeMessage(event) {
      // 1. 验证消息来源（防止跨域攻击）
      // if (event.origin !== "https://child-domain.com") return; // 替换为子页面的域名

      // 3. 执行父页面的操作，-200 需要调用获取用户信息接口
      if (event.data.code === '-200') {
        getInfo()
      }
    },
  },
};
</script>
