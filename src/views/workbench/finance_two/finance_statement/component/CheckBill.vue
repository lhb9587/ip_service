<template>
  <div>
    <el-form class="form-container" size="small" :model="checkBillData">
      <el-row class="first-row" style="margin-bottom: 5px">
        <el-col :span="16">
          <el-form-item label="案件文号:" label-width="150px" class="postInfo-container-item"><div style="max-width: 250px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" :title="checkBillData.showRefno">{{checkBillData.showRefno}}</div>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="状态:" label-width="150px" class="postInfo-container-item">{{checkBillData.wfStatus}}
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="box-border">
      <div class="divider" v-if="checkBillType !== '查看' || checkBillType == '查看'&&fileList.length">
        <span>
            附件管理
        </span>
      </div>
      <!--      <div class="box-border" style="height: 100px;"></div>-->
      <div class="model_wrap" v-if="checkBillType !== '查看' || checkBillType == '查看'&&fileList.length">
        <!--        <div class="divider"><span>附件</span></div>-->
        <div class="uploadwrap" :style="{'height': '100%','background':hoverState?'RGBA(32,159,255,0.06)':'#fff','overflow':'auto','padding':'20px'}" v-if="checkBillType == '查看'">
          <p @mouseover="sign = file.materialId" @mouseleave="sign = ''" class="bg-hover"
             style="display: flex;align-items: center; height: 26px;line-height: 26px;cursor: pointer"
             v-for="(file, index) in fileList"
             :key="file.materialId">
            <span class="single" style="flex:1;display: flex;align-items: center">
              <i class="el-icon-document"></i><span style="flex: 1" class="single" @click="preView(file)">{{file.materialName}}</span>
            </span>
            <i v-if="sign == file.materialId" class="el-icon-download" style="color: #67C23A"
               @click="downLoad(file)"></i>
            <i v-else class="el-icon-circle-check" style="color: #67C23A"></i>
          </p>
        </div>
        <div class="uploadwrap"
             v-else
             :style="{'height': '100%','background':hoverState?'RGBA(32,159,255,0.06)':'#fff','overflow':'auto','padding':'20px'}"
             @drop.stop.prevent="enentDrop($event)"
             @dragover.stop.prevent="hoverState=true"
             @dragleave.stop.prevent="hoverState=false"
             @dragenter.stop.prevent="hoverState=true">
          <div style="text-align: center;margin-bottom: 10px">
            <span style="font-size: 12px;">将文件拖放到此处以添加附件，或者<span style="color: #409EFF;cursor: pointer;"
                                                                 @click="clickUpload=true">浏览</span></span>
          </div>

          <uploadFile :clickUpload="clickUpload" @getUploadFile="getUploadFile"
                      @changeClick="clickUpload=false"></uploadFile>
          <p @mouseover="sign = file.materialId" @mouseleave="sign = ''" class="bg-hover"
             style="display: flex;align-items: center; height: 26px;line-height: 26px;cursor: pointer"
             v-for="(file, index) in fileList"
             :key="file.materialId">
            <span class="single" style="flex:1;display: flex;align-items: center">
              <i class="el-icon-document"></i><span style="flex: 1" class="single" @click="preView(file)">{{file.materialName}}</span>
            </span>
            <i v-if="sign == file.materialId && checkBillType !== '查看'" class="el-icon-close" style="color: #67C23A"
               @click="delFile(file)"></i>
            <i v-if="sign == file.materialId" class="el-icon-download" style="color: #67C23A"
               @click="downLoad(file)"></i>
            <i v-else class="el-icon-circle-check" style="color: #67C23A"></i>
          </p>

          <!--          <div class="fileWarp" v-if="fileList.length">-->
          <!--            <div class="file_item" v-for="item in fileList">-->
          <!--              <div style="display: flex;justify-content: left">-->
          <!--                <svg-icon class="svg-icon" :icon-class="$commonUtils.getSuffixFile(item.address)"/>-->
          <!--                <div style="display: flex;flex-direction: column;justify-content: space-between">-->
          <!--                  <i class="el-icon-view" style="color: #727477;font-size: 16px;cursor: pointer;margin-right: 5px;"-->
          <!--                     @click="preView(item)"></i>-->
          <!--                  <i v-if="$store.getters.userId == checkBillData.creator" class="el-icon-delete"-->
          <!--                     style="font-size: 16px;cursor: pointer;margin-right: 5px" @click="delFile(item)"></i>-->
          <!--                  <i v-if="$store.getters.userId == checkBillData.creator" class="el-icon-edit"-->
          <!--                     style="margin-right: 10px;font-size: 16px;cursor: pointer" @click="doEditInOffice(item)"></i>-->
          <!--                </div>-->

          <!--              </div>-->
          <!--              <p class="fileName"><a :href="`ipdoc${item.address}`" target="_blank">{{item.name}}</a></p>-->
          <!--              <p class="file_detail"><span>{{item.createDate}}</span><span class="creater">{{item.creater}}</span></p>-->
          <!--            </div>-->
          <!--          </div>-->
        </div>
      </div>
      <div class="divider">
        <span>
            对账操作
        </span>
      </div>
      <div style="display: flex">
        <el-form style="flex: 7" class="form-container" size="small" :model="checkBillData">
          <div class="leftBox">
            <el-row class="first-row">
              <el-col :span="12">
                <el-form-item label="对账方式:" label-width="150px" class="postInfo-container-item">
                  <span v-if="checkBillType == '查看'">
                    {{checkBillData.reconcileType}}
                  </span>
                  <el-select v-else default-first-option :clearable='true' placeholder="请选择" size="mini"
                             v-model="checkBillData.reconcileType" filterable>
                    <el-option :label="item.typeName" :value="item.typeName" v-for="item in reconcileTypeList"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="客户:" label-width="150px" class="postInfo-container-item">
                  {{custName}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="客户收件人:" label-width="150px" class="postInfo-container-item">
                  <span v-if="checkBillType == '查看'">{{checkBillData.mailto}}</span>
                  <el-select v-else default-first-option :clearable='true' placeholder="请选择" size="mini"
                             v-model="checkBillData.mailto" filterable allow-create>
                    <el-option :label="item.email" :value="item.email" v-for="item in custContactEmailList"></el-option>
                  </el-select>

                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="抄送人:" label-width="150px" class="postInfo-container-item">
                  <span v-if="checkBillType == '查看'">{{checkBillData.mailcc}}</span>
                  <el-input v-else size="mini" placeholder="请填写" v-model="checkBillData.mailcc"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="密送人:" label-width="150px" class="postInfo-container-item">
                  <span v-if="checkBillType == '查看'">{{checkBillData.mailbcc}}</span>
                  <el-input v-else size="mini" placeholder="请填写" v-model="checkBillData.mailbcc"></el-input>

                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="邮件主题:" label-width="150px" class="postInfo-container-item">
                  <span v-if="checkBillType == '查看'">{{checkBillData.subject}}</span>
                  <el-input v-else size="mini" placeholder="请填写" v-model="checkBillData.subject"></el-input>

                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="邮件主题模板:" label-width="150px" class="postInfo-container-item">
                  <span v-if="checkBillType == '查看'">{{checkBillData.emailMainIdStr}}</span>
                  <el-select v-else default-first-option :clearable='true' placeholder="请选择" size="mini"
                             v-model="checkBillData.emailMainId" filterable>
                    <el-option :label="item.name" :value="item.id" v-for="item in subjectList"></el-option>
                  </el-select>

                </el-form-item>
              </el-col>
            </el-row>
            <div style="padding-right: 5px">
              <div class="divider">
              <span>
                  表格项目
              </span>
              </div>
            </div>
            <div style="display: flex;height: 60px;">
              <div class="right"
                   style="padding:10px;margin-right: 5px;flex: 1;display: flex; border: 1px solid #D7D7D7;justify-content: space-around;align-items: center">
                <template v-if="checkBillType == '查看'">
                  <div v-for="(item, index) in tableItems.filter(item => checkBillData[item.key])" style="">
                    {{item.label}}
                  </div>
                </template>
                <template v-else>
                  <div v-for="(item, index) in tableItems" style="">
                    <el-checkbox :true-label="1" :false-label="0" v-model="checkBillData[item.key]">
                      {{item.label}}
                    </el-checkbox>
                  </div>
                </template>
              </div>
            </div>
            <div style="padding-right: 5px">
              <div class="divider">
              <span>
                  对账信息
              </span>
              </div>
            </div>
            <el-row class="first-row">
              <el-col :span="12">
                <el-form-item label="对账日期:" label-width="150px" class="postInfo-container-item">
                  {{checkBillData.createDate}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="对账人:" label-width="150px" class="postInfo-container-item">
                  <span v-if="checkBillType == '查看'">{{checkBillData.fillinUserIdStr}}</span>
                  <el-select v-else disabled v-model="checkBillData.createUserId" filterable clearable
                             placeholder="请选择">
                    <el-option
                      v-for="item in $store.getters.userList"
                      :key="item.userId"
                      :label="item.fullname"
                      :value="item.userId">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="下次催款日期:" label-width="150px" class="postInfo-container-item">
                  <span v-if="checkBillType == '查看'">{{checkBillData.nextDunningDate}}</span>
                  <el-date-picker
                    v-else
                    size="mini"
                    value-format="yyyy-MM-dd"
                    v-model="checkBillData.nextDunningDate"
                    type="date"
                    placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="备注:" label-width="150px" class="postInfo-container-item">
                  <span v-if="checkBillType == '查看'">{{checkBillData.remarks}}</span>
                  <el-input v-else type="textarea" :rows="3" v-model="checkBillData.remarks"
                            placeholder="请填写备注"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-form>
        <div class="box-border" id="rightBill" :style="{flex: 3, maxHeight: rightMaxHeight, paddingTop: 0, overflow: 'auto'}">
          <div style="background-color: #F9F9F9;text-align: center;border-bottom: 1px solid #D7D7D7;line-height: 32px;">账单号</div>
          <div style="text-align: center;line-height: 32px;border-bottom: 1px solid #D7D7D7"
               v-for="(item, index) in billNoList">{{item}}
          </div>
        </div>
      </div>
      <div style="" class="no-radius">
        <div class="divider">
              <span>
                  催款反馈
              </span>
        </div>
        <span v-if="checkBillType == '查看'">{{checkBillData.feedback}}</span>
        <el-input v-else :rows="3" type="textarea" placeholder="请输入催款反馈" v-model="checkBillData.feedback"></el-input>
      </div>
    </div>

    <div class="fl-ac-jc" style="padding: 20px 0">
      <el-button size="small" @click="closeDialog(false)">取 消</el-button>
      <el-button size="small" type="primary" @click="submit" v-if="checkBillType == '新建' || checkBillType == '修改' ">确
        定
      </el-button>
    </div>
  </div>
</template>

<script>
  import { deleteMaterial } from "@/api/customerList";
  import uploadFile from '@/views/workbench/material_management/components/uploadFile'
  import {doEditInOffice, getProgID} from '@/utils/editInOffice.js'
  import {creatematerial, recordOnlienEdit, queryMaterialByObjTypeAndInstId} from '@/api/caseList.js'
  import {querycustSelectClass} from '@/api/customerList.js'
  import {getShowRefno, queryTemplate, queryCustContactEmailByCustId, createDunning, modifyDunning} from '@/api/billApi'

  export default {
    name: "CheckBill",
    components: {
      uploadFile
    },
    props: {
      checkBillType: ''
    },
    data() {
      return {
        sign: '',
        fileList: [],
        custContactEmailList: [],
        subjectList: [],
        // custId: '',
        reconcileTypeList: [],
        rightMaxHeight: '',
        billNoList: [],
        tableItems: [
          {label: '客户简称', key: 'shortname'},
          {label: '账单描述', key: 'billDesc'},
          {label: '账单抬头', key: 'billTitle'},
          {label: '申请人英文名称', key: 'appEnName'},
          {label: '人民币金额', key: 'localAmount'}
        ],
        custName: '',
        checkBillData: {
          dnId: '',
          custId: '',
          billIds: [],
          shortname: 0,
          billDesc: 0,
          billTitle: 0,
          appEnName: 0,
          localAmount: 0,
          showRefno: '',
          caseIds: '',
          reconcileType: '',
          mailcc: '',
          mailbcc: '',
          subject: '',
          emailMainId: '',
          createDate: '',
          createUserId: '',
          nextDunningDate: '',
          remarks: '',
          mailto: '',
          feedback: ''
        },
        hoverState: false,
        curFile: [],
        clickUpload: false,

      }
    },
    mounted() {
      this.rightMaxHeight = getComputedStyle(document.querySelector('.leftBox'))['height']
      if (this.checkBillType == '新建') {
        this.checkBillData.createDate = this.$wUtil.getDate('', 'day')
        this.checkBillData.subject = `Check the unpaid bills-WHD_${this.$wUtil.getDate('', 'day').replace(/-/g, '')}`
        this.checkBillData.createUserId = this.$store.getters.userId
      }
      this.init()
    },
    methods: {
      delFile(file) {
        deleteMaterial({materialId: file.materialId}).then(res => {
          this.$message.success('删除成功！')
          this.fileList.splice(this.fileList.findIndex(i => i.materialId === file.materialId), 1)
        })
      },
      doEditInOffice(data) {
        const url = data.address
        if (getProgID(url)) {
          recordOnlienEdit({materialId: data.materialId})
          doEditInOffice(url, getProgID(url))
        } else if (['pdf', 'jpg', 'png'].some(item => url.replace(/.+\./, "").toLocaleLowerCase() == item)) {
          window.open(`/ipdoc${url}`.replace(/[+]/g, '%2B'))
          // window.open(`#/preView?address=ipdoc${url}`.replace(/[+]/g,'%2B'))
        } else {
          this.downLoad(data)
        }
      },
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
          // doEditInOffice(url, getProgID(url))
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
      getUploadFile(e) {
        this.curFile = e.target.files
        this.createMultMaterial(this.curFile)
      },
      createMultMaterial(file) {
        let formData = new FormData()
        for (let item of file) {
          formData.append("attachFile", item);
        }
        formData.append("tokenID", this.$store.getters.token);
        this.checkBillData.dnId && formData.append("objInstId", this.checkBillData.dnId);
        formData.append("objType", '1113');
        formData.append("subject", '催款');
        formData.append("doctId", '7');
        creatematerial(formData, (e) => {
          this.percentage = parseInt(e.loaded / e.total * 100)
        }).then(async res => {
          this.percentage = 0
          res.data.forEach(item => {
            item.name = item.materialName
            // item.createDate = this.getTimer()
          })
          // this.materialIdArray = res.data.map(item => item.materialId)
          this.fileList.push(...res.data)
        }).catch(() => {
          this.percentage = 0
        })
      },
      enentDrop(e) {
        e.stopPropagation();
        e.preventDefault();
        this.hoverState = false
        this.curFile = e.dataTransfer.files
        this.createMultMaterial(this.curFile)
      },
      init() {
        if (this.checkBillType === '新建') {
          this.$nextTick(() => {
            this.checkBillData.billIds.length && this.getShowRefno(this.checkBillData.billIds)
            this.checkBillData.wfStatus = '待提交'
          })
        } else {
          this.$nextTick(() => {
            this.billNoList = this.checkBillData.dbills.map(item => item.billNo)
            this.queryMaterialByObjTypeAndInstId()
          })
        }
        this.$nextTick(() => {
          this.queryCustContactEmailByCustId()
        })
        this.queryTemplate()
        this.querycustSelectClass()
      },
      queryMaterialByObjTypeAndInstId() {
        queryMaterialByObjTypeAndInstId({objType: 1113, objInstId: this.checkBillData.dnId}).then(res => {
          this.fileList = res.data
        })
      },
      queryTemplate() {
        queryTemplate().then(res => {
          this.subjectList = res.data
        })
      },
      queryCustContactEmailByCustId() {
        queryCustContactEmailByCustId({custId: this.checkBillData.custId}).then(res => {
          this.custContactEmailList = res.data
        })
      },
      querycustSelectClass() {
        querycustSelectClass({classId: 1127}).then(res => {
          this.reconcileTypeList = res.data['1127']
        })
      },
      getShowRefno(billIds = []) {
        getShowRefno({billIds}).then(res => {
          this.checkBillData.caseIds = res.data.caseIds
          this.checkBillData.showRefno = res.data.showRefno
        })
      },
      submit() {
        this.checkBillData.materialIdArray = this.fileList.map(item => item.materialId)
        if (this.checkBillType === '新建') {
          this.checkBillData.isend = 0
          createDunning(this.checkBillData).then(res => {
            this.$message.success('新建成功!')
            this.closeDialog(this.checkBillData.custId)
          })
        } else {
          modifyDunning(this.checkBillData).then(res => {
            this.$message.success('修改成功!')
            this.closeDialog(this.checkBillData.custId)
          })
        }


      },
      closeDialog(search) {
        this.$emit('closeDialog', search)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .form-container {
    .el-form-item__error {
      position: relative !important;
      top: 0;
    }

    /deep/ .el-row {
      margin: 0px;
      display: flex;
    }

    /deep/ .postInfo-container-item {
      height: 100%;
      width: 100%;
    }

    /deep/ .el-form-item__label {
      flex-shrink: 0;
      background-color: #f9f9f9;
      /*width: 36.7%;*/
      text-align: right;
    }

    /deep/ .el-form-item {
      border-right: 1px solid #d7d7d7;
      margin: 0px !important;
    }

    .first-row {
      border-top: 1px solid #d7d7d7;
    }

    /deep/ .el-row {
      border-bottom: 1px solid #d7d7d7;
      border-left: 1px solid #d7d7d7;
    }

    /deep/ td .el-input,
    /deep/ td .el-select {
      width: 100%;
    }

    /deep/ .el-form-item__content {
      text-align: left;
      word-break: break-word;
      // height: 30px;
    }

    /deep/ .el-select .el-input {
      width: 100%;
    }

    .postInfo-container-item {
      display: flex;
      width: 100%;

      /deep/ .el-form-item__content {
        text-align: left;
        display: inline-table;
        flex: 1;
        padding: 5px 15px;
        margin-left: 0 !important;
      }

      > > > .el-date-editor {
        width: 100%;
      }
    }
  }

  .divider {
    position: relative;
    border-bottom: 1px solid #797979;
    margin-bottom: 20px;
    /*border-right: 1px solid #ccc;*/
    margin-top: 20px;

    .el-badge {
      padding-right: 10px;
    }

    span {
      /*color: #333;*/
      /*font-weight: bold;*/
      font-size: 14px;
      background: #fff;
      position: absolute;
      bottom: -9px;
      left: 50px;
      padding: 0 10px;
    }
  }

  .box-border {
    border: 1px solid #D7D7D7;
    padding: 5px 5px 5px 5px;
  }

  > > > .no-radius {
    .el-textarea__inner {
      border-radius: 0;
    }

    input {
      border-radius: 0;
    }
  }

  > > > .el-select {
    width: 100%;
  }

  .model_wrap {
    margin-bottom: 15px;
    padding: 0 15px;
  }

  .uploadwrap {
    border: 1px dashed #c9c9c9;
  }

  .fileWarp {
    display: flex;
    flex-wrap: wrap;
    font-size: 12px;

    .file_item {
      width: 200px;
      margin: 0 15px 15px 0;

      .fileName {
        font-size: 14px;
        color: #00b0ff;
        overflow: hidden;
        white-space: nowrap;
      }

      .file_detail {
        display: flex;
        justify-content: space-between;
      }
    }
  }

  .button_wrap {
    display: flex;
    justify-content: center;
  }

  .progressWrap {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.6);

    .el-progress {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);

      /deep/ .el-progress__text {
        color: #fff;
      }

      /deep/ path {
        fill: none !important;
      }
    }
  }

  .el-upload__text {
    margin-top: 20px;
  }

  .upload-demo {
    > > > .el-upload {
      width: 100%;
      height: 100%;

      .el-upload-dragger {
        width: 100% !important;
        height: 100% !important;
        min-height: 200px;
      }
    }
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
</style>
