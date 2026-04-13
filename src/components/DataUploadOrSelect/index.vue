<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :title="title" :visible.sync="dialogVisible" :modal="false" width="50%" :center="isDetailSubmission ? false : true" :before-close="handleClose" :top="isDetailSubmission ? 0 : ''" v-dialogDrag :class="isDetailSubmission ? 'dragDialog' : ''">
    <h4 class="selectTitle">文件上传</h4>
    <cropper @getClientFile="getClientFile" v-if="clientState"></cropper>
    <header style="display: flex;align-items: center">
      <el-upload class="upload-btn" :on-exceed="exceedFile" :on-success='fileUploadSuccess' :file-list="wtsfileList.filter(item => item.materialTypeId == fileData.materialTypeId)" :show-file-list='true' :action="fileUrl" name='attachFile' :data="fileData" drag :multiple="oneFile?false:true" :limit="oneFile?1:100" v-if="!clientState"
        :before-upload="beforeUpload">
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <!--<el-button style="margin-left:10px" size="mini" type="primary">上传</el-button>-->
        <!--<el-input :disabled="true" v-model="fileName[fileData.materialTypeId]"></el-input>-->
<!--        <p class="flexAble" v-for="item in wtsfileList"><span>{{item.name}}</span> <span class="el-icon-close" @click.stop="deleteCaseMaterial(fileData.materialTypeId,item.materialId)"></span></p>-->
        <p class="flexAble" v-if="multipleListId.includes(String(fileData.materialTypeId)) || oneFile" v-for="item in wtsfileList.filter(item => item.materialTypeId == fileData.materialTypeId)"><span>{{item.name}}</span> <span class="el-icon-close" @click.stop="deleteCaseMaterial(fileData.materialTypeId,item.materialId)"></span></p>
        <p class="flexAble" v-else><span>{{fileName[fileData.materialTypeId]}}</span> <span class="el-icon-close"  v-show="fileName[fileData.materialTypeId]" @click.stop="deleteCaseMaterial(fileData.materialTypeId,fileData)"></span></p>
      </el-upload>
    </header>
    <section>
      <h4 class="selectTitle">资料库-选取</h4>
      <el-table border :data="tableData" height="450">
        <el-table-column type="index" width="50" label="序号" align="left">
          <template slot-scope="scope">
            <span>{{scope.$index+1}}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="isDetailSubmission" label="文件/事件类型" align="left" width="150px">
          <template slot-scope="scope">
            <span :title="scope.row.typeName">{{scope.row.typeName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="资料名称" align="left">
          <template slot-scope="scope">
            <span class="pointer" :title="scope.row.materialName" @click="onPreview(scope.row)">{{scope.row.materialName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建人" align="left" width="80px">
          <template slot-scope="scope">
            {{scope.row.creater}}
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="left" width="110px">
          <template slot-scope="scope">
            {{scope.row.createDate}}
          </template>
        </el-table-column>

        <el-table-column label="操作" align="left" width="100px">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="creatematerialsimple(scope.row)">选择</el-button>
            <el-button type="text" size="small" @click="hidematerialsimple(scope.row)">隐藏</el-button>
          </template>
        </el-table-column>
      </el-table>
    </section>
  </el-dialog>
</template>

<script>
import JsPDF from 'jspdf'
import cropper from "@/components/cropper";
import { creatematerialUrl } from "@/api/serviceApi.config.js";
import {
  querymaterialbyapp,
  creatematerialsimple,
  creatematerial,
} from "@/api/caseList";
import {delCaseMaterialUrl,
} from "@/api/caseDetail";
import {getProgID} from "../../utils/editInOffice";
import {putMaterialIntoRubbish} from "../../api/caseList";
export default {
  props: {
    caseDetailFoemData: {
      type: Object,
      default: () => ({})
    },
    reportMatter: {
      type: String,
      default: ''
    },
    caseType: {
      type: String,
      default: ''
    },
    materialArray: {
      type: Array,
      default: () => []
    },
    isDetailSubmission:{
      type: Boolean,
      default: false
    },
    onlyJpg:{
      type: Boolean,
      default: false
    },
    oneFile:{
      type: Boolean,
      default: false
    },
    clientState: {
      type: Boolean,
      default: false
    },
    title: {
      type: String
    },
    fileName: {
      type: Object
    },
    wtsfileList: {
      type: Array,
      default: () => []
    },
    fileData: {
      type: Object,
      default: () => {}
    },
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  name: "index",
  data() {
    return {
      fileUrl: creatematerialUrl,
      tableData: [],
      multipleListId: ["1000", "1022"],
      seeProgress: false
    };
  },
  mounted() {
    setTimeout(() => {
      if (this.isDetailSubmission) {
        this.$commonUtils.dragZindex(this)
        this.querymaterialbyapp()
      }
    }, 0)
  },
  methods: {
    downLoad(data) {
      const url = data.address || data.url
      const downData = {
        url: `ipdoc${url}`,
        success() {
        }
      }
      if (data.mailId) {
        downData.downLoad = data.materialName
      }
      this.$commonUtils.downLoadAll(downData)
    },
    onPreview(data) {
      let url = data.address || data.url
      if (getProgID(url) || ['eml', 'msg'].includes(url.replace(/.+\./, '').toLocaleLowerCase())) {
        if (['doc', 'docx'].includes(url.replace(/.+\./, "").toLocaleLowerCase())) {
          this.$commonUtils.viewPdf(`${url}`)
        } else {
          let flag = ''
          if (data.mailId) {
            flag = 'mailId'
          } else if (data.materialId) {
            flag = 'materialId'
          }
          url = url.replace(/&/g, '%26')
          window.open(`#/preView?address=ipdoc${url}&${flag}=${data[flag]}`.replace(/[+]/g, '%2B'))
        }
        // doEditInOffice(url, getProgID(url))
      } else if (['pdf', 'jpg', 'png'].some(item => url.replace(/.+\./, "").toLocaleLowerCase() == item)) {
        window.open(`/ipdoc${url}`.replace(/[+]/g, '%2B'))
      } else {
        this.downLoad(data)
      }
    },
    hidematerialsimple(row) {
      putMaterialIntoRubbish({materialIdList: [row.materialId]}).then(res => {
        this.$message.success('隐藏文件成功！')
        this.querymaterialbyapp()
      })
    },
    exceedFile(){
      if(this.oneFile){
        this.$message.info('文件已存在！')
      }
    },
    getClientFile(formData) {
      for (var key in this.fileData) {
        formData.append(key, this.fileData[key]);
      }
      creatematerial(formData).then(response => {
        if (response.data.length == "1") {
          this.fileName[response.data[0].materialTypeId] =
            response.data[0].materialName;
          const data = {
            response,
            file
          };
          this.$emit("getResponseAndFile", data);
          this.$emit("closedialogVisible", false);
        }
      });
    },
    checkWidthAndHeight(file, maxLength) { // maxLength 单位cm
      return new Promise((res, rej) => {
        res(true)
        // var reader = new FileReader();

        // let width = 0
        // let height = 0
        // reader.readAsArrayBuffer(file);

        // reader.onloadend = () => {
        //   var arrayBuffer = reader.result;
        //   var uint8Array = new Uint8Array(arrayBuffer);

        //   var doc = new JsPDF();
        //   // 加载PDF文件流
        //   doc.loadFile(uint8Array);
        //   // 获取页面的宽度和高度,单位mm
        //   width = doc.internal.pageSize.getWidth();
        //   height = doc.internal.pageSize.getHeight();
        //   if (maxLength * 10 < width || maxLength * 10 < height) {
        //     this.$message.error(`当前pdf文件超过系统允许的最大单位${maxLength}厘米，当前pdf文件高约：${(height / 10).toFixed(2)}厘米，宽约${(width / 10).toFixed(2)}厘米；提示，通过Adobe Reader的文件 -> 属性可以看到文件宽和长，请在比例为100%下看`)
        //     rej(false)
        //   } else {
        //     res(true)
        //   }
        // }
      })
    },
    beforeUpload(file) {
      if (['商标注册', '分隔申请'].includes(this.caseDetailFoemData.caseType) && ['1018'].includes(this.fileData.materialTypeId) && ['外-内', '内-内'].includes(this.caseDetailFoemData.appFromto) && this.caseDetailFoemData.submitType === '网上申请') { // 任务5592
        const name = file.name.toLowerCase().replace(/.+\./g, '')
        // 判断jpg文件类型
        if(!name.includes('jpg') && !name.includes('jpeg')){
          this.$message.warning('请上传jpg类型的文件！')
          return false
        }
        // 判断文件大小
        if (file.size > (200 * 1024)) {
          this.$message.error('文件大小不能超过200kb')
          return false
        }
        return new Promise((resolve, reject) => {
          const image = new Image();
          image.src = URL.createObjectURL(file);

          image.onload = () => {
            const width = image.width;
            const height = image.height;
            if (width < 400 || width > 1500 || height < 400 || height > 1500) {
              this.$message.warning(`图片宽高不能大于1500像素或小于400像素，当前图片宽${width.toFixed(2)}px，高${height.toFixed(2)}px`)
              reject()
            } else {
              resolve();
            }
          };
          image.onerror = () => {
            reject(new Error("图片加载失败"));
          };
        });
      }
      if (['327'].includes(this.fileData.materialTypeId) && this.caseType === '撤销三年停止使用申请') { // 任务5587
        const name = file.name.toLowerCase().replace(/.+\./g, '')
        // 判断odf文件类型
        if(!name.includes('pdf')){
          this.$message.warning('请上传pdf类型的文件！')
          return false
        }
      }
      if (['1000'].includes(this.fileData.materialTypeId)) { // 委托书 任务5482
        const name = file.name.toLowerCase().replace(/.+\./g, '')
        // 判断jpg、pdf文件类型
        if(!name.includes('jpg') && !name.includes('jpeg') && !name.includes('pdf')){
          this.$message.warning('请上传jpg或pdf类型的文件！')
          return false
        }
        // 判断文件大小
        if (file.size > (2 * 1024 * 1024)) {
          this.$message.error('文件大小不能超过2MB')
          return false
        }
        return new Promise((resolve, reject) => {
          //判断是否图片类型
          if(name.includes('jpg') || name.includes('jpeg')){
            const image = new Image();
            image.src = URL.createObjectURL(file);

            image.onload = () => {
              const width = image.width;
              const height = image.height;
              if (width < 600 || width > 4000 || height < 600 || height > 4000) {
                this.$message.warning(`图片宽高不能大于4000像素或小于600像素，当前图片宽${width.toFixed(2)}px，高${height.toFixed(2)}px`)
                reject()
              } else {
                resolve();
              }
            };
            image.onerror = () => {
              reject(new Error("图片加载失败"));
            };
          }
          if(name.includes('pdf')){
            resolve();
          }
        });
      }
      if (['1003', '1004'].includes(this.fileData.materialTypeId)) { // 任务5477
        const name = file.name.toLowerCase().replace(/.+\./g, '')
        // 判断odf文件类型
        if(!name.includes('pdf')){
          this.$message.warning('请上传pdf类型的文件！')
          return false
        }
        // 判断文件大小
        if (file.size > (5 * 1024 * 1024)) {
          this.$message.error('文件大小不能超过5MB')
          return false
        }
        // 判断pdf尺寸大小
        return this.checkWidthAndHeight(file, 52)
      }
      if (this.caseType.includes('无效宣告申请') && !this.reportMatter) { // 5473
        if (['326', '327', '300012'].includes(this.fileData.materialTypeId)) {
          const name = file.name.toLowerCase().replace(/.+\./g, '')
          // 判断odf文件类型
          if(!name.includes('pdf')){
            this.$message.warning('请上传pdf类型的文件！')
            return false
          }
          // 判断文件大小和剩余容量，三类文件合计
          const limitSize = 200 * 1024 * 1024
          const useList = ['326', '327', '300012'].filter(id => id != this.fileData.materialTypeId) // 另外俩类文件的materialTypeId
          let useSize = 0 // 已使用
          let capacity = 0 // 剩余容量
          this.materialArray.forEach(item => {
            if (useList.includes(String(item.materialTypeId))) {
              useSize += item.size
            }
          })
          capacity = limitSize - useSize
          if (file.size > capacity) {
            this.$message.error(`当前申请件剩余容量${(capacity / (1024 * 1024)).toFixed(2)}MB, 本次上传文件大小为${(file.size / (1024 * 1024)).toFixed(2)}MB`)
            return  false
          }
          // 判断pdf尺寸大小
          return this.checkWidthAndHeight(file, 52)
        }
      }
      if ((this.caseType.includes('驳回复审') || this.caseType.includes('无效宣告申请')) && this.reportMatter === '补充') { // 递交官方 任务5413 驳回复审补充网申
        if (['328', '329', '301601'].includes(this.fileData.materialTypeId)) {
          const name = file.name.toLowerCase().replace(/.+\./g, '')
          // 判断odf文件类型
          if(!name.includes('pdf')){
            this.$message.warning('请上传pdf类型的文件！')
            return false
          }
          if (this.fileData.materialTypeId == '301601' && !this.materialArray.find(item => String(item.materialTypeId) == '328')) {
            this.$message.warning('若上传证据内容，必须上传证据目录！')
            return false
          }
          // 判断文件大小和剩余容量，三类文件合计
          let limitSize = 0
          if (this.caseType.includes('驳回复审')) {
            limitSize = 50 * 1024 * 1024 // 总容量
          } else if (this.caseType.includes('无效宣告申请')) {
            limitSize = 300 * 1024 * 1024 // 总容量
          }
          const useList = ['328', '329', '301601'].filter(id => id != this.fileData.materialTypeId) // 另外俩类文件的materialTypeId
          let useSize = 0 // 已使用
          let capacity = 0 // 剩余容量
          this.materialArray.forEach(item => {
            if (useList.includes(String(item.materialTypeId))) {
              useSize += item.size
            }
          })
          capacity = limitSize - useSize
          if (file.size > capacity) {
            this.$message.error(`当前申请件剩余容量${(capacity / (1024 * 1024)).toFixed(2)}MB, 本次上传文件大小为${(file.size / (1024 * 1024)).toFixed(2)}MB`)
            return  false
          }
          // 判断pdf尺寸大小
          return this.checkWidthAndHeight(file, 52)
        }
      }
      if (this.caseType.includes('驳回复审') && !this.reportMatter) { // 递交官方 任务5473 无效宣告网申补充 案件详情中
        if (['326', '327', '300012'].includes(this.fileData.materialTypeId)) {
          const name = file.name.toLowerCase().replace(/.+\./g, '')
          // 判断odf文件类型
          if(!name.includes('pdf')){
            this.$message.warning('请上传pdf类型的文件！')
            return false
          }
          // 判断文件大小和剩余容量，三类文件合计
          const limitSize = 50 * 1024 * 1024 // 总容量
          const useList = ['326', '327', '300012'].filter(id => id != this.fileData.materialTypeId) // 另外俩类文件的materialTypeId
          let useSize = 0 // 已使用
          let capacity = 0 // 剩余容量
          this.materialArray.forEach(item => {
            if (useList.includes(String(item.materialTypeId))) {
              useSize += item.size
            }
          })
          capacity = limitSize - useSize
          if (file.size > capacity) {
            this.$message.error(`当前申请件剩余容量${(capacity / (1024 * 1024)).toFixed(2)}MB, 本次上传文件大小为${(file.size / (1024 * 1024)).toFixed(2)}MB`)
            return  false
          }
          // 判断pdf尺寸大小
          return this.checkWidthAndHeight(file, 52)
        }
      }
      if(this.oneFile){
        let name = file.name.toLowerCase().replace(/.+\./g, '')
        if (this.onlyJpg) {
          if(!name.includes('jpg') && !name.includes('jpeg')){
            this.$message.warning('请上传jpg类型的文件！')
            return false
          }
        } else {
         if(!name.includes('pdf')){
            this.$message.warning('请上传pdf类型的文件！')
            return false
          }
        }
      }
      this.seeProgress = true;
    },
    fileUploadSuccess(response, file, fileList) {
      console.log(response.data,'response.data');
      
      this.seeProgress = false;
      if (response.data.length == "1") {
        this.fileName[response.data[0].materialTypeId] = file.name;
        const data = {
          response,
          file
        };
        this.$emit("getResponseAndFile", data);
        this.$emit("closedialogVisible", false);
      }
    },
    querymaterialbyapp() {
      if(this.fileData.applicantId){
        const data = {
          applicantId: this.fileData.applicantId,
          materialTypeId: this.fileData.materialTypeId,
          custId: this.fileData.custId
        };
        querymaterialbyapp(data).then(res => {
          this.tableData = res.data;
        });
      } else if (this.fileData.caseId) {
         const data = {
          caseId: this.fileData.caseId,
          materialTypeId: this.fileData.materialTypeId,
        };
        querymaterialbyapp(data).then(res => {
          this.tableData = res.data;
        });
      }
    },
    deleteCaseMaterial(materialTypeId,materialId) {
      this.$confirm('此操作将删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$emit('deleteCaseMaterial',{materialTypeId,materialId})
      }).catch(() => {
      });
    },
    creatematerialsimple(row) {
      if (['商标注册', '分隔申请'].includes(this.caseDetailFoemData.caseType) && ['1018'].includes(this.fileData.materialTypeId) && ['外-内', '内-内'].includes(this.caseDetailFoemData.appFromto) && this.caseDetailFoemData.submitType === '网上申请') { // 任务5592
        const name = row.name.toLowerCase().replace(/.+\./g, '')
        // 判断jpg文件类型
        if(!name.includes('jpg') && !name.includes('jpeg')){
          this.$message.warning('请上传jpg类型的文件！')
          return false
        }
        // 判断文件大小
        if (row.size > (200 * 1024)) {
          this.$message.error('文件大小不能超过200kb')
          return false
        }
        return new Promise((resolve, reject) => {
          const image = new Image();
          image.src = '/ipdoc/' + row.url;

          image.onload = () => {
            const width = image.width;
            const height = image.height;
            if (width < 400 || width > 1500 || height < 400 || height > 1500) {
              this.$message.warning(`图片宽高不能大于1500像素或小于400像素，当前图片宽${width.toFixed(2)}px，高${height.toFixed(2)}px`)
              reject()
            } else {
              resolve();
            }
          };
          image.onerror = () => {
            reject(new Error("图片加载失败"));
          };
        });
      }
      if (['1000'].includes(this.fileData.materialTypeId)) { // 委托书 任务5482
        const name = row.name.toLowerCase().replace(/.+\./g, '')
        // 判断jpg文件类型
        if(!name.includes('jpg') && !name.includes('jpeg') && !name.includes('pdf')){
          this.$message.warning('请上传jpg或pdf类型的文件！')
          return false
        }
        // 判断文件大小
        if (row.size > (2 * 1024 * 1024)) {
          this.$message.error('文件大小不能超过2MB')
          return false
        }
      }
      if (['1003', '1004'].includes(this.fileData.materialTypeId)) { // 任务5477
        const name = row.name.toLowerCase().replace(/.+\./g, '')
        // 判断odf文件类型
        if(!name.includes('pdf')){
          this.$message.warning('请上传pdf类型的文件！')
          return false
        }
        // 判断文件大小
        if (row.size > (5 * 1024 * 1024)) {
          this.$message.error('文件大小不能超过5MB')
          return false
        }
      }
      if (this.caseType.includes('无效宣告申请') && !this.reportMatter) { // 5473
        if (['326', '327', '300012'].includes(this.fileData.materialTypeId)) {
          const name = row.name.toLowerCase().replace(/.+\./g, '')
          // 判断odf文件类型
          if(!name.includes('pdf')){
            this.$message.warning('请上传pdf类型的文件！')
            return false
          }
          // 判断文件大小和剩余容量，三类文件合计
          const limitSize = 100 * 1024 * 1024
          const useList = ['326', '327', '300012'].filter(id => id != this.fileData.materialTypeId) // 另外俩类文件的materialTypeId
          let useSize = 0 // 已使用
          let capacity = 0 // 剩余容量
          this.materialArray.forEach(item => {
            if (useList.includes(String(item.materialTypeId))) {
              useSize += item.size
            }
          })
          capacity = limitSize - useSize
          if (row.size > capacity) {
            this.$message.error(`当前申请件剩余容量${(capacity / (1024 * 1024)).toFixed(2)}MB, 本次上传文件大小为${(row.size / (1024 * 1024)).toFixed(2)}MB`)
            return  false
          }
        }
      }
      if ((this.caseType.includes('驳回复审') || this.caseType.includes('无效宣告申请')) && this.reportMatter === '补充') { // 递交官方 任务5413 驳回复审补充网申
        if (['328', '329', '301601'].includes(this.fileData.materialTypeId)) {
          const name = row.name.toLowerCase().replace(/.+\./g, '')
          // 判断odf文件类型
          if(!name.includes('pdf')){
            this.$message.warning('请上传pdf类型的文件！')
            return false
          }
          if (this.fileData.materialTypeId == '301601' && !this.materialArray.find(item => String(item.materialTypeId) == '328')) {
            this.$message.warning('若上传证据内容，必须上传证据目录！')
            return false
          }
          // 判断文件大小和剩余容量，三类文件合计
          let limitSize = 0
          if (this.caseType.includes('驳回复审')) {
            limitSize = 50 * 1024 * 1024 // 总容量
          } else if (this.caseType.includes('无效宣告申请')) {
            limitSize = 300 * 1024 * 1024 // 总容量
          }
          const useList = ['328', '329', '301601'].filter(id => id != this.fileData.materialTypeId) // 另外俩类文件的materialTypeId
          let useSize = 0 // 已使用
          let capacity = 0 // 剩余容量
          this.materialArray.forEach(item => {
            if (useList.includes(String(item.materialTypeId))) {
              useSize += item.size
            }
          })
          capacity = limitSize - useSize
          if (row.size > capacity) {
            this.$message.error(`当前申请件剩余容量${(capacity / (1024 * 1024)).toFixed(2)}MB, 本次上传文件大小为${(row.size / (1024 * 1024)).toFixed(2)}MB`)
            return  false
          }
        }
      }
      if (this.caseType.includes('驳回复审') && !this.reportMatter) { // 递交官方 任务5473 无效宣告网申补充 案件详情中
        if (['326', '327', '300012'].includes(this.fileData.materialTypeId)) {
          const name = row.name.toLowerCase().replace(/.+\./g, '')
          // 判断odf文件类型
          if(!name.includes('pdf')){
            this.$message.warning('请上传pdf类型的文件！')
            return false
          }
          // if (this.fileData.materialTypeId == '300012' && !this.materialArray.find(item => String(item.materialTypeId) == '326')) {
          //   this.$message.warning('若上传证据内容，必须上传证据目录！')
          //   return false
          // }
          // 判断文件大小和剩余容量，三类文件合计
          const limitSize = 50 * 1024 * 1024 // 总容量
          const useList = ['326', '327', '300012'].filter(id => id != this.fileData.materialTypeId) // 另外俩类文件的materialTypeId
          let useSize = 0 // 已使用
          let capacity = 0 // 剩余容量
          this.materialArray.forEach(item => {
            if (useList.includes(String(item.materialTypeId))) {
              useSize += item.size
            }
          })
          capacity = limitSize - useSize
          if (row.size > capacity) {
            this.$message.error(`当前申请件剩余容量${(capacity / (1024 * 1024)).toFixed(2)}MB, 本次上传文件大小为${(row.size / (1024 * 1024)).toFixed(2)}MB`)
            return  false
          }
        }
      }
      if(this.oneFile){
        if(this.wtsfileList.filter(item => item.materialTypeId == this.fileData.materialTypeId).length){
          this.$message.info('文件已存在！')
          return
        }
        let name = row.materialName.toLowerCase().replace(/.+\./g, '')
        if (this.onlyJpg) {
          if(!name.includes('jpg') && !name.includes('jpeg')){
            this.$message.warning('请上传jpg类型的文件！')
            return false
          }
        } else {
         if(!name.includes('pdf')){
            this.$message.warning('请上传pdf类型的文件！')
            return false
          }
        }
      }
      const data = {
        materialId: row.materialId,
        caseIdArray: this.fileData.caseIds,
        caseId: this.fileData.caseId,
        custId: this.fileData.custId
      };
      if (
        this.fileData.joinAppId &&
        ["1031", "1037", "1038", "1039", "1040"].includes(
          String(this.fileData.materialTypeId)
        )
      ) {
        data.joinAppId = this.fileData.joinAppId;
      }
      creatematerialsimple(data).then(res => {
        const data = {
          response: {
            data: [res.data]
          }
        };
        this.$emit("getResponseAndFile", data);
        this.$emit("closedialogVisible", false);
      });
    },
    handleClose() {
      this.$emit("closedialogVisible", false);
    }
  },
  watch: {
    dialogVisible(n) {
      if (n) {
        this.querymaterialbyapp();
      }
    }
  },

  components: {
    cropper
  }
};
</script>

<style lang="scss" scoped>
/deep/ .el-dialog__body {
  padding: 0 20px 20px 20px;
}
.upload-btn {
  width: 100%;
  /deep/ .el-upload {
    display: block;
    .el-upload-dragger {
      width: 100%;
      overflow: auto;
      max-height: 90px;
    }
  }
}
.selectTitle {
  color: #6aa7ff;
  height: 40px;
  line-height: 40px;
}
  .flexAble{
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
  }
</style>
