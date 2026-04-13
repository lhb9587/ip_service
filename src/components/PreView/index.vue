<template>
  <div>
    <a class="downMsg" :href="$route.query.address" v-if="downFlag === 'true'">下载该文件</a>
    <div v-if="!msgUrl" id="preview" class="msgWrap" :class="type=='excel'?'excel':'word'">
      <div class="attachmentsWrap" v-if="attachments.length">
        <i class="el-icon-paperclip"></i>附件
        <div class="attachmentsItem_wrap">
          <div  class="attachmentsItem" v-for="item in attachments" style="cursor: pointer" @click="downLoad(item)">
            {{item.fileName}}
          </div>
        </div>
      </div>

      <div v-if="msgFlag" v-html="msgText" class="msgWrap">
      </div>
      <!--    <div v-if="parsedEmlData.html" v-html="parsedEmlData.html"></div>-->
      <!--    {{parsedEmlData.html}}-->
    </div>
    <div v-if="msgUrl" style="width: 1400px;margin: 0 auto;padding-top: 50px;">
      <div class="attachmentsWrap" style="width: 1400px;" v-if="attachments.length">
        <i class="el-icon-paperclip"></i>附件
        <div class="attachmentsItem_wrap">
          <div  class="attachmentsItem" v-for="item in attachments" style="cursor: pointer" @click="downLoad(item)">
            {{item.fileName}}
          </div>
        </div>
      </div>
      <div>
        <p>发送人:{{msgData.from}}</p>
        <p>收件人:{{msgData.to}}</p>
        <p>抄送至:{{msgData.cc}}</p>
      </div>
      <iframe id="Iframe" :src="msgUrl" frameborder="0"  width="1400" :height="clientHeight">

      </iframe>
    </div>
  </div>
</template>

