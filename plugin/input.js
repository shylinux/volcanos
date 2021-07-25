var _can_name = "/plugin/input.js"
Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, meta, list, cb, target) {
    },
})
Volcanos("onaction", {help: "控件交互", list: [], _init: function(can, meta, list, cb, target) {
        can.base.isFunc(cb) && cb(); switch (meta.type) {
            case "select": meta.value && (target.value = meta.value); break
            case "button": meta.action == "auto" && target.click(); break
        }
    },

    "执行": function(event, can) {
        var title = can.sup._name+" "+can.sup.Pack([], true)
        var toast = can.user.toast(can, "执行中...", title, -1)
        can.run(event, [], function() { toast.close(), can.user.toast(can, "执行成功...", title) })
    },
    "刷新": function(event, can) { can.run(event) },
    "查看": function(event, can) { can.run(event) },
    "返回": function(event, can) { can.sup.onimport._back(can.sup) },

    onchange: function(event, can) {
        if (can.Conf("type") == "select") { can.run(event) }
    },
    ondblclick: function(event, can) {
        if (can.Conf("type") == "text") { event.target.setSelectionRange(0, -1) }
    },
    onclick: function(event, can) {
        if (can.Conf("type") == "button") { can.run(event, ["action", can.Conf("name")].concat(can.sup.Pack())) }
    },

    onkeydown: function(event, can) { var target = event.target
        switch (can.Conf("type")) {
            case "textarea": if (!event.ctrlKey) { return }
        }
        can.onkeypop.input(event, can, target); switch (event.key) {
            case "Enter":
                switch (can.Conf("type")) {
                    case "textarea": if (!event.ctrlKey) { return }
                    case "text": event.target.setSelectionRange(0, -1); break
                }; can.run(event), event.stopPropagation(), event.preventDefault(); break
            case "b": if (event.ctrlKey) { can.CloneInput() } break
            case "m": if (event.ctrlKey) { can.CloneField() } break
        }
    },
})
Volcanos("onexport", {help: "导出数据", list: []})
var _can_name = ""
