<template>
  <div>
    <div ref="pdfContainer" style="overflow-y: auto; height: 500px;"/>
  </div>
</template>

<script >

import pdfjsLib from 'pdfjs-dist/build/pdf';
import 'pdfjs-dist/web/pdf_viewer.css';
pdfjsLib.GlobalWorkerOptions.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js';
export default {
  name: 'PdfViewer',
  props: {
    pdfUrl: {
      type: String,
      required: true
    },
    pageNumber: {
      type: Number,
      required: true
    }
  },
  mounted() {
    this.loadPdf();
  },
  methods: {
    loadPdf() {
      const loadingTask = pdfjsLib.getDocument(this.pdfUrl);
      console.log(this.pdfUrl);
      loadingTask.promise.then(
        (pdf) => {
          console.log('PDF loaded');
          // Fetch the first page of the PDF
          const pageNumber =this.pageNumber
          pdf.getPage(pageNumber).then((page) => {
            // Setup the canvas
            const canvas = document.createElement('canvas');
            const viewport = page.getViewport({ scale: 1.5 });
            canvas.style.width = `${viewport.width}px`;
            canvas.style.height = `${viewport.height}px`;
            canvas.width = viewport.width
            canvas.height = viewport.height
            this.$refs.pdfContainer.appendChild(canvas);
 
            // Render the page
            const renderContext = {
              canvasContext: canvas.getContext('2d'),
              viewport: viewport
            };
            page.render(renderContext).promise.then(() => {
              console.log('Page rendered');
            });
          });
        },
        (reason) => {
          console.error('Error loading PDF: ', reason);
        }
      );
    }
  }
}
</script>