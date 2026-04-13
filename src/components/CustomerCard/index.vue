<template>
  <div>
    <el-popover ref="popover" v-model="visible" placement="right" title="" width="300" trigger="click">
      <el-row v-if="visible">
        <el-col :span="7">
          <div class="avatar1">
            <img class="avatar" :src=" `/ipdoc${custData.userIcon}`" />
          </div>
        </el-col>
        <el-col :span="17">
          <el-col :span="24" style="margin-top:5px">
            <p style=" color: #3c86f4 !important;font-weight: bolder !important;">{{custData.name?custName:custData.name}}</p>
          </el-col>

          <el-col :span="24" style="margin-top:5px">
            <el-col style='text-align:left' :span="10">客户国籍：</el-col>
            <el-col style='text-align:left' :span="14">{{custData.country}}</el-col>
            <el-col style='text-align:left' :span="10">沟通语言：</el-col>
            <el-col style='text-align:left' :span="14">{{custData.contactLanguageStr}}</el-col>
          </el-col>
        </el-col>
        <el-col :span="24" style="margin-top:5px">
          <el-col style='text-align:right' :span="7">全称：</el-col>
          <el-col style=" word-break: initial;" :span="17">{{custData.fullname}}</el-col>
          <el-col style='text-align:right' :span="7">英文全称：</el-col>
          <el-col style=" word-break: initial;" :span="17">{{custData.fullnameEn}}</el-col>
        </el-col>
      </el-row>
    </el-popover>
    <a v-popover:popover class="itemTitle_style">{{custName}}</a>
  </div>
</template>

<script>
import { queryCustomerUrl } from "@/api/customerList";
export default {
  name: "CustCard",
  components: {},
  props: {
    custName: {
      type: String,
      default: ""
    },
    customerID: {
      type: Number
    }
  },
  data() {
    return {
      custData: {},
      visible: false
    };
  },
  watch: {
    visible(n) {
      console.log(n, "111");
      if (n) {
        this.custShow();
      } else {
        this.hideCust();
      }
    }
  },
  computed: {},
  methods: {
    custShow() {
      console.log("show");
      if (!this.customerID) {
        return;
      }
      queryCustomerUrl({ customerID: this.customerID }).then(res => {
        this.custData = res.data;
      });
    },
    hideCust() {
      this.custData = {};
      console.log("end");
    }
  },
  created() {},
  mounted() {
    // this.custShow();
  }
};
</script>
<style lang="scss" scoped>
.avatar {
  width: 70px;
  height: 70px;
  display: block;
}
.avatar1 {
  width: 72px;
  height: 72px;
  display: block;
  border: 1px solid #d4d5d5;
}
p {
  word-break: initial;
}
</style>
