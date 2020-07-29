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
            navigator.clipboard.readText().then(function(text) {
                console.log(text)
                can.run(event, ["action", "insert", "paste", "", text], function() {})
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
