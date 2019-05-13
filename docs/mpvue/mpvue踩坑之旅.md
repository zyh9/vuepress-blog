---
title: mpvue踩坑之旅
sidebar: true
date: 2019-03-14
tags:
  - mpvue
---

:::tip
mpvue踩坑之旅，持续更新中...
:::

<!-- more -->

## v-show的使用

> 在添加v-show指令的元素上，不要使用 display:flex;

## v-for、v-if同时使用

[vue文档，请戳我](https://cn.vuejs.org/v2/guide/list.html#v-for-with-v-if)

## gulp压缩zip

> 安装依赖 npm i gulp gulp-zip gulp-vsftp gulp-ignore dayjs -D

```javascript
	//只针对压缩zip
	const fs = require('fs');
	const path = require('path');
	const gulp = require('gulp');
	const vsftp = require('gulp-vsftp');
	const gulpIgnore = require('gulp-ignore');//过滤文件插件
	const zip = require('gulp-zip');//生成zip插件
	const dayjs = require('dayjs');
	const distFile = 'dist';//打包目录
	const packageInfo = require("./package.json");

	process.env.PLATFORM = process.argv[process.argv.length - 1] || 'wx';

	const gulpZip = () => gulp.src(path.resolve(distFile + '/' + process.env.PLATFORM + '/**'))
		.pipe(gulpIgnore.exclude('*.map'))
		.pipe(zip('名称' + process.env.PLATFORM + '-' + packageInfo.version + '-' + dayjs().format('YYYY-MM-DD HH-mm-ss') + '.zip'))
		.pipe(gulp.dest('./'))

	//压缩打包文件
	gulp.task('wx', gulpZip)
	gulp.task('swan', gulpZip)
	gulp.task('tt', gulpZip)
	gulp.task('my', gulpZip)

	// gulp.task--定义任务
	// gulp.src--找到需要执行任务的文件
	// gulp.dest--执行任务的文件的去处
	// gulp.watch--观察文件是否发生变化
```

> package.json添加指令

```javascript
	"scripts": {
		"zip": "npm run build:wx && gulp wx",
		"zip:wx": "npm run zip",
		"zip:swan": "npm run build:swan && gulp swan",
		"zip:tt": "npm run build:tt && gulp tt",
		"zip:my": "npm run build:my && gulp my"
	}
```

## 地理位置获取

		引入腾讯的微信小程序JavaScript SDK
		
		因为微信小程序wx.getLocation API 返回的是地理位置坐标
		
		所以要用到地址逆解析，然后就是一顿复制
		
		var QQMapWX = require('xxx/qqmap-wx.js')...
		
		然后就出问题了，貌似SDK最后的代码是这样导出的module.exports = QQMapWX;
		
		改为export default QQMapWX; 引入改为import QQMapWX from 'XXX/qqmap-wx-jssdk.js'; 即可
		
		百度的微信小程序JavaScript SDK和其类似，故此不再赘述

> 注：另一种解决方法，把地图SDK放到static下，别让它被webpack编译就不会报错了

[腾讯 微信小程序 SDK](http://lbs.qq.com/qqmap_wx_jssdk/index.html)

[百度 微信小程序 SDK](https://github.com/baidumapapi/wxapp-jsapi)

[高德 微信小程序 SDK](http://lbs.amap.com/api/wx/summary)

## 距离计算

```javascript
	distance(lat1, lng1, lat2, lng2) {
	    var radLat1 = lat1 * Math.PI / 180.0;
	    var radLat2 = lat2 * Math.PI / 180.0;
	    var a = radLat1 - radLat2;
	    var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
	    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
	    s = s * 6378.137;
	    s = Math.round(s * 10000) / 10000;
	    return s; //返回数值单位：公里
	}
```

> 取小数点后两位

		Math.floor(this.distance(lat1, lng1, lat2, lng2)*100)/100;

##  一个处理地理坐标系的js库

> 安装 and 引入

```javascript
	npm install gcoord --save
	
	<script src="https://unpkg.com/gcoord/dist/gcoord.js"></script>
	
	CommonJS:
	
		const gcoord = require( 'gcoord' );
		const { transform, WGS84, GCJ02 } = require( 'gcoord' );
	
	ES Module:
	
		import gcoord from 'gcoord'
		import { transform, WGS84, GCJ02 } from 'gcoord';
```

> 小例子

```javascript
	var result = gcoord.transform(
	    [ 116.403988, 39.914266 ],    // 经纬度坐标
	    gcoord.WGS84,                 // 当前坐标系
	    gcoord.BD09                   // 目标坐标系
	)
	
	console.log( result );  // [ 116.41661560068297, 39.92196580126834 ]
```

[gcoord github地址，请戳我](https://github.com/hujiulong/gcoord)

## autoprefixer配置

> npm i autoprefixer -D

> 在文件.postcssrc.js里面添加"autoprefixer":{}

```javascript
	module.exports = {
	  "plugins": {
	    "postcss-mpvue-wxss": {},
	    "autoprefixer":{}
	  }
	}
```

## 小程序之一键回到顶部和获取滚动条当前位置

> 1.获取滚动条当前位置

```javascript
	onPageScroll(e){ // 获取滚动条当前位置
		console.log(e)
	}
```

> 2.回到顶部

```javascript
	goTop: function (e) {  // 一键回到顶部
		if (wx.pageScrollTo) {
			wx.pageScrollTo({
				scrollTop: 0
			})
		} else {
			wx.showModal({
				title: '提示',
				content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
			})
		}
	}
```

## ES7 async/await 使用

> 先看数据请求代码

```javascript

	//数据请求地址
	const baseUrl = 'localhost:8080';

	const commonHeader = _ => {
		//headers每次必传数据存放位置
		return {
			//...
		}
	}

	//get数据请求
	const get = (opt = {}) => {
		let time = new Date().getTime();
		const str = Object.entries(opt.params).map(e => `${e[0]}=${e[1]}`).join("&").replace(/\s/g, '');
		let editHeaders = Object.assign({}, { 'content-type': 'application/json' }, commonHeader())
		opt.headers && (editHeaders = Object.assign({}, editHeaders, opt.headers))
		return new Promise((resolve, reject) => {
			let address = str ? `${opt.url}?${str}&t=${time}` : `${url}?t=${time}`;
			wx.request({
				url: baseUrl + address,
				header: editHeaders,
				method: "GET",
				success: res => {
					setTimeout(_ => {
						resolve(res.data)
					}, 0)
				},
				fail: err => {
					reject(err);
				}
			})
		})
	}

	//post数据请求
	const post = (opt = {}) => {
		let time = new Date().getTime();
		let editHeaders = Object.assign({}, { 'content-type': 'application/json' }, commonHeader())
		opt.headers && (editHeaders = Object.assign({}, editHeaders, opt.headers))
		return new Promise((resolve, reject) => {
			wx.request({
				url: `${baseUrl}${opt.url}?t=${time}`,
				data: opt.data || {},
				header: editHeaders,
				method: "POST",
				success: res => {
					setTimeout(_ => {
						resolve(res.data)
					}, 0)
				},
				fail: err => {
					reject(err)
				}
			})
		})
	}

	export default { get, post };

```

```javascript
	// 代码示例
	let shopInfo = async _ =>{
		let data1 = await this.util.post({
			url:'http://XXXXXX',
			data:{
				demo:'111'
			}
		})
		console.log(data1)
		let data2 = await this.util.post({
			url:'http://XXXXXX',
			data:{
				demo:'111'
			}
		})
		console.log(data2)
	}
	
	//async函数内部抛出错误，会导致返回的 Promise 对象变为reject状态
	
	//抛出的错误对象会被catch方法回调函数接收到
	
	shopInfo().then(res=>{console.log(res)}).catch(err=>{console.log(err)})
```

## vuex的加入

```javascript
		
	// 小程序内部是不能手动去刷新页面的，这就为状态管理的实现提供了可能性
	
	// 某些状态不需要长期存储，索性投入vuex的怀抱吧。。。
	
	// 引用数据请求
	import util from './utils/index';
	Vue.prototype.util = util;
	// 引用toast提示
	import msg from './utils/toast';
	Vue.prototype.msg = msg;
	// 引用vuex
	import store from './store/index';
	Vue.prototype.$store = store;
	
	// 发起action => 
	
	this.$store.dispatch('code',{a:1,b:2})
	
	// 获取state数据 =>
	
	this.$store.state.mutations
```

> 示例代码

```javascript
	// store/index.js
	import Vue from 'vue';
	import Vuex from 'vuex';
	import mutations from './mutations';
	import actions from './actions';
	Vue.use(Vuex)
	export default new Vuex.Store({
		modules:{
			mutations
		},
		actions
	})
	
	
	// store/types.js
	import keymirror from 'keymirror'
	let types = keymirror({
	    COMMIT_CODE:null,
	})
	export {types};
	
	
	// store/actions.js
	import {types} from './types.js'
	const actions = {
	    code({commit},val){
	        commit(types.COMMIT_CODE,val)
	    },
	}
	export default actions;
	
	
	// store/mutations.js
	import {types} from './types.js'
	// 定义state的值
	const state = {
	    qrcode:null
	}
	// 每个action的提交引发state的改变
	const mutations = {
	    [types.COMMIT_CODE](state,val){
	        state.qrcode = val
	    },
	}
	// 获取到变化的值
	const getters = {
	    qrcode(state){
	        return state.qrcode;
	    }
	}
	// 导出
	export default{
		state,
		mutations,
		getters
	}
```

## 关于canvas请求网络图片绘制

		网络图片的绘制在真机实测的时候是不会显示的，可以调用以下方法先获取本地图片路径，再进行canvas绘制
		
		wx.downloadFile(OBJECT)  ||  wx.getImageInfo(OBJECT)
		
		针对多个图片获取地址的解决方法，将上述两个方法用Promise包装一下
		
		再使用async/await来获取所有的图片本地地址，用catch来抛出图片地址获取异常的情况

```javascript
	//获取线上图片生成本地临时路径
	const downImg = val => {
		return new Promise((resolve, reject) => {
			//判断本地图片路径是否存在
			if (val.indexOf('wxfile://') == -1) {
				wx.downloadFile({
					url: val,
					success: res => {
						resolve(res.tempFilePath)
					},
					fail: err => {
						reject(err)
					}
				})
			} else {
				resolve(val)
			}
		})
	}
```

> 优化图片请求方式，采用异步加载

```javascript
	Promise.all([this.downImg(this.QrCodeUrl),
			this.downImg(this.Logo)
	]).then(res=>{
			console.log(res,111)
	}).catch(err=>{
			console.log(err,222)
	})
```

## canvas文字截取

```javascript
	/**
	 * ctx,画布对象
	 * str,需要绘制的文字
	 * splitLen,切割的长度字符串
	 * strHeight,每行文字之间的高度
	 * x,位置
	 * y,位置
	 */
	fontLineFeed(ctx, str, splitLen, strHeight, x, y) {
		let strArr = [];
		for (let i = 0, len = str.length / splitLen; i < len; i++) {
			strArr.push(str.substring(i * splitLen, i * splitLen + splitLen));
		}
		if (str.length > splitLen) {
			strArr[0] = strArr[0] + '...';
		}
		// console.log(strArr[0])
		// let s = 0;
		// for (let j = 0, len = strArr.length; j < len; j++) {
		//     s = s + strHeight;
		//     ctx.fillText(strArr[j], x, y + s);
		// }
		ctx.fillText(strArr[0], x, y);
	}
```

## 虚拟导航层级处理

> 灵感源自于有赞对虚拟导航的处理方式，判断当前路径是否在路径数组中，存在即回退，不存在则导向新的路径，可解决层级过深的问题

```javascript
	let index = getCurrentPages().findIndex(e => e.route == 'pages/index/main');
	if (index > -1) {
		wx.navigateBack({
			delta: getCurrentPages().length - 1 - index
		})
	} else {
		wx.navigateTo({
			url: '/pages/index/main'
		})
	}
```

## 页面层级过深，采取折回处理

```javascript
	//path路径 示例：'pages/index/main'
	const goPath = path => {
		let index = getCurrentPages().findIndex(e => e.route == path);
		if (index > -1) {
			getCurrentPages()[index].onUnload();
			wx.navigateBack({
				delta: getCurrentPages().length - (index > 0 ? index + 1 : index),
				success: res => {
					setTimeout(_ => {
						wx.redirectTo({
							url: `/${path}`
						})
					}, 500)
				},
				fail: err => {}
			})
		} else {
			wx.navigateTo({
				url: `/${path}`
			})
		}
	}
```

## 小程序0.5像素边框

> 跟1px边框实现方式大同小异，使用伪类来实现

```css
	element:before {
		content: '';
		position: absolute;
		top: -50%;
		bottom: -50%;
		left: -50%;
		right: -50%;
		-webkit-transform: scale(0.5);
		transform: scale(0.5);
		border: 1px solid #999;
		border-radius: 6rpx;
	}
```

## 检测是否授权

```javascript
	const isAuth = (name) => {
		return new Promise((resolve, reject) => {
			wx.getSetting({
				success: (res) => {
					if (res.authSetting[name]) {
						resolve();
					} else {
						reject();
					}
				},
				fail: (err) => {
					reject(err);
				}
			})
		})
	}
```

## 微信APP定位权限关闭以及小程序定位权限关闭

> 只看getLocation API fail的处理方式

```javascript
	fail: err => {
		wx.hideLoading();
		//无定位判断
		if(wx.getStorageSync('QQmap')&&!wx.getStorageSync('QQmap').mapGet){
			reject('位置信息获取失败，启用无定位搜索');
		}else{
			wx.getSetting({
				success: ok => {
					if(!(ok.authSetting['scope.userLocation'])){
						//小程序位置信息权限关闭
						console.log('小程序定位未开启')
						model(1);
					}else{
						console.log('手机定位未开启')
						model(2);
					}
				},
				fail: error => {
						console.log('权限获取失败')
				}
			})
			reject('位置信息获取失败');
		}
	}
```

> 地理位置授权

```javascript
	const model = val => {
		wx.showModal({
			title: '定位失败',
			content: `未获取到你的地理位置，请检查${val==1?'小程序':'微信APP'}是否已关闭定位权限，或尝试重新打开小程序`,
			// showCancel:false,
			success: res => {
				if (res.confirm) {
					console.log('用户点击确定')
					if(val==1){
						wx.redirectTo({
							url: '/pages/wx-auth/main?type=1'
						})
					}
					//调用wxLogin接口
				} else if (res.cancel) {
					console.log('用户点击取消')
					// model(val);
					//调用wxLogin接口 
				}
			}
		})
	}
```

## 小程序跳转另一个小程序

> 注：小程序基础库 2.1.2 开始支持 wx.getLaunchOptionsSync() 方法

		可使用navigator标签，但想要在另外一个小程序来接受参数的话就需要使用到extra-data属性

		但在跳转过去的onShow(options){}里，并未获取到referrerInfo信息

		解决方法：使用小游戏的 wx.getLaunchOptionsSync() 方法

## textarea去除输入法上方完成栏

```html
	<textarea :show-confirm-bar="false"></textarea>
```
## scroll-view左右滑动失效

		1.scroll-view 中的需要滑动的元素不可以用 float 浮动；

		2.scroll-view 中的包裹需要滑动的元素的大盒子用 display:flex; 是没有作用的；

		3.scroll-view 中的需要滑动的元素要用 dislay:inline-block; 进行元素的横向编排；

		4.包裹 scroll-view 的大盒子有明确的宽和加上样式-->  overflow:hidden;white-space:nowrap;

## 关于滚动吸顶的实践

		滚动吸顶利用onPageScroll和createIntersectionObserver均有操作延迟，暂时用position: sticky解决

[参考链接，请戳我](https://www.zhangxinxu.com/wordpress/2018/12/css-position-sticky/)

## 打开小程序设置页（wx.openSetting）接口调整

[微信开放社区，请戳我](https://developers.weixin.qq.com/community/develop/doc/000cea2305cc5047af5733de751008)

	方法1：使用button组件来使用此功能，示例代码如下：

		<button open-type="openSetting" bindopensetting="callback">打开设置页</button>

	方法2：由点击行为触发wx.openSetting接口的调用，示例代码如下：

		<button bindtap="openSetting">打开设置页</button>  =>  openSetting(){wx.openSetting()}

	其他方法：在点击中调用showModal，showModal的回调再调用openSetting也可以

## 强制数据更新（数据层级太多，render函数没有自动更新，需手动强制刷新）

```javascript
    this.$forceUpdate();
```

[vuejs文档，请戳我](https://cn.vuejs.org/v2/api/#vm-forceUpdate)

## mpvue多个页面公用一个vm对象的问题

```javascript
	Object.assign(this.$data, this.$options.data())
```

[github issues地址，请戳我](https://github.com/Meituan-Dianping/mpvue/issues/140)

## 函数节流防抖参考链接

[30-seconds-of-code，请戳我](https://github.com/Chalarangelo/30-seconds-of-code/tree/master/snippets)

## vue 与 throttle 的坑

[参考链接，请戳我](http://fszer.github.io/2018/01/21/vue与throltte的坑/)

## 小程序图片裁剪上传插件

[we-cropper地址，请戳我](https://github.com/we-plugin/we-cropper)

## 图片裁剪根据像素比来提高裁剪图片清晰度

> canvas的绘制函数为异步函数，故作延时处理之后导出裁剪区域图片，再做图片上传

[we-cropper在mpvue中截图模糊问题](https://github.com/we-plugin/we-cropper/wiki/FAQ)

[getCropperImage参数，v1.3.3支持](https://we-plugin.github.io/we-cropper/#/api?id=wecroppergetcropperimageoptcallback)

## 优化setState的数据频繁更新

[github issues地址，请戳我](https://github.com/Meituan-Dianping/mpvue/issues/639)

## 热更新失效问题以及文件拷贝出错问题

[github issues地址，请戳我](https://github.com/Meituan-Dianping/mpvue/issues/801)

## mpvue-loader升级指南

[更改日志，请戳我](http://mpvue.com/change-log/)

[升级指南以及webpack配置，请戳我](http://mpvue.com/change-log/2018.7.24/)

## 获取用户位置信息时需填写用途说明

[permission 属性配置，请戳我](https://developers.weixin.qq.com/community/develop/doc/000ea276b44928f7e8d73d0a65b801)

## 支持多端的http请求库

[Fly.js地址，请戳我](https://github.com/wendux/fly)

## 多端支持更新文档

[github issues地址，请戳我](https://github.com/Meituan-Dianping/mpvue/issues/1155)

[胡成全mpvue-platform-sample项目示例，请戳我](https://github.com/hucq/mpvue-platform-sample)

## mpvue2.0升级指南

[github releases地址，请戳我](https://github.com/Meituan-Dianping/mpvue/releases/tag/2.0.0)

## mpvue重要更新，页面更新机制进行全面升级

[github issues地址，请戳我](https://github.com/mpvue/blog/issues/2)

## sentry的加入

[npm库，请戳我](https://github.com/a526672351/sentry-weapp)

[掘金食用链接，请戳我](https://juejin.im/post/5cc2b8b9e51d456e40377319)

[小程序开发错误收集，请戳我](https://zhuanlan.zhihu.com/p/37448840)

```javascript
	// ./src/app.vue
	import Raven from 'sentry-weapp'
	export default {
		onLaunch() {
			Raven.config('https://xxx@your.example.com/x', {
				release: '1.0.0', //版本号
				environment: 'production',
				allowDuplicates: true, // 允许相同错误重复上报
				sampleRate: 0.5 // 采样率
			}).install()
		},
		onError(msg) {
			// Raven.captureException(msg)
			Raven.captureException(msg, {
				level: 'error'
			})
		}
	}
```

[map文件生成，请戳我](https://zj-john.github.io/tips/cjepmrn7o009vu8f0a1ky1dkb.html)

## UglifyJsPlugin压缩配置

```javascript
	// ./build/webpack.base.conf.js
	var useUglifyJs = process.env.PLATFORM !== 'swan'
	var isProduction = process.env.NODE_ENV==='production'? true : false
	if (useUglifyJs) { // 非百度小程序开启JS代码压缩
		baseWebpackConfig.plugins.push(
			new webpack.optimize.UglifyJsPlugin({
				compress:{
				warnings: false,
				drop_debugger: isProduction,
				drop_console: isProduction
				},
				// 生产环境开启map文件生成
				sourceMap: isProduction
			})
		)
	}
```
