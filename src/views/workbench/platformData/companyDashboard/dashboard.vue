<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane :label="item.label" :name="item.prop" v-for="item in iframeList.filter(i=>$store.getters.permissions.includes(i.permission))">
        <div class="iframe_wrap" v-if="activeName===item.prop">
          <div  class="iframe" :class="[itm.fill?'fill':'']" v-for="(itm,index) in item.list">
            <el-button class="el-icon-download" type="text" style="position: absolute;right:20px;bottom:10px" @click="html2Canvas(`iframe_wrap-${index}`)"></el-button>
            <el-button class="el-icon-full-screen" type="text" style="position: absolute;right:40px;bottom:10px" @click="open(`/hi-ee/hi.html?dir=${itm.url}`)"></el-button>
            <iframe
              :id="`iframe_wrap-${index}`"
              :src="`/hi-ee/hi.html?dir=${itm.url}`"
              style="width: 100%;height:100%;" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen>
            </iframe>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
<!--  <div class="y_mainContainer clearfix">-->
<!--    <el-scrollbar :style="{height: wdHeight}" class="left_scrollbar">-->
<!--      <div class="scrollbar_view">-->
<!--        <div style="width:240px;margin-bottom:3px">-->
<!--          <span>维度:</span>-->
<!--          <el-select size="small" value-key="menuId" v-model="wd_value" placeholder="请选择"-->
<!--                     style="margin-left: 20px;">-->
<!--            <el-option v-for="item in selectData" :label="item.menuName" :key="item.menuId" :value="item" />-->
<!--          </el-select>-->
<!--        </div>-->
<!--        <el-menu  @open="openSubm" default-active="2" class="el-menu-vertical-demo">-->
<!--          <el-submenu v-for="(item,key) in menuData" :key="key" :index="String(key)">-->
<!--            <template slot="title">-->
<!--              <span>{{item.menuName}}</span>-->
<!--            </template>-->
<!--            <el-menu-item-group>-->
<!--              <el-tree @check-change="((a,b,c)=>{handleCheckChange(a,b,c,item.id)})" :expand-on-click-node="false" :check-on-click-node="true" :check-strictly="true" :highlight-current="true"-->
<!--                       :render-after-expand="true" :ref="item.id" :data="item.zdata" show-checkbox node-key="id" :props="defaultProps"></el-tree>-->
<!--            </el-menu-item-group>-->
<!--          </el-submenu>-->
<!--        </el-menu>-->
<!--      </div>-->
<!--    </el-scrollbar>-->
<!--    <el-scrollbar ref="mainscrollbar" :style="{height: wdHeight}" class="main_scrollbar">-->
<!--      <div class="page-component">-->
<!--        <div class="page-component__content">-->
<!--          <el-button v-if="false" type @click=" xiazai">下载</el-button>-->
<!--          <el-row v-for="(item,key) in checkedItems" :key="key" :ref="item.id" type="flex" class="row-bg" justify="center">-->
<!--            <el-col v-if='item.chartType!="doubleBar"&&item.chartType' :span="11">-->
<!--              &lt;!&ndash; <YChat v-if="zdcheckedItemsdf" type='axis' :options='zdcheckedItemsdf' /> &ndash;&gt;-->
<!--              <YChat  type="pie" :options="item" />-->
<!--            </el-col>-->

<!--            <el-col v-if='item.chartType!="doubleBar"&&item.chartType'  :offset="1" :span="11">-->
<!--              &lt;!&ndash; <YChat v-if="zdcheckedItemsdf" type='axis' :options='zdcheckedItemsdf' /> &ndash;&gt;-->
<!--              <YChat  :type="item.chartType=='pie'?'pie':'axis'" :options="item" />-->
<!--            </el-col>-->
<!--              <el-col v-if='item.chartType=="doubleBar"&&item.chartType'  :offset="0.5" :span="23">-->
<!--              &lt;!&ndash; <YChat v-if="zdcheckedItemsdf" type='axis' :options='zdcheckedItemsdf' /> &ndash;&gt;-->
<!--              <YChat v-for="(item,key) in checkedItems" :key="key" :ref="item.id" type="db" :options="item" />-->
<!--            </el-col>-->
<!--          </el-row>-->

