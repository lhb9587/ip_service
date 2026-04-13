<template>
  <div>
    <div class="addr-info">
      <el-button size="mini" type="primary" v-if="editStatus" @click="addAddr">新增</el-button>
<!--      <div class="base-header">-->
<!--        <span class="left-line"></span>-->
<!--        <span class="right-text">客户地址</span>-->
<!--      </div>-->
      <div class="header-table">
        <el-table :max-height="clientHeight" class="el-table1" size="mini" :data="addrList" fit empty-text="暂无数据" filter-placement="bottom-start"
                  highlight-current-row
                  current-row-key style="width: 100%;" @row-dblclick="rowDbClick">
          <!--          <el-table-column type="index" width="60" label="序号" align="left"></el-table-column>-->
          <el-table-column label="信函抬头" align="left" width prop="title" :filters="headFilters['title']" :filter-method="filterHandler">
            <template slot-scope="scope">
              <span :title="scope.row.title">{{ scope.row.title }}</span>
            </template>
          </el-table-column>
          <el-table-column label="大洲" align="left" width>
            <template slot-scope="scope">
              <span :title="scope.row.continent">{{ scope.row.continent }}</span>
            </template>
          </el-table-column>
          <el-table-column label="国家" align="left" width>
            <template slot-scope="scope">
              <span :title="scope.row.country">{{ scope.row.country }}</span>
            </template>
          </el-table-column>
          <el-table-column label="州省份" align="left" width>
            <template slot-scope="scope">
              <span :title="scope.row.province">{{ scope.row.province }}</span>
            </template>
          </el-table-column>
          <el-table-column label="城市" align="left" width prop="city" :filters="headFilters['city']" :filter-method="filterHandler">
            <template slot-scope="scope">
              <span :title="scope.row.city">{{ scope.row.city }}</span>
            </template>
          </el-table-column>
          <el-table-column label="中文地址" align="left" width>
            <template slot-scope="scope">
              <span :title="scope.row.addressCn">{{ scope.row.addressCn }}</span>
            </template>
          </el-table-column>
          <el-table-column label="英文地址" align="left" width>
            <template slot-scope="scope">
              <span :title="scope.row.addressEn">{{ scope.row.addressEn }}</span>
            </template>
          </el-table-column>
          <el-table-column label="邮编" align="left" width prop="post" :filters="headFilters['post']" :filter-method="filterHandler">
            <template slot-scope="scope">
              <span :title="scope.row.post">{{ scope.row.post }}</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" align="left" width prop="statusStr" :filters="headFilters['statusStr']" :filter-method="filterHandler">
            <template slot-scope="scope">
              <span :title="scope.row.statusStr">{{ scope.row.statusStr }}</span>
            </template>
          </el-table-column>
          <el-table-column label="备注" align="left" width>
            <template slot-scope="scope">
              <span :title="scope.row.memo">{{ scope.row.memo }}</span>
            </template>
          </el-table-column>

          <el-table-column label="操作" align="left" width="" class-name="small-padding fixed-width">
            <template slot-scope="scope"  >
              <span class="pointer" @click="rowDbClick(scope.row)">{{ editStatus ? '编辑' : '详情'}}</span>
              <span class="pointer"  v-if="editStatus" v-allow="51" @click="delAddr(scope.row, scope.$index)">删除</span>
            </template>
          </el-table-column>  
        </el-table>
      </div>

      <el-dialog style="position:absolute;left: 0;top: 0;" :fullscreen="false" :show-close="false"
                 :close-on-click-modal="false" :modal="false"
                 :append-to-body="false" :title="'客户地址 - ' + title" :visible.sync="dialogFormAddr" width="70%">
        <el-form ref="creatAddrForm" :model="addrFromData" size="mini" label-position="left" style="width: 100%;">
          <el-row class="form-border">
            <el-col :span="24">
              <el-row class="fullRow">
                <el-col :span="24">
                  <el-form-item label="单位:" class="postInfo-container-item">
                    <span>{{fullname}}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="fullRow">
                <el-col :span="24">
                  <el-form-item label="信函抬头:" class="postInfo-container-item">

                    <span v-if="dialogLook">{{addrFromData.title}}</span>
                    <el-input v-else type="text" placeholder="" v-model="addrFromData.title">
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="fullRow">
                <el-col :span="24">
                  <el-form-item label="中文地址:" class="postInfo-container-item">
                    <span v-if="dialogLook">{{addrFromData.addressCn}}</span>
                    <el-input v-else type="text" placeholder="" v-model="addrFromData.addressCn">
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="fullRow">
                <el-col :span="24">
                  <el-form-item label="英文地址:" class="postInfo-container-item">

                    <span v-if="dialogLook">{{addrFromData.addressEn}}</span>
                    <el-input v-else type="text" placeholder="" v-model="addrFromData.addressEn">
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="fullRow">
                <el-col :span="24">
                  <el-form-item label="邮寄地址:" class="postInfo-container-item">

                    <span v-if="dialogLook">{{addrFromData.addressMail}}</span>
                    <el-input v-else type="text" placeholder="" v-model="addrFromData.addressMail">
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="fullRow">
                <el-col :span="24">
                  <el-form-item label="邮编:" class="postInfo-container-item">

                    <span v-if="dialogLook">{{addrFromData.post}}</span>
                    <el-input v-else type="text" placeholder="" v-model="addrFromData.post">
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="国家/省份/城市:" prop="ctData" class="postInfo-container-item">
                    <template>
                      <span v-if="dialogLook">{{addrFromData.country || '' +  ' ' + addrFromData.province || '' + ' ' + addrFromData.city || ''}}</span>
                      <el-cascader v-else clearable change-on-select style="width:60%" placeholder=""
                                   v-model="addrFromData.ctData" :options="seletData.ctDataOption" filterable>
                      </el-cascader>
                    </template>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="大洲:" class="postInfo-container-item">
                    <span v-if="dialogLook">{{addrFromData.continent}}</span>
                    <el-input v-else type="text" :disabled="true" placeholder="" v-model="addrFromData.continent">
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="fullRow">
                <el-col :span="24">
                  <el-form-item label="状态:" class="postInfo-container-item">
                    <template>
                      <span v-if="dialogLook">{{addrFromData.statusStr}}</span>
                      <el-select v-else default-first-option :clearable='true' placeholder="请选择"
                                 v-model="addrFromData.status" filterable>
                        <el-option v-for="item in seletData.statu" :key="String(item.typeName)" :label="item.typeName"
                                   :value="String(item.typeName)">
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
                      <span v-if="dialogLook">{{addrFromData.memo}}</span>
                      <el-input v-else type="textarea" :rows="2" style="width: 100%;" placeholder="请输入内容"
                                v-model="addrFromData.memo">
                      </el-input>
                    </template>
                  </el-form-item>
                </el-col>
              </el-row>

            </el-col>
          </el-row>

        </el-form>
        <div slot="footer" class="dialog-footer fl-ac-jc">
          <el-button size="small" @click="() => closeAddrDialog(false)">取 消</el-button>
          <el-button size="small" type="primary" v-if="title === '修改' || title === '新建'" @click="submitAddrData">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import {
    addCustomerAddrUrl,
    delCustomerAddrUrl,
    queryCustomerAddrListUrl,
    queryCustomerAddrUrl,
    updateCustomerAddrUrl
  } from "../../../../../api/customerList";

  export default {
    name: "CustAddr",
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
    watch: {
      "addrFromData.ctData": function (data, oldval) {
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
    data() {
      return {
        headFilters: {},
        postForm: {},
        dialogLook: false,
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
        addrList: [],
        dialogFormAddr: false,
        title: ''
      }
    },
    computed: {
      clientHeight() {
        return document.documentElement.clientHeight - 300
      },
    },
    created() {
      this.queryAddrList()
    },
    mounted() {
      // this.$emit('changeMask', '2')
    },
    methods: {
      filterHandler(value, row, column) {
        const property = column['property']
        return row[property] === value
      },
      addAddr() {
        this.$emit('changeMask', {type: 'add', value: this.tabNo})
        this.dialogFormAddr = true
        this.title = '新建'
      },
      submitAddrData() {
        if (this.title === '新建') {
          this.addrFromData.custId = this.custId
          addCustomerAddrUrl(this.addrFromData).then(response => {
            this.$message.success('新建成功!')
            this.closeAddrDialog(true)
          });
        } else if (this.title === '修改') {
          updateCustomerAddrUrl(this.addrFromData).then(res => {
            this.$message.success('修改成功!')
            this.closeAddrDialog(true)
          })
        }
      },
      delAddr(row, index) {
        this.$confirm("此操作将永久删除, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          delCustomerAddrUrl({addrId: row.addrId}).then(res => {
            this.$message.success('删除成功!')
            this.addrList.splice(index, 1)
            // this.closeAddrDialog(true)
          })
        })
      },
      closeAddrDialog(isSearch) {
        isSearch === true && this.queryAddrList()
        this.$emit('changeMask', {type: 'del', value: this.tabNo})
        this.dialogFormAddr = false
        this.addrFromData = {
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
        }
        this.title = ''
      },
      getcontinent(item) {
        var newItem
        this.seletData.ctDataOption.forEach(element => {
          if (element.value == item) {
            newItem = element.continentCn
            return
          }
        })
        return newItem
      },
      rowDbClick(row) {
        queryCustomerAddrUrl({addrId: row.addrId}).then(res => {
          this.$emit('changeMask', {type: 'add', value: this.tabNo})
          this.dialogFormAddr = true
          this.addrFromData = res.data
          this.$set(this.addrFromData, "ctData", []);
          this.addrFromData.ctData = [
            this.addrFromData.country,
            this.addrFromData.province,
            this.addrFromData.city
          ];
          if (this.editStatus) {
            this.dialogLook = false
            this.title = '修改'
          } else {
            this.dialogLook = true
            this.title = '查看'
          }
        })
      },
      queryAddrList() {
        queryCustomerAddrListUrl({custId: this.custId}).then(res => {
          this.addrList = res.data
          this.headFilters = this.$commonUtils.tableFilter(this.addrList)
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

  .addr-info {
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

  > > > .el-dialog__body {
    padding-top: 0;
  }
</style>
