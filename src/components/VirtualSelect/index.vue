<template>
  <el-popover width="240" v-model="visible" @show="handleToggle(true)" @hide="handleToggle(false)" ref="popover" :disabled="disabled" placement="bottom-start">
    <div class="jh-virtual-select" slot="reference" :class="{'is-disabled':disabled, 'is-active': isActive}">
      <div class="content">
        <div :hidden='filterable&&selected.length===0' class="inner-text" :style="{color:selected.length?'#606266':'#c0c4cc'}">
          <div v-if='!multiple' :class="{tags:this.multiple&&selected.length,plac:!this.multiple&&!this.value}">
            <UserIconAndUserName v-if="isUser"  :user-id="selected[selected.length-1]" ></UserIconAndUserName>
            <span v-else>{{selectText}}</span>
          </div>
          <div v-if="multiple">
            <el-tag
              :key="tag"
              v-for="tag in selected"
              :closable="!disabled"
              size="mini"
              :disable-transitions="false"
              @close="handleClose(tag)">
              {{data.find(item=>item.userId==tag)&&data.find(item=>item.userId==tag).name}}
            </el-tag>
          </div>
        </div>
      <input class="inner-input" type="text" v-if="filterable" :placeholder="selected.length?'':placeholder" ref="input" v-model="keyword" @input="handleInput"  :disabled="disabled" />
      </div>
      <div class="suffix" v-if="!disabled">
        <i :class="suffixCls" @mouseover="hoverFlag = true" @mouseleave="hoverFlag = false" @click="handleClear($event)"></i>
      </div>
    </div>
    <div v-if="showbtn && multiple && formatData.length>0" class="options_btn">
      <div class="btn" @click="handleAll()">全选</div>
      <div class="btn" @click="handleClear($event)">全不选</div>
    </div>
    <div v-if="visible">
      <RecycleScroller
      class="options"
      :items="filterData"
      :item-size="34"
      key-field="key"
      v-slot="{ item,index }">
        <div class="item" @click="handleClick(item)" :class="[focusIndex===index?'focus':'',selected.includes(item.value)?'selected':'', item.isActive === 0 ? 'disabled' : '']">
            <div v-if="render" v-html="render(item).innerHTML">
            </div>
            <div v-else> {{item.label}}</div>
        </div>
      </RecycleScroller>

<!--    <div class="options"  ref="options" v-show='filterData.length>0' >-->
<!--&lt;!&ndash;      <div class="el-scrollbar__bar is-vertical"><div class="el-scrollbar__thumb" style="transform: translateY(0%); height: 1.09334%;"></div></div>&ndash;&gt;-->
<!--    </div>-->
    </div>
    <div class="options_empty" v-if='filterData.length===0 && formatData.length>0'>无匹配数据</div>
    <div class="options_empty" v-if='formatData.length===0'>无数据</div>
  </el-popover>
</template>

