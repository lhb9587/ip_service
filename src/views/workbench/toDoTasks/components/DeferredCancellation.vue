<template>
  <div>

    <swiper :options="swiperOption" v-if="examineState">
      <swiper-slide v-for="(item,index) in timelimitWriteoffArray.filter((item,i)=>i==0)" :key="index">
        <el-button style="float: right" type="text" @click="timelimitWriteoffArray.splice(index,1)">待审核</el-button>
        <el-table @row-contextmenu="contextmenu" :data="item.timelimitArray" border class="el-table1" @header-dragend="headerDragend" height="400">
          <el-table-column type="index" width="60" label="序号" align="left">
          </el-table-column>
          <el-table-column align="left" :key="i.title" v-for="i,index in tableTitleList" :label="i.title" :prop="i.value" :width="i.width">
            <template slot-scope="scope" >
              <p v-if="i.value=='materialArray'">
                <el-upload
                  class="uploadHasClass"
                  :class="[{'examineState':examineState},{'upload-demo':uploading}]"
                  drag
                  name="attachFile"
                  :data="getUploadData([scope.row.caseId])"
                  :action="creatematerial"
                  :file-list="item.timelimitArray[scope.$index].materialArray"
                  :on-remove="(file,fileList)=>handleRemove(file,fileList,scope.row.caseId)"
                  :on-preview="onPreview"
                  :before-remove="beforeRemove"
                  :on-success="(res, file, fileList)=>onsuccess(res, file, fileList,scope.row.caseId)"
                  :before-upload="beforeUpload">
                  <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                </el-upload>
              </p>
              <p v-else :style="{margin: 0,cursor: 'pointer',color:i.color?i.color:'#333'}" @click="takeCaseDetail(scope.row)">{{scope.row[i.value]}}</p>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="left"  class-name="small-padding fixed-width" v-if="!examineState">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="delCancellation(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-form  ref="submission"  label-width="206px" :model="item" :rules="rules">
<!--          <template v-if="item.timelimitArray.length===1">-->
<!--            <el-row>-->
<!--              <el-form-item label="时限名称:" >-->
<!--                {{item.timelimitArray[0].typeName}}-->
<!--              </el-form-item>-->
<!--            </el-row>-->
<!--            <el-row>-->
<!--              <el-form-item label="绝限日期:" >-->
<!--                {{item.timelimitArray[0].abslimitDate}}-->
<!--              </el-form-item>-->
<!--            </el-row>-->
<!--            <el-row>-->
<!--              <el-form-item label="案件文号:" >-->
<!--                {{item.timelimitArray[0].agentNum}}-->
<!--              </el-form-item>-->
<!--            </el-row>-->
<!--            <el-row>-->
<!--              <el-form-item label="案件类型:" >-->
<!--                {{item.timelimitArray[0].caseTypeName}}-->
<!--              </el-form-item>-->
<!--            </el-row>-->
<!--            <el-row>-->
<!--              <el-form-item label="案件阶段:" >-->
<!--                {{item.timelimitArray[0].stageName}}-->
<!--              </el-form-item>-->
<!--            </el-row>-->
<!--          </template>-->
          <el-row key="operation">
            <el-form-item label="处理方式:" prop="operation">
              <el-radio-group v-model="item.operation">
                <el-radio label="核销">核销</el-radio>
                <el-radio label="延期">延期</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-row>
          <el-row v-if="item.operation!=='延期'" key="writeoffState">
            <el-form-item label="核销状态:" prop="writeoffState">
              <el-select  default-first-option v-model="item.writeoffState" placeholder="请选择" filterable
                          clearable @change="(val)=>getCaseStageBytimeTypeWriteoffState(item.timelimitArray[index].tltTypeId,item.timelimitArray[index].caseId,val,2,index,)">
                <el-option
                  v-for="itm in getWriteoffStateList"
                  :key="itm.id"
                  :label="itm.str"
                  :value="itm.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <el-row v-if="item.operation!=='延期'" key="reason">
            <el-form-item label="核销理由:" :prop="[1, 5, 7].includes(item.writeoffState) ? 'reason' : ''">
              <el-input
                type="textarea"
                :autosize="{ minRows: 4, maxRows: 4}"
                placeholder="请输入内容"
                v-model="item.reason"
              >
              </el-input>
            </el-form-item>
          </el-row>
          <el-row v-if="item.operation!=='延期'">
            <el-form-item label="核销后案件阶段:" >
              <el-select  default-first-option v-model="item.caseStatus" placeholder="请选择" filterable
                          clearable >
                <el-option
                  v-for="itm in getCaseStageList.filter(im=>im.taskType.split(',').includes(String(timelimitWriteoffArray[0]['timelimitArray'][0].taskType))||!timelimitWriteoffArray[0]['timelimitArray'][0].taskType)"
                  :key="itm.id"
                  :label="itm.stageName"
                  :value="itm.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <el-row v-if="item.operation==='延期'">
            <el-form-item label="延期理由:" :key="item.timelimitArray[0].typeName === '补充材料时限' ? 'reason' : ''" :prop="item.timelimitArray[0].typeName === '补充材料时限' ? 'reason' : ''">
              <el-input
                type="textarea"
                :autosize="{ minRows: 4, maxRows: 4}"
                placeholder="请输入内容"
                v-model="item.reason"
              >
              </el-input>
            </el-form-item>
          </el-row>
          <el-row  v-if="item.operation==='延期'" key="delayDate">
            <el-form-item label="延期后提醒日期:" prop="delayDate">
              <el-date-picker
                v-model="item.delayDate"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
          </el-row>
