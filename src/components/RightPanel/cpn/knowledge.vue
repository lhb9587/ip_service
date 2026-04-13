<template>
  <div class="judgment-wrapper">
    <div class="judgment-document" style="width: 475px">
      <div class="top-search-content">
        <span class="dialog-title">境外知识库</span>
        <span style="font-size: 22px; color: #409eff;" class="iconfont icon-wangluojiancha"/>
      </div>
      <div v-if="falg" class="search-sum">
        <div class="search-info">
          <el-input v-model="inptknowledge" clearable placeholder="请输入内容" @keyup.enter.native="oninput" style="background-color: #f5f4f4;">
            <i slot="prefix" style="font-size: 20px;" class="el-input__icon el-icon-search"/>
          </el-input>
        </div>
      </div>
      <div
        v-infinite-scroll="load"
        class="content-list"
        style="height: 100%;  margin-top: 20px; overflow-y: scroll;"
      >
        <div v-if="falg&&tagList.length!==0" style=" padding: 15px;" class="listb">
          <div v-for="(item,index) in tagList" :key="item.id" :class=" activein===index?'active lists':'lists'" style="" @click="onlist(index,item)">
            <div style="text-align: left;margin-left: 10px;" v-html="item.content"/>
            <div style="text-align: left;margin: 5px 0 5px 10px; margin-left: 10px;font-weight: 400;">匹配度: <span style="color: rgb(13, 71, 161);font-weight: 700;">{{item.score}}</span></div>
            <div style="display: flex;margin-left: 10px;font-weight: 400; justify-content: space-between;">来源: {{ item.webLink }}
              <div style="margin-right: 20px;">
                <i title="复制链接" class="iconfont icon-fuzhi-01" @click="fuzhi(item,$event)" />
                <!-- <i class="iconfont icon-lianjie" @click="lianj(item)" /> -->
                <i title="跳转链接" class="iconfont icon-lianjie23" @click="lianj(item,$event)" />
                <i title="下载" class="iconfont icon-fujian-xiazai" @click="xiazai(item,$event)" />
              </div>
            </div>
          </div>
        </div>
        <div v-if="falg&&tagList.length==0" class="noshuj">暂无数据</div>
        <div v-if="!falg" style="margin-top: 200px;">
          <div>
            <el-input v-model="inptknowledge" clearable placeholder="请输入内容" class="input-with-select" style="width: 350px;" @keyup.enter.native="oninput">
              <el-button slot="append" icon="el-icon-search" style="width: 20px; padding-left: 4px; font-size: 20px;" @click="oninput" />
            </el-input>
          </div>
          <div style="margin-top: 30px; width: 400px; ">
            <el-tag v-for="item in history" :key="item.id" size="medium" effect="plain" type="info" style="margin-right: 30px; margin-top: 10px; cursor: pointer;" @click="ontag(item)">{{ item }}</el-tag>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="judgment-left" :style="{width:wwidth}">
      <iframe width="100%" height="100%" :src="`/pdfjs-4.0.189-dist/web/viewer.html?file=${iframesrc}`" frameborder="0" id="myIframe"/>
    </div> -->
    <div class="judgment-left" :style="{width:wwidth}">
      <iframe
        v-show="rightfalg"
        ref="Iframe"
        class="iframe"
        :src="`/pdfjs/web/viewer.html?file=${iframesrc}`"
        allowfullscreen="true"
        frameborder="0"
        width="100%"
        height="100%"
      />
    </div>
  </div>

</template>

