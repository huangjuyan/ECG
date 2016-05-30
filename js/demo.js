/**
 * Author:      Tao-Quixote
 * CreateTime:  16/5/26 13:53
 * Description: This a demo.js, useless.
 */

$(function () {
    ECG.chart.init({
        id : 'canvas'
    });
    ECG.chart.drawBc(ECG.doc.ecgDom.bc);
});
