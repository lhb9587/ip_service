<template>
  <div>
  <el-dialog
    :title="title"
    :visible.sync="submissionState"
    width="70%"
    :before-close="handleClose"
    :close-on-click-modal="false"
    v-dialogDrag
    height="100vh"
    :modal="false"
    top="0"
    append-to-body
  >
    <el-table :data="multipleSelection" border class="el-table1">
      <el-table-column type="index" width="60" label="序号" align="left">
      </el-table-column>
      <el-table-column align="left" :key="item.title" v-for="item,index in tableTitleList" :label="item.title"
                       :prop="item.value">
        <template slot-scope="scope">
          <p style="margin: 0;cursor: pointer"
             @click="$router.push('/workbench/case/seeCaseDetail/'+scope.row.caseId+`?taskType=${this.taskType || ''}`)">
            {{scope.row[item.value]}}</p>
        </template>
      </el-table-column>
    </el-table>
    <!--    专利-->
    <div v-if="taskType == 4 && submissionType == 'view'" class="title">
        <span>
          递交事项
        </span>
    </div>
    <el-form v-if="taskType == 4 && submissionType == 'view'" class="" label-width="206px"
             style="padding: 0; overflow-x: auto; ">
      <el-row>
        <el-form-item label="递交方式:" prop="submitMode">
          {{submitData.submitMode}}
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="递交事项:" prop="submitMode">
          {{submitData.reportMatter}}
        </el-form-item>
      </el-row>

      <!--      意见陈述（非正常申请）-->
      <el-row v-if="submitData.reportMatter === '意见陈述（非正常申请）'">
        <el-form-item label="陈述事项:">
          <span v-if="submitData.csitemList.includes('1')">
            针对国家知识产权局于: {{submitData.dispatchDate}} 发出的: {{submitData.docTitle}} 通知书(发文序号: {{submitData.documentNo}} )陈述意见。
          </span>
          <span v-if="submitData.csitemList.includes('2')">
            针对国家知识产权局于: {{submitData.dispatchDate}} 发出的: {{submitData.docTitle}} 通知书(发文序号: {{submitData.documentNo}} )补充陈述意见。
          </span>
          <span v-if="submitData.csitemList.includes('3')">
            其他事宜
          </span>
        </el-form-item>
      </el-row>
      <el-row v-if="submitData.reportMatter === '意见陈述（非正常申请）'">
        <el-form-item label="意见陈述书附页:" prop="">
          <div style="display: flex;justify-items: flex-start;align-items: center">
            <div
              style="width: 70%; display: flex;align-items: center">
              <up-load-files :view="true" fileType="意见陈述书附页" :flielist="yjcsfyList" :cur-case-id="curCaseId[0]"
                             :task-type="taskType"
                             :item="{typeName: '意见陈述书附页',materialTypeId: 301460 }"
                             @uploadSuccess="uploadSuccess" @removeFile="removeFile"></up-load-files>

            </div>
          </div>
        </el-form-item>
      </el-row>

      <!--      意见陈述（行政复议）-->
      <el-row v-if="submitData.reportMatter === '意见陈述（行政复议）'">
        <el-form-item label="陈述事项:">
          <span v-if="submitData.csitemList.includes('1')">主动提供证据(根据行政复议法实施条例第44条的规定)</span>
          <span v-if="submitData.csitemList.includes('2')">要求撤回行政复议申请(根据行政复议法第41条的规定)</span>
          <span v-if="submitData.csitemList.includes('3')">其他事宜{{ submitData.qita || ''}}</span>
          <span v-if="submitData.csitemList.includes('4')">
            针对国家知识产权局于 {{submitData.dispatchDate}} 发出的 {{submitData.docTitle}} 通知书(发文序号: {{submitData.documentNo}} )陈述意见。
          </span>
        </el-form-item>
      </el-row>

      <!--      行政复议-->
      <el-row v-if="submitData.reportMatter === '行政复议'">
        <el-form-item label="请求内容:">
          {{submitData.csitemList.includes('1') ? `根据《中华人民共和国行政复议法》的规定, 对国家知识产权局于： ${submitData.dispatchDate || ''} 日作出的： ${submitData.xzxw || ''} 行政行为不服，现申请行政复议`  : ''}}
          {{submitData.csitemList.includes('2') ? `根据《中华人民共和国行政复议法》的规定, 对国家知识产权局应当作出： ${submitData.ydxzxw || ''} 具体行政行为、但未作出而不服，现申请行政复议`  : ''}}
        </el-form-item>
      </el-row>

      <!--      无效宣告程序优先审查-->
      <el-row v-if="submitData.reportMatter === '无效宣告程序优先审查'">
        <el-form-item label="请求优先审查的理由:">
          <div v-if="submitData.csitemList.includes('1')">无效宣告案件涉及的专利发生侵权纠纷，当事人已请求地方知识产权局处理、向人民法院起诉或者请求仲裁调解组织仲裁调解</div>
          <div v-if="submitData.csitemList.includes('2')">无效宣告案件涉及的专利对国家利益或者公共利益具有重大意义</div>
        </el-form-item>
      </el-row>
      <el-row v-if="submitData.reportMatter === '无效宣告程序优先审查'">
        <el-form-item label="优先审查请求人声明:">
          {{submitData.shengming ? '优先审查请求人已认真阅读并同意遵守《专利优先审查管理办法》的各项规定' :''}}
        </el-form-item>
      </el-row>

      <!--      复审优先审查-->
      <el-row v-if="submitData.reportMatter === '复审优先审查'">
        <el-form-item label="请求优先审查的理由:">
          <div v-if="submitData.csitemList.includes('1')">专利复审案件涉及节能环保、新一代信息技术、生物、高端装备制造、新能源、新材料、新能源汽车和智能制造等国家重点发展产业</div>
          <div v-if="submitData.csitemList.includes('2')">专利复审案件涉及各省级和设区的市级人民政府重点鼓励的产业</div>
          <div v-if="submitData.csitemList.includes('3')">专利复审案件涉及互联网、大数据、云计算等领域且技术或者产品更新速度快</div>
          <div v-if="submitData.csitemList.includes('4')">复审请求人已经做好实施准备或者已经开始实施，或有证据证明他人正在实施其发明创造</div>
          <div v-if="submitData.csitemList.includes('5')">就相同主题首次在中国提出专利申请又向其他国家或地区提出申请的该中国首次申请</div>
          <div style="display: flex;margin-left: 40px;">
            <div v-if="submitData.csitemList.includes('6')">PCT途径， 国际申请号: {{submitData.pctFileNo}};</div>
            <div v-if="submitData.csitemList.includes('7')">巴黎公约途径</div>
          </div>
          <div v-if="submitData.csitemList.includes('8')">其他对国家利益或者公共利益具有重大意义需要优先审查的专利复审案件</div>
        </el-form-item>
      </el-row>
      <el-row v-if="submitData.reportMatter === '复审优先审查'">
        <el-form-item label="优先审查请求人声明:">
          {{submitData.shengming ? '优先审查请求人已认真阅读并同意遵守《专利优先审查管理办法》的各项规定' :''}}
        </el-form-item>
      </el-row>

      <el-row v-if="submitData.reportMatter === '主动修改'">
        <el-form-item label="主动修改方式:">
          {{submitData.mdType}}
        </el-form-item>
      </el-row>
      <el-row v-show="['普通新申请','PCT进入国家阶段'].includes(reportMatter)">
        <el-form-item label="申请文本:" prop="submitMode">
          <up-load-files :view="true" fileType="申请文本" :flielist="applyList" :cur-case-id="curCaseId[0]"
                         :task-type="taskType"
                         :item="{typeName: applyFileList.filter(item=>item.materialTypeId == applyFileId).typeName,materialTypeId: applyFileId }"
                         @uploadSuccess="uploadSuccess" @removeFile="removeFile"></up-load-files>
        </el-form-item>
      </el-row>
      <el-row v-if="reportMatter == 'PCT进入国家阶段'">
        <el-col :span="24">
          <el-form-item label="修改对照页:">
            <div style="display: flex;justify-items: flex-start;align-items: center">
              <div
                style="width: 70%; display: flex;align-items: center">

                <up-load-files :view="true" fileType="修改对照页" :flielist="xgdzList" :cur-case-id="curCaseId[0]"
                               :task-type="taskType"
                               :item="{typeName: '修改对照页',materialTypeId: 301448 }"
                               @uploadSuccess="uploadSuccess" @removeFile="removeFile"></up-load-files>

              </div>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="reportMatter == 'PCT进入国家阶段'">
        <el-col :span="24">
          <el-form-item label="替换页:">
            <div style="display: flex;justify-items: flex-start;align-items: center">
              <div
                style="width: 70%; display: flex;align-items: center">

                <up-load-files :view="true" fileType="替换页" :flielist="tihuanList" :cur-case-id="curCaseId[0]"
                               :task-type="taskType"
                               :item="{typeName: '替换页',materialTypeId: 301486 }"
                               @uploadSuccess="uploadSuccess" @removeFile="removeFile"></up-load-files>

              </div>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="reportMatter == 'PCT进入国家阶段'">
        <el-col :span="24">
          <el-form-item label="修改说明:">
            <div style="display: flex;justify-items: flex-start;align-items: center">
              <div
                style="width: 70%; display: flex;align-items: center">

                <up-load-files :view="true" fileType="修改说明" :flielist="xgsmList" :cur-case-id="curCaseId[0]"
                               :task-type="taskType"
                               :item="{typeName: '修改说明',materialTypeId: 301485 }"
                               @uploadSuccess="uploadSuccess" @removeFile="removeFile"></up-load-files>

              </div>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="reportMatter == '普通新申请' || (reportMatter == 'PCT进入国家阶段' && (patentType == 1296 || patentType == 1297))">
        <el-form-item class="new-apply-sub" label="不丧失新颖性宽限期声明:">
          <div v-if="submitData.bushixy.includes('1')">已在国家出现紧急状态或者非常情况时，为公共利益目的首次公开</div>
          <div v-if="submitData.bushixy.includes('2')">已在中国政府主办或承认的国际展览会上首次展出</div>
          <div v-if="submitData.bushixy.includes('3')">已在规定的学术会议或技术会议上首次发表</div>
          <div v-if="submitData.bushixy.includes('4')">他人未经申请人同意而泄露其内容</div>
        </el-form-item>
      </el-row>
      <el-row v-if="reportMatter == 'PCT进入国家阶段' && (patentType == 1296 || patentType == 1297)">
        <el-form-item class="new-apply-sub" label="复查请求:">
            <div>{{submitData.fucha.includes('1') ? `申请人于：${submitData.dispatchDate || ''}收到下列通知:` : ''}}</div>
            <div style="margin-left: 20px" v-if="submitData.fucha.includes('2')">受理局拒绝给予国际申请日</div>
            <div style="margin-left: 20px" v-if="submitData.fucha.includes('3')">国际局按专利合作条约第12条（3）作出认定</div>
            <div style="margin-left: 20px" v-if="submitData.fucha.includes('4')">受理局宣布申请被认为撤回</div>
            <div v-if="submitData.fucha.includes('5')">根据专利合作条约第25条特此向国家知识产权局提出复查请求，并且:</div>
            <div style="margin-left: 20px" v-if="submitData.fucha.includes('6')">已请求国际局将档案中有关文件传送国家知识产权局</div>
            <div style="margin-left: 20px" v-if="submitData.fucha.includes('7')">已经按照专利法实施细则第120条办理进入国家阶段手续</div>
        </el-form-item>
      </el-row>
      <el-row v-if="reportMatter == '普通新申请'">
        <el-form-item class="new-apply-sub" label="同日申请:">
          {{submitData.trsq ? '声明本实用新型在同日申请发明专利' : ''}}
        </el-form-item>
      </el-row>
      <el-row v-if="reportMatter == '普通新申请'">
        <el-form-item class="new-apply-sub" label="提前公布:">
          {{submitData.tqgb ? '请求早日公布该专利申请' : ''}}
        </el-form-item>
      </el-row>
      <el-row v-if="reportMatter == 'PCT进入国家阶段' &&  patentType == 1297">
        <el-form-item class="new-apply-sub" label="提前处理:">
          <div v-if="submitData.csitemList.includes('1')">自优先权日起30个月的期限尚未届满，请求国家知识产权局根据专利法实施细则第111条提前处理和审查本国际申请</div>
          <div v-if="submitData.csitemList.includes('2')">本国际申请尚未国际公布，请求国家知识产权局作为指定局要求国际局传送国际申请文件副本</div>
        </el-form-item>
      </el-row>
      <el-row v-if="reportMatter == '普通新申请' && patentType == 1298">
        <el-form-item class="new-apply-sub" label="相似设计:">
          {{submitData.xssj ? `本案为同一产品的相似外观设计，其所包含的项数为： ${submitData.xsdesign || ''} 项` : ''}}
        </el-form-item>
      </el-row>
      <el-row v-if="reportMatter == '普通新申请' && patentType == 1298">
        <el-form-item class="new-apply-sub" label="成套产品设计:">
          {{submitData.ctsj ? `本案为成套产品的多项外观设计，其所包含的项数为： ${submitData.ctdesign || ''} 项` : ''}}
        </el-form-item>
      </el-row>
      <el-row v-if="reportMatter == '普通新申请' && patentType == 1298">
        <el-form-item class="new-apply-sub" label="局部设计:">
          {{submitData.jbdesign ? '本案请求保护的外观设计为局部外观设计' : ''}}
        </el-form-item>
      </el-row>
      <el-row v-if="reportMatter == '普通新申请' && patentType == 1298 || reportMatter == 'PCT进入国家阶段' && patentType == 1297">
        <el-form-item class="new-apply-sub" label="放弃主动修改权利:">
          {{submitData.fangqi ? `申请人声明，放弃专利法实施细则第：${patentType == 1298 ? '51' : '112'}条规定的主动修改的权利` : ''}}
        </el-form-item>
      </el-row>
      <el-row v-if="reportMatter == '普通新申请' && patentType == 1298">
        <el-form-item class="new-apply-sub" label="延迟审查:">
          <div v-if="submitData.ycsc"> 请求对本申请延迟审查，延迟期限为：{{submitData.ycmonth}}个月</div>
<!--          {{submitData.ycsc ? `请求对本申请延迟审查，延迟期限为: ${submitData.ycmonth || ''} 月` : ''}}-->
        </el-form-item>
      </el-row>
      <el-row v-if="reportMatter == '普通新申请' && patentType == 1297">
        <el-form-item class="new-apply-sub" label="主动放弃:">
          {{submitData.fangqi ? '申请人声明，放弃专利法实施细则第51条规定的主动修改的权利' : ''}}
        </el-form-item>
      </el-row>
      <el-row v-if="(reportMatter == '普通新申请' || reportMatter == 'PCT进入国家阶段') && patentType == 1296">
        <el-form-item class="new-apply-sub" label="请求实质审查:">
          <div v-if="submitData.szsc.includes('1')">根据专利法第35条的规定，请求对该专利申请进行实质审查</div>
          <div>{{submitData.szsc.includes('2') ? '请求对本申请延迟审查，延迟期限为: 1年' : ''}}{{submitData.szsc.includes('3') ? '请求对本申请延迟审查，延迟期限为: 2年' : ''}}{{submitData.szsc.includes('4') ? '请求对本申请延迟审查，延迟期限为: 3年' : ''}}</div>
          <div v-if="submitData.szsc.includes('5')">申请人声明，放弃专利法实施细则第57条规定的主动修改的权利</div>
        </el-form-item>
      </el-row>
      <el-row v-if="['普通新申请','PCT进入国家阶段'].includes(reportMatter)">
        <el-form-item class="new-apply-sub" label="新申请递交信息:" prop="submitMode">
          <el-form class="submission" label-width="100px" :model="submissionForm" style="max-height: 100%">
            <div class="" v-if="caseType == '普通新申请' || caseType == 'PCT国家阶段' || caseType == 'PCT国际申请'">
              <div v-if="!(caseType == '普通新申请' && patentType == 1298)">
                <div v-if="caseType == 'PCT国际申请'">
                  <el-row class="border-top">
                    <el-col :span="6">
                      <el-form-item label="文稿字数:">
                        {{submissionForm.wordsNum}}
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="说明书页数:">
                        {{submissionForm.descriptionPages}}
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="附图幅数:">
                        {{submissionForm.appendedDrawings}}
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="附图页数:">
                        {{submissionForm.drawingPages}}
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row class="">
                    <el-col :span="6">
                      <el-form-item label="权利要求项数:">
                        {{submissionForm.claimItems}}
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="权利要求页数:">
                        {{submissionForm.claimPages}}
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="摘要附图页数:">
                        {{submissionForm.substractDrawing}}
                      </el-form-item>
                    </el-col>

                  </el-row>
                </div>
                <div v-else>
                  <el-row class="border-top">
                    <el-col :span="6">
                      <el-form-item label="文稿字数:">
                        {{submissionForm.wordsNum}}
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="说明书页数:">
                        {{submissionForm.descriptionPages}}
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="附图幅数:">
                        {{submissionForm.appendedDrawings}}
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="附图页数:">
                        {{submissionForm.drawingPages}}
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row class="">
                    <el-col :span="6">
                      <el-form-item label="权利要求项数:">
                        {{submissionForm.claimItems}}
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="权利要求页数:">
                        {{submissionForm.claimPages}}
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="摘要页数:">
                        {{submissionForm.substractPage}}
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="摘要附图页数:">
                        {{submissionForm.substractDrawing}}
                      </el-form-item>
                    </el-col>

                  </el-row>
                  <el-row class="">

                    <el-col :span="6">
                      <el-form-item label="摘要附图指定图:">
                        {{submissionForm.substractDrwno}}
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="缺委托书:">
                        {{+submissionForm.nopower ? '是' : '否'}}
                      </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="caseType == 'PCT国家阶段'">
                      <el-form-item label="要求DAS:">
                        {{+submissionForm.das ? '是' : '否'}}
                      </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="caseType != 'PCT国家阶段'">
                      <el-form-item label="缺优证文件:">
                        {{+submissionForm.priorityFile ? '是' : '否'}}
                      </el-form-item>
                    </el-col>

                  </el-row>
                  <el-row class="">
                    <el-col :span="6">
                      <el-form-item label="预审案件:">
                        {{+submissionForm.preexamine ? '是' : '否'}}
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="要求DAS:">
                        {{+submissionForm.das ? '是' : '否'}}
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="要求优先审查:">
                        {{+submissionForm.tqsc ? '是' : '否'}}
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item>
                        <span slot="label">要求审查高速公路<br>(PPH)</span>
                        {{+submissionForm.dopph ? '是' : '否'}}
                      </el-form-item>
                    </el-col>

                  </el-row>
                  <el-row v-show="caseType == 'PCT国家阶段' && (patentType == 1296)">
                    <el-col :span="6">
                      <el-form-item label="进入国家阶段期限:">
                        {{submissionForm.pctKxq==1460 ? '32个月内提交' : submissionForm.pctKxq == 1458 ? '提前进入' :
                    submissionForm.pctKxq == 1461 ? '31个月内提交' : submissionForm.pctKxq == 1459 ? '30个月内提交' : ''}}

                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="根据条约第19条修改的权利要求和声明:">
                        {{+submissionForm.xgwjyw1 ? '是' : '否'}}
                      </el-form-item>
                    </el-col>
<!--                    <el-col :span="6">-->
<!--                      <el-form-item label="根据条约第19条修改时的声明:">-->
<!--                        {{+submissionForm.xgwjyw2 ? '是' : '否'}}-->
<!--                      </el-form-item>-->
<!--                    </el-col>-->
                    <el-col :span="6">
                      <el-form-item label="修改文件（28或41条）:">
                        {{+submissionForm.xgwj ? '是' : '否'}}
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="修改文件（34条）:">
                        {{+submissionForm.law34 ? '是' : '否'}}
                      </el-form-item>
                    </el-col>

                  </el-row>
                  <el-row v-show="caseType == 'PCT国家阶段' && (patentType == 1297)">
                    <el-col :span="18">
                      <el-form-item label="进入国家阶段期限:">
                        {{submissionForm.pctKxq==1460 ? '32个月内提交' : submissionForm.pctKxq == 1458 ? '提前进入' :
                    submissionForm.pctKxq == 1461 ? '31个月内提交' : submissionForm.pctKxq == 1459 ? '30个月内提交' : ''}}

                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="摘要附图指定图:">
                        {{submissionForm.substractDrwno}}
                      </el-form-item>
                    </el-col>

                  </el-row>
                  <div v-if="caseType == '普通新申请' && patentType==1296">
                    <el-row>
                      <el-col :span="submissionForm.ishk == 1 ? 6 : 12">
                        <el-form-item label="要求提交香港申请:">
                          {{+submissionForm.ishk ? '是' : '否'}}
                        </el-form-item>
                      </el-col>
                      <el-col v-show="submissionForm.ishk == 1" :span="6">
                        <el-form-item label="香港申请案号:">
                          {{submissionForm.hkRefNoList&&submissionForm.hkRefNoList.join(';')}}
                        </el-form-item>
                      </el-col>
                      <el-col :span="submissionForm.needdiv == 1 ? 6 : 12">
                        <el-form-item label="是否需要提交分案申请:">
                          {{+submissionForm.needdiv ? '是' : '否' }}
                        </el-form-item>
                      </el-col>
                      <el-col v-show="submissionForm.needdiv == 1 " :span="6">
                        <el-form-item label="分案申请案号:">
                          {{submissionForm.divcaseList&&submissionForm.divcaseList.join(';')}}
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="12">
                        <el-form-item label="要求新申请同时提实审:">
                          {{+submissionForm.tstss ? '是' : '否'}}
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="要求提交IDS:">
                          {{+submissionForm.needIds ? '是' : '否'}}
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="费减比例:">
                          {{submissionForm.feeReduce}}
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </div>
                  <div v-show="caseType == 'PCT国家阶段'  && (patentType == 1296 || patentType == 1297)">
                    <el-row>
                      <el-col :span="submissionForm.ishk == 1 ? 6 : 12">
                        <el-form-item label="要求提交香港申请:">
                          {{+submissionForm.ishk ? '是' : '否'}}
                        </el-form-item>
                      </el-col>
                      <el-col v-show="submissionForm.ishk == 1" :span="6">
                        <el-form-item label="香港申请案号:">
                          {{submissionForm.hkRefNoList && submissionForm.hkRefNoList.join(';')}}
                        </el-form-item>
                      </el-col>
                      <el-col :span="submissionForm.needdiv == 1 ? 6 : 12">
                        <el-form-item label="是否需要提交分案申请:">
                          {{+submissionForm.needdiv ? '是' : '否' }}
                        </el-form-item>
                      </el-col>
                      <el-col v-show="submissionForm.needdiv == 1 " :span="6">
                        <el-form-item label="分案申请案号:">
                          {{submissionForm.divcaseList&&submissionForm.divcaseList.join(';')}}
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="patentType == 1296 ? 6 :12">
                        <el-form-item label="要求提交IDS:">
                          {{+submissionForm.needIds ? '是' : '否'}}
                        </el-form-item>
                      </el-col>
                      <el-col :span="patentType == 1296 ? 6 :12">
                        <el-form-item label="费减比例:">
                          {{submissionForm.feeReduce}}
                        </el-form-item>
                      </el-col>
                      <el-col :span="12" v-if="caseType == 'PCT国家阶段'  &&  patentType != 1297">
                        <el-form-item label="要求新申请同时提实审:">
                          {{+submissionForm.tstss ? '是' : '否'}}
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </div>

                  <el-row v-show="caseType == '普通新申请' && (patentType == 1297 || patentType == 1298)">
                    <el-col :span="submissionForm.needdiv == 1 ? 6 : 12">
                      <el-form-item label="是否需要提交分案申请:">
                        {{+submissionForm.needdiv ? '是' : '否'}}
                      </el-form-item>
                    </el-col>
                    <el-col v-show="submissionForm.needdiv == 1 " :span="6">
                      <el-form-item label="分案申请案号:">
                        {{submissionForm.divcaseList&&submissionForm.divcaseList.join(';')}}
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="要求提交IDS:">
                        {{+submissionForm.needIds ? '是' : '否'}}
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="费减比例:">
                        {{submissionForm.feeReduce}}
                      </el-form-item>
                    </el-col>

                  </el-row>
                </div>
              </div>
              <div v-else>
                <el-row class="border-top">
                  <el-col :span="6">
                    <el-form-item label="相似设计项数:">
                      {{submissionForm.wgxsNum}}
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="成套设计项数:">
                      {{submissionForm.wgctNum}}
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="局部设计:">
                      {{submissionForm.jusjbj ? '是' : '否'}}
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="缺委托书:">
                      <!--              <el-input type="text" size="small" v-model="submissionForm.nopower"></el-input>-->
                      {{submissionForm.nopower ? '是' : '否'}}
                    </el-form-item>
                  </el-col>
                </el-row>
                <div>
                  <el-row>
                    <el-col :span="6">
                      <el-form-item label="请求优先审查:">
                        {{submissionForm.tqsc ? '是' : '否'}}
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="要求DAS:">
                        {{submissionForm.das ? '是' : '否'}}
                      </el-form-item>
                    </el-col>
                    <el-col :span="6" v-show="hasPatentPriority">
                      <el-form-item label="缺优证文件:">
                        {{+submissionForm.priorityFile ? '是' : '否'}}
                      </el-form-item>
                    </el-col>
                    <el-col :span="hasPatentPriority ? 6 : 12">
                      <el-form-item label="预审案件:">
                        {{+submissionForm.preexamine ? '是' : '否'}}
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                  <el-col :span="submissionForm.needdiv == 1 ? 6 : 12">
                    <el-form-item label="是否需要提交分案申请:">
                      {{+submissionForm.needdiv ? '是' : '否'}}
                    </el-form-item>
                  </el-col>
                  <el-col class="special-width" v-show="submissionForm.needdiv == 1 " :span="6">
                    <el-form-item label="分案申请案号:">
                      {{submissionForm.divcaseList&&submissionForm.divcaseList.join(';')}}
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="要求提交IDS:">
                      {{+submissionForm.needIds ? '是' : '否'}}
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="费减比例:" prop="feeReduce">
                      {{submissionForm.feeReduce}}
                      <!--                      <el-input type="number" size="small"-->
                      <!--                                @change="feeReduceChange"-->
                      <!--                                v-model="submissionForm.feeReduce"></el-input>-->
                    </el-form-item>
                  </el-col>

                </el-row>
              <el-row>
                  <el-col :span="submissionForm.ishk == 1 ? 12 : 24">
                    <el-form-item label="要求提交香港申请:">
                      {{+submissionForm.ishk ? '是' : '否'}}
                    </el-form-item>
                  </el-col>
                  <el-col class="special-width" v-show="submissionForm.ishk == 1" :span="12">
                    <el-form-item label="香港申请案号:">
                      {{submissionForm.hkRefNoList && submissionForm.hkRefNoList.join(';')}}

                    </el-form-item>
                  </el-col>
                </el-row>
