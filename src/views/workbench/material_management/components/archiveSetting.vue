<template>
  <div>
    <!--    借出-->
    <template v-if="type == 2">
      <div class="content">
        <el-form ref="postForm" size="small" class="form-container" label-width="120px">
          <el-row class="first-row">
            <el-col :span="24">
              <el-form-item label="条码号:" class="postInfo-container-item">
                <span v-if="arcList.length > 0">{{ arcList.map(res=>res.barcode).join(',') }}</span>
                <el-input
                  v-else
                  ref="barcode"
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 10}"
                  placeholder="请输入条码号，录入多个请换行"
                  v-model="lendData.barcodes">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="">
            <el-col :span="12">
              <el-form-item label="借出人:" class="postInfo-container-item">
                <el-select v-model="lendData.lendUser" filterable clearable reserve-keyword default-first-option>
                  <el-option
                    v-for="item in userList"
                    :key="item.userId"
                    :label="item.fullname"
                    :value="item.fullname"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="借出日期:" class="postInfo-container-item">
                <el-date-picker
                  v-model="lendData.lendDate"
                  type="datetime"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择日期时间">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="fl-ac-jc" style="padding: 20px 0">
        <el-button size="small" @click="closeDialog(false)">取 消</el-button>
        <el-button size="small" type="primary" @click="submit('lendData')">借 出</el-button>
      </div>
    </template>
    <!--    归还-->
    <template v-if="type == 1">
      <div class="content">
        <el-form ref="postForm" size="small" class="form-container" label-width="120px">
          <el-row class="first-row">
            <el-col :span="24">
              <el-form-item label="条码号:" class="postInfo-container-item">
                <span v-if="arcList.length > 0">{{ arcList.map(res=>res.barcode).join(',') }}</span>
                <el-input
                  v-else
                  ref="barcode"
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 10}"
                  placeholder="请输入条码号，录入多个请换行"
                  v-model="returnData.barcodes">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="">
            <el-col :span="24">
              <el-form-item label="归还日期:" class="postInfo-container-item">
                <el-date-picker
                  v-model="returnData.returnDate"
                  type="datetime"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择日期时间">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="fl-ac-jc" style="padding: 20px 0">
        <el-button size="small" @click="closeDialog(false)">取 消</el-button>
        <el-button size="small" type="primary" @click="submit('returnData')">归 还</el-button>
      </div>
    </template>
    <!--    异地保存-->
    <template v-if="type == 3">
      <div class="content">
        <el-form ref="postForm" size="small" class="form-container" label-width="120px">
          <el-row class="first-row">
            <el-col :span="24">
              <el-form-item label="条码号:" class="postInfo-container-item">
                <span v-if="arcList.length > 0">{{ arcList.map(res=>res.barcode).join(',') }}</span>
                <el-input
                  v-else
                  ref="barcode"
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 10}"
                  placeholder="请输入条码号，录入多个请换行"
                  v-model="offSiteData.barcodes">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="">
            <el-col :span="12">
              <el-form-item label="包号:" class="postInfo-container-item">
                <el-input v-model="offSiteData.packageCode" placeholder="请录入包号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="异地保存日期:" class="postInfo-container-item">
                <el-date-picker
                  v-model="offSiteData.remoteStorageDate"
                  type="date"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="fl-ac-jc" style="padding: 20px 0">
        <el-button size="small" @click="closeDialog(false)">取 消</el-button>
        <el-button size="small" type="primary" @click="submit('offSiteData')">异地保存</el-button>
      </div>
    </template>
    <!--    销毁-->
    <template v-if="type == 4">
      <div class="content">
        <el-form ref="postForm" size="small" class="form-container" label-width="120px">
          <el-row class="first-row">
            <el-col :span="24">
              <el-form-item label="条码号:" class="postInfo-container-item">
                <span v-if="arcList.length > 0">{{ arcList.map(res=>res.barcode).join(',') }}</span>
                <el-input
                  v-else
                  ref="barcode"
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 10}"
                  placeholder="请输入条码号，录入多个请换行"
                  v-model="destroyData.barcodes">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="">
            <el-col :span="24">
              <el-form-item label="销毁日期:" class="postInfo-container-item">
                <el-date-picker
                  v-model="destroyData.destroyDate"
                  type="date"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="fl-ac-jc" style="padding: 20px 0">
        <el-button size="small" @click="closeDialog(false)">取 消</el-button>
        <el-button size="small" type="primary" @click="submit('destroyData')">销 毁</el-button>
      </div>
    </template>
    <!--    取走-->
    <template v-if="type == 5">
      <div class="content">
        <el-form ref="postForm" size="small" class="form-container" label-width="120px">
          <el-row class="first-row">
            <el-col :span="24">
              <el-form-item label="条码号:" class="postInfo-container-item">
                <span v-if="arcList.length > 0">{{ arcList.map(res=>res.barcode).join(',') }}</span>
                <el-input
                  v-else
                  ref="barcode"
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 10}"
                  placeholder="请输入条码号，录入多个请换行"
                  v-model="takeAwayData.barcodes">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="">
            <el-col :span="12">
              <el-form-item label="取走人:" class="postInfo-container-item">
                <el-select v-model="takeAwayData.takeAwayUserId" filterable clearable reserve-keyword default-first-option>
                  <el-option
                    v-for="item in userList"
                    :key="item.userId"
                    :label="item.fullname"
                    :value="item.userId"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="取走日期:" class="postInfo-container-item">
                <el-date-picker
                  v-model="takeAwayData.takeAwayDate"
                  type="date"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="">
            <el-col :span="24">
              <el-form-item label="取走原因:" class="postInfo-container-item">
                <el-input v-model="takeAwayData.takeAwayReason" type="textarea" :rows="2" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="fl-ac-jc" style="padding: 20px 0">
        <el-button size="small" @click="closeDialog(false)">取 消</el-button>
        <el-button size="small" type="primary" @click="submit('takeAwayData')">取 走</el-button>
      </div>
    </template>
    <!--    转借-->
    <template v-if="type == 6">
      <div class="content">
        <el-form ref="postForm" size="small" class="form-container" label-width="120px">
          <el-row class="first-row">
            <el-col :span="24">
              <el-form-item label="条码号:" class="postInfo-container-item">
                <span v-if="arcList.length > 0">{{ arcList.map(res=>res.barcode).join(',') }}</span>
                <el-input
                  v-else
                  ref="barcode"
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 10}"
                  placeholder="请输入条码号，录入多个请换行"
                  v-model="lendingData.barcodes">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="">
            <el-col :span="12">
              <el-form-item label="转借人:" class="postInfo-container-item">
                <el-select v-model="lendingData.lendUser" filterable clearable reserve-keyword default-first-option>
                  <el-option
                    v-for="item in userList"
                    :key="item.userId"
                    :label="item.fullname"
                    :value="item.fullname"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="转借日期:" class="postInfo-container-item">
                <el-date-picker
                  v-model="lendingData.lendDate"
                  type="datetime"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择日期时间">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="fl-ac-jc" style="padding: 20px 0">
        <el-button size="small" @click="closeDialog(false)">取 消</el-button>
        <el-button size="small" type="primary" @click="submit('lendingData')">转 借</el-button>
      </div>
    </template>
  </div>
