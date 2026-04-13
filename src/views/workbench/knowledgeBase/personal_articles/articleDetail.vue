<template>
  <div class="articleDetail">
    <h4 class="title">标题</h4>
    <el-input v-model="form.title"></el-input>
    <div class="title">内容</div>
    <VueUeditorWrap v-model="form.content"  :config="myConfig" :destroy="true"></VueUeditorWrap>
    <div class="title">关键词</div>
    <div>
      <el-tag
        :key="tag"
        v-for="tag in form.keyWordArray"
        closable
        :disable-transitions="false"
        @close="handleClose(tag,'keyWordArray')">
        {{tag}}
      </el-tag>
      <el-input
        class="input-new-tag"
        v-if="keyWordArrayState"
        v-model="inputValue"
        ref="saveTagInput"
        size="small"
        @keyup.enter.native="handleInputConfirm('keyWordArray')"
        @blur="handleInputConfirm('keyWordArray')"
      >
      </el-input>
      <el-button v-else class="button-new-tag" size="small" @click="showInput('keyWordArray')"> + </el-button>
    </div>
    <div class="title">作者</div>
    <div>
      <el-tag
        :key="tag"
        v-for="tag in form.authorArray"
        closable
        :disable-transitions="false"
        @close="handleClose(tag,'keyWordArray')">
        {{tag}}
      </el-tag>
      <el-input
        class="input-new-tag"
        v-if="authorArrayState"
        v-model="inputValue"
        ref="saveTagInput"
        size="small"
        @keyup.enter.native="handleInputConfirm('authorArray')"
        @blur="handleInputConfirm('authorArray')"
      >
      </el-input>
      <el-button v-else class="button-new-tag" size="small" @click="showInput('authorArray')"> + </el-button>

    </div>
    <div class="title">分类</div>
    <el-cascader
      style="width: 500px"
      v-model="form.contentsArray"
      :options="options"
      :props="props"
      clearable></el-cascader>
    <div class="button_wrap">
      <el-button type="primary" @click="onSubmit">确定</el-button>
      <el-button  @click="cancel">取消</el-button>
    </div>
  </div>
</template>

<script>
import {queryContentsDelTitle,insertRule,updateRule,queryRuleByRuleName} from '@/api/knowledgeBase.js'
import VueUeditorWrap from 'vue-ueditor-wrap'
export default {
  name: "articleDetail",
  data() {
    return {
      form: {
        title:'',
        content:'',
        keyWordArray:[],
        authorArray:[],
        contentsArray:[]
      },
      options:[],
      props:{
        children: "childArray",
        label: "name",
        parent: "parentId",
        value: "id",
      },
      knowledgeNavigationId:3,
      keyWordArrayState: false,
      authorArrayState:false,
      inputValue: '',
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
        //是否启用元素路径，默认是显示
        elementPathEnabled : false,
        enableAutoSave:false,
        //wordCount
        wordCount: false  ,        //是否开启字数统计
        maximumWords:100000 ,      //允许的最大字符数
        // 编辑器不自动被内容撑高
        autoHeightEnabled: true,
        // 初始容器高度
        initialFrameHeight: 400,
        // 初始容器宽度
        initialFrameWidth: '100%',
        // 上传文件接口（这个地址是我为了方便各位体验文件上传功能搭建的临时接口，请勿在生产环境使用！！！）
        //   serverUrl: 'http://35.201.165.105:8000/controller.php',
        serverUrl: `/ip_kg/interface/material/creatematerial?tokenID=${this.$store.getters.token}`,
        // UEditor 资源文件的存放路径，如果你使用的是 vue-cli 生成的项目，通常不需要设置该选项，vue-ueditor-wrap 会自动处理常见的情况，如果需要特殊配置，参考下方的常见问题2
        UEDITOR_HOME_URL: '/UEditor/'
      }
    }
  },
  created() {
    this.queryContentsDelTitle()
    if(this.$route.params.id){
      this.queryRuleByRuleName(this.$route.params.id)
    }else {
      this.form.authorArray=[this.$store.getters.name]
    }
  },
  methods:{
    queryRuleByRuleName(id){
      queryRuleByRuleName({knowledgeNavigationId:3,id}).then(res=>{
        this.form=res.data
      })
    },
    queryContentsDelTitle(){
      queryContentsDelTitle({ knowledgeNavigationId:3 }).then(res=>{
        this.options=res.data
      })
    },
    handleClose(tag,type) {
      this.form[type].splice(this.dynamicTags.indexOf(tag), 1);
    },

    showInput(type) {
      this[type+'State'] = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    cancel(){
      this.$router.go(-1)
    },
    handleInputConfirm(type) {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.form[type].push(inputValue);
      }
      this[type+'State'] = false;
      this.inputValue = '';
    },
    infoRules(){
      if(!this.form.title){
        this.$message.error('请填写标题')
        return
      }
      if(!this.form.contentsArray.length){
        this.$message.error('请选择分类')
        return
      }
      return true
    },
    async onSubmit(){
      if(!this.infoRules()){
        return
      }
      // const [ err, data] = await this.$commonUtils.awaitWrap(this.$refs.form.validate())
      // if (!data) {
      //   return
      // }
      if(this.$route.params.type=='1'){
        insertRule({...{knowledgeNavigationId:this.knowledgeNavigationId},...this.form}).then(res=>{
          this.cancel()
        })
      }else {
        updateRule({...{knowledgeNavigationId:this.knowledgeNavigationId},...this.form}).then(res=>{
          this.cancel()
        })
      }
    },
  },
  components:{
    VueUeditorWrap
  }
}
</script>

<style lang="scss" scoped>
  .articleDetail{
    padding: 20px;
  }
  .el-tag + .el-tag {
    margin-right: 10px;
  }
  .button-new-tag {
    margin-right: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-right: 10px;
    vertical-align: bottom;
  }
  .title{
    color: #235;
    height: 30px;
    line-height: 30px;
    text-decoration: none;
  }
  .button_wrap{
    display: flex;
    justify-content: center;
    margin-top: 10px;
  }
</style>
