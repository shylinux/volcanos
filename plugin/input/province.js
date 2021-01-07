Volcanos("onfigure", {help: "控件详情", list: [],
    province: {click: function(event, can, value, cmd, target, figure) {
        figure.fieldset.style.left = "20px"
        figure.fieldset.style.top = "200px"

        var china_chart = echarts.init(can.page.Append(can, figure.output, [{type: "div", style: {width: "600px", height: "400px"}}]).last);

        var option = {geo: {map: 'china'}};
        china_chart.setOption(option);

        china_chart.on('click', function (params) {
            target.value = params.name;
        });
    // , ["require/github.com/shylinux/echarts/echarts.js","require/github.com/shylinux/echarts/china.js"])
    }},
})

