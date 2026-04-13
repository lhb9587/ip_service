<template>
  <div class="app-container">
    <header class="y-header">{{$route.meta.title}}</header>
    <div class="filter-container" style="margin-bottom:15px">
      <el-form :inline="true" :model="listQuery" size="small" class="demo-form-inline">
        <el-row class="searchfullRow">

          <el-row class="searchfullRow1">
            <el-col :span="24" class="searchcol">
              <el-form-item label="当前客户">
                <span>{{$route.params.custname}}</span>

              </el-form-item>

              <el-form-item class="cutItemrow" label="申请人">
                <el-select default-first-option :clearable='true' placeholder="请选择" v-model="listQuery.appId" filterable>
                  <el-option v-for="item in seletData.apps" :key="item.appId" :label="item.applicantName" :value="item.appId">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item class="" label="状态">
                <el-radio-group v-model="listQuery.searchtype" size="small">
                  <el-radio label="0" border>全部</el-radio>
                  <el-radio label="1" border>可续展商标</el-radio>
                  <el-radio label="2" border>可变更</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item class="" label="范围">
                <el-radio-group v-model="listQuery.national" size="small">
                  <el-radio label="0" border>全部</el-radio>
                  <el-radio label="1" border>国内</el-radio>
                  <el-radio label="2" border>国际</el-radio>
                  <el-radio label="3" border>内外</el-radio>

                </el-radio-group>
              </el-form-item>
              <el-form-item label="类别">
                <template>
                  <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选
                  </el-checkbox>
                  <el-checkbox-group v-model="typearr" @change="handleCheckedCitiesChange">
                    <el-checkbox v-for="(item,key) in 45" :key='key' :label="item">
                      {{item}}
                    </el-checkbox>

                  </el-checkbox-group>
                </template>
              </el-form-item>
            </el-col>

          </el-row>
          <el-col :span="24" style=" text-align:center ">

            <el-button class="filter-item" type="primary" @click="getList('search')" size="small">
              搜索
            </el-button>
            <el-button class="filter-item" type="" @click="clearSeach" size="small">重置
            </el-button>

          </el-col>
        </el-row>

      </el-form>

    </div>
    <TitleTotal :total="total" />
    <el-table size="mini" :data="list" border fit empty-text="暂无数据" highlight-current-row current-row-key style="width: 100%;">
      <el-table-column type="index" width="50" label="序号" align="left"></el-table-column>
      <el-table-column align="left" label="商标图样" width>
        <template slot-scope="scope">
          <img @click="pushtodetail(scope.row)" style="width:100px;height:100px;cursor: pointer;" :src="'ipdoc/downloadimage'+scope.row.imgFilePath" alt="">
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

    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />

  </div>
</template>
<script>
import {
  selecttrademarkUrl,
  queryAppInfoUrl,
  querytmxuzhanUrl,
  querytmchangeUrl
} from "@/api/customerList";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
const defaultData = {
  pageNo: 1,
  pageSize: 10,
  custId: "",
  appId: "",
  tmName: "",
  regNumber: "",
  tmType: [],
  national: "0",
  searchtype: "0"
};
export default {
  components: { Pagination },
  data() {
    return {
      typearr: [],
      checkAll: false,
      isIndeterminate: true,
      dialogFormxy: false,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        custId: "",
        appId: "",
        tmName: "",
        regNumber: "",
        tmType: [],
        national: "0",
        searchtype: "0"
      },
      deldata: {
        customerID: ""
      },
      seletData: {
        apps: []
      }
    };
  },
  created() {
    this.getList();
    this.getallSelectData();
  },
  methods: {
    handleCheckAllChange(val) {
      let arr = [];
      for (let index = 1; index < 46; index++) {
        arr.push(index);
      }

      this.typearr = val ? arr : [];
      this.isIndeterminate = false;
      console.log(this.listQuery.tmType);
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === 45;
      this.isIndeterminate = checkedCount > 0 && checkedCount < 45;
    },
    clearSeach() {
      this.listQuery = Object.assign({}, defaultData);
      this.getList();
    },
    pushtodetail(row) {
      this.$router.push("/workbench/trademark/trademark_detail/" + row.tmId);
    },
    getList(type) {
      if (type == "search") {
        this.listQuery.pageNo = "1";
      }
      this.listLoading = true;
      this.listQuery.custId = this.$route.params.custId;
      this.listQuery.tmType = this.typearr.join(",");
      if (this.listQuery.searchtype == "0") {
        selecttrademarkUrl(this.listQuery).then(response => {
          this.list = response.data;
          this.total = response.total;
          this.listLoading = false;
        });
      }
      if (this.listQuery.searchtype == "1") {
        querytmxuzhanUrl(this.listQuery).then(response => {
          this.list = response.data;
          this.total = response.total;
          this.listLoading = false;
        });
      }
      if (this.listQuery.searchtype == "2") {
        if (this.listQuery.appId) {
          querytmchangeUrl(this.listQuery).then(response => {
            this.list = response.data;
            this.total = response.total;
            this.listLoading = false;
          });
        } else {
          this.$message.error("请选择申请人");
          this.list = [];
          this.total = 0;
          this.listLoading = false;
        }
      }
    },

    getallSelectData() {
      queryAppInfoUrl({ custId: this.$route.params.custId }).then(res => {
        this.seletData.apps = res.data;
      });
    }
  }
};
</script>

 <style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.searchfullRow {
  .searchcol {
    padding-right: 3%;
  }
  /deep/ .el-form-item__label {
    width: 25%;
  }
  /deep/ .el-form-item__content {
    width: 75%;
  }
  /deep/ .el-form-item {
    width: 100%;
  }
  /deep/ .el-input,
  /deep/ .el-select {
    width: 100%;
  }
}

.searchfullRow1 {
  .searchcol {
    padding-right: 0%;
  }
  /deep/ .el-form-item__label {
    width: 7.2%;
  }
  /deep/ .el-checkbox,
  .el-checkbox-group {
    display: inline-block;
  }
  /deep/ .el-form-item__content {
    width: 92.8%;
  }
  /deep/ .el-form-item {
    width: 100%;
  }
  /deep/ .el-input,
  /deep/ .el-select {
    width: 100%;
  }
  .cutItemrow {
    /deep/ .el-form-item__content {
      width: 32.8%;
    }
  }
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
</style>

