<template>
  <div class="filterSelection_warp">
    <el-form label-width="120px"  size="mini" class="form-container" style="margin-top: 2px">
      <slot name="header"></slot>
      <el-button class="clearButton" size="mini" @click="clearSearch"><img src="@/assets/清除@2x.png" alt=""><span>重置</span></el-button>
      <el-button class="selectButton" size="mini" type="text" @click="queryFilter">更多搜索条件</el-button>
    </el-form>
    <div class="divdiver"></div>
    <div class="FilterSelectWrap"  >
      <FilterSelect  class="filterSelect"  v-if="item.filterType" v-model="moduleData[item.property]" :filterName="item.filterName" :filterType="item.filterType" :values="item.values"  v-for="item,index in conditionsModuleList" :key="index" @changeNewlovingVue1='(value)=>newlovingVue1(value,item.property)'></FilterSelect>
    </div>
    <slot name="bottom"></slot>
    <el-dialog title="提示" :visible.sync="transferVisible" width="80%">
      <el-transfer v-model="transferValue" @left-check-change="leftCheckChange" :key="transferData.filterId" :data="transferData" filterable filter-placeholder="请输入搜索内容"
                   :titles="['选择筛选项—全部案件', '已选']">
      </el-transfer>
      <span slot="footer" class="dialog-footer">
        <el-button @click="transferVisible = false">取 消</el-button>
        <el-button type="primary" @click="configFilter">确 定</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script>
import { queryFilter,queryFilterConfig ,configFilter} from "@/api/caseList.js"
import FilterSelect from '@/components/FilterSelect'
export default {
  components:{
    FilterSelect
  },
  props:{
    queryModuleData:{
      default:{}
    },
    bussId:{}
  },
  model:{
    prop: 'queryModuleData',
    event: 'change'
  },
  data(){
    return {
      transferVisible:false,
      transferData:[],
      conditionsModuleList:[],
      moduleData:this.queryModuleData,
      transferValue:[]
    }
  },
  created(){
    this.queryFilterConfig()
  },
  name: "index",
  methods:{
    clearSearch() {
      //this.queryModuleData = {};
      for (var key in this.moduleData) {
        if(key.includes('Date')){
          this.$set(this.moduleData,key,['',''])
        } else if(key.includes('Array')) {
          this.$set(this.moduleData,key,[])
        }else{
          this.$set(this.moduleData,key,null)
        }
      }
      this.$emit('clearSearch')
    },
    queryFilter() {
      this.transferVisible = true;
      const data = {
        bussId: this.bussId
      };
      queryFilter(data).then(res => {
        if (res.success) {
          this.transferData = this.generateData(res.data);
        }
      });
    },
    configFilter() {
      const data = {
        bussId: this.bussId,
        filterIds: this.transferValue.join(",")
      };
      configFilter(data).then(res => {
        this.transferVisible = false;
        this.queryFilterConfig();
      });
    },
    newlovingVue1(value,property){
      property.split(',').forEach((item,index)=>{
        this.$set(this.moduleData,item,value[index])
      })
    },
    queryFilterConfig() {
      const data = {
        bussId: this.bussId
      };
      queryFilterConfig(data).then(res => {
        this.conditionsModuleList = res.data;
        res.data.forEach(item => {
          if (item.filterType.includes("Many")) {
            item.valueList = [];
          }
          if (item.filterType.includes("checkbox")) {
            this.$set(this.moduleData, item.property, []);
          }
        });
        this.transferValue = res.data.map(item => item.filterId);
      });
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
    generateData(arr) {
      arr.forEach(item => {
        item.key = item.filterId;
        item.label = item.filterName;
      });
      return arr;
    },
  },
  watch:{
    moduleData:{
      handler(newVal,oldVal){
        this.$emit('change',newVal)
      },
      deep: true
      },
    queryModuleData:{
      handler(newVal, oldVal) {
        this.moduleData=newVal
      },
      deep: true
    }
  }
}
</script>

<style lang="scss" scoped>
  .FilterSelectWrap{
    display: flex;
    flex-wrap: wrap;
    .filterSelect{
      width: 232px;
      margin-right: 30px;
      margin-bottom: 10px;
    }
  }
  .divdiver{
    position: relative;
    left: 30px;
    height: 1px;
    width: 83%;
    background: #EEF2FB;
    margin-bottom: 10px;
  }
  .filterSelection_warp {
    margin-bottom: 19px;
    box-shadow: 0px 2px 5px 0px rgba(163, 163, 163, 0.35);
    .queryButton {
      display: flex;
      flex-wrap: nowrap;
      position: relative;
      margin-bottom: 26px;
      justify-content: center;
      .buttonWrap_small {
        transform: translateX(-90px);
        display: flex;
        margin: 5px 5px;
        align-items: center;
        .el-button {
          margin-left: 10px;
        }
      }
    }
  }
  .el-form {
    position: relative;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    .el-cascader {
      width: 100%;
    }
    .postInfo-container-item {
      /deep/ .el-form-item__content {
        width: 360px;
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
  .selectButton{
    position: absolute;
    right: 12px;
    top: 28px;
  }
</style>
