<template>
  <div>
    <el-row>
      <el-col :span="24" class="createPost-container">
        <el-form :model="tmallData" class="form-container" ref="postForm" size="small">
          <div class="createPost-main-container">
            <div class="form-con">
              <el-row class="form-border">
                <el-col :span="24">
                  <el-row class="tilteSpan">
                    <el-col :span="24">
                      <span>商标信息</span>
                    </el-col>
                  </el-row>

                  <el-row class="fullRow">
                    <el-col :span="24">
                      <el-form-item class="postInfo-container-item" label="商标图样:">
                        <template>
                          <img style="width:100px;height:100px;" :src="'ipdoc/downloadimage'+tmallData.imgFilePath" alt="">
                        </template>
                      </el-form-item>
                    </el-col>

                  </el-row>

                  <el-row>
                    <el-col :span="12">
                      <el-form-item class="postInfo-container-item" label="申请/注册号:">
                        <template>
                          <span>{{tmallData.regNumber}}</span>
                        </template>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item class="postInfo-container-item" label="商标名称:">
                        <template>
                          <span>{{tmallData.tmName}}</span>
                        </template>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item class="postInfo-container-item" label="状态及原因:">
                        <template>
                          <span>{{tmallData.status}}</span>
                        </template>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item class="postInfo-container-item" label="代理/办理机构:">
                        <template>
                          <span>{{tmallData.agent}}</span>
                        </template>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item class="postInfo-container-item" label="申请日期:">
                        <template>
                          <span>{{tmallData.appDate}}</span>
                        </template>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item class="postInfo-container-item" label="注册日期:">
                        <template>
                          <span>{{tmallData.regNoticeDate}}</span>
                        </template>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row class="fullRow">
                    <el-col :span="24">
                      <el-form-item class="postInfo-container-item" label="国际分类:">
                        <template>
                          <span>{{tmallData.tmType}}</span>
                        </template>
                      </el-form-item>
                    </el-col>

                  </el-row>
                  <el-row class="tilteSpan">
                    <el-col :span="24" class="">
                      <span></span>
                    </el-col>
                  </el-row>
                  <el-row class="fullRow">
                    <el-col :span="24">
                      <el-form-item class="postInfo-container-item" label="申请人名称(中文):">
                        <template>
                          <span>{{tmallData.applicantName}}</span>
                        </template>
                      </el-form-item>
                    </el-col>

                  </el-row>
                  <el-row class="fullRow">
                    <el-col :span="24">
                      <el-form-item class="postInfo-container-item" label="申请人地址(中文):">
                        <template>
                          <span>{{tmallData.applicantAddress}}</span>
                        </template>
                      </el-form-item>
                    </el-col>

                  </el-row>
                  <el-row class="fullRow">
                    <el-col :span="24">
                      <el-form-item class="postInfo-container-item" label="申请人名称(英文):">
                        <template>
                          <span>{{tmallData.applicantEnName}}</span>
                        </template>
                      </el-form-item>
                    </el-col>

                  </el-row>
                  <el-row class="fullRow">
                    <el-col :span="24">
                      <el-form-item class="postInfo-container-item" label="申请人地址(英文):">
                        <template>
                          <span>{{tmallData.applicantEnAddress}}</span>
                        </template>
                      </el-form-item>
                    </el-col>

                  </el-row>
                  <el-row class="tilteSpan">
                    <el-col :span="24" class="">
                      <span></span>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item class="postInfo-container-item" label="初审公告期号:">
                        <template>
                          <span>{{tmallData.approvalNumber}}</span>
                        </template>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item class="postInfo-container-item" label="初审公告日期:">
                        <template>
                          <span>{{tmallData.approvalDate}}</span>
                        </template>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item class="postInfo-container-item" label="注册公告期号:">
                        <template>
                          <span>{{tmallData.regnoticeNumber}}</span>
                        </template>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item class="postInfo-container-item" label="注册公告日期:">
                        <template>
                          <span>{{tmallData.regNoticeDate}}</span>
                        </template>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item class="postInfo-container-item" label="专用权期限:">
                        <template>
                          <span>{{tmallData.validStartDate}}--{{tmallData.validEndDate}}</span>
                        </template>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item class="postInfo-container-item" label="国际注册日期:">
                        <template>
                          <span>{{tmallData.gjRegDate}}</span>
                        </template>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item class="postInfo-container-item" label="后期指定日期:">
                        <template>
                          <span>{{tmallData.hqzdDate}}</span>
                        </template>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item class="postInfo-container-item" label="优先权日期:">
                        <template>
                          <span>{{tmallData.priorDate}}</span>
                        </template>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item class="postInfo-container-item" label="商标类型:">
                        <template>
                          <span>{{tmallData.classify}}</span>
                        </template>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item class="postInfo-container-item" label="是否共有商标:">
                        <template>
                          <span>{{(tmallData.gtApplicantName != null && tmallData.gtApplicantName != "")?'是':'否'}}</span>
                        </template>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row class="fullRow" v-if="tmallData.gtApplicantName != null && tmallData.gtApplicantName != ''">
                    <el-col :span="24">
                      <el-form-item class="postInfo-container-item" label="共有人:">
                        <template>
                          <span>{{tmallData.gtApplicantName}}</span>
                        </template>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row class="fullRow">
                    <el-col :span="24">
                      <el-form-item class="postInfo-container-item" label="商标形式:">
                        <template>
                          <span>{{tmallData.tmForm}}</span>
                        </template>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row class="tilteSpan">
                    <el-col :span="24" class="">
                      <span></span>
                    </el-col>
                  </el-row>

                  <el-row class="fullRow">
                    <el-col :span="24">
                      <el-form-item class="postInfo-container-item" label="商品/服务:">
                        <template>
                          <span style="margin-right:15px" v-for="(item,key) in tmallData.trademarkCategories" :key="key">{{item.tmGroup}}-{{item.name}}</span>
                        </template>
                      </el-form-item>
                    </el-col>

                  </el-row>
                  <el-row class="tilteSpan">
                    <el-col :span="24" class="">
                      <span></span>
                    </el-col>
                  </el-row>

                  <el-row class="fullRow">
                    <el-col :span="24">
                      <el-form-item class="postInfo-container-item" label="商标流程:">
                        <template>

                          <p style="" v-for="(item,key) in tmallData.trademarkProcesses" :key="key">{{item.statusDate}}-{{item.status}}</p>
                        </template>
                      </el-form-item>
                    </el-col>

                  </el-row>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-form>
        <el-row style="margin:20px 0px">
          <el-col :span="24" style="text-align:center">
            <el-button @click="$router.go(-1);" size="medium" type="primary">返回</el-button>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { tmdetailUrl } from "@/api/customerList";
