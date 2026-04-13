<template>
  <div class="judgment-wrapper">
    <div class="left-detail" :style="{width: halfWidth}" v-if="detailView">
      <div class="detail-top">
        <div class="top-left" v-html="detailData.caseName">
<!--          {{ detailData.caseName }}-->
        </div>
        <div class="top-right">
          <div class="go-back" @click="closeDetail">
            <span class="el-icon-d-arrow-right"></span>
          </div>
          <div class="">
            <span class="iconfont" :class="detailData.isFavorite ? 'icon-aixin1' : 'icon-aixin'"
                  @click.stop="favoriteClick(detailData)"></span>
          </div>
          <!-- <div class="" @click="openLink" title="查看原文">
            <span class="iconfont icon-lianjie"></span>
          </div> -->
        </div>
      </div>
      <div class="detail-content">
        <div class="base-info">
          <div class="base-info-title">
            <div class="left-line"></div>
            <div class="title">基本信息</div>
          </div>
          <div class="base-info-content">
            <div class="content-row" @mouseleave="copyText = '复制'">
              <div class="left-label">审理法院:</div>
              <div class="right-text">
                <div class="left-text" v-html="detailData.court">
<!--                  {{ detailData.court }}-->
                </div>
                <div class="copy" v-if="detailData.court">
                  <div class="copy-text">
                    <el-tag size="mini" type="" @click="copyTextFunc(detailData.court)">{{ copyText }}</el-tag>
                  </div>
                  <div class="copy-search">
                    <el-tag size="mini" type="" @click="relSearch(detailData.court, 'court', '审理法院')">关联搜索
                    </el-tag>
                  </div>
                </div>
              </div>
            </div>
            <div class="content-row" @mouseleave="copyText = '复制'">
              <div class="left-label">案号:</div>
              <div class="right-text">
                <div class="left-text" v-html="detailData.caseNum">
<!--                  {{ detailData.caseNum }}-->
                </div>
                <div class="copy" v-if="detailData.caseNum">
                  <div class="copy-text">
                    <el-tag size="mini" type="" @click="copyTextFunc(detailData.caseNum)">{{ copyText }}</el-tag>
                  </div>
                  <div class="copy-search">
                    <el-tag size="mini" type="" @click="relSearch(detailData.caseNum, 'caseNum', '案号')">关联搜索
                    </el-tag>
                  </div>
                </div>
              </div>
            </div>
            <div class="content-row" @mouseleave="copyText = '复制'">
              <div class="left-label">案件类型:</div>
              <div class="right-text">
                <div class="left-text" v-html="detailData.caseType">
<!--                  {{ detailData.caseType }}-->
                </div>
                <div class="copy" v-if="detailData.caseType">
                  <div class="copy-text">
                    <el-tag size="mini" type="" @click="copyTextFunc(detailData.caseType)">{{ copyText }}</el-tag>
                  </div>
                  <div class="copy-search">
                    <el-tag size="mini" type="" @click="relSearch(detailData.caseType, 'caseType', '案件类型')">
                      关联搜索
                    </el-tag>
                  </div>
                </div>
              </div>
            </div>
            <div class="content-row" @mouseleave="copyText = '复制'">
              <div class="left-label">审理程序:</div>
              <div class="right-text">
                <div class="left-text" v-html="detailData.hearingProcedure">
<!--                  {{ detailData.hearingProcedure }}-->
                </div>
                <div class="copy" v-if="detailData.hearingProcedure">
                  <div class="copy-text">
                    <el-tag size="mini" type="" @click="copyTextFunc(detailData.hearingProcedure)">{{ copyText }}
                    </el-tag>
                  </div>
                  <div class="copy-search">
                    <el-tag size="mini" type=""
                            @click="relSearch(detailData.hearingProcedure, 'hearingProcedure', '审理程序')">关联搜索
                    </el-tag>
                  </div>
                </div>
              </div>
            </div>
            <div class="content-row" @mouseleave="copyText = '复制'">
              <div class="left-label">裁判日期:</div>
              <div class="right-text">
                <div class="left-text" v-html="detailData.adjudicationDate">