<script>
  import { RecycleScroller } from 'vue-virtual-scroller'
  import { isPinyinMatch } from '@/utils'
  import 'jh-virtual-scroll';
  import './iconfont/iconfont.css';
  import { JhPopover } from 'jh-popover';
  export default {
    name: 'jh-virtual-select',
    model: {
      prop: 'value',
      event: 'change',
    },
    components: {
      JhPopover,RecycleScroller
    },
    props: {
      isUser:{
        default:false
      },
      data: {
        type: Array,
        required: true,
      },
      value: {
        required: true,
      },
      multiple: {
        type: Boolean,
        default: false,
      },
      disabled: {
        type: Boolean,
        default: false,
      },
      placeholder: {
        type: String,
        default: '',
      },
      clearable: {
        type: Boolean,
        default: false,
      },
      filterable: {
        type: Boolean,
        default: false,
      },
      render: {
        type: Function,
      },
      showbtn: {
        type: Boolean,
        default: false,
      },
      group: {
        type: Boolean,
        default: false,
      },
      allowCreate: {
        type: Boolean,
        default: false,
      },
      filterMethod:{
        type: Function,
        default: (e,keyword)=>isPinyinMatch(e,keyword)||e?e.toLowerCase().includes(keyword.toLowerCase()): false,
      }
    },
    data() {
      return {
        hoverFlag: false,
        selected: [],
        visible: false,
        jhVScroller: null,
        scopedHash: {},
        keyword: '',
        pagesize: 5,
        pageno: 0,
        isActive: false,
        focusIndex:null
      };
    },
    mounted() {
      this.input=this.$refs.input;
      let that=this
      if(this.input){
        this.input.onkeydown=function (){
          if(that.multiple){
            return
          }
          if(event.keyCode==40){
            if(that.focusIndex==null){
              that.focusIndex=-1
            }
            if(that.focusIndex!= that.filterData.length-1){
              that.focusIndex++
            }
            that.filterData.forEach(item=>{
              item.focusState=false
            })
            that.filterData[that.focusIndex].focusState=true
          }
          if(event.keyCode==38){
            if(that.focusIndex==null){
              that.focusIndex=0
            }
            if(that.focusIndex!=0){
              that.focusIndex--
            }
            that.filterData.forEach(item=>{
              item.focusState=false
            })
            that.filterData[that.focusIndex].focusState=true
          }
          if(event.keyCode==13){
            const index = that.selected.indexOf(that.filterData[that.focusIndex].value);
            if(index>-1){
              that.visible=!that.visible
            }else{
              that.handleClick(that.filterData[that.focusIndex])
            }

          }
        }
      }

    },

    computed: {
      selectText() {
        let text = this.placeholder;
        if (this.multiple && this.selected.length > 0) {
          text = `已选择${this.selected.length}个`;
        }
        if (!this.multiple && this.selected.length > 0) {
          const obj = this.formatData.find(o => o.value === this.selected[0]);
          if (obj) {
            text = obj.label;
          }
        }
        return text;
      },
      formatData() {
        const arr = [];
        if (this.group) {
          this.data.forEach(item => {
            if (item.children) {
              item.children.forEach((child, index) => {
                child.disabled = item.disabled || child.disabled;
                child._label = item.label;
                child._value = item.value;
                child._disabled = item.disabled;
                child._header = index === 0;
                child._footer = index === item.children.length - 1;
              });
              arr.push(...item.children);
            }
          });
        } else {
          arr.push(...this.data);
        }
        return arr;
      },
      filterData() {
        if(this.allowCreate&&!this.formatData.find(i=>i.label === this.keyword)){
          this.formatData.push({label: this.keyword, value: this.keyword})
        }
        return this.formatData.filter(o => {
          if (!this.keyword) {
            return true;
          } else {
            return this.filterMethod(o.label,this.keyword)//o.label.toLowerCase().includes(this.keyword.toLowerCase());
          }
        }).map(item=>{
          if(item.userId){
            item.key=item.userId
          }else{
            item.key=item.label || Math.random();
          }
          return item
        })
      },
      suffixCls() {
        let cls = '';
        if (!this.visible) {
          // cls = 'icon-xiangxia';
          cls = 'el-icon-arrow-down';
        } else {
          if (this.clearable && this.selected.filter(Boolean).length > 0) {
            cls = 'iconfont icon-ziyuanxhdpi';
          } else {
            // cls = 'iconfont icon-xiangshang';
            cls = 'el-icon-arrow-up';
          }
        }
        if (this.hoverFlag && this.clearable && this.selected.filter(Boolean).length > 0) {
          return 'iconfont icon-ziyuanxhdpi'
        }
        return cls;
      },
    },
    methods: {
      handleClose(tag){
        this.selected=  this.selected.filter(item=>item!=tag)
      },
      handleToggle(visible) {
        this.isActive = visible;
        this.visible = visible;
        this.$nextTick(() => {
          if (this.$refs.input&&this.visible) {
            this.input.focus();
          }
          // if (this.$refs.options&&!this.jhVScroller) {
          //   this.jhVScroller = new window.JhVirtualScroll(this.$refs.options, {
          //     fetch: this.getData,
          //     skeleton: this.getSkeleton,
          //     render: this.toRender,
          //   });
          // } else {
          //   this.pageno = 0;
          //   this.keyword = '';
          //   // this.$refs.options.scrollTop=0
          //   this.jhVScroller = null;
          // }
          if(this.visible){

          }else {
            // this.jhVScroller = null;
            this.keyword = '';
          }
        });
      },
      handleInput() {
        this.handleToggle(true)
        // if (!this.jhVScroller) this.handleToggle(true);
        // this.$nextTick(() => {
        //   if (this.jhVScroller) {
        //     this.jhVScroller.onReload(() => {
        //       this.pageno = 0;
        //     });
        //   }
        // });
      },
      handleClick(data, div) {
        // div=div.path[1]
        if (data.disabled || data.isActive === 0) return false;
        const index = this.selected.indexOf(data.value);
        if (index > -1) {
          this.selected.splice(index, 1);
          if(div){
            div.classList.remove('selected');
          }

        } else {
          if(div) {
            div.classList.add('selected');
          }
          if (!this.multiple) {
            this.selected = [data.value];
            setTimeout(()=>{
              // this.$refs.popover.close()
               this.visible=false
            })
          }else {
            this.selected.push(data.value);
            this.keyword = ""
            this.$refs.input && this.visible && this.input.focus();
          }
        }
      },
      handleClear(event) {
        if (this.clearable && this.selected.filter(Boolean).length > 0) {
          event.stopPropagation();
          this.selected = [];
        }
      },
      handleAll() {
        const arr = [];
        this.formatData.forEach(item => {
          if (!item.disabled) {
            arr.push(item.value);
          }
        });
        this.selected = arr;
      },
      handleGroup(data) {
        if (data._disabled || !this.multiple) return false;
        const arr = [];
        this.formatData.forEach(o => {
          if (o._value === data._value && !o.disabled) {
            arr.push(o.value);
          }
        });
        let isexist = false;
        arr.forEach(item => {
          const index = this.selected.indexOf(item);
          if (index > -1) {
            isexist = true;
            this.selected.splice(index, 1);
          }
        });
        if (!isexist) {
          this.selected.push(...arr);
        }
      },
      getData() {
        return this.filterData.slice(
          (++this.pageno - 1) * this.pagesize,
          this.pageno * this.pagesize,
        );
      },
      getSkeleton() {
        var div = document.createElement('div');
        div.textContent = 'loading...';
        const styles = {
          width: '100%',
          lineHeight: '32px',
          boxSizing: 'border-box',
          padding: '0 5px',
          color: 'gray',
          fontSize: '12px',
          cursor: 'wait',
        };
        Object.keys(styles).forEach(key => {
          div.style[key] = styles[key];
        });
        div.title = '请稍候';
        return div;
      },
      toRender(data) {
        if (
          this.scopedHash !== null &&
          Object.keys(this.scopedHash).length === 0
        ) {
          Object.keys(this.$refs.options.dataset).forEach(key => {
            this.$set(this.scopedHash, key, '');
          });
          if (Object.keys(this.scopedHash).length === 0) {
            this.scopedHash = null;
          }
        }
        const classList = ['item'];
        if(data.focusState){
          classList.push('focus')
        }
        const context = document.createElement('div');
        context.style.width = '100%';
        var div;
        if (this.render) {
          div = this.render(data);
        } else {
          div = document.createElement('div');
          div.textContent = data.label;
        }
        if (data.disabled) {
          classList.push('is-disabled');
        }
        if (this.selected.includes(data.value)) {
          classList.push('selected');
        }
        div.classList = classList.join(' ');
        div.addEventListener('click', () => {
          this.handleClick(data, div);
        });
        if (data._header) {
          const header = document.createElement('div');
          header.textContent = data._label;
          header.classList.add('header');
          context.appendChild(header);
          context.appendChild(div);
          header.addEventListener('click', () => {
            this.handleGroup(data);
          });
        }
        if (data._footer) {
          const footer = document.createElement('div');
          footer.classList.add('footer');
          context.appendChild(div);
          context.appendChild(footer);
        }
        if (!data._header && !data._footer) {
          context.appendChild(div);
        }
        Object.keys(this.scopedHash || {}).forEach(hash => {
          context.childNodes.forEach(node => {
            node.dataset[hash] = '';
          });
        });
        return context;
      },
      autoSetStatus() {
        if (this.jhVScroller) {
          this.jhVScroller.vnodeList.forEach(vnode => {
            if (
              vnode.node &&
              !vnode.node
                .querySelector('.item')
                .classList.value.includes('is-disabled')
            ) {
              if (this.selected.includes(vnode.data.value)) {
                vnode.node.querySelector('.item').classList.add('selected');
              } else {
                vnode.node.querySelector('.item').classList.remove('selected');
              }
            }
          });
        }
      },
    },
    watch: {
      value:{
        handler(n,o){
          if (this.value instanceof Array) {
            this.selected = [...this.value];
            let selectList = []
            this.selected.forEach(item=>{
              this.data.forEach(i=>{
                if(item == i.userId){
                  selectList.push(item)
                }
              })
            })
            this.selected = selectList
          } else {
            if(this.value!==this.selected[this.selected.length-1]){
              this.selected = [this.value];
            }
          }
        },
        immediate:true
      },
      filterData(n,o){
        if(n.length>0){
          this.focusIndex=null
        }
      },
      selected() {
        if (this.multiple) {
          if (!this.value||this.selected.toString() !== this.value.toString()) {
            this.$emit('change', this.selected);
          }
        } else {
          if (this.selected !== this.value) {
            this.$emit('change', this.selected[0]);
          }
        }
        this.autoSetStatus();
      },
    },
  };
