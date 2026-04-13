<template>
  <div class="OfficialDocuments" :style="{'height': '100%','background':hoverState?'RGBA(32,159,255,0.06)':'#fff'}"
       @drop.stop.prevent="enentDrop($event)"
       @dragover.stop.prevent="hoverState=true"
       @dragleave.stop.prevent="hoverState=false"
       @dragenter.stop.prevent="hoverState=true"
       >
<!--    <div-->
<!--      style="display: flex;justify-content: center;align-items: center;border-radius:50%;    border: 1px solid;-->
<!--      height: 25px;-->
<!--      width: 25px;-->
<!--      margin-bottom: 10px;-->
<!--      cursor: pointer"-->
<!--     >-->
<!--      <i class="el-icon-back" @click="$router.go(-1)">-->
<!--      </i>-->
<!--    </div>-->

    <el-radio-group v-if="types != 'patenFee'" v-model="paperOrEle">
      <el-radio :label="1">纸件官文</el-radio>
      <el-radio :label="2">电子官文</el-radio>
    </el-radio-group>
    <div class="uploadIcon">
      <div class="icon_wrap">
        <i class="el-icon-upload"></i>
      </div>
      <div style="font-size: 12px;margin-bottom: 10px;width: 100%;padding: 0 64px">{{types === 'patenFee' ? '' : '请在选择官文种类后'}}将文件拖到页面空白处或点击<span style="color: #409EFF;cursor: pointer;" @click="clickUpload=true">浏览</span>进行上传</div>
    </div>
    <div class="progressWrap" v-if="percentage">
      <el-progress type="circle" :percentage="percentage"></el-progress>
    </div>
    <uploadFile :clickUpload="clickUpload" @getUploadFile="getUploadFile" @changeClick="clickUpload=false" :multiple="true"></uploadFile>
  </div>
</template>

<script>
import {createMultMaterial, createMultSubmitMaterial} from '@/api/caseList.js'
import {uploadPayReceipt} from '@/api/billApi.js'
import UploadFile from '@/views/workbench/material_management/components/uploadFile.vue'
export default {
  name: "OfficialDocuments",
  props: {
    isOfficialSub: {
      type: Boolean,
      default: false
    },
    types: {
      type: String,
      default: ''
    }
  },
  data(){
    return {
      clickUpload: false,
      paperOrEle:1,
      hoverState:false,
      percentage:0
    }
  },
  mounted() {

  },
  methods:{
    enentDrop(e){
      e.stopPropagation();
      e.preventDefault();
      this.hoverState=false
      this.createMultMaterial(e.dataTransfer.files)
      console.log(e);
    },
    getUploadFile(e){
      this.createMultMaterial(e.target.files)
    },
    createMultMaterial(file){
      // let formData = new FormData()
      // formData.append("attachFile", file);
      // formData.append("paperOrEle", this.paperOrEle);
      // formData.append("tokenID", this.$store.getters.token);
      // createMultMaterial(formData).then(async res=>{
      //   this.$message.success('新建成功')
      // })
      let formData = new FormData()
      for (let item of file){
        this.types == 'patenFee' ? formData.append("upfile", item) : formData.append("attachFile", item);
        console.log(item);
      }
      !this.types && formData.append("paperOrEle", this.paperOrEle);
      formData.append("tokenID", this.$store.getters.token);
      if(this.types == 'patenFee'){
        uploadPayReceipt(formData,(e)=>{
          this.percentage = parseInt(e.loaded/e.total*100)
        }).then(async res=>{
          this.percentage = 0
          this.$emit('closePopover')
          this.$wangConfirm(res.message,()=>{this.$emit('confirm')},()=>{this.$emit('confirm')})
          // this.$message.success(res.message)
        }).catch(()=>{
          this.percentage = 0
        })
      }else{
        if (this.isOfficialSub) {
          createMultSubmitMaterial(formData,(e)=>{
            this.percentage = parseInt(e.loaded/e.total*100)
          }).then(async res=>{
            this.percentage = 0
            this.$message.success(res.message)
          }).catch(()=>{
            this.percentage = 0
          })
        } else {
          createMultMaterial(formData,(e)=>{
            this.percentage = parseInt(e.loaded/e.total*100)
          }).then(async res=>{
            this.percentage = 0
            this.$message.success(res.message)
          }).catch(()=>{
            this.percentage = 0
          })
        }
      }

    }
  },
  components:{
    UploadFile
  }
}
</script>

<style lang="scss" scoped>
.OfficialDocuments{
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}
.uploadIcon{
  position: absolute;
  display: flex;
  flex-wrap:wrap ;
  width: 100%;
  top: 50%;
  transform: translateY(-50%);
  text-align: center;
  .icon_wrap{
    width: 100%;

    i{
      font-size: 67px;
      color: #c0c4cc;
      line-height: 50px
    }
  }

}
.progressWrap{
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(0,0,0,0.6);
  .el-progress{
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    /deep/ .el-progress__text{
     color: #fff;
    }
    /deep/ path{
      fill: none !important;
    }
  }
}

</style>
