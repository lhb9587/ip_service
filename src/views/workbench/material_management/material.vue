<template>
    <div class="materialWarp">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>资料管理</el-breadcrumb-item>
        <transition-group name="breadcrumb">
          <el-breadcrumb-item v-for="item in breadcrumbList" @click.native="clickbreadcrumb(item)" :key="item.id">{{item.data.name}}</el-breadcrumb-item>
        </transition-group>
      </el-breadcrumb>
      <header>
        <uploadFile :clickUpload="clickUpload" @getUploadFile="getUploadFile" @changeClick="clickUpload=false"></uploadFile>
        <h4>客户资料</h4>
        <el-input
          placeholder="请输入客户"
          v-model="filterText">
        </el-input>
      </header>
      <div class="content_warp">
        <div class="aside">
          <el-tree
            ref="tree"
            :props="props"
            :load="loadNode"
            lazy
            node-key="id"
            :highlight-current="true"
            :filter-node-method="filterNode"
            @node-expand="handleNodeExpand"
            @node-collapse="handleNodeCollapse"
            @node-click="handleNodeClick"></el-tree>
          <el-button ref="buttonLookMore" @click="append" style="width:100%" v-show="defaultCustList.length<customTotal">查看更多</el-button>
        </div>
        <div class="section">
          <div class="nameWarp" v-show="level==0" v-loadmore="infiniteScroll"  style="width:100%;position: absolute;padding: 20px;box-sizing: border-box;">
            <el-table
              class="scrollTable"
              :data="pageList1"
              border
              height="100%"
              empty-text="暂无数据"
              highlight-current-row
              current-row-key
            >
              <el-table-column type="index" width="50" label="序号" align="left">
                <template slot-scope="scope">
                  <span>{{scope.$index+1}}</span>
                </template>
              </el-table-column>
              <el-table-column v-for='item in custTitleList' :label="item.title" :prop="item.value"  align="left" >
                <template slot-scope="{row}">
                  <span @click.stop="jumpNext(row.postId,'','',row.name,)">{{row[item.value]}}</span>
                </template>
              </el-table-column>
            </el-table>
            <!--</div>-->
          </div>
          <div class="nameWarp" v-if="level==1">
            <!--<li v-for="item,index in pageList3" :key="item.name+index" @click.stop="jumpNext(curCustId,item.postId)">-->
              <!--{{item.name}}-->
            <!--</li>-->
            <div style="position: absolute;
    width: 100%;
    padding: 20px;
    box-sizing: border-box;" v-if="breadcrumbList&&breadcrumbList.length&&breadcrumbList[0]">
              <el-table
                :data="pageList3"
                border
                fit
                max-height="100%"
                empty-text="暂无数据"
                highlight-current-row
                current-row-key
              >
                <el-table-column type="index" width="50" label="序号" align="left">
                  <template slot-scope="scope">
                    <span>{{scope.$index+1}}</span>
                  </template>
                </el-table-column>
                <el-table-column v-for='item in appTitleList' :label="item.title" :prop="item.value"  align="left" >
                  <template slot-scope="{row}">
                    <span style="cursor: pointer" @click.stop="jumpNext(curCustId,row.postId)">{{row[item.value]}}</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
          <div  v-if="level===2"
                :style="{'height': '100%','background':hoverState?'RGBA(32,159,255,0.06)':'#fff','overflow':'auto','padding':'20px'}"
                @drop.stop.prevent="enentDrop($event)"
                @dragover.stop.prevent="hoverState=true"
                @dragleave.stop.prevent="hoverState=false"
                @dragenter.stop.prevent="hoverState=true">
            <span style="font-size: 12px">您可将文件拖放到具体的资料类型文件夹处，或者将文件拖放到页面空白处新建资料库<span style="color: #409EFF;cursor: pointer;" @click="clickUpload=true">浏览</span></span>

            <div v-if="breadcrumbList&&breadcrumbList.length">
                          <div class="dragPage"
                               v-for="item in breadcrumbList[breadcrumbList.length-1].childNodes"
                          >
                            <div class="packageName">
              <!--                <img width="100%" src="@/assets/资料管理icon/文件夹.png" @click.stop.prevent="jumpNext(curCustId,curApplicantId,itm.postId,itm.name,item.postId)"/>-->
                              <span style="cursor: pointer"  @click.stop.prevent="jumpNext(curCustId,curApplicantId,'',item.data.name,item.data.postId)">{{item.data.name}}</span>
                            </div>
                          </div>
            </div>
          </div>
          <div  v-if="level===3"
                :style="{'height': '100%','background':hoverState?'RGBA(32,159,255,0.06)':'#fff','overflow':'auto','padding':'20px'}"
                @drop.stop.prevent="enentDrop($event)"
                @dragover.stop.prevent="hoverState=true"
                @dragleave.stop.prevent="hoverState=false"
                @dragenter.stop.prevent="hoverState=true">
            <span style="font-size: 12px">您可将文件拖放到具体的资料类型文件夹处，或者将文件拖放到页面空白处新建资料库<span style="color: #409EFF;cursor: pointer;" @click="clickUpload=true">浏览</span></span>

              <div class="dragPage"
                   v-for="item in [breadcrumbList[breadcrumbList.length-1].data]"
                  >
