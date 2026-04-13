<template>
  <div>
    <el-row>
      <el-col :span="24" class="createPost-container">
<!--        <el-form :model="tmallData" class="form-container" ref="postForm" size="small">-->
<!--          <div class="createPost-main-container">-->
<!--            <div class="form-con">-->
<!--              <el-row class="form-border">-->
<!--                <el-col :span="24">-->
<!--                  <el-row class="tilteSpan">-->
<!--                    <el-col :span="24">-->
<!--                      <span>商标信息</span>-->
<!--                    </el-col>-->
<!--                  </el-row>-->

<!--                  <el-row class="fullRow">-->
<!--                    <el-col :span="24">-->
<!--                      <el-form-item class="postInfo-container-item" label="商标图样:">-->
<!--                        <template>-->
<!--                          <img v-if="tmallData.imgFilePath" style="width:100px;height:100px;" :src="'tmFile'+tmallData.imgFilePath" alt="">-->
<!--                        </template>-->
<!--                      </el-form-item>-->
<!--                    </el-col>-->

<!--                  </el-row>-->

<!--                  <el-row>-->
<!--                    <el-col :span="12">-->
<!--                      <el-form-item class="postInfo-container-item" label="申请/注册号:">-->
<!--                        <template>-->
<!--                          <span>{{tmallData.regNumber}}</span>-->
<!--                        </template>-->
<!--                      </el-form-item>-->
<!--                    </el-col>-->
<!--                    <el-col :span="12">-->
<!--                      <el-form-item class="postInfo-container-item" label="商标名称:">-->
<!--                        <template>-->
<!--                          <span>{{tmallData.tmName}}</span>-->
<!--                        </template>-->
<!--                      </el-form-item>-->
<!--                    </el-col>-->
<!--                  </el-row>-->
<!--                  <el-row>-->
<!--&lt;!&ndash;                    <el-col :span="12">&ndash;&gt;-->
<!--&lt;!&ndash;                      <el-form-item class="postInfo-container-item" label="状态及原因:">&ndash;&gt;-->
<!--&lt;!&ndash;                        <template>&ndash;&gt;-->
<!--&lt;!&ndash;                          <span>{{tmallData.status}}</span>&ndash;&gt;-->
<!--&lt;!&ndash;                        </template>&ndash;&gt;-->
<!--&lt;!&ndash;                      </el-form-item>&ndash;&gt;-->
<!--&lt;!&ndash;                    </el-col>&ndash;&gt;-->
<!--                    <el-col :span="12">-->
<!--                      <el-form-item class="postInfo-container-item" label="代理/办理机构:">-->
<!--                        <template>-->
<!--                          <span>{{tmallData.agent}}</span>-->
<!--                        </template>-->
<!--                      </el-form-item>-->
<!--                    </el-col>-->
<!--                  </el-row>-->
<!--                  <el-row>-->
<!--                    <el-col :span="12">-->
<!--                      <el-form-item class="postInfo-container-item" label="申请日期:">-->
<!--                        <template>-->
<!--                          <span>{{tmallData.appDate}}</span>-->
<!--                        </template>-->
<!--                      </el-form-item>-->
<!--                    </el-col>-->
<!--                    <el-col :span="12">-->
<!--                      <el-form-item class="postInfo-container-item" label="注册日期:">-->
<!--                        <template>-->
<!--                          <span>{{tmallData.regNoticeDate}}</span>-->
<!--                        </template>-->
<!--                      </el-form-item>-->
<!--                    </el-col>-->
<!--                  </el-row>-->
<!--                  <el-row class="fullRow">-->
<!--                    <el-col :span="24">-->
<!--                      <el-form-item class="postInfo-container-item" label="国际分类:">-->
<!--                        <template>-->
<!--                          <span>{{tmallData.tmType}}</span>-->
<!--                        </template>-->
<!--                      </el-form-item>-->
<!--                    </el-col>-->

