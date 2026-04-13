<template>
  <div>
<!--    <header>商标递交官方</header>-->
    <div class="title" style="padding-left: 50px ">
      案件信息
    </div>
    <el-table :data="caseData" border class="el-table1" >
      <el-table-column type="index" width="60" label="序号" align="left">

      </el-table-column>
      <el-table-column align="left" :key="item.title" v-for="item,index in tableTitleList" :label="item.title" :prop="item.value">
        <template slot-scope="scope">
         <p style="margin: 0;cursor: pointer" @click="$router.push('/workbench/case/seeCaseDetail/'+scope.row.caseId)">{{scope.row[item.value]}}</p>
        </template>
      </el-table-column>
    </el-table>

    <template v-if="query.pageType!=5">
      <el-form  ref="submission" :model="submitData" :rules="rules"  label-width="206px">
        <div class="title" >
          递交事项
        </div>
        <el-row v-if="submitData.reportMatter=='申请'">
          <el-form-item label="申请方式:">
            {{submitData.submitType}}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="递交方式:" prop="submitMode" >
            <el-radio-group v-model="submitData.submitMode" @change="getSubmitType()">
              <el-radio label="3" v-if="showAutoSubmit">自动网申</el-radio>
              <el-radio label="1" >人工送达</el-radio>
              <el-radio label="2" >邮寄</el-radio>
              <el-radio v-show="autoHw" label="4">自动回文</el-radio>
              <el-radio label="5">手动网申</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="上报事项:" v-if="caseData.length" :class="(caseData[0].caseType==='商标注册')||supplementList.includes(caseData[0].caseType)?'small-el-form-item':''" prop="reportMatter">
            <el-select filterable default-first-option v-model="submitData.reportMatter" placeholder="请选择" @change="changeReportMatter">
              <el-option
                v-for="item in reportMatterList"
                :key="item.id"
                :label="item.typeName"
                :value="item.typeName">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="优先权文件后补:" class="small-el-form-item" v-if="caseData.length&&caseData[0].caseType==='商标注册'" v-show="isLoadPriorityFile">
            <el-radio-group v-model="submitData.isLoadPriorityFile" >
              <el-radio label="0">否</el-radio>
              <el-radio label="1">是</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="之后是否交补充材料:" class="small-el-form-item" v-if="caseData.length&&supplementList.includes(caseData[0].caseType)">
            <el-radio-group v-model="submitData.supplementDoc">
              <el-radio :label="false">否</el-radio>
              <el-radio :label="true">是</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-row>
        <el-row v-if="submitData.submitMode==='3'|| submitData.submitMode==='4' || submitData.submitMode==='5'">
          <el-form-item label="网申日期:"   class="small-el-form-item" >
            <el-date-picker
              v-model="submitData.onlineAppDate"
              type="date"
              :placeholder="formatDate(new Date())"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="网申付款人:" class="small-el-form-item">
            <el-select  default-first-option v-model="submitData.payUserId" placeholder="请选择" clearable filterable>
              <el-option
                v-for="item in userList"
                :key="item.userId"
                :label="item.fullname"
                :value="item.userId">
                <UserIconAndUserName :user-id="item.userId"></UserIconAndUserName>
              </el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="递交场所:" >
            <el-select  default-first-option v-model="submitData.submitPlace" clearable placeholder="请选择">
              <el-option
                v-for="item in ['商标局大厅','海淀区工商局','国际处','评审委大厅']"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="网申提交站点:" v-if="submitData.submitMode==3 || submitData.submitMode==4 || submitData.submitMode==='5'" >
            <el-select  default-first-option v-model="submitData.ukeyId" clearable placeholder="请选择">
              <el-option
                v-for="item in KeyNameList"
                :key="item.keyId"
                :label="item.keyName"
                :value="item.keyId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <template v-if="submitData.reportMatter=='补正' && ['内-内', '外-内'].includes(caseData[0] && caseData[0].appFromto || '')">
        <el-row >
          <el-form-item label="补正内容:" >
            <el-select  default-first-option multiple v-model="submitData.correctionContentArray" clearable placeholder="请选择" @change="()=>{getNewDate(submitData.submitMode)}">
              <el-option
                v-for="item in correctionContentArray"
                :key="item.id"
                :label="item.typeName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-row>



        <el-row>
          <el-form-item label="商标图样:" >
            <el-input :disabled="true" v-model="fileName[1018]"></el-input>
            <el-button style="margin-left:10px" size="mini" type="primary" @click="getfileData('1018',$event)">上传</el-button>
            <el-button style="margin-left:10px" size="mini" type="primary" @click="deleteFile(materialArray.find(item => item.materialTypeId ==1018)?materialArray.find(item => item.materialTypeId ==1018):{materialTypeId:1018})">删除</el-button>
            <!--<el-upload class="upload-btn" :on-success='fileUploadSuccess' :show-file-list='false'-->
            <!--:action="fileUrl" name='attachFile' :data="fileData('410')">-->
            <!--<el-button style="margin-left:10px" size="mini" type="primary">上传</el-button>-->
            <!--</el-upload>-->
            <div> <img v-if="tyimage" style="width:100px;height:100px;margin: 10px 10px;" :src="tyimage"></div>
            <div>图样文件格式应为jpg，图形应清晰，图样文件大小应小于“200KB”且图形像素介于“400×400－1500×1500”之间。如果通过扫
              描获得图样的，应按24位彩色、300dpi分辨率扫描符合《商标法》及其实施条例规定的图形（图形清晰，大于5×5厘米且小于10×10厘米）。
              申请人（或代理人）应确保扫描后的图形与原图形的色彩深浅（或灰度）一致，否则，可能影响《商标注册证》上图形的清晰度。）;
              以颜色组合或者着色图样申请商标注册的，应分别上传着色图样及黑白稿，黑白稿在”黑白稿“中上传。 不指定颜色的，只上传黑白图样即可。
              当图样没有正确显示时,那是因为您的图样不符合要求请勿下一步,否则递交申请会失败</div>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="商标设计说明:" class="postInfo-container-item" prop="tmDesignDeclare">
              <el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="submitData.tmDesignDeclare">
              </el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item class="postInfo-container-item" label="有关说明文件:">
              <div style="display: flex;">
                <el-input :disabled="true" v-model="fileName[1020]" />
                <el-button size="mini" style=""  @click="delFile('1020')">删除</el-button>
              </div>
              <el-button size="mini" style="margin-left:10px" type="primary" @click="getfileData('1020',$event)">上传</el-button>
          </el-form-item>
        </el-row>
        </template>
        <template v-if="submitData.reportMatter=='补充' && submitData.submitMode == 3 && ['注册驳回复审', '国际注册驳回复审', '无效宣告申请'].includes(caseData[0].caseType)">
          <el-row>
            <el-form-item class="postInfo-container-item" label="提交补充证据材料通道:">
              <div style="display: flex;margin-bottom: 10px;margin-top: 10px;">
                <span style="flex-shrink: 0;width: 110px;text-align: right;margin-right: 5px;">补充事实与理由:</span>
                <el-input :disabled="true" v-model="fileName[329]" />
                <el-button size="mini" style="margin-left:10px" type="primary" @click="getfileData('329',$event)">上传</el-button>
                <el-button size="mini" style="margin-right: 10px" @click="delFile('329')">删除</el-button>
              </div>
              <div style="display: flex;">
                <span style="flex-shrink: 0;width: 110px;text-align: right;margin-right: 5px;">补充证据目录:</span>
                <el-input :disabled="true" v-model="fileName[328]" />
                <el-button size="mini" style="margin-left:10px" type="primary" @click="getfileData('328',$event)">上传</el-button>
                <el-button size="mini" style="margin-right: 10px" @click="delFile('328')">删除</el-button>
              </div>
              <div style="display: flex;margin-bottom: 10px;margin-top: 10px;">
                <span style="flex-shrink: 0;width: 110px;text-align: right;margin-right: 5px;">补充证据内容:</span>
                <el-input :disabled="true" v-model="fileName[301601]" />
                <el-button size="mini" style="margin-left:10px" type="primary" @click="getfileData('301601',$event)">上传</el-button>
                <el-button size="mini" style="margin-right: 10px" @click="delFile('301601')">删除</el-button>
              </div>
              <div style="color: #67C23A">当前申请件剩余容量{{supCapacity}}MB</div>
              <div style="color: #F56C6C">(注意！补充材料需提交申请之日起三个月内一次性提交！)
              </div>
              <div style="color: #F56C6C">(注意！上传证据内容文件必须上传证据目录文件！)</div>
            </el-form-item>
          </el-row>
