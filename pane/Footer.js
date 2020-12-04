Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, msg, list, cb, target) {
        target.innerHTML = ""
        can.onimport._title(can, msg, target)
        can.onimport._state(can, msg, target)
        typeof cb == "function" && cb(msg)
    },
    _title: function(can, msg, target) {
        can.core.List(msg.result, function(title) {
            can.page.Append(can, target, [{view: ["title", "div", title]}])
        })
    },
    _state: function(can, msg, target) {
        can.core.List(can.Conf("state"), function(item) {
            can.page.Append(can, target, [{view: ["state "+item, "div", can.Conf(item)],
                list: [{text: item}, {text: ": "}, {text: [can.Conf(item)||"", "span", item]}],
            }])
        })
    },

    ncmd: function(can, msg, list, cb, target) {
        can.page.Select(can, target, "span.ncmd", function(item) {
            item.innerHTML = can.Conf("ncmd", parseInt(can.Conf("ncmd")||"0")+1+"")+""
        })
    },
})
Volcanos("onaction", {help: "交互数据", list: [], _init: function(can, msg, list, cb, target) {
        can.run({}, [], function(msg) {
            can.onimport._init(can, msg, list, cb, can._output)
        })
    },
})
Volcanos("onexport", {help: "导出数据", list: []})