<!--                  </el-row>-->
<!--                  <el-row class="tilteSpan">-->
<!--                    <el-col :span="24" class="">-->
<!--                      <span></span>-->
<!--                    </el-col>-->
<!--                  </el-row>-->
<!--                  <el-row class="fullRow">-->
<!--                    <el-col :span="24">-->
<!--                      <el-form-item class="postInfo-container-item" label="申请人名称(中文):">-->
<!--                        <template>-->
<!--                          <span>{{tmallData.applicantName}}</span>-->
<!--                        </template>-->
<!--                      </el-form-item>-->
<!--                    </el-col>-->

<!--                  </el-row>-->
<!--                  <el-row class="fullRow">-->
<!--                    <el-col :span="24">-->
<!--                      <el-form-item class="postInfo-container-item" label="申请人地址(中文):">-->
<!--                        <template>-->
<!--                          <span>{{tmallData.applicantAddress}}</span>-->
<!--                        </template>-->
<!--                      </el-form-item>-->
<!--                    </el-col>-->

<!--                  </el-row>-->
<!--                  <el-row class="fullRow">-->
<!--                    <el-col :span="24">-->
<!--                      <el-form-item class="postInfo-container-item" label="申请人名称(英文):">-->
<!--                        <template>-->
<!--                          <span>{{tmallData.applicantEnName}}</span>-->
<!--                        </template>-->
<!--                      </el-form-item>-->
<!--                    </el-col>-->

<!--                  </el-row>-->
<!--                  <el-row class="fullRow">-->
<!--                    <el-col :span="24">-->
<!--                      <el-form-item class="postInfo-container-item" label="申请人地址(英文):">-->
<!--                        <template>-->
<!--                          <span>{{tmallData.applicantEnAddress}}</span>-->
<!--                        </template>-->
<!--                      </el-form-item>-->
<!--                    </el-col>-->

<!--                  </el-row>-->
<!--                  <el-row class="tilteSpan">-->
<!--                    <el-col :span="24" class="">-->
<!--                      <span></span>-->
<!--                    </el-col>-->
<!--                  </el-row>-->
<!--                  <el-row>-->
<!--                    <el-col :span="12">-->
<!--                      <el-form-item class="postInfo-container-item" label="初审公告期号:">-->
<!--                        <template>-->
<!--                          <span>{{tmallData.approvalNumber}}</span>-->
<!--                        </template>-->
<!--                      </el-form-item>-->
<!--                    </el-col>-->
<!--                    <el-col :span="12">-->
<!--                      <el-form-item class="postInfo-container-item" label="初审公告日期:">-->
<!--                        <template>-->
<!--                          <span>{{tmallData.approvalDate}}</span>-->
<!--                        </template>-->
<!--                      </el-form-item>-->
<!--                    </el-col>-->
<!--                  </el-row>-->
<!--                  <el-row>-->
<!--                    <el-col :span="12">-->
<!--                      <el-form-item class="postInfo-container-item" label="注册公告期号:">-->
<!--                        <template>-->
<!--                          <span>{{tmallData.regnoticeNumber}}</span>-->
<!--                        </template>-->
<!--                      </el-form-item>-->
<!--                    </el-col>-->
<!--                    <el-col :span="12">-->
<!--                      <el-form-item class="postInfo-container-item" label="注册公告日期:">-->
<!--                        <template>-->
<!--                          <span>{{tmallData.regNoticeDate}}</span>-->
<!--                        </template>-->
<!--                      </el-form-item>-->
<!--                    </el-col>-->
<!--                  </el-row>-->
<!--                  <el-row>-->
<!--                    <el-col :span="12">-->
<!--                      <el-form-item class="postInfo-container-item" label="专用权期限:">-->
<!--                        <template>-->
<!--                          <span>{{tmallData.validStartDate}}&#45;&#45;{{tmallData.validEndDate}}</span>-->
<!--                        </template>-->
<!--                      </el-form-item>-->
<!--                    </el-col>-->
<!--                    <el-col :span="12">-->
<!--                      <el-form-item class="postInfo-container-item" label="国际注册日期:">-->
<!--                        <template>-->
<!--                          <span>{{tmallData.gjRegDate}}</span>-->
<!--                        </template>-->
<!--                      </el-form-item>-->
<!--                    </el-col>-->
<!--                  </el-row>-->
<!--                  <el-row>-->
<!--                    <el-col :span="12">-->
<!--                      <el-form-item class="postInfo-container-item" label="后期指定日期:">-->
<!--                        <template>-->
<!--                          <span>{{tmallData.hqzdDate}}</span>-->
<!--                        </template>-->
<!--                      </el-form-item>-->
<!--                    </el-col>-->
<!--                    <el-col :span="12">-->
<!--                      <el-form-item class="postInfo-container-item" label="优先权日期:">-->
<!--                        <template>-->
<!--                          <span>{{tmallData.priorDate}}</span>-->
<!--                        </template>-->
<!--                      </el-form-item>-->
<!--                    </el-col>-->
<!--                  </el-row>-->
<!--                  <el-row>-->
<!--                    <el-col :span="12">-->
<!--                      <el-form-item class="postInfo-container-item" label="商标类型:">-->
<!--                        <template>-->
<!--                          <span>{{tmallData.classify}}</span>-->
<!--                        </template>-->
<!--                      </el-form-item>-->
<!--                    </el-col>-->
<!--                    <el-col :span="12">-->
<!--                      <el-form-item class="postInfo-container-item" label="是否共有商标:">-->
<!--                        <template>-->
<!--                          <span>{{(tmallData.gtApplicantName != null && tmallData.gtApplicantName != "")?'是':'否'}}</span>-->
<!--                        </template>-->
<!--                      </el-form-item>-->
<!--                    </el-col>-->
<!--                  </el-row>-->
<!--                  <el-row class="fullRow" v-if="tmallData.gtApplicantName != null && tmallData.gtApplicantName != ''">-->
<!--                    <el-col :span="24">-->
<!--                      <el-form-item class="postInfo-container-item" label="共有人:">-->
<!--                        <template>-->
<!--                          <span>{{tmallData.gtApplicantName}}</span>-->
<!--                        </template>-->
<!--                      </el-form-item>-->
<!--                    </el-col>-->
<!--                  </el-row>-->
<!--                  <el-row class="fullRow">-->
<!--                    <el-col :span="24">-->
<!--                      <el-form-item class="postInfo-container-item" label="商标形式:">-->
<!--                        <template>-->
<!--                          <span>{{tmallData.tmForm}}</span>-->
<!--                        </template>-->
<!--                      </el-form-item>-->
<!--                    </el-col>-->
<!--                  </el-row>-->
<!--                  <el-row class="tilteSpan">-->
<!--                    <el-col :span="24" class="">-->
<!--                      <span></span>-->
<!--                    </el-col>-->
<!--                  </el-row>-->

