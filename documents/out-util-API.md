<h2>ECG.js文档-outUtil部分</h2>

**注：该文档为ECG.js中outUtil部分的文档，util对象可通过ECG.util获取。下面使用的outUtil对象默认为ECG.util。**

<h3>1、outUtil.setECGWH()方法</h3>

设置ECG容器的宽度和高度,暂时不支持设置doc.ecgDom.fc的宽度和高度。暂时没有实现同步修改背景的坐标。

```javascript
outUtil.setECGWH(param);

参数：
param: {
	width：number,
	height: number
}
```

<h3>2、outUtil.setFcWH()方法</h3>

设置ECG.doc.ecgDom.fc的宽度和高度，暂时没有实现同步调整心电的图形幅度和时间。

```javascript
outUtil.setFcWH(param);

参数：
param: {
	width: number,
	height: number
}
```

<h3>3、outUtil.setStyle()方法</h3>

设置ECG容器的样式，会将参数中所有的css样式全部应用到对应的ECG容器及其子容器上。

```javascript
outUtil.setStyle(param);

参数：
param: {
	c: {
		background: 'blue'
	},
	bc: {
		background: 'red'
	}
}
注：param中的键只能是ECG.doc.ecgDom中的键，即只能设置ECG.doc.ecgDom.c、
ECG.doc.ecgDom.bc以及ECG.doc.ecgDom.fc的样式。

返回值：
boolean: true | false； 设置成功返回true，否则返回false
```

<h3>4、outUtil.setMarginL()方法</h3>

```javascript
outUtil.setMarginL(marginL);

参数：
marginL：number；要设置的左边距的距离，必须为数字

返回值：boolean，设置成功则返回true；
```

<h3>5、outUtil.setCell()方法</h3>

设置doc.ecgDom.bc中单元格的大小。

```javascript
outUtil.setCell(cw, ch);

参数：
cw：number，	// 单元格的宽度
ch：number		// 单元格的高度
```