export default {
  name: "TrademarkDetail",
  components: {},
  props: {},
  data() {
    return {
      tmallData: {}
    };
  },
  watch: {},
  computed: {},
  methods: {
    gettmDetail(tmid) {
      tmdetailUrl({ tmId: tmid }).then(res => {
        this.tmallData = res.data;
      });
    }
  },
  created() {
    const id = this.$route.params && this.$route.params.tmId;
    this.gettmDetail(id);
  },
  mounted() {}
};
</script>
<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.createPost-container {
  position: relative;
  padding: 10px;
  border: 1px solid #d7d7d7;
  // margin: 15px 20px;
  min-height: 800px;
  .step-div {
    padding: 20px 65px;
  }
  /deep/ .el-tabs__header {
    margin-bottom: 2px;
  }
  /deep/ .el-collapse-item__header {
    display: block;
    text-align: center;
    background: #f5f5f5;
    height: 35px;
    line-height: 35px;
  }
  /deep/ .el-collapse-item__content {
    padding: 0px;
  }

  .fg-div {
    height: 20px;
    background: #e4e4e4;
  }
  .tilteSpan {
    font-size: 18px;
    padding: 15px 0px;
    color: #7199d5;
    border-left: none !important;
    span {
      display: block;
    }
  }
  /deep/ .el-step {
    cursor: pointer;
  }
}
.table-dl-row {
  /deep/ thead,
  /deep/ th,
  /deep/ .el-table__header-wrapper,
  /deep/ .el-table__header,
  /deep/ tr,
  /deep/ td,
  /deep/ .el-select,
  /deep/ .el-input,
  /deep/ .el-input__inner {
    height: 35px;
    line-height: 35px;
    // padding: 0px;
  }
  /deep/ td {
    background-color: #ffffff !important;
  }
  /deep/ .el-input__inner,
  /deep/ .el-select {
    width: 100% !important;
  }
}
/deep/ .form-border {
  .el-form-item__error {
    position: relative !important;
    top: 0;

  }
  .el-row {
    margin: 0px;
    border-left: 1px solid #d7d7d7;
  }
  .postInfo-container-item {
    width: 100%;
  }

  .el-form-item__label {
    background-color: #f9f9f9;
    width: 36.7%;
    text-align: right;
  }

  .el-form-item {
    border-right: 1px solid #d7d7d7;
    margin: 0px !important;
  }
  .el-row {
    border-bottom: 1px solid #d7d7d7;
  }
  .el-input,
  .el-select {
    width: 77%;
  }
  .el-form-item__content {
    text-align: left;
    // height: 30px;
  }
  .fullRow {
    .el-form-item__label {
      width: 15%;
    }

    .el-input,
    .el-select {
      width: 30%;
    }
  }
  .el-input__inner {
    // border: none;
  }
  .el-select .el-input {
    width: 100%;
  }
  .postInfo-container-item {
    display: flex;
    width: 100%;
    .el-form-item__content {
      text-align: left;
      display: inline-table;
      width: 70%;
      min-width: 70%;
      padding: 5px 15px;
    }

    .el-form-item__label {
      line-height: 43px;
      border-right: 1px solid #d7d7d7;
    }
  }
  // border-top: 1px solid #d7d7d7;

  // border-bottom: 1px solid #d7d7d7;
}
/deep/ .el-table__header tr,
/deep/ .el-table__header th {
  padding: 0;
  height: 30px;
  background: #f5f5f5;
}
/deep/ .el-table__body tr,
/deep/ .el-table__body td {
  padding: 0;
  height: 40px;
}
/deep/ .el-step {
  cursor: pointer;
}
.upload-btn {
  display: inline-block;
  /deep/ .el-upload--text {
    display: none;
  }
}
/deep/ .el-table /deep/ .warning-row {
  background: #dd7a7a;
  color: white;
}
.redClass {
  color: #dd7a7a;
}
.greenClass {
  color: rgb(49, 165, 49);
}
.tmCmsearch {
  /deep/ .el-select .el-input {
    width: 130px;
  }
  /deep/ .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
}
.tmImg {
  width: 100px;
}
</style>

