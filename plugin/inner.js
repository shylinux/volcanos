Volcanos("onimport", {help: "导入数据", list: [],
    init: shy("添加控件", function(can, msg, cb, output, action, option) {output.innerHTML = ""
        can.page.AppendTable(can, output, msg, msg.append, function(event, value, key, index, tr, td) {
            can.Export(event, value.trim(), key, index)
        }) || (output.innerHTML = msg.Result())
    }),
})
Volcanos("onaction", {help: "控件交互", list: []})
Volcanos("onchoice", {help: "控件菜单", list: []})
Volcanos("ondetail", {help: "控件详情", list: []})
Volcanos("onexport", {help: "导出数据", list: []})


