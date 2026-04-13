<template>
  <div>
    <div class="box-border">
      <el-form size="small" class="form-container" label-width="120px">
        <el-row class="first-row">
          <el-col :span="12">
            <el-form-item label="商机来源:" class="postInfo-container-item">
              <div style="display: flex">
                <el-cascader
                  :disabled="type === '查看商机'"
                  size="mini"
                  class="edit-border"
                  clearable
                  filterable
                  :show-all-levels="false"
                  v-model="workTypeList"
                  :options="activityKinds"
                  :props="defaultParams"
                  placeholder="请选择商机来源"
                  @change="changeWorkType"
                >
                </el-cascader>
                <el-popover
                  placement="top"
                  width="400"
                  trigger="hover"
                  :content="computedDesc">
                  <div slot="reference" style="line-height: 32px;font-size: 16px;margin-left: 5px;cursor:pointer;"
                       class="el-icon-info"></div>
                </el-popover>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户名称:" class="postInfo-container-item">
              <template v-if="type !== '查看商机'">
                <template v-if="!custId">
                  <el-popover
                    placement="bottom-start"
                    width="600"
                    trigger="manual"
                    v-model="custVisible"
                  >
                    <div style="max-height: 200px;overflow-y: auto">
                      <div @click="changeCust(item)" v-for="(item,index) in custList" :key="index" class="tables"
                           style="display: flex;max-height: 100px;overflow-y: auto">
                        <div style="flex: 1;cursor: default;height: 30px;line-height: 30px;" class="overflow-hidden"
                             :title="item.fullname"
                             :class="{'table-head': item.fullname == '全称'}">{{item.fullname}}
                        </div>
                        <div style="flex: 1;cursor: default;height: 30px;line-height: 30px;" class="overflow-hidden"
                             :class="{'table-head': item.name == '简称'}" :title="item.name">{{item.name}}
                        </div>
                        <div style="flex: 1;cursor: default;height: 30px;line-height: 30px;" class="overflow-hidden"
                             :class="{'table-head': item.status == '状态'}">{{item.status ? item.status : item.custId ?
                          '已存在':'不存在'}}
                        </div>
                      </div>
                    </div>
                    <el-input size="mini" class="edit-border" placeholder="请输入客户名称" clearable slot="reference"
                              v-model="businessData.custName"
                              @input="(v)=>debounce((v) => remoteQueryCust(v), 500)(v)"
                              @blur="()=>custBlur()"
                              @focus="(v)=>{custVisible = true}"
                              @keyup.enter.native="(v)=>{}"></el-input>
                  </el-popover>
                  <div v-show="businessData.custIntroductor && businessData.custName"
                       style="font-size: 12px!important;color: #E6A23C;height: 16px;line-height: 16px;">客户不存在，将创建新客户
                  </div>
                </template>
                <template v-else>{{custName}}</template>
              </template>
              <template v-else>
                {{businessData.custName}}
              </template>

            </el-form-item>
          </el-col>
        </el-row>

        <el-row class="first-row">
          <el-col :span="12">
            <el-form-item label="商机领域:" class="postInfo-container-item">
              <span v-if="type === '查看商机'">{{businessData.domain}}</span>
              <el-select v-else size="mini" class="edit-border" default-first-option :clearable='true'
                         placeholder="请选择商机领域" v-model="businessData.domain" filterable>
                <el-option v-for="item in ['保护', '诉讼', '商标', '专利', '域名', '著作权', '非诉', '无']" :key="item" :label="item"
                           :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系人:" class="postInfo-container-item">
              <span v-if="type === '查看商机'">{{businessData.lxren}}</span>
              <el-input v-else size="mini" placeholder="请输入联系人" class="edit-border"
                        v-model="businessData.lxren"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="first-row">
          <el-col :span="12">
            <el-form-item label="商机日期:" class="postInfo-container-item">
              <span v-if="type === '查看商机'">{{businessData.sjDate}}</span>
              <el-date-picker v-else size="mini" class="date-border" v-model="businessData.sjDate"
                              format='yyyy-MM-dd'
                              value-format="yyyy-MM-dd" align="right" type="date" placeholder="请选择日期"
                              :picker-options="pickerOptions">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系方式:" class="postInfo-container-item">
              <span v-if="type === '查看商机'">{{businessData.lxfs}}</span>
              <el-input v-else size="mini" class="edit-border" placeholder="请输入联系方式"
                        v-model="businessData.lxfs"></el-input>
            </el-form-item>
          </el-col>
        </el-row>


        <div class="divider">
          <span>
              商机描述
          </span>
        </div>
        <div v-if="type === '查看商机'">{{businessData.sjdesc}}</div>
        <el-input v-else type="textarea" v-model="businessData.sjdesc" :autosize="{ minRows: 4}"
                  placeholder="[商机描述]:"></el-input>

      </el-form>
    </div>
    <div class="fl-ac-jc">
      <el-button size="small" style="width: 100px;margin-right: 0px" @click="() => closeDialog(false)">取 消</el-button>
      <el-button size="small" v-if="type !== '查看商机'" type="primary" style="width: 100px;margin-right: 0px" @click="submit">确 定</el-button>
    </div>
  </div>
