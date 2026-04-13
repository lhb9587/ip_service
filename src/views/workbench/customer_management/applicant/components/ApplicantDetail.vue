<template>
  <div class="createPost-container">

    <el-form ref="postForm" :model="postForm" :rules="rules" size="mini" class="form-container">
      <div class="createPost-main-container">
        <div class="form-con">
          <el-row>
            <el-col class="tilteSpan" :span="24">
              <span id='jbxx-title'>申请人基本信息</span>
            </el-col>
          </el-row>

          <el-row>
            <el-col class="form-con-item" :span="postForm.taskRecordList && postForm.taskRecordList.length ? 18 : 23">
              <el-row class="form-border">

                <el-col :span="24">
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="编码:" class="postInfo-container-item">
                        {{postForm.appId}}
<!--                        <el-input v-model="postForm.appId"></el-input>-->
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="国籍:" prop='country' class="postInfo-container-item">
                        <template>
                          <el-select :disabled="!postForm.isupdate&&isEdit==true" default-first-option :clearable='true' placeholder="请选择" v-model="postForm.country" filterable>
                            <el-option v-for="(item,key) in seletData.country" :key="key" :label="item.countryCn" :value="item.countryCn">
                            </el-option>
                          </el-select>
                        </template>
                      </el-form-item>
                    </el-col>

                  </el-row>
                  <el-row class="">
                    <el-col :span="12">
                      <el-form-item label="主体法律性质:" prop='appType' class="postInfo-container-item">
                        <template>
                          <el-select default-first-option :clearable='true' placeholder="请选择" v-model="postForm.appType" filterable>
                            <el-option v-for="item in seletData.mainLegalNature" :key="item.id" :label="item.typeName" :value="item.typeName">
                            </el-option>
                          </el-select>
                        </template>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="postForm.country == '中国'&&postForm.appType!='自然人'">
                      <el-form-item label="统一社会信用代码:" :prop="postForm.country == '中国'&&postForm.appType!='自然人'?'certCode':''" class="postInfo-container-item">
                        <template>
                          <el-input v-model="postForm.certCode"></el-input>
                        </template>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row class="fullRow">
                    <el-col :span="24">
                      <el-form-item label="企业字号:" class="uploader-custfile">
                        <vue-tags-input
                          allow-edit-tags
                          class="vue-tags-input"
                          v-model="postForm.keyword"
                          :tags="postForm.keyNameList&&postForm.keyNameList.map(item => ({text: item, classes: 'string'})) || []"
                          @tags-changed="changeTags"
                          placeholder="回车保存企业字号"
                        >
                        </vue-tags-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row v-if="patent" class="">
                    <el-col :span="12">
                      <el-form-item label="专利申请人类型:" prop="applicationType" class="postInfo-container-item">
                        <template>
                          <el-select  clearable placeholder="请选择" v-model="postForm.applicationType" filterable>
                            <el-option v-for="item in seletData.patentApplyType" :key="item.id" :label="item.typeName" :value="item.id">
                            </el-option>
                          </el-select>
                        </template>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row v-if="postForm.appType=='自然人'">
                    <el-col :span="12">
                      <el-form-item label="证件类型:" class="postInfo-container-item">
                        <template>
                          <el-select default-first-option :clearable='true' placeholder="请选择" v-model="postForm.cardName" filterable>
                            <el-option key="身份证号" label="身份证号" value="身份证号"> </el-option>
                            <el-option key="护照号" label="护照号" value="护照号">
                            </el-option>
                          </el-select>
                        </template>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="证件号:" prop='cardNumber' class="postInfo-container-item">
                        <template>
                          <el-input v-model="postForm.cardNumber"></el-input>
                        </template>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="简称:" class="postInfo-container-item">
                        <el-input v-model="postForm.shortname"></el-input>
                      </el-form-item>
                    </el-col>

                  </el-row>
<!--                  <el-row class="fullRow">-->
<!--                    <el-col :span="24">-->
<!--                      <el-form-item label="第一申请人:" class="postInfo-container-item">-->
<!--                        <el-radio-group v-model="postForm.isFirstAppliantStr">-->
<!--                          <el-radio label='是'>是</el-radio>-->
<!--                          <el-radio label='否'>否</el-radio>-->
<!--                        </el-radio-group>-->
<!--                      </el-form-item>-->

<!--                    </el-col>-->

