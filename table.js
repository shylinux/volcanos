Volcanos("onimport", {help: "导入数据", list: [],
    init: function(can, msg, cb, target, option) {target.innerHTML = "";
        var table = can.page.AppendTable(can, target, msg, msg.append);
        table.onclick = function(event) {
            switch (event.target.tagName) {
                case "TD":
                    can.onimport.which(event, table, msg.append, function(index, key) {
                        can.ondetail["复制"](event, can, msg, event.target.innerHTML, index, key, event.target);
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
                                can.run(event, [index, typeof cb == "string"? cb: value, key, target.innerHTML], null, true)
                        }))
                    })
                    break
                case "TH":
                case "TR":
                case "TABLE":
                    can.user.carte(event, shy("", can.onchoice, can.onchoice.list, function(event, value, meta) {
                        var cb = meta[value];
                        typeof cb == "function"? cb(event, can, msg, value, target):
                            can.run(event, [typeof cb == "string"? cb: value, target], null, true)
                    }))
            }
            event.stopPropagation()
            event.preventDefault()
        }
        typeof cb == "function" && cb(msg);
    },
    which: function(event, table, list, cb) {if (event.target == table) {return cb(-1, "")}
        can.page.Select(can, table, "tr", function(tr, index) {if (event.target == tr) {return cb(index, "")}
            can.page.Select(can, tr, "th,td", function(td, order) {
                if (event.target == td) {return cb(index, list[order])}
            })
        })
    },
})
Volcanos("onaction", {help: "组件交互", list: [],
})
Volcanos("onchoice", {help: "组件菜单", list: ["返回", "清空", "复制", "下载", "表格", "绘图", "媒体"],
    "清空": function(event, can, msg, value, target) {
        can.target.innerHTML = "";
    },
    "复制": function(event, can, msg, value, target) {
        var list = can.onexport.Format(can, msg, "data");
        can.user.toast(can.page.CopyText(can, list[2]), "复制成功")
    },
    "下载": function(event, can, msg, value, target) {
        var list = can.onexport.Format(can, msg, "data");
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
Volcanos("onexport", {help: "导出数据", list: [],
    Format: function(can, msg, name) {
        var ext = ".csv", txt = can.page.Select(can, can.target, "tr", function(tr) {
            return can.page.Select(can, tr, "td,th", function(td) {return td.innerText}).join(",")
        }).join("\n");

        !txt && (ext = ".txt", txt = msg.result && msg.result.join("") || "");
        return [name, ext, txt]
    },
})

