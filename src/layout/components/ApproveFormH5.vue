<template>
  <div>
    <div class="content-case">
      <div class="case-row" v-for="(item, key) of formData" :key="key">
        <div class="row-left">{{keyValue[key]}}</div>
        <div class="row-right">
          <div v-if="key === 'materialList'">
            <div style="color: #409eff;height: 30px;" v-for="file in formData[key]" @click="onPreview(file)">
              {{file.materialName}}
            </div>
          </div>
          <div v-else>{{formData[key]}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {getProgID} from "../../utils/editInOffice";

  export default {
    name: "ApproveFormH5",
    props: {
      formData: {
        type: Object,
        default: () => ({})
      },
      keyValue: {
        type: Object,
        default: () => ({})
      }
    },
    methods: {
      async onPreview(data) {
        let url = data.address
        if (['doc', 'docx'].includes(url.replace(/.+\./, "").toLocaleLowerCase())) {
          const ul = await this.$commonUtils.viewPdf(`${url}`, true)
          window.open(`/ipdoc${ul}`.replace(/[+]/g, '%2B'))
        } else if (['eml', 'msg'].includes(url.replace(/.+\./, '').toLocaleLowerCase())) {
          let flag = ''
          if (data.mailId) {
            flag = 'mailId'
          } else if (data.materialId) {
            flag = 'materialId'
          }
          url = url.replace(/&/g, '%26')
          window.open(`#/preView?address=ipdoc${url}&${flag}=${data[flag]}`.replace(/[+]/g, '%2B'))
        } else if (['pdf', 'jpg', 'png'].some(item => url.replace(/.+\./, "").toLocaleLowerCase() == item)) {
          window.open(`/ipdoc${url}`.replace(/[+]/g, '%2B'))
        } else {
          // this.downLoad(data)
        }
      },
    }
  }
</script>

<style lang="scss" scoped>
  .content-case {
    /*height: 900px;*/
    /*width: 100%;*/
    margin: 0px 10px 10px 10px;
    background-color: #fff;
    border-radius: 10px;
    padding: 0 10px 0 10px;
    font-size: 13px;
  }


  .case-row {
    display: flex;
    justify-content: space-between;
    line-height: 35px;
    border-bottom: 1px solid #EBEEF5;

    .row-left {
      margin-right: 10px;
      flex-shrink: 0;
    }

    &:last-child {
      border: none;
    }
  }

</style>
