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
    favor: function(event, can, msg, cmd, output) {var key = msg.detail[0];
        if (msg._hand) {return}
        var cb = can.onaction[key]; if (typeof cb == "function") {cb(event, can, msg, cmd, output); return msg.Echo(can._name, " onaction ", key), msg._hand = true}
        var cb = can.onchoice[key]; if (typeof cb == "function") {cb(event, can, msg, cmd, output); return msg.Echo(can._name, " onchoice ", key), msg._hand = true}


        can.page.Select(can, output, "div.item.k"+msg.detail[0], function(item) {
            item.click(), msg._hand = true;
            msg.Echo(can._name, " ", key)
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
Volcanos("onchoice", {help: "组件菜单", list: ["创建", "刷新"],
    "创建": function(event, can, msg, cmd, output) {
        can.Export(event, "create", "steam")
    },
    "刷新": function(event, can, msg, cmd, output) {
        can.run(event, [can.Conf("river")], function(msg) {
            can.onimport.init(event, can, msg, cmd, output)
        })
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

