Volcanos("onfigure", {help: "控件详情", list: [],
    province: {click: function(event, can, value, cmd, target) {
        if (can.figure) {return}
        can.figure = can.page.Append(can, document.body, [{view: ["date input", "fieldset"], style: {
            position: "absolute", left: "20px", top: event.clientY+10+"px",
        }, onmouseleave: function(event) {
            can.page.Remove(can, can.figure); delete(can.figure);
        }}]).last

        can.page.Append(can, can.figure, [{include: ["/plugin/github.com/shylinux/echarts/echarts.js", function(event) {
            can.page.Append(can, can.figure, [{include: ["/plugin/github.com/shylinux/echarts/china.js", function(event) {
                var china_chart = echarts.init(can.page.Append(can, can.figure, [{type: "div", style: {width: "600px", height: "400px"}}]).last);

                var option = {geo: {map: 'china'}};
                china_chart.setOption(option);

                china_chart.on('click', function (params) {
                    target.value = params.name;
                });
            }]}]);
        }]}]);
    }},
    _prepare: function(event, can, value, cmd, target) {if (can.figure) {return}
        can.figure = can.page.Append(can, document.body, [{view: ["input "+cmd, "fieldset"], style: {
            position: "absolute", left: "20px", top: event.clientY+10+"px",
        }, list: [{text: [cmd, "legend"]}, {view: ["action"]}, {view: ["output"]}], onmouseleave: function(event) {
            !can.figure.stick && can.onfigure._release(event, can, value, cmd, target)
        }}])
        return can.figure
    },
    _release: function(event, can, value, cmd, target) {
        can.page.Remove(can, can.figure.first); delete(can.figure);
    },
})