<script>
// import * as emlFormat from 'eml-format';
// import * as Codec from 'emailjs-mime-codec';
import html2Canvas from 'html2canvas'
import JsPDF from 'jspdf'
import XLSX from 'xlsx'
import mammoth from 'mammoth'
import axios from 'axios'
import _ from 'underscore'
import { Message } from './msg'
import jsFileDownload from 'js-file-download'
var iconv=require('iconv-lite')
import { viewMsg } from "@/api/caseList";
import downLoadNotice from '@/mixins/downLoadNotice.vue'
export default {
  name: "index",
  mounted() {
    this.loadPage(this.$route.query.address)
  },
  mixins: [downLoadNotice],
  data(){
    return {
      downFlag: 'true',
      msgUrl: '',
      msgData: {},
      docFlag:false,
      msgFlag:false,
      msgText:'',
      attachments:[],
      emlData:'',
      type:''
    }
  },
  computed:{
    clientHeight() {
      return document.documentElement.clientHeight
    }
  },
  methods:{
    loadPage(str){
      if(str.replace(/.+\./,"").toLocaleLowerCase().includes('docx')){
        this.docFlag=true
        this.type='word'
        this.loadWord(str)
      }else if(str.replace(/.+\./,"").toLocaleLowerCase().includes('xls')||str.replace(/.+\./,"").toLocaleLowerCase().includes('xlsx')) {
        this.docFlag=true
        this.type='excel'
        this.loadExcel(str)
      }else if(['eml', 'msg'].includes(str.replace(/.+\./,"").toLocaleLowerCase())){
        // this.msgFlag=true
        // this.readMsg(str)
        let flag = '';
        let flagValue = '';
        if (this.$route.query.downFlag) {
          this.downFlag = this.$route.query.downFlag
        }
        if(this.$route.query.mailId){
          flag = 'mailId'
          flagValue = this.$route.query.mailId
        }else if (this.$route.query.materialId){
          flag = 'materialId'
          flagValue = this.$route.query.materialId
        }
        let params = {[flag]: flagValue}
        if (this.$route.query.hoursFile == 1) {
          params.hoursFile = 1
        }
        flagValue && viewMsg(params).then(res=>{
          this.msgData = res.data
          this.msgUrl = '/ipdoc'+res.data.bodyUrl
          this.attachments = res.data.attchList || []
          if(this.attachments && this.attachments.length){
            this.attachments = this.attachments.map(item=>({
              fileName: item.replace(/.+\//g, ''),
              url: item
            }))
          }
        })
      }else {
        location.replace(this.$route.query.address)
      }
      // if(str.replace(/.+\./,"").toLocaleLowerCase().includes('docx')){
      //   this.docFlag=true
      //   this.loadWord(str)
      // }else if(str.replace(/.+\./,"").toLocaleLowerCase().includes('xls')||str.replace(/.+\./,"").toLocaleLowerCase().includes('xlsx')) {
      //   this.loadExcel(str)
      // }else{
      //   location.replace(this.$route.query.address)
      // }
    },

    readMsg(str){
      // var quotedPrintable = require('quoted-printable');
      // axios.get('/AsposeMessage.eml').then(response => {
      //   this.emlData = response.data.toString(); // 不 .toString() 可能有些稀奇古怪的问题
      //   this.emlData = this.emlData.replace(/(=\?[\s\S]*?\?=)/g, function (str, a) { // 正则替换一些地方(目前只发现了 subject 邮件主题是这样)的 =?...?=
      //     return escape(Codec.mimeWordsDecode(a)); // 返回解码后又被 escape 编码的字符串,另外大家都说 escape 弃用了,那看要不要换成 encodeURI 吧
      //   });
      // });

      axios.get(str,{responseType: "arraybuffer", headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=Utf-8"
        }}).then(res=>{

        // console.log( quotedPrintable.decode(new TextEncoder('GBK').encode(res.data.toString())));
        var buf = new Uint8Array(res.data)
        var message = new Message(buf)
        message.attachments.forEach(item=>{
          var blob = new Blob([item.data])
          item.blob = URL.createObjectURL(blob);
        })
        let messageConentId = message.attachments.filter(item=>item.isHidden)
        this.attachments = message.attachments.filter(item=>!item.isHidden)
        this.msgText=`<div><p style="margin-bottom:10px ">发送人: ${message.senderName}</p><p style="margin-bottom:10px ">收件人: ${message.xe_zm_haz_h_}</p><p style="margin-bottom:10px ">抄送至: ${message.__jzh_____jc}</p></div>`+ message.bodyHtmlText.replace(/cid:.*?"/g,(word)=> {
          for(var i=0;i<messageConentId.length;i++){
           if(word.slice(4,-1)==messageConentId[i].contentId){
              return messageConentId[i].blob+'"'
           }
          }
        })
      })
    },
    downLoad(item){
      let downData = {
        url: `ipdoc${item.url}`,
        downLoad: item.fileName.replace(/\..+/,'')
      }
      this.downFlag === 'true' && this.$commonUtils.downLoadAll(downData)
      // let fileName=''
      // fileName=item.fileName
      // let blob = new Blob([item.data])
      //   jsFileDownload(blob,fileName.replace(/(.*\/)*([^.]+).*/ig,"$2",'')+'.'+fileName.replace(/.+\./,""));
      },
    loadWord(str){
      let that=this
      function transformElement(element) {
        if (element.children) {
          var children = _.map(element.children, transformElement);
          element = { ...element, children: children };
        }
        if (element.type === 'paragraph') {
          element = transformParagraph(element);
        }
        return element;
      }

      function transformParagraph(element) {
        if (element.alignment === 'center' && !element.styleId) {
          return { ...element, styleName: 'center' };
        } else {
          return element;
        }
      }

      var options = {
        styleMap: ['u => u', "p[style-name='center'] => p.center"],
        transformDocument: transformElement,
      };
      axios.get(str,{ responseType: 'blob', headers: {
          "Content-Type": "application/json; charset=utf-8",
        }}).then( (res)=> {
        var reader = new FileReader();
        reader.onloadend = function(event) {
          var arrayBuffer = reader.result;
          mammoth.convertToHtml({arrayBuffer: arrayBuffer}).then( (resultObject)=> {

             // document.getElementById('preview').innerHTML = resultObject.value
            console.log(resultObject);
            that.convertHTMLtoPDF('ddd',resultObject.value)
            console.log(resultObject.value);

          })
        };
        reader.readAsArrayBuffer(res.data);
      })
    },
     convertHTMLtoPDF(fileName,html) {
      var fileName = fileName + ".pdf";
      var html1 = `<!DOCTYPE html>
                  <html>
                    <head>
                      <style>
                        /*table {*/
                        /*    font-family: arial, sans-serif;*/
                        /*    border-collapse: collapse;*/
                        /*    width: 100%;*/
                        /*}*/
                        /*td, th {*/
                        /*    border: 1px solid #dddddd;*/
                        /*    text-align: left;*/
                        /*    padding: 8px;*/
                        /*}*/
                        /*tr:nth-child(even) {*/
                        /*    background-color: #dddddd;*/
                        /*}*/
                      </style>
                    </head>
                    <body>
                      `+html+`
                    </body>
                  </html>`;
       document.getElementById('preview').innerHTML=html1
       // html2Canvas(html, {
       //   allowTaint: true
       // }).then(function (canvas) {
       //     let contentWidth = canvas.width
       //     let contentHeight = canvas.height
       //     let pageHeight = contentWidth / 592.28 * 841.89
       //     let leftHeight = contentHeight
       //     let position = 0
       //     let imgWidth = 595.28
       //     let imgHeight = 592.28 / contentWidth * contentHeight
       //     let pageData = canvas.toDataURL('image/jpeg', 1.0)
       //     let PDF = new JsPDF('', 'pt', 'a4')
       //     if (leftHeight < pageHeight) {
       //       PDF.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight)
       //     } else {
       //       while (leftHeight > 0) {
       //         PDF.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
       //         leftHeight -= pageHeight
       //         position -= 841.89
       //         if (leftHeight > 0) {
       //           PDF.addPage()
       //         }
       //       }
       //     }
       //   console.log(PDF);
       //   // PDF.save(fileName + '.pdf')
       //   }
       // )
    },
    loadExcel(str){
      axios.get(str,{ responseType: 'blob', headers: {
          "Content-Type": "application/json; charset=utf-8",
        }}).then(function (res) {
        var reader = new FileReader();
        reader.onload = function (e) {
          var data = e.target.result;
          var wb = XLSX.read(data, {
            type: 'binary'
          });
          console.log(wb)
          var worksheet = wb.Sheets[wb.SheetNames[0]];

          document.getElementById('preview').innerHTML = XLSX.utils.sheet_to_html(worksheet);
        }
        reader.readAsBinaryString(res.data);
      })
    }
  },
  // computed:{
  //   parsedEmlData() {
  //     let temp = this.emlData;
  //     temp = Codec.quotedPrintableDecode(temp, 'GB2312'); // 整体解码,替换原来的手动正则匹配
  //     let returnValue = {};
  //     emlFormat.read(temp, (err, data) => {
  //       if (err) {
  //         console.log(err);
  //       } else {
  //         data.subject = unescape(data.subject); // 把之前的 escape 编码的数据解码回中文,不走这一步整体解码后这里很可能不会被解码,还有些其他原因,有兴趣的可以试试,同理,之前用 encodeURI 的话这里就用 decodeURI
  //         returnValue = data;
  //       }
  //     });
  //     console.log(returnValue);
  //     return returnValue;
  //   },
  // }
}
</script>

