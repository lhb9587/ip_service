<template>
  <div>
    <div class="title" style="padding-left: 50px ">
      案件信息
    </div>
    <el-table :key="caseKey" ref="refCase" :data="caseTableList" border class="el-table1" max-height="400"
              @selection-change="caseSelectionChange">
      <el-table-column type="selection" width="40" v-if="taskNo === 1" :selectable="selectAble">

      </el-table-column>
      <el-table-column type="index" width="60" label="序号" align="left">

      </el-table-column>
      <el-table-column align="left" :key="item.title" v-for="(item, index) in tableTitleList" :label="item.title"
          :width="item.width ? item.width : ''"
          :prop="item.value">
        <template slot-scope="scope">
          <div v-if="item.value === 'abslimitDate'">
            <el-date-picker
              size="mini"
              style="width: 100%;"
              v-model="scope.row.abslimitDate"
              type="date"
              placeholder="请选择时期"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </div>
          <p v-else style="margin: 0;cursor: pointer" :title="scope.row[item.value] || ''"
             @click="caseDetailClick(scope.row.caseId)">
            {{scope.row[item.value]}}</p>
        </template>
      </el-table-column>
      <el-table-column
        prop="writerPeople"
        label="撰写人"
        v-if="taskNo !== 1 && !atData.editWritePeople"
        >
      </el-table-column>
      <el-table-column
        prop="writerPeople"
        label="撰写人"
        v-else
        >
        <template slot-scope="scope">
          <el-select v-model="scope.row.writerPeople"
            placeholder="请选择撰写人"
            size="mini"
            :disabled="taskNo !== 1 && !atData.editWritePeople"
            @change="(v) => changeWritePeople(scope.row, v )"
          >
            <el-option
              v-for="item in writerList"
              :key="item.userId"
              :label="item.name"
              :value="item.userId">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
    </el-table>

    <div>
      <el-form ref="submission" :model="submitData" label-width="120px" :rules="rules">
        <div class="table-top">
          <el-collapse style="width: 100%;margin-bottom: 10px">
            <el-collapse-item name="1">
              <template slot="title">
                <div class="title">
                  参考案件
                </div>
              </template>
              <div style="margin-bottom: 5px">
                <el-button size="mini" type="primary" @click="changeCaseVisible = true">添加</el-button>
                <el-button size="mini" type="primary" @click="delRefCase">删除</el-button>
              </div>
              <div style="display: flex;width: 100%;">
                <el-table @selection-change="selectionChange" :data="refCaseList" border class="el-table1"
                          max-height="300"
                          style="margin: 0px 0px 10px 0;flex:1">
                  <el-table-column type="selection" width="40">

                  </el-table-column>
                  <el-table-column type="index" width="60" label="序号" align="left">

                  </el-table-column>
                  <el-table-column :width="item.width" align="left" :key="item.title"
                                   v-for="(item, index) in tableTitleList"
                                   :label="item.title"
                                   :prop="item.value">
                    <template slot-scope="scope">
                      <p style="margin: 0;cursor: pointer"
                         @click="caseDetailClick(scope.row.caseId)"
                         :title="scope.row[item.value] || ''">
                        {{scope.row[item.value]}}</p>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
        <el-row>
          <el-form-item label="撰写人:" v-if="taskNo === 1">
            <el-select size="mini" v-model="writerPeople"
                       @change="changePeople"
                       placeholder="请选择撰写人"
                       filterable
                       clearable>
              <el-option
                v-for="item in writerList"
                :key="item.userId"
                :label="item.name"
                :value="item.userId">
              </el-option>
            </el-select>
            <el-button size="mini" type="primary" @click="handleWriter">指派</el-button>
          </el-form-item>
          <el-form-item label="案件撰写级别">
            <el-select size="small" v-model="submitData.zxLevel" placeholder="请选择"
                       filterable
                       clearable>
              <el-option
                v-for="item in zxLevelList"
                :key="item.id"
                :label="item.value"
                :value="item.id">
                <!--                <UserIconAndUserName :user-id="item.userId"></UserIconAndUserName>-->
              </el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row v-if="submitData.first === 1">
          <el-form-item label="首次递交理由是否完整" :prop="(submitData.wfStatus === '待撰写负责人指派' ||  type === 'edit') ? '' : 'compl'">
            <el-radio-group v-model="submitData.compl">
              <el-radio :label='1'>是</el-radio>
              <el-radio :label='2'>否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="申请人:" v-if="type=='create'">{{$store.getters.name}}</el-form-item>
          <el-form-item label="申请人:" v-else>{{$store.getters.allUserList.find(item => item.userId == submitData.userId)
            && $store.getters.allUserList.find(item => item.userId == submitData.userId).fullname}}
          </el-form-item>
          <el-form-item label="创建日期:">{{submitData.createDate || $commonUtils.formatDate(new Date)}}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="备注:" style="border: 1px solid #EBEEF5;">
            <el-input type="textarea" v-model="submitData.memo"></el-input>
          </el-form-item>
        </el-row>
        <div class="fl-ac-jc" style="width: 100%;margin-top: 15px;">
          <template v-if="type == 'create'">
            <el-button size="small" type="primary" @click="submit">提 交</el-button>
          </template>
          <template v-else>
            <div v-if="atData.isModifyFlag">
              <el-button size="small" type="primary" @click="saveWrite">保 存</el-button>
            </div>
            <div v-else>
              <el-button size="small" type="primary" @click="doTask" v-if="taskNo == 1">确 定</el-button>
              <el-button size="small" type="primary" @click="doTask" v-if="taskNo == 2">撰写完成</el-button>
              <el-button size="small" type="primary" @click="doTask(1)" v-if="taskNo == 3">通 过</el-button>
              <el-button size="small" type="primary" @click="doTask(0)" v-if="taskNo == 3">退 回</el-button>
              <el-button size="small" type="primary" @click="doTask(1)" v-if="taskNo == 4">通 过</el-button>
              <el-button size="small" type="primary" @click="doTask(0)" v-if="taskNo == 4">退 回</el-button>
            </div>
          </template>
          <el-button size="small" @click="closeDialog" style="margin-left: 15px">取 消</el-button>
        </div>
      </el-form>
    </div>

    <ChooseCase
      :isWriting="true"
      :dialogVisible="changeCaseVisible"
      :agentNums="[]"
      @closed="ChooseCaseClose"
      rules="custId"
      @getList="getList">
    </ChooseCase>
  </div>