<!--                  <el-row>-->
<!--                    <el-col :span="24">-->
<!--                      <el-form-item label="费减比例:" prop="feeReduce">-->
<!--                        {{submissionForm.feeReduce}}-->
<!--                      </el-form-item>-->
<!--                    </el-col>-->
<!--                  </el-row>-->
                </div>
              </div>
            </div>
            <div v-else>
              <div v-if="caseType == '欧洲专利国家生效'">
                <div>
                  <el-row class="border-top">
                    <el-col :span="6">
                      <el-form-item label="文稿字数:">
                        {{submissionForm.wordsNum}}
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="说明书页数:">
                        {{submissionForm.descriptionPages}}
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="附图幅数:">
                        {{submissionForm.appendedDrawings}}
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="附图页数:">
                        {{submissionForm.drawingPages}}
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row class="">
                    <el-col :span="6">
                      <el-form-item label="权利要求项数:">
                        {{submissionForm.claimItems}}
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="权利要求页数:">
                        {{submissionForm.claimPages}}
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="摘要页数:">
                        {{submissionForm.substractPage}}
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="摘要附图页数:">
                        {{submissionForm.substractDrawing}}
                      </el-form-item>
                    </el-col>

                  </el-row>
                  <el-row class="">
                    <el-col :span="6">
                      <el-form-item label="摘要附图指定图:">
                        {{submissionForm.substractDrwno}}
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="预审案件:">
                        {{+submissionForm.preexamine ? '是' : '否'}}
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="要求DAS:">
                        {{+submissionForm.das ? '是' : '否'}}
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="缺委托书:">
                        {{+submissionForm.nopower ? '是' : '否'}}
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row class="">
                    <el-col :span="12">
                      <el-form-item label="要求优先审查:">
                        {{+submissionForm.tqsc ? '是' : '否'}}
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item>
                        <span slot="label">要求审查高速公路<br>(PPH)</span>
                        {{+submissionForm.dopph ? '是' : '否'}}
                      </el-form-item>
                    </el-col>

                  </el-row>
                  <div v-if="caseType == '欧洲专利国家生效'">
                    <el-row>
                      <el-col :span="submissionForm.ishk == 1 ? 6 : 12">
                        <el-form-item label="要求提交香港申请:">
                          {{+submissionForm.ishk ? '是' : '否'}}
                        </el-form-item>
                      </el-col>
                      <el-col v-show="submissionForm.ishk == 1" :span="6">
                        <el-form-item label="香港申请案号:">
                          {{submissionForm.hkRefNoList && submissionForm.hkRefNoList.join(';')}}
                        </el-form-item>
                      </el-col>
                      <el-col :span="submissionForm.needdiv == 1 ? 6 : 12">
                        <el-form-item label="是否需要提交分案申请:">
                          {{+submissionForm.needdiv ? '是' : '否'}}
                        </el-form-item>
                      </el-col>
                      <el-col v-show="submissionForm.needdiv == 1 " :span="6">
                        <el-form-item label="分案申请案号:">
                          {{submissionForm.divcaseList&&submissionForm.divcaseList.join(';')}}
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="12">
                        <el-form-item label="要求新申请同时提实审:">
                          {{+submissionForm.tstss ? '是' : '否'}}
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="要求提交IDS:">
                          {{+submissionForm.needIds ? '是' : '否'}}
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="费减比例:">
                          {{submissionForm.feeReduce}}
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </div>

                </div>
              </div>
            </div>
            <el-row v-if="submissionForm.appFromto == '外-内'">
              <el-col :span="24">
                <el-form-item label="原案语言:">
                  {{submissionForm.pctOpenLang}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="是否有向外申请意向:">
                  {{submissionForm.applyExternally ? '是' : '否'}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="patentType == 1296 || patentType == 1297">
              <el-col :span="24">
                <el-form-item label="一带二申请:">
                  {{+submissionForm.twoapp ? '是' : '否'}}
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-form-item>
      </el-row>
      <el-row v-if="reportMatter == '著录项目变更'">
        <el-col :span="24">
          <el-form-item label="著录变更:">
            针对(
            {{submitData.docTitle}}
            )通知书(发文序号
            {{submitData.documentNo}}
            )进行著录事项变更

            <SignificantTable type="submit" :is-view="true" :case-id="curCaseId[0]" :custId="custId"
                              :table="zhubianData"></SignificantTable>
          </el-form-item>
        </el-col>

      </el-row>

      <!--      补正-->
      <el-row v-if="reportMatter == '补正' || (reportMatter == '主动修改' && submitData.mdType === '补正')">
        <el-col :span="24">
          <el-form-item label="修改对照页:">
            <div style="display: flex;justify-items: flex-start;align-items: center">
              <div
                style="width: 70%; display: flex;align-items: center">

                <up-load-files :view="true" fileType="修改对照页" :flielist="xgdzList" :cur-case-id="curCaseId[0]"
                               :task-type="taskType"
                               :item="{typeName: '修改对照页',materialTypeId: 301448 }"
                               @uploadSuccess="uploadSuccess" @removeFile="removeFile"></up-load-files>

              </div>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="reportMatter == '补正' || (reportMatter == '主动修改' && submitData.mdType === '补正')">
        <el-col :span="24">
          <el-form-item label="替换页:">
            <div style="display: flex;justify-items: flex-start;align-items: center">
              <div
                style="width: 70%; display: flex;align-items: center">

                <up-load-files :view="true" fileType="替换页" :flielist="tihuanList" :cur-case-id="curCaseId[0]"
                               :task-type="taskType"
                               :item="{typeName: '替换页',materialTypeId: 301486 }"
                               @uploadSuccess="uploadSuccess" @removeFile="removeFile"></up-load-files>

              </div>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="reportMatter == '补正' || (reportMatter == '主动修改' && submitData.mdType === '补正')">
        <el-col :span="24">
          <el-form-item label="补正原因:">
            <span v-if="reasonFirst == '1'&&submitData.mdType == '补正'">根据专利法实施细则第57条的规定，请求对专利申请主动提出修改。</span>
            <span v-if="reasonFirst == '2'&&submitData.mdType !== '补正'">根据专利法实施细则第50条的规定，针对国家知识产权局于: {{submitData.dispatchDate}} 发出的: {{submitData.docTitle}} 通知书(发文序号: {{submitData.documentNo}} )，进行补正。</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="reportMatter == '补正' || (reportMatter == '主动修改' && submitData.mdType === '补正')">
        <el-col :span="24">
          <el-form-item label="补正内容:" class="buzheng">
            <div>
              <!--              <el-button size="mini" type="primary" @click="addTableList(submitData.bzList, 'bzList' )">添加</el-button>-->
              <el-table
                class="el-table1"
                :data="submitData.bzList"
                style="width: 99.5%;"
                border
              >
                <el-table-column
                  label="文件名称"
                >
                  <template slot-scope="scope">
                    <span>{{scope.row.fileName}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="文件中的位置"
                >
                  <template slot-scope="scope">
                    {{scope.row.position}}
                  </template>
                </el-table-column>
                <el-table-column
                  label="补正前"
                >
                  <template slot-scope="scope">
                    {{scope.row.beforeData}}
                  </template>
                </el-table-column>
                <el-table-column
                  label="补正后"
                >
                  <template slot-scope="scope">
                    {{scope.row.afterData}}
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-form-item>
        </el-col>
      </el-row>

      <!--      意见陈述-->
      <el-row v-if="reportMatter == '意见陈述' || (reportMatter == '主动修改' && submitData.mdType === '意见陈述')">
        <el-col :span="24">
          <el-form-item label="陈述事项:">
              <span v-if="reasonFirst == '1' && submitData.mdType !== '意见陈述'">
                针对国家知识产权局于: {{submitData.dispatchDate}} 发出的: {{submitData.docTitle}} 通知书(发文序号: {{submitData.documentNo}} )陈述意见。
              </span>
            <span v-if="reasonFirst == '2' && submitData.mdType !== '意见陈述'">
                针对国家知识产权局于: {{submitData.dispatchDate}} 发出的: {{submitData.docTitle}} 通知书(发文序号: {{submitData.documentNo}} )补充陈述意见。
              </span>
            <span v-if="reasonFirst == '6' && submitData.mdType !== '意见陈述'">
              针对国家知识产权局于: {{submitData.dispatchDate}} 发出的药品专利权期限补偿审查意见通知书(发文序号: {{submitData.documentNo}} )陈述意见。
            </span>
            <span v-if="reasonFirst == '3' && submitData.mdType === '意见陈述'">
                主动提出修改（根据专利法实施细则第51条第1款、第2款的规定）。
              </span>
            <span v-if="reasonFirst == '4' && submitData.mdType !== '意见陈述'">
              公布公告事项。
            </span>
            <span v-if="reasonFirst == '5' && submitData.mdType !== '意见陈述'">
              其他事宜。
            </span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="reportMatter == '意见陈述' || (reportMatter == '主动修改' && submitData.mdType === '意见陈述')">
        <el-col :span="24">
          <el-form-item label="关于补交实验数据的情况:">
            <span v-if="submitData.bjlsysjbj == 1">
              补交了实验数据
            </span>
            <span v-else>
              未补交实验数据
            </span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="reportMatter == '意见陈述' || (reportMatter == '主动修改' && submitData.mdType === '意见陈述')">
        <el-form-item label="意见陈述书附页:" prop="">
          <div style="display: flex;justify-items: flex-start;align-items: center">
            <div
              style="width: 70%; display: flex;align-items: center">
              <up-load-files :view="true" fileType="意见陈述书附页" :flielist="yjcsfyList" :cur-case-id="curCaseId[0]"
                             :task-type="taskType"
                             :item="{typeName: '意见陈述书附页',materialTypeId: 301460 }"
                             @uploadSuccess="uploadSuccess" @removeFile="removeFile"></up-load-files>

            </div>
          </div>
        </el-form-item>
      </el-row>
      <el-row v-if="reportMatter == '意见陈述' || (reportMatter == '主动修改' && submitData.mdType === '意见陈述')">
        <el-col :span="24">
          <el-form-item label="修改对照页:">
            <div style="display: flex;justify-items: flex-start;align-items: center">
              <div
                style="width: 70%; display: flex;align-items: center">

                <up-load-files :view="true" fileType="修改对照页" :flielist="xgdzList" :cur-case-id="curCaseId[0]"
                               :task-type="taskType"
                               :item="{typeName: '修改对照页',materialTypeId: 301448 }"
                               @uploadSuccess="uploadSuccess" @removeFile="removeFile"></up-load-files>

              </div>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="reportMatter == '意见陈述' || (reportMatter == '主动修改' && submitData.mdType === '意见陈述')">
        <el-col :span="24">
          <el-form-item label="替换页:">
            <div style="display: flex;justify-items: flex-start;align-items: center">
              <div
                style="width: 70%; display: flex;align-items: center">

                <up-load-files :view="true" fileType="替换页" :flielist="tihuanList" :cur-case-id="curCaseId[0]"
                               :task-type="taskType"
                               :item="{typeName: '替换页',materialTypeId: 301486 }"
                               @uploadSuccess="uploadSuccess" @removeFile="removeFile"></up-load-files>

              </div>
            </div>
          </el-form-item>
        </el-col>
      </el-row>

      <!--      延长期限、复审延长期限-->
      <el-row v-if="reportMatter == '复审延长期限'">
        <el-col :span="24">
          <el-form-item label="请求内容:">
            <span v-if="reasonFirst == '1'">
              根据专利法实施细则第6条第4款的规定，请求延长国家知识产权局于: {{submitData.dispatchDate}} 发出的: {{submitData.docTitle}} 通知书(发文序号: {{submitData.documentNo}} )中指定的期限。
            </span>
            <span v-if="reasonFirst == '2'">根据专利法实施细则第106条第3款的规定，请求延长上述专利申请或者专利的中止程序。</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="reportMatter == '延长期限'">
        <el-col :span="24">
          <el-form-item label="请求内容:">
            <span v-if="reasonFirst == '1'">
              根据专利法实施细则第6条第4款的规定，请求延长国家知识产权局于: {{submitData.dispatchDate}} 发出的: {{submitData.docTitle}} 通知书(发文序号: {{submitData.documentNo}} )中指定的期限。
            </span>
            <span v-if="reasonFirst == '2'">根据专利法实施细则第103条第3款的规定，请求延长上述专利申请或者专利的中止程序。</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="reportMatter == '延长期限'">
        <el-col :span="8" class="full-height">
          <el-form-item label="请求延长期限:">
            {{submitData.ycqx}} 发文的第: {{submitData.ntNumber}} 次审查意见通知书/补正通知书
          </el-form-item>
        </el-col>
        <el-col :span="8" class="full-height">
          <el-form-item label="期限截止日期:">
            {{submitData.deadline}}
          </el-form-item>
        </el-col>
        <el-col :span="8" class="full-height">
          <el-form-item label="请求延长的时间:">
            延长
            {{submitData.yctime}}
            个月<br/>
            ({{submitData.deadline}}-{{submitData.ycqxEnd}})
          </el-form-item>
        </el-col>
      </el-row>

      <!--      无效请求-->
      <el-row v-if="reportMatter == '无效请求'">
        <el-col :span="24">
          <el-form-item label="意见陈述书附页:">
            <div style="display: flex;justify-items: flex-start;align-items: center">
              <div
                style="width: 70%; display: flex;align-items: center">

                <up-load-files :view="true" fileType="意见陈述书附页" :flielist="yjcsfyList" :cur-case-id="curCaseId[0]"
                               :task-type="taskType"
                               :item="{typeName: '意见陈述书附页',materialTypeId: 301460 }"
                               @uploadSuccess="uploadSuccess" @removeFile="removeFile"></up-load-files>

              </div>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="reportMatter == '无效请求'">
        <el-col :span="24">
          <el-form-item label=" ">
            {{submitData.wxpriory ? '涉案专利为中国上市药品专利信息登记平台上登记的专利权，无效宣告请求人为相应药品的仿制药申请人，且已经提出第四类声明' : ''}}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row v-if="reportMatter == '无效请求'">
        <el-col :span="24">
          <el-form-item label="无效宣告请求的理由、范围及所依据的证据:" class="buzheng">
            <!--            <el-button size="mini" type="primary" @click="addTableList(submitData.wxyjList, 'wxyjList')">添加</el-button>-->
            <el-table
              class="el-table1"
              :data="submitData.wxyjList"
              style="width: 99.5%;"
              border
            >
              <el-table-column
                label="理由"
              >
                <template slot-scope="scope">
                  专利法第
                  {{scope.row.wxliyou}}
                  条 第
                  {{scope.row.wxliyou2}}
                  款<br/> 实施细则第
                  {{scope.row.wxliyou3}}
                  条 第
                  {{scope.row.wxliyou4}}
                  款
                </template>

              </el-table-column>
              <el-table-column
                label="范围"
              >
                <template slot-scope="scope">
                  {{scope.row.wxfanwei}}
                </template>

              </el-table-column>
              <el-table-column
                label="依据的证据"
              >
                <template slot-scope="scope">
                  {{scope.row.wxyiju}}
                </template>

              </el-table-column>
            </el-table>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="reportMatter == '无效请求'">
        <el-col :span="24">
          <el-form-item label="证据清单:" class="buzheng">
            <!--            <el-button size="mini" type="primary" @click="addTableList(submitData.wxzjList, 'wxzjList')">添加</el-button>-->
            <el-table
              class="el-table1"
              :data="submitData.wxzjList"
              style="width: 99.5%;"
              border
            >
              <el-table-column
                label="序号"
              >
                <template slot-scope="scope">
                  {{scope.row.no}}
                </template>

              </el-table-column>
              <el-table-column
                label="附件"
              >
                <template slot-scope="scope">
                  <div>
                    <!--                    <el-upload class="upload-demo"-->
                    <!--                               ref="uploadFile"-->
                    <!--                               :multiple="false"-->
                    <!--                               :data="fujianData"-->
                    <!--                               :action="creatematerialUrl"-->
                    <!--                               name="attachFile"-->
                    <!--                               :auto-upload="true"-->
                    <!--                               :on-success="(res, file, fileLists)=>{fujianCallback(res, file, fileLists, scope.row)}"-->
                    <!--                               :show-file-list="false"-->
                    <!--                    >-->
                    <!--                      <div class="el-upload__text">-->
                    <!--                        <el-button style="float: left" type="primary" size="mini">上传</el-button>-->
                    <!--                      </div>-->
                    <!--                    </el-upload>-->
                    <p>
                      <span style="color: #409EFF;cursor: pointer" @click="preView({address: scope.row.address})">{{ scope.row.materialName}}</span>
                    </p>
                  </div>
                </template>

              </el-table-column>
              <el-table-column
                label="数量"
              >
                <template slot-scope="scope">
                  {{scope.row.fenNum}}
                  份，每份
                  {{scope.row.pageNum}}
                  页
                </template>

              </el-table-column>
            </el-table>
          </el-form-item>
        </el-col>
      </el-row>


      <!--      DAS请求-->
      <el-row v-if="reportMatter == 'DAS请求'">
        <el-col :span="24">
          <el-form-item label="请求类型:">
            <span v-if="reasonFirst == '1'">交存请求</span>
            <span v-if="reasonFirst == '2'">查询请求</span>
          </el-form-item>
        </el-col>
      </el-row>

      <!--      意见陈述(退费)-->
      <el-row v-if="reportMatter == '意见陈述（退费）'">
        <el-col :span="24">
          <el-form-item label="陈述事项:">
            <div>
              <span v-if="reasonFirst == '1'">退款请求</span>
              <div v-show="reasonFirst == '1'"
                   style="width: 90%; margin: 0px 40px 10px 0; min-height: 100px;border: 1px solid #ebeef5;padding-left: 30px">
                <span v-if="tuiType == 1">根据专利法实施细则第94条第4款的规定请求退款</span>
                <div v-if="tuiType == 1" style="padding: 0 20px 0px 20px" class="buzheng">
                  <el-table class="el-table1" :data="submitData.tuifeeList" border disabled>
                    <el-table-column label="费用种类">
                      <template slot-scope="scope">
                        {{feeTypeList.find(i=>i.chargeItemId == scope.row.feekind)&&feeTypeList.find(i=>i.chargeItemId == scope.row.feekind).nameCn }}
                      </template>
                    </el-table-column>
                    <el-table-column label="金额">
                      <template slot-scope="scope">
                        {{scope.row.amount}}
                      </template>
                    </el-table-column>
                    <el-table-column label="票据号码">
                      <template slot-scope="scope">
                        {{scope.row.pjcode}}
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
                <span v-if="tuiType == 2">根据《财税【2018】37号》通知请求退50%实审费</span>

                <div v-if="tuiType == 2" style="width: 100%; display: flex;margin-left: 20px">
                  <div style="font-size: 14px">票据号码:{{submitData.pjcode}}</div>
                </div>
              </div>
              <span v-if="reasonFirst == '2'">请求转换费用种类</span>
              <span v-if="reasonFirst == '3'">缴纳专利费用连个月后尚未收到国家知识产权局开出的费用收据</span>
              <span v-if="reasonFirst == '4'">
                针对国家知识产权局于: {{submitData.dispatchDate}} 发出的: {{submitData.docTitle}} 通知书(发文序号: {{submitData.documentNo}} )陈述意见。
              </span>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="reportMatter == '意见陈述（退费）'">
        <el-col :span="24">
          <el-form-item label="意见陈述书附页:">
            <div style="display: flex;justify-items: flex-start;align-items: center">
              <div
                style="width: 70%; display: flex;align-items: center">
                <up-load-files :view="true" fileType="意见陈述书附页" :flielist="yjcsfyList" :cur-case-id="curCaseId[0]"
                               :task-type="taskType"
                               :item="{typeName: '意见陈述书附页',materialTypeId: 301460 }"
                               @uploadSuccess="uploadSuccess" @removeFile="removeFile"></up-load-files>

              </div>
            </div>
          </el-form-item>
        </el-col>
      </el-row>

      <!--      复审请求-->
      <el-row v-if="reportMatter == '复审请求'">
        <el-col :span="24">
          <el-form-item label="意见陈述书附页:">
            <div style="display: flex;justify-items: flex-start;align-items: center">
              <div
                style="width: 70%; display: flex;align-items: center">

                <up-load-files :view="true" fileType="意见陈述书附页" :flielist="yjcsfyList" :cur-case-id="curCaseId[0]"
                               :task-type="taskType"
                               :item="{typeName: '意见陈述书附页',materialTypeId: 301460 }"
                               @uploadSuccess="uploadSuccess" @removeFile="removeFile"></up-load-files>

              </div>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="reportMatter == '复审请求'">
        <el-col :span="24">
          <el-form-item label="修改对照页:">
            <div style="display: flex;justify-items: flex-start;align-items: center">
              <div
                style="width: 70%; display: flex;align-items: center">

                <up-load-files :view="true" fileType="修改对照页" :flielist="xgdzList" :cur-case-id="curCaseId[0]"
                               :task-type="taskType"
                               :item="{typeName: '修改对照页',materialTypeId: 301448 }"
                               @uploadSuccess="uploadSuccess" @removeFile="removeFile"></up-load-files>

              </div>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="reportMatter == '复审请求'">
        <el-col :span="24">
          <el-form-item label="替换页:">
            <div style="display: flex;justify-items: flex-start;align-items: center">
              <div
                style="width: 70%; display: flex;align-items: center">

                <up-load-files :view="true" fileType="替换页" :flielist="tihuanList" :cur-case-id="curCaseId[0]"
                               :task-type="taskType"
                               :item="{typeName: '替换页',materialTypeId: 301486 }"
                               @uploadSuccess="uploadSuccess" @removeFile="removeFile"></up-load-files>

              </div>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="reportMatter == '复审请求'">
        <el-col :span="24">
          <el-form-item label="驳回决定:">
            根据专利法第41条第1款及专利法实施细则第65条第1款的规定，对国家知识产权局于: {{submitData.dispatchDate}} 发出的对上述专利申请的驳回决定不服，请求复审。
          </el-form-item>
        </el-col>
      </el-row>

      <!--      复审无效补正-->
      <el-row v-if="reportMatter == '复审无效补正'">
        <el-form-item label="意见陈述书附页:" prop="">
          <div style="display: flex;justify-items: flex-start;align-items: center">
            <div
              style="width: 70%; display: flex;align-items: center">

              <up-load-files :view="true" fileType="意见陈述书附页" :flielist="yjcsfyList" :cur-case-id="curCaseId[0]"
                             :task-type="taskType"
                             :item="{typeName: '意见陈述书附页',materialTypeId: 301460 }"
                             @uploadSuccess="uploadSuccess" @removeFile="removeFile"></up-load-files>

            </div>
          </div>
        </el-form-item>
      </el-row>
      <el-row v-if="reportMatter == '复审无效补正'">
        <el-col :span="24">
          <el-form-item label="修改对照页:">
            <div style="display: flex;justify-items: flex-start;align-items: center">
              <div
                style="width: 70%; display: flex;align-items: center">

                <up-load-files :view="true" fileType="修改对照页" :flielist="xgdzList" :cur-case-id="curCaseId[0]"
                               :task-type="taskType"
                               :item="{typeName: '修改对照页',materialTypeId: 301448 }"
                               @uploadSuccess="uploadSuccess" @removeFile="removeFile"></up-load-files>

              </div>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="reportMatter == '复审无效补正'">
        <el-col :span="24">
          <el-form-item label="替换页:">
            <div style="display: flex;justify-items: flex-start;align-items: center">
              <div
                style="width: 70%; display: flex;align-items: center">

                <up-load-files :view="true" fileType="替换页" :flielist="tihuanList" :cur-case-id="curCaseId[0]"
                               :task-type="taskType"
                               :item="{typeName: '替换页',materialTypeId: 301486 }"
                               @uploadSuccess="uploadSuccess" @removeFile="removeFile"></up-load-files>

              </div>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="reportMatter == '复审无效补正'">
        <el-col :span="24">
          <el-form-item label="补正人:">
            <span v-if="submitData.bzperson == 1">复审请求人</span>
            <span v-if="submitData.bzperson == 2">专利权人</span>
            <span v-if="submitData.bzperson == 3">无效宣告请求人</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="reportMatter == '复审无效补正'">
        <el-col :span="24">
          <el-form-item label="补正原因:">
            <span v-if="reasonFirst == '1'">
              根据专利法实施细则第65条第3款的规定。
            </span>
            <span v-if="reasonFirst == '2'">
              根据专利法实施细则第70条第4款的规定。
            </span>
            <span v-if="reasonFirst == '3'">
              针对: {{submitData.dispatchDate}} 专利复审委员会发出的: {{submitData.docTitle}} 通知书(发文序号: {{submitData.documentNo}} )进行补正。
            </span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="reportMatter == '复审无效补正'">
        <el-col :span="24">
          <el-form-item label="补正内容:" class="buzheng">
            <div>
              <el-table
                class="el-table1"
                :data="submitData.bzList"
                style="width: 99.5%;"
                border
              >
                <el-table-column
                  label="文件名称"
                >
                  <template slot-scope="scope">
                    {{scope.row.fileName}}
                  </template>
                </el-table-column>
                <el-table-column
                  label="文件中的位置"
                >
                  <template slot-scope="scope">
                    {{scope.row.position}}
                  </template>
                </el-table-column>
                <el-table-column
                  label="补正前"
                >
                  <template slot-scope="scope">
                    {{scope.row.beforeData}}
                  </template>
                </el-table-column>
                <el-table-column
                  label="补正后"
                >
                  <template slot-scope="scope">
                    {{scope.row.afterData}}
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-form-item>
        </el-col>
      </el-row>

      <!--      复审无效意见陈述-->
      <el-row v-if="reportMatter == '复审无效意见陈述' || opinionStateList.includes(reportMatter)">
        <el-form-item label="意见陈述书附页:" prop="">
          <div style="display: flex;justify-items: flex-start;align-items: center">
            <div
              style="width: 70%; display: flex;align-items: center">

              <up-load-files :view="true" fileType="意见陈述书附页" :flielist="yjcsfyList" :cur-case-id="curCaseId[0]"
                             :task-type="taskType"
                             :item="{typeName: '意见陈述书附页',materialTypeId: 301460 }"
                             @uploadSuccess="uploadSuccess" @removeFile="removeFile"></up-load-files>

            </div>
          </div>
        </el-form-item>
      </el-row>
      <el-row v-if="reportMatter == '复审无效意见陈述' || opinionStateList.includes(reportMatter)">
        <el-col :span="24">
          <el-form-item label="修改对照页:">
            <div style="display: flex;justify-items: flex-start;align-items: center">
              <div
                style="width: 70%; display: flex;align-items: center">

                <up-load-files :view="true" fileType="修改对照页" :flielist="xgdzList" :cur-case-id="curCaseId[0]"
                               :task-type="taskType"
                               :item="{typeName: '修改对照页',materialTypeId: 301448 }"
                               @uploadSuccess="uploadSuccess" @removeFile="removeFile"></up-load-files>

              </div>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="reportMatter == '复审无效意见陈述' || opinionStateList.includes(reportMatter)">
        <el-col :span="24">
          <el-form-item label="替换页:">
            <div style="display: flex;justify-items: flex-start;align-items: center">
              <div
                style="width: 70%; display: flex;align-items: center">

                <up-load-files :view="true" fileType="替换页" :flielist="tihuanList" :cur-case-id="curCaseId[0]"
                               :task-type="taskType"
                               :item="{typeName: '替换页',materialTypeId: 301486 }"
                               @uploadSuccess="uploadSuccess" @removeFile="removeFile"></up-load-files>

              </div>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="reportMatter == '复审无效意见陈述' || opinionStateList.includes(reportMatter)">
        <el-col :span="24">
          <el-form-item label="意见陈述人:">
            <span v-if="submitData.bzperson == 1">复审请求人</span>
            <span v-if="submitData.bzperson == 2">专利权人</span>
            <span v-if="submitData.bzperson == 3">无效宣告请求人</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="reportMatter == '复审无效意见陈述' || opinionStateList.includes(reportMatter)">
        <el-col :span="24">
          <el-form-item label="陈述事项:">
            <div v-if="buzhengReason.includes('1')">
              针对国家知识产权局于: {{submitData.dispatchDate}} 发出的上述专利申请/专利权的: {{submitData.docTitle}} 通知书(发文序号: {{submitData.documentNo}} )陈述意见。
            </div>
            <div v-if="buzhengReason.includes('2')">
              针对: {{submitData.fswxDate}} 提出的复审或无效宣告请求补充意见。
            </div>
            <div v-if="buzhengReason.includes('3')">
              提交联系人地址变更
            </div>
            <div v-if="buzhengReason.includes('4')">提交授权委托书</div>
            <div v-if="buzhengReason.includes('5')">提交口审回执</div>
            <div v-if="buzhengReason.includes('6')">请求合案审理</div>
            <div v-if="buzhengReason.includes('7')">撤回复审或无效宣告请求</div>
            <div v-if="buzhengReason.includes('8')">关于费用</div>
          </el-form-item>
        </el-col>
      </el-row>


      <!--      提交评价报告-->
      <el-row v-if="reportMatter == '提交评价报告'">
        <el-col :span="24">
          <el-form-item label="专利类型:">s
            <span v-if="submitData.paType == 1">实用新型名称{{submitData.invName}}</span>
            <span v-if="submitData.paType == 2">外观设计名称{{submitData.invName}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="reportMatter == '提交评价报告'">
        <el-col :span="24">
          <el-form-item label="请求人:">
            <span v-if="submitData.bzperson == 1">专利权人/申请人</span>
            <span v-if="submitData.bzperson == 2">利害关系人</span>
            <span v-if="submitData.bzperson == 3">被控侵权人</span>
            <div v-if="[2, 3].includes(submitData.bzperson)">备案号:{{submitData.caseCode}}</div>
          </el-form-item>
        </el-col>
      </el-row>
      <!--      <el-row v-if="reportMatter == '提交评价报告'">-->
      <!--        <el-col :span="24">-->
      <!--          <el-form-item label="评价所针对的文本:">-->
      <!--            <span v-if="reasonFirst == '1'">根据专利法实施细则第60条第3款的规定。</span>-->
      <!--            <span v-if="reasonFirst == '2'">由生效的无效宣告请求审查决定维持有效的专利文件，其中涉及第: {{submitData.wxNumber}} 号无效宣告请求审查决定</span>-->
      <!--          </el-form-item>-->
      <!--        </el-col>-->
      <!--      </el-row>-->

      <!--      更正错误-->
      <el-row v-if="reportMatter == '更正错误'">
        <el-col :span="24">
          <el-form-item label="更正后的申请文件:">
            <div style="display: flex;justify-items: flex-start;align-items: center">
              <div
                style="width: 70%; display: flex;align-items: center">

                <up-load-files :view="true" fileType="更正错误" :flielist="gzcwList" :cur-case-id="curCaseId[0]"
                               :task-type="taskType"
                               :item="{typeName: '',materialTypeId: 300449 }"
                               @uploadSuccess="uploadSuccess" @removeFile="removeFile"></up-load-files>

                <!--                <el-button v-if="changeDoc" size="mini" type="primary" @click="transferDoc" style="margin-left: 10px">制作-->
                <!--                </el-button>-->

              </div>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="reportMatter == '更正错误'">
        <el-col :span="24">
          <el-form-item label="更正内容:" class="buzheng">
            <div>
              <el-table
                class="el-table1"
                :data="submitData.bzList"
                style="width: 99.5%;"
                border
              >
                <el-table-column
                  label="文件名称"
                >
                  <template slot-scope="scope">
                    {{scope.row.fileName}}
                  </template>
                </el-table-column>
                <el-table-column
                  label="更正项目"
                >
                  <template slot-scope="scope">
                    {{scope.row.changeItem}}
                  </template>
                </el-table-column>
                <el-table-column
                  label="文件中的位置"
                >
                  <template slot-scope="scope">
                    {{scope.row.position}}
                  </template>
                </el-table-column>
                <el-table-column
                  label="补正前"
                >
                  <template slot-scope="scope">
                    {{scope.row.beforeData}}
                  </template>
                </el-table-column>
                <el-table-column
                  label="补正后"
                >
                  <template slot-scope="scope">
                    {{scope.row.afterData}}
                  </template>
                </el-table-column>
              </el-table>
            </div>

          </el-form-item>
        </el-col>
      </el-row>


      <!--      改正译文错误-->
      <el-row v-if="reportMatter == '改正译文错误'">
        <el-col :span="24">
          <el-form-item label="改正后的申请文件:">
            <div style="display: flex;justify-items: flex-start;align-items: center">
              <div
                style="width: 70%; display: flex;align-items: center">

                <up-load-files :view="true" fileType="改正译文错误" :flielist="gzhList" :cur-case-id="curCaseId[0]"
                               :task-type="taskType"
                               :item="{typeName: '',materialTypeId: 300449 }"
                               @uploadSuccess="uploadSuccess" @removeFile="removeFile"></up-load-files>

                <!--                <el-button v-if="changeDoc" size="mini" type="primary" @click="transferDoc" style="margin-left: 10px">制作-->
                <!--                </el-button>-->

              </div>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="reportMatter == '改正译文错误'">
        <el-col :span="24">
          <el-form-item label="请求内容:">
            <span v-if="reasonFirst == '1'">根据专利法实施细则第133条的规定，请申请文件的中文译文进行修改。</span>
            <span v-if="reasonFirst == '2'">针对国家知识产权局于: {{submitData.dispatchDate}} 发出的通知书(发文序号: {{submitData.documentNo}} )，进行译文改正。</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="reportMatter == '改正译文错误'">
        <el-col :span="24">
          <el-form-item label="改正内容:" class="buzheng">
            <div>
              <el-table
                class="el-table1"
                :data="submitData.bzList"
                style="width: 99.5%;"
                border
              >
                <el-table-column
                  label="文件名称"
                >
                  <template slot-scope="scope">
                    {{scope.row.fileName}}
                  </template>
                </el-table-column>
                <el-table-column
                  label="更正项目"
                >
                  <template slot-scope="scope">
                    {{scope.row.changeItem}}
                  </template>
                </el-table-column>
                <el-table-column
                  label="文件中的位置"
                >
                  <template slot-scope="scope">
                    {{scope.row.position}}
                  </template>
                </el-table-column>
                <el-table-column
                  label="补正前"
                >
                  <template slot-scope="scope">
                    {{scope.row.beforeData}}
                  </template>
                </el-table-column>
                <el-table-column
                  label="补正后"
                >
                  <template slot-scope="scope">
                    {{scope.row.afterData}}
                  </template>
                </el-table-column>
              </el-table>
            </div>

          </el-form-item>
        </el-col>
      </el-row>

      <!--      放弃声明-->
      <el-row v-if="reportMatter == '放弃声明'">
        <el-col :span="24">
          <el-form-item label="声明内容:">
            <span v-if="reasonFirst == '1'">根据专利法第44条第1款第2项的规定，专利权人声明放弃上述专利权。</span>
            <span v-if="reasonFirst == '2'">根据专利法第9条第1款的规定，专利权人声明放弃上述专利权。
                注：同样的发明创造申请号为: {{submitData.appNum}}</span>
            <span v-if="reasonFirst == '3'">
              无效宣告程序中，根据专利法第9条第1款的规定，专利权人声明放弃上述专利权。
                注：同样的发明创造申请号为: {{submitData.appNum}}
            </span>
          </el-form-item>
        </el-col>
      </el-row>

      <!--   复审恢复权利   -->
      <el-row v-if="reportMatter == '复审恢复权利'">
        <el-col :span="24">
          <el-form-item label="请求内容:">
            <p v-if="buzhengReason.includes('1')">根据专利法实施细则第6条第1款的规定。</p>
            <p v-if="buzhengReason.includes('2')">根据专利法实施细则第6条第2款的规定。</p>
            <p v-if="buzhengReason.includes('3')">
              针对国家知识产权局于
                {{submitData.dispatchDate}}
                发出的
                {{submitData.docTitle}}
                通知书(发文序号
                {{submitData.documentNo}}
                )请求恢复权利。
            </p>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="reportMatter == '复审恢复权利'">
        <el-col :span="24">
          <el-form-item label="请求恢复权利的理由：">
            <div>{{submitData.wxchenshu}}</div>
          </el-form-item>
        </el-col>
      </el-row>

      <!--      恢复权利-->
      <el-row v-if="reportMatter == '恢复权利'">
        <el-col :span="24">
          <el-form-item label="请求内容:">
            根据专利法第6条，针对: {{submitData.dispatchDate}} 国家知识产权局发出的: {{submitData.docTitle}} （最近一次官方通知的文件名称）通知书（发文序号:
            {{submitData.documentNo}} ）请求恢复权利。
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="reportMatter == '恢复权利'">
        <el-col :span="24">
          <el-form-item label="请求恢复权利的理由：">
            <span v-if="reasonFirst == '1'">正当理由:</span>
            <span v-if="reasonFirst == '2'">不可抗力:</span>
            <div>{{submitData.wxchenshu}}</div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="reportMatter == '恢复权利'">
        <el-col :span="24">
          <el-form-item label="已备案的证明文件备案编号:">
            {{submitData.caseCode}}
          </el-form-item>
        </el-col>
      </el-row>

      <!--      PPH请求-->
      <el-row v-if="reportMatter == 'PPH请求'">
        <el-col :span="24">
          <el-form-item label="请求:">
            申请人请求参与专利审查高速路（PPH）试点项目基于：
            <el-row>
              <el-col :span="23">
                <el-form-item label="在先审查局 (OEE):">
                  {{submitData.zxscjStr}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="23">
                <el-form-item label="OEE工作结果类型:">
                  <span v-if="submitData.workType == 1">国家/地区的审查意见</span>
                  <span v-if="submitData.workType == 2">WO-ISA，WO-IPEA或IPER</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row style="margin-top: 10px" class="buzheng">
              <el-col :span="23">
                <el-table
                  class="el-table1"
                  :data="submitData.patentPphOeeList"
                  style="width: 99.5%;margin-top: 0"
                  border
                >
                  <el-table-column
                    label="OEE申请号"
                  >
                    <template slot-scope="scope">
                      {{scope.row.oeeApplicationNum}}
                      <!--                      <el-input size="mini" v-model="scope.row.oeeapplicationNum" style="width: 50%;"></el-input>-->
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="本申请与OEE申请的关系"
                  >
                    <template slot-scope="scope">
                      {{scope.row.oeeApplicationRelationship}}
                      <!--                      <el-input size="mini" v-model="scope.row.oeeapplicationRelationship" style="width: 50%;"></el-input>-->
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>
            </el-row>
            <!--            <el-row>-->
            <!--              <el-col :span="23" style="padding-bottom: 10px">-->
            <!--                <el-form-item label="本申请与OEE申请的关系:">-->
            <!--                  {{submitData.relation}}-->
            <!--                </el-form-item>-->
            <!--              </el-col>-->
            <!--            </el-row>-->
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="reportMatter == 'PPH请求'">
        <el-col :span="24" class="spanFull">
          <el-form-item label="文件提交:">
            <div>
              第I栏 OEE工作结果及其如需的译文
            </div>
            <el-row>
              <el-col :span="23">
                <el-form-item label="1">
                  <span>提交了OEE工作结果的副本</span>
                  <span>请求通过案卷访问系统或PATENTSCOPE获取上述文件</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="23">
                <el-form-item label="2" style="border-bottom: 1px solid #ebeef5;">
                  <span>提交了1之所述文件的译文</span>
                  <span>请求通过案卷访问系统或PATENTSCOPE获取上述文件</span>
                </el-form-item>
              </el-col>
            </el-row>

            <div>
              第II栏 OEE认定为可授权的所有权利要求的副本及其如需的译文
            </div>
            <el-row>
              <el-col :span="23">
                <el-form-item label="3">
                  <span>提交了OEE认定为可授权的所有权利要求的副本</span>
                  <span>请求通过案卷访问系统或PATENTSCOPE获取上述文件</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="23">
                <el-form-item label="4" style="border-bottom: 1px solid #ebeef5;">
                  <span>提交了3之所述文件的译文</span>
                  <span>请求通过案卷访问系统或PATENTSCOPE获取上述文件</span>
                </el-form-item>
              </el-col>
            </el-row>

            <div>
              第III栏 OEE工作结果引用的文件
            </div>
            <el-row>
              <el-col :span="23">
                <el-form-item label="5" style="border-bottom: 1px solid #ebeef5;">
                  <span>提交了OEE工作结果引用的所有文件的副本（专利文献除外）</span>
                  <span>无引用文件</span>
                </el-form-item>
              </el-col>
            </el-row>

            <div>
              第IV栏 已提交文件
            </div>
            <el-row>
              <el-col :span="23">
                <el-form-item label="6" style="border-bottom: 1px solid #ebeef5;">
                  若上述某些文件已经提交，请予说明：
                  <div>
                    申请人于: {{submitData.patenPphWjtj.subDate}} 在CN: {{submitData.patenPphWjtj.tcontent}} 中提交了:
                    {{submitData.patenPphWjtj.fileName}} 文件
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="reportMatter == 'PPH请求'">
        <el-col :span="24">
          <el-form-item label="权利要求对应性:">
            <div v-if="submitData.qldyxNo == 1">本申请的所有权利要求与OEE申请中可授权的权利要求充分对应</div>
            <div v-if="submitData.qldyxNo == 2">在下表中解释权利要求对应性:</div>
            <div class="buzheng" v-if="submitData.qldyxNo == 2">
              <el-table
                class="el-table1"
                :data="submitData.pphDyxList"
                style="width: 99.5%;"
                border
              >
                <el-table-column
                  label="本申请的权利要求"
                >
                  <template slot-scope="scope">
                    {{scope.row.benql}}
                  </template>
                </el-table-column>
                <el-table-column
                  label="对应的OEE权利要求"
                >
                  <template slot-scope="scope">
                    {{scope.row.oeeql}}
                  </template>
                </el-table-column>
                <el-table-column
                  label="关于对应性的解释"
                >
                  <template slot-scope="scope">
                    {{scope.row.jieshi}}
                  </template>
                </el-table-column>
              </el-table>
            </div>

          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="reportMatter == 'PPH请求'">
        <el-col :span="24">
          <el-form-item label="说明事项:">
            <div>
              <div>
                1.OEE工作结果的副本名称如下：
              </div>
              <div class="oee" style="">
                <div v-for="(item, index) in submitData.patenPphSmsxList" :key="index">
                  <div class="border-line">
                    OEE申请{{item.oeeApplicationNum}}
                    <!--                  <el-input size="mini" v-model="item.OEEApplicationNum" class="claims"-->
                    <!--                            style="max-width: 200px;"></el-input>-->
                  </div>
                  <div>
                    由{{item.person}}
                    <!--                  <el-input size="mini" v-model="item.person" class="claims"-->
                    <!--                            style="max-width: 200px;"></el-input>-->
                    于{{item.smDate}}
                    <!--                  <el-date-picker-->
                    <!--                    style="width: 150px;"-->
                    <!--                    v-model="item.smDate"-->
                    <!--                    type="date"-->
                    <!--                    placeholder="选择日期"-->
                    <!--                    value-format="yyyy-MM-dd">-->
                    <!--                  </el-date-picker>-->
                    作出的{{item.scontent}}
                    <!--                  <el-input size="mini" v-model="item.scontent" class="claims"-->
                    <!--                            style="max-width: 200px;"></el-input>-->
                  </div>
                </div>

              </div>
              <!--              <div style="padding-left: 20px">-->
              <!--                <div>-->
              <!--                  OEE申请:{{item.OEEApplicationNum}}-->
              <!--                </div>-->
              <!--                <div>-->
              <!--                  由: {{item.person}}-->
              <!--                  于: {{item.smDate}}-->
              <!--                  作出的: {{item.scontent}}-->
              <!--                </div>-->
              <!--              </div>-->
            </div>


            <div>
              2.OEE工作结果引用的文件副本名称如下：
            </div>
            <div v-for="(item, index) in submitData.pphWjfbList" :key="index" style="padding-left: 20px">
              <span style="display: inline-block; text-align: right;padding-right: 10px">{{index+1}}</span>
              .{{item.fbName}}
            </div>

            <div>
              3.特殊项的解释说明：
            </div>
            <div v-for="(item, index) in submitData.pphTsxList" :key="index" style="padding-left: 20px">
              <span style="display: inline-block; text-align: right;padding-right: 10px">{{index+1}}</span>.{{item.tsxjs}}
            </div>
          </el-form-item>
        </el-col>
      </el-row>


      <el-row v-if="reportMatter != '著录项目变更' && reportMatter != 'PCT国际新申请'">
        <el-col :span="24">
          <el-form-item label="上传文件:">
            <template>
              <div v-for="(item, index) in fileNameList" :key="item.materialTypeId"
                   style="display: flex;align-items: center">

                <up-load-files :view="true" :flielist="flielist" :cur-case-id="curCaseId[0]" :task-type="taskType"
                               :item="item"
                               @uploadSuccess="uploadSuccess" @removeFile="removeFile"></up-load-files>

              </div>
            </template>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="title" v-if="reportMatter != '著录项目变更' && reportMatter != 'PCT国际新申请'">
          <span>
            递交文件
          </span>
      </div>
      <div style="width: 100%;" v-if="reportMatter != '著录项目变更' && reportMatter != 'PCT国际新申请'">
        <el-table
          :data="transferDocList"
          border
          style="width: 100%">
          <el-table-column
            label="附件名称"
            width="180">
            <template slot-scope="scope">
              <span style="color: #409EFF;cursor: pointer" @click="preView(scope.row)">{{scope.row.materialName}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="subject"
            label="文件类型"
            width="180">
          </el-table-column>
          <el-table-column
            prop="typeName"
            label="文件描述">
          </el-table-column>
          <el-table-column
            prop="creater"
            label="上传者">
          </el-table-column>
          <el-table-column
            prop="createDate"
            label="上传时间">
          </el-table-column>
        </el-table>
      </div>
    </el-form>
    <div v-if="taskType == 4 && submissionType != 'view'" class="title">
        <span>
          递交事项
        </span>
    </div>
    <el-form v-if="taskType == 4 && submissionType != 'view'" class="" label-width="206px"
             style="padding: 0; overflow-x: auto; ">
      <el-row>
        <el-form-item label="递交方式:" prop="submitMode">
          <el-radio-group v-model="submitData.submitMode">
            <el-radio :disabled="reportMatter == 'PCT国际新申请'" label="CPC接口">CPC接口</el-radio>
            <el-radio :disabled="reportMatter == 'PCT国际新申请'" label="CPC手动">CPC手动</el-radio>
            <el-radio label="CEPCT手动">CEPCT手动</el-radio>
            <el-radio :disabled="reportMatter == 'PCT国际新申请'" label="纸件递交">纸件递交</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="递交事项:" prop="submitMode">
          <el-select size="mini" style="width: 50%;" default-first-option clearable filterable
                     v-model="submitData.reportMatter" placeholder="请选择"
                     @change="changeReports"
          >
            <el-option
              v-for="item in reportMatterList"
              :key="item.id"
              :label="item.typeName"
              :value="item.typeName">
              {{item.typeName}}
            </el-option>
          </el-select>
        </el-form-item>
      </el-row>

<!--      意见陈述（非正常申请）-->
      <el-row v-if="submitData.reportMatter === '意见陈述（非正常申请）'">
        <el-form-item label="陈述事项:" class="radio-flex">
          <el-radio-group style="margin: 10px 0;display: flex;flex-direction: column;" v-model="submitData.csitemOne">
            <el-radio style="margin-bottom: 10px" label="1">
              针对国家知识产权局于
                <el-date-picker
                  style="width: 150px;"
                  v-model="submitData.dispatchDate"
                  type="date"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
                发出的
                <el-input class="claims" style="max-width: 200px;"
                          type="text"
                          v-model="submitData.docTitle"></el-input>
                通知书(发文序号
                <el-input class="claims" style="max-width: 200px;"
                          type="text"
                          v-model="submitData.documentNo"></el-input>
                )陈述意见。
            </el-radio>
            <el-radio style="margin-bottom: 10px" label="2">
              针对国家知识产权局于
                <el-date-picker
                  style="width: 150px;"
                  v-model="submitData.dispatchDate"
                  type="date"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
                发出的
                <el-input class="claims" style="max-width: 200px;"
                          type="text"
                          v-model="submitData.docTitle"></el-input>
                通知书(发文序号
                <el-input class="claims" style="max-width: 200px;"
                          type="text"
                          v-model="submitData.documentNo"></el-input>
                )补充陈述意见。
            </el-radio>
            <el-radio label="3">
              其他事宜
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-row>
      <el-row v-if="submitData.reportMatter === '意见陈述（非正常申请）'">
        <el-form-item label="意见陈述书附页:" prop="">
          <div style="display: flex;justify-items: flex-start;align-items: center">
            <div
              style="width: 70%; display: flex;align-items: center">

              <up-load-files fileType="意见陈述书附页" :flielist="yjcsfyList" :cur-case-id="curCaseId[0]" :task-type="taskType"
                             :item="{typeName: '意见陈述书附页',materialTypeId: 301460 }"
                             @uploadSuccess="uploadSuccess" @removeFile="removeFile"></up-load-files>
              <el-button v-if="changeDoc&&patentType != 1298" size="mini" type="primary"
                           @click="transferDoc(yjcsfyList)"
                           style="margin-left: 10px">制作
                </el-button>

            </div>
          </div>
        </el-form-item>
      </el-row>

<!--      意见陈述（行政复议）-->
      <el-row v-if="submitData.reportMatter === '意见陈述（行政复议）'">
        <el-form-item label="陈述事项:">
          <el-radio-group style="display: flex;flex-direction: column;margin-bottom: 10px;margin-top: 10px" v-model="submitData.csitemOne">
            <!-- <el-radio style="margin-bottom: 10px" label='1'>
              主动提供证明材料(根据行政复议法实施条例第21条的规定)
            </el-radio>
            <el-radio style="margin-bottom: 10px"  label='2'>要求撤回行政复议申请(根据行政复议法第25条的规定)</el-radio> -->
            <el-radio label="4"
                           class="checklabel">
                针对国家知识产权局于
                <el-date-picker
                  :disabled="submitData.csitemOne != 4"
                  style="width: 150px;"
                  v-model="submitData.dispatchDate"
                  type="date"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
                发出的
                <el-input class="claims" style="max-width: 200px;" :disabled="submitData.csitemOne != 4"
                          type="text"
                          v-model="submitData.docTitle"></el-input>
                通知书(发文序号
                <el-input class="claims" style="max-width: 200px;" :disabled="submitData.csitemOne != 4"
                          type="text"
                          v-model="submitData.documentNo"></el-input>
                )陈述意见。
              </el-radio>
            <el-radio style="margin-bottom: 10px" label='1'>
              主动提供证据(根据行政复议法实施条例第44条的规定)
            </el-radio>
            <el-radio style="margin-bottom: 10px"  label='2'>要求撤回行政复议申请(根据行政复议法第41条的规定)</el-radio>
            <el-radio label='3'>其他事宜 <el-input :disabled="submitData.csitemOne != 3" class="claims" style="max-width: 300px" v-model="submitData.qita"></el-input></el-radio>
          </el-radio-group>
        </el-form-item>
      </el-row>
<!--      行政复议-->
      <el-row v-if="submitData.reportMatter === '行政复议'">
        <el-form-item label="请求内容:" class="radio-flex">
          <div>根据《中华人民共和国行政复议法》的规定,</div>
          <el-radio-group style="display: flex;flex-direction: column;margin-bottom: 10px" v-model="submitData.csitemOne">
            <el-radio label='1'>
              对国家知识产权局于
              <el-date-picker
                :disabled="submitData.csitemOne != 1"
                style="width: 150px;"
                v-model="submitData.dispatchDate"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd">
              </el-date-picker>
              日作出的
              <el-input :disabled="submitData.csitemOne != 1" class="claims" style="max-width: 200px" v-model="submitData.xzxw"></el-input>
              行政行为不服，现申请行政复议
            </el-radio>
            <el-radio label='2'>
              对国家知识产权局应当作出
              <el-input :disabled="submitData.csitemOne != 2" class="claims" style="max-width: 200px" v-model="submitData.ydxzxw"></el-input>
              具体行政行为、但未作出而不服，现申请行政复议
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-row>

<!--      无效宣告程序优先审查-->
      <el-row v-if="submitData.reportMatter === '无效宣告程序优先审查'">
        <el-form-item label="请求优先审查的理由:">
          <el-checkbox-group v-model="submitData.csitemList">
            <el-checkbox label="1">
              无效宣告案件涉及的专利发生侵权纠纷，当事人已请求地方知识产权局处理、向人民法院起诉或者请求仲裁调解组织仲裁调解
            </el-checkbox>
            <el-checkbox label="2">
              无效宣告案件涉及的专利对国家利益或者公共利益具有重大意义
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-row>
      <el-row v-if="submitData.reportMatter === '无效宣告程序优先审查'">
        <el-form-item label="优先审查请求人声明:">
          <el-checkbox style="margin-top: 10px" :true-label="1" v-model="submitData.shengming">
            优先审查请求人已认真阅读并同意遵守《专利优先审查管理办法》的各项规定
          </el-checkbox>
        </el-form-item>
      </el-row>

<!--      复审优先审查-->
      <el-row v-if="submitData.reportMatter === '复审优先审查'">
        <el-form-item label="请求优先审查的理由:">
          <el-checkbox-group v-model="submitData.csitemList">
            <el-checkbox label="1">
              专利复审案件涉及节能环保、新一代信息技术、生物、高端装备制造、新能源、新材料、新能源汽车和智能制造等国家重点发展产业
            </el-checkbox>
            <el-checkbox label="2">
              专利复审案件涉及各省级和设区的市级人民政府重点鼓励的产业
            </el-checkbox>
            <el-checkbox label="3">
              专利复审案件涉及互联网、大数据、云计算等领域且技术或者产品更新速度快
            </el-checkbox>
            <el-checkbox label="4">
              复审请求人已经做好实施准备或者已经开始实施，或有证据证明他人正在实施其发明创造
            </el-checkbox>
            <el-checkbox label="5">
              就相同主题首次在中国提出专利申请又向其他国家或地区提出申请的该中国首次申请
            </el-checkbox>
            <div style="display: flex;margin-left: 40px;">
              <el-checkbox label="6">
                <span style="line-height: 28px;">PCT途径， 国际申请号</span><el-input class="claims" v-model="submitData.pctFileNo" style="max-width: 150px"></el-input>
              </el-checkbox>
              <el-checkbox label="7">
                巴黎公约途径
              </el-checkbox>
            </div>
            <el-checkbox label="8">
              其他对国家利益或者公共利益具有重大意义需要优先审查的专利复审案件
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-row>
      <el-row v-if="submitData.reportMatter === '复审优先审查'">
        <el-form-item label="优先审查请求人声明:">
          <el-checkbox style="margin-top: 10px" :true-label="1" v-model="submitData.shengming">
            优先审查请求人已认真阅读并同意遵守《专利优先审查管理办法》的各项规定
          </el-checkbox>
        </el-form-item>
      </el-row>

<!--      主动修改-->
      <el-row v-if="submitData.reportMatter === '主动修改'">
        <el-form-item label="主动修改方式:">
          <el-radio-group v-model="submitData.mdType" style="margin-left: 10px" @change="changeMdType">
            <el-radio label='补正'>补正</el-radio>
            <el-radio label='意见陈述'>意见陈述</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-row>

      <el-row v-show="['普通新申请', 'PCT进入国家阶段'].includes(reportMatter)">
        <el-form-item prop="submitMode">
          <template slot="label"><span class="required-asterisk">*</span>申请文本</template>
          <div style="display: flex;justify-items: flex-start;align-items: center">
            <div
              style="width: 70%; display: flex;align-items: center">

              <up-load-files :view="submitData.submitStatus === 5" fileType="申请文本" :flielist="applyList" :cur-case-id="curCaseId[0]" :task-type="taskType"
                             :item="{typeName: applyFileList.filter(item=>item.materialTypeId == applyFileId).typeName,materialTypeId: applyFileId }"
                             @uploadSuccess="uploadSuccess" @removeFile="removeFile"></up-load-files>

              <div v-if="changeDoc&&patentType != 1298" style="display: flex;align-items: center">
                <template>
                  <el-radio v-model="convertFormat" label="xml">xml</el-radio>
                  <el-radio v-model="convertFormat" label="pdf">pdf</el-radio>
                </template>
                <el-button
                  v-if="convertFormat === 'xml'"
                  size="mini"
                  type="primary"
                  @click="transferXml(applyList)"
                  style="margin-left: 10px">解析
                </el-button>
                <el-button
                  v-else
                  size="mini"
                  type="primary"
                  @click="transferDoc(applyList)"
                  style="margin-left: 10px">制作
                </el-button>
              </div>
            </div>
          </div>
        </el-form-item>
      </el-row>
      <el-row v-show="['PCT进入国家阶段'].includes(reportMatter)">
        <el-col :span="24">
          <el-form-item label="修改对照页:">
            <div style="display: flex;justify-items: flex-start;align-items: center">
              <div
                style="width: 70%; display: flex;align-items: center">

                <up-load-files fileType="修改对照页" :flielist="xgdzList" :cur-case-id="curCaseId[0]"
                               :task-type="taskType"
                               :item="{typeName: '修改对照页',materialTypeId: 301448 }"
                               @uploadSuccess="uploadSuccess" @removeFile="removeFile"></up-load-files>
                <el-button v-if="changeDoc&&patentType != 1298" size="mini" type="primary"
                           @click="transferDoc(xgdzList)"
                           style="margin-left: 10px">制作
                </el-button>

              </div>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-show="['PCT进入国家阶段'].includes(reportMatter)">
        <el-col :span="24">
          <el-form-item label="替换页:">
            <div style="display: flex;justify-items: flex-start;align-items: center">
              <div
                style="width: 70%; display: flex;align-items: center">

                <up-load-files fileType="替换页" :flielist="tihuanList" :cur-case-id="curCaseId[0]"
                               :task-type="taskType"
                               :item="{typeName: '替换页',materialTypeId: 301486 }"
                               @uploadSuccess="uploadSuccess" @removeFile="removeFile"></up-load-files>
                <div v-if="changeDoc&&patentType != 1298" style="display: flex;align-items: center">
                  <template>
                    <el-radio v-model="convertFormat" label="xml">xml</el-radio>
                    <el-radio v-model="convertFormat" label="pdf">pdf</el-radio>
                  </template>
                  <el-button
                    v-if="convertFormat === 'xml'"
                    size="mini"
                    type="primary"
                    @click="transferXml(tihuanList)"
                    style="margin-left: 10px">解析
                  </el-button>
                  <el-button v-else size="mini" type="primary"
                            @click="transferDoc(tihuanList)"
                            style="margin-left: 10px">制作
                  </el-button>
                </div>
              </div>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-show="['PCT进入国家阶段'].includes(reportMatter)">
        <el-col :span="24">
          <el-form-item label="修改说明:">
            <div style="display: flex;justify-items: flex-start;align-items: center">
              <div
                style="width: 70%; display: flex;align-items: center">

                <up-load-files fileType="修改说明" :flielist="xgsmList" :cur-case-id="curCaseId[0]"
                               :task-type="taskType"
                               :item="{typeName: '修改说明',materialTypeId: 301485 }"
                               @uploadSuccess="uploadSuccess" @removeFile="removeFile"></up-load-files>
                <el-button v-if="changeDoc&&patentType != 1298" size="mini" type="primary"
                           @click="transferDoc(xgsmList)"
                           style="margin-left: 10px">制作
                </el-button>

              </div>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="reportMatter == '普通新申请' || (reportMatter == 'PCT进入国家阶段' && (patentType == 1296 || patentType == 1297))">
        <el-form-item label="不丧失新颖性宽限期声明:">
          <el-checkbox-group v-model="submitData.bushixy">
            <el-checkbox  label="1">
              已在国家出现紧急状态或者非常情况时，为公共利益目的首次公开
            </el-checkbox>
            <el-checkbox  label="2">
              已在中国政府主办或承认的国际展览会上首次展出
            </el-checkbox>
            <el-checkbox  label="3">
              已在规定的学术会议或技术会议上首次发表
            </el-checkbox>
            <el-checkbox  label="4">
              他人未经申请人同意而泄露其内容
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-row>
      <el-row v-if="reportMatter == 'PCT进入国家阶段' && (patentType == 1296 || patentType == 1297)">
        <el-form-item label="复查请求:">
          <el-checkbox-group v-model="submitData.fucha" @change="changeFuchaCheckBox">
            <el-checkbox  label="1">
              <span style="line-height: 28px;">申请人于</span>
              <el-date-picker
                style="width: 150px;"
                v-model="submitData.dispatchDate"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd">
              </el-date-picker>
              <span style="line-height: 28px;">收到下列通知</span>
            </el-checkbox>
            <el-radio-group :disabled="!submitData.fucha.includes('1')" class="" style="margin-left:20px;display: flex;flex-direction: column;" v-model="fuchaRadio" @change="changeFuchaRadio">
                <el-radio style="margin-bottom: 10px" label='2'>受理局拒绝给予国际申请日</el-radio>
                <el-radio style="margin-bottom: 10px" class="" label='3'>国际局按专利合作条约第12条（3）作出认定</el-radio>
                <el-radio style="margin-bottom: 10px" class="" label='4'>受理局宣布申请被认为撤回</el-radio>
              </el-radio-group>
            <el-checkbox  label="5" @change="changeBox">
              根据专利合作条约第25条特此向国家知识产权局提出复查请求，并且

            </el-checkbox>
            <div style="margin-left: 20px">
              <el-checkbox :disabled="!submitData.fucha.includes('5')" label="6">
                已请求国际局将档案中有关文件传送国家知识产权局
              </el-checkbox>
              <el-checkbox :disabled="!submitData.fucha.includes('5')" label="7">
                已经按照专利法实施细则第120条办理进入国家阶段手续
              </el-checkbox>
            </div>
          </el-checkbox-group>
        </el-form-item>
      </el-row>
      <el-row v-if="reportMatter == '普通新申请'">
        <el-form-item label="同日申请:">
          <el-checkbox style="padding-top: 10px" :true-label="1" v-model="submitData.trsq">
            <div>声明本实用新型在同日申请发明专利</div>
          </el-checkbox>
        </el-form-item>
      </el-row>
      <el-row v-if="reportMatter == '普通新申请'">
        <el-form-item label="提前公布:">
          <el-checkbox style="padding-top: 10px" :true-label="1" v-model="submitData.tqgb">
            <div>请求早日公布该专利申请</div>
          </el-checkbox>
        </el-form-item>
      </el-row>
      <el-row v-if="reportMatter == 'PCT进入国家阶段' &&  patentType == 1297">
        <el-form-item label="提前处理:">
          <el-checkbox-group v-model="submitData.csitemList">
            <el-checkbox label="1">自优先权日起30个月的期限尚未届满，请求国家知识产权局根据专利法实施细则第111条提前处理和审查本国际申请</el-checkbox>
            <el-checkbox label="2">本国际申请尚未国际公布，请求国家知识产权局作为指定局要求国际局传送国际申请文件副本</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-row>
      <el-row v-if="reportMatter == '普通新申请' && patentType == 1298">
        <el-form-item label="相似设计:">
          <el-checkbox style="padding-top: 10px" :true-label="1" v-model="submitData.xssj">
            <div>
              本案为同一产品的相似外观设计，其所包含的项数为
              <el-input class="claims" v-model="submitData.xsdesign" style="max-width: 100px;"></el-input>
              项
            </div>
          </el-checkbox>
        </el-form-item>
      </el-row>
      <el-row v-if="reportMatter == '普通新申请' && patentType == 1298">
        <el-form-item label="成套产品设计:">
          <el-checkbox style="padding-top: 10px" :true-label="1" v-model="submitData.ctsj">
            <div>
              本案为成套产品的多项外观设计，其所包含的项数为
              <el-input class="claims" v-model="submitData.ctdesign" style="max-width: 100px;"></el-input>
              项
            </div>
          </el-checkbox>
        </el-form-item>
      </el-row>
      <el-row v-if="reportMatter == '普通新申请' && patentType == 1298">
        <el-form-item label="局部设计:">
          <el-checkbox style="padding-top: 10px" :true-label="1" v-model="submitData.jbdesign">
            <div>
              本案请求保护的外观设计为局部外观设计
            </div>
          </el-checkbox>
        </el-form-item>
      </el-row>
      <el-row v-if="reportMatter == '普通新申请' && patentType == 1298 || reportMatter == 'PCT进入国家阶段' && patentType == 1297">
        <el-form-item label="放弃主动修改权利:">
          <el-checkbox style="padding-top: 10px" :true-label="1" v-model="submitData.fangqi">
            <div>
              申请人声明，放弃专利法实施细则第{{patentType == 1298 ? '51' : '112'}}条规定的主动修改的权利
            </div>
          </el-checkbox>
        </el-form-item>
      </el-row>
      <el-row v-if="reportMatter == '普通新申请' && patentType == 1298">
        <el-form-item label="延迟审查:">
            <div class="noBottom" style="height: 100%; display: flex;align-items: center;">
              <el-checkbox  :true-label="1" :false-label="0" v-model="submitData.ycsc"></el-checkbox>
              <span style="margin-left: 10px;color: #606266;">请求对本申请延迟审查，延迟期限为</span>
              <el-input placeholder="请输入1-36之间的数字" style="width: 200px;margin-left: 10px;" type="number" :min="1" :max="36" size="small" v-model="submitData.ycmonth"
                @input="(v) => { if (v === '' || v === null || v === undefined) { submitData.ycmonth = '' } else { let n = parseInt(v); if (isNaN(n) || n < 1) { submitData.ycmonth = 1 } else if (n > 36) { submitData.ycmonth = 36 } else { submitData.ycmonth = n } } }">
                <template slot="append">个月</template>
              </el-input>
            </div>
        </el-form-item>
      </el-row>

      <el-row v-if="reportMatter == '普通新申请' && patentType == 1297">
        <el-form-item label="主动放弃:">
          <el-checkbox style="padding-top: 10px" :true-label="1" v-model="submitData.fangqi">
            <div>申请人声明，放弃专利法实施细则第51条规定的主动修改的权利</div>
          </el-checkbox>
        </el-form-item>
      </el-row>
      <el-row v-if="(reportMatter == '普通新申请' || reportMatter == 'PCT进入国家阶段') && patentType == 1296">
        <el-form-item label="请求实质审查:">
          <el-checkbox-group v-model="submitData.szsc" @change="changeSzsc">
            <el-checkbox  label="1">
              根据专利法第35条的规定，请求对该专利申请进行实质审查
            </el-checkbox>
            <div style="display:flex;font-size: 14px;">
              <span style="margin: 0 30px 10px 0">请求对本申请延迟审查，延迟期限为:</span>
              <el-radio-group :disabled="!submitData.szsc.includes('1')" class="fl-ac-jc" v-model="szscRadio" style="height: 40px;padding-top: 13px" @change="changeSzscRadio">
                <el-radio label='2'>1年</el-radio>
                <el-radio class="" label='3'>2年</el-radio>
                <el-radio class="" label='4'>3年</el-radio>
              </el-radio-group>
<!--              <el-checkbox  label="2">-->
<!--                1年-->
<!--              </el-checkbox>-->
<!--              <el-checkbox  label="3">-->
<!--                2年-->
<!--              </el-checkbox>-->
<!--              <el-checkbox  label="4">-->
<!--                3年-->
<!--              </el-checkbox>-->
            </div>
            <el-checkbox  label="5">
              申请人声明，放弃专利法实施细则第57条规定的主动修改的权利
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-row>
      <el-row v-show="['普通新申请','PCT进入国家阶段'].includes(reportMatter)">
        <el-form-item class="new-apply-sub" label="新申请递交信息:">
          <el-form class="submission" label-width="100px" :model="submissionForm" :rules="rules" style="max-height: 100%">
            <div class="" v-if="caseType == '普通新申请' || caseType == 'PCT国家阶段' || caseType == 'PCT国际申请'">
              <div v-if="!(caseType == '普通新申请' && patentType == 1298)">
              <div v-if="caseType == 'PCT国际申请'">
                <el-row class="border-top">
                  <el-col :span="6">
                    <el-form-item label="文稿字数:">
                      <el-input type="text" size="small" v-model="submissionForm.wordsNum"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="说明书页数:">
                      <el-input type="text" size="small" v-model="submissionForm.descriptionPages"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="附图幅数:">
                      <el-input type="text" size="small" v-model="submissionForm.appendedDrawings"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="附图页数:">
                      <el-input type="text" size="small" v-model="submissionForm.drawingPages"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row class="">
                  <el-col :span="6">
                    <el-form-item label="权利要求项数:">
                      <el-input type="text" size="small" v-model="submissionForm.claimItems"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="权利要求页数:">
                      <el-input type="text" size="small" v-model="submissionForm.claimPages"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="费减比例:" prop="feeReduce">
                      <el-select v-model="submissionForm.feeReduce" @change="feeReduceChange" filterable clearable placeholder="请选择">
                        <el-option
                          v-for="item in ['0.70',' 0.85']"
                          :key="item"
                          :label="item"
                          :value="item">
                          <!--                  <UserIconAndUserName :user-id="item.userId"></UserIconAndUserName>-->
                        </el-option>
                      </el-select>
<!--                      <el-input type="number" size="small" @change="feeReduceChange"-->
<!--                                v-model="submissionForm.feeReduce"></el-input>-->
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="摘要附图页数:">
                      <el-input type="text" size="small" v-model="submissionForm.substractDrawing"></el-input>
                    </el-form-item>
                  </el-col>

                </el-row>
              </div>
              <div v-else>
                <el-row class="border-top">
                  <el-col :span="6">
                    <el-form-item label="文稿字数:">
                      <el-input type="text" size="small" v-model="submissionForm.wordsNum"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="说明书页数:">
                      <el-input type="text" size="small" v-model="submissionForm.descriptionPages"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="附图幅数:">
                      <el-input type="text" size="small" v-model="submissionForm.appendedDrawings"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="附图页数:">
                      <el-input type="text" size="small" v-model="submissionForm.drawingPages"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row class="">
                  <el-col :span="6">
                    <el-form-item label="权利要求项数:">
                      <el-input type="text" size="small" v-model="submissionForm.claimItems"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="权利要求页数:">
                      <el-input type="text" size="small" v-model="submissionForm.claimPages"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="摘要页数:">
                      <el-input type="text" size="small" v-model="submissionForm.substractPage"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="摘要附图页数:">
                      <el-input type="text" size="small" v-model="submissionForm.substractDrawing"></el-input>
                    </el-form-item>
                  </el-col>

                </el-row>
                <el-row class="">

                  <el-col :span="hasPatentPriority ? 6: 12">
                    <el-form-item label="摘要附图指定图:">
                      <el-input type="text" size="small" v-model="submissionForm.substractDrwno"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col v-show="hasZw" :span="hasPatentPriority ? 6: 12">
                    <el-form-item label="缺委托书:">
                      <!--              <el-input type="text" size="small" v-model="submissionForm.nopower"></el-input>-->
                      <el-radio-group v-model="submissionForm.nopower" style="margin-left: 10px">
                        <el-radio :label='1'>是</el-radio>
                        <el-radio :label='0'>否</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                  <el-col v-show="!hasZw" :span="hasPatentPriority ? 6: 12">
                    <el-form-item>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12" v-if="caseType != 'PCT国家阶段' && hasPatentPriority">
                    <el-form-item label="缺优证文件:">
                      <el-radio-group v-model="submissionForm.priorityFile" style="margin-left: 10px">
                        <el-radio :label='1'>是</el-radio>
                        <el-radio :label='0'>否</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                  <el-col v-if="caseType == 'PCT国家阶段' && hasPatentPriority" :span="12">
                    <el-form-item></el-form-item>
                  </el-col>
                </el-row>
                <el-row class="">
                  <el-col :span="caseType == '普通新申请' || caseType == 'PCT国家阶段' ? 6 : 12">
                    <el-form-item label="要求DAS:">
                      <!--              <el-input type="text" size="small" v-model="submissionForm.das"></el-input>-->
                      <el-radio-group v-model="submissionForm.das" style="margin-left: 10px">
                        <el-radio :label='1'>是</el-radio>
                        <el-radio :label='0'>否</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6" v-show="submissionForm.appFromto == '内-内'">
                    <el-form-item label="预审案件:">
                      <el-radio-group v-model="submissionForm.preexamine" style="margin-left: 10px">
                        <el-radio :label='1'>是</el-radio>
                        <el-radio :label='0'>否</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12" v-if="caseType == '普通新申请'">
                    <el-form-item label="要求优先审查:">
                      <el-radio-group v-model="submissionForm.tqsc" style="margin-left: 10px">
                        <el-radio :label='1'>是</el-radio>
                        <el-radio :label='0'>否</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                  <el-col v-if="caseType == 'PCT国家阶段'" :span="12">
                    <el-form-item>
                      <span slot="label">要求审查高速公路<br>(PPH)</span>
                      <el-radio-group v-model="submissionForm.dopph" style="margin-left: 10px">
                        <el-radio :label='1'>是</el-radio>
                        <el-radio :label='0'>否</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6" v-show="submissionForm.appFromto != '内-内'">
                    <el-form-item></el-form-item>
                  </el-col>

                </el-row>
                <el-row v-show="caseType == 'PCT国家阶段' && (patentType == 1296)">
                  <el-col :span="6">
                    <el-form-item label="进入国家阶段期限:">
                      <!--              <el-input type="text" size="small"></el-input>-->
                      <el-radio-group style="margin-left: 10px;margin-top:10px" v-model="submissionForm.pctKxq">
                        <el-radio :label='1458'>提前进入</el-radio>
                        <el-radio :label='1459'>30个月内提交</el-radio>
                        <el-radio :label='1460'>32个月内提交</el-radio>
                        <el-radio :label='1461'>31个月内提交</el-radio>
                      </el-radio-group>

                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="根据条约第19条修改的权利要求和声明:">
                      <!--              <el-input type="text" size="small" v-model="submissionForm.xgwjyw1"></el-input>-->
                      <el-radio-group v-model="submissionForm.xgwjyw1" style="margin-left: 10px">
                        <el-radio :label='1'>是</el-radio>
                        <el-radio :label='0'>否</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
<!--                  <el-col :span="6">-->
<!--                    <el-form-item label="根据条约第19条修改时的声明:">-->
<!--                      &lt;!&ndash;              <el-input type="text" size="small" v-model="submissionForm.xgwjyw2"></el-input>&ndash;&gt;-->
<!--                      <el-radio-group v-model="submissionForm.xgwjyw2" style="margin-left: 10px">-->
<!--                        <el-radio :label='1'>是</el-radio>-->
<!--                        <el-radio :label='0'>否</el-radio>-->
<!--                      </el-radio-group>-->

<!--                    </el-form-item>-->
<!--                  </el-col>-->
                  <el-col :span="6">
                    <el-form-item label="修改文件（28或41条）:">
                      <!--              <el-input type="text" size="small" v-model="submissionForm.xgwj"></el-input>-->
                      <el-radio-group v-model="submissionForm.xgwj" style="margin-left: 10px">
                        <el-radio :label='1'>是</el-radio>
                        <el-radio :label='0'>否</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="修改文件（34条）:">
                      <el-radio-group v-model="submissionForm.law34" style="margin-left: 10px">
                        <el-radio :label='1'>是</el-radio>
                        <el-radio :label='0'>否</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>

                </el-row>

                <el-row v-show="caseType == 'PCT国家阶段' && (patentType == 1297)">
                  <!--          <el-col :span="10">-->
                  <!--            <el-form-item label="转出所至">-->
                  <!--              <el-input type="text" size="small" v-model="submissionForm.alteragency"></el-input>-->
                  <!--            </el-form-item>-->
                  <!--          </el-col>-->
                  <el-col :span="18">
                    <el-form-item label="进入国家阶段期限:">
                      <!--              <el-input type="text" size="small"></el-input>-->
                      <el-radio-group style="margin-left: 10px" v-model="submissionForm.pctKxq">
                        <el-radio :label='1458'>提前进入</el-radio>
                        <el-radio :label='1459'>30个月内提交</el-radio>
                        <el-radio :label='1460'>32个月内提交</el-radio>
                        <el-radio :label='1461'>31个月内提交</el-radio>
                      </el-radio-group>

                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="摘要附图指定图:">
                      <el-input type="text" size="small" v-model="submissionForm.substractDrwno"></el-input>
                    </el-form-item>
                  </el-col>

                </el-row>

                <div v-if="caseType == '普通新申请' && patentType==1296">
                  <el-row>
                    <el-col :span="submissionForm.ishk == 1 ? 6 : 12">
                      <el-form-item label="要求提交香港申请:">
                        <el-radio-group v-model="submissionForm.ishk" style="margin-left: 10px">
                          <el-radio :label='1'>是</el-radio>
                          <el-radio :label='0'>否</el-radio>
                        </el-radio-group>
                      </el-form-item>
                    </el-col>
                    <el-col class="special-width" v-show="submissionForm.ishk == 1" :span="6">
                      <el-form-item label="香港申请案号:">
                        <el-select
                          v-model="submissionForm.hkRefNoList"
                          ref="custSelect"
                          filterable
                          clearable
                          remote
                          multiple
                          reserve-keyword
                          placeholder="请输入关键词"
                          :remote-method="queryCaseAgentNumList"
                        >
                          <el-option
                            v-for="item in anotherCaseNumList"
                            :key="item.agentNum"
                            :label="item.agentNum"
                            :value="item.agentNum"
                          >
                          </el-option>
                        </el-select>

                      </el-form-item>
                    </el-col>
                    <el-col :span="submissionForm.needdiv == 1 ? 6 : 12">
                      <el-form-item label="是否需要提交分案申请:">
                        <el-radio-group v-model="submissionForm.needdiv" style="margin-left: 10px">
                          <el-radio :label='1'>是</el-radio>
                          <el-radio :label='0'>否</el-radio>
                        </el-radio-group>
                      </el-form-item>
                    </el-col>
                    <el-col class="special-width" v-show="submissionForm.needdiv == 1 " :span="6">
                      <el-form-item label="分案申请案号:">
                        <el-select
                          v-model="submissionForm.divcaseList"
                          ref="custSelect"
                          filterable
                          clearable
                          remote
                          multiple
                          :reserve-keyword="false"
                          placeholder="请输入关键词"
                          :remote-method="queryCaseAgentNumList"
                          @change="agentNumChange"
                        >
                          <el-option
                            v-for="item in anotherCaseNumList"
                            :key="item.agentNum"
                            :label="item.agentNum"
                            :value="item.agentNum"
                          >
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="6">
                      <el-form-item label="要求提交IDS:">
                        <el-radio-group v-model="submissionForm.needIds" style="margin-left: 10px">
                          <el-radio :label='1'>是</el-radio>
                          <el-radio :label='0'>否</el-radio>
                        </el-radio-group>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="费减比例:" prop="feeReduce">
                        <el-select v-model="submissionForm.feeReduce" @change="feeReduceChange" filterable clearable placeholder="请选择">
                        <el-option
                          v-for="item in ['0.70',' 0.85']"
                          :key="item"
                          :label="item"
                          :value="item">
                          <!--                  <UserIconAndUserName :user-id="item.userId"></UserIconAndUserName>-->
                        </el-option>
                      </el-select>
<!--                        <el-input type="number" size="small"-->
<!--                                  @change="feeReduceChange"-->
<!--                                  v-model="submissionForm.feeReduce"></el-input>-->
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="要求新申请同时提实审:">
                        <el-radio-group v-model="submissionForm.tstss" style="margin-left: 10px">
                          <el-radio :label='1'>是</el-radio>
                          <el-radio :label='0'>否</el-radio>
                        </el-radio-group>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="提前公布:">
                        <el-radio-group v-model="submissionForm.tqgk" style="margin-left: 10px">
                          <el-radio :label='1'>是</el-radio>
                          <el-radio :label='0'>否</el-radio>
                        </el-radio-group>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>

                <div v-show="caseType == 'PCT国家阶段'  && (patentType == 1296 || patentType == 1297)">
                  <el-row>
                    <el-col :span="submissionForm.ishk == 1 ? 6 : 12">
                      <el-form-item label="要求提交香港申请:">
                        <el-radio-group v-model="submissionForm.ishk" style="margin-left: 10px">
                          <el-radio :label='1'>是</el-radio>
                          <el-radio :label='0'>否</el-radio>
                        </el-radio-group>
                      </el-form-item>
                    </el-col>
                    <el-col class="special-width" v-show="submissionForm.ishk == 1" :span="6">
                      <!--                    <el-col :span="6">-->

                      <el-form-item label="香港申请案号:">
                        <el-select
                          v-model="submissionForm.hkRefNoList"
                          ref="custSelect"
                          filterable
                          clearable
                          remote
                          multiple
                          reserve-keyword
                          placeholder="请输入关键词"
                          :remote-method="queryCaseAgentNumList"
                        >
                          <el-option
                            v-for="item in anotherCaseNumList"
                            :key="item.agentNum"
                            :label="item.agentNum"
                            :value="item.agentNum"
                          >
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="submissionForm.needdiv == 1 ? 6 : 12">
                      <el-form-item label="是否需要提交分案申请:">
                        <el-radio-group v-model="submissionForm.needdiv" style="margin-left: 10px">
                          <el-radio :label='1'>是</el-radio>
                          <el-radio :label='0'>否</el-radio>
                        </el-radio-group>
                      </el-form-item>
                    </el-col>
                    <el-col class="special-width" v-show="submissionForm.needdiv == 1 " :span="6">
                      <el-form-item label="分案申请案号:">
                        <el-select
                          v-model="submissionForm.divcaseList"
                          ref="custSelect"
                          filterable
                          clearable
                          remote
                          multiple
                          reserve-keyword
                          placeholder="请输入关键词"
                          :remote-method="queryCaseAgentNumList"
                          @change="agentNumChange"
                        >
                          <el-option
                            v-for="item in anotherCaseNumList"
                            :key="item.agentNum"
                            :label="item.agentNum"
                            :value="item.agentNum"
                          >
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="patentType == 1296 ? 6 :12">
                      <el-form-item label="要求提交IDS:">
                        <el-radio-group v-model="submissionForm.needIds" style="margin-left: 10px">
                          <el-radio :label='1'>是</el-radio>
                          <el-radio :label='0'>否</el-radio>
                        </el-radio-group>
                      </el-form-item>
                    </el-col>
                    <el-col :span="patentType == 1296 ? 6 :12">
                      <el-form-item label="费减比例:" prop="feeReduce">
                        <el-select v-model="submissionForm.feeReduce" @change="feeReduceChange" filterable clearable placeholder="请选择">
                        <el-option
                          v-for="item in ['0.70',' 0.85']"
                          :key="item"
                          :label="item"
                          :value="item">
                          <!--                  <UserIconAndUserName :user-id="item.userId"></UserIconAndUserName>-->
                        </el-option>
                      </el-select>
<!--                        <el-input type="number" size="small"-->
<!--                                  @change="feeReduceChange"-->
<!--                                  v-model="submissionForm.feeReduce"></el-input>-->
                      </el-form-item>
                    </el-col>
                    <el-col :span="6" v-if="patentType == 1296">
                      <el-form-item label="要求新申请同时提实审:">
                        <!--              <el-input type="text" size="small" v-model="submissionForm.tstss"></el-input>-->
                        <el-radio-group v-model="submissionForm.tstss" style="margin-left: 10px">
                          <el-radio :label='1'>是</el-radio>
                          <el-radio :label='0'>否</el-radio>
                        </el-radio-group>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6" v-if="patentType == 1296">
                      <el-form-item label="提前公布:">
                        <el-radio-group v-model="submissionForm.tqgk" style="margin-left: 10px">
                          <el-radio :label='1'>是</el-radio>
                          <el-radio :label='0'>否</el-radio>
                        </el-radio-group>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>

                <el-row v-show="caseType == '普通新申请' && (patentType == 1297 || patentType == 1298)">
                  <el-col :span="submissionForm.needdiv == 1 ? 6 : 12">
                    <el-form-item label="是否需要提交分案申请:">
                      <el-radio-group v-model="submissionForm.needdiv" style="margin-left: 10px">
                        <el-radio :label='1'>是</el-radio>
                        <el-radio :label='0'>否</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                  <el-col class="special-width" v-show="submissionForm.needdiv == 1 " :span="6">
                    <el-form-item label="分案申请案号:">
                      <el-select
                        v-model="submissionForm.divcaseList"
                        ref="custSelect"
                        filterable
                        clearable
                        remote
                        multiple
                        reserve-keyword
                        placeholder="请输入关键词"
                        :remote-method="queryCaseAgentNumList"
                        @change="agentNumChange"
                      >
                        <el-option
                          v-for="item in anotherCaseNumList"
                          :key="item.agentNum"
                          :label="item.agentNum"
                          :value="item.agentNum"
                        >
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="要求提交IDS:">
                      <el-radio-group v-model="submissionForm.needIds" style="margin-left: 10px">
                        <el-radio :label='1'>是</el-radio>
                        <el-radio :label='0'>否</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="费减比例:" prop="feeReduce">
                      <el-select v-model="submissionForm.feeReduce" @change="feeReduceChange" filterable clearable placeholder="请选择">
                        <el-option
                          v-for="item in ['0.70',' 0.85']"
                          :key="item"
                          :label="item"
                          :value="item">
                          <!--                  <UserIconAndUserName :user-id="item.userId"></UserIconAndUserName>-->
                        </el-option>
                      </el-select>
<!--                      <el-input type="number" size="small"-->
<!--                                @change="feeReduceChange"-->
<!--                                v-model="submissionForm.feeReduce"></el-input>-->
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
            </div>

              <div v-else >
              <el-row class="border-top">
                <el-col :span="6">
                  <el-form-item label="相似设计项数:">
                    <el-input type="number" size="small" v-model="submissionForm.wgxsNum"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="成套设计项数:">
                    <el-input type="number" size="small" v-model="submissionForm.wgctNum"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="局部设计:">
                    <el-radio-group v-model="submissionForm.jusjbj" style="margin-left: 10px">
                      <el-radio :label='1'>是</el-radio>
                      <el-radio :label='0'>否</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col v-show="hasZw" :span="6">
                    <el-form-item label="缺委托书:">
                      <!--              <el-input type="text" size="small" v-model="submissionForm.nopower"></el-input>-->
                      <el-radio-group v-model="submissionForm.nopower" style="margin-left: 10px">
                        <el-radio :label='1'>是</el-radio>
                        <el-radio :label='0'>否</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                  <el-col v-show="!hasZw" :span="6">
                    <el-form-item>
                    </el-form-item>
                  </el-col>
              </el-row>
              <div>
                <el-row>
                  <el-col :span="6">
                    <el-form-item label="请求优先审查:">
                      <el-radio-group v-model="submissionForm.tqsc" style="margin-left: 10px">
                        <el-radio :label='1'>是</el-radio>
                        <el-radio :label='0'>否</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="要求DAS:">
                      <el-radio-group v-model="submissionForm.das" style="margin-left: 10px">
                        <el-radio :label='1'>是</el-radio>
                        <el-radio :label='0'>否</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6" v-show="hasPatentPriority">
                    <el-form-item label="缺优证文件:">
                      <el-radio-group v-model="submissionForm.priorityFile" style="margin-left: 10px">
                        <el-radio :label='1'>是</el-radio>
                        <el-radio :label='0'>否</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                  <el-col :span="hasPatentPriority ? 6 : 12">
                    <el-form-item label="预审案件:">
                      <el-radio-group v-model="submissionForm.preexamine" style="margin-left: 10px">
                        <el-radio :label='1'>是</el-radio>
                        <el-radio :label='0'>否</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="submissionForm.needdiv == 1 ? 6 : 12">
                    <el-form-item label="是否需要提交分案申请:">
                      <el-radio-group v-model="submissionForm.needdiv" style="margin-left: 10px">
                        <el-radio :label='1'>是</el-radio>
                        <el-radio :label='0'>否</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                  <el-col class="special-width" v-show="submissionForm.needdiv == 1 " :span="6">
                    <el-form-item label="分案申请案号:">
                      <el-select
                        v-model="submissionForm.divcaseList"
                        ref="custSelect"
                        filterable
                        clearable
                        remote
                        multiple
                        reserve-keyword
                        placeholder="请输入关键词"
                        :remote-method="queryCaseAgentNumList"
                        @change="agentNumChange"
                      >
                        <el-option
                          v-for="item in anotherCaseNumList"
                          :key="item.agentNum"
                          :label="item.agentNum"
                          :value="item.agentNum"
                        >
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="要求提交IDS:">
                      <el-radio-group v-model="submissionForm.needIds" style="margin-left: 10px">
                        <el-radio :label='1'>是</el-radio>
                        <el-radio :label='0'>否</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="费减比例:" prop="feeReduce">
                      <el-select v-model="submissionForm.feeReduce" @change="feeReduceChange" filterable clearable placeholder="请选择">
                        <el-option
                          v-for="item in ['0.70',' 0.85']"
                          :key="item"
                          :label="item"
                          :value="item">
                          <!--                  <UserIconAndUserName :user-id="item.userId"></UserIconAndUserName>-->
                        </el-option>
                      </el-select>
<!--                      <el-input type="number" size="small"-->
<!--                                @change="feeReduceChange"-->
<!--                                v-model="submissionForm.feeReduce"></el-input>-->
                    </el-form-item>
                  </el-col>

                </el-row>
                <el-row>
                  <el-col :span="submissionForm.ishk == 1 ? 12 : 24">
                    <el-form-item label="要求提交香港申请:">
                      <el-radio-group v-model="submissionForm.ishk" style="margin-left: 10px">
                        <el-radio :label='1'>是</el-radio>
                        <el-radio :label='0'>否</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                  <el-col class="special-width" v-show="submissionForm.ishk == 1" :span="12">
                    <el-form-item label="香港申请案号:">
                      <el-select
                        v-model="submissionForm.hkRefNoList"
                        ref="custSelect"
                        filterable
                        clearable
                        remote
                        multiple
                        reserve-keyword
                        placeholder="请输入关键词"
                        :remote-method="queryCaseAgentNumList"
                      >
                        <el-option
                          v-for="item in anotherCaseNumList"
                          :key="item.agentNum"
                          :label="item.agentNum"
                          :value="item.agentNum"
                        >
                        </el-option>
                      </el-select>

                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
            </div>
            </div>

            <div v-if="caseType == '欧洲专利国家生效'">
              <div>
                <el-row class="border-top">
                  <el-col :span="6">
                    <el-form-item label="文稿字数:">
                      <el-input type="text" size="small" v-model="submissionForm.wordsNum"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="说明书页数:">
                      <el-input type="text" size="small" v-model="submissionForm.descriptionPages"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="附图幅数:">
                      <el-input type="text" size="small" v-model="submissionForm.appendedDrawings"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="附图页数:">
                      <el-input type="text" size="small" v-model="submissionForm.drawingPages"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row class="">
                  <el-col :span="6">
                    <el-form-item label="权利要求项数:">
                      <el-input type="text" size="small" v-model="submissionForm.claimItems"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="权利要求页数:">
                      <el-input type="text" size="small" v-model="submissionForm.claimPages"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="摘要页数:">
                      <el-input type="text" size="small" v-model="submissionForm.substractPage"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="摘要附图页数:">
                      <el-input type="text" size="small" v-model="submissionForm.substractDrawing"></el-input>
                    </el-form-item>
                  </el-col>

                </el-row>
                <el-row class="">
                  <el-col :span="6">
                    <el-form-item label="摘要附图指定图:">
                      <el-input type="text" size="small" v-model="submissionForm.substractDrwno"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="预审案件:">
                      <el-radio-group v-model="submissionForm.preexamine" style="margin-left: 10px">
                        <el-radio :label='1'>是</el-radio>
                        <el-radio :label='0'>否</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="要求DAS:">
                      <!--              <el-input type="text" size="small" v-model="submissionForm.das"></el-input>-->
                      <el-radio-group v-model="submissionForm.das" style="margin-left: 10px" @change="changeDas">
                        <el-radio :label='1'>是</el-radio>
                        <el-radio :label='0'>否</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="缺委托书:">
                      <!--              <el-input type="text" size="small" v-model="submissionForm.nopower"></el-input>-->
                      <el-radio-group v-model="submissionForm.nopower" style="margin-left: 10px">
                        <el-radio :label='1'>是</el-radio>
                        <el-radio :label='0'>否</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row class="">

                  <el-col :span="12">
                    <el-form-item label="要求优先审查:">
                      <el-radio-group v-model="submissionForm.tqsc" style="margin-left: 10px">
                        <el-radio :label='1'>是</el-radio>
                        <el-radio :label='0'>否</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item>
                      <span slot="label">要求审查高速公路<br>(PPH)</span>
                      <el-radio-group v-model="submissionForm.dopph" style="margin-left: 10px">
                        <el-radio :label='1'>是</el-radio>
                        <el-radio :label='0'>否</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>

                </el-row>

                <div>
                  <el-row>
                    <el-col :span="submissionForm.ishk == 1 ? 6 : 12">
                      <el-form-item label="要求提交香港申请:">
                        <el-radio-group v-model="submissionForm.ishk" style="margin-left: 10px">
                          <el-radio :label='1'>是</el-radio>
                          <el-radio :label='0'>否</el-radio>
                        </el-radio-group>
                      </el-form-item>
                    </el-col>
                    <el-col class="special-width" v-show="submissionForm.ishk == 1" :span="6">
                      <el-form-item label="香港申请案号:">
                        <el-select
                          v-model="submissionForm.hkRefNoList"
                          ref="custSelect"
                          filterable
                          clearable
                          remote
                          multiple
                          reserve-keyword
                          placeholder="请输入关键词"
                          :remote-method="queryCaseAgentNumList"
                        >
                          <el-option
                            v-for="item in anotherCaseNumList"
                            :key="item.agentNum"
                            :label="item.agentNum"
                            :value="item.agentNum"
                          >
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="submissionForm.needdiv == 1 ? 6 : 12">
                      <el-form-item label="是否需要提交分案申请:">
                        <el-radio-group v-model="submissionForm.needdiv" style="margin-left: 10px">
                          <el-radio :label='1'>是</el-radio>
                          <el-radio :label='0'>否</el-radio>
                        </el-radio-group>
                      </el-form-item>
                    </el-col>
                    <el-col class="special-width" v-show="submissionForm.needdiv == 1 " :span="6">
                      <el-form-item label="分案申请案号:">
                        <el-select
                          v-model="submissionForm.divcaseList"
                          ref="custSelect"
                          filterable
                          clearable
                          remote
                          multiple
                          reserve-keyword
                          placeholder="请输入关键词"
                          :remote-method="queryCaseAgentNumList"
                          @change="agentNumChange"
                        >
                          <el-option
                            v-for="item in anotherCaseNumList"
                            :key="item.agentNum"
                            :label="item.agentNum"
                            :value="item.agentNum"
                          >
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="要求新申请同时提实审:">
                        <!--              <el-input type="text" size="small" v-model="submissionForm.tstss"></el-input>-->
                        <el-radio-group v-model="submissionForm.tstss" style="margin-left: 10px">
                          <el-radio :label='1'>是</el-radio>
                          <el-radio :label='0'>否</el-radio>
                        </el-radio-group>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="要求提交IDS:">
                        <el-radio-group v-model="submissionForm.needIds" style="margin-left: 10px">
                          <el-radio :label='1'>是</el-radio>
                          <el-radio :label='0'>否</el-radio>
                        </el-radio-group>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="费减比例:" prop="feeReduce">
                        <el-select v-model="submissionForm.feeReduce" @change="feeReduceChange" filterable clearable placeholder="请选择">
                          <el-option
                            v-for="item in ['0.70',' 0.85']"
                            :key="item"
                            :label="item"
                            :value="item">
                            <!--                  <UserIconAndUserName :user-id="item.userId"></UserIconAndUserName>-->
                          </el-option>
                        </el-select>
<!--                        <el-input type="text" min="1" max="100" size="small"-->
<!--                                  v-model="submissionForm.feeReduce"></el-input>-->
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>

              </div>
            </div>

            <el-row v-if="submissionForm.appFromto == '外-内'">
              <el-col :span="24">
                <el-form-item label="原案语言:" style="border-top: none">
                  <el-radio-group v-model="submissionForm.pctOpenLang" style="margin-left: 10px">
                    <el-radio label='英语' @click.native.prevent="chooseLang('英语')">英语</el-radio>
                    <el-radio label='法语' @click.native.prevent="chooseLang('法语')">法语</el-radio>
                    <el-radio label='德语' @click.native.prevent="chooseLang('德语')">德语</el-radio>
                    <el-radio label='韩语' @click.native.prevent="chooseLang('韩语')">韩语</el-radio>
                    <el-radio label='俄语' @click.native.prevent="chooseLang('俄语')">俄语</el-radio>
                    <el-radio label='日语' @click.native.prevent="chooseLang('日语')">日语</el-radio>
                    <el-radio label='葡语' @click.native.prevent="chooseLang('葡语')">葡语</el-radio>
                    <el-radio label='葡语' @click.native.prevent="chooseLang('西班牙语')">西班牙语</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="是否有向外申请意向:">
                  <el-radio-group v-model="submissionForm.applyExternally" style="margin-left: 10px">
                    <el-radio :label='1'>是</el-radio>
                    <el-radio :label='0'>否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row >
              <el-col :span="24" v-if="patentType == 1296 || patentType == 1297">
                <el-form-item label="一带二申请:">
                  <el-radio-group v-model="submissionForm.twoapp" style="margin-left: 10px">
                    <el-radio :label='1'>是</el-radio>
                    <el-radio :label='0'>否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-form-item>
      </el-row>

      <!--      著录变更-->
      <el-row v-if="reportMatter == '著录项目变更'">
        <el-col :span="24">
          <el-form-item label="著录变更:">
<!--            <el-checkbox :true-label="1" v-model="ZbCheck">-->
              针对(
              <el-input class="claims" style="max-width: 200px;" type="text" v-model="submitData.docTitle"></el-input>
              )通知书(发文序号
              <el-input class="claims" style="max-width: 200px;" type="text" v-model="submitData.documentNo"></el-input>
              )进行著录事项变更

<!--            </el-checkbox>-->

            <SignificantTable type="submit" :typeNameList="typeNameList" :is-view="false" :case-id="curCaseId[0]"
                              :custId="zhubiancustId" :table="zhubianData"></SignificantTable>
          </el-form-item>
        </el-col>

      </el-row>

      <!--      补正-->
      <el-row v-if="reportMatter == '补正' || (reportMatter == '主动修改' && submitData.mdType === '补正')">
        <el-col :span="24">
          <el-form-item label="修改对照页:">
            <div style="display: flex;justify-items: flex-start;align-items: center">
              <div
                style="width: 70%; display: flex;align-items: center">

                <up-load-files fileType="修改对照页" :flielist="xgdzList" :cur-case-id="curCaseId[0]"
                               :task-type="taskType"
                               :item="{typeName: '修改对照页',materialTypeId: 301448 }"
                               @uploadSuccess="uploadSuccess" @removeFile="removeFile"></up-load-files>
                <el-button v-if="changeDoc&&patentType != 1298" size="mini" type="primary"
                           @click="transferDoc(xgdzList)"
                           style="margin-left: 10px">制作
                </el-button>

              </div>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="reportMatter == '补正' || (reportMatter == '主动修改' && submitData.mdType === '补正')">
        <el-col :span="24">
          <el-form-item label="替换页:">
            <div style="display: flex;justify-items: flex-start;align-items: center">
              <div
                style="width: 70%; display: flex;align-items: center">

                <up-load-files fileType="替换页" :flielist="tihuanList" :cur-case-id="curCaseId[0]"
                               :task-type="taskType"
                               :item="{typeName: '替换页',materialTypeId: 301486 }"
                               @uploadSuccess="uploadSuccess" @removeFile="removeFile"></up-load-files>
                <div v-if="changeDoc&&patentType != 1298" style="display: flex;align-items: center">
                  <template>
                    <el-radio v-model="convertFormat" label="xml">xml</el-radio>
                    <el-radio v-model="convertFormat" label="pdf">pdf</el-radio>
                  </template>
                  <el-button
                    v-if="convertFormat === 'xml'"
                    size="mini"
                    type="primary"
                    @click="transferXml(tihuanList)"
                    style="margin-left: 10px">解析
                  </el-button>
                  <el-button v-else size="mini" type="primary"
                            @click="transferDoc(tihuanList)"
                            style="margin-left: 10px">制作
                  </el-button>
                </div>
              </div>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="reportMatter == '补正' || (reportMatter == '主动修改' && submitData.mdType === '补正')">
        <el-col :span="24">
          <el-form-item label="补正原因:">
            <el-checkbox-group v-model="buzhengReason" @change="changeBuzhengReason">
              <el-checkbox v-if="submitData.mdType === '补正'" label="1" :disabled="reasonFirst != '1' && reasonFirst != ''">
                根据专利法实施细则第57条的规定，请求对专利申请主动提出修改。
              </el-checkbox>
              <el-checkbox v-else label="2" :disabled="reasonFirst != '2' && reasonFirst != ''" class="checklabel">
                根据专利法实施细则第50条的规定，针对国家知识产权局于
                <el-date-picker
                  :disabled="reasonFirst != '2' && reasonFirst != ''"
                  style="width: 150px;"
                  v-model="submitData.dispatchDate"
                  type="date"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
                发出的
                <el-input class="claims" style="max-width: 200px;" :disabled="reasonFirst != '2' && reasonFirst != ''"
                          type="text"
                          v-model="submitData.docTitle"></el-input>
                通知书(发文序号
                <el-input class="claims" style="max-width: 200px;" :disabled="reasonFirst != '2' && reasonFirst != ''"
                          type="text"
                          v-model="submitData.documentNo"></el-input>
                )，进行补正。
              </el-checkbox>
            </el-checkbox-group>

          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="reportMatter == '补正' || (reportMatter == '主动修改' && submitData.mdType === '补正')">
        <el-col :span="24">
          <el-form-item label="补正内容:" class="buzheng">
            <div>
              <el-button size="mini" type="primary" @click="addTableList(submitData.bzList, 'bzList' )">添加</el-button>
              <el-button size="mini" type="primary" @click="delTableList(submitData.bzList, 'bzList' )">删除</el-button>
              <el-table
                ref="bzList"
                class="el-table1"
                :data="submitData.bzList"
                style="width: 99.5%;"
                border
              >
                <el-table-column
                  type="selection"
                  width="55">
                </el-table-column>
                <el-table-column
                  label="文件名称"
                >
                  <template slot-scope="scope">
                    <el-select
                      allow-create
                      :clearable='true' placeholder="文件类型"
                      v-model="scope.row.fileName"
                      filterable
                      allow-create
                      @change="(v)=>{changeFileName(v, scope.row)}"
                    >
                      <el-option v-for="item  in fileTypeList" :key="item.fileName"
                                 :label="item.fileName"
                                 :value="item.fileName">
                      </el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column
                  label="文件中的位置"
                >
                  <template slot-scope="scope">
                    <el-input size="mini" v-model="scope.row.position"></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  label="补正前"
                >
                  <template slot-scope="scope">
                    <el-input size="mini" v-model="scope.row.beforeData"></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  label="补正后"
                >
                  <template slot-scope="scope">
                    <el-input size="mini" v-model="scope.row.afterData"></el-input>
                  </template>
                </el-table-column>
                <!--                <el-table-column-->
                <!--                  label="操作"-->
                <!--                >-->
                <!--                  <template slot-scope="scope">-->
                <!--                    <span style="cursor: pointer;color: #409EFF"-->
                <!--                          @click="()=>{submitData.bzList.splice(scope.$index,1)}">删除</span>-->
                <!--                  </template>-->
                <!--                </el-table-column>-->
              </el-table>
            </div>

          </el-form-item>
        </el-col>
      </el-row>

      <!--      意见陈述-->
      <el-row v-if="reportMatter == '意见陈述' || (reportMatter == '主动修改' && submitData.mdType === '意见陈述')">
        <el-col :span="24">
          <el-form-item label="陈述事项:">
            <el-checkbox-group :max="1" v-model="buzhengReason" @change="changeBuzhengReason">
              <el-checkbox v-if="submitData.mdType !== '意见陈述'" label="1" :disabled="reasonFirst != '1' && reasonFirst != ''" class="checklabel">
                针对国家知识产权局于
                <el-date-picker
                  :disabled="reasonFirst != '1' && reasonFirst != ''"
                  style="width: 150px;"
                  v-model="submitData.dispatchDate"
                  type="date"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
                发出的
                <el-input class="claims" style="max-width: 200px;" :disabled="reasonFirst != '1' && reasonFirst != ''"
                          type="text"
                          v-model="submitData.docTitle"></el-input>
                通知书(发文序号
                <el-input class="claims" style="max-width: 200px;" :disabled="reasonFirst != '1' && reasonFirst != ''"
                          type="text"
                          v-model="submitData.documentNo"></el-input>
                )陈述意见。
              </el-checkbox>
              <el-checkbox v-if="submitData.mdType !== '意见陈述'" label="2" :disabled="reasonFirst != '2' && reasonFirst != ''" class="checklabel">
                针对国家知识产权局于
                <el-date-picker
                  :disabled="reasonFirst != '2' && reasonFirst != ''"
                  style="width: 150px;"
                  v-model="submitData.dispatchDate"
                  type="date"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
                发出的
                <el-input class="claims" style="max-width: 200px;" :disabled="reasonFirst != '2' && reasonFirst != ''"
                          type="text"
                          v-model="submitData.docTitle"></el-input>
                通知书(发文序号
                <el-input class="claims" style="max-width: 200px;" :disabled="reasonFirst != '2' && reasonFirst != ''"
                          type="text"
                          v-model="submitData.documentNo"></el-input>
                )补充陈述意见。
              </el-checkbox>
              <el-checkbox v-if="submitData.mdType !== '意见陈述'" label="6" :disabled="reasonFirst != '6' && reasonFirst != ''" class="checklabel">
                针对国家知识产权局于
                <el-date-picker
                  :disabled="reasonFirst != '6' && reasonFirst != ''"
                  style="width: 150px;"
                  v-model="submitData.dispatchDate"
                  type="date"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
                发出的药品专利权期限补偿审查意见通知书(发文序号
                <el-input class="claims" style="max-width: 200px;" :disabled="reasonFirst != '6' && reasonFirst != ''"
                          type="text"
                          v-model="submitData.documentNo"></el-input>
                )陈述意见。
              </el-checkbox>
              <el-checkbox v-if="submitData.mdType === '意见陈述'" label="3" :disabled="reasonFirst != '3' && reasonFirst != ''">
                主动提出修改（根据专利法实施细则第51条第1款、第2款的规定）。
              </el-checkbox>
              <el-checkbox v-if="submitData.mdType !== '意见陈述'" label="4" :disabled="reasonFirst != '4' && reasonFirst != ''">
                公布公告事项。
              </el-checkbox>
              <el-checkbox v-if="submitData.mdType !== '意见陈述'" label="5" :disabled="reasonFirst != '5' && reasonFirst != ''">
                其他事宜。
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="reportMatter == '意见陈述' || (reportMatter == '主动修改' && submitData.mdType === '意见陈述')">
        <el-col :span="24" >
          <el-form-item label="关于补交实验数据的情况:" style="display: flex;align-items: center;" prop="bjlsysjbj">
            <el-checkbox style="margin-bottom: 0px;" :true-label="1" :false-label="0" v-model="submitData.bjlsysjbj">补交了实验数据</el-checkbox>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="reportMatter == '意见陈述' || (reportMatter == '主动修改' && submitData.mdType === '意见陈述')">
        <el-form-item label="意见陈述书附页:" prop="">
          <div style="display: flex;justify-items: flex-start;align-items: center">
            <div
              style="width: 70%; display: flex;align-items: center">

              <up-load-files fileType="意见陈述书附页" :flielist="yjcsfyList" :cur-case-id="curCaseId[0]" :task-type="taskType"
                             :item="{typeName: '意见陈述书附页',materialTypeId: 301460 }"
                             @uploadSuccess="uploadSuccess" @removeFile="removeFile"></up-load-files>
              <el-button v-if="changeDoc&&patentType != 1298" size="mini" type="primary"
                           @click="transferDoc(yjcsfyList)"
                           style="margin-left: 10px">制作
                </el-button>

            </div>
          </div>
        </el-form-item>
      </el-row>
      <el-row v-if="reportMatter == '意见陈述' || (reportMatter == '主动修改' && submitData.mdType === '意见陈述')">
        <el-col :span="24">
          <el-form-item label="修改对照页:">
            <div style="display: flex;justify-items: flex-start;align-items: center">
              <div
                style="width: 70%; display: flex;align-items: center">

                <up-load-files fileType="修改对照页" :flielist="xgdzList" :cur-case-id="curCaseId[0]"
                               :task-type="taskType"
                               :item="{typeName: '修改对照页',materialTypeId: 301448 }"
                               @uploadSuccess="uploadSuccess" @removeFile="removeFile"></up-load-files>
                <el-button v-if="changeDoc&&patentType != 1298" size="mini" type="primary"
                           @click="transferDoc(xgdzList)"
                           style="margin-left: 10px">
                  制作
                </el-button>

              </div>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="reportMatter == '意见陈述' || (reportMatter == '主动修改' && submitData.mdType === '意见陈述')">
        <el-col :span="24">
          <el-form-item label="替换页:">
            <div style="display: flex;justify-items: flex-start;align-items: center">
              <div
                style="width: 70%; display: flex;align-items: center">

                <up-load-files fileType="替换页" :flielist="tihuanList" :cur-case-id="curCaseId[0]"
                               :task-type="taskType"
                               :item="{typeName: '替换页',materialTypeId: 301486 }"
                               @uploadSuccess="uploadSuccess" @removeFile="removeFile"></up-load-files>
                <div v-if="changeDoc&&patentType != 1298" style="display: flex;align-items: center">
                  <template>
                    <el-radio v-model="convertFormat" label="xml">xml</el-radio>
                    <el-radio v-model="convertFormat" label="pdf">pdf</el-radio>
                  </template>
                  <el-button
                    v-if="convertFormat === 'xml'"
                    size="mini"
                    type="primary"
                    @click="transferXml(tihuanList)"
                    style="margin-left: 10px">解析
                  </el-button>
                  <el-button v-else size="mini" type="primary"
                            @click="transferDoc(tihuanList)"
                            style="margin-left: 10px">制作
                  </el-button>
                </div>
              </div>
            </div>
          </el-form-item>
        </el-col>
      </el-row>

      <!--      延长期限 、 复审延长期限-->
      <el-row v-if="reportMatter == '复审延长期限'">
        <el-col :span="24">
          <el-form-item label="请求内容:">
            <el-checkbox-group v-model="buzhengReason" @change="changeBuzhengReason">
              <el-checkbox label="1" :disabled="reasonFirst != '1' && reasonFirst != ''" class="">
                根据专利法实施细则第6条第4款的规定，请求延长国家知识产权局于
                <el-date-picker
                  :disabled="reasonFirst != '1' && reasonFirst != ''"
                  style="width: 150px;"
                  v-model="submitData.dispatchDate"
                  type="date"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
                发出的
                <el-input class="claims" style="max-width: 200px;" :disabled="reasonFirst != '1' && reasonFirst != ''"
                          type="text"
                          v-model="submitData.docTitle"></el-input>
                通知书(发文序号
                <el-input class="claims" style="max-width: 200px;" :disabled="reasonFirst != '1' && reasonFirst != ''"
                          type="text"
                          v-model="submitData.documentNo"></el-input>
                )中指定的期限。
              </el-checkbox>
              <el-checkbox label="2" :disabled="reasonFirst != '2' && reasonFirst != ''">
                根据专利法实施细则第106条第3款的规定，请求延长上述专利申请或者专利的中止程序。
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="reportMatter == '延长期限'">
        <el-col :span="24">
          <el-form-item label="请求内容:">
            <el-checkbox-group v-model="buzhengReason" @change="changeBuzhengReason">
              <el-checkbox label="1" :disabled="reasonFirst != '1' && reasonFirst != ''" class="">
                根据专利法实施细则第6条第4款的规定，请求延长国家知识产权局于
                <el-date-picker
                    :disabled="reasonFirst != '1' && reasonFirst != ''"
                    style="width: 150px;"
                    v-model="submitData.dispatchDate"
                    type="date"
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd">
                </el-date-picker>
                发出的
                <el-input class="claims" style="max-width: 200px;" :disabled="reasonFirst != '1' && reasonFirst != ''"
                          type="text"
                          v-model="submitData.docTitle"></el-input>
                通知书(发文序号
                <el-input class="claims" style="max-width: 200px;" :disabled="reasonFirst != '1' && reasonFirst != ''"
                          type="text"
                          v-model="submitData.documentNo"></el-input>
                )中指定的期限。
              </el-checkbox>
              <el-checkbox label="2" :disabled="reasonFirst != '2' && reasonFirst != ''">
                根据专利法实施细则第103条第3款的规定，请求延长上述专利申请或者专利的中止程序。
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="reportMatter == '延长期限'">
        <el-col :span="8" class="full-height">
          <el-form-item label="请求延长期限:">
            <el-date-picker
              style="width: 150px;"
              v-model="submitData.ycqx"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd">
            </el-date-picker>
            发文的第
            <el-input class="claims" style="max-width: 50px;" type="text"
                      v-model="submitData.ntNumber"></el-input>
            次审查意见通知书/补正通知书
          </el-form-item>
        </el-col>
        <el-col :span="8" class="full-height">
          <el-form-item label="期限截止日期:">
            <el-date-picker
              style="width: 150px;"
              v-model="submitData.deadline"
              @change="(v)=>{ $set(submitData, 'ycqxEnd', AddMouth(v, submitData.yctime))}"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8" class="full-height">
          <el-form-item label="请求延长的时间:">
            延长
            <el-input class="claims" style="max-width: 50px;" type="text" v-model="submitData.yctime"
                      @change="(v)=>{ $set(submitData, 'ycqxEnd', AddMouth(submitData.deadline, v))}"></el-input>
            个月<br/>
            ({{submitData.deadline}}-{{submitData.ycqxEnd}})
          </el-form-item>
        </el-col>
      </el-row>

      <!--      无效请求-->
      <el-row v-if="reportMatter == '无效请求'">
        <el-col :span="24">
          <el-form-item label="意见陈述书附页:">
            <div style="display: flex;justify-items: flex-start;align-items: center">
              <div
                style="width: 70%; display: flex;align-items: center">

                <up-load-files fileType="意见陈述书附页" :flielist="yjcsfyList" :cur-case-id="curCaseId[0]"
                               :task-type="taskType"
                               :item="{typeName: '意见陈述书附页',materialTypeId: 301460 }"
                               @uploadSuccess="uploadSuccess" @removeFile="removeFile"></up-load-files>
                <el-button v-if="changeDoc&&patentType != 1298" size="mini" type="primary"
                           @click="transferDoc(yjcsfyList)"
                           style="margin-left: 10px">制作
                </el-button>

              </div>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="reportMatter == '无效请求'">
        <el-col :span="24">
          <el-form-item label=" ">
            <el-checkbox style="padding-top: 10px" :true-label="1" v-model="submitData.wxpriory">
              <div>涉案专利为中国上市药品专利信息登记平台上登记的专利权，无效宣告请求人为相应药品的仿制药申请人，且已经提出第四类声明</div>
            </el-checkbox>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="reportMatter == '无效请求'">
        <el-col :span="24">
          <el-form-item label="无效宣告请求的理由、范围及所依据的证据:" class="buzheng">
            <el-button size="mini" type="primary" @click="addTableList(submitData.wxyjList, 'wxyjList')">添加</el-button>
            <el-button size="mini" type="primary" @click="delTableList(submitData.wxyjList, 'wxyjList' )">删除</el-button>
            <el-table
              ref="wxyjList"
              class="el-table1"
              :data="submitData.wxyjList"
              style="width: 99.5%;"
              border
            >
              <el-table-column
                type="selection"
                width="55">
              </el-table-column>
              <el-table-column
                label="理由"
              >
                <template slot-scope="scope">
                  专利法第
                  <el-input class="claims" style="max-width: 50px;" size="mini" v-model="scope.row.wxliyou"></el-input>
                  条 第
                  <el-input class="claims" style="max-width: 50px;" size="mini" v-model="scope.row.wxliyou2"></el-input>
                  款<br/> 实施细则第
                  <el-input class="claims" style="max-width: 50px;" size="mini" v-model="scope.row.wxliyou3"></el-input>
                  条 第
                  <el-input class="claims" style="max-width: 50px;" size="mini" v-model="scope.row.wxliyou4"></el-input>
                  款
                </template>

              </el-table-column>
              <el-table-column
                label="范围"
              >
                <template slot-scope="scope">
                  <el-input size="mini" v-model="scope.row.wxfanwei"></el-input>
                </template>

              </el-table-column>
              <el-table-column
                label="依据的证据"
              >
                <template slot-scope="scope">
                  <el-input size="mini" v-model="scope.row.wxyiju"></el-input>
                </template>

              </el-table-column>
            </el-table>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="reportMatter == '无效请求'">
        <el-col :span="24">
          <el-form-item label="证据清单:" class="buzheng">
            <el-button size="mini" type="primary" @click="addTableList(submitData.wxzjList, 'wxzjList')">添加</el-button>
            <el-button size="mini" type="primary" @click="delTableList(submitData.wxzjList, 'wxzjList' )">删除</el-button>
            <el-table
              class="el-table1"
              ref="wxzjList"
              :data="submitData.wxzjList"
              style="width: 99.5%;"
              border
            >
              <el-table-column
                type="selection"
                width="55">
              </el-table-column>
              <el-table-column
                label="序号"
              >
                <template slot-scope="scope">
                  {{scope.row.no}}
                </template>

              </el-table-column>
              <el-table-column
                label="附件"
              >
                <template slot-scope="scope">
                  <div>
                    <el-upload class="upload-demo"
                               ref="uploadFile"
                               :multiple="false"
                               :data="fujianData"
                               :action="creatematerialUrl"
                               name="attachFile"
                               :auto-upload="true"
                               :on-success="(res, file, fileLists)=>{fujianCallback(res, file, fileLists, scope.row);$forceUpdate()}"
                               :show-file-list="false"
                    >
                      <div class="el-upload__text">
                        <el-button style="float: left" type="primary" size="mini">上传</el-button>
                      </div>
                    </el-upload>
                    <p>
                      <span style="color: #409EFF;cursor: pointer" @click="preView({address: scope.row.address})">{{ scope.row.materialName}}</span>
                    </p>
                  </div>
                </template>

              </el-table-column>
              <el-table-column
                label="数量"
              >
                <template slot-scope="scope">
                  <el-input class="claims" style="max-width: 50px;" size="mini" v-model="scope.row.fenNum"></el-input>
                  份，每份
                  <el-input class="claims" style="max-width: 50px;" size="mini" v-model="scope.row.pageNum"></el-input>
                  页
                </template>

              </el-table-column>
            </el-table>
          </el-form-item>
        </el-col>
      </el-row>

      <!--      DAS请求-->
      <el-row v-if="reportMatter == 'DAS请求'">
        <el-col :span="24">
          <el-form-item label="请求类型:">
            <el-checkbox-group v-model="buzhengReason" @change="changeBuzhengReason">
              <el-checkbox label="1" :disabled="reasonFirst != '1' && reasonFirst != ''">
                交存请求
              </el-checkbox>
              <el-checkbox label="2" :disabled="reasonFirst != '2' && reasonFirst != ''">
                查询请求
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
      </el-row>

      <!--      意见陈述(退费)-->
      <el-row v-if="reportMatter == '意见陈述（退费）'">
        <el-col :span="24">
          <el-form-item label="陈述事项:">
            <div>
              <!--              <el-checkbox-group v-model="buzhengReason" @change="changeBuzhengReason">-->
              <el-checkbox :true-label="1" v-model="buzhengReasonNum" :disabled="reasonFirst != '1' && reasonFirst != ''"
                           class="full-label">
                <div
                  style="width: 100%; display: flex;justify-content: flex-start;align-items: center;padding: 10px 100px 10px 0">
                  <span style="flex: 2">退款请求</span>
                </div>
              </el-checkbox>
              <div v-show="reasonFirst == '1'"
                   style="width: 90%; margin: 0px 40px 10px 0; min-height: 100px;border: 1px solid #ebeef5;padding-left: 30px">
                <!--                  <el-checkbox-group v-model="tuiTypeList" @change="changeTuifei">-->
                <el-checkbox :true-label="1" v-model="tuiType" :disabled="tuiType == 2">
                  <span>根据专利法实施细则第94条第4款的规定请求退款</span>
                </el-checkbox>
                <div style="padding: 0 20px 0px 20px" class="buzheng">
                  <el-button v-if="tuiType == 1" size="mini" type="primary"
                             @click="addTableList(submitData.tuifeeList, 'tuifeeList')">添加
                  </el-button>
                  <el-button v-if="tuiType == 1" size="mini" type="primary"
                             @click="delTableList(submitData.tuifeeList, 'tuifeeList' )">
                    删除
                  </el-button>
                  <el-table v-if="tuiType == 1" :key="submitData.tuifeeList&&submitData.tuifeeList.length"
                            ref="tuifeeList" class="el-table1" :data="submitData.tuifeeList" border>
                    <el-table-column
                      type="selection"
                      width="55">
                    </el-table-column>
                    <el-table-column label="费用种类">
                      <template slot-scope="scope">
                        <el-select
                          :clearable='true' placeholder="费用种类"
                          v-model="scope.row.feekind"
                          filterable
                          allow-create
                        >
                          <el-option v-for="item  in feeTypeList" :key="item.chargeItemId"
                                     :label="item.nameCn"
                                     :value="item.chargeItemId">
                          </el-option>
                        </el-select>
<!--                        <el-input :disabled="tuiType == 2" size="mini"-->
<!--                                  v-model="scope.row.feekind"></el-input>-->
                      </template>
                    </el-table-column>
                    <el-table-column label="金额">
                      <template slot-scope="scope">
                        <el-input :disabled="tuiType == 2" size="mini"
                                  v-model="scope.row.amount"></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column label="票据号码">
                      <template slot-scope="scope">
                        <el-input :disabled="tuiType == 2" size="mini"
                                  v-model="scope.row.pjcode"></el-input>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
                <el-checkbox :true-label="2" v-model="tuiType" :disabled="tuiType == 1">
                  <span>根据《财税【2018】37号》通知请求退50%实审费</span>
                </el-checkbox>
                <div v-if="tuiType == 2" style="width: 100%; display: flex;margin-left: 20px">
                  <div style="font-size: 14px">票据号码:</div>
                  <el-input style="flex: 1;max-width: 300px" class="claims"
                            size="mini" v-model="submitData.tuifeeList[0]&&submitData.tuifeeList[0].pjcode"></el-input>
                </div>

                <!--                  </el-checkbox-group>-->
              </div>

              <el-checkbox :true-label="2" v-model="buzhengReasonNum" :disabled="reasonFirst != '2' && reasonFirst != ''">
                请求转换费用种类
              </el-checkbox>
              <el-checkbox :true-label="3" v-model="buzhengReasonNum" :disabled="reasonFirst != '3' && reasonFirst != ''">
                缴纳专利费用连个月后尚未收到国家知识产权局开出的费用收据
              </el-checkbox>
              <el-checkbox :true-label="4" v-model="buzhengReasonNum" :disabled="reasonFirst != '4' && reasonFirst != ''"
                           class="checklabel">
                针对国家知识产权局于
                <el-date-picker
                  :disabled="reasonFirst != '4' && reasonFirst != ''"
                  style="width: 150px;"
                  v-model="submitData.dispatchDate"
                  type="date"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
                发出的
                <el-input class="claims" style="max-width: 200px;" :disabled="reasonFirst != '4' && reasonFirst != ''"
                          type="text"
                          v-model="submitData.docTitle"></el-input>
                通知书(发文序号
                <el-input class="claims" style="max-width: 200px;" :disabled="reasonFirst != '4' && reasonFirst != ''"
                          type="text"
                          v-model="submitData.documentNo"></el-input>
                )陈述意见。
              </el-checkbox>

              <!--              </el-checkbox-group>-->
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="reportMatter == '意见陈述（退费）'">
        <el-col :span="24">
          <el-form-item label="意见陈述书附页:">
            <div style="display: flex;justify-items: flex-start;align-items: center">
              <div
                style="width: 70%; display: flex;align-items: center">
                <up-load-files fileType="意见陈述书附页" :flielist="yjcsfyList" :cur-case-id="curCaseId[0]"
                               :task-type="taskType"
                               :item="{typeName: '意见陈述书附页',materialTypeId: 301460 }"
                               @uploadSuccess="uploadSuccess" @removeFile="removeFile"></up-load-files>
                <el-button v-if="changeDoc&&patentType != 1298" size="mini" type="primary"
                           @click="transferDoc(yjcsfyList)"
                           style="margin-left: 10px">制作
                </el-button>

              </div>
            </div>
          </el-form-item>
        </el-col>
      </el-row>

      <!--      复审请求-->
      <el-row v-if="reportMatter == '复审请求'">
        <el-col :span="24">
          <el-form-item label="意见陈述书附页:">
            <div style="display: flex;justify-items: flex-start;align-items: center">
              <div
                style="width: 70%; display: flex;align-items: center">
                <up-load-files fileType="意见陈述书附页" :flielist="yjcsfyList" :cur-case-id="curCaseId[0]"
                               :task-type="taskType"
                               :item="{typeName: '意见陈述书附页',materialTypeId: 301460 }"
                               @uploadSuccess="uploadSuccess" @removeFile="removeFile"></up-load-files>
                <el-button v-if="changeDoc&&patentType != 1298" size="mini" type="primary"
                           @click="transferDoc(yjcsfyList)"
                           style="margin-left: 10px">制作
                </el-button>

              </div>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="reportMatter == '复审请求'">
        <el-col :span="24">
          <el-form-item label="修改对照页:">
            <div style="display: flex;justify-items: flex-start;align-items: center">
              <div
                style="width: 70%; display: flex;align-items: center">

                <up-load-files fileType="修改对照页" :flielist="xgdzList" :cur-case-id="curCaseId[0]"
                               :task-type="taskType"
                               :item="{typeName: '修改对照页',materialTypeId: 301448 }"
                               @uploadSuccess="uploadSuccess" @removeFile="removeFile"></up-load-files>
                <el-button v-if="changeDoc&&patentType != 1298" size="mini" type="primary"
                           @click="transferDoc(xgdzList)"
                           style="margin-left: 10px">
                  制作
                </el-button>

              </div>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-show="reportMatter == '复审请求'">
        <el-col :span="24">
          <el-form-item label="替换页:">
            <div style="display: flex;justify-items: flex-start;align-items: center">
              <div
                style="width: 70%; display: flex;align-items: center">

                <up-load-files fileType="替换页" :flielist="tihuanList" :cur-case-id="curCaseId[0]"
                               :task-type="taskType"
                               :item="{typeName: '替换页',materialTypeId: 301486 }"
                               @uploadSuccess="uploadSuccess" @removeFile="removeFile"></up-load-files>
                <div v-if="changeDoc&&patentType != 1298" style="display: flex;align-items: center">
                  <template>
                    <el-radio v-model="convertFormat" label="xml">xml</el-radio>
                    <el-radio v-model="convertFormat" label="pdf">pdf</el-radio>
                  </template>
                  <el-button
                    v-if="convertFormat === 'xml'"
                    size="mini"
                    type="primary"
                    @click="transferXml(tihuanList)"
                    style="margin-left: 10px">解析
                  </el-button>
                  <el-button v-else size="mini" type="primary"
                            @click="transferDoc(tihuanList)"
                            style="margin-left: 10px">制作
                  </el-button>
                </div>
              </div>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="reportMatter == '复审请求'">
        <el-col :span="24">
          <el-form-item label="驳回决定:">
            根据专利法第41条第1款及专利法实施细则第65条第1款的规定，对国家知识产权局与
            <el-date-picker
              style="width: 150px;"
              v-model="submitData.dispatchDate"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd">
            </el-date-picker>
            发出的对上述专利申请的驳回决定不服，请求复审。
          </el-form-item>
        </el-col>
      </el-row>

      <!--      复审无效补正-->
      <el-row v-if="reportMatter == '复审无效补正'">
        <el-form-item label="意见陈述书附页:" prop="">
          <div style="display: flex;justify-items: flex-start;align-items: center">
            <div
              style="width: 70%; display: flex;align-items: center">

              <up-load-files fileType="意见陈述书附页" :flielist="yjcsfyList" :cur-case-id="curCaseId[0]" :task-type="taskType"
                             :item="{typeName: '意见陈述书附页',materialTypeId: 301460 }"
                             @uploadSuccess="uploadSuccess" @removeFile="removeFile"></up-load-files>
              <el-button v-if="changeDoc&&patentType != 1298" size="mini" type="primary"
                           @click="transferDoc(yjcsfyList)"
                           style="margin-left: 10px">制作
                </el-button>

            </div>
          </div>
        </el-form-item>
      </el-row>
      <el-row v-if="reportMatter == '复审无效补正'">
        <el-col :span="24">
          <el-form-item label="修改对照页:">
            <div style="display: flex;justify-items: flex-start;align-items: center">
              <div
                style="width: 70%; display: flex;align-items: center">

                <up-load-files fileType="修改对照页" :flielist="xgdzList" :cur-case-id="curCaseId[0]"
                               :task-type="taskType"
                               :item="{typeName: '修改对照页',materialTypeId: 301448 }"
                               @uploadSuccess="uploadSuccess" @removeFile="removeFile"></up-load-files>
                <el-button v-if="changeDoc&&patentType != 1298" size="mini" type="primary"
                           @click="transferDoc(xgdzList)"
                           style="margin-left: 10px">
                  制作
                </el-button>

              </div>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-show="reportMatter == '复审无效补正'">
        <el-col :span="24">
          <el-form-item label="替换页:">
            <div style="display: flex;justify-items: flex-start;align-items: center">
              <div
                style="width: 70%; display: flex;align-items: center">

                <up-load-files fileType="替换页" :flielist="tihuanList" :cur-case-id="curCaseId[0]"
                               :task-type="taskType"
                               :item="{typeName: '替换页',materialTypeId: 301486 }"
                               @uploadSuccess="uploadSuccess" @removeFile="removeFile"></up-load-files>
                <div v-if="changeDoc&&patentType != 1298" style="display: flex;align-items: center">
                  <template>
                    <el-radio v-model="convertFormat" label="xml">xml</el-radio>
                    <el-radio v-model="convertFormat" label="pdf">pdf</el-radio>
                  </template>
                  <el-button
                    v-if="convertFormat === 'xml'"
                    size="mini"
                    type="primary"
                    @click="transferXml(tihuanList)"
                    style="margin-left: 10px">解析
                  </el-button>
                  <el-button v-else size="mini" type="primary"
                            @click="transferDoc(tihuanList)"
                            style="margin-left: 10px">制作
                  </el-button>
                </div>

              </div>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="reportMatter == '复审无效补正'">
        <el-col :span="24">
          <el-form-item label="补正人:">
            <el-radio-group v-model="submitData.bzperson">
              <el-radio :label="1">复审请求人</el-radio>
              <el-radio :label="2">专利权人</el-radio>
              <el-radio :label="3">无效宣告请求人</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="reportMatter == '复审无效补正'">
        <el-col :span="24">
          <el-form-item label="补正原因:">
            <el-checkbox-group v-model="buzhengReason" @change="changeBuzhengReason">
              <el-checkbox label="1" :disabled="reasonFirst != '1' && reasonFirst != ''">
                根据专利法实施细则第65条第3款的规定。
              </el-checkbox>
              <el-checkbox label="2" :disabled="reasonFirst != '2' && reasonFirst != ''">
                根据专利法实施细则第70条第4款的规定。
              </el-checkbox>
              <el-checkbox label="3" :disabled="reasonFirst != '3' && reasonFirst != ''" class="checklabel">
                针对
                <el-date-picker
                  :disabled="reasonFirst != '3' && reasonFirst != ''"
                  style="width: 150px;"
                  v-model="submitData.dispatchDate"
                  type="date"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
                专利复审委员会发出的
                <el-input class="claims" style="max-width: 200px;" :disabled="reasonFirst != '3' && reasonFirst != ''"
                          type="text"
                          v-model="submitData.docTitle"></el-input>
                通知书(发文序号
                <el-input class="claims" style="max-width: 200px;" :disabled="reasonFirst != '3' && reasonFirst != ''"
                          type="text"
                          v-model="submitData.documentNo"></el-input>
                )进行补正。
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="reportMatter == '复审无效补正'">
        <el-col :span="24">
          <el-form-item label="补正内容:" class="buzheng">
            <div>
              <el-button size="mini" type="primary" @click="addTableList(submitData.bzList, 'bzList' )">添加</el-button>
              <el-button size="mini" type="primary" @click="delTableList(submitData.bzList, 'bzList' )">删除</el-button>
              <el-table
                class="el-table1"
                ref="bzList"
                :data="submitData.bzList"
                style="width: 99.5%;"
                border
              >
                <el-table-column
                  type="selection"
                  width="55">
                </el-table-column>
                <el-table-column
                  label="文件名称"
                >
                  <template slot-scope="scope">
                    <el-select
                      allow-create
                      :clearable='true' placeholder="文件类型"
                      v-model="scope.row.fileName"
                      filterable
                      allow-create
                      @change="(v)=>{changeFileName(v, scope.row)}"
                    >
                      <el-option v-for="item  in fileTypeList" :key="item.fileName"
                                 :label="item.fileName"
                                 :value="item.fileName">
                      </el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column
                  label="文件中的位置"
                >
                  <template slot-scope="scope">
                    <el-input size="mini" v-model="scope.row.position"></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  label="补正前"
                >
                  <template slot-scope="scope">
                    <el-input size="mini" v-model="scope.row.beforeData"></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  label="补正后"
                >
                  <template slot-scope="scope">
                    <el-input size="mini" v-model="scope.row.afterData"></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  label="操作"
                >
                  <template slot-scope="scope">
                    <span style="cursor: pointer;color: #409EFF"
                          @click="()=>{submitData.bzList.splice(scope.$index,1)}">删除</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>

          </el-form-item>
        </el-col>
      </el-row>

      <!--      复审无效意见陈述-->
      <el-row v-if="reportMatter == '复审无效意见陈述' || opinionStateList.includes(reportMatter)">
        <el-form-item label="意见陈述书附页:" prop="">
          <div style="display: flex;justify-items: flex-start;align-items: center">
            <div
              style="width: 70%; display: flex;align-items: center">

              <up-load-files fileType="意见陈述书附页" :flielist="yjcsfyList" :cur-case-id="curCaseId[0]" :task-type="taskType"
                             :item="{typeName: '意见陈述书附页',materialTypeId: 301460 }"
                             @uploadSuccess="uploadSuccess" @removeFile="removeFile"></up-load-files>
              <el-button v-if="changeDoc&&patentType != 1298" size="mini" type="primary"
                           @click="transferDoc(yjcsfyList)"
                           style="margin-left: 10px">制作
                </el-button>

            </div>
          </div>
        </el-form-item>
      </el-row>
      <el-row v-if="reportMatter == '复审无效意见陈述' || opinionStateList.includes(reportMatter)">
        <el-col :span="24">
          <el-form-item label="修改对照页:">
            <div style="display: flex;justify-items: flex-start;align-items: center">
              <div
                style="width: 70%; display: flex;align-items: center">

                <up-load-files fileType="修改对照页" :flielist="xgdzList" :cur-case-id="curCaseId[0]"
                               :task-type="taskType"
                               :item="{typeName: '修改对照页',materialTypeId: 301448 }"
                               @uploadSuccess="uploadSuccess" @removeFile="removeFile"></up-load-files>
                <el-button v-if="changeDoc&&patentType != 1298" size="mini" type="primary"
                           @click="transferDoc(xgdzList)"
                           style="margin-left: 10px">
                  制作
                </el-button>

              </div>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-show="reportMatter == '复审无效意见陈述' || opinionStateList.includes(reportMatter)">
        <el-col :span="24">
          <el-form-item label="替换页:">
            <div style="display: flex;justify-items: flex-start;align-items: center">
              <div
                style="width: 70%; display: flex;align-items: center">

                <up-load-files fileType="替换页" :flielist="tihuanList" :cur-case-id="curCaseId[0]"
                               :task-type="taskType"
                               :item="{typeName: '替换页',materialTypeId: 301486 }"
                               @uploadSuccess="uploadSuccess" @removeFile="removeFile"></up-load-files>
                <div v-if="changeDoc&&patentType != 1298" style="display: flex;align-items: center">
                  <template>
                    <el-radio v-model="convertFormat" label="xml">xml</el-radio>
                    <el-radio v-model="convertFormat" label="pdf">pdf</el-radio>
                  </template>
                  <el-button
                    v-if="convertFormat === 'xml'"
                    size="mini"
                    type="primary"
                    @click="transferXml(tihuanList)"
                    style="margin-left: 10px">解析
                  </el-button>
                  <el-button v-else size="mini" type="primary"
                            @click="transferDoc(tihuanList)"
                            style="margin-left: 10px">制作
                  </el-button>
                </div>

              </div>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="reportMatter == '复审无效意见陈述' || opinionStateList.includes(reportMatter)">
        <el-col :span="24">
          <el-form-item label="意见陈述人:">
            <el-radio-group v-model="submitData.bzperson">
              <el-radio :label="1">复审请求人</el-radio>
              <el-radio :label="2">专利权人</el-radio>
              <el-radio :label="3">无效宣告请求人</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="reportMatter == '复审无效意见陈述' || opinionStateList.includes(reportMatter)">
        <el-col :span="24">
          <el-form-item label="陈述事项:">
            <el-checkbox-group v-model="buzhengReason" @change="changeBuzhengReason">
              <el-checkbox label="1" class="checklabel">
                针对国家知识产权局于
                <el-date-picker
                  style="width: 150px;"
                  v-model="submitData.dispatchDate"
                  type="date"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
                发出的上述专利申请/专利权的
                <el-input class="claims" style="max-width: 200px;"
                          type="text"
                          v-model="submitData.docTitle"></el-input>
                通知书(发文序号
                <el-input class="claims" style="max-width: 200px;"
                          type="text"
                          v-model="submitData.documentNo"></el-input>
                )陈述意见。
              </el-checkbox>
              <el-checkbox label="2">
                针对
                <el-date-picker
                  style="width: 150px;"
                  v-model="submitData.fswxDate"
                  type="date"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
                提出的复审或无效宣告请求补充意见。
              </el-checkbox>
              <el-checkbox label="3">
                提交联系人地址变更
              </el-checkbox>
              <el-checkbox label="4">
                提交授权委托书
              </el-checkbox>
              <el-checkbox label="5">
                提交口审回执
              </el-checkbox>
              <el-checkbox label="6">
                请求合案审理
              </el-checkbox>
              <el-checkbox label="7">
                撤回复审或无效宣告请求
              </el-checkbox>
              <el-checkbox label="8">
                关于费用
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
      </el-row>


      <!--      提交评价报告-->
      <el-row v-if="reportMatter == '提交评价报告'">
        <el-col :span="24">
          <el-form-item label="专利类型:">
            <el-checkbox :true-label="1" v-model="submitData.paType"
                         :disabled="submitData.paType == 2">实用新型名称
              <el-input class="claims" style="max-width: 200px;" :disabled="submitData.paType == 2"
                        type="text"
                        v-model="submitData.invName"></el-input>
            </el-checkbox>
            <el-checkbox :true-label="2" v-model="submitData.paType"
                         :disabled="submitData.paType == 1">外观设计名称
              <el-input class="claims" style="max-width: 200px;" :disabled="submitData.paType == 1"
                        type="text"
                        v-model="submitData.invName"></el-input>
            </el-checkbox>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="reportMatter == '提交评价报告'">
        <el-col :span="24">
          <el-form-item label="请求人:">
            <el-radio-group v-model="submitData.bzperson">
              <el-radio :label="1">专利权人/申请人</el-radio>
              <el-radio :label="2">利害关系人</el-radio>
              <el-radio :label="3">被控侵权人</el-radio>
            </el-radio-group>
            <div v-if="[2, 3].includes(submitData.bzperson)">
              <span v-if="submitData.bzperson == 2">如果是利害关系人，且专利实施许可合同已在国家知识产权局备案，请注明备案号:</span>
              <span v-if="submitData.bzperson == 3">如果是被控侵权人，且相关证明文件已在国家知识产权局备案，请注明备案号:</span>
              <el-input class="claims" style="max-width: 200px;"
                        type="text"
                        v-model="submitData.caseCode"></el-input>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <!--      <el-row v-if="reportMatter == '提交评价报告'">-->
      <!--        <el-col :span="24">-->
      <!--          <el-form-item label="评价所针对的文本:">-->
      <!--            <el-checkbox-group v-model="buzhengReason" @change="changeBuzhengReason">-->
      <!--              <el-checkbox label="1" :disabled="reasonFirst != '1' && reasonFirst != ''">-->
      <!--                根据专利法实施细则第60条第3款的规定。-->
      <!--              </el-checkbox>-->
      <!--              <el-checkbox label="2" :disabled="reasonFirst != '2' && reasonFirst != ''" class="checklabel">-->
      <!--                由生效的无效宣告请求审查决定维持有效的专利文件，其中涉及第-->
      <!--                <el-input class="claims" style="max-width: 50px;" :disabled="reasonFirst != '2' && reasonFirst != ''"-->
      <!--                          type="text"-->
      <!--                          v-model="submitData.wxNumber"></el-input>-->
      <!--                号无效宣告请求审查决定-->
      <!--              </el-checkbox>-->
      <!--            </el-checkbox-group>-->
      <!--          </el-form-item>-->
      <!--        </el-col>-->
      <!--      </el-row>-->

      <!--      更正错误-->
      <el-row v-if="reportMatter == '更正错误'">
        <el-col :span="24">
          <el-form-item label="更正后的申请文件:">
            <div style="display: flex;justify-items: flex-start;align-items: center">
              <div
                style="width: 70%; display: flex;align-items: center">

                <up-load-files fileType="更正错误" :flielist="gzcwList" :cur-case-id="curCaseId[0]" :task-type="taskType"
                               :item="{typeName: '',materialTypeId: 300449 }"
                               @uploadSuccess="uploadSuccess" @removeFile="removeFile"></up-load-files>

                <el-button v-if="changeDoc&&patentType != 1298" size="mini" type="primary"
                           @click="transferDoc(gzcwList)"
                           style="margin-left: 10px">制作
                </el-button>

              </div>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="reportMatter == '更正错误'">
        <el-col :span="24">
          <el-form-item label="更正内容:" class="buzheng">
            <div>
              <el-button size="mini" type="primary" @click="addTableList(submitData.bzList, 'bzList' )">添加</el-button>
              <el-button size="mini" type="primary" @click="delTableList(submitData.bzList, 'bzList' )">删除</el-button>
              <el-table
                ref="bzList"
                class="el-table1"
                :data="submitData.bzList"
                style="width: 99.5%;"
                border
              >
                <el-table-column
                  type="selection"
                  width="55">
                </el-table-column>
                <el-table-column
                  label="文件名称"
                >
                  <template slot-scope="scope">
                    <el-input size="mini" v-model="scope.row.fileName"></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  label="更正项目"
                >
                  <template slot-scope="scope">
                    <!--                    <el-input size="mini" v-model="scope.row.changeItem"></el-input>-->
                    <el-select
                      :clearable='true'
                      v-model="scope.row.changeItem"
                      filterable
                    >
                      <el-option v-for="item  in changeItemList" :key="item.typeName"
                                 :label="item.typeName"
                                 :value="item.typeName">
                      </el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column
                  label="文件中的位置"
                >
                  <template slot-scope="scope">
                    <el-input size="mini" v-model="scope.row.position"></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  label="补正前"
                >
                  <template slot-scope="scope">
                    <el-input size="mini" v-model="scope.row.beforeData"></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  label="补正后"
                >
                  <template slot-scope="scope">
                    <el-input size="mini" v-model="scope.row.afterData"></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  label="操作"
                >
                  <template slot-scope="scope">
                    <span style="cursor: pointer;color: #409EFF"
                          @click="()=>{submitData.bzList.splice(scope.$index,1)}">删除</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>

          </el-form-item>
        </el-col>
      </el-row>

      <!--      改正译文错误-->
      <el-row v-if="reportMatter == '改正译文错误'">
        <el-col :span="24">
          <el-form-item label="改正后的申请文件:">
            <div style="display: flex;justify-items: flex-start;align-items: center">
              <div
                style="width: 70%; display: flex;align-items: center">

                <up-load-files fileType="改正译文错误" :flielist="gzhList" :cur-case-id="curCaseId[0]" :task-type="taskType"
                               :item="{typeName: '',materialTypeId: 300449 }"
                               @uploadSuccess="uploadSuccess" @removeFile="removeFile"></up-load-files>

                <el-button v-if="changeDoc&&patentType != 1298" size="mini" type="primary" @click="transferDoc(gzhList)"
                           style="margin-left: 10px">制作
                </el-button>

              </div>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="reportMatter == '改正译文错误'">
        <el-col :span="24">
          <el-form-item label="请求内容:">
            <el-checkbox-group v-model="buzhengReason" @change="changeBuzhengReason">
              <el-checkbox label="1" :disabled="reasonFirst != '1' && reasonFirst != ''">
                根据专利法实施细则第133条的规定，请申请文件的中文译文进行修改。
              </el-checkbox>
              <el-checkbox label="2" :disabled="reasonFirst != '2' && reasonFirst != ''" class="checklabel">
                针对国家知识产权局于
                <el-date-picker
                  :disabled="reasonFirst != '2' && reasonFirst != ''"
                  style="width: 150px;"
                  v-model="submitData.dispatchDate"
                  type="date"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
                发出的通知书(发文序号
                <el-input class="claims" style="max-width: 200px;" :disabled="reasonFirst != '2' && reasonFirst != ''"
                          type="text"
                          v-model="submitData.documentNo"></el-input>
                )，进行译文改正。
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="reportMatter == '改正译文错误'">
        <el-col :span="24">
          <el-form-item label="改正内容:" class="buzheng">
            <div>
              <el-button size="mini" type="primary" @click="addTableList(submitData.bzList, 'bzList' )">添加</el-button>
              <el-button size="mini" type="primary" @click="delTableList(submitData.bzList, 'bzList' )">删除</el-button>
              <el-table
                ref="bzList"
                class="el-table1"
                :data="submitData.bzList"
                style="width: 99.5%;"
                border
              >
                <el-table-column
                  type="selection"
                  width="55">
                </el-table-column>
                <el-table-column
                  label="文件名称"
                >
                  <template slot-scope="scope">
                    <el-input size="mini" v-model="scope.row.fileName"></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  label="更正项目"
                >
                  <template slot-scope="scope">
                    <el-input size="mini" v-model="scope.row.changeItem"></el-input>
                    <!--                    <el-select-->
                    <!--                      :clearable='true'-->
                    <!--                      v-model="scope.row.changeItem"-->
                    <!--                      filterable-->
                    <!--                    >-->
                    <!--                      <el-option v-for="item  in changeItemList" :key="item.typeName"-->
                    <!--                                 :label="item.typeName"-->
                    <!--                                 :value="item.typeName">-->
                    <!--                      </el-option>-->
                    <!--                    </el-select>-->
                  </template>
                </el-table-column>
                <el-table-column
                  label="文件中的位置"
                >
                  <template slot-scope="scope">
                    <el-input size="mini" v-model="scope.row.position"></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  label="补正前"
                >
                  <template slot-scope="scope">
                    <el-input size="mini" v-model="scope.row.beforeData"></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  label="补正后"
                >
                  <template slot-scope="scope">
                    <el-input size="mini" v-model="scope.row.afterData"></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  label="操作"
                >
                  <template slot-scope="scope">
                    <span style="cursor: pointer;color: #409EFF"
                          @click="()=>{submitData.bzList.splice(scope.$index,1)}">删除</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>

          </el-form-item>
        </el-col>
      </el-row>

      <!--      放弃声明-->
      <el-row v-if="reportMatter == '放弃声明'">
        <el-col :span="24">
          <el-form-item label="声明内容:">
            <el-checkbox-group v-model="buzhengReason" @change="changeBuzhengReason">
              <el-checkbox label="1" :disabled="reasonFirst != '1' && reasonFirst != ''">
                根据专利法第44条第1款第2项的规定，专利权人声明放弃上述专利权。
              </el-checkbox>
              <el-checkbox label="2" :disabled="reasonFirst != '2' && reasonFirst != ''" class="checklabel">
                根据专利法第9条第1款的规定，专利权人声明放弃上述专利权。
                注：同样的发明创造申请号为
                <el-input class="claims" style="max-width: 200px;" :disabled="reasonFirst != '2' && reasonFirst != ''"
                          type="text"
                          v-model="submitData.appNum"></el-input>
              </el-checkbox>
              <el-checkbox label="3" :disabled="reasonFirst != '3' && reasonFirst != ''" class="checklabel">
                无效宣告程序中，根据专利法第9条第1款的规定，专利权人声明放弃上述专利权。
                注：同样的发明创造申请号为
                <el-input class="claims" style="max-width: 200px;" :disabled="reasonFirst != '3' && reasonFirst != ''"
                          type="text"
                          v-model="submitData.appNum"></el-input>
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
      </el-row>

      <!--   复审恢复权利   -->
      <el-row v-if="reportMatter == '复审恢复权利'">
        <el-col :span="24">
          <el-form-item label="请求内容:">
            <el-checkbox-group :max="1" v-model="buzhengReason" @change="changeBuzhengReason">
              <el-checkbox label="1" :disabled="reasonFirst != '1' && reasonFirst != ''">
                根据专利法实施细则第6条第1款的规定。
              </el-checkbox>
              <el-checkbox label="2" :disabled="reasonFirst != '2' && reasonFirst != ''">
                根据专利法实施细则第6条第2款的规定。
              </el-checkbox>
              <el-checkbox label="3" :disabled="reasonFirst != '3' && reasonFirst != ''" class="checklabel">
                针对国家知识产权局于
                <el-date-picker
                  :disabled="reasonFirst != '1' && reasonFirst != ''"
                  style="width: 150px;"
                  v-model="submitData.dispatchDate"
                  type="date"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
                发出的
                <el-input class="claims" style="max-width: 200px;" :disabled="reasonFirst != '1' && reasonFirst != ''"
                          type="text"
                          v-model="submitData.docTitle"></el-input>
                通知书(发文序号
                <el-input class="claims" style="max-width: 200px;" :disabled="reasonFirst != '1' && reasonFirst != ''"
                          type="text"
                          v-model="submitData.documentNo"></el-input>
                )请求恢复权利。
              </el-checkbox>

            </el-checkbox-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="reportMatter == '复审恢复权利'">
        <el-col :span="24">
          <el-form-item label="请求恢复权利的理由：">
            <el-checkbox-group v-model="buzhengReason" @change="changeBuzhengReason"
                               style="display: flex; justify-content: flex-start">
            </el-checkbox-group>
            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 6}" v-model="submitData.wxchenshu"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <!--      恢复权利-->
      <el-row v-if="reportMatter == '恢复权利'">
        <el-col :span="24">
          <el-form-item label="请求内容:">
            根据专利法第6条，针对
            <el-date-picker
              style="width: 150px;"
              v-model="submitData.dispatchDate"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd">
            </el-date-picker>
            国家知识产权局发出的
            <el-input class="claims" style="max-width: 200px;"
                      type="text"
                      v-model="submitData.docTitle"></el-input>
            （最近一次官方通知的文件名称）通知书（发文序号
            <el-input class="claims" style="max-width: 200px;"
                      type="text"
                      v-model="submitData.documentNo"></el-input>
            ）请求恢复权利。
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="reportMatter == '恢复权利'">
        <el-col :span="24">
          <el-form-item label="请求恢复权利的理由：">
            <el-checkbox-group v-model="buzhengReason" @change="changeBuzhengReason"
                               style="display: flex; justify-content: flex-start">
              <el-checkbox label="1" :disabled="reasonFirst != '1' && reasonFirst != ''" style="margin-bottom: 0">
                正当理由
              </el-checkbox>
              <el-checkbox label="2" :disabled="reasonFirst != '2' && reasonFirst != ''" style="margin-bottom: 0">
                不可抗力
              </el-checkbox>
            </el-checkbox-group>
            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 6}" v-model="submitData.wxchenshu"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="reportMatter == '恢复权利'">
        <el-col :span="24">
          <el-form-item label="已备案的证明文件备案编号:">
            <el-input size="mini" v-model="submitData.caseCode" style="width: 50%;"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <!--      PPH请求-->
      <el-row v-if="reportMatter == 'PPH请求'">
        <el-col :span="24">
          <el-form-item label="请求:">
            申请人请求参与专利审查高速路（PPH）试点项目基于：
            <el-row>
              <el-col :span="23">
                <el-form-item label="在先审查局 (OEE):">
                  <!--                  <el-input size="mini" v-model="submitData.zxscj" style="width: 50%;"></el-input>-->
                  <el-select :clearable='true' placeholder="请选择"
                             v-model="submitData.zxscj"
                             filterable>
                    <el-option v-for="(item,key)  in patentCountryList" :key="key" :label="item.value"
                               :value="item.cityCode">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="23">
                <el-form-item label="OEE工作结果类型:">
                  <el-radio-group v-model="submitData.workType">
                    <el-radio label="1" style="margin-top: 5px;margin-bottom: 5px">国家/地区的审查意见</el-radio>
                    <el-radio label="2" style="margin-top: 5px;margin-bottom: 5px">WO-ISA，WO-IPEA或IPER</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="23" class="buzheng">
                <el-button size="mini" type="primary"
                           @click="addTableList(submitData.patentPphOeeList, 'patentPphOeeList' )">添加
                </el-button>
                <el-button size="mini" type="primary"
                           @click="delTableList(submitData.patentPphOeeList, 'patentPphOeeList' )">删除
                </el-button>
                <el-table
                  ref="patentPphOeeList"
                  class="el-table1"
                  :data="submitData.patentPphOeeList"
                  style="width: 99.5%;margin-top: 0"
                  border
                >
                  <el-table-column
                    type="selection"
                    width="55">
                  </el-table-column>
                  <el-table-column
                    label="OEE申请号"
                  >
                    <template slot-scope="scope">
                      <el-input size="mini" v-model="scope.row.oeeApplicationNum" style="width: 50%;"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="本申请与OEE申请的关系"
                  >
                    <template slot-scope="scope">
                      <el-input size="mini" v-model="scope.row.oeeApplicationRelationship"
                                style="width: 50%;"></el-input>
                    </template>
                  </el-table-column>
                </el-table>

              </el-col>
            </el-row>
            <!--            <el-row>-->
            <!--              <el-col :span="23" style="padding-bottom: 10px">-->
            <!--                <el-form-item label="本申请与OEE申请的关系:">-->
            <!--                  <el-input size="mini" v-model="submitData.relation" style="width: 50%;"></el-input>-->
            <!--                </el-form-item>-->
            <!--              </el-col>-->
            <!--            </el-row>-->
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="reportMatter == 'PPH请求'">
        <el-col :span="24">
          <el-form-item label="文件提交:">
            <el-checkbox-group v-model="tijiaoNoList" @change="changePPHFile" style="font-size: 14px"
                               class="short-label">
              <div>
                第I栏 OEE工作结果及其如需的译文
              </div>
              <el-row>
                <el-col :span="23">
                  <el-form-item label="1">
                    <el-checkbox label="1" style="margin-bottom: 0">
                      提交了OEE工作结果的副本
                    </el-checkbox>
                    <el-checkbox label="2" style="margin-bottom: 0">
                      请求通过案卷访问系统或PATENTSCOPE获取上述文件
                    </el-checkbox>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="23">
                  <el-form-item label="2" style="border-bottom: 1px solid #ebeef5;">
                    <el-checkbox label="3" style="margin-bottom: 0">
                      提交了1之所述文件的译文
                    </el-checkbox>
                    <el-checkbox label="4" style="margin-bottom: 0">
                      请求通过案卷访问系统或PATENTSCOPE获取上述文件
                    </el-checkbox>
                  </el-form-item>
                </el-col>
              </el-row>

              <div>
                第II栏 OEE认定为可授权的所有权利要求的副本及其如需的译文
              </div>
              <el-row>
                <el-col :span="23">
                  <el-form-item label="3">
                    <el-checkbox label="5" style="margin-bottom: 0">
                      提交了OEE认定为可授权的所有权利要求的副本
                    </el-checkbox>
                    <el-checkbox label="6" style="margin-bottom: 0">
                      请求通过案卷访问系统或PATENTSCOPE获取上述文件
                    </el-checkbox>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="23">
                  <el-form-item label="4" style="border-bottom: 1px solid #ebeef5;">
                    <el-checkbox label="7" style="margin-bottom: 0">
                      提交了3之所述文件的译文
                    </el-checkbox>
                    <el-checkbox label="8" style="margin-bottom: 0">
                      请求通过案卷访问系统或PATENTSCOPE获取上述文件
                    </el-checkbox>
                  </el-form-item>
                </el-col>
              </el-row>

              <div>
                第III栏 OEE工作结果引用的文件
              </div>
              <el-row>
                <el-col :span="23">
                  <el-form-item label="5" style="border-bottom: 1px solid #ebeef5;">
                    <el-checkbox label="9" style="margin-bottom: 0">
                      提交了OEE工作结果引用的所有文件的副本（专利文献除外）
                    </el-checkbox>
                    <el-checkbox label="10"
                                 style="margin-bottom: 0">
                      无引用文件
                    </el-checkbox>
                  </el-form-item>
                </el-col>
              </el-row>

              <div>
                第IV栏 已提交文件
              </div>
              <el-row>
                <el-col :span="23">
                  <el-form-item label="6" style="border-bottom: 1px solid #ebeef5;">
                    若上述某些文件已经提交，请予说明：
                    <div>
                      申请人于
                      <el-date-picker
                        style="width: 150px;"
                        v-model="submitData.patenPphWjtj.subDate"
                        type="date"
                        placeholder="选择日期"
                        value-format="yyyy-MM-dd">
                      </el-date-picker>
                      在CN
                      <el-input class="claims" style="max-width: 200px;"
                                type="text"
                                v-model="submitData.patenPphWjtj.tcontent"></el-input>
                      中提交了
                      <el-input class="claims" style="max-width: 200px;"
                                type="text"
                                v-model="submitData.patenPphWjtj.fileName"></el-input>
                      文件
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>

            </el-checkbox-group>

          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="reportMatter == 'PPH请求'">
        <el-col :span="24">
          <el-form-item label="权利要求对应性:">
            <el-checkbox :true-label="1" v-model="submitData.qldyxNo" :disabled="submitData.qldyxNo == 2">
              本申请的所有权利要求与OEE申请中可授权的权利要求充分对应
              本申请的所有权利要求与OEE申请中可授权的权利要求充分对应
            </el-checkbox>
            <el-checkbox :true-label="2" v-model="submitData.qldyxNo" :disabled="submitData.qldyxNo == 1">
              在下表中解释权利要求对应性
            </el-checkbox>
            <div class="buzheng">
              <el-button size="mini" type="primary" @click="addTableList(submitData.pphDyxList, 'pphDyxList' )"
                         :disabled="submitData.qldyxNo == 1">添加
              </el-button>
              <el-button :disabled="submitData.qldyxNo == 1" size="mini" type="primary"
                         @click="delTableList(submitData.pphDyxList, 'pphDyxList' )">删除
              </el-button>
              <el-table
                ref="pphDyxList"
                class="el-table1"
                :data="submitData.pphDyxList"
                style="width: 99.5%;"
                border
              >
                <el-table-column
                  type="selection"
                  width="55">
                </el-table-column>
                <el-table-column
                  label="本申请的权利要求"
                >
                  <template slot-scope="scope">
                    <el-input size="mini" v-model="scope.row.benql" :disabled="submitData.qldyxNo == 1"></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  label="对应的OEE权利要求"
                >
                  <template slot-scope="scope">
                    <el-input size="mini" v-model="scope.row.oeeql" :disabled="submitData.qldyxNo == 1"></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  label="关于对应性的解释"
                >
                  <template slot-scope="scope">
                    <el-input size="mini" v-model="scope.row.jieshi" :disabled="submitData.qldyxNo == 1"></el-input>
                  </template>
                </el-table-column>
                <!--                <el-table-column-->
                <!--                  label="操作"-->
                <!--                >-->
                <!--                  <template slot-scope="scope">-->
                <!--                    <span style="cursor: pointer;color: #409EFF"-->
                <!--                          @click="()=>{submitData.pphDyxList.splice(scope.$index,1)}">删除</span>-->
                <!--                  </template>-->
                <!--                </el-table-column>-->
              </el-table>
            </div>

          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="reportMatter == 'PPH请求'">
        <el-col :span="24">
          <el-form-item label="说明事项:">
            <div>
              1.OEE工作结果的副本名称如下：
              <el-button size="mini" type="primary"
                         @click="addTableList(submitData.patenPphSmsxList, 'patenPphSmsxList' )">添加
              </el-button>

            </div>
            <div class="oee" style="">
              <div v-for="(item, index) in submitData.patenPphSmsxList" :key="index">
                <div class="border-line" style="">
                  OEE申请
                  <el-input size="mini" v-model="item.oeeApplicationNum" class="claims"
                            style="max-width: 200px;"></el-input>
                </div>
                <div>
                  由
                  <el-input size="mini" v-model="item.person" class="claims"
                            style="max-width: 200px;"></el-input>
                  于
                  <el-date-picker
                    style="width: 150px;"
                    v-model="item.smDate"
                    type="date"
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd">
                  </el-date-picker>
                  作出的
                  <el-input size="mini" v-model="item.scontent" class="claims"
                            style="max-width: 200px;"></el-input>
                </div>
              </div>

            </div>


            <div>
              2.OEE工作结果引用的文件副本名称如下：
              <el-button size="mini" type="primary" @click="addTableList(submitData.pphWjfbList, 'pphWjfbList' )">添加
              </el-button>
            </div>
            <div v-for="(item, index) in submitData.pphWjfbList" :key="index" style="padding-left: 20px">
              <span style="display: inline-block; text-align: right;padding-right: 10px">{{index+1}}</span>
              <el-input size="mini" v-model="item.fbName" style="width: 50%;"></el-input>
            </div>

            <div>
              3.特殊项的解释说明：
              <el-button size="mini" type="primary" @click="addTableList(submitData.pphTsxList, 'pphTsxList' )">添加
              </el-button>
            </div>
            <div v-for="(item, index) in submitData.pphTsxList" :key="index" style="padding-left: 20px">
              <span style="display: inline-block; text-align: right;padding-right: 10px">{{index+1}}</span>
              <el-input size="mini" v-model="item.tsxjs" style="width: 50%;"></el-input>
            </div>

          </el-form-item>
        </el-col>
      </el-row>


      <el-row v-if="reportMatter != '著录项目变更' && reportMatter != 'PCT国际新申请'">
        <el-col :span="12">
          <el-form-item label="附加文件:">
            <el-checkbox-group v-model="checkList">
              <el-checkbox v-for="item in typeNameList.filter(i=>i.yongtu == 1)"
                           :key="item.materialTypeId"
                           :label="item.typeName" :value="item.typeName">{{item.typeName}}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="full-height">
          <el-form-item label="CPC生成的文件:">
            <el-checkbox-group v-model="submitData.cpcFileMaterialTypeIdList">
              <el-checkbox v-for="item in typeNameList.filter(i=>i.yongtu == 2)"
                           :key="item.materialTypeId"
                           :label="item.materialTypeId" :value="item.materialTypeId">{{item.typeName}}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="reportMatter != '著录项目变更' && reportMatter != 'PCT国际新申请'">
        <el-col :span="24">
          <el-form-item label="上传文件:" style="border-bottom: 1px solid #ebeef5;">
            <template>
              <div v-for="(item, index) in fileNameList" :key="item.materialTypeId"
                   style="display: flex;align-items: center">

                <up-load-files :flielist="flielist" :cur-case-id="curCaseId[0]" :task-type="taskType" :item="item"
                               @uploadSuccess="uploadSuccess" @removeFile="removeFile"></up-load-files>

              </div>
            </template>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="title" v-if="reportMatter != '著录项目变更' && reportMatter != 'PCT国际新申请'">
          <span>
            递交文件
          </span>
          <div style="display:flex;align-items:center;margin-left: 6px;">
            <el-upload
              class="upload-demo"
              name="attachFile"
              ref="uploadFile"
              :show-file-list="false"
              :data="xmluploadData"
              :action="creatematerialUrl"
              :on-success="xmlSuccessCallback"
              :before-upload="xmlBeforeUpload"
            >
              <el-button type="primary" size='small' :loading="xmlUploadLoading">上传XML压缩包</el-button>
            </el-upload>
          </div>
      </div>
      <div style="width: 100%;" v-if="reportMatter != '著录项目变更' && reportMatter != 'PCT国际新申请'">
        <el-table
          :data="transferDocList"
          border
          style="width: 100%">
          <el-table-column
            label="附件名称"
            width="180">
            <template slot-scope="scope">
              <span style="color: #409EFF;cursor: pointer" @click="preView(scope.row)">{{ getDynamicName(scope.row) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="subject"
            label="文件类型"
            width="180">
          </el-table-column>
          <el-table-column
            prop="typeName"
            label="文件描述">
          </el-table-column>
          <el-table-column
            prop="creater"
            label="上传者">
          </el-table-column>
          <el-table-column
            prop="createDate"
            label="上传时间">
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <span
                v-if="scope.row.contrastMaterial"
                style="color: #409EFF;cursor: pointer"
                @click="comparison(scope.row)">对比</span>
              <span style="color: #409EFF;cursor: pointer" @click="deleteSubFile(scope.row,false)">删除</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <template v-if="[2,5,6].includes(submitData.submitStatus)">
        <div class="title">
          <span>
            核查文件
          </span>
          <div style="display:flex;align-items:center;margin-left: 6px;" v-if="verifyList.length">
            <el-button size="mini" type="primary" @click="mergeFile" style="height:32px">合成副本</el-button>
          </div>
        </div>
        <el-row>
          <el-form-item label="附件:">
            <up-load-files
              :view="submitData.submitStatus !==6"
              fileType="核查附件"
              :flielist="verifyList"
              :cur-case-id="curCaseId[0]"
              :task-type="taskType"
              :item="{ materialTypeId: 301684 }"
              @uploadSuccess="uploadSuccess"
              @removeFile="removeFile"
            >
            </up-load-files>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="审核人:">
            <div style="width:400px; padding-top:4px">
              <VirtualSelect
                filterable
                clearable
                :data="$store.getters.allUserList"
                v-model="submitData.reviewer"
                :disabled="submitData.submitStatus !==6"
              >
              </VirtualSelect>
            </div>
          </el-form-item>
        </el-row>
      </template>
      <template v-if="testReportList.length">
        <div class="title" >
          <span>
            XML检测报告
          </span>
        </div>
        <div style="width: 100%;">
          <el-table
            :data="testReportList"
            border
            :row-style="{height: '40px'}"
            style="width: 100%">
            <el-table-column type="index" width="50" label="序号">

            </el-table-column>
            <el-table-column
              label="详情"
            >
              <template slot-scope="scope">
                <span>
                  字符：<span style="color: red;">{{ scope.row.chat }}</span> |
                  编码：({{ scope.row.codePoint }}) |
                  上下文：<span v-html="highlightContext(scope.row.context, scope.row.chat)"></span>
                </span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </template>
      <el-row v-if="showAgentAgree">
        <el-col :span="24">
          <el-form-item label="代理师同意签署委托书:" style="border-bottom: 1px solid #ebeef5;">
            <el-checkbox style="margin-top: 10px" :true-label="1" v-model="submitData.agentAgree">
              是
            </el-checkbox>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-form v-if="taskType != 4" ref="submission" label-width="206px">
      <el-row>
        <el-form-item label="文件/事件类型:">
          <el-select default-first-option v-model="submitData.materialTypeId" placeholder="请选择" filterable clearable
                     @change="handleChangeTypeName">
            <el-option v-for="item in typeNameList" :key="item.materialTypeId" :label="item.typeName"
                       :value="item.materialTypeId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文件/事件名称:">
          <el-input v-model="submitData.docName" placeholder="请输入内容"></el-input>
        </el-form-item>
      </el-row>

      <el-row>
        <el-form-item label="上传文件:">
          <el-upload class="upload-demo"
                     :before-remove="brforeRemoveFile"
                     drag
                     ref="uploadFile"
                     multiple :data="uploadFileData" :action="creatematerialUrl" name="attachFile"
                     :auto-upload="false"
                     :on-success="successCallback" :before-upload="beforeupload"
                     :on-remove="(file,fileList)=>{ handleRemove(file,fileList,multipleSelection.map(item=>item.caseId))}"
                     :file-list="flielist">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
          </el-upload>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="递交人:">
          <el-select v-model="submitData.inputUserId" placeholder="请选择递交人" filterable
                     clearable>
            <el-option
              v-for="item in queryGetUserList"
              :key="item.userId"
              :label="item.fullname"
              :value="item.userId">
              <UserIconAndUserName :user-id="item.userId"></UserIconAndUserName>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="递交日期:">
          <el-date-picker
            v-model="submitData.inputDate"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="创建人:">
          <el-select v-model="submitData.createUserId" placeholder="请选择创建人" filterable
                     clearable>
            <el-option
              v-for="item in queryGetUserList"
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

    <div class="dialog-footer">
      <el-button @click="cancel()">取 消</el-button>
      <!-- <el-button v-if="submissionType=='edit' && isAuditing" type="primary" @click="audtiClick(1)">通过</el-button> -->
      <el-button v-if="isTaskPerson && submissionType=='edit' && isAuditing && submitStatus === 5" type="primary" @click="handleAudit(0)">退回</el-button>
      <el-button v-if="isTaskPerson && submissionType=='edit' && isAuditing && isAuditFlow && submitStatus === 2" type="primary" @click="handleReject">退回</el-button>
      <el-button v-if="isTaskPerson && submissionType=='edit' && isAuditing && submitStatus !== 2" type="primary" @click="submitOfficalModify('pass')">通过</el-button>
      <!--      <el-button v-if="submissionType=='edit' && isAuditing" type="primary" @click="audtiClick(0)">不通过</el-button>-->
      <el-button v-if="submissionType=='create' && !isAuditing" type="primary" @click="submit(1)">提交</el-button>
      <el-button v-if="isTaskPerson && makeAllowRet && submitStatus === 1 && taskType==4 && !isAuditing" type="primary" @click="handleAudit()">退回</el-button>
      <el-button v-if="isTaskPerson && (submitStatus === 0 || submitStatus === 6) && taskType==4 && !isAuditing" type="primary" @click="submitOfficalModify('reSubmit')">提交</el-button>
      <el-button
        v-if="isTaskPerson && submitStatus == 1 && submissionType=='edit' && !isAuditing && taskType==4 && submitData.submitMode == 'CPC接口'"
        type="primary"
        @click="submitOfficalModify('importCPCFile')"
      >导出到CPC
      </el-button>
      <el-button v-if="submissionType=='edit' && !isAuditing" type="primary" @click="submit(2)">保存</el-button>
    </div>

    <!-- 引用文件对比组件 -->
    <fileComparisonHeight v-if="comparisonHeightVisible" :comparison-files="comparisonFiles" @close="comparisonHeightVisible = false"/>

  </el-dialog>
  <el-dialog
    title="退回"
    :visible.sync="rejectVisible"
    width="800px"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    custom-class="rejectDialog"
  >
    <el-form label-width="100px" ref="rejectForm" :model="rejectInfo">
      <el-row>
        <el-form-item
          label="退回原因:"
          prop="statisticsId"
          :rules="[
            { required: true, message: '请选择退回原因'},
          ]"
        >
          <el-select v-model="rejectInfo.statisticsId" placeholder="请选择退回原因">
            <el-option v-for="item in rejectReasonList" :label="item.typeName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="备注:" prop="patentSubReturnRemarks">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 6}" v-model="rejectInfo.patentSubReturnRemarks"></el-input>
        </el-form-item>
      </el-row>
    </el-form>
    <div class="dialog-footer">
      <el-button @click="rejectVisible=false">取消</el-button>
      <el-button type="primary" @click="confirmReject">确定</el-button>
    </div>
  </el-dialog>
  <el-dialog append-to-body :visible.sync="mergeFileView" title="合成副本" width="80%" :close-on-click-modal="false">
    <drag-pdf-and-view v-if="mergeFileView" :type="submitType" :mergeFileList="mergeFileList" :caseId="curCaseId" @closeMergeDialog="closeMergeDialog"></drag-pdf-and-view>
  </el-dialog>
</div>
</template>

<script>
  import { queryChargeItemList} from '@/api/systemList'
  import {formatAmount, fomatFloat, toFixed1, toFixed2} from '@/utils/filters'
  import {
    queryCPCAddr,
  } from "@/api/applicant";
  import {doEditInOffice, getProgID} from '@/utils/editInOffice.js'
  import {querycustSelectClass, queryShuomingshu} from '@/api/customerList.js'
  import {
    queryMaterialType,
    modifyMaterialType,
    submitOfficalModify,
    submitOffical,
    queryInstruction,
    delCaseMaterial,
    transferDoc,
    transferDocNew,
    submitOfficalAudit,
    importCPCFile,
    queryCase,
    patentReviewUnify
  } from "@/api/caseList";
  import {getUser} from '@/api/user'
  import {
    addCaseEventUrl,
    updateCaseEventUrl,
    deleteCaseEventUrl,
    queryCaseEventDetailUrl,
    delCaseMaterialUrl,
    queryCaseAgentNumList,
    queryCaseInfoForZb,
    queryItemList,
    queryZbrecordList,
    queryBzdefineList,
    queryLastDoc,
    fileMergePdf
  } from "@/api/caseDetail";
  import {creatematerialUrl} from "@/api/serviceApi.config.js";
  import Vue from "vue";
  import {passOrReturn} from "../../../../../api/caseList";
  import SignificantTable from "../../components/SignificantTable";
  import UpLoadFiles from "./upLoadFiles";
  import ElCheckbox from "../../components/Checkbox";
  import fileComparisonHeight from "./fileComparisonHeight";
  import DragPdfAndView from "@/views/workbench/case/components/DragPdfAndView.vue";
import treeVue from '../../../../../components/ag-year-filter/tree.vue';

  export default {
    components: {ElCheckbox, UpLoadFiles, SignificantTable, fileComparisonHeight,DragPdfAndView},
    props: {
      title: {
        type: String,
        default: '递交'
      },
      changeDoc: {
        type: Boolean,
        default: false
      },
      isAuditing: {
        type: Boolean,
        default: false
      },
      curCaseId: {},
      custId: {},
      submissionType: {},
      submissionState: {},
      multipleSelection: {},
      taskType: {
        default: 2
      },
      business: ''
    },
    name: "litigationSubmission",
    computed: {
      submitType() {
        return this.submitData.submitStatus === 5 ? "audit" : "view"
      },
      reportMatter() {
        return this.submitData.reportMatter || ''
      },
      fileNameList() {
        return this.typeNameList.filter(i => this.checkList.includes(i.typeName))
      },
      caseType() {
        return this.submissionForm.caseTypeStr || this.submissionForm.caseType || '普通新申请'
      },
      patentType() {
        return this.submissionForm.patentType
      },
      isAuditFlow(){
        return this.patentType != 1298 && ['普通新申请','PCT国家阶段'].includes(this.submissionForm.caseType)
      },
      makeAllowRet(){
        return this.changeDoc && this.isAuditFlow
      },
      isTaskPerson(){
        return this.submitData.taskPerson
      },
      showAgentAgree() {
        if (!this.multipleSelection || !this.multipleSelection.length) {
          return false
        }
        const caseInfo = this.multipleSelection[0]
        
        // 判断申请来源和案件类型
        if (!['外-内', '内-内', '台-内'].includes(caseInfo.appFromto) || 
            !['普通新申请', 'PCT国家阶段', '海牙国家阶段'].includes(caseInfo.caseTypeStr)) {
          return false
        }
        
        const namedAttorney = caseInfo.namedAttorney
        const namedAttorney2 = caseInfo.namedAttorney2
        const actualAttorney = caseInfo.actualAttorney
        
        // 1、仅有代理人一，代理人二为空，且代理人一=撰稿人
        const condition1 = namedAttorney && !namedAttorney2 && namedAttorney === actualAttorney
        
        // 2、代理人一和代理人二都有值，代理人一=撰稿人或者代理人二=撰稿人
        const condition2 = namedAttorney && namedAttorney2 && (namedAttorney === actualAttorney || namedAttorney2 === actualAttorney)
        
        return condition1 || condition2
      }
    },
    data() {
      var checkfeeReduce = (rule, value, callback) => {
        if (value > 1 || value < 0) {
          callback(new Error('费减比例数据错误'));
        }
      };
      return {
        testReportList: [],
        opinionStateList:['复审无效意见陈述-答受通','复审无效意见陈述-答转文','复审无效意见陈述-口审回执','复审无效意见陈述-代理词','复审无效意见陈述-补充理由'],
        fuchaRadio: '',
        szscRadio: '',
        hasZw: false,
        buzhengReasonNum: 0,
        feeTypeList: [],
        rules: {
          feeReduce: [
            {validator: checkfeeReduce, trigger: 'change'}
          ],
        },
        hasPatentPriority: false,
        backData: {},
        patentCountryList: [],
        changeItemList: [],
        ZbCheck: 0,
        tijiaoNoList: [],
        tijiaoNo: '',
        tuiType: 0,
        fujianData: {
          // custId: this.zhubiancustId,
          materialTypeId: 301464,
          caseIds: this.curCaseId[0],
          tokenID: this.$store.getters.token
        },
        xmluploadData: {
          materialTypeId: 301652,
          caseIds: this.curCaseId[0],
          tokenID: this.$store.getters.token
        },
        xgdzList: [],
        tihuanList: [],
        xgsmList: [],
        yijianList: [],
        yjcsfyList: [],
        fileTypeList: [],
        reasonFirst: '',
        buzhengReason: [],
        zhubiancustId: '',
        zhubianData: {dataList: []},
        // itemList: [],
        // personList: [],
        isZhubian: false,
        isBuzheng: false,
        isChenshu: false,
        transferFileTable: false,
        fileList: [],
        anotherCaseNumList: [],
        gzcwList: [],
        gzhList: [],
        applyList: [],
        creatematerialUrlData: '',
        applyFileId: '',
        applyFileList: [],
        sign: '',
        curcurCaseId: '',
        fileDataList: [],
        materialFileList: [],
        checkList: [],
        submissionForm: {
          divcaseList: [],
          hkRefNoList: []
        },
        reportMatterList: [],
        flielist: [],
        materialIdList: [],
        submitData: {
          csitemOne: '',
          fucha: [],
          szsc: [],
          bushixy: [],
          csitemList:[],
          createUserId: '',
          inputUserId: '',
          bzperson: 0,
          patenPphWjtj: {
            tijiaoNo: '',
            subDate: '',
            tcontent: '',
            fileName: ''
          },
          patenPphSmsxList: [
            // {
            //   OEEApplicationNum: '',
            //   person: '',
            //   smDate: '',
            //   scontent: ''
            // }
          ],
          cpcFileMaterialTypeIdList: []
        },
        materialDocTypeList: [],
        typeNameList: [],
        mailingTypeList: [],
        creatematerialUrl,
        tableTitleList: this.taskType == 4
          ? [
            {"title": "案件文号", "value": "agentNum"},
            {"title": "专利类型", "value": 'typeNameStr'},
            {"title": "案件类型", "value": "caseType",},
            {"title": "申请方向", "value": "appFromto",},
            // {"title": "审级", "value": "judgeRankName"},
            {"title": "案件名称", "value": "caseCnName"},
            {"title": "客户", "value": "custName"},
            {"title": "阶段", "value": "stageName"},
            {"title": "立卷日期", "value": "caseDate"},
            {"title": "申请号", "value": "appNumber"},
            {"title": "申请人名称", "value": "applicantName"},
          ]
          : [
            {"title": "案件文号", "value": "agentNum"},
            {"title": "案件类型", "value": "caseType",},
            {"title": "审级", "value": "judgeRankName"},
            {"title": "案件名称", "value": "caseName"},
            {"title": "客户", "value": "custName"},
            {"title": "阶段", "value": "stageName"}],
        filemessage: false,
        eventRecordId: "",
        modifyState: false,
        queryGetUserList: [],
        uploadFileData: {},
        transferDocList: [],
        comparisonHeightVisible: false,
        convertFormat: 'xml', // 转换格式
        comparisonFiles: {},
        submitStatus:'',
        verifyList:[],
        rejectInfo:{},
        rejectVisible:false,
        rejectReasonList:[],
        mergeFileView:false,
        mergeFileList: [],
        xmlUploadLoading: false
      };
    },
    created() {

      this.querycustSelectClass()
      if (this.taskType != '4') {
        this.queryMaterialTypeByDocId()
      } else {
        this.queryShuomingshu()
      }
      this.getUser()
      if (this.submissionType == 'create') {
        queryCase({
          taskType: this.taskType,
          caseIds: this.multipleSelection.map(item => item.caseId)
        }).then(res => {
          if (this.taskType == 4) {
            //新申请递交信息
            this.submissionForm = JSON.parse(JSON.stringify(res.data[0]));
            if(this.submissionForm.caseTypeStr === 'PCT国家阶段' && !this.submitData.reportMatter){
              this.$set(this.submitData, 'reportMatter', 'PCT进入国家阶段')
            }
            !this.submissionForm.divcaseList && (this.$set(this.submissionForm, 'divcaseList', []));
            !this.submissionForm.hkRefNoList && (this.$set(this.submissionForm, 'hkRefNoList', []));

            //默认信息
            !this.submissionForm.substractPage && this.submissionForm.substractPage !== 0 && (this.submissionForm.substractPage = 1)
            !this.submissionForm.substractDrawing && this.submissionForm.substractDrawing !== 0 && (this.submissionForm.substractDrawing = 1)
            // !this.submissionForm.substractDrwno && this.submissionForm.substractDrwno !== 0 && (this.submissionForm.substractDrwno = 1)
            !this.submissionForm.feeReduce && (this.submissionForm.feeReduce = 0)
            this.zhubiancustId = this.submissionForm.custId
            if (!this.submitData.submitMode) {
              this.$set(this.submitData, 'submitMode', 'CPC接口')
              // this.submitData.submitMode = 'CPC接口'
            }
            // 任务7763
            this.$set(this.submitData, 'ycmonth', this.submissionForm.yanchi)
            this.$set(this.submitData, 'ycsc', this.submissionForm.ycsc)
            if (!this.submitData.submitMode) {
              this.$set(this.submitData, 'submitMode', 'CPC接口')
              // this.submitData.submitMode = 'CPC接口'
            }
            if (!this.submitData.reportMatter) {
              this.$set(this.submitData, 'reportMatter', '普通新申请')
              // this.queryLastDoc(this.submitData.reportMatter, true)
              // this.submitData.reportMatter = '普通新申请'
            }
            // this.$set(this.submitData, 'bzperson', this.submitData.bzperson ? this.submitData.bzperson : 0)
            this.submitData.csitemList = this.submitData.csitemList ? this.submitData.csitemList.map(item=>(item.csitem+'')) : []
            if (this.submitData.csitemList.length) {
              if ( ['意见陈述（非正常申请）', '意见陈述（行政复议）', '行政复议'].includes(this.submitData.reportMatter)) {
               this.submitData.csitemOne = this.submitData.csitemList[0]
              }
            }
            this.submitData.bzreason = this.submitData.bzreason ? this.submitData.bzreason : ''
            this.reportMatter == '补正' ? (this.submitData.bzreason && (this.buzhengReason.push(this.submitData.bzreason+'') ), this.reasonFirst = this.submitData.bzreason)
              :  this.reportMatter == '意见陈述（退费）' ? (this.buzhengReasonNum = +this.submitData.csitemList[0]) : (this.submitData.csitemList && (this.buzhengReason = this.submitData.csitemList), this.reasonFirst = this.submitData.csitemList[0]);

            this.zhubianData = res.data[0] && res.data[0].patentZbrecord && res.data[0].patentZbrecord || {dataList: []}

            this.submitData.tuiType ? this.tuiType = this.submitData.tuiType : '';

            this.reportMatter == 'PPH请求' ? (this.submitData.patenPphWjtj.tijiaoNo ? this.tijiaoNoList.push(...this.submitData.patenPphWjtj.tijiaoNo.split(',')) : '') : '';

            // 代理师同意签署
          if (['外-内', '内-内', '台-内'].includes(this.multipleSelection[0].appFromto) && ['普通新申请', 'PCT国家阶段', '海牙国家阶段'].includes(this.multipleSelection[0].caseTypeStr)) {

            const namedAttorney = this.multipleSelection[0].namedAttorney
            const namedAttorney2 = this.multipleSelection[0].namedAttorney2
            const actualAttorney = this.multipleSelection[0].actualAttorney
            
            // 1、仅有代理人一，代理人二为空，且代理人一=撰稿人
            const condition1 = namedAttorney && !namedAttorney2 && namedAttorney === actualAttorney
            
            // 2、代理人一和代理人二都有值，代理人一=撰稿人或者代理人二=撰稿人
            const condition2 = namedAttorney && namedAttorney2 && (namedAttorney === actualAttorney || namedAttorney2 === actualAttorney)
            
            if (this.submissionType == 'create' && (condition1 || condition2)) {
              this.$set(this.submitData, 'agentAgree', 1)
            }
          }
          }
        })
        this.submitData.createDate = this.$commonUtils.formatDate(new Date())
        this.submitData.inputDate = this.$commonUtils.formatDate(new Date())
        this.submitData.inputUserId = this.$store.getters.userId
        this.submitData.createUserId = this.$store.getters.userId
      }
      if (this.submissionType !== 'create') {
        this.queryInstruction()
      }
    },
    methods: {
      highlightContext(context, chat) {
        if (!context || !chat) return context;
        const escapedChar = chat.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(escapedChar, 'g');
        return context.replace(regex, `<span style="color: red;">${chat}</span>`);
      },
      closeMergeDialog() {
        this.mergeFileList = []
        this.mergeFileView = false
      },
      mergeFile(){
        fileMergePdf({
          caseId: this.curCaseId[0],
          materialId: this.verifyList[0].materialId
        }).then(res => {
          this.mergeFileView = true
          this.mergeFileList = res.data
        })
      },
      // 更改名称
      getDynamicName(row) {
        // 检查 contrastMaterial 是否有值
        if (row.contrastMaterial) {
          // 将文件名后缀从 pdf 替换为 xml
          return row.materialName.replace(/\.pdf$/i, '.xml');
        }
        // 如果没有 contrastMaterial 的值，直接返回原文件名
        return row.materialName;
      },
      changeBox(v){
        if (v) {
          // const list = ['6', '7']
          // list.forEach(item => {
          //   if (!this.submitData.fucha.includes(item)) {
          //     this.submitData.fucha.push(item)
          //   }
          // })
        } else {
          this.submitData.fucha = this.submitData.fucha.filter(item => !['6', '7'].includes(item))
        }
      },
      changeFuchaCheckBox(v){
        if (!v.includes('1')) {
          this.fuchaRadio = ''
          this.submitData.fucha = this.submitData.fucha.filter(item => !['2', '3', '4'].includes(item))
        }
      },
      changeFuchaRadio(v){
        this.submitData.fucha = this.submitData.fucha.filter(item => !['2', '3', '4'].includes(item))
        if (!this.submitData.fucha.includes('1')) {
          this.submitData.fucha.push('1')
        }
        if (!this.submitData.fucha.includes(v)) {
          this.submitData.fucha.push(v)
        }
      },
      validateNumber(number){
        if (number < 1) {
          this.submitData.ycmonth = ''
          this.$message.error('月份不能小于1')
        }
        if (number > 36) {
          this.submitData.ycmonth = ''
          this.$message.error('月份不能大于36')
        }
      },
      changeSzsc(v){
        if (!v.includes('1')) {
          this.szscRadio = ''
          this.submitData.szsc = this.submitData.szsc.filter(item => !['2', '3', '4'].includes(item))
        }
      },
      changeSzscRadio(v){
        this.submitData.szsc = this.submitData.szsc.filter(item => !['2', '3', '4'].includes(item))
        if (!this.submitData.szsc.includes('1')) {
          this.submitData.szsc.push('1')
        }
        if (!this.submitData.szsc.includes(v)) {
          this.submitData.szsc.push(v)
        }
      },
      chooseLang(type){
        if(this.submissionForm.pctOpenLang == type){
          this.$set(this.submissionForm, 'pctOpenLang', '')
        }else{
          this.$set(this.submissionForm, 'pctOpenLang', type)
        }
      },
      changeMdType(v){
        this.buzhengReason = []
        this.buzhengReasonNum = 0
        this.reasonFirst = ''
        this.submitData.csitemList = []
        this.submitData.csitemOne = ''
        this.submitData.bzreason = 0
        this.changeReportMatter(v)
      },
      changeReports(v){
        this.queryLastDoc(v, true)
        this.buzhengReason = []
        this.buzhengReasonNum = 0
        this.reasonFirst = ''
        this.submitData.csitemList = []
        this.submitData.csitemOne = ''
        this.submitData.bzreason = 0
        v !== '主动修改'&&this.$set(this.submitData, 'mdType', '')
      },
      queryChargeItemList(){
        queryChargeItemList({
          chargeType:2,
          caseTypeId: 4
        }).then(res=>{
          this.feeTypeList = res.data
        })
      },
      changeTuifei(v) {
        this.submitData.tuiType = +v[0];
        if (this.submitData.tuiType == 2) {
          // this.$set(this.submitData, 'tuifeeList', [{}])
        }
      },
      feeReduceChange(v) {
        v && (this.submissionForm.feeReduce = fomatFloat(v, 2))
      },
      queryCountry() {
        queryCPCAddr().then(res => {
          this.patentCountryList = res.data;
        })
      },
      changeProperty(v, property) { //property: das || tstss
        let list = this.typeNameList.filter(i => i.yongtu == 2).filter(i => i.property == property)
        if (v == 1) {
          list.forEach(i => {
            if (!this.submitData.cpcFileMaterialTypeIdList.includes(i.materialTypeId)) {
              this.submitData.cpcFileMaterialTypeIdList.push(i.materialTypeId)
            }
          })
        } else {
          this.submitData.cpcFileMaterialTypeIdList.forEach((item, index) => {
            if (list.find(i => i.materialTypeId == item)) {
              this.submitData.cpcFileMaterialTypeIdList.splice(index, 1)
            }
          })
        }
      },
      //附件上传文件成功回调
      fujianCallback(res, file, fileList, row) {
        if(fileList.length >= 2){
          delCaseMaterial({materialId: fileList[fileList.length - 2].response.data[0].materialId, caseIdArray: this.curCaseId[0]}).then(res => {

          })
        }
        this.$set(row, 'materialName', fileList[fileList.length - 1].response.data[0].materialName)
        this.$set(row, 'materialId', fileList[fileList.length - 1].response.data[0].materialId)
        this.$set(row, 'address', fileList[fileList.length - 1].response.data[0].address)
        // row.materialName = fileList[fileList.length - 1].response.data[0].materialName
        // row.materialId = fileList[fileList.length - 1].response.data[0].materialId
        // row.address = fileList[fileList.length - 1].response.data[0].address
        // this.$forceUpdate()
      },
      xmlSuccessCallback(response,uploadFile){
        const obj = response.data[0]
        this.materialIdList.push(obj.materialId)
        this.transferDocList.push(obj)
        this.submissionForm.claimItems = obj.claimItems
        this.submissionForm.claimPages = obj.claimPages
        this.submissionForm.descriptionPages = obj.descriptionPages
        this.submissionForm.appendedDrawings = obj.appendedDrawings
        this.submissionForm.drawingPages = obj.drawingPages
        this.submissionForm.substractPage = obj.substractPage
        this.xmlUploadLoading = false
      },
      xmlBeforeUpload(file){
        // 设置上传文件类型必须为.zip
        const name = file.name.toLowerCase().replace(/.+\./g, '')
        if (!name.includes('zip')) {
          this.$message.warning('请上传zip类型的文件！')
          return false
        }
        this.xmlUploadLoading = true
      },
      //延长俩个月自动计算
      AddMouth(date, num) {
        //date为格式化后的日期字符yyyy-MM-dd,num为增加的月份
        if (!num) return;
        var monthnum = parseInt(num);
        var year = parseInt(date.substring(0, 4));
        var month = parseInt(date.substring(5, 7));
        var day = parseInt(date.substring(8, 10));
        if (month + monthnum > 12) {
          var newyear = year + 1;
          var newmonth = month + monthnum - 12;
          var newday = day;
        } else {
          var newyear = year
          var newmonth = month + monthnum;
          var newday = day;
        }
        var newdate = newyear + "-" + newmonth + "-" + newday;
        return newdate;
      },
      //查询案件最近的官方通知的发文日志和发文编号
      queryLastDoc(reportMatter, flag) {
        queryLastDoc({caseId: this.curCaseId[0], reportMatter}).then(res => {
          /*
          * "documentNo": "2021032401392190",
            "yctime": 2,
            "dispatchDate": "2021-03-29",
            "materialTypeId": 301346,
            "ycqx": "2021-03-29",
            "docTitle": "补正通知书",
            "ycqxEnd": "2021-08-10",
            "deadline": "2021-06-10",
            "ntNumber": 1
          * */
          if (res.data) {
            for (var key in res.data) {
              flag ? this.$set(this.submitData, key, res.data[key]) : !this.submitData[key] && this.$set(this.submitData, key, res.data[key])
            }
          }else{
            flag ? (
              this.$set(this.submitData, 'dispatchDate', ''),
              this.$set(this.submitData, 'docTitle', ''),
              this.$set(this.submitData, 'documentNo', '')
            ) : ''

          }
        })
      },
      changeFileName(v, row) {
        let data = this.fileTypeList.find(i => i.fileName == v)
        if (data) {
          this.$set(row, 'position', data.position)
          this.$set(row, 'beforeData', data.beforeData)
          this.$set(row, 'afterData', data.afterData)
        }
      },
      tableRowClassName({row, rowIndex}) {
        row.index = rowIndex;
      },
      changeCurrenIndex(a, b, c) {

      },
      //删除
      delTableList(list, f) {
        if (!list.length) {
          this.$message.error('无数据')
          return
        }
        if (!this.$refs[f].selection.length) {
          this.$message.error('请选择数据')
          return
        }
        this.$refs[f].selection.forEach(item => {
          let idx = list.findIndex(i => i == item);
          list.splice(idx, 1)
        })
      },
      //增加
      addTableList(list, f) {

        // f == 'bzList' ?
        //   list ?
        //     list.push({fileName: ''})
        //     : this.$set(this.submitData, f, [{fileName: ''}])
        //   : list ?
        //   list.push({})
        //   : this.$set(this.submitData, f, [{}]);
        if (f == 'bzList') {
          if (list) {
            list.push({fileName: ''})
          } else {
            this.$set(this.submitData, f, [{fileName: ''}])
          }
        } else {
          if (list) {
            list.push({})
          } else {
            this.$set(this.submitData, f, [{}])
          }
        }

      },
      // addBuzheng() {
      //   this.submitData.bzList ? this.submitData.bzList.push({}) : this.$set(this.submitData, 'bzList', [{}]);
      //   // this.$forceUpdate
      // },
      // addWuxiaoYj() {
      //   this.submitData.wxyjList ? this.submitData.wxyjList.push({}) : this.$set(this.submitData, 'wxyjList', [{}]);
      //   // this.$forceUpdate
      // },
      // addWuxiaoZj() {
      //   this.submitData.wxzjList ? this.submitData.wxzjList.push({}) : this.$set(this.submitData, 'wxzjList', [{}]);
      // },
      queryBzdefineList() {
        queryBzdefineList().then(res => {
          this.fileTypeList = res.data
        })
      },
      changePPHFile(v) {
        v && v.length && (this.submitData.patenPphWjtj.tijiaoNo = v.join(','));
      },
      changeBuzhengReason(v) {
        if(typeof v == 'number'){
          v = [v]
        }
        this.reasonFirst = +v || ''
        this.reportMatter == '补正' ? this.submitData.bzreason = +v : this.submitData.csitemList = v
      },
      //查询著变信息
      // queryZbrecordList() {
      //   queryZbrecordList({caseId: this.curCaseId[0]}).then(res => {
      //     this.zhubianData = res.data.find(i => !i.zbStatus)
      //     // console.log(res.data,'++++++')
      //   })
      // },
      // queryItemList() {
      //   queryItemList().then(res => {
      //     this.itemList = res.data
      //   })
      // },
      // queryCaseInfoForZb() {
      //   queryCaseInfoForZb({caseId: this.curCaseId[0]}).then(res => {
      //     //发明：patentInventorList, 申请：patentApplicantList,在先申请：patentPriorityList
      //     let {patentInventorList, patentApplicantList, patentPriorityList, lxrnameCn, agencyName, attorneyName} = res.data
      //     this.personList[0] = patentInventorList
      //     this.personList[1] = patentApplicantList
      //     this.personList[2] = lxrnameCn
      //     this.personList[3] = agencyName
      //     this.personList[4] = attorneyName
      //     this.personList[5] = patentPriorityList
      //   })
      // },
      preView(data) {
        let url = data.address
        if (getProgID(url) || ['eml', 'msg'].includes(url.replace(/.+\./, '').toLocaleLowerCase())) {
          if(['doc','docx'].includes(url.replace(/.+\./,"").toLocaleLowerCase())){
            this.$commonUtils.viewPdf(`${url}`)
          }else {
            let flag = ''
            if(data.mailId){
              flag = 'mailId'
            }else if (data.materialId) {
              flag = 'materialId'
            }
            url = url.replace(/&/g, '%26')
            window.open(`#/preView?address=ipdoc${url}&${flag}=${data[flag]}`.replace(/[+]/g,'%2B'))
          }
        } else if (['pdf', 'jpg', 'png'].some(item => url.replace(/.+\./, "").toLocaleLowerCase() == item)) {
          window.open(`/ipdoc${url}`.replace(/[+]/g, '%2B'))
        } else {
          this.downLoad(data)
        }
      },
      downLoad(data) {
        const url = data.address
        // let notify = this.$notify.success({
        //   // title: 'Info',
        //   message: '正在下载',
        //   showClose: false,
        //   duration: 0
        // });
        const downData = {
          url: `ipdoc${url}`,
          success() {
            // notify.close()
          }
        }
        if (data.mailId) {
          downData.downLoad = data.materialName
        }
        this.$commonUtils.downLoadAll(downData)
      },
      //导出到pcp
      importCPCFile() {
        importCPCFile({
          insIdList: [...new Set(this.multipleSelection.map(item => item.insId))],
          caseIds: this.curCaseId[0],
          taskIdList: [...new Set(this.multipleSelection.map(item => item.taskId))],
          // materialIdList: this.applyList.map(item => item.materialId)
        }).then(res => {
          res.data && res.data.billRecordList && this.$emit('openRecord', res.data.billRecordList)
          this.$emit('updateData')
          setTimeout(() => this.cancel(), 500)
          // this.transferFileTable = true
          // this.transferDocList = res.data
        })
      },
      //审核
      audtiClick(result) {
        if (!this.submitData.paType) {
          this.submitData.paType = 3
        }
        // for (var key in this.submissionForm) {
        //   if (this.submitData[key]) {
        //     delete this.submissionForm[key]
        //   }
        //   // if (Object.prototype.toString.call(this.submissionForm[key]) == '[object Array]') {
        //   //   if (this.submissionForm[key] == []) {
        //   //     delete this.submissionForm[key]
        //   //   }
        //   // } else {
        //   //   if (!this.submissionForm[key] && this.submissionForm[key] !== 0 && this.submissionForm[key] !== false) {
        //   //     delete this.submissionForm[key]
        //   //   }
        //   // }
        // }
        if (this.submissionForm.feeReduce > 1 || this.submissionForm.feeReduce < 0) {
          this.$message.error('费减比例数据错误!')
          return
        }
        this.submitData = {...this.submissionForm, ...this.submitData}

        const data = {
          result,
          userId: this.$store.getters.userId,
          caseIds: this.curCaseId[0],
          materialTypeId: this.materialTypeId,
          insIdList: this.multipleSelection.map(item => item.insId),
          taskType: this.taskType,
          materialIdList: Array.from(new Set([...this.flielist.filter(item => item.materialId).map(item => item.materialId), ...this.materialIdList]))
        }
        delete this.submitData.caseArray
        this.$commonUtils.handleObjNullAttr(this.submitData, this.backData)
        // this.submitData.docTitle = this.submitData.docTitle&&this.submitData.docTitle.replace(/(.*)(通知书|通知)$/, ($, $1, $2)=>{
        //   return $1
        // })
        if (this.submitData.csitemOne) { // radio单选
          this.submitData.csitemList = [this.submitData.csitemOne]
        }
        this.submitData.csitemList&&this.submitData.csitemList.length && (this.submitData.csitemList = this.submitData.csitemList.map(item=>({csitem: item})))
        this.arrayToString(['bushixy', 'szsc', 'fucha'])
        delete this.submitData.status
        submitOfficalAudit(Object.assign(data, this.$commonUtils.cleanNullAttr(this.submitData))).then(res => {
          this.cancel()
          this.$emit('updateData')
        })
      },
      arrayToString(list){
        list.forEach(item => {
          if (this.submitData[item]) {
            this.submitData[item] = this.submitData[item] + ''
          }
        })
      },
      stringToArray(list){
        list.forEach(item => {
          if (this.submitData[item] && typeof this.submitData[item] === 'string') {
            this.submitData[item] = this.submitData[item].split(',')
          } else {
            this.submitData[item] = []
          }
        })
      },
      //制作
      transferDoc(f) {
        if(!f.length)return;
        if (!f.find(item => item.materialName.substring(item.materialName.lastIndexOf('.') + 1).toLowerCase().includes('doc'))) {
          this.$message.error('请上传word文档!')
          return
        }
        let materialIdList;
        materialIdList = f.map(item => item.materialId) || '';
        transferDoc({
          // materialType,
          insIdList: [...new Set(this.multipleSelection.map(item => item.insId))],
          caseIds: this.curCaseId[0],
          taskIdList: [...new Set(this.multipleSelection.map(item => item.taskId))],
          materialIdList
        }).then(res => {
          // this.transferFileTable = true
          const {appendedDrawings, claimItems, claimPages, descriptionPages, drawingPages, substractDrawing, substractPage} = res.data
          this.submissionForm.appendedDrawings = appendedDrawings
          this.submissionForm.claimItems = claimItems
          this.submissionForm.claimPages = claimPages
          this.submissionForm.descriptionPages = descriptionPages
          this.submissionForm.drawingPages = drawingPages
          this.submissionForm.substractDrawing = substractDrawing
          this.submissionForm.substractPage = substractPage
          this.transferDocList = res.data.materialList
        })
      },
      // 解析xml
      transferXml(f) {
        if(!f.length)return;
        if (!f.find(item => item.materialName.substring(item.materialName.lastIndexOf('.') + 1).toLowerCase().includes('doc'))) {
          this.$message.error('请上传word文档!')
          return
        }
        let materialIdList;
        materialIdList = f.map(item => item.materialId) || '';
        transferDocNew({
          // materialType,
          xgwjyw1: this.submissionForm.xgwjyw1,
          xgwj: this.submissionForm.xgwj,
          law34: this.submissionForm.law34,
          insIdList: [...new Set(this.multipleSelection.map(item => item.insId))],
          caseIds: this.curCaseId[0],
          taskIdList: [...new Set(this.multipleSelection.map(item => item.taskId))],
          materialIdList
        }).then(res => {
          // this.transferFileTable = true
          const {appendedDrawings, claimItems, claimPages, descriptionPages, drawingPages, substractDrawing, substractPage} = res.data
          this.submissionForm.appendedDrawings = appendedDrawings
          this.submissionForm.claimItems = claimItems
          this.submissionForm.claimPages = claimPages
          this.submissionForm.descriptionPages = descriptionPages
          this.submissionForm.drawingPages = drawingPages
          this.submissionForm.substractDrawing = substractDrawing
          this.submissionForm.substractPage = substractPage
          this.transferDocList = res.data.materialList
          this.testReportList = res.data.testReport
        })
      },
      //分案号变化
      agentNumChange(e) {
        if (!e.length) return;
        let list = []
        if (e.length) {
          e.forEach(item => {
            if (this.anotherCaseNumList.length && this.anotherCaseNumList.find(i => i.agentNum == item)) {
              // console.log(item)
              // console.log(this.anotherCaseNumList.find(i => i.agentNum == item))
              list.push(this.anotherCaseNumList.find(i => i.agentNum == item).appNumber)
            }
          })
        }
        this.submissionForm.parentFileNo = list.filter(item => !!item).join(';')
      },
      //另一件案号搜索事件
      queryCaseAgentNumList(query) {
        queryCaseAgentNumList({agentNum: query, pageSize: 100, pageNo: 1}).then(res => {
          this.anotherCaseNumList = res.data
        })
      },
      changeReportMatter(v) {
        queryMaterialType({
          sign: 1,
          caseTypeId: this.$commonUtils.getCaseTypeIdByTaskType(+this.taskType),
          caseId: this.curCaseId[0],
          reportMatter: v
        }).then(res => {
          // this.typeNameList = res.data
          this.typeNameList = this.unique(res.data, 'materialTypeId')
          this.changeProperty(this.submissionForm.tstss, 'tstss')
          this.changeProperty(this.submissionForm.das, 'das')
        })
      },
      unique(data, key) {
        const hash = {};
        const data2 = data.reduce((preVal, curVal) => {
          hash[curVal[key]] ? '' : hash[curVal[key]] = true && preVal.push(curVal);
          return preVal
        }, [])
        return data2
      },
      //说明书
      queryShuomingshu() {
        queryShuomingshu().then(res => {
          this.applyFileList = res.data
          this.applyFileId = res.data[0].materialTypeId
        })
      },
      //上报事项
      querycustSelectClass(classId = '1144,1194') {
        const data = {
          classId,
        }
        querycustSelectClass(data).then(res => {
          res.data['1144'] && (this.reportMatterList = res.data['1144']);
          res.data['1155'] && (this.changeItemList = res.data['1155']);
          res.data['1194'] && (this.rejectReasonList = res.data['1194']);
          // this.correctionContentArray = res.data['1138']
        })
      },
      removeFile(data) {
        const {file, fileType} = data
        //isShow区分申请文本和附加文件
        this.materialIdList.splice(this.materialIdList.indexOf(file.materialId), 1)
        switch (fileType) {
          case '申请文本':
            this.applyList.splice(this.applyList.map(item => item.materialId).indexOf(file.materialId), 1);
            break;
          case '意见陈述书附页':
            this.yjcsfyList.splice(this.yjcsfyList.map(item => item.materialId).indexOf(file.materialId), 1);
            break;
          case '修改对照页':
            this.xgdzList.splice(this.xgdzList.map(item => item.materialId).indexOf(file.materialId), 1);
            break;
          case '替换页':
            this.tihuanList.splice(this.tihuanList.map(item => item.materialId).indexOf(file.materialId), 1);
            break;
          case '修改说明':
            this.xgsmList.splice(this.xgsmList.map(item => item.materialId).indexOf(file.materialId), 1);
            break;
          case '更正错误':
            this.gzcwList.splice(this.gzcwList.map(item => item.materialId).indexOf(file.materialId), 1);
            break;
          case '改正译文错误':
            this.gzhList.splice(this.gzhList.map(item => item.materialId).indexOf(file.materialId), 1);
            break;
          case '核查附件':
            this.verifyList.splice(this.verifyList.map(item => item.materialId).indexOf(file.materialId), 1);
            break;
          default:
            this.flielist.splice(this.flielist.map(item => item.materialId).indexOf(file.materialId), 1);
            break;

        }
        // if (fileType == '申请文本') {
        //   this.applyList.splice(this.applyList.map(item => item.materialId).indexOf(file.materialId), 1)
        //   this.materialIdList.splice(this.materialIdList.indexOf(file.materialId), 1)
        // } else {
        //   this.flielist.splice(this.flielist.map(item => item.materialId).indexOf(file.materialId), 1)
        //   this.materialIdList.splice(this.materialIdList.indexOf(file.materialId), 1)
        // }

      },
      queryMaterialTypeByDocId(doctId) {
        queryMaterialType({
          sign: 1,
          caseTypeId: this.$commonUtils.getCaseTypeIdByTaskType(+this.taskType)
        }).then(res => {
          this.typeNameList = res.data
        })
      },
      handleChangeTypeName(n) {
        this.uploadFileData.materialTypeId = n,
          this.typeName = this.typeNameList.find(item => item.materialTypeId === n).typeName
        this.submitData.docName = this.typeName
        if (this.flielist && this.flielist.length) {
          modifyMaterialType({
            materialTypeId: n,
            materialIdList: this.flielist.filter(item => item.materialId).map(item => item.materialId)
          }).then(res => {

          })
        }
      },
      // pdf对比
      comparison(row) {
        if (row.address && row.contrastMaterial.address) {
          this.comparisonHeightVisible = true
          this.comparisonFiles = {
            doc: row.contrastMaterial.address,
            xml: row.address
          }
        }else{
          this.$message.error('对比文件数据异常！')
          return
        }
      },
      deleteSubFile(row) {
        delCaseMaterial({materialId: row.materialId, caseIdArray: this.curCaseId[0]}).then(res => {
          this.transferDocList.splice(this.transferDocList.map(item => item.materialId).indexOf(row.materialId), 1)
        })
        if (this.materialIdList.indexOf(row.materialId) !== -1) {
          this.materialIdList.splice(this.materialIdList.indexOf(row.materialId), 1)
        }
      },
      handleRemove(file, fileList, caseId) {
        let delmaterialId;
        if (file.materialId) {
          delmaterialId = file.materialId;
          delCaseMaterial({materialId: delmaterialId, caseIdArray: caseId}).then(res => {
            this.flielist.splice(this.flielist.map(item => item.materialId).indexOf(delmaterialId), 1)
          })
        } else {

        }
      },
      queryInstruction() {
        let transferListMaterialTypeIdList = [300478,300479,300480,300481,300482,301484,301487,301488,301489,301490,301491,301492,301503,301504,301500,301652];
        queryInstruction({
          taskType: this.taskType,
          insIdList: [...new Set(this.multipleSelection.map(item => item.insId))]
        }).then(res => {
          for (var key in res.data[0]) {
            this.$set(this.submitData, key, res.data[0][key])
          }
          this.submitStatus = this.submitData.submitStatus
          if (this.submitData.submitStatus === 6) {
            this.submitData.reviewer = this.submitData.caseArray[0].actualAttorney
          }
      
          this.stringToArray(['bushixy', 'szsc', 'fucha'])
          if (this.submitData.szsc.find(item => ['2', '3', '4'].includes(item))) {
            this.szscRadio = this.submitData.szsc.find(item => ['2', '3', '4'].includes(item))
          }
          if (this.submitData.fucha.find(item => ['2', '3', '4'].includes(item))) {
            this.fuchaRadio = this.submitData.fucha.find(item => ['2', '3', '4'].includes(item))
          }
          if (this.taskType == 4) {
            //新申请递交信息
            this.submissionForm = JSON.parse(JSON.stringify(this.submitData.caseArray[0]));
            this.submitData = {...this.submissionForm, ...this.submitData}
            if(this.submissionForm.caseTypeStr === 'PCT国家阶段' && !this.submitData.reportMatter){
              this.$set(this.submitData, 'reportMatter', 'PCT进入国家阶段')
            }
            !this.submissionForm.divcaseList && (this.$set(this.submissionForm, 'divcaseList', []));
            !this.submissionForm.hkRefNoList && (this.$set(this.submissionForm, 'hkRefNoList', []));
            //默认信息
            !this.submissionForm.substractPage && this.submissionForm.substractPage !== 0 && (this.submissionForm.substractPage = 1)
            !this.submissionForm.substractDrawing && this.submissionForm.substractDrawing !== 0 && (this.submissionForm.substractDrawing = 1)
            // !this.submissionForm.substractDrwno && this.submissionForm.substractDrwno !== 0 && (this.submissionForm.substractDrwno = 1)
            !this.submissionForm.feeReduce && (this.submissionForm.feeReduce = 0)
            this.zhubiancustId = this.submissionForm.custId
            // if (!this.submitData.submitMode && this.submissionType == 'create') {
            //   this.$set(this.submitData, 'submitMode', 'CPC接口')
            //   // this.submitData.submitMode = 'CPC接口'
            // }
            // if (!this.submitData.reportMatter && this.submissionType == 'create') {
            //   this.$set(this.submitData, 'reportMatter', '普通新申请')
            //   // this.submitData.reportMatter = '普通新申请'
            // }
            // this.$set(this.submitData, 'bzperson', this.submitData.bzperson ? this.submitData.bzperson : 0)
            this.submitData.csitemList = this.submitData.csitemList ? this.submitData.csitemList.map(item=>(item.csitem+'')) : []
            if (this.submitData.csitemList.length) {
              if ( ['意见陈述（非正常申请）', '意见陈述（行政复议）', '行政复议'].includes(this.submitData.reportMatter)) {
                this.submitData.csitemOne = this.submitData.csitemList[0]
              }
            }
            this.submitData.bzreason = this.submitData.bzreason ? this.submitData.bzreason : ''
            this.reportMatter == '补正' ? (this.submitData.bzreason && (this.buzhengReason.push(this.submitData.bzreason+'') ), this.reasonFirst = this.submitData.bzreason)
              : this.reportMatter == '意见陈述（退费）' ? (this.buzhengReasonNum = +this.submitData.csitemList[0]) : (this.submitData.csitemList && (this.buzhengReason = this.submitData.csitemList), this.reasonFirst = this.submitData.csitemList[0]);

            // this.reportMatter == '意见陈述（退费）' && (this.buzhengReasonNum = this.submitData.csitemList)

            this.zhubianData = res.data[0] && res.data[0].patentZbrecord && res.data[0].patentZbrecord || {dataList: []}

            this.submitData.tuiType ? this.tuiType = this.submitData.tuiType : '';

            this.reportMatter == 'PPH请求' ? (this.submitData.patenPphWjtj.tijiaoNo ? this.tijiaoNoList.push(...this.submitData.patenPphWjtj.tijiaoNo.split(',')) : '') : '';

            this.queryLastDoc(this.submitData.reportMatter, false)
          }
          if (this.taskType == 4) {
            let allfileList = JSON.parse(JSON.stringify(res.data[0].materials || []))
            this.materialIdList = allfileList.map(item => item.materialId)
            delete this.submitData.materials
            allfileList.length&&allfileList.forEach(item => {
              if (item.materialTypeId == 300449) {
                this.applyList.push(item)
                this.gzcwList.push(item)
                this.gzhList.push(item)
                // this.xgdzList.push(item)
              }else if (item.materialTypeId == 301448) {
                this.xgdzList.push(item)
              }else if (item.materialTypeId == 301485) {
                this.xgsmList.push(item)
              }else if (item.materialTypeId == 301486) {
                this.tihuanList.push(item)
              } else if (item.materialTypeId == 301280) {
                this.yijianList.push(item)
              } else if (item.materialTypeId == 301460) {
                this.yjcsfyList.push(item)
              } else if (item.materialTypeId == 301684) {
                this.verifyList.push(item)
              } else if (transferListMaterialTypeIdList.includes(item.materialTypeId)) {
                this.transferDocList.push(item)
              } else {
                this.checkList.push(item.typeName)
                this.flielist.push(item)
              }
            });
          } else {
            this.flielist = JSON.parse(JSON.stringify(res.data[0].materials))
            delete this.submitData.materials
          }
          this.backData = JSON.parse(JSON.stringify(this.submitData))

          // this.submitData=res.data
        })
      },
      getUser() {
        this.queryGetUserList = this.$store.getters.userList
      },
      beforeupload1() {
        // if(!this.applyFileId){
        //   this.$message.error('请先选择文件类型！')
        //   return
        // }
        this.uploadFileData.materialTypeId = this.applyFileId
        this.uploadFileData.objType = this.$commonUtils.getSubmitObjTypeByTaskType(+this.taskType)
        this.uploadFileData.caseIds = this.curCaseId[0]
        this.uploadFileData.tokenID = this.$store.getters.token
      },
      successCallback1(res, file, fileList) {
        this.materialIdList.push(res.data[0].materialId)
        // let list = res.data
        this.flielist.push(...res.data)
      },
      beforeupload(item) {
        this.uploadFileData.objType = this.$commonUtils.getSubmitObjTypeByTaskType(+this.taskType)
        this.uploadFileData.caseIds = this.curCaseId[0]
        this.uploadFileData.tokenID = this.$store.getters.token

      },
      uploadSuccess(data) {
        const {res, file, fileList, fileType} = data
        this.materialIdList.push(res.data[0].materialId)
        switch (fileType) {
          case '申请文本':
            this.applyList.push(...res.data)
            break;
          case '意见陈述书附页':
            this.yjcsfyList.push(...res.data)
            break;
          case '修改对照页':
            this.xgdzList.push(...res.data)
            break;
          case '替换页':
            this.tihuanList.push(...res.data)
            break;
          case '修改说明':
            this.xgsmList.push(...res.data)
            break;
          case '更正错误':
            this.gzcwList.push(...res.data)
            break;
          case '改正译文错误':
            this.gzhList.push(...res.data)
            break;
          case '核查附件':
            this.verifyList.push(...res.data)
            break;
          default:
            this.flielist.push(...res.data);
            break;
        }
      },
      successCallback(res, file, fileList) {
        let length = fileList.filter(item => !!item.raw).length
        this.materialIdList.push(res.data[0].materialId)
        if (length === this.materialIdList.length) {
          if (this.submissionType == 'create') {
            this.submitOffical()
          } else {
            this.submitOfficalModify()
          }
        }

      },
      handleClose(done) {
        this.cancel()
        this.$emit('changeFalse')
        done()
      },
      brforeRemoveFile(file, fileList) {

      },
      cancel() {
        this.zhubianData = {}
        if (this.multipleSelection[0].insId) {
          this.$store.commit('caseInformation/SET_PREONLYID', this.multipleSelection[0].insId)
        }
        this.$emit('changeFalse')
      },
      submitOfficalModify(f) {
        if (this.taskType == 4) {
          if (this.submissionForm.feeReduce > 1 || this.submissionForm.feeReduce < 0) {
            this.$message.error('费减比例数据错误!')
            return
          }
          if (!this.submitData.paType) {
            this.submitData.paType = 3
          }
          this.submitData = {...this.submissionForm, ...this.submitData}
        }
        const data = {
          userId: this.$store.getters.userId,
          caseIds: this.curCaseId[0],
          materialTypeId: this.materialTypeId,
          insIdList: this.multipleSelection.map(item => item.insId),
          taskType: this.taskType,
          materialIdList: Array.from(new Set([...this.flielist.filter(item => item.materialId).map(item => item.materialId), ...this.materialIdList])),
          dataList: this.zhubianData && this.zhubianData.dataList
        }
        delete this.submitData.caseArray
        this.$commonUtils.handleObjNullAttr(this.submitData, this.backData)
        if (this.submitData.csitemOne) { // radio单选
          this.submitData.csitemList = [this.submitData.csitemOne]
        }

        this.submitData.csitemList&&this.submitData.csitemList.length && (this.submitData.csitemList = this.submitData.csitemList.map(item=>({csitem: item})))
        this.arrayToString(['bushixy', 'szsc', 'fucha'])
        delete this.submitData.status
        if (f == 'reSubmit' && !this.applyList.length && ['普通新申请','PCT进入国家阶段'].includes(this.reportMatter)) {
          return this.$message.error('请上传申请文本')
        }
        submitOfficalModify(Object.assign(data, this.$commonUtils.cleanNullAttr(this.submitData))).then(res => {
          if (f == 'importCPCFile') {
            this.importCPCFile()
          } else if(f == 'reSubmit'){
            this.handleAudit()
          }else if(f == 'pass'){
            this.handleAudit(1)
          }else {
            this.cancel()
            this.$emit('updateData')
          }
        })
      },
      submitOffical() {
        if (this.taskType == 4) {
          if (this.submissionForm.feeReduce > 1 || this.submissionForm.feeReduce < 0) {
            this.$message.error('费减比例数据错误!')
            return
          }
          // for (var key in this.submissionForm) {
          //   if (this.submitData[key]) {
          //     delete this.submissionForm[key]
          //   }
          //   // if (Object.prototype.toString.call(this.submissionForm[key]) == '[object Array]') {
          //   //   if (this.submissionForm[key] == []) {
          //   //     delete this.submissionForm[key]
          //   //   }
          //   // } else {
          //   //   if (!this.submissionForm[key] && this.submissionForm[key] !== 0) {
          //   //     delete this.submissionForm[key]
          //   //   }
          //   // }
          // }
          this.submitData = {...this.submissionForm, ...this.submitData}

        }
        this.submitData.checkCase = 10
        this.submitData.dataList = this.zhubianData && this.zhubianData.dataList
        this.submitData.caseIds = this.curCaseId[0]
        this.submitData.taskType = this.taskType
        this.submitData.materialIdList = Array.from(new Set([...this.flielist.filter(item => item.materialId).map(item => item.materialId), ...this.materialIdList]))
        this.submitData.userId = this.$store.getters.userId
        // this.submitData.docTitle = this.submitData.docTitle&&this.submitData.docTitle.replace(/(.*)(通知书|通知)$/, ($, $1, $2)=>{
        //   return $1
        // })
        if (this.submitData.csitemOne) { // radio单选
          this.submitData.csitemList = [this.submitData.csitemOne]
        }
        this.submitData.csitemList&&this.submitData.csitemList.length && (this.submitData.csitemList = this.submitData.csitemList.map(item=>({csitem: item})))
        this.arrayToString(['bushixy', 'szsc', 'fucha'])
        delete this.submitData.status
        submitOffical(this.$commonUtils.cleanNullAttr(this.submitData)).then(res => {
          // this.cancel()
          // this.$emit('updateData')
          if (res.messageType == -6) {
            this.$confirm(res.message,
              "提示",
              {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
              }
            ).then(() => {
              delete this.submitData.checkCase
              submitOffical(this.$commonUtils.cleanNullAttr(this.submitData)).then(res => {
                this.cancel()
                this.$emit('updateData')
              })
            })
            return
          }
          this.cancel()
          this.$emit('updateData')
        })
      },
      submit(e) {
        if (this.taskType == 4) {
          if (this.submissionType == 'create') {
            this.submitOffical()
          } else {
            this.submitOfficalModify()
          }
        } else {
          if (!this.submitData.materialTypeId) {
            this.$message.error('请选择文件/事件类型')
            return
          }
          delete this.submitData.lawCaseList
          if (this.$refs.uploadFile.uploadFiles.filter(item => item.raw) && this.$refs.uploadFile.uploadFiles.filter(item => item.raw).length) {
            this.uploadFileData.materialTypeId = this.submitData.materialTypeId
            this.$refs.uploadFile.submit()
          } else {
            if (this.submissionType == 'create') {
              this.submitOffical()
            } else {
              this.submitOfficalModify()
            }

          }
        }

      },
      handleAudit(status){
        console.log(status,'状态');

        const params = {
          submitStatus:this.submitStatus,
          insId: this.submitData.patInsId,
          result:(status || status === 0) ? status : undefined
        }
        console.log(params,'参数');

        patentReviewUnify(params).then((res)=>{
          if (res.success) {
            this.cancel()
            this.$emit('updateData')
          }
        })
      },
      handleReject(){
        this.rejectVisible = true
      },
      confirmReject(){
        this.$refs['rejectForm'].validate((valid) => {
          if (valid) {
            const params = {
              submitStatus:this.submitStatus,
              insId: this.submitData.patInsId,
              result:0,
              ...this.rejectInfo
            }
            patentReviewUnify(params).then((res)=>{
              if (res.success) {
                this.rejectVisible = false
                this.cancel()
                this.$emit('updateData')
              }
            })
          } else {
            return false;
          }
        });
      }
    },
    watch: {
      'submissionForm.patentCaseApplicationList'(n) {
        this.hasZw = true
        if (n && n.length) {
          if (n.find(i => i.iszw)) {
            this.hasZw = false
          } else {
            this.hasZw = true
          }
        }
      },
      tuiType(n) {
        this.submitData.tuiType = n || 0;
        n == 2 && (!this.submitData.tuifeeList || !this.submitData.tuifeeList[0]) && (
          this.$set(this.submitData, 'tuifeeList', [{}])
        )
      },
      buzhengReasonNum(n){
        this.changeBuzhengReason(n)
      },
      buzhengReason(n) {
        this.changeBuzhengReason(n)
      },
      'submissionForm.patentPriorityClaimList'(n) {
        this.hasPatentPriority = false
        if (n && n.length) {
          this.hasPatentPriority = true
          // let dateList = n.map(i => i.priorityAppDate)
          // this.$set(this.submissionForm, 'priorityAppDate', dateList.sort((a, b) => {
          //   return new Date(a.replace(/-/g, "\/")) - new Date(b.replace(/-/g, "\/"))
          // })[0] || '')
          // this.submissionForm.priorityAppDate = dateList.sort((a, b) => {
          //   return new Date(a.replace(/-/g, "\/")) - new Date(b.replace(/-/g, "\/"))
          // })[0] || ''
        } else {
          // this.submissionForm.priorityAppDate = ''
          // this.$set(this.submissionForm, 'priorityAppDate', '')
        }
      },
      'submitData.documentNo': {
        handler(n) {
          this.ZbCheck = n ? 1 : 0
        },
        immediate: true
      },
      'submissionForm.tstss': {
        handler(n) {
          this.changeProperty(n, 'tstss')
        },
        immediate: true

      },
      'submissionForm.das': {
        handler(n) {
          this.changeProperty(n, 'das')
        },
        immediate: true
      },
      'submitData.wxzjList'(n) {
        if (n && n.length) {
          n.forEach((row, index) => {
            row.no = index + 1
          })
        }
      },
      reportMatter: {
        handler(n, o) {
          ['补正', '复审无效补正'].includes(n) && (this.queryBzdefineList());
          if (['普通新申请', 'PCT国家阶段', 'PCT国际申请'].includes(this.submissionForm.caseType) && !this.submitData.bzperson) {
            ['复审无效补正', '复审无效意见陈述','复审无效意见陈述-答受通','复审无效意见陈述-答转文','复审无效意见陈述-口审回执','复审无效意见陈述-代理词'].includes(n) && (this.submitData.bzperson = 1)
          } else if (this.submissionForm.caseType == '无效' && !this.submitData.bzperson) {
            ['复审无效补正', '复审无效意见陈述','复审无效意见陈述-答受通','复审无效意见陈述-答转文','复审无效意见陈述-口审回执','复审无效意见陈述-代理词'].includes(n) && (this.submissionForm.disableWtr == 1 ? this.submitData.bzperson = 2 : this.submissionForm.disableWtr == 2 ? this.submitData.bzperson = 3 : '')
          }
          if (n == '提交评价报告' && !this.submitData.paType) {
            this.$set(this.submitData, 'paType', 3);
            this.submitData.paType = this.submissionForm.patentType == 1297 ? 1 : this.submissionForm.patentType == 1298 ? 2 : 3;
          }
          if (['复审请求', '复审无效意见陈述','复审无效意见陈述-答受通','复审无效意见陈述-答转文','复审无效意见陈述-口审回执','复审无效意见陈述-代理词'].includes(n)) {
            this.submitData.wxchenshu ? '' : this.$set(this.submitData, 'wxchenshu', '请详见意见陈述书附页。');
          }
          n == 'PCT国际新申请' && (this.submitData.submitMode = 'CEPCT手动')
          n == '更正错误' && this.querycustSelectClass('1155')
          n == 'PPH请求' && this.queryCountry()
          n == '意见陈述（退费）' && this.queryChargeItemList()
          n == '提交评价报告' && !this.submitData.invName && (this.submitData.invName = this.submissionForm.caseCnName)
          // this.queryLastDoc(n)
          if(n !== '主动修改'){
            this.changeReportMatter(n)
          }else{
            this.submitData.mdType&&this.changeReportMatter(this.submitData.mdType)
          }


        },
        // immediate:true
      },
    }
  };
</script>

<style lang="scss" scoped>
  .el-form {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    padding: 20px;
    margin: 0 20px;
    max-height: 600px;
    overflow-y: auto;

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
          /*max-width: 100%;*/
          /*overflow-x: auto;*/
          /*overflow-y: hidden;*/
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

    /*.el-col:nth-last-child(1) {*/
    /*  .el-form-item {*/
    /*    border: 1px solid #ebeef5;*/
    /*  }*/
    /*}*/
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

  .el-table {
    /deep/ th {
      padding: 5px 0
    }

    /deep/ td {
      padding: 0;
    }

    .el-select {
      width: 90%;
    }

    .el-input__inner {
      height: 28px;
    }

    .el-input__icon {
      line-height: 28px;
    }

    .el-input, .el-textarea {
      width: 80% !important;
      margin-left: 10px;
    }
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

  .title {
    width: 100%;
    display: flex;
    justify-content: left;
    font-family: 'Arial Normal', 'Arial';
    color: #409EFF;
    font-weight: 400;
    height: 50px;
    line-height: 60px;
    /*padding-left: 50px;*/
  }

  > > > .el-form-item__label {
    flex-shrink: 0;
  }

  .single {
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .bg-hover {
    &:hover {
      background-color: #F5F7FA;
    }
  }

  .new-apply-sub {
    .submission {
      margin: 0;
      padding-left: 10px;
    }

    .el-form {
      /*display: flex;*/

      div {
        width: 100%;
        /*height: 100%;*/
      }

      .el-row {
        min-height: 41px;
        display: flex;
        width: 100%;
        align-items: stretch;

        .el-col-6 {
          width: 25%;
        }

        .el-col-12 {
          width: 50%;
        }

        .el-col {
          /*height: 100%;*/
          .el-form-item {
            height: 100%;

            .el-input {
              width: 80%;
            }
          }
        }
      }
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

  .buzheng {
    > > > .el-table {
      width: auto;
      margin: 10px 0;

      .el-input {
        width: 200px;
      }

      .el-select, .el-input {
        height: 30px;
        line-height: 30px;

        .el-input__icon {
          height: 30px;
          line-height: 30px;
        }

        .el-input__inner {
          height: 30px;
          line-height: 30px;
        }
      }

      .td, .cell {
        text-align: center;
        min-height: 40px;
        box-sizing: border-box;
        padding: 5px 0;
      }


      tr:nth-of-type(1) {
        th {
          padding: 0;
          height: 30px;
          background: rgba(242, 242, 242, 1);
        }
      }
    }

    > > > .sig-table {
      .el-select {
        width: 90%;
      }

      .el-input__inner {
        height: 28px;
      }

      .el-input__icon {
        line-height: 28px;
      }

      .el-input, .el-textarea {
        width: 80% !important;
        margin-left: 10px;
      }
    }
  }

  > > > .checklabel {
    display: flex;
    min-height: 40px;
    justify-content: flex-start;
    align-items: center;

    /*.el-checkbox__label {*/
    /*  width: 100%;*/
    /*  display: flex;*/
    /*  align-items: center;*/
    /*  flex-wrap: wrap;*/
    /*}*/
  }
  >>>.el-checkbox-group {
    padding-top: 10px;
  }
  >>>.el-checkbox {
    display: flex;
    align-items: center;
  }
  >>>.el-checkbox__input{
    display: flex;
    align-items: center;
  }
  >>>.el-checkbox__label {
    flex: 1;
    display: flex;
    align-items: center;
    flex-wrap: wrap
  }

  .full-height {
    height: 100%;
    display: flex;

    .el-form-item__label {
      height: 100%;
    }
  }

  .full-label {
    .el-checkbox__label {
      width: 100%;
    }
  }

  .el-checkbox {
    margin-bottom: 10px;
  }

  .short-label {
    > > > .el-form-item__label {
      width: 100px !important;
    }
  }

  .checked {
    color: #409EFF;
  }

  .spanFull {
    span {
      display: block;
    }
  }

  .oee {
    padding-left: 20px;
    margin-bottom: 10px;

    &:first-child {
      border-top: none;
    }
  }

  .border-line {
    border-top: 1px solid #f5f5f5;
  }
  .radio-flex {
    >>>.el-radio-group {
      display: flex;
      flex-direction: column;
      .el-radio{
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-bottom: 10px;
      }
      .el-radio__label {
        display: flex;
        flex: 1;
        align-items: center;
        flex-wrap: wrap;
      }
    }
  }
  >>>.rejectDialog{
     .el-dialog__body{
      padding:0
    }
  }
  .required-asterisk{ color:#F56C6C; margin-right:4px; }

  >>>.noBottom {
    .el-checkbox {
      margin-bottom: 0 !important;
    }
  }
</style>
