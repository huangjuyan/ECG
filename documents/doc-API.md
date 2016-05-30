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

<h3>7、doc.context</h3>
存放canvas的context，结构如下：

```javascript
context: {
	bcContext: null,
	fcContext: null
}
```

bcContext | fcContext分别为ECG.doc.ecgDom.bc｜ECG.doc.ecgDom.fc的语境context，初始值为null。

<h3>8、borderColor ｜ lineColor</h3>
分别为背景边框与背景分割线的颜色，默认为红色，背景点的颜色与lineColor相同

<h3>8、borderWidth ｜ lineWidth</h3>
分别为背景边框与背景分割线的宽度，默认为1px，背景点默认为一个像素的点

<h3>9、doc.marginL</h3>
canvas左边边距，左边的边距部分用来存放解释说明性的文字。默认值为100，可通过ECG.doc.marginL获取或者设置。

<h3>10、doc.tWidth</h3>
doc.ecgDom.bc元素的总宽度，该宽度为doc.width + doc.marginL。该宽度不可直接设置，可通过设置doc.width与doc.marginL来间接设置。

<h3>11、doc.cellWidth</h3>
doc.ecgDom.bc中单元格的宽度。

<h3>12、doc.cellHeight</h3>
doc.ecgDom.bc中单元格的高度。