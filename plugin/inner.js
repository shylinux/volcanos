Volcanos("onimport", {help: "导入数据", list: [],
    init: function(can, msg, cb, output, option) {output.innerHTML = msg.Result();
        can.page.Select(can, output, "svg", function(svg) {
            svg.onclick = function(event) {var item = event.target;
                switch (event.target.tagName) {
                    case "text":
                        can.user.toast(can.page.CopyText(can, item.innerHTML), "复制成功")
                        break
                    case "rect":
                        break
                }
            }
            svg.oncontextmenu = function(event) {var item = event.target;
                switch (event.target.tagName) {
                    case "text":
                        can.user.carte(event, shy("", can.ondetail, can.ondetail.list, function(event, key, meta) {cb = meta[key];
                            typeof cb == "function"? cb(event, can, msg, key, item, svg):
                                can.run(event, [typeof cb == "string"? cb: key, item], null, true)
                        }))
                        break
                    case "rect":
                        can.user.carte(event, shy("", can.ondetail, can.ondetail.list, function(event, key, meta) {cb = meta[key];
                            typeof cb == "function"? cb(event, can, msg, key, item, svg):
                                can.run(event, [typeof cb == "string"? cb: key, item], null, true)
                        }))
                        break
                }
            }
        })
    },
    favor: function(event, can, msg, cmd, output) {var key = msg.detail[0];
        var cb = can.onaction[key]; if (typeof cb == "function") {cb(event, can, msg, cmd, output); return msg.Echo(can._name, " onaction ", key), msg._hand = true}
        var cb = can.onchoice[key]; if (typeof cb == "function") {cb(event, can, msg, cmd, output); return msg.Echo(can._name, " onchoice ", key), msg._hand = true}
    },
})
Volcanos("onaction", {help: "组件交互", list: [],
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
Volcanos("ondetail", {help: "组件详情", list: ["选择", "修改", "复制"],
    "选择": "select",
    "删除": "delete",
    "复制": function(event, can, msg, key, svg) {
        can.user.toast(can.page.CopyText(can, svg.innerHTML), "复制成功")
    },
})
Volcanos("onexport", {help: "导出数据", list: []})


