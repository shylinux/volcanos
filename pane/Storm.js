Volcanos("onimport", {help: "导入数据", list: [],
    init: function(event, can, msg, cmd, output) {output.innerHTML = "";
        can.page.AppendItem(can, output, msg.Table(), can.user.Search(can, "storm"), function(event, line, item) {
            can.Export(event, line.key, "storm")
        })
    },
    layout: function(event, can, value, cmd, output) {
        can.Conf("layout", value)
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
        } else {
            can.Conf("storm", value)
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
Volcanos("onaction", {help: "组件交互", list: ["创建", "刷新", "共享"],
    "创建": function(event, can, meta, cmd, output) {
        can.Export(event, "create", "steam")
    },
    "刷新": function(event, can, meta, cmd, output) {
        can.run(event, [can.Conf("river")], function(msg) {
            can.onimport.init(event, can, msg, cmd, output)
        })
    },
    "共享": function(event, can, meta, cmd, output) {
        can.ondetail[cmd](event, can, meta, "", cmd, output)
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
Volcanos("ondetail", {help: "组件详情", list: ["共享", "保存", "恢复", "重命名", "删除"],
    "共享": function(event, can, line, value, cmd, item) {can.share || (can.share = {});
        var p = can.user.Share(can, {layout: can.Conf("layout"), river: can.Conf("river"), storm: can.Conf("storm")}, true)
        if (can.share[p]) {
            can.user.toast({duration: 10000, height: 300, text: p, list: [{img: [can.user.Share(can, {path: "/share/"+can.share[p]}, true)]}]});
        } else {
            can.run(event, [can.Conf("river"), can.Conf("storm"), "share", "qrcode", can.Conf("storm"), p], function(msg) {
                can.share[p] = msg.Result();
                can.user.toast({duration: 10000, height: 300, text: p, list: [{img: [can.user.Share(can, {path: "/share/"+msg.Result()}, true)]}]});
            })
        }
    },
    "重命名": function(event, can, line, value, cmd, item) {
        can.user.prompt("输入新名：", function(name) {
            can.run(event, [can.Conf("river"), value, "rename", name], function(msg) {
                can.run(event, [can.Conf("river")], function(msg) {
                    can.onimport.init(event, can, msg, cmd, can.output)
                })
            })
        })
    },
    "删除": function(event, can, line, value, cmd, item) {
        can.run(event, [can.Conf("river"), value, "remove"], function(msg) {
            can.run(event, [can.Conf("river")], function(msg) {
                can.onimport.init(event, can, msg, cmd, can.output)
            })
        })
    },
})
Volcanos("onexport", {help: "导出数据", list: []})

