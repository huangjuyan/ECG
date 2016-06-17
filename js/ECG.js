/**
 * Author:      Tao-Quixote
 * CreateTime:  16/5/26 11:10
 * Description: ECG.js主文件,主要将可以投入生产环境使用的相关方法插入该文件
 */
var ECG = (function () {
        /**
         * 存储所有跟canvas相关的参数
         */
        var doc = {
            // 存储ECG的dom元素
            ecgDom : {
                // canvas容器
                c  : {},
                // 背景 | 后面的canvas
                bc : {},
                // 心电 | 前面的canvas
                fc : {}
            },

            // 存放ECG中所有的context
            context : {
                bcContext : null,
                fcContext : null
            },

            width      : 1000,    // ECG容器的宽度
            height     : 1000,     // ECG容器的高度
            marginL    : 1,      // canvas左边边距,用来存放说明性的文字
            tWidth     : 1001,     // canvas元素的总宽度
            fcWidth    : 18000,    // fc宽度
            fcHeight   : 800,     // fc高度
            cellWidth  : 50,       // 背景单元格宽度
            cellHeight : 50,       // 背景单元格高度

            lineColor      : 'orange',   // 背景线条颜色
            lineWidth      : 1,    // 背景线条宽度
            dotColor       : 'orange',     // 点的样式
            dotWidth       : 1,        // 点的大小,
            originPosition : 2,  // 描述文字以及心电图的基点位置在第几行

            descriptionWords : {
                style    : {    // descriptionWords描述文字样式配置
                    V1    : {
                        ifDraw : true,
                        color  : '#333',
                        index  : 1,
                        text   : 'V1'
                    },
                    V5    : {
                        ifDraw : true,
                        color  : '#333',
                        index  : 2,
                        text   : 'V5'
                    },
                    aVF   : {
                        ifDraw : true,
                        color  : '#333',
                        index  : 3,
                        text   : 'aVF'
                    },
                    Pacer : {
                        ifDraw : true,
                        color  : '#333',
                        index  : 4,
                        text   : 'Pacer'
                    }
                },
                position : 4 // 可选项, 描述文字在自己的区域内第几行,已被doc.originPosition替代
            },
            // 主要存放doc.ecgDom.bc的配置信息,后面会将前面的配置逐步放到bc中
            bc               : {
                border : {
                    style : 'red',  // 边框样式
                    width : 1       // 边框宽度
                },
            },
            // 主要存放doc.ecgDom.fc的配置信息，后面会将前面的配置逐步放到fc中
            fc               : {
                gain       : {     // 存放增益的配置信息
                    std : 10,    // 增益的标准：10mm/mv
                    cur : 20,     // 产品中的当前增益：20mm/mv,
                    mul : 2,     // 增益的放大倍数，在修改产品当前增益的时候会相应地修改该放大倍数
                },
                ps         : {   // 存放走速的配置信息，ps == paper speed
                    std : 25,    // 标准走纸速度：25mm/s
                    cur : 25,    // 产品中的当前走纸速度：25mm/s,
                    mul : 1,     // 走速的放大倍数，在修改产品当前走速的时候会相应地修改该放大倍数
                },
                // 放置ecg每条心电的样式
                ecgStyle   : {
                    V1    : 'blue',
                    V5    : 'red',
                    aVF   : '#333',
                    Pacer : '#333'
                },
                // 主要存放心电图当前的位置
                coordinate : {
                    V1    : {
                        x : 1,
                        y : 160,
                    },
                    V5    : {
                        x : 1,
                        y : 360,
                    },
                    aVF   : {
                        x : 1,
                        y : 560,
                    },
                    Pacer : {
                        x : 1,
                        y : 760,
                    }
                },
            },

            rowsPerLine   : 5,        // 每条心电图占用几行
            colsPerSecond : 5,   // 每秒占用几列
            isInit        : false,   // ECG对象是否初始化
            ifPoint       : true,      // ECG.ecgDom.bc是否要画点
            bcDataUrl     : null,     // ECG.ecgDom.bc绘制内容的导出的base64格式的图片

            rate : 125,      // 采样频率

            ecgData : {
                result        : {},
                ecgPartBlocks : [],
                hwLeadConfig  : []
            }
        };

        /**
         * 存放ECG容器的样式
         * c: 同ECG.doc.ecgDom.c
         * bc: 同ECG.doc.ecgDom.bc
         * fc: 同ECG.doc.ecgDom.fc
         */
        var css = {
            // c中存放ECG最外层容器的样式,其中的所有样式都会应用到c容器上
            c  : {
                width            : doc.tWidth + 'px',
                overflowX        : 'scroll',
                overflowY        : 'hidden',
                backgroundRepeat : 'no-repeat'
            },
            // bc中存放ECG中bc的样式,其中所有的样式都会应用到bc容器上
            bc : {
                display : 'none'
            }
        };

        /**
         * 只在函数内部使用的,不对外公开的innerUtil部分
         * @type {{}}
         */
        var innerUtil = {
            /**
             * 检测ECG容器是否声明
             * @param id
             * @returns {boolean}
             */
            checkECG : function (id) {
                var c = document.getElementById(id);
                if (c) {
                    doc.ecgDom.c = c;
                    return true;
                } else {
                    console.log('未找到ECG容器。');
                    return false;
                }
            },

            /**
             * 设置ECG容器参数,如果没有则使用默认值
             *
             * @param obj  {width: number, height: number},宽度和高度为数字
             */
            initECGProperty : function (obj) {
                if (typeof obj === 'object') {
                    // 设置ECG容器的宽度
                    if ('width' in obj) {
                        doc.ecgDom.c.width = obj.width;
                        doc.width = obj.width;
                    }
                    // 设置doc.ecgDom.bc的左边距
                    if ('marginL' in obj) {
                        doc.marginL = obj.marginL;
                    }
                    // 设置ECG容器的高度
                    if ('height' in obj) {
                        doc.ecgDom.height = obj.height;
                        doc.height = obj.height;
                    } else {
                        doc.ecgDom.height = doc.ecgDom.width / 2;
                    }

                    // 设置doc.tWidth
                    {
                        doc.tWidth = doc.width + doc.marginL;
                    }
                } else {
                    console.log('initECGProperty参数错误');
                }
            },

            /**
             * 初始化canvas,js生成canvas dom元素,设置canvas的属性并返回
             *
             * @param isBc 是否是心电背景
             */
            initCanvas : function (isBc) {
                var canvas = document.createElement('canvas');

                canvas.height = doc.height;

                /**
                 * 分别处理bc和fc,
                 * bc的宽度会增加doc.marginL,用来存放说明文字
                 * fc左边的边距会增加doc.marginL,便于与bc对齐,且fc的宽度来自doc.fcWidth
                 */
                if (isBc) {
                    canvas.width = doc.width + doc.marginL;
                    canvas.id = 'bc';
                } else {
                    canvas.width = doc.fcWidth;
                    canvas.style.marginLeft = doc.marginL + 'px';
                    canvas.id = 'fc';
                }

                return canvas;
            },

            /**
             * 将doc.ecgDom.bc中绘制的内容导出为base64格式,
             * 然后设置为ECG最外层容器的背景
             *
             * @returns {boolean}
             */
            setECGBackground : function () {
                doc.bcDataUrl = doc.ecgDom.bc.toDataURL();
                doc.ecgDom.c.style.backgroundImage = 'url(' + doc.bcDataUrl + ')';

                return true;
            },

            /**
             * 用于获取指定心电的起始y轴坐标
             *
             * @param name 要获取的心电的名字
             * @returns {number}
             */
            getBaseY : function (name) {
                var index = doc.descriptionWords.style[ name ].index;
                var position = doc.originPosition;
                var rowsPerLine = doc.rowsPerLine;
                var baseY = doc.cellHeight * (index * rowsPerLine -
                                              (rowsPerLine - position
                                              )
                    );

                return baseY;
            },

            /**
             * todo 这个地方要根据心电电压计算纵坐标的值
             *
             * 根据传入的心电的名字在指定位置绘制指定的心电
             *
             * @param name 要绘制的心电的名字,具体参见doc.fc.coordinate中的对象
             * @param v 当前要绘制线段终点的心电电压
             */
            drawECG : function (name, v) {
                var context = doc.context.fcContext;
                var coordinate = doc.fc.coordinate[ name ];
                var gainMultiple = doc.fc.gain.mul;
                var psMultiple = doc.fc.ps.mul;
                // 根据每秒占用的宽度和采样率计算出每条线段的x轴宽度
                var space = doc.cellWidth * doc.colsPerSecond * psMultiple / doc.rate;

                context.beginPath();
                context.strokeStyle = doc.fc.ecgStyle[ name ];
                context.moveTo(coordinate.x, coordinate.y);
                var baseY = innerUtil.getBaseY(name);
                var destinationX = coordinate.x;
                // todo 现在使用250px表示2.5mv心电电压,即每像素表示0.01mv
                // todo 所以对于给定的心电电压v,需要表示该电压的像素数为:v/0.01
                var destinationY = baseY - v / 0.01 * gainMultiple;
                context.lineTo(destinationX + 0.5, destinationY);

                {
                    coordinate.x = destinationX + space;
                    coordinate.y = destinationY;
                }

                context.stroke();
            },

            /**
             * 检测对象是否为数组
             *
             * @param obj 要检测的对象
             * @returns {boolean} 如果为数组则返回true，否则返回false
             */
            isArray : function (obj) {
                if (obj && Object.prototype.toString.call(obj) == '[object Array]') {
                    return true;
                }

                return false;
            },

            /**
             * 检测对象是否为字符串
             * @param obj
             * @returns {boolean}
             */
            isString : function (obj) {
                if (obj && Object.prototype.toString.call(obj) == '[object String]') {
                    return true;
                }

                return false;
            },

            /**
             * 检测对象是否为数字
             * @param obj
             * @returns {boolean}
             */
            isNumber : function (obj) {
                if (obj && Object.prototype.toString.call(obj) == '[object Number]') {
                    return true;
                }

                return false;
            },

            /**
             * 判断对象是否为对象类型
             *
             * @param obj
             * @returns {boolean}
             */
            isObject : function (obj) {
                if (obj && Object.prototype.toString.call(obj) == '[object Object]') {
                    return true;
                }

                return false;
            },

            /**
             * 判断对象是否为空
             *
             * @param obj
             * @returns {boolean}
             */
            isEmptyObj : function (obj) {
                var t;
                for (t in obj) {
                    return false;
                }

                return true;
            },

            /**
             * 获取所有选中的要显示的心电的名字
             *
             * @param checkboxNam
             * @returns {Array}e
             */
            getAllSelectedEcg : function (checkboxName) {
                var queryStr = 'input[name="' + checkboxName + '"]:checked';
                var chkArr = document.querySelectorAll(queryStr);
                var len = chkArr.length;
                var chkNames = [];
                for (var i = 0; i < len; i++) {
                    var name = chkArr[ i ].value;
                    chkNames.push(name);
                }

                return chkNames;
            },

            /**
             * 重置所有的心电坐标
             *
             * @returns {boolean}
             */
            resetAllCoordinate : function () {
                var coor = doc.fc.coordinate;
                var keys = Object.keys(coor);
                var len = keys.length;

                for (var i = 0; i < len; i++) {
                    var subKey = keys[ i ];
                    coor[ subKey ][ 'x' ] = doc.marginL;
                    coor[ subKey ][ 'y' ] = ((doc.descriptionWords.style[ subKey ][ 'index' ] - 1
                                             ) * doc.rowsPerLine + doc.originPosition
                                            ) * doc.cellHeight;
                }

                return true;
            },

            /**
             * 根据导连的名字查询其对应的数据在doc.ecgPartBlocks中的位置
             * @param name
             * @returns {*}
             */
            getEcgIndex : function (name) {
                if (!name || !this.isString(name)) {
                    console.log('error: parameter is wrong.');

                    return false;
                }

                return doc.ecgData.hwLeadConfig.indexOf(name);
            },

            /**
             * 获取所有要绘制的心电的名字
             *
             * @returns {Array}
             */
            getAllDrawECG : function () {
                var all = doc.descriptionWords.style;
                var keys = Object.keys(all);
                var subAll = [];
                for (var index in keys) {
                    var key = keys[ index ];
                    if (all[ key ][ 'ifDraw' ]) {
                        subAll.push(key);
                    }
                }

                return subAll;
            },

        };

        /**
         * 工具对象,存放工具函数,可对外公开的outUtil部分
         */
        var outUtil = {
            /**
             * 设置ECG容器的宽度和高度,暂时不支持设置doc.ecgDom.fc的宽度和高度
             * 这里在设置宽度的时候会加上doc.marginL的宽度
             *
             * @param param
             */
            setECGWH : function (param) {
                if (typeof param !== 'object') {
                    console.log('setECGWH参数错误');
                    return false;
                } else {
                    var ecgDom = doc.ecgDom;
                    // 如果设置了宽度则逐个设置宽度
                    if ('width' in param) {
                        var width = param.width + doc.marginL;
                        ecgDom.bc.width = width;
                    }
                    // 如果设置高度则逐个设置高度
                    if ('height' in param) {
                        var height = param.height;
                        ecgDom.bc.height = height;
                    }
                }
            },

            /**
             * 设置doc.ecgDom.fc的宽度和高度
             * @param param
             * @returns {boolean}
             */
            setFcWH : function (param) {
                if (typeof param !== 'object') {
                    console.log('setFcWH参数错误');
                    return false;
                } else {
                    if ('width' in param) {
                        doc.fcWidth = param.width;
                        doc.ecgDom.fc.width = param.width;
                    }
                    if ('height' in param) {
                        doc.height = param.height;
                        doc.ecgDom.fc.height = param.height;
                    }
                }

                return true;
            },

            /**
             * 设置ECG容器的样式
             *
             * @param param 存放样式ECG容器样式的对象
             * @returns {boolean} 设置成功返回true,否则返回false
             */
            setStyle : function (param) {
                if (!ECG.doc.isInit) {
                    console.log('ECG对象未初始化');
                    return false;
                }

                if (typeof param !== 'object') {
                    console.log('setStyle参数错误');
                    return false;
                } else {
                    // 这里最后的s指代style
                    var keys = Object.keys(param),
                        len  = keys.length;
                    for (var i = 0; i < len; i++) {
                        var key = keys[ i ];
                        var subKeys = Object.keys(param[ key ]),
                            subLen  = subKeys.length;
                        for (var j = 0; j < subLen; j++) {
                            var subKey = subKeys[ j ];
                            ECG.doc.ecgDom[ key ].style[ subKey ] = param[ key ][ subKey ];
                        }
                    }

                    return true;
                }
            },

            /**
             * 设置bc和fc的左边距, bc的左边距用来放置说明性的文字,fc的左边距用来与bc对齐
             *
             * @param marginL
             * @returns {boolean}
             */
            setMarginL : function (marginL) {
                if (typeof marginL !== 'number') {
                    console.log('setMarginL参数错误,无效的参数');
                    return false;
                }
                doc.marginL = marginL;
                doc.ecgDom.bc.width = doc.width + marginL;
                doc.tWidth = doc.width + marginL;
                chart.drawBc();
                doc.ecgDom.fc.style.marginLeft = marginL + 'px';
                doc.ecgDom.c.style.width = doc.tWidth + 'px';

                return true;
            },

            /**
             * 设置背景中单元格的大小
             *
             * @param cw 单元格的宽度
             * @param ch 单元格的高度
             */
            setCell : function (cw, ch) {
                doc.cellWidth = cw;
                doc.cellHeight = ch;
                chart.drawBc();
            },

            /**
             * 设置左边描述性文字的样式
             *
             * @param obj 该参数的结构参照doc.descriptionWords
             * @returns {boolean} 成功返回true,否则返回false
             */
            setDescriptionWordsStyle : function (obj) {
                if (typeof obj !== 'object') {
                    console.log('The type of param must be object.');
                    return false;
                }

                var descriptionWords = doc.descriptionWords.style;
                var keys = Object.keys(obj);
                var length = keys.length;
                for (var i = 0; i < length; i++) {
                    var key = keys[ i ];
                    if (descriptionWords.hasOwnProperty(key)) {
                        var subDW = descriptionWords[ key ];
                        var subKeys = Object.keys(obj[ key ]);
                        var subLength = subKeys.length;
                        for (var j = 0; j < subLength; j++) {
                            var subKey = subKeys[ j ];
                            if (subDW.hasOwnProperty(subKey)) {
                                subDW[ subKey ] = obj[ key ][ subKey ];
                            }
                        }
                    }
                }

                if (!chart.drawBc()) {
                    return false;
                }

                return true;
            },

            /**
             * 该方法用于设置doc.ecgDom.bc中左边介绍心电的文字
             *
             * @returns {boolean}
             */
            setDescriptionWords : function () {
                var position = doc.originPosition;
                var style = doc.descriptionWords.style;
                var keys = Object.keys(style);

                // 保存原来的context
                var bcContext = doc.context.bcContext;
                bcContext.save();

                var length = keys.length;
                for (var i = 0; i < length; i++) {
                    var key = keys[ i ];
                    var subStyle = style[ key ];
                    // 判断是否绘制该说明文字
                    if (!subStyle.ifDraw) {
                        continue;
                    }
                    // 检测说明文字的位置是否正确, 正常情况position < doc.rowsPerLine
                    if (0 > (doc.rowsPerLine - position
                        )) {
                        console.log(
                            'error: the value of position is more than rowsPerLine, outUtil.setDescriptionWords');
                        continue;
                    }

                    bcContext.beginPath();
                    // 修改字体样式
                    bcContext.fillStyle = subStyle.color;
                    // x,y分别为fillText的横坐标和纵坐标
                    var x = doc.marginL;
                    var y = (subStyle.index * doc.rowsPerLine -
                             (doc.rowsPerLine - position
                             )
                            ) * doc.cellHeight;
                    bcContext.fillText(subStyle.text, x, y);
                }

                // 还原context
                bcContext.restore();

                if (!innerUtil.setECGBackground()) {
                    return false;
                }

                return true;
            },

            /**
             * 设置背景中的边框样式
             */
            setBorder : function () {
                var border = doc.bc.border;
                var context = doc.context.bcContext;
                context.beginPath();
                context.strokeStyle = border.style;
                context.strokeWidth = border.width;
                // 这里绘制边框时左边要留出doc.marginL的宽度,用来放置说明文字
                context.rect(doc.marginL - 0.5, 0, doc.width, doc.height);
                context.stroke();

                // 将绘制的内容设置为ECG最外层容器的背景
                innerUtil.setECGBackground();
            },

            /**
             * 设置每条心电的样式
             *
             * @param obj
             * @returns {boolean}
             */
            setEcgStyle : function (obj) {
                if (obj && innerUtil.isObject(obj)) {
                    var keys = Object.keys(obj);
                    var len = keys.length;
                    var ecgStyle = doc.fc.ecgStyle;
                    for (var i = 0; i < len; i++) {
                        var subKey = keys[ i ];
                        ecgStyle[ subKey ] = obj[ subKey ];
                    }

                    return true;
                }

                return false;
            },

            /**
             * 将从服务器获取到的数据存储到doc.ecgData中
             *
             * @param result
             * @returns {boolean}
             */
            setEcgData : function (result) {
                if (!result || !innerUtil.isObject(result)) {
                    console.log('error: the param is wrong, please check the input param.');
                    return false;
                }

                var ecgData = doc.ecgData;
                ecgData.result = result;
                ecgData.hwLeadConfig = result.hwLeadConfig;
                ecgData.ecgPartBlocks = result.ecgPartBlocks;

                return true;
            },
        };

        /**
         * 图形对象,存放跟图形相关的方法和函数
         */
        var chart = {
            /**
             * ECG初始化方法
             *
             * @param obj 存放canvas配置信息的对象
             */
            init : function (obj) {
                // 检测配置信息, obj错误则直接返回
                if (typeof obj !== 'object') {
                    console.log('配置信息错误,请以对象的形式传入配置信息。');
                    return;
                }
                // 对ECG容器进行初始化
                if ('id' in obj) {
                    // 验证是否能找到ECG容器
                    {
                        var ECG = innerUtil.checkECG(obj.id);
                        if (!ECG) {
                            return;
                        }
                    }

                    // 配置容器的参数,高度默认为宽度的一半
                    {
                        innerUtil.initECGProperty(obj);
                    }

                    // 分别生成背景和心电用的canvas
                    {
                        doc.ecgDom.bc = innerUtil.initCanvas(true);
                        doc.ecgDom.fc = innerUtil.initCanvas(false);

                        doc.ecgDom.c.appendChild(doc.ecgDom.bc);
                        doc.ecgDom.c.appendChild(doc.ecgDom.fc);
                    }

                    // 初始化doc.context.bcContext与doc.context.fcContext
                    {
                        doc.context.bcContext = doc.ecgDom.bc.getContext('2d');
                        doc.context.fcContext = doc.ecgDom.fc.getContext('2d');
                    }

                    // 标志ECG已被初始化
                    {
                        doc.isInit = true;
                    }

                    // 设置ECG容器的样式
                    {
                        outUtil.setStyle(css);
                    }
                } else {
                    console.log('配置信息错误,找不到ECG容器。');
                    return false;
                }
            },

            /**
             * 绘制doc.ecgDom.bc,
             * 并将绘制后的内容导出为base64格式的图片,然后设置为doc.ecgDom.c的背景
             *
             * @returns {boolean}
             */
            drawBc : function () {
                // todo 在绘制的时候要注意考虑doc.marginL
                var canvas     = doc.ecgDom.bc,     // 背景canvas对象
                    cellWidth  = doc.cellWidth,    // 单元格的宽度
                    cellHeight = doc.cellHeight,   // 单元格的高度
                    ifPoint    = doc.ifPoint,       // 是否绘制背景中点标志位
                    context    = doc.context.bcContext;

                // 检测canvas是否存在
                {
                    if (!canvas) {
                        console.log('drawBc参数错误,未设置canvas或者找不到指定的canvas');
                        return false;
                    }
                }

                // 先清空画布
                {
                    context.clearRect(doc.marginL, 0, doc.tWidth, doc.height);
                }
                // 绘制背景的边框
                {
                    outUtil.setBorder(context);
                }
                // 绘制背景的列
                {
                    if (!cellWidth) {
                        cellWidth = 50;
                    }
                    context.strokeStyle = doc.lineColor;
                    /**
                     * 这里i的初始值应为width+doc.marginL,
                     * 因为边框距离canvas左边距为doc.marginL,
                     */
                    var i      = cellWidth + doc.marginL,
                        tWidth = doc.width + doc.marginL,
                        num    = 1;

                    for (i; i < tWidth; i += cellWidth) {
                        if (num % doc.colsPerSecond == 0) {
                            context.beginPath();
                            context.strokeWidth = 1;
                            context.moveTo(i, 0);
                            context.lineTo(i, doc.height);
                        } else {
                            context.beginPath();
                            context.strokeWidth = 1;
                            context.moveTo(i + 0.5, 0);
                            context.lineTo(i + 0.5, doc.height);
                        }
                        context.stroke();
                        num++;
                    }
                }
                // 绘制背景的行
                {
                    if (!cellHeight) {
                        cellHeight = cellWidth;
                    }
                    context.beginPath();
                    context.strokeStyle = doc.lineColor;
                    context.strokeWidth = doc.lineWidth;
                    var num = 1;
                    for (var j = cellHeight; j < doc.height; j += cellHeight) {
                        /**
                         * 这里行的起始位置的横坐标为doc.marginL,
                         * 因为canvas的border是从距离左边doc.marginL的地方开始画的
                         */
                        if (num % doc.rowsPerLine != 0) {
                            context.moveTo(doc.marginL, j + 0.5);
                        } else {
                            context.moveTo(doc.marginL, j);
                        }
                        context.lineTo(doc.tWidth, j + 0.5);
                        num++;
                    }
                    context.stroke();
                }
                // 绘制背景中的点
                {
                    if (ifPoint) {
                        var dotMargin = Math.floor(doc.cellWidth / 5);
                        var context = doc.context.bcContext;
                        context.fillStyle = doc.dotColor;

                        var i = dotMargin + doc.marginL;
                        for (i; i < doc.tWidth; i += dotMargin) {
                            if (((i - doc.marginL
                                 ) % doc.cellWidth
                                ) != 0) {    // 列分隔线处不打点
                                for (var j = dotMargin; j < doc.height; j += dotMargin) {
                                    if ((j % doc.cellHeight
                                        ) != 0) {    // 行分割线处不打点
                                        context.rect(i, j, doc.dotWidth, doc.dotWidth);
                                    }
                                }
                            }
                        }
                        context.fill();
                    }
                }
                // 绘制左边说明文字
                {
                    outUtil.setDescriptionWords();
                }
                // 将doc.ecgDom.bc的内容导出为图片, 并设置为ECG最外层容器的背景
                {
                    innerUtil.setECGBackground();
                }

                return true;
            },

            /**
             * 清空doc.context.fcContext中绘制的内容，准备绘制新的内容
             *
             * @returns {boolean}
             */
            clearFc : function () {
                var context = doc.context.fcContext;
                var fc = doc.ecgDom.fc;
                var fcWidth = fc.width;
                var fcHeight = fc.height;
                context.clearRect(0, 0, fcWidth, fcHeight);

                // 将所有心电线段的坐标重置
                innerUtil.resetAllCoordinate();

                return true;
            },

            /**
             * 绘制心电图中的V1这条线当前位置到下一位置的线段
             *
             * @param v
             */
            drawV1 : function (v) {
                innerUtil.drawECG('v1', v);
            },

            /**
             * 绘制心电图中的V5这条线当前位置到下一位置的线段
             *
             * @param v
             */
            drawV5 : function (v) {
                innerUtil.drawECG('v5', v);
            },

            /**
             * 绘制心电图中的avf这条线当前位置到下一位置的线段
             *
             * @param v
             */
            drawAvf : function (v) {
                innerUtil.drawECG('avf', v);
            },

            /**
             * 绘制心电图中的pacer这条线当前位置到下一位置的线段
             *
             * @param v
             */
            drawPacer : function (v) {
                innerUtil.drawECG('pacer', v);
            },

            /**
             * 获取当前要清除的心电的区域
             *
             * @param name 要清除的心电的名字
             * @returns {*} 要清除心电区域的坐标
             */
            getClearCoordinate : function (name) {
                if (doc.descriptionWords.style[ name ]) {
                    var obj = doc.descriptionWords.style[ name ];
                    var index = obj.index;
                    var rowsPerLine = doc.rowsPerLine;
                    var clearH1 = (index - 1
                                  ) * rowsPerLine * doc.cellHeight;
                    var clearH2 = rowsPerLine * doc.cellHeight;
                    var width = doc.ecgDom.fc.width;

                    return {
                        clearH1 : clearH1,
                        clearH2 : clearH2,
                        width   : width
                    };
                }

                return false;
            },

            /**
             * 擦掉指定的心电图
             *
             * @param name
             * @returns {boolean}
             */
            clearECG : function (name) {
                if (name) {
                    var context = doc.context.fcContext;
                    if (innerUtil.isArray(name)) {
                        var len = name.length;
                        for (var i = 0; i < len; i++) {
                            var subName = name[ i ];
                            var coor = chart.getClearCoordinate(subName);
                            if (coor) {
                                context.save();
                                context.clearRect(0, coor.clearH1, coor.width, coor.clearH2);
                                context.restore();
                            }
                        }
                    } else if (innerUtil.isString(name)) {
                        var coor = chart.getClearCoordinate(name);
                        if (coor) {
                            context.save();
                            context.clearRect(0, coor.clearH1, coor.width, coor.clearH2);
                            context.restore();
                        }
                    }

                    return true;
                }

                return false;
            },

            /**
             * 用于重新设置增益的值
             *
             * @param val
             * @returns {boolean}
             */
            setGain : function (val) {
                if (!innerUtil.isNumber(val)) {
                    console.log('error: the type of val is not Number but ' + Object.prototype.toString.call(val));
                    return false;
                }

                doc.fc.gain.cur = val;
                doc.fc.gain.mul = val / doc.fc.gain.std;

                if (!this.drawFc()) {
                    return false;
                }

                return true;
            },

            /**
             * 用于重新设置走速的值
             * @param val
             * @returns {boolean}
             */
            setPs : function (val) {
                if (!innerUtil.isNumber(val)) {
                    console.log('error: the type of the val is not Number but' + Object.prototype.toString.call(val));
                    return false;
                }

                doc.fc.ps.cur = val;
                var mul = val / doc.fc.ps.std;
                doc.fc.ps.mul = mul;

                var fcWidth = doc.cellWidth * doc.colsPerSecond * 72 * mul;
                outUtil.setFcWH({width : fcWidth});

                if (!this.drawFc()) {
                    return false;
                }

                return true;
            },

            /**
             * 绘制doc.ecgDom.fc,
             *
             * @returns {boolean}
             */
            drawFc : function () {
                // 每次绘制先清空fc画布
                {
                    this.clearFc();
                }

                // 绘制心电
                {
                    var ecgData = doc.ecgData;
                    var hwLeadConfig = ecgData.hwLeadConfig;
                    var ecgPartBlocks = ecgData.ecgPartBlocks;
                    var allDrawECG = innerUtil.getAllDrawECG();
                    var allDrawECGLen = allDrawECG.length;

                    for (var i = 0; i < 18; i++) {
                        var subBlocks = ecgPartBlocks[ i ];
                        var ecgPartBlocksHead = subBlocks[ 'ecgPartBlockHead' ];
                        var ecgPartBlocksData = subBlocks[ 'ecgPartBlockData' ];

                        for (var j = 0; j < allDrawECGLen; j++) {
                            var name = allDrawECG[ j ];
                            var index = innerUtil.getEcgIndex(name);
                            var data = ecgPartBlocksData[ index ];
                            var dataLen = data.length;

                            for (var k = 0; k < dataLen; k++) {
                                var v = data[ k ];
                                innerUtil.drawECG(name, v);
                            }
                        }
                    }
                }

                return true;
            }
        };

        // 返回
        return {
            doc   : doc,
            css   : css,
            chart : chart,
            util  : outUtil,
            inner : innerUtil
        };
    }
)();
