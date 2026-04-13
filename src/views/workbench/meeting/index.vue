<template>
  <div id="meet"></div>
</template>

<script>
  export default {
    name: "index",
    created() {

    },
    mounted() {
      const domain = 'meet.jit.si';
      const options = {
        roomName: 'JitsiMeetAPIExample',
        // width: '700',
        // height: '700',
        configOverwrite:{
          defaultLanguage:'zhCN'
        },
        parentNode: document.querySelector('#meet')
      };
      const api = new JitsiMeetExternalAPI(domain, options)
      api.executeCommand('passWord','6666')
    }
  }
</script>

<style lang="scss" scoped>
#meet{
  position: fixed;
width: 100%;
  height: 100%;
  background: #fff;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  z-index: 100000;
}
</style>