<script>
import { queryKnowledgeBase } from '@/api/knowledgeBase'
import { ElMessage } from 'element-ui'
import pdfjs from './pdfjs.vue'
export default {
  name: 'Knowledge',
  components: { pdfjs },
  data() {
    return {
      falg: false,
      rightfalg: false,
      iframesrc:'',
      activein: 999999,
      inptknowledge: '',
      tagList: [],
      pageNumber:1,
      listQuery: {
        pageSize: 10,
        page: 1
      },
      history: [],
      wwidth: '',
      windowWidth: window.innerWidth
    }
  },

  computed: {
    clientHeight() {
      return document.documentElement.clientHeight - 200
    }
  },
  watch: {
    windowWidth(newWidth) {
      this.wwidth = document.documentElement.clientWidth -518 + 'px'
    }
  },
  created() {
    this.history = JSON.parse(localStorage.getItem('history'))
  },
  mounted() {
    window.addEventListener('resize', this.handleResize);
  },
  methods: {
    handleResize() {
      this.windowWidth = window.innerWidth
    },
    fuzhi(item, event) {
      event.stopPropagation()
      const textarea = document.createElement('textarea');
      textarea.value = item.webLink
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      this.$message.success('复制成功')
    },
    lianj(item, event) {
      event.stopPropagation()
      window.open(item.webLink)
      this.$message.success('跳转链接')
    },
    xiazai(item, event) {
      console.log(event);
      event.stopPropagation()
      const link = document.createElement('a')
      link.href = `/ipdoc${item.filePath}`
      link.download = item.fileName
      link.setAttribute('download', ''); // 添加下载属性
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      this.$message.success('下载成功')
    },
    load(e) {
      console.log(e);
      this.listQuery.page = this.listQuery.page + 1
      queryKnowledgeBase({ content: this.inptknowledge, ...this.listQuery }).then((res) => {
        this.tagList = [...this.tagList, ...res.data]
        // this.tagList.concat(res.data)
      })
    },
    ontag(item) {
      this.wwidth = document.documentElement.clientWidth - 518 + 'px'
      console.log(this.wwidth);
      this.inptknowledge = item
      queryKnowledgeBase({ content: this.inptknowledge, ...this.listQuery }).then((res) => {
        this.tagList = res.data
      })
      this.falg = true
    },
    // 输入框
    oninput() {
      this.rightfalg = false
      const container = this.$el.querySelector('.content-list');
      container.scrollTo({
        top: 0,
      });
      this.listQuery.page = 1
      if (!this.inptknowledge.trim()) {
        this.falg = false
      } else {
        if (this.$refs.Iframe) {
          this.$refs.Iframe.contentWindow.location.reload()
        }
        this.wwidth = document.documentElement.clientWidth - 518 + 'px' // ifm宽度
        queryKnowledgeBase({ content: this.inptknowledge, ...this.listQuery }).then((res) => {
          this.tagList = res.data
        })
        // 历史记录
        if (!this.history) {
          localStorage.setItem('history', JSON.stringify([]))
        } else {
          if ((this.inptknowledge.trim())) {
            this.history.push(this.inptknowledge)
            localStorage.setItem('history', JSON.stringify(this.history))
            if (this.history.length > 20) {
              this.history.shift()
              localStorage.setItem('history', JSON.stringify(this.history))
            }
          }
        }
        this.falg = true
      }
    },
    // 点击列表
    onlist(a, item) {
      this.activein = a
      this.iframesrc = `/ipdoc${item.filePath}#page=${item.pageNumber}&keyword=${this.inptknowledge}`
      setTimeout(() => {this.rightfalg = true }, 300)
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
}

.judgment-document {
  //flex: 1;
  display: flex;
  height: 100%;
  flex-direction: column;
  padding: 15px 50px 15px 15px;
  /deep/.el-input__inner{
    background-color: #f5f4f4 !important;
  }
  .top-search-content {
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;

    .icon-caipanwenshujiansuo {
      flex-shrink: 0;
      font-size: 30px;
      color: #52A0F5;
    }

    .dialog-title {
      flex-shrink: 0;
      margin-left: 5px;
      font-size: 20px;
      font-weight: bolder;
      margin-right: 20px;
    }
  }
 }
 .noshuj{
      background-color: #f0f2f5;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
 .content-list{
  .listb{
    background-color: #f0f2f5;
    .lists {
    width:370px;
    padding-top: 10px;
    height: 120px;
    margin-bottom: 10px;
    border-radius: 5px;
    font-family: '苹方 粗体', '苹方 中等', 苹方,sans-serif;
    font-weight: 700;
    font-style: normal;
    font-size: 12px;
    background-color: #fff;
    i{
      cursor: pointer;
    }
  }:hover{
    cursor: default;
      background-color: #bbdefb;
    }
  }
  .active {
  background-color: #bbdefb !important;
}
}

.judgment-left {
  position: fixed;
  height: 1000px;
  left: 50px;
}
.iframe{
    position: absolute;
    top: 0;
    left: 0;
    z-index: 999;
  }
</style>
