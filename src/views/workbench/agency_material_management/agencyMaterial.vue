<template>
  <div class="materialWarp">
    <header>
      <!--      <h4>内外资料</h4>-->
      <div style="display:flex;">
        <el-input
          size="mini"
          placeholder="请输入国家或地区"
          v-model="filterText"
        >
        </el-input>
        <div class="button-group-search" v-clickoutside="clickoutside">
          <!--          <el-button id="mySearch" type="primary" size="mini" @click="fetchList">搜索</el-button>-->
          <el-button type="primary" style="margin-left: 10px" size="mini"
                     @click.stop.prevent="drawerState=!drawerState">更多
          </el-button>
          <transition name="" mode="out-in">
            <div class="searchWrap" v-show="drawerState">
              <div style="width: 550px;max-height: 500px;overflow: auto">
                <el-form label-width="120px" size="mini" class="form-container">
                  <el-form-item label="国家:">
                    <el-select
                      style="width: 80%;"
                      v-model="searchData.nwCountryId"
                      ref="custSelect"
                      filterable
                      clearable
                    >
                      <el-option
                        v-for="item in defaultCountryList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="合作所:">
                    <el-select
                      style="width: 80%;"
                      v-model="searchData.custId"
                      ref="custSelect"
                      filterable
                      clearable
                      remote
                      reserve-keyword
                      placeholder="请输入事务所名称"
                      :remote-method="(v) => $wUtil.debounce(queryCustomerList(v, true), 500)">
                      <el-option
                        v-for="item in searchCustomerList"
                        :key="item.custId"
                        :label="item.fullname"
                        :value="item.custId"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="文件分类:">
                    <el-select
                      style="width: 80%;"
                      v-model="searchData.doctId"
                      ref="custSelect"
                      filterable
                      clearable
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
                      v-model="searchData.materialTypeId"
                      ref="custSelect"
                      filterable
                      clearable
                    >
                      <el-option
                        v-for="item in searchFileTypeList"
                        :key="item.materialTypeId"
                        :label="item.typeName"
                        :value="item.materialTypeId"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="文件名称:">
                    <el-input style="width: 80%;" size="mini" v-model="searchData.materialName"></el-input>
                  </el-form-item>
                  <el-form-item label="案件类型:">
                    <el-select
                      style="width: 80%;"
                      v-model="searchData.caseTypeIdList"
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
                  </el-form-item>
                  <el-form-item label="关键字:">
                    <vue-tags-input
                      style="width: 80%;"
                      v-model="searchData.keyword"
                      :tags="searchData.keywordList"
                      @tags-changed="(v) => {changeTags(v, true)}"
                      placeholder="回车保存关键字"
                    >
                    </vue-tags-input>
                  </el-form-item>
                </el-form>

              </div>
              <div class="clearWrap">
                <el-button size="mini" @click="clearSearch"><span>重置</span></el-button>
                <el-button type="primary" size="mini" @click="queryFileList">搜索</el-button>
              </div>
            </div>
          </transition>
        </div>
      </div>

    </header>
    <div class="content_warp">
      <div class="aside">
        <el-tree
          ref="tree"
          :props="props"
          :load="loadNode"
          lazy
          node-key="id"
          :highlight-current="true"
          :filter-node-method="filterNode"
          @node-expand="handleNodeExpand"
          @node-collapse="handleNodeCollapse"
          @node-click="handleNodeClick"></el-tree>
        <!--        <el-button ref="buttonLookMore" style="width:100%" v-show="defaultCountryList.length>pageList1.length"-->
        <!--                   @click="append">查看更多-->
        <!--        </el-button>-->
      </div>
      <div class="section">
        <div class="nameWarp"
             style="width:100%;position: absolute;;box-sizing: border-box;">
          <uploadFile :clickUpload="clickUpload" @getUploadFile="getUploadFile"
                      @changeClick="clickUpload=false"></uploadFile>
          <template v-if="level === 0 || allFileView">
            <div v-if="outerFileList.length" style="width: 100%;">
              <material-list :materialList="outerFileList"
                             :isOuter="true" :custId="curCustId"
                             @edit="editFunc"
                             :nwCountryId="curNwCountryId" @updateList="updateList"></material-list>
              <pagination
                v-if="total>0"
                :total="total"
                :page.sync="searchData.pageNo"
                :limit.sync="searchData.pageSize"
                @pagination="queryFileList"
                :pageSizes="searchData.sizeList"
              />
            </div>
            <div v-else
                 style="width: 100%;display: flex;justify-content: center;align-items: center;flex-direction: column">
              <img src="../../../assets/资料管理icon/noData.svg" alt="">
              <div style="padding: 20px;color: #666666">暂时木有内容呀～～</div>
            </div>
            <!--            <div class="nameWarp" v-show="level==0" v-loadmore="infiniteScroll"-->
            <!--                 style="width:100%;position: absolute;padding: 20px;box-sizing: border-box;">-->
            <!--              <el-table-->
            <!--                class="scrollTable"-->
            <!--                :data="pageList1"-->
            <!--                border-->
            <!--                height="100%"-->
            <!--                empty-text="暂无数据"-->
            <!--                highlight-current-row-->
            <!--                current-row-key-->
            <!--              >-->
            <!--                <el-table-column type="index" width="50" label="序号" align="left">-->
            <!--                  <template slot-scope="scope">-->
            <!--                    <span>{{scope.$index+1}}</span>-->
            <!--                  </template>-->
            <!--                </el-table-column>-->
            <!--                <el-table-column v-for='item in custTitleList' :label="item.title" :prop="item.value" align="left">-->
            <!--                  <template slot-scope="scope">-->
            <!--                    <span style="cursor:pointer;" @click="openTreeNode(scope.row, scope.$index)">{{scope.row[item.value]}}</span>-->
            <!--                  </template>-->
            <!--                </el-table-column>-->
            <!--              </el-table>-->
            <!--            </div>-->
          </template>
          <template v-else>
            <el-tabs v-model="activeName" v-if="materialView" type="border-card"
                     :style="{'height': '100%', width: '100%'}">

              <el-tab-pane name="first" :label="`资料存档`" :style="{'height': '100%'}">
                <material-list :materialList="materialList"
                               @edit="editFunc"
                               @createFile="createFile" :custId="curCustId"
                               @updateList="updateList"
                               :nwCountryId="curNwCountryId"></material-list>
              </el-tab-pane>
              <el-tab-pane name="second" :label="`代理所概况`" :style="{'height': '100%'}">
                <abroad-agency v-if="activeName === 'second'" :isMaterial="true" :custId="curCustId"></abroad-agency>
              </el-tab-pane>
            </el-tabs>
            <div style="width: 100%;" v-else>
              <div
                :style="{'height':'100%','background':hoverState?'RGBA(32,159,255,0.06)':'#fff','overflow':'auto','padding':'20px'}"
                @drop.stop.prevent="enentDrop($event)"
                @dragover.stop.prevent="hoverState=true"
                @dragleave.stop.prevent="hoverState=false"
                @dragenter.stop.prevent="hoverState=true">
            <span style="font-size: 12px">您可将文件拖放到具体的资料类型文件夹处，或者将文件拖放到页面空白处新建资料库<span
              style="color: #409EFF;cursor: pointer;" @click="clickUpload=true">浏览</span></span>
                <div class="dragPage">
                  <div class="fileWarp">
                    <div class="fileItem" v-for="(item, index) in countryAgencyList.filter(item => item.nwCountryId == curNwCountryId)" :key="item.custId">
                      <div
                        @drop.stop.prevent="enentDrop1(item, $event)"
                        @drop.native.stop.prevent=""
                        @dragover.native.stop.prevent=""
                        @dragleave.native.stop.prevent=""
                        @dragenter.native.stop.prevent=""
                        class="upload-demo"
                      >
                        <img width="100%" src="@/assets/资料管理icon/文件夹.png"
                             @click="clickAgency(item.custId, item.nwCountryId, item.fullname)"/>
                      </div>
                      <span class="fileName">{{item.fullname}}</span>
                    </div>
                  </div>
                </div>
                <!--              <div style="padding: 10px 0;" v-for="(item, index) in countryAgencyList" :key="item.custId">-->
                <!--                {{item.fullname}}-->
                <!--              </div>-->
              </div>

            </div>
          </template>
        </div>


      </div>
    </div>
    <el-dialog
      :title="dialogTitle"
      :append-to-body="true"
      :visible.sync="uploadFileView"
      width="50%"
      class="abow_dialog"
      :before-close="(done) => {dialogClose(); done()}"
    >
      <el-form size="mini" label-width="120px" ref="postForm" :rules="rules" :model="fileData">
        <el-form-item label="合作所:" prop="custId">
          <el-select
            :disabled="custIdDisabled"
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
      </el-form>
      <span slot="footer" class="fl-ac-jc">
        <el-button size="mini" @click="() => dialogClose()">取 消</el-button>
        <el-button size="mini" type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import VueTagsInput from '@johmun/vue-tags-input'
  import {
    fetchList
  } from '@/api/customerList'
  import {
    queryMaterialDocType,
    queryMaterialTypeByDocId
  } from '@/api/caseList'
  import {
    queryCountryList,
    queryCountryAgency,
    queryNwMaterial,
    queryNwCaseTypeList,
    createNwCaseType,
    createNwMaterial
  } from '@/api/material'
  import MaterialList from './MaterialList'
  import UploadFile from '../material_management/components/uploadFile'
  import Vue from 'vue'
  import AbroadAgency from '../../../components/AbroadAgency'
  import Pagination from '../../../components/Pagination/index'
  import { modifyNwMaterial } from '../../../api/material'

  Vue.directive('loadmore', {
    bind(el, binding) {
      const selectWrap = el.querySelector('.el-table__body-wrapper')
      selectWrap && selectWrap.addEventListener('scroll', function() {
        let sign = 100
        const scrollDistance = this.scrollHeight - this.scrollTop - this.clientHeight
        if (scrollDistance <= sign) {
          binding.value()
        }
      })
    }
  })

  export default {
    name: 'agencyMaterial',
    components: { Pagination, AbroadAgency, UploadFile, MaterialList, VueTagsInput },
    data() {
      return {
        rules: {
          custId: [
            { required: true, message: '请选择合作所', trigger: ['change', 'blur'] }
          ],
          doctId: [
            { required: true, message: '请选择文件分类', trigger: ['change', 'blur'] }
          ],
        },
        allFileView: false,
        total: 0,
        outerFileList: [],
        searchFileTypeList: [],
        searchData: {
          nwCountryId: '',
          custId: '',
          keywordList: [],
          keyword: '',
          doctId: '',
          materialTypeId: '',
          caseTypeIdList: [],
          materialName: '',
          pageSize: 10,
          pageNo: 1,
          sizeList: [10, 20, 50, 100]
        },
        searchCustomerList: [],
        drawerState: false,
        addCaseTypeValue: '',
        caseTypeList: [],
        fileTypeList: [],
        fileKinds: [],
        fileData: {
          nwCountryId: '',
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
        dialogTitle: '',
        custTitleList: [
          { 'title': '国家或地区', 'value': 'name' }
        ],
        level: 0,
        clickUpload: false,
        hoverState: false,
        materialList: [],
        curNwCountryId: '',
        curCustId: '',
        filterText: '',
        node: '',
        resolve: '',
        pageList1: [],
        defaultCountryList: [],
        countryListNumber: 0,
        curPageListNumber: 100,
        props: {
          id: '',
          label: 'name',
          children: 'zones',
          isLeaf: 'leaf'
        },
        selectedList: [],
        activeName: 'first',
        materialView: false,
        countryAgencyList: [],
        uploadFileView: false,
        materialDocTypeList: [],
        customerNameIdList: [],
        custIdDisabled: false,
        curFullname: ''
      }
    },
    watch: {
      'searchData.doctId': {
        handler(n) {
          if (n) {
            this.queryMaterialTypeByDocId(n, true)
          }
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
      },
      filterText(val) {
        if (this.defaultCountryList.find(item => item.name === val)) {
          this.searchData.nwCountryId = this.defaultCountryList.find(item => item.name === val).id
        } else {
          this.searchData.nwCountryId = ''
        }
        this.$refs.tree.filter(val)
      }
    },
    created() {
      this.queryMaterialDocType()
      this.queryNwCaseTypeList()
      // this.queryCountryList()
      // this.queryMaterialDocType()
    },
    methods: {
      editFunc(row) {
        this.dialogTitle = '修改'
        this.uploadFileView = true
        this.fileData.docName = row.docTypeName
        this.custIdDisabled = true
        this.$set(this, 'fileData', Object.assign(this.fileData, row))
        row.fullname && this.queryCustomerList(row.fullname)
      },
      async updateList(isOuter) {
        if (isOuter) {
          this.queryFileList()
        } else if (this.curCustId) {
          const arr = await this.queryNwMaterial(this.curCustId, this.curNwCountryId)
          this.materialList = arr.data
        }
      },
      queryFileList() {
        this.clickoutside()
        queryNwMaterial(this.searchData).then(res => {
          this.outerFileList = res.data
          this.total = res.total
          this.allFileView = true
          this.filterText = this.defaultCountryList.find(item => item.id == this.searchData.nwCountryId) && this.defaultCountryList.find(item => item.id == this.searchData.nwCountryId).name
          this.closeTreeNode()
        })
      },
      clickoutside() {
        this.drawerState = false
      },
      clearSearch() {
        this.searchData = {
          nwCountryId: '',
          custId: '',
          keywordList: [],
          keyword: '',
          doctId: '',
          materialTypeId: '',
          caseTypeIdList: [],
          materialName: '',
          pageSize: 10,
          pageNo: 1,
          sizeList: [10, 20, 50, 100]
        }
      },
      async createFile() {
        this.clickUpload = true
      },
      submit() {
        if (this.dialogTitle === '新建') {
          this.uploadFileFunc()
        } else if (this.dialogTitle === '修改') {
          this.editFileFunc()
        }
      },
      editFileFunc() {
        if (!this.$commonUtils.formValidate(this.$refs['postForm'])) return
        modifyNwMaterial(this.fileData).then(res => {
          this.$message.success('修改成功!')
          this.dialogClose()
          this.updateList(this.level === 0)
        })
      },
      uploadFileFunc() {
        const formData = new FormData()
        for (let item of this.curFile) {
          formData.append('attachFile', item)
        }
        formData.append('tokenID', this.$store.getters.token)
        formData.append('nwCountryId', this.curNwCountryId || this.fileData.nwCountryId)
        formData.append('custId', this.curCustId || this.fileData.custId)
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
        // formData.append('caseTypeIdList', this.fileData.caseTypeIdList)
        if (!this.$commonUtils.formValidate(this.$refs['postForm'])) return
        createNwMaterial(formData).then(async res => {
          this.$message.success('上传成功!')
          this.dialogClose()
          if (this.curCustId) {
            const arr = await this.queryNwMaterial(this.curCustId, this.curNwCountryId)
            this.materialList = arr.data
          } else if (this.curNwCountryId) {
            const arr = await this.queryCountryAgency(this.curNwCountryId)
            this.countryAgencyList = arr.data
            this.countryAgencyList.forEach(item => {
              item.nwCountryId = this.curNwCountryId
            })
          }
        })
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
      changeTags(newTags, flag) {
        if (flag) {
          this.searchData.keywordList = newTags.map(item => item.text)
        } else {
          this.fileData.keywordList = newTags.map(item => item.text)
        }
      },
      queryNwCaseTypeList() {
        queryNwCaseTypeList().then(res => {
          this.caseTypeList = res.data
        })
      },
      queryMaterialTypeByDocId(doctId, flag) {
        queryMaterialTypeByDocId({ doctId }).then(res => {
          if (flag) {
            this.searchFileTypeList = res.data
          } else {
            this.fileTypeList = res.data
          }
        })
      },
      dialogClose() {
        this.uploadFileView = false
        this.custIdDisabled = false
        this.fileData = {
          nwCountryId: '',
          custId: '',
          doctId: '',
          docName: '',
          materialName: '',
          materialTypeId: '',
          memo: '',
          keywordList: [],
          caseTypeIdList: []
        }
      },
      async queryCustomerList(query, flag) {
        if (query !== '') {
          await fetchList({
            pageNo: 1,
            pageSize: 100,
            isCollaboration: 1,
            keyword: query,
            companyType: '外代所'
          }).then(res => {
            if (flag) {
              this.searchCustomerList = res.data
            } else {
              this.customerNameIdList = res.data
            }
          })
        }
      },
      queryMaterialDocType() {
        queryMaterialDocType().then(res => {
          this.fileKinds = res.data
        })
      },
      openTreeNode(row, index) {
        this.$refs.tree.$children[index].node.expand()
        this.$refs.tree.$children[index].$el.click()
      },
      closeTreeNode(index) {
        if (index === undefined) {
          this.$refs.tree.$children.forEach((item, index) => {
            if (item.node.expanded) {
              item.node.collapse()
            }
          })
        } else {
          this.$refs.tree.$children[index].node.collapse()
        }
      },
      infiniteScroll() {
        if (!this.firstPage) {
          this.firstPage = true
        } else {
          this.$refs.buttonLookMore.$el.click()
        }
        // this.curPageListNumber+=20
      },
      async clickAgency(custId, nwCountryId, fullname) {
        this.materialView = true
        this.curCustId = custId
        this.curNwCountryId = nwCountryId
        this.curFullname = fullname
        const arr = await this.queryNwMaterial(custId, nwCountryId)
        this.materialList = arr.data || []
        // if (arr.data && arr.data.length > 0) {
        //   this.$nextTick(() => {
        //     this.materialList = this.formatSort(arr.data)
        //     this.materialList.forEach(item => {
        //       item.nwCountryId = nwCountryId
        //       item.custId = custId
        //       item.fullname = fullname
        //     })
        //     this.activeNames = Array.from(new Array(arr.data.length).keys()).slice(
        //       0
        //     )
        //   })
        // }
      },
      async enentDrop(e) {
        e.stopPropagation()
        e.preventDefault()
        this.hoverState = false
        this.curFile = e.dataTransfer.files
        this.uploadFileView = true
        this.dialogTitle = '新建'
        this.fileData.nwCountryId = this.curNwCountryId
      },
      async enentDrop1(item, e) {
        e.stopPropagation()
        e.preventDefault()
        this.hoverState = false
        this.curFile = e.dataTransfer.files
        this.uploadFileView = true
        this.dialogTitle = '新建'
        if (item.fullname) {
          await this.queryCustomerList(item.fullname)
          this.fileData.custId = item.custId
          this.fileData.nwCountryId = item.nwCountryId
          this.custIdDisabled = true
        }
        // this.createMultMaterial(this.curFile)
      },
      createMultMaterial(file) {
        let formData = new FormData()
        for (let item of file) {
          formData.append('attachFile', item)
        }
        formData.append('tokenID', this.$store.getters.token)
        // creatematerial(formData,(e)=>{
        //     this.percentage = parseInt(e.loaded/e.total*100)
        //   }).then(async res=>{
        //     this.percentage = 0
        //     res.data.forEach(item=>{
        //       item.name=item.materialName
        //       item.createDate=this.getTimer()
        //     })
        //   this.materialIdList=res.data.map(item=>item.materialId)
        //   // bindTaskFile({prjTaskId:this.edtiTasksData.prjTaskId,materialIdList:this.materialIdList}).then(res=>{
        //   //   this.$message.success('文件绑定成功')
        //   //   this.$emit('update','0')
        //   // })
        //   }).catch(()=>{
        //     this.percentage = 0
        //   })
      },
      async getUploadFile(e) {
        let arr = []
        for (var i = 0; i < e.target.files.length; i++) {
          arr.push(e.target.files[i])
        }

        this.curFile = arr
        this.uploadFileView = true
        this.dialogTitle = '新建'
        if (this.curFullname) {
          await this.queryCustomerList(this.curFullname)
          this.fileData.custId = this.curCustId
          this.fileData.nwCountryId = this.curNwCountryId
          this.custIdDisabled = true
        } else {
          this.fileData.nwCountryId = this.curNwCountryId
        }
      },
      append() {
        this.loadNode(this.node, this.resolve, 'append')
      },
      async handleNodeClick(data, node) {
        this.curCustId = ''
        this.curFullname = ''
        this.level = data.level + 1
        if (data.level === 0) {
          this.curNwCountryId = node.data.postId
          this.materialView = false
        }
        if (data.level === 1) {
          this.allFileView = false
          this.curCustId = node.data.postId
          this.curFullname = node.data.name
        }
        if (data.leaf) {
          this.materialView = true
          const arr = await this.queryNwMaterial(node.data.postId, node.parent.data.postId)
          this.materialList = arr.data
          // if (arr.data && arr.data.length > 0) {
          //   this.$nextTick(() => {
          //     this.materialList = this.formatSort(arr.data)
          //     this.materialList.forEach(item => {
          //       item.nwCountryId = node.parent.data.postId
          //     })
          //     this.activeNames = Array.from(new Array(arr.data.length).keys()).slice(
          //       0
          //     )
          //   })
          // }
        }
      },
      handleNodeCollapse(data) {
        this.$nextTick(() => {
          this.level = data.level
          this.materialView = false
          this.materialList = []
        })
      },
      getNodeListData(node) {
        return node.childNodes.map(item => item.data)
      },
      handleNodeExpand(data, node, dom) {
        this.allFileView = false
        this.$nextTick(() => {
          this.level = data.level + 1
          this.countryAgencyList = []
          if (node.childNodes.length && node.childNodes[0].data.zones) {
            this.countryAgencyList = node.childNodes[0].data.zones
          }
        })

        // let timer = setInterval(() => {
        //   if (this.getNodeListData(node).length) {
        //     this.curCustId = this.breadcrumbList[0].data.postId
        //     clearInterval(timer)
        //   }
        // }, 60)
        // setTimeout(() => {
        //   clearInterval(timer)
        // }, 2000)
      },
      getCustData(level, postId) {
        let list = []
        this.$refs.tree.$children.forEach(item => {
          item.node.childNodes.forEach(item1 => {
            if (level === 1) {
              if (item1.data.postId == postId) {
                list = [item.node.data, item1.data]
              }
            }
            item1.childNodes.forEach(item2 => {
              if (level === 2) {
                if (item2.data.postId == postId) {
                  list = [item.node.data, item1.data, item2.data]
                }
              }
              item2.childNodes.forEach(item3 => {
                if (level === 3) {
                  if (item3.data.postId == postId) {
                    list = [item.node.data, item1.data, item2.data, item3.data]
                  }
                }
              })
            })
          })
        })
        return list
      },
      filterNode(value, data, node) {
        if (!value) return true
        let hasArr = [data.name ? data.name : '', data.fullname ? data.fullname : '', data.fullnameEn ? data.fullnameEn : ''].map(item => item.trim().toUpperCase())
        if (data.level === 0) {
          return hasArr.some(item => item.includes(value.trim().toUpperCase()))
        }
        if (data.level !== 0) {
          return node.parent.data.name.includes(value.trim())
          // let arrList = this.getCustData(data.level, data.postId)
          // if (arrList.length) {
          //   if (hasArr.some(item => item.includes(value.trim().toUpperCase()))) {
          //     return true
          //   } else {
          //     return false
          //   }
          // }
        }
      },
      queryCountryAgency(id) {
        const data = {
          nwCountryId: id,
          pageNo: 1,
          pageSize: 99999
        }
        return queryCountryAgency(data)
      },
      fetchList() {
        const data = {
          pageNo: 1,
          pageSize: 99999
        }
        return queryCountryList(data)
      },
      queryNwMaterial(id, pid) {
        const data = {
          nwCountryId: pid,
          custId: id,
          pageNo: 1,
          pageSize: 99999
        }
        return queryNwMaterial(data)
      },
      formatSort(materialList) {
        let arr = ['客户指示', '致函客户', '外方代理来函', '致函外方代理', '内部管理', '递交官方', '官方通知', '客户往来', '内部往来', '外代所往来', '账单费用', '对方当事人往来', '档案扫描件']
        return materialList.filter(i => arr.includes(i.docTypeName))
      },
      async loadNode(node, resolve, C, D) {
        if (node.level === 0) {
          this.node = node
          this.resolve = resolve
          if (!C) {
            const arr = await this.fetchList()
            let custList = arr.data.map(item => ({
              id: '0' + item.nwCountryId,
              postId: item.nwCountryId,
              level: 0,
              name: item.countryCn
            })).filter(item => item.name != null)
            this.defaultCountryList = custList
          }
          if (D) {
            let arr = this.defaultCustList.filter(item => [item.name ? item.name : '', item.fullname ? item.fullname : '', item.fullnameEn ? item.fullnameEn : ''].map(item => item.trim().toUpperCase()).some(item => item.includes(D.trim().toUpperCase())))
            this.pageList1 = [...this.pageList1, ...arr]
            this.defaultCustList = this.defaultCustList.filter(item => ![item.name ? item.name : '', item.fullname ? item.fullname : '', item.fullnameEn ? item.fullnameEn : ''].map(item => item.trim().toUpperCase()).some(item => item.includes(D.trim().toUpperCase())))
            return resolve(arr)
          }
          this.pageList1.push(...this.defaultCountryList.slice(this.countryListNumber, this.countryListNumber + this.curPageListNumber))
          // return resolve(this.defaultCountryList.slice(this.countryListNumber, this.countryListNumber += this.curPageListNumber))
          return resolve(this.defaultCountryList)
        }
        if (node.level === 1) {
          this.materialView = false
          const arr = await this.queryCountryAgency(node.data.postId)
          const appList = arr.data.map(item => ({
            id: '1' + item.custId,
            postId: item.custId,
            level: 1,
            name: item.fullname,
            leaf: true,
            zones: arr.data.map(i => ({
              custId: i.custId,
              fullname: i.fullname,
              nwCountryId: node.data.postId
            }))
          })).filter(item => item.name != null)
          this.countryAgencyList = arr.data
          this.countryAgencyList.forEach(item => {
            item.nwCountryId = node.data.postId
          })
          return resolve(appList)
        }
        if (node.level === 2) {
          const arr = await this.queryNwMaterial(node.data.postId, node.parent.data.postId)
          const sortList = arr.data.map(item => ({
            id: '2' + item.doctId,
            postId: item.doctId,
            level: 2,
            name: item.docTypeName,
            leaf: true
          })).filter(item => item.name != null)
          this.materialList = []
          if (arr.data && arr.data.length > 0) {
            this.$nextTick(() => {
              this.materialList = this.formatSort(arr.data)
              this.activeNames = Array.from(new Array(arr.data.length).keys()).slice(
                0
              )
            })
          }
          return resolve(sortList)
        }
        if (node.level === 3) {
          // return resolve(node.data.zones)
        }
        // if(node.level===4){
        //   console.log(node)
        //   const arr= await this.queryMaterialList(node.parent.data.postId,node.data.postId)
        //   const sortList= arr.data.map(item=>({postId:item.materialId,level:4, name:item.materialName,address:item.address,leaf: true})).filter(item=>item.name!=null)
        //    return resolve(sortList);
        // }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .el-breadcrumb {
    position: absolute;
    height: 30px;
    line-height: 30px;
    width: 100%;
    top: -20px;
    background: RGBA(239, 248, 255, 1);

    /deep/ .el-breadcrumb__inner {
      cursor: pointer;
    }
  }

  .materialWarp {
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    display: flex;
    /*flex-wrap: wrap;*/
    flex-direction: column;

    header {
      h4 {
        width: 100%;
        height: 50px;
        line-height: 50px;
        font-size: 22px;
        font-weight: 400;
        color: #333333;
      }

      .el-input {
        width: 300px;
      }

      padding-left: 20px;
    }

    .content_warp {
      flex: 1;
      display: flex;
      padding: 20px;
      height: calc(100% - 40px);
      /*width: 100%;*/
    }

    .aside {
      min-width: 200px;
      max-width: 300px;
      height: 100%;
      overflow: auto;
      margin-right: 20px;
      border: 1px solid #99a9bf;
    }

    .section {
      flex: 1;
      position: relative;
      border: 1px solid #99a9bf;
    }
  }

  .drop_area_hover {
    opacity: 0.5;
  }

  .nameWarp {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    height: 100%;
    position: relative;
    background: #fff;
    overflow: auto;

    li {
      // height: 20px;
      text-align: center;
      line-height: 20px;
      width: 20%;
      margin: 20px;
      list-style: none;
    }
  }

  .dragPage {
    padding: 10px 0;

    .packageName {
      width: 100%;
    }

    .fileWarp {
      display: flex;
      flex-wrap: wrap;

      .fileItem {
        display: flex;
        flex-wrap: wrap;
        width: 65px;
        margin: 10px;

        .upload-demo {
          width: 100%;
          height: 65px;

          /deep/ .el-upload-list {
            display: none;
          }

          /deep/ .el-upload {
            width: 100%;
            height: 65px;

            .el-upload-dragger {
              width: 100%;
              height: 65px;
              border: 0;
            }

          }
        }

        .fileName {
          width: 100%;
          height: 12px;
          font-size: 12px;
          text-align: center;
        }
      }
    }
  }

  @keyframes show {
    0% {

      opacity: 0;
      transform: translateX(100%);

    }
    100% {
      transform: translateX(0);
      opacity: 1;

    }
  }

  @keyframes hide {
    0% {
      opacity: 1;
      transform: translateX(0);
    }
    100% {

      opacity: 0;
      transform: translateX(100%);
    }
  }

  .show-enter-active {
    animation: show 1.2s;
  }

  .show-leave-active {
    animation: hide 1.2s;
  }

  .show-enter, .show-leave-to {
    opacity: 0;
  }

  .el-tree {
    /deep/ & > .el-tree-node {
      & > .el-tree-node__content span:before {
        background-size: cover;
        color: transparent;
      }

      & > .el-tree-node__content > .el-tree-node__expand-icon {
        transform: rotate(0) !important;
        background-size: contain !important;
        padding: 3px !important;
        margin: 3px;
        /*&:before{*/
        background: url("../../../assets/资料管理icon/客户默认.png") no-repeat center;
        /*}*/
      }

      & > .el-tree-node__content > .el-tree-node__expand-icon.expanded {
        transform: rotate(0) !important;
        /*&:before{*/
        background: url("../../../assets/资料管理icon/客户选中.png") no-repeat center;
        /*}*/
      }

      & > .el-tree-node__children .el-tree-node {
        & > .el-tree-node__content span:before {
          background-size: cover;
          color: transparent;
        }

        & > .el-tree-node__content .el-tree-node__expand-icon {
          &:before {
            background-size: contain !important;
            background: url("../../../assets/资料管理icon/applicantputaway.png") no-repeat center;
          }
        }

        & > .el-tree-node__content .el-tree-node__expand-icon.is-leaf {
          visibility: hidden;
          display: none;

          & ~ .el-tree-node__label {
            margin-left: 6px;
          }
        }
      }
    }
  }

  .el-table {
    overflow: visible;

    /deep/ th {
      color: rgba(51, 51, 51, 1);
      background: rgba(187, 187, 187, 0.5);
    }
  }

  .el-table {
    /deep/ th {
      padding: 5px 0
    }

    /deep/ td {
      padding: 0;
    }
  }

  .comfimSortButton {
    text-align: right;
  }

  .aside::-webkit-scrollbar {
    width: 8px;
    height: 8px;
    background: #f2f2f2;
    padding-right: 2px;
  }

  .aside::-webkit-scrollbar-thumb {
    background: #b4bbc5;
    border-radius: 10px;
    border: 0;
  }

  /deep/ .el-table__body-wrapper::-webkit-scrollbar {
    width: 8px;
    height: 8px;
    background: #f2f2f2;
    padding-right: 2px;
  }

  /deep/ .el-table__body-wrapper::-webkit-scrollbar-thumb {
    background: #b4bbc5;
    border-radius: 10px;
    border: 0;
  }

  .el-tabs {

    height: 100%;
    display: flex;
    flex-direction: column;

    /deep/ .el-tabs__content {
      flex: 1;
      padding: 0;
    }
  }

  .packageName {

  }

  .abow_dialog {
    > > > .el-dialog {
      position: absolute;
      top: 50%;
      left: 50%;
      margin: 0 !important;
      transform: translate(-50%, -50%);
      max-height: calc(100% - 30px);
      max-width: calc(100% - 30px);
      display: flex;
      flex-direction: column;
    }

    > > > .el-dialog__body {
      overflow: auto;
    }
  }

  .button-group-search {
    /*position: relative;*/
    display: flex;

    .searchWrap {
      border-radius: 5px;
      top: 30px;
      /*left: 0;*/
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
        padding: 20px 0 40px 0;

        .el-form-item__label {
          text-align: left;
          padding-left: 32px;
          font-weight: normal;
        }

        .el-form-item__content {
          display: flex;

          input {
            border-top: 0;
            border-left: 0;
            border-radius: 0;
            border-right: 0
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
        padding-top: 10px;
        position: absolute;
        z-index: 1;
      }
    }
  }
  .searchWrap{
   > > > .ti-input {
      border: none;
      border-bottom: 1px solid #dcdfe6;
      height: 30px;
      line-height: 30px;

      input::-webkit-input-placeholder, textarea::-webkit-input-placeholder {
        color: #C0C4CC;
      }

      input:-moz-placeholder, textarea:-moz-placeholder {
        color: #C0C4CC;
      }

      input::-moz-placeholder, textarea::-moz-placeholder {
        color: #C0C4CC;
      }

      input:-ms-input-placeholder, textarea:-ms-input-placeholder {
        color: #C0C4CC;
      }
    }
  }
</style>
