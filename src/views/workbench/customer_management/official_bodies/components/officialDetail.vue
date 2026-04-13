<template>
  <div class="createPost-container">

    <el-form ref="postForm" :model="postForm" :rules="rules" size="mini" class="form-container">
      <div class="createPost-main-container">
        <div class="form-con">
          <el-row>
            <el-col class="tilteSpan" :span="24">
              <span id='jbxx-title'>基本信息</span>
            </el-col>
          </el-row>

          <el-row>
            <el-col class="form-con-item" :span="22">

              <el-row class="form-border">
                <el-col :span="24">
                  <el-row class="fullRow">
                    <el-col :span="24">
                      <el-form-item label="编码:" class="postInfo-container-item">
                        <el-input v-model="postForm.custId" :disabled="true"></el-input>
                      </el-form-item>
                    </el-col>

                  </el-row>
                  <el-row class="">
                    <el-col :span="12">
                      <el-form-item label="简称:" class="postInfo-container-item" prop="name">
                        <el-input v-model="postForm.name"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="全称:" prop="fullname" class="">
                        <el-input v-model="postForm.fullname" @blur='creatLsCust("postForm")'></el-input>
                      </el-form-item>
                    </el-col>

                  </el-row>
<!--                  <el-row class="fullRow">-->
<!--                    <el-col :span="24">-->
<!--                      <el-form-item label="全称:" prop="fullname" class="">-->
<!--                        <el-input v-model="postForm.fullname" @blur='creatLsCust("postForm")'></el-input>-->
<!--                      </el-form-item>-->
<!--                    </el-col>-->
<!--                  </el-row>-->

                  <el-row class="">
                    <el-col :span="12">
                      <el-form-item label="外文全称:" class="postInfo-container-item">
                        <el-input v-model="postForm.fgFullname"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="申请人:" class="postInfo-container-item">
                        <el-radio-group v-model="postForm.isApplicant">
                          <el-radio :label='1'>是</el-radio>
                          <el-radio :label='0'>否</el-radio>
                        </el-radio-group>
                      </el-form-item>
                    </el-col>

                  </el-row>

<!--                  <el-row class="fullRow">-->
<!--                    <el-col :span="24">-->
<!--                      <el-form-item label="申请人:" class="postInfo-container-item">-->
<!--                        <el-radio-group v-model="postForm.isApplicant">-->
<!--                          <el-radio :label='1'>是</el-radio>-->
<!--                          <el-radio :label='0'>否</el-radio>-->
<!--                        </el-radio-group>-->
<!--                      </el-form-item>-->
<!--                    </el-col>-->
<!--                  </el-row>-->

                  <el-row class="">
                    <el-col :span="12">
                      <el-form-item label="主体法律性质:" class="postInfo-container-item">
                        <template>
                          <el-select default-first-option :clearable='true' placeholder="请选择" v-model="postForm.legalNature" filterable>
                            <el-option v-for="item in seletData.mainLegalNature" :key="item.id" :label="item.typeName" :value="item.id">
                            </el-option>
                          </el-select>
                        </template>
                      </el-form-item>

                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="政府机关类别:" prop="companyType" class="postInfo-container-item">
                        <template>
                          <el-select default-first-option :clearable='true' placeholder="请选择" v-model="postForm.companyType" filterable>
                            <el-option v-for="item in seletData.zfjgType" :key="item.id" :label="item.typeName" :value="item.typeName">
                            </el-option>
                          </el-select>
                        </template>
                      </el-form-item>

                    </el-col>

                  </el-row>
<!--                  <el-row class="fullRow">-->
<!--                    <el-col :span="24">-->
<!--                      <el-form-item label="政府机关类别:" prop="companyType" class="postInfo-container-item">-->
<!--                        <template>-->
<!--                          <el-select default-first-option :clearable='true' placeholder="请选择" v-model="postForm.companyType" filterable>-->
<!--                            <el-option v-for="item in seletData.zfjgType" :key="item.id" :label="item.typeName" :value="item.typeName">-->
<!--                            </el-option>-->
<!--                          </el-select>-->
<!--                        </template>-->
<!--                      </el-form-item>-->

<!--                    </el-col>-->

