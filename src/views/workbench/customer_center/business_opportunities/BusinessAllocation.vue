<template>
  <div>
    <div class="box-border">
      <el-form size="small" class="form-container" label-width="120px">
        <el-row class="first-row">
          <el-col :span="12">
            <el-form-item label="分配人:" class="postInfo-container-item">
              <el-select size="mini"
                         class="edit-border" style="width: 100%;" v-model="businessData.fpUserArray" multiple filterable
                         clearable
                         placeholder="请选择分配人">
                <el-option
                  v-for="item in $store.getters.userList"
                  :key="item.userId"
                  :label="item.fullname"
                  :value="item.userId">
                  <!--                  <UserIconAndUserName :user-id="item.userId"></UserIconAndUserName>-->
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分配组:" class="postInfo-container-item">
              <el-row>
                <el-select size="mini"
                           class="edit-border" style="width: 100%" default-first-option :clearable='true'
                           placeholder="请选择分配组"
                           v-model="businessData.fpWkgArray" multiple filterable>
                  <el-option v-for="(item,key)  in workGroupList" :key="item.wkgId" :label="item.groupName"
                             :value="item.wkgId">
                  </el-option>
                </el-select>
              </el-row>
            </el-form-item>
          </el-col>
        </el-row>

        <div class="divider">
          <span>
              分配描述
          </span>
        </div>
        <el-input type="textarea" v-model="businessData.fpdesc" :autosize="{ minRows: 4}"
                  placeholder="[分配描述]:"></el-input>

      </el-form>
    </div>
    <div class="fl-ac-jc">
      <el-button size="small" style="width: 100px;margin-right: 0px" @click="() => closeDialog(false)">取 消</el-button>
      <el-button size="small" type="primary" style="width: 100px;margin-right: 0px" @click="submit">确 定</el-button>
    </div>
  </div>
</template>

<script>
  import {queryWorkGroup} from "../../../../api/systemList";
  import {shangjiFenpei} from "../../../../api/business";

  export default {
    name: "BusinessAllocation",
    props: {
      sjId: {}
    },
    data() {
      return {
        businessData: {
          sjId: '',
          fpUserArray: [],
          fpWkgArray: [],
          fpdesc: ''
        },
        workGroupList: []
      }
    },
    created() {
      this.queryWorkGroup()
    },
    methods: {
      submit() {
        if (!this.businessData.fpUserArray) {
          this.$message.error('请选择分配人!')
          return
        }
        if (!this.businessData.fpWkgArray) {
          this.$message.error('请选择分配组!')
          return
        }
        shangjiFenpei({...this.businessData, sjId: this.sjId}).then(res => {
          this.$message.success('分配成功!')
          this.closeDialog(true)
        })
      },
      closeDialog(isSearch) {
        this.$emit('close', isSearch === true)
      },
      queryWorkGroup() {
        queryWorkGroup().then(res => {
          this.workGroupList = res.data
        })
      }
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
      .el-row{
        border: none;
      }
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
        padding: 5px 15px;
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
      border-right: none;
      text-align: center;
      z-index: 9;
    }

    div:nth-child(3) {
      border-right: 1px solid #ccc;
    }
  }

  .table-head {
    text-align: center;
    background-color: #f7f7f7;
    border-top: 1px solid #ccc !important;
  }

  .overflow-hidden {
    overflow: hidden;
    width: 100%;
    display: inline-block;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-break: break-all;
    cursor: pointer !important;
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

  .timeDiv {
    position: absolute;
    left: 100px;
    top: 10px;
    width: 180px;
  }

  > > > .el-select, > > > .el-cascader {
    width: 100%;

    .el-cascader__label {
      padding-left: 0;
      font-size: 14px;
      color: #000000;
    }

    .el-input.is-focus .el-input__inner {
      border-radius: 0;
      border-color: #fff;
      border-bottom: 1px solid #f2f2f2;
    }
  }

  .edit-border {
    /deep/ .el-input__inner {
      border: 1px solid #fff;
      font-size: 14px;
      color: #000000;
      padding-left: 0;

      &:hover {
        border-radius: 0;
        border-bottom: 1px solid #f2f2f2;
      }
    }
  }

  .date-border {
    /deep/ .el-input__prefix {
      left: -5px;
    }

    /deep/ .el-input__inner {
      border: 1px solid #fff;
      font-size: 14px;
      color: #000000;
      padding-left: 20px;

      &:hover {
        border-radius: 0;
        border-bottom: 1px solid #f2f2f2;
      }
    }
  }
</style>
