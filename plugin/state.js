Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, conf, list, cb, target) {
    },
    _process: function(can, msg, cmds, cb, silent) {
        return can.core.CallFunc([can.onimport, msg.Option("_process")], [can, msg, cmds, cb, silent])
    },
    _refresh: function(can, msg) {
        can.core.Timer(parseInt(msg.Option("_delay")||"500"), function() {
            var sub = can.request({}, {_count: parseInt(msg.Option("_count"))-1})
            can.onappend._output(can, can.Conf(), sub._event, can.Pack())
        })
        return true
    },
    _hold: function(can, msg) {
        return true
    },
    _back: function(can) {
        can._history.pop(); for (var his = can._history.pop(); his; his = can._history.pop()) {
            if (his[0] == "action") { continue }
            can.page.Select(can, can._option, "textarea.args,input.args,select.args", function(item, index) {
                item.value = his[index]||""
            }), can.onappend._output(can, can.Conf(), {}, can.Pack([]))
            break
        }
        return true
    },

    _progress: function(can, msg, cmds, cb, silent) {
        var size = msg.Append("size") || msg.Append("count")
        if (size != "" && size == msg.Append("total")) { return true }

        can.user.toast(can, {
            title: can._name+" "+msg.Append("step")+"% ", width: 400,
            content: "执行进度: "+can.base.Size(size||0)+"/"+can.base.Size(msg.Append("total")||"1000")+"\n"+msg.Append("name"),
            duration: 1100, progress: parseInt(msg.Append("step")),
        })

        can.page.Select(can, can._output, "td", function(td) {
            if (td.innerText == msg.Option("name")) {
                can.page.ClassList.add(can, td, "done")
            }
        })

        can.core.Timer(1000, function() {
            var res = can.request({}, {_progress: msg.Option("_progress")})
            return can.onappend._output(can, can.Conf(), res._event, can.Pack(cmds), cb, silent)
        })
        return true
    },
    _field: function(can, msg) {
        msg.Table(function(item) { can.onappend._plugin(can, item, {}, function(sub, meta) {
            sub.run = function(event, cmds, cb, silent) {
                var res = can.request(event); can.core.Item(can.Option(), function(key, value) {
                    res.Option(key) || res.Option(key, value)
                })
                can.run(event, (msg["_prefix"]||[]).concat(cmds), cb, true)
            }
        }) })
        return true
    },
    _open: function(can, msg) {
        can.user.open(msg.Option("_arg"))
        return true
    },
})
Volcanos("onaction", {help: "交互操作", list: ["保存参数", "清空参数", "共享工具", "刷新数据", "复制数据", "下载数据", "清空数据"], _init: function(can, msg, list, cb, target) {
    },
    "保存参数": function(event, can) { var meta = can.Conf()
        var msg = can.request(event, {river: can.Conf("river"), storm: can.Conf("storm"), id: meta.id})
        can.run(event, ["action", "modify", "arg", JSON.stringify(can.Pack([], true))], function(msg) {
            can.user.toast(can, "保存成功")
        })
    },
    "清空参数": function(event, can) {
        can.page.Select(can, can._option, '.args', function(item) { return item.value = "" })
    },
    "共享工具": function(event, can) { var meta = can.Conf()
        can.user.input(event, can, [{name: "name", value: meta.name}], function(event, button, data, list, args) {
            var msg = can.request(event, {arg: [
                "type", "field",
                "name", list[0], "text", JSON.stringify(can.Pack([], true)),
                "river", meta.ctx||meta.key||"", "storm", meta.index||meta.cmd||meta.name,
            ]})
            can.run(event, ["search", "Header.onaction.share"])
        })
    },
    "刷新数据": function(event, can) { var meta = can.Conf()
        can.onappend._output(can, meta, {}, can.Pack([], true))
    },
    "复制数据": function(event, can) { var meta = can.Conf(), msg = can._msg
        var res = [msg.append && msg.append.join(",")]; msg.Table(function(line, index, array) {
            res.push(can.core.Item(line, function(key, value) { return value }).join(","))
        })

        res.length > 1 && can.user.copy(event, can, res.join("\n"))
        msg.result && can.user.copy(event, can, msg.Result())
    },
    "下载数据": function(event, can) { var meta = can.Conf(), msg = can._msg
        var res = [msg.append && msg.append.join(",")]; msg.Table(function(line, index, array) {
            res.push(can.core.Item(line, function(key, value) { return value }).join(","))
        })

        res.length > 1 && can.user.download(can, URL.createObjectURL(new Blob([res.join("\n")])), meta.name+".csv")
        msg.result && can.user.download(can, URL.createObjectURL(new Blob([msg.Result()])), meta.name+".txt")
    },
    "清空数据": function(event, can) {
        can.onmotion.clear(can, can._output)
    },

    change: function(event, can, name, value, cb) {
        return can.page.Select(can, can._option, "input.args", function(input) {
            if (input.name == name && value != input.value) { input.value = value
                var data = input.dataset || {}; data.action == "auto" && can.onappend._output(can, can.Conf(), event, can.Pack(), cb)
                return input
            }
        })
    },
    upload: function(event, can) { can.user.upload(event, can) },

    scanQRCode: function(event, can, cmd) {
        can.user.agent.scanQRCode(function(text) { var cmds = ["action", cmd]
            var data = can.base.parseJSON(text)
            can.core.Item(data, function(key, value) { cmds.push(key, value) })
            if (data["auth"]) {
                if (can.user.confirm("auth "+data["auth"])) {
                    can.run(event, ["action", "auth", "space", data["auth"]])
                }
                return
            }
            can.run(event, cmds, function(msg) { can.user.toast(can, "添加成功"), can.run() }, true)
        }, can)
    },
    scanQRCode0: function(event, can) { can.user.agent.scanQRCode() },
    getClipboardData: function(event, can, cmd) {
        if (navigator.clipboard) {
            navigator.clipboard.readText().then(text => {
                can.run(event, can.base.Simple("action", cmd, can.base.parseJSON(text)), function(msg) {
                    can.user.toast(can, text, "添加成功"), can.run()
                }, true)
            }).catch((err) => { can.base.Log(err) })
            return
        } else {
            can.user.input(event, can, [{_input: "textarea"}], function(ev, button, data, list, args) {
                can.run(event, can.base.Simple("action", cmd, can.base.parseJSON(list[0])), function(msg) {
                    can.user.toast(can, list[0], "添加成功"), can.run()
                }, true)
            })
        }
    },
    getLocation: function(event, can, cmd) { var msg = can.request(can)
        can.user.agent.getLocation(function(res) { can.request(event, res)
            can.user.input(event, can, ["type", "name", "text", "latitude", "longitude"], function(ev, button, data, list, arg) {
                can.core.Item(res, function(key, value) { arg.push(key, value) })
                can.run(event, ["action", cmd].concat(arg), function(msg) {
                    can.user.toast(can, "添加成功"), can.run()
                }, true)
            })
        })
    },
    openLocation: function(event, can) { can.user.agent.openLocation(can.request(event)) },

    "参数": function(event, can) { can.page.Toggle(can, can._action) },
    "关闭": function(event, can) { can.page.Remove(can, can._target) },
    "清空": function(event, can, name) { can.onmotion.clear(can, can._output) },
})
Volcanos("onexport", {help: "导出数据", list: []})
