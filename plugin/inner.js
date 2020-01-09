Volcanos("onimport", {help: "导入数据", list: [],
    init: function(can, msg, cb, output, option) {output.innerHTML = msg.Result();
        can.page.Select(can, output, "table", function(table) {can.page.OrderTable(can, table)})
        can.page.Select(can, output, ".story", function(story) {var data = story.dataset||{};
            story.oncontextmenu = function(event) {var detail = can.feature.detail || can.ondetail.list;
                switch (data.type) {
                    case "shell":
                        detail = ["运行"]
                }

                can.user.carte(event, shy("", can.ondetail, detail, function(event, cmd, meta) {var cb = meta[cmd];
                    typeof cb == "function"? cb(event, can, msg, cmd, story):
                        can.run(event, ["story", typeof cb == "string"? cb: cmd, data.type, data.name, data.text], function(msg) {

                            var timer = msg.Result()? can.user.toast(msg.Result()): can.user.toast({
                                duration: -1, text: cmd, width: 800, height: 400,
                                list: [{type: "table", list: [{row: msg.append, sub: "th"}].concat(msg.Table(function(line, index) {
                                    return {row: can.core.List(msg.append, function(key) {return msg[key][index]})}
                                }))}, {button: ["关闭", function(event) {timer.stop = true}]}],
                            })
                        }, true)
                }))
            }
        })
    },
    favor: function(event, can, msg, cmd, output) {var key = msg.detail[0];
        var cb = can.onaction[key]; if (typeof cb == "function") {cb(event, can, msg, cmd, output); return msg.Echo(can._name, " onaction ", key), msg._hand = true}
        var cb = can.onchoice[key]; if (typeof cb == "function") {cb(event, can, msg, cmd, output); return msg.Echo(can._name, " onchoice ", key), msg._hand = true}
    },
})
Volcanos("onaction", {help: "组件交互", list: []})
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
Volcanos("ondetail", {help: "组件详情", list: []})
Volcanos("onexport", {help: "导出数据", list: []})


