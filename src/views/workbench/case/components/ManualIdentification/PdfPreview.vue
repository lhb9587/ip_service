<template>
  <div  @keydown.enter="escClick">
  <div class="PdfPreview">
    <div class="topHeader">
      <span class="pdfTitle"  @click="takePdfDetail">{{pdfData[0].url.replace(/(.*\/)*([^.]+).*/ig,"$2")+ '.'+pdfData[0].url.replace(/.+\./,"")}}</span>
    </div>
    <i class="el-icon-close close" @click="$emit('closePdfPreview')"></i>
  <swiper :options="swiperOption">
    <swiper-slide v-for="(item,index) in pdfData">
      <swiper :options="swiperOption1" style="height: 900px">
        <iframe class="iframe" v-if="!['pdf'].some(itm=>item.url.replace(/.+\./,'').toLocaleLowerCase()==itm)" :src="item.url"></iframe>
        <swiper-slide v-else v-for="page in item.pages" :key="page" style="display: flex;justify-content: center;align-items: center">
<!--          <iframe class="iframe" v-if="iframeFlag" :src="pdfData[0].url"></iframe>-->

          <canvas :id="'the-canvas'+page+index" :key="'the-canvas'+page+index"></canvas>
        </swiper-slide>
        <div class="swiper-scrollbar"></div>
        <!--<div v-show="item.pages>1" class="swiper-button-prev-son el-icon-arrow-up" slot="button-prev"></div>-->
        <!--<div v-show="item.pages>1" class="swiper-button-next-son el-icon-arrow-down" slot="button-next"></div>-->
      </swiper>
    </swiper-slide>
    <div v-show="pdfData.length>1" class="swiper-button-prev swiper-button-prev2" slot="button-prev"></div>
    <div v-show="pdfData.length>1" class="swiper-button-next swiper-button-next2" slot="button-next"></div>
  </swiper>
  </div>
<!--    <div class="el-dialog__wrapper"  v-dialogDrag v-if="iframeFlag">-->


<!--    <div class="el-dialog" >-->
<!--    <div class="dialog__header">头</div>-->

<!--    </div>-->
<!--    </div>-->
    <el-dialog
      title="提示"
      append-to-body
      :visible.sync="iframeFlag"
      width="60%"
      height="800"
      :modal="false"
      top="0"
      :close-on-click-modal="false"
      v-dialogDrag
    >
      <iframe class="iframe" v-if="iframeFlag" :src="pdfData[0].url"></iframe>
    </el-dialog>
  </div>
</template>

