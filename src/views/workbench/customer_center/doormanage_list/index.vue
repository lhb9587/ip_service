<template>

  <div class="app-container" :style="{height:clientHeight+160+'px'}">
    <div v-if="!falg" class="search-box">
      <el-alert title="已开通门户的客户" type="success" :closable="false" />
      <div style="display: flex; flex-wrap: wrap; width: 100%;">
        <div
          v-for="(item) in dataitem"
          :key="item.custId"
          style="width: 25%; padding: 1%; max-width: 400px;"
        >
          <div
            style="
              background-color: white;
              width: 100%;
              height: 120px;
              border-radius: 5px;
              padding: 10px;
              box-sizing: border-box;
              border-top: 2px solid #97b6f7;
              display: flex;
              justify-content: space-between;
            "
          >
            <div style="display: flex; align-items: center; width: 60%">
              <img v-if="item.logo" :src="`/ipdoc${item.logo}`" alt="" style="width: 58px;height: 58px;margin-right: 10px;object-fit: contain;">

              <span
                :title=" item.custName"
                style="
                  font-size: 18px;
                  font-weight: 600;
                  margin-bottom: 20px;
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                "
              >
                {{ item.custName }}</span>
            </div>
            <div style="margin-top: 20px;;">
              <el-button type="primary" size="small" round @click="access(item)">
                访问客户门户
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <div v-if="!falg" class="search-box">
      <div style="display: flex;" class="wkt">
        <span style="color:rgb(144, 147, 153); font-size:13px; margin-right: 20px;">未开通客户</span>
        <el-alert title="未开通客户" type="info" :closable="false" /> 
        <el-popover placement="top-start" width="430" trigger="hover" content="开通指定客户，请联系曜斗负责人员">
          <svg-icon slot="reference" class="question" icon-class="问题" />
        </el-popover>
      </div>
      <div style="display: flex; flex-wrap: wrap; width: 100%;">
        <div
          v-for="(item) in dataitema"
          :key="item.custId"
          style="width: 25%; padding: 1%"
        >
          <div
            style="
              background-color: white;
              width: 100%;
              height: 120px;
              border-radius: 5px;
              padding: 10px;
              box-sizing: border-box;
              border-top: 2px solid #97b6f7;
              display: flex;
              justify-content: space-between;
            "
          >
            <div style="display: flex; align-items: center; width: 60%">
              <img v-if="item.logo" :src="`/ipdoc${item.logo}`" alt="" style="width: 58px;height: 58px;margin-right: 10px;object-fit: contain;">
              <span
                :title=" item.custName"
                style="
                  flex: 1;
                  font-size: 18px;
                  font-weight: 600;
                  margin-bottom: 20px;
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                "
              >
                {{ item.custName }}</span>
            </div>
            <div style="margin-top: 20px;;">
              <el-button type="primary" round plain disabled @click="access()" >
                访问客户门户
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div> -->
    <!--src="https://ipc.wanhuida.com/#/ips"  -->
    <!--src="http://localhost:8080/#/ips"  -->
    <!-- src="http://192.168.0.24:8000/#/ips" -->
    <iframe
      v-if="falg"
      ref="Iframe"
      class="iframe"
      :src="iframeSrc"
      allowfullscreen="true"
      frameborder=0
      name="客户门户"
      width="99.4%"
      height="100%"
    />
    <div v-if="falg" class="iframef" style="position: fixed; z-index: 0; cursor: pointer; top: 49px;right: 82px;">
    <!-- <el-button type="primary" size="small" plain @click="oniframef" >
        关闭
      </el-button> -->
    </div>
  </div>
