<template>
  <el-dialog
    title="高级邮箱设置"
    :visible.sync="settingState"
    width="50%"
    class="el-dialog-tmTable"
    :before-close="handleClose"
  >
    <el-form :model="mailbox" ref="ruleForm" label-width="20%">
      <el-form-item label="邮箱:" class="postInfo-container-item" prop="email" :rules="[
      { required: true, message: '请输入邮箱地址', trigger: 'blur' },
      { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
    ]">
        <el-input v-model="mailbox.email" @keyup.enter.native="affirmatory"></el-input><el-button type="primary" style="margin-left: 30px " @click="affirmatory">确定</el-button>
      </el-form-item>
      <el-form-item label="邮箱密码:" class="postInfo-container-item">
        <el-input type="password" v-model="mailbox.password" autocomplete="off" placeholder="******"></el-input>
      </el-form-item>
      <el-form-item label="收件箱协议:" class="postInfo-container-item">
        <el-input v-model="mailbox.protocol"></el-input>
      </el-form-item>
      <el-form-item label="收件箱邮箱服务器:" class="postInfo-container-item">
        <el-input v-model="mailbox.mailServerHost"></el-input>
      </el-form-item>
      <el-form-item label="收件箱服务端口:" class="postInfo-container-item">
        <el-input v-model="mailbox.mailServerPort"></el-input>
      </el-form-item>
      <el-form-item label="发件箱协议:" class="postInfo-container-item">
        <el-input v-model="mailbox.outboxProtocol"></el-input>
      </el-form-item>
      <el-form-item label="发件箱邮箱服务器:" class="postInfo-container-item">
        <el-input v-model="mailbox.outboxMailServerHost"></el-input>
      </el-form-item>
      <el-form-item label="发件箱服务器端口:" class="postInfo-container-item">
        <el-input v-model="mailbox.outboxMailServerPort"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('settingChange',false)">取 消</el-button>
      <el-button type="primary" @click="modifyMailSetting">确认修改</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import {upMailbox,addMailbox} from '@/api/mailList'
export default {
  props:{
    settingState:{
      type: Boolean,
     // default:false
    },
    mailbox: {
      type: Object
    },
    userId:{
    }
  },
  name: 'advancedMailboxSettings',
  data(){
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        callback();
      }
    };
    return {
      rules: {
        password: [
          { validator: validatePass, trigger: 'blur' }
        ],
      }
    }
  },
  methods: {
    modifyMailSetting() {
      this.mailbox.userId = this.userId
      if(this.userId){
        this.$refs.ruleForm.validate().then(validate=>{
          if(validate){
            upMailbox(this.mailbox).then(res=>{
              this.$emit('updateMailbox',res.data)
              this.$emit('settingChange',false)
            })
          } else {
            return false;
          }
        })
      }else {
        this.$emit('updateMailbox',this.mailbox)
        this.$emit('settingChange',false)
      }
    },
    handleClose(done){
      this.$emit('settingChange',false)
     // done()
    },
    affirmatory(){
      if(/ipshine.com/.test(this.mailbox.email)){
        this.mailbox.protocol='imap';
        this.mailbox.mailServerHost='imap.mxhichina.com';
        this.mailbox.mailServerPort=143;
        this.mailbox.validate=true;
        this.mailbox.outboxProtocol='smtp';
        this.mailbox.outboxMailServerHost='smtp.mxhichina.com';
        this.mailbox.outboxMailServerPort=25;
        this.mailbox.outboxValidate=true;
        this.mailbox.connectType='';
        this.mailbox.outboxConnectType='';
      }else if(/wanhuida.com/.test(this.mailbox.email)){
        this.mailbox.protocol='imap';
        this.mailbox.mailServerHost='outlook.office365.com';
        this.mailbox.mailServerPort=993;
        this.mailbox.validate=true;
        this.mailbox.outboxProtocol='smtp';
        this.mailbox.outboxMailServerHost='smtp.outlook.office365.com';
        this.mailbox.outboxMailServerPort=587;
        this.mailbox.outboxValidate=true;
        this.mailbox.connectType='SSL';
        this.mailbox.outboxConnectType='TLS';
      }else if(/wanhuida.net/.test(this.mailbox.email)){
        this.mailbox.protocol= 'imap'
        this.mailbox.mailServerHost='mail.wanhuida.net';
        this.mailbox.mailServerPort=143;
        this.mailbox.validate=true;
        this.mailbox.outboxProtocol='smtp';
        this.mailbox.outboxMailServerHost='mail.wanhuida.net';
        this.mailbox.outboxMailServerPort=25;
        this.mailbox.outboxValidate=true;
        this.mailbox.connectType='SSL';
        this.mailbox.outboxConnectType='TLS';
      }
      this.$forceUpdate()
    }
  }
}
</script>

<style lang="scss" scoped>
.el-form{
  /deep/ .el-form-item__content{
    display: flex;
  }
  .el-input{
    width: 50%;
  }
}
/deep/ .el-dialog__title{
  color: #409EFF;
}
  .dialog-footer{
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
