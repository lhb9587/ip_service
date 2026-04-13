<template>
  <el-dialog
    append-to-body
    title="官方通知"
    :visible.sync="dialogVisible"
    width="60%"
    :before-close="handleClose"
    height="800"
    :modal="false"
    top="0"
    :close-on-click-modal="false"
    class="officialCommunication dragDialog"
    v-dialogDrag
    >
  <div v-if="isNoCaseOfficial" style="overflow: hidden">
    <el-button style="float: right;margin-right: 20px" @click="caseData.push({})" type="text">添加案件</el-button>
  </div>

    <el-table :data="caseData" border class="el-table1" height="200">
      <el-table-column type="index" width="50" label="序号" align="left">
      </el-table-column>
      <el-table-column align="left" :key="item.title" v-for="item,index in tableTitleList" :label="item.title" :prop="item.value" :width="item.width">
        <template slot-scope="scope" >
          <el-input class="el-table-input" v-if="isNoCaseOfficial&&item.value==='agentNum'" @change="changeAgentNum" v-model="scope.row[item.value]" placeholder="请输入内容"></el-input>
          <p v-else  style="margin: 0;cursor: pointer" @click="takeCaseDetail(scope.row)">{{scope.row[item.value]}}</p>
        </template>
      </el-table-column>
      <!--<el-table-column label="操作"  align="left">-->
        <!--<template slot-scope="{row}">-->
          <!--<el-button type="text" size="small" @click="editdetailOfficial(row)">编辑</el-button>-->
        <!--</template>-->
      <!--</el-table-column>-->
    </el-table>
    <template v-if="queryInfo.pageType!='4'">
      <el-form  ref="submission" :model="submitData" :rules="rules" label-width="206px" >
        <el-row>
          <el-form-item label="官文类型:" >
            <el-select  default-first-option v-model="submitData.materialTypeId" placeholder="请选择" filterable
                        :disabled="queryInfo.pageId==105" @change="handleChangeTypeName" >
              <el-option
                v-for="item in typeNameList"
                :key="item.materialTypeId"
                :label="item.typeName"
                :value="item.materialTypeId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="官文名称:" >
            <el-input v-model="submitData.docName" placeholder="请输入内容"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="发文日期:" >
            <el-date-picker
              v-model="submitData.docDate"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="收文日期:"  prop="recvDate" class="small-el-form-item-prev">
            <el-date-picker
              v-model="submitData.recvDate"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item v-if="typeName != '注册证'" label="发文编号:" class="small-el-form-item">
            <el-input v-model="submitData.docNumber" placeholder="请输入内容"></el-input>
          </el-form-item>

          <el-form-item label="转寄日期:"  :class="typeName != '注册证' ? 'small-el-form-item' : ''" >
            <el-date-picker
              v-model="submitData.sendDate"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </el-row>
        <el-row v-if="['证据交换通知', '证据再交换通知', '异议答辩通知', '无效宣告答辩通知', '提供商标使用证据通知', '撤销复审答辩通知', '参加不予注册复审通知'].includes(typeName)">
          <el-form-item label="绑定码:" >
            <el-input v-model="submitData.bindingCode" placeholder="请输入内容"></el-input>
          </el-form-item>
        </el-row>
        <el-row >
          <el-form-item label="邮寄方式:" >
            <el-select v-model="submitData.mailingType" placeholder="请选择"   filterable
                       clearable>
              <el-option
                v-for="item in mailingTypeList"
                :key="item.mailingType"
                :label="item.typeName"
                :value="item.mailingType">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="挂号号码:" :class="typeName==='补正通知'?'small-el-form-item-prev':''">
            <el-input v-model="submitData.registNum" placeholder="请输入内容"></el-input>
          </el-form-item>
        </el-row>
        <el-row v-if="submitData.tmCaseList.length&&submitData.tmCaseList.length==1&&typeName==='不予通知书'">
          <el-form-item label="申请日:" >
            <el-date-picker
              v-model="submitData.tmCaseList[0].appDate"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </el-row>
        <el-row v-if="submitData.tmCaseList.length&&submitData.tmCaseList.length==1&&(typeName==='受理通知'||typeName==='缴费通知书')">
          <el-form-item label="申请日:" >
            <el-date-picker
              v-model="submitData.tmCaseList[0].appDate"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="申请号:" >
            <el-input v-model="submitData.tmCaseList[0].appNumber" placeholder="请输入申请号" @change="(e)=>getDocNumber(e, caseData[0].caseId)"></el-input>
          </el-form-item>
        </el-row>
        <el-row v-if="submitData.tmCaseList.length&&submitData.tmCaseList.length==1&&typeName==='补正通知'" >
          <el-form-item label="申请号:" class="small-el-form-item">
            <el-input v-model="submitData.tmCaseList[0].appNumber" placeholder="请输入申请号" @change="(e)=>getDocNumber(e, caseData[0].caseId)"></el-input>
          </el-form-item>
        </el-row>
        <el-row v-if="submitData.tmCaseList.length&&submitData.tmCaseList.length==1&&typeName==='注册证'">
          <el-form-item label="注册号:" >
            <el-input v-model="submitData.tmCaseList[0].regNumber" placeholder="注册号"></el-input>
          </el-form-item>
          <el-form-item label="注册期号:" >
            <el-input v-model="submitData.tmCaseList[0].regNoticeNumber" placeholder="注册期号"></el-input>
          </el-form-item>
        </el-row>
        <el-row v-if="['注册证'].includes(typeName) && caseData[0] && caseData[0].madrid">
          <el-form-item label="指定国注册号:" class="small-el-form-item">
            <el-input v-model="commonForm.zdRegNumber" :placeholder="defaulPlaceholdertValue('zdRegNumber', '请输入指定国注册号')"></el-input>
          </el-form-item>
          <el-form-item label="指定国注册日:" class="small-el-form-item" >
            <el-date-picker
                v-model="commonForm.zdRegDate"
                type="date"
                :placeholder="defaulPlaceholdertValue('zdRegDate', '选择日期')"
                value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </el-row>
        <el-row v-if="submitData.tmCaseList.length&&submitData.tmCaseList.length==1&&(typeName==='核准证明'||typeName==='核准通知书')">
          <el-form-item label="申请日期:" >
            <el-date-picker
              v-model="submitData.tmCaseList[0].appDate"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="申请号:" >
            <el-input v-model="submitData.tmCaseList[0].appNumber" placeholder="请输入申请号" @change="(e)=>getDocNumber(e, caseData[0].caseId)"></el-input>
          </el-form-item>
        </el-row>
        <el-row v-if="submitData.tmCaseList.length&&submitData.tmCaseList.length==1&&(typeName==='核准证明'||typeName==='注册证')">
          <el-form-item label="注册日期:" >
            <el-date-picker
              v-model="submitData.tmCaseList[0].regDate"
              type="date"
              placeholder="选择日期"
              @change="$set(submitData.tmCaseList[0], 'validStartDate', submitData.tmCaseList[0].regDate);$set(submitData.tmCaseList[0], 'validEndDate', validEndDate(submitData.tmCaseList[0].validStartDate))"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </el-row>
        <el-row v-if="submitData.tmCaseList.length&&submitData.tmCaseList.length==1&&(typeName==='核准证明'||typeName==='注册证')" class="small-el-form-item">
          <el-form-item label="有效起日:" >
            <el-date-picker
              v-model="submitData.tmCaseList[0].validStartDate"
              type="date"
              placeholder="选择日期"
              @change="$set(submitData.tmCaseList[0], 'validEndDate', validEndDate(submitData.tmCaseList[0].validStartDate))"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="有效止日:">
              <el-date-picker
                v-model="submitData.tmCaseList[0].validEndDate"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="是否审核:" >
            <el-radio v-model="submitData.audit" label="0">否</el-radio>
            <el-radio v-model="submitData.audit" label="1">是</el-radio>
          </el-form-item>
          <el-form-item label="审查员:" >
            <el-input v-model="submitData.examiner" placeholder="请输入审查员"></el-input>
          </el-form-item>
        </el-row>
        <el-row v-if="(typeName === '驳回通知' || typeName === '部分驳回通知') && submitData.autowriteStatus">
          <el-form-item label="撰写状态:" >
            {{ submitData.autowriteStatus }}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="纸件/电子:" >
            <el-radio-group v-model="submitData.paperofficial" @change="changePaperofficial">
              <el-radio :label="false">电子</el-radio>
              <el-radio :label="true">纸件</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-row>
        <el-row v-if="typeName === '同日申请补送证据'">
          <el-form-item label="补送证据内容:">
            <el-input :autosize="{ minRows: 2, maxRows: 4}" type="textarea" v-model="submitData.buzhengContent" placeholder="请输入补送证据内容"></el-input>
          </el-form-item>
        </el-row>
        <el-row v-if="typeName==='不予核准通知'">
          <el-form-item label="不予核准内容:">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              placeholder="请输入内容"
              v-model="submitData.buzhengContent"
            >
            </el-input>
          </el-form-item>
        </el-row>
        <el-row v-if="typeName==='不予受理通知'">
          <el-form-item label="不予受理内容:">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              placeholder="请输入内容"
              v-model="submitData.buzhengContent"
            >
            </el-input>
          </el-form-item>
        </el-row>
        <el-row v-if="typeName==='补正通知'">
          <el-form-item label="补正内容:">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              placeholder="请输入内容"
              v-model="submitData.buzhengContent"
            >
            </el-input>
          </el-form-item>
        </el-row>
        <el-row v-if="typeName==='评审意见书'">
          <el-form-item label="评审意见内容:">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              placeholder="请输入内容"
              v-model="submitData.buzhengContent"
            >
            </el-input>
          </el-form-item>
        </el-row>
        <el-row v-if="typeName === '审查意见'">
          <el-form-item label="审查意见内容:">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              placeholder="请输入内容"
              v-model="submitData.buzhengContent"
            >
            </el-input>
          </el-form-item>
        </el-row>
        <el-row v-if="submitData.tmCaseList.length&&submitData.tmCaseList.length==1&&typeName==='终止审查'" >
          <el-form-item label="申请号:">
            <el-input v-model="submitData.tmCaseList[0].appNumber" placeholder="请输入申请号" @change="(e)=>getDocNumber(e, caseData[0].caseId)"></el-input>
          </el-form-item>
        </el-row>
