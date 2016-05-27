<h2>ECG.js文档-doc部分</h2>

**注：该文档为ECG.js中doc部分的文档，doc对象可通过ECG.doc获取。下面使用的doc对象默认为ECG.doc。**

<h3>1、doc.ecgDom</h3>

```javascript
ecgDom = {
	c: dom,		// ECG容器的最外层容器
	bc: dom,	// 作为背景的canvas元素
	fc: dom		// 作为展示心电的canvas元素
};
```

<h3>2、doc.width</h3>
ECG容器的宽度，默认为1000，可通过ECG.outUtil.setECGWH()方法设置。  
ECG.ecgDom.bc的宽度与容器的宽度相等。

<h3>3、doc.height</h3>
ECG容器的高度，默认为宽度的一半，可通过ECG.outUtil.setECGWH()方法设置。  
ECG.ecgDom.bc的宽度与容器的高度相等。

<h3>4、doc.fcWidth</h3>
ECG容器的高度，默认为宽度的一半，可通过ECG.outUtil.setFcWH()方法设置。

<h3>5、doc.fcHeight</h3>
ECG容器的高度，默认为宽度的一半，可通过ECG.outUtil.setFcWH()方法设置。

<h3>6、doc.isInit</h3>
ECG对象是否被初始化过，初始值为false，在ECG.chart.init()方法被调用后会被置为true。可通过此对象监测是否初始化过ECG对象。