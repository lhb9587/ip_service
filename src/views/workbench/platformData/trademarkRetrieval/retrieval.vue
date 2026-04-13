<template>
  <div v-if="tmListBool" class="app-container">
    <header class="y-header">{{$route.meta.title}}</header>
    <div class="filter-container" style="margin-bottom:15px">
      <el-form :inline="true" :model="listQuery" size="small" class="demo-form-inline">
        <el-row class="searchfullRow">
          <el-tabs v-model="searchradio" type="card">
            <el-tab-pane label="搜索" name="0">
              <el-col v-if="searchradio=='0'" :span="24" style=" text-align:left ;margin-bottom:10px">
                <span style="color:#7199d5;font-size:15px;margin-left: 0px;">状态：</span>
                <el-radio-group v-model="listQuery.status">
                  <el-radio label="">全部</el-radio>
                  <el-radio label="已注册"></el-radio>
                  <el-radio label="已无效"></el-radio>
                  <el-radio label="申请中"></el-radio>

                </el-radio-group>
              </el-col>
              <el-col v-if="searchradio=='0'" :span="10" style=" text-align:center ">

                <el-input @keyup.enter.native="getList()" placeholder="请输入内容" v-model="searchInput" class="input-with-select">
                  <el-select v-model="searchType" slot="prepend" placeholder="请选择">
                    <el-option label="模糊" value="keyword"></el-option>
                    <el-option label="商标名称" value="tmName"></el-option>
                    <el-option label="商标号" value="regNumber"></el-option>
                    <el-option label="申请人中文名称" value="applicantName"></el-option>
                    <el-option label="申请人中文地址" value="applicantAddress"></el-option>
                    <el-option label="初审公告号" value="approvalNumber"></el-option>
                  </el-select>

                  <el-button slot="append" icon="el-icon-search" style="background-color:#409eff;color:white;border-radius: initial;" @click="getList()">

                  </el-button>

                </el-input>

              </el-col>
            </el-tab-pane>
            <el-tab-pane label="翻译" name="1">
              <el-col v-if="searchradio=='1'" :span="12" style=" text-align:center ">
                <el-row style="position: relative;">
                  <el-col :span="20">
                    <el-input style="display:inline-block" :rows="3" placeholder="请输入商标号,以回车分隔" type="textarea" v-model="searcharea" />
                  </el-col>
                  <el-col :span="3" style="height: 75px;padding-top: 37px;">
                    <el-button type="primary" size="medium" @click="getList()">
                      搜索
                    </el-button>
                  </el-col>
                </el-row>

              </el-col>
            </el-tab-pane>

          </el-tabs>
          <!-- <el-col :span="12" :offset="6" style=" text-align:left ;margin-bottom:10px">
            <span style="color:#7199d5;font-size:15px">模式切换：</span>
            <el-radio-group @change="typechange" v-model="searchradio">
              <el-radio label="0">搜索</el-radio>
              <el-radio label="1">翻译</el-radio>

            </el-radio-group>
          </el-col> -->

        </el-row>

      </el-form>

    </div>
    <el-dropdown v-if='total>0' style="float:right"  size="mini" @command="commandClick">
      <el-button type="primary" size="mini">
        导出<i class="el-icon-arrow-down el-icon--right"></i>
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="1">(中英文)</el-dropdown-item>
        <el-dropdown-item command="2">中、英文</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
