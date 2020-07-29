Volcanos("onimport", {help: "导入数据", list: [],
    init: function(can, msg, cb, output, action, option) {output.innerHTML = "";
        var table = can.page.AppendTable(can, output, msg, msg.append, function(event, value, key, index, tr, td) {
            can.ondetail["复制"](event, can, msg, value, index, key, td);
            can.Export(event, value.trim(), key, index)
        }, function(event, value, key, index, tr, td) {
            can.user.carte(event, shy("上下文菜单", can.ondetail, msg["field.detail"] || can.feature.detail || can.ondetail.list, function(event, cmd, meta) {var cb = meta[cmd];
                var sub = can.Event(event);
                msg.append.forEach(function(key) {sub.Option(key, msg[key][index].trim())})

                typeof cb == "function"? cb(event, can, msg, index, key, cmd, td):
                    can.run(event, ["action", typeof cb == "string"? cb: cmd, key, value.trim(), msg.Ids(index)], function(msg) {
                        can.user.toast(msg.Result())
                        if (msg.Option("field.reload") == "true") {
                            can.run(event)
                        }
                    }, true)
            }))
        });

        if (msg.Option("render") != "" && msg.result) {
            var story = can.page.Append(can, output, [{view: [msg.Option("render"), "div", msg.Result()]}]).first;
            can.page.Select(can, story, ".story", function(item) {var data = item.dataset;
                switch (item.tagName) {
                    case "FIELDSET":
                        can.Plugin(can, data.name, JSON.parse(data.meta||"{}"), function(event, cmds, cb, silent) {
                            can.run(event, ["action", "story", data.type, data.name, data.text].concat(cmds), cb, true)
                        }, item, function(sub) {

                        })
                        break
                }
            })
        } else {
            switch (msg._xhr.getResponseHeader("content-type")) {
                case "image/png":
                    if (msg._xhr.responseType != "blob") {
                        break
                    }
                    var str = URL.createObjectURL(new Blob([msg._xhr.response], {type: "image/png"}));
                    can.page.Append(can, output, [{img: [str]}])
                    break

                default:
                    msg.result && can.page.Append(can, output, [{view: ["code", "div"], list: [
                        {view: ["code", "pre", can.page.Display(msg.Result())]},
                    ]}]).code;
            }
        }
        return typeof cb == "function" && cb(msg);
    },
})
Volcanos("onaction", {help: "组件交互", list: []})
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
Volcanos("ondetail", {help: "组件详情", list: ["渲染", "选择", "编辑", "删除", "复制", "下载", "收藏"],
    "渲染": function(event, can, msg, index, key, cmd, td) {
        can._story = can._story || can.Plugin(can, msg.name[index], {inputs: [
            {_input: "button", name: "喜欢"},
            {_input: "button", name: "讨厌"},
            {_input: "button", name: "查看"},
            {_input: "button", name: "关闭"},
        ]}, function(event, cmds, cb, silent) {
            var req = can.Event(event)
            switch (req.Option("_action")) {
                case "关闭":
                    can.page.Remove(can, can._story.target)
                    delete(can._story)
                    break
                default:
                    req.Option("pod", "");
                    can.run(event, ["set", msg.pod[index], msg.engine[index], msg.favor[index], msg.id[index],
                        msg.type[index], msg.name[index], msg.text[index]], function(res) {
                            can._story.Show(res.Option("display")||"table", res, cb)
                    }, true)
            }
        }, can.page.AppendField(can, document.body, "story", {name: msg.type[index], help: msg.name[index]}), function(plugin) {
            can.page.Modify(can, plugin.target, {style: {position: "absolute", left: "10px", top: "100px"}})
        })
        can._story.Runs(event)
    },
    "选择": "select",
    "删除": "delete",
    "编辑": function(event, can, msg, index, key, cmd, td) {
        var text = td.innerHTML;
        var input = can.page.Appends(can, td, [{type: "input", value: text, style: {width: td.clientWidth+"px"}, data: {onkeydown: function(event) {
            if (event.key != "Enter") {return}
            if (key == "value" && msg.key) {key = msg.key[index]}

            var sub = can.Event(event);
            can.core.List(msg.append, function(key) {sub.Option(key, msg[key][index])})
            can.run(event, ["action", "modify", key, event.target.value, text, can.Option("id")||msg.Ids(index)], function(msg) {
                td.innerHTML = event.target.value;
                can.user.toast(msg.Result()||"修改成功")
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
    "收藏": function(event, can, msg, index, key, cmd, target) {
        can.user.input(event, can, [
            {_input: "text", name: "favor", value: can._last_favor||""},
            {_input: "text", name: "type", value: msg.type && msg.type[index] || ""},
            {_input: "text", name: "name", value: msg.name && msg.name[index] || ""},
            {_input: "text", name: "text", value: msg.text && msg.text[index] || ""},
        ], function(event, cmd, meta, list) {can._last_favor = meta.favor;
            can.run(event, ["action", "favor", meta.favor, meta.type, meta.name, meta.text], function(msg) {
                can.user.toast(msg.Result()||"收藏成功");
            }, true)
        })
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