<!--                <div class="packageName">{{item.name}}</div>-->
                <div class="fileWarp">
                  <div class="fileItem" v-for="itm in item.zones" :key="itm.id">
                    <el-upload
                      @drop.native.stop.prevent=""
                      @dragover.native.stop.prevent=""
                      @dragleave.native.stop.prevent=""
                      @dragenter.native.stop.prevent=""
                      class="upload-demo"
                      drag
                      multiple
                      name='attachFile'
                      :data="getFileData(curCustId,curApplicantId,item.postId,itm.name)"
                      :action="creatematerialUrl"
                      :on-success="()=>{uploadSuccess(item.postId)}"
                    >
                      <img width="100%" src="@/assets/资料管理icon/文件夹.png" @click.stop.prevent="jumpNext(curCustId,curApplicantId,itm.postId,itm.name,item.postId)"/>
                    </el-upload>
                    <span class="fileName">{{itm.name}}</span>
                  </div>
                </div>
              </div>
            <!--</div>-->
          </div>
          <el-tabs type="border-card" v-if="level===4" :style="{'height': '100%'}">

            <el-tab-pane :label="`资料存档(${pageList4.filter(item=>item.fromCase==2).length})`" :style="{'height': '100%'}">
              <div
                   :style="{'height': '100%','background':hoverState?'RGBA(32,159,255,0.06)':'#fff','overflow':'auto','padding':'20px 0 10px 0' }"
                   @drop.stop.prevent="enentDrop($event)"
                   @dragover.stop.prevent="hoverState=true"
                   @dragleave.stop.prevent="hoverState=false"
                   @dragenter.stop.prevent="hoverState=true">
                <div style="margin-left: 20px">文件列表 <span style="margin-left: 50px;font-size: 12px">您可将文件拖放到页面中以添加附件 ，或者<span style="margin-left:10px;color: #409EFF;cursor: pointer" @click="clickUpload=true">浏览</span></span></div>
                <materialPage :curPageList="pageList4.filter(item=>item.fromCase==2)" @updateMaterial="updateMaterial"></materialPage>
              </div>
            </el-tab-pane>
            <el-tab-pane :label="`案件存档(${pageList4.filter(item=>item.fromCase==1).length})`" :style="{'height': '100%'}">

              <div
                :style="{'height': '100%','background':hoverState?'RGBA(32,159,255,0.06)':'#fff','overflow':'auto','padding':'20px 0 10px 0' }"
                >
                <materialPage :curPageList="pageList4.filter(item=>item.fromCase==1)" @updateMaterial="updateMaterial"></materialPage>
              </div>
            </el-tab-pane>
          </el-tabs>

        </div>
      </div>
      <el-dialog
        title="选择文件类型:"
        :visible.sync="selectSortIdState2"
        width="40%"
      >
        <el-form label-width="136px">
          <el-form-item required label="一级目录:" class="twoInputWarp">
            <el-select v-model="selectSort" clearable filterable placeholder="请选择" @change="sortSelectChange" >
              <el-option
                v-for="item in selectSortOptions"
                :key="item.mSortId"
                :label="item.mClassName"
                :value="item.mSortId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item required label="二级目录:" class="twoInputWarp">
            <Autocomplete v-model="sortName" type="sortName" :list="sortNameList"> </Autocomplete>
          </el-form-item>
          <el-form-item  label="资料类型:" class="twoInputWarp">
            <el-select v-model="materialTypeId" clearable filterable placeholder="请选择" >
              <el-option
                v-for="item in materialTypeList"
                :key="item.materialTypeId"
                :label="item.typeName"
                :value="item.materialTypeId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <p class="comfimSortButton">
          <el-button type="primary" @click="comfimSortSelect">确定</el-button>
        </p>
      </el-dialog>
      <el-dialog
        title="选择文件类型:"
        :visible.sync="selectSortIdState"
        width="40%"
        >
        <el-form label-width="136px">
<!--          <el-form-item required label="一级目录:" class="twoInputWarp">-->
<!--            <el-select v-model="selectSort" clearable filterable placeholder="请选择" @change="sortSelectChange" >-->
<!--              <el-option-->
<!--                v-for="item in selectSortOptions"-->
<!--                :key="item.mSortId"-->
<!--                :label="item.mClassName"-->
<!--                :value="item.mSortId">-->
<!--              </el-option>-->
<!--            </el-select>-->
<!--          </el-form-item>-->
          <el-form-item required label="二级目录:" class="twoInputWarp">
            <Autocomplete v-model="sortName" type="sortName" :list="sortNameList"> </Autocomplete>
          </el-form-item>
          <el-form-item  label="资料类型:" class="twoInputWarp">
            <el-select v-model="materialTypeId" clearable filterable placeholder="请选择" >
              <el-option
                v-for="item in materialTypeList"
                :key="item.materialTypeId"
                :label="item.typeName"
                :value="item.materialTypeId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <p class="comfimSortButton">
          <el-button type="primary" @click="comfimSortSelect">确定</el-button>
        </p>
      </el-dialog>
    </div>