<!--                  {{ detailData.adjudicationDate }}-->
                </div>
                <div class="copy" v-if="detailData.adjudicationDate">
                  <div class="copy-text">
                    <el-tag size="mini" type="" @click="copyTextFunc(detailData.adjudicationDate)">{{ copyText }}
                    </el-tag>
                  </div>
                  <div class="copy-search">
                    <el-tag size="mini" type=""
                            @click="relSearch(detailData.adjudicationDate, 'adjudicationDateList', '裁判日期')">关联搜索
                    </el-tag>
                  </div>
                </div>
              </div>
            </div>
            <div class="content-row" @mouseleave="copyText = '复制'">
              <div class="left-label">公开日期:</div>
              <div class="right-text">
                <div class="left-text" v-html="detailData.openDate">
<!--                  {{ detailData.openDate }}-->
                </div>
                <div class="copy" v-if="detailData.openDate">
                  <div class="copy-text">
                    <el-tag size="mini" type="" @click="copyTextFunc(detailData.openDate)">{{ copyText }}</el-tag>
                  </div>
                  <div class="copy-search">
                    <el-tag size="mini" type="" @click="relSearch(detailData.openDate, 'openDateList', '公开日期')">
                      关联搜索
                    </el-tag>
                  </div>
                </div>
              </div>
            </div>
            <div class="content-row" @mouseleave="copyText = '复制'">
              <div class="left-label">当事人:</div>
              <div class="right-text">
                <div class="left-text" v-html="detailData.privyC">
<!--                  {{ detailData.privyC }}-->
                </div>
                <div class="copy"  v-if="detailData.privyC">
                  <div class="copy-text">
                    <el-tag size="mini" type="" @click="copyTextFunc(detailData.privyC)">{{ copyText }}</el-tag>
                  </div>
                  <div class="copy-search">
                    <el-tag size="mini" type="" @click="relSearch(detailData.privyC, 'privyC', '当事人')">关联搜索
                    </el-tag>
                  </div>
                </div>
              </div>
            </div>
            <div class="content-row" @mouseleave="copyText = '复制'">
              <div class="left-label">案由:</div>
              <div class="right-text">
                <div class="left-text" v-html="detailData.caseReason">
<!--                  {{ detailData.caseReason }}-->
                </div>
                <div class="copy" v-if="detailData.caseReason">
                  <div class="copy-text">
                    <el-tag size="mini" type="" @click="copyTextFunc(detailData.caseReason)">{{ copyText }}</el-tag>
                  </div>
                  <div class="copy-search">
                    <el-tag size="mini" type="" @click="relSearch(detailData.caseReason, 'caseReason', '案由')">
                      关联搜索
                    </el-tag>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="legal-basis">
          <div class="legal-basis-title">
            <div class="left-line"></div>
            <div class="title">法律依据</div>
          </div>
          <div class="legal-basis-content" v-html="detailData.legalBasis">