</script>

<style lang="scss" scoped>
  .jh-virtual-select {
    display: inline-block;
    box-sizing: border-box;
    /*width: 240px;*/
    height: 32px; // temp
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    &.is-disabled {
      background: #f5f7fa;
      border-color: #e4e7ed;
      cursor: not-allowed;
      .inner-input {
        cursor: not-allowed;
      }
    }
    &.is-active {
      border-color: #2dc993;
    }
    & > .content {
      flex: 1;
      padding: 0 10px;
      display: flex;
      justify-content: center;
      justify-content: center;
      .inner-text {
        flex: 4;
        width: 100%;
        /*height: 28px;*/
        /*line-height: 1;*/
        font-size: 14px;
        color: #666;
        .plac {
          color: #c0c4cc;
        }
        .tags {
          display: inline-block;
          line-height: 20px;
          color: #909399;
          padding: 0 5px;
          border-radius: 4px;
          background-color: #f0f2f5;
        }
      }
      .inner-input {
        flex: 1.5;
        width: 100%;
        display: block;
        border: none;
        line-height: 28px;
        outline: none;
        font-size: 14px;
        color: #666;
        background: transparent;
        &::placeholder {
          color: #c0c4cc;
        }
      }
    }
    & > .suffix {
      flex: none;
      width: 25px;
      text-align: center;
      margin-right: 5px;
      color: #c0c4cc;
      font-size: 14px;
      cursor: pointer;
      .icon-ziyuanxhdpi {
        &:hover {
          color: #409eff;
        }
      }
    }
  }
  .options {
    min-height: 40px;
    height: 250px;
    overflow: auto;
    padding: 3px 0;
    &::-webkit-scrollbar {
      width: 6px;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 6px;
      background: rgba(144, 146, 152, 0.5);
    }
    &::-webkit-scrollbar-track {
      border-radius: 6px;
      background: transparent;
    }
    .header {
      width: 100%;
      text-align: center;
      color: #909399;
      line-height: 30px;
      cursor: pointer;
      background: #f5f7fa;
      font-size: 14px;
    }
    .item {
      font-size: 14px;
      padding: 0 20px;
      position: relative;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: #606266;
      width: 100%;
      height: 34px;
      line-height: 34px;
      box-sizing: border-box;
      cursor: pointer;
      &.is-disabled {
        color: #c0c4cc;
        cursor: not-allowed;
      }
      &.focus {
       background: #f5f7fa;
      }
      &.selected {
        color: #409eff;
        font-weight: 700;
      }
      &:hover:not(.is-disabled) {
        background: #f5f7fa;
      }
    }
    .footer {
      height: 1px;
      background: #e4e7ed;
      width: 80%;
      margin: 6px auto 10px auto;
    }
  }
  .options_empty {
    padding: 10px 0;
    text-align: center;
    color: #999;
    font-size: 14px;
  }
  .options_btn {
    padding-bottom: 5px;
    text-align: center;
    border-bottom: 1px solid #f3f3f3;
    .btn {
      display: inline-block;
      cursor: pointer;
      background: #fff;
      border: 1px solid #dcdfe6;
      color: #606266;
      box-sizing: border-box;
      padding: 4px 8px;
      font-size: 12px;
      border-radius: 4px;
      margin: 0 8px;
      &:hover {
        color: #3a8ee6;
        border-color: #3a8ee6;
        background: #ecf5ff;
      }
    }
  }
  .jh-virtual-select{
    background: #fff;
  }
  .disabled{
    color: #C0C4CC!important;
    cursor: not-allowed!important;
  }

</style>
<style>
  .jh-popover .handler{
    width: 100%
  }
</style>
