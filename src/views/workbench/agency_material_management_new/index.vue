<template>
  <div style="padding:15px">
    <div style="padding-bottom: 15px">
      <search-cpn
        :fileKinds="fileKinds"
        :continentList="continentList"
        :caseTypeList="caseTypeList"
        :nwDocTypeList="nwDocTypeList"
        @handleSearch="handleSearch"/>
      <el-dropdown @command="handleCreateCommand">
        <el-button size="small" type="primary">新建<i class="el-icon-arrow-down el-icon--right"></i></el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="文件" v-if="$route.query.sortId && $route.query.sortId !== '0'">上传文件</el-dropdown-item>
          <el-dropdown-item command="文件夹">新建文件夹</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button size="small" type="primary" @click="moveFiles" v-allow="359">移动</el-button>
      <el-button size="small" type="primary" @click="copyFiles" v-allow="359" style="margin-left: 0;">复制</el-button>
    </div>
    <breadcrumb
      ref="breadcrumb"
      :breadcrumbList="breadcrumbList"
      @refreshCurrentPath="refreshCurrentPath"
      @searchFile="searchFile"></breadcrumb>
    <div class="table-wrapper">
      <table-list
          ref="tableList"
          :fileList="fileList"
          @updatePermission="updatePermission"
          @editFun="editFun"
          @handledeleElement="handledeleElement"
          @clearFileName="clearFileName"
          @selectionChange="selectionChange"/>
    </div>
    <div style="display: flex;justify-content: right;margin-top: 10px">
      <pagination
        :key="fileData.sortId || 0"
        v-if="total>0"
        :total="total"
        :page.sync="listQuery.pageNo"
        :limit.sync="listQuery.pageSize"
        @pagination="() => queryFileList(isTopSearch)"
        :pageSizes="pageSizeList"
      />
    </div>

    <el-dialog
      :title="dialogTitle"
      :append-to-body="true"
      :visible.sync="uploadFileView"
      width="50%"
      class="abow_dialog"
      :before-close="(done) => {dialogClose(); done()}"
    >
      <el-form size="mini" label-width="120px" ref="postForm" :model="fileData">
        <el-form-item label="国家/地区:">
          <el-tree
            @check="checkNode"
            :data="continentList"
            show-checkbox
            :default-expand-all="false"
            node-key="id"
            ref="tree"
            highlight-current
            :props="defaultProps">
          </el-tree>
        </el-form-item>
        <el-form-item label="合作所:" prop="custId">
          <el-select
            style="width: 80%;"
            v-model="fileData.custId"
            ref="custSelect"
            filterable
            clearable
            remote
            reserve-keyword
            placeholder="请输入事务所名称"
            :remote-method="(v) => $wUtil.debounce(queryCustomerList(v), 500)">
            <el-option
              v-for="item in customerNameIdList"
              :key="item.custId"
              :label="item.fullname"
              :value="item.custId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文件分类:" prop="doctId">
          <el-select
            style="width: 80%;"
            v-model="fileData.doctId"
            ref="custSelect"
            filterable
            clearable
            @change="(v) => {fileData.doctId = v || '';fileData.docName = fileKinds.find(item => item.doctId === fileData.doctId)&&fileKinds.find(item => item.doctId === fileData.doctId).typeName || ''}"
          >
            <el-option
              v-for="item in fileKinds"
              :key="item.doctId"
              :label="item.typeName"
              :value="item.doctId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文件类型:">
          <el-select
            style="width: 80%;"
            v-model="fileData.materialTypeId"
            ref="custSelect"
            filterable
            clearable
          >
            <el-option
              v-for="item in fileTypeList"
              :key="item.materialTypeId"
              :label="item.typeName"
              :value="item.materialTypeId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文件名称:">
          <el-input style="width: 80%;" size="mini" v-model="fileData.materialName"></el-input>
        </el-form-item>
        <el-form-item label="案件类型:">
          <el-select
            style="width: 80%;"
            v-model="fileData.caseTypeIdList"
            ref="custSelect"
            filterable
            clearable
            multiple
          >
            <el-option
              v-for="item in caseTypeList"
              :key="item.nwTypeId"
              :label="item.nwType"
              :value="item.nwTypeId"
            >
            </el-option>
          </el-select>
          <el-popover
            trigger="click"
            ref="dcPopover"
            placement="top"
            width="300"
          >
            <p>增加案件类型:</p>
            <div style="text-align: right; margin-top: 10px">
              <el-form>
                <el-form-item label="类型名称">
                  <el-input placeholder="请输入案件类型" v-model="addCaseTypeValue"></el-input>
                </el-form-item>
              </el-form>
              <el-button style="margin-top: 10px" size="mini" @click="closePop">取消</el-button>
              <el-button style="margin-top: 10px" type="primary" size="mini" @click="createCaseType">确定</el-button>
            </div>
            <el-button size="mini" type="primary" slot="reference">增加</el-button>
          </el-popover>
        </el-form-item>
        <el-form-item label="关键字:">
          <vue-tags-input
            v-if="uploadFileView"
            v-model="fileData.keyword"
            :tags="fileData.keywordList"
            @tags-changed="changeTags"
            placeholder="回车保存关键字"
          >
          </vue-tags-input>
        </el-form-item>
        <el-form-item label="备注:">
          <el-input type="textarea" style="width: 80%;" size="mini" v-model="fileData.memo"></el-input>
        </el-form-item>
        <el-form-item label="文件归类:">
          <el-select
            style="width: 80%;"
            v-model="fileData.nwDoctId"
            ref="custSelect"
            filterable
            clearable
          >
            <el-option
              v-for="item in nwDocTypeList"
              :key="item.nwDoctId"
              :label="item.nwTypeName"
              :value="item.nwDoctId"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="fl-ac-jc">
        <el-button size="mini" @click="() => dialogClose()">取 消</el-button>
        <el-button size="mini" type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog :visible.sync="createDirView" title="新建文件夹" width="30%" :close-on-click-modal="false">
      <el-form size="default">
        <el-form-item label="文件夹名称:" prop="dirName">
          <el-input v-model="dirName" placeholder="请输入文件夹名称"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="fl-ac-jc">
        <el-button size="mini" @click="dialogClose">取 消</el-button>
        <el-button size="mini" type="primary" @click="createDir">确 定</el-button>
      </span>
    </el-dialog>

    <uploadFile
      :clickUpload="clickUpload"
      @getUploadFile="getUploadFile"
      :multiple="true"
      @changeClick="clickUpload=false"></uploadFile>
  </div>
