<template>
  <div>
    <div v-if="knowledgeNavigationId==1">
      标签选择
      <el-checkbox-group size="mini" v-model="checkboxGroup">
        <el-checkbox label="法条变迁" border></el-checkbox>
        <el-checkbox label="新旧对照" border ></el-checkbox>
        <el-checkbox label="关联法条" border ></el-checkbox>
        <el-checkbox label="关联案例" border ></el-checkbox>
        <el-checkbox label="参阅文献" border ></el-checkbox>
      </el-checkbox-group>
    </div>
    <div class="uploadFile_wrap" v-if="type!=='look'">

      <uploadFile :clickUpload="clickUpload" @getUploadFile="getUploadFile" @changeClick="clickUpload=false" :multiple="false"></uploadFile>

      <el-button  size="mini" @click="clickUpload=true">一键上传</el-button>
    </div>
<!--    <quill-editor class="editor" v-model="content" :options="editorOption"></quill-editor>-->
    <el-form ref="form" :model="form" :rules="rules" v-if="formState" label-width="80px">
      <template v-for="(item,index) in queryPropertyList">
        <el-form-item :label="item.name" v-if="item.type=='String'" :prop="item.alias">
          <el-input v-model="form[item.alias]"  v-if="type!=='look'"></el-input>
          <span v-else></span>
        </el-form-item>
        <el-form-item :label="item.name" v-if="item.type=='richText'" :prop="item.alias">
          <VueUeditorWrap v-model="form[item.alias]"  :config="myConfig" :destroy="true"  v-if="type!=='look'"></VueUeditorWrap>
          <div  v-else v-html="form[item.alias]"></div>
        </el-form-item>
        <el-form-item  :label="item.name"   v-if="item.type=='child'" :prop="item.alias">
          <div class="add_wrap">
            <el-input style="display: inline-block;width: 200px"  type="text" v-model="input"></el-input>  <el-button type="primary" size="mini" @click="addfaguiList(item.alias)">添加</el-button>
          </div>
          <el-form-item class="ruleItem" :label="itm['tiao_num_name']" v-for="(itm,index) in form[item.alias]">
            <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
              v-model="itm['ruleContent']">
            </el-input>
            <el-checkbox-group size="mini" v-model="itm.functionArray">
              <el-checkbox label="法条变迁" border></el-checkbox>
              <el-checkbox label="新旧对照" border ></el-checkbox>
              <el-checkbox label="关联法条" border ></el-checkbox>
              <el-checkbox label="关联案例" border ></el-checkbox>
              <el-checkbox label="参阅文献" border ></el-checkbox>
            </el-checkbox-group>
            <el-button size="mini" @click="deleteRule(item,index,itm)">删除</el-button>
          </el-form-item>
        </el-form-item>
        <el-form-item :label="item.name" v-if="item.type.includes('join')" :prop="item.alias">
          <div v-if="type!=='look'">
            <el-tag
              class="keyword_tag"
              :key="tag"
              v-for="tag in form[item.alias]"
              closable
              :disable-transitions="false"
              @close="handleClose(tag,item.alias)">
              {{tag}}
            </el-tag>
            <el-input
              class="input-new-tag"
              v-show="item.inputVisible"
              v-model="inputValue"
              :ref="item.alias+'saveTagInput'"
              size="small"
              @keyup.enter.native="handleInputConfirm(item.alias,item)"
              @blur="handleInputConfirm(item.alias,item)"
            >
            </el-input>
            <el-button  v-show="!item.inputVisible" class="button-new-tag" size="small" @click="showInput(0,item)">+ New keyWord</el-button>
          </div>
          <div v-else>
            {{form[item.alias].join(',')}}
          </div>
        </el-form-item>
        <el-form-item :label="item.name" v-if="item.type=='cascader'" :prop="item.alias">
          <el-cascader
            v-if="type!=='look'"
            style="width: 60%"
            v-model="form[item.alias]"
            :options="item.values"
            :props="item.propsValue"
            clearable></el-cascader>
          <span v-else>
            {{getfenlei(form[item.alias],item)}}
          </span>
        </el-form-item>
      </template>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">确定</el-button>
        <template v-if="type=='edit'&&row.isCheck==0">
          <el-button  @click="checkRule(1)">通过</el-button>
          <el-button  @click="checkRule(2)">退回</el-button>
        </template>

        <el-button  @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
  import UploadFile from '@/views/workbench/material_management/components/uploadFile.vue'
  import {queryRuleByRuleName,queryProperty,insertRule,updateRule,deleteRule,analysisWordOne,checkRule} from '@/api/knowledgeBase.js'
  import VueUeditorWrap from 'vue-ueditor-wrap'
  export default {
  name: "PageItem",
  props:{
    type:{},
    row:{

    },
    knowledgeNavigationId:{

    }
  },
  data() {
    return {
      form:{
        faguiList:[],

      },
      clickUpload:false,
      inputVisible:false,
      inputValue:'',
       // editorOption: {
      //   modules: {
      //     toolbar: [
      //       ["bold", "italic", "underline", "strike"], // 加粗 斜体 下划线 删除线
      //       ["blockquote", "code-block"], // 引用  代码块
      //       [{ header: 1 }, { header: 2 }], // 1、2 级标题
      //       [{ list: "ordered" }, { list: "bullet" }], // 有序、无序列表
      //       [{ script: "sub" }, { script: "super" }], // 上标/下标
      //       [{ indent: "-1" }, { indent: "+1" }], // 缩进
      //       // [{'direction': 'rtl'}],                         // 文本方向
      //       [{ size: ["small", false, "large", "huge"] }], // 字体大小
      //       [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题
      //       [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色
      //       [{ font: [] }], // 字体种类
      //       [{ align: [] }], // 对齐方式
      //       ["clean"], // 清除文本格式
      //       ["link", "image", "video"] // 链接、图片、视频
      //     ], //工具菜单栏配置
      //   },
      //   placeholder: '请在这里添加产品描述', //提示
      //   readyOnly: false, //是否只读
      //   theme: 'snow', //主题 snow/bubble
      //   syntax: true, //语法检测
      // },
      myConfig: {
        toolbars: [[
          'fullscreen', 'source', '|', 'undo', 'redo', '|',
          'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc', '|',
          'rowspacingtop', 'rowspacingbottom', 'lineheight', '|',
          'customstyle', 'paragraph', 'fontfamily', 'fontsize', '|',
          'directionalityltr', 'directionalityrtl', 'indent', '|',
          'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', 'touppercase', 'tolowercase', '|',
          'link', 'unlink', 'anchor', '|', 'imagenone', 'imageleft', 'imageright', 'imagecenter', '|',
          'horizontal', 'date', 'time', 'spechars', 'wordimage', '|',
          'inserttable', 'deletetable', 'insertparagraphbeforetable', 'insertrow', 'deleterow', 'insertcol', 'deletecol', 'mergecells', 'mergeright', 'mergedown', 'splittocells', 'splittorows', 'splittocols', 'charts', '|',
          'print', 'preview', 'searchreplace', 'drafts'
        ]],
        imageActionName:'upfile',
        // imageAllowFiles:['jpg','png','gif'],
        imageFieldName:'upFile',
        imageUrlPrefix:'',
        //是否启用元素路径，默认是显示
        elementPathEnabled : false,
        enableAutoSave:false,
        //wordCount
        wordCount: false  ,        //是否开启字数统计
        maximumWords:100000 ,      //允许的最大字符数
        // 编辑器不自动被内容撑高
        autoHeightEnabled: true,
        // 初始容器高度
        initialFrameHeight: 440,
        autoHeightEnabled:false,
        // 初始容器宽度
        initialFrameWidth: '100%',
        // 上传文件接口（这个地址是我为了方便各位体验文件上传功能搭建的临时接口，请勿在生产环境使用！！！）
         serverUrl: `/ip_kg/interface/material/creatematerial?tokenID=${this.$store.getters.token}`,
        // UEditor 资源文件的存放路径，如果你使用的是 vue-cli 生成的项目，通常不需要设置该选项，vue-ueditor-wrap 会自动处理常见的情况，如果需要特殊配置，参考下方的常见问题2
         UEDITOR_HOME_URL: '/UEditor/'
      },
      formState:true,
      checkboxGroup:[],
      input:'第一条',
      queryPropertyList:[],
      rules:{}
    }
  },
  created() {
    this.getData()

  },
  mounted() {



  },
  methods:{
    getUploadFile(e){
      this.analysisWordOne(e.target.files)
    },
    checkRule(isCheck){
      checkRule({knowledgeNavigationId:this.knowledgeNavigationId,id:this.form.id,isCheck}).then(res=>{
        this.$emit('complete',this.type)
      })
    },
    getfenlei(array,item){
      if(!array){
        array=[]
      }
      let arr=this.$commonUtils.getMenuName(item.values,item.propsValue.children)
      return array.map(itm=>arr.find(i=>i[item.propsValue.value]==itm)[item.propsValue.label]).join('/')
    },
    analysisWordOne(file){
      let formData = new FormData()
      for (let item of file){
        formData.append("attachFile", item);
      }
      formData.append("tokenID", this.$store.getters.token);
      formData.append("knowledgeNavigationId", 3);
      analysisWordOne(formData,(e)=>{
        this.percentage = parseInt(e.loaded/e.total*100)
      }).then(async res =>{
        this.percentage = 0
        this.form = res.data

        this.getRules()
      }).catch(() => {
        this.percentage = 0
      })
    },
    deleteRule(item,index,itm){
      if(itm.id){
        deleteRule(itm).then(res=>{
          this.form[item.alias].splice(index,1)
          // this.$emit('updateList')
        })
      }else{
        this.form[item.alias].splice(index,1)
      }

    },
    getRules(){
      this.queryPropertyList.forEach(item=>{
        if(item.must){
          this.rules[item.alias]={required:true, message: `请填写${item.name}`, trigger: ['change','blur'] }
        }
      })
      this.formState=false
      this.$nextTick(()=>{
             this.formState=true
             })
      // this.$nextTick(()=>{
      //   this.formState=true
      //   this.$nextTick(()=>{
      //     console.log(this.$refs.form.el);
      //     Sortable.create(this.$refs.form.el, {
      //       //  指定父元素下可被拖拽的子元素
      //       draggable: ".ruleItem",
      //       onEnd({newIndex, oldIndex}) {
      //
      //       }
      //     })
      //   })
      // })
    },
    getData(){
      if(this.type=='add'){
        queryProperty({knowledgeNavigationId:this.knowledgeNavigationId,operate:'add'}).then(res=>{
          this.queryPropertyList=res.data
          this.form={
            ruleArray:[]
          }
          this.getRules()
        })
      }
      if(this.type=='edit'){
        Promise.all( [ queryProperty({knowledgeNavigationId:this.knowledgeNavigationId,operate:'modify'}) ,queryRuleByRuleName({knowledgeNavigationId:this.knowledgeNavigationId,id:this.row.id,ruleName:this.row.ruleName})]).then(res=>{
          this.queryPropertyList=res[0].data
          this.form=res[1].data
          this.getRules()
          // this.form={
          //   faguiList:[]
          // }
        })
      }
      if(this.type=='look'){
        Promise.all( [ queryProperty({knowledgeNavigationId:this.knowledgeNavigationId,operate:'look'}) ,queryRuleByRuleName({knowledgeNavigationId:this.knowledgeNavigationId,id:this.row.id,ruleName:this.row.ruleName})]).then(res=>{
          this.queryPropertyList=res[0].data
          this.form=res[1].data
          // this.getRules()
          // this.form={
          //   faguiList:[]
          // }
        })
      }
    },
    handleClose(tag,alias) {
      this.form[alias].splice(this.form[alias].indexOf(tag), 1);
    },

    showInput(index,item) {
      this.$set(item,'inputVisible',true)
      // item.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs[item.alias+'saveTagInput'][index].$refs.input.focus();
      });
    },

    handleInputConfirm(alias,item) {
      let inputValue = this.inputValue;
      if (inputValue) {
        if(!this.form[alias]){
          this.form[alias]=[]
          this.form[alias].push(inputValue);
        } else {
          this.form[alias].push(inputValue);
        }
      }
      item.inputVisible = false;
      this.inputValue = '';
    },
   async onSubmit(){
     const [ err, data] = await this.$commonUtils.awaitWrap(this.$refs.form.validate())
     if (!data) {
       return
     }
     if(this.type==='add'){
       insertRule({...{knowledgeNavigationId:this.knowledgeNavigationId},...this.form}).then(res=>{
         this.$emit('complete',this.type)
       })
     }else {
       updateRule({...{knowledgeNavigationId:this.knowledgeNavigationId},...this.form}).then(res=>{
         this.$emit('complete',this.type)
       })
     }
    },
    cancel(){
      this.$emit('complete')
    },
    addfaguiList(prop){
      console.log(prop);
      this.form[prop].push({tiao_num_name:this.input,functionArray:this.checkboxGroup})
    }
  },
  components:{
    VueUeditorWrap,UploadFile
  }
}
</script>

