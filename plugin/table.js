Volcanos("onimport", {help: "导入数据", list: [],
    init: function(can, msg, cb, output, action, option) {output.innerHTML = "";
        if (!msg.append || msg.append.length == 0) {
            var code = can.page.Append(can, output, [{view: ["code", "div", msg.Result()]}]).code;
            return typeof cb == "function" && cb(msg), code;
        }

        var table = can.page.AppendTable(can, output, msg, msg.append);
        table.onclick = function(event) {switch (event.target.tagName) {
            case "TD":
                can.onimport.which(event, table, msg.append, function(index, key) {
                    can.ondetail["复制"](event, can, msg, event.target.innerHTML, index, key, event.target);
                    can.Export(event, event.target.innerHTML.trim(), key, index)
                })
                break
            case "TH":
                break
            case "TR":
            case "TABLE":
        }}
        table.oncontextmenu = function(event) {var target = event.target;
            switch (event.target.tagName) {
                case "TD":
                    can.onimport.which(event, table, msg.append, function(index, key) {
                        can.user.carte(event, shy("", can.ondetail, can.feature.detail || can.ondetail.list, function(event, cmd, meta) {var cb = meta[cmd];
                            var id = msg.Ids(index);
                            var sub = can.Event(event);
                            msg.append.forEach(function(key) {sub.Option(key, msg[key][index].trim())})
                            typeof cb == "function"? cb(event, can, msg, index, key, cmd, target):
                                can.run(event, ["action", typeof cb == "string"? cb: cmd, key, target.innerHTML, id], function(msg) {
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
        can.page.Select(can, table, "tr", function(tr, index) {if (event.target == tr) {return cb(tr.dataset.index, "")}
            can.page.Select(can, tr, "th,td", function(td, order) {
                if (event.target == td) {return cb(tr.dataset.index, list[order])}
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
Volcanos("ondetail", {help: "组件详情", list: ["选择", "编辑", "删除", "复制", "下载"],
    "选择": "select",
    "删除": "delete",
    "编辑": function(event, can, msg, index, key, cmd, td) {
        var text = td.innerHTML;
        var input = can.page.Appends(can, td, [{type: "input", value: text, style: {width: td.clientWidth+"px"}, data: {onkeydown: function(event) {
            if (event.key != "Enter") {return}
            if (key == "value" && msg.key) {key = msg.key[index]}
            can.run(event, ["action", "modify", key, event.target.value, text, msg.Ids(index)], function(msg) {
                td.innerHTML = event.target.value;
                can.user.toast("修改成功")
            }, true)
        }}}]).first;
        input.focus();
        input.setSelectionRange(0, input.value.length);
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