<!--          <el-row>-->
<!--            <el-form-item label="客户指示函:" >-->
<!--              <div class="table_wrap">-->
<!--&lt;!&ndash;              <el-upload&ndash;&gt;-->
<!--&lt;!&ndash;                v-if="item.timelimitArray.length===1"&ndash;&gt;-->
<!--&lt;!&ndash;                drag&ndash;&gt;-->
<!--&lt;!&ndash;                name="attachFile"&ndash;&gt;-->
<!--&lt;!&ndash;                :class="[{'examineState':examineState},{'upload-demo1':uploading}]"&ndash;&gt;-->
<!--&lt;!&ndash;                :data="getUploadData([item.timelimitArray[0].caseId])"&ndash;&gt;-->
<!--&lt;!&ndash;                :action="creatematerial"&ndash;&gt;-->
<!--&lt;!&ndash;                :file-list="item.timelimitArray[0].materialArray"&ndash;&gt;-->
<!--&lt;!&ndash;                :on-remove="(file,fileList)=> handleRemove(file,fileList,item.timelimitArray[0].caseId)"&ndash;&gt;-->
<!--&lt;!&ndash;                :before-remove="beforeRemove"&ndash;&gt;-->
<!--&lt;!&ndash;                :on-preview="onPreview"&ndash;&gt;-->
<!--&lt;!&ndash;                :on-success="(res, file, fileList)=>onsuccess(res, file, fileList,item.timelimitArray[0].caseId)"&ndash;&gt;-->
<!--&lt;!&ndash;                :before-upload="beforeUpload">&ndash;&gt;-->
<!--&lt;!&ndash;                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>&ndash;&gt;-->
<!--&lt;!&ndash;              </el-upload>&ndash;&gt;-->
<!--              <el-table-->
<!--                :data="item.timelimitArray"-->
<!--                border-->
<!--                style="width: 100%">-->
<!--                <el-table-column type="index" width="60" label="序号" align="left">-->
<!--                </el-table-column>-->
<!--                <el-table-column-->
<!--                  prop="agentNum"-->
<!--                  align="left"-->
<!--                  label="案件文号"-->
<!--                  width="180">-->
<!--                </el-table-column>-->
<!--                <el-table-column-->
<!--                  align="left"-->
<!--                  prop="materialArray"-->
<!--                  label="文件名称">-->
<!--                  <template slot-scope="scope">-->
<!--                    <el-upload-->
<!--                      class="uploadHasClass"-->
<!--                      :class="[{'examineState':examineState},{'upload-demo':uploading}]"-->
<!--                      drag-->
<!--                      name="attachFile"-->
<!--                      :data="getUploadData([scope.row.caseId])"-->
<!--                      :action="creatematerial"-->
<!--                      :file-list="item.timelimitArray[scope.$index].materialArray"-->
<!--                      :on-remove="(file,fileList)=>handleRemove(file,fileList,scope.row.caseId)"-->
<!--                      :on-preview="onPreview"-->
<!--                      :before-remove="beforeRemove"-->
<!--                      :on-success="(res, file, fileList)=>onsuccess(res, file, fileList,scope.row.caseId)"-->
<!--                      :before-upload="beforeUpload">-->
<!--                      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>-->
<!--                    </el-upload>-->
<!--                  </template>-->
<!--                </el-table-column>-->
<!--              </el-table>-->
<!--              </div>-->
<!--            </el-form-item>-->
<!--          </el-row>-->
          <el-row>
            <el-form-item label="提交员工:" >
              {{item.submitUserName?item.submitUserName:item.submitUserName=$store.state.user.name}}
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="提交日期:">
              {{item.submitDate?item.submitDate:item.submitDate=getNowFormatDate()}}
            </el-form-item>
          </el-row>
          <div class="button_wrap" style="margin-top: 20px">
            <el-button type="primary" @click="auditTimelimit(index,1)">审核</el-button>
            <el-popover style="text-align: right; margin: 0"
                        placement="top"
                        width="500"
                        v-model="item.visible">
            <div >
              <p style="text-align: left">退回原因</p>
              <el-input
                type="textarea"
                :rows="3"
                placeholder="请输入内容"
                v-model="reason">
              </el-input>
              <div style="text-align: right">
                <el-button size="mini" type="text" @click="item.visible = false">取消</el-button>
                <el-button type="primary" size="mini" @click="auditTimelimit(index,0, reason)">确定</el-button>
              </div>

            </div>
            <el-button slot="reference">退回</el-button>
            </el-popover>