</template>

<script>

import materialPage from './components/materialPage'
import {fetchList} from "@/api/customerList";
import {queryAppInfoUrl} from "@/api/caseDetail";
import {queryMaterialBySort,queryMaterialList,querySortList,queryMaterialTypeByDocId} from '@/api/caseList'
import {creatematerialUrl} from '@/api/serviceApi.config.js'
import { creatematerial } from '@/api/caseList'
import uploadFile from './components/uploadFile'
import Vue from 'vue'
Vue.directive('loadmore', {
  bind(el, binding) {
    const selectWrap = el.querySelector('.el-table__body-wrapper')
    selectWrap.addEventListener('scroll', function() {
      let sign = 100
      const scrollDistance = this.scrollHeight - this.scrollTop - this.clientHeight
      if (scrollDistance <= sign) {
        binding.value()
      }
    })
  }
})
export default {
  name: "material",
  data() {
    return {
      clickUpload:false,
      postId:'',
      filterText:'',
      props: {
        id: '',
        label: 'name',
        children: 'zones',
        isLeaf: 'leaf',
      },
      selectSortIdState2:false,
      creatematerialUrl,
      level:0,
      pageList1:[],
      pageList2:[],
      // pageList3:[],
      pageList4:[],
      defaultCustList:[],
      curCustId:'',
      curApplicantId:'',
      curSortId:'',
      selectSortIdState:false,
      selectSort:'',
      selectSortOptions:[],
      sortName:'',
      sortNameList:[],
      curFile:'',
      curTreeId:'',
      breadcrumbList:[],
      materialTypeList:[],
      materialTypeId:null,
      curApplicantIdList:[],
      custListNumber:0,
      curPageListNumber:100,
      hoverState:false,
      node:'',
      resolve:'',
      customPageNo:1,
      customTotal:0,
      custTitleList:[
        {'title':'客户名称','value':'name'},{'title':'英文客户名称','value':'fullnameEn'},{"title":"国籍","value":"country" },
        {"title":"主体法律性质","value":"legalNature" },{"title":"客户介绍人","value":"custIntroductor" },{"title":"行业","value":"induNameStr" },{"title":"合作状态","value":"curStatusStr" },{"title":"创建日期","value":"createTime" }],
      appTitleList:[{'title':'申请人名称','value':'name'},{'title':'申请人英文名称','value':'applicantEnName'},{'title':'主体法律性质','value':'appType'},{'title':'国籍','value':'country'},{'title':'创建日期','value':'createDate'}]
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
      this.level = 0
      this.customPageNo = 1
      this.$nextTick(()=>{
        // if(!(document.getElementsByClassName('el-tree-node').length-document.getElementsByClassName('is-hidden').length)){
          this.loadNode(this.node,this.resolve,'search',val)
        // }
      })
    },

    breadcrumbList:{
      handler(n,o){

        if(this.level==0&&this.breadcrumbList.length){
          // console.log(this.breadcrumbList[0]);
          // this.pageList1=this.getNodeListData(this.breadcrumbList[0])
        }

        if(this.level==1&&this.breadcrumbList.length){
          // this.pageList3=this.getNodeListData(this.breadcrumbList[0])
          // console.log(JSON.parse(JSON.stringify(this.pageList3)),this.breadcrumbList);
        }

      },
      deep:true
    },
    level(){
      // if(this.level==1&&this.breadcrumbList.length){
      //   this.pageList3=this.getNodeListData(this.breadcrumbList[0])
      //   console.log(JSON.parse(JSON.stringify(this.pageList3)),this.breadcrumbList);
      // }
    },
    'pageList3':{
      handler(n,o){
        console.log(n, o,1);
      },
      deep: true
    }
  },
  mounted() {
    this.queryMaterialTypeByDocId();
  },
  computed:{
    pageList3(){
      if(this.level==1&&this.breadcrumbList.length){
        return this.getNodeListData(this.breadcrumbList[0])
      }
    }
  },
  methods: {
    queryMaterialTypeByDocId(){
      queryMaterialTypeByDocId().then(res=>{
        this.materialTypeList=res.data
      })
    },
    enentDrop(e){
      e.stopPropagation();
      e.preventDefault();
      this.hoverState=false
      this.curFile=e.dataTransfer.files
      if(this.level==4){
        this.creatematerial()
        return
      }
      if(this.level==2){
        this.selectSortIdState2=true
        this.querySortList()
        return;
      }
      this.selectSortIdState=true
      this.querySortList(1)
    },
    getUploadFile(e){
      let arr=[]
      for(var i=0;i< e.target.files.length;i++){
        arr.push( e.target.files[i]);
      }

      this.curFile=arr
      if(this.level==4){
        this.creatematerial()
        return
      }
      if(this.level==2){
        this.selectSortIdState2=true
        this.querySortList()
        return;
      }
      this.selectSortIdState=true
      this.querySortList(1)
    },
    creatematerial(){
      let formData = new FormData()
      for(var i=0;i<this.curFile.length;i++){
        formData.append("attachFile", this.curFile[i]);
      }
      formData.append("custId", this.curCustId);
      formData.append("applicantId", this.curApplicantId);
      formData.append("tokenID", this.$store.getters.token);
      if(this.level>2){
        formData.append("sortId", this.breadcrumbList[2].data.postId);
      }else {
        formData.append("sortId", this.curSortId);
      }

      formData.append("sortName", this.sortName);
      if(this.materialTypeId){
        formData.append("materialTypeId",this.materialTypeId);
      }
      formData.append("fromCase",2);
      creatematerial(formData).then(async response=>{
        if(this.level==4){
          this.updateMaterial(true)
        }
        if(this.level==2||this.level==3){
          const arr = await this.queryMaterialBySort(this.curApplicantId)

          const sortList= arr.data.map(item=>({id:'2'+item.mSortId,postId:item.mSortId,level:2, name:item.mClassName+`(${item.childList.length})`,zones:item.childList.map(itm=>({
              id:'3'+itm.sortId,
              postId:itm.sortId,
              name:itm.sortName+`(${itm.fileCount})`,
              level:3,
              fileCount:itm.fileCount,
              leaf:true
            }))})).filter(item=>item.name!=null)
          let Tnode=this.$refs.tree.root.childNodes.find(Tnode=>Tnode.data.postId==this.curCustId).childNodes.find(Tnode=>Tnode.data.postId==this.curApplicantId)
          if(sortList.length!==Tnode.childNodes.length){
            this.appendDom(sortList[sortList.length-1],Tnode)
            this.$nextTick(()=>{
              this.getLeafDom(this.$refs.tree,Tnode.id)
            })
          } else {
            let data={}
            let nodePostId=null
            sortList.forEach(item=>{
              this.breadcrumbList[1].childNodes.map(node=>node.data).forEach(itm=>{
                if(item.postId===itm.postId){
                  if(item.zones.length!==itm.zones.length){
                    this.$set(Tnode.childNodes.find(i=>i.data.postId===itm.postId).data,'name',item.name)
                    data=item.zones.find(i=>!itm.zones.map(i=>i.postId).includes(i.postId))
                    nodePostId=item.postId
                    this.appendDom(data,Tnode.childNodes.find(item => item.data.postId === nodePostId))
                  } else {
                    item.zones.forEach(i=>{
                      itm.zones.forEach(ii=>{
                        if(i.postId===ii.postId){
                          if(i.fileCount!==ii.fileCount){
                            this.getLeafDom(this.$refs.tree, Tnode.childNodes.find(node => node.data.postId === item.postId).childNodes.find(nodeleaf=>nodeleaf.data.postId==i.postId).id,i.fileCount)
                          }
                        }
                      })
                    })
                  }
                }
              })
            })
          }
        this.$set(this.breadcrumbList,1,Tnode)
         // this.pageList3=sortList
         //  console.log(this.pageList3);
          // this.updatePageList3(sortList)
        }
      })
    },
    appendDom(data,Tnode){
      this.customPageNo++
      this.$refs.tree.append(data,Tnode)
    },
    jumpNext(custId,applicantId,sortId,name,mSortId){
      if(mSortId) {
        this.curSortId = mSortId
        if(this.level==3){
          this.sortName = name.replace(/[(]\d+[)]/, '')
        }

      }

      this.$refs.tree.$children.forEach(item=>{
        if(item.node.data.postId==custId){
          if(custId && !applicantId && !sortId){
            // this.filterText=name
            this.getLeafDom(this.$refs.tree,item.node.id)
          }
          item.node.childNodes.forEach(item=>{
            if(item.data.postId==applicantId){
              if(custId && applicantId && !sortId){
                this.getLeafDom(this.$refs.tree,item.id)
              }
              item.childNodes.forEach(item=>{
                if(item.data.postId==mSortId){
                  if(custId && applicantId && mSortId){
                    this.curTreeId = item.id
                    this.getLeafDom(this.$refs.tree,item.id)
                  }
                }
                item.childNodes.forEach(item=>{
                  if(item.data.postId==sortId){
                    if(custId && applicantId && sortId){
                      this.curTreeId = item.id
                      this.getLeafDom(this.$refs.tree,item.id)
                    }
                  }
                })
              })
            }
          })
        }
      })
    },
    clickbreadcrumb(node){
      // if(node.data.level==2)return
      this.getLeafDom(this.$refs.tree,node.id)
      this.breadcrumbList=this.breadcrumbList.slice(0,node.data.level+1)
    },
    getLeafDom(root,id,upLength){
      for(let i=0;i<root.$children.length;i++){
        if(root.$children[i].node.id==id){
          if(upLength){
            root.$children[i].$el.children[0].innerHTML=root.$children[i].$el.children[0].innerHTML.toString().replace(/\(\d*?\)/,'('+upLength+')')
            root.$children[i].node.data.name=root.$children[i].$el.children[0].innerText
          } else {

            if(!root.$children[i].$el.getAttribute('aria-expanded')){
              root.$children[i].$el.click()
            } else {
              if(root.$children[i].node.isLeaf){
                root.$children[i].$el.click()
              }else {
                this.handleNodeExpand(root.$children[i].node.data,root.$children[i].node,root.$children[i])
              }
            }
          }
        }else{
          this.getLeafDom(root.$children[i],id,upLength)
        }
      }
    },
    async updateMaterial(updateLeft){
      if(updateLeft){
        this.updatePageList3()
      }
      if(!this.querySortId){
        return
      }
      const arr= await this.queryMaterialList(this.curApplicantId,this.querySortId)
      this.pageList4=arr.data
      if(arr.data.length){
        let Tnode=this.$refs.tree.root.childNodes.find(Tnode=>Tnode.data.postId==this.curCustId).childNodes.find(Tnode=>Tnode.data.postId==this.curApplicantId)
        Tnode.childNodes.forEach(item=>{
          item.childNodes.forEach(nodeleaf=>{
            if(nodeleaf.data.postId===this.curSortId){
              this.getLeafDom(this.$refs.tree, nodeleaf.id,arr.data.length)
            }
          })
        })
      }
    },
    async updatePageList3(){

      const arr1 = await this.queryMaterialBySort(this.curApplicantId)
      const sortList= arr1.data.map(item=>({id: '3'+item.mSortId,postId:item.mSortId,level:2, name:item.mClassName+`(${item.childList.length})`,zones:item.childList.map(itm=>({
          id: '3'+itm.sortId,
          postId:itm.sortId,
          name:itm.sortName+`(${itm.fileCount})`,
          level:3,
          fileCount:itm.fileCount,
          leaf:true
        }))})).filter(item=>item.name!=null)
      let Tnode=this.$refs.tree.root.childNodes.find(Tnode=>Tnode.data.postId==this.curCustId).childNodes.find(Tnode=>Tnode.data.postId==this.curApplicantId)
      if(sortList.length <Tnode.childNodes.length){
        const data=Tnode.childNodes.map(node=>node.data).find(item=>item.postId===Tnode.childNodes.map(node=>node.data).map(item=>item.postId).diff(sortList.map(item=>item.postId))[0])
        this.$refs.tree.remove(data)
        // this.pageList3=sortList
        return
      }
      if(sortList.length >Tnode.childNodes.length){
        const data = sortList.find(item=>item.postId===sortList.map(item=>item.postId).diff(Tnode.childNodes.map(node=>node.data).map(item=>item.postId))[0])
        this.appendDom(data,Tnode)
        this.$nextTick(()=>{
          this.getLeafDom(this.$refs.tree,Tnode.id)
        })
        // this.pageList3=sortList
        return
      }
      // let Tnode=this.$refs.tree.root.childNodes.find(Tnode=>Tnode.data.postId==this.curCustId).childNodes.find(Tnode=>Tnode.data.postId==this.curApplicantId)
      sortList.forEach(item=>{
        Tnode.childNodes.map(node=>node.data).forEach(itm=>{
          if(item.postId===itm.postId){
            if(item.name!==itm.name){
              // this.$set(itm,'name',item.name)
              // Tnode.childNodes.find(i=>i.data.postId===itm.postId).data=item
              this.$set(Tnode.childNodes.find(i=>i.data.postId===itm.postId).data,'name',item.name)
            }
            if(item.zones.length>itm.zones.length){
              // this.$set(itm,'zones',item.zones)
              const data = item.zones.find(i=>i.postId===item.zones.map(item=>item.postId).diff(itm.zones.map(item=>item.postId))[0])
              this.appendDom(data,Tnode.childNodes.find(i=>i.data.postId===itm.postId))
              // this.$nextTick(()=>{
              //   // this.getLeafDom(this.$refs.tree,Tnode.id)
              // })
            }
            if(item.zones.length<itm.zones.length){
              // this.$set(itm,'zones',item.zones)
              const data =itm.zones.find(i=>i.postId===itm.zones.map(item=>item.postId).diff(item.zones.map(item=>item.postId))[0])
              this.$refs.tree.remove(data)
              // this.$nextTick(()=>{
              //   // this.getLeafDom(this.$refs.tree,Tnode.id)
              // })
            }
            if(item.zones.length===itm.zones.length){
              item.zones.forEach(i=>{
                itm.zones.forEach(ii=>{
                  if(i.postId===ii.postId){
                    if(i.name!==ii.name){
                      this.$set(Tnode.childNodes.find(node=>node.data.postId===itm.postId).childNodes.find(leafNode=>leafNode.data.postId===i.postId).data,'name',i.name)
                      this.$set(ii,'name',i.name)
                    }
                  }
                })
              })
            }
          }
        })
      })
      // this.pageList3=sortList
    },
    infiniteScroll(){
      if(!this.firstPage){
        this.firstPage=true
      }else if(this.defaultCustList.length<this.customTotal) {
        this.$refs.buttonLookMore.$el.click();
      }
      // this.curPageListNumber+=20
    },
    getFileData(custId,applicantId,sortId,name){
      return {
        custId,
        applicantId,
        sortId,
        fromCase:2,
        sortName:name.replace(/[(]\d+[)]/,''),
        tokenID:this.$store.getters.token
      }
    },
    async loadNode(node, resolve,C,D) {
      if (node.level === 0) {
        this.node=node
        this.resolve=resolve
        const arr = await this.fetchList()
        this.customTotal = arr.total
        let custList= arr.data.map(item=>({
          id:'0'+item.custId,
          postId:item.custId,
          level:0,
          name:item.fullname,
          fullname: item.name,
          fullnameEn:item.fullnameEn,
          country:item.country,
          legalNature:item.legalNature,
          custIntroductor:item.custIntroductor,
          induNameStr:item.induNameStr,
          curStatus:item. curStatus,
          createTime:item.createTime
        })).filter(item=>item.name!=null)
        if(C!=='search'){
          this.defaultCustList= [...this.defaultCustList,...custList]
          this.pageList1.push(...custList)
          return resolve(custList);
        }
        if (C=='search') {
          this.pageList1 = custList
          return resolve(custList);
        }
        // if (C=='search') {
        //   if (D) {
        //     let arr = this.defaultCustList.filter(item=>[item.name?item.name:'', item.fullname?item.fullname:'', item.fullnameEn?item.fullnameEn:''].map(item=>item.trim().toUpperCase()).some(item=>item.includes(D.trim().toUpperCase())))
        //     this.pageList1 = arr
        //     this.defaultCustList = this.defaultCustList.filter(item=>![item.name?item.name:'', item.fullname?item.fullname:'', item.fullnameEn?item.fullnameEn:''].map(item=>item.trim().toUpperCase()).some(item=>item.includes(D.trim().toUpperCase())))
        //     // return resolve(arr);
        //   }else{
        //     this.pageList1 = this.defaultCustList
        //   }
        // }
        // this.pageList1.push(...this.defaultCustList.slice(this.custListNumber,this.custListNumber+this.curPageListNumber))
        // this.pageList1=[...this.pageList1,...this.defaultCustList.slice(this.custListNumber,this.custListNumber+this.curPageListNumber)]
        // return resolve(this.defaultCustList.slice(this.custListNumber,this.custListNumber+=this.curPageListNumber));
      }
      if(node.level===1){
        const arr= await this.queryAppInfoUrl(node.data.postId)
        const appList= arr.data.map(item=>({
          id: '1' +item.appId,
          postId:item.appId,
          level:1,
          name:item.applicantName,
          applicantEnName:item.applicantEnName,
          country:item.country,
          appType:item.appType,
          createDate:item.createDate
        })).filter(item=>item.name!=null)
        return resolve(appList);
      }
      if(node.level===2){
        const arr= await this.queryMaterialBySort(node.data.postId)
        const sortList= arr.data.map(item=>({ id: '2' + item.mSortId,postId:item.mSortId,level:2, name:item.mClassName+`(${item.childList.length})`,zones:item.childList.map(itm=>({
            id: '3' + itm.sortId,
            postId:itm.sortId,
            name:itm.sortName+`(${itm.fileCount})`,
            level:3,
            fileCount:itm.fileCount,
            leaf:true
          }))})).filter(item=>item.name!=null)
        return resolve(sortList);
      }
      if(node.level===3){
        return resolve(node.data.zones)
      }
      // if(node.level===4){
      //   console.log(node)
      //   const arr= await this.queryMaterialList(node.parent.data.postId,node.data.postId)
      //   const sortList= arr.data.map(item=>({postId:item.materialId,level:4, name:item.materialName,address:item.address,leaf: true})).filter(item=>item.name!=null)
      //    return resolve(sortList);
      // }
    },
    handleNodeExpand(data,node,dom) {
      // if(data.level===2){
      //   return
      // }
      this.breadcrumbList=[]

      this.getBreadcrumbList(node)
       this.level=data.level+1
      let timer=setInterval(()=>{
        if(this.getNodeListData(node).length){
          this.curCustId=this.breadcrumbList[0].data.postId
          if(this.breadcrumbList.length>=2){
            this.curApplicantId=this.breadcrumbList[1].data.postId
          }
          if (data.level === 1) {
            // this.$nextTick(() => {
            //   if(node.expanded){
            //     dom.$el.children[1].childNodes.forEach(item=>{
            //       if(!item.getAttribute('aria-expanded')){
            //         item.click()
            //       }
            //     })
            //   }
            // })
          }

          if (data.level < 2) {
             // this.pageList3 = JSON.parse(JSON.stringify(this.getNodeListData(node)))
          }
          clearInterval(timer)
        }
      },60)
      setTimeout(()=>{
        clearInterval(timer)
      },2000)
    },
    getBreadcrumbList(node){
      this.breadcrumbList.unshift(node)
      if(node.parent.data){
        this.getBreadcrumbList(node.parent)
      }
    },
    handleNodeCollapse(data,node,dom){
      // if(data.level===2){
      //   return
      // }
      // setTimeout(()=>{this.level=data.level})

      this.level=data.level
      this.breadcrumbList=[]
      this.$nextTick(()=>{
        this.getBreadcrumbList(node)

        this.breadcrumbList.pop()
        console.log(this.breadcrumbList);
        this.level=data.level
      })

    },
    async handleNodeClick(data,node,dom){
      if(data.level===0){
        this.level=1
        this.breadcrumbList=[]
        this.curCustId=node.data.postId
        this.getBreadcrumbList(node)
      }
      if(data.level===1){
        this.level=2
        if(!node.childNodes.length){
          // this.pageList3=[]
          this.curApplicantId=data.postId
          this.breadcrumbList=[]
          this.curCustId=node.parent.data.postId
          this.getBreadcrumbList(node)
        }
      }
      if(data.level===2){
        this.level=3
        if(!node.childNodes.length){
          this.breadcrumbList=[]
          this.getBreadcrumbList(node)
        }
      }
      if(node.isLeaf&&data.level===3){
        this.breadcrumbList=[]
        this.getBreadcrumbList(node)
        this.curCustId = node.parent.parent.parent.data.postId
        this.curApplicantId = node.parent.parent.data.postId
        this.curSortId = node.parent.data.postId
        this.sortName=node.data.name.replace(/[(]\d+[)]/, '')
        this.querySortId=node.data.postId
        this.curTreeId = node.id
        this.level = data.level+1
        const arr = await this.queryMaterialList(node.parent.parent.data.postId, node.data.postId)
        this.pageList4 = arr.data
      }
    },
    getNodeListData(node){
      return node.childNodes.map(item =>item.data)
    },
    fetchList(){
      const data={
        pageNo: this.customPageNo,
        pageSize: 50,
        keyword:this.filterText
      }
      return fetchList(data)
    },
    queryAppInfoUrl(custId){
      const data={
        custId,
        pageNo: 0,
        pageSize: 99999
      }
      return queryAppInfoUrl(data)
    },
    queryMaterialBySort(applicantId){
      const data={
        applicantId,
      }
      return queryMaterialBySort(data)
    },
    queryMaterialList(applicantId,sortId){
      const data={
        applicantId,sortId
      }
      return queryMaterialList(data)
    },
    querySortList(flag){
      querySortList({applicantId:this.curApplicantId}).then(res=>{
        this.selectSortOptions=res.data
        if(flag){
          this.sortSelectChange(this.breadcrumbList[2].data.postId)
        }

      })
    },
    sortSelectChange(e){
      this.selectSort=e

      // this.selectSortOptions.find(item=>item.mSortId==e).childList.forEach(item=>item.value=item.sortName)
      this.sortNameList=this.selectSortOptions.find(item=>item.mSortId==e).childList
    },
    comfimSortSelect(){
      if(!this.selectSort){
        this.$message.error('请选择一级目录')
        return
      }
      if(!this.sortName){
        this.$message.error('请填选二级目录')
        return
      }
      // if(!this.materialTypeId){
      //   this.$message.error('请选择资料类型')
      //   return
      // }
      this.selectSortIdState=false
      this.selectSortIdState2=false

      this.curSortId=this.selectSort
      this.creatematerial()
    },
    filterNode(value, data) {
      if (!value) return true;
      let hasArr = [data.name?data.name:'', data.fullname?data.fullname:'', data.fullnameEn?data.fullnameEn:''].map(item=>item.trim().toUpperCase())
      if (data.level === 0) {
        // return hasArr.some(item => item.includes(value.trim().toUpperCase()));
        return '';   
      }
      if (data.level !== 0){
        let arrList = this.getCustData(data.level, data.postId)
        if(arrList.length){
          if (hasArr.some(item => item.includes(value.trim().toUpperCase()))) {
            return true
          } else {
            return false
          }
        }
      }
    },
    getCustData(level,postId){
      let list=[]
      this.$refs.tree.$children.forEach(item=>{
        item.node.childNodes.forEach(item1=>{
          if(level===1) {
            if (item1.data.postId == postId) {
              list = [item.node.data, item1.data]
            }
          }
          item1.childNodes.forEach(item2=>{
            if(level===2){
              if(item2.data.postId==postId){
                list=[item.node.data,item1.data,item2.data]
              }
            }
            item2.childNodes.forEach(item3=>{
              if(level===3){
                if(item3.data.postId==postId){
                  list=[item.node.data,item1.data,item2.data,item3.data]
                }
              }
            })
          })
        })
      })
      return list
    },
    append(){
      this.customPageNo++
      this.loadNode(this.node,this.resolve,'append')
    },
    uploadSuccess(sortId){
      this.curSortId=sortId
      // console.log(sortId)
      this.updateMaterial(true)
    },
  },
  components:{
    materialPage,uploadFile
  }
}
</script>

