Volcanos("onimport", {help: "导入数据", list: [],
    _init: function(can, meta, list, cb, output, action, option, field) { output.innerHTML = "";
    },
})
Volcanos("onaction", {help: "控件交互", list: [],
    onclick: function(event, can) {
        switch (can.Conf("type")) {
            case "button":
                can.run(event, [], function() {})
                break
        }
    },
    onkeydown: function(event, can) {
        switch (event.key) {
            case "Enter": can.run(event, [], function() {}); break
            case "b": if (!event.ctrlKey) { return }; can.CloneInput(); break
            case "m": if (!event.ctrlKey) { return }; can.CloneField(); break
            default: return
        }
        event.stopPropagation()
        event.preventDefault()
    },
    onkeyup: function(event, can) {
        switch (event.key) {
            case "Enter":
                can.run(event, [], function() {})
                event.stopPropagation()
                event.preventDefault()
                break
        }
    },
})
