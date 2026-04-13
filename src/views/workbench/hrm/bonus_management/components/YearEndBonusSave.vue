<template>
    <div>
      <div class="box-border">
        <el-form :model="dataInfo" ref="ruleForm" :rules="rules" size="small" class="form-container" label-width="200px">
          <el-row v-if="!dataInfo.hasOwnProperty('id')" class="first-row">
            <el-col :span="24">
              <el-form-item label="人员类型:" class="postInfo-container-item">
                <el-radio v-model="type" label="1">正式员工</el-radio>
                <el-radio v-model="type" label="2">外挂人员</el-radio>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="type==1" class="first-row">
            <el-col :span="24">
              <el-form-item label="员工姓名:" class="postInfo-container-item" prop="talentCode">
                <span v-if="dataInfo.hasOwnProperty('id') && dataInfo.id !== 0"> {{ dataInfo.talentName }}</span>
                <el-select v-else v-model="dataInfo.talentCode" @change="handleTalentCodeChange" size="small" filterable clearable placeholder="姓名">
                  <el-option
                    v-for="item in userList"
                    :key="item.talentCode"
                    :label="item.talentName"
                    :value="item.talentCode">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <template v-else>
            <el-row class="first-row">
              <el-col :span="24">
                <el-form-item label="工号:" class="postInfo-container-item" prop="talentCode">
                  <el-input v-model="dataInfo.talentCode" placeholder="请输入工号"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="first-row">
              <el-col :span="24">
                <el-form-item label="姓名:" class="postInfo-container-item" prop="talentName">
                  <el-input v-model="dataInfo.talentName" placeholder="请输入姓名"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </template>
          <el-row class="first-row">
            <el-col :span="24">
              <el-form-item label="年度:" class="postInfo-container-item" prop="bonusYear">
                <el-input type="number" v-model="dataInfo.bonusYear" placeholder="请输入年度"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="first-row">
            <el-col :span="24">
              <el-form-item label="年终奖金额:" class="postInfo-container-item" prop="bonusAmount">
                <el-input type="number" placeholder="金额" v-model="dataInfo.bonusAmount" step="0.01"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="fl-ac-jc">
        <el-button size="small" style="width: 100px;margin-right: 20px" @click="closeDialog(false)">取 消</el-button>
        <el-button type="primary" size="small" style="width: 100px;" @click="submit">确 定</el-button>
      </div>
    </div>
  </template>
  
  <script>
  import { queryPersonAll, createPersonBonus, updateTalentBonusInfo } from '@/api/hrmList.js'
  export default {
    name: "YearEndBonusSave",
    props: ['dataInfo'],
    data() {
      return {
        userList: [], // 用户列表
        type: '1',
        rules: {
          talentCode: [
            { required: true, message: '请设置员工', trigger: 'change' }
          ],
          talentName: [
            { required: true, message: '请填写姓名', trigger: 'change' }
          ],
          bonusYear: [
            { required: true, message: '请填写年度', trigger: 'change' }
          ],
          bonusAmount: [
            { required: true, message: '请填写年终奖金额', trigger: 'change' }
          ]
        }
      }
    },
    created() {
      this.dataInit()
    },
    methods: {
      handleTalentCodeChange(selectedTalentCode) {
        // 在这里查找选中项的 talentName
        const selectedUser = this.userList.find(item => item.talentCode === selectedTalentCode);
        if (selectedUser) {
          this.dataInfo.talentName = selectedUser.talentName;
        }
      },
      dataInit() {
        queryPersonAll({ empStatus: '在职' }).then(res => {
          if (res.success) {
            this.userList = res.data
          }
        })
      },
      submit() {
        if (!this.$commonUtils.formValidate(this.$refs['ruleForm'])) return
        if (this.dataInfo.hasOwnProperty('id') && this.dataInfo.id !== 0) {
          updateTalentBonusInfo(this.dataInfo).then(res => {
            if (res.success){
              this.$message.success(res.message)
              this.closeDialog()
            }
          })
        }else{
          createPersonBonus(this.dataInfo).then(res => {
            if (res.success){
              this.$message.success(res.message)
              this.closeDialog()
            }
          })
        }
      },
      closeDialog() {
        this.$emit('closeDialog')
      },
    },
  }
  </script>
  
  <style lang="scss" scoped>
    /deep/ .el-form-item__error {
      position: relative;
    }
    .fl-ac-jc {
      margin-top: 15px;
    }
  
    .box-border {
      border: 1px solid #D7D7D7;
      padding: 10px 10px 5px 10px;
    }
  
    .form-container {
      .el-form-item__error {
        position: relative !important;
        top: 0;
      }
  
      /deep/ .el-row {
        margin: 0 0 5px 0;
        display: flex;
      }
  
      /deep/ .postInfo-container-item {
        height: 100%;
        width: 100%;
      }
  
      /deep/ .el-form-item__label {
        flex-shrink: 0;
        background-color: #F2F2F2;
        /*width: 36.7%;*/
        text-align: right;
      }
  
      /deep/ .el-form-item {
        border-right: 1px solid #F2F2F2;
        margin: 0px !important;
      }
  
      .first-row {
        border-top: 1px solid #F2F2F2;
      }
  
      /deep/ .el-row {
        border-bottom: 1px solid #F2F2F2;
        border-left: 1px solid #F2F2F2;
      }
  
      /deep/ td .el-input,
      /deep/ td .el-select {
        width: 100%;
      }
  
      /deep/ .el-form-item__content {
        text-align: left;
        word-break: break-word;
        // height: 30px;
      }
  
      /deep/ .el-select .el-input {
        width: 100%;
      }
  
      .postInfo-container-item {
        display: flex;
        width: 100%;
  
        /deep/ .el-form-item__content {
          text-align: left;
          display: inline-table;
          flex: 1;
          padding: 0px 15px;
          margin-left: 0 !important;

          /deep/ .el-form-item__error {
            position: relative;
          }
        }
  
        > > > .el-date-editor {
          width: 100%;
        }
      }
    }
  
    .divider {
      position: relative;
      border-bottom: 1px solid #797979;
      margin-bottom: 20px;
      /*border-right: 1px solid #ccc;*/
      margin-top: 20px;
  
      .el-badge {
        padding-right: 10px;
      }
  
      span {
        /*color: #333;*/
        /*font-weight: bold;*/
        font-size: 14px;
        background: #fff;
        position: absolute;
        bottom: -9px;
        left: 50px;
        padding: 0 10px;
      }
    }
  
    .el-table.el-table1 {
      /deep/ tr:nth-of-type(1) {
        th {
          padding: 0;
          background: #F2F2F2;
        }
      }
    }
  
    .tables {
      div {
        border: 1px solid #ccc;
        border-top: none;
        text-align: center;
        z-index: 9;
      }
    }
  
    .table-head {
      text-align: center;
      background-color: #f7f7f7;
    }
  
    .overflow-hidden {
      overflow: hidden;
      width: 100%;
      display: inline-block;
      text-overflow: ellipsis;
      white-space: nowrap;
      word-break: break-all;
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
  
    .require:before {
      content: "*";
      color: #f56c6c;
      margin-right: 4px;
    }
  
    .requireForm /deep/ .el-form-item__label:before {
      content: "*";
      color: #f56c6c;
      margin-right: 4px;
    }
  
    .red-color {
      color: red !important;
    }
  </style>
  