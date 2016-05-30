<h2>ECG.js文档-innerUtil部分</h2>

**注：该文档为ECG.js中innerUtil部分的文档，innerUtil对象不可获取，只能在IIFE函数内部调用。**

<h3>1、innerUtil.windowToCanvas()方法</h3>

该方法用于获取鼠标相对于canvas边界，在canvas内部的坐标。

```javascript
innerUtil.windowToCanvas(canvas,x,y);

参数：
canvas: canvas对象
x: 鼠标在window中的横坐标
y: 鼠标在window中的纵坐标

返回值：
{
	x: number,	// 鼠标在canvas中的横坐标
	y: number	// 鼠标在canvas中的纵坐标
}
```

<h3>2、innerUtil.checkECG()方法</h3>

该方法检测ECG容器是否声明。

```javascript
innerUtil.checkECG(id);

参数：
id：String		// 必填，ECG容器的id

返回值：
boolean：存在则返回true，不存在返回false
```

<h3>3、innerUtil.initECGProperty()方法</h3>

设置ECG容器参数，如果参数错误或者未设置，则使用默认值。

```javascript
innerUtil.initECGProperty(obj);

参数:
obj {
	width: number,	// 宽度，必填
	height: number	// 高度，必填
}
```

<h3>4、innerUtil.initCanvas()方法</h3>

```javascript
innerUtil.initCanvas(param, isBc);

参数：
param: {};		// 初始化canvas的参数 
isBC: boolean;	// 该canvas是背景还是前景

返回值：
canvas：domObj	// 生成的dom元素
```