<!--                  <el-row class="fullRow">-->
<!--                    <el-col :span="24">-->
<!--                      <el-form-item class="postInfo-container-item" label="商品/服务:">-->
<!--                        <template>-->
<!--                          <span style="margin-right:15px" v-for="(item,key) in tmallData.trademarkCategories" :key="key">{{item.tmGroup}}-{{item.name}}&#45;&#45;{{item.enName}}</span>-->
<!--                        </template>-->
<!--                      </el-form-item>-->
<!--                    </el-col>-->

<!--                  </el-row>-->
<!--                  <el-row class="tilteSpan">-->
<!--                    <el-col :span="24" class="">-->
<!--                      <span></span>-->
<!--                    </el-col>-->
<!--                  </el-row>-->

<!--                  <el-row class="fullRow" id="trademark-process">-->
<!--                    &lt;!&ndash; 商标流程状态 &ndash;&gt;-->
<!--                    <el-col :span="24" class="process-container">-->
<!--                      <div class="process-title">商标流程状态</div>-->
<!--                      <div class="process-timeline">-->
<!--                        <div-->
<!--                          class="process-item"-->
<!--                          v-for="(item, index) in tmallData.trademarkProcessStatusList"-->
<!--                          :key="index"-->
<!--                        >-->
<!--                          <div class="process-circle"></div>-->
<!--                          <div class="process-line" v-if="index < tmallData.trademarkProcessStatusList.length - 1"></div>-->
<!--                          <div class="process-content">-->
<!--                            <div class="process-header">-->
<!--                              <span class="process-number">{{ item.linkName }}</span>-->
<!--                              <span class="process-date">{{ item.processDate }}</span>-->
<!--                            </div>-->
<!--                            <div class="process-details">-->
<!--                              <span>{{ item.businessName }}</span>-->
<!--                              <span>{{ item.linkTitle }}</span>-->
<!--                              <span class="process-conclusion">{{ item.conclusion }}</span>-->
<!--                            </div>-->
<!--                          </div>-->
<!--                        </div>-->
<!--                      </div>-->
<!--                      &lt;!&ndash; 添加免责声明 &ndash;&gt;-->
<!--                      <div class="disclaimer" style="color: #999;font-size: 14px;">-->
<!--                        免责声明: 此界面商标流程仅供参考，具体流程请以商标局官方网站信息为准-->
<!--                      </div>-->
<!--                    </el-col>-->
<!--                  </el-row>-->
<!--                </el-col>-->
<!--              </el-row>-->
<!--            </div>-->
<!--          </div>-->
<!--        </el-form>-->

        <el-form :model="tmallData" class="form-container" ref="postForm" size="small">
          <div class="createPost-main-container" style="padding-right:35px">
            <div class="form-con">
              <el-row class="form-border">
                <el-col :span="24">
                  <el-row class="tilteSpan">
                    <el-col :span="24">
                      <span>商标信息</span>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
              <el-row class="form-border form-top" style="display: flex">
                <el-col :span="6" style="flex: 1;height: auto;">
                  <el-row style="height: 100%;">
                    <el-col :span="24" style="height: 100%;">
                      <el-form-item style="height: 100%;display: flex;align-items: center;border-right: none !important;" class="postInfo-container-item left-img" label=" " label-width="0">
                        <template>
                          <img v-if="tmallData.imgFilePath" style="width:100%;object-fit: cover" :src="'tmFile'+tmallData.imgFilePath" alt="">
                        </template>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-col>
                <el-col :span="18">
                  <el-row>
                    <el-col :span="8">
                      <el-form-item class="postInfo-container-item" label="申请/注册号:">
                        <template>
                          <span>{{tmallData.regNumber}}</span>
                        </template>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item class="postInfo-container-item" label="申请日期:">
                        <template>
                          <span>{{tmallData.appDate}}</span>
                        </template>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item class="postInfo-container-item" label="是否共有商标:">
                        <template>
                          <span>{{(tmallData.gtApplicantName != null && tmallData.gtApplicantName != "")?'是':'否'}}</span>
                        </template>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <!--                    <el-col :span="12">-->
                    <!--                      <el-form-item class="postInfo-container-item" label="状态及原因:">-->
                    <!--                        <template>-->
                    <!--                          <span>{{tmallData.status}}</span>-->
                    <!--                        </template>-->
                    <!--                      </el-form-item>-->
                    <!--                    </el-col>-->
                    <el-col :span="8">
                      <el-form-item class="postInfo-container-item" label="国际分类:">
                        <template>
                          <span>{{tmallData.tmType}}</span>
                        </template>
                      </el-form-item>
                    </el-col>
                    <el-col :span="16">
                      <el-form-item class="postInfo-container-item" label="商标名称:">
                        <template>
                          <span>{{tmallData.tmName}}</span>
                        </template>
                      </el-form-item>
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
<!--                  <el-row class="fullRow">-->
<!--                    <el-col :span="24">-->
<!--                      <el-form-item class="postInfo-container-item" label="申请人名称(英文):">-->
<!--                        <template>-->
<!--                          <span>{{tmallData.applicantEnName}}</span>-->
<!--                        </template>-->
<!--                      </el-form-item>-->
<!--                    </el-col>-->
<!--                  </el-row>-->
                  <el-row>
                    <el-col :span="8">
                      <el-form-item class="postInfo-container-item" label="初审公告期号:">
                        <template>
                          <span>{{tmallData.approvalNumber}}</span>
                        </template>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item class="postInfo-container-item" label="初审公告日期:">
                        <template>
                          <span>{{tmallData.approvalDate}}</span>
                        </template>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item class="postInfo-container-item" label="商标类型:">
                        <template>
                          <span>{{tmallData.classify}}</span>
                        </template>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="8">
                      <el-form-item class="postInfo-container-item" label="注册公告期号:">
                        <template>
                          <span>{{tmallData.regnoticeNumber}}</span>
                        </template>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item class="postInfo-container-item" label="注册公告日期:">
                        <template>
                          <span>{{tmallData.regNoticeDate}}</span>
                        </template>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item class="postInfo-container-item" label="专用权期限:">
                        <template>
                          <span>{{tmallData.validStartDate}}--{{tmallData.validEndDate}}</span>
                        </template>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="8">
                      <el-form-item class="postInfo-container-item" label="国际注册日期:">
                        <template>
                          <span>{{tmallData.gjRegDate}}</span>
                        </template>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item class="postInfo-container-item" label="后期指定日期:">
                        <template>
                          <span>{{tmallData.hqzdDate}}</span>
                        </template>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item class="postInfo-container-item" label="优先权日期:">
                        <template>
                          <span>{{tmallData.priorDate}}</span>
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
<!--                  <el-row class="fullRow">-->
<!--                    <el-col :span="24">-->
<!--                      <el-form-item class="postInfo-container-item" label="申请人地址(英文):">-->
<!--                        <template>-->
<!--                          <span>{{tmallData.applicantEnAddress}}</span>-->
<!--                        </template>-->
<!--                      </el-form-item>-->
<!--                    </el-col>-->
<!--                  </el-row>-->
                  <el-row>
                    <el-col :span="24">
                      <el-form-item class="postInfo-container-item" label="代理/办理机构:">
                        <template>
                          <span>{{tmallData.agent}}</span>
                        </template>
                      </el-form-item>
                    </el-col>
