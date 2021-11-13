Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, conf, list, cb, target) {},
    _process: function(can, msg) {
        msg.OptionStatus() && can.onmotion.clear(can, can._status) && can.onappend._status(can, can.base.Obj(msg.OptionStatus()))
        return can.core.CallFunc([can.onimport, msg.OptionProcess()], [can, msg])
    },

    _location: function(can, msg) { location.href = msg._arg[0] },
    _rewrite: function(can, msg) {
        for (var i = 0; i < msg._arg.length; i += 2) {
            can.Option(msg._arg[i], msg._arg[i+1])
        }
        can.Update()
        return true
    },
    _refresh: function(can, msg) {
        can.core.Timer(parseInt(msg.Option("_delay")||"500"), function() {
            var sub = can.request({}, {_count: parseInt(msg.Option("_count"))-1})
            can.Update()
        })
        return true
    },
    _display: function(can, msg) {
        Volcanos("some", {}, [msg.Option(ice.MSG_DISPLAY)].concat(Volcanos.meta.libs, Volcanos.meta.volcano), function(sub) {
            sub.Conf(can.Conf()), sub.run = can.run
            sub._option = can._option
            sub._action = can._action
            sub.onimport._init(sub, msg, [], function() {}, can._output)
        })
        return true
    },
    _field: function(can, msg) {
        msg.Table(function(item) { can.onappend._plugin(can, item, {arg: can.base.Obj(item[ice.ARG], [])}, function(sub, meta) {
            var opt = can.base.Obj(item[ice.OPT], [])
            sub.Conf("height", can.Conf("height"))
            sub.Conf("width", can.Conf("width"))
            sub.run = function(event, cmds, cb, silent) {
                var res = can.request(event, can.Option())
                for (var i = 0; i < opt.length; i += 2) { res.Option(opt[i], opt[i+1]) }
                can.run(event, (msg[ice.MSG_PREFIX]||[]).concat(cmds), cb, true)
            }
        }) })
        return true
    },
    _inner: function(can, msg) {
        can.onappend.table(can, msg)
        can.onappend.board(can, msg)
        can.onmotion.story.auto(can)
        can.page.Modify(can, can._output, {style: {display: html.BLOCK}})
        return true
    },

    _open: function(can, msg) { can.user.open(msg.Option("_arg")); return true },
    _hold: function(can, msg) { return true },
    _back: function(can) {
        can._history.pop(); for (var his = can._history.pop(); his; his = can._history.pop()) {
            if (his[0] == ctx.ACTION) { continue }
            can.page.SelectArgs(can, can._option, "", function(item, index) { item.value = his[index]||"" }), can.Update()
            break
        }
        !his && can.Update()
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

})
Volcanos("onaction", {help: "交互操作", list: [
        "共享工具", "生成链接", "生成脚本", "保存参数", "清空参数", "刷新数据", [
            "其它 ->", "复制数据", "下载数据", "清空数据", "删除工具", "摄像头",
        ],
    ], _init: function(can, msg, list, cb, target) {},
    _engine: function(event, can, button) {
        can.Update(event, [ctx.ACTION, button].concat(can.Input([], true)))
    },
    "共享工具": function(event, can) { var meta = can.Conf()
        var ui = can.user.input(event, can, [{name: chat.TITLE, value: meta.name}], function(ev, button, data, list) {
            var msg = can.request(event, {arg: [kit.MDB_TYPE, chat.FIELD,
                kit.MDB_NAME, meta.index, kit.MDB_TEXT, JSON.stringify(can.Input([], true)),
                chat.TITLE, list[0], chat.RIVER, can.Conf(chat.RIVER), chat.STORM, can.Conf(chat.STORM),
            ]})
            can.search(event, ["Header.onaction.share"])
        }); can.onlayout.figure(event, can, ui._target, true)
    },
    "生成链接": function(event, can) { var meta = can.Conf()
        var pre = "/chat/cmd/"; if (can.user.mod.isPod) { pre = "/chat/pod/"+can.user.Search(can, ice.POD)+"/cmd/" }
        var args = can.Option(); args._path = pre+(meta.index||can.core.Keys(meta.ctx, meta.cmd))
        args._path.indexOf("/cmd/web.wiki.word") > -1 && (args = {_path: pre+args.path})
        var msg = can.request(event, {link: can.user.MergeURL(can, args)})
        can.search(event, ["Header.onaction.share"])
    },
    "生成脚本": function(event, can, button) { var conf = can.Conf()
        var args = (conf.index||"")+ice.SP+can.Input("", true).join(ice.SP)
        var list = [
            "export ctx_dev="+location.origin+"; ctx_temp=$(mktemp); curl -fsSL $ctx_dev -o $ctx_temp;"+
            " source $ctx_temp "+args, "ish_sys_dev_run_command "+args,
            "ish_sys_dev_run_action", "ish_sys_dev_run_source",
        ]
        var ui = can.user.toast(can, {title: button, duration: -1, width: -300,
            content: '<div class="story" data-type="spark", data-name="shell">'+
                '<label>$ </label>'+'<span>'+list.join("</span><br/><label>$ </label><span>")+'</span>'+'</div>',
            action: [cli.CLOSE],
        })
        can.onmotion.story.auto(can, ui._target)
    },
    "保存参数": function(event, can) { var meta = can.Conf()
        var msg = can.request(event, {river: can.Conf(chat.RIVER), storm: can.Conf(chat.STORM), id: meta.id})
        can.search(event, ["River.ondetail.保存参数"], function(msg) { can.user.toast(can, "保存成功") }, true)
    },
    "清空参数": function(event, can) {
        can.page.SelectArgs(can, can._option, "", function(item) { return item.value = "" })
    },
    "刷新数据": function(event, can) { can.Update({}, can.Input([], true)) },

    "复制数据": function(event, can) { var meta = can.Conf(), msg = can._msg
        var res = [msg.append && msg.append.join(",")]; msg.Table(function(line, index, array) {
            res.push(can.core.Item(line, function(key, value) { return value }).join(","))
        })

        res.length > 1 && can.user.copy(event, can, res.join(ice.SP))
        msg.result && can.user.copy(event, can, msg.Result())
    },
    "下载数据": function(event, can) { var meta = can.Conf(), msg = can._msg
        var res = [msg.append && msg.append.join(",")]; msg.Table(function(line, index, array) {
            res.push(can.core.Item(line, function(key, value) { return value }).join(","))
        })

        res.length > 1 && can.user.downloads(can, res.join("\n"), meta.name+".csv")
        msg.result && can.user.downloads(can, msg.Result(), meta.name+".txt")
    },
    "清空数据": function(event, can) { can.onmotion.clear(can, can._output) },
    "删除工具": function(event, can) { can.page.Remove(can, can._target) },

    "摄像头": function(event, can) {
        var constraints = {audio: false, video: {width: 200, height: 200}}
        var ui = can.page.Append(can, can._output, [{view: ctx.ACTION}, {view: "capture", list: [{type: "video", _init: function(item) {
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

    "参数": function(event, can) { can.onmotion.toggle(can, can._action) },
    clear: function(event, can, name) { can.onmotion.clear(can, can._output) },
    close: function(event, can) { can.page.Remove(can, can._target) },
    upload: function(event, can) { can.user.upload(event, can) },
    change: function(event, can, name, value, cb) {
        return can.page.SelectArgs(can, can._option, "", function(input) {
            if (input.name == name && value != input.value) { input.value = value
                var data = input.dataset||{}; can.Update(event, can.Input(), cb)
                return input
            }
        })
    },

    next: function(event, can) {
        can.Update(event, [ctx.ACTION, "next", can.Status("total")||0, can.Option("limit"), can.Option("offend")])
    },
    prev: function(event, can) {
        can.Update(event, [ctx.ACTION, "prev", can.Status("total")||0, can.Option("limit"), can.Option("offend")])
    },

    listTags: function(event, can, button) {
        var list = []
        can.core.List([
            can.base, can.core, can.misc, can.page, can.user,
            can.onengine, can.ondaemon,
            can.onappend, can.onlayout,
            can.onmotion, can.onkeypop,
        ], function(lib) {
            can.core.Item(lib, function(key, value) { if (!lib.hasOwnProperty(key)) { return }
                if (key.indexOf("_") == 0) { return }
                list.push({zone: lib._name, type: typeof value, name: key, text: can.base.isObject(value)? "": (value+"").split(ice.NL)[0], file: lib._path})
            })
        })
        var msg = can.request(event, {_handle: true, content: can.base.Format(list)})
        can.run(event, [button], function() {
            can.user.toast(can, "添加成功")
        })
    },
    getClipboardData: function(event, can, button) {
        function add(text) {
            can.run(event, can.base.Simple(ctx.ACTION, button, can.base.parseJSON(text)), function(msg) {
                can.user.toast(can, text, "添加成功"), can.Update()
            }, true)
        }
        if (navigator.clipboard) {
            navigator.clipboard.readText().then(add).catch(function(err) { can.misc.Log(err) })
        } else {
            can.user.input(event, can, [{type: "textarea", name: "text"}], function(ev, button, data, list, args) { add(list[0]) })
        }
    },
    getLocation: function(event, can, button) {
        can.user.agent.getLocation(function(data) { can.request(event, data)
            can.user.input(event, can, [kit.MDB_TYPE, kit.MDB_NAME, kit.MDB_TEXT, "latitude", "longitude"], function(ev, bu, data, list, args) {
                can.run(event, [ctx.ACTION, button].concat(can.base.Simple(args, data)), function(msg) {
                    can.user.toast(can, "添加成功"), can.Update()
                }, true)
            })
        })
    },
    openLocation: function(event, can) { can.user.agent.openLocation(can.request(event)) },

})
Volcanos("onexport", {help: "导出数据", list: []})

