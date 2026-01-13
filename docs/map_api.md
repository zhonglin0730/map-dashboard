地图组件在线地址
地址：https://dlhditu.hzsxkj.cn/#/
注意事项:	
1.以下接口所涉及到的经纬度须为国家CGCS2000或WGS84坐标系
1.监听IFrame向父页面发送消息
示例代码
// 监听iframe向父页面发送消息
    window.addEventListener("message", (e) => {
      if (e.data.type) return;
      let action = e?.data?.action;
      let config = e?.data?.config;
      switch (action) {
        // 监听地图初始化完成
        case "mapInitSuccess":
          break;
        case "mapClick":
          console.log("监听地图点击", config);
          // e.data?.config:{ //   x// 经度 //   y// 纬度 // }
          break;
        case "mapMove":
          console.log("监听地图移动、缩放", config);
          // e.data?.config:{ //   heading // 地图旋转角度 //   tilt // 地图倾斜角度 //   x// 中心点 经度 //   y// 中心点 纬度 //   zoom// 地图缩放级别 // }
          break;
        case "layerClick":
          // 返回自定义图层传入的config信息
          console.log("监听图层点击", config);
          break;
        case "draw":
          //绘图等分析类工具
          console.log("draw", config);
      }

2.地图定位
操作类型action:	
  locate
请求参数config:
参数名	传值	描述
x	120.500638	默认当前地图中心点经度
y	30.629476	纬度，默认当前地图中心点经度
zoom	11	地图放大级别，默认当前地图放大级别
pitch	45	地图倾斜度，默认当前地图倾斜度
heading	0	地图旋转角度，默认当前地图旋转角度
duration	1	飞行时间，默认飞行时间为1秒
示例代码
let data = {
        action: "locate",
        config: {
          x: 120.93114413362566, // 经度，默认当前地图中心点经度
          y: 30.5478246511195, // 纬度，默认当前地图中心点经度
          zoom: 13, // 地图放大级别，默认当前地图放大级别
          pitch: 63.8153816612258, // 地图倾斜度，默认当前地图倾斜度
          heading: 330.4710058374905, // 地图旋转角度，默认当前地图旋转角度
        },
      };
      this.$refs.Iframe.contentWindow.postMessage(data, "*");

3.切换底图
操作类型action:	
setbasemap
请求参数config:
参数名	传值	描述
type		tdt_img 天地图影像地图
tdt_vec 天地图矢量地图
示例代码
   let data = {
        action: "setbasemap",
 config: {
                type: "tdt_vec",
              },
      };
      this.$refs.Iframe.contentWindow.postMessage(data, "*");



4.添加自定义图层
操作类型action:	
addlayer
接口描述
config中可传入其他额外参数，点击图层时会向父页面发送点击事件，内容为整个config
4.1批量添加点
n 接口描述
1. 批量添加点，支持自定义文字颜色、图片样式
2.允许图片传入gif格式，此时需要传入billboard.imageAnimation为true
请求参数config:
参数名	传值	描述
id		图层id
type	point	图层类型:点
billboard	查看【标签样式说明】章节
{
                  image:
                    "http://39.175.164.238:8088/upimage/JAVA_FILE/SRSM/IAGX0H0M5cwHYSdi.jpg",
                  width: 50,
                  height: 30,
                  layout: { // horizontal、vertical、{x:30,y:40}
                    x: 10,
                    y: 10,
                  },
                }
	仅在传name时有效
，billboard与point都传，优先billboard

list	[{
   x: 120.919048, // 经度
   y: 30.561467, // 纬度
  z: 30, // 高程
  name: '点位', // 显示名称
 ...properties
}]	含经度（x）、纬度（y）、高程（z 可不传）的数组，支持额外自定义属性传入
font
	查看【字体说明】章节	
point	查看【点样式说明】章节	
n 示例代码

let data = {
              action: "addlayer",
              config: {
                id: 5656,
                type: "point",
                layout: "horizontal",
                list: [
                  {
                    x: 121.119157,
                    y: 30.728787,
                    name: "测试",
                  },
                ],
billboard:{
                image: "http://39.175.164.238:8088/upimage/JAVA_FILE/SRSM/IAGX0H0M5cwHYSdi.jpg",
                  width: 50,
                  height: 30,
},
                font: {
                  fontSize: 14,
                  color: "#ff00ff",
                  backgroundColor: "rgba(255,255,0,0.6)",
                },
              },
            };
      this.$refs.Iframe.contentWindow.postMessage(data, "*");
n 

4.2批量添加面
接口描述
1. 批量添加面，支持自定义文字颜色、图片样式
请求参数config:
参数名	传值	描述
id		图层id
type	polygon	图层类型
billboard	查看【标签样式说明】章节	仅在传name时有效
，billboard与point都传，优先billboard

list	[{
   positions:[
          [
            [121.02300238935369, 30.689519092911425],
            [121.02300223600002, 30.689504534000015],
            [121.02300204600007, 30.689486497000036],
            [121.02301548145923, 30.689486391426975],
            [121.02300238935369, 30.689519092911425]
          ]
        ],
  name: '点位', // 显示名称
 ...properties
}]	含经度（x）、纬度（y）、高程（z 可不传）的数组，支持额外自定义属性传入
font
	查看【字体说明】章节	
point	查看【点样式说明】章节	
polyline	查看【线样式说明】章节	
polygon	查看【面样式说明】章节	
n 示例代码

let data = {
              action: "addlayer",
              config: {
                id: 5656,
                type: "polygon",
             
                list: [
                  {
                   positions:[
          [
            [121.02300238935369, 30.689519092911425],
            [121.02300223600002, 30.689504534000015],
            [121.02300204600007, 30.689486497000036],
            [121.02301548145923, 30.689486391426975],
            [121.02300238935369, 30.689519092911425]
          ]
        ],
                    name: "测试",
                  },
                ],
              },
            };
      this.$refs.Iframe.contentWindow.postMessage(data, "*");
n 

4.3批量添加线
n 接口描述
1. 批量添加线，支持自定义线样式
请求参数config:
参数名	传值	描述
id		图层id
type	polygon	图层类型
billboard	查看【标签样式说明】章节	仅在传name时有效
，billboard与point都传，优先billboard

list	[{
   positions:[
          [
            [121.02300238935369, 30.689519092911425],
            [121.02300223600002, 30.689504534000015],
            [121.02300204600007, 30.689486497000036],
            [121.02301548145923, 30.689486391426975],
            [121.02300238935369, 30.689519092911425]
          ]
        ],
  name: '点位', // 显示名称
 ...properties
}]	含经度（x）、纬度（y）、高程（z 可不传）的数组，支持额外自定义属性传入
font
	查看【字体说明】章节	
point	查看【点样式说明】章节	
polyline	查看【线样式说明】章节	
n 示例代码

let data = {
              action: "addlayer",
              config: {
                id: 5656,
                type: "polyline",
             
                list: [
                  {
                   positions:[
          [
            [121.02300238935369, 30.689519092911425],
            [121.02300223600002, 30.689504534000015],
            [121.02300204600007, 30.689486497000036],
            [121.02301548145923, 30.689486391426975],
            [121.02300238935369, 30.689519092911425]
          ]
        ],
                    name: "测试",
                  },
                ],
              },
            };
      this.$refs.Iframe.contentWindow.postMessage(data, "*");
n 

4.4批量添加围墙
接口描述
1. 批量添加围墙，支持动态围墙、渐变围墙、自定义文字颜色
请求参数
参数名	传值	描述
id		图层id
type	wall	图层类型
billboard	查看【标签样式说明】章节	仅在传name时有效
，billboard与point都传，优先billboard

list	[{
   positions:[
            [121.02300238935369, 30.689519092911425],
            [121.02300223600002, 30.689504534000015],
            [121.02300204600007, 30.689486497000036],
            [121.02301548145923, 30.689486391426975],
            [121.02300238935369, 30.689519092911425]
        ],
  name: '点位', // 显示名称
 ...properties
}]	含经度（x）、纬度（y）、高程（z 可不传）的数组，支持额外自定义属性传入
font
	查看【字体说明】章节	
point	查看【点样式说明】章节	
wall	查看【围墙样式说明】章节	
n 示例代码

let data = {
              action: "addlayer",
              config: {
                id: 5656,
                type: "wall",
                list: [{
   positions:[
            [121.02300238935369, 30.689519092911425],
            [121.02300223600002, 30.689504534000015],
            [121.02300204600007, 30.689486497000036],
            [121.02301548145923, 30.689486391426975],
            [121.02300238935369, 30.689519092911425]
        ],
  name: '点位', // 显示名称
}],
                font: {
                  fontSize: 14,
                  color: "#ff00ff",
                  backgroundColor: "rgba(255,255,0,0.6)",
                },
wall: {
              type:'uprise', 
                  color: "#ff00ff",
               
                },

              },
            };
      this.$refs.Iframe.contentWindow.postMessage(data, "*");
n 

4.5批量添加扩散波纹
n 接口描述
1. 添加动态扩散波纹，支持自定义线样式
请求参数
参数名	传值	描述
id		图层id
type	scanline	图层类型
list	[{
   x: 120.919048, // 经度
   y: 30.561467, // 纬度
  z: 30, // 高程
  name: '点位', // 显示名称
 ...properties
}]	含经度（x）、纬度（y）、高程（z 可不传）的数组，支持额外自定义属性传入
color	光波颜色	
maxRadius	扩散最大半径	
duration	持续时间	
n 示例代码
 let data = {
      action: "addlayer",
      config: {
        id: 5656,
        type: "scanline",
        list: [
          {
            x: 120.919048, // 经度
            y: 30.561467, // 纬度
            z: 30, // 高程
            name: "点位", // 显示名称
            ...properties,
          },
        ],
        color: "#CE1374",
        maxRadius: 1200,
        duration: 10,
      },
    };
    this.$refs.Iframe.contentWindow.postMessage(data, "*");

5.删除自定义图层
操作类型action:	
removelayer
请求参数config:
type和ids都传则都会判断，都不传则会删除全部
参数名	传值	描述
type	point点, polyline 线,polygon 面,text 文字，point_list批量点	要删除的图层类型
ids	[图层id1,图层id2]	需要删除的图层id数组
map		同“5.1”
示例代码
let data = {
        action: "removelayer",
        config: {
        },
      };
      this.$refs.Iframe.contentWindow.postMessage(data, "*");


6.开启量测
操作类型action:	
  openmeasure
请求参数config:
参数名	传值	描述
type	distance、area	测距、测面
color	#00ff00	量测的颜色，默认绿色
示例代码
 let data = {
    action: "openmeasure",
    config:{
        type:'distance'
    }
  };
      this.$refs.Iframe.contentWindow.postMessage(data, "*");

7.清除重新量测
操作类型action:	
  resetmeasure
示例代码
let data = {
        action: "resetmeasure",
      };
      this.$refs.Iframe.contentWindow.postMessage(data, "*");

8.关闭量测
操作类型action:	
  removemeasure
示例代码
let data = {
        action: "removemeasure",
      };
      this.$refs.Iframe.contentWindow.postMessage(data, "*");

9.绘图
操作类型action:	
  draw
请求参数config:
参数名	传值	描述
type	point	传入值：point/polyline/polygon
color	#f00	点线面颜色
示例代码
 let data = {
    action: "draw",
    config:{
        type:'point',
    }
  };
      this.$refs.Iframe.contentWindow.postMessage(data, "*");


10.清除绘图
操作类型action:	
  cleardraw
请求参数config:
参数名	传值	描述
type	point	传入值：point/polyline/polygon
示例代码
 let data = {
    action: "cleardraw",
    config:{
        type:'point',
    }
  };
      this.$refs.Iframe.contentWindow.postMessage(data, "*");


11.其他说明
11.1字体说明
涉及到本文档的字体设置传入参数为：
字段	传入值	备注
fontSize	12	文字大小，默认16
fontColor	#fff	支持rgba、rgb、十六进制，文字颜色，默认#fff
outlineWidth		文字描边粗细，默认0
outlineColor		文字描边颜色，默认无
backgroundColor	#1e76cc	默认字体背景色#1e76cc
distanceDisplayCondition	{near:0,far:10000}	可见区域，near不传默认0
scaleByDistance	{near:{height:50000,scale:1},far:{height:150000,scale:0.6}}	根据高度设置缩放比例，默认高度50000以下scale1，超过150000时scale0.6，支持仅传near或者far
eyeOffset	[0, 0, -5]	文字x、y、z方向偏移量
z	标签高度	在类型为polygon、wall、polyline时有效
11.2点样式说明
涉及到本文档的点样式设置传入参数为：
字段	传入值	备注
size	10	点大小，默认10
color	#1e76cc	点颜色，支持rgba、rgb、十六进制，文字颜色，默认#fff
outlineWidth		文字描边粗细，默认2
outlineColor		文字描边颜色，默认#fff
distanceDisplayCondition	{near:0,far:10000}	可见区域，near不传默认0
11.3标签样式说明
涉及到本文档的标签样式设置传入参数为：
字段	传入值	备注
image	http://39.175.164.238:8088/upimage/JAVA_FILE/SRSM/IAGX0H0M5cwHYSdi.jpg	点位图标的地址，不传则不显示图标
支持url及base64，图片大小不传默认20px*20px
imageAnimation	false	图片为动画时传入true，仅在添加点时有效
width	30	图片宽度，默认20px
height	30	图片高度，默认20px
layout	horizontal、vertical、{x:30,y:40}	layout左右排列：horizontal，上下排列：vertical，自定义xy对象设置偏移量(仅在有icon且有name的情况下有效)

distanceDisplayCondition	{near:0,far:10000}	可见区域，near不传默认0
rotation	0	图片旋转角度
scaleByDistance	{near:{height:50000,scale:1},far:{height:150000,scale:0.6}}	根据高度设置缩放比例，默认高度50000以下scale1，超过150000时scale0.6，支持仅传near或者far
11.4线样式说明
涉及到本文档的线样式设置传入参数为：
字段	传入值	备注
type	flow	dash虚线（参PolylineDashMaterialProperty
除color、width外参考该类）
不传普通颜色
flow流动线
color	rgba(0,0,0,0.4)	颜色
width	2	默认值2
image	图片地址	type为flow有效
repeat	100	type为flow有效
图片重复几次
duration	2000	type为flow有效
动画一次执行时间
11.5面样式说明
涉及到本文档的面样式设置传入参数为：
字段	传入值	备注
fillColor	rgba(0,0,0,0.4)	颜色
11.6围墙样式说明
涉及到本文档的围墙样式设置传入参数为：
字段	传入值	备注
type	uprise	uprise动态上升线
gradient渐变色围墙
不传普通颜色
maximumHeight	10	围墙顶点高度，默认100
minimumHeight	0	围墙底部高度，默认0
color	rgba(0,0,0,0.4)	颜色
