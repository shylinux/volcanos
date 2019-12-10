Volcanos("onimport", {help: "导入数据", list: [],
    init: function(event, can, msg, key, output) {output.innerHTML = "";
        can.page.AppendItem(can, output, msg.Table(), can.user.Search(can, "storm"), function(event, line, item) {
            can.Export(event, line.key, "storm")
        })
    },
    river: function(event, can, value, key, output) {
        if (value == "update") {return}

        can.run(event, [value], function(msg) {
            can.onimport.init(event, can, msg, key, output)
        })
    },
})
Volcanos("onaction", {help: "组件交互", list: ["创建", "刷新"],
    "创建": function(event, can, meta, key, output) {
        can.Export(event, "create", "steam")
    },
    "刷新": function(event, can, meta, key, output) {
        can.run(event, [], function(msg) {
            can.onimport.init(event, can, msg, key, output)
        })
    },
})
Volcanos("onchoice", {help: "组件菜单", list: ["返回", "清空", "复制", "下载", "表格", "绘图", "媒体"],
    "返回": function(event, can, msg, key, target) {
        can.run(event, ["", "Last"])
    },
    "清空": function(event, can, msg, key, target) {
        can.target.innerHTML = "";
    },
    "复制": function(event, can, msg, key, target) {
        var list = can.onexport.Format(can, msg, "data");
        can.user.toast(can.page.CopyText(can, list[2]), "复制成功")
    },
    "下载": function(event, can, msg, key, target) {
        var list = can.onexport.Format(can, msg, msg._plugin_name||"data");
        can.page.Download(can, list[0]+list[1], list[2]);
    },
})
Volcanos("ondetail", {help: "组件详情", list: ["选择", "修改", "删除", "复制", "下载"],
    "选择": "select",
    "删除": "delete",
    "修改": function(event, can, msg, value, index, key, td) {
        var text = td.innerHTML;
        can.page.Appends(can, td, [{type: "input", style: {width: td.clientWidth+"px"}, data: {onkeydown: function(event) {
            if (event.key != "Enter") {return}
            can.run(event, [index, "modify", key == "value" && msg.key? msg[key][index]: key, event.target.value,], function(msg) {
                td.innerHTML = event.target.value;
                can.user.toast("修改成功")
            }, true)
        }}}])
    },
    "复制": function(event, can, msg, value, index, key, target) {
        can.user.toast(can.page.CopyText(can, target.innerHTML), "复制成功")
    },
    "下载": function(event, can, msg, value, index, key, target) {
        can.page.Download(can, key, target.innerHTML);
    },
})
Volcanos("onexport", {help: "导出数据", list: []})