<!--                    <el-col :span="12">-->
<!--                      <el-form-item class="postInfo-container-item" label="注册日期:">-->
<!--                        <template>-->
<!--                          <span>{{tmallData.regNoticeDate}}</span>-->
<!--                        </template>-->
<!--                      </el-form-item>-->
<!--                    </el-col>-->
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
                      <el-form-item class="postInfo-container-item" label="类似群:">
                        <template>
                          <span>{{tmallData.tmGroup}}</span>
                        </template>
                      </el-form-item>
                    </el-col>
                  </el-row>
<!--                  <el-row class="tilteSpan">-->
<!--                    <el-col :span="24" class="">-->
<!--                      <span></span>-->
<!--                    </el-col>-->
<!--                  </el-row>-->

                  <el-row class="fullRow">
                    <el-col :span="24">
                      <el-form-item class="postInfo-container-item" label="商品/服务名称:">
                        <template>
                          <span style="margin-right:15px;word-break: keep-all;" v-for="(item,key) in tmallData.trademarkCategories" :key="key">{{item.tmGroup}}-{{item.name}}--{{item.enName}}</span>
                        </template>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row class="">
                    <el-col :span="8">
                      <el-form-item class="postInfo-container-item" label="商标状态:">
                        <template>
                          <span>{{tmallData.status}}</span>
                        </template>
                      </el-form-item>
                    </el-col>
                    <el-col :span="16">
                      <el-form-item class="postInfo-container-item" label="最后公告:">
                        <template>