<!--            <el-button type="primary" @click=""></el-button>-->
            <el-button @click="closeThisPage(false)">取消</el-button>
          </div>
        </el-form>
<!--          <div  class="button_wrap">-->
<!--            <el-button type="primary" @click="submit" v-if="!examineState">提交</el-button>-->
<!--            <el-button type="primary" @click="auditTimelimit" v-if="examineState">审核</el-button>-->
<!--            <el-button @click="closeThisPage">取消</el-button>-->
<!--          </div>-->
      </swiper-slide>
<!--      <div v-show="timelimitWriteoffArray.length>1" class="swiper-button-prev swiper-button-prev2" slot="button-prev"></div>-->
<!--      <div v-show="timelimitWriteoffArray.length>1" class="swiper-button-next swiper-button-next2" slot="button-next"></div>-->

    </swiper>
    <template v-if="!examineState">
    <el-table  @row-contextmenu="contextmenu" :data="caseData" border class="el-table1" @header-dragend="headerDragend" height="400">
      <el-table-column type="index" width="60" label="序号" align="left">
      </el-table-column>
      <el-table-column align="left" :key="item.title" v-for="item,index in tableTitleList" :label="item.title" :prop="item.value" :width="item.width">
        <template slot-scope="scope" >
          <p v-if="item.value=='materialArray'">
            <el-upload
              class="uploadHasClass"
              :class="[{'examineState':examineState},{'upload-demo':uploading}]"
              drag
              name="attachFile"
              :data="getUploadData([scope.row.caseId])"
              :action="creatematerial"
              :file-list="submitData.timelimitArray[scope.$index].materialArray"
              :on-remove="(file,fileList)=>handleRemove(file,fileList,scope.row.caseId)"
              :on-preview="onPreview"
              :before-remove="beforeRemove"
              :on-success="(res, file, fileList)=>onsuccess(res, file, fileList,scope.row.caseId)"
              :before-upload="beforeUpload">
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            </el-upload>
          </p>
          <p v-else :style="{margin: 0,cursor: 'pointer',color:item.color}" @click="takeCaseDetail(scope.row)">{{scope.row[item.value]}}</p>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="left"  class-name="small-padding fixed-width" v-if="!examineState">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="delCancellation(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-form  ref="submission1" :model="submitData" :rules="rules" label-width="206px" >
