Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, conf, list, cb, target) {
    },
})
Volcanos("onaction", {help: "控件交互", list: [],
    "上传": function(event, can) { can.user.upload(event, can) },
    "查看": function(event, can) { can.run(event) },
    "返回": function(event, can) {
        can.sup._history.pop(); var his = can.sup._history.pop(); if (his) {
            can.page.Select(can, can._option, "input.args", function(item, index) {
                item.value = his[index] || ""
            })
        }
        can.run(event)
    },

    onchange: function(event, can) {
        if (event.target.tagName == "SELECT") { can.run(event) }
    },
    onclick: function(event, can) { var msg = can.sup.request(event)
        // 插件回调
        var name = can.Conf("name")
        var sub = can.sup._outputs && can.sup._outputs[can.sup._outputs.length-1]
        var cb = sub && sub.onaction && sub.onaction[name]
        if (typeof cb == "function") { return cb(event, sub, name) }

        // 交互回调
        var feature = can.sup.Conf("feature")
        var input = feature && feature[name]; if (input) {
            return can.sup.onaction.input(event, can.sup, name, function(msg) {
                can.run({})
            })
        }

        // 控件回调
        var cb = can.onaction[name]
        if (typeof cb == "function") { return cb(event, can, name) }

        // 通用回调
        if (can.Conf("type") == "button") { can.run(event, [name].concat(can.sup.Pack())) }
        if (event.target.tagName == "INPUT") { event.target.setSelectionRange(0, -1) }
    },
    onkeydown: function(event, can) {
        can.onkeypop.show(event, can)
        switch (event.key) {
            case "Enter":
                if (event.target.tagName == "INPUT") { event.target.setSelectionRange(0, -1), can.run(event) }
                if (event.target.tagName == "TEXTAREA") { break }
                event.stopPropagation()
                event.preventDefault()
                break
            case "b": if (!event.ctrlKey) { return }; can.CloneInput(); break
            case "m": if (!event.ctrlKey) { return }; can.CloneField(); break
            default: return
        }
    },
    onkeyup: function(event, can) {
        switch (event.key) {
            case "Enter":
                if (event.target.tagName == "TEXTAREA") { break }
                event.stopPropagation()
                event.preventDefault()
                break
            default: return
        }
    },
})

