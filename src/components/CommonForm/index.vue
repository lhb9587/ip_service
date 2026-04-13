<template>
  <div class="commonForm">
    <el-form v-if="!view" ref="commonForm" :model="formLabelAlign" :rules="rules" label-width="120px" >
      <el-form-item
        v-for="item in formItems"
        :key="item.prop"
        :label="item.label"
        :prop="item.prop"
        :style="{width:item.fill?'100%':'50%'}"
      >
        <el-input
          v-if="item.el === 'input'"
          :placeholder="item.placeholder"
          v-model="formLabelAlign[item.prop]"
        ></el-input>
        <el-input
          v-if="item.el === 'textarea'"
          type="textarea"
          :rows="item.row || 5"
          :placeholder="item.placeholder"
          v-model="formLabelAlign[item.prop]"
        >
        </el-input>
        <el-switch
          v-if="item.el === 'switch'"
          v-model="formLabelAlign[item.prop]"
        ></el-switch>
        <el-slider
          v-if="item.el === 'slider'"
          v-model="formLabelAlign[item.prop]"
        ></el-slider>
        <el-select v-if="item.el === 'select'" @change="e=>handleChange(e,item.change)" v-model="formLabelAlign[item.prop]" clearable filterable >
          <el-option
            v-for="option in item.options"
            :key="item.props?option[item.props.label]:option.label"
            :label="item.props?option[item.props.label]:option.label"
            :value="item.props?option[item.props.value]:option.value"
          ></el-option>
        </el-select>
        <el-radio-group
          v-if="item.el === 'radio'"
          v-model="formLabelAlign[item.prop]"
        >
          <el-radio
            v-for="radio in item.options"
            :key="radio.label"
            :label="radio.value"

          >{{ radio.label }}</el-radio
          >
        </el-radio-group>
        <el-table
          v-if="item.el === 'table'"
          :data="formLabelAlign[item.prop]"
          border
          style="width:100%">
          <el-table-column
            v-for="column in item.columns"
            :label="column.label"
            :width="column.width"
          >
            <template slot-scope="scope">
              <div v-if="column.renderCell">
                <functionalComponent :render="column.renderCell"  :params="scope.row" ></functionalComponent>
              </div>
              <div v-else>
                <el-input
                  :placeholder="item.placeholder"
                  v-model="scope.row[column.prop]"
                ></el-input>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <functionalComponent v-if="item.render" :render="item.render"  :params="formLabelAlign" />

        <slot :slot="item.prop" />
      </el-form-item>
    </el-form>
    <el-form v-else :model="formLabelAlign"  label-width="120px" >
      <el-form-item
        v-for="item in formItems"
        :key="item.prop"
        :label="item.label"
      >
        <span v-if="item.el === 'select'">
         {{$commonUtils.transformation(item.options,formLabelAlign[item.prop],item.props?item.props.value:'value',item.props?item.props.label:'label')}}
        </span>
        <functionalComponent v-else-if="item.render" :render="item.render"  :params="formLabelAlign" />
        <span v-else>
          {{formLabelAlign[item.prop]}}
        </span>
        <slot :slot="item.prop" />
      </el-form-item>
    </el-form>
  </div>

</template>
<script>
  const functionalComponent = {
    functional: true,
    props: {
      render: Function,
      params: Object,
    },
    render(h, ctx) {
      const params = { ...ctx.props.params };
      return ctx.props.render.call(ctx, h, params);
    }
  }
  export default {
    name: "CommonForm",
    props: {
      view:{

      },
      formLabelAlign: {
        type: Object,
        require: true,
        defalut: () => ({}),
      },
      formItems: {
        type: Array,
        require: true,
      },
    },
    data(){
      var rules={}
      this.formItems.forEach(item=>{
        rules[item.prop]=[{required:item.required?item.required:false,message:`请填写${item.label}`,trigger:item.trigger}]
      })
      return{
        rules,
        customerNameIdList:[]
      }
    },
    methods:{
      handleChange(e,cb){
        if(cb){
          cb(e)
        }
      },
     submitForm(formName) {

       return this.$refs.commonForm.validate()
      },
    },

    components: {
      functionalComponent
    }
  };
</script>
<style lang="scss" scoped>
  .commonForm  /deep/.el-form{
    display: flex;
    flex-wrap: wrap;
    /*justify-content: center;*/
    padding: 20px;
    margin:0 20px ;
    .el-select,.el-input,.el-date-picker,.el-textarea{
      width: 95%;
    }
    .el-textarea{
      margin: 10px 0;
    }
    input{
      height: 28px;
    }
    .el-input__icon{
      line-height: 28px;
    }
    .el-form-item{
      width: 50%;
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
  }
  .button_wrap {
    width: 100%;
    display: flex;
    justify-content: center;
    .el-button{
      margin-left: 30px;
    }
  }
  /deep/ .el-form-item__error{
    position: relative;
    top: 0;
  }
</style>