<!--        </div>-->
<!--      </div>-->
<!--    </el-scrollbar>-->
<!--  </div>-->
</template>

<script>
import { menusUrl, statsUrl } from "@/api/dashboard";
import YChat from "./components/YChat";
import { log } from "util";
import Vue from "vue";
import html2Canvas from 'html2canvas'
import JsPDF from 'jspdf'
export default {
  name: "",
  components: { YChat },
  props: {},
  data() {
    let str='&mode=dashboard&j_organization=IPS&j_username=zhangziwei&j_password=123456'
    let dir='1597909447807'
    let iFrameObj={
      billCurrent: [
        { type: 'default', url: `${dir}/1597909487489&file=fda99b44-5056-4241-ac30-48c310dc4111.report${str}` },
        { type: 'default', url: `${dir}/1597909487489&file=5e4b93d1-41d9-4be2-a389-82adbc9500bb.report${str}` },
        { type: 'default', url: `${dir}/1597909487489&file=f17c7508-0368-4d65-80dc-49a211db2ab1.report${str}` },
        { type: 'default', url: `${dir}/1597909487489&file=f5d77dec-b1fa-49af-a958-70a60819f0d2.report${str}` },
        { type: 'default', url: `${dir}/1597909487489&file=80432d05-1fb0-4314-95ff-edaea5afafca.report${str}` },
        { type: 'default', url: `${dir}/1597909487489&file=99327e7e-b76e-4785-a535-b94a41b82eb3.report${str}` },
        { type: 'default', url: `${dir}/1597909487489&file=4a70e669-a6cd-403b-b9b6-fb1b1bef85bf.report${str}` },
        { type: 'default', url: `${dir}/1597909487489&file=ae575483-e800-423f-b7ed-71265bdd9625.report${str}` },
        { type: 'default', url: `${dir}/1597909487489&file=99327e7e-b76e-4785-a535-b94a41b82eb9.report${str}` },
        { type: 'default', url: `${dir}/1597909487489&file=c6a96d0a-26d9-41dd-9efb-61e631b46509.report${str}` },
        { type: 'default', url: `${dir}/1597909487489&file=ab2937e5-bdf5-40e6-b574-fe4782c3ef7f.report${str}` },
        { type: 'default', url: `${dir}/1597909487489&file=0885a3fd-b4ae-4e9a-9d19-65834d885648.report${str}` },
        { type: 'default', url: `${dir}/1597909487489&file=0ffbb7aa-1a12-498c-b9ab-1955a9636eb9.report${str}` },
        { type: 'default', url: `${dir}/1597909487489&file=a0f0a42d-2e34-4ea2-af46-3bdb990e0428.report${str}` },
        { type: 'default', url: `${dir}/1597909487489&file=5a040b0e-156b-4640-b60c-279d662e2f54.report${str}` },
        { type: 'default', url: `${dir}/1597911505269&file=75bb5531-ae45-4a77-8e11-a77afbea688c.efw${str}` },
        { type: 'default', url: `${dir}/1597911505269&file=9a998c56-efec-4d82-9a50-275407dbc032.efw${str}` },
        { type: 'default', url: `${dir}/1597911505269&file=e9213603-9342-47a8-ad6a-c58cd1a4434d.efw${str}` },
        { type: 'default', url: `${dir}/1597911505269&file=fd9f7201-9738-4eaf-92e6-bab8c362c903.efw${str}` }
      ],
      bill: [
        { type: 'default', url: `${dir}/1597909487481&file=fda99b44-5056-4241-ac30-48c310dc4111.report${str}` },
        { type: 'default', url: `${dir}/1597909487481&file=5e4b93d1-41d9-4be2-a389-82adbc9500bb.report${str}` },
        { type: 'default', url: `${dir}/1597909487481&file=f17c7508-0368-4d65-80dc-49a211db2ab1.report${str}` },
        { type: 'default', url: `${dir}/1597909487481&file=f5d77dec-b1fa-49af-a958-70a60819f0d2.report${str}` },
        { type: 'default', url: `${dir}/1597909487481&file=80432d05-1fb0-4314-95ff-edaea5afafca.report${str}` },
        { type: 'default', url: `${dir}/1597909487481&file=99327e7e-b76e-4785-a535-b94a41b82eb3.report${str}` },
        { type: 'default', url: `${dir}/1597909487481&file=4a70e669-a6cd-403b-b9b6-fb1b1bef85bf.report${str}` },
        { type: 'default', url: `${dir}/1597909487481&file=ae575483-e800-423f-b7ed-71265bdd9625.report${str}` },
        { type: 'default', url: `${dir}/1597909487481&file=99327e7e-b76e-4785-a535-b94a41b82eb9.report${str}` },
        { type: 'default', url: `${dir}/1597909487481&file=c6a96d0a-26d9-41dd-9efb-61e631b46509.report${str}` },
        { type: 'default', url: `${dir}/1597909487481&file=ab2937e5-bdf5-40e6-b574-fe4782c3ef7f.report${str}` },
        { type: 'default', url: `${dir}/1597909487481&file=0885a3fd-b4ae-4e9a-9d19-65834d885648.report${str}` },
        { type: 'default', url: `${dir}/1597909487481&file=0ffbb7aa-1a12-498c-b9ab-1955a9636eb9.report${str}` },
        { type: 'default', url: `${dir}/1597909487481&file=a0f0a42d-2e34-4ea2-af46-3bdb990e0428.report${str}` },
        { type: 'default', url: `${dir}/1597909487481&file=5a040b0e-156b-4640-b60c-279d662e2f54.report${str}` },
        { type: 'default', url: `${dir}/1597911505260&file=75bb5531-ae45-4a77-8e11-a77afbea688c.efw${str}` },
        { type: 'default', url: `${dir}/1597911505260&file=9a998c56-efec-4d82-9a50-275407dbc032.efw${str}` },
        { type: 'default', url: `${dir}/1597911505260&file=e9213603-9342-47a8-ad6a-c58cd1a4434d.efw${str}` },
        { type: 'default', url: `${dir}/1597911505260&file=fd9f7201-9738-4eaf-92e6-bab8c362c903.efw${str}` }
      ],
      case: [{ type: 'default', url: `${dir}/1597909481666&file=df16a137-fa6e-4d87-bb1e-994faf5addd2.report${str}` },
        { type: 'default', url: `${dir}/1597909481666&file=5d22aef9-4a86-43ce-828b-115176ed8137.report${str}` },
        { type: 'default', url: `${dir}/1597909481666&file=bc9a3789-61ff-4b44-beac-57c137accac7.report${str}` },
        { type: 'default', url: `${dir}/1597909481666&file=2daf0d54-308b-4efc-9a62-6f0a0fe5059d.report${str}` },
        { type: 'default', url: `${dir}/1597909481666&file=7150d414-e23f-4236-b4e0-3b539b72edc0.report${str}` },
        { type: 'default', url: `${dir}/1597909481666&file=cc72599a-2be4-4bdd-8cbb-d6f0b127b613.report${str}` },
        { type: 'default', url: `${dir}/1597909481666&file=89785b01-93f9-49fb-b7af-91fe6a539d7e.report${str}` },
        { type: 'default', url: `${dir}/1597911505260&file=5c101605-ea96-4dff-afd6-2587d4756269.efw${str}` },
        { type: 'default', url: `${dir}/1597911505260&file=a5c11851-ab44-4516-aec1-3f4a5514e329.efw${str}` }
      ],
      customer: [
        { type: 'default', url: `${dir}/1597910103681&file=2c95b88c-a163-458e-9371-12886e30a90d.report${str}` },
        { type: 'default', url: `${dir}/1597910103681&file=3307eace-ff73-40fd-a5b1-89c65f5308b1.report${str}` },
        { type: 'default', url: `${dir}/1597910103681&file=ff4de342-1e3e-42a6-b7b8-83a39b0795d3.report${str}` },
        { type: 'default', url: `${dir}/1597910103681&file=43b2ff74-a5a4-4227-ac8a-047c81a7ef65.report${str}` },
        { type: 'default', url: `${dir}/1597910103681&file=6a793845-e46a-4dab-a5e1-ac13d6b6e3de.report${str}` },
        { type: 'default', url: `${dir}/1597910103681&file=fcd0b9e7-db55-4244-8b9e-2b50b59da9fc.report${str}` },
        { type: 'default', url: `${dir}/1597910103681&file=b32f7682-6602-4e64-826d-29bb5ee605de.report${str}` },
        { type: 'default', url: `${dir}/1597910103681&file=17a4cdb0-ad7c-4118-952a-83739b83a3e2.report${str}` },
        { type: 'default', url: `${dir}/1597910103681&file=0dca590a-f3dc-4670-b573-e540c2f6a13d.report${str}` },
        { type: 'default', url: `${dir}/1597910103681&file=197dd519-aa8d-41ce-b2e4-a719a947d7f1.report${str}` },
        { type: 'default', url: `${dir}/1597910103681&file=3a50493e-8646-4441-ad2c-20882720f823.report${str}` },
        { type: 'default', url: `${dir}/1597911505260&file=5e839d6a-e4b2-4e88-b25c-a73b75902cbd.efw${str}` },
        { type: 'default', url: `${dir}/1597910103681&file=c8f6769f-973d-442d-ae29-fd0396589fc2.report${str}` },
        { type: 'default', url: `${dir}/1597910103681&file=f27943f9-fab1-4d84-a142-accc806e28ac.report${str}` },
        { type: 'default', url: `${dir}/1597909487481&file=02498dbf-4e8a-42bd-bb0b-d59eab0478d4.report${str}` },
        { type: 'default', url: `${dir}/1597910103681&file=8d4c693d-dc04-4f33-b881-87b961d6e6d5.report${str}` },
        { type: 'default', url: `${dir}/1597910103681&file=c7fb13dc-b765-4ad8-a1d3-d2fd423b5140.report${str}` }
      ],
      partnerCutomer: [{
        type: 'default',
        url: `${dir}/1597909487481&file=66994d5b-5597-4691-b9fd-55878f697cab.report${str}`
      },
        { type: 'default', url: `${dir}/1597909487481&file=9e739ba5-c213-4bde-88b0-84d63255e212.report${str}` },
        { type: 'default', url: `${dir}/1597909487481&file=1810cad4-d7a1-4f03-9c71-2c24f1c320e7.report${str}` },
        { type: 'default', url: `${dir}/1597909487481&file=fdee0226-05e4-4788-85a2-99938db93142.report${str}` },
        { type: 'default', url: `${dir}/1597909487481&file=0935a0db-f85b-423a-bb09-1b7c9c4d76f8.report${str}` },
        { type: 'default', url: `${dir}/1597909487481&file=6fcb2beb-727f-4cac-b7c4-77a0a7c48a7d.report${str}` },
        { type: 'default', url: `${dir}/1597910103681&file=9a334078-05f8-420a-95e0-c356ed7d5ebe.report${str}` },
        { type: 'default', url: `${dir}/1597910103681&file=ad4b1235-56da-409f-bfa9-27e4ae6911e5.report${str}` }
      ]
    }

    return {
      activeName:'billCurrent',
      chackedArr:[],
      baseChecked:[],
      menuData: [],
      wd_value: "",
      checkedItems: [],
      data: [],
      zddata: [],
      aldata: [],
      khdata: [],
      defaultProps: {
        children: "children",
        label: "menuName"
      },
      selectData: [],
      alltypeObjc: {},
      activeNameList:['billCurrent'],
      iframeList: [
        { label: '账单（实时）', prop: 'billCurrent', list: iFrameObj.billCurrent, permission: 256 },
        { label: '账单（财务审核后）', prop: 'bill', list: iFrameObj.bill, permission: 256 },
        { label: '案件', prop: 'case', list: iFrameObj.case, permission: 257 },
        { label: '客户', prop: 'customer', list: iFrameObj.customer, permission: 258 },
        { label: '合伙人', prop: 'partnerCutomer', list: iFrameObj.partnerCutomer, permission: 279 }
      ]

    };
  },
  created() {
    if(this.iframeList.find(item=>this.$store.getters.permissions.includes(item.permission))){
      this.activeName=this.iframeList.find(item=>this.$store.getters.permissions.includes(item.permission)).prop
    }

  },
  watch: {
    // wd_value(n) {
    //    this.checkedItems=[];
    //      this.baseChecked=[];
    //       this.alltypeObjc={};
    //   menusUrl(this.delnullKey(n)).then(res => {
    //     this.menuData = res.data.map(item => {
    //       item.zdata = [];
    //       item.id = this.getmId(item);
    //       this.alltypeObjc[item.id]=[];
    //       menusUrl(this.delnullKey(item)).then(res => {
    //         item.zdata = res.data.map(item => {
    //           item.id = this.getmId(item);
    //
    //           return item;
    //         });
    //       });
    //
    //
    //     statsUrl(this.delnullKey(item)).then(res => {
    //
    //      Vue.set(res.data,'id',this.getmId(item))
    //      Vue.set(res.data,'chartType',item.chartType)
    //
    //           this.checkedItems.unshift(res.data?res.data:{chartType:null});
    //           this.baseChecked.push(res.data);
    //       console.log(this.checkedItems);
    //     });
    //       return item;
    //     });
    //
    //
    //   });
    //
    //
    //
    //
    // },

  },
  mounted(){
  },
  computed: {
    // wdHeight() {
    //   return (
    //     (document.body.clientHeight || document.documentElement.clientHeight) -
    //     150 +
    //     "px"
    //   );
    // }
  },
  methods: {
    handleClick(tab,e){
      this.activeNameList.push(tab.name)
    },
    open(url){
      window.open(url)
    },
    html2Canvas(id){
      let dom;
      if( !document.getElementById(id).contentWindow.document.documentElement.querySelector('iframe')){
        dom=  document.getElementById(id).contentWindow.document.documentElement.querySelector('#dashboardCanvas')
        dom.style.overflow='visible'
        dom.style.height = Array.from(dom.querySelectorAll('.grid-stack-item.ui-draggable')).reduce((pre,next)=>pre+next.offsetHeight,0)+'px'

      }else{
        dom=  document.getElementById(id).contentWindow.document.documentElement.querySelector('iframe').contentWindow.document.documentElement.querySelector('#main')
        if(dom.querySelector('table')){
          dom.style.height=Number(getComputedStyle(dom).height.replace('px',''))+Number(getComputedStyle(dom.querySelector('table')).height.replace('px',''))+'px'
          dom.style.width=getComputedStyle(dom.querySelector('table')).width
          // dom.style.height=getComputedStyle(dom.querySelector('#chart'))
        }

      }
      // console.log(document.getElementById(id).contentWindow.document.documentElement.querySelector('iframe'));
      // let fileName= document.getElementById(id).contentWindow.document.documentElement.querySelector('#hi-cache-fileTitle').innerText
      dom.style.padding='10px'
      html2Canvas(dom, {
        allowTaint: true
      }).then(function (canvas) {
        // var imgUri = canvas.toDataURL();
        // console.log(imgUri);
        let contentWidth = canvas.width
          let contentHeight = canvas.height
          let pageHeight = contentWidth / 592.28 * 841.89
          let leftHeight = contentHeight
          let position = 0
          let imgWidth = 595.28
          let imgHeight = 592.28 / contentWidth * contentHeight
          let pageData = canvas.toDataURL('image/jpeg', 1.0)
          let PDF = new JsPDF('', 'pt', 'a4')
          if (leftHeight < pageHeight) {
            PDF.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight)
          } else {
            while (leftHeight > 0) {
              PDF.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
              leftHeight -= pageHeight
              position -= 841.89
              if (leftHeight > 0) {
                PDF.addPage()
              }
            }
          }

          PDF.save(new Date().getTime() + '.pdf')


        }

      )
      dom.style.padding='0'
    },

  //
  //   delnullKey(index) {
  //     for (const key in index) {
  //       if (index.hasOwnProperty(key)) {
  //         const element = index[key];
  //         if (!element) {
  //           delete index[key];
  //         }
  //       }
  //     }
  //     return index;
  //   },
  //   openSubm(index) {},
  //   handleCheckChange(a, b, c, d) {
  //     if(b){
  //     this.alltypeObjc[d] = this.$refs[d][0].getCheckedNodes();
  //     this.chackedArr = [];
  //     for (const key in this.alltypeObjc) {
  //       if (this.alltypeObjc.hasOwnProperty(key)) {
  //         const element = this.alltypeObjc[key];
  //
  //           this.chackedArr.push(this.baseChecked.find(item=>item.id==key));
  //           this.chackedArr.push(...element);
  //       }
  //     }
  //     console.log(this.chackedArr,'basearr')
  //
  //         let itemObj = {};
  //       console.log(a,'112233')
  //       if(a.chartType=='doubleBar'){
  //         a.currYear='2019'
  //       }
  //       statsUrl(this.delnullKey(a)).then(res => {
  //         res.data.id=this.getmId(res.data)
  //         res.data.chartType=a.chartType
  //         itemObj=res.data;
  //          if(this.checkedItems&&this.checkedItems.length<=0){
  //             this.checkedItems.push(itemObj);
  //       }else{
  //         this.checkedItems.splice(this.chackedArr.indexOf(a),0,itemObj);
  //       }
  //           this.$nextTick(() => {
  //         var div = this.$refs["mainscrollbar"].$refs["wrap"];
  //         this.$nextTick(() => {
  //           div.scrollTop = this.$refs[itemObj.id][0].$el.offsetTop;
  //         });
  //       });
  //       });
  //
  //
  //     }else{
  //
  //       let index=this.checkedItems.indexOf(this.checkedItems.find(item=> {if(item){ if(item.id==a.id){return item}}}));
  //       let index2=this.chackedArr.indexOf(this.chackedArr.find(item=>{if(item){ if(item.id==a.id){return item}}}));
  //       this.checkedItems.splice(index,1);
  //       this.chackedArr.splice(index2,1);
  //
  //     }
  // console.log(  this.checkedItems,'baseitem')
  //   },
  //   xiazai() {
  //
  //     for (const key in this.$refs) {
  //       const element = this.$refs[key].$children[0];
  //       var a = document.createElement("a");
  //       a.download = element.options.title.text || "pic";
  //       a.href = element.getDataURL();
  //       a.click();
  //     }
  //   },
  //   getmId(item) {
  //     return (item.flag?item.flag:'*') + "-" + (item.menuId?item.menuId:'*')  + "-" + (item.statType?item.statType:'*'+item.title) ;
  //   }
  // },

  // mounted() {
  //   menusUrl().then(res => {
  //     this.selectData = res.data;
  //     this.wd_value = this.selectData[0];
  //   });
   }
}
</script>
<style lang="scss" scoped>
/*/deep/ .app-main {*/
/*  min-height: 0px !important;*/
/*}*/
/*.y_mainContainer {*/
/*  overflow: hidden;*/
/*  box-shadow: 1px 1px 2px 1px rgba(201, 201, 201, 0.5);*/
/*  // background-color: rgba(243, 248, 255, 1);*/
/*  background-color: white;*/
/*  min-height: calc(100vh);*/
/*}*/
/*.main_scrollbar {*/
/*  // height: 200px;*/
/*}*/