<!--                  </el-row>-->
                  <el-row class="">
                    <el-col :span="12">
                      <el-form-item label="行政级别:" class="postInfo-container-item" prop="officerLevel">
                        <template>
                          <el-select v-if="postForm.companyType != '法院'" default-first-option :clearable='true' placeholder="请选择" v-model="postForm.officerLevel" filterable>
                            <el-option v-for="item in seletData.xzLevel" :key="item.id" :label="item.typeName" :value="item.typeName">
                            </el-option>
                          </el-select>
                          <el-select v-else default-first-option :clearable='true' placeholder="请选择" v-model="postForm.officerLevel" filterable>
                            <el-option v-for="item in [{typeName: '最高', id: 1}, {typeName: '高级', id: 2}, {typeName: '中级', id: 3}, {typeName: '基层', id: 4}]" :key="item.id" :label="item.typeName" :value="item.typeName">
                            </el-option>
                          </el-select>
                        </template>
                      </el-form-item>

                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="来源:" class="postInfo-container-item">
                        <template>
                          <el-select default-first-option :clearable='true' placeholder="请选择" v-model="postForm.source" filterable>
                            <el-option v-for="item in seletData.customerSource" :key="item.id" :label="item.typeName" :value="item.id">
                            </el-option>
                          </el-select>
                        </template>
                      </el-form-item>
                    </el-col>

                  </el-row>

<!--                  <el-row class="fullRow">-->
<!--                    <el-col :span="24">-->
<!--                      <el-form-item label="来源:" class="postInfo-container-item">-->
<!--                        <template>-->
<!--                          <el-select default-first-option :clearable='true' placeholder="请选择" v-model="postForm.source" filterable>-->
<!--                            <el-option v-for="item in seletData.customerSource" :key="item.id" :label="item.typeName" :value="item.id">-->
<!--                            </el-option>-->
<!--                          </el-select>-->
<!--                        </template>-->
<!--                      </el-form-item>-->
<!--                    </el-col>-->

<!--                  </el-row>-->
                  <el-row class="">
                    <el-col :span="12">
                      <el-form-item label="介绍人:" class="postInfo-container-item">
                        <template>
                          <el-input v-model="postForm.custIntroductor"></el-input>
                        </template>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="介绍人单位:" class="postInfo-container-item">
                        <template>

                          <el-input v-model="postForm.custIntroCompany"></el-input>
                        </template>
                      </el-form-item>
                    </el-col>
                  </el-row>
<!--                  <el-row class="fullRow">-->
<!--                    <el-col :span="24">-->
<!--                      <el-form-item label="介绍人单位:" class="postInfo-container-item">-->
<!--                        <template>-->

<!--                          <el-input v-model="postForm.custIntroCompany"></el-input>-->
<!--                        </template>-->
<!--                      </el-form-item>-->
<!--                    </el-col>-->

<!--                  </el-row>-->

                  <el-row class="">
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
                          <el-input v-model="postForm.phone" @blur='creatLsCust("postForm")'></el-input>
                        </template>
                      </el-form-item>
                    </el-col>
                  </el-row>
<!--                  <el-row class="fullRow">-->
<!--                    <el-col :span="24">-->
<!--                      <el-form-item label="传真:" prop="phone" class="postInfo-container-item">-->
<!--                        <template>-->
<!--                          <el-input v-model="postForm.phone" @blur='creatLsCust("postForm")'></el-input>-->
<!--                        </template>-->
<!--                      </el-form-item>-->
<!--                    </el-col>-->
<!--                  </el-row>-->
                  <el-row class="">
                    <el-col :span="12">
                      <el-form-item label="电话:" prop="fax1" class="postInfo-container-item">
                        <template>
                          <el-input v-model="postForm.fax1"></el-input>
                        </template>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="电子邮件:" class="postInfo-container-item">
                        <template>
                          <el-input v-model="postForm.email"></el-input>
                        </template>
                      </el-form-item>
                    </el-col>
                  </el-row>
