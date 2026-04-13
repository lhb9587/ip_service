<template>
  <div>
    <div class="title" style="padding-left: 50px ">
      案件信息
    </div>
    <el-table :data="caseTableList" border class="el-table1" max-height="300">
      <el-table-column type="index" width="60" label="序号" align="left">

      </el-table-column>
      <el-table-column align="left" :key="item.title" v-for="(item, index) in tableTitleList" :label="item.title"
                       :prop="item.value" :width="item.width">
        <template slot-scope="scope">
          <!-- <div v-if="item.value === 'writerPeople'">
            <el-select v-model="scope.row.writerPeople"
                       placeholder="请选择撰写人"
                       filterable
                       disabled
                       v-if="scope.row.writerPeople"
            >
              <el-option
                v-for="item in $store.getters.allUserList"
                :key="item.userId"
                :label="item.fullname"
                :value="item.userId">
              </el-option>
            </el-select>
          </div> -->
          <p style="margin: 0;cursor: pointer" :title="scope.row[item.value] || ''"
             @click="caseDetailClick(scope.row.caseId)">
            {{scope.row[item.value]}}</p>
        </template>
      </el-table-column>
      <el-table-column
        prop="writerPeople"
        label="撰写人">
      </el-table-column>
    </el-table>

    <div>
      <el-form ref="submission" :model="submitData" label-width="120px">
        <div class="table-top">
          <div class="title">
            参考案件
          </div>
        </div>
        <el-row>
          <div style="display: flex;width: 100%;">
            <el-table :data="refCaseList" border class="el-table1" max-height="300"
                      style="margin: 0px 0px 10px 0;flex:1">
              <el-table-column type="index" width="40" label="序号" align="left">

              </el-table-column>
              <el-table-column align="left" :key="item.title" v-for="(item, index) in tableTitleList"
                               :label="item.title"
                               :prop="item.value">
                <template slot-scope="scope">
                  <p style="margin: 0;cursor: pointer" :title="scope.row[item.value] || ''"
                     @click="caseDetailClick(scope.row.caseId)">
                    {{scope.row[item.value]}}</p>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-row>
        <el-row>
          <el-form-item label="案件撰写级别">
            {{zxLevelList.find(item => item.id == submitData.zxLevel) && zxLevelList.find(item => item.id ==
            submitData.zxLevel).value}}
          </el-form-item>
          <el-form-item label="首次递交理由是否完整">
            <span v-if="submitData.compl === 1">是</span>
            <span v-if="submitData.compl === 2">否</span>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="申请人:">{{$store.getters.allUserList.find(item => item.userId == submitData.userId) &&
            $store.getters.allUserList.find(item => item.userId == submitData.userId).fullname}}
          </el-form-item>
          <el-form-item label="创建日期:">{{submitData.createDate}}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="备注:" style="border: 1px solid #EBEEF5;">{{submitData.memo}}</el-form-item>
        </el-row>
        <div class="fl-ac-jc" style="width: 100%;margin-top: 15px;">
          <el-button size="small" @click="closeDialog">取 消</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
  import {
    queryArticleDetail, queryArticleWriter,
    queryCase,
    queryZxLevel
  } from "../../../../../api/caseList";

  export default {
    name: "TrademarkWritingDetailView",
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
        taskNo1CaseIds: [],
        writerList: [],
        zxLevelList: [],
        refSelectionCaseList: [],
        changeCaseVisible: false,
        submitData: {},
        refCaseList: [],
        caseTableList: [],
        tableTitleList: [
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
        ],
      }
    },
    created() {
      this.init()
    },
    methods: {
      caseDetailClick(caseId) {
        window.open('/#/workbench/case/seeCaseDetail/' + caseId)
      },
      closeDialog() {
        this.$emit("closetrademarkWriting")
      },
      getList(list = []) {
        list.forEach(item => {
          item.caseType = item.caseTypeStr
          item.appCnName = item.appName
        })
        this.refCaseList.push(...list)
        this.refCaseList = [...new Set(this.refCaseList)]
      },
      init() {
        queryZxLevel().then(res => {
          this.zxLevelList = res.data
        })
        this.viewInit()
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
              const writerName = this.submitData.crtWriterList.find(j => j.caseId === item.caseId) && this.submitData.crtWriterList.find(j => j.caseId === item.caseId).writerName
              console.log(writerName,'writerName');
              item.writerPeople = this.submitData.crtWriterList.find(j => j.caseId === item.caseId) && this.submitData.crtWriterList.find(j => j.caseId === item.caseId).writerName
            })
          }
        })
      },
      queryArticleWriter() {
        queryArticleWriter({
          caseIds: this.taskNo1CaseIds.length ? this.taskNo1CaseIds : this.caseIds
        }).then(res => {
          this.writerList = res.data || []
        })
      },
      viewInit() {
        if (this.atData.atId) {
          queryArticleDetail({
            atId: this.atData.atId,
            caseId: this.taskNo === 1 ? undefined : this.atData.caseId
          }).then(res => {
            this.submitData = res.data
            this.taskNo1CaseIds = res.data.caseIdList
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
    height: 50px;
    line-height: 60px;
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
    padding: 20px;
    margin: 0 20px;
    max-height: 600px;
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
</style>
