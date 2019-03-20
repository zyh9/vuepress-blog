---
title: 移动端
sidebar: true
date: 2019-03-20
categories: mobile
---

:::tip
移动端总结，持续更新...
:::

<!-- more -->

## viewport 视口(可视区窗口)

		默认不设置viewport一般可视区宽度在移动端是980
		
		width  可视区的宽度 (number||device-width)
		
		user-scalable 是否允许用户缩放 (yes||no) iOS10无效
		
		initial-scale 初始缩放比例
		
		minimum-scale 最小缩放比例
		
		maximum-scale 最大缩放比例

## 设备像素比(device pixel ratio)

		设备像素比简称为dpr，其定义了物理像素和设备独立像素的对应关系。它的值可以按下面的公式计算得到：
		
			设备像素比 ＝ 物理像素 / 设备独立像素
			
		在JavaScript中，可以通过window.devicePixelRatio获取到当前设备的dpr

## CSS单位rem

		在W3C规范中是这样描述rem的:
		
		font size of the root element.
		
		简单的理解，rem就是相对于根元素<html>的font-size来做计算。
		而我们的方案中使用rem单位，是能轻易的根据<html>的font-size计算出元素的盒模型大小。

## meta设置

```html
	<!DOCTYPE html>
	<html lang="en">
	<head>
	<meta charset="UTF-8">
	<title>Document</title>
	<meta name="viewport" content="width=device-width,user-scalable=no">
	<!--QQ强制竖屏显示-->
	<meta name="x5-orientation" content="portrait" />
	<!--QQ全屏显示-->
	<meta name="x5-fullscreen" content="true" />
	<!--UC强制竖屏显示-->
	<meta name="screen-orientation" content="portrait">
	<!--UC全屏显示-->
	<meta name="full-screen" content="yes">
	<!--禁止识别电话号码和邮箱地址-->
	<meta name="format-detection" content="telephone=no, email=no" />
	<!--页面适合在pc和mobile上进行浏览-->
	<meta name="applicable-device" content="pc, mobile">
	<!--针对Apple是否启动WebApp功能-->
	<meta name="apple-mobile-web-app-capable" content="yes">
	<!--Apple顶部导航栏颜色-->
	<meta name="apple-mobile-web-app-status-bar-style" content="black">
	</head>
	<body>
		<!--
			href="tel:"
			href="mailto:"
		-->
		<p>13888888888</p>
		<a href="tel:18888888888">请拨打电话18888888888</a>
		<a href="mailto:zyh@qq.com">请发送邮件</a>
	</body>
	</html>
```

## 默认样式设置

```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <title>Document</title>
    <meta name="viewport" content="width=device-width,user-scalable=no">
    <style type="text/css">
    /*默认字体设置*/
    body {
    	font-family: Helvetica;
    }
    body * {
    	/*禁止文字缩放*/
    	-webkit-text-size-adjust: 100%;
    	/*选中文字设置*/
    	-webkit-user-select: none; 
    }
    /*清除点击阴影*/
    a,input,button {
    	-webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    	/*-webkit-tap-highlight-color: transparent*/
    }
    /*消除圆角按钮（针对iOS系统）*/
    input,button {
    	-webkit-appearance: none;
    	border-radius: 0;
    }
    </style>
    </head>
    <body>
    	<a href="http://www.baidu.com">百度一下</a>
    	<input type="button" value="按钮">
    </body>
    </html>
```

## 动态获取像素比（取自--饿了么移动端）

```javascript
	!function(e, t) {
		function i() {
			var t = n.getBoundingClientRect().width;
			t / d > 540 && (t = 540 * d);
			var i = t / 10;
			n.style.fontSize = i + "px", p.rem = e.rem = i
		}
		var a, r = e.document,
			n = r.documentElement,
			o = r.querySelector('meta[name="viewport"]'),
			l = r.querySelector('meta[name="flexible"]'),
			m = r.querySelector('meta[name="flexible-in-x5"]'),
			s = !0,
			d = 0,
			c = 0,
			p = t.flexible || (t.flexible = {});
		if (o) {
			console.warn("将根据已有的meta标签来设置缩放比例");
			var u = o.getAttribute("content").match(/initial\-scale=([\d\.]+)/);
			u && (c = parseFloat(u[1]), d = parseInt(1 / c))
		} else if (l) {
			var f = l.getAttribute("content");
			if (f) {
				var v = f.match(/initial\-dpr=([\d\.]+)/),
					h = f.match(/maximum\-dpr=([\d\.]+)/);
				v && (d = parseFloat(v[1]), c = parseFloat((1 / d).toFixed(2))), h && (d = parseFloat(h[1]), c = parseFloat((1 / d).toFixed(2)))
			}
		}
		if (m && (s = "false" !== m.getAttribute("content")), !d && !c) {
			var x = (e.navigator.appVersion.match(/android/gi), e.chrome),
				g = e.navigator.appVersion.match(/iphone/gi),
				b = e.devicePixelRatio,
				w = /TBS\/\d+/.test(e.navigator.userAgent),
				y = !1;
			try {
				y = "true" === localStorage.getItem("IN_FLEXIBLE_WHITE_LIST")
			} catch (e) {
				y = !1
			}
			d = g || x || w && s && y ? b >= 3 && (!d || d >= 3) ? 3 : b >= 2 && (!d || d >= 2) ? 2 : 1 : 1, c = 1 / d
		}
		if (n.setAttribute("data-dpr", d), !o) if (o = r.createElement("meta"), o.setAttribute("name", "viewport"), o.setAttribute("content", "initial-scale=" + c + ", maximum-scale=" + c + ", minimum-scale=" + c + ", user-scalable=no"), n.firstElementChild) n.firstElementChild.appendChild(o);
		else {
			var E = r.createElement("div");
			E.appendChild(o), r.write(E.innerHTML)
		}
		e.addEventListener("resize", function() {
			clearTimeout(a), a = setTimeout(i, 300)
		}, !1), e.addEventListener("pageshow", function(e) {
			e.persisted && (clearTimeout(a), a = setTimeout(i, 300))
		}, !1), "complete" === r.readyState ? r.body.style.fontSize = 12 * d + "px" : r.addEventListener("DOMContentLoaded", function(e) {
			r.body.style.fontSize = 12 * d + "px"
		}, !1), i(), p.dpr = e.dpr = d, p.refreshRem = i, p.rem2px = function(e) {
			var t = parseFloat(e) * this.rem;
			return "string" == typeof e && e.match(/rem$/) && (t += "px"), t
		}, p.px2rem = function(e) {
			var t = parseFloat(e) / this.rem;
			return "string" == typeof e && e.match(/px$/) && (t += "rem"), t
		}
	}(window, window.lib || (window.lib = {}))
```

## 像素比简单设置

```javascript
	//获取像素比
	var PixelRatio = 1 / window.devicePixelRatio;
	//写入meta
	document.write('<meta name="viewport" content="width=device-width,initial-scale='+PixelRatio+',minimum-scale='+PixelRatio+',maximum-scale='+PixelRatio+',user-scalable=no" />');
	//获取html元素
	var html = document.getElementsByTagName('html')[0];
	//获取html（屏幕）的宽度
	var pageWidth = html.getBoundingClientRect().width;
	//获取html的字号
	html.style.fontSize = pageWidth / 10 + 'px';
```