</template>

<script>
  import breadcrumb from './breadcrumb'
  import VueTagsInput from '@johmun/vue-tags-input'
  import {
    fetchList
  } from '@/api/customerList'
  import {
    queryCountryList,
    queryNwMaterial,
    queryNwCaseTypeList,
    createNwCaseType,
    createNwMaterial
  } from '@/api/material'
  import UploadFile from '../material_management/components/uploadFile'
  import {
    createDir, deleteDir,
    modifyNwMaterial,
    queryContinent,
    queryNwDocTypeList
  } from '../../../api/material'
  import { queryMaterialDocType, queryMaterialTypeByDocId } from '../../../api/caseList'
  import Pagination from '../../../components/Pagination/index'
  import TableList from './tableList'
  import SearchCpn from './searchCpn'

  export default {
    name: 'index',
    components: { SearchCpn, TableList, Pagination, UploadFile, VueTagsInput, breadcrumb },
    data() {
      return {
        isTopSearch: false,
        searchFileName: '',
        breadcrumbList: [],
        isSearch: false,
        listQuery: {
          pageNo: 1,
          pageSize: 10
        },
        total: 0,
        pageSizeList: [10, 20, 50, 100, 500],
        dirName: '',
        createDirView: false,
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        defaultCountryList: [],
        addCaseTypeValue: '',
        clickUpload: false,
        dialogTitle: '',
        fileList: [],
        fileTableHeader: {},
        fileData: {
          nwDoctId: '',
          sortId: '',
          countryIdList: [],
          // nwCountryId: '',
          custId: '',
          doctId: '',
          docName: '',
          materialName: '',
          materialTypeId: '',
          memo: '',
          keyword: '',
          keywordList: [],
          caseTypeIdList: []
        },
        uploadFileView: false,
        custIdDisabled: false,
        curFile: [],
        searchCustomerList: [],
        customerNameIdList: [],
        caseTypeList: [],
        searchFileTypeList: [],
        fileTypeList: [],
        fileKinds: [],
        continentList: [],
        nwDocTypeList: [],
        selectionList: [],
        drawerState: false
      }
    },
    watch: {
      // isSearch(n) {
      //   this.listQuery = {
      //     pageSize: 10,
      //     pageNo: 1
      //   }
      // },
      $route: {
        handler: function(val, oldVal) {
          this.fileData.sortId = this.$route.query.sortId || 0
          this.setSessionPage()
          this.queryNwMaterial()
        },
        immediate: true
      },
      'fileData.doctId': {
        handler(n) {
          if (n) {
            this.queryMaterialTypeByDocId(n)
          }
        },
        immediate: true
      }
    },
    created() {
      this.listQuery.pageNo = sessionStorage.getItem('nwFilePage') && JSON.parse(sessionStorage.getItem('nwFilePage'))[String(this.fileData.sortId)] ? JSON.parse(sessionStorage.getItem('nwFilePage'))[String(this.fileData.sortId)].pageNo : 1
      this.listQuery.pageSize = sessionStorage.getItem('nwFilePage') && JSON.parse(sessionStorage.getItem('nwFilePage'))[String(this.fileData.sortId)] ? JSON.parse(sessionStorage.getItem('nwFilePage'))[String(this.fileData.sortId)].pageSize : 10
      this.queryNwDocTypeList()
      this.queryContinent()
      this.queryNwCaseTypeList()
      this.queryMaterialDocType()
      this.fileTableHeader = localStorage.getItem('fileTableHeader') ? JSON.parse(localStorage.getItem('fileTableHeader')) : {}
    },
    methods: {
      updatePermission() {
        this.queryNwMaterial()
      },
      setSessionPage() {
        if (sessionStorage.getItem('nwFilePage')) {
            if (JSON.parse(sessionStorage.getItem('nwFilePage'))[String(this.fileData.sortId)]) {
              this.listQuery.pageNo = JSON.parse(sessionStorage.getItem('nwFilePage'))[String(this.fileData.sortId)].pageNo
              this.listQuery.pageSize = JSON.parse(sessionStorage.getItem('nwFilePage'))[String(this.fileData.sortId)].pageSize
            } else {
              this.listQuery.pageNo = 1
              this.listQuery.pageSize = 10
              sessionStorage.setItem('nwFilePage', JSON.stringify({...JSON.parse(sessionStorage.getItem('nwFilePage')), [String(this.fileData.sortId)]: this.listQuery}))
            }
          } else {
            sessionStorage.setItem('nwFilePage', JSON.stringify({[String(this.fileData.sortId)]: this.listQuery}))
          }
      },
      refreshCurrentPath(){
        this.searchFileName = undefined
        this.queryFileList(false)
      },
      selectionChange(list) {
        this.selectionList = list
      },
      handleSearch(data) {
        this.searchData = data
        this.queryFileList(true)
      },
      clearFileName() {
        this.$refs.breadcrumb.clearFileName()
        this.searchFileName = undefined
      },
      searchFile(name) {
        this.isTopSearch = false
        this.searchFileName = name
        this.fileData.sortId = this.$route.query.sortId || 0
        this.listQuery.pageSize = 10
        this.listQuery.pageNo = 1
        queryNwMaterial({ name, sortId: this.$route.query.sortId || 0, ...this.listQuery }).then(res => {
          this.fileList = res.data.data
          this.total = res.total
          this.breadcrumbList = res.data.pathList || []
        })
      },
      queryFileList(isSearch) {
        this.isTopSearch = isSearch === true
        if(!isSearch) {
          if (sessionStorage.getItem('nwFilePage') && JSON.parse(sessionStorage.getItem('nwFilePage'))[String(this.fileData.sortId)]) {
            const obj = JSON.parse(sessionStorage.getItem('nwFilePage'))
            obj[String(this.fileData.sortId)].pageNo = this.listQuery.pageNo
            obj[String(this.fileData.sortId)].pageSize = this.listQuery.pageSize
            sessionStorage.setItem('nwFilePage', JSON.stringify(obj))
          }
        } else {
          this.listQuery.pageSize = 10
          this.listQuery.pageNo = 1
        }
        this.queryNwMaterial(this.isTopSearch)
      },
      moveFiles () {
        if (!this.selectionList.length) {
          this.$message.error('请选择文件或文件夹!')
          return
        }
        this.$refs.tableList.moveFiles(this.selectionList)
      },
      copyFiles () {
        if (!this.selectionList.length) {
          this.$message.error('请选择文件或文件夹!')
          return
        }
        this.$refs.tableList.copyFiles(this.selectionList)
      },
      async delFiles() {
        if (!this.selectionList.length) {
          this.$message.error('请选择文件或文件夹!')
          return
        }
        const sortIdList = this.selectionList.filter(item => item.isDir).map(item => item.sortId)
        let res = {
          data: {
            data: []
          }
        }
        let notice = '此操作将永久删除'
        if (sortIdList.length) {
          res = await queryNwMaterial({sortIdList})
          if (res.data.data && res.data.data.length) {
              notice = '所选文件夹中存在文件，此操作将永久删除'
          } else {
            notice = '此操作将永久删除'
          }
        }
        // queryNwMaterial()
        this.$confirm(`${notice}, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(res => {
          deleteDir({
            materialIdList: this.selectionList.filter(item => !item.isDir).map(row => row.materialId),
            sortIdList: this.selectionList.filter(item => item.isDir).map(row => row.sortId)
          }).then(res => {
            this.$message.success('删除成功!')
            this.dialogClose(true)
          })
        })
      },
      queryNwDocTypeList() {
        queryNwDocTypeList().then(res => {
          this.nwDocTypeList = res.data
        })
      },
      createDir() {
        if (this.dirName === '') {
          this.$message.error('请输入文件夹名称')
          return
        }
        createDir({
          sortName: this.dirName,
          sortId: this.$route.query.sortId || 0
        }).then(res => {
          this.$message.success('创建文件夹成功！')
          this.dialogClose(true)
        })
      },
      checkNode(current, { checkedKeys }) {
        this.fileData.countryIdList = checkedKeys
      },
      queryContinent() {
        queryContinent().then(res => {
          this.continentList = res.data
        })
      },
      queryCountryList() {
        queryCountryList({
          pageNo: 1,
          pageSize: 99999
        }).then(res => {
          this.defaultCountryList = res.data
        })
      },
      handleCreateCommand(key) {
        if (key === '文件') {
          this.clickUpload = true
        } else if (key === '文件夹') {
          this.createDirView = true
        }
      },
      closePop() {
        this.$refs.dcPopover.doClose()
        this.addCaseTypeValue = ''
      },
      createCaseType() {
        createNwCaseType({
          nwType: this.addCaseTypeValue
        }).then(res => {
          this.$message.success('增加成功!')
          this.queryNwCaseTypeList()
          this.closePop()
        })
      },
      changeTags(newTags) {
        this.fileData.keywordList = newTags.map(item => item.text)
      },
      queryNwCaseTypeList() {
        queryNwCaseTypeList().then(res => {
          this.caseTypeList = res.data
        })
      },
      queryMaterialTypeByDocId(doctId) {
        queryMaterialTypeByDocId({ doctId }).then(res => {
          this.fileTypeList = res.data
        })
      },
      async queryCustomerList(query) {
        if (query !== '') {
          await fetchList({
            pageNo: 1,
            pageSize: 100,
            isCollaboration: 1,
            keyword: query,
            companyType: '外代所'
          }).then(res => {
            this.customerNameIdList = res.data
          })
        }
      },
      queryMaterialDocType() {
        queryMaterialDocType().then(res => {
          this.fileKinds = res.data
        })
      },
      async submit() {
        await new Promise((res) => {
          setTimeout(() => {
            res()
          }, 100)
        })
        if (this.dialogTitle === '新建') {
          this.uploadFileFunc()
        } else if (this.dialogTitle === '修改') {
          this.editFileFunc()
        }
      },
      editFileFunc() {
        modifyNwMaterial({...this.fileData, modifyDate: undefined, createDate: undefined}).then(res => {
          this.$message.success('修改成功!')
          this.dialogClose(true)
        })
      },
      async getUploadFile(e) {
        let arr = []
        for (var i = 0; i < e.target.files.length; i++) {
          arr.push(e.target.files[i])
        }
        this.curFile = arr
        this.uploadFileView = true
        this.dialogTitle = '新建'
      },
      uploadFileFunc() {
        const formData = new FormData()
        for (let item of this.curFile) {
          formData.append('attachFile', item)
        }
        formData.append('tokenID', this.$store.getters.token)
        formData.append('nwDoctId', this.fileData.nwDoctId)
        formData.append('sortId', this.fileData.sortId || this.$route.query.sortId || 0)
        formData.append('custId', this.fileData.custId)
        formData.append('doctId', this.fileData.doctId)
        formData.append('docName', this.fileData.docName)
        formData.append('materialName', this.fileData.materialName)
        formData.append('materialTypeId', this.fileData.materialTypeId)
        formData.append('memo', this.fileData.memo)
        this.fileData.keywordList.forEach((item, index) => {
          formData.append(`keywordList[${index}]`, item)
        })
        this.fileData.caseTypeIdList.forEach((item, index) => {
          formData.append(`caseTypeIdList[${index}]`, item)
        })
        this.fileData.countryIdList.forEach((item, index) => {
          formData.append(`countryIdList[${index}]`, item)
        })
        createNwMaterial(formData).then(async res => {
          this.$message.success('上传成功!')
          this.dialogClose(true)
        })
      },
      dialogClose(search) {
        this.$refs.tree && this.$refs.tree.setCheckedKeys([])
        this.uploadFileView = false
        this.custIdDisabled = false
        this.createDirView = false
        this.customerNameIdList = []
        this.dirName = ''
        this.fileData = {
          nwDoctId: '',
          sortId: '',
          countryIdList: [],
          // nwCountryId: '',
          custId: '',
          doctId: '',
          docName: '',
          materialName: '',
          materialTypeId: '',
          memo: '',
          keywordList: [],
          caseTypeIdList: []
        }
        search === true && this.queryNwMaterial(this.isTopSearch)
      },
      async handledeleElement(row) {
        let notice = '此操作将永久删除'
        let res = {
          data: {
            data: []
          }
        }
        if (row.isDir) {
          res = await queryNwMaterial({sortIdList: [row.sortId]})
          if (res.data.data && res.data.data.length) {
              notice = '所选文件夹中存在文件，此操作将永久删除'
          } else {
            notice = '此操作将永久删除'
          }
        }
        this.$confirm(`${notice}, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(res => {
          deleteDir({
            [row.isDir ? 'sortIdList' : 'materialIdList']: row.isDir ? [row.sortId] : [row.materialId]
          }).then(res => {
            this.$message.success('删除成功!')
            this.dialogClose(true)
          })
        })
      },
      editFun(row) {
        this.dialogTitle = '修改'
        this.uploadFileView = true
        this.fileData.docName = row.docTypeName
        this.$set(this, 'fileData', Object.assign(this.fileData, row))
        if (this.fileData.countryIdList) {
          this.$nextTick(() => {
            this.$refs.tree.setCheckedKeys(this.fileData.countryIdList)
          })
        }
        row.fullname && this.queryCustomerList(row.fullname)
      },
      queryNwMaterial(isSearch) {
        let data
        if (isSearch === true) {
          this.isTopSearch = true
          data = this.searchData
        } else {
          this.isTopSearch = false
          data = { sortId: this.$route.query.sortId || 0 }
        }
        queryNwMaterial({ ...data, ...this.listQuery, name: this.searchFileName }).then(res => {
          this.fileList = res.data.data
          this.total = res.total
          this.breadcrumbList = res.data.pathList || []
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  > > > .table-wrapper {
    height: auto;

    .cell {
      max-height: 70px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
    }
  }

  > > > .el-tree-node.is-expanded > .el-tree-node__children, > > > .el-tree-node > .el-tree-node__children {
    display: flex;
    flex-wrap: wrap;
  }

  .abow_dialog {
    > > > .el-dialog {
      position: absolute;
      top: 50%;
      left: 50%;
      margin: 0 !important;
      transform: translate(-50%, -50%);
      height: calc(100% - 130px);
      max-width: calc(100% - 30px);
      display: flex;
      flex-direction: column;
    }

    > > > .el-dialog__body {
      overflow: auto;
    }
  }

</style>