<style lang="scss" scoped>
  #preview /deep/ {
    table {
      border-collapse: collapse;
      width: 100%;
      border: 1px solid #c6c6c6 !important;
      margin-bottom: 20px;
    }

    table td {
      border-collapse: collapse;
      border-right: 1px solid #c6c6c6 !important;
      border-bottom: 1px solid #c6c6c6 !important;
      padding: 5px 9px;
      font-size: 12px;
      font-weight: normal;
      text-align: center;
      word-break: break-all;
      border-top:3px solid #FFFFFF;
      border-bottom:2px solid #B3DE94;
      padding:9px;
    }
    table tr:nth-child(even){
      background-color:#fff !important;
    }
    table tr:nth-child(odd){
      background-color: #f8f8f8 !important;
    }
    table tr:nth-child(1){
      border-collapse: collapse;
      border-right:1px solid #c6c6c6 !important;
      border-bottom:1px solid #c6c6c6 !important;
      background-color:#ddeeff !important;
      padding:5px 9px;
      font-size:14px;
      font-weight:normal;
      text-align:center;
    }

  }
  /*#preview /deep/ {*/
  /*  table{*/
  /*    border-collapse: collapse;*/
  /*    width:100%;*/
  /*    border:1px solid #c6c6c6 !important;*/
  /*    margin-bottom:20px;*/
  /*  }*/
  /*  table td{*/
  /*    border-collapse: collapse;*/
  /*    border-right:1px solid #c6c6c6 !important;*/
  /*    border-bottom:1px solid #c6c6c6 !important;*/
  /*    padding:5px 9px;*/
  /*    font-size:12px;*/
  /*    font-weight:normal;*/
  /*    text-align:center;*/
  /*    word-break: break-all;*/
  /*  }*/
  /*  table tr:nth-child(even){*/
  /*    background-color:#fff !important;*/
  /*  }*/
  /*  table tr:nth-child(odd){*/
  /*    background-color: #f8f8f8 !important;*/
  /*  }*/
  /*  table tr:nth-child(1){*/
  /*    border-collapse: collapse;*/
  /*    border-right:1px solid #c6c6c6 !important;*/
  /*    border-bottom:1px solid #c6c6c6 !important;*/
  /*    background-color:#ddeeff !important;*/
  /*    padding:5px 9px;*/
  /*    font-size:14px;*/
  /*    font-weight:normal;*/
  /*    text-align:center;*/
  /*  }*/
  /*}*/
  /*.doc{*/

  /*  width: 70%;*/
  /*  margin: 0 auto;*/
  /*}*/
  /*p{*/
  /*  border: none;*/
  /*  margin: 0;*/
  /*  padding: 0;*/
  /*  line-height:6vw;*/
  /*  margin-bottom:1vw*/
  /*}*/
  /*#preview.doc>p:first-child{*/
  /*  width: 100%;*/
  /*  text-align: center;*/
  /*  font-size: 5.8667vw;*/
  /*  font-weight: 700;*/
  /*  margin-top: 5vw;*/
  /*  margin-bottom: 7vw;*/
  /*}*/
  /*#preview.doc /deep/ {*/
  /*  display: flex;*/
  /*  flex-direction: column;*/
  /*  flex: 1;*/
  /*  !*overflow-x: hidden;*!*/
  /*  !* padding: 5.3333vw; *!*/
  /*  background: #fff;*/
  /*  -webkit-overflow-scrolling: touch;*/
  /*  .center{*/
  /*    text-align: center;*/
  /*  }*/
  /*  pre {*/
  /*    font-size: 3.2vw;*/
  /*    transform: scale(0.8);*/
  /*    transform-origin: 0;*/
  /*  }*/

  /*  .title {*/
  /*    width: 100%;*/
  /*    text-align: center;*/
  /*    font-size: 5.8667vw;*/
  /*    font-weight: 700;*/
  /*    margin-top: 5vw;*/
  /*    margin-bottom: 7vw;*/
  /*  }*/

  /*  .service-wrap-title {*/
  /*    color: #384369;*/
  /*    font-size: 4.2667vw;*/
  /*    display: inline-block;*/
  /*    padding: 1.3333vw 0;*/
  /*    font-weight: 600;*/
  /*  }*/

  /*  .service-wrap-ele {*/
  /*    margin: 0;*/
  /*    color: #384369;*/
  /*    padding-bottom: 0;*/
  /*  }*/

  /*  .service-wrap-ele span {*/
  /*    min-width: 12vw;*/
  /*    display: inline-block;*/
  /*    text-align: center;*/
  /*    border-bottom: solid 1px;*/
  /*    line-height: 0.9;*/
  /*    padding: 0 6px;*/
  /*  }*/

  /*  table {*/
  /*    color: #384369;*/
  /*    border-right: 0.2667vw solid #384369;*/
  /*    border-bottom: 0.2667vw solid #384369;*/
  /*    border-color: #384369;*/
  /*    border-collapse: collapse;*/
  /*    border-spacing: 0;*/
  /*    margin: 2vw 0;*/
  /*    width: 100%;*/
  /*    box-sizing:border-box;*/
  /*  }*/

  /*  table td {*/
  /*    border-left: 0.2667vw solid #384369;*/
  /*    border-top: 0.2667vw solid #384369;*/
  /*    width: 53.3333vw;*/
  /*    text-align: left;*/
  /*    height: 9.3333vw;*/
  /*  }*/

  /*  th{*/
  /*    text-align: center !important;*/
  /*  }*/

  /*  tr>td:first-child strong {*/
  /*    text-align: center !important;*/
  /*    width: 100%;*/
  /*    display: block;*/
  /*  }*/

  /*  th,*/
  /*  td {*/
  /*    padding: 0 1.2vw;*/
  /*    font-weight: normal;*/
  /*    word-wrap: break-word;*/
  /*    word-break: break-all;*/
  /*    box-sizing: border-box;*/
  /*    -webkit-box-sizing: border-box;*/
  /*  }*/

  /*  .bottom-btn-container {*/
  /*    height: 13.3333vw;*/
  /*    background: #fff;*/
  /*    border-top: 0.1333vw solid #f0eded;*/
  /*    display: flex;*/
  /*    justify-content: space-between;*/
  /*    padding: 0 5.3333vw;*/
  /*    box-sizing: border-box;*/
  /*  }*/

  /*  .bottom-btn-container span {*/
  /*    display: inline-block;*/
  /*    line-height: 13.3333vw;*/
  /*    font-size: 3.2vw;*/
  /*    color: #6685ed;*/
  /*  }*/
  /*}*/
  /deep/ *{
    word-break: break-word !important;
  }
.msgWrap{
  width: 700px;
  margin: 0 auto;

}
  .attachmentsWrap{
    width: 700px;
    margin: 0 auto 10px;
  }
  .attachmentsItem{
    min-width: 200px;
    height: 40px;
    line-height: 40px;
    border: 1px solid #C6D9F1;
    margin-bottom: 10px;
    margin-right: 20px;
    text-align: center;
    border-radius: 6px;
    overflow: hidden;
  }
  .attachmentsItem_wrap{
    display: flex;
    flex-wrap: wrap;
  }
  .downMsg{
    position: fixed;right: 200px;
    top: 0;
  }

</style>
