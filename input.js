Volcanos("onimport", {help: "导入数据", list: [],
    init: shy("添加控件", function(can, item, name, value, option) {
        var input = {type: "input", name: name, data: item}
        switch (item.type) {
            case "upfile": item.type = "file"; break
            case "select":
                item.values = kit.Trans(item.values)
                input.type = "select", input.list = item.values.map(function(value) {
                    return {type: "option", value: value, inner: value}
                })
                item.value = value || item.value || item.values[0]
                can.page.ClassList.add(can, item, "args")
                break
            case "textarea":
                var half = parseFloat(item.half||"1")||1
                input.type = "textarea", item.style = "height:"+(item.height||"50px")+";width:"+parseInt(((pane.target.clientWidth-35)/half))+"px"
                // no break
            case "text":
                can.page.ClassList.add(can, item, "args")
                item.value = value || item.value || ""
                item.autocomplete = "off"
                break
        }
        can.page.ClassList.add(can, item, item.view)
        can.core.List((item.clist||"").split(" "), function(value) {
            can.page.ClassList.add(can, item, value)
        })
        return can.Dream(option, "input", input)[input.name]
    }),
})
Volcanos("onaction", {help: "控件交互", list: [],
    onclick: function(event, can, type, option) {can.Select(event); type == "button" && can.run(event)},
})
Volcanos("onchoice", {help: "控件菜单", list: [],
})
Volcanos("ondetail", {help: "控件详情", list: [],
})
Volcanos("onexport", {help: "导出数据", list: [],
})

