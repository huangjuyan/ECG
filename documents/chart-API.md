<h2>ECG.js文档-chart部分</h2>

**注：该文档为ECG.js中chart部分的文档，chart对象可通过ECG.chart获取。下面使用的chart对象默认为ECG.chart。**

<h3>chart.init(obj)方法</h3>

```javascript
chart.init(obj);

参数：
obj {
	id: '',			// 必填，指定ECG的容器的id
	width: 1000,	// ECG容器宽度，默认1000
	height: 500,	// ECG容器gaodu，默认为高度的一半
}
```

<h3>chart.drawBc()方法</h3>

该方法用户绘制ECG容器的背景，并且会将绘制好的背景导出为base64格式的图片，设置为ECG容器最外层doc.ecgDom.c的背景。该函数全部调用ECG内部封装的方法，所以没有参数。

```javascript
chart.drawBc();

参数：无

返回值：｛boolean｝
```

<h3>chart.drawV1() | chart.drawV5() | chart.drawAVF() | chart.drawPacer()方法</h3>

这三个方法分别用于绘制指定的心电图线段，但是内部均调用innerUtil.drawECG()方法，只不过参数```name```的值不同。

```javascript
chart.drawV1(v);

参数：
v：要绘制的心电线段终点的心电电压

返回值：无
```

<h3>chart.clearFc()方法</h3>

该方法用于将ECG.doc.context.fcContext中绘制的内容全部清空，准备绘制下一波心电

```javascript
chart.clearFc();

参数：无
该方法会在函数内部直接从ECG.doc中获取fcContext及其相关的参数。

返回值：
{{boolean}} 清空成功返回true
```

<h3>chart.getClearCoordinate()方法</h3>

该方法用于获取要清除的ECG.context.fcContext中绘制的指定心电图的坐标

```javascript
chart.getClearCoordinate(name);

参数：
name：要获取的指定心电的名字

返回值：
{*} | false：找不到指定的心电时返回false，找到指定的心电时返回值如下：
{
	clearH1: number,	// 要清除的心电的区域最小y坐标值
	clearH2: number,	// 要清除的心电的区域最大y坐标值
	widht: number		// 要清除的心电的区域最大x坐标值
}
```

<h3>chart.clearECG()方法</h3>

该方法用于清除指定的心电图线条。

```javascript
chart.clearECG(name);

参数：
name：可以为字符串或者数组，例'avf', ['v1', 'pacer', 'avf']。

返回值：
清除成功返回true，否则返回false
```

<h3>chart.setGain()方法</h3>

该方法用于重新设置心电的增益值，入参要求必须为数字，包括整型和浮点类型，不能是字符串形式的数字。

```javascript
chart.setGain(val);

参数：
val：要设置的新的的增益

返回值：
{boolean} 设置成功返回true，否则返回false
```

<h3>chart.setPs()方法</h3>

该方法用于重新设置心电的走速，入参要求必须为数字，包括整型和浮点类型，不能是字符串形式的数字。

<h3>chart.drawFc()方法</h3>
.