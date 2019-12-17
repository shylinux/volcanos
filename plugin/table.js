Volcanos("onimport", {help: "导入数据", list: [],
    init: function(can, msg, cb, output, option) {output.innerHTML = "";
        if (!msg.append || msg.append.length == 0) {
            var code = can.page.Append(can, output, [{view: ["code", "div", msg.Result()]}]).code;
            return typeof cb == "function" && cb(msg), code;
        }

        var table = can.page.AppendTable(can, output, msg, msg.append);
        table.onclick = function(event) {switch (event.target.tagName) {
            case "TD":
                can.onimport.which(event, table, msg.append, function(index, key) {
                    can.ondetail["复制"](event, can, msg, event.target.innerHTML, index, key, event.target);
                    can.Export(event, event.target.innerHTML, key, index)
                })
                break
            case "TH":
                var index = 0;
                can.page.Select(can, table, "th", function(item, i) {if (item == event.target) {index = i}})
                var dataset = event.target.dataset
                dataset["sort_asc"] = (dataset["sort_asc"] == "1") ? 0: 1
                can.page.RangeTable(can, table, index, dataset["sort_asc"] == "1")
                break
            case "TR":
            case "TABLE":
        }}
        table.oncontextmenu = function(event) {var target = event.target;
            switch (event.target.tagName) {
                case "TD":
                    can.onimport.which(event, table, msg.append, function(index, key) {
                        can.user.carte(event, shy("", can.ondetail, can.feature.detail || can.ondetail.list, function(event, cmd, meta) {var cb = meta[cmd];
                            var id = index;
                            msg && msg.id && (id = msg.id[index]);
                            typeof cb == "function"? cb(event, can, msg, index, key, cmd, target):
                                can.run(event, [id, typeof cb == "string"? cb: cmd, key, target.innerHTML], function(msg) {
                                    can.onimport.init(can, msg, cb, output, option)
                                }, true)
                        }))
                    })
                    event.stopPropagation()
                    event.preventDefault()
                    break
                case "TH":
                case "TR":
                case "TABLE":
            }
        }
        return typeof cb == "function" && cb(msg), table;
    },
    which: function(event, table, list, cb) {if (event.target == table) {return cb(-1, "")}
        can.page.Select(can, table, "tr", function(tr, index) {if (event.target == tr) {return cb(index-1, "")}
            can.page.Select(can, tr, "th,td", function(td, order) {
                if (event.target == td) {return cb(index-1, list[order])}
            })
        })
    },

    favor: function(event, can, msg, cmd, output) {var key = msg.detail[0];
        var cb = can.onaction[key]; if (typeof cb == "function") {cb(event, can, msg, cmd, output); return msg.Echo(can._name, " onaction ", key), msg._hand = true}
        var cb = can.onchoice[key]; if (typeof cb == "function") {cb(event, can, msg, cmd, output); return msg.Echo(can._name, " onchoice ", key), msg._hand = true}
    },
})
Volcanos("onaction", {help: "组件交互", list: [],
})
Volcanos("onchoice", {help: "组件菜单", list: ["返回", "清空", "复制", "下载"],
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
    "下载": function(event, can, msg, cmd, target) {msg = msg || can.msg;
        var list = can.onexport.Format(can, msg, msg._plugin_name||"data");
        can.page.Download(can, list[0]+list[1], list[2]);
    },
})
Volcanos("ondetail", {help: "组件详情", list: ["选择", "修改", "删除", "复制", "下载"],
    "选择": "select",
    "删除": "delete",
    "修改": function(event, can, msg, index, key, cmd, td) {
        var text = td.innerHTML;
        can.page.Appends(can, td, [{type: "input", style: {width: td.clientWidth+"px"}, data: {onkeydown: function(event) {
            if (event.key != "Enter") {return}
            can.run(event, [index, "modify", key == "value" && msg.key? msg[key][index]: key, event.target.value,], function(msg) {
                td.innerHTML = event.target.value;
                can.user.toast("修改成功")
            }, true)
        }}}])
    },
    "复制": function(event, can, msg, index, key, cmd, target) {
        can.user.toast(can.page.CopyText(can, target.innerHTML), "复制成功")
    },
    "下载": function(event, can, msg, index, key, cmd, target) {
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