<!--          <el-row>-->
<!--            <el-form-item class="postInfo-container-item" label="补充事实与理由:">-->
<!--              <div style="display: flex;">-->
<!--                <el-input :disabled="true" v-model="fileName[329]" />-->
<!--                <el-button size="mini" style=""  @click="delFile('329')">删除</el-button>-->
<!--              </div>-->
<!--              <el-button size="mini" style="margin-left:10px" type="primary" @click="getfileData('329',$event)">上传</el-button>-->
<!--            </el-form-item>-->
<!--          </el-row>-->
<!--          <el-row>-->
<!--            <el-form-item class="postInfo-container-item" label="补充证据目录:">-->
<!--                <div style="display: flex;">-->
<!--                  <el-input :disabled="true" v-model="fileName[328]" />-->
<!--                  <el-button size="mini" style=""  @click="delFile('328')">删除</el-button>-->
<!--                </div>-->
<!--                <el-button size="mini" style="margin-left:10px" type="primary" @click="getfileData('328',$event)">上传</el-button>-->
<!--            </el-form-item>-->
<!--          </el-row>-->
<!--          <el-row>-->
<!--            <el-form-item class="postInfo-container-item" label="补充证据内容:">-->
<!--                <div style="display: flex;">-->
<!--                  <el-input :disabled="true" v-model="fileName[301601]" />-->
<!--                  <el-button size="mini" style=""  @click="delFile('301601')">删除</el-button>-->
<!--                </div>-->
<!--                <el-button size="mini" style="margin-left:10px" type="primary" @click="getfileData('301601',$event)">上传</el-button>-->
<!--            </el-form-item>-->
<!--          </el-row>-->
        </template>
        <el-row>
          <el-form-item label="下达人:" class="small-el-form-item">
            {{this.submitData.submitUser?this.submitData.submitUser:$store.getters.name}}
          </el-form-item>
          <el-form-item label="递交日期:" class="small-el-form-item">
            <el-date-picker
              v-model="submitData.submitDate"
              :disabled="query.pageId!='104'"
              type="date"
              :placeholder="formatDate(new Date())"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </el-row>
        <el-row v-if="caseData[0]&&caseData[0].caseType == '异议' && submitData.reportMatter=='补充' && ['3','5'].includes(submitData.submitMode)">
          <el-form-item label="补充证据:">
            <div style="margin: 10px 10px 10px 0">
              <y-zgrid :materialTypeId="301606" :file-size="yyFileSumSize" :fileName="fileName[301606]" type="edit" idFlData right-key :tableTitleList="zjTitleList" :tableData="submitData.demurCaseLaws || []" :tmCaseId="caseData[0].caseId" @delete="deleteFlData" @edit="editFlData" @delYzData="delFlData" @addYzData="addFlData" @getResponseAndFile="getResponseAndFile" @deleteFile="deleteFile" @getfileData="getfileData"/>
            </div>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="备注:">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              placeholder="请输入内容"
              v-model="submitData.remarks"
            >
            </el-input>
          </el-form-item>
        </el-row>
        <transition name="fade">
          <div v-if="submitData.reportMatter=='补正' && submitData.correctionContentArray.includes(1680)"  style="width: 100%">
            <div class="title" style="padding: 0;">
              补正
            </div>
            <Goods ref="Goods" :isRevamp="caseData[0].isRevamp" :caseId="caseData[0].caseId" :appId='submitData.appId' @getGoods='getGoods' @delgood='delgood' :goodsListData='submitData.goods'></Goods>
          </div>
        </transition>
      </el-form>
      <div class="button_wrap">
        <el-button class="exactButton" type="primary" @click="submit(0)" v-if="query.pageType=='1'||query.pageType=='2'">保存</el-button>
        <el-button class="exactButton" plain @click="cancel">返回</el-button>
        <el-button class="exactButton" type="primary" :disabled="query.pageId != 104 && isZhuanxie" @click="submit(1)" v-if="query.pageType=='1'||query.pageType=='2'">{{ query.pageId==104? '审核': '递交' }}</el-button>
        <el-button class="exactButton" type="primary" @click="submit(2)" v-if="query.pageType=='3'">修改</el-button>
        <el-button class="exactButton" type="primary" @click="submit(1)" v-if="query.pageType=='4'">确定</el-button>
      </div>
    </template>
    <template v-if="query.pageType==5">
      <el-form  ref="submission" :model="submitData"   label-width="206px">
        <div class="title" >
          递交事项
        </div>
        <el-row v-if="submitData.reportMatter=='申请'">
          <el-form-item label="申请方式:" prop="submitType">
            <span v-if="submitData.submitType=='网上申请'">网上申请</span>
            <span v-if="submitData.submitType=='线下申请'">线下申请</span>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="递交方式:">
            <span v-if="submitData.submitMode==3">自动网申</span>
            <span v-if="submitData.submitMode==1">人工送达</span>
            <span v-if="submitData.submitMode==2">邮寄</span>
            <span v-if="submitData.submitMode==4 && autoHw">自动回文</span>
            <span v-if="submitData.submitMode==5">手动网申</span>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="上报事项:" v-if="caseData.length" :class="(caseData[0].caseType==='商标注册')||supplementList.includes(caseData[0].caseType)?'small-el-form-item':''">
           {{submitData.reportMatter}}
          </el-form-item>
          <el-form-item label="优先权文件后补:" class="small-el-form-item" v-if="caseData.length&&caseData[0].caseType==='商标注册'">
            <span v-if="submitData.isLoadPriorityFile==0">否</span>
            <span v-if="submitData.isLoadPriorityFile==1">是</span>
          </el-form-item>
          <el-form-item label="之后是否交补充材料:" class="small-el-form-item" v-if="caseData.length&&supplementList.includes(caseData[0].caseType)">
            <span v-if="submitData.supplementDoc">是</span>
            <span v-if="!submitData.supplementDoc">否</span>
          </el-form-item>
        </el-row>
        <el-row v-if="submitData.submitMode==='3'|| submitData.submitMode==='4' || submitData.submitMode==='5'">
          <el-form-item label="网申日期:"   class="small-el-form-item" >
           {{submitData.onlineAppDate}}
          </el-form-item>
          <el-form-item label="网申付款人:" class="small-el-form-item">
            {{transformation(userList,submitData.payUserId,'userId','fullname')}}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="递交场所:" >
            {{submitData.submitPlace}}
          </el-form-item>
          <el-form-item label="网申提交站点:" v-if="submitData.submitMode==3 || submitData.submitMode==4 || submitData.submitMode==='5'">
            {{transformation(KeyNameList,submitData.ukeyId,'keyId','keyName')}}
          </el-form-item>
        </el-row>
        <template v-if="submitData.reportMatter=='补正' && ['内-内', '外-内'].includes(caseData[0] && caseData[0].appFromto || '')">


        <el-row >
          <el-form-item label="补正内容:">
            {{submitData.correctionContentArray.map(item=>transformation(correctionContentArray,item,'id','typeName')).join(',')}}
          </el-form-item>

        </el-row>
        <el-row>
          <el-form-item label="商标图样:" >
            <el-input :disabled="true" v-model="fileName[1018]"></el-input>
            <div> <img v-if="tyimage" style="width:100px;height:100px;margin: 10px 10px;" :src="tyimage"></div>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="商标设计说明:" class="postInfo-container-item" prop="tmDesignDeclare">
          {{submitData.tmDesignDeclare}}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item class="postInfo-container-item" label="有关说明文件:">
          {{fileName[1020]}}
          </el-form-item>
        </el-row>
        </template>
        <template v-if="submitData.reportMatter=='补充' && submitData.submitMode == 3 && ['注册驳回复审', '国际注册驳回复审', '无效宣告申请'].includes(caseData[0].caseType)">
          <el-row>
            <el-form-item class="postInfo-container-item" label="补充事实与理由:">
              {{fileName[329]}}
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item class="postInfo-container-item" label="补充证据目录:">
              {{fileName[328]}}
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item class="postInfo-container-item" label="补充证据内容:">
              {{fileName[301601]}}
            </el-form-item>
          </el-row>
        </template>
        <el-row>
          <el-form-item label="下达人:" class="small-el-form-item">
            {{submitData.submitUser}}
          </el-form-item>
          <el-form-item label="递交日期:" class="small-el-form-item">
           {{submitData.submitDate}}
          </el-form-item>
        </el-row>
        <el-row v-if="caseData[0]&&caseData[0].caseType == '异议' && submitData.reportMatter=='补充' && submitData.submitMode == 3">
          <el-form-item label="补充证据:">
            <div style="margin: 10px 10px 10px 0">
              <y-zgrid type="view" idFlData right-key :tableTitleList="zjTitleList" :tableData="submitData.demurCaseLaws || []" :tmCaseId="caseData[0].caseId" />

            </div>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="备注:">
           {{submitData.remarks}}
          </el-form-item>
        </el-row>
        <transition name="fade">
          <div v-if="submitData.reportMatter=='补正' && submitData.correctionContentArray.includes(1680)" style="width: 100%">
            <div class="title" style="padding: 0;">
              补正
            </div>
            <Goods ref="Goods"  :isRevamp="caseData[0].isRevamp" :caseId="caseData[0].caseId"  :appId='submitData.appId' @getGoods='getGoods' @delgood='delgood' :goodsListData='submitData.goods'></Goods>
          </div>
        </transition>
      </el-form>
      <div class="button_wrap">
        <el-button class="exactButton" plain @click="cancel">返回</el-button>
        <el-button v-if="submitData.reportMatter=='补正'" class="exactButton" type="primary" @click="submit(2)">修改</el-button>
