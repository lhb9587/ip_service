<template>
  <el-dialog
    append-to-body
    title="官方通知"
    :visible.sync="officialCommunicationState"
    width="80%"
    :before-close="handleClose"
  >
    <el-table :data="caseData" border class="el-table1">

      <el-table-column type="index" width="60" label="序号" align="left">
      </el-table-column>
      <el-table-column align="left" :key="item.title" v-for="(item,index) in tableTitleList" :label="item.title"
                       :prop="item.value">
        <template slot-scope="scope">
          <p style="margin: 0;cursor: pointer" @click="takeCaseDetail(scope.row)">{{scope.row[item.value]}}</p>
        </template>
      </el-table-column>
    </el-table>
    <template v-if="officialCommunicationType!='view'">
      <el-form v-if="taskType != 4" :rules="rules" ref="submission" :model="submitData" label-width="206px">
        <el-row>
          <el-form-item label="官文类型:">
            <el-select default-first-option v-model="submitData.materialTypeId" placeholder="请选择" filterable
                       clearable @change="handleChangeTypeName">
              <el-option
                v-for="item in typeNameList"
                :key="item.materialTypeId"
                :label="item.typeName"
                :value="item.materialTypeId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="官文名称:">
            <el-input v-model="submitData.docName" placeholder="请输入内容"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="发文日期:">
            <el-date-picker
              v-model="submitData.docDate"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="收文日期:" class="small-el-form-item-prev">
            <el-date-picker
              v-model="submitData.recvDate"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-row>
        <el-row v-if="caseData.length&&caseData[0].caseType=='专利无效'&&typeName=='官方通知-无效宣告请求口头审理通知书'">
          <el-form-item label="口审日期:">
            <el-date-picker
              v-model="submitData.talkLimitDate"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-row>
        <el-row v-if="(typeName=='受理通知书'|| typeName=='补正通知书') && business== 4">
          <el-col :span="12">
            <el-form-item label="流水号:">
              <el-input v-model="submitData.serialNumber" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="typeName=='带样本登记证书'||typeName=='登记证书'||typeName=='登记证明'">
          <el-col :span="12">
            <el-form-item label="登记号:">
              <el-input v-model="submitData.droitNumber" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="caseData.length&&caseData[0].caseType=='专利无效'&&typeName=='官方通知-无效宣告请求审查决定书'">
          <el-form-item label="判决结果:">
            <Autocomplete v-model="submitData.judgment" type="typeName"
                          :list="selectDataByClass['1029']"></Autocomplete>
          </el-form-item>

          <el-form-item label="无效决定结果:">
            <el-select default-first-option v-model="submitData.decisionResult" placeholder="请选择" filterable
                       clearable>
              <el-option
                v-for="item in ['全部无效','部分无效','维持专利权有效']"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row v-if="caseData.length&&caseData[0].caseType=='专利无效'&&typeName=='官方通知-无效宣告请求结案通知书'">
          <el-form-item label="结案原因:">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              placeholder="请输入结案原因"
              v-model="submitData.reason">
            </el-input>
          </el-form-item>

        </el-row>

        <el-row v-if="typeName=='预立案登记表'">
          <el-form-item label="预立案日期:">
            <el-date-picker
              v-model="submitData.filingDate"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-row>
        <el-row v-if="typeName=='立案登记表'">
          <el-form-item label="立案日期:">
            <el-date-picker
              v-model="submitData.filingDate"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-row>
        <el-row v-if="(typeName=='受理通知书'&&business==11)||typeName=='应诉通知书'">
          <el-form-item label="管辖法院:" prop="courtCustId">
            <el-select :clearable="true" default-first-option filterable placeholder="请选择"
                       v-model="submitData.courtCustId">

              <el-option :key="key" :label="item.fullname" :value="item.custId"
                         v-for="(item,key) in selectData.hzLists"/>

            </el-select>
          </el-form-item>
          <el-form-item label="法院案号:" prop="courtRefno">
            <el-input v-model="submitData.courtRefno" placeholder="请输入内容"></el-input>
          </el-form-item>
        </el-row>
        <template v-if="(typeName=='受理通知书'&&business==11)||typeName=='合议庭组成人员通知书'||typeName=='开庭传票'||typeName=='集约送达结束'">
          <el-row v-if="(typeName=='受理通知书'&&business==11) || typeName=='合议庭组成人员通知书'">
            <el-form-item label="立案日期:" v-if="(typeName=='受理通知书'&&business==11)">
              <el-date-picker
                v-model="submitData.filingDate"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="法院案号:" v-if="typeName=='合议庭组成人员通知书'">
              <el-input v-model="submitData.courtRefno" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-row>

          <el-row>
            <el-form-item label="审判长:" :prop="typeName=='合议庭组成人员通知书' ? 'collegialBench' : ''">
              <el-input v-model="submitData.collegialBench" placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item label="审判员:" :prop="typeName=='合议庭组成人员通知书' ? 'judge' : ''">
              <el-input v-model="submitData.judge" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="法官助理:" :prop="typeName=='合议庭组成人员通知书' ? 'judgeAssistant' : ''">
              <el-input v-model="submitData.judgeAssistant" placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item label="书记员:" :prop="typeName=='合议庭组成人员通知书' ? 'clerk' : ''">
              <el-input v-model="submitData.clerk" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-row>
        </template>
        <template v-if="typeName=='开庭传票'||typeName=='出庭通知书'">
          <el-row>
            <el-form-item label="开庭日期:" prop="openCourtDate">
              <el-date-picker
                v-model="submitData.openCourtDate"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="应到地点:">
              <el-input v-model="submitData.place" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-row>
        </template>
        <el-row v-if="typeName=='开庭传票'">
          <el-form-item label="审理方式:" prop="hearWayArray">
            <el-select :clearable="false" multiple placeholder="请选择"
                       v-model="submitData.hearWayArray">
              <el-option :key="key" :label="item.typeName" :value="item.id"
                         v-for="(item,key) in selectDataByClass['1134']"/>
            </el-select>
          </el-form-item>
        </el-row>
        <template v-if="typeName=='判决书'">
          <el-row>
            <el-form-item label="结案方式:" prop="closeWay">

              <el-select :clearable="true" default-first-option filterable placeholder="请选择"
                         v-model="submitData.closeWay">
                <el-option :key="key" :label="item.typeName" :value="item.id"
                           v-for="(item,key) in selectDataByClass['1135']"/>

              </el-select>
            </el-form-item>
            <el-form-item label="判决结果(行政和民事):" prop="judgment">
              <Autocomplete v-model="submitData.judgment" type="typeName"
                            :list="selectDataByClass['1029']"></Autocomplete>
              <!--              <el-select  default-first-option v-model="submitData.judgment" placeholder="请选择" filterable-->
              <!--                          clearable  >-->
              <!--                <el-option-->
              <!--                  v-for="item in ['胜诉','败诉','和解','其他']"-->
              <!--                  :key="item"-->
              <!--                  :label="item"-->
              <!--                  :value="item">-->
              <!--                </el-option>-->
              <!--              </el-select>-->
            </el-form-item>

          </el-row>
          <el-row>
            <el-form-item label="判决结果(刑事):">
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="罪名、罪刑、刑期"
                v-model="submitData.judgeResult">
              </el-input>
            </el-form-item>
            <el-form-item label="判赔(和解)金额:" prop="compensateAmount">
              <el-input
                type="number"
                placeholder="请输入判赔(和解)金额"
                v-model="submitData.compensateAmount">
              </el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="标的金额:" prop="underlyingAmount">
              <el-input
                type="number"
              placeholder="请输入内容"
                v-model="submitData.underlyingAmount">
              </el-input>
            </el-form-item>
            <el-form-item label="所涉及条款:" prop="clause">
              <el-select multiple allow-create :clearable="true" default-first-option filterable placeholder="请选择"
                         v-model="submitData.clauses">
                <el-option :key="key" :label="item.typeClause" :value="item.typeClause"
                           v-for="(item,key) in clauseList"/>
              </el-select>
              <!-- <el-input
                v-if="submitData.clause == '其他'"
                placeholder="请输入条款"
                v-model="submitData.clause">
              </el-input> -->
            </el-form-item>
          </el-row>
        </template>
        <template v-if="typeName=='民事调解书'">
          <el-row>
            <el-form-item label="结案方式:" prop="closeWay">

              <el-select :clearable="true" default-first-option filterable placeholder="请选择"
                         v-model="submitData.closeWay">
                <el-option :key="key" :label="item.typeName" :value="item.id"
                           v-for="(item,key) in selectDataByClass['1135']"/>

              </el-select>
            </el-form-item>
            <el-form-item label="判赔(和解)金额:" prop="compensateAmount">
              <el-input
                type="number"
                placeholder="请输入判赔(和解)金额"
                v-model="submitData.compensateAmount">
              </el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="标的金额:" prop="underlyingAmount">
              <el-input
                type="number"
                placeholder="请输入内容"
                v-model="submitData.underlyingAmount">
              </el-input>
            </el-form-item>
            <el-form-item label="所涉及条款:" prop="clause">
              <el-select multiple allow-create :clearable="true" default-first-option filterable placeholder="请选择"
                         v-model="submitData.clauses">
                <el-option :key="key" :label="item.typeClause" :value="item.typeClause"
                           v-for="(item,key) in clauseList"/>
              </el-select>
              <!-- <el-input
                v-if="submitData.clause == '其他'"
                placeholder="请输入条款"
                v-model="submitData.clause">
              </el-input> -->
            </el-form-item>
          </el-row>
        </template>
        <template v-if="typeName=='应诉通知书'">
          <el-row>
            <el-form-item label="应诉时限:">
              <el-date-picker
                v-model="submitData.respondLimitDate"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-row>
        </template>
<!--        <template v-if="typeName=='举证通知书'">-->
<!--          <el-row>-->
<!--            <el-form-item label="举证时限:">-->
<!--              <el-date-picker-->
<!--                v-model="submitData.proofLimitDate"-->
<!--                value-format="yyyy-MM-dd"-->
<!--                type="date"-->
<!--                placeholder="选择日期">-->
<!--              </el-date-picker>-->
<!--            </el-form-item>-->
<!--          </el-row>-->
<!--        </template>-->
        <template v-if="typeName=='法院谈话传票/通知'">
          <el-row>
            <el-form-item label="谈话日期:">
              <el-date-picker
                v-model="submitData.talkLimitDate"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-row>
        </template>
        <template v-if="typeName=='生效证明'">
          <el-row>
            <el-form-item label="裁定结果:" prop="decisionResult">
              <el-select :clearable="true" default-first-option filterable placeholder="请选择"
                         v-model="submitData.decisionResult">
                <el-option :key="key" :label="item.typeName" :value="item.typeName"
                           v-for="(item,key) in querycustSelectClassList"/>
              </el-select>
            </el-form-item>
            <el-form-item label="应到地点:">
              <el-input v-model="submitData.place" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-row>
        </template>
        <template v-if="typeName === '结案裁定书'">
          <el-row>
            <el-form-item label="裁定结果:" prop="decisionResult">
              <el-select :clearable="true" default-first-option filterable placeholder="请选择"
                         v-model="submitData.decisionResult">
                <el-option :key="key" :label="item.typeName" :value="item.typeName"
                           v-for="(item,key) in querycustSelectClassList"/>
              </el-select>
            </el-form-item>
<!--            <el-form-item label="裁定类型:">-->
<!--              <el-select :clearable="true" default-first-option filterable placeholder="请选择"-->
<!--                         v-model="submitData.decisionType">-->
<!--                <el-option :key="key" :label="item.typeName" :value="item.typeName"-->
<!--                           v-for="(item,key) in decisionTypeList"/>-->
<!--              </el-select>-->
<!--            </el-form-item>-->
            <el-form-item label="结案方式:">
              <el-select :clearable="true" default-first-option filterable placeholder="请选择"
                         v-model="submitData.closingMethod">
                <el-option :key="key" :label="item.typeName" :value="item.typeName"
                           v-for="(item,key) in closingMethodList"/>
              </el-select>
            </el-form-item>
          </el-row>
        </template>
        <template v-if="typeName === '诉中裁定书'">
          <el-row>
            <el-form-item label="裁定类型:">
              <el-select :clearable="true" default-first-option filterable placeholder="请选择"
                         v-model="submitData.decisionType">
                <el-option :key="key" :label="item.typeName" :value="item.typeName"
                           v-for="(item,key) in decisionTypeList"/>
              </el-select>
            </el-form-item>
          </el-row>
        </template>
        <template v-if="typeName=='提审受理'">
          <el-row>
            <el-form-item label="受理日期:">
              <el-date-picker
                v-model="submitData.acceptDate"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-row>
        </template>

        <!--        <el-row>-->
        <!--          <el-form-item label="是否提交审核:" >-->
        <!--            <el-radio v-model="submitData.audit" label="0">否</el-radio>-->
        <!--            <el-radio v-model="submitData.audit" label="1">是</el-radio>-->
        <!--          </el-form-item>-->
        <!--        </el-row>-->
        <!--        <el-row>-->
        <!--          <el-form-item label="备注:">-->
        <!--            <el-input-->
        <!--              type="textarea"-->
        <!--              :autosize="{ minRows: 2, maxRows: 4}"-->
        <!--              placeholder="请输入内容"-->
        <!--              v-model="submitData.memo"-->
        <!--            >-->
        <!--            </el-input>-->
        <!--          </el-form-item>-->
        <!--        </el-row>-->
        <el-row>
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
              :on-remove="(file,fileList)=>{ handleRemove(file,fileList,caseData.map(item=>item.caseId))}"
              :on-preview="onPreview"
              :on-success="onsuccess"
              :before-upload="beforeUpload"
            >
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            </el-upload>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="创建人:">
            <el-select v-model="submitData.createUserId" placeholder="请选择创建人" filterable
                       clearable>
              <el-option
                v-for="item in userList"
                :key="item.userId"
                :label="item.fullname"
                :value="item.userId">
                <UserIconAndUserName :user-id="item.userId"></UserIconAndUserName>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="创建日期:">
            <el-date-picker
              v-model="submitData.createDate"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </el-row>
      </el-form>
      <el-form v-if="taskType == 4" :rules="pRules" ref="pSubmission" :model="submitData" label-width="206px">
        <el-row>
          <el-form-item label="官文类型:" prop="materialTypeId">
            <el-select default-first-option v-model="submitData.materialTypeId" placeholder="请选择" filterable
                       clearable @change="handleChangeTypeName">
              <el-option
                v-for="item in typeNameList"
                :key="item.materialTypeId"
                :label="item.typeName"
                :value="item.materialTypeId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="文件名称:">
            <el-input v-model="submitData.docTitle" placeholder="请输入内容"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="发文日期:">
            <el-date-picker
              v-model="submitData.dispatchDate"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item v-if="![300086,300096,300097,300099,300106,300122,300134,300140,300146,300175,300176,
          300181,300194,300196,300197,300199,300388,301302,301101,301218,301227,301228,301229,301230,301268,301270,301273,301274,301279,301290,
          301224,301291,301306,301312,301325,301333,301336,301337,301354,301355,301363,301364

          ].includes(submitData.materialTypeId)" label="发文序号:">
            <el-input v-model="submitData.documentNo" placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item v-if="submitData.materialTypeId == 300388" label="第二阶段递交日期:">
            <el-date-picker
              v-model="submitData.secondDate"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