<!--      <template v-if="caseData.length===1">-->
<!--      <el-row>-->
<!--        <el-form-item label="时限名称:">-->
<!--          {{caseData[0].typeName}}-->
<!--        </el-form-item>-->
<!--      </el-row>-->
<!--      <el-row>-->
<!--        <el-form-item label="绝限日期:" >-->
<!--          {{caseData[0].abslimitDate}}-->
<!--        </el-form-item>-->
<!--      </el-row>-->
<!--      <el-row>-->
<!--        <el-form-item label="案件文号:" >-->
<!--          {{caseData[0].agentNum}}-->
<!--        </el-form-item>-->
<!--      </el-row>-->
<!--      <el-row>-->
<!--        <el-form-item label="案件类型:" >-->
<!--          {{caseData[0].caseTypeName}}-->
<!--        </el-form-item>-->
<!--      </el-row>-->
<!--      <el-row>-->
<!--        <el-form-item label="案件阶段:" >-->
<!--          {{caseData[0].stageName}}-->
<!--        </el-form-item>-->
<!--      </el-row>-->
<!--      </template>-->
      <el-row key="operation">
        <el-form-item label="处理方式:" prop="operation">
          <el-radio-group v-model="submitData.operation">
            <el-radio label="核销">核销</el-radio>
            <el-radio label="延期">延期</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-row>
      <el-row v-if="submitData.operation!=='延期'" key="writeoffState">
        <el-form-item label="核销状态:" prop="writeoffState">
          <el-select  default-first-option v-model="submitData.writeoffState" placeholder="请选择" filterable
                      clearable  @change="(val)=>getCaseStageBytimeTypeWriteoffState(caseData[0].tltTypeId,caseData[0].caseId,val,1)" >
            <el-option
              v-for="item in getWriteoffStateList"
              :key="item.id"
              :label="item.str"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-row>
      <el-row v-if="submitData.operation!=='延期'" key="reason">
<!--     1, 5, 7 分别是 【处理完成】、【未报客户】、【没有处理】   -->
        <el-form-item label="核销理由:" :prop="[1, 5, 7].includes(submitData.writeoffState) ? 'reason' : ''">
        <el-input
        type="textarea"
        :autosize="{ minRows: 2, maxRows: 4}"
        placeholder="请输入内容"
        v-model="submitData.reason"
        >
        </el-input>
        </el-form-item>
      </el-row>
      <el-row v-if="submitData.operation!=='延期'">
        <el-form-item label="核销后案件阶段:">
          <el-select  default-first-option v-model="submitData.caseStatus" placeholder="请选择" filterable
                      clearable >
            <el-option
              v-for="item in getCaseStageList.filter(im=>im.taskType.split(',').includes(String(caseData[0]&&caseData[0].taskType))||!(caseData[0]&&caseData[0].taskType))"
              :key="item.id"
              :label="item.stageName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-row>
      <el-row v-if="submitData.operation==='延期'">
        <el-form-item label="延期理由:"  :key="submitData.timelimitArray[0].typeName === '补充材料时限' ? 'reason' : ''":prop="submitData.timelimitArray[0].typeName === '补充材料时限' ? 'reason' : ''">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请输入内容"
            v-model="submitData.reason"
          >
          </el-input>
        </el-form-item>
      </el-row>
      <el-row  v-if="submitData.operation==='延期'" key="delayDate">
        <el-form-item label="延期后提醒日期:" prop="delayDate">
          <el-date-picker
          v-model="submitData.delayDate"
          type="date"
          placeholder="选择日期"
          value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
      </el-row>
