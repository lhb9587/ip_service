<template>
  <div class="">
    <el-row>
      <el-col :span="24" class="form-con-item">
        <el-row>
          <el-col :span="24" style="text-align:right">

            <el-button @click="dialogFormjoin=true" size="mini" style="margin-left:10px" type="primary">
              添加
            </el-button>
          </el-col>
        </el-row>
        <el-row class="form-border">
          <el-col :span="24">
            <el-table :data="joinList" border current-row-key empty-text="暂无数据" fit highlight-current-row size="mini" style="width: 100%;">
              <el-table-column align="left" label="序号" type="index" width="50" />
              <el-table-column align="left" label="类型" v-if="casetype === '转让/移转'" width>
                <template slot-scope="scope">
                  <span>{{ scope.row.typeStr ? scope.row.typeStr : scope.row.type == 2 ? '转让人共有人' : scope.row.type == 3 ? '受让人共有人' : '' }}</span>
                </template>
              </el-table-column>
              <el-table-column align="left" label="共有人中文名称" width>
                <template slot-scope="scope">
                  <span>{{ scope.row.nameCn }}</span>
                </template>
              </el-table-column>
              <el-table-column align="left" label="共有人英文名称" width>
                <template slot-scope="scope">
                  <span>{{ scope.row.nameEn }}</span>
                </template>
              </el-table-column>
              <el-table-column align="left" label="共有人证件名称" width>
                <template slot-scope="scope">
                  <span>{{ scope.row.cardName }}</span>
                </template>
              </el-table-column>
              <el-table-column align="left" label="证件号" width>
                <template slot-scope="scope">
                  <span>{{ scope.row.cardId }}</span>
                </template>
              </el-table-column>
              <el-table-column align="left" label="证明文件" width>
                <template slot-scope="scope">
                  <span>{{ scope.row.memo }}</span>
                </template>
              </el-table-column>

              <el-table-column align="left" label="操作" width>
                <template slot-scope="scope">
                  <el-button @click="deljoinp(scope.row,scope.$index)" size="mini" type="text">删除
                  </el-button>
                </template>
              </el-table-column>

            </el-table>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-dialog @open="showdal" :close-on-click-modal="false" :append-to-body="true" :show-close="false" :visible.sync="dialogFormjoin" title="共同申请人" width="70%">
      <el-form :model="joinFormData" label-position="left" ref="" size="mini" style="width: 100%;">
        <el-row class="form-border">
          <el-col :span="24">
            <el-row class="fullRow" v-if="casetype === '转让/移转'">
              <el-col :span="24">
                <el-form-item class="postInfo-container-item" label="类型:">
                  <template>
                    <el-radio-group @change="jointypeChange" v-model="joinFormData.type">
                      <el-radio :label="2">转让人共有人</el-radio>
                      <el-radio :label="3">受让人共有人</el-radio>
                    </el-radio-group>
                  </template>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="">
              <el-col :span="12">
                <el-form-item class="postInfo-container-item" label="共有人类型:">
                  <template>
                    <el-select :clearable="true" default-first-option filterable placeholder="请选择" v-model="joinFormData.joinAppType">
                      <el-option :key="key" :label="item.typeName" :value="item.typeName" v-for="(item,key) in selectData.apptypelist" />
                    </el-select>

                  </template>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item class="postInfo-container-item" label="共有人国籍:">
                  <template>
                    <el-select :clearable="true" default-first-option filterable placeholder="请选择" v-model="joinFormData.joinAppCoun">
                      <el-option label="中国大陆" value="中国大陆" />
                      <el-option label="国外" value="国外" />
                      <el-option label="中国台湾" value="中国台湾" />
                      <el-option label="中国香港" value="中国香港" />
                      <el-option label="中国澳门" value="中国澳门" />

                    </el-select>

                  </template>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="">
              <el-col :span="24">
                <el-form-item class="postInfo-container-item" label="共有人中文名称:">
                  <template>
                    <el-input placeholder="" v-model="joinFormData.nameCn" />
                  </template>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24" v-if="joinFormData.joinAppCoun=='国外'">
                <el-form-item class="postInfo-container-item" label="共有人英文名称:">
                  <template>
                    <el-input placeholder="" v-model="joinFormData.nameEn" />

                  </template>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="">
              <el-col :span="24">
                <el-form-item class="postInfo-container-item" label="共有人中文地址:">
                  <template>
                    <el-input placeholder="" v-model="joinFormData.addrCn" />

                  </template>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24" v-if="joinFormData.joinAppCoun=='国外'">
                <el-form-item class="postInfo-container-item" label="共有人英文地址:">
                  <template>
                    <el-input placeholder="" v-model="joinFormData.addrEn" />

                  </template>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="" v-if="joinFormData.joinAppType=='自然人'">
              <el-col :span="12">
                <el-form-item class="postInfo-container-item" label="证件名称:">
                  <template>
                    <el-select :clearable="true" default-first-option filterable placeholder="请选择" v-model="joinFormData.cardName">
                      <el-option label="身份证" value="身份证" />
                      <el-option label="护照" value="护照" />
                      <el-option label="其他" value="其他" />
                    </el-select>

                  </template>
                </el-form-item>
              </el-col>
              <el-col :span="12" v-if="joinFormData.joinAppType=='自然人'">
                <el-form-item class="postInfo-container-item" label="证件号:">
                  <template>
                    <el-input placeholder="" v-model="joinFormData.cardId" />

                  </template>
                </el-form-item>
              </el-col>
            </el-row>

          </el-col>
        </el-row>

      </el-form>
      <div class="dialog-footer" slot="footer">
        <el-button @click="dialogFormjoin=false">
          取消
        </el-button>
        <el-button @click="addjionP" type="primary">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { querycustSelectClass } from "@/api/caseDetail";