<script>
import PDFJS from 'pdfjs-dist';
import 'pdfjs-dist/web/pdf_viewer.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
PDFJS.GlobalWorkerOptions.workerSrc = 'pdfjs-dist/build/pdf.worker.js'
export default {
  name: "PdfPreview",
  props:{
    pdfData:{},
    pageType:{
      default:2
    }
  },
  created(){
    this.pdfData.forEach((item,index)=>{
      this._loadFile(item.url,index)
    })
  },
  data(){
    return{
      swiperOption:{
        //  slidesPerView: 'auto',
        centeredSlides:true,
        spaceBetween: 10,
        //loop:true,
        observer:true, //修改swiper自己或子元素时，自动初始化swiper
        observeParents:true,
        direction: 'horizontal',
        speed:600, //config参数同swiper4,与官网一致
        navigation: {
          nextEl: '.swiper-button-next2',
          prevEl: '.swiper-button-prev2'
        }
      },
      swiperOption1:{
        slidesPerView: 'auto',
        // centeredSlides:true,
        spaceBetween: 10,
        observer:true, //修改swiper自己或子元素时，自动初始化swiper
        observeParents:true,
        loop:true,
        mousewheel: true,
        scrollbar: {
          el: '.swiper-scrollbar',
          draggable: true,
        },
        direction: 'vertical',
        speed:600, //config参数同swiper4,与官网一致
        navigation: {
          nextEl: '.swiper-button-next-son',
          prevEl: '.swiper-button-prev-son'
        },

      },
      iframeFlag:false
    }
  },
  methods:{
    _renderPage(num,index) {
      this.pdfDoc.getPage(num).then((page) => {
        console.log('the-canvas' + num + index);
        let canvas = document.getElementById('the-canvas' + num + index)
        let ctx = canvas.getContext('2d')
        let dpr = window.devicePixelRatio || 1
        let bsr = ctx.webkitBackingStorePixelRatio ||
          ctx.mozBackingStorePixelRatio ||
          ctx.msBackingStorePixelRatio ||
          ctx.oBackingStorePixelRatio ||
          ctx.backingStorePixelRatio || 1
        let ratio = dpr / bsr
        let viewport = page.getViewport(screen.availWidth / page.getViewport(3).width)
        canvas.width = viewport.width * ratio
        canvas.height = viewport.height * ratio
        canvas.style.width = '100%'//580*(this.pageType==2?1.3:1)+ 'px'
        canvas.style.height = 580*(this.pageType==2?1.3:1)*viewport.height/viewport.width + 'px'
        ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
        let renderContext = {
          canvasContext: ctx,
          viewport: viewport
        }
        page.render(renderContext)
        if (this.pdfData[index].pages > num) {
          this._renderPage(num + 1,index)
        }
      })
    },
    _loadFile(url,index) {
      if( ['pdf'].some(item=>url.replace(/.+\./,"").toLocaleLowerCase()==item)){
        PDFJS.getDocument(url).then((pdf) => {
          this.pdfDoc = pdf
          console.log(pdf)
          this.$set( this.pdfData[index],'pages',this.pdfDoc.numPages)
          this.$nextTick(() => {
            this._renderPage(1,index)
          })
        })
      }
    },
    takePdfDetail(){
      this.iframeFlag=true
     // var myWindow= window.open(this.pdfData[0].url, 'newwindow', 'height=800, width=600, top=200, left=600, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no')
     //  myWindow.focus();
      //downLoadAll({url:this.pdfData[0].url, target:'_blank'})
      // var myWindow=window.open('','','width=200,height=100');
      // myWindow.document.write("This is 'myWindow'");
      // myWindow.focus();
    },
    escClick(){
      console.log('escClick');
    }
  },
  components:{
    swiper, swiperSlide
  }
}
</script>

<style lang="scss" scoped>
  .swiper-button-prev-son{
    cursor: pointer;
    position: absolute;
    top: 10px;
    left: 50%;
    z-index: 10000;
    transform: translateX(-50%);
    text-align: center;
    font-size: 50px;
  }
  .swiper-button-next-son{
    cursor: pointer;
    position: absolute;
    bottom:  10px;
    left: 50%;
    z-index: 10000;
    transform: translateX(-50%);
    text-align: center;
    font-size: 50px;
  }
  .PdfPreview{
    background: rgba(0,0,0,0.6);
    padding: 73px 30px 30px 30px;
    position: relative;
    .close{
      position: absolute;
      right: 10px;
      top: 10px;
      color: #ffffff;
      font-size: 30px;
      cursor: pointer;
    }
  }
  .topHeader{
    position: absolute;
    top: 0;
    width: 100%;
    left: 0;
    height: 53px;
    line-height: 53px;
    background: rgba(30, 30, 30, 0.35);
    .pdfTitle{
      margin-left: 20px;
      color: #ffffff ;
      font-size:16px;
      cursor: pointer;
      &:hover{
        color: #2d8cf0;
        text-underline: #2d8cf0;
      }
    }
  }
  .iframe{
    width: 100%;
    height: 100%;
  }
  /deep/ .el-dialog{
    height: 800px;
    display: flex;
    flex-direction: column;
    .el-dialog__body{
      flex: 1;
    }
  }
  /*.swiper-container{*/
    /*overflow: visible;*/
    /*margin-top: 40px;*/
  /*}*/
</style>
