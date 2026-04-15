<template>
  <div>
    <el-form v-if="caseDetailFoemData.usAgency" label-width="130px">
      <el-row>
        <el-form-item label="案件类型">
          {{caseDetailFoemData.caseType}}
        </el-form-item>
        <el-form-item label="撤回案件类型"
                      v-if="caseDetailFoemData.caseType==='撤回商标申请'||caseDetailFoemData.caseType==='撤回商标评审'">
          {{caseDetailFoemData.changeType}}
        </el-form-item>
      </el-row>
      <el-row>
        <el-col>
          <div class="grid-content bg-purple">案件详情</div>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="案件名称:" class="postInfo-container-item">
          {{caseDetailFoemData.caseName}}
        </el-form-item>
        <el-form-item label="案件文号:" class="postInfo-container-item">
          {{caseDetailFoemData.agentNum}}
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="案件备注:" class="postInfo-container-item">
          {{caseDetailFoemData.remarks}}
        </el-form-item>
      </el-row>
      <template v-if="['内-外', '外-外'].includes(caseDetailFoemData.appFromto)">
        <el-row class="fullRow">
          <el-col :span="24">
            <el-form-item label="合作所评分:" class="postInfo-container-item">
              {{caseDetailFoemData.score}}分
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="fullRow">
          <el-col :span="24">
            <el-form-item label="合作所评价:" class="postInfo-container-item">
              {{caseDetailFoemData.evaluate}}
            </el-form-item>
          </el-col>
        </el-row>
      </template>
      <el-row>
        <el-col>
          <div class="grid-content bg-purple">客户信息</div>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="客户名称">
          {{caseDetailFoemData.custName}}
          <div class="" style="display: inline-block;color: #409EFF;cursor: pointer;">
            <span @click="customerView">查看</span>
          </div>
        </el-form-item>
        <el-form-item label="客户文号">
          {{caseDetailFoemData.custRefno}}
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="客户联系人">
          {{caseDetailFoemData.custContactName}}
        </el-form-item>
        <el-form-item label="信函地址">
          {{caseDetailFoemData.letterAddrName}}
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="账单联系人">
          {{caseDetailFoemData.billCustContactName}}
        </el-form-item>
        <el-form-item label="账单地址">
          {{caseDetailFoemData.billAddrName}}
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="抄送人">
          {{caseDetailFoemData.trademarkCaseCustContacts.map(item=>transformation(customerContacts,item,'custContactId','name')).join(',')}}
        </el-form-item>
        <el-form-item label="折扣率">
          {{caseDetailFoemData.discount}}
        </el-form-item>
      </el-row>
    </el-form>
    <el-form v-else label-width="130px">
      <el-row>
        <el-form-item label="案件类型">
          {{caseDetailFoemData.caseType}}
        </el-form-item>
        <el-form-item label="撤回案件类型"
                      v-if="caseDetailFoemData.caseType==='撤回商标申请'||caseDetailFoemData.caseType==='撤回商标评审'">
          {{caseDetailFoemData.changeType}}
        </el-form-item>
      </el-row>
      <el-row>
        <el-col>
          <div class="grid-content bg-purple">案件详情</div>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="申请方向">
          {{caseDetailFoemData.appFromto}}
        </el-form-item>
      </el-row>
      <el-row class="">
        <el-form-item label="标签">
          {{formatCaseTagPath(caseDetailFoemData.caseTagPathList)}}
        </el-form-item>
        <el-form-item label="合同编号">
          {{caseDetailFoemData.contractNumber}}
        </el-form-item>
      </el-row>
      <el-row class="">
        <el-form-item label="案件文号">
          {{caseDetailFoemData.agentNum}}
        </el-form-item>
        <el-form-item label="机密案件">
          {{caseDetailFoemData.ifSec ? '是' : '否'}}
        </el-form-item>
      </el-row>
      <template v-if="caseDetailFoemData.caseType==='许可备案'">
        <el-row>
          <el-form-item class="postInfo-container-item" label="是否再许可">
            {{caseDetailFoemData.relicensing}}
          </el-form-item>
          <el-form-item v-if="caseDetailFoemData.relicensing=='是'" class="postInfo-container-item" label="许可原备案号">
            {{caseDetailFoemData.parentDocNumber}}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item class="postInfo-container-item" label="许可类型">
            {{caseDetailFoemData.licenseType}}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item class="postInfo-container-item" label="再许可授权书" v-if="caseDetailFoemData.relicensing=='是'">
            <p v-for="item in getAddressAndName('1041')" :key="item.address">
              <a style="color: #409EFF" target="_blank" :href="`ipdoc${item.address}`">{{item.name}}</a>
            </p>
          </el-form-item>
          <el-form-item class="postInfo-container-item" label="许可使用合同生效日期">
            {{caseDetailFoemData.permitEffectiveDate}}
          </el-form-item>

          <el-form-item class="postInfo-container-item" label="许可使用合同终止日期">
            {{caseDetailFoemData.permitInvalidDate}}
          </el-form-item>
        </el-row>
      </template>
      <!-- <el-row v-if="caseDetailFoemData.caseTypeId==48||caseDetailFoemData.caseTypeId==165">
        <el-form-item label="撤回案件类型">
          {{caseDetailFoemData.changeType}}
        </el-form-item>
      </el-row> -->
      <el-row>
        <el-form-item label="申请方式">
          {{caseDetailFoemData.submitType}}
        </el-form-item>
        <el-form-item label="代理机构">
          {{caseDetailFoemData.whdAgencyName}}
        </el-form-item>
        <el-form-item label="是否延期：" v-if="caseDetailFoemData.caseType==='国际注册驳回复审'">
          <span v-if="caseDetailFoemData.delay==false">否</span>
          <span v-if="caseDetailFoemData.delay">是</span>
        </el-form-item>

      </el-row>


      <template v-if="caseDetailFoemData.caseType==='变更注册申请代理机构'">
        <el-row>
          <el-form-item label="是否填写变更后代理机构名称">
            <span v-if="caseDetailFoemData.isPreChangeAgencyName==1">是</span>
            <span v-if="caseDetailFoemData.isPreChangeAgencyName==0">否</span>
          </el-form-item>
          <el-form-item label="变更后代理机构名称" v-if="caseDetailFoemData.isPreChangeAgencyName==1">
            {{caseDetailFoemData.preChangeAgencyName}}
          </el-form-item>
        </el-row>
      </template>
      <template v-if="caseDetailFoemData.caseType==='更正商标申请事项'">

        <el-row>
