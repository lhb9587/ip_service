 let ports = new Map()
var connectList = [];
var textlist = [],
  connectList = [];
let nolist=[];
self.addEventListener('connect', function (e) {
  var port = e.ports[0]
  port.start();
  port.addEventListener('message', function (e) {
    // obj.target = e.currentTarget;
    var worker = e.currentTarget,
      res = e.data;
    if (connectList.indexOf(worker) === -1) {
      connectList.push(worker)
    }

    switch (res.status) {
      case 0:

        inform(function (item) {
          if (item != worker) {
            // localStorage.setItem('aaaa','44')
            item.postMessage('有新用户加入 历史标签页总数'+connectList.length);

          } else {

            // localStorage.setItem('aaaa','44')
            item.postMessage('我是新用户编号'+connectList.length);

            // item.postMessage(connectList);
          }
        });
        break;
      case 1:
        nolist.push(res.no);
        inform(function (item) {
          if (item != worker) {
            // localStorage.setItem('aaaa','44')
            //  item.postMessage('有新用户加入 历史标签页总数'+connectList.length);
          } else {
            // localStorage.setItem('aaaa','44')
            item.postMessage('自己的号码牌为'+res.no+JSON.stringify(nolist));
            // item.postMessage(connectList);
          }
        });
        break;
      case 2:
        inform(function (item) {
          if (item != worker) {
            // localStorage.setItem('aaaa','44')
            //  item.postMessage('有新用户加入 历史标签页总数'+connectList.length);
          } else {
            // localStorage.setItem('aaaa','44')
            item.postMessage({type:'socket',ports:ports});
            // item.postMessage(connectList);
          }
        });
        break;
      case 'heartbeat': // 心跳
        ports.set(res, +new Date())
        break;
      default:
        textlist.push(res.data.value);
        inform(textlist);
        break;
    }
  })
  setInterval(() => {
    let now = +new Date()
    for (var [key, value] of ports) {
      console.log(now - value + " = " + value);
      if (now - value > 3100) {
        // 3秒以上没发心跳，标签页已关闭
        ports.delete(key)

      }
    }
  }, 1000)
});

// 分发消息
function inform(obj) {
  var cb = (typeof obj === 'function') ? obj : function (item) {
    item.postMessage(obj);
  }
  connectList.forEach(cb);
}
