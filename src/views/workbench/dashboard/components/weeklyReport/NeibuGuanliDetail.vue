<template>
  <div class="articleDetail">
    <el-input type="textarea" v-model="content" :rows="10"></el-input>
    <div>
      <el-upload
        name="attachFile"
        :data="uploadFileData"
        :action="creatematerialUrl"
        :on-preview="onPreview"
        :on-remove="brforeRemoveFile"
        :on-success="successCallback"
        :auto-upload="true"
        multiple
        :file-list="fileList">
        <div class="upload-btn">
          <span class="el-icon-plus"></span>
          <span>上传附件</span>
        </div>
      </el-upload>
    </div>
    <div class="button_wrap">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="submit">确定</el-button>
    </div>
  </div>
</template>

<script>
import {creatematerialUrl} from "@/api/serviceApi.config.js";
import { queryNeibuGuanliInfo,createNeibuGuanli,updateNeibuGuanli } from '@/api/dashboard'
import { getProgID } from '@/utils/editInOffice.js'
import { delCaseMaterialUrl } from '@/api/caseDetail'
export default {
  name: "NeibuGuanliDetail",
  props: ['dateArray','detailInfo'],
  data() {
    return {
      content: '',
      materialIdList: [],
      fileList: [],
      uploadFileData: {
        tokenID: this.$store.getters.token,
        flashFlag: 1
      },
      creatematerialUrl
    }
  },
  created() {
    this.init()
  },
  methods:{
    init(){
      if (this.detailInfo.wngId){
        this.content = this.detailInfo.content
        this.queryNeibuGuanliInfo()
      }
    },
    queryNeibuGuanliInfo(){
      queryNeibuGuanliInfo({wngId:this.detailInfo.wngId}).then(res=>{
        if (res.data){
          res.data.materialArray.map(item => {
            this.fileList.push({
              name: item.materialName,
              address: item.address,
              materialId: item.materialId
            })
            this.materialIdList.push(item.materialId)
          })
        }
      })
    },
    onPreview(data) {
      let url = data.address
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
    downLoad(data) {
      const url = data.address
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
    brforeRemoveFile(file, fileList) {
      let delmaterialId
      if (file.response) {
        delmaterialId = file.response.data[0].materialId
      } else {
        delmaterialId = file.materialId
      }
      delmaterialId && delCaseMaterialUrl({
        materialId: delmaterialId,
        flashFlag: 1
      }).then(res => {
        this.$message.success(res.message)
        this.materialIdList = fileList.map(item => {
          if (item.materialId) {
            return item.materialId
          } else {
            return item.response.data[0].materialId
          }
        })
        this.fileList = fileList
      })
    },
    successCallback(res, file, fileList) {
      this.materialIdList = fileList.map(item => {
        if (item.materialId) {
          return item.materialId
        } else {
          return item.response.data[0].materialId
        }
      })
      this.fileList.push(res.data.map(item => ({
        name: item.materialName,
        address: item.address,
        materialId: item.materialId,
      }))[0])
    },
    submit() {
      if (!this.detailInfo.wngId){
        var data = {
          userId: this.$store.getters.userId,
          userFullName: this.$store.getters.name,
          startDate: this.dateArray[0],
          endDate: this.dateArray[1],
          content: this.content,
          materialIdArray: this.materialIdList
        }
        createNeibuGuanli(data).then(res => {
          if(res.success){
            this.$message.success('创建成功');
            this.$emit('closeDetail')
          }
        })
      }else{
        var data = {
          wngId: this.detailInfo.wngId,
          content: this.content,
          materialIdArray: this.materialIdList
        }
        updateNeibuGuanli(data).then(res => {
          if(res.success){
            this.$message.success('编辑成功');
            this.$emit('closeDetail')
          }
        })
      }
    },
    cancel() {
      this.$emit('closeDetail')
    }
  }
}
</script>

<style lang="scss" scoped>
.articleDetail{
  padding: 20px;
}
.el-tag + .el-tag {
  margin-right: 10px;
}
.button-new-tag {
  margin-right: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-right: 10px;
  vertical-align: bottom;
}
.title{
  color: #235;
  height: 30px;
  line-height: 30px;
  text-decoration: none;
}
.button_wrap{
  display: flex;
  justify-content: center;
  margin-top: 10px;
}
.upload-btn {
  margin: 10px 0 5px 0;
  width: 120px;
  height: 30px;
  border: 1px solid #AAAAAA;
  color: #AAAAAA;
  text-align: center;
  line-height: 30px;
  cursor: pointer;

  &:hover {
    border: 1px solid #66B1FF;
    color: #66B1FF;
  }
}
</style>