<!--          <el-form-item v-if="[301290].includes(submitData.materialTypeId)" label="公告日:">-->
<!--            <el-date-picker-->
<!--              v-model="submitData.declareDate"-->
<!--              type="date"-->
<!--              placeholder="选择日期"-->
<!--              value-format="yyyy-MM-dd">-->
<!--            </el-date-picker>-->
<!--          </el-form-item>-->
          <el-form-item v-if="[300097,301273].includes(submitData.materialTypeId) " label="缺少内容:">
            <el-input type="textarea" :rows="1" v-model="submitData.qsContent" placeholder="请输入内容"></el-input>
          </el-form-item>

<!--          <el-form-item v-if="submitData.materialTypeId == 301279" label="PCT公开号:">-->
<!--            <el-input type="text" size="small" v-model="submitData.pctOpenNumber"></el-input>-->
<!--          </el-form-item>-->
<!--          <el-form-item v-if="[300122,301224,301333].includes(submitData.materialTypeId)" label="PCT申请号:">-->
<!--            <el-input type="text" size="small" v-model="submitData.pctFileNo"></el-input>-->
<!--          </el-form-item>-->
<!--          <el-form-item v-if="submitData.materialTypeId == 300146" label="证书号:">-->
<!--            <el-input type="text" size="small" v-model="submitData.certificateNumber"></el-input>-->
<!--          </el-form-item>-->
        </el-row>
        <el-row v-if="typeName=='无效受理通知' || typeName=='无效宣告请求结案通知书'">
          <el-form-item label="官方案件编号:">
            <el-input v-model="submitData.patentNumber" placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item label="">
          </el-form-item>
        </el-row>
        <el-row>

          <!--          <el-form-item v-if="[300165,300199].includes(submitData.materialTypeId)" label="文件名称:">-->
          <!--            <el-input v-model="submitData.docTitle" placeholder="请输入内容"></el-input>-->
          <!--          </el-form-item>-->
          <el-form-item label="作业人:">
            <VirtualSelect class="virtual-select" :isUser="true" filterable clearable :data="$store.getters.allUserList" v-model="submitData.handler"></VirtualSelect>
<!--            <el-select v-model="submitData.handler" placeholder="请选择作业人" filterable-->
<!--                       clearable>-->
<!--              <el-option-->
<!--                v-for="item in userList"-->
<!--                :key="item.userId"-->
<!--                :label="item.fullname"-->
<!--                :value="item.userId">-->
<!--                &lt;!&ndash;                <UserIconAndUserName :user-id="item.userId"></UserIconAndUserName>&ndash;&gt;-->
<!--              </el-option>-->
<!--            </el-select>-->
          </el-form-item>
          <el-form-item v-if="submitData.materialTypeId == 300100" label="是否准予加快:">
            <el-radio-group v-model="submitData.jiakuai" style="margin-left: 0px">
              <el-radio :label='1'>是</el-radio>
              <el-radio :label='0'>否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="submitData.materialTypeId == 300203" label="是否退款:">
            <el-radio-group v-model="submitData.tuikuan" style="margin-left: 0px">
              <el-radio :label='1'>是</el-radio>
              <el-radio :label='0'>否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="submitData.materialTypeId == 300128" label="是否保密:">
            <el-radio-group v-model="submitData.sec" style="margin-left: 0px">
              <el-radio :label='1'>是</el-radio>
              <el-radio :label='0'>否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="![300086,300096,300099,300100,300103,300104,300105,300106,300109,300110,300111,300122,300128,300134,300140,300146,300165,300175,300176,
          300181,300194,300196,300197,300199,300200,300203,300205,300206,300388,301009,301302,301006,301008,301010,301101,301218,301229,301230,301268,301270,301274,
          301279,301290,301224,301291,301306,301312,301325,301333,301336,301337,301343,301354,301355,301363,301364



          ].includes(submitData.materialTypeId)" :label="submitData.materialTypeId == 301225 ? '口审日' : '回复绝限:'">
            <el-date-picker
              v-model="submitData.deadlineDate"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <!--          <el-form-item v-if="submitData.materialTypeId == 301344" label="官方时限:">-->

          <!--          </el-form-item>-->
<!--          <el-form-item v-if="[300122, 301224,301333].includes(submitData.materialTypeId)" label="PCT申请日:">-->
<!--            <el-date-picker-->
<!--              v-model="submitData.pctFileDate"-->
<!--              type="date"-->
<!--              placeholder="选择日期"-->
<!--              value-format="yyyy-MM-dd">-->
<!--            </el-date-picker>-->
<!--          </el-form-item>-->
<!--          <el-form-item v-if="submitData.materialTypeId == 301279" label="PCT公开日:">-->
<!--            <el-date-picker-->
<!--              v-model="submitData.pctOpenDate"-->
<!--              type="date"-->
<!--              placeholder="选择日期"-->
<!--              value-format="yyyy-MM-dd">-->
<!--            </el-date-picker>-->
<!--          </el-form-item>-->
<!--          <el-form-item v-if="[300146, 301290].includes(submitData.materialTypeId)" label="公告号:">-->
<!--            <el-input type="text" size="small" v-model="submitData.declareNo"></el-input>-->
<!--          </el-form-item>-->
<!--          <el-form-item v-if="[301009, 301010].includes(submitData.materialTypeId)" label="实审日:">-->
<!--            <el-date-picker-->
<!--              v-model="submitData.subexamDate"-->
<!--              type="date"-->
<!--              placeholder="选择日期"-->
<!--              value-format="yyyy-MM-dd">-->
<!--            </el-date-picker>-->
<!--          </el-form-item>-->
        </el-row>
        <el-row v-if="typeName=='无效宣告请求审查决定书'">
          <el-form-item label="官方案件编号:">
            <el-input v-model="submitData.patentNumber" placeholder="请输入内容"></el-input>
          </el-form-item>

          <el-form-item label="决定书号:">
            <el-input v-model="submitData.decisionNo" placeholder="请输入内容"></el-input>
          </el-form-item>
        </el-row>
        <el-row v-if="typeName=='无效宣告请求审查决定书'">
          <el-form-item label="判决结果:">
            <Autocomplete v-model="submitData.judgeResult" type="typeName"
                          :list="[{typeName: '赢', id: '赢'},{typeName: '输', id: '输'}]"></Autocomplete>
          </el-form-item>

          <el-form-item label="决定内容:">
            <el-select default-first-option v-model="submitData.decisionContent" placeholder="请选择" filterable
                       clearable>
              <el-option
                v-for="item in ['专利权有效','部分无效','全部无效']"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
        </el-row>
<!--        <el-row v-if="[301009,301008,301229].includes(submitData.materialTypeId)">-->
<!--          <el-form-item label="公开日:">-->
<!--            <el-date-picker-->
<!--              v-model="submitData.openDate"-->
<!--              type="date"-->
<!--              placeholder="选择日期"-->
<!--              value-format="yyyy-MM-dd">-->
<!--            </el-date-picker>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="公开号:">-->
<!--            <el-input type="text" size="small" v-model="submitData.openNumber"></el-input>-->
<!--          </el-form-item>-->
<!--        </el-row>-->
        <el-row v-if="[301204].includes(submitData.materialTypeId)">
          <el-form-item label="著变内容:">
            <el-checkbox-group v-model="submitData.zbContent" style="margin-left: 0px">
              <el-checkbox label="发明人信息">发明人信息</el-checkbox>
              <el-checkbox label="专利权人信息">专利权人信息</el-checkbox>
              <el-checkbox label="代理机构和专利代理人">代理机构和专利代理人</el-checkbox>
            </el-checkbox-group>
<!--            <el-radio-group v-model="submitData.zbContent" style="margin-left: 0px">-->
<!--              <el-radio label='发明人信息'>发明人信息</el-radio>-->
<!--              <el-radio label='专利权人信息'>专利权人信息</el-radio>-->
<!--              <el-radio label='代理机构和专利代理人'>代理机构和专利代理人</el-radio>-->
<!--            </el-radio-group>-->
          </el-form-item>
        </el-row>
        <el-row v-if="[301281].includes(submitData.materialTypeId)">
          <el-form-item label="届满日期:">
            <el-date-picker
              v-model="submitData.jiemanDate"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-row>
        <el-row v-if="[301352].includes(submitData.materialTypeId)">
          <el-form-item label="是否保密:">
            <el-radio-group v-model="submitData.sec" style="margin-left: 0px">
              <el-radio :label='1'>是</el-radio>
              <el-radio :label='0'>否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-row>
<!--        <el-row v-if="[301011].includes(submitData.materialTypeId)">-->
<!--          <el-form-item label="首次年费:">-->
<!--            <el-input type="text" size="small" v-model="submitData.firstYearNumber"></el-input>-->
<!--          </el-form-item>-->
<!--        </el-row>-->
<!--        <el-row v-if="[301013].includes(submitData.materialTypeId)">-->
<!--          <el-form-item label="公告号:">-->
<!--            <el-input type="text" size="small" v-model="submitData.declareNo"></el-input>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="公告日:">-->
<!--            <el-date-picker-->
<!--              v-model="submitData.declareDate"-->
<!--              type="date"-->
<!--              placeholder="选择日期"-->
<!--              value-format="yyyy-MM-dd">-->
<!--            </el-date-picker>-->
<!--          </el-form-item>-->
<!--        </el-row>-->
<!--        <el-row v-if="[301013].includes(submitData.materialTypeId)">-->
<!--          <el-form-item label="证书号:">-->
<!--            <el-input type="text" size="small" v-model="submitData.certificateNumber"></el-input>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="授权日:">-->
<!--            <el-date-picker-->
<!--              v-model="submitData.certificateDate"-->
<!--              type="date"-->
<!--              placeholder="选择日期"-->
<!--              value-format="yyyy-MM-dd">-->
<!--            </el-date-picker>-->
<!--          </el-form-item>-->
<!--        </el-row>-->
<!--        <el-row v-if="[301013].includes(submitData.materialTypeId)">-->
<!--          <el-form-item label="年费监视:">-->
<!--            <el-radio-group v-model="submitData.isagency" style="margin-left: 10px">-->
<!--              <el-radio :label='1'>是</el-radio>-->
<!--              <el-radio :label='0'>否</el-radio>-->
<!--            </el-radio-group>-->
<!--          </el-form-item>-->
<!--        </el-row>-->
<!--        <el-row v-if="[301213,301218,301230].includes(submitData.materialTypeId)">-->
<!--          <el-form-item label="申请号:">-->
<!--            <el-input type="text" size="small" v-model="submitData.appNumber"></el-input>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="申请日:">-->
<!--            <el-date-picker-->
<!--              v-model="submitData.appDate"-->
<!--              type="date"-->
<!--              placeholder="选择日期"-->
<!--              value-format="yyyy-MM-dd">-->
<!--            </el-date-picker>-->
<!--          </el-form-item>-->
<!--        </el-row>-->
<!--        <el-row v-if="[301213].includes(submitData.materialTypeId)">-->
<!--          <el-form-item label="有效日:">-->
<!--            <el-date-picker-->
<!--              v-model="submitData.validEndDate"-->
<!--              type="date"-->
<!--              placeholder="选择日期"-->
<!--              value-format="yyyy-MM-dd">-->
<!--            </el-date-picker>-->
<!--          </el-form-item>-->
<!--        </el-row>-->
<!--        <el-row v-if="[301218,301230].includes(submitData.materialTypeId)">-->
<!--          <el-form-item label="递交日:">-->
<!--            <el-date-picker-->
<!--              v-model="submitData.caseSubmitDate"-->
<!--              type="date"-->
<!--              placeholder="选择日期"-->
<!--              value-format="yyyy-MM-dd">-->
<!--            </el-date-picker>-->
<!--          </el-form-item>-->
<!--        </el-row>-->
        <el-row v-if="[301018].includes(submitData.materialTypeId)">
          <el-form-item label="二选一:">
            <el-checkbox :true-label="1" v-model="choiceOne" :disabled="choiceOne == 2">
            代缴年费情况: 未缴纳第（<el-input :disabled="choiceOne == 2" class="claims" size="mini" style="width: 60px;" type="text" v-model="submitData.djFeeYear"></el-input>）年度年费
            </el-checkbox>
            <el-checkbox :true-label="2" v-model="choiceOne" :disabled="choiceOne == 1">
            有效日期:<span v-if="choiceOne != 1">{{submitData.validEndDate}}</span>
            </el-checkbox>
          </el-form-item>
        </el-row>
        <el-row v-if="[301216].includes(submitData.materialTypeId)">
          <el-form-item label="延期至日期:">
            <el-date-picker
              v-model="submitData.yanqiEndDate"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-row>
        <el-row v-if="[301268].includes(submitData.materialTypeId)">
          <el-form-item label="著变内容:">
            <el-checkbox-group v-model="submitData.zbContent" style="margin-left: 0px">
              <el-checkbox label="发明人信息">发明人信息</el-checkbox>
              <el-checkbox label="专利权人信息">专利权人信息</el-checkbox>
              <el-checkbox label="代理机构和专利代理人">代理机构和专利代理人</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-row>

        <el-row
          v-if="[300124,300126,300127,300142,300152,300154,300156,300171,300198,300201,301271,301285,301304,301313,301316,301365,301544,301003,301004,301005,
                  301014,301219,301272,301288,301298,301335,301339,301340,301342,301345,301346,301356,301358,301362,301348
          ].includes(submitData.materialTypeId)">
          <el-form-item v-if="![301335].includes(submitData.materialTypeId)" label="审查员信息及电话:">
            <el-input type="textarea" :rows="1" v-model="submitData.sipoScy" placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item v-if="[301346,301356,301005,301365,301544,301014,301285,301304,301358,301348].includes(submitData.materialTypeId)" label="审查部门:">
            <el-input v-model="submitData.scDept" placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item v-if="[301272].includes(submitData.materialTypeId)" label="修改内容:">
            <el-input type="textarea" :rows="1" v-model="submitData.mdContent" placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item v-if="[300152,300154,300156,301335,301340,301342].includes(submitData.materialTypeId)"
                        label="修改更正内容:">
            <el-input type="textarea" :rows="1" v-model="submitData.correctionContent" placeholder="请输入内容"></el-input>

          </el-form-item>

        </el-row>
        <el-row v-if="[301365,301544,301005].includes(submitData.materialTypeId)">
          <el-form-item label="识别通知书次数:">
            <el-input type="text" v-model="submitData.shibieNum"></el-input>
          </el-form-item>
        </el-row>
