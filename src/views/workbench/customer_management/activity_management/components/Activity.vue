<template>
  <div class="createPost-container">

    <el-form ref="hdFromDataForm" :model="hdFromData" size="mini" :rules="rules" style="width: 100%;">

      <div class="form-con" style="padding:10px 10px">
        <el-row class="form-border">
          <el-col :span="24">
            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="活动编号:" class="postInfo-container-item">
                  <span v-if="isLook">{{hdFromData.custActId}}</span>
                  <el-input v-else type="text" placeholder="" :disabled="true" v-model="hdFromData.custActId">
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="活动状态:" prop="actStatus" class="postInfo-container-item">
                  <template>
                    <span v-if="isLook">{{hdFromData.actStatusStr}}</span>
                    <el-select v-else default-first-option :clearable='true' placeholder="请选择" v-model="hdFromData.actStatus" filterable>
                      <el-option v-for="item in seletData.hdstatu" :key="String(item.id)" :label="item.typeName" :value="String(item.id)">
                      </el-option>
                    </el-select>
                  </template>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="主题:" prop="subject" class="postInfo-container-item">

                  <span v-if="isLook">{{hdFromData.subject}}</span>
                  <el-input v-else type="text" placeholder="" v-model="hdFromData.subject">
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="活动类型 :" prop="actType" class="postInfo-container-item">
                  <template>
                    <span v-if="isLook">{{hdFromData.actTypeStr}}</span>
                    <el-select v-else default-first-option :clearable='true' placeholder="请选择" v-model="hdFromData.actType" filterable>
                      <el-option v-for="item in seletData.hdtype" :key="String(item.id)" :label="item.typeName" :value="String(item.id)">
                      </el-option>
                    </el-select>
                  </template>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="活动方式:" prop="actKind" class="postInfo-container-item">
                  <template>
                    <span v-if="isLook">{{hdFromData.actKindStr}}</span>
                    <el-select v-else default-first-option :clearable='true' placeholder="请选择" v-model="hdFromData.actKind" filterable>
                      <el-option v-for="item in seletData.hdfs" :key="String(item.id)" :label="item.typeName" :value="String(item.id)">
                      </el-option>
                    </el-select>
                  </template>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="开始时间 :" class="postInfo-container-item">
                  <span v-if="isLook">{{hdFromData.begindate}}</span>
                  <el-date-picker v-else v-model="hdFromData.begindate" format='yyyy-MM-dd' value-format="yyyy-MM-dd" align="right" type="date" placeholder="选择日期" :picker-options="pickerOptions">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="结束时间 :" class="postInfo-container-item">
                  <span v-if="isLook">{{hdFromData.enddate}}</span>
                  <el-date-picker v-else v-model="hdFromData.enddate" format='yyyy-MM-dd' value-format="yyyy-MM-dd" align="right" type="date" placeholder="选择日期" :picker-options="pickerOptions">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="地点:" class="postInfo-container-item">

                  <span v-if="isLook">{{hdFromData.place}}</span>
                  <el-input v-else type="text" placeholder="" v-model="hdFromData.place">
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="招待类型 :" class="postInfo-container-item">
                  <template>
                    <span v-if="isLook">{{hdFromData.serviceTypeStr}}</span>
                    <el-select v-else default-first-option :clearable='true' placeholder="请选择" v-model="hdFromData.serviceType" filterable>
                      <el-option v-for="item in seletData.zdfs" :key="String(item.id)" :label="item.typeName" :value="String(item.id)">
                      </el-option>
                    </el-select>
                  </template>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="招待地点 :" class="postInfo-container-item">

                  <span v-if="isLook">{{hdFromData.servicePlace}}</span>
                  <el-input v-else type="text" placeholder="" v-model="hdFromData.servicePlace">
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="赠送礼品 :" class="postInfo-container-item">
                  <span v-if="isLook">{{hdFromData.putGift}}</span>
                  <el-input v-else type="text" placeholder="" v-model="hdFromData.putGift">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="收到礼品 :" class="postInfo-container-item">

                  <span v-if="isLook">{{hdFromData.getGift}}</span>
                  <el-input v-else type="text" placeholder="" v-model="hdFromData.getGift">
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item label="内容描述:" class="postInfo-container-item uploader-custfile">
                  <template>
                    <span v-if="isLook">{{hdFromData.description}}</span>
                    <el-input v-else type="textarea" :rows="2" :autosize="{ minRows: 2, maxRows: 20}" placeholder="请输入内容" v-model="hdFromData.description">
                    </el-input>
                  </template>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="fullRow  table-dl-row">
              <el-col :span="24">
                <el-form-item label="上传文件" class="postInfo-container-item uploader-custfile">
                  <template>
                    <p v-if="isLook" v-for="item in hdFromData.materialList" style="color: #409EFF">
                      <a target="_blank" :href="`ipdoc${item.address}`">{{item.name}}</a><span class="el-icon-view" style="margin-left: 10px;cursor:pointer;" @click="previewFile(item)"></span>
                    </p>
                    <el-upload
                        v-if="!isLook"
                        :action="addActivityFile"
                        multiple
                        name="activityFile"
                        :on-preview="preview"
                        :before-upload="handlePreview"
                        :data="uploadFileData"
                        :on-success="successCallback"
                        :on-remove="handleRemove"
                        :file-list="hdFromData.materialList"
                    >
                      <el-button  size="small" type="primary">点击上传</el-button>
                      <!-- <div slot="tip" class="el-upload__tip">请上传图片格式文件</div> -->
                    </el-upload>
                  </template>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="fullRow  table-dl-row">
              <el-col :span="24">
                <el-form-item label="对方联系人:" class="postInfo-container-item uploader-custfile">
                  <template>
                    <el-row v-if="!isLook">
                      <el-col :span="24" style='text-align:right'>
                        <el-button type="primary" size="mini" @click="addhdDftable('dfcon')">添加
                        </el-button>
                      </el-col>
                    </el-row>
                    <el-table size="mini" :data="hdFromData.customerContactActs" :highlight-current-row='false' border fit empty-text="暂无数据" current-row-key style="width: 100%;">
                      <el-table-column type="index" width="50" label="序号" align="left"></el-table-column>
                      <el-table-column label="客户" align="left" width>
                        <template slot-scope="scope">

                          <span v-if="isLook">{{scope.row.custName}}</span>
                          <el-select v-else default-first-option :clearable='true' v-model="scope.row.custId" @change="((val)=>{hdkhselect(val, scope.row)})" no-match-text='暂无数据' loading-text='正在查询'
                                     filterable remote reserve-keyword placeholder="请输入关键词" :remote-method="remotepaternalUnitKh">
                            <el-option v-for="(item,key) in seletData.paternalUnitKh" :key="key" :label="item.name" :value="item.custId">
                            </el-option>
                          </el-select>

                        </template>
                      </el-table-column>

                      <el-table-column label="对方联系人" align="left" width>
                        <template slot-scope="scope">
                          <span v-if="isLook">{{scope.row.custContactName}}</span>
                          <el-select v-else default-first-option :clearable='true' placeholder="请选择" v-model="scope.row.custContactId" filterable>
                            <el-option v-for="(item,key) in scope.row.hdlx" :key="key" :label="item.name" :value="item.custContactId">
                            </el-option>
                          </el-select>

                        </template>
                      </el-table-column>
                      <el-table-column label="备注" align="left" width>
                        <template slot-scope="scope">

                          <span v-if="isLook">{{scope.row.memo}}</span>
                          <el-input v-else type="text" placeholder="" v-model="scope.row.memo">
                          </el-input>
                        </template>
                      </el-table-column>

                      <el-table-column  v-if="!isLook" label="操作" align="left" class-name="small-padding fixed-width">
                        <template slot-scope="scope">
                          <el-row>
                            <el-col :span="24">
                              <el-button size="mini" type="text" @click="handledeleElementhddfcon(scope.$index)">删除</el-button>
                            </el-col>
                          </el-row>

                        </template>
                      </el-table-column>
                    </el-table>
                  </template>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="fullRow  table-dl-row">
              <el-col :span="24">
                <el-form-item label="我方联系人:" class="postInfo-container-item uploader-custfile">
                  <template>
                    <el-row v-if="!isLook">
                      <el-col :span="24" style='text-align:right'>
                        <el-button type="primary" size="mini" @click="addhdDftable('wfcon')">添加
                        </el-button>
                      </el-col>
                    </el-row>
                    <el-table size="mini" :data="hdFromData.agencyContactActs" border fit empty-text="暂无数据" :highlight-current-row='false' current-row-key>
                      <el-table-column type="index" width="50" label="序号" align="left"></el-table-column>
                      <el-table-column label="员工" align="left" width>
                        <template slot-scope="scope">

                          <span v-if="isLook">{{scope.row.userName}}</span>
                          <el-select v-else default-first-option :clearable='true' placeholder="请选择" v-model="scope.row.userId" filterable>
                            <el-option v-for="(item,key) in seletData.userNames" :key="key" :label="item.fullname" :value="item.userId">
                            </el-option>
                          </el-select>

                        </template>
                      </el-table-column>

                      <el-table-column label="备注" align="left" width>
                        <template slot-scope="scope">

                          <span v-if="isLook">{{scope.row.memo}}</span>
                          <el-input v-else type="text" placeholder="" v-model="scope.row.memo">
                          </el-input>
                        </template>
                      </el-table-column>

                      <el-table-column v-if="!isLook" label="操作" align="left" width="430" class-name="small-padding fixed-width">
                        <template slot-scope="scope">
                          <el-row>
                            <el-col :span="24">

                              <el-button size="mini" type="text" @click="handledeleElementhdwfcon(scope.$index)">删除</el-button>

                            </el-col>
                          </el-row>

                        </template>
                      </el-table-column>
                    </el-table>
                  </template>
                </el-form-item>
              </el-col>
            </el-row>

          </el-col>
        </el-row>
        <el-row style="padding:10px 10px" v-if="!componentState">
          <el-col :span="24" style="text-align:center">
            <el-form-item>
              <el-button size="medium" type="primary" v-if="!isEdit" @click="updateCustAddr('hd')">创建活动
              </el-button>
              <el-button size="medium" type="primary" v-if="isEdit && !isLook" @click="updateCustAddr('hd')">保存修改
              </el-button>

              <el-button style="margin-left:100px" @click="cancel" type="primary" size="medium">取消</el-button>

            </el-form-item>
          </el-col>

        </el-row>
      </div>

    </el-form>

  </div>