<!--        <el-row v-if="typeName === '审查意见'">-->
<!--          <el-form-item label="审查意见内容:">-->
<!--            <el-input-->
<!--              type="textarea"-->
<!--              :autosize="{ minRows: 2, maxRows: 4}"-->
<!--              placeholder="请输入内容"-->
<!--              v-model="submitData.reviewComment"-->
<!--            >-->
<!--            </el-input>-->
<!--          </el-form-item>-->
<!--        </el-row>-->
        <el-row>
          <el-col :span="12"><el-form-item label="客户:">
            <el-select v-model="submitData.custId" reserve-keyword  filterable remote clearable  placeholder="请输入关键词" :remote-method="remoteMethod">
              <el-option v-for="itm in custList" :key="itm.value" :label="itm.label" :value="itm.value">
              </el-option>
            </el-select>
          </el-form-item></el-col>
          <el-col :span="12"><el-form-item label="客户组:">
            <el-select :clearable="true"
                       default-first-option filterable placeholder=""
                       v-model="submitData.wkgId">
              <el-option :key="key" :label="item.groupName" :value="item.wkgId"
                         v-for="(item,key) in custGroup"/>
            </el-select>
          </el-form-item></el-col>
        </el-row>
        <el-row>
          <el-form-item label="备注:">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              placeholder="请输入内容"
              v-model="submitData.memo"
            >
            </el-input>
          </el-form-item>
        </el-row>
        <!--<el-row v-if="caseData.length>1">-->
        <!--<el-form-item label="邮寄:">-->
        <!--<el-table-->
        <!--:data="submitData.tmCaseList"-->
        <!--border-->
        <!--style="width: auto;margin: 15px">-->
        <!--<el-table-column type="index" width="60" label="序号" align="left">-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
        <!--prop="agentNum"-->
        <!--align="left"-->
        <!--label="案件文号"-->
        <!--&gt;-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
        <!--prop="mailingType"-->
        <!--align="left"-->
        <!--label="邮寄方式"-->
        <!--&gt;-->
        <!--<template slot-scope="scope">-->
        <!--<el-select  default-first-option v-model="submitData.tmCaseList[scope.$index].mailingType" placeholder="请选择"  filterable-->
        <!--clearable>-->
        <!--<el-option-->
        <!--v-for="item in mailingTypeList"-->
        <!--:key="item.mailingType"-->
        <!--:label="item.typeName"-->
        <!--:value="item.mailingType">-->
        <!--</el-option>-->
        <!--</el-select>-->
        <!--</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
        <!--prop="agentNum"-->
        <!--align="left"-->
        <!--label="挂号号码"-->
        <!--&gt;-->
        <!--<template slot-scope="scope">-->
        <!--<el-input v-model="submitData.tmCaseList[scope.$index].registNum" placeholder="请输入挂号号码"></el-input>-->
        <!--</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
        <!--prop="agentNum"-->
        <!--align="left"-->
        <!--label="转寄日期"-->
        <!--&gt;-->
        <!--<template slot-scope="scope">-->
        <!--<el-date-picker-->
        <!--v-model="submitData.tmCaseList[scope.$index].sendDate"-->
        <!--type="date"-->
        <!--placeholder="选择日期"-->
        <!--value-format="yyyy-MM-dd">-->
        <!--</el-date-picker>-->
        <!--</template>-->
        <!--</el-table-column>-->
        <!--</el-table>-->
        <!--</el-form-item>-->
        <!--</el-row>-->
        <el-row >
          <el-form-item label="上传文件:">
            <el-upload
              ref="upload"
              class="upload-demo"
              drag
              multiple
              name="attachFile"
              :data="getUploadData()"
              :action="creatematerial"
              :file-list="materialArray"
              :on-remove="(file,fileList)=>{ handleRemove(file,fileList,submitData.tmCaseList.map(item=>item.caseId))}"
              :on-preview="onPreview"
              :on-success="onsuccess"
              :before-upload="beforeUpload"
              :limit="typeName==='报官清单回执'?1:9999">
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            </el-upload>
          </el-form-item>
        </el-row>
        <!--<el-table-->
        <!--:data="uploadTable"-->
        <!--border-->
        <!--style="width: auto;margin: 15px">-->
        <!--<el-table-column type="index" width="60" label="序号" align="left">-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
        <!--prop="agentNum"-->
        <!--align="left"-->
        <!--label="案件文号"-->
        <!--width="180">-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
        <!--align="left"-->
        <!--prop="materialArray"-->
        <!--label="官文名称">-->
        <!--<template slot-scope="scope">-->
        <!--<el-upload-->
        <!--class="upload-demo"-->
        <!--drag-->
        <!--name="attachFile"-->
        <!--:data="getUploadData([scope.row.caseId])"-->
        <!--:action="creatematerial"-->
        <!--:file-list="scope.row.materialArray"-->
        <!--:on-remove="(file,fileList)=>{ handleRemove(file,fileList,scope.row.caseId)}"-->
        <!--:on-preview="onPreview"-->
        <!--:on-success="onsuccess"-->
        <!--:before-upload="beforeUpload"-->
        <!--multiple>-->
        <!--<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>-->
        <!--</el-upload>-->
        <!--</template>-->
        <!--</el-table-column>-->
        <!--</el-table>-->
        <!--<el-tabs   v-if="caseData.length>1" type="border-card" :before-leave="beforeLeave" :stretch="true">-->
        <!--<el-tab-pane label="为多个案件上传同一份文件">-->
        <!--<el-upload-->
        <!--class="upload-demo1"-->
        <!--drag-->
        <!--:data="getUploadData(caseData.map(item=>item.caseId))"-->
        <!--:action="creatematerial"-->
        <!--:on-remove="handleRemove1"-->
        <!--:on-preview="onPreview"-->
        <!--:on-success="onsuccess"-->
        <!--name="attachFile"-->
        <!--:before-upload="beforeUpload"-->
        <!--:file-list="materialArrayList"-->
        <!--multiple>-->
        <!--<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>-->
        <!--</el-upload>-->
        <!--</el-tab-pane>-->
        <!--<el-tab-pane   label="多个案件上传不同的文件">-->
        <!--<el-table-->
        <!--:data="uploadTable"-->
        <!--border-->
        <!--style="width: 100%">-->
        <!--<el-table-column type="index" width="60" label="序号" align="left">-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
        <!--prop="agentNum"-->
        <!--align="left"-->
        <!--label="案件文号"-->
        <!--width="180">-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
        <!--align="left"-->
        <!--prop="materialArray"-->
        <!--label="官文名称">-->
        <!--<template slot-scope="scope">-->
        <!--<el-upload-->
        <!--class="upload-demo"-->
        <!--drag-->
        <!--name="attachFile"-->
        <!--:data="getUploadData([scope.row.caseId])"-->
        <!--:action="creatematerial"-->
        <!--:file-list="scope.row.materialArray"-->
        <!--:on-remove="(file,fileList)=>{ handleRemove(file,fileList,scope.row.caseId)}"-->
        <!--:on-preview="onPreview"-->
        <!--:on-success="onsuccess"-->
        <!--:before-upload="beforeUpload"-->
        <!--multiple>-->
        <!--<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>-->
        <!--</el-upload>-->
        <!--</template>-->
        <!--</el-table-column>-->
        <!--</el-table>-->
        <!--</el-tab-pane>-->
        <!--</el-tabs>-->
        <!--</el-form-item>-->
        <!--</el-row>-->
        <el-row v-if="submitData.tmCaseList.length&&submitData.tmCaseList.length==1&&typeName==='初步审定公告'">
          <el-form-item label="初步审定公告日期:">
            <el-date-picker
              v-model="submitData.tmCaseList[0].approvalDate"
              type="date"
              placeholder="选择日期"
              @change="(e)=>getApprovalNumber(e,0)"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="初步审定公告期号:" >
            <el-input v-model="submitData.tmCaseList[0].approvalNumber" placeholder="初步审定公告期号"></el-input>
          </el-form-item>
        </el-row>
        <el-row v-if="submitData.tmCaseList.length&&submitData.tmCaseList.length==1&&typeName==='初步审定公告'">
          <el-form-item label="初步审定公告号:" >
            <el-input v-model="submitData.tmCaseList[0].approvalNo" placeholder="初步审定公告号"></el-input>
          </el-form-item>
          <el-form-item label="异议截止日:" v-if="['内-外','外-外'].includes(caseData[0].appFromto)">
            <el-date-picker
              v-model="submitData.tmCaseList[0].objectionDate"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="异议截止日:" v-else>
            <el-date-picker
              v-if="submitData.tmCaseList[0].objectionDate"
              v-model="submitData.tmCaseList[0].objectionDate"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd">
            </el-date-picker>
            <span v-else>{{submitData.tmCaseList[0].approvalDate | objectionDate}}</span>
          </el-form-item>
        </el-row>
        <template style="width: 100%;" v-if="caseData.length>1&&(typeName==='注册证'||typeName==='核准证明'||typeName==='核准通知书'||typeName==='初步审定公告'||typeName==='受理通知'||typeName==='缴费通知书'||typeName==='补正通知'||typeName==='不予通知书')">
          <el-row v-if="(typeName==='受理通知'||typeName==='缴费通知书'||typeName==='不予通知书')">
            <el-col :span="12">
              <el-form-item label="申请日:">
                  <el-date-picker
                    v-model="commonForm.appDate"
                    type="date"
                    :placeholder="defaulPlaceholdertValue('appDate', '选择日期')"
                    value-format="yyyy-MM-dd">
                  </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="申请号:">
                <el-input v-model="commonForm.appNumber" :placeholder="defaulPlaceholdertValue('appNumber', '请输入申请号')"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="typeName==='初步审定公告'">
            <el-col :span="12">
              <el-form-item label="初步审定公告日期:">
                <el-date-picker
                  v-model="commonForm.approvalDate"
                  type="date"
                  :placeholder="defaulPlaceholdertValue('approvalDate', '选择日期')"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="初步审定公告期号:">
                <el-input v-model="commonForm.approvalNumber" :placeholder="defaulPlaceholdertValue('approvalNumber', '初步审定公告期号')"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="submitData.tmCaseList.length&&typeName==='初步审定公告'">
            <el-col :span="12">
              <el-form-item label="初步审定公告号:">
                <el-input v-model="commonForm.approvalNo" :placeholder="defaulPlaceholdertValue('approvalNo', '初步审定公告号')"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="异议截止日:" v-if="['内-外','外-外'].includes(caseData[0].appFromto)">
                <el-date-picker
                  v-model="commonForm.objectionDate"
                  type="date"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="异议截止日:" v-else>
                {{defaulPlaceholdertValue('approvalDate', '')}}
<!--                {{commonForm.approvalDate | objectionDate}}-->
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="typeName==='注册证'">
            <el-col :span="12">
              <el-form-item label="注册期号:">
                <el-input v-model="commonForm.regNoticeNumber" :placeholder="defaulPlaceholdertValue('regNoticeNumber', '请输入注册期号')"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="注册号:">
                <el-input v-model="commonForm.regNumber" :placeholder="defaulPlaceholdertValue('regNumber', '请输入注册号')"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="typeName==='核准证明'||typeName==='核准通知书'">
            <el-col :span="12">
              <el-form-item label="申请号">
                <el-input v-model="commonForm.appNumber" :placeholder="defaulPlaceholdertValue('appNumber', '请输入申请号')"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="申请日期">
                <el-date-picker
                    v-model="commonForm.appDate"
                    type="date"
                    :placeholder="defaulPlaceholdertValue('appDate', '选择日期')"
                    value-format="yyyy-MM-dd">
                  </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="typeName==='注册证'||typeName==='核准证明'">
            <el-col :span="24">
              <el-form-item label="注册日期:">
                <el-date-picker
                    v-model="commonForm.regDate"
                    type="date"
                    @change="$set(commonForm, 'validStartDate', commonForm.regDate);$set(commonForm, 'validEndDate', validEndDate(commonForm.validStartDate))"
                    :placeholder="defaulPlaceholdertValue('regDate', '选择日期')"
                    value-format="yyyy-MM-dd">
                  </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="typeName==='注册证'||typeName==='核准证明'">
            <el-col :span="12">
              <el-form-item label="有效起日:">
                <el-date-picker
                    v-model="commonForm.validStartDate"
                    type="date"
                    :placeholder="defaulPlaceholdertValue('validStartDate', '选择日期')"
                    @change="$set(commonForm, 'validEndDate', validEndDate(commonForm.validStartDate))"
                    value-format="yyyy-MM-dd">
                  </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="有效止日:">
                <el-date-picker
                    v-model="commonForm.validEndDate"
                    type="date"
                    :placeholder="defaulPlaceholdertValue('validEndDate', '选择日期')"
                    value-format="yyyy-MM-dd">
                  </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