<!--        <el-row v-if="[301285,301304,301345,301316].includes(submitData.materialTypeId)">-->
<!--          <el-form-item label="复审官方案件编号:">-->
<!--            <el-input type="text" v-model="submitData.patentNumber"></el-input>-->
<!--          </el-form-item>-->
<!--        </el-row>-->
        <el-row
          v-if="[300142,300171,301285,301304,301365,301544,301003,301004,301005,301014,301272,301298,301339,301346,301356,301358,301362,301348].includes(submitData.materialTypeId)">
          <el-form-item label="引用条款:" class="yinyong">
            <template>
              <div v-if="aboutInstruction.length">
                <span>关于说明书:</span>
                <el-checkbox-group style="margin-left: 20px" v-model="instructionList" @change="(v)=>{changeClaims(v)}">
                  <el-checkbox style="display: block;margin-right: 30px" class="shuoming-check" v-for="item in aboutInstruction" :key="item.lawId" :label="item.lawId">
                    <div v-if="item.lawDesc === '' || !item.lawDesc" style="width: 100%;display: flex;">
                      <span style="flex: 1">不符合</span>
                      <el-input style="flex: 8" class="claims" type="text" v-model="item.content" @focus="()=>{focusCheck(instructionList, item.lawId)}"></el-input>
                      <span style="flex: 1">的规定</span>
                    </div>
                    {{item.lawDesc}}
                    <el-input v-if="item.lawDesc == '其他'" class="claims" style="flex: 1" type="text" v-model="item.content" @focus="()=>{focusCheck(instructionList, item.lawId)}"></el-input>
                  </el-checkbox>
                </el-checkbox-group>
              </div>
              <div v-if="aboutClaims.length">
                <span>关于权利要求书:</span>
                <el-checkbox-group style="margin-left: 20px" class="flex-input" v-model="claimsList" @change="(v)=>{changeClaims(v)}">
                  <el-checkbox style="display: block" v-for="item in aboutClaims" :key="item.lawId" :label="item.lawId">
                    <template>
                      <div style="display: flex;">
                        <span v-if="item.lawDesc">权利要求</span>
                        <el-input class="claims" style="flex: 1" type="text" v-model="item.content" @focus="()=>{focusCheck(claimsList, item.lawId)}"></el-input>
                        <span>{{item.lawDesc}}</span>
                      </div>

                    </template>
                  </el-checkbox>
                </el-checkbox-group>
              </div>
              <div v-if="otherList.length">
                <el-checkbox-group style="margin-right: 20px" v-model="otherCheckList" class="flex-input" @change="(v)=>{changeClaims(v)}">
                  <el-checkbox style="display: block" v-for="item in otherList" :key="item.lawId" :label="item.lawId">
                    <template>
                      <div style="display: flex;">
                        <span v-if="item.lawDesc">权利要求</span>
                        <el-input class="claims" style="flex: 1" type="text" v-model="item.content" @focus="()=>{focusCheck(otherCheckList, item.lawId)}"></el-input>
                        <span> {{item.lawDesc}}</span>
                      </div>
                    </template>
                  </el-checkbox>
                </el-checkbox-group>
              </div>
            </template>
          </el-form-item>
          <el-form-item v-if="[301304].includes(submitData.materialTypeId)" label="复审决定是否撤销驳回:">
            <el-radio-group v-model="submitData.bohui" style="margin-left: 0px">
              <el-radio :label='1'>是</el-radio>
              <el-radio :label='0'>否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-row>
<!--        <el-row>-->
<!--          <el-form-item label="是否审核:">-->
<!--            <el-radio-group v-model="submitData.audit" style="margin-left: 0px">-->
<!--              <el-radio label='1'>是</el-radio>-->
<!--              <el-radio label='0'>否</el-radio>-->
<!--            </el-radio-group>-->
<!--          </el-form-item>-->
<!--        </el-row>-->
        <el-row>
          <el-form-item label="上传文件:" class="patent-upload">
            <el-upload
              ref="upload"
              class="upload-demo"
              drag
              multiple
              name="attachFile"
              :data="getUploadData()"
              :action="creatematerial"
              :file-list="materialArray"
              :on-remove="(file,fileList)=>{ handleRemove(file,fileList,caseData.map(item=>item.caseId))}"
              :on-preview="onPreview"
              :on-success="onsuccess"
              :before-upload="beforeUpload"
            >
