Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, meta, list, cb, output, action, option, field) {
    },
})
Volcanos("onaction", {help: "控件交互", list: [],
    onchange: function(event, can) {
        if (event.target.tagName == "SELECT") { can.run(event) }
    },
    onclick: function(event, can) { var name = can.Conf("name")
        var msg = can.sup.request(event)
        // 前端回调
        var sub = can.sup && can.sup._outputs && can.sup._outputs[can.sup._outputs.length-1]
        var cb = sub && sub.onaction && sub.onaction[name]
        if (typeof cb == "function") { return cb(event, sub, name) }

        // 通用回调
        var cb = can.onaction[name]
        if (can.sup && typeof cb == "function") { return cb(event, can.sup, name) }

        // 后端回调
        var feature = can.sup.Conf("feature")
        var input = feature && feature[name]; if (input) {
            return can.user.input(event, can, input,function(event, button, data, list) {
                var msg = can.request(event); msg.Option(can.sup.Option())
                var args = ["action", name]; can.core.Item(data, function(key, value) {
                    key && value && args.push(key, value)
                })
                can.run(event, args, function(msg) { can.run(event) }, true)
                return true
            })
        }

        // 通用回调
        if (can.Conf("type") == "button") { can.run(event) }
    },
    onkeydown: function(event, can) {
        can.onkeypop.show(event, can)
        switch (event.key) {
            case "Enter":
                if (event.target.tagName == "TEXTAREA") {
                    break
                }
                if (event.target.tagName == "INPUT") {
                    can.run(event)
                }
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
                event.stopPropagation()
                event.preventDefault()
                break
            default: return
        }
    },

    "上传": function(event, can) { can.user.upload(event, can) },
})

