<template>
  <div style="padding: 30px;">
    <el-form label-width="130px" :model="postForm">
      <el-row>
        <el-col :span="12">
          <el-form-item label="国家:">
            <el-select style="width: 50%;" v-model="postForm.countryCn" placeholder="" filterable clearable
                       @change="queryOfferPriceM">
              <el-option
                v-for="item in countryList"
                :key="item.countryCn"
                :label="item.countryCn"
                :value="item.countryCn">
              </el-option>
            </el-select>

          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="案件类型:">
            <el-select style="width: 50%;" v-model="postForm.caseTypeId" placeholder="" filterable clearable
                       @change="queryOfferPriceSome">
              <el-option
                v-for="item in [{id: 185, label: '注册申请'}, {id: 33, label: '续展'}, {id: 1851, label: '注册后期指定'}]"
                :key="item.id"
                :label="item.label"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="黑白基础注册费:">
            {{whiteAndBlackFee}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="彩色基础注册费:">
            {{colorfullFee}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="万慧达基础服务费:">
            <el-input-number v-if="$store.getters.permissions.includes(297)" size="medium" v-model="postForm.priceValue" controls-position="right"
                             :min="0"  @change="(v)=>{changeYJ(v, 3)}">
            </el-input-number>
            <span v-else>{{postForm.priceValue}}</span>
<!--            <el-input size="mini" style="width: 50%;" v-model="postForm.priceValue"-->
<!--                      @change="(v)=>{changeYJ(v, 3)}"></el-input>-->
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>


    <el-table
      :data="MDLtableData"
      style="width: 100%">
      <el-table-column
        type="index"
        label="序号"
        width="60">
      </el-table-column>
      <el-table-column
        prop="countryCn"
        label="国家"
      >
      </el-table-column>
      <el-table-column
        label="是否单独规费"
      >
        <template slot-scope="scope">
          {{scope.row.special ? '是' : '否'}}
        </template>
      </el-table-column>
      <el-table-column
        prop="complementaryFee"
        label="补充注册费(CHF)"
      >
      </el-table-column>
      <el-table-column
        prop="firstClass"
        label="首类(CHF)"
      >
      </el-table-column>
      <el-table-column
        prop="secondClass"
        label="第二类(CHF)"
      >
      </el-table-column>
      <el-table-column
        prop="thirdClass"
        label="第三类(CHF)"
      >
      </el-table-column>
      <el-table-column
        prop="additionalClass"
        label="每附加类(CHF)"
      >
      </el-table-column>
      <el-table-column
        label="万慧达服务费(RMB)"
      >
        <template slot-scope="scope">
          <el-input v-if="$store.getters.permissions.includes(297)" size="mini" v-model="scope.row.whdServiceFee"
                    @change="(v)=>{confirmBtn(v, scope.row.opId)}"></el-input>
          <span v-else>{{scope.row.whdServiceFee}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="modifyDate"
        label="更新时间"
      >
      </el-table-column>
    </el-table>
    <pagination
      v-if="total"
      :total="total"
      :page.sync="listQuery.pageNo"
      :limit.sync="listQuery.pageSize"
      @pagination="queryOfferPriceM"
      :pageSizes="pageSizesList"
    />


  </div>
</template>

<script>
  import {
    queryOfferPrice,
    queryOfferPriceSome,
    queryOfferCountries,
    modifyOfferPriceSome,
    modifyOfferPrice,
    createOfferPrice,
    deleteOfferPrice,
    modifyOfferPriceM,
    queryOfferPriceM,
    deleteOfferPriceM
  } from '@/api/billApi'
  import Pagination from '@/components/Pagination'

  export default {
    name: 'MDLdetail',
    components: {
      Pagination
    },
    data() {
      return {
        whiteAndBlackFee: '',
        colorfullFee: '',
        currentRowIndex: -1,
        title: '',
        rowData: {},
        dialogView: false,
        pageSizesList: [10, 50, 100, 200, 300, 400, 500],
        listQuery: {
          pageSize: 10,
          pageNo: 1
        },
        MDLtableData: [],
        total: 0,
        countryList: [],
        postForm: {
          caseTypeId: 185,
          countryCn: '',
          priceValue: ''
        }
      }
    },
    created() {
      this.queryOfferCountries()
      this.queryOfferPriceM()
      this.queryOfferPriceSome()
    },
    methods: {
      changeYJ(priceValue, priceType) {
        if (priceValue) {
          modifyOfferPriceSome({
            caseTypeId: this.postForm.caseTypeId,
            priceType,
            priceValue
          }).then(res => {
            this.$message.success('修改成功!')
            this.ZYtableData.length && this.ZYtableData.forEach(item => {
              priceType == 1 ? item.premium = priceValue : item.whdServiceFee = priceValue
            })
          })
        }
      },
      queryOfferPriceSome(v) {
        queryOfferPriceSome({ caseTypeId: v }).then(res => {
          this.postForm.priceValue = res.data.filter(item => item.priceType == 3)[0] && res.data.filter(item => item.priceType == 3)[0].priceValue || ''
          this.whiteAndBlackFee = res.data.filter(item => item.priceType == 4)[0] && res.data.filter(item => item.priceType == 4)[0].priceValue || ''
          this.colorfullFee = res.data.filter(item => item.priceType == 5)[0] && res.data.filter(item => item.priceType == 5)[0].priceValue || ''
        })
        this.queryOfferPriceM()
      },
      confirmBtn(whdServiceFee, opId) {
        modifyOfferPriceM({
          opId,
          whdServiceFee
        }).then(res => {
          this.$message.success('修改成功!')
        })
      },
      queryOfferCountries() {
        queryOfferCountries({
          madrid: 1
        }).then(res => {
          this.countryList = res.data
        })
      },
      queryOfferPriceM() {
        queryOfferPriceM({
          caseTypeId: this.postForm.caseTypeId,
          countryCn: this.postForm.countryCn,
          ...this.listQuery
        }).then(res => {
          this.MDLtableData = res.data
          this.total = res.total
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  > > > .el-input__inner {
    height: 30px;
    line-height: 30px;
  }

  > > > .cell {
    text-align: center;
  }

  .form-container {
    .el-form-item__error {
      position: relative !important;
      top: 0;
    }

    /deep/ .el-row {
      margin: 0px;
      display: flex; /*解决账单查看表单样式被撑开*/
    }

    /deep/ .postInfo-container-item {
      height: 100%;
      width: 100%;
    }

    /deep/ .el-form-item__label {
      background-color: #f9f9f9;
      width: 36.7%;
      text-align: right;
    }

    /deep/ .el-form-item {
      border-right: 1px solid #d7d7d7;
      margin: 0px !important;
    }

    .first-row {
      /*>>>.el-row {*/
      border-top: 1px solid #d7d7d7;
      /*}*/
    }

    /deep/ .el-row {
      border-bottom: 1px solid #d7d7d7;
      border-left: 1px solid #d7d7d7;
    }

    /deep/ .el-input,
    /deep/ .el-select {
      width: 77%;
    }

    /deep/ td .el-input,
    /deep/ td .el-select {
      width: 100%;
    }

    /deep/ .el-form-item__content {
      text-align: left;
      word-break: break-word;
      // height: 30px;
    }

    .fullRow {
      /deep/ .el-form-item__label {
        width: 15%;
      }

      /deep/ .el-input,
      /deep/ .el-select {
        width: 30%;
      }
    }

    /deep/ .el-input__inner {
      // border: none;
    }

    /deep/ .el-select .el-input {
      width: 100%;
    }

    /deep/ td .el-select,
    /deep/ td .el-input,
    /deep/ td .el-input__inner {
      // border: 0px !important;
    }

    .postInfo-container-item {
      display: flex;
      width: 100%;

      /deep/ .el-form-item__content {
        text-align: left;
        display: inline-table;
        width: 85%;
        padding: 0px 15px;
      }

      /deep/ .el-form-item__label {
        line-height: 28px;
      }
    }
  }
</style>
