<template>
  <div style="width: 100%;">
    <div v-if="!fileType" style="width: 70%; display: flex;justify-items: flex-start;align-items: center">
      <!--    显示文件类型名称-->
      <span style="width: 200px;flex-shrink: 0">{{item.typeName}}</span>
      <!--    显示文件列表-->
      <div
        style="flex:1; width: 50%;margin: 5px 0; min-height: 30px; border: 1px solid #EBEEF5">
        <p @mouseover="sign = file.materialId" @mouseleave="sign = ''" class="bg-hover"
           style="display: flex;align-items: center; height: 26px;line-height: 26px;cursor: pointer"
           v-for="(file, findex) in flielist.filter(i => i.materialTypeId == item.materialTypeId)"
           :key="file.materialId">
        <span class="single" style="flex:1;display: flex;align-items: center"><i class="el-icon-document"></i><span
          style="flex: 1" class="single" @click="preView(file)">{{file.materialName}}</span></span>
          <i v-if="sign == file.materialId && !view" class="el-icon-close" style="color: #67C23A"
             @click="removeFile(file)"></i>
          <i v-else class="el-icon-circle-check" style="color: #67C23A"></i>
        </p>
      </div>
      <!--    上传按钮-->
      <el-upload class="upload-demo"
                 :before-remove="brforeRemoveFile"
                 ref="uploadFile"
                 multiple :data="uploadFileData" :action="creatematerialUrl" name="attachFile"
                 :auto-upload="true"
                 :on-success="successCallback" :before-upload="beforeupload(item)"
                 :show-file-list="false"
                 :on-progress="beforeAvatarUpload"

      >

        <el-button v-if="!view" type="primary" size="mini" style="margin-left: 15px" :loading="!!loadProgress">上传
        </el-button>
      </el-upload>
    </div>
    <div v-else style="padding: 10px 0">
      <el-upload v-if="!view" class="upload-demo"
                 :before-remove="brforeRemoveFile"
                 drag
                 ref="uploadFile"
                 multiple :data="uploadFileData" :action="creatematerialUrl" name="attachFile"
                 :auto-upload="true"
                 :on-success="successCallback" :before-upload="beforeupload(item)"
                 :show-file-list="false"
                 :on-progress="beforeAvatarUpload"
                 title="将文件拖到此处或点击上传"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
<!--          将文件拖到此处，或<em>点击上传</em>-->
        </div>
      </el-upload>
      <div style="width: 65%;">
        <p @mouseover="sign = file.materialId" @mouseleave="sign = ''" class="bg-hover"
           style="display: flex;align-items: center; height: 26px;line-height: 26px;cursor: pointer"
           v-for="(file, findex) in flielist.filter(i => i.materialTypeId == item.materialTypeId)"
           :key="file.materialId">
        <span class="single" style="flex:1;display: flex;align-items: center"><i class="el-icon-document"></i><span
          style="flex: 1" class="single" @click="preView(file)">{{file.materialName}}</span></span>
          <i v-if="sign == file.materialId && !view" class="el-icon-close" style="color: #67C23A"
             @click="removeFile(file)"></i>
          <i v-else class="el-icon-circle-check" style="color: #67C23A"></i>
        </p>
      </div>
    </div>
  </div>

</template>

<script>
  import {creatematerialUrl} from "@/api/serviceApi.config.js";
  import {doEditInOffice, getProgID} from '@/utils/editInOffice.js'
  import {
    delCaseMaterial
  } from "@/api/caseList";

  export default {
    name: "upLoadFiles",
    props: {
      view: {
        default: false
      },
      fileType: {
        default: ''
      },
      flielist: {},
      item: {},
      taskType: {
        type: [Number, String],
        default: '4'
      },
      curCaseId: {
        default: ''
      }
    },
    data() {
      return {
        loadProgress: 0,
        sign: '',
        creatematerialUrl,
        uploadFileData: {}
      }
    },
    created() {
    },
    methods: {
      beforeAvatarUpload(event, file, fileList) {
        this.loadProgress = Math.floor(event.percent) //当前上传的进度
      },
      brforeRemoveFile() {

      },
      successCallback(res, file, fileList) {
        this.loadProgress = 0
        this.$emit('uploadSuccess', {res, file, fileList, fileType: this.fileType})
      },
      beforeupload() {
        this.uploadFileData.materialTypeId = this.item.materialTypeId
        this.uploadFileData.objType = this.$commonUtils.getSubmitObjTypeByTaskType(+this.taskType)
        this.uploadFileData.caseIds = this.curCaseId
        this.uploadFileData.tokenID = this.$store.getters.token
      },
      removeFile(file) {
        delCaseMaterial({materialId: file.materialId, caseIdArray: this.curCaseId}).then(res => {
          this.$emit('removeFile', {file, fileType: this.fileType})
        })
      },
      preView(data) {
        let url = data.address
        if (getProgID(url) || ['eml', 'msg'].includes(url.replace(/.+\./, '').toLocaleLowerCase())) {
          if(['doc','docx'].includes(url.replace(/.+\./,"").toLocaleLowerCase())){
            this.$commonUtils.viewPdf(`${url}`)
          }else {
            let flag = ''
            if(data.mailId){
              flag = 'mailId'
            }else if (data.materialId) {
              flag = 'materialId'
            }
            url = url.replace(/&/g, '%26')
            window.open(`#/preView?address=ipdoc${url}&${flag}=${data[flag]}`.replace(/[+]/g,'%2B'))
          }
        } else if (['pdf', 'jpg', 'png'].some(item => url.replace(/.+\./, "").toLocaleLowerCase() == item)) {
          window.open(`/ipdoc${url}`.replace(/[+]/g, '%2B'))
        } else {
          this.downLoad(data)
        }
      },
      downLoad(data) {
        const url = data.address
        // let notify = this.$notify.success({
        //   // title: 'Info',
        //   message: '正在下载',
        //   showClose: false,
        //   duration: 0
        // });
        const downData = {
          url: `${url}`,
          success() {
            // notify.close()
          }
        }
        if (data.mailId) {
          downData.downLoad = data.materialName
        }
        this.$commonUtils.downLoadAll(downData)
      },

    }
  }
</script>

<style lang="scss" scoped>
  .single {
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .bg-hover {
    &:hover {
      background-color: #F5F7FA;
    }
  }
  /deep/ .el-upload-dragger{
    height: 46px;
    .el-icon-upload{
      font-size: 35px;
      color: #C0C4CC;
      margin: 0;
      line-height: 46px;
    }
  }
</style>