</template>

<script>
  import {
    createArticleApp, doArticleTask, modifyArticleApp,
    queryArticleDetail, queryArticleWriter,
    queryCase,
    queryRefCaseIdList,
    queryZxLevel
  } from "../../../../../api/caseList";
  import ChooseCase from "../../components/ChooseCase";

  export default {
    name: "TrademarkWritingDetailEdit",
    components: {ChooseCase},
    props: {
      taskIdList: {
        type: Array
      },
      taskNo: {
        type: [String, Number]
      },
      atData: {
        type: Object,
        default: () => ({})
      },
      type: {
        type: String
      },
      caseIds: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {
        rules: {
          compl: [
            {
            required: true,
              trigger: "change",
              message: "请选择首次递交理由是否完整"
            }
          ]
        },
        caseKey: false,
        writerPeople: '',
        caseSelectionCaseList: [],
        taskNo1CaseIds: [],
        writerList: [],
        zxLevelList: [],
        refSelectionCaseList: [],
        changeCaseVisible: false,
        submitData: {
          compl: undefined
        },
        refCaseList: [],
        caseTableList: [],
        tableTitleList: [
          {"title": "案件文号", "value": "agentNum"},
          {"title": "案件类型", "value": "caseType", "boo": "2"},
          {"title": "商标名称", "value": "tmName"},
          {"title": "商标号", "value": "regNumber"},
          {"title": "商标类别", "value": "goodClasses"},
          {"title": "客户", "value": "custName"},
          {"title": "申请人中文名称", "value": "appCnName", "boo": "1"},
          {"title": "阶段", "value": "stageName"},
        ],
      }
    },
    created() {
      this.init()
      this.tableTitleList = [
        {"title": "案件文号", "value": "agentNum", width: 130},
        {"title": "案件类型", "value": "caseType", "boo": "2"},
        {"title": "商标名称", "value": "tmName"},
        {"title": "商标号", "value": "regNumber", width: 90},
        {"title": "商标类别", "value": "goodClasses", width: 80},
        {"title": "客户", "value": "custName"},
        {"title": "申请人中文名称", "value": "appCnName", "boo": "1"},
        {"title": "阶段", "value": "stageName", width: 50},
        {"title": "官方时限", "value": "gflimitDate", width: 100},
        {"title": "撰写时限", "value": "abslimitDate", width: 150},
      ]
    },
    methods: {
      async saveWrite(flag) {
        if (!this.$commonUtils.formValidate(this.$refs.submission)) return
        await modifyArticleApp({
          ...this.submitData,
          caseIdList: this.caseTableList.map(item => item.caseId),
          refCaseIdList: this.refCaseList.map(item => item.caseId),
          crtWriterList: this.caseTableList.map(item => ({
            caseId: item.caseId,
            writer: (typeof item.writerPeople ==='string')?item.writerPeopleId:item.writerPeople,
          })).filter(item => item.writer),
          timeLimitList: this.caseTableList.map(item => ({
            caseId: item.caseId,
            abslimitDate: item.abslimitDate,
            gflimitDate: item.gflimitDate
          }))
        }).then(res => {
          flag !== true && this.$message.success('修改成功!')
          flag !== true && this.closeDialog(true)
        })
      },
      changePeople() {
        if (this.caseTableList.length === 1) {
          this.caseSelectionCaseList = this.caseTableList
          this.caseTableList.forEach(item => {
            if (this.caseSelectionCaseList.length && this.caseSelectionCaseList.find(j => j.caseId === item.caseId)) {
              item.writerPeople = this.writerPeople
            }
          })
          this.caseKey = !this.caseKey
          this.$refs.refCase.clearSelection()
        }
      },
      // changeWritePeople(row, value) {
      //   this.$set(row, 'writerPeople', value)
      // },
      changeWritePeople(row, value) {
        // 创建一个新的对象，拷贝所有旧对象的属性，更改 `writerPeople`
        const newRow = {
          ...row,
          writerPeople: value
        };

        // 找到这个 row 在数组中的索引
        const index = this.caseTableList.findIndex(item => item === row);

        // 替换数组中的这个对象
        if (index !== -1) {
          this.caseTableList.splice(index, 1, newRow);
        }
      },
      caseDetailClick(caseId) {
        window.open('/#/workbench/case/seeCaseDetail/' + caseId)
      },
      selectAble(row, rowIndex) {
        if (row.writerPeople) {
          return false
        }
        return true
      },
      handleWriter() {
        if (!this.writerPeople) {
          this.$message.error('请选择撰写人！')
          return
        }
        if (this.caseTableList.length === 1) {
          this.caseSelectionCaseList = this.caseTableList
        }
        if (!this.caseSelectionCaseList.length && this.caseTableList.length !== 1) { // 只有一条案件，默认指派
          this.$message.error('请勾选指派案件！')
          return
        }
        this.caseTableList.forEach(item => {
          if (this.caseSelectionCaseList.length && this.caseSelectionCaseList.find(j => j.caseId === item.caseId)) {
            item.writerPeople = this.writerPeople
          }
        })

        this.caseKey = !this.caseKey

        this.$refs.refCase.clearSelection()
      },
      caseSelectionChange(list) {
        this.caseSelectionCaseList = list
      },
      queryArticleWriter() {
        queryArticleWriter({
          caseIds: this.taskNo1CaseIds.length ? this.taskNo1CaseIds : this.caseIds
        }).then(res => {
          this.writerList = res.data || []
        })
      },
      async doTask(result) {
        if (!this.$commonUtils.formValidate(this.$refs.submission)) return
        await this.saveWrite(true)
        switch (this.taskNo) {
          case 1:
            if (this.caseTableList.find(item => !item.writerPeople)) {
              this.$message.error('还有案件未指派撰写人！')
              return
            }
            doArticleTask({
              zxLevel: this.submitData.zxLevel,
              memo: this.submitData.memo,
              taskIdList: this.taskIdList,
              crtWriterList: this.caseTableList.map(item => ({
                caseId: item.caseId,
                 writer: (typeof item.writerPeople ==='string')?item.writerPeopleId:item.writerPeople,
              })).filter(item => item.writer),
              timeLimitList: this.caseTableList.map(item => ({
                caseId: item.caseId,
                abslimitDate: item.abslimitDate,
                gflimitDate: item.gflimitDate
              }))
            }).then(res => {
              this.$message.success('操作成功')
              this.closeDialog(true)
            })
            break
          case 2:
            doArticleTask({
              memo: this.submitData.memo,
              zxLevel: this.submitData.zxLevel,
              taskIdList: this.taskIdList
            }).then(res => {
              this.$message.success('操作成功')
              this.closeDialog(true)
            })
            break
          case 3:
            doArticleTask({
              memo: this.submitData.memo,
              zxLevel: this.submitData.zxLevel,
              taskIdList: this.taskIdList,
              result
            }).then(res => {
              this.$message.success('操作成功')
              this.closeDialog(true)
            })
            break
          case 4:
            doArticleTask({
              memo: this.submitData.memo,
              zxLevel: this.submitData.zxLevel,
              taskIdList: this.taskIdList,
              result
            }).then(res => {
              this.$message.success('操作成功')
              this.closeDialog(true)
            })
            break
          default:
            break
        }
      },
      submit() {
        createArticleApp({
          checkFlag: 1,
          memo: this.submitData.memo,
          zxLevel: this.submitData.zxLevel,
          caseIdList: this.caseTableList.map(item => item.caseId),
          refCaseIdList: this.refCaseList.map(item => item.caseId),
          timeLimitList: this.caseTableList.map(item => ({
            caseId: item.caseId,
            abslimitDate: item.abslimitDate,
            gflimitDate: item.gflimitDate
          }))
        }).then(res => {
          if (res.messageType == 200) {
            this.$confirm(res.message, "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }).then(() => {
              createArticleApp({
                memo: this.submitData.memo,
                zxLevel: this.submitData.zxLevel,
                caseIdList: this.caseTableList.map(item => item.caseId),
                refCaseIdList: this.refCaseList.map(item => item.caseId),
                timeLimitList: this.caseTableList.map(item => ({
                  caseId: item.caseId,
                  abslimitDate: item.abslimitDate,
                  gflimitDate: item.gflimitDate
                }))
              }).then(res => {
                this.$message.success(res.message)
                this.closeDialog(true)
              })
            })
          } else {
            this.$message.success(res.message)
            this.closeDialog(true)
          }
        })
      },
      selectionChange(list) {
        this.refSelectionCaseList = list
      },
      delRefCase() {
        if (!this.refSelectionCaseList.length) {
          this.$message.error("请勾选相关案件！")
          return
        }
        this.refCaseList = this.refCaseList.filter(
          data => !this.refSelectionCaseList.includes(data)
        );
      },
      closeDialog(flag) {
        this.$emit("closetrademarkWriting", flag === true)
      },
      getList(list = []) {
        list.forEach(item => {
          item.caseType = item.caseTypeStr
          item.appCnName = item.appName
        })
        this.refCaseList.push(...list)
        this.refCaseList = [...new Set(this.refCaseList)]
      },
      ChooseCaseClose() {
        this.changeCaseVisible = false
      },
      init() {
        queryZxLevel().then(res => {
          this.zxLevelList = res.data.map(item => ({
            id: +item.id,
            value: item.value
          }))
        })
        if (this.type === "create") {
          this.createInit()
        } else if (this.type === "edit") {
          this.editInit()
        }
      },
      async createInit() {
        // useFlag: 2 代表撰写流程
        const res = await queryCase({caseIds: this.caseIds, taskType: 1, useFlag: 2}).then(res => {
          this.caseTableList = res.data || []
        }).catch(err => err)
        if (res && !res.success && res.message === "NO草案不能用于新建撰写申请") {
          this.closeDialog()
          return
        }
        queryRefCaseIdList({caseIds: this.caseIds}).then(res => {
          // this.refCaseList = res.data.refCaseIdList || []
          if (res.data && res.data.refCaseIdList && res.data.refCaseIdList.length) {
            this.queryCaseFunc(res.data.refCaseIdList, 'refCaseList')
          }
        })
      },
      queryCaseFunc(caseIds, key) {
        queryCase({
          caseIds,
          taskType: 1,
          useFlag: 2,
          atId: key === 'caseTableList' ? this.atData.atId : undefined
        }).then(res => {
          this[key] = res.data || []
          if (key === 'caseTableList') {
            this[key].forEach(item => {
              item.writerPeople = this.submitData.crtWriterList.find(j => j.caseId === item.caseId) && this.submitData.crtWriterList.find(j => j.caseId === item.caseId).writerName
              item.writerPeopleId = this.submitData.crtWriterList.find(j => j.caseId === item.caseId) && this.submitData.crtWriterList.find(j => j.caseId === item.caseId).writer
            })
          }
        })
      },
      editInit() {
        if (this.atData.atId) {
          queryArticleDetail({
            atId: this.atData.atId,
            caseId: this.taskNo === 1 && !this.atData.isModifyFlag ? undefined : this.atData.caseId
          }).then(res => {
            this.submitData = res.data
            if (this.submitData.first === 1 && !this.submitData.compl) {
              // this.$set(this.submitData, 'compl', 2)
            }
            if (this.taskNo === 1) {
              this.taskNo1CaseIds = res.data.caseIdList
            }
            this.queryArticleWriter()
            if (res.data && res.data.caseIdList && res.data.caseIdList.length) {
              this.queryCaseFunc(res.data.caseIdList, 'caseTableList')
            }
            if (res.data && res.data.refCaseIdList && res.data.refCaseIdList.length) {
              this.queryCaseFunc(res.data.refCaseIdList, 'refCaseList')
            }
          })
        }
      },
    }
  }