<!--            {{ detailData.legalBasis }}-->
          </div>
        </div>
        <div class="result">
          <div class="result-title">
            <div class="left-line"></div>
            <div class="title">判决全文</div>
          </div>
          <div class="result-content" v-html="result">
          </div>
        </div>
        <!--        <div class="bottom-content">-->
        <!--          <div>审判长</div>-->
        <!--          <div>xxx</div>-->
        <!--          <div>xxx二〇二一年十月四日</div>-->
        <!--          <div>书记员</div>-->
        <!--          <div>xxx</div>-->
        <!--        </div>-->
      </div>
    </div>
    <div class="judgment-document" :style="{width: halfWidth}">
      <div class="top-search-content">
        <span class="iconfont icon-caipanwenshujiansuo"></span>
        <span class="dialog-title">裁判文书搜索</span>
        <el-input class="left-search" size="mini" placeholder="请输入案件名称、法院、当事人、案由、审理程序"
                  v-model="allSearch" @change="allSearchChange">
                  <template slot="append" @click="allSearchChange">搜索</template>
                </el-input>

        <search ref="search" @search="searchEvent"></search>
        <!--        <el-button type="primary" size="mini">-->
        <!--          <span class="iconfont icon-shaixuan"></span>-->
        <!--          高级筛选-->
        <!--        </el-button>-->
        <el-button type="" size="mini" @click="isFavoriteSearch">
          <span class="iconfont" :class="isFavorite ? 'icon-aixin1' : 'icon-aixin'"></span>
          我的收藏
        </el-button>
      </div>
      <div class="search-sum">
        <div class="search-wrapper">
          <div class="search-tags">
            <el-tag size="small" type="info" closable v-for="(tag, index) in tagList" @close="closeTag(tag, index)"
                    :key="index">{{ tag.label }}: {{ tag.value }}
            </el-tag>
          </div>
        </div>
        <div class="search-info">
          <div class="scope-desc">
            数据范围：1985.1～2021.10
            <el-popover
              placement="top-start"
              width="400"
              trigger="hover">
              <svg-icon slot="reference" class="question" icon-class="问题" />
              <div v-html="'该数据可能与官方数据相比存在一定缺失，仅供参考!'"></div>
            </el-popover>
          </div>
          <div class="sum">
            共检索到 <span class="pointer">{{ total }}</span> 篇文书 <span v-if="documentSearchMaxTotal">，显示前{{documentSearchMaxTotal}}</span>
          </div>
        </div>
        <div class="divider"></div>
      </div>
      <div class="content-list"
           :style="{maxHeight: clientHeight + 'px', overflowY: 'auto', paddingRight: '15px', marginTop: '20px'}">
        <div class="doc-content" v-for="(doc, index) in docList" :key="index" :class="{ 'highlighted': selectedDocId === doc.id }" @click="showDetail(doc)">
          <div class="status" v-if="doc.hearingProcedure" v-html="doc.hearingProcedure"></div>
          <div class="triangle" v-if="doc.hearingProcedure"></div>
          <div class="title" :title="doc.caseName" v-html="doc.caseName">
<!--            {{ doc.caseName }}-->
          </div>
          <div class="info">
            <div class="iconfont " :class="doc.isFavorite ? 'icon-aixin1' : 'icon-aixin'"
                 @click.stop="favoriteClick(doc)"></div>
            <div class="court" v-html="doc.court">
<!--              {{ doc.court }}-->
            </div>
            <div class="no" v-html="doc.caseNum">
<!--              {{ doc.caseNum }}-->
            </div>
            <div class="date" v-html="doc.adjudicationDate">
              <span class="iconfont icon-susong"></span>
<!--              {{ doc.adjudicationDate }}-->
            </div>
            <el-popover
              placement="right"
              width="200"
              trigger="hover"
              popper-class="document-person-pop"
            >
              <div class="person" v-html="doc.privyC">
<!--                {{ doc.privyC }}-->
              </div>
              <div slot="reference" class="iconfont icon-wj-rymc"></div>
            </el-popover>
          </div>
          <span class="desc" :title="doc.legalBasis" v-html="doc.legalBasis">
            [法律依据]
<!--            {{ doc.legalBasis }}-->
          </span>
        </div>
      </div>
      <pagination
        class="page"
        v-show="total > 0"
        :total="documentSearchMaxTotal || total"
        :page.sync="listQuery.page"
        :pageSizes="pageSizesList"
        :limit.sync="listQuery.pageSize"
        @pagination="handleSearch()"/>

    </div>
  </div>

</template>

<script>

import {queryDocumentSearch, queryDocumentSearchById, updateFavoriteByUserId} from "@/api/docSearch";
import Pagination from "@/components/Pagination/index.vue";
import Search from "./Search.vue";

