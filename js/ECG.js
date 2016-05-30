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

            context : {
                bcContext : null,
                fcContext : null
            },

            width      : 1000,    // ECG容器的宽度
            height     : 600,     // ECG容器的高度
            marginL    : 100,      // canvas左边边距,用来存放说明性的文字
            tWidth     : 1100,     // canvas元素的总宽度
            fcWidth    : 1000,    // fc宽度
            fcHeight   : 600,     // fc高度
            cellWidth  : 40,       // 背景单元格宽度
            cellHeight : 40,       // 背景单元格高度

            borderColor : 'red', // 边框颜色
            borderWidth : 1,    // 边框宽度
            lineColor   : 'red',   // 背景线条颜色
            lineWidth   : 1,    // 背景线条宽度
            isInit      : false,   // ECG对象是否初始化
            ifPoint     : false    // ECG.ecgDom.bc是否要画点
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
                position : 'relative'
            },
            // bc中存放ECG中bc的样式,其中所有的样式都会应用到bc容器上
            bc : {
                position : 'absolute',
                left     : 0,
                top      : 0
            }
        };

        /**
         * 只在函数内部使用的,不对外公开的innerUtil部分
         * @type {{}}
         */
        var innerUtil = {
            /**
             * 将鼠标在window中的绝对坐标转换为在canvas中相对canvas边界的坐标
             * @param canvas canvas对象
             * @param x 鼠标在window中的坐标x
             * @param y 鼠标在window中的坐标y
             * @returns {{x: number, y: number}}
             */
            windowToCanvas : function (canvas, x, y) {
                var bbox = canvas.getBoundingClientRect();

                return {
                    x : (x - bbox.left
                        ) * (canvas.width / bbox.width
                        ),
                    y : (y - bbox.top
                        ) * (canvas.height / bbox.height
                        )
                };
            },

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
                        doc.ecgDom.width = obj.width;
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
             * @param param   canvas配置信息
             * @param isBc 是否是心电背景
             */
            initCanvas : function (param, isBc) {
                if (typeof param !== 'object') {
                    console.log('初始化canvas失败,传入的参数错误。');
                    return;
                }

                var canvas = document.createElement('canvas');

                canvas.height = param.height;

                /**
                 * 分别处理bc和fc,
                 * bc的宽度会增加doc.marginL,用来存放说明文字
                 * fc左边的边距会增加doc.marginL,便于与bc对齐
                 */
                if (isBc) {
                    canvas.width = param.width + doc.marginL;
                    canvas.id = 'bc';
                } else {
                    canvas.width = param.width;
                    canvas.style.marginLeft = doc.marginL + 'px';
                    canvas.id = 'fc';
                }

                return canvas;
            }
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
                        ecgDom.c.width = width;
                        ecgDom.bc.width = width;
                    }
                    // 如果设置高度则逐个设置高度
                    if ('height' in param) {
                        var height = param.height;
                        ecgDom.c.height = height;
                        ecgDom.bc.height = height;
                    }
                }
            },

            /**
             * 设置ECG.doc.ecgDom.fc的宽度和高度
             * @param param
             */
            setFcWH : function (param) {
                if (typeof param !== 'object') {
                    console.log('setFcWH参数错误');
                    return false;
                } else {
                    if ('width' in param) {
                        doc.ecgDom.fc.width = param.width;
                    }
                    if ('height' in param) {
                        doc.ecgDom.fc.height = param.height;
                    }
                }
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
            }
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

                    // 配置容器的大小,高度默认为宽度的一半
                    {
                        innerUtil.initECGProperty(obj);
                    }

                    // 分别生成背景和心电用的canvas
                    {
                        doc.ecgDom.bc = innerUtil.initCanvas(doc, true);
                        doc.ecgDom.fc = innerUtil.initCanvas(doc, false);

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
             * 绘制doc.ecgDom.bc
             *
             * @returns {boolean}
             */
            drawBc : function () {
                // todo 在绘制的时候要注意考虑doc.marginL
                // 检测canvas是否存在
                {
                    if (!canvas) {
                        console.log('drawBc参数错误,未设置canvas或者找不到指定的canvas');
                        return false;
                    }
                }

                var canvas     = doc.ecgDom.bc,     // 背景canvas对象
                    cellWidth  = doc.cellWidth,    // 单元格的宽度
                    cellHeight = doc.cellHeight,   // 单元格的高度
                    ifPoint    = doc.ifPoint,       // 是否绘制背景中点标志位
                    context    = doc.context.bcContext;

                // 先清空画布
                {
                    context.clearRect(doc.marginL, 0, doc.tWidth, doc.height);
                }
                // 绘制背景的边框
                {
                    context.beginPath();
                    context.strokeStyle = doc.borderColor;
                    context.strokeWidth = doc.borderWidth;
                    // 这里绘制边框时左边要留出doc.marginL的宽度,用来放置说明文字
                    context.rect(doc.marginL, 0, doc.width, doc.height);
                    context.stroke();
                }
                // 绘制背景的列
                {
                    if (!cellWidth) {
                        cellWidth = 40;
                    }
                    context.beginPath();
                    context.strokeStyle = doc.lineColor;
                    context.strokeWidth = doc.lineWidth;
                    /**
                     * 这里i的初始值应为width+doc.marginL,
                     * 因为边框距离canvas左边距为doc.marginL,
                     */
                    var i      = cellWidth + doc.marginL,
                        tWidth = doc.width + doc.marginL;

                    for (i; i < tWidth; i += cellWidth) {
                        context.moveTo(i + 0.5, 0);
                        context.lineTo(i + 0.5, doc.height);
                    }
                    context.stroke();
                }
                // 绘制背景的行
                {
                    if (!cellHeight) {
                        cellHeight = width;
                    }
                    context.beginPath();
                    context.strokeStyle = doc.lineColor;
                    context.strokeWidth = doc.lineWidth;
                    for (var j = cellHeight; j < doc.height; j += cellHeight) {
                        /**
                         * 这里行的起始位置的横坐标为doc.marginL,
                         * 因为canvas的border是从距离左边doc.marginL的地方开始画的
                         */
                        context.moveTo(doc.marginL, j + 0.5);
                        context.lineTo(doc.tWidth, j + 0.5);
                    }
                    context.stroke();
                }
                // 绘制背景中的点
                {
                    if (ifPoint) {
                        console.log('未实现绘制背景中的点功能, chart.drawBc');
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
            util  : outUtil
        };
    }
)();
