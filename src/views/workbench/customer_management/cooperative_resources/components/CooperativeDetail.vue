<template>
  <div class="createPost-container">

    <el-form ref="postForm" :model="postForm" :rules="rules" size="mini" class="form-container">
      <div class="createPost-main-container">
        <div class="form-con">
          <el-row>
            <el-col class="tilteSpan" :span="24">
              <span id='jbxx-title'>合作资源基本信息</span>
            </el-col>
          </el-row>

          <el-row>
            <el-col class="form-con-item" :span="22">

              <el-row class="form-border">
                <el-col :span="24">
                  <el-row class="">
                    <el-col :span="12">
                      <el-form-item label="编码:" class="postInfo-container-item">
                        <el-input v-model="postForm.custId" :disabled="true"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="简称:" prop='name' class="postInfo-container-item">
                        <el-input v-model="postForm.name"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row class="fullRow">
                    <el-col :span="24">
                      <el-form-item label="中文名称/全称:" prop="fullname" class="">
                        <el-input v-model="postForm.fullname" @blur='creatLsCust("postForm")'></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>

                  <el-row class="fullRow">
                    <el-col :span="24">
                      <el-form-item label="英文名称:" class="postInfo-container-item">
                        <el-input v-model="postForm.fullnameEn"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>

                  <el-row class="">
                    <el-col :span="12">
                      <el-form-item label="大洲:" class="postInfo-container-item">
                        <template>
                          <el-input :disabled="true" v-model="postForm.continent"></el-input>
                        </template>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="国家/省份/城市:" prop="ctData" @change='creatLsCust("postForm")' class="postInfoleft">
                        <template>
                          <el-cascader clearable change-on-select style="width: 100%;" @change='creatLsCust("postForm")' placeholder="" v-model="postForm.ctData" :options="seletData.ctDataOption"
                                       filterable>
                          </el-cascader>

                        </template>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="是否客户:" class="postInfo-container-item">
                        <el-radio-group v-model="postForm.isCustomer">
                          <el-radio :label='1'>是</el-radio>
                          <el-radio :label='0'>否</el-radio>
                        </el-radio-group>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="是否事务所:" class="postInfo-container-item">
                        <el-radio-group v-model="postForm.isAgent">
                          <el-radio :label='1'>是</el-radio>
                          <el-radio :label='0'>否</el-radio>
                        </el-radio-group>
                      </el-form-item>
                    </el-col>
                  </el-row>

                  <el-row class="">
                    <el-col :span="12">
                      <el-form-item label="合作资源类型:" prop="companyType" class="postInfo-container-item">
                        <template>
                          <el-select default-first-option :clearable='true' placeholder="请选择" v-model="postForm.companyType" @change='creatLsCust("postForm")' filterable>
                            <el-option v-for="item in seletData.hzzyTypr" :key="item.typeName" :label="item.typeName" :value="item.typeName">
                            </el-option>
                          </el-select>
                        </template>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="合作状态:" class="postInfo-container-item">
                        <el-select default-first-option :disabled="hzsttatus" :clearable='true' placeholder="请选择" v-model="postForm.collaborationStatus" filterable @change="handleChangeCurStatus">
                          <el-option v-for="item in seletData.hzstatus" :key="item.id" :label="item.typeName" :value="item.id">
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row class="fullRow" v-if="postForm.collaborationStatus == 2251">
                    <el-col :span="24">
                      <el-form-item label="停用说明:" prop="collaborationStatusDesc" class="postInfo-container-item">
                        <template slot="label">
                          <span>停用说明:</span>
                          <el-tooltip style="cursor:pointer" effect="dark" content="请填写对停用说明记录内容和记录要求的说明和提示" placement="top-start">
                            <i class="el-icon-warning"/>
                          </el-tooltip>
                        </template>
                        <el-input v-model="postForm.collaborationStatusDesc">
                        </el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row class="">
                    <el-col :span="12">
                      <el-form-item label="主体法律性质:" prop="legalNature" class="postInfo-container-item">
                        <template>
                          <el-select default-first-option :clearable='true' placeholder="请选择" v-model="postForm.legalNature" @change='creatLsCust("postForm")' filterable>
                            <el-option v-for="item in seletData.mainLegalNature" :key="item.id" :label="item.typeName" :value="item.id">
                            </el-option>
                          </el-select>
                        </template>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="事务所类型:" class="postInfo-container-item">
                        <template>
                          <el-select default-first-option :clearable='true' placeholder="请选择" v-model="postForm.firmType" filterable>
                            <el-option v-for="item in seletData.swsType" :key="item.id" :label="item.typeName" :value="item.typeName">
                            </el-option>
                          </el-select>
                        </template>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row class="fullRow">
                    <el-col :span="24">
                      <el-form-item class="postInfo-container-item">
                        <span slot="label">营业执照号码:<br>Business License No.</span>
                        <el-input v-model="postForm.businessLicenseNo"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row class="fullRow">
                    <el-col :span="24">
                      <el-form-item class="postInfo-container-item">
                        <span slot="label">上传营业执照文本:<br>Business License</span>
                        <el-upload
                          style="width: 50%;margin-top: 10px;"
                          ref="upload"
                          class="upload-demo"
                          drag
                          multiple
                          name="custFile"
                          :data="uploadFileData"
                          :action="addCustomerFileUrl"
                          :file-list="postForm.materialList.filter(item => item.materialTypeId == 301656)"
                          :before-upload="(file) => handleFilePreview1(file, 301656)"
                          :on-remove="(file,fileList) => brforeRemoveFile(file,fileList)"
                          :on-preview="previewFile"
                          :on-success="onsuccess1"
                        >
<!--                          <i class="el-icon-upload"></i>-->
                          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                        </el-upload>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="官网网址:" class="postInfo-container-item">
                        <template>
                          <el-input v-model="postForm.website"></el-input>
                        </template>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="传真:" class="postInfo-container-item">
                        <template>
                          <el-input v-model="postForm.fax1"></el-input>
                        </template>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="电话:" prop="phone" class="postInfo-container-item">
                        <template>
                          <el-input @change='creatLsCust("postForm")' v-model="postForm.phone"></el-input>
                        </template>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="电子邮件:" class="postInfo-container-item" prop="email">
                        <template>
                          <el-input v-model="postForm.email" @change="(value) => changeEmail(value)"></el-input>
                          <div v-if="emailError" style="color: #F56C6C;font-size: 12px;">邮箱格式有误</div>
                        </template>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row class="fullRow">
                    <el-col :span="24">
                      <el-form-item label="成立日期:" class="postInfo-container-item">

                        <template>
                          <!-- <el-date-picker v-model="postForm.annualAccDate" format='yyyy-MM-dd' value-format="yyyy-MM-dd" align="right" type="date" placeholder="选择日期" :picker-options="pickerOptions">
                          </el-date-picker> -->
                          <el-radio-group v-model="datePickerType" @change="changeDatePickerType">
                            <el-radio label="year">年</el-radio>
                            <el-radio label="month">月</el-radio>
                            <el-radio label='date'>日</el-radio>
                          </el-radio-group>
                          <el-date-picker
                            v-model="postForm.annualAccDate"
                            placeholder="请选择日期"
                            :format="formats"
                            :value-format="formats"
                            :type="datePickerType"
                            style="width: 130px;"
                          ></el-date-picker>
                        </template>

                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row class="">
                    <el-col :span="12">
                      <el-form-item label="总人数:" class="postInfo-container-item">
                        <el-input v-model="postForm.scale" @change="changeScale"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="IP人数:" class="postInfo-container-item">
                        <el-input v-model="postForm.scaleIp"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>

<!--                  <el-row class="fullRow">-->
<!--                    <el-col :span="24">-->
<!--                      <el-form-item label="账期附件:" class="postInfo-container-item">-->
<!--                        </el-input>-->
<!--                      </el-form-item>-->
<!--                    </el-col>-->
<!--                  </el-row>-->
                  <el-row class="fullRow">
                    <el-col :span="24">
                      <el-form-item label="简介:" class="postInfo-container-item">
                        <el-input type="textarea" :rows="3"  v-model="postForm.info">
                        </el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row class="fullRow">
                    <el-col :span="24">
                      <el-form-item label="合作评价:" class="postInfo-container-item">
                        <div style="text-align: left" v-html="postForm.evaluation && postForm.evaluation.replace(/\n/g, '<br />') || ''">
                        </div>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row class="fullRow">
                    <el-col :span="24">
                      <el-form-item label="账期:" class="postInfo-container-item">
                        <el-input style="width: 120px;" v-model="postForm.accountPeriod" type="number">
                        </el-input>
                        <span>天</span>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row class="fullRow">
                    <el-col :span="24">

                      <el-form-item label="账期附件:" class="postInfo-container-item uploader-custfile">
                        <template>
                          <el-upload drag class="upload-demo" style="margin-top: 10px;" name="custFile" :data='addPayTermAttData' ref="uploadCustFile" :action="addCustomerFileUrl"
                                     :before-upload="handlePreview"
                                     :on-preview="preview"
                                     :before-remove="(file)=>brforeRemoveFile(file,'cust')" :file-list="postForm.materialList.filter(item => item.materialTypeId == 301655)" :auto-upload="true">
                            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                          </el-upload>
                        </template>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row class="fullRow">
                    <el-col :span="24">
                      <el-form-item label="账期优惠/折扣:" class="postInfo-container-item">
                        <el-input v-model="postForm.accountPeriodDiscount">
                        </el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row class="fullRow">
                    <el-col :span="24">
                      <el-form-item label="适用条件:" class="postInfo-container-item">
                        <el-input v-model="postForm.applicability">
                        </el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row class="fullRow">
                    <el-col :span="24">

                      <el-form-item label="客户文档:" class="postInfo-container-item uploader-custfile">
                        <template>
                          <el-upload drag class="upload-demo" style="margin-top: 10px;" name="custFile" :data='addCustomerFileData' ref="uploadCustFile" :action="addCustomerFileUrl"
                                     :before-upload="handlePreview"
                                     :on-preview="preview"
                                     :before-remove="(file)=>brforeRemoveFile(file,'cust')" :file-list="postForm.materialList.filter(item => item.materialTypeId == 301625)" :auto-upload="true">
                            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