<!--        <el-button class="exactButton" type="primary" @click="submit(1)" v-if="query.pageType=='1'||query.pageType=='2'">{{ query.pageId==104? '审核': '确定' }}</el-button>-->
<!--        <el-button class="exactButton" type="primary" @click="submit(2)" v-if="query.pageType==5">修改</el-button>-->
<!--        <el-button class="exactButton" type="primary" @click="submit(1)" v-if="query.pageType=='4'">确定</el-button>-->
      </div>
    </template>
    <el-dialog
      v-dialogDrag
      top="0"
      :visible.sync="poppingTimeLimitState"
      width="60%"
      :close-on-click-modal="false"
      :show-close="false"
      :close-on-press-escape="false"
      :lock-scroll="false"
      :modal="false"
      title="创建时限"
      class="dialog——body——padding"
      center
    >
      <poppingTimeLimit v-if="poppingTimeLimitState"  @cancel="closePoppingTimeLimit" :list="caseDataList"></poppingTimeLimit>
    </el-dialog>
    <DataUploadOrSelect v-if="DataUploadOrSelectState" :reportMatter="submitData.reportMatter" :materialArray="materialArray" :caseType="caseData[0]&&caseData[0].caseType || ''" isDetailSubmission :dialogVisible="DataUploadOrSelectState" :fileName="fileName" :fileData="fileData1" :title="curUploadTitle"  @getResponseAndFile="getResponseAndFile"  @closedialogVisible="DataUploadOrSelectState=false" @deleteCaseMaterial="deleteFile"></DataUploadOrSelect>
    <!--    FlView-->
    <el-dialog title="提示" :visible.sync="FlView" width="40%" :before-close="closeFlView" append-to-body>
      <el-row>
        <el-col :span="24" style="text-align: center">
          <el-form label-width="100px" :model="flData">
            <el-row>
              <el-form-item label="法律条款:">
                <el-select style="width: 100%" :clearable="true" default-first-option filterable placeholder="请选择" v-model="flData.law">
                  <el-option :key="key" :label="item.typeName" :value="item.typeName" v-for="(item,key) in lawArray" />
                </el-select>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="事实理由:">
                <div style="display: flex">
                  <el-input type="textarea" placeholder="请填写事实理由(不超过4000字)" maxLength="4000" v-model="flData.reason"></el-input>
                </div>
                <div style="float: right;height: 20px;line-height: 20px;font-size: 12px;color: #606266;">
                  <span style=""><span>{{flData.reason.length}}</span>/4000</span>
                </div>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="证据材料:">
                <div class="fl-ac-jc">
                  <el-input disabled v-model="flData.material&&flData.material.materialName"></el-input>
                  <el-upload
                      ref="uploads"
                      class="upload-demo1"
                      :before-upload="zjbeforeUpload"
                      :on-success="zjonsuccess"
                      :data="zjgetUploadData()"
                      :action="creatematerial"
                      name="attachFile"
                      :multiple="false"
                      :show-file-list="false"
                  >
                    <el-button size="small" type="primary">上传</el-button>
                  </el-upload>
                </div>
                <div style="float: right;height: 20px;line-height: 20px;font-size: 12px;color: #606266;margin-right: 60px">
                  <span style="color: #F56C6C"><span>本次补充证据材料剩余容量{{200 - flDataFileSize}}MB</span></span>
                </div>
              </el-form-item>
            </el-row>

          </el-form>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer fl-ac-jc">
        <el-button size="small" @click="() => closeFlView()">取 消</el-button>
        <el-button size="small" type="primary" @click="submitFl">确 定</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script>
import JsPDF from 'jspdf'
  import DataUploadOrSelect from "@/components/DataUploadOrSelect";
  import {
    queryUserAll, queryMaterialByCaseId, queryKeyName, delCaseMaterial, queryMaterialType, submitOffical,
    queryInstruction, submitOfficalAudit, queryCase, submitOfficalModify, modifyMaterialType, getSubmitDate,
    createSubmitOfficials
  } from '@/api/caseList.js'
import { querycustSelectClass } from '@/api/customerList.js'
import { creatematerial } from '@/api/ipServiceApi.config.js'
import { getEndDate ,getLanglist} from  '@/utils/index.js'
import Goods from '@/views/workbench/case/components/Goods.vue'
import  poppingTimeLimit from '@/views/workbench/toDoTasks/poppingTimeLimit.vue'
import {
delCaseMaterialUrl,
} from "@/api/caseDetail";
  import {deleteMaterial} from "../../../../../api/customerList";
  import YZgrid from "../../components/YZgrid";
  import {analysisFile} from "../../../../../api/caseDetail";
  import {querymaterialbyapp} from "../../../../../api/caseList";
