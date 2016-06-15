/**
 * Author:      Tao-Quixote
 * CreateTime:  16/5/26 13:53
 * Description: This a demo.js, useless.
 */

$(function () {
    // todo 初始化canvas信息
    ECG.chart.init({
        id : 'canvas'
    });
    // todo 绘制背景
    ECG.chart.drawBc();
    
    // todo 给增益绑定修改事件
    $('#gain').on('change', function(e) {
        var gain = $(this);
        var value = parseInt(gain.val());
        ECG.chart.setGain(value);
    });
    
    // todo 给奏素绑定修改事件
    $('#ps').on('change', function(e) {
       var ps = $(this);
        var value = parseFloat(ps.val());
        ECG.chart.setPs(value);
    });
    
    // TODO 获取服务器数据
    if (true) {
        $.ajax(
            {
                type: 'post',
                contentType: 'application/json',
                dataType: 'json',
                url: 'http://10.0.10.81:8080/ycl-yun-vh-api-webapp/requestEcgDataAnalysis',
                data: JSON.stringify({
                    'ossId': 40
                }),
                success: function(data) {
                    window.result = data.result;
                    window.hwLeadConfig = result.hwLeadConfig;
                    window.ecgPartBlocks = result.ecgPartBlocks;
                }
            }
        )
    }
});
