<template>
    <div>
      <el-alert
        title="备注信息说明:"
        type="info"
        description="添加或修改备注信息，薪酬统计结果数据联动更新"
        :closable="false">
      </el-alert>
      <div class="box-border">
        <el-form size="small" class="form-container" label-width="200px">
          <el-row class="first-row">
            <el-col :span="24">
              <el-form-item label="员工姓名:" class="postInfo-container-item">
                <span v-if="salaryConfigData.length !== 0"> {{ extInfo[0].talentName }}</span>
                <el-select v-else v-model="extInfo[0].talentCode" @change="handleTalentCodeChange" size="small" filterable clearable placeholder="姓名">
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
          <div class="divider">
            <span>
              年度薪酬统计信息
            </span>
          </div>
          <el-row>
            <el-table
              class="el-table1"
              :data="extInfo"
              style="width: 99.5%;"
              border
              maxHeight="280"
            >
              <el-table-column label="年度" width="150px">
                <template slot-scope="scope">
                  <el-date-picker
                  v-model="scope.row.perYear"
                  type="year"
                  format="yyyy"
                  value-format="yyyy"
                  placeholder="选择年"
                  size="mini">
                </el-date-picker>
                </template>
              </el-table-column>
              <el-table-column label="备注">
                <template slot-scope="scope">
                  <el-input type="textarea" size="mini" v-model="scope.row.memo"></el-input>
                </template>
              </el-table-column>
            </el-table>
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
  import { queryPersonAll, updateTalentPersonExtInfo } from '@/api/hrmList.js'
  export default {
    name: "ExtInfoSave",
    props: ['salaryConfigData'],
    data() {
      return {
        userList: [], // 用户列表
        extInfo: [{
          talentCode: '',
          talentName: '',
          perYear: new Date().getFullYear().toString(),
          memo: ''
        }]
      }
    },
    created() {
        this.dataInit()
        if (this.salaryConfigData.length !== 0) {
          this.salaryConfigData.perYear = this.salaryConfigData.perYear.toString()
          this.extInfo = [this.salaryConfigData]
        }
    },
    methods: {
      handleTalentCodeChange(selectedTalentCode) {
        // 在这里查找选中项的 talentName
        const selectedUser = this.userList.find(item => item.talentCode === selectedTalentCode);
        if (selectedUser) {
          this.extInfo[0].talentName = selectedUser.talentName;
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
        updateTalentPersonExtInfo(this.extInfo[0]).then(res => {
          if (res.success){
            this.$message.success(res.message)
            this.closeDialog()
          }
        })
      },
      closeDialog() {
        this.$emit('closeDialog')
      },
    }
  }
  </script>
  
  <style lang="scss" scoped>
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
  