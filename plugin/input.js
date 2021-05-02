Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, meta, list, cb, target) {
    },
})
Volcanos("onaction", {help: "控件交互", list: [], _init: function(can, meta, list, cb, target) {
        can.base.isFunc(cb) && cb(); switch (meta.type) {
            case "textarea":
            case "text":
                !target.placeholder && (target.placeholder = can.user.trans(can, meta.name) || "")
                !target.title && (target.title = target.placeholder)
                break
            case "select": meta.value && (target.value = meta.value); break
            case "button": meta.action == "auto" && target.click(); break
        }
    },

    "upload": function(event, can) { can.user.upload(event, can) },
    "执行": function(event, can) { can.run(event) },
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
    onkeyup: function(event, can) { },
})
Volcanos("onexport", {help: "导出数据", list: []})