<!--          <el-form-item label="更多1:" >-->
<!--            <el-table-->
<!--              :data="submitData.tmCaseList"-->
<!--              border-->
<!--              style="width: auto;margin: 15px">-->
<!--              <el-table-column type="index" width="50" label="序号" align="left">-->
<!--              </el-table-column>-->
<!--              <el-table-column-->
<!--                prop="mailingType"-->
<!--                align="left"-->
<!--                label="申请日"-->
<!--                v-if="(typeName==='受理通知'||typeName==='缴费通知书'||typeName==='不予通知书')"-->
<!--              >-->
<!--                <template slot-scope="scope">-->
<!--                  <el-date-picker-->
<!--                    v-model="submitData.tmCaseList[scope.$index].appDate"-->
<!--                    type="date"-->
<!--                    placeholder="选择日期"-->
<!--                    value-format="yyyy-MM-dd">-->
<!--                  </el-date-picker>-->
<!--                </template>-->
<!--              </el-table-column>-->
<!--              <el-table-column-->
<!--                prop="regNumber"-->
<!--                align="left"-->
<!--                label="申请号"-->
<!--                v-if="typeName==='受理通知'||typeName==='补正通知'||typeName=='缴费通知书'"-->
<!--              >-->
<!--                <template slot-scope="scope">-->
<!--                  <el-input v-model="submitData.tmCaseList[scope.$index].appNumber" placeholder="请输入申请号" @change="(e)=>getDocNumber(e, caseData[scope.$index].caseId)"></el-input>-->
<!--                </template>-->
<!--              </el-table-column>-->
<!--              <el-table-column-->
<!--                prop="approvalDate"-->
<!--                align="left"-->
<!--                label="初步审定公告日期"-->
<!--                v-if="typeName==='初步审定公告'"-->
<!--              >-->
<!--                <template slot-scope="scope">-->
<!--                  <el-date-picker-->
<!--                    v-model="submitData.tmCaseList[scope.$index].approvalDate"-->
<!--                    type="date"-->
<!--                    @change="(e)=>getApprovalNumber(e,scope.$index)"-->
<!--                    placeholder="选择日期"-->
<!--                    value-format="yyyy-MM-dd">-->
<!--                  </el-date-picker>-->
<!--                </template>-->
<!--              </el-table-column>-->
<!--              <el-table-column-->
<!--                prop="approvalNumber"-->
<!--                align="left"-->
<!--                label="初步审定公告期号"-->
<!--                v-if="typeName==='初步审定公告'"-->
<!--              >-->
<!--                <template slot-scope="scope">-->
<!--                  <el-input v-model="submitData.tmCaseList[scope.$index].approvalNumber" placeholder="初步审定公告期号"></el-input>-->
<!--                </template>-->
<!--              </el-table-column>-->
<!--              <el-table-column-->
<!--                prop="approvalNo"-->
<!--                align="left"-->
<!--                label="初步审定公告号"-->
<!--                v-if="typeName==='初步审定公告'"-->
<!--              >-->
<!--                <template slot-scope="scope">-->
<!--                  <el-input v-model="submitData.tmCaseList[scope.$index].approvalNo" placeholder="初步审定公告号"></el-input>-->
<!--                </template>-->
<!--              </el-table-column>-->
<!--              <el-table-column-->
<!--                prop="approvalNo"-->
<!--                align="left"-->
<!--                label="异议截止日"-->
<!--                v-if="typeName==='初步审定公告'"-->
<!--              >-->
<!--                <template slot-scope="scope">-->
<!--                  <el-date-picker-->
<!--                    v-if="submitData.tmCaseList[scope.$index].objectionDate"-->
<!--                    v-model="submitData.tmCaseList[scope.$index].objectionDate"-->
<!--                    type="date"-->
<!--                    placeholder="选择日期"-->
<!--                    value-format="yyyy-MM-dd">-->
<!--                  </el-date-picker>-->
<!--                  <span v-else>-->
<!--                      {{submitData.tmCaseList[scope.$index].approvalDate | objectionDate}}-->
<!--                  </span>-->
<!--                </template>-->
<!--              </el-table-column>-->

<!--              <el-table-column-->
<!--                prop="regDate"-->
<!--                align="left"-->
<!--                label="注册日期"-->
<!--                v-if="typeName==='注册证'"-->
<!--              >-->
<!--                <template slot-scope="scope">-->
<!--                  <el-date-picker-->
<!--                    v-model="submitData.tmCaseList[scope.$index].regDate"-->
<!--                    type="date"-->
<!--                    placeholder="选择日期"-->
<!--                    value-format="yyyy-MM-dd">-->
<!--                  </el-date-picker>-->
<!--                </template>-->
<!--              </el-table-column>-->

<!--              <el-table-column-->
<!--                prop="regNoticeNumber"-->
<!--                align="left"-->
<!--                label="注册期号"-->
<!--                v-if="typeName==='注册证'"-->
<!--              >-->
<!--                <template slot-scope="scope">-->
<!--                  <el-input v-model="submitData.tmCaseList[scope.$index].regNoticeNumber" placeholder="注册期号"></el-input>-->
<!--                </template>-->
<!--              </el-table-column>-->
<!--              <el-table-column-->
<!--                prop="regNumber"-->
<!--                align="left"-->
<!--                label="注册号"-->
<!--                v-if="typeName==='注册证'"-->
<!--              >-->
<!--                <template slot-scope="scope">-->
<!--                  <el-input v-model="submitData.tmCaseList[scope.$index].regNumber" placeholder="请输入注册号"></el-input>-->
<!--                </template>-->
<!--              </el-table-column>-->
<!--              <el-table-column-->
<!--                prop="regNumber"-->
<!--                align="left"-->
<!--                label="申请号"-->
<!--                v-if="typeName==='核准证明'||typeName==='核准通知书'"-->
<!--              >-->
<!--                <template slot-scope="scope">-->
<!--                  <el-input v-model="submitData.tmCaseList[scope.$index].appNumber" placeholder="请输入申请号" @change="(e)=>getDocNumber(e, caseData[scope.$index].caseId)"></el-input>-->
<!--                </template>-->
<!--              </el-table-column>-->
<!--              <el-table-column-->
<!--                prop="approvalNumber"-->
<!--                align="left"-->
<!--                label="申请日期"-->
<!--                v-if="typeName==='核准通知书'||typeName==='核准证明'"-->
<!--              >-->
<!--                <template slot-scope="scope">-->
<!--                  <el-date-picker-->
<!--                    v-model="submitData.tmCaseList[scope.$index].appDate"-->
<!--                    type="date"-->
<!--                    placeholder="选择日期"-->
<!--                    value-format="yyyy-MM-dd">-->
<!--                  </el-date-picker>-->
<!--                </template>-->
<!--              </el-table-column>-->
<!--              <el-table-column-->
<!--                prop="approvalNumber"-->
<!--                align="left"-->
<!--                label="注册日期"-->
<!--                v-if="typeName==='注册证'||typeName==='核准证明'"-->
<!--              >-->
<!--                <template slot-scope="scope">-->
<!--                  <el-date-picker-->
<!--                    v-model="submitData.tmCaseList[scope.$index].regDate"-->
<!--                    type="date"-->
<!--                    @change="$set(submitData.tmCaseList[scope.$index], 'validStartDate', submitData.tmCaseList[scope.$index].regDate);$set(submitData.tmCaseList[scope.$index], 'validEndDate', validEndDate(submitData.tmCaseList[scope.$index].validStartDate))"-->
<!--                    placeholder="选择日期"-->
<!--                    value-format="yyyy-MM-dd">-->
<!--                  </el-date-picker>-->
<!--                </template>-->
<!--              </el-table-column>-->
<!--              <el-table-column-->
<!--                prop="approvalNumber"-->
<!--                align="left"-->
<!--                label="有效起日"-->
<!--                v-if="typeName==='注册证'||typeName==='核准证明'"-->
<!--              >-->
<!--                <template slot-scope="scope">-->
<!--                  <el-date-picker-->
<!--                    v-model="submitData.tmCaseList[scope.$index].validStartDate"-->
<!--                    type="date"-->
<!--                    placeholder="选择日期"-->
<!--                    @change="$set(submitData.tmCaseList[scope.$index], 'validEndDate', validEndDate(submitData.tmCaseList[scope.$index].validStartDate))"-->
<!--                    value-format="yyyy-MM-dd">-->
<!--                  </el-date-picker>-->
<!--                </template>-->
<!--              </el-table-column>-->
<!--              <el-table-column-->
<!--                prop="regNoticeNumber"-->
<!--                align="left"-->
<!--                label="有效止日"-->
<!--                v-if="typeName==='注册证'||typeName==='核准证明'"-->
<!--              >-->
<!--                <template slot-scope="scope">-->
<!--                  <el-date-picker-->
<!--                    v-model="submitData.tmCaseList[scope.$index].validEndDate"-->
<!--                    type="date"-->
<!--                    placeholder="选择日期"-->
<!--                    value-format="yyyy-MM-dd">-->
<!--                  </el-date-picker>-->
<!--                </template>-->
<!--              </el-table-column>-->
<!--            </el-table>-->
<!--          </el-form-item>-->
        </template>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeThisPage()">返回</el-button>
        <el-button type="primary" @click="typeInOfficalDoc" v-if="queryInfo.pageType==='1'">提交</el-button>
        <el-button class="exactButton" type="primary" @click="auditOfficalDoc" v-if="queryInfo.pageType==='2'">审核</el-button>
        <el-button class="exactButton" type="primary" @click="modifyOfficalDoc" v-if="queryInfo.pageType==='3'">修改</el-button>
        <el-button v-if="(typeName === '驳回通知' || typeName === '部分驳回通知') && this.$store.getters.permissions.includes(509)" type="primary" @click="generateRejectReport">生成驳回报告</el-button>
       </span>
    </template>
    <template v-if="queryInfo.pageType=='4'">
      <el-form  ref="submission"  label-width="206px" >
        <el-row>
          <el-form-item label="官文类型:" >
            {{transformation(typeNameList,submitData.materialTypeId,'materialTypeId','typeName')}}
          </el-form-item>
          <el-form-item label="官文名称:" >
            {{submitData.docName}}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="发文日期:" >
           {{submitData.docDate}}
          </el-form-item>
          <el-form-item label="收文日期:"  class="small-el-form-item-prev">
           {{submitData.recvDate}}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item v-if="typeName != '注册证'" label="发文编号:" class="small-el-form-item">
           {{submitData.docNumber}}
          </el-form-item>

          <el-form-item label="转寄日期:"  :class="typeName != '注册证' ? 'small-el-form-item' : ''" >
           {{submitData.sendDate}}
          </el-form-item>
        </el-row>
        <el-row v-if="['证据交换通知', '证据再交换通知', '异议答辩通知', '无效宣告答辩通知', '提供商标使用证据通知', '撤销复审答辩通知', '参加不予注册复审通知'].includes(typeName)">
          <el-form-item label="绑定码:" >
            {{submitData.bindingCode}}
          </el-form-item>
        </el-row>
        <el-row >
          <el-form-item label="邮寄方式:" >
            {{transformation(mailingTypeList,submitData.mailingType,'mailingType','typeName')}}
          </el-form-item>
          <el-form-item label="挂号号码:" :class="typeName==='补正通知'?'small-el-form-item-prev':''">
            {{submitData.registNum}}
          </el-form-item>
        </el-row>
        <el-row v-if="submitData.tmCaseList.length&&submitData.tmCaseList.length==1&&typeName==='不予通知书'">
          <el-form-item label="申请日:" >
            {{submitData.tmCaseList[0].appDate}}
          </el-form-item>
        </el-row>
        <el-row v-if="submitData.tmCaseList.length&&submitData.tmCaseList.length==1&&typeName==='受理通知'">
          <el-form-item label="申请日:" >
           {{submitData.tmCaseList[0].appDate}}
          </el-form-item>
          <el-form-item label="申请号:" >
            {{submitData.tmCaseList[0].appNumber}}
          </el-form-item>
        </el-row>
        <el-row v-if="submitData.tmCaseList.length&&submitData.tmCaseList.length==1&&typeName==='补正通知'" >
          <el-form-item label="申请号:" class="small-el-form-item">
           {{submitData.tmCaseList[0].appNumber}}
          </el-form-item>
        </el-row>
        <el-row v-if="submitData.tmCaseList.length&&submitData.tmCaseList.length==1&&typeName==='注册证'">
          <el-form-item label="注册号:" >
            {{submitData.tmCaseList[0].regNumber}}
          </el-form-item>
          <el-form-item label="注册期号:" >
            {{submitData.tmCaseList[0].regNoticeNumber}}
          </el-form-item>
        </el-row>
        <el-row v-if="['注册证'].includes(typeName) && caseData[0] && caseData[0].madrid">
          <el-form-item label="指定国注册号:" class="small-el-form-item">
            {{submitData.tmCaseList[0].zdRegNumber}}
          </el-form-item>
          <el-form-item label="指定国注册日:" class="small-el-form-item" >
            {{submitData.tmCaseList[0].zdRegDate}}
          </el-form-item>
        </el-row>
        <el-row v-if="submitData.tmCaseList.length&&submitData.tmCaseList.length==1&&typeName==='注册证'">
          <el-form-item label="有效起日:" >
            {{submitData.tmCaseList[0].validStartDate}}
          </el-form-item>
          <el-form-item label="有效止日:" >
            {{submitData.tmCaseList[0].validEndDate}}
          </el-form-item>
        </el-row>
        <el-row v-if="submitData.tmCaseList.length&&submitData.tmCaseList.length==1&&(typeName==='核准证明'||typeName==='核准通知书')">
          <el-form-item label="申请日期:" >
           {{submitData.tmCaseList[0].appDate}}
          </el-form-item>
          <el-form-item label="申请号:" >
            {{submitData.tmCaseList[0].appNumber}}
          </el-form-item>
        </el-row>
        <el-row v-if="submitData.tmCaseList.length&&submitData.tmCaseList.length==1&&(typeName==='核准证明')">
          <el-form-item label="注册日期:" >
            {{submitData.tmCaseList[0].regDate}}
          </el-form-item>
          <el-form-item label="有效起日:" >
            {{submitData.tmCaseList[0].validStartDate}}
          </el-form-item>
        </el-row>
        <el-row v-if="submitData.tmCaseList.length&&submitData.tmCaseList.length==1&&(typeName==='核准证明')" class="small-el-form-item">
          <el-form-item label="有效止日:" >
            {{submitData.tmCaseList[0].validEndDate}}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="是否审核:" >
            <span v-if="submitData.audit=='0'">否</span>
            <span v-if="submitData.audit=='1'">是</span>
          </el-form-item>
          <el-form-item label="审查员:" >
            {{submitData.examiner}}
          </el-form-item>
        </el-row>
        <el-row v-if="(typeName === '驳回通知' || typeName === '部分驳回通知') && submitData.autowriteStatus">
          <el-form-item label="撰写状态:" >
            {{ submitData.autowriteStatus }}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="纸件/电子:" >
            <span v-if="submitData.paperofficial==false">电子</span>
            <span v-if="submitData.paperofficial==true">纸件</span>
          </el-form-item>
        </el-row>
        <el-row v-if="typeName === '同日申请补送证据'">
          <el-form-item label="补送证据内容:">
            <span>{{submitData.buzhengContent}}</span>
          </el-form-item>
        </el-row>
        <el-row v-if="typeName==='不予核准通知'">
          <el-form-item label="不予核准内容:">
            {{submitData.buzhengContent}}
          </el-form-item>
        </el-row>
        <el-row v-if="typeName==='不予受理通知'">
          <el-form-item label="不予受理内容:">
            {{submitData.buzhengContent}}
          </el-form-item>
        </el-row>
        <el-row v-if="typeName==='补正通知'">
          <el-form-item label="补正内容:">
            {{submitData.buzhengContent}}
          </el-form-item>
        </el-row>
        <el-row v-if="typeName==='评审意见书'">
          <el-form-item label="评审意见内容:">
            {{submitData.buzhengContent}}
          </el-form-item>
        </el-row>
        <el-row v-if="typeName === '审查意见'">
          <el-form-item label="审查意见内容:">
            {{submitData.buzhengContent}}
          </el-form-item>
        </el-row>
        <el-row v-if="submitData.tmCaseList.length&&submitData.tmCaseList.length==1&&typeName==='终止审查'" >
          <el-form-item label="申请号:">
            {{submitData.tmCaseList[0].appNumber}}
          </el-form-item>
        </el-row>
