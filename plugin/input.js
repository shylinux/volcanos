Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, meta, list, cb, target) {
    },
})
Volcanos("onaction", {help: "控件交互", list: [], _init: function(can, meta, list, cb, target) {
        can.core.Item(can.onaction, function(key, value) {
            key.indexOf("on") == 0 && (can._target[key] = can._target[key] || function(event) {
                value(event, can)
            })
        }) , typeof cb == "function" && cb()

        switch (meta.type) {
            case "textarea":
            case "text":
                !target.placeholder && (target.placeholder = meta.name || "")
                !target.title && (target.title = target.placeholder)
                break
            case "button": meta.action == "auto" && can._target.click(); break
            case "select": meta.value && (target.value = meta.value); break
        }

        can.onappend.figure(can, meta, meta.figure, target)
    },

    "upload": function(event, can) { can.user.upload(event, can) },
    "关闭": function(event, can) { can.page.Remove(can, can.sup._target) },
    "上传": function(event, can) { can.user.upload(event, can) },
    "执行": function(event, can) { can.run(event) },
    "刷新": function(event, can) { can.run(event) },
    "查看": function(event, can) { can.run(event) },
    "返回": function(event, can) {
        can.sup._history.pop(); var his = can.sup._history.pop(); if (his) {
            can.page.Select(can, can._option, "textarea.args,input.args,select.args", function(item, index) {
                item.value = his[index] || ""
            })
        }
        can.run(event)
    },

    onchange: function(event, can) {
        if (can.Conf("type") == "select") { can.run(event) }
    },
    ondblclick: function(event, can) {
        if (can.Conf("type") == "text") { event.target.setSelectionRange(0, -1) }
        if (can.Conf("type") == "textarea") { event.target.setSelectionRange(0, -1) }
    },
    onclick: function(event, can) { var msg = can.sup.request(event)
        // 插件回调
        var name = can.Conf("name"), action = can.Conf("action")
        var sub = can.sup._outputs && can.sup._outputs[can.sup._outputs.length-1]
        var cb = sub && sub.onaction && (sub.onaction[action] || sub.onaction[name])
        if (typeof cb == "function") { return cb(event, sub, name) }

        // 交互回调
        var feature = can.sup.Conf("feature")
        var input = feature && feature[name]; if (input) {
            return can.sup.onaction.input(event, can.sup, name, function(msg) {
                if (can.sup._outputs && can.sup._outputs.length > 0) { var i = can.sup._outputs.length - 1
                    can.sup._outputs[i].onimport._process && can.sup._outputs[i].onimport._process(can.sup._outputs[i], msg)
                    return
                }; can.sup.onimport._process(can.sup, msg)
            })
        }

        // 控件回调
        var cb = can.onaction[action] || can.onaction[name]
        if (typeof cb == "function") { return cb(event, can, name) }

        // 组件回调
        var cb = can.sup.onaction[action] || can.sup.onaction[name]
        if (typeof cb == "function") { return cb(event, can, name) }

        // 通用回调
        if (can.Conf("type") == "button") { can.run(event, [name].concat(can.sup.Pack())) }
    },
    onkeydown: function(event, can) { var target = event.target
        can.onkeypop.input(event, can, target)
        switch (event.key) {
            case "Enter":
                if (can.Conf("type") == "text") { event.target.setSelectionRange(0, -1), can.run(event) }
                if (can.Conf("type") == "textarea") { if (!event.ctrlKey) { break }; can.run(event) }
                event.stopPropagation(), event.preventDefault()
                break
            case "b": if (!event.ctrlKey) { break }; can.CloneInput(); break
            case "m": if (!event.ctrlKey) { break }; can.CloneField(); break
        }
    },
    onkeyup: function(event, can) {
        switch (event.key) {
            case "Enter":
                if (can.Conf("type") == "textarea") { break }
                event.stopPropagation(), event.preventDefault()
                break
        }
    },
})
Volcanos("onexport", {help: "导出数据", list: []})