</template>

<script>
import {
  addCustomer,
  querycustSelectClass,
  queryCustomerNameId,
  addCustomerAddrUrl,
  updateCustomerAddrUrl,
  delCustomerAddrUrl,
  queryCustomerContactCustIdUrl,
  addCustomerContactUrl,
  updateCustomerContacturl,
  delCustomerContacturl,
  queryCustomersUrl,
  queryUserNamesUrl,
  addActivityUrl,
  delActivity,
  updateActivityUrl,
  allocationCustomerUrl,
  delAgencyContactUrl,
  updateAgencyContactUrl,
  queryregCaseTypeUrl,
  addCustomerRequirementUrl,
  updateCustomerRequirementUrl,
  delCustomerRequirementUrl,
  queryActivityListflUrl,
  queryCustomerUrl,
  updateCustomerUrl,
  queryActivityOneUrl,
  delActivityFile
} from "@/api/customerList";
import { addActivityFile } from "@/api/ipServiceApi.config.js";
import serviceApi from "@/api/serviceApi.config.js";
import { mapGetters } from "vuex";
import { truncate, truncateSync } from "fs";
import {doEditInOffice, getProgID} from '@/utils/editInOffice.js'
export default {
  name: "Activity",
  computed: {
    ...mapGetters(["token", "name"])
  },
  components: {},
  props: {
    isCustomer: {
      type: Boolean,
      default: false
    },
    custActId: {},
    isLook: {
      type: Boolean,
      default: false
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    id:{

    },
    componentState:{}
  },
  data() {
    return {
      rules: {
        subject: [
          {
            required: true,
            trigger: "blur",
            message: "请填写活动主题"
          }
        ],
        actStatus: [
          {
            required: true,
            trigger: "change",
            message: "请选择活动状态"
          }
        ],
        actType: [
          {
            required: true,
            trigger: "change",
            message: "请选择活动类型"
          }
        ],
        actKind: [
          {
            required: true,
            trigger: "change",
            message: "请选择活动方式"
          }
        ],

      },
      addActivityFile,

      hdlx: "",

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
      // select的获取id有对应文档查询
      seletDataArr: "1050,1049,1051,1052",
      seletData: {
        hdstatu: {},
        hdtype: {},
        hdfs: {},
        zdfs: {},
        userNames: {},
        paternalUnitKh: {}
      },
      uploadFileData:{

        tokenID: this.$store.getters.token,
      },
      hdFromData: {
        examineStatus: "1623",
        custActId: "",
        actStatus: "",
        subject: "",
        actType: "",
        actKind: "",
        begindate: "",
        enddate: "",
        place: "",
        serviceType: "",
        servicePlace: "",
        putGift: "",
        getGift: "",
        description: "",
        customerContactActs: [],
        agencyContactActs: []
      }
    };
  },
  created() {
    this.getAllSelectData();
    window.addEventListener("scroll", this.handleScroll);
    if (this.isEdit) {
      const id =this.custActId || this.id|| this.$route.params && this.$route.params.id;
      this.fetchData(id);
    }else {
      addActivityUrl(this.hdFromData).then(response => {
        this.hdFromData.custActId=response.data.custActId
      });
    }
  },

  methods: {
    previewFile(data) {
      let url = data.address
      if (getProgID(url)||url.replace(/.+\./,"").toLocaleLowerCase()=='msg') {
        if(['doc','docx'].includes(url.replace(/.+\./,"").toLocaleLowerCase())){
          this.$commonUtils.viewPdf(`${url}`)
        }else {
          let flag = ''
          if(data.mailId){
            flag = 'mailId'
          }else if (data.materialId) {
            flag = 'materialId'
          }
          url = url.replace(/&/g, '%26')
          window.open(`#/preView?address=ipdoc${url}&${flag}=${data[flag]}`.replace(/[+]/g,'%2B'))
        }
        // doEditInOffice(url, getProgID(url))
      } else if(['pdf','jpg','png'].some(item=>url.replace(/.+\./,"").toLocaleLowerCase()==item)){
        window.open(`/ipdoc${url}`.replace(/[+]/g,'%2B'))
      } else {
        this.downLoad(data)
      }
    },
    downLoad(data) {
      const url = data.address
      const downData = {
        url: `ipdoc${url}`,
        success() {
          // notify.close()
        }
      }
      if (data.mailId) {
        downData.downLoad = data.materialName
      }
      this.$commonUtils.downLoadAll(downData)
    },
    preview(file){
      if(file.raw){
        if(file.response){
          this.$commonUtils.downLoadAll({url:'ipdoc'+file.response.data.address})
        }
      } else {
        this.$commonUtils.downLoadAll(file)
      }
    },

    successCallback(response, file, fileList){
      // this.materialIdList.push(response.data[0].materialId)
    },
    handlePreview(file){
      this.uploadFileData.custActId=this.hdFromData.custActId
      this.uploadFileData.fileNames = file.name.substr(
          0,
          file.name.lastIndexOf(".")
      );
    },
    handleRemove(file){
      let materialId;
      if (file.response) {
        materialId = file.response.data.materialId
      } else {
        materialId = file.materialId
      }
      delActivityFile({ materialId: materialId })
      //   this.materialIdList=this.materialIdList.filter(item=>item!=materialId)
    },
    fetchData(id) {
      queryActivityOneUrl({ custActId: id })
          .then(response => {
            this.hdFromData = response.data;
            if(this.hdFromData.materialList&&this.hdFromData.materialList.length){
              this.hdFromData.materialList.forEach(item=>{
                item.url='ipdoc'+item.url
              })
            }
            this.hdDialogShow();
          })
          .catch(err => {
            console.log(err);
          });
    },

    // 获取各个select数据
    getAllSelectData() {
      console.log(this.seletDataArr, "00000");

      querycustSelectClass({ classId: this.seletDataArr }).then(response => {
        if (response.success) {
          this.seletData.hdstatu = response.data["1050"];
          this.seletData.hdtype = response.data["1049"];
          this.seletData.hdfs = response.data["1051"];
          this.seletData.zdfs = response.data["1052"];
        } else {
          this.$message.error(response.message);
        }
      });

      queryUserNamesUrl().then(response => {
        if (response.success) {
          this.seletData.userNames = response.data.users;
        } else {
          this.$message.error(response.message);
        }
      });
    },
    cancel(){
      if(this.isEdit){
        if (this.isCustomer) {
          this.$emit('closeDialog', false)
        } else {
          this.$router.go(-1)
        }
      } else {
        if (this.isCustomer) {
          this.$emit('closeDialog', false)
        } else {
          this.delActivity()
        }
      }
    },
    delActivity() {
      delActivity({custActId:this.hdFromData.custActId}).then(res=>{
        if (this.isCustomer) {
        } else {
          this.$router.go(-1)
        }
      })
    },
    hdDialogShow() {
      let custsArr = [];
      this.hdFromData.customerContactActs.forEach(element => {
        custsArr.push(element.custId);
      });
      if(!custsArr.length){
        return
      }
      queryCustomersUrl({ custIdArray: custsArr }).then(response => {
        this.seletData.paternalUnitKh = response.data;
        this.hdFromData.customerContactActs.forEach(element => {
          var e = {};
          this.seletData.paternalUnitKh.forEach(ite => {
            if (ite.custId == element.custId) {
              e = ite;
              return;
            }
          });

          console.log(e);
          const index = this.hdFromData.customerContactActs.indexOf(element);
          this.hdFromData.customerContactActs[index].hdlx = e.customerContacts;
        });
      });
    },
    remotepaternalUnitKh(query) {
      if (query !== "") {
        queryCustomersUrl({ fullname: query }).then(response => {
          if (response.success) {
            this.seletData.paternalUnitKh = response.data;
          } else {
            this.$message.error(response.message);
          }
        });
      }
    },

    getcontinent(item) {
      var newItem;

      this.seletData.ctDataOption.forEach(element => {
        if (element.value == item) {
          newItem = element.continentCn;
          return;
        }
      });
      console.log(newItem, "999");
      return newItem;
    },

    handleScroll() {
      // var scrollTop =
      //   window.pageYOffset ||
      //   document.documentElement.scrollTop ||
      //   document.body.scrollTop;
      // var offsetTop = document.querySelector("#dflxr-title").offsetTop();
      // console.log(scrollTop, offsetTop);
      // if (scrollTop == offsetTop) {
      //   this.stepActive = 1;
      // } else {
      //   this.stepActive = 5;
      // }
    },
    // 表格项-->

    createCustAddr(type) {
      this.$refs["hdFromDataForm"].validate(valid => {
        if (valid) {
          // this.hdFromData.custId = this.postForm.custId;
          delete this.hdFromData.materialList
          this.hdFromData.customerContactActs.forEach(e => {
            delete e.hdlx;
          });
          addActivityUrl(this.hdFromData).then(response => {
            if (response.success) {
              this.$message.success("添加成功");
              this.$router.go(-1);
            } else {
              this.$message.error(response.message);
            }
          });
        } else {
          this.$message.error("请填写必填项");
          return false;
        }
      });
    },
    updateCustAddr(type) {
      const tempData1 = Object.assign({}, this.hdFromData);
      delete tempData1.materialList
      updateActivityUrl(tempData1).then(response => {
        if (response.success) {
          if(this.componentState){
            this.$emit('updateCustomerActivity',response)
          } else {
            this.$message.success("保存成功");
            if (this.isCustomer) {
              this.$emit('closeDialog', true)
            } else {
              this.$router.go(-1);
            }
          }
        } else {
          this.$message.error(response.message);
        }
      });
    },
    addhdDftable(type) {
      switch (type) {
        case "dfcon":
          this.hdFromData.customerContactActs.push({
            custContactId: "",
            custId: "",
            memo: "",
            hdlx: ""
          });

          break;
        case "wfcon":
          this.hdFromData.agencyContactActs.push({
            userId: "",
            memo: ""
          });

          break;

        default:
          break;
      }
    },
    handledeleElementhddfcon(index) {
      // const index = this.hdFromData.customerContactActs.indexOf(item);
      this.hdFromData.customerContactActs.splice(index, 1);
    },
    handledeleElementhdwfcon(index) {
      // const index = this.hdFromData.agencyContactActs.indexOf(item);
      this.hdFromData.agencyContactActs.splice(index, 1);
    },
    hdkhselect(vId, row) {
      var e = {};
      this.seletData.paternalUnitKh.forEach(ite => {
        if (ite.custId == vId) {
          e = ite;
          return;
        }
      });

      console.log(e);
      const index = this.hdFromData.customerContactActs.indexOf(row);
      this.hdFromData.customerContactActs[index].hdlx = e.customerContacts;
    }

    //<--表格项
  }
};
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.el-table /deep/ th {
  background-color: #7199d5;
  color: #ffffff;
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
    height: 40px;
    line-height: 40px;
    padding: 0px;
  }
  /deep/ td {
    background-color: #ffffff !important;
  }
  /deep/ .el-input__inner,
  /deep/ .el-select {
    width: 100%;
  }
}
.form-border {
  /deep/ .el-row {
    margin: 0px;
  }
  /deep/ .postInfo-container-item {
    width: 100%;
  }
  /deep/ .el-form-item__label {
    background-color: #f9f9f9;
    width: 30%;
    text-align: center;
  }

  /deep/ .el-form-item {
    border-right: 1px solid #d7d7d7;
    margin: 0px !important;
  }
  /deep/ .el-row {
    border-bottom: 1px solid #d7d7d7;
  }
  /deep/ .el-input,
  /deep/ .el-select {
    width: 70%;
  }
  /deep/ .el-form-item__content {
    text-align: center;
    height: 30px;
  }
  .fullRow {
    /deep/ .el-form-item__label {
      width: 15%;
    }

    /deep/ .el-input,
    /deep/ .el-select {
      width: 85%;
    }
  }
  /deep/ .el-input__inner {
    border: none;
  }
  /deep/ .el-select .el-input {
    width: 100%;
  }
  border-top: 1px solid #d7d7d7;
  border-left: 1px solid #d7d7d7;
  // border-bottom: 1px solid #d7d7d7;
}

