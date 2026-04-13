<template>
  <div class="comment">
      <div class="comment_top">
<!--        <div>{{$store.getters.name}}:</div>-->
        <div class="textarea_wrap">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="写下你的评论"
            v-model="textarea"
            @focus="textareaState=true">
          </el-input>
        </div>


<!--        <el-input-->
<!--          ref="textarea"-->
<!--          type="textarea"-->
<!--          autosize-->
<!--          :placeholder="placeholder"-->
<!--          v-model="textarea"/>-->
        <div class="comm_button" v-if="textareaState">
          <el-button size="mini" round @click="addComment" type="primary">发布</el-button>
          <el-button size="mini" round @click="textareaState=false" >取消</el-button>
        </div>

      </div>

    <div class="comment_conent">
      <div v-for="item in list">
        <div class="comment_wrap">
          <img :src="item.fromIcon" alt="">
          <div class="content_warp">
            <div class="name">{{item.fromName}}</div>
            <div>
              <span class="sj_text">{{item.createDate}}</span>
            </div>
            <div class="content">{{item.content}}</div>
            <div class="reply_wrap">
              <svg-icon class="reply" @click="reply(item,1)" icon-class="评论"/>
<!--              <span class="reply"  @click="reply(item,1)">回复</span>-->
            </div>
            <div v-if="item.replyState">
              <div class="textarea_wrap">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4}"
                  placeholder="写下你的评论"
                  v-model="item.replycontent"
                >
                </el-input>
              </div>
              <div class="comm_button">
                <el-button size="mini" round @click="replyComment(item,1)" type="primary">发布</el-button>
                <el-button size="mini" round @click="item.replyState=false" >取消</el-button>
              </div>
            </div>
          </div>
        </div>

        <div class="comment_conent_chilren" v-for="itm in item.docReplyArray">
          <template v-if="itm.replyId==item.id">
            <div class="comment_wrap">
            <img :src="itm.fromIcon" alt="">
            <div class="content_warp">
              <div class="name">{{itm.fromName}}</div>
              <div>
                <span class="sj_text">{{itm.createDate}}</span>
              </div>
              <div class="content">{{itm.content}}</div>
              <div class="reply_wrap">
                <svg-icon class="reply" @click="reply(itm,2)" icon-class="评论"/>
                <!--              <span class="reply"  @click="reply(item,1)">回复</span>-->
              </div>
              <div v-if="itm.replyState">
                <div class="textarea_wrap">
                  <el-input
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 4}"
                    placeholder="写下你的评论"
                    v-model="itm.replycontent"
                  >
                  </el-input>
                </div>
                <div class="comm_button">
                  <el-button size="mini" round @click="replyComment(itm,2)" type="primary">发布</el-button>
                  <el-button size="mini" round @click="itm.replyState=false" >取消</el-button>
                </div>
              </div>
            </div>
            </div>
<!--            <div>-->
<!--              <span class="name">{{itm.fromName}}：</span><span class="content">{{itm.content}}</span>-->
<!--            </div>-->
<!--            <div>-->
<!--              <span class="sj_text">{{itm.createDate}}</span><span class="reply"  @click="reply(itm,2)">回复</span>-->
<!--            </div>-->
          </template>
          <template v-if="itm.replyId!==item.id">
            <div class="comment_wrap">
            <img :src="itm.fromIcon" alt="">
            <div class="content_warp">
              <div class="name">{{itm.fromName}}</div>
              <div>
                <span class="sj_text">{{itm.createDate}}</span>
              </div>
              <div class="content"><span style="cursor: pointer;color:#eb7350;margin-right: 5px">@{{itm.toName}}</span>{{itm.content}}</div>
              <div class="reply_wrap">
                <svg-icon class="reply" @click="reply(itm,2)" icon-class="评论"/>
                <!--              <span class="reply"  @click="reply(item,1)">回复</span>-->
              </div>
              <div v-if="itm.replyState">
                <div class="textarea_wrap">
                  <el-input
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 4}"
                    placeholder="写下你的评论"
                    v-model="itm.replycontent"
                  >
                  </el-input>
                </div>
                <div class="comm_button">
                  <el-button size="mini" round @click="replyComment(itm)" type="primary">发布</el-button>
                  <el-button size="mini" round @click="itm.replyState=false" >取消</el-button>
                </div>
              </div>
            </div>
            </div>