export default {
  name: "JudgmentDocument",
  components: {Search, Pagination},
  data() {
    return {
      documentSearchMaxTotal: 0,
      copyText: '复制',
      tagList: [],
      allSearch: undefined,
      isFavorite: 0,
      total: 0,
      pageSizesList: [10, 15, 20, 30, 40, 50],
      detailView: false,
      listQuery: {
        pageSize: 10,
        page: 1
      },
      detailData: {},
      queryData: {},
      docList: [],
      selectedDocId: ''
    }
  },
  props: {
    halfWidth: {}
  },
  computed: {
    clientHeight() {
      return document.documentElement.clientHeight - 200
    },
    result() {
      const list = this.detailData.fullText && this.detailData.fullText.split('。')
      if (!list) return ''
      list.push('')
      return list.join('。<br />')
    }
  },
  created() {
    this.queryList()
  },
  methods: {
    relSearch(value, key, label) {
      this.$set(this, 'queryData', {})
      if (key.includes('List')) {
        this.queryData[key] = [value, value]
      } else if (['privyC'].includes(key)) {
        this.queryData[key] = value.replace(/[^\w\u4E00-\u9FA5]|_/g, ',') // 所有标点符号替换成,
      } else {
        this.queryData[key] = value
      }
      this.tagList = [{
        label: label,
        value: this.queryData[key] + '',
        property: key
      }]
      this.clearOtherSearch('moreSearch')
      this.queryList(true, 'moreSearch')
      this.$refs.search.setData(this.queryData)
    },
    copyTextFunc(value) {
      this.copyText = '已复制'
      this.$copyText(value)
    },
    handleSearch() {
      if (this.tagList.length && !this.allSearch) {
        this.queryList(false, 'moreSearch')
      } else if (this.allSearch) {
        this.queryList(false, 'allSearch')
      } else if (this.isFavorite) {
        this.queryList(false, 'favoriteSearch')
      } else {
        this.queryList()
      }

    },
    clearOtherSearch(current) {
      if (current === 'moreSearch') {
        this.isFavorite = false
        this.allSearch = undefined
      } else if (current === 'allSearch') {
        this.tagList = []
        this.isFavorite = false
      } else if (current === 'favoriteSearch') {
        this.tagList = []
        this.allSearch = undefined
      }
    },
    closeTag(tag, index) {
      if (this.allSearch) {
        this.tagList.splice(index, 1)
        this.allSearch = this.tagList.map(item => item.value).join(' ')
        this.allSearchChange()
        return
      }
      this.tagList.splice(index, 1)
      delete this.queryData[tag.property]
      this.queryList(true, 'moreSearch')
    },
    // 模糊搜索
    allSearchChange() {
      this.clearOtherSearch('allSearch')
      if (this.allSearch) {
        this.tagList = this.allSearch.trim().split(' ').map(item => ({
          label: '全文',
          value: item
        }));
      } else {
        this.tagList = [];
      }
      this.queryList(true, 'allSearch')
    },
    // 我的收藏
    isFavoriteSearch() {
      this.isFavorite = !this.isFavorite
      this.clearOtherSearch('favoriteSearch')
      this.queryList(true, 'favoriteSearch')
    },
    // 高级搜索
    searchEvent(queryData) {
      this.tagList = queryData.tagList
      this.$set(this, 'queryData', {...queryData.data})
      this.clearOtherSearch('moreSearch')
      this.queryList(true, 'moreSearch')
    },
    favoriteClick(data) {
      let updateType = 0
      if (data.isFavorite === 0) { // 收藏
        updateType = 1
      } else { // 取消收藏
        updateType = 0
      }
      updateFavoriteByUserId({
        updateType,
        id: data.id
      }).then(res => {
        this.$message.success(res.message)
        data.isFavorite = updateType
      })
    },
    openLink() {
      window.open('https://wenshu.court.gov.cn/website/wenshu/181217BMTKHNT2W0/index.html?s21=' + this.detailData.caseNum)
    },
    queryList(resetPAgeQuery = false, type = 'allSearch') {
      let data = {}
      if (resetPAgeQuery) {
        this.listQuery.page = 1
      }
      if (type === 'favoriteSearch') {
        data = {quaryFavorite: +this.isFavorite}
      }
      if (type === 'allSearch') {
        data = {allSearch: this.allSearch}
      }
      if (type === 'moreSearch') {
        data = {...this.queryData}
      }
      queryDocumentSearch({
        ...this.listQuery,
        ...data
      }).then(res => {
        this.docList = res.data || []
        this.total = res.total || 0
        this.documentSearchMaxTotal = res.documentSearchMaxTotal || 0
      })
    },
    closeDetail() {
      this.selectedDocId = ''
      this.$emit('detail', false)
      setTimeout(() => this.detailView = false, 100)

    },
    showDetail(data) {
      this.detailView = true
      this.detailData = data
      this.selectedDocId = data.id
      // queryDocumentSearchById({id}).then(res => {
      //   this.detailData = res.data
      //   this.detailView = true
      // })

      this.$emit('detail', true)
    }
  }
}
</script>

