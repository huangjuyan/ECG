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

```javascript
chart.drawBc(canvas, width, height, marginL, ifPoint);

```