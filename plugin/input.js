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
        var feature = can.sup.Conf("feature")
        var input = feature && feature[can.Conf("name")]

        if (input) {
            can.user.input(event, can, input,function(event, button, data, list) {
                var args = ["action", can.Conf("name")]; can.core.Item(data, function(key, value) {
                    key && value && args.push(key, value)
                })
                can.run(event, args, function(msg) {
                    can.user.toast(can, "添加成功")
                    can.run(event)
                }, true)
                return true
            })
            return
        }

        switch (can.Conf("type")) {
            case "button":
                var toast = can.user.toast(can, "执行中...", can.sup._help, 100000)
                can.run(event, [], function(msg) {
                    toast.Close()
                })
                break
        }
    },
    onkeydown: function(event, can) {
        switch (event.key) {
            case "Enter":
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
})