<!--                  <el-row class="fullRow">-->
<!--                    <el-col :span="24">-->
<!--                      <el-form-item label="电子邮件:" class="postInfo-container-item">-->
<!--                        <template>-->
<!--                          <el-input v-model="postForm.email"></el-input>-->
<!--                        </template>-->
<!--                      </el-form-item>-->
<!--                    </el-col>-->
<!--                  </el-row>-->
                  <el-row class="fullRow">
                    <el-col :span="24">
                      <el-form-item label="简介:" class="postInfo-container-item">

                        <el-input type="text" :rows="2" placeholder="" v-model="postForm.info">
                        </el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row class="fullRow">
                    <el-col :span="24">

                      <el-form-item label="文档:" class="postInfo-container-item uploader-custfile">
                        <template>

                          <el-upload class="upload-demo" name="custFile" :data='addCustomerFileData' ref="uploadCustFile" :action="addCustomerFileUrl" :before-upload="handlePreview"
                             :on-remove="handleRemove" :file-list="postForm.materiaoList" :auto-upload="false">
                            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                            <el-button style="margin-left: 10px;" size="small" type="success" @click="addCustomerFile">
                              上传</el-button>

                          </el-upload>
                        </template>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row class="fullRow">
                    <el-col :span="24">

                      <el-form-item label="备注:" class="postInfo-container-item uploader-custfile">
                        <template>
                          <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="postForm.memo">
                          </el-input>
                        </template>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="建档日期:" class="postInfo-container-item">
                        <template>
                          <el-input v-model="postForm.createTime"></el-input>
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
                  <span id='khdz-title'>官方机构-地址</span>
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
                  <span id='dflxr-title'>官方机构-对方联系人</span>
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

                    <el-table-column label="姓名" align="left" width>
                      <template slot-scope="scope">
                        <span>{{ scope.row.name }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="职务" align="left" width>
                      <template slot-scope="scope">
                        <span>{{ scope.row.jobtitle }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="部门" align="left" width>
                      <template slot-scope="scope">
                        <span>{{ scope.row.department }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="办公电话" align="left" width>
                      <template slot-scope="scope">
                        <span>{{ scope.row.tel }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="邮箱" align="left" width>
                      <template slot-scope="scope">
                        <span>{{ scope.row.email }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="状态" align="left" width>
                      <template slot-scope="scope">
                        <span>{{ scope.row.status }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="启用" align="left" width>
                      <template slot-scope="scope">
                        <span>{{ scope.row.sysStatus }}</span>
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
                  <span id='khhd-title'>官方机构-活动</span>
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
                  <span id='wflxr-title'>官方机构-我方联系人</span>
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

                        <el-button size="mini" type="text" @click="handledeleElementhddfcon(row)">删除</el-button>

                      </template>
                    </el-table-column>
                  </el-table>
                </el-col>
              </el-row>

              <el-row v-if="!isCustomer">
                <el-col :span="24" style="text-align:center">
                  <el-form-item>
                    <el-button size="medium" type="primary" v-if="!isEdit" @click="submitForm('postForm')">创建
                    </el-button>
                    <el-button size="medium" type="primary" v-if="isEdit" @click="updatasubmitForm('postForm')">保存修改
                    </el-button>

                    <el-button type="primary" @click="$router.go(-1);" size="medium">取消</el-button>

                  </el-form-item>
                </el-col>

              </el-row>
            </el-col>
            <el-col class="form-con-item clearfix" :span="2">
              <div style="height: 520px;position: fixed;top:20%;right:2%">
                <el-steps :space="200" :active="stepActive" direction="vertical">
                  <el-step @click.native="stepset(0)" title="基本信息"></el-step>
                  <el-step @click.native="stepset(1)" title="地址"></el-step>
                  <el-step @click.native="stepset(2)" title="对方联系人"></el-step>
                  <el-step @click.native="stepset(3)" title="活动"></el-step>

                  <el-step @click.native="stepset(6)" title="关联公司"></el-step>

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
                    <el-select default-first-option :clearable='true' placeholder="请选择" v-model="addrFromData.status" filterable>
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
      <el-form ref="dfconFromData" :model="dfconFromData" :rules="dfconRules" size="mini" label-position="left" style="width: 100%;">

        <el-row>
          <el-col class="form-con-item" :span="24">
            <el-row>
              <el-col class="tilteSpan" :span="24">
                <span>基本信息</span>
              </el-col>
            </el-row>
            <el-row class="form-border">
              <el-col :span="12">
                <el-row>
                  <el-col :span="24">
                    <el-form-item label="编码:" class="postInfo-container-item">
                      <el-input v-model="dfconFromData.custContactId" :disabled="true"></el-input>
                    </el-form-item>
                  </el-col>

                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item label="姓:" class="postInfo-container-item">
                      <el-input v-model="dfconFromData.firstname"></el-input>
                    </el-form-item>
                  </el-col>

                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item label="姓名:" prop="name" class="">
                      <el-input v-model="dfconFromData.name" @blur='creatLsCust("dfconFromData")'></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item label="性别:" prop="gender" class="postInfo-container-item">
                      <template>
                        <el-select default-first-option :clearable='true' placeholder="请选择" v-model="dfconFromData.gender" @change='creatLsCust("dfconFromData")' filterable>
                          <el-option v-for="item in seletData.sex" :key="item.id" :label="item.typeName" :value="item.id">
                          </el-option>
                        </el-select>
                      </template>
                    </el-form-item>
                  </el-col>

                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item label="称谓:" class="postInfo-container-item">
                      <template>
                        <el-select default-first-option :clearable='true' placeholder="请选择" v-model="dfconFromData.called" filterable>
                          <el-option v-for="item in seletData.called" :key="item.id" :label="item.typeName" :value="item.id">
                          </el-option>
                        </el-select>
                      </template>
                    </el-form-item>
                  </el-col>

                </el-row>

              </el-col>
              <el-col :span="12">
                <el-row>
                  <el-col :span="24">
                    <el-form-item label="照片" class="postInfo-container-item avatar-uploader">

                      <el-upload :action='dfuserIconUrl' ref='custContIconupload' :data='custContIconSendData' :on-success='dficonSendSuccess' accept="image/jpeg,image/gif,image/png"
                        :before-upload="onBeforeUploadIcon" :show-file-list="false" :auto-upload='false' name='custContIcon' :on-change="dfhandleAvatarChange">
                        <img v-if="dfconFromData.custContIcon" :src="`/ipdoc${dfconFromData.custContIcon}`" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                      </el-upload>
                    </el-form-item>
                  </el-col>
                </el-row>

              </el-col>
            </el-row>
            <el-row class="form-border">
              <el-col :span="24">

                <el-row class="fullRow">
                  <el-col :span="24">
                    <el-form-item label="出生日期:" class="postInfo-container-item">

                      <el-date-picker v-model="dfconFromData.dfconFromData" format='yyyy-MM-dd' value-format="yyyy-MM-dd" align="right" type="date" placeholder="选择日期" :picker-options="pickerOptions">
                      </el-date-picker>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row class="fullRow">
                  <el-col :span="24">
                    <el-form-item label="所属单位:" class="postInfo-container-item">

                      <el-input v-model="postForm.fullname"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row class="fullRow">
                  <el-col :span="24">
                    <el-form-item label="业务领域:" class="postInfo-container-item">

                      <el-input v-model="dfconFromData.bustype"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row class="fullRow">
                  <el-col :span="24">
                    <el-form-item label="分支机构:" class="postInfo-container-item">

                      <el-input v-model="dfconFromData.branch"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="是否主要联系人:" prop="ismain" class="postInfo-container-item">
                      <el-radio-group v-model="dfconFromData.ismain" @change='creatLsCust("dfconFromData")'>
                        <el-radio :label='true'>是</el-radio>
                        <el-radio :label='false'>否</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="是否账单联系人:" prop="isBillContact" class="postInfo-container-item">
                      <el-radio-group v-model="dfconFromData.isBillContact" @change='creatLsCust("dfconFromData")'>
                        <el-radio :label='true'>是</el-radio>
                        <el-radio :label='false'>否</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="部门:" class="postInfo-container-item">
                      <el-input v-model="dfconFromData.department"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="职务:" class="postInfo-container-item">
                      <el-input v-model="dfconFromData.jobtitle"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row class="fullRow">
                  <el-col :span="24">
                    <el-form-item label="状态:" prop="status" class="postInfo-container-item">

                      <template>
                        <el-select default-first-option :clearable='true' @change='creatLsCust("dfconFromData")' placeholder="请选择" v-model="dfconFromData.status" filterable>
                          <el-option v-for="item in seletData.lxstatu" :key="item.id" :label="item.typeName" :value="item.id">
                          </el-option>
                        </el-select>
                      </template>

                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row class="fullRow">
                  <el-col :span="24">
                    <el-form-item label="启动状态:" prop="sysStatus" class="postInfo-container-item">

                      <template>
                        <el-select default-first-option :clearable='true' @change='creatLsCust("dfconFromData")' placeholder="请选择" v-model="dfconFromData.sysStatus" filterable>
                          <el-option v-for="item in seletData.statu" :key="item.id" :label="item.typeName" :value="item.id">
                          </el-option>
                        </el-select>
                      </template>

                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row class="fullRow">
                  <el-col :span="24">
                    <el-form-item label="是否对账人:" class="postInfo-container-item">

                      <el-radio-group v-model="dfconFromData.isCollectbillMan">
                        <el-radio :label='1'>是</el-radio>
                        <el-radio :label='0'>否</el-radio>
                      </el-radio-group>

                    </el-form-item>
                  </el-col>
                </el-row>

              </el-col>
            </el-row>
            <el-row>
              <el-col class="tilteSpan" :span="24">
                <span>联系方式</span>
              </el-col>
            </el-row>
            <el-row class="form-border">
              <el-col :span="24">

                <el-row class="fullRow">
                  <el-col :span="24">
                    <el-form-item label="办公电话1:" class="postInfo-container-item">
                      <el-input v-model="dfconFromData.tel"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row class="fullRow">
                  <el-col :span="24">
                    <el-form-item label="办公电话2:" class="postInfo-container-item">
                      <el-input v-model="dfconFromData.mobile2"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row class="fullRow">
                  <el-col :span="24">
                    <el-form-item label="移动电话:" class="postInfo-container-item">

                      <el-input v-model="dfconFromData.mobile1"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row class="fullRow">
                  <el-col :span="24">
                    <el-form-item label="住宅电话:" class="postInfo-container-item">

                      <el-input v-model="dfconFromData.phone2"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row class="fullRow">
                  <el-col :span="24">
                    <el-form-item label="邮箱1:" class="postInfo-container-item">

                      <el-input v-model="dfconFromData.email"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row class="fullRow">
                  <el-col :span="24">
                    <el-form-item label="邮箱2:" class="postInfo-container-item">

                      <el-input v-model="dfconFromData.email2"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row class="fullRow">
                  <el-col :span="24">
                    <el-form-item label="传真1:" class="postInfo-container-item">

                      <el-input v-model="dfconFromData.fax1"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row class="fullRow">
                  <el-col :span="24">
                    <el-form-item label="即时通类型:" class="postInfo-container-item">

                      <el-input v-model="dfconFromData.msgType"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row class="fullRow">
                  <el-col :span="24">
                    <el-form-item label="即时通账号:" class="postInfo-container-item">

                      <el-input v-model="dfconFromData.msgAccount"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

              </el-col>
            </el-row>
            <el-row>
              <el-col class="tilteSpan" :span="24">
                <span>关系人信息</span>
              </el-col>
            </el-row>
            <el-row class="form-border">
              <el-col :span="24">
                <el-row class="fullRow">
                  <el-col :span="24">
                    <el-form-item label="上级主管:" class="postInfo-container-item">

                      <template>
                        <el-select default-first-option :clearable='true' placeholder="请选择" v-model="dfconFromData.bossCustContactId" filterable>
                          <el-option v-for="item in seletData.dfcon" :key="item.custContactId" :label="item.name" :value="item.custContactId">
                          </el-option>
                        </el-select>
                      </template>

                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row class="fullRow">
                  <el-col :span="24">
                    <el-form-item label="关系人1名称:" class="postInfo-container-item">

                      <template>
                        <el-select default-first-option :clearable='true' placeholder="请选择" v-model="dfconFromData.gxr1CustContactId" filterable>
                          <el-option v-for="item in seletData.dfcon" :key="item.custContactId" :label="item.name" :value="item.custContactId">
                          </el-option>
                        </el-select>
                      </template>

                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row class="fullRow">
                  <el-col :span="24">
                    <el-form-item label="关系人1关系描述:" class="postInfo-container-item">

                      <el-input v-model="dfconFromData.relat1"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row class="fullRow">
                  <el-col :span="24">
                    <el-form-item label="关系人2名称:" class="postInfo-container-item">

                      <template>
                        <el-select default-first-option :clearable='true' placeholder="请选择" v-model="dfconFromData.gxr2CustContactId" filterable>
                          <el-option v-for="item in seletData.dfcon" :key="item.custContactId" :label="item.name" :value="item.custContactId">
                          </el-option>
                        </el-select>
                      </template>

                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row class="fullRow">
                  <el-col :span="24">
                    <el-form-item label="关系人2关系描述:" class="postInfo-container-item">

                      <el-input v-model="dfconFromData.relat2"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row class="fullRow">
                  <el-col :span="24">
                    <el-form-item label="关系人3名称:" class="postInfo-container-item">

                      <template>
                        <el-select default-first-option :clearable='true' placeholder="请选择" v-model="dfconFromData.gxr3CustContactId" filterable>
                          <el-option v-for="item in seletData.dfcon" :key="item.custContactId" :label="item.name" :value="item.custContactId">
                          </el-option>
                        </el-select>
                      </template>

                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row class="fullRow">
                  <el-col :span="24">
                    <el-form-item label="关系人3关系描述:" class="postInfo-container-item">

                      <el-input v-model="dfconFromData.relat3"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row class="fullRow">
                  <el-col :span="24">
                    <el-form-item label="来源人:" class="postInfo-container-item">

                      <el-input v-model="dfconFromData.infoFromStaff"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row class="fullRow">
                  <el-col :span="24">
                    <el-form-item label="来源场合:" class="postInfo-container-item">

                      <el-input v-model="dfconFromData.infoFromPlace"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row class="fullRow">
                  <el-col :span="24">
                    <el-form-item label="来源时间:" class="postInfo-container-item">

                      <el-date-picker v-model="dfconFromData.infoFromDate" format='yyyy-MM-dd' value-format="yyyy-MM-dd" align="right" type="date" placeholder="选择日期" :picker-options="pickerOptions">
                      </el-date-picker>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <el-row>
              <el-col class="tilteSpan" :span="24">
                <span>常规活动信息</span>
              </el-col>
            </el-row>
            <el-row class="form-border">
              <el-col :span="24">
                <el-row class="fullRow">
                  <el-col :span="24">
                    <el-form-item label="常规活动:" class="postInfo-container-item">

                      <el-input v-model="dfconFromData.routineAct"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row class="fullRow">
                  <el-col :span="24">
                    <el-form-item label="常规活动备注:" class="postInfo-container-item">

                      <el-input v-model="dfconFromData.routineActMemo"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row class="fullRow">
                  <el-col :span="24">

                    <el-form-item label="联系人文档:" class="postInfo-container-item uploader-custfile">
                      <template>

                        <el-upload class="upload-demo" name="custContactFile" :data='custContactFiledata' ref="uploadcustContactFile" :action="custContactFileUrl" :before-upload="handlePreview"
                        :on-preview="preview" :on-remove="handleRemove" :file-list="dfconFromData.custContactFile || []" :auto-upload="false">
                          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                          <el-button style="margin-left: 10px;" size="small" type="success">
                            上传</el-button>

                        </el-upload>
                      </template>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row class="fullRow">
                  <el-col :span="24">
                    <el-form-item label="备注:" class="postInfo-container-item uploader-custfile">
                      <template>
                        <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="dfconFromData.memo">
                        </el-input>
                      </template>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>

          </el-col>

        </el-row>
      </el-form>
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
      <el-form ref="creathdForm" :model="hdFromData" label-position="left" style="width: 100%;">
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
                <el-form-item label="活动类型 :" class="postInfo-container-item">
                  <template>
                    <el-select default-first-option :clearable='true' placeholder="请选择" v-model="hdFromData.actType" filterable>
                      <el-option v-for="item in seletData.hdtype" :key="String(item.id)" :label="item.typeName" :value="String(item.id)">
                      </el-option>
                    </el-select>
                  </template>
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
                      <el-table-column label="客户" align="left" width>
                        <template slot-scope="scope">
                          <!-- <el-select default-first-option :clearable='true' v-model="scope.row.custId" @change="((val)=>{hdkhselect(val, scope.row)})" no-match-text='暂无数据' loading-text='正在查询'
                            filterable remote reserve-keyword placeholder="请输入关键词" :remote-method="remotepaternalUnitKh">
                            <el-option v-for="item in seletData.paternalUnitKh" :key="String(item.custId)" :label="item.name" :value="String(item.custId)">
                            </el-option>
                          </el-select> -->
                          {{ postForm.fullname }}
                        </template>
                      </el-table-column>

                      <el-table-column label="对方联系人" align="left" width>
                        <template slot-scope="scope">
                          <el-select default-first-option :clearable='true' placeholder="请选择" v-model="scope.row.custContactId" filterable>
                            <!-- <el-option v-for="item in scope.row.hdlx" :key="String(item.custContactId)" :label="item.name" :value="String(item.custContactId)"> -->
                            <el-option v-for="item in postForm.customerContacts" :key="String(item.custContactId)" :label="item.name" :value="Number(item.custContactId)">
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
                            <el-option v-for="item in seletData.userNames" :key="item.userId" :label="item.fullname" :value="Number(item.userId)">
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

                  <el-radio-group v-model="wfconFromData.ischeck">
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
  queryActivityOneUrl
} from "@/api/customerList";
import serviceApi from "@/api/serviceApi.config.js";
import { mapGetters } from "vuex";
import { truncate, truncateSync } from "fs";
export default {
  name: "officialDetail",
  computed: {
    ...mapGetters(["token", "name"])
  },
  components: {},
  props: {
    isCustomer: {
      type: Boolean,
      default: false
    },
    officialId: {
      type: [Number, String]
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      zsfileUploadbool: false,
      isCreatTrue: false,
      creatAddrForm: {},
      stepActive: 0,
      postForm: {
        name: "",
        custId: "",
        examineStatus: "1623",
        officerLevel: "",
        companyType: "",
        // userIcon: $("#sendFile-btn").attr("data-fileName"),   //头像
        materiaoList: [],
        fullname: "",
        fullnameEn: "",
        fgFullname: "",
        contactLanguage: "",
        isCollaboration: "",
        firstcaseCollitem: "",
        parentCustId: "",

        isAgent: "",
        curStatus: "",
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
        isOfficial: "1",
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

        ctData: []
      },

      loading: false,
      dialogFormAddr: false,
      dialogFormStatus: "",
      dialogFormdfcon: false,
      dialogFormhd: false,
      dialogFormwfcon: false,
      dialogFormzs: false,
      hdlx: "",
      rules: {
        officerLevel: [
          {
            required: true,
            trigger: "change",
            message: " "
          }
        ],
        companyType: [
          {
            required: true,
            trigger: "change",
            message: " "
          }
        ],
        name: [
          {
            required: true,
            trigger: "blur",
            message: " "
          }
        ],
        fullname: [
          {
            required: true,
            trigger: "blur",
            message: " "
          }
        ],

        fax1: [
          {
            required: true,
            trigger: "blur",
            message: " "
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
      // select的获取id有对应文档查询
      seletDataArr:
        "1042,1,1044,1053,1045,1076,1050,1049,1051,1052,1112,1063,1037,1048",
      seletData: {
        mainLegalNature: {}, //主法律性质
        customerSource: {}, //客户来源
        xzLevel: {},
        zfjgType: {},
        paternalUnitKh: {}, //kh
        customerOwner: {}, //客户所有者
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
        industry: {}
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
        examineStatus: "1623",
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
        examineStatus: "1623",
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

        examineStatus: "1623",

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
      }
      // <--添加指示相关属性
    };
  },
  created() {
    this.getAllSelectData();
    window.addEventListener("scroll", this.handleScroll);
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id || this.officialId;
      this.fetchData(id);
    }
  },
  watch: {
    "postForm.ctData": function(data, oldval) {
      if (data) {
       this.postForm.country = data[0];
        this.postForm.province = data[1];
        this.postForm.city = data[2];
        if (!this.postForm.continent) {
          this.postForm.continent = this.getcontinent(data[0]);
        }
      }
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
    }
  },
  methods: {
    fetchData(id) {
      queryCustomerUrl({ customerID: id })
        .then(response => {
          this.postForm = response.data;
          if (this.postForm.country) {
            this.postForm.ctData = [
              this.postForm.country,
              this.postForm.province,
              this.postForm.city
            ];
          }
        })
        .catch(err => {
          console.log(err);
        });
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

          delete this.postForm.customerAddrs;
          delete this.postForm.customerContacts;
          delete this.postForm.activities;
          delete this.postForm.agencyContacts;
          delete this.postForm.customerRequirements;
          delete this.postForm.ctData;
          this.postForm.isOfficial=1
          addCustomer(this.postForm).then(response => {
            this.loading = false;
            if (response.success) {
              this.isCreatTrue = true;
              this.$message({
                type: "success",
                message: ""
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
          updateCustomerUrl(this.$commonUtils.cleanNullAttr(this.postForm)).then(response => {
            this.loading = false;
            if (response.success) {
              this.isCreatTrue = true;
              this.$message({
                type: "success",
                message: response.message
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
                } else {
                  this.$message.error(response.message);
                }
              });
            }
          });
        }
      } else {
        if (!this.postForm.custId) {
          this.$refs[formName].validate(valid => {
            if (valid) {
              this.postForm.isOfficial=1
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
    handlePreview(file) {
      console.log(file);
      this.custContactFiledata.tokenID = this.token;
      this.custContactFiledata.custContactId = this.dfconFromData.custContactId;
      this.addCustomerFileData.tokenID = this.token;
      this.addCustomerFileData.custId = this.postForm.custId;
      this.addCustomerRequirementFileData.tokenID = this.token;
      this.addCustomerRequirementFileData.custId = this.postForm.custId;
      this.addCustomerRequirementFileData.ID = this.zsFromData.id;
      this.addCustomerRequirementFileData.indicateType = this.zsFromData.indicateType;

      this.addCustomerFileData.fileNames = file.name.substr(
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
      if (!this.dfconFromData.custContactId) {
        this.$message.error("请填写必填项");
        return false;
      } else {
        return true;
      }
    },
    // 获取各个select数据
    getAllSelectData() {
      console.log(this.seletDataArr, "00000");
      querycustSelectClass({ classId: this.seletDataArr }).then(response => {
        if (response.success) {
          this.seletData.mainLegalNature = response.data["1042"];
          this.seletData.customerSource = response.data["1"];
          this.seletData.statu = response.data["1044"];
          this.seletData.sex = response.data["1053"];
          this.seletData.lxstatu = response.data["1045"];
          this.seletData.called = response.data["1076"];
          this.seletData.hdstatu = response.data["1050"];
          this.seletData.hdtype = response.data["1049"];
          this.seletData.hdfs = response.data["1051"];
          this.seletData.zdfs = response.data["1052"];
          this.seletData.ywstuta = response.data["1112"];
          this.seletData.roleMessage = response.data["1063"];
          this.seletData.xzLevel = response.data["1048"];
          this.seletData.zfjgType = response.data["1037"];
        } else {
          this.$message.error(response.message);
        }
      });
      queryActivityListflUrl().then(response => {
        if (response.success) {
          this.seletData.activityList = response.data;
        } else {
          this.$message.error(response.message);
        }
      });
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

    remotepaternalUnitKh(query) {
      if (query !== "") {
        queryCustomersUrl({ name: query }).then(response => {
          if (response.success) {
            this.seletData.paternalUnitKh = response.data;
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
      console.log(newItem, "999");
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
          document.getElementById("khzs-title").scrollIntoView();
          break;
        case 6:
          document.getElementById("glgs-title").scrollIntoView();
          break;
        case 7:
          document.getElementById("lyct-title").scrollIntoView();
          break;
        case 8:
          document.getElementById("hy-title").scrollIntoView();
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
    resetFromData(type) {
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
            examineStatus: "1623",
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
            examineStatus: "1623",
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
          break;
        case "zs":
          this.zsFromData = {
            custId: "",

            indicateType: "",

            examineStatus: "1623",

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

          default:
            break;
        }
        this.resetFromData(type);
        this.dialogFormStatus = "create";
      }
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

        default:
          break;
      }

      this.dialogFormStatus = "update";
    },
    custAddrdel(row,index, type) {
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
    createCustAddr(type) {
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
            updateCustomerContacturl(tempData).then(response => {
              if (response.success) {
                for (const v of this.postForm.customerContacts) {
                  if (v.custContactId === this.dfconFromData.custContactId) {
                    const index = this.postForm.customerContacts.indexOf(v);
                    this.postForm.customerContacts.splice(
                      index,
                      1,
                      response.data.data
                    );

                    break;
                  }
                }

                this.dialogFormdfcon = false;
              } else {
                this.$message.error(response.message);
              }
            });
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
            e.custId = this.postForm.custId
          });
          if (!this.hdFromData.customerContactActs.length) {
            return this.$message.error('请添加对方联系人')
          }
          addActivityUrl(this.hdFromData).then(response => {
            if (response.success) {
              this.dialogFormhd = false;

              this.postForm.activities.push(response.data);
              console.log(this.postForm.activities, "+++");
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
        case "zs":
          break;
        default:
          break;
      }
    },
    updateCustAddr(type) {
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
          this.hdFromData.custId = this.postForm.custId;
          this.hdFromData.customerContactActs.forEach(e => {
            delete e.hdlx;
            e.custId = this.postForm.custId
          });
          if (!this.hdFromData.customerContactActs.length) {
            return this.$message.error('请添加对方联系人')
          }
          updateActivityUrl(this.hdFromData).then(response => {
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
                    this.wfconFromData
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

        default:
          break;
      }
    },
    addhdDftable(type) {
      switch (type) {
        case "dfcon":
          this.hdFromData.customerContactActs.push({
            custContactId: "",
            // custId: "",
            memo: "",
            hdlx: ""
          });

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
    handledeleElementhdwfcon(item) {
      const index = this.hdFromData.agencyContactActs.indexOf(item);
      this.hdFromData.agencyContactActs.splice(index, 1);
    },
    hdkhselect(vId, row) {
      var e = {};
      this.seletData.paternalUnitKh.forEach(ite => {
        if (ite.custId == vId) {
          e = ite;
          return;
        }
      });

      console.log(e);
      const index = this.hdFromData.customerContactActs.indexOf(row);
      this.hdFromData.customerContactActs[index].hdlx = e.customerContacts;
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
  /deep/ .postInfo-container-item {
    width: 100%;
  }
  /deep/ .el-form-item__label {
    background-color: #f9f9f9;
    width: 30%;
    text-align: center;
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
  }
  /deep/ .el-form-item__content {
    text-align: center;
    height: 30px;
  }
  .fullRow {
    /deep/ .el-form-item__label {
      width: 15%;
    }

    /deep/ .el-input,
    /deep/ .el-select {
      width: 85%;
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
</style>
