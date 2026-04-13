<template>
  <el-form :model="change" ref="modifyPassword" class="changePassword" :rules="rules">
    <el-form-item label="原密码:" class="postInfo-container-item" prop="oldPassword">
      <el-input :type="pwdType[0]" v-model="change.oldPassword" name="oldPassword" auto-complete="on" placeholder="原密码"/>
      <span class="show-pwd" @click="showPwd(0)">
              <svg-icon icon-class="eye" v-if="pwdType[0]==='password'" />
              <svg-icon icon-class="eye-open" v-if="pwdType[0]===''"/>
            </span>
    </el-form-item>
    <el-form-item label="新密码:" class="postInfo-container-item" prop="newPassword">
      <el-input :type="pwdType[1]" v-model="change.newPassword" name="newPassword" auto-complete="on" placeholder="新密码"/>
      <span class="show-pwd" @click="showPwd(1)">
              <svg-icon icon-class="eye" v-if="pwdType[1]==='password'"/>
              <svg-icon icon-class="eye-open" v-if="pwdType[1]===''"/>
            </span>
    </el-form-item>
    <el-form-item label="确认密码:" class="postInfo-container-item" prop="newPasswordAffirm">
      <el-input :type="pwdType[2]" v-model="change.newPasswordAffirm" name="newPasswordAffirm" auto-complete="on" placeholder="确认密码" @keyup.enter.native="modifyPassword"/>
      <span class="show-pwd" @click="showPwd(2)">
              <svg-icon icon-class="eye" v-if="pwdType[2]==='password'"/>
              <svg-icon icon-class="eye-open" v-if="pwdType[2]===''"/>
            </span>
    </el-form-item>
      <el-form-item label=" " label-width="100" class="postInfo-container-item">
          <span style="color: #E6A23C">
              密码必须由12~30位大写字母+小写字母+数字+特殊字符4种组成（缺一不可）特殊符合包括!@#$%^&*_
          </span>
      </el-form-item>

    <p class="button_warp">
      <el-button @click.prevent.stop="cancel">取消</el-button>
      <el-button type="primary" @click.prevent.stop="modifyPassword">确认修改</el-button>
    </p>
  </el-form>
</template>

<script>
import { upPassword } from '@/api/user'
export default {
  name: "index",
  data(){
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.change.newPasswordAffirm !== '') {
          this.$refs.modifyPassword.validateField('newPasswordAffirm');
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.change.newPassword) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      change:{
        userId:this.$store.getters.userId,
        oldPassword:'',
        newPassword:'',
        newPasswordAffirm:''
      },
      pwdType:new Array(3).fill('password'),
      rules: {
        oldPassword:[{
          validator: validatePass, trigger: 'blur'
        }],
        newPassword: [
          {validator: validatePass, trigger: 'blur'}
        ],
        newPasswordAffirm: [
          {validator: validatePass2, trigger: 'blur'}
        ],
      }
    }
  },
  methods:{
    showPwd(index){
      this.pwdType[index]==='password'?this.$set(this.pwdType,index,''):this.$set(this.pwdType,index,'password')
    },
    modifyPassword(){
      this.$refs.modifyPassword.validate().then(valid=>{
        if(valid){
          upPassword(this.change).then(res=>{
            this.cancel()
            this.$message.success('修改成功');
          })
        } else {
          return false
        }
      })
    },
    cancel() {
      this.$emit('closeCard',false)
    }
  }
}
</script>

<style lang="scss" scoped>
  .changePassword{
    border: 1px solid #f4f4f5;
    border-radius: 5px;
    display: flex;
    flex-direction:column ;
    justify-content: center;
    align-items: center;
    width: 100%;
    //width: 480px;
    height: 400px;
    background: #fff;
    z-index: 2;
  .button_warp{
    width: 100%;
    display: flex;
    justify-content: center;
  }
    .el-form-item{
      position: relative;
      display: flex;
      align-items: center;
      .el-input{
        margin-left: 0;
      }
      /deep/ .el-input__inner{
        padding-right:30px ;
        width: 250px;
      }
      /deep/ .el-form-item__label{
        width: 100px;
      }
      .show-pwd {
        position: absolute;
        height: 100%;
        right: 12px;
        top:0px;
        font-size: 16px;
        color: #889aa4;
        cursor: pointer;
        user-select: none;
      }
    }
  }

</style>