export default {
  name: "JoinList",
  components: {},
  props: {
    joinList: {
      type: Array,
      default: []
    },
    casetype: ""
  },
  data() {
    return {
      dialogFormjoin: false,
      joinFormData: {
        appId: "",
        cardName: "",
        cardId: "",
        nameCn: "",
        nameEn: "",
        addrEn: "",
        addrCn: "",
        joinAppType: "",
        joinAppCoun: "",
        getFileIsEn: "",
        type: ""
      },
      selectData: {
        apptypelist: []
      }
    };
  },
  watch: {},
  computed: {},
  methods: {
    deljoinp(item, index) {
      this.$emit("deljoin", item, index);
    },
    addjionP() {
      this.$emit("getjoin", this.joinFormData);
      this.joinFormData = {
        appId: "",
        cardName: "",
        cardId: "",
        nameCn: "",
        nameEn: "",
        addrEn: "",
        addrCn: "",
        joinAppType: "",
        joinAppCoun: "",
        getFileIsEn: ""
      };
      this.dialogFormjoin = false;
    },
    showdal() {
      querycustSelectClass({ classId: "1042" }).then(response => {
        if (response.success) {
          this.selectData.apptypelist = response.data["1042"];
        } else {
          this.$message.error(response.message);
        }
      });
    }
  },
  created() {},
  mounted() {}
};
</script>
<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.createPost-container {
  position: relative;
  padding: 10px 2px;
  border: 1px solid #d7d7d7;
  margin: 15px 20px;
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

    span {
      display: block;
    }
  }

  /deep/ .el-step {
    cursor: pointer;
  }
}

/deep/ .form-border {
  .el-form-item__error {
    position: relative !important;
    top: 0;

  }

  .el-row {
    margin: 0px;
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

  border-top: 1px solid #d7d7d7;
  border-left: 1px solid #d7d7d7;
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
  /deep/ .el-select,
  /deep/ .el-input {
    width: 100% !important;
  }
}
</style>

