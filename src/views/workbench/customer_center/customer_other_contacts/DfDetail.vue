<template>
  <div class="createPost-container">

    <el-form ref="dfconFromData" :model="dfconFromData" :rules="dfconRules" size="mini" label-position="left" style="width: 100%;">
      <div class="form-con">
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
                      <span v-if="isLook">{{dfconFromData.custContactId}}</span>
                      <el-input v-else v-model="dfconFromData.custContactId" :disabled="true"></el-input>
                    </el-form-item>
                  </el-col>

                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item label="姓:" class="postInfo-container-item">
                      <span v-if="isLook">{{dfconFromData.firstname}}</span>
                      <el-input v-else v-model="dfconFromData.firstname"></el-input>
                    </el-form-item>
                  </el-col>

                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item label="姓名:" prop="name" class="postInfo-container-item">
                      <span v-if="isLook">{{dfconFromData.name}}</span>
                      <el-input v-else v-model="dfconFromData.name"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item label="性别:" prop="gender" class="postInfo-container-item">
                      <template>
                        <span v-if="isLook">{{dfconFromData.genderStr}}</span>
                        <el-select v-else default-first-option :clearable='true' placeholder="请选择" v-model="dfconFromData.gender" filterable>
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
                        <span v-if="isLook">{{dfconFromData.calledStr}}</span>
                        <el-select v-else default-first-option :clearable='true' placeholder="请选择" v-model="dfconFromData.called" filterable>
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
                      <div style="display: flex;flex-direction: column">
                        <div style="flex: 1">
                          <div v-if="isLook">
                            <div v-if="dfconFromData.photo && !iconIsDel" style="position: relative;display: flex;justify-content: center;" @mouseenter="showDelIcon" @mouseleave="hideDelIcon" >
                              <img :src="dfuserIconCust" class="avatar" />
                            </div>
                          </div>
                          <el-upload
                              v-else
                              name="attachFile"
                              :action='creatematerial'
                              ref='custContIconupload'
                              :data='custContIconSendData'
                              :on-success='dficonSendSuccess'
                              accept="image/jpeg,image/gif,image/png"
                              :before-upload="onBeforeUploadIcon"
                              :show-file-list="false"
                              :auto-upload='false'
                              :on-change="dfhandleAvatarChange"
                          >
                            <div v-if="dfconFromData.photo && !iconIsDel" style="position: relative" @mouseenter="showDelIcon"
                                 @mouseleave="hideDelIcon">
                              <img v-if="dfuserIconCust" :src="dfuserIconCust" class="avatar">
                              <div @click.stop="btnDelete()" class="mask" v-show="isShow"
                                   style="position:absolute; bottom: 0px; background-color: #000; opacity: 0.8; height: 20px; width: 100%">
                                <i class="el-icon-delete" style="position:absolute; left: 45%;bottom: 3px; color: #fff;"></i>
                              </div>
                            </div>
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                          </el-upload>
                          <!--                          <el-upload v-else :action='dfuserIconUrl' ref='custContIconupload' :data='custContIconSendData' :on-success='dficonSendSuccess' accept="image/jpeg,image/gif,image/png"-->
                          <!--                                     :before-upload="onBeforeUploadIcon" :show-file-list="false" :auto-upload='false' name='custContIcon' :on-change="dfhandleAvatarChange">-->
                          <!--                            <div v-if="dfconFromData.photo && !iconIsDel" style="position: relative" @mouseenter="showDelIcon" @mouseleave="hideDelIcon" >-->
                          <!--                              <img :src="dfuserIconCust" class="avatar">-->
                          <!--                              <div @click.stop="btnDelete()" class="mask" v-show="isShow"-->
                          <!--                                   style="position:absolute; bottom: 0px; background-color: #000; opacity: 0.8; height: 20px; width: 100%">-->
                          <!--                                <i class="el-icon-delete" style="position:absolute; bottom: 3px; color: #fff;" ></i>-->
                          <!--                              </div>-->
                          <!--                            </div>-->
                          <!--                            <i v-else="!dfconFromData.photo" class="el-icon-plus avatar-uploader-icon"></i>-->
                          <!--                          </el-upload>-->
                        </div>
                      </div>
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
                      <span v-if="isLook">{{dfconFromData.birthday}}</span>

                      <el-date-picker v-else v-model="dfconFromData.birthday" format='yyyy-MM-dd' value-format="yyyy-MM-dd" align="right" type="date" placeholder="选择日期" :picker-options="pickerOptions">
                      </el-date-picker>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row class="fullRow" v-if="!dfCreated">
                  <el-col :span="24">
                    <el-form-item label="所属单位:" prop="custId" class="postInfo-container-item">
                      <span v-if="isLook">{{dfconFromData.custName}}</span>
                      <el-select v-else default-first-option :clearable='true' v-model="dfconFromData.custId" no-match-text='暂无数据' loading-text='正在查询' filterable remote
                                 reserve-keyword placeholder="请输入关键词" :remote-method="remotepaternalUnit" >
                        <el-option v-for="(item,key) in seletData.paternalUnit" :key="key" :label="item.fullname" :value="item.custId">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row class="fullRow">
                  <el-col :span="24">
                    <el-form-item label="业务领域:" class="postInfo-container-item">

                      <span v-if="isLook">{{dfconFromData.bustype}}</span>
                      <el-input v-else v-model="dfconFromData.bustype"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row class="fullRow">
                  <el-col :span="24">
                    <el-form-item label="分支机构:" class="postInfo-container-item">

                      <span v-if="isLook">{{dfconFromData.branch}}</span>
                      <el-input v-else v-model="dfconFromData.branch"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="是否主要联系人:" prop="ismain" class="postInfo-container-item">
                      <span v-if="isLook">{{dfconFromData.ismain ? '是' : '否'}}</span>
                      <el-radio-group v-else v-model="dfconFromData.ismain">
                        <el-radio :label='true'>是</el-radio>
                        <el-radio :label='false'>否</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="是否账单联系人:" prop="isBillContact" class="postInfo-container-item">
                      <span v-if="isLook">{{dfconFromData.isBillContact ? '是' : '否'}}</span>
                      <el-radio-group v-else v-model="dfconFromData.isBillContact">
                        <el-radio :label='true'>是</el-radio>
                        <el-radio :label='false'>否</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="部门:" class="postInfo-container-item">
                      <span v-if="isLook">{{dfconFromData.department}}</span>
                      <el-input v-else v-model="dfconFromData.department"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="职务:" class="postInfo-container-item">
                      <span v-if="isLook">{{dfconFromData.jobtitle}}</span>
                      <el-input v-else v-model="dfconFromData.jobtitle"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row class="fullRow">
                  <el-col :span="24">
                    <el-form-item label="状态:" prop="status" class="postInfo-container-item">

                      <template>
                        <span v-if="isLook">{{dfconFromData.statusStr}}</span>
                        <el-select v-else default-first-option :clearable='true' placeholder="请选择" v-model="dfconFromData.status" filterable>
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
                        <span v-if="isLook">{{dfconFromData.sysStatusStr}}</span>
                        <el-select v-else default-first-option :clearable='true' placeholder="请选择" v-model="dfconFromData.sysStatus" filterable>
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

                      <span v-if="isLook">{{dfconFromData.isCollectbillMan ? '是' : '否'}}</span>
                      <el-radio-group v-else v-model="dfconFromData.isCollectbillMan">
                        <el-radio :label='1'>是</el-radio>
                        <el-radio :label='0'>否</el-radio>
                      </el-radio-group>

                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row class="fullRow">
                  <el-col :span="24">
                    <el-form-item label="标签:" class="postInfo-container-item">
                      <span v-if="isLook">{{dfconFromData.labels + ''}}</span>
                      <vue-tags-input
                          v-else
                          style="width: 50%"
                          allow-edit-tags
                          class="vue-tags-input"
                          v-model="dfconFromData.labelKey"
                          :tags="dfconFromData.labels&&dfconFromData.labels.map(item => ({text: item, classes: 'string'})) || []"
                          @tags-changed="changeTags"
                          placeholder="回车保存联系人标签"
                      >
                      </vue-tags-input>
                      <!--                      <span v-if="isLook">{{dfconFromData.isCollectbillMan ? '是' : '否'}}</span>-->
                      <!--                      <el-radio-group v-else v-model="dfconFromData.isCollectbillMan">-->
                      <!--                        <el-radio :label='1'>是</el-radio>-->
                      <!--                        <el-radio :label='0'>否</el-radio>-->
                      <!--                      </el-radio-group>-->

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
                      <span v-if="isLook">{{dfconFromData.tel}}</span>
                      <el-input v-else v-model="dfconFromData.tel"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row class="fullRow">
                  <el-col :span="24">
                    <el-form-item label="办公电话2:" class="postInfo-container-item">
                      <span v-if="isLook">{{dfconFromData.mobile2}}</span>
                      <el-input v-else v-model="dfconFromData.mobile2"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row class="fullRow">
                  <el-col :span="24">
                    <el-form-item label="移动电话:" class="postInfo-container-item">

                      <span v-if="isLook">{{dfconFromData.mobile1}}</span>
                      <el-input v-else v-model="dfconFromData.mobile1"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row class="fullRow">
                  <el-col :span="24">
                    <el-form-item label="住宅电话:" class="postInfo-container-item">

                      <span v-if="isLook">{{dfconFromData.phone2}}</span>
                      <el-input v-else v-model="dfconFromData.phone2"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row class="fullRow">
                  <el-col :span="24">
                    <el-form-item label="邮箱1:" class="postInfo-container-item">

                      <span v-if="isLook">{{dfconFromData.email}}</span>
                      <el-input v-else v-model="dfconFromData.email"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row class="fullRow">
                  <el-col :span="24">
                    <el-form-item label="邮箱2:" class="postInfo-container-item">

                      <span v-if="isLook">{{dfconFromData.email2}}</span>
                      <el-input v-else v-model="dfconFromData.email2"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row class="fullRow">
                  <el-col :span="24">
                    <el-form-item label="微信:" class="postInfo-container-item">

                      <span v-if="isLook">{{dfconFromData.wechat}}</span>
                      <el-input v-else v-model="dfconFromData.wechat"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row class="fullRow">
                  <el-col :span="24">
                    <el-form-item label="领英:" class="postInfo-container-item">

                      <span v-if="isLook">{{dfconFromData.linkedin}}</span>
                      <el-input v-else v-model="dfconFromData.linkedin"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row class="fullRow">
                  <el-col :span="24">
                    <el-form-item label="传真1:" class="postInfo-container-item">

                      <span v-if="isLook">{{dfconFromData.fax1}}</span>
                      <el-input v-else v-model="dfconFromData.fax1"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row class="fullRow">
                  <el-col :span="24">
                    <el-form-item label="即时通类型:" class="postInfo-container-item">

                      <span v-if="isLook">{{dfconFromData.msgType}}</span>
                      <el-input v-else v-model="dfconFromData.msgType"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row class="fullRow">
                  <el-col :span="24">
                    <el-form-item label="即时通账号:" class="postInfo-container-item">

                      <span v-if="isLook">{{dfconFromData.msgAccount}}</span>
                      <el-input v-else v-model="dfconFromData.msgAccount"></el-input>
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
                        <span v-if="isLook">{{dfconFromData.bossCustContactName}}</span>
                        <el-select v-else default-first-option :clearable='true' placeholder="请选择" v-model="dfconFromData.bossCustContactId" filterable>
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
                        <span v-if="isLook">{{dfconFromData.gxr1CustContactName}}</span>
                        <el-select v-else default-first-option :clearable='true' placeholder="请选择" v-model="dfconFromData.gxr1CustContactId" filterable>
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

                      <span v-if="isLook">{{dfconFromData.relat1}}</span>
                      <el-input v-else v-model="dfconFromData.relat1"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row class="fullRow">
                  <el-col :span="24">
                    <el-form-item label="关系人2名称:" class="postInfo-container-item">

                      <template>
                        <span v-if="isLook">{{dfconFromData.gxr2CustContactName}}</span>
                        <el-select v-else default-first-option :clearable='true' placeholder="请选择" v-model="dfconFromData.gxr2CustContactId" filterable>
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

                      <span v-if="isLook">{{dfconFromData.relat2}}</span>
                      <el-input v-else v-model="dfconFromData.relat2"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row class="fullRow">
                  <el-col :span="24">
                    <el-form-item label="关系人3名称:" class="postInfo-container-item">

                      <template>
                        <span v-if="isLook">{{dfconFromData.gxr3CustContactName}}</span>
                        <el-select v-else default-first-option :clearable='true' placeholder="请选择" v-model="dfconFromData.gxr3CustContactId" filterable>
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

                      <span v-if="isLook">{{dfconFromData.relat3}}</span>
                      <el-input  v-else v-model="dfconFromData.relat3"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row class="fullRow">
                  <el-col :span="24">
                    <el-form-item label="来源人:" class="postInfo-container-item">

                      <span v-if="isLook">{{dfconFromData.infoFromStaff}}</span>
                      <el-input v-else v-model="dfconFromData.infoFromStaff"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row class="fullRow">
                  <el-col :span="24">
                    <el-form-item label="来源场合:" class="postInfo-container-item">

                      <span v-if="isLook">{{dfconFromData.infoFromPlace}}</span>
                      <el-input v-else v-model="dfconFromData.infoFromPlace"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row class="fullRow">
                  <el-col :span="24">
                    <el-form-item label="来源时间:" class="postInfo-container-item">

                      <span v-if="isLook">{{dfconFromData.infoFromDate}}</span>
                      <el-date-picker v-else v-model="dfconFromData.infoFromDate" format='yyyy-MM-dd' value-format="yyyy-MM-dd" align="right" type="date" placeholder="选择日期" :picker-options="pickerOptions">
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

                      <span v-if="isLook">{{dfconFromData.routineAct}}</span>
                      <el-input v-else v-model="dfconFromData.routineAct"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row class="fullRow">
                  <el-col :span="24">
                    <el-form-item label="常规活动备注:" class="postInfo-container-item">

                      <span v-if="isLook">{{dfconFromData.routineActMemo}}</span>
                      <el-input v-else v-model="dfconFromData.routineActMemo"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row class="fullRow">
                  <el-col :span="24">

                    <el-form-item label="联系人文档:" class="postInfo-container-item uploader-custfile">
                      <template>
                        <div v-if="isLook" style="display:flex;flex-direction: column">
                          <div v-for="item in materialList" @click="onPreview(item)">
                            <span class="pointer">{{ item.materialName }}</span>
                          </div>
                        </div>

                        <el-upload
                            v-if="!isLook"
                            style="width: 50%;"
                            ref="upload"
                            class="upload-demo"
                            drag
                            multiple
                            name="attachFile"
                            :data="custContactFiledata"
                            :action="creatematerial"
                            :before-upload="handlePreview"
                            :on-remove="(file,fileList) => handleRemove(file,fileList)"
                            :file-list="materialList"
                            :on-preview="onPreview"
                            :on-success="onsuccess"
                        >
                          <i class="el-icon-upload"></i>
                          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                        </el-upload>

                        <!--                        <el-upload v-if="!isLook" drag class="upload-demo" name="custContactFile" :data='custContactFiledata' ref="uploadcustContactFile" :action="custContactFileUrl" :before-upload="handlePreview"-->
                        <!--                           :on-remove="handleRemove" :on-success="onsuccess" :file-list="dfconFromData.materialList" :auto-upload="true">-->
                        <!--&lt;!&ndash;                          <i class="el-icon-upload"></i>&ndash;&gt;-->
                        <!--                          <div style="height: 60px;line-height: 60px;" class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>-->
                        <!--&lt;!&ndash;                          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>&ndash;&gt;-->
                        <!--&lt;!&ndash;                          <el-button style="margin-left: 10px;" size="small" type="success" @click="addCustomerFile('dffile')">&ndash;&gt;-->
                        <!--&lt;!&ndash;                            上传</el-button>&ndash;&gt;-->

                        <!--                        </el-upload>-->
                      </template>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row class="fullRow">
                  <el-col :span="24">
                    <el-form-item label="备注:" class="postInfo-container-item uploader-custfile">
                      <template>
                        <span v-if="isLook">{{dfconFromData.memo}}</span>
                        <el-input v-else type="textarea" :rows="2" placeholder="请输入内容" v-model="dfconFromData.memo">
                        </el-input>
                      </template>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <el-row>
              <el-col class="tilteSpan" :span="24">
                <span id=''>对方联系人-地址</span>
                <el-select v-if="!isLook" style="width: 60%;" default-first-option :clearable='true' placeholder="请选择" size="mini" multiple @change="dfdzchange" collapse-tags v-model="dfdzlist" filterable>
                  <el-option disabled label="" value="-1">
                    <span v-for="(itmx,key) in ['中文地址','英文地址','抬头']" v-if="key!='id'">
                     {{itmx}}
                    </span>
                  </el-option>
                  <el-option v-for="(itm,idx) in seletData.dfkhdzlist" :key="itm.addrId" :label="`${[itm.addressCn,itm.addressEn,itm.title].filter(i=>!!i).join(' ; ')}`" :value="itm.addrId">
                    <el-tooltip v-for="(itmx,key) in seletData.dfkhdzlist[idx]" v-if="['title','addressCn','addressEn'].includes(key)" class="item" effect="light" :content="itmx" placement="top">
                      <span>{{itmx}}</span>
                    </el-tooltip>
                  </el-option>
                  <!--                  <el-option v-for="(item,key) in seletData.dfkhdzlist" :key="key" :label="`${[item.title,item.addressCn,item.addressEn].filter(i=>!!i).join(' ; ')}`" :value="item.addrId">-->
                  <!--                  </el-option>-->
                </el-select>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="24">
                <el-button type="primary"  size="mini" style="float:right" v-if="dfconFromData.customerContactAddArray.length>3&&dfconFromData.customerContactAddArray.filter((item,index)=>index<=customerContactLimit).length<dfconFromData.customerContactAddArray.length" @click="customerContactLimit=dfconFromData.customerContactAddArray.length">全部</el-button>
                <el-table size="mini" :data="dfconFromData.customerContactAddArray.filter((item,index)=>index<=customerContactLimit)" border fit empty-text="暂无数据" highlight-current-row current-row-key style="width: 100%;">
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

                </el-table>
              </el-col>
            </el-row>
            <el-row>
              <el-col class="tilteSpan" :span="24">
                <span id=''>对方联系人-我方联系人</span>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24" style='text-align:right'>
                <el-button type="primary"  size="mini" style="margin-left:10px;float:right" v-if="!isLook&&dfconFromData.customerContactAgencyContacts.length>3&&dfconFromData.customerContactAgencyContacts.filter((item,index)=>index<=customerContactAgencyLimit).length<dfconFromData.customerContactAgencyContacts.length" @click="customerContactAgencyLimit=dfconFromData.customerContactAgencyContacts.length">全部</el-button>
                <el-button v-if="!isLook" type="primary" size="mini" @click="addFormShow('dfwfcon')">添加
                </el-button>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">

                <el-table :data="dfconFromData.customerContactAgencyContacts.filter((item,index)=>index<=customerContactAgencyLimit)" border fit empty-text="暂无数据" highlight-current-row current-row-key style="width: 100%;">
                  <el-table-column type="index" width="50" label="序号" align="left"></el-table-column>
                  <el-table-column label="姓名" align="left" width>
                    <template slot-scope="scope">
                      <span>{{ scope.row.userName }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="业务领域" align="left" width>
                    <template slot-scope="scope">
                      <span>{{ scope.row.business }}</span>
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

                  <el-table-column v-if="!isLook" label="操作" align="left" width="" class-name="small-padding fixed-width">
                    <template slot-scope="scope">

                      <el-button size="mini" type="text" @click="custAddrupdata(scope.row,'dfwfcon')">修改</el-button>
                      <el-button size="mini" type="text" @click="custAddrdel(scope.row,'dfwfcon',scope.$index)">删除</el-button>

                    </template>
                  </el-table-column>
                </el-table>
              </el-col>
            </el-row>
            <el-row v-allow="16">
              <el-col class="tilteSpan" :span="24">
                <span id=''>对方联系人-活动</span>
              </el-col>
            </el-row>

            <el-row v-allow="16">
              <el-col :span="24">
                <el-table size="mini" :data="dfconFromData.activities" border fit empty-text="暂无数据" highlight-current-row current-row-key style="width: 100%;">
                  <el-table-column type="index" width="50" label="序号" align="left"></el-table-column>
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

                </el-table>
              </el-col>
            </el-row>
          </el-col>

        </el-row>
        <el-dialog :show-close="false" :close-on-click-modal="false" title="添加对方联系人-我方联系人" :visible.sync="dialogFormdfwfcon" width="70%" append-to-body>
          <el-form :model="dfwfconFromData" label-position="left" style="width: 100%;">
            <el-row class="form-border">
              <el-col :span="24">

                <el-row class="fullRow">
                  <el-col :span="24">
                    <el-form-item label="姓名:" class="postInfo-container-item">
                      <template>
                        <el-select default-first-option :clearable='true' @change="wfUserNamechange" placeholder="请选择" v-model="dfwfconFromData.userId" filterable>
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
                        <el-select default-first-option :clearable='true' placeholder="请选择" v-model="dfwfconFromData.business" filterable>
                          <el-option v-for="item in seletData.ywstuta" :key="String(item.typeName)" :label="item.typeName" :value="String(item.typeName)">
                          </el-option>
                        </el-select>
                      </template>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row class="fullRow">
                  <el-col :span="24">
                    <el-form-item label="职位:" class="postInfo-container-item">

                      <el-input type="text" :disabled="true" placeholder="" v-model="dfwfconFromData.position">
                      </el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row class="fullRow">
                  <el-col :span="24">
                    <el-form-item label="角色描述:" class="postInfo-container-item">
                      <template>
                        <el-select default-first-option :clearable='true' placeholder="请选择" v-model="dfwfconFromData.userrole" filterable>
                          <el-option v-for="(item,key) in seletData.roleMessage" :key="key" :label="item.typeName" :value="item.typeName">
                          </el-option>
                        </el-select>
                      </template>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row class="fullRow">
                  <el-col :span="24">
                    <el-form-item label="开始日期:" class="postInfo-container-item">
                      <el-date-picker v-model="dfwfconFromData.startdate" format='yyyy-MM-dd' value-format="yyyy-MM-dd" align="right" type="date" placeholder="选择日期" :picker-options="pickerOptions">
                      </el-date-picker>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row class="fullRow">
                  <el-col :span="24">
                    <el-form-item label="截止日期:" class="postInfo-container-item">
                      <el-date-picker v-model="dfwfconFromData.enddate" format='yyyy-MM-dd' value-format="yyyy-MM-dd" align="right" type="date" placeholder="选择日期" :picker-options="pickerOptions">
                      </el-date-picker>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row class="fullRow">
                  <el-col :span="24">
                    <el-form-item label="备注:" class="postInfo-container-item uploader-custfile">
                      <template>
                        <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="dfwfconFromData.memo">
                        </el-input>
                      </template>
                    </el-form-item>
                  </el-col>
                </el-row>

              </el-col>
            </el-row>

          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormdfwfcon = false">
              取消
            </el-button>
            <el-button type="primary" @click="dialogFormStatus==='create'?createdfwfCustAddr('dfwfcon'):updatedfwfCustAddr('dfwfcon')">
              确定
            </el-button>
          </div>
        </el-dialog>
        <el-row v-if="!id && !custId && !isDialog">
          <el-col :span="24" style="text-align:center">
            <el-form-item>
              <el-button size="medium" type="primary" v-if="!isEdit&&!isLook" @click="createCustAddr('dfcon')">创建对方联系人
              </el-button>
              <el-button size="medium" type="primary" v-if="isEdit&&!isLook" @click="createCustAddr('dfcon')">保存修改
              </el-button>

              <el-button style="margin-left:100px" @click="cancel" type="primary" size="medium">取消</el-button>

            </el-form-item>
          </el-col>

        </el-row>
      </div>
    </el-form>

  </div>
</template>

<script>
import {creatematerial} from "@/api/ipServiceApi.config";
import VueTagsInput from '@johmun/vue-tags-input'
import {
  querycustSelectClass,
  queryCustomerNameId,
  queryUserByPermissionId,
  queryCountry,
  queryCustomerContactCustIdUrl,
  addCustomerContactUrl,
  updateCustomerContacturl,
  delCustomerContacturl,
  queryCustomersUrl,
  querywfUserNameUrl,
  allocationCustomerUrl,
  delAgencyContactUrl,
  updateAgencyContactUrl,
  queryCustomerUrl,
  updateCustomerUrl,
  queryCustomerContactUrl,
  queryCaseByUserUrl,
  addCustomerContactAgencyUrl,
  queryCustomerContactAgencyUrl,
  updateCustomerContactAgencyUrl,
  delCustomerContactAgencyUrl,
  deleteCustomerContactIcon,
  queryCustomerAddrListUrl, delCustContactDoc, delActivityFile
} from "@/api/customerList";
import serviceApi from "@/api/serviceApi.config.js";
import { mapGetters } from "vuex";
import { truncate, truncateSync } from "fs";
import Vue from "vue";
import {getProgID} from "@/utils/editInOffice";
export default {
  name: "DfDetail",
  computed: {
    ...mapGetters(["token", "name"])
  },
  components: {VueTagsInput},
  props: {
    isDialog: {
      default: false,
      type: Boolean
    },
    pageType: {
      type: String,
      default: 'isCustomer'
    },
    dfCreated: {
      type: Boolean,
      default: false
    },
    isLook: {
      type: Boolean,
      default: false
    },
    id:{
    },
    custId: {},
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      materialList: [],
      creatematerial,
      iconIsDel: false,
      isShow: false,
      dfdzlist: [],
      defaultParams: {
        // 級聯菜單默認
        value: "caseTypeId",
        label: "caseType",
        children: "childrens",
        checkStrictly: false
      },
      caseTypeOptions: [], // 案件类型集合
      dfuserIconCust: "",
      dialogFormStatus: "",
      dialogFormdfwfcon: false,
      customerContactLimit:2,
      customerContactAgencyLimit:2,
      dfwfconFromData: {
        custContactId: "",
        position: "",
        userId: "",
        custContIcon: "",
        custContactAgencyContactId: "",

        memo: "",

        userrole: "",

        business: "",

        startdate: "",

        enddate: ""
      },

      zsfileUploadbool: false,
      isCreatTrue: false,
      creatAddrForm: {},
      stepActive: 0,

      loading: false,

      dfconRules: {
        name: [
          {
            required: true,
            trigger: "change",
            message: "请填写姓名"
          }
        ],
        custId: [
          {
            required: true,
            trigger: "change",
            message: "请填写所属单位"
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

      dfuserIconUrl: serviceApi.addCustomerContactIcon,

      custContIconSendData: {
        tokenID: "",
      },

      custContactFileUrl: serviceApi.addCustomerContactFileurl,
      custContactFiledata: {
        tokenID: this.token,
        materialTypeId: 301624
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
      seletDataArr: "1129,1042,1,1044,1053,1045,1076,1112,1063",
      seletData: {
        dfkhdzlist: [],
        comLanguage: {}, //沟通语言
        mainLegalNature: {}, //主法律性质
        customerSource: {}, //客户来源
        paternalUnit: {}, //父单位
        paternalUnitKh: {}, //kh
        wfuserNames: {},
        censor: {},
        roleMessage: [],
        ywstuta: [],
        ctDataOption: [],
        statu: {},
        sex: {},
        lxstatu: {},
        called: {},
        dfcon: {}
      },

      // 添加对方联系人相关属性-->
      dfconFromData: {
        labelKey: '',
        examineStatus: "1623",
        custId: "",
        custContactId: "",
        firstname: "",
        name: "",
        gender: "",
        custContIcon: "",
        custContactFile: [],
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
        routineActMemo: "",
        customerContactAddArray: [],
        customerContactAgencyContacts:[],
        photo: ''
      }
    };
  },
  created() {
    this.getAllSelectData();
    window.addEventListener("scroll", this.handleScroll);
    if (this.isEdit || this.isLook) {
      const id = this.id || this.$route.params && this.$route.params.id;
      this.fetchData(id);
      this.custId && this.queryCustData()
    } else {
      // addCustomerContactUrl().then(response => {
      //   if (response.success) {
      //     this.dfconFromData.custContactId = response.data.data.custContactId;
      //     this.dfconFromData.custId = response.data.data.custId;
      //     this.dfdzlist = this.dfconFromData.customerContactAddArray.map(
      //       item => item.addrId
      //     );
      //     queryCustomerAddrListUrl({ custId: this.dfconFromData.custId }).then(
      //       response => {
      //         if (response.success) {
      //           this.seletData.dfkhdzlist = response.data;
      //         } else {
      //           this.$message.error(response.message);
      //         }
      //       }
      //     );
      //   } else {
      //     this.$message.error(response.message);
      //   }
      // });
    }
  },
  watch: {
    "addrFromData.ctData": function(data, oldval) {
      this.addrFromData.country = data[0];
      this.addrFromData.province = data[1];
      this.addrFromData.city = data[2];

      this.addrFromData.continent = this.getcontinent(data[0]);

    }
  },
  methods: {
    downLoad(data) {
      const url = data.address || data.url
      const downData = {
        url: `ipdoc${url}`,
        success() {
        }
      }
      if (data.mailId) {
        downData.downLoad = data.materialName
      }
      this.$commonUtils.downLoadAll(downData)
    },
    onPreview(data) {
      if (data.raw) {
        data = data.response.data[0]
      }
      let url = data.address || data.url
      if (getProgID(url) || ['eml', 'msg'].includes(url.replace(/.+\./, '').toLocaleLowerCase())) {
        if (['doc', 'docx'].includes(url.replace(/.+\./, "").toLocaleLowerCase())) {
          this.$commonUtils.viewPdf(`${url}`)
        } else {
          let flag = ''
          if (data.mailId) {
            flag = 'mailId'
          } else if (data.materialId) {
            flag = 'materialId'
          }
          url = url.replace(/&/g, '%26')
          window.open(`#/preView?address=ipdoc${url}&${flag}=${data[flag]}`.replace(/[+]/g, '%2B'))
        }
      } else if (['pdf', 'jpg', 'png'].some(item => url.replace(/.+\./, "").toLocaleLowerCase() == item)) {
        window.open(`/ipdoc${url}`.replace(/[+]/g, '%2B'))
      } else {
        this.downLoad(data)
      }
    },
    async createDfContact() {
      const [ err, data] = await this.$commonUtils.awaitWrap(this.$refs.dfconFromData.validate())
      if (!data) {
        this.$message.error('请填写必填项')
        return
      }
      this.dfconFromData.materialList && this.dfconFromData.materialList.forEach(item => {
        if (typeof item.status !== 'number') {
          item.status = undefined
        }
      })
      addCustomerContactUrl(this.dfconFromData).then(res => {
        this.$message.success('新建成功!')
        this.$emit('updateCustomerContact')
      })
    },
    changeTags(newTags) {
      this.dfconFromData.labels = newTags.map(item => item.text)
    },
    showDelIcon() {
      this.isShow = true;
    },
    hideDelIcon() {
      this.isShow = false;
    },
    btnDelete() {
      console.log(111);
      this.$confirm(`确认是否删除照片？`, '删除', {
        confirmButtonText: '确定',
        type: "warning"
      }).then(() => {
        deleteCustomerContactIcon({custContactId: this.dfconFromData.custContactId}).then((req) => {
          this.iconIsDel = true;
          let msg = req.message;
          this.$message({
            type: 'success',
            message: msg
          })
        })
      })
    },
    cancel(){
      if(this.isEdit){
        this.$router.go(-1)
      }else {
        delCustomerContacturl({custContactId: this.dfconFromData.custContactId}).then(res=>{
          this.$router.go(-1)
        })
      }

    },
    delCustomerContact() {
      delCustomerContacturl({custContactId: this.dfconFromData.custContactId})
    },
    queryCustData() {
      this.dfconFromData.custId = this.custId
      queryCustomerNameId({
        [this.pageType]: "1",
        custId: this.custId,
        // keyword: this.dfconFromData.custName
      }).then(response => {
        this.seletData.paternalUnit = response.data;
      });
      queryCustomerAddrListUrl({
        custId: this.custId
      }).then(response => {
        if (response.success) {
          this.seletData.dfkhdzlist = response.data;
        } else {
          this.$message.error(response.message);
        }
      });
    },
    fetchData(id) {
      id && queryCustomerContactUrl({ custContactId: id })
          .then(response => {
            this.dfconFromData = response.data;
            this.materialList = JSON.parse(JSON.stringify(this.dfconFromData.materialList || []))
            // this.dfconFromData.status = +this.dfconFromData.status || ''
            this.$set(this.dfconFromData, 'status', +this.dfconFromData.status || '')
            this.dialogFormOpen('dfcon');
            this.dfdzlist = this.dfconFromData.customerContactAddArray.map(
                item => item.addrId
            );
            if (this.dfconFromData.custId) {
              queryCustomerNameId({
                [this.pageType]: "1",
                custId: this.dfconFromData.custId,
                // keyword: this.dfconFromData.custName
              }).then(response => {
                this.seletData.paternalUnit = response.data;
              });
              if (this.dfconFromData.custId) {
                queryCustomerAddrListUrl({
                  custId: this.dfconFromData.custId
                }).then(response => {
                  if (response.success) {
                    this.seletData.dfkhdzlist = response.data;
                  } else {
                    this.$message.error(response.message);
                  }
                });
              }
              if (this.dfconFromData.photo) {
                this.dfuserIconCust = `/ipdoc${this.dfconFromData.photo}`;
              }
            }
          })
          .catch(err => {
            console.log(err);
          });
    },
    addFormShow(type) {
      switch (type) {
        case "dfwfcon":
          if (this.dfconFromData.custContactId) {
            this.dialogFormdfwfcon = true;
          } else {
            this.$message.error("请填写必填项");
          }

          break;

        default:
          break;
      }
      this.resetFromData(type);
      this.dialogFormStatus = "create";
    },
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
            custContactFile: [],
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
            routineActMemo: "",
            customerContactAgencyContacts: []
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
        case "wfcon":
          this.wfconFromData = {
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
          };
          break;
        case "dfwfcon":
          this.dfwfconFromData = {
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
          };
          break;

        default:
          break;
      }
    },
    dfhandleAvatarChange(file, fileList) {
      // if (this.isdfItemTrue()) {
      //   this.$set(this.dfconFromData, 'photo', URL.createObjectURL(file.raw))
      //   // this.dfconFromData.photo = URL.createObjectURL(file.raw);
      //   this.dfuserIconCust = URL.createObjectURL(file.raw);
      //   this.$refs.custContIconupload.submit();
      // }
      this.dfuserIconCust = URL.createObjectURL(file.raw);
      this.$refs.custContIconupload.submit();
    },
    onBeforeUploadIcon(file) {
      this.custContIconSendData.tokenID = this.token;
      this.custContIconSendData.materialTypeId = 301623;
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
        this.iconIsDel = false
        this.dfconFromData.photo = response.data[0].address
        this.$message.success(response.message)
      } else {
        this.$message.error(response.message)
        this.dfconFromData.photo = ''
      }
    },

    creatLsCust(formName) {
      if (formName == "dfconFromData") {
        if (this.dfconFromData.custId) {
          queryCustomerAddrListUrl({ custId: this.dfconFromData.custId }).then(
              response => {
                if (response.success) {
                  this.seletData.dfkhdzlist = response.data;
                } else {
                  this.$message.error(response.message);
                }
              }
          );
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
      }
    },
    onsuccess(response, file, fileList) {
      const data = response.data[0] || {}
      data.name = data.materialName
      if (!this.dfconFromData.materialList) {
        this.dfconFromData.materialList = []
      }
      this.dfconFromData.materialList.push(response.data[0])
    },
    handleRemove(file, fileList) {
      let delmaterialId
      if (file.response) {
        delmaterialId = file.response.data[0].materialId
      } else {
        delmaterialId = file.materialId
      }
      delCustContactDoc({
        materialId: delmaterialId
      }).then(res => {
        this.$message.success('删除成功!')
        this.dfconFromData.materialList.splice(this.dfconFromData.materialList.findIndex(item => item.materialId == delmaterialId), 1)
      })
    },
    handlePreview(file) {
      this.custContactFiledata.tokenID = this.token
      this.custContactFiledata.materialTypeId = 301624
    },
    //<--添加客户文件
    //-->提示
    isItemTrue(item) {
      if (!this.dfconFromData[item]) {
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
          this.seletData.comLanguage = response.data["1129"];
          this.seletData.mainLegalNature = response.data["1042"];
          this.seletData.customerSource = response.data["1"];
          this.seletData.statu = response.data["1044"];
          this.seletData.sex = response.data["1053"];
          this.seletData.lxstatu = response.data["1045"];
          this.seletData.called = response.data["1076"];
          this.seletData.ywstuta = response.data["1112"];
          this.seletData.roleMessage = response.data["1063"];
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
      querywfUserNameUrl().then(response => {
        if (response.success) {
          this.seletData.wfuserNames = response.data;
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
          this.dfconFromData.custId && queryCustomerContactCustIdUrl({
            customerId: this.dfconFromData.custId
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
        queryCustomerNameId({ keyword: query, appBelongUnit: 1 }).then( // appBelongUnit:是否客户联系人所属单位，任务5797 注意改参数跟isCustomer互斥
            response => {
              if (response.success) {
                this.seletData.paternalUnit = response.data;
              } else {
                this.$message.error(response.message);
              }
            }
        );
      }
    },
    wfUserNamechange(id) {
      var e = {};
      this.seletData.wfuserNames.forEach(ite => {
        if (ite.userId == id) {
          e = ite;
          return;
        }
      });
      this.dfwfconFromData.position = e.positionStr;
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

    validate(){
      return this.$commonUtils.formValidate(this.$refs['dfconFromData'])
    },
    // 表格项-->
    async createCustAddr(type) {
      const [ err, data] = await this.$commonUtils.awaitWrap(this.$refs.dfconFromData.validate())
      if (!data) {
        this.$message.error('请填写必填项')
        return
      }

      if (this.isdfItemTrue()) {
        const tempData = Object.assign({}, this.dfconFromData);
        // delete tempData.activities;
        // delete tempData.photo;
        // delete tempData.materialList;
        delete tempData.education;
        delete tempData.experience;
        tempData.materialList && tempData.materialList.forEach(item => {
          if (typeof item.status !== 'number') {
            item.status = undefined
          }
        })
        updateCustomerContacturl(tempData).then(response => {
          if (response.success) {
            if(this.id){
              this.$message.success(response.message)
              this.$emit('updateCustomerContact',response)
            } else {
              this.$router.go(-1);
            }
          } else {
            this.$message.error(response.message);
          }
        });
      }
    },
    createdfwfCustAddr(type) {
      switch (type) {
        case "dfwfcon":
          this.dfwfconFromData.custContactId = this.dfconFromData.custContactId;
          console.log(this.dfconFromData, "===");
          addCustomerContactAgencyUrl(this.dfwfconFromData).then(response => {
            if (response.success) {
              this.dialogFormdfwfcon = false;
              this.dfconFromData.customerContactAgencyContacts.push(
                  response.data
              );
            } else {
              this.$message.error(response.message);
            }
          });
          break;

        default:
          break;
      }
    },
    custAddrupdata(row, type) {
      switch (type) {
        case "addr":
          queryCustomerAddrUrl({ addrId: row.addrId }).then(res => {
            this.addrFromData = res.data;
            Vue.set(this.addrFromData, "ctData", []);
            this.addrFromData.ctData = [
              this.addrFromData.country,
              this.addrFromData.province,
              this.addrFromData.city
            ];
          });
          this.dialogFormAddr = true;
          break;
        case "dfcon":
          queryCustomerContactUrl({ custContactId: row.custContactId }).then(
              res => {
                this.dfconFromData = res.data;
                this.dfconFromData.status = +this.dfconFromData.status || ''
                this.dialogFormdfcon = true;
              }
          );

          break;
        case "hd":
          queryActivityOneUrl({ custActId: row.custActId }).then(res => {
            this.hdFromData = res.data;
            this.dialogFormhd = true;
          });

          break;
        case "wfcon":
          queryAgencyContactUrl({ agencyContactId: row.agencyContactId }).then(
              res => {
                this.wfconFromData = res.data;
                this.dialogFormwfcon = true;
              }
          );

          break;
        case "dfwfcon":
          queryCustomerContactAgencyUrl({
            custContactAgencyContactId: row.custContactAgencyContactId
          }).then(res => {
            this.dfwfconFromData = res.data;
            this.dialogFormdfwfcon = true;
          });

          break;
        case "zs":
          queryCustomerRequirementUrl({
            indicateType: row.indicateType,
            id: row.id
          }).then(res => {
            this.zsFromData = res.data;
            this.dialogFormzs = true;
          });

          break;

        default:
          break;
      }

      this.dialogFormStatus = "update";
    },
    custAddrdel(row, type,index) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
          .then(() => {
            switch (type) {
              case "dfwfcon":
                delCustomerContactAgencyUrl({
                  custContactAgencyContactId: row.custContactAgencyContactId
                }).then(response => {
                  if (response.success) {
                    // const index = this.dfconFromData.customerContactAgencyContacts.indexOf(
                    //   row
                    // );
                    this.dfconFromData.customerContactAgencyContacts.splice(
                        index,
                        1
                    );
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

    updatedfwfCustAddr(type) {
      switch (type) {
        case "dfwfcon":
          const tempData21 = Object.assign({}, this.dfwfconFromData);
          delete tempData21.photo
          updateCustomerContactAgencyUrl(tempData21).then(response => {
            if (response.success) {
              for (const v of this.dfconFromData
                  .customerContactAgencyContacts) {
                if (
                    v.custContactAgencyContactId ===
                    this.dfwfconFromData.custContactAgencyContactId
                ) {
                  const index = this.dfconFromData.customerContactAgencyContacts.indexOf(
                      v
                  );
                  this.dfconFromData.customerContactAgencyContacts.splice(
                      index,
                      1,
                      response.data
                  );

                  break;
                }
              }

              this.dialogFormdfwfcon = false;
            } else {
              this.$message.error(response.message);
            }
          });
          break;

        default:
          break;
      }
    },
    dfdzchange(val) {
      // var e = [];
      // val.forEach(item => {
      //   this.seletData.dfkhdzlist.forEach(ite => {
      //     if (ite.title == item) {
      //       e.push(ite);
      //     }
      //   });
      // });
      this.dfconFromData.customerContactAddArray = this.seletData.dfkhdzlist.filter(item=>this.dfdzlist.includes(item.addrId));
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
    .el-form-item__content {
      height: 100%;
      display: flex;
      align-items: center;
      .el-radio-group {
        height: 28px;
        display: flex;
        align-items: center;
        padding-left: 15px;
      }
    }
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
    .el-form-item__error{
      position: relative;
      left: 0;
      top: -100%;
    }
    /*height: 30px;*/
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
.el-scrollbar li {
  display: flex;
  span {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    border-right: 1px solid #f4f4f5;
    border-bottom: 1px solid #f4f4f5;
  }
}
</style>
