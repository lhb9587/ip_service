<template>
  <div class="industry-info">
    <el-button size="mini" type="primary" v-if="editStatus" @click="addIndustry">新增</el-button>
<!--    <div class="base-header">-->
<!--      <span class="left-line"></span>-->
<!--      <span class="right-text">行业</span>-->
<!--    </div>-->

    <div class="header-table">
      <el-table :max-height="clientHeight" class="el-table1" size="mini" :data="industryList" fit empty-text="暂无数据"
                highlight-current-row
                current-row-key style="width: 100%;" @row-dblclick="rowDbClick">
        <el-table-column label="行业" align="left" width>
          <template slot-scope="scope">
            <span :title="scope.row.fname">{{ scope.row.fname }}</span>
          </template>
        </el-table-column>
        <el-table-column label="细分行业" align="left" width>
          <template slot-scope="scope">
            <span :title="scope.row.info">{{ scope.row.info }}</span>
          </template>
        </el-table-column>
        <el-table-column label="行业标签" align="left" width>
          <template slot-scope="scope">
            <span :title="scope.row.customerTags">{{ scope.row.customerTags + '' }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="editStatus" label="操作" align="left" width="" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <span class="pointer" v-allow="51" @click="delIndustry(scope.row, scope.$index)">删除</span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      :title="'行业 - ' + title"
      style="position:absolute;left: 0;top: 0;" :fullscreen="false" :show-close="false"
      :close-on-click-modal="false" :modal="false"
      :visible.sync="industryView"
      width="60%"
      class="abow_dialog"
    >
      <div class="box-border">
        <el-form label-position="left" label-width="120px"
                 style="width: 100%;">
          <el-row class="form-border">
            <el-col :span="24">
              <el-row class="fullRow">
                <el-col :span="24">
                  <el-form-item label="行业:" class="postInfo-container-item">
                    <div v-if="title === '新建' || title === '修改'">
                      <el-select default-first-option :clearable='true' placeholder="请选择" v-model="industryData.induId"
                                 filterable>
                        <el-option v-for="(item,key) in industry" :key="key" :label="item.fname"
                                   :value="item.induid">
                        </el-option>
                      </el-select>
                    </div>
                    <div v-else>{{industryData.fname}}</div>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="fullRow">
                <el-col :span="24">
                  <el-form-item label="细分行业:" class="postInfo-container-item">
                    <div v-if="title === '新建' || title === '修改'">
                      <el-input size="mini" class="edit-border" placeholder="请填写:"
                                v-model="industryData.info"></el-input>
                    </div>
                    <div v-else>{{industryData.info}}</div>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="fullRow">
                <el-col :span="24">
                  <el-form-item label="行业标签:" class="postInfo-container-item">
                    <div v-if="title === '新建' || title === '修改'">
                      <el-select v-model="industryData.customerTags" filterable allow-create multiple clearable
                                 default-first-option placeholder="请选择标签">
                        <el-option
                          v-for="item in industryTagList"
                          :key="item.tagName"
                          :label="item.tagName"
                          :value="item.tagName">
                        </el-option>
                      </el-select>
                    </div>
                    <div v-else>{{industryData.customerTags && industryData.customerTags.join(',')}}</div>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer fl-ac-jc">
          <el-button size="small" @click="() => closeDialog(false)">取 消</el-button>
          <el-button size="small" type="primary" v-if="title === '新建' || title === '修改'" @click="submitData">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
  import {
    addCustomerIndustry, delCustomerIndustry,
    queryCustomerIndustry,
    queryIndustryTag,
    queryIndustryUrl,
    updateCustomerIndustry
  } from "../../../../../api/customerList";

  export default {
    name: "CustomerIndustry",
    props: {
      tabNo: {},
      editStatus: {
        type: Boolean,
        default: false
      },
      custId: {}
    },
    computed: {
      clientHeight() {
        return document.documentElement.clientHeight - 300
      },
    },
    data() {
      return {
        title: '',
        industryView: false,
        industryData: {
          customerTags: [],
          info: '',
          induId: ''
        },
        industryList: [],
        industry: [],
        industryTagList: []
      }
    },
    created() {
      this.queryList()
      queryIndustryUrl().then(response => {
        if (response.success) {
          this.industry = response.data;
        } else {
          this.$message.error(response.message);
        }
      })
      queryIndustryTag().then(res => {
        this.industryTagList = res.data || []
      })
    },
    methods: {
      submitData() {
        let list = []
        if (this.industryData.customerTags && this.industryData.customerTags.length) {
          list = JSON.parse(JSON.stringify(this.industryData.customerTags)).map(item => ({
            tagName: item
          }))
        }
        if (this.title === '修改') {
          updateCustomerIndustry({...this.industryData, customerTags: list}).then(res => {
            this.$message.success('修改成功！')
            this.closeDialog(true)
          })
        } else {
          this.industryData.custId = this.custId
          addCustomerIndustry({...this.industryData, customerTags: list}).then(res => {
            this.$message.success('新建成功!')
            this.closeDialog(true)
          })
        }
      },
      closeDialog(isSearch) {
        isSearch === true && this.queryList()
        this.title = ''
        this.industryData = {
          customerTags: [],
          info: '',
          induId: ''
        }
        this.industryView = false
        this.$emit('changeMask', {type: 'del', value: this.tabNo})
      },
      rowDbClick(row) {
        this.$emit('changeMask', {type: 'add', value: this.tabNo})
        this.industryData = JSON.parse(JSON.stringify(row))
        this.title = this.editStatus ? '修改' : '查看'
        this.industryView = true
      },
      delIndustry(row, index) {
        this.$confirm("此操作将永久删除, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          delCustomerIndustry({
            custduId: row.custduId
          }).then(res => {
            this.$message.success('删除成功!')
            this.industryList.splice(index, 1)
          })
        })
      },
      addIndustry() {
        this.$emit('changeMask', {type: 'add', value: this.tabNo})
        this.title = '新建'
        this.industryView = true
      },
      queryList() {
        queryCustomerIndustry({
          custId: this.custId
        }).then(res => {
          this.industryList = res.data || []
          this.industryList.forEach(item => {
            if (item.customerTags && item.customerTags.length) {
              item.customerTags = item.customerTags.map(itm => itm.tagName)
            }
          })
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  > > > .el-table1 {
    /*height: auto;*/

    .cell {
      max-height: 70px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      overflow: hidden;
    }
  }

  > > > .header-table {
    margin-top: 10px;
    padding: 0 0 0 15px;

    .el-table__header-wrapper {
      border: 1px solid #EBEEF5;
      border-bottom: none;

      th {
        background-color: #FAFAFA;
        font-size: 16px;
        color: #555555;
        font-weight: normal;
      }
    }
  }

  .industry-info {
    background-color: #fff;
    padding: 10px 15px;

    .el-button {
      float: right;
    }

    .base-header {
      display: flex;
      align-items: center;

      .left-line {
        display: inline-block;
        width: 10px;
        height: 26px;
        background-color: #409EFF;
        margin-right: 10px;
      }

      .right-text {
        font-weight: bold;
      }
    }
  }

  .form-border {
    /deep/ .el-row {
      margin: 0px;
    }

    /deep/ .postInfo-container-item {
      width: 100%;
    }

    /deep/ .el-form-item__label {
      background-color: #f9f9f9;
      width: 30%;
      text-align: right;
    }

    /deep/ .el-form-item {
      display: flex;
      height: 100%;
      border-right: 1px solid #d7d7d7;
      margin: 0px !important;
    }

    /deep/ .el-row {
      border-bottom: 1px solid #d7d7d7;
    }

    /deep/ .el-input,
    /deep/ .el-select {
      width: 70%;
    }

    /deep/ .el-form-item__content {
      flex: 1;
      text-align: left;
      padding-left: 10px;
      /*height: 30px;*/
      margin-left: 0 !important;
    }

    .fullRow {
      /deep/ .el-form-item__label {
        width: 15%;
      }

      /deep/ .el-input,
      /deep/ .el-select {
        width: 100%;
      }
    }

    /deep/ .el-input__inner {
      border: none;
    }

    /deep/ .el-select .el-input {
      width: 100%;
    }

    border-top: 1px solid #d7d7d7;
    border-left: 1px solid #d7d7d7;
    // border-bottom: 1px solid #d7d7d7;
  }

  /deep/ .el-col.el-col-12 {
    .el-cascader {
      width: 100%;

      .el-input {
        width: 100%;
      }
    }
  }

  > > > .el-dialog {
    margin-top: 5vh !important;
  }

  > > > .el-dialog__body {
    padding-top: 0;
    padding-bottom: 0;
    max-height: 500px;
    overflow: auto;
  }

  /deep/ .el-form-item__content {
    text-align: center;

    .el-form-item__error {
      position: relative;
      text-align: left;
      left: 0;
      top: 0;
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
</style>
