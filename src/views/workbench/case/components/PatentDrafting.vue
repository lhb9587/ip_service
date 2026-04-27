<template>
  <div>
    <div class="process-title">案件信息</div>
    <!-- <el-table :data="tableData" border>
        <el-table-column type="index" width="60" label="序号" align="left">
          <template slot-scope="scope">
            <span style="margin: 0;cursor: pointer" @click="takeCaseDetail(scope.row)">
              {{scope.$index+1}}
            </span>
          </template>
</el-table-column>
<el-table-column align="left" v-for="(item,index) in tableTitleList" :label="item.title" :prop="item.value"
  :width="item.width" :key="index">
  <template slot-scope="scope">
            <span :class="item.value=='agentNum'?'itemTitle_style':''"
                  v-if="item.value!=='imageFile'&&item.value!='custName'" :title='scope.row[item.value]'
                  style="margin: 0;cursor: pointer"
                  @click="takeCaseDetail(scope.row)">
              {{scope.row[item.value]}}
            </span>
            <CustCard v-if="item.value=='custName'" :custName="scope.row.custName" :customerID="scope.row.custId"/>
            <img class="filterTableTmg" v-if="item.value==='imageFile'" :src="'ipdoc'+scope.row['imageFile']" alt="">
          </template>
</el-table-column>
</el-table> -->
    <el-form ref="submission" label-width="206px">
      <!-- <el-row style="border-right: 1px solid #EBEEF5;border-top: 1px solid #EBEEF5">
                <el-form-item label="五书Word文件:">
                  <el-upload
                    ref="upload"
                    class="upload-demo"
                    drag
                    :multiple="false"
                    name="attachFile"
                    :data="getUploadData()"
                    :action="creatematerial"
                    :file-list="materialArray"
                    :on-remove="handleRemove"
                    :on-preview="onPreview"
                    :on-success="onsuccess"
                    :before-upload="beforeUpload"
                  >
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                  </el-upload>
                </el-form-item>
            </el-row> -->
      <el-row style="">
        <el-form-item label="案件文号:">
          <span class="itemTitle_style" style="margin: 0;cursor: pointer" @click="takeCaseDetail(tableData[0])">
            {{ patentWritingDetail.agentNum }}
          </span>

        </el-form-item>
        <el-form-item label="案件名称:">
          {{ patentWritingDetail.caseCnName }}
        </el-form-item>
      </el-row>
      <el-row style="">
        <el-form-item label="专利类型:">
          {{ patentWritingDetail.patentTypeStr }}
        </el-form-item>
        <el-form-item label="案件类型:">
          {{ patentWritingDetail.caseTypeStr }}
        </el-form-item>
      </el-row>
      <el-row style="">
        <el-form-item label="申请方向:">
          {{ patentWritingDetail.appFromto }}
        </el-form-item>
        <el-form-item label="客户:">
          <CustCard :custName="tableData[0].custName" :customerID="tableData[0].custId" />
        </el-form-item>
      </el-row>
      <el-row style="">
        <el-form-item label="申请人名称:">
          {{ patentWritingDetail.appCnName }}
        </el-form-item>
        <el-form-item label="时限类型:">
          {{ patentWritingDetail.tltTypeName }}
        </el-form-item>
      </el-row>
      <el-row style="border-bottom: 1px solid #EBEEF5">
        <el-form-item v-if="patentWritingDetail.independentWriter" label="加审人:">
          <el-select default-first-option :clearable='false' placeholder="请选择"
            v-model="patentWritingDetail.rehearingUserId" filterable
            :disabled="dialogType === 'view' || patentWritingDetail.taskNo > 2">
            <el-option v-for="item in addAuditUserList" :key="item.userId" :label="item.fullname" :value="item.userId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="绝限日期:">
          {{ patentWritingDetail.abslimitDate }}
        </el-form-item>
      </el-row>
    </el-form>
    <div class="process-table">
      <div class="process-title">任务流程</div>
      <el-table :data="patentWritingDetail.patentWritingProcessList" border style="width:100%" :height="300">
        <el-table-column label="流程类型" prop="taskName" width="120"></el-table-column>
        <el-table-column label="处理人" prop="fullname" width="100"></el-table-column>
        <el-table-column label="退回原因" prop="ukeyName">
          <template slot-scope="scope">{{ scope.row.ukeyName || '-' }}</template>
        </el-table-column>
        <el-table-column label="处理状态" prop="processingResult" width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.processingResult === '进行中'" type="warning" size="mini">进行中</el-tag>
            <el-tag v-else-if="scope.row.processingResult === '通过'" type="success" size="mini">通过</el-tag>
            <el-tag v-else-if="scope.row.processingResult === '未通过'" type="danger" size="mini">未通过</el-tag>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="日期" prop="createTime" width="150">
          <template slot-scope="scope">{{ scope.row.createTime ? formatTime(scope.row.createTime) : '-' }}</template>
        </el-table-column>
        <el-table-column label="五书版本" prop="materialName">
          <template slot-scope="scope">
            <span v-if="scope.row.materialName">
              {{ scope.row.materialName }}
              <i class="el-icon-download" style="cursor:pointer;color:#409EFF;margin-left:4px"
                @click="downLoad(scope.row)"></i>
            </span>
            <span v-if="!scope.row.materialName && scope.row.processingResult !== '进行中'">-</span>
            <el-upload v-if="scope.row.processingResult === '进行中' && dialogType !== 'view'" :show-file-list="false"
              name="attachFile" :data="getUploadData()" :action="creatematerial" :before-upload="beforeUpload"
              :on-success="(res) => onRowUploadSuccess(res, scope.row)">
              <div style="font-size:14px;cursor:pointer;color:#409EFF;margin-top:2px">
                {{ scope.row.materialName ? '重新上传' : '上传' }}
                <i class="el-icon-upload2"></i>
              </div>
            </el-upload>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="dialog-footer">
      <el-button @click="$emit('changeFalse')">取消</el-button>
      <el-button v-if="dialogType == 'submit' || dialogType == 'create'" type="primary" @click="submit">提交</el-button>
      <el-button v-if="dialogType == 'audit'" type="primary" @click="audit(1)">通过</el-button>
      <el-button v-if="dialogType == 'audit'" type="danger" @click="openBackDialog">退回</el-button>
    </div>
    <el-dialog title="退回原因" :visible.sync="backReasonView" width="400px" append-to-body>
      <el-select style="width:100%" default-first-option clearable placeholder="请选择退回原因" v-model="backOpinions"
        filterable multiple>
        <el-option-group v-for="group in reasonList" :key="group.id" :label="group.typeName">
          <el-option v-for="item in group.children" :key="item.id" :label="item.typeName"
            :value="item.typeName"></el-option>
        </el-option-group>
      </el-select>
      <div slot="footer">
        <el-button @click="backReasonView = false">取消</el-button>
        <el-button type="primary" @click="doAudit(0)">确认退回</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  delCaseMaterial,
  queryUserByRoleId
} from "@/api/caseList";
import {
  queryPatentCaseInfo,
} from "@/api/caseDetail";
import {
  createPatentWriting,
  patentWritingappSubmit,
  queryPatentWritingDetail,
  patentWritingappExamine,
  queryPatentWritingReturnReasonList
} from "@/api/patentWriting";

