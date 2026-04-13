<template>
  <div class="button-group-search">
    <div v-clickoutside="clickoutside">
      <el-button id="mySearch" type="primary" size="small" @click="queryFileList">搜索</el-button>
      <el-button type="primary" style="margin-left:0" class="searchRight" size="small" icon="el-icon-arrow-down"
                 @click.stop.prevent="drawerState=true"></el-button>
      <transition name="" mode="out-in">
        <div class="searchWrap" v-show="drawerState">
          <div style="width: 100%;max-height: 500px;overflow: auto">
            <el-form label-width="120px" size="mini" class="form-container">
              <el-form-item label="国家/地区:">
                <el-tree
                  @check="searchCheckNode"
                  :data="continentList"
                  show-checkbox
                  :default-expand-all="false"
                  node-key="id"
                  ref="searchTree"
                  highlight-current
                  :props="defaultProps">
                </el-tree>
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
              <el-form-item label="文件归类">
                <el-select
                  style="width: 80%;"
                  v-model="searchData.nwDoctId"
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
              <el-form-item label="上传人:">
                <el-input style="width: 80%;" placeholder="请输入上传人名称" size="mini" v-model="searchData.creater"></el-input>
              </el-form-item>
              <el-form-item label="上传时间:">
                <DataPicker class="DataPicker" v-model="searchData.createDateArray"></DataPicker>
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
</template>

<script>
  import VueTagsInput from '@johmun/vue-tags-input'
  import {fetchList} from '@/api/customerList'
  import {queryMaterialTypeByDocId} from '@/api/caseList'

  export default {
    name: 'searchCpn',
    props: ['continentList', 'caseTypeList', 'nwDocTypeList', 'fileKinds'],
    components: {
      VueTagsInput
    },
    watch: {
      'searchData.doctId': {
        handler(n) {
          if (n) {
            this.queryMaterialTypeByDocId(n, true)
          }
        },
        immediate: true
      }
    },
    data() {
      return {
        searchFileTypeList: [],
        searchCustomerList: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        drawerState: false,
        searchData: {
          createDateArray: [],
          creater: '',
          nwDoctId: '',
          sortId: '',
          countryIdList: [],
          // nwCountryId: '',
          custId: '',
          keywordList: [],
          keyword: '',
          doctId: '',
          materialTypeId: '',
          caseTypeIdList: [],
          materialName: ''
        }
      }
    },
    methods: {
      clearSearch() {
        this.$refs.searchTree && this.$refs.searchTree.setCheckedKeys([])
        this.searchData = {
          createDateArray: [],
          creater: '',
          nwDoctId: '',
          sortId: '',
          countryIdList: [],
          // nwCountryId: '',
          custId: '',
          keywordList: [],
          keyword: '',
          doctId: '',
          materialTypeId: '',
          caseTypeIdList: [],
          materialName: ''
        }
      },
      changeTags(newTags, flag) {
        if (flag) {
          this.searchData.keywordList = newTags.map(item => item.text)
        } else {
          // this.fileData.keywordList = newTags.map(item => item.text)
        }
      },
      queryMaterialTypeByDocId(doctId) {
        queryMaterialTypeByDocId({doctId}).then(res => {
          this.searchFileTypeList = res.data
        })
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
              // this.customerNameIdList = res.data
            }
          })
        }
      },
      searchCheckNode(current, {checkedKeys}) {
        this.searchData.countryIdList = checkedKeys
      },
      queryFileList() {
        this.clickoutside()
        if (this.searchData.keyword && !this.searchData.keywordList.includes(this.searchData.keyword)) {
          this.searchData.keywordList.push(this.searchData.keyword)
          this.searchData.keyword = ''
        }
        this.$emit('handleSearch', this.searchData)
      },
      clickoutside() {
        this.drawerState = false
      }
    }
  }
</script>

<style lang="scss" scoped>
  .button-group-search {
    position: relative;
    display: inline-block;

    .searchRight {
      margin-left: -8px !important;
      height: 32px;
      line-height: 30px;
      border-top-right-radius: 3px !important;
      border-bottom-right-radius: 3px !important;
      padding: 0 5px
    }

    .searchWrap {
      border-radius: 5px;
      top: 34px;
      left: 10px;
      width: 800px;
      min-height: 200px;
      /*max-height: 500px;*/
      position: absolute;
      background: #ffffff;
      border: 1px solid #d4d5d5;
      z-index: 50;
      /*overflow: auto;*/
      padding: 20px 0;
      box-shadow: 0 3px 6px rgba(111, 111, 111, 0.2);

      /deep/ .form-container {
        padding-bottom: 10px;
        overflow: auto;
        max-height: 500px;

        .el-form-item__label {
          text-align: left;
          padding-left: 32px;
          font-weight: normal;
        }

        .el-form-item__content {
          input {
            border-top: 0;
            border-left: 0;
            border-radius: 0;
            border-right: 0
          }
        }
      }

      .clearWrap {
        display: flex;
        justify-content: flex-end;
        right: 20px;
        bottom: 10px;
        position: absolute;
        z-index: 1;
      }
    }
  }

  > > > .el-tree-node.is-expanded > .el-tree-node__children, > > > .el-tree-node > .el-tree-node__children {
    display: flex;
    flex-wrap: wrap;

    .el-tree-node {
      width: 33.33%;
      height: 60px;
      display: flex;
      align-items: center;

      .el-tree-node__content {
        display: flex;
        align-items: center;
      }
    }
  }
</style>
