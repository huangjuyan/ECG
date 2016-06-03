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

<h3>chart.drawV1() | chart.drawV5() | chart.drawAVF()方法</h3>

这三个方法分别用于绘制指定的心电图线段，但是内部均调用innerUtil.drawECG()方法，只不过参数```name```的值不同。

```javascript
chart.drawV1(x, y);

参数：
x：要绘制的心电线段终点的x坐标
y：要绘制的心电线段终点的y坐标

返回值：无
```

<h3>chart.drawFc()方法</h3>