<template>
  <div class="company-info">
    <el-button size="mini" type="primary" v-if="editStatus" @click="addCompany">新增</el-button>
<!--    <div class="base-header">-->
<!--      <span class="left-line"></span>-->
<!--      <span class="right-text">关联公司</span>-->
<!--    </div>-->
    <div class="header-table">
      <el-table :max-height="clientHeight" class="el-table1" size="mini" :data="companyList" fit empty-text="暂无数据"
                highlight-current-row
                current-row-key style="width: 100%;" @row-dblclick="rowDbClick">
        <el-table-column label="公司名称" align="left" width>
          <template slot-scope="scope">
            <span :title="scope.row.custAssName">{{ scope.row.custAssName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="与关联公司关系" align="left" width>
          <template slot-scope="scope">
            <span :title="scope.row.relationship">{{ scope.row.relationship }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="editStatus" label="操作" align="left" width="" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <span class="pointer" v-allow="51" @click="delCompany(scope.row, scope.$index)">删除</span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      :title="'关联公司 - ' + title"
      style="position:absolute;left: 0;top: 0;" :fullscreen="false" :show-close="false"
      :close-on-click-modal="false" :modal="false"
      :visible.sync="companyView"
      width="60%"
      class="abow_dialog"
    >
      <div class="box-border">
        <el-form label-position="left" label-width="120px"
                 style="width: 100%;">
          <el-row class="form-border">
            <el-col :span="24">
              <el-row class="fullRow">
                <el-col :span="12">
                  <el-form-item label="公司名称:" class="postInfo-container-item">
                    <div v-if="title === '新建' || title === '修改'">
                      <el-input size="mini" class="edit-border" placeholder="请填写:"
                                v-model="companyData.custAssName"></el-input>
                    </div>
                    <div v-else>{{companyData.custAssName}}</div>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="与关联公司关系:" class="postInfo-container-item">
                    <el-row style="border-bottom: none">
                      <div v-if="title === '新建' || title === '修改'">
                        <el-input size="mini" class="edit-border" placeholder="请填写:"
                                  v-model="companyData.relationship"></el-input>
                      </div>
                      <div v-else>{{companyData.relationship}}</div>
                    </el-row>
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
  import Bus from '@/utils/Bus'
  import {
    addCustomerAssociate,
    delCustomerAssociate,
    queryCustomerAssociate,
    updateCustomerAssociate
  } from "../../../../../api/customerList";

  export default {
    name: "AssociationCompany",
    props: {
      tabNo: {},
      custId: {},
      editStatus: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      clientHeight() {
        return document.documentElement.clientHeight - 300
      },
      highLightFlag() {
        return this.$store.state.app.highLightFlag
      },
      highLightValue() {
        return this.$store.state.app.highLightValue
      },
    },
    watch: {
      highLightFlag(){
        this.checkHighLight()
      }
    },
    data() {
      return {
        companyView: false,
        companyList: [],
        title: '',
        companyData: {
          custId: '',
          relationship: '',
          custAssName: ''
        }
      }
    },
    created() {
      this.queryList()
    },
    mounted() {
      this.highLightFlag && Bus.$emit('highLightEvent')
    },
    methods: {
      checkHighLight() {
        const valueText = this.highLightValue
        const root = document.querySelector('.company-info');
        const treeWalker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
        const allTextNodes = [];
        let currentNode = treeWalker.nextNode();
        while (currentNode) {
          allTextNodes.push(currentNode);
          currentNode = treeWalker.nextNode();
        }
        let indices = [] // 位置信息
        const ranges = allTextNodes
          .map((el) => {
            return { el, text: el.textContent.toLowerCase() };
          })
          .map(({ text, el }) => {
            let startPos = 0
            while (startPos < text.length) {
              const index = text.indexOf(valueText.toLowerCase(), startPos);
              if (index === -1) break
              indices.push({
                el,
                start: index,
                end: index + valueText.length
              });
              startPos = index + valueText.length;
            }
          });
        indices.length && this.$store.commit('app/SET_HIGHT_LIST', '关联公司')
      },
      closeDialog(isSearch) {
        isSearch === true && this.queryList()
        this.$emit('changeMask', {type: 'del', value: this.tabNo})
        this.companyData = {
          custId: '',
          relationship: '',
          custAssName: ''
        }
        this.companyView = false
        this.title = ''
      },
      submitData() {
        this.companyData.custId = this.custId
        if (this.title === '修改') {
          updateCustomerAssociate(this.companyData).then(res => {
            this.$message.success('修改成功!')
            this.closeDialog(true)
          })
        } else {
          addCustomerAssociate(this.companyData).then(res => {
            this.$message.success('新建成功!')
            this.closeDialog(true)
          })
        }
      },
      addCompany() {
        this.$emit('changeMask', {type: 'add', value: this.tabNo})
        this.title = '新建'
        this.companyView = true
      },
      queryList() {
        queryCustomerAssociate({
          custId: this.custId
        }).then(res => {
          this.companyList = res.data
          this.$nextTick(() => this.highLightFlag && Bus.$emit('highLightEvent'))
        })
      },
      rowDbClick(row) {
        this.title = this.editStatus ? '修改' : '查看'
        this.$emit('changeMask', {type: 'add', value: this.tabNo})
        this.companyData = JSON.parse(JSON.stringify(row))
        this.companyView = true
      },
      delCompany(row, index) {
        this.$confirm("此操作将永久删除, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          delCustomerAssociate({custAssId: row.custAssId}).then(res => {
            this.$message.success('删除成功!')
            this.companyList.splice(index, 1)
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

  .company-info {
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