<!--                          <span>{{tmallData.status}}</span>-->
                        </template>
                      </el-form-item>
                    </el-col>
                  </el-row>
<!--                  <el-row class="fullRow">-->
<!--                    <el-col :span="24">-->
<!--                      <el-form-item class="postInfo-container-item" label="最后流程:">-->
<!--                        <template>-->
<!--                        </template>-->
<!--                      </el-form-item>-->
<!--                    </el-col>-->
<!--                  </el-row>-->
                </el-col>
              </el-row>
              <el-row class="form-border">
                <el-col :span="24">
                  <el-row class="tilteSpan">
                    <el-col :span="24" class="">
                      <span></span>
                    </el-col>
                  </el-row>

                </el-col></el-row>
              <el-row class="form-border">
                <el-col :span="24">
                  <el-row class="fullRow" id="trademark-process">
                    <!-- 商标流程状态 -->
                    <el-col :span="24" class="process-container">
                      <div class="process-title">商标流程状态</div>
                      <div class="process-timeline">
                        <div
                          class="process-item"
                          v-for="(item, index) in tmallData.trademarkProcessStatusList"
                          :key="index"
                        >
                          <div class="process-circle"></div>
                          <div class="process-line" v-if="index < tmallData.trademarkProcessStatusList.length - 1"></div>
                          <div class="process-content">
                            <div class="process-header">
                              <span class="process-number">{{ item.linkName }}</span>
                              <span class="process-date">{{ item.processDate }}</span>
                            </div>
                            <div class="process-details">
                              <span>{{ item.businessName }}</span>
                              <span>{{ item.linkTitle }}</span>
                              <span class="process-conclusion">{{ item.conclusion }}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <!-- 添加免责声明 -->
                      <div class="disclaimer" style="color: #999;font-size: 14px;">
                        免责声明: 此界面商标流程仅供参考，具体流程请以商标局官方网站信息为准
                      </div>
                    </el-col>
                  </el-row>
                </el-col></el-row>

            </div>
          </div>
        </el-form>
        <el-row style="margin:20px 0px">
          <el-col :span="24" style="text-align:center">
            <el-button @click="centerClick" size="medium" type="primary">返回</el-button>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { tmdetailsearUrl } from "@/api/customerList";
