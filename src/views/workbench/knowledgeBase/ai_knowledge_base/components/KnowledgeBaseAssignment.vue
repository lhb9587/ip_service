<template>
  <div>
    <el-alert
      title="添加或修改知识库操作权限:"
      type="info"
      description="单个用户： 可以查看并配置已勾选的权限列表；多个用户： 不显示已勾选的权限列表，支持统一配置权限；"
      :closable="false"
    />
    <div class="box-border">
      <el-form size="small" class="form-container" label-width="200px">
        <el-row class="first-row">
          <el-col :span="24">
            <el-form-item label="用户名称(可多个):" class="postInfo-container-item">
              <span v-if="configData.length > 0"> {{ configData.map(item => item.fullname).join(',') }}</span>
              <el-select v-else v-model="userIds" size="small" multiple filterable clearable placeholder="姓名">
                <el-option
                  v-for="item in userList"
                  :key="item.userId"
                  :label="item.fullname"
                  :value="item.userId"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="divider">
          <span>
            知识库授权
          </span>
        </div>
        <div style="display: block;">
          <el-transfer v-model="transferValue" :titles="['未选', '已选']" :data="transferData">
            <!-- 自定义选项显示内容 -->
            <!-- <template #default="{ option }">
              <div class="custom-option">
                <span v-if="!isInTarget(option.key)">{{ option.label }}</span>
                <span v-else>{{ option.label }} <span @click="permissionSetting(option)" style="float:right;color: #409EFF;">权限</span></span>
              </div>
            </template> -->
            <el-button @click="permissionSetting()"  class="transfer-footer" slot="right-footer" size="small">设置操作权限</el-button>
          </el-transfer>
        </div>
      </el-form>
    </div>
    <div class="fl-ac-jc">
      <el-button size="small" style="width: 100px;margin-right: 20px" @click="closeDialog(false)">取 消</el-button>
      <el-button type="primary" size="small" style="width: 100px;" @click="submit">确 定</el-button>
    </div>
    <el-dialog 
      title="知识库操作权限" 
      v-if="dialogTableVisible"
      :visible.sync="dialogTableVisible"
      append-to-body :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-table
        class="el-table1"
        :data="userKblibList.filter(item => this.transferValue.includes(item.kb_id))"
        style="width: 99.5%;"
        border
        max-height="280"
      >
        <el-table-column label="知识库名称">
          <template slot-scope="scope">
            {{ scope.row.kb_name }}
          </template>
        </el-table-column>
        <el-table-column label="上传文件权限">
          <template slot-scope="scope">
            <el-radio-group v-model="scope.row.upPermission">
              <el-radio :label="1">有</el-radio>
              <el-radio :label="0">无</el-radio>
            </el-radio-group>
          </template>
        </el-table-column>
        <el-table-column label="删除文件权限">
          <template slot-scope="scope">
            <el-radio-group v-model="scope.row.delPermission">
              <el-radio :label="1">有</el-radio>
              <el-radio :label="0">无</el-radio>
            </el-radio-group>
          </template>
        </el-table-column>
        <el-table-column label="勾选状态" width="160px">
          <template slot-scope="scope">
            <el-radio-group v-model="scope.row.ucheck">
              <el-radio :label="1">选中</el-radio>
              <el-radio :label="0">未选</el-radio>
            </el-radio-group>
          </template>
        </el-table-column>
      </el-table>
      <div class="fl-ac-jc">
        <el-button type="primary" size="small" style="width: 100px;" @click="dialogTableVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { queryKbLibList, queryUserLibList, updateUserLib } from '@/api/knowledgeBase.js'
import { transferDoc } from '../../../../../api/caseList'
export default {
  name: 'KnowledgeBaseAssignment',
  props: ['configData'],
  data() {
    return {
      userList: [], // 用户列表
      kbList: [], // 知识库列表
      userIds: [],
      userKblibList: [],
      transferValue: [],
      transferData: [],
      dialogTableVisible: false
    }
  },
  created() {
    this.userList = this.$store.getters.userList
    this.queryKbLibList()
    this.dataInit()
  },
  methods: {
    dataInit() {
      this.userIds = this.configData.map(item => item.userId)
      if (this.userIds.length === 1) {
        queryUserLibList({userId: this.userIds[0]}).then(res => {
          res.data.forEach(item => {
            this.transferValue.push(item.kb_id)
            const kblib = this.userKblibList.find(value => value.kb_id === item.kb_id);
            if (kblib) {
              kblib.upPermission = item.upPermission;
              kblib.delPermission = item.delPermission;
              kblib.ucheck = item.ucheck;
            }
          });
        })
      }
    },
    queryKbLibList() {
      this.transferData = []
      this.userKblibList = []
      queryKbLibList().then(res => {
        res.data.forEach(item => {
          this.transferData.push({
            key: item.kb_id,
            label: item.kb_name,
            disabled: false 
          })
          this.userKblibList.push({
            kb_id: item.kb_id,
            kb_name: item.kb_name,
            upPermission: 0,
            delPermission: 0,
            ucheck: 0
          })
        })
      })
    },
    // isInTarget(key) {
    //   return this.transferValue.includes(key);
    // },
    permissionSetting() {
      this.dialogTableVisible = true
    },
    submit() {
      console.log('userIds',this.userIds.length)
      if (this.userIds.length < 1) {
        this.$message.warning('请选择用户')
        return
      }
      this.submitAndNotify()
    },
    submitAndNotify() {
      // 构建所有的 API 请求
      const promises = this.userIds.map(item => {
        const submitInfo = {
          userId: item,
          userKblibList: this.userKblibList.filter(kbItem => this.transferValue.includes(kbItem.kb_id))
        };
        console.log('submitInfo',submitInfo)
        // 返回 API 请求的 Promise
        return updateUserLib(submitInfo);
      });

      // 使用 Promise.all 等待所有请求完成
      Promise.all(promises)
        .then(results => {
          // 检查所有请求是否成功
          const allSuccessful = results.every(res => res.success);

          if (allSuccessful) {
            this.$message.success('更新成功');
          } else {
            this.$message.error('更新失败');
          }

          this.closeDialog();
        })
        .catch(error => {
          console.error('更新过程中发生错误', error);
          this.$message.error('更新过程中发生错误');
        });
    },
    closeDialog() {
      this.$emit('closeDialog')
    }
  }
}
</script>

<style lang="scss" scoped>
.el-transfer {
  width: 100%; /* 设置整个组件的宽度 */
}

/deep/ .el-transfer-panel {
  width: 40%; /* 设置左右面板的宽度 */
  padding-bottom: 40px;
  .el-checkbox {
    width: 89%; /* 让 checkbox 占满整个行宽 */
  }
}

.transfer-footer {
  margin-left: 20px;
  padding: 6px 5px;
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