<!--              <i class="el-icon-upload"></i>-->
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            </el-upload>
          </el-form-item>
        </el-row>
        <el-row
          v-if="[300171,301285,301304,301365,301544,301003,301004,301005,301014,301298,301339,301346,301356,301358,301362].includes(submitData.materialTypeId)">
          <el-form-item label="对比文件:" class="yinyong">
            <div style="width: 100%">
              <el-button type="primary" size="mini" @click="addDBfile()">添加</el-button>
              <el-table
                :data="submitData.ptDbList"
                border
                style="width: auto">
                <el-table-column
                  label="编号"
                  width="100px">
                  <template slot-scope="scope">
                    <el-input type="text" v-model="scope.row.dbno"></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  label="文件号或名称"
                >
                  <template slot-scope="scope">
                    <el-input type="text" v-model="scope.row.dbFile"></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  label="公开日期"
                >
                  <template slot-scope="scope">
                    <el-date-picker
                      v-model="scope.row.openDate"
                      value-format="yyyy-MM-dd"
                      type="date"
                      placeholder="选择日期">
                    </el-date-picker>
                  </template>
                </el-table-column>
                <el-table-column
                  label="操作"
                >
                  <template slot-scope="scope">
                    <span style="color: #409EFF;cursor: pointer;" @click="delDBfile(scope.$index)">删除</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="创建人:">
            <el-select v-model="submitData.operator" placeholder="请选择创建人" filterable
                       clearable>
              <el-option
                v-for="item in userList"
                :key="item.userId"
                :label="item.fullname"
                :value="item.userId">
                <UserIconAndUserName :user-id="item.userId"></UserIconAndUserName>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="创建日期:">
            <el-date-picker
              v-model="submitData.inputDate"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </el-row>
        <el-row class="">
          <el-form-item label="更多">
            <div style="padding: 10px 0">
              <el-table :key="changeKey" :data="caseData" border class="el-table1 el-table2">
                <el-table-column type="index" width="60" label="序号" align="left">
                </el-table-column>
                <el-table-column label="案件文号" prop="agentNum">
                </el-table-column>
                <el-table-column label="复审官方案件编号"
                  v-if="[301285,301304,301345,301316].includes(submitData.materialTypeId)"
                >
                  <template slot-scope="scope">
                    <el-input type="text" size="small" v-model="scope.row.patentNumber"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="申请日"
                  v-if="[301213,301218,301230,301336].includes(submitData.materialTypeId)"
                >
                  <template slot-scope="scope">
                    <el-date-picker
                      v-model="scope.row.appDate"
                      type="date"
                      placeholder="选择日期"
                      value-format="yyyy-MM-dd">
                    </el-date-picker>
                  </template>
                </el-table-column>
                <el-table-column label="申请号"
                  v-if="[301213,301218,301230,301336].includes(submitData.materialTypeId)"
                >
                  <template slot-scope="scope">
                    <el-input type="text" size="small" v-model="scope.row.appNumber"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="递交日"
                  v-if="[301218,301230,301336].includes(submitData.materialTypeId)"
                >
                  <template slot-scope="scope">
                    <el-date-picker
                      v-model="scope.row.submitDate"
                      type="date"
                      placeholder="选择日期"
                      value-format="yyyy-MM-dd">
                    </el-date-picker>
                  </template>
                </el-table-column>
                <el-table-column label="有效日"
                  v-if="[301213].includes(submitData.materialTypeId)"
                >
                  <template slot-scope="scope">
                    <el-date-picker
                      v-model="scope.row.validEndDate"
                      type="date"
                      placeholder="选择日期"
                      value-format="yyyy-MM-dd">
                    </el-date-picker>
                  </template>
                </el-table-column>
                <el-table-column label="年费监视" v-if="[301013].includes(submitData.materialTypeId)">
                  <template slot-scope="scope">
                    <el-radio-group v-model="scope.row.isagency" style="margin-left: 10px">
                      <el-radio :label='1'>是</el-radio>
                      <el-radio :label='0'>否</el-radio>
                    </el-radio-group>
                  </template>
                </el-table-column>
                <el-table-column label="证书号" v-if="[301013,300146].includes(submitData.materialTypeId)">
                  <template slot-scope="scope">
                    <el-input type="text" size="small" v-model="scope.row.certificateNumber"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="PCT申请号" v-if="[300122,301224,301333].includes(submitData.materialTypeId)">
                  <template slot-scope="scope">
                    <el-input type="text" size="small" v-model="scope.row.pctFileNo"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="PCT公开号" v-if="[301279].includes(submitData.materialTypeId)">
                  <template slot-scope="scope">
                    <el-input type="text" size="small" v-model="scope.row.pctOpenNumber"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="授权日" v-if="[301013].includes(submitData.materialTypeId)">
                  <template slot-scope="scope">
                    <el-date-picker
                      v-model="scope.row.certificateDate"
                      type="date"
                      placeholder="选择日期"
                      value-format="yyyy-MM-dd">
                    </el-date-picker>
                  </template>
                </el-table-column>
                <el-table-column label="PCT申请日" v-if="[300122, 301224,301333].includes(submitData.materialTypeId)">
                  <template slot-scope="scope">
                    <el-date-picker
                      v-model="scope.row.pctFileDate"
                      type="date"
                      placeholder="选择日期"
                      value-format="yyyy-MM-dd">
                    </el-date-picker>
                  </template>
                </el-table-column>
                <el-table-column label="PCT公开日" v-if="[301279].includes(submitData.materialTypeId)">
                  <template slot-scope="scope">
                    <el-date-picker
                      v-model="scope.row.pctOpenDate"
                      type="date"
                      placeholder="选择日期"
                      value-format="yyyy-MM-dd">
                    </el-date-picker>
                  </template>
                </el-table-column>
                <el-table-column label="实审日" v-if="[301009, 301010].includes(submitData.materialTypeId)">
                  <template slot-scope="scope">
                    <el-date-picker
                      v-model="scope.row.subexamDate"
                      type="date"
                      placeholder="选择日期"
                      value-format="yyyy-MM-dd">
                    </el-date-picker>
                  </template>
                </el-table-column>
                <el-table-column label="公开号" v-if="[301009,301008,301229].includes(submitData.materialTypeId)">
                  <template slot-scope="scope">
                    <el-input type="text" size="small" v-model="scope.row.openNumber"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="公开日" v-if="[301009,301008,301229].includes(submitData.materialTypeId)">
                  <template slot-scope="scope">
                    <el-date-picker
                      v-model="scope.row.openDate"
                      type="date"
                      placeholder="选择日期"
                      value-format="yyyy-MM-dd">
                    </el-date-picker>
                  </template>
                </el-table-column>
                <el-table-column label="公告号" v-if="[301013,300146, 301290].includes(submitData.materialTypeId)">
                  <template slot-scope="scope">
                    <el-input type="text" size="small" v-model="scope.row.declareNo"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="公告日" v-if="[301013,301290].includes(submitData.materialTypeId)">
                  <template slot-scope="scope">
                    <el-date-picker
                      v-model="scope.row.declareDate"
                      type="date"
                      placeholder="选择日期"
                      value-format="yyyy-MM-dd">
                    </el-date-picker>
                  </template>
                </el-table-column>
                <el-table-column label="首次年费" v-if="[301011].includes(submitData.materialTypeId)">
                  <template slot-scope="scope">
                    <el-input type="text" size="small" v-model="scope.row.firstYearNumber"></el-input>
                  </template>
                </el-table-column>
              </el-table>
            </div>

          </el-form-item>
        </el-row>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="closeThisPage()">返回</el-button>
        <el-button type="primary" @click="typeInOfficalDoc" v-if="officialCommunicationType==='create'">提交</el-button>
        <el-button class="exactButton" type="primary" @click="auditOfficalDoc"
                   v-if="officialCommunicationType==='audit'">审核</el-button>
        <el-button class="exactButton" type="primary" @click="modifyOfficalDoc"
                   v-if="officialCommunicationType==='edit'">修改</el-button>
       </span>
    </template>
    <template v-if="officialCommunicationType=='view'">
      <el-form label-width="206px" v-if="taskType != 4">
        <el-row>
          <el-form-item label="官文类型:">
            {{typeName}}
          </el-form-item>
          <el-form-item label="文件名称:">
            {{submitData.docName}}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="发文日期:">
            {{submitData.docDate}}
          </el-form-item>
          <el-form-item label="收文日期:" class="small-el-form-item-prev">
            {{submitData.recvDate}}
          </el-form-item>
        </el-row>
        <el-row v-if="(typeName=='受理通知书'||typeName=='补正通知书') && business== 4">
          <el-form-item label="流水号:">
            {{submitData.serialNumber }}
          </el-form-item>
        </el-row>
        <el-row v-if="typeName=='带样本登记证书'||typeName=='登记证书'||typeName=='登记证明'">
          <el-form-item label="登记号:">
            {{submitData.droitNumber }}
          </el-form-item>
        </el-row>
        <el-row v-if="caseData.length&&caseData[0].caseType=='专利无效'&&typeName=='官方通知-无效宣告请求口头审理通知书'">
          <el-form-item label="口审日期:">
            {{submitData.talkLimitDate}}
          </el-form-item>
        </el-row>
        <el-row v-if="caseData.length&&caseData[0].caseType=='专利无效'&&typeName=='官方通知-无效宣告请求审查决定书'">
          <el-form-item label="判决结果:">
            {{submitData.judgment}}
          </el-form-item>

          <el-form-item label="无效决定结果:">
            {{submitData.decisionResult}}
          </el-form-item>
        </el-row>
        <el-row v-if="caseData.length&&caseData[0].caseType=='专利无效'&&typeName=='官方通知-无效宣告请求结案通知书'">
          <el-form-item label="结案原因:">
            {{submitData.reason}}
          </el-form-item>

        </el-row>
        <el-row v-if="typeName=='预立案登记表'">
          <el-form-item label="预立案日期:">
            {{submitData.filingDate}}
          </el-form-item>
        </el-row>
        <el-row v-if="typeName=='立案登记表'">
          <el-form-item label="立案日期:">
            {{submitData.filingDate}}
          </el-form-item>
        </el-row>
        <el-row v-if="(typeName=='受理通知书'&&business==11)||typeName=='应诉通知书'">
          <el-form-item label="管辖法院:">
            {{transformation(selectData.hzLists,submitData.courtCustId,'custId','fullname')}}
          </el-form-item>
          <el-form-item label="法院案号:">
            {{submitData.courtRefno}}
          </el-form-item>
        </el-row>
        <template v-if="(typeName=='受理通知书'&&business==11)||typeName=='合议庭组成人员通知书'||typeName=='开庭传票'||typeName=='集约送达结束'">
          <el-row v-if="(typeName=='受理通知书'&&business==11) || typeName=='合议庭组成人员通知书'">
            <el-form-item label="立案日期:" v-if="(typeName=='受理通知书'&&business==11)">
              {{submitData.filingDate}}
            </el-form-item>
            <el-form-item label="法院案号:" v-if="typeName=='合议庭组成人员通知书'">
              {{submitData.courtRefno}}
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="审判长:">
              {{submitData.collegialBench}}
            </el-form-item>
            <el-form-item label="审判员:">
              {{submitData.judge}}
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="法官助理:">
              {{submitData.judgeAssistant}}
            </el-form-item>
            <el-form-item label="书记员:">
              {{submitData.clerk}}
            </el-form-item>
          </el-row>
        </template>
        <template v-if="typeName=='开庭传票'||typeName=='出庭通知书'">
          <el-row>
            <el-form-item label="开庭日期:">
              {{submitData.openCourtDate}}
            </el-form-item>
            <el-form-item label="应到地点:">
              {{submitData.place}}
            </el-form-item>
          </el-row>
          <el-row v-if="typeName=='开庭传票'">
            <el-form-item label="审理方式:">
              {{submitData.hearWayArray.map(item=>transformation(selectDataByClass['1134'],item,'id','typeName'))}}
              <!--              <el-select :clearable="true" multiple default-first-option filterable placeholder="请选择" v-model="submitData.hearWayArray">-->
              <!--                <el-option :key="key" :label="item.typeName" :value="item.id" v-for="(item,key) in selectDataByClass['1134']" />-->
              <!--              </el-select>-->
            </el-form-item>
          </el-row>
        </template>

        <template v-if="typeName=='判决书'">
          <el-row>
            <el-form-item label="结案方式:">
              {{transformation(selectDataByClass['1135'],submitData.closeWay,'id','typeName')}}
            </el-form-item>
            <el-form-item label="判决结果(民事):">
              {{submitData.judgment}}
            </el-form-item>

          </el-row>
          <el-row>
            <el-form-item label="判决结果(刑事):">
              {{submitData.judgeResult}}
            </el-form-item>
            <el-form-item label="判赔(和解)金额:">
              {{submitData.compensateAmount}}
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="标的金额:" prop="underlyingAmount">
              {{ submitData.underlyingAmount }}
            </el-form-item>
            <el-form-item label="所涉及条款:" prop="clause">
              {{submitData.clause}}
            </el-form-item>
          </el-row>

        </template>
        <template v-if="typeName=='民事调解书'">
          <el-row>
            <el-form-item label="结案方式:">
              {{transformation(selectDataByClass['1135'],submitData.closeWay,'id','typeName')}}
            </el-form-item>
            <el-form-item label="判赔(和解)金额:">
              {{submitData.compensateAmount}}
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="标的金额:" prop="underlyingAmount">
              {{ submitData.underlyingAmount }}
            </el-form-item>
            <el-form-item label="所涉及条款:" prop="clause">
              {{submitData.clause}}
            </el-form-item>
          </el-row>

        </template>
        <template v-if="typeName=='应诉通知书'">
          <el-row>
            <el-form-item label="应诉时限:">
              {{submitData.respondLimitDate}}
            </el-form-item>
          </el-row>
        </template>
<!--        <template v-if="typeName=='举证通知书'">-->
<!--          <el-row>-->
<!--            <el-form-item label="举证时限:">-->
<!--              {{submitData.proofLimitDate}}-->
<!--            </el-form-item>-->
<!--          </el-row>-->
<!--        </template>-->
        <template v-if="typeName=='法院谈话传票/通知'">
          <el-row>
            <el-form-item label="谈话日期:">
              {{submitData.talkLimitDate}}
            </el-form-item>
          </el-row>
        </template>
        <template v-if="typeName=='生效证明'">
          <el-row>
            <el-form-item label="裁定结果:">
              {{submitData.decisionResult}}
            </el-form-item>
            <el-form-item label="应到地点:">
              {{submitData.place}}
            </el-form-item>
          </el-row>
        </template>
        <template v-if="typeName === '结案裁定书'">
          <el-row>
            <el-form-item label="裁定结果:">
              {{submitData.decisionResult}}
            </el-form-item>
            <el-form-item label="结案方式:">
              {{submitData.closingMethod}}
            </el-form-item>
          </el-row>
        </template>
        <template v-if="typeName === '诉中裁定书'">
          <el-row>
            <el-form-item label="裁定类型:">
              {{submitData.decisionType}}
            </el-form-item>
          </el-row>
        </template>
        <template v-if="typeName=='提审受理'">
          <el-row>
            <el-form-item label="受理日期:">
              {{submitData.acceptDate}}
            </el-form-item>
          </el-row>
        </template>

        <!--        <el-row>-->
        <!--          <el-form-item label="是否提交审核:" >-->
        <!--            <el-radio v-model="submitData.audit" label="0">否</el-radio>-->
        <!--            <el-radio v-model="submitData.audit" label="1">是</el-radio>-->
        <!--          </el-form-item>-->
        <!--        </el-row>-->
        <!--        <el-row>-->
        <!--          <el-form-item label="备注:">-->
        <!--            <el-input-->
        <!--              type="textarea"-->
        <!--              :autosize="{ minRows: 2, maxRows: 4}"-->
        <!--              placeholder="请输入内容"-->
        <!--              v-model="submitData.memo"-->
        <!--            >-->
        <!--            </el-input>-->
        <!--          </el-form-item>-->
        <!--        </el-row>-->
        <el-row>
          <el-form-item label="上传文件:">
            <p v-for="item in materialArray" style="color: #409EFF">
              <a target="_blank" :href="`ipdoc${item.address}`">{{item.name}}</a>
            </p>
            <!--            <el-upload-->
            <!--              ref="upload"-->
            <!--              class="upload-demo"-->
            <!--              drag-->
            <!--              multiple-->
            <!--              name="attachFile"-->
            <!--              :data="getUploadData()"-->
            <!--              :action="creatematerial"-->
            <!--              :file-list="materialArray"-->
            <!--              :on-remove="(file,fileList)=>{ handleRemove(file,fileList,caseData.map(item=>item.caseId))}"-->
            <!--              :on-preview="onPreview"-->
            <!--              :on-success="onsuccess"-->
            <!--              :before-upload="beforeUpload"-->
            <!--            >-->
            <!--              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>-->
            <!--            </el-upload>-->
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="创建人:">

            {{ transformation(userList,submitData.createUserId,'userId','fullname')}}
          </el-form-item>
          <el-form-item label="创建日期:">
            {{submitData.createDate}}
          </el-form-item>
        </el-row>
      </el-form>

      <el-form v-if="taskType == 4" label-width="206px">
        <el-row>
          <el-form-item label="官文类型:">
            {{typeName}}
          </el-form-item>
          <el-form-item label="文件名称:">
            {{submitData.docTitle}}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="发文日期:">
            {{submitData.dispatchDate}}
          </el-form-item>
          <el-form-item v-if="![300086,300096,300097,300099,300106,300122,300134,300140,300146,300175,300176,
          300181,300194,300196,300197,300199,300388,301302,301101,301218,301227,301228,301229,301230,301268,301270,301273,301274,301279,301290,
          301224,301291,301306,301312,301325,301333,301336,301337,301354,301355,301363,301364

          ].includes(submitData.materialTypeId)" label="发文序号:">
            {{submitData.documentNo}}
          </el-form-item>
          <el-form-item v-if="submitData.materialTypeId == 300388" label="第二阶段递交日期:">
            {{submitData.secondDate}}
          </el-form-item>
<!--          <el-form-item v-if="[301290].includes(submitData.materialTypeId)" label="公告号:">-->
<!--            {{submitData.declareNo}}-->
<!--            &lt;!&ndash;            <el-input type="text" size="small" v-model="submitData.declareNo"></el-input>&ndash;&gt;-->
<!--          </el-form-item>-->
          <el-form-item v-if="[300097,301273].includes(submitData.materialTypeId) " label="缺少内容:">
            {{submitData.qsContent}}
          </el-form-item>

<!--          <el-form-item v-if="submitData.materialTypeId == 301279" label="PCT公开号:">-->
<!--            {{submitData.pctOpenNumber}}-->
<!--          </el-form-item>-->
<!--          <el-form-item v-if="[300122,301224,301333].includes(submitData.materialTypeId)" label="PCT申请号:">-->
<!--            {{submitData.pctFileNo}}-->
<!--          </el-form-item>-->

<!--          <el-form-item v-if="submitData.materialTypeId == 300146" label="证书号:">-->
<!--            {{submitData.certificateNumber}}-->
<!--          </el-form-item>-->
        </el-row>
        <el-row v-if="typeName=='无效受理通知' || typeName=='无效宣告请求结案通知书'">
          <el-form-item label="官方案件编号:">
            {{submitData.patentNumber}}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item v-if="submitData.materialTypeId == 300100" label="是否准予加快:">
            {{+submitData.jiakuai ? '是' : '否' }}
          </el-form-item>
          <el-form-item v-if="submitData.materialTypeId == 300203" label="是否退款:">
            {{+submitData.tuikuan ? '是' : '否'}}
          </el-form-item>
          <el-form-item v-if="submitData.materialTypeId == 300128" label="是否保密:">
            {{+submitData.sec ? '是' : '否'}}
          </el-form-item>

          <!--          <el-form-item v-if="[300165,300199].includes(submitData.materialTypeId)" label="文件名称:">-->
          <!--            <el-input v-model="submitData.docTitle" placeholder="请输入内容"></el-input>-->
          <!--          </el-form-item>-->
          <el-form-item label="作业人:">
            {{submitData.handlerName}}
          </el-form-item>
          <el-form-item v-if="![300086,300096,300099,300100,300103,300104,300105,300106,300109,300110,300111,300122,300128,300134,300140,300146,300165,300175,300176,
          300181,300194,300196,300197,300199,300200,300203,300205,300206,300388,301009,301302,301006,301008,301010,301101,301218,301229,301230,301268,301270,301274,
          301279,301290,301224,301291,301306,301312,301325,301333,301336,301337,301343,301354,301355,301363,301364



          ].includes(submitData.materialTypeId)" :label="submitData.materialTypeId == 301225 ? '口审日' : '回复绝限:'">
            {{submitData.deadlineDate}}
          </el-form-item>
          <!--          <el-form-item v-if="submitData.materialTypeId == 301344" label="官方时限:">-->

          <!--          </el-form-item>-->
