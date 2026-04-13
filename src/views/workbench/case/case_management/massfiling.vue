<template>
  <div style="padding: 0 20px">
    <header>
      批量立卷 <span class="">{{ caseFormData[0].caseType }}</span>
      <aside>
        <div
          class="checkTask"
          @click="dialogExplainVisible = true"
          v-if="$route.query.deliverId"
        >
          <img src="@/assets/u11888.png" alt="" /><span>查看任务说明</span>
        </div>

        <template v-if="caseFormData.find(item => item.ctAudit === 1)">
          <el-button @click="chongtuTestFunc(true)" type="primary">检查冲突</el-button>
          <el-button @click="alertChongtuAuditFunc(1)" type="primary">通过</el-button>
          <el-button style="margin-right: 20px" @click="alertChongtuAuditFunc(2)" type="primary">退回</el-button>
        </template>
        <template v-else>
          <el-button
            type="primary"
            :disabled="filingFlag"
            @click="multipleOperation"
            >批量编辑</el-button
          >
          <el-dropdown
            trigger="click"
            placement="bottom-start"
            @command="batchOperation"
          >
            <el-button type="primary">
              批量操作<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="edit">共同信息</el-dropdown-item>
              <template v-if="$route.query.taskType != 4">
                <el-dropdown-item
                  command="fileImport"
                  v-if="canOperationList.includes(caseFormData[0].caseType)"
                  >文件导入
                </el-dropdown-item>
                <!--                <el-dropdown-item command="trademarkImport" v-if="tmlist.includes(caseFormData[0].caseType)">商标导入(选择)</el-dropdown-item>-->
                <!--                <el-dropdown-item command="trademarkImport2" v-if="tmlist2.includes(caseFormData[0].caseType)&&!$route.query.isChangeCase">商标导入(文号)</el-dropdown-item>-->
                <el-dropdown-item
                  command="trademarkImport"
                  v-if="!canOperationList.includes(caseFormData[0].caseType)"
                >
                  申请人导入
                </el-dropdown-item>
                <el-dropdown-item
                  command="trademarkImport2"
                  v-if="!canOperationList.includes(caseFormData[0].caseType)"
                  >商标号导入
                </el-dropdown-item>
              </template>
              <el-dropdown-item
                command="filing"
                v-if="
                  caseFormData.find(item => item.ctAudit === 4 || !item.ctAudit)
                "
              >
                立卷
              </el-dropdown-item>
              <el-dropdown-item
                command="filing"
                v-if="caseFormData.find(item => item.ctAudit === 2)"
                >提交
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <!--<el-button type="primary" :style="{'visibility':caseFormData[0].visibility?'hidden':'visible'}" @click="onlyOperation" >单独编辑</el-button>-->
          <el-button
            type="primary"
            :disabled="filingFlag"
            @click="handlerAddCase"
            >增加</el-button
          >
        </template>
      </aside>
    </header>
    <div class="divider">
      <span>共计: {{ caseFormData.length }}</span>
    </div>
    <!-- <el-table
      :data="caseFormData"
      border
      @selection-change="handleSelectionChange"
      ref="massfilingMultiple"
    >
      <el-table-column
        align="left"
        type="selection"
        width="30"
        :selectable="selectable"
        class="selection"
        v-if="caseFormData[0].visibility"
      >
      </el-table-column>
      <el-table-column type="index" width="50" label="序号" align="left">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-for="item in titleList"
        :label="item.title"
        :prop="item.type"
        align="left"
      >
        <template slot-scope="scope">
          <span v-if="item.type !== 'imageFile'">{{
            item.type.toLocaleUpperCase().endsWith("DATE")
              ? formatDate(scope.row[item.type])
              : scope.row[item.type]
          }}</span>
          <img
            v-if="item.type === 'imageFile'"
            class="imgImageFile"
            :src="'ipdoc' + scope.row.imageFile"
            alt=""
          />
        </template>
      </el-table-column>

      <el-table-column label="操作" align="left">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="goToCaseDetail(scope.row)"
            :style="{
              visibility:
                caseFormData[0].visibility &&
                canOperationList.includes(caseFormData[0].caseType)
                  ? 'hidden'
                  : 'visible'
            }"
          >
            编辑
          </el-button>
          <el-button type="text" size="small" @click="deleteWaitCase(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table> -->
    <AgGridVue
      :style="{ width: '100%', height: clientHeight + 'px' }"
      class="ag-theme-balham"
      :columnDefs="formatColumnDefs(this.titleList)"
      :rowData="caseFormData"
      :localeText="$store.state.caseInformation.localeText"
      @grid-ready="onGridReady"
      @row-selected="onRowSelected"
      rowSelection="multiple"
      :suppressRowClickSelection="true"
    ></AgGridVue>
    <footer>
      <div
        class="button_wrap"
        v-if="caseFormData[0].visibility && !filingFlag"
        v-show="currentTypeText !== '批量编辑'"
      >
        <el-button class="exactButton" type="primary" @click="caseManyEdit"
          >确定</el-button
        >
        <el-button
          class="exactButton"
          @click="cancelEdit(1)"
          style="margin-right: 20px"
          >取消</el-button
        >
      </div>
      <div
        class="button_wrap"
        v-if="caseFormData[0].visibility && !filingFlag"
        v-show="currentTypeText === '批量编辑'"
      >
        <el-button
          class="exactButton"
          type="primary"
          @click="showTable = true"
          >{{ currentTypeText }}</el-button
        >
        <el-button
          class="exactButton"
          @click="cancelEdit(1)"
          style="margin-right: 20px"
          >取消</el-button
        >
      </div>
      <div class="button_wrap" v-if="filingFlag">
        <el-button
          class="exactButton"
          type="primary"
          @click="jumpTodoTask(1)"
          v-if="
            curCustLevel &&
              caseFormData.find(item => item.ctAudit === 4 || !item.ctAudit)
          "
          :disabled="filingOperationState"
          >立卷
        </el-button>
        <el-dropdown
          trigger="click"
          placement="top"
          @command="filingOperation"
          v-if="
            !curCustLevel &&
              caseFormData.find(item => item.ctAudit === 4 || !item.ctAudit)
          "
        >
          <el-button type="primary" :disabled="filingOperationState">
            立卷<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="prefiling">预立卷审批</el-dropdown-item>
            <el-dropdown-item command="createBills">创建账单</el-dropdown-item>
            <el-dropdown-item command="lowCreditAudit"
              >低信用审核</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
        <el-button
          @click="dialogcheckChongTuBtn"
          type="primary"
          v-if="caseFormData.find(item => item.ctAudit === 2)"
        >
          提交
        </el-button>
        <el-button
          class="exactButton"
          style="margin-right: 20px"
          @click="cancelEdit(2)"
          >取消</el-button
        >
      </div>
    </footer>
    <el-dialog title="文件导入" :visible.sync="dialogTableVisible">
      <div class="el-radio-wrap">
        <el-radio v-model="uploadOrDownload" label="1">下载模板</el-radio>
        <el-radio v-model="uploadOrDownload" label="2">
          <el-upload
            class="upload-demo"
            ref="uploadExcel"
            :action="importTradeMarkCaseData"
            :file-list="fileList"
            :data="postFileData"
            :auto-upload="false"
            :limit="1"
            :on-change="postFileChange"
            :before-remove="postFileRemove"
            :on-success="handleSuccess"
            :before-upload="beforeUpload"
          >
            <span slot="trigger">导入Excel文件</span>
            <el-button
              slot="trigger"
              size="small"
              type="primary"
              v-show="uploadButtonState"
              >上传</el-button
            >
          </el-upload>
        </el-radio>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="changeLoadType">确 定</el-button>
        <el-button @click="dialogTableVisible = false">取 消</el-button>
      </span>
      <a id="exceldown" href="/download/商标注册批量立案（模板）.xlsx"
        >123456</a
      >
    </el-dialog>
    <el-dialog title="提示" :visible.sync="dialogInputVisible" width="35%">
      <div class="inputContent">
        <span>请输入您想要新增的案件个数</span>
        <el-input v-model="addCaseNumber"></el-input>
        <span>个</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogInputVisible = false">取 消</el-button>
        <el-button type="primary" @click="addWaitCases">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      class="dialogExplain"
      :title="'任务说明—' + caseFormData[0].caseType"
      :visible.sync="dialogExplainVisible"
      width="50%"
    >
      <el-form>
        <el-form-item label="活动名称" label-width="70px">
          <div class="explainContent">
            立卷所需信息已全部上传，请仔细阅读后填写
          </div>
        </el-form-item>
        <el-form-item label="文档" label-width="70px">
          <div class="explainContent" v-for="item in dialogExplainList">
            <a :href="'/ipdoc' + item.docPath">{{ item.materialName }}</a>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogExplainVisible = false">取 消</el-button>
        <el-button type="primary" @click="downLoadAll">一键下载</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="caseFormData[0].caseType + '—选择商标'"
      :visible.sync="trademarkImportTableVisible"
      width="80%"
      class="el-dialog-tmTable"
    >
      <section>
        <div class="flexBox">
          <el-form size="mini" class="form-container">
            <el-form-item
              label-width="200px"
              label="客户"
              class="postInfo-container-item"
            >
              {{ caseFormData[0].custName }}
            </el-form-item>
            <el-form-item
              label-width="200px"
              label="请选择变更类型"
              class="postInfo-container-item"
              v-if="caseFormData[0].caseType === '变名变址'"
            >
              <el-select
                default-first-option
                v-model="queryModuleData.caseTypeName"
                filterable
                clearable
                placeholder="请选择变更类型"
              >
                <el-option
                  v-for="itm in ['变名', '变址', '变名变址']"
                  :key="itm"
                  :label="itm"
                  :value="itm"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label-width="200px"
              label="请选择申请人"
              class="postInfo-container-item"
              v-if="caseFormData[0].caseType !== '转让/移转'"
            >
              <el-select
                default-first-option
                v-model="queryModuleData.appId"
                filterable
                clearable
                placeholder="请选择申请人"
                @change="queryAppAddrByTm"
              >
                <el-option
                  v-for="itm in appCustList"
                  :key="itm.appId"
                  :label="itm.applicantName"
                  :value="itm.appId"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label-width="200px"
              label="请选择转让人"
              class="postInfo-container-item"
              v-if="caseFormData[0].caseType == '转让/移转'"
            >
              <el-select
                default-first-option
                v-model="queryModuleData.appId"
                filterable
                clearable
                placeholder="请选择申请人"
                @change="queryAppAddrByTm"
              >
                <el-option
                  v-for="itm in appCustList"
                  :key="itm.appId"
                  :label="itm.applicantName"
                  :value="itm.appId"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="
                queryModuleData.caseTypeName === '变址' ||
                  queryModuleData.caseTypeName === '变名变址'
              "
              label-width="200px"
              label="请选择原申请人中文地址"
              class="postInfo-container-item"
            >
              <el-select
                default-first-option
                multiple
                v-model="queryModuleData.address"
                filterable
                clearable
                placeholder="请选择原中文地址"
              >
                <el-option
                  v-for="itm in appAddrArray"
                  :key="itm.addressCn"
                  :label="itm.addressCn"
                  :value="itm.addressCn"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="
                queryModuleData.caseTypeName === '变址' ||
                  queryModuleData.caseTypeName === '变名变址'
              "
              label-width="200px"
              label="请选择原申请人英文地址"
              class="postInfo-container-item"
            >
              <el-select
                default-first-option
                multiple
                v-model="queryModuleData.addressEnList"
                filterable
                clearable
                placeholder="请选择原英文地址"
              >
                <el-option
                  v-for="itm in appAddrArrayEn"
                  :key="itm.addressEn"
                  :label="itm.addressEn"
                  :value="itm.addressEn"
                >
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item
              label-width="200px"
              label="有效截止日"
              class="postInfo-container-item"
              v-if="caseFormData[0].caseType === '续展'"
            >
              <el-date-picker
                v-model="queryModuleData['regStartDate']"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="开始日期"
              >
              </el-date-picker>
              至
              <el-date-picker
                v-model="queryModuleData['regEndDate']"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="结束日期"
              >
              </el-date-picker>
            </el-form-item>
          </el-form>
          <div class="button_warp">
            <el-button
              size="small"
              type="primary"
              :disabled="!queryModuleData.appId"
              @click="queryCanProcessTm"
              >查询
            </el-button>
            <el-button
              size="small"
              type="primary"
              :disabled="!queryModuleData.appId"
              @click="clickUpload = true"
              >导入商标号
            </el-button>
            <a
              id="exceldown2"
              style="color:#409EFF;text-decoration:underline;margin-left: 10px"
              href="/download/导商标号模板.xlsx"
              >模板下载</a
            >
            <upload-xlsx
              @changeClick="clickUpload = false"
              @getFirstSheet="getFirstSheet"
              :clickUpload="clickUpload"
            ></upload-xlsx>
          </div>
        </div>
        <TrademarkTable
          :regNumberList="regNumberList"
          @queryCanProcessTmChange="queryCanProcessTmChange"
          :queryCanProcessTmState="queryCanProcessTmState"
          :queryModuleData="queryModuleData"
          :multipleState="true"
          @getTrademark="getTrademark"
        ></TrademarkTable>
      </section>
      <span slot="footer" class="dialog-footer">
        <el-button @click="trademarkImportTableVisible = false"
          >取 消</el-button
        >
        <el-button
          type="primary"
          :disabled="!multipleSelection.length"
          @click="jumpCaseDetail"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      :title="caseFormData[0].caseType + '—选择商标'"
      :visible.sync="regNumberListState"
      width="80%"
      class="el-dialog-tmTable"
    >
      <div
        class="button_warp"
        style="display: flex;justify-content: flex-end;align-items: center;margin:10px"
      >
        <el-radio v-model="multiclass" :label="0">一标一类</el-radio>
        <el-radio v-model="multiclass" :label="1">一标多类</el-radio>
        <el-button size="small" type="primary" @click="clickUpload = true"
          >导入商标号</el-button
        >
        <a
          id="exceldown3"
          style="color:#409EFF;text-decoration:underline;margin-left: 10px"
          href="/download/导商标号模板.xlsx"
          >模板下载</a
        >
        <upload-xlsx
          @changeClick="clickUpload = false"
          @getFirstSheet="getFirstSheet"
          :clickUpload="clickUpload"
        ></upload-xlsx>
      </div>
      <el-form size="mini" class="form-container">
        <el-form-item
          label-width="100px"
          label="商标号"
          class="postInfo-container-item"
        >
          <el-input
            type="textarea"
            :autosize="{ minRows: 5, maxRows: 10 }"
            placeholder="请输入内容"
            v-model="regNumberListStr"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="regNumberListState = false">取 消</el-button>
        <el-button type="primary" @click="saveRegNumberList">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="请选择" :visible.sync="selectTypeState" width="30%">
      <p>选项中有一个商标号多个类别的情况，是一标一类一案还是一标多类一案?</p>
      <el-radio v-model="multiclass" :label="0">一标一类</el-radio>
      <el-radio v-model="multiclass" :label="1">一标多类</el-radio>
      <span slot="footer" class="dialog-footer">
        <el-button @click="selectTypeState = false">取 消</el-button>
        <el-button type="primary" @click="confirmSelect">确 定</el-button>
      </span>
    </el-dialog>
    <Willtable
      :plType="'案件管理' + ($route.query.taskType == 4 ? 4 : 1)"
      v-if="showTable"
      :changeType="caseFormData[0].changeType"
      :caseTypeId="caseFormData[0].caseTypeId"
      :caseIds="curCaseIds"
      :showTable="showTable"
      @closeTable="closeTable"
    ></Willtable>
    <el-dialog
      top="0"
      :lock-scroll="false"
      :visible.sync="poppingTimeLimitState"
      width="60%"
      :modal="false"
      :close-on-click-modal="false"
      :show-close="false"
      :close-on-press-escape="false"
      title="创建时限"
      class="dialog——body——padding"
      v-dialogDrag
      center
    >
      <PoppingTimeLimit
        :isPatent="$route.query.taskType == 4"
        v-if="poppingTimeLimitState"
        disabled
        @cancel="closePoppingTimeLimit"
        :list="caseData"
      ></PoppingTimeLimit>
    </el-dialog>

    <el-dialog
      title="请注意:"
      :visible.sync="dialogcheckChongTuVisible"
      class="chongtuTitle"
      append-to-body
      width="50%"
      top="0"
      center
      :modal="false"
      :close-on-click-modal="false"
      v-dialogDrag
    >
      <el-row style="margin: 10px 5px">
        <el-col :span="24">
          <span style="font-size:17px;color: #ff0000"
            >被申请人与下列我方代理过的客户/申请人名称相同/近似，请提交客户管理组刘佳进行冲突检索，审核通过后方可继续立案。</span
          >
        </el-col>
      </el-row>
      <el-table :data="gridData">
        <el-table-column property="agentNum" label="案件文号"></el-table-column>
        <el-table-column property="caseType" label="案件类型"></el-table-column>
        <el-table-column property="caseName" label="案件名称">
          <template slot-scope="scope">
            <span v-html="highlightKey(scope.row.caseName, scope.row.keyName)"></span>
          </template>
        </el-table-column>
        <el-table-column
          property="droitNumber"
          label="权利号"
        ></el-table-column>
        <el-table-column
          property="applicantName"
          label="申请人"
        >
          <template slot-scope="scope">
            <span v-html="highlightKey(scope.row.applicantName, scope.row.keyName)"></span>
          </template>
        </el-table-column>
        <el-table-column property="custName" label="客户名称">
          <template slot-scope="scope">
            <span v-html="highlightKey(scope.row.custName, scope.row.keyName)"></span>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogcheckChongTuVisible = false">取 消</el-button>
        <el-button
          v-if="!caseFormData.find(item => item.ctAudit === 1)"
          type="primary"
          @click="dialogcheckChongTuBtn"
          >提 交
        </el-button>
      </div>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="chongtuAuditViewCom" width="40%">
      <el-row>
        <el-col :span="24" style="text-align: center">
          <el-form>
            <el-form-item label="理由:">
              <el-input v-model="chongtuAuditReason"></el-input>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="chongtuAuditView = false">取 消</el-button>
        <el-button type="primary" @click="chongtuAuditFunc(chongtuAuditView)">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Willtable from "@/components/Willtable";
