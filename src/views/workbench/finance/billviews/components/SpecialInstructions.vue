<template>
  <div>
  <p>客户 <span>{{data.custFullNameString}}</span></p>
  <el-table size="mini" :data="data.customerRequirementBillList.map(item=>{item.status=1; return item})" border fit empty-text="暂无数据" current-row-key style="width: 100%;">
    <!--          <el-table-column type="index" width="30" label="序号" align="left"></el-table-column>-->
    <!--          <el-table-column label="客户" align="left" width="80">-->
    <!--            <template slot-scope="scope">-->
    <!--              <span>{{ scope.row.custfullname }}</span>-->
    <!--            </template>-->
    <!--          </el-table-column>-->

    <!--          <el-table-column label="申请人" align="left" width="80">-->
    <!--            <template slot-scope="scope">-->
    <!--              -->
    <!--            </template>-->
    <!--          </el-table-column>-->

    <el-table-column :label="label" align="left" width>
      <template slot-scope="scope">
        <el-collapse accordion v-model="scope.row.status" >
          <el-collapse-item :title="`时间: ${scope.row.startDate?scope.row.startDate:''}`" :name="1">
            <div style="display: flex;flex-direction: row;margin-right: 10px;margin-left: 10px;" v-if="scope.row.materials && scope.row.materials.length">
              <div style="flex-shrink: 0">【文件】</div>
              <div>
                <div class="pointer" style="" v-for="(file, idx) in scope.row.materials" @click="onPreview(file)">{{file.materialName}}</div>
              </div>
            </div>
            <span v-if="scope.row.applicantName">申请人: {{ scope.row.applicantName }}</span>
            <span v-if="scope.row.curName">币种: {{ scope.row.curName }}</span>
            <span v-if="scope.row.billSendtype">发送方式: {{ scope.row.billSendtype }}</span>
<!--            <el-input type="textarea"  autosize v-if="type!='view'" size="small" :title="scope.row.specialInfo" v-model="scope.row.specialInfo" placeholder></el-input>-->
            <div style="padding: 5px 10px" v-html="getSpecialInfo(scope.row.specialInfo)" ></div>
          </el-collapse-item>
        </el-collapse>
      </template>
    </el-table-column>
  </el-table>
  </div>
</template>

<script>
  import { doEditInOffice, getProgID } from '@/utils/editInOffice'
  import { recordOnlienEdit } from '@/api/caseList'

  export default {
    props:{
      data:{},
      type:{

      },
      label:{
        default:'账单特殊指示'
      }
    },
    name: "SpecialInstructions",
    data(){
      return {

      }
    },
    methods:{
      downLoad(data) {
        const url = data.address || data.url
        const downData = {
          url: `ipdoc${url}`,
          success() {
          }
        }
        if (data.mailId) {
          downData.downLoad = data.materialName
        }
        this.$commonUtils.downLoadAll(downData)
      },
      onPreview(data) {
        let url = data.address || data.url
        if (getProgID(url)) {
          recordOnlienEdit({materialId: data.materialId})
          doEditInOffice(url, getProgID(url))
        } else if (['eml', 'msg'].includes(url.replace(/.+\./, '').toLocaleLowerCase())) {
          if (['doc', 'docx'].includes(url.replace(/.+\./, "").toLocaleLowerCase())) {
            this.$commonUtils.viewPdf(`${url}`)
          } else {
            let flag = ''
            if (data.mailId) {
              flag = 'mailId'
            } else if (data.materialId) {
              flag = 'materialId'
            }
            url = url.replace(/&/g, '%26')
            window.open(`#/preView?address=ipdoc${url}&${flag}=${data[flag]}`.replace(/[+]/g, '%2B'))
          }
        } else if (['pdf', 'jpg', 'png'].some(item => url.replace(/.+\./, "").toLocaleLowerCase() == item)) {
          window.open(`/ipdoc${url}`.replace(/[+]/g, '%2B'))
        } else {
          this.downLoad(data)
        }
      },
      getSpecialInfo(string){
        if(string){
          return string.replace(/<|>/g, $=>' ' + $ + ' ').split('\n').map(item=>`<p style="word-wrap: break-word;
    word-break: break-word;">${item}</p>`).join('')
        }else {
          return ''
        }
      },
    }
  }
</script>

<style lang="scss" scoped>
  /deep/ .el-table__header th{
    padding: 0;
    height: 30px;
    background: #f5f5f5;
  }
  /deep/ .el-table .cell{
    padding: 0 !important;
  }
  /deep/ .el-collapse-item__header {
    /*display: block;*/
    /*text-align: center;*/

    background: #f5f5f5;
    height: 35px;
    line-height: 35px;
    display: flex;
    padding-left: 10px;
    /*text-indent: 10px;*/
  }
  /deep/ .el-collapse-item__content {
    padding: 0px;
  }
</style>
