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
innerUtil.initCanvas(isBc);

参数：
isBC: boolean;	// 该canvas是背景还是前景

返回值：
canvas：domObj	// 生成的dom元素
```

<h3>5、innerUtil.setECGBackground()方法</h3>

该方法将doc.ecgDom.bc中绘制的内容导出为base64格式, 然后设置为ECG最外层容器的背景。

```javascript
innerUtil.setECGBackground();

返回值：
设置成功则返回true；
```

<h3>6、innerUtil.getBaseY()方法</h3>

该方法用于获取每条心电图线的起始纵坐标。该起始纵坐标表示在该心电图在整个canvas中y轴的起始位置，用该坐标值减去每次心电的震动幅度即得每次心电震动在canvas中y轴的取值（canvas坐标y轴向下为正）。

```javascript
innerUtil.getBaseY(name);

参数：
要获取的心电的名字，具体名字参见ECG.doc.descriptionWords.style中的各个键值

返回值：
baseY：number类型
```

<h3>7、innerUtil.drawECG()方法</h3>

```javascript
innerUtil.drawECG(name, v);

参数：
name：要绘制的心电的名字
v：本次绘制终点心电的电压

返回值：无
```

<h3>8、innerUtil.isArray()方法</h3>

```javascript
innerUtil.isArray(obj);

参数：
obj：要检测的对象

返回值：如果被检测对象为数组返回true，否则返回false
```
<h3>9、innerUtil.isString()方法</h3>

```javascript
innerUtil.isString(obj);

参数：
obj：要检测的对象

返回值：如果被检测对象为字符串则返回true，否则返回false
```
<h3>10、innerUtil.resetAllCoordinate()方法</h3>

该方法用于重置所有心电当前位置的坐标为初始坐标。

```javascript
innerUtil.resetAllCoordinate();

参数： 无

返回值：
{boolean} 初始成功返回true，否则返回false。
```
<h3>11、innerUtil.isNumber()方法</h3>

该方法用于检测入参是否为Number类型。

```javascript
innerUtil.isNumber(obj);

参数：
obj：要检测的对象

返回值：
{boolean}： 如果入参为Number类型则返回true，否则返回false
```