import { importTradeMarkCaseData } from "@/api/serviceApi.config.js";
import {
  queryAlltask,
  queryCasesByTaskId,
  addWaitCases,
  deleteWaitCase,
  batchHeigCredit,
  checkCases,
  queryDocByDraftNumber,
  zipDoc,
  queryAppByCusetId,
  queryAppAddrByTm,
  getCaseTime
} from "@/api/caseList.js";
import {
  saveCaseInfoUrl,
  tijiao,
  chongtuAudit,
  chongtuTest
} from "@/api/caseDetail";
import uploadXlsx from "@/components/fileReadXLSX";
import TrademarkTable from "@/views/workbench/case/components/trademarkTable";
import { formatDate } from "@/utils";
import { billSubmitUrl } from "@/api/billApi";
import massfilingTitleList from "./massfilingTitleList";
import PoppingTimeLimit from "@/views/workbench/toDoTasks/poppingTimeLimit";
import { saveCasesUrl } from "../../../../api/caseDetail";
import { mapGetters } from 'vuex';
import { queryCaseAppExamine } from '@/api/customerList'

export default {
  name: "massfiling",
  components:{
    PoppingTimeLimit,
    TrademarkTable,
    Willtable,
  },
  data() {
    return {
      chongtuAuditView: false,
      chongtuAuditReason: "",
      gridData: [],
      dialogcheckChongTuVisible: false,
      poppingTimeLimitState: false,
      caseData: [],
      multiclass: 1,
      selectTypeState: false,
      showTable: false,
      caseFormData: [{}], // 立卷列表
      filingFlag: false, // 立卷状态
      dialogTableVisible: false, // 文件导入对话框
      dialogInputVisible: false, // 添加案件对话框
      dialogExplainVisible: false, // 下载文件对话框
      dialogExplainList: [], // 下载文件列表
      notCheckState: false, // 是否可以选中
      uploadOrDownload: "1", // 上传或者下载
      filingOperationState: false, // 是否可以立卷
      importTradeMarkCaseData, // 上传路径
      postFileData: {
        // 上传文件数据
        tokenID: this.$store.state.user.token
      },
      fileList: [], // 上传文件列表
      uploadButtonState: true, // 控制文件按钮 只能导入一个
      addCaseNumber: "1", // 添加案件个数
      addWaitObj: {}, // 添加案件的参数
      //caseFormDataDefault:[],
      curCustLevel: false, // 判断高低信用等级
      curTaskId: "", // 当前taskId
      curCaseIds: [], // 当前选中的caseId
      trademarkImportTableVisible: false,
      queryModuleData: {
        address: []
      },
      clickUpload: false,
      appCustList: [],
      appAddrArray: [],
      appAddrArrayEn: [],
      queryCanProcessTmState: false,
      multipleSelection: [],
      regNumberList: [],
      tmlist: [
        "补发商标注册证",
        "补发商标变转续证明",
        "撤回商标申请",
        "变名变址",
        "续展",
        "变更注册申请代理机构",
        "删减商品项目",
        "许可备案",
        "更正商标申请事项",
        "转让/移转"
      ],
      tmlist2: [
        "无效宣告申请",
        "撤销三年停止使用申请",
        "商标注销",
        "分割申请",
        "异议答辩",
        "异议",
        "无效宣告答辩",
        "注册驳回复审",
        "国际注册驳回复审",
        "撤三答辩（提供使用证明）",
        "撤销商标复审",
        "撤销复审答辩",
        "不予注册复审",
        "出具优先权证明文件",
        "撤回商标评审",
        "参加不予注册复审",
        "出具商标注册证明"
      ],
      regNumberListState: false,
      regNumberListStr: "",
      canOperationList: ["商标注册", "商标查询"],
      currentTypeText: "",
      agGridApi: null
    };
  },
  created() {
    this.getCasesTask();
  },
  computed: {
    ...mapGetters(["caseFormDataDefault", "caseFormData"])
  },
  methods: {
    highlightKey(text, key) {
      if (!key || !text || text.indexOf(key) === -1) {
        // 没有匹配到就原样返回
        return text;
      }
      const regex = new RegExp(key, 'gi');
      return text.replace(regex, `<span style="color: red;">${key}</span>`);
    },
    checkChongTuSet(chongData, type, forwordType) {
      this.gridData =
        chongData.length > 500 ? chongData.splice(0, 500) : chongData;
      this.dialogcheckChongTuVisible = true;
    },
    dialogcheckChongTuBtn() {
      // this.jumpTodoTask(0, 0)
      tijiao({
        taskId: this.$route.query.taskId
      }).then(async res => {
        this.$message.success("提交成功!");
        await this.updateCtAudit(res.data && res.data[0] && res.data[0].taskId);
        this.dialogcheckChongTuVisible = false;
      });
    },
    alertChongtuAuditFunc() {
      this.chongtuAuditView = true;
    },
    chongtuAuditFunc(result) {
      if (!result && !this.chongtuAuditReason) {
        this.$message.error("请填写退回理由！");
        return;
      }
      chongtuAudit({
        failReason: result ? undefined : this.chongtuAuditReason,
        taskId: this.$route.query.taskId,
        result,
        taskType: this.$route.query.taskType || 1
      }).then(res => {
        this.$message.success("审核成功！");
        this.updateCtAudit(res.data && res.data[0] && res.data[0].taskId);
        this.chongtuAuditView = false;
      });
    },
    deleteWaitCase(caseId,taskId) {
      if (this.caseFormData.length === 1) {
        this.$message("该任务至少有一条案件信息");
        return;
      }
      const data = {
        taskId: taskId,
        caseId: caseId
      };
      this.$confirm("你确定要删除该案件吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteWaitCase(data).then(res => {
            if (res.success) {
              this.getCasesTask();
            }
          });
        })
        .catch(() => {});
    },
    closePoppingTimeLimit() {
      this.poppingTimeLimitState = false;
      if (this.prefiling) {
        this.$router.push({
          path: "preFilingPush/1",
          query: {
            taskId: this.$route.query.taskId,
            taskType: this.$route.query.taskType
          }
        });
        return;
      }
      this.$router.replace("/workbench/toDotask");
    },
    postFileChange(file, fileList) {
      this.uploadButtonState = false;
    },
    postFileRemove() {
      setTimeout(() => {
        this.uploadButtonState = true;
      }, 500);
    },
    beforeUpload() {
      this.loading = this.$loading({
        lock: true,
        text: "上传中，请稍等",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
    },
    handleSuccess(res) {
      this.loading.close();
      this.getCasesTask();
      if (res.success) {
        this.dialogTableVisible = false;
      }
      this.$alert(`${res.message}`, "提示", {
        confirmButtonText: "确定"
      });
    },
    changeLoadType() {
      if (this.uploadOrDownload === "1") {
        document.getElementById("exceldown").click();
        this.dialogTableVisible = false;
      }
      if (this.uploadOrDownload === "2") {
        if (this.caseFormData[0].operationWay == 2) {
          this.$confirm(
            "重新选择立卷方式后，您之前编辑过的案件信息都将清除，您确定要重新选择批量操作方式吗？",
            "提示",
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }
          )
            .then(() => {
              this.$refs.uploadExcel.submit();
              this.postFileRemove();
              this.dialogTableVisible = false;
            })
            .catch(() => {});
          return;
        }
        if (this.caseFormData[0].caseGroup) {
          this.$confirm(
            "当前已存在信息，如果您再次导入文件，那么系统会覆盖掉您之前的案件信息，请问您确定要再次上传文件吗？",
            "提示",
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }
          )
            .then(() => {
              this.$refs.uploadExcel.submit();
              this.postFileRemove();
              this.dialogTableVisible = false;
            })
            .catch(() => {});
        } else {
          this.$refs.uploadExcel.submit();
          this.postFileRemove();
          this.dialogTableVisible = false;
        }
      }
    },
    addWaitCases() {
      this.addWaitObj.caseNumber = this.addCaseNumber;
      delete this.addWaitObj.caseId;
      delete this.addWaitObj.createDate;
      addWaitCases(this.addWaitObj).then(res => {
        if (res.success) {
          this.dialogInputVisible = false;
          this.getCasesTask();
        }
      });
    },
    async jumpTodoTask(checkCase, checkChongTu = 1) {
      if (this.$route.query.taskType == 1) {
        if (this.caseFormData.map(i => i.appId) && this.caseFormData.map(i => i.appId).length) {
          const res = await queryCaseAppExamine({appIds: this.caseFormData.map(i => i.appId), caseIds: this.caseFormData.map(i => i.caseId)})
          if (res.messageType == 300) {
            this.$message.warning('该主体为新申请人，请在申请人界面提交审核，由客户管理组审查后再立案')
            return;
          }
        }
      } else {
        const list = []
        this.caseFormData.map(i => {
          list.push(...(i.patentCaseApplicationList || []))
        })
        if (list.length) {
          const res = await queryCaseAppExamine({appIds: list.map(i => i.appId), caseIds: this.caseFormData.map(i => i.caseId)})
          if (res.messageType == 300) {
            this.$message.warning('该主体为新申请人，请在申请人界面提交审核，由客户管理组审查后再立案')
            return;
          }
        }
      }

      const data = {
        audit: 0,
        custId: this.caseFormData[0].custId,
        userId: this.$store.state.user.userId,
        taskId: this.$route.query.taskId,
        caseIds: this.caseFormData.map(item => item.caseId),
        checkCase: checkCase,
        checkChongTu,
        taskType: this.$route.query.taskType || 1
      };
      const not =
        "案件的注册日期为自动抓取的首次注册公告日期，请务必通过商标网（G开头商标号的国际注册通过WIPO官网）确认被撤销商标是否经过异议流程以免因不满三年不予受理。";
      if (
        this.caseFormData[0].caseType === "撤销三年停止使用申请" &&
        !(await this.$confirm(not, "提示", {
          // distinguishCancelAndClose:true,
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            return true;
          })
          .catch(action => {
            return false;
            // if(action === 'cancel') {
            //   return false
            // }else{
            //   return true
            // }
          }))
      )
        return;
      if (checkCase) {
        await this.delAllGoodsJudge();
        if (await this.chongtuTestFunc()) return;
      }
      batchHeigCredit(data)
        .then(res => {
          if (res.messageType == -6) {
            this.$confirm("提示", {
              message: this.$commonUtils.rowsMessage(res.message, "#"),
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }).then(() => {
              this.jumpTodoTask(0);
            });
            return;
          }
          if (res.messageType == 12) {
            this.$confirm(res.message, "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }).then(() => {
              this.$router.replace("/workbench/toDotask");
            });
            return;
          }
          if (res.messageType == 13) {
            this.caseData = res.data;
            if (this.$route.query.taskType == 4) {
              this.caseData[0].timelimit = this.caseData[0].timelimitList[0];
            }
            this.poppingTimeLimitState = true;
            return;
          }
          if (res.messageType == 10) {
            this.checkChongTuSet(res.data, "", "");
            return;
          }
          this.$router.replace("/workbench/toDotask");
        })
        .catch(err => {});
    },
    updateCtAudit(taskId) {
      this.$router.push("/workbench/case/case_management?myCase=2");
      // this.$router.go(-1)
      // this.$router.push({
      //       query: {...this.$route.query, taskId},
      //       params: {...this.$route.params}
      //     })
      // taskId && queryCasesByTaskId({
      //   taskId: taskId
      // }).then(res => {
      //   res.data.forEach(item => {
      //     item.taskId = taskId
      //     item.visibility = false
      //   })
      //   this.caseFormData = res.data
      // })
    },
    formatColumnDefs(columns) {
      const newColumns = columns.map(item => {
        if (item.type == "imageFile") {
          return {
            headerName: item.title,
            field: item.type,
            width: 120,
            cellRenderer: this.imgRenderer
          };
        }
        return {
          headerName: item.title,
          field: item.type
        };
      });
      newColumns.unshift({
        headerName: "序号",
        field: "number",
        cellClass: `${this.filingFlag ? "disableCheckBox" : ""}`,
        width: 80,
        headerCheckboxSelection:
          this.caseFormData[0].visibility && !this.filingFlag,
        checkboxSelection: this.caseFormData[0].visibility,
        showDisabledCheckboxes: true,
        cellRenderer: params => {
          return params.node.rowIndex + 1; // 添加1，使序号从1开始
        }
      });
      const options = {
        headerName: "操作",
        field: "handle",
        width: 100,
        pinned: "right",
        hide: this.caseFormData[0].visibility && !this.filingFlag,
        // cellStyle: {
        //     'text-align': 'center', // 水平居中
        // },
        cellRenderer: params => {
          if (params.colDef.field === "handle") {
            const clikView = (type,id,casetype,num,typeId,taskId) => {
              console.log(type, "type");
              if (type == "edit") {
                this.goToCaseDetail(id,casetype,num,typeId);
              } else if (type == "delete") {
                this.deleteWaitCase(id,taskId);
              }
            };
            window.clikView = clikView;
            return `
              <div>
                <span style="color: #4A8DDC;cursor: pointer" onclick="clikView('edit','${params.data.caseId}','${params.data.caseType}','${params.data.agentNum}','${params.data.caseTypeId}')">编辑</span>
                <span style="color: #F56C6C;cursor: pointer" onclick="clikView('delete','${params.data.caseId}','${params.data.caseType}','${params.data.agentNum}','${params.data.caseTypeId}','${params.data.taskId}')">删除</span>
              </div>
            `;
          }
        }
      };
      newColumns.push(options);
      return newColumns;
    },
    onGridReady(params) {
      this.agGridApi = params.api;
    },
    imgRenderer(params) {
      if (params.colDef.field == "imageFile") {
        if (params.value) {
          return `<img class="filterTableTmg" src="ipdoc${
            params.value
          }" alt="">`;
        } else {
          return "";
        }
      }
    },
    goToCaseDetail(caseId,caseType,agentNum,caseTypeId) {
      if (this.$route.query.taskType == 4) {
        this.$router.push(
          "/workbench/case/case_detail/" +
            caseId +
            "/" +
            caseType +
            "?taskType=" +
            4 +
            "&copy=" +
            false +
            "&agentNum=" +
            agentNum +
            "&flag=noCheck"
        );
      } else {
        this.$router.push(
          "/workbench/case/case_detail/" +
            caseId +
            "/" +
            caseType +
            `?caseTypeId=${caseTypeId}`
        );
      }
    },
    closeTable() {
      this.showTable = false;
      this.caseFormData[0].visibility = false;
      this.getCasesTask();
    },
    multipleOperation() {
      this.caseFormData[0].visibility = true;
      this.currentTypeText = "批量编辑";
      this.agGridApi.selectAll();
      // if(this.caseFormData[0].caseTypeId==48){
      //   this.rowList=this.caseFormData.filter(item=>item.changeType==this.caseFormData[0].changeType)
      //   this.rowList.forEach(row=>{
      //     this.$refs.massfilingMultiple.toggleRowSelection(row, true);
      //   })
      //   return
      // }

      // this.caseFormData.forEach(row => {
      //   this.$refs.massfilingMultiple.toggleRowSelection(row, true);
      // });
    },
    downLoadAll() {
      zipDoc({ draftCaseNumber: this.caseFormData[0].agentNum }).then(res => {
        this.$commonUtils.downLoadAll({ url: res.data });
        // var a = document.createElement('a');
        // a.setAttribute('href', res.data);
        // a.setAttribute('id', 'startTelMedicine');
        // if (document.getElementById('startTelMedicine')) {
        //   document.body.removeChild(document.getElementById('startTelMedicine'));
        // }
        // document.body.appendChild(a);
        // a.click();
      });
    },
    queryDocByDraftNumber(draftCaseNumber) {
      queryDocByDraftNumber({ draftCaseNumber }).then(res => {
        this.dialogExplainList = res.data;
      });
    },
    getCasesTask() {
      //this.caseFormDataDefault=[]
      this.queryCasesByTaskId(this.$route.query.taskId);
    },
    queryAppAddrByTm(appId) {
      queryAppAddrByTm({ appId }).then(res => {
        this.appAddrArray = this.unique(
          JSON.parse(JSON.stringify(res.data[0].appAddrArray)),
          "addressCn"
        );
        this.appAddrArrayEn = this.unique(
          JSON.parse(JSON.stringify(res.data[0].appAddrArray)),
          "addressEn"
        ).filter(item => !!item.addressEn);
      });
    },
    queryCasesByTaskId(taskId) {
      const data = {
        taskId: taskId,
        taskType: this.$route.query.taskType || 1
      };
      queryCasesByTaskId(data).then(res => {
        res.data.forEach(item => {
          item.taskId = taskId;
          item.visibility = false;
        });
        // this.caseFormDataDefault.push(res.data)
        this.caseFormData = res.data; // this.caseFormDataDefault
        this.queryDocByDraftNumber(res.data[0].agentNum);
        this.queryAppByCusetId();
        // if(this.tmlist.includes(this.caseFormData[0].caseType)){
        //
        // }
      });
    },
    queryAppByCusetId() {
      const data = {
        custId: this.caseFormData[0].custId
      };
      queryAppByCusetId(data).then(res => {
        this.appCustList = res.data;
      });
    },

    unique(data, key) {
      const hash = {};
      const data2 = data.reduce((preVal, curVal) => {
        hash[curVal[key]]
          ? ""
          : (hash[curVal[key]] = true && preVal.push(curVal));
        return preVal;
      }, []);
      return data2;
    },
    cancelEdit(type) {
      if (type === 1) {
        this.caseFormData[0].visibility = false;
        this.agGridApi.deselectAll();
      } else {
        if (!this.canOperationList.includes(this.caseFormData[0].caseType)) {
          this.cancelEdit(1);
          this.filingFlag = false;
        } else {
          this.batchOperation("edit");
        }
      }
    },
    async batchOperation(command) {
      this.currentTypeText = "";
      if (command === "edit") {
        if (this.filingFlag) {
          this.filingFlag = false;
        }
        this.caseFormData[0].visibility = true;
        this.agGridApi.selectAll();
      }
      if (command === "filing") {
        this.caseFormData[0].visibility = true;
        // if (!this.caseFormData[0].visibility) {
        //   this.batchOperation("edit");
        //   //this.notCheckState = true
        // } else {
        //   //this.notCheckState = false
        // }
        if (!this.filingFlag) {
          // if (this.$route.query.taskType != 4) {
          //   this.checkCases();
          // } else {
          //   if (!(await this.validateRules())) return;
          // }
          this.checkCases();
        }
        this.filingFlag = true;
        if (
          /^['C'|'D']$/.test(this.caseFormData[0].level) ||
          !this.caseFormData[0].level
        ) {
          queryAlltask({
            userId: this.$store.getters.userId,
            taskId: this.$route.query.taskId,
            taskType: this.$route.query.taskType
          }).then(res => {
            if (res.data[0].createStatus) {
              this.curCustLevel = true;
            } else {
              if (
                this.caseFormData[0].country !== "中国" &&
                !this.caseFormData[0].level
              ) {
                this.curCustLevel = true;
              } else {
                this.curCustLevel = false;
              }
            }
          });
        } else {
          this.curCustLevel = true;
        }
      }
      if (command === "fileImport") {
        this.postFileData.caseIds = this.caseFormData
          .map(item => item.caseId)
          .join(",");
        this.postFileData.custId = this.caseFormData[0].custId;
        this.dialogTableVisible = true;
      }
      if (command === "trademarkImport") {
        // this.postFileData.caseIds = this.caseFormData.map(item => item.caseId).join(',')
        // this.postFileData.custId = this.caseFormData[0].custId
        this.trademarkImportTableVisible = true;
      }
      if (command === "trademarkImport2") {
        this.regNumberListState = true;
      }
    },
    queryCanProcessTm() {
      this.queryModuleData.custId = this.caseFormData[0].custId;
      this.queryModuleData.caseTypeId = this.caseFormData[0].caseTypeId;
      this.queryModuleData.regNumberInUse = this.caseFormData
        .map(item => item.regNumber)
        .filter(item => !!item)
        .join(",");

      this.queryCanProcessTmState = true;
    },
    getFirstSheet(firstSheet) {
      this.queryModuleData.caseTypeId = this.caseFormData[0].caseTypeId;
      this.queryModuleData.custId = this.caseFormData[0].custId;
      this.regNumberList = firstSheet
        .map(item => item["申请号"])
        .filter(item => item !== undefined);
      // if(this.tmlist2.includes(this.caseFormData[0].caseType)){
      //
      // }
      this.regNumberListStr = this.regNumberList.join("\n");
    },
    getTrademark(val) {
      this.multipleSelection = val;
    },
    jumpCaseDetail() {
      if (this.multipleSelection.length === 1) {
        this.$message("请选择单独编辑");
        return;
      }
      var obj = {
        multipleSelection: this.multipleSelection,
        appObj: this.appCustList.find(
          item => item.appId === this.queryModuleData.appId
        ),
        beforeAddress: this.unique(
          this.multipleSelection.map(item => ({
            addressCn: item.applicantAddress,
            addressEn: item.applicantEnAddress
          })),
          "addressCn"
        ),
        changeType: this.queryModuleData.caseTypeName
      };
      this.sessionStorage = obj;
      if (
        [...new Set(this.multipleSelection.map(item => item.regNumber))]
          .map(item => ({
            regNumber: item,
            tmIdList: this.multipleSelection
              .filter(itm => itm.regNumber === item)
              .map(i => i.tmId)
          }))
          .find(item => item.tmIdList.length > 1)
      ) {
        this.selectTypeState = true;
        //   this.$confirm('选项中有一个商标号多个类别的情况，是一标一类一案还是一标多类一案?', '确认信息', {
        //     distinguishCancelAndClose: true,
        //     confirmButtonText: '一标多类',
        //     cancelButtonText: '一标一类'
        //   }).then(() => {
        //     obj.multiclass = 1
        //     sessionStorage.setItem('changeOfNameOrAddressObj', JSON.stringify(obj))
        //     this.$router.push({ path: '/workbench/case/case_detail/' + this.caseFormData.map(item => item.caseId).join(',') + '/' + this.caseFormData[0].caseType, query: { import: '1' }})
        //   }).catch(action => {
        //     obj.multiclass = 0
        //     sessionStorage.setItem('changeOfNameOrAddressObj', JSON.stringify(obj))
        //     this.$router.push({ path: '/workbench/case/case_detail/' + this.caseFormData.map(item => item.caseId).join(',') + '/' + this.caseFormData[0].caseType, query: { import: '1' }})
        //   });
        // } else {
        //   obj.multiclass = 0
        //   sessionStorage.setItem('changeOfNameOrAddressObj', JSON.stringify(obj))
        //   this.$router.push({ path: '/workbench/case/case_detail/' + this.caseFormData.map(item => item.caseId).join(',') + '/' + this.caseFormData[0].caseType, query: { import: '1' }})
      } else {
        this.sessionStorage.multiclass = this.multiclass;
        sessionStorage.setItem(
          "changeOfNameOrAddressObj",
          JSON.stringify(this.sessionStorage)
        );
        this.$router.push({
          path:
            "/workbench/case/case_detail/" +
            this.caseFormData.map(item => item.caseId).join(",") +
            "/" +
            this.caseFormData[0].caseType,
          query: { import: "1",importByCase:1 }
        });
      }
    },
    confirmSelect() {
      this.sessionStorage.multiclass = this.multiclass;
      sessionStorage.setItem(
        "changeOfNameOrAddressObj",
        JSON.stringify(this.sessionStorage)
      );
      this.selectTypeState = false;
      this.$router.push({
        path:
          "/workbench/case/case_detail/" +
          this.caseFormData.map(item => item.caseId).join(",") +
          "/" +
          this.caseFormData[0].caseType,
        query: { import: "1",importByCase:1},
        // params: { caseId: this.caseFormData.map(item => item.caseId).join(",") }
      });
    },
    queryCanProcessTmChange(bool) {
      this.queryCanProcessTmState = bool;
    },
    selectable(row, index) {
      if (this.filingFlag) {
        // for(let i=0;i<this.caseFormData.length;i++){
        //   if(index===i){
        //     return false
        //   }
        // }
      } else {
        return true;
      }
    },
    validateRules(caseDetailFormData, index) {
      const message = [];
      const errorMessage = [];
      const reqMessageFunc = (list, idx, msg) => {
        if (list.find(item => item.name === "案件" + (idx + 1))) {
          list.find(item => item.name === "案件" + (idx + 1)).content.push(msg);
        } else {
          list.push({ name: "案件" + (idx + 1), content: [msg] });
        }
      };
      this.caseFormData.forEach(async (caseDetailFormData, index) => {
        if (
          caseDetailFormData.trademarkCaseCustWorkgroups.length ||
          caseDetailFormData.trademarkCaseCBWorkgroups.length
        ) {
          let list = [];
          if (caseDetailFormData.trademarkCaseCustWorkgroups.length) {
            list = list.concat([
              ...new Set(
                caseDetailFormData.trademarkCaseCustWorkgroups[0].trademarkCaseWorkgroupMembers
                  .map(i => i.caseRoleName)
                  .filter(Boolean)
              )
            ]);
          }
          if (caseDetailFormData.trademarkCaseCBWorkgroups.length) {
            caseDetailFormData.trademarkCaseCBWorkgroups.forEach(item => {
              list = list.concat([
                ...new Set(
                  item.trademarkCaseWorkgroupMembers
                    .map(i => i.caseRoleName)
                    .filter(Boolean)
                )
              ]);
            });
          }
          if (!this.$commonUtils.checkBA(list)) {
            reqMessageFunc(errorMessage, index, "承办律师或客户律师有误");
          }
        }
        if (caseDetailFormData.caseType == "无效") {
          if (!caseDetailFormData.patentRighter) {
            reqMessageFunc(message, index, "委托方中的专利权人");
          }
          if (!caseDetailFormData.disableAppliant) {
            reqMessageFunc(message, index, "委托方中的请求人");
          }
          if (
            caseDetailFormData.patentCaseApplicationList &&
            !caseDetailFormData.patentCaseApplicationList.length
          ) {
            reqMessageFunc(message, index, "申请人");
          }
          if (caseDetailFormData.disableWtr == 1) {
            if (
              caseDetailFormData.patentRighter !==
              caseDetailFormData.patentCaseApplicationList[0].applicantName
            ) {
              message[1].content.push("专利权人名称必须和第一申请人名称一致");
            }
          } else if (caseDetailFormData.disableWtr == 2) {
            if (
              caseDetailFormData.disableAppliant !==
              caseDetailFormData.patentCaseApplicationList[0].applicantName
            ) {
              message[1].content.push("请求人名称必须和第一申请人名称一致");
            }
          }
        }
        if (
          ["内-外", "外-外"].includes(caseDetailFormData.appFromto) &&
          !caseDetailFormData.toCountry
        ) {
          reqMessageFunc(message, index, "进入国家");
        }
        if (!caseDetailFormData.patentType) {
          reqMessageFunc(message, index, "专利类型");
        }
        if (!caseDetailFormData.appFromto) {
          reqMessageFunc(message, index, "申请方向");
        }
        if (!caseDetailFormData.caseCnName) {
          reqMessageFunc(message, index, "案件中文名称");
        }
        if (
          caseDetailFormData.feeReduce > 1 ||
          caseDetailFormData.feeReduce < 0
        ) {
          reqMessageFunc(errorMessage, index, "费减比例数据错误");
        }
        if (
          caseDetailFormData.patentCaseApplicationList &&
          caseDetailFormData.patentCaseApplicationList.length
        ) {
          if (
            caseDetailFormData.patentCaseApplicationList.some(
              i => !i.no && i.no !== 0
            )
          ) {
            reqMessageFunc(errorMessage, index, "申请人的序号不能为空");
          }
          let firstlist = [caseDetailFormData.patentCaseApplicationList[0]];
          if (
            firstlist.length &&
            !+caseDetailFormData.feeReduce &&
            (firstlist[0].fyjhbeian || firstlist[0].beianYear)
          ) {
            if (await this.checkJianjiao(caseDetailFormData)) {
              reqMessageFunc(
                errorMessage,
                index,
                "请核查申请人的“已费用减缴备案”和“备案年度”是否正确"
              );
            }
          } else if (
            firstlist.length &&
            +caseDetailFormData.feeReduce &&
            (!firstlist[0].fyjhbeian ||
              firstlist[0].beianYear != new Date().getFullYear())
          ) {
            if (await this.checkJianjiao(caseDetailFormData)) {
              reqMessageFunc(
                errorMessage,
                index,
                "请核查申请人的“已费用减缴备案”和“备案年度”是否正确"
              );
            }
          }
        }
        if (
          caseDetailFormData.patentInventorList &&
          caseDetailFormData.patentInventorList.length
        ) {
          if (
            caseDetailFormData.patentInventorList.some(i => !i.no && i.no !== 0)
          ) {
            reqMessageFunc(errorMessage, index, "发明人的序号不能为空");
          }
        }
      });
      if (message.length || errorMessage.length) {
        this.$confirm("提示", {
          message: this.$commonUtils.rowsMessage(
            `
                  ${
                    message.length
                      ? "请填写:&&" +
                        message.map(
                          item => "&&" + item.name + "中的: " + item.content
                        )
                      : ""
                  }
                  ${
                    errorMessage.length
                      ? "&&请注意:&&" +
                        errorMessage.map(
                          item => "&&" + item.name + "中的: " + item.content
                        )
                      : ""
                  }
                `,
            "&&"
          ),
          confirmButtonText: "确定",
          // cancelButtonText: '否',
          showCancelButton: false,
          type: "warning"
        })
          .then(() => {})
          .catch(() => {});
        return false;
      } else {
        return true;
      }
    },
    async checkJianjiao(caseDetailFormData) {
      if (
        caseDetailFormData.appFromto == "外-内" ||
        caseDetailFormData.appFromto == "内-内" ||
        caseDetailFormData.appFromto == "台-内"
      ) {
        return true;
        // return await this.$confirm('请核查申请人的“已费用减缴备案”和“备案年度”是否正确',
        //   '提示',
        //   {
        //     // distinguishCancelAndClose:true,
        //     confirmButtonText: '核查',
        //     cancelButtonText: '不核查',
        //     type: 'warning'
        //   }
        // ).then(() => {
        //   return 1
        // }).catch((err) => {
        //   return 0
        // })
      }
      return false;
    },
    checkCases() {
      let reasons = "";
      const taskType = this.$route.query.taskType || undefined
      checkCases({ caseIds: this.caseFormData.map(item => item.caseId),taskType}).then(
        res => {
          this.caseFormData.forEach(caseItem => {
            res.data.forEach((item, index) => {
              if (item.caseId === caseItem.caseId) {
                caseItem.checkedState = item.res;
                if (item.reason) {
                  caseItem.reason = item.reason;
                }
              }
            });
          });
          // this.agGridApi.deselectAll();
          const errorList = [];
          function groupCasesByReason(data) {
            const reasonMap = {};
            data.forEach((item, index) => {
              if (item.reason) {
                if (!reasonMap[item.reason]) {
                  reasonMap[item.reason] = [];
                }
                reasonMap[item.reason].push(index + 1);
              }
            });

            const messages = [];
            Object.entries(reasonMap).forEach(([reason, indexes]) => {
              let message = "";
              let group = [];
              indexes.forEach((index, i) => {
                group.push(index);
                // Check if this is the last index, or if the next index is not consecutive
                if (i === indexes.length - 1 || indexes[i + 1] !== index + 1) {
                  if (group.length > 1) {
                    message = `第${group[0]}~${
                      group[group.length - 1]
                    }条案件${reason}`;
                  } else {
                    message = `第${group[0]}条案件${reason}`;
                  }
                  messages.push(message);
                  group = []; // Reset the group for the next set of cases
                }
              });
            });

            // Restrict the output to the first 10 messages
            return messages.slice(0, 10);
          }
          console.log(this.caseFormData,'this.caseFormData');
          this.caseFormData.forEach((item, index) => {
            if (item.checkedState == 1) {
              // 获取行节点
              let rowNode = this.agGridApi.getRowNode(index);
              // 选中这一行
              rowNode.setSelected(true);
              // this.$refs.massfilingMultiple.toggleRowSelection(item, true);
            }
            // else {
              // errorList.push({ ...item, index: index });
            // }
          });
          console.log(errorList,'errorList');
          groupCasesByReason(res.data).map((item)=>{
            reasons+= `<p style='panding:5px;margin-bottom:8px'>${item}</p>`
          });
          // top10List.forEach(item => {
          //   reasons += `<p style="padding: 5px">第${item.index + 1}条案件${
          //     item.reason
          //   }</p>`;
          // });

          if (
            res.data.filter(item => item.res == 1).length !==
            this.caseFormData.length
          ) {
            this.filingOperationState = true;
            this.message = this.$message({
              type: "warning",
              duration: 0,
              dangerouslyUseHTMLString: true,
              message: reasons,
              showClose: true
            });
          } else {
            this.filingOperationState = false;
          }
        }
      );
    },
    handleSelectionChange(val) {
      // if(this.caseFormData[0].caseTypeId==48) {
      //   if ([...new Set(val.map(item => item.changeType))].length >= 2) {
      //     this.$message.error("您必须选择同一撤回类型的案件");
      //     val = val.filter(item => item.changeType == val[0].changeType)
      //     val.forEach(row => {
      //       this.$refs.massfilingMultiple.toggleRowSelection(row, true);
      //     })
      //   }
      // }
      this.curCaseIds = val.map(item => item.caseId);
    },
    onRowSelected(values) {
      const selectedNodes = values.api.getSelectedNodes();
      const selectedData = selectedNodes.map(node => node.data);
      this.curCaseIds = selectedData.map(item => item.caseId);
    },
    caseManyEdit() {
      if (this.caseFormData[0].operationWay == 1) {
        this.$confirm(
          "重新选择立卷方式后，您之前编辑过的案件信息都将清除，您确定要重新选择批量操作方式吗？",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        )
          .then(() => {
            if (this.$route.query.taskType == 4) {
              this.$router.push(
                "/workbench/case/case_detail/" +
                  this.curCaseIds.join(",") +
                  "/" +
                  this.caseFormData[0].caseType +
                  `?taskType=4&caseTypeId=${
                    this.caseFormData[0].caseTypeId
                  }&flag=noCheck`
              );
            } else {
              this.$router.push(
                "/workbench/case/case_detail/" +
                  this.curCaseIds.join(",") +
                  "/" +
                  this.caseFormData[0].caseType +
                  `?caseTypeId=${this.caseFormData[0].caseTypeId}&flag=noCheck&operate=many`
              );
            }
          })
          .catch(() => {});
      } else {
        console.log(this.$route.query.taskType,'this.$route.query.taskType');
        if (this.$route.query.taskType == 4) {
          this.$router.push(
            "/workbench/case/case_detail/" +
              this.curCaseIds.join(",") +
              "/" +
              this.caseFormData[0].caseType +
              "?taskType=" +
              4 +
              "&copy=" +
              false +
              "&agentNum=" +
              this.caseFormData[0].agentNum +
              "&flag=noCheck" +
              "&operate=many"
          );
        } else {
          this.$router.push(
            "/workbench/case/case_detail/" +
              this.curCaseIds.join(",") +
              "/" +
              this.caseFormData[0].caseType +
              `?caseTypeId=${this.caseFormData[0].caseTypeId}&flag=noCheck&operate=many`
          );
        }
      }
    },
    saveRegNumberList() {
      this.regNumberList = this.regNumberListStr
        .split("\n")
        .filter(item => item != "");
      const data = {
        regNumberList: this.regNumberList,
        caseIds: this.caseFormData.map(item => item.caseId),
        caseType: this.caseFormData[0].caseType,
        caseTypeId: this.caseFormData[0].caseTypeId,
        multiclass: this.multiclass,
        checkInfo: 1,
        caseFlag: 1,
        isBatch: 1,
      };
      saveCaseInfoUrl(data).then(res => {
        this.queryCasesByTaskId(this.$route.query.taskId);
        this.regNumberListState = false;
      });
    },
    handlerAddCase(index) {
      this.dialogInputVisible = true;
      let { caseType, caseTypeId, agentNum, custId } = this.caseFormData[0];
      this.addWaitObj = {
        caseTypeName: caseType,
        caseTypeId,
        draftNumber: agentNum,
        custId,
        taskId: this.$route.query.taskId,
        taskType: this.$route.query.taskType
      };
      this.addWaitObj = Object.assign(this.addWaitObj, this.caseFormData[0]);
    },
    async chongtuTestFunc(flag) {
      if (this.caseFormData[0].ctAudit && !flag) return false;
      return new Promise(resolve => {
        chongtuTest({
          taskId: this.$route.query.taskId,
          draftNumber: this.caseFormData[0].agentNum,
          taskType: this.$route.query.taskType
        })
          .then(res => {
            if (res.messageType == 10) {
              this.checkChongTuSet(res.data, "", "");
              resolve(true);
            } else {
              resolve(false);
            }
          })
          .catch(err => {
            resolve(true);
          });
      });
    },
    async delAllGoodsJudge() {
      if (
        this.caseFormData[0].caseType === "撤销三年停止使用申请" ||
        this.caseFormData[0].caseType === "许可备案"
      ) {
        let notice =
          this.caseFormData[0].caseType === "撤销三年停止使用申请"
            ? "是否撤销【全部商品/服务项目】？"
            : "许可商品/服务项目是否为【全部商品/服务项目】？";
        let data = [];
        await this.$confirm(notice, "提示", {
          confirmButtonText: "是",
          cancelButtonText: "否",
          type: "warning"
        })
          .then(async () => {
            this.caseFormData.forEach(item => {
              if (
                ["外-内", "内-内"].includes(item.appFromto) &&
                item.goodClasses
              ) {
                item.goods = [
                  {
                    goodClass: item.goodClasses.split(";")[0],
                    goodName: "全部"
                  }
                ];
              }
            });
            data = this.caseFormData.map(item => ({
              caseTypeId: item.caseTypeId,
              caseId: item.caseId,
              tmCaseId: item.tmCaseId,
              goods: item.goods
            }));
            await saveCasesUrl({ tmCaseList: data, modifyCase: 1 });
          })
          .catch(action => {});
      }
    },
    async filingOperation(command) {
      if (command === "prefiling") {
        if (this.$route.query.taskType == 1) {
          if (this.caseFormData.map(i => i.appId) && this.caseFormData.map(i => i.appId).length) {
            const res = await queryCaseAppExamine({appIds: this.caseFormData.map(i => i.appId), caseIds: this.caseFormData.map(i => i.caseId)})
            if (res.messageType == 300) {
              this.$message.warning('该主体为新申请人，请在申请人界面提交审核，由客户管理组审查后再立案')
              return;
            }
          }
        } else {
          const list = []
          this.caseFormData.map(i => {
            list.push(...(i.patentCaseApplicationList || []))
          })
          if (list.length) {
            const res = await queryCaseAppExamine({appIds: list.map(i => i.appId), caseIds: this.caseFormData.map(i => i.caseId)})
            if (res.messageType == 300) {
              this.$message.warning('该主体为新申请人，请在申请人界面提交审核，由客户管理组审查后再立案')
              return;
            }
          }
        }

        const not =
          "案件的注册日期为自动抓取的首次注册公告日期，请务必通过商标网（G开头商标号的国际注册通过WIPO官网）确认被撤销商标是否经过异议流程以免因不满三年不予受理。";
        if (
          this.caseFormData[0].caseType === "撤销三年停止使用申请" &&
          !(await this.$confirm(not, "提示", {
            // distinguishCancelAndClose:true,
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              return true;
            })
            .catch(action => {
              return false;
              // if(action === 'cancel') {
              //   return false
              // }else{
              //   return true
              // }
            }))
        )
          return;
        await this.delAllGoodsJudge();
        if (await this.chongtuTestFunc()) return;
        getCaseTime({
          caseIds: this.caseFormData.map(item => item.caseId)
        }).then(res => {
          if (res.messageType == 12) {
            this.$confirm(res.message, "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }).then(() => {
              this.$router.push({
                path: "preFilingPush/1",
                query: {
                  taskId: this.$route.query.taskId,
                  taskType: this.$route.query.taskType
                }
              });
              // this.goNext();
            });
            return;
          }
          if (res.messageType == 13) {
            this.caseData = res.data;
            if (this.$route.query.taskType == 4) {
              this.caseData[0].timelimit = this.caseData[0].timelimitList[0];
            }
            this.prefiling = true;
            this.poppingTimeLimitState = true;
            return;
          }
          this.$router.push({
            path: "preFilingPush/1",
            query: {
              taskId: this.$route.query.taskId,
              taskType: this.$route.query.taskType
            }
          });
        });
      } else if (command == "createBills") {
        this.$router.push({
          path: "/workbench/finance/off_bill/bill",
          query: {
            taskId: this.$route.query.taskId,
            userId: this.$store.getters.userId
          }}).then(res => {
            this.$router.push('/workbench/case/case_management?myCase=3')
          })
        } else {
        if (this.$route.query.taskType == 1) {
          if (this.caseFormData.map(i => i.appId) && this.caseFormData.map(i => i.appId).length) {
            const res = await queryCaseAppExamine({appIds: this.caseFormData.map(i => i.appId), caseIds: this.caseFormData.map(i => i.caseId)})
            if (res.messageType == 300) {
              this.$message.warning('该主体为新申请人，请在申请人界面提交审核，由客户管理组审查后再立案')
              return;
            }
          }
        } else {
          const list = []
          this.caseFormData.map(i => {
            list.push(...(i.patentCaseApplicationList || []))
          })
          if (list.length) {
            const res = await queryCaseAppExamine({appIds: list.map(i => i.appId), caseIds: this.caseFormData.map(i => i.caseId)})
            if (res.messageType == 300) {
              this.$message.warning('该主体为新申请人，请在申请人界面提交审核，由客户管理组审查后再立案')
              return;
            }
          }
        }
          billSubmitUrl({
            taskId: this.$route.query.taskId,
            userId: this.$store.getters.userId
          }).then(res => {
            this.$router.push('/workbench/case/case_management?myCase=3')
          })
        }
      },
      checkChongTuSet(chongData, type, forwordType) {
        this.gridData = chongData.length > 500 ? chongData.splice(0, 500) : chongData
        this.dialogcheckChongTuVisible = true
      },
      dialogcheckChongTuBtn() {
        // this.jumpTodoTask(0, 0)
        tijiao({
          taskId: this.$route.query.taskId
        }).then(async res => {
          this.$message.success('提交成功!')
          await this.updateCtAudit(res.data && res.data[0] && res.data[0].taskId)
          this.dialogcheckChongTuVisible = false
        })
      },
      alertChongtuAuditFunc(type) {
        this.chongtuAuditView = type
      },
      chongtuAuditFunc(result) {
        if (!this.chongtuAuditReason) {
          this.$message.error(`请填写${result === 1 ? '通过' : '退回'}理由！`)
          return
        }
        chongtuAudit({
          failReason: this.chongtuAuditReason,
          taskId: this.$route.query.taskId,
          result: result === 1 ? 1 : 0,
          taskType: this.$route.query.taskType || 1
        }).then(res => {
          this.$router.push("/workbench/case/case_management?myCase=3");
        });
      }
    },
    computed: {
      chongtuAuditViewCom(){
        return !!this.chongtuAuditView
      },
      titleList() {
        if (this.$route.query.taskType == 4) {
          return [
            { title: '案件文号', type: 'agentNum' },
            { title: '案件类型', type: 'caseType' },
            { title: '专利类型', type: 'patentTypeStr' },
            { title: '申请方向', type: 'appFromto' },
            { title: '客户', type: 'custName' },
            { title: '客户案号', type: 'custRefNo' },
            { title: '技术交底名称', type: 'technicalDisclosure' },
            { title: '案件英文名称', type: 'caseEnName' },
            { title: '案件中文名称', type: 'caseCnName' }
          ]
        }
        if (!this.caseFormData[0].caseType) {
          return []
        }
        let obj = massfilingTitleList.find(item => item.caseType == this.caseFormData[0].caseType)
        if (obj) {
          switch (this.caseFormData[0].caseType) {
            case obj.caseType:
              return massfilingTitleList.find(item => item.caseType == this.caseFormData[0].caseType).list
          }
        }else {
        return [
          { title: "案件文号", type: "agentNum" },
          { title: "案件类型", type: "caseType" },
          {
            title: "客户",
            type: "custName"
          },
          { title: "申请人", type: "appCnName" },
          { title: "申请方向", type: "appFromto" },
          {
            title: "商标名称",
            type: "tmName"
          },
          { title: "国籍", type: "appGJdq" },
          { title: "递交方式", type: "submitType" }
        ];
      }
    },
    clientHeight() {
      return document.documentElement.clientHeight - 210;
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/ .ag-theme-balham {
  .ag-row-selected:nth-child(odd) {
    background-color: #e1f3ff !important;
    color: inherit !important; /* 或任何你希望的颜色，'inherit'用来继承父元素颜色 */
    font-weight: normal !important;
  }
  .ag-row-selected:nth-child(even) {
    background-color: inherit !important;
    color: inherit !important; /* 或任何你希望的颜色，'inherit'用来继承父元素颜色 */
    font-weight: normal !important;
  }
}
/deep/.disableCheckBox {
  .ag-checkbox-input-wrapper input {
    cursor: not-allowed !important;
    pointer-events: none !important;
  }
  .ag-checkbox-input-wrapper input::after {
    opacity: 0.5 !important;
    color: #7f8c8d !important;
  }
  .ag-checkbox-input-wrapper.ag-checked::after {
    opacity: 0.5 !important;
    color: #7f8c8d !important;
  }
}
#exceldown {
  position: absolute;
  left: 10000px;
  text-indent: 10000px;
}

.checkTask {
  display: inline-block;
  margin-right: 10px;

  img {
    width: 22px;
    vertical-align: middle;
  }

  span {
    vertical-align: middle;
    font-family: "微软雅黑";
    font-weight: 400;
    font-style: normal;
    font-size: 14px;
    color: #6699ff;
  }

  span:hover {
    opacity: 0.8;
  }
}

header {
  font-weight: 700;
  height: 60px;
  line-height: 65px;
  position: relative;

  span {
    color: #6699ff;
  }

  aside {
    position: absolute;
    right: 0;
    top: 0;
  }
}

.divider {
  position: relative;
  border-bottom: 1px solid rgba(215, 215, 215, 1);
  margin-bottom: 10px;

  span {
    color: #409eff;
    font-size: 14px;
    background: #fff;
    position: absolute;
    bottom: -9px;
    left: 20px;
    padding: 0 2px;
  }
}

.el-radio-wrap {
  margin: 0 20px;

  .el-radio:nth-child(1) {
    border-bottom: 0;
  }

  .el-radio {
    display: flex;
    align-items: center;
    padding: 0 10px;
    height: 50px;
    border: 1px solid #f4f4f5;
    width: 100%;

    /deep/ .el-radio__label {
      flex: 1;
      position: relative;

      .el-upload--text {
        display: flex;
        align-items: center;
        justify-content: space-between;

        button {
          position: absolute;
          right: 0;
        }
      }
    }
  }
}

.upload-demo {
  display: flex;
  align-items: center;

  /deep/ .el-upload-list__item:first-child {
    margin-top: 0;
  }
}

footer {
  height: 40px;
  margin-top: 10px;
  position: relative;

  .button_wrap {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 40px;
    overflow: hidden;

    .el-dropdown {
      float: right;
      overflow: hidden;
    }

    button {
      float: right;
    }
  }
}

.inputContent {
  display: flex;
  align-items: center;
  justify-content: center;

  span {
    flex: 1;
  }

  span:nth-child(1) {
    text-align: right;
  }

  .el-input {
    margin: 0 5px;
    width: 200px;
  }
}

.dialogExplain {
  /deep/ .el-dialog__title {
    color: #6699ff;
  }

  /deep/ .el-dialog__body {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .explainContent {
    border: 1px solid rgba(201, 201, 201, 1);
    border-radius: 5px;
    width: 382px;
    height: 37px;
    text-align: center;

    a {
      color: #7199d5;
    }
  }
}
/deep/ .filterTableTmg {
  height: 100%;
}

.flexBox {
  display: flex;

  /deep/ .button_warp {
    align-self: flex-end;
    margin-bottom: 18px;
    margin-left: 50px;
  }
}

.el-dialog-tmTable {
  display: flex;
  justify-content: center;
  align-items: center;

  /deep/ .el-dialog {
    margin-top: 0 !important;
  }
}

.trademarkTable {
  max-height: 500px;
  overflow: auto;
}

.imgImageFile {
  width: 50px;
}

/*/deep/ .el-select--mini{*/
/*overflow: auto;*/
/*!*border-radius: 4px;*!*/
/*!*border: 1px solid #DCDFE6;*!*/
/*}*/
.chongtuTitle {
  /deep/ .el-dialog__title {
    color: #ff0000;
  }
}
</style>
