<template>
  <div class="industry-info">
    <div class="search-box">
      <div class="search-left">
        <div>
          <el-input placeholder="品牌检索" size="small" prefix-icon="el-icon-search" @change="queryList()"
                    v-model="listQuery.pinpai"
                    @keyup.enter.native="(e)=>queryList()">
            <!--            <template slot="prepend"><span class="el-icon-search"></span></template>-->
          </el-input>
        </div>
        <div class="search-left">
          <div>
            <el-select size="small" style="width: 100%;" default-first-option :clearable='true' v-model="listQuery.custId"
                       no-match-text='暂无数据' @change="queryList"
                       loading-text='正在查询' filterable remote reserve-keyword placeholder="客户检索"
                       :remote-method="remotepaternalUnit1">
              <el-option v-for="(item,key) in custnameList" :key="key" :label="item.fullname"
                         :value="item.custId">
              </el-option>
            </el-select>
          </div>
        </div>
        <el-button style="height: 32px;margin-left: 10px" type="primary" size="small" @click="addIndustry">
          <span class="el-icon-plus"></span>
          新建
        </el-button>
      </div>
    </div>
    <TitleTotal :total="total"/>
    <AgGridVue
      :style="{width:'100%',height: clientHeight+'px'}"
      class="ag-theme-balham"
      :columnDefs="columnDefs"
      :rowData="brandList"
      rowSelection="multiple"
      @grid-ready="onGridReady"
      :gridOptions="gridOptions"
      :getContextMenuItems="getContextMenuItems"
      suppressAutoSize
      @rowDoubleClicked="rowDbClick"
      animateRows
      @sortChanged="refreshEvenRowsCurrencyData"
      @filterChanged="refreshEvenRowsCurrencyData"
      :localeText="$store.state.caseInformation.localeText"
    >
    </AgGridVue>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :pageSizes="pageSizesList"
                :limit.sync="listQuery.pageSize" @pagination="queryList()"/>


    <el-dialog
      :title="'品牌 - ' + title"
      :show-close="true"
      :close-on-click-modal="false" :modal="true"
      :visible.sync="brandView"
      width="50%"
      class="abow_dialog"
    >
      <div class="box-border">
        <el-form label-position="left" label-width="120px"
                 style="width: 100%;">
          <el-row class="form-border">
            <el-col :span="24">
              <el-row class="fullRow">
                <el-col :span="24">
                  <el-form-item label="客户:" class="postInfo-container-item">
                    <div v-if="title === '新建' || title === '修改'">
                      <el-select style="width: 100%;" default-first-option :clearable='true' v-model="brandData.custId"
                                 no-match-text='暂无数据'
                                 loading-text='正在查询' filterable remote reserve-keyword placeholder="请输入关键词"
                                 :remote-method="remotepaternalUnit">
                        <el-option v-for="(item,key) in custnames" :key="key" :label="item.fullname"
                                   :value="item.custId">
                        </el-option>
                      </el-select>
                    </div>
                    <div v-else>{{brandData.custName}}</div>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="fullRow">
                <el-col :span="24">
                  <el-form-item label="图标:" class="postInfo-container-item">
                    <div v-if="title === '新建' || title === '修改'">
                      <el-upload :action='creatematerial' ref='userIconupload' :data='usericonSendData'
                                 :on-success='iconSendSuccess'
                                 accept="image/jpeg,image/gif,image/png"
                                 :before-upload="onBeforeUploadIcon" :show-file-list="false" :auto-upload='false'
                                 :multiple="false"
                                 name='attachFile'
                                 :on-change="handleAvatarChange">
                        <div v-if="brandData.address && !iconIsDel" style="position: relative;padding-top: 10px"
                             @mouseenter="showDelIcon"
                             @mouseleave="hideDelIcon">
                          <img v-if="userIconCust" :src="userIconCust" class="avatar">
                          <div @click.stop="btnDelete()" class="mask" v-show="isShow"
                               style="position:absolute; bottom: 0px; background-color: #000; opacity: 0.8; height: 20px; width: 100%">
                            <i class="el-icon-delete"
                               style="position:absolute; left: 43px;bottom: 3px; color: #fff;"></i>
                          </div>
                        </div>
                        <i v-else="!postForm.userIcon" class="el-icon-plus avatar-uploader-icon"></i>
                      </el-upload>
                    </div>
                    <img v-if="userIconCust && title === '查看'" :src="userIconCust" class="avatar">
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="fullRow">
                <el-col :span="24">
                  <el-form-item label="品牌:" class="postInfo-container-item">
                    <div v-if="title === '新建' || title === '修改'">
                      <el-input placeholder="请填写:"
                                v-model="brandData.pinpai"></el-input>
                    </div>
                    <div v-else>{{brandData.pinpai}}</div>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="fullRow">
                <el-col :span="24">
                  <el-form-item label="描述:" class="postInfo-container-item">
                    <div v-if="title === '新建' || title === '修改'">
                      <el-input size="mini" type="textarea" class="edit-border" placeholder="请填写:"
                                v-model="brandData.ppdesc"></el-input>
                    </div>
                    <div v-else>{{brandData.ppdesc}}</div>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="fullRow">
                <el-col :span="24">
                  <el-form-item label="创建日期:" class="postInfo-container-item">
                    {{brandData.createDate}}
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer fl-ac-jc">
          <el-button size="small" @click="() => closeDialog(false)">取 消</el-button>
          <el-button size="small" type="primary" v-if="title === '新建' || title === '修改'"
                     @click="submitData">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
  import {creatematerial} from '@/api/ipServiceApi.config.js'
  import {
    addCustomerIndustry, addCustomerPinpai, delCustomerIndustry, delCustomerPinpai, deleteCustomerIcon,
    queryCustomerIndustry, queryCustomerNameIdUrl, queryCustomerPinpai,
    queryIndustryTag,
    queryIndustryUrl, saveCustomerPinpai,
    updateCustomerIndustry, updateCustomerPinpai
  } from "../../../../api/customerList";
  import Pagination from "@/components/Pagination";
  import {queryCustomerNameId} from "../../../../api/caseList";

  export default {
    name: "brandList",
    components: {
      Pagination
    },
    computed: {
      clientHeight() {
        return document.documentElement.clientHeight - 210
      }
    },
    data() {
      return {
        pageSizesList: [10, 50, 100, 200, 500, 1000],
        listQuery: {
          pinpai: '',
          custId: '',
          pageNo: 1,
          pageSize: JSON.parse(localStorage.getItem('pageSize')) ? JSON.parse(localStorage.getItem('pageSize')).find(item => item.name == this.$route.name) ? JSON.parse(localStorage.getItem('pageSize')).find(item => item.name == this.$route.name).pageSize : 10 : 10,
        },
        gridOptions: {
          ...this.$store.state.caseInformation.gridOptions, ...{
            statusBar: {
              statusPanels: [
                {statusPanel: 'agTotalAndFilteredRowCountComponent', align: 'left'},
                {statusPanel: 'agSelectedRowCountComponent', align: 'left'}
              ]
            }
          }
        },
        gridparams: {},
        gridApi: {},
        columnApi: {},
        total: 0,
        brandList: [],
        columnDefs: [],
        isShow: false,
        userIconCust: '',
        iconIsDel: false,
        usericonSendData: {
          tokenID: "",
          custId: ""
        },
        creatematerial,
        title: '',
        brandView: false,
        brandData: {
          custId: '',
          ppId: '',
          pinpai: '',
          ppdesc: '',
          materialId: '',
          address: '',
          createDate: this.$wUtil.getDate('', 'day')
        },
        brandList: [],
        industry: [],
        industryTagList: [],
        defaultcolumnDefs: [
          {
            headerName: '序号',
            field: 'sid',
            width: 60,
            'pinned': 'left', // 固定再左边
            enableRowGroup: true,
            // enablePivot: true,
            floatingFilter: true,
            filter: false,
            cellClass: 'vAlign',
            suppressMenu: true,
            checkboxSelection: false,
            headerCheckboxSelection: false,
            headerCheckboxSelectionFilteredOnly: true,
            cellRenderer: this.cellRenderer
          }
        ],
        custnames: [],
        custnameList: []
      }
    },
    created() {
      this.preferenceList = [
        {'label': '品牌', prop: 'pinpai'},
        {'label': '客户', prop: 'custName'},
        {'label': '图标', prop: 'address'},
        {'label': '描述', prop: 'ppdesc'},
        {'label': '创建日期', prop: 'createDate'},
        {'label': '修改日期', prop: 'modifyDate'},
      ]
      this.columnDefs = [...this.defaultcolumnDefs, ...this.preferenceList.map(item => ({
        headerName: item.label,
        field: item.prop,
        resizable: true,
        sortable: true,
        width: item.width,
        filter: 'agSetColumnFilter',
        cellRenderer: this.cellRenderer,
        menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
        enableRowGroup: true,
        filterParams: {
          newRowsAction: 'keep',
          comparator: (a, b) => {
            return this.$commonUtils.sort(a, b, item.value)
          }
        }
      }))]
      this.queryList()
    },
    methods: {
      remotepaternalUnit(query) {
        if (query !== "") {
          Promise.all([
            //   queryCustomerNameId({
            //   pageNo: 1,
            //   pageSize: 100,
            //   custIdArray: [this.brandData.custId]
            // }),
            queryCustomerNameIdUrl({keyword: query, isCustomer: 1, pageSize: 100})]).then(res => {
            this.custnames = this.$commonUtils.unique(res[0].data, 'custId')
          })
        }
      },
      remotepaternalUnit1(query) {
        if (query !== "") {
          Promise.all([
            queryCustomerNameIdUrl({keyword: query, isCustomer: 1, pageSize: 100})]).then(res => {
            this.custnameList = this.$commonUtils.unique(res[0].data, 'custId')
          })
        }
      },
      submitData() {
        if (!this.brandData.custId) {
          this.$message.error("请先选择客户！")
          return
        }
        if (this.title === '修改') {
          delete this.brandData.caseIdList
          delete this.brandData.createDate
          delete this.brandData.modifyDate
          updateCustomerPinpai(this.brandData).then(res => {
            this.$message.success('修改成功!')
            this.closeDialog(true)
          })
        } else {
          addCustomerPinpai(this.brandData).then(res => {
            this.$message.success('新建成功!')
            this.closeDialog(true)
          })
        }
      },
      closeDialog(isSearch) {
        isSearch === true && this.queryList()
        this.title = ''
        this.userIconCust = ''
        this.brandData = {
          custId: '',
          ppId: '',
          pinpai: '',
          ppdescL: '',
          createDate: '',
          modifyDate: '',
          materialId: '',
          address: ''
        }
        this.brandView = false
        this.$emit('changeMask', {type: 'del', value: this.tabNo})
      },
      editFun(data) {
        this.rowDbClick({data}, '修改')
      },
      rowDbClick(params, title) {
        this.brandData = JSON.parse(JSON.stringify(params.data))
        if (title) {
          this.remotepaternalUnit(this.brandData.custName)
        }
        if (this.brandData.address) {
          this.userIconCust = `/ipdoc${this.brandData.address}`
        }
        this.title = title || '查看'
        this.brandView = true
      },
      delBrand(row, index) {
        this.$confirm("此操作将永久删除, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          delCustomerPinpai({
            ppId: row.ppId
          }).then(res => {
            this.$message.success('删除成功!')
            this.brandList.splice(index, 1)
          })
        })
      },
      addIndustry() {
        this.title = '新建'
        this.brandView = true
      },
      queryList() {
        queryCustomerPinpai({...this.listQuery}).then(res => {
          this.brandList = res.data || []
          this.total = res.total
        })
      },
      btnDelete() {
        this.iconIsDel = true
        this.brandData.materialId = ''
        this.brandData.address = ''
      },
      hideDelIcon() {
        this.isShow = false
      },
      showDelIcon() {
        this.isShow = true
      },
      isItemTrue(item) {
        if (!this.customerData[item]) {
          this.$message.error("请填写必填项")
          return false
        } else {
          return true
        }
      },
      handleAvatarChange(file, fileList) {
        this.$refs.userIconupload.submit()
      },
      onBeforeUploadIcon(file) {
        this.usericonSendData.tokenID = this.$store.getters.token
        this.usericonSendData.custId = this.brandData.custId
        const isIMAGE = file.type === "image/jpeg" || "image/gif" || "image/png"
        const isLt1M = file.size / 1024 / 1024 < 1
        if (!isIMAGE) {
          this.$message.error("上传文件只能是图片格式!")
        }
        if (!isLt1M) {
          this.$message.error("上传文件大小不能超过 1MB!")
        }
        if (!this.brandData.custId) {
          this.$message.error("请先选择客户！")
        }
        return isIMAGE && isLt1M && this.brandData.custId
      },
      iconSendSuccess(response, file, fileList) {
        if (response.success) {
          this.iconIsDel = false
          this.brandData.address = response.data[0] && `/ipdoc${response.data[0].address}`
          this.brandData.materialId = response.data[0] && response.data[0].materialId
          this.userIconCust = response.data[0] && `/ipdoc${response.data[0].address}`
          this.$message.success(response.message)
        } else {
          this.$message.error(response.message)
          this.brandData.address = ''
        }
      },
      cellRenderer(params) {
        if (params.colDef.field === 'sid') {
          return params.rowIndex + 1
        }
        if (params.colDef.field === 'address') {
          if (params.value) {
            return `<img class="filterTableTmg" src="${'/ipdoc' + params.value}" width="60" height="60">`
          } else {
            return ''
          }
        }
        return `<span title="${params.value}">${params.value ? params.value : ''}</span>`
      },
      refreshEvenRowsCurrencyData(params) {
        if (!params.columnApi.columnController.groupAutoColumns) {
          this.gridApi.forEachNode(rowNode => {
            rowNode.setDataValue(
              'sid',
              rowNode.rowIndex + 1)
          })
        }
      },
      getContextMenuItems(params) {
        if (!params.node || !params.node.data) {
          return []
        }
        return this.getRowContextmenuList(params.node.data).map(item => ({
          name: item.name,
          action: () => {
            this[item.action](params.node.data, params.value, params.node)
          }
        }))
      },
      getRowContextmenuList(row) {
        return [
          {name: '复制', action: 'copy'},
          {name: '修改', action: 'editFun'},
          {name: '删除', action: 'handledeleElement'}
        ].filter(item => {
          if (item.permissions) {
            if (item.examineStatusStr) {
              return this.$store.getters.permissions.includes(item.permissions) && row.examineStatusStr === item.examineStatusStr
            }
            return this.$store.getters.permissions.includes(item.permissions)
          } else {
            return true
          }
        })
      },
      copy(row, value) {
        if (value) {
          this.$copyText(value).then(
            res => {
            })
        }
      },
      onGridReady(params) {
        this.gridparams = params
        this.gridApi = params.api
        this.columnApi = params.columnApi
        params.api.sizeColumnsToFit()
      },

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

  .industry-info {
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
      text-align: right;
    }

    /deep/ .el-form-item {
      display: flex;
      height: 100%;
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
      text-align: left;
      padding: 5px;
      /*height: 30px;*/
      margin-left: 0 !important;
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
      /*border: none;*/
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
    max-height: 500px;
    overflow: auto;
  }

  /deep/ .el-form-item__content {
    text-align: center;

    .el-form-item__error {
      position: relative;
      text-align: left;
      left: 0;
      top: 0;
    }
  }

  /*.edit-border {*/
  /*  /deep/ .el-input__inner {*/
  /*    border: 1px solid #fff;*/
  /*    font-size: 14px;*/
  /*    color: #000000;*/
  /*    padding-left: 0;*/

  /*    &:hover {*/
  /*      border-radius: 0;*/
  /*      border-bottom: 1px solid #f2f2f2;*/
  /*    }*/
  /*  }*/
  /*}*/

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
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
    border: 1px dashed #d9d9d9;
  }

  .avatar {
    width: 100px;
    height: 100px;
    display: block;
  }

  .search-box {
    display: flex;
    justify-content: space-between;
    height: 70px;
    width: 100%;
    margin-top: 15px;
    border: 2px solid #F2F2F2;
    border-bottom: 2px solid #52A0F5;
    border-radius: 5px 5px 0 0;

    .search-left {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-left: 15px;
    }
  }
</style>