<!--          <el-form-item label="是否需重新制发证书文件">-->
<!--            {{caseDetailFoemData.isResend}}-->
<!--          </el-form-item>-->
          <el-row class="fullRow" v-if="caseDetailFoemData.submitType=='线下申请'">
            <el-form-item label="更正事项:">
              {{caseDetailFoemData.correction}}
            </el-form-item>
          </el-row>
        </el-row>
        <el-row>

          <el-form-item label="更正前信息">
            {{caseDetailFoemData.beforeChangeMessage}}
          </el-form-item>
          <el-form-item label="更正后信息">
            {{caseDetailFoemData.afterChangeMessage}}
          </el-form-item>
        </el-row>

      </template>


      <!--      </el-row>-->

      <el-row>
        <el-form-item label="他所代交">
          <span v-if="caseDetailFoemData.otherAgency==='0'">否</span>
          <span v-if="caseDetailFoemData.otherAgency==='1'">是</span>
        </el-form-item>
        <el-form-item label="代交所名称" v-if="caseDetailFoemData.otherAgency==='1'">
          {{caseDetailFoemData.replaceAgencyName}}
        </el-form-item>
      </el-row>
      <el-row v-if="caseDetailFoemData.caseType==='出具商标注册证明'">
        <el-form-item label="申请补正理由">
          {{caseDetailFoemData.reason}}
        </el-form-item>
      </el-row>
      <el-row v-if="supplementList.includes(caseDetailFoemData.caseType)">
        <el-form-item label="之后是否交补充材料">
          {{ caseDetailFoemData.supplement?'是':'否' }}
        </el-form-item>
        <el-form-item class="postInfo-container-item" label="是否分割:">
          <span v-if="caseDetailFoemData.isDivision==1">是</span>
          <span v-else>否</span>

        </el-form-item>
        <el-form-item class="postInfo-container-item" label="分割申请书:">
          <p v-for="item in getAddressAndName('301535')" :key="item.address">
            <a style="color: #409EFF" target="_blank" :href="`ipdoc${item.address}`">{{item.name}}</a>
          </p>
        </el-form-item>

      </el-row>
      <template v-if="['国际注册驳回复审','注册驳回复审'].includes(caseDetailFoemData.caseType)">
        <el-row>
          <el-form-item class="postInfo-container-item" label="阐述事实与理由:">
            {{caseDetailFoemData.applicationMarks}}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item class="postInfo-container-item" label="事实与理由:">
            <p v-for="item in getAddressAndName('327')" :key="item.address">
              <a style="color: #409EFF" target="_blank" :href="`ipdoc${item.address}`">{{item.name}}</a>
            </p>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item class="postInfo-container-item" label="证据目录:">
            <p v-for="item in getAddressAndName('326')" :key="item.address">
              <a style="color: #409EFF" target="_blank" :href="`ipdoc${item.address}`">{{item.name}}</a>
            </p>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item class="postInfo-container-item" label="证据内容:">
            <p v-for="item in getAddressAndName('300012')" :key="item.address">
              <a style="color: #409EFF" target="_blank" :href="`ipdoc${item.address}`">{{item.name}}</a>
            </p>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item class="postInfo-container-item" label="送达证据:">
            <p v-for="item in getAddressAndName('300013')" :key="item.address">
              <a style="color: #409EFF" target="_blank" :href="`ipdoc${item.address}`">{{item.name}}</a>
            </p>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item class="postInfo-container-item" label="评审网申国际商标需上传材料:">
            <p v-for="item in getAddressAndName('301600')" :key="item.address">
              <a style="color: #409EFF" target="_blank" :href="`ipdoc${item.address}`">{{item.name}}</a>
            </p>
          </el-form-item>
        </el-row>
      </template>
      <template v-if="caseDetailFoemData.caseType==='商标注销'">
        <el-row>
          <el-form-item class="postInfo-container-item" label="注销类型:">
            {{caseDetailFoemData.changeType}}
          </el-form-item>
          <el-form-item class="postInfo-container-item" label="变更证明文件类型:" v-if="caseDetailFoemData.isDlbz=='是'">
            {{caseDetailFoemData.appCertFileIsCn}}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item class="postInfo-container-item" label="未交回原注册证原因:">
            {{caseDetailFoemData.reason}}
          </el-form-item>
          <el-form-item class="postInfo-container-item" label="申请人名义是否发生变更:">
            {{caseDetailFoemData.isDlbz}}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item v-if="caseDetailFoemData.appCertFileIsCn=='是'" class="postInfo-container-item"
                        label="变更证明文件（中文）：">
            <p v-for="item in getAddressAndName('1032')" :key="item.address">
              <a style="color: #409EFF" target="_blank" :href="`ipdoc${item.address}`">{{item.name}}</a>
            </p>
          </el-form-item>
          <el-form-item v-if="caseDetailFoemData.appCertFileIsCn=='否'" class="postInfo-container-item"
                        label="变更证明文件原件彩色扫描件：">
            <p v-for="item in getAddressAndName('1033')" :key="item.address">
              <a style="color: #409EFF" target="_blank" :href="`ipdoc${item.address}`">{{item.name}}</a>
            </p>
          </el-form-item>
        </el-row>
      </template>

      <el-row class="" v-if="caseDetailFoemData.caseType==='撤回商标评审'">
        <el-form-item class="postInfo-container-item" label="原申请日期:">
          {{caseDetailFoemData.reviewCaseAppDate}}
        </el-form-item>
        <el-form-item class="postInfo-container-item" label="原申请编号:">
          {{caseDetailFoemData.parentAppNumber}}
        </el-form-item>
      </el-row>
      <el-row class="fullRow" v-if="caseDetailFoemData.caseType==='补发商标注册证'||caseDetailFoemData.caseType==='补发商标变转续证明'">
        <el-form-item class="postInfo-container-item" label="申请补证理由:">
          {{caseDetailFoemData.reason}}
        </el-form-item>
      </el-row>
      <el-row class="fullRow" v-if="caseDetailFoemData.caseType==='补发商标变转续证明'">
        <el-form-item class="postInfo-container-item" label="证明类型:">
          {{caseDetailFoemData.reissueType}}
        </el-form-item>
      </el-row>
      <template v-if="caseDetailFoemData.caseType==='补发商标变转续证明'">
        <el-row class="" v-if="caseDetailFoemData.reissueType=='变更证明'">
          <el-form-item class="postInfo-container-item" label="变更前注册人名义/地址:">
            {{caseDetailFoemData.transferorCnName}}
          </el-form-item>
          <el-form-item class="postInfo-container-item" label="变更后注册人名义/地址:">
            {{caseDetailFoemData.transferorEnName}}
          </el-form-item>
        </el-row>
        <el-row class="" v-if="caseDetailFoemData.reissueType=='转让证明'">
          <el-form-item class="postInfo-container-item" label="转让人名称:">
            {{caseDetailFoemData.transferorCnAdress}}
          </el-form-item>
          <el-form-item class="postInfo-container-item" label="受让人名称:">
            {{caseDetailFoemData.transferorEnAdress}}
          </el-form-item>
        </el-row>
      </template>
      <template v-if="caseDetailFoemData.caseType==='撤回商标申请'">
        <el-row class="">
          <el-form-item class="postInfo-container-item" label="撤回理由:">
            {{caseDetailFoemData.withdraw}}
          </el-form-item>
          <el-form-item class="postInfo-container-item" v-if="caseType_str !== '撤回商标异议' && caseDetailFoemData.changeType !== '转让/移转商标'" :label="caseType_str == '撤回撤销三年不使用注册商标'?'原撤销申请号:' : '原申请号:'">
            {{caseDetailFoemData.parentAppNumber}}
          </el-form-item>
          <el-form-item class="postInfo-container-item" v-if="caseType_str !== '撤回商标异议' && caseDetailFoemData.changeType === '转让/移转商标'" label="原转让申请号">
            {{caseDetailFoemData.parentAppNumber}}
          </el-form-item>
        </el-row>
        <el-row class="">
          <el-form-item class="postInfo-container-item" label="撤回理由描述:">
            {{caseDetailFoemData.reason}}
          </el-form-item>
          <el-form-item class="postInfo-container-item" label="原撤销申请日期:" v-if="caseType_str == '撤回撤销三年不使用注册商标'">
            {{caseDetailFoemData.parentAppDate}}
          </el-form-item>
        </el-row>
        <el-row class="">
          <el-form-item class="postInfo-container-item" label="申请人名称是否已变更:">
            {{caseDetailFoemData.isDlbz}}
          </el-form-item>
          <el-form-item v-if="caseDetailFoemData.caseType==='撤回商标申请' && caseDetailFoemData.changeType==='转让/移转商标'"
                        label="转让人中文名称">
            {{caseDetailFoemData.transferorCnName}}
          </el-form-item>
          <el-form-item v-if="caseDetailFoemData.caseType==='撤回商标申请'&&caseDetailFoemData.isDlbz=='是'"
                        class="postInfo-container-item" label="变更证明文件:">
            <p v-for="item in getAddressAndName('1032')" :key="item.address">
              <a style="color: #409EFF" target="_blank" :href="`ipdoc${item.address}`">{{item.name}}</a>
            </p>
          </el-form-item>
        </el-row>
      </template>
      <el-row class="fullRow" v-if="['异议', '无效宣告申请', '不予注册复审'].includes(caseDetailFoemData.caseType)">
        <el-form-item label="请求驰名商标保护:">
          {{caseDetailFoemData.chiming}}
        </el-form-item>
        <el-form-item v-if="['无效宣告申请'].includes(caseDetailFoemData.caseType)" label="仅涉及绝对理由:">
          {{caseDetailFoemData.absoluteReason ? '是' : '否'}}
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="申请书标注:" v-if="!['国际注册驳回复审','注册驳回复审'].includes(caseDetailFoemData.caseType)">
          {{caseDetailFoemData.applicationMarks}}
        </el-form-item>
      </el-row>
      <el-row v-if="['异议', '异议答辩', '无效宣告申请', '无效宣告答辩', '国际注册驳回复审', '注册驳回复审', '不予注册复审', '撤销商标复审', '无效宣告复审', '撤销复审答辩', '撤三答辩（提供使用证明）', '撤销三年停止使用申请'].includes(caseDetailFoemData.caseType)">
        <el-form-item class="postInfo-container-item" label="之后是否交补充材料:">
          {{caseDetailFoemData.supplement ? '是' : '否'}}
        </el-form-item>
      </el-row>
      <el-row v-if="caseDetailFoemData.caseType === '提供使用声明/证据（境外）'">
        <el-form-item label="使用声明/证据类型:">
          {{caseDetailFoemData.evidenceTypeStr}}
        </el-form-item>
        <el-form-item label="是否提交使用声明/证据:">
          {{caseDetailFoemData.ifEvidenceStr}}
        </el-form-item>
      </el-row>
      <el-row v-if="caseDetailFoemData.caseType === '提供使用声明/证据（境外）'">
        <el-form-item label="使用声明/证据说明:">
          {{caseDetailFoemData.statementOfEvidence}}
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="案件备注:">
          {{caseDetailFoemData.remarks}}
        </el-form-item>
      </el-row>
      <template v-if="['内-外', '外-外'].includes(caseDetailFoemData.appFromto)">
        <el-row class="fullRow">
          <el-col :span="24">
            <el-form-item label="合作所评分:" class="postInfo-container-item">
              {{caseDetailFoemData.score}}分
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="fullRow">
          <el-col :span="24">
            <el-form-item label="合作所评价:" class="postInfo-container-item">
              {{caseDetailFoemData.evaluate}}
            </el-form-item>
          </el-col>
        </el-row>
      </template>
      <el-row class="fullRow" v-if="['撤销三年停止使用申请'].includes(caseDetailFoemData.caseType)">
        <el-form-item label="撤销理由:">
          {{caseDetailFoemData.reason}}
        </el-form-item>
      </el-row>
      <el-row class="fullRow" v-if="['撤销三年停止使用申请'].includes(caseDetailFoemData.caseType)">
        <el-form-item label="理由:">
          <p v-for="item in getAddressAndName('327')" :key="item.address">
            <a style="color: #409EFF" target="_blank" :href="`ipdoc${item.address}`">{{item.name}}</a>
          </p>
        </el-form-item>
        <el-form-item label="证据材料:">
          <p v-for="item in getAddressAndName('322')" :key="item.address">
            <a style="color: #409EFF" target="_blank" :href="`ipdoc${item.address}`">{{item.name}}</a>
          </p>
        </el-form-item>
      </el-row>
      <el-row class="fullRow" v-if="['撤销三年停止使用申请'].includes(caseDetailFoemData.caseType)">
        <el-form-item label="材料目录/证据目录:">
          <p v-for="item in getAddressAndName('326')" :key="item.address">
            <a style="color: #409EFF" target="_blank" :href="`ipdoc${item.address}`">{{item.name}}</a>
          </p>
        </el-form-item>
        <el-form-item label="相关说明文件:">
          <p v-for="item in getAddressAndName('1020')" :key="item.address">
            <a style="color: #409EFF" target="_blank" :href="`ipdoc${item.address}`">{{item.name}}</a>
          </p>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="案件等级">
          {{caseDetailFoemData.caseLevelStr}}
        </el-form-item>
        <el-form-item label="转让/移转" v-if="caseDetailFoemData.caseType === '转让/移转'">
          {{caseDetailFoemData.transfer}}
        </el-form-item>
      </el-row>
      <template v-if="caseDetailFoemData.caseType === '无效宣告申请'">
        <el-row>
          <el-form-item label="法律条款:">
            {{caseDetailFoemData.lawList + ''}}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="事实理由:">
            <p v-for="item in getAddressAndName('327')" :key="item.address">
              <a style="color: #409EFF" target="_blank" :href="`ipdoc${item.address}`">{{item.name}}</a>
            </p>
          </el-form-item>
          <el-form-item label="证据目录:">
            <p v-for="item in getAddressAndName('326')" :key="item.address">
              <a style="color: #409EFF" target="_blank" :href="`ipdoc${item.address}`">{{item.name}}</a>
            </p>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="证据内容:">
            <p v-for="item in getAddressAndName('300012')" :key="item.address">
              <a style="color: #409EFF" target="_blank" :href="`ipdoc${item.address}`">{{item.name}}</a>
            </p>
          </el-form-item>
          <el-form-item label="有关说明文件:">
            <p v-for="item in getAddressAndName('1020')" :key="item.address">
              <a style="color: #409EFF" target="_blank" :href="`ipdoc${item.address}`">{{item.name}}</a>
            </p>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="同意通讯地址延及本案后续程序:">{{caseDetailFoemData.empowerAddrCase ? '是' : '否'}}</el-form-item>
          <el-form-item label="正副本是否一致:">{{caseDetailFoemData.justNegativeAgre ? '是' : '否'}}</el-form-item>
        </el-row>
        <el-row v-if="!caseDetailFoemData.justNegativeAgre">
          <el-form-item label="涉密证据材料:">
            <p v-for="item in getAddressAndName('301677')" :key="item.address">
              <a style="color: #409EFF" target="_blank" :href="`ipdoc${item.address}`">{{item.name}}</a>
            </p>
          </el-form-item>
        </el-row>
      </template>
      <!--      <template v-if="caseDetailFoemData.caseType==='变名变址'">-->
      <!--        <el-row>-->
      <!--          <el-form-item label="变更类型">-->
      <!--            <span v-if="caseDetailFoemData.changeType==='变更名义'">变名</span>-->
      <!--            <span v-if="caseDetailFoemData.changeType==='变更地址'">变址</span>-->
      <!--            <span v-if="caseDetailFoemData.changeType==='变更名义/地址'">变名变址</span>-->
      <!--          </el-form-item>-->
      <!--        </el-row>-->
      <!--        <el-row>-->
      <!--          <el-form-item label="变更前名称（中文）">-->
      <!--            {{caseDetailFoemData.preChangeCnName}}-->
      <!--          </el-form-item>-->
      <!--          <el-form-item label="变更前名称（英文）">-->
      <!--            {{caseDetailFoemData.preChangeEnName}}-->
      <!--          </el-form-item>-->
      <!--        </el-row>-->
      <!--        <el-row>-->
      <!--          <el-form-item label="变更前地址（中文）:" class="postInfo-container-item" v-if="caseDetailFoemData.changeType!='变更名义'">-->
      <!--            {{caseDetailFoemData.preChangeCnAdress}}-->
      <!--          </el-form-item>-->
      <!--          <el-form-item label="变更前地址（英文）:" class="postInfo-container-item" v-if="caseDetailFoemData.changeType!='变更名义'">-->
      <!--            {{caseDetailFoemData.preChangeEnAdress}}-->
      <!--          </el-form-item>-->
      <!--        </el-row>-->
      <!--        <el-row>-->
      <!--          <el-form-item label="变更证明文件是否为中文（网申）">-->
      <!--            {{caseDetailFoemData.appCertFileIsCn}}-->
      <!--          </el-form-item>-->

      <!--        </el-row>-->
      <!--        <el-row>-->
      <!--        <el-form-item label="变更证明文件（英文）" v-if="caseDetailFoemData.appCertFileIsCn==='否'">-->
      <!--          <p v-for="item in getAddressAndName('1033')" :key="item.address">-->
      <!--            <a style="color: #409EFF" target="_blank" :href="`ipdoc${item.address}`">{{item.name}}</a>-->
      <!--          </p>-->
      <!--        </el-form-item>-->
      <!--          <el-form-item label="变更证明文件（中文）">-->
      <!--            <p v-for="item in getAddressAndName('1032')" :key="item.address">-->
      <!--              <a style="color: #409EFF" target="_blank" :href="`ipdoc${item.address}`">{{item.name}}</a>-->
      <!--            </p>-->
      <!--          </el-form-item>-->
      <!--        </el-row>-->
      <!--        <el-row v-if="caseDetailFoemData.joinApps">-->
      <!--          <el-form-item label="变更前共同申请人:" class="postInfo-container-item">-->
      <!--            <el-table :data="caseDetailFoemData.joinApps.filter(item=>item.type==4)" border current-row-key empty-text="暂无数据" fit highlight-current-row size="mini" style="width: 100%;">-->
      <!--              <el-table-column align="left" label="序号" type="index" width="50" />-->
      <!--              <el-table-column align="left" label="类型" v-if="caseDetailFoemData.caseType === '转让/移转'" width>-->
      <!--                <template slot-scope="scope">-->
      <!--                  <span>{{ scope.row.typeStr }}</span>-->
      <!--                </template>-->
      <!--              </el-table-column>-->
      <!--              <el-table-column align="left" label="中文名称" width>-->
      <!--                <template slot-scope="scope">-->
      <!--                  <span v-if="!scope.row.modifyState">{{ scope.row.nameCn }}</span>-->
      <!--                  <el-input v-if="scope.row.modifyState" type="text" v-model="scope.row.nameCn"></el-input>-->
      <!--                </template>-->
      <!--              </el-table-column>-->
      <!--              <el-table-column align="left" label="英文名称" width>-->
      <!--                <template slot-scope="scope">-->
      <!--                  <span v-if="!scope.row.modifyState">{{ scope.row.nameEn }}</span>-->
      <!--                  <el-input v-if="scope.row.modifyState" type="text" v-model="scope.row.nameEn"></el-input>-->
      <!--                </template>-->
      <!--              </el-table-column>-->
      <!--              <el-table-column align="left" label="证件名称" width>-->
      <!--                <template slot-scope="scope">-->
      <!--                  <span v-if="!scope.row.modifyState">{{ scope.row.cardName }}</span>-->
      <!--                  <el-input v-if="scope.row.modifyState" type="text" v-model="scope.row.cardName"></el-input>-->
      <!--                </template>-->
      <!--              </el-table-column>-->
      <!--              <el-table-column align="left" label="证件号" width>-->
      <!--                <template slot-scope="scope">-->
      <!--                  <span v-if="!scope.row.modifyState">{{ scope.row.cardId }}</span>-->
      <!--                  <el-input v-if="scope.row.modifyState" type="text" v-model="scope.row.cardId"></el-input>-->
      <!--                </template>-->
      <!--              </el-table-column>-->
      <!--              <el-table-column align="left" label="证明文件" width>-->
      <!--                <template slot-scope="scope">-->
      <!--                  <span v-if="!scope.row.modifyState&&(scope.row.materialArray&&scope.row.materialArray.length)">-->
      <!--                    <a target="_blank" :href="`ipdoc${scope.row.materialArray[0].address}`">{{ scope.row.materialArray[0].materialName}}</a></span>-->
      <!--                </template>-->
      <!--              </el-table-column>-->
      <!--            </el-table>-->

      <!--          </el-form-item>-->
      <!--        </el-row>-->
      <!--      </template>-->

      <template v-if="caseDetailFoemData.caseType==='马德里商标转国内注册'">
        <el-row>
          <el-col>
            <div class="grid-content bg-purple">商标申请说明</div>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item class="postInfo-container-item" label="优先权国家:">
            {{caseDetailFoemData.priorityBaseCrty}}
          </el-form-item>
          <el-form-item label="优先权日期:">
            {{caseDetailFoemData.priorityAppDate}}
          </el-form-item>
        </el-row>
        <el-row class="fullRow">
          <el-form-item label="优先权类别:" class="postInfo-container-item">
            {{caseDetailFoemData.priorityClasses}}
          </el-form-item>
        </el-row>
      </template>
      <!--      商标信息-->
      <template>
        <el-row>
          <el-col>
            <div class="grid-content bg-purple">商标信息</div>
          </el-col>
        </el-row>
        <el-row class="" v-if="caseDetailFoemData.caseType==='马德里商标转国内注册'">
          <el-col :span="8">
            <el-form-item class="" prop="gjRegNumber" label="国际注册号:">
              <template>
                {{caseDetailFoemData.gjRegNumber}}
              </template>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item class="" prop="gjRegDate" label="国际注册日期:">
              {{caseDetailFoemData.gjRegDate}}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item class="" label="后期指定日期:">
              {{caseDetailFoemData.hqzdDate}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="" v-if="caseDetailFoemData.caseType==='马德里商标转国内注册'">
          <el-col :span="12">
            <el-form-item class="" prop="interLogoutDate" label="国际注销登记日期:">
              {{caseDetailFoemData.interLogoutDate}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item class="" label="国际注销通知书:">
              <p v-for="item in getAddressAndName('300454')" :key="item.address">
                <a style="color: #409EFF" target="_blank" :href="`ipdoc${item.address}`">{{item.name}}</a>
              </p>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="fullRow" v-if="caseDetailFoemData.caseType=='出具优先权证明文件'">
          <el-form-item class="postInfo-container-item" label="商标号">
            {{caseDetailFoemData.regNumber}}
          </el-form-item>
        </el-row>
        <el-row v-if="[
          '撤销三年停止使用申请',
          '异议',
          '异议答辩',
          '撤三答辩（提供使用证明）',
          '无效宣告复审',
          '撤销商标复审',
          '不予注册复审',
          '无效宣告申请',
          '参加不予注册复审',
          '撤销复审答辩',
          '无效宣告答辩'].includes(caseDetailFoemData.caseType)">
          <el-form-item label="原注册申请日期">
            {{caseDetailFoemData.parentAppDate}}
          </el-form-item>
        </el-row>
        <el-row class="" v-if="caseDetailFoemData.caseType==='国际注册驳回复审'||caseDetailFoemData.caseType==='注册驳回复审'">
          <el-form-item :label="caseDetailFoemData.caseType==='注册驳回复审' ? '原申请号/国际注册号:' : '原商标申请号/国际注册号:'">
            {{caseDetailFoemData.regNumber}}
          </el-form-item>
          <el-form-item v-if="caseDetailFoemData.caseType==='注册驳回复审'" label="原注册申请日期">
            {{caseDetailFoemData.parentAppDate}}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="商标名称">
            {{caseDetailFoemData.tmName}}
          </el-form-item>
          <el-form-item label="商标英文">
            {{caseDetailFoemData.tmNameEn}}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="商标图样">
            <img style="width: 100px" :src="tyimage" alt="">
          </el-form-item>
          <el-form-item label="商标设计说明" v-if="caseDetailFoemData.caseType!='变名变址'">
            {{caseDetailFoemData.tmDesignDeclare}}
          </el-form-item>
        </el-row>
        <template
          v-if="caseDetailFoemData.caseType==='撤销复审答辩'||caseDetailFoemData.caseType === '异议答辩' || caseDetailFoemData.caseType==='无效宣告申请' || caseDetailFoemData.caseType==='无效宣告答辩'">
          <el-row>
            <el-form-item class="postInfo-container-item" label="引证商标名称">
              {{caseDetailFoemData.quoteTm}}
            </el-form-item>
            <el-form-item class="postInfo-container-item" label="引证商标类别">
              {{caseDetailFoemData.quoteTmClass}}
            </el-form-item>
            <el-form-item class="postInfo-container-item" label="引证商标注册号">
              {{caseDetailFoemData.quoteRegNumber}}
            </el-form-item>
          </el-row>
        </template>
        <template
          v-if="caseDetailFoemData.caseType==='撤销复审答辩'||caseDetailFoemData.caseType === '异议答辩' || caseDetailFoemData.caseType==='无效宣告答辩'||caseDetailFoemData.caseType==='国际注册驳回复审'||caseDetailFoemData.caseType==='注册驳回复审'||caseDetailFoemData.caseType==='不予注册复审'||caseDetailFoemData.caseType==='无效宣告复审'||caseDetailFoemData.caseType==='撤销商标复审'||caseDetailFoemData.caseType==='撤三答辩（提供使用证明）'||caseDetailFoemData.caseType==='参加不予注册复审'">
          <el-row v-if="caseDetailFoemData.caseType!='参加不予注册复审'">
            <el-form-item label="引证商标注册号"
                          v-if="caseDetailFoemData.caseType!='撤三答辩（提供使用证明)'&&caseDetailFoemData.caseType!='注册驳回复审'&&caseDetailFoemData.caseType!='国际注册驳回复审'">
              {{caseDetailFoemData.quoteRegNumber}}
            </el-form-item>
            <el-form-item label="申请号"
                          v-if="!['撤三答辩（提供使用证明)','注册驳回复审','不予注册复审','无效宣告复审','撤销商标复审','无效宣告答辩','国际注册驳回复审'].includes(caseDetailFoemData.caseType)">
              {{caseDetailFoemData.appNumber}}
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="官方发文编号">
              {{caseDetailFoemData.tmOfficeNumber}}
            </el-form-item>
            <el-form-item label="官文时限基准日期">
              {{caseDetailFoemData.docDate}}
            </el-form-item>
          </el-row>

        </template>
        <el-row class="fullRow"
                v-if="(['答复临时驳回/审查意见（境外）', '提供使用声明/证据（境外）','马德里商标转国内注册','出具商标注册证明','不予注册复审','商标注册','分割申请','异议','变名变址','转让/移转','续展','删减商品项目','变更注册申请代理机构','更正商标申请事项','注册驳回复审','国际注册驳回复审','无效宣告复审','撤销商标复审','异议答辩','撤三答辩(提供使用证明)','撤销通用名称答辩','参与不予注册复审','无效宣告答辩','撤销复审答辩','撤销三年停止使用申请','撤销成为通用名称注册商标','无效宣告申请','撤回商标评审','行政复议','许可备案','补发商标注册证','补发商标变转续证明','商标注销','撤回商标申请'].includes(caseDetailFoemData.caseType))">
          <el-form-item class="postInfo-container-item" label="递交日期">
            {{caseDetailFoemData.submitDate}}
          </el-form-item>
          <el-form-item class="postInfo-container-item" label="申请日期">
            {{caseDetailFoemData.appDate}}
          </el-form-item>
          <el-form-item class="postInfo-container-item" label="申请号">
            {{caseDetailFoemData.appNumber}}
          </el-form-item>
        </el-row>
        <template v-if="(caseDetailFoemData.caseType ==='马德里商标转国内注册' || caseDetailFoemData.caseType ==='异议' ||
                                caseDetailFoemData.caseType === '异议答辩'|| caseDetailFoemData.caseType === '分割申请'|| caseDetailFoemData.caseType === '不予注册复审'|| trademarkList.includes(caseDetailFoemData.caseType))">
          <el-row>
            <el-form-item label="初审公告号:">
              {{caseDetailFoemData.approvalNo}}
            </el-form-item>
            <el-form-item class="postInfo-container-item" label="初审公告日期:">
              {{caseDetailFoemData.approvalDate}}
            </el-form-item>
            <el-form-item class="postInfo-container-item" label="初审公告期号:">
              {{caseDetailFoemData.approvalNumber}}
            </el-form-item>
          </el-row>
          <el-row v-if="['分割申请'].includes(caseDetailFoemData.caseType)">
            <el-form-item label="原案申请号:">
              {{caseDetailFoemData.parentAppNumber}}
            </el-form-item>
            <el-form-item class="postInfo-container-item" label="原案官方发文编号:">
              {{caseDetailFoemData.parentDocNumber}}
            </el-form-item>
            <el-form-item class="postInfo-container-item" label="原案官方收文日期:">
              {{caseDetailFoemData.docDate}}
            </el-form-item>
          </el-row>
        </template>
        <el-row v-if="caseDetailFoemData.caseType=='行政复议'">
          <el-col :span="24">
            <el-form-item class="postInfo-container-item" label="不予的案件类型:">
              {{caseDetailFoemData.reissueType}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="caseDetailFoemData.caseType=='行政复议'">
          <el-col :span="12">
            <el-form-item class="postInfo-container-item" label="不予发文编号:">
              {{caseDetailFoemData.tmOfficeNumber}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item class="postInfo-container-item" prop="docDate" label="官文时限基准日期:">
              {{caseDetailFoemData.docDate}}
            </el-form-item>
          </el-col>
        </el-row>
        <template v-if="caseDetailFoemData.caseType!='出具优先权证明文件'">
          <el-row v-if="caseDetailFoemData.caseType !='异议'&&
                                caseDetailFoemData.caseType != '异议答辩'&&caseDetailFoemData.caseType!='国际注册驳回复审'&&caseDetailFoemData.caseType!='注册驳回复审'&&caseDetailFoemData.caseType!='不予注册复审'&&caseDetailFoemData.caseType!='撤回商标申请'">
            <!-- <el-form-item label="商标注册号">
              {{caseDetailFoemData.regNumber}}
            </el-form-item> -->
          </el-row>
          <el-row class="fullRow" v-if="caseDetailFoemData.caseType=='撤回商标申请'||caseDetailFoemData.caseType=='撤回商标评审'">
            <el-form-item class="postInfo-container-item" v-if="caseDetailFoemData.changeType === '转让/移转商标'" label="商标申请/注册号">
              {{caseDetailFoemData.regNumber}}
            </el-form-item>
            <el-form-item v-else class="postInfo-container-item" :label="['撤销三年不使用注册商标', '转让/移转商标'].includes(caseDetailFoemData.changeType)?'商标号':'原商标号'">
              {{caseDetailFoemData.regNumber}}
            </el-form-item>
          </el-row>
          <template
            v-if="caseDetailFoemData.caseType!=='异议'&&caseDetailFoemData.caseType !== '异议答辩'&&![62,48].includes(caseDetailFoemData.caseTypeId)">
            <el-row v-if="caseDetailFoemData.caseType === '许可备案提前终止'">
              <el-col :span="12">
                <el-form-item class="postInfo-container-item" label="原商标使用许可备案号">
                  {{caseDetailFoemData.parentDocNumber}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item class="postInfo-container-item" label="提前终止日期">
                  {{caseDetailFoemData.earlyStopDate}}
                </el-form-item>
              </el-col>
            </el-row>

            <el-row v-if="caseDetailFoemData.caseType === '许可备案提前终止'">
              <el-form-item class="postInfo-container-item" label="提前终止理由">
                {{caseDetailFoemData.reason}}

              </el-form-item>
            </el-row>
            <el-row class="fullRow"
                    v-if="!['不予注册复审','异议答辩','注册驳回复审','国际注册驳回复审','出具优先权证明文件','撤回商标申请','撤回商标评审'].includes(caseDetailFoemData.caseType)">
              <el-form-item v-if="caseDetailFoemData.caseType !== '参加不予注册复审'" class="postInfo-container-item"
                            label="注册日期">
                {{caseDetailFoemData.regDate}}
              </el-form-item>
              <el-form-item v-if="caseDetailFoemData.caseType === '参加不予注册复审'" class="postInfo-container-item"
                            label="初审公告号">
                {{caseDetailFoemData.approvalNo}}
              </el-form-item>
              <el-form-item v-else class="postInfo-container-item" label="注册号">
                {{caseDetailFoemData.regNumber}}
              </el-form-item>
            </el-row>
            <el-row
              v-if="!['参加不予注册复审','不予注册复审','商标注销','异议答辩','注册驳回复审','国际注册驳回复审','出具优先权证明文件','撤回商标申请','撤回商标评审'].includes(caseDetailFoemData.caseType)">
              <el-form-item class="postInfo-container-item" label="有效期起始日">
                {{caseDetailFoemData.validStartDate}}
              </el-form-item>
              <el-form-item class="postInfo-container-item" label="有效期截止日">
                {{caseDetailFoemData.validEndDate}}
              </el-form-item>
            </el-row>
          </template>
        </template>
        <el-row v-if="caseDetailFoemData.caseType == '出具优先权证明文件'">
          <el-form-item class="postInfo-container-item" label="申请日">
            {{caseDetailFoemData.appDate}}
          </el-form-item>
          <el-form-item class="postInfo-container-item" label="递交日">
            {{caseDetailFoemData.submitDate}}
          </el-form-item>
          <el-form-item class="postInfo-container-item" label="申请号">
            {{caseDetailFoemData.appNumber}}
          </el-form-item>
        </el-row>
        <el-row class="fullRow">
          <el-form-item label="商标国际分类:" class="postInfo-container-item">
            {{caseDetailFoemData.goodClasses}}
          </el-form-item>
          <el-form-item label="原代理组织:" class="postInfo-container-item"
                        v-if="tmlist.includes(caseDetailFoemData.caseType)">
            {{caseDetailFoemData.respondentAgency}}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item :label="caseDetailFoemData.caseType=='商标注销'?'注销商品服务项目\n(商品/服务项目)':'商品/服务项目'">
            <Goods disabled type="view" :isRevamp="caseDetailFoemData.isRevamp" :appFromto="caseDetailFoemData.appFromto" :trademarkCaseCategoryModifyList="caseDetailFoemData.trademarkCaseCategoryModifyList" :goodsVersionList="goodsVersionList" :caseId="caseDetailFoemData.caseId"
                   :appId='caseDetailFoemData.appId' :goodsListData='caseDetailFoemData.goods'></Goods>

            <!--          <el-table class="table-dl-row" :data="pageGoodsw" border current-row-key empty-text="暂无数据" fit highlight-current-row size="mini">-->
            <!--            <el-table-column align="left" label="商品类别">-->
            <!--              <template slot-scope="scope">-->
            <!--                <span>{{ scope.row.goodClass }}</span>-->
            <!--              </template>-->
            <!--            </el-table-column>-->
            <!--            <el-table-column align="left" label="商品类似群组">-->
            <!--              <template slot-scope="scope">-->
            <!--                <span>{{ scope.row.similarGroup }}</span>-->
            <!--              </template>-->
            <!--            </el-table-column>-->
            <!--            <el-table-column align="left" label="商品代码">-->
            <!--              <template slot-scope="scope">-->

            <!--                <span>{{ scope.row.goodCode }}</span>-->
            <!--              </template>-->
            <!--            </el-table-column>-->
            <!--            <el-table-column align="left" label="商品中文名称">-->
            <!--              <template slot-scope="scope">-->
            <!--                <span>{{ scope.row.goodName }}</span>-->
            <!--              </template>-->
            <!--            </el-table-column>-->
            <!--            <el-table-column align="left" label="商品英文名称">-->
            <!--              <template slot-scope="scope">-->
            <!--                <span>{{ scope.row.goodEnName }}</span>-->
            <!--              </template>-->
            <!--            </el-table-column>-->

            <!--          </el-table>-->
            <!--          <pagination :limit.sync="goodslistPageDataw.pageSize" :page.sync="goodslistPageDataw.pageNo" :total="goodslistPageDataw.total" @pagination="getgoodsListw(caseDetailFoemData.goods)" v-show="goodslistPageDataw.total>0" />-->
          </el-form-item>
        </el-row>
        <el-row class="" v-if="['内-外', '外-外'].includes(caseDetailFoemData.appFromto)">
          <el-form-item label="商品查对文件:" class="postInfo-container-item">
            <check-goods-list :total="checkGoodListTotal" type="view" :goodsListData='caseDetailFoemData.goods' :goodsVersionList="goodsVersionList" @getCheckGoodsList="getCheckGoodsList" :caseId="caseDetailFoemData.caseId" :caseIdArray="[]" :checkGoodList="checkGoodList"></check-goods-list>
          </el-form-item>
        </el-row>
      </template>

      <el-row
        v-if="caseDetailFoemData.caseType === '答复临时驳回/审查意见（境外）' || caseDetailFoemData.caseType=='商标注册' || caseDetailFoemData.caseType=='提供使用声明/证据（境外）'">
        <el-col>
          <div class="grid-content bg-purple">商标申请说明</div>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="种类">
          <span v-if="caseDetailFoemData.tmType==1">一般</span>
          <span v-if="caseDetailFoemData.tmType==2">集体</span>
          <span v-if="caseDetailFoemData.tmType==3">证明</span>
        </el-form-item>
        <el-form-item label="是否三维标志" v-if="caseDetailFoemData.caseType!=='变更注册申请代理机构'">
          <span v-if="caseDetailFoemData.ifSolidTm=='0'">否</span>
          <span v-if="caseDetailFoemData.ifSolidTm=='1'">是</span>
        </el-form-item>
      </el-row>
      <el-row v-if="caseDetailFoemData.tmType=='2'||caseDetailFoemData.tmType=='3'">
        <el-form-item class="postInfo-container-item" label="集体/证明商标使用管理规则:">
          {{caseDetailFoemData.memberRule}}
        </el-form-item>
        <el-form-item label="集体/证明商标使用管理规则(附件):">
          <a v-for="item in getAddressAndName('1005')" style="color: #409EFF" target="_blank"
             :href="`ipdoc${item.address}`" :key="item.address">{{item.name}}</a>
        </el-form-item>
      </el-row>
      <el-row v-if="caseDetailFoemData.tmType=='2'">
        <el-form-item class="postInfo-container-item" label="集体成员名单:">
          {{caseDetailFoemData.memberNamelist}}
        </el-form-item>
        <el-form-item class="postInfo-container-item" label="集体成员名单(附件):">
          <a v-for="item in getAddressAndName('1006')" style="color: #409EFF" target="_blank"
             :href="`ipdoc${item.address}`" :key="item.address">{{item.name}}</a>
        </el-form-item>
      </el-row>
      <el-row v-if="caseDetailFoemData.tmType=='3'">
        <el-form-item class="postInfo-container-item" label="申请人是否具备检测能力:">
          <span v-if="caseDetailFoemData.isAppWithDetectAbility=='否'">否</span>
          <span v-if="caseDetailFoemData.isAppWithDetectAbility=='是'">是</span>
        </el-form-item>
      </el-row>
      <el-row v-if="caseDetailFoemData.tmType=='3'&&caseDetailFoemData.isAppWithDetectAbility=='是'">
        <el-form-item class="postInfo-container-item" label="申请人检测资质证书（附件）:">
          <a v-for="item in getAddressAndName('1007')" style="color: #409EFF" target="_blank"
             :href="`ipdoc${item.address}`" :key="item.address">{{item.name}}</a>
        </el-form-item>
        <el-form-item class="postInfo-container-item" label="申请人专业检测设备清单:">
          <a v-for="item in getAddressAndName('1008')" style="color: #409EFF" target="_blank"
             :href="`ipdoc${item.address}`" :key="item.address">{{item.name}}</a>
        </el-form-item>
      </el-row>
      <el-row v-if="caseDetailFoemData.tmType=='3'&&caseDetailFoemData.isAppWithDetectAbility=='是'">
        <el-form-item class="postInfo-container-item" label="申请人专业技术人员名单（附件）:">
          <a v-for="item in getAddressAndName('1009')" style="color: #409EFF" target="_blank"
             :href="`ipdoc${item.address}`" :key="item.address">{{item.name}}</a>
        </el-form-item>
        <el-form-item class="postInfo-container-item" label="申请人技术人员证书:">
          <a v-for="item in getAddressAndName('1010')" style="color: #409EFF" target="_blank"
             :href="`ipdoc${item.address}`" :key="item.address">{{item.name}}</a>
        </el-form-item>
      </el-row>
      <el-row v-if="caseDetailFoemData.caseType!=='变更注册申请代理机构'">
        <el-form-item label="是否颜色组合">
          <span v-if="caseDetailFoemData.colorSign=='0'">否</span>
          <span v-if="caseDetailFoemData.colorSign=='1'">是</span>
        </el-form-item>
        <el-form-item label="指定颜色">
          <span v-if="caseDetailFoemData.assignColor==false">否</span>
          <span v-if="caseDetailFoemData.assignColor==true">是</span>
        </el-form-item>
      </el-row>
      <el-row v-if="caseDetailFoemData.caseType!=='变更注册申请代理机构'">
        <el-form-item label="声音标志">
          <span v-if="caseDetailFoemData.tmVoice=='0'">否</span>
          <span v-if="caseDetailFoemData.tmVoice=='1'">是</span>
        </el-form-item>
        <el-form-item class="postInfo-container-item" label="声音文件:" v-if="caseDetailFoemData.tmVoice=='1'">
          <a v-for="item in getAddressAndName('1016')" style="color: #409EFF" target="_blank"
             :href="`ipdoc${item.address}`" :key="item.address">{{item.name}}</a>
        </el-form-item>
      </el-row>
      <template v-if="caseDetailFoemData.caseType==='变名变址'">
        <el-row>
          <el-form-item label="变更类型">
            {{ caseDetailFoemData.changeType }}
            <!-- <span v-if="caseDetailFoemData.changeType==='变更名义'">变名</span>
            <span v-if="caseDetailFoemData.changeType==='变更地址'">变址</span>
            <span v-if="caseDetailFoemData.changeType==='变更名义/地址'">变名变址</span> -->
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="变更前名称（中文）">
            {{caseDetailFoemData.preChangeCnName}}
          </el-form-item>
          <el-form-item label="变更前名称（英文）">
            {{caseDetailFoemData.preChangeEnName}}
          </el-form-item>
        </el-row>
        <!-- <el-row>
          <el-form-item label="变更前地址（中文）:" class="postInfo-container-item">
            {{caseDetailFoemData.preChangeCnAdress}}
          </el-form-item>
          <el-form-item label="变更前地址（英文）:" class="postInfo-container-item">
            {{caseDetailFoemData.preChangeEnAdress}}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="变更前联系地址（中文）">
            {{caseDetailFoemData.preChangeContactAddr}}
          </el-form-item>
        </el-row> -->
        <template v-if="caseDetailFoemData.changeType !=='变更地址'">
          <el-row>
            <el-form-item label="变更证明文件是否为中文（网申）">
              {{caseDetailFoemData.appCertFileIsCn}}
            </el-form-item>
            </el-row>
          <el-row>
            <el-form-item label="变更证明文件（英文）" v-if="caseDetailFoemData.appCertFileIsCn==='否'">
              <p v-for="item in getAddressAndName('1033')" :key="item.address">
                <a style="color: #409EFF" target="_blank" :href="`ipdoc${item.address}`">{{item.name}}</a>
              </p>
            </el-form-item>
            <el-form-item label="变更证明文件（中文）">
              <p v-for="item in getAddressAndName('1032')" :key="item.address">
                <a style="color: #409EFF" target="_blank" :href="`ipdoc${item.address}`">{{item.name}}</a>
              </p>
            </el-form-item>
          </el-row>
        </template>

        <el-row v-if="caseDetailFoemData.joinApps">
          <el-form-item label="变更前共同申请人:" class="postInfo-container-item">
            <el-table :data="caseDetailFoemData.joinApps.filter(item=>item.type==4)" border current-row-key
                      empty-text="暂无数据" fit highlight-current-row size="mini" style="width: 100%;">
              <el-table-column align="left" label="序号" type="index" width="50"/>
              <el-table-column align="left" label="类型" v-if="caseDetailFoemData.caseType === '转让/移转'" width>
                <template slot-scope="scope">
                  <span>{{ scope.row.typeStr }}</span>
                </template>
              </el-table-column>
              <el-table-column align="left" label="中文名称" width>
                <template slot-scope="scope">
                  <span v-if="!scope.row.modifyState">{{ scope.row.nameCn }}</span>
                  <el-input v-if="scope.row.modifyState" type="text" v-model="scope.row.nameCn"></el-input>
                </template>
              </el-table-column>
              <el-table-column align="left" label="英文名称" width>
                <template slot-scope="scope">
                  <span v-if="!scope.row.modifyState">{{ scope.row.nameEn }}</span>
                  <el-input v-if="scope.row.modifyState" type="text" v-model="scope.row.nameEn"></el-input>
                </template>
              </el-table-column>
              <el-table-column align="left" label="证件名称" width>
                <template slot-scope="scope">
                  <span v-if="!scope.row.modifyState">{{ scope.row.cardName }}</span>
                  <el-input v-if="scope.row.modifyState" type="text" v-model="scope.row.cardName"></el-input>
                </template>
              </el-table-column>
              <el-table-column align="left" label="证件号" width>
                <template slot-scope="scope">
                  <span v-if="!scope.row.modifyState">{{ scope.row.cardId }}</span>
                  <el-input v-if="scope.row.modifyState" type="text" v-model="scope.row.cardId"></el-input>
                </template>
              </el-table-column>
              <el-table-column align="left" label="证明文件" width>
                <template slot-scope="scope">
                  <p v-for="item in scope.row.materialArray">
                    <a :href="`ipdoc${item.address}`">{{ item.materialName}}</a>
                  </p>
                </template>
              </el-table-column>
            </el-table>

          </el-form-item>
        </el-row>
      </template>
      <el-row>
        <el-col>
          <div class="grid-content bg-purple">客户信息</div>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="客户名称">
          {{caseDetailFoemData.custName}}
          <div class="" style="display: inline-block;color: #409EFF;cursor: pointer;">
            <span @click="customerView">查看</span>
          </div>
        </el-form-item>
        <el-form-item label="客户文号">
          {{caseDetailFoemData.custRefno}}
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="客户联系人">
          {{caseDetailFoemData.custContactName}}
        </el-form-item>
        <el-form-item label="信函地址">
          {{caseDetailFoemData.letterAddrName}}
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="账单联系人">
          {{caseDetailFoemData.billCustContactName}}
        </el-form-item>
        <el-form-item label="账单地址">
          {{caseDetailFoemData.billAddrName}}
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="抄送人">
          {{caseDetailFoemData.trademarkCaseCustContacts.map(item=>transformation(customerContacts,item,'custContactId','name')).join(',')}}
        </el-form-item>
        <el-form-item label="折扣率">
          {{caseDetailFoemData.discount}}
        </el-form-item>
      </el-row>


      <el-row v-if="caseDetailFoemData.caseType !== '转让/移转'&&caseDetailFoemData.caseType != '许可备案'">
        <el-col>
          <div class="grid-content bg-purple">申请人信息</div>
        </el-col>
      </el-row>
      <el-row v-if="caseDetailFoemData.caseType === '转让/移转'">
        <el-col>
          <div class="grid-content bg-purple">申请人(受让人)信息</div>
        </el-col>
      </el-row>
      <el-row v-if="caseDetailFoemData.caseType === '许可备案'">
        <el-col>
          <div class="grid-content bg-purple">申请人(许可人)信息</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="申请人中文名称">
            {{ caseDetailFoemData.appCnName}}
          </el-form-item>
        </el-col>
        <el-col :span="6" v-if="['国际注册驳回复审','注册驳回复审'].includes(caseDetailFoemData.caseType)">
          <el-form-item label="是否变更名义">
            {{caseDetailFoemData.isChangeName == 1 ? '申请人名义' : caseDetailFoemData.isChangeName == 2 ? '本业务商标代表人' :
            caseDetailFoemData.isChangeName == 3 ? '其他' : '否'}}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="主体法律性质">
            {{caseDetailFoemData.legalNature}}
          </el-form-item>
        </el-col>

      </el-row>
      <el-row v-if="['国际注册驳回复审','注册驳回复审'].includes(caseDetailFoemData.caseType) && caseDetailFoemData.isChangeName && caseDetailFoemData.submitType==='网上申请'">
          <el-form-item v-if="[1,2,3].includes(caseDetailFoemData.isChangeName)" :label="preChangeAppCnNameMap[caseDetailFoemData.isChangeName]">
            {{caseDetailFoemData.preChangeAppCnName}}
          </el-form-item>
          <el-form-item class="postInfo-container-item" :label="caseDetailFoemData.isChangeName == 1 ? '名义变更证明:' : caseDetailFoemData.isChangeName == 2 ? '变更代表人申请:' : '相关材料:'">
            <template>
              <p v-for="item in getAddressAndName('1032')" :key="item.address">
              <a style="color: #409EFF" target="_blank" :href="`ipdoc${item.address}`">{{item.name}}</a>
            </p>
            </template>
          </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="申请人英文名称">
          {{caseDetailFoemData.appEnName}}
        </el-form-item>
        <el-form-item label="国籍">
          <!--<el-select default-first-option @change="caseCochange" :clearable='true' placeholder="请选择" v-model="caseDetailFoemData.appGJdq" filterable>-->
          <!--<el-option v-for="(item,key)  in selectData.country" :key="key" :label="item.countryCn" :value="item.countryCn">-->
          <!--</el-option>-->
          <!--</el-select>-->
          {{caseDetailFoemData.appGJdq}}
        </el-form-item>

      </el-row>
      <el-row>
        <el-form-item label="身份证明文件名称">
          {{caseDetailFoemData.appCertificate}}
        </el-form-item>
        <el-form-item label="统一社会信用代码" v-if="caseDetailFoemData.appGJdq == '中国'&&caseDetailFoemData.legalNature!='自然人'">
          {{caseDetailFoemData.certCode}}
        </el-form-item>
        <el-form-item label="身份证明文件号码" v-else>
          {{caseDetailFoemData.appCertificateNum}}
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="申请人地址">
          {{ removeSpecial(caseDetailFoemData.appRegionalism) }}
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="申请人详细地址">
          {{ caseDetailFoemData.appCnAddr }}
        </el-form-item>
        <el-form-item label="国家或地区：" v-show='caseDetailFoemData.appGJdq!="中国"'>
          {{caseDetailFoemData.appCountryOrRegion}}
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="申请人英文地址">
          {{ caseDetailFoemData.appEnAddr }}
        </el-form-item>
      </el-row>
      <template v-if="caseDetailFoemData.caseType==='变名变址'">
        <el-row>
          <el-form-item label="国内申请人联系地址:" class="postInfo-container-item">
            {{caseDetailFoemData.appContactAddr}}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="国内申请人联系邮编:" class="postInfo-container-item">
            {{caseDetailFoemData.appContactPostCode}}
          </el-form-item>
        </el-row>
      </template>
      <el-row
        v-if="(caseDetailFoemData.caseType === '答复临时驳回/审查意见（境外）' || caseDetailFoemData.caseType === '商标注册' || caseDetailFoemData.caseType === '提供使用声明/证据（境外）') && caseDetailFoemData.appFromto == '内-内'">
        <el-form-item label="经营范围是否包括知识产权代理">
          {{+caseDetailFoemData.isIpAgent ? '是' : '否'}}
        </el-form-item>
      </el-row>
      <el-row
        v-if="(['答复临时驳回/审查意见（境外）', '提供使用声明/证据（境外）','不予注册复审','商标注册','分割申请','异议','变名变址','转让/移转','续展','删减商品项目','变更注册申请代理机构','更正商标申请事项','注册驳回复审','国际注册驳回复审','无效宣告复审','撤销商标复审','异议答辩','撤三答辩(提供使用证明)','撤销通用名称答辩','参与不予注册复审','无效宣告答辩','撤销复审答辩','撤销三年停止使用申请','撤销成为通用名称注册商标','无效宣告申请','撤回商标评审','行政复议','许可备案','补发商标注册证','补发商标变转续证明','出具优先权证明文件','出具商标注册证明','商标注销','撤回商标申请'].includes(caseDetailFoemData.caseType))">
        <el-form-item label="代理人姓名">
          {{ caseDetailFoemData.agentPerson }}
        </el-form-item>
      </el-row>

      <el-row>
        <el-form-item label="委托书">
          <p v-for="item in getAddressAndName('1000')" :key="item.address">
            <a style="color: #409EFF" target="_blank" :href="`ipdoc${item.address}`">{{item.name}}</a>
          </p>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="主体/身份证明文件是否为中文" v-if="trademarkList.includes(caseDetailFoemData.caseType)">
          {{caseDetailFoemData.appCertFileIsCn}}
        </el-form-item>
        <el-form-item label="申请人上传文件的语言类型:" class="postInfo-container-item"
                      v-if="!trademarkList.includes(caseDetailFoemData.caseType)&&(caseDetailFoemData.caseType==='无效宣告申请' || caseDetailFoemData.caseType!=='无效宣告申请')">
          {{caseDetailFoemData.uploadFileLanguage}}
        </el-form-item>
        <template v-if="caseDetailFoemData.caseType !== '许可备案'">
          <el-form-item label="身份证明文件(中文):" v-if="caseDetailFoemData.legalNature == '自然人'" class="postInfo-container-item">
          <p v-for="item in getAddressAndName('1001')" :key="item.address">
            <a style="color: #409EFF" target="_blank" :href="`ipdoc${item.address}`">{{item.name}}</a>
          </p>
        </el-form-item>
        <el-form-item
          v-if="(caseDetailFoemData.appCertFileIsCn=='否'||caseDetailFoemData.uploadFileLanguage==='外文')&&caseDetailFoemData.legalNature == '自然人'"
          label="身份证明原文件(外文):" class="postInfo-container-item">
          <p v-for="item in getAddressAndName('1002')" :key="item.address">
            <a style="color: #409EFF" target="_blank" :href="`ipdoc${item.address}`">{{item.name}}</a>
          </p>
        </el-form-item>
        </template>

      </el-row>
      <el-row v-if="caseDetailFoemData.appGJdq == '中国'&&caseDetailFoemData.legalNature == '自然人'">
        <el-form-item class="postInfo-container-item" label="主体资格证明文件类型:">
          {{ caseDetailFoemData.subjectCertType }}
        </el-form-item>
        <el-form-item class="postInfo-container-item" label="统一社会信用代码:">
          {{ caseDetailFoemData.certCode }}
        </el-form-item>
      </el-row>
      <template v-if="caseDetailFoemData.caseType==='许可备案'">
        <el-row>
          <el-form-item
            v-if="isShowSubjectFile"
            label="申请人（许可人）主体资格证明（中文）">
            <p v-for="item in getAddressAndName('1003')" :key="item.address">
              <a style="color: #409EFF" target="_blank" :href="`ipdoc${item.address}`">{{item.name}}</a>
            </p>
          </el-form-item>
          <el-form-item v-if="isShowForeignFileUpload && isShowSubjectFile"
                        class="postInfo-container-item" label="申请人（许可人）主体资格证明（英文）">
            <p v-for="item in getAddressAndName('1004')" :key="item.address">
              <a style="color: #409EFF" target="_blank" :href="`ipdoc${item.address}`">{{item.name}}</a>
            </p>
          </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item class="postInfo-container-item" label="申请人（许可人）身份证明文件(中文)">
              <p v-for="item in getAddressAndName('1001')" :key="item.address">
                <a style="color: #409EFF" target="_blank" :href="`ipdoc${item.address}`">{{item.name}}</a>
              </p>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="caseDetailFoemData.uploadFileLanguage=='外文'">
            <el-form-item class="postInfo-container-item" label="申请人（许可人）身份证明原文件(外文)">
              <p v-for="item in getAddressAndName('1002')" :key="item.address">
                <a style="color: #409EFF" target="_blank" :href="`ipdoc${item.address}`">{{item.name}}</a>
              </p>
            </el-form-item>
          </el-col>
        </el-row>

      </template>
      <template v-if="caseDetailFoemData.caseType!=='许可备案'">
        <el-row>
          <el-form-item label="主体资格证明文件（中文）"
                        v-if="isShowSubjectFile">
            <p v-for="item in getAddressAndName('1003')" :key="item.address">
              <a style="color: #409EFF" target="_blank" :href="`ipdoc${item.address}`">{{item.name}}</a>
            </p>
          </el-form-item>
          <el-form-item label="主体资格证明文件（英文）"
                        v-if="isShowForeignFileUpload && isShowSubjectFile">
            <p v-for="item in getAddressAndName('1004')" :key="item.address">
              <a style="color: #409EFF" target="_blank" :href="`ipdoc${item.address}`">{{item.name}}</a>
            </p>
          </el-form-item>
        </el-row>
      </template>
      <el-row>
        <el-form-item label="邮箱">
          {{ caseDetailFoemData.appContactEmail }}
        </el-form-item>
        <el-form-item label="邮政编码">
          {{ caseDetailFoemData.appContactZip }}
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="联系人">
          {{caseDetailFoemData.appContactPerson}}
        </el-form-item>
        <el-form-item label="电话">
          {{caseDetailFoemData.appContactTel}}
        </el-form-item>
      </el-row>
      <template v-if="caseDetailFoemData.caseType === '转让/移转'">
        <el-row>
          <el-form-item label="自然人死亡/企业或其他组织注销证明">
            <p v-for="item in getAddressAndName('1023')" :key="item.address">
              <a style="color: #409EFF" target="_blank" :href="`ipdoc${item.address}`">{{item.name}}</a>
            </p>
          </el-form-item>
          <el-form-item class="postInfo-container-item" label="同意转让声明或商标转移证明">
            <p v-for="item in getAddressAndName('1028')" :key="item.address">
              <a style="color: #409EFF " target="_blank" :href="`ipdoc${item.address}`">{{item.name}}</a>
            </p>
          </el-form-item>
        </el-row>
      </template>
      <el-row>
        <el-form-item label="有关说明文件" v-if="caseDetailFoemData.caseType !== '异议'">
          <a v-for="item in getAddressAndName('1020')" style="color: #409EFF" target="_blank"
             :href="`ipdoc${item.address}`" :key="item.address">{{item.name}}</a>
        </el-form-item>
        <el-form-item label="共同申请">
          <span v-if="caseDetailFoemData.ifShareTm==='0'">否</span>
          <span v-if="caseDetailFoemData.ifShareTm==='1'">是</span>
        </el-form-item>
      </el-row>
      <el-row v-if="caseDetailFoemData.joinApps">
        <el-form-item :label="caseDetailFoemData.caseType=='变名变址'?'变更后共同申请人':'共同申请人'">
          <el-table :data="caseDetailFoemData.joinApps.filter(item=>item.type!=4)" border current-row-key
                    empty-text="暂无数据" fit highlight-current-row size="mini" style="width: 100%;">
            <el-table-column align="left" label="序号" type="index" width="50"/>
            <el-table-column align="left" label="类型" v-if="caseDetailFoemData.caseType === '转让/移转'" width>
              <template slot-scope="scope">
                <span>{{ scope.row.typeStr }}</span>
              </template>
            </el-table-column>
            <el-table-column align="left" label="中文名称" width>
              <template slot-scope="scope">
                <span v-if="!scope.row.modifyState">{{ scope.row.nameCn }}</span>
                <el-input v-if="scope.row.modifyState" type="text" v-model="scope.row.nameCn"></el-input>
              </template>
            </el-table-column>
            <el-table-column align="left" label="英文名称" width>
              <template slot-scope="scope">
                <span v-if="!scope.row.modifyState">{{ scope.row.nameEn }}</span>
                <el-input v-if="scope.row.modifyState" type="text" v-model="scope.row.nameEn"></el-input>
              </template>
            </el-table-column>
            <el-table-column align="left" label="证件名称" width>
              <template slot-scope="scope">
                <span v-if="!scope.row.modifyState">{{ scope.row.cardName }}</span>
                <el-input v-if="scope.row.modifyState" type="text" v-model="scope.row.cardName"></el-input>
              </template>
            </el-table-column>
            <el-table-column align="left" label="证件号" width>
              <template slot-scope="scope">
                <span v-if="!scope.row.modifyState">{{ scope.row.cardId }}</span>
                <el-input v-if="scope.row.modifyState" type="text" v-model="scope.row.cardId"></el-input>
              </template>
            </el-table-column>
            <el-table-column align="left" label="证明文件" width>
              <template slot-scope="scope">

                <p v-for="item in scope.row.materialArray">
                  <a target="_blank" :href="`ipdoc${item.address}`">{{item.materialName}}</a>
                </p>

              </template>
            </el-table-column>
          </el-table>

        </el-form-item>
      </el-row>

      <template
        v-if="caseDetailFoemData.caseType === '答复临时驳回/审查意见（境外）' || caseDetailFoemData.caseType=='商标注册'||caseDetailFoemData.caseType=='分割申请' || caseDetailFoemData.caseType=='提供使用声明/证据（境外）'">
        <el-row>
          <el-form-item label="要求优先权:">
            <span v-if="caseDetailFoemData.priorityType=='0'">否</span>
            <span v-if="caseDetailFoemData.priorityType=='1'">是</span>
          </el-form-item>
          <el-form-item label="要求优先权声明:" v-if="caseDetailFoemData.priorityType=='1'">
            <span v-if="caseDetailFoemData.priorityType=='1'">基于第一次申请的优先权</span>
            <span v-if="caseDetailFoemData.priorityType=='2'">基于展会的优先权</span>
          </el-form-item>
        </el-row>
        <el-row v-if="caseDetailFoemData.priorityType=='1'">
          <el-form-item class="postInfo-container-item" label="优先权国家:">
            {{caseDetailFoemData.priorityBaseCrty}}
          </el-form-item>
          <el-form-item label="优先权日期:">
            {{caseDetailFoemData.priorityAppDate}}
          </el-form-item>
        </el-row>
        <el-row v-if="caseDetailFoemData.priorityType=='1'">
          <el-form-item label="优先权文件后补:">
            <span v-if="caseDetailFoemData.isLoadPriorityFile=='0'">否</span>
            <span v-if="caseDetailFoemData.isLoadPriorityFile=='1'">是</span>
          </el-form-item>
          <el-form-item label="优先权证明文件:">
            <a v-for="item in getAddressAndName('1017')" style="color: #409EFF" target="_blank"
               :href="`ipdoc${item.address}`" :key="item.address">{{item.name}}</a>
          </el-form-item>
        </el-row>
        <el-row v-if="caseDetailFoemData.priorityType=='1'">
          <el-form-item label="优先权申请号:">
            {{caseDetailFoemData.priorityAppNum}}
          </el-form-item>
        </el-row>
      </template>
      <!-- <template v-if="caseDetailFoemData.caseType==='变更注册申请代理机构'">
        <el-row>
          <el-form-item label="是否填写变更后代理机构名称">
            <span v-if="caseDetailFoemData.isPreChangeAgencyName==1">是</span>
            <span v-if="caseDetailFoemData.isPreChangeAgencyName==0">否</span>
          </el-form-item>
          <el-form-item label="变更后代理机构名称" v-if="caseDetailFoemData.isPreChangeAgencyName==1">
            {{caseDetailFoemData.preChangeAgencyName}}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="变更后文件接收人名称">
            {{caseDetailFoemData.acceptPerson}}
          </el-form-item>
          <el-form-item label="变更后文件接收人地址">
            {{caseDetailFoemData.acceptPersonAddr}}
          </el-form-item>
        </el-row>
      </template> -->
      <template v-if="caseDetailFoemData.caseType==='更正商标申请事项'">
        <el-row class="fullRow" v-if="caseDetailFoemData.submitType=='线下申请'">
          <el-form-item label="更正事项:">
            {{caseDetailFoemData.correction}}
          </el-form-item>
        </el-row>
      </template>
      <!--      <template v-if="caseDetailFoemData.caseType==='变名变址'">-->
      <!--        <el-row>-->
      <!--          <el-form-item label="变更类型">-->
      <!--            <span v-if="caseDetailFoemData.changeType==='变更名义'">变名</span>-->
      <!--            <span v-if="caseDetailFoemData.changeType==='变更地址'">变址</span>-->
      <!--            <span v-if="caseDetailFoemData.changeType==='变更名义/地址'">变名变址</span>-->
      <!--          </el-form-item>-->
      <!--        </el-row>-->
      <!--        <el-row>-->
      <!--          <el-form-item label="变更前名称（中文）">-->
      <!--            {{caseDetailFoemData.preChangeCnName}}-->
      <!--          </el-form-item>-->
      <!--          <el-form-item label="变更前名称（英文）">-->
      <!--            {{caseDetailFoemData.preChangeEnName}}-->
      <!--          </el-form-item>-->
      <!--        </el-row>-->
      <!--        <el-row>-->
      <!--          <el-form-item label="变更前地址（中文）:" class="postInfo-container-item">-->
      <!--            {{caseDetailFoemData.preChangeCnAdress}}-->
      <!--          </el-form-item>-->
      <!--          <el-form-item label="变更前地址（英文）:" class="postInfo-container-item">-->
      <!--            {{caseDetailFoemData.preChangeEnAdress}}-->
      <!--          </el-form-item>-->
      <!--        </el-row>-->
      <!--        <el-row>-->
      <!--          <el-form-item label="变更证明文件是否为中文（网申）">-->
      <!--            {{caseDetailFoemData.appCertFileIsCn}}-->
      <!--          </el-form-item>-->


      <!--        </el-row>-->
      <!--        <el-row>-->
      <!--        <el-form-item label="变更证明文件（英文）" v-if="caseDetailFoemData.appCertFileIsCn==='否'">-->
      <!--          <p v-for="item in getAddressAndName('1033')" :key="item.address">-->
      <!--            <a style="color: #409EFF" target="_blank" :href="`ipdoc${item.address}`">{{item.name}}</a>-->
      <!--          </p>-->
      <!--        </el-form-item>-->
      <!--          <el-form-item label="变更证明文件（中文）">-->
      <!--            <p v-for="item in getAddressAndName('1032')" :key="item.address">-->
      <!--              <a style="color: #409EFF" target="_blank" :href="`ipdoc${item.address}`">{{item.name}}</a>-->
      <!--            </p>-->
      <!--          </el-form-item>-->
      <!--        </el-row>-->
      <!--        <el-row v-if="caseDetailFoemData.joinApps">-->
      <!--          <el-form-item label="变更前共同申请人:" class="postInfo-container-item">-->
      <!--            <el-table :data="caseDetailFoemData.joinApps.filter(item=>item.type==4)" border current-row-key empty-text="暂无数据" fit highlight-current-row size="mini" style="width: 100%;">-->
      <!--              <el-table-column align="left" label="序号" type="index" width="50" />-->
      <!--              <el-table-column align="left" label="类型" v-if="caseDetailFoemData.caseType === '转让/移转'" width>-->
      <!--                <template slot-scope="scope">-->
      <!--                  <span>{{ scope.row.typeStr }}</span>-->
      <!--                </template>-->
      <!--              </el-table-column>-->
      <!--              <el-table-column align="left" label="中文名称" width>-->
      <!--                <template slot-scope="scope">-->
      <!--                  <span v-if="!scope.row.modifyState">{{ scope.row.nameCn }}</span>-->
      <!--                  <el-input v-if="scope.row.modifyState" type="text" v-model="scope.row.nameCn"></el-input>-->
      <!--                </template>-->
      <!--              </el-table-column>-->
      <!--              <el-table-column align="left" label="英文名称" width>-->
      <!--                <template slot-scope="scope">-->
      <!--                  <span v-if="!scope.row.modifyState">{{ scope.row.nameEn }}</span>-->
      <!--                  <el-input v-if="scope.row.modifyState" type="text" v-model="scope.row.nameEn"></el-input>-->
      <!--                </template>-->
      <!--              </el-table-column>-->
      <!--              <el-table-column align="left" label="证件名称" width>-->
      <!--                <template slot-scope="scope">-->
      <!--                  <span v-if="!scope.row.modifyState">{{ scope.row.cardName }}</span>-->
      <!--                  <el-input v-if="scope.row.modifyState" type="text" v-model="scope.row.cardName"></el-input>-->
      <!--                </template>-->
      <!--              </el-table-column>-->
      <!--              <el-table-column align="left" label="证件号" width>-->
      <!--                <template slot-scope="scope">-->
      <!--                  <span v-if="!scope.row.modifyState">{{ scope.row.cardId }}</span>-->
      <!--                  <el-input v-if="scope.row.modifyState" type="text" v-model="scope.row.cardId"></el-input>-->
      <!--                </template>-->
      <!--              </el-table-column>-->
      <!--              <el-table-column align="left" label="证明文件" width>-->
      <!--                <template slot-scope="scope">-->
      <!--                  <span v-if="!scope.row.modifyState&&(scope.row.materialArray&&scope.row.materialArray.length)">-->
      <!--                    <a target="_blank" :href="`ipdoc${scope.row.materialArray[0].address}`">{{ scope.row.materialArray[0].materialName}}</a></span>-->
      <!--                </template>-->
      <!--              </el-table-column>-->
      <!--            </el-table>-->

      <!--          </el-form-item>-->
      <!--        </el-row>-->
      <!--      </template>-->
      <template v-if="caseDetailFoemData.caseType==='续展'">
        <el-row>
          <el-form-item label="延迟续展">
            <span v-if="caseDetailFoemData.delayRenewal===false">否</span>
            <span v-if="caseDetailFoemData.delayRenewal===true">是</span>
          </el-form-item>
        </el-row>
      </template>
<!--      <template v-if="caseDetailFoemData.caseType==='变更注册申请代理机构'">-->
<!--        <el-row>-->
<!--          <el-form-item label="是否填写变更后代理机构名称">-->
<!--            <span v-if="caseDetailFoemData.isPreChangeAgencyName==1">是</span>-->
<!--            <span v-if="caseDetailFoemData.isPreChangeAgencyName==0">否</span>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="变更后代理机构名称" v-if="caseDetailFoemData.isPreChangeAgencyName==1">-->
<!--            {{caseDetailFoemData.preChangeAgencyName}}-->
<!--          </el-form-item>-->
<!--        </el-row>-->
<!--        <el-row>-->
<!--          <el-form-item label="变更后文件接收人名称">-->
<!--            {{caseDetailFoemData.acceptPerson}}-->
<!--          </el-form-item>-->
<!--          <el-form-item label="变更后文件接收人地址">-->
<!--            {{caseDetailFoemData.acceptPersonAddr}}-->
<!--          </el-form-item>-->
<!--        </el-row>-->
<!--      </template>-->
      <template v-if="caseDetailFoemData.caseType==='更正商标申请事项'">
        <el-row class="fullRow" v-if="caseDetailFoemData.submitType=='线下申请'">
          <el-form-item label="更正事项:">
            {{caseDetailFoemData.correction}}
          </el-form-item>
        </el-row>
      </template>
      <template v-if="caseDetailFoemData.caseType==='转让/移转'">
      </template>


      <!--<el-row>-->
      <!--<el-form-item v-if="caseDetailFoemData.applicantType!='自然人'||(caseDetailFoemData.applicantType=='自然人'&&(caseDetailFoemData.appCertFileIsCn=='是'||caseDetailFoemData.uploadFileLanguage==='中文'))" label="主体资格证明文件（中文）:" class="postInfo-container-item">-->
      <!--<p v-for="item in getAddressAndName('1003')" :key="item.address">-->
      <!--<a style="color: #409EFF" :href="`ipdoc${item.address}`">{{item.name}}</a>-->
      <!--</p>-->
      <!--</el-form-item>-->
      <!--<el-form-item v-if="(caseDetailFoemData.appCertFileIsCn=='否'||caseDetailFoemData.uploadFileLanguage==='外文')&&caseDetailFoemData.applicantType!='自然人'" label="主体资格证明文件（英文）:" class="postInfo-container-item">-->
      <!--<p v-for="item in getAddressAndName('1004')" :key="item.address">-->
      <!--<a style="color: #409EFF" :href="`ipdoc${item.address}`">{{item.name}}</a>-->
      <!--</p>-->
      <!--</el-form-item>-->
      <!--</el-row>-->
      <el-row v-if="caseDetailFoemData.caseType !='许可备案'">


      </el-row>

      <!--                  引证商标信息-->
      <template v-if="['异议', '无效宣告申请', '不予注册复审', '参加不予注册复审', '异议答辩', '撤销复审答辩', '无效宣告答辩'].includes(caseDetailFoemData.caseType)">
        <el-row>
          <el-col>
            <div class="grid-content bg-purple">引证商标信息</div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="form-con-item">
            <el-row class="form-border">
              <el-col :span="24">
                <el-row class="fullRow">
                  <el-col :span="24">
                    <el-form-item label="引证商标列表" class="postInfo-container-item">
                      <y-zgrid :ch_caseTypr="caseDetailFoemData.caseType" :caseId="caseDetailFoemData.caseId" :case-data="caseDetailFoemData" style="margin-top: 10px" type="view" :tableData="caseDetailFoemData.quotes"
                               :tmCaseId="caseDetailFoemData.tmCaseId" :tableTitleList="yzTitleList"/>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </template>

<!--  法律条款和事实理由-->
      <template v-if="['异议'].includes(caseDetailFoemData.caseType)">
        <el-row>
          <el-col>
            <div class="grid-content bg-purple">法律条款和事实理由</div>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="是否引用其他异议申请证据材料">
            <span>{{ caseDetailFoemData.quotedOthersMaterial ? '是' : '否' }}</span>
          </el-form-item>
          <el-form-item label="引证异议申请号" v-if="caseDetailFoemData.quotedOthersMaterial">
            <span>{{ caseDetailFoemData.quotedAppNumber }}</span>
          </el-form-item>
        </el-row>
        <el-row v-if="!caseDetailFoemData.quotedOthersMaterial">
          <el-form-item label="是否提交涉商业机密证据材料">
            <span>{{ caseDetailFoemData.subBusinessSecrets ? '是' : '否' }}</span>
          </el-form-item>
          <el-form-item class="postInfo-container-item" label="涉商业机密证据材料:" v-if="caseDetailFoemData.subBusinessSecrets=='1'">
            <a v-for="item in getAddressAndName('301677')" style="color: #409EFF" target="_blank"
              :href="`ipdoc${item.address}`" :key="item.address">{{item.name}}</a>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item class="postInfo-container-item" label="其他说明文件:">
            <a v-for="item in getAddressAndName('1020')" style="color: #409EFF" target="_blank"
              :href="`ipdoc${item.address}`" :key="item.address">{{item.name}}</a>
          </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="24" class="form-con-item">
            <el-row class="form-border">
              <el-col :span="24">
                <el-row class="fullRow">
                  <el-col :span="24">
                    <el-form-item label="法律条款和事实理由列表" class="postInfo-container-item">
                      <y-zgrid :fileSize="caseDetailFoemData.yyzjFileSize" style="margin-top: 10px" type="view" idFlData right-key :tableTitleList="flTitleList" :tableData="caseDetailFoemData.demurCaseLaws" :tmCaseId="caseDetailFoemData.caseId" />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </template>

<!--      补充证据-->
      <template v-if="['异议'].includes(caseDetailFoemData.caseType)">
        <el-row>
          <el-col>
            <div class="grid-content bg-purple">补充证据</div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="form-con-item">
            <el-row class="form-border">
              <el-col :span="24">
                <el-row class="fullRow">
                  <el-col :span="24">
                    <el-form-item label="补充证据列表" class="postInfo-container-item">
                      <y-zgrid :fileSize="caseDetailFoemData.yybcFileSize" style="margin-top: 10px" type="view" idFlData right-key :tableTitleList="zjTitleList" :tableData="caseDetailFoemData.demurCaseLawBCs" :tmCaseId="caseDetailFoemData.caseId"/>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </template>

      <el-row v-if="caseDetailFoemData.caseType === '转让/移转'">
        <el-col>
          <div class="grid-content bg-purple">转让人信息</div>
        </el-col>
      </el-row>
      <template v-if="caseDetailFoemData.caseType === '转让/移转'">
        <el-row>
          <el-form-item label="转让人中文名称">
            {{caseDetailFoemData.transferorCnName}}
          </el-form-item>
          <el-form-item label="转让人英文名称">
            {{caseDetailFoemData.transferorEnName}}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="转让人主体法律性质（类型）">
            {{caseDetailFoemData.transferorType}}
          </el-form-item>
          <el-form-item label="转让人国籍">
            {{caseDetailFoemData.transferorNationality}}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="转让人身份证明文件名称:">
            {{caseDetailFoemData.transferorCertificateName}}
          </el-form-item>
          <el-form-item label="转让人统一社会信用代码:" v-if="caseDetailFoemData.transferorNationality == '中国'&&caseDetailFoemData.transferorType!='自然人'">
            {{caseDetailFoemData.zrCertCode}}
          </el-form-item>
          <el-form-item label="转让人身份证明文件号码:" v-else>
            {{caseDetailFoemData.transferorCertificateNumber}}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="转让人国家或地区:">
            {{caseDetailFoemData.transferorCountryAndregion}}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="转让人中文地址:">
            {{caseDetailFoemData.transferorCnAdress}}
          </el-form-item>
          <el-form-item label="转让人英文地址:">
            {{caseDetailFoemData.transferorEnAdress}}
          </el-form-item>
        </el-row>
        <el-row v-if="caseDetailFoemData.transferorNationality=='中国'">
          <el-form-item label="转让人地址省市区:">
            {{removeSpecial(caseDetailFoemData.provinceOrCity)}}
          </el-form-item>
        </el-row>
        <el-row v-if="caseDetailFoemData.transferorNationality == '中国'&&caseDetailFoemData.transferorType == '自然人'">
          <el-form-item class="postInfo-container-item" label="主体资格证明文件类型:">
            {{ caseDetailFoemData.transferorSubjectCertType }}
          </el-form-item>
          <el-form-item class="postInfo-container-item" label="统一社会信用代码:">
            {{ caseDetailFoemData.zrCertCode }}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="转让人邮政编码:">
            {{ caseDetailFoemData.licenseePostCode }}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="转让人上传文件的语言类型">
            <template>
              {{caseDetailFoemData.transferorUploadFileLanguage}}
            </template>
          </el-form-item>
          <el-form-item label="转让人委托书">
            <p v-for="item in getAddressAndName('1022')" :key="item.address">
              <a style="color: #409EFF" target="_blank" :href="`ipdoc${item.address}`">{{item.name}}</a>
            </p>
          </el-form-item>
        </el-row>
        <el-row v-if="caseDetailFoemData.changeType==='转让'">
          <el-form-item label="转/受让人同意撤回的声明文件">
            <p v-for="item in getAddressAndName('1071')" :key="item.address">
              <a style="color: #409EFF" target="_blank" :href="`ipdoc${item.address}`">{{item.name}}</a>
            </p>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item
            v-if="transferorSubjectFile"
            label="转让人主体资格证明（中文）">
            <p v-for="item in getAddressAndName(caseDetailFoemData.caseType==='许可备案' ? '301562' : '1026')"
               :key="item.address">
              <a style="color: #409EFF" target="_blank" :href="`ipdoc${item.address}`">{{item.name}}</a>
            </p>
          </el-form-item>
          <el-form-item
            v-if="caseDetailFoemData.transferorUploadFileLanguage=='外文'&&transferorSubjectFile"
            label="转让人主体资格证明文件（英文）">
            <p v-for="item in getAddressAndName(caseDetailFoemData.caseType==='许可备案' ? '301563' : '1027')"
               :key="item.address">
              <a style="color: #409EFF" target="_blank" :href="`ipdoc${item.address}`">{{item.name}}</a>
            </p>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="转让人身份证明文件(中文)">
            <p v-for="item in getAddressAndName(caseDetailFoemData.caseType==='许可备案' ? '301564' : '1024')"
               :key="item.address">
              <a style="color: #409EFF" target="_blank" :href="`ipdoc${item.address}`">{{item.name}}</a>
            </p>
          </el-form-item>
          <el-form-item
            v-if="caseDetailFoemData.transferorUploadFileLanguage=='外文'"
            label="转让人身份证明原文件(外文)">
            <p v-for="item in getAddressAndName(caseDetailFoemData.caseType==='许可备案' ? '301565' : '1025')"
               :key="item.address">
              <a style="color: #409EFF" target="_blank" :href="`ipdoc${item.address}`">{{item.name}}</a>
            </p>
          </el-form-item>
        </el-row>
      </template>

      <el-row v-if="caseDetailFoemData.caseType==='许可备案' || caseDetailFoemData.caseType==='许可备案提前终止'">
        <el-col>
          <div class="grid-content bg-purple">被许可人信息</div>
        </el-col>
      </el-row>
      <template v-if="caseDetailFoemData.caseType==='许可备案' || caseDetailFoemData.caseType==='许可备案提前终止'">
        <!-- <template v-if="caseDetailFoemData.changeType==='许可'"> -->
        <el-row>
          <el-form-item class="postInfo-container-item" label="被许可人名称（中文）:">
            {{caseDetailFoemData.transferorCnName}}
          </el-form-item>
          <el-form-item class="postInfo-container-item" label="被许可人统一社会信用代码:">
            {{caseDetailFoemData.zrCertCode}}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item class="postInfo-container-item" label="被许可人名称（英文）:">
            {{caseDetailFoemData.transferorEnName}}
          </el-form-item>
          <el-form-item v-if="caseDetailFoemData.caseType != '许可备案提前终止'" class="postInfo-container-item"
                        label="被许可人邮政编码:">
            {{caseDetailFoemData.licenseePostCode}}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item class="postInfo-container-item" label="被许可人中文地址:">
            {{caseDetailFoemData.transferorCnAdress}}
          </el-form-item>
          <el-form-item v-if="caseDetailFoemData.caseType != '许可备案提前终止'" class="postInfo-container-item"
                        label="被许可人国籍:">
            {{caseDetailFoemData.transferorNationality}}
          </el-form-item>
        </el-row>
        <el-row v-if="caseDetailFoemData.transferorNationality=='中国'">
          <el-form-item label="被许可人地址省市区:">
            {{removeSpecial(caseDetailFoemData.provinceOrCity)}}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item class="postInfo-container-item" label="被许可人英文地址:">
            {{caseDetailFoemData.transferorEnAdress}}
          </el-form-item>
          <el-form-item v-if="caseDetailFoemData.caseType != '许可备案提前终止'" label="被许可人国家或地区:">
            {{caseDetailFoemData.transferorCountryAndregion}}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item v-if="caseDetailFoemData.caseType != '许可备案提前终止'" class="postInfo-container-item"
                        label="被许可人类型:">
            {{caseDetailFoemData.transferorType}}
          </el-form-item>
          <el-form-item v-if="caseDetailFoemData.caseType != '许可备案提前终止'" class="postInfo-container-item"
                        label="被许可人上传文件的语言类型:" style="border-bottom: 1px;">
            {{caseDetailFoemData.transferorUploadFileLanguage}}
          </el-form-item>


        </el-row>
        <el-row v-if="caseDetailFoemData.caseType != '许可备案提前终止'">
          <el-form-item label="被许可人身份证明文件名称:">
            {{caseDetailFoemData.transferorCertificateName}}
          </el-form-item>
          <el-form-item label="被许可人身份证明文件号码:">
            {{caseDetailFoemData.transferorCertificateNumber}}
          </el-form-item>
        </el-row>

        <el-row>

        </el-row>
        <el-row v-if="caseDetailFoemData.transferorNationality == '中国'&&caseDetailFoemData.transferorType == '自然人'">
          <el-form-item class="postInfo-container-item" label="主体资格证明文件类型:">
            {{ caseDetailFoemData.transferorSubjectCertType }}
          </el-form-item>
        </el-row>
        <el-row v-if="caseDetailFoemData.caseType != '许可备案提前终止'">
          <el-col :span="24"
                  v-if="caseDetailFoemData.transferorType!='自然人'||(caseDetailFoemData.transferorType=='自然人'&&caseDetailFoemData.transferorUploadFileLanguage=='中文')">
            <el-form-item class="postInfo-container-item" label="被许可人主体资格证明（中文）:">
              <p v-for="item in getAddressAndName(caseDetailFoemData.caseType==='许可备案' ? '301562' : '1026')"
                 :key="item.address">
                <a style="color: #409EFF" target="_blank" :href="`ipdoc${item.address}`">{{item.name}}</a>
              </p>
            </el-form-item>
          </el-col>
          <el-col :span="12"
                  v-if="caseDetailFoemData.transferorUploadFileLanguage=='外文'&&caseDetailFoemData.transferorType!='自然人'">
            <el-form-item class="postInfo-container-item" label="被许可人主体资格证明（英文）:">
              <p v-for="item in getAddressAndName(caseDetailFoemData.caseType==='许可备案' ? '301563' : '1027')"
                 :key="item.address">
                <a style="color: #409EFF" target="_blank" :href="`ipdoc${item.address}`">{{item.name}}</a>
              </p>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="caseDetailFoemData.caseType != '许可备案提前终止'">
          <el-form-item class="postInfo-container-item" label="被许可人身份证明文件(中文):">
            <p v-for="item in getAddressAndName(caseDetailFoemData.caseType==='许可备案' ? '301564' : '1024')"
               :key="item.address">
              <a style="color: #409EFF" target="_blank" :href="`ipdoc${item.address}`">{{item.name}}</a>
            </p>
          </el-form-item>
          <el-form-item v-if="caseDetailFoemData.transferorUploadFileLanguage=='外文'" class="postInfo-container-item"
                        label="被许可人身份证明原文件(外文):">
            <p v-for="item in getAddressAndName(caseDetailFoemData.caseType==='许可备案' ? '301565' : '1025')"
               :key="item.address">
              <a style="color: #409EFF" target="_blank" :href="`ipdoc${item.address}`">{{item.name}}</a>
            </p>
          </el-form-item>
        </el-row>
      </template>
      <template
        v-if="showType||[ '不予注册复审', '无效宣告复审','撤销商标复审','撤销复审答辩', '撤三答辩（提供使用证明）', '撤销通用名称答辩', '撤销三年停止使用申请','参加不予注册复审'].includes(caseDetailFoemData.caseType)">
        <el-row v-if="caseDetailFoemData.caseType==='异议'">
          <el-col>
            <div class="grid-content bg-purple">被异议人</div>
          </el-col>
        </el-row>
        <el-row v-if="caseDetailFoemData.caseType==='异议答辩'">
          <el-col>
            <div class="grid-content bg-purple">异议人信息</div>
          </el-col>
        </el-row>
        <el-row v-if="caseDetailFoemData.caseType==='撤三答辩（提供使用证明）' || caseDetailFoemData.caseType==='撤销通用名称答辩'">
          <el-col>
            <div class="grid-content bg-purple">被申请人(撤销人)信息</div>
          </el-col>
        </el-row>
        <el-row v-if="caseDetailFoemData.caseType==='撤销三年停止使用申请'">
          <el-col>
            <div class="grid-content bg-purple">被申请人(注册人)信息</div>
          </el-col>
        </el-row>
        <el-row
          v-if="caseDetailFoemData.caseType==='撤销复审答辩'||caseDetailFoemData.caseType==='无效宣告答辩'||caseDetailFoemData.caseType==='撤销商标复审'||caseDetailFoemData.caseType==='不予注册复审'||caseDetailFoemData.caseType==='无效宣告申请'">
          <el-col>
            <div class="grid-content bg-purple">被申请人信息</div>
          </el-col>
        </el-row>
        <el-row v-if="caseDetailFoemData.caseType==='参加不予注册复审'">
          <el-col>
            <div class="grid-content bg-purple">被申请人(不予注册复审申请人)信息</div>
          </el-col>
        </el-row>
        <el-row class="fullRow" v-if="caseDetailFoemData.caseType==='异议答辩'">
          <el-form-item label="异议人列表">
            <y-zgrid type="view" :tableTitleList="yyTitleList" :tableData="caseDetailFoemData.opponents" :tmCaseId="caseDetailFoemData.tmCaseId" />
          </el-form-item>
        </el-row>
        <el-row class="fullRow" v-else>
          <el-form-item :label="yyTextShowxk.cnname">
            {{caseDetailFoemData.respondentNameCn}}
          </el-form-item>
          <el-form-item :label="yyTextShowxk.enname">
            {{caseDetailFoemData.respondentNameEn}}
          </el-form-item>
        </el-row>
        <el-row v-if="yyTextShowxk.cnaddr">
          <el-form-item :label="yyTextShowxk.cnaddr">
            {{caseDetailFoemData.respondentAddrCn}}
          </el-form-item>
          <el-form-item :label="yyTextShowxk.enaddr">
            {{caseDetailFoemData.respondentAddrEn}}
          </el-form-item>
        </el-row>
        <el-row v-if="yyTextShowxk.dlzz">
          <el-form-item :label="yyTextShowxk.dlzz">
            {{caseDetailFoemData.respondentAgency}}
          </el-form-item>
        </el-row>
      </template>


      <!-- <el-row>
        <el-form-item label="共同申请">
          <span v-if="caseDetailFoemData.ifShareTm==='0'">否</span>
          <span v-if="caseDetailFoemData.ifShareTm==='1'">是</span>
        </el-form-item>
      </el-row>
      <el-row v-if="caseDetailFoemData.joinApps">
        <el-form-item :label="caseDetailFoemData.caseType=='变名变址'?'变更后共同申请人':'共同申请人'">
          <el-table :data="caseDetailFoemData.joinApps.filter(item=>item.type!=4)" border current-row-key empty-text="暂无数据" fit highlight-current-row size="mini" style="width: 100%;">
            <el-table-column align="left" label="序号" type="index" width="50" />
            <el-table-column align="left" label="类型" v-if="caseDetailFoemData.caseType === '转让/移转'" width>
              <template slot-scope="scope">
                <span>{{ scope.row.typeStr }}</span>
              </template>
            </el-table-column>
            <el-table-column align="left" label="中文名称" width>
              <template slot-scope="scope">
                <span v-if="!scope.row.modifyState">{{ scope.row.nameCn }}</span>
                <el-input v-if="scope.row.modifyState" type="text" v-model="scope.row.nameCn"></el-input>
              </template>
            </el-table-column>
            <el-table-column align="left" label="英文名称" width>
              <template slot-scope="scope">
                <span v-if="!scope.row.modifyState">{{ scope.row.nameEn }}</span>
                <el-input v-if="scope.row.modifyState" type="text" v-model="scope.row.nameEn"></el-input>
              </template>
            </el-table-column>
            <el-table-column align="left" label="证件名称" width>
              <template slot-scope="scope">
                <span v-if="!scope.row.modifyState">{{ scope.row.cardName }}</span>
                <el-input v-if="scope.row.modifyState" type="text" v-model="scope.row.cardName"></el-input>
              </template>
            </el-table-column>
            <el-table-column align="left" label="证件号" width>
              <template slot-scope="scope">
                <span v-if="!scope.row.modifyState">{{ scope.row.cardId }}</span>
                <el-input v-if="scope.row.modifyState" type="text" v-model="scope.row.cardId"></el-input>
              </template>
            </el-table-column>
            <el-table-column align="left" label="证明文件" width>
              <template slot-scope="scope">
                <span v-if="!scope.row.modifyState&&(scope.row.materialArray&&scope.row.materialArray.length)">
                  <a target="_blank" :href="`ipdoc${scope.row.materialArray[0].address}`">{{ scope.row.materialArray[0].materialName}}</a></span>

              </template>
            </el-table-column>
          </el-table>

        </el-form-item>
      </el-row> -->
    </el-form>

    <el-row v-if="['内-外','外-外'].includes(caseDetailFoemData.appFromto)">
      <el-col>
        <div class="grid-content bg-purple">境外信息</div>
      </el-col>
    </el-row>
    <el-form label-width="130px" v-if="['内-外','外-外'].includes(caseDetailFoemData.appFromto)">
      <el-row>
        <el-form-item label="注册方式">
          {{caseDetailFoemData.madrid?'马德里注册':'逐一注册'}}
        </el-form-item>
        <el-form-item label="注册国家">
          {{caseDetailFoemData.appState}}
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="外方代理所">
          {{caseDetailFoemData.agencyCustName}}
        </el-form-item>
        <el-form-item label="外方代理所联系人">
          {{caseDetailFoemData.agencyCustContactName}}
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="外方代理所文号">
          {{caseDetailFoemData.agencyCustRefno}}
        </el-form-item>
        <el-form-item label="外方代理所地址">
          {{caseDetailFoemData.agencyCustAddrName}}
        </el-form-item>
      </el-row>
      <el-row v-show="['内-外', '外-外'].includes(caseDetailFoemData.appFromto) && caseDetailFoemData.appState == '美国'">
        <el-col :span="12">
          <el-form-item label="第一次使用日期:" class="postInfo-container-item">
            {{caseDetailFoemData.firstUseDate}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="商业使用日期:" class="postInfo-container-item">
            {{caseDetailFoemData.businessUseDate}}
          </el-form-item>
        </el-col>
      </el-row>
      <template v-show="['内-外', '外-外'].includes(caseDetailFoemData.appFromto) && caseDetailFoemData.madrid">
        <el-row>
          <el-col :span="12">
            <el-form-item label="指定国注册号:" class="postInfo-container-item">
              {{caseDetailFoemData.zdRegNumber}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="指定国注册日:" class="postInfo-container-item">
              {{caseDetailFoemData.zdRegDate}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="指定国申请号:" class="postInfo-container-item">
              {{caseDetailFoemData.zdAppNumber}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="指定国申请日:" class="postInfo-container-item">
              {{caseDetailFoemData.zdAppDate}}
            </el-form-item>
          </el-col>
        </el-row>
      </template>
      <el-row>
        <el-form-item label="外方代理所要求">
          {{caseDetailFoemData.agencyCustReq}}
        </el-form-item>
        <el-form-item label="时限内容">
          {{caseDetailFoemData.timeLimitContent}}
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="时限日期">
          {{caseDetailFoemData.limitDate}}
        </el-form-item>
      </el-row>
      <el-row class="fullRow">
        <el-col :span="24">
          <el-form-item label="外代所报价:" class="postInfo-container-item">
            <overseas-quotation
              v-if="currencyList.length"
              :currencyList="currencyList"
              type="view"
              :priceData="caseDetailFoemData.agencyOffers"
            >
            </overseas-quotation>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-row  v-if="(caseDetailFoemData.appFromto=='内-外'||caseDetailFoemData.appFromto=='外-外')&&caseDetailFoemData.madrid==true&&caseDetailFoemData.caseType !== '出具优先权证明文件'">
      <el-col>
        <div class="grid-content bg-purple">基础注册信息</div>
      </el-col>
    </el-row>
    <el-row v-if="(caseDetailFoemData.appFromto=='内-外'||caseDetailFoemData.appFromto=='外-外')&&caseDetailFoemData.madrid==true&&caseDetailFoemData.caseType !== '出具优先权证明文件'">
      <el-table :data="caseDetailFoemData.trademarkCaseBasicinfos" border current-row-key
        empty-text="暂无数据" fit highlight-current-row size="mini" style="width: 100%;">
        <el-table-column type="index" width="50" label="序号" align="left"></el-table-column>
        <el-table-column label="基础注册/申请号" align="left" prop="regNumber"></el-table-column>
        <el-table-column label="基础注册/申请日" align="left" prop="regDate"></el-table-column>
      </el-table>
    </el-row>

    <el-form v-if="caseDetailFoemData.custName && caseDetailFoemData.custName.includes('阿里')" label-width="130px">
      <template>
        <el-row>
          <el-col>
            <div class="grid-content bg-purple">阿里月报信息</div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="品牌层级:" class="postInfo-container-item">
              {{caseDetailFoemData.brandHierarchy}}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="风险类型:" class="postInfo-container-item">
              {{caseDetailFoemData.riskType}}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="风险等级:" class="postInfo-container-item">
              {{caseDetailFoemData.riskLevel}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="fullRow">
          <el-col :span="24">
            <el-form-item label="备注(关联案件说明):" class="postInfo-container-item">
              {{caseDetailFoemData.aliRemarks}}
            </el-form-item>
          </el-col>
        </el-row>
      </template>
    </el-form>
  </div>
</template>

<script>
  import {
    queryCustomerContactByCustIdUrl,
    queryCustomerContactByCustContactIdUrl
    // queryCountry
  } from '@/api/caseDetail'
  import Goods from '../Goods'
  import pagination from '@/components/Pagination'
  import YZgrid from '../YZgrid'
  import {querycustSelectClass} from "../../../../../api/customerList";
  import OverseasQuotation from "../OverseasQuotation";
  import {queryCurrencyUrl} from "../../../../../api/billApi";
  import CheckGoodsList from "@/views/workbench/case/components/CheckGoodsList.vue";
  import {queryImageGoodsList} from "@/api/caseList";
import { template } from 'underscore';

  const appTextShowzr = {
    title: '申请人(受让人)信息',
    cnname: '申请人(受让人)中文名称',
    enname: '申请人(受让人)英文名称',
    type: '申请人(受让人)类型',
    cnaddr: '申请人(受让人)中文地址',
    enaddr: '申请人(受让人)英文地址',
    uploadlang: '受让人上传文件的语言类型'
  }
  const appTextShowxk = {
    title: '申请人(许可人)信息',
    cnname: '申请人(许可人)中文名称',
    enname: '申请人(许可人)英文名称',
    type: '申请人(许可人)类型',
    cnaddr: '申请人(许可人)中文地址',
    enaddr: '申请人(许可人)英文地址',
    uploadlang: '申请人(许可人)上传文件的语言类型'
  }
  const yydbTextShowxk = {
    title: '异议人信息',
    cnname: '异议人中文名称',
    enname: '异议人英文名称'
    // cnaddr: "异议人中文地址",
    // enaddr: "异议人英文地址",
    // dlzz: "异议人代理组织"
  }
  const yyxgTextShowxk = {
    title: '被申请人信息',
    cnname: '被申请人中文名称',
    enname: '被申请人英文名称',
    cnaddr: '被申请人中文地址',
    enaddr: '被申请人英文地址',
    dlzz: '被申请人代理组织'
  }
  const byzcfsTextShowxk = {
    title: '被申请人(不予注册复审申请人)信息',
    cnname: '被申请人(不予注册复审申请人)中文名称',
    enname: '被申请人(不予注册复审申请人)英文名称',
    cnaddr: '被申请人(不予注册复审申请人)中文地址',
    enaddr: '被申请人(不予注册复审申请人)英文地址',
    dlzz: '被申请人(不予注册复审申请人)代理组织'
  }
  const yycsTextShowxk = {
    title: '被申请人(撤销人)信息',
    cnname: '被申请人(撤销人)中文名称',
    enname: '被申请人(撤销人)英文名称'
    // cnaddr: "被申请人(撤销人)中文地址",
    // enaddr: "被申请人(撤销人)英文地址",
    // dlzz: "被申请人(撤销人)代理组织"
  }
  const yycssTextShowxk = {
    title: '被申请人(注册人)信息',
    cnname: '被申请人(注册人)中文名称',
    enname: '被申请人(注册人)英文名称'
    // cnaddr: "被申请人(注册人)中文地址",
    // enaddr: "被申请人(注册人)英文地址",
    // dlzz: "被申请人(注册人)代理组织"
  }
  export default {
    props: {
      caseDetailFoemData: {},
      sign: {}
    },
    name: 'caseDetail',
    data() {
      return {
        preChangeAppCnNameMap : {
          1:"申请人变更名称",
          2:"代表人变更名称",
          3:"复审申请人变更名称",
        },
        checkGoodListTotal: 0,
        checkGoodList: [],
        currencyList: [],
        goodsVersionList: [],
        flTitleList: [
          { 'title': '法律条款', 'value': 'law', 'editable': false },
          { 'title': '事实理由', 'value': 'reason', 'editable': false },
          { 'title': '附件', 'value': 'material', 'editable': false }
        ],
        zjTitleList: [
          { 'title': '法律条款', 'value': 'law', 'editable': false },
          { 'title': '事实理由', 'value': 'reason', 'editable': false },
          { 'title': '附件', 'value': 'material', 'editable': false },
          { 'title': '创建日期', 'value': 'createDate', 'editable': false },
        ],
        yyTitleList: [
          { 'title': '中文名称', 'value': 'nameCn', 'editable': false },
          { 'title': '英文名称', 'value': 'nameEn', 'editable': false }
        ],
        yzTitleList: [
          { 'title': '引证商标号', 'value': 'quoteRegNumber', 'editable': false, },
          { 'title': '引证商标名称', 'value': 'quoteTm', 'editable': false },
          { 'title': '引证商标类别', 'value': 'quoteTmClass', 'editable': false },
          { 'title': '引证商标申请人', 'value': 'quoteAppName', 'editable': false },
        ],
        tyimage: '',
        caseType_str: '',
        customerContacts: [],
        customerMailAdds: [],
        billContacts: [],
        billAdds: [],
        //countryList:[]
        pageGoodsw: [],
        goodslistPageDataw: {
          total: 0,
          pageNo: 1,
          pageSize: 10
        },
        tmlist: [
          "变名变址",
          "续展",
          "变更注册申请代理机构",
          "删减商品项目",
          "更正商标申请事项",
          '转让/移转'
        ],
        supplementList: [
          '国际注册驳回复审',
          '注册驳回复审',
        ],
        showType: false,
        yyTextShowxk: {
          title: '被异议人',
          cnname: '被异议人中文名称',
          enname: '被异议人英文名称',
          cnaddr: '被异议人中文地址',
          enaddr: '被异议人英文地址',
          dlzz: '被异议人代理组织'
        },
        appTextShow: {
          title: '申请人信息',
          cnname: '申请人中文名称',
          enname: '申请人英文名称',
          type: '主体法律性质',
          cnaddr: '申请人中文地址',
          enaddr: '申请人英文地址',
          uploadlang: '上传文件的语言类型'
        },
        trademarkList: ['商标注册',
          '答复临时驳回/审查意见（境外）',
          '提供使用声明/证据（境外）',
          '签署代理合同协议',

          '商标监控总卷/协议',

          '咨询',

          '其他',

          '投标']
      }
    },
    computed: {
      isShowSubjectFile(){
        return (this.caseDetailFoemData.legalNature=='自然人' && this.caseDetailFoemData.appGJdq == '中国') || this.caseDetailFoemData.legalNature!='自然人'
      },
      transferorSubjectFile(){
        return (this.caseDetailFoemData.transferorType=='自然人' && this.caseDetailFoemData.transferorNationality == '中国') || this.caseDetailFoemData.transferorType!='自然人'
      },
      isShowForeignFileUpload(){
        if(this.caseDetailFoemData.appGJdq == '中国'){
          return false
        }else{
          return this.caseDetailFoemData.appCertFileIsCn == '否' || this.caseDetailFoemData.uploadFileLanguage==='外文'
        }
      }
    },
    created() {
      this.init()
      if (this.caseDetailFoemData.imageFile) {
        if (/^tmFile|\/tmFile/.test(this.caseDetailFoemData.imageFile)) {
          this.tyimage = `${this.caseDetailFoemData.imageFile}`
        } else {
          this.tyimage = `/ipdoc${this.caseDetailFoemData.imageFile}`
        }

      }
      if (this.caseDetailFoemData.agencyOffers && this.caseDetailFoemData.agencyOffers.length) {
        this.caseDetailFoemData.agencyOffers.forEach(item => {
          item.materialIds && this.$set(item, 'materialArray', item.materialIds.map(i => this.caseDetailFoemData.materials.find(j => j.materialId === i)))
        })
      }
      if (['内-外','外-外'].includes(this.caseDetailFoemData.appFromto)) {
        queryCurrencyUrl().then(res => {
          this.currencyList = res.data
        })
      }
    },
    methods: {
      //标签格式化
      formatCaseTagPath(caseTagPathList) {
        if (!Array.isArray(caseTagPathList) || !caseTagPathList.length) {
          return ''
        }
        return caseTagPathList.map(item => {
          if (typeof item === 'string') {
            return item
          }
          return item.tagName || ''
        }).filter(Boolean).join('/')
      },
      //去除字段#字符
      removeSpecial(text){
        if (text && text != 'undefined') {
          return text.replace(/#/g, '')
        }else{
          return ''
        }
      },
      getCheckGoodsList(listQuery) {
        queryImageGoodsList({
          caseId: this.caseDetailFoemData.caseId,
          ...listQuery
        }).then(res => {
          this.checkGoodList = res.data
          this.checkGoodListTotal = res.total || 0
        })
      },
      querycustSelectClass() {
        const classIdString = [1174].join(',')
        querycustSelectClass({classId: classIdString}).then(res => {
          this.goodsVersionList = res.data['1174']
        });
      },
      customerView(){
        if(!this.caseDetailFoemData.custName)return;
        window.open(`/#/workbench/customer_info?custName=${this.caseDetailFoemData.custName}`)
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
      init() {
        this.caseType_str = this.caseDetailFoemData.caseType
        this.caseDetailFoemData.caseType = this.$commonUtils.getMenuName(this.$store.state.caseInformation.caseTypeList, 'childrens').find(item => item.caseTypeId == this.caseDetailFoemData.caseTypeId).caseType

        this.queryCustomerContactByCustIdUrl()
        this.queryCustomerContactByCustContactIdUrl()
        this.getgoodsListw(this.caseDetailFoemData.goods ? this.caseDetailFoemData.goods : [])
        this.getCaseType(this.caseDetailFoemData.caseType)
        this.querycustSelectClass()
        this.getCheckGoodsList({pageSize: 10, pageNo: 1})
      },
      queryCustomerContactByCustIdUrl() {
        this.caseDetailFoemData.custId && queryCustomerContactByCustIdUrl({
          caseTypeId: this.caseDetailFoemData.caseTypeId,
          custId: this.caseDetailFoemData.custId
        })
          .then(response => {
            this.customerContacts = response.data.customerContacts
            this.billContacts = response.data.BillContacts
          })
          .catch(err => {
            console.log(err)
          })
      },
      queryCustomerContactByCustContactIdUrl() {
        queryCustomerContactByCustContactIdUrl({
          custContactId: this.caseDetailFoemData.custContactId
        }).then(res => {
          this.customerMailAdds = res.data.customerMailAdds
          this.billAdds = res.data.BillAdds
        })
      },
      getgoodsListw(goods) {
        this.goodslistPageDataw.total = goods.length
        var offset =
          (this.goodslistPageDataw.pageNo - 1) * this.goodslistPageDataw.pageSize
        this.pageGoodsw =
          offset + this.goodslistPageDataw.pageSize >= goods.length
            ? goods.slice(offset, goods.length)
            : goods.slice(offset, offset + this.goodslistPageDataw.pageSize)
      },
      getAddressAndName(materialTypeId) {
        if (this.caseDetailFoemData.materials) {
          return this.caseDetailFoemData.materials.filter(
            item => item.materialTypeId == materialTypeId
          )
        } else {
          return []
        }
      },
      getCaseType(ch_caseTypr) {
        // if (ch_caseTypr === "转让/移转") {
        //   this.appTextShow = appTextShowzr;
        // }
        // if (this.ch_caseTypr === "许可备案") {
        //   this.appTextShow = appTextShowxk;
        // }
        if (ch_caseTypr === '异议答辩') {
          this.yyTextShowxk = yydbTextShowxk
        }
        if (ch_caseTypr === '撤三答辩（提供使用证明）' || ch_caseTypr === '撤销通用名称答辩') {
          this.yyTextShowxk = yycsTextShowxk
        }
        if (ch_caseTypr === '撤销三年停止使用申请') {
          this.yyTextShowxk = yycssTextShowxk
        }
        if (ch_caseTypr === '参加不予注册复审') {
          this.yyTextShowxk = byzcfsTextShowxk
        }

        if (
          ch_caseTypr === '无效宣告申请' ||
          ch_caseTypr === '无效宣告答辩' ||
          ch_caseTypr === '不予注册复审' ||
          ch_caseTypr === '撤销商标复审' ||
          ch_caseTypr === '无效宣告复审' ||
          ch_caseTypr === '撤销复审答辩'
        ) {
          this.yyTextShowxk = yyxgTextShowxk
        }
        if (
          ch_caseTypr === '异议' ||
          ch_caseTypr === '异议答辩' ||
          ch_caseTypr === '无效宣告申请' ||
          ch_caseTypr === '无效宣告答辩'
        ) {
          this.showType = true
          // if (this.caseDetailFoemData.respondentNameCn) {
          //   queryConflicterListUrl({
          //     fullname: this.caseDetailFoemData.respondentNameCn
          //   }).then(res => {
          //     this.selectData.liyiarr = res.data;
          //   });
          // }
        }
      }
      // queryCountry(){
      //   queryCountry()
      //     .then(response => {
      //       this.countryList = response.data;
      //     })
      //     .catch(err => {
      //       console.log(err);
      //     });
      // }
    },
    components: {
      CheckGoodsList,
      OverseasQuotation,
      YZgrid,
      pagination, Goods
    }
  }
</script>

<style lang="scss" scoped>
  .el-form {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;

    .el-row {
      // min-height: 20px;
      width: 100%;
      display: flex;
      line-height: 30px;

      .el-form-item {
        width: 100%;
        display: flex;
        border: 1px solid #ebeef5;
        border-bottom: 0;
        margin-bottom: 0;

        /deep/ .el-form-item__label {
          background: #f5f7fa;
          line-height: 30px;
        }

        /deep/ .el-form-item__content {
          line-height: 30px;
          margin-left: 0 !important;
          padding-left: 10px;
          /*background: #fff;*/
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

  .bg-purple {
    box-sizing: border-box;
    padding: 0 0 0 20px;
    background: #d3dce6;
  }

  .bg-purple-light {
    background: #e5e9f2;
  }

  .grid-content {
    min-height: 30px;
    color: #409EFF;
    line-height: 2;
  }

  .postInfo-container-item, .madrid {
    height: 100%;
  }
</style>
