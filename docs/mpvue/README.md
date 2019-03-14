---
title: mpvue
sidebar: true
date: 2019-03-14
categories: mpvue
---

:::tip
mpvue踩坑之旅
:::

<!-- more -->

## 单包demo

[单包demo（已加入分包配置），请戳我](https://github.com/zyh9/mpvue-apps/tree/master/Single-package)

```javascript
	//main.json配置（单个页面的配置）
	{
		navigationBarTitleText: '',//导航文字
		navigationBarBackgroundColor: '',//导航颜色
		backgroundTextStyle: "dark",//下拉loading样式
		enablePullDownRefresh: true,//启用下拉刷新
		onReachBottomDistance: 60//触底距离
	}
```

> webpack分包配置（需要修改配置文件）

[mpvue-loader 1.1.2-rc.2 之后的版本已支持分包，请戳我](http://mpvue.com/mpvue/quickstart/#4-2018723)

```javascript
	//webpack.base.conf.js文件
	const appEntry = { app: resolve('./src/main.js') }

	function getEntry (rootSrc, path) {
		var map = {};
		glob.sync(rootSrc + '/' + path + '/**/main.js')
		.forEach(file => {
			var key = relative(rootSrc, file).replace('.js', '');
			map[key] = file;
		})
		return map;
	}

	let entry;
	const pagesEntry = getEntry(resolve('./src'), 'pages')
	// 判断app.json文件中是否包含subpackages配置来判断单包、分包
	let appJson = require('../src/app.json')
	let subpackages = appJson.subpackages || appJson.subPackages || [];
	if(subpackages.length){
		let entryPath = subpackages.map(({root})=>({root}))
		let entryArray = [];
		entryPath.forEach( e =>{
			entryArray.push(getEntry(resolve('./src'), e['root']))
		})
		entry = Object.assign({}, appEntry, pagesEntry, ...entryArray)
	}else entry = Object.assign({}, appEntry, pagesEntry)
```

## 分包demo

[分包demo，请戳我](https://github.com/zyh9/mpvue-apps/tree/master/Multi-package)

		前提是项目代码体积已经超过2M的项目才可以使用此方法

		小程序单包最大支持2M，分包后最大可支持8M，故此需要对其进行分包处理

		将单个页面的配置单独存储于pages.js内（有点像路由的配置文件）

		然后根据功能性来划分相应模块，只有用户触及到某些模块的时候才会去加载

		相应的也就提高了进入小程序的加载速度

[mpvue-entry，请戳我](https://github.com/F-loat/mpvue-entry)

> mpvue-entry1.x.x版本的配置

```javascript
	//pages.js配置（单个页面的配置以及路径）
	module.exports = [
		{
			path: 'pages/index',//主包页面所在路径
			config: {
				navigationBarTitleText: '',//导航文字
				navigationBarBackgroundColor: '',//导航颜色
				backgroundTextStyle: "dark",//下拉loading样式
				enablePullDownRefresh: true,//启用下拉刷新
				onReachBottomDistance: 60//触底距离
			}
		},
		{
			path: 'pagesOther/other',//分包页面所在路径
			subPackage: true,//是否分包，主包可不用配置此项
			config: {
				navigationBarTitleText: '',//导航文字
				navigationBarBackgroundColor: '',//导航颜色
				backgroundTextStyle: "dark",//下拉loading样式
				enablePullDownRefresh: true,//启用下拉刷新
				onReachBottomDistance: 60//触底距离
			}
		}
	]
```
> mpvue-entry2.0之后的配置，已加入mpvue-config-loader

[demo地址，请戳我](https://github.com/zyh9/mpvue-apps/tree/master/mpvue-other/Multi-package)

## mpvue-entry好搭档mpvue-config-loader

[mpvue-config-loader](https://github.com/F-loat/mpvue-config-loader)

> app.json的路径以及config配置（不需要mpvue-config-loader依赖）

```json
	"pages":[
		{
			"path": "pages/index",
			"config": {
				"navigationBarTitleText": "首页"
			}
		},
		{
			"path": "pages/order",
			"config": {
				"navigationBarTitleText": "订单"
			}
		},
		{
			"path": "pages/user",
			"config": {
				"navigationBarTitleText": "我的"
			}
		},
		{
			"path": "pagesOther/other",
			"subPackage": true,
			"config": {
				"navigationBarTitleText": "其它"
			}
		}
	]
```

> app.json的路径以及单个vue文件的config配置（需要mpvue-config-loader依赖）

```javascript
	//app.json的路径
	"pages":[
		"pages/index",
		"pages/order",
		"pages/user",
		{
			"path": "pagesOther/other",
			"subPackage": true
		}
	]
	//单个vue文件的config配置
	export default {
		config: {
			navigationBarTitleText: '首页'
		},
		data() {
			return {}
		},
		onLoad() {},
		onReady() {},
		onShow() {},
		methods: {},
		computed: {},
		watch: {},
		components: {}
	}
```

## CopyWebpackPlugin配置

```javascript
	// 版本1
	new CopyWebpackPlugin([
		{
			from: path.resolve(__dirname, '../static/tabBar'),
			to: path.resolve(__dirname, '../dist/static/tabBar')
		},
		{
			from: path.resolve(__dirname, '../static'),
			to: path.resolve(__dirname, '../dist/static'),
			ignore: ['*.png']
		}
	]),
	// 版本2
	new CopyWebpackPlugin([
		{
			from: path.resolve(__dirname, '../static/tabBar'),
			to: path.resolve(config.build.assetsRoot, './static/tabBar')
		},
		{
			from: path.resolve(__dirname, '../static'),
			to: path.resolve(config.build.assetsRoot, './static'),
			ignore: ['*.png']
		}
	]),
```

> 注意：针对三目引入静态资源做require处理，否则不能copy进打包文件或者转为base64

## mpvue微信小程序锁定依赖版本

[仅支持微信小程序demo，请戳我](https://github.com/zyh9/mpvue-apps/tree/master/mpvue-other/)

```javascript
	{
		"mpvue": "1.0.18",
		"mpvue-loader": "1.1.4",
		"mpvue-template-compiler": "1.0.18",
	}
```

[支持微信、百度小程序demo，请戳我](https://github.com/zyh9/mpvue-apps/tree/master/mpvue-other/mpvue1.x/)

```javascript
	{
		"mpvue": "1.4.2",
		"mpvue-loader": "1.4.0",
		"mpvue-template-compiler": "1.4.2",
	}
```

> 多端支持从mpvue2.0开始