<!--                              <el-button slot="trigger" size="small" type="primary">选取文件</el-button>-->
<!--                              <el-button style="margin-left: 10px;" size="small" type="success" @click="addCustomerFile">上传</el-button>-->
                          </el-upload>
                        </template>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="建档日期:" class="postInfo-container-item">
                        <template>
                          <el-date-picker v-model="postForm.createTime" format='yyyy-MM-dd' value-format="yyyy-MM-dd" align="right" type="date" placeholder="选择日期" :picker-options="pickerOptions">
                          </el-date-picker>
                          <!--                          <el-input v-model="postForm.createTime"></el-input>-->
                        </template>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="建档人:" class="postInfo-container-item">
                        <template>
                          <el-input v-model="postForm.createUserName"></el-input>
                        </template>
                      </el-form-item>
                    </el-col>
                  </el-row>

                </el-col>
              </el-row>
              <el-row>
                <el-col class="tilteSpan" :span="24">
                  <span id='khdz-title'>合作资源-地址</span>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24" style='text-align:right'>
                  <el-button type="primary" size="mini" @click="addFormShow('addr')">添加
                  </el-button>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-table size="mini" :data="postForm.customerAddrs" border fit empty-text="暂无数据" highlight-current-row current-row-key style="width: 100%;">
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
                    <el-table-column label="状态" align="left" width>
                      <template slot-scope="scope">
                        <span>{{ scope.row.statusStr }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="备注" align="left" width>
                      <template slot-scope="scope">
                        <span>{{ scope.row.memo }}</span>
                      </template>
                    </el-table-column>

                    <el-table-column label="操作" align="left" width="" class-name="small-padding fixed-width">
                      <template slot-scope="scope">

                        <el-button size="mini" type="text" @click="custAddrupdata(scope.row,'addr')">修改</el-button>
                        <el-button size="mini" type="text" @click="custAddrdel(scope.row,scope.$index,'addr')">删除</el-button>

                      </template>
                    </el-table-column>
                  </el-table>
                </el-col>
              </el-row>
              <el-row>
                <el-col class="tilteSpan" :span="24">
                  <span id='dflxr-title'>合作资源-对方联系人</span>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24" class="" style='text-align:right'>
                  <el-button type="primary" size="mini" @click="addFormShow('dfcon')">添加
                  </el-button>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-table size="mini" :data="postForm.customerContacts" border fit empty-text="暂无数据" highlight-current-row current-row-key style="width: 100%;">

                    <el-table-column label="姓名" align="left" width prop="name" :filters="headFilters['name']" :filter-method="filterHandler">
                      <template slot-scope="scope">
                        <span :class="scope.row.ismain ? 'require' : ''">{{ scope.row.name }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="业务领域" align="left" width prop="bustypeList" :filters="headFilters['bustype']" :filter-method="filterHandler">
                      <template slot-scope="scope">
                        <span>{{ scope.row.bustypeList?scope.row.bustypeList.map(item=>item.replace('&','：')).join('，'):'' }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="是否主要联系人" align="left" prop="ismainStr" width :filters="headFilters['ismainStr']" :filter-method="filterHandler">
                      <template slot-scope="scope">
                        <span>{{ scope.row.ismainStr}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="职务" align="left" width prop="jobtitle" :filters="headFilters['jobtitle']" :filter-method="filterHandler">
                      <template slot-scope="scope">
                        <span>{{ scope.row.jobtitle }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="部门" align="left" width prop="department" :filters="headFilters['department']" :filter-method="filterHandler">
                      <template slot-scope="scope">
                        <span>{{ scope.row.department }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="办公电话" align="left" width prop="tel" :filters="headFilters['tel']" :filter-method="filterHandler">
                      <template slot-scope="scope">
                        <span>{{ scope.row.tel }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="邮箱" align="left" width prop="email" :filters="headFilters['email']" :filter-method="filterHandler">
                      <template slot-scope="scope">
                        <span>{{ scope.row.email }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="状态" align="left" width prop="statusStr" :filters="headFilters['statusStr']" :filter-method="filterHandler">
                      <template slot-scope="scope">
                        <span>{{ scope.row.statusStr }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="启用" align="left" width prop="sysStatusStr" :filters="headFilters['sysStatusStr']" :filter-method="filterHandler">
                      <template slot-scope="scope">
                        <span>{{ scope.row.sysStatusStr }}</span>
                      </template>
                    </el-table-column>

                    <el-table-column label="操作" align="left" width="" class-name="small-padding fixed-width">
                      <template slot-scope="scope">

                        <el-button size="mini" type="text" @click="custAddrupdata(scope.row,'dfcon')">修改</el-button>
                        <el-button size="mini" type="text" @click="custAddrdel(scope.row,scope.$index,'dfcon')">删除</el-button>

                      </template>
                    </el-table-column>
                  </el-table>
                </el-col>
              </el-row>
              <el-row>
                <el-col class="tilteSpan" :span="24">
                  <span id='khhd-title'>合作资源-活动</span>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24" style='text-align:right'>
                  <el-button type="primary" size="mini" @click="addFormShow('hd')">添加
                  </el-button>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-table size="mini" :data="postForm.activities" border fit empty-text="暂无数据" highlight-current-row current-row-key style="width: 100%;">
                    <el-table-column type="index" width="50" label="序号" align="left"></el-table-column>
                    <el-table-column label="活动类型" align="left" width>
                      <template slot-scope="scope">
                        <span>{{ scope.row.actTypeStr }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="主题" align="left" width>
                      <template slot-scope="scope">
                        <span>{{ scope.row.subject }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="开始时间" align="left" width>
                      <template slot-scope="scope">
                        <span>{{ scope.row.begindate }}</span>
                      </template>
                    </el-table-column>
                    <!-- <el-table-column label="对方联系人" align="left" width>
                      <template slot-scope="scope">
                        <span>{{ scope.row.customerContactActs[0].custContactName }}</span>
                      </template>
                    </el-table-column> -->
                    <el-table-column label="赠送礼品" align="left" width>
                      <template slot-scope="scope">
                        <span>{{ scope.row.putGift }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="内容描述" align="left" width>
                      <template slot-scope="scope">
                        <span>{{ scope.row.description }}</span>
                      </template>
                    </el-table-column>

                    <el-table-column label="操作" align="left" width="" class-name="small-padding fixed-width">
                      <template slot-scope="scope">

                        <el-button size="mini" type="text" @click="custAddrupdata(scope.row,'hd')">修改</el-button>
                        <el-button size="mini" type="text" @click="custAddrdel(scope.row,scope.$index,'hd')">删除</el-button>

                      </template>
                    </el-table-column>
                  </el-table>
                </el-col>
              </el-row>
              <el-row>
                <el-col class="tilteSpan" :span="24">
                  <span id='wflxr-title'>合作资源-我方联系人</span>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24" style='text-align:right'>
                  <el-button type="primary" size="mini" @click="addFormShow('wfcon')">添加
                  </el-button>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-table size="mini" :data="postForm.agencyContacts" border fit empty-text="暂无数据" highlight-current-row current-row-key style="width: 100%;">
                    <el-table-column type="index" width="50" label="序号" align="left"></el-table-column>
                    <el-table-column label="姓名" align="left" width>
                      <template slot-scope="scope">
                        <span>{{ scope.row.fullname }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="业务领域" align="left" width>
                      <template slot-scope="scope">
                        <span>{{ scope.row.business }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="案件类型" align="left" width>
                      <template slot-scope="scope">
                        <span>{{ scope.row.caseTypeStr }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="职位" align="left" width>
                      <template slot-scope="scope">
                        <span>{{ scope.row.position }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="角色描述" align="left" width>
                      <template slot-scope="scope">
                        <span>{{ scope.row.userrole }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="开始日期" align="left" width>
                      <template slot-scope="scope">
                        <span>{{ scope.row.startdate }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="截止日期" align="left" width>
                      <template slot-scope="scope">
                        <span>{{ scope.row.enddate }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="备注" align="left" width>
                      <template slot-scope="scope">
                        <span>{{ scope.row.memo }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="查全部案件" align="left" width>
                      <template slot-scope="scope">
                        <span>{{ scope.row.ischeckStr }}</span>
                      </template>
                    </el-table-column>

                    <el-table-column label="操作" align="left" width="" class-name="small-padding fixed-width">
                      <template slot-scope="scope">

                        <el-button size="mini" type="text" @click="custAddrupdata(scope.row,'wfcon')">修改</el-button>
                        <el-button size="mini" type="text" @click="custAddrdel(scope.row,scope.$index,'wfcon')">删除</el-button>

                      </template>
                    </el-table-column>
                  </el-table>
                </el-col>
              </el-row>
              <el-row>
                <div class="tilteSpan">
                  <span id='wflxr-title'>银行账户</span>
                </div>
                <div>
                  <el-upload
                    style="width: 50%;margin-left: 10px;"
                    ref="upload"
                    class="upload-demo"
                    multiple
                    drag
                    name="custFile"
                    :data="uploadFileData"
                    :action="addCustomerFileUrl"
                    :file-list="postForm.materialList.filter(item => item.materialTypeId == 301657)"
                    :before-upload="(file) => handleFilePreview1(file, 301657)"
                    :on-remove="(file,fileList) => brforeRemoveFile(file,fileList)"
                    :on-preview="previewFile"
                    :on-success="onsuccess1"
                  >

                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                  </el-upload>
                </div>
              </el-row>
              <el-row>
                <el-col :span="24" style='text-align:right'>
                  <el-button type="primary" size="mini" @click="addFormShow('yhzh')">添加
                  </el-button>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-table size="mini" :data="postForm.bankaccounts" border fit empty-text="暂无数据" highlight-current-row current-row-key style="width: 100%;">
                    <el-table-column type="index" width="50" label="序号" align="left"></el-table-column>
                    <el-table-column label="账户名称" align="left" width>
                      <template slot-scope="scope">
                        <span>{{ scope.row.accountName }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="收款人姓名" align="left" width>
                      <template slot-scope="scope">
                        <span>{{ scope.row.accName }}</span>
                      </template>
                    </el-table-column>
                    <!-- <el-table-column label="收款人地址" align="left" width>
                      <template slot-scope="scope">
                        <span>{{ scope.row.accAddr }}</span>
                      </template>
                    </el-table-column> -->
                    <el-table-column label="收款人国家" align="left" width>
                      <template slot-scope="scope">
                        <span>{{ scope.row.accCountry }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="开户银行" align="left" width>
                      <template slot-scope="scope">
                        <span>{{ scope.row.bankName }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="Account No./IBAN" align="left" width>
                      <template slot-scope="scope">
                        <span>{{ scope.row.account }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="银行信息启用状态" align="left" width>
                      <template slot-scope="scope">
                        <span>{{ scope.row.state?'启用':'停用' }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="创建人" align="left" width>
                      <template slot-scope="scope">
                        <span>{{ scope.row.createUserIdStr }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="创建日期" align="left" width>
                      <template slot-scope="scope">
                        <span>{{ scope.row.createDate }}</span>
                      </template>
                    </el-table-column>

                    <el-table-column label="操作" align="left" width="" class-name="small-padding fixed-width">
                      <template slot-scope="scope">

                        <el-button size="mini" type="text" @click="custAddrupdata(scope.row,'yhzh')">修改</el-button>
                        <el-button size="mini" type="text" @click="custAddrdel(scope.row,scope.$index,'yhzh')">删除</el-button>

                      </template>
                    </el-table-column>
                  </el-table>
                </el-col>
              </el-row>

              <el-row>
                <el-col class="tilteSpan" :span="24">
                  <span id='glgs-title'>关联公司</span>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24" style='text-align:right'>
                  <el-button type="primary" size="mini" @click="addhdDftable('glgs')">添加
                  </el-button>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-table size="mini" :data="postForm.customerAssociates" border fit empty-text="暂无数据" highlight-current-row current-row-key style="width: 100%;">
                    <el-table-column type="index" width="50" label="序号" align="left"></el-table-column>
                    <el-table-column label="公司名称" align="left" width>
                      <template slot-scope="scope">
                        <el-input type="text" placeholder="" v-model="scope.row.custAssName">
                        </el-input>
                      </template>
                    </el-table-column>
                    <el-table-column label="与关联公司关系" align="left" width>
                      <template slot-scope="scope">
                        <el-input type="text" placeholder="" v-model="scope.row.relationship">
                        </el-input>
                      </template>
                    </el-table-column>

                    <el-table-column label="操作" align="left" width="" class-name="small-padding fixed-width">
                      <template slot-scope="{row}">

                        <el-button size="mini" type="text" @click="handledeleElementhddglgs(row)">删除</el-button>

                      </template>
                    </el-table-column>
                  </el-table>
                </el-col>
              </el-row>
              <el-row>
                <el-col class="tilteSpan" :span="24">
                  <span id='zyfy-title'>执业法域</span>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24" style='text-align:right'>
                  <el-button type="primary" size="mini" @click="addFormShow('zyfy')">添加
                  </el-button>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-table size="mini" :data="postForm.customerOffercountriesList" border fit empty-text="暂无数据" highlight-current-row current-row-key style="width: 100%;">
                    <el-table-column type="index" width="50" label="序号" align="left"></el-table-column>
                    <el-table-column label="国家/地区" align="left" width>
                      <template slot-scope="scope">
                        {{ scope.row.country }}
                      </template>
                    </el-table-column>
                    <el-table-column label="业务领域" align="left" width>
                      <template slot-scope="scope">
                        {{ scope.row.businessArea && scope.row.businessArea.replace('（请详述）&','：') }}
                      </template>
                    </el-table-column>
                    <el-table-column label="简介" align="left" width show-overflow-tooltip>
                      <template slot-scope="scope">
                        {{ scope.row.memo }}
                      </template>
                    </el-table-column>
                    <el-table-column label="排名" align="left" width>
                      <template slot-scope="scope">
                        {{ scope.row.ranking }}
                      </template>
                    </el-table-column>

                    <el-table-column label="操作" align="left" width="" class-name="small-padding fixed-width">
                      <template slot-scope="scope"">
                        <el-button size="mini" type="text" @click="custAddrupdata(scope.row,'zyfy')">修改</el-button>
                        <el-button size="mini" type="text" @click="custAddrdel(scope.row,scope.$index,'zyfy')">删除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-col>
              </el-row>
              <!-- <el-row>
                <el-col class="tilteSpan" :span="24">
                  <span id='pm-title'>排名</span>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24" style='text-align:right'>
                  <el-button type="primary" size="mini" @click="addFormShow('pm')">添加
                  </el-button>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-table size="mini" :data="postForm.customerRankingList" border fit empty-text="暂无数据" highlight-current-row current-row-key style="width: 100%;">
                    <el-table-column type="index" width="50" label="序号" align="left"></el-table-column>
                    <el-table-column label="排名" align="left" width>
                      <template slot-scope="scope">
                        {{ scope.row.ranking }}
                      </template>
                    </el-table-column>
                    <el-table-column label="业务领域" align="left" width>
                      <template slot-scope="scope">
                        {{ scope.row.businessArea && scope.row.businessArea.replace('（请详述）','：') }}
                        {{ scope.row.pmOtherDesc }}
                      </template>
                    </el-table-column>

                    <el-table-column label="操作" align="left" width="" class-name="small-padding fixed-width">
                      <template slot-scope="scope"">
                        <el-button size="mini" type="text" @click="custAddrupdata(scope.row,'pm')">修改</el-button>
                        <el-button size="mini" type="text" @click="custAddrdel(scope.row,scope.$index,'pm')">删除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-col>
              </el-row> -->

              <el-row v-if="!isCustomer">
                <el-col :span="24" style="text-align:center">
                  <el-form-item>
                    <template v-if="!$route.query.examine">


                      <el-button size="medium" type="primary" v-if="!isEdit" @click="submitForm('postForm')">创建
                      </el-button>
                      <el-button size="medium" type="primary" v-if="isEdit" @click="updatasubmitForm('postForm')">保存修改
                      </el-button>
                    </template>
                    <template v-if="$route.query.examine">
                      <el-button size="medium" type="primary" @click="customerExamine('1621')">审核通过
                      </el-button>
                      <el-button size="medium" type="primary" @click="customerExamine('1624')">审核驳回
                      </el-button>
                    </template>
                    <el-button type="primary" size="medium" @click="$router.go(-1);">取消</el-button>

                  </el-form-item>
                </el-col>

              </el-row>
            </el-col>
            <el-col class="form-con-item clearfix" :span="2">
              <div style="height: 520px;position: fixed;top:20%;right:2%">
                <el-steps :space="200" :active="stepActive" direction="vertical">
                  <el-step @click.native="stepset(0)" title="基本信息"></el-step>
                  <el-step @click.native="stepset(1)" title="客户地址"></el-step>
                  <el-step @click.native="stepset(2)" title="对方联系人"></el-step>
                  <el-step @click.native="stepset(3)" title="活动"></el-step>
                  <el-step @click.native="stepset(4)" title="我方联系人"></el-step>
                  <el-step @click.native="stepset(5)" title="关联公司"></el-step>
                  <el-step @click.native="stepset(6)" title="执业法域"></el-step>
                </el-steps>
              </div>
            </el-col>
          </el-row>

        </div>

      </div>

    </el-form>

    <el-dialog :show-close="false" append-to-body :close-on-click-modal="false" title="客户地址" :visible.sync="dialogFormAddr" width="70%">
      <el-form ref="creatAddrForm" :model="addrFromData" size="mini" label-position="left" style="width: 100%;">
        <el-row class="form-border">
          <el-col :span="24">
            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="单位:" class="postInfo-container-item">

                  <el-input type="text" placeholder="" :disabled="true" v-model="postForm.fullname">
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
                  <el-radio-group v-model="addrFromData.isMailAdd">
                    <el-radio :label='1'>是</el-radio>
                    <el-radio :label='0'>否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="是否账单地址 :" class="postInfo-container-item">
                  <el-radio-group v-model="addrFromData.isBillAdd">
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
            <el-row>
              <el-col :span="12">
                <el-form-item label="国家/省份/城市:" prop="ctData" class="postInfo-container-item">
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
                    <el-select default-first-option :clearable='true' placeholder="请选择" v-model="addrFromData.status" @change="(e)=>e?addrFromData.statusStr=seletData.statu.find(item=>item.id==e).typeName:''" filterable>
                      <el-option v-for="item in seletData.statu" :key="String(item.id)" :label="item.typeName" :value="String(item.id)">
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
    <el-dialog :show-close="false" append-to-body :close-on-click-modal="false" title="对方联系人" @open='dialogFormOpen("dfcon")' :visible.sync="dialogFormdfcon" width="70%">
      <ContactDfDetail @updateCustomerContact="updateCustomerContact" pageType="isCollaboration" ref="ContactDfDetail" v-if="dialogFormdfcon && dfconFromData.custContactId" :isLook="false" :isEdit="isEdit" :id="dfconFromData.custContactId"></ContactDfDetail>
      <!--      <el-form ref="dfconFromData" :model="dfconFromData" :rules="dfconRules" size="mini" label-position="left" style="width: 100%;">-->
      <!--        <el-row>-->
      <!--          <el-col class="form-con-item" :span="24">-->
      <!--            <el-row>-->
      <!--              <el-col class="tilteSpan" :span="24">-->
      <!--                <span>基本信息</span>-->
      <!--              </el-col>-->
      <!--            </el-row>-->
      <!--            <el-row class="form-border">-->
      <!--              <el-col :span="12">-->
      <!--                <el-row>-->
      <!--                  <el-col :span="24">-->
      <!--                    <el-form-item label="编码:" class="postInfo-container-item">-->
      <!--                      <el-input v-model="dfconFromData.custContactId" :disabled="true"></el-input>-->
      <!--                    </el-form-item>-->
      <!--                  </el-col>-->

      <!--                </el-row>-->
      <!--                <el-row>-->
      <!--                  <el-col :span="24">-->
      <!--                    <el-form-item label="姓:" class="postInfo-container-item">-->
      <!--                      <el-input v-model="dfconFromData.firstname"></el-input>-->
      <!--                    </el-form-item>-->
      <!--                  </el-col>-->

      <!--                </el-row>-->
      <!--                <el-row>-->
      <!--                  <el-col :span="24">-->
      <!--                    <el-form-item label="姓名:" prop="name" class="">-->
      <!--                      <el-input v-model="dfconFromData.name" @blur='creatLsCust("dfconFromData")'></el-input>-->
      <!--                    </el-form-item>-->
      <!--                  </el-col>-->
      <!--                </el-row>-->
      <!--                <el-row>-->
      <!--                  <el-col :span="24">-->
      <!--                    <el-form-item label="性别:" prop="gender" class="postInfo-container-item">-->
      <!--                      <template>-->
      <!--                        <el-select default-first-option :clearable='true' placeholder="请选择" v-model="dfconFromData.gender" @change='creatLsCust("dfconFromData")' filterable>-->
      <!--                          <el-option v-for="item in seletData.sex" :key="item.id" :label="item.typeName" :value="item.id">-->
      <!--                          </el-option>-->
      <!--                        </el-select>-->
      <!--                      </template>-->
      <!--                    </el-form-item>-->
      <!--                  </el-col>-->

      <!--                </el-row>-->
      <!--                <el-row>-->
      <!--                  <el-col :span="24">-->
      <!--                    <el-form-item label="称谓:" class="postInfo-container-item">-->
      <!--                      <template>-->
      <!--                        <el-select default-first-option :clearable='true' placeholder="请选择" v-model="dfconFromData.called" filterable>-->
      <!--                          <el-option v-for="item in seletData.called" :key="item.id" :label="item.typeName" :value="item.id">-->
      <!--                          </el-option>-->
      <!--                        </el-select>-->
      <!--                      </template>-->
      <!--                    </el-form-item>-->
      <!--                  </el-col>-->

      <!--                </el-row>-->

      <!--              </el-col>-->
      <!--              <el-col :span="12">-->
      <!--                <el-row>-->
      <!--                  <el-col :span="24">-->
      <!--                    <el-form-item label="照片" class="postInfo-container-item avatar-uploader">-->

      <!--                      <el-upload :action='dfuserIconUrl' ref='custContIconupload' :data='custContIconSendData' :on-success='dficonSendSuccess' accept="image/jpeg,image/gif,image/png"-->
      <!--                        :before-upload="onBeforeUploadIcon" :show-file-list="false" :auto-upload='false' name='custContIcon' :on-change="dfhandleAvatarChange">-->
      <!--                        <img v-if="dfconFromData.custContIcon" :src="`/ipdoc${dfconFromData.custContIcon}`" class="avatar">-->
      <!--                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>-->
      <!--                      </el-upload>-->
      <!--                    </el-form-item>-->
      <!--                  </el-col>-->
      <!--                </el-row>-->

      <!--              </el-col>-->
      <!--            </el-row>-->
      <!--            <el-row class="form-border">-->
      <!--              <el-col :span="24">-->

      <!--                <el-row class="fullRow">-->
      <!--                  <el-col :span="24">-->
      <!--                    <el-form-item label="出生日期:" class="postInfo-container-item">-->

      <!--                      <el-date-picker v-model="dfconFromData.dfconFromData" format='yyyy-MM-dd' value-format="yyyy-MM-dd" align="right" type="date" placeholder="选择日期" :picker-options="pickerOptions">-->
      <!--                      </el-date-picker>-->
      <!--                    </el-form-item>-->
      <!--                  </el-col>-->
      <!--                </el-row>-->
      <!--                <el-row class="fullRow">-->
      <!--                  <el-col :span="24">-->
      <!--                    <el-form-item label="所属单位:" class="postInfo-container-item">-->

      <!--                      <el-input v-model="postForm.fullname"></el-input>-->
      <!--                    </el-form-item>-->
      <!--                  </el-col>-->
      <!--                </el-row>-->

      <!--                <el-row class="fullRow">-->
      <!--                  <el-col :span="24">-->
      <!--                    <el-form-item label="业务领域:" class="postInfo-container-item">-->

      <!--                      <el-input v-model="dfconFromData.bustype"></el-input>-->
      <!--                    </el-form-item>-->
      <!--                  </el-col>-->
      <!--                </el-row>-->

      <!--                <el-row class="fullRow">-->
      <!--                  <el-col :span="24">-->
      <!--                    <el-form-item label="分支机构:" class="postInfo-container-item">-->

      <!--                      <el-input v-model="dfconFromData.branch"></el-input>-->
      <!--                    </el-form-item>-->
      <!--                  </el-col>-->
      <!--                </el-row>-->
      <!--                <el-row>-->
      <!--                  <el-col :span="12">-->
      <!--                    <el-form-item label="是否主要联系人:" prop="ismain" class="postInfo-container-item">-->
      <!--                      <el-radio-group v-model="dfconFromData.ismain" @change='creatLsCust("dfconFromData")'>-->
      <!--                        <el-radio :label='true'>是</el-radio>-->
      <!--                        <el-radio :label='false'>否</el-radio>-->
      <!--                      </el-radio-group>-->
      <!--                    </el-form-item>-->
      <!--                  </el-col>-->
      <!--                  <el-col :span="12">-->
      <!--                    <el-form-item label="是否账单联系人:" prop="isBillContact" class="postInfo-container-item">-->
      <!--                      <el-radio-group v-model="dfconFromData.isBillContact" @change='creatLsCust("dfconFromData")'>-->
      <!--                        <el-radio :label='true'>是</el-radio>-->
      <!--                        <el-radio :label='false'>否</el-radio>-->
      <!--                      </el-radio-group>-->
      <!--                    </el-form-item>-->
      <!--                  </el-col>-->
      <!--                </el-row>-->
      <!--                <el-row>-->
      <!--                  <el-col :span="12">-->
      <!--                    <el-form-item label="部门:" class="postInfo-container-item">-->
      <!--                      <el-input v-model="dfconFromData.department"></el-input>-->
      <!--                    </el-form-item>-->
      <!--                  </el-col>-->
      <!--                  <el-col :span="12">-->
      <!--                    <el-form-item label="职务:" class="postInfo-container-item">-->
      <!--                      <el-input v-model="dfconFromData.jobtitle"></el-input>-->
      <!--                    </el-form-item>-->
      <!--                  </el-col>-->
      <!--                </el-row>-->
      <!--                <el-row class="fullRow">-->
      <!--                  <el-col :span="24">-->
      <!--                    <el-form-item label="状态:" prop="status" class="postInfo-container-item">-->

      <!--                      <template>-->
      <!--                        <el-select default-first-option :clearable='true' @change='creatLsCust("dfconFromData")' placeholder="请选择" v-model="dfconFromData.status" filterable>-->
      <!--                          <el-option v-for="item in seletData.lxstatu" :key="item.id" :label="item.typeName" :value="item.id">-->
      <!--                          </el-option>-->
      <!--                        </el-select>-->
      <!--                      </template>-->

      <!--                    </el-form-item>-->
      <!--                  </el-col>-->
      <!--                </el-row>-->
      <!--                <el-row class="fullRow">-->
      <!--                  <el-col :span="24">-->
      <!--                    <el-form-item label="启动状态:" prop="sysStatus" class="postInfo-container-item">-->

      <!--                      <template>-->
      <!--                        <el-select default-first-option :clearable='true' @change='creatLsCust("dfconFromData")' placeholder="请选择" v-model="dfconFromData.sysStatus" filterable>-->
      <!--                          <el-option v-for="item in seletData.statu" :key="item.id" :label="item.typeName" :value="item.id">-->
      <!--                          </el-option>-->
      <!--                        </el-select>-->
      <!--                      </template>-->

      <!--                    </el-form-item>-->
      <!--                  </el-col>-->
      <!--                </el-row>-->
      <!--                <el-row class="fullRow">-->
      <!--                  <el-col :span="24">-->
      <!--                    <el-form-item label="是否对账人:" class="postInfo-container-item">-->

      <!--                      <el-radio-group v-model="dfconFromData.isCollectbillMan">-->
      <!--                        <el-radio :label='1'>是</el-radio>-->
      <!--                        <el-radio :label='0'>否</el-radio>-->
      <!--                      </el-radio-group>-->

      <!--                    </el-form-item>-->
      <!--                  </el-col>-->
      <!--                </el-row>-->

      <!--              </el-col>-->
      <!--            </el-row>-->
      <!--            <el-row>-->
      <!--              <el-col class="tilteSpan" :span="24">-->
      <!--                <span>联系方式</span>-->
      <!--              </el-col>-->
      <!--            </el-row>-->
      <!--            <el-row class="form-border">-->
      <!--              <el-col :span="24">-->

      <!--                <el-row class="fullRow">-->
      <!--                  <el-col :span="24">-->
      <!--                    <el-form-item label="办公电话1:" class="postInfo-container-item">-->
      <!--                      <el-input v-model="dfconFromData.tel"></el-input>-->
      <!--                    </el-form-item>-->
      <!--                  </el-col>-->
      <!--                </el-row>-->
      <!--                <el-row class="fullRow">-->
      <!--                  <el-col :span="24">-->
      <!--                    <el-form-item label="办公电话2:" class="postInfo-container-item">-->
      <!--                      <el-input v-model="dfconFromData.mobile2"></el-input>-->
      <!--                    </el-form-item>-->
      <!--                  </el-col>-->
      <!--                </el-row>-->
      <!--                <el-row class="fullRow">-->
      <!--                  <el-col :span="24">-->
      <!--                    <el-form-item label="移动电话:" class="postInfo-container-item">-->

      <!--                      <el-input v-model="dfconFromData.mobile1"></el-input>-->
      <!--                    </el-form-item>-->
      <!--                  </el-col>-->
      <!--                </el-row>-->
      <!--                <el-row class="fullRow">-->
      <!--                  <el-col :span="24">-->
      <!--                    <el-form-item label="住宅电话:" class="postInfo-container-item">-->

      <!--                      <el-input v-model="dfconFromData.phone2"></el-input>-->
      <!--                    </el-form-item>-->
      <!--                  </el-col>-->
      <!--                </el-row>-->
      <!--                <el-row class="fullRow">-->
      <!--                  <el-col :span="24">-->
      <!--                    <el-form-item label="邮箱1:" class="postInfo-container-item">-->

      <!--                      <el-input v-model="dfconFromData.email"></el-input>-->
      <!--                    </el-form-item>-->
      <!--                  </el-col>-->
      <!--                </el-row>-->
      <!--                <el-row class="fullRow">-->
      <!--                  <el-col :span="24">-->
      <!--                    <el-form-item label="邮箱2:" class="postInfo-container-item">-->

      <!--                      <el-input v-model="dfconFromData.email2"></el-input>-->
      <!--                    </el-form-item>-->
      <!--                  </el-col>-->
      <!--                </el-row>-->
      <!--                <el-row class="fullRow">-->
      <!--                  <el-col :span="24">-->
      <!--                    <el-form-item label="传真1:" class="postInfo-container-item">-->

      <!--                      <el-input v-model="dfconFromData.fax1"></el-input>-->
      <!--                    </el-form-item>-->
      <!--                  </el-col>-->
      <!--                </el-row>-->
      <!--                <el-row class="fullRow">-->
      <!--                  <el-col :span="24">-->
      <!--                    <el-form-item label="即时通类型:" class="postInfo-container-item">-->

      <!--                      <el-input v-model="dfconFromData.msgType"></el-input>-->
      <!--                    </el-form-item>-->
      <!--                  </el-col>-->
      <!--                </el-row>-->
      <!--                <el-row class="fullRow">-->
      <!--                  <el-col :span="24">-->
      <!--                    <el-form-item label="即时通账号:" class="postInfo-container-item">-->

      <!--                      <el-input v-model="dfconFromData.msgAccount"></el-input>-->
      <!--                    </el-form-item>-->
      <!--                  </el-col>-->
      <!--                </el-row>-->

      <!--              </el-col>-->
      <!--            </el-row>-->
      <!--            <el-row>-->
      <!--              <el-col class="tilteSpan" :span="24">-->
      <!--                <span>关系人信息</span>-->
      <!--              </el-col>-->
      <!--            </el-row>-->
      <!--            <el-row class="form-border">-->
      <!--              <el-col :span="24">-->
      <!--                <el-row class="fullRow">-->
      <!--                  <el-col :span="24">-->
      <!--                    <el-form-item label="上级主管:" class="postInfo-container-item">-->

      <!--                      <template>-->
      <!--                        <el-select default-first-option :clearable='true' placeholder="请选择" v-model="dfconFromData.bossCustContactId" filterable>-->
      <!--                          <el-option v-for="item in seletData.dfcon" :key="item.custContactId" :label="item.name" :value="item.custContactId">-->
      <!--                          </el-option>-->
      <!--                        </el-select>-->
      <!--                      </template>-->

      <!--                    </el-form-item>-->
      <!--                  </el-col>-->
      <!--                </el-row>-->
      <!--                <el-row class="fullRow">-->
      <!--                  <el-col :span="24">-->
      <!--                    <el-form-item label="关系人1名称:" class="postInfo-container-item">-->

      <!--                      <template>-->
      <!--                        <el-select default-first-option :clearable='true' placeholder="请选择" v-model="dfconFromData.gxr1CustContactId" filterable>-->
      <!--                          <el-option v-for="item in seletData.dfcon" :key="item.custContactId" :label="item.name" :value="item.custContactId">-->
      <!--                          </el-option>-->
      <!--                        </el-select>-->
      <!--                      </template>-->

      <!--                    </el-form-item>-->
      <!--                  </el-col>-->
      <!--                </el-row>-->
      <!--                <el-row class="fullRow">-->
      <!--                  <el-col :span="24">-->
      <!--                    <el-form-item label="关系人1关系描述:" class="postInfo-container-item">-->

      <!--                      <el-input v-model="dfconFromData.relat1"></el-input>-->
      <!--                    </el-form-item>-->
      <!--                  </el-col>-->
      <!--                </el-row>-->
      <!--                <el-row class="fullRow">-->
      <!--                  <el-col :span="24">-->
      <!--                    <el-form-item label="关系人2名称:" class="postInfo-container-item">-->

      <!--                      <template>-->
      <!--                        <el-select default-first-option :clearable='true' placeholder="请选择" v-model="dfconFromData.gxr2CustContactId" filterable>-->
      <!--                          <el-option v-for="item in seletData.dfcon" :key="item.custContactId" :label="item.name" :value="item.custContactId">-->
      <!--                          </el-option>-->
      <!--                        </el-select>-->
      <!--                      </template>-->

      <!--                    </el-form-item>-->
      <!--                  </el-col>-->
      <!--                </el-row>-->
      <!--                <el-row class="fullRow">-->
      <!--                  <el-col :span="24">-->
      <!--                    <el-form-item label="关系人2关系描述:" class="postInfo-container-item">-->

      <!--                      <el-input v-model="dfconFromData.relat2"></el-input>-->
      <!--                    </el-form-item>-->
      <!--                  </el-col>-->
      <!--                </el-row>-->
      <!--                <el-row class="fullRow">-->
      <!--                  <el-col :span="24">-->
      <!--                    <el-form-item label="关系人3名称:" class="postInfo-container-item">-->

      <!--                      <template>-->
      <!--                        <el-select default-first-option :clearable='true' placeholder="请选择" v-model="dfconFromData.gxr3CustContactId" filterable>-->
      <!--                          <el-option v-for="item in seletData.dfcon" :key="item.custContactId" :label="item.name" :value="item.custContactId">-->
      <!--                          </el-option>-->
      <!--                        </el-select>-->
      <!--                      </template>-->

      <!--                    </el-form-item>-->
      <!--                  </el-col>-->
      <!--                </el-row>-->
      <!--                <el-row class="fullRow">-->
      <!--                  <el-col :span="24">-->
      <!--                    <el-form-item label="关系人3关系描述:" class="postInfo-container-item">-->

      <!--                      <el-input v-model="dfconFromData.relat3"></el-input>-->
      <!--                    </el-form-item>-->
      <!--                  </el-col>-->
      <!--                </el-row>-->
      <!--                <el-row class="fullRow">-->
      <!--                  <el-col :span="24">-->
      <!--                    <el-form-item label="来源人:" class="postInfo-container-item">-->

      <!--                      <el-input v-model="dfconFromData.infoFromStaff"></el-input>-->
      <!--                    </el-form-item>-->
      <!--                  </el-col>-->
      <!--                </el-row>-->
      <!--                <el-row class="fullRow">-->
      <!--                  <el-col :span="24">-->
      <!--                    <el-form-item label="来源场合:" class="postInfo-container-item">-->

      <!--                      <el-input v-model="dfconFromData.infoFromPlace"></el-input>-->
      <!--                    </el-form-item>-->
      <!--                  </el-col>-->
      <!--                </el-row>-->
      <!--                <el-row class="fullRow">-->
      <!--                  <el-col :span="24">-->
      <!--                    <el-form-item label="来源时间:" class="postInfo-container-item">-->

      <!--                      <el-date-picker v-model="dfconFromData.infoFromDate" format='yyyy-MM-dd' value-format="yyyy-MM-dd" align="right" type="date" placeholder="选择日期" :picker-options="pickerOptions">-->
      <!--                      </el-date-picker>-->
      <!--                    </el-form-item>-->
      <!--                  </el-col>-->
      <!--                </el-row>-->
      <!--              </el-col>-->
      <!--            </el-row>-->
      <!--            <el-row>-->
      <!--              <el-col class="tilteSpan" :span="24">-->
      <!--                <span>常规活动信息</span>-->
      <!--              </el-col>-->
      <!--            </el-row>-->
      <!--            <el-row class="form-border">-->
      <!--              <el-col :span="24">-->
      <!--                <el-row class="fullRow">-->
      <!--                  <el-col :span="24">-->
      <!--                    <el-form-item label="常规活动:" class="postInfo-container-item">-->

      <!--                      <el-input v-model="dfconFromData.routineAct"></el-input>-->
      <!--                    </el-form-item>-->
      <!--                  </el-col>-->
      <!--                </el-row>-->
      <!--                <el-row class="fullRow">-->
      <!--                  <el-col :span="24">-->
      <!--                    <el-form-item label="常规活动备注:" class="postInfo-container-item">-->

      <!--                      <el-input v-model="dfconFromData.routineActMemo"></el-input>-->
      <!--                    </el-form-item>-->
      <!--                  </el-col>-->
      <!--                </el-row>-->
      <!--                <el-row class="fullRow">-->
      <!--                  <el-col :span="24">-->

      <!--                    <el-form-item label="联系人文档:" class="postInfo-container-item uploader-custfile">-->
      <!--                      <template>-->

      <!--                        <el-upload class="upload-demo" name="custContactFile" :data='custContactFiledata' ref="uploadcustContactFile" :action="custContactFileUrl" :before-upload="handlePreview"-->
      <!--                          list-type='picture' :on-remove="handleRemove" :file-list="dfconFromData.custContactFile" :auto-upload="false">-->
      <!--                          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>-->
      <!--                          <el-button style="margin-left: 10px;" size="small" type="success">-->
      <!--                            上传</el-button>-->

      <!--                        </el-upload>-->
      <!--                      </template>-->
      <!--                    </el-form-item>-->
      <!--                  </el-col>-->
      <!--                </el-row>-->
      <!--                <el-row class="fullRow">-->
      <!--                  <el-col :span="24">-->
      <!--                    <el-form-item label="备注:" class="postInfo-container-item uploader-custfile">-->
      <!--                      <template>-->
      <!--                        <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="dfconFromData.memo">-->
      <!--                        </el-input>-->
      <!--                      </template>-->
      <!--                    </el-form-item>-->
      <!--                  </el-col>-->
      <!--                </el-row>-->
      <!--              </el-col>-->
      <!--            </el-row>-->

      <!--          </el-col>-->

      <!--        </el-row>-->
      <!--      </el-form>-->
      <div slot="footer" class="dialog-footer">
        <el-button @click="deldfcondialog">
          取消
        </el-button>
        <el-button type="primary" @click="createCustAddr('dfcon')">
          确定
        </el-button>
      </div>
    </el-dialog>
    <el-dialog :show-close="false" append-to-body :close-on-click-modal="false" title="客户活动" :visible.sync="dialogFormhd" width="70%">
      <el-form ref="creathdForm" class="hdForm" :model="hdFromData" label-position="left" style="width: 100%;">
        <el-row class="form-border">
          <el-col :span="24">
            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="活动编号:" class="postInfo-container-item">

                  <el-input type="text" placeholder="" :disabled="true" v-model="hdFromData.custActId">
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="活动状态:" class="postInfo-container-item">
                  <template>
                    <el-select default-first-option :clearable='true' placeholder="请选择" v-model="hdFromData.actStatus" filterable>
                      <el-option v-for="item in seletData.hdstatu" :key="String(item.id)" :label="item.typeName" :value="String(item.id)">
                      </el-option>
                    </el-select>
                  </template>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="主题:" class="postInfo-container-item">

                  <el-input type="text" placeholder="" v-model="hdFromData.subject">
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item class="postInfo-container-item">
                  <template slot="label">
                    <span>活动类型:</span>
                    <el-tooltip style="cursor:pointer" effect="dark" content="合作条件方面，请填写报价、折扣、账期、手续费、银行账户、税号等与整体合作相关说明" placement="top-start">
                      <i class="el-icon-warning"/>
                    </el-tooltip>
                  </template>
                  <el-select default-first-option :clearable='true' placeholder="请选择" v-model="hdFromData.actType" filterable>
                    <el-option v-for="item in seletData.hdtype" :key="String(item.id)" :label="item.typeName" :value="String(item.id)">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="活动方式:" class="postInfo-container-item">
                  <template>
                    <el-select default-first-option :clearable='true' placeholder="请选择" v-model="hdFromData.actKind" filterable>
                      <el-option v-for="item in seletData.hdfs" :key="String(item.id)" :label="item.typeName" :value="String(item.id)">
                      </el-option>
                    </el-select>
                  </template>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="开始时间 :" class="postInfo-container-item">
                  <el-date-picker v-model="hdFromData.begindate" format='yyyy-MM-dd' value-format="yyyy-MM-dd" align="right" type="date" placeholder="选择日期" :picker-options="pickerOptions">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="结束时间 :" class="postInfo-container-item">
                  <el-date-picker v-model="hdFromData.enddate" format='yyyy-MM-dd' value-format="yyyy-MM-dd" align="right" type="date" placeholder="选择日期" :picker-options="pickerOptions">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="地点:" class="postInfo-container-item">

                  <el-input type="text" placeholder="" v-model="hdFromData.place">
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="招待类型 :" class="postInfo-container-item">
                  <template>
                    <el-select default-first-option :clearable='true' placeholder="请选择" v-model="hdFromData.serviceType" filterable>
                      <el-option v-for="item in seletData.zdfs" :key="String(item.id)" :label="item.typeName" :value="String(item.id)">
                      </el-option>
                    </el-select>
                  </template>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="招待地点 :" class="postInfo-container-item">

                  <el-input type="text" placeholder="" v-model="hdFromData.servicePlace">
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="赠送礼品 :" class="postInfo-container-item">
                  <el-input type="text" placeholder="" v-model="hdFromData.putGift">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="收到礼品 :" class="postInfo-container-item">

                  <el-input type="text" placeholder="" v-model="hdFromData.getGift">
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="内容描述:" class="postInfo-container-item uploader-custfile">
                  <template>
                    <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 20}" placeholder="请输入内容" v-model="hdFromData.description">
                    </el-input>
                  </template>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="上传文件" class="postInfo-container-item uploader-custfile">
                  <template>
                    <el-upload
                      style="width: 50%;"
                      ref="upload"
                      class="upload-demo"
                      drag
                      multiple
                      name="attachFile"
                      :data="uploadFileData"
                      :action="creatematerial"
                      :file-list="materialList"
                      :before-upload="handleFilePreview"
                      :on-remove="(file,fileList) => handleFileRemove(file,fileList)"
                      :on-preview="previewFile"
                      :on-success="onsuccess"
                    >
                      <i class="el-icon-upload"></i>
                      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    </el-upload>
                  </template>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="fullRow  table-dl-row">
              <el-col :span="24">
                <el-form-item label="对方联系人:" class="postInfo-container-item uploader-custfile">
                  <template>
                    <el-row>
                      <el-col :span="24" style='text-align:right'>
                        <el-button type="primary" size="mini" @click="addhdDftable('dfcon')">添加
                        </el-button>
                      </el-col>
                    </el-row>
                    <el-table size="mini" :data="hdFromData.customerContactActs" :highlight-current-row='false' border fit empty-text="暂无数据" current-row-key style="width: 100%;">
                      <el-table-column type="index" width="50" label="序号" align="left"></el-table-column>
                      <el-table-column label="活动类型" align="left" width>
                      <template slot-scope="scope">
                        <span>{{ scope.row.actTypeStr }}</span>
                      </template>
                    </el-table-column>
                      <el-table-column label="客户" align="left" width>
                        <template slot-scope="scope">
                          <el-select  v-model="scope.row.custId" @change="((val)=>{hdkhselect(val, scope.row, scope.$index)})" no-match-text='暂无数据' loading-text='正在查询'
                                      filterable remote reserve-keyword placeholder="请输入关键词" :remote-method="(e)=>{remotepaternalUnitKh(scope.$index,e)}">
                            <!--                            <el-option v-for="item in seletData.paternalUnitKh" :key="String(item.custId)" :label="item.name" :value="String(item.custId)">-->
                            <el-option v-for="item in scope.row.paternalUnitKh" :key="String(item.custId)" :label="item.name" :value="String(item.custId)">
                            </el-option>
                          </el-select>

                        </template>
                      </el-table-column>

                      <el-table-column label="对方联系人" align="left" width>
                        <template slot-scope="scope">
                          <el-select :clearable='true' placeholder="请选择" v-model="scope.row.custContactId" filterable>
                            <el-option v-for="item in scope.row.hdlx" :key="String(item.custContactId)" :label="item.name" :value="String(item.custContactId)">
                            </el-option>
                          </el-select>

                        </template>
                      </el-table-column>
                      <el-table-column label="备注" align="left" width>
                        <template slot-scope="scope">

                          <el-input type="text" placeholder="" v-model="scope.row.memo">
                          </el-input>
                        </template>
                      </el-table-column>

                      <el-table-column label="操作" align="left" class-name="small-padding fixed-width">
                        <template slot-scope="{row}">
                          <el-row>
                            <el-col :span="24">
                              <el-button size="mini" type="text" @click="handledeleElementhddfcon(row)">删除</el-button>
                            </el-col>
                          </el-row>

                        </template>
                      </el-table-column>
                    </el-table>
                  </template>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="fullRow  table-dl-row">
              <el-col :span="24">
                <el-form-item label="我方联系人:" class="postInfo-container-item uploader-custfile">
                  <template>
                    <el-row>
                      <el-col :span="24" style='text-align:right'>
                        <el-button type="primary" size="mini" @click="addhdDftable('wfcon')">添加
                        </el-button>
                      </el-col>
                    </el-row>
                    <el-table size="mini" :data="hdFromData.agencyContactActs" border fit empty-text="暂无数据" :highlight-current-row='false' current-row-key>
                      <el-table-column type="index" width="50" label="序号" align="left"></el-table-column>
                      <el-table-column label="员工" align="left" width>
                        <template slot-scope="scope">

                          <el-select default-first-option :clearable='true' placeholder="请选择" v-model="scope.row.userId" filterable>
                            <el-option v-for="item in seletData.userNames" :key="item.userId" :label="item.fullname" :value="item.userId">
                            </el-option>
                          </el-select>

                        </template>
                      </el-table-column>

                      <el-table-column label="备注" align="left" width>
                        <template slot-scope="scope">

                          <el-input type="text" placeholder="" v-model="scope.row.memo">
                          </el-input>
                        </template>
                      </el-table-column>

                      <el-table-column label="操作" align="left" width="430" class-name="small-padding fixed-width">
                        <template slot-scope="{row}">
                          <el-row>
                            <el-col :span="24">

                              <el-button size="mini" type="text" @click="handledeleElementhdwfcon(row)">删除</el-button>

                            </el-col>
                          </el-row>

                        </template>
                      </el-table-column>
                    </el-table>
                  </template>
                </el-form-item>
              </el-col>
            </el-row>

          </el-col>
        </el-row>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormhd = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogFormStatus==='create'?createCustAddr('hd'):updateCustAddr('hd')">
          确定
        </el-button>
      </div>
    </el-dialog>
    <el-dialog :show-close="false" append-to-body :close-on-click-modal="false" title="我方联系人" :visible.sync="dialogFormwfcon" width="70%">
      <el-form ref="creatwfconForm" :model="wfconFromData" label-position="left" style="width: 100%;">
        <el-row class="form-border">
          <el-col :span="24">

            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="姓名:" class="postInfo-container-item">
                  <template>
                    <el-select default-first-option :clearable='true' @change="wfUserNamechange" placeholder="请选择" v-model="wfconFromData.userId" filterable>
                      <el-option v-for="item in seletData.wfuserNames" :key="item.userId" :label="item.fullname" :value="item.userId">
                      </el-option>
                    </el-select>
                  </template>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="业务领域 :" class="postInfo-container-item">
                  <template>
                    <el-select default-first-option :clearable='true' placeholder="请选择" v-model="wfconFromData.business" filterable>
                      <el-option v-for="item in seletData.ywstuta" :key="String(item.typeName)" :label="item.typeName" :value="String(item.typeName)">
                      </el-option>
                    </el-select>
                  </template>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="案件类型:" class="postInfo-container-item">
                  <template>
                    <el-select default-first-option :clearable='true' placeholder="请选择" v-model="wfconFromData.caseTypeId" filterable>
                      <el-option v-for="item in seletData.caseType" :key="item.caseTypeId" :label="item.caseType" :value="item.caseTypeId">
                      </el-option>
                    </el-select>
                  </template>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="职位:" class="postInfo-container-item">

                  <el-input type="text" :disabled="true" placeholder="" v-model="wfconFromData.position">
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="角色描述:" class="postInfo-container-item">
                  <template>
                    <el-select default-first-option :clearable='true' placeholder="请选择" v-model="wfconFromData.userrole" filterable>
                      <el-option v-for="item in seletData.roleMessage" :key="String(item.typeName)" :label="item.typeName" :value="String(item.typeName)">
                      </el-option>
                    </el-select>
                  </template>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="开始日期:" class="postInfo-container-item">
                  <el-date-picker v-model="wfconFromData.startdate" format='yyyy-MM-dd' value-format="yyyy-MM-dd" align="right" type="date" placeholder="选择日期" :picker-options="pickerOptions">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="截止日期:" class="postInfo-container-item">
                  <el-date-picker v-model="wfconFromData.enddate" format='yyyy-MM-dd' value-format="yyyy-MM-dd" align="right" type="date" placeholder="选择日期" :picker-options="pickerOptions">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="能否查看全部案件:" class="postInfo-container-item">

                  <el-radio-group v-model="wfconFromData.ischeck" @change="(e)=>e?wfconFromData.ischeckStr='是':'否'">
                    <el-radio :label='1'>是</el-radio>
                    <el-radio :label='0'>否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="备注:" class="postInfo-container-item uploader-custfile">
                  <template>
                    <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="wfconFromData.memo">
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
    <el-dialog class="bankDialog" :show-close="false" append-to-body :close-on-click-modal="false" title="银行账户" :visible.sync="dialogFormyhzh" width="70%">
      <el-form ref="creatyhzhForm" :model="yhzhFromData" label-position="left" style="width: 100%;">
        <el-row class="form-border">
          <el-col :span="24">
            <el-row>
              <el-col class="tilteSpan" :span="24" style="padding: 10px">
                <span >银行信息 Bank Details</span>
              </el-col>
            </el-row>
            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="账户名称:" class="postInfo-container-item">
                  <div style="display: flex;flex-direction: column;width: 100%;">
                    <el-input type="text" placeholder="请填写法域、币种等账户信息" v-model="yhzhFromData.accountName"> </el-input>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item class="postInfo-container-item">
                  <span slot="label">开户行:<br />Bank Name</span>
                  <div style="display: flex;flex-direction: column;">
                    <el-input type="text" placeholder="如遇特殊符号用空格代替，如遇特殊字符&，请用and代替，如遇小语种中特殊字母或音标请用英语代替" v-model="yhzhFromData.bankName"> </el-input>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item class="postInfo-container-item">
                  <span slot="label">银行分行:<br />Bank Branch</span>
                  <div style="display: flex;flex-direction: column;">
                    <el-input type="text" placeholder="如遇特殊符号用空格代替，如遇特殊字符&，请用and代替，如遇小语种中特殊字母或音标请用英语代替" v-model="yhzhFromData.bankBranch"> </el-input>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item class="postInfo-container-item">
                  <span slot="label">银行地址:<br />Bank Address</span>
                  <div style="display: flex;flex-direction: column;">
                    <el-input type="text" placeholder="如遇特殊符号用空格代替，如遇特殊字符&，请用and代替，如遇小语种中特殊字母或音标请用英语代替" v-model="yhzhFromData.address"> </el-input>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item class="postInfo-container-item">
                  <span slot="label">SWIFT Code/BIC:</span>
                  <div style="display: flex;flex-direction: column;">
                    <el-input type="text" placeholder="特殊符号用空格代替，如遇特殊字符&，请用and代替" v-model="yhzhFromData.swiftcode"> </el-input>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item class="postInfo-container-item">
                  <span slot="label">行号:</span>
                  <div style="display: flex;flex-direction: column;">
                    <el-input type="text" placeholder="特殊符号用空格代替，如遇特殊字符&，请用and代替" v-model="yhzhFromData.bankNo"> </el-input>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item class="postInfo-container-item" props="">
                  <span slot="label" class="require">银行账户:<br />Account No./IBAN</span>
                  <div style="display: flex;flex-direction: column;">
                    <el-input type="text" placeholder="不可输入标点符号，不可有空格" v-model="yhzhFromData.account"> </el-input>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item class="postInfo-container-item">
                  <span slot="label">收款人姓名:<br />Account Name</span>
                  <div style="display: flex;flex-direction: column;">
                    <el-input type="text" placeholder="如遇特殊符号用空格代替，如遇特殊字符&，请用and代替，如遇小语种中特殊字母或音标请用英语代替" v-model="yhzhFromData.accName"> </el-input>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item class="postInfo-container-item">
                  <span slot="label">收款人地址:<br />Account Address</span>
                  <div style="display: flex;flex-direction: column;">
                    <el-input type="text" placeholder="不可输入标点符号，可以有空格" v-model="yhzhFromData.accAddr"> </el-input>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item class="postInfo-container-item">
                  <span slot="label">收款人国家:<br />Country</span>
                  <div style="display: flex;flex-direction: column;">
                    <el-select style="width: 300px!important;" default-first-option :clearable='true' placeholder="请选择" v-model="yhzhFromData.accCountry" filterable>
                      <el-option v-for="item in seletData.country" :key="String(item.countryCn)" :label="item.countryCn" :value="String(item.countryCn)">
                      </el-option>
                    </el-select>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item class="postInfo-container-item">
                  <span slot="label">ABA No:</span>
                  <div style="display: flex;flex-direction: column;">
                    <el-input type="text" placeholder="" v-model="yhzhFromData.aba"> </el-input>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item class="postInfo-container-item">
                  <span slot="label">用途代码:<br />Purpose Code</span>
                  <div style="display: flex;flex-direction: column;">
                    <el-input type="text" placeholder="" v-model="yhzhFromData.purposeCode"> </el-input>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="TAX NO.:" class="postInfo-container-item">
                  <el-input v-model="yhzhFromData.taxNo"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item class="postInfo-container-item">
                  <span slot="label">其他信息:<br />Other Info</span>
                  <div style="display: flex;flex-direction: column;">
                    <el-input type="text" placeholder="" v-model="yhzhFromData.otherInfo"> </el-input>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item class="postInfo-container-item">
                  <span slot="label">备注:</span>
                  <div style="display: flex;flex-direction: column;">
                    <el-input type="text" placeholder="" v-model="yhzhFromData.memo"> </el-input>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col class="tilteSpan" :span="24" style="padding: 10px">
                <span >中间行/代理行信息 Intermediary/Correspondent/Routing Bank Details</span>
              </el-col>
            </el-row>
            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item class="postInfo-container-item" props="">
                  <span slot="label">中间行或代理行名称:<br />Intermediary/Correspondent Bank Name</span>
                  <div style="display: flex;flex-direction: column;">
                    <el-input type="text" placeholder="" v-model="yhzhFromData.agencyBankName"> </el-input>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item class="postInfo-container-item" props="">
                  <span slot="label">中间行或代理行:<br />Swift Code Intermediary/Correspondent Bank Swift Code</span>
                  <div style="display: flex;flex-direction: column;">
                    <el-input type="text" placeholder="" v-model="yhzhFromData.swiftCodeIntermediary"> </el-input>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item class="postInfo-container-item" props="">
                  <span slot="label">中间行或代理行其他信息:<br />Intermediary/Correspondent Bank Other Info</span>
                  <div style="display: flex;flex-direction: column;">
                    <el-input type="text" placeholder="" v-model="yhzhFromData.agencyBankAddr"> </el-input>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="备注:" class="postInfo-container-item">
                  <el-input type="text" placeholder="" v-model="yhzhFromData.swiftCodeIntermediaryMemo"> </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col class="tilteSpan" :span="24" style="padding: 10px">
                <span >银行手续费</span>
              </el-col>
            </el-row>
            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="银行手续费:" class="postInfo-container-item">
                  <el-radio-group v-model="yhzhFromData.bankCharges">
                    <el-radio :label="1">共同承担(SHA)</el-radio>
                    <el-radio :label="2">我方全部承担(OUR)</el-radio>
                    <el-radio :label="3">对方全部承担(BEN)</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="说明:" class="postInfo-container-item">
                  <el-input 
                    type="textarea" 
                    placeholder="" 
                    v-model="yhzhFromData.describestr"
                    maxlength="2000"
                    show-word-limit
                    :autosize="{ minRows: 2, maxRows: 10 }">
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col class="tilteSpan" :span="24" style="padding: 10px">
                  <span >启用状态</span>
              </el-col>
            </el-row>
            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="银行信息启用状态:" class="postInfo-container-item">
                  <el-switch
                    v-model="yhzhFromData.state"
                    :active-value="1"
                    :inactive-value="0"
                    active-text=""
                    inactive-text="">
                  </el-switch>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
        </el-row>

<!--        <el-row class="form-border">-->
<!--          <el-col :span="24">-->

<!--            <el-row class="fullRow">-->
<!--              <el-col :span="24">-->
<!--                <el-form-item label="收款人姓名:" class="postInfo-container-item">-->
<!--                  <el-input type="text" placeholder="" v-model="yhzhFromData.accName"> </el-input>-->
<!--                </el-form-item>-->
<!--              </el-col>-->
<!--            </el-row>-->
<!--            <el-row class="fullRow">-->
<!--              <el-col :span="24">-->
<!--                <el-form-item label="收款人地址:" class="postInfo-container-item">-->
<!--                  <el-input type="text" placeholder="" v-model="yhzhFromData.accAddr"> </el-input>-->
<!--                </el-form-item>-->
<!--              </el-col>-->
<!--            </el-row>-->
<!--            <el-row class="fullRow">-->
<!--              <el-col :span="24">-->
<!--                <el-form-item label="收款人国家:" class="postInfo-container-item">-->

<!--                  <el-select default-first-option :clearable='true' placeholder="请选择" v-model="yhzhFromData.accCountry" filterable>-->
<!--                    <el-option v-for="item in seletData.country" :key="String(item.countryCn)" :label="item.countryCn" :value="String(item.countryCn)">-->
<!--                    </el-option>-->
<!--                  </el-select>-->
<!--                </el-form-item>-->
<!--              </el-col>-->
<!--            </el-row>-->
<!--            <el-row class="fullRow">-->
<!--              <el-col :span="24">-->
<!--                <el-form-item label="开户行:" class="postInfo-container-item">-->
<!--                  <el-input type="text" placeholder="" v-model="yhzhFromData.bankName"> </el-input>-->
<!--                </el-form-item>-->
<!--              </el-col>-->
<!--            </el-row>-->
<!--            <el-row class="fullRow">-->
<!--              <el-col :span="24">-->
<!--                <el-form-item label="银行账户:" class="postInfo-container-item">-->
<!--                  <el-input type="text" placeholder="" v-model="yhzhFromData.account"> </el-input>-->
<!--                </el-form-item>-->
<!--              </el-col>-->
<!--            </el-row>-->
<!--            <el-row class="fullRow">-->
<!--              <el-col :span="24">-->
<!--                <el-form-item label="Swiftcode:" class="postInfo-container-item">-->
<!--                  <el-input type="text" placeholder="" v-model="yhzhFromData.swiftcode"> </el-input>-->
<!--                </el-form-item>-->
<!--              </el-col>-->
<!--            </el-row>-->
<!--            <el-row class="fullRow">-->
<!--              <el-col :span="24">-->
<!--                <el-form-item label="行号:" class="postInfo-container-item">-->
<!--                  <el-input type="text" placeholder="" v-model="yhzhFromData.bankNo"> </el-input>-->
<!--                </el-form-item>-->
<!--              </el-col>-->
<!--            </el-row>-->
<!--            <el-row class="fullRow">-->
<!--              <el-col :span="24">-->
<!--                <el-form-item label="银行地址:" class="postInfo-container-item">-->
<!--                  <el-input type="text" placeholder="" v-model="yhzhFromData.address"> </el-input>-->
<!--                </el-form-item>-->
<!--              </el-col>-->
<!--            </el-row>-->
<!--            <el-row class="fullRow">-->
<!--              <el-col :span="24">-->
<!--                <el-form-item label="ABA码:" class="postInfo-container-item">-->
<!--                  <el-input type="text" placeholder="" v-model="yhzhFromData.aba"> </el-input>-->
<!--                </el-form-item>-->
<!--              </el-col>-->
<!--            </el-row>-->
<!--            <el-row class="fullRow">-->
<!--              <el-col :span="24">-->
<!--                <el-form-item label="代理银行名称:" class="postInfo-container-item">-->
<!--                  <el-input type="text" placeholder="" v-model="yhzhFromData.agencyBankName"> </el-input>-->
<!--                </el-form-item>-->
<!--              </el-col>-->
<!--            </el-row>-->
<!--            <el-row class="fullRow">-->
<!--              <el-col :span="24">-->
<!--                <el-form-item label="代理银行地址:" class="postInfo-container-item">-->
<!--                  <el-input type="text" placeholder="" v-model="yhzhFromData.agencyBankAddr"> </el-input>-->
<!--                </el-form-item>-->
<!--              </el-col>-->
<!--            </el-row>-->

<!--            <el-row class="fullRow">-->
<!--              <el-col :span="24">-->
<!--                <el-form-item label="备注:" class="postInfo-container-item uploader-custfile">-->
<!--                  <template>-->
<!--                    <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="wfconFromData.memo">-->
<!--                    </el-input>-->
<!--                  </template>-->
<!--                </el-form-item>-->
<!--              </el-col>-->
<!--            </el-row>-->

<!--          </el-col>-->
<!--        </el-row>-->

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormyhzh = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogFormStatus==='create'?createCustAddr('yhzh'):updateCustAddr('yhzh')">
          确定
        </el-button>
      </div>
    </el-dialog>
    <el-dialog :show-close="false" append-to-body :close-on-click-modal="false" title="客户指示" @open='dialogFormOpen("zs")' :visible.sync="dialogFormzs" width="70%">
      <el-form ref="creatzsForm" :model="zsFromData" label-position="left" style="width: 100%;">
        <el-row class="form-border">
          <el-col :span="24">
            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="指示类型:" class="postInfo-container-item">
                  <template>
                    <el-select default-first-option :clearable='true' placeholder="请选择" @change="regTypeselectChange" v-model="zsFromData.indicateType" filterable>
                      <el-option v-for="item in seletData.reqType" :key="item.indicateType" :label="item.indicateName" :value="item.indicateType">
                      </el-option>
                    </el-select>
                  </template>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="案件类型:" class="postInfo-container-item">
                  <template>
                    <el-select default-first-option :clearable='true' placeholder="请选择" v-model="zsFromData.caseTypeIds" filterable>
                      <el-option v-for="item in seletData.caseTypezs" :key="String(item.caseTypeId)" :label="item.caseType" :value="String(item.caseTypeId)">
                      </el-option>
                    </el-select>
                  </template>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="状态:" class="postInfo-container-item">
                  <el-radio-group v-model="zsFromData.status">
                    <el-radio :label='1'>是</el-radio>
                    <el-radio :label='0'>否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="启用日期:" class="postInfo-container-item">
                  <el-date-picker v-model="zsFromData.startDate" format='yyyy-MM-dd' value-format="yyyy-MM-dd" align="right" type="date" placeholder="选择日期" :picker-options="pickerOptions">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="停用日期:" class="postInfo-container-item">
                  <el-date-picker v-model="zsFromData.endDate" format='yyyy-MM-dd' value-format="yyyy-MM-dd" align="right" type="date" placeholder="选择日期" :picker-options="pickerOptions">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="案件特殊指示:" class="postInfo-container-item uploader-custfile">
                  <template>
                    <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="zsFromData.specialInfo">
                    </el-input>
                  </template>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="fullRow">
              <el-col :span="24">

                <el-form-item label="上传文件:" class="postInfo-container-item uploader-custfile">
                  <template>

                    <el-upload class="upload-demo" name="custReqFile" :data='addCustomerRequirementFileData' ref="uploadzsFile" :action="addCustomerRequirementFileUrl" :before-upload="handlePreview"
                               :on-remove="handleRemove" :file-list="postForm.materiaoList">
                      <el-button v-if="zsfileUploadbool" slot="trigger" size="small" type="primary">选取文件
                      </el-button>
                    </el-upload>

                  </template>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="备注:" class="postInfo-container-item uploader-custfile">
                  <template>
                    <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="zsFromData.memo">
                    </el-input>
                  </template>
                </el-form-item>
              </el-col>
            </el-row>

          </el-col>
        </el-row>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="delzsdialog">
          取消
        </el-button>
        <el-button type="primary" @click="createCustAddr('zs')">
          确定
        </el-button>
      </div>
    </el-dialog>
    <el-dialog :show-close="false" append-to-body :close-on-click-modal="false" title="执业法域" :visible.sync="dialogFormzyfy" width="70%">
      <el-form ref="creatzyfyForm" :model="zyfyFromData" label-position="left" style="width: 100%;">
        <el-row class="form-border">
          <el-col :span="24">
            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="国家/地区:" class="postInfo-container-item">
                  <template>
                    <el-select default-first-option :clearable='true' placeholder="请选择" v-model="zyfyFromData.country "
                               filterable style="width: 100%;">
                      <el-option v-for="item in seletData.country" :key="String(item.countryCn)" :label="item.countryCn"
                                 :value="String(item.countryCn)">
                      </el-option>
                  </el-select>
                  </template>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :class="zyfyFromData.businessAreaList.includes('其他（请详述）') ? '' : 'fullRow'">
              <el-col :span="zyfyFromData.businessAreaList.includes('其他（请详述）') ? 12 : 24">
                <el-form-item label="业务领域 :" class="postInfo-container-item">
                    <el-select default-first-option :clearable='true' placeholder="请选择" v-model="zyfyFromData.businessAreaList" filterable multiple  style="width: 100%;" @change="zyfyChangeBA">
                      <el-option v-for="item in seletData.ywBussiness" :key="String(item.typeName)" :label="item.typeName" :value="String(item.typeName)">
                      </el-option>
                    </el-select>
                </el-form-item>
              </el-col>
              <el-col span="12" v-if="zyfyFromData.businessAreaList.includes('其他（请详述）')">
                <el-form-item label="详述 :" class="postInfo-container-item">
                  <el-input  v-model="zyfyOtherDesc"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="简介:" class="postInfo-container-item">
                  <el-input  v-model="zyfyFromData.memo" type="textarea" :autosize="true" class="textarea-input"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="排名:" class="postInfo-container-item">
                  <el-input  v-model="zyfyFromData.ranking"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
        </el-row>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeModal('zyfy')">
          取消
        </el-button>
        <el-button type="primary" @click="dialogFormStatus==='create'?createCustAddr('zyfy'):updateCustAddr('zyfy')">
          确定
        </el-button>
      </div>
    </el-dialog>
    <!-- <el-dialog :show-close="false" append-to-body :close-on-click-modal="false" title="排名" :visible.sync="dialogFormpm" width="70%">
      <el-form ref="creatpmForm" :model="pmFromData" label-position="left" style="width: 100%;">
        <el-row class="form-border">
          <el-col :span="24">
            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="排名:" class="postInfo-container-item">
                  <template>
                    <el-input default-first-option :clearable='true' placeholder="请选择" v-model="pmFromData.ranking"
                               filterable>
                  </el-input>
                  </template>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :class="pmFromData.businessArea =='其他（请详述）' ? '' : 'fullRow'">
              <el-col :span="pmFromData.businessArea =='其他（请详述）' ? 12 : 24">
                <el-form-item label="业务领域 :" class="postInfo-container-item">
                  <el-select default-first-option :clearable='true' placeholder="请选择" v-model="pmFromData.businessArea" filterable style="width: 100%;" @change="pmyChangeBA">
                    <el-option v-for="item in seletData.ywBussiness" :key="String(item.typeName)" :label="item.typeName" :value="String(item.typeName)">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col span="12" v-if="pmFromData.businessArea == '其他（请详述）'">
                <el-form-item label="详述 :" class="postInfo-container-item">
                  <el-input  v-model="pmOtherDesc"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
        </el-row>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeModal('pm')">
          取消
        </el-button>
        <el-button type="primary" @click="dialogFormStatus==='create'?createCustAddr('pm'):updateCustAddr('pm')">
          确定
        </el-button>
      </div>
    </el-dialog> -->

  </div>
</template>

<script>
import {
  addCustomer,
  querycustSelectClass,
  queryFiliale,
  queryCustomerNameId,
  queryUserByPermissionId,
  queryCountry,
  addCustomerAddrUrl,
  updateCustomerAddrUrl,
  delCustomerAddrUrl,
  queryCustomerContactCustIdUrl,
  addCustomerContactUrl,
  updateCustomerContacturl,
  delCustomerContacturl,
  queryCustomersUrl,
  queryUserNamesUrl,
  addActivityUrl,
  delActivity,
  updateActivityUrl,
  queryCaseTypeUrl,
  querywfUserNameUrl,
  allocationCustomerUrl,
  delAgencyContactUrl,
  updateAgencyContactUrl,
  queryCustomerReqTypeUrl,
  queryregCaseTypeUrl,
  addCustomerRequirementUrl,
  updateCustomerRequirementUrl,
  delCustomerRequirementUrl,
  queryActivityListflUrl,
  queryIndustryUrl,
  queryCustomerUrl,
  updateCustomerUrl,
  queryCountryUrl,
  updateBankaccountUrl,
  addBankaccountUrl,
  delBankaccountUrl,
  delCustomerFile,
  CustomerExamineUrl,
  queryActivityOneUrl,
  addCustomerOffercountries,
  delCustomerOffercountries,
  upCustomerOffercountries,
  addCustomerRanking,
  delCustomerRanking,
  upCustomerRanking, deleteMaterial
} from '@/api/customerList'
import {creatematerial} from "@/api/ipServiceApi.config";
import serviceApi from "@/api/serviceApi.config.js";
import { mapGetters } from "vuex";
import { truncate, truncateSync } from "fs";
import ContactDfDetail from '@/views/workbench/customer_management/contact_df_management/components/ContactDfDetail.vue'
import {doEditInOffice, getProgID} from '@/utils/editInOffice.js'
import Vue from "vue";
import { delActivityFile } from '../../../../../api/customerList'
export default {
  name: "CooperativeDetail",
  computed: {
    ...mapGetters(["token", "name", "roles"])
  },
  components: {ContactDfDetail},
  props: {
    cooperativeId: {},
    isCustomer: {
      type: Boolean,
      default: false
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const emailValidator = (rule, value, callback) => {
      if (!value) {
        callback()
        // callback(new Error('请填写诉讼费收据号'))
      } else {
        const reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
        const list = value.split(';')
        list.forEach(item => {
          if (!reg.test(item)) {
            callback(new Error('邮箱格式有误'))
          } else {
            callback()
          }
        })
      }
    }
    return {
      overflowWord140: [
        {
          key: 'bankName',
          label: '开户行'
        },
        {
          key: 'bankBranch',
          label: '银行分行'
        },
        {
          key: 'address',
          label: '银行地址'
        },
        {
          key: 'swiftcode',
          label: 'SWIFT Code/BIC'
        },
        {
          key: 'bankNo',
          label: '行号'
        },
        {
          key: 'agencyBankName',
          label: '中间行或代理行名称'
        },
        {
          key: 'swiftCodeIntermediary',
          label: '中间行或代理行'
        },
        {
          key: 'agencyBankAddr',
          label: '中间行或代理行其他信息'
        },
      ],
      specialWord: [
        {
          key: 'swiftcode',
          label: 'SWIFT Code/BIC'
        },
        {
          key: 'bankNo',
          label: '行号'
        },
        {
          key: 'account',
          label: '银行账户'
        },
        // {
        //   key: 'aba',
        //   label: 'ABA No'
        // },
        {
          key: 'purposeCode',
          label: '用途代码'
        },
        // {
        //   key: 'otherInfo',
        //   label: '其他信息'
        // },
      ],
      isAndCheck: [
        {
          key: 'agencyBankName',
          label: '中间行或代理行名称'
        },
        {
          key: 'swiftCodeIntermediary',
          label: '中间行或代理行'
        },
        {
          key: 'agencyBankAddr',
          label: '中间行或代理行其他信息'
        },
      ],
      headFilters: {},
      formats:"yyyy-MM-dd",
      materialList: [],
      creatematerial,
      uploadFileData:{
        tokenID: this.$store.getters.token,
      },
      emailError: false,
      hzsttatus: true,
      zsfileUploadbool: false,
      isCreatTrue: false,
      creatAddrForm: {},
      stepActive: 0,
      postForm: {
        evaluation: '',
        name: "",
        custId: "",
        examineStatus: "",
        // userIcon: $("#sendFile-btn").attr("data-fileName"),   //头像
        materiaoList: [],
        fullname: "",
        fullnameEn: "",
        fgFullname: "",
        contactLanguage: "",
        isCollaboration: "",
        firstcaseCollitem: "",
        parentCustId: "",
        legalNature: "",
        isAgent: "",
        collaborationStatus: "",
        certType: "",
        idNumber: "",
        level: "",
        actLevel: "",
        source: "",
        certCode: "",
        custIntroductor: "",
        custIntroCompany: "",
        ownerDeptid: "",
        country: "",
        continent: "",
        province: "",
        city: "",
        website: "",
        fax1: "",
        phone: "",
        email: "",
        info: "",
        memo: "",
        isCollaboration: "1",
        isCustomer: "",
        curStatusDesc: "",
        annualAccDate: "",
        mailConfig: [],
        ourImporter: "",
        auditUserName: "",
        customerAddrs: [],
        customerContacts: [],
        activities: [],
        agencyContacts: [],
        customerRequirements: [],
        customerAssociates: [],
        conflicters: [],
        customerIndustryS: [],
        bankaccounts: [],
        ctData: [],
        materialList: []
      },

      loading: false,
      dialogFormAddr: false,
      dialogFormStatus: "",
      dialogFormdfcon: false,
      dialogFormhd: false,
      dialogFormwfcon: false,
      dialogFormzs: false,
      dialogFormyhzh: false,
      dialogFormzyfy: false,
      dialogFormpm: false,
      hdlx: "",
      rules: {
        // email: [
        //   {
        //     validator: emailValidator,
        //     required: false,
        //     trigger: "change"
        //   }
        // ],
        name: [
          {
            required: true,
            trigger: "change",
            message: '请填写简称'
          }
        ],
        fullname: [
          {
            required: true,
            trigger: "change",
            message: '请填写全称'
          }
        ],
        ctData: [
          {
            type: "array",
            required: true,
            message: '请选择国家/省份/城市',
            trigger: "change"
          }
        ],
        companyType: [
          {
            required: true,
            message: '请选择合作资源类型',
            trigger: "change"
          }
        ],
        legalNature: [
          {
            required: true,
            trigger: "change",
            message: '请选择主体法律性质',
          }
        ],
        ownerDeptid: [
          {
            required: true,
            trigger: "change"
          }
        ],
        phone: [
          {
            required: true,
            trigger: "change",
            message: '请填写电话',
          }
        ],
        collaborationStatusDesc:[
          {
            required: true,
            trigger: "blur",
            message: '请填写对停用说明记录内容和记录要求的说明和提示',
          }
        ]
      },
      dfconRules: {
        name: [
          {
            required: true,
            trigger: "change",
            message: "请填写姓名"
          }
        ],
        gender: [
          {
            required: true,
            trigger: "change",
            message: "请选择性别"
          }
        ],
        ismain: [
          {
            required: true,
            trigger: "change",
            message: "请选择是否主联系人"
          }
        ],
        isBillContact: [
          {
            required: true,
            trigger: "change",
            message: "请选择是否账单联系人"
          }
        ],
        status: [
          {
            required: true,
            trigger: "change",
            message: "请选择状态"
          }
        ],
        sysStatus: [
          {
            required: true,
            trigger: "change",
            message: "请选择启用状态"
          }
        ]
      },
      userIconUrl: serviceApi.addCustomerIcon,
      dfuserIconUrl: serviceApi.addCustomerContactIcon,
      usericonSendData: {
        tokenID: "",
        custId: ""
      },
      custContIconSendData: {
        tokenID: "",
        custContactId: "",
        custId: ""
      },
      custContIconSendData: {},
      addCustomerFileUrl: serviceApi.addCustomerFile,
      addCustomerFileData: {
        tokenID: "",
        custId: "",
        fileNames: ""
      },
      addPayTermAttData: {
        tokenID: "",
        custId: "",
        fileNames: ""
      },
      custContactFileUrl: serviceApi.addCustomerContactFileurl,
      custContactFiledata: {
        tokenID: "",
        custContactId: "",
        fileNames: ""
      },
      addCustomerRequirementFileUrl: serviceApi.addCustomerRequirementFileUrl,
      addCustomerRequirementFileData: {
        tokenID: "",
        custId: "",
        ID: "",
        indicateType: "",
        fileNames: ""
      },

      custfileLists: [], //客户文档
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
      datePickerType:'date',
      // select的获取id有对应文档查询
      seletDataArr:
        "1129,1042,1,1044,1053,1045,1076,1050,1192,1051,1052,1112,1063,1047,1046,1191,1179",
      seletData: {
        comLanguage: {}, //沟通语言
        mainLegalNature: {}, //主法律性质
        customerSource: {}, //客户来源
        paternalUnit: {}, //父单位
        paternalUnitKh: {}, //kh
        customerOwner: {}, //客户所有者
        hzstatus: {},
        censor: {},
        caseType: {},
        ctDataOption: [],
        statu: {},
        sex: {},
        lxstatu: {},
        called: {},
        dfcon: {},
        hdstatu: {},
        hdtype: {},
        hdfs: {},
        zdfs: {},
        userNames: {},
        wfuserNames: {},
        ywstuta: {},
        roleMessage: {},
        reqType: {},
        caseTypezs: {},
        activityList: {},
        industry: {},
        hzzyTypr: {},
        swsType: {},
        country: {},
        ywBussiness: {},
      },
      yhzhFromData: {
        accName: "",
        accAddr: "",
        accCountry: "",
        bankName: "",
        account: "",
        swiftcode: "",
        custBankId: "",
        bankNo: "",
        address: "",
        aba: "",
        memo: "",
        custId: ""
      },
      // 添加客户地址相关属性-->
      addrFromData: {
        custId: "",
        title: "",
        addressCn: "",
        addressEn: "",
        isMailAdd: "",
        isBillAdd: "",
        addressMail: "",
        post: "",
        continent: "",
        country: "",
        province: "",
        city: "",
        status: "",
        memo: "",
        ctData: []
      },

      // 添加对方联系人相关属性-->
      dfconFromData: {
        examineStatus: "",
        custId: "",
        custContactId: "",
        firstname: "",
        name: "",
        gender: "",
        custContIcon: "",
        custContactFile: "",
        called: "",
        birthday: "",
        bustype: "",
        branch: "",
        ismain: "",
        isBillContact: "",
        department: "",
        jobtitle: "",
        status: "",
        sysStatus: "",
        isCollectbillMan: "",
        tel: "",
        mobile2: "",
        mobile1: "",
        phone2: "",
        email: "",
        email2: "",
        fax1: "",
        msgType: "",
        msgAccount: "",
        bossCustContactId: "",
        gxr1CustContactId: "",
        relat1: "",
        gxr2CustContactId: "",
        relat2: "",
        gxr3CustContactId: "",
        relat3: "",
        infoFromStaff: "",
        infoFromPlace: "",
        infoFromDate: "",
        routineAct: "",
        routineActMemo: ""
      },
      // <--添加对方联系人相关属性
      // 添加活动相关属性-->
      hdFromData: {
        examineStatus: "",
        custActId: "",
        actStatus: "",
        subject: "",
        actType: "",
        actKind: "",
        begindate: "",
        enddate: "",
        place: "",
        serviceType: "",
        servicePlace: "",
        putGift: "",
        getGift: "",
        description: "",
        customerContactActs: [],
        agencyContactActs: []
      },
      // <--添加活动相关属性
      // 添加我方联系人相关属性-->
      wfconFromData: {
        custId: "",
        userId: "",
        startdate: "",
        enddate: "",
        business: "",
        roleId: "",
        caseTypeId: "",
        userrole: "",
        memo: "",
        position: "",
        ischeck: ""
      },
      // <--添加活动相关属性

      // 添加指示相关属性-->
      zsFromData: {
        custId: "",

        indicateType: "",

        examineStatus: "",

        caseTypeIds: "",

        specialInfo: "",

        price: "",

        chargeItemId: "",

        startDate: "",

        endDate: "",

        status: "",

        memo: "",

        billIfmonth: "",

        billSenddate: "",

        billSendtype: "",

        curId: "",

        value: "",

        payAcountId: "",

        appId: "",
        ID: "",
        id: ""
      },
      zyfyFromData:{
        businessAreaList:[]
      },
      pmFromData:{},
      zyfyOtherDesc:'',
      pmOtherDesc:''
      // <--添加指示相关属性
    };
  },
  created() {
    this.getAllSelectData();
    window.addEventListener("scroll", this.handleScroll);
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id || this.cooperativeId;
      this.fetchData(id);
    }
    this.roles.forEach(ite => {
      if (ite.roleId == "2046" || ite.roleId == "2086") {
        this.hzsttatus = false;
        return;
      }
    });
  },
  watch: {
    "postForm.ctData": function(data, oldval) {
      this.postForm.country = "";
      this.postForm.province = "";
      this.postForm.city = "";
      if (data[0]) {
        this.postForm.country = data[0];
      }
      if (data[1]) {
        this.postForm.province = data[1];
      }
      if (data[2]) {
        this.postForm.city = data[2];
      }

      this.postForm.continent = this.getcontinent(data[0]);
    },

    "addrFromData.ctData": function(data, oldval) {
      this.addrFromData.country = "";
      this.addrFromData.province = "";
      this.addrFromData.city = "";
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
    },
    "datePickerType":function(data){
      const formatsMap = {
        date:'yyyy-MM-dd',
        month:'yyyy-MM',
        year:'yyyy',
      }
      this.formats = formatsMap[data]
    }
  },
  methods: {
    handleChangeCurStatus(){
      this.postForm.collaborationStatusDesc = ''
    },
    stripscript(s) {
      const pattern = new RegExp(
        "[`~!@#%$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]"
      );
      let rs = "";
      for (var i = 0; i < s.length; i++) {
        rs = rs + s.substr(i, 1).replace(pattern, "");
      }
      return {
        result: pattern.test(s),
        data: rs
      };
    },
    word140Remind(key, name) {
      if (this.yhzhFromData[key].length > 140) {
        this.$message.warning(`${name}已超过140字`)
      }
    },
    delWordAnd(key, name) {
      const {result, data} = this.stripscript(this.yhzhFromData[key])
      if (result) {
        this.$message.warning(`${name}中出现特殊字符,已删除`)
        this.yhzhFromData[key] = data
      }
    },
    zyfyChangeBA(value){
      if (!value.includes('其他（请详述）') ) {
        this.zyfyOtherDesc = ''
      }
    },
    pmyChangeBA(value){
      if (value !== '其他（请详述）') {
        this.pmOtherDesc = ''
      }
    },
    closeModal(type){
      switch(type){
        case 'pm':
          this.dialogFormpm = false
          this.pmFromData = {}
          this.pmOtherDesc = ''
          break;
        case 'zyfy':
          this.dialogFormzyfy = false
          this.zyfyFromData = {
            businessAreaList:[]
          }
          this.zyfyOtherDesc = ''
          break;
        default:
          break;
      }
    },
    filterHandler(value, row, column) {
      const property = column['property']
      return row[property] === value
    },
    determineTimeType(time) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      const monthRegex = /^\d{4}-\d{2}$/;
      const yearRegex = /^\d{4}$/;

      if (dateRegex.test(time)) {
        return 'date';
      } else if (monthRegex.test(time)) {
        return 'month';
      } else if (yearRegex.test(time)) {
        return 'year';
      } else {
        return 'date';
      }
    },
    changeDatePickerType(value){
      this.datePickerType = value
      if (this.postForm.annualAccDate) {
        this.postForm.annualAccDate = ''
      }
    },
    handleFilePreview(file){
      delete this.uploadFileData.custId
      this.uploadFileData.fileNames = file.name.substr(
        0,
        file.name.lastIndexOf(".")
      );
    },
    handleFilePreview1(file, materialTypeId){
      this.uploadFileData.materialTypeId = materialTypeId || undefined
      this.uploadFileData.custId = this.postForm.custId
      this.uploadFileData.fileNames = file.name.substr(
        0,
        file.name.lastIndexOf(".")
      );
    },
    onsuccess1(response, file, fileList) {
      const data = response.data[0] || {}
      data.name = data.materialName
      if (!this.postForm.materialList) {
        this.postForm.materialList = []
      }
      this.postForm.materialList.push(response.data[0])
    },
    handleFileRemove1(file){
      let materialId;
      if (file.response) {
        materialId = file.response.data[0].materialId
      } else {
        materialId = file.materialId
      }
      if(!file.response) {
        deleteMaterial({ materialId: materialId }).then(res => {
          this.$message.success('文件删除成功！')
          this.postForm.materialList.splice(this.postForm.materialList.findIndex(item => item.materialId == materialId), 1)
        })
      } else {
        this.$message.success('文件删除成功!')
        this.postForm.materialList.splice(this.postForm.materialList.findIndex(item => item.materialId == materialId), 1)
      }
      //   this.materialIdList=this.materialIdList.filter(item=>item!=materialId)
    },
    handleFileRemove(file){
      let materialId;
      if (file.response) {
        materialId = file.response.data[0].materialId
      } else {
        materialId = file.materialId
      }
      if(!file.response) {
        delActivityFile({ materialId: materialId }).then(res => {
          this.$message.success('文件删除成功！')
          this.hdFromData.materialList.splice(this.hdFromData.materialList.findIndex(item => item.materialId == materialId), 1)
        })
      } else {
        this.$message.success('文件删除成功!')
        this.hdFromData.materialList.splice(this.hdFromData.materialList.findIndex(item => item.materialId == materialId), 1)
      }
      //   this.materialIdList=this.materialIdList.filter(item=>item!=materialId)
    },
    previewFile(data) {
      if (data.raw) {
        data = data.response.data[0]
      }
      let url = data.address || url
      if (getProgID(url)||url.replace(/.+\./,"").toLocaleLowerCase()=='msg') {
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
        // doEditInOffice(url, getProgID(url))
      } else if(['pdf','jpg','png'].some(item=>url.replace(/.+\./,"").toLocaleLowerCase()==item)){
        window.open(`/ipdoc${url}`.replace(/[+]/g,'%2B'))
      } else {
        this.downLoad(data)
      }
    },
    downLoad(data) {
      const url = data.address
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
    onsuccess(response, file, fileList) {
      const data = response.data[0] || {}
      data.name = data.materialName
      if (!this.hdFromData.materialList) {
        this.hdFromData.materialList = []
      }
      this.hdFromData.materialList.push(response.data[0])
    },
    changeScale(value) {
      value = String(value)
      this.$set(this.postForm, 'scale', value && value.replace(/[^0-9]/g, '') || '')
    },
    changeEmail(value) {
      const reg = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
      this.postForm.email = value.replace(/\s+/g, '')
      const list = value.replace(/\s+/g, '').split(';')
      this.emailError = false
      list.forEach(item => {
        if (!reg.test(item)) {
          this.emailError = true
        }
      })

    },
    updateCustomerContact(response){
      for (const v of this.postForm.customerContacts) {
        if (v.custContactId === this.dfconFromData.custContactId) {
          const index = this.postForm.customerContacts.indexOf(v);
          this.postForm.customerContacts.splice(
            index,
            1,
            response.data.data
          );
          const mainList = []
          const noList = []
          if (this.postForm.customerContacts) {
            this.postForm.customerContacts.forEach(item => {
              item.ismainStr = item.ismain ? '是' : '否'
              if (item.ismain) {
                mainList.push(item)
              } else {
                noList.push(item)
              }
            })
          }
          this.$set(this.postForm, 'customerContacts', [...mainList, ...noList])
          this.headFilters = this.$commonUtils.tableFilter(this.postForm.customerContacts)

          break;
        }
      }
      if (this.alldialogBool == "dfcon") {
        for (const v of this.alltableData) {
          if (v.custContactId === this.dfconFromData.custContactId) {
            const index = this.alltableData.indexOf(v);
            this.alltableData.splice(index, 1, response.data.data);
            break;
          }
        }
      }
      this.dialogFormdfcon = false;
    },
    fetchData(id) {
      queryCustomerUrl({ customerID: id })
        .then(response => {
          this.postForm = response.data;
          const mainList = []
          const noList = []
          if (this.postForm.customerContacts) {
            this.postForm.customerContacts.forEach((item,index) => {
              item.ismainStr = item.ismain ? '是' : '否'
              if (item.bustype) {
                item.bustype = item.bustype.replace(/&/, ':')
              }
              if (item.ismain) {
                mainList.push(item)
              } else {
                noList.push(item)
              }
            })
          }
          if (this.postForm.customerRankingList&&this.postForm.customerRankingList.length>0) {
            this.postForm.customerRankingList.forEach((item)=>{
              if (item.businessArea.includes('其他')) {
                item.pmOtherDesc = item.businessArea.split('&')[1] || ''
                item.businessArea = item.businessArea.split('&')[0]
              }
            })
          }
          this.$set(this.postForm, 'customerContacts', [...mainList, ...noList])
          this.headFilters = this.$commonUtils.tableFilter(this.postForm.customerContacts)
          this.postForm.email && this.changeEmail(this.postForm.email)
          Vue.set(this.postForm, "ctData", []);
          this.postForm.ctData = [
            this.postForm.country,
            this.postForm.province,
            this.postForm.city
          ];
          this.datePickerType = this.determineTimeType(response.data.annualAccDate)
        })
        .catch(err => {
          console.log(err);
        });
    },
    customerExamine(type) {
      CustomerExamineUrl({
        custId: this.postForm.custId,
        examineStatus: type
      }).then(res => {
        this.cancel()
      });
    },
    cancel(){
      if (this.isCustomer) {
        this.$emit('closeDialog', true)
      } else {
        this.$router.go(-1);
      }
    },
    //icon上传-->
    handleAvatarChange(file, fileList) {
      if (this.isItemTrue("custId")) {
        this.postForm.userIcon = URL.createObjectURL(file.raw);
        this.$refs.userIconupload.submit();
      }
    },
    dfhandleAvatarChange(file, fileList) {
      if (this.isdfItemTrue()) {
        this.dfconFromData.custContIcon = URL.createObjectURL(file.raw);
        this.$refs.custContIconupload.submit();
        console.log(
          this.dfconFromData.custContIcon,
          URL.createObjectURL(file.raw)
        );
      }
    },
    onBeforeUploadIcon(file) {
      this.usericonSendData.tokenID = this.token;
      this.usericonSendData.custId = this.postForm.custId;

      this.custContIconSendData.tokenID = this.token;
      this.custContIconSendData.custContactId = this.dfconFromData.custContactId;
      const isIMAGE = file.type === "image/jpeg" || "image/gif" || "image/png";
      const isLt1M = file.size / 1024 / 1024 < 1;
      if (!isIMAGE) {
        this.$message.error("上传文件只能是图片格式!");
      }
      if (!isLt1M) {
        this.$message.error("上传文件大小不能超过 1MB!");
      }
      return isIMAGE && isLt1M;
    },
    dficonSendSuccess(response, file, fileList) {
      if (response.success) {
        this.$message.success(response.message);
      } else {
        this.$message.error(response.message);
        this.dfconFromData.custContIcon = "";
      }
    },
    iconSendSuccess(response, file, fileList) {
      if (response.success) {
        this.$message.success(response.message);
      } else {
        this.$message.error(response.message);
        this.postForm.userIcon = "";
      }
    },
    //<--icon上传
    //创建用户-->
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (!valid) {
          this.$message.error("请填写必填项");
        } else {
          this.loading = true;
          this.postForm.isCollaboration=1
          delete this.postForm.customerAddrs;
          delete this.postForm.customerContacts;
          delete this.postForm.activities;
          delete this.postForm.agencyContacts;
          delete this.postForm.customerRequirements;
          delete this.postForm.ctData;
          delete this.postForm.bankaccounts;
          delete this.postForm.materialList;
          addCustomer(this.postForm).then(response => {
            this.loading = false;
            this.isCreatTrue = true;
            this.$message({
              type: "success",
              message: "创建成功"
            });
            if (this.isCustomer) {
              this.$emit('closeDialog', true)
            } else {
              this.$router.go(-1);
            }
          });
        }
      });
    },
    updatasubmitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (!valid) {
          this.$message.error("请填写必填项");
        } else {
          this.loading = true;
          delete this.postForm.customerAddrs;
          delete this.postForm.customerContacts;
          delete this.postForm.activities;
          delete this.postForm.agencyContacts;
          delete this.postForm.customerRequirements;
          delete this.postForm.ctData;
          delete this.postForm.bankaccounts;
          delete this.postForm.materialList;
          updateCustomerUrl(this.$commonUtils.cleanNullAttr(this.postForm)).then(response => {
            this.loading = false;
            if (response.success) {
              this.isCreatTrue = true;
              this.$message({
                type: "success",
                message: "修改成功"
              });
              if (this.isCustomer) {
                this.$emit('closeDialog', true)
              } else {
                this.$router.go(-1);
              }
            } else {
              this.$message.error(response.message);
            }
          });
        }
      });
    },
    creatLsCust(formName) {
      return;
      if (formName == "dfconFromData") {
        if (!this.dfconFromData.custContactId) {
          this.$refs[formName].validate(valid => {
            if (valid) {
              this.dfconFromData.custId = this.postForm.custId;
              addCustomerContactUrl(this.dfconFromData).then(response => {
                if (response.success) {
                  this.dfconFromData.custContactId =
                    response.data.data.custContactId;
                  this.postForm.customerContacts.push(response.data.data);
                  const mainList = []
                  const noList = []
                  if (this.postForm.customerContacts) {
                    this.postForm.customerContacts.forEach(item => {
                      item.ismainStr = item.ismain ? '是' : '否'
                      if (item.bustype) {
                        item.bustype = item.bustype.replace(/&/, ':')
                      }
                      if (item.ismain) {
                        mainList.push(item)
                      } else {
                        noList.push(item)
                      }
                    })
                  }
                  this.$set(this.postForm, 'customerContacts', [...mainList, ...noList])
                  this.headFilters = this.$commonUtils.tableFilter(this.postForm.customerContacts)
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
          this.$refs[formName].validate(valid => {
            if (valid) {
              this.postForm.isCollaboration=1
              addCustomer(this.postForm).then(response => {
                if (response.success) {
                  this.postForm.custId = response.data.custId;
                  this.postForm.examineStatus=response.data.examineStatus
                } else {
                  this.$message.error(response.message);
                }
              });
            }
          });
        }
      }
    },

    //<--创建用户
    //添加客户文件-->
    addCustomerFile(type) {
      if (type == "dffile") {
        if (this.isdfItemTrue()) {
          this.$refs.uploadcustContactFile.submit();
        }
      } else {
        if (this.isItemTrue("custId")) {
          this.$refs.uploadCustFile.submit();
        }
      }
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    preview(file){
      if(file.raw){
        if(file.response){
          this.$commonUtils.downLoadAll({url:'ipdoc'+file.response.data.address})
        }
      } else {
        this.$commonUtils.downLoadAll({url:'ipdoc'+file.url})
      }
    },
    brforeRemoveFile(file,type) {
      let delmaterialId;
      if (file.response) {
        if(type == "dffile"){
          delmaterialId = file.response.data.materialId;
        } else {
          delmaterialId = file.response.data.materialId;
        }
      } else {
        delmaterialId = file.materialId;
      }
      if(delmaterialId){
        delCustomerFile({materialId:delmaterialId}).then(res=>{

        })
      }

      // delCaseMaterialUrl({
      //   caseIdArray: this.mainCaseIds,
      //   materialId: delmaterialId
      // }).then(res => {
      //   this.message.success(res.message);
      //   this.wtsfileList = this.wtsfileList.filter(
      //     item => item.materialId != delmaterialId
      //   );
      //   this.wtsfileListzr = this.wtsfileListzr.filter(
      //     item => item.materialId != delmaterialId
      //   );
      // });
    },
    handlePreview(file) {
      this.custContactFiledata.tokenID = this.token;
      this.custContactFiledata.custContactId = this.dfconFromData.custContactId;
      this.addCustomerFileData.tokenID = this.token;
      this.addCustomerFileData.materialTypeId = 301625;
      this.addCustomerFileData.custId = this.postForm.custId;
      this.addPayTermAttData.tokenID = this.token;
      this.addPayTermAttData.materialTypeId = 301655;
      this.addPayTermAttData.custId = this.postForm.custId;
      this.addCustomerRequirementFileData.tokenID = this.token;
      this.addCustomerRequirementFileData.custId = this.postForm.custId;
      this.addCustomerRequirementFileData.ID = this.zsFromData.id;
      this.addCustomerRequirementFileData.indicateType = this.zsFromData.indicateType;

      this.addCustomerFileData.fileNames = file.name.substr(
        0,
        file.name.lastIndexOf(".")
      );
      this.addPayTermAttData.fileNames = file.name.substr(
        0,
        file.name.lastIndexOf(".")
      );

      this.custContactFiledata.fileNames = file.name.substr(
        0,
        file.name.lastIndexOf(".")
      );
      this.addCustomerRequirementFileData.fileNames = file.name.substr(
        0,
        file.name.lastIndexOf(".")
      );
    },
    //<--添加客户文件
    //-->提示
    isItemTrue(item) {
      if (!this.postForm[item]) {
        this.$message.error("请填写必填项");
        return false;
      } else {
        return true;
      }
    },
    isdfItemTrue() {
      if (!this.dfconFromData.custContactId || !this.$refs.ContactDfDetail.validate()) {
        this.$message.error("请填写必填项");
        return false;
      } else {
        return true;
      }
    },
    // 获取各个select数据
    getAllSelectData() {
      querycustSelectClass({ classId: this.seletDataArr }).then(response => {
        if (response.success) {
          this.seletData.comLanguage = response.data["1129"];
          this.seletData.mainLegalNature = response.data["1042"];
          this.seletData.customerSource = response.data["1"];
          this.seletData.statu = response.data["1044"];
          this.seletData.sex = response.data["1053"];
          this.seletData.lxstatu = response.data["1045"];
          this.seletData.called = response.data["1076"];
          this.seletData.hdstatu = response.data["1050"];
          // this.seletData.hdtype = response.data["1049"];
          this.seletData.hdtype = response.data["1192"];
          this.seletData.hdfs = response.data["1051"];
          this.seletData.zdfs = response.data["1052"];
          this.seletData.ywstuta = response.data["1112"];
          this.seletData.roleMessage = response.data["1063"];
          this.seletData.hzzyTypr = response.data["1047"];
          this.seletData.swsType = response.data["1046"];
          // this.seletData.hzstatus = response.data["5"];
          this.seletData.hzstatus = response.data["1191"];
          this.seletData.ywBussiness = response.data["1179"];
        } else {
          this.$message.error(response.message);
        }
      });
      queryCountryUrl().then(response => {
        if (response.success) {
          this.seletData.country = response.data.areas;
        } else {
          this.$message.error(response.message);
        }
      });
      // queryActivityListflUrl().then(response => {
      //   if (response.success) {
      //     this.seletData.activityList = response.data;
      //   } else {
      //     this.$message.error(response.message);
      //   }
      // });
      queryIndustryUrl().then(response => {
        if (response.success) {
          this.seletData.industry = response.data;
        } else {
          this.$message.error(response.message);
        }
      });
      queryCustomerReqTypeUrl().then(response => {
        if (response.success) {
          this.seletData.reqType = response.data;
        } else {
          this.$message.error(response.message);
        }
      });
      querywfUserNameUrl().then(response => {
        if (response.success) {
          this.seletData.wfuserNames = response.data;
        } else {
          this.$message.error(response.message);
        }
      });
      queryCaseTypeUrl().then(response => {
        if (response.success) {
          this.seletData.caseType = response.data;
        } else {
          this.$message.error(response.message);
        }
      });
      queryFiliale().then(response => {
        if (response.success) {
          this.seletData.customerOwner = response.data;
        } else {
          this.$message.error(response.message);
        }
      });
      queryUserNamesUrl().then(response => {
        if (response.success) {
          this.seletData.userNames = response.data.users;
        } else {
          this.$message.error(response.message);
        }
      });

      queryCountry().then(response => {
        if (response.success) {
          this.seletData.ctDataOption = response.data;
          this.postForm.continent = this.getcontinent(this.postForm.ctData[0]);
        } else {
          this.$message.error(response.message);
        }
      });
      queryUserByPermissionId({ permissionId: "61" }).then(response => {
        if (response.success) {
          this.seletData.censor = response.data;
        } else {
          this.$message.error(response.message);
        }
      });
    },
    dialogFormOpen(type) {
      switch (type) {
        case "dfcon":
          // addCustomerContactUrl({ custId: this.postForm.custId }).then(
          //   response => {
          //     if (response.success) {
          //       this.dfconFromData.custContactId = response.data.data.custContactId;
          //       this.postForm.customerContacts.unshift(response.data.data);
          //       this.dialogFormdfcon = true;
          //     } else {
          //       this.$message.error(response.message);
          //     }
          //   }
          // );
          queryCustomerContactCustIdUrl({
            customerId: this.postForm.custId
          }).then(response => {
            if (response.success) {
              this.seletData.dfcon = response.data;
            } else {
              this.$message.error(response.message);
            }
          });
          break;
        case "zs":
          break;

        default:
          break;
      }
    },
    remotepaternalUnit(query) {
      if (query !== "") {
        queryCustomerNameId({ keyword: query }).then(response => {
          if (response.success) {
            this.seletData.paternalUnit = response.data;
          } else {
            this.$message.error(response.message);
          }
        });
      }
    },
    remotepaternalUnitKh(index,query) {
      if (query !== "") {
        queryCustomersUrl({ name: query }).then(response => {
          if (response.success) {
            this.hdFromData.customerContactActs[index].paternalUnitKh = response.data;
            // this.seletData.paternalUnitKh = response.data;
          } else {
            this.$message.error(response.message);
          }
        });
      }
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
    stepset(active) {
      this.stepActive = active;
      switch (active) {
        case 0:
          document.getElementById("jbxx-title").scrollIntoView();
          break;
        case 1:
          document.getElementById("khdz-title").scrollIntoView();
          break;
        case 2:
          document.getElementById("dflxr-title").scrollIntoView();
          break;
        case 3:
          document.getElementById("khhd-title").scrollIntoView();
          break;
        case 4:
          document.getElementById("wflxr-title").scrollIntoView();
          break;
        case 5:
          document.getElementById("glgs-title").scrollIntoView();
          break;
        case 6:
          document.getElementById("zyfy-title").scrollIntoView();
          break;
        case 7:
          document.getElementById("pm-title").scrollIntoView();
          break;
        default:
          break;
      }
    },
    handleScroll() {
      // var scrollTop =
      //   window.pageYOffset ||
      //   document.documentElement.scrollTop ||
      //   document.body.scrollTop;
      // var offsetTop = document.querySelector("#dflxr-title").offsetTop();
      // console.log(scrollTop, offsetTop);
      // if (scrollTop == offsetTop) {
      //   this.stepActive = 1;
      // } else {
      //   this.stepActive = 5;
      // }
    },
    // 表格项-->
    async resetFromData(type) {
      switch (type) {
        case "addr":
          this.addrFromData = {
            title: "",
            addressCn: "",
            addressEn: "",
            isMailAdd: "",
            isBillAdd: "",
            addressMail: "",
            post: "",
            continent: "",
            country: "",
            province: "",
            city: "",
            status: "",
            memo: "",
            ctData: []
          };
          break;
        case "dfcon":
          this.dfconFromData = {
            custContactId: "",
            examineStatus: "",
            custId: "",
            firstname: "",
            name: "",
            gender: "",
            custContIcon: "",
            custContactFile: "",
            called: "",
            birthday: "",
            bustype: "",
            branch: "",
            ismain: "",
            isBillContact: "",
            department: "",
            jobtitle: "",
            status: "",
            sysStatus: "",
            isCollectbillMan: "",
            tel: "",
            mobile2: "",
            mobile1: "",
            phone2: "",
            email: "",
            email2: "",
            fax1: "",
            msgType: "",
            msgAccount: "",
            bossCustContactId: "",
            gxr1CustContactId: "",
            relat1: "",
            gxr2CustContactId: "",
            relat2: "",
            gxr3CustContactId: "",
            relat3: "",
            infoFromStaff: "",
            infoFromPlace: "",
            infoFromDate: "",
            routineAct: "",
            routineActMemo: ""
          };
          break;
        case "hd":
          this.hdFromData = {
            examineStatus: "",
            custActId: "",
            actStatus: "",
            subject: "",
            actType: "",
            actKind: "",
            begindate: "",
            enddate: "",
            place: "",
            serviceType: "",
            servicePlace: "",
            putGift: "",
            getGift: "",
            description: "",
            customerContactActs: [],
            agencyContactActs: []
          };
          this.queryCustSelect({name:this.postForm.name,custId:this.postForm.custId})
          break;
        case "zs":
          this.zsFromData = {
            custId: "",

            indicateType: "",

            examineStatus: "",

            caseTypeIds: "",

            specialInfo: "",

            price: "",

            chargeItemId: "",

            startDate: "",

            endDate: "",

            status: "",

            memo: "",

            billIfmonth: "",

            billSenddate: "",

            billSendtype: "",

            curId: "",

            value: "",

            payAcountId: "",

            appId: "",
            ID: "",
            id: ""
          };
          break;
        case "yhzh":
          this.yhzhFromData = {
            state: 0,
            accName: "",
            custBankId: "",
            accAddr: "",

            accCountry: "",

            bankName: "",

            account: "",

            swiftcode: "",

            bankNo: "",

            address: "",

            aba: "",

            memo: "",

            custId: ""
          };
          break;

        default:
          break;
      }
    },
    addFormShow(type) {
      if (this.isItemTrue("custId")) {
        switch (type) {
          case "addr":
            this.dialogFormAddr = true;
            break;
          case "dfcon":
            this.dialogFormdfcon = true;
            addCustomerContactUrl({ custId: this.postForm.custId }).then(
              response => {
                if (response.success) {
                  this.dfconFromData.custContactId = response.data.data.custContactId;
                  this.postForm.customerContacts.unshift(response.data.data);
                  const mainList = []
                  const noList = []
                  if (this.postForm.customerContacts) {
                    this.postForm.customerContacts.forEach(item => {
                      item.ismainStr = item.ismain ? '是' : '否'
                      if (item.bustype) {
                        item.bustype = item.bustype.replace(/&/, ':')
                      }
                      if (item.ismain) {
                        mainList.push(item)
                      } else {
                        noList.push(item)
                      }
                    })
                  }
                  this.$set(this.postForm, 'customerContacts', [...mainList, ...noList])
                  this.headFilters = this.$commonUtils.tableFilter(this.postForm.customerContacts)
                  this.dialogFormdfcon = true;
                } else {
                  this.$message.error(response.message);
                }
              }
            );
            break;
          case "hd":
            this.dialogFormhd = true;
            break;
          case "wfcon":
            this.dialogFormwfcon = true;
            break;
          case "zs":
            this.dialogFormzs = true;
            break;
          case "yhzh":
            this.dialogFormyhzh = true;
            break;
          case "zyfy":
            this.dialogFormzyfy = true;
            break;
          case "pm":
            this.dialogFormpm = true;
            break;

          default:
            break;
        }
        this.resetFromData(type);
        this.dialogFormStatus = "create";
      }
    },
    async queryCustSelect({name,custId,custContactId,memo}){
      let res = await queryCustomersUrl({ name: name })
      let paternalUnitKh = []
      let hdlx = []
      if(res&&res.data.length>0){
        paternalUnitKh = res.data
        hdlx = res.data.find(item=>item.custId == custId)
          ? res.data.find(item=>item.custId == custId).customerContacts
          : []
      }
      this.hdFromData.customerContactActs.push({
        custContactId: custContactId ? custContactId+'' : '',
        custId: custId+'',
        memo: memo || '',
        hdlx: hdlx,
        paternalUnitKh:paternalUnitKh
      });
    },
    async custAddrupdata(row, type) {
      switch (type) {
        case "addr":
          this.addrFromData = Object.assign({}, row);
          this.addrFromData.ctData = [
            this.addrFromData.country,
            this.addrFromData.province,
            this.addrFromData.city
          ];
          this.dialogFormAddr = true;
          break;
        case "dfcon":
          this.dfconFromData = Object.assign({}, row);
          this.dialogFormdfcon = true;
          break;
        case "hd":
          let res = await queryActivityOneUrl({custActId:row.custActId})
          this.hdFromData = res.data || row
          if(this.hdFromData.materialList&&this.hdFromData.materialList.length){
            this.materialList = JSON.parse(JSON.stringify(this.hdFromData.materialList))
          }
          let list = JSON.parse(JSON.stringify(this.hdFromData.customerContactActs))
          this.hdFromData.customerContactActs.length = 0
          if(list.length>0){
            list.forEach(item=>{
              this.queryCustSelect({
                name:item.name,
                // fullname:item.custName,
                custId:item.custId,
                custContactId:item.custContactId,
                memo:item.memo
              })
            })
          }
          // this.hdFromData = Object.assign({}, row);
          this.dialogFormhd = true;
          break;
        case "wfcon":
          this.wfconFromData = Object.assign({}, row);
          this.dialogFormwfcon = true;
          break;
        case "zs":
          this.zsFromData = Object.assign({}, row);
          this.dialogFormzs = true;
          break;
        case "yhzh":
          this.yhzhFromData = Object.assign({}, row);
          this.dialogFormyhzh = true;
          break;
        case "zyfy":
          if (row.businessAreaList && row.businessAreaList.length > 0) {
            row.businessAreaList.forEach((item,index) => {
              if (item.includes('&')) {
                console.log(item.split('&')[0],'item1');
                row.businessAreaList[index] = item.split('&')[0];
                this.zyfyOtherDesc = item.split('&')[1];
              }
            })
          }
          this.zyfyFromData = {
            businessAreaList: row.businessAreaList,
            country: row.country,
            custId: row.custId,
            id: row.id,
            ranking: row.ranking,
            memo: row.memo
          }
          this.dialogFormzyfy = true;
          break;
        case "pm":
          this.pmOtherDesc = row.pmOtherDesc
          this.pmFromData = {
            businessArea: row.businessArea,
            ranking: row.ranking,
            custId: row.custId,
            id: row.id,
          }
          this.dialogFormpm = true;
          break;

        default:
          break;
      }

      this.dialogFormStatus = "update";
    },
    custAddrdel(row, index, type) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          switch (type) {
            case "addr":
              delCustomerAddrUrl({ addrId: row.addrId }).then(response => {
                if (response.success) {
                  // const index = this.postForm.customerAddrs.indexOf(row);
                  this.postForm.customerAddrs.splice(index, 1);
                  this.$message({
                    type: "success",
                    message: "删除成功"
                  });
                } else {
                  this.$message.error(response.message);
                }
              });
              break;
            case "dfcon":
              delCustomerContacturl({ custContactId: row.custContactId }).then(
                response => {
                  if (response.success) {
                    // const index = this.postForm.customerContacts.indexOf(row);
                    this.postForm.customerContacts.splice(index, 1);
                    this.$message({
                      type: "success",
                      message: "删除成功"
                    });
                  } else {
                    this.$message.error(response.message);
                  }
                }
              );
              break;
            case "hd":
              delActivity({ custActId: row.custActId }).then(response => {
                if (response.success) {
                  // const index = this.postForm.activities.indexOf(row);
                  this.postForm.activities.splice(index, 1);
                  this.$message({
                    type: "success",
                    message: "删除成功"
                  });
                } else {
                  this.$message.error(response.message);
                }
              });
              break;
            case "zs":
              delCustomerRequirementUrl({
                ID: this.zsFromData.id
              }).then(response => {
                if (response.success) {
                  // const index = this.postForm.customerRequirements.indexOf(
                  //   this.zsFromData
                  // );
                  this.postForm.customerRequirements.splice(index, 1);
                  this.dialogFormzs = false;
                } else {
                  this.$message.error(response.message);
                }
              });

              break;
            case "wfcon":
              delAgencyContactUrl({
                agencyContactId: row.agencyContactId
              }).then(response => {
                if (response.success) {
                  // const index = this.postForm.agencyContacts.indexOf(row);
                  this.postForm.agencyContacts.splice(index, 1);
                  this.$message({
                    type: "success",
                    message: "删除成功"
                  });
                } else {
                  this.$message.error(response.message);
                }
              });
              break;
            case "yhzh":
              delBankaccountUrl({
                custBankId: row.custBankId
              }).then(response => {
                if (response.success) {
                  // const index = this.postForm.bankaccounts.indexOf(row);
                  this.postForm.bankaccounts.splice(index, 1);
                  this.$message({
                    type: "success",
                    message: "删除成功"
                  });
                } else {
                  this.$message.error(response.message);
                }
              });
              break;
            case "zyfy":
              delCustomerOffercountries({
                id: row.id
              }).then(response => {
                if (response.success) {
                  this.postForm.customerOffercountriesList.splice(index, 1);
                  this.$message({
                    type: "success",
                    message: "删除成功"
                  });
                }
              }
              )
            case "pm":
              delCustomerRanking({
                id: row.id
              }).then(response => {
                if (response.success) {
                  this.postForm.customerRankingList.splice(index, 1);
                  this.$message({
                    type: "success",
                    message: "删除成功"
                  });
                }
              }
              )
            default:
              break;
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    deldfcondialog() {
      if (
        this.dialogFormStatus == "update" ||
        !this.dfconFromData.custContactId
      ) {
        this.dialogFormdfcon = false;
      } else {
        delCustomerContacturl({
          custContactId: this.dfconFromData.custContactId
        }).then(response => {
          if (response.success) {
            const index = this.postForm.customerContacts.indexOf(
              this.dfconFromData
            );
            this.postForm.customerContacts.splice(index, 1);
            this.dialogFormdfcon = false;
          } else {
            this.$message.error(response.message);
          }
        });
      }
    },
    delzsdialog() {
      if (this.dialogFormStatus == "update" || !this.zsFromData.id) {
        this.dialogFormzs = false;
      } else {
        delCustomerRequirementUrl({
          ID: this.zsFromData.id
        }).then(response => {
          if (response.success) {
            const index = this.postForm.customerRequirements.indexOf(
              this.zsFromData
            );
            this.postForm.customerRequirements.splice(index, 1);
            this.dialogFormzs = false;
          } else {
            this.$message.error(response.message);
          }
        });
      }
    },
    async createCustAddr(type) {
      switch (type) {
        case "addr":
          this.addrFromData.custId = this.postForm.custId;
          addCustomerAddrUrl(this.addrFromData).then(response => {
            if (response.success) {
              this.dialogFormAddr = false;
              this.postForm.customerAddrs.push(response.data);
            } else {
              this.$message.error(response.message);
            }
          });
          break;
        case "dfcon":
          if (this.isdfItemTrue()) {
            const tempData = Object.assign({}, this.dfconFromData);
            tempData.custId = this.postForm.custId;
            this.$refs.ContactDfDetail.createCustAddr()
            // updateCustomerContacturl(tempData).then(response => {
            //   if (response.success) {
            //     for (const v of this.postForm.customerContacts) {
            //       if (v.custContactId === this.dfconFromData.custContactId) {
            //         const index = this.postForm.customerContacts.indexOf(v);
            //         this.postForm.customerContacts.splice(
            //           index,
            //           1,
            //           response.data.data
            //         );
            //
            //         break;
            //       }
            //     }
            //
            //     this.dialogFormdfcon = false;
            //   } else {
            //     this.$message.error(response.message);
            //   }
            // });
          }
          break;
        case "zs":
          if (this.zsFromData.id) {
            const tempData = Object.assign({}, this.zsFromData);
            tempData.custId = this.postForm.custId;
            tempData.ID = this.zsFromData.id;
            updateCustomerRequirementUrl(tempData).then(response => {
              if (response.success) {
                for (const v of this.postForm.customerRequirements) {
                  if (v.id === this.zsFromData.id) {
                    const index = this.postForm.customerRequirements.indexOf(v);
                    this.postForm.customerRequirements.splice(
                      index,
                      1,
                      response.data
                    );

                    break;
                  }
                }

                this.dialogFormzs = false;
              } else {
                this.$message.error(response.message);
              }
            });
          } else {
            this.$message.error("请选择指示类型");
          }
          break;
        case "hd":
          this.hdFromData.custId = this.postForm.custId;
          this.hdFromData.customerContactActs.forEach(e => {
            delete e.hdlx;
          });
          addActivityUrl(this.hdFromData).then(response => {
            if (response.success) {
              this.dialogFormhd = false;
              this.postForm.activities.push(response.data);
            } else {
              this.$message.error(response.message);
            }
          });
          break;
        case "wfcon":
          this.wfconFromData.custId = this.postForm.custId;
          allocationCustomerUrl(this.wfconFromData).then(response => {
            if (response.success) {
              this.dialogFormwfcon = false;
              this.postForm.agencyContacts.push(response.data);
            } else {
              this.$message.error(response.message);
            }
          });
          break;
        case "yhzh":
          this.yhzhFromData.custId = this.postForm.custId;
          if (!this.yhzhFromData.account) {
            this.$message.error('请填写银行账户')
            return
          }
          this.yhzhFromData.account = this.yhzhFromData.account.replace(/\s/g, '')
          let accountNotice = ''
          let accAddrNotice = ''
          // 正则表达式：匹配非字母、数字的字符（包括下划线）
          const regex = /[\W_]/g;
          const regex1 = /[^a-zA-Z0-9\u4e00-\u9fff\s]/g;
          if (regex.test(this.yhzhFromData.account)) {
            accountNotice = '银行账户'
          }
          if (regex1.test(this.yhzhFromData.accAddr)) {
            accAddrNotice = '收款人地址'
          }
          const tempData3 = Object.assign({}, this.yhzhFromData);
          // 检查并提示
          let notice = ''
          if (this.overflowWord140.find(item => tempData3[item.key] && tempData3[item.key].length > 140)) {
            notice = this.overflowWord140.filter(item => tempData3[item.key] && tempData3[item.key].length > 140).map(j => j.label).join(',')
            // this.$message.warning(`${notice}字数已超过140`)
          }
          const specialKeyList = []
          const andKeyList = []
          let andKeyMessage = ''
          this.specialWord.forEach(item => {
            const {result, data} = this.stripscript(tempData3[item.key] || '')
            result && specialKeyList.push({...item, newData: data})
          })
          this.isAndCheck.forEach(item => {
            if (tempData3[item.key] && tempData3[item.key].includes('&')) {
              andKeyList.push(item.label)
            }
          })
          andKeyMessage = andKeyList.join(',')
          const newDatas = []
          const h = this.$createElement

          if (andKeyMessage) {
            await this.$confirm(`${andKeyMessage}中包含&字符！`, "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              showCancelButton: false,
              type: "warning"
            })
          }

          notice && newDatas.push(h('p', {
            style: {
              fontSize: '16px',
              color: '#E6A23C'
            }
          }, `${notice}字数已超过140`))
          specialKeyList.length && newDatas.push(h('p', {
            style: {
              fontSize: '16px',
              color: '#F56C6C'
            }
          }, `${specialKeyList.map(i => i.label).join(',')}中出现特殊字符,请知悉`))
          accountNotice && newDatas.push(h('p', {
            style: {
              fontSize: '16px',
              color: '#F56C6C'
            }
          }, `银行账户中出现非英文和数字,保存后将自动删除`))
          accAddrNotice && newDatas.push(h('p', {
            style: {
              fontSize: '16px',
              color: '#F56C6C'
            }
          }, `收款人地址中出现非中文、英文和数字,保存后将自动删除`))
          if (notice || specialKeyList.length || accountNotice || accAddrNotice) {
            this.$confirm(h('div', null, newDatas), "提示", {
              confirmButtonText: "保存",
              cancelButtonText: "取消",
              type: "warning"
            }).then(() => {
              // 只提示，不删除
              specialKeyList.forEach(j => {
                tempData3[j.key] = j.newData
              })
              tempData3.account = tempData3.account.replace(regex, '')
              tempData3.accAddr = tempData3.accAddr.replace(regex1, '')
              addBankaccountUrl(tempData3).then(response => {
                if (response.success) {
                  this.dialogFormyhzh = false;
                  this.postForm.bankaccounts.push(response.data);
                } else {
                  this.$message.error(response.message);
                }
              });

            }).catch(() => {})
          } else {
            addBankaccountUrl(this.yhzhFromData).then(response => {
              if (response.success) {
                this.dialogFormyhzh = false;
                this.postForm.bankaccounts.push(response.data);
              } else {
                this.$message.error(response.message);
              }
            });
          }
          break
        case "zyfy":
          if (this.zyfyOtherDesc||this.zyfyFromData.businessAreaList.length>0) {
            this.zyfyFromData.businessAreaList.forEach((item,index) => {
              if (item === '其他（请详述）') {
                this.zyfyFromData.businessAreaList[index] = item + '&' + this.zyfyOtherDesc
              }
            })
          }
          const params = {
            ...this.zyfyFromData,
            custId: this.postForm.custId
          }
          addCustomerOffercountries(params).then(res => {
            if (res.success) {
              const id = this.$route.params && this.$route.params.id || this.cooperativeId;
              this.fetchData(id);
              this.closeModal('zyfy');
            }
          })
          break;
        case "pm":
          if (this.pmOtherDesc&&this.pmFromData.businessArea) {
            this.pmFromData.businessArea = this.pmFromData.businessArea + '&' + this.pmOtherDesc
          }
          const param = {
            ...this.pmFromData,
            custId: this.postForm.custId
          }
          addCustomerRanking(param).then(res => {
            if (res.success) {
              const id = this.$route.params && this.$route.params.id || this.cooperativeId;
              this.fetchData(id);
              this.closeModal('pm');
            }
          })
          break;
        default:
          break;
      }
    },
    async updateCustAddr(type) {
      switch (type) {
        case "addr":
          const tempData = Object.assign({}, this.addrFromData);
          updateCustomerAddrUrl(tempData).then(response => {
            if (response.success) {
              for (const v of this.postForm.customerAddrs) {
                if (v.addrId === this.addrFromData.addrId) {
                  const index = this.postForm.customerAddrs.indexOf(v);
                  this.postForm.customerAddrs.splice(
                    index,
                    1,
                    this.addrFromData
                  );
                  this.addrFromData.ctData = [
                    this.addrFromData.country,
                    this.addrFromData.province,
                    this.addrFromData.city
                  ];
                  break;
                }
              }

              this.dialogFormAddr = false;
            } else {
              this.$message.error(response.message);
            }
          });
          break;

        case "hd":
          const tempData1 = Object.assign({}, this.hdFromData);

          updateActivityUrl(tempData1).then(response => {
            if (response.success) {
              for (const v of this.postForm.activities) {
                if (v.custActId === this.hdFromData.custActId) {
                  const index = this.postForm.activities.indexOf(v);
                  this.postForm.activities.splice(index, 1, response.data);

                  break;
                }
              }

              this.dialogFormhd = false;
            } else {
              this.$message.error(response.message);
            }
          });
          break;

        case "wfcon":
          const tempData2 = Object.assign({}, this.wfconFromData);

          updateAgencyContactUrl(tempData2).then(response => {
            if (response.success) {
              for (const v of this.postForm.agencyContacts) {
                if (v.agencyContactId === this.wfconFromData.agencyContactId) {
                  const index = this.postForm.agencyContacts.indexOf(v);
                  this.postForm.agencyContacts.splice(
                    index,
                    1,
                    response.data
                    // this.wfconFromData
                  );

                  break;
                }
              }

              this.dialogFormwfcon = false;
            } else {
              this.$message.error(response.message);
            }
          });
          break;
        case "yhzh":

          if (!this.yhzhFromData.account) {
            this.$message.error('请填写银行账户')
            return
          }
          this.yhzhFromData.account = this.yhzhFromData.account.replace(/\s/g, '')
          let accountNotice = ''
          let accAddrNotice = ''
          // 正则表达式：匹配非字母、数字的字符（包括下划线）
          const regex = /[\W_]/g;
          const regex1 = /[^a-zA-Z0-9\u4e00-\u9fff\s]/g;
          if (regex.test(this.yhzhFromData.account)) {
            accountNotice = '银行账户'
          }
          if (regex1.test(this.yhzhFromData.accAddr)) {
            accAddrNotice = '收款人地址'
          }
          const tempData3 = Object.assign({}, this.yhzhFromData);
          // 检查并提示
          let notice = ''
          if (this.overflowWord140.find(item => tempData3[item.key] && tempData3[item.key].length > 140)) {
            notice = this.overflowWord140.filter(item => tempData3[item.key] && tempData3[item.key].length > 140).map(j => j.label).join(',')
            // this.$message.warning(`${notice}字数已超过140`)
          }
          const specialKeyList = []
          this.specialWord.forEach(item => {
            const {result, data} = this.stripscript(tempData3[item.key] || '')
            result && specialKeyList.push({...item, newData: data})
          })
          let andKeyMessage = ''
          let andKeyList = []
          this.isAndCheck.forEach(item => {
            if (tempData3[item.key] && tempData3[item.key].includes('&')) {
              andKeyList.push(item.label)
            }
          })
          andKeyMessage = andKeyList.join(',')

          if (andKeyMessage) {
            await this.$confirm(`${andKeyMessage}中包含&字符！`, "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              showCancelButton: false,
              type: "warning"
            })
          }
          const newDatas = []
          const h = this.$createElement

          notice && newDatas.push(h('p', {
            style: {
              fontSize: '16px',
              color: '#E6A23C'
            }
          }, `${notice}字数已超过140`))
          specialKeyList.length && newDatas.push(h('p', {
            style: {
              fontSize: '16px',
              color: '#F56C6C'
            }
          }, `${specialKeyList.map(i => i.label).join(',')}中出现特殊字符,请知悉`))
          accountNotice && newDatas.push(h('p', {
            style: {
              fontSize: '16px',
              color: '#F56C6C'
            }
          }, `银行账户中出现非英文和数字,保存后将自动删除`))
          accAddrNotice && newDatas.push(h('p', {
            style: {
              fontSize: '16px',
              color: '#F56C6C'
            }
          }, `收款人地址中出现非中文、英文和数字,保存后将自动删除`))
          if (!this.yhzhFromData.account) {
            this.$message.error('请填写银行账户')
            return
          }
          if (notice || specialKeyList.length || accountNotice || accAddrNotice) {
            this.$confirm(h('div', null, newDatas), "提示", {
              confirmButtonText: "保存",
              cancelButtonText: "取消",
              type: "warning"
            }).then(() => {
              // 只提示，不删除
              specialKeyList.forEach(j => {
                tempData3[j.key] = j.newData
              })
              tempData3.account = tempData3.account.replace(regex, '')
              tempData3.accAddr = tempData3.accAddr.replace(regex1, '')
              updateBankaccountUrl(tempData3).then(response => {
                if (response.success) {
                  for (const v of this.postForm.bankaccounts) {
                    if (v.custBankId === this.yhzhFromData.custBankId) {
                      const index = this.postForm.bankaccounts.indexOf(v);
                      this.postForm.bankaccounts.splice(
                        index,
                        1,
                        tempData3
                      );

                      break;
                    }
                  }
                  this.dialogFormyhzh = false;
                } else {
                  this.$message.error(response.message);
                }
              });
            }).catch(() => {})
          } else {
            updateBankaccountUrl(tempData3).then(response => {
              if (response.success) {
                for (const v of this.postForm.bankaccounts) {
                  if (v.custBankId === this.yhzhFromData.custBankId) {
                    const index = this.postForm.bankaccounts.indexOf(v);
                    this.postForm.bankaccounts.splice(
                      index,
                      1,
                      this.yhzhFromData
                    );

                    break;
                  }
                }

                this.dialogFormyhzh = false;
              } else {
                this.$message.error(response.message);
              }
            });
          }
          break;
        case "zyfy":
          if (this.zyfyOtherDesc||this.zyfyFromData.businessAreaList.length>0) {
            this.zyfyFromData.businessAreaList.forEach((item,index) => {
              if (item === '其他（请详述）') {
                this.zyfyFromData.businessAreaList[index] = item + '&' + this.zyfyOtherDesc
              }
            })
          }
          const params = Object.assign({}, this.zyfyFromData);
          upCustomerOffercountries(params).then(response => {
            if (response.success) {
              const id = this.$route.params && this.$route.params.id || this.cooperativeId;
              this.fetchData(id)
              this.closeModal('zyfy');
            } else {
              this.$message.error(response.message);
            }
          })
          break;
        case "pm":
          if (this.pmOtherDesc&&this.pmFromData.businessArea) {
            this.pmFromData.businessArea = this.pmFromData.businessArea + '&' + this.pmOtherDesc
          }
          const param = Object.assign({}, this.pmFromData);
          upCustomerRanking(param).then(response => {
            if (response.success) {
              const id = this.$route.params && this.$route.params.id || this.cooperativeId;
              this.fetchData(id)
              this.closeModal('pm');
            } else {
              this.$message.error(response.message);
            }
          })
          break;

        default:
          break;
      }
    },
    async addhdDftable(type) {
      switch (type) {
        case "dfcon":
          this.queryCustSelect({name:this.postForm.name,custId:this.postForm.custId})
          break;
        case "wfcon":
          this.hdFromData.agencyContactActs.push({
            userId: "",
            memo: ""
          });

          break;
        case "glgs":
          this.postForm.customerAssociates.push({
            custAssName: "",
            relationship: ""
          });

          break;
        case "lyct":
          this.postForm.conflicters.push({
            fullname: "",
            memo: ""
          });

          break;
        case "hy":
          this.postForm.customerIndustryS.push({
            induId: "",
            info: ""
          });

          break;

        default:
          break;
      }
    },
    handledeleElementhddfcon(item) {
      const index = this.hdFromData.customerContactActs.indexOf(item);
      this.hdFromData.customerContactActs.splice(index, 1);
    },
    handledeleElementhddglgs(item) {
      const index = this.postForm.customerAssociates.indexOf(item);
      this.postForm.customerAssociates.splice(index, 1);
    },
    handledeleElementhdwfcon(item) {
      const index = this.hdFromData.agencyContactActs.indexOf(item);
      this.hdFromData.agencyContactActs.splice(index, 1);
    },
    hdkhselect(vId, row, index_) {
      var e = {};
      // this.seletData.paternalUnitKh.forEach(ite => {
      this.hdFromData.customerContactActs[index_].paternalUnitKh.forEach(ite => {
        if (ite.custId == vId) {
          e = ite;
          return;
        }
      });

      const index = this.hdFromData.customerContactActs.indexOf(row);
      this.hdFromData.customerContactActs[index].hdlx = e.customerContacts || [];
      this.hdFromData.customerContactActs[index].custContactId = e.custContactId || '';
    },
    wfUserNamechange(id) {
      var e = {};
      this.seletData.wfuserNames.forEach(ite => {
        if (ite.userId == id) {
          e = ite;
          return;
        }
      });
      this.wfconFromData.position = e.positionStr;
    },
    regTypeselectChange(id) {
      this.zsFromData.custId = this.postForm.custId;
      addCustomerRequirementUrl(this.zsFromData).then(response => {
        if (response.success) {
          this.zsFromData.id = response.data.id;
          this.zsFromData.ID = response.data.id;
          this.zsfileUploadbool = true;
          this.postForm.customerRequirements.push(response.data);
        } else {
          this.$message.error(response.message);
        }
      });
      queryregCaseTypeUrl({
        indicateType: id,
        custId: this.postForm.custId
      }).then(response => {
        if (response.success) {
          this.seletData.caseTypezs = response.data;
        }
      });
    }
    //<--表格项
  }
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
    width: 100%;
  }
}
.form-border {
  /deep/ .el-row {
    margin: 0px;
  }
  /deep/ .textareaItem {
    .el-form-item__label{
      min-height: 66px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .el-form-item__content{
      line-height: normal;
      min-height: 66px;
      div {
        //width: 100%;
      }
    }
  }
  /deep/ .postInfo-container-item {
    width: 100%;
  }
  /deep/ .el-form-item__label {
    background-color: #f9f9f9;
    width: 30%;
    text-align: right;
    line-height: 30px;
  }

  /deep/ .el-form-item {
    border-right: 1px solid #d7d7d7;
    display: flex;
    margin: 0px !important;
    height: 100%;
  }
  /deep/ .el-row {
    border-bottom: 1px solid #d7d7d7;
    display: flex;
    height: 100%;
  }
  /deep/ .el-input,
  /deep/ .el-select {
    width: 70%;
  }
  /deep/ .el-form-item__content {
    flex: 1;
    /*text-align: center;*/
    min-height: 30px;
    padding-left: 10px ;
    display: flex;
    align-items: center;
    .el-form-item__error {
      position: relative;
      left: 0;
      top: 0;
    }
    div {
      //width: 100%;
    }
  }
  .fullRow {
    /deep/ .el-form-item__label {
      width: 15%;
    }

    /deep/ .el-input,
    /deep/ .el-select {
      width: 100%;
    }
  }
  /deep/ .el-input__inner {
    border: none;
  }
  /deep/ .el-select .el-input {
    width: 100%;
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
    display: inline-table;
    width: 85%;
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
/deep/.postInfoleft /deep/.el-form-item__content {
  text-align: left;
}
.el-form-item__error {
  position: relative;
  left: 0;
  top: 0;
}
.hdForm, .bankDialog {
  .el-row {
    /deep/.el-form-item__content {
      /*text-align: center;*/
      /*display: flex;*/
      /*align-items: center;*/
      min-height: 40px;
      height: auto;
      .el-select, .el-input, .el-input__inner, .el-input__suffix, .el-input__icon {
        height: 30px;
        line-height: 30px;
      }
    }

  }
}
.require:before {
  content: "*";
  color: #f56c6c;
  margin-right: 4px;
}
>>>.el-table__column-filter-trigger i {
  color: #fff;
}
>>>.el-table th>.cell.highlight {
  color: #67c23a;
}
.bankDialog {
  .el-form-item__content{
    line-height: normal;
    min-height: 66px;
    div {
      width: 100%!important;
    }
  }
}
/deep/ .el-upload-dragger{
  height: 46px;
}
/deep/ .textarea-input{
  .el-textarea__inner{
    border: none !important;
  }
}
</style>
