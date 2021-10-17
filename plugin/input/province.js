Volcanos("onfigure", {help: "控件详情", list: [], province: {onclick: function(event, can, meta, cb, target) {
    can.require(["/require/github.com/shylinux/echarts/echarts.js", "/require/github.com/shylinux/echarts/china.js"], function() {
        can.onappend._action(can, [cli.CLOSE, cli.CLEAR], can._action, {
            close: function(event) { can.page.Remove(can, can._target) },
            clear: function(event) { target.value = "" },
        })

        var china_chart = echarts.init(can.page.Append(can, can._output, [{type: html.DIVk, style: {width: "600px", height: "400px"}}]).first)
        china_chart.setOption({geo: {map: 'china'}}), china_chart.on('click', function (params) {
            target.value = params.name, can.page.Remove(can, can._target) 
        }), can.Status(kit.MDB_COUNT, 34)
        can.onlayout.figure(event, can)
    })
}}, })