<!--                  </el-row>-->
                  <el-row class="">
                    <el-col :span="12">
                      <el-form-item label="中文名称:" prop='applicantName' class="postInfo-container-item">
                        <template>
                          <el-input :disabled="!postForm.isupdate&&isEdit==true" v-model="postForm.applicantName" @change="(e)=>{this.changeAppType(e)}"></el-input>
                        </template>
                      </el-form-item>

                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="日文名称:" class="postInfo-container-item">
                        <template>
                          <el-input :disabled="!postForm.isupdate&&isEdit==true" v-model="postForm.applicantJpName"></el-input>
                        </template>
                      </el-form-item>

                    </el-col>

                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="原文名称:" class="postInfo-container-item">

                        <el-input v-model="postForm.fgFullname"></el-input>
                      </el-form-item>

                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="英文名称:" class="postInfo-container-item">

                        <el-input :disabled="!postForm.isupdate&&isEdit==true" v-model="postForm.applicantEnName"></el-input>
                      </el-form-item>

                    </el-col>
                  </el-row>
                  <el-row class="fullRow">
                    <el-col :span="24">
                      <el-form-item label="是否属于客户:" prop='isCustomer' class="postInfo-container-item">
                        <el-radio-group @change="iscustChange" v-model="postForm.isCustomer">
                          <el-radio :label='1'>是</el-radio>
                          <el-radio :label='0'>否</el-radio>
                        </el-radio-group>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row  class="fullRow">
                    <el-col :span="24">
                      <el-form-item label="所属客户:"  class="postInfo-container-item uploader-custfile">
                        <div style="display: flex">


                        <p style="text-align: left;flex: 1">
                          {{getCustNameStr}}
                        </p>
                        <el-popover
                          placement="right"
                          width="500"
                          trigger="click"
                        >
                          <div style="max-height: 400px;
    overflow: auto;">
                            <el-select style="width: 100%"  multiple default-first-option :clearable='true' v-model="postForm.custIdArray " no-match-text='暂无数据' loading-text='正在查询' filterable remote reserve-keyword placeholder="请输入关键词"
                                 :remote-method="remotepaternalUnit">
                            <el-option v-for="(item,index) in seletData.custnames" :key="item.custId" :label="item.fullname" :value="item.custId">
                            </el-option>
                          </el-select>

                          </div>

                          <el-button style="float: right" slot="reference" size="mini" type="primary">编辑</el-button>
                        </el-popover>
                        </div>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row class="fullRow">
                    <el-col :span="24">
                      <el-form-item label="案件类型:" prop='caseTypeIdArray'>
                        <template>
                          <el-multi-cascader
                            clearable
                            v-model="postForm.caseTypeIdArray"
                            :show-all-levels="false"
                            multiple
                            change-on-select
                            selectChildren
                            :options="$store.getters.caseTypeList"
                            :props="{
                              value: 'caseTypeId',
                              label: 'caseType',
                              children: 'childrens',
                              checkStrictly: false,
                            }"
                            style="width: 70%;"
                            placeholder="请选择"
                            class="casetype-cascader"
                          >
                          </el-multi-cascader>
                        </template>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row class="fullRow">
                    <el-col :span="24">
                      <el-form-item label="证件扣发设置:" class="postInfo-container-item">
                        <template>

                          <el-radio-group v-model="postForm.certDeprive">
                            <el-radio label='跟随客户'></el-radio>
                            <el-radio label='特批发证'></el-radio>
                            <el-radio label='特别扣证'></el-radio>
                          </el-radio-group>
                        </template>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row class="fullRow">
                    <el-col :span="24">
                      <el-form-item label="邮件配置:" class="postInfo-container-item">
                        <template>

                          <el-checkbox-group v-model="postForm.mailConfigs">
                            <el-checkbox :label="1">续展提醒</el-checkbox>
                            <el-checkbox :label="2">初审公告提醒</el-checkbox>
                            <el-checkbox :label="3">送达公告提醒</el-checkbox>
                          </el-checkbox-group>

                        </template>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row class="fullRow">
                    <el-col :span="24">

                      <el-form-item label="案件要求:" class="postInfo-container-item uploader-custfile">
                        <template>
                          <el-input type="textarea" :rows="3" placeholder="请输入内容" v-model="postForm.jobRequire">
                          </el-input>
                        </template>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row class="fullRow">
                    <el-col :span="24">

                      <el-form-item label="费用要求:" class="postInfo-container-item uploader-custfile">
                        <template>
                          <el-input type="textarea" :rows="3" placeholder="请输入内容" v-model="postForm.costRequire">
                          </el-input>
                        </template>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row class="fullRow">
                    <el-col :span="24">

                      <el-form-item label="联系电话:" class="postInfo-container-item uploader-custfile">
                        <template>
                          <el-input placeholder="请输入10-12位数字" v-model="postForm.phone" maxlength="12" @input="handlePhoneInput">
                          </el-input>
                        </template>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row class="fullRow" v-if="patent">
                    <el-col :span="24">
                      <el-form-item label="总委托书:" class="postInfo-container-item uploader-custfile">
                        <el-radio-group v-model="postForm.iszw" style="margin-left: 10px">
                          <el-radio :label='1'>是</el-radio>
                          <el-radio :label='0'>否</el-radio>
                        </el-radio-group>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row v-if="postForm.iszw && patent">
                    <el-col  :span="12">
                      <el-form-item label="总委号:" class="postInfo-container-item uploader-custfile">
                        <el-input type="text" size="small" v-model="postForm.zwNo"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col  :span="12">
                      <el-form-item label="PCT总委号:" class="postInfo-container-item uploader-custfile">
                        <el-input type="text" size="small" v-model="postForm.pctzwno"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row class="" v-if="postForm.iszw && patent">
                    <el-col :span="12">
                      <el-form-item label="总委:" class="postInfo-container-item uploader-custfile" >
                        <el-upload
                          ref="upload"
                          class="upload-demo"
                          name="attachFile"
                          :data="getUploadData('总委')"
                          :action="creatematerial"
                          :file-list="materialList.filter(item=>item.subject == '申请人普通总委')"
                          :before-remove="(file)=>brforeRemoveFile(file,'申请人普通总委')"
                          :on-preview="preView"
                          :before-upload="beforeUpload"
                          :on-success="successCallback"
                        >

                          <el-button size="small" type="primary">上传</el-button>
                        </el-upload>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="PCT总委:" class="postInfo-container-item uploader-custfile">
                        <el-upload
                          ref="upload"
                          class="upload-demo"
                          name="attachFile"
                          :data="getUploadData('PCT总委')"
                          :action="creatematerial"
                          :file-list="materialList.filter(item=>item.subject == '申请人PCT总委')"
                          :before-remove="(file)=>brforeRemoveFile(file,'申请人PCT总委')"
                          :on-preview="preView"
                          :before-upload="beforeUpload"
                          :on-success="successCallback"
                        >

                          <el-button size="small" type="primary">上传</el-button>
                        </el-upload>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row v-if="patent" :class="postForm.fyjhbeian ? '' : 'fullRow'">
                    <el-col :span="postForm.fyjhbeian ? 12 : 24">
                      <el-form-item label="已费用减缴案:" class="postInfo-container-item uploader-custfile">
                        <el-radio-group v-model="postForm.fyjhbeian" style="margin-left: 10px" @change="changeBeian">
                          <el-radio :label='1'>是</el-radio>
                          <el-radio :label='0'>否</el-radio>
                        </el-radio-group>
                      </el-form-item>
                    </el-col>
                    <el-col v-if="postForm.fyjhbeian" :span="12">
                      <el-form-item label="备案年度:" class="postInfo-container-item uploader-custfile">
                        <el-input type="text" size="small" v-model="postForm.beianYear"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row class="fullRow">
                    <el-col :span="24">

                      <el-form-item label="备注:" class="postInfo-container-item uploader-custfile">
                        <template>
                          <el-input type="textarea" :rows="3" placeholder="请输入内容" v-model="postForm.memo">
                          </el-input>
                        </template>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="建档日期:" class="postInfo-container-item">
                        <template>
                          <span v-if="!isEdit">{{getNowFormatDate()}}</span>
                          <span v-if="isEdit">{{postForm.createDate}}</span>
                        </template>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="建档人:" class="postInfo-container-item">
                        <template>
                          <span v-if="isEdit">{{userName}}</span>
                          <span v-if="!isEdit">{{name}}</span>
                        </template>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="其他收据抬头:" class="postInfo-container-item">
                        <el-input placeholder="请输入内容" v-model="postForm.otherTitle" clearable></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="主体统一社会信用代码:" class="postInfo-container-item">
                        <el-input placeholder="请输入内容" v-model="postForm.otherCertCode" clearable></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>

                </el-col>
              </el-row>
            </el-col>

            <el-col style="margin-left: -30px;height: 100px;" :span="1"></el-col>

            <el-col :span="5" v-if="postForm.taskRecordList && postForm.taskRecordList.length">
              <el-timeline>
                <el-timeline-item :color="item.status=='已完成'?'green':'red'" v-for="item in postForm.taskRecordList"  :timestamp="item.finish" placement="top">
                  <el-card>
                    <h4>任务名称 {{item.progressName}}</h4>
                    <p class="item_p">状态 {{item.status}}</p>
                    <p class="item_p">审核备注 {{item.failReason || '-'}}</p>
                    <p class="item_p">审核人 {{item.auditUserName}}</p>
                    <!--        <p class="item_p">动作 {{item.tasker}}</p>-->
                    <p class="item_p">时间 {{item.createTime}}</p>
                  </el-card>
                </el-timeline-item>
              </el-timeline>
            </el-col>

          </el-row>
          <el-row>
            <el-col class="tilteSpan" :span="24">
              <span id='khdz-title'>申请人地址</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" style='text-align:right'>
              <el-button type="primary" size="mini" @click="addFormShow('addr')">添加
              </el-button>
              <el-button v-if="postForm.applicantAddresses.length>3" type="primary" size="mini" @click="allMessageFormShow('addr')">全部
              </el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-table size="mini" :data="postForm.applicantAddresses.filter((item,index)=>index<=2)" border fit empty-text="暂无数据" highlight-current-row current-row-key style="width: 100%;">
                <el-table-column type="index" width="50" label="序号" align="left"></el-table-column>
                <el-table-column label="信函抬头" align="left" width>
                  <template slot-scope="scope">
                    <span>{{ scope.row.title }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="大洲" align="left" width>
                  <template slot-scope="scope">
                    <span>{{ scope.row.continent }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="国家" align="left" width>
                  <template slot-scope="scope">
                    <span>{{ scope.row.country }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="州省份" align="left" width>
                  <template slot-scope="scope">
                    <span>{{ scope.row.province }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="城市" align="left" width>
                  <template slot-scope="scope">
                    <span>{{ scope.row.city }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="中文地址" align="left" width>
                  <template slot-scope="scope">
                    <span>{{ scope.row.addressCn }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="英文地址" align="left" width>
                  <template slot-scope="scope">
                    <span>{{ scope.row.addressEn }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="邮编" align="left" width>
                  <template slot-scope="scope">
                    <span>{{ scope.row.post }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="专利" align="left" width>
                  <template slot-scope="scope">
                    <el-radio-group v-model="scope.row.isPatent">
                      <el-radio :label='1'>是</el-radio>
                      <el-radio :label='0'>否</el-radio>
                    </el-radio-group>
                    <!--                        <span>{{ scope.row.post }}</span>-->
                  </template>
                </el-table-column>
                <el-table-column label="状态" align="left" width>
                  <template slot-scope="scope">
                    <el-select @change="(v) => {statusChange(v, scope.row, scope.$index)}" default-first-option :clearable='true' placeholder="请选择" v-model="scope.row.status" filterable >
                      <el-option v-for="(item,key) in seletData.statu" :key="key" :label="item.typeName" :value="item.typeName">
                      </el-option>
                    </el-select>
                    <!--                        <span>{{ scope.row.status }}</span>-->
                  </template>
                </el-table-column>
                <el-table-column label="备注" align="left" width>
                  <template slot-scope="scope">
                    <span>{{ scope.row.memo }}</span>
                  </template>
                </el-table-column>

                <el-table-column  label="操作" align="left" width="" class-name="small-padding fixed-width">
                  <template slot-scope="scope">

                    <el-button v-if="scope.row.isupdate||isEdit==false" size="mini" type="text" @click="custAddrupdata(scope.row,'addr',scope.$index)">修改
                    </el-button>
                    <el-button v-if="scope.row.isupdate||isEdit==false" size="mini" type="text" @click="custAddrdel(scope.row,'addr',scope.$index)">删除</el-button>

                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
          <el-row>
            <el-col class="tilteSpan" :span="24">
              <span id='wflxr-title'>申请人-联系人</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" style='text-align:right'>
              <el-button type="primary" size="mini" @click="addFormShow('wfcon')">添加
              </el-button>
              <el-button v-if="postForm.applicantContacts.length>3" type="primary" size="mini" @click="allMessageFormShow('wfcon')">全部
              </el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-table size="mini" :data="postForm.applicantContacts.filter((item,index)=>index<=2)" border fit empty-text="暂无数据" highlight-current-row current-row-key style="width: 100%;">
                <el-table-column type="index" width="50" label="序号" align="left"></el-table-column>
                <el-table-column label="联系人中文名称" align="left" width>
                  <template slot-scope="scope">
                    <span>{{ scope.row.nameCn }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="联系人英文名称" align="left" width>
                  <template slot-scope="scope">
                    <span>{{ scope.row.nameEn }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="地址" align="left" width>
                  <template slot-scope="scope">
                    <span>{{ scope.row.address }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="联系电话" align="left" width>
                  <template slot-scope="scope">
                    <span>{{ scope.row.telphone }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="地址邮箱" align="left" width>
                  <template slot-scope="scope">
                    <span>{{ scope.row.email }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="邮政编码" align="left" width>
                  <template slot-scope="scope">
                    <span>{{ scope.row.post }}</span>
                  </template>
                </el-table-column>
                <el-table-column  label="操作" align="left" width="" class-name="small-padding fixed-width">
                  <template slot-scope="scope">

                    <el-button v-if="scope.row.isupdate||isEdit==false"size="mini" type="text" @click="custAddrupdata(scope.row,'wfcon',scope.$index)">修改
                    </el-button>
                    <el-button v-if="scope.row.isupdate||isEdit==false" size="mini" type="text" @click="custAddrdel(scope.row,'wfcon',scope.$index)">删除</el-button>

                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
          <template v-if="!isCust">
            <el-row v-if="patent">
              <el-col :span="24" style="text-align:center">
                <el-form-item>
                  <el-button size="medium" type="primary" v-if="!isEdit" @click="$emit('clickBack')">返回
                  </el-button>
                  <el-button size="medium" type="primary" v-if="!isEdit" @click="submitForm('postForm')">创建申请人
                  </el-button>
                  <el-button size="medium" type="primary" v-if="isEdit" @click="updatasubmitForm('postForm')">保存修改
                  </el-button>

                  <!--                    <el-button type="primary" @click="$emit('clickBack')" size="medium">取消</el-button>-->

                </el-form-item>
              </el-col>

            </el-row>
            <el-row v-else>
              <el-col :span="24" style="text-align:center">
                <el-form-item>
                  <el-button size="medium" type="primary" v-if="!isEdit" @click="submitForm('postForm')">创建申请人
                  </el-button>
                  <el-button size="medium" type="primary" v-if="isEdit" @click="updatasubmitForm('postForm')">保存修改
                  </el-button>

                  <el-button type="primary" @click="$router.go(-1);" size="medium">取消</el-button>

                </el-form-item>
              </el-col>

            </el-row>
          </template>

        </div>

      </div>

    </el-form>

    <el-dialog append-to-body :show-close="false" :close-on-click-modal="false" title="申请人地址" :visible.sync="dialogFormAddr" width="70%">
      <el-form ref="creatAddrForm" :model="addrFromData" size="mini" label-position="left" style="width: 100%;">
        <el-row class="form-border">
          <el-col :span="24">
            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="单位:" class="postInfo-container-item">

                  <el-input type="text" :disabled="true" placeholder="" v-model="postForm.applicantName">
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="信函抬头:" class="postInfo-container-item">

                  <el-input type="text" placeholder="" v-model="addrFromData.title">
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="中文地址:" class="postInfo-container-item">

                  <el-input type="text" placeholder="" v-model="addrFromData.addressCn">
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="是否信函地址 :" class="postInfo-container-item">
                  <el-radio-group v-model="addrFromData.isMailAddr">
                    <el-radio :label='1'>是</el-radio>
                    <el-radio :label='0'>否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="是否账单地址 :" class="postInfo-container-item">
                  <el-radio-group v-model="addrFromData.isBillAddr">
                    <el-radio :label='1'>是</el-radio>
                    <el-radio :label='0'>否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="英文地址:" class="postInfo-container-item">

                  <el-input type="text" placeholder="" v-model="addrFromData.addressEn">
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="邮寄地址:" class="postInfo-container-item">

                  <el-input type="text" placeholder="" v-model="addrFromData.addressMail">
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="邮编:" class="postInfo-container-item">

                  <el-input type="text" placeholder="" v-model="addrFromData.post">
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="是否属于专利:" class="postInfo-container-item">
                  <el-radio-group v-model="addrFromData.isPatent" @change="changeAddr">
                    <el-radio :label='1'>是</el-radio>
                    <el-radio :label='0'>否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="国家/省份/城市:" class="postInfo-container-item">
                  <template>
                    <el-cascader clearable change-on-select style="width:60%" placeholder="" v-model="addrFromData.ctData" :options="seletData.ctDataOption" filterable>
                    </el-cascader>

                  </template>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="大洲:" class="postInfo-container-item">

                  <el-input type="text" :disabled="true" placeholder="" v-model="addrFromData.continent">
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="状态:" class="postInfo-container-item">
                  <template>
                    <el-select default-first-option :clearable='true' placeholder="请选择" v-model="addrFromData.status" filterable>
                      <el-option v-for="(item,key) in seletData.statu" :key="key" :label="item.typeName" :value="item.typeName">
                      </el-option>
                    </el-select>
                  </template>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="备注:" class="postInfo-container-item uploader-custfile">
                  <template>
                    <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="addrFromData.memo">
                    </el-input>
                  </template>
                </el-form-item>
              </el-col>
            </el-row>

          </el-col>
        </el-row>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormAddr = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogFormStatus==='create'?createCustAddr('addr'):updateCustAddr('addr')">
          确定
        </el-button>
      </div>
    </el-dialog>

    <el-dialog append-to-body :show-close="false" :close-on-click-modal="false" title="联系人" :visible.sync="dialogFormwfcon" width="70%">
      <el-form ref="creatwfconForm" :model="wfconFromData" label-position="left" style="width: 100%;">
        <el-row class="form-border">
          <el-col :span="24">

            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="申请人:" class="postInfo-container-item">
                  <template>

                    <el-input type="text" placeholder="" v-model="postForm.applicantName">
                    </el-input>
                  </template>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="联系人中文名称:" class="postInfo-container-item">
                  <template>
                    <el-input type="text" placeholder="" v-model="wfconFromData.nameCn">
                    </el-input>
                  </template>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="联系人英文名称:" class="postInfo-container-item">
                  <template>
                    <el-input type="text" placeholder="" v-model="wfconFromData.nameEn">
                    </el-input>
                  </template>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="地址:" class="postInfo-container-item">

                  <el-input type="text" :disabled="true" placeholder="" v-model="wfconFromData.address">
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="邮编:" class="postInfo-container-item">
                  <template>
                    <el-input type="text" placeholder="" v-model="wfconFromData.post">
                    </el-input>
                  </template>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="联系电话:" class="postInfo-container-item">
                  <el-input type="text" placeholder="" v-model="wfconFromData.telphone">
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="手机号码:" class="postInfo-container-item">
                  <el-input type="text" placeholder="" v-model="wfconFromData.mobile">
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="传真:" class="postInfo-container-item">

                  <el-input type="text" placeholder="" v-model="wfconFromData.fax">
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="邮箱地址:" class="postInfo-container-item">

                  <el-input type="text" placeholder="" v-model="wfconFromData.email">
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="备注:" class="postInfo-container-item uploader-custfile">
                  <template>
                    <el-input type="textarea" :rows="3" placeholder="请输入内容" v-model="wfconFromData.memo">
                    </el-input>
                  </template>
                </el-form-item>
              </el-col>
            </el-row>

          </el-col>
        </el-row>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormwfcon = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogFormStatus==='create'?createCustAddr('wfcon'):updateCustAddr('wfcon')">
          确定
        </el-button>
      </div>
    </el-dialog>
   <el-dialog  title="全部" :visible.sync="alldialogVisible" :append-to-body="true" :show-close="false"  width="70%">

    <el-table size="mini" v-if='alldialogBool=="wfcon"' :data="alltableData" border fit empty-text="暂无数据" highlight-current-row current-row-key style="width: 100%;">
                    <el-table-column type="index" width="50" label="序号" align="left"></el-table-column>
                    <el-table-column label="联系人中文名称" align="left" width>
                      <template slot-scope="scope">
                        <span>{{ scope.row.nameCn }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="联系人英文名称" align="left" width>
                      <template slot-scope="scope">
                        <span>{{ scope.row.nameEn }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="地址" align="left" width>
                      <template slot-scope="scope">
                        <span>{{ scope.row.address }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="联系电话" align="left" width>
                      <template slot-scope="scope">
                        <span>{{ scope.row.telphone }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="地址邮箱" align="left" width>
                      <template slot-scope="scope">
                        <span>{{ scope.row.email }}</span>
                      </template>
                    </el-table-column>

                    <el-table-column  label="操作" align="left" width="" class-name="small-padding fixed-width">
                      <template slot-scope="scope">

                        <el-button v-if="scope.row.isupdate||isEdit==false" size="mini" type="text" @click="custAddrupdata(scope.row,'wfcon',scope.$index)">修改
                        </el-button>
                        <el-button v-if="scope.row.isupdate||isEdit==false" size="mini" type="text" @click="custAddrdel(scope.row,'wfcon',scope.$index)">删除</el-button>

                      </template>
                    </el-table-column>
                  </el-table>
       <el-table size="mini" v-if='alldialogBool=="addr"' :data="alltableData" border fit empty-text="暂无数据" highlight-current-row current-row-key style="width: 100%;">
                    <el-table-column type="index" width="50" label="序号" align="left"></el-table-column>
                    <el-table-column label="信函抬头" align="left" width>
                      <template slot-scope="scope">
                        <span>{{ scope.row.title }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="大洲" align="left" width>
                      <template slot-scope="scope">
                        <span>{{ scope.row.continent }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="国家" align="left" width>
                      <template slot-scope="scope">
                        <span>{{ scope.row.country }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="州省份" align="left" width>
                      <template slot-scope="scope">
                        <span>{{ scope.row.province }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="城市" align="left" width>
                      <template slot-scope="scope">
                        <span>{{ scope.row.city }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="中文地址" align="left" width>
                      <template slot-scope="scope">
                        <span>{{ scope.row.addressCn }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="英文地址" align="left" width>
                      <template slot-scope="scope">
                        <span>{{ scope.row.addressEn }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="邮编" align="left" width>
                      <template slot-scope="scope">
                        <span>{{ scope.row.post }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="专利" align="left" width>
                      <template slot-scope="scope">
                        <span>{{scope.row.isPatent ? '是' : '否'}}</span>
<!--                        <el-radio-group v-model="scope.row.isPatent">-->
<!--                          <el-radio :label='1'>是</el-radio>-->
<!--                          <el-radio :label='0'>否</el-radio>-->
<!--                        </el-radio-group>-->
<!--                        <span>{{ scope.row.post }}</span>-->
                      </template>
                    </el-table-column>
                    <el-table-column label="状态" align="left" width>
                      <template slot-scope="scope">
                        <span>{{ scope.row.status }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="备注" align="left" width>
                      <template slot-scope="scope">
                        <span>{{ scope.row.memo }}</span>
                      </template>
                    </el-table-column>

                    <el-table-column label="操作" align="left" width="" class-name="small-padding fixed-width">
                      <template slot-scope="scope">

                        <el-button v-if="scope.row.isupdate||isEdit==false" size="mini" type="text" @click="custAddrupdata(scope.row,'addr',scope.$index)">修改
                        </el-button>
                        <el-button v-if="scope.row.isupdate||isEdit==false" size="mini" type="text" @click="custAddrdel(scope.row,'addr',scope.$index)">删除</el-button>

                      </template>
                    </el-table-column>
                  </el-table>

      <span slot="footer" class="dialog-footer">

        <el-button @click="alldialogVisible = false">关闭</el-button>

      </span>
    </el-dialog>
  </div>
</template>

<script>
  import VueTagsInput from '@johmun/vue-tags-input'
  import {doEditInOffice, getProgID} from '@/utils/editInOffice.js'
  import {
    delCaseMaterial,
    deleteCaseMaterial,
  } from '@/api/caseList.js'
  import {creatematerial} from '@/api/ipServiceApi.config.js'
import {
  querycustSelectClass,
  queryDetailByIdUrl,
  queryCountrysUrl,
  queryCountry,
  queryCPCAddr,
  createUrl,
  updateUrl,
  queryCustomerNameIdUrl,
} from "@/api/applicant";
import { queryUserNames } from "@/api/caseDetail";
import {getTwoDimensionalArray} from "@/utils/index.js";
import { getInfo } from "@/api/user"
import { getToken } from "@/utils/auth";
import serviceApi from "@/api/serviceApi.config.js";
import { mapGetters } from "vuex";
import { truncate } from "fs";
  import { appSubmit } from '@/api/customerList'

export default {
  name: "ApplicantDetail",
  computed: {
    ...mapGetters(["token", "name"]),
    getCustNameStr(){
      if(this.customerList.length){
        return this.postForm.custIdArray.map(item=>this.customerList.find(itm=>itm.custId==item))
          // .filter(obj => !!obj)
          .map(item=>item.fullname).join(', ')
      }else {
        return ''
      }

    }
  },
  components: {VueTagsInput},
  props: {
    isCust: {
      type: Boolean,
      default: false
    },
    firstApp:{
      type: String,
      default: '否'
    },
    code: '',
    appId:'',
    patent: {
      type: Boolean,
      default: false
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    custId:{}
  },
  data() {
    return {
      keyNameList: [],
      materialList: [],
      creatematerial,
      // getCustNameStr: '',
      backForm:{},
      userName: '',
      custIdArray:[],
      filterCustName: "",
      zsfileUploadbool: false,
      isCreatTrue: false,
      custselectDis: false,
      creatAddrForm: {},
      stepActive: 0,
      postForm: {
        custId:'',
        isCustomer: 1,
        appId: "", // int(11) NOT NULL AUTO_INCREMENT COMMENT '申请人编号',
        applicantName: "", // varchar(500) DEFAULT NULL COMMENT '申请人中文名称',
        applicantAddress: "", // varchar(500) DEFAULT NULL COMMENT '申请人中文地址',
        applicantEnName: "", // varchar(500) DEFAULT NULL COMMENT '申请人英文名称',
        applicantEnAddress: "", // varchar(500) DEFAULT NULL COMMENT '申请人英文地址',
        usertName: "", // varchar(200) DEFAULT NULL COMMENT '操作人名字',
        modifyTime: "", // timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
        country: "", // varchar(150) DEFAULT NULL COMMENT '国籍',
        appType: "", // varchar(100) DEFAULT NULL COMMENT '主体法律性质',
        sendType: "", // varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '书式类型：中国大陆、国外、中国台湾、中国香港、中国澳门',
        cardName: "", // varchar(100) DEFAULT NULL COMMENT '证件名称',
        cardNumber: "", // varchar(100) DEFAULT NULL COMMENT '证件号码',
        mainAppId: "", // int(11) DEFAULT NULL COMMENT '所属申请人',
        hasTm: "", // int(11) DEFAULT NULL COMMENT '对应的商标',
        fromTm: "", // int(11) DEFAULT NULL COMMENT '申请人的来源，0：代表手工录入，1：代表从商标中提取 2：wpm中导入',
        certCode: "", // varchar(100) DEFAULT NULL COMMENT '统一社会信用代码',
        code: "", // varchar(100) DEFAULT NULL COMMENT '编码',
        shortname: "", // varchar(500) DEFAULT NULL COMMENT '简称（申请人名称取的是全称）',
        fgFullname: "", // varchar(500) DEFAULT NULL COMMENT '原文名称',
        continent: "", // varchar(100) DEFAULT NULL COMMENT '大洲',
        province: "", // varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '省份',
        city: "", // varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '城市',
        createDate: "", // datetime DEFAULT NULL COMMENT '创建时间',
        userId: "", // int(11) DEFAULT NULL COMMENT '建档人',
        post: "", // varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '邮编',
        memo: "", // text CHARACTER SET utf8 COLLATE utf8_general_ci COMMENT '备注',
        levelItem: "", // varchar(100) DEFAULT NULL COMMENT '申请人级别',
        jobRequire: "", //text COMMENT '作业要求',
        costRequire: "", // text COMMENT '费用要求',
        contactCn: "", // varchar(200) DEFAULT NULL COMMENT '联系人中文',
        contactEn: "", // varchar(200) DEFAULT NULL COMMENT '联系人英文',
        contactAddr: "", // varchar(500) DEFAULT NULL COMMENT '联系人地址',
        certDeprive: [], // varchar(100) DEFAULT NULL COMMENT '证件扣发设置',
        mailConfigs: [1, 2, 3], // 邮件配置
        certificateType: "", // varchar(100) DEFAULT NULL COMMENT '证件种类',
        dataSource: "", // varchar(100) DEFAULT NULL COMMENT '数据来源（保存wpm中的Id，格式如：wpm数据-incid）',
        applicantAddresses: [],
        applicantContacts: [],
        taskRecordList: []
      },
      preCustIdArray:[],
      loading: false,
      dialogFormAddr: false,

      dialogFormwfcon: false,

      rules: {
        certCode: [
          {
            required: true,
            message: "请填写统一社会信用代码",
            trigger: "blur"
          }
        ],
        isCustomer: [
          {
            required: true,
            trigger: "change",
            message: " "
          }
        ],
        country: [
          {
            required: true,
            trigger: "change",
            message: " "
          }
        ],
        appType: [
          {
            required: true,
            message: " ",
            trigger: "change"
          }
        ],
        cardNumber: [
          {
            required: true,
            message: " ",
            trigger: "change"
          }
        ],
        // custId: [
        //   {
        //     required: true,
        //     message: " ",
        //     trigger: "change"
        //   }
        // ],
        cardName: [
          {
            required: true,
            message: " ",
            trigger: "change"
          }
        ],
        // lawNature: [
        //   {
        //     required: true,
        //     message: " ",
        //     trigger: "change"
        //   }
        // ],
        applicantName: [
          {
            required: true,
            message: " ",
            trigger: "change"
          }
        ],
        applicationType: this.patent ? [
          {
            required: true,
            message: "请选择专利申请人的类型",
            trigger: "change"
          }
        ] : [
          {
            required: false,
            message: " ",
            trigger: "change"
          }
        ]
      },

      pickerOptions: {
        // disabledDate(time) {
        //   return time.getTime() > Date.now();
        // },
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            }
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            }
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            }
          }
        ]
      },
      // select的获取id有对应文档查询
      seletDataArr: "1044,1042,1146",
      seletData: {
        country: {},
        ctDataOption: {},
        statu: {},
        mainLegalNature: {},
        custnames: [],
        patentApplyType: []
      },
      // 添加客户地址相关属性-->
      addrFromData: {
        addrId: "", // int(11) NOT NULL AUTO_INCREMENT COMMENT '主键',
        appId: "", // int(11) DEFAULT NULL COMMENT '申请人Id',
        addressCn: "", // varchar(500) DEFAULT NULL COMMENT '中文地址',
        addressEn: "", // varchar(500) DEFAULT NULL COMMENT '英文地址',
        addressMail: "", // varchar(255) DEFAULT NULL COMMENT '邮寄地址',
        continent: "", // varchar(255) DEFAULT NULL COMMENT '大洲',
        country: "", // varchar(255) DEFAULT NULL COMMENT '国家',
        province: "", // varchar(255) DEFAULT NULL COMMENT '州/省份',
        city: "", // varchar(255) DEFAULT NULL COMMENT '城市',
        post: "", // varchar(255) DEFAULT NULL COMMENT '邮编',
        status: "", // varchar(255) DEFAULT NULL COMMENT '状态',
        title: "", // varchar(255) DEFAULT NULL COMMENT '抬头',
        memo: "", // text COMMENT '备注',
        createDate: "", // datetime DEFAULT NULL COMMENT '创建日期',
        userId: "", // int(11) DEFAULT NULL COMMENT '创建用户',
        no: "", //int(11) DEFAULT NULL COMMENT '序号',
        dataSource: "", // varchar(255) DEFAULT NULL COMMENT '数据来源（保存wpm中的Id，格式如：wpm数据-addrid）',
        ctData: [],
        workUnit: "",
        isMailAddr: "",
        isBillAddr: ""
      },

      // 添加我方联系人相关属性-->
      wfconFromData: {
        appContactId: "", // int(11) NOT NULL AUTO_INCREMENT COMMENT '主键',
        appId: "", // int(11) DEFAULT NULL COMMENT '申请人',
        nameCn: "", // varchar(255) DEFAULT NULL COMMENT '中文地址',
        nameEn: "", // varchar(255) DEFAULT NULL COMMENT '英文地址',
        address: "", // varchar(255) DEFAULT NULL COMMENT '地址',
        post: "", // varchar(255) DEFAULT NULL COMMENT '邮编',
        telphone: "", // varchar(200) DEFAULT NULL COMMENT '联系电话',
        mobile: "", // varchar(200) DEFAULT NULL COMMENT '手机号码',
        fax: "", // varchar(50) DEFAULT NULL COMMENT '传真',
        email: "", // varchar(200) DEFAULT NULL COMMENT '邮箱',
        memo: "", // varchar(500) DEFAULT NULL COMMENT '备注',
        dataSource: "" // varchar(25) DEFAULT NULL COMMENT '数据来源（保存wpm中的Id，格式如：wpm数据-addrid）',
      },
      editIndex: "",
      alldialogVisible:false,
      alldialogBool:'',
      customerList:[],
    };
  },
  created() {
    this.getAllSelectData();
    window.addEventListener("scroll", this.handleScroll);
    let id = '';
    if (this.isEdit) {
      this.patent ? id = this.appId : id = this.$route.params && this.$route.params.id || this.appId;
    }else {
      this.postForm.userId=this.$store.getters.userId
    }
    this.fetchData(id || '');
  },
  watch: {
    appId(n){
      if(n){
       this.fetchData(n);
      }
    },
    "addrFromData.ctData": function(data, oldval) {
      this.$set(this.addrFromData, 'country', '')
      this.$set(this.addrFromData, 'province', '')
      this.$set(this.addrFromData, 'city', '')
      // this.addrFromData.country = "";
      // this.addrFromData.province = "";
      // this.addrFromData.city = "";
      if (data[0]) {
        this.addrFromData.country = data[0];
      }
      if (data[1]) {
        this.addrFromData.province = data[1];
      }
      if (data[2]) {
        this.addrFromData.city = data[2];
      }

      this.addrFromData.continent = this.getcontinent(data[0]);
    }
  },
  methods: {
    handlePhoneInput() {
      const value = this.postForm.phone;
      const numericValue = value.replace(/\D/g, '');
      this.postForm.phone = numericValue;
      
      // if (numericValue.length > 0 && (numericValue.length < 10 || numericValue.length > 12)) {
      //   this.$message.warning('联系电话长度为10至12位');
      // }
    },
    changeTags(newTags) {
      this.postForm.keyNameList = newTags.map(item => item.text)
    },
    onPreView(file){
      if(file.raw){
        if(file.response){
          this.$commonUtils.downLoadAll({url:'ipdoc'+file.response.data[0].address})
        }
      } else {
        this.$commonUtils.downLoadAll({url: file.url})
      }
    },
    preView(file) {
      let data = {};
      if(file.raw){
        if(file.response){
          data = file.response.data[0]
        }
      } else {
        data = file
      }
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
    beforeUpload(){

    },
    successCallback(res,list){
      res.data.forEach(item => {
        item.name = item.materialName
        this.materialList.push(item)
      })
    },
    brforeRemoveFile(file, type){
      let materialId;

      if(file.raw){
        if(file.response){
          materialId = file.response.data[0].materialId
        }
      } else {
        materialId = file.materialId
      }
      this.isEdit&&delCaseMaterial({materialId,objInstId: this.postForm.appId, objType: 2005, subject: type}).then(res => {
        this.materialList.splice(this.materialList.map(item => item.materialId).indexOf(materialId), 1)
      })
      !this.isEdit&&deleteCaseMaterial({materialIdList: [materialId]}).then(()=>{
        this.materialList.splice(this.materialList.map(item => item.materialId).indexOf(materialId), 1)
      })
    },
    getUploadData(flag) {
      const data = {
        tokenID: this.$store.getters.token,
        objType: 2005,
        subject: flag == '总委' ? '申请人普通总委' : '申请人PCT总委',
        // instId: ''
      }
      return data
    },
    changeAppType(n){
      if(this.postForm.applicationType || !this.patent){
        this.postForm.applicationType = +this.postForm.applicationType
        return
      };
      if(n){
        this.$set(this.postForm, 'applicationType', 1752)
      //  大专院校：1748   ['学校', '学院', '大学']
      //  科研单位：1749  ['研究所', '研究院']
      //  工矿企业：1750  ['公司', '株式会社', '集团']
      //  事业单位：1751  ['出版社', '医院', '协会']
      //  个人    ：1752    else
        let list = [
          {
            typeName: '大专院校',
            id: 1748,
            content: ['学校', '学院', '大学']
          },
          {
            typeName: '科研单位',
            id: 1749,
            content: ['研究所', '研究院']
          },
          {
            typeName: '工矿企业',
            id: 1750,
            content: ['公司', '株式会社', '集团']
          },
          {
            typeName: '事业单位',
            id: 1751,
            content: ['出版社', '医院', '协会']
          }
        ];
        let res = list.find(i=>{
          if(i.content.find(item => n.includes(item)))return true;
          return false;
        })
        if(res){
          this.postForm.applicationType = res.id
        }
      }
    },
    changeBeian(v){
      !v && (this.$set(this.postForm, 'beianYear', ''))
    },
    statusChange(v,data,ind){
      // console.log(v)
      if(v == '启用' && data.isPatent && this.postForm.applicantAddresses&&this.postForm.applicantAddresses.length&&this.postForm.applicantAddresses.find((item, indx)=> item.isPatent && item.status=='启用' && indx != ind)){
            this.$confirm("地址重复,是否修改该地址并将已存在的地址状态改为停用?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                  }).then(()=>{
                    this.postForm.applicantAddresses.find((item, index)=> item.isPatent && item.status=='启用' && index != ind).status = '停用'

            }).catch(_=>{
              data.status = '停用'
              // this.postForm.applicantAddresses.push(this.addrFromData);
            })
          }else {}
    },
    remotepaternalUnit(query) {
      if (query !== "") {
        queryCustomerNameIdUrl({ keyword: query ,isCustomer:1,pageNo: 1,pageSize: 100 }).then(response => {
          if (response.success) {
            this.seletData.custnames =this.$commonUtils.unique([...response.data,...this.customerList.filter(item=>this.postForm.custIdArray.includes(item.custId))],'custId')
          } else {
            this.$message.error(response.message);
          }
        });
      }
    },
    allMessageFormShow(type) {
      this.alldialogVisible = true;

      switch (type) {

        case "addr":

            this.alltableData = this.postForm.applicantAddresses;
            this.alldialogBool = "addr";

          break;
        case "wfcon":

            this.alltableData = this.postForm.applicantContacts;
            this.alldialogBool = "wfcon";

          break;


        default:
          break;
      }
    },
    queryCustList(isId){
      queryCustomerNameIdUrl({ isCustomer:1}).then(response => {
        this.customerList=response.data
        isId&&(this.seletData.custnames = this.customerList.filter(item=>this.postForm.custIdArray.includes(item.custId)))
        if(!this.isEdit&&this.patent&&this.custId){
          this.$set(this.postForm, 'custIdArray', [this.custId])
          this.remotepaternalUnit(this.getCustNameStr)
        }
      })
    },
    fetchData(id) {
      !id&&this.queryCustList(false)
      id&&queryDetailByIdUrl({ appId: id })
        .then(response => {
          this.postForm = response.data.applicant;
          if (this.postForm.caseTypeList) {
            const array = this.$store.getters.caseTypeList || []
            const list = getTwoDimensionalArray(
              array,
              "caseTypeId",
              this.postForm.caseTypeList
            );
            console.log(list,'list');
            this.postForm.caseTypeIdArray = list
          } else {
            this.$set(this.postForm, 'caseTypeIdArray', [])
          }
          this.materialList = response.data.materialList;
          this.materialList.forEach(item=>{
            item.name = item.materialName
          })
          this.changeAppType(this.postForm.applicantName);
          this.backForm = JSON.parse(JSON.stringify(response.data.applicant))
          if(this.patent){
            this.$set(this.postForm, 'isFirstAppliantStr', this.firstApp ? '是' : '否')
            this.$set(this.postForm, 'isFirstAppliant', this.firstApp ? 1 : 0)
          }
          this.postForm.applicantAddresses = response.data.address;
          this.postForm.applicantContacts = response.data.contact;
          this.postForm.custIdArray=(response.data.applicant.custIdArray).filter(item=>!!item);
          queryUserNames().then(res => {
            res.data.forEach(item => {
              if(item.userId == this.postForm.userId) {
                this.userName = item.fullname
              }
            })
          })
          this.queryCustList(true)
//            this.mycustId= response.data.customer.custId;
//            this.postForm.custId= this.mycustId;
//            if(this.mycustId){
//          queryCustomerNameIdUrl({ custId:  this.mycustId ,isCustomer:1 ,pageNo: 1
// ,pageSize: 100}).then(response => {
//           if (response.success) {
//             this.seletData.custnames = response.data;
//           } else {
//             this.$message.error(response.message);
//           }
//         });
//            }

        })
        .catch(err => {
          console.log(err);
        });
    },

    //<--icon上传
    //创建用户-->
    submitForm(formName) {
      // if (this.postForm.appType!='自然人'){
      //   this.$set(this.rules.certCode[0],'required',true)
      // } else {
      //   this.$set(this.rules.certCode[0],'required',false)
      // }

      if (this.postForm.phone && this.postForm.phone.trim() !== '') {
        const numericValue = this.postForm.phone.replace(/\D/g, '');
        if (numericValue.length < 10 || numericValue.length > 12) {
          this.$message.error('联系电话长度为10至12位');
          return;
        }
      }

      this.$refs[formName].validate(valid => {
        if (!valid) {
          this.$message.error("请填写必填项");
        } else {
          this.loading = true;
          createUrl({...this.postForm,materialList: this.materialList.map(i=>({materialId: i.materialId}))}).then(async response => {
            // console.log(this.postForm)
            this.loading = false;
            if (response.success) {
              this.isCreatTrue = true;
              this.$message({
                type: "success",
                message: response.message
              });
              await this.$confirm("是否提交新申请人审查？", "提示", {
                confirmButtonText: "提交审查",
                cancelButtonText: "取消",
                distinguishCancelAndClose: true,
                type: "warning"
              }).then(() => {
                appSubmit({appId: response.data.appId}).then(res => {
                  this.$message.success('提交审查成功')
                  this.$emit('closeDialog', true)
                })
              }).catch(() => {
                this.$emit('closeDialog', true)
              })
              return
              if(!this.patent){
                if (this.isCust) {
                  this.$emit('closeDialog', true)
                } else {
                 this.$router.go(-1);
                }
              }else{
                if(this.postForm.applicantAddresses.length){
                  this.filterAddress(this.postForm.applicantAddresses)
                }
                this.postForm.appId = response.data.appId || ''
                this.$emit('checked', {data: this.postForm})
              }
            } else {
              this.$message.error(response.message);
            }
          });
        }
      });
    },
    filterAddress(addressList){
      this.postForm.appAddrArray = addressList.filter(item=>item.isPatent&&item.status == '启用')
    },
    updatasubmitForm(formName) {
      this.$commonUtils.handleObjNullAttr(this.postForm, this.backForm)
      // console.log(this.postForm)
      // return
      
      if (this.postForm.phone && this.postForm.phone.trim() !== '') {
        const numericValue = this.postForm.phone.replace(/\D/g, '');
        if (numericValue.length < 10 || numericValue.length > 12) {
          this.$message.error('联系电话长度为10至12位');
          return;
        }
      }
      
      this.$refs[formName].validate(valid => {
        if (!valid) {
          this.$message.error("请填写必填项");
        } else {
          this.loading = true;
          updateUrl({...this.postForm,materialList: this.materialList.map(i=>({materialId: i.materialId}))}).then(response => {
            this.loading = false;
            if (response.success) {
              this.isCreatTrue = true;
              this.$message({
                type: "success",
                message: response.message
              });
              if(!this.patent){
                if (this.isCust) {
                  this.$emit('closeDialog', true)
                } else {
                 this.$router.go(-1);
                }
              }else{
                if(this.postForm.applicantAddresses.length){
                  this.filterAddress(this.postForm.applicantAddresses)
                }
                this.$emit('checked', {data: this.postForm})
              }
            } else {
              this.$message.error(response.message);
            }
          });
        }
      });
    },
    creatLsCust(formName) {
      if (formName == "dfconFromData") {
        if (!this.dfconFromData.custContactId) {
          if (this.postForm.phone && this.postForm.phone.trim() !== '') {
          const numericValue = this.postForm.phone.replace(/\D/g, '');
          if (numericValue.length < 10 || numericValue.length > 12) {
            this.$message.error('联系电话长度为10至12位');
            return;
          }
        }
          this.$refs[formName].validate(valid => {
            if (valid) {
              this.dfconFromData.custId = this.postForm.custId;
              addCustomerContactUrl(this.dfconFromData).then(response => {
                if (response.success) {
                  this.dfconFromData.custContactId =
                    response.data.data.custContactId;
                  this.postForm.customerContacts.push(response.data.data);
                } else {
                  this.$message.error(response.message);
                }
              });
            }
          });
        }
      } else {
        if (!this.postForm.ctData[0]) {
          return;
        }
        if (!this.postForm.custId) {
          if (this.postForm.phone && this.postForm.phone.trim() !== '') {
            const numericValue = this.postForm.phone.replace(/\D/g, '');
            if (numericValue.length < 10 || numericValue.length > 12) {
              this.$message.error('联系电话长度为10至12位');
              return;
            }
          }
          this.$refs[formName].validate(valid => {
            if (valid) {
              addCustomer(this.postForm).then(response => {
                if (response.success) {
                  this.postForm.custId = response.data.custId;
                } else {
                  this.$message.error(response.message);
                }
              });
            }
          });
        }
      }
    },
    iscustChange() {
      if (this.postForm.isCustomer == 0) {
        this.custselectDis = true;
       this.preCustIdArray=this.postForm.custIdArray
        this.$set(this.postForm,'custIdArray',[])
        // this.postForm.custId = "";
      } else {

        this.custselectDis = false;
        console.log(this.preCustIdArray);
        this.postForm.custIdArray= this.preCustIdArray
      }
    },
    changeAddr(v){
      if(!v){
        queryCountry().then(response => {
          if (response.success) {
            this.seletData.ctDataOption = response.data;
            this.seletData.country = response.data;
          } else {
            this.$message.error(response.message);
          }
        })
      }else{
        queryCPCAddr().then(res => {
          this.seletData.ctDataOption = res.data;
        })
      }
    },
    // 获取各个select数据
    async getAllSelectData() {
      querycustSelectClass({ classId: this.seletDataArr }).then(response => {
        if (response.success) {
          this.seletData.statu = response.data["1044"];
          this.seletData.mainLegalNature = response.data["1042"];
          this.seletData.patentApplyType = response.data["1146"];
        } else {
          this.$message.error(response.message);
        }
      });
      // queryCountrysUrl().then(response => {
      //   if (response.success) {
      //     this.seletData.country = response.data;
      //   } else {
      //     this.$message.error(response.message);
      //   }
      // });
      queryCountry().then(response => {
        if (response.success) {
          this.seletData.ctDataOption = response.data;
          this.seletData.country = response.data;
        } else {
          this.$message.error(response.message);
        }
      });

    },

    getcontinent(item) {
      var newItem;
      this.seletData.ctDataOption.forEach(element => {
        if (element.value == item) {
          newItem = element.continentCn;
          return;
        }
      });
      return newItem;
    },

    // 表格项-->
    resetFromData(type) {
      switch (type) {
        case "addr":
          this.addrFromData = {
            addrId: "", // int(11) NOT NULL AUTO_INCREMENT COMMENT '主键',
            appId: "", // int(11) DEFAULT NULL COMMENT '申请人Id',
            addressCn: "", // varchar(500) DEFAULT NULL COMMENT '中文地址',
            addressEn: "", // varchar(500) DEFAULT NULL COMMENT '英文地址',
            addressMail: "", // varchar(255) DEFAULT NULL COMMENT '邮寄地址',
            continent: "", // varchar(255) DEFAULT NULL COMMENT '大洲',
            country: "", // varchar(255) DEFAULT NULL COMMENT '国家',
            province: "", // varchar(255) DEFAULT NULL COMMENT '州/省份',
            city: "", // varchar(255) DEFAULT NULL COMMENT '城市',
            post: "", // varchar(255) DEFAULT NULL COMMENT '邮编',
            status: "", // varchar(255) DEFAULT NULL COMMENT '状态',
            title: "", // varchar(255) DEFAULT NULL COMMENT '抬头',
            memo: "", // text COMMENT '备注',
            createDate: "", // datetime DEFAULT NULL COMMENT '创建日期',
            userId: "", // int(11) DEFAULT NULL COMMENT '创建用户',
            no: "", //int(11) DEFAULT NULL COMMENT '序号',
            dataSource: "", // varchar(255) DEFAULT NULL COMMENT '数据来源（保存wpm中的Id，格式如：wpm数据-addrid）',
            ctData: [],
            title: "",
            workUnit: "",
            isMailAddr: "",
            isBillAddr: "",
            isPatent: 0
          };
          break;
        case "wfcon":
          this.wfconFromData = {
            appContactId: "", // int(11) NOT NULL AUTO_INCREMENT COMMENT '主键',
            appId: "", // int(11) DEFAULT NULL COMMENT '申请人',
            nameCn: "", // varchar(255) DEFAULT NULL COMMENT '中文地址',
            nameEn: "", // varchar(255) DEFAULT NULL COMMENT '英文地址',
            address: "", // varchar(255) DEFAULT NULL COMMENT '地址',
            post: "", // varchar(255) DEFAULT NULL COMMENT '邮编',
            telphone: "", // varchar(200) DEFAULT NULL COMMENT '联系电话',
            mobile: "", // varchar(200) DEFAULT NULL COMMENT '手机号码',
            fax: "", // varchar(50) DEFAULT NULL COMMENT '传真',
            email: "", // varchar(200) DEFAULT NULL COMMENT '邮箱',
            memo: "", // varchar(500) DEFAULT NULL COMMENT '备注',
            dataSource: "" // varchar(25) DEFAULT NULL COMMENT '数据来源（保存wpm中的Id，格式如：wpm数据-addrid）',
          };
          break;

        default:
          break;
      }
    },
    addFormShow(type) {
      switch (type) {
        case "addr":
          this.dialogFormAddr = true;
          break;

        case "wfcon":
          this.dialogFormwfcon = true;
          break;

        default:
          break;
      }
      this.resetFromData(type);
      this.dialogFormStatus = "create";
    },
    custAddrupdata(row, type, index) {
      switch (type) {
        case "addr":
          this.addrFromData = Object.assign({}, row);
          if(!this.addrFromData.isPatent){
            this.$set(this.addrFromData, 'isPatent', 0)
          }
          this.$set(this.addrFromData, 'ctData', [
            this.addrFromData.country,
            this.addrFromData.province,
            this.addrFromData.city
          ])
          // this.addrFromData.ctData = [
          //   this.addrFromData.country,
          //   this.addrFromData.province,
          //   this.addrFromData.city
          // ];
          this.dialogFormAddr = true;

          break;

        case "wfcon":
          this.wfconFromData = Object.assign({}, row);
          this.dialogFormwfcon = true;
          break;

        default:
          break;
      }
      this.editIndex = index;
      this.dialogFormStatus = "update";
    },
    custAddrdel(row, type, index) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          switch (type) {
            case "addr":
              // const index = this.postForm.applicantAddresses.indexOf(row);
               this.postForm.applicantAddresses.splice(index, 1);

               this.$set(this.postForm,'jobRequire',this.postForm.jobRequire)
              break;

            case "wfcon":
              // const index1 = this.postForm.applicantContacts.indexOf(row);
              this.postForm.applicantContacts.splice(index, 1);
              this.$set(this.postForm,'jobRequire',this.postForm.jobRequire)

              break;

            default:
              break;
          }
          this.$forceUpdate()
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    createCustAddr(type) {
      switch (type) {
        case "addr":
          this.dialogFormAddr = false;
          this.addrFromData.isupdate=true
          if(this.addrFromData.status == '启用'&&this.addrFromData.isPatent && this.postForm.applicantAddresses&&this.postForm.applicantAddresses.length&&this.postForm.applicantAddresses.find(item=> item.isPatent && item.status=='启用')){
            this.$confirm("地址重复,是否将已存在的地址状态改为停用?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                  }).then(()=>{
                    this.postForm.applicantAddresses.find(item=> item.isPatent && item.status=='启用').status = '停用'
                    // this.addrFromData.status = '启用'
                    this.postForm.applicantAddresses.push(this.addrFromData);
                    this.$forceUpdate()

            }).catch(_=>{
              // this.postForm.applicantAddresses.push(this.addrFromData);
              // this.$forceUpdate()
              // console.log(this.postForm.applicantAddresses,'000')
            })
          }else {
            // this.addrFromData.status = '启用'
            this.postForm.applicantAddresses.push(this.addrFromData);
          }

          break;

        case "wfcon":
          this.dialogFormwfcon = false;
          this.wfconFromData.isupdate=true
          this.postForm.applicantContacts.push(this.wfconFromData);

          break;

        default:
          break;
      }
    },
    updateCustAddr(type) {
      switch (type) {
        case "addr":
          this.dialogFormAddr = false;
          if(this.addrFromData.status == '启用'&&this.addrFromData.isPatent && this.postForm.applicantAddresses&&this.postForm.applicantAddresses.length&&this.postForm.applicantAddresses.find((item, index) => item.isPatent && item.status=='启用' && index != this.editIndex)){
            this.$confirm("地址重复,是否将已存在的地址状态改为停用?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                  }).then(()=>{
                    this.postForm.applicantAddresses.find((item, index) => item.isPatent && item.status=='启用' && index != this.editIndex).status = '停用'
                    // this.addrFromData.status = '启用'
                    this.postForm.applicantAddresses.splice(
                      this.editIndex,
                      1,
                      this.addrFromData
                    );
                    this.$forceUpdate()
                    // this.postForm.applicantAddresses.push(this.addrFromData);

            }).catch(_=>{
              this.addrFromData.status = '停用'
                    this.postForm.applicantAddresses.splice(
                      this.editIndex,
                      1,
                      this.addrFromData
                    );
              this.$forceUpdate()
              // this.postForm.applicantAddresses.push(this.addrFromData);
            })
          }else {
            this.postForm.applicantAddresses.splice(
              this.editIndex,
              1,
              this.addrFromData
            );
          }

          break;

        case "wfcon":
          this.dialogFormwfcon = false;
          this.postForm.applicantContacts.splice(
            this.editIndex,
            1,
            this.wfconFromData
          );

          break;

        default:
          break;
      }
    },
    filterCust(str) {
      this.filterCustName = str;
    }

    //<--表格项
  },
};
</script>


<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.el-table /deep/ th {
  background-color: #7199d5;
  color: #ffffff;
}

.table-dl-row {
  /deep/ thead,
  /deep/ th,
  /deep/ .el-table__header-wrapper,
  /deep/ .el-table__header,
  /deep/ tr,
  /deep/ td,
  /deep/ .el-select,
  /deep/ .el-input,
  /deep/ .el-input__inner {
    height: 40px;
    line-height: 40px;
    padding: 0px;
  }
  /deep/ td {
    background-color: #ffffff !important;
  }
  /deep/ .el-input__inner,
  /deep/ .el-select {
    width: 80%;
  }
}
.form-border {
  /deep/ .el-row {
    margin: 0px;
  }
  /deep/ .postInfo-container-item {
    width: 100%;
  }
  /deep/ .el-form-item__label {
    flex-shrink: 0;
    background-color: #f9f9f9;
    /*width: 30%;*/
    width: 170px;
    text-align: right;
  }

  /deep/ .el-form-item {
    border-right: 1px solid #d7d7d7;
    margin: 0px !important;
  }
  /deep/ .el-row {
    border-bottom: 1px solid #d7d7d7;
  }
  /deep/ .el-input,
  /deep/ .el-select {
    width: 70%;
    max-width: 100%;
    min-width: 0;
  }
  /deep/ .el-form-item__content {
    text-align: center;
    min-height: 30px;
    height: auto;
    line-height: 30px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    min-width: 0;
  }
  .fullRow {
    /deep/ .el-form-item__label {
      /*width: 15%;*/
      width: 150px;
    }

    /deep/ .el-input,
    /deep/ .el-select {
      width: 80%;
    }
  }
  /deep/ .el-input__inner {
    border: none;
  }
  /deep/ .el-select .el-input {
    width: 80%;
  }
  border-top: 1px solid #d7d7d7;
  border-left: 1px solid #d7d7d7;
  // border-bottom: 1px solid #d7d7d7;
}

.titleLeft {
  margin-right: 20px;
}
.createPost-container {
  position: relative;

  background-color: #e8ebed;
  /deep/ .form-con {
    background-color: #ffffff;

    /deep/ .form-con-item {
      @include clearfix;
      padding: 5px 20px;
      /deep/ .el-col {
      }
    }
  }
  /deep/ .createPost-main-container {
    padding: 0px;
    border: 1px solid #ccc;
    /deep/ .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;
    }
  }

  /deep/ .word-counter {
    width: 40px;
    position: absolute;
    right: 10px;
    top: 0px;
  }
}
.clearfix::after {
  content: "";
  display: block;
  clear: both;
}
.uploader-custfile {
  display: flex;
  width: 100%;
  /deep/ .el-form-item__content {
    text-align: left;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    width: 85%;
    min-width: 0;
  }

  /deep/ .el-form-item__label {
  }
}
.tilteSpan {
  font-size: 18px;
  padding: 15px 0px;
  color: #7199d5;
}
.article-textarea /deep/ {
  /deep/ textarea {
    padding-right: 40px;
    resize: none;
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #bfcbd9;
  }
}

.avatar-uploader {
  /deep/ .el-form-item__label {
    height: 154px;
    line-height: 154px;
    width: 30%;
  }
  height: 154px;

  /deep/ .el-upload {
    border: 1px dashed #b6b2b2;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    margin-top: 4px;
  }
}
.avatar-uploader {
  /deep/ .el-upload:hover {
    border-color: #409eff;
  }
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 145px;
  height: 145px;
  line-height: 145px;
  text-align: center;
  border: 1px dashed #d9d9d9;
}
.avatar {
  width: 145px;
  height: 145px;
  display: block;
}
.el-step {
  cursor: pointer;
}
.tilteBtn {
  text-align: right;
  padding: 10px 10px;
  background-color: #d0d0d0;
}
.vue-tags-input {
  background-color: inherit !important;
  max-width: 100%;
}
.casetype-cascader{
  /deep/ .el-input{
    width: 100% !important;
  }
}
.el-card{
  .item_p{margin-top: 10px}
}

@media screen and (max-width: 1360px) {
  .form-border {
    /deep/ .el-col.el-col-12 {
      flex: 0 0 100%;
      max-width: 100%;
    }

    /deep/ .el-form-item__content {
      flex: 1;
    }

    /deep/ .el-input,
    /deep/ .el-select,
    /deep/ .el-select .el-input {
      width: 100%;
    }
  }

  .uploader-custfile {
    /deep/ .el-form-item__content {
      width: 100%;
    }
  }
}
</style>
