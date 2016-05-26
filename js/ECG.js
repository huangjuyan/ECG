/**
 * Author:      Tao-Quixote
 * CreateTime:  16/5/26 11:10
 * Description: ECG.js主文件,主要将可以投入生产环境使用的相关方法插入该文件
 */
var ECG = (function () {
        return {
            // 工具对象,存放工具函数
            util : {
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
                }
            }
        };
    }
)();
