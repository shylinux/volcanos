Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, msg, list, cb, target) {
        can.onmotion.clear(can)
        can.onimport._title(can, msg, target)
        can.onimport._toast(can, msg, target)
        can.onimport._state(can, msg, target)
        typeof cb == "function" && cb(msg)
    },
    _title: function(can, msg, target) {
        can.user.isMobile || can.core.List(msg.result, function(title) {
            can.page.Append(can, target, [{view: ["title", "div", title]}])
        })
    },
    _toast: function(can, msg, target) {
        can.toast = can.page.Append(can, target, [{view: ["toast", "div", ""]}]).first
    },
    _state: function(can, msg, target) {
        can.core.List(can.Conf("state")|["ncmd"], function(item) {
            can.page.Append(can, target, [{view: ["state "+item, "div", can.Conf(item)], list: [
                {text: [item, "label"]}, {text: [": ", "label"]}, {text: [can.Conf(item)||"", "span", item]},
            ]}])
        })
    },

    toast: function(can, msg, text) { can.page.Modify(can, can.toast, text) },
    ncmd: function(can, target) {
        can.page.Select(can, target, "span.ncmd", function(item) {
            item.innerHTML = can.Conf("ncmd", parseInt(can.Conf("ncmd")||"0")+1+"")+""
        })
    },
})
Volcanos("onaction", {help: "交互数据", list: [], _init: function(can, msg, list, cb, target) {
        can.run({}, [], function(msg) { can.onimport._init(can, msg, list, cb, can._output) })
    },
})
Volcanos("onexport", {help: "导出数据", list: [],
    height: function(can) { return can._target.offsetHeight },
})

