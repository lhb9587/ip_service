<template>
    <div class="materialPage">
      <div style="display: flex;justify-content: space-between;align-items:center">
        <span>共计{{curPageList.filter(item=>item.precase!==3).length}}</span>
        <p class="button_warp">
          <el-button type="text" size="small" @click="changeOperation(0)" v-if="$store.getters.permissions.includes(89)"><img src="@/assets/资料管理icon/隐藏.png" alt=""></el-button>
          <el-button type="text" size="small" @click="changeOperation(1)" v-if="$store.getters.permissions.includes(87)"><img src="@/assets/资料管理icon/下载.png" alt=""></el-button>
          <el-button type="text" size="small" @click="dialogVisible=true" v-if="$store.getters.permissions.includes(89)"><img src="@/assets/资料管理icon/回收站还原.png" alt="">({{curPageList.filter(item=>item.precase===3).length}})</el-button>
        </p>
      </div>
      <el-table
        :data="curPageList.filter(item=>item.precase!==3)"
        border
        empty-text="暂无数据"
        highlight-current-row
        current-row-key
        style="width: 100%;"
        @select="handleSelectionChange"
        @select-all="handleSelectionAll"
      >
        <el-table-column
          type="selection"
          width="30"
          class="selection"
          v-if="selectionState"
        >
        </el-table-column>
        <el-table-column type="index" width="50" label="序号" align="left">
          <template slot-scope="scope">
            <span>{{scope.$index+1}}</span>
          </template>
        </el-table-column>
        <el-table-column label="文件名称"   align="left" >
          <template slot-scope="scope">
            {{scope.row.materialName}}
          </template>
        </el-table-column>
        <el-table-column label="上传时间"   align="left" >
          <template slot-scope="scope">
            {{scope.row.modifyDate}}
          </template>
        </el-table-column>
        <el-table-column label="上传人"   align="left" >
          <template slot-scope="scope">
            {{scope.row.modifier}}
          </template>
        </el-table-column>
        <el-table-column label="操作"  align="left">
          <template slot-scope="{row}">
            <el-button type="text" size="small" @click.stop="takeRelatedCases(row)" >关联案件查询</el-button>
            <el-button type="text" size="small" @click.stop="downLoad(row,1)" v-if="$store.getters.permissions.includes(87)">下载</el-button>
            <el-button type="text" size="small" @click.stop="downLoad(row,2)" v-if="$store.getters.permissions.includes(87)">预览</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="button_warp" v-show="selectionState">
        <el-button type="primary" @click="submit">确定</el-button>
        <el-button @click="selectionState=false">取消</el-button>
      </div>
      <el-dialog
        title="垃圾箱"
        :visible.sync="dialogVisible"
        width="50%"
        :before-close="handleClose">
        <el-table
          :data="curPageList.filter(item=>item.precase===3)"
          border
          empty-text="暂无数据"
          highlight-current-row
          current-row-key
          style="width: 100%;"
          @select="rubbishSelectionChange"
          @select-all="rubbishSelectionAll"
        >
          <el-table-column
            type="selection"
            width="30"
            class="selection"
          >
          </el-table-column>
          <el-table-column type="index" width="50" label="序号" align="left">
            <template slot-scope="scope">
              <span>{{scope.$index+1}}</span>
            </template>
          </el-table-column>
          <el-table-column label="文件名称"   align="left" >
            <template slot-scope="scope">
              {{scope.row.materialName}}
            </template>
          </el-table-column>
        </el-table>
        <div class="button_warp">
          <el-button type="primary" @click="restoreMaterial">还原</el-button>
          <el-button @click="deleteCaseMaterial">彻底删除</el-button>
        </div>
      </el-dialog>
      <el-dialog
        title="关联案件"
        :visible.sync="relatedCasesState"
        width="50%"
        :before-close="handleClose">
        <el-table
          :data="relatedCases"
          border
          empty-text="暂无数据"
          highlight-current-row
          current-row-key
          style="width: 100%;"
        >
          <el-table-column type="index" width="50" label="序号" align="left">
            <template slot-scope="scope">
              <span>{{scope.$index+1}}</span>
            </template>
          </el-table-column>
          <el-table-column label="案件文号"   align="left" >
            <template slot-scope="scope">
              {{scope.row.agentNum}}
            </template>
          </el-table-column>
        </el-table>
        <div class="button_warp">
          <el-button @click="relatedCasesState=false">关闭</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
import { deleteCaseMaterial, putMaterialIntoRubbish, restoreMaterial, downloadMaterial, queryCaseByMaterialId } from '@/api/caseList'
export default {
  name: "materialPage",
  props:{
    curPageList:{
      type:Array
    }
  },
  data(){
    return {
      selectionState:false,
      operation:'',
      materialIdList:[],
      rubbishList:[],
      dialogVisible:false,
      relatedCasesState:false,
      relatedCases:[]
    }
  },
  methods:{
    handleSelectionChange(val){
      this.materialIdList=val.map(item=>item.materialId)
    },
    handleSelectionAll(val){
      this.materialIdList=val.map(item=>item.materialId)
    },
    changeOperation(flag){
      this.selectionState=true
      this.operation=flag
    },
    rubbishSelectionChange(val){
      this.rubbishList=val.map(item=>item.materialId)
    },
    rubbishSelectionAll(val){
      this.rubbishList=val.map(item=>item.materialId)
    },
    takeRelatedCases({materialId}){
      queryCaseByMaterialId({materialId}).then(res=>{
        if(!res.data.length){
          this.$message.warning('该资料没有案件引用')
          return
        }
        this.relatedCases=res.data
        this.relatedCasesState=true
      })

    },
    submit(){
      if(!this.operation){
        putMaterialIntoRubbish({materialIdList:this.materialIdList}).then(res=>{
          this.$emit('updateMaterial')
        })
      }else {
        downloadMaterial({materialIdList: this.materialIdList}).then(res=>{
          var a = document.createElement('a');
          a.setAttribute('href', 'ipdoc'+res.data);
          a.setAttribute('id', 'startTelMedicine');
          a.setAttribute('downLoad', new Date().getTime());
          if(document.getElementById('startTelMedicine')) {
            document.body.removeChild(document.getElementById('startTelMedicine'));
          }
          document.body.appendChild(a);
          a.click();
        })
      }
    },
    handleClose(){
      this.dialogVisible=false
      this.relatedCasesState=false
    },
    restoreMaterial(){
      restoreMaterial({materialIdList:this.rubbishList}).then(res=>{
        this.dialogVisible=false
        this.$emit('updateMaterial')
      })
    },
    deleteCaseMaterial(){
      deleteCaseMaterial({materialIdList:this.rubbishList}).then(res=>{
        this.dialogVisible=false
        this.$emit('updateMaterial',true)
      })
    },
    downLoad(row,num){
      var a = document.createElement('a');
      a.setAttribute('href', 'ipdoc'+row.address);
      a.setAttribute('id', 'startTelMedicine');
      if(num===1){
        a.setAttribute('downLoad', row.name);
      }else {
        a.setAttribute('target','_blank');
      }
      if(document.getElementById('startTelMedicine')) {
        document.body.removeChild(document.getElementById('startTelMedicine'));
      }
      document.body.appendChild(a);
      a.click();
    }
  }
}
</script>

<style lang="scss" scoped>
  .materialPage{
    padding: 0 20px;
  }
  .button_warp{
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
    .el-button{
      img{
        transform:scale(0.8);
      }
    }
  }
</style>