<!--          <el-form-item v-if="[300122, 301224,301333].includes(submitData.materialTypeId)" label="PCT申请日:">-->
<!--            {{submitData.pctFileDate}}-->
<!--          </el-form-item>-->
<!--          <el-form-item v-if="submitData.materialTypeId == 301279" label="PCT公开日:">-->
<!--            {{submitData.pctOpenDate}}-->
<!--          </el-form-item>-->
<!--          <el-form-item v-if="[300146, 301290].includes(submitData.materialTypeId)" label="公告号:">-->
<!--            {{submitData.declareNo}}-->
<!--          </el-form-item>-->
<!--          <el-form-item v-if="[301009, 301010].includes(submitData.materialTypeId)" label="实审日:">-->
<!--            {{submitData.subexamDate}}-->
<!--          </el-form-item>-->
        </el-row>
<!--        <el-row v-if="[301009,301008,301229].includes(submitData.materialTypeId)">-->
<!--          <el-form-item label="公开日:">-->
<!--            {{submitData.openDate}}-->
<!--          </el-form-item>-->
<!--          <el-form-item label="公开号:">-->
<!--            {{submitData.openNumber}}-->
<!--          </el-form-item>-->
<!--        </el-row>-->
        <el-row v-if="typeName=='无效宣告请求审查决定书'">
          <el-form-item label="官方案件编号:">
            {{submitData.patentNumber}}
          </el-form-item>

          <el-form-item label="决定书号:">
            {{submitData.decisionNo}}
          </el-form-item>
        </el-row>
        <el-row v-if="typeName=='无效宣告请求审查决定书'">
          <el-form-item label="判决结果:">
            {{submitData.judgeResult}}
          </el-form-item>

          <el-form-item label="决定内容:">
            {{submitData.decisionContent}}
          </el-form-item>
        </el-row>
        <el-row v-if="[301204].includes(submitData.materialTypeId)">
          <el-form-item label="著变内容:">
            {{submitData.zbContent+''}}
          </el-form-item>
        </el-row>
        <el-row v-if="[301281].includes(submitData.materialTypeId)">
          <el-form-item label="届满日期:">
            {{submitData.jiemanDate}}
          </el-form-item>
        </el-row>
        <el-row v-if="[301352].includes(submitData.materialTypeId)">
          <el-form-item label="是否保密:">
            {{+submitData.sec ? '是' : '否'}}
          </el-form-item>
        </el-row>
<!--        <el-row v-if="[301011].includes(submitData.materialTypeId)">-->
<!--          <el-form-item label="首次年费:">-->
<!--            {{submitData.firstYearNumber}}-->
<!--          </el-form-item>-->
<!--        </el-row>-->
<!--        <el-row v-if="[301013].includes(submitData.materialTypeId)">-->
<!--          <el-form-item label="公告号:">-->
<!--            {{submitData.declareNo}}-->
<!--          </el-form-item>-->
<!--          <el-form-item label="公告日:">-->
<!--            {{submitData.declareDate}}-->
<!--          </el-form-item>-->
<!--        </el-row>-->
<!--        <el-row v-if="[301013].includes(submitData.materialTypeId)">-->
<!--          <el-form-item label="证书号:">-->
<!--            {{submitData.certificateNumber}}-->
<!--          </el-form-item>-->
<!--          <el-form-item label="授权日:">-->
<!--            {{submitData.certificateDate}}-->
<!--          </el-form-item>-->
<!--        </el-row>-->
<!--        <el-row v-if="[301013].includes(submitData.materialTypeId)">-->
<!--          <el-form-item label="年费监视:">-->
<!--            {{+submitData.isagency ? '是' : '否'}}-->
<!--          </el-form-item>-->
<!--        </el-row>-->
<!--        <el-row v-if="[301213,301218,301230].includes(submitData.materialTypeId)">-->
<!--          <el-form-item label="申请号:">-->
<!--            {{submitData.appNumber}}-->
<!--          </el-form-item>-->
<!--          <el-form-item label="申请日:">-->
<!--            {{submitData.appDate}}-->
<!--          </el-form-item>-->
<!--        </el-row>-->
<!--        <el-row v-if="[301213].includes(submitData.materialTypeId)">-->
<!--          <el-form-item label="有效日:">-->
<!--            {{submitData.validEndDate}}-->
<!--          </el-form-item>-->
<!--        </el-row>-->
<!--        <el-row v-if="[301218,301230].includes(submitData.materialTypeId)">-->
<!--          <el-form-item label="递交日:">-->
<!--            {{submitData.caseSubmitDate}}-->
<!--          </el-form-item>-->
<!--        </el-row>-->
        <el-row v-if="[301018].includes(submitData.materialTypeId)">
          <el-form-item v-if="submitData.djFeeYear" label="代缴年费情况:">
            <span>未缴纳第（{{submitData.djFeeYear}}）年度年费</span>
          </el-form-item>
          <el-form-item v-else label="有效日期:">
            <span>{{submitData.validEndDate}}</span>
          </el-form-item>
        </el-row>
        <el-row v-if="[301216].includes(submitData.materialTypeId)">
          <el-form-item label="延期至日期:">
            {{submitData.yanqiEndDate}}
          </el-form-item>
        </el-row>
        <el-row v-if="[301268].includes(submitData.materialTypeId)">
          <el-form-item label="著变内容:">
            {{submitData.zbContent + ''}}
          </el-form-item>
        </el-row>

        <el-row
          v-if="[300124,300126,300127,300142,300152,300154,300156,300171,300198,300201,301271,301285,301304,301313,301316,301365,301544,301003,301004,301005,
                  301014,301219,301272,301288,301298,301335,301339,301340,301342,301345,301346,301356,301358,301362,301348
          ].includes(submitData.materialTypeId)">
          <el-form-item v-if="![301335].includes(submitData.materialTypeId)" label="审查员信息及电话:">
            {{submitData.sipoScy}}
          </el-form-item>
          <el-form-item v-if="[301346,301356,301005,301365,301544,301014,301285,301304,301358,301348].includes(submitData.materialTypeId)" label="审查部门:">
            {{submitData.scDept}}
          </el-form-item>
          <el-form-item v-if="[301272].includes(submitData.materialTypeId)" label="修改内容:">
            {{submitData.mdContent}}
          </el-form-item>
          <el-form-item v-if="[300152,300154,300156,301335,301340,301342].includes(submitData.materialTypeId)"
                        label="修改更正内容:">
            {{submitData.correctionContent}}
          </el-form-item>

        </el-row>
        <el-row v-if="[301365,301544,301005].includes(submitData.materialTypeId)">
          <el-form-item label="识别通知书次数:">
            {{submitData.shibieNum}}
          </el-form-item>
        </el-row>
<!--        <el-row v-if="[301285,301304,301345,301316].includes(submitData.materialTypeId)">-->
<!--          <el-form-item label="复审官方案件编号:">-->
<!--            {{submitData.patentNumber}}-->
<!--&lt;!&ndash;            <el-input type="text" v-model="submitData.patentNumber"></el-input>&ndash;&gt;-->
<!--          </el-form-item>-->
<!--        </el-row>-->
        <el-row
          v-if="[300142,300171,301285,301304,301365,301544,301003,301004,301005,301014,301272,301298,301339,301346,301356,301358,301362,301348].includes(submitData.materialTypeId)">
          <el-form-item label="引用条款:">
            <template>
              <div v-if="aboutInstruction.length && submitData.materialTypeId !== 301348">
                <span>关于说明书:</span>
                <div v-for="(item, index) in aboutInstruction">{{index + 1 + '.'}}{{(item.lawDesc === '其他' ? (item.lawDesc+':'+item.content) : item.lawDesc) || '不符合' + item.content + '的规定'}}</div>
              </div>
              <div v-if="aboutClaims.length">
                <span>关于权利要求书:</span>
                <div v-for="(item, index) in aboutClaims">
                  <span>{{index + 1 + '.'}} <span v-if="item.lawDesc">权利要求:</span></span>
                  <el-input v-if="item.content" class="claims" style="width: 90%;" type="text" :value="item.content" readonly></el-input>
                  {{item.lawDesc}}
                </div>
              </div>
              <div v-if="otherList.length && submitData.materialTypeId !== 301348">
                <div v-for="(item, index) in otherList">
                  <span>{{index + 1 + '.'}} <span v-if="item.lawDesc">权利要求:</span></span>
                  <el-input v-if="item.content" class="claims" style="width: 90%;" type="text" :value="item.content" readonly></el-input>
                  {{item.lawDesc}}
                </div>
              </div>
            </template>
          </el-form-item>
          <el-form-item v-if="[301304].includes(submitData.materialTypeId)" label="复审决定是否撤销驳回:">
            {{+submitData.bohui ? '是' : '否'}}
            <!--            <el-radio-group v-model="submitData.bohui" style="margin-left: 0px">-->
            <!--              <el-radio :label='1'>是</el-radio>-->
            <!--              <el-radio :label='0'>否</el-radio>-->
            <!--            </el-radio-group>-->
          </el-form-item>
        </el-row>
