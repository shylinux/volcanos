Volcanos("onimport", {help: "导入数据", list: [],
    init: function(event, can, msg, cmd, output) {output.innerHTML = "";
        can.page.AppendItem(can, output, msg.Table(), can.user.Search(can, "storm"), function(event, line, item) {
            can.Export(event, line.key, "storm")
        })
    },
    river: function(event, can, value, cmd, output) {
        if (value == "update") {return}
        can.run(event, [can.Conf("river", value)], function(msg) {
            can.onimport.init(event, can, msg, cmd, output)
        })
    },
    storm: function(event, can, value, cmd, output) {
        if (value == "update") {
            can.run(event, [can.Conf("river")], function(msg) {
                can.onimport.init(event, can, msg, cmd, output)
            })
        }
    },
    favor: function(event, can, msg, cmd, output) {
        can.page.Select(can, output, "div.item.k"+msg.detail[0], function(item) {
            msg.Echo("storm", msg.detail[0])
            item.click(), msg._hand = true;
        })
    },
})
Volcanos("onaction", {help: "组件交互", list: ["创建", "刷新"],
    "创建": function(event, can, meta, cmd, output) {
        can.Export(event, "create", "steam")
    },
    "刷新": function(event, can, meta, cmd, output) {
        can.run(event, [can.Conf("river")], function(msg) {
            can.onimport.init(event, can, msg, cmd, output)
        })
    },
})
Volcanos("onchoice", {help: "组件菜单", list: ["返回", "清空", "复制", "下载", "表格", "绘图", "媒体"],
    "返回": function(event, can, msg, cmd, target) {
        can.run(event, ["", "Last"])
    },
    "清空": function(event, can, msg, cmd, target) {
        can.target.innerHTML = "";
    },
    "复制": function(event, can, msg, cmd, target) {
        var list = can.onexport.Format(can, msg, "data");
        can.user.toast(can.page.CopyText(can, list[2]), "复制成功")
    },
    "下载": function(event, can, msg, cmd, target) {
        var list = can.onexport.Format(can, msg, msg._plugin_name||"data");
        can.page.Download(can, list[0]+list[1], list[2]);
    },
})
Volcanos("ondetail", {help: "组件详情", list: ["保存", "恢复", "删除"],
    "删除": function(event, can, line, value, cmd, item) {
        can.run(event, [can.Conf("river"), "delete", value], function(msg) {
            can.run(event, [can.Conf("river")], function(msg) {
                can.onimport.init(event, can, msg, cmd, can.output)
            })
        })
    },
})
Volcanos("onexport", {help: "导出数据", list: []})

