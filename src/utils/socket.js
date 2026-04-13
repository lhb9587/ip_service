export default class WebSocketClass {
  constructor(url, msgCallback,time) {
    const IS_HTTPS = document.location.protocol.includes('https')
    let wsProtocol = IS_HTTPS ? 'wss://' : 'ws://'

    this.wsUrl = `${wsProtocol}${url}`
    this.msgCallback = msgCallback;
    //-------------------------------------------------------------------------------
    this.ws = null;  // websocket对象
    this.status = null; // websocket是否关闭
    this.pingPong = null;
    this.time = time;     //心跳时间
    this.initTimeOut =null;     //重连定时器
    this.initTime = 3000   //重连时间
    this.init()
    this.heartbeatTimeoutTimer = null;
  }

  init(data) {
    this.ws = new WebSocket(this.wsUrl);
    // eslint-disable-next-line consistent-return
    this.ws.onopen = () => {
      this.status = 'open';
      // this.heartCheck();
      this.startHeartbeat();
      if (data) {
        return this.ws.send(data);
      }
    };

    this.ws.onmessage = e => {
      if (e.data == 'ping') {
        // this.pingPong = 'pong';
        console.log(`收到ws信息:${e.data}`);
        this.resetHeartbeatTimeout()
        return false;
      }
      this.msgCallback(e.data);
      return false
    };

    this.ws.onclose = () => {
      // console.log('onclose',new Date().toLocaleTimeString());
      if (this.status == 'close') {
        // if (this.pingInterval && this.pongInterval) {
        //   clearInterval(this.pingInterval);
        //   clearInterval(this.pongInterval);
        // }
        if (this.heartbeatTimer) {
          clearInterval(this.heartbeatTimer)
        }
        console.log('关闭成功,清除定时器,停止运行');
        return
      }
      if (this.initTimeOut) {
        console.log(`正在重启----${new Date().getSeconds()}`);
        //  this.init();
        return
      };
      this.initTimeOut = setTimeout(()=>{
        this.initTimeOut = null;
        this.init();
      },this.initTime) // 重连延迟时间
    }

    this.onerror = e => {
      console.log(e,'onerror');
      this.closeHandle(e); // 判断是否关闭
    }
  }
  startHeartbeat() {
    this.heartbeatTimer = setInterval(() => {
      if (this.ws.readyState === 1) {
        this.ws.send('ping'); // 发送心跳消息
        // console.log('发送心跳消息: ping',new Date().toLocaleTimeString());
        this.startHeartbeatTimeout();
      }
    }, this.time);
  }
  startHeartbeatTimeout() {
    this.heartbeatTimeoutTimer = setTimeout(() => {
      console.error('心跳超时，连接可能已断开');
      this.closeHandle()
    }, 3000);
  }
  resetHeartbeatTimeout() {
    clearTimeout(this.heartbeatTimeoutTimer);
    // this.startHeartbeatTimeout();
  }

  // heartCheck() {          // 心跳
  //   this.pingPong = 'ping';
  //   this.pingInterval = setInterval(() => {
  //     if (this.ws.readyState === 1) {
  //       this.ws.send('ping');               // 客户端发送ping
  //       console.log('心跳检测:发送ping')
  //     }
  //   },this.time);
  //   this.pongInterval = setInterval(() => {
  //     if (this.pingPong == 'ping') {
  //      console.log('心跳检测:后端未返回pong,准备重启webSocket');
  //       this.closeHandle('pingPong没有改变为pong'); // 没有返回pong 重启webSocket
  //     }else {
  //       console.log('心跳检测:返回pong');
  //       this.pingPong = 'ping'
  //     }
  //   }, this.time+2000)
  // }

  sendHandle(data) {
    //console.log(`发送消息给服务器:`,data);
    return this.ws.send(data);
  }
  closeHandle() {
    if (this.status !== 'close') {
      console.log(`断开，重连websocket----${new Date().getSeconds()}`,);
      //  this.closeMyself()
      // this.init()
      // if (this.pingInterval && this.pongInterval) {
      //   clearInterval(this.pingInterval);
      //   clearInterval(this.pongInterval);
      // }
      if (this.heartbeatTimer) {
        clearInterval(this.heartbeatTimer)
      }
      this.ws.close();
      console.log(`容错:手动关闭成功----${new Date().getSeconds()}`);
    } else {
      // if (this.pingInterval && this.pongInterval) {
      //   clearInterval(this.pingInterval);
      //   clearInterval(this.pongInterval);
      // }
      if (this.heartbeatTimer) {
        clearInterval(this.heartbeatTimer)
      }
      //console.log(`this.ws.readyState`);
    }
  }
  // 手动关闭WebSocket
  closeMyself() {
    this.status = 'close';
    console.log(`手动关闭`, this.ws);
    this.ws.close();
    console.log(`手动关闭成功`);
  }
}