<style lang="scss">
.document-person-pop {
  background-color: #498DDC;
  border-color: #498DDC;
  color: #fff;
  font-size: 14px;
  padding: 5px;

  .popper__arrow {
    &::after {
      border-right-color: #498DDC !important;
    }
  }
}
</style>
<style scoped lang="scss">

.judgment-wrapper {
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: flex-end;

  .left-detail {
    //flex: 1;
    border-right: 1px solid #F2F2F2;
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: auto;

    .detail-top {
      padding: 10px;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 80px;

      .top-left {
        flex: 1;
        text-align: center;
        font-size: 18px;
        font-weight: bold;
      }

      .top-right {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;
        align-items: center;

        .iconfont {
          font-size: 16px;
          cursor: pointer;
          color: #333;
        }

        .icon-aixin1 {
          color: #E5404F;
        }

        span {
          display: inline-block;
          width: 20px;
          height: 20px;
          line-height: 20px;
          //background-color: #3296FA;
          //border-radius: 3px;
        }

        .icon-aixin1, .icon-aixin {
          margin-top: 6px;
          font-weight: bold;
        }

        .icon-lianjie {
          //font-weight: lighter;
        }

        .go-back {
          cursor: pointer;

          span {
            //display: inline-block;
            //width: 20px;
            //height: 20px;
            //line-height: 20px;
            background-color: #3296FA;
            border-radius: 3px;
            color: #fff;
          }
        }
      }
    }

    .detail-content {
      display: flex;
      flex-direction: column;
      padding: 25px;
      padding-top: 0;

      .base-info {

        .base-info-title {
          display: flex;
          flex-direction: row;
          color: #333;
          //justify-content: center;
          align-items: center;

          .left-line {
            width: 6px;
            height: 22px;
            background-color: #498DDC;
            margin-right: 10px;
          }

          .title {
            font-size: 16px;
            font-weight: bold;
          }
        }

        .base-info-content {
          padding-left: 20px;
          padding-top: 10px;
          font-size: 14px;

          .content-row {
            display: flex;
            flex-direction: row;
            margin-bottom: 5px;

            .left-label {
              color: #333;
              font-weight: bold;
              margin-right: 8px;
              width: 60px;
              text-align: right;
            }

            .right-text {
              color: #555;
              cursor: default;
              flex: 1;
              text-align: left;
              display: flex;

              .left-text {
                max-width: calc(100% - 150px);
                word-break: break-all;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 1;
                overflow: hidden;
              }

              .copy {
                display: none;
                width: 150px;

                .copy-text {
                  cursor: pointer;
                  margin-left: 10px;
                  margin-right: 10px;
                }

                .copy-search {
                  cursor: pointer;
                }
              }

              &:hover {
                .copy {
                  display: flex;
                  //justify-content: space-around;
                }
              }
            }
          }

        }
      }

      .legal-basis {

        .legal-basis-title {
          display: flex;
          flex-direction: row;
          margin-top: 10px;
          color: #333;
          //justify-content: center;
          align-items: center;

          .left-line {
            width: 6px;
            height: 22px;
            background-color: #498DDC;
            margin-right: 10px;
          }

          .title {
            font-size: 16px;
            font-weight: bold;
          }

        }

        .legal-basis-content {
          padding-left: 20px;
          padding-top: 10px;
          text-align: left;
          font-size: 14px;
          color: #555;
        }
      }

      .result {

        .result-title {
          display: flex;
          flex-direction: row;
          color: #333;
          margin-top: 10px;
          align-items: center;

          .left-line {
            width: 6px;
            height: 22px;
            background-color: #498DDC;
            margin-right: 10px;
          }

          .title {
            font-size: 16px;
            font-weight: bold;
          }
        }

        .result-content {
          padding-left: 20px;
          padding-top: 10px;
          text-align: left;
          font-size: 14px;
          color: #555;
        }
      }
    }
  }
}

.bottom-content {
  display: flex;
  flex-direction: column;
  font-size: 14px;
  color: #555;

  div {
    text-align: right;
  }
}