/*.page-component {*/
/*  box-sizing: border-box;*/
/*  height: 100%;*/
/*}*/
/*.left_scrollbar {*/
/*  width: 240px;*/
/*  position: fixed;*/
/*  top: 0;*/
/*  bottom: 0;*/
/*  margin-top: 74px;*/
/*  transition: padding-top 0.3s;*/
/*  // padding: 10px 0px;*/
/*  min-height: calc(100vh - 184px);*/
/*}*/
/*.page-component__content {*/
/*  padding-left: 242px;*/
/*  // padding-top: 10px;*/

/*  // padding-bottom: 100px;*/
/*  // box-sizing: border-box;*/
/*}*/
/*/deep/ .el-scrollbar__wrap {*/
/*  overflow-x: auto !important;*/
/*}*/
/*/deep/ .el-menu-item-group__title {*/
/*  display: none !important;*/
/*}*/
.left_scrollbar {
  width: 240px;
}
.y_mainContainer{
  display: flex;
}
.main_scrollbar{
  flex: 1;

}
/deep/ .el-scrollbar__wrap {
  overflow-x: hidden;
}
.iframe_wrap{
  display: flex;
  flex-wrap:wrap;
  .iframe{
    position: relative;
    width: 33%;
    height: 560px;
    /*flex: 1;*/
  }
  .fill{
    width: 100%;
  }
}

</style>