</template>

<script>
  import {queryList, querySimilarCustomer, queryWorkType} from "../../../../api/caseList";
  import {queryCustomerContactByCustIdUrl} from "../../../../api/caseDetail";
  import {addShangji, queryShangji, updateShangji} from "../../../../api/business";

  export default {
    name: "BusinessDialog",
    props: {
      custId: {
        type: Number
      },
      custName: {
        type: String,
        default: ''
      },
      sjId: {},
      type: {
        type: String
      }
    },
    data() {
      return {
        pickerOptions: {
          // disabledDate(time) {
          //   return time.getTime() > Date.now();
          // },
          shortcuts: [
            {
              text: "今天",
              onClick(picker) {
                picker.$emit("pick", new Date());
              }
            },
            {
              text: "昨天",
              onClick(picker) {
                const date = new Date();
                date.setTime(date.getTime() - 3600 * 1000 * 24);
                picker.$emit("pick", date);
              }
            },
            {
              text: "一周前",
              onClick(picker) {
                const date = new Date();
                date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit("pick", date);
              }
            }
          ]
        },
        defaultParams: { // 級聯菜單默認
          value: 'workTypeName',
          label: 'workTypeName',
          children: 'childrens',
          checkStrictly: true
        },
        workTypeList: [],
        businessData: {
          custName: '',
          custId: '',
          domain: '',
          lxren: '',
          lxfs: '',
          laiyuan: '',
          sjdesc: '',
          custIntroductor: '',
          fullname: '',
          sjDate: '',
          createDate: this.$commonUtils.formatDate(new Date()),
        },
        activityKinds: [],
        custVisible: false,
        customerContacts: [],
        custList: [{'fullname': '全称', 'name': '简称', 'status': '状态'}],
        timer: null
      }
    },
    computed: {
      computedDesc() {
        return this.businessData.laiyuan && this.activityKinds.length && this.$commonUtils.extractTree(this.activityKinds, 'childrens', ['workType', 'workTypeName', 'memo']).find(item => item.workTypeName === this.businessData.laiyuan) && this.$commonUtils.extractTree(this.activityKinds, 'childrens', ['workType', 'workTypeName', 'memo']).find(item => item.workTypeName === this.businessData.laiyuan).memo
      },
    },
    async created() {
      await this.queryActivityType()
      if ((this.type === '修改商机' || this.type === '查看商机') && this.sjId) {
        queryShangji({sjId: this.sjId}).then(res => {
          this.businessData = res.data
          if (this.custId) {
            this.businessData.custId = this.custId
            this.businessData.custName = this.custName
          }
          if (this.businessData.laiyuan) {
            if (this.activityKinds.find(item => item.childrens.find(i => i.workTypeName == this.businessData.laiyuan))) {
              this.workTypeList = [this.activityKinds.find(item => item.childrens.find(i => i.workTypeName == this.businessData.laiyuan)).workTypeName, this.businessData.laiyuan]
            }
          }
        })
      } else if (this.type === '新增商机') {
        this.businessData.custId = this.custId
        this.businessData.custName = this.custName
      }
    },
    methods: {
      closeDialog(isSearch) {
        this.$emit('close', isSearch === true)
      },
      submit() {
        if (this.type === '新增商机') {
          addShangji(this.businessData).then(res => {
            this.$message.success('创建成功!')
            this.closeDialog(true)
          })
        } else if (this.type === '修改商机') {
          updateShangji(this.businessData).then(res => {
            this.$message.success('修改成功!')
            this.closeDialog(true)
          })
        }
      },
      changeWorkType(v) {
        if (v && v.length) {
          this.businessData.laiyuan = v[v.length - 1]
        }
      },
      async queryActivityType() {
        await queryWorkType().then(res => {
          this.activityKinds = res.data
        })
      },
      changeCust(custInfo) {
        if (custInfo.fullname === "中文名称") return
        if (!custInfo.custId) { // 新录入客户名称
          this.businessData.fullname = custInfo.fullname
          this.businessData.custName = custInfo.fullname
          this.businessData.custIntroductor = this.$store.getters.name
        } else {
          this.businessData.fullname = undefined
          this.businessData.custIntroductor = undefined
          this.businessData.custId = custInfo.custId
          this.businessData.custName = custInfo.fullname
          queryCustomerContactByCustIdUrl({
            custId: custInfo.custId
          }).then(res => {
            this.$nextTick(() => {
              this.customerContacts = res.data.customerContacts.filter(item => item.name).map(item => ({
                value: item.name,
                email: item.email
              }))
            })
          })
        }
      },
      debounce(fn, wait) {
        return (v) => {
          if (this.timer !== null) {
            clearTimeout(this.timer)
          }
          this.timer = setTimeout(() => {
            fn(v)
          }, wait)
        }
      },
      remoteQueryCust(v) {
        this.remotepaternalUnit(v, () => {
        }, '客户', true)
      },
      custBlur() {
        this.custVisible = false
        setTimeout(() => {
          if (!this.businessData.custId && this.businessData.custName) {
            this.businessData.fullname = this.businessData.custName
            this.businessData.custIntroductor = this.$store.getters.name
          }
        }, 500)
      },
      remotepaternalUnit(query, cb, type, isSimilar) {
        if (!query && type === '客户') {
          this.businessData.fullname = undefined
          this.businessData.custIntroductor = undefined
          this.businessData.custId = undefined
          this.businessData.custName = undefined
        }
        if (query) {
          Promise.all([queryList({
            pageNo: 1,
            pageSize: 50,
            sign: 1,
            parameter: query
          }), querySimilarCustomer({fullname: query})]).then(res => {
            this.custList = this.$commonUtils.unique(res[0].data.concat(res[1].data.map(item => ({
              custId: item.custId,
              fullname: item.custName,
              name: item.name
            }))), 'custId')
            this.custList.unshift({'fullname': '全称', 'name': '简称', 'status': '状态'})
            if (type === '客户') {
              const curObj = this.custList.find(item => item.name && item.name.toLowerCase().includes(query.toLowerCase()) || item.fullname && item.fullname.toLowerCase().includes(query.toLowerCase()))
              if (!curObj) {
                this.custList.splice(1, 0, {
                  'fullname': query,
                  'name': query,
                  'status': '不存在'
                })
              }
            }
          })
        }
      },
    }
  }
