<template>
  <div class="conflict-info">
    <el-button size="mini" type="primary" v-if="editStatus" @click="addConflict">新增</el-button>
<!--    <div class="base-header">-->
<!--      <span class="left-line"></span>-->
<!--      <span class="right-text">利益冲突</span>-->
<!--    </div>-->
    <div class="header-table">
      <el-table :max-height="clientHeight" class="el-table1" size="mini" :data="conflictList" fit empty-text="暂无数据"
                highlight-current-row
                current-row-key style="width: 100%;" @row-dblclick="rowDbClick">
        <el-table-column label="利益冲突者名称" align="left" width>
          <template slot-scope="scope">
            <span :title="scope.row.conName">{{ scope.row.conName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="英文名称" align="left" width>
          <template slot-scope="scope">
            <span :title="scope.row.conNameEn">{{ scope.row.conNameEn }}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" align="left" width>
          <template slot-scope="scope">
            <span :title="scope.row.memo">{{ scope.row.memo }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="editStatus" label="操作" align="left" width="" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <span class="pointer" v-allow="51" @click="delConflict(scope.row, scope.$index)">删除</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      :title="'利益冲突 - ' + title"
      style="position:absolute;left: 0;top: 0;" :fullscreen="false" :show-close="false"
      :close-on-click-modal="false" :modal="false"
      :visible.sync="conflictView"
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
                  <el-form-item label="利益冲突者名称:" class="postInfo-container-item">
                    <div v-if="title === '新建' || title === '修改'">
                      <el-select default-first-option :clearable='true' v-model="conflictData.conId"
                                 @change="conflictersChange(conflictData)" no-match-text='暂无数据' loading-text='正在查询'
                                 filterable remote reserve-keyword placeholder="请输入关键词"
                                 :remote-method="remotepaternalUnitactivityList">
                        <el-option v-for="item in activityList" :key="String(item.conId)" style="max-width: 400px" :title="item.fullname"
                                   :label="item.fullname" :value="item.conId">
                        </el-option>
                      </el-select>
                    </div>
                    <div v-else>{{conflictData.conName}}</div>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="备注:" class="postInfo-container-item">
                    <el-row style="border-bottom: none">
                      <div v-if="title === '新建' || title === '修改'">
                        <el-input size="mini" class="edit-border" placeholder="请填写:"
                                  v-model="conflictData.memo"></el-input>
                      </div>
                      <div v-else>{{conflictData.memo}}</div>
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
    addConflicterUrl, addCustomerConflicter, addCustomerConflicterNew, delConflicterUrl, delCustomerConflicter,
    queryActivityListflUrl,
    queryActivityListUrl, queryConflicterListByCustId, queryConflicterListByCustIdNew,
    querylyctListUrl, updateCustomerConflicterNew,
    updateCustomerConflicterUrl
  } from "../../../../../api/customerList";

  export default {
    name: "ConflictOfInterest",
    props: {
      tabNo: {},
      custId: {},
      editStatus: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        title: '',
        conflictData: {
          fullname: '',
          memo: ''
        },
        conflictList: [],
        conflictView: false,
        activityList: []
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
    created() {
      this.queryList()
    },
    mounted() {
      this.$nextTick(() => {
        // this.highLightFlag && Bus.$emit('highLightEvent')
      })
    },
    methods: {
      checkHighLight() {
        const valueText = this.highLightValue
        const root = document.querySelector('.conflict-info');
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
        indices.length && this.$store.commit('app/SET_HIGHT_LIST', '利益冲突')
      },
      remotepaternalUnitactivityList(query) {
        if (query !== "") {
          queryActivityListflUrl({fullname: query, pageSize: 50}).then(response => {
            if (response.success) {
              this.activityList = response.data;
            } else {
              this.$message.error(response.message);
            }
          });
        }
      },
      conflictersChange(row) {
        Object.assign(row, this.activityList.find(item => item.fullname == row.fullname))
      },
      submitData() {
        this.conflictData.custId = this.custId
        if (this.title === '修改') {
          updateCustomerConflicterNew(this.conflictData).then(res => {
            this.$message.success('修改成功!')
            this.closeDialog(true)
          })
        } else {
          addCustomerConflicterNew(this.conflictData).then(res => {
            this.$message.success('新建成功!')
            this.closeDialog(true)
          })
        }
      },
      closeDialog(isSearch) {
        this.conflictData = {
          fullname: '',
          memo: ''
        }
        isSearch === true && this.queryList()
        this.$emit('changeMask', {type: 'del', value: this.tabNo})
        this.conflictView = false
        this.title = ''
      },
      delConflict(row, index) {
        this.$confirm("此操作将永久删除, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          delCustomerConflicter({custConId: row.custConId}).then(res => {
            this.$message.success('删除成功！')
            this.conflictList.splice(index, 1)
          })
        })
      },
      addConflict() {
        this.title = '新建'
        this.conflictView = true
        this.$emit('changeMask', {type: 'add', value: this.tabNo})
      },
      queryList() {
        queryConflicterListByCustIdNew({custId: this.custId}).then(res => {
          this.conflictList = res.data || []
          this.$nextTick(() => this.highLightFlag && Bus.$emit('highLightEvent'))
        })
      },
      rowDbClick(row) {
        this.editStatus && this.remotepaternalUnitactivityList(row.conName)
        this.title = this.editStatus ? '修改' : '查看'
        this.$emit('changeMask', {type: 'add', value: this.tabNo})
        this.conflictData = JSON.parse(JSON.stringify(row))
        this.conflictView = true
      },
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

  .conflict-info {
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
