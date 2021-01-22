Volcanos("onfigure", {help: "控件详情", list: [], province: {onclick: function(event, can, item, target, figure) {
    can.require(["/require/github.com/shylinux/echarts/echarts.js","/require/github.com/shylinux/echarts/china.js"], function() {
        can.onappend._action(can, ["关闭", "清空"], figure.action, {
            "关闭": function(event) { can.page.Remove(can, figure.fieldset) },
            "清空": function(event) { target.value = "" },
        })

        can.page.Modify(can, figure.fieldset, {style: {left: 120}})
        var china_chart = echarts.init(can.page.Append(can, figure.output, [{type: "div", style: {width: "600px", height: "400px"}}]).first);
        china_chart.setOption({geo: {map: 'china'}}), china_chart.on('click', function (params) {
            target.value = params.name, msg.Option("_refresh") && run()
            can.page.Remove(can, figure.fieldset) 
        })
    })
}}, })