<!--        <el-row v-if="typeName === '审查意见'">-->
<!--          <el-form-item label="审查意见内容:">-->
<!--            {{submitData.reviewComment}}-->
<!--          </el-form-item>-->
<!--        </el-row>-->
        <el-row>
          <el-col :span="12"><el-form-item label="客户:">
            <span>{{submitData.custName}}</span>
          </el-form-item></el-col>
          <el-col :span="12"><el-form-item label="客户组:">
            <span>{{submitData.groupName}}</span>
          </el-form-item></el-col>
        </el-row>
        <el-row>
          <el-form-item label="备注:">
            {{submitData.memo}}
          </el-form-item>
        </el-row>
        <!--<el-row v-if="caseData.length>1">-->
        <!--<el-form-item label="邮寄:">-->
        <!--<el-table-->
        <!--:data="submitData.tmCaseList"-->
        <!--border-->
        <!--style="width: auto;margin: 15px">-->
        <!--<el-table-column type="index" width="60" label="序号" align="left">-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
        <!--prop="agentNum"-->
        <!--align="left"-->
        <!--label="案件文号"-->
        <!--&gt;-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
        <!--prop="mailingType"-->
        <!--align="left"-->
        <!--label="邮寄方式"-->
        <!--&gt;-->
        <!--<template slot-scope="scope">-->
        <!--<el-select  default-first-option v-model="submitData.tmCaseList[scope.$index].mailingType" placeholder="请选择"  filterable-->
        <!--clearable>-->
        <!--<el-option-->
        <!--v-for="item in mailingTypeList"-->
        <!--:key="item.mailingType"-->
        <!--:label="item.typeName"-->
        <!--:value="item.mailingType">-->
        <!--</el-option>-->
        <!--</el-select>-->
        <!--</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
        <!--prop="agentNum"-->
        <!--align="left"-->
        <!--label="挂号号码"-->
        <!--&gt;-->
        <!--<template slot-scope="scope">-->
        <!--<el-input v-model="submitData.tmCaseList[scope.$index].registNum" placeholder="请输入挂号号码"></el-input>-->
        <!--</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
        <!--prop="agentNum"-->
        <!--align="left"-->
        <!--label="转寄日期"-->
        <!--&gt;-->
        <!--<template slot-scope="scope">-->
        <!--<el-date-picker-->
        <!--v-model="submitData.tmCaseList[scope.$index].sendDate"-->
        <!--type="date"-->
        <!--placeholder="选择日期"-->
        <!--value-format="yyyy-MM-dd">-->
        <!--</el-date-picker>-->
        <!--</template>-->
        <!--</el-table-column>-->
        <!--</el-table>-->
        <!--</el-form-item>-->
        <!--</el-row>-->
        <el-row>
          <el-form-item label="上传文件:">
            <p v-for="item in materialArray" style="color: #409EFF">
              <a  target="_blank" :href="`ipdoc${item.address}`">{{item.name}}</a>
            </p>
          </el-form-item>
        </el-row>
        <!--<el-table-->
        <!--:data="uploadTable"-->
        <!--border-->
        <!--style="width: auto;margin: 15px">-->
        <!--<el-table-column type="index" width="60" label="序号" align="left">-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
        <!--prop="agentNum"-->
        <!--align="left"-->
        <!--label="案件文号"-->
        <!--width="180">-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
        <!--align="left"-->
        <!--prop="materialArray"-->
        <!--label="官文名称">-->
        <!--<template slot-scope="scope">-->
        <!--<el-upload-->
        <!--class="upload-demo"-->
        <!--drag-->
        <!--name="attachFile"-->
        <!--:data="getUploadData([scope.row.caseId])"-->
        <!--:action="creatematerial"-->
        <!--:file-list="scope.row.materialArray"-->
        <!--:on-remove="(file,fileList)=>{ handleRemove(file,fileList,scope.row.caseId)}"-->
        <!--:on-preview="onPreview"-->
        <!--:on-success="onsuccess"-->
        <!--:before-upload="beforeUpload"-->
        <!--multiple>-->
        <!--<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>-->
        <!--</el-upload>-->
        <!--</template>-->
        <!--</el-table-column>-->
        <!--</el-table>-->
        <!--<el-tabs   v-if="caseData.length>1" type="border-card" :before-leave="beforeLeave" :stretch="true">-->
        <!--<el-tab-pane label="为多个案件上传同一份文件">-->
        <!--<el-upload-->
        <!--class="upload-demo1"-->
        <!--drag-->
        <!--:data="getUploadData(caseData.map(item=>item.caseId))"-->
        <!--:action="creatematerial"-->
        <!--:on-remove="handleRemove1"-->
        <!--:on-preview="onPreview"-->
        <!--:on-success="onsuccess"-->
        <!--name="attachFile"-->
        <!--:before-upload="beforeUpload"-->
        <!--:file-list="materialArrayList"-->
        <!--multiple>-->
        <!--<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>-->
        <!--</el-upload>-->
        <!--</el-tab-pane>-->
        <!--<el-tab-pane   label="多个案件上传不同的文件">-->
        <!--<el-table-->
        <!--:data="uploadTable"-->
        <!--border-->
        <!--style="width: 100%">-->
        <!--<el-table-column type="index" width="60" label="序号" align="left">-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
        <!--prop="agentNum"-->
        <!--align="left"-->
        <!--label="案件文号"-->
        <!--width="180">-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
        <!--align="left"-->
        <!--prop="materialArray"-->
        <!--label="官文名称">-->
        <!--<template slot-scope="scope">-->
        <!--<el-upload-->
        <!--class="upload-demo"-->
        <!--drag-->
        <!--name="attachFile"-->
        <!--:data="getUploadData([scope.row.caseId])"-->
        <!--:action="creatematerial"-->
        <!--:file-list="scope.row.materialArray"-->
        <!--:on-remove="(file,fileList)=>{ handleRemove(file,fileList,scope.row.caseId)}"-->
        <!--:on-preview="onPreview"-->
        <!--:on-success="onsuccess"-->
        <!--:before-upload="beforeUpload"-->
        <!--multiple>-->
        <!--<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>-->
        <!--</el-upload>-->
        <!--</template>-->
        <!--</el-table-column>-->
        <!--</el-table>-->
        <!--</el-tab-pane>-->
        <!--</el-tabs>-->
        <!--</el-form-item>-->
        <!--</el-row>-->