<!--      <el-row>-->
<!--        <el-form-item label="客户指示函:" >-->
<!--&lt;!&ndash;          <el-upload&ndash;&gt;-->
<!--&lt;!&ndash;            v-if="caseData.length===1"&ndash;&gt;-->
<!--&lt;!&ndash;            drag&ndash;&gt;-->
<!--&lt;!&ndash;            name="attachFile"&ndash;&gt;-->
<!--&lt;!&ndash;            :class="[{'examineState':examineState},{'upload-demo1':uploading}]"&ndash;&gt;-->
<!--&lt;!&ndash;            :data="getUploadData([submitData.timelimitArray[0].caseId])"&ndash;&gt;-->
<!--&lt;!&ndash;            :action="creatematerial"&ndash;&gt;-->
<!--&lt;!&ndash;            :file-list="submitData.timelimitArray[0].materialArray"&ndash;&gt;-->
<!--&lt;!&ndash;            :on-remove="(file,fileList)=> handleRemove(file,fileList,submitData.timelimitArray[0].caseId)"&ndash;&gt;-->
<!--&lt;!&ndash;            :before-remove="beforeRemove"&ndash;&gt;-->
<!--&lt;!&ndash;            :on-preview="onPreview"&ndash;&gt;-->
<!--&lt;!&ndash;            :on-success="(res, file, fileList)=>onsuccess(res, file, fileList,submitData.timelimitArray[0].caseId)"&ndash;&gt;-->
<!--&lt;!&ndash;            :before-upload="beforeUpload">&ndash;&gt;-->
<!--&lt;!&ndash;            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>&ndash;&gt;-->
<!--&lt;!&ndash;          </el-upload>&ndash;&gt;-->
<!--          <div class="table_wrap">-->
<!--          <el-table-->
<!--          :data="submitData.timelimitArray"-->
<!--          border-->
<!--          style="width: 100%">-->
<!--          <el-table-column type="index" width="60" label="序号" align="left">-->
<!--          </el-table-column>-->
<!--          <el-table-column-->
<!--          prop="agentNum"-->
<!--          align="left"-->
<!--          label="案件文号"-->
<!--          width="180">-->
<!--          </el-table-column>-->
<!--          <el-table-column-->
<!--          align="left"-->
<!--          prop="materialArray"-->
<!--          label="文件名称">-->
<!--          <template slot-scope="scope">-->
<!--          <el-upload-->
<!--            class="uploadHasClass"-->
<!--            :class="[{'examineState':examineState},{'upload-demo':uploading}]"-->
<!--            drag-->
<!--            name="attachFile"-->
<!--            :data="getUploadData([scope.row.caseId])"-->
<!--            :action="creatematerial"-->
<!--            :file-list="submitData.timelimitArray[scope.$index].materialArray"-->
<!--            :on-remove="(file,fileList)=>handleRemove(file,fileList,scope.row.caseId)"-->
<!--            :on-preview="onPreview"-->
<!--            :before-remove="beforeRemove"-->
<!--            :on-success="(res, file, fileList)=>onsuccess(res, file, fileList,scope.row.caseId)"-->
<!--            :before-upload="beforeUpload">-->
<!--          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>-->
<!--          </el-upload>-->
<!--          </template>-->
<!--          </el-table-column>-->
<!--          </el-table>-->
<!--          </div>-->
<!--        </el-form-item>-->
<!--      </el-row>-->
      <el-row>
      <el-form-item label="提交员工:" >
         {{submitData.submitUserName?submitData.submitUserName:submitData.submitUserName=$store.state.user.name}}
      </el-form-item>
      </el-row>
      <el-row>
      <el-form-item label="提交日期:">
        {{submitData.submitDate?submitData.submitDate:submitData.submitDate=getNowFormatDate()}}
      </el-form-item>
      </el-row>
    </el-form>
    </template>
      <div  class="button_wrap" v-if="!examineState">
        <el-button type="primary" @click="submit" v-if="!examineState">提交</el-button>
<!--        <el-button type="primary" @click="auditTimelimit" v-if="examineState">审核</el-button>-->
        <el-button @click="closeThisPage(false)">取消</el-button>
    </div>

  </div>
