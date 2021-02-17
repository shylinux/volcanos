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
        can.toast = can.page.Append(can, target, [{view: "toast", onclick: function(event) {
            var ui = can.onappend.field(can, "story toast float", {}, document.body)
            can.run({}, ["search", "Action.onexport.size"], function(msg, top, left, width, height) {
                can.page.Modify(can, ui.output, {style: {"max-width": width, "max-height": height-28}})
                can.page.Modify(can, ui.first, {style: {top: top, left: left}})
            } )

            can.onappend._action(can, ["关闭", "刷新"], ui.action, {
                "关闭": function(event) { can.page.Remove(can, ui.first) },
                "刷新": function(event) { can.page.Remove(can, ui.first), can.toast.click() },
            })
            can.onappend.table(can, can._toast, function(value) {
                return {text: [value, "td"], onclick: function(event) {

                }}
            }, ui.output)
        }}]).first
    },
    _state: function(can, msg, target) {
        can.core.List(can.Conf("state")|["ncmd"], function(item) {
            can.page.Append(can, target, [{view: ["state "+item, "div", can.Conf(item)], list: [
                {text: [item, "label"]}, {text: [": ", "label"]}, {text: [can.Conf(item)||"", "span", item]},
            ]}])
        })
    },

    toast: function(can, msg, title, content, fileline, time) { can._toast = can._toast || can.request()
        can.page.Modify(can, can.toast, [time.split(" ").pop(), title, content].join(" "))
        can._toast.Push({time: time, fileline: fileline, title: title, content: content})
    },
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