</template>

<script>
import { updateArchivesStatus, queryArchivesStatusByBarcode } from "@/api/material.js";
export default {
  name: 'archiveSetting',
  props: ['type','arcList'],
  data() {
    return {
      userList: [],
      arcIds: [],
      checkCodeSubmit: true,
      lendData: {
        barcodes: '',
        lendUser: '',
        lendDate: this.$wUtil.getDate()
      },
      returnData: {
        barcodes: '',
        returnDate: this.$wUtil.getDate()
      },
      offSiteData: {
        barcodes: '',
        packageCode: '',
        remoteStorageDate: this.$wUtil.getDate('', 'day')
      },
      destroyData: {
        barcodes: '',
        destroyDate: this.$wUtil.getDate('', 'day')
      },
      takeAwayData: {
        barcodes: '',
        takeAwayUserId: '',
        takeAwayDate: this.$wUtil.getDate('', 'day'),
        takeAwayReason: ''
      },
      lendingData: {
        barcodes: '',
        lendUser: '',
        lendDate: this.$wUtil.getDate()
      },
      notStatusArr: {
        lendData: [2,3,4,5,6], // 借出
        returnData: [1,3,4,5,6], // 归还
        offSiteData: [2,3,4,5,6], // 异地保存
        destroyData: [2,4,5,6], // 销毁
        takeAwayData: [2,3,4,5,6], // 取走
        lendingData: [1,3,4,5,6] // 转借
      }
    }
  },
  created() {
    this.arcIds = this.arcList.map(res => res.arcId)
    this.userList = this.$store.getters.userList
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.barcode && this.$refs.barcode.focus();
    })
  },
  methods: {
    // 检查条码号状态
    async checkBarCode(value,key) {
      if (value) {
        this.checkCodeSubmit = true
        let barcodes = value.split('\n')
        barcodes.forEach((item,index) =>{
          !item && barcodes.splice(index,1)
        })
        let statusMsg = ''
        let notMsg = ''
        await queryArchivesStatusByBarcode({barcodes: barcodes}).then(res => {
          barcodes.forEach((item,index) => {
            let arcInfo = res.data.find(map => map.barcode == barcodes[index])
            if (arcInfo){
              if (this.notStatusArr[key].includes(arcInfo.status)) {
                statusMsg += barcodes[index]+';'
              }
            }else{
              notMsg += barcodes[index]+';'
            }
          })
          if (statusMsg || notMsg){
            statusMsg && this.$message.error(statusMsg + '条码号状态不符合当前状态设置');
            notMsg && this.$message.error(notMsg+'条码号不存在');
            this.checkCodeSubmit = false
          } else {
            this.arcIds = res.data.map(item => item.arcId)
          }
        })
      }
      return
    },
    closeDialog() {
      this.$emit('cancel')
    },
    async submit(type) {
      await this.checkBarCode(this[type].barcodes,type)
      if (!this.checkCodeSubmit){
        return
      }
      if (this[type].hasOwnProperty('lendUser')){
        if (!this[type].lendUser){
          this.$message({message: '请选择操作人',type: 'warning'});
          return
        }
      }
      if (this[type].barcodes) {
        this[type].barcodes = this[type].barcodes.split('\n')
      }
      console.log({
        status: this.type,
        arcIds: this.arcIds,
        ...this[type]
      })
      updateArchivesStatus({
        status: this.type,
        arcIds: this.arcIds,
        ...this[type]
      }).then(res => {
        this.$message({
          type: 'success',
          message: res.message
        });
        this.$emit('cancel',this.arcIds)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.topBox {
  background-color: #F2F2F2;
  padding-left: 20px;
  display: flex;
  height: 40px;
  /*justify-content: center;*/
  align-items: center;

  .iconfont {
    margin-right: 10px;
  }
}

.content {
  border: 1px solid #D7D7D7;
  margin-top: 10px;
  padding: 5px;
}

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
      flex-shrink: 0;
      /*line-height: 28px;*/
    }

    > > > .el-date-editor {
      width: 100%;
    }
  }
}
</style>