</template>
<script>
import { getTimelimitListByTltId ,getCaseStage ,getWriteoffState,getTimelimitWriteoff ,addTimelimitWriteoff,auditTimelimit,getCaseStageBytimeTypeWriteoffState} from '@/api/caseList'
import { creatematerial } from '@/api/ipServiceApi.config.js'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
export default {
  name: "DeferredCancellation",
  props:{
    multipleSelection:{
      type:Array
    },
    examineState:{
    }
  },
  data() {
    return {
      creatematerial,
      visible:false,
      caseData:[],
      reason:'',
      submitData:{
        caseStatus:'',
        reason: ''
      },
      defaultTableTitleList:[
        {'title':'时限名称','value':'typeName','width':'80',},
        {'title':'时限内容','value':'caption','width':'100',},
        {'title':'绝限日期','value':'abslimitDate','width':'160',color:'red'},
        {'title':'申请方向','value':'appFromto' ,'width':'80'},
        {'title':'案件文号','value':'agentNum','width':'120' },
        {'title':'案件类型','value':'caseTypeName','width':'110'},
        {'title':'权利号','value':'droitNumber','width':'110'},
        {'title':'类别','value':'goodClasses','width':'80'},
        {'title':'申请人','value':'applicantName','width':'120'},
        {'title':'申请日期','value':'appDate','width':'80'},
        {'title':'案件阶段','value':'stageName','width':'80'},
        {'title':'客户指示函','value':'materialArray'}
      ],
      getCaseStageList:[],
      getWriteoffStateList:[],
      uploading:false,
      rules: {
        delayDate: [
          {required: true, message: '请填写延期后提醒日期', trigger: ['change','blur']}
        ],
        reason: [
          {required: true, message: '请填写', trigger: ['change','blur']}
        ],
        operation: [
          {required: true, message: '请选择处理方式', trigger: ['change','blur']}
        ],
        writeoffState:[
          {required: true, message: '请选择核销状态', trigger: ['change','blur']}
        ]
      },
      swiperOption:{
        //  slidesPerView: 'auto',
        noSwiping: true,
        noSwipingSelector: '*',
        centeredSlides:true,
        spaceBetween: 10,
        //loop:true,
        observer:true, //修改swiper自己或子元素时，自动初始化swiper
        observeParents:true,
        direction: 'horizontal',
        speed:600, //config参数同swiper4,与官网一致
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        }
      },
      timelimitWriteoffArray:[],
      tableTitleList:[]
    }
  },
  created(){
   this.getcolumnDefs('DeferredCancellation')
    this.getCaseStage()
    this.getWriteoffState()
    if(this.examineState){
      this.getTimelimitWriteoff()
    }else {
      this.getTimelimitListByTltId()
    }
  },
  methods:{
    contextmenu(row, column, event){
      var value=event.target.innerText
      // console.log(value =);
      const that=this
      this.$ContextMenu({
        event, // 传入鼠标事件
        menu:[{name:'复制',action:'copy'}]
      }).then(rs => {
        if(rs){
          this[rs](row, value);
        }
      });
    },
    copy(row, value) {
      if(value){
        this.$copyText(value).then(
          res => {
          })
      }
    },
    getcolumnDefs(type){
      var tableHeader=[]
      if(localStorage.getItem('tableHeader')&&JSON.parse(localStorage.getItem('tableHeader')).find(item=>item.name==type)){
        tableHeader=JSON.parse(localStorage.getItem('tableHeader')).find(item=>item.name==type).tableHeader
      }
      if(tableHeader.length){
        let liststr=JSON.stringify(this.defaultTableTitleList.map(item=>({title:item.title,value:item.value})))
        let liststr1=JSON.stringify(tableHeader.map(item=>({title:item.title,value:item.value})))
        if(liststr===liststr1){
          this.tableTitleList=tableHeader
        }else {
          this.tableTitleList = this.defaultTableTitleList.map(item => {
            var obj={}
            tableHeader.forEach(i => {
              if (item.value===i.value){
                obj=i
              }else {
                obj=item
              }
            })
            return obj
          })
        }
      }else {
        this.tableTitleList=this.defaultTableTitleList
      }
    },
    headerDragend(newWidth, oldWidth, column, event){
      if(this.tableTitleList.find(item=>item.value==column.property)){
        this.tableTitleList.find(item=>item.value==column.property).width=newWidth
        let tableHeader=this.tableTitleList
        this.saveLocation('DeferredCancellation',tableHeader)
      }
    },
    saveLocation(type,tableHeader){
      if(!localStorage.getItem('tableHeader')){
        let arr=[]
        arr.push({name:type,tableHeader:tableHeader})
        localStorage.setItem('tableHeader',JSON.stringify(arr))
      }else {
        let arr=JSON.parse(localStorage.getItem('tableHeader'))
        if(arr.find(item=>item.name==type)) {
          arr.find(item => item.name==type).tableHeader = tableHeader
          localStorage.setItem('tableHeader',JSON.stringify(arr))
        } else {
          arr.push({name:type,tableHeader:tableHeader})
        }
        localStorage.setItem('tableHeader',JSON.stringify(arr))
      }
    },
    getCaseStageBytimeTypeWriteoffState(tltTypeId,caseId,writeoffState,flag,index){
      if(flag===1){
        getCaseStageBytimeTypeWriteoffState({tltTypeId,caseId,writeoffState}).then(res=>{
          this.$set(this.submitData,'caseStatus',res.data.caseStatus)
        })
      }else if(flag===2){
        getCaseStageBytimeTypeWriteoffState({tltTypeId,caseId,writeoffState}).then(res=>{
          this.$set(this.timelimitWriteoffArray[index],'caseStatus',res.data.caseStatus)
        })
      }
    },
    takeCaseDetail(row){
      this.closeThisPage(false)
      this.$commonUtils.takeCaseDetail(row,this)
      // if(this.$commonUtils.getTwoDimensionalArray(this.$store.getters.caseTypeList,'caseTypeId',row.caseTypeId).includes(2)){
      //   this.$router.push('/workbench/case/seeCaseDetail/'+row.caseId+'?taskType=2')
      // }else {
      //   this.$router.push('/workbench/case/seeCaseDetail/'+row.caseId)
      // }
      // this.$router.push('/workbench/case/seeCaseDetail/'+row.caseId)
    },
    closeThisPage(flag){
      this.$emit('closeThisPage',flag)
    },
    delCancellation(row){
      // this.caseData.splice(this.caseData.indexOf(row),1)
       this.submitData.timelimitArray.splice(this.submitData.timelimitArray.map(item=>item.caseId).indexOf(row.caseId),1)
    },
    getTimelimitListByTltId(){
      getTimelimitListByTltId({tltIdArray:this.multipleSelection.map(item=>item.tltId)}).then(res=>{
        this.caseData = res.data
        this.submitData.timelimitArray = res.data
        this.submitData.caseStatus=Number(res.data[0].caseStatus)
      })
    },
    getTimelimitWriteoff(){
      getTimelimitWriteoff({tltIdArray:this.multipleSelection.map(item=>item.tltId)}).then(res=>{
        this.timelimitWriteoffArray = res.data
        this.timelimitWriteoffArray.forEach(item => {
          if (item.caseStatus) {
            item.caseStatus = Number(item.caseStatus)
          }
        })
      })
    },
    submit(){
      if (this.submitData.operation !== '延期' && [1, 5, 7].includes(this.submitData.writeoffState) && !this.submitData.reason) {
        this.$message.error("请填写核销理由！")
        return
      }
      if(!this.$commonUtils.formValidate(this.$refs['submission1']))return;
      addTimelimitWriteoff(this.submitData).then(res=>{
        this.closeThisPage(true)
      })

      // this.$refs['submission1'].validate((valid) => {
      //   if (valid) {
      //     addTimelimitWriteoff(this.submitData).then(res=>{
      //       this.closeThisPage(true)
      //     })
      //   } else {
      //     this.$message.error("请填写必填项！")
      //     return false;
      //   }
      // });
    },
    getCaseStage(){
      getCaseStage().then(res=>{
        this.getCaseStageList=res.data
      })
    },
    getWriteoffState(){
      getWriteoffState().then(res=>{
        this.getWriteoffStateList=res.data
      })
    },
    getUploadData(caseIds) {
      const data = {
        tokenID: this.$store.getters.token,
        caseIds: caseIds,
        type: '2',
        materialTypeId:146
      }
      return data
    },
    beforeUpload(){
      if(this.examineState){
        this.$message.error('审核人不可更改文件')
        return false
      }

    },
    onPreview(file) {
      var a = document.createElement('a')
      a.setAttribute('href', '/ipdoc' + file.address)
      a.setAttribute('id', 'startTelMedicine')
      a.setAttribute('target', '_blank')
      if(document.getElementById('startTelMedicine')) {
        document.body.removeChild(document.getElementById('startTelMedicine'))
      }
      document.body.appendChild(a)
      a.click()
    },
    onsuccess(res, file, fileList,caseId) {
      this.uploading=true
      if(!this.submitData.timelimitArray.find(item=>item.caseId===caseId).materialArray){
        this.submitData.timelimitArray.find(item=>item.caseId===caseId).materialArray=[]
      }
      res.data.forEach(item=>{
        item.name=item.materialName
        this.submitData.timelimitArray.find(item=>item.caseId===caseId).materialArray.push(item)
      })

      this.$nextTick(()=>{
        setTimeout(()=>{
          this.uploading=false
        },0)
      })
    },
    beforeRemove(){
      if(this.examineState){
        this.$message.error('审核人不可更改文件')
        return false
      }
    },
    handleRemove(file, fileList, caseId) {
      let delmaterialId;
      if (file.response) {
        delmaterialId = file.response.data[0].materialId;
      } else {
        delmaterialId = file.materialId;
      }
      this.submitData.timelimitArray.find(item=>item.caseId===caseId).materialArray.splice(this.submitData.timelimitArray.find(item=>item.caseId===caseId).materialArray.map(item=>item.materialId).indexOf(delmaterialId),1)
    },
    auditTimelimit(index,isPass,tltReturnCause){
      if (this.timelimitWriteoffArray[index].operation !== '延期' && [1, 5, 7].includes(this.timelimitWriteoffArray[index].writeoffState) && !this.timelimitWriteoffArray[index].reason) {
        this.$message.error("请填写核销理由！")
        return
      }
      if(!this.$commonUtils.formValidate(this.$refs['submission'][0]))return;
      auditTimelimit({timelimitWriteoffArray:[this.timelimitWriteoffArray[index]],isPass,tltReturnCause}).then(res=>{
        this.timelimitWriteoffArray.splice(index,1)
        this.reason=''
        // this.visible=false
        if(!this.timelimitWriteoffArray.length){
          this.closeThisPage(true)
        }
        // this.closeThisPage(true)
      })
    }
  },
  components: {
    swiper, swiperSlide
  }
}
</script>