.titleLeft {
  margin-right: 20px;
}
.createPost-container {
  position: relative;

  background-color: #e8ebed;
  /deep/ .form-con {
    background-color: #ffffff;

    /deep/ .form-con-item {
      @include clearfix;
      padding: 5px 20px;
      /deep/ .el-col {
      }
    }
  }
  /deep/ .createPost-main-container {
    padding: 0px;
    border: 1px solid #ccc;
    /deep/ .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;
    }
  }

  /deep/ .word-counter {
    width: 40px;
    position: absolute;
    right: 10px;
    top: 0px;
  }
}
.clearfix::after {
  content: "";
  display: block;
  clear: both;
}
.uploader-custfile {
  display: flex;
  width: 100%;
  /deep/ .el-form-item__content {
    text-align: left;
    display: inline-table;
    width: 85%;
  }

  /deep/ .el-form-item__label {
  }
}
.tilteSpan {
  font-size: 18px;
  padding: 15px 0px;
  color: #7199d5;
}
.article-textarea /deep/ {
  /deep/ textarea {
    padding-right: 40px;
    resize: none;
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #bfcbd9;
  }
}

.avatar-uploader {
  /deep/ .el-form-item__label {
    height: 154px;
    line-height: 154px;
    width: 30%;
  }
  height: 154px;

  /deep/ .el-upload {
    border: 1px dashed #b6b2b2;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    margin-top: 4px;
  }
}
.avatar-uploader {
  /deep/ .el-upload:hover {
    border-color: #409eff;
  }
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 145px;
  height: 145px;
  line-height: 145px;
  text-align: center;
  border: 1px dashed #d9d9d9;
}
.avatar {
  width: 145px;
  height: 145px;
  display: block;
}
.el-step {
  cursor: pointer;
}
.tilteBtn {
  text-align: right;
  padding: 10px 10px;
  background-color: #d0d0d0;
}
</style>
