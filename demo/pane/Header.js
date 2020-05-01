Volcanos("onimport", {help: "导入数据", list: [],
    _init: function(can, meta, list, cb, output, action, option, field) { output.innerHTML = "";
        can.run({}, [], function(msg) {
            console.log("volcano", "Header", "display", msg.result)
            can.core.List(msg.result, function(title) {
                can.page.Append(can, output, [{view: ["title", "div", title],
                    click: function(event) {can.Export(event, meta.title, "title")},
                }])
            })

            console.log("volcano", "Header", "display", meta.state)
            can.ui = can.page.Append(can, output, [{view: "state", list: can.core.List(meta.state, function(item) {
                return {text: meta[item]||"", className: item, click: function(event) {can.Export(event, meta[item], item)}};
            })}])

            can.timer = can.Timer({interval: 1000, length: -1}, function(event) {
                can.onimport.time(event, can, can.base.Time().split(" ")[1], "time")
            })
        })
        return
    },
    time: function(event, can, value, cmd, field) {
        can.ui[cmd].innerHTML = value
    },
})