</script>

<style lang="scss" scoped>
  .fl-ac-jc {
    margin-top: 15px;
  }

  .box-border {
    border: 1px solid #D7D7D7;
    padding: 10px 10px 5px 10px;
  }

  .form-container {
    .el-form-item__error {
      position: relative !important;
      top: 0;
    }

    /deep/ .el-row {
      margin: 0 0 5px 0;
      display: flex;
    }

    /deep/ .postInfo-container-item {
      height: 100%;
      width: 100%;
    }

    /deep/ .el-form-item__label {
      flex-shrink: 0;
      background-color: #F2F2F2;
      /*width: 36.7%;*/
      text-align: right;
    }

    /deep/ .el-form-item {
      border-right: 1px solid #F2F2F2;
      margin: 0px !important;
    }

    .first-row {
      border-top: 1px solid #F2F2F2;
    }

    /deep/ .el-row {
      border-bottom: 1px solid #F2F2F2;
      border-left: 1px solid #F2F2F2;
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

    /deep/ .el-select .el-input {
      width: 100%;
    }

    .postInfo-container-item {
      display: flex;
      width: 100%;

      /deep/ .el-form-item__content {
        text-align: left;
        display: inline-table;
        flex: 1;
        padding: 5px 15px;
        margin-left: 0 !important;
      }

      > > > .el-date-editor {
        width: 100%;
      }
    }
  }

  .divider {
    position: relative;
    border-bottom: 1px solid #797979;
    margin-bottom: 20px;
    /*border-right: 1px solid #ccc;*/
    margin-top: 20px;

    .el-badge {
      padding-right: 10px;
    }

    span {
      /*color: #333;*/
      /*font-weight: bold;*/
      font-size: 14px;
      background: #fff;
      position: absolute;
      bottom: -9px;
      left: 50px;
      padding: 0 10px;
    }
  }

  .el-table.el-table1 {
    /deep/ tr:nth-of-type(1) {
      th {
        padding: 0;
        background: #F2F2F2;
      }
    }
  }

  .tables {
    div {
      border: 1px solid #ccc;
      border-top: none;
      border-right: none;
      text-align: center;
      z-index: 9;
    }

    div:nth-child(3) {
      border-right: 1px solid #ccc;
    }
  }

  .table-head {
    text-align: center;
    background-color: #f7f7f7;
    border-top: 1px solid #ccc !important;
  }

  .overflow-hidden {
    overflow: hidden;
    width: 100%;
    display: inline-block;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-break: break-all;
    cursor: pointer !important;
  }

  .upload-btn {
    margin: 10px 0 5px 0;
    width: 120px;
    height: 30px;
    border: 1px solid #AAAAAA;
    color: #AAAAAA;
    text-align: center;
    line-height: 30px;
    cursor: pointer;

    &:hover {
      border: 1px solid #66B1FF;
      color: #66B1FF;
    }
  }

  .require:before {
    content: "*";
    color: #f56c6c;
    margin-right: 4px;
  }

  .requireForm /deep/ .el-form-item__label:before {
    content: "*";
    color: #f56c6c;
    margin-right: 4px;
  }

  .timeDiv {
    position: absolute;
    left: 100px;
    top: 10px;
    width: 180px;
  }

  > > > .el-select, > > > .el-cascader {
    width: 100%;

    .el-cascader__label {
      padding-left: 0;
      font-size: 14px;
      color: #000000;
    }

    .el-input.is-focus .el-input__inner {
      border-radius: 0;
      border-color: #fff;
      border-bottom: 1px solid #f2f2f2;
    }
  }

  .edit-border {
    /deep/ .el-input__inner {
      border: 1px solid #fff;
      font-size: 14px;
      color: #000000;
      padding-left: 0;

      &:hover {
        border-radius: 0;
        border-bottom: 1px solid #f2f2f2;
      }
    }
  }

  .date-border {
    /deep/ .el-input__prefix {
      left: -5px;
    }

    /deep/ .el-input__inner {
      border: 1px solid #fff;
      font-size: 14px;
      color: #000000;
      padding-left: 20px;

      &:hover {
        border-radius: 0;
        border-bottom: 1px solid #f2f2f2;
      }
    }
  }
</style>