export default {
  name: "detailSubmission",
  data() {
    return {
      yyFileSumSize: '',
      bcMaterialList: [],
      flDataFileSize: 0,
        creatematerial,
        flDataIndex: '',
        flData: {
          law: '',
          reason: '',
          materialId: '',
          material: {}
        },
        FlView: false,
        FlEditView: false,
      lawArray: [],
      zjTitleList: [
          { 'title': '法律条款', 'value': 'law', 'editable': false },
          { 'title': '事实理由', 'value': 'reason', 'editable': false },
          { 'title': '附件', 'value': 'material', 'editable': false },
          { 'title': '创建日期', 'value': 'createDate', 'editable': false },
        ],
      poppingTimeLimitState:false,
      caseDataList:[],
      rules: {
        submitType: [{ required: true, message: '请选择申请方式', trigger: 'blur'}],
        submitMode: [{ required: true, message: '请选择递交方式', trigger: 'blur'}],
        reportMatter: [{ required: true, message: '请选择上报事项', trigger: ['blur','change'] }]
      },
      caseData: [],
      tableTitleList:[{"title":"案件文号", "value": "agentNum" },{"title":"案件类型","value":"caseType","boo":"2"},{"title":"商标名称","value":"tmName"},{"title":"商标号","value":"regNumber"},{"title":"商标类别","value":"goodClasses"},{"title":"客户","value":"custName" },{"title":"申请人中文名称","value":"appCnName","boo":"1"},{"title":"阶段","value":"stageName" }],
      submitData: {
        submitType: '',
        tmDesignDeclare:null,
        submitMode: '',
        isLoadPriorityFile: null,
        submitDate: '',
        onlineAppDate: '',
        supplementDoc: null,
        ukeyId: '',
        goods:[],
        correctionContentArray:[],
        demurCaseLaws: []
      },

      fileName: {
        "1000": "",
        "1001": "",
        "1002": "",
        "1003": "",
        "1004": "",
        "1005": "",
        "1006": "",
        "1007": "",
        "1008": "",
        "1009": "",
        "1010": "",
        "1011": "",
        "1012": "",
        "1013": "",
        "1014": "",
        "1015": "",
        "1016": "",
        "1017": "",
        "1018": "",
        "1019": "",
        "1020": "",
        "1021": "",
        "1022": "",
        "1023": "",
        "1024": "",
        "1025": "",
        "1026": "",
        "1027": "",
        "1028": "",
        "1029": "",
        "1030": "",
        "1031": "",
        "1032": "",
        "1033": "",
        "1034": "",
        "1035": "",
        "1036": "",
        "1037": "",
        "1038": "",
        "1039": "",
        "1040": ""
      },
      isLoadPriorityFile:null,
      supplementDoc:null,
      reportMatter: '',
      reportMatterList: [],
      correctionContentArray:[],
      creatematerial,
      uploadTable: [],
      typeNameList: [],
      docName: '',
      materialTypeId: '',
      materialArrayList: [],
      userList: [],
      KeyNameList:[],
      submitModeFlag: false,
      tmlist: ['补发商标注册证', '补发商标变转续证明', '撤回商标申请', '变名变址', '续展', '变更注册申请代理机构', '删减商品项目', '许可备案', '更正商标申请事项', '转让/移转'],
      tmlist2: ['商标注销', '分割申请', '无效宣告申请', '异议答辩', '异议', '无效宣告答辩', '注册驳回复审', '国际注册驳回复审', '撤三答辩（提供证明使用）', '撤销三年停止使用申请', '撤销商标复审', '不予注册复审'],
      supplementList: [
        '异议',
        '注册驳回复审',
        '国际注册驳回复审',
        '撤销商标复审',
        '不予注册复审',
        '异议答辩',
        '撤三答辩（提供使用证明）',
        '撤销通用名称答辩',
        '参与不予注册复审',
        '无效宣告答辩',
        '撤销复审答辩',
        '撤销三年停止使用申请',
        '撤销成为通用名称注册商标',
        '无效宣告申请',
        '无效宣告复审'
        ],
      curUploadTitle:'',
      fileData1:{},
      DataUploadOrSelectState:false,
      caseDetailFoemData:{

      },
      materialArray:[],
      tyimage:''
    }
  },
  props:{
    query:{

    }
  },
  created() {
    // if (!this.query.caseIds) {
    //   this.$router.replace('/workbench/toDoTask')
    //   return
    // }
    this.init()
  },
  methods:{
    checkFileSize(materialTypeIdList = [], file) {
      let result = true
//       var pdf = new jsPDF();
//       // this.materialArray
//       var reader = new FileReader();
//
// // // 读取PDF文件流
//       const pdfData = URL.createObjectURL(file);
//       reader.readAsArrayBuffer(pdfData);
//
// // 当文件读取完成时
//       reader.onloadend = function() {
//         // 创建一个Uint8Array对象
//         var arrayBuffer = reader.result;
//         var uint8Array = new Uint8Array(arrayBuffer);
//
//         // 创建一个新的jspdf实例
//         var doc = new jsPDF();
//
//         // 加载PDF文件流
//         doc.load(uint8Array);
//
//         // 获取页面的宽度和高度
//         var width = doc.internal.pageSize.getWidth();
//         var height = doc.internal.pageSize.getHeight();
//
//         console.log('PDF宽度：', width);
//         console.log('PDF高度：', height);
      if(materialTypeIdList.find(item => [328, 329, 301601].includes(item))) {

      }
      return result
    },
    delFile(materialTypeId) {
      this.fileName[materialTypeId] = ''
      this.materialArray = this.materialArray.filter(item => item.materialTypeId != materialTypeId)
      this.submitData.materials = this.materialArray.filter(item => item.materialTypeId != materialTypeId)
      this.submitData.materialIdList = this.materialArray.map(item => item.materialId)
    },
    analysisFileFunc(materialId){
        analysisFile({
          caseId: this.caseData[0].caseId,
          materialId
        }).then(res => {
          this.yyFileSumSize = res.data.yyFileSumSize
          this.$set(this.submitData, 'demurCaseLaws', res.data.trademarkDemurCaseLawList || [])
        })
      },
    computeFileSize(size) {
        this.flDataFileSize = this.submitData.demurCaseLaws && this.$wUtil.formatFloat(this.submitData.demurCaseLaws.reduce((pre, next) => pre + (next.material && next.material.size && next.material.size || 0), size || 0) / 1024 / 1024, 2);
      },
      zjbeforeUpload(file) {
        const limitSize = 200 * 1024 * 1024
        const currentSize = this.submitData.demurCaseLaws && this.submitData.demurCaseLaws.reduce((pre, next) => pre + (next.material && next.material.size && next.material.size || 0), file.size || 0)
        if (currentSize > limitSize) {
          this.$message.error('所有证据材料加在一起不能超过200MB!')
          return false
        }
        const name = file.name.toLowerCase().replace(/.+\./g, '')
        if (!name.includes('pdf')) {
          this.$message.warning('请上传PDF类型的文件！')
          return false
        }
      },
      zjhandleRemove(file, fileList, caseId) {
        let delmaterialId;
        if (file.response) {
          delmaterialId = file.response.data[0].materialId
        } else {
          delmaterialId = file.materialId
        }
        deleteMaterial({materialId: delmaterialId}).then(res => {
          this.flData.material = {}
          this.flData.materialId = ''
        })
      },
      zjonsuccess(response, file, fileList) {
        response.data[0].name = response.data[0].materialName
        this.flData.material = response.data[0]
        this.flData.materialId = response.data[0].materialId
        this.computeFileSize(file.size)
      },
      zjgetUploadData() {
        const data = {
          tokenID: this.$store.getters.token,
          caseIds: this.caseData.map(item => item.caseId),
          materialTypeId: 301605
        }
        return data
      },
      submitFl(){
      if (!this.submitData.demurCaseLaws) {
        this.$set(this.submitData, 'demurCaseLaws', [])
      }
        if (this.FlEditView) {
          this.submitData.demurCaseLaws.splice(+this.flDataIndex, 1, this.flData)
        } else {
         this.submitData.demurCaseLaws.push(this.flData)
        }
        this.closeFlView()
      },
      closeFlView(done) {
        this.FlView = false
        this.flData = {
          law: '',
          reason: '',
          materialId: '',
          material: {}
        }
        this.FlEditView = false
        this.flDataFileSize = 0
        done && done()
      },
      delFlData(items) { // 批量删除
        this.submitData.demurCaseLaws = this.submitData.demurCaseLaws.filter(
          data => !items.includes(data)
        );
      },
      deleteFlData(row){ // 单个删除
        this.delFlData([row])
      },
      editFlData(row, index){
        this.FlView = true
        this.FlEditView = true
        this.flDataIndex = index
        this.flData = JSON.parse(JSON.stringify(row))
        this.computeFileSize()
      },
      addFlData() {
        this.FlView = true
        this.computeFileSize()
      },
    init(){
      if (!this.query.caseIds) {
        this.$router.replace('/workbench/toDoTask')
        return
      }
      this.queryAlltask()
      this.querycustSelectClass()
      this.queryUserAll()
      this.queryMaterialType()
      this.queryKeyName()
    },
    initfilelist() {
      if (this.submitData.imageFile) {
        if(/^tmFile|\/tmFile/.test(this.submitData.imageFile)){
          this.tyimage = `${this.submitData.imageFile}`;
        }else {
          this.tyimage = `/ipdoc${this.submitData.imageFile}`;
        }
      }
      // this.materialArray = this.caseDetailFoemData.materials || []
      this.materialArray = [...new Set(this.$commonUtils.unique(this.submitData.materials && this.submitData.materials.reverse() || [], 'materialTypeId'))].reverse()
      // this.submitData.materialIdList = this.materialArray.map(item => item.materialId)
      this.materialArray.forEach(ite => {
        this.fileName[ite.materialTypeId] = ite.materialName;
      });
    },
    deleteFile({ materialTypeId, materialId }) {
      let delmaterialId;
      if(!this.materialArray.find(item => item.materialTypeId == materialTypeId)&&materialTypeId==1018){
        this.caseDetailFoemData.imageFile= '0000'
        this.tyimage=''
        return
      }
      if (!materialId) {
        delmaterialId = this.materialArray.find(item => item.materialTypeId == materialTypeId).materialId;
      } else {
        delmaterialId = materialId;
      }
      delCaseMaterialUrl({
        caseIdArray: this.caseData.map(item=>item.caseId),
        materialId: delmaterialId
      }).then(res => {
        this.fileName[materialTypeId] = "";
        if(materialTypeId==1018){
          this.caseDetailFoemData.imageFile= '0000'
          this.tyimage=''
        }
        if (this.submitData.reportMatter=='补充') {
          this.submitData.materialIdList.splice(this.submitData.materialIdList.indexOf(materialId), 1)
        }
        if (materialId&&materialTypeId == "1000") {
          this.wtsfileList.splice(
            this.wtsfileList.map(item => item.materialId).indexOf(materialId),
            1
          );
        }
      });
    },
    getfileData(materialTypeId, e) {
      this.curUploadTitle = e.target.offsetParent.previousSibling.innerText.replace(
        /[:]$/g,
        ""
      );
      let data = {
        caseIds: this.caseData.map(item=>item.caseId),
        caseId: this.caseData.map(item=>item.caseId)[0],
        // custId: this.caseDetailFoemData.custId,
        type: "2",
        // caseId: this.caseDetailFoemData.caseId,
        materialTypeId: materialTypeId,

        tokenID: this.$store.getters.token
      };
      this.fileData1 = data;
      this.DataUploadOrSelectState = true;
    },
    getResponseAndFile(data) {
      let { response, file } = data;
      if (response.data.length == "1") {
        if (this.submitData.reportMatter=='补充') {
          if (!this.submitData.materialIdList) {
            this.submitData.materialIdList = []
          }
          // this.submitData.materialIdList.push(response.data[0].materialId)
        }
        if (response.data[0].materialTypeId == "301606") {
            this.analysisFileFunc(response.data[0].materialId)
          }
        if (response.data[0].materialTypeId == "1000") {
          response.data[0].name = response.data[0].materialName;
          this.wtsfileList.push(response.data[0]);
        }else {
          // if (
          //   this.materialArray.find(
          //     item => item.materialTypeId == response.data[0].materialTypeId
          //   )
          // ) {
          //   for (var key in response.data[0]) {
          //     this.materialArray.find(
          //       item => item.materialTypeId == response.data[0].materialTypeId
          //     )[key] = response.data[0][key];
          //   }
          // } else {
          //   this.materialArray.push(response.data[0]);
          // }
          // this.submitData.materialIdList = this.materialArray.map(item => item.materialId)
        }
        // 所有类型文件只保留一份
        if (
            this.materialArray.find(
              item => item.materialTypeId == response.data[0].materialTypeId
            )
          ) {
            for (var key in response.data[0]) {
              this.materialArray.find(
                item => item.materialTypeId == response.data[0].materialTypeId
              )[key] = response.data[0][key];
            }
          } else {
            this.materialArray.push(response.data[0]);
          }
          this.submitData.materialIdList = this.materialArray.map(item => item.materialId)
        if (file) {
          this.fileName[response.data[0].materialTypeId] = file.name;
        } else {
          this.fileName[response.data[0].materialTypeId] =
            response.data[0].materialName;
        }

        if (response.data[0].materialTypeId == "1018") {
          if (file) {
            this.tyimage = URL.createObjectURL(file.raw);
            this.caseDetailFoemData.imageFile = response.data[0].address
          } else {
            this.tyimage = "ipdoc/" + response.data[0].address;
            this.caseDetailFoemData.imageFile = response.data[0].address
          }
        }
      }
    },
    getGoods(goods) {
      goods.forEach(item=>{
        this.submitData.goods.push(item)
      })

      // this.submitData.goods = [
      //   ...this.submitData.goods,
      //   ...goods
      // ];

      const res = new Map();
      this.submitData.goods = this.submitData.goods.filter(
        item => !res.has(item.goodName) && res.set(item.goodName, 1)
      );
      console.log(this.submitData.goods);
    },
    delgood(items) {
      this.$set(this.submitData,'goods',this.submitData.goods.filter(
        data => !items.includes(data)
      ))
      this.submitData.goods.push({})
      this.submitData.goods.pop()
      // this.submitData.goods = this.submitData.goods.filter(
      //   data => !items.includes(data)
      // );
    },
    changeReportMatter(e){
      if (this.query.pageType == '1') {
        if (e == '补充') {
          this.fileName = {
              "1000": "",
              "1001": "",
              "1002": "",
              "1003": "",
              "1004": "",
              "1005": "",
              "1006": "",
              "1007": "",
              "1008": "",
              "1009": "",
              "1010": "",
              "1011": "",
              "1012": "",
              "1013": "",
              "1014": "",
              "1015": "",
              "1016": "",
              "1017": "",
              "1018": "",
              "1019": "",
              "1020": "",
              "1021": "",
              "1022": "",
              "1023": "",
              "1024": "",
              "1025": "",
              "1026": "",
              "1027": "",
              "1028": "",
              "1029": "",
              "1030": "",
              "1031": "",
              "1032": "",
              "1033": "",
              "1034": "",
              "1035": "",
              "1036": "",
              "1037": "",
              "1038": "",
              "1039": "",
              "1040": "",
              "329": '',
              "328": '',
              "301601": ''
            }
            this.materialArray = []
            this.submitData.materialIdList = []
            if (this.caseData.map(item => item.caseId).length) {
              const data = {
                caseId: this.caseData.map(item => item.caseId)[0],
                materialTypeIdList: [329, 328, 301601],
              };
              querymaterialbyapp(data).then(res => {
                this.materialArray = [...new Set(this.$commonUtils.unique(res.data.reverse(), 'materialTypeId'))].reverse()
                this.submitData.materialIdList = this.materialArray.map(item => item.materialId)
                this.materialArray.forEach(ite => {
                  this.fileName[ite.materialTypeId] = ite.materialName;
                })
              });
            }
        } else {
          // this.initfilelist()
        }
      }
      if (!this.showAutoSubmit&&this.submitData.submitMode=='3') {
        this.submitData.submitMode = "1"
      }
      this.getSubmitType()
      this.getNewDate(this.submitData.submitMode)
      if(this.caseData[0].caseType==='商标注册'){
        if(e=='申请'){
          this.submitData.isLoadPriorityFile = this.isLoadPriorityFile
        }else{
          this.submitData.isLoadPriorityFile = null
        }
      }
      if(this.supplementList.includes(this.caseData[0].caseType)){
        if(e=='申请'){
          this.submitData.supplementDoc = this.supplementDoc
        }else{
          this.submitData.supplementDoc = null
        }
      }
    },
    getSubmitType(){
      if((this.submitData.submitMode==3||this.submitData.submitMode==4||this.submitData.submitMode==5)&&this.submitData.reportMatter=='申请'){
         this.submitData.submitType='网上申请'
      }
      if((this.submitData.submitMode==1||this.submitData.submitMode==2)&&this.submitData.reportMatter=='申请'){
        this.submitData.submitType = '线下申请'
      }
    },
    queryKeyName(){
      let caseId;
      if (Object.prototype.toString.call(this.query.caseIds).includes('Array')) {
        caseId=this.query.caseIds[0]
      }else {
        caseId=this.query.caseIds
      }
      queryKeyName({caseId:caseId}).then(res=>{
        this.KeyNameList=res.data.filter(item=>item)
        if(!this.submitData.ukeyId){
          // if(this.KeyNameList&&this.KeyNameList.length){
            // this.submitData.ukeyId= this.KeyNameList[0].keyId
          // }
        }
      })
    },
    getSubmitDate(){
      getSubmitDate().then(res=>{
        this.submitData.submitDate=res.data
      })
    },
    queryInstruction(){
      const data = {
        userId: this.$store.getters.userId,
        caseIds: this.query.caseIds,
        insIdList: this.query.insId
      }
      if (Object.prototype.toString.call(this.query.caseIds).includes('Array')) {
        return
      }
      queryInstruction(data).then(res => {
         const newSubmitData = res.data.find(item=>item.insId ==this.query.insId)

        if (newSubmitData.submitMode) {
          newSubmitData.goods=this.submitData.goods
          this.submitData = newSubmitData
          this.$set( this.submitData,'tmDesignDeclare',this.caseData[0].tmDesignDeclare)
          this.submitData.submitMode = this.getsubmitMode1(this.submitData.submitMode)
          if (newSubmitData.materials.length) {
            this.docName = newSubmitData.materials[0].docName
            let timer = setInterval(() => {
              if (this.typeNameList.length) {
                if( newSubmitData.materials[0].typeName){
                  const material = this.typeNameList.find(item => item.typeName === newSubmitData.materials[0].typeName)
                  if (material) {
                    this.materialTypeId = material.materialTypeId
                  }
                }
                clearInterval(timer)
              }
            },30)
          }
        }
        if(newSubmitData.isLoadPriorityFile!=null){
          this.submitData.isLoadPriorityFile = newSubmitData.isLoadPriorityFile
        }
        if(newSubmitData.supplementDoc!=null){
          this.submitData.supplementDoc = newSubmitData.supplementDoc
        }
        this.submitData.submitDate = newSubmitData.submitDate
        if(this.query.pageId == 104&&this.pageType==2){
          if(newSubmitData.submitDate==this.formatDate( new Date(new Date(new Date().toLocaleDateString()).getTime() + 24*60*60*1000).toLocaleDateString())){
             this.submitData.submitDate=this.formatDate( new Date())
             this.submitDateModify=true
          }
        }
        if (this.submitData.reportMatter=='补充') {
          this.fileName = {
            "1000": "",
            "1001": "",
            "1002": "",
            "1003": "",
            "1004": "",
            "1005": "",
            "1006": "",
            "1007": "",
            "1008": "",
            "1009": "",
            "1010": "",
            "1011": "",
            "1012": "",
            "1013": "",
            "1014": "",
            "1015": "",
            "1016": "",
            "1017": "",
            "1018": "",
            "1019": "",
            "1020": "",
            "1021": "",
            "1022": "",
            "1023": "",
            "1024": "",
            "1025": "",
            "1026": "",
            "1027": "",
            "1028": "",
            "1029": "",
            "1030": "",
            "1031": "",
            "1032": "",
            "1033": "",
            "1034": "",
            "1035": "",
            "1036": "",
            "1037": "",
            "1038": "",
            "1039": "",
            "1040": "",
            "329": '',
            "328": '',
            "301601": ''
          }
          this.materialArray = [...new Set(this.$commonUtils.unique(this.submitData.materials.reverse(), 'materialTypeId'))].reverse()
          this.submitData.materialIdList = this.materialArray.map(item => item.materialId)
          this.materialArray.forEach(ite => {
            this.fileName[ite.materialTypeId] = ite.materialName;
          })
        }else{
          this.initfilelist()
        }
        setTimeout(()=>{
          this.$refs['submission'].validate(()=>{})
        })
      })
    },
    queryAlltask() {
      const data = {
        caseIds: this.query.caseIds// Object.prototype.toString.call(this.query.caseIds).includes('Array')?this.query.caseIds:[this.query.caseIds]
      }
      queryCase(data).then(res => {
        this.caseData = res.data
        this.$set(this.submitData,'goods',res.data[0].goods)
        // this.submitData.goods = res.data[0].goods
        this.submitData.appId=res.data[0].appId
        if(res.data[0].ukeyId){
          this.submitData.ukeyId = res.data[0].ukeyId
        }
        res.data.forEach(item=>{
          if(item.submitType === '直接递交'){
            item.submitType = '线下申请'
          }
        })
        this.caseDetailFoemData=this.caseData[0]
        this.yyFileSumSize = this.caseDetailFoemData.yyFileSumSize
        this.submitData.submitType= this.caseData[0].submitType
        // debugger
        // this.initfilelist()
        const submitModeList = Array.from(new Set(res.data.map(item => item.submitType))).filter(item=>!!item)
        if(res.data.length&&this.query.pageId !== '104') {
          this.submitData.submitPlace=this.getSubPlace(res.data[0].caseTypeId)
        }
        const isLoadPriorityFileList = Array.from(new Set(res.data.map(item => item.isLoadPriorityFile))).filter(item=>!!item)
        if(submitModeList.length === 1){
          this.submitData.submitMode = this.getsubmitMode(submitModeList[0])
        }
        const supplementList = Array.from(new Set(res.data.map(item => item.supplement))).filter(item=> !!item)
        isLoadPriorityFileList.length && isLoadPriorityFileList.includes('1') ? this.isLoadPriorityFile = '1' : this.isLoadPriorityFile = null
        supplementList.length && supplementList.includes(1) ? this.supplementDoc = true : this.supplementDoc = null
        if(!this.supplementList.includes(this.caseData[0].caseType)){
          this.submitData.supplementDoc = null
        }
        if (this.query.pageType != '1') {
          this.queryInstruction()
        }
      }).catch(err => {
        if(err.message == 'NO草案不能新建递交指令'){
          this.cancel()
          return
        }
      });
    },
    getSubPlace(caseType){

      let caseTypeList=this.$commonUtils.getTwoDimensionalArray(this.$store.getters.caseTypeList, 'caseTypeId', caseType)
      // let arr1 = ['评审答辩','复审申请','无效宣告申请','撤回评审申请']
      // let arr2 = ['续转变', '注册申请', '异议', '答辩', '撤销']
      let arr1 = [111,49,56,62]
      let arr2 = [112, 27, 32, 34, 41,113]
      if(caseTypeList.some(item=>arr1.includes(item))){
        return '评审委大厅'
      }else if(caseTypeList.some(item=>arr2.includes(item))){
        return '商标局大厅'
      }else {
        return ''
      }
    },
    handleChangeTypeName(e) {
      this.docName = this.typeNameList.find(item => item.materialTypeId === e).typeName
    },
    handleRemove(file, fileList, caseId) {
      if (file.materialId) {
        delCaseMaterial({ materialId: file.materialId, caseIdArray: caseId }).then(res => {

        })
      }
    },
    handleRemove1(file) {
      if (file.materialId) {
        delCaseMaterial({ materialId: file.materialId,caseIdArray: this.caseData.map(item=>item.caseId)}).then(res => {

        })
      }
    },
    beforeLeave() {
      if(this.materialTypeId){
        this.queryMaterialByCaseId()
      }
    },
    beforeUpload() {
      if (!this.docName || !this.materialTypeId){
        this.$message('请选择文件类型和填写文件名称')
        return false
      }
    },
    getUploadData(caseIds) {
      const data = {
        tokenID: this.$store.getters.token,
        caseIds: caseIds,
        custId: this.caseData[0]&&this.caseData[0].custId,
        type: '2',
        objType:'1',
        docName: this.docName,
        materialTypeId: this.materialTypeId
      }
      return data
    },
    onPreview(file) {
      var a = document.createElement('a');
      a.setAttribute('href', '/ipdoc' + file.address);
      a.setAttribute('id', 'startTelMedicine');
      if(document.getElementById('startTelMedicine')) {
        document.body.removeChild(document.getElementById('startTelMedicine'));
      }
      document.body.appendChild(a);
      a.click();
    },
    queryMaterialType() {
      queryMaterialType({ sign:1 ,caseTypeId:3}).then(res => {
        this.typeNameList = res.data
      })
    },
    getsubmitMode(str) {
      switch (str) {
        case '自动网申':
        case '网上申请':
          return '3';
        case '电子回文':
        case '自动回文':
           return '4';
        case '线下申请': return '1';
        case '邮寄': return '2';
        case '手动网申': return '5';
      }
    },
    getsubmitMode1(str) {
      switch (str) {
        case '自动网申':
        case '网上申请':
          return '3';
        case '电子回文':
        case '自动回文':
           return '4';
        case '人工送达': return '1';
        case '邮寄': return '2';
        case '手动网申': return '5';
      }
    },
    onsuccess() {
      this.queryMaterialByCaseId()
    },
    queryMaterialByCaseId() {
      const data = { sign: 1, materialTypeId: this.materialTypeId }
      if (Object.prototype.toString.call(this.query.caseIds).includes('Array')) {
        data.caseIds = this.query.caseIds.join(',')
      } else {
        data.caseIds =this.query.caseIds
      }
      queryMaterialByCaseId(data).then(res => {
        if (res.success) {
          this.uploadTable = res.data
          if(res.data.length === 1){
            this.materialArrayList = res.data[0] && res.data[0].materialArray
          } else {
            let list = []
            res.data.forEach(item=>{
              list.push(item.materialArray.map(itm=>itm.address))
            })
            const arr=list.reduce((prev, cur)=>{
              return this.intersection(prev, cur)
            }, '')
            this.materialArrayList = res.data[0] && res.data[0].materialArray.filter(item=>{
              for (var i=0;i<arr.length;i++){
                if(arr[i]===item.address){
                  return item
                }
              }
            })
          }
        }
      })
    },
    intersection:(a,b)=>a.filter(v => b.includes(v)),
    cancel(){
      this.materialTypeId = '' // 任务6044，bug
      if(this.submitData.insId){
        this.$store.commit('caseInformation/SET_PREONLYID',this.submitData.insId)
      }
      // let list = []
      // this.uploadTable.forEach(item=>{
      //   list = [...list,...item.materialArray]
      // })
      // deleteCaseMaterial({materialId:list.map(item=>item.materialId).join(',')}).then(res=>{
      //   if(res.success){
      this.$emit("cancel",true)
      // this.$router.history.go(-1)
       // }
     // })
    },
    querycustSelectClass(){
      const data = {
        classId: '1069,1138,1167',


      }
      querycustSelectClass(data).then(res=>{
        this.reportMatterList=res.data['1069']
        this.correctionContentArray=res.data['1138']
        this.lawArray = res.data['1167']
      })
    },
    checkGoodClasses() {
      if (this.submitData.correctionContentArray&&this.submitData.correctionContentArray.includes(1680) && this.caseData && this.caseData.length) {
        if (this.$commonUtils.unique(this.caseData, 'goodClasses').length > 1) {
          this.$message.error('不同类别的案件补正【商品服务项目】，请分别下达递交指令！')
          return false
        } else {
          return true
        }
      } else {
        return true
      }
    },
    submit(type){
      if (!this.checkGoodClasses()) return;
      if(this.submitData.submitMode!=3 && this.submitData.submitMode!=4 &&this.submitData.submitMode!=5){
        this.submitData.ukeyId = 0
        this.submitData.onlineAppDate = null
        this.submitData.payUserId = '0000'
        this.submitData.onlineAppDateStr = '0000'
      }
      if(this.$refs.Goods){
        this.$refs.Goods.stopEditing()
      }

      this.$refs['submission'].validate((valid) => {
        if (valid) {
          if(type===1){
            this.submitOffical(10)
          } else if(type === 0) {
            this.createSubmitOfficials()
          } else {
            if(!this.submitData.remarks){
              this.submitData.remarks='0000'
            }
            this.submitOfficalModify()
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    submitOfficalModify(){
      if(this.submitData.submitMode==='3'){
        this.submitData.onlineAppDate = this.formatDate(this.submitData.onlineAppDate ? this.submitData.onlineAppDate:new Date())
      }
      // this.submitData.submitUserId = this.$store.getters.userId
      this.submitData.submitDate = this.formatDate(this.submitData.submitDate ? this.submitData.submitDate:new Date())
      this.submitData.objType = '2'
      const data = {
        custId: this.caseData[0].custId,
        userId: this.$store.getters.userId,
        caseIds: this.query.caseIds,
        materialTypeId: this.materialTypeId,
        insIdList: this.query.insId,
      }
      delete this.submitData.status
      submitOfficalModify(Object.assign(data, this.submitData)).then(res => {
        this.cancel()
      })
    },
    createSubmitOfficials() {
      if (this.submitData.submitMode === '3') {
        this.submitData.onlineAppDate = this.formatDate(this.submitData.onlineAppDate ? this.submitData.onlineAppDate : new Date())
      }
      this.submitData.submitDate = this.formatDate(this.submitData.submitDate ? this.submitData.submitDate : new Date())
      this.submitData.objType = '2'
      if (this.query.pageId == 104) {
        const data = {
          custId: this.caseData[0].custId,
          userId: this.$store.getters.userId,
          caseIds: this.query.caseIds,
          result: 1,
          materialTypeId: this.materialTypeId,
          insIdList: this.query.insId,
          submitStatus: 0
        }
        createSubmitOfficials(Object.assign(data, this.submitData)).then(res => {
          if (res.messageType == 12) {
            this.$confirm(res.message,
              "提示",
              {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
              }
            ).then(() => {
              this.cancel()
            });
            return;
          }
          if (res.messageType == 13) {
            this.caseDataList = res.data
            this.poppingTimeLimitState = true
            return;
          }
          if (this.submitDateModify) {
            this.$router.push('/workbench/case/officialSubmission?instructionSubmitStatus=8')
          } else {
            this.cancel()
          }
        })
      } else {
        this.submitData.submitUserId = this.$store.getters.userId
        const data = {
          custId: this.caseData[0].custId,
          userId: this.$store.getters.userId,
          caseIds: this.caseData.map(item => item.caseId),
          taskIdList: this.query.taskIdList,
          materialTypeId: this.materialTypeId,
          submitStatus: 0,
          checkCase: 10
        }
        createSubmitOfficials(Object.assign(data, this.submitData)).then(res => {
          if (res.messageType == -6) {
            this.$confirm(`${res.message}`)
              .then(() => {
                this.createSubmitOfficials()
              })
              .catch(() => {

              });
            return
          }
          this.cancel()
        })
      }
    },
    submitOffical(checkCase){
      if(this.submitData.submitMode==='3'){
        this.submitData.onlineAppDate = this.formatDate(this.submitData.onlineAppDate ? this.submitData.onlineAppDate:new Date())
      }
      // this.submitData.submitUserId = this.$store.getters.userId
      this.submitData.submitDate = this.formatDate(this.submitData.submitDate ? this.submitData.submitDate:new Date())
      this.submitData.objType = '2'
      if (this.query.pageId == 104) {
        const data = {
          custId: this.caseData[0].custId,
          userId: this.$store.getters.userId,
          caseIds: this.query.caseIds,
          result: 1,
          materialTypeId: this.materialTypeId,
          insIdList: this.query.insId,
        }
        submitOfficalAudit(Object.assign(data,this.submitData)).then(res=>{
          if (res.messageType ==12) {
            this.$confirm(res.message ,
              "提示",
              {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
              }
            ).then(() => {
              this.cancel()
            });
            return;
          }
          if (res.messageType ==13) {
            this.caseDataList=res.data
            this.poppingTimeLimitState=true
            return;
          }
          if (this.submitDateModify){
            this.$router.push('/workbench/case/officialSubmission?instructionSubmitStatus=6')
          } else {
            this.cancel()
          }
        })
      } else {
        this.submitData.submitUserId = this.$store.getters.userId
        const data = {
          custId: this.caseData[0].custId,
          userId: this.$store.getters.userId,
          caseIds: this.caseData.map(item => item.caseId),
          taskIdList: this.query.taskIdList,
          materialTypeId: this.materialTypeId,
          checkCase: checkCase
        }
        // if(this.caseData.length&&this.submitData.reportMatter!='申请'){
        //   delete this.submitData.supplementDoc
        //   delete this.submitData.isLoadPriorityFile
        // }
        submitOffical(Object.assign(data,this.submitData)).then(res=>{
          if(res.messageType==-6){
            this.$confirm(`${res.message}`)
              .then(()=> {
                this.submitOffical()
              })
              .catch(() => {

              });
            return
          }

          this.cancel()
        })
      }
    },
    closePoppingTimeLimit(){
      this.poppingTimeLimitState=false
      this.cancel()
    },
    queryUserAll(){
      queryUserAll().then(res=>{
        if(res.success){
          this.userList=res.data
        }
      })
    },
    formatDate(time){
      return this.$commonUtils.formatDate(time)
    },
    // formatDate(time){
    //   if(time){
    //     return new Date(time).toLocaleDateString().split(/[/|-]/).map(item=>item.length<2?'0'+item:item).join('-')
    //   } else {
    //     return
    //   }
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
    getNewDate(n){
      if(this.query.pageType==1){
        if(n==3){
          this.submitData.onlineAppDate = this.formatDate(this.submitData.onlineAppDate ? this.submitData.onlineAppDate : new Date())
          this.submitData.submitDate = this.formatDate(new Date())
        } else if(n==4) {
          if(this.submitData.reportMatter=='补正'&&this.submitData.correctionContentArray&&this.submitData.correctionContentArray.length&&['内-内','外-内'].includes(this.caseDetailFoemData.appFromto)&&this.caseDetailFoemData.caseType=='商标注册'){
            this.submitData.submitDate = this.formatDate(new Date())
          }else {
            // this.getSubmitDate()
            this.submitData.submitDate = this.formatDate(new Date())
          }
        } else if (n == 1 || n == 2) {// 递交方式为【人工送达】、【邮寄】
          this.getSubmitDate()
        } else {
          this.submitData.submitDate = this.formatDate(new Date())
        }
      }
    }
  },
  computed: {
    autoHw() {
      return this.submitData.reportMatter === '补正' && this.caseData[0].caseType === '商标注册'
    },
    supCapacity() {
      const useList = ['328', '329', '301601']
      let useSize = 0 // 已使用
      let capacity = 0 // 剩余容量
      let limitSize = 0 // 总容量
      if (this.caseData[0] && this.caseData[0].caseType.includes('驳回复审')) {
        limitSize = 50 * 1024 * 1024
      } else if(this.caseData[0] && this.caseData[0].caseType.includes('无效宣告申请')) {
        limitSize = 300 * 1024 * 1024
      }
      this.materialArray.forEach(item => {
        if (useList.includes(String(item.materialTypeId))) {
          useSize += item.size
        }
      })
      capacity = limitSize - useSize
      return (capacity / (1024 * 1024)).toFixed(2)
    },
    isZhuanxie() { // 任务5347，根据角色隐藏递交按钮
      return this.$store.getters.roles && this.$store.getters.roles.find(item => item.name && (item.name === '撰写人' || item.name === '撰写负责人'))
    },
    showAutoSubmit(){
      const appTypeIdList = [185, 30, 31, 33, 53, 54, 55, 118, 42, 39, 48, 38, 36, 37, 39, 32, 40, 186, 56, 44]
      const supplementTypeIdList = [32,40,186,56]
      if (this.submitData.reportMatter =='补正'&&this.caseData[0].caseTypeId == 185) {
        return true
      } else if (this.submitData.reportMatter =='申请'&&appTypeIdList.includes(this.caseData[0].caseTypeId)){
        return true
      }else if(this.submitData.reportMatter =='补充'&&supplementTypeIdList.includes(this.caseData[0].caseTypeId)){
        return true
      }else if(!this.submitData.reportMatter){
        return true
      }else {
        return false
      }
    }

    // detailState(){
      // if(this.submitData.submitMode === '3'){
      //   return true
      // }else {
      //   return  false
      // }
  },
  watch: {
    query:{
      handler(n,o){
        this.submitData = {
          submitType: '',
          tmDesignDeclare:null,
          submitMode: '',
          isLoadPriorityFile: null,
          submitDate: '',
          onlineAppDate: '',
          supplementDoc: null,
          ukeyId: '',
          goods:[],
          correctionContentArray:[]
        }
        this.init()
      },
      deep:true
    },
    "submitData.goods": function (val, oldval) {
      if(val&&val.length==0){
        this.submitData.goodsSign='0000'
      }
      if(val&&val.length>0){
        this.submitData.goodsSign=''
      }
    },
    'submitData.submitMode'(n,o){
      if (this.query.pageType == '1' && (n == 3 || n == 4)) {
        if (this.caseData && this.caseData.length && this.caseData[0].replaceAgencyName === "北京佰舟知识产权代理有限公司") {
          this.submitData.ukeyId = 6
        }
      }
     this.getNewDate(n)
    },
    // detailState(n) {
    //   if(this.query.pageType==1){
    //     if(n){
    //       this.submitData.onlineAppDate = this.formatDate(this.submitData.onlineAppDate ? this.submitData.onlineAppDate : new Date())
    //       this.submitData.submitDate = this.formatDate(new Date())
    //     } else {
    //       this.getSubmitDate()
    //     }
    //   }
    // },
    materialTypeId(n,o){
      if(!o){
        this.queryMaterialByCaseId()
        return
      }
      if(n && this.caseData.length&&[...new Set(getLanglist(this.uploadTable.map(item => item.materialArray.map(item => item.materialId))))].length) {
        modifyMaterialType({materialTypeId:n,materialIdList:[...new Set(getLanglist(this.uploadTable.map(item => item.materialArray.map(item => item.materialId))))]}).then(res=>{
          this.queryMaterialByCaseId()
        })
      }
    }
  },
  components:{
    YZgrid,
    Goods,poppingTimeLimit,DataUploadOrSelect
  }
}
</script>

<style lang="scss" scoped>
  .fade-enter-active{
    transition: opacity .5s
  }
  .fade-leave-active{
    transition: opacity .5s
  }
  .fade-enter, .fade-leave-active {
    opacity: 0
  }
  header{
    height: 62px;
    line-height:62px;
    font-size:22px;
    font-family:SourceHanSansCN-Normal;
    font-weight:400;
    color:rgba(51,51,51,1);
    padding-left: 20px;
    //border-bottom:1px solid #D4D5D5 ;
  }
  .title{
    font-family:'Arial Normal', 'Arial';
    color: #409EFF;
    font-weight: 400;
    height: 50px;
    line-height: 60px;
    /*padding-left: 50px;*/
  }
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
    padding: 20px;
    margin:0 20px ;
    max-height: 600px;
    overflow: auto;
    .el-row{
      min-height: 30px;
      width: 100%;
      display: flex;
      align-items: center;
      .el-form-item{
        width: 100%;
        display: flex;
        height: 100%;
        border: 1px solid #EBEEF5;
        border-bottom: 0;
        margin-bottom: 0;
        .el-date-editor.el-input, .el-date-editor.el-input__inner{
          width: 200px;
        }
        /deep/ .el-form-item__label{
          background: #f5f7fa;
          width: 206px;
          flex-shrink: 0;
        }
        /deep/ .el-form-item__content{
          margin-left: 0 !important;
          padding-left: 10px;
          background: #fff;
          flex: 1;
          position: relative;
        }
        /deep/ .el-form-item__error{
          position: relative;
          top: 0;
        }

      }

      .small-el-form-item{
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
  .upload-demo{
    /deep/ .el-upload{
      width: 100%;
    }
    /deep/ .el-upload-dragger{
     height: 20px;
      width: 100%;
    }
    /deep/ .el-upload-list{
      display: flex;
      justify-content: space-around;
      align-items: center;
      flex-wrap: wrap;
      &:first-child{
        margin-top: 0;
      }
    }
  }
  .upload-demo1 ,.upload-demo{
    /deep/ .el-upload-list__item{
      transition: all 0s ;
      transform: translateY(0);
    }
   /deep/ .el-upload-list__item:first-child{
     margin-top: 0;
   }
    /deep/ .el-list-enter,.el-list-leave-active{
      visibility: hidden;
      opacity: 1;
      transition: all 0s;
      transform: translateY(0);
    }
    /deep/ .el-list-enter-active,.el-list-leave-active{
      display: none;
      transition: all 0s;
     }
  }
  .el-table{
    /deep/ th{
      padding:5px 0
    }
    /deep/ td {
      padding: 0 ;
    }
  }
</style>
