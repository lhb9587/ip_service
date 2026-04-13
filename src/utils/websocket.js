import Vue from 'vue'
import socketio from 'socket.io-client';
import { getToken } from './auth'
const tokenID = getToken()
const WSS_URL = `http://192.168.0.169:9643?tokenID=${tokenID}`
let Socket = ''
Socket = socketio.connect(WSS_URL,(e)=>{
  console.log('链接成功',e)
});

Socket.on('messageEvent',(e)=>{
  if(e.mailInfoList){
    this.$store.commit('caseInformation/SET_REPORTEDTEMPORARILY',e.mailInfoList)
  }
})
Vue.prototype.socketIo=Socket