import { creatematerial } from '@/api/ipServiceApi.config.js'
export default {
  props: {
    caseId: {},
    taskType: {},
    dialogType: {
      type: String,
      default: 'create'
    },
    dialogId: {},
  },
  computed: {

  },
  data() {
    return {
      reasonList: [],
      isActualAttorney: false,
      tableTitleList: [
        { "title": "案件文号", "value": "agentNum" },
        { "title": "案件名称", "value": "caseCnName" },
        { "title": "专利类型", "value": 'typeNameStr' },
        { "title": "案件类型", "value": "caseType", },
        { "title": "申请方向", "value": "appFromto", },
        // {"title": "审级", "value": "judgeRankName"},

        { "title": "客户", "value": "custName" },
        { "title": "申请人名称", "value": "applicantName" },
        { "title": "时限类型", "value": "tltTypeName" },
        { "title": "绝限日期", "value": "abslimitDate" },
      ],
      tableData: [{}],
      creatematerial,
      materialArray: [],
      addAuditUserList: [],
      patentWritingId: null,
      patentWritingDetail: {
        rehearingUserId: '',
        opinions: []
      },
      backData: {},
      backReasonView: false,
      backOpinions: []
    }
  },
  created() {
    this.caseId && this.queryCaseInfo()
    this.querySelect()
  },
  methods: {
    downLoad(data) {
      this.$message.success('正在下载')
      const url = data.address || data.url
      const downData = {
        url: `ipdoc${url}`,
        success() {
          // this.$message.success('下载成功！')
        }
      }
      if (data.mailId) {
        downData.downLoad = data.materialName
      }
      this.$commonUtils.downLoadAll(downData)
    },
    querySelect() {
      queryUserByRoleId({ roleId: '300034' }).then(res => {
        this.addAuditUserList = res.data
        this.addAuditUserList.unshift({ userId: undefined, fullname: '无需加审' })
      })
      queryPatentWritingReturnReasonList().then(res => {
        this.reasonList = res.data
      })
      // querycustSelectClass({classId: '1202'}).then(res => {
      //   this.reasonList = res.data['1202']
      // })
    },
    formatTime(ts) {
      const d = new Date(ts)
      const pad = n => String(n).padStart(2, '0')
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
    },
    openBackDialog() {
      this.backOpinions = []
      this.backReasonView = true
    },
    doAudit(result) {
      this.backReasonView = false
      this.audit(result)
    },
    audit(result) {
      this.$commonUtils.handleObjNullAttr(this.patentWritingDetail, this.backData)
      patentWritingappExamine({
        id: this.patentWritingId,
        caseId: this.caseId[0],
        rehearingUserId: this.patentWritingDetail.rehearingUserId,
        opinions: result === 0 ? this.backOpinions : this.patentWritingDetail.opinions,
        audit: result,
        materialId: this.materialId,
        nullValueList: this.patentWritingDetail.nullValueList
      }).then(res => {
        this.$message.success('操作成功')
        this.$emit('changeFalse', true)
      })
    },
    takeCaseDetail(row) {
      this.$router.push("/workbench/case/seeCaseDetail/" + row.caseId + '?taskType=' + this.taskType);
    },
    queryDetail() {
      queryPatentWritingDetail({ id: this.patentWritingId }).then(res => {
        this.patentWritingDetail = res.data
        this.patentWritingDetail.rehearingUserId = this.patentWritingDetail.rehearingUserId || undefined
        this.backData = JSON.parse(JSON.stringify(this.patentWritingDetail))
        this.tableData[0].tltTypeName = res.data.tltTypeName
        this.tableData[0].abslimitDate = res.data.abslimitDate
      })
    },
    initPatentWriting() {
      createPatentWriting({
        caseId: this.caseId[0]
      }).then(res => {
        this.patentWritingId = res.data.id
        this.queryDetail()
      })
    },
    queryCaseInfo() {
      queryPatentCaseInfo({ caseIds: this.caseId }).then(res => {
        this.tableData = [res.data]
        this.isActualAttorney = res.data.independentWriter
        if (this.dialogType === 'create') {
          this.initPatentWriting()
        } else {
          this.patentWritingId = this.dialogId
          this.queryDetail()
        }
      })
    },
    submit() {
      patentWritingappSubmit({
        id: this.patentWritingId,
        rehearingUserId: this.patentWritingDetail.rehearingUserId || undefined,
        materialId: this.materialId || undefined
      }).then(res => {
        this.$message.success('提交成功')
        this.$emit('changeFalse', true)
      })
    },
    onRowUploadSuccess(res, row) {
      if (res.data && res.data[0]) {
        this.$set(row, 'materialName', res.data[0].materialName)
        this.materialId = res.data[0].materialId
      }
    },
    beforeUpload() {
      return true
    },
    onPreview() {
      // this.$commonUtils.preView()
    },
    onsuccess(res, file, fileList) {
      this.$nextTick(() => {
        this.materialArray = []
        res.data.forEach(item => {
          item.name = item.materialName
          this.materialArray.push(item)
        })
      })
    },
    handleRemove(file, fileList, caseId) {
      let delmaterialId;
      if (file.response) {
        delmaterialId = file.response.data[0].materialId;
      } else {
        delmaterialId = file.materialId
      }
      delCaseMaterial({
        materialId: delmaterialId,
        caseIdArray: this.caseData.map(item => item.caseId),
        objType: this.$commonUtils.getObjTypeByTaskType(+this.taskType)
      }).then(res => {
        this.materialArray.splice(this.materialArray.map(item => item.materialId).indexOf(delmaterialId), 1)
      })
    },
    getUploadData(caseIds) {
      const data = {
        tokenID: this.$store.getters.token,
        materialTypeId: 301704
        // caseIds: this.multipleSelection.map(item => item.caseId).join(','),
      }
      return data
    },
  }
}
</script>
<style lang="scss" scoped>
.el-form {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;

  // margin-top: 20px;
  .el-select,
  .el-input,
  .el-date-picker,
  .el-textarea {
    width: 95%;
  }

  .el-textarea {
    margin: 10px 0;
  }

  /deep/ input {
    height: 28px;
  }

  /deep/ .el-input__icon {
    line-height: 28px;
  }

  .el-row {
    min-height: 30px;
    width: 100%;
    display: flex;
    align-items: center;

    .el-form-item {
      width: 100%;
      height: 100%;
      display: flex;
      border: 1px solid #ebeef5;
      border-bottom: 0;
      margin-bottom: 0;

      /deep/ .el-form-item__label {
        background: #f5f7fa;
      }

      /deep/ .el-form-item__content {
        margin-left: 0 !important;
        padding-left: 10px;
        background: #fff;
        flex: 1;
      }
    }

    .small-el-form-item-prev:before {
      content: "";
      width: 50%;
      height: 1px;
      background: #ebeef5;
      position: absolute;
      bottom: -1px;
      right: 0;
      z-index: 1;
    }

    .small-el-form-item {
      position: relative;
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
      border: 1px solid #ebeef5;
    }
  }
}

