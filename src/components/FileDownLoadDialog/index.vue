<template>
  <div class="wrapper">
    <el-tabs type="border-card" v-model="activeName" @tab-click="handleClickTab">
      <el-tab-pane label="文件命名" name="1">
        <el-checkbox-group v-model="defineChoice" @change="onlyOneChoice">
          <el-checkbox v-for="item in defineList" :key="item.fdid"
                       :label="item.fdid">{{item.eleNames}}
          </el-checkbox>
        </el-checkbox-group>
      </el-tab-pane>
      <el-tab-pane label="自定义命名" name="2">
        <el-checkbox-group v-model="ownDefineChoice" @change="mulDefineName">
          <el-checkbox v-for="item in ownerDefineList" :key="item.feid" :label="item.feid">
            <span v-if="item.feid">{{item.eleName}}</span>
            <el-input size="mini" v-else v-model="item.eleName"></el-input>
          </el-checkbox>
        </el-checkbox-group>
      </el-tab-pane>
    </el-tabs>
    <div class="form-info">
      <el-form label-width="100px">
        <el-form-item label="元素分隔符:">
          <el-input size="mini" v-model="FilenameDefine.fgfu"></el-input>
        </el-form-item>
        <el-form-item label="命名规则:">
          <el-input size="mini" v-model="eleNames"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="button">
      <el-button type="primary" size="mini" @click.native="() => {$emit('downLoadfiles', {...FilenameDefine, eleNames}); clearData()}">确定</el-button>
      <el-button type="primary" size="mini" @click.native="() => {$emit('closeDialog'); clearData()}">取消</el-button>
    </div>
  </div>
</template>

<script>
  import {queryFileNameDefine, queryFileNameElement} from '@/api/caseDetail';

  export default {
    name: "index",
    props: {
      caseTypeNum: {
        type: Number,
        default: 4
      }
    },
    data() {
      return {
        activeName: '1',
        eleNames: '',
        FilenameDefine: {
          fdid: '',
          feids: '',
          fgfu: ''
        },
        defineList: [],
        defineChoice: [],
        ownerDefineList: [],
        ownDefineChoice: []
      }
    },
    created() {
      this.queryFileNameDefine()
      this.queryFileNameElement()
      // this.activeName == '1' ? this.queryFileNameDefine() : this.queryFileNameElement();
    },
    methods: {
      clearData() {
        this.eleNames = '';
        this.FilenameDefine = {fdid: '', feids: '', fgfu: ''};
        this.defineChoice = [];
        this.ownDefineChoice = [];
      },
      mulDefineName(v){
        this.FilenameDefine.feids = v.filter(item => !!item).join(',')
        let names = '';
        v.length && (v.forEach(item => {
          if(this.ownerDefineList.find(i=> i.feid == item)){
            names += this.ownerDefineList.find(i=> i.feid == item).eleName + ' '
          }
        }));
        this.eleNames = names;
      },
      onlyOneChoice(v) {
        v.length && (this.defineChoice = v.splice(-1));
        let obj = this.defineList.find(i => i.fdid === this.defineChoice[0]) || {};
        obj && (this.FilenameDefine.fdid = obj.fdid, this.FilenameDefine.feids = obj.feids, this.eleNames = obj.eleNames);
      },
      handleClickTab(v) {
        // v.name == '1' ? this.queryFileNameDefine() : this.queryFileNameElement();
        this.clearData()
      },
      queryFileNameDefine() {
        queryFileNameDefine({dfType: this.caseTypeNum}).then(res => {
          this.defineList = res.data
        })
      },
      queryFileNameElement() {
        queryFileNameElement({eleType: this.caseTypeNum}).then(res => {
          this.ownerDefineList = res.data
          this.ownerDefineList.push({
            eleName: '',
            feid: ''
          })
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .wrapper {
    position: relative;

    .form-info {
      /*position: absolute;*/
      bottom: 0;
      width: 80%;
      .el-form-item {
        margin-bottom: 0;
      }
    }
    .el-tabs {
      margin-bottom: 10px;
    }
    .el-tab-pane {
      /*height: 270px;*/
    }
    .el-checkbox {
      display: block;
      margin: 5px;
    }
    .button {
      position: absolute;
      bottom: -38px;
      left: 50%;
      transform: translate(-50%);
    }
  }

</style>
