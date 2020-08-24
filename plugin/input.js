Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, meta, list, cb, output, action, option, field) {
    },
})
Volcanos("onaction", {help: "控件交互", list: [],
    onchange: function(event, can) {
        if (event.target.tagName == "SELECT") {
            can.run(event)
        }
    },
    onclick: function(event, can) {
        // 前端回调
        var sub = can.sup && can.sup._outputs && can.sup._outputs[can.sup._outputs.length-1]
        var cb = sub && sub.onaction && sub.onaction[can.Conf("name")]
        if (typeof cb == "function") { return cb(event, sub, can.Conf("name")) }

        // 通用回调
        var cb = can.onaction[can.Conf("name")]
        if (can.sup && typeof cb == "function") { return cb(event, can.sup, can.Conf("name")) }

        // 后端回调
        var feature = can.sup.Conf("feature")
        var input = feature && feature[can.Conf("name")]; if (input) {
            return can.user.input(event, can, input,function(event, button, data, list) {
                var msg = can.request(event); can.core.Item(can.sup.Option(), msg.Option)
                var args = ["action", can.Conf("name")]; can.core.Item(data, function(key, value) {
                    key && value && args.push(key, value)
                })
                can.run(event, args, function(msg) {
                    can.user.toast(can, "添加成功")
                    can.run(event)
                }, true)
                return true
            })
        }

        // 通用回调
        if (can.Conf("type") == "button") {
            var toast = can.user.toast(can, "执行中...", can.sup._help, 100000)
            can.run(event, [], function(msg) {
                toast.Close()
            })
        }
    },
    onkeydown: function(event, can) {
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

