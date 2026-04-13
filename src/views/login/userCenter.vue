<template>
  <div style="padding:0 40px">
    <header>个人中心</header>
<!--     <cropper @getClientFile="getClientFile" ></cropper>-->
    <section>
      <div class="img_warp">

        <el-upload
          ref="upload"
          class="avatar-uploader"
          :action="addUserIconUrl"
          :show-file-list="false"
          :before-upload="beforeAvatarUpload"
          :auto-upload="true"
          :on-change="fileChange"
          :data="postPicData">
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </div>
      <div class="modifyImg" style="cursor: pointer" @click="dialogVisible=true"><img src="https://axure-file.lanhuapp.com/e51805bf-7a6b-41af-9c2d-8fd8e8dfdb07__d81c3885948333bab55f3869baeb7421" alt=""></div>
      <div class="info_warp">
        <p><span>账户名:</span>{{userData.fullname}}</p>
        <p><span>密码:</span>********</p>
        <p><span>职务:</span>{{userData.duty}}</p>
        <p><span>性别:</span>{{userData.sex==2?'女':'男'}}</p>
        <p><span>邮箱:</span>{{userData.email}} <span class="setHeight" @click="settingState = true">高级邮箱设置</span></p>
        <p><span>员工号:</span>{{userData.wechat}}</p>
        <p><span>电话:</span>{{userData.phone}}</p>
        <p><span>绑定微信:</span><img :src="qrCodeUrl" width="200" height="200" alt=""></p>
      </div>
    </section>
    <advancedMailboxSettings :userId="$store.getters.userId" :mailbox="mailbox" :settingState="settingState" @settingChange="settingChange" @updateMailbox="updateMailbox"></advancedMailboxSettings>
    <el-dialog
      title="修改帐号信息"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="()=>dialogVisible = false">
      <section>
        <el-form :model="userData"  label-width="200px">
          <el-form-item label="账户名:" class="postInfo-container-item">
            {{userData.username}}
          </el-form-item>
          <el-form-item label="员工号:" class="postInfo-container-item">
            <el-input v-model="userData.wechat"></el-input>
          </el-form-item>
          <el-form-item label="电话:" class="postInfo-container-item">
            <el-input v-model="userData.phone"></el-input>
          </el-form-item>
        </el-form>
      </section>
      <span slot="footer" class="dialog-footer">
   <el-button @click="dialogVisible = false">取 消</el-button>
   <el-button type="primary" @click="upUser">确 定</el-button>
 </span>
    </el-dialog>
  </div>
</template>

<script>
import advancedMailboxSettings from '@/views/workbench/system_management/staff_management/components/advancedMailboxSettings.vue'
import { queryUserById } from '@/api/systemList'
import { addUserIcon } from '@/api/serviceApi.config.js'
import {getQrCodeImage, upUser} from '@/api/user'
import cropper from "@/components/cropper";
export default {
 name: "userCenter",
 data(){
   return{
     qrCodeUrl: '',
     settingState:false,
     imageUrl:'',
     mailbox:{},
     userData:{
     },
     postPicData:{
       userId:this.$store.getters.userId,
       tokenID:this.$store.getters.token,
     },
     addUserIconUrl:process.env.VUE_APP_BASE_API+addUserIcon,
     dialogVisible:false
   }
 },
 created(){
   this.queryUserById(this.$store.getters.userId)
   this.getQrImage()
 },
 methods:{
   getQrImage(){
     getQrCodeImage().then(res => {
      res.data = res.data.replace(/^ome\/newipdoc/, 'ipdoc');
      this.qrCodeUrl = res.data;
     })
   },
   getClientFile(formData) {
     console.log(formData);
   },
   // 根据Id查询信息组织页面数据
   queryUserById(userId){
     queryUserById(userId).then(res=>{
       this.imageUrl='/ipdoc'+res.data.user.userIcon
       this.mailbox=res.data.mailbox
       this.userData=res.data.user
     })
   },
   settingChange(data){
     this.settingState=data
   },
   updateMailbox(data){
     this.mailbox=data
   },
   beforeAvatarUpload(file) {
     const isJPGOrisPNG = file.type === 'image/jpeg'||file.type === 'image/png' ;
     const isLt200K = file.size / 1024 / 1024 / 1024< 200;
     if (!isJPGOrisPNG) {
       this.$message.error('上传头像图片只能是 JPG 格式或者PNG');
     }
     if (!isLt200K) {
       this.$message.error('上传头像图片大小不能超过 200K!');
     }
     return isJPGOrisPNG && isLt200K;
   },
   fileChange(file){
     this.imageUrl = URL.createObjectURL(file.raw);
   },
   upUser(){
     let arr=['agency','cooperationAgency','roles','permissions','departments','departments','customers','positionStr','userIdArray']
     arr.forEach(item=>{
       delete this.userData[item]
     })
     upUser(this.userData).then(res=>{
       this.dialogVisible = false
     })
   }
 },
 components:{
   advancedMailboxSettings,cropper
 }

}
</script>

<style lang="scss" scoped>
 header{
   height:36px;
   font-size:18px;
   font-family:SourceHanSansCN-Normal;
   font-weight:400;
   color:rgba(38,42,47,1);
   line-height: 36px;
 }
 section{
   display: flex;
   .img_warp{
     display: flex;
     justify-content: center;
     align-items: center;
     width: 200px;
     height: 200px;

     img{
       width: 200px;
     }
   }
   .modifyImg{
     margin-left: 35px;
     margin-right: 20px;
     height: 70px;
     display: flex;
     align-items: center;
     width: 19px;
     img{
       width: 100%;
     }
   }
   .info_warp{
     p{
       display: flex;
       align-items: center;
       .setHeight{ margin-left: 20px;cursor: pointer ;font-size: 14px;color: #409EFF}
       span{
         line-height: 70px;
         display: inline-block;
         width: 100px;
         text-align: center;
       }
     }
   }

 }
</style>