<style lang="scss" scoped>
  .el-breadcrumb{
    position: absolute;
    height: 30px;
    line-height: 30px;
    width: 100%;
    top:-20px;
    background: RGBA(239, 248, 255, 1);
    /deep/ .el-breadcrumb__inner{
      cursor: pointer;
    }
  }
.materialWarp{
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  display: flex;
  /*flex-wrap: wrap;*/
  flex-direction:column;
  header{
    h4{
      width: 100%;
      height: 62px;
      line-height: 75px;
      font-size: 22px;
      font-weight: 400;
      color: #333333;
    }
    .el-input{
      width: 300px;
    }
    padding-left: 20px;
  }
  .content_warp{
    flex: 1;
    display: flex;
    padding: 20px;
    height: 100%;
    /*width: 100%;*/
  }
  .aside {
    min-width: 200px;
    max-width: 300px;
    height: 100%;
    overflow: auto;
    margin-right: 20px;
    border: 1px solid #99a9bf;
  }
  .section{
    flex: 1;
    position: relative;
    border: 1px solid #99a9bf;
  }
}
.drop_area_hover{
  opacity: 0.5;
}
.nameWarp{
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  height: 100%;
  position:relative;
  background: #fff;
  overflow: auto;
  li{
   // height: 20px;
    text-align: center;
    line-height: 20px;
    width: 20%;
    margin: 20px;
    list-style: none;
  }
}
  .dragPage{
    padding: 10px 0;
    .packageName{
      width: 100%;
    }
    .fileWarp{
      display: flex;
      flex-wrap:wrap;
      .fileItem{
        display: flex;
        flex-wrap: wrap;
        width: 65px;
        margin: 10px;
        .upload-demo{
          width: 100%;
          height:65px;
          /deep/ .el-upload-list{
            display: none;
          }
          /deep/ .el-upload{
            width: 100%;
            height:65px;
            .el-upload-dragger{
              width: 100%;
              height:65px;
              border: 0;
            }

          }
        }
        .fileName{
          width: 100%;
          height: 12px;
          font-size: 12px;
          text-align: center;
        }
      }
    }
  }
