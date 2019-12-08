Volcanos("onimport", {help: "导入数据", list: [],
    init: function(can, msg, cb, target, option) {target.innerHTML = ""
        var table = can.page.AppendTable(can, target, msg, msg.append)
        table.onclick = function(event) {
            switch (event.target.tagName) {
                case "TD":
                    can.onimport.which(event, table, msg.append, function(index, key) {
                        can.onexport["复制"](event, can, msg, td.innerHTML)
                    })
                    break
                case "TH":
                case "TR":
                case "TABLE":
            }
        }
        table.oncontextmenu = function(event) {var target = event.target;
            switch (event.target.tagName) {
                case "TD":
                    can.onimport.which(event, table, msg.append, function(index, key) {
                        can.user.carte(event, shy("", can.ondetail, can.ondetail.list, function(event, value, meta) {
                            var cb = meta[value];
                            typeof cb == "function"? cb(event, can, msg, value, index, key, target):
                                can.run(event, typeof cb == "string"? cb: value, index, key, target)
                        }))
                    })
                case "TH":
                case "TR":
                case "TABLE":
                    can.user.carte(event, shy("", can.onchoice, can.onchoice.list, function(event, value, meta) {
                        var cb = meta[value];
                        typeof cb == "function"? cb(event, can, msg, value, target):
                            can.run(event, typeof cb == "string"? cb: value, target)
                    }))
            }
            event.stopPropagation()
            event.preventDefault()
        }
        typeof cb == "function" && cb(msg);
    },
    which: function(event, table, list, cb) {if (event.target == table) {return cb(-1, "")}
        can.page.Select(can, table, "tr", can.core.List, function(tr, index) {if (event.target == tr) {return cb(index, "")}
            can.page.Select(can, tr, "th,td", can.core.List, function(td, order) {
                if (event.target == td) {return cb(index, list[order])}
            })
        })
    },
})
Volcanos("onaction", {help: "组件交互", list: [],
})
Volcanos("onchoice", {help: "组件菜单", list: ["返回", "清空", "复制", "下载", "表格", "绘图", "媒体"],
    void: function(event, can, msg, value) {
        can.run(event, [value])
    },
    "清空": function(event, can, msg, value, target) {
        target.innerHMTL = ""
    },
    "复制": function(event, can, msg, value, target) {
        can.onexport["复制"](event, can, msg, msg.result && msg.result.join() || "")
    },
    "下载": function(event, can, msg, value, target) {
        can.onexport["下载"](event, can, msg, "hi", msg.result && msg.result.join() || "")
    },
})
Volcanos("ondetail", {help: "组件详情", list: ["选择", "修改", "删除", "复制", "下载"],
    void: function(event, can, msg, value, index, key, target) {
        can.run(event, [value, index, key, msg[key][index]])
    },
    "选择": "select",
    "修改": "modify",
    "删除": "delete",
    "修改": function(event, can, msg, value, index, key, target) {
        var text = target.innerHTML
        target.innerHTML = "hi"
    },
    "复制": function(event, can, msg, value, index, key, target) {
        can.onexport["复制"](event, can, msg, msg[key][index])
    },
    "下载": function(event, can, msg, value, index, key, target) {
        can.onexport["下载"](event, can, msg, "hi", msg[key][index])
    },
})
Volcanos("onexport", {help: "导出数据", list: ["复制", "下载"],
    "复制": function(event, can, msg, value) {
        can.Log(event, can, msg, value)
    },
    "下载": function(event, can, msg, name, value) {
        can.Log(event, can, msg, name, value)
    },
})