export default {
  name: "RetrievalDetall",
  components: {},
  props: {
    tmType: '',
    tId:'',
    regNumber: ''
  },
  data() {
    return {
      tmallData: {}
    };
  },
  watch: {},
  computed: {},
  methods: {
    gettmDetail(regNumber, tmType) {
      tmdetailsearUrl({ regNumber, tmType }).then(res => {
        this.tmallData = res.data;
        this.$nextTick(() => {
          // 数据获取完后，通知父组件执行滚动
          this.$emit('scrollToTrademarkProcess');
        })
      });
    },
    centerClick(){
      this.$emit("callbackList", true);
    },
  },
  created() {
    // const id = this.$route.params && this.$route.params.tmId;
    this.gettmDetail(this.regNumber, this.tmType);
  },
  mounted() {}
};
</script>
<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.createPost-container {
  position: relative;
  padding: 10px;
  border: 1px solid #606266;
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
    border-left: 1px solid #606266;
  }
  .postInfo-container-item {
    width: 100%;
  }

  .el-form-item__label {
    background-color: #f9f9f9;
    width: 140px;
    text-align: right;
    flex-shrink: 0;
  }

  .el-form-item {
    border-right: 1px solid #606266;
    margin: 0px !important;
  }
  .el-row {
    border-bottom: 1px solid #606266;
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
      width: 140px;
      flex-shrink: 0;
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
      border-right: 1px solid #606266;
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

/* 流程状态容器 */
.process-container {
  padding: 20px;
  background-color: #f9fafc;
  border-radius: 8px;
}

/* 标题 */
.process-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

/* 流程时间轴 */
.process-timeline {
  display: flex;
  flex-direction: column;
  position: relative;
  padding-left: 20px;
}

/* 时间轴节点 */
.process-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 10px;
  position: relative;
}

.process-circle {
  width: 12px;
  height: 12px;
  background-color: #409eff;
  border-radius: 50%;
  position: absolute;
  left: 0;
  top: 12px;
}

.process-line {
  width: 2px;
  height: calc(100% - 12px);
  background-color: #e4e7ed;
  position: absolute;
  left: 5px;
  top: 18px;
}

/* 节点内容 */
.process-content {
  flex: 1;
  margin-left: 30px;
  padding: 10px 20px;
  background: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.process-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  font-size: 14px;
  font-weight: bold;
  color: #606266;
}

.process-details {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #333;
}

.process-conclusion {
  color: #67c23a;
  font-weight: bold;
}

.left-img {
  border-right: none !important;
  >>> .el-form-item__content {
    width: 100% !important;
  }
}

.form-top {
  border: 1px solid #333;
  /deep/ .el-form-item {
    border-right: 1px solid #606266 !important;
  }
  /deep/ .el-row {
    border-left: 1px solid #606266 !important;
    border-bottom: 1px solid #606266 !important;
  }
  /deep/ .postInfo-container-item .el-form-item__label {
    border-right: 1px solid #606266 !important;
  }
}
</style>