<!--        <el-row v-if="caseData.length>1&&(typeName==='注册证'||typeName==='核准证明'||typeName==='核准通知书'||typeName==='初步审定公告'||typeName==='受理通知'||typeName==='补正通知'||typeName==='不予通知书')">-->
<!--          <el-form-item label="更多:">-->
<!--            <el-table-->
<!--              :data="submitData.tmCaseList"-->
<!--              border-->
<!--              style="width: auto;margin: 15px">-->
<!--              <el-table-column type="index" width="50" label="序号" align="left">-->
<!--              </el-table-column>-->
<!--              <el-table-column-->
<!--                prop="agentNum"-->
<!--                align="left"-->
<!--                label="案件文号"-->
<!--                width="200"-->
<!--              >-->
<!--              </el-table-column>-->
<!--              <el-table-column-->
<!--                prop="mailingType"-->
<!--                align="left"-->
<!--                label="申请日"-->
<!--                v-if="typeName==='受理通知'||typeName==='不予通知书'"-->
<!--              >-->
<!--                <template slot-scope="scope">-->
<!--                  {{submitData.tmCaseList[scope.$index].appDate}}-->
<!--                </template>-->
<!--              </el-table-column>-->
<!--              <el-table-column-->
<!--                prop="regNumber"-->
<!--                align="left"-->
<!--                label="申请号"-->
<!--                v-if="typeName==='受理通知'||typeName==='补正通知'"-->
<!--              >-->
<!--                <template slot-scope="scope">-->
<!--                  {{submitData.tmCaseList[scope.$index].appNumber}}-->
<!--                </template>-->
<!--              </el-table-column>-->
<!--              <el-table-column-->
<!--                prop="approvalDate"-->
<!--                align="left"-->
<!--                label="初步审定公告日期"-->
<!--                v-if="typeName==='初步审定公告'"-->
<!--              >-->
<!--                <template slot-scope="scope">-->
<!--                 {{submitData.tmCaseList[scope.$index].approvalDate}}-->
<!--                </template>-->
<!--              </el-table-column>-->
<!--              <el-table-column-->
<!--                prop="approvalNumber"-->
<!--                align="left"-->
<!--                label="初步审定公告期号"-->
<!--                v-if="typeName==='初步审定公告'"-->
<!--              >-->
<!--                <template slot-scope="scope">-->
<!--                 {{submitData.tmCaseList[scope.$index].approvalNumber}}-->
<!--                </template>-->
<!--              </el-table-column>-->
<!--              <el-table-column-->
<!--                prop="approvalNo"-->
<!--                align="left"-->
<!--                label="初步审定公告号"-->
<!--                v-if="typeName==='初步审定公告'"-->
<!--              >-->
<!--                <template slot-scope="scope">-->
<!--                 {{submitData.tmCaseList[scope.$index].approvalNo}}-->
<!--                </template>-->
<!--              </el-table-column>-->
<!--              <el-table-column-->
<!--                prop="approvalNo"-->
<!--                align="left"-->
<!--                label="异议截止日"-->
<!--                v-if="typeName==='初步审定公告'"-->
<!--              >-->
<!--                <template slot-scope="scope">-->
<!--                  {{submitData.tmCaseList[scope.$index].objectionDate}}-->
<!--                </template>-->
<!--              </el-table-column>-->

<!--              <el-table-column-->
<!--                prop="regDate"-->
<!--                align="left"-->
<!--                label="注册日期"-->
<!--                v-if="typeName==='注册证'||typeName==='核准证明'"-->
<!--              >-->
<!--                <template slot-scope="scope">-->
<!--                  {{submitData.tmCaseList[scope.$index].regDate}}-->
<!--                </template>-->
<!--              </el-table-column>-->