.dialog-footer {
  width: 100%;
  display: flex;
  height: 85px;
  align-items: center;
  justify-content: flex-end;

  .el-button {
    margin-right: 30px;
  }
}

>>>.virtual-select {
  .jh-virtual-select {
    height: auto;
  }
}

.el-table {
  overflow: visible;

  /deep/ th {
    color: rgba(51, 51, 51, 1);
    background: rgba(187, 187, 187, 0.5);
  }
}

.el-table /deep/ th .cell {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  position: relative;
  padding-left: 10px;

  img {
    margin-left: 5px;
    width: 12px;
    cursor: pointer;
  }

  .checkboxs {
    position: absolute;
    background: #fff;
    min-width: 100%;
    top: 47px;
    left: 0px;
    display: flex;
    z-index: 1;
    border: 1px solid #f4f4f5;
    overflow: visible;
    padding-left: 6px;
    padding-bottom: 80px;

    .filter_content {
      width: 100%;
      max-height: 200px;
      height: 200px;
      overflow: auto;
    }

    .el-checkbox-group {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      overflow: visible;
    }

    .checkAll {
      position: absolute;
      bottom: -27px;
      width: 100%;
      left: 0;
      background: #fff;
      height: 27px;
      color: #409eff;
      text-indent: 5px;
      line-height: 27px;
      cursor: pointer;
      border: 1px solid #f4f4f5;
    }
  }
}

.el-table /deep/ th div {
  overflow: visible;
  text-overflow: inherit;
  padding: 0;
}

.el-table /deep/ .el-table__header-wrapper {
  overflow: hidden;

  th {
    overflow: visible;

    .cell {
      overflow: visible;
    }
  }
}

.process-title {
  font-weight: bold;
  margin-top: 10px;
  margin-bottom: 5px;
}
</style>