@keyframes show {
  0% {

    opacity: 0;
    transform: translateX(100%);

  }
  100% {
    transform: translateX(0);
    opacity: 1;

  }
}
@keyframes hide {
  0% {
    opacity: 1;
    transform: translateX(0);
  }
  100% {

    opacity: 0;
    transform: translateX(100%);
  }
}
.show-enter-active {
  animation: show 1.2s;
}
.show-leave-active {
  animation: hide 1.2s;
}
.show-enter, .show-leave-to {
  opacity: 0;
}
  .el-tree{
    /deep/ &>.el-tree-node{
      &>.el-tree-node__content span:before{
        background-size: cover;
        color: transparent;
      }
      &>.el-tree-node__content>.el-tree-node__expand-icon{
        transform: rotate(0) !important;
        background-size: contain !important;
        padding: 3px !important;
        margin: 3px;
        /*&:before{*/
          background:url("../../../assets/资料管理icon/客户默认.png") no-repeat center ;
        /*}*/
      }
      &>.el-tree-node__content>.el-tree-node__expand-icon.expanded{
        transform: rotate(0) !important;
        /*&:before{*/
          background:url("../../../assets/资料管理icon/客户选中.png") no-repeat center ;
        /*}*/
      }
      &>.el-tree-node__children .el-tree-node{
        &>.el-tree-node__content span:before{
          background-size: cover;
          color: transparent;
        }
        &>.el-tree-node__content .el-tree-node__expand-icon{
          &:before{
            background-size: contain !important;
            background:url("../../../assets/资料管理icon/applicantputaway.png") no-repeat center ;
          }
        }
        &>.el-tree-node__content .el-tree-node__expand-icon.is-leaf{
          visibility: hidden;
          display: none;
          &~.el-tree-node__label{
            margin-left: 6px;
          }
        }
      }
    }
  }
  .el-table{
    overflow: visible;
    /deep/ th{
      color: rgba(51, 51, 51, 1);
      background: rgba(187, 187, 187, 0.5);
    }
  }
  .el-table{
    /deep/ th{
      padding:5px 0
    }
    /deep/ td {
      padding: 0 ;
    }
  }
  .comfimSortButton{
    text-align: right;
  }
  .aside::-webkit-scrollbar {
     width: 8px;
     height: 8px;
     background: #f2f2f2;
     padding-right: 2px;
  }
  .aside::-webkit-scrollbar-thumb {
    background: #b4bbc5;
    border-radius: 10px;
    border: 0;
  }
 /deep/ .el-table__body-wrapper::-webkit-scrollbar {
    width: 8px;
    height: 8px;
    background: #f2f2f2;
    padding-right: 2px;
  }
  /deep/ .el-table__body-wrapper::-webkit-scrollbar-thumb {
    background: #b4bbc5;
    border-radius: 10px;
    border: 0;
  }
.el-tabs{

  height: 100%;
  display: flex;
  flex-direction: column;
  /deep/ .el-tabs__content{
    flex: 1;
    padding: 0;
  }
}
  .packageName{

  }
</style>