<!--            <div>-->
<!--              <span class="name">{{itm.fromName}}：</span>回复 <span style="cursor: pointer;color:#eb7350">@{{itm.toName}}</span>:<span class="content">{{itm.content}}</span>-->
<!--            </div>-->
<!--            <div>-->
<!--              <span class="sj_text">{{itm.createDate}}</span><span class="reply"  @click="reply(itm,2)">回复</span>-->
<!--            </div>-->
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {  updateDocCensus,addComment } from '@/api/knowledgeBase'
export default {
  props:{
    pageData:{

    }
  },
  name: "comment",
  data() {
    return {
      list:[],
      textarea:'',
      placeholder:'请输入内容',
      replyData:{},
      replyFlag:false,
      replyType:1,
      textareaState:false
    }
  },
  created(){
    this.list=this.pageData.docCommentList
  },
  methods: {
    addComment(){
      addComment({stId:this.pageData.stId,docId:this.pageData.id,content:this.textarea}).then(res=>{
        this.list.unshift(res.data)
      })
    },
    replyComment(replyData,replyType){
      addComment({commentId:replyData.commentId,toUid:replyData.fromUid,content:replyData.replycontent,replyId:replyData.id,replyType:replyType}).then(res=>{
        replyData.replyState=false
        this.$emit('addNum',1)
        let data=this.list.find(item=>item.id==res.data.commentId)
        if(data.id==res.data.replyId){
          data.docReplyArray.push(res.data)
        } else {
          let insertIndex;
          let index=data.docReplyArray.findIndex(item=>item.id==res.data.replyId)
          for(var i=index;i<data.docReplyArray.length;i++){
            if(data.docReplyArray[index].replyId!==res.data.replyId){
              insertIndex=i
              break;
            }
          }
          if(insertIndex!=undefined){
            data.docReplyArray.splice(insertIndex+1,0,res.data)
          }else {
            data.docReplyArray.push(res.data)
          }
        }
      })
    },
    reply(item,type){
      this.$set(item,'replyState',true)
      // this.textarea=``
      // this.placeholder=`@${item.fromName}`
      // this.$refs.textarea.focus()
      // this.replyData=item
      // this.replyFlag=true
      // this.replyType=type
    },
  }
}
</script>

<style lang="scss" scoped>
  .comment{
    padding: 10px;
  }
  .comment_top{
    /*display: flex;*/
    .textarea_wrap{
      padding: 10px;
      .el-input{
        width: 100%;
      }
    }

  }
  .comment_conent{
    font-size: 12px;
    /*background: #c9c9c9;*/
    .reply:hover{
      color: #eb7350;
      cursor: pointer;
    }
    .name{
      font-size: 14px;
      color: #333;
    }
    .content{
      margin-top: 8px;
      font-size: 14px;
    }
    .sj_text{
      margin-top: 5px;
      color: #808080;

      line-height: 12px;
    }
    .reply_wrap{
      margin-top: 8px;
    }
    .reply{
      line-height: 12px;
      color: #c9c9c9;
    }
    .comment_conent_chilren{
      margin-left: 50px;
      background: #fff;
    }
  }
  .comment_wrap{
    display: flex;
    img{
      width: 40px;
      height: 40px;
      border: 1px solid #eee;
      border-radius: 50%;
      margin-right: 10px;
    }

  }
  .content_warp{
    width: 100%;
  }
  .comm_button{
    margin-top: 10px;
    display: flex;
    place-content: flex-end;
  }
</style>
