Volcanos("onimport", {help: "导入数据", list: [],
    _init: function(can, meta, list, cb, output, action, option, field) {
    },
})
Volcanos("onaction", {help: "控件交互", list: [],
    onchange: function(event, can) {
        if (event.target.tagName == "SELECT") {
            can.run(event)
        }
    },
    onclick: function(event, can) {
        if (can.Conf("name") == "添加") {
            can.user.input(event, can, can.sup.Conf("feature").insert,function(event, button, data, list) {
                var args = ["action", "insert"]; can.core.Item(data, function(key, value) {
                    key && value && args.push(key, value)
                })
                can.run(event, args, function(msg) {
                    can.user.toast(can, "添加成功")
                })
                return true
            })
            return
        }

        switch (can.Conf("type")) {
            case "button":
                can.run(event, [], function() {})
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
