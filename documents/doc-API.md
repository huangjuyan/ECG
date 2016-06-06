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

<h3>8、 lineColor</h3>
分别为背景边框与背景分割线的颜色，默认为红色，背景点的颜色与lineColor相同

<h3>8、lineWidth</h3>
分别为背景边框与背景分割线的宽度，默认为1px，背景点默认为一个像素的点

<h3>9、doc.marginL</h3>
canvas左边边距，左边的边距部分用来存放解释说明性的文字。默认值为100，可通过ECG.doc.marginL获取或者设置。

<h3>10、doc.tWidth</h3>
doc.ecgDom.bc元素的总宽度，该宽度为doc.width + doc.marginL。该宽度不可直接设置，可通过设置doc.width与doc.marginL来间接设置。

<h3>11、doc.cellWidth</h3>
doc.ecgDom.bc中单元格的宽度。

<h3>12、doc.cellHeight</h3>
doc.ecgDom.bc中单元格的高度。

<h3>13、doc.pointColor</h3>
doc.ecgDom.bc中单元格中点的颜色

<h3>13、doc.pointWidth</h3>
doc.ecgDom.bc中单元格中点的宽度

<h3>14、doc.descriptionWordsStyle</h3>
doc.ecgDom.bc中描述三条心电图多说明文字配置，该属性是一个js对象，具体结构如下：

```javascript
descriptionWords : { 
                style    : {    // descriptionWords描述文字样式配置
                    v1  : {
                        ifDraw : true,
                        color  : '#333',
                        index  : 1,
                        text   : 'v1',
                    },
                    v5  : {
                        ifDraw : true,
                        color  : '#333',
                        index  : 2,
                        text   : 'v5'
                    }
                    ,
                    avf : {
                        ifDraw : true,
                        color  : '#333',
                        index  : 3,
                        text   : 'avf'
                    },
                },
                position : 4 // 可选项, 描述文字在自己的区域内第几行
			},
```

* ifDraw: 是否画该描述文字
* color: 该描述文字的颜色
* text: 该描述文字的内容,可选参数，默认为其键值。
* position: 该属性描述每行描述文字在自己区域内的第几行处绘制，默认在第四行

<h3>15、doc.rowsPerLine</h3>

doc.rowsPerLine表示每条心电图占用几行。

<h3>16、doc.bc</h3>
后面会将与doc.ecgDom.bc相关的样式设置等信息放到doc.bc对象中。该对象的结构如下：

```javascript
doc.bc = {
	border: {
		style: '#red',	// border的样式，可以是一个css颜色字符串
		width: number		// border的宽度
	}
}
```

<h3>17、doc.coordinate</h3>

该对象用于存放每条心电图当前的绘制位置。结构如下：

```javascript
doc.coordinate = {
	v1: {
		x: 1,
		y: 160
	},
	v5: {
		...
	}
}
```
每绘制一段指定的心电，都会调用该对象存储一次指定的值。

<h3>18、doc.rate</h3>

器械的采样频率。默认值为200.