<style lang="scss" scoped>
  .add_wrap{
    margin-bottom: 10px;
  }
 .editor /deep/ .ql-editor {
    line-height: normal !important;
    height: 400px;
  }
  /*.ql-snow .ql-tooltip[data-mode=link]::before {*/
  /*  content: "请输入链接地址:";*/
  /*}*/
  /*.ql-snow .ql-tooltip.ql-editing a.ql-action::after {*/
  /*  border-right: 0px;*/
  /*  content: '保存';*/
  /*  padding-right: 0px;*/
  /*}*/

  /*.ql-snow .ql-tooltip[data-mode=video]::before {*/
  /*  content: "请输入视频地址:";*/
  /*}*/

  /*.ql-snow .ql-picker.ql-size .ql-picker-label::before,*/
  /*.ql-snow .ql-picker.ql-size .ql-picker-item::before {*/
  /*  content: '14px';*/
  /*}*/
  /*.ql-snow .ql-picker.ql-size .ql-picker-label[data-value=small]::before,*/
  /*.ql-snow .ql-picker.ql-size .ql-picker-item[data-value=small]::before {*/
  /*  content: '10px';*/
  /*}*/
  /*.ql-snow .ql-picker.ql-size .ql-picker-label[data-value=large]::before,*/
  /*.ql-snow .ql-picker.ql-size .ql-picker-item[data-value=large]::before {*/
  /*  content: '18px';*/
  /*}*/
  /*.ql-snow .ql-picker.ql-size .ql-picker-label[data-value=huge]::before,*/
  /*.ql-snow .ql-picker.ql-size .ql-picker-item[data-value=huge]::before {*/
  /*  content: '32px';*/
  /*}*/

  /*.ql-snow .ql-picker.ql-header .ql-picker-label::before,*/
  /*.ql-snow .ql-picker.ql-header .ql-picker-item::before {*/
  /*  content: '文本';*/
  /*}*/
  /*.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,*/
  /*.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {*/
  /*  content: '标题1';*/
  /*}*/
  /*.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,*/
  /*.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {*/
  /*  content: '标题2';*/
  /*}*/
  /*.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,*/
  /*.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {*/
  /*  content: '标题3';*/
  /*}*/
  /*.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,*/
  /*.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {*/
  /*  content: '标题4';*/
  /*}*/
  /*.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,*/
  /*.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {*/
  /*  content: '标题5';*/
  /*}*/
  /*.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,*/
  /*.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {*/
  /*  content: '标题6';*/
  /*}*/

  /*.ql-snow .ql-picker.ql-font .ql-picker-label::before,*/
  /*.ql-snow .ql-picker.ql-font .ql-picker-item::before {*/
  /*  content: '标准字体';*/
  /*}*/
  /*.ql-snow .ql-picker.ql-font .ql-picker-label[data-value=serif]::before,*/
  /*.ql-snow .ql-picker.ql-font .ql-picker-item[data-value=serif]::before {*/
  /*  content: '衬线字体';*/
  /*}*/
  /*.ql-snow .ql-picker.ql-font .ql-picker-label[data-value=monospace]::before,*/
  /*.ql-snow .ql-picker.ql-font .ql-picker-item[data-value=monospace]::before {*/
  /*  content: '等宽字体';*/
  /*}*/
  .keyword_tag{
    margin-right: 10px;
    cursor: pointer;
  }
  .uploadFile_wrap{
    display: flex;
    justify-content: flex-end;
    margin-bottom: 10px;
  }
</style>
