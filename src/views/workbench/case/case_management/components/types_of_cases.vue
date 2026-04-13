<template>
  <div class="case_management_item">
    <header>
      <el-form size="mini" class="form-container">
        <el-form-item label-width="200px" :label="item.filterName+':'" class="postInfo-container-item" v-for="item,index in conditionsModuleList" :key="index">
          <el-select default-first-option v-model="queryModuleData[item.property]" placeholder="请选择" v-if="item.filterType==='select'" filterable clearable>
            <el-option v-for="itm in item.values" :key="itm.id" :label="itm.value" :value="itm.id">
            </el-option>
          </el-select>
          <el-select default-first-option v-if="item.filterType==='selectMany'" v-model="queryModuleData[item.property]" filterable remote clearable reserve-keyword placeholder="请输入关键词"
            :remote-method="(queryString)=>{
        remoteMethod(queryString,index,item.property);
    }">
            <el-option v-for="itm in item['valueList']" :key="itm.id" :label="itm.value" :value="itm.id">
            </el-option>
          </el-select>
          <el-select default-first-option v-if="item.filterType==='selectTableMany'" v-model="queryModuleData[item.property]" filterable remote clearable reserve-keyword placeholder="请输入关键词"
            :remote-method="(queryString)=>{
        remoteMethod(queryString,index,item.property); }">
            <el-option disabled label="" value="">
              <span v-for="itmx,key in item['values'][0]" v-if="key!='id'">
                {{itmx}}
              </span>
            </el-option>
            <el-option v-for="itm,idx in item['valueList']" :key="itm.id" :label="itm.value" :value="itm.id">
              <span v-for="itmx,key in item['valueList'][idx]" v-if="key!='id'">{{itmx}}</span>
            </el-option>
          </el-select>
          <el-select default-first-option v-if="item.filterType==='selectTable'" v-model="queryModuleData[item.property]" filterable clearable placeholder="请选择">
            <el-option v-for="itm ,idx in item.values" :key="idx" :label="itm.value" :value="itm.id" :disabled="itm.id==-1">
              <span v-for="itmx ,key in item['values'][idx]" v-if="key!='id'">{{itmx}}</span>
            </el-option>
          </el-select>
          <el-radio-group v-model="queryModuleData[item.property]" v-if="item.filterType==='radio'">
            <el-radio :label="itm.id" v-for="itm,index in item.values" :key="index">{{itm.value}}</el-radio>
          </el-radio-group>
          <el-input clearable v-model="queryModuleData[item.property]" :placeholder="'请输入'+item.filterName" v-if="item.filterType==='text'"></el-input>
          <el-input clearable v-model="queryModuleData[item.property]" :placeholder="'请输入'+item.filterName" type="textarea" v-if="item.filterType==='textarea'"></el-input>
          <el-input clearable v-model="queryModuleData[item.property.split(',')[0]]" :placeholder="'请输入'+item.filterName" v-if="item.filterType==='textRange'"
            @change="(string)=>changeTextRange(string,index,item.property)"></el-input>
          <span v-if="item.filterType==='textRange'" v-show="item.property.includes(',')">至</span>
          <el-input clearable v-model="queryModuleData[item.property.split(',')[1]]" :placeholder="'请输入'+item.filterName" v-if="item.filterType==='textRange'"></el-input>
          <el-date-picker v-if="item.filterType==='date'" v-model="queryModuleData[item.property.split(',')[0]]" type="date" placeholder="开始日期">
          </el-date-picker>
          <span v-if="item.filterType==='date'" v-show="item.property.includes(',')">至</span>
          <el-date-picker v-if="item.filterType==='date'" v-show="item.property.includes(',')" v-model="queryModuleData[item.property.split(',')[1]]" type="date" placeholder="结束日期">
          </el-date-picker>
          <el-multi-cascader :ref="item.property" :class="item.property" v-if="item.filterType==='cascader'" :show-all-levels="false" :options="item.values" multiple filterable clearable
            :props="defaultParams" collapse-tags change-on-select v-model="queryModuleData[item.property]"> </el-multi-cascader>
          <!--<el-cascader-->
          <!--:change-on-select="true"-->
          <!--:show-all-levels="false"-->
          <!---->
          <!--filterable-->
          <!--clearable-->
          <!--v-model="queryModuleData[item.property]"-->
          <!--:options="item.values"-->
          <!--:props="defaultParams"-->
          <!--placeholder="请选择"-->
          <!--&gt;</el-cascader>-->
        </el-form-item>
      </el-form>
      <div class="queryButton">
        <el-button size="small" @click="reset">重置</el-button>
        <el-button type="primary" size="small" @click="handleSearch">搜索</el-button>
        <el-button type="primary" size="small" @click="queryFilter">设置筛选项</el-button>
        <el-button type="primary" size="small" @click="jumpRistration">立卷</el-button>
      </div>
    </header>
    <section>
      <el-table :data="caseList" border>
        <el-table-column type="index" width="60" label="序号" align="left">
          <template slot="header" slot-scope="scope">
            <div class="dots" @click="handleCheckboxState">
              <span class="dot">.</span>
              <span class="dot">.</span>
              <span class="dot">.</span>
            </div>
            序号
          </template>
        </el-table-column>
        <el-table-column align="left" v-for="item,index in preferenceList" :label="item.title" :prop="item.value">
          <template slot="header" slot-scope="scope">
            <span>{{item.title}}</span>
            <img v-show="!checkFilterList[index]" @click="setFilterItem(index)" src="@/assets/u600.png" alt=""
              v-if="filterData[item.value+'List']?filterData[item.value+'List'].length!=0?true:false:false" />
            <img v-show="checkFilterList[index]" @click="setFilterItem(index)" src="@/assets/filter@2x.png" alt=""
              v-if="filterData[item.value+'List']?filterData[item.value+'List'].length!=0?true:false:false" />
            <div class="checkboxs" v-if="checkFilterList[index]">
              <div class="filter_content">
                <el-checkbox-group v-model="filterData[item.value]" @change="filterDataChange">
                  <el-checkbox :label="itm" v-for="itm in filterData[item.value+'List']"></el-checkbox>
                </el-checkbox-group>
              </div>
              <p class="checkAll" @click="checkAllOrNot(item.value)">
                全选/取消全选
              </p>
            </div>
          </template>
          <template slot-scope="scope">
            <span style="margin: 0;cursor: pointer" @click="$router.push('/workbench/case/seeCaseDetail/'+scope.row.caseId)">
              {{scope.row[item.value]}}
            </span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="medium" icon="el-icon-edit" @click="$router.push('/workbench/case/case_detail/'+scope.row.caseId+'/'+scope.row.caseType)"></el-button>
            <el-button type="text" size="medium" icon="el-icon-delete" @click="delCase(scope)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="queryCaseList" />
      <div class="checkbox" v-if="checkboxState">
        <el-select default-first-option v-model="checkCaseList" multiple :multiple-limit="10" filterable placeholder="请选择" collapse-tags @visible-change="handleChange">
          <el-option v-for="item in selectColumnList" :key="item.COLUMN_NAME" :label="item.COLUMN_COMMENT" :value="item.COLUMN_NAME">
          </el-option>
        </el-select>
        <div class="checkbox_bottom">
          <el-button size="mini" round @click="delPreference">默认</el-button>
          <el-button size="mini" round @click="savePreference">保存</el-button>
          <el-button size="mini" round @click="checkNotAtAll">全不选</el-button>
        </div>
      </div>

    </section>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="80%">
      <el-transfer v-model="transferValue" @left-check-change="leftCheckChange" :key="transferData.filterId" :data="transferData" filterable filter-placeholder="请输入搜索内容"
        :titles="['选择筛选项—全部案件', '已选']">
      </el-transfer>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="configFilter">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import {
  delCase,
  selectColumn,
  savePreference,
  queryCaseList,
  queryPreference,
  delPreference,
  queryFilter,
  configFilter,
  queryFilterConfig
} from "@/api/caseList.js";
import { mapGetters } from "vuex";
export default {
  name: "types_of_cases",
  data() {
    return {
      listLoading: false,
      queryModuleData: { caseTypeIds: [] }, // 查找条件
      checkboxState: false, // 表头筛选框状态
      dialogVisible: false, // 配置筛选条件框
      transferData: [], // 筛选条件数据
      transferValue: [], // 当前筛选条件id
      caseList: [], // 当前列表数据
      checkCaseList: [], // 当前选中表头条件
      selectColumnList: [], // 配置表头总列数据做循环用
      preferenceList: [], // 循环表头数据
      filterData: {}, // 表头过滤数据
      conditionsModuleList: [], // 渲染筛选条件
      caseListDefault: [], // 案件默认全部列表
      checkFilterList: [], // 控制筛选漏斗状态
      firstRequest: false, // 第一次请求
      listQuery: {
        pageNo: 0,
        pageSize: 10
      },
      total: 0,
      defaultParams: {
        // 級聯菜單默認
        value: "caseTypeId",
        label: "caseType",
        children: "childrens", // checkStrictly: true,
        multiple: true
      }
    };
  },
  created() {
    this.getAllWfs();
    this.queryCaseList();
    this.queryFilterConfig();
    // this.selectColumn()
    // this.queryPreference()
    // this.setWidth()
  },
  methods: {
    remoteMethod(value, index, property) {
      if (value) {
        this.$set(
          this.conditionsModuleList[index],
          "valueList",
          this.conditionsModuleList[index].values
            .filter(item => (item.value ? item.value.includes(value) : false))
            .slice(0, 100)
        );
        this.$forceUpdate();
      }
    },
    changeTextRange(value, index, property) {
      this.$set(this.queryModuleData, property.split(",")[1], value);
    },
    leftCheckChange(e) {
      // if (e.length + this.transferValue.length > 15) {
      //   this.$message({
      //     type: "warning",
      //     message: `您最多选择15项`
      //   });
      //   e.pop();
      // }
    },
    jumpRistration() {
      this.$router.push("registration");
    },
    handleSearch() {
      this.listQuery.pageNo = 1;
      this.queryCaseList();
    },
    reset() {
      this.queryModuleData = {};
      this.listQuery.pageNo = 1;
      this.queryCaseList();
    },
    queryCaseList() {
      const data = {
        business: 2,
        pageNo: this.listQuery.pageNo,
        pageSize: this.listQuery.pageSize
      };
      for (var key in this.queryModuleData) {
        if (
          Object.prototype.toString
            .call(this.queryModuleData[key])
            .includes("Date")
        ) {
          this.queryModuleData[key] = this.formatDate(
            this.queryModuleData[key]
          );
        }
      }
      this.listLoading = true;
      queryCaseList(Object.assign(data, this.queryModuleData)).then(res => {
        this.listLoading = false;
        this.caseListDefault = res.data;
        this.total = res.total;
        this.caseList = this.caseListDefault;
        if (this.firstRequest === false) {
          res.data.forEach(item => {
            for (let key in item) {
              this.$set(this.filterData, key + "List", []);
            }
          });
          this.firstRequest = true;
        }
        res.data.forEach(item => {
          for (let key in item) {
            if (item[key]) {
              this.filterData[key + "List"].push(item[key]);
            }
          }
        });
        for (let key in this.filterData) {
          this.filterData[key] = Array.from(new Set(this.filterData[key]));
        }
        this.filterDataChange();
      });
    },
    handleChange(boolean) {
      if (!boolean) {
        // this.checkboxState=false
        const els1 = this.$el.getElementsByClassName("checkbox")[0];
        els1.children[0].click();
      }
    },
    savePreference() {
      let list2 = this.checkCaseList.map(item => ({
        title: this.selectColumnList.find(i => i.COLUMN_NAME === item)
          .COLUMN_COMMENT,
        value: item
      }));
      const data = {
        userId: this.userId,
        bussId: 2,
        list2
      };
      savePreference(data).then(res => {
        if (res.success) {
          this.checkboxState = false;
          this.queryCaseList();
          this.getAllWfs();
        }
      });
    },
    delPreference() {
      const data = {
        userId: this.userId,
        bussId: 2
      };
      delPreference(data).then(res => {
        if (res.success) {
          this.checkboxState = false;
          this.queryCaseList();
          this.getAllWfs();
        }
      });
    },
    filterDataChange() {
      // this.caseList=this.multiFilter(this.caseListDefault,this.filterData)
      let arr = JSON.parse(JSON.stringify(this.caseListDefault));
      const filterKeys = Object.keys(this.filterData);
      filterKeys.forEach(key => {
        if (this.filterData[key].length !== 0 && !key.includes("List")) {
          arr = arr.filter(itm => {
            var flag = false;
            this.filterData[key].forEach(item => {
              if (item === itm[key]) {
                flag = true;
              }
            });
            return flag;
          });
        }
      });
      this.caseList = arr;
    },
    checkAllOrNot(prop) {
      if (
        this.filterData[prop].length !== this.filterData[prop + "List"].length
      ) {
        this.filterData[prop] = [];
        this.filterData[prop + "List"].forEach(item => {
          this.filterData[prop].push(item);
        });
      } else {
        this.filterData[prop] = [];
      }
      this.filterDataChange();
    },
    handleCheckboxState() {
      this.checkboxState = !this.checkboxState;
      if (this.checkboxState) {
        this.setWidth();
      }
    },
    getAllWfs() {
      const data = {
        userId: this.userId,
        bussId: 2
      };
      Promise.all([selectColumn(data), queryPreference(data)]).then(res => {
        this.selectColumnList = res[0].data;
        this.preferenceList = res[1].data;
        this.checkCaseList = this.preferenceList.map(item => item.value);
        this.preferenceList.forEach(item => {
          this.$set(this.filterData, item.value, []);
        });
        this.checkFilterList = this.preferenceList.map(item => false);
      });
    },
    checkNotAtAll() {
      this.checkCaseList = [];
    },
    setWidth() {
      let timer = setInterval(() => {
        if (this.$el.getElementsByClassName("el-select-dropdown")[0]) {
          const els = this.$el.getElementsByClassName("el-select-dropdown")[0];
          const els1 = this.$el.getElementsByClassName("checkbox")[0];
          els1.children[0].click();
          els.style.width = "100px";
          clearInterval(timer);
        }
      }, 60);
    },
    setFilterItem(index) {
      this.checkFilterList.splice(index, 1, !this.checkFilterList[index]);
    },
    queryFilter() {
      this.dialogVisible = true;
      const data = {
        bussId: 2
      };
      queryFilter(data).then(res => {
        if (res.success) {
          this.transferData = this.generateData(res.data);
        }
      });
    },
    generateData(arr) {
      arr.forEach(item => {
        item.key = item.filterId;
        item.label = item.filterName;
      });
      return arr;
    },
    configFilter() {
      const data = {
        bussId: 2,
        filterIds: this.transferValue.join(",")
      };
      configFilter(data).then(res => {
        this.dialogVisible = false;
        this.queryFilterConfig();
      });
    },
    queryFilterConfig() {
      const data = {
        bussId: 2
      };
      queryFilterConfig(data).then(res => {
        this.conditionsModuleList = res.data;
        res.data.forEach(item => {
          if (item.filterType.includes("Many")) {
            item.valueList = [];
          }
        });
        this.transferValue = res.data.map(item => item.filterId);
      });
    },
    delCase(scope) {
      this.$confirm("此操作将永久删除该案件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delCase({ caseId: scope.row.caseId }).then(res => {
            if (res.success) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.queryCaseList();
            } else {
              this.$alert(`<p>${res.data}<p>`, "删除提示", {
                dangerouslyUseHTMLString: true
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    formatDate(time) {
      return this.$commonUtils.formatDate(time)
    },
    getInput(el) {
      var elem_child = el.childNodes;
      for (var i = 0; i < elem_child.length; i++) {
        if (elem_child[i].nodeName !== "INPUT") {
          this.getInput(elem_child[i]);
        } else {
          elem_child[i].value = "";
          return;
        }
      }
    }
  },
  computed: {
    ...mapGetters(["userId"])
  },
  watch: {
    "queryModuleData.caseTypeIds"(n) {
      if (
        Object.prototype.toString.call(n).includes("Array") &&
        n.length === 0
      ) {
        this.getInput(this.$refs.caseTypeIds[0].$el);
      }
    }
  },
  components: {
    Pagination
  }
};
</script>

<style lang="scss" scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(201, 201, 201, 1);
  margin-bottom: 19px;
  .queryButton {
    flex: 1;
    display: flex;
    margin-left: 125px;
    padding-left: 63px;
    position: relative;
    margin-bottom: 26px;
  }
  .queryButton:before {
    content: "";
    display: block;
    width: 0px;
    border-right: 2px dashed rgba(191, 191, 191, 1);
    height: 58px;
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
  }
}
.el-form {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  max-width: 1130px;

  .postInfo-container-item {
    width: 50%;
    /deep/ .el-form-item__content {
      width: 330px;
      display: flex;
      height: 28px;
      align-items: center;
      .el-select {
        width: 100%;
      }
      .el-input {
        width: 100%;
      }
    }
  }
}
.case_management_item {
  min-height: calc(100vh - 50px - 18px - 41px);
  display: flex;
  flex-direction: column;
  overflow: auto;
}
section {
  position: relative;
  clear: both;
  flex: 1;
  padding-bottom: 200px;
}
.checkbox {
  position: absolute;
  left: 14px;
  top: 90px;
  width: 222px;
  height: 370px;
  border: 1px solid #99a9bf;
  background: #fff;
  z-index: 100;
  padding-top: 6px;
  padding-left: 6px;
  .checkbox_bottom {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 210px;
    height: 29px;
    background: #fff;
  }
}

.dots {
  cursor: pointer;
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  .dot {
    color: transparent;
    padding: 1px;
    margin: 1px;
    width: 5px;
    background: RGBA(113, 123, 140, 1);
    height: 5px;
    display: block;
  }
}
/*.el-table /deep/ th div{*/
/*overflow: auto;*/
/*}*/
.el-table {
  overflow: visible;
  /deep/ th {
    color: rgba(51, 51, 51, 1);
    background: rgba(187, 187, 187, 0.5);
  }
}
.el-table /deep/ th .cell {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  img {
    margin-left: 5px;
    width: 12px;
    cursor: pointer;
  }
  .checkboxs {
    position: absolute;
    background: #fff;
    min-width: 100%;
    top: 47px;
    left: 0px;
    display: flex;
    z-index: 1;
    border: 1px solid #f4f4f5;
    overflow: visible;
    padding-left: 6px;
    padding-bottom: 80px;
    .filter_content {
      width: 100%;
      max-height: 200px;
      overflow: auto;
    }
    .el-checkbox-group {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      overflow: visible;
    }
    .checkAll {
      position: absolute;
      bottom: -27px;
      width: 100%;
      left: 0;
      background: #fff;
      height: 27px;
      color: #409eff;
      text-indent: 5px;
      line-height: 27px;
      cursor: pointer;
      border: 1px solid #f4f4f5;
    }
  }
}
.el-table /deep/ .el-table__header-wrapper {
  overflow: visible;
  th {
    overflow: visible;
    .cell {
      overflow: visible;
    }
  }
}

.el-scrollbar li {
  display: flex;
  span {
    flex: 1;
    overflow: hidden;
    border-right: 1px solid #f4f4f5;
    border-bottom: 1px solid #f4f4f5;
  }
}
.el-transfer {
  display: flex;

  /deep/ & > .el-transfer-panel {
    flex: 1;
  }

  /deep/ .el-transfer__buttons {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  /deep/ .el-transfer-panel__list {
    display: flex;
    flex-wrap: wrap;
    label {
      width: 33.3%;
      margin-right: 0;
    }
  }
}
</style>
