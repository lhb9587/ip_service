export default function getData(type, option) {
  let emphasis={
    iconStyle:{
      textPosition:'left'
    }
  }
  if(option.dimensional==2&&option.chartType=='pie'){
    type ='cake'
  }

  if(option.x&&Math.max(...option.x.map(item=>item.length))>4||(option.x&&option.x.join('').includes('条'))){
    option.formatX=true
  }
  function getPieOption(item) {

    item.series = item.series.map(ele => {
      ele.value = ele.data[ele.data.length - 2];
      return ele;
    });


    return item;
  }
  switch (type) {
    case 'bar':
      return {
        grid: {
          containLabel: true
        },
        title: {
          text: option.title,
          subtext: "纯属虚构",
          x: "center"
        },
        color: ["#3398DB"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },

        toolbox: {
          show: true,
          feature: {
            mark: {
              show: true
            },
            dataView: {
              show: true,
              emphasis,
              readOnly: false
            },
            magicType: {
              show: true,
              type: ["line", "bar"]
            },
            restore: {
              show: true
            },
            saveAsImage: {
              show: true,
              emphasis,
              title:'保存为图片',
              type:'jpg',
              backgroundColor:'#fff',
              connectedBackgroundColor:'#fff'
            }

            // dataZoom: { show: true }
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [{
          type: "category",
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          axisTick: {
            alignWithLabel: true
          }
        }],
        yAxis: [{
          type: "value"
        }],
        series: [{
          name: "直接访问",
          type: "bar",
          barWidth: "60%",
          data: [10, 52, 200, 334, 390, 330, 220]
        }]
      }
    case 'axis':
      return {
        title: {
          text: option.title,
          x: "center"
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
            shadowStyle: {
              shadowOffsetY: '2000'
            }

          }
        },
        legend: {
          // type: "scroll",
          bottom: "bottom",
          data: option.series.filter(item => item.name)
        },
        toolbox: {
          show: true,
          orient: 'vertical',
          left: 'right',
          top: 'center',
          feature: {
            mark: {
              show: true
            },
            dataView: {
              show: true,
              emphasis,
              readOnly: false
            },
            magicType: {
              show: true,
              emphasis,
              type: ['line', 'bar', 'stack', 'tiled']
            },
            restore: {
              show: true
            },
            saveAsImage: {
              show: true,
              emphasis,
              title:'保存为图片',
              type:'jpg',
              backgroundColor:'#fff',
              connectedBackgroundColor:'#fff'
            }
          }
        },
        xAxis: [{
          type: 'category',
          axisTick: {
            show: false
          },
          data: option.x.map(str=>{
            if(option.formatX){
              let str1=''
              if(str.length>5){
                str1=str.slice(0,5)
              }else {
                str1=str
              }

              return str1.split('').join(" ").replace(/\s/g, '\n')
            }else {
              return str
            }

          })
        }],
        yAxis: [{
          type: 'value'
        }],
        grid: {
          containLabel: true
        },
        series: option.series.map(item => {
          console.log(item);
          item.type = option.chartType;
          if(option.series.length&&option.series.reduce((pre,next)=>pre+next.data.length,0)<16){
            item.label={}
            item.label.show=true
            item.label.formatter="{c}"
            item.label.rich={
              textShadowOffsetY:111,
              c: {
                fontSize: 12,

              }
            }
          }

          return item})
      }
    case 'pie':
      option = getPieOption(option);

      return {
        grid: {
          containLabel: true
        },
        title: {
          text: option.title + '-' + option.x[option.x.length - 2],
          subtext: option.x[option.x.length - 2],
          x: "center"
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        toolbox: {
          show: true,
          orient: 'vertical',
          left: 'right',
          top: 'center',
          feature: {
            mark: {
              show: true
            },
            dataView: {
              show: true,
              emphasis,
              readOnly: false
            },

            restore: {
              show: true
            },
            saveAsImage: {
              show: true,
              emphasis,
              title:'保存为图片',
              type:'jpg',
              backgroundColor:'#fff',
              connectedBackgroundColor:'#fff'
            }
          }
        },
        legend: {
          type: "scroll",
          bottom: "bottom",
          data: option.series.map(item => item.name)
        },
        series: [{
          name: option.title,
          type: "pie",
          radius: "55%",
          center: ["50%", "60%"],
          data: option.series,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)"
            }
          }
        }]
      }
    case 'cake':
      // option = getPieOption(option);

      return {
        grid: {
          containLabel: true
        },
        title: {
          text: option.title ,
          // subtext: option.x,
          x: "center"
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        toolbox: {
          show: true,
          orient: 'vertical',
          left: 'right',
          top: 'center',
          feature: {
            mark: {
              show: true
            },
            dataView: {
              show: true,
              emphasis,
              readOnly: false
            },

            restore: {
              show: true
            },
            saveAsImage: {
              show: true,
              emphasis,
              title:'保存为图片',
              type:'jpg',
              backgroundColor:'#fff',
              connectedBackgroundColor:'#fff'
            }
          }
        },
        legend: {
          orient:'vertical',
          top:'top',
          type: "scroll",
          left: "left",
          data: option.series.map(item => item.name)
        },
        series: [{
          name: option.title,
          type: "pie",
          radius: "55%",
          center: ["50%", "60%"],
          data: option.series.map(item=>{
            item.label={}
            item.label.show=true
            if(option.title=='客户'){
              item.label.formatter="{b}-{c}"
            }else {
              item.label.formatter="{b}-{c}-{d}%"
            }

            // item.name =item.name+'-'+item.value
            return item
          }),
          // emphasis:{
          //   label:{
          //     rich: {
          //       a: {
          //         // 没有设置 `align`，则 `align` 为 right
          //       }
          //     }
          //   }
          // },
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)"
            }
          }
        }]
      }
    case 'db':
      return {
        title: {
          text: option.title,
          // subtext: 'ceshi',
          x: "center"
        },
        "tooltip": {
          "confine": true,
          "transitionDuration": 0.5,
          "enterable": true,
          "extraCssText": "padding: 10px 15px;max-height:256px;overflow: auto;box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 10px, rgba(0, 0, 0, 0.16) 0px 3px 10px"
        },
        "legend": {
          "textStyle": {
            "fontSize": 12,
            "color": "#333",
            "fontFamily": "Microsoft YaHei"
          },
          "left": "right",
          "top": "top",
          "show": true,
          "orient": "vertical",
          "type": "scroll",
          "data": ["账单", "案量"]
        },
        "toolbox": {
          "show": false
        },
        "xAxis": [{
          "type": "value",
          "gridIndex": 0,
          "inverse": true,
          "axisLine": {
            "show": true,
            "lineStyle": {
              "width": 1,
              "type": "solid",
              "color": "#333"
            }
          },
          "splitLine": {
            "show": false,
            "lineStyle": {
              "type": "dotted",
              "color": "#ccc",
              "width": 1
            }
          },
          "axisTick": {
            "show": true,
            "lineStyle": {
              "width": 1,
              "type": "solid",
              "color": "#333"
            }
          },
          "axisLabel": {
            "show": true,
            "fontFamily": "Microsoft YaHei",
            "fontSize": 12,
            "color": "#333",
            "interval": "auto",
            "rotate": "0"
          },
          "data":option.series.map(item=>item.fullname) ,
          "max": 800
        }, {
          "type": "value",
          "gridIndex": 1,
          "inverse": false,
          "axisLine": {
            "show": true,
            "lineStyle": {
              "width": 1,
              "type": "solid",
              "color": "#333"
            }
          },
          "splitLine": {
            "show": false,
            "lineStyle": {
              "type": "dotted",
              "color": "#ccc",
              "width": 1
            }
          },
          "axisTick": {
            "show": true,
            "lineStyle": {
              "width": 1,
              "type": "solid",
              "color": "#333"
            }
          },
          "axisLabel": {
            "show": true,
            "fontFamily": "Microsoft YaHei",
            "fontSize": 12,
            "color": "#333",
            "interval": "auto",
            "rotate": "0"
          },
          "data": [],
          "max": 800
        }, {
          "type": "value",
          "gridIndex": 2,
          "inverse": false,
          "axisLine": {
            "show": true,
            "lineStyle": {
              "width": 1,
              "type": "solid",
              "color": "#333"
            }
          },
          "splitLine": {
            "show": false,
            "lineStyle": {
              "type": "dotted",
              "color": "#ccc",
              "width": 1
            }
          },
          "axisTick": {
            "show": true,
            "lineStyle": {
              "width": 1,
              "type": "solid",
              "color": "#333"
            }
          },
          "axisLabel": {
            "show": true,
            "fontFamily": "Microsoft YaHei",
            "fontSize": 12,
            "color": "#333",
            "interval": "auto",
            "rotate": "0"
          },
          "data": [],
          "max": 800
        }],
        "yAxis": [{
          "type": "category",
          "gridIndex": 0,
          "axisLine": {
            "show": true,
            "lineStyle": {
              "width": 1,
              "type": "solid",
              "color": "#888888"
            }
          },
          "splitLine": {
            "show": false,
            "lineStyle": {
              "type": "dotted",
              "color": "#ccc",
              "width": 1
            }
          },
          "axisTick": {
            "show": false,
            "lineStyle": {
              "width": 1,
              "type": "solid",
              "color": "#888888"
            }
          },
          "axisLabel": {
            "show": true,
            "fontFamily": "Microsoft YaHei",
            "fontSize": 12,
            "color": "#777575",
            "interval": "auto"
          },
          "data": option.series.map(item=>item.fullname),
          "position": "right"
        }, {
          "type": "category",
          "gridIndex": 1,
          "axisLine": {
            "show": true,
            "lineStyle": {
              "width": 1,
              "type": "solid",
              "color": "#888888"
            }
          },
          "splitLine": {
            "show": false,
            "lineStyle": {
              "type": "dotted",
              "color": "#ccc",
              "width": 1
            }
          },
          "axisTick": {
            "show": false,
            "lineStyle": {
              "width": 1,
              "type": "solid",
              "color": "#888888"
            }
          },
          "axisLabel": {
            "show": false,
            "fontFamily": "Microsoft YaHei",
            "fontSize": 12,
            "color": "#777575",
            "interval": "auto"
          },
          "data":option.series.map(item=>item.fullname),

        }, {
          "type": "category",
          "gridIndex": 2,
          "axisLine": {
            "show": false,
            "lineStyle": {
              "width": 1,
              "type": "solid",
              "color": "#888888"
            }
          },
          "splitLine": {
            "show": false,
            "lineStyle": {
              "type": "dotted",
              "color": "#ccc",
              "width": 1
            }
          },
          "axisTick": {
            "show": true,
            "lineStyle": {
              "width": 1,
              "type": "solid",
              "color": "#888888"
            }
          },
          "axisLabel": {
            "show": true,
            "fontFamily": "Microsoft YaHei",
            "fontSize": 12,
            "color": "#777575",
            "interval": "auto"
          }
        }],
        "grid": [{
          "left": "20",
          "right": "52%",
          "top": 60,
          "bottom": "30"
        }, {
          "left": "52%",
          "right": "8%",
          "top": 60,
          "bottom": "30"
        }, {
          "left": "8%",
          "right": "8%",
          "top": 60,
          "bottom": "30"
        }],
        "series": [{
          "colId": "col402utokg",
          "name": "账单总数",
          "type": "bar",
          "stack": null,
          "data":option.series.map(item=>{
            item.value=item.billSum
            item.colb1a4nsv3=item.fullname
            return item
          }) ,
          "xAxisIndex": 0,
          "yAxisIndex": 0,
          "label": {
            "position": "inside",
            "fontFamily": "Microsoft YaHei",
            "show": false,
            "fontSize": 12,
            "color": "#333"
          }
        }, {
          "colId": "col3kkgr6h9",
          "name": "案量总数",
          "type": "bar",
          "stack": null,
          "data":option.series.map(item=>{
            item.value=item.caseSum
            item.colb1a4nsv3=item.fullname
            return item
          }) ,
          "xAxisIndex": 1,
          "yAxisIndex": 1,
          "label": {
            "position": "inside",
            "fontFamily": "Microsoft YaHei",
            "show": false,
            "fontSize": 12,
            "color": "#333"
          }
        }],
        "color": ["#3fb1e3", "#6be6c1", "#626c91", "#a0a7e6", "#FF9966", "#96dee8", "#ec7e7f", "#c4ebad"]
      }
    default:
      break;
  }


}
