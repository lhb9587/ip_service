<template>
  <div class="app-container">
    <div class="search-box">
      <div class="search-left">
        <el-input ref="searchRef" style="margin-right: 10px;" clearable placeholder="关键字模糊检索" size="small" prefix-icon="el-icon-search" @change="(value) => {!value && vagueSearch('')}" v-model="listQuery.keywords"
                  @keyup.enter.native="(e)=>vagueSearch(e.target.value, true)">
          <!--            <template slot="prepend"><span class="el-icon-search"></span></template>-->
        </el-input>
        <el-button-group class="button-group-search">
          <el-button type="primary" size="small" @click="getList('search')">搜索</el-button>
          <el-popover
            placement="bottom"
            width="550"
            trigger="click"
            v-model="drawerState"
          >
            <template>
              <el-form label-width="120px" :model="listQuery" size="mini" class="form-container">
                <el-form-item label="姓名" class="content-center">
                  <el-input v-model="listQuery.name" placeholder="请输入内容"></el-input>
                </el-form-item>
                <el-form-item label="所属客户" class="content-center">
                  <el-select default-first-option :clearable='true' v-model="listQuery.custId" no-match-text='暂无数据'
                             loading-text='正在查询' filterable remote reserve-keyword placeholder="请输入关键词"
                             :remote-method="remotepaternalUnit">
                    <el-option v-for="(item,key) in seletData.custnames" :key="key" :label="item.fullname"
                               :value="item.custId">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="客户国籍" class="content-center">
                  <el-select default-first-option :clearable='true' placeholder="请选择" v-model="listQuery.country"
                             filterable>
                    <el-option v-for="item in seletData.country" :key="String(item.countryCn)" :label="item.countryCn"
                               :value="String(item.countryCn)">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="联系人邮箱" class="content-center">
                  <el-input v-model="listQuery.email" placeholder="请输入内容" clearable></el-input>
                </el-form-item>
                <el-form-item label="来源场合" class="content-center">
                  <el-input v-model="listQuery.infoFromPlace" placeholder="请输入内容"></el-input>
                </el-form-item>
                <el-form-item label="标签" class="content-center">
                  <vue-tags-input
                    style="width: 50%"
                    allow-edit-tags
                    class="vue-tags-input"
                    v-model="listQuery.labelKey"
                    :tags="listQuery.labels&&listQuery.labels.map(item => ({text: item, classes: 'string'})) || []"
                    @tags-changed="changeTags"
                    placeholder="回车保存联系人标签"
                  >
                  </vue-tags-input>
                </el-form-item>
                <el-form-item label="创建日期" class="content-center">
                  <data-picker v-model="listQuery.createDateArray"></data-picker>
                </el-form-item>
                <el-form-item label="状态" class="content-center">
                  <el-checkbox-group v-model="listQuery.statuss">
                    <el-checkbox label="1212">在职</el-checkbox>
                    <el-checkbox label="1213">离职</el-checkbox>
                    <el-checkbox label="1215">退休</el-checkbox>
                    <el-checkbox label="1214">休假</el-checkbox>
                    <el-checkbox label="1216">其他</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
                <el-form-item label="添加来源">
                  <el-radio-group v-model="listQuery.isMobile" size="mini" style="margin-top: 7px">
                    <el-radio label="">全部</el-radio>
                    <el-radio label="2">pc</el-radio>
                    <el-radio label="1">小程序</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="客户类型">
                  <el-select v-model="listQuery.custBelongType" placeholder="请选择内容" multiple>
                    <el-option key="isCustomer" label="客户" value="isCustomer"></el-option>
                    <el-option key="isCollaboration" label="合作资源" value="isCollaboration"></el-option>
                    <el-option key="isOfficial" label="官方机构" value="isOfficial"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="主要联系人">
                  <el-radio-group v-model="listQuery.ismain" size="mini" style="margin-top: 7px">
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="业务领域" class="content-center">
                  <el-select default-first-option :clearable='true' v-model="listQuery.bustype" no-match-text='暂无数据'
                             loading-text='正在查询' filterable remote reserve-keyword placeholder="请输入关键词"
                             :remote-method="remoteDomain">
                    <el-option v-for="(item,key) in seletData.domainList" :key="key" :label="item"
                               :value="item">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-form>
              <div style="text-align:right">
                <el-button size="mini" @click="clearSeach"><span>重置</span></el-button>
                <el-button type="primary" size="mini" @click="getList('search')">搜索</el-button>
              </div>
            </template>
            <el-button slot="reference" style="padding: 8.5px 5px;" type="primary" size="small"
                       icon="el-icon-arrow-down"></el-button>
          </el-popover>

        </el-button-group>
        <el-button v-allow="67" style="height: 32px;" type="primary" size="small" @click="createOtherContact">
          <span class="el-icon-plus"></span>
          新建
        </el-button>
      </div>
    </div>
    <div style="position:relative;">
      <TitleTotal :total="total" v-if="total"/>
      <div v-else style="height: 30px;"></div>
      <el-button class="brush_right" :class="brushRightHasFilter?'red':''" @click="brushRight" type="text"
                 icon="el-icon-brush"></el-button>
      <div class="export" v-allow="424">
        <el-button type="text" @click="exportList(2)">导出</el-button>
        <span style="color: #52A2F4;margin: 0 5px"> / </span>
        <el-button type="text" @click="exportList(1)">全局导出</el-button>
        <!--      <el-button type="text"  @click="exportList(1)"><i class="el-icon-download">导出</i></el-button>-->
        <!--      <img @click="exportList(2)" src="@/assets/moon.png" style="width: 16px;height: 16px" width="16" alt="">-->
      </div>
      <!--    </div>-->
      <AgGridVue
        :style="{ width:'100%', height: clientHeight + 'px'}"
        class="ag-theme-balham"
        :columnDefs="columnDefs"
        :rowData="list"
        rowSelection="multiple"
        @grid-ready="onGridReady"
        @rowDoubleClicked="rowDoubleClicked"
        :gridOptions="gridOptions"
        :getContextMenuItems="getContextMenuItems"
        @sortChanged="refreshEvenRowsCurrencyData"
        @filterChanged="refreshEvenRowsCurrencyData"
        suppressAutoSize
        animateRows
        :localeText="$store.state.caseInformation.localeText"
        :suppressDragLeaveHidesColumns="true"
        :suppressMakeColumnVisibleAfterUnGroup="true"
        rowGroupPanelShow="always"
        :groupSelectsChildren="true"
        :suppressAggFuncInHeader="true"
      >
      </AgGridVue>

      <pagination :pageSizes="pageSizesList" v-show="total>0" :total="total" :page.sync="listQuery.pageNo"
                  :limit.sync="listQuery.pageSize" @pagination="getList"/>
    </div>

    <SelectOption :buss-id="bussId" v-if="selectionOptionState" :dialog-visible="selectionOptionState"
                  @cancel="closeSelect" :idArray="getCurrentRowsData('custContactId')"
                  :defaultMultipleSelect="preferenceList.map(i=>i.label)" :exportType="exportType"
                  :exportQueryModel="exportQueryModel"></SelectOption>

    <el-dialog
      :title="titleType"
      append-to-body
      :close-on-click-modal="false"
      :visible.sync="contactView"
      width="80%"
      height="80%"
      class="abow_dialog"
      :before-close="() => closeDialog(false)"
    >
      <DfDetail @updateCustomerContact="updateCustomerContact" @closeDialog="closeDialog"
                         ref="ContactDfDetail"
                         v-if="contactView" :isLook="isLook" :isEdit="isEdit" isDialog
                         :id="dfconFromData.custContactId"></DfDetail>
      <span slot="footer" class="dialog-footer fl-ac-jc">
        <el-button size="small" type="primary" v-if="titleType === '新建'" @click="createCustmer">创建</el-button>
        <el-button size="small" type="primary" v-if="titleType === '修改'" @click="updateCustomer">保存</el-button>
        <el-button size="small" @click="closeDialog(false)">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import VueTagsInput from '@johmun/vue-tags-input'
  import SelectOption from '@/views/workbench/case/components/SelectOption'
  import {
    queryCustomerContactListUrl,
    delCustomerContacturl,
    queryCustContactAllUrl,
    querycustSelectClass,
    queryCustomerNameIdUrl,
    queryCountryUrl,
    queryBusinessAreaUrl
  } from "@/api/customerList";
  import Pagination from "@/components/Pagination";
  import DfDetail from "@/views/workbench/customer_center/customer_other_contacts/DfDetail.vue"; // secondary package based on el-pagination
  export default {
    name: 'index',
    components: {DfDetail, Pagination, SelectOption, VueTagsInput},
    data() {
      return {
        defaultData: {
          pageNo: 1,
          pageSize: JSON.parse(localStorage.getItem('pageSize')) ? JSON.parse(localStorage.getItem('pageSize')).find(item => item.name == this.$route.name) ? JSON.parse(localStorage.getItem('pageSize')).find(item => item.name == this.$route.name).pageSize : 10 : 10,
          isCustomer: "1",
          custId: "",
          name: "",
          jobtitle: "",
          department: "",
          examineStatus: "",
          statuss: [],
          isMobile: "",
        },
        isEdit: false,
        isLook: false,
        dfconFromData: {
          custContactId: ''
        },
        contactView: false,
        titleType: '',
        exportQueryModel: {},
        exportType: '',
        bussId: 49,
        selectionOptionState: false,
        multipleTypeText: '',
        selectionState: false,
        brushRightHasFilter: false,
        pageSizesList: [10, 50, 200, 500, 1000, 5000, 10000],
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
        columnDefs: [],
        preferenceList: [
          {'label': '姓名', prop: 'name'},
          {'label': '所属客户', prop: 'custName'},
          {'label': '客户类型', prop: 'custBelongType'},
          {'label': '国籍', prop: 'custCountry'},
          {'label': '来源场合', prop: 'infoFromPlace'},
          {'label': '是否主要合作人', prop: 'ismain'},
          {'label': '业务领域', prop: 'bustype'},
          {'label': '职务', prop: 'jobtitle'},
          {'label': '部门', prop: 'department'},
          {'label': '办公电话', prop: 'tel'},
          {'label': '邮箱', prop: 'email'},
          {'label': '状态', prop: 'statusStr'},
        ],
        drawerState: false,
        dialogFormxy: false,
        list: [],
        total: 0,
        listLoading: true,
        listQuery: {
          keywords: '',
          pageNo: 1,
          pageSize: JSON.parse(localStorage.getItem('pageSize')) ? JSON.parse(localStorage.getItem('pageSize')).find(item => item.name == this.$route.name) ? JSON.parse(localStorage.getItem('pageSize')).find(item => item.name == this.$route.name).pageSize : 10 : 10,
          isCustomer: "1",
          custId: "",
          name: "",
          jobtitle: "",
          department: "",
          examineStatus: "",
          statuss: [],
          country: "",
          custId: "",
          infoFromPlace: "",
          isMobile: "",
        },
        deldata: {
          customerID: ""
        },
        seletData: {
          scStatu: {},
          country: {},
          custnames: {},
          level: {},
          names: {},
          domainList:[]
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
        isCreated: false,
        xyData: {
          custId: "",
          level: "",
          memo: ""
        }
      };
    },
    computed: {
      clientHeight() {
        return document.documentElement.clientHeight - 220
      },
    },
    created() {
      // this.getList();
      this.getallSelectData();
    },
    methods: {
      vagueSearch(e, forceSearch) {
        if (forceSearch) {
          this.getList('search')
        } else {
          if (!e) {
            this.$refs.searchRef.focus()
          } else {
            this.getList('search')
          }
        }
      },
      changeTags(newTags) {
        this.listQuery.labels = newTags.map(item => item.text)
      },
      rowDoubleClicked(params) {
        this.dfconFromData = JSON.parse(JSON.stringify(params.data))
        this.isEdit = true
        this.isLook = true
        this.contactView = true
        this.titleType = '查看'
      },
      updateCustomerContact() {
        this.isCreated = true
        this.closeDialog(true)
      },
      createCustmer() {
        this.$refs.ContactDfDetail.createDfContact()
      },
      updateCustomer() {
        this.$refs.ContactDfDetail.createCustAddr()
      },
      closeDialog(isSearch) {
        if (this.titleType === '新建' && !this.isCreated) {
          // this.$refs.ContactDfDetail.delCustomerContact()
        }
        isSearch === true && this.getList()
        this.contactView = false
        this.titleType = ''
        this.dfconFromData.custContactId = ''
        this.isCreated = false
        this.isEdit = false
        this.isLook = false
      },
      createOtherContact() {
        this.contactView = true
        this.titleType = '新建'
        this.isEdit = true
        this.isLook = false
        // addCustomerContactUrl().then(response => {
        //   if (response.success) {
        //     this.dfconFromData.custContactId = response.data.data.custContactId;
        //     this.contactView = true
        //     this.titleType = '新建'
        //     this.isEdit = true
        //     this.isLook = false
        //   }
        // })
      },
      getCurrentRowsData(key) {
        if (this.gridApi && this.gridApi.rowModel) {
          return this.gridApi.rowModel.rootNode.childrenAfterSort.map(item => item.data).map(item => item[key])
        }
        return []
      },
      getSelectedRows() {
        if (this.gridApi) {
          const selectedNodes = this.gridApi.getSelectedNodes();
          const selectedData = selectedNodes.map(node => node.data);
          return selectedData
        } else {
          return []
        }
      },
      exportList(flag) {
        this.exportType = flag
        if (flag == 2) {
          this.selectionOptionState = true;
          this.multipleTypeText = '列表导出';
          // this.exportListState=true
        } else if (flag == 1) {
          this.selectionOptionState = true
        }
      },
      closeSelect() {
        this.selectionState = false
        this.selectionOptionState = false
      },
      brushRight() {
        let data = this.gridApi.getFilterModel()
        let arr = Object.keys(data)
        arr.forEach(item => {
          this.gridApi.destroyFilter(item)
        })
      },
      refreshEvenRowsCurrencyData(params) {
        // this.currentPageSize = params.api.rowModel.rootNode.allChildrenCount
        if (!params.columnApi.columnController.groupAutoColumns) {
          this.gridApi.forEachNode(rowNode => {
            rowNode.setDataValue(
              'sid',
              rowNode.rowIndex + 1)
          })
        }
        if (params.type == "filterChanged") {
          // this.$commonUtils.saveFilterModel(this.$options.name+this.$route.name,'FilterModel',this.gridApi.getFilterModel())
          var data = this.gridApi.getFilterModel()
          var arr = Object.keys(data);
          if (arr.length) {
            this.brushRightHasFilter = true
          } else {
            this.brushRightHasFilter = false
          }
        }
      },
      cellRenderer(params) {
        if (params.colDef.field === 'sid') {
          return params.rowIndex + 1
        }
        if (params.colDef.field === 'ismain') {
          return params.value?'是':'否'
        }
        if (params.colDef.field === 'custBelongType') {
          const custTypeMap = {
            isCustomer:'客户',
            isCollaboration:'合作资源',
            isOfficial:'官方机构',
          }
          let translatedList = []
          if (params.value) {
            translatedList = params.value.map(key => {  
              return custTypeMap[key] || '';  
            });
          }
          return translatedList.join('；')
        }
        return `<span title="${params.value}">${params.value ? params.value : ''}</span>`
      },
      getContextMenuItems(params) {
        if (!params.node || !params.node.data) {
          return []
        }
        return this.getRowContextmenuList(params.node.data).map(item => ({
          name: item.name,
          action: () => {
            this[item.action](params.node.data, params.node.rowIndex, params.value, params.node)
          }
        }))
      },
      editFun(row) {
        this.dfconFromData = JSON.parse(JSON.stringify(row))
        this.isEdit = true
        this.isLook = false
        this.contactView = true
        this.titleType = '修改'

        // this.$router.push('/workbench/customer_management/contact_df_edit/' + row.custContactId)
      },
      delFun(row) {
        this.$confirm("此操作将永久删除, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            delCustomerContacturl({custContactId: row.custContactId}).then(
              response => {
                if (response.success) {
                  const index = this.list.indexOf(row);
                  this.list.splice(index, 1);
                  this.total--
                  this.$message({
                    type: "success",
                    message: "删除成功"
                  });
                } else {
                  this.$message.error(response.message);
                }
              }
            );
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      },
      getRowContextmenuList(row) {
        return [
          {name: '复制', action: 'copy'},
          // { name: '商标导入', action: 'installtmmessage', permissions: 185 },
          {name: '修改', action: 'editFun', permissions: 69},
          {name: '删除', action: 'delFun', permissions: 70}
        ].filter(item => {
          if (item.permissions) {
            return this.$store.getters.permissions.includes(item.permissions)
          } else {
            return true
          }
        })
      },
      onGridReady(params) {
        this.gridparams = params
        this.gridApi = params.api
        this.columnApi = params.columnApi
        params.api.sizeColumnsToFit()
      },
      clearSeach() {
        this.listQuery = Object.assign({}, this.defaultData);

        // this.total = "0";
      },
      getList(type) {
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
            defaultToNothingSelected: true,
            newRowsAction: 'keep',
            comparator: (a, b) => {
              return this.$commonUtils.sort(a, b, item.value)
            }
          }
        }))]
        if (type == "search") {
          this.listQuery.pageNo = "1";
        }
        this.listLoading = true;
        queryCustomerContactListUrl(this.listQuery).then(response => {
          this.list = response.data;
          this.total = response.total;
          this.listLoading = false;
          this.drawerState = false;
          this.exportQueryModel = JSON.stringify(this.listQuery)
        });
      },
      remotepaternalUnit(query) {
        if (query !== "") {
          queryCustomerNameIdUrl({keyword: query, isCustomer: 1}).then(response => {
            if (response.success) {
              this.seletData.custnames = response.data;
            } else {
              this.$message.error(response.message);
            }
          });
        }
      },
      remoteDomain(query) {
        // if (query !== "") {
          queryBusinessAreaUrl({bustype: query}).then(response => {
            if (response.success) {
              this.seletData.domainList = response.data;
            } else {
              this.$message.error(response.message);
            }
          });
        // }
      },
      getallSelectData() {
        querycustSelectClass({classId: "1130"}).then(response => {
          if (response.success) {
            this.seletData.scStatu = response.data["1130"];
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
        // queryCustContactAllUrl().then(response => {
        //   if (response.success) {
        //     this.seletData.names = response.data;
        //   } else {
        //     this.$message.error(response.message);
        //   }
        // });
        // querycustSelectClass({ classId: "1130,1099" }).then(response => {
        //   if (response.success) {
        //     this.seletData.scStatu = response.data["1130"];
        //     this.seletData.level = response.data["1099"];
        //   } else {
        //     this.$message.error(response.message);
        //   }
        // });
      },
      custAddrupdata(row, type) {
      },
      custAddrdel(row, type, index) {
        this.$confirm("此操作将永久删除, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            delCustomerContacturl({custContactId: row.custContactId}).then(
              response => {
                if (response.success) {
                  // const index = this.list.indexOf(row);
                  this.list.splice(index, 1);
                  this.$message({
                    type: "success",
                    message: "删除成功"
                  });
                } else {
                  this.$message.error(response.message);
                }
              }
            );
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";

  .el-table /deep/ th {
    background-color: #7199d5;
    color: #ffffff;
  }

  .el-row {
    margin-bottom: 5px;
  }

  .el-row:last-child {
    margin-bottom: 0;
  }

  .form-container /deep/ {
    max-height: 500px;
    overflow: auto;
    /*width: 550px;*/
    padding-bottom: 10px;

    .el-form-item__label {
      text-align: right;
      padding-left: 32px;
      font-weight: normal;
      float: left;
    }

    .el-form-item__content {
      display: flex;

      input {
        border-top: 0;
        border-left: 0;
        border-radius: 0;
        border-right: 0
      }
    }
  }

  > > > .content-center {
    .el-form-item__content {
      height: 28px;
      display: flex;
      align-items: center;
      /*justify-content: center;*/
    }
  }

  .brush_right {
    position: absolute;
    right: 15px;
    z-index: 1;
    top: 55px;
  }

  .export {
    position: absolute;
    right: 0;
    top: 0;
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

  .button-group-search {
    position: relative;
    display: flex;
    margin-right: 10px;

    .searchWrap {
      border-radius: 5px;
      top: 34px;
      left: 0;
      width: 550px;
      max-height: 500px;
      position: absolute;
      background: #ffffff;
      border: 1px solid #d4d5d5;
      z-index: 4;
      overflow: hidden;
      /*padding: 20px 0;*/
      box-shadow: 0 3px 6px rgba(111, 111, 111, 0.2);

      /deep/ .el-form {
        padding: 20px 20px 50px 0;

        .el-form-item__label {
          text-align: left;
          padding-left: 32px;
          font-weight: normal;
        }

        .el-form-item__content {
          display: flex;

          .el-select .el-input__inner {
            width: 100%;
          }

          input {
            border-top: 0;
            border-left: 0;
            border-radius: 0;
            border-right: 0;
          }

          .el-radio {
            line-height: 28px;
          }
        }
      }

      .clearWrap {
        display: flex;
        justify-content: flex-end;
        /*width: 100%;*/
        background: #fff;
        right: 10px;
        bottom: 0;
        padding-bottom: 10px;
        position: absolute;
        z-index: 1;
      }
    }
  }

  .DataPicker /deep/ {
    line-height: 28px;

    .el-input__prefix {
      display: none !important;
    }

    .el-input__inner {
      text-align: left;
      padding-left: 15px;
      padding-right: 18px;
    }
  }

  .abow_dialog {
    > > > .el-dialog {
      position: absolute;
      top: 50%;
      left: 50%;
      margin: 0 !important;
      transform: translate(-50%, -50%);
      min-height: calc(60%);
      max-height: calc(100% - 30px);
      max-width: calc(100% - 30px);
      display: flex;
      flex-direction: column;
    }

    > > > .el-dialog__body {
      overflow: auto;
      padding: 0 10px 10px 10px;
    }
  }
</style>