<!--              <el-table-column-->
<!--                prop="regNoticeNumber"-->
<!--                align="left"-->
<!--                label="注册期号"-->
<!--                v-if="typeName==='注册证'"-->
<!--              >-->
<!--                <template slot-scope="scope">-->
<!--                  {{submitData.tmCaseList[scope.$index].regNoticeNumber}}-->
<!--                </template>-->
<!--              </el-table-column>-->
<!--              <el-table-column-->
<!--                prop="regNumber"-->
<!--                align="left"-->
<!--                label="注册号"-->
<!--                v-if="typeName==='注册证'"-->
<!--              >-->
<!--                <template slot-scope="scope">-->
<!--                  {{submitData.tmCaseList[scope.$index].regNumber}}-->
<!--                </template>-->
<!--              </el-table-column>-->
<!--              <el-table-column-->
<!--                prop="regNumber"-->
<!--                align="left"-->
<!--                label="申请号"-->
<!--                v-if="typeName==='核准证明'||typeName==='核准通知书'"-->
<!--              >-->
<!--                <template slot-scope="scope">-->
<!--                  {{submitData.tmCaseList[scope.$index].appNumber}}-->
<!--                </template>-->
<!--              </el-table-column>-->
<!--              <el-table-column-->
<!--                prop="approvalNumber"-->
<!--                align="left"-->
<!--                label="申请日期"-->
<!--                v-if="typeName==='核准证明'||typeName==='核准通知书'"-->
<!--              >-->
<!--                <template slot-scope="scope">-->
<!--                 {{submitData.tmCaseList[scope.$index].appDate}}-->
<!--                </template>-->
<!--              </el-table-column>-->
<!--              <el-table-column-->
<!--                prop="regDate"-->
<!--                align="left"-->
<!--                label="有效起日"-->
<!--                v-if="typeName==='注册证'||typeName==='核准证明'"-->
<!--              >-->
<!--                <template slot-scope="scope">-->
<!--                  {{submitData.tmCaseList[scope.$index].validStartDate}}-->
<!--                </template>-->
<!--              </el-table-column>-->
<!--              <el-table-column-->
<!--                prop="regNoticeNumber"-->
<!--                align="left"-->
<!--                label="有效止日"-->
<!--                v-if="typeName==='注册证'||typeName==='核准证明'"-->
<!--              >-->
<!--                <template slot-scope="scope">-->
<!--                  {{submitData.tmCaseList[scope.$index].validEndDate}}-->
<!--                </template>-->
<!--              </el-table-column>-->
<!--            </el-table>-->
<!--          </el-form-item>-->
<!--        </el-row>-->
        <el-row v-if="submitData.tmCaseList.length&&submitData.tmCaseList.length==1&&typeName==='初步审定公告'">
          <el-form-item label="初步审定公告日期:">
           {{submitData.tmCaseList[0].approvalDate}}
          </el-form-item>
          <el-form-item label="初步审定公告期号:" >
            {{submitData.tmCaseList[0].approvalNumber}}
          </el-form-item>
        </el-row>
        <el-row v-if="submitData.tmCaseList.length&&submitData.tmCaseList.length==1&&typeName==='初步审定公告'">
          <el-form-item label="初步审定公告号:" >
            {{submitData.tmCaseList[0].approvalNo}}
          </el-form-item>
          <el-form-item label="异议截止日:" >
            {{submitData.tmCaseList[0].objectionDate}}
          </el-form-item>
        </el-row>
        <template style="width: 100%;" v-if="caseData.length>1&&(typeName==='注册证'||typeName==='核准证明'||typeName==='核准通知书'||typeName==='初步审定公告'||typeName==='受理通知'||typeName==='缴费通知书'||typeName==='补正通知'||typeName==='不予通知书')">
          <el-row v-if="(typeName==='受理通知'||typeName==='缴费通知书'||typeName==='不予通知书')">
            <el-col :span="12">
              <el-form-item label="申请日:">
                {{defaulPlaceholdertValue('appDate', '')}}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="申请号:">
                {{defaulPlaceholdertValue('appNumber', '')}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="typeName==='初步审定公告'">
            <el-col :span="12">
              <el-form-item label="初步审定公告日期:">
                {{defaulPlaceholdertValue('approvalDate', '')}}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="初步审定公告期号:">
                {{defaulPlaceholdertValue('approvalNumber', '')}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="submitData.tmCaseList.length&&typeName==='初步审定公告'">
            <el-col :span="12">
              <el-form-item label="初步审定公告号:">
                {{defaulPlaceholdertValue('approvalNo', '')}}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="异议截止日:">
                <span v-if="['内-外','外-外'].includes(caseData[0].appFromto)">
                  {{defaulPlaceholdertValue('objectionDate', '')}}
                </span>
                <span>
                  {{defaulPlaceholdertValue('approvalDate', '') | objectionDate}}
                </span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="typeName==='注册证'">
            <el-col :span="12">
              <el-form-item label="注册期号:">
                {{defaulPlaceholdertValue('regNoticeNumber', '')}}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="注册号:">
                {{defaulPlaceholdertValue('regNumber', '')}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="typeName==='核准证明'||typeName==='核准通知书'">
            <el-col :span="12">
              <el-form-item label="申请号">
                {{defaulPlaceholdertValue('appNumber', '')}}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="申请日期">
                {{defaulPlaceholdertValue('appDate', '')}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="typeName==='注册证'||typeName==='核准证明'">
            <el-col :span="24">
              <el-form-item label="注册日期:">
                {{defaulPlaceholdertValue('regDate', '')}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="typeName==='注册证'||typeName==='核准证明'">
            <el-col :span="12">
              <el-form-item label="有效起日:">
                {{defaulPlaceholdertValue('validStartDate', '')}}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="有效止日:">
                {{defaulPlaceholdertValue('validEndDate', '')}}
              </el-form-item>
            </el-col>
          </el-row>
        </template>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeThisPage()">关 闭</el-button>
        <el-button v-if="(typeName === '驳回通知' || typeName === '部分驳回通知') && this.$store.getters.permissions.includes(509)" type="primary" @click="generateRejectReport">生成驳回报告</el-button>
       </span>
    </template>
    <el-dialog
      top="0"
      :visible.sync="poppingTimeLimitState"
      width="60%"
      :modal="false"
      :close-on-click-modal="false"
      :show-close="false"
      :close-on-press-escape="false"
      append-to-body
      :lock-scroll="false"
      title="创建时限"
      class="dialog——body——padding"
      v-dialogDrag
      center
    >
      <poppingTimeLimit v-if="poppingTimeLimitState" :officialCommunication="true"  @cancel="closePoppingTimeLimit" :list="caseDataList"></poppingTimeLimit>
    </el-dialog>
  </el-dialog>
</template>

<script>
  import {
    queryCaseWorkgroupUrl
  } from '@/api/caseDetail'
import {getTmDate, modifyOfficalDoc, queryAlltask,getCaseInfo, getDocNumber, typeInOfficalDoc, queryUserAll, delCaseMaterial, queryMaterialByCaseId, queryMaterialType,queryMailingType,auditOfficalDoc,queryDocs,modifyMaterialType,getApprovalNumber, queryCase, queryCustomerNameId} from '@/api/caseList.js'
import { creatematerial } from '@/api/ipServiceApi.config.js'
import { createRejectionDoc } from '@/api/rejectionNotice'
import permission from '../../../../store/modules/permission';

export default {
  components:{
    'poppingTimeLimit': (resolve, reject) => {
      require(['@/views/workbench/toDoTasks/poppingTimeLimit.vue'], resolve)
    },
  },
  props: ['dialogVisible', 'queryInfo','pageType','business','taskType'],
  name: "detailOfficial",
  data() {
    return {
      commonForm: {},
      custList: [],
      custGroup: [],
      backData: {},
      backCaseList: {},
      caseData: [],
      poppingTimeLimitState:false,
      caseDataList:[],
      submitData: {
        materialTypeId:localStorage.getItem('materialTypeId')?Number(localStorage.getItem('materialTypeId')):null,
        docName:null,
        docDate:'',
        recvDate:'',
        docNumber:'',
        memo:'',
        audit:'1',
        examiner:'',
        tmCaseList:[],
        objType:'2',
        sendDate:'',
        registNum:'',
        mailingType:'',
        paperofficial:true
      },
      tableTitleList:[{'title':'案件文号','value':'agentNum','width':'150'},{'title':'申请方向','value':'appFromto','width':'80'},{'title':'案件类型','value':'caseType','width':'80'},{'title':'商标名称','value':'tmName'},{'title':'权利号','value':'droitNumber','width':'95'},{'title':'商标类别','value':'goodClasses','width':'80'},{'title':'申请日期','value':'appDate'},{'title':'客户','value':'custName' },{'title':'申请人中文名称','value':'appCnName'},{'title':'阶段','value':'stageName','width':'80' }],
      materialArrayList:[],
      materialArray:[],
      uploadTable:[],
      userList:[],
      typeNameList:[],
      creatematerial,
      typeName:'',
      mailingTypeList:[],
      rules:{
        recvDate:[{
          required: true, message: "请选择收文日期", trigger: "change"
        }]
      },
      materialList:[],
      materialIdList:[],
      isNoCaseOfficial:false
    }
  },
  created(){
   // this.getTmDate()
   //  this.caseData = this.queryInfo.info
    this.initFun()
  },
  methods: {
    generateRejectReport(){
      const caseIds = this.submitData.tmCaseList.map(item => item.caseId).join(',')
      createRejectionDoc({caseIds:caseIds}).then((res)=>{
        if (res.success) {
          this.$message.success(res.message||'操作成功!')
        }
      })
    },
    defaulPlaceholdertValue(key, value) {
      const list = this.backCaseList.map(item => item[key]).filter(Boolean)
      if (list.length) {
        return [...new Set(list)].join(';')
      } else {
        return value
      }
    },
    remoteMethod(query){
      queryCustomerNameId({pageNo: 1, pageSize: 100, keyword: query}).then(res => {
        this.custList = res.data.map(item => ({
          value: item.custId,
          label: item.name
        }))
      })
    },
    async initFun(){
      if(this.queryInfo.info.map(item=>item.caseId)&&this.queryInfo.info.map(item=>item.caseId).length){
        let res = await queryCase({
          taskType: this.taskType,
          caseIds: this.queryInfo.info.map(item=>item.caseId)
        })
        this.caseData = res.data
        const showAppNumber = this.appNumberShowHandle(res.data)
        console.log(showAppNumber,'showAppNumber');
        if (showAppNumber) {
          //在tableTitleList中权利号后面添加申请号
          this.addAppNumberHandle()
        }
      }
      this.queryAlltask()
      this.queryUserAll()
      this.queryMailingType()
      this.queryInfo.pageType !== 4 && this.queryCaseWorkgroup()
    },
    appNumberShowHandle(list){
      //判断list中appNumber方向是否为"内外"、"外外"
      return  list.some(item=>item.appFromto=='内-外'||item.appFromto=='外-外')
    },
    addAppNumberHandle(){
      //添加申请号
      this.tableTitleList.splice(5,0,{title:'申请号',value:'appNumber',width:'95'})
    },
    queryCaseWorkgroup(){
      queryCaseWorkgroupUrl({ status: '1' }).then(res => {
          this.custGroup = res.data
        })
    },
    changeAgentNum(e) {
     let agentNum = this.caseData.reduce((pre,next)=>pre+next.agentNum+'\r\n','')

      getCaseInfo({agentNum}).then(res => {
        if (!res.data.length) {
          this.$message.error('该案件有误')
          this.caseData=res.data
          this.submitData.tmCaseList=res.data
        } else {
          this.caseData=res.data
          this.submitData.tmCaseList=res.data
        }
        this.submitData.tmCaseList = this.submitData.tmCaseList.map(item => this.$commonUtils.cleanNullAttr(item))
      }).catch(() => {
        // this.caseData=res.data
        // this.submitData.tmCaseList=res.data
      })
    },
    takeCaseDetail(row){
      this.closeThisPage()
      this.$router.push('/workbench/case/seeCaseDetail/' + row.caseId)
    },
    getDocNumber(e,caseId){
      const data={
        caseId,
        materialTypeId:this.submitData.materialTypeId,
        appNumber:e
      }
      getDocNumber(data).then(res=>{
        if(res.data.docNumber){
          this.submitData.docNumber=res.data.docNumber
        }
      })
    },
    getTmDate(){
      if(!this.submitData.materialTypeId)return;
      getTmDate({caseIds:this.caseData.map(item=>item.caseId),materialTypeId: this.submitData.materialTypeId}).then(res=>{
        this.submitData.tmCaseList.forEach(item=>{
          res.data.forEach(itm=>{
            if(itm.caseId==item.caseId){
              // this.$set(item,'regDate',itm.regDate)
              // this.$set(item,'appNumber',itm.appNumber)
              // this.$set(item,'validEndDate',itm.validEndDate)
              // this.$set(item,'validStartDate',itm.validStartDate)
              // this.$set(item,'appDate',itm.appDate)
              // this.$set(item,'approvalNumber',itm.approvalNumber)
              // this.$set(item,'approvalNo',itm.approvalNo)
              // this.$set(item,'regNumber',itm.regNumber)
            }
          })
        })
        if(!this.submitData.docNumber && this.caseData[0]){
          if(!['外-外','外-内'].includes(this.caseData[0].appFromto)){
            this.getDocNumber(res.data[0].appNumber,this.submitData.tmCaseList[0].caseId)
          }
        }
      })
    },
    queryAlltask() {
      this.queryMaterialType()
      // this.queryMaterialTypeAndQueryDocs()
    },
    handleClose(){
      return
     // this.closeThisPage()
    },
    closeThisPage(flag) {
      if(this.queryInfo.insId){
        this.$store.commit('caseInformation/SET_PREONLYID',this.queryInfo.insId)
      }
      this.$emit('closeThisPage',flag)
    },
    queryUserAll() {
      queryUserAll().then(res => {
        if (res.success) {
          this.userList = res.data
        }
      })
    },
    queryMailingType(){
      queryMailingType().then(res=>{
        if(res.success) {
          this.mailingTypeList = res.data
        }
      })
    },
    formatDate(time) {
      return this.$commonUtils.formatDate(time)
    },
    getApprovalNumber(e,index) {
      getApprovalNumber({ approvalDate: e }).then(res => {
        this.submitData.tmCaseList[index].approvalNumber = res.data
      })
    },
    handleRemove(file, fileList, caseId) {
      // if(!this.caseData.map(item=>item.caseId).length){
      //   this.$message('缺少案件信息，操作失败')
      //   return false
      // }
      if (!this.submitData.docName || !this.submitData.materialTypeId){
        this.$message('请选择官文类型和填写官文名称')
        return false
      }
      let delmaterialId;
      if (file.response) {
        delmaterialId = file.response.data[0].materialId;
      } else {
        delmaterialId = file.materialId;
      }
      let objInstId = ''
      if(this.queryInfo.pageType!=='1'){
        objInstId = this.queryInfo.insId || ''
      }
      delCaseMaterial({ materialId: delmaterialId, caseIdArray: caseId, objInstId, objType: this.$commonUtils.getObjTypeByTaskType(+this.taskType) }).then(res => {
          this.materialIdList.splice(this.materialIdList.indexOf(delmaterialId),1)
      })
    },
    // handleRemove1(file) {
    //   if (file.materialId) {
    //     delCaseMaterial({ materialId: file.materialId,caseIdArray: this.caseData.map(item=>item.caseId)}).then(res => {
    //       this.queryMaterialByCaseId()
    //     })
    //   }
    // },
    // beforeLeave() {f
    //   this.queryMaterialByCaseId()
    // },
    transformation(arr,val,valType,labelStr){
      if(arr&&arr.length){
        var item=arr.find(item=>item[valType]==val)
        if(item){
          return item[labelStr]
        }else {
          return ''
        }
      }
      return ''
    },
    beforeUpload() {
      // if(!this.caseData.map(item=>item.caseId).length){
      //   this.$message('缺少案件信息，操作失败')
      //   return false
      // }
      if (!this.submitData.docName || !this.submitData.materialTypeId){
        this.$message('请选择官文类型和填写官文名称')
        return false
      }
    },
    // getCaseTypeId(type){
    //   return this.$commonUtils.getTwoDimensionalArray(this.$store.getters.caseTypeList,'caseTypeId',this.queryInfo.info[0].caseTypeId).includes(type)
    // },
    getUploadData(caseIds) {
      let objInstId = ''
      if(this.queryInfo.pageType!=='1'){
        objInstId = this.queryInfo.insId || ''
      }
      const data = {
        tokenID: this.$store.getters.token,
        caseIds: this.caseData.map(item=>item.caseId).join(','),
        // custId: this.caseData[0].custId,
        type: '2',
        objType:this.$commonUtils.getObjTypeByTaskType(+this.taskType),
        docName: this.submitData.docName,
        materialTypeId: this.submitData.materialTypeId,
        objInstId
      }
      return data
    },
    onPreview(file) {
      var a = document.createElement('a')
      a.setAttribute('href', '/ipdoc' + file.address)
      a.setAttribute('id', 'startTelMedicine')
      a.setAttribute('target', '_blank')
      if(document.getElementById('startTelMedicine')) {
        document.body.removeChild(document.getElementById('startTelMedicine'))
      }
      document.body.appendChild(a)
      a.click()
    },
    onsuccess(res, file, fileList) {
      this.materialIdList.push(res.data[0].materialId)
      // res.data.forEach(item=>{
      //   console.log(item);
      //   this.submitData.tmCaseList.forEach(itm=>{
      //     item.name = item.materialName
      //     this.$nextTick(()=>{
      //       itm.materialArray.push(item)
      //     })
      //
      //     console.log(item);
      //   })
      // })
    },
    isTimestamp(value) {
      if (typeof value === 'number' && Number.isInteger(value)) {
        const length = value.toString().length;
        if (length === 10 || length === 13) {
          const date = new Date(value.toString().length === 10 ? value * 1000 : value);
          return !isNaN(date.getTime());
        }
      }
      return false;
    },
    queryDocs(){
      queryDocs({ insIdList: this.queryInfo.pageType==='1' ? 111:this.queryInfo.insId || 111, materialTypeId: this.submitData.materialTypeId}).then(res=>{
        if(res.data.length){
          // let arr= .map(item =>{
          //   return Object.assign(item,)
          // })
          this.submitData=res.data[0]
          this.submitData.audit = this.submitData.audit ? '1' : '0'
          if(this.submitData.custId){
            queryCustomerNameId({pageNo: 1, pageSize: 100, custId: this.submitData.custId}).then(res => {
              this.custList = res.data.map(item => ({
                value: item.custId,
                label: item.name
              }))
            })
          }
          this.backData = JSON.parse(JSON.stringify(this.submitData))
          // this.submitData.tmCaseList = this.caseData.map(item=>{
          //    for (var itm of res.data) {
          //      if(item.caseId==itm.caseId){
          //        return itm
          //      }
          //    }
          // })
          this.materialArray = this.submitData.materialArray
          this.materialIdList=this.materialArray.map(item=>item.materialId)
          this.backCaseList = JSON.parse(JSON.stringify(this.submitData.tmCaseList))
        }else {
          this.backCaseList = JSON.parse(JSON.stringify(this.caseData))
          // this.submitData.tmCaseList = this.caseData.map(item => ({ caseId: item.caseId, materialArray:[], agentNum: item.agentNum, validEndDate: '',validStartDate: '' }))
          this.submitData.tmCaseList = this.caseData.map(item => {
            const obj = JSON.parse(JSON.stringify(item));
            delete obj.materials;
            delete obj.goods;
            return obj;
          });
          //如果申请方向为内外&外外案件，不用自动计算初审公告期号
          if(this.caseData[0] && ['内-外','外-外'].includes(this.caseData[0].appFromto)){
            this.submitData.tmCaseList[0].approvalNumber = ''
            this.backCaseList.forEach((item)=>{
              item.approvalNumber= ''
            })
          }
        }
        if(!this.submitData.tmCaseList.length){
          this.isNoCaseOfficial=true
        }

        this.submitData.tmCaseList = this.submitData.tmCaseList.map(item => this.$commonUtils.cleanNullAttr(item)) || []
        if(this.submitData.tmCaseList.length && this.isTimestamp(this.submitData.tmCaseList[0].objectionDate)){
          this.submitData.tmCaseList[0].objectionDate = new Date(this.submitData.tmCaseList[0].objectionDate)
        }
        if (this.submitData.tmCaseList && this.submitData.tmCaseList.length) {
          const copyData = JSON.parse(JSON.stringify(this.submitData.tmCaseList[0]))
          const { approvalNo, regNumber, appNumber, ...rest } = copyData
          this.commonForm = rest
        }
        console.log(this.submitData.tmCaseList,'this.submitData.tmCaseList');
        //取消输入框灰色显示
        // if (this.submitData.tmCaseList && this.submitData.tmCaseList.length > 1) {
        //   for (let key in this.commonForm) {
        //     if (typeof this.commonForm[key] !== 'object') {
        //       this.commonForm[key] = undefined
        //     } else {
        //       this.commonForm[key] = []
        //     }
        //   }
        // }
        // this.submitData.tmCaseList.forEach(item => {
        //   this.$set(item,'approvalDate',this.formatDate(item.approvalDate))
        //   this.$set(item,'sendDate', this.formatDate(item.sendDate))
        // })
        if (this.queryInfo.pageType !== '1') {
          this.typeName= this.submitData.typeName
          // if(this.submitData.audit){
          //   this.submitData.audit ='1'
          // }else {
          //   this.submitData.audit ='0'
          // }
        }
        if (this.queryInfo.pageId == 105) {
          this.submitData.materialTypeId = this.typeNameList.find(item => item.typeName === '报官清单回执').materialTypeId
          this.submitData.docName = '报官清单回执'
          this.typeName = '报官清单回执'
          const country = this.caseData[0] && ['内-外','外-外'].includes(this.caseData[0].appFromto)?this.caseData[0].appState:''

          if(this.submitData.paperofficial){
            this.submitData.docName = '纸件-' + country + this.submitData.docName.replace(/^(纸件-)|(电子-)/, '')
          } else {
            this.submitData.docName = '电子-' + country + this.submitData.docName.replace(/^(纸件-)|(电子-)/, '')
          }
        }
        if (this.queryInfo.pageType == 1) {
        //  this.submitData.sendDate=this.formatDate(new Date())
          // this.submitData.mailingType=1399
          if(this.$commonUtils.getFilterModel(this.submitData.materialTypeId,'materialModel')){
            let materialModel = JSON.parse(this.$commonUtils.getFilterModel(this.submitData.materialTypeId,'materialModel'))
            // this.submitData.materialTypeId= materialModel['materialTypeId']? Number(materialModel['materialTypeId']):null
            console.log(materialModel,'materialModel');
            
            this.typeName=materialModel['typeName']
            // this.submitData.docName =  materialModel['docName']
            const country = this.caseData[0] && ['内-外','外-外'].includes(this.caseData[0].appFromto)?this.caseData[0].appState:''
            if(this.submitData.paperofficial){
              this.submitData.docName = '纸件-' + country + this.typeName.replace(/^(纸件-)|(电子-)/, '')
            } else {
              this.submitData.docName = '电子-' + country + this.typeName.replace(/^(纸件-)|(电子-)/, '')
            }
            this.submitData.recvDate =  materialModel['recvDate']?materialModel['recvDate']:this.formatDate(new Date())
            if(this.caseData.length&&!['外-外','内-外'].includes(this.caseData[0].appFromto)){
              this.submitData.docNumber= materialModel['docNumber']
            }
            this.submitData.sendDate= materialModel['sendDate']
            this.submitData.mailingType=materialModel['mailingType']? Number(materialModel['mailingType']):null
            this.submitData.docDate =  materialModel['docDate']?materialModel['docDate']:this.formatDate(new Date())
          } else {
            this.submitData.recvDate=  this.formatDate(new Date())
            this.submitData.docDate = this.formatDate(new Date())
          }

          this.getTmDate()


          // this.submitData.recvDate=this.formatDate(new Date())
        }
      })
    },
    // queryMaterialTypeAndQueryDocs() {
    //   Promise.all([queryMaterialType({ sign: 2 }), queryDocs({ insIdList:this.queryInfo.insId||11111, materialId: this.queryInfo.materialId, materialTypeId: this.queryInfo.materialTypeId})]).then(res=>{
    //     this.typeNameList = res[0].data
    //     if (res[1].data[0] && res[1].data[0].materialArray.length) {
    //       delete res[1].data[0].materialArray[0].name
    //     }
    //     if(res[1].data.length){
    //       this.submitData.tmCaseList = res[1].data.map(item => Object.assign(item, item.materialArray[0]))
    //     }else {
    //       this.submitData.tmCaseList = this.queryInfo.info.map(item=>({caseId:item.caseId,agentNum:item.agentNum}))
    //     }
    //     if (this.queryInfo.pageType !== '1') {
    //       this.submitData.materialTypeId = this.submitData.tmCaseList[0].materialTypeId
    //       this.submitData.docDate = this.formatDate(this.submitData.tmCaseList[0].docDate)
    //       this.submitData.recvDate = this.formatDate(this.submitData.tmCaseList[0].recvDate)
    //       this.submitData.docNumber = this.submitData.tmCaseList[0].docNumber
    //       this.submitData.memo = this.submitData.tmCaseList[0].memo
    //       this.submitData.audit = '1'
    //       this.submitData.examiner = this.submitData.tmCaseList[0].examiner
    //       this.submitData.docName = this.submitData.tmCaseList[0].docName
    //       this.submitData.tmCaseList.forEach(item => {
    //         this.$set(item,'approvalDate',this.formatDate(item['approvalDate']))
    //         this.$set(item,'sendDate', this.formatDate(item['sendDate']))
    //       })
    //     }
    //     if (this.queryInfo.pageId == 105) {
    //       this.submitData.materialTypeId = this.typeNameList.find(item => item.typeName === '报官清单回执').materialTypeId
    //       this.submitData.docName = '报官清单回执'
    //       this.typeName = '报官清单回执'
    //     }
    //     if (this.queryInfo.pageType === '1') {
    //       this.submitData.tmCaseList.forEach(item => {
    //         this.caseData.forEach(itm => {
    //           if(item.caseId === itm.caseId){
    //             this.$set(item,'mailingType', 1399)
    //             this.$set(item,'sendDate', this.formatDate(new Date()))
    //           //  item.sendDate = this.formatDate(new Date())
    //           }
    //         })
    //       })
    //     }
    //   })
    // },
    queryMaterialType() {
      queryMaterialType({ sign: 2,caseTypeId:this.$commonUtils.getCaseTypeIdByTaskType(+this.taskType || 1) }).then(res => {
        this.typeNameList = res.data
        if (this.queryInfo.pageId == 105) {
          this.submitData.materialTypeId = this.typeNameList.find(item => item.typeName === '报官清单回执').materialTypeId
          this.submitData.docName = '报官清单回执'
          this.typeName = '报官清单回执'
          const country = this.caseData[0] && ['内-外','外-外'].includes(this.caseData[0].appFromto)?this.caseData[0].appState:''

          if(this.submitData.paperofficial){
            this.submitData.docName = '纸件-' + country + this.submitData.docName.replace(/^(纸件-)|(电子-)/, '')
          } else {
            this.submitData.docName = '电子-' + country + this.submitData.docName.replace(/^(纸件-)|(电子-)/, '')
          }
        }
        this.queryDocs()
       // this.editdetailOfficial(this.caseData[0])
      })
    },
    // queryMaterialByCaseId() {
    //   const data = { sign: 2,materialTypeId:this.submitData.materialTypeId }
    //   if (Object.prototype.toString.call(this.queryInfo.caseIds).includes('Array')) {
    //     data.caseIds = this.queryInfo.caseIds.join(',')
    //   } else {
    //     data.caseIds = this.queryInfo.caseIds
    //   }
    //   queryMaterialByCaseId(data).then(res => {
    //     if (res.success) {
    //       this.uploadTable = res.data
    //       if(res.data.length === 1){
    //         this.materialArrayList= res.data[0].materialArray
    //       } else {
    //         let list = []
    //         res.data.forEach(item=>{
    //           list.push(item.materialArray.map(itm=>itm.address))
    //         })
    //         const arr=list.reduce((prev, cur)=>{
    //           return this.intersection(prev, cur)
    //         })
    //         this.materialArrayList= res.data[0].materialArray.filter(item=>{
    //           for (var i=0;i<arr.length;i++){
    //             if(arr[i]===item.address){
    //               return item
    //             }
    //           }
    //         })
    //       }
    //     }
    //   })
    // },
    // intersection:(a,b)=>a.filter(v => b.includes(v)),
    async auditOfficalDoc() {
      if(!this.upload()){
        return
      }
      const [err, success] = await this.$commonUtils.awaitWrap(this.$refs.submission.validate())
      if(!success){
        this.$message.error('请填写必填项')
        return
      }
      const data = {
        userId: this.$store.getters.userId,
        caseIds: this.queryInfo.caseId,
        insIdList: this.queryInfo.insId,
        result: 1,
        materialIdList:this.materialIdList
      }
      // if (this.caseData[0].taskId) {
      //   data.taskIdList = this.caseData.map(item => item.taskId)
      // }
      delete this.submitData.auditStatus
      if(!this.submitData.memo){
        this.submitData.memo='0000'
      }
      this.$commonUtils.handleObjNullAttr(this.submitData, this.backData)
      auditOfficalDoc(Object.assign(data, this.submitData)).then(res => {

        this.closeThisPage(true)
        // this.$emit('closeThisPage', '清单回执审核')
      })
    },
    upload() {
      if(this.$refs.upload.uploadFiles.filter(item=>item.status!='success').length){
        this.$message.error('请等待文件上传完毕')
        return false
      }else {
        return true
      }
    },
    async modifyOfficalDoc(){
      if(!this.upload()){
        return
      }
      const [ err, success] = await this.$commonUtils.awaitWrap(this.$refs.submission.validate())
      if(!success){
        this.$message.error('请填写必填项')
        return
      }
      // if (!Object.prototype.toString.call(this.submitData.tmCaseList[0].materialArray).includes('Array') || !this.submitData.tmCaseList[0].materialArray.length) {
      //   this.$message.error('请上传文件')
      //   return
      // }
      const data = {
        userId: this.$store.getters.userId,
        caseIds: this.queryInfo.caseId,
        insIdList: this.queryInfo.insId,
        materialIdList: this.materialIdList
      }
      delete this.submitData.auditStatus
      if(!this.submitData.memo){
        this.submitData.memo='0000'
      }
      this.$commonUtils.handleObjNullAttr(this.submitData, this.backData)
      modifyOfficalDoc(Object.assign(data,this.submitData)).then(res=>{
        if (res.messageType ==13) {
          this.caseDataList=res.data
          this.poppingTimeLimitState=true
          return;
        }else {
          this.closeThisPage(true)
        }

      })
    },
   async typeInOfficalDoc() {
     if(!this.upload()){
       return
     }
     const [ err, success] = await this.$commonUtils.awaitWrap(this.$refs.submission.validate())
    if(!success){
      this.$message.error('请填写必填项')
        return
     }
      const data = {
        userId: this.$store.getters.userId,
        caseIds: this.caseData.map(item => item.caseId),

      }
      if (Object.prototype.toString.call(this.materialIdList).includes('Array')&&this.materialIdList.length){
        data.materialIdList=this.materialIdList
      }
      if (this.caseData[0]&&this.caseData[0].taskId) {
        data.taskIdList = this.caseData.map(item => item.taskId)
      }
      if (this.typeName === '报官清单回执') {
        data.qingdan = 1
      } else {
        data.qingdan = 2
      }
      if(!this.submitData.memo){
        this.submitData.memo='0000'
      }
      typeInOfficalDoc(Object.assign(data, this.submitData)).then(res => {
        localStorage.setItem('materialTypeId',this.submitData.materialTypeId)
        let materialModel = {
          materialTypeId: this.submitData.materialTypeId,
          docName: this.submitData.docName,
          recvDate: this.submitData.recvDate,
          docNumber: this.submitData.docNumber,
          sendDate: this.submitData.sendDate,
          mailingType: this.submitData.mailingType,
          typeName: this.typeName,
          docDate: this.submitData.docDate
        }
        this.$commonUtils.saveFilterModel(this.submitData.materialTypeId,'materialModel',JSON.stringify(materialModel))
        if (res.messageType ==12) {
          this.$confirm(res.message ,
            "提示",
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }
          ).then(() => {
            this.closeThisPage(true)
          });
          return;
        }
        if (res.messageType ==13) {
          this.caseDataList=res.data
          this.poppingTimeLimitState=true
          return;
        }
        this.closeThisPage(true)
        // this.$emit('closeThisPage', '清单回执')
        // if (this.caseData.length > 1) {
        //   // this.curCase.insId = res.data.tmFileId
        //   // this.queryDocs(this.curCase)
        //   this.$emit('closeThisPage', '清单回执')
        // } else {
        //   this.$emit('closeThisPage', '清单回执')
        // }
      })
    },
    closePoppingTimeLimit(){
      this.poppingTimeLimitState=false
      this.closeThisPage(true)
    },
    changePaperofficial(e) {
      // if (this.typeName=='注册证'){
      //   if(this.submitData.paperofficial){
      //     this.submitData.docName ='纸件注册证'
      //   } else {
      //     this.submitData.docName ='电子注册证'
      //   }
      // }
      const country = this.caseData[0] && ['内-外','外-外'].includes(this.caseData[0].appFromto)?this.caseData[0].appState:''
      const typeName = this.typeNameList.find(item => item.materialTypeId === this.submitData.materialTypeId).typeName
      if(this.submitData.paperofficial){
        this.submitData.docName = '纸件-' + country + typeName
      } else {
        this.submitData.docName = '电子-' + country + typeName
      }
    },
    handleChangeTypeName(n) {
      this.typeName = this.typeNameList.find(item => item.materialTypeId === n).typeName
      // if (this.queryInfo.pageType!='1'&&this.typeName=='注册证'){
      //   if(this.submitData.paperofficial){
      //     this.submitData.docName='纸件注册证'
      //   } else {
      //     this.submitData.docName='电子注册证'
      //   }
      //   return
      // } else if (this.queryInfo.pageType=='1'&&this.typeName=='注册证'){
      //   this.submitData.docName='纸件注册证'
      //   return
      // }
      if (this.typeName === '报官邮单回执') {
        this.$set(this.submitData, 'recvDate', this.$wUtil.getDate('', 'day'))
        this.$set(this.submitData, 'docDate', this.$commonUtils.getLastWorkDate())
      }
      this.submitData.docName = this.typeName
      const country = this.caseData[0] && ['内-外','外-外'].includes(this.caseData[0].appFromto)?this.caseData[0].appState:''

      if(this.submitData.paperofficial){
        this.submitData.docName = '纸件-' + country + this.submitData.docName.replace(/^(纸件-)|(电子-)/, '')
      } else {
        this.submitData.docName = '电子-' + country + this.submitData.docName.replace(/^(纸件-)|(电子-)/, '')
      }
      if ( this.materialIdList&& this.materialIdList.length){
        modifyMaterialType({ materialTypeId:n, materialIdList: this.materialIdList}).then(res =>{

        })
      }
    },
    validEndDate(time){
      if(!time){
        return
      }
      var d = new Date(time);
      d.setFullYear(d.getFullYear()+10)
      d.setDate(d.getDate()-1)
      var yy1 = d.getFullYear();
      var mm1 = d.getMonth()+1;
      var dd1 = d.getDate();
      if (mm1 < 10 ) {
        mm1 = '0' + mm1;
      }
      if (dd1 < 10) {
        dd1 = '0' + dd1;
      }
      return yy1 + '-' + mm1 + '-' + dd1
    }
    // editdetailOfficial(row) {
    //   this.curCase = row
    //   if(!row.insId) {
    //     this.queryInfo.pageType='1'
    //   } else if (this.queryInfo.pageType=='1') {
    //     this.queryInfo.pageType='3'
    //   }
    //   this.queryDocs(this.curCase)
    // }
  },
  watch:{
    commonForm: {
      handler (n) {
        if(this.queryInfo.pageType !=='4'){
          for (const k in n) {
            if (!['agentNum', 'caseId'].includes(k)) {
              this.submitData.tmCaseList.forEach(item => {
                item[k] = n[k]
              })
            }
          }
        }
      },
      deep: true
    },
    'submitData.materialTypeId'(n){
      // if(n){
      //  this.queryDocs()
      // }
      // this.typeName = this.typeNameList.find(item => item.materialTypeId === n).typeName
      if(this.typeName=='受理通知'&&this.queryInfo.pageType==='1'){
        this.submitData.tmCaseList.forEach(item => {
          this.$set(item,'appDate',this.formatDate(item.submitDate))
        })
      }
      if(this.queryInfo.pageType == 1 && this.submitData.tmCaseList.length){

        this.getDocNumber(this.submitData.tmCaseList[0].appNumber,this.submitData.tmCaseList[0].caseId)
      }
      // this.queryDocs()
      // this.queryMaterialByCaseId()
    },
  },
  filters:{
    objectionDate(time){
      if(!time){
        return
      }
      var d = new Date(time);
      d.setMonth(d.getMonth() + 3);
      // d.setDate(d.getDate()-1)
      var yy1 = d.getFullYear();
      var mm1 = d.getMonth()+1;
      var dd1 = d.getDate();
      if (mm1 < 10 ) {
        mm1 = '0' + mm1;
      }
      if (dd1 < 10) {
        dd1 = '0' + dd1;
      }
      return yy1 + '-' + mm1 + '-' + dd1
    },
    validEndDate(time){
      if(!time){
        return
      }
      var d = new Date(time);
      d.setFullYear(d.getFullYear()+10)
      d.setDate(d.getDate()-1)
      var yy1 = d.getFullYear();
      var mm1 = d.getMonth()+1;
      var dd1 = d.getDate();
      if (mm1 < 10 ) {
        mm1 = '0' + mm1;
      }
      if (dd1 < 10) {
        dd1 = '0' + dd1;
      }
      return yy1 + '-' + mm1 + '-' + dd1
    }
  }
}

</script>

<style lang="scss" scoped>
  .el-table.el-table1{
    margin:0 40px;
    width: auto;
  /deep/ tr:nth-of-type(1){
  th{
    background: rgba(242, 242, 242, 1);
  }
  }
  }
  .el-form{
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    padding: 20px;
    margin:0 20px ;
    .el-select,.el-input,.el-date-picker,.el-textarea{
      width: 95%;
    }
    .el-textarea{
      margin: 10px 0;
    }
    /deep/ input{
      height: 28px;
    }
    /deep/ .el-input__icon{
      line-height: 28px;
    }
  .el-row{
    min-height: 30px;
    width: 100%;
    display: flex;
    align-items: center;
  .el-form-item{
    width: 100%;
    display: flex;
    border: 1px solid #EBEEF5;
    border-bottom: 0;
    margin-bottom: 0;
  /deep/ .el-form-item__label{
    background: #f5f7fa;
  }
  /deep/ .el-form-item__content{
    margin-left: 0 !important;
    padding-left: 10px;
    background: #fff;
    flex: 1;
  }

  }
.small-el-form-item-prev:before{
  content: '';
  width: 50%;
  height: 1px;
  background: #EBEEF5;
  position: absolute;
  bottom: -1px;
  right: 0;
  z-index: 1;
}
  .small-el-form-item{
    position: relative;
    width: 50%;
  /deep/ .el-form-item__content{
    flex: 1;
  .pad20{
    padding-left: 20px;
  }
  }
  }
  }
  .el-row:nth-last-child(1){
  .el-form-item{
    border: 1px solid #EBEEF5;
  }
  }
  }
  .button_wrap {
    width: 100%;
    display: flex;
    justify-content: center;
  .el-button{
    margin-left: 30px;
  }
  }
  .require /deep/ .el-form-item__label:before{
    content: "*";
    color: #f56c6c;
    margin-right: 4px;
  }
  /deep/ .el-upload-dragger{
    height: 46px;
  }
  /*.upload-demo{*/
  /*/deep/ .el-upload{*/
    /*width: 100%;*/
  /*}*/
  /*/deep/ .el-upload-dragger{*/
    /*height: 20px;*/
    /*width: 100%;*/
  /*}*/
  /*/deep/ .el-upload-list{*/
    /*display: flex;*/
    /*justify-content: space-around;*/
    /*align-items: center;*/
    /*flex-wrap: wrap;*/
  /*&:first-child{*/
     /*margin-top: 0;*/
   /*}*/
  /*}*/
  /*}*/
  /*.upload-demo1 ,.upload-demo{*/
  /*/deep/ .el-upload-list__item{*/
    /*transition: all 0s ;*/
    /*transform: translateY(0);*/
  /*}*/
  /*/deep/ .el-upload-list__item-name{*/
  /*transition: all 0s;*/
  /*transform: translateY(0);*/
  /*}*/
  /*/deep/ .el-upload-list__item:first-child{*/
    /*margin-top: 0;*/
  /*}*/
  /*/deep/ .el-list-enter,.el-list-leave-active{*/
    /*visibility: hidden;*/
    /*opacity: 1;*/
    /*transition: all 0s;*/
    /*transform: translateY(0);*/
  /*}*/
  /*/deep/ .el-list-enter-active,.el-list-leave-active{*/
    /*display: none;*/
    /*transition: all 0s;*/
  /*}*/
  /*}*/
  /deep/ .el-dialog__headerbtn{
    .el-dialog__close {
      display: none;
    }
  }
 .officialCommunication /deep/ .el-dialog{
    height: 800px;
    overflow: visible !important;
 .el-dialog__body{
      height: 680px;
      padding: 0;
      overflow: auto;
    }
  }
.dialog-footer{
    padding: 0 20px 20px;
  }
  .el-table-input{
    width: 100%;
   /deep/ .el-input__inner{
      padding: 0;
    }
  }
</style>
