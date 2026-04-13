<template>
    <div>
      <input type="file" ref="uploadXLSX" accept=".xls,.xlsx" class="outputlist_upload" style="display: none">
    </div>
</template>

<script>
import XLSX from 'xlsx'
export default {
  props:{
    clickUpload:{
      type: Boolean,
      default: false
    }
  },
  name: "index",
  mounted(){
    this.$refs.uploadXLSX.addEventListener('change', e => {//绑定监听表格导入事件
      this.readExcel(e);
    })
  },
  methods:{
    readExcel(e) {//表格导入
      var that = this;
      const files = e.target.files;
      if(files.length<=0){//如果没有文件名
        return false;
      }else if(!/\.(xls|xlsx)$/.test(files[0].name.toLowerCase())) {
        this.$Message.error('上传格式不正确，请上传xls或者xlsx格式');
        return false;
      }
      const fileReader = new FileReader();
      fileReader.onload = (ev) => {
        try {
          const data = ev.target.result;
          const workbook = XLSX.read(data, {
            type: 'binary'
          });

          const wsname = workbook.SheetNames[0];//取第一张表
          const ws =XLSX.utils.sheet_to_json(workbook.Sheets[wsname]);//生成json表格内容
          console.log(ws);
          this.$emit('getFirstSheet',ws)
          this.$refs.uploadXLSX.value = '';
        } catch (e) {
          return false;
        }
      };
      fileReader.readAsBinaryString(files[0]);
    },
  },
  watch:{
    clickUpload(n){
      if(n){
        this.$refs.uploadXLSX.click()
        this.$emit('changeClick',false)
      }
    }
  }
}
</script>

<style scoped>

</style>
