<template>
  <div>
    <el-form class="form-container" size="small" label-width="120px" :model="creditData">
      <div style="border: 1px solid #D7D7D7;margin-top: 10px;padding: 0 5px 5px 5px">
        <div class="divider">
              <span>
                  设定信用等级
              </span>
        </div>
        <el-row class="first-row">
          <el-col :span="24">
            <el-form-item label="客户:" label-width="150px" class="postInfo-container-item">
              {{creditData.custNames}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="信用等级:" label-width="150px" class="postInfo-container-item">
              <span v-if="creditType == '查看'">{{creditData.level}}</span>
              <el-select v-else default-first-option :clearable='true' placeholder="请选择" v-model="creditData.level" filterable>
                <el-option v-for="item in levelList" :key="item.typeName" :label="item.typeName"
                           :value="item.typeName">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="不可垫付:" label-width="150px" class="postInfo-container-item">
              <span v-if="creditType == '查看'">{{creditData.notAdvanceFlag ? '是' : '否'}}</span>
              <el-radio-group v-else v-model="creditData.notAdvanceFlag">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="设定人:" label-width="150px" class="postInfo-container-item">
              <span>{{userName}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设定时间:" label-width="150px"  class="postInfo-container-item">
              <span>{{creditData.createDate}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="信用定级理由及批示:" label-width="150px" class="postInfo-container-item">
              <el-input v-if="creditType == '查看'" type="textarea" :row="5" v-model="creditData.memo" readonly></el-input>
              <el-input v-else type="textarea" :row="5" v-model="creditData.memo"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="上传附件:" label-width="150px" class="postInfo-container-item">
              <div v-if="creditType == '查看'">
                <div v-for="(item,index) in creditData.materialList || []" :key="index">
                  <div class="clickable" href="" @click="preView(item)">{{ item.materialName }}</div>
                </div>
              </div>
              <el-upload
                v-else
                ref="uploadFile"
                class="credit-upload"
                drag
                name="attachFile"
                :data="getUploadData()"
                :action="creatematerial"
                :file-list="materialArray"
                :on-success="onsuccess"
                :on-remove="handleRemove"
              >
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
    <div class="fl-ac-jc" style="padding: 20px 0">
      <el-button size="small" @click="closeDialog(false)">取 消</el-button>
      <el-button size="small" type="primary" @click="submit" v-if="creditType == '新建'">确 定</el-button>
      <el-button size="small" type="primary" @click="submit" v-if="creditType == '修改'">保 存</el-button>
    </div>
  </div>
</template>

<script>
  import {
    fetchList,
    delCustomer,
    querycustSelectClass,
    queryCustomerNameIdUrl,
    queryCountryUrl,
    updateLevelUrl,
    queryIndustryUrl,
    queryFiliale,
    searchtmdataUrl,
    queryAppInfoUrl,
    queryCustomerUrl
  } from "@/api/customerList";
  import { creatematerial } from '@/api/ipServiceApi.config.js'
  import { updateLevel, modifyLevel } from '@/api/billApi'
  import { getProgID } from '@/utils/editInOffice.js'

  export default {
    name: "Credit",
    props: {
      creditType: ''
    },
    data() {
      return {
        userName: '',
        levelList: [],
        creditData: {
          custIds: '',
          level: '',
          userId: '',
          createDate: '',
          memo: '',
          custNames: ''
        },
        materialArray: [],
        creatematerial
      }
    },
    created() {
      this.queryLevelList()
      if(this.creditType == '新建'){
        this.creditData.createDate = this.$wUtil.getDate('', 'day')
        this.creditData.userId = this.$store.getters.userId
        this.userName = this.$store.getters.name
      }
    },
    methods: {
      getUploadData() {
        return {
          tokenID: this.$store.getters.token,
          custId: this.creditData.custIds,
          custCreditId: 301625
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
        } else if (['pdf', 'jpg', 'png'].some(item => url.replace(/.+\./, "").toLocaleLowerCase() == item)) {
          window.open(`/ipdoc${url}`.replace(/[+]/g, '%2B'))
        } else {
          this.downLoad(data)
        }
      },
      downLoad(data) {
        const url = data.address
        const downData = {
          url: `${url}`,
        }
        if (data.mailId) {
          downData.downLoad = data.materialName
        }
        this.$commonUtils.downLoadAll(downData)
      },
      onsuccess(response, file, fileList) {
        // 将服务端返回的信息合并到当前文件对象，保持受控的 file-list 稳定，避免闪烁
        const serverItem = Array.isArray(response.data) ? response.data[0] : response.data
        if (serverItem) {
          file.status = 'success'
          // 使用服务端的展示名称与地址
          file.name = serverItem.materialName || serverItem.name || file.name
          file.url = serverItem.address || serverItem.url || file.url
          // 保留后续提交需要的标识
          file.materialId = serverItem.materialId
          file.response = response
        }
        // 与组件的回调保持一致，用回调提供的列表作为单一数据源，避免重复 push 导致抖动
        this.materialArray = fileList.slice()
      },
      handleRemove(file, fileList) {
        // 直接以回调提供的列表为准，避免替换为非 UploadFile 结构引起的重渲染闪烁
        this.materialArray = fileList.slice()
      },
      queryLevelList() {
        querycustSelectClass({classId: "1099"}).then(response => {
          this.levelList = response.data["1099"]
        });
      },
      closeDialog(search) {
        this.$emit('closeDialog', search)
      },
      submit() {
        if(this.creditType == '新建'){
          if (this.materialArray.length > 0) {
            this.creditData.materialList = this.materialArray.map(item => {
              return{
                materialName: item.name,
                address: item.url,
                materialId: item.materialId,
              }
            })
          }
          updateLevel(this.creditData).then(res => {
            this.$message.success('设定信用等级成功!')
            this.closeDialog(true)
          })
        }else{
          modifyLevel(this.creditData).then(res => {
            this.$message.success('修改成功!')
            this.closeDialog(true)
          })
        }
      },
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
      display: flex; /*解决账单查看表单样式被撑开*/
    }

    /deep/ .postInfo-container-item {
      height: 100%;
      width: 100%;
    }

    /deep/ .el-form-item__label {
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

    /deep/ .el-input,
    /deep/ .el-select {
      /*width: 77%;*/
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

    .fullRow {
      /deep/ .el-form-item__label {
        /*width: 15%;*/
      }

      /deep/ .el-input,
      /deep/ .el-select {
        /*width: 30%;*/
      }
    }

    /deep/ .el-input__inner {
      // border: none;
    }

    /deep/ .el-select .el-input {
      width: 100%;
    }

    /deep/ td .el-select,
    /deep/ td .el-input,
    /deep/ td .el-input__inner {
      // border: 0px !important;
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

      /deep/ .el-form-item__label {
        /*line-height: 28px;*/
      }
    }
  }

  .divider {
    position: relative;
    border-bottom: 1px solid #797979;
    margin-bottom: 20px;
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
  .credit-upload {
    /deep/ .el-upload-dragger {
      height: 46px;
      .el-icon-upload {
        font-size: 35px;
        color: #C0C4CC;
        margin: 0;
        line-height: 46px;
      }
    }
  }
  .clickable{
    cursor: pointer;
    color: #409EFF;
  }
</style>