<!--        <el-row>-->
<!--          <el-form-item label="是否审核:">-->
<!--            {{submitData.audit ? '是' : ''}}-->
<!--          </el-form-item>-->
<!--        </el-row>-->
        <el-row>
          <el-form-item label="上传文件:" class="patent-upload">
            <p v-for="item in materialArray" style="color: #409EFF">
              <a target="_blank" :href="`ipdoc${item.address}`">{{item.name}}</a>
            </p>
            <!--            <el-upload-->
            <!--              ref="upload"-->
            <!--              class="upload-demo"-->
            <!--              drag-->
            <!--              multiple-->
            <!--              name="attachFile"-->
            <!--              :data="getUploadData()"-->
            <!--              :action="creatematerial"-->
            <!--              :file-list="materialArray"-->
            <!--              :on-remove="(file,fileList)=>{ handleRemove(file,fileList,caseData.map(item=>item.caseId))}"-->
            <!--              :on-preview="onPreview"-->
            <!--              :on-success="onsuccess"-->
            <!--              :before-upload="beforeUpload"-->
            <!--            >-->
            <!--              <i class="el-icon-upload"></i>-->
            <!--              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>-->
            <!--            </el-upload>-->
          </el-form-item>
        </el-row>
        <el-row
          v-if="[300171,301285,301304,301365,301544,301003,301004,301005,301014,301298,301339,301346,301356,301358,301362].includes(submitData.materialTypeId)">
          <el-form-item label="对比文件:">
            <div style="width: 100%">
              <!--              <el-button type="primary" size="mini" @click="addDBfile()">添加</el-button>-->
              <el-table
                :data="submitData.ptDbList"
                border
                style="width: auto">
                <el-table-column
                  type="index"
                  label="编号"
                  width="100px">
                </el-table-column>
                <el-table-column
                  label="文件号或名称"
                >
                  <template slot-scope="scope">
                    {{scope.row.dbFile}}
                    <!--                    <el-input type="text" v-model="scope.row.dbFile"></el-input>-->
                  </template>
                </el-table-column>
                <el-table-column
                  label="公开日期"
                >
                  <template slot-scope="scope">
                    {{scope.row.openDate}}
                    <!--                    <el-date-picker-->
                    <!--                      v-model="scope.row.openDate"-->
                    <!--                      value-format="yyyy-MM-dd"-->
                    <!--                      type="date"-->
                    <!--                      placeholder="选择日期">-->
                    <!--                    </el-date-picker>-->
                  </template>
                </el-table-column>
                <!--                <el-table-column-->
                <!--                  label="操作"-->
                <!--                >-->
                <!--                  <template slot-scope="scope">-->
                <!--                    <span style="color: #409EFF;cursor: pointer;" @click="delDBfile(scope.$index)">删除</span>-->
                <!--                  </template>-->
                <!--                </el-table-column>-->
              </el-table>
            </div>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="创建人:">
            {{submitData.creater}}
          </el-form-item>
          <el-form-item label="创建日期:">
            {{submitData.inputDate}}
          </el-form-item>
        </el-row>
        <el-row class="">
          <el-form-item label="更多">
            <div style="padding: 10px 0">
              <el-table :data="caseData" border class="el-table1 el-table2">
                <el-table-column type="index" width="60" label="序号" align="left">
                </el-table-column>
                <el-table-column label="案件文号" prop="agentNum">
                </el-table-column>
                <el-table-column label="复审官方案件编号"
                  v-if="[301285,301304,301345,301316].includes(submitData.materialTypeId)"
                >
                  <template slot-scope="scope">
                    {{scope.row.patentNumber}}
                  </template>
                </el-table-column>
                <el-table-column label="申请日"
                  v-if="[301213,301218,301230,301336].includes(submitData.materialTypeId)"
                >
                  <template slot-scope="scope">
                    {{scope.row.appDate}}
                  </template>
                </el-table-column>
                <el-table-column label="申请号"
                  v-if="[301213,301218,301230,301336].includes(submitData.materialTypeId)"
                >
                  <template slot-scope="scope">
                    {{scope.row.appNumber}}
                  </template>
                </el-table-column>
                <el-table-column label="递交日"
                  v-if="[301218,301230,301336].includes(submitData.materialTypeId)"
                >
                  <template slot-scope="scope">
                    {{scope.row.submitDate}}
                  </template>
                </el-table-column>
                <el-table-column label="有效日"
                  v-if="[301213].includes(submitData.materialTypeId)"
                >
                  <template slot-scope="scope">
                    {{scope.row.validEndDate}}
                  </template>
                </el-table-column>
                <el-table-column label="年费监视" v-if="[301013].includes(submitData.materialTypeId)">
                  <template slot-scope="scope">
                    {{+scope.row.isagency ? '是' : '否'}}
                  </template>
                </el-table-column>
                <el-table-column label="证书号" v-if="[301013,300146].includes(submitData.materialTypeId)">
                  <template slot-scope="scope">
                    {{scope.row.certificateNumber}}
                  </template>
                </el-table-column>
                <el-table-column label="PCT申请号" v-if="[300122,301224,301333].includes(submitData.materialTypeId)">
                  <template slot-scope="scope">
                    {{scope.row.pctFileNo}}
                  </template>
                </el-table-column>
                <el-table-column label="PCT公开号" v-if="[301279].includes(submitData.materialTypeId)">
                  <template slot-scope="scope">
                    {{scope.row.pctOpenNumber}}
                  </template>
                </el-table-column>
                <el-table-column label="授权日" v-if="[301013].includes(submitData.materialTypeId)">
                  <template slot-scope="scope">
                    {{scope.row.certificateDate}}
                  </template>
                </el-table-column>
                <el-table-column label="PCT申请日" v-if="[300122, 301224,301333].includes(submitData.materialTypeId)">
                  <template slot-scope="scope">
                    {{scope.row.pctFileDate}}
                  </template>
                </el-table-column>
                <el-table-column label="PCT公开日" v-if="[301279].includes(submitData.materialTypeId)">
                  <template slot-scope="scope">
                    {{scope.row.pctOpenDate}}
                  </template>
                </el-table-column>
                <el-table-column label="实审日" v-if="[301009, 301010].includes(submitData.materialTypeId)">
                  <template slot-scope="scope">
                    {{scope.row.subexamDate}}
                  </template>
                </el-table-column>
                <el-table-column label="公开号" v-if="[301009,301008,301229].includes(submitData.materialTypeId)">
                  <template slot-scope="scope">
                    {{scope.row.openNumber}}
                  </template>
                </el-table-column>
                <el-table-column label="公开日" v-if="[301009,301008,301229].includes(submitData.materialTypeId)">
                  <template slot-scope="scope">
                    {{scope.row.openDate}}
                  </template>
                </el-table-column>
                <el-table-column label="公告号" v-if="[301013,300146, 301290].includes(submitData.materialTypeId)">
                  <template slot-scope="scope">
                    {{scope.row.declareNo}}
                  </template>
                </el-table-column>
                <el-table-column label="公告日" v-if="[301013,301290].includes(submitData.materialTypeId)">
                  <template slot-scope="scope">
                    {{scope.row.declareDate}}
                  </template>
                </el-table-column>
                <el-table-column label="首次年费" v-if="[301011].includes(submitData.materialTypeId)">
                  <template slot-scope="scope">
                    {{scope.row.firstYearNumber}}
                  </template>
                </el-table-column>
              </el-table>
            </div>

          </el-form-item>
        </el-row>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="closeThisPage()">关 闭</el-button>
        <el-button type="primary" @click="typeInOfficalDoc" v-if="officialCommunicationType==='create'">提交</el-button>
        <el-button class="exactButton" type="primary" @click="auditOfficalDoc"
                   v-if="officialCommunicationType==='audit'">审核</el-button>
        <el-button class="exactButton" type="primary" @click="modifyOfficalDoc"
                   v-if="officialCommunicationType==='edit'">修改</el-button>
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
      :lock-scroll="false"
      title="创建时限"
      class="dialog——body——padding"
      v-dialogDrag
      center
    >
      <poppingTimeLimit v-if="poppingTimeLimitState" :officialCommunication="true" disabled :isPatent="taskType == 4"
                        @cancel="closePoppingTimeLimit" :list="caseDataList"></poppingTimeLimit>
    </el-dialog>
  </el-dialog>
</template>

