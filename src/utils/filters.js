export function formatDecimal(num, decimal) {
  num = num.toString();
  var index = num.indexOf('.');
  if (index !== -1) {
    num = num.substring(0, decimal + index + 1)
  } else {
    num = num.substring(0)
  }
  return Number(num).toFixed(decimal)
}
export function formatAmount(amount) {
  if((Number(amount)<0)) {
    if(Number(amount)){
      amount=-amount
      amount = '' + (Number(amount)).toFixed(2);
      // amount = '' + (Number(amount)+0.004).toFixed(2);
      var x = amount.split('.');
      var x1 = x[0];
      var x2 = '.' + x[1];
      var rgx = /(\d+)(\d{3})/;
      while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
      }
      return '-'+x1 + x2;
    } else {
      return -amount
    }
  }else {
    if(Number(amount)) {
      // amount = '' + (Number(amount)+0.004).toFixed(2);
      amount = '' + (Number(amount)).toFixed(2);
      var x = amount.split('.');
      var x1 = x[0];
      var x2 = '.' + x[1];
      var rgx = /(\d+)(\d{3})/;
      while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
      }
      return x1 + x2;
    } else {
      return amount
    }
  }
  // return amount
}
export function fomatFloat(num,n){
  var f = parseFloat(num);
  if(isNaN(f)){
    return false;
  }
  f = Math.round(num*Math.pow(10, n + 1))/Math.pow(10, n + 1); // n 幂
  f = Math.round(f*Math.pow(10, n))/Math.pow(10, n); // n 幂
  var s = f.toString();
  var rs = s.indexOf('.');
  //判定如果是整数，增加小数点再补0
  if(rs < 0){
    rs = s.length;
    s += '.';
  }
  while(s.length <= rs + n){
    s += '0';
  }
  return s;
}
// export function formatAmount1(amount) {
//   if((Number(amount)<0)) {
//     if(Number(amount)){
//       amount=-amount
//       amount = '' + parseInt(amount*100));
//       let num=amount
//       if(num.endsWith('0')){
//         num=''+((Number(amount)+10)/100)
//       }else {
//         num=''+((Number(amount))/100)
//       }
//
//       var x = num.split('.');
//       var x1 = x[0];
//       var x2 = '.' + x[1];
//       var rgx = /(\d+)(\d{3})/;
//       while (rgx.test(x1)) {
//         x1 = x1.replace(rgx, '$1' + ',' + '$2');
//       }
//       return '-'+x1 + x2;
//     } else {
//       return -amount
//     }
//   }else {
//     if(Number(amount)) {
//       let num=amount
//       num = '' + parseInt(amount*100)
//
//       if(num.endsWith('0')){
//         num=''+((Number(amount)+10)/100)
//       }else {
//         num=''+((Number(amount))/100)
//       }
//       // amount = '' + (Number(amount)+0.04).toFixed(1);
//       var x = num.split('.');
//       var x1 = x[0];
//       var x2 = '.' + x[1];
//       var rgx = /(\d+)(\d{3})/;
//       while (rgx.test(x1)) {
//         x1 = x1.replace(rgx, '$1' + ',' + '$2');
//       }
//       return x1 + x2;
//     } else {
//       return amount
//     }
//   }
//   // if (Number(amount)) {
//   //   amount = '' + (Number(amount)+0.04).toFixed(1);
//   //   var x = amount.split('.');
//   //   var x1 = x[0];
//   //   var x2 = '.' + x[1];
//   //   var rgx = /(\d+)(\d{3})/;
//   //   while (rgx.test(x1)) {
//   //     x1 = x1.replace(rgx, '$1' + ',' + '$2');
//   //   }
//   //   return x1 + x2;
//   // } else {
//   //   return amount
//   // }
//   // return amount
// }
export function toFixed1(amount){
  if(amount>=0){
    var numStr=''+parseInt(amount*100)
    if(numStr.endsWith('0')){
      return parseInt((Number(numStr)/100)*10)/10
    } else {
      return parseInt(((Number(numStr)+10)/100)*10)/10
    }
  }else {
    var numStr='' + parseInt(amount*100)
    if(numStr.endsWith('0')){
      return parseInt((Number(numStr)/100)*10)/10
    } else {
      return parseInt(((Number(numStr)-10)/100)*10)/10
    }
  }
}
export function formatAmount1(number){
  return (''+toFixed1(number)).replace(/(\d)(?=(\d{3})+\.)/g, function($0, $1) {
    return $1 + ",";
  });
}
export function getdate(str) {
  if(str){
    var now = new Date(str),
      y = now.getFullYear(),
      m = now.getMonth() + 1,
      d = now.getDate();
    return y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d) + " " + now.toTimeString().substr(0, 8);
  } else {
    return ''
  }
}
export function toFixed2(num) {
  if(num=>0){
    let str = ""; //字符串累加
    str +=  num.toFixed(2)
      .replace(/(\d)(?=(\d{3})+\.)/g, function($0, $1) {
        return $1 + ",";
      });
    return str; //字符串=>数组=>反转=>字符串
  }else {
    let str = "";
    str +=  -num.toFixed(2)
      .toString()
      .replace(/(\d)(?=(\d{3})+\.)/g, function($0, $1) {
        return $1 + ",";
      });
    return '-'+str; //字符串=>数组=>反转=>字符串
  }
}

// 金额转换千分符
export function stateFormat(cellValue) {
  if (!cellValue) {
    return ''
  }
  // 将 cellValue 转换为浮点数，并确保保留两位小数
  let formattedValue = parseFloat(cellValue).toFixed(2);

  // 检查小数部分
  if (formattedValue.endsWith('.00')) {
    // 去掉小数部分
    formattedValue = formattedValue.slice(0, -3);
  }

  // 对整数部分添加千分位
  // 使用正则表达式只格式化整数部分
  formattedValue = formattedValue.replace(/(\d)(?=(\d{3})+\.)/g, function($0, $1) {
    return $1 + ',';
  });

  return formattedValue;
}
