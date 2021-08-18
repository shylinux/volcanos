Volcanos("onfigure", {help: "控件详情", list: [], province: {onclick: function(event, can, meta, cb, target) {
    can.require(["/require/shylinux.com/x/echarts/echarts.js","/require/shylinux.com/x/echarts/china.js"], function() {
        can.onappend._action(can, ["关闭", "清空"], can._action, {
            "关闭": function(event) { can.page.Remove(can, can._target) },
            "清空": function(event) { target.value = "" },
        })

        var china_chart = echarts.init(can.page.Append(can, can._output, [{type: "div", style: {width: "600px", height: "400px"}}]).first)
        china_chart.setOption({geo: {map: 'china'}}), china_chart.on('click', function (params) {
            target.value = params.name, can.page.Remove(can, can._target) 
        }), can.Status("count", 34)
        can.onlayout.figure(event, can)
    })
}}, })

