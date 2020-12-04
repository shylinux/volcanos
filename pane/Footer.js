Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, msg, list, cb, target) {
        can._output.innerHTML = ""
        can.onimport._title(can, msg)
        can.onimport._state(can, msg)
        typeof cb == "function" && cb()
    },
    _title: function(can, msg) {
        can.core.List(msg.result, function(title) {
            can.page.Append(can, can._output, [{view: ["title", "div", title]}])
        })
    },
    _state: function(can, msg) {
        can.core.List(can.Conf("state"), function(item) {
            can.page.Append(can, can._output, [{view: ["state "+item, "div", can.Conf(item)],
                list: [{text: item}, {text: ": "}, {text: [can.Conf(item)||"", "span", item]}],
                click: function(event) { can.onaction[item](event, can, item) },
            }])
        })
    },
})
Volcanos("onaction", {help: "交互数据", list: [], _init: function(can, msg, list, cb, target) {
        can.run({}, [], function(msg) {
            can.onimport._init(can, msg, list, cb, target)
        })
    },
    ncmd: function(can, msg, list, cb, target) {
        can.page.Select(can, can._target, "span.ncmd", function(item) {
            item.innerHTML = can.Conf("ncmd", parseInt(can.Conf("ncmd")||"0")+1+"")+""
        })
    },
})
Volcanos("onexport", {help: "导出数据", list: []})