</script>

<style lang="scss" scoped>
  .fade-enter-active {
    transition: opacity .5s
  }

  .fade-leave-active {
    transition: opacity .5s
  }

  .fade-enter, .fade-leave-active {
    opacity: 0
  }

  header {
    height: 62px;
    line-height: 62px;
    font-size: 22px;
    font-family: SourceHanSansCN-Normal;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    padding-left: 20px;
    //border-bottom:1px solid #D4D5D5 ;
  }

  .title {
    font-family: 'Arial Normal', 'Arial';
    color: #409EFF;
    font-weight: 400;
    height: 30px;
    line-height: 30px;
    /*padding-left: 50px;*/
  }

  .el-table.el-table1 {
    margin: 0 40px;
    width: auto;

    /deep/ tr:nth-of-type(1) {
      th {
        background: rgba(242, 242, 242, 1);
      }
    }
  }

  .el-form {
    display: flex;
    flex-wrap: wrap;
    padding: 10px 20px 20px 20px;
    margin: 0 20px;
    /*max-height: 600px;*/
    overflow: auto;

    .el-row {
      min-height: 30px;
      width: 100%;
      display: flex;
      align-items: center;

      .el-form-item {
        width: 100%;
        display: flex;
        height: 100%;
        border: 1px solid #EBEEF5;
        border-bottom: 0;
        margin-bottom: 0;

        .el-date-editor.el-input, .el-date-editor.el-input__inner {
          width: 200px;
        }

        /deep/ .el-form-item__label {
          background: #f5f7fa;
          width: 206px;
          flex-shrink: 0;
        }

        /deep/ .el-form-item__content {
          margin-left: 0 !important;
          padding-left: 10px;
          background: #fff;
          flex: 1;
          position: relative;
        }

        /deep/ .el-form-item__error {
          position: relative;
          top: 0;
        }

      }

      .small-el-form-item {
        width: 50%;

        /deep/ .el-form-item__content {
          flex: 1;

          .pad20 {
            padding-left: 20px;
          }
        }
      }
    }

    .el-row:nth-last-child(1) {
      .el-form-item {
        border: 1px solid #EBEEF5;
      }
    }
  }

  .button_wrap {
    width: 100%;
    display: flex;
    justify-content: center;

    .el-button {
      margin-left: 30px;
    }
  }

  .require /deep/ .el-form-item__label:before {
    content: "*";
    color: #f56c6c;
    margin-right: 4px;
  }

  .upload-demo {
    /deep/ .el-upload {
      width: 100%;
    }

    /deep/ .el-upload-dragger {
      height: 20px;
      width: 100%;
    }

    /deep/ .el-upload-list {
      display: flex;
      justify-content: space-around;
      align-items: center;
      flex-wrap: wrap;

      &:first-child {
        margin-top: 0;
      }
    }
  }

  .upload-demo1, .upload-demo {
    /deep/ .el-upload-list__item {
      transition: all 0s;
      transform: translateY(0);
    }

    /deep/ .el-upload-list__item:first-child {
      margin-top: 0;
    }

    /deep/ .el-list-enter, .el-list-leave-active {
      visibility: hidden;
      opacity: 1;
      transition: all 0s;
      transform: translateY(0);
    }

    /deep/ .el-list-enter-active, .el-list-leave-active {
      display: none;
      transition: all 0s;
    }
  }

  .el-table {
    /deep/ th {
      padding: 5px 0
    }

    /deep/ td {
      padding: 0;
    }
  }

  .table-top {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: flex-end;
  }

  > > > .el-table1 {
    height: auto;

    .cell {
      max-height: 70px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
    }
  }

  > > > .el-collapse-item__header {
    height: 35px;
  }

  > > > .el-collapse-item__content {
    padding-bottom: 0;
  }
</style>
