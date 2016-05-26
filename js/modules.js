/**
 * Author:      Tao-Quixote
 * CreateTime:  16/5/26 11:09
 * Description: 该文件主要放与ECG.js相关的方法与函数
 */

/**
 * 将鼠标在window中的绝对坐标转换为在canvas中相对canvas边界的坐标
 *
 * @param canvas canvas对象
 * @param x 鼠标在window中的坐标x
 * @param y 鼠标在window中的坐标y
 * @returns {{x: number, y: number}}
 */
function windowToCanvas(canvas, x, y) {
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