<style lang="scss" scoped>
  .table_wrap{
    position: relative;
    width: 95%;
     .el-select,.el-date-picker{
       width: 20%;
     }
  }
  .uploadHasClass{
  /deep/ .el-upload{
   width: 100%;
  }
   /deep/ .el-upload-dragger{
     height: 20px;
     width: 100%;
   }
   /deep/ .el-upload-list{
   display: flex;
   justify-content: space-around;
   align-items: center;
   flex-wrap: wrap;
   &:first-child{
   margin-top: 0;
   }
   }
   }
   /deep/ .el-upload-list__item-name{
   transition: all 0s;
   transform: translateY(0);
   }
   /deep/ .el-upload-list__item:first-child{
   margin-top: 0;
   }

  .el-form{
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    padding: 20px;
    margin:0 20px ;
    .el-select,.el-input,.el-date-picker,{
      width: 30%;
    }
    .el-textarea{
      width:95%;
      margin: 10px 0;
    }
    /deep/ input{
      height: 28px;
    }
    /deep/ .el-input__icon{
      line-height: 28px;
    }
    .el-row{
      min-height: 30px;
      width: 100%;
      display: flex;
      align-items: center;
      .el-form-item{
        width: 100%;
        display: flex;
        border: 1px solid #EBEEF5;
        border-bottom: 0;
        margin-bottom: 0;
        /deep/ .el-form-item__label{
          background: #f5f7fa;
        }
        /deep/ .el-form-item__content{
          margin-left: 0 !important;
          padding-left: 10px;
          background: #fff;
          flex: 1;
        }

      }
      .small-el-form-item-prev:before{
        content: '';
        width: 50%;
        height: 1px;
        background: #EBEEF5;
        position: absolute;
        bottom: -1px;
        right: 0;
        z-index: 1;
      }
      .small-el-form-item{
        position: relative;
        width: 50%;
        /deep/ .el-form-item__content{
          flex: 1;
          .pad20{
            padding-left: 20px;
          }
        }
      }
    }
    .el-row:nth-last-child(1){
      .el-form-item{
        border: 1px solid #EBEEF5;
      }
    }
  }
  .button_wrap {
    width: 100%;
    display: flex;
    justify-content: center;
    .el-button{
      margin-left: 30px;
    }
  }
  .require /deep/ .el-form-item__label:before{
    content: "*";
    color: #f56c6c;
    margin-right: 4px;
  }
  .examineState /deep/{
    .el-icon-close{
      /*display: none;*/
    }
    .el-icon-close-tip{
      /*display: none;*/
    }
  }
  .upload-demo{
      /deep/ .el-upload-list{
      display: flex;
      justify-content: space-around;
      align-items: center;
      flex-wrap: wrap;
      &:first-child{
      margin-top: 0;
      }
    }
  }
  .upload-demo,.upload-demo1{
    /deep/ .el-upload-list__item{
    transition: all 0s ;
    transform: translateY(0);
    }
    /deep/ .el-upload-list__item-name{
    transition: all 0s;
    transform: translateY(0);
    }
    /deep/ .el-upload-list__item:first-child{
    margin-top: 0;
    }
    /deep/ .el-list-enter,.el-list-leave-active{
    visibility: hidden;
    opacity: 1;
    transition: all 0s;
    transform: translateY(0);
    }
    /deep/ .el-list-enter-active,.el-list-leave-active{
    display: none;
    transition: all 0s;
    }
  }
   .el-table{
     width: auto;
     /deep/ tr{
       td{
         padding: 5px 0 !important;
       }
     }
     /deep/ tr:nth-of-type(1){
       th{
         line-height: 28px;
         padding: 0 !important;
         background: rgba(242, 242, 242, 1);
         td{
           padding: 0 !important;
         }
       }
     }
   }
  .el-table1{
    margin:0 40px;
  }
</style>
