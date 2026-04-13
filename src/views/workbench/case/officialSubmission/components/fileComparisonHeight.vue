<template>
  <!-- 弹出对话框组件 -->
  <el-dialog
    :visible.sync="visible"
    width="100%"
    :fullscreen="true"
    top="0"
    @close="handleClose"
    :append-to-body="true"
    custom-class="comparison-dialog"
  >
    <div class="comparison-container">
      <!-- DOC 内容展示区域 -->
      <div ref="pdf1Container" class="section-container" @scroll="syncScroll('pdf1')">
        <h3>DOC 预览</h3>
        <div v-for="(page, index) in pdf1Pages" :key="index" class="pdf-page">
          <canvas :ref="'pdf1Canvas' + index" class="pdf-canvas"></canvas>
        </div>
      </div>

      <!-- XML 内容展示区域 -->
      <div ref="pdf2Container" class="section-container" @scroll="syncScroll('pdf2')">
        <h3>XML 预览</h3>
        <div v-for="(page, index) in pdf2Pages" :key="index" class="pdf-page">
          <canvas :ref="'pdf2Canvas' + index" class="pdf-canvas"></canvas>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import pdfjsLib from 'pdfjs-dist';
import 'pdfjs-dist/web/pdf_viewer.css';
// 设置 PDF.js 的 worker 脚本路径
pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdfjs-dist/build/pdf.worker.js';

export default {
  props: {
    comparisonFiles: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      visible: true,
      pdf1Pages: [],  // 保存 PDF 1 的页面信息
      pdf2Pages: [],  // 保存 PDF 2 的页面信息
      syncingScroll: false,  // 控制滚动同步的标志
      pdfLoaded: false, 
    };
  },
  methods: {
    // 加载和渲染 PDF 文件
    async loadPDF(url, pdfPages, canvasRefPrefix) {
      const pdf = await pdfjsLib.getDocument(url).promise;

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        console.log('page',page)
        const viewport = page.getViewport({ scale: 1.5 });
        pdfPages.push({ page: i });

        await this.$nextTick();

        const canvas = this.$refs[canvasRefPrefix + (i - 1)][0];
        if (canvas) {
          const context = canvas.getContext("2d");
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const renderContext = {
            canvasContext: context,
            viewport: viewport,
          };
          await page.render(renderContext).promise;
        } else {
          console.error(`Canvas ${canvasRefPrefix + (i - 1)} not found`);
        }
      }
      this.pdfLoaded = true;
    },

    // 同步滚动功能
    syncScroll(source) {
      if (this.syncingScroll || !this.pdfLoaded) return;
      this.syncingScroll = true;

      const scrollContainer = this.$refs[source + "Container"];
      const targetContainer = this.$refs[source === "pdf1" ? "pdf2Container" : "pdf1Container"];

      if (source === 'pdf1') {
        targetContainer.scrollTop = scrollContainer.scrollTop;
      }

      setTimeout(() => (this.syncingScroll = false), 50);
    },

    // 关闭对话框时的操作
    handleClose() {
      this.visible = false;
      this.$emit("close");
    },
  },

  mounted() {
    this.$nextTick(() => {
      if (this.$refs.pdf1Container && this.$refs.pdf2Container) {
        this.loadPDF(
          "ipdoc"+this.comparisonFiles.doc,
          this.pdf1Pages,
          "pdf1Canvas"
        );
        this.loadPDF(
          "ipdoc"+this.comparisonFiles.xml,
          this.pdf2Pages,
          "pdf2Canvas"
        );
      } else {
        console.error("PDF 容器未找到");
      }
    });
  },
};
</script>

<style scoped>
.comparison-container {
  display: flex;
  height: 90vh;
  overflow: hidden;
}

.section-container {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  border-right: 1px solid #dcdcdc;
  height: calc(100vh - 80px);
}

.section-container:last-child {
  border-right: none;
}

.pdf-page {
  margin-bottom: 20px;
}

.pdf-canvas {
  width: 100%;
  display: block;
}

h3 {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}
</style>