</template>
<script >
import { queryAccountCustList, authorizeIPS } from '../../../../api/caseList'
import { queryCustomerList } from '../../../../api/caseList'
export default {
  name: 'Index',
  data() {
    return {
      dataitem: [],
      dataitems: [],
      dataitema: [],
      url: '',
      loading: false,
      falg: false,
      tokenID: null,
      userInfo: {},
      iframeSrc: '',
      hasOnloadListener: 0
    }
  },
  computed: {
    clientHeight() {
      return document.documentElement.clientHeight - 220
    }
  },
  beforeMount() {
    console.log(window.location);
    // if (window.location.hostname==='ips.wanhuida.cn') {
    //   this.iframeSrc = 'https://ipc.wanhuida.com/#/ips' // 正式
    // } else if (window.location.hostname==='192.168.0.168') {
    //   this.iframeSrc = 'http://192.168.0.24:8000/#/ips' // 168
    // } else {
    //   this.iframeSrc = 'http://192.168.0.10:8080/#/ips' // 本地
    // }
    // if (process.env.NODE_ENV === 'production') { // 生产环境
    //   console.log('正式环境', process.env.NODE_ENV)
    //   this.iframeSrc = 'https://ipc.wanhuida.com/#/ips'
    // } else {
    //   console.log('测试环境', process.env.NODE_ENV)
    //   this.iframeSrc = 'http://192.168.0.10:8080/#/ips' // 开发环境与测试环境 http://localhost:8080/#/ips
    // }
    // this.iframeSrc = 'http://192.168.0.24:8000/#/ips'
    console.log(process.env.NODE_ENV, 'process.env.NODE_ENV')
    authorizeIPS().then(res => {
      localStorage.setItem('token', res.tokenID)
      this.tokenID = res.tokenID
      this.userInfo = res.data
      queryAccountCustList({ tokenID: this.tokenID }).then(res =>{
        console.log(res);
        this.dataitem = res.data.custList
        this.dataitema = res.data.noCustList
      })
    })
    window.addEventListener('message', (e) => {
      console.log(e.data)
      if (e.data === 1) {
        this.falg = false
        this.oniframef()
      }
    })
  },
  methods: {
    access(item) {
      console.log('打开门户网站', item)
      this.$store.dispatch('app/closeSideBar1')
      this.falg = true
      this.hasOnloadListener = 0
      const data = encodeURIComponent(JSON.stringify({
        tokenID: localStorage.getItem('token'),
        custId: item.custId,
        falg: false,
        sources: 'ips',
        userInfo: this.userInfo,
        hasOnloadListener: this.hasOnloadListener
      }))
      console.log({
        tokenID: localStorage.getItem('token'),
        custId: item.custId,
        falg: false,
        sources: 'ips',
        userInfo: this.userInfo,
        hasOnloadListener: this.hasOnloadListener
      },'传递的参数');
      if (window.location.hostname==='ips.wanhuida.cn') {
        this.iframeSrc = `https://ipc.wanhuida.com/#/ips?data=${data}` // 正式
      } else if (window.location.hostname==='192.168.0.168') {
        this.iframeSrc = `http://192.168.0.24:8000/#/ips?data=${data}` // 168
      } else {
        this.iframeSrc = `http://localhost:8080/#/ips?data=${data}` // 本地
      }
      console.log('开始传参');
      // 使用 $nextTick 确保 iframe 已经插入 DOM
      // console.log(this.$refs.Iframe, 'nextTick外刚点击完的Iframe');
      // this.$nextTick(() => {
      //   console.log('nextTick')
      //   if (this.hasOnloadListener === 0) {
      //     console.log(this.$refs.Iframe, 'nextTick里的Iframe');
      //     this.$refs.Iframe.onload = () => {
      //       // this.iframeSrc = `http://192.168.0.24:8000/#/ips?data=${data}`
      //       const send = this.$refs.Iframe.contentWindow
      //       console.log(send, 'send')
      //       console.log({
      //         tokenID: localStorage.getItem('token'),
      //         custId: item.custId,
      //         falg: false,
      //         sources: 'ips',
      //         userInfo: this.userInfo,
      //         hasOnloadListener: this.hasOnloadListener
      //       },
      //       this.iframeSrc, '携带的数据')
      //       // send.postMessage(
      //       //   {
      //       //     tokenID: localStorage.getItem('token'),
      //       //     custId: item.custId,
      //       //     falg: false,
      //       //     sources: 'ips',
      //       //     userInfo: this.userInfo,
      //       //     hasOnloadListener: this.hasOnloadListener
      //       //   },
      //       //   this.iframeSrc
      //       // )
      //       console.log(send, 'send')
      //       // const send = this.$refs.Iframe.contentWindow
      //       // send.postMessage({ tokenID: localStorage.getItem('token'), custId: item.custId, falg: false, userInfo: this.userInfo }, 'http://localhost:8080')
      //       // this.falg = true
      //       this.hasOnloadListener++
      //     }
      //   }
      // })
    },
    oniframef() {
      this.falg = false
    },
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  .iframe{
    position: absolute;
    top: 0;
  }
  .app-container{
    background-color: #f5f5f5;
  }
  .search-box1 {
    display: flex;
    justify-content: space-between;
    height: 70px;
    width: 100%;
    margin-top: 15px;
    border: 2px solid #F2F2F2;
    border-bottom: 2px solid #52A0F5;
    border-radius: 5px 5px 0 0;
    .el-alert--success /deep/{
      background-color: blue ;
      color: #f5f5f5;
      font-size: 14px;
    }
  }
  
  .search-box {
    width: 100%;
    margin-top: 15px;
    border: 2px solid #F2F2F2;
    border-radius: 5px 5px 0 0;
    background-color: #f5f5f5;
    border-bottom: 2px solid #52A0F5;
    .wkt {
      align-items: center;
      padding: 8px 16px 8px 16px;
      background-color: #ebe4e4;
      width: 100%;
      height: 40px;
    }
  }

</style>

