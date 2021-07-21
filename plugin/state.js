var _can_name = "/plugin/state.js"
Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, conf, list, cb, target) {
    },
    _process: function(can, msg) {
        msg.OptionStatus() && can.onmotion.clear(can, can._status) && can.onappend._status(can, can.base.Obj(msg.OptionStatus()))
        return can.core.CallFunc([can.onimport, msg.OptionProcess()], [can, msg])
    },

    _rewrite: function(can, msg, _arg) { can.Option(msg._arg[0], msg._arg[1])
        can.onappend._output(can, can.Conf(), {}, can.Pack())
        return true
    },
    _refresh: function(can, msg) {
        can.core.Timer(parseInt(msg.Option("_delay")||"500"), function() {
            var sub = can.request({}, {_count: parseInt(msg.Option("_count"))-1})
            can.onappend._output(can, can.Conf(), sub._event, can.Pack())
        })
        return true
    },
    _field: function(can, msg) {
        msg.Table(function(item) { can.onappend._plugin(can, item, {arg: can.base.Obj(item["arg"], [])}, function(sub, meta) {
            var opt = can.base.Obj(item["opt"], [])
            sub.run = function(event, cmds, cb, silent) {
                var res = can.request(event); can.core.Item(can.Option(), function(key, value) {
                    res.Option(key) || res.Option(key, value)
                }); for (var i = 0; i < opt.length; i += 2) { res.Option(opt[i], opt[i+1]) }
                can.run(event, (msg["_prefix"]||[]).concat(cmds), cb, true)
            }
        }) })
        return true
    },
    _inner: function(can, msg) {
        can.onappend.table(can, msg)
        can.onappend.board(can, msg.Result())
        can.onmotion.story.auto(can)
        can.page.Modify(can, can._output, {style: {display: "block"}})
        return true
    },
    _hold: function(can, msg) { return true },
    _back: function(can) {
        can._history.pop(); for (var his = can._history.pop(); his; his = can._history.pop()) {
            if (his[0] == "action") { continue }
            can.page.Select(can, can._option, "textarea.args,input.args,select.args", function(item, index) {
                item.value = his[index]||""
            }), can.onappend._output(can, can.Conf(), {}, can.Pack())
            break
        }
        !his && can.onappend._output(can, can.Conf(), {}, can.Pack())
        return true
    },

    _grow: function(can, str) {
        if (can.page.Select(can, can._output, "div.code", function(div) {
            can.page.Modify(can, div, {style: {"max-height": 400}})
            can.page.Append(can, div, [{text: [str]}])
            div.scrollBy(0, 10000)
            return true
        }).length == 0) {
            can.onappend.board(can, str)
        }
        // can.onmotion.story.auto(can, can._output)
    },

    _open: function(can, msg) {
        can.user.open(msg.Option("_arg"))
        return true
    },
})
Volcanos("onaction", {help: "交互操作", list: [
        "保存参数", "清空参数", "共享工具", "生成链接", "刷新数据", ["其它 ->", "删除工具", "清空数据", "复制数据", "下载数据", "摄像头"],
        ], _init: function(can, msg, list, cb, target) {
    },
    _engine: function(event, can, button) {
        can.onappend._output(can, can.Conf(), event, ["action", button].concat(can.Pack([], true)))
    },
    "保存参数": function(event, can) { var meta = can.Conf()
        var msg = can.request(event, {river: can.Conf("river"), storm: can.Conf("storm"), id: meta.id})
        can.search(event, ["River.ondetail.保存参数"], function(msg) {
            can.user.toast(can, "保存成功")
        }, true)
    },
    "清空参数": function(event, can) {
        can.page.Select(can, can._option, '.args', function(item) { return item.value = "" })
    },
    "共享工具": function(event, can) { var meta = can.Conf()
        var ui = can.user.input(event, can, [{name: "name", value: meta.name}], function(event, button, data, list, args) {
            var msg = can.request(event, {arg: [
                "type", "field",
                "name", list[0], "text", JSON.stringify(can.Pack([], true)),
                "river", meta.ctx||meta.key||"", "storm", meta.index||meta.cmd||meta.name,
            ]})
            can.search(event, ["Header.onaction.share"])
        })
        can.onlayout.figure(event, can, ui._target, true)
    },
    "生成链接": function(event, can) { var meta = can.Conf()
        var args = can.Option(); args._path = "/chat/cmd/"+meta.index
        var msg = can.request(event, {link: can.user.MergeURL(can, args)})
        can.search(event, ["Header.onaction.share"])
    },
    "删除工具": function(event, can) {
        can.page.Remove(can, can._target)
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

        res.length > 1 && can.user.downloads(can, res.join("\n"), meta.name+".csv")
        msg.result && can.user.downloads(can, msg.Result(), meta.name+".txt")
    },
    "清空数据": function(event, can) {
        can.onmotion.clear(can, can._output)
    },
    "摄像头": function(event, can) {
        var constraints = {audio: false, video: {width: 200, height: 200}}
        var ui = can.page.Append(can, can._output, [{view: "action"}, {view: "capture", list: [{type: "video", _init: function(item) {
            navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
                item.srcObject = stream, item.onloadedmetadata = function(e) {
                    item.play()
                }, ui.stream = stream
            }).catch(function(err) { console.log(err.name + ": " + err.message); })
        }}]}])

        can.onappend._action(can, ["关闭", "抓拍"], ui.action, {
            "抓拍": function(event) {
                var canvas = can.page.Append(can, ui.capture, [{type: "canvas", width: ui.video.offsetWidth, height: ui.video.offsetHeight}]).first
                canvas.getContext("2d").drawImage(ui.video, 0, 0)
                can.page.Append(can, ui.capture, [{img: canvas.toDataURL('image/png'), style: {width: ui.video.offsetWidth, height: ui.video.offsetHeight}}])
                can.page.Remove(can, canvas)
            },
            "关闭": function(event) {
                can.core.List(ui.stream.getTracks(), function(track) { track.stop() })
                can.page.Remove(can, ui.action)
                can.page.Remove(can, ui.video)
                can.page.Remove(can, ui.capture)
            },
        })
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
            }).catch((err) => { can.misc.Log(err) })
            return
        } else {
            can.user.input(event, can, [{type: "textarea"}], function(ev, button, data, list, args) {
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

    "参数": function(event, can) { can.onmotion.Toggle(can, can._action) },
    "关闭": function(event, can) { can.page.Remove(can, can._target) },
    "清空": function(event, can, name) { can.onmotion.clear(can, can._output) },
})
Volcanos("onexport", {help: "导出数据", list: []})
var _can_name = ""