.judgment-document {
  //flex: 1;
  display: flex;
  height: 100%;
  flex-direction: column;
  padding: 15px;
  padding-right: 50px;

  .top-search-content {
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;

    .icon-aixin1 {
      color: #E5404F;
    }

    .icon-caipanwenshujiansuo {
      flex-shrink: 0;
      font-size: 30px;
      color: #52A0F5;
    }

    .el-button {
      margin-left: 15px;
    }

    .icon-shaixuan {
      margin-right: 5px;
    }

    .dialog-title {
      flex-shrink: 0;
      margin-left: 5px;
      font-size: 20px;
      font-weight: bolder;
      margin-right: 20px;
    }

    .left-search {
      > > > .el-input-group__append {
        padding: 0;
        width: 60px;
        cursor: pointer;
       background-color:#409eff ;
       color:#fff ;
       margin-left: 5px;
      }
      > > > .el-input__inner {
        background-color: #F0F1F5;
        border: none;
      }
    }

  }

  .search-tags {
    display: flex;
    flex-direction: row;
    // margin-bottom: 10px;
    flex-wrap: wrap;

    .el-tag {
      background-color: #fff;
      color: #333;
      margin-right: 5px;
      margin-bottom: 5px;
    }
  }

  .search-sum {
    font-size: 14px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-end;

    .search-wrapper {
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: flex-end;
      padding-bottom: 5px;
    }

    .search-info {
      width: 100%;
      display: block;
      .scope-desc {
        float: left;
      }
      .sum {
        float: right;
      }
    }
    .divider {
      width: 100%;
      height: 2px;
      background-color: #498DDC;
    }
  }

  .doc-content {
    position: relative;
    cursor: pointer;
    width: 100%;
    height: 130px;
    border: 1px solid #EDEDED;
    margin-bottom: 20px;
    display: flex;
    padding: 10px 15px;
    flex-direction: column;

    &:hover {
      background-color: #F1F7FF;

      //.desc {
      //  &::after {
      //    background-color: #F1F7FF;
      //  }
      //}
    }

    .status {
      position: absolute;
      font-size: 12px;
      top: 11px;
      right: -10px;
      padding: 3px 25px;
      background-color: #498DDC;
      color: #fff;
      border-radius: 20px 0 0 20px;
    }

    .triangle {
      width: 10px;
      height: 10px;
      position: absolute;
      right: -10px;
      top: 35px;
      background-color: #498DDC;
      clip-path: polygon(0 0, 100% 0, 0 100%, 0 0)
    }

    //background: deeppink;
    //clip-path: polygon(0 0, 100% 0, 0 100%, 0 0)

    .title {
      width: 100%;
      flex-shrink: 0;
      text-align: left;
      //display: flex;
      word-break: break-all;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
      padding-right: 60px;
    }

    .info {
      margin-top: 10px;
      margin-bottom: 10px;
      border-bottom: 1px dashed #F2F2F2;
      padding-bottom: 5px;
      display: flex;
      flex-wrap: wrap;

      div {
        display: flex;
        align-items: center;
        margin-right: 20px;
        font-size: 14px;
        color: #7a7a7a;
      }

      .person {
        padding: 0 10px;
        background-color: #498DDC;
        color: #fff;
        border-radius: 3px;
        margin-left: 5px;
      }

      //.icon-wj-rymc {
      //  .person {
      //    display: none;
      //    padding: 0 10px;
      //    background-color: #498DDC;
      //    color: #fff;
      //    border-radius: 3px;
      //    margin-left: 5px;
      //  }
      //}

      .icon-aixin1 {
        color: #E5404F;
      }

    }

    .desc {
      position: relative;
      font-size: 12px;
      line-height: 18px;
      height: 36px;
      text-align: start;
      color: #333;
      word-break: break-all;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;

      //&::after {
      //  content: "..."; /* 显示省略号 */
      //  position: absolute;
      //  bottom: 0;
      //  right: 0;
      //  left: 70%;
      //  background-color: #fff;
      //}
    }
  }
  .highlighted {
    background-color: #F1F7FF; /* 高亮的背景颜色 */
    /* 添加其他样式以突显选中状态 */
  }
}

.page {
  //display: flex;
}
</style>