<!--    <el-button v-if='total>0&&searchradio==0' type="primary" style="float:right" size="mini" @click="dialogVisible=true">-->
<!--      导出-->
<!--    </el-button>-->
    <TitleTotal :total="total" />

    <el-row v-for="(item,index) in list" :key="index">
      <el-col :span="24">
        <el-card shadow="hover">
          <el-row>
            <el-col :span="2">
              <div class="avatar1">
                <img @click="pushtodetail(item)" class="avatar" :src="'tmFile'+item.imgFilePath" alt="">
              </div>
            </el-col>
            <el-col :span="22">

              <p style="color: #6AA7FF;"> <span v-html="filterKeyLight(item.tmName)" style="cursor: pointer;font-size: 18px;margin-right:15px" @click="pushtodetail(item)">
                </span>
                <span style="cursor: pointer;font-size: 14px;">注册号：</span><span v-html="filterKeyLight(item.regNumber)" style="cursor: pointer;" @click="pushtodetail(item)">
                </span>
              </p>

              <p style="font-size: 14px;">申请人中文名称： <span style="margin-right:15px" v-html="filterKeyLight(item.applicantName)"> </span>
                申请日期： <span>{{item.appDate}}</span></p>

              <p style="font-size: 14px;">
                初审公告日期：<span style="margin-right:15px">{{item.approvalDate}}</span>初审公告期号：<span style="margin-right:15px">{{item.approvalNumber}}</span>注册公告期号：<span
                  style="margin-right:15px">{{item.regnoticeNumber}}</span>注册公告日期：<span>{{item.regNoticeDate}}</span></p>

              <p style="font-size: 14px;"> 商品服务项目： <span>{{ item.tmType }}</span></p>

              <el-tag class="tag" :type="tagitems[item.status]" effect="dark">{{item.status}}</el-tag>

            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
    <!-- <el-table size="mini" :data="list" border fit empty-text="暂无数据" highlight-current-row current-row-key style="width: 100%;">
      <el-table-column type="index" width="50" label="序号" align="left"></el-table-column>
      <el-table-column align="left" label="商标图样" width>
        <template slot-scope="scope">
          <img @click="pushtodetail(scope.row)" style="width:100px;height:100px;cursor: pointer;" :src="'tmFile'+scope.row.imgFilePath" alt="">
        </template>
      </el-table-column>
      <el-table-column align="left" label="商标注册号" width>
        <template slot-scope="scope">
          <span style="cursor: pointer;" @click="pushtodetail(scope.row)">{{ scope.row.regNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" label="商标名称" width>
        <template slot-scope="scope">
          <span style="cursor: pointer;" @click="pushtodetail(scope.row)">{{ scope.row.tmName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" label="申请人" width>
        <template slot-scope="scope">
          <span>{{ scope.row.applicantName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" label="类别" width>
        <template slot-scope="scope">
          <span>{{ scope.row.tmType }}</span>
        </template>
      </el-table-column>

    </el-table> -->

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList('page')" />
    <template v-if="goodsMode==1">
    <el-dialog title="选择导出项" :visible.sync="dialogVisible" width="40%" :modal="false">
      <el-row>
        <el-col :span="24" style="text-align: center">

          <el-transfer :titles="['所有项','导出项']" style="text-align: left; display: inline-block" v-model="dcvalue" :props="{
      key: 'value',
      label: 'desc'
    }" :data="dcdata">
          </el-transfer>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dcbtn">确 定</el-button>
      </span>
    </el-dialog>
    </template>
    <template v-if="goodsMode==2">
    <el-dialog title="选择导出项" :visible.sync="dialogVisible" width="40%"  :modal="false">
      <el-row>
        <el-col :span="24" style="text-align: center">

          <el-transfer :titles="['所有项','导出项']" style="text-align: left; display: inline-block" v-model="dcvalue2" :props="{
      key: 'value',
      label: 'desc'
    }" :data="dcdata2">
          </el-transfer>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dcbtn(2)">确 定</el-button>
      </span>
    </el-dialog>
    </template>
  </div>
  <RetrievalDetall v-else :tId='dttId' :regNumber="regNumber" :tmType="tmType" @callbackList="callbackList"/>
</template>
<script>
import { searchTmUrl } from "@/api/customerList";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import RetrievalDetall from "./components/RetrievalDetall";
const defaultdcmr = [
  "sn",
  "filePath",
  "tmName",
  "regNumber",
  "tmType",
  "applicantName",
  "applicantEnName",
  "applicantAddress",
  "applicantEnAddress",
  "appDate",
  "approvalNumber",
  "approvalDate",
  "regnoticeNumber",
  "regNoticeDate",
  "validStartDate",
  "validEndDate",
  "agent",
  "tmGroup",
  "trademarkCategories",
  "classify"
];
const defaultdcmr2 = [
  "sn",
  "filePath",
  "tmName",
  "regNumber",
  "tmType",
  "applicantName",
  "applicantEnName",
  "applicantAddress",
  "applicantEnAddress",
  "appDate",
  "approvalNumber",
  "approvalDate",
  "regnoticeNumber",
  "regNoticeDate",
  "validStartDate",
  "validEndDate",
  "agent",
  "tmGroup",
  "trademarkCategories",
  "trademarkCategoriesCn",
  "classify"
];
const defaultdc = [
  { desc: "序号", value: "sn" },
  { desc: "商标图样", value: "filePath" },
  { desc: "商标名称", value: "tmName" },
  { desc: "注册号/申请号", value: "regNumber" },
  { desc: "国际分类", value: "tmType" },
  { desc: "申请人名称（中文）", value: "applicantName" },
  { desc: "申请人名称（英文）", value: "applicantEnName" },
  { desc: "申请人地址（中文）", value: "applicantAddress" },
  { desc: "申请人地址（英文）", value: "applicantEnAddress" },
  { desc: "申请日期", value: "appDate" },
  { desc: "初审公告期号", value: "approvalNumber" },
  { desc: "初审公告日期", value: "approvalDate" },
  { desc: "注册公告期号", value: "regnoticeNumber" },
  { desc: "注册公告日期", value: "regNoticeDate" },
  { desc: "专用期开始日期", value: "validStartDate" },
  { desc: "专用期结束日期", value: "validEndDate" },
  { desc: "代理/办理机构", value: "agent" },
  { desc: "类似群", value: "tmGroup" },
  { desc: "商品/服务(中英文)", value: "trademarkCategories" },
  { desc: "商标类型", value: "classify" },
  { desc: "是否驰名商标", value: "famous" },
  { desc: "是否立体商标", value: "ifSolidTm" },
  { desc: "是否共有申请", value: "ifShareTm" },
  { desc: "优先权日期", value: "priorDate" },
  { desc: "国际注册日期", value: "gjRegDate" },
  { desc: "后期指定日期", value: "hqzdDate" },
  { desc: "共有人中文名称", value: "gtApplicantName" }
];
const defaultdc2 = [
  { desc: "序号", value: "sn" },
  { desc: "商标图样", value: "filePath" },
  { desc: "商标名称", value: "tmName" },
  { desc: "注册号/申请号", value: "regNumber" },
  { desc: "国际分类", value: "tmType" },
  { desc: "申请人名称（中文）", value: "applicantName" },
  { desc: "申请人名称（英文）", value: "applicantEnName" },
  { desc: "申请人地址（中文）", value: "applicantAddress" },
  { desc: "申请人地址（英文）", value: "applicantEnAddress" },
  { desc: "申请日期", value: "appDate" },
  { desc: "初审公告期号", value: "approvalNumber" },
  { desc: "初审公告日期", value: "approvalDate" },
  { desc: "注册公告期号", value: "regnoticeNumber" },
  { desc: "注册公告日期", value: "regNoticeDate" },
  { desc: "专用期开始日期", value: "validStartDate" },
  { desc: "专用期结束日期", value: "validEndDate" },
  { desc: "代理/办理机构", value: "agent" },
  { desc: "类似群", value: "tmGroup" },
  { desc: "商品/服务(英文)", value: "trademarkCategories" },
  { desc: "商品/服务(中文)", value: "trademarkCategoriesCn" },
  { desc: "商标类型", value: "classify" },
  { desc: "是否驰名商标", value: "famous" },
  { desc: "是否立体商标", value: "ifSolidTm" },
  { desc: "是否共有申请", value: "ifShareTm" },
  { desc: "优先权日期", value: "priorDate" },
  { desc: "国际注册日期", value: "gjRegDate" },
  { desc: "后期指定日期", value: "hqzdDate" },
  { desc: "共有人中文名称", value: "gtApplicantName" }
];
const fydefaultdc = [
  { desc: "序号", value: "sn" },
  { desc: "商标图样", value: "filePath" },
  { desc: "商标名称", value: "tmName" },
  { desc: "注册号/申请号", value: "regNumber" },
  { desc: "国际分类", value: "tmType" },
  { desc: "申请人名称（中文）", value: "applicantName" },
  { desc: "申请人名称（英文）", value: "applicantEnName" },
  { desc: "申请人地址（中文）", value: "applicantAddress" },
  { desc: "申请人地址（英文）", value: "applicantEnAddress" },
  { desc: "商品/服务(中英文)", value: "trademarkCategories" },
  { desc: "申请日期", value: "appDate" },
  { desc: "注册日期", value: "regNoticeDate" },
  { desc: "备注", value: "comments" }
];
const fydefaultdc2 = [
  { desc: "序号", value: "sn" },
  { desc: "商标图样", value: "filePath" },
  { desc: "商标名称", value: "tmName" },
  { desc: "注册号/申请号", value: "regNumber" },
  { desc: "国际分类", value: "tmType" },
  { desc: "申请人名称（中文）", value: "applicantName" },
  { desc: "申请人名称（英文）", value: "applicantEnName" },
  { desc: "申请人地址（中文）", value: "applicantAddress" },
  { desc: "申请人地址（英文）", value: "applicantEnAddress" },
  { desc: "商品/服务（英文）", value: "trademarkCategories" },
  { desc: "商品/服务（中文）", value: "trademarkCategoriesCn" },
  { desc: "申请日期", value: "appDate" },
  { desc: "注册日期", value: "regNoticeDate" },
  { desc: "备注", value: "comments" }
];
const fydefaultdcmr = [
  "sn",
  "filePath",
  "tmName",
  "regNumber",
  "tmType",
  "applicantName",
  "applicantEnName",
  "applicantAddress",
  "applicantEnAddress",
  "trademarkCategories",

  "appDate",
  "regNoticeDate",
  "comments"
];
const fydefaultdcmr2 = [
  "sn",
  "filePath",
  "tmName",
  "regNumber",
  "tmType",
  "applicantName",
  "applicantEnName",
  "applicantAddress",
  "applicantEnAddress",
  "trademarkCategories",
"trademarkCategoriesCn",
  "appDate",
  "regNoticeDate",
  "comments"
];
export default {
   name: "retrieval",
  components: { Pagination ,RetrievalDetall},
  data() {
    return {
      tmType: '',
      regNumber: '',
      dttId:'',
      tmListBool:true,
      tagitems: {
        已注册: "success",
        申请中: "",
        已无效: "info"
      },
      goodsMode:1,
      dcvalue: [
        "sn",
        "filePath",
        "tmName",
        "regNumber",
        "tmType",
        "applicantName",
        "applicantEnName",
        "applicantAddress",
        "applicantEnAddress",
        "appDate",
        "approvalNumber",
        "approvalDate",
        "regnoticeNumber",
        "regNoticeDate",
        "validStartDate",
        "validEndDate",
        "agent",
        "tmGroup",
        "trademarkCategories",
        "classify"
      ],

      dcdata: [
        { desc: "序号", value: "sn" },
        { desc: "商标图样", value: "filePath" },
        { desc: "商标名称", value: "tmName" },
        { desc: "注册号/申请号", value: "regNumber" },
        { desc: "国际分类", value: "tmType" },
        { desc: "申请人名称（中文）", value: "applicantName" },
        { desc: "申请人名称（英文）", value: "applicantEnName" },
        { desc: "申请人地址（中文）", value: "applicantAddress" },
        { desc: "申请人地址（英文）", value: "applicantEnAddress" },
        { desc: "申请日期", value: "appDate" },
        { desc: "初审公告期号", value: "approvalNumber" },
        { desc: "初审公告日期", value: "approvalDate" },
        { desc: "注册公告期号", value: "regnoticeNumber" },
        { desc: "注册公告日期", value: "regNoticeDate" },
        { desc: "专用期开始日期", value: "validStartDate" },
        { desc: "专用期结束日期", value: "validEndDate" },
        { desc: "代理/办理机构", value: "agent" },
        { desc: "类似群", value: "tmGroup" },
        { desc: "商品/服务（中英文）", value: "trademarkCategories" },
        { desc: "商标类型", value: "classify" },
        { desc: "是否驰名商标", value: "famous" },
        { desc: "是否立体商标", value: "ifSolidTm" },
        { desc: "是否共有申请", value: "ifShareTm" },
        { desc: "优先权日期", value: "priorDate" },
        { desc: "国际注册日期", value: "gjRegDate" },
        { desc: "后期指定日期", value: "hqzdDate" },
        { desc: "共有人中文名称", value: "gtApplicantName" }
      ],
      dcdata2:defaultdc2,
      dcvalue2: defaultdcmr2,
      dialogVisible: false,
      searcharea: "",
      searchradio: "0",
      searchInput: "",
      searchType: "keyword",
      list: null,
      total: 0,
      listLoading: false,
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        export: "", //代表导出文件，否则只是查询
        trans: "", //代表执行翻译
        status: ""
      },
      downFiledata: {}
    };
  },
  watch: {
    searchradio(n) {
      this.typechange(n);
    },
    searchType: function(val, old) {
      if (old) {
        delete this.listQuery[old];
      }
    }
  },
  created() {
    // this.getList();
  },
  methods: {
    filterKeyLight(text) {
      if (!this.searchInput) return text;
      if (!text) return text;
      const result = text.replace(
        new RegExp(this.searchInput, "g"),
        `<span style='color: red !important;background-color: yellow !important;'>${this.searchInput}</span>`
      );
      return result;
    },
    commandClick(e){
      this.goodsMode=e
      this.dialogVisible=false
      this.$nextTick(()=>{
        this.dialogVisible=true
      })

      console.log(this.trans);
    },
    translate() {},
    pushtodetail(row) {
      this.tmListBool=false;
      this.dttId=row.tmId;
      this.regNumber = row.regNumber
      this.tmType = row.tmType
      // this.$router.push("/workbench/platformData/trademark_detail/" + row.tmId);
    },
    callbackList(type){
      this.tmListBool=type;
    },
    typechange(val) {
      console.log(val, "切换模式了");
      this.listQuery = {
        pageNo: 1,
        pageSize: 10,
        export: "", //代表导出文件，否则只是查询
        trans: "", //代表执行翻译
        status: ""
      };
      if (this.searchradio == "1") {
        this.dcdata = fydefaultdc;
        this.dcvalue = fydefaultdcmr;
        this.dcdata2 = fydefaultdc2;
        this.dcvalue2 = fydefaultdcmr2 ;
      } else {
        this.trans=1
        this.dcdata = defaultdc;
        this.dcvalue = defaultdcmr;
        this.dcdata2 = defaultdc2;
        this.dcvalue2 = defaultdcmr2 ;
      }
      this.list = [];
      this.total = 0;
    },
    getList(type) {
      this.listQuery.export = "";
      this.listQuery.columns = "";
      if (type != "page") {
        this.listQuery.pageNo = "1";
      }

      if (this.searchradio == "1") {
        this.listQuery.regNumbers = this.searcharea.split("\n").join(",");
        this.listQuery.trans = "1";
        this.listQuery.status = "";
        if (this.searcharea == "") {
          this.$message.error("请正确填写搜索内容");
          return;
        }
      } else {
        if (this.searchInput == "") {
          this.$message.error("请正确填写搜索内容");
          return;
        }
        this.listQuery[this.searchType] = this.searchInput;
        if (this.listQuery.regNumber && this.listQuery.regNumber.length < 5) {
          this.$message.error("请正确填写商标号");
          return;
        }
      }

      this.searchdata();
    },
    dcbtn() {
      this.downFiledata = { ...this.downFiledata, ...this.listQuery };
      this.downFiledata.export = "1";
      if(this.goodsMode==2){
        this.downFiledata.columns = this.dcvalue2.join(",");
      }else {
        this.downFiledata.columns = this.dcvalue.join(",");
      }
      delete this.downFiledata.pageNo;
      delete this.downFiledata.pageSize;
      this.dialogVisible = false;
      this.listLoading = true;
      let exportObj=JSON.parse(JSON.stringify(this.downFiledata))
      exportObj.goodsMode=this.goodsMode
      searchTmUrl(exportObj).then(response => {
        this.listLoading = false;
        var a = document.createElement("a");
        a.setAttribute("href", "/ipdoc" + response.data.exportFilePath);
        a.setAttribute("id", "zipDownLoad");
        if (document.getElementById("zipDownLoad")) {
          document.body.removeChild(document.getElementById("zipDownLoad"));
        }
        document.body.appendChild(a);
        a.click();
      });
    },
    searchdata() {
      this.listLoading = true;
      this.list = [];
      searchTmUrl(this.listQuery).then(response => {
        this.list = response.data;
        this.total = response.total;
        this.listLoading = false;
      });
    }
  }
};
</script>

 <style lang="scss" scoped>
@import "~@/styles/mixin.scss";
/deep/.el-select .el-input {
  width: 145px;
}
/deep/.el-input--suffix .el-input__inner {
  text-align: center;
}
/deep/.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
/deep/ .el-input-group__prepend .el-button {
  background-color: #fff !important;
}
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
.avatar {
  width: 70px;
  height: 70px;
  display: block;
  cursor: pointer;
}
.avatar1 {
  width: 72px;
  height: 72px;
  display: block;
  border: 1px solid #d4d5d5;
}
.tag {
  position: absolute;
  right: 0px;
  top: 0px;
}
p {
  margin-bottom: 10px;
}
.primary_title {
  color: red !important;
  background-color: yellow !important;
}
</style>

