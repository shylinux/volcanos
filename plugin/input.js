Volcanos("onimport", {help: "导入数据", list: [],
    init: shy("添加控件", function(can, item, name, value, option) {
        var input = {type: "input", name: name, data: item};
        switch (item.type) {
            case "upfile": item.type = "file"; break
            case "select":
                item.values = typeof item.values == "string"? item.values.split(" "): item.values;
                input.type = "select", input.list = item.values.map(function(value) {
                    return {type: "option", value: value, inner: value};
                })
                item.value = value || item.value || item.values[0];
                can.page.ClassList.add(can, item, "args");
                break
            case "textarea":
                var half = parseFloat(item.half||"1")||1;
                input.type = "textarea", item.style = "height:"+(item.height||"50px")+";width:"+parseInt(((500-35)/half))+"px";
                // no break
            case "text":
                can.page.ClassList.add(can, item, "args");
                item.value = value || item.value || "";
                item.autocomplete = "off";
                break
        }
        can.page.ClassList.add(can, item, item.view);
        can.core.List((item.clist||"").split(" "), function(value) {
            can.page.ClassList.add(can, item, value);
        })

        var target = can.Dream(option, "input", input)[input.name];
        (item.type == "text" || item.type == "textarea") && !target.placeholder && (target.placeholder = item.name || "");
        item.type == "text" && !target.title && (target.title = item.placeholder || item.name || "");
        item.type == "button" && item.action == "auto" && can.run && can.run({});
        return target;
    }),
    path: function(event, can, value, cmd, target) {
        return target.value + (target.value == "" || target.value.endsWith("/")? "": "/") + value
    },
})
Volcanos("onaction", {help: "控件交互", list: [],
    onclick: function(event, can) {can.Select(event); can.item.type == "button" && can.run(event)},
    onkeydown: function(event, can) {
        can.page.oninput(event, can)

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

