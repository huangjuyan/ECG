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
            ecgDom   : {
                // canvas容器
                c  : {},
                // 背景 | 后面的canvas
                bc : {},
                // 心电 | 前面的canvas
                fc : {}
            },
            width    : 1000,
            height   : 500,
            fcWidth  : 1000,
            fcHeight : 500,
            isInit   : false
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
            },
        };

        /**
         * 工具对象,存放工具函数,可对外公开的outUtil部分
         */
        var outUtil = {
            /**
             * 设置ECG容器的宽度和高度,暂时不支持设置doc.ecgDom.fc的宽度和高度
             *
             * @param param
             */
            setECGWH : function (param) {
                if (typeof param !== 'object') {
                    console.log('setECGWH参数错误');
                    return;
                } else {
                    var ecgDom = doc.ecgDom;
                    // 如果设置了宽度则逐个设置宽度
                    if ('width' in param) {
                        var width = param.width;
                        ecgDom.c.width = param.width;
                        ecgDom.bc.width = param.width;
                    }
                    // 如果设置高度则逐个设置高度
                    if ('height' in param) {
                        var height = param.height;
                        ecgDom.c.height = param.height;
                        ecgDom.bc.height = param.height;
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
                    return;
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
             * 设置ECG容器的宽度和高度,如果没有则使用默认值,默认1000*500
             *
             * @param obj{width: number, height: number},宽度和高度为数字
             */
            initECGWH : function (obj) {
                if (typeof obj === 'object') {
                    if ('width' in obj) {
                        doc.ecgDom.width = obj.width;
                    }
                    if ('height' in obj) {
                        doc.ecgDom.height = obj.height;
                    } else {
                        doc.ecgDom.height = doc.ecgDom.width / 2;
                    }
                } else {
                    console.log('initECGWH参数错误');
                }
            },

            /**
             * 初始化canvas
             *
             * @param obj   canvas配置信息
             * @param isBc 是否是心电背景
             */
            initCanvas : function (param, isBc) {
                if (typeof param !== 'object') {
                    console.log('初始化canvas失败,传入的参数错误。');
                    return;
                }

                var canvas = document.createElement('canvas');

                canvas.width = param.width;
                canvas.height = param.height;

                if (isBc) {
                    canvas.id = 'bc';
                } else {
                    canvas.id = 'fc';
                }

                return canvas;
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
                        innerUtil.initECGWH(obj);
                    }

                    // 分别生成背景和心电用的canvas
                    {
                        doc.ecgDom.bc = innerUtil.initCanvas(doc, true);
                        doc.ecgDom.fc = innerUtil.initCanvas(doc, false);

                        doc.ecgDom.c.appendChild(doc.ecgDom.bc);
                        doc.ecgDom.c.appendChild(doc.ecgDom.fc);
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
                    return;
                }
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
