<template>
  <div class="contact-info">
    <el-button size="mini" type="primary" v-if="editStatus" @click="addDfContact">新增</el-button>
<!--    <div class="base-header">-->
<!--      <span class="left-line"></span>-->
<!--      <span class="right-text">对方联系人</span>-->
<!--    </div>-->
    <div class="header-table">
      <el-table :max-height="clientHeight" class="el-table1" size="mini" :data="dfContactList" fit empty-text="暂无数据"
                highlight-current-row
                current-row-key style="width: 100%;" @row-dblclick="rowDbClick">
        <el-table-column label="姓名" align="left" width prop="name" :filters="headFilters['name']" :filter-method="filterHandler">
          <template slot-scope="scope">
            <span :title="scope.row.name">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="职务" align="left" width prop="jobtitle" :filters="headFilters['jobtitle']" :filter-method="filterHandler">
          <template slot-scope="scope">
            <span :title="scope.row.jobtitle">{{ scope.row.jobtitle }}</span>
          </template>
        </el-table-column>
        <el-table-column label="部门" align="left" width prop="department" :filters="headFilters['department']" :filter-method="filterHandler">
          <template slot-scope="scope">
            <span :title="scope.row.department">{{ scope.row.department }}</span>
          </template>
        </el-table-column>
        <el-table-column label="办公电话" align="left" width prop="tel" :filters="headFilters['tel']" :filter-method="filterHandler">
          <template slot-scope="scope">
            <span :title="scope.row.tel">{{ scope.row.tel }}</span>
          </template>
        </el-table-column>
        <el-table-column label="邮箱" align="left" width prop="email" :filters="headFilters['email']" :filter-method="filterHandler">
          <template slot-scope="scope">
            <span :title="scope.row.email">{{ scope.row.email }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="left" width prop="statusStr" :filters="headFilters['statusStr']" :filter-method="filterHandler">
          <template slot-scope="scope">
            <span :title="scope.row.statusStr">{{ scope.row.statusStr }}</span>
          </template>
        </el-table-column>
        <el-table-column label="启用" align="left" width prop="sysStatusStr" :filters="headFilters['sysStatusStr']" :filter-method="filterHandler">
          <template slot-scope="scope">
            <span :title="scope.row.sysStatusStr">{{ scope.row.sysStatusStr }}</span>
          </template>
        </el-table-column>

        <el-table-column  label="操作" align="left" width="" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <span class="pointer" @click="rowDbClick(scope.row)">{{ editStatus ? '编辑' : '详情'}}</span>
            <span class="pointer" v-if="editStatus" @click="delDfContact(scope.row, scope.$index)" v-allow="70">删除</span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog style="position:absolute;left: 0;top: 0;" :fullscreen="false" :show-close="false"
               :close-on-click-modal="false" :modal="false"
               :append-to-body="false" :title="'对方联系人 - ' + title" :visible.sync="dialogFormDfContact" width="70%">
      <DfDetail :dfCreated="dfCreated" @updateCustomerContact="updateCustomerContact" @closeDialog="closeDfContactDialog" ref="ContactDfDetail"
                         v-if="dialogFormDfContact" :isLook="isLook" :isEdit="true"
                         :id="dfconFromData.custContactId" :cust-id="dfconFromData.custId"></DfDetail>
      <div slot="footer" class="dialog-footer fl-ac-jc">
        <el-button size="small" @click="() => closeDfContactDialog(false)">取 消</el-button>
        <el-button size="small" type="primary" v-if="title === '修改' || title === '新建'" @click="submitDfContactData">{{title === '修改' ? '确 定' : '新 建'}}</el-button>
      </div>
    </el-dialog>
    <!--    <el-dialog style="position:absolute;left: 0;top: 0;" :fullscreen="false" :show-close="false"-->
    <!--               :close-on-click-modal="false" :modal="false"-->
    <!--               :append-to-body="false" :title="'对方联系人 - ' + title" :visible.sync="dialogFormDfContact" width="70%">-->
    <!--      <div class="createPost-container">-->

    <!--      </div>-->
    <!--      <div slot="footer" class="dialog-footer fl-ac-jc">-->
    <!--        <el-button @click="() => closeDfContactDialog(false)">取 消</el-button>-->
    <!--        <el-button type="primary" v-if="title === '修改' || title === '新建'" @click="submitDfContactData">确 定</el-button>-->
    <!--      </div>-->
    <!--    </el-dialog>-->
  </div>
</template>

<script>
  import {
    addCustomerContactUrl, delCustomerContacturl,
    deleteCustomerContactIcon,
    queryCustomerContactCustIdUrl, queryCustomerContactUrl,
    queryCustomerNameId, updateCustomerContacturl
  } from "../../../../../api/customerList";
  import * as serviceApi from "../../../../../api/serviceApi.config";
  import DfDetail from "@/views/workbench/customer_center/customer_other_contacts/DfDetail.vue";

  export default {
    name: "OtherPartyContact",
    components: {DfDetail},
    props: {
      tabNo: {},
      seletData: {},
      fullname: {},
      custId: {},
      editStatus: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        headFilters: {},
        isSave: false,
        isShow: false,
        title: '',
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
        dfuserIconCust: '',
        custContIconSendData: {
          tokenID: "",
          custContactId: "",
          custId: ""
        },
        dfuserIconUrl: serviceApi.addCustomerContactIcon,
        iconIsDel: false,
        isLook: true,
        titleL: '',
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
        dfconFromData: {
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
          customerContactAgencyContacts: [],
          photo: ''
        },
        dialogFormDfContact: false,
        dfContactList: [],
        dfCreated:false,
      }
    },
    computed: {
      clientHeight() {
        return document.documentElement.clientHeight - 300
      },
    },
    created() {
      this.queryDfContactList()
    },
    methods: {
      filterHandler(value, row, column) {
        const property = column['property']
        return row[property] === value
      },
      async closeDfContactDialog(isSearch) {
        if (this.title === '新建' && !this.isSave) {
          // await delCustomerContacturl({custContactId: this.dfconFromData.custContactId})
        }
        isSearch === true && this.queryDfContactList()
        this.dialogFormDfContact = false
        this.title = ''
        this.isSave = false
        this.isLook = true
        this.$emit('changeMask', {type: 'del', value: this.tabNo})
        this.dfconFromData = {
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
          customerContactAgencyContacts: [],
          photo: ''
        }
      },
      updateCustomerContact() {
        this.isSave = true
        this.closeDfContactDialog(true)
      },
      addDfContact() {
        this.$emit('changeMask', {type: 'add', value: this.tabNo})
        this.dfconFromData.custId = this.custId
        this.dialogFormDfContact = true
        this.dfCreated = true
        this.title = '新建'
        this.isLook = false
        // addCustomerContactUrl({custId: this.custId}).then(res => {
        //   this.dfconFromData.custContactId = res.data.data.custContactId;
        //   this.dfconFromData.custId = res.data.data.custId;
        //   this.$emit('changeMask', {type: 'add', value: this.tabNo})
        //   this.dialogFormDfContact = true
        //   this.dfCreated = true
        //   this.title = '新建'
        //   this.isLook = false
        // })
      },
      remotepaternalUnit(query) {
        if (query !== "") {
          queryCustomerNameId({keyword: query, isCustomer: "1"}).then(
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
      onBeforeUploadIcon(file) {
        this.custContIconSendData.tokenID = this.$store.getters.token
        this.custContIconSendData.custContactId = this.dfconFromData.custContactId
        this.custContIconSendData.custId = this.dfconFromData.custId
        const isIMAGE = file.type === "image/jpeg" || "image/gif" || "image/png"
        const isLt1M = file.size / 1024 / 1024 < 1
        if (!isIMAGE) {
          this.$message.error("上传文件只能是图片格式!")
        }
        if (!isLt1M) {
          this.$message.error("上传文件大小不能超过 1MB!")
        }
        return isIMAGE && isLt1M
      },
      dfhandleAvatarChange(file, fileList) {
        if (this.isdfItemTrue()) {
          this.dfconFromData.photo = URL.createObjectURL(file.raw);
          this.dfuserIconCust = URL.createObjectURL(file.raw);
          this.$refs.custContIconupload.submit();
        }
      },
      btnDelete() {
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
      dficonSendSuccess(response, file, fileList) {
        if (response.success) {
          this.iconIsDel = false
          this.$message.success(response.message);
        } else {
          this.$message.error(response.message);
          this.dfconFromData.photo = "";
        }
      },
      showDelIcon() {
        this.isShow = true;
      },
      hideDelIcon() {
        this.isShow = false;
      },
      submitDfContactData() {
        this.isSave = true
        if (this.title === '修改') {
          this.$refs.ContactDfDetail.createCustAddr()
        } else {
          this.$refs.ContactDfDetail.createDfContact()
        }

        // this.closeDfContactDialog(true)
        // if (!this.$commonUtils.formValidate(this.$refs['dfconFromData'])) return;
        // const tempData = Object.assign({}, this.dfconFromData);
        // delete tempData.activities;
        // delete tempData.photo;
        // delete tempData.materialList;
        // updateCustomerContacturl(tempData).then(res => {
        //   this.$message.success('操作成功!')
        //   this.isSave = true
        //   this.closeDfContactDialog(true)
        // })
      },
      queryDfContactList() {
        queryCustomerContactCustIdUrl({
          customerId: this.custId
        }).then(res => {
          this.dfContactList = res.data || [];
          this.headFilters = this.$commonUtils.tableFilter(this.dfContactList)
        });
      },
      isdfItemTrue() {
        if (!this.dfconFromData.custContactId) {
          this.$message.error("请填写必填项");
          return false;
        } else {
          return true;
        }
      },
      rowDbClick(row) {
        // queryCustomerContactUrl({custContactId: row.custContactId})
        //   .then(response => {
        //     this.$emit('changeMask', {type: 'add', value: '3'})
        //     this.dfconFromData = response.data
        //     this.dialogFormDfContact = true
        //     this.$set(this.dfconFromData, 'status', +this.dfconFromData.status || '')
        //     queryCustomerContactCustIdUrl({
        //       customerId: this.dfconFromData.custId
        //     }).then(response => {
        //       if (response.success) {
        //         this.seletData.dfcon = response.data
        //       } else {
        //         this.$message.error(response.message)
        //       }
        //     })
        //     if (this.dfconFromData.custId) {
        //       queryCustomerNameId({
        //         isCustomer: "1",
        //         custId: this.dfconFromData.custId
        //       }).then(response => {
        //         this.seletData.paternalUnit = response.data
        //       });
        //       if (this.dfconFromData.photo) {
        //         this.dfuserIconCust = `/ipdoc${this.dfconFromData.photo}`
        //       }
        //     }
        //     if (this.editStatus) {
        //       this.isLook = false
        //       this.title = '修改'
        //     } else {
        //       this.isLook = true
        //       this.title = '查看'
        //     }
        //
        //   })
        this.$emit('changeMask', {type: 'add', value: this.tabNo})
        this.dfconFromData = JSON.parse(JSON.stringify(row))
        this.dialogFormDfContact = true
        if (this.editStatus && this.$store.getters.permissions.includes(69)) { // 修改权限69
          this.isLook = false
          this.title = '修改'
        } else {
          this.isLook = true
          this.title = '查看'
        }
      },
      delDfContact(row, index) {
        this.$confirm("此操作将永久删除, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          delCustomerContacturl({custContactId: row.custContactId}).then(res => {
            this.$message.success('删除成功!')
            this.dfContactList.splice(index, 1)
          })
        })
      }

    }
  }
</script>

<style lang="scss" scoped>
  > > > .el-table1 {
    /*height: auto;*/

    .cell {
      max-height: 70px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      overflow: hidden;
    }
  }

  > > > .header-table {
    margin-top: 10px;
    padding: 0 0 0 15px;

    .el-table__header-wrapper {
      border: 1px solid #EBEEF5;
      border-bottom: none;

      th {
        background-color: #FAFAFA;
        font-size: 16px;
        color: #555555;
        font-weight: normal;
      }
    }
  }

  .contact-info {
    background-color: #fff;
    padding: 10px 15px;

    .el-button {
      float: right;
    }

    .base-header {
      display: flex;
      align-items: center;

      .left-line {
        display: inline-block;
        width: 10px;
        height: 26px;
        background-color: #409EFF;
        margin-right: 10px;
      }

      .right-text {
        font-weight: bold;
      }
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
      display: flex;
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
      flex: 1;
      text-align: center;
      /*height: 30px;*/
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

  /deep/ .el-col.el-col-12 {
    .el-cascader {
      width: 100%;

      .el-input {
        width: 100%;
      }
    }
  }

  > > > .el-dialog {
    margin-top: 5vh !important;
  }

  > > > .el-dialog__body {
    padding-top: 0;
    padding-bottom: 0;
    max-height: 450px;
    overflow: auto;
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

  /deep/ .el-form-item__content {
    text-align: center;

    .el-form-item__error {
      position: relative;
      text-align: left;
      left: 0;
      top: 0;
    }

    /*height: 30px;*/
  }
</style>
