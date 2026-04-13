<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" class="login-form" auto-complete="on" label-position="left">
      <h3 class="title">欢迎您登录办公平台</h3>
      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input v-model="loginForm.username" name="username" type="text" auto-complete="on" placeholder="username"  @keyup.enter.native="handleLogin" />
      </el-form-item>
      <el-form-item prop="password" style="margin-bottom: 0">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input :type="pwdType" v-model="loginForm.password" name="password" auto-complete="on" placeholder="password"
          @keyup.enter.native="handleLogin" />
        <span class="show-pwd" @click="showPwd">
          <svg-icon icon-class="eye" />
        </span>
      </el-form-item>
      <div style="margin: 5px 0">
        <el-checkbox v-model="loginForm.rememberPassword">记住密码</el-checkbox>
      </div>
      <el-form-item style="position: relative">
        <el-button type="text" class="wangjimima" @click="forgetPassWord">忘记密码</el-button>
        <el-button :loading="loading" type="primary" style="width:100%;" @click.native.prevent="handleLogin">登录
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import store from "../../store";
import {updateUserPassWordByUsername} from '@/api/systemList'
  const querystring = require("querystring");
export default {
  name: "Login",
  data() {
    return {
      loginForm: {
        username: localStorage.userName,
        password: localStorage.passWord,
        rememberPassword: true
      },
      flag:false,
      loading: false,
      pwdType: "password",
      redirect: undefined
    };
  },
  watch: {
    $route: {
      handler: function(route,oleRoute) {
        let redirect= route.query.redirect
        delete route.query.redirect
        this.redirect = redirect+'?'+querystring.stringify(route.query)
      },
      immediate: true
    }
  },
  methods: {
    forgetPassWord(){
      updateUserPassWordByUsername({ userName: this.loginForm.username }).then(res=>{
          this.$message.success(res.message)
      })
    },
    showPwd() {
      if (this.pwdType === "password") {
        this.pwdType = "";
      } else {
        this.pwdType = "password";
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("user/login", this.loginForm)
            .then(async() => {
              this.flag=false;
              this.loading = false;
              localStorage.userName = this.loginForm.username;
              localStorage.passWord = this.loginForm.rememberPassword ? this.loginForm.password : '';
              this.$store.dispatch('user/getInfo').then(async res=>{
                const { permissions,domainList } = this.$store.getters
                // generate accessible routes map based on roles
                const accessRoutes =  await this.$store.dispatch('permission/generateRoutes',{ permissions,domainList})

                // // dynamically add accessible routes
                this.$router.addRoutes(accessRoutes)
                this.$store.dispatch('user/getTodoTaskNotice');
                if(localStorage.getItem('historyPath')){
                  this.$router.replace({ path: localStorage.getItem('historyPath') });
                }else{
                  this.$router.replace({ path: this.redirect || "/" });
                }
              }).catch(res=>{
                this.$message.error(res)

              })
              //
            })
            .catch(() => {
              this.loading = false;
              this.flag=true
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
$bg: #2d3a4b;
$light_gray: #eee;

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: #ffffff;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: inherit;
      height: 47px;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px #ffffff inset !important;
        -webkit-text-fill-color: inherit !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: #ffffff;
    border-radius: 5px;
    color: #454545;
  }
  .el-button {
    background: linear-gradient(
      -83deg,
      rgba(10, 96, 255, 1),
      rgba(64, 139, 255, 1),
      rgba(93, 163, 255, 1),
      rgba(109, 177, 255, 1)
    );
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #3b4457;
.login-container {
  position: fixed;
  height: 100%;
  width: 100%;

  background-image: url("../../assets/bj-dl1.png");
  .login-form {
    position: absolute;
    left: 50%;
    top: 10%;
    right: 0;
    width: 520px;
    max-width: 100%;
    padding: 35px 35px 15px 35px;
    margin: 120px auto;
    background: #f9f9f9;
  }
  @media screen and (max-width: 768px) {
    .login-form {
      left: 0;
      /*margin-left: 10px;*/
      /*margin-right: 10px;*/
      /*width: 80%;*/
    }
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }
  .title {
    font-size: 24px;
    font-weight: 100;
    color: $light_gray;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .wangjimima{
    color: red;
    float: right;
    border: 0;
    position: absolute;
    right: 0;
    top: -30px;
    background: transparent;
  }
}
</style>