<script>
  import {
    modifyOfficalDoc,
    queryMaterialTypeByDocId,
    queryAlltask,
    typeInOfficalDoc,
    queryUserAll,
    delCaseMaterial,
    queryMaterialByCaseId,
    queryMaterialType,
    queryMailingType,
    auditOfficalDoc,
    queryDocs,
    modifyMaterialType,
    queryLawList,
    queryCase,
    queryLawCaseClause
  } from '@/api/caseList.js'
  import {creatematerial} from '@/api/ipServiceApi.config.js'
  import {querycustSelectClass, queryOtherCustomerListUrl} from '@/api/caseDetail'
  import {queryZuoyeren} from '@/api/customerList'

  export default {
    components: {
      'poppingTimeLimit': (resolve, reject) => {
        require(['@/views/workbench/toDoTasks/poppingTimeLimit.vue'], resolve)
      },
    },
    props: {
      officialCommunicationState: {},
      business: '',
      officialCommunicationType: {},
      multipleSelection: {},
      taskType: {
        default: 2
      }

    },
    name: "detailOfficial",
    data() {
      return {
        clauseList: [],
        decisionTypeList: [],
        closingMethodList: [],
        caseAttrlist: ['courtCustId', 'collegialBench', 'clerk', 'judge', 'judgeAssistant', 'closeWay', 'judgment', 'compensateAmount', 'compensateAmount', 'clause', 'patentNumber','droitNumber'],
        changeKey: false,
        backData: {},
        choiceOne: 0,
        otherList: [],
        otherCheckList: [],
        lawList: [],
        claimsList: [],
        instructionList: [],
        aboutInstruction: [],
        aboutClaims: [],
        poppingTimeLimitState: false,
        caseDataList: [],
        caseData: [],
        submitData: {
          zbContent: [],
          materialTypeId: '',
          docName: '',
          docTitle: '',
          docDate: '',
          recvDate: '',
          filingDate: '',
          courtRefno: '',
          collegialBench: '',
          judge: '',
          judgeAssistant: '',
          clerk: '',
          openCourtDate: '',
          place: '',
          judgeResult: '',
          respondLimitDate: '',
          acceptDate: '',
          proofLimitDate: '',
          talkLimitDate: '',
          decisionResult: '',
          // memo:'',
           audit:'0',
          //  examiner:'',
          hearWayArray: []
        },
        tableTitleList: this.taskType == 4
          ? [
            {"title": "案件文号", "value": "agentNum"},
            {"title": "案件类型", "value": "caseTypeStr",},
            // {"title": "审级", "value": "judgeRankName"},
            {"title": "案件名称", "value": "caseCnName"},
            {"title": "客户", "value": "custName"},
            {"title": "阶段", "value": "stageName"},
            {"title": "申请日期", "value": "appDate"},
            {"title": "申请号", "value": "appNumber"},
            {"title": "申请人名称", "value": "applicantName"},
          ]
          : [
            {"title": "案件文号", "value": "agentNum"},
            {"title": "案件类型", "value": "caseType",},
            {"title": "审级", "value": "judgeRankName"},
            {"title": "案件名称", "value": "caseName"},
            {"title": "客户", "value": "custName"},
            {"title": "阶段", "value": "stageName"},
            {"title": "立案日期", "value": "caseDate",},
            ],
        materialArrayList: [],
        uploadTable: [],
        userList: [],
        typeNameList: [],
        creatematerial,
        typeName: '',
        materialArray: [],
        querycustSelectClassList: [],
        selectData: {
          hzLists: []
        },
        selectDataByClass: {
          '1042': [],
          '1134': [], '1135': [], '1027': [], '1029': [],
        },
        pRules: {
          materialTypeId: [
            {required: true, message: '请选择官文类型', trigger: 'change'}
          ]

        },
        rules: {
          underlyingAmount: [
            {required: true, message: '请输入标的金额', trigger: 'change'}
          ],
          clause: [
            {required: true, message: '请选择所涉及条款', trigger: 'change'}
          ],
          compensateAmount: [
            {required: true, message: '请输入判赔(和解)金额', trigger: 'change'}
          ],
          courtCustId: [
            {required: true, message: '请选择管辖法院', trigger: 'change'}
          ],
          courtRefno: [
            {required: true, message: '请录入法院案号', trigger: 'change'}
          ],
          hearWayArray: [
            {required: true, message: '请选择审理方式', trigger: 'change' }
          ],
          openCourtDate: [
            {required: true, message: '请选择开庭日期', trigger: 'change'}
          ],
          closeWay: [
            {required: true, message: '请选择结案方式', trigger: 'change'}
          ],
          decisionResult: [
            {required: true, message: '请选择裁定结果', trigger: 'change'}
          ],
          collegialBench:[
            { required: true, message: '请输入审判长', trigger: 'change' }
          ],
          judge:[
            { required: true, message: '请输入审判员', trigger: 'change' }
          ],
          judgeAssistant:[
            { required: true, message: '请输入法官助理', trigger: 'change' }
          ],
          clerk:[
            { required: true, message: '请输入法书记员', trigger: 'change' }
          ],
          judgment:[
            { required: true, message: '请输入判决结果(行政和民事)', trigger: 'change' }
          ],
        }
      }
    },
    created() {
      console.log(this.business,'官方通知business')
      if(this.officialCommunicationType==='create'){
         queryCase({
          taskType: this.taskType,
          caseIds: this.multipleSelection.map(item => item.caseId)
        }).then(res=>{
          this.caseData = res.data
          // 5870数据同步
          const caseObj = JSON.parse(JSON.stringify(this.caseData[0]))
            for(let key in caseObj){
              if(!this.caseAttrlist.includes(key)){
                delete caseObj[key]
              }
            }
          this.submitData = {...this.submitData, ...caseObj}
           this.$set(this.submitData, 'clauses', [])
            if (this.submitData.clause) {
              this.submitData.clauses = this.submitData.clause.split(',')
            }
           if (this.taskType == 4) {
            // this.queryLawList()
            this.submitData.audit = this.submitData.audit ? '1' : '0';
            this.submitData.validEndDate = res.data[0].validEndDate || ''
          }
         })
      }
      // this.getTmDate()
      this.queryAlltask()
      this.queryUserAll()
      this.queryOtherCustomerListUrl()
      this.queryLawCaseClause()
    },
    methods: {
      queryLawCaseClause() {
        queryLawCaseClause().then(res => {
          this.clauseList = res.data
          this.clauseList.forEach(item => {
            if (!item.typeClause) {
              item.typeClause = item.lawType
            }
          })
        })
      },
      queryZuoyeren(n){
        if(this.submitData.handler || this.officialCommunicationType == 'view' || !this.multipleSelection.map(item => item.caseId)[0] || !n)return;
        queryZuoyeren({caseId:this.multipleSelection.map(item => item.caseId)[0],materialTypeId: n}).then(res=>{
          if(res.data&&res.data.length){
            this.$set(this.submitData, 'handler', res.data[0].handler)
            // this.submitData.handler = res.data[0].handler
          }
        })
      },
      focusCheck(list, id){
        !list.includes(id) && list.push(id);
      },
      changeClaims(v, i) {

      },
      queryLawList(v) {
        if(![300142,300171,301285,301304,301365,301544,301003,301004,301005,301014,301272,301298,301339,301346,301356,301358,301362,301348].includes(this.submitData.materialTypeId))return;
        queryLawList({typeName: v || ''}).then(res => {
          this.lawList = res.data
          if (this.officialCommunicationType == 'view') {
            this.aboutInstruction = this.submitData.ptLawList.filter(item => item.lawType == 1)
            this.aboutClaims = this.submitData.ptLawList.filter(item => item.lawType == 2)
            this.otherList = this.submitData.ptLawList.filter(item => item.lawType != 1 && item.lawType != 2)
          } else {
            this.aboutInstruction = this.lawList.filter(item => item.lawType == 1)
            this.aboutClaims = this.lawList.filter(item => item.lawType == 2)
            this.otherList = this.lawList.filter(item => item.lawType != 1 && item.lawType != 2)

            this.instructionList = this.submitData.ptLawList && this.submitData.ptLawList.filter(item => item.lawType == 1).length && this.submitData.ptLawList.filter(item => item.lawType == 1).map((i, index) => {
              // this.aboutInstruction.find(k => k.lawId == i.lawId).content = i.content
              let ind = this.aboutInstruction.findIndex(k => k.lawId == i.lawId)
              ind !== -1 && this.$set(this.aboutInstruction[ind], 'content', i.content)
              return i.lawId
            }) || []

            this.claimsList = this.submitData.ptLawList && this.submitData.ptLawList.filter(item => item.lawType == 2).length && this.submitData.ptLawList.filter(item => item.lawType == 2).map((i, index) => {
              let ind = this.aboutClaims.findIndex(k => k.lawId == i.lawId)
              ind !== -1 && this.$set(this.aboutClaims[ind], 'content', i.content)
              return i.lawId
            }) || []

            this.otherCheckList = this.submitData.ptLawList && this.submitData.ptLawList.filter(item => item.lawType != 1 && item.lawType != 2).length && this.submitData.ptLawList.filter(item => item.lawType != 1 && item.lawType != 2).map((i, index) => {
              let ind = this.otherList.findIndex(k => k.lawId == i.lawId)
              ind !== -1 && this.$set(this.otherList[ind], 'content', i.content)
              return i.lawId
            }) || []
          }

        })
      },
      delDBfile(index) {
        this.submitData.ptDbList.splice(index, 1)
      },
      addDBfile() {
        if (!this.submitData.ptDbList) {
          this.submitData.ptDbList = []
        }
        //patentDocDuibiList
        this.submitData.ptDbList.push({dbFile: '', openDate: ''})
        this.$forceUpdate()
      },
      takeCaseDetail(row) {
        this.closeThisPage()
        this.$router.push('/workbench/case/seeCaseDetail/' + row.caseId + `?taskType=${this.taskType}`)
      },
      querycustSelectClass() {
        querycustSelectClass({classId: '1028,1164,1165'}).then(res => {
          this.querycustSelectClassList = res.data['1028']
          this.decisionTypeList = res.data['1164']
          this.closingMethodList = res.data['1165']
        })
      },
      // getTmDate()
      async queryAlltask() {
        // this.caseData = this.multipleSelection
        // this.queryMaterialType()
        let {data} = await this.queryMaterialTypeByDocId()
        this.typeNameList = data;
        // this.typeNameList.forEach(item=>{
        //   console.log(item.typeName, ' : ',item.materialTypeId)
        // })
        if (this.officialCommunicationType != 'create') {
          this.queryDocs()
        }
        if (this.officialCommunicationType == 'create') {
          // this.queryLawList()
          if (this.multipleSelection[0].filingDate) {
            this.submitData.filingDate = this.multipleSelection[0].filingDate || ''
          }

          this.submitData.docDate = this.formatDate(new Date())
          this.submitData.recvDate = this.formatDate(new Date())
          this.$set(this.submitData, 'audit', '1')
          this.$set(this.submitData, 'createDate', this.formatDate(new Date()))
          this.$set(this.submitData, 'inputDate', this.formatDate(new Date()))
          // this.submitData.createDate=this.formatDate(new Date())
          this.submitData.createUserId = this.$store.state.user.userId
          this.submitData.operator = this.$store.state.user.userId

        }
      },
      handleClose() {
        return
        // this.closeThisPage()
      },
      closeThisPage(flag) {
        // if(this.queryInfo.insId){
        //   this.$store.commit('caseInformation/SET_PREONLYID',this.queryInfo.insId)
        // }
        if (this.multipleSelection[0]&&this.multipleSelection[0].insId) {
          this.$store.commit('caseInformation/SET_PREONLYID', this.multipleSelection[0].insId)
        }
        this.$emit('closeThisPage', flag)
      },
      queryUserAll() {
        queryUserAll().then(res => {
          if (res.success) {
            this.userList = res.data
          }
        })
      },
      queryOtherCustomerListUrl() {
        queryOtherCustomerListUrl({isOfficial: '1'}).then(res => {
          this.selectData.hzLists = res.data
        })

        querycustSelectClass({classId: '1042,1134,1135,1027,1029'}).then(response => {
          this.selectDataByClass = response.data
        })
      },
      queryMaterialTypeByDocId(doctId) {
        let data = {}
        if (this.taskType == 4) {
          data = {
            // sign: 100, //所有类型
            sign: 2,
            caseTypeId: this.$commonUtils.getCaseTypeIdByTaskType(+this.taskType),
            // caseId: this.caseData.map(item => item.caseId)[0]
          }
        } else {
          data = {sign: 2, caseTypeId: this.$commonUtils.getCaseTypeIdByTaskType(+this.taskType)}
        }
        return queryMaterialType(data)
      },
      formatDate(time) {
        return this.$commonUtils.formatDate(time)
      },
      handleRemove(file, fileList, caseId) {
        // if(!this.caseData.map(item => item.caseId).length){
        //   this.$message('缺少案件信息，操作失败')
        //     return false
        // }
        if (this.taskType == 4) {
          if (!this.submitData.docTitle || !this.submitData.materialTypeId) {
            this.$message('请选择官文类型和填写文件名称')
            return false
          }
        } else if (!this.submitData.docName || !this.submitData.materialTypeId) {
          this.$message('请选择官文类型和填写文件名称')
          return false
        }
        let delmaterialId;
        if (file.response) {
          delmaterialId = file.response.data[0].materialId;
        } else {
          delmaterialId = file.materialId
        }
        let objInstId = ''
        if(this.officialCommunicationType != 'create'){
          objInstId = this.multipleSelection[0].insId || ''
        }
        delCaseMaterial({materialId: delmaterialId, caseIdArray: this.caseData.map(item => item.caseId), objInstId, objType: this.$commonUtils.getObjTypeByTaskType(+this.taskType)}).then(res => {
          this.materialArray.splice(this.materialArray.map(item => item.materialId).indexOf(delmaterialId), 1)
        })
      },
      transformation(arr, val, valType, labelStr) {
        if (arr && arr.length) {
          var item = arr.find(item => item[valType] == val)
          if (item) {
            return item[labelStr]
          } else {
            return ''
          }
        }
        return ''
      },
      beforeUpload() {
        // if(!this.caseData.map(item => item.caseId).length){
        //   this.$message('缺少案件信息，操作失败')
        //     return false
        // }
        if (this.taskType == 4) {
          if (!this.submitData.docTitle || !this.submitData.materialTypeId) {
            this.$message('请选择官文类型和填写文件名称')
            return false
          }
        } else if (!this.submitData.docName || !this.submitData.materialTypeId) {
          this.$message('请选择官文类型和填写文件名称')
          return false
        }
      },
      getUploadData(caseIds) {
        let objInstId = ''
        if(this.officialCommunicationType != 'create'){
          objInstId = this.multipleSelection[0].insId || ''
        }
        const data = {
          tokenID: this.$store.getters.token,
          // caseTypeId:this.$commonUtils.getCaseTypeIdByBusiness(+this.business),
          caseIds: this.multipleSelection.map(item => item.caseId).join(','),
          // custId: this.caseData[0].custId,
          type: '2',
          objType: this.$commonUtils.getObjTypeByTaskType(+this.taskType),
          docName: this.submitData.docName || this.submitData.docTitle,
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
        if (document.getElementById('startTelMedicine')) {
          document.body.removeChild(document.getElementById('startTelMedicine'))
        }
        document.body.appendChild(a)
        a.click()
      },
      onsuccess(res, file, fileList) {
        res.data.forEach(item => {
          item.name = item.materialName
          setTimeout(() => {
            this.materialArray.push(item)
          }, 300)
        })
      },
      queryDocs() {
        if(!this.multipleSelection.length)return;
        queryDocs({
          taskType: this.taskType,
          insIdList: [...new Set(this.multipleSelection.map(item => item.insId))],
          materialTypeId: this.submitData.materialTypeId
        }).then(res => {
          if(this.taskType == 4){
            this.submitData = {...res.data[0]}
            this.submitData.validEndDate = res.data[0].caseArray.map(item => item.validEndDate).filter(Boolean)[0]
          }else if(this.taskType == 2){
            const caseObj = JSON.parse(JSON.stringify(res.data[0].caseArray[0]))
            for(let key in caseObj){
              if(!this.caseAttrlist.includes(key)){
                caseObj[key] = undefined
              }
            }
            this.submitData = {...caseObj, ...res.data[0]}
          } else{
            this.submitData = {...res.data[0].caseArray[0], ...res.data[0]}
          }
          this.$set(this.submitData, 'clauses', [])
          if (this.submitData.clause) {
            this.submitData.clauses = this.submitData.clause.split(',')
          }
          if(this.submitData.zbContent){
            this.submitData.zbContent = this.submitData.zbContent.split(',')
          }
          if(!this.submitData.zbContent){
            this.$set(this.submitData, 'zbContent', [])
          }
          this.caseData = res.data[0].caseArray
          this.backData = JSON.parse(JSON.stringify(this.submitData))
          if(this.submitData.djFeeYear){
            this.choiceOne = 1
          }else if(this.submitData.validEndDate){
            this.choiceOne = 2
          }
          this.materialArray = JSON.parse(JSON.stringify(this.submitData.materialArray))
          delete this.submitData.materialArray
          if (this.taskType == 4) {
            // this.queryLawList()
            this.submitData.audit = this.submitData.audit ? '1' : '0';
          }
        })
      },
      handleCaseData(){
        this.submitData.ptCaseList = this.caseData.map(item=>({
            declareDate: item.declareDate, // 公告日
            declareNo: item.declareNo, //公告号
            pctFileNo: item.pctFileNo, // pct申请号
            openDate: item.openDate,// 公开日
            subexamDate: item.subexamDate, //实审日
            openNumber: item.openNumber,//公开号
            firstYearNumber: item.firstYearNumber, // 首次年费
            isagency: item.isagency, //年费监视
            appNumber: item.appNumber, // 申请号
            appDate: item.appDate, // 申请日
            submitDate: item.submitDate, // 递交日
            validEndDate: item.validEndDate, // 有效日
            pctOpenNumber: item.pctOpenNumber, // PCT公开号
            pctFileDate: item.pctFileDate, // PCT申请日
            pctOpenDate: item.pctOpenDate, // PCT公开日
            certificateDate: item.certificateDate, //授权日
            certificateNumber: item.certificateNumber, // 证书号
            patentNumber: item.patentNumber, // 复审官方案件编号
            caseId: item.caseId
          }))
      },
      async auditOfficalDoc() {
        this.$commonUtils.handleObjNullAttr(this.submitData, this.backData)
        // const [err, success] = await this.$commonUtils.awaitWrap(this.$refs.submission.validate())
        // if (!success) {
        //   return
        // }
        const formName = this.taskType == 4 ? 'pSubmission' : 'submission';
        if(!this.$commonUtils.formValidate(this.$refs[formName]))return;
        if (!this.materialArray.length) {
          this.$message.error('请上传文件')
          return
        }
        if (!this.submitData.materialTypeId) {
          this.$message.error('请选择官文类型')
          return
        }
        delete this.submitData['caseArray']
        delete this.submitData.caseStatus
        if (this.taskType == 4) {
          this.handleCaseData()
          for (var key in this.submitData) {
            if (!this.submitData[key] && this.submitData[key] !== 0 && this.submitData[key] !== false) {
              delete this.submitData[key]
            }
            if (key == 'audit') {
              this.submitData[key] = +this.submitData[key]
            }
            // if(key == 'ptCaseList'){
            //   delete this.submitData['ptCaseList']
            // }
          }
          this.submitData.patentDocLawList = this.lawList.filter(item => [...this.instructionList, ...this.claimsList, ...this.otherCheckList].find(i => i == item.lawId))
          this.submitData.patentDocDuibiList = this.submitData.ptDbList

          // this.submitData.ptLawList = this.lawList.filter(item => [...this.instructionList, ...this.claimsList].find(i => i == item.lawId))
        }
        const data = {
          userId: this.$store.getters.userId,
          caseIds: this.caseData.map(item => item.caseId),
          insIdList: [...new Set(this.multipleSelection.map(item => item.insId))],
          materialIdList: this.materialArray.map(item => item.materialId),
          taskType: this.taskType,
          result: 1,
        }
        delete this.submitData.lawCaseList
        delete this.submitData.patentType
        if (!this.submitData.judgeResult) {
          this.submitData.judgeResult = '0000'
        }
        // const data = {
        //   userId: this.$store.getters.userId,
        //   caseIds: this.caseData.map(item => item.caseId),
        //   insIdList: this.caseData.map(item => item.insId),
        //   result: 1,
        //   materialIdList: this.materialArray.materialId.map(item => item.materialId),
        //   taskType: this.taskType
        // }
        this.submitData.zbContent = String(this.submitData.zbContent.filter(item=>item != 'undefined'))
        this.taskType == 2 && this.handleSSCaseData()
        auditOfficalDoc(Object.assign(data, this.submitData)).then(res => {
          if(res.messageType == 20){
            // this.$message.error(res.message)
            this.$confirm(res.message,
              "提示",
              {
                confirmButtonText: "确定",
                showCancelButton: false,
                // cancelButtonText: "取消",
                type: "warning"
              }
            ).then(()=>{})
          }
          this.closeThisPage(true)
        })
      },
      async modifyOfficalDoc() {
        this.$commonUtils.handleObjNullAttr(this.submitData, this.backData)
        if (this.taskType != 4) {
          // const [err, success] = await this.$commonUtils.awaitWrap(this.$refs.submission.validate())
          // if (!success) {
          //   return
          // }
          const formName = this.taskType == 4 ? 'pSubmission' : 'submission';
          if(!this.$commonUtils.formValidate(this.$refs[formName]))return;
        }
        // return
        if (!this.materialArray.length) {
          this.$message.error('请上传文件')
          return
        }
        if (!this.submitData.materialTypeId) {
          this.$message.error('请选择官文类型')
          return
        }
        delete this.submitData['caseArray']
        delete this.submitData.caseStatus
        if (this.taskType == 4) {
          // delete this.submitData['caseArray']
          this.handleCaseData()
          for (var key in this.submitData) {
            if (!this.submitData[key] && this.submitData[key] !== 0 && this.submitData[key] !== false) {
              delete this.submitData[key]
            }
            if (key == 'audit') {
              this.submitData[key] = +this.submitData[key]
            }
            // if(key == 'ptCaseList'){
            //   delete this.submitData['ptCaseList']
            // }
          }
          this.submitData.patentDocLawList = this.lawList.filter(item => [...this.instructionList, ...this.claimsList, ...this.otherCheckList].find(i => i == item.lawId))
          this.submitData.patentDocDuibiList = this.submitData.ptDbList

          // this.submitData.ptLawList = this.lawList.filter(item => [...this.instructionList, ...this.claimsList].find(i => i == item.lawId))
        }

        // if (!Object.prototype.toString.call(this.submitData.tmCaseList[0].materialArray).includes('Array') || !this.submitData.tmCaseList[0].materialArray.length) {
        //   this.$message.error('请上传文件')
        //   return
        // }
        const data = {
          userId: this.$store.getters.userId,
          caseIds: this.caseData.map(item => item.caseId),
          insIdList: [...new Set(this.multipleSelection.map(item => item.insId))],
          materialIdList: this.materialArray.map(item => item.materialId),
          taskType: this.taskType
        }
        delete this.submitData.lawCaseList
        delete this.submitData.patentType
        if (!this.submitData.judgeResult) {
          this.submitData.judgeResult = '0000'
        }
        this.submitData.zbContent = String(this.submitData.zbContent.filter(item=>item != 'undefined'))
        this.taskType == 2 && this.handleSSCaseData()
        modifyOfficalDoc(Object.assign(data, this.submitData)).then(res => {
          this.closeThisPage(true)
        })
      },
      handleSSCaseData(){
        if(!((this.typeName=='受理通知书' && this.business ==11)||this.typeName=='应诉通知书')){
          this.submitData.courtCustId = undefined
        }
        if(!(this.typeName=='合议庭组成人员通知书' || (this.typeName=='受理通知书' && this.business ==11) || this.typeName=='开庭传票' || this.typeName=='集约送达结束')){
          this.submitData.collegialBench = undefined
          this.submitData.clerk = undefined
          this.submitData.judge = undefined
          this.submitData.judgeAssistant = undefined
        }
        if(this.typeName!=='判决书'){
          this.submitData.closeWay = undefined
        }
        if(!(this.typeName==='判决书' || this.caseData.length&&this.caseData[0].caseType=='专利无效'&&this.typeName=='官方通知-无效宣告请求审查决定书')){
          this.submitData.judgment = undefined
        }
        // if(this.typeName!=='开庭传票'){
        //   this.submitData.hearWayArray = undefined
        // }
      },
      async typeInOfficalDoc() {
        if (this.taskType != 4) {
          // const [err, success] = await this.$commonUtils.awaitWrap(this.$refs.submission.validate())
          // if (!success) {
          //   return
          // }
          const formName = this.taskType == 4 ? 'pSubmission' : 'submission';
          if(!this.$commonUtils.formValidate(this.$refs[formName]))return;
        }
        if (!this.materialArray.length) {
          this.$message.error('请上传文件')
          return
        }
        if (!this.submitData.materialTypeId) {
          this.$message.error('请选择官文类型')
          return
        }
        if (!this.caseData.map(item => item.caseId).length) {
          this.$message.error('缺少案件信息，操作失败！')
          return
        }
        if (this.taskType == 4) {
          this.handleCaseData()
          this.submitData.patentDocDuibiList = this.submitData.ptDbList
          this.submitData.patentDocLawList = this.lawList.filter(item => [...this.instructionList, ...this.claimsList, ...this.otherCheckList].find(i => i == item.lawId))
        }
        const data = {
          userId: this.$store.getters.userId,
          caseIds: this.caseData.map(item => item.caseId),
          paperofficial: true,
          materialIdList: this.materialArray.map(item => item.materialId),
          taskType: this.taskType
        }
        if (this.caseData[0]&&this.caseData[0].taskId) {
          data.taskIdList = this.caseData.map(item => item.taskId)
        }
        this.submitData.zbContent = String(this.submitData.zbContent.filter(item=>item != 'undefined'))
        typeInOfficalDoc(Object.assign(data, this.submitData)).then(res => {
          // res={"success":true,"data":[{"caseId":450011,"custId":35639,"appId":null,"caseName":"MIP麦德龙不服北京知产院就第G1333231号“METRO PROFESSIONAL”商标作出的一审判决（7类）","caseDate":1586361600000,"caseTypeId":94,"status":"进行中","agentNum":"LD2020000260","createDate":1586339900000,"ownerDeptId":null,"createUserId":5108,"voluStatus":2,"voluStatusDate":1586339902000,"placeArea":null,"refSuffix":"-TA-2-R","custRefno":null,"fromType":null,"fromDescription":null,"caseLevel":1,"standard":null,"discount":80.0000,"appFromto":"外-内","backDesc":null,"agencyId":1,"memo":null,"dataSource":"wpm-450011","instructions":null,"droitNumber":"G1333231","goodClasses":null,"custName":"MIP METRO GROUP","appName":null,"caseTypeStr":"商标行政诉讼","tltId":null,"deptId":null,"deptIdStr":null,"paymentDeptId":null,"paymentDeptIdStr":null,"parentId":null,"caseIds":null,"respondentNameCn":null,"timelimit":{"tltId":null,"caseId":450011,"custId":35639,"senderUserId":1,"execUserId":null,"watcherUserIds":null,"rempId":null,"wpmElemid":null,"upcaseVolstatusId":null,"writeoffUserId":null,"undoUserId":null,"tltTypeId":300003,"sendDate":"2020-10-30","createDate":null,"abslimitDate":"2020-11-29","abslimitInternalDate":"2020-11-28","caption":"证据提交时限","fromSource":null,"writeoffState":null,"cmplDate":null,"writeoffDesc":null,"writeoffDate":null,"memo":null,"undoDate":null,"dataSource":null,"decription":null,"kind":1,"kindStr":null,"typeName":null,"timelimitWorkgroupArray":[],"watcherUserIdArray":[],"agentNum":null,"senderUserName":null,"caseName":null,"custName":null,"applicantName":null,"stageName":null,"caseTypeName":null,"materialIds":null,"materialArray":[],"isExamine":null,"droitNumber":null,"appFromto":null,"goodClasses":null,"caseTypeId":94,"isSign":null,"caseDate":null,"tmGoodClasses":null,"timeWorks":null,"writeoffUserName":null,"watcherUserNmaes":null,"writeoffStateStr":null,"objType":1118,"objInstId":5737752,"appDate":null,"caseIdArray":null,"tltIdArray":null,"caseStatus":null,"isSubmitWriteoff":null,"isRevocation":null,"tltIds":null,"isSignStr":null,"appState":null,"isAutoCreate":1,"timelimitUsers":null,"operation":null,"changeCaseId":null,"changeAgentNum":null,"workgroupArray":[{"wrkId":91,"timelimitUserArray":[3092,4210,4784,4959,4985,5087]},{"wrkId":2070,"timelimitUserArray":[3161,3330,5032,5108,4870]}]}}],"total":null,"currPage":null,"message":"完成录入官文","messageType":13}
          // res={"success":true,"data":[{"caseId":30018778,"custId":35516,"appId":46395,"caseName":"雀巢不服国家商标局关于第19153944号“启赋”商标无效宣告裁定","caseDate":1595920629000,"caseTypeId":94,"status":"进行中","agentNum":"LD2020300155","createDate":1595918425000,"ownerDeptId":null,"createUserId":4127,"voluStatus":null,"voluStatusDate":null,"placeArea":null,"refSuffix":null,"custRefno":"TCF-99807","fromType":null,"fromDescription":null,"caseLevel":1,"standard":null,"discount":100.0000,"appFromto":"外-内","backDesc":null,"agencyId":null,"memo":"","dataSource":null,"instructions":null,"droitNumber":"19153944","goodClasses":null,"custName":"Nestle","appName":"雀巢产品有限公司","caseTypeStr":"商标行政","tltId":null,"deptId":null,"deptIdStr":null,"paymentDeptId":null,"paymentDeptIdStr":null,"parentId":null,"caseIds":null,"respondentNameCn":null,"timelimit":{"tltId":null,"caseId":30018778,"custId":35516,"senderUserId":1,"execUserId":null,"watcherUserIds":null,"rempId":null,"wpmElemid":null,"upcaseVolstatusId":null,"writeoffUserId":null,"undoUserId":null,"tltTypeId":300003,"sendDate":"2020-10-30","createDate":null,"abslimitDate":"2020-11-29","abslimitInternalDate":"2020-11-28","caption":"证据提交时限","fromSource":null,"writeoffState":null,"cmplDate":null,"writeoffDesc":null,"writeoffDate":null,"memo":null,"undoDate":null,"dataSource":null,"decription":null,"kind":1,"kindStr":null,"typeName":null,"timelimitWorkgroupArray":[],"watcherUserIdArray":[],"agentNum":null,"senderUserName":null,"caseName":null,"custName":null,"applicantName":null,"stageName":null,"caseTypeName":null,"materialIds":null,"materialArray":[],"isExamine":null,"droitNumber":null,"appFromto":null,"goodClasses":null,"caseTypeId":94,"isSign":null,"caseDate":null,"tmGoodClasses":null,"timeWorks":null,"writeoffUserName":null,"watcherUserNmaes":null,"writeoffStateStr":null,"objType":1118,"objInstId":30002059,"appDate":null,"caseIdArray":null,"tltIdArray":null,"caseStatus":null,"isSubmitWriteoff":null,"isRevocation":null,"tltIds":null,"isSignStr":null,"appState":null,"isAutoCreate":1,"timelimitUsers":null,"operation":null,"changeCaseId":null,"changeAgentNum":null,"workgroupArray":[{"wrkId":2263,"timelimitUserArray":[3161,3708,3866,4127,4128,4181,4257,5014,4711,4800,300056]},{"wrkId":2081,"timelimitUserArray":[3090,3290,3571,3145,3329,4878,4877,4203,4968,5096,2869,5147,4252,5219,3700,5013,300017,300019,5107,5222]},{"wrkId":300006,"timelimitUserArray":[3145,4877]}]}}],"total":null,"currPage":null,"message":"完成录入官文","messageType":13}
          if (res.messageType == 12) {
            this.$confirm(res.message,
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
          if (res.messageType == 13) {
            this.caseDataList = res.data
            this.poppingTimeLimitState = true
            return;
          }
          this.closeThisPage(true)
        })
      },
      closePoppingTimeLimit() {
        this.poppingTimeLimitState = false
        this.closeThisPage(true)
      },
      handleChangeTypeName(n) {
        this.changeKey = !this.changeKey
        this.typeName = this.typeNameList.find(item => item.materialTypeId === n).typeName
        this.submitData.docName = this.typeName
        this.submitData.docTitle = this.typeName
        if (this.materialArray && this.materialArray.length) {
          modifyMaterialType({
            materialTypeId: n,
            materialIdList: this.materialArray.filter(item => item.materialId).map(item => item.materialId)
          }).then(res => {

          })
        }
      },
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
    watch: {
      'submitData.clauses': {
        handler(v){
          if(v){
            this.$set(this.submitData, 'clause', v.join(','))
          }
        },
        immediate: true
      },
      choiceOne(n){
        if(n==2){
          this.submitData.djFeeYear = ''
        }
      },
      typeName(n) {
        if (n && this.taskType == 4) {
          this.queryLawList(n)
        }
      },
      'submitData.materialTypeId'(n) {
        // if(n){
        //  this.queryDocs()
        // }
        this.typeName = this.typeNameList.find(item => item.materialTypeId === n) && this.typeNameList.find(item => item.materialTypeId === n).typeName
        if (this.typeName.includes('裁定书')) {
          this.querycustSelectClass()
        }
        if(this.taskType == 4 && this.officialCommunicationType != 'view'){
          this.queryZuoyeren(n)
        }
      },
      officialCommunicationState(n) {
        console.log(n)
      }
    },
    filters: {
      objectionDate(time) {
        if (!time) {
          return
        }
        var d = new Date(time);
        d.setMonth(d.getMonth() + 3);
        d.setDate(d.getDate() - 1)
        var yy1 = d.getFullYear();
        var mm1 = d.getMonth() + 1;
        var dd1 = d.getDate();
        if (mm1 < 10) {
          mm1 = '0' + mm1;
        }
        if (dd1 < 10) {
          dd1 = '0' + dd1;
        }
        return yy1 + '-' + mm1 + '-' + dd1
      },
      validEndDate(time) {
        if (!time) {
          return
        }
        var d = new Date(time);
        d.setFullYear(d.getFullYear() + 10)
        d.setDate(d.getDate() - 1)
        var yy1 = d.getFullYear();
        var mm1 = d.getMonth() + 1;
        var dd1 = d.getDate();
        if (mm1 < 10) {
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
    justify-content: center;
    padding: 20px;
    margin: 0 20px;

    .el-select, .el-input, .el-date-picker, .el-textarea {
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
      /*align-items: center;*/

      .el-form-item {
        width: 100%;
        display: flex;
        border: 1px solid #EBEEF5;
        border-bottom: 0;
        margin-bottom: 0;

        /deep/ .el-form-item__label {
          flex-shrink: 0;
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
        content: '';
        width: 50%;
        height: 1px;
        background: #EBEEF5;
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

  /deep/ .el-dialog__headerbtn {
    .el-dialog__close {
      display: none;
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

  /deep/ .el-form-item__error {
    position: relative;
    top: 0;
  }

  .patent-upload {
    .upload-demo {
      padding-top: 15px;
    }

    .el-upload-dragger {
      height: 46px;

      .el-icon-upload {
        margin: 0;
      }
    }
  }

  .claims {
    > > > .el-input__inner {
      border: none;
      border-bottom: 1px solid #dcdfe6;
      border-radius: 0;
    }
  }
  .shuoming-check {
    >>>.el-checkbox__label{
      width: 50%;
    }
  }
  .claims {
    > > > .el-input__inner {
      border: none;
      border-bottom: 1px solid #dcdfe6;
      border-radius: 0;
      background-color: transparent;
    }
  }
  >>>.yinyong {
    .el-form-item__content{
      width: 50%;
      overflow: hidden;
    }
  }
  >>>.flex-input{
    .el-checkbox__label{
      width: 80%;
    }
  }
  >>>.el-table.el-table2{
    margin: 0;
    th{
      padding: 0;
    }
  }
  /deep/ .el-upload-dragger{
    height: 46px;
  }
</style>
