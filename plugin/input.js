Volcanos("onimport", {help: "导入数据", list: [],
    init: shy("添加控件", function(can, item, name, value, option) {
        var input = {type: "input", name: name, data: item};
        item.action = item.action || item.value || "";
        item.figure = item.figure || item.value || "";
        item.cb = item.cb || item.value || "";
        item.name && item.name.indexOf("@") == 0 && (item.name = item.name.slice(1)) && (item.position = item.position || "opts")

        switch (item.type = item.type || item._type || item._input || "text") {
            case "upfile": item.type = "file"; break
            case "button":
                item.value = item.name || item.value;
                break
            case "select":
                item.values = typeof item.values == "string"? item.values.split(" "): item.values;
                if (!item.values && item.value) {
                    item.values = item.value.split("|")
                    item.value = item.values[0]
                }
                input.type = "select", input.list = item.values.map(function(value) {
                    return {type: "option", value: value, inner: value};
                })
                item.className || can.page.ClassList.add(can, item, item.position||"args");
                break
            case "textarea":
                input.type = "textarea"
                // no break
            case "password":
                // no break
            case "text":
                item.className || can.page.ClassList.add(can, item, item.position||"args");
                item.value = value || item.value || "";
                item.autocomplete = "off";
                break
        }

        if (item.value == "auto") {item.value = ""}
        item.figure && item.figure.indexOf("@") == 0 && (item.figure = item.figure.slice(1)) && can.require(["plugin/input/"+item.figure], function() {
            target.type != "button" && (target.value = "")
        })

        var target = can.Dream(option, "input", input)[input.name];
        item.type == "text" && !target.placeholder && (target.placeholder = item.name || "");
        item.type != "button" && !target.title && (target.title = item.placeholder || item.name || "");
        item.type == "textarea" && can.page.Append(can, option, [{type: "br"}])
        item.type == "select" && (target.value = value || item.value || item.values[item.index||0])
        item.type == "button" && item.action == "auto" && can.run && can.run({});
        return target;
    }),
    path: function(event, can, value, cmd, target) {
        return target.value + (target.value == "" || target.value.endsWith("/")? "": "/") + value
    },
})
Volcanos("onfigure", {help: "控件交互", list: []})
Volcanos("onaction", {help: "控件交互", list: [],
    onclick: function(event, can) {can.Select(event);
        var figure = can.onfigure[can.item.cb] || can.onfigure[can.item.figure]
        figure? can.page.AppendFigure(event, can, can.item.figure, can._name) && figure.click(event, can, can.item, can.item.name, event.target, can.figure):
            can.item.type == "button" && can.run(event)
    },
    onchange: function(event, can) {
        can.item.type == "select" && can.item.action == "auto" && can.Runs(event)
    },
    onkeydown: function(event, can) {
        if (event.target.tagName == "TEXTAREA") {return}

        can.page.oninput(event, can, function(event) {
            switch (event.key) {
                case "b":
                    can.Append(event)
                    return true
                case "m":
                    can.Clone(event)
                    return true
            }
        })

        switch (event.key) {
            case "Enter": can.run(event, []); break
            case "Escape": event.target.blur(); break
            default:
                if (event.target.value.endsWith("j") && event.key == "k") {
                    can.page.DelText(event.target, event.target.selectionStart-1, 2);
                    event.target.blur();
                    break
                }
                return false
        }
        event.stopPropagation()
        event.preventDefault()
        return true
    },
    onkeyup: function(event, can) {
        if (event.target.tagName == "TEXTAREA") {return}

        switch (event.key) {
            default: return false
        }
        event.stopPropagation()
        event.preventDefault()
        return true
    },
})
Volcanos("onchoice", {help: "控件菜单", list: ["全选", "复制", "清空"],
    "全选": function(event, can, msg, value, target) {
        can.target.focus(), can.target.setSelectionRange(0, can.target.value.length);
    },
    "复制": function(event, can, msg, value, target) {
        can.user.toast(can.page.CopyText(can, can.target.value), "复制成功")
    },
    "清空": function(event, can, msg, value, target) {
        can.target.value = "";
    },
})
Volcanos("ondetail", {help: "控件详情", list: []})
Volcanos("onexport", {help: "导出数据", list: []})

